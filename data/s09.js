/* ===== Section 9 — Flexbox ===== */

PG.add({
  id:'s09-display-flex', section:'s09', slug:'display-flex', lesson:'9.1',
  title:'Display: Flex',
  blurb:'Set <code>display: flex</code> on a <b>container</b> and its direct children become flex items, laid out in a row with proper control over spacing and alignment. It replaces the old float / inline-block / table hacks.',
  tasks:[
    'Turn <code>.container</code> into a flex container so the boxes line up in a row.',
    'Add <code>gap: 10px</code> for even spacing between them — no margin fiddling.',
    'Give <code>.container &gt; *</code> a <code>flex-basis</code> so the items share the width.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Display Flex</title>
</head>
<body>
  <div class="container">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
  </div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  padding: 10px;
  background-color: gold;
  /* TODO 1: make this a flex container */
  /* TODO 2: gap between items */
}

.box {
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 24px;
}

/* TODO 3: give every child a flex-basis */
`},
  solution:{
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  padding: 10px;
  background-color: gold;
  display: flex;
  gap: 10px;
}

.box {
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 24px;
}

.container > * {
  flex-basis: 100px;
}
`},
  explore:[{
    title:'The full flexbox playground', height:640,
    note:'Every property that matters, on one panel. Change <code>flex-direction</code> first — everything else (justify vs align) flips meaning with it, which is the thing everyone gets confused by.',
    html:`
<div class="knobs">
  <label>flex-direction
    <select data-css="#c|flex-direction">
      <option>row</option><option>row-reverse</option>
      <option>column</option><option>column-reverse</option>
    </select>
  </label>
  <label>justify-content
    <select data-css="#c|justify-content">
      <option>flex-start</option><option>center</option><option>flex-end</option>
      <option>space-between</option><option>space-around</option><option>space-evenly</option>
    </select>
  </label>
  <label>align-items
    <select data-css="#c|align-items">
      <option>stretch</option><option selected>center</option>
      <option>flex-start</option><option>flex-end</option><option>baseline</option>
    </select>
  </label>
  <label>flex-wrap
    <select data-css="#c|flex-wrap"><option>nowrap</option><option>wrap</option></select>
  </label>
  <label>gap <input type="range" min="0" max="40" value="10" data-css="#c|gap|px"><span class="val"></span></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;align-items:center;gap:10px;height:220px;background:#eef1f9;border:2px dashed #b9c0d4;padding:10px">
    <div class="box" style="width:80px">1</div>
    <div class="box b" style="width:80px;height:90px">2</div>
    <div class="box c" style="width:80px;height:60px">3</div>
    <div class="box d" style="width:80px">4</div>
  </div>
</div>
<pre class="readout" data-readout="#c"></pre>
<pre class="readout" id="axis"></pre>
<script>
  var dir = document.querySelector('select[data-css="#c|flex-direction"]');
  function upd(){
    var row = dir.value.indexOf('row') === 0;
    document.getElementById('axis').textContent =
      'flex-direction: ' + dir.value + '\\n\\n' +
      'MAIN axis  is ' + (row ? 'HORIZONTAL' : 'VERTICAL  ') + '  -> justify-content moves items ' + (row ? 'left/right' : 'up/down') + '\\n' +
      'CROSS axis is ' + (row ? 'VERTICAL  ' : 'HORIZONTAL') + '  -> align-items    moves items ' + (row ? 'up/down' : 'left/right');
  }
  dir.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  }],
  notes:`
    <h3>Container vs item</h3>
    <p>Flexbox properties split into two groups, and mixing them up is the usual source of confusion:</p>
    <table>
      <tr><th>On the CONTAINER</th><th>On the ITEMS</th></tr>
      <tr><td><code>display: flex</code></td><td><code>flex-grow</code></td></tr>
      <tr><td><code>flex-direction</code></td><td><code>flex-shrink</code></td></tr>
      <tr><td><code>justify-content</code></td><td><code>flex-basis</code></td></tr>
      <tr><td><code>align-items</code></td><td><code>flex</code> (all three)</td></tr>
      <tr><td><code>flex-wrap</code>, <code>gap</code></td><td><code>align-self</code>, <code>order</code></td></tr>
    </table>
    <h3>The one thing to remember</h3>
    <p><b>justify-content</b> works along the main axis, <b>align-items</b> along the cross axis. With <code>flex-direction: row</code> the main axis is horizontal. Switch to <code>column</code> and they swap over.</p>
    <h3>Centre anything, forever</h3>
    <pre>.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}</pre>`
});


PG.add({
  id:'s09-flex-direction', section:'s09', slug:'flex-direction', lesson:'9.2',
  title:'Flex Direction & Sizing',
  blurb:'<code>flex-direction</code> chooses which way items flow. <code>flex-basis</code> sets their starting size <em>along that direction</em> — so it means width in a row, and height in a column.',
  tasks:[
    'Make <code>.container</code> an <b>inline-flex</b> container so it only takes up as much width as its contents.',
    'Set <code>flex-direction: column</code> so the items stack top to bottom.',
    'Give every child a <code>flex-basis</code> of <code>100px</code> — because the direction is a column, that sets their height.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Flex Direction</title>
</head>
<body>
  <div class="container">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
  </div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  color: white;
  border: 5px solid gold;
  /* TODO 1: inline-flex */
  /* TODO 2: direction column */
}

.box {
  background-color: #333;
  padding: 10px 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #888;
}

/* TODO 3: flex-basis 100px on every child */
`},
  solution:{
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.container {
  color: white;
  border: 5px solid gold;
  display: inline-flex;
  flex-direction: column;
}

.box {
  background-color: #333;
  padding: 10px 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #888;
}

.container > * {
  flex-basis: 100px;
}
`},
  explore:[
  {
    title:'flex-grow, shrink and basis', height:560,
    note:'These three are what <code>flex: 1</code> is shorthand for. Give box 2 a bigger grow value and watch it eat the leftover space.',
    html:`
<div class="knobs">
  <label>box 2 flex-grow <input type="range" min="0" max="4" value="0" data-css="#two|flex-grow"><span class="val"></span></label>
  <label>box 2 flex-basis <input type="range" min="60" max="260" value="100" data-css="#two|flex-basis|px"><span class="val"></span></label>
  <label>all others grow <input type="range" min="0" max="3" value="0" data-css="#one,#three|flex-grow"><span class="val"></span></label>
  <label>container width <input type="range" min="300" max="700" value="620" data-css="#c|width|px"><span class="val"></span></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;gap:8px;width:620px;background:#eef1f9;border:2px dashed #b9c0d4;padding:10px">
    <div class="box" id="one" style="flex-basis:100px">1</div>
    <div class="box b" id="two" style="flex-basis:100px">2</div>
    <div class="box c" id="three" style="flex-basis:100px">3</div>
  </div>
</div>
<pre class="readout" data-readout="#two"></pre>
<p class="note"><b>flex-grow</b> — how much of the LEFTOVER space this item claims, as a share. Everyone on 1 = equal split. One item on 2 while others are on 1 = it gets double.<br>
<b>flex-basis</b> — the size it starts at before growing or shrinking.<br>
<b>flex-shrink</b> — how eagerly it gives space up when there is not enough. Default 1.<br>
<code>flex: 1</code> is shorthand for <code>flex-grow: 1; flex-shrink: 1; flex-basis: 0;</code></p>`
  },
  {
    title:'Row vs column — the axis flip', height:480,
    note:'The same two properties, side by side, in both directions. This is the mental model worth locking in.',
    html:`
<div class="knobs">
  <label>justify-content
    <select id="j">
      <option>flex-start</option><option selected>center</option><option>flex-end</option><option>space-between</option>
    </select>
  </label>
  <label>align-items
    <select id="a">
      <option>flex-start</option><option selected>center</option><option>flex-end</option><option>stretch</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:14px">
  <div style="flex:1">
    <h4>flex-direction: row</h4>
    <div id="r" style="display:flex;height:180px;background:#eef1f9;border:2px dashed #b9c0d4;padding:8px;gap:6px">
      <div class="box" style="width:52px">1</div><div class="box b" style="width:52px">2</div><div class="box c" style="width:52px">3</div>
    </div>
  </div>
  <div style="flex:1">
    <h4>flex-direction: column</h4>
    <div id="cl" style="display:flex;flex-direction:column;height:180px;background:#eef1f9;border:2px dashed #b9c0d4;padding:8px;gap:6px">
      <div class="box" style="width:52px">1</div><div class="box b" style="width:52px">2</div><div class="box c" style="width:52px">3</div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var j = document.getElementById('j'), a = document.getElementById('a');
  function upd(){
    ['r','cl'].forEach(function(id){
      var el = document.getElementById(id);
      el.style.justifyContent = j.value;
      el.style.alignItems = a.value;
    });
    document.getElementById('ro').textContent =
      'justify-content: ' + j.value + ';   /* row: left-right   |  column: up-down   */\\n' +
      'align-items:     ' + a.value + ';   /* row: up-down      |  column: left-right */';
  }
  j.addEventListener('change', upd); a.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>flex-basis is direction-aware</h3>
    <ul>
      <li><code>flex-direction: row</code> → <code>flex-basis</code> behaves like <b>width</b>.</li>
      <li><code>flex-direction: column</code> → <code>flex-basis</code> behaves like <b>height</b>.</li>
    </ul>
    <h3>flex vs inline-flex</h3>
    <p><code>display: flex</code> makes the container a block — it takes the full width available. <code>display: inline-flex</code> makes it shrink-wrap to its contents, so it can sit inline beside other things.</p>
    <h3>The shorthand</h3>
    <pre>flex: 1;        /* grow 1, shrink 1, basis 0  — "share everything equally" */
flex: 0 0 200px; /* don't grow, don't shrink, stay 200px */</pre>`
});


PG.add({
  id:'s09-pricing', section:'s09', slug:'pricing-table', lesson:'9.3', project:true,
  title:'Flexbox Pricing Table',
  blurb:'Three pricing cards, equal width, centred on the page both ways — the classic flexbox exercise.',
  tasks:[
    'Make <code>.pricing-container</code> a flex container and centre the cards <b>horizontally</b> and <b>vertically</b>.',
    'Give it <code>height: 100vh</code> so vertical centring has room to work.',
    'Give each <code>.pricing-plan</code> <code>flex: 1</code> so they share the space equally, plus a <code>max-width</code> so they do not get silly on a big screen.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pricing Table</title>
</head>
<body>
  <div class="pricing-container">
    <div class="pricing-plan">
      <h2>Free</h2>
      <p class="price">£0</p>
      <ul>
        <li>1 project</li>
        <li>Community support</li>
      </ul>
      <button>Choose</button>
    </div>

    <div class="pricing-plan">
      <h2>Pro</h2>
      <p class="price">£12</p>
      <ul>
        <li>Unlimited projects</li>
        <li>Email support</li>
      </ul>
      <button>Choose</button>
    </div>

    <div class="pricing-plan">
      <h2>Team</h2>
      <p class="price">£30</p>
      <ul>
        <li>Everything in Pro</li>
        <li>10 seats</li>
      </ul>
      <button>Choose</button>
    </div>
  </div>
</body>
</html>`,
css:`* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 0;
  background: #eef1f9;
}

.pricing-container {
  /* TODO 1: flex, centred both ways */
  /* TODO 2: full screen height */
  gap: 2rem;
  padding: 2rem;
}

.pricing-plan {
  /* TODO 3: flex: 1 and a max-width */
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
}

ul {
  list-style: none;
  padding: 0;
  color: #667;
}

button {
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  background: #5b9cff;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
`},
  solution:{
css:`* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 0;
  background: #eef1f9;
}

.pricing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 2rem;
  padding: 2rem;
}

.pricing-plan {
  flex: 1;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
}

ul {
  list-style: none;
  padding: 0;
  color: #667;
}

button {
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  background: #5b9cff;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
`},
  notes:`
    <h3>vh and vw</h3>
    <ul>
      <li><code>100vh</code> = 100% of the viewport <b>height</b>. <code>50vh</code> = half the screen tall.</li>
      <li><code>100vw</code> = 100% of the viewport <b>width</b>.</li>
    </ul>
    <p>Why <code>height: 100vh</code> matters here: <code>align-items: center</code> centres items within the container's height. If the container is only as tall as its contents, there is nothing to centre inside.</p>
    <h3>Go further</h3>
    <ul>
      <li>Add <code>flex-wrap: wrap</code> and a media query so the cards stack on a phone.</li>
      <li>Make the middle plan stand out: <code>transform: scale(1.06)</code> and a stronger shadow.</li>
      <li>Use <code>flex-direction: column</code> inside each card to pin the button to the bottom with <code>margin-top: auto</code> — a genuinely useful trick.</li>
    </ul>`
});
