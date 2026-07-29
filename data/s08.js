/* ===== Section 8 — Advanced CSS ===== */

PG.add({
  id:'s08-display', section:'s08', slug:'display', lesson:'8.1',
  title:'CSS Display',
  blurb:'<code>display</code> decides how an element behaves in the flow. <b>block</b> takes a whole row; <b>inline</b> sits in the text and ignores width/height; <b>inline-block</b> is the hybrid that does both; <b>none</b> removes it entirely.',
  tasks:[
    'First goal: make the three boxes sit <b>side by side</b> in a row while keeping their 200×200 size.',
    'Second goal: change one value so they <b>stack vertically</b> again.',
    'Then try <code>display: none</code> on the green box — notice the others close the gap completely.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Display</title>
</head>
<body>
  <div class="red"></div>
  <div class="green"></div>
  <div class="blue"></div>
</body>
</html>`,
css:`.red {
  width: 200px;
  height: 200px;
  background-color: red;
  /* TODO: add a display value */
}

.green {
  width: 200px;
  height: 200px;
  background-color: green;
  /* TODO: add a display value */
}

.blue {
  width: 200px;
  height: 200px;
  background-color: blue;
  /* TODO: add a display value */
}
`},
  solution:{
css:`.red {
  width: 200px;
  height: 200px;
  background-color: red;
  display: inline-block;
}

.green {
  width: 200px;
  height: 200px;
  background-color: green;
  display: inline-block;
}

.blue {
  width: 200px;
  height: 200px;
  background-color: blue;
  display: inline-block;
}
`},
  explore:[{
    title:'The four display values', height:520,
    note:'Every box below is 120×70 with the same CSS apart from <code>display</code>. Switch it and watch what survives: <b>inline</b> throws the width and height away completely.',
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
    block:'block — each box grabs a whole row to itself. This is the default for div, p, h1, section…',
    'inline-block':'inline-block — boxes sit side by side like words, but width and height still apply. The best of both.',
    inline:'inline — the box flows inside the sentence like a word. width and height are IGNORED; only left/right padding pushes things around. This is the default for span, a, strong, em…',
    none:'none — the element is gone. It takes up no space at all (unlike visibility: hidden, which leaves the hole).'
  };
  function upd(){ document.getElementById('explain').textContent = text[sel.value]; }
  sel.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  }],
  notes:`
    <h3>Default display values</h3>
    <table>
      <tr><th>Default</th><th>Tags</th></tr>
      <tr><td><code>block</code></td><td><code>div</code>, <code>p</code>, <code>h1</code>–<code>h6</code>, <code>ul</code>, <code>li</code>, <code>section</code>, <code>footer</code></td></tr>
      <tr><td><code>inline</code></td><td><code>span</code>, <code>a</code>, <code>img</code>, <code>strong</code>, <code>em</code></td></tr>
    </table>
    <h3>none vs hidden</h3>
    <ul>
      <li><code>display: none</code> — removed from the layout; the gap closes.</li>
      <li><code>visibility: hidden</code> — invisible but the space is still reserved.</li>
    </ul>
    <p>These days you would usually reach for flexbox rather than <code>inline-block</code> to put things in a row — which is exactly where section 9 goes.</p>`
});


PG.add({
  id:'s08-float', section:'s08', slug:'float', lesson:'8.2',
  title:'Float & Clear',
  blurb:'<code>float</code> pushes an element to one side and lets the text wrap around it — like a picture in a magazine article. <code>clear</code> is the escape hatch that forces an element back <em>below</em> the floated ones.',
  tasks:[
    'Float the cat image to the <b>left</b> so the paragraph text wraps around it.',
    'Float <code>.dog</code> to the <b>right</b>.',
    'The footer is being sucked up beside the floats — use <code>clear: both</code> to push it back underneath where it belongs.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Float</title>
</head>
<body>
  <h1>All About Pets</h1>

  <div class="cat">
    <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=260&q=70" alt="cat" />
    <h2>Cats</h2>
    <p>Cats are small carnivorous mammals and the only domesticated species in
      the family Felidae. They are valued by humans for companionship and their
      ability to kill rodents.</p>
  </div>

  <div class="dog">
    <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=260&q=70" alt="dog" />
    <h2>Dogs</h2>
    <p>The dog is a domesticated descendant of the wolf, and is characterised by
      an upturning tail. Dogs are the most widely abundant terrestrial carnivore.</p>
  </div>

  <footer>
    <p>Made with love, by me.</p>
  </footer>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

img {
  width: 130px;
  margin-right: 14px;
  /* try floating the images too */
}

.cat {
  background-color: aquamarine;
  width: 45%;
  padding: 12px;
  /* TODO 1: float left */
}

.dog {
  background-color: coral;
  width: 45%;
  padding: 12px;
  /* TODO 2: float right */
}

footer {
  background-color: blueviolet;
  color: white;
  text-align: center;
  /* TODO 3: clear the floats */
}
`},
  solution:{
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

img {
  width: 130px;
  margin-right: 14px;
  float: left;
}

.cat {
  background-color: aquamarine;
  width: 45%;
  padding: 12px;
  float: left;
}

.dog {
  background-color: coral;
  width: 45%;
  padding: 12px;
  float: right;
}

footer {
  background-color: blueviolet;
  color: white;
  text-align: center;
  clear: both;
}
`},
  explore:[{
    title:'Float & clear sandbox', height:540,
    note:'Float the image and watch the text wrap. Then turn <code>clear</code> off on the footer and see it get dragged up beside the float — that is the bug this property exists to fix.',
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
  <p style="margin:0">Cats are small carnivorous mammals and the only domesticated species in the family Felidae.
  They are valued by humans for companionship and their ability to kill rodents. A cat's night vision and sense of
  smell are well developed, and it can hear sounds too faint for human ears.</p>
  <div id="ft" style="clear:both;background:#8e5bff;color:#fff;padding:8px;text-align:center;border-radius:6px;margin-top:8px;font-size:13px">
    the footer — should sit below everything
  </div>
</div>
<pre class="readout" data-readout="#img,#ft"></pre>
<p class="note"><b>Why floats are legacy.</b> They were invented for wrapping text around images, then got abused for whole page layouts for a decade. You still meet them in older code, but for layout use flexbox or grid instead.</p>`
  }],
  notes:`
    <h3>Float</h3>
    <ul>
      <li><code>float: left | right | none</code> — pushes the element to that side of its container.</li>
      <li>Everything after it flows <em>around</em> it instead of below it.</li>
      <li>A floated element is partly taken out of the normal flow, which is why parents can "collapse" to zero height around them.</li>
    </ul>
    <h3>Clear</h3>
    <ul>
      <li><code>clear: left | right | both</code> — this element must sit below any floats on that side.</li>
      <li><code>clear: both</code> on a footer is the classic fix.</li>
    </ul>
    <h3>The modern alternative</h3>
    <p>Wrapping text around an image? Float is still perfect. Laying out a page? Use flexbox (section 9) or grid (section 10).</p>`
});


PG.add({
  id:'s08-responsive', section:'s08', slug:'responsiveness', lesson:'8.3',
  title:'Responsiveness',
  blurb:'One page, every screen size. There are four ways to get there: <b>media queries</b>, <b>flexbox</b>, <b>grid</b> and a framework like <b>Bootstrap</b>. First, the tag that makes any of it work.',
  tasks:[
    'Add the viewport meta tag to the head — without it, phones lie about their width and pretend to be 980px wide.',
    'Change the preview width selector (top right of the preview) to Phone 375 and watch the layout.',
    'Make the boxes shrink with the screen by using a percentage width instead of a pixel width.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- TODO 1: the viewport meta tag goes here -->
  <title>Responsiveness</title>
</head>
<body>
  <h1>Responsive?</h1>
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 16px;
}

.card {
  /* TODO 3: try width: 30% instead of 300px */
  width: 300px;
  height: 120px;
  background: #5b9cff;
  color: white;
  display: inline-block;
  padding: 12px;
  box-sizing: border-box;
}
`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Responsiveness</title>
</head>
<body>
  <h1>Responsive?</h1>
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 16px;
}

.card {
  width: 30%;
  height: 120px;
  background: #5b9cff;
  color: white;
  display: inline-block;
  padding: 12px;
  box-sizing: border-box;
}
`},
  explore:[{
    title:'Fixed vs fluid widths', height:430,
    note:'Drag the container width to simulate a smaller screen. The top row is fixed in pixels; the bottom row is a percentage. Only one of them survives.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="220" max="700" value="640" id="w"><span class="val" id="wv">640px</span></label>
</div>
<div class="stage">
  <div id="frame" style="width:640px;border:2px dashed #b9c0d4;padding:10px;transition:width .1s">
    <h4 style="margin:0 0 6px">width: 300px  (fixed)</h4>
    <div style="overflow:hidden;margin-bottom:14px">
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
      (w.value < 640 ? 'the two 300px boxes no longer fit side by side — they wrap or overflow\\n'
                     : 'both rows fit fine at this width\\n') +
      'the 45% boxes always fit, because they are measured against the container';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The viewport meta tag</h3>
    <pre>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</pre>
    <p>Without it, mobile browsers render your page as if the screen were about 980px wide and then zoom out — so your media queries never fire and everything is tiny. This one line goes in every page you ever write.</p>
    <h3>Four routes to responsive</h3>
    <ol>
      <li><b>Media queries</b> — different CSS at different widths. Next lesson.</li>
      <li><b>Flexbox</b> — items flex and wrap. Section 9.</li>
      <li><b>Grid</b> — two-dimensional, with <code>minmax()</code> and <code>auto-fit</code>. Section 10.</li>
      <li><b>Bootstrap</b> — a ready-made responsive grid. Section 11.</li>
    </ol>
    <h3>Free wins</h3>
    <ul>
      <li>Use <code>%</code>, <code>rem</code>, <code>vw</code>/<code>vh</code> rather than fixed <code>px</code> for layout sizes.</li>
      <li><code>max-width: 100%</code> on images stops them bursting out of small screens.</li>
      <li>Design for the phone first, then add rules for bigger screens.</li>
    </ul>`
});


PG.add({
  id:'s08-media-query', section:'s08', slug:'media-query', lesson:'8.4',
  title:'Media Queries',
  blurb:'A media query wraps a block of CSS in a condition — usually a screen-width range. Below that width the rules apply; above it they do not.',
  tasks:[
    'The body starts aquamarine. Add a media query so that between <code>481px</code> and <code>1200px</code> it becomes <code>powderblue</code>.',
    'Add another so that between <code>1201px</code> and <code>1600px</code> it becomes <code>limegreen</code>.',
    'Use the preview width selector (Phone / Tablet / Desktop) to trigger each one. Widen the whole window for the largest.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Media Query</title>
</head>
<body>
  <h1>Resize me</h1>
  <p>The background colour should change with the width of the preview.</p>
</body>
</html>`,
css:`body {
  background-color: aquamarine;
  font-family: sans-serif;
  padding: 20px;
}

/* TODO 1: 481px - 1200px  -> powderblue */

/* TODO 2: 1201px - 1600px -> limegreen */
`},
  solution:{
css:`body {
  background-color: aquamarine;
  font-family: sans-serif;
  padding: 20px;
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
`},
  explore:[{
    title:'Live breakpoint simulator', height:560,
    note:'Drag the screen width and watch which media query is active. The card layout, font size and colour all change at the breakpoints — exactly how a real responsive site behaves.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="280" max="1000" value="900" id="w"><span class="val" id="wv">900px</span></label>
  <span class="tag" id="active"></span>
</div>
<div class="stage" style="padding:8px">
  <div id="frame" style="width:900px;transition:width .08s;border:2px solid #b9c0d4;border-radius:8px;overflow:hidden">
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
    'window.addEventListener("resize",u);u();<\\/scr'+'ipt></body></html>';
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
      '/* mobile first: base styles apply to everything */\\n' +
      'body { background: pink; }\\n\\n' +
      '@media (min-width: 600px) {' + (v>=600 ? '   <-- ACTIVE' : '') + '\\n  body { background: blue; }\\n}\\n\\n' +
      '@media (min-width: 900px) {' + (v>=900 ? '   <-- ACTIVE' : '') + '\\n  body { background: green; }\\n}';
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Anatomy</h3>
    <pre>@media (max-width: 600px) {
  body {
    background-color: powderblue;
  }
}</pre>
    <p>Read it as: "when the screen is at most 600px wide, also apply these rules". Everything inside the braces is normal CSS.</p>
    <h3>The conditions</h3>
    <ul>
      <li><code>(max-width: 600px)</code> — this width and below.</li>
      <li><code>(min-width: 601px)</code> — this width and above.</li>
      <li><code>(min-width: 600px) and (max-width: 900px)</code> — a band between two sizes.</li>
      <li><code>(orientation: landscape)</code>, <code>print</code> — other things you can ask about.</li>
    </ul>
    <h3>Mobile first</h3>
    <p>Write the phone layout as your normal CSS, then use <code>min-width</code> queries to add complexity for bigger screens. It ends up simpler than going the other way, and the phone gets the lightest CSS.</p>
    <h3>Common breakpoints</h3>
    <p>576px, 768px, 992px, 1200px — the Bootstrap set, and as good a choice as any.</p>`
});


PG.add({
  id:'s08-agency', section:'s08', slug:'agency-project', lesson:'8.5', project:true,
  title:'Web Design Agency Project',
  blurb:'A full landing page pulling together floats, the box model, and <code>&lt;span&gt;</code> for colouring part of a headline.',
  tasks:[
    'Wrap the word "Creative" in a <code>&lt;span&gt;</code> and colour just that word midnightblue.',
    'Float the two cards so they sit side by side, and float each card image left so the text wraps.',
    'Clear the footer so it drops below both cards.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Design Agency</title>
</head>
<body>
  <div class="main">
    <!-- TODO 1: wrap "Creative" in a span with class "creative" -->
    <h1>We are a Creative <br />Design Agency</h1>

    <div class="left card">
      <img class="tile-image" src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=70" alt="beauty" />
      <h2 class="card-title">Beauty</h2>
      <p class="card-text">We strive to create the most beautiful websites for all your
        needs, working closely with you at every step.</p>
    </div>

    <div class="right card">
      <img class="tile-image" src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&q=70" alt="construction" />
      <h2 class="card-title">Construction</h2>
      <p class="card-text">Built by our team of professional developers, from scratch,
        using nothing but HTML and CSS.</p>
    </div>
  </div>

  <footer>
    <p>Create. Develop. Design.</p>
  </footer>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  margin: 30px;
  background-color: #faf9f6;
}

h1 {
  font-size: 3rem;
}

/* TODO 1: .creative -> midnightblue */

.card {
  width: 45%;
  /* TODO 2: the cards need to sit side by side */
}

.tile-image {
  height: 120px;
  margin-right: 20px;
  /* TODO 2b: float this so the text wraps around it */
}

footer {
  text-align: right;
  color: midnightblue;
  /* TODO 3: clear the floats */
}
`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Design Agency</title>
</head>
<body>
  <div class="main">
    <h1>We are a <span class="creative">Creative</span> <br />Design Agency</h1>

    <div class="left card">
      <img class="tile-image" src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=70" alt="beauty" />
      <h2 class="card-title">Beauty</h2>
      <p class="card-text">We strive to create the most beautiful websites for all your
        needs, working closely with you at every step.</p>
    </div>

    <div class="right card">
      <img class="tile-image" src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&q=70" alt="construction" />
      <h2 class="card-title">Construction</h2>
      <p class="card-text">Built by our team of professional developers, from scratch,
        using nothing but HTML and CSS.</p>
    </div>
  </div>

  <footer>
    <p>Create. Develop. Design.</p>
  </footer>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  margin: 30px;
  background-color: #faf9f6;
}

h1 {
  font-size: 3rem;
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
  height: 120px;
  margin-right: 20px;
  float: left;
}

footer {
  text-align: right;
  color: midnightblue;
  clear: both;
}
`},
  notes:`
    <h3>Span</h3>
    <p><code>&lt;span&gt;</code> is the inline twin of <code>&lt;div&gt;</code>: it has no appearance of its own and does not break the line, so it exists purely to let you grab <em>part</em> of a piece of text and style it.</p>
    <pre>&lt;h1&gt;We are a &lt;span class="creative"&gt;Creative&lt;/span&gt; Design Agency&lt;/h1&gt;</pre>
    <h3>Go further</h3>
    <ul>
      <li>Rebuild the two cards with flexbox once you have done section 9 — compare how much less fighting it takes.</li>
      <li>Add a media query so the cards stack on a phone.</li>
    </ul>`
});
