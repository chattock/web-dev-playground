/* =========================================================================
   NodeSim — a small Node.js look-alike that runs the course's server code in
   the browser (inside a sandboxed iframe) or in Node for tools/validate.js.

   const sim = NodeSim.create({ files, host })
     files: { 'index.js': '...', 'views/index.ejs': '...', 'public/styles/main.css': '...' }
     host:  { log(kind, text), listening(port), input(question) → Promise<string>,
              fetch(url, init) → Promise<Response-like>, pg() → Promise<PGlite|null>,
              modules: { ejs, bcrypt, qrcode }, fileChanged(path, content) }
   await sim.run('index.js')                      runs a file (ESM or CommonJS)
   await sim.request({ method, url, headers, body })  → { status, headers, body }
   sim.servers[port], sim.fs, sim.env

   Supported modules: express, body-parser, ejs, path, url, fs, http, os,
   crypto, events, util, readline, axios, pg, bcrypt, md5, express-session,
   passport, passport-local, passport-google-oauth2(0), dotenv, morgan, cors,
   qr-image, inquirer, superheroes, supervillains, lodash, cookie-parser.
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NodeSim = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const ROOT = '/app';
  const MIME = { html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'application/javascript; charset=utf-8',
    mjs: 'application/javascript; charset=utf-8', json: 'application/json; charset=utf-8', txt: 'text/plain; charset=utf-8', svg: 'image/svg+xml',
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', ico: 'image/x-icon', ejs: 'text/html; charset=utf-8', xml: 'application/xml', md: 'text/markdown' };

  /* ---------------- path helpers ---------------- */
  function normalize(p) {
    const abs = p.startsWith('/'); const out = [];
    p.split('/').forEach(s => { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); });
    return (abs ? '/' : '') + out.join('/') || (abs ? '/' : '.');
  }
  function pjoin() { return normalize([].slice.call(arguments).filter(Boolean).join('/')); }
  function dirname(p) { const i = p.lastIndexOf('/'); return i <= 0 ? (i === 0 ? '/' : '.') : p.slice(0, i); }
  function basename(p, ext) { let b = p.slice(p.lastIndexOf('/') + 1); if (ext && b.endsWith(ext)) b = b.slice(0, -ext.length); return b; }
  function extname(p) { const b = basename(p); const i = b.lastIndexOf('.'); return i <= 0 ? '' : b.slice(i); }
  function resolveFrom(cwd, p) { return normalize(p.startsWith('/') ? p : cwd + '/' + p); }

  /* ---------------- tiny utilities ---------------- */
  function parseQuery(qs) {
    const out = {};
    if (!qs) return out;
    new URLSearchParams(qs).forEach((v, k) => {
      const m = k.match(/^(\w+)\[(\w*)\]$/);
      if (m) { out[m[1]] = out[m[1]] || (m[2] === '' ? [] : {}); if (Array.isArray(out[m[1]])) out[m[1]].push(v); else out[m[1]][m[2]] = v; return; }
      if (k in out) out[k] = [].concat(out[k], v); else out[k] = v;
    });
    return out;
  }
  function parseCookies(h) { const o = {}; (h || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); }); return o; }
  function uid(n) { let s = ''; for (let i = 0; i < (n || 24); i++) s += '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]; return s; }
  function pathToRegexp(path, end) {
    if (path instanceof RegExp) return { re: path, keys: [] };
    const keys = [];
    let src = String(path).replace(/\/$/, '').replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*|\*/g, '(.*)')
      .replace(/:(\w+)(\\\?)?/g, (m, k, opt) => { keys.push(k); return opt ? '([^/]*)?' : '([^/]+)'; });
    if (src === '') src = '';
    return { re: new RegExp('^' + src + (end ? '/?$' : '(?=/|$)'), 'i'), keys };
  }
  function md5(str) {   // compact MD5, for the course's "level 2" hashing lecture
    function R(n, c) { return (n << c) | (n >>> (32 - c)); }
    function A(x, y) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
    function C(q, a, b, x, s, t) { return A(R(A(A(a, q), A(x, t)), s), b); }
    function F(a, b, c, d, x, s, t) { return C((b & c) | (~b & d), a, b, x, s, t); } function G(a, b, c, d, x, s, t) { return C((b & d) | (c & ~d), a, b, x, s, t); }
    function H(a, b, c, d, x, s, t) { return C(b ^ c ^ d, a, b, x, s, t); } function I(a, b, c, d, x, s, t) { return C(c ^ (b | ~d), a, b, x, s, t); }
    const u = unescape(encodeURIComponent(str)); const n = ((u.length + 8) >> 6) + 1; const x = new Array(n * 16).fill(0);
    for (let i = 0; i < u.length; i++) x[i >> 2] |= u.charCodeAt(i) << ((i % 4) * 8);
    x[u.length >> 2] |= 0x80 << ((u.length % 4) * 8); x[n * 16 - 2] = u.length * 8;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const oa = a, ob = b, oc = c, od = d;
      a = F(a, b, c, d, x[i], 7, -680876936); d = F(d, a, b, c, x[i + 1], 12, -389564586); c = F(c, d, a, b, x[i + 2], 17, 606105819); b = F(b, c, d, a, x[i + 3], 22, -1044525330);
      a = F(a, b, c, d, x[i + 4], 7, -176418897); d = F(d, a, b, c, x[i + 5], 12, 1200080426); c = F(c, d, a, b, x[i + 6], 17, -1473231341); b = F(b, c, d, a, x[i + 7], 22, -45705983);
      a = F(a, b, c, d, x[i + 8], 7, 1770035416); d = F(d, a, b, c, x[i + 9], 12, -1958414417); c = F(c, d, a, b, x[i + 10], 17, -42063); b = F(b, c, d, a, x[i + 11], 22, -1990404162);
      a = F(a, b, c, d, x[i + 12], 7, 1804603682); d = F(d, a, b, c, x[i + 13], 12, -40341101); c = F(c, d, a, b, x[i + 14], 17, -1502002290); b = F(b, c, d, a, x[i + 15], 22, 1236535329);
      a = G(a, b, c, d, x[i + 1], 5, -165796510); d = G(d, a, b, c, x[i + 6], 9, -1069501632); c = G(c, d, a, b, x[i + 11], 14, 643717713); b = G(b, c, d, a, x[i], 20, -373897302);
      a = G(a, b, c, d, x[i + 5], 5, -701558691); d = G(d, a, b, c, x[i + 10], 9, 38016083); c = G(c, d, a, b, x[i + 15], 14, -660478335); b = G(b, c, d, a, x[i + 4], 20, -405537848);
      a = G(a, b, c, d, x[i + 9], 5, 568446438); d = G(d, a, b, c, x[i + 14], 9, -1019803690); c = G(c, d, a, b, x[i + 3], 14, -187363961); b = G(b, c, d, a, x[i + 8], 20, 1163531501);
      a = G(a, b, c, d, x[i + 13], 5, -1444681467); d = G(d, a, b, c, x[i + 2], 9, -51403784); c = G(c, d, a, b, x[i + 7], 14, 1735328473); b = G(b, c, d, a, x[i + 12], 20, -1926607734);
      a = H(a, b, c, d, x[i + 5], 4, -378558); d = H(d, a, b, c, x[i + 8], 11, -2022574463); c = H(c, d, a, b, x[i + 11], 16, 1839030562); b = H(b, c, d, a, x[i + 14], 23, -35309556);
      a = H(a, b, c, d, x[i + 1], 4, -1530992060); d = H(d, a, b, c, x[i + 4], 11, 1272893353); c = H(c, d, a, b, x[i + 7], 16, -155497632); b = H(b, c, d, a, x[i + 10], 23, -1094730640);
      a = H(a, b, c, d, x[i + 13], 4, 681279174); d = H(d, a, b, c, x[i], 11, -358537222); c = H(c, d, a, b, x[i + 3], 16, -722521979); b = H(b, c, d, a, x[i + 6], 23, 76029189);
      a = H(a, b, c, d, x[i + 9], 4, -640364487); d = H(d, a, b, c, x[i + 12], 11, -421815835); c = H(c, d, a, b, x[i + 15], 16, 530742520); b = H(b, c, d, a, x[i + 2], 23, -995338651);
      a = I(a, b, c, d, x[i], 6, -198630844); d = I(d, a, b, c, x[i + 7], 10, 1126891415); c = I(c, d, a, b, x[i + 14], 15, -1416354905); b = I(b, c, d, a, x[i + 5], 21, -57434055);
      a = I(a, b, c, d, x[i + 12], 6, 1700485571); d = I(d, a, b, c, x[i + 3], 10, -1894986606); c = I(c, d, a, b, x[i + 10], 15, -1051523); b = I(b, c, d, a, x[i + 1], 21, -2054922799);
      a = I(a, b, c, d, x[i + 8], 6, 1873313359); d = I(d, a, b, c, x[i + 15], 10, -30611744); c = I(c, d, a, b, x[i + 6], 15, -1560198380); b = I(b, c, d, a, x[i + 13], 21, 1309151649);
      a = I(a, b, c, d, x[i + 4], 6, -145523070); d = I(d, a, b, c, x[i + 11], 10, -1120210379); c = I(c, d, a, b, x[i + 2], 15, 718787259); b = I(b, c, d, a, x[i + 9], 21, -343485551);
      a = A(a, oa); b = A(b, ob); c = A(c, oc); d = A(d, od);
    }
    return [a, b, c, d].map(v => { let s = ''; for (let i = 0; i < 4; i++) s += ('0' + ((v >> (i * 8)) & 255).toString(16)).slice(-2); return s; }).join('');
  }

  /* ---------------- ESM → CommonJS (good enough for course code) ---------------- */
  function transform(code) {
    code = code.replace(/^#!.*\n/, '');
    code = code.replace(/import\.meta\.url/g, '__meta.url');
    code = code.replace(/^\s*import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\}\s*,?\s*)?(?:\*\s+as\s+(\w+))?\s*(?:from\s*)?["']([^"']+)["']\s*;?/gm, (m, def, named, ns, mod) => {
      const out = [];
      if (def) out.push(`const ${def} = __default(require(${JSON.stringify(mod)}));`);
      if (named) out.push(`const { ${named.replace(/\s+as\s+/g, ': ')} } = require(${JSON.stringify(mod)});`);
      if (ns) out.push(`const ${ns} = require(${JSON.stringify(mod)});`);
      if (!def && !named && !ns) out.push(`require(${JSON.stringify(mod)});`);
      return out.join(' ');
    });
    code = code.replace(/^\s*export\s+default\s+/gm, 'module.exports.default = ');
    code = code.replace(/^\s*export\s+(const|let|var|function|class|async function)\s+(\w+)/gm, (m, kw, name) => `module.exports.${name} = undefined; ${kw} ${name}`);
    code = code.replace(/^\s*export\s*\{([^}]*)\}\s*;?/gm, (m, names) => names.split(',').map(s => s.trim()).filter(Boolean).map(s => { const [a, b] = s.split(/\s+as\s+/); return `module.exports.${b || a} = ${a};`; }).join(' '));
    return code;
  }
  // after export const x = ..., the value is assigned later; fix up exports on exit
  function fixExports(code) {
    const names = []; const re = /module\.exports\.(\w+) = undefined; (?:const|let|var|function|class|async function) (\w+)/g; let m;
    while ((m = re.exec(code))) names.push(m[2]);
    return names.length ? code + '\n' + names.map(n => `module.exports.${n} = ${n};`).join('\n') : code;
  }

  /* ========================================================================= */
  function create(opts) {
    const host = opts.host || {};
    const log = (kind, text) => host.log && host.log(kind, text);
    const files = new Map();
    const servers = {};
    const sessions = {};
    const env = Object.assign({ NODE_ENV: 'development', PORT: '', HOME: '/home/you', USER: 'you', PWD: ROOT }, opts.env || {});
    const moduleCache = {};
    let pgPromise = null;

    Object.keys(opts.files || {}).forEach(k => files.set(pjoin(ROOT, k), String(opts.files[k])));
    function fileChanged(p) { if (host.fileChanged) host.fileChanged(p.replace(ROOT + '/', ''), files.get(p)); }

    const vfs = {
      resolve: p => resolveFrom(ROOT, p),
      exists: p => { p = vfs.resolve(p); return files.has(p) || vfs.isDir(p); },
      isDir: p => { p = vfs.resolve(p); const pre = p === '/' ? '/' : p + '/'; for (const k of files.keys()) if (k.startsWith(pre)) return true; return p === ROOT; },
      read: p => { const v = files.get(vfs.resolve(p)); return v === undefined ? null : v; },
      write: (p, c) => { p = vfs.resolve(p); files.set(p, String(c)); fileChanged(p); },
      remove: p => { p = vfs.resolve(p); files.delete(p); fileChanged(p); },
      list: p => { p = vfs.resolve(p); const pre = p === '/' ? '/' : p + '/'; const s = new Set(); files.forEach((v, k) => { if (k.startsWith(pre)) s.add(k.slice(pre.length).split('/')[0]); }); return [...s].sort(); },
      all: () => { const o = {}; files.forEach((v, k) => o[k.replace(ROOT + '/', '')] = v); return o; },
    };

    /* ---------------- console / process ---------------- */
    function fmt(v) {
      if (typeof v === 'string') return v;
      if (v instanceof Error) return (v.stack || String(v));
      if (v === undefined) return 'undefined';
      if (typeof v === 'function') return `[Function: ${v.name || 'anonymous'}]`;
      try { return JSON.stringify(v, (k, val) => typeof val === 'function' ? `[Function: ${val.name || 'anonymous'}]` : val, 2); } catch (e) { return String(v); }
    }
    const konsole = {
      log: (...a) => log('log', a.map(fmt).join(' ')), info: (...a) => log('log', a.map(fmt).join(' ')), debug: (...a) => log('log', a.map(fmt).join(' ')),
      warn: (...a) => log('warn', a.map(fmt).join(' ')), error: (...a) => log('err', a.map(fmt).join(' ')),
      table: (a) => log('log', fmt(a)), dir: (a) => log('log', fmt(a)), time() {}, timeEnd() {}, group() {}, groupEnd() {},
    };
    const process = {
      env, argv: ['node', ROOT + '/index.js'], platform: 'darwin', version: 'v20.0.0', versions: { node: '20.0.0' }, pid: 4242,
      cwd: () => ROOT, exit: (c) => { log('meta', `process exited with code ${c || 0}`); throw { __exit: true }; }, nextTick: (f, ...a) => Promise.resolve().then(() => f(...a)),
      stdout: { write: s => log('log', String(s).replace(/\n$/, '')) }, stderr: { write: s => log('err', String(s).replace(/\n$/, '')) }, on() {}, hrtime: () => [0, 0], memoryUsage: () => ({ rss: 0 }),
    };

    /* ---------------- http request/response objects ---------------- */
    function makeReq(init, app) {
      const u = new URL(init.url, 'http://localhost');
      const headers = {}; Object.keys(init.headers || {}).forEach(k => headers[k.toLowerCase()] = init.headers[k]);
      const req = {
        method: (init.method || 'GET').toUpperCase(), url: u.pathname + u.search, originalUrl: u.pathname + u.search, path: u.pathname, baseUrl: '',
        query: parseQuery(u.search), params: {}, headers, body: undefined, cookies: parseCookies(headers.cookie), signedCookies: {},
        ip: '::1', ips: [], hostname: u.hostname, protocol: 'http', secure: false, xhr: false, app, rawBody: init.body,
        get: n => headers[String(n).toLowerCase()], header: n => headers[String(n).toLowerCase()],
        is: t => (headers['content-type'] || '').includes(t), accepts: () => true,
      };
      return req;
    }
    function makeRes(app, resolve) {
      const res = {
        app, statusCode: 200, headers: {}, body: '', sent: false, locals: {}, headersSent: false,
        status(n) { res.statusCode = n; return res; },
        set(k, v) { if (typeof k === 'object') Object.keys(k).forEach(x => res.set(x, k[x])); else res.headers[k.toLowerCase()] = v; return res; },
        header(k, v) { return res.set(k, v); }, setHeader(k, v) { return res.set(k, v); },
        get(k) { return res.headers[k.toLowerCase()]; }, getHeader(k) { return res.headers[k.toLowerCase()]; },
        type(t) { return res.set('content-type', MIME[t.replace(/^\./, '')] || t); },
        append(k, v) { const key = k.toLowerCase(); const cur = res.headers[key]; res.headers[key] = cur ? [].concat(cur, v) : (key === 'set-cookie' ? [v] : v); return res; },
        cookie(name, value, o) { o = o || {}; let c = `${name}=${encodeURIComponent(typeof value === 'object' ? 'j:' + JSON.stringify(value) : value)}; Path=${o.path || '/'}`;
          if (o.maxAge != null) c += `; Max-Age=${Math.floor(o.maxAge / 1000)}`; if (o.expires) c += `; Expires=${new Date(o.expires).toUTCString()}`; if (o.httpOnly) c += '; HttpOnly';
          return res.append('set-cookie', c); },
        clearCookie(name, o) { return res.cookie(name, '', Object.assign({}, o, { expires: new Date(0) })); },
        location(url) { return res.set('location', url); },
        redirect(a, b) { const status = typeof a === 'number' ? a : 302; const url = typeof a === 'number' ? b : a;
          res.statusCode = status; res.set('location', url); return res.send(`Found. Redirecting to ${url}`); },
        send(body) {
          if (res.sent) { log('warn', 'Cannot set headers after they are sent to the client — res.send() was called twice'); return res; }
          if (body === undefined) body = '';
          if (typeof body === 'number' && arguments.length === 1) { res.statusCode = body; body = String(body); }
          if (typeof body === 'object' && body !== null && !(body instanceof Uint8Array)) return res.json(body);
          if (!res.headers['content-type']) res.set('content-type', typeof body === 'string' ? 'text/html; charset=utf-8' : 'application/octet-stream');
          res.body = typeof body === 'string' ? body : String(body);
          return res.end();
        },
        json(o) { if (res.sent) return res; res.set('content-type', 'application/json; charset=utf-8'); res.body = JSON.stringify(o, null, 2); return res.end(); },
        jsonp(o) { return res.json(o); },
        sendStatus(n) { res.statusCode = n; return res.send(STATUS[n] || String(n)); },
        end(chunk) { if (chunk != null && !res.sent) res.body = (res.body || '') + String(chunk); if (res.sent) return res; res.sent = true; res.headersSent = true; resolve(); return res; },
        write(chunk) { res.body = (res.body || '') + String(chunk); return true; },
        writeHead(status, headers) { res.statusCode = status; if (headers) res.set(headers); return res; },
        sendFile(p, o, cb) { if (typeof o === 'function') cb = o; const path = resolveFrom(ROOT, p.replace(/^file:\/\//, ''));
          const c = vfs.read(path); if (c == null) { const e = new Error(`ENOENT: no such file or directory, stat '${path}'`); if (cb) return cb(e); res.statusCode = 404; return res.send(`Error: ${e.message}`); }
          res.set('content-type', MIME[extname(path).slice(1)] || 'application/octet-stream'); res.body = c; return res.end(); },
        render(view, locals, cb) {
          if (typeof locals === 'function') { cb = locals; locals = {}; }
          try { const html = renderView(app, view, Object.assign({}, app.locals, res.locals, locals || {})); if (cb) return cb(null, html); res.send(html); }
          catch (e) { if (cb) return cb(e); res.statusCode = 500; res.set('content-type', 'text/html; charset=utf-8'); res.body = `<pre style="color:#b00020;white-space:pre-wrap">${escapeHtml(e.message)}</pre>`; res.end(); log('err', e.message); }
          return res;
        },
        format(o) { const f = o.html || o.json || o.default; if (f) f(); return res; },
        vary() { return res; }, links() { return res; }, attachment() { return res; }, download(p) { return res.sendFile(p); },
        on() {}, once() {}, emit() {},
      };
      return res;
    }
    /* Errors thrown by user code carry our wrapper's frames; keep the message
       and point at the user's file and line instead. */
    function cleanStack(e) {
      if (!e || typeof e !== 'object') return String(e);
      const msg = e.stack ? e.stack.split('\n')[0] : String(e.message || e);
      const frames = (e.stack || '').split('\n').slice(1);
      const user = frames.map(f => { const m = f.match(/<anonymous>:(\d+):(\d+)/); return m ? { line: +m[1] - 3, col: +m[2] } : null; }).filter(Boolean)[0];
      return user ? `${msg}\n    at ${currentFile.replace(ROOT + '/', '')}:${user.line}:${user.col}` : msg;
    }
    let currentFile = ROOT + '/index.js';
    const STATUS = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 500: 'Internal Server Error', 503: 'Service Unavailable' };
    function escapeHtml(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

    /* ---------------- views (ejs) ---------------- */
    function renderView(app, view, data) {
      const ejs = (host.modules && host.modules.ejs) || (typeof self !== 'undefined' && self.ejs);
      const viewsDir = resolveFrom(ROOT, (app.settings && app.settings.views) || 'views');
      const engine = (app.settings && app.settings['view engine']) || 'ejs';
      let file = resolveFrom(viewsDir, view);
      if (!extname(file)) file += '.' + engine;
      const tpl = vfs.read(file);
      if (tpl == null) throw new Error(`Failed to lookup view "${view}" in views directory "${viewsDir}"`);
      if (!ejs) throw new Error('EJS is not available in this sandbox');
      // The browser build of EJS has no filesystem, so includes are resolved
      // here: relative to the views folder, then relative to the current file.
      const stack = [dirname(file)];
      const includer = (name) => {
        const candidates = [];
        [stack[stack.length - 1], viewsDir].forEach(dir => { let p = name.startsWith('/') ? pjoin(viewsDir, name) : pjoin(dir, name); candidates.push(p); if (!extname(p)) candidates.push(p + '.ejs'); });
        const found = candidates.find(p => vfs.read(p) != null);
        if (!found) throw new Error(`Could not find the include file "${name}" (looked in ${viewsDir.replace(ROOT + '/', '')}/)`);
        stack.push(dirname(found));
        return { template: vfs.read(found) };
      };
      try {
        return ejs.render(tpl, data, { includer, cache: false, localsName: 'locals', _with: true });
      } catch (e) {
        e.message = String(e.message).replace(/^ejs:(\d+)/, `${file.replace(ROOT + '/', '')}:$1`);
        throw e;
      }
    }

    /* ---------------- express ---------------- */
    function createApp(isRouter) {
      const stack = [];
      const app = function (req, res, next) { app.handle(req, res, next); };
      app.stack = stack; app.settings = { views: 'views', 'view engine': 'ejs', env: 'development' }; app.locals = {}; app.isRouter = !!isRouter; app.mountpath = '/';
      app.use = function (path, ...fns) {
        if (typeof path !== 'string' && !(path instanceof RegExp) && !Array.isArray(path)) { fns.unshift(path); path = '/'; }
        [].concat(...fns).forEach(fn => { if (typeof fn !== 'function') throw new TypeError('app.use() requires a middleware function but got a ' + typeof fn); [].concat(path).forEach(p => stack.push({ type: 'use', path: p, fn, m: pathToRegexp(p, false) })); });
        return app;
      };
      ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'all'].forEach(method => {
        app[method] = function (path, ...fns) {
          if (method === 'get' && fns.length === 0 && typeof path === 'string') return app.settings[path];   // app.get('view engine')
          [].concat(...fns).forEach(fn => { if (typeof fn !== 'function') throw new TypeError(`app.${method}() requires a callback function but got a ${typeof fn}`); [].concat(path).forEach(p => stack.push({ type: 'route', method: method.toUpperCase(), path: p, fn, m: pathToRegexp(p, true) })); });
          return app;
        };
      });
      app.set = (k, v) => { app.settings[k] = v; return app; };
      app.enable = k => app.set(k, true); app.disable = k => app.set(k, false); app.enabled = k => !!app.settings[k];
      app.engine = () => app;
      app.route = path => { const r = {}; ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(m => r[m] = (...fns) => { app[m](path, ...fns); return r; }); return r; };
      app.listen = function (port, hostOrCb, cb) {
        if (typeof hostOrCb === 'function') cb = hostOrCb;
        port = Number(port) || 3000;
        servers[port] = app;
        if (host.listening) host.listening(port);
        if (cb) setTimeout(cb, 0);
        return { close(c) { delete servers[port]; if (c) c(); }, address: () => ({ port }), on() {} };
      };
      app.param = () => app;
      app.handle = function (req, res, done) {
        let i = 0;
        const next = err => {
          if (err && err.__exit) return;
          const layer = stack[i++];
          if (!layer) return done ? done(err) : finalize(err);
          const path = req.path;
          let m;
          if (layer.type === 'route') {
            if (layer.method !== 'ALL' && layer.method !== req.method && !(layer.method === 'GET' && req.method === 'HEAD')) return next(err);
            m = layer.m.re.exec(path); if (!m) return next(err);
          } else {
            m = layer.m.re.exec(path); if (!m) return next(err);
          }
          const params = {}; layer.m.keys.forEach((k, j) => params[k] = m[j + 1] != null ? decodeURIComponent(m[j + 1]) : undefined);
          if (layer.m.keys.length === 0 && m[1] != null && layer.path !== '/') params[0] = m[1];
          const saved = { path: req.path, url: req.url, baseUrl: req.baseUrl, params: req.params };
          req.params = Object.assign({}, req.params, params);
          const isErrHandler = layer.fn.length === 4;
          if (err && !isErrHandler) return next(err);
          if (!err && isErrHandler) return next();
          const isSub = layer.type === 'use' && (layer.fn.isRouter || layer.fn.stack);
          if (isSub && layer.path !== '/') { const prefix = m[0].replace(/\/$/, ''); req.baseUrl = saved.baseUrl + prefix; req.url = req.url.slice(prefix.length) || '/'; req.path = req.path.slice(prefix.length) || '/'; }
          const restore = () => { req.path = saved.path; req.url = saved.url; req.baseUrl = saved.baseUrl; req.params = saved.params; };
          const nx = e => { restore(); next(e); };
          try {
            const r = err ? layer.fn(err, req, res, nx) : (isSub ? layer.fn.handle(req, res, nx) : layer.fn(req, res, nx));
            if (r && typeof r.catch === 'function') r.catch(e => { if (!res.sent) nx(e); else log('err', cleanStack(e)); });
          } catch (e) { nx(e); }
        };
        const finalize = err => {
          if (res.sent) return;
          if (err) {
            const text = cleanStack(err);
            log('err', text);
            res.statusCode = err.status || err.statusCode || 500;
            res.set('content-type', 'text/html; charset=utf-8');
            res.body = `<!DOCTYPE html><html><body><pre>${escapeHtml(text)}</pre></body></html>`;
            return res.end();
          }
          res.statusCode = 404; res.set('content-type', 'text/html; charset=utf-8');
          res.body = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot ${req.method} ${escapeHtml(req.originalUrl)}</pre></body></html>`;
          res.end();
        };
        next();
      };
      return app;
    }
    function express() { return createApp(false); }
    express.Router = () => createApp(true);
    express.static = (root, o) => { const dir = resolveFrom(ROOT, root || 'public'); return function serveStatic(req, res, next) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      let p = pjoin(dir, decodeURIComponent(req.path)); if (vfs.isDir(p) && vfs.exists(pjoin(p, 'index.html'))) p = pjoin(p, 'index.html');
      const c = vfs.read(p); if (c == null) return next();
      res.set('content-type', MIME[extname(p).slice(1)] || 'application/octet-stream'); res.body = c; res.end(); }; };
    express.urlencoded = () => function urlencodedParser(req, res, next) { if (req.body === undefined && (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded')) req.body = parseQuery(req.rawBody || ''); else if (req.body === undefined) req.body = {}; next(); };
    express.json = () => function jsonParser(req, res, next) { if ((req.headers['content-type'] || '').includes('application/json') && req.rawBody) { try { req.body = JSON.parse(req.rawBody); } catch (e) { res.statusCode = 400; return res.send('Unexpected token in JSON body'); } } else if (req.body === undefined) req.body = {}; next(); };
    express.text = () => (req, res, next) => { req.body = req.rawBody || ''; next(); };
    express.raw = express.text;

    /* ---------------- sessions & passport ---------------- */
    function sessionMiddleware(options) {
      options = options || {};
      const name = options.name || 'connect.sid';
      return function session(req, res, next) {
        let sid = req.cookies[name];
        let fresh = !sid || !sessions[sid];
        if (fresh) { sid = uid(); sessions[sid] = { cookie: Object.assign({ path: '/', httpOnly: true }, options.cookie || {}) }; }
        const s = sessions[sid];
        const before = JSON.stringify(s);
        req.sessionID = sid; req.session = s;
        s.save = cb => { if (cb) cb(); }; s.touch = () => {};
        s.destroy = cb => { delete sessions[sid]; req.session = null; res.clearCookie(name); if (cb) cb(); };
        s.regenerate = cb => { delete sessions[sid]; sid = uid(); sessions[sid] = { cookie: s.cookie }; req.sessionID = sid; req.session = sessions[sid]; Object.assign(req.session, { save: s.save, destroy: s.destroy, regenerate: s.regenerate, touch: s.touch }); res.cookie(name, sid, s.cookie); if (cb) cb(); };
        Object.defineProperty(s, 'save', { enumerable: false }); Object.defineProperty(s, 'destroy', { enumerable: false }); Object.defineProperty(s, 'regenerate', { enumerable: false }); Object.defineProperty(s, 'touch', { enumerable: false });
        const origEnd = res.end;
        res.end = function (chunk) {
          const changed = JSON.stringify(req.session) !== before;
          if (req.session && (fresh && (options.saveUninitialized || changed) || (!fresh && !req.cookies[name]))) { res.cookie(name, sid, s.cookie); fresh = false; }
          return origEnd.call(res, chunk);
        };
        next();
      };
    }
    function createPassport() {
      const strategies = {}; let serialize = (u, d) => d(null, u), deserialize = (id, d) => d(null, id);
      const passport = {
        use(name, strategy) { if (typeof name !== 'string') { strategy = name; name = strategy.name; } strategies[name] = strategy; return passport; },
        serializeUser(fn) { serialize = fn; }, deserializeUser(fn) { deserialize = fn; },
        initialize() { return function passportInitialize(req, res, next) {
          req.login = req.logIn = (user, opts, cb) => { if (typeof opts === 'function') cb = opts; serialize(user, (err, id) => { if (err) return cb && cb(err); if (req.session) req.session.passport = { user: id }; req.user = user; cb && cb(null); }); };
          req.logout = req.logOut = (opts, cb) => { if (typeof opts === 'function') cb = opts; if (req.session) delete req.session.passport; req.user = null; if (cb) cb(null); };
          req.isAuthenticated = () => !!req.user; req.isUnauthenticated = () => !req.user;
          next(); }; },
        session() { return function passportSession(req, res, next) {
          const id = req.session && req.session.passport && req.session.passport.user;
          if (id == null) return next();
          deserialize(id, (err, user) => { if (err) return next(err); if (user) req.user = user; else if (req.session) delete req.session.passport; next(); }); }; },
        authenticate(name, options, callback) {
          if (typeof options === 'function') { callback = options; options = {}; } options = options || {};
          return function authenticate(req, res, next) {
            const strategy = strategies[name];
            if (!strategy) return next(new Error(`Unknown authentication strategy "${name}"`));
            const done = (err, user, info) => {
              if (callback) return callback(err, user, info);
              if (err) return next(err);
              if (!user) { if (options.failureRedirect) return res.redirect(options.failureRedirect); res.statusCode = 401; return res.send('Unauthorized'); }
              req.login(user, e => { if (e) return next(e); if (options.successRedirect) return res.redirect(options.successRedirect); next(); });
            };
            try { strategy.authenticate(req, res, done, options); } catch (e) { next(e); }
          };
        },
      };
      return passport;
    }
    function LocalStrategy(options, verify) {
      if (typeof options === 'function') { verify = options; options = {}; }
      this.name = 'local'; this.options = options || {}; this.verify = verify;
      this.authenticate = (req, res, done) => {
        const u = (req.body || {})[this.options.usernameField || 'username'], p = (req.body || {})[this.options.passwordField || 'password'];
        if (u == null || p == null) return done(null, false, { message: 'Missing credentials' });
        const cb = (err, user, info) => done(err, user, info);
        if (this.options.passReqToCallback) this.verify(req, u, p, cb); else this.verify(u, p, cb);
      };
    }
    function GoogleStrategy(options, verify) {
      this.name = 'google'; this.options = options || {}; this.verify = verify;
      this.authenticate = (req, res, done, authOptions) => {
        if (req.query && req.query.code) {
          const profile = { id: '109876543210987654321', displayName: 'Test User', name: { familyName: 'User', givenName: 'Test' }, emails: [{ value: 'testuser@gmail.com', verified: true }], photos: [{ value: '' }], provider: 'google',
            _json: { sub: '109876543210987654321', name: 'Test User', given_name: 'Test', family_name: 'User', email: 'testuser@gmail.com', email_verified: true, picture: '' } };
          profile.email = 'testuser@gmail.com';
          const cb = (err, user, info) => done(err, user, info);
          if (this.options.passReqToCallback) this.verify(req, 'mock-access-token', 'mock-refresh-token', profile, cb); else this.verify('mock-access-token', 'mock-refresh-token', profile, cb);
          return;
        }
        const scope = [].concat((authOptions && authOptions.scope) || this.options.scope || ['profile']).join(' ');
        const cbUrl = this.options.callbackURL || '/auth/google/callback';
        const full = /^https?:/.test(cbUrl) ? cbUrl : `http://localhost:${req.headers.host ? req.headers.host.split(':')[1] || 3000 : 3000}${cbUrl}`;
        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(this.options.clientID || 'missing-client-id')}&redirect_uri=${encodeURIComponent(full)}&scope=${encodeURIComponent(scope)}&response_type=code`);
      };
    }

    /* ---------------- axios + the mock internet ---------------- */
    const MOCK = createMockInternet();
    async function httpRequest(config) {
      const method = (config.method || 'GET').toUpperCase();
      let url = config.url || '';
      if (config.baseURL && !/^https?:/.test(url)) url = config.baseURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
      const u = new URL(url, 'http://localhost');
      if (config.params) Object.keys(config.params).forEach(k => { if (config.params[k] !== undefined) u.searchParams.set(k, config.params[k]); });
      const headers = {}; Object.keys(config.headers || {}).forEach(k => headers[k.toLowerCase()] = config.headers[k]);
      if (config.auth) headers.authorization = 'Basic ' + b64(`${config.auth.username}:${config.auth.password}`);
      let body = config.data;
      if (body !== undefined && typeof body === 'object' && !(body instanceof URLSearchParams)) { body = JSON.stringify(body); headers['content-type'] = headers['content-type'] || 'application/json'; }
      else if (body instanceof URLSearchParams) { body = body.toString(); headers['content-type'] = 'application/x-www-form-urlencoded'; }
      const isLocal = /^(localhost|127\.0\.0\.1)$/.test(u.hostname);
      let raw;
      if (isLocal) {
        const port = Number(u.port || 80);
        if (!servers[port]) throw netError(`connect ECONNREFUSED 127.0.0.1:${port}`, 'ECONNREFUSED');
        raw = await dispatch(servers[port], { method, url: u.pathname + u.search, headers: Object.assign({ host: u.host }, headers), body });
      } else if (MOCK.has(u.hostname)) {
        raw = await MOCK.handle(method, u, headers, body);
      } else if (host.fetch) {
        try {
          const r = await host.fetch(u.href, { method, headers, body: ['GET', 'HEAD'].includes(method) ? undefined : body });
          const h = {}; if (r.headers && r.headers.forEach) r.headers.forEach((v, k) => h[k] = v);
          raw = { status: r.status, headers: h, body: await r.text() };
        } catch (e) { throw netError(`getaddrinfo ENOTFOUND ${u.hostname} (the request to ${u.hostname} failed: ${e.message}. Real sites need to allow browser requests — only your own localhost servers and a few course APIs are always reachable here)`, 'ENOTFOUND'); }
      } else throw netError(`getaddrinfo ENOTFOUND ${u.hostname}`, 'ENOTFOUND');
      const ct = (raw.headers['content-type'] || '');
      let data = raw.body;
      if (ct.includes('json') || (config.responseType !== 'text' && /^\s*[\[{]/.test(raw.body || ''))) { try { data = JSON.parse(raw.body); } catch (e) {} }
      const response = { data, status: raw.status, statusText: STATUS[raw.status] || '', headers: raw.headers, config };
      if (raw.status >= 400) { const e = new Error(`Request failed with status code ${raw.status}`); e.response = response; e.isAxiosError = true; e.config = config; throw e; }
      return response;
    }
    function netError(msg, code) { const e = new Error(msg); e.code = code; e.isAxiosError = true; return e; }
    function b64(s) { return typeof btoa === 'function' ? btoa(s) : Buffer.from(s).toString('base64'); }
    function createAxios(defaults) {
      const ax = cfg => httpRequest(Object.assign({}, defaults || {}, typeof cfg === 'string' ? { url: cfg } : cfg));
      ax.request = ax;
      ['get', 'delete', 'head', 'options'].forEach(m => ax[m] = (url, cfg) => ax(Object.assign({}, cfg || {}, { url, method: m })));
      ['post', 'put', 'patch'].forEach(m => ax[m] = (url, data, cfg) => ax(Object.assign({}, cfg || {}, { url, method: m, data })));
      ax.create = d => createAxios(Object.assign({}, defaults || {}, d || {}));
      ax.defaults = defaults || {}; ax.isAxiosError = e => !!(e && e.isAxiosError);
      return ax;
    }

    /* ---------------- dispatch a request into an app ---------------- */
    function dispatch(app, init) {
      return new Promise(resolve => {
        let finished = false;
        const req = makeReq(init, app);
        const res = makeRes(app, () => { if (finished) return; finished = true; clearTimeout(tm); resolve({ status: res.statusCode, headers: res.headers, body: res.body || '' }); });
        req.res = res; res.req = req;
        const tm = setTimeout(() => { if (finished) return; finished = true;
          log('warn', `${req.method} ${req.originalUrl} never got a response — did a handler forget res.send() / res.render() / next()?`);
          resolve({ status: 0, headers: {}, body: '', hung: true }); }, 5000);
        if (app.handle) app.handle(req, res); else app(req, res);   // plain http.createServer handler
      });
    }

    /* ---------------- module registry ---------------- */
    function require(name, from) {
      if (name.startsWith('.') || name.startsWith('/')) return loadFile(resolveFrom(dirname(from || ROOT + '/index.js'), name));
      const base = name.replace(/^node:/, '');
      if (moduleCache[base]) return moduleCache[base];
      const f = BUILTINS[base];
      if (!f) {
        if (base.startsWith('dotenv')) return BUILTINS.dotenv();
        throw new Error(`Cannot find module '${name}'\nThis playground bundles: ${Object.keys(BUILTINS).sort().join(', ')}`);
      }
      return (moduleCache[base] = f());
    }
    function __default(m) { return m && m.__esModule === false ? m : (m && m.default !== undefined ? m.default : m); }
    function loadFile(path) {
      const tries = [path, path + '.js', path + '.mjs', path + '.cjs', path + '/index.js', path + '.json'];
      const file = tries.find(p => vfs.read(p) != null);
      if (!file) throw new Error(`Cannot find module '${path.replace(ROOT + '/', './')}'`);
      if (moduleCache[file]) return moduleCache[file].exports;
      const mod = { exports: {} }; moduleCache[file] = mod;
      if (file.endsWith('.json')) { mod.exports = JSON.parse(vfs.read(file)); return mod.exports; }
      runCode(vfs.read(file), file, mod);
      return mod.exports;
    }
    function runCode(code, file, mod) {
      const src = fixExports(transform(code));
      let fn;
      try { fn = new Function('require', 'module', 'exports', '__filename', '__dirname', 'process', 'console', '__meta', '__default', 'Buffer', `return (async () => {\n${src}\n})();`); }
      catch (e) { throw new SyntaxError(`${file.replace(ROOT + '/', '')}: ${e.message}`); }
      const req = n => require(n, file);
      const out = fn(req, mod, mod.exports, file, dirname(file), process, konsole, { url: 'file://' + file }, __default, BufferShim);
      if (out && out.catch) out.catch(e => { if (e && e.__exit) return; log('err', cleanStack(e)); });
      return out;
    }
    const BufferShim = { from: (s, enc) => ({ toString: e => e === 'base64' ? b64(String(s)) : enc === 'base64' ? (typeof atob === 'function' ? atob(String(s)) : Buffer.from(String(s), 'base64').toString()) : String(s) }) };

    const BUILTINS = {
      express: () => express,
      'body-parser': () => ({ urlencoded: express.urlencoded, json: express.json, text: express.text }),
      ejs: () => { const ejs = (host.modules && host.modules.ejs) || (typeof self !== 'undefined' && self.ejs); if (!ejs) throw new Error('ejs is not available'); return ejs; },
      path: () => ({ join: pjoin, resolve: (...a) => resolveFrom(ROOT, pjoin(...a)), dirname, basename, extname, normalize, sep: '/', delimiter: ':', isAbsolute: p => p.startsWith('/'), relative: (a, b) => b.replace(a + '/', ''), parse: p => ({ dir: dirname(p), base: basename(p), ext: extname(p), name: basename(p, extname(p)) }) }),
      url: () => ({ fileURLToPath: u => String(u).replace(/^file:\/\//, ''), pathToFileURL: p => ({ href: 'file://' + p }), URL, URLSearchParams, parse: u => { const x = new URL(u, 'http://localhost'); return { pathname: x.pathname, query: parseQuery(x.search), search: x.search, host: x.host, protocol: x.protocol }; } }),
      fs: () => fsModule(),
      'fs/promises': () => fsModule().promises,
      os: () => ({ platform: () => 'darwin', homedir: () => '/home/you', tmpdir: () => '/tmp', EOL: '\n', cpus: () => [{}], hostname: () => 'playground', type: () => 'Darwin' }),
      crypto: () => ({ randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }),
        randomBytes: n => ({ toString: () => uid(n * 2) }), createHash: () => { let s = ''; const h = { update(x) { s += x; return h; }, digest: () => md5(s) }; return h; } }),
      events: () => { class EventEmitter { constructor() { this._l = {}; } on(e, f) { (this._l[e] = this._l[e] || []).push(f); return this; } once(e, f) { const w = (...a) => { this.off(e, w); f(...a); }; return this.on(e, w); } off(e, f) { this._l[e] = (this._l[e] || []).filter(x => x !== f); return this; } emit(e, ...a) { (this._l[e] || []).slice().forEach(f => f(...a)); return !!(this._l[e] || []).length; } addListener(e, f) { return this.on(e, f); } removeListener(e, f) { return this.off(e, f); } } EventEmitter.EventEmitter = EventEmitter; return EventEmitter; },
      util: () => ({ promisify: f => (...a) => new Promise((res, rej) => f(...a, (e, v) => e ? rej(e) : res(v))), inspect: fmt, format: (...a) => a.map(fmt).join(' '), inherits() {}, types: {} }),
      readline: () => ({ createInterface: () => ({ question: (q, cb) => Promise.resolve(host.input ? host.input(q) : '').then(v => cb(v)), close() {}, on() {}, prompt() {} }) }),
      http: () => ({ createServer: handler => { const app = (req, res) => handler(req, res); app.handle = null; return { listen(port, cb) { port = Number(port) || 3000; servers[port] = { handle: (req, res) => { res.setHeader = res.set; handler(req, res); } }; if (host.listening) host.listening(port); if (typeof cb === 'function') setTimeout(cb, 0); return this; }, on() {}, close() {} }; },
        get: (u, cb) => { httpRequest({ url: u }).then(r => cb({ statusCode: r.status, headers: r.headers, on: (e, f) => { if (e === 'data') f(typeof r.data === 'string' ? r.data : JSON.stringify(r.data)); if (e === 'end') f(); }, setEncoding() {} })).catch(e => log('err', e.message)); }, STATUS_CODES: STATUS }),
      https: () => BUILTINS.http(),
      axios: () => { const a = createAxios(); a.default = a; return a; },
      'node-fetch': () => (u, init) => httpRequest(Object.assign({ url: u }, init || {}, { data: init && init.body })).then(r => ({ ok: r.status < 400, status: r.status, json: async () => r.data, text: async () => typeof r.data === 'string' ? r.data : JSON.stringify(r.data) })),
      pg: () => pgModule(),
      bcrypt: () => bcryptModule(), bcryptjs: () => bcryptModule(),
      md5: () => md5,
      'express-session': () => sessionMiddleware,
      'cookie-parser': () => () => (req, res, next) => next(),
      passport: () => { const p = createPassport(); p.default = p; return p; },
      'passport-local': () => ({ Strategy: LocalStrategy, default: LocalStrategy }),
      'passport-google-oauth2': () => ({ Strategy: GoogleStrategy, default: GoogleStrategy }),
      'passport-google-oauth20': () => ({ Strategy: GoogleStrategy, default: GoogleStrategy }),
      dotenv: () => { const config = () => { const txt = vfs.read('.env') || ''; txt.split('\n').forEach(l => { const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); if (m && !l.trim().startsWith('#')) { let v = (m[2] || '').trim(); if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1); if (env[m[1]] === undefined) env[m[1]] = v; } }); return { parsed: env }; }; config(); return { config, parse: () => ({}) }; },
      morgan: () => (format) => function logger(req, res, next) { const t = Date.now(); const end = res.end; res.end = function (c) { const r = end.call(res, c); log('log', format === 'combined' ? `::1 - - [${new Date().toUTCString()}] "${req.method} ${req.originalUrl} HTTP/1.1" ${res.statusCode} ${(res.body || '').length} "-" "playground"` : `${req.method} ${req.originalUrl} ${res.statusCode} ${(res.body || '').length} - ${Date.now() - t} ms`); return r; }; next(); },
      cors: () => () => (req, res, next) => { res.set('access-control-allow-origin', '*'); next(); },
      'qr-image': () => ({ image: (text, o) => ({ pipe(ws) { const svg = qrSvg(text); ws.write(svg); ws.end(); return ws; } }), imageSync: text => qrSvg(text) }),
      qrcode: () => ({ toString: (text, o, cb) => { const s = qrSvg(text); if (typeof o === 'function') cb = o; if (cb) cb(null, s); return Promise.resolve(s); }, toFile: (p, text) => { vfs.write(p, qrSvg(text)); return Promise.resolve(); } }),
      inquirer: () => ({ prompt: async questions => { const answers = {}; for (const q of [].concat(questions)) { const v = host.input ? await host.input(q.message || q.name) : (q.default || ''); answers[q.name] = q.type === 'number' ? Number(v) : v; } return answers; }, default: null }),
      superheroes: () => namesModule(['Captain Comet', 'The Velvet Fox', 'Nightfall', 'Doctor Aurora', 'Quicksilver Quinn', 'Iron Lantern', 'The Tidal Guard', 'Solar Sparrow', 'Granite', 'Mistral', 'Ember Knight', 'Echo Wren', 'The Sentinel of Sorrow', 'Blue Meridian', 'Thunderpaw', 'Gloaming', 'Kestrel Kid', 'Lady Luminous', 'Mantis', 'Copperhead Jack']),
      supervillains: () => namesModule(['Baron Blackout', 'The Grey Cartographer', 'Madame Mercury', 'Doctor Dusk', 'Hexwright', 'The Hollow Clown', 'Lord Lattice', 'Static', 'Widow Winter', 'The Collector of Keys', 'Rook', 'Sulphur', 'Mister Mirror', 'Obsidian Owl', 'The Quiet Tide', 'Vantablack', 'Cinderfell', 'The Marionette', 'Nocturne', 'Glasshouse']),
      lodash: () => ({ capitalize: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(), lowerCase: s => s.replace(/[-_]+/g, ' ').toLowerCase(), kebabCase: s => s.replace(/\s+/g, '-').toLowerCase(), sample: a => a[Math.floor(Math.random() * a.length)], random: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a, shuffle: a => a.slice().sort(() => Math.random() - 0.5), uniq: a => [...new Set(a)], range: n => Array.from({ length: n }, (_, i) => i) }),
      nodemon: () => ({}),
    };
    BUILTINS['lodash'].default = null;
    function namesModule(list) { const m = { all: list.slice(), random: () => list[Math.floor(Math.random() * list.length)] }; m.default = m; return m; }

    function fsModule() {
      const enoent = p => { const e = new Error(`ENOENT: no such file or directory, open '${p}'`); e.code = 'ENOENT'; return e; };
      const cbify = fn => (...a) => { const cb = typeof a[a.length - 1] === 'function' ? a.pop() : null; let r, err = null; try { r = fn(...a); } catch (e) { err = e; } if (cb) setTimeout(() => cb(err, r), 0); else if (err) throw err; };
      const sync = {
        readFileSync: (p, o) => { const c = vfs.read(p); if (c == null) throw enoent(p); return c; },
        writeFileSync: (p, d) => vfs.write(p, d), appendFileSync: (p, d) => vfs.write(p, (vfs.read(p) || '') + d),
        existsSync: p => vfs.exists(p), readdirSync: p => { if (!vfs.isDir(p)) throw enoent(p); return vfs.list(p); },
        mkdirSync: p => { }, unlinkSync: p => { if (!vfs.exists(p)) throw enoent(p); vfs.remove(p); }, rmSync: p => vfs.remove(p), renameSync: (a, b) => { const c = vfs.read(a); if (c == null) throw enoent(a); vfs.write(b, c); vfs.remove(a); },
        statSync: p => { if (!vfs.exists(p)) throw enoent(p); return { isFile: () => !vfs.isDir(p), isDirectory: () => vfs.isDir(p), size: (vfs.read(p) || '').length }; },
        copyFileSync: (a, b) => vfs.write(b, vfs.read(a)),
      };
      const m = Object.assign({}, sync, {
        readFile: cbify((p, o) => sync.readFileSync(p)), writeFile: cbify(sync.writeFileSync), appendFile: cbify(sync.appendFileSync), readdir: cbify(sync.readdirSync), mkdir: cbify(sync.mkdirSync),
        unlink: cbify(sync.unlinkSync), rm: cbify(sync.rmSync), rename: cbify(sync.renameSync), stat: cbify(sync.statSync), exists: (p, cb) => setTimeout(() => cb(vfs.exists(p)), 0), copyFile: cbify(sync.copyFileSync),
        createWriteStream: p => { let buf = ''; const ws = { write(c) { buf += c; return true; }, end(c) { if (c) buf += c; vfs.write(p, buf); (ws._on.finish || []).forEach(f => f()); (ws._on.close || []).forEach(f => f()); }, _on: {}, on(e, f) { (ws._on[e] = ws._on[e] || []).push(f); return ws; }, once(e, f) { return ws.on(e, f); } }; return ws; },
        createReadStream: p => ({ pipe(ws) { ws.write(vfs.read(p) || ''); ws.end(); return ws; }, on(e, f) { if (e === 'data') f(vfs.read(p) || ''); if (e === 'end') f(); return this; } }),
        promises: { readFile: async p => sync.readFileSync(p), writeFile: async (p, d) => sync.writeFileSync(p, d), appendFile: async (p, d) => sync.appendFileSync(p, d), readdir: async p => sync.readdirSync(p), unlink: async p => sync.unlinkSync(p), mkdir: async () => {}, stat: async p => sync.statSync(p), access: async p => { if (!vfs.exists(p)) throw enoent(p); } },
        constants: {},
      });
      m.default = m;
      return m;
    }
    function qrSvg(text) {
      const lib = host.modules && host.modules.qrcode || (typeof self !== 'undefined' && self.qrcode);
      if (!lib) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="5" y="50" font-size="8">${escapeHtml(text)}</text></svg>`;
      const qr = lib(0, 'M'); qr.addData(String(text)); qr.make();
      const n = qr.getModuleCount(), s = 4;
      let rects = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) rects += `<rect x="${(c + 2) * s}" y="${(r + 2) * s}" width="${s}" height="${s}"/>`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(n + 4) * s} ${(n + 4) * s}" width="${(n + 4) * s}" height="${(n + 4) * s}"><rect width="100%" height="100%" fill="#fff"/><g fill="#000">${rects}</g></svg>`;
    }
    function bcryptModule() {
      const b = host.modules && host.modules.bcrypt || (typeof self !== 'undefined' && (self.dcodeIO && self.dcodeIO.bcrypt || self.bcrypt));
      if (!b) throw new Error('bcrypt is not available in this sandbox');
      const m = {
        genSalt: (r, cb) => { if (typeof r === 'function') { cb = r; r = 10; } const s = b.genSaltSync(r || 10); if (cb) return cb(null, s); return Promise.resolve(s); }, genSaltSync: r => b.genSaltSync(r || 10),
        hash: (p, s, cb) => { try { const h = b.hashSync(String(p), s || 10); if (cb) return cb(null, h); return Promise.resolve(h); } catch (e) { if (cb) return cb(e); return Promise.reject(e); } }, hashSync: (p, s) => b.hashSync(String(p), s || 10),
        compare: (p, h, cb) => { let ok = false, err = null; try { ok = b.compareSync(String(p), String(h)); } catch (e) { err = e; } if (cb) return cb(err, ok); return err ? Promise.reject(err) : Promise.resolve(ok); }, compareSync: (p, h) => b.compareSync(String(p), String(h)),
      };
      m.default = m; return m;
    }
    function pgModule() {
      function getPg() { if (!pgPromise) pgPromise = host.pg ? Promise.resolve(host.pg()) : Promise.resolve(null); return pgPromise; }
      class Client {
        constructor(cfg) { this.cfg = cfg || {}; this._ready = false; }
        async connect(cb) { const db = await getPg(); if (!db) { const e = new Error('No database available: a SQL-capable sandbox is needed (add db: { seed } to the lesson, and be online so Postgres can download)'); if (cb) return cb(e); throw e; } this.db = db; this._ready = true; if (cb) cb(null); }
        async query(text, params, cb) {
          if (typeof params === 'function') { cb = params; params = undefined; }
          if (typeof text === 'object') { params = text.values; text = text.text; }
          try {
            if (!this.db) await this.connect();
            const r = (params && params.length) ? await this.db.query(text, params) : await this.db.query(text);
            const out = { rows: r.rows || [], rowCount: r.affectedRows != null && !(r.fields && r.fields.length) ? r.affectedRows : (r.rows || []).length, fields: (r.fields || []).map(f => ({ name: f.name })), command: text.trim().split(/\s+/)[0].toUpperCase() };
            if (cb) return cb(null, out); return out;
          } catch (e) { const err = new Error(e.message); err.code = e.code; if (cb) return cb(err); throw err; }
        }
        async end(cb) { if (cb) cb(); }
        on() {}
      }
      class Pool extends Client { async connect() { await super.connect(); return Object.assign(Object.create(this), { release() {} }); } }
      const m = { Client, Pool, default: null }; m.default = m; return m;
    }

    /* ---------------- mock internet (the course's APIs, with original data) ---------------- */
    function createMockInternet() {
      const SECRETS = [
        [1, 'I still sleep with a nightlight on, and I am 34.', 7], [2, 'I have never actually finished a book club book.', 3], [3, 'I talk to my houseplants and I think it helps.', 2],
        [4, 'I once applauded at the end of a film in an empty cinema.', 5], [5, 'My "famous" chilli recipe comes from the back of a tin.', 6], [6, 'I secretly enjoy Mondays.', 4],
        [7, 'I have a spreadsheet ranking every pizza place in town.', 8], [8, 'I learned to code to build a better to-do list app and never finished it.', 9], [9, 'I cried at a bank advert last week.', 3],
        [10, 'I pretend to be on a call to avoid small talk in lifts.', 6], [11, 'I have re-watched the same sitcom nine times.', 5], [12, 'I cannot whistle and I have stopped trying.', 1],
      ].map(([id, secret, score]) => ({ id, secret, score }));
      const users = { testuser: { password: 'secret123', apiKey: 'test-api-key' } };
      const tokens = { 'test-bearer-token': 'testuser' };
      const ACTIVITIES = [
        { activity: 'Learn to juggle three oranges', type: 'recreational', participants: 1, price: 0.05, link: '', key: '1001', accessibility: 0.2 },
        { activity: 'Cook a dish from a country you have never visited', type: 'cooking', participants: 2, price: 0.3, link: '', key: '1002', accessibility: 0.3 },
        { activity: 'Write a letter to yourself to open in five years', type: 'relaxation', participants: 1, price: 0, link: '', key: '1003', accessibility: 0.1 },
        { activity: 'Organise a board game night', type: 'social', participants: 4, price: 0.1, link: '', key: '1004', accessibility: 0.2 },
        { activity: 'Build a birdhouse from scrap wood', type: 'diy', participants: 1, price: 0.2, link: '', key: '1005', accessibility: 0.4 },
        { activity: 'Start a small herb garden on the windowsill', type: 'diy', participants: 1, price: 0.15, link: '', key: '1006', accessibility: 0.2 },
        { activity: 'Volunteer at a local charity shop for an afternoon', type: 'charity', participants: 1, price: 0, link: '', key: '1007', accessibility: 0.1 },
        { activity: 'Learn ten phrases in a new language', type: 'education', participants: 1, price: 0, link: '', key: '1008', accessibility: 0.1 },
        { activity: 'Go for a sunrise walk with a friend', type: 'social', participants: 2, price: 0, link: '', key: '1009', accessibility: 0.1 },
        { activity: 'Make a playlist for a friend and explain each pick', type: 'music', participants: 2, price: 0, link: '', key: '1010', accessibility: 0.1 },
        { activity: 'Try a 30-minute bodyweight workout', type: 'busywork', participants: 1, price: 0, link: '', key: '1011', accessibility: 0.3 },
        { activity: 'Repaint a piece of old furniture', type: 'diy', participants: 2, price: 0.3, link: '', key: '1012', accessibility: 0.5 },
      ];
      const JOKES = [
        { category: 'Programming', type: 'twopart', setup: 'Why did the developer go broke?', delivery: 'Because they used up all their cache.', id: 1, safe: true, lang: 'en' },
        { category: 'Programming', type: 'single', joke: 'There are only 10 kinds of people: those who understand binary and those who do not.', id: 2, safe: true, lang: 'en' },
        { category: 'Pun', type: 'twopart', setup: 'What do you call a server that sings?', delivery: 'A-choir-ed infrastructure.', id: 3, safe: true, lang: 'en' },
        { category: 'Programming', type: 'twopart', setup: 'Why do programmers prefer dark mode?', delivery: 'Because light attracts bugs.', id: 4, safe: true, lang: 'en' },
        { category: 'Misc', type: 'single', joke: 'I told my computer I needed a break, and it said: no problem, I will go to sleep.', id: 5, safe: true, lang: 'en' },
      ];
      const json = (status, body) => ({ status, headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
      function basicUser(headers) { const h = headers.authorization || ''; if (!h.startsWith('Basic ')) return null; let dec = ''; try { dec = typeof atob === 'function' ? atob(h.slice(6)) : Buffer.from(h.slice(6), 'base64').toString(); } catch (e) { return null; } const i = dec.indexOf(':'); const u = dec.slice(0, i), p = dec.slice(i + 1); return users[u] && users[u].password === p ? u : null; }
      function bearerUser(headers) { const h = headers.authorization || ''; return h.startsWith('Bearer ') ? tokens[h.slice(7)] || null : null; }
      function apiKeyUser(q) { const k = q.get('apiKey'); return Object.keys(users).find(u => users[u].apiKey === k) || null; }
      let nextId = 100;
      const hosts = {
        'secrets-api.appbrewery.com': (method, u, headers, body) => {
          const p = u.pathname.replace(/\/$/, ''); const q = u.searchParams;
          let data = {}; try { data = body ? (headers['content-type'] || '').includes('json') ? JSON.parse(body) : parseQuery(body) : {}; } catch (e) {}
          if (method === 'GET' && p === '/random') return json(200, SECRETS[Math.floor(Math.random() * SECRETS.length)]);
          if (method === 'POST' && p === '/register') { if (!data.username || !data.password) return json(400, { error: 'username and password are required' }); users[data.username] = { password: data.password, apiKey: 'key-' + uid(10) }; return json(200, { message: 'Registered', username: data.username, apiKey: users[data.username].apiKey }); }
          if (method === 'GET' && p === '/generate-api-key') return json(200, { apiKey: users.testuser.apiKey, note: 'Use ?apiKey=... on the /filter endpoint' });
          if (method === 'GET' && p === '/get-auth-token') { const user = basicUser(headers); if (!user) return json(401, { error: 'Basic authentication failed: check username and password' }); const t = 'token-' + uid(12); tokens[t] = user; return json(200, { token: t }); }
          if (method === 'GET' && p === '/all') { if (!basicUser(headers)) return json(401, { error: 'This endpoint needs Basic authentication (username and password)' }); const page = Number(q.get('page') || 1), limit = Number(q.get('limit') || 10); return json(200, SECRETS.slice((page - 1) * limit, page * limit)); }
          if (method === 'GET' && p === '/filter') { if (!apiKeyUser(q)) return json(401, { error: 'A valid apiKey query parameter is required' }); const s = Number(q.get('score') || 0); return json(200, SECRETS.filter(x => x.score >= s)); }
          const m = p.match(/^\/secrets\/(\d+)$/);
          if (p === '/secrets' || m) {
            if (!bearerUser(headers)) return json(401, { error: 'A Bearer token is required: Authorization: Bearer <token>' });
            if (method === 'GET' && m) { const s = SECRETS.find(x => x.id === Number(m[1])); return s ? json(200, s) : json(404, { error: `No secret with id ${m[1]}` }); }
            if (method === 'POST' && !m) { if (!data.secret) return json(400, { error: 'secret is required' }); const s = { id: nextId++, secret: data.secret, score: Number(data.score) || 0 }; SECRETS.push(s); return json(201, s); }
            if (m) { const s = SECRETS.find(x => x.id === Number(m[1])); if (!s) return json(404, { error: `No secret with id ${m[1]}` });
              if (method === 'PUT') { s.secret = data.secret || ''; s.score = Number(data.score) || 0; return json(200, s); }
              if (method === 'PATCH') { if (data.secret != null) s.secret = data.secret; if (data.score != null) s.score = Number(data.score); return json(200, s); }
              if (method === 'DELETE') { SECRETS.splice(SECRETS.indexOf(s), 1); return json(200, { message: `Secret ${m[1]} deleted` }); } }
          }
          return json(404, { error: `Cannot ${method} ${p}` });
        },
        'bored-api.appbrewery.com': (method, u) => {
          const p = u.pathname.replace(/\/$/, ''); const q = u.searchParams;
          if (p === '/random') return json(200, ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]);
          if (p === '/filter') { let a = ACTIVITIES; if (q.get('type')) a = a.filter(x => x.type === q.get('type')); if (q.get('participants')) a = a.filter(x => x.participants === Number(q.get('participants'))); return a.length ? json(200, a) : json(404, { error: 'No activities that match your criteria.' }); }
          return json(404, { error: 'Not found' });
        },
        'www.boredapi.com': (method, u) => hosts['bored-api.appbrewery.com'](method, u),
        'v2.jokeapi.dev': (method, u) => { const t = u.searchParams.get('type'); const list = t ? JOKES.filter(j => j.type === t) : JOKES; const j = list[Math.floor(Math.random() * list.length)]; return json(200, Object.assign({ error: false }, j)); },
      };
      return { has: h => !!hosts[h], handle: (method, u, headers, body) => Promise.resolve(hosts[u.hostname](method, u, headers, body)) };
    }

    /* ---------------- public API ---------------- */
    async function run(entry) {
      const file = resolveFrom(ROOT, entry || 'index.js');
      const code = vfs.read(file);
      if (code == null) { log('err', `Error: Cannot find module '${file.replace(ROOT + '/', '')}'`); return; }
      process.argv = ['node', file]; currentFile = file;
      try { await runCode(code, file, { exports: {} }); }
      catch (e) { if (e && e.__exit) return; log('err', cleanStack(e)); }
    }
    async function request(init) {
      const u = new URL(init.url, 'http://localhost');
      const port = Number(u.port || 80);
      const app = servers[port];
      if (!app) return { status: 0, headers: {}, body: '', error: `Nothing is listening on port ${port}. Run the server first (and check app.listen(${port})).` };
      return dispatch(app, { method: init.method || 'GET', url: u.pathname + u.search, headers: Object.assign({ host: u.host }, init.headers || {}), body: init.body });
    }

    return { run, request, servers, fs: vfs, env, sessions, require: n => require(n), transform, md5 };
  }

  return { create, transform, md5 };
});
