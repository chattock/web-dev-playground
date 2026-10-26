/* =========================================================================
   Kit: react — JSX compiled in the browser with Babel, rendered in a sandboxed
   iframe with React 18. Files are a small project:
     index.js | index.jsx       entry (ReactDOM.createRoot(...).render(<App />))
     App.jsx, components/*.jsx  components, imported with ES module syntax
     styles.css                 injected as a stylesheet
     *.js                       plain data modules (export default [...])
   `import` of react, react-dom, react-dom/client and a few course libraries
   (@mui/icons-material/*, @mui/material/*) resolve to built-ins.
   ========================================================================= */
(function () {
  const { esc, attr, store, consolePanel, workbench } = PG;

  const abs = p => new URL(p, location.href).href;

  const RUNTIME = `
(function(){
  function fmt(v){ return window.pgInspect ? pgInspect(v, false) : String(v); }
  function printf(parts){
    if (typeof parts[0] !== 'string' || !/%[sdifoOc]/.test(parts[0])) return parts;
    var i = 1;
    var first = parts[0].replace(/%([sdifoOc%])/g, function(m, f){
      if (f === '%') return '%';
      if (i >= parts.length) return m;
      var v = parts[i++];
      if (f === 'c') return '';
      if (f === 'd' || f === 'i') return String(parseInt(v, 10));
      if (f === 'f') return String(parseFloat(v));
      return typeof v === 'string' ? v : fmt(v);
    });
    return [first].concat(parts.slice(i));
  }
  function send(kind, parts){ parent.postMessage({ __pg:true, kind:kind, text: printf(parts).map(fmt).join(' ') }, '*'); }
  ['log','info','debug','table','dir'].forEach(function(m){ var o = console[m].bind(console); console[m] = function(){ send('log', [].slice.call(arguments)); o.apply(null, arguments); }; });
  console.warn  = (function(o){ return function(){ send('warn', [].slice.call(arguments)); o.apply(console, arguments); }; })(console.warn.bind(console));
  console.error = (function(o){ return function(){ var parts = [].slice.call(arguments); var text = String(parts[0] || ''); send(/^Warning:/.test(text) ? 'warn' : 'err', parts); o.apply(console, arguments); }; })(console.error.bind(console));
  window.alert = function(m){ send('alert', [m]); };
  window.onerror = function(m){ send('err', [m]); };
  window.addEventListener('unhandledrejection', function(e){ send('err', [String(e.reason)]); });

  var FILES = window.__FILES__ || {};
  var cache = {};

  /* --- built-in modules --- */
  function icon(name, path){ return function(props){ props = props || {};
    return React.createElement('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', width:24, height:24, fill:'currentColor', className: 'mui-icon ' + (props.className||''), style: props.style, 'aria-label': name },
      React.createElement('path', { d: path })); }; }
  var ICONS = {
    Add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    Delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    Edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    Check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    Close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    Favorite: 'm12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    Highlight: 'M6 14l3 3v5h6v-5l3-3V9H6v5zm5-12h2v3h-2V2zM3.5 5.88l1.41-1.41 2.12 2.12L5.62 8 3.5 5.88zm13.46.71 2.12-2.12 1.41 1.41L18.38 8l-1.42-1.41z',
    Note: 'M22 10l-6-6H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99l16-.01c1.1 0 2-.89 2-1.99v-8zm-7-4.5 5.5 5.5H15V5.5z',
    Search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    Menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    Star: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    Send: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
    Save: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
  };
  function Fab(props){ var p = Object.assign({ type: 'button' }, props); delete p.children; var cls = 'mui-fab';
    return React.createElement('button', Object.assign({}, p, { className: cls + ' ' + (p.className||'') }), props.children); }
  // like MUI's Zoom: no wrapper element, the transform goes on the child itself
  function Zoom(props){
    var show = props.in !== false, child = React.Children.only(props.children);
    var style = Object.assign({}, child.props.style, { transform: show ? 'scale(1)' : 'scale(0)', transition: 'transform 225ms cubic-bezier(0.4, 0, 0.2, 1)' });
    return React.cloneElement(child, { style: style });
  }
  var BUILTINS = {
    'react': function(){ return React; },
    'react-dom': function(){ return ReactDOM; },
    'react-dom/client': function(){ return { createRoot: ReactDOM.createRoot, hydrateRoot: ReactDOM.hydrateRoot }; },
    '@mui/material/Fab': function(){ return { __esModule:true, default: Fab }; },
    '@mui/material/Zoom': function(){ return { __esModule:true, default: Zoom }; },
    '@mui/material': function(){ return { Fab: Fab, Zoom: Zoom }; },
    'uuid': function(){ return { v4: function(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){ var r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }); } }; },
  };
  function builtin(name){
    if (BUILTINS[name]) return BUILTINS[name]();
    var m = name.match(/^@mui\\/icons-material\\/(\\w+)$/);
    if (m) return { __esModule:true, default: icon(m[1], ICONS[m[1]] || ICONS.Star) };
    if (name === '@mui/icons-material') { var o = {}; Object.keys(ICONS).forEach(function(k){ o[k] = icon(k, ICONS[k]); }); return o; }
    return null;
  }

  /* --- resolver over the file map --- */
  function normalize(path){
    var parts = [], segs = path.split('/');
    for (var i = 0; i < segs.length; i++){ var s = segs[i]; if (!s || s === '.') continue; if (s === '..') parts.pop(); else parts.push(s); }
    return parts.join('/');
  }
  function resolve(spec, from){
    var base = from.split('/').slice(0, -1).join('/');
    var p = normalize((spec.startsWith('/') ? spec.slice(1) : base ? base + '/' + spec : spec));
    var tries = [p, p + '.jsx', p + '.js', p + '.json', p + '/index.jsx', p + '/index.js'];
    for (var i = 0; i < tries.length; i++) if (FILES[tries[i]] != null) return tries[i];
    return null;
  }
  function req(spec, from){
    if (!spec.startsWith('.') && !spec.startsWith('/')) {
      var b = builtin(spec);
      if (b) return b;
      throw new Error('Cannot find module "' + spec + '" — this playground only bundles react, react-dom and a few course libraries.');
    }
    var file = resolve(spec, from);
    if (!file) throw new Error('Cannot find file "' + spec + '" imported from ' + from);
    if (cache[file]) return cache[file].exports;
    var mod = { exports: {} }; cache[file] = mod;
    if (file.endsWith('.css')) { var st = document.createElement('style'); st.textContent = FILES[file]; document.head.appendChild(st); return mod.exports; }
    if (file.endsWith('.json')) { mod.exports = JSON.parse(FILES[file]); return mod.exports; }
    var out;
    try {
      out = Babel.transform(FILES[file], { filename: file, presets: [['env', { modules: 'commonjs', targets: { chrome: '90' } }], 'react'], sourceType: 'module' }).code;
    } catch (e) { throw new Error('Syntax error in ' + file + ': ' + e.message.replace(/^unknown: /, '')); }
    if (window.LoopGuard) out = LoopGuard.instrument(out);
    var fn = new Function('require', 'module', 'exports', 'React', out);
    fn(function(s){ return req(s, file); }, mod, mod.exports, React);
    return mod.exports;
  }

  window.__run = function(entry){
    try { req('./' + entry, ''); }
    catch (e) { send('err', [e.message || String(e)]); }
  };
})();
`;

  const BASE_CSS = `
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;}
  .mui-fab{position:relative;border:none;border-radius:50%;width:36px;height:36px;background:#f5ba13;color:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3);}
  .mui-fab:hover{filter:brightness(1.05);}
  .mui-icon{width:1em;height:1em;font-size:24px;}
  .mui-zoom{display:inline-block;transition:transform .2s;transform:scale(1);}
  .mui-zoom.out{transform:scale(0);}
  `;

  function entryOf(files) {
    const names = Object.keys(files);
    return ['index.jsx', 'index.js', 'main.jsx', 'main.js', 'App.jsx', 'App.js'].find(n => files[n] != null) || names.find(n => /\.jsx?$/.test(n));
  }

  function buildDoc(files, lesson) {
    const entry = entryOf(files);
    const html = files['index.html'] || `<div id="root"></div>`;
    let bodyInner = /<body[^>]*>([\s\S]*)<\/body>/i.test(html) ? html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1] : html;
    // the entry file is run by the module loader, so drop local script tags from the page
    bodyInner = bodyInner.replace(/<script[^>]+src=["'](?!https?:)[^"']+["'][^>]*><\/script>/gi, '');
    const css = files['styles.css'] || files['style.css'] || files['index.css'] || '';
    // fonts and other external stylesheets the page's own <head> asks for
    const headHtml = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1];
    const headExtras = (headHtml.match(/<link\b[^>]*>/gi) || []).filter(l => /\bhref=["'](https?:)?\/\//i.test(l))
      .concat(headHtml.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n');
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${BASE_CSS}</style>
${headExtras}
<script src="${abs('app/sandbox/loop-guard.js')}"><\/script>
<script src="${abs('app/sandbox/inspect.js')}"><\/script>
<script>var __pgGuard = window.LoopGuard ? new Function(LoopGuard.source + '\\nreturn __pgGuard;')() : function(){};<\/script>
<link rel="stylesheet" href="${abs('vendor/bootstrap/bootstrap-icons.min.css')}">
<script src="${abs('vendor/react/react.development.js')}"><\/script>
<script src="${abs('vendor/react/react-dom.development.js')}"><\/script>
<script src="${abs('vendor/babel/babel.min.js')}"><\/script>
<style>${css}</style>
</head><body>${bodyInner}
<script>window.__FILES__=${JSON.stringify(files).replace(/<\//g, '<\\/')};<\/script>
<script>${RUNTIME}<\/script>
<script>${entry ? `window.__run(${JSON.stringify(entry)});` : 'parent.postMessage({__pg:true,kind:"err",text:"No entry file (index.jsx) found."},"*");'}<\/script>
</body></html>`;
  }

  function mount(lesson, host) {
    const wb = workbench(host, lesson, {
      autoRun: true, delay: 600,
      output: `
        <div class="out-bar">
          <button class="btn primary" id="runBtn">▶ Run</button>
          <span class="hint-inline">JSX is compiled in your browser with Babel</span>
          <span style="flex:1"></span>
          <button class="btn ghost" id="popBtn" title="Open the preview in its own tab">↗ open</button>
        </div>
        <div class="preview-shell">
          <div class="frame-wrap"><iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-same-origin"></iframe></div>
          <div class="console-head">Console <span style="flex:1"></span><button class="btn ghost" id="clearCon">clear</button></div>
          <div class="console" id="console"></div>
        </div>`,
      onRun: files => run(files),
    });
    const con = consolePanel(host.querySelector('#console'));
    function run(files) { con.clear(); host.querySelector('#frame').srcdoc = buildDoc(files || wb.readFiles(), lesson); }
    host.querySelector('#runBtn').onclick = () => run();
    host.querySelector('#clearCon').onclick = () => con.clear();
    host.querySelector('#popBtn').onclick = () => { const w = window.open('', '_blank'); w.document.open(); w.document.write(buildDoc(wb.readFiles(), lesson)); w.document.close(); };
    const onMsg = e => { if (e.data && e.data.__pg && e.source === host.querySelector('#frame').contentWindow) con.row(e.data.kind, e.data.text); };
    window.addEventListener('message', onMsg);
    run();
    return () => { window.removeEventListener('message', onMsg); wb.destroy(); };
  }

  function selftest(lesson) {
    return new Promise(resolve => {
      const files = Object.assign({}, lesson.files, lesson.solution || {});
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-2000px;width:900px;height:600px';
      f.sandbox = 'allow-scripts allow-same-origin';
      const errors = [];
      const onMsg = e => { if (e.source === f.contentWindow && e.data && e.data.__pg && e.data.kind === 'err') errors.push(e.data.text); };
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
      f.srcdoc = buildDoc(files, lesson);
      setTimeout(() => {
        const rendered = f.contentDocument && f.contentDocument.body && f.contentDocument.body.innerText.trim().length > 0;
        window.removeEventListener('message', onMsg); f.remove();
        if (!rendered && !errors.length) errors.push('Nothing was rendered into the page.');
        resolve({ ok: errors.length === 0, errors });
      }, 2500);
    });
  }

  PG.registerKit('react', { mount, buildDoc, selftest, tabLabel: 'Build' });
})();
