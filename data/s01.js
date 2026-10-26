/* ===== Section 1 — Front-End Web Development ===== */
/* Orientation: what the course covers, how to study it, how the internet and
   websites work. Lectures 5 and 6 carry the interactive parts; the rest are
   short read lessons. Wrapped in a function so helper names stay local. */
(function () {

/* Demo scripts are written as real functions and stringified into the demo
   iframe, which avoids escaping inside template literals. */
const script = (fn, cfg) => '<script>(' + fn + ')(' + JSON.stringify(cfg || {}).replace(/</g, '\\u003c') + ');<\/script>';

/* ---------- lecture 5: a request travelling browser → ISP → DNS → server ---------- */
function dnsDemo() {
  var BOOK = {
    'google.com': '142.250.187.206',
    'wikipedia.org': '185.15.59.224',
    'bbc.co.uk': '151.101.0.81',
    'github.com': '140.82.121.4',
    'thecoffeeshop.com': '203.0.113.42'
  };
  var X = { browser: 12, isp: 37, dns: 63, server: 88 };
  var $ = function (id) { return document.getElementById(id); };
  var input = $('domain'), pkt = $('pkt'), ro = $('ro'), book = $('book');
  var timers = [];
  book.innerHTML = Object.keys(BOOK).map(function (d) {
    return '<tr data-d="' + d + '"><td>' + d + '</td><td style="font-family:ui-monospace,Menlo,monospace">' + BOOK[d] + '</td></tr>';
  }).join('');
  function at(stop, label, color) {
    pkt.style.left = X[stop] + '%'; pkt.textContent = label; pkt.style.background = color; pkt.style.opacity = 1;
  }
  function mark(d) {
    book.querySelectorAll('tr').forEach(function (tr) { tr.style.background = tr.getAttribute('data-d') === d ? '#fff3c4' : ''; });
  }
  function go() {
    timers.forEach(clearTimeout); timers = []; mark(null);
    var d = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '') || 'google.com';
    var ip = BOOK[d];
    var steps = [
      [function () { at('browser', d + ' ?', '#5b9cff'); }, '1. You type ' + d + ' and press Enter. The request goes first to your ISP, the company you pay for internet access (BT, TalkTalk, Comcast, AT&T…).'],
      [function () { at('isp', d + ' ?', '#5b9cff'); }, '2. The ISP passes the name on to a DNS server (Domain Name System).'],
      [function () { at('dns', d + ' ?', '#5b9cff'); mark(ip ? d : null); }, ip
        ? '3. The DNS server looks the name up, like a phone book: ' + d + ' → ' + ip + '.\n   An IP address works like a postcode: every computer on the internet has one.'
        : '3. The DNS server has no entry for ' + d + '. With no address to go to, the browser gives up and shows "This site can\'t be reached".']
    ];
    if (ip) steps = steps.concat([
      [function () { at('isp', ip, '#e0902b'); }, '4. The IP address travels back through the ISP…'],
      [function () { at('browser', ip, '#e0902b'); }, '5. …to your browser.'],
      [function () { at('server', 'GET page → ' + ip, '#5b9cff'); }, '6. The browser now contacts ' + ip + ' directly and asks for the page.'],
      [function () { at('browser', '📄 HTML · CSS · JS', '#2a9d4a'); }, '7. The server replies with the files and the browser draws (renders) the page.\n   Light in undersea fibre cables makes the round trip take milliseconds, even across an ocean.']
    ]);
    ro.textContent = '';
    steps.forEach(function (s, i) {
      timers.push(setTimeout(function () { s[0](); ro.textContent += (i ? '\n' : '') + s[1]; }, i * 1150));
    });
  }
  $('go').addEventListener('click', go);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  book.addEventListener('click', function (e) { var tr = e.target.closest('tr'); if (tr) { input.value = tr.getAttribute('data-d'); go(); } });
}

const DNS_DEMO = `
<style>
  .stop{position:absolute;top:0;transform:translateX(-50%);text-align:center;font-size:11.5px;width:116px}
  .stop .ic{font-size:30px;line-height:1.2}
  .stop b{display:block}
  .stop span{color:#8b92a8;font-size:10.5px}
  .wire{position:absolute;top:22px;left:12%;right:12%;border-top:2px dashed #cfd5e6}
</style>
<div class="knobs">
  <label>address <input type="text" id="domain" value="google.com" size="18"></label>
  <button id="go">▶ Send the request</button>
  <span style="font-size:12px;color:#5b6382">or click a row of the phone book</span>
</div>
<div class="stage" style="padding:16px 10px 8px">
  <div style="position:relative;height:120px">
    <div class="wire"></div>
    <div class="stop" style="left:12%"><div class="ic">💻</div><b>your browser</b><span>the client</span></div>
    <div class="stop" style="left:37%"><div class="ic">🏢</div><b>your ISP</b><span>your internet provider</span></div>
    <div class="stop" style="left:63%"><div class="ic">📖</div><b>DNS server</b><span>names → addresses</span></div>
    <div class="stop" style="left:88%"><div class="ic">🗄️</div><b>web server</b><span>where the files live</span></div>
    <div id="pkt" style="position:absolute;top:88px;left:12%;transform:translateX(-50%);opacity:0;transition:left 1s ease,background .3s;
         background:#5b9cff;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap"></div>
  </div>
</div>
<div style="display:flex;gap:12px;align-items:flex-start">
  <pre class="readout" id="ro" style="flex:1;white-space:pre-wrap;min-height:170px">Type a domain and send the request.</pre>
  <table class="grid" style="background:#fff;cursor:pointer">
    <thead><tr><th>domain</th><th>IP address</th></tr></thead><tbody id="book"></tbody>
  </table>
</div>
<p class="note">This phone book is a toy with example addresses; real ones change and big sites have many. Try a name that is not in it. If you paste a real IP into your address bar, some sites load and others refuse, because many sites share one server and need the name to know which site you want.</p>
` + script(dnsDemo);

/* ---------- lecture 6: a mock Elements panel ---------- */
function inspectDemo() {
  var ORIGINAL = { logo: 'Seek', ph: 'Search the web', v1: 'Seek Search', a1: 'Seek Search', v2: 'I\'m Feeling Lucky', a2: 'I\'m Feeling Lucky' };
  var state = {};
  var $ = function (id) { return document.getElementById(id); };
  var ro = $('ro');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ed(k) { return '<span class="ed" data-k="' + k + '" title="double-click to edit">' + esc(state[k]) + '</span>'; }
  function paint() {
    $('p-logo').textContent = state.logo;
    $('p-box').setAttribute('placeholder', state.ph);
    $('p-b1').value = state.v1; $('p-b1').setAttribute('aria-label', state.a1);
    $('p-b2').value = state.v2; $('p-b2').setAttribute('aria-label', state.a2);
    $('panel').innerHTML =
      '<div class="ln dim">&lt;<b>body</b>&gt;</div>' +
      '<div class="ln" data-for="p-logo">  &lt;<b>h1</b> <i>class</i>=<q>logo</q>&gt;' + ed('logo') + '&lt;/<b>h1</b>&gt;</div>' +
      '<div class="ln" data-for="p-box">  &lt;<b>input</b> <i>type</i>=<q>text</q> <i>placeholder</i>=<q>' + ed('ph') + '</q>&gt;</div>' +
      '<div class="ln" data-for="p-b1">  &lt;<b>input</b> <i>type</i>=<q>button</q> <i>value</i>=<q>' + ed('v1') + '</q> <i>aria-label</i>=<q>' + ed('a1') + '</q>&gt;</div>' +
      '<div class="ln" data-for="p-b2">  &lt;<b>input</b> <i>type</i>=<q>button</q> <i>value</i>=<q>' + ed('v2') + '</q> <i>aria-label</i>=<q>' + ed('a2') + '</q>&gt;</div>' +
      '<div class="ln dim">&lt;/<b>body</b>&gt;</div>';
  }
  function select(id) {
    document.querySelectorAll('.ln').forEach(function (l) { l.classList.toggle('sel', !!id && l.getAttribute('data-for') === id); });
    document.querySelectorAll('.page .pick').forEach(function (el) { el.classList.toggle('hl', !!id && el.id === id); });
  }
  function reset(msg) { Object.keys(ORIGINAL).forEach(function (k) { state[k] = ORIGINAL[k]; }); paint(); select(null); ro.textContent = msg; }
  var SAYS = {
    logo: 'You changed the text between the h1 tags. The heading on the page changed at once.',
    ph: 'You changed the placeholder attribute: the grey hint inside the text box changed.',
    v1: 'You changed value: that is the label the button shows, so the page changed.',
    v2: 'You changed value: that is the label the button shows, so the page changed.',
    a1: 'You changed aria-label. Nothing on screen moved: only screen readers use it. One would now announce "',
    a2: 'You changed aria-label. Nothing on screen moved: only screen readers use it. One would now announce "'
  };
  document.querySelector('.page').addEventListener('click', function (e) {
    var el = e.target.closest('.pick'); if (!el) return;
    e.preventDefault(); select(el.id);
    ro.textContent = 'Inspect: the Elements panel jumps to the line that made this element.';
  });
  $('panel').addEventListener('dblclick', function (e) {
    var span = e.target.closest('.ed'); if (!span) return;
    span.contentEditable = 'true'; span.focus();
    var r = document.createRange(); r.selectNodeContents(span);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    var done = false;
    function commit() {
      if (done) return; done = true;
      var k = span.getAttribute('data-k'), v = span.textContent.replace(/\s+/g, ' ').trim();
      var changed = v !== state[k];
      state[k] = v; paint();
      if (changed) ro.textContent = SAYS[k] + (k === 'a1' || k === 'a2' ? v + ', button".' : '') + '\nThe change lives only in this tab. Press Refresh to see what happens to it.';
    }
    span.addEventListener('blur', commit);
    span.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); commit(); } });
  });
  $('refresh').addEventListener('click', function () {
    reset('Refresh: the browser downloaded the original files from the server again.\nEvery edit you made is gone, because it only ever existed in your copy of the page.');
  });
  reset('Click something on the page to inspect it, then double-click a value in the panel to edit it.');
}

const INSPECT_DEMO = `
<style>
  .wrap{display:flex;gap:12px;align-items:stretch}
  .page{flex:1;background:#fff;border:1px solid #dfe3ee;border-radius:10px;padding:18px;text-align:center;font-family:Arial,sans-serif}
  .page h1{font-size:40px;color:#4a6cf7;margin:4px 0 14px}
  .page input[type=text]{width:80%;padding:8px 12px;border:1px solid #ccc;border-radius:20px}
  .page input[type=button]{margin:12px 3px 0;padding:6px 10px;background:#f2f2f2;border:1px solid #ddd;border-radius:4px;font-size:12px}
  .pick{cursor:pointer;outline-offset:2px}
  .pick.hl{outline:2px solid #ff5c8a}
  #panel{flex:1.25;background:#1e1f26;color:#cfd3e6;border-radius:10px;padding:10px 0;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.75;white-space:pre-wrap}
  #panel .ln{padding:0 10px}
  #panel .ln.sel{background:#2f3a5c}
  #panel .dim{color:#7d8296}
  #panel b{color:#ff8fb1;font-weight:400}
  #panel i{color:#ffcf6b;font-style:normal}
  #panel q{color:#9fe2b0;quotes:'"' '"'}
  #panel .ed{border-bottom:1px dotted #9fe2b0;cursor:text}
  #panel .ed[contenteditable=true]{background:#fff;color:#111;border:0;outline:2px solid #5b9cff}
  .ph{font-size:10.5px;color:#8b92a8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
</style>
<div class="knobs">
  <button id="refresh">⟳ Refresh (download the files again)</button>
  <span style="font-size:12px;color:#5b6382">click the page to inspect · double-click a green value to edit it</span>
</div>
<div class="wrap">
  <div class="page">
    <div class="ph">the page</div>
    <h1 id="p-logo" class="pick"></h1>
    <input id="p-box" class="pick" type="text">
    <div><input id="p-b1" class="pick" type="button"><input id="p-b2" class="pick" type="button"></div>
  </div>
  <div id="panel"></div>
</div>
<pre class="readout" id="ro" style="margin-top:12px;white-space:pre-wrap"></pre>
` + script(inspectDemo);


PG.add({
  id:'l001', index:1, udemyId:12638830, minutes:3, section:'s01', slug:'what-you-get', kind:'read',
  title:'What You\'ll Get in This Course',
  blurb:'The course trailer. The bootcamp starts from zero and runs through HTML, CSS, JavaScript, Node, databases and React, and almost every topic is taught by building something. This playground follows the same order with one page per lecture.',
});


PG.add({
  id:'l002', index:2, udemyId:12685347, minutes:0, section:'s01', slug:'course-syllabus', kind:'read',
  title:'Download the Course Syllabus',
  blurb:'The syllabus is a PDF listing every topic in order. Use it to see where each section sits and to choose a starting point if you already know some of the material. The sidebar here is the same map, lecture by lecture.',
});


PG.add({
  id:'l003', index:3, udemyId:12398824, minutes:0, section:'s01', slug:'twelve-rules-ebook', kind:'read',
  title:'Download the 12 Rules to Learn to Code eBook [Latest Edition]',
  blurb:'A free PDF of twelve study habits the App Brewery has noticed in its strongest students. The link is in the lecture\'s resources; open it from a desktop browser, because the Udemy mobile app may not download it.',
});


PG.add({
  id:'l004', index:4, udemyId:35001070, minutes:0, section:'s01', slug:'required-software', kind:'read',
  title:'Download the Required Software',
  blurb:'The toolkit for the front-end half of the course: <b>VS Code</b> to write code, three extensions (<b>Live Preview</b> to see your page next to the code, <b>Prettier</b> to tidy formatting, <b>vscode-icons</b> for file icons) and <b>Google Chrome</b> for its developer tools. In this playground the Build tab does Live Preview\'s job, so you can start without installing anything.',
  links:[
    { title:'Visual Studio Code', url:'https://code.visualstudio.com/', note:'the free code editor used for the whole course' },
    { title:'Live Preview (Microsoft)', url:'https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server', note:'right-click index.html → Show Preview' },
    { title:'Prettier', url:'https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode', note:'formats your code; turn on Format On Save' },
    { title:'vscode-icons', url:'https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons', note:'file-type icons in the Explorer' },
    { title:'Google Chrome', url:'https://www.google.com/chrome/', note:'for Chrome DevTools: F12, or Cmd+Option+I on a Mac' },
  ],
  quiz:[
    { q:'What does the Live Preview extension do?', options:['Formats your code when you save','Shows your HTML page inside VS Code and refreshes it as you save','Adds icons to the file list','Puts your site on the internet'], answer:1, why:'Right-click index.html → Show Preview opens the page beside your code, so every save shows up straight away.' },
    { q:'An older video tells you to open Atom. What do you do?', options:['Install Atom','Skip that lesson','Do the same thing in VS Code','Use Notepad'], answer:2, why:'Atom has been retired. Everything the videos do in Atom works the same way in VS Code.' },
    { q:'Why does the course want Chrome even if you normally use another browser?', options:['Only Chrome can open HTML files','Its developer tools are used throughout, so your screen matches the videos','VS Code only works with Chrome','Extensions need Chrome'], answer:1, why:'Chrome DevTools (Inspect, the console) come up again and again; other browsers have similar tools that look different.' },
  ],
});


PG.add({
  id:'l005', index:5, udemyId:12286980, minutes:5, section:'s01', slug:'how-the-internet-works', kind:'read',
  title:'How Does the Internet Actually Work?',
  blurb:'The internet is cables, not a cloud. When you type a web address, your browser asks your <b>ISP</b>, the ISP asks a <b>DNS server</b> to turn the name into an <b>IP address</b>, and the browser then requests the files directly from the server at that address. Undersea fibre cables carry the traffic between continents.',
  links:[
    { title:'nslookup.io', url:'https://www.nslookup.io/', note:'look up the IP addresses behind a domain, then paste one into a new tab' },
    { title:'Submarine Cable Map', url:'https://www.submarinecablemap.com/', note:'the undersea cables the lecture shows; find the ones that reach your country' },
  ],
  explore:[{
    title:'What happens when you type a URL', height:500,
    note:'Send a request and follow it hop by hop. The DNS lookup is the only reason the name matters: after that, everything travels by IP address.',
    html: DNS_DEMO,
  }],
  quiz:[
    { q:'What does a DNS server do?', options:['Stores the files of a website','Turns a domain name into an IP address','Connects your house to the internet','Encrypts your traffic'], answer:1, why:'DNS is the phone book of the internet: it looks up the name and returns the IP address of the machine hosting the site.' },
    { q:'Which of these is the <b>client</b>?', options:['The computer serving the website','Your laptop or phone running the browser','The ISP','The DNS server'], answer:1, why:'The client is whatever a person uses to request pages. The server is the always-on machine that answers.' },
    { q:'After the browser has the IP address, who does it send the page request to?', options:['The ISP, which fetches the page','The DNS server','The server at that IP address, directly','Google'], answer:2, why:'Once the address is known, the request goes straight to the server, which replies with the site\'s files.' },
    { q:'Every computer on the internet has an IP address. What is it most like?', options:['A password','A postcode: a unique location others use to find it','A brand name','A web page'], answer:1, why:'Like a postcode, an IP address tells other computers where to send data and where to ask for files.' },
  ],
});


PG.add({
  id:'s01-how-the-web-works', index:6, udemyId:12286990, minutes:8, section:'s01', slug:'how-the-web-works', kind:'build',
  title:'How Do Websites Actually Work?',
  blurb:'A server sends your browser three kinds of file. <b>HTML</b> is the content (the bricks), <b>CSS</b> is the styling (wall colour, door shape) and <b>JavaScript</b> is the functionality (lights and a cooker that actually work). The browser combines them into the page you see, and Chrome\'s <b>Inspect</b> tool lets you edit that page, though only your own copy of it.',
  tasks:[
    'Look at the three file tabs: <code>index.html</code> holds the content (a logo, a text box, two buttons), <code>style.css</code> the looks, <code>script.js</code> the behaviour. Type something in the preview\'s search box and press <b>Seek Search</b>.',
    'In <code>index.html</code>, change the first button\'s <code>value</code> to your name plus "Search" (e.g. <code>Ada Search</code>). Leave its <code>aria-label</code> alone: that is what a screen reader announces, and it never shows on screen.',
    'In <code>style.css</code>, give the buttons a new <code>background-color</code> and make the search box rounder. CSS can only restyle what the HTML already made; it cannot add a third button.',
    'In <code>script.js</code>, change the message the page shows after a search.',
    'Right-click the preview and choose <b>Inspect</b>. In the Elements panel, double-click the text <code>Seek</code> inside the <code>h1</code> and type something else: the page changes. Now press <b>▶ Run</b>. Your edit is gone, because the page was rebuilt from the files, just as a refresh downloads them from the server again.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Seek</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- HTML is the content: one logo, one text box, two buttons -->
  <h1 class="logo">Seek</h1>

  <input type="text" id="query" placeholder="Search the web" />

  <div class="buttons">
    <!-- TODO 2: change the value (the label you see). Leave aria-label as it is. -->
    <input type="button" id="search-btn" value="Seek Search" aria-label="Seek Search" />
    <input type="button" id="lucky-btn" value="I'm Feeling Lucky" aria-label="I'm Feeling Lucky" />
  </div>

  <p id="result"></p>

  <script src="script.js"></script>
</body>
</html>
`,
'style.css':`/* CSS is the styling. It restyles elements the HTML already created. */
body {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  padding-top: 40px;
}

.logo {
  font-size: 64px;
  color: #4a6cf7;
  margin: 0 0 20px;
}

#query {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #cccccc;
  border-radius: 6px; /* TODO 3: make the box rounder, e.g. 24px */
  font-size: 16px;
}

.buttons {
  margin-top: 16px;
}

.buttons input {
  background-color: #f2f2f2; /* TODO 3: pick your own colour */
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 8px 14px;
  margin: 0 4px;
  cursor: pointer;
}

#result {
  color: #2a8a4a;
  font-weight: bold;
}
`,
'script.js':`// JavaScript is the functionality. Without this file the buttons do nothing.
const query = document.getElementById("query");
const result = document.getElementById("result");

function search() {
  // TODO 4: change the message shown after a search
  result.textContent = "Searching the web for: " + query.value;
}

document.getElementById("search-btn").addEventListener("click", search);

query.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search();
  }
});

document.getElementById("lucky-btn").addEventListener("click", function () {
  result.textContent = "Feeling lucky? Your number is " + Math.ceil(Math.random() * 100);
});
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Seek</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <h1 class="logo">Seek</h1>

  <input type="text" id="query" placeholder="Search the web" />

  <div class="buttons">
    <!-- the visible label changed; aria-label still says what a screen reader reads -->
    <input type="button" id="search-btn" value="Ada Search" aria-label="Seek Search" />
    <input type="button" id="lucky-btn" value="I'm Feeling Lucky" aria-label="I'm Feeling Lucky" />
  </div>

  <p id="result"></p>

  <script src="script.js"></script>
</body>
</html>
`,
'style.css':`body {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  padding-top: 40px;
}

.logo {
  font-size: 64px;
  color: #4a6cf7;
  margin: 0 0 20px;
}

#query {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #cccccc;
  border-radius: 24px;
  font-size: 16px;
}

.buttons {
  margin-top: 16px;
}

.buttons input {
  background-color: #4a6cf7;
  color: white;
  border: 1px solid #3653d6;
  border-radius: 4px;
  padding: 8px 14px;
  margin: 0 4px;
  cursor: pointer;
}

#result {
  color: #2a8a4a;
  font-weight: bold;
}
`,
'script.js':`const query = document.getElementById("query");
const result = document.getElementById("result");

function search() {
  result.textContent = "Ada is looking for: " + query.value;
}

document.getElementById("search-btn").addEventListener("click", search);

query.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    search();
  }
});

document.getElementById("lucky-btn").addEventListener("click", function () {
  result.textContent = "Feeling lucky? Your number is " + Math.ceil(Math.random() * 100);
});
`},
  explore:[
  {
    title:'The three languages, layered', height:520,
    note:'The same page with each layer switched on and off. HTML alone is readable but plain; CSS changes how those same elements look (it never adds new ones); JavaScript makes the button do something.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="h" checked disabled> HTML — content (always on)</label>
  <label><input type="checkbox" id="c" checked> CSS — styling</label>
  <label><input type="checkbox" id="j" checked> JavaScript — functionality</label>
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
      'HTML       the heading, the text, the button: the CONTENT\\n' +
      (document.getElementById('c').checked
        ? 'CSS        colours, spacing, fonts, rounded corners: the LOOK of the same elements\\n'
        : 'CSS off  → still readable, just the browser\\'s plain defaults. Nothing disappeared.\\n') +
      (document.getElementById('j').checked
        ? 'JavaScript the button actually counts your clicks: the BEHAVIOUR'
        : 'JS off   → the button is there and clickable, but nothing happens');
  }
  document.getElementById('c').addEventListener('change', build);
  document.getElementById('j').addEventListener('change', build);
  build();
<\/script>`
  },
  {
    title:'Inspect, edit, refresh', height:410,
    note:'A practice run of what you do in Chrome DevTools. Click an element to find its HTML, double-click a value to change it, then refresh. Try the <code>aria-label</code> too: it changes nothing you can see.',
    html: INSPECT_DEMO,
  }],
  quiz:[
    { q:'Which file decides what is <b>on</b> the page: the text, the buttons, the images?', options:['style.css','script.js','index.html','The browser'], answer:2, why:'HTML is the content. CSS and JavaScript only work on elements the HTML created.' },
    { q:'Can CSS add a new button to a page?', options:['Yes, with the right property','No: it can only change how existing elements look','Only with JavaScript turned off','Only in Chrome'], answer:1, why:'CSS targets elements that already exist and styles them. New content comes from HTML (or from JavaScript creating HTML).' },
    { q:'You edit a headline with Inspect, then refresh. What happens?', options:['The site is changed for everyone','The edit stays only on your computer','The original comes back, because the browser downloads the files again','The browser asks if you want to save'], answer:2, why:'DevTools edits live in your tab only. A refresh fetches the server\'s files and renders them from scratch.' },
  ],
  notes:`
    <h3>Front end and back end</h3>
    <table>
      <tr><th>Front end</th><th>Back end</th></tr>
      <tr><td>Runs in the user's browser</td><td>Runs on the server</td></tr>
      <tr><td>HTML, CSS, JavaScript</td><td>Node, Express, databases</td></tr>
      <tr><td>What people see and click</td><td>Accounts, payments, stored data</td></tr>
    </table>
    <p>Sections 1–20 of the course are front end. The back end starts at section 22.</p>
    <h3>Three files, three jobs</h3>
    <ul>
      <li><b>HTML: content.</b> The bricks. Every heading, picture, text box and button exists because the HTML says so.</li>
      <li><b>CSS: styling.</b> The paint colour and the shape of the door. It picks elements the HTML made and changes how they look.</li>
      <li><b>JavaScript: functionality.</b> Light switches and a cooker that work. It makes the page respond, like sending an email or posting a photo.</li>
    </ul>
    <p>A short way to remember it: HTML is the nouns, CSS the adjectives, JavaScript the verbs.</p>
    <h3>Inspect vs View Page Source</h3>
    <p><b>Inspect</b> (right-click on any element) shows the live page the browser is drawing, and you can edit it. <b>View Page Source</b> (Cmd+Option+U / Ctrl+U) shows the original file the server sent. Edits made in Inspect stay in your tab until you refresh.</p>
    <p>On Google's search button the visible label is the <code>value</code> attribute; <code>aria-label</code> is for screen readers only. Editing the wrong one is why "nothing happened" for many people in the video.</p>`
});


PG.add({
  id:'l007', index:7, udemyId:13268600, minutes:10, section:'s01', slug:'study-method', kind:'read',
  title:'How to Get the Most Out of the Course',
  blurb:'Watch about ten minutes at a time to understand <i>why</i> each line is written, then close the video and rebuild the code from memory; typing along word for word teaches very little. Take Cornell-style notes, change the playback speed to suit you, don\'t skip sections, and when a topic is too hard, park it and come back in a week. Getting stuck is normal: search the error like a professional.',
  quiz:[
    { q:'What does the course suggest instead of typing along with the video?', options:['Watching everything at double speed first','Watching a short chunk for understanding, then rebuilding the code yourself without looking','Copying the finished code from the resources','Only reading the notes'], answer:1, why:'Recalling the code forces you to understand it; copying it in sync with the video mostly practises typing.' },
    { q:'A topic feels impossible. What is the advice?', options:['Skip the rest of the section','Note where it is, read around it, and come back about a week later','Rewatch it ten times in a row','Wait for the solution in the Q&A'], answer:1, why:'A second attempt after a break is usually much easier, and skipping leaves gaps that later lessons depend on.' },
  ],
});


PG.add({
  id:'l008', index:8, udemyId:17104604, minutes:7, section:'s01', slug:'getting-unstuck', kind:'read',
  title:'How to Get Help When You\'re Stuck',
  blurb:'A routine for code that misbehaves: decide what you expect <i>before</i> running it and compare with what happens; read the error and search it (Google, Stack Overflow); rewatch up to where it broke; compare your code with the finished version (here: <b>Show solution</b>); then check that lecture\'s Q&A. If you post, say what you expected, what happened, and attach screenshots of the code and the error.',
  quiz:[
    { q:'What is the first step when your code does something unexpected?', options:['Post in the Q&A','Compare what you expected to happen with what actually happened','Download the solution','Restart the computer'], answer:1, why:'Knowing exactly where expectation and reality differ tells you what to search for and where to look.' },
    { q:'Which Q&A post is most likely to get a useful answer?', options:['"It doesn\'t work, help"','"I expected the heading to be blue but it is black. Screenshots of my CSS and the console are attached."','"Can someone send me their code?"','"Is this course out of date?"'], answer:1, why:'Expected, actual, the code and the error output: that is everything a helper needs.' },
  ],
});


PG.add({
  id:'l009', index:9, udemyId:12398844, minutes:0, section:'s01', slug:'pathfinder', kind:'read',
  title:'Pathfinder',
  blurb:'A self-assessment: pick the description that fits you and start where it points. Complete beginners start at the beginning and skip nothing, at roughly a section a week. People with some HTML and CSS can start at CSS, programmers new to the web at JavaScript, and web developers at the back end or React. The links below open the matching place in this playground.',
  links:[
    { title:'1. Total beginner', url:'#/l/11', note:'start at lecture 11, What is HTML?, and do every section in order' },
    { title:'2. Some HTML and CSS already', url:'#/l/32', note:'start at lecture 32, Why do we need CSS?, and do every challenge' },
    { title:'3. Under six months of JavaScript', url:'#/s14', note:'skim the JavaScript introduction and make sure every challenge feels easy' },
    { title:'4. Experienced programmer, new to the web', url:'#/s14', note:'start at the JavaScript sections; expect a few quirks' },
    { title:'5. Experienced web developer', url:'#/s23', note:'go to the back end, starting with Node.js' },
    { title:'6. Only here for React', url:'#/s36', note:'jump to the React section' },
  ],
});

})();
