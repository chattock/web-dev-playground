/* ===== Section 11 — Bootstrap ===== */
/* Playground notes for this section:
   - the CSS pane is injected at the top of <head>, BEFORE the page's Bootstrap link, so it
     loses ties with Bootstrap. Rules that override Bootstrap live in a <style> block placed
     after the link (as the course does in 11.1 and 11.2).
   - Bootstrap's JS: when a page names the CDN bootstrap.bundle, the engine also injects its
     vendored copy, and two copies make dropdowns open and instantly close. Lesson 66 therefore
     loads the vendored file directly (vendor/bootstrap/bootstrap.bundle.min.js). */

PG.add({
  id:'s11-intro', index:64, udemyId:37368626, minutes:16, section:'s11', slug:'bootstrap-intro', kind:'build',
  title:'What is Bootstrap?',
  blurb:'Bootstrap is a ready-made CSS framework: link its stylesheet (usually from a <b>CDN</b>, servers that hand the file out from somewhere near the visitor) and style your HTML just by adding class names. It is quick, consistent and responsive, at the cost of class-heavy markup and designs that are harder to customise.',
  tasks:[
    'TODO 1: in the <code>&lt;head&gt;</code>, add Bootstrap\'s stylesheet: <code>&lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" /&gt;</code>. The page font changes at once: that is Bootstrap\'s base styling.',
    'TODO 2: open the <a href="https://getbootstrap.com/docs/5.3/components/card/" target="_blank" rel="noopener">Card page of the Bootstrap docs</a>, copy the first example and paste it inside <code>.flex-container</code>.',
    'TODO 3: the example\'s image has no real source. Point its <code>src</code> at <code>https://picsum.photos/seed/sunflower/600/400</code> and write <code>alt</code> text that describes what you see.',
    'TODO 4: centre the card with your own CSS in the <code>&lt;style&gt;</code> block, which sits <b>after</b> the Bootstrap link so your rules win any ties: <code>.flex-container</code> gets <code>display: flex</code>, <code>justify-content: center</code>, <code>align-items: center</code> and <code>height: 100vh</code>.',
    'Swap the button\'s <code>btn-primary</code> for <code>btn-success</code>, then <code>btn-outline-dark</code>: every look is one class name away. Change the card text to something of your own.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap</title>
  <!-- TODO 1: Bootstrap's CSS link goes here -->

  <style>
    /* TODO 4: centre the card in the window */
    .flex-container {
    }
  </style>
</head>
<body>
  <div class="flex-container">
    <!-- TODO 2: paste the first example from the Card page of the Bootstrap docs -->

    <!-- TODO 3: give the card's <img> a real src and meaningful alt text.
         Image to use: https://picsum.photos/seed/sunflower/600/400 -->
  </div>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

  <style>
    .flex-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div class="flex-container">
    <div class="card" style="width: 18rem">
      <img src="https://picsum.photos/seed/sunflower/600/400" class="card-img-top" alt="Placeholder photo from picsum.photos (describe what yours shows)" />
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Bootstrap gave this card its border, rounded corners, spacing and button. No CSS of our own was needed.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</body>
</html>`},
  quiz:[
    { q:'What is Bootstrap?', options:['A JavaScript framework for building servers','A pre-written CSS framework (plus optional JavaScript) used by adding class names','A code editor','A browser extension'], answer:1, why:'Its stylesheet already contains the rules; you pick the look by giving elements its class names.' },
    { q:'What does a CDN do for you?', options:['Minifies your own CSS','Serves a file such as bootstrap.min.css from servers spread around the world, close to each visitor','Checks your HTML for errors','Hosts your whole website for free'], answer:1, why:'A Content Delivery Network keeps copies of the file in many places, so it downloads quickly wherever the visitor is.' },
    { q:'Your rule <code>.card { border-radius: 0; }</code> has no effect. What is the most likely cause?', options:['Bootstrap cards cannot be changed','Your CSS loads before the Bootstrap link, so Bootstrap\'s equally specific rule comes later and wins','border-radius is not allowed on divs','You need a CDN for your own CSS'], answer:1, why:'With equal specificity the later rule wins, so your styles must come after Bootstrap\'s link.' },
    { q:'Which is a genuine downside of a CSS framework?', options:['It only works on desktop','Class bloat in the HTML, and extra effort to customise a very specific design','It stops you using flexbox','It cannot be used with images'], answer:1, why:'Styling moves into long class lists, and pixel-perfect custom designs mean overriding a lot of the framework.' },
    { q:'What does the <code>.min</code> in <code>bootstrap.min.css</code> mean?', options:['A minimal version with fewer components','Minified: whitespace and comments removed so the file is smaller','It is for mobile only','It needs a minimum browser version'], answer:1, why:'Minified files are unreadable for people but behave exactly the same and load faster.' },
  ],
  explore:[
  {
    title:'Plain HTML vs a few Bootstrap classes', height:470,
    note:'One plain <code>&lt;button&gt;</code>. Tick classes on and off: every look comes from CSS that is already in Bootstrap\'s stylesheet.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="c-btn" checked> btn</label>
  <label>colour
    <select id="col"><option value="">(none)</option><option selected>btn-primary</option><option>btn-success</option><option>btn-danger</option><option>btn-warning</option><option>btn-outline-dark</option></select>
  </label>
  <label>size <select id="sz"><option value="">(normal)</option><option>btn-sm</option><option>btn-lg</option></select></label>
  <label><input type="checkbox" id="c-pill"> rounded-pill</label>
  <label><input type="checkbox" id="c-shadow"> shadow</label>
</div>
<div class="stage" style="padding:0">
  <iframe id="fr" style="width:100%;height:150px;border:0;display:block"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var fr = document.getElementById('fr');
  fr.srcdoc = '<!DOCTYPE html><html><head><link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet"></head>' +
    '<body class="p-4 d-flex gap-4 align-items-center"><button id="b">Sign up</button><span class="text-secondary small">the same element, restyled by class names only</span></body></html>';
  function upd(){
    var d = fr.contentDocument, b = d && d.getElementById('b');
    if (!b) return;
    var cls = [];
    if (document.getElementById('c-btn').checked) cls.push('btn');
    ['col','sz'].forEach(function(id){ var v = document.getElementById(id).value; if (v) cls.push(v); });
    if (document.getElementById('c-pill').checked) cls.push('rounded-pill');
    if (document.getElementById('c-shadow').checked) cls.push('shadow');
    b.className = cls.join(' ');
    document.getElementById('ro').textContent = '<button class="' + cls.join(' ') + '">Sign up</button>\\n\\n' +
      (cls.length ? cls.length + ' class name(s), zero lines of your own CSS.' : 'No classes: Bootstrap still resets the font, but the button is the browser default.') +
      (cls.indexOf('btn') < 0 && cls.length ? '\\nWithout the base btn class the colour classes only half work: btn supplies the padding, border and radius.' : '');
  }
  fr.addEventListener('load', upd);
  document.addEventListener('change', upd);
<\/script>`
  },
  {
    title:'Who wins: your CSS or Bootstrap\'s?', height:500,
    note:'The same custom rules (a pink border on <code>.card</code>, a pink <code>.btn</code>), placed before or after the Bootstrap link. Equal specificity, so the one that comes later wins.',
    html:`
<div class="knobs">
  <label>your &lt;style&gt; block goes
    <select id="ord"><option value="after" selected>after the Bootstrap link</option><option value="before">before the Bootstrap link</option></select>
  </label>
</div>
<div class="stage" style="padding:0">
  <iframe id="fr" style="width:100%;height:210px;border:0;display:block"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var mine = '<style>.card{border:4px solid hotpink;border-radius:0}.btn{background-color:hotpink;border-color:hotpink}</style>';
  var link = '<link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet">';
  function upd(){
    var after = document.getElementById('ord').value === 'after';
    document.getElementById('fr').srcdoc = '<!DOCTYPE html><html><head>' + (after ? link + mine : mine + link) + '</head><body class="p-3">' +
      '<div class="card" style="width:16rem"><div class="card-body"><h5 class="card-title">A card</h5><p class="card-text">Is my border pink?</p><a href="#" class="btn btn-primary">A button</a></div></div></body></html>';
    document.getElementById('ro').textContent = '<head>\\n' + (after ? '  <link href="bootstrap.min.css">\\n  <style> .card { border: 4px solid hotpink; } ... </style>' : '  <style> .card { border: 4px solid hotpink; } ... </style>\\n  <link href="bootstrap.min.css">') + '\\n</head>\\n\\n' +
      (after ? 'Your rules come last, so they win: pink card, pink button.' : 'Bootstrap comes last and its .card and .btn rules are just as specific, so they win: your pink is overridden.');
  }
  document.getElementById('ord').addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Adding Bootstrap</h3>
    <pre>&lt;!-- in &lt;head&gt; --&gt;
&lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"&gt;
&lt;!-- your own stylesheet, AFTER Bootstrap --&gt;
&lt;link rel="stylesheet" href="styles.css"&gt;

&lt;!-- just before &lt;/body&gt;, only for interactive parts (menus, dropdowns, carousels) --&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"&gt;&lt;/script&gt;</pre>
    <p>The link copied from the docs also carries <code>integrity</code> and <code>crossorigin</code> attributes. <code>integrity</code> is a hash of the file: if the CDN ever served something different, the browser would refuse it.</p>
    <h3>When to reach for it</h3>
    <p>Good fit: a responsive, polished site that has to go live quickly. Poor fit: a tiny page, or a bespoke design where you want control of every pixel. Either way it sits on top of the CSS you already know; it does not replace it.</p>
    <h3>In this playground</h3>
    <p>The <code>style.css</code> pane is loaded before anything in your <code>&lt;head&gt;</code>, so in Bootstrap lessons put overriding rules in a <code>&lt;style&gt;</code> block after the Bootstrap link, as this lesson does.</p>`
});


PG.add({
  id:'l065', index:65, udemyId:37388840, minutes:21, section:'s11', slug:'bootstrap-layout', kind:'build',
  title:'Bootstrap Layout',
  blurb:'Bootstrap layout is three nested pieces: a <code>.container</code>, a <code>.row</code> inside it and columns inside that. Each row has 12 slots: <code>col-4</code> takes four of them, a plain <code>col</code> shares what is left, and an infix such as <code>col-md-4</code> applies from that breakpoint <b>upwards</b> (sm 576, md 768, lg 992, xl 1200, xxl 1400px), with columns full width below it.',
  tasks:[
    'Warm-up: the three plain <code>col</code> divs share the row equally. Change them to <code>col-2</code>, <code>col-4</code> and <code>col-6</code> (2 + 4 + 6 = 12, a full row). Then try <code>col-2</code>, <code>col-4</code> and a plain <code>col</code>: the plain one takes whatever is left.',
    'Exercise 1: make the two divs half width from the <b>xl</b> breakpoint (1200px) up and full width below it. The badge at the top shows the current breakpoint; press <b>↗ open</b> and drag the window edge to test widths the preview pane cannot reach.',
    'Exercise 2: match the target at every width: 6 / 3 / 3 from <b>lg</b> up; between <b>sm</b> and lg the first div full width and the other two half each; below sm, every div 10 of the 12 slots. One element can carry several classes, e.g. <code>class="col-10 col-sm-6 col-lg-3"</code>.',
    'Exercise 3: two divs whose split changes at every breakpoint: 1 + 11 at xxl, 2 + 10 at xl, 4 + 8 at lg, 6 + 6 at md, stacked below md. Work from the largest screen down.',
    'Change the outer <code>container</code> to <code>container-fluid</code> and compare the side margins at full width and at <b>Phone 375</b>. Then try <code>container-lg</code>: full width below lg, a normal container from lg up.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap Layout</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    body { padding-bottom: 2rem; }
    h2 { font-size: 1.1rem; margin: 1.6rem 0 .4rem; }
    .label { font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; color: #6c757d; margin: .4rem 0 .2rem; }
    .box { padding: .6rem .3rem; margin-bottom: .5rem; text-align: center; font-size: .85rem; border-radius: .3rem; color: #123; }
    .a { background: #8ecae6; }
    .b { background: #ffb703; }
    .c { background: #b7e4c7; }
    .bp { position: sticky; top: 0; z-index: 1; background: #212529; color: #fff; padding: .35rem .75rem; font-size: .85rem; }

    /* ===== The targets =====
       Written as plain media queries rather than Bootstrap classes,
       so you still have to work out which classes produce them. */
    .demo > div { flex: 0 0 auto; width: 100%; }

    .demo2 > div { width: 83.333%; }
    @media (min-width: 576px) { .demo2 > div { width: 50%; } .demo2 > div:first-child { width: 100%; } }
    @media (min-width: 992px) { .demo2 > div { width: 25%; } .demo2 > div:first-child { width: 50%; } }

    @media (min-width: 1200px) { .demo1 > div { width: 50%; } }

    @media (min-width: 768px)  { .demo3 > div { width: 50%; } }
    @media (min-width: 992px)  { .demo3 > div:first-child { width: 33.333%; } .demo3 > div:last-child { width: 66.667%; } }
    @media (min-width: 1200px) { .demo3 > div:first-child { width: 16.667%; } .demo3 > div:last-child { width: 83.333%; } }
    @media (min-width: 1400px) { .demo3 > div:first-child { width: 8.333%; }  .demo3 > div:last-child { width: 91.667%; } }
  </style>
</head>
<body>
  <p class="bp">Breakpoint now:
    <b class="d-sm-none">xs (under 576px)</b>
    <b class="d-none d-sm-inline d-md-none">sm (576px and up)</b>
    <b class="d-none d-md-inline d-lg-none">md (768px and up)</b>
    <b class="d-none d-lg-inline d-xl-none">lg (992px and up)</b>
    <b class="d-none d-xl-inline d-xxl-none">xl (1200px and up)</b>
    <b class="d-none d-xxl-inline">xxl (1400px and up)</b>
  </p>

  <div class="container">

    <h2>Warm-up: twelve slots</h2>
    <div class="row">
      <!-- TODO: col-2, col-4, col-6 -->
      <div class="col"><div class="box a">A</div></div>
      <div class="col"><div class="box b">B</div></div>
      <div class="col"><div class="box c">C</div></div>
    </div>

    <h2>Exercise 1: half width from xl up, full width below</h2>
    <p class="label">Target</p>
    <div class="row demo demo1">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <!-- TODO: add column classes to these two divs -->
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>

    <h2>Exercise 2: changes at lg and at sm</h2>
    <p class="label">Target</p>
    <div class="row demo demo2">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
      <div><div class="box c">3</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <!-- TODO -->
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
      <div><div class="box c">3</div></div>
    </div>

    <h2>Exercise 3: a different split at every breakpoint</h2>
    <p class="label">Target</p>
    <div class="row demo demo3">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <!-- TODO -->
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>

  </div>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap Layout</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    body { padding-bottom: 2rem; }
    h2 { font-size: 1.1rem; margin: 1.6rem 0 .4rem; }
    .label { font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; color: #6c757d; margin: .4rem 0 .2rem; }
    .box { padding: .6rem .3rem; margin-bottom: .5rem; text-align: center; font-size: .85rem; border-radius: .3rem; color: #123; }
    .a { background: #8ecae6; }
    .b { background: #ffb703; }
    .c { background: #b7e4c7; }
    .bp { position: sticky; top: 0; z-index: 1; background: #212529; color: #fff; padding: .35rem .75rem; font-size: .85rem; }

    /* ===== The targets =====
       Written as plain media queries rather than Bootstrap classes,
       so you still have to work out which classes produce them. */
    .demo > div { flex: 0 0 auto; width: 100%; }

    .demo2 > div { width: 83.333%; }
    @media (min-width: 576px) { .demo2 > div { width: 50%; } .demo2 > div:first-child { width: 100%; } }
    @media (min-width: 992px) { .demo2 > div { width: 25%; } .demo2 > div:first-child { width: 50%; } }

    @media (min-width: 1200px) { .demo1 > div { width: 50%; } }

    @media (min-width: 768px)  { .demo3 > div { width: 50%; } }
    @media (min-width: 992px)  { .demo3 > div:first-child { width: 33.333%; } .demo3 > div:last-child { width: 66.667%; } }
    @media (min-width: 1200px) { .demo3 > div:first-child { width: 16.667%; } .demo3 > div:last-child { width: 83.333%; } }
    @media (min-width: 1400px) { .demo3 > div:first-child { width: 8.333%; }  .demo3 > div:last-child { width: 91.667%; } }
  </style>
</head>
<body>
  <p class="bp">Breakpoint now:
    <b class="d-sm-none">xs (under 576px)</b>
    <b class="d-none d-sm-inline d-md-none">sm (576px and up)</b>
    <b class="d-none d-md-inline d-lg-none">md (768px and up)</b>
    <b class="d-none d-lg-inline d-xl-none">lg (992px and up)</b>
    <b class="d-none d-xl-inline d-xxl-none">xl (1200px and up)</b>
    <b class="d-none d-xxl-inline">xxl (1400px and up)</b>
  </p>

  <div class="container">

    <h2>Warm-up: twelve slots</h2>
    <div class="row">
      <div class="col-2"><div class="box a">A</div></div>
      <div class="col-4"><div class="box b">B</div></div>
      <div class="col-6"><div class="box c">C</div></div>
    </div>

    <h2>Exercise 1: half width from xl up, full width below</h2>
    <p class="label">Target</p>
    <div class="row demo demo1">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <div class="col-xl-6"><div class="box a">1</div></div>
      <div class="col-xl-6"><div class="box b">2</div></div>
    </div>

    <h2>Exercise 2: changes at lg and at sm</h2>
    <p class="label">Target</p>
    <div class="row demo demo2">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
      <div><div class="box c">3</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <div class="col-10 col-sm-12 col-lg-6"><div class="box a">1</div></div>
      <div class="col-10 col-sm-6 col-lg-3"><div class="box b">2</div></div>
      <div class="col-10 col-sm-6 col-lg-3"><div class="box c">3</div></div>
    </div>

    <h2>Exercise 3: a different split at every breakpoint</h2>
    <p class="label">Target</p>
    <div class="row demo demo3">
      <div><div class="box a">1</div></div>
      <div><div class="box b">2</div></div>
    </div>
    <p class="label">Yours</p>
    <div class="row">
      <div class="col-md-6 col-lg-4 col-xl-2 col-xxl-1"><div class="box a">1</div></div>
      <div class="col-md-6 col-lg-8 col-xl-10 col-xxl-11"><div class="box b">2</div></div>
    </div>

  </div>
</body>
</html>`},
  quiz:[
    { q:'What does <code>col-md-4</code> mean?', options:['4 slots wide on medium screens only','4 of the 12 slots from the md breakpoint (768px) upwards, full width below it','4 pixels of margin','Column number 4'], answer:1, why:'Infix classes are min-width rules: they apply at their breakpoint and every size above, until a larger infix overrides them.' },
    { q:'A row holds <code>col-2</code>, <code>col-4</code> and a plain <code>col</code>. How wide is the plain one?', options:['2 slots','6 slots: whatever is left of the 12','12 slots','It wraps to a new line'], answer:1, why:'A plain col shares out the remaining space, here 12 − 2 − 4 = 6.' },
    { q:'Three columns in one row are <code>col-6</code>, <code>col-4</code> and <code>col-4</code>. What happens?', options:['They squeeze into one row','The last column wraps onto a new line','Bootstrap shrinks them to fit','Nothing is shown'], answer:1, why:'6 + 4 + 4 = 14 is more than 12, so the column that does not fit moves down.' },
    { q:'What is the difference between <code>container</code> and <code>container-fluid</code>?', options:['None','container-fluid is always 100% wide; container has a maximum width that steps up at each breakpoint','container-fluid only works on phones','container is for rows, container-fluid for columns'], answer:1, why:'Use container for content with margins at the sides, container-fluid for edge-to-edge layouts.' },
    { q:'A div has <code>class="col-md-8 col-lg-4"</code>. How many slots does it take on an 800px-wide screen?', options:['4','8','12','6'], answer:1, why:'800px is at least md (768) but below lg (992), so col-md-8 is the rule in force.' },
  ],
  explore:[
  {
    title:'The 12-column system', height:540,
    note:'Every row is 12 units wide. Set how many units each column takes; if they add up to more than 12 the extras wrap onto a new line.',
    html:`
<div class="knobs">
  <label>column A <input type="range" min="1" max="12" value="4" id="a"><span class="val" id="av">4</span></label>
  <label>column B <input type="range" min="1" max="12" value="4" id="b"><span class="val" id="bv">4</span></label>
  <label>column C <input type="range" min="1" max="12" value="4" id="c"><span class="val" id="cv">4</span></label>
</div>
<div class="stage">
  <div style="display:flex;gap:2px;margin-bottom:8px">
    <div style="flex:1;height:16px;background:#e9edf7;border-radius:2px;font-size:9px;text-align:center;color:#98a0b8" class="ruler">1</div>
  </div>
  <div id="row" style="display:flex;flex-wrap:wrap;gap:0"></div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">Bootstrap builds these columns with flexbox under the hood: <code>col-4</code> is just <code>flex: 0 0 auto; width: 33.33%</code>. Knowing section 9 means you already know how Bootstrap works.</p>
<script>
  var ruler = document.querySelector('.ruler').parentElement;
  ruler.innerHTML = '';
  for (var i=1;i<=12;i++){
    var d = document.createElement('div');
    d.style.cssText='flex:1;height:16px;background:#e9edf7;border-radius:2px;font-size:9px;text-align:center;color:#98a0b8;line-height:16px';
    d.textContent=i; ruler.appendChild(d);
  }
  var cols=['a','b','c'], colours=['#5b9cff','#7ee0a8','#ffcf6b'];
  function upd(){
    var row = document.getElementById('row'); row.innerHTML='';
    var total=0, code='<div class="row">\\n';
    cols.forEach(function(id,i){
      var v = +document.getElementById(id).value;
      document.getElementById(id+'v').textContent = v;
      total += v;
      var d=document.createElement('div');
      d.style.cssText='width:'+(v/12*100)+'%;background:'+colours[i]+';padding:14px 6px;text-align:center;'+
        'font-weight:700;font-size:13px;color:#123;border:2px solid #fff;box-sizing:border-box';
      d.textContent='col-'+v;
      row.appendChild(d);
      code += '  <div class="col-' + v + '">…</div>\\n';
    });
    code += '</div>';
    document.getElementById('ro').textContent = code + '\\n\\ntotal: ' + total + ' / 12' +
      (total>12 ? '   -> over 12, so the column that does not fit wraps to a new line' :
       total<12 ? '   -> under 12, leaving ' + (12-total) + ' units of empty space' :
       '   -> a perfect row');
  }
  cols.forEach(function(id){ document.getElementById(id).addEventListener('input', upd); });
  upd();
<\/script>`
  },
  {
    title:'Breakpoints and containers', height:600,
    note:'A simulated screen you can make as wide as 1500px (it is scaled down to fit). The three columns are <code>col-12 col-md-6 col-lg-4</code>; the dashed outline is the container. Watch both change as you cross each breakpoint.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="320" max="1500" value="1000" id="w"><span class="val" id="wv"></span></label>
  <label>outer element
    <select id="ct"><option>container</option><option>container-fluid</option><option>container-lg</option></select>
  </label>
  <span class="tag" id="bp"></span>
</div>
<div class="stage" id="stg" style="padding:8px">
  <div id="sizer" style="overflow:hidden">
    <div id="frame" style="border:2px solid #b9c0d4;border-radius:8px;overflow:hidden;transform-origin:top left">
      <iframe id="fr" style="width:100%;height:240px;border:0;display:block"></iframe>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var fr = document.getElementById('fr'), w = document.getElementById('w'), ct = document.getElementById('ct');
  var BPS = [['xs',0],['sm',576],['md',768],['lg',992],['xl',1200],['xxl',1400]];
  function page(cls){
    return '<!DOCTYPE html><html><head><link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet"><style>' +
      '.cx{outline:3px dashed #d6336c;outline-offset:-3px;padding-top:12px;padding-bottom:12px}.bx{padding:22px 6px;text-align:center;font-weight:700;font-size:14px;margin-bottom:8px;border-radius:6px}' +
      '</style></head><body style="background:#f1f3f5">' +
      '<div class="cx ' + cls + '"><div class="row g-2">' +
      '<div class="col-12 col-md-6 col-lg-4"><div class="bx" style="background:#5b9cff;color:#fff">col-12 col-md-6 col-lg-4</div></div>' +
      '<div class="col-12 col-md-6 col-lg-4"><div class="bx" style="background:#7ee0a8">col-12 col-md-6 col-lg-4</div></div>' +
      '<div class="col-12 col-md-6 col-lg-4"><div class="bx" style="background:#ffcf6b">col-12 col-md-6 col-lg-4</div></div>' +
      '</div></div></body></html>';
  }
  function upd(){
    var v = +w.value, avail = document.getElementById('stg').clientWidth - 20, k = Math.min(1, avail / v);
    var fm = document.getElementById('frame');
    fm.style.width = v + 'px'; fm.style.transform = 'scale(' + k + ')';
    document.getElementById('sizer').style.height = Math.ceil(244 * k) + 'px';
    document.getElementById('wv').textContent = v + 'px';
    var cur = BPS.filter(function(b){ return v >= b[1]; }).pop();
    document.getElementById('bp').textContent = 'breakpoint: ' + cur[0];
    setTimeout(function(){
      var cx = fr.contentDocument && fr.contentDocument.querySelector('.cx');
      var cw = cx ? Math.round(cx.getBoundingClientRect().width) : 0;
      document.getElementById('ro').textContent =
        'sm >= 576    md >= 768    lg >= 992    xl >= 1200    xxl >= 1400\\n\\n' +
        'screen ' + v + 'px  ->  ' + cur[0] + (k < 1 ? '   (drawn at ' + Math.round(k * 100) + '% to fit)' : '') + '\\n' +
        '.' + ct.value + ' is ' + cw + 'px wide\\n' +
        (v < 768 ? 'below md: col-12 applies, so the columns stack' : v < 992 ? 'md: col-md-6 applies, two per row (the third wraps)' : 'lg and up: col-lg-4 applies, three per row');
    }, 60);
  }
  ct.addEventListener('change', function(){ fr.srcdoc = page(ct.value); });
  fr.addEventListener('load', upd);
  w.addEventListener('input', upd);
  fr.srcdoc = page(ct.value);
<\/script>`
  }],
  notes:`
    <h3>The breakpoints</h3>
    <table>
      <tr><th>Infix</th><th>Applies from</th><th>Typical device</th><th><code>.container</code> max width</th></tr>
      <tr><td>(none)</td><td>0</td><td>small phones</td><td>100%</td></tr>
      <tr><td><code>sm</code></td><td>576px</td><td>phones</td><td>540px</td></tr>
      <tr><td><code>md</code></td><td>768px</td><td>tablets</td><td>720px</td></tr>
      <tr><td><code>lg</code></td><td>992px</td><td>laptops</td><td>960px</td></tr>
      <tr><td><code>xl</code></td><td>1200px</td><td>desktops</td><td>1140px</td></tr>
      <tr><td><code>xxl</code></td><td>1400px</td><td>large screens</td><td>1320px</td></tr>
    </table>
    <h3>Finding a breakpoint by eye</h3>
    <p>In Chrome DevTools, turn on the device toolbar, choose <b>Responsive</b> and drag the width. When the layout jumps, read the pixel width: a jump at 1200px means an <code>xl</code> class is at work. The lecture's original version of these exercises is the <a href="https://appbrewery.github.io/bootstrap-layout/" target="_blank" rel="noopener">Bootstrap layout practice page</a>.</p>`
});


PG.add({
  id:'s11-components', index:66, udemyId:37389818, minutes:32, section:'s11', slug:'bootstrap-components', kind:'build',
  title:'Bootstrap Components',
  blurb:'Components are pre-styled pieces of interface (buttons, navbars, cards, carousels, footers) made from ordinary HTML plus Bootstrap\'s classes. The workflow is: find one in the docs or the Examples pages, copy it, paste it, then change the words, images and classes. This lecture builds a one-page site for the moving company <b>Move It</b> that way.',
  tasks:[
    'Challenge 1: find <a href="https://getbootstrap.com/docs/5.3/components/buttons/" target="_blank" rel="noopener">Buttons</a> in the docs and put a green button that says <b>Ok</b> where TODO 1 is. Two classes: <code>btn</code> for the shape, <code>btn-success</code> for the colour.',
    'The navbar is already pasted in from the docs. The preview is narrower than 992px, so its links hide behind a menu button that does nothing yet: collapsing menus and dropdowns need Bootstrap\'s JavaScript. Add <code>&lt;script src="vendor/bootstrap/bootstrap.bundle.min.js"&gt;&lt;/script&gt;</code> just before <code>&lt;/body&gt;</code> and try the menu and the dropdown. (In your own projects paste the jsDelivr link from the docs; the playground serves the same file locally, and loading both at once makes dropdowns open and instantly close.)',
    'Make the navbar Move It\'s: brand <b>Move It</b> with the box icon from the comment, rename <b>Link</b> to <b>About</b> and <b>Dropdown</b> to <b>Services</b>, delete the <b>Disabled</b> item, and change the search box placeholder to <b>Postcode</b> and its button to <b>Check</b>.',
    'Hero: build a centred hero (Examples → Heroes): an <code>&lt;h1 class="display-4 fw-bold"&gt;</code> reading <b>Move With Joy</b>, the paragraph from the comment with class <code>lead</code>, two large buttons <b>Get a Quote</b> and <b>Contact Us</b>, and the van picture with <code>img-fluid border rounded-3 shadow-lg</code>.',
    'Features: a <b>Why Move With Us?</b> heading and three columns in <code>row g-4 py-5 row-cols-1 row-cols-lg-3</code> for <b>Professional</b>, <b>Countrywide</b> and <b>Personal Touch</b>, each topped with an icon square. The squares only take shape once you add the Examples page\'s own rule to the <code>&lt;style&gt;</code> block: <code>.feature-icon { width: 4rem; height: 4rem; border-radius: .75rem; }</code>.',
    'Challenge 2: add a carousel with indicators (Components → Carousel) showing the three photos from the comment. Wrap it in a <code>container</code> so it lines up with the rest of the page, and check that the carousel\'s <code>id</code> matches every <code>data-bs-target</code>.',
    'Finish with a footer from Examples → Footers. Then add <code>data-bs-theme="dark"</code> to the <code>&lt;html&gt;</code> tag and the whole page switches to dark mode (take it out again if you prefer light).'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Move It</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    /* Your own CSS. It comes after the Bootstrap link, so it wins ties. */
  </style>
</head>
<body>
  <!-- Pasted straight from the docs (Components > Navbar). TODO 3: make it Move It's.
       Brand icon to use (a small inline SVG):
       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M8 1 1.5 4v8L8 15l6.5-3V4L8 1Zm0 1.1 5.2 2.4L8 6.9 2.8 4.5 8 2.1ZM2.5 5.3l5 2.3v6.2l-5-2.3V5.3Zm6 8.5V7.6l5-2.3v6.2l-5 2.3Z"/></svg>
  -->
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Dropdown
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <div class="container py-3">
    <!-- TODO 1: a green button that says Ok -->
  </div>

  <!-- TODO 4: hero
       Heading: Move With Joy
       Paragraph: We are a small, friendly moving company that thinks moving house can be calm,
       quick and even fun. Tell us where you are going and we will handle the boxes, the van
       and the heavy lifting.
       Buttons: Get a Quote, Contact Us
       Image: https://picsum.photos/seed/movingvan/700/500 -->

  <!-- TODO 5: features, heading "Why Move With Us?"
       Professional: Our movers are trained to pack carefully, load efficiently and treat every
       box as if it held something precious, because it usually does.
       Countrywide: Across town or across the country, one team handles packing, transport and
       unpacking, with a clear price agreed before we start.
       Personal Touch: You get one coordinator from the first call to the last box, so someone
       always knows your move inside out.
       Icons: 💼 🚚 💬 (emoji stand in for the course's icon files) -->

  <!-- TODO 6: carousel with indicators, inside a .container. Photos:
       https://picsum.photos/seed/movingcouple/1200/500
       https://picsum.photos/seed/movingdog/1200/500
       https://picsum.photos/seed/movingfamily/1200/500 -->

  <!-- TODO 7: footer -->

  <!-- TODO 2: Bootstrap's JavaScript goes here, just before </body> -->
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Move It</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    /* copied from the Features example page: it is not part of Bootstrap itself */
    .feature-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 0.75rem;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center gap-2" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M8 1 1.5 4v8L8 15l6.5-3V4L8 1Zm0 1.1 5.2 2.4L8 6.9 2.8 4.5 8 2.1ZM2.5 5.3l5 2.3v6.2l-5-2.3V5.3Zm6 8.5V7.6l5-2.3v6.2l-5 2.3Z"/></svg>
        Move It
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Services
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Packing</a></li>
              <li><a class="dropdown-item" href="#">Storage</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Long-distance moves</a></li>
            </ul>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Postcode" aria-label="Postcode" />
          <button class="btn btn-outline-success" type="submit">Check</button>
        </form>
      </div>
    </div>
  </nav>

  <div class="container py-3">
    <button type="button" class="btn btn-success">Ok</button>
  </div>

  <div class="px-4 pt-5 my-5 text-center border-bottom">
    <h1 class="display-4 fw-bold text-body-emphasis">Move With Joy</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">
        We are a small, friendly moving company that thinks moving house can be calm,
        quick and even fun. Tell us where you are going and we will handle the boxes, the van
        and the heavy lifting.
      </p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
        <button type="button" class="btn btn-primary btn-lg px-4 me-sm-3">Get a Quote</button>
        <button type="button" class="btn btn-outline-secondary btn-lg px-4">Contact Us</button>
      </div>
    </div>
    <div class="overflow-hidden" style="max-height: 30vh">
      <div class="container px-5">
        <img src="https://picsum.photos/seed/movingvan/700/500" class="img-fluid border rounded-3 shadow-lg mb-4"
          alt="Placeholder photo standing in for the moving van" width="700" height="500" loading="lazy" />
      </div>
    </div>
  </div>

  <div class="container px-4 py-5" id="featured-3">
    <h2 class="pb-2 border-bottom">Why Move With Us?</h2>
    <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <div class="feature col">
        <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">💼</div>
        <h3 class="fs-2 text-body-emphasis">Professional</h3>
        <p>Our movers are trained to pack carefully, load efficiently and treat every box as if it held something precious, because it usually does.</p>
        <a href="#" class="icon-link">Get a quote ›</a>
      </div>
      <div class="feature col">
        <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">🚚</div>
        <h3 class="fs-2 text-body-emphasis">Countrywide</h3>
        <p>Across town or across the country, one team handles packing, transport and unpacking, with a clear price agreed before we start.</p>
        <a href="#" class="icon-link">Get a quote ›</a>
      </div>
      <div class="feature col">
        <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">💬</div>
        <h3 class="fs-2 text-body-emphasis">Personal Touch</h3>
        <p>You get one coordinator from the first call to the last box, so someone always knows your move inside out.</p>
        <a href="#" class="icon-link">Get a quote ›</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div id="carouselExampleIndicators" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="https://picsum.photos/seed/movingcouple/1200/500" class="d-block w-100" alt="Placeholder photo for slide 1" />
        </div>
        <div class="carousel-item">
          <img src="https://picsum.photos/seed/movingdog/1200/500" class="d-block w-100" alt="Placeholder photo for slide 2" />
        </div>
        <div class="carousel-item">
          <img src="https://picsum.photos/seed/movingfamily/1200/500" class="d-block w-100" alt="Placeholder photo for slide 3" />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

  <div class="container">
    <footer class="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
      <div class="col mb-3">
        <p class="fw-bold mb-1">Move It</p>
        <p class="text-body-secondary">&copy; 2026</p>
      </div>
      <div class="col mb-3"></div>
      <div class="col mb-3">
        <h5>Company</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Home</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">About</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Careers</a></li>
        </ul>
      </div>
      <div class="col mb-3">
        <h5>Services</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Packing</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Storage</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Long distance</a></li>
        </ul>
      </div>
      <div class="col mb-3">
        <h5>Help</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">FAQs</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Get a quote</a></li>
          <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Contact</a></li>
        </ul>
      </div>
    </footer>
  </div>

  <script src="vendor/bootstrap/bootstrap.bundle.min.js"></script>
</body>
</html>`},
  quiz:[
    { q:'Which classes make a green Bootstrap button?', options:['button-green','btn btn-success','btn-success only','green btn-primary'], answer:1, why:'btn gives the shape, padding and border; btn-success adds the green colour and hover state.' },
    { q:'The navbar\'s menu button and dropdown do nothing when clicked. What is missing?', options:['The Bootstrap CSS link','Bootstrap\'s JavaScript bundle, loaded before </body>','A container around the navbar','The navbar-brand class'], answer:1, why:'The CSS only styles them; collapsing and dropdown behaviour comes from bootstrap.bundle.min.js reading the data-bs-* attributes.' },
    { q:'A pasted Features example has strange-looking icon boxes. Why?', options:['Bootstrap is out of date','The example page uses some CSS of its own (.feature-icon) that is not in Bootstrap, so you must copy it too','Icons need JavaScript','The row is missing'], answer:1, why:'Examples pages add a few custom rules; find them with Inspect and copy them into your own stylesheet.' },
    { q:'What does <code>py-3</code> do?', options:['Padding of 3px on all sides','Padding on the top and bottom at spacing level 3 (1rem)','Margin on the left and right','Makes the element three times taller'], answer:1, why:'p = padding, y = top and bottom (x would be left and right), 3 = the third step of the spacing scale.' },
    { q:'How do you switch a whole Bootstrap page to dark mode?', options:['Add class="dark" to <body>','Add data-bs-theme="dark" to the <html> element','Load bootstrap-dark.css','Set background: black in your CSS'], answer:1, why:'Bootstrap 5.3 reads the data-bs-theme attribute; on <html> it themes the whole page, on one element just that part.' },
  ],
  explore:[
  {
    title:'Component catalogue', height:640,
    note:'Every one of these is pure Bootstrap classes, no CSS written. Copy any of it straight into the Build tab.',
    html:`
<div class="stage" style="padding:0;overflow:hidden">
  <iframe id="fr" style="width:100%;height:560px;border:0;display:block"></iframe>
</div>
<script>
  document.getElementById('fr').srcdoc =
  '<!DOCTYPE html><html><head><link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet">' +
  '<style>body{padding:16px;font-size:14px}h6{margin:18px 0 6px;text-transform:uppercase;letter-spacing:.5px;' +
  'font-size:11px;color:#6c757d}code{font-size:11.5px}</style></head><body>' +
  '<h6>buttons</h6>' +
  '<button class="btn btn-primary me-1">btn-primary</button>' +
  '<button class="btn btn-success me-1">btn-success</button>' +
  '<button class="btn btn-danger me-1">btn-danger</button>' +
  '<button class="btn btn-outline-primary me-1">btn-outline-primary</button>' +
  '<button class="btn btn-primary btn-sm me-1">btn-sm</button>' +
  '<button class="btn btn-primary btn-lg">btn-lg</button>' +
  '<h6>alerts</h6>' +
  '<div class="alert alert-warning py-2">alert alert-warning</div>' +
  '<div class="alert alert-success py-2 mb-0">alert alert-success</div>' +
  '<h6>badges &amp; spinner</h6>' +
  '<span class="badge text-bg-primary me-1">badge</span>' +
  '<span class="badge rounded-pill text-bg-danger me-2">rounded-pill</span>' +
  '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>' +
  '<h6>card</h6>' +
  '<div class="card" style="max-width:260px"><div class="card-body">' +
  '<h5 class="card-title">card-title</h5><p class="card-text mb-2">card-text goes here.</p>' +
  '<a href="#" class="btn btn-primary btn-sm">Go</a></div></div>' +
  '<h6>list group</h6>' +
  '<ul class="list-group" style="max-width:260px">' +
  '<li class="list-group-item">One</li><li class="list-group-item active">Two (active)</li>' +
  '<li class="list-group-item">Three</li></ul>' +
  '<h6>form controls</h6>' +
  '<div style="max-width:280px"><input class="form-control mb-2" placeholder="form-control">' +
  '<select class="form-select mb-2"><option>form-select</option></select>' +
  '<div class="form-check"><input class="form-check-input" type="checkbox" checked>' +
  '<label class="form-check-label">form-check</label></div></div>' +
  '</body></html>';
<\/script>`
  },
  {
    title:'Spacing utilities decoder', height:520,
    note:'Bootstrap spacing classes are <i>property</i> + <i>side</i> + <code>-</code> + <i>size</i>. Build one and see the CSS it stands for. Orange is margin, green is padding, as in DevTools.',
    html:`
<div class="knobs">
  <label>property <select id="p"><option value="m">m (margin)</option><option value="p" selected>p (padding)</option></select></label>
  <label>side
    <select id="s">
      <option value="">(none: all four sides)</option><option value="t">t (top)</option><option value="b">b (bottom)</option>
      <option value="s">s (start = left)</option><option value="e">e (end = right)</option>
      <option value="x">x (left and right)</option><option value="y" selected>y (top and bottom)</option>
    </select>
  </label>
  <label>size <select id="z"><option>0</option><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>auto</option></select></label>
</div>
<div class="stage" style="padding:0">
  <iframe id="fr" style="width:100%;height:200px;border:0;display:block"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var fr = document.getElementById('fr');
  fr.srcdoc = '<!DOCTYPE html><html><head><link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet"><style>' +
    'body{padding:24px}.wrap{background:#f9cc9d;display:inline-block;outline:1px dashed #adb5bd}#t{background:#c3e6cb}.content{background:#fff;padding:6px 12px;border:1px solid #adb5bd}' +
    '</style></head><body><div class="wrap"><div id="t"><div class="content">content</div></div></div></body></html>';
  var SIZE = { '0':'0', '1':'.25rem (4px)', '2':'.5rem (8px)', '3':'1rem (16px)', '4':'1.5rem (24px)', '5':'3rem (48px)', 'auto':'auto' };
  var SIDES = { '':['top','right','bottom','left'], t:['top'], b:['bottom'], s:['left'], e:['right'], x:['left','right'], y:['top','bottom'] };
  function upd(){
    var p = document.getElementById('p').value, s = document.getElementById('s').value, z = document.getElementById('z').value;
    var cls = p + s + '-' + z, prop = p === 'm' ? 'margin' : 'padding';
    var t = fr.contentDocument && fr.contentDocument.getElementById('t');
    if (t) t.className = cls;
    var css = SIDES[s].map(function(side){ return '  ' + prop + '-' + side + ': ' + SIZE[z] + ';'; }).join('\\n');
    document.getElementById('ro').textContent = 'class="' + cls + '"\\n\\n' +
      (p === 'p' && z === 'auto' ? 'There is no p-auto: auto only exists for margins (m-auto, mx-auto) because auto padding means nothing.' : '/* means */\\n' + css);
  }
  fr.addEventListener('load', upd);
  document.addEventListener('change', upd);
<\/script>`
  },
  {
    title:'Dark mode with one attribute', height:500,
    note:'Bootstrap 5.3 colour modes: <code>data-bs-theme="dark"</code> on <code>&lt;html&gt;</code> themes everything; on a single element it themes just that part.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="dk"> data-bs-theme="dark" on &lt;html&gt;</label>
  <label><input type="checkbox" id="dc"> data-bs-theme="dark" on the card only</label>
</div>
<div class="stage" style="padding:0">
  <iframe id="fr" style="width:100%;height:300px;border:0;display:block"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var fr = document.getElementById('fr');
  fr.srcdoc = '<!DOCTYPE html><html lang="en"><head><link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet"></head><body>' +
    '<nav class="navbar bg-body-tertiary px-3"><span class="navbar-brand">Move It</span><span class="text-body-secondary small">navbar with bg-body-tertiary</span></nav>' +
    '<div class="container py-3"><h4>Move With Joy</h4><p class="text-body-secondary">Ordinary text and a form control follow the theme too.</p>' +
    '<div class="d-flex gap-3 align-items-start"><div class="card" id="card" style="width:14rem"><div class="card-body"><h5 class="card-title">A card</h5><p class="card-text small">Its own theme can differ from the page.</p><a href="#" class="btn btn-primary btn-sm">Get a quote</a></div></div>' +
    '<input class="form-control" style="max-width:200px" placeholder="Postcode"></div></div></body></html>';
  function upd(){
    var d = fr.contentDocument; if (!d || !d.getElementById('card')) return;
    var dk = document.getElementById('dk').checked, dc = document.getElementById('dc').checked;
    if (dk) d.documentElement.setAttribute('data-bs-theme', 'dark'); else d.documentElement.removeAttribute('data-bs-theme');
    if (dc) d.getElementById('card').setAttribute('data-bs-theme', 'dark'); else d.getElementById('card').removeAttribute('data-bs-theme');
    document.getElementById('ro').textContent = '<html lang="en"' + (dk ? ' data-bs-theme="dark"' : '') + '>\\n  ...\\n  <div class="card"' + (dc ? ' data-bs-theme="dark"' : '') + '>';
  }
  fr.addEventListener('load', upd);
  document.addEventListener('change', upd);
<\/script>`
  }],
  notes:`
    <h3>How to actually use Bootstrap</h3>
    <p>Nobody memorises these classes. Open <a href="https://getbootstrap.com/docs/5.3/" target="_blank" rel="noopener">the docs</a> or the <a href="https://getbootstrap.com/docs/5.3/examples/" target="_blank" rel="noopener">Examples</a> page, find the piece you need, right-click it, choose Inspect, climb to the element that wraps the whole section, <b>Copy element</b>, paste, then change the words. That is the entire point of a framework.</p>
    <h3>Class families worth knowing</h3>
    <ul>
      <li><b>Spacing</b>: <code>m-*</code> / <code>p-*</code> with sides <code>t b s e x y</code> and sizes 0–5</li>
      <li><b>Colour</b>: <code>text-bg-primary</code>, <code>bg-body-tertiary</code>, <code>text-body-secondary</code></li>
      <li><b>Display and flex</b>: <code>d-none</code>, <code>d-flex</code>, <code>d-sm-flex</code>, <code>justify-content-center</code>, <code>gap-3</code></li>
      <li><b>Text</b>: <code>display-4</code>, <code>lead</code>, <code>fw-bold</code>, <code>fs-2</code></li>
    </ul>
    <h3>Icons and themes</h3>
    <p><a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener">Bootstrap Icons</a> are free: paste an icon's inline <code>&lt;svg&gt;</code>, or download the file and use an <code>&lt;img&gt;</code> with a height. For whole designs, free and paid Bootstrap themes and templates are a search away.</p>`
});


PG.add({
  id:'s11-tindog', index:67, udemyId:37389824, minutes:31, section:'s11', slug:'tindog-project', kind:'build', project:true,
  title:'TinDog Startup Website',
  blurb:'The section project: a landing page for TinDog, a dating app for dogs, assembled almost entirely from Bootstrap Examples and a few lines of your own CSS. Five sections (title, features, testimonial, pricing, footer), each built the same way: find the closest example, copy it, fix the text, images and classes, then compare.',
  tasks:[
    'Add Bootstrap\'s CSS link to the <code>&lt;head&gt;</code>, above the link to <code>css/style.css</code>: in a real project your own stylesheet has to load second so it wins ties.',
    'Title: in <code>#title</code>, build the hero with the image beside the text (<a href="https://getbootstrap.com/docs/5.3/examples/heroes/" target="_blank" rel="noopener">Examples → Heroes</a>): the headline and two Download buttons from the comment as <code>btn-light</code> and <code>btn-outline-light</code>, no paragraph, the placeholder phone image. Put <code>gradient-background</code> on the <code>&lt;section&gt;</code> itself, not on the container, and use <code>pt-5</code> instead of <code>py-5</code> to trim the space below.',
    'Features: in <code>#features</code>, a <code>container mt-5</code> holding <code>row g-4 py-5 row-cols-1 row-cols-lg-3</code> with three <code>col d-flex align-items-start</code> items: an icon square, a heading and a sentence (Examples → Features). The squares look wrong until you add the example\'s <code>.icon-square</code> rule (3rem square, 0.75rem radius) to <code>style.css</code>; it is page CSS, not Bootstrap.',
    'Testimonial: in <code>#testimonial</code>, a full-width light band (<code>bg-body-tertiary text-center p-5</code>) with the quote as an <code>&lt;h2&gt;</code> (the page already has its one <code>&lt;h1&gt;</code>), a round photo with <code>.profile-img</code> (write it: 100px tall, <code>border-radius: 50%</code>) and the dog\'s name. Underneath, a row of the four press names, each in a <code>col-lg-3 col-sm-12</code> column.',
    'Pricing: in <code>#pricing</code>, a <code>container</code> with a heading block and three cards in <code>row row-cols-1 row-cols-md-3</code> (Examples → Pricing). Make it dark instead of blue: <code>btn-outline-dark</code> and <code>btn-dark</code>, plus <code>border-dark</code> on the Mastiff card and <code>text-bg-dark</code> on its header. Keep <code>display-4</code> on the heading but make the tag an <code>&lt;h2&gt;</code>: the class sets the size, the tag the meaning.',
    'Footer: give <code>#contact</code> the <code>gradient-background</code> class and put a footer from Examples → Footers in a <code>container</code> inside it, with <code>© TinDog</code> in the first column. Remove <code>border-top</code> and change <code>my-5</code> to <code>mt-5</code>: margin shows the white page, padding would show the gradient.',
    'Check it at <b>Phone 375</b> and with <b>↗ open</b> at full width: the phone image should sit above the headline on a phone and to its right on a laptop, which is what <code>flex-lg-row-reverse</code> does.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TinDog</title>
  <!-- TODO 1: Bootstrap's CSS link, above your own stylesheet -->
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>
  <!-- Title -->
  <section id="title">
    <!-- TODO 2
         Headline: Find your dog a friend for every walk.
         Buttons (both large): "⬇ Download for iOS" (btn-light), "⬇ Download for Android" (btn-outline-light)
         Image: https://picsum.photos/seed/tindog-app/280/400  (alt: describe it) -->
  </section>

  <!-- Features -->
  <section id="features">
    <!-- TODO 3
         ✅ Easy to use: Swipe, sniff, match. If you can hold a phone, your dog can find a friend.
         🏅 Only the best pups: Pedigree or rescue, every dog here has impeccable taste in sticks.
         💘 Matches guaranteed: No new friend in your first month? The next month is on us. -->
  </section>

  <!-- Testimonial -->
  <section id="testimonial">
    <!-- TODO 4
         Quote: "Biscuit used to bark at every dog in the park. Now she has a best friend and a standing Tuesday walk."
         Name: Biscuit, Manchester
         Photo: https://picsum.photos/seed/biscuit/200/200
         Press: The Daily Bark · Pawsitive Press · Woof Weekly · Tail Times -->
  </section>

  <!-- Pricing -->
  <section id="pricing">
    <!-- TODO 5
         Heading: Pick a plan for your pup   Subtitle: Simple prices, no hidden treats.
         Chihuahua  $0/mo  · 5 matches a day · 10 messages a day · Basic profile        · "Sign up for free"
         Labrador  $15/mo  · Unlimited matches · Unlimited messages · Profile badges   · "Get started"
         Mastiff   $29/mo  · Priority listing · Everything in Labrador · Walk planner  · "Contact us" -->
  </section>

  <!-- Footer -->
  <section id="contact">
    <!-- TODO 6 -->
  </section>
</body>
</html>`,
'style.css':`/* css/style.css
   Your own classes go here. (In this playground this pane is loaded before
   Bootstrap, so it can add new classes but cannot override Bootstrap's own;
   for that, use a <style> block placed after the Bootstrap link.) */

/* Provided: an animated gradient. Add the class to any element. */
.gradient-background {
  background: linear-gradient(300deg, #00bfff, #ff4c68, #ef8172);
  background-size: 180% 180%;
  animation: gradient-animation 18s ease infinite;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* TODO 3: the icon squares from the Features example */

/* TODO 4: a round profile photo */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TinDog</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>
  <!-- Title -->
  <section id="title" class="gradient-background">
    <div class="container col-xxl-8 px-4 pt-5">
      <div class="row flex-lg-row-reverse align-items-center g-5 pt-5">
        <div class="col-10 col-sm-8 col-lg-6">
          <img src="https://picsum.photos/seed/tindog-app/280/400" class="d-block mx-lg-auto img-fluid rounded-4 shadow"
            alt="Placeholder image standing in for a screenshot of the app" width="280" height="400" loading="lazy" />
        </div>
        <div class="col-lg-6">
          <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">Find your dog a friend for every walk.</h1>
          <div class="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" class="btn btn-light btn-lg px-4 me-md-2">⬇ Download for iOS</button>
            <button type="button" class="btn btn-outline-light btn-lg px-4">⬇ Download for Android</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="features">
    <div class="container mt-5">
      <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div class="col d-flex align-items-start">
          <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">✅</div>
          <div>
            <h3 class="fs-2">Easy to use</h3>
            <p>Swipe, sniff, match. If you can hold a phone, your dog can find a friend.</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">🏅</div>
          <div>
            <h3 class="fs-2">Only the best pups</h3>
            <p>Pedigree or rescue, every dog here has impeccable taste in sticks.</p>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">💘</div>
          <div>
            <h3 class="fs-2">Matches guaranteed</h3>
            <p>No new friend in your first month? The next month is on us.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonial -->
  <section id="testimonial">
    <div class="my-5">
      <div class="p-5 text-center bg-body-tertiary">
        <div class="container py-5">
          <h2 class="text-body-emphasis">"Biscuit used to bark at every dog in the park. Now she has a best friend and a standing Tuesday walk."</h2>
          <img class="profile-img mt-5" src="https://picsum.photos/seed/biscuit/200/200" alt="Placeholder photo standing in for Biscuit" />
          <p class="col-lg-8 mx-auto lead mt-2">Biscuit, Manchester</p>
        </div>
        <div class="container">
          <div class="row fw-bold text-body-secondary fs-5">
            <div class="col-lg-3 col-sm-12">The Daily Bark</div>
            <div class="col-lg-3 col-sm-12">Pawsitive Press</div>
            <div class="col-lg-3 col-sm-12">Woof Weekly</div>
            <div class="col-lg-3 col-sm-12">Tail Times</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing">
    <div class="container">
      <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h2 class="display-4 fw-normal">Pick a plan for your pup</h2>
        <p class="fs-5 text-body-secondary">Simple prices, no hidden treats.</p>
      </div>
      <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm">
            <div class="card-header py-3">
              <h4 class="my-0 fw-normal">Chihuahua</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$0<small class="text-body-secondary fw-light">/mo</small></h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>5 matches a day</li>
                <li>10 messages a day</li>
                <li>Basic profile</li>
              </ul>
              <button type="button" class="w-100 btn btn-lg btn-outline-dark">Sign up for free</button>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm">
            <div class="card-header py-3">
              <h4 class="my-0 fw-normal">Labrador</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$15<small class="text-body-secondary fw-light">/mo</small></h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>Unlimited matches</li>
                <li>Unlimited messages</li>
                <li>Profile badges</li>
              </ul>
              <button type="button" class="w-100 btn btn-lg btn-dark">Get started</button>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm border-dark">
            <div class="card-header py-3 text-bg-dark border-dark">
              <h4 class="my-0 fw-normal">Mastiff</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">$29<small class="text-body-secondary fw-light">/mo</small></h1>
              <ul class="list-unstyled mt-3 mb-4">
                <li>Priority listing</li>
                <li>Everything in Labrador</li>
                <li>Walk planner</li>
              </ul>
              <button type="button" class="w-100 btn btn-lg btn-dark">Contact us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <section id="contact" class="gradient-background">
    <div class="container">
      <footer class="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 mt-5">
        <div class="col mb-3">
          <p class="text-body-secondary">&copy; TinDog</p>
        </div>
        <div class="col mb-3"></div>
        <div class="col mb-3">
          <h5>Product</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Features</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Pricing</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Download</a></li>
          </ul>
        </div>
        <div class="col mb-3">
          <h5>Company</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">About</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Press</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Careers</a></li>
          </ul>
        </div>
        <div class="col mb-3">
          <h5>Help</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">FAQs</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Safety tips</a></li>
            <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">Contact</a></li>
          </ul>
        </div>
      </footer>
    </div>
  </section>
</body>
</html>`,
'style.css':`/* css/style.css
   Your own classes go here. (In this playground this pane is loaded before
   Bootstrap, so it can add new classes but cannot override Bootstrap's own;
   for that, use a <style> block placed after the Bootstrap link.) */

/* Provided: an animated gradient. Add the class to any element. */
.gradient-background {
  background: linear-gradient(300deg, #00bfff, #ff4c68, #ef8172);
  background-size: 180% 180%;
  animation: gradient-animation 18s ease infinite;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* copied from the Features example page */
.icon-square {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
}

.profile-img {
  height: 100px;
  border-radius: 50%;
}
`},
  quiz:[
    { q:'Why does <code>gradient-background</code> go on the <code>&lt;section&gt;</code> rather than the <code>.container</code> inside it?', options:['Containers cannot have backgrounds','The container has a maximum width, so the gradient would stop short of the window edges','Sections animate faster','It makes no difference'], answer:1, why:'The section spans the full width; the container is narrower and centred, so only the section can colour edge to edge.' },
    { q:'Why must your own stylesheet link come after Bootstrap\'s?', options:['Browsers only read two stylesheets','With equal specificity, the rule that comes later wins, and you want yours to win','Bootstrap deletes earlier styles','So the page loads faster'], answer:1, why:'The cascade breaks ties by source order.' },
    { q:'You change the pricing title from <code>&lt;h1&gt;</code> to <code>&lt;h2&gt;</code> but it looks exactly the same. Why?', options:['The browser cached the page','Its size comes from the display-4 class, not from the tag','h1 and h2 are always the same size','Bootstrap ignores headings'], answer:1, why:'Bootstrap\'s classes control the look, so you can fix the semantics (one h1 per page) without changing the design.' },
    { q:'There is a white strip under the gradient footer. Which spacing class is likely to blame?', options:['A padding class such as pb-5','A margin class such as my-5, because margin shows what is behind the element','g-4 on the row','text-center'], answer:1, why:'Padding sits inside the element and shows its background; margin sits outside and shows the page behind it.' },
  ],
  explore:[
  {
    title:'Padding or margin: which one shows the background?', height:520,
    note:'A gradient section followed by the next section. Add padding and the gradient grows with it; add margin and white page shows through. Then try putting the gradient on the inner container instead of the section.',
    html:`
<div class="knobs">
  <label>section padding-top <input type="range" min="0" max="60" value="30" data-css="#sec|padding-top|px"><span class="val"></span></label>
  <label>section margin-bottom <input type="range" min="0" max="60" value="0" data-css="#sec|margin-bottom|px"><span class="val"></span></label>
  <label><input type="checkbox" id="inner"> gradient on the inner container instead</label>
</div>
<div class="stage" style="padding:0;background:#fff">
  <section id="sec" class="grad"><div id="cont" class="cont">Hero content</div></section>
  <div class="next">the next section</div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .grad{background:linear-gradient(300deg,#00bfff,#ff4c68,#ef8172)}
  .cont{max-width:60%;margin:0 auto;padding:24px;color:#fff;font-weight:700;text-align:center;font-size:18px}
  #sec:not(.grad) .cont{color:#123}
  .next{background:#f1f3f5;padding:18px;text-align:center;color:#5b6382}
</style>
<script>
  window.demoInit = function(){
    var sec = document.getElementById('sec'), cont = document.getElementById('cont'), inner = document.getElementById('inner');
    function upd(){
      sec.classList.toggle('grad', !inner.checked); cont.classList.toggle('grad', inner.checked);
      var cs = getComputedStyle(sec);
      document.getElementById('ro').textContent =
        'gradient on: ' + (inner.checked ? '.container (max-width 60%, centred)' : '<section> (full width)') + '\\n' +
        'padding-top: ' + cs.paddingTop + '   -> inside the box: the background fills it\\n' +
        'margin-bottom: ' + cs.marginBottom + '   -> outside the box: the page shows through\\n' +
        (inner.checked ? '\\nOn the container the gradient stops at its edges and the section padding is white.' : '');
    }
    document.addEventListener('input', function(){ setTimeout(upd, 0); });
    inner.addEventListener('change', upd); upd();
  };
<\/script>`
  },
  {
    title:'How the moving gradient works', height:470,
    note:'The provided <code>.gradient-background</code> class draws a gradient bigger than its box and slides it back and forth. Shrink <code>background-size</code> to 100% and the movement disappears: there is nothing left to slide.',
    html:`
<div class="knobs">
  <label>background-size <input type="range" id="bs" min="100" max="400" value="180"><span class="val" id="bsv"></span></label>
  <label>one loop takes <input type="range" id="du" min="2" max="30" value="18"><span class="val" id="duv"></span></label>
  <label><input type="checkbox" id="pa"> pause</label>
</div>
<div class="stage">
  <div id="gb" class="gradient-background" style="height:140px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:22px">TinDog</div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .gradient-background{background:linear-gradient(300deg,#00bfff,#ff4c68,#ef8172);background-size:180% 180%;animation:gradient-animation 18s ease infinite}
  @keyframes gradient-animation{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
</style>
<script>
  function upd(){
    var bs = document.getElementById('bs').value, du = document.getElementById('du').value, pa = document.getElementById('pa').checked, gb = document.getElementById('gb');
    gb.style.backgroundSize = bs + '% ' + bs + '%';
    gb.style.animationDuration = du + 's';
    gb.style.animationPlayState = pa ? 'paused' : 'running';
    document.getElementById('bsv').textContent = bs + '%'; document.getElementById('duv').textContent = du + 's';
    document.getElementById('ro').textContent = '.gradient-background {\\n  background: linear-gradient(300deg, #00bfff, #ff4c68, #ef8172);\\n  background-size: ' + bs + '% ' + bs + '%;\\n  animation: gradient-animation ' + du + 's ease infinite;\\n}\\n\\n' +
      (bs == 100 ? 'At 100% the gradient is exactly the size of the box, so moving it changes nothing.' : 'The gradient is ' + bs + '% of the box, so only part of it shows; the keyframes slide it from one edge to the other and back.');
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The workflow, every section</h3>
    <ol>
      <li>Find the closest example or snippet on the Bootstrap site.</li>
      <li>Inspect it, climb to the element that wraps the whole piece, <b>Copy element</b>, paste it into the right <code>&lt;section&gt;</code>.</li>
      <li>Wrap it in a <code>.container</code> if it is a bare <code>.row</code>.</li>
      <li>Swap in your text and images, then compare with the design.</li>
      <li>Anything still looking odd is usually page CSS from the example (like <code>.icon-square</code>) or a spacing class to adjust.</li>
    </ol>
    <h3>Go further</h3>
    <ul>
      <li>Add a navbar with a working mobile menu (it needs the JavaScript bundle).</li>
      <li>Respect visitors who turn animation off: <code>@media (prefers-reduced-motion: reduce) { .gradient-background { animation: none; } }</code></li>
    </ul>`
});
