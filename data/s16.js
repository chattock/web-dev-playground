/* ===== Section 16 — The Document Object Model (DOM) ===== */
/* Build lessons: index.html + script.js (+ style.css). The preview removes the
   page's own <script src="script.js"> and <link href="style.css"> tags and runs
   the editor tabs in their place, so the course markup works unchanged. The
   script.js tab always runs at the very end of <body>. */

(function () {

PG.add({
  id:'l114', index:114, udemyId:12374106, minutes:11, section:'s16', slug:'adding-javascript-to-websites', kind:'build',
  title:'Adding Javascript to Websites',
  blurb:'JavaScript can join a page the same three ways CSS can: <b>inline</b> in an event attribute such as <code>onload</code>, <b>internal</b> inside a <code>&lt;script&gt;</code> element, or <b>external</b> in its own file linked with <code>&lt;script src="…"&gt;</code>. Where the script sits matters: code that changes an element can only run after the browser has read that element, so scripts go just before <code>&lt;/body&gt;</code>.',
  tasks:[
    '<b>Inline:</b> give <code>&lt;body&gt;</code> an <code>onload</code> attribute that sets the h3\'s <code>innerHTML</code> to <i>Inline JavaScript</i>. The attribute is wrapped in double quotes, so the strings inside it need single quotes.',
    '<b>Internal:</b> in the <code>&lt;script&gt;</code> element at the bottom of the body, set the h2\'s <code>innerHTML</code> to <i>Internal JavaScript</i>.',
    '<b>External:</b> in <code>script.js</code>, set the h1\'s <code>innerHTML</code> to <i>External JavaScript</i>. All three headings should now be different.',
    'Cut the whole internal <code>&lt;script&gt;…&lt;/script&gt;</code> block and paste it inside <code>&lt;head&gt;</code>. Read the red error in the console: the h2 has not been read yet when that code runs, so <code>querySelector</code> hands back <code>null</code>. Move the block back above <code>&lt;/body&gt;</code>.',
    'Break the inline version on purpose: swap its single quotes for double quotes and see the attribute end too early. Then undo it.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Adding Javascript to Websites</title>
</head>
<!-- TODO 1 (inline): add an onload attribute to <body> that changes the h3 -->
<body>
  <h1>External</h1>
  <h2>Internal</h2>
  <h3>Inline</h3>

  <script>
    // TODO 2 (internal): change the h2 from here

  </script>
  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// This file is linked by <script src="script.js"> at the bottom of index.html.

// TODO 3 (external): change the h1 from here
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Adding Javascript to Websites</title>
</head>
<body onload="document.querySelector('h3').innerHTML = 'Inline JavaScript';">
  <h1>External</h1>
  <h2>Internal</h2>
  <h3>Inline</h3>

  <script>
    document.querySelector("h2").innerHTML = "Internal JavaScript";
  </script>
  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// This file is linked by <script src="script.js"> at the bottom of index.html.

document.querySelector("h1").innerHTML = "External JavaScript";
`},
  explore:[{
    title:'Where should the &lt;script&gt; go?', height:520,
    note:'The same one-line script, placed in four different spots. Pick a position and see whether the page changes or the console reports an error.',
    html:`
<div class="knobs">
  <label>put the script
    <select id="pos">
      <option value="head">inside &lt;head&gt;</option>
      <option value="end" selected>just before &lt;/body&gt;</option>
      <option value="defer">inside &lt;head&gt;, with defer</option>
      <option value="dcl">inside &lt;head&gt;, inside a DOMContentLoaded listener</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:12px;flex-wrap:wrap;padding:12px">
  <pre class="readout" id="code" style="flex:1 1 330px;margin:0;font-size:11.5px"></pre>
  <div style="flex:1 1 180px">
    <h4>the page</h4>
    <iframe id="fr" style="width:100%;height:120px;border:1px solid #dfe3ee;border-radius:8px;background:#fff"></iframe>
  </div>
</div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<script>
  var JS = 'document.querySelector("h1").innerHTML = "Good Bye";';
  var pos = document.getElementById('pos'), out = document.getElementById('out'), fr = document.getElementById('fr');
  var errors = [], blobUrl = null;
  window.report = function (m) { errors.push(m); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var WHY = {
    head:  'The browser reads the page from the top. It runs this script before it has reached the <h1>, so querySelector finds nothing and returns null — and null has no innerHTML to set.',
    end:   'Everything above the script already exists when it runs, so the change works. This is the rule the course follows: scripts go just before </body>.',
    defer: 'defer (only for external files with src) downloads the file straight away but waits until the whole page has been read before running it.',
    dcl:   'DOMContentLoaded fires once the whole page has been read, so the code inside the listener can find the h1 even from the head.'
  };
  function scriptLines(v, ind) {
    if (v === 'defer') return [ind + '<script src="index.js" defer><\\/script>'];
    if (v === 'dcl') return [ind + '<script>', ind + '  document.addEventListener("DOMContentLoaded", function () {', ind + '    ' + JS, ind + '  });', ind + '<\\/script>'];
    return [ind + '<script>', ind + '  ' + JS, ind + '<\\/script>'];
  }
  function run() {
    var v = pos.value, inHead = v !== 'end', L = ['<html>', '  <head>', '    <title>Placement</title>'], mark = [0, 0], s;
    if (inHead) { s = scriptLines(v, '    '); mark = [L.length, L.length + s.length]; L = L.concat(s); }
    L.push('  </head>', '  <body>', '    <h1>Hello</h1>');
    if (!inHead) { s = scriptLines(v, '    '); mark = [L.length, L.length + s.length]; L = L.concat(s); }
    L.push('  </body>', '</html>');
    if (v === 'defer') L.push('', 'index.js:', '  ' + JS);
    document.getElementById('code').innerHTML = L.map(function (t, i) {
      return (i >= mark[0] && i < mark[1]) ? '<span style="color:#7ee0a8">' + esc(t) + '</span>' : esc(t);
    }).join('\\n');

    var hook = '<script>window.onerror = function (m) { parent.report(m); };<\\/script>', code;
    if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
    if (v === 'defer') {
      blobUrl = URL.createObjectURL(new Blob([JS], { type: 'text/javascript' }));
      code = '<script src="' + blobUrl + '" defer><\\/script>';
    } else if (v === 'dcl') {
      code = '<script>document.addEventListener("DOMContentLoaded", function () {' + JS + '});<\\/script>';
    } else {
      code = '<script>' + JS + '<\\/script>';
    }
    errors = [];
    fr.onload = function () {
      var h1 = fr.contentDocument.querySelector('h1');
      var text = h1 ? h1.textContent : '?';
      out.textContent = (errors.length ? '✗ ' + errors.join('\\n✗ ') + '\\n  the h1 still says: ' + text
                                       : '✓ no errors — the h1 now says: ' + text) + '\\n\\n' + WHY[v];
    };
    fr.srcdoc = '<!DOCTYPE html><html><head><title>Placement</title>' + hook + (inHead ? code : '') +
      '<style>body{font-family:sans-serif;margin:10px}</style></head><body><h1>Hello</h1>' +
      (inHead ? '' : code) + '</body></html>';
  }
  pos.addEventListener('change', run);
  run();
<\/script>`
  }],
  quiz:[
    { q:'A script in the <code>&lt;head&gt;</code> runs <code>document.querySelector("h1").innerHTML = "Hi"</code> and the console says it cannot set properties of <code>null</code>. Why?', options:['The h1 is spelled wrong','The browser had not read the h1 yet, so querySelector returned null','innerHTML only works in external files','Scripts in the head are ignored'], answer:1, why:'The page is read top to bottom. When the head script runs the body has not been parsed, so there is no h1 to find.' },
    { q:'Inside <code>onload="…"</code>, how should a string be written?', options:['With double quotes, like "Hello"','With single quotes, like \'Hello\'','Without any quotes','With backslashes'], answer:1, why:'The attribute value itself is in double quotes; a double quote inside would end it early, so the inner strings use single quotes.' },
    { q:'Which way of adding JavaScript does the course recommend?', options:['Inline attributes on every element','A <code>&lt;script&gt;</code> in the head','An external .js file linked just before <code>&lt;/body&gt;</code>','Pasting it into the console'], answer:2, why:'An external file keeps the behaviour separate from the HTML, and the end-of-body position means every element exists when it runs.' },
    { q:'Why does the CSS <code>&lt;link&gt;</code> go in the head while the script goes at the bottom?', options:['They both work anywhere','Styles should load before content appears; scripts need the content to exist first','Browsers only allow one tag per section','Scripts are larger files'], answer:1, why:'A late stylesheet causes a flash of unstyled content; an early script runs before the elements it needs exist.' },
  ],
  notes:`
    <h3>How this playground runs your code</h3>
    <p>The <b>script.js</b> tab is always added at the very end of <code>&lt;body&gt;</code>, wherever (or whether) the page links it. The internal <code>&lt;script&gt;</code> element in <b>index.html</b> runs exactly where you put it — that is the one to move into the head for task 4.</p>`
});


PG.add({
  id:'l115', index:115, udemyId:12374120, minutes:12, section:'s16', slug:'introduction-to-the-dom', kind:'build',
  title:'Introduction to the Document Object Model (DOM)',
  blurb:'When the browser loads a page it turns every element into an object and hangs them in a tree, with <code>document</code> at the top, then <code>&lt;html&gt;</code>, then <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> as siblings. JavaScript walks that tree and reads or changes the objects: <b>properties</b> describe an element (<code>innerHTML</code>, <code>style</code>) and <b>methods</b> make it do something (<code>click()</code>).',
  tasks:[
    'Log <code>document.firstElementChild</code> (the html element), then its <code>firstElementChild</code> (head) and its <code>lastElementChild</code> (body).',
    'Walk down to the h1 — the first element child of body — and keep it in a variable called <code>heading</code>.',
    'Set <code>heading.innerHTML</code> to <i>Good Bye</i> and <code>heading.style.color</code> to <i>red</i>.',
    'Tick the checkbox by calling the <code>click()</code> method on it (select it with <code>document.querySelector("input")</code>).',
    '<b>Challenge:</b> change the text of the <b>third</b> list item to your own name. Careful: the last element inside body is the script, not the list.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Website</title>
</head>
<body>
  <h1>Hello</h1>
  <input type="checkbox" />
  <button>Click Me</button>
  <ul>
    <li><a href="https://www.google.com" target="_blank">Google</a></li>
    <li>Second</li>
    <li>Third</li>
  </ul>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// The page is a tree of objects that starts at "document".
// Step down it with firstElementChild and lastElementChild.

// TODO 1: log the <html> element, then <head>, then <body>


// TODO 2: store the <h1> in a variable called heading


// TODO 3: change the heading's text to "Good Bye" and its colour to red


// TODO 4: tick the checkbox by calling its click() method


// TODO 5 (challenge): put your name in the third list item
`},
  solution:{
'script.js':`// The page is a tree of objects that starts at "document".
// Step down it with firstElementChild and lastElementChild.

console.log(document.firstElementChild);                     // <html>
console.log(document.firstElementChild.firstElementChild);   // <head>
console.log(document.firstElementChild.lastElementChild);    // <body>

var heading = document.firstElementChild.lastElementChild.firstElementChild;
console.log(heading);                                        // <h1>

heading.innerHTML = "Good Bye";     // set a property
heading.style.color = "red";        // set a property of the style object

document.querySelector("input").click();   // call a method: note the ()

// body's last element child is the <script>, so find the list first
document.querySelector("ul").lastElementChild.innerHTML = "Ada";
`},
  explore:[{
    title:'The page and its DOM tree', height:560,
    note:'Click any node in the tree (or any element on the page). The readout shows how to reach it by walking from <code>document</code>, and a selector that finds it directly. Then change its <code>innerHTML</code> and watch both sides update.',
    html:`
<style>
  .nd{cursor:pointer;padding:0 6px;border-radius:5px}
  .nd:hover{background:#eef1f9}
  .nd.on{background:#5b9cff;color:#fff}
  .tx{color:#8b92a8}
</style>
<div class="stage" style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start">
  <div style="flex:1 1 220px;min-width:0">
    <h4>the page</h4>
    <iframe id="fr" style="width:100%;height:230px;border:1px solid #dfe3ee;border-radius:8px;background:#fff"></iframe>
  </div>
  <div style="flex:1 1 220px;min-width:0">
    <h4>its DOM tree</h4>
    <div id="tree" style="font:12.5px/1.8 ui-monospace,Menlo,monospace"></div>
  </div>
</div>
<pre class="readout" id="info"></pre>
<div class="knobs">
  <label>selected.innerHTML = <input type="text" id="val" style="width:190px"></label>
  <button id="set">set it</button>
  <button id="reset">reset the page</button>
</div>
<script>
  var PAGE = '<!DOCTYPE html><html><head><title>My Website</title></head><body style="font-family:sans-serif;margin:10px">' +
    '<h1>Hello</h1><input type="checkbox"> <button>Click Me</button>' +
    '<ul><li><a href="#">Google</a></li><li>Second</li><li>Third</li></ul>' +
    '<script>/* index.js */<\\/script></body></html>';
  var fr = document.getElementById('fr'), tree = document.getElementById('tree'), info = document.getElementById('info'), val = document.getElementById('val');
  var sel = null, nodes = [];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function nm(el) { return el.tagName.toLowerCase(); }
  function draw() {
    var doc = fr.contentDocument, html = [];
    if (!doc || !doc.documentElement) return;
    nodes = [doc];
    html.push('<div><span class="nd' + (sel === doc ? ' on' : '') + '" data-i="0">document</span></div>');
    (function walk(el, depth) {
      var t = el.children.length === 0 && el.tagName !== 'SCRIPT' ? el.textContent.trim() : '';
      html.push('<div style="padding-left:' + (depth * 16) + 'px"><span class="nd' + (sel === el ? ' on' : '') + '" data-i="' + nodes.length + '">&lt;' + nm(el) + '&gt;</span>' +
        (t ? ' <span class="tx">"' + esc(t.slice(0, 22)) + '"</span>' : '') + '</div>');
      nodes.push(el);
      for (var i = 0; i < el.children.length; i++) walk(el.children[i], depth + 1);
    })(doc.documentElement, 1);
    tree.innerHTML = html.join('');
  }
  function chain(el) {
    if (el.nodeType === 9) return 'document';
    var parts = [];
    while (el.parentElement) {
      var p = el.parentElement;
      if (p.firstElementChild === el) parts.unshift('.firstElementChild');
      else if (p.lastElementChild === el) parts.unshift('.lastElementChild');
      else parts.unshift('.children[' + Array.prototype.indexOf.call(p.children, el) + ']');
      el = p;
    }
    return 'document.firstElementChild' + parts.join('');
  }
  function css(el) {
    var t = nm(el);
    if (el.ownerDocument.querySelectorAll(t).length === 1) return t;
    var p = el.parentElement;
    return css(p) + ' ' + t + ':nth-child(' + (Array.prototype.indexOf.call(p.children, el) + 1) + ')';
  }
  function unmark() {
    if (sel && sel.nodeType === 1) { sel.style.outline = ''; if (!sel.getAttribute('style')) sel.removeAttribute('style'); }
  }
  function pick(el) {
    unmark();
    sel = el;
    if (el.nodeType === 1 && el !== el.ownerDocument.documentElement && el !== el.ownerDocument.body) el.style.outline = '3px solid #5b9cff';
    draw();
    if (el.nodeType === 9) {
      info.textContent = 'selected: document — the object at the top of the tree\\n\\n' +
        'document.firstElementChild  →  <html>\\n' +
        'Everything on the page lives somewhere underneath it.';
      val.value = ''; return;
    }
    var p = el.parentElement, kids = [];
    for (var i = 0; i < el.children.length; i++) kids.push('<' + nm(el.children[i]) + '>');
    info.textContent =
      'selected:        <' + nm(el) + '>\\n' +
      'walk the tree:   ' + chain(el) + '\\n' +
      'or jump to it:   document.querySelector("' + css(el) + '")\\n' +
      'parent:          ' + (p ? '<' + nm(p) + '>' : 'document') + '\\n' +
      'children:        ' + (kids.length ? kids.join(' ') : 'none') + '\\n' +
      'innerHTML:       "' + el.innerHTML.replace(/\\s+/g, ' ').slice(0, 90) + '"';
    val.value = el.children.length ? '' : el.innerHTML;
  }
  tree.addEventListener('click', function (e) {
    var n = e.target.closest('.nd');
    if (n) pick(nodes[+n.dataset.i]);
  });
  document.getElementById('set').onclick = function () {
    if (!sel || sel.nodeType !== 1) return;
    sel.innerHTML = val.value;
    pick(sel);
  };
  function load() {
    sel = null;
    fr.onload = function () {
      var doc = fr.contentDocument;
      doc.addEventListener('click', function (e) {
        if (e.target.closest('a')) e.preventDefault();
        if (e.target.nodeType === 1) pick(e.target);
      });
      pick(doc.querySelector('h1'));
    };
    fr.srcdoc = PAGE;
  }
  document.getElementById('reset').onclick = load;
  load();
<\/script>`
  },{
    title:'Property or method? The car analogy', height:440,
    note:'A made-up <code>car</code> object, like the one in the lecture. Reading a property gets a value, adding <code>=</code> sets it, and parentheses call a method. Leave the parentheses off a method and nothing happens — you just get the function back.',
    html:`
<div class="knobs">
  <button data-op="getColor">car.color</button>
  <label>car.color =
    <select id="col"><option>"red"</option><option>"seagreen"</option><option>"orange"</option><option>"royalblue"</option></select>
  </label>
  <button data-op="setColor">run it</button>
  <button data-op="getDoors">car.numberOfDoors</button>
  <button data-op="noDoors">car.numberOfDoors = 0</button>
</div>
<div class="knobs">
  <button data-op="drive">car.drive()</button>
  <button data-op="park">car.park()</button>
  <button data-op="driveRef">car.drive</button>
</div>
<div class="stage" id="road" style="height:110px;overflow:hidden">
  <svg id="car" width="170" height="80" viewBox="0 0 170 80" style="position:absolute;left:20px;top:16px;transition:left .9s ease">
    <path id="shell" d="M10 46 L32 22 L112 22 L140 44 L160 48 L160 62 L10 62 Z" fill="royalblue"/>
    <g id="doors" stroke="#1c2030" stroke-width="2"><line x1="60" y1="25" x2="60" y2="60"/><line x1="98" y1="25" x2="98" y2="60"/><line x1="40" y1="25" x2="40" y2="60"/><line x1="120" y1="27" x2="120" y2="60"/></g>
    <circle cx="45" cy="64" r="11" fill="#1c2030"/><circle cx="125" cy="64" r="11" fill="#1c2030"/>
  </svg>
</div>
<pre class="readout" id="out"></pre>
<script>
  var svg = document.getElementById('car'), road = document.getElementById('road'), out = document.getElementById('out');
  var car = {
    color: 'royalblue',
    numberOfDoors: 4,
    drive: function () { svg.style.left = (road.clientWidth - 200) + 'px'; },
    park: function () { svg.style.left = '20px'; }
  };
  var log = [];
  function say(stmt, result, why) {
    log.unshift('> ' + stmt + (result !== undefined ? '\\n< ' + result : '') + '\\n  // ' + why);
    log = log.slice(0, 4);
    out.textContent = log.join('\\n\\n');
  }
  function paint() {
    document.getElementById('shell').setAttribute('fill', car.color);
    document.getElementById('doors').style.display = car.numberOfDoors ? '' : 'none';
  }
  document.querySelectorAll('[data-op]').forEach(function (b) {
    b.addEventListener('click', function () {
      var op = b.getAttribute('data-op');
      if (op === 'getColor') say('car.color', '"' + car.color + '"', 'reading a property (a getter)');
      if (op === 'setColor') { var c = document.getElementById('col').value; car.color = c.replace(/"/g, ''); paint(); say('car.color = ' + c, undefined, 'setting a property: same dot, plus an equals sign'); }
      if (op === 'getDoors') say('car.numberOfDoors', String(car.numberOfDoors), 'reading another property');
      if (op === 'noDoors') { car.numberOfDoors = 0; paint(); say('car.numberOfDoors = 0', undefined, 'setting it — the doors are gone'); }
      if (op === 'drive') { car.drive(); say('car.drive()', undefined, 'calling a method: the parentheses make it run'); }
      if (op === 'park') { car.park(); say('car.park()', undefined, 'another method call'); }
      if (op === 'driveRef') say('car.drive', 'ƒ () { … }', 'no parentheses: you get the function itself and nothing happens');
    });
  });
  say('car', '{ color: "royalblue", numberOfDoors: 4, drive: ƒ, park: ƒ }', 'an object holds properties (values) and methods (functions)');
<\/script>`
  }],
  quiz:[
    { q:'What is <code>document.firstElementChild</code>?', options:['The &lt;head&gt; element','The &lt;html&gt; element','The first &lt;h1&gt;','The &lt;body&gt; element'], answer:1, why:'document is the top of the tree and its only element child is &lt;html&gt;; head and body sit one level below.' },
    { q:'How are <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> related in the DOM tree?', options:['body is a child of head','They are siblings, both children of html','head is inside body','They are not connected'], answer:1, why:'Both hang directly off &lt;html&gt;, so they are siblings, like two children of the same parent.' },
    { q:'Which of these <b>calls a method</b>?', options:['heading.innerHTML','heading.style.color = "red"','input.click()','heading.innerHTML = "Hi"'], answer:2, why:'Methods are run with parentheses. The others read or set properties.' },
    { q:'Why does <code>document.querySelector("body").lastElementChild</code> not give you the list on the lesson page?', options:['Lists are not elements','The script tag is the last element in body','lastElementChild skips lists','querySelector cannot find body'], answer:1, why:'The &lt;script&gt; sits just before &lt;/body&gt;, so it is body\'s last element child; find the ul first instead.' },
  ],
  notes:`
    <h3>Reading the console here</h3>
    <p>The console panel prints an element as its opening tag, e.g. <code>&lt;h1&gt;</code> or <code>&lt;li class="item"&gt;</code>. Chrome's own console lets you expand the object; here, log individual properties (<code>heading.innerHTML</code>, <code>heading.children.length</code>) to look inside.</p>`
});


PG.add({
  id:'l116', index:116, udemyId:12400324, minutes:0, section:'s16', slug:'dom-challenge-solution', kind:'build',
  title:'Solution to the DOM Challenge',
  blurb:'The challenge answer in one line: start at <code>document</code>, step to <code>&lt;html&gt;</code> and then <code>&lt;body&gt;</code>, search inside body for the <code>ul</code>, take its <b>last</b> element child, and assign a new <code>innerHTML</code>. A chain of properties like this reads left to right, one step down the tree at a time.',
  tasks:[
    'Run the code and check that <i>Third</i> has turned into a name.',
    'Pull the chain apart: log <code>document.firstElementChild</code>, then <code>document.firstElementChild.lastElementChild</code>, and so on, to see which element each step lands on.',
    'Log <code>document.body.lastElementChild</code> to prove the last element in body is the script, not the list.',
    'Reach the same <code>&lt;li&gt;</code> three other ways: <code>children[2]</code> on the ul, <code>querySelector("li:last-child")</code>, and <code>querySelectorAll("li")[2]</code>.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Website</title>
</head>
<body>
  <h1>Hello</h1>
  <input type="checkbox" />
  <button>Click Me</button>
  <ul>
    <li><a href="https://www.google.com" target="_blank">Google</a></li>
    <li>Second</li>
    <li>Third</li>
  </ul>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// html -> body -> the ul inside body -> its last li -> new content
document.firstElementChild.lastElementChild.querySelector("ul").lastElementChild.innerHTML = "Angela";
`},
  solution:{
'script.js':`// html -> body -> the ul inside body -> its last li -> new content
document.firstElementChild.lastElementChild.querySelector("ul").lastElementChild.innerHTML = "Angela";

// the chain, one step at a time
console.log(document.firstElementChild);                                    // <html>
console.log(document.firstElementChild.lastElementChild);                   // <body>
console.log(document.firstElementChild.lastElementChild.querySelector("ul")); // <ul>

// body's last element child is the <script>, which is why the solution searches for the ul
console.log(document.body.lastElementChild);                                // <script>

// three other routes to the same <li>
var list = document.querySelector("ul");
console.log(list.children[2].innerHTML);                        // children counts from 0
console.log(document.querySelector("li:last-child").innerHTML); // a CSS pseudo-class
console.log(document.querySelectorAll("li")[2].innerHTML);      // every li, then pick one
`},
  quiz:[
    { q:'In <code>document.firstElementChild.lastElementChild</code>, which element do you end up on?', options:['&lt;head&gt;','&lt;body&gt;','&lt;ul&gt;','&lt;html&gt;'], answer:1, why:'firstElementChild of document is html; the last element child of html is body.' },
    { q:'Can <code>querySelector</code> be called on an element, not just on <code>document</code>?', options:['No, only on document','Yes, and it searches inside that element only','Yes, but it searches the whole page anyway','Only on body'], answer:1, why:'element.querySelector looks only at that element\'s descendants, which is how the solution searches inside body.' },
  ]
});


PG.add({
  id:'l117', index:117, udemyId:12383788, minutes:14, section:'s16', slug:'selecting-elements', kind:'build',
  title:'Selecting HTML Elements with Javascript',
  blurb:'Five ways to grab elements. <code>getElementsByTagName</code> and <code>getElementsByClassName</code> hand back a <b>collection</b> (the plural "Elements" is the clue), so you pick one with <code>[index]</code> before changing it. <code>getElementById</code> returns a single element. <code>querySelector</code> takes any CSS selector and returns the <b>first</b> match; <code>querySelectorAll</code> returns every match.',
  tasks:[
    '<code>getElementsByTagName("li")</code>: log how many there are with <code>.length</code>, then turn the <b>third</b> li purple (counting starts at 0).',
    '<code>getElementsByClassName("btn")</code>: make the button\'s text red. One match still comes back as a collection, so you still need <code>[0]</code>.',
    '<code>getElementById("title")</code>: change the h1\'s text. No <code>#</code> in the argument and no index needed.',
    '<b>Challenge</b> with <code>querySelector</code>: colour <b>only</b> the Google link that sits inside the list red, not the one above it. In a selector, a space means "inside".',
    '<code>querySelectorAll("#list .item")</code>: make the third item blue. It was purple from step 1 — the later line wins.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Selecting HTML Elements</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <a href="https://www.google.com" target="_blank">Google</a>
  <button class="btn">Click Me</button>
  <ul id="list">
    <li class="item"><a href="https://www.google.com" target="_blank">Google</a></li>
    <li class="item">Second</li>
    <li class="item">Third</li>
  </ul>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// 1. getElementsByTagName: a collection of every <li>
// TODO: log how many there are, then make the third one purple


// 2. getElementsByClassName: a collection, even when only one element matches
// TODO: make the .btn button's text red


// 3. getElementById: one element (the id goes in without a #)
// TODO: change the h1's text


// 4. querySelector: the first match of any CSS selector
// TODO (challenge): make only the Google link INSIDE the list red


// 5. querySelectorAll: every match of a CSS selector
// TODO: make the third .item inside #list blue
`},
  solution:{
'script.js':`// 1. getElementsByTagName: a collection of every <li>
console.log(document.getElementsByTagName("li").length);       // 3
document.getElementsByTagName("li")[2].style.color = "purple";

// 2. getElementsByClassName: a collection, even when only one element matches
console.log(document.getElementsByClassName("btn").length);    // 1
document.getElementsByClassName("btn")[0].style.color = "red";

// 3. getElementById: one element (the id goes in without a #)
document.getElementById("title").innerHTML = "Good Bye";

// 4. querySelector: the first match of any CSS selector
console.log(document.querySelector("h1"));            // by tag
console.log(document.querySelector("#title"));        // by id
console.log(document.querySelector(".btn"));          // by class
console.log(document.querySelector("li.item"));       // an li that ALSO has class item (no space)
console.log(document.querySelector("#list .item"));   // three match, only the first comes back
document.querySelector("li a").style.color = "red";   // an <a> INSIDE an <li> (space)

// 5. querySelectorAll: every match of a CSS selector
console.log(document.querySelectorAll("#list .item").length);  // 3
document.querySelectorAll("#list .item")[2].style.color = "blue";
`},
  explore:[{
    title:'Selector tester', height:540,
    note:'Pick a method and type its argument. Matches are outlined on the page, and the readout shows what the call hands back: one element, a collection, or <code>null</code>.',
    html:`
<div class="knobs">
  <label>document.
    <select id="m">
      <option>getElementsByTagName</option>
      <option>getElementsByClassName</option>
      <option>getElementById</option>
      <option selected>querySelector</option>
      <option>querySelectorAll</option>
    </select>
    ("<input type="text" id="arg" value="li a" style="width:120px">")
  </label>
</div>
<div class="stage" style="padding:0"><iframe id="fr" style="width:100%;height:190px;border:0;display:block"></iframe></div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<p class="note">Try <span class="tag">li</span> with every method · <span class="tag">#title</span> with getElementById, then without the # · <span class="tag">.btn</span> with getElementsByClassName · <span class="tag">li.item</span> against <span class="tag">li .item</span> · <span class="tag">#list a</span> · plain <span class="tag">a</span></p>
<script>
  var PAGE = '<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:10px 14px}h1{margin:4px 0}' +
    '.pg-hit{outline:3px solid #ff6b6b;outline-offset:2px;position:relative}' +
    '.pg-hit::after{content:attr(data-n);position:absolute;top:-10px;right:-14px;background:#ff6b6b;color:#fff;font:bold 10px sans-serif;padding:1px 5px;border-radius:8px}' +
    '</style></head><body><h1 id="title">Hello</h1><a href="#">Google</a> <button class="btn">Click Me</button>' +
    '<ul id="list"><li class="item"><a href="#">Google</a></li><li class="item">Second</li><li class="item">Third</li></ul></body></html>';
  var m = document.getElementById('m'), arg = document.getElementById('arg'), out = document.getElementById('out'), fr = document.getElementById('fr');
  function label(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    el.classList.forEach(function (c) { if (c !== 'pg-hit') s += '.' + c; });
    return s;
  }
  function text(el) { return '"' + el.textContent.trim().replace(/\\s+/g, ' ').slice(0, 30) + '"'; }
  function run() {
    var doc = fr.contentDocument;
    if (!doc || !doc.body) return;
    doc.querySelectorAll('.pg-hit').forEach(function (el) { el.classList.remove('pg-hit'); el.removeAttribute('data-n'); });
    var method = m.value, a = arg.value, call = 'document.' + method + '("' + a + '")', r, lines = [];
    try { r = doc[method](a); }
    catch (e) { out.textContent = call + '\\n→ SyntaxError: ' + e.message.split(':').pop().trim() + '\\n\\nquerySelector needs a valid CSS selector.'; return; }
    if (r === null || r === undefined) {
      lines.push(call, '→ null   (nothing matched)');
      if (method === 'getElementById' && a.charAt(0) === '#') lines.push('', 'getElementById wants the bare id: "title", not "#title".');
    } else if (r.nodeType === 1) {
      lines.push(call, '→ <' + label(r) + '>  ' + text(r), '', 'ONE element, ready to use:', '   ' + call + '.style.color = "red";');
      r.classList.add('pg-hit'); r.setAttribute('data-n', '1');
      if (method === 'querySelector') {
        var all = doc.querySelectorAll(a).length;
        if (all > 1) lines.push('', all + ' elements match, but querySelector only returns the first one.');
      }
    } else {
      var arr = Array.prototype.slice.call(r), kind = method.indexOf('getElements') === 0 ? 'HTMLCollection' : 'NodeList';
      lines.push(call, '→ ' + kind + '(' + arr.length + ') [' + arr.map(label).join(', ') + ']');
      arr.forEach(function (el, i) { el.classList.add('pg-hit'); el.setAttribute('data-n', '[' + i + ']'); lines.push('   [' + i + '] <' + label(el) + '>  ' + text(el)); });
      lines.push('', arr.length ? 'A collection has no .style of its own. Pick one first:\\n   ' + call + '[0].style.color = "red";' : 'An empty collection: nothing matched.');
      if (method === 'getElementsByClassName' && a.charAt(0) === '.') lines.push('getElementsByClassName wants the bare class name: "btn", not ".btn".');
      if (method === 'getElementsByTagName' && /[.#\\s]/.test(a)) lines.push('getElementsByTagName only understands a tag name such as "li".');
    }
    out.textContent = lines.join('\\n');
  }
  fr.onload = run;
  fr.srcdoc = PAGE;
  m.addEventListener('change', run);
  arg.addEventListener('input', run);
<\/script>`
  }],
  quiz:[
    { q:'Why does <code>document.getElementsByTagName("li").style.color = "red"</code> fail?', options:['li is not a valid tag','It returns a collection, which has no style property','style only works with querySelector','The colour needs a hex code'], answer:1, why:'The method returns every li in a collection. Pick one with [index] first, then set its style.' },
    { q:'What is the difference between <code>"li a"</code> and <code>"li.item"</code>?', options:['None','"li a" is an a inside an li; "li.item" is an li that also has class item','"li a" means li or a','"li.item" means a .item inside an li'], answer:1, why:'A space means descendant. No space joins conditions on the same element.' },
    { q:'Several elements match <code>#list .item</code>. What does <code>querySelector("#list .item")</code> return?', options:['All of them','The last one','The first one in the page','null'], answer:2, why:'querySelector always returns only the first match in document order; use querySelectorAll for all of them.' },
    { q:'Which call is written correctly?', options:['getElementById("#title")','getElementsByClassName(".btn")[0]','getElementById("title")','querySelector("title") for the element with id title'], answer:2, why:'getElementById and getElementsByClassName take bare names; only the selector methods use # and . prefixes.' },
  ],
  notes:`
    <h3>Logging collections here</h3>
    <p>Chrome's console prints a collection as a list you can expand. This playground's console cannot, so log <code>.length</code> or a single item (<code>[0]</code>, <code>[2]</code>) instead — or use the selector tester in the Explore tab, which shows exactly what each method returns.</p>`
});


PG.add({
  id:'l118', index:118, udemyId:12383818, minutes:5, section:'s16', slug:'changing-styles', kind:'build',
  title:'Manipulating and Changing Styles of HTML Elements with Javascript',
  blurb:'Every element has a <code>style</code> object, and each CSS property is a property on it. Two rules for the translation: hyphenated CSS names become <b>camelCase</b> (<code>font-size</code> → <code>fontSize</code>), and every value is a <b>string</b>, units included (<code>"5rem"</code>, <code>"5%"</code>).',
  tasks:[
    'Turn the h1 red through its <code>style</code> property.',
    'Set its font size to 5rem: the CSS name <code>font-size</code> becomes <code>fontSize</code>.',
    'Give it a padding of 5% — the value goes in quotes even though it looks like a number.',
    '<b>Challenge:</b> make the button\'s background yellow (CSS: <code>background-color</code>).',
    'Try <code>style.fontSize = 10</code> with no quotes or unit: the browser quietly ignores it. Then try writing <code>style.background-color</code> and read the error.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Changing Styles</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <button class="btn">Click Me</button>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// A CSS name with a dash becomes camelCase in JavaScript,
// and every value is a string in quotes.

// TODO 1: make the h1 red


// TODO 2: make the h1's font size 5rem       (CSS: font-size)


// TODO 3: give the h1 a padding of 5%


// TODO 4 (challenge): make the button's background yellow   (CSS: background-color)
`},
  solution:{
'script.js':`// A CSS name with a dash becomes camelCase in JavaScript,
// and every value is a string in quotes.

document.querySelector("h1").style.color = "red";
document.querySelector("h1").style.fontSize = "5rem";   // font-size -> fontSize
document.querySelector("h1").style.padding = "5%";      // a string, unit included
document.querySelector("button").style.backgroundColor = "yellow";

// ignored: a bare number is not a valid CSS length
// document.querySelector("h1").style.fontSize = 10;
`},
  explore:[{
    title:'CSS name → JavaScript name', height:430,
    note:'Type a CSS property and a value. The demo writes the matching JavaScript line, applies it to the box, and reads it back so you can see when the browser rejects a value.',
    html:`
<div class="knobs">
  <label>CSS property <input type="text" id="prop" value="background-color" style="width:170px"></label>
  <label>value <input type="text" id="val" value="yellow" style="width:110px"></label>
</div>
<div class="stage" style="display:flex;justify-content:center;align-items:center;min-height:140px">
  <div id="box" class="box" style="width:180px">#box</div>
</div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<p class="note">Try <span class="tag">border-top-left-radius</span> <span class="tag">40px</span> · <span class="tag">font-size</span> <span class="tag">30</span> (no unit) then <span class="tag">30px</span> · <span class="tag">padding</span> <span class="tag">5%</span> · <span class="tag">visibility</span> <span class="tag">hidden</span> · a typo like <span class="tag">colour</span></p>
<script>
  var prop = document.getElementById('prop'), val = document.getElementById('val'), box = document.getElementById('box'), out = document.getElementById('out');
  function camel(p) { return p.trim().toLowerCase().replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }
  function run() {
    box.setAttribute('style', 'width:180px');
    var p = prop.value.trim(), v = val.value.trim(), js = camel(p);
    if (!p) { out.textContent = 'Type a CSS property name.'; return; }
    var lines = ['CSS:  #box { ' + p + ': ' + v + '; }', 'JS:   document.querySelector("#box").style.' + js + ' = "' + v + '";', ''];
    if (!(js in box.style)) {
      lines.push('✗ style has no property called ' + js + ' — check the spelling of the CSS name.');
    } else {
      box.style[js] = v;
      var back = box.style[js];
      if (v && !back) lines.push('✗ The browser ignored "' + v + '". Lengths need a unit ("30px", "5rem", "5%"), and keywords must be real CSS values.');
      else lines.push('✓ applied — reading style.' + js + ' back gives "' + back + '"');
      if (js !== p.toLowerCase()) lines.push('', 'Each dash disappears and the letter after it becomes a capital: ' + p + ' → ' + js);
    }
    out.textContent = lines.join('\\n');
  }
  prop.addEventListener('input', run); val.addEventListener('input', run); run();
<\/script>`
  }],
  quiz:[
    { q:'What is <code>background-color</code> called in JavaScript?', options:['background-color','backgroundcolor','backgroundColor','BackgroundColor'], answer:2, why:'The dash goes and the next word starts with a capital: camelCase.' },
    { q:'What happens with <code>h1.style.fontSize = 10;</code>?', options:['The text becomes 10px','The text becomes 10rem','Nothing — the value is ignored','A syntax error'], answer:2, why:'CSS lengths need a unit, and style values are strings, so write "10px" or "10rem".' },
    { q:'Why is <code>h1.style.background-color = "yellow"</code> an error?', options:['yellow is not a colour','JavaScript reads the dash as a minus sign','style is read-only','You need a semicolon'], answer:1, why:'background-color is read as background minus color, which cannot be assigned to.' },
  ]
});


PG.add({
  id:'l119', index:119, udemyId:12383850, minutes:6, section:'s16', slug:'separation-of-concerns', kind:'build',
  title:'The Separation of Concerns: Structure vs Style vs Behaviour',
  blurb:'Each language has one job: HTML holds the content, CSS the look, JavaScript the behaviour. So rather than writing styles from JavaScript, put them in a CSS class and let JavaScript switch the class with <code>classList.add</code>, <code>remove</code> and <code>toggle</code>. When something looks wrong you open the stylesheet; when it acts wrong you open the script.',
  tasks:[
    'Add the <code>invisible</code> class to the button with <code>classList.add</code>. It disappears, but the space it took up stays.',
    'Take it off again with <code>classList.remove</code>.',
    'Call <code>classList.toggle("invisible")</code> once and check the button, then a second time. Each toggle flips the class.',
    'In <code>style.css</code>, write a <code>.huge</code> rule: font size 10rem, red, bold.',
    'With one line of JavaScript, add <code>huge</code> to the h1 (<code>#title</code>). All three styles arrive together.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Separation of Concerns</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1 id="title">Hello</h1>
  <button class="btn">Click Me</button>

  <script src="script.js"></script>
</body>
</html>
`,
'style.css':`.invisible {
  visibility: hidden;
}

/* TODO: a .huge class: font size 10rem, red, bold */
`,
'script.js':`// The look lives in style.css. JavaScript only switches classes on and off.

// TODO 1: add the "invisible" class to the button


// TODO 2: remove it again


// TODO 3: toggle it once, then a second time


// TODO 4: add your "huge" class to the h1 (#title)
`},
  solution:{
'style.css':`.invisible {
  visibility: hidden;
}

.huge {
  font-size: 10rem;
  color: red;
  font-weight: bold;
}
`,
'script.js':`// The look lives in style.css. JavaScript only switches classes on and off.

document.querySelector("button").classList.add("invisible");
document.querySelector("button").classList.remove("invisible");
document.querySelector("button").classList.toggle("invisible");   // was off, so it goes on: hidden
document.querySelector("button").classList.toggle("invisible");   // was on, so it goes off: visible

document.querySelector("#title").classList.add("huge");           // no dot: it is a class name, not a selector

console.log(document.querySelector("#title").classList.contains("huge"));   // true
`},
  explore:[{
    title:'classList switchboard', height:430,
    note:'Choose an element and a class, then press the buttons. The readout shows the element\'s <code>class</code> attribute after each call and what the call returned.',
    html:`
<style>.invisible{visibility:hidden}.huge{font-size:3.4rem;color:red;font-weight:bold}</style>
<div class="knobs">
  <label>element <select id="el"><option value="btn">the button</option><option value="title">the h1</option></select></label>
  <label>class <select id="cls"><option>invisible</option><option>huge</option></select></label>
</div>
<div class="knobs">
  <button data-op="add">classList.add</button>
  <button data-op="remove">classList.remove</button>
  <button data-op="toggle">classList.toggle</button>
  <button data-op="contains">classList.contains</button>
</div>
<div class="stage">
  <h1 id="title" style="margin:0 0 8px">Hello</h1>
  <button class="btn" id="btn">Click Me</button><span style="font-size:12px;color:#8b92a8"> ← when hidden, the button still keeps its space</span>
</div>
<pre class="readout" id="out"></pre>
<p class="note">.huge is 3.4rem here rather than 10rem, so it fits in the demo.</p>
<script>
  var out = document.getElementById('out'), log = [];
  function show() {
    var b = document.getElementById('btn'), t = document.getElementById('title');
    out.textContent = log.slice(0, 3).join('\\n') + (log.length ? '\\n\\n' : '') +
      '<h1 id="title"' + (t.className ? ' class="' + t.className + '"' : '') + '>\\n' +
      '<button class="' + b.className + '">';
  }
  document.querySelectorAll('[data-op]').forEach(function (b) {
    b.addEventListener('click', function () {
      var op = b.getAttribute('data-op'), which = document.getElementById('el').value, cls = document.getElementById('cls').value;
      var el = document.getElementById(which);
      var r = el.classList[op](cls);
      var who = which === 'btn' ? 'document.querySelector("button")' : 'document.querySelector("#title")';
      log.unshift(who + '.classList.' + op + '("' + cls + '")' + (r === undefined ? '' : '   → ' + r));
      show();
    });
  });
  show();
<\/script>`
  }],
  quiz:[
    { q:'The button has the class <code>invisible</code>. What does <code>classList.toggle("invisible")</code> do?', options:['Adds it a second time','Removes it','Throws an error','Nothing'], answer:1, why:'toggle removes a class that is present and adds one that is missing.' },
    { q:'Which line is correct?', options:['h1.classList.add(".huge")','h1.classList.add("huge")','h1.classList = "huge"','h1.class.add("huge")'], answer:1, why:'classList methods take the bare class name, without the dot used in selectors.' },
    { q:'Why prefer <code>classList.add("huge")</code> over three <code>style</code> assignments?', options:['It is faster to type, nothing else','The look stays in the stylesheet, and one class can bundle many declarations and be removed in one call','style does not work on headings','classList works without CSS'], answer:1, why:'Keeping styling in CSS separates concerns; JavaScript just flips the switch.' },
  ]
});


PG.add({
  id:'l120', index:120, udemyId:12383870, minutes:3, section:'s16', slug:'text-content', kind:'build',
  title:'Text Manipulation and the Text Content Property',
  blurb:'Two ways to read and replace what is between an element\'s tags. <code>textContent</code> is the plain text only. <code>innerHTML</code> is the markup, tags and all — and assigning to it parses the string as HTML, so new elements appear on the page.',
  tasks:[
    'Log the h1\'s <code>innerHTML</code>, then its <code>textContent</code>. One still has the <code>&lt;strong&gt;</code> tags in it.',
    'Set <code>textContent</code> to <i>Text Content</i>. The bold has gone, because the strong element was replaced by plain text.',
    'Set <code>innerHTML</code> to <code>"&lt;em&gt;Inner HTML&lt;/em&gt;"</code>. The string is read as HTML, so the text comes out in italics.',
    'Change that last line to use <code>textContent</code> with the same string and look at the page: the tags are printed as characters.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Text Content</title>
</head>
<body>
  <h1 id="title"><strong>Hello</strong></h1>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// TODO 1: log the h1's innerHTML, then its textContent — compare them


// TODO 2: set its textContent to "Text Content"


// TODO 3: set its innerHTML to "<em>Inner HTML</em>"
`},
  solution:{
'script.js':`console.log(document.getElementById("title").innerHTML);     // <strong>Hello</strong>
console.log(document.getElementById("title").textContent);   // Hello

document.getElementById("title").textContent = "Text Content";       // plain text: the <strong> is gone
document.getElementById("title").innerHTML = "<em>Inner HTML</em>";  // read as HTML: italics

// with textContent the same string stays as visible characters:
// document.getElementById("title").textContent = "<em>Inner HTML</em>";
`},
  explore:[{
    title:'textContent or innerHTML?', height:440,
    note:'Type a string with some tags in it and assign it both ways. The readout shows what each property reads back and how many elements ended up inside the h1.',
    html:`
<div class="knobs">
  <label style="flex:1">the string <input type="text" id="s" value="Hello &lt;em&gt;there&lt;/em&gt;, &lt;b&gt;world&lt;/b&gt;" style="flex:1;min-width:220px"></label>
</div>
<div class="knobs">
  <button data-p="textContent">h1.textContent = string</button>
  <button data-p="innerHTML">h1.innerHTML = string</button>
  <button id="rs">reset the h1</button>
</div>
<div class="stage"><h1 id="title" style="margin:0"><strong>Hello</strong></h1></div>
<pre class="readout" id="out"></pre>
<script>
  var h1 = document.getElementById('title'), out = document.getElementById('out'), last = 'the starting markup';
  function show() {
    out.textContent = 'after: ' + last + '\\n\\n' +
      'h1.innerHTML   → "' + h1.innerHTML + '"\\n' +
      'h1.textContent → "' + h1.textContent + '"\\n' +
      'elements inside the h1: ' + h1.children.length +
      (h1.children.length ? '  (' + Array.prototype.map.call(h1.children, function (c) { return '<' + c.tagName.toLowerCase() + '>'; }).join(' ') + ')' : '');
  }
  document.querySelectorAll('[data-p]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.getAttribute('data-p');
      h1[p] = document.getElementById('s').value;
      last = 'h1.' + p + ' = "' + document.getElementById('s').value + '"';
      show();
    });
  });
  document.getElementById('rs').onclick = function () { h1.innerHTML = '<strong>Hello</strong>'; last = 'reset'; show(); };
  show();
<\/script>`
  }],
  quiz:[
    { q:'The page has <code>&lt;h1&gt;&lt;strong&gt;Hello&lt;/strong&gt;&lt;/h1&gt;</code>. What does <code>h1.innerHTML</code> return?', options:['"Hello"','"&lt;strong&gt;Hello&lt;/strong&gt;"','"&lt;h1&gt;&lt;strong&gt;Hello&lt;/strong&gt;&lt;/h1&gt;"','A strong element object'], answer:1, why:'innerHTML is the markup between the h1\'s own tags, as a string.' },
    { q:'What appears on the page after <code>h1.textContent = "&lt;em&gt;Hi&lt;/em&gt;"</code>?', options:['Hi in italics','The characters &lt;em&gt;Hi&lt;/em&gt;','Nothing','An error'], answer:1, why:'textContent never parses HTML; the angle brackets are shown as text.' },
    { q:'Which property is the safer choice for putting text a user typed onto the page?', options:['innerHTML','textContent','Either, they are identical','outerHTML'], answer:1, why:'textContent cannot create elements, so markup hidden in user input stays harmless text.' },
  ]
});


PG.add({
  id:'l121', index:121, udemyId:12383884, minutes:2, section:'s16', slug:'element-attributes', kind:'build',
  previewBase:'assets/dicee/',
  title:'Manipulating HTML Element Attributes',
  blurb:'Attributes are the extras inside an opening tag: <code>href</code>, <code>src</code>, <code>class</code>, <code>alt</code>. <code>getAttribute("name")</code> reads one, and <code>setAttribute("name", "value")</code> changes it — or adds it if it was not there. <code>.attributes</code> lists all of them.',
  tasks:[
    'Log the link, then <code>.attributes.length</code>: how many attributes does it carry?',
    'Read its address with <code>getAttribute("href")</code>.',
    'Point it somewhere else with <code>setAttribute("href", "https://www.bing.com")</code> — two arguments: which attribute, then the new value. Log <code>getAttribute("href")</code> again and hover the link to see the new address. Its text still says Google.',
    '<b>Extra:</b> use <code>setAttribute</code> to make the picture show <code>images/dice6.png</code> and update its <code>alt</code> text. This is the exact move the Dicee game needs in the next section.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Attributes</title>
</head>
<body>
  <a href="https://www.google.com" target="_blank">Google</a>
  <br />
  <img src="images/dice1.png" alt="A dice showing one" width="100" />

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// TODO 1: log the link, then how many attributes it has (.attributes.length)


// TODO 2: log the value of its href with getAttribute


// TODO 3: point the link at https://www.bing.com with setAttribute,
//         then log getAttribute("href") again to check


// TODO 4 (extra): make the picture show images/dice6.png and fix its alt text
`},
  solution:{
'script.js':`console.log(document.querySelector("a"));                       // <a>
console.log(document.querySelector("a").attributes.length);     // 2: href and target
console.log(document.querySelector("a").getAttributeNames());   // ["href","target"]
console.log(document.querySelector("a").getAttribute("href"));  // https://www.google.com

document.querySelector("a").setAttribute("href", "https://www.bing.com");
console.log(document.querySelector("a").getAttribute("href"));  // https://www.bing.com

// the same two methods work on any attribute, such as an image's src and alt
document.querySelector("img").setAttribute("src", "images/dice6.png");
document.querySelector("img").setAttribute("alt", "A dice showing six");
`},
  explore:[{
    title:'Attribute workbench', height:470,
    note:'Read, change, add and remove attributes on a real link and image. The readout shows the element\'s HTML after every call — watch which part of the tag changes.',
    html:`
<div class="knobs">
  <label>element <select id="el"><option value="a">the link</option><option value="img">the image</option></select></label>
  <label>attribute <input type="text" id="name" value="href" style="width:80px"></label>
  <label>value <input type="text" id="val" value="https://www.bing.com" style="width:230px"></label>
</div>
<div class="knobs">
  <button data-op="get">getAttribute(name)</button>
  <button data-op="set">setAttribute(name, value)</button>
  <button data-op="has">hasAttribute(name)</button>
  <button data-op="remove">removeAttribute(name)</button>
  <button id="rs">reset</button>
</div>
<div class="stage" id="stage" style="display:flex;gap:24px;align-items:center"></div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<script>
  var START = '<a id="a" href="https://www.google.com" target="_blank">Google</a>' +
              '<img id="img" src="assets/dicee/images/dice1.png" alt="A dice showing one" width="70">';
  var DEFAULTS = { a: ['href', 'https://www.bing.com'], img: ['src', 'assets/dicee/images/dice6.png'] };
  var stage = document.getElementById('stage'), out = document.getElementById('out'), log = [];
  function show() {
    var a = document.getElementById('a'), img = document.getElementById('img');
    out.textContent = log.slice(0, 3).join('\\n') + (log.length ? '\\n\\n' : '') + a.outerHTML + '\\n' + img.outerHTML;
  }
  function reset() { stage.innerHTML = START; log = []; show(); }
  document.getElementById('el').addEventListener('change', function () {
    var d = DEFAULTS[this.value];
    document.getElementById('name').value = d[0]; document.getElementById('val').value = d[1];
  });
  document.querySelectorAll('[data-op]').forEach(function (b) {
    b.addEventListener('click', function () {
      var which = document.getElementById('el').value, el = document.getElementById(which);
      var n = document.getElementById('name').value.trim(), v = document.getElementById('val').value, op = b.getAttribute('data-op');
      var who = 'document.querySelector("' + which + '")', r;
      if (!n) return;
      try {
        if (op === 'get') { r = el.getAttribute(n); log.unshift(who + '.getAttribute("' + n + '")  → ' + (r === null ? 'null (no such attribute)' : '"' + r + '"')); }
        if (op === 'set') { el.setAttribute(n, v); log.unshift(who + '.setAttribute("' + n + '", "' + v + '")'); }
        if (op === 'has') { log.unshift(who + '.hasAttribute("' + n + '")  → ' + el.hasAttribute(n)); }
        if (op === 'remove') { el.removeAttribute(n); log.unshift(who + '.removeAttribute("' + n + '")'); }
      } catch (e) { log.unshift('✗ ' + e.message); }
      show();
    });
  });
  document.getElementById('rs').onclick = reset;
  reset();
<\/script>`
  }],
  quiz:[
    { q:'How many arguments does <code>setAttribute</code> take?', options:['One: the new value','Two: the attribute name, then its new value','Three: element, name, value','None'], answer:1, why:'It needs to know which attribute to change and what to change it to.' },
    { q:'After <code>link.setAttribute("href", "https://www.bing.com")</code>, what does the link text say?', options:['https://www.bing.com','Bing','Whatever it said before','Nothing'], answer:2, why:'The visible text is the element\'s content, not an attribute, so only the destination changes.' },
    { q:'What does <code>img.getAttribute("src")</code> return?', options:['The image itself','The src value as a string','true or false','An array of attributes'], answer:1, why:'getAttribute reads one attribute\'s value as a string (or null if it is missing).' },
  ]
});


PG.add({
  id:'l122', index:122, udemyId:17966874, minutes:3, section:'s16', slug:'tip-20-minute-method', kind:'read',
  title:'Tip from Angela - The 20 Minute Method',
  blurb:'On days when you cannot face a study session, promise yourself just twenty minutes and permission to stop afterwards. Getting started is the hard part; once you are going you will often carry on, and if you do stop at twenty minutes you have still moved forward.'
});

})();
