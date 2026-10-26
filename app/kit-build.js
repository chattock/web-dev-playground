/* =========================================================================
   Kit: build (HTML / CSS / JS pages) and js (console-first scripts)
   Files: index.html, style.css, script.js — any subset. The page runs in a
   sandboxed iframe with console/alert/prompt piped to the console panel.
   ========================================================================= */
(function () {
  const { esc, attr, store, consolePanel, workbench } = PG;

  /* Piped console, alert and prompt, plus a tiny synth standing in for the
     course's sound files (sounds/*.mp3), so the drum kit and Simon work
     without shipping audio. */
  const SHIM = `
<script>
(function(){
  var answers = [], ai = 0;
  try { answers = (window.__PG_ANSWERS__ || []); } catch(e){}
  function fmt(v){
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.stack || String(v);
    if (v && v.nodeType === 1) return '<' + v.tagName.toLowerCase() + (v.id ? ' id="' + v.id + '"' : '') + (v.className ? ' class="' + v.className + '"' : '') + '>';
    if (v && v.nodeType) return String(v.nodeName);
    try { return JSON.stringify(v, function(k,val){ return typeof val==='function' ? '[Function]' : val; }, 1); }
    catch(e){ return String(v); }
  }
  function send(kind, parts){
    parent.postMessage({ __pg:true, kind:kind, text: parts.map(fmt).join(' ') }, '*');
  }
  ['log','info','debug','table'].forEach(function(m){
    var o = console[m] ? console[m].bind(console) : function(){};
    console[m] = function(){ send('log', [].slice.call(arguments)); o.apply(null, arguments); };
  });
  console.warn  = (function(o){ return function(){ send('warn', [].slice.call(arguments)); o.apply(console, arguments); }; })(console.warn.bind(console));
  console.error = (function(o){ return function(){ send('err',  [].slice.call(arguments)); o.apply(console, arguments); }; })(console.error.bind(console));
  window.alert = function(m){ send('alert', [m]); };
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

  function buildDoc(files, answers, lesson) {
    let html = files['index.html'] != null ? files['index.html']
      : '<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body>\n</body></html>';
    const css = files['style.css'] || '';
    const js  = files['script.js'] || '';

    // strip the course footer credit if it came from the repo
    html = html.replace(/\s*<footer>Made with[^<]*<\/footer>/gi, '');
    // local stylesheet links stand in for the CSS pane, which goes where the first
    // such link was so it still comes after framework CSS such as Bootstrap;
    // local script tags stand in for the JS pane
    const CSS_MARK = '<!--pg-css-->';
    let marked = false;
    html = html.replace(/<link[^>]+href=["'](?:\.\/)?(?:css\/)?(style|styles|solution|index)\.css["'][^>]*>/gi,
      () => { if (marked) return ''; marked = true; return CSS_MARK; });
    html = html.replace(/<script[^>]+src=["'](?:\.\/)?(?:js\/)?(script|index|main|solution)\.js["'][^>]*><\/script>/gi, '');

    const answersJs = `<script>window.__PG_ANSWERS__=${JSON.stringify(answers || [])};<\/script>`;
    // offline fallbacks for the CDN copies the course uses — the CDN version
    // overrides them identically when online; absolute so a <base> tag can't move them
    const abs = p => new URL(p, location.href).href;
    let fallback = '';
    if (/bootstrap[^"']*\.min\.css/i.test(html)) fallback += `<link rel="stylesheet" href="${abs('vendor/bootstrap/bootstrap.min.css')}">`;
    if (/jquery[^"']*\.js/i.test(html) || lesson && lesson.jquery) fallback += `<script src="${abs('vendor/jquery/jquery.min.js')}"><\/script>`;
    // a lesson can pretend its page lives somewhere else, so that relative
    // paths like ./cat.png and images/dice1.png resolve against a real folder
    const baseTag = lesson && lesson.previewBase ? `<base href="${abs(lesson.previewBase)}">` : '';
    const head = baseTag + answersJs + fallback + SHIM;
    const cssTag = css ? `\n<style>\n${css}\n</style>\n` : '';

    if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, `<head$1>\n${head}`);
    else html = head + html;
    // no stylesheet link in the page: the CSS goes last in the head (or straight after the shim)
    if (html.includes(CSS_MARK)) html = html.replace(CSS_MARK, () => cssTag);
    else if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, () => cssTag + '</head>');
    else html = html.replace(SHIM, () => SHIM + cssTag);

    if (js) {
      const tag = `\n<script>\ntry{\n${js}\n}catch(e){ console.error(e); }\n<\/script>\n`;
      if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, tag + '</body>');
      else html += tag;
    }
    if (/bootstrap\.bundle/i.test(html) && !/vendor\/bootstrap\/bootstrap\.bundle/.test(html)) {
      html = html.replace(/<\/body>/i, `<script src="${abs('vendor/bootstrap/bootstrap.bundle.min.js')}"><\/script></body>`);
    }
    return html;
  }

  function mount(lesson, host) {
    const isJs = lesson.kind === 'js';
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
          <span style="flex:1"></span>
          <button class="btn ghost" id="popBtn" title="Open the preview in its own tab">↗ open</button>
        </div>
        <div class="preview-shell">
          ${isJs ? '' : '<div class="frame-wrap"><iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"></iframe></div>'}
          <div class="console-head">
            Console
            <span style="flex:1"></span>
            <span style="text-transform:none;letter-spacing:0">Prompt answers:</span>
            <input class="answers" id="answersBox" placeholder="one per line ⏎ or comma"
                   value="${attr(store.getAnswers(lesson.id) || lesson.answers || '')}">
            <button class="btn ghost" id="clearCon">clear</button>
          </div>
          <div class="console ${isJs ? 'big' : ''}" id="console"></div>
          ${isJs ? '<div class="frame-wrap" style="flex:0 0 130px"><iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"></iframe></div>' : ''}
        </div>`,
      onRun: files => run(files),
    });
    const con = consolePanel(host.querySelector('#console'));
    function getAnswers() {
      const box = host.querySelector('#answersBox');
      if (!box) return [];
      return box.value.split(/[\n,]/).map(s => s.trim()).filter(s => s !== '');
    }
    function run(files) {
      const frame = host.querySelector('#frame');
      if (!frame) return;
      con.clear();
      frame.srcdoc = buildDoc(files || wb.readFiles(), getAnswers(), lesson);
    }
    host.querySelector('#runBtn').onclick = () => run();
    host.querySelector('#clearCon').onclick = () => con.clear();
    host.querySelector('#answersBox').oninput = e => { store.answers(lesson.id, e.target.value); run(); };
    host.querySelector('#popBtn').onclick = () => {
      const w = window.open('', '_blank');
      w.document.open(); w.document.write(buildDoc(wb.readFiles(), getAnswers(), lesson)); w.document.close();
    };
    const widthSel = host.querySelector('#widthSel');
    if (widthSel) widthSel.onchange = () => {
      const f = host.querySelector('#frame');
      f.style.width = widthSel.value;
      f.parentElement.classList.toggle('narrow', widthSel.value !== '100%');
    };
    const onMsg = e => { if (e.data && e.data.__pg && e.source === (host.querySelector('#frame') || {}).contentWindow) con.row(e.data.kind, e.data.text); };
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
      const answers = String(lesson.answers || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
      f.srcdoc = buildDoc(files, answers, lesson);
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
