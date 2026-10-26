/* ===== Section 3 — Intermediate HTML ===== */
/* Wrapped in a function so the helper names below stay local to this file. */
(function () {

/* Demo scripts are real functions, stringified into the demo iframe. */
const script = (fn, cfg) => '<script>(' + fn + ')(' + JSON.stringify(cfg || {}).replace(/</g, '\\u003c') + ');<\/script>';

/* Explore iframes share the playground's origin, so a demo can read the code
   the learner typed in the Build tab (saved under wdplay:code:<lesson id>). */
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

/* ---------- lecture 18: numbers come from position; ol attributes ---------- */
function olDemo() {
  var items = ['Mix the milk, yeast, sugar and eggs', 'Add the flour and knead', 'Leave it to rise for 2 hours', 'Roll out, fill and slice', 'Bake for 20–25 minutes'];
  var $ = function (id) { return document.getElementById(id); };
  function attrs() {
    var a = '';
    if ($('start').value !== '') a += ' start="' + $('start').value + '"';
    if ($('rev').checked) a += ' reversed';
    if ($('type').value) a += ' type="' + $('type').value + '"';
    return a;
  }
  function draw() {
    var a = attrs();
    $('stage').innerHTML = '<ol' + a + '>' + items.map(function (t, i) {
      return '<li>' + t + ' <span class="mv"><button data-mv="' + i + '|-1" title="move up">▲</button><button data-mv="' + i + '|1" title="move down">▼</button></span></li>';
    }).join('') + '</ol>';
    $('ro').textContent = '<ol' + a + '>\n' + items.map(function (t) { return '  <li>' + t + '</li>'; }).join('\n') + '\n</ol>';
  }
  $('stage').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-mv]'); if (!b) return;
    var p = b.getAttribute('data-mv').split('|'), i = +p[0], j = i + +p[1];
    if (j < 0 || j >= items.length) return;
    var t = items[i]; items[i] = items[j]; items[j] = t; draw();
  });
  ['start', 'rev', 'type'].forEach(function (id) { $(id).addEventListener('input', draw); $(id).addEventListener('change', draw); });
  draw();
}

/* ---------- lecture 19: the element tree, built from a real nested list ---------- */
function treeDemo() {
  var page = document.getElementById('page'), tree = document.getElementById('tree'), ro = document.getElementById('ro');
  var rows = [], n = 0;
  function own(el) { return [].filter.call(el.childNodes, function (x) { return x.nodeType === 3; }).map(function (x) { return x.textContent.trim(); }).join(' ').trim(); }
  function name(el) { var t = own(el); return el.tagName.toLowerCase() + (t ? ' ' + t : ''); }
  function walk(el, depth) {
    [].forEach.call(el.children, function (c) {
      c.setAttribute('data-n', ++n);
      rows.push('<span class="r" data-n="' + n + '" style="padding-left:' + (6 + depth * 16) + 'px">' + name(c) + '</span>');
      walk(c, depth + 1);
    });
  }
  walk(page, 0);
  tree.innerHTML = rows.join('');
  function show(el) {
    var sibs = [].filter.call(el.parentElement.children, function (s) { return s !== el; }).map(name);
    var kids = [].map.call(el.children, name);
    ro.textContent =
      'element   ' + name(el) + '\n' +
      'parent    ' + (el.parentElement === page ? '(the page)' : name(el.parentElement)) + '\n' +
      'children  ' + (kids.length ? kids.join(', ') : 'none') + '\n' +
      'siblings  ' + (sibs.length ? sibs.join(', ') : 'none');
  }
  tree.addEventListener('mouseover', function (e) {
    var r = e.target.closest('.r'); if (!r) return;
    tree.querySelectorAll('.r').forEach(function (x) { x.classList.toggle('on', x === r); });
    page.querySelectorAll('[data-n]').forEach(function (x) { x.style.outline = x.getAttribute('data-n') === r.getAttribute('data-n') ? '2px solid #ff5c8a' : ''; });
    show(page.querySelector('[data-n="' + r.getAttribute('data-n') + '"]'));
  });
}

/* ---------- lecture 19: indentation, and what a missing </ol> does ---------- */
function nestDemo() {
  var CODE = [[0, '<ul>'], [1, '<li>A</li>'], [1, '<li>'], [2, 'B'], [2, '<ol>'], [3, '<li>B1</li>'], [3, '<li>B2</li>'], [3, '<li>B3</li>'], [2, '</ol>', 'gone'], [1, '</li>'], [1, '<li>C</li>'], [0, '</ul>']];
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function draw() {
    var indent = $('ind').checked, drop = $('drop').checked;
    var lines = CODE.filter(function (l) { return !(drop && l[2] === 'gone'); });
    $('code').innerHTML = lines.map(function (l) { return (indent ? new Array(l[0] + 1).join('  ') : '') + esc(l[1]); }).join('\n');
    $('stage').innerHTML = lines.map(function (l) { return l[1]; }).join('');
    $('ro').textContent = drop
      ? 'The </ol> is gone, so the ordered list never closes and C is drawn as item 4 of it.\n' + (indent
        ? 'With indentation, the <ol> on its own level has no partner below it. That gap is the bug.'
        : 'Without indentation, good luck spotting which tag is missing. Turn indentation back on.')
      : (indent ? 'Every opening tag lines up with its closing tag. The page and the code tell the same story.'
                : 'Same page, same tags: the browser ignores indentation. Only you lose the ability to see the structure.');
  }
  $('ind').addEventListener('change', draw); $('drop').addEventListener('change', draw);
  draw();
}

/* ---------- lecture 20: three broken links ---------- */
function bugDemo() {
  var BUGS = [
    { site: 'Wikipedia', code: '<a>Wikipedia</a href="https://www.wikipedia.org/">' },
    { site: 'CodePen', code: '<a href="https://codepen.io/\'>CodePen</a>' },
    { site: 'MDN', code: '<a href="developer.mozilla.org">MDN</a>' }
  ];
  var box = document.getElementById('bugs');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  box.innerHTML = BUGS.map(function (b, i) {
    return '<div class="bug"><input data-i="' + i + '" value="' + esc(b.code) + '" spellcheck="false"><div class="res" id="res' + i + '"></div><div class="st" id="st' + i + '"></div></div>';
  }).join('');
  function check(i) {
    var code = box.querySelector('input[data-i="' + i + '"]').value;
    var doc = new DOMParser().parseFromString(code, 'text/html');
    var a = doc.body.querySelector('a'), href = a && a.getAttribute('href');
    [].forEach.call(doc.body.querySelectorAll('a[href]'), function (x) { x.setAttribute('target', '_blank'); });
    document.getElementById('res' + i).innerHTML = doc.body.innerHTML || '<i style="color:#8b92a8">(nothing shows at all)</i>';
    var st = document.getElementById('st' + i), msg, ok = false;
    if (!doc.body.textContent.trim()) msg = '✗ Nothing appears: a quote is not closed properly, so the browser swallows the rest of the tag.';
    else if (!a || href === null) msg = '✗ Plain text, not a link: the opening tag has no href (attributes in a closing tag are ignored).';
    else if (!/^https?:\/\//.test(href)) msg = '✗ href="' + href + '" has no https://, so the browser looks for a file called ' + href + ' on YOUR site.';
    else if (a.textContent.trim() !== BUGS[i].site) msg = '✗ The link text should be ' + BUGS[i].site + '.';
    else { ok = true; msg = '✓ A working link to ' + href; }
    st.textContent = msg; st.className = 'st ' + (ok ? 'ok' : 'bad');
  }
  box.addEventListener('input', function (e) { if (e.target.dataset.i != null) check(+e.target.dataset.i); });
  BUGS.forEach(function (b, i) { check(i); });
}

/* ---------- lecture 21: what alt text is for ---------- */
function altDemo() {
  var $ = function (id) { return document.getElementById(id); };
  function upd() {
    var img = $('img'), mode = $('mode').value, broken = $('broken').checked, w = $('w').value;
    img.src = broken ? 'assets/paths/no-such-picture.png' : 'assets/paths/dog.png';
    if (mode === 'none') img.removeAttribute('alt'); else img.setAttribute('alt', mode === 'empty' ? '' : $('alt').value);
    img.width = w; $('wv').textContent = w + 'px';
    $('alt').disabled = mode !== 'text';
    var tag = '<img src="' + (broken ? 'assets/paths/no-such-picture.png' : 'assets/paths/dog.png') + '"' +
      (mode === 'none' ? '' : ' alt="' + (mode === 'empty' ? '' : $('alt').value) + '"') + ' width="' + w + '" />';
    var says = mode === 'text' ? '"' + ($('alt').value || '') + ', image"'
      : mode === 'empty' ? '(nothing: alt="" tells it the picture is decoration and can be skipped)'
      : '"' + (broken ? 'no-such-picture.png' : 'dog.png') + ', image" or similar: with no alt, many screen readers read out the file name';
    $('ro').textContent = tag + '\n\nscreen reader says  ' + says + '\n' +
      (broken ? 'image failed      the browser shows the alt text (if any) in place of the picture' : 'image loaded      sighted users see no difference between the three alt options');
  }
  ['mode', 'alt', 'broken', 'w'].forEach(function (id) { $(id).addEventListener('input', upd); $(id).addEventListener('change', upd); });
  upd();
}

/* ---------- lecture 23: a don't-break-the-chain calendar ---------- */
function chainDemo() {
  var KEY = 'wdplay-tip:chain', marks = {};
  try { marks = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  var $ = function (id) { return document.getElementById(id); };
  var view = new Date(); view.setDate(1);
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function key(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(marks)); } catch (e) {} }
  function current() { var d = new Date(), n = 0; if (!marks[key(d)]) d.setDate(d.getDate() - 1); while (marks[key(d)]) { n++; d.setDate(d.getDate() - 1); } return n; }
  function best() {
    var ks = Object.keys(marks).filter(function (k) { return marks[k]; }).sort(), b = 0, run = 0, prev = null;
    ks.forEach(function (k) { var d = new Date(k + 'T12:00:00'); run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1; if (run > b) b = run; prev = d; });
    return b;
  }
  function draw() {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    $('month').textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
    var first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate(), cells = [];
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) { cells.push('<div class="hd">' + d + '</div>'); });
    for (var i = 0; i < first; i++) cells.push('<div></div>');
    for (var day = 1; day <= days; day++) {
      var d = new Date(view.getFullYear(), view.getMonth(), day), k = key(d), future = d > today;
      cells.push('<button class="day' + (marks[k] ? ' x' : '') + (d.getTime() === today.getTime() ? ' today' : '') + '" data-k="' + k + '"' + (future ? ' disabled' : '') + '>' + day + '</button>');
    }
    $('cal').innerHTML = cells.join('');
    var c = current(), b = best();
    $('ro').textContent = 'current chain  ' + c + ' day' + (c === 1 ? '' : 's') + '\nlongest chain  ' + b + ' day' + (b === 1 ? '' : 's') + '\n\n' +
      (c ? 'Keep it going: cross off today once you have done some coding.' : 'Click a day you coded to cross it off. Days in a row make a chain.');
  }
  $('cal').addEventListener('click', function (e) {
    var b = e.target.closest('button.day'); if (!b || b.disabled) return;
    var k = b.getAttribute('data-k'); if (marks[k]) delete marks[k]; else marks[k] = 1;
    save(); draw();
  });
  $('prev').addEventListener('click', function () { view.setMonth(view.getMonth() - 1); draw(); });
  $('next').addEventListener('click', function () { view.setMonth(view.getMonth() + 1); draw(); });
  draw();
}


PG.add({
  id:'s03-lists', index:18, udemyId:37349778, minutes:11, section:'s03', slug:'lists', kind:'build',
  title:'The List Element',
  blurb:'Two kinds of list: <code>&lt;ul&gt;</code> when the order does not matter (bullets) and <code>&lt;ol&gt;</code> when it does (numbers the browser adds for you). Either way, each item goes in its own <code>&lt;li&gt;</code>, and only <code>li</code> elements sit directly inside the list.',
  tasks:[
    'Wrap the recipe title in an <code>&lt;h1&gt;</code>, <i>Ingredients</i> and <i>Instructions</i> in <code>&lt;h2&gt;</code>, and the two "For the …" labels in <code>&lt;h3&gt;</code>.',
    'Turn the six dough ingredients into an <b>unordered</b> list: one <code>&lt;ul&gt;</code>, each ingredient in its own <code>&lt;li&gt;</code>.',
    'Do the same for the three filling ingredients.',
    'The ten steps must happen in order, so they go in an <code>&lt;ol&gt;</code>. Don\'t type any numbers: the list counts for you.',
    'Move one step to a different place in the list and watch every number update.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>List Element</title>
</head>
<body>

  <!-- TODO 1: headings: h1 for the title, h2 for Ingredients and Instructions,
       h3 for the two "For the ..." labels -->
  Recipe for the Best Cinnamon Rolls

  Ingredients

  For the dough:
  <!-- TODO 2: an unordered list, one li per ingredient -->
  ¾ cup warm milk
  2¼ teaspoons yeast
  ¼ cup granulated sugar
  1 egg plus 1 egg yolk
  ¼ cup butter
  3 cups bread flour

  For the filling:
  <!-- TODO 3: another unordered list -->
  ⅔ cup dark brown sugar
  1½ tablespoons ground cinnamon
  ¼ cup butter

  Instructions
  <!-- TODO 4: an ORDERED list, because these steps happen in sequence -->
  Stir the yeast, sugar and eggs into the warm milk.
  Melt the butter and add it to the mixture.
  Add the flour and mix until it comes together as a dough.
  Knead the dough for 10 minutes.
  Put the dough in a large bowl, cover it and leave it to rise for 2 hours.
  Once it has doubled in size, roll it out into a large rectangle.
  For the filling, melt the butter and stir in the sugar and cinnamon.
  Spread the filling over the dough and roll it up like a swiss roll.
  Slice the roll into 3cm pieces and lay them flat in a baking tray.
  Bake at 180°C (350°F) for 20–25 minutes, until lightly browned.

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>List Element</title>
</head>
<body>

  <h1>Recipe for the Best Cinnamon Rolls</h1>

  <h2>Ingredients</h2>

  <h3>For the dough:</h3>
  <ul>
    <li>¾ cup warm milk</li>
    <li>2¼ teaspoons yeast</li>
    <li>¼ cup granulated sugar</li>
    <li>1 egg plus 1 egg yolk</li>
    <li>¼ cup butter</li>
    <li>3 cups bread flour</li>
  </ul>

  <h3>For the filling:</h3>
  <ul>
    <li>⅔ cup dark brown sugar</li>
    <li>1½ tablespoons ground cinnamon</li>
    <li>¼ cup butter</li>
  </ul>

  <h2>Instructions</h2>
  <ol>
    <li>Stir the yeast, sugar and eggs into the warm milk.</li>
    <li>Melt the butter and add it to the mixture.</li>
    <li>Add the flour and mix until it comes together as a dough.</li>
    <li>Knead the dough for 10 minutes.</li>
    <li>Put the dough in a large bowl, cover it and leave it to rise for 2 hours.</li>
    <li>Once it has doubled in size, roll it out into a large rectangle.</li>
    <li>For the filling, melt the butter and stir in the sugar and cinnamon.</li>
    <li>Spread the filling over the dough and roll it up like a swiss roll.</li>
    <li>Slice the roll into 3cm pieces and lay them flat in a baking tray.</li>
    <li>Bake at 180°C (350°F) for 20–25 minutes, until lightly browned.</li>
  </ol>

</body>
</html>
`},
  explore:[
  {
    title:'ul vs ol, and the list-style property', height:470,
    note:'Same list items, different container and different markers. The choice between ul and ol is about <b>meaning</b>; the look is CSS and can be anything.',
    html:`
<div class="knobs">
  <label>container
    <select id="tag"><option value="ul">&lt;ul&gt; unordered</option><option value="ol">&lt;ol&gt; ordered</option></select>
  </label>
  <label>list-style-type
    <select id="st">
      <option value="">(default)</option>
      <option value="disc">disc</option><option value="circle">circle</option>
      <option value="square">square</option><option value="decimal">decimal</option>
      <option value="lower-alpha">lower-alpha</option><option value="upper-roman">upper-roman</option>
      <option value="none">none</option>
    </select>
  </label>
</div>
<div class="stage" id="stage"></div>
<pre class="readout" id="ro"></pre>
<p class="note">Pick the tag for what the content <em>means</em>: steps in a recipe are ordered, ingredients are not. Then style it however you like. A <code>&lt;ul&gt;</code> showing numbers is still unordered underneath, which is misleading, so try not to.</p>
<script>
  var tag = document.getElementById('tag'), st = document.getElementById('st');
  function upd(){
    var style = st.value ? ' style="list-style-type:' + st.value + '"' : '';
    document.getElementById('stage').innerHTML =
      '<' + tag.value + style + '>' +
      '<li>Wash the clothes</li><li>Read a chapter</li><li>Do the maths questions</li>' +
      '</' + tag.value + '>';
    document.getElementById('ro').textContent =
      '<' + tag.value + '>\\n' +
      '  <li>Wash the clothes</li>\\n  <li>Read a chapter</li>\\n  <li>Do the maths questions</li>\\n' +
      '</' + tag.value + '>' +
      (st.value ? '\\n\\n' + tag.value + ' { list-style-type: ' + st.value + '; }' : '');
  }
  tag.addEventListener('change', upd); st.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Where the numbers come from', height:480,
    note:'Move the steps around with ▲ ▼: each number comes only from the item\'s position. The extra attributes (not in the lecture, but handy) change how an <code>&lt;ol&gt;</code> counts.',
    html:`
<style>.mv button{font-size:10px;padding:0 5px;margin-left:2px}</style>
<div class="knobs">
  <label>start <input type="number" id="start" placeholder="1" style="width:60px"></label>
  <label><input type="checkbox" id="rev"> reversed</label>
  <label>type <select id="type"><option value="">1, 2, 3</option><option value="a">a, b, c</option><option value="A">A, B, C</option><option value="i">i, ii, iii</option><option value="I">I, II, III</option></select></label>
</div>
<div class="stage" id="stage" style="font-size:14px;line-height:1.9"></div>
<pre class="readout" id="ro"></pre>
` + script(olDemo),
  }],
  quiz:[
    { q:'Which list suits the steps of a recipe?', options:['<code>&lt;ul&gt;</code>, bullets look tidier','<code>&lt;ol&gt;</code>, because the order matters','<code>&lt;li&gt;</code> on its own','Either; the browser decides'], answer:1, why:'You cannot bake before you mix. When the sequence carries meaning, use an ordered list.' },
    { q:'What may sit directly inside a <code>&lt;ul&gt;</code>?', options:['Any element','Only <code>&lt;li&gt;</code> elements','Only text','<code>&lt;p&gt;</code> and <code>&lt;li&gt;</code>'], answer:1, why:'Anything else you want in a list (text, links, even another list) goes inside an li.' },
    { q:'You move the third <code>&lt;li&gt;</code> of an <code>&lt;ol&gt;</code> to the top. What number does it show?', options:['3','1: numbers come from the position in the code','0','It keeps 3 and the others renumber'], answer:1, why:'The browser numbers items in source order, which is why you never type the numbers yourself.' },
  ],
  notes:`
    <h3>The two lists</h3>
    <ul>
      <li><code>&lt;ul&gt;</code>: <b>u</b>nordered. Bullets. Shopping lists, features, ingredients.</li>
      <li><code>&lt;ol&gt;</code>: <b>o</b>rdered. Numbers. Steps, rankings, instructions.</li>
      <li><code>&lt;li&gt;</code>: <b>l</b>ist <b>i</b>tem. Goes inside either one.</li>
    </ul>
    <h3>Lists don't have to look like lists</h3>
    <p>Right-click a row of product cards or a "top 10" page and choose Inspect: very often it is a <code>&lt;ul&gt;</code> of <code>&lt;li&gt;</code>s that CSS has turned into a grid.</p>
    <h3>One line or several</h3>
    <p><code>&lt;li&gt;Bake the rolls.&lt;/li&gt;</code> on one line and the same item spread over three lines render identically. Prettier may reflow long items when you save; that is only formatting.</p>
    <h3>Emmet shortcut</h3>
    <p>In VS Code, type <code>ul>li*5</code> and press Tab to get a list with five empty items.</p>`
});


PG.add({
  id:'s03-nesting', index:19, udemyId:37349804, minutes:14, section:'s03', slug:'nesting', kind:'build',
  title:'Nesting and Indentation',
  blurb:'Elements live inside other elements, forming a tree. A list can sit inside a list item, as long as the parent <code>&lt;/li&gt;</code> comes <i>after</i> the nested list: tags close in the reverse order they opened. Indentation changes nothing on the page; it is how <em>you</em> see the tree and spot a missing tag.',
  tasks:[
    'The starter already has the outer list: A, B, C. Inside the <code>li</code> for B, after the letter B, add an <code>&lt;ol&gt;</code> with B1, B2, B3, then move B\'s <code>&lt;/li&gt;</code> down to after that list.',
    'Inside B2, after its text, add a <code>&lt;ul&gt;</code> with B2a, B2b and B2c.',
    'Inside B2a (the first one), add a <code>&lt;ul&gt;</code> with B2aa and B2ab. Inside B3, add an <code>&lt;ol&gt;</code> with B31 and B32.',
    'Indent one step per level so every closing tag lines up under its opening tag. The preview should match the target drawn in the comment.',
    'Now delete the <code>&lt;/ol&gt;</code> that closes B1–B3: C turns into item 4. Use your indentation to find the gap, and put it back.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nesting and Indentation</title>
</head>
<body>

  <!-- TODO: build this nested list (bullets = ul, numbers = ol)
       • A
       • B
           1. B1
           2. B2
                ◦ B2a
                     ▪ B2aa
                     ▪ B2ab
                ◦ B2b
                ◦ B2c
           3. B3
                1. B31
                2. B32
       • C
  -->

  <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
  </ul>

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nesting and Indentation</title>
</head>
<body>

  <ul>
    <li>A</li>
    <li>
      B
      <ol>
        <li>B1</li>
        <li>
          B2
          <ul>
            <li>
              B2a
              <ul>
                <li>B2aa</li>
                <li>B2ab</li>
              </ul>
            </li>
            <li>B2b</li>
            <li>B2c</li>
          </ul>
        </li>
        <li>
          B3
          <ol>
            <li>B31</li>
            <li>B32</li>
          </ol>
        </li>
      </ol>
    </li>
    <li>C</li>
  </ul>

</body>
</html>
`},
  explore:[
  {
    title:'The HTML tree', height:640,
    note:'The finished exercise as a tree. Hover a branch on the right to highlight it on the left and see its family: parent, children, siblings. These words come back constantly in CSS and JavaScript. Notice the bullets change shape as unordered lists get deeper.',
    html:`
<style>
  #tree .r{display:block;padding:1px 6px;border-radius:3px;cursor:default;white-space:nowrap}
  #tree .r.on{background:#2b3550}
  #page ul,#page ol{margin:2px 0;padding-left:22px}
</style>
<div class="stage" style="display:flex;gap:14px;align-items:flex-start">
  <div style="flex:1">
    <h4>the page</h4>
    <div id="page" style="border:1px solid #dfe3ee;border-radius:8px;padding:6px 10px;font-size:13px">
      <ul>
        <li>A</li>
        <li>B
          <ol>
            <li>B1</li>
            <li>B2
              <ul>
                <li>B2a
                  <ul><li>B2aa</li><li>B2ab</li></ul>
                </li>
                <li>B2b</li>
                <li>B2c</li>
              </ul>
            </li>
            <li>B3
              <ol><li>B31</li><li>B32</li></ol>
            </li>
          </ol>
        </li>
        <li>C</li>
      </ul>
    </div>
  </div>
  <div style="flex:1">
    <h4>the tree (hover a line)</h4>
    <pre class="readout" id="tree" style="margin:0;font-size:12px;line-height:1.5"></pre>
  </div>
</div>
<pre class="readout" id="ro">hover a line of the tree</pre>
` + script(treeDemo),
  },
  {
    title:'Indentation, and a missing tag', height:520,
    note:'The browser ignores indentation completely; you are the one who needs it. Delete the <code>&lt;/ol&gt;</code> and see what happens to C, then try finding the problem with the indentation switched off.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="ind" checked> indent the code</label>
  <label><input type="checkbox" id="drop"> delete the &lt;/ol&gt;</label>
</div>
<div class="stage" style="display:flex;gap:14px;align-items:flex-start">
  <pre id="code" class="readout" style="flex:1;margin:0;min-height:250px"></pre>
  <div style="flex:1"><h4>the page</h4><div id="stage" style="font-size:13px"></div></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
` + script(nestDemo),
  }],
  quiz:[
    { q:'Where does the closing <code>&lt;/li&gt;</code> of item B go when B contains a sub-list?', options:['Straight after the letter B','After the sub-list\'s closing tag','Before the sub-list opens','It is not needed'], answer:1, why:'The sub-list belongs to B, so B can only close once everything inside it has closed.' },
    { q:'What does indentation change in the rendered page?', options:['Nothing: it is for people reading the code','How far items are indented','Which list an item belongs to','The bullet style'], answer:0, why:'Browsers ignore leading spaces. Indentation exists to show you the structure.' },
    { q:'You delete the <code>&lt;/ol&gt;</code> that closes B1–B3. What happens to C?', options:['It disappears','It becomes item 4 of the ordered list','It turns bold','Nothing'], answer:1, why:'With the ordered list still open, the next list item lands inside it.' },
  ],
  notes:`
    <h3>Indentation is for humans</h3>
    <p>The browser does not care at all. You care enormously: a missing <code>&lt;/li&gt;</code> is almost invisible in flat code and obvious in indented code.</p>
    <h3>Let the editor do it</h3>
    <p>With format-on-save turned on, Cmd+S (Mac) or Ctrl+S (Windows) re-indents the whole file. You can also run Format Document: <b>Shift+Option+F</b> on a Mac, <b>Shift+Alt+F</b> on Windows. If the result looks wrong, that is usually a genuinely unclosed tag.</p>
    <h3>Nest properly, don't overlap</h3>
    <pre>&lt;p&gt;&lt;strong&gt;Hello&lt;/strong&gt;&lt;/p&gt;   correct: inner closes first
&lt;p&gt;&lt;strong&gt;Hello&lt;/p&gt;&lt;/strong&gt;   wrong: they cross over</pre>
    <p>Think of tags as brackets in maths: the last one you opened is the first one you close.</p>`
});


const L20 = {
  id:'s03-anchors', index:20, udemyId:37349818, minutes:11, section:'s03', slug:'anchors', kind:'build',
  title:'Anchor Elements',
  blurb:'<code>&lt;a&gt;</code> only becomes a link once it has an <code>href</code> attribute holding the address. Attributes always go in the opening tag as <code>name="value"</code>, with the value in quotes because it is plain text. Some attributes belong to one element (<code>href</code> on <code>a</code>, <code>start</code> on <code>ol</code>); <b>global</b> ones such as <code>draggable</code> work on any element.',
  tasks:[
    'Under the heading, add an <code>&lt;ol&gt;</code> with five <code>&lt;li&gt;</code> items.',
    'Inside each <code>li</code>, put an <code>&lt;a&gt;</code> with the site\'s name as its text and the full address (with <code>https://</code>) in <code>href</code>. The addresses are in the comment; your own favourites are fine too.',
    'Click a link in the preview to test it. Some sites refuse to open inside a frame; press <b>▶ Run</b> to come back. The numbers stay black because they belong to the <code>li</code>, not the link.',
    'Bonus from the lecture: look up <code>&lt;ol&gt;</code> on MDN, find the <code>start</code> attribute, and make the list count from 5.',
    'Extra: add the global attribute <code>draggable="true"</code> to the heading and try dragging it in the preview.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Anchor Elements</title>
</head>
<body>

  <h1>My Top 5 Favourite Websites</h1>

  <!-- TODO: an ordered list of five links. Use these, or your own favourites:
       Product Hunt     https://www.producthunt.com/
       MDN Web Docs     https://developer.mozilla.org/
       Wikipedia        https://www.wikipedia.org/
       CodePen          https://codepen.io/
       Stellarium Web   https://stellarium-web.org/
  -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Anchor Elements</title>
</head>
<body>

  <h1 draggable="true">My Top 5 Favourite Websites</h1>

  <!-- start="5" is the bonus: the list counts 5 to 9 -->
  <ol start="5">
    <li><a href="https://www.producthunt.com/">Product Hunt</a></li>
    <li><a href="https://developer.mozilla.org/">MDN Web Docs</a></li>
    <li><a href="https://www.wikipedia.org/">Wikipedia</a></li>
    <li><a href="https://codepen.io/">CodePen</a></li>
    <li><a href="https://stellarium-web.org/">Stellarium Web</a></li>
  </ol>

</body>
</html>
`},
  explore:[
  {
    title:'Anatomy of a link', height:500,
    note:'Change the attributes and watch the tag rebuild itself. Attributes always live in the <b>opening</b> tag as <code>name="value"</code>. The last switch puts a global attribute on a paragraph.',
    html:`
<div class="knobs">
  <label>href <input type="text" id="href" value="https://www.producthunt.com/" size="26"></label>
  <label>text <input type="text" id="txt" value="Product Hunt" size="14"></label>
  <label><input type="checkbox" id="blank"> target="_blank" (extra)</label>
  <label><input type="checkbox" id="title"> title tooltip (extra)</label>
  <label><input type="checkbox" id="drag"> draggable="true" on the paragraph</label>
</div>
<div class="stage">
  <div id="out" style="font-size:15px"></div>
  <p id="dp" style="margin:14px 0 0;padding:8px 10px;background:#f6f7fb;border:1px dashed #cfd5e6;border-radius:6px;font-size:13px">Try to drag this paragraph somewhere.</p>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">Empty the <b>href</b> box: the text stops looking like a link at all. An anchor without a destination is just text.</p>
<script>
  var h = document.getElementById('href'), t = document.getElementById('txt'),
      b = document.getElementById('blank'), ti = document.getElementById('title'), dr = document.getElementById('drag');
  function upd(){
    var attrs = h.value ? ' href="' + h.value + '"' : '';
    if (b.checked) attrs += ' target="_blank"';
    if (ti.checked) attrs += ' title="Opens ' + (h.value || 'nothing') + '"';
    document.getElementById('out').innerHTML = '<a' + attrs + (b.checked ? '' : ' target="_blank"') + '>' + (t.value || '(no text)') + '</a>';
    var p = document.getElementById('dp');
    if (dr.checked) p.setAttribute('draggable', 'true'); else p.removeAttribute('draggable');
    document.getElementById('ro').textContent =
      '<a' + attrs + '>' + (t.value || '(no text)') + '</a>\\n' +
      (dr.checked ? '<p draggable="true">Try to drag this paragraph somewhere.</p>\\n' : '<p>Try to drag this paragraph somewhere.</p>\\n') + '\\n' +
      'href       where the link goes (only <a> has it)\\n' +
      (b.checked ? 'target     _blank opens it in a NEW tab\\n' : '') +
      (ti.checked ? 'title      the tooltip on hover (a global attribute)\\n' : '') +
      (dr.checked ? 'draggable  a global attribute: now the paragraph can be picked up and dragged\\n' : 'draggable  off: dragging the paragraph only selects its text\\n');
  }
  [h,t,b,ti,dr].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  },
  {
    title:'Spot the bug', height:350,
    note:'Three links that don\'t work. Edit each line until it says ✓. Each one is a classic mistake from the lecture.',
    html:`
<style>
  .bug{background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:8px 10px;margin-bottom:8px}
  .bug input{width:100%;font-family:ui-monospace,Menlo,monospace;font-size:12px;padding:5px 7px;border:1px solid #cfd5e6;border-radius:6px}
  .bug .res{margin:6px 0 2px;font-size:14px;min-height:20px}
  .bug .st{font-size:12px}
  .bug .st.ok{color:#14532d}.bug .st.bad{color:#8a1c1c}
</style>
<div id="bugs"></div>
` + script(bugDemo),
  }],
  quiz:[
    { q:'Where do attributes go?', options:['In the closing tag','In the opening tag, after the tag name','Between the tags, before the text','In a separate file'], answer:1, why:'Name, equals sign, quoted value, inside the opening tag. Attributes in a closing tag are ignored.' },
    { q:'You write <code>&lt;a&gt;Product Hunt&lt;/a&gt;</code>. What happens?', options:['It links to producthunt.com','It shows as plain text and does nothing when clicked','It shows an error','It opens a new tab'], answer:1, why:'Without href the anchor has no destination, so the browser treats it as ordinary text.' },
    { q:'Which of these is a <b>global</b> attribute, usable on any element?', options:['href','start','draggable','src'], answer:2, why:'href belongs to a, start to ol and src to img; draggable (like id, class and title) works everywhere.' },
    { q:'What does <code>&lt;ol start="5"&gt;</code> do?', options:['Shows only five items','Numbers the items from 5','Skips the first four items','Adds five empty items'], answer:1, why:'start sets the first number; a five-item list then counts 5 to 9.' },
  ],
  notes:`
    <h3>Attributes</h3>
    <p>An attribute adds information to an element, written <code>name="value"</code> in the opening tag. The quotes mark the value as plain text, separate from HTML words like <code>a</code> or <code>href</code>. Separate several attributes with spaces.</p>
    <h3>Kinds of href</h3>
    <table>
      <tr><td><code>https://example.com</code></td><td>Another website (always include https://)</td></tr>
      <tr><td><code>./about.html</code></td><td>Another page of yours (relative, section 4)</td></tr>
      <tr><td><code>#section-2</code></td><td>Jump to an id on this page</td></tr>
      <tr><td><code>mailto:me@example.com</code></td><td>Opens an email</td></tr>
    </table>
    <h3>Extras you will see around</h3>
    <p><code>target="_blank"</code> opens the link in a new tab (modern browsers add <code>rel="noopener"</code> behaviour automatically). <code>title</code> adds a tooltip. Neither is part of this lecture.</p>
    <h3>Write link text that means something</h3>
    <p>"Click here" tells a screen-reader user nothing when read out of context. "Read the syllabus" tells them everything.</p>`
};
PG.add(L20);


PG.add({
  id:'s03-images', index:21, udemyId:37349846, minutes:8, section:'s03', slug:'images', kind:'build',
  title:'Image Elements',
  blurb:'<code>&lt;img /&gt;</code> is a void element like <code>&lt;br /&gt;</code>: there is no text to wrap, because the picture is the content. <code>src</code> says where the image file is; <code>alt</code> describes it for screen readers and appears if the image fails to load. While you build, <code>https://picsum.photos/200</code> serves a random placeholder photo.',
  tasks:[
    'Cat person or dog person? Finish the <code>&lt;h1&gt;</code>.',
    'Below it, add an <code>&lt;img /&gt;</code> whose <code>src</code> is the matching picture address from the comment. No closing tag: it is a void element.',
    'Add an <code>alt</code> that says what the picture shows, e.g. "beagle with its tongue out", not "image of a dog". The page looks the same; the description is for people who cannot see it.',
    'Break the <code>src</code> on purpose by deleting a letter: the browser shows your alt text instead. Then fix it.',
    'Extra: add a second image with <code>src="https://picsum.photos/200"</code> and an alt such as "random placeholder photo". Press ▶ Run a few times; it may be a different photo each time.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Image Elements</title>
</head>
<body>

  <!-- TODO 1: cat person or dog person? -->
  <h1>I am a ___ Person</h1>

  <!-- TODO 2-3: an img with src and alt. This playground keeps two photos:
         dog:  assets/paths/dog.png
         cat:  assets/paths/Folder0/Folder3/cat.png
       (lecture 25 explains how addresses like these work) -->

  <!-- TODO 5 (extra): a placeholder image from https://picsum.photos/200 -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Image Elements</title>
</head>
<body>

  <h1>I am a Dog Person</h1>

  <img src="assets/paths/dog.png" alt="beagle looking at the camera with its tongue out" />

  <!-- for cat people:
  <h1>I am a Cat Person</h1>
  <img src="assets/paths/Folder0/Folder3/cat.png" alt="black and white cat peering over a wooden ledge" />
  -->

  <p>And a placeholder, a different photo on many reloads:</p>
  <img src="https://picsum.photos/200" alt="random placeholder photo" />

</body>
</html>
`},
  explore:[{
    title:'Why alt text exists', height:500,
    note:'Break the image and the alt text is all that is left. It is also exactly what a blind user hears, and what search engines read.',
    html:`
<div class="knobs">
  <label>alt
    <select id="mode">
      <option value="text">a description</option>
      <option value="empty">alt="" (decorative)</option>
      <option value="none">no alt at all</option>
    </select>
  </label>
  <label><input type="text" id="alt" value="beagle looking at the camera with its tongue out" size="34"></label>
  <label><input type="checkbox" id="broken"> break the src</label>
  <label>width <input type="range" min="100" max="300" value="220" id="w"><span class="val" id="wv"></span></label>
</div>
<div class="stage" style="min-height:190px">
  <img id="img" style="display:block;border-radius:8px" />
</div>
<pre class="readout" id="ro"></pre>
<p class="note"><b>Good alt text</b> describes what the image shows, not that it is an image. For a purely decorative picture write <code>alt=""</code> so screen readers skip it; leaving alt out entirely makes many of them read out the file name.</p>
` + script(altDemo),
  }],
  quiz:[
    { q:'Why does <code>&lt;img&gt;</code> have no closing tag?', options:['It is optional','It has no text content to wrap: the picture comes from src','Images close themselves after loading','It needs <code>&lt;/img&gt;</code>'], answer:1, why:'Like br and hr, img is a void element.' },
    { q:'Which alt text is best for a photo of a puppy digging on a beach?', options:['image','photo.jpg','puppy digging in the sand on a beach','dog picture image'], answer:2, why:'Describe what is in the picture; a screen reader already announces that it is an image.' },
    { q:'What should a purely decorative image have?', options:['No alt attribute at all','<code>alt=""</code>, so screen readers skip it','<code>alt="decoration"</code>','A title instead'], answer:1, why:'An empty alt says "nothing to describe here". A missing alt often makes the screen reader read the file name.' },
    { q:'What does <code>https://picsum.photos/200</code> give you?', options:['A 200 KB image','A random 200 × 200 placeholder photo','The 200th photo on the site','An error'], answer:1, why:'It is the image version of Lorem Ipsum: something in place while you build the layout.' },
  ],
  notes:`
    <h3>The attributes</h3>
    <ul>
      <li><code>src</code>: where the file is. A full URL, or a path to a file of yours (section 4).</li>
      <li><code>alt</code>: a text description. Read by screen readers, shown if the image fails, used by search engines.</li>
      <li><code>width</code> / <code>height</code> (extra): size in pixels. Proper sizing comes with CSS.</li>
    </ul>
    <h3>Formats</h3>
    <table>
      <tr><td><b>JPG</b></td><td>Photographs. Small files, no transparency.</td></tr>
      <tr><td><b>PNG</b></td><td>Logos, screenshots, anything needing transparency.</td></tr>
      <tr><td><b>GIF</b></td><td>Simple animations; they play by themselves, no extra code.</td></tr>
      <tr><td><b>SVG</b></td><td>Icons and logos. Vector, so never blurry.</td></tr>
      <tr><td><b>WebP</b></td><td>The modern all-rounder, smaller than JPG or PNG.</td></tr>
    </table>
    <h3>Check a real site</h3>
    <p>Right-click any photo on a news site and choose Inspect: its <code>alt</code> is exactly what a screen reader announces.</p>`
});


const L22 = {
  id:'s03-birthday', index:22, udemyId:37349866, minutes:4, section:'s03', slug:'birthday-invite', kind:'build', project:true,
  title:'Birthday Invite',
  blurb:'An open project: invite people to your birthday with anything from sections 2 and 3. The only requirements are at least <b>one image</b>, <b>one list</b> and <b>one link</b>; the wording and any extra sections are yours. It will look like a 1990s web page, and that is fine: CSS comes next.',
  tasks:[
    'An <code>&lt;h1&gt;</code> announcing the birthday and an <code>&lt;h2&gt;</code> with the date.',
    'An <code>&lt;img /&gt;</code> with an <code>alt</code> description. Use the picture address in the comment or any image URL.',
    'An <code>&lt;h3&gt;</code> "What to bring" and a <code>&lt;ul&gt;</code> with one <code>&lt;li&gt;</code> per item.',
    'An <code>&lt;h3&gt;</code> saying where to go, and an <code>&lt;a&gt;</code> whose <code>href</code> is a map link and whose text says what it is. Maps refuse to open inside the preview, so Cmd/Ctrl-click it (or add <code>target="_blank"</code>).',
    'Watch the Explore tab\'s checklist go green, then add anything else you like: a paragraph, an <code>&lt;hr /&gt;</code>, an <code>&lt;ol&gt;</code> plan for the day.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Birthday Invite Project</title>
</head>
<body>

  <!-- Must have: at least one image, one list and one link. The rest is yours.
       A picture you can use:  assets/paths/dog.png   (the birthday dog)
                   or one of:  https://picsum.photos/400/300
       A map link you can use: https://www.google.com/maps/search/?api=1&query=Hyde+Park+London -->

  <!-- TODO 1: an h1 announcing the birthday, then an h2 with the date -->

  <!-- TODO 2: an image with alt text -->

  <!-- TODO 3: "What to bring" in an h3, then a ul with one li per item -->

  <!-- TODO 4: where to go in an h3, then a link to a map -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Birthday Invite Project</title>
</head>
<body>

  <h1>It's My Birthday!</h1>
  <h2>Saturday 14 November, from 2pm</h2>

  <img src="assets/paths/dog.png" alt="my beagle, who is also coming to the party" />

  <p>Come and celebrate with cake, games and a very excited dog.</p>

  <h3>What to bring:</h3>
  <ul>
    <li>Balloons (I love balloons)</li>
    <li>A picnic blanket</li>
    <li>An appetite: there will be a lot of cake</li>
  </ul>

  <h3>The plan</h3>
  <ol>
    <li>Meet by the café at 2pm</li>
    <li>Picnic and cake</li>
    <li>Frisbee until the dog gives up</li>
  </ol>

  <h3>This is where you need to go:</h3>
  <a href="https://www.google.com/maps/search/?api=1&query=Hyde+Park+London" target="_blank">Google map link</a>

</body>
</html>
`},
  quiz:[
    { q:'Which three things does the brief require?', options:['A video, a form and a table','At least one image, one list and one link','Three headings and a footer','CSS, HTML and JavaScript'], answer:1, why:'Everything beyond an img, a list and an anchor is up to you.' },
    { q:'You paste the map address on its own line in the body. Why is that not a link?', options:['Maps cannot be linked','Text only becomes a link inside an <code>&lt;a&gt;</code> with the address in <code>href</code>','It needs to be in a list','It needs <code>&lt;br /&gt;</code> after it'], answer:1, why:'The address belongs in href; the words between the tags are what people click.' },
  ],
  notes:`
    <h3>The end of HTML-only</h3>
    <p>This is the last project before CSS. Notice how far plain HTML gets you: the page is complete, readable and works on every device. It just isn't styled.</p>
    <h3>Go further</h3>
    <ul>
      <li>Make the image itself a link to the map by wrapping the <code>&lt;img /&gt;</code> in an <code>&lt;a&gt;</code> (section 4 does this).</li>
      <li>Add a second page with directions and link to it (also section 4).</li>
      <li>Come back after section 6 and make it look like a real invitation.</li>
    </ul>`
};
L22.explore = [checklist(L22, [
  { desc:'At least one <code>&lt;img&gt;</code> with alt text', test:"return [].some.call(doc.querySelectorAll('img'), function (i) { return (i.getAttribute('src') || '').trim() && (i.getAttribute('alt') || '').trim(); });" },
  { desc:'At least one list (<code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>) with <code>&lt;li&gt;</code> items', test:"return !!doc.querySelector('ul > li, ol > li');" },
  { desc:'At least one link with an <code>href</code>', test:"return [].some.call(doc.querySelectorAll('a'), function (a) { return (a.getAttribute('href') || '').trim(); });" },
  { desc:'Exactly one <code>&lt;h1&gt;</code>', test:"return doc.querySelectorAll('h1').length === 1;" },
  { desc:'A date in an <code>&lt;h2&gt;</code>', test:"return !!doc.querySelector('h2');" },
  { desc:'No skipped heading levels', test:NO_SKIPS },
], 'Project checklist', 'Reads your code from the Build tab. The first three are the brief\'s minimum; the rest keep the page well structured.')];
PG.add(L22);


PG.add({
  id:'l023', index:23, udemyId:17966364, minutes:3, section:'s03', slug:'calendar-trick', kind:'read',
  title:'Tip from Angela - Habit Building with the Calendar Trick',
  blurb:'Code a little every day rather than in occasional bursts, and cross each day off on a calendar. After a few weeks the unbroken chain becomes its own reason not to skip a day, and after a month or so the habit runs itself.',
  explore:[{
    title:'Don\'t break the chain', height:470,
    note:'A calendar for the trick. Click each day you did some coding; the chain counts days in a row. It is saved in this browser only.',
    html:`
<style>
  #cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
  #cal .hd{font-size:11px;color:#8b92a8;text-align:center;font-weight:700}
  #cal .day{height:40px;border:1px solid #dfe3ee;border-radius:7px;background:#fff;font:inherit;font-size:13px;cursor:pointer;position:relative}
  #cal .day:disabled{opacity:.35;cursor:default}
  #cal .day.today{border-color:#5b9cff;font-weight:700}
  #cal .day.x::after{content:'✗';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#e0403a;font-size:28px;font-weight:700;opacity:.8}
</style>
<div class="knobs">
  <button id="prev">◀</button><b id="month" style="min-width:140px;text-align:center"></b><button id="next">▶</button>
</div>
<div class="stage"><div id="cal"></div></div>
<pre class="readout" id="ro"></pre>
` + script(chainDemo),
  }],
});


PG.add({
  id:'l024', index:24, udemyId:12399306, minutes:0, section:'s03', slug:'newsletter', kind:'read',
  title:'Get Access to the Monthly App Brewery Newsletter',
  blurb:'An optional monthly email from the instructor: what she has been learning and building, conversations with people in tech, and three recommended reads. Sign up from the article on Udemy only if you want it; nothing in the course depends on it.',
});

})();
