/* ===== Section 4 — Multi-Page Websites ===== */

PG.add({
  id:'s04-file-paths', section:'s04', slug:'file-paths', lesson:'4.1',
  title:'File Paths',
  blurb:'A path is directions from <b>the file you are in</b> to the file you want. <code>./</code> means this folder, <code>../</code> means go up one level, and a name with a slash means go down into that folder.',
  tasks:[
    'Every image below is in a different place. Fix each <code>src</code> so all five pictures appear.',
    'The page you are editing lives in <code>Folder0/index.html</code> — check the folder tree in the Explore tab.',
    'Use the path resolver in Explore to check an answer before you commit to it.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>All the Animals</title>
</head>
<body>

  <h1>All the Animals</h1>

  <!-- This page is:  website/Folder0/index.html
       The pictures are:
         website/Folder0/rabbit.png
         website/Folder0/Folder3/cat.png
         website/dog.png
         website/Folder1/fish.png
         website/Folder1/Folder2/bird.png
  -->

  <h2>Rabbit:</h2>
  <img src="rabbit.png" alt="rabbit" />

  <h2>Cat:</h2>
  <img src="cat.png" alt="cat" />

  <h2>Dog:</h2>
  <img src="dog.png" alt="dog" />

  <h2>Fish:</h2>
  <img src="fish.png" alt="fish" />

  <h2>Bird:</h2>
  <img src="bird.png" alt="bird" />

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>All the Animals</title>
</head>
<body>

  <h1>All the Animals</h1>

  <h2>Rabbit:</h2>
  <img src="./rabbit.png" alt="rabbit" />

  <h2>Cat:</h2>
  <img src="./Folder3/cat.png" alt="cat" />

  <h2>Dog:</h2>
  <img src="../dog.png" alt="dog" />

  <h2>Fish:</h2>
  <img src="../Folder1/fish.png" alt="fish" />

  <h2>Bird:</h2>
  <img src="../Folder1/Folder2/bird.png" alt="bird" />

</body>
</html>`},
  explore:[{
    title:'Path resolver', height:600,
    note:'Type a path and watch it walk the tree. Green means it found the file; red means it went somewhere that does not exist.',
    html:`
<div class="knobs">
  <label>you are editing <span class="tag">website/Folder0/index.html</span></label>
</div>
<div class="knobs">
  <label>src=" <input type="text" id="p" value="../Folder1/fish.png" size="30"> "</label>
  <span class="tag" id="verdict"></span>
</div>
<div class="stage" style="display:flex;gap:16px;align-items:flex-start">
  <div style="flex:1">
    <h4>the folder tree</h4>
    <pre id="tree" style="margin:0;font-family:Menlo,monospace;font-size:12.5px;line-height:1.75"></pre>
  </div>
  <div style="flex:1">
    <h4>try these</h4>
    <div id="presets"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var FILES = [
    'website/dog.png',
    'website/Folder0/index.html',
    'website/Folder0/rabbit.png',
    'website/Folder0/Folder3/cat.png',
    'website/Folder1/fish.png',
    'website/Folder1/Folder2/bird.png'
  ];
  var HERE = 'website/Folder0';

  function resolve(path){
    if (!path) return null;
    var parts = (HERE + '/' + path).split('/');
    var out = [];
    for (var i = 0; i < parts.length; i++){
      var p = parts[i];
      if (p === '' || p === '.') continue;
      if (p === '..'){ if (!out.length) return null; out.pop(); }
      else out.push(p);
    }
    return out.join('/');
  }

  var TREE = [
    ['website/', 0, null],
    ['dog.png', 1, 'website/dog.png'],
    ['Folder0/   <- you are here', 1, null],
    ['index.html', 2, 'website/Folder0/index.html'],
    ['rabbit.png', 2, 'website/Folder0/rabbit.png'],
    ['Folder3/', 2, null],
    ['cat.png', 3, 'website/Folder0/Folder3/cat.png'],
    ['Folder1/', 1, null],
    ['fish.png', 2, 'website/Folder1/fish.png'],
    ['Folder2/', 2, null],
    ['bird.png', 3, 'website/Folder1/Folder2/bird.png']
  ];

  var PRESETS = ['./rabbit.png','./Folder3/cat.png','../dog.png','../Folder1/fish.png',
                 '../Folder1/Folder2/bird.png','rabbit.png','../../dog.png','/dog.png'];

  var pin = document.getElementById('p');

  function esc(s){ return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function draw(){
    var target = resolve(pin.value);
    var found = FILES.indexOf(target) !== -1;

    document.getElementById('tree').innerHTML = TREE.map(function(r){
      var hit = r[2] && r[2] === target;
      var style = hit ? (found ? 'background:#c8f0d4;color:#14532d;font-weight:700'
                               : 'background:#ffd6d6;color:#7f1d1d') : 'color:#3c435c';
      return '<span style="' + style + ';padding:0 4px;border-radius:3px">' +
             '&nbsp;'.repeat(r[1]*3) + esc(r[0]) + '</span>';
    }).join('\\n');

    var v = document.getElementById('verdict');
    v.textContent = found ? 'found it' : 'no such file';
    v.style.background = found ? '#c8f0d4' : '#ffd6d6';
    v.style.color = found ? '#14532d' : '#7f1d1d';

    var steps = [];
    steps.push('start in       website/Folder0/   (the folder index.html is in)');
    (pin.value || '').split('/').forEach(function(p){
      if (p === '.')  steps.push('./             stay right here');
      else if (p === '..') steps.push('../            go UP one folder');
      else if (p) steps.push(p.indexOf('.') > -1 ? 'look for       ' + p : 'go down into   ' + p + '/');
    });

    document.getElementById('ro').textContent =
      steps.join('\\n') + '\\n\\n' +
      'resolves to    ' + (target === null ? '(walked off the top of the tree)' : target) + '\\n' +
      (found ? 'THE IMAGE LOADS' : 'BROKEN IMAGE — nothing is there');
  }

  document.getElementById('presets').innerHTML = PRESETS.map(function(p){
    return '<button class="pre" data-p="' + p + '" style="display:block;width:100%;text-align:left;' +
      'font-family:Menlo,monospace;font-size:12px;padding:4px 8px;margin-bottom:4px;border:1px solid #cfd5e6;' +
      'border-radius:5px;background:#fff;cursor:pointer">' + p + '</button>';
  }).join('');
  document.querySelectorAll('.pre').forEach(function(b){
    b.addEventListener('click', function(){ pin.value = b.dataset.p; draw(); });
  });
  pin.addEventListener('input', draw);
  draw();
<\/script>`
  }],
  notes:`
    <h3>The three ingredients</h3>
    <table>
      <tr><th>Written</th><th>Means</th></tr>
      <tr><td><code>./</code></td><td>This folder (the same one the current file is in)</td></tr>
      <tr><td><code>../</code></td><td>Up one folder</td></tr>
      <tr><td><code>Folder/</code></td><td>Down into that folder</td></tr>
      <tr><td><code>../../</code></td><td>Up two folders — stack as many as you need</td></tr>
    </table>
    <h3>Relative vs absolute</h3>
    <ul>
      <li><b>Relative</b> — <code>./images/cat.png</code>. Directions from the current file. Use these for your own files: the whole site can be moved anywhere and still work.</li>
      <li><b>Absolute</b> — <code>https://example.com/cat.png</code> or <code>/images/cat.png</code>. A fixed location from the root. Needed for other people's files.</li>
    </ul>
    <h3>Case sensitivity</h3>
    <p>Your Mac usually does not care about <code>Cat.png</code> vs <code>cat.png</code>. Almost every web server does. This is a classic "it worked on my machine" bug — match the case exactly.</p>`
});


PG.add({
  id:'s04-webpages', section:'s04', slug:'multi-page', lesson:'4.2',
  title:'Multi-Page Websites',
  blurb:'Linking your own pages together is the same <code>&lt;a&gt;</code> tag, with a relative path instead of a URL. And anything can be a link — including an image.',
  tasks:[
    'Add a nav with links to <code>./about.html</code> and <code>./contact.html</code>.',
    'Wrap the cat image in an anchor so the picture itself links to the about page.',
    'Add a "back home" link that would go up a level: <code>../index.html</code>.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome</title>
</head>
<body>

  <h1>Welcome to My Website!</h1>

  <!-- TODO 1: a nav with links to ./about.html and ./contact.html -->

  <!-- TODO 2: wrap this image in an <a> so it links to ./about.html -->
  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=70"
       alt="a cat" width="240" />

  <hr />

  <!-- TODO 3: a link back up a level to ../index.html -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome</title>
</head>
<body>

  <h1>Welcome to My Website!</h1>

  <nav>
    <a href="./about.html">About Me</a> |
    <a href="./contact.html">Contact</a>
  </nav>

  <!-- an image that is itself a link -->
  <a href="./about.html">
    <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=70"
         alt="a cat" width="240" />
  </a>

  <hr />

  <a href="../index.html">← Back to the home page</a>

</body>
</html>`},
  explore:[{
    title:'A working two-page site', height:520,
    note:'A real multi-page site, running inside this frame. Click the links — the pages genuinely swap. This is all that "a website" means: separate HTML files pointing at each other.',
    html:`
<div class="knobs">
  <span style="font-size:12px;color:#5b6382">click the links inside the frame — then look at the code underneath</span>
  <button id="home" style="font:inherit;font-size:12px;padding:4px 12px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer">↺ back to index</button>
</div>
<div class="stage" style="padding:0;overflow:hidden">
  <iframe id="fr" style="width:100%;height:230px;border:0;display:block;background:#fff"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var NAV = '<nav style="margin-bottom:12px"><a href="#index">Home</a> | ' +
            '<a href="#about">About</a> | <a href="#contact">Contact</a></nav>';
  var STYLE = '<style>body{font-family:-apple-system,sans-serif;padding:16px;margin:0}' +
              'h1{font-size:20px;margin:0 0 8px}a{color:#2a6fdb}</style>';
  var pages = {
    index:   { t:'index.html',   b:'<h1>Welcome</h1><p>This is the home page of my little site.</p>' },
    about:   { t:'about.html',   b:'<h1>About Me</h1><p>I am learning web development and this is page two.</p>' },
    contact: { t:'contact.html', b:'<h1>Contact</h1><p>Say hello: <a href="mailto:hi@example.com">hi@example.com</a></p>' }
  };
  var code = {
    index:'website/\\n  index.html   <- you are here\\n  about.html\\n  contact.html\\n\\n' +
          '<a href="./about.html">About</a>\\n<a href="./contact.html">Contact</a>',
    about:'website/\\n  index.html\\n  about.html   <- you are here\\n  contact.html\\n\\n' +
          '<a href="./index.html">Home</a>\\n<a href="./contact.html">Contact</a>',
    contact:'website/\\n  index.html\\n  about.html\\n  contact.html   <- you are here\\n\\n' +
          '<a href="./index.html">Home</a>\\n<a href="./about.html">About</a>'
  };
  function show(name){
    var p = pages[name];
    document.getElementById('fr').srcdoc = '<!DOCTYPE html><html><head>' + STYLE + '</head><body>' +
      '<div style="font-family:Menlo,monospace;font-size:11px;color:#8b92a8;margin-bottom:8px">' +
      p.t + '</div>' + NAV + p.b + '</body></html>';
    document.getElementById('ro').textContent = code[name];
  }
  window.addEventListener('message', function(){});
  document.getElementById('fr').addEventListener('load', function(){
    var d = document.getElementById('fr').contentDocument;
    if (!d) return;
    d.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        show(a.getAttribute('href').slice(1));
      });
    });
  });
  document.getElementById('home').addEventListener('click', function(){ show('index'); });
  show('index');
<\/script>`
  }],
  notes:`
    <h3>index.html is special</h3>
    <p>When someone visits a folder without naming a file, the server hands them <code>index.html</code>. That is why your home page is always called that.</p>
    <h3>A normal small site</h3>
    <pre>website/
  index.html
  about.html
  contact.html
  assets/
    images/
      cat.png
  styles/
    main.css</pre>
    <p>From <code>index.html</code>: the cat is <code>./assets/images/cat.png</code>. From a page inside <code>assets/</code> you would need <code>../</code> to climb back out first.</p>
    <h3>Anything can be a link</h3>
    <p>Wrap an image, a heading, a whole box — <code>&lt;a&gt;</code> does not care what is inside it. Wrapping an <code>&lt;img&gt;</code> is how every clickable thumbnail on the web works.</p>
    <h3>Why this playground shows one page</h3>
    <p>The Build tab renders a single file, so links to <code>./about.html</code> have nothing to open. The Explore demo above simulates a real multi-file site so you can see the actual behaviour. On your own machine in VS Code, create the second file and it just works.</p>`
});


PG.add({
  id:'s04-portfolio', section:'s04', slug:'portfolio', lesson:'4.3', project:true,
  title:'HTML Portfolio Project',
  blurb:'A home page listing your projects so far, each with a preview image linking to the project itself. The first thing you have built that you would actually show someone.',
  tasks:[
    'A heading and a short paragraph about you.',
    'For each project: an <code>&lt;h3&gt;</code> whose text links to the project page, and a preview image below it.',
    'Give each image a <code>height</code> attribute so they all match.',
    'Add contact links at the bottom.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Portfolio</title>
</head>
<body>

  <!-- TODO: your portfolio.
       intro, then each project as a linked heading + preview image,
       then contact links at the bottom. -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Portfolio</title>
</head>
<body>

  <h1>Hello, I'm learning web development</h1>
  <p>
    I'm working through a full-stack bootcamp. Here is everything I have
    built so far, newest first.
  </p>

  <hr />

  <h2>Projects</h2>

  <h3><a href="./public/movie-ranking.html">Movie Ranking</a></h3>
  <a href="./public/movie-ranking.html">
    <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=70"
         alt="preview of the movie ranking page" height="200" />
  </a>

  <h3><a href="./public/birthday-invite.html">Birthday Invite</a></h3>
  <a href="./public/birthday-invite.html">
    <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70"
         alt="preview of the birthday invite page" height="200" />
  </a>

  <hr />

  <h2>Get in touch</h2>
  <ul>
    <li><a href="mailto:hello@example.com">Email me</a></li>
    <li><a href="https://github.com" target="_blank">GitHub</a></li>
  </ul>

</body>
</html>`},
  notes:`
    <h3>Keeping the height consistent</h3>
    <p>Set only <code>height</code> on the previews and let the width follow — every thumbnail lines up regardless of the original image proportions. Setting both would squash them.</p>
    <h3>Structure worth copying</h3>
    <pre>portfolio/
  index.html
  public/
    movie-ranking.html
    birthday-invite.html
  assets/
    images/</pre>
    <p>From <code>index.html</code> the project pages are <code>./public/movie-ranking.html</code>. From inside <code>public/</code>, getting back home means <code>../index.html</code>.</p>
    <h3>This one is worth keeping</h3>
    <p>You will restyle this page after CSS, rebuild it with flexbox, and eventually put it on the real internet with GitHub Pages. It is the one project from this course you might genuinely use.</p>`
});
