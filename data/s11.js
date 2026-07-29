/* ===== Section 11 — Bootstrap ===== */

PG.add({
  id:'s11-intro', section:'s11', slug:'bootstrap-intro', lesson:'11.1',
  title:'Bootstrap Intro & The Grid',
  blurb:'Bootstrap is a stylesheet full of ready-made classes. Add one <code>&lt;link&gt;</code> and you get a responsive 12-column grid, buttons, cards and a hundred other things — no CSS of your own required.',
  tasks:[
    'The Bootstrap CDN link is already in the head. Wrap the content in a <code>&lt;div class="container"&gt;</code>.',
    'Make the three cards sit in a <code>row</code>, each in a <code>col</code>.',
    'Change the columns to <code>col-md-4</code> so they stack on a phone and go three-across from medium screens up. Test it with the Phone 375 preview width.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap demo</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="p-4">

  <h1 class="mb-4">My Bootstrap Page</h1>

  <!-- TODO 1: wrap everything below in a .container -->
  <!-- TODO 2: put these in a .row, each card in a .col -->
  <!-- TODO 3: change to col-md-4 and test at phone width -->

  <div class="card p-3">One</div>
  <div class="card p-3">Two</div>
  <div class="card p-3">Three</div>

</body>
</html>`,
css:`/* You barely need this pane today — that is the point of Bootstrap.
   Anything you write here still wins, because it loads after Bootstrap. */
`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap demo</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="p-4">

  <div class="container">
    <h1 class="mb-4">My Bootstrap Page</h1>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="card p-3">One</div>
      </div>
      <div class="col-md-4">
        <div class="card p-3">Two</div>
      </div>
      <div class="col-md-4">
        <div class="card p-3">Three</div>
      </div>
    </div>
  </div>

</body>
</html>`},
  explore:[
  {
    title:'The 12-column system', height:520,
    note:'Every row is 12 units wide. Set how many units each column takes — if they add up to more than 12 the extras wrap onto a new line.',
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
<p class="note">Bootstrap builds these columns with flexbox under the hood — <code>col-4</code> is just <code>flex: 0 0 33.33%</code>. Knowing section 9 means you already know how Bootstrap works.</p>
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
      (total>12 ? '   -> over 12, so the last column wraps to a new line' :
       total<12 ? '   -> under 12, leaving ' + (12-total) + ' units of empty space' :
       '   -> a perfect row');
  }
  cols.forEach(function(id){ document.getElementById(id).addEventListener('input', upd); });
  upd();
<\/script>`
  },
  {
    title:'Breakpoint infixes', height:560,
    note:'<code>col-md-6</code> means "from medium screens upward, take 6 units". Below that breakpoint the column falls back to full width. Drag the width to watch the switch happen.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" min="300" max="1150" value="1000" id="w"><span class="val" id="wv">1000px</span></label>
  <span class="tag" id="bp"></span>
</div>
<div class="stage" style="padding:8px">
  <div id="frame" style="width:1000px;border:2px solid #b9c0d4;border-radius:8px;overflow:hidden;transition:width .08s">
    <iframe id="fr" style="width:100%;height:230px;border:0;display:block"></iframe>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  document.getElementById('fr').srcdoc =
    '<!DOCTYPE html><html><head>' +
    '<link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet">' +
    '</head><body class="p-3">' +
    '<div class="row g-2">' +
      '<div class="col-12 col-md-6 col-lg-4"><div class="p-3 text-white text-center" style="background:#5b9cff">col-12 col-md-6 col-lg-4</div></div>' +
      '<div class="col-12 col-md-6 col-lg-4"><div class="p-3 text-center" style="background:#7ee0a8">col-12 col-md-6 col-lg-4</div></div>' +
      '<div class="col-12 col-md-12 col-lg-4"><div class="p-3 text-center" style="background:#ffcf6b">col-12 col-md-12 col-lg-4</div></div>' +
    '</div></body></html>';
  var w = document.getElementById('w');
  var bps = [['xs',0,'< 576'],['sm',576,'≥ 576'],['md',768,'≥ 768'],['lg',992,'≥ 992'],['xl',1200,'≥ 1200']];
  function upd(){
    var v = +w.value;
    document.getElementById('frame').style.width = v + 'px';
    document.getElementById('wv').textContent = v + 'px';
    var cur = bps.filter(function(b){ return v >= b[1]; }).pop();
    document.getElementById('bp').textContent = 'breakpoint: ' + cur[0] + '  (' + cur[2] + 'px)';
    document.getElementById('ro').textContent =
      'sm  ≥ 576px      md  ≥ 768px      lg  ≥ 992px      xl  ≥ 1200px\\n\\n' +
      'currently ' + v + 'px  ->  ' + cur[0] + '\\n\\n' +
      (v < 768 ? 'below md: col-12 wins, everything is full width and stacked'
       : v < 992 ? 'md active: col-md-6 wins, two per row'
       : 'lg active: col-lg-4 wins, three per row');
  }
  w.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Getting Bootstrap in</h3>
    <pre>&lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"&gt;</pre>
    <p>A CDN is just someone else's server hosting the file. Free, fast, cached across sites — and no download for you.</p>
    <h3>The three layout classes</h3>
    <ul>
      <li><code>.container</code> — centres your content with responsive side margins (<code>.container-fluid</code> for edge to edge).</li>
      <li><code>.row</code> — a horizontal group. Must be inside a container.</li>
      <li><code>.col</code> — a column inside a row. <code>.col</code> alone means "share equally".</li>
    </ul>
    <h3>Spacing utilities</h3>
    <p>Property + side + size: <code>mt-4</code> = margin-top level 4, <code>px-2</code> = padding left and right level 2, <code>m-0</code> = no margin.</p>
    <ul>
      <li>Property: <code>m</code> margin · <code>p</code> padding</li>
      <li>Side: <code>t</code> <code>b</code> <code>s</code>(left) <code>e</code>(right) <code>x</code> <code>y</code> · or nothing for all</li>
      <li>Size: <code>0</code>–<code>5</code>, or <code>auto</code></li>
    </ul>
    <h3>The trade-off</h3>
    <p>Bootstrap is fast, consistent and responsive out of the box — but every Bootstrap site looks like a Bootstrap site, and you ship the whole stylesheet even if you use ten classes.</p>`
});


PG.add({
  id:'s11-components', section:'s11', slug:'bootstrap-components', lesson:'11.2',
  title:'Bootstrap Components',
  blurb:'Beyond the grid, Bootstrap ships pre-built components: buttons, cards, navbars, alerts, badges. You assemble a page from class names.',
  tasks:[
    'Turn the plain links into a proper <code>navbar</code>.',
    'Turn the three blocks into <code>card</code>s with a <code>card-body</code>, <code>card-title</code> and <code>card-text</code>.',
    'Add buttons — try <code>btn btn-primary</code>, <code>btn btn-outline-secondary</code> and <code>btn btn-lg</code>.',
    'Then go and browse getbootstrap.com/docs and paste in a component nobody asked you for.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Components</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>

  <!-- TODO 1: make this a navbar -->
  <div>
    <a href="#">MoveIt</a>
    <a href="#">Home</a>
    <a href="#">Pricing</a>
    <a href="#">Contact</a>
  </div>

  <div class="container mt-4">
    <div class="row g-3">

      <!-- TODO 2: make each of these a card -->
      <div class="col-md-4">
        <div>
          <h5>Beauty</h5>
          <p>We build websites that people actually enjoy looking at.</p>
          <!-- TODO 3: a button -->
          <a href="#">Learn more</a>
        </div>
      </div>

      <div class="col-md-4">
        <div>
          <h5>Speed</h5>
          <p>Fast to load, fast to build, fast to change.</p>
          <a href="#">Learn more</a>
        </div>
      </div>

      <div class="col-md-4">
        <div>
          <h5>Support</h5>
          <p>Real humans answering real questions.</p>
          <a href="#">Learn more</a>
        </div>
      </div>

    </div>
  </div>

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Components</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">MoveIt</a>
      <div class="navbar-nav">
        <a class="nav-link active" href="#">Home</a>
        <a class="nav-link" href="#">Pricing</a>
        <a class="nav-link" href="#">Contact</a>
      </div>
    </div>
  </nav>

  <div class="container mt-4">
    <div class="row g-3">

      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Beauty</h5>
            <p class="card-text">We build websites that people actually enjoy looking at.</p>
            <a href="#" class="btn btn-primary">Learn more</a>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Speed</h5>
            <p class="card-text">Fast to load, fast to build, fast to change.</p>
            <a href="#" class="btn btn-outline-secondary">Learn more</a>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Support</h5>
            <p class="card-text">Real humans answering real questions.</p>
            <a href="#" class="btn btn-success btn-lg">Learn more</a>
          </div>
        </div>
      </div>

    </div>
  </div>

</body>
</html>`},
  explore:[{
    title:'Component catalogue', height:640,
    note:'Every one of these is pure Bootstrap classes — no CSS written. Copy any of it straight into the Build tab.',
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
  }],
  notes:`
    <h3>How to actually use Bootstrap</h3>
    <p>Nobody memorises these classes. The workflow is: open <b>getbootstrap.com/docs</b>, find the component, copy the example, paste it in, change the words. That is not cheating — it is the entire point of a framework.</p>
    <h3>Class families worth knowing</h3>
    <ul>
      <li><b>Colour</b> — <code>text-bg-primary</code>, <code>bg-light</code>, <code>text-muted</code>, <code>text-danger</code></li>
      <li><b>Spacing</b> — <code>m-*</code> <code>p-*</code> with sides and sizes 0–5</li>
      <li><b>Display</b> — <code>d-none</code>, <code>d-flex</code>, <code>d-md-block</code> (responsive!)</li>
      <li><b>Flex</b> — <code>justify-content-center</code>, <code>align-items-center</code>, <code>gap-3</code></li>
      <li><b>Text</b> — <code>text-center</code>, <code>fw-bold</code>, <code>fs-4</code>, <code>lead</code></li>
    </ul>
    <h3>Interactive components need JS</h3>
    <p>Dropdowns, modals, carousels and the collapsing navbar toggle need Bootstrap's JavaScript bundle as well as the CSS:</p>
    <pre>&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"&gt;&lt;/script&gt;</pre>`
});


PG.add({
  id:'s11-tindog', section:'s11', slug:'tindog-project', lesson:'11.3', project:true,
  title:'TinDog Project',
  blurb:'The big one: a full marketing landing page — hero, features, testimonial, pricing, footer — assembled almost entirely from Bootstrap classes.',
  tasks:[
    'Build the hero: a big heading, a paragraph, two buttons, and an image beside it on desktop that stacks on mobile.',
    'Add a three-column features section using <code>row</code> + <code>col-lg-4</code>.',
    'Add a pricing row with three <code>card</code>s.',
    'Check it at Phone 375 — if anything looks broken, you need a responsive column class.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TinDog</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>

  <section class="text-white text-center py-5" style="background:#ff4c68">
    <div class="container">
      <h1 class="display-4 fw-bold">Meet new and interesting dogs nearby.</h1>
      <!-- TODO: buttons, and an image column beside the text on desktop -->
    </div>
  </section>

  <section class="container py-5">
    <!-- TODO: three feature columns -->
  </section>

  <section class="container py-5">
    <!-- TODO: three pricing cards -->
  </section>

  <footer class="text-center py-4 text-muted">
    © TinDog
  </footer>

</body>
</html>`,
css:`/* Bootstrap does the heavy lifting; use this pane only for the bits it can't do. */
`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TinDog</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body>

  <section class="text-white py-5" style="background:#ff4c68">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold">Meet new and interesting dogs nearby.</h1>
          <p class="lead">Swipe right on the good boys. Swipe right on all of them, honestly.</p>
          <button class="btn btn-dark btn-lg me-2">Download</button>
          <button class="btn btn-outline-light btn-lg">Learn more</button>
        </div>
        <div class="col-lg-6 text-center">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=420&q=70"
               class="img-fluid rounded-4 shadow" alt="a dog" />
        </div>
      </div>
    </div>
  </section>

  <section class="container py-5 text-center">
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="fs-1">🐶</div>
        <h5 class="fw-bold">Easy to use</h5>
        <p class="text-muted">So easy a dog could do it. We tested this.</p>
      </div>
      <div class="col-lg-4">
        <div class="fs-1">⚡</div>
        <h5 class="fw-bold">Elite Clientele</h5>
        <p class="text-muted">Only the finest dogs in a five mile radius.</p>
      </div>
      <div class="col-lg-4">
        <div class="fs-1">🦴</div>
        <h5 class="fw-bold">Guaranteed to work</h5>
        <p class="text-muted">Find your dog a companion or your money back.</p>
      </div>
    </div>
  </section>

  <section class="container py-5">
    <h2 class="text-center fw-bold mb-4">A Plan for Every Dog's Needs</h2>
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card h-100 text-center">
          <div class="card-header fw-bold">Chihuahua</div>
          <div class="card-body">
            <h3 class="card-title">Free</h3>
            <p class="card-text text-muted">5 matches per day</p>
            <button class="btn btn-outline-dark w-100">Sign up</button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card h-100 text-center border-primary">
          <div class="card-header fw-bold text-bg-primary">Labrador</div>
          <div class="card-body">
            <h3 class="card-title">£12<small class="text-muted fs-6">/mo</small></h3>
            <p class="card-text text-muted">Unlimited matches</p>
            <button class="btn btn-primary w-100">Sign up</button>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card h-100 text-center">
          <div class="card-header fw-bold">Mastiff</div>
          <div class="card-body">
            <h3 class="card-title">£25<small class="text-muted fs-6">/mo</small></h3>
            <p class="card-text text-muted">Priority listing</p>
            <button class="btn btn-outline-dark w-100">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="text-center py-4 text-muted">
    © TinDog
  </footer>

</body>
</html>`},
  notes:`
    <h3>Classes doing the work here</h3>
    <ul>
      <li><code>row align-items-center</code> — vertically centres the hero text against the image.</li>
      <li><code>col-lg-6</code> — half width on large screens, full width below. That single class is the entire mobile layout.</li>
      <li><code>img-fluid</code> — <code>max-width: 100%</code>, so images never overflow.</li>
      <li><code>h-100</code> — makes cards in a row match heights.</li>
      <li><code>display-4</code>, <code>lead</code>, <code>fw-bold</code>, <code>text-muted</code> — typography without touching CSS.</li>
      <li><code>w-100</code> on a button makes it fill its card.</li>
    </ul>
    <h3>Make it yours</h3>
    <p>Change the brand colour, swap the emoji for real icons from <b>Bootstrap Icons</b>, add a navbar with a working mobile toggle (needs the JS bundle), or add a testimonial carousel. This is the page to over-build.</p>`
});
