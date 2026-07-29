/* =========================================================================
   Web Dev Playground — engine
   Lessons register themselves via PG.add({...}) from data/sNN.js
   ========================================================================= */
const PG = (function () {

  const SECTIONS = [
    { id:'s01', n:'Section 1',  title:'Front-End Web Dev',    desc:'How the web works and what the three languages do.' },
    { id:'s02', n:'Section 2',  title:'Introduction to HTML', desc:'Headings, paragraphs and void elements.' },
    { id:'s03', n:'Section 3',  title:'Intermediate HTML',    desc:'Lists, nesting, links and images.' },
    { id:'s04', n:'Section 4',  title:'Multi-Page Websites',  desc:'File paths and linking pages together.' },
    { id:'s05', n:'Section 5',  title:'Introduction to CSS',  desc:'Where CSS goes and how selectors target things.' },
    { id:'s06', n:'Section 6',  title:'CSS Properties',       desc:'Colours, fonts and the box model.' },
    { id:'s07', n:'Section 7',  title:'Intermediate CSS',     desc:'The cascade, combining selectors, positioning.' },
    { id:'s08', n:'Section 8',  title:'Advanced CSS',         desc:'Display, float, responsiveness and media queries.' },
    { id:'s09', n:'Section 9',  title:'Flexbox',              desc:'One-dimensional layout with total control.' },
    { id:'s10', n:'Section 10', title:'Grid',                 desc:'Two-dimensional layout: rows and columns.' },
    { id:'s11', n:'Section 11', title:'Bootstrap',            desc:'A framework of ready-made components.' },
    { id:'s14', n:'Section 14', title:'JavaScript ES6',       desc:'Variables, strings, numbers and functions.' },
    { id:'s15', n:'Section 15', title:'Intermediate JS',      desc:'Randomness, logic, arrays and loops.' },
  ];

  const lessons = [];
  const byId = {};
  const editors = {};          // current CodeMirror instances
  let current = null;          // current lesson
  let showingSolution = false;
  let runTimer = null;

  /* ---------------- storage ---------------- */
  const KEY = 'wdplay:';
  const store = {
    code(id, files)   { try { localStorage.setItem(KEY+'code:'+id, JSON.stringify(files)); } catch(e){} },
    getCode(id)       { try { return JSON.parse(localStorage.getItem(KEY+'code:'+id)||'null'); } catch(e){ return null; } },
    clearCode(id)     { localStorage.removeItem(KEY+'code:'+id); },
    done(id, v)       { try { localStorage.setItem(KEY+'done:'+id, v?'1':''); } catch(e){} },
    isDone(id)        { return !!localStorage.getItem(KEY+'done:'+id); },
    answers(id, v)    { try { localStorage.setItem(KEY+'ans:'+id, v); } catch(e){} },
    getAnswers(id)    { return localStorage.getItem(KEY+'ans:'+id) || ''; },
  };

  /* ---------------- registration ---------------- */
  function add(lesson) {
    lesson.files = lesson.files || {};
    lesson.solution = lesson.solution || null;
    lesson.explore = lesson.explore || [];
    lessons.push(lesson);
    byId[lesson.id] = lesson;
  }

  function lessonsOf(sec) { return lessons.filter(l => l.section === sec); }

  /* ---------------- document assembly ---------------- */
  const SHIM = `
<script>
(function(){
  var answers = [], ai = 0;
  try { answers = (window.__PG_ANSWERS__ || []); } catch(e){}
  function fmt(v){
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.stack || String(v);
    try { return JSON.stringify(v, function(k,val){ return typeof val==='function' ? '[Function]' : val; }, 1); }
    catch(e){ return String(v); }
  }
  function send(kind, parts){
    parent.postMessage({ __pg:true, kind:kind, text: parts.map(fmt).join(' ') }, '*');
  }
  ['log','info','debug'].forEach(function(m){
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
  window.onerror = function(m, s, l){ send('err', [m + '  (line ' + l + ')']); };
})();
<\/script>`;

  function buildDoc(files, answers, previewBase) {
    let html = files.html != null ? files.html : '<!DOCTYPE html>\n<html><head></head><body>\n</body></html>';
    const css = files.css || '';
    const js  = files.js  || '';

    // strip the course footer credit if it came from the repo
    html = html.replace(/\s*<footer>Made with[^<]*<\/footer>/gi, '');
    // an external stylesheet link stands in for the CSS pane
    html = html.replace(/<link[^>]+href=["']\.\/?(style|solution)\.css["'][^>]*>/gi, '');
    // ditto an external script tag
    html = html.replace(/<script[^>]+src=["']\.\/?(script|index)\.js["'][^>]*><\/script>/gi, '');

    const answersJs = `<script>window.__PG_ANSWERS__=${JSON.stringify(answers || [])};<\/script>`;
    // if the page pulls Bootstrap off a CDN, load the vendored copy first as an
    // offline fallback — the CDN version overrides it identically when online
    // absolute so it survives a <base> tag below
    const bsHref = new URL('vendor/bootstrap/bootstrap.min.css', location.href).href;
    const bsFallback = /bootstrap[^"']*\.min\.css/i.test(html)
      ? `<link rel="stylesheet" href="${bsHref}">` : '';
    // a lesson can pretend its page lives somewhere else, so that relative paths
    // like ./cat.png and ../dog.png resolve against a real folder structure
    const baseTag = previewBase
      ? `<base href="${new URL(previewBase, location.href).href}">` : '';
    const head = baseTag + answersJs + bsFallback + SHIM + (css ? `\n<style>\n${css}\n</style>` : '');

    if (/<head[^>]*>/i.test(html)) html = html.replace(/<head([^>]*)>/i, `<head$1>\n${head}`);
    else html = head + html;

    if (js) {
      const tag = `\n<script>\ntry{\n${js}\n}catch(e){ console.error(e); }\n<\/script>\n`;
      if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, tag + '</body>');
      else html += tag;
    }
    return html;
  }

  /* ---------------- rendering: shell ---------------- */
  function renderNav() {
    document.getElementById('sectionNav').innerHTML = SECTIONS.map(s =>
      `<a href="#/${s.id}" data-sec="${s.id}">${s.n.replace('Section ','S')}</a>`).join('');
  }

  function renderSidebar(activeSec, activeLesson) {
    const html = SECTIONS.map(s => {
      const ls = lessonsOf(s.id);
      const open = s.id === activeSec;
      return `
      <div class="sec-group ${open?'':'closed'}" data-sec="${s.id}">
        <div class="sec-head"><span class="caret">▼</span> ${s.n} · ${s.title}</div>
        <div class="sec-items">
          ${ls.map(l => `
            <a href="#/${l.section}/${l.slug}" class="${l.id===activeLesson?'on':''} ${store.isDone(l.id)?'done':''}">
              <span class="num">${l.lesson}</span>
              <span class="ttl">${l.title}</span>
              ${l.project?'<span class="proj-badge">PROJECT</span>':''}
            </a>`).join('')}
        </div>
      </div>`;
    }).join('');
    const sb = document.getElementById('sidebar');
    sb.innerHTML = html;
    sb.querySelectorAll('.sec-head').forEach(h =>
      h.onclick = () => h.parentElement.classList.toggle('closed'));
    document.querySelectorAll('#sectionNav a').forEach(a =>
      a.classList.toggle('on', a.dataset.sec === activeSec));
  }

  /* ---------------- rendering: home ---------------- */
  function renderHome() {
    renderSidebar(null, null);
    document.getElementById('main').innerHTML = `
    <div class="home">
      <h1>Web Dev Playground</h1>
      <p class="sub">
        A local dev environment for the Angela Yu bootcamp — every lesson from sections 5–11 and 14–15,
        with the real course exercise, a live preview that updates as you type, and interactive demos
        for poking at how each concept actually behaves.
      </p>
      <div class="card-grid">
        ${SECTIONS.map(s => `
          <a class="mod-card" href="#/${s.id}">
            <div class="n">${s.n.toUpperCase()}</div>
            <h3>${s.title}</h3>
            <p>${s.desc}</p>
            <div class="count">${lessonsOf(s.id).length} lessons</div>
          </a>`).join('')}
      </div>
      <h2>How to use it</h2>
      <div class="tips"><ul>
        <li><b>Build tab</b> — the course exercise, unsolved, exactly as Angela sets it. Type in the editor and the preview updates instantly. <b>Show solution</b> swaps in the answer; press it again to get your own code back.</li>
        <li><b>Explore tab</b> — sliders and dropdowns wired to real CSS. Drag them and watch the page respond; the code readout underneath shows the exact rule you just made.</li>
        <li><b>Notes tab</b> — the short version of the concept, for when you want to check something without rewatching the video.</li>
        <li><b>Your edits save automatically</b> in this browser, per lesson. <b>Reset</b> puts the original exercise back.</li>
        <li>For JavaScript lessons, <code>console.log</code> output appears in the console panel, and <code>prompt()</code> takes its answers from the <b>Prompt answers</b> box so nothing blocks while you type.</li>
      </ul></div>
    </div>`;
  }

  /* ---------------- rendering: section index ---------------- */
  function renderSection(secId) {
    const s = SECTIONS.find(x => x.id === secId);
    if (!s) return renderHome();
    renderSidebar(secId, null);
    const ls = lessonsOf(secId);
    document.getElementById('main').innerHTML = `
    <div class="home">
      <div class="crumb">${s.n.toUpperCase()}</div>
      <h1>${s.title}</h1>
      <p class="sub">${s.desc}</p>
      <div class="card-grid">
        ${ls.map(l => `
          <a class="mod-card" href="#/${l.section}/${l.slug}">
            <div class="n">${l.lesson}${l.project?' · PROJECT':''}</div>
            <h3>${l.title}</h3>
            <p>${l.blurb}</p>
          </a>`).join('')}
      </div>
    </div>`;
  }

  /* ---------------- rendering: lesson ---------------- */
  function renderLesson(lesson) {
    current = lesson;
    showingSolution = false;
    renderSidebar(lesson.section, lesson.id);

    const sec = SECTIONS.find(x => x.id === lesson.section);
    const saved = store.getCode(lesson.id);
    const files = Object.assign({}, lesson.files, saved || {});
    const names = ['html','css','js'].filter(k => lesson.files[k] != null);
    const isJs  = lesson.layout === 'js';
    const idx   = lessons.indexOf(lesson);
    const prev  = lessons[idx-1], next = lessons[idx+1];

    document.getElementById('main').innerHTML = `
      <div class="lesson-head">
        <div class="crumb">${sec.n.toUpperCase()} · ${sec.title} · LESSON ${lesson.lesson}</div>
        <h1>${lesson.title}</h1>
        <p class="blurb">${lesson.blurb}</p>
        ${lesson.tasks && lesson.tasks.length ? `
          <div class="tasks">
            <div class="t-title">Your task</div>
            <ol>${lesson.tasks.map(t => `<li>${t}</li>`).join('')}</ol>
          </div>` : ''}
      </div>

      <div class="tabs">
        <button data-tab="build" class="on">Build</button>
        ${lesson.explore.length ? `<button data-tab="explore">Explore <span style="opacity:.6">(${lesson.explore.length})</span></button>` : ''}
        ${lesson.notes ? '<button data-tab="notes">Notes</button>' : ''}
      </div>

      <section class="pane on" data-pane="build">
        <div class="workbench ${lesson.tasks && lesson.tasks.length ? '' : 'tall'}">
          <div class="col editors">
            <div class="editor-bar">
              ${names.map((n,i) => `<button class="filetab ${i===0?'on':''}" data-file="${n}">${
                  n==='html' ? 'index.html' : n==='css' ? 'style.css' : 'script.js'}</button>`).join('')}
              <span style="flex:1"></span>
              ${lesson.solution ? '<button class="btn" id="solBtn">Show solution</button>' : ''}
              <button class="btn ghost" id="resetBtn">Reset</button>
            </div>
            <div class="editor-wrap">
              ${names.map((n,i) => `<div class="ed ${i===0?'on':''}" data-ed="${n}"></div>`).join('')}
            </div>
          </div>

          <div class="col output">
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
              <label style="font-size:12px;color:var(--fg-dim);display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="doneChk" ${store.isDone(lesson.id)?'checked':''}> done
              </label>
              <button class="btn ghost" id="popBtn" title="Open the preview in its own tab">↗</button>
            </div>
            <div class="preview-shell">
              ${isJs ? '' : '<div class="frame-wrap"><iframe id="frame"></iframe></div>'}
              <div class="console-head">
                Console
                <span style="flex:1"></span>
                <span style="text-transform:none;letter-spacing:0">Prompt answers:</span>
                <input class="answers" id="answersBox" placeholder="one per line ⏎ or comma"
                       value="${(store.getAnswers(lesson.id) || lesson.answers || '').replace(/"/g,'&quot;')}">
                <button class="btn ghost" id="clearCon">clear</button>
              </div>
              <div class="console ${isJs?'big':''}" id="console"></div>
              ${isJs ? '<div class="frame-wrap" style="flex:0 0 130px"><iframe id="frame"></iframe></div>' : ''}
            </div>
          </div>
        </div>
      </section>

      ${lesson.explore.length ? `
        <section class="pane" data-pane="explore">
          <div class="explore-wrap">
            ${lesson.explore.map((d,i) => `
              <div class="demo">
                <h3>${d.title}</h3>
                ${d.note ? `<div class="demo-note">${d.note}</div>` : ''}
                <iframe data-demo="${i}" style="height:${d.height||420}px"></iframe>
              </div>`).join('')}
          </div>
        </section>` : ''}

      ${lesson.notes ? `<section class="pane" data-pane="notes"><div class="notes">${lesson.notes}</div></section>` : ''}

      <div class="footer-nav">
        <div>${prev ? `<a href="#/${prev.section}/${prev.slug}">← ${prev.lesson} ${prev.title}</a>` : ''}</div>
        <div>${next ? `<a href="#/${next.section}/${next.slug}">${next.lesson} ${next.title} →</a>` : ''}</div>
      </div>
      <div class="toast" id="toast"></div>`;

    // ---- editors ----
    Object.keys(editors).forEach(k => delete editors[k]);
    const MODES = { html:'htmlmixed', css:'css', js:'javascript' };
    names.forEach(n => {
      const host = document.querySelector(`[data-ed="${n}"]`);
      const cm = CodeMirror(host, {
        value: files[n] || '',
        mode: MODES[n],
        theme: 'material-darker',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        styleActiveLine: true,
        tabSize: 2,
        extraKeys: {
          'Cmd-Enter': run, 'Ctrl-Enter': run,
          Tab: cm2 => cm2.replaceSelection('  ')
        }
      });
      cm.on('change', () => { scheduleRun(); persist(); });
      editors[n] = cm;
    });

    // ---- file tabs ----
    document.querySelectorAll('.filetab').forEach(b => b.onclick = () => {
      document.querySelectorAll('.filetab').forEach(x => x.classList.remove('on'));
      document.querySelectorAll('.ed').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const host = document.querySelector(`[data-ed="${b.dataset.file}"]`);
      host.classList.add('on');
      editors[b.dataset.file].refresh();
      editors[b.dataset.file].focus();
    });

    // ---- pane tabs ----
    document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on'));
      document.querySelectorAll('.pane').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      document.querySelector(`[data-pane="${b.dataset.tab}"]`).classList.add('on');
      if (b.dataset.tab === 'build') Object.values(editors).forEach(e => e.refresh());
      if (b.dataset.tab === 'explore') loadDemos(lesson);
    });

    // ---- buttons ----
    document.getElementById('runBtn').onclick = run;
    document.getElementById('clearCon').onclick = () => document.getElementById('console').innerHTML = '';
    document.getElementById('doneChk').onchange = e => {
      store.done(lesson.id, e.target.checked);
      renderSidebar(lesson.section, lesson.id);
    };
    document.getElementById('answersBox').oninput = e => {
      store.answers(lesson.id, e.target.value); scheduleRun();
    };
    document.getElementById('popBtn').onclick = () => {
      const w = window.open('', '_blank');
      w.document.open();
      w.document.write(buildDoc(readFiles(), getAnswers(), lesson.previewBase));
      w.document.close();
    };
    document.getElementById('resetBtn').onclick = () => {
      if (!confirm('Put the original exercise back? Your edits to this lesson will be lost.')) return;
      store.clearCode(lesson.id);
      showingSolution = false;
      const sb = document.getElementById('solBtn');
      if (sb) { sb.textContent = 'Show solution'; sb.classList.remove('on'); }
      names.forEach(n => editors[n].setValue(lesson.files[n] || ''));
      toast('Exercise reset');
    };
    const solBtn = document.getElementById('solBtn');
    if (solBtn) solBtn.onclick = () => {
      if (!showingSolution) {
        lesson._mine = readFiles();
        names.forEach(n => editors[n].setValue(
          lesson.solution[n] != null ? lesson.solution[n] : (lesson.files[n] || '')));
        solBtn.textContent = 'Back to my code';
        solBtn.classList.add('on');
        showingSolution = true;
        toast('Showing the solution');
      } else {
        names.forEach(n => editors[n].setValue(lesson._mine[n] || ''));
        solBtn.textContent = 'Show solution';
        solBtn.classList.remove('on');
        showingSolution = false;
        toast('Back to your code');
      }
    };
    const widthSel = document.getElementById('widthSel');
    if (widthSel) widthSel.onchange = () => {
      const f = document.getElementById('frame');
      f.style.width = widthSel.value;
      f.parentElement.classList.toggle('narrow', widthSel.value !== '100%');
    };

    run();
    if (lesson.openTab === 'explore') {
      const b = document.querySelector('.tabs button[data-tab="explore"]');
      if (b) b.click();
    }
  }

  /* ---------------- run / console ---------------- */
  function readFiles() {
    const out = {};
    Object.keys(editors).forEach(k => out[k] = editors[k].getValue());
    return out;
  }
  function persist() {
    if (!current || showingSolution) return;
    store.code(current.id, readFiles());
  }
  function getAnswers() {
    const box = document.getElementById('answersBox');
    if (!box) return [];
    return box.value.split(/[\n,]/).map(s => s.trim()).filter(s => s !== '');
  }
  function scheduleRun() { clearTimeout(runTimer); runTimer = setTimeout(run, 450); }

  function run() {
    const frame = document.getElementById('frame');
    if (!frame) return;
    document.getElementById('console').innerHTML = '';
    frame.srcdoc = buildDoc(readFiles(), getAnswers(), current && current.previewBase);
  }

  function conRow(kind, text) {
    const box = document.getElementById('console');
    if (!box) return;
    const d = document.createElement('div');
    d.className = 'row';
    const cls = { log:'log', warn:'warn', err:'err', alert:'alert', prompt:'prompt' }[kind] || 'log';
    if (kind === 'alert') d.innerHTML = `<span class="alert">alert: ${escapeHtml(text)}</span>`;
    else { d.classList.add(cls); d.textContent = text; }
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  window.addEventListener('message', e => {
    if (e.data && e.data.__pg) conRow(e.data.kind, e.data.text);
  });

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1400);
  }

  /* ---------------- explore demos ---------------- */
  let DEMO_KIT = '';
  function loadDemos(lesson) {
    document.querySelectorAll('iframe[data-demo]').forEach(f => {
      if (f.dataset.loaded) return;
      const d = lesson.explore[+f.dataset.demo];
      f.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8">
        <style>${DEMO_KIT_CSS}</style></head><body>${d.html}
        <script>${DEMO_KIT_JS}<\/script></body></html>`;
      f.dataset.loaded = '1';
    });
  }

  /* ---------------- router ---------------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    document.getElementById('main').scrollTop = 0;
    if (parts.length === 0) return renderHome();
    if (parts.length === 1) return renderSection(parts[0]);
    const l = lessons.find(x => x.section === parts[0] && x.slug === parts[1]);
    if (!l) return renderSection(parts[0]);
    renderLesson(l);
  }

  function start() {
    renderNav();
    window.addEventListener('hashchange', route);
    route();
  }

  /* =====================================================================
     Demo kit — injected into every Explore iframe.
     Declarative wiring:
       <input data-css="#box|padding|px">      → sets style on #box
       <select data-css="#box|display">        → ditto
       <input type="checkbox" data-class="#box|round">  → toggles a class
       <pre data-readout="#box"></pre>         → live CSS rule for #box
     ===================================================================== */
  const DEMO_KIT_CSS = `
  *{box-sizing:border-box;}
  body{margin:0;padding:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;
       background:#f6f7fb;color:#1c2030;font-size:14px;}
  .knobs{display:flex;flex-wrap:wrap;gap:10px 18px;background:#fff;border:1px solid #dfe3ee;
         border-radius:10px;padding:12px 14px;margin-bottom:12px;align-items:center;}
  .knobs label{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#3c435c;}
  .knobs select,.knobs input[type=text],.knobs input[type=number]{
    font:inherit;font-size:12.5px;padding:3px 7px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;}
  .knobs input[type=range]{width:120px;}
  .knobs .val{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#5b6382;
              min-width:46px;display:inline-block;}
  .stage{background:#fff;border:1px solid #dfe3ee;border-radius:10px;padding:16px;margin-bottom:12px;
         position:relative;overflow:auto;}
  .readout{background:#111827;color:#e5e9f5;border-radius:10px;padding:12px 14px;margin:0 0 12px;
    font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.6;white-space:pre;overflow-x:auto;}
  .readout .sel{color:#7ee0a8;}
  .readout .prop{color:#8ab4ff;}
  .note{color:#5b6382;font-size:12.5px;line-height:1.55;margin:0 0 12px;}
  .box{background:#5b9cff;color:#fff;padding:14px;border-radius:6px;font-weight:600;text-align:center;}
  .box.b{background:#7ee0a8;color:#123;}
  .box.c{background:#ffcf6b;color:#123;}
  .box.d{background:#ff9aa2;color:#123;}
  .tag{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;background:#eef1f9;border:1px solid #dfe3ee;
       padding:1px 6px;border-radius:5px;color:#3c435c;}
  h4{margin:0 0 8px;font-size:13px;color:#3c435c;text-transform:uppercase;letter-spacing:.5px;}
  `;

  const DEMO_KIT_JS = `
  (function(){
    var tracked = {};   // selector -> { prop: value }

    function setStyle(sel, prop, val){
      document.querySelectorAll(sel).forEach(function(el){ el.style.setProperty(prop, val); });
      tracked[sel] = tracked[sel] || {};
      if (val === '' || val === 'unset') delete tracked[sel][prop]; else tracked[sel][prop] = val;
      paint();
    }
    function paint(){
      document.querySelectorAll('[data-readout]').forEach(function(pre){
        var sels = pre.getAttribute('data-readout').split(',').map(function(s){return s.trim();});
        pre.innerHTML = sels.map(function(sel){
          var props = tracked[sel] || {};
          var keys = Object.keys(props);
          if (!keys.length) return '<span class="sel">' + esc(sel) + '</span> { }';
          return '<span class="sel">' + esc(sel) + '</span> {\\n' +
            keys.map(function(k){
              return '  <span class="prop">' + esc(k) + '</span>: ' + esc(props[k]) + ';';
            }).join('\\n') + '\\n}';
        }).join('\\n\\n');
      });
    }
    function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

    function wire(el){
      var spec = el.getAttribute('data-css');
      if (spec){
        var p = spec.split('|'), sel = p[0], prop = p[1], unit = p[2] || '';
        var apply = function(){
          var v = (el.type === 'checkbox') ? (el.checked ? el.value : (el.getAttribute('data-off') || '')) : el.value;
          setStyle(sel, prop, v === '' ? '' : v + unit);
          var out = el.parentElement && el.parentElement.querySelector('.val');
          if (out) out.textContent = v === '' ? '—' : v + unit;
        };
        el.addEventListener('input', apply); el.addEventListener('change', apply); apply();
      }
      var cls = el.getAttribute('data-class');
      if (cls){
        var q = cls.split('|'), csel = q[0], cname = q[1];
        var applyC = function(){
          document.querySelectorAll(csel).forEach(function(t){ t.classList.toggle(cname, el.checked); });
        };
        el.addEventListener('change', applyC); applyC();
      }
    }
    document.querySelectorAll('[data-css],[data-class]').forEach(wire);
    paint();

    // let a demo expose its own extra logic
    if (window.demoInit) window.demoInit({ setStyle: setStyle, paint: paint });
  })();
  `;

  return { add, start, SECTIONS, lessons, buildDoc };
})();
