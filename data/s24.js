/* ===== Section 24 — Express.js with Node.js ===== */

PG.add({
  id:'l201', index:201, udemyId:12384462, minutes:7, section:'s24', slug:'what-is-express', kind:'read',
  title:'What is Express?',
  blurb:'Node.js is a <b>runtime</b>: it lets JavaScript run outside the browser, for any kind of program. Express is a <b>framework</b> you install on top of Node for one specific job, the back end of a website. A page becomes one <code>app.get(path, handler)</code> call instead of a hand-written chain of <code>if</code> checks on the URL.',
  links:[
    { title:'Express', url:'https://expressjs.com/', note:'official site, guides and API reference' },
    { title:'State of JavaScript', url:'https://stateofjs.com/', note:'yearly survey with back-end framework usage figures' },
  ],
  explore:[{
    title:'One two-page site, written twice', height:600,
    note:'Choose a request. Highlighted lines run, grey ones are skipped. In plain Node you check the method and URL yourself, set every status code and header, and write the 404 branch. Express turns each page into one <code>app.get</code> and answers unknown paths for you.',
    html:`
<div class="knobs">
  <label>method <select id="method"><option>GET</option><option>POST</option></select></label>
  <label>path <select id="path"><option>/</option><option>/about</option><option>/contact</option></select></label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:270px">
    <h4>Plain Node (the http module)</h4>
    <div class="code" id="nodeCode"></div>
    <pre class="readout" id="nodeOut"></pre>
  </div>
  <div style="flex:1;min-width:270px">
    <h4>Express</h4>
    <div class="code" id="expCode"></div>
    <pre class="readout" id="expOut"></pre>
  </div>
</div>
<p class="note" id="sum"></p>
<style>
  .code{background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:6px 0;margin-bottom:8px;font:12px/1.6 ui-monospace,Menlo,monospace;overflow-x:auto}
  .code div{padding:0 10px;white-space:pre;min-height:1.6em}
  .code .hit{background:#fff1b8}
  .code .skip{color:#a2a8bd}
</style>
<script>
  var NL = String.fromCharCode(10);
  var NODE = [
    { t:'import http from "node:http";' },
    { t:'' },
    { t:'const server = http.createServer((req, res) => {', k:'always' },
    { t:'  if (req.method === "GET" && req.url === "/") {', k:'test1' },
    { t:'    res.writeHead(200, { "Content-Type": "text/html" });', k:'home' },
    { t:'    res.end("<h1>Home</h1>");', k:'home' },
    { t:'  } else if (req.method === "GET" && req.url === "/about") {', k:'test2' },
    { t:'    res.writeHead(200, { "Content-Type": "text/html" });', k:'about' },
    { t:'    res.end("<h1>About</h1>");', k:'about' },
    { t:'  } else {', k:'miss' },
    { t:'    res.writeHead(404, { "Content-Type": "text/plain" });', k:'miss' },
    { t:'    res.end("Not found");', k:'miss' },
    { t:'  }' },
    { t:'});' },
    { t:'' },
    { t:'server.listen(3000);' }
  ];
  var EXP = [
    { t:'import express from "express";' },
    { t:'const app = express();' },
    { t:'' },
    { t:'app.get("/", (req, res) => {', k:'home' },
    { t:'  res.send("<h1>Home</h1>");', k:'home' },
    { t:'});' },
    { t:'' },
    { t:'app.get("/about", (req, res) => {', k:'about' },
    { t:'  res.send("<h1>About</h1>");', k:'about' },
    { t:'});' },
    { t:'' },
    { t:'app.listen(3000);' }
  ];
  function draw(id, lines, hits) {
    var box = document.getElementById(id);
    box.innerHTML = '';
    lines.forEach(function (l) {
      var d = document.createElement('div');
      d.textContent = l.t;
      if (l.k) d.className = hits.indexOf(l.k) !== -1 ? 'hit' : 'skip';
      box.appendChild(d);
    });
  }
  function count(lines) { return lines.filter(function (l) { return l.t.trim() !== ''; }).length; }
  function go() {
    var m = document.getElementById('method').value;
    var p = document.getElementById('path').value;
    var route = (m === 'GET' && p === '/') ? 'home' : (m === 'GET' && p === '/about') ? 'about' : 'miss';
    var nodeHits = ['always', 'test1'];
    if (route !== 'home') nodeHits.push('test2');
    nodeHits.push(route);
    draw('nodeCode', NODE, nodeHits);
    draw('expCode', EXP, route === 'miss' ? [] : [route]);
    var body = route === 'home' ? '<h1>Home</h1>' : '<h1>About</h1>';
    document.getElementById('nodeOut').textContent = route === 'miss'
      ? '404  Content-Type: text/plain' + NL + NL + 'Not found' + NL + NL + '(your own else branch wrote this)'
      : '200  Content-Type: text/html' + NL + NL + body + NL + NL + '(you set the status and the header by hand)';
    document.getElementById('expOut').textContent = route === 'miss'
      ? '404  Content-Type: text/html' + NL + NL + 'Cannot ' + m + ' ' + p + NL + NL + '(no route matched, so Express answered for you)'
      : '200  Content-Type: text/html' + NL + NL + body + NL + NL + '(res.send chose the status and the header)';
    document.getElementById('sum').textContent = 'Plain Node: ' + count(NODE) + ' lines, and each new page adds another else-if branch with its own headers. Express: ' + count(EXP) + ' lines, one app.get per page.';
  }
  document.getElementById('method').onchange = go;
  document.getElementById('path').onchange = go;
  go();
<\/script>`,
  }],
  quiz:[
    { q:'Which description is accurate?', options:['Node.js is a framework and Express is a runtime','Node.js runs JavaScript outside the browser; Express is a framework that sits on top of it','Express is built into Node.js','Express replaces Node.js on the server'], answer:1, why:'Node supplies the runtime. Express is a separate npm package that adds structure for web servers on top of it.' },
    { q:'Why do most Node back ends use Express rather than the bare <code>http</code> module?', options:['Bare Node cannot send HTML','Express code is shorter and easier to read, and it brings middleware','Express makes the computer faster','The http module was removed from Node'], answer:1, why:'Plain Node can do it all, but you write the routing, headers and 404 handling yourself. Express does that plumbing for you.' },
    { q:'Node is used for more than websites. Which of these is <b>not</b> a job for Node?', options:['A desktop app such as VS Code (through Electron)','A script running on a small IoT device','The back end of a website','Styling a web page in the browser'], answer:3, why:'Styling is CSS, interpreted by the browser. Node runs programs: servers, tools, desktop apps and device scripts.' },
  ],
});

PG.add({
  id:'l202', index:202, udemyId:12384540, minutes:22, section:'s24', slug:'first-express-server', kind:'node',
  title:'Creating Our First Server with Express',
  blurb:'Six steps from an empty folder to a running server: project folder, <code>index.js</code>, <code>npm init</code>, <code>npm i express</code>, the listen code, <code>node index.js</code>. The browser then shows <b>Cannot GET /</b> — which, for now, is success: the server is answering, it just has no routes yet.',
  tasks:[
    'In <code>index.js</code>, import express and create the app with <code>express()</code>.',
    'Call <code>app.listen(3000, callback)</code> and log <code>Server running on port 3000</code> from the callback.',
    'Press <b>▶ Run</b>. The terminal should show your message and the status pill should say <i>listening on :3000</i>.',
    'In the built-in browser open <code>http://localhost:3000</code>. You should see <b>Cannot GET /</b> — the server is up but has no route for <code>/</code> yet (that comes next lecture).',
    'Try <code>http://localhost:3001</code> too, to see what a port with nothing listening looks like.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[{ method:'GET', path:'/', expect:404 }],
  files:{
'index.js':`// 1. import the express package (ES module syntax — package.json has "type": "module")


// 2. create the app


// 3. start listening on port 3000 and log a message when it is ready

`,
'package.json':`{
  "name": "my-first-server",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`},
  quiz:[
    { q:'Why does the browser show <b>Cannot GET /</b> after this lecture?', options:['The server crashed','express is not installed','The server is running but has no handler for GET /','Port 3000 is blocked'], answer:2, why:'Express answers every request. With no routes defined, its default reply for GET / is that 404 message — proof the server is alive.' },
    { q:'What is <code>localhost</code>?', options:['A website hosted by Express','Your own computer, reached through the network stack','The npm registry','A DNS server'], answer:1, why:'localhost (127.0.0.1) always points at the machine you are on, so the browser and the server are the same computer here.' },
    { q:'What does the number in <code>app.listen(3000)</code> choose?', options:['How many users can connect','The port the server waits on','The version of Express','The speed of the server'], answer:1, why:'A port is a numbered door on a computer. The server opens door 3000; the browser knocks on localhost:3000.' },
    { q:'Which line makes <code>import express from "express"</code> legal in Node?', options:['"main": "index.js" in package.json','"type": "module" in package.json','npm init -y','const app = express()'], answer:1, why:'Without "type": "module" Node treats .js files as CommonJS, where you would have to write const express = require("express").' },
  ],
});

PG.add({
  id:'l203', index:203, udemyId:12384582, minutes:24, section:'s24', slug:'http-requests', kind:'node',
  title:'HTTP Requests',
  blurb:'HTTP is the language browsers and servers use with each other. Five request verbs cover nearly everything: <b>GET</b> fetches, <b>POST</b> sends new data, <b>PUT</b> replaces a resource, <b>PATCH</b> changes part of one and <b>DELETE</b> removes it. Typing a URL always sends GET, and <code>app.get(path, (req, res) =&gt; …)</code> tells Express how to answer one path, also called an <b>endpoint</b>.',
  tasks:[
    'Add a route for the home page: <code>app.get("/", (req, res) =&gt; { … })</code> that replies with <code>res.send("&lt;h1&gt;Hello&lt;/h1&gt;")</code>. Press <b>▶ Run</b>: the browser shows the heading instead of <b>Cannot GET /</b>.',
    'Inside that route, log what arrived: <code>req.method</code>, <code>req.url</code> and <code>req.headers</code>. Reload the page (⟳) and read the terminal. The log appears there, on the server, not in the page.',
    'Add <code>/contact</code> (an <code>&lt;h1&gt;</code> plus a phone number in a <code>&lt;p&gt;</code>) and <code>/about</code> (an <code>&lt;h1&gt;</code> plus a sentence about you), each with its own <code>app.get</code>.',
    'Run again and visit <code>/</code>, <code>/contact</code> and <code>/about</code> in the built-in browser. Then try <code>/pricing</code>: any path without a route still gets Cannot GET.',
    'In the <b>Postman</b> tab, send <code>GET http://localhost:3000/</code> with the header line <code>User-Agent: Postman</code> and find it in the headers your route logs.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/contact', expect:200 },
    { method:'GET', path:'/about', expect:200 },
    { method:'GET', path:'/pricing', expect:404 },
  ],
  files:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

// TODO 1: answer GET requests for the home page "/" with res.send("<h1>Hello</h1>")
// TODO 2: inside that route, console.log req.method, req.url and req.headers


// TODO 3: add GET routes for "/contact" and "/about", each sending its own HTML


app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`,
'package.json':`{
  "name": "http-requests",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log(req.method, req.url);
  console.log(req.headers);
  res.send("<h1>Hello</h1>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>Contact Me</h1><p>Phone: 0123 456 789</p>");
});

app.get("/about", (req, res) => {
  res.send("<h1>About Me</h1><p>My name is Sam and I am learning Express.</p>");
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`},
  notes:`
    <h3>In this playground</h3>
    <ul>
      <li><b>▶ Run</b> restarts the server. On your own machine <code>nodemon</code> does that on every save: install it once with <code>npm i -g nodemon</code> (prefix <code>sudo</code> on a Mac if npm reports a permissions error), then start the server with <code>nodemon index.js</code>.</li>
      <li>The lecture logs <code>req.rawHeaders</code>, a flat array that alternates header names and values. The simulated request here only has <code>req.headers</code>, the same information as an object, and the built-in browser sends very few headers. Add your own in the Postman tab.</li>
      <li><b>EADDRINUSE</b> on a real machine means something is already listening on port 3000, usually a server you started in another terminal. Stop that one with Ctrl+C.</li>
    </ul>`,
  quiz:[
    { q:'Which verb does the browser send when you type a URL into the address bar and press Enter?', options:['POST','GET','PUT','FETCH'], answer:1, why:'Address-bar visits and link clicks are GET requests: please give me this resource.' },
    { q:'A user changes only their email address; the rest of the profile stays as it is. Which verb fits best?', options:['PUT','PATCH','POST','DELETE'], answer:1, why:'PATCH updates part of a resource. PUT would send a whole new profile to replace the stored one.' },
    { q:'What does <code>res.send("&lt;h1&gt;Hello&lt;/h1&gt;")</code> do?', options:['Logs the HTML in the terminal','Sends the string back as HTML and ends the response','Saves the HTML to a file','Redirects to /hello'], answer:1, why:'Given a string, res.send sets the Content-Type to text/html, sends the body and finishes the request.' },
    { q:'You edit a route while <code>node index.js</code> is running and refresh the browser, but nothing changes. Why?', options:['The browser cached the page forever','The running process still has the old code, so it must be restarted (or run with nodemon)','Routes can only be added once','Express ignores edits to index.js'], answer:1, why:'Node reads your file once, at start-up. nodemon watches the files and restarts the process on every save.' },
  ],
});

PG.add({
  id:'l204', index:204, udemyId:38911684, minutes:19, section:'s24', slug:'postman', kind:'node',
  title:'Postman',
  blurb:'Every response carries a three-digit <b>status code</b>: 1xx information, 2xx success, 3xx redirection, 4xx a client mistake, 5xx a server fault. Express has one method per verb (<code>app.post</code>, <code>app.put</code>, <code>app.patch</code>, <code>app.delete</code>), and <code>res.sendStatus(201)</code> answers with nothing but a code. A browser address bar can only send GET, so the other verbs are tested with an API client such as Postman.',
  tasks:[
    'Press <b>▶ Run</b>, open the <b>Postman</b> tab and send <code>GET http://localhost:3000/</code>. Note the status (200) and the body.',
    'Add <code>app.post("/register", …)</code> that replies with <code>res.sendStatus(201)</code>. Run again and send a POST to <code>/register</code>: you should get <b>201 Created</b>. Then type the same URL into the Browser tab and work out why that fails.',
    'Add PUT, PATCH and DELETE routes for <code>/user/angela</code>, each replying with <code>res.sendStatus(200)</code>.',
    'Send each one from Postman by switching the method dropdown. For POST and PATCH, also try an <b>x-www-form-urlencoded</b> body such as <code>name=Angela</code>. The server ignores it for now; reading request bodies comes next lecture.',
    'Break things on purpose: send a PATCH to <code>/user/bob</code> (404, because the path must match exactly), then a GET to port <code>3001</code>, where nothing is listening.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/register', body:{ name:'Angela', email:'angela@example.com' }, expect:201 },
    { method:'PUT', path:'/user/angela', body:{ name:'Angela', email:'angela@example.com' }, expect:200 },
    { method:'PATCH', path:'/user/angela', body:{ email:'new@example.com' }, expect:200 },
    { method:'DELETE', path:'/user/angela', expect:200 },
  ],
  files:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// TODO 2: POST /register → reply with res.sendStatus(201)


// TODO 3: PUT, PATCH and DELETE for /user/angela → each replies with res.sendStatus(200)


app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`,
'package.json':`{
  "name": "postman",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.post("/register", (req, res) => {
  // a real app would save the new user here
  res.sendStatus(201);
});

app.put("/user/angela", (req, res) => {
  // replace the whole user record
  res.sendStatus(200);
});

app.patch("/user/angela", (req, res) => {
  // change only the fields that were sent
  res.sendStatus(200);
});

app.delete("/user/angela", (req, res) => {
  // remove the user
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}.\`);
});
`},
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>The <b>Postman</b> tab next to the browser stands in for the Postman desktop app: method, URL, auth, headers and a body, plus the status, headers and body of the reply.</li>
      <li>A project you download usually arrives without <code>node_modules</code>. Run <code>npm install</code> with no package names in its folder: npm reads <code>package.json</code> and installs every dependency listed there.</li>
      <li><code>res.sendStatus(201)</code> is shorthand for <code>res.status(201).send("Created")</code>. To send a status together with your own body, chain the calls: <code>res.status(201).json({ id: 7 })</code>.</li>
    </ul>`,
  quiz:[
    { q:'What does status <b>201</b> mean?', options:['OK','Created','Moved Permanently','Not Found'], answer:1, why:'201 Created is the usual reply when a POST has made something new on the server.' },
    { q:'Which family of status codes says the <i>client</i> made a mistake, such as asking for a path that does not exist?', options:['2xx','3xx','4xx','5xx'], answer:2, why:'4xx codes blame the request (404 Not Found, 401 Unauthorized); 5xx codes blame the server.' },
    { q:'Why can you not test <code>app.put("/user/angela")</code> by typing the URL into the browser?', options:['Browsers block port 3000','The address bar only ever sends GET requests','PUT routes need HTTPS','Express hides PUT routes'], answer:1, why:'The address bar sends GET, which matches no route here, so you get Cannot GET. An API client can send any verb.' },
    { q:'What body comes back from <code>res.sendStatus(200)</code>?', options:['Nothing at all','The text OK','The JSON {"status":200}','The previous page'], answer:1, why:'sendStatus sets the code and sends its standard reason phrase as plain text: OK for 200, Created for 201.' },
  ],
});

PG.add({
  id:'l205', index:205, udemyId:38911596, minutes:18, section:'s24', slug:'intro-to-middlewares', kind:'node',
  title:'Introduction to Middlewares',
  blurb:'Middleware is a function that runs on every request <b>before</b> your route handlers; you register it with <code>app.use(…)</code>. Two ready-made ones: <b>body-parser</b> turns submitted form fields into <code>req.body</code>, and <b>morgan</b> logs each request. To reply with a whole HTML file, <code>res.sendFile()</code> needs an absolute path, built from <code>__dirname</code>, which ES modules have to recreate from <code>import.meta.url</code>.',
  tasks:[
    'Add <code>app.get("/")</code> that replies with <code>res.sendFile(__dirname + "/public/index.html")</code>. Press <b>▶ Run</b>: the Band Name Generator form appears.',
    'Import <code>bodyParser</code> from <code>"body-parser"</code> and register <code>app.use(bodyParser.urlencoded({ extended: true }))</code> above the routes.',
    'Add <code>app.post("/submit")</code>: <code>console.log(req.body)</code>, then send a short reply so the browser is not left waiting.',
    'Fill in the form and submit it. The terminal shows <code>{ "street": …, "pet": … }</code>. Now comment out the body-parser line, run, submit again and see <code>undefined</code>. Put the line back.',
    'Import <code>morgan</code> and add <code>app.use(morgan("tiny"))</code> as the first middleware. Every request now gets a log line, even one to a path with no route (try <code>/nothing</code>). Try <code>"combined"</code> as well.',
    'From the <b>Postman</b> tab, send a POST to <code>/submit</code> with an x-www-form-urlencoded body (<code>street=Elm</code> and <code>pet=Biscuit</code> on separate lines) and compare the log.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/submit', body:{ street:'Elm', pet:'Biscuit' }, expect:200 },
    { method:'GET', path:'/nothing', expect:404 },
  ],
  files:{
'index.js':`import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
// TODO 2: import bodyParser from "body-parser"
// TODO 5: import morgan from "morgan"

// ES modules have no __dirname, so rebuild it:
// import.meta.url (file:///…/index.js) → a normal file path → the folder it sits in
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Middleware goes here, above the routes.
// TODO 5: app.use(morgan("tiny"));
// TODO 2: app.use(bodyParser.urlencoded({ extended: true }));


// TODO 1: GET "/" → res.sendFile(__dirname + "/public/index.html")


// TODO 3: POST "/submit" → console.log(req.body), then send a reply


app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});
`,
'public/index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Band Name Generator</title>
</head>
<body>
  <h1>Band Name Generator</h1>
  <form action="/submit" method="POST">
    <label for="street">Street Name:</label>
    <input id="street" placeholder="Enter Street Name" type="text" name="street" required />
    <label for="pet">Pet Name:</label>
    <input id="pet" placeholder="Enter Pet Name" type="text" name="pet" required />
    <input type="submit" value="Submit" />
  </form>
</body>
</html>
`,
'package.json':`{
  "name": "middlewares",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  }
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  res.send("<h1>Got it!</h1><p>Your answers are in the server terminal.</p>");
});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});
`},
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>The lecture's POST handler only logs, so the browser keeps spinning. Every request needs a reply, which is why the solution sends a short page back.</li>
      <li><code>extended: true</code> picks the parsing library behind <code>urlencoded</code> (the one that understands nested fields). It is the usual choice, and body-parser 1.x prints a deprecation warning if you leave the option out.</li>
      <li>Express 4.16 and later include the same parser as <code>express.urlencoded({ extended: true })</code>, so the extra package is optional. The course sticks with body-parser because most code you will meet online uses it.</li>
      <li>Recent Node versions also offer <code>import.meta.dirname</code>, a ready-made <code>__dirname</code> for ES modules.</li>
      <li>The playground's morgan prints the same short line for every format except <code>"combined"</code>, which prints the long Apache-style line.</li>
    </ul>`,
  quiz:[
    { q:'Where should <code>app.use(bodyParser.urlencoded({ extended: true }))</code> go?', options:['After app.listen','Above the routes that read req.body','Inside the POST handler','In public/index.html'], answer:1, why:'Middleware runs in the order it is registered, so the parser must run before the handlers that need req.body.' },
    { q:'You remove the body-parser line and submit the form again. What does <code>console.log(req.body)</code> print?', options:['{}','undefined','The raw text street=Elm&amp;pet=Biscuit','An error page'], answer:1, why:'Express does not read request bodies by itself. Without a parser nothing creates req.body.' },
    { q:'Why build the path for <code>res.sendFile</code> from <code>__dirname</code>?', options:['sendFile needs an absolute path, and __dirname gives the right folder wherever the project is moved','It makes the file load faster','Relative paths are only allowed for CSS','body-parser requires it'], answer:0, why:'A hard-coded path breaks on another machine or a server. __dirname is the folder of the running file, worked out at run time.' },
    { q:'Which attribute decides the key names inside <code>req.body</code>?', options:['id','placeholder','name','for'], answer:2, why:'A form sends name=value pairs, so name="street" becomes req.body.street.' },
    { q:'morgan is registered first. A POST arrives for a path that has no route. Is it logged?', options:['No, only matched routes are logged','Yes, with status 404','Only in combined mode','Only GET requests are logged'], answer:1, why:'Middleware runs before route matching, so morgan sees every request, including those that end in 404.' },
  ],
});

PG.add({
  id:'l206', index:206, udemyId:38911656, minutes:19, section:'s24', slug:'custom-middlewares', kind:'node',
  title:'Custom Middlewares',
  blurb:'Your own middleware is a function with three parameters, <code>(req, res, next)</code>. It can read or change the request, and then it calls <code>next()</code> to pass it on; if it forgets, the request hangs. Middleware runs in the order of the <code>app.use</code> calls, so anything that reads <code>req.body</code> has to come after body-parser.',
  tasks:[
    'Write <code>function logger(req, res, next)</code> that logs <code>req.method</code> and <code>req.url</code> and then calls <code>next()</code>. Register it with <code>app.use(logger)</code>: pass the function, do not call it. Run and reload the page a few times.',
    'Delete the <code>next()</code> call and run again. The logs still appear, but the page never loads (after a few seconds the terminal warns you). Put <code>next()</code> back.',
    'Write <code>bandNameGenerator(req, res, next)</code>: log <code>req.body</code>, set <code>bandName = req.body["street"] + req.body["pet"]</code>, call <code>next()</code>. Register it <b>after</b> the body-parser line.',
    'Make <code>POST /submit</code> reply with <code>&lt;h1&gt;Your band name is:&lt;/h1&gt;&lt;h2&gt;${bandName}✌️&lt;/h2&gt;</code> (a template literal), then submit the form.',
    'Move <code>app.use(bandNameGenerator)</code> above the body-parser line, run, submit, and read the error in the terminal. Move it back. The Explore tab lets you replay these experiments quickly.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/submit', body:{ street:'Maple', pet:'Pickle' }, expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var bandName = "";

app.use(bodyParser.urlencoded({ extended: true }));

// TODO 1: function logger(req, res, next): log req.method and req.url, then call next().
//         Register it with app.use(logger).


// TODO 3: function bandNameGenerator(req, res, next): log req.body,
//         set bandName to req.body["street"] + req.body["pet"], then call next().
//         Register it here, AFTER the body-parser line.


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  // TODO 4: reply with an <h1> "Your band name is:" and an <h2> holding bandName + ✌️

});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});
`,
'public/index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Band Name Generator</title>
</head>
<body>
  <h1>Band Name Generator</h1>
  <form action="/submit" method="POST">
    <label for="street">Street Name:</label>
    <input id="street" placeholder="Enter Street Name" type="text" name="street" required />
    <label for="pet">Pet Name:</label>
    <input id="pet" placeholder="Enter Pet Name" type="text" name="pet" required />
    <input type="submit" value="Submit" />
  </form>
</body>
</html>
`,
'package.json':`{
  "name": "custom-middlewares",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var bandName = "";

app.use(bodyParser.urlencoded({ extended: true }));

function logger(req, res, next) {
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  next();
}
app.use(logger);

function bandNameGenerator(req, res, next) {
  console.log(req.body);
  bandName = req.body["street"] + req.body["pet"];
  next();
}
app.use(bandNameGenerator);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  res.send(\`<h1>Your band name is:</h1><h2>\${bandName}✌️</h2>\`);
});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});
`},
  explore:[{
    title:'The middleware pipeline', height:500,
    note:'Reorder the <code>app.use</code> calls with ▲▼, untick <b>calls next()</b> on a custom middleware, or switch the request. The trace shows each step the request takes and where it stops.',
    html:`
<div class="knobs">
  <label>request <select id="req"><option value="POST">POST /submit  (street=Maple, pet=Pickle)</option><option value="GET">GET /</option></select></label>
  <button id="reset">reset</button>
</div>
<div class="stage" id="stack"></div>
<pre class="readout" id="trace" style="white-space:pre-wrap"></pre>
<style>
  .mw{display:flex;align-items:center;gap:10px;border:1px solid #dfe3ee;border-radius:8px;padding:7px 10px;margin-bottom:8px;background:#fbfcff;flex-wrap:wrap}
  .mw .n{font:12px ui-monospace,Menlo,monospace;color:#8a91a8;width:16px}
  .mw code{flex:1;min-width:200px;font:12.5px ui-monospace,Menlo,monospace}
  .mw label{font-size:12px;color:#3c435c;display:flex;gap:4px;align-items:center}
  .mw .lib{font-size:12px;color:#8a91a8}
  .mw.route{border-style:dashed;background:#f3f6ff;margin-bottom:0}
</style>
<script>
  var NL = String.fromCharCode(10);
  var START = [
    { id:'logger', code:'app.use(logger)', next:true, custom:true },
    { id:'parser', code:'app.use(bodyParser.urlencoded({ extended: true }))', next:true, custom:false },
    { id:'band', code:'app.use(bandNameGenerator)', next:true, custom:true }
  ];
  var stack = [];
  function reset() {
    stack = START.map(function (m) { return { id:m.id, code:m.code, next:m.next, custom:m.custom }; });
    render();
  }
  function move(i, d) {
    var j = i + d;
    if (j < 0 || j >= stack.length) return;
    var t = stack[i]; stack[i] = stack[j]; stack[j] = t;
    render();
  }
  function render() {
    var box = document.getElementById('stack');
    box.innerHTML = '';
    stack.forEach(function (m, i) {
      var row = document.createElement('div');
      row.className = 'mw';
      row.innerHTML = '<span class="n">' + (i + 1) + '</span><code></code>' +
        (m.custom ? '<label><input type="checkbox"' + (m.next ? ' checked' : '') + '> calls next()</label>' : '<span class="lib">library, always calls next()</span>') +
        '<button data-d="-1">▲</button><button data-d="1">▼</button>';
      row.querySelector('code').textContent = m.code;
      var cb = row.querySelector('input');
      if (cb) cb.onchange = function () { m.next = cb.checked; run(); };
      row.querySelectorAll('button').forEach(function (b) { b.onclick = function () { move(i, Number(b.getAttribute('data-d'))); }; });
      box.appendChild(row);
    });
    var r = document.createElement('div');
    r.className = 'mw route';
    r.innerHTML = '<span class="n">→</span><code></code>';
    r.querySelector('code').textContent = document.getElementById('req').value === 'POST'
      ? 'app.post("/submit", …)   the route: sends the band name'
      : 'app.get("/", …)   the route: sends public/index.html';
    box.appendChild(r);
    run();
  }
  function run() {
    var method = document.getElementById('req').value;
    var url = method === 'POST' ? '/submit' : '/';
    var body;
    var bandName = '';
    var out = [method + ' ' + url + ' arrives', ''];
    for (var i = 0; i < stack.length; i++) {
      var m = stack[i], tag = (i + 1) + '. ';
      if (m.id === 'logger') out.push(tag + 'logger prints "Request method: ' + method + '" and "Request URL: ' + url + '"');
      if (m.id === 'parser') {
        body = method === 'POST' ? { street:'Maple', pet:'Pickle' } : {};
        out.push(tag + 'body-parser sets req.body = ' + JSON.stringify(body));
      }
      if (m.id === 'band') {
        if (body === undefined) {
          out.push(tag + 'bandNameGenerator reads req.body["street"], but req.body does not exist yet');
          out.push('');
          out.push("TypeError: Cannot read properties of undefined (reading 'street')");
          out.push('Express catches the error and answers 500 Internal Server Error.');
          out.push('Fix: register bandNameGenerator after the body parser.');
          return show(out);
        }
        bandName = String(body.street) + String(body.pet);
        out.push(tag + 'bandNameGenerator sets bandName = "' + bandName + '"' + (method === 'GET' ? '   (a GET carries no form; harmless, nothing uses it)' : ''));
      }
      if (!m.next) {
        out.push('');
        out.push('   ...and stops here: no next(), no response.');
        out.push('The route never runs. The browser keeps waiting until it gives up.');
        return show(out);
      }
    }
    out.push('');
    out.push(method === 'POST'
      ? 'The route replies 200: <h1>Your band name is:</h1><h2>' + bandName + '✌️</h2>'
      : 'The route replies 200 with public/index.html');
    show(out);
  }
  function show(lines) { document.getElementById('trace').textContent = lines.join(NL); }
  document.getElementById('req').onchange = render;
  document.getElementById('reset').onclick = reset;
  reset();
<\/script>`,
  }],
  notes:`
    <h3>Express 5 heads-up</h3>
    <p>This lesson's <code>package.json</code> uses Express 4, like the course files. With today's versions (Express 5 and body-parser 2), <code>req.body</code> stays <code>undefined</code> on requests that carry no form, such as <code>GET /</code>. A middleware that reads <code>req.body["street"]</code> on every request then breaks the home page. Guard it with <code>if (req.body) { … }</code>, or read the body only inside the POST route.</p>
    <h3>Middleware or route?</h3>
    <p>Building the band name inside <code>app.post("/submit")</code> is shorter and works just as well; the separate middleware is there to show the mechanics. Keeping the result in a shared <code>bandName</code> variable is fine for a demo, but on a real server two visitors could overwrite each other's value. <code>res.locals.bandName</code> keeps a value per request.</p>`,
  quiz:[
    { q:'A middleware has done its work but has not sent a response. What must it do?', options:['return true','Call next()','Call res.end() anyway','Nothing, Express moves on automatically'], answer:1, why:'next() hands the request to the next middleware or route. Without it, and without a response, the request hangs.' },
    { q:'Which registration is correct for <code>function logger(req, res, next) { … }</code>?', options:['app.use(logger())','app.use(logger)','app.use("logger")','app.logger()'], answer:1, why:'Pass the function itself and Express calls it for each request. logger() would run it once, straight away, with no arguments. morgan("tiny") is different: it is a factory that returns a middleware.' },
    { q:'<code>bandNameGenerator</code> is registered above the body-parser line. What happens when the form is submitted?', options:['It works the same','A TypeError, because req.body does not exist yet','The band name is empty but nothing fails','body-parser runs first anyway'], answer:1, why:'Middleware runs from top to bottom. Before the parser has run there is no req.body to read from.' },
    { q:'For a POST to /submit, in which order do these run: the route handler, <code>app.use(logger)</code> (registered first) and the body parser (registered second)?', options:['route, logger, parser','parser, logger, route','logger, parser, route','All at the same time'], answer:2, why:'Matching middleware runs in registration order, and the route handler comes last.' },
  ],
});

PG.add({
  id:'l207', index:207, udemyId:38911668, minutes:8, section:'s24', slug:'secrets-access-project', kind:'node', project:true,
  title:'Secrets Access Project',
  blurb:'The section in one project: a home page with a password form, a <code>passwordCheck</code> middleware that reads <code>req.body.password</code>, and a <code>POST /check</code> route that sends the secret page to the right password and sends everyone else back with <code>res.redirect("/")</code>. The password for this version is <code>MiddlewareRocks</code>.',
  tasks:[
    'Read <code>public/index.html</code> first and note the form\'s <code>action</code>, its <code>method</code> and the input\'s <code>name</code>. Your server has to match all three.',
    'In <code>index.js</code>, import express, body-parser, <code>dirname</code> and <code>fileURLToPath</code>; rebuild <code>__dirname</code>; create the app on port 3000 and register the urlencoded body parser.',
    'Write a <code>passwordCheck(req, res, next)</code> middleware that compares <code>req.body["password"]</code> with <code>"MiddlewareRocks"</code>, stores the answer in <code>userIsAuthorised</code> and calls <code>next()</code>. Register it after the parser.',
    'Add <code>GET /</code> sending <code>public/index.html</code>, and <code>POST /check</code> sending <code>public/secret.html</code> when the user is authorised and <code>res.redirect("/")</code> otherwise.',
    'Add <code>app.listen</code>, press <b>▶ Run</b> and try a wrong password (back to the form) and the right one (the secrets list).',
    'Bug hunt: log in correctly, click <b>Log out</b>, then submit a wrong password. If the secrets still show, your flag never resets. Set it from the comparison on every request.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/check', body:{ password:'letmein' }, expect:302 },
    { method:'POST', path:'/check', body:{ password:'MiddlewareRocks' }, expect:200 },
    { method:'POST', path:'/check', body:{ password:'guess' }, expect:302 },
  ],
  files:{
'index.js':`// Secrets Access Project: all the server code goes in this file.
// The pages are ready in public/: index.html (the password form) and secret.html.
//
// 1. Imports: express, body-parser, and dirname + fileURLToPath to rebuild __dirname
//
// 2. Create the app, port 3000, and a variable userIsAuthorised = false
//
// 3. Register bodyParser.urlencoded({ extended: true })
//
// 4. passwordCheck(req, res, next): compare req.body["password"] with "MiddlewareRocks",
//    record the result in userIsAuthorised, then call next(). Register it with app.use.
//
// 5. GET "/"  → send public/index.html
//
// 6. POST "/check" → authorised? send public/secret.html : res.redirect("/")
//
// 7. app.listen(port, ...)
`,
'public/index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Secrets</title>
</head>
<body>
  <h1>Secrets</h1>
  <form action="/check" method="POST">
    <label for="password">Password:</label>
    <input type="text" id="password" name="password" required />
    <input type="submit" value="Submit" />
  </form>
</body>
</html>
`,
'public/secret.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Secrets</title>
</head>
<body>
  <h1>Secrets</h1>
  <ul>
    <li>Plenty of experienced developers still look up how to centre a div.</li>
    <li>Explaining a bug out loud, even to a rubber duck, finds it surprisingly often.</li>
    <li>Half of programming is naming things. The other half is renaming them.</li>
    <li>A short walk fixes more stubborn bugs than another hour of staring at the screen.</li>
    <li>Every "temporary" fix deserves a comment saying why it is there.</li>
  </ul>
  <p><a href="/">Log out</a></p>
</body>
</html>
`,
'package.json':`{
  "name": "secrets-access",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
var userIsAuthorised = false;

app.use(bodyParser.urlencoded({ extended: true }));

function passwordCheck(req, res, next) {
  const password = req.body["password"];
  // decide again on every request, so one correct login does not unlock the page for good
  userIsAuthorised = password === "MiddlewareRocks";
  next();
}
app.use(passwordCheck);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
  if (userIsAuthorised) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(\`Listening on port \${port}\`);
});
`},
  notes:`
    <h3>About the flag</h3>
    <p>The lecture's solution sets <code>userIsAuthorised = true</code> on a match and never sets it back, so after one correct login every later request counts as authorised, wrong passwords included, from any visitor. Recomputing it on each request (<code>userIsAuthorised = password === "MiddlewareRocks"</code>) fixes that. A real app would not keep login state in a variable shared by every visitor at all; sessions arrive in the Authentication section.</p>
    <h3>Also worth knowing</h3>
    <ul>
      <li><code>app.use(express.urlencoded({ extended: true }))</code> does the same job as body-parser without the extra package.</li>
      <li>With Express 5, <code>req.body</code> is <code>undefined</code> on <code>GET /</code>, so a middleware that reads <code>req.body["password"]</code> on every request needs a guard: <code>const password = req.body ? req.body["password"] : undefined;</code></li>
      <li>A text input and a plain comparison are fine for practice. Real passwords use <code>type="password"</code>, HTTPS and hashing.</li>
    </ul>`,
  quiz:[
    { q:'What does <code>res.redirect("/")</code> send back?', options:['The HTML of the home page','A 302 response telling the browser to request / instead','A 404','Nothing; the browser simply reloads'], answer:1, why:'A redirect is a 3xx status with a Location header. The browser then makes a fresh GET request to that URL.' },
    { q:'Why must the body parser be registered before <code>passwordCheck</code>?', options:['Libraries always go first','passwordCheck reads req.body, which only exists after the parser has run','It keeps the password secret','The order makes no difference'], answer:1, why:'Middleware runs in registration order, so a check that reads the form must come after the parser.' },
    { q:'With the lecture\'s flag (set to true, never reset), you log in once and then submit a wrong password. What happens?', options:['Back to the form','The secrets page appears again','The server crashes','A 401 error'], answer:1, why:'The flag is still true, so every later request counts as authorised. Recompute it on each request.' },
    { q:'Where does the server read the typed password from?', options:['The input\'s id','req.body["password"], named by the input\'s name attribute','The label text','The form\'s action'], answer:1, why:'Form fields travel as name=value pairs, and name="password" becomes req.body.password.' },
  ],
});

PG.add({
  id:'l208', index:208, udemyId:17967258, minutes:3, section:'s24', slug:'tip-solidify-knowledge', kind:'read',
  title:'Tip from Angela - How to Solidify Your Knowledge',
  blurb:'Code that runs is not proof that you understand it. Try to explain <i>why</i> it works, out loud, in writing or to another learner in the Q&amp;A, and come up with analogies of your own. Wherever the explanation stalls, there is something to go back and read.',
  quiz:[
    { q:'Your middleware works, but you could not explain why it has to come after body-parser. What does this tip suggest?', options:['Move on, it works','Explain it in your own words, then look up the part where the explanation breaks down','Memorise the order of the lines','Rewrite it without middleware'], answer:1, why:'Explaining exposes the gap, and filling the gap turns working code into knowledge that lasts.' },
  ],
});
