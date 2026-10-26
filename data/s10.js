/* ===== Section 10 — Grid ===== */

(function () {
  /* the 64 squares of the chessboard: one board row per line, colours alternating */
  const BOARD = Array.from({ length: 8 }, (_, r) => '    ' + Array.from({ length: 8 }, (_, c) =>
    `<div class="${(r + c) % 2 ? 'black' : 'white'}"></div>`).join('')).join('\n');

  PG.add({
    id:'s10-display-grid', index:60, udemyId:37368434, minutes:15, section:'s10', slug:'display-grid', kind:'build',
    title:'Display: Grid',
    blurb:'Grid is the two-dimensional layout tool: you define <b>columns and rows</b> on the container, and the children drop into the cells, every edge lining up with the ones above and below. Flexbox arranges things along one line; the two are often nested, a flex row inside a grid cell or the other way round.',
    tasks:[
      'The 64 squares are empty divs, so nothing shows yet. Give <code>.white</code> and <code>.black</code> a <code>width</code> and <code>height</code> of <code>50px</code> and a background colour each (the course uses <code>#f0d9b5</code> and <code>#b58863</code>). They form one tall column, because divs are block elements. (The lecture uses 100px squares; half size fits the preview.)',
      'Turn <code>.container</code> into a grid with <code>display: grid</code>.',
      'Add <code>grid-template-columns</code> with eight <code>1fr</code> tracks, written out in full. The board appears even though you have defined no rows: grid adds rows by itself for items that need them.',
      'Add <code>grid-template-rows</code> with eight <code>1fr</code> tracks as well, to make the layout explicit.',
      'The columns stretch across the whole preview, leaving gaps between the squares. Give <code>.container</code> <code>width: 400px</code> so the board closes up.',
      'A preview of the next lecture: replace each list of eight <code>1fr</code> with <code>repeat(8, 1fr)</code>. Same board, much less typing.'
    ],
    files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chessboard</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
${BOARD}
  </div>
</body>
</html>`,
'style.css':`/* TODO 1: size and colour the squares (50px x 50px) */
.white {
}

.black {
}

/* TODO 2-5: an 8 x 8 grid, 400px wide */
.container {
}
`},
    solution:{
'style.css':`.white {
  width: 50px;
  height: 50px;
  background-color: #f0d9b5;
}

.black {
  width: 50px;
  height: 50px;
  background-color: #b58863;
}

.container {
  width: 400px;
  display: grid;
  /* the long way: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr */
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
}
`},
    quiz:[
      { q:'What is the main difference between flexbox and grid?', options:['Grid only works for images','Flexbox lays things out along one line; grid works in rows and columns at once','Grid cannot be responsive','Flexbox needs a fixed width'], answer:1, why:'Flexbox is one-dimensional. Grid defines both axes, so items snap to shared column and row lines.' },
      { q:'What does <code>grid-template-columns: 1fr 2fr</code> create?', options:['One column, 2 units tall','Two columns, the second twice as wide as the first','Two rows','Three equal columns'], answer:1, why:'Each value is a column track; fr units share out the space, here in a 1 : 2 ratio.' },
      { q:'You define eight columns but no rows, and there are 64 items. What happens?', options:['Only the first row shows','The items overflow sideways','The grid creates extra rows automatically, sized to their content','You get an error'], answer:2, why:'Items that do not fit the defined tracks go into implicit rows the grid adds for you.' },
      { q:'What is the <code>gap</code> property for?', options:['Spacing between the rows and columns of a grid','The outer margin of the grid','The border of each cell','The space inside each item'], answer:0, why:'gap sets the space between tracks, so you do not need margins on every item.' },
    ],
    explore:[
    {
      title:'Grid track builder', height:620,
      note:'Type track lists straight into the boxes: try <code>1fr 2fr 1fr</code>, <code>repeat(4, 1fr)</code>, <code>200px 1fr</code>, <code>repeat(auto-fit, minmax(120px, 1fr))</code>.',
      html:`
<div class="knobs">
  <label>grid-template-columns <input type="text" id="cols" value="repeat(3, 1fr)" size="26"></label>
  <label>grid-template-rows <input type="text" id="rows" value="repeat(2, 90px)" size="20"></label>
  <label>gap <input type="range" min="0" max="30" value="8" data-css="#g|gap|px"><span class="val"></span></label>
</div>
<div class="knobs">
  <span style="font-size:12px;color:#5b6382">presets:</span>
  <button class="preset" data-c="repeat(3, 1fr)" data-r="repeat(2, 90px)">equal thirds</button>
  <button class="preset" data-c="1fr 2fr 1fr" data-r="repeat(2, 90px)">1fr 2fr 1fr</button>
  <button class="preset" data-c="200px 1fr" data-r="repeat(3, 70px)">sidebar + content</button>
  <button class="preset" data-c="repeat(auto-fit, minmax(110px, 1fr))" data-r="auto">auto-fit (responsive!)</button>
  <button class="preset" data-c="repeat(2, 1fr)" data-r="120px minmax(80px, 200px)">minmax rows</button>
</div>
<div class="stage">
  <div id="g" style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,90px);gap:8px">
    <div class="box">1</div><div class="box b">2</div><div class="box c">3</div>
    <div class="box d">4</div><div class="box">5</div><div class="box b">6</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note"><b>fr</b> = one share of the free space. <b>repeat(n, x)</b> = n tracks of x. <b>minmax(a, b)</b> = never smaller than a, never bigger than b. <b>auto-fit + minmax</b> = a responsive gallery with no media queries at all: resize your browser window to see it.</p>
<style>.preset{font:inherit;font-size:11.5px;padding:3px 9px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer}
.preset:hover{border-color:#5b9cff}</style>
<script>
  var c = document.getElementById('cols'), r = document.getElementById('rows'), g = document.getElementById('g');
  function upd(){
    g.style.gridTemplateColumns = c.value;
    g.style.gridTemplateRows = r.value;
    document.getElementById('ro').textContent =
      '.container {\\n  display: grid;\\n  grid-template-columns: ' + c.value +
      ';\\n  grid-template-rows: ' + r.value + ';\\n  gap: ' + (g.style.gap || '8px') + ';\\n}';
  }
  c.addEventListener('input', upd); r.addEventListener('input', upd);
  document.querySelectorAll('.preset').forEach(function(b){
    b.addEventListener('click', function(){
      c.value = b.dataset.c; r.value = b.dataset.r; upd();
    });
  });
  document.addEventListener('input', function(){ setTimeout(upd, 5); });
  upd();
<\/script>`
    },
    {
      title:'Grid snaps, flex squashes', height:560,
      note:'The same six items in a wrapping flex container and in a three-column grid. Drag the width: the flex rows each work out their own widths, so edges rarely line up from one row to the next; the grid items always share column lines.',
      html:`
<div class="knobs">
  <label>container width <input type="range" id="w" min="260" max="700" value="460"><span class="val" id="wv"></span></label>
</div>
<div class="stage">
  <h4>display: flex; flex-wrap: wrap;  (items: flex: 1 1 auto)</h4>
  <div id="fx" class="cmp"></div>
  <h4 style="margin-top:14px">display: grid; grid-template-columns: repeat(3, 1fr);</h4>
  <div id="gd" class="cmp"></div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .cmp{gap:6px;border:2px dashed #b9c0d4;padding:6px;background:#eef1f9}
  #fx{display:flex;flex-wrap:wrap} #fx > div{flex:1 1 auto}
  #gd{display:grid;grid-template-columns:repeat(3,1fr)}
  .cmp > div{padding:10px 8px;font-size:12.5px}
</style>
<script>
  var LABELS = ['Home','About the team','Our services and prices','Blog','Customer stories','Contact us today'];
  var CLS = ['box','box b','box c','box d','box','box b'];
  ['fx','gd'].forEach(function(id){
    document.getElementById(id).innerHTML = LABELS.map(function(t,i){ return '<div class="' + CLS[i] + '">' + t + '</div>'; }).join('');
  });
  var w = document.getElementById('w');
  function edges(id){
    var c = document.getElementById(id), base = c.getBoundingClientRect().left, rows = {};
    [].forEach.call(c.children, function(k){ var r = k.getBoundingClientRect(); (rows[Math.round(r.top)] = rows[Math.round(r.top)] || []).push(Math.round(r.left - base)); });
    return Object.keys(rows).map(function(t){ return rows[t].join(', '); });
  }
  function upd(){
    ['fx','gd'].forEach(function(id){ document.getElementById(id).style.width = w.value + 'px'; });
    document.getElementById('wv').textContent = w.value + 'px';
    document.getElementById('ro').textContent =
      'left edges of the items, row by row (px from the container edge)\\n\\n' +
      'flex: ' + edges('fx').join('   |   ') + '\\n' +
      'grid: ' + edges('gd').join('   |   ') + '\\n\\n' +
      'In the grid every row repeats the same numbers: the items sit on shared column lines.';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
    }],
    notes:`
      <h3>Grid vs flexbox</h3>
      <table>
        <tr><th>Flexbox</th><th>Grid</th></tr>
        <tr><td>One dimension: a row <em>or</em> a column</td><td>Two dimensions: rows <em>and</em> columns</td></tr>
        <tr><td>Content-driven: items size themselves</td><td>Layout-driven: you define the tracks first</td></tr>
        <tr><td>Nav bars, button rows, centring</td><td>Page layouts, galleries, dashboards</td></tr>
      </table>
      <p>They are not rivals. A very normal setup is a grid page layout with flexbox inside each area. To compare them side by side while resizing, try the <a href="https://appbrewery.github.io/grid-vs-flexbox/" target="_blank" rel="noopener">grid vs flexbox demo</a> the lecture uses.</p>`
  });
})();


PG.add({
  id:'s10-grid-sizing', index:61, udemyId:37368474, minutes:24, section:'s10', slug:'grid-sizing', kind:'build',
  title:'Grid Sizing',
  blurb:'Tracks can be fixed (<code>200px</code>), <code>auto</code> (columns fill the spare width, rows fit their content), fractional (<code>1fr 2fr</code>) or bounded (<code>minmax(200px, 500px)</code>). <code>repeat()</code> saves typing, and <code>grid-auto-rows</code> sizes the rows the grid adds by itself when items run past your template.',
  tasks:[
    'Drag the <b>Grid width</b> slider and study the green target. Read its labels: the first column soaks up spare width, the second never changes, the third flexes between two limits; the first two rows match and the third is twice as tall; the last row is a short 25px strip. (Sizes are half the course\'s, so it fits the preview.)',
    'On <code>.grid-container</code> set <code>display: grid</code> and <code>grid-template-rows: 1fr 1fr 2fr</code>.',
    'Add <code>grid-template-columns: auto 200px minmax(100px, 250px)</code>.',
    'The tenth item has spilled into a fourth row you never defined (an implicit row), sized to its text. Set its height with <code>grid-auto-rows: 25px</code> rather than adding a fourth row to the template.',
    'Drag the slider through its whole range: both grids should now behave identically. Then compare your three lines with the target\'s one-line <code>grid-template</code> shorthand (<i>rows / columns</i>) in the <code>&lt;style&gt;</code> block of <code>index.html</code>.',
    'Press <b>↗ open</b>, right-click the purple grid, choose <b>Inspect</b> and click the <code>grid</code> badge next to it in the Elements panel. The overlay shows line numbers and the real size of every track.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Grid Sizing</title>
  <link rel="stylesheet" href="./style.css" />
  <style>
    /* The target's own CSS, written with the shorthand
       grid-template: <rows> / <columns>;
       Match it with the longhand properties, then compare. */
    .parent {
      display: grid;
      grid-template: 1fr 1fr 2fr / auto 200px minmax(100px, 250px);
      grid-auto-rows: 25px;
    }
  </style>
</head>
<body>
  <label class="resizer">
    Grid width
    <input type="range" min="300" max="520" value="520"
      oninput="document.body.style.setProperty('--width', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px';" />
    <output>520px</output>
  </label>

  <h2>Target (do not edit)</h2>
  <div class="parent">
    <div>auto: fills spare width</div>
    <div>200px wide</div>
    <div>min 100px, max 250px</div>
    <div>auto: fills spare width</div>
    <div>200px wide</div>
    <div>min 100px, max 250px</div>
    <div>auto: fills spare width</div>
    <div>200px wide</div>
    <div>min 100px, max 250px</div>
    <div>25px high</div>
  </div>

  <h2>Yours</h2>
  <div class="grid-container">
    <div class="grid-item">auto: fills spare width</div>
    <div class="grid-item">200px wide</div>
    <div class="grid-item">min 100px, max 250px</div>
    <div class="grid-item">auto: fills spare width</div>
    <div class="grid-item">200px wide</div>
    <div class="grid-item">min 100px, max 250px</div>
    <div class="grid-item">auto: fills spare width</div>
    <div class="grid-item">200px wide</div>
    <div class="grid-item">min 100px, max 250px</div>
    <div class="grid-item">25px high</div>
  </div>
</body>
</html>`,
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

h2 {
  font-size: 1rem;
  margin: 16px 0 6px;
}

.resizer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

/* Both grids follow the slider */
.parent,
.grid-container {
  width: var(--width, 520px);
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px;
  background-color: #ddd;
}

.parent > *,
.grid-item {
  padding: 3px 6px;
  font-size: 12px;
  line-height: 1.2;
  color: white;
  border: 2px solid white;
}

.parent > * { background-color: seagreen; }
.grid-item { background-color: darkviolet; }

/* ---------- Your CSS ---------- */

.grid-container {
  /* TODO 1: make it a grid with three rows: two equal, then one twice as tall */
  /* TODO 2: three columns: auto, then 200px, then between 100px and 250px */
  /* TODO 3: any row the grid adds by itself should be 25px tall */
}
`},
  solution:{
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

h2 {
  font-size: 1rem;
  margin: 16px 0 6px;
}

.resizer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

/* Both grids follow the slider */
.parent,
.grid-container {
  width: var(--width, 520px);
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px;
  background-color: #ddd;
}

.parent > *,
.grid-item {
  padding: 3px 6px;
  font-size: 12px;
  line-height: 1.2;
  color: white;
  border: 2px solid white;
}

.parent > * { background-color: seagreen; }
.grid-item { background-color: darkviolet; }

/* ---------- Your CSS ---------- */

.grid-container {
  display: grid;
  grid-template-rows: 1fr 1fr 2fr;
  grid-template-columns: auto 200px minmax(100px, 250px);
  grid-auto-rows: 25px;
}
`},
  quiz:[
    { q:'<code>grid-template-columns: 200px auto</code>. What does the second column do?', options:['It is 200px too','It fills the rest of the container\'s width','It is as narrow as possible','It is ignored'], answer:1, why:'An auto column stretches to use the remaining width, so it grows and shrinks with the window.' },
    { q:'Why does an <code>auto</code> row not stretch to fill the window\'s height?', options:['Rows cannot be auto','A grid container is only as tall as its content by default, so there is no spare height to grow into','auto only works with fr','It needs !important'], answer:1, why:'Width defaults to the full available width; height defaults to fit the content, so auto rows just fit what is inside them.' },
    { q:'What does <code>minmax(200px, 500px)</code> do for a column?', options:['Picks a random width between the two','Keeps it between 200px and 500px as the container resizes','Makes it 200px on phones and 500px on desktops','Sets a 200px gap'], answer:1, why:'The track flexes with the container but never goes below the minimum or above the maximum.' },
    { q:'What is <code>grid-auto-rows</code> for?', options:['Sizing the rows you list in grid-template-rows','Sizing the extra rows the grid creates when there are more items than cells','Turning on automatic placement','Making rows equal'], answer:1, why:'Those extra rows are implicit tracks; grid-auto-rows gives them a size instead of letting them fit their content.' },
    { q:'In <code>grid-template: 100px 200px / 400px 800px</code>, which values are the rows?', options:['400px 800px','100px 200px','100px 400px','All four are columns'], answer:1, why:'The shorthand lists rows first, then a slash, then columns.' },
  ],
  explore:[
  {
    title:'Track sizing units head to head', height:690,
    note:'The same items, four different track recipes. Shrink the container and watch which ones cope.',
    html:`
<div class="knobs">
  <label>container width <input type="range" min="260" max="720" value="680" id="w"><span class="val" id="wv">680px</span></label>
</div>
<div class="stage" id="stage">
  <h4>repeat(3, 100px): fixed, overflows when it runs out of room</h4>
  <div class="g" style="grid-template-columns:repeat(3,100px)"><div class="box">a</div><div class="box b">b</div><div class="box c">c</div></div>
  <h4>repeat(3, 1fr): always shares the width evenly</h4>
  <div class="g" style="grid-template-columns:repeat(3,1fr)"><div class="box">a</div><div class="box b">b</div><div class="box c">c</div></div>
  <h4>200px 1fr: a fixed sidebar plus flexible content</h4>
  <div class="g" style="grid-template-columns:200px 1fr"><div class="box">sidebar</div><div class="box b">content</div></div>
  <h4>repeat(auto-fit, minmax(120px, 1fr)): reflows on its own</h4>
  <div class="g" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">
    <div class="box">1</div><div class="box b">2</div><div class="box c">3</div><div class="box d">4</div><div class="box">5</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>.g{display:grid;gap:6px;margin-bottom:14px;border:2px dashed #b9c0d4;padding:6px}
h4{margin:0 0 5px}</style>
<script>
  var w = document.getElementById('w');
  function upd(){
    document.getElementById('stage').style.width = w.value + 'px';
    document.getElementById('wv').textContent = w.value + 'px';
    document.getElementById('ro').textContent =
      'container: ' + w.value + 'px\\n\\n' +
      'px    : never changes, will overflow\\n' +
      'fr    : divides whatever space exists\\n' +
      'mixed : fixed where it must be, flexible everywhere else\\n' +
      'auto-fit + minmax: changes the NUMBER of columns as space allows';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'Explicit and implicit tracks', height:560,
    note:'The template defines the explicit grid (dashed cells). Add more items than it has cells and the grid creates implicit rows for them (orange). Fewer items than cells just leaves cells empty.',
    html:`
<div class="knobs">
  <label>columns <input type="range" id="nc" min="1" max="5" value="3"><span class="val" id="ncv"></span></label>
  <label>template rows <input type="range" id="nr" min="1" max="4" value="2"><span class="val" id="nrv"></span></label>
  <label>items <input type="range" id="ni" min="1" max="16" value="9"><span class="val" id="niv"></span></label>
  <label>grid-auto-rows <select id="ar"><option>auto</option><option>20px</option><option>70px</option></select></label>
</div>
<div class="stage">
  <div id="wrap" style="position:relative">
    <div id="ghost" class="lay"></div>
    <div id="g" class="lay" style="position:relative"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .lay{display:grid;gap:6px}
  #ghost{position:absolute;top:0;left:0;right:0}
  #ghost div{border:2px dashed #b9c0d4;border-radius:6px;background:#f6f7fb}
  #g .box{padding:8px;font-size:12px}
  #g .imp{background:#ff9f43;color:#123}
</style>
<script>
  function $(id){ return document.getElementById(id); }
  function upd(){
    var nc = +$('nc').value, nr = +$('nr').value, ni = +$('ni').value, ar = $('ar').value;
    $('ncv').textContent = nc; $('nrv').textContent = nr; $('niv').textContent = ni;
    var cols = 'repeat(' + nc + ', 1fr)', rows = 'repeat(' + nr + ', 50px)';
    [$('g'), $('ghost')].forEach(function(el){ el.style.gridTemplateColumns = cols; el.style.gridTemplateRows = rows; });
    $('g').style.gridAutoRows = ar;
    $('ghost').innerHTML = new Array(nc * nr + 1).join('<div></div>');
    var html = '';
    for (var k = 0; k < ni; k++){ var imp = Math.floor(k / nc) >= nr; html += '<div class="box' + (imp ? ' imp' : '') + '">' + (k + 1) + (imp ? ' (implicit row)' : '') + '</div>'; }
    $('g').innerHTML = html;
    var cells = nc * nr, extra = Math.max(0, ni - cells), extraRows = Math.ceil(extra / nc), empty = Math.max(0, cells - ni);
    $('ro').textContent = '.grid {\\n  grid-template-columns: ' + cols + ';\\n  grid-template-rows: ' + rows + ';\\n  grid-auto-rows: ' + ar + ';\\n}\\n\\n' +
      'explicit grid: ' + nc + ' x ' + nr + ' = ' + cells + ' cells for ' + ni + ' items\\n' +
      (extra ? extra + ' item(s) did not fit, so the grid added ' + extraRows + ' implicit row(s), ' + (ar === 'auto' ? 'sized to their content (grid-auto-rows: auto)' : ar + ' tall because of grid-auto-rows') + '.'
             : empty ? empty + ' cell(s) are left empty at the end; no implicit rows needed.' : 'every cell is filled exactly.');
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The sizing values</h3>
    <table>
      <tr><th>Value</th><th>Means</th></tr>
      <tr><td><code>200px</code>, <code>10rem</code></td><td>Exactly that. rem follows the root font size, not the window.</td></tr>
      <tr><td><code>auto</code></td><td>Columns: fill the spare width. Rows: fit the content.</td></tr>
      <tr><td><code>1fr</code></td><td>One share of the space left after fixed tracks.</td></tr>
      <tr><td><code>minmax(200px, 1fr)</code></td><td>At least 200px, otherwise flexible.</td></tr>
      <tr><td><code>repeat(4, 1fr)</code></td><td>Four identical tracks.</td></tr>
    </table>
    <h3>A typo that fails silently</h3>
    <p><code>grid-template-row</code> (no <b>s</b>) is not a property, so the browser skips it without complaint. If a grid refuses to change, check the spelling first.</p>`
});


PG.add({
  id:'s10-grid-placement', index:62, udemyId:37368524, minutes:26, section:'s10', slug:'grid-placement', kind:'build',
  title:'Grid Placement',
  blurb:'Items fill the cells in source order unless you place them. <code>grid-column</code> and <code>grid-row</code> take line numbers or a <code>span</code>, <code>grid-area</code> packs four line numbers into one value, and <code>order</code> reshuffles items. Unlike flexbox, grid items can even overlap.',
  tasks:[
    'Exercise 1: each emoji sits in the top-left corner of its box. Make <code>.item</code> a flex container and centre its content with <code>justify-content</code> and <code>align-items</code>: grid places the boxes, flexbox arranges what is inside them.',
    'Make the cowboy span two columns with <code>grid-column: span 2</code>. The book is pushed to the third column and the second row stays empty.',
    'Exercise 2: give the astronaut <code>order: 1</code> so it is placed after the others, on the bottom row, then <code>grid-column: span 2</code> so it fills the two left columns.',
    'Swap the astronaut\'s two lines for one: <code>grid-area: 2 / 1 / 3 / 3</code> (row-start / column-start / row-end / column-end). Same result, placed by coordinates.',
    'Exercise 3: make the book fill the whole third column, top to bottom, with <code>grid-area: 1 / 3 / 3 / 4</code>. Then check that <code>grid-area: 1 / 3 / -1 / -1</code> and <code>grid-row: span 2</code> give the same result.',
    'Bonus: give the book <code>grid-area: 1 / 2 / 3 / 4</code> and the see-through colour <code>#e5833180</code> to watch it overlap the others. Then play <a href="https://cssgridgarden.com/" target="_blank" rel="noopener">Grid Garden</a>, all 28 levels.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Grid Placement</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <div class="item cowboy">🤠</div>
    <div class="item astronaut">👨‍🚀</div>
    <div class="item book">📖</div>
  </div>
</body>
</html>`,
'style.css':`body {
  padding: 0;
  margin: 0;
}

.container {
  height: 100vh;
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr 1fr 1.5fr;
  grid-template-rows: 1fr 1fr;
}

.item {
  font-size: 4rem;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  background-color: blueviolet;
  /* TODO 1: centre the emoji inside each box with flexbox */
}

.cowboy {
  background-color: #00b9ff;
  /* TODO 2: span two columns */
}

.astronaut {
  background-color: #03989e;
  /* TODO 3 and 4: the two left columns of the bottom row */
}

.book {
  background-color: #e58331;
  /* TODO 5: the whole third column */
}
`},
  solution:{
'style.css':`body {
  padding: 0;
  margin: 0;
}

.container {
  height: 100vh;
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr 1fr 1.5fr;
  grid-template-rows: 1fr 1fr;
}

.item {
  font-size: 4rem;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  background-color: blueviolet;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cowboy {
  background-color: #00b9ff;
  grid-column: span 2;
}

.astronaut {
  background-color: #03989e;
  grid-area: 2 / 1 / 3 / 3;   /* or: order: 1; grid-column: span 2; */
}

.book {
  background-color: #e58331;
  grid-area: 1 / 3 / 3 / 4;   /* or: grid-area: 1 / 3 / -1 / -1;  or: grid-row: span 2; */
}
`},
  quiz:[
    { q:'What order do the four values of <code>grid-area</code> come in?', options:['column-start / row-start / column-end / row-end','row-start / column-start / row-end / column-end','top / right / bottom / left','row-start / row-end / column-start / column-end'], answer:1, why:'Rows first, then columns: start lines, then end lines.' },
    { q:'A grid has three columns. Which value spans the full width without counting lines?', options:['grid-column: 1 / 3','grid-column: 1 / -1','grid-column: span 4','grid-column: 0 / 3'], answer:1, why:'Three columns have four vertical lines; -1 always means the last one, however many columns there are.' },
    { q:'You give the second item <code>grid-column: span 2</code>, but the first row only has one free cell. What happens?', options:['It squeezes into the one cell','Auto-placement moves it on to the next row where two cells are free','It overlaps the first item','The grid adds a fourth column'], answer:1, why:'An item only goes where its whole span fits, which is why the lecture moves the astronaut with order or grid-area.' },
    { q:'How can you make a grid line look thick and coloured?', options:['border on the line','line-color','A gap, with the container\'s background showing through','outline on the grid'], answer:2, why:'Lines cannot be styled directly; the gap sets their thickness and the container background supplies the colour.' },
    { q:'Two items overlap in a grid. Which one is drawn on top by default?', options:['The bigger one','The one that comes later in the HTML','The one with the lower order','Neither: the browser blends them'], answer:1, why:'Later items in source order paint over earlier ones (z-index can change that).' },
  ],
  explore:[
  {
    title:'Place an item by grid lines', height:640,
    note:'The orange item is placed by line numbers. A 4-column grid has <b>5</b> vertical lines, numbered from 1 on the left; negative numbers count back from the end, so <code>-1</code> is the last line. Try a start that is bigger than the end, too.',
    html:`
<div class="knobs">
  <label>column start <input type="number" id="cs" value="2" min="-5" max="5" style="width:56px"></label>
  <label>column end <input type="number" id="ce" value="4" min="-5" max="5" style="width:56px"></label>
  <label>row start <input type="number" id="rs" value="1" min="-4" max="4" style="width:56px"></label>
  <label>row end <input type="number" id="re" value="3" min="-4" max="4" style="width:56px"></label>
</div>
<div class="stage">
  <div class="ruler"><span>1 / -5</span><span>2 / -4</span><span>3 / -3</span><span>4 / -2</span><span>5 / -1</span></div>
  <div id="g" style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,66px);gap:6px;position:relative">
    <div class="ghost">1</div><div class="ghost">2</div><div class="ghost">3</div><div class="ghost">4</div>
    <div class="ghost">5</div><div class="ghost">6</div><div class="ghost">7</div><div class="ghost">8</div>
    <div class="ghost">9</div><div class="ghost">10</div><div class="ghost">11</div><div class="ghost">12</div>
    <div id="me" class="box" style="background:#ff9f43;grid-column:2 / 4;grid-row:1 / 3;z-index:2">me</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>.ghost{background:#eef1f9;border:1px dashed #c6cde0;border-radius:4px;display:flex;
  align-items:center;justify-content:center;color:#9aa2ba;font-size:12px}
  .ruler{display:flex;justify-content:space-between;font-size:11px;color:#5b6382;margin:0 -14px 4px;font-family:ui-monospace,Menlo,monospace}</style>
<script>
  var f = ['cs','ce','rs','re'].map(function(i){ return document.getElementById(i); });
  function res(n, tracks){ n = +n; return n < 0 ? tracks + 2 + n : n; }
  function upd(){
    var cs=f[0].value, ce=f[1].value, rs=f[2].value, re=f[3].value;
    var me = document.getElementById('me');
    me.style.gridColumn = cs + ' / ' + ce;
    me.style.gridRow = rs + ' / ' + re;
    var a = res(cs, 4), b = res(ce, 4), c = res(rs, 3), d = res(re, 3);
    var notes = [];
    if (+cs < 0 || +ce < 0 || +rs < 0 || +re < 0) notes.push('negative lines count from the end: column line -1 is line 5, row line -1 is line 4');
    if (b < a || d < c) notes.push('a start after its end is fine: the browser swaps them');
    document.getElementById('ro').textContent =
      '.me {\\n  grid-column: ' + cs + ' / ' + ce + ';\\n  grid-row: ' + rs + ' / ' + re + ';\\n}\\n\\n' +
      '/* the same thing as one shorthand: */\\n' +
      '.me { grid-area: ' + rs + ' / ' + cs + ' / ' + re + ' / ' + ce + '; }\\n' +
      '/*     row-start / col-start / row-end / col-end */\\n\\n' +
      'covers ' + Math.abs(b - a) + ' column(s) and ' + Math.abs(d - c) + ' row(s)' +
      (notes.length ? '\\n' + notes.join('\\n') : '');
  }
  f.forEach(function(el){ el.addEventListener('input', upd); }); upd();
<\/script>`
  },
  {
    title:'Grid vocabulary', height:560,
    note:'The five words the rest of the section relies on, plus areas and gaps. Pick a term to highlight it.',
    html:`
<div class="knobs">
  <label>highlight
    <select id="t">
      <option value="container">grid container</option>
      <option value="item">grid item</option>
      <option value="col">column track</option>
      <option value="row">row track</option>
      <option value="cell">grid cell</option>
      <option value="line" selected>grid lines</option>
      <option value="area">an item covering an area</option>
      <option value="gap">gap</option>
    </select>
  </label>
</div>
<div class="stage">
  <div id="wrap" style="position:relative;max-width:480px;margin:10px auto 20px">
    <div id="g" style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,64px);gap:14px;padding:0;background:#fff">
      <div class="cl"></div><div class="cl"></div><div class="cl"></div>
      <div class="cl"></div><div class="cl"></div><div class="cl"></div>
      <div class="cl"></div><div class="cl"></div><div class="cl"></div>
    </div>
    <div id="ov"></div>
  </div>
</div>
<p class="note" id="def" style="font-size:13.5px;color:#1c2030"></p>
<style>
  .cl{background:#eef1f9;border:1px solid #c6cde0;border-radius:4px}
  #ov{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none}
  .hl{position:absolute;border:3px solid #d6336c;background:rgba(214,51,108,.15);border-radius:4px}
  .ln{position:absolute;background:#d6336c}
  .lnum{position:absolute;font:700 11px ui-monospace,Menlo,monospace;color:#d6336c}
</style>
<script>
  var DEF = {
    container:'<b>Grid container</b>: the parent with display: grid. Everything else on this list lives inside it.',
    item:'<b>Grid item</b>: a direct child of the container. Each item is placed into one or more cells.',
    col:'<b>Column track</b>: one whole column of cells. grid-template-columns sizes the column tracks.',
    row:'<b>Row track</b>: one whole row of cells. grid-template-rows sizes the row tracks.',
    cell:'<b>Grid cell</b>: the smallest unit, where one row track crosses one column track.',
    line:'<b>Grid lines</b>: the dividing lines between tracks, numbered from 1. Three columns have four vertical lines. Lines are what you place items by.',
    area:'<b>Area</b>: the rectangle of cells one item covers, here grid-area: 1 / 1 / 3 / 3 (two rows by two columns).',
    gap:'<b>Gap</b>: the thickness of the grid lines, and the only thing about a line you can change. It holds no content and has no colour of its own; the container background shows through it.'
  };
  var g = document.getElementById('g'), ov = document.getElementById('ov'), t = document.getElementById('t');
  function rect(el){ var a = el.getBoundingClientRect(), b = document.getElementById('wrap').getBoundingClientRect(); return { l:a.left-b.left, t:a.top-b.top, w:a.width, h:a.height }; }
  function box(r){ return '<div class="hl" style="left:' + r.l + 'px;top:' + r.t + 'px;width:' + r.w + 'px;height:' + r.h + 'px"></div>'; }
  function union(els){ var rs = els.map(rect), l = Math.min.apply(0, rs.map(function(r){return r.l;})), tp = Math.min.apply(0, rs.map(function(r){return r.t;}));
    var R = Math.max.apply(0, rs.map(function(r){return r.l + r.w;})), B = Math.max.apply(0, rs.map(function(r){return r.t + r.h;})); return { l:l, t:tp, w:R-l, h:B-tp }; }
  function upd(){
    var cells = [].slice.call(g.children), v = t.value, h = '';
    g.style.background = v === 'gap' ? '#d6336c' : '#fff';
    if (v === 'container') h = box(rect(g));
    if (v === 'item' || v === 'cell') h = box(rect(cells[4]));
    if (v === 'col') h = box(union([cells[1], cells[4], cells[7]]));
    if (v === 'row') h = box(union([cells[3], cells[4], cells[5]]));
    if (v === 'area') h = box(union([cells[0], cells[1], cells[3], cells[4]]));
    if (v === 'line'){
      var G = rect(g), xs = [G.l], ys = [G.t];
      [0,1].forEach(function(k){ var a = rect(cells[k]), b = rect(cells[k+1]); xs.push((a.l + a.w + b.l) / 2); });
      [0,3].forEach(function(k){ var a = rect(cells[k]), b = rect(cells[k+3]); ys.push((a.t + a.h + b.t) / 2); });
      xs.push(G.l + G.w); ys.push(G.t + G.h);
      xs.forEach(function(x, k){ h += '<div class="ln" style="left:' + (x-1) + 'px;top:' + G.t + 'px;width:2px;height:' + G.h + 'px"></div><div class="lnum" style="left:' + (x-4) + 'px;top:' + (G.t + G.h + 3) + 'px">' + (k+1) + '</div>'; });
      ys.forEach(function(y, k){ h += '<div class="ln" style="left:' + G.l + 'px;top:' + (y-1) + 'px;width:' + G.w + 'px;height:2px"></div><div class="lnum" style="left:' + (G.l - 14) + 'px;top:' + (y-7) + 'px">' + (k+1) + '</div>'; });
    }
    ov.innerHTML = h;
    document.getElementById('def').innerHTML = DEF[v];
  }
  t.addEventListener('change', upd); setTimeout(upd, 30);
<\/script>`
  },
  {
    title:'Overlap and see-through colour', height:550,
    note:'Grid lets items share cells. Move the book over the others and fade it with the last two digits of an 8-digit hex colour (<code>80</code> is about 50% opacity).',
    html:`
<div class="knobs">
  <label>book grid-area
    <select id="ga">
      <option value="1 / 3 / 3 / 4">1 / 3 / 3 / 4  (its own column)</option>
      <option value="1 / 2 / 3 / 4" selected>1 / 2 / 3 / 4  (overlapping)</option>
      <option value="1 / 1 / 3 / 4">1 / 1 / 3 / 4  (everything)</option>
    </select>
  </label>
  <label>alpha <input type="range" id="al" min="0" max="255" value="128"><span class="val" id="alv"></span></label>
</div>
<div class="stage">
  <div style="display:grid;height:230px;gap:1rem;grid-template-columns:1fr 1fr 1.5fr;grid-template-rows:1fr 1fr">
    <div class="it" style="background:#00b9ff;grid-area:1 / 1 / 2 / 3">🤠</div>
    <div class="it" style="background:#03989e;grid-area:2 / 1 / 3 / 3">👨‍🚀</div>
    <div class="it" id="bk">📖</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>.it{display:flex;align-items:center;justify-content:center;font-size:2.4rem;border-radius:4px}</style>
<script>
  function upd(){
    var a = +document.getElementById('al').value, hex = ('0' + a.toString(16)).slice(-2);
    var bk = document.getElementById('bk'), ga = document.getElementById('ga').value;
    bk.style.gridArea = ga; bk.style.background = '#e58331' + hex;
    document.getElementById('alv').textContent = hex + ' (' + Math.round(a / 2.55) + '%)';
    document.getElementById('ro').textContent = '.book {\\n  grid-area: ' + ga + ';\\n  background-color: #e58331' + hex + ';\\n}\\n\\n' +
      'The book comes last in the HTML, so it is painted on top of the items it overlaps.';
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Line numbers, not track numbers</h3>
    <p>Tracks sit <em>between</em> lines. Three columns means four lines, so <code>grid-column: 2 / 4</code> starts at line 2 and stops at line 4, covering two columns. The end line is where the item stops, not the last track it covers.</p>
    <h3>Ways to say the same thing</h3>
    <pre>grid-column: 1 / 3;
grid-column-start: 1;  grid-column-end: 3;
grid-column: span 2;      /* start wherever auto-placement puts it */
grid-area: 1 / 1 / 2 / 3; /* row-start / col-start / row-end / col-end */</pre>
    <p>Once one item is placed with <code>grid-area</code>, give the others explicit places too; mixing a few placed items with auto-placed ones gets unpredictable.</p>`
});


PG.add({
  id:'s10-mondrian', index:63, udemyId:37368588, minutes:7, section:'s10', slug:'mondrian-project', kind:'build', project:true,
  title:'Mondrian Painting',
  blurb:'Rebuild a Piet Mondrian composition to scale with CSS grid: fixed-pixel tracks read off a measured drawing, a few spanning blocks, black lines that are really the container\'s background showing through the gap, and the painting centred on the page with flexbox.',
  tasks:[
    'Open the <b>Explore</b> tab for the measured drawing. The painting is 748px square with 9px lines; the columns are 320, 198, 153 and 50px wide and the rows 414, 130, 155 and 22px tall. One white block covers two column widths, which is why there are four columns, not three.',
    'In <code>index.html</code>, add nine divs inside <code>.container</code>, one per rectangle, in reading order. Give each the class <code>item</code> plus a name: <code>red</code>, <code>white1</code>, <code>white2</code>, <code>white3</code>, <code>blue</code>, <code>white4</code>, <code>white5</code>, <code>yellow</code>, <code>black</code>.',
    'Make <code>.container</code> a 748px × 748px grid with the measured tracks and <code>gap: 9px</code>. Give it a black background: grid lines cannot be coloured, so the background showing through the gaps draws them.',
    'Colour every <code>.item</code> off-white (<code>#f0f1ec</code>), then override red, blue, yellow and black with the hex codes in the comment at the top of <code>style.css</code>.',
    'Place the blocks that cover more than one track: <code>white1</code> spans three columns, <code>white2</code> and <code>white4</code> span two rows, and <code>white3</code> is easiest as <code>grid-area: 2 / 2 / 4 / 4</code>. Everything else falls into place by itself.',
    'Centre the painting with flexbox on <code>body</code> (<code>justify-content</code>, <code>align-items</code>, <code>height: 100vh</code>, <code>margin: 0</code>). The painting is bigger than the preview pane, so press <b>↗ open</b> to see it whole.',
    'Stretch goal: search for "Mondrian compositions", pick another one and build it, judging the track sizes by eye.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mondrian Project</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <!-- TODO: nine divs, one per rectangle, in reading order -->
  </div>
</body>
</html>`,
'style.css':`/*
  Colours
  Lines (background): #000
  White:  #f0f1ec
  Red:    #e72f24
  Blue:   #004592
  Yellow: #f9d01e
  Black:  #232629
*/

/* TODO 6: centre the painting in the window */
body {
}

/* TODO 3: a 748px square grid, the measured tracks, a 9px gap, a black background */
.container {
}

/* TODO 4: off-white for every block, then the coloured ones */

/* TODO 5: the blocks that cover more than one track */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mondrian Project</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <div class="item red"></div>
    <div class="item white1"></div>
    <div class="item white2"></div>
    <div class="item white3"></div>
    <div class="item blue"></div>
    <div class="item white4"></div>
    <div class="item white5"></div>
    <div class="item yellow"></div>
    <div class="item black"></div>
  </div>
</body>
</html>`,
'style.css':`/*
  Colours
  Lines (background): #000
  White:  #f0f1ec
  Red:    #e72f24
  Blue:   #004592
  Yellow: #f9d01e
  Black:  #232629
*/

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  width: 748px;
  height: 748px;
  display: grid;
  grid-template-columns: 320px 198px 153px 50px;
  grid-template-rows: 414px 130px 155px 22px;
  gap: 9px;
  background-color: #000;
}

.item {
  background-color: #f0f1ec;
}

.red {
  background-color: #e72f24;
}

.blue {
  background-color: #004592;
}

.yellow {
  background-color: #f9d01e;
}

.black {
  background-color: #232629;
}

.white1 {
  grid-column: span 3;
}

.white2 {
  grid-row: span 2;
}

.white3 {
  grid-area: 2 / 2 / 4 / 4;
}

.white4 {
  grid-row: span 2;
}
`},
  quiz:[
    { q:'How are the thick black lines made?', options:['A 9px black border on every block','The container\'s black background showing through a 9px gap','Nine black divs','An outline on the grid'], answer:1, why:'Grid lines cannot be coloured; the gap sets their thickness and the background gives them their colour, perfectly even everywhere.' },
    { q:'Why does the painting need four columns rather than three?', options:['Grids need an even number of columns','One block is as wide as two column widths together, so the boundary between them has to exist as a line','The fourth column holds the gap','To make the painting square'], answer:1, why:'Every vertical edge in the painting needs its own grid line; a block covering two widths spans two tracks.' },
    { q:'What does <code>grid-area: 2 / 2 / 4 / 4</code> cover?', options:['Row 2, column 2 only','Rows 2–3 and columns 2–3','Rows 2–4 and columns 2–4','Four cells starting at line 4'], answer:1, why:'It runs from row line 2 to row line 4 and column line 2 to column line 4, which is two tracks each way.' },
  ],
  explore:[
  {
    title:'The measured drawing', height:640,
    note:'The painting at half size, drawn from the measurements. Turn on the measurements and the line numbers, then translate each block into <code>grid-column</code> / <code>grid-row</code> or <code>grid-area</code>.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="m" checked> track sizes</label>
  <label><input type="checkbox" id="n"> line numbers</label>
  <label><input type="checkbox" id="b"> block names</label>
</div>
<div class="stage" style="text-align:center">
  <svg id="sv" viewBox="-70 -50 900 870" style="width:100%;max-width:470px;height:auto"></svg>
</div>
<script>
  var X = [0, 329, 536, 698, 748], W = [320, 198, 153, 50];
  var Y = [0, 423, 562, 726, 748], H = [414, 130, 155, 22];
  var BLOCKS = [
    ['red', '#e72f24', 0, 0, 320, 414], ['white1', '#f0f1ec', 329, 0, 419, 414],
    ['white2', '#f0f1ec', 0, 423, 320, 294], ['white3', '#f0f1ec', 329, 423, 360, 294],
    ['blue', '#004592', 698, 423, 50, 130], ['white4', '#f0f1ec', 698, 562, 50, 186],
    ['white5', '#f0f1ec', 0, 726, 320, 22], ['yellow', '#f9d01e', 329, 726, 198, 22], ['black', '#232629', 536, 726, 153, 22]
  ];
  var LX = [0, 324.5, 531.5, 693.5, 748], LY = [0, 418.5, 557.5, 721.5, 748];
  function t(x, y, s, c, anchor, size){ return '<text x="' + x + '" y="' + y + '" fill="' + c + '" font-size="' + (size || 22) + '" font-family="ui-monospace,Menlo,monospace" font-weight="700" text-anchor="' + (anchor || 'middle') + '">' + s + '</text>'; }
  function draw(){
    var s = '<rect x="0" y="0" width="748" height="748" fill="#000"/>';
    BLOCKS.forEach(function(k){ s += '<rect x="' + k[2] + '" y="' + k[3] + '" width="' + k[4] + '" height="' + k[5] + '" fill="' + k[1] + '"/>'; });
    if (document.getElementById('b').checked) BLOCKS.forEach(function(k){
      var dark = k[0] === 'red' || k[0] === 'blue' || k[0] === 'black';
      if (k[5] > 60) s += t(k[2] + k[4] / 2, k[3] + k[5] / 2 + 7, k[0], dark ? '#fff' : '#3c435c', 'middle', k[4] < 80 ? 14 : 22);
      else s += t(k[2] + k[4] / 2, 790, k[0], '#3c435c', 'middle', 15);
    });
    if (document.getElementById('m').checked){
      W.forEach(function(w, i){ s += t(X[i] + w / 2, -14, w + 'px', '#d6336c', 'middle', w < 80 ? 16 : 22); });
      H.forEach(function(h, i){ s += t(-12, Y[i] + h / 2 + (h < 40 ? 6 : 8), h + 'px', '#d6336c', 'end', h < 40 ? 16 : 22); });
      s += t(374, 830, 'gap: 9px  ·  total: 748px x 748px', '#5b6382', 'middle', 20);
    }
    if (document.getElementById('n').checked){
      LX.forEach(function(x, i){ s += '<line x1="' + x + '" y1="-6" x2="' + x + '" y2="754" stroke="#2f80ed" stroke-width="3" stroke-dasharray="8 6"/>' + t(x, 776, String(i + 1), '#2f80ed', 'middle', 20); });
      LY.forEach(function(y, i){ s += '<line x1="-6" y1="' + y + '" x2="754" y2="' + y + '" stroke="#2f80ed" stroke-width="3" stroke-dasharray="8 6"/>' + t(772, y + 7, String(i + 1), '#2f80ed', 'start', 20); });
    }
    document.getElementById('sv').innerHTML = s;
  }
  document.addEventListener('change', draw); draw();
<\/script>`
  },
  {
    title:'The gap is the line', height:500,
    note:'A small grid with no borders anywhere. Change the gap and the background colour: the lines are just the container showing through.',
    html:`
<div class="knobs">
  <label>gap <input type="range" min="0" max="24" value="9" data-css="#g|gap|px"><span class="val"></span></label>
  <label>container background
    <select data-css="#g|background-color"><option>#000000</option><option>#e72f24</option><option>#004592</option><option>#ffffff</option></select>
  </label>
</div>
<div class="stage">
  <div id="g" style="display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:2fr 1fr;width:300px;height:220px;border:none">
    <div style="background:#e72f24;grid-row:span 2"></div><div style="background:#f0f1ec;grid-column:span 2"></div>
    <div style="background:#f9d01e"></div><div style="background:#f0f1ec"></div>
  </div>
</div>
<pre class="readout" data-readout="#g"></pre>`
  }],
  notes:`
    <h3>Reading a design into a grid</h3>
    <p>Draw a line through every edge of every block, across the whole painting. Each distinct vertical position is a column line and each horizontal position a row line. Count the spaces between them and you have your tracks; every block is then just "from line a to line b".</p>
    <h3>Why the blocks fall into place</h3>
    <p>Only <code>white3</code> gets an exact position. The others are auto-placed in source order into the first free cells that fit their span, which is why the order of the nine divs matters.</p>`
});
