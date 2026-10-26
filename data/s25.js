/* ===== Section 25 — EJS ===== */

PG.add({
  id:'l209', index:209, udemyId:38911782, minutes:23, section:'s25', slug:'what-is-ejs', kind:'node',
  title:'What is EJS?',
  blurb:'Building a page as a string inside <code>res.send</code> stops working once the page needs real markup, stylesheets and fonts. A templating language keeps the HTML in its own file: <b>EJS</b> (Embedded JavaScript) templates live in a <code>views</code> folder, <code>res.render("index.ejs", { key: value })</code> fills one in on the server, and <code>&lt;%= key %&gt;</code> prints a value into the page.',
  tasks:[
    'Replace the placeholder <code>res.send</code> in <code>GET /</code> with <code>res.render("index.ejs", { dayType: "a weekday", advice: "it\'s time to work hard" })</code>.',
    'In <code>views/index.ejs</code>, write an <code>&lt;h1&gt;</code> that reads <i>Hey, it\'s …, …!</i>, using <code>&lt;%= dayType %&gt;</code> and <code>&lt;%= advice %&gt;</code>. Press <b>▶ Run</b> and check the page.',
    'Now find the real day: <code>new Date().getDay()</code> returns 0 (Sunday) to 6 (Saturday). Store it in <code>day</code> and log it to check.',
    'Keep the weekday wording in two <code>let</code> variables and, when <code>day === 0 || day === 6</code>, switch them to <i>the weekend</i> and <i>it\'s time to have some fun</i>. Pass the variables to the template.',
    'Test the branch you are not in today: temporarily write <code>const day = 6;</code> (or 3), run, then put <code>getDay()</code> back.',
    'Rename the <code>dayType</code> key in <code>res.render</code> without touching the template, run, and read the error. Undo it.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[{ method:'GET', path:'/', expect:200 }],
  files:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // TODO 3: today's day number: new Date().getDay()  (0 = Sunday … 6 = Saturday)

  // TODO 4: weekday wording by default, weekend wording when the day is 0 or 6

  // TODO 1: render index.ejs with { dayType: ..., advice: ... } instead of this line
  res.send("TODO: render views/index.ejs here");
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekday Warrior</title>
</head>
<body>
  <!-- TODO 2: an h1 that reads  Hey, it's (dayType), (advice)!
       with an output tag for each of the two values -->

</body>
</html>
`,
'package.json':`{
  "name": "weekday-warrior",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const today = new Date();
  const day = today.getDay();
  console.log(day);

  let type = "a weekday";
  let adv = "it's time to work hard";

  if (day === 0 || day === 6) {
    type = "the weekend";
    adv = "it's time to have some fun";
  }

  res.render("index.ejs", {
    dayType: type,
    advice: adv,
  });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekday Warrior</title>
</head>
<body>
  <h1>Hey, it's <%= dayType %>, <%= advice %>!</h1>
</body>
</html>
`},
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>Express looks for templates in the <code>views</code> folder, and with the <code>ejs</code> package installed it picks the engine from the <code>.ejs</code> extension, so no <code>app.set("view engine", …)</code> line is needed.</li>
      <li>Testing with a fixed date? <code>new Date("2025-06-21")</code> is read as midnight UTC, which is still Friday in the Americas. Add a time to get local time, <code>new Date("2025-06-21T12:00")</code>, or set <code>day</code> to a number while you test.</li>
      <li>For highlighting in <code>.ejs</code> files, install the VS Code extension "EJS language support".</li>
    </ul>`,
  quiz:[
    { q:'Where does Express look for the file in <code>res.render("index.ejs")</code>?', options:['The public folder','The views folder','Next to index.js','node_modules/ejs'], answer:1, why:'views is the default folder for templates; one saved anywhere else is not found.' },
    { q:'What does <code>&lt;%= advice %&gt;</code> do?', options:['Runs code without printing anything','Evaluates advice and writes its value into the HTML','Declares a variable called advice','Includes a file named advice'], answer:1, why:'The = tag outputs the value of the expression, HTML-escaped.' },
    { q:'The route calls <code>res.render("index.ejs", { dayType: type })</code>. Which name does the template use?', options:['type','dayType','locals.type','index.dayType'], answer:1, why:'Each key of the data object becomes a variable in the template. The name of the local variable in index.js does not matter.' },
    { q:'Why can <code>res.sendFile</code> not fill a value into a page?', options:['It only sends CSS','It sends the file exactly as it is on disk, without running a template engine','It is slower than render','It needs body-parser'], answer:1, why:'Only res.render runs the template engine, which executes the EJS tags before the HTML is sent.' },
    { q:'What does <code>new Date().getDay()</code> return on a Sunday?', options:['7','1','0','"Sunday"'], answer:2, why:'getDay counts from 0 (Sunday) to 6 (Saturday), hence the test day === 0 || day === 6.' },
  ],
});

PG.add({
  id:'l210', index:210, udemyId:38911792, minutes:18, section:'s25', slug:'ejs-tags', kind:'node',
  title:'EJS Tags',
  blurb:'The character after <code>&lt;%</code> decides what a tag does. <code>&lt;%=</code> prints a value (HTML-escaped), <code>&lt;%</code> runs JavaScript without printing (if, loops), <code>&lt;%-</code> prints raw HTML, <code>&lt;%#</code> is a comment that never leaves the server, <code>&lt;%%</code> prints a literal <code>&lt;%</code>, and <code>&lt;%- include("file.ejs") %&gt;</code> pastes in another template.',
  tasks:[
    'The route already passes <code>title</code>, <code>seconds</code>, <code>items</code> and <code>htmlContent</code>. Put <code>title</code> in the <code>&lt;h1&gt;</code> and <code>seconds</code> in the paragraph, each with an output tag.',
    'Turn the comments into an if/else with scriptlet tags: when <code>seconds % 2 === 0</code> show the list, otherwise show <i>No items to display</i>. Every line of JavaScript, even a lone <code>}</code>, needs its own tag.',
    'Inside the <code>&lt;ul&gt;</code>, loop over <code>items</code> with <code>items.forEach((fruit) =&gt; { … })</code> and print each one in an <code>&lt;li&gt;</code>.',
    'Print <code>htmlContent</code> with <code>&lt;%-</code> so the emphasis renders. Swap it to <code>&lt;%=</code> once to see the tags turn into visible text.',
    'Add <code>&lt;%- include("footer.ejs") %&gt;</code> at the end of the body.',
    'Reload (⟳) a few times to land on both an even and an odd second. The Explore tab lets you try every tag on one value.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[{ method:'GET', path:'/', expect:200 }],
  files:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const data = {
    title: "EJS Tags",
    seconds: new Date().getSeconds(),
    items: ["apple", "banana", "cherry"],
    htmlContent: "<em>This is some em text</em>",
  };
  res.render("index.ejs", data);
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EJS Tags</title>
</head>
<body>
  <h1>
    <!-- TODO 1: the title goes here -->
  </h1>
  <p>Current second:
    <!-- TODO 1: the current second goes here -->
  </p>

  <!-- TODO 2: if the current second is even, show this list ... -->
  <ul>
    <!-- TODO 3: one li per entry in the items array -->
  </ul>
  <!-- ... otherwise show this paragraph instead: -->
  <p>No items to display</p>

  <p>
    <!-- TODO 4: htmlContent goes here, rendered as HTML -->
  </p>

  <!-- TODO 5: include footer.ejs -->
</body>
</html>
`,
'views/footer.ejs':`<footer>
  <p>Copyright © from footer.ejs</p>
</footer>
`},
  solution:{
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EJS Tags</title>
</head>
<body>
  <h1><%= title %></h1>
  <p>Current second: <%= seconds %></p>

  <% if (seconds % 2 === 0) { %>
    <ul>
      <% items.forEach((fruit) => { %>
        <li><%= fruit %></li>
      <% }) %>
    </ul>
  <% } else { %>
    <p>No items to display</p>
  <% } %>

  <p><%- htmlContent %></p>

  <%# An EJS comment: this line is never sent to the browser %>
  <%- include("footer.ejs") %>
</body>
</html>
`},
  explore:[{
    title:'EJS tag lab', height:620,
    note:'Real EJS runs here on every keystroke. Pick an example, move the seconds slider, change <code>htmlContent</code>, or edit the template. The middle pane is the HTML the server would send; the bottom box is how a browser shows it.',
    html:`
<div class="knobs">
  <label>example <select id="preset">
    <option value="tags">one value, every tag</option>
    <option value="ifelse">if / else with scriptlet tags</option>
    <option value="loop">a loop over items</option>
    <option value="misc">comments, literal tags, include</option>
  </select></label>
  <label>seconds <input type="range" id="sec" min="0" max="59" value="14"><span class="val" id="secVal"></span></label>
</div>
<div class="knobs">
  <label>htmlContent = <input type="text" id="html" style="width:280px"></label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px"><h4>template (edit it)</h4>
    <textarea id="tpl" spellcheck="false" style="width:100%;height:200px;font:12.5px/1.5 ui-monospace,Menlo,monospace;padding:10px;border:1px solid #dfe3ee;border-radius:8px;resize:vertical"></textarea></div>
  <div style="flex:1;min-width:260px"><h4>HTML the server sends</h4>
    <pre class="readout" id="src" style="height:200px;overflow:auto;white-space:pre-wrap;margin:0"></pre></div>
</div>
<h4 style="margin-top:12px">what the browser shows</h4>
<div class="stage" id="view"></div>
<script src="vendor/ejs/ejs.min.js"><\/script>
<script>
  var NL = String.fromCharCode(10);
  var FOOTER = '<footer><p>Copyright © from footer.ejs</p></footer>';
  var PRESETS = {
    tags: [
      '<p>escaped: <%= htmlContent %></p>',
      '<p>raw: <%- htmlContent %></p>',
      '<p>scriptlet: <% htmlContent.toUpperCase() %>(it ran, but printed nothing)</p>',
      '<p>comment: <%# htmlContent %>(never sent)</p>',
      '<p>literal: <%%= htmlContent %></p>'
    ],
    ifelse: [
      '<p>Current second: <%= seconds %></p>',
      '<% if (seconds % 2 === 0) { %>',
      '  <p>Even second, so this paragraph is sent.</p>',
      '<% } else { %>',
      '  <p>Odd second, so this one is sent instead.</p>',
      '<% } %>'
    ],
    loop: [
      '<ul>',
      '<% items.forEach((fruit) => { %>',
      '  <li><%= fruit %></li>',
      '<% }) %>',
      '</ul>'
    ],
    misc: [
      '<%# An EJS comment never reaches the browser. %>',
      '<' + '!-- An HTML comment does: look at the middle pane. --' + '>',
      '<p>To print a value in EJS you write <%%= value %>.</p>',
      '<%- include("footer.ejs") %>'
    ]
  };
  var tpl = document.getElementById('tpl'), sec = document.getElementById('sec'), html = document.getElementById('html');
  var src = document.getElementById('src'), view = document.getElementById('view');
  function load() { tpl.value = PRESETS[document.getElementById('preset').value].join(NL); render(); }
  function render() {
    document.getElementById('secVal').textContent = sec.value;
    var data = { title: 'EJS Tags', seconds: Number(sec.value), items: ['apple', 'banana', 'cherry'], htmlContent: html.value };
    try {
      var out = ejs.render(tpl.value, data, { includer: function () { return { template: FOOTER }; } });
      src.style.color = '';
      src.textContent = out.split(NL).filter(function (l) { return l.trim() !== ''; }).join(NL);
      view.innerHTML = out;
    } catch (e) {
      src.style.color = '#ff9aa2';
      src.textContent = String(e.message || e);
      view.innerHTML = '';
    }
  }
  html.value = '<em>This is some em text</em>';
  document.getElementById('preset').onchange = load;
  tpl.addEventListener('input', render);
  sec.addEventListener('input', render);
  html.addEventListener('input', render);
  load();
<\/script>`,
  }],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li><code>&lt;%-</code> prints exactly what it is given. Use it for HTML you control, such as includes, and never for text a visitor typed: they could slip their own HTML and scripts into your page.</li>
      <li>An EJS comment <code>&lt;%# … %&gt;</code> never leaves the server. An HTML comment <code>&lt;!-- … --&gt;</code> is sent to the browser and shows up in View Source.</li>
      <li>The code inside tags runs on the server while the page is built, so a <code>console.log</code> in a scriptlet prints in the server terminal, not in the browser console.</li>
    </ul>`,
  quiz:[
    { q:'<code>htmlContent</code> holds <code>"&lt;em&gt;hi&lt;/em&gt;"</code>. What does <code>&lt;%= htmlContent %&gt;</code> show in the browser?', options:['hi, in italics','The text &lt;em&gt;hi&lt;/em&gt;, tags and all','Nothing','An error'], answer:1, why:'The = tag escapes HTML, so the tags arrive as visible characters. The - tag would render them.' },
    { q:'Which tag runs JavaScript without printing anything?', options:['&lt;%=','&lt;%-','&lt;%','&lt;%#'], answer:2, why:'The plain scriptlet tag is for control flow: if, else, loops and variable declarations.' },
    { q:'Why does the closing brace of an if need its own <code>&lt;% } %&gt;</code>?', options:['EJS counts braces','Everything outside a tag is HTML to print, so the brace must sit inside a tag to count as code','Browsers require it','It does not; one tag can wrap the whole block'], answer:1, why:'EJS sees code inside tags and HTML outside them. A bare } would be printed as a character.' },
    { q:'How do you pull <code>footer.ejs</code> into a page?', options:['&lt;%= include("footer.ejs") %&gt;','&lt;%- include("footer.ejs") %&gt;','&lt;% include footer %&gt;','&lt;link href="footer.ejs"&gt;'], answer:1, why:'include returns HTML, and the - tag inserts it unescaped. With = you would see the footer\'s markup as text.' },
  ],
});

PG.add({
  id:'l211', index:211, udemyId:38911796, minutes:17, section:'s25', slug:'passing-data-to-ejs', kind:'node',
  title:'Passing Data to EJS Templates',
  blurb:'Data flows both ways: <code>res.render("index.ejs", { ... })</code> sends values into the template, and an HTML form sends them back as <code>req.body</code>. Reading a value that was never passed crashes the template — <code>locals.name</code> is the safe way to check.',
  tasks:[
    'Register body-parser: <code>app.use(bodyParser.urlencoded({ extended: true }))</code>, so form fields arrive in <code>req.body</code>.',
    'In the <code>GET /</code> route render <code>index.ejs</code> with no data.',
    'In <code>index.ejs</code>, add a form that POSTs to <code>/submit</code> with two text inputs named <code>fName</code> and <code>lName</code>.',
    'In <code>POST /submit</code>, add up the lengths of both names and render <code>index.ejs</code> again, passing <code>numberOfLetters</code>.',
    'In the template show "Enter your name below" when there is no count yet, otherwise "There are N letters in your name". Use <code>locals.numberOfLetters</code> so the first visit does not crash.',
    'Press <b>▶ Run</b>, fill the form in the built-in browser and submit it.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/submit', body:{ fName:'Ada', lName:'Lovelace' }, expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// TODO 1: use bodyParser.urlencoded so that form data arrives in req.body


app.get("/", (req, res) => {
  // TODO 2: render index.ejs

});

app.post("/submit", (req, res) => {
  // TODO 4: count the letters in req.body.fName and req.body.lName,
  //         then render index.ejs with { numberOfLetters: ... }

});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Name Letters</title>
</head>
<body>
  <!-- TODO 5: show "Enter your name below 👇" until numberOfLetters exists,
       then "There are N letters in your name." -->


  <!-- TODO 3: a form that POSTs fName and lName to /submit -->

</body>
</html>
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const numberOfLetters = req.body["fName"].length + req.body["lName"].length;
  res.render("index.ejs", { numberOfLetters: numberOfLetters });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Name Letters</title>
</head>
<body>
  <% if (locals.numberOfLetters) { %>
    <h1>There are <%= numberOfLetters %> letters in your name.</h1>
  <% } else { %>
    <h1>Enter your name below 👇</h1>
  <% } %>

  <form action="/submit" method="POST">
    <input type="text" name="fName" placeholder="First name">
    <input type="text" name="lName" placeholder="Last name">
    <input type="submit" value="OK">
  </form>
</body>
</html>
`},
  quiz:[
    { q:'The first visit to <code>/</code> renders the template with no data. Why does <code>&lt;%= numberOfLetters %&gt;</code> crash but <code>locals.numberOfLetters</code> does not?', options:['locals is faster','An undeclared name throws a ReferenceError; a missing property on an object is just undefined','EJS only allows locals','Express strips undefined values'], answer:1, why:'EJS compiles the template into a function; a bare name that was never passed is an unresolved identifier, while locals is always an object you can read properties from.' },
    { q:'Where does <code>req.body.fName</code> come from?', options:['The URL query string','The name attribute of the input, parsed by body-parser','The id attribute of the input','The placeholder text'], answer:1, why:'Form fields are sent as name=value pairs; bodyParser.urlencoded turns them into the req.body object keyed by each input\'s name.' },
    { q:'What happens if the POST route only computes the answer and never calls <code>res.render</code> or <code>res.send</code>?', options:['The browser shows a blank page','The browser hangs waiting for a response','Express sends 200 automatically','The template is reused'], answer:1, why:'Every request needs a response. Without one the client waits until it times out — the playground warns you about this in the terminal.' },
  ],
});

PG.add({
  id:'l212', index:212, udemyId:38911802, minutes:18, section:'s25', slug:'ejs-partials-and-layouts', kind:'node',
  title:'EJS Partials and Layouts',
  blurb:'CSS, images and favicons never change on the server, so they are <b>static</b> files: put them in a <code>public</code> folder and serve it with <code>app.use(express.static("public"))</code>. Links then start inside that folder (<code>/styles/layout.css</code>). Markup shared by every page, such as the head, navbar and footer, goes in <b>partials</b> that each page pulls in with <code>&lt;%- include("partials/header.ejs") %&gt;</code>.',
  tasks:[
    'Step 1: add <code>GET /</code> that renders <code>index.ejs</code>. Press <b>▶ Run</b>: the home page appears, but without any styling.',
    'Step 2: register <code>app.use(express.static("public"))</code> and run again. The CSS loads. Notice that <code>header.ejs</code> links <code>/styles/layout.css</code>, not <code>/public/styles/layout.css</code>.',
    'Step 3: read the nav links in <code>views/partials/header.ejs</code>, then add <code>GET /about</code> and <code>GET /contact</code> routes that render <code>about.ejs</code> and <code>contact.ejs</code>.',
    'Step 4: click About and Contact. They load but look bare. Add <code>&lt;%- include("partials/header.ejs") %&gt;</code> at the top and <code>&lt;%- include("partials/footer.ejs") %&gt;</code> at the bottom of both files.',
    'Bonus: highlight the current page in the navbar. Pass data to the include, <code>include("partials/header.ejs", { page: "about" })</code> (and "home", "contact" on the other pages), and in the header give a link <code>class="&lt;%= locals.page === \'about\' ? \'active\' : \'\' %&gt;"</code>. The CSS for <code>.active</code> is already there.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/about', expect:200 },
    { method:'GET', path:'/contact', expect:200 },
    { method:'GET', path:'/styles/layout.css', expect:200 },
    { method:'GET', path:'/images/profile.svg', expect:200 },
  ],
  files:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

// Step 2: serve the "public" folder (CSS and images) as static files


// Step 1: render index.ejs for the home page "/"


// Step 3: add routes that render about.ejs and contact.ejs
//         (the paths are in the nav links inside views/partials/header.ejs)


app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header.ejs") %>

<h1>Home Page</h1>
<p>Welcome! I build small web apps with Node, Express and EJS.</p>
<p>This page, the About page and the Contact page share one header and one footer, each written once in <code>views/partials</code>. Change the navbar there and every page changes with it.</p>

<%- include("partials/footer.ejs") %>
`,
'views/about.ejs':`<!-- Step 4: include the header partial here -->

<h1>About Me</h1>
<img class="profile" src="/images/profile.svg" alt="profile picture">
<p>I started learning web development to build small tools for myself: a reading list, a budget tracker, a page of notes for every course I take.</p>
<p>These days I am working through the back end: servers, templates and, soon, databases.</p>

<!-- Step 4: include the footer partial here -->
`,
'views/contact.ejs':`<!-- Step 4: include the header partial here -->

<h1>Contact Me</h1>
<form>
  <input name="name" type="text" class="feedback-input" placeholder="Name">
  <input name="email" type="email" class="feedback-input" placeholder="Email">
  <textarea name="text" class="feedback-input" placeholder="Comment"></textarea>
  <input type="submit" value="SUBMIT">
</form>

<!-- Step 4: include the footer partial here -->
`,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/layout.css">
  <link rel="stylesheet" href="/styles/content.css">
  <title>My Portfolio</title>
</head>
<body>
  <header>
    <nav class="navbar">
      <a class="navbar-brand" href="/">My Portfolio</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
`,
'views/partials/footer.ejs':`  </main>
  <footer>
    <p><a href="/">Home</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
    <p>Built with Express and EJS partials</p>
  </footer>
</body>
</html>
`,
'public/styles/layout.css':`* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background: #f4f6fb;
  color: #1f2433;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 24px;
  background: #3557d6;
}

.navbar-brand {
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 6px;
  list-style: none;
}

.nav-links a {
  display: block;
  padding: 8px 14px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

/* used by the bonus task: the link of the page you are on */
.nav-links a.active {
  background: #fff;
  color: #3557d6;
}

main {
  flex: 1;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 24px;
}

footer {
  background: #1f2433;
  text-align: center;
  padding: 24px;
  font-size: 0.9rem;
}

footer p {
  color: #c9cfe0;
  margin: 6px 0;
}

footer a {
  color: #fff;
}
`,
'public/styles/content.css':`h1 {
  font-size: 2rem;
  margin-bottom: 16px;
  text-align: center;
}

p {
  line-height: 1.7;
  color: #4a5068;
  margin-bottom: 14px;
}

.profile {
  display: block;
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  border-radius: 50%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.feedback-input {
  padding: 12px;
  border: 2px solid #c5cdea;
  border-radius: 8px;
  font: inherit;
}

.feedback-input:focus {
  outline: none;
  border-color: #3557d6;
}

textarea.feedback-input {
  min-height: 120px;
  resize: vertical;
}

input[type="submit"] {
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #3557d6;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
`,
'public/images/profile.svg':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <circle cx="80" cy="80" r="80" fill="#dbe3ff"/>
  <circle cx="80" cy="64" r="28" fill="#3557d6"/>
  <path d="M30 136c6-28 26-42 50-42s44 14 50 42" fill="#3557d6"/>
</svg>
`},
  solution:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header.ejs", { page: "home" }) %>

<h1>Home Page</h1>
<p>Welcome! I build small web apps with Node, Express and EJS.</p>
<p>This page, the About page and the Contact page share one header and one footer, each written once in <code>views/partials</code>. Change the navbar there and every page changes with it.</p>

<%- include("partials/footer.ejs") %>
`,
'views/about.ejs':`<%- include("partials/header.ejs", { page: "about" }) %>

<h1>About Me</h1>
<img class="profile" src="/images/profile.svg" alt="profile picture">
<p>I started learning web development to build small tools for myself: a reading list, a budget tracker, a page of notes for every course I take.</p>
<p>These days I am working through the back end: servers, templates and, soon, databases.</p>

<%- include("partials/footer.ejs") %>
`,
'views/contact.ejs':`<%- include("partials/header.ejs", { page: "contact" }) %>

<h1>Contact Me</h1>
<form>
  <input name="name" type="text" class="feedback-input" placeholder="Name">
  <input name="email" type="email" class="feedback-input" placeholder="Email">
  <textarea name="text" class="feedback-input" placeholder="Comment"></textarea>
  <input type="submit" value="SUBMIT">
</form>

<%- include("partials/footer.ejs") %>
`,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/layout.css">
  <link rel="stylesheet" href="/styles/content.css">
  <title>My Portfolio</title>
</head>
<body>
  <header>
    <nav class="navbar">
      <a class="navbar-brand" href="/">My Portfolio</a>
      <ul class="nav-links">
        <li><a href="/" class="<%= locals.page === 'home' ? 'active' : '' %>">Home</a></li>
        <li><a href="/about" class="<%= locals.page === 'about' ? 'active' : '' %>">About</a></li>
        <li><a href="/contact" class="<%= locals.page === 'contact' ? 'active' : '' %>">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
`},
  explore:[{
    title:'Where does this link point?', height:470,
    note:'Change the page, the <code>href</code> and the static middleware, and follow the request the browser makes. Try the presets: one works everywhere, one breaks on nested pages, one never works.',
    html:`
<div class="knobs">
  <label>page open in the browser <select id="page"><option>/</option><option>/about</option><option>/blog/first-post</option></select></label>
  <label><input type="checkbox" id="static" checked> app.use(express.static("public"))</label>
</div>
<div class="knobs">
  <label>&lt;link href=" <input type="text" id="href" value="/styles/layout.css" style="width:210px"> "&gt;</label>
  <span>try:</span>
  <button data-h="/styles/layout.css">/styles/layout.css</button>
  <button data-h="styles/layout.css">styles/layout.css</button>
  <button data-h="/public/styles/layout.css">/public/styles/layout.css</button>
  <button data-h="/styles/main.css">/styles/main.css</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="min-width:210px;margin:0"><h4>project</h4><div id="tree" style="font:12.5px/1.7 ui-monospace,Menlo,monospace;white-space:pre"></div></div>
  <pre class="readout" id="out" style="flex:1;min-width:280px;margin:0;white-space:pre-wrap"></pre>
</div>
<script>
  var NL = String.fromCharCode(10);
  var FILES = ['public/styles/layout.css', 'public/styles/content.css', 'public/images/profile.svg'];
  var TREE = ['index.js', 'public/', '  images/', '    profile.svg', '  styles/', '    content.css', '    layout.css', 'views/', '  index.ejs', '  about.ejs', '  contact.ejs', '  partials/', '    header.ejs', '    footer.ejs'];
  function go() {
    var page = document.getElementById('page').value;
    var href = document.getElementById('href').value.trim();
    var on = document.getElementById('static').checked;
    var u;
    try { u = new URL(href, 'http://localhost:3000' + page); } catch (e) { return; }
    var path = decodeURIComponent(u.pathname);
    var file = 'public' + path;
    var found = on && FILES.indexOf(file) !== -1;
    var lines = [
      'page:     http://localhost:3000' + page,
      'href:     ' + href,
      'request:  GET ' + path,
      ''
    ];
    if (!on) {
      lines.push('No static middleware: nothing serves files, and no route matches ' + path + '.');
      lines.push('Result: 404 Cannot GET ' + path + '. The page arrives unstyled.');
    } else if (found) {
      lines.push('express.static looks for ' + file + ' and finds it.');
      lines.push('Result: 200, file sent. The styles apply.');
    } else {
      lines.push('express.static looks for ' + file + ': no such file, so it passes the request on.');
      lines.push('No route matches either. Result: 404, and the page arrives unstyled.');
    }
    if (path.indexOf('/public/') === 0) lines.push('', 'Note: public is the folder Express serves FROM. It never appears in the URL; write /styles/layout.css.');
    if (href.charAt(0) !== '/' && href.indexOf('http') !== 0) lines.push('', 'Note: an href without a leading slash is resolved from the folder of the current page. It works on / and /about, but on /blog/first-post it points into /blog/. Start static links with /.');
    document.getElementById('out').textContent = lines.join(NL);
    var name = found ? file.split('/').pop() : null;
    var tree = document.getElementById('tree');
    tree.innerHTML = '';
    TREE.forEach(function (t) {
      var d = document.createElement('div');
      d.textContent = t;
      if (name && t.trim() === name) { d.style.background = '#d8f5e3'; d.style.fontWeight = '700'; }
      tree.appendChild(d);
    });
  }
  ['page', 'static', 'href'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', go);
    el.addEventListener('change', go);
  });
  document.querySelectorAll('[data-h]').forEach(function (b) {
    b.onclick = function () { document.getElementById('href').value = b.getAttribute('data-h'); go(); };
  });
  go();
<\/script>`,
  }],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>Paths in <code>res.render</code> and <code>include</code> start inside the <code>views</code> folder. Paths in <code>href</code> and <code>src</code> start inside the <code>public</code> folder. Neither contains the folder's own name.</li>
      <li>The header partial opens <code>&lt;html&gt;</code>, <code>&lt;body&gt;</code> and <code>&lt;main&gt;</code>, and the footer closes them, so the two always travel together.</li>
      <li>A template in a subfolder is rendered with its path: <code>res.render("blog/post.ejs")</code> for <code>views/blog/post.ejs</code>.</li>
    </ul>`,
  quiz:[
    { q:'The file is <code>public/styles/layout.css</code> and the app uses <code>express.static("public")</code>. Which href is right?', options:['/public/styles/layout.css','/styles/layout.css','../public/styles/layout.css','views/styles/layout.css'], answer:1, why:'express.static serves the contents of public from the site root, so public never appears in the URL.' },
    { q:'Why does the CSS not load before <code>app.use(express.static("public"))</code> is added?', options:['EJS removes link tags','Express only answers the routes you define; files need the static middleware','The browser blocks local CSS','CSS must be written inside the EJS file'], answer:1, why:'Without the middleware a request for /styles/layout.css matches nothing and gets a 404.' },
    { q:'What does a click on <code>&lt;a href="/about"&gt;</code> send to the server?', options:['Nothing; the browser opens about.ejs directly','A GET request for /about, which needs an app.get("/about") route','A POST request','A request for /views/about.ejs'], answer:1, why:'Views are never served as files. Each page is reached through a route that calls res.render.' },
    { q:'Which tag inserts a partial correctly?', options:['&lt;%= include("partials/header.ejs") %&gt;','&lt;%- include("partials/header.ejs") %&gt;','&lt;%- includes("partials/header.ejs") %&gt;','&lt;% include("partials/header.ejs") %&gt;'], answer:1, why:'include (singular) with the unescaped tag. The = tag would print the header\'s HTML as text, and a plain scriptlet prints nothing.' },
  ],
});

PG.add({
  id:'l213', index:213, udemyId:38911810, minutes:12, section:'s25', slug:'band-generator-project', kind:'node', project:true,
  title:'Band Generator Project',
  blurb:'The EJS section in one small app. A POST route picks a random adjective and noun, <code>res.render</code> hands them to the template, a <code>locals</code> check swaps the heading, partials carry the stylesheet link and the footer, and the footer works out the current year on the server.',
  tasks:[
    'Step 1: make <code>GET /</code> render <code>index.ejs</code>. Press <b>▶ Run</b>: the welcome heading and the button appear, still unstyled.',
    'Step 2a: in <code>POST /submit</code>, pick a random word from each array with <code>arr[Math.floor(Math.random() * arr.length)]</code> and render <code>index.ejs</code> with <code>{ adjective: …, noun: … }</code>.',
    'Step 2b: in <code>index.ejs</code>, show <code>&lt;%= adjective %&gt; &lt;%= noun %&gt;</code> in the <code>&lt;h1&gt;</code> when <code>locals.adjective &amp;&amp; locals.noun</code> exist, and the welcome heading otherwise.',
    'Step 3: serve <code>public</code> with <code>express.static</code>, link <code>/styles/main.css</code> in the header partial, and include the header and footer partials at the top and bottom of <code>index.ejs</code>.',
    'Step 4: replace the hard-coded year in the footer partial with <code>&lt;%= new Date().getFullYear() %&gt;</code>.',
    'Click <b>Generate Name</b> a few times, then make it yours: add words to the arrays or restyle the page.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/submit', expect:200 },
    { method:'POST', path:'/submit', expect:200 },
    { method:'GET', path:'/styles/main.css', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Step 3 - Make the styling show up.
// Hint 1: CSS files are static files!
// Hint 2: The header and footer are partials.
// Hint 3: Add the CSS link in header.ejs

// Step 4 - Add a dynamic year to the footer.
// Hint: a Date object has a method that returns the four-digit year.

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // Step 1 - Render index.ejs (replace this line).
  res.send("TODO: render index.ejs");
});

app.post("/submit", (req, res) => {
  // Step 2 - Make the "Generate Name" button work.
  // 1. Pick a random adjective from adj and a random noun from noun (scroll down).
  // 2. Render index.ejs and pass both words to it.
  // 3. In index.ejs, show them in the h1 when they exist.
  res.redirect("/");
});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});

const adj = [
  "amber", "atomic", "bashful", "brave", "brittle", "cosmic", "crimson", "dizzy",
  "electric", "fearless", "fuzzy", "gentle", "glowing", "golden", "grumpy", "hollow",
  "humble", "icy", "jolly", "lucky", "midnight", "mighty", "neon", "noisy",
  "polite", "quiet", "restless", "rusty", "silent", "silver", "sleepy", "smoky",
  "sneaky", "stormy", "sunny", "velvet", "wandering", "wild", "wobbly", "zesty",
];

const noun = [
  "accordions", "alpacas", "anchors", "badgers", "biscuits", "bonfires", "cacti", "comets",
  "crayons", "dragons", "echoes", "ferrets", "gnomes", "harbours", "hedgehogs", "kettles",
  "lanterns", "lemons", "llamas", "magpies", "marbles", "meteors", "moths", "noodles",
  "otters", "owls", "pancakes", "pebbles", "pigeons", "pirates", "puddles", "robots",
  "sardines", "teapots", "tigers", "toasters", "tulips", "volcanoes", "walruses", "wizards",
];
`,
'views/index.ejs':`<%# Step 3 - include the header partial here %>

<%# Step 2 - if an adjective and a noun were sent, show them in the h1.
    On the first visit nothing is sent, so show the default h1 below. %>
<h1>Welcome to the Band Generator 🤟</h1>

<form action="/submit" method="POST">
  <input type="submit" value="Generate Name">
</form>

<%# Step 3 - include the footer partial here %>
`,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <%# Step 3 - link the stylesheet public/styles/main.css here %>
  <title>Band Generator</title>
</head>
<body>
  <main>
`,
'views/partials/footer.ejs':`  </main>
  <footer>
    <%# Step 4 - replace 2023 with the current year, worked out on the server %>
    <p>Copyright © 2023</p>
  </footer>
</body>
</html>
`,
'public/styles/main.css':`body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #16121f;
  color: #ff7ac6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

h1 {
  font-size: 3rem;
  text-transform: capitalize;
  margin: 0 0 28px;
}

input[type="submit"] {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 14px 28px;
  background: #ff7ac6;
  color: #16121f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

input[type="submit"]:hover {
  background: #ffa3d9;
}

footer {
  text-align: center;
  padding: 16px;
  color: #8d84a6;
  font-size: 0.9rem;
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const randomAdj = adj[Math.floor(Math.random() * adj.length)];
  const randomNoun = noun[Math.floor(Math.random() * noun.length)];
  res.render("index.ejs", {
    adjective: randomAdj,
    noun: randomNoun,
  });
});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});

const adj = [
  "amber", "atomic", "bashful", "brave", "brittle", "cosmic", "crimson", "dizzy",
  "electric", "fearless", "fuzzy", "gentle", "glowing", "golden", "grumpy", "hollow",
  "humble", "icy", "jolly", "lucky", "midnight", "mighty", "neon", "noisy",
  "polite", "quiet", "restless", "rusty", "silent", "silver", "sleepy", "smoky",
  "sneaky", "stormy", "sunny", "velvet", "wandering", "wild", "wobbly", "zesty",
];

const noun = [
  "accordions", "alpacas", "anchors", "badgers", "biscuits", "bonfires", "cacti", "comets",
  "crayons", "dragons", "echoes", "ferrets", "gnomes", "harbours", "hedgehogs", "kettles",
  "lanterns", "lemons", "llamas", "magpies", "marbles", "meteors", "moths", "noodles",
  "otters", "owls", "pancakes", "pebbles", "pigeons", "pirates", "puddles", "robots",
  "sardines", "teapots", "tigers", "toasters", "tulips", "volcanoes", "walruses", "wizards",
];
`,
'views/index.ejs':`<%- include("partials/header.ejs") %>

<% if (locals.adjective && locals.noun) { %>
  <h1><%= adjective %> <%= noun %></h1>
<% } else { %>
  <h1>Welcome to the Band Generator 🤟</h1>
<% } %>

<form action="/submit" method="POST">
  <input type="submit" value="Generate Name">
</form>

<%- include("partials/footer.ejs") %>
`,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/main.css">
  <title>Band Generator</title>
</head>
<body>
  <main>
`,
'views/partials/footer.ejs':`  </main>
  <footer>
    <p>Copyright © <%= new Date().getFullYear() %></p>
  </footer>
</body>
</html>
`},
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>The page is rendered straight from the POST, so a browser refresh offers to resubmit the form. Redirecting after a POST avoids that, but then the band name needs another way to reach the page. That pattern comes later in the course.</li>
      <li><code>text-transform: capitalize</code> in the stylesheet is what turns <i>velvet pigeons</i> into <i>Velvet Pigeons</i>; the words themselves stay lowercase in the arrays.</li>
    </ul>`,
  quiz:[
    { q:'Why test <code>locals.adjective</code> instead of <code>adjective</code> in the if?', options:['locals is faster','On the first GET no data is passed, and a bare adjective would throw a ReferenceError','adjective is a reserved word','EJS needs the locals prefix everywhere'], answer:1, why:'locals always exists, so a missing property is just undefined instead of crashing the render.' },
    { q:'Which values can <code>Math.floor(Math.random() * arr.length)</code> produce?', options:['1 to arr.length','0 to arr.length','0 to arr.length - 1','Any decimal number'], answer:2, why:'Math.random() goes from 0 up to, but not including, 1, so the product stays below arr.length and floor gives a valid index.' },
    { q:'Where does <code>&lt;%= new Date().getFullYear() %&gt;</code> run?', options:['In the visitor\'s browser','On the server, every time the template is rendered','Once, when the server starts','Inside the CSS file'], answer:1, why:'EJS executes the tag while it builds the page, so the year is fresh in every response.' },
    { q:'The stylesheet is <code>public/styles/main.css</code>. What goes in the header partial?', options:['&lt;link rel="stylesheet" href="/styles/main.css"&gt;','&lt;link rel="stylesheet" href="/public/styles/main.css"&gt;','&lt;%- include("styles/main.css") %&gt;','&lt;style src="main.css"&gt;'], answer:0, why:'With express.static("public"), URLs start inside the public folder.' },
  ],
});

PG.add({
  id:'l214', index:214, udemyId:17967358, minutes:2, section:'s25', slug:'tip-location', kind:'read',
  title:'Tip from Angela - Location, Location, Location!',
  blurb:'Following a demo is not the same as being able to build it. Watch for the overall idea, jot down the functions and tools involved, then pause and attempt the exercise yourself before you see the solution. Early overconfidence and the later feeling of knowing nothing are both normal stages; steady practice is what moves you through them.',
  quiz:[
    { q:'Which routine does the tip recommend for coding lectures?', options:['Watch each video twice before writing any code','Get the overall idea, note the tools, then pause and try the exercise before seeing the solution','Copy the solution first, then read it','Skip exercises that look easy'], answer:1, why:'Trying it yourself shows what you can actually do, which watching alone never reveals.' },
  ],
});
