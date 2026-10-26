#!/usr/bin/env node
/* Validates lesson data files without a browser.
   Usage: node tools/validate.js [s24 s25 ...]   (default: every data/sNN.js)
   Checks structure per kind, then runs what it can:
     node:     runs the solution in the Node simulator and sends the smoke requests
     terminal: replays the solution commands and evaluates the checks
     react:    compiles every .jsx/.js file with Babel and resolves imports
     sql:      runs seed + solution + checks in PGlite (needs tools/node_modules)
     build/js: syntax-checks script.js, checks html/css are strings
   Exit code 1 when anything fails. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const NodeSim = require(path.join(ROOT, 'app/sandbox/node-runtime.js'));
const ShellSim = require(path.join(ROOT, 'app/sandbox/shell-sim.js'));
let PGlite = null; try { PGlite = require('@electric-sql/pglite').PGlite; } catch (e) {}
let Babel = null; try { Babel = require(path.join(ROOT, 'vendor/babel/babel.min.js')); } catch (e) {}
const ejs = require(path.join(ROOT, 'vendor/ejs/ejs.min.js'));
const bcrypt = require(path.join(ROOT, 'vendor/bcrypt/bcrypt.min.js'));
const qrcode = require(path.join(ROOT, 'vendor/qrcode/qrcode.js'));

const KINDS = ['build', 'js', 'react', 'node', 'sql', 'terminal', 'read', 'walkthrough'];
const LEGACY = { html: 'index.html', css: 'style.css', js: 'script.js' };
const mapFiles = f => { const o = {}; Object.keys(f || {}).forEach(k => { if (f[k] != null) o[LEGACY[k] || k] = f[k]; }); return o; };

const manifest = {};
fs.readFileSync(path.join(ROOT, 'content/manifest.txt'), 'utf8').split('\n').forEach(l => { if (l && !l.startsWith('#')) { const [i, id, title, type, mins] = l.split('|'); manifest[Number(i)] = { udemyId: Number(id), title, type, minutes: Number(mins) }; } });

function load(file) {
  const lessons = [];
  const src = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  const PG = { add: l => lessons.push(l), notes() {}, index() {}, registerKit() {} };
  new Function('PG', src)(PG);
  return lessons;
}

async function checkLesson(l, problems) {
  const p = m => problems.push(`${l.id || '?'}: ${m}`);
  ['id', 'section', 'slug', 'title'].forEach(k => { if (!l[k]) p(`missing ${k}`); });
  if (l.index == null) p('missing index (lecture number)');
  else if (!manifest[l.index]) p(`index ${l.index} is not a lecture`);
  else { const m = manifest[l.index]; if (l.udemyId && l.udemyId !== m.udemyId) p(`udemyId ${l.udemyId} does not match lecture ${l.index} (${m.udemyId})`); }
  if (l.section && l.index && manifest[l.index]) {
    const secOfLecture = sectionOfIndex(l.index);
    if (secOfLecture && l.section !== secOfLecture) p(`section ${l.section} but lecture ${l.index} is in ${secOfLecture}`);
  }
  if (!/^[a-z0-9-]+$/.test(l.slug || '')) p('slug should be lowercase letters, digits and dashes');
  const files = mapFiles(l.files), solution = l.solution && !Array.isArray(l.solution) ? mapFiles(l.solution) : l.solution;
  const kind = l.kind || (l.layout === 'js' || (Object.keys(files).length === 1 && files['script.js'] != null) ? 'js' : 'build');
  if (!KINDS.includes(kind)) p(`unknown kind ${kind}`);
  (l.tasks || []).forEach((t, i) => { if (typeof t !== 'string') p(`task ${i} is not a string`); });
  (l.quiz || []).forEach((q, i) => { if (!q.q || !Array.isArray(q.options) || q.options.length < 2 || typeof q.answer !== 'number' || q.answer >= q.options.length) p(`quiz ${i} malformed`); });
  (l.explore || []).forEach((d, i) => { if (!d.title || !d.html) p(`explore ${i} needs title and html`); });
  if (solution && !Array.isArray(solution)) Object.keys(solution).forEach(k => { if (files[k] === undefined && kind !== 'sql') p(`solution has ${k} but files does not`); });

  if (kind === 'build' || kind === 'js') {
    if (!Object.keys(files).length) p('build lesson has no files');
    const sol = Object.assign({}, files, solution || {});
    if (sol['script.js']) { try { new Function(sol['script.js']); } catch (e) { p(`solution script.js syntax: ${e.message}`); } }
    if (kind === 'build' && sol['index.html'] == null) p('build lesson has no index.html');
  }
  if (kind === 'react') {
    if (!Babel) return p('Babel not loadable for validation');
    const sol = Object.assign({}, files, solution || {});
    const entry = ['index.jsx', 'index.js', 'main.jsx', 'main.js', 'App.jsx', 'App.js'].find(n => sol[n] != null);
    if (!entry) p('react lesson has no index.jsx / index.js');
    Object.keys(sol).filter(n => /\.(jsx|js)$/.test(n)).forEach(n => {
      let code;
      try { code = Babel.transform(sol[n], { filename: n, presets: [['env', { modules: 'commonjs', targets: { chrome: '90' } }], 'react'], sourceType: 'module' }).code; }
      catch (e) { return p(`${n}: ${e.message.split('\n')[0]}`); }
      const re = /require\("([^"]+)"\)/g; let m;
      while ((m = re.exec(code))) {
        const spec = m[1];
        if (!spec.startsWith('.') && !spec.startsWith('/')) { if (!/^(react|react-dom|react-dom\/client|@mui\/|uuid)/.test(spec)) p(`${n} imports unknown package ${spec}`); continue; }
        const base = n.split('/').slice(0, -1).join('/');
        const norm = (base ? base + '/' + spec : spec).split('/').reduce((a, s) => { if (!s || s === '.') return a; if (s === '..') a.pop(); else a.push(s); return a; }, []).join('/');
        if (![norm, norm + '.jsx', norm + '.js', norm + '.json', norm + '/index.jsx', norm + '/index.js'].some(c => sol[c] != null)) p(`${n} imports ${spec} but no such file`);
      }
    });
  }
  if (kind === 'node') {
    if (!files['index.js'] && !(l.run || []).some(f => files[f])) p('node lesson needs index.js (or run: [...] entries)');
    const sol = Object.assign({}, files, solution || {});
    const logs = [], ports = [];
    let db = null;
    if (l.db) { if (!PGlite) p('db lesson but PGlite not installed in tools/ (npm install in tools/)'); else { db = new PGlite(); await db.waitReady; if (l.db.seed) await db.exec(l.db.seed); } }
    const answers = String(l.answers || '').split('\n').map(s => s.trim()).filter(Boolean);
    const sim = NodeSim.create({ files: sol, env: l.env || {}, host: { log: (k, t) => logs.push([k, t]), listening: port => ports.push(port), input: async q => answers.shift() || 'https://example.com', pg: () => db, modules: { ejs, bcrypt, qrcode } } });
    for (const entry of (l.run || ['index.js'])) await sim.run(entry);
    await new Promise(r => setTimeout(r, 50));
    logs.filter(x => x[0] === 'err').forEach(x => p(`solution error: ${x[1].split('\n')[0]}`));
    const smoke = l.smoke || (ports.length ? [{ method: 'GET', path: l.start || '/' }] : []);
    const jar = {};
    for (const s of smoke) {
      const port = s.port || l.port || ports[0] || 3000;
      const headers = Object.assign({}, s.headers || {}); if (Object.keys(jar).length) headers.cookie = Object.keys(jar).map(k => `${k}=${encodeURIComponent(jar[k])}`).join('; ');
      let body = s.body;
      if (body && typeof body === 'object') { body = new URLSearchParams(body).toString(); headers['content-type'] = 'application/x-www-form-urlencoded'; }
      if (s.json) { body = JSON.stringify(s.json); headers['content-type'] = 'application/json'; }
      const res = await sim.request({ method: s.method || 'GET', url: `http://localhost:${port}${s.path || '/'}`, headers, body });
      [].concat(res.headers && res.headers['set-cookie'] || []).forEach(c => { const parts = c.split(';').map(x => x.trim()); const nv = parts[0]; const i = nv.indexOf('='); const name = nv.slice(0, i);
        const expired = parts.some(x => /^expires=/i.test(x) && new Date(x.slice(8)) < new Date()) || parts.some(x => /^max-age=/i.test(x) && Number(x.slice(8)) <= 0);
        if (expired) delete jar[name]; else jar[name] = decodeURIComponent(nv.slice(i + 1)); });
      const want = s.expect || (res.status >= 300 && res.status < 400 ? res.status : 200);
      if (res.error) p(`${s.method || 'GET'} ${s.path}: ${res.error}`);
      else if (res.status !== want && !(want === 200 && res.status < 400)) p(`${s.method || 'GET'} ${s.path} → ${res.status} (expected ${want})`);
    }
    logs.filter(x => x[0] === 'err').slice(0, 3).forEach(x => { if (!problems.some(q => q.includes(x[1].split('\n')[0]))) p(`error during requests: ${x[1].split('\n')[0]}`); });
    if (db) await db.close();
  }
  if (kind === 'terminal') {
    const sh = ShellSim.create({ files: l.fs || {}, cwd: l.cwd || '/Users/you', remotes: l.remotes });
    sh.hooks.node = () => '';
    (Array.isArray(l.solution) ? l.solution : []).forEach(c => { const r = sh.run(c); if (/not found|No such file|fatal:|usage:|error:/.test(r.out || '')) p(`solution "${c}" → ${r.out.split('\n')[0]}`); });
    (l.checks || []).forEach(c => { try { const fn = new Function('fs', 'git', 'shell', c.test); if (!fn(sh.fs, pth => sh.gitInfo(pth), { cwd: sh.cwd, history: sh.history, home: sh.home })) p(`check fails after solution: ${c.desc}`); } catch (e) { p(`check throws: ${c.desc} — ${e.message}`); } });
  }
  if (kind === 'sql') {
    if (!PGlite) p('PGlite not installed in tools/ (run: cd tools && npm install)');
    else {
      const db = new PGlite(); await db.waitReady;
      try { if (l.seed) await db.exec(l.seed); } catch (e) { p(`seed: ${e.message}`); }
      const sql = (solution && (solution['query.sql'] || Object.values(solution)[0])) || '';
      for (const stmt of split(sql)) { try { await db.query(stmt); } catch (e) { p(`solution: ${e.message} in "${stmt.slice(0, 60)}"`); break; } }
      for (const c of (l.checks || [])) { try { const r = await db.query(c.sql); const first = r.rows[0] ? r.rows[0][r.fields[0].name] : undefined; const ok = c.expect && typeof c.expect === 'object' && 'rows' in c.expect ? r.rows.length === c.expect.rows : (JSON.stringify(first) === JSON.stringify(c.expect) || String(first) === String(c.expect)); if (!ok) p(`check "${c.desc}" got ${JSON.stringify(first)} expected ${JSON.stringify(c.expect)}`); } catch (e) { p(`check "${c.desc}": ${e.message}`); } }
      await db.close();
    }
  }
  if (kind === 'walkthrough') (l.steps || []).forEach((s, i) => { if (s.file && files[s.file] == null) p(`step ${i} refers to missing file ${s.file}`); });
  if ((kind === 'read' || kind === 'walkthrough') && l.index) { if (!fs.existsSync(path.join(ROOT, 'content/notes', String(l.index).padStart(3, '0') + '.json')) && !l.body) p('read lesson has no notes and no body'); }
}
function split(sql) {
  const out = []; let cur = '', q = null, i = 0;
  while (i < sql.length) {
    const c = sql[i], two = sql.slice(i, i + 2);
    if (!q && two === '--') { const j = sql.indexOf('\n', i); cur += sql.slice(i, j < 0 ? sql.length : j); i = j < 0 ? sql.length : j; continue; }
    if (!q && two === '/*') { const j = sql.indexOf('*/', i); i = j < 0 ? sql.length : j + 2; continue; }
    if (q) { cur += c; if (c === q[0] && (q.length === 1 || two === q)) { if (q === '$$') { cur += '$'; i++; } q = null; } i++; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; i++; continue; }
    if (two === '$$') { q = '$$'; cur += two; i += 2; continue; }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
let sectionBounds = null;
function sectionOfIndex(i) {
  if (!sectionBounds) { sectionBounds = []; let cur = null; fs.readFileSync(path.join(ROOT, 'content/manifest.txt'), 'utf8').split('\n').forEach(l => { const m = l.match(/^## (\d+)\./); if (m) cur = 's' + m[1].padStart(2, '0'); else if (l && !l.startsWith('#')) sectionBounds[Number(l.split('|')[0])] = cur; }); }
  return sectionBounds[i];
}

(async () => {
  const args = process.argv.slice(2);
  const files = fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^s\d\d(-2)?\.js$/.test(f)).filter(f => !args.length || args.some(a => f.startsWith(a))).sort();
  let total = 0, bad = 0;
  const allIds = new Set(), allIdx = new Set();
  for (const f of files) {
    let lessons;
    try { lessons = load(f); } catch (e) { console.log(`✗ ${f}: does not load — ${e.message}`); bad++; continue; }
    for (const l of lessons) {
      total++;
      const problems = [];
      if (allIds.has(l.id)) problems.push(`${l.id}: duplicate id`); allIds.add(l.id);
      const key = l.index != null ? String(l.index) + (l.sub || '') : null; if (key && allIdx.has(key)) problems.push(`${l.id}: lecture ${key} already has a lesson`); if (key) allIdx.add(key);
      try { await checkLesson(l, problems); } catch (e) { problems.push(`${l.id}: validator crashed — ${e.message}`); }
      if (problems.length) { bad++; console.log(`✗ ${f} ${l.index || ''}${l.sub || ''} ${l.title}\n    ` + problems.join('\n    ')); }
      else if (args.includes('-v')) console.log(`✓ ${f} ${l.index || ''}${l.sub || ''} ${l.title}`);
    }
  }
  if (!args.length || args.includes('--coverage')) {
    const missing = Object.keys(manifest).filter(i => !allIdx.has(String(i)));
    if (missing.length) console.log(`${missing.length} lectures without a lesson: ${missing.slice(0, 40).join(', ')}${missing.length > 40 ? ' …' : ''}`);
  }
  console.log(`${total} lessons checked, ${bad} with problems`);
  process.exit(bad ? 1 : 0);
})();
