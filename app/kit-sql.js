/* =========================================================================
   Kit: sql — a real Postgres (PGlite, Postgres compiled to WebAssembly) running
   in the browser. Lesson fields:
     seed:     SQL run on load and on "Reset database" (CREATE TABLE / INSERT)
     files:    { 'query.sql': '-- starter' }     solution: { 'query.sql': '...' }
     checks:   [{ desc, sql, expect }]  optional: expect is a JSON value compared
               to the first column of the first row (or row count via {rows:n})
   ========================================================================= */
(function () {
  const { esc, store, workbench, toast } = PG;

  const PGLITE_URL = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3.6/dist/index.js';
  let pgliteModule = null;
  function loadPGlite() {
    if (!pgliteModule) pgliteModule = import(PGLITE_URL).then(m => m.PGlite);
    return pgliteModule;
  }

  /* one database per lesson id; recreated on reset */
  const dbs = {};
  async function getDb(lesson, fresh) {
    if (fresh && dbs[lesson.id]) { try { await dbs[lesson.id].close(); } catch (e) {} delete dbs[lesson.id]; }
    if (!dbs[lesson.id]) {
      const PGlite = await loadPGlite();
      const db = new PGlite();
      await db.waitReady;
      if (lesson.seed) await db.exec(lesson.seed);
      dbs[lesson.id] = db;
    }
    return dbs[lesson.id];
  }

  /* split a script into statements, respecting quotes and $$ bodies */
  function splitStatements(sql) {
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

  function fmtCell(v) {
    if (v === null || v === undefined) return '<i class="null">NULL</i>';
    if (v instanceof Date) return esc(v.toISOString().replace('T00:00:00.000Z', '').replace(/\.\d+Z$/, 'Z'));
    if (typeof v === 'object') return esc(JSON.stringify(v));
    return esc(String(v));
  }
  function table(res) {
    if (!res.fields || !res.fields.length) return `<div class="sql-ok">OK${res.affectedRows != null ? ` — ${res.affectedRows} row${res.affectedRows === 1 ? '' : 's'} affected` : ''}</div>`;
    const rows = res.rows || [];
    return `<table class="sql-table"><thead><tr>${res.fields.map(f => `<th>${esc(f.name)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${res.fields.map(f => `<td>${fmtCell(r[f.name])}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <div class="sql-count">${rows.length} row${rows.length === 1 ? '' : 's'}</div>`;
  }

  async function runSql(db, sql) {
    const stmts = splitStatements(sql);
    const results = [];
    for (const s of stmts) {
      try {
        const res = await db.query(s);
        results.push({ sql: s, res });
      } catch (e) {
        results.push({ sql: s, error: e.message });
        break;
      }
    }
    return results;
  }

  async function schema(db) {
    const t = await db.query(`select table_name, column_name, data_type from information_schema.columns where table_schema='public' order by table_name, ordinal_position`);
    const by = {};
    t.rows.forEach(r => { (by[r.table_name] = by[r.table_name] || []).push(`${r.column_name} <span class="dim">${r.data_type}</span>`); });
    const names = Object.keys(by);
    if (!names.length) return '<div class="dim">No tables yet</div>';
    return names.map(n => `<div class="sch-table"><b>${esc(n)}</b><div>${by[n].join('<br>')}</div></div>`).join('');
  }

  function mount(lesson, host) {
    let db = null, busy = false;
    const wb = workbench(host, lesson, {
      autoRun: false,
      names: Object.keys(lesson.files).length ? Object.keys(lesson.files) : ['query.sql'],
      output: `
        <div class="out-bar">
          <button class="btn primary" id="runBtn">▶ Run (⌘/Ctrl+Enter)</button>
          <button class="btn" id="resetDb" title="Rebuild the database from the lesson's seed">Reset database</button>
          ${lesson.checks && lesson.checks.length ? '<button class="btn" id="checkBtn">Check my work</button>' : ''}
          <span style="flex:1"></span>
          <span class="hint-inline" id="dbStatus">starting Postgres…</span>
        </div>
        <div class="sql-shell">
          <div class="sql-results" id="sqlResults"><div class="dim" style="padding:12px">Write SQL on the left and press Run. Each statement's result appears here.</div></div>
          <div class="sql-schema"><div class="console-head">Tables</div><div id="sqlSchema" class="sch"></div></div>
        </div>
        ${lesson.checks && lesson.checks.length ? `<div class="checks" id="checks">${lesson.checks.map((c, i) => `<div class="check" data-i="${i}"><span class="tick">○</span> ${c.desc}</div>`).join('')}</div>` : ''}`,
      onRun: files => run(files),
    });
    const results = host.querySelector('#sqlResults'), status = host.querySelector('#dbStatus');
    const setStatus = (t, cls) => { status.textContent = t; status.className = 'hint-inline ' + (cls || ''); };

    async function ensureDb(fresh) {
      try {
        setStatus(fresh ? 'resetting…' : 'starting Postgres…');
        db = await getDb(lesson, fresh);
        setStatus('Postgres ready', 'ok');
        host.querySelector('#sqlSchema').innerHTML = await schema(db);
      } catch (e) {
        setStatus('Postgres failed to load — are you online? (' + e.message + ')', 'bad');
      }
    }
    async function run(files) {
      if (!db || busy) return;
      busy = true;
      const sql = (files || wb.readFiles())['query.sql'] || Object.values(files || wb.readFiles())[0] || '';
      const sel = Object.values(wb.editors)[0].getSelection();
      const out = await runSql(db, sel.trim() ? sel : sql);
      results.innerHTML = out.map(r => `
        <div class="sql-result ${r.error ? 'bad' : ''}">
          <pre class="sql-stmt">${esc(r.sql)}</pre>
          ${r.error ? `<div class="sql-err">ERROR: ${esc(r.error)}</div>` : table(r.res)}
        </div>`).join('') || '<div class="dim" style="padding:12px">No statements to run.</div>';
      host.querySelector('#sqlSchema').innerHTML = await schema(db);
      busy = false;
    }
    host.querySelector('#runBtn').onclick = () => run();
    host.querySelector('#resetDb').onclick = async () => { await ensureDb(true); toast('Database reset'); };
    const checkBtn = host.querySelector('#checkBtn');
    if (checkBtn) checkBtn.onclick = async () => {
      if (!db) return;
      for (const [i, c] of lesson.checks.entries()) {
        const el = host.querySelector(`.check[data-i="${i}"]`);
        try {
          const res = await db.query(c.sql);
          let ok;
          if (c.expect && typeof c.expect === 'object' && 'rows' in c.expect) ok = res.rows.length === c.expect.rows;
          else { const first = res.rows[0] ? res.rows[0][res.fields[0].name] : undefined; ok = JSON.stringify(first) === JSON.stringify(c.expect) || String(first) === String(c.expect); }
          el.classList.toggle('ok', ok); el.classList.toggle('bad', !ok);
          el.querySelector('.tick').textContent = ok ? '✓' : '✗';
        } catch (e) { el.classList.add('bad'); el.querySelector('.tick').textContent = '✗'; el.title = e.message; }
      }
    };
    ensureDb(false);
    return () => wb.destroy();
  }

  async function selftest(lesson) {
    const errors = [];
    try {
      const PGlite = await loadPGlite();
      const db = new PGlite(); await db.waitReady;
      if (lesson.seed) await db.exec(lesson.seed);
      const sql = (lesson.solution && (lesson.solution['query.sql'] || Object.values(lesson.solution)[0])) || '';
      const out = await runSql(db, sql);
      out.filter(r => r.error).forEach(r => errors.push(r.error + ' in: ' + r.sql.slice(0, 80)));
      for (const c of lesson.checks || []) { try { await db.query(c.sql); } catch (e) { errors.push('check failed to run: ' + e.message); } }
      await db.close();
    } catch (e) { errors.push(e.message); }
    return { ok: errors.length === 0, errors };
  }

  PG.registerKit('sql', { mount, selftest, tabLabel: 'SQL', splitStatements });
})();
