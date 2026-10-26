/* ===== Section 8 — Advanced CSS ===== */

PG.add({
  id:'s08-display', index:48, udemyId:37368052, minutes:12, section:'s08', slug:'display', kind:'build',
  title:'CSS Display',
  blurb:'<code>display</code> decides how an element takes part in the flow of the page. <b>block</b> takes the whole width, so neighbours go above and below; <b>inline</b> flows like a word and ignores width and height; <b>inline-block</b> flows like a word but keeps its size; <b>none</b> removes the element entirely.',
  tasks:[
    'Change <b>only</b> the <code>display</code> values; leave widths, heights and colours alone. Part 1 is a row of three 200 × 200 squares. The red box ignores its size because it is <code>inline</code>: switch it to <code>inline-block</code>.',
    'The green box is <code>block</code>, so it claims a whole row for itself. Make it <code>inline-block</code> too. Now all three sit side by side. Switch the preview to Phone 375 and the row wraps when it runs out of room.',
    'Part 2 is a column: set all three to <code>block</code>. Each takes its own row and keeps its 200 × 200 size.',
    'Try <code>display: none</code> on the green box: it disappears and the others close the gap.',
    'Back in the row, look closely: there is a thin gap between the squares. It is the line break between the tags in the HTML, drawn like the space between two words.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Display Property Example</title>
  <style>
    /* Only change the display values. */
    p {
      color: white;
    }

    .red {
      display: inline;
      width: 200px;
      height: 200px;
      background-color: red;
    }

    .green {
      display: block;
      width: 200px;
      height: 200px;
      background-color: green;
    }

    .blue {
      display: inline-block;
      width: 200px;
      height: 200px;
      background-color: blue;
    }
  </style>
</head>
<body>
  <h1>CSS Display Property</h1>
  <p class="red">Red Paragraph</p>
  <p class="green">Green Paragraph</p>
  <p class="blue">Blue Paragraph</p>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Display Property Example</title>
  <style>
    /* Part 1, a row: all three are inline-block (shown below).
       Part 2, a column: change all three to display: block. */
    p {
      color: white;
    }

    .red {
      display: inline-block;
      width: 200px;
      height: 200px;
      background-color: red;
    }

    .green {
      display: inline-block;
      width: 200px;
      height: 200px;
      background-color: green;
    }

    .blue {
      display: inline-block;
      width: 200px;
      height: 200px;
      background-color: blue;
    }
  </style>
</head>
<body>
  <h1>CSS Display Property</h1>
  <p class="red">Red Paragraph</p>
  <p class="green">Green Paragraph</p>
  <p class="blue">Blue Paragraph</p>
</body>
</html>`},
  explore:[
  {
    title:'The four display values', height:520,
    note:'Every box below is 120 × 70 with the same CSS apart from <code>display</code>. Switch it and watch what survives: <b>inline</b> throws the width and height away completely.',
    html:`
<div class="knobs">
  <label>display
    <select data-css=".demo|display">
      <option>block</option>
      <option selected>inline-block</option>
      <option>inline</option>
      <option>none</option>
    </select>
  </label>
  <label>width <input type="range" min="60" max="240" value="120" data-css=".demo|width|px"><span class="val"></span></label>
  <label>height <input type="range" min="30" max="140" value="70" data-css=".demo|height|px"><span class="val"></span></label>
</div>
<div class="stage">
  Text before…
  <span class="demo box" style="display:inline-block;width:120px;height:70px">one</span>
  <span class="demo box b" style="display:inline-block;width:120px;height:70px">two</span>
  <span class="demo box c" style="display:inline-block;width:120px;height:70px">three</span>
  …text after.
</div>
<pre class="readout" data-readout=".demo"></pre>
<pre class="readout" id="explain"></pre>
<script>
  var sel = document.querySelector('select[data-css=".demo|display"]');
  var text = {
    block:'block: each box takes a whole row. Width and height work. The default for div, p, h1, ul, li, footer...',
    'inline-block':'inline-block: the boxes sit side by side like words, and width and height still apply. Notice the small gaps: the spaces between the tags in the HTML.',
    inline:'inline: the box flows inside the sentence like a word. width and height are ignored. The default for span, a, strong, em...',
    none:'none: the element is gone and takes up no space at all (visibility: hidden would leave a hole instead).'
  };
  function upd(){ document.getElementById('explain').textContent = text[sel.value]; }
  sel.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  },
  {
    title:'A span inside a paragraph', height:400,
    note:'The lecture\'s example: <code>&lt;p&gt;Hello &lt;span&gt;Beautiful&lt;/span&gt; World&lt;/p&gt;</code>. A span is inline by default, so it lives inside the line of text. Change its display and see the sentence react.',
    html:`
<div class="knobs">
  <label>span display
    <select data-css="#s|display"><option selected>inline</option><option>inline-block</option><option>block</option><option>none</option></select>
  </label>
  <label>span width <input type="range" min="40" max="260" value="140" data-css="#s|width|px"><span class="val"></span></label>
</div>
<div class="stage">
  <p style="margin:0;font-size:20px">Hello <span id="s" style="background:#ffcf6b;padding:2px 4px;width:140px">Beautiful</span> World</p>
</div>
<pre class="readout" data-readout="#s"></pre>
<pre class="readout" id="explain"></pre>
<script>
  var sel = document.querySelector('select[data-css="#s|display"]');
  var text = {
    inline:'inline: the span is part of the sentence and the width slider does nothing.',
    'inline-block':'inline-block: still inside the sentence, but now the width applies.',
    block:'block: the span breaks the line. "Beautiful" gets a row of its own, splitting the sentence in three.',
    none:'none: the word is removed, as if it had never been written.'
  };
  function upd(){ document.getElementById('explain').textContent = text[sel.value]; }
  sel.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  }],
  quiz:[
    { q:'Which display value ignores <code>width</code> and <code>height</code>?', options:['block','inline','inline-block','none'], answer:1, why:'An inline element is only as big as its content, like a word in a sentence.' },
    { q:'Which value lets boxes sit side by side <b>and</b> keep their width and height?', options:['block','inline','inline-block','none'], answer:2, why:'inline-block flows like inline content but sizes like a block.' },
    { q:'What is the difference between <code>display: none</code> and <code>visibility: hidden</code>?', options:['None, they are identical','display: none removes the element and its space; visibility: hidden keeps the space','visibility: hidden removes the space','display: none only hides text'], answer:1, why:'display: none takes the element out of the layout entirely, so the neighbours close the gap.' },
    { q:'What is the default display of a <code>&lt;span&gt;</code>?', options:['block','inline','inline-block','none'], answer:1, why:'span is the classic inline element, which is why it can style part of a sentence without breaking the line.' },
  ],
  notes:`
    <h3>Defaults worth knowing</h3>
    <table>
      <tr><th>Default</th><th>Elements</th></tr>
      <tr><td><code>block</code></td><td><code>div</code>, <code>p</code>, <code>h1</code>–<code>h6</code>, <code>ul</code>, <code>li</code>, <code>section</code>, <code>footer</code></td></tr>
      <tr><td><code>inline</code></td><td><code>span</code>, <code>a</code>, <code>strong</code>, <code>em</code>, <code>img</code></td></tr>
    </table>
    <h3>Where this leads</h3>
    <p>inline-block is the simplest way to put boxes in a row. Flexbox (section 9) does the same job with far more control, without the stray gaps.</p>`
});


PG.add({
  id:'s08-float', index:49, udemyId:37368102, minutes:12, section:'s08', slug:'float', kind:'build',
  title:'CSS Float',
  blurb:'<code>float: left</code> or <code>right</code> pushes an element to that side of its container and lets the text that follows wrap around it, like a photo in a magazine column. <code>clear</code> goes on a later element to make it drop below the floats instead of riding up beside them.',
  tasks:[
    'Float the images: <code>img { float: left; }</code>. Each paragraph now wraps around its picture instead of starting below it.',
    'Float <code>.cat</code> to the <b>left</b> and <code>.dog</code> to the <b>right</b>, so the two blocks sit at opposite edges of the page.',
    'The footer is now pulled up between the two floats. Add <code>clear: both</code> to the <b>footer</b> (not to the floats) so it drops below them and spans the page again.',
    'The two blocks end up different heights because their texts differ in length. That is expected. Press <b>↗ open</b> to see the layout with more room.',
    'Try <code>clear: left</code> instead of <code>both</code>: the footer only clears the cat, so it slides up beside the taller dog block when the dog block is longer.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Float</title>
  <style>
    div {
      display: inline-block;
      width: 40%;
    }

    p {
      font-size: 1.2em;
    }

    .cat {
      background-color: aquamarine;
      /* TODO 2: float this block to the left */
    }

    .dog {
      background-color: coral;
      /* TODO 2: float this block to the right */
    }

    img {
      /* TODO 1: let the text wrap around the images */
    }

    footer {
      text-align: center;
      background-color: blueviolet;
      /* TODO 3: keep the footer below both blocks */
    }
  </style>
</head>
<body>
  <div class="cat">
    <h2>CatCSS</h2>
    <img src="https://picsum.photos/id/40/110/120" alt="a cat's nose, very close up" />
    <p class="first-paragraph">
      Naps in a sunbeam until noon, knocks every pen off the desk, ignores
      its name entirely and then sits on the one book you are trying to read.
      Purrs at full volume at four in the morning.
    </p>
  </div>
  <div class="dog">
    <h2>DogCSS</h2>
    <img src="https://picsum.photos/id/237/150/120" alt="a black puppy looking up" />
    <p class="second-paragraph">
      Greets you as if you had been away for a year after five minutes at
      the shops. Believes every sock is a present, every walk is the best
      walk ever and every sandwich is at least partly theirs. Will fetch the
      ball exactly once, then lie on it and look proud.
    </p>
  </div>

  <footer>Copyright. This is the footer</footer>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Float</title>
  <style>
    div {
      display: inline-block;
      width: 40%;
    }

    p {
      font-size: 1.2em;
    }

    .cat {
      background-color: aquamarine;
      float: left;
    }

    .dog {
      background-color: coral;
      float: right;
    }

    img {
      float: left;
    }

    footer {
      text-align: center;
      background-color: blueviolet;
      clear: both;
    }
  </style>
</head>
<body>
  <div class="cat">
    <h2>CatCSS</h2>
    <img src="https://picsum.photos/id/40/110/120" alt="a cat's nose, very close up" />
    <p class="first-paragraph">
      Naps in a sunbeam until noon, knocks every pen off the desk, ignores
      its name entirely and then sits on the one book you are trying to read.
      Purrs at full volume at four in the morning.
    </p>
  </div>
  <div class="dog">
    <h2>DogCSS</h2>
    <img src="https://picsum.photos/id/237/150/120" alt="a black puppy looking up" />
    <p class="second-paragraph">
      Greets you as if you had been away for a year after five minutes at
      the shops. Believes every sock is a present, every walk is the best
      walk ever and every sandwich is at least partly theirs. Will fetch the
      ball exactly once, then lie on it and look proud.
    </p>
  </div>

  <footer>Copyright. This is the footer</footer>
</body>
</html>`},
  explore:[
  {
    title:'Float and clear sandbox', height:540,
    note:'Float the image and watch the text wrap. Then set the footer\'s <code>clear</code> to none and see it dragged up beside the float: that is the problem <code>clear</code> exists to fix.',
    html:`
<div class="knobs">
  <label>image float
    <select data-css="#img|float"><option>none</option><option selected>left</option><option>right</option></select>
  </label>
  <label>image margin <input type="range" min="0" max="30" value="12" data-css="#img|margin|px"><span class="val"></span></label>
  <label>footer clear
    <select data-css="#ft|clear"><option value="none">none</option><option value="both" selected>both</option><option value="left">left</option><option value="right">right</option></select>
  </label>
</div>
<div class="stage">
  <div id="img" style="float:left;margin:12px;width:110px;height:80px;background:#5b9cff;color:#fff;
       display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:12px;font-weight:700">image</div>
  <p style="margin:0">Cats are small carnivorous mammals and the only domesticated species in their family.
  They are kept for company and for their skill at catching mice. Their night vision and sense of
  smell are excellent, and they can hear sounds far too faint for human ears.</p>
  <div id="ft" style="clear:both;background:#8e5bff;color:#fff;padding:8px;text-align:center;border-radius:6px;margin-top:8px;font-size:13px">
    the footer: it should sit below everything
  </div>
</div>
<pre class="readout" data-readout="#img,#ft"></pre>
<p class="note"><b>Float is for wrapping text.</b> It was invented for pictures inside articles, then stretched into whole-page layouts for years. You will still meet that in older code, but for layout use Flexbox or Grid.</p>`
  },
  {
    title:'clear: left, right or both', height:470,
    note:'Two floats of different heights: a short one on the left and a tall one on the right. Each <code>clear</code> value only drops below floats on its own side.',
    html:`
<div class="knobs">
  <label>footer clear
    <select id="c"><option>none</option><option>left</option><option>right</option><option selected>both</option></select>
  </label>
</div>
<div class="stage" id="st">
  <div style="float:left;width:38%;height:70px;background:#7ee0a8;border-radius:6px;padding:6px;font-size:12px">float: left (short)</div>
  <div style="float:right;width:38%;height:150px;background:#ff9aa2;border-radius:6px;padding:6px;font-size:12px">float: right (tall)</div>
  <div id="ft" style="background:#8e5bff;color:#fff;padding:8px;text-align:center;border-radius:6px;font-size:13px">footer</div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var c = document.getElementById('c');
  var why = {
    none:'none: the footer ignores both floats and slides up to the top, squeezed between them.',
    left:'left: it drops below the short left float only, so it can still sit beside the tall right one.',
    right:'right: it drops below the tall right float, which happens to be lower than the left one too.',
    both:'both: it drops below every float on either side. The safe choice for a footer.'
  };
  function upd(){
    document.getElementById('ft').style.clear = c.value;
    document.getElementById('ro').textContent = 'footer { clear: ' + c.value + '; }\\n\\n' + why[c.value];
  }
  c.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'The collapsing parent', height:430,
    note:'A container whose only children are floated has nothing in the normal flow to give it height, so it collapses to zero (the dashed border shrinks to a line). Two fixes: clear an element after the floats, or the modern <code>display: flow-root</code> (extra, not in the lecture).',
    html:`
<div class="knobs">
  <label>fix
    <select id="fix">
      <option value="none">no fix</option>
      <option value="clear">an empty div with clear: both after the floats</option>
      <option value="flow">display: flow-root on the container (extra)</option>
    </select>
  </label>
</div>
<div class="stage">
  <div id="box" style="border:2px dashed #5b6382;background:#eef1f9;padding:0">
    <div style="float:left;width:45%;height:90px;background:#7ee0a8;margin:6px;border-radius:6px"></div>
    <div style="float:right;width:45%;height:90px;background:#ff9aa2;margin:6px;border-radius:6px"></div>
    <div id="clr" style="clear:both;display:none"></div>
  </div>
  <p style="margin:10px 0 0;font-size:12.5px">text after the container</p>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var fix = document.getElementById('fix');
  function upd(){
    document.getElementById('clr').style.display = fix.value === 'clear' ? 'block' : 'none';
    document.getElementById('box').style.display = fix.value === 'flow' ? 'flow-root' : 'block';
    setTimeout(function(){
      document.getElementById('ro').textContent = 'container height: ' + document.getElementById('box').clientHeight + 'px' +
        (fix.value === 'none' ? '   (collapsed: the floats do not count)' : '   (the floats are contained)');
    }, 10);
  }
  fix.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'You float an image left. What wraps around it?', options:['Nothing, the image moves alone','The text and inline content that follows it','Only the elements before it','The whole page'], answer:1, why:'Floating lifts the image to one side and lets the following content flow around it.' },
    { q:'A footer is riding up between two floated columns. Where do you add <code>clear: both</code>?', options:['On the left column','On the right column','On the footer','On the body'], answer:2, why:'clear goes on the element that must drop below the floats, not on the floats themselves.' },
    { q:'What is float best used for today?', options:['Whole-page layouts','Wrapping text around an image','Centring elements','Making navigation bars'], answer:1, why:'Flexbox and Grid handle layout far more predictably. Float remains perfect for text wrap.' },
  ],
  notes:`
    <h3>The two properties</h3>
    <ul>
      <li><code>float: left | right</code> goes on the element that should move to the side. The effect shows up in its neighbours, which wrap around it.</li>
      <li><code>clear: left | right | both</code> goes on a later element that must start below the floats on that side.</li>
    </ul>
    <h3>Wrapping needs room</h3>
    <p>Text can only flow beside a floated picture if there is space next to it. In a narrow column the words drop below the image, so check the layout with <b>↗ open</b> as well as in the preview.</p>`
});


PG.add({
  id:'s08-responsive', index:50, udemyId:37368124, minutes:19, section:'s08', slug:'responsiveness', kind:'build',
  title:'How to Create Responsive Websites',
  blurb:'A responsive page adapts to the width of the screen, from phone to wide monitor. The lecture tours four ways to get there: <b>media queries</b> (different CSS at different widths), <b>CSS Grid</b> (two-dimensional layouts), <b>Flexbox</b> (one row or column sharing out space) and the <b>Bootstrap</b> framework (ready-made classes on a 12-column grid).',
  tasks:[
    '<b>Media query:</b> the purple square shrinks to 200px whenever the preview is 600px wide or narrower. The heading shows the current width; switch between Full width and Phone 375 to test it. Then change the breakpoint to <code>400px</code> so that only the phone width shrinks it.',
    '<b>Grid:</b> change <code>grid-template-columns</code> to <code>1fr 2fr</code>, so the second column gets twice the space. The top card still spans both columns because of <code>grid-column: span 2</code>.',
    '<b>Flexbox:</b> add <code>.flex-container .first { flex: 2; }</code> and <code>.flex-container .second { flex: 0.5; }</code>. The first card becomes four times as wide as the second, and the ratios hold at any width: try Phone 375.',
    '<b>Bootstrap:</b> in index.html change the three cards to <code>col-4</code> each for three equal columns (4 + 4 + 4 = 12). Then try <code>col-6 col-6 col-6</code>: 18 is more than 12, so the third card wraps onto a new line.',
    'On any real website, slowly narrow your browser window and spot the width where the layout changes, for example where a menu collapses. That width is a breakpoint.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Responsiveness</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>Responsiveness Methods</h1>
  <p>The preview is <b id="width"></b> wide.</p>
  <!-- In the course these are four separate pages; here they are four sections of one page. -->

  <h2>1. Media Query</h2>
  <div class="mq-box"></div>

  <h2>2. CSS Grid</h2>
  <div class="grid-container">
    <div class="first card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
  </div>

  <h2>3. CSS Flexbox</h2>
  <div class="flex-container">
    <div class="first card"></div>
    <div class="second card"></div>
    <div class="card"></div>
    <div class="card"></div>
  </div>

  <h2>4. Bootstrap Framework</h2>
  <!-- TODO 4: change the col-N classes -->
  <div class="container">
    <div class="row">
      <div class="card col-6">Card</div>
      <div class="card col-2">Card</div>
      <div class="card col-4">Card</div>
    </div>
  </div>

  <script>
    // helper, not part of the exercise: shows the width of the preview
    function showWidth() {
      document.getElementById("width").textContent = window.innerWidth + "px";
    }
    window.addEventListener("resize", showWidth);
    showWidth();
  </script>
</body>
</html>`,
'style.css':`body {
  padding: 20px;
}

h2 {
  margin-top: 30px;
}

/* ---------- 1. Media query ---------- */
.mq-box {
  background-color: rebeccapurple;
  height: 500px;
  width: 500px;
}

/* TODO 1: change the breakpoint to 400px */
@media (max-width: 600px) {
  /* CSS for screens 600px wide or narrower */
  .mq-box {
    height: 200px;
    width: 200px;
  }
}

/* ---------- 2. CSS Grid ---------- */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* TODO 2: the second column twice as wide */
  grid-template-rows: 100px 200px 200px;
  gap: 30px;
}

.grid-container .first {
  grid-column: span 2;
}

.grid-container .card {
  background-color: blue;
}

/* ---------- 3. CSS Flexbox ---------- */
.flex-container {
  display: flex;
}

.flex-container .card {
  background: blue;
  border: 30px solid white;
  height: 100px;
  flex: 1;
}

/* TODO 3: .first gets twice the share of space, .second half a share */

/* ---------- 4. Bootstrap ----------
   Bootstrap's own stylesheet (linked in the head) does the work here:
   row, col-6, col-2 and col-4 are its classes. Bootstrap also has a
   .card class, which is why the grid and flexbox rules above are
   scoped with .grid-container and .flex-container. */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Responsiveness</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>Responsiveness Methods</h1>
  <p>The preview is <b id="width"></b> wide.</p>
  <!-- In the course these are four separate pages; here they are four sections of one page. -->

  <h2>1. Media Query</h2>
  <div class="mq-box"></div>

  <h2>2. CSS Grid</h2>
  <div class="grid-container">
    <div class="first card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
    <div class="card"></div>
  </div>

  <h2>3. CSS Flexbox</h2>
  <div class="flex-container">
    <div class="first card"></div>
    <div class="second card"></div>
    <div class="card"></div>
    <div class="card"></div>
  </div>

  <h2>4. Bootstrap Framework</h2>
  <div class="container">
    <div class="row">
      <div class="card col-4">Card</div>
      <div class="card col-4">Card</div>
      <div class="card col-4">Card</div>
    </div>
  </div>

  <script>
    // helper, not part of the exercise: shows the width of the preview
    function showWidth() {
      document.getElementById("width").textContent = window.innerWidth + "px";
    }
    window.addEventListener("resize", showWidth);
    showWidth();
  </script>
</body>
</html>`,
'style.css':`body {
  padding: 20px;
}

h2 {
  margin-top: 30px;
}

/* ---------- 1. Media query ---------- */
.mq-box {
  background-color: rebeccapurple;
  height: 500px;
  width: 500px;
}

@media (max-width: 400px) {
  /* CSS for screens 400px wide or narrower */
  .mq-box {
    height: 200px;
    width: 200px;
  }
}

/* ---------- 2. CSS Grid ---------- */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100px 200px 200px;
  gap: 30px;
}

.grid-container .first {
  grid-column: span 2;
}

.grid-container .card {
  background-color: blue;
}

/* ---------- 3. CSS Flexbox ---------- */
.flex-container {
  display: flex;
}

.flex-container .card {
  background: blue;
  border: 30px solid white;
  height: 100px;
  flex: 1;
}

.flex-container .first {
  flex: 2;
}

.flex-container .second {
  flex: 0.5;
}

/* ---------- 4. Bootstrap ----------
   Bootstrap's own stylesheet (linked in the head) does the work here:
   row, col-4 and friends are its classes. Bootstrap also has a
   .card class, which is why the grid and flexbox rules above are
   scoped with .grid-container and .flex-container. */
`},
  explore:[
  {
    title:'Fixed vs fluid widths', height:430,
    note:'Drag the container width to imitate a smaller screen. The top row is sized in pixels, the bottom row in percentages. Only one of them survives.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="220" max="700" value="640" id="w"><span class="val" id="wv">640px</span></label>
</div>
<div class="stage">
  <div id="frame" style="width:640px;border:2px dashed #b9c0d4;padding:10px">
    <h4 style="margin:0 0 6px">width: 300px  (fixed)</h4>
    <div style="overflow:hidden;margin-bottom:14px;white-space:nowrap">
      <div class="box" style="width:300px;display:inline-block">300px</div>
      <div class="box b" style="width:300px;display:inline-block">300px</div>
    </div>
    <h4 style="margin:0 0 6px">width: 45%  (fluid)</h4>
    <div>
      <div class="box c" style="width:45%;display:inline-block">45%</div>
      <div class="box d" style="width:45%;display:inline-block">45%</div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var w = document.getElementById('w');
  function upd(){
    document.getElementById('frame').style.width = w.value + 'px';
    document.getElementById('wv').textContent = w.value + 'px';
    document.getElementById('ro').textContent =
      'container: ' + w.value + 'px\\n\\n' +
      (w.value < 640 ? 'the two 300px boxes no longer fit: the second one is cut off\\n'
                     : 'both rows fit at this width\\n') +
      'the 45% boxes always fit, because they are measured against the container';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'Bootstrap\'s 12 columns', height:470,
    note:'Bootstrap splits every row into 12 equal parts and <code>col-N</code> takes N of them. Pick three numbers: when they add up to 12 the row is exactly full; more than 12 and the extra card wraps to a new line.',
    html:`
<div class="knobs">
  <label>card 1 <select class="n"></select></label>
  <label>card 2 <select class="n"></select></label>
  <label>card 3 <select class="n"></select></label>
  <label>row width <input type="range" min="240" max="700" value="560" id="rw"><span class="val" id="rwv"></span></label>
</div>
<div class="stage">
  <div id="row" style="display:flex;flex-wrap:wrap;border:2px dashed #b9c0d4;width:560px"></div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var start = [6, 2, 4];
  var sels = document.querySelectorAll('select.n');
  sels.forEach(function(s, i){
    for (var n = 1; n <= 12; n++) { var o = document.createElement('option'); o.textContent = n; if (n === start[i]) o.selected = true; s.appendChild(o); }
    s.addEventListener('change', upd);
  });
  var rw = document.getElementById('rw');
  rw.addEventListener('input', upd);
  function upd(){
    var row = document.getElementById('row'), total = 0, colours = ['', ' b', ' c'];
    row.style.width = rw.value + 'px';
    document.getElementById('rwv').textContent = rw.value + 'px';
    row.innerHTML = '';
    var lines = [];
    sels.forEach(function(s, i){
      var n = +s.value; total += n;
      var pct = (n / 12 * 100);
      var d = document.createElement('div');
      d.className = 'box' + colours[i];
      d.style.cssText = 'width:' + pct + '%;border-radius:0;outline:1px solid #fff;padding:10px 4px;font-size:12px';
      d.textContent = 'col-' + n;
      row.appendChild(d);
      lines.push('col-' + n + ' = ' + n + '/12 = ' + pct.toFixed(1) + '% = ' + Math.round(rw.value * n / 12) + 'px');
    });
    document.getElementById('ro').textContent = lines.join('\\n') + '\\n\\ntotal ' + total + ' of 12: ' +
      (total === 12 ? 'the row is exactly full' : total < 12 ? 'a gap is left at the end' : 'too many, so the last card wraps to a new line');
  }
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>@media (max-width: 600px) { … }</code> do?', options:['Applies its rules only when the viewport is 600px wide or wider','Applies its rules only when the viewport is 600px wide or narrower','Limits the page to 600px','Loads a mobile stylesheet'], answer:1, why:'max-width is the largest width at which the rules still apply.' },
    { q:'Three Bootstrap cards have <code>col-6</code>, <code>col-2</code> and <code>col-4</code>. What happens?', options:['They overflow','They fill the row exactly, because 6 + 2 + 4 = 12','The last one wraps','They are all equal'], answer:1, why:'A Bootstrap row is 12 columns. The numbers are shares of that 12, so 12 in total fills it.' },
    { q:'In Flexbox, one card has <code>flex: 2</code> and its siblings <code>flex: 1</code>. Its width is…', options:['2px','twice each sibling\'s share','always 200px','half a sibling\'s width'], answer:1, why:'flex values are ratios of the available space, so the layout scales with the screen.' },
    { q:'Which of the four techniques is best?', options:['Media queries','Grid','Flexbox','None of them is best for everything; real sites mix them'], answer:3, why:'Each suits different jobs. Later sections cover Flexbox, Grid and Bootstrap in depth.' },
  ],
  notes:`
    <h3>The four techniques at a glance</h3>
    <table>
      <tr><th>Technique</th><th>Core idea</th><th>Section</th></tr>
      <tr><td>Media queries</td><td>Different rules at different widths</td><td>next lecture</td></tr>
      <tr><td>CSS Grid</td><td><code>display: grid</code>; rows and columns, <code>fr</code> units, <code>span</code></td><td>10</td></tr>
      <tr><td>Flexbox</td><td><code>display: flex</code>; children share space by ratio</td><td>9</td></tr>
      <tr><td>Bootstrap</td><td>Ready-made classes on a 12-column grid</td><td>11</td></tr>
    </table>
    <h3>The viewport meta tag</h3>
    <pre data-lang="html">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</pre>
    <p>Every starter file has this line. Without it, phones pretend to be about 980px wide and zoom out, so your media queries never fire.</p>
    <h3>Testing widths here</h3>
    <p>The preview's width menu can shrink the preview (Phone 375) but cannot make it wider than its pane. For wide layouts, press <b>↗ open</b> and resize that browser window.</p>`
});


PG.add({
  id:'s08-media-query', index:51, udemyId:37368166, minutes:11, section:'s08', slug:'media-query', kind:'build',
  title:'Media Queries',
  blurb:'A media query wraps ordinary CSS in a condition: <code>@media (max-width: 600px) { … }</code> applies only up to 600px wide, <code>(min-width: 600px)</code> only from 600px up, and <code>and</code> joins two conditions into a band. The rules inside override the defaults whenever the condition is true.',
  tasks:[
    '<b>Mobile:</b> add <code>@media (min-width: 319px) and (max-width: 480px)</code> that makes the body <code>lightsalmon</code>. Check it by switching the preview to Phone 375.',
    '<b>Tablet:</b> 481px to 1200px → <code>powderblue</code>. At Full width the preview falls in this band on most screens; the heading shows the current width.',
    '<b>Laptop:</b> 1201px to 1600px → <code>limegreen</code>. The preview is narrower than that, so press <b>↗ open</b> and resize that browser window.',
    '<b>Desktop:</b> <code>@media (min-width: 1601px)</code> → <code>seagreen</code>, with no maximum. If your screen is not that wide, zoom the ↗ open tab out (Cmd/Ctrl and minus): zooming out makes the page wider in CSS pixels.',
    'Notice the bands meet at 480/481, 1200/1201 and 1600/1601: the limits are inclusive, so neighbouring bands must not share a number. Below 319px the default aquamarine shows.',
    'Bonus: add <code>@media print { h1 { display: none; } }</code>, then open the print preview (Cmd/Ctrl+P) in the ↗ open tab. The heading is gone from the printout only.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<!--
  TODO: change the body's background colour for each kind of device
  [lightsalmon]  Mobile devices:     319px to 480px
  [powderblue]   iPads and tablets:  481px to 1200px
  [limegreen]    Laptops:            1201px to 1600px
  [seagreen]     Desktops:           1601px and wider
-->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Media Query</title>
  <style>
    body {
      background-color: aquamarine;
    }

    /* Write your media queries below */

  </style>
</head>
<body>
  <!-- helper, not part of the exercise: shows the current width -->
  <h1 id="width"></h1>
  <script>
    function showWidth() {
      document.getElementById("width").textContent = window.innerWidth + "px wide";
    }
    window.addEventListener("resize", showWidth);
    showWidth();
  </script>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<!--
  TODO: change the body's background colour for each kind of device
  [lightsalmon]  Mobile devices:     319px to 480px
  [powderblue]   iPads and tablets:  481px to 1200px
  [limegreen]    Laptops:            1201px to 1600px
  [seagreen]     Desktops:           1601px and wider
-->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Media Query</title>
  <style>
    body {
      background-color: aquamarine;
    }

    @media (min-width: 319px) and (max-width: 480px) {
      body {
        background-color: lightsalmon;
      }
    }

    @media (min-width: 481px) and (max-width: 1200px) {
      body {
        background-color: powderblue;
      }
    }

    @media (min-width: 1201px) and (max-width: 1600px) {
      body {
        background-color: limegreen;
      }
    }

    @media (min-width: 1601px) {
      body {
        background-color: seagreen;
      }
    }

    @media print {
      h1 {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- helper, not part of the exercise: shows the current width -->
  <h1 id="width"></h1>
  <script>
    function showWidth() {
      document.getElementById("width").textContent = window.innerWidth + "px wide";
    }
    window.addEventListener("resize", showWidth);
    showWidth();
  </script>
</body>
</html>`},
  explore:[
  {
    title:'max-width vs min-width on the width axis', height:520,
    note:'Slide the screen width along the axis. <code>max-width</code> covers everything to the <b>left</b> of its number, <code>min-width</code> everything to the <b>right</b>, and <code>and</code> keeps only the overlap. The coloured bands are the four from the exercise.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="0" max="2000" value="900" id="w" style="width:260px"><span class="val" id="wv"></span></label>
</div>
<div class="stage" style="padding:16px 16px 26px">
  <div class="axis" id="bands"></div>
  <div class="axis" id="maxq" style="margin-top:10px"></div>
  <div class="axis" id="minq" style="margin-top:6px"></div>
  <div id="marker"></div>
  <div class="ticks"><span style="left:0">0</span><span style="left:24%">480</span><span style="left:60%">1200</span><span style="left:80%">1600</span><span style="left:100%">2000</span></div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .axis { position: relative; height: 26px; background: #eef1f9; border-radius: 4px; }
  .seg { position: absolute; top: 0; bottom: 0; font-size: 11px; display: flex; align-items: center; justify-content: center; color: #1c2030; border-radius: 4px; opacity: .45; }
  .seg.on { opacity: 1; outline: 2px solid #1c2030; }
  #marker { position: absolute; top: 8px; bottom: 22px; width: 2px; background: #ff5c8a; }
  .ticks { position: relative; height: 14px; margin-top: 6px; font: 11px ui-monospace, Menlo, monospace; color: #5b6382; }
  .ticks span { position: absolute; transform: translateX(-50%); }
</style>
<script>
  var MAX = 2000;
  var bands = [
    { a:319, b:480, c:'lightsalmon', q:'(min-width: 319px) and (max-width: 480px)' },
    { a:481, b:1200, c:'powderblue', q:'(min-width: 481px) and (max-width: 1200px)' },
    { a:1201, b:1600, c:'limegreen', q:'(min-width: 1201px) and (max-width: 1600px)' },
    { a:1601, b:MAX, c:'seagreen', q:'(min-width: 1601px)' }
  ];
  function seg(host, a, b, colour, label){
    var s = document.createElement('div');
    s.className = 'seg';
    s.style.left = (a / MAX * 100) + '%'; s.style.width = ((b - a) / MAX * 100) + '%'; s.style.background = colour;
    s.textContent = label; host.appendChild(s); return s;
  }
  var bandEls = bands.map(function(b){ return seg(document.getElementById('bands'), b.a, b.b, b.c, b.c); });
  var maxEl = seg(document.getElementById('maxq'), 0, 600, '#c9d8ff', '(max-width: 600px)');
  var minEl = seg(document.getElementById('minq'), 600, MAX, '#ffe2a8', '(min-width: 600px)');
  var w = document.getElementById('w');
  function upd(){
    var v = +w.value, active = 'aquamarine (the default: no band matches)';
    document.getElementById('wv').textContent = v + 'px';
    var stage = document.querySelector('.stage'), axis = document.getElementById('bands');
    document.getElementById('marker').style.left = (axis.offsetLeft + axis.offsetWidth * v / MAX) + 'px';
    var lines = bands.map(function(b, i){
      var on = v >= b.a && v <= b.b;
      bandEls[i].classList.toggle('on', on);
      if (on) active = b.c;
      return (on ? 'TRUE   ' : 'false  ') + '@media ' + b.q;
    });
    maxEl.classList.toggle('on', v <= 600);
    minEl.classList.toggle('on', v >= 600);
    document.getElementById('ro').textContent = lines.join('\\n') +
      '\\n\\n' + (v <= 600 ? 'TRUE   ' : 'false  ') + '@media (max-width: 600px)' +
      '\\n' + (v >= 600 ? 'TRUE   ' : 'false  ') + '@media (min-width: 600px)' +
      '\\n\\nbody background: ' + active;
  }
  w.addEventListener('input', upd); window.addEventListener('resize', upd); upd();
<\/script>`
  },
  {
    title:'Live breakpoint simulator', height:560,
    note:'Drag the screen width and watch which media query is active. The card layout, font size and colour all change at the breakpoints, the way a real responsive site does. This page is written mobile first: the base styles are for phones, and <code>min-width</code> queries add to them.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="280" max="1000" value="900" id="w"><span class="val" id="wv">900px</span></label>
  <span class="tag" id="active"></span>
</div>
<div class="stage" style="padding:8px">
  <div id="frame" style="width:900px;border:2px solid #b9c0d4;border-radius:8px;overflow:hidden">
    <iframe id="fr" style="width:100%;height:280px;border:0;display:block"></iframe>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var doc = '<!DOCTYPE html><html><head><style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;padding:14px;font-family:-apple-system,sans-serif;background:#ffd9d9;transition:background .15s}' +
    'h1{font-size:18px;margin:0 0 10px}' +
    '.cards{display:flex;gap:8px;flex-direction:column}' +
    '.c{background:#fff;border-radius:8px;padding:12px;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,.12)}' +
    '.tag{font-family:Menlo,monospace;font-size:11px;color:#7a4b4b}' +
    '@media (min-width:600px){' +
      'body{background:#d9e8ff}.cards{flex-direction:row}.tag{color:#3a5a8c}h1{font-size:22px}}' +
    '@media (min-width:900px){' +
      'body{background:#d9ffe4}.tag{color:#2c6b42}h1{font-size:28px}.c{padding:20px}}' +
    '</style></head><body>' +
    '<h1>My responsive page</h1>' +
    '<div class="cards"><div class="c">One</div><div class="c">Two</div><div class="c">Three</div></div>' +
    '<p class="tag" id="t"></p>' +
    '<script>function u(){document.getElementById("t").textContent="viewport is "+window.innerWidth+"px";}' +
    'window.addEventListener("resize",u);u();<\\/scr' + 'ipt></body></html>';
  document.getElementById('fr').srcdoc = doc;

  var w = document.getElementById('w');
  function upd(){
    var v = +w.value;
    document.getElementById('frame').style.width = v + 'px';
    document.getElementById('wv').textContent = v + 'px';
    var which = v >= 900 ? 'min-width: 900px  (desktop)'
              : v >= 600 ? 'min-width: 600px  (tablet)'
              : 'base styles  (mobile)';
    document.getElementById('active').textContent = 'active: ' + which;
    document.getElementById('ro').textContent =
      '/* mobile first: the base styles apply everywhere */\\n' +
      'body { background: pink; }\\n\\n' +
      '@media (min-width: 600px) {' + (v >= 600 ? '   <-- ACTIVE' : '') + '\\n  body { background: blue; }\\n}\\n\\n' +
      '@media (min-width: 900px) {' + (v >= 900 ? '   <-- ACTIVE' : '') + '\\n  body { background: green; }\\n}';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'Which query targets screens that are 600px wide <b>and wider</b>?', options:['@media (max-width: 600px)','@media (min-width: 600px)','@media (width: 600px)','@media screen-600'], answer:1, why:'min-width is the smallest width where the rules apply, so everything from 600px up matches.' },
    { q:'How do you target only screens between 600px and 900px?', options:['@media (min-width: 600px) or (max-width: 900px)','@media (min-width: 600px) and (max-width: 900px)','@media (600px - 900px)','@media (max-width: 600px) and (min-width: 900px)'], answer:1, why:'and keeps only the widths where both conditions are true: the overlap.' },
    { q:'Why do the exercise\'s bands use 480 and 481, rather than 480 twice?', options:['To make the CSS longer','Both limits are inclusive, so at exactly 480px two bands would match at once','Browsers cannot read even numbers','It is a Bootstrap convention'], answer:1, why:'max-width: 480px includes 480. Starting the next band at 481 keeps the bands from overlapping.' },
    { q:'Which media type applies rules only when the page is printed?', options:['screen','print','paper','all'], answer:1, why:'@media print { … } styles the printout. screen is effectively the default, so it is rarely written.' },
  ],
  notes:`
    <h3>Anatomy</h3>
    <pre data-lang="css">@media (max-width: 600px) {   /* the condition, where a selector would go */
  h1 {                        /* ordinary rules inside */
    font-size: 2rem;
  }
}</pre>
    <h3>Reading the conditions</h3>
    <ul>
      <li><code>(max-width: 600px)</code>: from 0 up to and including 600px.</li>
      <li><code>(min-width: 600px)</code>: from 600px upwards.</li>
      <li><code>(min-width: 600px) and (max-width: 900px)</code>: only the band in between.</li>
      <li><code>print</code>, <code>(orientation: landscape)</code> and more are listed on MDN's "Using media queries" page.</li>
    </ul>
    <h3>Testing</h3>
    <p>Chrome DevTools has a device toolbar (the phone-and-tablet icon) with presets such as iPhone SE and iPad Air, or a Responsive mode where you type an exact width. In this playground, Phone 375 shrinks the preview and <b>↗ open</b> gives you a full browser window to resize.</p>`
});


PG.add({
  id:'s08-agency', index:52, udemyId:37368196, minutes:7, section:'s08', slug:'agency-project', kind:'build', project:true,
  title:'Web Design Agency Website',
  blurb:'The section project: turn a plain page for a design agency into a two-column layout with floats, then make it responsive so the cards stack on narrow screens. Along the way: a <code>&lt;span&gt;</code> to colour one word, a 680px media query, and a new property, <code>object-fit</code>.',
  tasks:[
    'Wrap the word "Creative" in <code>&lt;span class="creative"&gt;</code> and colour it <code>midnightblue</code> in style.css. A span is inline, so the heading does not break.',
    'Give <code>.card</code> a width of <code>45%</code>, then float <code>.left</code> to the left and <code>.right</code> to the right. The preview is narrow, so press <b>↗ open</b> to see the two columns properly.',
    'Make <code>.tile-image</code> <code>200px</code> high, float it left and give it <code>margin-right: 50px</code>, so each card\'s title and text wrap around its picture.',
    'Keep the footer below the floated cards with <code>clear: both</code>.',
    'Add <code>@media (max-width: 680px)</code>. Inside it: <code>.card</code> gets <code>width: 100%</code>, <code>display: block</code>, <code>margin-bottom: 30px</code> and <code>text-align: justify</code>; <code>.card img</code> gets <code>width: 100%</code>, <code>margin-bottom: 10px</code> and <code>object-fit: cover</code>.',
    'Still inside the query: shrink the <code>h1</code> to <code>3.5rem</code> and centre it, and make the <code>.logo</code> <code>100px</code> wide. Compare Phone 375 with ↗ open.',
    'The brief is open: an exact copy is not required. Change the images (any <code>picsum.photos</code> link), the colours or the breakpoint and make it yours.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agency</title>
  <link rel="stylesheet" href="./style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="main">
    <img class="logo" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='263' height='46'><rect width='46' height='46' rx='12' fill='midnightblue'/><circle cx='23' cy='23' r='9' fill='white'/><text x='60' y='33' font-family='Arial, sans-serif' font-size='28' font-weight='700' fill='midnightblue'>pixelworks</text></svg>" alt="logo" />
    <!-- TODO 1: wrap the word "Creative" in a span with the class "creative" -->
    <h1>
      We are a Creative <br />Design Agency
    </h1>
    <div class="left card">
      <img class="tile-image" src="https://picsum.photos/id/152/800/533" alt="a purple flower" />
      <h2 class="card-title">Beauty</h2>
      <p class="card-text">
        We design the most beautiful websites for every need, working closely
        with you from the first sketch to an amazing finished site for your
        business.
      </p>
    </div>

    <div class="right card">
      <img class="tile-image" src="https://picsum.photos/id/1031/800/533" alt="a glass tower seen from below" />
      <h2 class="card-title">Construction</h2>
      <p class="card-text">
        Built from scratch in HTML and CSS by our team of professional
        developers, every site is rigorous, modern and made to last. Only the
        best for you.
      </p>
    </div>
  </div>
  <footer>
    <p>Create. Develop. Design.</p>
  </footer>
</body>
</html>`,
'style.css':`body {
  font-family: "Poppins", sans-serif;
  margin: 50px 50px 0 50px;
  background-color: #faf9f6;
}

h1 {
  font-size: 5rem;
}

footer {
  text-align: right;
  color: midnightblue;
}

/* TODO 1: .creative -> midnightblue */

/* TODO 2: .card 45% wide; .left floats left, .right floats right */

/* TODO 3: .tile-image 200px high, floated left, 50px gap on its right */

/* TODO 4: keep the footer below the floated cards */

/* TODO 5 + 6: at 680px and narrower, stack the cards, make the images
   full width, and shrink the heading and the logo */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Agency</title>
  <link rel="stylesheet" href="./style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="main">
    <img class="logo" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='263' height='46'><rect width='46' height='46' rx='12' fill='midnightblue'/><circle cx='23' cy='23' r='9' fill='white'/><text x='60' y='33' font-family='Arial, sans-serif' font-size='28' font-weight='700' fill='midnightblue'>pixelworks</text></svg>" alt="logo" />
    <h1>
      We are a <span class="creative">Creative</span> <br />Design Agency
    </h1>
    <div class="left card">
      <img class="tile-image" src="https://picsum.photos/id/152/800/533" alt="a purple flower" />
      <h2 class="card-title">Beauty</h2>
      <p class="card-text">
        We design the most beautiful websites for every need, working closely
        with you from the first sketch to an amazing finished site for your
        business.
      </p>
    </div>

    <div class="right card">
      <img class="tile-image" src="https://picsum.photos/id/1031/800/533" alt="a glass tower seen from below" />
      <h2 class="card-title">Construction</h2>
      <p class="card-text">
        Built from scratch in HTML and CSS by our team of professional
        developers, every site is rigorous, modern and made to last. Only the
        best for you.
      </p>
    </div>
  </div>
  <footer>
    <p>Create. Develop. Design.</p>
  </footer>
</body>
</html>`,
'style.css':`body {
  font-family: "Poppins", sans-serif;
  margin: 50px 50px 0 50px;
  background-color: #faf9f6;
}

h1 {
  font-size: 5rem;
}

footer {
  text-align: right;
  color: midnightblue;
  clear: both;
}

.creative {
  color: midnightblue;
}

.card {
  width: 45%;
}

.left {
  float: left;
}

.right {
  float: right;
}

.tile-image {
  height: 200px;
  float: left;
  margin-right: 50px;
}

@media (max-width: 680px) {
  .logo {
    width: 100px;
  }

  h1 {
    font-size: 3.5rem;
    text-align: center;
  }

  .card {
    width: 100%;
    display: block;
    margin-bottom: 30px;
    text-align: justify;
  }

  .card img {
    width: 100%;
    margin-bottom: 10px;
    object-fit: cover;
  }
}
`},
  explore:[
  {
    title:'object-fit', height:470,
    note:'When an image is forced into a box with a different shape (here, full width but only 200px high), <code>object-fit</code> decides what happens. <code>fill</code> stretches it, <code>contain</code> fits it inside with gaps, and <code>cover</code> fills the box and crops the overflow without distortion.',
    html:`
<div class="knobs">
  <label>object-fit
    <select data-css="#im|object-fit"><option>fill</option><option>contain</option><option selected>cover</option><option>none</option></select>
  </label>
  <label>box width <input type="range" min="120" max="560" value="460" data-css="#im|width|px"><span class="val"></span></label>
  <label>box height <input type="range" min="80" max="300" value="160" data-css="#im|height|px"><span class="val"></span></label>
</div>
<div class="stage">
  <img id="im" src="https://picsum.photos/id/1031/800/533" alt="a glass tower seen from below" style="display:block;width:460px;height:160px;background:repeating-conic-gradient(#eef1f9 0 25%,#fff 0 50%) 0 0/16px 16px;outline:2px dashed #ff5c8a;object-fit:cover">
</div>
<pre class="readout" data-readout="#im"></pre>`
  },
  {
    title:'The layout at any width', height:600,
    note:'The finished page in a resizable frame. Drag across 680px and the media query flips the layout: two floated columns above it, stacked full-width cards below it.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="320" max="1100" value="900" id="w"><span class="val" id="wv"></span></label>
  <span class="tag" id="mode"></span>
</div>
<div class="stage" style="padding:8px">
  <div id="frame" style="width:900px;border:2px solid #b9c0d4;border-radius:8px;overflow:hidden">
    <iframe id="fr" style="width:100%;height:420px;border:0;display:block"></iframe>
  </div>
</div>
<script>
  var css = 'body{font-family:Poppins,sans-serif;margin:24px 24px 0;background:#faf9f6}h1{font-size:2.6rem;margin:10px 0}' +
    'footer{text-align:right;color:midnightblue;clear:both}.creative{color:midnightblue}.card{width:45%}.left{float:left}.right{float:right}' +
    '.tile-image{height:110px;float:left;margin-right:20px}h2{margin:0 0 6px;font-size:1.1rem}p{margin:0;font-size:.85rem}' +
    '@media (max-width:680px){h1{font-size:1.9rem;text-align:center}.card{width:100%;display:block;margin-bottom:20px;text-align:justify}' +
    '.card img{width:100%;margin-bottom:8px;object-fit:cover}}';
  var body = '<h1>We are a <span class="creative">Creative</span><br>Design Agency</h1>' +
    '<div class="left card"><img class="tile-image" src="https://picsum.photos/id/152/400/266" alt=""><h2>Beauty</h2><p>We design beautiful websites for every need, from the first sketch to the finished site.</p></div>' +
    '<div class="right card"><img class="tile-image" src="https://picsum.photos/id/1031/400/266" alt=""><h2>Construction</h2><p>Built from scratch in HTML and CSS, rigorous, modern and made to last.</p></div>' +
    '<footer><p>Create. Develop. Design.</p></footer>';
  document.getElementById('fr').srcdoc = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"><style>' + css + '<\/style></head><body>' + body + '</body></html>';
  var w = document.getElementById('w');
  function upd(){
    var v = +w.value;
    document.getElementById('frame').style.width = v + 'px';
    document.getElementById('wv').textContent = v + 'px';
    document.getElementById('mode').textContent = v <= 680 ? '@media (max-width: 680px) is ACTIVE: stacked' : 'wider than 680px: two floated columns';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'Why is "Creative" wrapped in a <code>&lt;span&gt;</code> rather than a <code>&lt;div&gt;</code>?', options:['A span is bigger','A span is inline, so the word stays in the heading\'s line while getting its own style','Divs cannot have classes','Spans load faster'], answer:1, why:'A div is a block and would break the heading onto separate lines.' },
    { q:'What does <code>object-fit: cover</code> do to an image in a box of a different shape?', options:['Stretches it to fit','Shrinks it until it fits with gaps','Fills the box and crops the overflow, without distortion','Hides it'], answer:2, why:'cover keeps the image\'s proportions and trims whatever does not fit.' },
    { q:'In the finished CSS, when do the cards stack?', options:['Above 680px','At 680px wide and narrower','Only on print','Never, they always float'], answer:1, why:'Inside @media (max-width: 680px) the cards become full-width blocks.' },
  ],
  notes:`
    <h3>New property: object-fit</h3>
    <p>When an image is given a width and height that don't match its own proportions, <code>object-fit: cover</code> fills the box and crops the rest, <code>contain</code> fits the whole image inside, and the default <code>fill</code> stretches it. Meeting an unfamiliar property like this and looking it up on MDN is completely normal; it is how working developers learn.</p>
    <h3>Two ways to keep the footer down</h3>
    <p>This lesson uses <code>clear: both</code> on the footer, from the float lecture. The course's own solution instead makes the body a flex column and gives <code>.main</code> <code>flex: 1</code>, a Flexbox trick from the next section that also keeps the footer at the bottom of short pages.</p>
    <h3>Testing the breakpoint</h3>
    <p>The preview pane is narrower than 680px on most laptops, so it shows the stacked layout. Press <b>↗ open</b> for the two-column version, and narrow that window to watch it flip.</p>`
});


PG.add({
  id:'l053', index:53, udemyId:17966600, minutes:4, section:'s08', slug:'procrastination', kind:'read',
  title:'Tip from Angela - How to Deal with Procrastination',
  blurb:'A study-habit tip: elaborate rituals before starting (tidying the desk, making tea, fetching snacks) are delay in disguise. Start first and keep the treat for afterwards. The Pomodoro Technique helps: 25 minutes of focused work against a timer, then a 5-minute break, saving small distractions for the break.',
  quiz:[
    { q:'What does a Pomodoro cycle look like?', options:['50 minutes of work, 1 minute of break','25 minutes of focused work, then a 5-minute break','Work until tired, then stop for the day','5 minutes of work, 25 minutes of break'], answer:1, why:'Short, timed bursts make starting easier, and the break gives the small distractions somewhere to go.' },
    { q:'According to the tip, when should the reward (a snack, a tea) come?', options:['Before you start, to get in the mood','After the work, as a reward','Halfway through every task','Whenever you feel stuck'], answer:1, why:'Rewarding the preparation feeds the habit of delaying. Rewarding the finished work feeds the habit of starting.' },
  ],
});
