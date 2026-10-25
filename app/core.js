/* =========================================================================
   Web Dev Playground — core
   Lessons register themselves via PG.add({...}) from data/sNN.js, which is
   loaded on demand. data/index.js holds the manifest (one stub per lecture)
   so the sidebar can list every lecture before any section is loaded.
   Kits (app/kit-*.js) register themselves with PG.registerKit(kind, kit).
   ========================================================================= */
const PG = (function () {

  const PARTS = [
    { id: 'p1', title: 'Front-end foundations', sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    { id: 'p2', title: 'JavaScript',            sections: [14, 15, 16, 17, 18, 19, 20] },
    { id: 'p3', title: 'Back end',              sections: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] },
    { id: 'p4', title: 'React',                 sections: [36] },
    { id: 'p5', title: 'Web3',                  sections: [37, 38, 39, 40, 41, 42] },
    { id: 'p6', title: 'Extras',                sections: [43, 44, 45] },
  ];

  const SECTIONS = [
    [1,  'Front-End Web Development',  'How the internet and websites work, and how to get the most from the course.'],
    [2,  'Introduction to HTML',       'Headings, paragraphs, void elements and the first project.'],
    [3,  'Intermediate HTML',          'Lists, nesting, links and images.'],
    [4,  'Multi-Page Websites',        'File paths, the HTML boilerplate and linking pages together.'],
    [5,  'Introduction to CSS',        'Where CSS goes and how selectors target things.'],
    [6,  'CSS Properties',             'Colours, fonts, DevTools and the box model.'],
    [7,  'Intermediate CSS',           'The cascade, combining selectors and positioning.'],
    [8,  'Advanced CSS',               'Display, float, responsiveness and media queries.'],
    [9,  'Flexbox',                    'One-dimensional layout with full control.'],
    [10, 'Grid',                       'Two-dimensional layout: rows and columns.'],
    [11, 'Bootstrap',                  'A framework of ready-made layout and components.'],
    [12, 'Web Design School',          'Colour, typography, UI and UX for sites people enjoy.'],
    [13, 'Capstone 2: Personal Site',  'Build a personal site from everything so far.'],
    [14, 'Introduction to JavaScript', 'Variables, strings, numbers and functions.'],
    [15, 'Intermediate JavaScript',    'Randomness, conditionals, arrays and loops.'],
    [16, 'The DOM',                    'Selecting and changing page elements from JavaScript.'],
    [17, 'Boss Level 1: Dicee',        'A dice game that pulls the DOM lessons together.'],
    [18, 'Advanced JS and the DOM',    'Events, callbacks, objects, sounds and animation.'],
    [19, 'jQuery',                     'The classic library for shorter DOM code.'],
    [20, 'Boss Level 2: Simon',        'The Simon memory game, step by step.'],
    [21, 'The Unix Command Line',      'Navigating and managing files from the terminal.'],
    [22, 'Backend Web Development',    'What a back end is and which tools to learn.'],
    [23, 'Node.js',                    'Running JavaScript outside the browser, modules and npm.'],
    [24, 'Express.js',                 'Servers, HTTP requests, Postman and middleware.'],
    [25, 'EJS',                        'Templates that turn data into HTML on the server.'],
    [26, 'Capstone: Blog',             'A blog web app with Node, Express and EJS.'],
    [27, 'Git and GitHub',             'Version control, remotes, branches and pull requests.'],
    [28, 'APIs',                       'Requests, JSON, Axios, authentication and REST.'],
    [29, 'Capstone: Public API',       'Build a site around a public API.'],
    [30, 'Build Your Own API',         'GET, POST, PUT, PATCH and DELETE routes of your own.'],
    [31, 'Databases',                  'SQL versus NoSQL and when to use each.'],
    [32, 'SQL',                        'CREATE, INSERT, SELECT, UPDATE, DELETE and joins.'],
    [33, 'PostgreSQL',                 'Postgres, pgAdmin, relationships and two projects.'],
    [34, 'Capstone: Book Notes',       'A book notes app backed by Postgres.'],
    [35, 'Authentication and Security','Passwords, hashing, salting, sessions and OAuth.'],
    [36, 'React.js',                   'JSX, components, props, state, hooks and the Keeper app.'],
    [37, 'Web3 and the Internet Computer', 'Blockchain, DApps and the ICP setup.'],
    [38, 'DBANK DeFi DApp',            'The Motoko language and a first canister.'],
    [39, 'Deploying to ICP',           'Cycles, tokens and live deployment.'],
    [40, 'DApps with React',           'A React front end for an ICP canister.'],
    [41, 'Your Own Crypto Token',      'Hashmaps, faucets, transfers and Internet Identity.'],
    [42, 'NFT Marketplace',            'Minting, listing, discovering and buying NFTs.'],
    [43, 'Ask Angela Anything',        'Recorded Q&A sessions.'],
    [44, 'Next Steps',                 'Where the course goes next.'],
    [45, 'Bonus',                      'Succeeding in the age of AI.'],
  ].map(([n, title, desc]) => ({ id: 's' + String(n).padStart(2, '0'), n, title, desc,
      part: PARTS.find(p => p.sections.includes(n)).id }));

  const KINDS = {
    build:       { label: 'Build',       badge: 'HTML / CSS' },
    js:          { label: 'JavaScript',  badge: 'JavaScript' },
    react:       { label: 'React',       badge: 'React' },
    node:        { label: 'Node',        badge: 'Node / Express' },
    sql:         { label: 'SQL',         badge: 'SQL' },
    terminal:    { label: 'Terminal',    badge: 'Terminal' },
    read:        { label: 'Read',        badge: 'Reading' },
    walkthrough: { label: 'Walkthrough', badge: 'Walkthrough' },
  };

  const UDEMY = 'https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/';

  const manifest = [];        // stubs: {id, index, section, slug, title, kind, minutes, project}
  const lessons = {};         // full lesson objects by id, once their section is loaded
  const notesById = {};
  const kits = {};
  const loaded = {};          // section id -> promise
  let current = null;         // current lesson
  let unmount = null;         // cleanup for the current lesson pane

  /* ---------------- storage ---------------- */
  const KEY = 'wdplay:';
  const store = {
    code(id, files)   { try { localStorage.setItem(KEY + 'code:' + id, JSON.stringify(files)); } catch (e) {} },
    getCode(id)       { try { return JSON.parse(localStorage.getItem(KEY + 'code:' + id) || 'null'); } catch (e) { return null; } },
    clearCode(id)     { localStorage.removeItem(KEY + 'code:' + id); },
    done(id, v)       { try { localStorage.setItem(KEY + 'done:' + id, v ? '1' : ''); } catch (e) {} },
    isDone(id)        { return !!localStorage.getItem(KEY + 'done:' + id); },
    answers(id, v)    { try { localStorage.setItem(KEY + 'ans:' + id, v); } catch (e) {} },
    getAnswers(id)    { return localStorage.getItem(KEY + 'ans:' + id) || ''; },
    get(k)            { try { return JSON.parse(localStorage.getItem(KEY + k) || 'null'); } catch (e) { return null; } },
    set(k, v)         { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function attr(s) { return esc(s).replace(/'/g, '&#39;'); }
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('show'), 1500);
  }
  function sectionOf(id) { return SECTIONS.find(s => s.id === id); }
  function udemyUrl(l) { return l.udemyId ? UDEMY + l.udemyId : null; }

  const LEGACY_NAMES = { html: 'index.html', css: 'style.css', js: 'script.js' };
  function mapFiles(f) {
    if (!f) return {};
    const out = {};
    Object.keys(f).forEach(k => { if (f[k] != null) out[LEGACY_NAMES[k] || k] = f[k]; });
    return out;
  }

  /* ---------------- registration ---------------- */
  function add(lesson) {
    lesson.files = mapFiles(lesson.files);
    lesson.solution = lesson.solution ? mapFiles(lesson.solution) : null;
    lesson.explore = lesson.explore || [];
    lesson.tasks = lesson.tasks || [];
    if (!lesson.kind) {
      const names = Object.keys(lesson.files);
      lesson.kind = (lesson.layout === 'js' || (names.length === 1 && names[0] === 'script.js')) ? 'js' : 'build';
    }
    lessons[lesson.id] = lesson;
    // keep the manifest stub in sync when a lesson is registered before the index was built
    if (!manifest.find(m => m.id === lesson.id)) manifest.push(stubOf(lesson));
  }
  function stubOf(l) {
    return { id: l.id, index: l.index, sub: l.sub || '', section: l.section, slug: l.slug, title: l.title, kind: l.kind,
             minutes: l.minutes, project: !!l.project };
  }
  function notes(id, html) { notesById[id] = html; }
  function index(list) { list.forEach(s => { if (!manifest.find(m => m.id === s.id)) manifest.push(s); }); sortManifest(); }
  function sortManifest() { manifest.sort((a, b) => ((a.index || 9999) - (b.index || 9999)) || String(a.sub || '').localeCompare(String(b.sub || ''))); }
  function num(l) { return l.index ? String(l.index) + (l.sub || '') : ''; }
  function registerKit(kind, kit) { kits[kind] = kit; }

  /* ---------------- lazy loading ---------------- */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Could not load ' + src));
      document.head.appendChild(s);
    });
  }
  function loadSection(secId) {
    if (!loaded[secId]) {
      loaded[secId] = Promise.all([
        loadScript(`data/${secId}.js`).catch(() => {}),
        loadScript(`data/${secId}-2.js`).catch(() => {}),     // optional second file for big sections
        loadScript(`data/notes/${secId}.js`).catch(() => {}),
      ]).then(sortManifest);
    }
    return loaded[secId];
  }
  function lessonsOf(secId) { return manifest.filter(m => m.section === secId); }
  function manifestEntry(l) { return manifest.find(m => m.id === l.id); }

  /* ---------------- shell: top bar & sidebar ---------------- */
  function renderNav(activePart) {
    document.getElementById('sectionNav').innerHTML = PARTS.map(p =>
      `<a href="#/${p.id}" data-part="${p.id}" class="${p.id === activePart ? 'on' : ''}">${esc(p.title)}</a>`).join('');
  }

  let sidebarBuilt = false;
  function buildSidebar() {
    const sb = document.getElementById('sidebar');
    sb.innerHTML = `
      <div class="sb-search"><input id="sbSearch" type="search" placeholder="Search lectures… (e.g. 131 or flex)"></div>
      <div id="sbList"></div>`;
    const list = document.getElementById('sbList');
    list.innerHTML = SECTIONS.map(s => {
      const ls = lessonsOf(s.id);
      return `
      <div class="sec-group closed" data-sec="${s.id}">
        <div class="sec-head"><span class="caret">▼</span><span class="sh-title">${s.n} · ${esc(s.title)}</span><span class="sh-count" data-count="${s.id}"></span></div>
        <div class="sec-items">
          ${ls.map(l => `
            <a href="#/${l.section}/${l.slug}" data-id="${l.id}" data-search="${attr(num(l) + ' ' + l.title.toLowerCase())}">
              <span class="num">${num(l)}</span>
              <span class="ttl">${esc(l.title)}</span>
              ${l.project ? '<span class="proj-badge">PROJECT</span>' : ''}
              <span class="kind-dot k-${l.kind || 'read'}" title="${(KINDS[l.kind] || KINDS.read).badge}"></span>
            </a>`).join('')}
          ${ls.length ? '' : '<div class="sec-empty">No lessons yet</div>'}
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('.sec-head').forEach(h =>
      h.onclick = () => h.parentElement.classList.toggle('closed'));
    document.getElementById('sbSearch').oninput = e => {
      const q = e.target.value.trim().toLowerCase();
      list.classList.toggle('searching', !!q);
      list.querySelectorAll('.sec-items a').forEach(a => {
        a.classList.toggle('hide', !!q && !a.dataset.search.includes(q));
      });
      list.querySelectorAll('.sec-group').forEach(g => {
        const any = [...g.querySelectorAll('.sec-items a')].some(a => !a.classList.contains('hide'));
        g.classList.toggle('no-match', !!q && !any);
        if (q) g.classList.remove('closed');
      });
    };
    sidebarBuilt = true;
  }
  function updateSidebar(activeSec, activeLesson) {
    if (!sidebarBuilt) buildSidebar();
    const sb = document.getElementById('sbList');
    sb.querySelectorAll('.sec-group').forEach(g => {
      if (g.dataset.sec === activeSec) g.classList.remove('closed');
      const ls = lessonsOf(g.dataset.sec);
      const done = ls.filter(l => store.isDone(l.id)).length;
      const c = g.querySelector('[data-count]');
      if (c) c.textContent = ls.length ? `${done}/${ls.length}` : '';
    });
    sb.querySelectorAll('.sec-items a').forEach(a => {
      a.classList.toggle('on', a.dataset.id === activeLesson);
      a.classList.toggle('done', store.isDone(a.dataset.id));
    });
    const on = sb.querySelector('.sec-items a.on');
    if (on) on.scrollIntoView({ block: 'nearest' });
    const sec = sectionOf(activeSec);
    renderNav(sec ? sec.part : null);
  }

  /* ---------------- pages: home / part / section ---------------- */
  function sectionCard(s) {
    const ls = lessonsOf(s.id);
    const done = ls.filter(l => store.isDone(l.id)).length;
    return `
      <a class="mod-card" href="#/${s.id}">
        <div class="n">SECTION ${s.n}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="count">${ls.length} lectures${done ? ` · ${done} done` : ''}</div>
      </a>`;
  }
  function renderHome() {
    updateSidebar(null, null);
    const total = manifest.length, done = manifest.filter(m => store.isDone(m.id)).length;
    document.getElementById('main').innerHTML = `
    <div class="home">
      <h1>Web Dev Playground</h1>
      <p class="sub">
        A hands-on companion to <b>The Complete Full-Stack Web Development Bootcamp</b>: one page for every
        lecture, numbered as in the course. Exercises and projects run live in the browser — HTML and CSS,
        JavaScript, React, Node and Express servers, Postgres SQL, even the command line and git.
      </p>
      <div class="progress-line">${done} of ${total} lectures done</div>
      ${PARTS.map(p => `
        <h2 id="${p.id}">${esc(p.title)}</h2>
        <div class="card-grid">${p.sections.map(n => sectionCard(SECTIONS[n - 1])).join('')}</div>`).join('')}
      <h2>How to use it</h2>
      <div class="tips"><ul>
        <li><b>Build tab</b> — the course exercise, unsolved. Edit on the left and the output on the right updates as you type. <b>Show solution</b> swaps the answer in; press it again to get your own code back. <b>Reset</b> restores the original exercise.</li>
        <li><b>Node lessons</b> run a simulated server: press <b>Run</b>, then use the built-in browser or the Postman-style panel to send requests to <code>localhost:3000</code>.</li>
        <li><b>SQL lessons</b> run a real Postgres in your browser (it downloads once, about 12&nbsp;MB).</li>
        <li><b>Terminal lessons</b> give you a shell and a simulated git to practise in.</li>
        <li><b>Explore tab</b> — interactive demos wired to real CSS and JavaScript. <b>Notes tab</b> — the lecture in short form. <b>Quiz tab</b> — quick checks of the key points.</li>
        <li>Your edits save automatically in this browser, per lesson. Tick <b>done</b> to track progress in the sidebar.</li>
      </ul></div>
    </div>`;
  }
  function renderPart(partId) {
    const p = PARTS.find(x => x.id === partId);
    if (!p) return renderHome();
    updateSidebar(null, null); renderNav(partId);
    document.getElementById('main').innerHTML = `
    <div class="home">
      <div class="crumb">PART ${partId.slice(1)}</div>
      <h1>${esc(p.title)}</h1>
      <div class="card-grid">${p.sections.map(n => sectionCard(SECTIONS[n - 1])).join('')}</div>
    </div>`;
  }
  function renderSection(secId) {
    const s = sectionOf(secId);
    if (!s) return renderHome();
    updateSidebar(secId, null);
    const ls = lessonsOf(secId);
    document.getElementById('main').innerHTML = `
    <div class="home">
      <div class="crumb">SECTION ${s.n}</div>
      <h1>${esc(s.title)}</h1>
      <p class="sub">${esc(s.desc)}</p>
      <div class="lesson-list">
        ${ls.map(l => `
          <a class="lesson-row ${store.isDone(l.id) ? 'done' : ''}" href="#/${l.section}/${l.slug}">
            <span class="num">${num(l)}</span>
            <span class="ttl">${esc(l.title)}</span>
            ${l.project ? '<span class="proj-badge">PROJECT</span>' : ''}
            <span class="kind-badge k-${l.kind || 'read'}">${(KINDS[l.kind] || KINDS.read).badge}</span>
            <span class="mins">${l.minutes ? l.minutes + ' min' : 'article'}</span>
          </a>`).join('')}
        ${ls.length ? '' : '<p class="sub">No lessons in this section yet.</p>'}
      </div>
    </div>`;
  }

  /* ---------------- page: lesson ---------------- */
  function renderLesson(lesson) {
    if (unmount) { try { unmount(); } catch (e) {} unmount = null; }
    current = lesson;
    updateSidebar(lesson.section, lesson.id);
    const sec = sectionOf(lesson.section);
    const kind = KINDS[lesson.kind] || KINDS.read;
    const kit = kits[lesson.kind] || kits.read;
    const i = manifest.findIndex(m => m.id === lesson.id);
    const prev = manifest[i - 1], next = manifest[i + 1];
    // a lesson's own short notes come first, then the full lecture notes
    const notesHtml = (lesson.notes || '') + (notesById[lesson.id] ? (lesson.notes ? '<h2>Lecture notes</h2>' : '') + notesById[lesson.id] : '');
    const hasQuiz = lesson.quiz && lesson.quiz.length;
    const mainTab = kit.tabLabel || 'Build';
    const udemy = udemyUrl(lesson);

    document.getElementById('main').innerHTML = `
      <div class="lesson-head">
        <div class="crumb">SECTION ${sec.n} · ${esc(sec.title).toUpperCase()}${lesson.index ? ` · LECTURE ${num(lesson)}` : ''}</div>
        <h1>${lesson.index ? `<span class="h-num">${num(lesson)}.</span> ` : ''}${esc(lesson.title)}</h1>
        <div class="meta-line">
          <span class="kind-badge k-${lesson.kind}">${kind.badge}</span>
          ${lesson.project ? '<span class="proj-badge">PROJECT</span>' : ''}
          <span>${lesson.minutes ? lesson.minutes + ' min video' : 'article'}</span>
          ${udemy ? `<a class="udemy-link" href="${udemy}" target="_blank" rel="noopener">Open in Udemy ↗</a>` : ''}
        </div>
        ${lesson.blurb ? `<p class="blurb">${lesson.blurb}</p>` : ''}
        ${lesson.tasks.length ? `
          <div class="tasks">
            <div class="t-title">Your task</div>
            <ol>${lesson.tasks.map(t => `<li>${t}</li>`).join('')}</ol>
          </div>` : ''}
      </div>

      <div class="tabs">
        <button data-tab="main" class="on">${esc(mainTab)}</button>
        ${lesson.explore.length ? `<button data-tab="explore">Explore <span style="opacity:.6">(${lesson.explore.length})</span></button>` : ''}
        ${notesHtml ? '<button data-tab="notes">Notes</button>' : ''}
        ${hasQuiz ? `<button data-tab="quiz">Quiz <span style="opacity:.6">(${lesson.quiz.length})</span></button>` : ''}
        <span class="spacer"></span>
        <label class="done-toggle"><input type="checkbox" id="doneChk" ${store.isDone(lesson.id) ? 'checked' : ''}> done</label>
      </div>

      <section class="pane on" data-pane="main" id="mainPane"></section>

      ${lesson.explore.length ? `
        <section class="pane" data-pane="explore">
          <div class="explore-wrap">
            ${lesson.explore.map((d, k) => `
              <div class="demo">
                <h3>${d.title}</h3>
                ${d.note ? `<div class="demo-note">${d.note}</div>` : ''}
                <iframe data-demo="${k}" style="height:${d.height || 420}px"></iframe>
              </div>`).join('')}
          </div>
        </section>` : ''}

      ${notesHtml ? `<section class="pane" data-pane="notes"><div class="notes">${notesHtml}</div></section>` : ''}
      ${hasQuiz ? `<section class="pane" data-pane="quiz"><div class="quiz" id="quizHost"></div></section>` : ''}

      <div class="footer-nav">
        <div>${prev ? `<a href="#/${prev.section}/${prev.slug}">← ${num(prev)} ${esc(prev.title)}</a>` : ''}</div>
        <div>${next ? `<a href="#/${next.section}/${next.slug}">${num(next)} ${esc(next.title)} →</a>` : ''}</div>
      </div>`;

    // tabs
    document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('on'));
      document.querySelectorAll('.pane').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      document.querySelector(`[data-pane="${b.dataset.tab}"]`).classList.add('on');
      if (b.dataset.tab === 'explore') loadDemos(lesson);
      if (b.dataset.tab === 'notes') highlightNotes();
      if (b.dataset.tab === 'quiz') renderQuiz(lesson);
      if (b.dataset.tab === 'main') window.dispatchEvent(new Event('pg:refresh'));
    });
    document.getElementById('doneChk').onchange = e => {
      store.done(lesson.id, e.target.checked);
      updateSidebar(lesson.section, lesson.id);
    };

    const host = document.getElementById('mainPane');
    try {
      unmount = kit.mount(lesson, host) || null;
    } catch (e) {
      host.innerHTML = `<div class="kit-error">This lesson could not be shown: ${esc(e.message)}</div>`;
      console.error(e);
    }
    if (lesson.openTab) {
      const b = document.querySelector(`.tabs button[data-tab="${lesson.openTab}"]`);
      if (b) b.click();
    }
  }

  /* ---------------- notes code highlighting ---------------- */
  function highlightNotes() {
    if (!window.CodeMirror || !CodeMirror.runMode) return;
    document.querySelectorAll('.notes pre[data-lang]:not([data-hl])').forEach(pre => {
      const code = pre.textContent;
      const mode = modeFor('x.' + (pre.dataset.lang || 'txt'));
      pre.dataset.hl = '1';
      if (!mode) return;
      pre.innerHTML = '';
      pre.className = 'cm-s-material-darker';
      CodeMirror.runMode(code, mode, pre);
    });
  }

  /* ---------------- quiz ---------------- */
  function renderQuiz(lesson) {
    const host = document.getElementById('quizHost');
    if (!host || host.dataset.built) return;
    host.dataset.built = '1';
    host.innerHTML = lesson.quiz.map((q, i) => `
      <div class="q" data-q="${i}">
        <div class="q-text"><span class="q-num">${i + 1}</span> ${q.q}</div>
        <div class="q-opts">${q.options.map((o, k) => `<button class="q-opt" data-k="${k}">${o}</button>`).join('')}</div>
        <div class="q-why"></div>
      </div>`).join('') + `<div class="q-score" id="qScore"></div>`;
    host.querySelectorAll('.q').forEach(qEl => {
      const q = lesson.quiz[+qEl.dataset.q];
      qEl.querySelectorAll('.q-opt').forEach(b => b.onclick = () => {
        if (qEl.dataset.answered) return;
        qEl.dataset.answered = '1';
        const k = +b.dataset.k;
        qEl.querySelectorAll('.q-opt').forEach(x => {
          x.classList.toggle('right', +x.dataset.k === q.answer);
          x.classList.toggle('wrong', +x.dataset.k === k && k !== q.answer);
          x.disabled = true;
        });
        qEl.querySelector('.q-why').innerHTML = (k === q.answer ? '<b>Correct.</b> ' : '<b>Not quite.</b> ') + (q.why || '');
        const answered = host.querySelectorAll('.q[data-answered]').length;
        const right = [...host.querySelectorAll('.q')].filter(x => x.querySelector('.q-opt.right.wrong') === null &&
          x.dataset.answered && x.querySelector('.q-opt.wrong') === null).length;
        document.getElementById('qScore').textContent = `${right} / ${answered} correct` + (answered === lesson.quiz.length ? ' — done' : '');
      });
    });
  }

  /* ---------------- explore demos ---------------- */
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

  /* ---------------- editors ---------------- */
  const MODES = {
    html: 'htmlmixed', htm: 'htmlmixed', ejs: 'htmlmixed', css: 'css', js: 'javascript', mjs: 'javascript',
    jsx: 'jsx', json: { name: 'javascript', json: true }, sql: 'text/x-pgsql', sh: 'shell', bash: 'shell',
    mo: 'text/x-rustsrc', env: 'shell', txt: null, md: null, svg: 'xml', xml: 'xml', py: 'python',
  };
  function modeFor(name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (name.startsWith('.env')) return 'shell';
    const m = MODES[ext];
    if (m === undefined) return null;
    if (m === 'text/x-rustsrc' && !CodeMirror.mimeModes['text/x-rustsrc']) return 'javascript';
    return m;
  }
  function makeEditor(host, value, name, opts) {
    opts = opts || {};
    const cm = CodeMirror(host, {
      value: value || '',
      mode: modeFor(name) || 'text/plain',
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      autoCloseTags: /\.(html|ejs|jsx|xml|svg)$/.test(name),
      styleActiveLine: true,
      readOnly: !!opts.readOnly,
      tabSize: 2,
      extraKeys: Object.assign({
        Tab: cm2 => cm2.replaceSelection('  '),
      }, opts.run ? { 'Cmd-Enter': opts.run, 'Ctrl-Enter': opts.run } : {}),
    });
    return cm;
  }

  /* ---------------- shared workbench ----------------
     Editors with file tabs on the left, a kit-provided output column on the
     right. Handles saving, reset and the solution toggle for every kit. */
  function workbench(host, lesson, cfg) {
    cfg = cfg || {};
    const files = lesson.files || {};
    const names = cfg.names || Object.keys(files);
    const saved = store.getCode(lesson.id);
    const initial = Object.assign({}, files, saved || {});
    let showingSolution = false, mine = null, runTimer = null;
    const editors = {};

    host.innerHTML = `
      <div class="workbench ${lesson.tasks.length ? '' : 'tall'} ${cfg.className || ''}">
        <div class="col editors" style="flex-basis:${cfg.editorWidth || '50%'}">
          <div class="editor-bar">
            <div class="filetabs">${names.map((n, i) => `<button class="filetab ${i === 0 ? 'on' : ''}" data-file="${attr(n)}">${esc(n)}</button>`).join('')}</div>
            <span style="flex:1"></span>
            ${lesson.solution ? '<button class="btn" id="solBtn">Show solution</button>' : ''}
            <button class="btn ghost" id="resetBtn" title="Put the original exercise back">Reset</button>
          </div>
          <div class="editor-wrap">
            ${names.map((n, i) => `<div class="ed ${i === 0 ? 'on' : ''}" data-ed="${attr(n)}"></div>`).join('')}
          </div>
        </div>
        <div class="col output">${cfg.output || ''}</div>
      </div>`;

    const run = () => { if (cfg.onRun) cfg.onRun(readFiles(), showingSolution); };
    const scheduleRun = () => { if (!cfg.autoRun) return; clearTimeout(runTimer); runTimer = setTimeout(run, cfg.delay || 450); };

    names.forEach(n => {
      const el = host.querySelector(`[data-ed="${CSS.escape(n)}"]`);
      const cm = makeEditor(el, initial[n] || '', n, { run });
      cm.on('change', () => { scheduleRun(); persist(); if (cfg.onChange) cfg.onChange(readFiles()); });
      editors[n] = cm;
    });
    function readFiles() { const o = {}; Object.keys(editors).forEach(k => o[k] = editors[k].getValue()); return o; }
    function persist() { if (!showingSolution) store.code(lesson.id, readFiles()); }
    function showFile(n) {
      host.querySelectorAll('.filetab').forEach(x => x.classList.toggle('on', x.dataset.file === n));
      host.querySelectorAll('.ed').forEach(x => x.classList.toggle('on', x.dataset.ed === n));
      editors[n].refresh(); editors[n].focus();
    }
    host.querySelectorAll('.filetab').forEach(b => b.onclick = () => showFile(b.dataset.file));
    host.querySelector('#resetBtn').onclick = () => {
      if (!confirm('Put the original exercise back? Your edits to this lesson will be lost.')) return;
      store.clearCode(lesson.id);
      showingSolution = false;
      const sb = host.querySelector('#solBtn');
      if (sb) { sb.textContent = 'Show solution'; sb.classList.remove('on'); }
      names.forEach(n => editors[n].setValue(files[n] || ''));
      toast('Exercise reset');
      run();
    };
    const solBtn = host.querySelector('#solBtn');
    if (solBtn) solBtn.onclick = () => {
      if (!showingSolution) {
        mine = readFiles();
        showingSolution = true;
        names.forEach(n => editors[n].setValue(lesson.solution[n] != null ? lesson.solution[n] : (files[n] || '')));
        solBtn.textContent = 'Back to my code'; solBtn.classList.add('on');
        toast('Showing the solution');
      } else {
        showingSolution = false;
        names.forEach(n => editors[n].setValue(mine[n] || ''));
        solBtn.textContent = 'Show solution'; solBtn.classList.remove('on');
        toast('Back to your code');
      }
      run();
    };
    const refresh = () => Object.values(editors).forEach(e => e.refresh());
    window.addEventListener('pg:refresh', refresh);

    return {
      editors, readFiles, run, showFile,
      isSolution: () => showingSolution,
      el: host.querySelector('.col.output'),
      destroy() { window.removeEventListener('pg:refresh', refresh); clearTimeout(runTimer); },
    };
  }

  /* ---------------- console panel (shared) ---------------- */
  function consolePanel(box) {
    return {
      clear() { box.innerHTML = ''; },
      row(kind, text) {
        const d = document.createElement('div');
        d.className = 'row ' + (kind || 'log');
        if (kind === 'alert') d.innerHTML = `<span class="alert">alert: ${esc(text)}</span>`;
        else d.textContent = text;
        box.appendChild(d);
        box.scrollTop = box.scrollHeight;
        return d;
      },
    };
  }

  /* ---------------- router ---------------- */
  async function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);
    document.getElementById('main').scrollTop = 0;
    if (unmount && parts.length !== 2) { try { unmount(); } catch (e) {} unmount = null; current = null; }
    if (parts.length === 0) return renderHome();
    if (parts[0] === 'selftest') { await Promise.all(SECTIONS.map(s => loadSection(s.id))); return window.PGSelfTest ? PGSelfTest.render() : renderHome(); }
    if (/^p\d$/.test(parts[0])) return renderPart(parts[0]);
    if (parts[0] === 'l' && parts[1]) {                       // #/l/13 → lecture 13
      const m = manifest.find(x => num(x) === parts[1]);
      if (m) { location.replace(`#/${m.section}/${m.slug}`); }
      return;
    }
    const secId = parts[0];
    if (!sectionOf(secId)) return renderHome();
    await loadSection(secId);
    if (parts.length === 1) return renderSection(secId);
    const stub = manifest.find(x => x.section === secId && x.slug === parts[1]);
    const l = stub && lessons[stub.id];
    if (!l) return renderSection(secId);
    if (location.hash.replace(/^#\/?/, '') !== h) return;   // user moved on while loading
    renderLesson(l);
  }

  function start() {
    renderNav(null);
    buildSidebar();
    window.addEventListener('hashchange', route);
    window.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && !document.activeElement.classList.contains('CodeMirror-code') && !e.metaKey && !e.ctrlKey) {
        const s = document.getElementById('sbSearch'); if (s && document.activeElement !== s && !document.querySelector('.CodeMirror-focused')) { e.preventDefault(); s.focus(); }
      }
    });
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
  .knobs button,.stage button{font:inherit;font-size:12.5px;padding:4px 10px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer;}
  .knobs button:hover,.stage button:hover{border-color:#5b9cff;}
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
  table.grid{border-collapse:collapse;font-size:12.5px;}
  table.grid th,table.grid td{border:1px solid #dfe3ee;padding:5px 9px;text-align:left;}
  table.grid th{background:#eef1f9;}
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

  return {
    add, notes, index, registerKit, start,
    SECTIONS, PARTS, KINDS, manifest, lessons, notesById, kits, store,
    esc, attr, toast, makeEditor, modeFor, workbench, consolePanel, loadSection, sectionOf, udemyUrl,
    get current() { return current; },
  };
})();
