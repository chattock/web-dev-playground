/* ===== Section 2 — Introduction to HTML ===== */
/* Wrapped in a function so the helper names below stay local to this file. */
(function () {

/* Demo scripts are real functions, stringified into the demo iframe. */
const script = (fn, cfg) => '<script>(' + fn + ')(' + JSON.stringify(cfg || {}).replace(/</g, '\\u003c') + ');<\/script>';

/* Explore iframes share the playground's origin, so a demo can read the code
   the learner typed in the Build tab (saved under wdplay:code:<lesson id>).
   READER defines readFiles(which) and watchFiles(callback, which). */
function READER(cfg) {
  var KEY = 'wdplay:code:' + cfg.id;
  window.readFiles = function (which) {
    var f = {}, k;
    for (k in cfg.starter) f[k] = cfg.starter[k];
    if (which === 'solution') { for (k in cfg.solution) f[k] = cfg.solution[k]; return f; }
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) for (k in s) f[k] = s[k]; } catch (e) {}
    return f;
  };
  window.watchFiles = function (cb, which) {
    var last = null;
    function tick() {
      var f = window.readFiles(typeof which === 'function' ? which() : which), key = JSON.stringify(f);
      if (key !== last) { last = key; cb(f); }
    }
    tick(); setInterval(tick, 700);
    return tick;
  };
}
const reader = l => script(READER, { id: l.id, starter: l.files, solution: l.solution });

/* A live checklist: each rule is a function body run against the parsed page. */
function CHECK(cfg) {
  var box = document.getElementById('checks'), ro = document.getElementById('ck-ro'), which = document.getElementById('ck-which');
  function parse(h) { return new DOMParser().parseFromString(h || '', 'text/html'); }
  var rules = cfg.rules.map(function (r) {
    var fn; try { fn = new Function('doc', 'html', 'files', 'parse', r.test); } catch (e) { fn = function () { return false; }; }
    return { desc: r.desc, fn: fn, file: r.file || 'index.html' };
  });
  var tick = window.watchFiles(function (f) {
    var docs = {}, n = 0;
    box.innerHTML = rules.map(function (r) {
      var html = f[r.file] || '', doc = docs[r.file] || (docs[r.file] = parse(html)), ok = false;
      try { ok = !!r.fn(doc, html, f, parse); } catch (e) {}
      if (ok) n++;
      return '<div class="ck' + (ok ? ' ok' : '') + '"><span class="tk">' + (ok ? '✓' : '○') + '</span><span>' + r.desc + '</span></div>';
    }).join('');
    ro.textContent = n + ' of ' + rules.length + ' checks pass' + (n === rules.length ? '. Every requirement is met.' : '. They update as you type in the Build tab.');
  }, function () { return which.value; });
  which.addEventListener('change', tick);
}
const CHECK_MARKUP = `
<style>
  .ck{display:flex;gap:8px;padding:6px 10px;border-radius:7px;margin:3px 0;font-size:13px;color:#5b6382;background:#fff;border:1px solid #e6e9f2}
  .ck.ok{background:#e9f8ef;border-color:#bfe8cf;color:#14532d}
  .ck .tk{width:16px;font-weight:700;flex:none}
  .ck code{font-size:12px}
</style>
<div class="knobs">
  <label>checking <select id="ck-which"><option value="mine">my code</option><option value="solution">the solution</option></select></label>
  <span style="font-size:12px;color:#5b6382">reads what you typed in the Build tab</span>
</div>
<div id="checks"></div>
<pre class="readout" id="ck-ro" style="margin-top:10px;white-space:pre-wrap"></pre>`;
const checklist = (l, rules, title, note, height) => ({
  title, note, height: height || 120 + rules.length * 36,
  html: CHECK_MARKUP + reader(l) + script(CHECK, { rules }),
});

const NO_SKIPS = "var last = 0, ok = true; doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) { var n = +h.tagName.charAt(1); if (n > last + 1) ok = false; last = n; }); return ok && last > 0;";

/* ---------- lecture 13: the heading outline of the learner's own page ---------- */
function OUTLINE() {
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  var tick = window.watchFiles(function (f) {
    var doc = new DOMParser().parseFromString(f['index.html'] || '', 'text/html');
    var hs = [].slice.call(doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    var problems = [], prev = 0, h1s = 0;
    var rows = hs.map(function (h) {
      var n = +h.tagName.charAt(1), txt = h.textContent.replace(/\s+/g, ' ').trim(), skip = n > prev + 1;
      if (n === 1) h1s++;
      if (skip) problems.push('"' + txt + '" is an h' + n + (prev ? ' right after an h' + prev : ' before any h1') + ', so a level is skipped.');
      prev = n;
      return '<div class="row' + (skip ? ' bad' : '') + '" style="padding-left:' + (8 + (n - 1) * 22) + 'px"><span class="lv">h' + n + '</span>' + esc(txt || '(empty)') + '</div>';
    });
    if (h1s > 1) problems.push('There are ' + h1s + ' h1 elements. A page should have exactly one.');
    if (hs.length && !h1s) problems.push('There is no h1, so the outline has no title.');
    var loose = [].slice.call(doc.body.childNodes).filter(function (nd) { return nd.nodeType === 3 && nd.textContent.trim(); })
      .map(function (nd) { return nd.textContent.replace(/\s+/g, ' ').trim(); }).join(' ');
    $('ol').innerHTML = rows.join('') || '<div class="row dim">(no headings yet)</div>';
    $('ol-ro').textContent = (problems.length ? problems.join('\n') : hs.length ? 'Clean outline: one h1 and no skipped levels.' : 'No headings yet. Wrap the words in h1–h4 tags in the Build tab.') +
      (loose ? '\nStill plain text: ' + (loose.length > 120 ? loose.slice(0, 120) + '…' : loose) : '');
  }, function () { return $('ol-which').value; });
  $('ol-which').addEventListener('change', tick);
}
const OUTLINE_MARKUP = `
<style>
  #ol{background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:6px 0;font-size:13px}
  #ol .row{padding:3px 8px}
  #ol .row.bad{background:#ffe1e1}
  #ol .lv{display:inline-block;font-family:ui-monospace,Menlo,monospace;font-size:11px;background:#eef1f9;border:1px solid #dfe3ee;border-radius:4px;padding:0 5px;margin-right:8px;color:#3c435c}
  #ol .dim{color:#8b92a8}
</style>
<div class="knobs">
  <label>outline of <select id="ol-which"><option value="mine">my code</option><option value="solution">the solution</option></select></label>
  <span style="font-size:12px;color:#5b6382">updates as you type in the Build tab</span>
</div>
<div id="ol"></div>
<pre class="readout" id="ol-ro" style="margin-top:10px;white-space:pre-wrap"></pre>`;

/* ---------- lecture 11: the same words with different labels ---------- */
function markupDemo() {
  var LINES = ['My Website', 'Hello! This is the first page I have made.', 'Everything here is written in HTML.', 'the first website ever made'];
  var START = ['', '', '', ''];
  var TAGS = [['', 'no tag'], ['h1', '<h1> main heading'], ['h2', '<h2> subheading'], ['p', '<p> paragraph'], ['a', '<a> hyperlink']];
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  $('rows').innerHTML = LINES.map(function (t, i) {
    return '<label style="display:flex;gap:8px;align-items:center;margin:4px 0;font-size:12.5px"><select data-i="' + i + '">' +
      TAGS.map(function (tg) { return '<option value="' + tg[0] + '"' + (tg[0] === START[i] ? ' selected' : '') + '>' + esc(tg[1]) + '</option>'; }).join('') +
      '</select><span>' + esc(t) + '</span></label>';
  }).join('');
  function wrap(tag, t) {
    if (!tag) return t;
    if (tag === 'a') return '<a href="https://info.cern.ch/hypertext/WWW/TheProject.html">' + t + '</a>';
    return '<' + tag + '>' + t + '</' + tag + '>';
  }
  function upd() {
    var tags = [].map.call(document.querySelectorAll('#rows select'), function (s) { return s.value; });
    var src = LINES.map(function (t, i) { return wrap(tags[i], t); }).join('\n');
    $('out').innerHTML = src;
    $('ro').textContent = src + '\n\n' + (tags.every(function (t) { return !t; })
      ? 'No tags at all: the browser has no idea what anything is, so it runs every line together as one.'
      : 'Same words, new labels. The tags add nothing you can read; they say what each piece of text IS.');
  }
  $('rows').addEventListener('change', upd);
  $('out').addEventListener('click', function (e) {
    if (e.target.closest('a')) { e.preventDefault(); $('ro').textContent += '\n\nThat is hypertext: clicking would load a different HTML document (here, the first website, from 1991).'; }
  });
  upd();
}

/* ---------- lecture 14: what a screen reader can jump between ---------- */
function parasDemo() {
  var TEXT = [
    'First paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Second paragraph. Suscipit adipiscing bibendum est ultricies. Tortor aliquam nulla facilisi cras fermentum.',
    'Third paragraph. Nisl purus in mollis nunc sed id semper risus. Ipsum a arcu cursus vitae congue mauris.'
  ];
  var $ = function (id) { return document.getElementById(id); };
  var at = -1;
  function blocks() { return [].slice.call($('stage').querySelectorAll('p')); }
  function draw() {
    at = -1;
    $('stage').innerHTML = $('wrap').checked
      ? TEXT.map(function (t) { return '<p>' + t + '</p>'; }).join('')
      : '<div>' + TEXT.join('\n\n') + '</div>';
    var n = blocks().length;
    $('ro').textContent = $('wrap').checked
      ? 'Screen reader: 3 paragraphs found. Press "next paragraph" to jump between them.'
      : 'Screen reader: no paragraphs found. The text is one undivided block, read from start to finish.';
    $('next').disabled = !n;
  }
  $('wrap').addEventListener('change', draw);
  $('next').addEventListener('click', function () {
    var ps = blocks(); if (!ps.length) return;
    at = (at + 1) % ps.length;
    ps.forEach(function (p, i) { p.style.background = i === at ? '#fff3c4' : ''; p.style.outline = i === at ? '2px solid #e0b100' : ''; });
    $('ro').textContent = 'Screen reader: paragraph ' + (at + 1) + ' of ' + ps.length + '. "' + ps[at].textContent.slice(0, 60) + '…"';
  });
  draw();
}

/* ---------- lecture 15: a tiny diff checker ---------- */
function diffDemo(cfg) {
  var $ = function (id) { return document.getElementById(id); };
  var a = $('mine'), b = $('theirs');
  a.value = cfg.mine; b.value = cfg.solution;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function diff(x, y) {
    var n = x.length, m = y.length, dp = [], i, j;
    for (i = 0; i <= n; i++) { dp.push([]); for (j = 0; j <= m; j++) dp[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var ops = []; i = 0; j = 0;
    while (i < n && j < m) {
      if (x[i] === y[j]) { ops.push([' ', x[i]]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', x[i]]); i++; }
      else { ops.push(['+', y[j]]); j++; }
    }
    while (i < n) ops.push(['-', x[i++]]);
    while (j < m) ops.push(['+', y[j++]]);
    return ops;
  }
  function run() {
    var trim = function (s) { return s.replace(/\s+$/, ''); };
    var ops = diff(a.value.split('\n').map(trim), b.value.split('\n').map(trim));
    var changed = ops.filter(function (o) { return o[0] !== ' '; }).length;
    $('diff').innerHTML = ops.map(function (o) {
      return '<div class="' + (o[0] === '-' ? 'del' : o[0] === '+' ? 'add' : 'same') + '"><b>' + (o[0] === '-' ? '−' : o[0] === '+' ? '+' : '&nbsp;') + '</b> ' + (esc(o[1]) || '&nbsp;') + '</div>';
    }).join('');
    $('prev').srcdoc = '<style>body{font-family:sans-serif;margin:8px;zoom:.7}</style>' + a.value;
    var squash = function (s) { return s.replace(/\s+/g, ''); };
    var mine = ops.filter(function (o) { return o[0] === '-'; }).length;
    $('ro').textContent = !changed
      ? 'No differences left: your code matches the solution line for line.'
      : squash(a.value) === squash(b.value)
        ? 'Only spacing differs now (' + mine + ' line' + (mine === 1 ? '' : 's') + '). That is harmless: the page renders exactly the same.'
        : mine + ' line' + (mine === 1 ? ' differs' : 's differ') + ': red is only in your code, green only in the solution. Some differences are harmless spacing; one breaks the whole page (look at the rendered preview). Fix it on the left.';
  }
  a.addEventListener('input', run); b.addEventListener('input', run);
  run();
}


PG.add({
  id:'l010', index:10, udemyId:37390282, minutes:0, section:'s02', slug:'course-updates-2023', kind:'read',
  title:'A Note About 2023 Course Updates',
  blurb:'Most of the course was re-recorded in 2023, with new sections on Flexbox, Grid and PostgreSQL. The database part moved from MongoDB to PostgreSQL because employers ask for SQL more often. Older forum answers and GitHub repos may follow the earlier version, so check that outside material matches the current section order.',
});


PG.add({
  id:'l011', index:11, udemyId:37348056, minutes:4, section:'s02', slug:'what-is-html', kind:'build',
  title:'What is HTML?',
  blurb:'<b>H</b>yper<b>T</b>ext <b>M</b>arkup <b>L</b>anguage. <i>Hypertext</i> is text that links to other documents: the whole web is HTML files pointing at each other. <i>Markup</i> means labelling content with tags, the way quotation marks label a quote. HTML is the one file a site cannot do without; CSS and JavaScript only make sense attached to it.',
  tasks:[
    'Inside the body, type <code>&lt;h1&gt;My Website&lt;/h1&gt;</code>. That one line is already a web page, with no CSS or JavaScript.',
    'Under it, type two sentences with no tags: they run together on one line. Then wrap each in <code>&lt;p&gt;</code> … <code>&lt;/p&gt;</code> and watch them become two paragraphs. The tags labelled what each piece of text is.',
    'Add some hypertext: a paragraph containing <code>&lt;a href="https://info.cern.ch/hypertext/WWW/TheProject.html"&gt;the first website&lt;/a&gt;</code>. Click it in the preview to visit the page Tim Berners-Lee published in 1991, then press <b>▶ Run</b> to come back.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>What is HTML?</title>
</head>
<body>

  <!-- TODO 1: a heading that says My Website -->

  <!-- TODO 2: two sentences, each wrapped in its own <p> -->

  <!-- TODO 3: a link to the first website ever made:
       https://info.cern.ch/hypertext/WWW/TheProject.html -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>What is HTML?</title>
</head>
<body>

  <h1>My Website</h1>

  <p>Hello! This is the first web page I have made.</p>
  <p>Everything on it is written in HTML.</p>

  <p>
    It links to
    <a href="https://info.cern.ch/hypertext/WWW/TheProject.html">the first website</a>,
    which is still online.
  </p>

</body>
</html>
`},
  explore:[{
    title:'Markup: labels around content', height:470,
    note:'Four lines of text. Give each one a tag and watch what the browser does with it. With no tags at all, it cannot tell a title from a sentence.',
    html:`
<div class="stage" style="display:flex;gap:16px;align-items:flex-start">
  <div style="flex:1"><h4>pick a tag for each line</h4><div id="rows"></div></div>
  <div style="flex:1.2"><h4>what the browser draws</h4><div id="out" style="border:1px solid #dfe3ee;border-radius:8px;padding:10px;min-height:150px;background:#fff"></div></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
` + script(markupDemo),
  }],
  quiz:[
    { q:'What does "hypertext" mean?', options:['Text that is very large','Text that links to other documents','Text written in capital letters','Text made by JavaScript'], answer:1, why:'Hyperlinks between documents are what turned separate pages into a web.' },
    { q:'Which of these files can be a web page on its own?', options:['style.css','script.js','index.html','None of them'], answer:2, why:'CSS styles HTML elements and JavaScript works on them; without an HTML document there is nothing for them to attach to.' },
    { q:'What does the <b>markup</b> in HTML do?', options:['Adds new words to the page','Labels pieces of content so the browser knows what each one is','Makes text bold','Runs calculations'], answer:1, why:'Tags wrap content and describe it (a heading, a paragraph, a link), much like quotation marks mark a quote.' },
  ],
});


PG.add({
  id:'l012', index:12, udemyId:37348782, minutes:3, section:'s02', slug:'course-resources', kind:'read',
  title:'How to Download the Course Resources',
  blurb:'Lessons with starter files have a <b>Resources</b> menu in the Udemy player, usually holding a .zip. Extract it first (double-click it on a Mac, <i>Extract all</i> on Windows), then drag the extracted folder, not the zip, onto VS Code. In this playground the starter files are already in the editor.',
  quiz:[
    { q:'Why extract the .zip before opening it in VS Code?', options:['VS Code cannot reliably edit and save files that are still inside the archive','Zips are larger than folders','It converts the files to HTML','It is only needed on Windows'], answer:0, why:'A zip is compressed. The files may appear, but editing and saving them in place misbehaves; extract first, every time.' },
  ],
});


const L13 = {
  id:'s02-headings', index:13, udemyId:37348070, minutes:14, section:'s02', slug:'headings', kind:'build',
  title:'HTML Heading Elements',
  blurb:'Six levels of heading, <code>&lt;h1&gt;</code> down to <code>&lt;h6&gt;</code> (there is no h7). They describe the page\'s <b>outline</b>, like a book\'s contents: title, chapters, sections. Vocabulary for the rest of the course: <code>&lt;h1&gt;</code> is the opening tag, <code>&lt;/h1&gt;</code> the closing tag, and the whole thing including its content is the <b>element</b>.',
  tasks:[
    'The words in the starter are plain text, so the preview shows them on one line. Wrap <code>Book</code> in an <code>&lt;h1&gt;</code>: the single title of the page.',
    'Wrap each <code>Chapter</code> in an <code>&lt;h2&gt;</code> and each <code>Section</code> in an <code>&lt;h3&gt;</code>.',
    '<code>Diagram 1</code> belongs to Section 1 of Chapter 2, one level deeper: make it an <code>&lt;h4&gt;</code>.',
    'Check every pair matches: <code>&lt;h2&gt;</code> must close with <code>&lt;/h2&gt;</code>, not <code>&lt;/h3&gt;</code>.',
    'Open the Explore tab: <b>Your outline</b> reads your code and flags a second h1 or a skipped level.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Heading Element</title>
</head>
<body>

  <!-- TODO: turn each word below into a heading so the page has this outline
       Book                 (the title of the page)
         Chapter 1
           Section 1
           Section 2
         Chapter 2
           Section 1
             Diagram 1
         Chapter 3
           Section 1
           Section 2
  -->

  Book
  Chapter 1
  Section 1
  Section 2
  Chapter 2
  Section 1
  Diagram 1
  Chapter 3
  Section 1
  Section 2

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Heading Element</title>
</head>
<body>

  <h1>Book</h1>

  <h2>Chapter 1</h2>
  <h3>Section 1</h3>
  <h3>Section 2</h3>

  <h2>Chapter 2</h2>
  <h3>Section 1</h3>
  <h4>Diagram 1</h4>

  <h2>Chapter 3</h2>
  <h3>Section 1</h3>
  <h3>Section 2</h3>

</body>
</html>
`},
  explore:[{
    title:'Heading levels and why they matter', height:540,
    note:'The left is what you see; the right is the outline a screen reader or a search engine builds from it. Break the hierarchy and watch the outline stop making sense.',
    html:`
<div class="knobs">
  <label>page structure
    <select id="mode">
      <option value="good">correct hierarchy</option>
      <option value="skip">skips from h1 to h4</option>
      <option value="many">five h1s</option>
      <option value="open">forgot a closing tag</option>
      <option value="fake">no headings, just bold text</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:14px;align-items:flex-start">
  <div style="flex:1"><h4>the page</h4><div id="page" style="border:1px solid #dfe3ee;padding:12px;border-radius:8px"></div></div>
  <div style="flex:1"><h4>the outline a machine reads</h4><pre class="readout" id="out" style="margin:0;white-space:pre-wrap"></pre></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var pages = {
    good:'<h1>Coffee Shop</h1><h2>Our Beans</h2><h3>Ethiopian</h3><h3>Colombian</h3><h2>Find Us</h2>',
    skip:'<h1>Coffee Shop</h1><h4>Our Beans</h4><h3>Ethiopian</h3><h2>Find Us</h2>',
    many:'<h1>Coffee Shop</h1><h1>Our Beans</h1><h1>Ethiopian</h1><h1>Colombian</h1><h1>Find Us</h1>',
    open:'<h1>Coffee Shop<p>Open every day from 7am.</p><h2>Our Beans</h2><h3>Ethiopian</h3>',
    fake:'<p style="font-size:26px;font-weight:700">Coffee Shop</p>' +
         '<p style="font-size:20px;font-weight:700">Our Beans</p>' +
         '<p style="font-size:16px;font-weight:700">Ethiopian</p>'
  };
  var notes = {
    good:'Clean nesting: one h1, h2s beneath it, h3s beneath those. A machine can build a proper table of contents.',
    skip:'Jumping h1 → h4 leaves gaps in the outline. It still LOOKS fine, but the structure is now lying about the relationships.',
    many:'Five h1s means five top-level titles and no hierarchy at all. Use ONE h1 per page: the page title.',
    open:'The </h1> is missing, so the heading swallows the paragraph after it: the opening hours are now huge and bold, and the outline thinks they are part of the title.',
    fake:'Bold paragraphs look the same to a sighted reader and are invisible to a machine: zero headings found. This quietly wrecks accessibility and search.'
  };
  var m = document.getElementById('mode');
  function upd(){
    document.getElementById('page').innerHTML = pages[m.value];
    var hs = document.getElementById('page').querySelectorAll('h1,h2,h3,h4,h5,h6');
    var lines = [];
    hs.forEach(function(h){
      var lvl = +h.tagName[1];
      lines.push('  '.repeat(lvl-1) + h.tagName.toLowerCase() + '  ' + h.textContent);
    });
    document.getElementById('out').textContent = lines.length ? lines.join('\\n') : '(no headings found at all)';
    document.getElementById('ro').textContent = notes[m.value];
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'In <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>, what is the <b>element</b>?', options:['Just <code>&lt;h1&gt;</code>','Just <code>&lt;/h1&gt;</code>','The whole thing: opening tag, content and closing tag','Only the word Hello'], answer:2, why:'Tags are the bits in angle brackets; the element is the complete unit they make together with the content.' },
    { q:'How many <code>&lt;h1&gt;</code> elements should a page have?', options:['None','One','One per section','As many as you like'], answer:1, why:'The h1 is the title of the page, like the title of a book. Everything else sits under it.' },
    { q:'You want a smaller heading under an <code>&lt;h2&gt;</code>. What do you use?', options:['<code>&lt;h4&gt;</code>, because it is the right size','<code>&lt;h3&gt;</code>, the next level down; size can be changed with CSS','<code>&lt;h7&gt;</code>','A bold <code>&lt;p&gt;</code>'], answer:1, why:'Choose the level for its place in the outline. The default sizes are only styling, and CSS can change them later.' },
    { q:'Your page has one h1 but skips from h2 to h4. What happens?', options:['The page refuses to load','It renders fine, but screen readers and search engines get a broken outline','The h4 turns into an h3','The browser shows an error'], answer:1, why:'One h1 and no skipped levels are conventions, not syntax rules, but tools that read the outline depend on them.' },
  ],
  notes:`
    <h3>The rules (conventions, not errors)</h3>
    <ul>
      <li><b>One <code>&lt;h1&gt;</code> per page.</b> It is the page's title.</li>
      <li><b>Don't skip levels.</b> An h3 needs an h2 above it.</li>
      <li><b>Choose by meaning, not size.</b> Want a smaller heading? Use CSS later; don't drop to an h4 because it looks better.</li>
      <li>There are exactly six levels. Below h6, use a paragraph.</li>
    </ul>
    <h3>Anatomy of an element</h3>
    <pre>&lt;h1&gt;Book&lt;/h1&gt;
 ^^^^      ^^^^^
 opening   closing tag (note the slash)
      ^^^^
      the content</pre>
    <h3>Why it matters beyond looks</h3>
    <p>Screen readers let blind users jump from heading to heading. Search engines use headings to work out what a page is about. Both read your structure, not your font sizes.</p>`
};
L13.explore.push({
  title:'Your outline', height:470,
  note:'The heading outline of the page you are building in the Build tab, the way a screen reader sees it. A red row is a skipped level; any words not inside a tag yet are listed underneath.',
  html: OUTLINE_MARKUP + reader(L13) + script(OUTLINE),
});
PG.add(L13);


PG.add({
  id:'s02-paragraphs', index:14, udemyId:37348656, minutes:9, section:'s02', slug:'paragraphs', kind:'build',
  title:'HTML Paragraph Elements',
  blurb:'<code>&lt;p&gt;</code> turns a block of text into a paragraph: it starts on a new line with a gap above and below. Without it the browser ignores your line breaks and runs every block together. Screen readers also use paragraphs to let people jump from one to the next.',
  tasks:[
    'The three blocks of placeholder text show as one long jumble. Put <code>&lt;p&gt;</code> just before <code>First paragraph.</code> and <code>&lt;/p&gt;</code> after the last word of that block.',
    'Do the same for the second and third blocks. The preview should show three separate paragraphs with gaps between them.',
    'Add a few blank lines in the middle of one paragraph. Nothing changes: only the tags decide where a paragraph starts and ends.',
    'Extra: generate your own placeholder text (lipsum.com, or a novelty one such as Bacon Ipsum) and add a fourth paragraph.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Paragraph Element</title>
</head>
<body>

  <!-- TODO: wrap each of the three blocks below in its own <p> ... </p> -->

  First paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu
  cursus vitae congue mauris. In nisl nisi scelerisque eu ultrices vitae
  auctor eu augue. Nisi est sit amet facilisis magna. Diam sit amet nisl
  suscipit adipiscing bibendum est ultricies integer. Quis ipsum suspendisse
  ultrices gravida dictum fusce ut. Euismod elementum nisi quis eleifend.

  Second paragraph. Suscipit adipiscing bibendum est ultricies. Tortor
  aliquam nulla facilisi cras fermentum. Eget aliquet nibh praesent
  tristique magna. In hac habitasse platea dictumst vestibulum. Ornare quam
  viverra orci sagittis eu. Sit amet est placerat in. Proin fermentum leo
  vel orci porta non pulvinar neque laoreet.

  Third paragraph. Nisl purus in mollis nunc sed id semper risus. Ipsum a
  arcu cursus vitae congue mauris rhoncus aenean. Ridiculus mus mauris vitae
  ultricies leo integer malesuada nunc. In tellus integer feugiat
  scelerisque. Lectus mauris ultrices eros in cursus turpis massa.
  Sollicitudin ac orci phasellus egestas.

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Paragraph Element</title>
</head>
<body>

  <p>
    First paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu
    cursus vitae congue mauris. In nisl nisi scelerisque eu ultrices vitae
    auctor eu augue. Nisi est sit amet facilisis magna. Diam sit amet nisl
    suscipit adipiscing bibendum est ultricies integer. Quis ipsum suspendisse
    ultrices gravida dictum fusce ut. Euismod elementum nisi quis eleifend.
  </p>

  <p>
    Second paragraph. Suscipit adipiscing bibendum est ultricies. Tortor
    aliquam nulla facilisi cras fermentum. Eget aliquet nibh praesent
    tristique magna. In hac habitasse platea dictumst vestibulum. Ornare quam
    viverra orci sagittis eu. Sit amet est placerat in. Proin fermentum leo
    vel orci porta non pulvinar neque laoreet.
  </p>

  <p>
    Third paragraph. Nisl purus in mollis nunc sed id semper risus. Ipsum a
    arcu cursus vitae congue mauris rhoncus aenean. Ridiculus mus mauris vitae
    ultricies leo integer malesuada nunc. In tellus integer feugiat
    scelerisque. Lectus mauris ultrices eros in cursus turpis massa.
    Sollicitudin ac orci phasellus egestas.
  </p>

  <p>
    Fourth paragraph, from a novelty generator. Bacon ipsum dolor amet
    brisket pork belly short ribs, pancetta ham hock tenderloin kielbasa.
  </p>

</body>
</html>
`},
  explore:[
  {
    title:'Whitespace collapsing', height:440,
    note:'Type as many spaces and line breaks as you like on the left. The browser squashes every run of whitespace down to a single space.',
    html:`
<div class="stage" style="display:flex;gap:14px;align-items:stretch">
  <div style="flex:1">
    <h4>what you type</h4>
    <textarea id="src" style="width:100%;height:130px;font-family:Menlo,monospace;font-size:12px;
      border:1px solid #cfd5e6;border-radius:8px;padding:8px;resize:vertical">Hello        there.

I typed lots


of blank lines
   and     spaces.</textarea>
  </div>
  <div style="flex:1">
    <h4>what the browser shows</h4>
    <div id="out" style="border:1px solid #dfe3ee;border-radius:8px;padding:10px;height:130px;overflow:auto;background:#fff"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">This is why <code>&lt;p&gt;</code> and <code>&lt;br /&gt;</code> exist at all: pressing Enter in your code does nothing to the page. If you genuinely need whitespace kept, that is what <code>&lt;pre&gt;</code> is for.</p>
<script>
  var src = document.getElementById('src');
  function upd(){
    document.getElementById('out').textContent = src.value;
    var chars = src.value.length;
    var squashed = src.value.replace(/\\s+/g,' ').trim().length;
    document.getElementById('ro').textContent =
      'you typed      : ' + chars + ' characters\\n' +
      'browser renders: ' + squashed + ' characters worth of text\\n' +
      (chars - squashed) + ' characters of whitespace were collapsed away';
  }
  src.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'What a screen reader can jump between', height:400,
    note:'Screen-reader users skip through a page paragraph by paragraph. Turn the <code>&lt;p&gt;</code> tags off and there is nothing to skip to.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="wrap" checked> wrap each block in &lt;p&gt;</label>
  <button id="next">next paragraph ▶</button>
</div>
<div class="stage" id="stage" style="font-size:13px;line-height:1.5"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
` + script(parasDemo),
  }],
  quiz:[
    { q:'Why do the three blocks run together before you add <code>&lt;p&gt;</code> tags?', options:['The text is too long','The browser ignores line breaks in your code and collapses whitespace to one space','Lorem ipsum is not real text','The file has no doctype'], answer:1, why:'Line breaks you type are just whitespace to the browser. Only tags create separate blocks.' },
    { q:'Why use Lorem Ipsum rather than typing "this is a paragraph" over and over?', options:['It is shorter','Its varied words and sentence lengths look like real text, so the layout preview is realistic','Browsers style it differently','HTML requires it'], answer:1, why:'Identical repeated lines wrap identically and hide how real content will behave.' },
    { q:'Who else benefits from correct <code>&lt;p&gt;</code> tags?', options:['Nobody','Screen-reader users, who can skip from paragraph to paragraph','Only the browser\'s spellchecker','Only CSS'], answer:1, why:'Paragraph boundaries are part of the structure that assistive technology lets people navigate.' },
  ],
  notes:`
    <h3>Block vs inline</h3>
    <p><code>&lt;p&gt;</code> is a <b>block</b> element: it starts on a new line and takes the full width, with a gap above and below. That gap is a default margin the browser adds; CSS can change it later.</p>
    <h3>Placeholder text</h3>
    <p>Lorem Ipsum is scrambled Latin, adapted from Cicero and used by printers since the 1500s to fill layouts before the real words exist. lipsum.com generates paragraphs, words or lists of it; novelty versions such as Bacon Ipsum exist for fun. In VS Code, type <code>lorem</code> and press Tab, or <code>lorem50</code> for fifty words.</p>
    <h3>Don't nest paragraphs</h3>
    <p>A <code>&lt;p&gt;</code> cannot contain another <code>&lt;p&gt;</code>. The browser silently closes the first one and your structure is not what you think it is.</p>`
});


PG.add({
  id:'s02-void-elements', index:15, udemyId:37349664, minutes:12, section:'s02', slug:'void-elements', kind:'build',
  title:'Self Closing Tags',
  blurb:'Some elements can never contain anything, so they are a single tag with no closing partner. These are <b>void</b> elements: <code>&lt;br /&gt;</code> breaks a line inside a paragraph (an address, a poem) and <code>&lt;hr /&gt;</code> draws a horizontal rule between unrelated parts. Watch the slash: after the name in <code>&lt;br /&gt;</code>, but before it in a closing tag like <code>&lt;/p&gt;</code>.',
  tasks:[
    'The starter is unformatted text. Make <code>William Blake</code> the page\'s <code>&lt;h1&gt;</code>.',
    'An address is one paragraph: wrap all four address lines in a single <code>&lt;p&gt;</code>, then end each line with <code>&lt;br /&gt;</code> so they stack.',
    'Put an <code>&lt;hr /&gt;</code> between the address and the biography.',
    'The biography is two paragraphs: give each its own <code>&lt;p&gt;</code>. Don\'t fake the gap with <code>&lt;br /&gt;&lt;br /&gt;</code>; screen readers rely on real paragraphs.',
    'In the Explore tab, use the <b>diff checker</b> to find the one-character bug that turns a whole page into a giant heading.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Void Elements</title>
</head>
<body>

  <!-- TODO: format this page with h1, p, br and hr (see the task list) -->

  William Blake

  17 South Molton Street
  London
  W1K 5QT
  UK

  William Blake (1757–1827) was an English poet, painter and printmaker who
  spent almost his whole life in London. Few people bought his work while he
  was alive, and many thought him strange, but he is now counted among the
  great figures of the Romantic period.

  Blake printed many of his books himself, etching the words and pictures
  onto copper plates and colouring each copy by hand. His best-known poems
  include "The Tyger" and the collection Songs of Innocence and of Experience.

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Void Elements</title>
</head>
<body>

  <h1>William Blake</h1>

  <p>
    17 South Molton Street <br />
    London <br />
    W1K 5QT <br />
    UK
  </p>

  <hr />

  <p>
    William Blake (1757–1827) was an English poet, painter and printmaker who
    spent almost his whole life in London. Few people bought his work while he
    was alive, and many thought him strange, but he is now counted among the
    great figures of the Romantic period.
  </p>

  <p>
    Blake printed many of his books himself, etching the words and pictures
    onto copper plates and colouring each copy by hand. His best-known poems
    include "The Tyger" and the collection Songs of Innocence and of Experience.
  </p>

</body>
</html>
`},
  explore:[
  {
    title:'&lt;br /&gt; vs a new &lt;p&gt;', height:440,
    note:'Both put text on a new line. Only one of them says "this is a separate block of thought", and the spacing gives it away.',
    html:`
<div class="knobs">
  <label>show
    <select id="mode">
      <option value="br">address: one &lt;p&gt; with &lt;br /&gt;</option>
      <option value="p">address: three separate &lt;p&gt;</option>
      <option value="poem">poem: one &lt;p&gt; with &lt;br /&gt;</option>
      <option value="flat">poem: one &lt;p&gt;, no &lt;br /&gt;</option>
    </select>
  </label>
</div>
<div class="stage" id="stage"></div>
<pre class="readout" id="ro"></pre>
<p class="note">Use <code>&lt;br /&gt;</code> for lines that belong together but sit on separate lines: an address, a poem, song lyrics. Use a new <code>&lt;p&gt;</code> for a genuinely new paragraph.</p>
<script>
  var POEM = ['To see a World in a Grain of Sand', 'And a Heaven in a Wild Flower,', 'Hold Infinity in the palm of your hand', 'And Eternity in an hour.'];
  var OUT = 'outline:2px dashed #b9c0d4;padding:6px';
  var m = document.getElementById('mode');
  function upd(){
    var html, text;
    if (m.value === 'br'){
      html = '<p style="' + OUT + '">17 South Molton Street <br /> London <br /> W1K 5QT</p>';
      text = '<p>17 South Molton Street <br /> London <br /> W1K 5QT</p>\\n\\nONE paragraph (one dashed outline), three lines sitting tight together.';
    } else if (m.value === 'p'){
      html = '<p style="' + OUT + '">17 South Molton Street</p><p style="' + OUT + '">London</p><p style="' + OUT + '">W1K 5QT</p>';
      text = '<p>17 South Molton Street</p>\\n<p>London</p>\\n<p>W1K 5QT</p>\\n\\nTHREE paragraphs, each with a margin above and below.\\nThis claims they are three unrelated blocks of text.';
    } else if (m.value === 'poem'){
      html = '<p style="' + OUT + '">' + POEM.join(' <br />') + '</p>';
      text = 'Blake, Auguries of Innocence (opening lines).\\nOne paragraph; each <br /> marks where the poet wanted the line to end.';
    } else {
      html = '<p style="' + OUT + '">' + POEM.join(' ') + '</p>';
      text = 'The same four lines with no <br />: the browser joins them into one run of text\\nand the rhythm of the poem is lost.';
    }
    document.getElementById('stage').innerHTML = html;
    document.getElementById('ro').textContent = text;
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Diff checker: spot the bug', height:600,
    note:'A trick from the lecture: paste your code and the solution side by side and let the computer find the differences. Your version on the left has one harmless difference and one that breaks the page (look at the little preview). Fix it on the left until nothing important differs.',
    html:`
<style>
  textarea{width:100%;height:150px;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;border:1px solid #cfd5e6;border-radius:8px;padding:6px;resize:vertical}
  #diff{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;background:#fff;border:1px solid #dfe3ee;border-radius:8px;max-height:190px;overflow:auto;padding:4px 0}
  #diff div{padding:0 8px;white-space:pre}
  #diff .del{background:#ffe1e1;color:#8a1c1c}
  #diff .add{background:#dcf5e3;color:#14532d}
  #diff .same{color:#8b92a8}
  #diff b{display:inline-block;width:12px}
</style>
<div style="display:flex;gap:10px">
  <div style="flex:1"><h4>your code</h4><textarea id="mine" spellcheck="false"></textarea></div>
  <div style="flex:1"><h4>solution</h4><textarea id="theirs" spellcheck="false"></textarea></div>
</div>
<div style="display:flex;gap:10px;margin-top:8px">
  <div style="flex:1.4"><h4>differences</h4><div id="diff"></div></div>
  <div style="flex:1"><h4>your code, rendered</h4><iframe id="prev" style="width:100%;height:190px;border:1px solid #dfe3ee;border-radius:8px;background:#fff"></iframe></div>
</div>
<pre class="readout" id="ro" style="margin-top:10px;white-space:pre-wrap"></pre>
` + script(diffDemo, {
      mine:'<h1>William Blake</1>\n<p>\n  17 South Molton Street<br />\n  London <br />\n  W1K 5QT <br />\n  UK\n</p>\n<hr />\n<p>William Blake was an English poet, painter and printmaker.</p>',
      solution:'<h1>William Blake</h1>\n<p>\n  17 South Molton Street <br />\n  London <br />\n  W1K 5QT <br />\n  UK\n</p>\n<hr />\n<p>William Blake was an English poet, painter and printmaker.</p>',
    }),
  }],
  quiz:[
    { q:'Which of these is a correctly written line break?', options:['<code>&lt;/br&gt;</code>','<code>&lt;br\\&gt;</code>','<code>&lt;br /&gt;</code>','<code>&lt;br&gt;&lt;/br&gt;</code>'], answer:2, why:'The slash goes after the name, and it is a forward slash. Plain <code>&lt;br&gt;</code> is also valid HTML5; the course keeps the slash so void elements stand out.' },
    { q:'Why does <code>&lt;hr /&gt;</code> have no closing tag?', options:['Closing it is optional','It is not allowed to contain anything, so there is nothing to close around','It closes itself at the end of the line','Only headings have closing tags'], answer:1, why:'A void element has no content, so it is written as one tag.' },
    { q:'An address has four lines. What is the best markup?', options:['Four <code>&lt;p&gt;</code> elements','One <code>&lt;p&gt;</code> with a <code>&lt;br /&gt;</code> at the end of each line','Four <code>&lt;h3&gt;</code> elements','One <code>&lt;p&gt;</code> with <code>&lt;hr /&gt;</code> between the lines'], answer:1, why:'The address is a single unit whose line divisions matter, which is exactly what br is for.' },
    { q:'You typed <code>&lt;/1&gt;</code> instead of <code>&lt;/h1&gt;</code>. What happens?', options:['Nothing, the browser fixes it','The heading never closes, so everything after it is drawn as a giant heading','The page goes blank','Only the heading disappears'], answer:1, why:'The browser does not recognise </1> as a closing tag, so the h1 stays open and swallows the rest of the page.' },
  ],
  notes:`
    <h3>Where the slash goes</h3>
    <pre>&lt;/p&gt;     closing tag: slash BEFORE the name
&lt;br /&gt;   void element: slash AFTER the name, just before &gt;
&lt;hr /&gt;</pre>
    <p>Always a forward slash (/), never a backslash (\\). In HTML5 the trailing slash is optional, so <code>&lt;br&gt;</code> works too; the course writes it so void elements are easy to spot.</p>
    <h3>The void elements you'll meet</h3>
    <table>
      <tr><th>Tag</th><th>Does</th></tr>
      <tr><td><code>&lt;br /&gt;</code></td><td>Line break inside a paragraph</td></tr>
      <tr><td><code>&lt;hr /&gt;</code></td><td>Horizontal rule: a break between topics</td></tr>
      <tr><td><code>&lt;img /&gt;</code></td><td>An image (section 3)</td></tr>
      <tr><td><code>&lt;input /&gt;</code></td><td>A form field</td></tr>
      <tr><td><code>&lt;meta /&gt;</code>, <code>&lt;link /&gt;</code></td><td>Page information in the head</td></tr>
    </table>
    <h3>Don't stack breaks</h3>
    <p><code>&lt;br /&gt;&lt;br /&gt;</code> to fake a new paragraph looks fine but tells a screen reader nothing. Make a new <code>&lt;p&gt;</code> instead.</p>`
});


const L16 = {
  id:'s02-movie-ranking', index:16, udemyId:37349766, minutes:6, section:'s02', slug:'movie-ranking', kind:'build', project:true,
  title:'Movie Ranking',
  blurb:'Your first project, using only section 2: a title, a subtitle, a horizontal rule, and at least three films, each with a heading and a sentence on why you love it. Film critics\' sites such as rogerebert.com are the grown-up version of this page.',
  tasks:[
    'An <code>&lt;h1&gt;</code> title, for example <i>The Best Movies According to Ada</i>.',
    'An <code>&lt;h2&gt;</code> subtitle underneath, then an <code>&lt;hr /&gt;</code>.',
    'For each of at least three films: an <code>&lt;h3&gt;</code> with its name, then a <code>&lt;p&gt;</code> saying why you like it. h3, because the films sit under the subtitle, so no level is skipped.',
    'Use your own films and words. The Explore tab\'s checklist ticks off each requirement as you type.',
    'Extra: under one film, write a short poem about it inside one <code>&lt;p&gt;</code>, with <code>&lt;br /&gt;</code> at the end of each line.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Movie Ranking Project</title>
</head>
<body>

  <!-- TODO 1: an h1 title, e.g. The Best Movies According to (your name) -->

  <!-- TODO 2: an h2 subtitle, then a horizontal rule -->

  <!-- TODO 3: at least three films. For each one:
       an h3 with the film's name, then a p saying why you like it -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Movie Ranking Project</title>
</head>
<body>

  <h1>The Best Movies According to Ada</h1>
  <h2>My top 3 movies of all time.</h2>

  <hr />

  <h3>Spirited Away</h3>
  <p>My favourite anime. The backgrounds alone are worth the ticket.</p>

  <h3>Ex Machina</h3>
  <p>Clever, quiet science fiction, and the ending still bothers me.</p>

  <h3>Drive</h3>
  <p>
    Pink titles and a night drive, <br />
    hardly a word for minutes, <br />
    and the music does the talking.
  </p>

</body>
</html>
`},
  quiz:[
    { q:'Why are the film titles <code>&lt;h3&gt;</code> rather than <code>&lt;h2&gt;</code>?', options:['h3 is a nicer size','They sit under the h2 subtitle in the outline','h2 is only for dates','The course says so, for no reason'], answer:1, why:'Title (h1), subtitle (h2), then the films one level down (h3): a clean outline with no skipped level.' },
    { q:'You want the films numbered 1, 2, 3. What will section 3 give you for that?', options:['An <code>&lt;h7&gt;</code>','An ordered list, <code>&lt;ol&gt;</code>, which numbers items for you','A <code>&lt;br /&gt;</code> before each number','Nothing; type the numbers'], answer:1, why:'Typing the numbers by hand is fine for now; ordered lists arrive in the next section.' },
  ],
  notes:`
    <h3>What this is really practising</h3>
    <p>Nothing new, which is the point. Projects show you which pieces you remember without looking them up.</p>
    <h3>Go further</h3>
    <ul>
      <li>Add an <code>&lt;hr /&gt;</code> between each film and see whether you prefer it.</li>
      <li>Come back after section 3 and turn the ranking into an <code>&lt;ol&gt;</code>.</li>
      <li>Come back after section 6 and give it some CSS.</li>
    </ul>`
};
L16.explore = [checklist(L16, [
  { desc:'Exactly one <code>&lt;h1&gt;</code> title', test:"return doc.querySelectorAll('h1').length === 1;" },
  { desc:'An <code>&lt;h2&gt;</code> subtitle', test:"return doc.querySelectorAll('h2').length >= 1;" },
  { desc:'An <code>&lt;hr /&gt;</code> after the title block', test:"return !!doc.querySelector('h1 ~ hr, h2 ~ hr');" },
  { desc:'At least three films in <code>&lt;h3&gt;</code>', test:"return doc.querySelectorAll('h3').length >= 3;" },
  { desc:'A <code>&lt;p&gt;</code> straight after every film title', test:"var hs = doc.querySelectorAll('h3'); return hs.length > 0 && [].every.call(hs, function (h) { var n = h.nextElementSibling; return n && n.tagName === 'P'; });" },
  { desc:'No skipped heading levels', test:NO_SKIPS },
  { desc:'Only section 2 elements in the body (h1–h6, p, hr, br)', test:"return [].every.call(doc.body.querySelectorAll('*'), function (e) { return /^(H[1-6]|P|HR|BR)$/.test(e.tagName); });" },
], 'Project checklist', 'Reads your code from the Build tab and ticks off the brief. Switch to "the solution" to see a page that passes.')];
PG.add(L16);


PG.add({
  id:'l017', index:17, udemyId:21523656, minutes:1, section:'s02', slug:'ace-this-course', kind:'read',
  title:'How to Ace this Course',
  blurb:'Starting is already more than most people manage. Before the material gets harder, write down why you are learning to code and what you want the skill to do for you (the course has a goal-setting worksheet for this), and keep it where you study for the days your motivation dips.',
});

})();
