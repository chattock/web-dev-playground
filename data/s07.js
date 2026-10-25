/* ===== Section 7 — Intermediate CSS ===== */

PG.add({
  id:'s07-cascade', index:43, udemyId:37350528, minutes:25, section:'s07', slug:'cascade', lesson:'7.1',
  title:'The Cascade & Specificity',
  blurb:'When two rules touch the same element, which wins? The browser weighs four things: <b>position</b> (later beats earlier), <b>specificity</b> (id &gt; class &gt; element), <b>type</b> (inline beats stylesheets), and <b>importance</b> (<code>!important</code> trumps everything).',
  tasks:[
    'The nested boxes should go purple → blue → red from the outside in. Add rules specific enough to beat <code>.box</code>.',
    'Paragraphs are yellow, but the ones with <code>class="white-text"</code> should be white. Add a rule that wins.',
    'Then try moving your <code>.white-text</code> rule <em>above</em> the <code>p</code> rule — does it still work? Why?'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Cascade</title>
</head>
<body>
  <div id="outer-box" class="box">
    <div class="box">
      <p>Yellow Text</p>
      <div class="box inner-box">
        <p class="white-text">White Text</p>
      </div>
    </div>
    <div class="box">
      <p>Yellow Text</p>
      <div class="box inner-box">
        <p class="white-text">White Text</p>
      </div>
    </div>
  </div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
}

/* TODO 1: #outer-box should be purple */

.box {
  background-color: blue;
  padding: 10px;
}

/* TODO 2: .inner-box should be red */

p {
  color: yellow;
}

/* TODO 3: .white-text should be white */
`},
  solution:{
css:`body {
  font-family: sans-serif;
}

#outer-box {
  background-color: purple;
}

.box {
  background-color: blue;
  padding: 10px;
}

.inner-box {
  background-color: red;
}

p {
  color: yellow;
}

.white-text {
  color: white;
}
`},
  explore:[
  {
    title:'Specificity showdown', height:480,
    note:'Every rule below targets the same heading. Switch them on and off — the most specific always wins, no matter what order they are written in.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="c1" checked> <span class="tag">h1</span> → teal (element = 1)</label>
  <label><input type="checkbox" id="c2" checked> <span class="tag">.title</span> → orange (class = 10)</label>
  <label><input type="checkbox" id="c3" checked> <span class="tag">#main</span> → crimson (id = 100)</label>
  <label><input type="checkbox" id="c4"> <span class="tag">!important</span> → teal</label>
</div>
<div class="stage">
  <h1 id="main" class="title" style="margin:0">Who wins?</h1>
</div>
<pre class="readout" id="ro"></pre>
<style id="rules"></style>
<p class="note"><b>Rough scoring:</b> inline = 1000, id = 100, class/attribute/pseudo-class = 10, element = 1. Add them up; highest total wins. <code>!important</code> sidesteps the whole system — which is why reaching for it usually means something has gone wrong.</p>
<script>
  var ids = ['c1','c2','c3','c4'];
  var css = {
    c1:'h1 { color: teal; }',
    c2:'.title { color: orange; }',
    c3:'#main { color: crimson; }',
    c4:'h1 { color: teal !important; }'
  };
  var score = { c1:1, c2:10, c3:100, c4:10000 };
  function upd(){
    var on = ids.filter(function(i){ return document.getElementById(i).checked; });
    document.getElementById('rules').textContent = on.map(function(i){ return css[i]; }).join('\\n');
    var best = null;
    on.forEach(function(i){ if (!best || score[i] > score[best]) best = i; });
    var lines = on.map(function(i){
      return (i === best ? '  WINNER  ' : '          ') + css[i] +
             '   /* ' + (score[i] === 10000 ? '!important' : score[i] + ' points') + ' */';
    });
    document.getElementById('ro').textContent =
      (lines.length ? lines.join('\\n') : '  (nothing on — browser default)') +
      '\\n\\ncomputed colour: ' + getComputedStyle(document.getElementById('main')).color;
  }
  ids.forEach(function(i){ document.getElementById(i).addEventListener('change', function(){ setTimeout(upd,10); }); });
  setTimeout(upd, 40);
<\/script>`
  },
  {
    title:'Position in the file matters', height:370,
    note:'Two rules with <b>identical</b> specificity. Now order is the tie-breaker — the later one wins.',
    html:`
<div class="knobs">
  <label>order:
    <select id="ord">
      <option value="ab">.a then .b</option>
      <option value="ba">.b then .a</option>
    </select>
  </label>
</div>
<div class="stage"><h2 id="t" class="a b" style="margin:0">Same specificity — order decides</h2></div>
<pre class="readout" id="ro"></pre>
<style id="rules"></style>
<script>
  var o = document.getElementById('ord');
  function upd(){
    var a = '.a { color: seagreen; }', b = '.b { color: hotpink; }';
    var txt = o.value === 'ab' ? a + '\\n' + b : b + '\\n' + a;
    document.getElementById('rules').textContent = txt;
    document.getElementById('ro').textContent = txt + '\\n\\nlast one wins: ' +
      getComputedStyle(document.getElementById('t')).color;
  }
  o.addEventListener('change', function(){ setTimeout(upd, 10); }); setTimeout(upd, 40);
<\/script>`
  }],
  notes:`
    <h3>The four weights, weakest first</h3>
    <ol>
      <li><b>Position</b> — a rule written later beats an identical one written earlier.</li>
      <li><b>Specificity</b> — element (1) &lt; class / attribute (10) &lt; id (100) &lt; inline (1000).</li>
      <li><b>Type</b> — inline styles beat internal and external stylesheets.</li>
      <li><b>Importance</b> — <code>!important</code> beats the lot. Avoid it.</li>
    </ol>
    <h3>Debugging the cascade</h3>
    <p>In Chrome DevTools, click an element and look at the Styles panel: losing rules appear with a <s>strikethrough</s>. That tells you instantly what beat what.</p>`
});


PG.add({
  id:'s07-combining', index:44, udemyId:37350562, minutes:23, section:'s07', slug:'combining-selectors', lesson:'7.2',
  title:'Combining Selectors',
  blurb:'Selectors can be joined to be more precise: a <b>group</b> (comma), a <b>child</b> (<code>&gt;</code>), a <b>descendant</b> (space), or <b>chained</b> (no space at all).',
  tasks:[
    'Turn both <code>h1</code> and <code>h2</code> blueviolet with <b>one</b> grouped rule.',
    'Turn paragraphs that are <b>direct children</b> of <code>.box</code> firebrick.',
    'Turn list items <b>anywhere inside</b> <code>.box</code> blue.',
    'Turn <code>li</code> elements that <b>also</b> have <code>class="done"</code> green.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Combining Selectors</title>
</head>
<body>
  <h1>To Do List</h1>
  <h2>Monday</h2>

  <div class="box">
    <p class="done">Do these things today!</p>
    <ul class="list">
      <li>Wash Clothes</li>
      <li class="done">Read</li>
      <li class="done">Maths Questions</li>
    </ul>
  </div>

  <p>The best preparation for tomorrow is doing your best today.</p>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
}

/* TODO 1: group — h1 and h2 blueviolet */

/* TODO 2: child — p directly inside .box firebrick */

/* TODO 3: descendant — li anywhere inside .box blue */

/* TODO 4: chained — li that also has .done green */
`},
  solution:{
css:`body {
  font-family: sans-serif;
}

h1, h2 {
  color: blueviolet;
}

.box > p {
  color: firebrick;
}

.box li {
  color: blue;
}

li.done {
  color: green;
}
`},
  explore:[{
    title:'Combinator lab', height:580,
    note:'Pick a combinator and watch which elements it catches. The difference between <code>&gt;</code> and a plain space is the one that trips everyone up.',
    html:`
<div class="knobs">
  <label>selector
    <select id="sel">
      <option value=".box p">.box p — descendant (any depth)</option>
      <option value=".box > p">.box &gt; p — child (one level only)</option>
      <option value="h1, h2">h1, h2 — group</option>
      <option value="li.done">li.done — chained (both true)</option>
      <option value="li .done">li .done — note the space!</option>
      <option value=".box li">.box li — descendant</option>
    </select>
  </label>
  <span class="tag" id="count"></span>
</div>
<div class="stage" id="stage" style="font-size:13px">
  <h1 style="font-size:20px;margin:0 0 6px">To Do List</h1>
  <h2 style="font-size:16px;margin:0 0 10px">Monday</h2>
  <div class="box" style="border:2px dashed #b9c0d4;padding:10px;background:none;color:inherit;text-align:left;font-weight:400">
    <div style="font-size:10.5px;color:#8b92a8;margin-bottom:6px">.box</div>
    <p style="margin:0 0 8px">direct child paragraph</p>
    <div style="border:2px dotted #d8dce8;padding:8px">
      <div style="font-size:10.5px;color:#8b92a8">a nested div</div>
      <p style="margin:4px 0 0">paragraph nested TWO levels deep</p>
    </div>
    <ul style="margin:10px 0 0">
      <li>Wash clothes</li>
      <li class="done">Read <span class="done">(this span also has .done)</span></li>
      <li class="done">Maths questions</li>
    </ul>
  </div>
  <p style="margin:10px 0 0">a paragraph outside the box</p>
</div>
<pre class="readout" id="ro"></pre>
<style id="hi"></style>
<script>
  var sel = document.getElementById('sel');
  var why = {
    '.box p':'A space means "anywhere inside" — both paragraphs match, however deeply nested.',
    '.box > p':'The > means "a DIRECT child only" — the deeply nested paragraph is skipped.',
    'h1, h2':'A comma is just shorthand for writing two separate rules.',
    'li.done':'No space = the SAME element must be both an li and carry .done.',
    'li .done':'With a space it means a .done element INSIDE an li — that is the span, not the li itself.',
    '.box li':'Every list item inside .box, at any depth.'
  };
  function upd(){
    var s = sel.value;
    document.getElementById('hi').textContent =
      '#stage ' + s + ' { outline:3px solid #ff5c8a; outline-offset:2px; background:#ffe9ef; }';
    var n = document.querySelectorAll('#stage ' + s).length;
    document.getElementById('count').textContent = n + (n===1?' match':' matches');
    document.getElementById('ro').textContent = s + ' { ... }\\n\\n' + (why[s]||'');
  }
  sel.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The four combinators</h3>
    <table>
      <tr><th>Written</th><th>Name</th><th>Means</th></tr>
      <tr><td><code>h1, h2</code></td><td>Group</td><td>Both, as separate targets</td></tr>
      <tr><td><code>.box p</code></td><td>Descendant</td><td>A <code>p</code> anywhere inside <code>.box</code></td></tr>
      <tr><td><code>.box &gt; p</code></td><td>Child</td><td>A <code>p</code> that is a <em>direct</em> child</td></tr>
      <tr><td><code>li.done</code></td><td>Chained</td><td>One element that is both</td></tr>
    </table>
    <h3>The space is not decoration</h3>
    <p><code>li.done</code> and <code>li .done</code> mean completely different things. No space = same element. Space = something inside it. Read selectors right to left: <code>.box li</code> is "an <code>li</code>… that has a <code>.box</code> somewhere above it".</p>`
});


PG.add({
  id:'s07-positioning', index:45, udemyId:37350588, minutes:23, section:'s07', slug:'positioning', lesson:'7.3',
  title:'CSS Positioning',
  blurb:'<code>position</code> decides how <code>top</code>/<code>right</code>/<code>bottom</code>/<code>left</code> behave. <b>relative</b> nudges an element from where it would have been; <b>absolute</b> pulls it out of the flow and pins it inside the nearest positioned ancestor.',
  tasks:[
    'Give <code>.blue-box</code> <code>position: relative</code> with <code>top: 200px</code> and <code>left: 200px</code>.',
    'Give <code>.red-circle</code> <code>position: absolute</code> with <code>top: 150px</code> and <code>left: 250px</code>.',
    'Make the circle round with <code>border-radius: 50%</code>.',
    'Now delete <code>position: relative</code> from the blue box and watch where the circle jumps to. That is the whole lesson.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Positioning</title>
</head>
<body>
  <div class="blue-box">
    <div class="red-circle"></div>
  </div>
</body>
</html>`,
css:`.blue-box {
  background-color: blue;
  width: 500px;
  height: 300px;
  /* TODO 1: position + top + left */
}

.red-circle {
  width: 200px;
  height: 200px;
  background-color: red;
  /* TODO 2: position + top + left */
  /* TODO 3: make it a circle */
}
`},
  solution:{
css:`.blue-box {
  background-color: blue;
  width: 500px;
  height: 300px;
  position: relative;
  top: 200px;
  left: 200px;
}

.red-circle {
  width: 200px;
  height: 200px;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  top: 150px;
  left: 250px;
}
`},
  explore:[
  {
    title:'Position playground', height:580,
    note:'The orange box is the one you are moving. Switch its <code>position</code> and drag the offsets — watch whether the other boxes shuffle up to fill the gap.',
    html:`
<div class="knobs">
  <label>position
    <select data-css="#mover|position">
      <option>static</option><option selected>relative</option>
      <option>absolute</option><option>fixed</option><option>sticky</option>
    </select>
  </label>
  <label>top <input type="range" min="-40" max="120" value="20" data-css="#mover|top|px"><span class="val"></span></label>
  <label>left <input type="range" min="-40" max="220" value="40" data-css="#mover|left|px"><span class="val"></span></label>
  <label><input type="checkbox" id="anc" checked> parent is <span class="tag">position: relative</span></label>
</div>
<div class="stage" id="parent" style="position:relative;height:260px;background:#eef1f9;border:2px dashed #b9c0d4">
  <div style="font-size:10.5px;color:#8b92a8;position:absolute;top:4px;left:6px">the parent container</div>
  <div class="box b" style="margin:22px 0 8px;width:200px">box one</div>
  <div class="box" id="mover" style="width:200px;position:relative;top:20px;left:40px;background:#ff9f43;color:#fff">I am the mover</div>
  <div class="box" style="margin-top:8px;width:200px">box three</div>
</div>
<pre class="readout" data-readout="#mover"></pre>
<pre class="readout" id="explain"></pre>
<script>
  var sel = document.querySelector('select[data-css="#mover|position"]');
  var anc = document.getElementById('anc');
  var text = {
    static:'static is the default. top/left are IGNORED completely — the element sits wherever the normal flow puts it.',
    relative:'relative nudges the element from its normal spot, but its original space is still reserved — notice the gap it left behind.',
    absolute:'absolute lifts it out of the flow entirely, so the other boxes close the gap. It positions from the nearest ancestor that has a position set.',
    fixed:'fixed pins it to the browser window rather than the page, so it ignores scrolling entirely.',
    sticky:'sticky behaves like relative until you scroll past its offset, then it sticks like fixed.'
  };
  function upd(){
    document.getElementById('parent').style.position = anc.checked ? 'relative' : 'static';
    var extra = (sel.value === 'absolute')
      ? '\\n\\nParent position is ' + (anc.checked
          ? 'relative → the mover positions from the PARENT box.'
          : 'static → no positioned ancestor, so it positions from the PAGE instead. Tick the box to compare.')
      : '';
    document.getElementById('explain').textContent = text[sel.value] + extra;
  }
  sel.addEventListener('change', upd); anc.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  },
  {
    title:'z-index stacking', height:410,
    note:'When positioned boxes overlap, <code>z-index</code> decides who is on top. Higher number = closer to you.',
    html:`
<div class="knobs">
  <label>red <input type="range" min="0" max="3" value="1" data-css="#r|z-index"><span class="val"></span></label>
  <label>green <input type="range" min="0" max="3" value="2" data-css="#g|z-index"><span class="val"></span></label>
  <label>yellow <input type="range" min="0" max="3" value="3" data-css="#y|z-index"><span class="val"></span></label>
</div>
<div class="stage" style="position:relative;height:200px">
  <div id="r" class="box d" style="position:absolute;top:20px;left:20px;width:150px;height:110px;z-index:1">red</div>
  <div id="g" class="box b" style="position:absolute;top:50px;left:90px;width:150px;height:110px;z-index:2">green</div>
  <div id="y" class="box c" style="position:absolute;top:80px;left:160px;width:150px;height:110px;z-index:3">yellow</div>
</div>
<pre class="readout" data-readout="#r,#g,#y"></pre>
<p class="note"><code>z-index</code> only works on elements whose <code>position</code> is something other than <code>static</code>. That is the number one reason it "doesn't work".</p>`
  }],
  notes:`
    <h3>The five values</h3>
    <table>
      <tr><th>Value</th><th>Behaviour</th><th>Keeps its space?</th></tr>
      <tr><td><code>static</code></td><td>Default. Ignores top/left.</td><td>—</td></tr>
      <tr><td><code>relative</code></td><td>Nudged from its normal spot.</td><td>Yes</td></tr>
      <tr><td><code>absolute</code></td><td>Pinned inside nearest positioned ancestor.</td><td>No</td></tr>
      <tr><td><code>fixed</code></td><td>Pinned to the viewport; ignores scrolling.</td><td>No</td></tr>
      <tr><td><code>sticky</code></td><td>Relative until it hits your offset, then fixed.</td><td>Yes</td></tr>
    </table>
    <h3>The absolute + relative pairing</h3>
    <p>The classic pattern: parent gets <code>position: relative</code> (with no offsets), child gets <code>position: absolute</code>. The parent becomes the child's coordinate system. Forget the parent's <code>relative</code> and the child flies off to the corner of the whole page.</p>`
});


PG.add({
  id:'s07-flag', index:46, udemyId:37350652, minutes:18, section:'s07', slug:'flag-project', lesson:'7.4', project:true,
  title:'CSS Flag Project',
  blurb:'Build a flag out of nothing but positioned boxes — a proper test of the box model plus positioning.',
  tasks:[
    'Give <code>.flag</code> whatever it needs to become the positioning context for its children.',
    'Make <code>.circle</code> a 100px red circle centred in the flag.',
    'Then try a harder flag — see the Notes tab for suggestions.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Flag</title>
</head>
<body>
  <div class="flag">
    <div class="circle"></div>
  </div>
</body>
</html>`,
css:`body {
  background: #ddd;
  padding: 40px;
}

.flag {
  width: 300px;
  height: 200px;
  background-color: white;
  border: 1px solid #999;
  /* TODO: make this the positioning context */
}

.circle {
  /* TODO: a red circle, 100px, centred in the flag */
}
`},
  solution:{
css:`body {
  background: #ddd;
  padding: 40px;
}

.flag {
  width: 300px;
  height: 200px;
  background-color: white;
  border: 1px solid #999;
  position: relative;
}

.circle {
  width: 100px;
  height: 100px;
  background-color: #bc002d;
  border-radius: 50%;
  position: absolute;
  top: 50px;
  left: 100px;
}
`},
  notes:`
    <h3>The maths for centring</h3>
    <p>The flag is 300×200 and the circle is 100×100, so <code>left = (300 − 100) / 2 = 100px</code> and <code>top = (200 − 100) / 2 = 50px</code>.</p>
    <p>A slicker way that needs no maths at all:</p>
    <pre>.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}</pre>
    <h3>Harder flags to try</h3>
    <ul>
      <li><b>France / Italy</b> — three vertical stripes.</li>
      <li><b>Norway / Denmark</b> — an off-centre cross: two overlapping bars.</li>
      <li><b>Japan → South Korea</b> — the circle gets a lot more interesting.</li>
      <li><b>USA</b> — repeating stripes; a good excuse to try <code>repeating-linear-gradient</code>.</li>
    </ul>`
});
