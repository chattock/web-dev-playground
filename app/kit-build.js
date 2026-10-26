/* =========================================================================
   Kit: build (HTML / CSS / JS pages) and js (console-first scripts)
   Files: index.html, style.css, script.js — any subset, plus any other files
   a page links (more .html pages, styles.css, index.js, game.js…). The page
   runs in an iframe with console/alert/prompt piped to the console panel.

   How the files become one page:
   - <link rel="stylesheet" href="x.css">: inlined when x.css is a lesson file.
     A link to style(s).css that isn't a lesson file marks where the style.css
     pane goes (so it still comes after Bootstrap); with no such link the pane
     goes last in <head>.
   - <script src="x.js">: inlined in place when x.js is a lesson file (moved to
     the end of <body> when it has `defer`); other local scripts are dropped.
     script.js is always added at the end of <body>.
   - Links to other .html files in the lesson open that page in the preview.
   - Every loop gets a guard (app/sandbox/loop-guard.js) so an endless loop
     stops with an error instead of freezing the app.
   ========================================================================= */
(function () {
  const { esc, attr, store, consolePanel, workbench } = PG;
  const abs = p => new URL(p, location.href).href;
  const guard = code => (window.LoopGuard ? LoopGuard.instrument(code) : code);

  /* Piped console, alert and prompt, plus a tiny synth standing in for the
     course's sound files (sounds/*.mp3), so the drum kit and Simon work
     without shipping audio. */
  function shim() {
    return `
<script>
${window.LoopGuard ? LoopGuard.source : 'var __pgGuard = function(){};'}
var pgInspect = ${window.pgInspect ? window.pgInspect.toString() : 'function(v){ return String(v); }'};
(function(){
  var answers = [], ai = 0;
  try { answers = (window.__PG_ANSWERS__ || []); } catch(e){}
  function send(kind, parts){
    parent.postMessage({ __pg:true, kind:kind, text: parts.map(function(v){ return pgInspect(v, false); }).join(' ') }, '*');
  }
  ['log','info','debug','table','dir'].forEach(function(m){
    var o = console[m] ? console[m].bind(console) : function(){};
    console[m] = function(){ send('log', [].slice.call(arguments)); o.apply(null, arguments); };
  });
  console.warn  = (function(o){ return function(){ send('warn', [].slice.call(arguments)); o.apply(console, arguments); }; })(console.warn.bind(console));
  console.error = (function(o){ return function(){ send('err',  [].slice.call(arguments)); o.apply(console, arguments); }; })(console.error.bind(console));
  window.alert = function(m){ send('alert', [m === undefined ? '' : m]); };
  window.prompt = function(msg, def){
    var v = ai < answers.length ? answers[ai] : null;
    ai++;
    if (v === null){
      send('prompt', ['prompt("' + msg + '") → no answer queued, used "" · type answers in the Prompt answers box']);
      return '';
    }
    send('prompt', ['prompt("' + msg + '") → "' + v + '"']);
    return v;
  };
  window.confirm = function(m){ send('alert',[m + '  [auto-confirmed: true]']); return true; };
  window.onerror = function(m, s, l){ send('err', [m + (l ? '  (line ' + l + ')' : '')]); };
  window.addEventListener('unhandledrejection', function(e){ send('err', [String(e.reason)]); });

  /* ---- other pages of the lesson: <a href="about.html"> opens that file ---- */
  window.addEventListener('click', function(e){
    if (e.defaultPrevented) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^[a-z][\\w+.-]*:/i.test(href) || href.indexOf('//') === 0) return;
    var name;
    try { name = decodeURIComponent(new URL(href, 'http://x/' + (window.__PG_PAGE__ || 'index.html')).pathname.slice(1)); } catch(err) { return; }
    if (!name || /\\/$/.test(name)) name += 'index.html';
    e.preventDefault();
    parent.postMessage({ __pg:true, kind:'page', text: name }, '*');
  });

  /* ---- sound shim: new Audio("sounds/tom-1.mp3").play() ---- */
  var RealAudio = window.Audio, ctx = null;
  function ac(){ if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function tone(freq, dur, type, gain, decay){
    var c = ac(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (decay) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * decay), t + dur);
    g.gain.setValueAtTime(gain || 0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, gain, hp){
    var c = ac(), n = c.sampleRate * dur, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime;
    f.type = 'highpass'; f.frequency.value = hp || 800;
    s.buffer = buf; g.gain.setValueAtTime(gain || 0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var PATCH = {
    'tom-1': function(){ tone(180, 0.35, 'sine', 0.5, 0.4); },
    'tom-2': function(){ tone(150, 0.4, 'sine', 0.5, 0.4); },
    'tom-3': function(){ tone(120, 0.45, 'sine', 0.5, 0.4); },
    'tom-4': function(){ tone(95,  0.5, 'sine', 0.5, 0.4); },
    'snare': function(){ noise(0.18, 0.4, 1500); tone(200, 0.12, 'triangle', 0.3, 0.5); },
    'crash': function(){ noise(0.9, 0.25, 5000); },
    'kick-bass': function(){ tone(110, 0.3, 'sine', 0.8, 0.25); },
    'red':    function(){ tone(329.63, 0.3, 'sine', 0.3); },
    'green':  function(){ tone(392.00, 0.3, 'sine', 0.3); },
    'blue':   function(){ tone(440.00, 0.3, 'sine', 0.3); },
    'yellow': function(){ tone(523.25, 0.3, 'sine', 0.3); },
    'wrong':  function(){ tone(90, 0.45, 'sawtooth', 0.25); },
  };
  window.Audio = function(src){
    var m = String(src || '').match(/([\\w-]+)\\.(mp3|wav|ogg|m4a)$/i);
    var name = m ? m[1].toLowerCase() : null;
    if (!name || !/^(\\.\\/)?(sounds|audio)\\//i.test(String(src)) && !PATCH[name]) return new RealAudio(src);
    var a = { src: src, currentTime: 0, volume: 1, paused: true,
      play: function(){ try { (PATCH[name] || function(){ tone(440, 0.2, 'square', 0.2); })(); } catch(e){} a.paused = false; return Promise.resolve(); },
      pause: function(){ a.paused = true; }, load: function(){}, addEventListener: function(){}, removeEventListener: function(){} };
    return a;
  };
})();
<\/script>`;
  }

  function resolveRel(from, href) {
    try { return decodeURIComponent(new URL(href, 'http://x/' + from).pathname.slice(1)); } catch (e) { return href; }
  }
  const isRemote = u => /^(https?:)?\/\//i.test(u) || /^data:/i.test(u);
  const wrap = (code, isModule) => isModule ? `\n${guard(code)}\n` : `\ntry{\n${guard(code)}\n}catch(e){ console.error(e); }\n`;

  function buildDoc(files, answers, lesson, page) {
    page = page && files[page] != null ? page : 'index.html';
    let html = files[page] != null ? files[page]
      : '<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body>\n</body></html>';
    const pages = Object.keys(files).filter(n => /\.html?$/i.test(n));

    // strip the course footer credit if it came from the repo
    html = html.replace(/\s*<footer>Made with[^<]*<\/footer>/gi, '');
    let needJquery = !!(lesson && lesson.jquery) || /<script[^>]+src=["'][^"']*jquery[^"']*\.js/i.test(html);
    const needBootstrap = /<link[^>]+href=["'][^"']*bootstrap[^"']*\.css/i.test(html);

    // stylesheets
    const CSS_MARK = '<!--pg-css-->';
    let marked = false;
    const usedCss = new Set();
    html = html.replace(/<link\b[^>]*>/gi, tag => {
      if (!/\brel=["']?stylesheet/i.test(tag)) return tag;
      const m = tag.match(/\bhref=["']([^"']+)["']/i);
      if (!m || isRemote(m[1])) return tag;
      const name = resolveRel(page, m[1]);
      if (files[name] != null && name !== 'style.css') { usedCss.add(name); return `<style data-file="${attr(name)}">\n${files[name]}\n</style>`; }
      if (name === 'style.css' || /(^|\/)(style|styles|solution|index|main)\.css$/i.test(name)) {
        if (marked) return ''; marked = true; return CSS_MARK;
      }
      return tag;
    });
    const cssPane = files['style.css'] != null ? files['style.css'] : (files['styles.css'] != null && !usedCss.has('styles.css') ? files['styles.css'] : '');

    // scripts
    const usedJs = new Set(), deferred = [];
    html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, body) => {
      const isModule = /\btype=["']module["']/i.test(attrs);
      const sm = attrs.match(/\bsrc=["']([^"']+)["']/i);
      if (!sm) {
        if (/\btype=["']/i.test(attrs) && !/\btype=["'](text\/javascript|application\/javascript|module)["']/i.test(attrs)) return whole;   // JSON, templates…
        return `<script${attrs}>${wrap(body, isModule)}<\/script>`;
      }
      const src = sm[1];
      if (isRemote(src)) return whole;                         // CDN scripts stay
      const name = resolveRel(page, src);
      if (/jquery/i.test(name)) { needJquery = true; return ''; }
      if (name === 'script.js') return '';                     // the JS pane goes at the end of <body>
      if (files[name] != null && /\.m?js$/i.test(name)) {
        usedJs.add(name);
        const tag = `<script${attrs.replace(/\s*\bsrc=["'][^"']+["']/i, '').replace(/\s*\b(defer|async)\b/gi, '')}>${wrap(files[name], isModule)}<\/script>`;
        if (/\bdefer\b/i.test(attrs)) { deferred.push(tag); return ''; }
        return tag;
      }
      return '';                                               // a local script that isn't in the lesson would 404
    });
    const jsPane = files['script.js'] != null ? files['script.js'] : (files['index.js'] != null && !usedJs.has('index.js') ? files['index.js'] : '');

    const answersJs = `<script>window.__PG_ANSWERS__=${JSON.stringify(answers || [])};window.__PG_PAGE__=${JSON.stringify(page)};window.__PG_PAGES__=${JSON.stringify(pages)};<\/script>`;
    // offline fallbacks for the CDN copies the course uses — the CDN version
    // overrides them identically when online; absolute so a <base> tag can't move them
    let fallback = '';
    if (needBootstrap) fallback += `<link rel="stylesheet" href="${abs('vendor/bootstrap/bootstrap.min.css')}">`;
    if (needJquery) fallback += `<script src="${abs('vendor/jquery/jquery.min.js')}"><\/script>`;
    // a lesson can pretend its page lives somewhere else, so that relative
    // paths like ./cat.png and images/dice1.png resolve against a real folder
    const baseTag = lesson && lesson.previewBase ? `<base href="${abs(lesson.previewBase)}">` : '';
    const SHIM = shim();
    const head = baseTag + answersJs + fallback + SHIM;
    const cssTag = cssPane ? `\n<style>\n${cssPane}\n</style>\n` : '';

    if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, (m, a) => `<head${a}>\n${head}`);
    else html = head + html;
    if (html.includes(CSS_MARK)) html = html.replace(CSS_MARK, () => cssTag);
    else if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, () => cssTag + '</head>');
    else html = html.replace(SHIM, () => SHIM + cssTag);

    const tail = deferred.join('\n') + (jsPane ? `\n<script>${wrap(jsPane)}<\/script>\n` : '');
    if (tail) {
      if (/<\/body>/i.test(html)) html = html.replace(/<\/body>(?![\s\S]*<\/body>)/i, () => tail + '</body>');
      else html += tail;
    }
    // offline fallback for Bootstrap's JavaScript: only when the CDN copy didn't load,
    // because two copies make dropdowns open and close again straight away
    if (/bootstrap\.bundle/i.test(html) && !/vendor\/bootstrap\/bootstrap\.bundle/.test(html)) {
      const local = abs('vendor/bootstrap/bootstrap.bundle.min.js');
      html = html.replace(/<\/body>(?![\s\S]*<\/body>)/i, () => `<script>if (!window.bootstrap) { var s = document.createElement('script'); s.src = ${JSON.stringify(local)}; document.body.appendChild(s); }<\/script></body>`);
    }
    return html;
  }

  function splitAnswers(s) {
    s = String(s || '');
    return s.split(/[\n,]/).map(x => x.trim()).filter(x => x !== '');
  }

  function mount(lesson, host) {
    const isJs = lesson.kind === 'js';
    const pages = Object.keys(lesson.files).filter(n => /\.html?$/i.test(n));
    let currentPage = pages.includes('index.html') ? 'index.html' : (pages[0] || 'index.html');
    const wb = workbench(host, lesson, {
      autoRun: true,
      className: isJs ? 'js-layout' : '',
      output: `
        <div class="out-bar">
          <button class="btn primary" id="runBtn">▶ Run</button>
          ${isJs ? '' : `
            <select class="btn" id="widthSel" title="Preview width">
              <option value="100%">Full width</option>
              <option value="1200px">Desktop 1200</option>
              <option value="768px">Tablet 768</option>
              <option value="375px">Phone 375</option>
            </select>`}
          ${pages.length > 1 ? `<select class="btn" id="pageSel" title="Page shown in the preview">${pages.map(p => `<option ${p === currentPage ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select>` : ''}
          <span class="page-title" id="pageTitle" title="The page's &lt;title&gt;"></span>
          <span style="flex:1"></span>
          <button class="btn ghost" id="popBtn" title="Open the preview in its own tab">↗ open</button>
        </div>
        <div class="preview-shell">
          ${isJs ? '' : '<div class="frame-wrap"><iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"></iframe></div>'}
          <div class="console-head">
            Console
            <span style="flex:1"></span>
            <span style="text-transform:none;letter-spacing:0">Prompt answers:</span>
            <input class="answers" id="answersBox" placeholder="comma-separated, e.g. Ada, 25"
                   value="${attr(String(store.getAnswers(lesson.id) || lesson.answers || '').replace(/\n/g, ', '))}">
            <button class="btn ghost" id="clearCon">clear</button>
          </div>
          <div class="console ${isJs ? 'big' : ''}" id="console"></div>
          ${isJs ? '<div class="frame-wrap" style="flex:0 0 130px"><iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"></iframe></div>' : ''}
        </div>`,
      onRun: files => run(files),
    });
    const con = consolePanel(host.querySelector('#console'));
    const frame = host.querySelector('#frame');
    const getAnswers = () => splitAnswers((host.querySelector('#answersBox') || {}).value);
    function run(files) {
      con.clear();
      frame.srcdoc = buildDoc(files || wb.readFiles(), getAnswers(), lesson, currentPage);
    }
    frame.addEventListener('load', () => {
      let t = '';
      try { t = frame.contentDocument && frame.contentDocument.title; } catch (e) {}
      const el = host.querySelector('#pageTitle');
      if (el) el.textContent = isJs ? '' : (t ? `📄 ${t}` : (pages.length > 1 ? '' : ''));
    });
    const pageSel = host.querySelector('#pageSel');
    if (pageSel) pageSel.onchange = () => { currentPage = pageSel.value; run(); };
    host.querySelector('#runBtn').onclick = () => run();
    host.querySelector('#clearCon').onclick = () => con.clear();
    host.querySelector('#answersBox').oninput = e => { store.answers(lesson.id, e.target.value); run(); };
    host.querySelector('#popBtn').onclick = () => {
      const w = window.open('', '_blank');
      w.document.open(); w.document.write(buildDoc(wb.readFiles(), getAnswers(), lesson, currentPage)); w.document.close();
    };
    const widthSel = host.querySelector('#widthSel');
    if (widthSel) widthSel.onchange = () => {
      frame.style.width = widthSel.value;
      frame.parentElement.classList.toggle('narrow', widthSel.value !== '100%');
    };
    const onMsg = e => {
      if (!e.data || !e.data.__pg || e.source !== frame.contentWindow) return;
      if (e.data.kind === 'page') {
        const name = e.data.text;
        const files = wb.readFiles();
        if (files[name] != null) {
          currentPage = name;
          if (pageSel) pageSel.value = name;
          run(files);
        } else {
          con.row('warn', `The link goes to ${name}, which isn't one of this lesson's files. Only the files in the editor can be opened here.`);
        }
        return;
      }
      con.row(e.data.kind, e.data.text);
    };
    window.addEventListener('message', onMsg);
    run();
    return () => { window.removeEventListener('message', onMsg); wb.destroy(); };
  }

  /* Self-test: run the solution in a hidden frame and collect errors. */
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
      f.srcdoc = buildDoc(files, splitAnswers(lesson.answers), lesson);
      setTimeout(() => {
        window.removeEventListener('message', onMsg); f.remove();
        resolve({ ok: errors.length === 0, errors });
      }, 1500);
    });
  }

  const kit = { mount, buildDoc, selftest, tabLabel: 'Build' };
  PG.registerKit('build', kit);
  PG.registerKit('js', Object.assign({}, kit, { tabLabel: 'Code' }));
})();
