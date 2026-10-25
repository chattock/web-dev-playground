/* ===== Section 10 — Grid ===== */

PG.add({
  id:'s10-display-grid', index:60, udemyId:37368434, minutes:15, section:'s10', slug:'display-grid', lesson:'10.1',
  title:'Display: Grid',
  blurb:'Grid is flexbox\'s two-dimensional sibling: you define rows <b>and</b> columns up front and drop items into the cells. Perfect for anything that is genuinely a grid — a chessboard, a gallery, a page layout.',
  tasks:[
    'Make <code>.container</code> a grid.',
    'Give it 8 equal columns and 8 equal rows using <code>1fr</code> for each track.',
    'Then shorten it with <code>repeat(8, 1fr)</code> — same result, far less typing.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chessboard</title>
</head>
<body>
  <div class="container">
    <div class="white"></div><div class="black"></div><div class="white"></div><div class="black"></div>
    <div class="black"></div><div class="white"></div><div class="black"></div><div class="white"></div>
    <div class="white"></div><div class="black"></div><div class="white"></div><div class="black"></div>
    <div class="black"></div><div class="white"></div><div class="black"></div><div class="white"></div>
  </div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  width: 400px;
  /* TODO 1: make it a grid */
  /* TODO 2: 4 equal columns and 4 equal rows */
}

.white {
  height: 100px;
  background-color: #f0d9b5;
}

.black {
  height: 100px;
  background-color: #b58863;
}
`},
  solution:{
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  width: 400px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.white {
  height: 100px;
  background-color: #f0d9b5;
}

.black {
  height: 100px;
  background-color: #b58863;
}
`},
  explore:[{
    title:'Grid track builder', height:600,
    note:'Type track lists straight into the boxes — try <code>1fr 2fr 1fr</code>, <code>repeat(4, 1fr)</code>, <code>200px 1fr</code>, <code>repeat(auto-fit, minmax(120px, 1fr))</code>.',
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
<p class="note"><b>fr</b> = one share of the free space. <b>repeat(n, x)</b> = n tracks of x. <b>minmax(a, b)</b> = never smaller than a, never bigger than b. <b>auto-fit + minmax</b> = a responsive gallery with no media queries at all — resize your browser window to see it.</p>
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
  }],
  notes:`
    <h3>Grid vs flexbox</h3>
    <table>
      <tr><th>Flexbox</th><th>Grid</th></tr>
      <tr><td>One dimension — a row <em>or</em> a column</td><td>Two dimensions — rows <em>and</em> columns</td></tr>
      <tr><td>Content-driven: items size themselves</td><td>Layout-driven: you define the tracks first</td></tr>
      <tr><td>Nav bars, button rows, centring</td><td>Page layouts, galleries, dashboards</td></tr>
    </table>
    <p>They are not rivals — a very normal setup is a grid page layout with flexbox inside each area.</p>
    <h3>The vocabulary</h3>
    <ul>
      <li><b>Track</b> — one row or one column.</li>
      <li><b>Cell</b> — where a row and column cross.</li>
      <li><b>Line</b> — the numbered edges between tracks; a 3-column grid has 4 vertical lines.</li>
      <li><b>Area</b> — a rectangle spanning several cells.</li>
    </ul>`
});


PG.add({
  id:'s10-grid-sizing', index:61, udemyId:37368474, minutes:24, section:'s10', slug:'grid-sizing', lesson:'10.2',
  title:'Grid Sizing',
  blurb:'Tracks can be fixed (<code>200px</code>), fractional (<code>1fr</code>), content-based (<code>auto</code>) or bounded (<code>minmax(400px, 5fr)</code>). Mixing them is where grid gets powerful.',
  tasks:[
    'Give the grid 2 rows and 2 columns where the second of each is <b>twice</b> the size of the first.',
    'Swap those for <code>repeat(2, 200px)</code> and add <code>grid-auto-rows: 300px</code> — then add a 5th item and watch where it lands.',
    'Try <code>200px minmax(400px, 5fr)</code> and drag the preview width — the second track flexes, the first never does.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Grid Sizing</title>
</head>
<body>
  <h1>Fractional Size Grid</h1>
  <div class="grid-container">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
    <div class="grid-item">4</div>
  </div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.grid-container {
  display: grid;
  /* TODO: rows and columns, second twice the first */
}

.grid-item {
  font-size: 3rem;
  background-color: darkviolet;
  border: 5px solid goldenrod;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
`},
  solution:{
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 1fr 2fr;
}

.grid-item {
  font-size: 3rem;
  background-color: darkviolet;
  border: 5px solid goldenrod;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
`},
  explore:[{
    title:'Track sizing units head to head', height:520,
    note:'The same six items, four different track recipes. Shrink the container and watch which ones cope.',
    html:`
<div class="knobs">
  <label>container width <input type="range" min="260" max="720" value="680" id="w"><span class="val" id="wv">680px</span></label>
</div>
<div class="stage" id="stage">
  <h4>repeat(3, 100px) — fixed, overflows when it runs out of room</h4>
  <div class="g" style="grid-template-columns:repeat(3,100px)"><div class="box">a</div><div class="box b">b</div><div class="box c">c</div></div>
  <h4>repeat(3, 1fr) — always shares the width evenly</h4>
  <div class="g" style="grid-template-columns:repeat(3,1fr)"><div class="box">a</div><div class="box b">b</div><div class="box c">c</div></div>
  <h4>200px 1fr — a fixed sidebar plus flexible content</h4>
  <div class="g" style="grid-template-columns:200px 1fr"><div class="box">sidebar</div><div class="box b">content</div></div>
  <h4>repeat(auto-fit, minmax(120px, 1fr)) — reflows on its own</h4>
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
      'px    — never changes, will overflow\\n' +
      'fr    — divides whatever space exists\\n' +
      'mixed — fixed where it must be, flexible everywhere else\\n' +
      'auto-fit + minmax — changes the NUMBER of columns as space allows';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The sizing units</h3>
    <table>
      <tr><th>Value</th><th>Means</th></tr>
      <tr><td><code>200px</code></td><td>Exactly that, always.</td></tr>
      <tr><td><code>1fr</code></td><td>One share of the leftover space.</td></tr>
      <tr><td><code>auto</code></td><td>As big as its content needs.</td></tr>
      <tr><td><code>minmax(200px, 1fr)</code></td><td>At least 200px, otherwise flexible.</td></tr>
      <tr><td><code>repeat(4, 1fr)</code></td><td>Four identical tracks.</td></tr>
      <tr><td><code>auto-fit</code> / <code>auto-fill</code></td><td>As many tracks as will fit.</td></tr>
    </table>
    <h3>The one-liner responsive gallery</h3>
    <pre>grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));</pre>
    <p>"As many columns as fit, each at least 200px, sharing any spare space." That single line replaces three media queries.</p>
    <h3>Implicit tracks</h3>
    <p>Add more items than you defined tracks for and grid invents new rows. <code>grid-auto-rows</code> controls how tall those invented rows are.</p>`
});


PG.add({
  id:'s10-grid-placement', index:62, udemyId:37368524, minutes:26, section:'s10', slug:'grid-placement', lesson:'10.3',
  title:'Grid Placement',
  blurb:'By default items fill the cells in order. <code>grid-column</code>, <code>grid-row</code> and the <code>grid-area</code> shorthand let you place them exactly, spanning as many tracks as you like.',
  tasks:[
    'Make the cowboy span <b>two columns</b>.',
    'Make the astronaut cover the whole second row (columns 1 to 3).',
    'Make the book fill the third column across <b>both</b> rows — try it with <code>grid-area</code> and also with <code>grid-row: span 2</code>.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Grid Placement</title>
</head>
<body>
  <div class="container">
    <div class="item cowboy">🤠</div>
    <div class="item astronaut">👨‍🚀</div>
    <div class="item book">📖</div>
  </div>
</body>
</html>`,
css:`body {
  margin: 0;
  font-family: sans-serif;
}

.container {
  height: 100vh;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr 1.5fr;
  grid-template-rows: 1fr 1fr;
}

.item {
  font-size: 4rem;
  color: white;
  background-color: blueviolet;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cowboy {
  background-color: #00b9ff;
  /* TODO 1: span two columns */
}

.astronaut {
  background-color: #03989e;
  /* TODO 2: cover the whole second row */
}

.book {
  background-color: #e58331;
  /* TODO 3: third column, both rows */
}
`},
  solution:{
css:`body {
  margin: 0;
  font-family: sans-serif;
}

.container {
  height: 100vh;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr 1.5fr;
  grid-template-rows: 1fr 1fr;
}

.item {
  font-size: 4rem;
  color: white;
  background-color: blueviolet;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cowboy {
  background-color: #00b9ff;
  grid-column: span 2;
}

.astronaut {
  background-color: #03989e;
  grid-area: 2 / 1 / 3 / 3;
}

.book {
  background-color: #e58331;
  grid-area: 1 / 3 / 3 / 4;
}
`},
  explore:[{
    title:'Place an item by grid lines', height:600,
    note:'The orange item is being placed by line numbers. Remember: a 4-column grid has <b>5</b> vertical lines, numbered from 1 on the left. <code>-1</code> means the last line.',
    html:`
<div class="knobs">
  <label>column start <input type="number" id="cs" value="2" min="1" max="5" style="width:52px"></label>
  <label>column end <input type="number" id="ce" value="4" min="1" max="5" style="width:52px"></label>
  <label>row start <input type="number" id="rs" value="1" min="1" max="4" style="width:52px"></label>
  <label>row end <input type="number" id="re" value="3" min="1" max="4" style="width:52px"></label>
</div>
<div class="stage">
  <div id="g" style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,66px);gap:6px;position:relative">
    <div class="ghost">1</div><div class="ghost">2</div><div class="ghost">3</div><div class="ghost">4</div>
    <div class="ghost">5</div><div class="ghost">6</div><div class="ghost">7</div><div class="ghost">8</div>
    <div class="ghost">9</div><div class="ghost">10</div><div class="ghost">11</div><div class="ghost">12</div>
    <div id="me" class="box" style="background:#ff9f43;grid-column:2 / 4;grid-row:1 / 3;z-index:2">me</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>.ghost{background:#eef1f9;border:1px dashed #c6cde0;border-radius:4px;display:flex;
  align-items:center;justify-content:center;color:#9aa2ba;font-size:12px}</style>
<script>
  var f = ['cs','ce','rs','re'].map(function(i){ return document.getElementById(i); });
  function upd(){
    var cs=f[0].value, ce=f[1].value, rs=f[2].value, re=f[3].value;
    var me = document.getElementById('me');
    me.style.gridColumn = cs + ' / ' + ce;
    me.style.gridRow = rs + ' / ' + re;
    document.getElementById('ro').textContent =
      '.me {\\n  grid-column: ' + cs + ' / ' + ce + ';\\n  grid-row: ' + rs + ' / ' + re + ';\\n}\\n\\n' +
      '/* the same thing as one shorthand: */\\n' +
      '.me { grid-area: ' + rs + ' / ' + cs + ' / ' + re + ' / ' + ce + '; }\\n' +
      '/*                row-start / col-start / row-end / col-end */\\n\\n' +
      'spanning ' + (ce - cs) + ' column(s) and ' + (re - rs) + ' row(s)\\n' +
      '/* could also be written: grid-column: span ' + (ce - cs) + '; */';
  }
  f.forEach(function(el){ el.addEventListener('input', upd); }); upd();
<\/script>`
  }],
  notes:`
    <h3>Line numbers, not track numbers</h3>
    <p>Tracks sit <em>between</em> lines. Four columns means five lines. So <code>grid-column: 2 / 4</code> starts at line 2 and ends at line 4 — covering two columns.</p>
    <h3>Three ways to say the same thing</h3>
    <pre>grid-column: 2 / 4;
grid-column: 2 / span 2;
grid-area: 1 / 2 / 3 / 4;   /* row-start / col-start / row-end / col-end */</pre>
    <h3>Negative numbers</h3>
    <p><code>-1</code> is the last line, so <code>grid-column: 1 / -1</code> means "the full width", no matter how many columns there are.</p>
    <h3>Bonus: order</h3>
    <p>Grid items also respect the <code>order</code> property, so you can rearrange them visually without touching the HTML.</p>`
});


PG.add({
  id:'s10-mondrian', index:63, udemyId:37368588, minutes:7, section:'s10', slug:'mondrian-project', lesson:'10.4', project:true,
  title:'Mondrian Project',
  blurb:'Recreate a Piet Mondrian painting with nothing but grid placement — the section\'s final boss.',
  tasks:[
    'Set up the grid tracks so the blocks land in roughly the right proportions.',
    'Place each coloured block using <code>grid-area</code> or <code>grid-column</code> / <code>grid-row</code>.',
    'The thick black lines are just the <code>gap</code> showing through a black background — no borders needed.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Mondrian</title>
</head>
<body>
  <div class="painting">
    <div class="a"></div>
    <div class="b"></div>
    <div class="c"></div>
    <div class="d"></div>
    <div class="e"></div>
    <div class="f"></div>
  </div>
</body>
</html>`,
css:`body {
  background: #ddd;
  padding: 30px;
  font-family: sans-serif;
}

.painting {
  width: 460px;
  height: 460px;
  background-color: black;
  display: grid;
  gap: 10px;
  /* TODO 1: define the tracks */
}

.painting > div {
  background-color: white;
}

/* TODO 2: place and colour the blocks */
`},
  solution:{
css:`body {
  background: #ddd;
  padding: 30px;
  font-family: sans-serif;
}

.painting {
  width: 460px;
  height: 460px;
  background-color: black;
  display: grid;
  gap: 10px;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 2fr 1fr 1fr;
}

.painting > div {
  background-color: white;
}

.a {
  grid-area: 1 / 1 / 2 / 3;
  background-color: #e72f24 !important;
}

.b {
  grid-area: 1 / 3 / 3 / 4;
}

.c {
  grid-area: 2 / 1 / 4 / 2;
  background-color: #f9d321 !important;
}

.d {
  grid-area: 2 / 2 / 3 / 3;
}

.e {
  grid-area: 3 / 2 / 4 / 4;
  background-color: #0e63b4 !important;
}

.f {
  display: none;
}
`},
  notes:`
    <h3>The trick with the black lines</h3>
    <p>Mondrian's heavy black lines are not borders — they are the container's black background showing through the <code>gap</code>. One <code>gap: 10px</code> gives you perfectly even lines everywhere, which borders never quite manage.</p>
    <h3>Working it out</h3>
    <p>Sketch the painting on paper first and number the grid lines. Then each block is just "row-start / column-start / row-end / column-end". Getting comfortable reading a design and turning it into line numbers is the actual skill here.</p>
    <h3>Go further</h3>
    <ul>
      <li>Try <code>grid-template-areas</code> instead — you literally draw the layout with names in strings.</li>
      <li>Make it responsive: change the track sizes inside a media query and the whole painting reflows.</li>
    </ul>`
});
