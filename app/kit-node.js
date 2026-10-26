/* =========================================================================
   Kit: node — Node / Express / EJS / APIs / Postgres lessons.
   The learner's files run inside a hidden iframe (app/sandbox/node-runtime.js).
   The right-hand column has a fake browser (renders HTML responses, follows
   links and forms, keeps cookies), a Postman-style request panel and the
   terminal (console output, plus an input line for inquirer prompts).

   Lesson fields:
     files:   { 'index.js': '...', 'views/index.ejs': '...', 'public/styles/main.css': '...', '.env': '...' }
     solution: same shape
     run:     ['index.js']            entry files, run in order (default: index.js)
     start:   '/'                     first page to open after the server starts (default '/')
     port:    3000                    port used for `start` (default: first port that listens)
     db:      { seed: 'CREATE TABLE ...' }   gives `pg` a real Postgres (PGlite) with this data.
                                       The database lives on the page, so it survives ▶ Run
                                       like a real one; "Reset database" rebuilds it from the seed.
     env:     { API_KEY: '...' }      extra process.env values
     answers: 'https://example.com'   queued answers for inquirer / readline prompts (one per line)
     smoke:   [{ method:'GET', path:'/', expect:200 }]   requests the self-test sends
   ========================================================================= */
(function () {
  const { esc, attr, store, workbench, consolePanel, toast } = PG;
  const abs = p => new URL(p, location.href).href;

  const PGLITE_URL = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3.6/dist/index.js';
  let pgliteModule = null;
  const loadPGlite = () => (pgliteModule = pgliteModule || import(PGLITE_URL).then(m => m.PGlite));

  /* ---------- sandbox page ---------- */
  function sandboxDoc() {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<script src="${abs('vendor/ejs/ejs.min.js')}"><\/script>
<script src="${abs('vendor/bcrypt/bcrypt.min.js')}"><\/script>
<script src="${abs('vendor/qrcode/qrcode.js')}"><\/script>
<script src="${abs('app/sandbox/loop-guard.js')}"><\/script>
<script src="${abs('app/sandbox/inspect.js')}"><\/script>
<script src="${abs('app/sandbox/node-runtime.js')}"><\/script>
</head><body><script>
(function(){
  var sim = null, pending = {}, inputId = 0, pgDb = null, pgSeq = 0, pgWait = {};
  function post(m){ parent.postMessage(Object.assign({ __sim: true }, m), '*'); }
  // the database runs on the parent page: queries travel there and back
  function pgCall(op, text, params){
    return new Promise(function(resolve, reject){
      var id = ++pgSeq; pgWait[id] = { resolve: resolve, reject: reject };
      post({ type: 'pg', id: id, op: op, text: text, params: params });
    });
  }
  var host = {
    log: function(kind, text){ post({ type: 'log', kind: kind, text: text }); },
    listening: function(port){ post({ type: 'listening', port: port }); },
    input: function(q){ return new Promise(function(res){ var id = ++inputId; pending[id] = res; post({ type: 'input', id: id, question: q }); }); },
    fetch: function(url, init){ return fetch(url, init); },
    fileChanged: function(path, content){ post({ type: 'file', path: path, content: content }); },
    pg: function(){ return pgDb; },
    modules: { ejs: window.ejs, bcrypt: window.dcodeIO && window.dcodeIO.bcrypt, qrcode: window.qrcode },
  };
  async function init(msg){
    try {
      if (msg.db) pgDb = { query: function(t, p){ return pgCall('query', t, p); }, exec: function(t){ return pgCall('exec', t); } };
      sim = NodeSim.create({ files: msg.files, env: msg.env || {}, host: host });
      for (var i = 0; i < msg.entries.length; i++) {
        post({ type: 'log', kind: 'cmd', text: '$ node ' + msg.entries[i] });
        await sim.run(msg.entries[i]);
      }
      await new Promise(function(r){ setTimeout(r, 30); });
      post({ type: 'ready', ports: Object.keys(sim.servers).map(Number) });
    } catch (e) { post({ type: 'log', kind: 'err', text: String(e && e.message || e) }); post({ type: 'ready', ports: [] }); }
  }
  window.addEventListener('message', async function(e){
    var m = e.data; if (!m || !m.__sim) return;
    if (m.type === 'init') return init(m);
    if (m.type === 'request') { if (!sim) return post({ type: 'response', id: m.id, res: { status: 0, headers: {}, body: '', error: 'The server is not running — press Run first.' } });
      var res = await sim.request(m.req); post({ type: 'response', id: m.id, res: res }); }
    if (m.type === 'input') { var r = pending[m.id]; delete pending[m.id]; if (r) r(m.value); }
    if (m.type === 'pgres') { var w = pgWait[m.id]; delete pgWait[m.id]; if (!w) return;
      if (m.error) { var err = new Error(m.error); err.code = m.code; w.reject(err); } else w.resolve(m.result); }
  });
  post({ type: 'booted' });
})();
<\/script></body></html>`;
  }

  /* ---------- a sandbox instance ---------- */
  function createSandbox(onMsg) {
    const f = document.createElement('iframe');
    f.style.display = 'none';
    // same-origin so the vendored scripts load from this site (an opaque-origin
    // frame cannot fetch from localhost); the code running inside is the learner's own
    f.sandbox = 'allow-scripts allow-same-origin';
    document.body.appendChild(f);
    let seq = 0; const waiting = {};
    const handler = e => {
      if (e.source !== f.contentWindow || !e.data || !e.data.__sim) return;
      const m = e.data;
      if (m.type === 'response' && waiting[m.id]) { waiting[m.id](m.res); delete waiting[m.id]; return; }
      onMsg(m);
    };
    window.addEventListener('message', handler);
    let booted = null;
    const ready = new Promise(res => { booted = res; });
    const sb = {
      post: m => f.contentWindow && f.contentWindow.postMessage(Object.assign({ __sim: true }, m), '*'),
      request: req => new Promise(resolve => { const id = ++seq; waiting[id] = resolve; sb.post({ type: 'request', id, req }); setTimeout(() => { if (waiting[id]) { delete waiting[id]; resolve({ status: 0, headers: {}, body: '', error: 'No response (timed out).' }); } }, 8000); }),
      destroy() { window.removeEventListener('message', handler); window.removeEventListener('message', bootHandler); f.remove(); },
      ready,
    };
    const bootHandler = e => { if (e.source === f.contentWindow && e.data && e.data.__sim && e.data.type === 'booted') { booted(); window.removeEventListener('message', bootHandler); } };
    window.addEventListener('message', bootHandler);
    f.srcdoc = sandboxDoc();
    return sb;
  }

  /* ---------- the page-side database a sandbox talks to ---------- */
  function pageDatabase(seed, log) {
    let promise = null;
    const api = {
      get() {
        if (!promise) promise = (async () => {
          if (log) log('meta', 'starting Postgres…');
          const PGlite = await loadPGlite();
          const db = new PGlite(); await db.waitReady;
          if (seed) await db.exec(seed);
          if (log) log('meta', 'Postgres ready (seeded from the lesson)');
          return db;
        })();
        return promise;
      },
      get started() { return !!promise; },
      async close() { if (promise) { try { (await promise).close(); } catch (e) {} } promise = null; },
      async handle(m, sb) {
        try {
          const db = await api.get();
          let r;
          if (m.op === 'exec') { const rs = await db.exec(m.text); r = rs[rs.length - 1] || { rows: [], fields: [] }; }
          else r = m.params && m.params.length ? await db.query(m.text, m.params) : await db.query(m.text);
          sb.post({ type: 'pgres', id: m.id, result: { rows: r.rows || [], fields: (r.fields || []).map(x => ({ name: x.name, dataTypeID: x.dataTypeID })), affectedRows: r.affectedRows } });
        } catch (e) {
          sb.post({ type: 'pgres', id: m.id, error: e.message || String(e), code: e.code });
        }
      },
    };
    return api;
  }

  /* ---------- cookie jar ---------- */
  function cookieJar() {
    const jar = {};
    return {
      header() { const k = Object.keys(jar); return k.length ? k.map(n => `${n}=${encodeURIComponent(jar[n])}`).join('; ') : undefined; },
      apply(setCookie) {
        [].concat(setCookie || []).forEach(line => {
          const parts = line.split(';').map(s => s.trim()); const [name, ...rest] = parts[0].split('='); const value = decodeURIComponent(rest.join('='));
          const expired = parts.some(p => /^expires=/i.test(p) && new Date(p.slice(8)) < new Date()) || parts.some(p => /^max-age=/i.test(p) && Number(p.slice(8)) <= 0);
          if (expired) delete jar[name]; else jar[name] = value;
        });
      },
      all: () => Object.assign({}, jar), clear() { Object.keys(jar).forEach(k => delete jar[k]); },
    };
  }

  /* ---------- the interceptor injected into rendered pages ---------- */
  const PAGE_SHIM = `
<script>
(function(){
  var BASE = window.__PAGE_URL__;
  function abs(u){ try { return new URL(u, BASE).href; } catch(e){ return u; } }
  function go(url, method, data){ parent.postMessage({ __nav: true, url: url, method: method || 'GET', data: data }, '*'); }
  function sendForm(f, submitter){
    var data = {}; new FormData(f).forEach(function(v, k){ if (k in data) data[k] = [].concat(data[k], v); else data[k] = v; });
    if (submitter && submitter.name) data[submitter.name] = submitter.value;
    var method = ((submitter && submitter.getAttribute('formmethod')) || f.getAttribute('method') || 'GET').toUpperCase();
    var action = (submitter && submitter.getAttribute('formaction')) || f.getAttribute('action') || BASE;
    go(abs(action), method, data);
  }
  // window listeners run after the page's own document/element listeners,
  // so a page that calls preventDefault() keeps control
  window.addEventListener('click', function(e){
    if (e.defaultPrevented) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var href = a.getAttribute('href'); if (!href || /^(javascript:|#|mailto:|tel:)/i.test(href)) return;
    e.preventDefault(); go(abs(href), 'GET');
  });
  window.addEventListener('submit', function(e){
    if (e.defaultPrevented) return;
    e.preventDefault(); sendForm(e.target, e.submitter);
  });
  // form.submit() skips the submit event, so catch it here too
  HTMLFormElement.prototype.submit = function(){ sendForm(this, null); };
  // location.href = "/x", location.assign() and friends
  if (window.navigation && navigation.addEventListener) navigation.addEventListener('navigate', function(e){
    if (!e.cancelable || e.hashChange || e.downloadRequest || e.formData) return;
    var u = e.destination && e.destination.url;
    if (!u || /^(about|javascript|data|blob):/i.test(u)) return;
    e.preventDefault(); go(u, 'GET');
  });
  var seq = 0, waiting = {};
  window.addEventListener('message', function(e){ var m = e.data; if (m && m.__fetchReply && waiting[m.id]) { waiting[m.id](m); delete waiting[m.id]; } });
  var realFetch = window.fetch;
  window.fetch = function(url, init){
    var u = abs(typeof url === 'string' ? url : url.url);
    if (!/^https?:\\/\\/(localhost|127\\.0\\.0\\.1)/.test(u)) return realFetch.apply(window, arguments);
    init = init || {}; var headers = {}; if (init.headers) { if (init.headers.forEach) init.headers.forEach(function(v, k){ headers[k] = v; }); else Object.assign(headers, init.headers); }
    return new Promise(function(resolve){ var id = ++seq; waiting[id] = function(m){
      resolve(new Response(m.body, { status: m.status || 500, statusText: m.statusText || '', headers: m.headers || {} })); };
      parent.postMessage({ __fetch: true, id: id, url: u, method: (init.method || 'GET').toUpperCase(), headers: headers, body: init.body == null ? undefined : String(init.body) }, '*'); });
  };
  console.log = (function(o){ return function(){ parent.postMessage({ __pagelog: true, kind: 'log', text: [].slice.call(arguments).map(String).join(' ') }, '*'); o.apply(console, arguments); }; })(console.log);
  console.error = (function(o){ return function(){ parent.postMessage({ __pagelog: true, kind: 'err', text: [].slice.call(arguments).map(String).join(' ') }, '*'); o.apply(console, arguments); }; })(console.error);
  window.onerror = function(m){ parent.postMessage({ __pagelog: true, kind: 'err', text: String(m) }, '*'); };
})();
<\/script>`;

  function googlePage(u) {
    const q = u.searchParams; const redirect = q.get('redirect_uri') || '/';
    const ok = new URL(redirect); ok.searchParams.set('code', 'mock-auth-code'); ok.searchParams.set('scope', q.get('scope') || 'profile');
    const no = new URL(redirect); no.searchParams.set('error', 'access_denied');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f0f4f9;margin:0;display:flex;justify-content:center;padding:40px 16px}
      .card{background:#fff;border-radius:24px;padding:36px;max-width:420px;width:100%;box-shadow:0 1px 3px rgba(0,0,0,.15)}
      h1{font-size:22px;font-weight:400;margin:14px 0 6px} .g{font-weight:700;font-size:20px;letter-spacing:-.5px} .g b:nth-child(1){color:#4285f4}.g b:nth-child(2){color:#ea4335}.g b:nth-child(3){color:#fbbc05}.g b:nth-child(4){color:#4285f4}.g b:nth-child(5){color:#34a853}.g b:nth-child(6){color:#ea4335}
      .acct{display:flex;align-items:center;gap:12px;border:1px solid #dadce0;border-radius:12px;padding:12px;margin:18px 0;cursor:pointer}.acct:hover{background:#f8fafd}
      .av{width:36px;height:36px;border-radius:50%;background:#1a73e8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
      .dim{color:#5f6368;font-size:13px} .sim{background:#fff3cd;border:1px solid #ffe69c;border-radius:8px;padding:8px 12px;font-size:12.5px;color:#664d03;margin-bottom:12px}
      a.cancel{display:inline-block;margin-top:8px;color:#1a73e8;font-size:14px}
    </style></head><body><div class="card">
      <div class="sim">Simulated Google sign-in — nothing leaves this page.</div>
      <div class="g"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></div>
      <h1>Choose an account</h1><div class="dim">to continue to <b>localhost</b> (client id: ${esc((q.get('client_id') || '').slice(0, 28))}${(q.get('client_id') || '').length > 28 ? '…' : ''})</div>
      <a class="acct" href="${attr(ok.href)}"><div class="av">T</div><div><div>Test User</div><div class="dim">testuser@gmail.com</div></div></a>
      <div class="dim">Requested scope: ${esc(q.get('scope') || 'profile')}</div>
      <a class="cancel" href="${attr(no.href)}">Cancel</a>
    </div></body></html>`;
  }

  /* ---------- mount ---------- */
  function mount(lesson, host) {
    const entries = lesson.run || ['index.js'];
    let sb = null, ports = [], busy = false, running = false, runs = 0;
    const jar = cookieJar();
    const hist = []; let hi = -1;
    const generated = {};

    const wb = workbench(host, lesson, {
      autoRun: false,
      className: 'node-layout',
      output: `
        <div class="out-bar">
          <button class="btn primary" id="runBtn">▶ Run <span class="dim-inline">node ${esc(entries.join(' · node '))}</span></button>
          <span class="status-pill" id="status">stopped</span>
          ${lesson.db ? '<button class="btn ghost" id="resetDb" title="Rebuild the database from the lesson\'s starting data">Reset database</button>' : ''}
          <span style="flex:1"></span>
          <button class="btn ghost" id="clearCon" title="Clear the terminal">clear</button>
        </div>
        <div class="node-shell">
          <div class="client">
            <div class="client-tabs">
              <button class="ctab on" data-ct="browser">Browser</button>
              <button class="ctab" data-ct="postman">Postman</button>
              <span style="flex:1"></span>
              <span class="cookie-info" id="cookieInfo" title="Cookies the fake browser is holding"></span>
            </div>
            <div class="cpane on" data-cp="browser">
              <div class="urlbar">
                <button class="btn ghost" id="backBtn" title="Back">◀</button>
                <button class="btn ghost" id="reloadBtn" title="Reload">⟳</button>
                <input id="urlBox" class="url" value="http://localhost:${lesson.port || 3000}${(lesson.start || '/')}" spellcheck="false">
                <button class="btn" id="goBtn">Go</button>
              </div>
              <div class="page-shell">
                <div class="page-status" id="pageStatus"></div>
                <iframe id="page" sandbox="allow-scripts allow-forms allow-modals"></iframe>
                <pre class="page-raw" id="pageRaw" style="display:none"></pre>
              </div>
            </div>
            <div class="cpane" data-cp="postman">
              <div class="pm-row">
                <select id="pmMethod" class="btn"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select>
                <input id="pmUrl" class="url" value="http://localhost:${lesson.port || 3000}/" spellcheck="false">
                <button class="btn primary" id="pmSend">Send</button>
              </div>
              <div class="pm-grid">
                <div>
                  <div class="pm-label">Authorization</div>
                  <select id="pmAuth" class="btn pm-wide"><option value="none">No auth</option><option value="basic">Basic auth</option><option value="bearer">Bearer token</option></select>
                  <div id="pmAuthFields" class="pm-auth"></div>
                  <div class="pm-label">Headers <span class="dim">(one per line, Key: value)</span></div>
                  <textarea id="pmHeaders" class="pm-text" rows="3" spellcheck="false"></textarea>
                </div>
                <div>
                  <div class="pm-label">Body</div>
                  <select id="pmBodyType" class="btn pm-wide"><option value="none">none</option><option value="form">x-www-form-urlencoded (key=value per line)</option><option value="json">raw JSON</option></select>
                  <textarea id="pmBody" class="pm-text" rows="5" spellcheck="false" placeholder=""></textarea>
                </div>
              </div>
              <div class="pm-response" id="pmResponse"><div class="dim">Send a request to see the response here.</div></div>
            </div>
          </div>
          <div class="terminal-wrap">
            <div class="console-head">Terminal <span class="dim" style="text-transform:none;letter-spacing:0;font-weight:400">console.log output and errors from your server</span><span style="flex:1"></span><span id="genFiles"></span></div>
            <div class="console term-console" id="console"></div>
            <div class="term-input" id="termInput" style="display:none"><span id="termQ"></span><input id="termVal" spellcheck="false"></div>
          </div>
        </div>`,
      onRun: () => run(),
    });

    const con = consolePanel(host.querySelector('#console'));
    const status = host.querySelector('#status'), urlBox = host.querySelector('#urlBox'), page = host.querySelector('#page'), pageRaw = host.querySelector('#pageRaw'), pageStatus = host.querySelector('#pageStatus');
    const setStatus = (t, cls) => { status.textContent = t; status.className = 'status-pill ' + (cls || ''); };
    const answerQueue = () => String(store.getAnswers(lesson.id) || lesson.answers || '').split(/\n/).map(s => s.trim()).filter(Boolean);
    let answers = answerQueue();
    const database = lesson.db ? pageDatabase(lesson.db.seed || '', (k, t) => con.row(k, t)) : null;

    function updateCookies() { const c = jar.all(); const k = Object.keys(c); host.querySelector('#cookieInfo').textContent = k.length ? `🍪 ${k.join(', ')}` : ''; }
    function showGenerated() {
      const names = Object.keys(generated);
      host.querySelector('#genFiles').innerHTML = names.length ? `<span class="dim" style="text-transform:none;letter-spacing:0;font-weight:400">files written:</span> ${names.map(n => `<button class="link-btn" data-gen="${attr(n)}">${esc(n)}</button>`).join(' ')}` : '';
      host.querySelectorAll('[data-gen]').forEach(b => b.onclick = () => {
        const c = generated[b.dataset.gen];
        showTab('browser');
        pageStatus.textContent = `file: ${b.dataset.gen}`;
        if (/^\s*<svg/.test(c)) { page.style.display = ''; pageRaw.style.display = 'none'; page.srcdoc = `<body style="margin:0;display:flex;justify-content:center;padding:20px">${c}</body>`; }
        else if (/^data:image\//.test(c)) { page.style.display = ''; pageRaw.style.display = 'none'; page.srcdoc = `<body style="margin:0;display:flex;justify-content:center;padding:20px"><img src="${attr(c)}"></body>`; }
        else { page.style.display = 'none'; pageRaw.style.display = ''; pageRaw.textContent = c; }
      });
    }

    async function run() {
      if (sb) sb.destroy();
      con.clear(); ports = []; running = false; answers = answerQueue(); runs++;
      Object.keys(generated).forEach(k => delete generated[k]); showGenerated();
      setStatus('starting…', 'busy');
      const files = wb.readFiles();
      if (database) {
        if (database.started) con.row('meta', 'Using the database from the last run (press Reset database to start fresh).');
        try { await database.get(); } catch (e) { con.row('err', 'Postgres could not start — are you online? ' + (e.message || e)); }
      }
      const mine = sb = createSandbox(m => {
        if (sb !== mine) return;
        if (m.type === 'log') { con.row(m.kind === 'cmd' ? 'cmd' : m.kind, m.text); }
        else if (m.type === 'listening') { ports.push(m.port); }
        else if (m.type === 'pg') { if (database) database.handle(m, mine); else mine.post({ type: 'pgres', id: m.id, error: 'This lesson has no database. (Lessons that use pg declare db: { seed } so the playground can start Postgres.)' }); }
        else if (m.type === 'ready') {
          running = true;
          if (ports.length) {
            setStatus(`listening on :${ports.join(', :')}`, 'ok');
            const p = lesson.port || ports[0];
            urlBox.value = `http://localhost:${p}${lesson.start || '/'}`;
            host.querySelector('#pmUrl').value = `http://localhost:${p}/`;
            if (lesson.autoOpen !== false) navigate(urlBox.value, 'GET');
          } else { setStatus('finished (no server listening)', ''); }
        }
        else if (m.type === 'input') {
          const next = answers.shift();
          if (next !== undefined) { con.row('prompt', `${m.question} ${next}`); mine.post({ type: 'input', id: m.id, value: next }); }
          else {
            const box = host.querySelector('#termInput'); box.style.display = '';
            host.querySelector('#termQ').textContent = m.question + ' '; const inp = host.querySelector('#termVal'); inp.value = ''; inp.focus();
            inp.onkeydown = e => { if (e.key === 'Enter') { con.row('prompt', `${m.question} ${inp.value}`); mine.post({ type: 'input', id: m.id, value: inp.value }); box.style.display = 'none'; } };
          }
        }
        else if (m.type === 'file') {
          if (m.content == null) delete generated[m.path]; else generated[m.path] = m.content;
          showGenerated();
        }
      });
      mine.ready.then(() => mine.post({ type: 'init', files, entries, db: !!lesson.db, env: lesson.env || {} }));
    }

    /* ----- browser ----- */
    async function send(method, url, headers, body) {
      if (!sb || !running) return { status: 0, headers: {}, body: '', error: 'The server is not running — press ▶ Run first.' };
      headers = Object.assign({}, headers || {});
      const c = jar.header(); if (c) headers.cookie = c;
      const t0 = performance.now();
      const res = await sb.request({ method, url, headers, body });
      res.ms = Math.round(performance.now() - t0);
      if (res.headers && res.headers['set-cookie']) { jar.apply(res.headers['set-cookie']); updateCookies(); }
      return res;
    }
    async function navigate(url, method, data, opts) {
      opts = opts || {};
      let u; try { u = new URL(url, urlBox.value); } catch (e) { pageStatus.textContent = 'Bad URL'; return; }
      if (busy) return; busy = true;
      try {
        if (u.hostname === 'accounts.google.com') { renderHtml(googlePage(u), u.href, { status: 200 }); if (!opts.noHistory) pushHist(u.href); return; }
        if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname)) { renderText(`This built-in browser only reaches your own servers on localhost.\n\n${u.href}\n\nOpen it in a real browser tab if you need the live site.`, u.href, { status: 0 }); return; }
        let headers = {}, body;
        if (method === 'GET' && data) { Object.keys(data).forEach(k => u.searchParams.set(k, data[k])); }
        else if (data) { body = new URLSearchParams(data).toString(); headers['content-type'] = 'application/x-www-form-urlencoded'; }
        let res = await send(method, u.href, headers, body), hops = 0, cur = u.href;
        while (res.status >= 300 && res.status < 400 && res.headers.location && hops++ < 6) {
          cur = new URL(res.headers.location, cur).href;
          if (new URL(cur).hostname === 'accounts.google.com') { renderHtml(googlePage(new URL(cur)), cur, { status: 200 }); pushHist(cur); return; }
          res = await send('GET', cur, {}, undefined);
        }
        urlBox.value = cur;
        if (!opts.noHistory) pushHist(cur);
        if (res.error) { renderText(res.error, cur, res); return; }
        if (res.hung || res.status === 0) { renderText('The request never got a response.\n\nUsually a route handler forgot to call res.send(), res.render() or next().', cur, res); return; }
        const ct = (res.headers['content-type'] || '');
        if (ct.includes('text/html')) await renderHtml(res.body, cur, res);
        else if (ct.includes('json')) renderText(pretty(res.body), cur, res);
        else if (/^data:image\//.test(res.body || '')) renderHtml(`<body style="margin:0;display:flex;justify-content:center;padding:20px"><img src="${attr(res.body)}"></body>`, cur, res);
        else if (ct.startsWith('image/svg')) renderHtml(`<body style="margin:0;display:flex;justify-content:center;padding:20px">${res.body}</body>`, cur, res);
        else renderText(res.body, cur, res);
      } finally { busy = false; }
    }
    function pushHist(url) { hist.splice(hi + 1); hist.push(url); hi = hist.length - 1; }
    function pretty(s) { try { return JSON.stringify(JSON.parse(s), null, 2); } catch (e) { return s; } }
    function statusLine(url, res) { pageStatus.innerHTML = `<span class="code c${String(res.status)[0]}">${res.status || '—'}</span> ${esc(url)}${res.ms != null ? ` <span class="dim">${res.ms} ms</span>` : ''}`; }
    function renderText(text, url, res) { statusLine(url, res); page.style.display = 'none'; pageRaw.style.display = ''; pageRaw.textContent = text; }
    async function renderHtml(html, url, res) {
      statusLine(url, res);
      page.style.display = ''; pageRaw.style.display = 'none';
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const same = h => { try { const x = new URL(h, url); return /^(localhost|127\.0\.0\.1)$/.test(x.hostname) ? x.href : null; } catch (e) { return null; } };
      const jobs = [];
      doc.querySelectorAll('link[rel~="stylesheet"][href]').forEach(l => { const h = same(l.getAttribute('href')); if (!h) return; jobs.push(send('GET', h).then(r => { if (r.status === 200) { const s = doc.createElement('style'); s.textContent = r.body; l.replaceWith(s); } else l.replaceWith(doc.createComment(`stylesheet ${h} → ${r.status}`)); })); });
      doc.querySelectorAll('script[src]').forEach(sc => { const h = same(sc.getAttribute('src')); if (!h) return; jobs.push(send('GET', h).then(r => { if (r.status === 200) { const s = doc.createElement('script'); s.textContent = r.body; sc.replaceWith(s); } else sc.replaceWith(doc.createComment(`script ${h} → ${r.status}`)); })); });
      doc.querySelectorAll('img[src]').forEach(im => { const h = same(im.getAttribute('src')); if (!h) return; jobs.push(send('GET', h).then(r => {
        const ct = (r.headers && r.headers['content-type']) || '';
        if (r.status === 200 && /^data:/.test(r.body || '')) im.src = r.body;
        else if (r.status === 200 && /svg/.test(ct)) im.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(r.body);
        else if (r.status !== 200) { im.alt = im.alt || `missing image ${new URL(h).pathname}`; im.removeAttribute('src'); }
      })); });
      await Promise.all(jobs);
      // relative URLs in the page (links, location.href = "/x") resolve against the fake server URL
      const shim = `<base href="${attr(url)}"><script>window.__PAGE_URL__=${JSON.stringify(url)};<\/script>` + PAGE_SHIM;
      let out = '<!DOCTYPE html>' + doc.documentElement.outerHTML;
      out = /<head[^>]*>/i.test(out) ? out.replace(/<head([^>]*)>/i, (m, a) => `<head${a}>${shim}`) : shim + out;
      page.srcdoc = out;
    }
    host.querySelector('#goBtn').onclick = () => navigate(urlBox.value, 'GET');
    urlBox.onkeydown = e => { if (e.key === 'Enter') navigate(urlBox.value, 'GET'); };
    host.querySelector('#reloadBtn').onclick = () => navigate(urlBox.value, 'GET', null, { noHistory: true });
    host.querySelector('#backBtn').onclick = () => { if (hi > 0) { hi--; navigate(hist[hi], 'GET', null, { noHistory: true }); } };
    const onMsg = e => {
      if (e.source !== page.contentWindow || !e.data) return;
      if (e.data.__nav) navigate(e.data.url, e.data.method || 'GET', e.data.data);
      if (e.data.__pagelog) con.row(e.data.kind === 'err' ? 'err' : 'log', '[page] ' + e.data.text);
      if (e.data.__fetch) send(e.data.method, e.data.url, e.data.headers, e.data.body).then(r => page.contentWindow.postMessage({ __fetchReply: true, id: e.data.id, status: r.status, headers: r.headers, body: r.body }, '*'));
    };
    window.addEventListener('message', onMsg);

    /* ----- postman ----- */
    const authSel = host.querySelector('#pmAuth'), authFields = host.querySelector('#pmAuthFields');
    const renderAuth = () => { authFields.innerHTML = authSel.value === 'basic' ? '<input id="pmUser" placeholder="username" class="pm-in"><input id="pmPass" placeholder="password" class="pm-in">' : authSel.value === 'bearer' ? '<input id="pmToken" placeholder="token" class="pm-in pm-wide">' : ''; };
    authSel.onchange = renderAuth; renderAuth();
    const bodyType = host.querySelector('#pmBodyType'), bodyBox = host.querySelector('#pmBody');
    bodyType.onchange = () => { bodyBox.placeholder = bodyType.value === 'form' ? 'name=Angela\nage=12' : bodyType.value === 'json' ? '{ "name": "Angela" }' : ''; };
    host.querySelector('#pmSend').onclick = async () => {
      const headers = {};
      host.querySelector('#pmHeaders').value.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) headers[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim(); });
      if (authSel.value === 'basic') headers.authorization = 'Basic ' + btoa(`${(host.querySelector('#pmUser') || {}).value || ''}:${(host.querySelector('#pmPass') || {}).value || ''}`);
      if (authSel.value === 'bearer') headers.authorization = 'Bearer ' + ((host.querySelector('#pmToken') || {}).value || '');
      let body;
      if (bodyType.value === 'form') { const o = {}; bodyBox.value.split('\n').forEach(l => { const i = l.indexOf('='); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1); }); body = new URLSearchParams(o).toString(); headers['content-type'] = 'application/x-www-form-urlencoded'; }
      if (bodyType.value === 'json') { body = bodyBox.value; headers['content-type'] = 'application/json'; }
      const method = host.querySelector('#pmMethod').value, url = host.querySelector('#pmUrl').value;
      const out = host.querySelector('#pmResponse');
      out.innerHTML = '<div class="dim">sending…</div>';
      let u; try { u = new URL(url); } catch (e) { out.innerHTML = '<div class="sql-err">Bad URL</div>'; return; }
      if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname)) { out.innerHTML = '<div class="sql-err">Only localhost servers can be reached from here. Use axios inside your server for outside APIs.</div>'; return; }
      const res = await send(method, url, headers, body);
      const ct = res.headers['content-type'] || '';
      out.innerHTML = res.error ? `<div class="sql-err">${esc(res.error)}</div>` : `
        <div class="pm-status"><span class="code c${String(res.status)[0]}">${res.status || '—'}</span> ${esc(STATUS_TEXT[res.status] || (res.hung ? 'no response (handler never replied)' : ''))} <span class="dim">${res.ms} ms · ${(res.body || '').length} bytes</span></div>
        <div class="pm-headers">${Object.keys(res.headers).map(k => `<div><b>${esc(k)}</b>: ${esc([].concat(res.headers[k]).join(', '))}</div>`).join('')}</div>
        <pre class="pm-body">${esc(ct.includes('json') ? pretty(res.body) : res.body)}</pre>`;
    };
    const STATUS_TEXT = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error' };

    function showTab(name) {
      host.querySelectorAll('.ctab').forEach(b => b.classList.toggle('on', b.dataset.ct === name));
      host.querySelectorAll('.cpane').forEach(p => p.classList.toggle('on', p.dataset.cp === name));
    }
    host.querySelectorAll('.ctab').forEach(b => b.onclick = () => showTab(b.dataset.ct));
    host.querySelector('#runBtn').onclick = run;
    host.querySelector('#clearCon').onclick = () => con.clear();
    const resetBtn = host.querySelector('#resetDb');
    if (resetBtn) resetBtn.onclick = async () => { await database.close(); toast('Database reset'); run(); };
    con.row('meta', 'Press ▶ Run to start your server, then use the browser or Postman panel.');
    if (lesson.autoRun !== false) run();

    return () => { window.removeEventListener('message', onMsg); if (sb) sb.destroy(); sb = null; if (database) database.close(); wb.destroy(); };
  }

  /* ---------- self-test: run the solution and send the smoke requests ---------- */
  function selftest(lesson) {
    return new Promise(resolve => {
      const files = Object.assign({}, lesson.files, lesson.solution || {});
      const errors = []; let ports = [];
      const answers = String(lesson.answers || '').split(/\n/).map(s => s.trim()).filter(Boolean);
      const database = lesson.db ? pageDatabase(lesson.db.seed || '') : null;
      const finish = () => { sb.destroy(); if (database) database.close(); clearTimeout(tm); resolve({ ok: errors.length === 0, errors }); };
      const tm = setTimeout(() => { errors.push('timed out starting'); finish(); }, lesson.db ? 60000 : 15000);
      const sb = createSandbox(async m => {
        if (m.type === 'log' && m.kind === 'err') errors.push(m.text.split('\n')[0]);
        if (m.type === 'listening') ports.push(m.port);
        if (m.type === 'pg') { if (database) database.handle(m, sb); else sb.post({ type: 'pgres', id: m.id, error: 'no database in this lesson' }); }
        if (m.type === 'input') sb.post({ type: 'input', id: m.id, value: answers.shift() || 'https://example.com' });
        if (m.type === 'ready') {
          const jar = cookieJar();
          const smoke = lesson.smoke || (ports.length ? [{ method: 'GET', path: lesson.start || '/' }] : []);
          for (const s of smoke) {
            const port = s.port || lesson.port || ports[0] || 3000;
            const headers = Object.assign({}, s.headers || {}); const c = jar.header(); if (c) headers.cookie = c;
            let body = s.body;
            if (body && typeof body === 'object') { body = new URLSearchParams(body).toString(); headers['content-type'] = 'application/x-www-form-urlencoded'; }
            if (s.json) { body = JSON.stringify(s.json); headers['content-type'] = 'application/json'; }
            const res = await sb.request({ method: s.method || 'GET', url: `http://localhost:${port}${s.path || '/'}`, headers, body });
            if (res.headers && res.headers['set-cookie']) jar.apply(res.headers['set-cookie']);
            const want = s.expect || (res.status >= 300 && res.status < 400 ? res.status : 200);
            if (res.error) errors.push(`${s.method || 'GET'} ${s.path}: ${res.error}`);
            else if (res.status !== want && !(want === 200 && res.status < 400)) errors.push(`${s.method || 'GET'} ${s.path} → ${res.status} (expected ${want})`);
          }
          finish();
        }
      });
      sb.ready.then(async () => {
        if (database) { try { await database.get(); } catch (e) { errors.push('Postgres could not start: ' + e.message); } }
        sb.post({ type: 'init', files, entries: lesson.run || ['index.js'], db: !!lesson.db, env: lesson.env || {} });
      });
    });
  }

  PG.registerKit('node', { mount, selftest, tabLabel: 'Build', createSandbox, cookieJar, pageDatabase });
})();
