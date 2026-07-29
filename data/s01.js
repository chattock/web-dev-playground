/* ===== Section 1 — Front-End Web Development ===== */
/* This section of the course is orientation — syllabus, how to learn, how the
   web works. No coding exercises, so here it is one lesson: the mental model,
   plus your first page to actually type into. */

PG.add({
  id:'s01-how-the-web-works', section:'s01', slug:'how-the-web-works', lesson:'1.1',
  title:'How the Web Works',
  blurb:'Before the syntax: a website is just files on someone else\'s computer. Your browser asks for them, gets them back, and draws them. <b>HTML</b> is the structure, <b>CSS</b> is the styling, <b>JavaScript</b> is the behaviour.',
  tasks:[
    'Change the text between the tags and watch the preview update as you type.',
    'Add a second heading and a paragraph of your own.',
    'Try deleting a closing tag and see what the browser does about it.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My First Page</title>
</head>
<body>

  <h1>Hello, world</h1>
  <p>This is my very first web page. Everything you can see is HTML.</p>

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My First Page</title>
</head>
<body>

  <h1>Hello, world</h1>
  <p>This is my very first web page. Everything you can see is HTML.</p>

  <h2>Things I want to build</h2>
  <p>A portfolio, a silly game, and something that is actually useful.</p>

</body>
</html>`},
  explore:[
  {
    title:'The three languages, layered', height:520,
    note:'The same page with each layer switched on and off. HTML alone is readable but ugly; CSS makes it look like something; JavaScript makes it do something.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="h" checked disabled> HTML — structure (always on)</label>
  <label><input type="checkbox" id="c" checked> CSS — presentation</label>
  <label><input type="checkbox" id="j" checked> JavaScript — behaviour</label>
</div>
<div class="stage" style="padding:0;overflow:hidden">
  <iframe id="fr" style="width:100%;height:270px;border:0;display:block;background:#fff"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var CSS = 'body{font-family:-apple-system,sans-serif;background:#f3f6ff;padding:20px;margin:0}' +
            'h1{color:#3a5ccc;font-size:24px;margin:0 0 6px}' +
            'p{color:#555;margin:0 0 14px}' +
            'button{background:#3a5ccc;color:#fff;border:0;padding:9px 18px;border-radius:6px;' +
            'font-size:14px;cursor:pointer}' +
            '#out{margin-top:12px;font-weight:700;color:#2a8a4a}';
  var JS  = 'var n=0;document.querySelector("button").addEventListener("click",function(){' +
            'n++;document.getElementById("out").textContent="You clicked me "+n+" time"+(n===1?"":"s")+"!";});';
  function build(){
    var css = document.getElementById('c').checked ? '<style>' + CSS + '<\\/style>' : '';
    var js  = document.getElementById('j').checked ? '<scr'+'ipt>' + JS + '<\\/scr'+'ipt>' : '';
    document.getElementById('fr').srcdoc =
      '<!DOCTYPE html><html><head>' + css + '</head><body>' +
      '<h1>Coffee Shop</h1>' +
      '<p>Open every day from 7am. Come and say hello.</p>' +
      '<button>Click me</button>' +
      '<div id="out"></div>' + js + '</body></html>';
    var on = ['HTML'];
    if (document.getElementById('c').checked) on.push('CSS');
    if (document.getElementById('j').checked) on.push('JavaScript');
    document.getElementById('ro').textContent =
      'active: ' + on.join(' + ') + '\\n\\n' +
      'HTML       the words, the button, the headings — the CONTENT\\n' +
      (document.getElementById('c').checked
        ? 'CSS        colours, spacing, fonts, rounded corners — the LOOK\\n'
        : 'CSS off  → still readable, just unstyled browser defaults\\n') +
      (document.getElementById('j').checked
        ? 'JavaScript the button actually counts your clicks — the BEHAVIOUR'
        : 'JS off   → the button is there and clickable, but nothing happens');
  }
  document.getElementById('c').addEventListener('change', build);
  document.getElementById('j').addEventListener('change', build);
  build();
<\/script>`
  },
  {
    title:'What happens when you type a URL', height:420,
    note:'Press the button to walk through a request. This is the whole of "how the internet works" in five steps.',
    html:`
<div class="knobs">
  <button id="go" style="font:inherit;font-size:13px;padding:6px 16px;border:1px solid #cfd5e6;border-radius:6px;background:#5b9cff;color:#fff;font-weight:700;cursor:pointer">▶ Send the request</button>
  <button id="rst" style="font:inherit;font-size:12px;padding:6px 12px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer">reset</button>
</div>
<div class="stage">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
    <div style="text-align:center">
      <div style="font-size:34px">💻</div>
      <div style="font-size:11.5px;font-weight:700">your browser</div>
      <div style="font-size:10.5px;color:#8b92a8">the CLIENT</div>
    </div>
    <div style="flex:1;position:relative;height:70px">
      <div id="req" style="position:absolute;top:6px;left:0;opacity:0;transition:all .8s;
           background:#5b9cff;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;white-space:nowrap">GET /index.html →</div>
      <div id="res" style="position:absolute;bottom:6px;right:0;opacity:0;transition:all .8s;
           background:#2a9d4a;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;white-space:nowrap">← 200 OK + the files</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:34px">🗄️</div>
      <div style="font-size:11.5px;font-weight:700">the server</div>
      <div style="font-size:10.5px;color:#8b92a8">where the files live</div>
    </div>
  </div>
</div>
<pre class="readout" id="ro">press the button to start</pre>
<script>
  var steps = [
    '1. You type  thecoffeeshop.com  and press enter.',
    '2. DNS looks that name up and turns it into an address like 172.217.16.99.',
    '3. Your browser sends an HTTP request to that address: "GET me index.html".',
    '4. The server answers with the HTML, CSS, JavaScript and images.',
    '5. Your browser reads them and paints the page. That painting is called RENDERING.'
  ];
  var t = [];
  function clear(){ t.forEach(clearTimeout); t = []; }
  document.getElementById('go').addEventListener('click', function(){
    clear();
    var req = document.getElementById('req'), res = document.getElementById('res');
    req.style.opacity = 0; req.style.left = '0';
    res.style.opacity = 0; res.style.right = '0';
    var ro = document.getElementById('ro');
    ro.textContent = '';
    steps.forEach(function(s, i){
      t.push(setTimeout(function(){
        ro.textContent += (ro.textContent ? '\\n' : '') + s;
        if (i === 2){ req.style.opacity = 1; req.style.left = '60%'; }
        if (i === 3){ res.style.opacity = 1; res.style.right = '60%'; }
      }, i * 900));
    });
  });
  document.getElementById('rst').addEventListener('click', function(){
    clear();
    document.getElementById('req').style.cssText = document.getElementById('req').style.cssText.replace(/opacity: 1/,'opacity: 0');
    document.getElementById('req').style.opacity = 0; document.getElementById('req').style.left = '0';
    document.getElementById('res').style.opacity = 0; document.getElementById('res').style.right = '0';
    document.getElementById('ro').textContent = 'press the button to start';
  });
<\/script>`
  }],
  notes:`
    <h3>Front end vs back end</h3>
    <table>
      <tr><th>Front end</th><th>Back end</th></tr>
      <tr><td>Runs in the user's browser</td><td>Runs on the server</td></tr>
      <tr><td>HTML, CSS, JavaScript</td><td>Node, Python, databases</td></tr>
      <tr><td>What people see and click</td><td>Accounts, payments, stored data</td></tr>
    </table>
    <p>Sections 1–15 of this course are pure front end. The back end starts at section 22.</p>
    <h3>The three languages</h3>
    <ul>
      <li><b>HTML</b> — the structure and content. A <em>markup</em> language, not a programming language: it describes, it does not decide.</li>
      <li><b>CSS</b> — the presentation. A <em>stylesheet</em> language: rules about how things look.</li>
      <li><b>JavaScript</b> — the behaviour. An actual programming language: variables, conditions, loops.</li>
    </ul>
    <p>The house analogy Angela uses: HTML is the bricks and rooms, CSS is the paint and furniture, JavaScript is the plumbing and electrics that make things happen.</p>
    <h3>Learning this well</h3>
    <ul>
      <li><b>Type the code, don't copy it.</b> The typing is where the learning happens.</li>
      <li><b>Break things deliberately.</b> Delete a closing tag and see what happens — that is how you learn to read errors.</li>
      <li><b>Build something nobody asked for.</b> The projects you invent stick far better than the ones you follow.</li>
    </ul>`
});
