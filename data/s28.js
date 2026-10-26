/* ===== Section 28 — Application Programming Interfaces (APIs) ===== */
/* Every API call goes to the playground's offline copies of the course APIs
   (bored-api.appbrewery.com, secrets-api.appbrewery.com), so these lessons work without internet. */
(function () {

/* ---------- 225 ---------- */
PG.add({
  id:'l225', index:225, udemyId:38912006, minutes:19, section:'s28', slug:'intro-to-apis', kind:'node',
  title:'Introduction to APIs',
  blurb:'An API is a contract between programs: a documented list of URLs (endpoints) you may call, what you can send and what comes back. Your own Express server can be the one asking. Here it requests a random activity from the Bored API, and you turn the JSON reply into a page with EJS.',
  tasks:[
    'Press <b>▶ Run</b>. The <code>GET /</code> route asks <code>https://bored-api.appbrewery.com/random</code> for an activity and logs the reply. Find that JSON in the terminal and note the names of its fields.',
    'In <code>views/index.ejs</code>, replace the three <code>???</code> placeholders with <code>activity.activity</code>, <code>activity.type</code> and <code>activity.participants</code>.',
    'Reload the page in the built-in browser a few times. Each reload makes your server send a brand-new request to the API, which is why the activity changes.',
    'Add a <code>GET /raw</code> route that makes the same request and replies with <code>res.json(response.data)</code>. Open <code>/raw</code>: that bare JSON is what a tool like Postman shows you when you test an endpoint.',
    'Open the Explore tab and send the lecture’s ISS request, then use its latitude and longitude to open the spot in Google Maps (offline, it shows a sample reply of the same shape).'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/raw', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    // ask the Bored API for one random activity
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    console.log(response.data);
    res.render("index.ejs", { activity: response.data });
  } catch (error) {
    console.log("Request failed:", error.message);
    res.status(500).send("Could not reach the API: " + error.message);
  }
});

// TODO 4: add GET /raw — make the same request, then reply with res.json(response.data)


app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bored? Ask an API</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <main class="card">
    <p class="eyebrow">The Bored API suggests…</p>
    <!-- TODO 2: replace each ??? with a field of the activity object -->
    <h1>???</h1>
    <div class="facts">
      <span class="pill">type: ???</span>
      <span class="pill">participants: ???</span>
    </div>
    <a class="again" href="/">Ask again ↻</a>
  </main>
</body>
</html>
`,
'public/styles/main.css':`body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fde68a, #fca5a5);
  font-family: system-ui, sans-serif;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px;
  max-width: 420px;
  margin: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9a3412;
}

h1 {
  font-size: 1.6rem;
  margin: 12px 0 18px;
  color: #1f2937;
}

.facts {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.pill {
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 14px;
}

.again {
  display: inline-block;
  margin-top: 22px;
  color: #b45309;
  font-weight: 600;
  text-decoration: none;
}
`},
  solution:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    // ask the Bored API for one random activity
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    console.log(response.data);
    res.render("index.ejs", { activity: response.data });
  } catch (error) {
    console.log("Request failed:", error.message);
    res.status(500).send("Could not reach the API: " + error.message);
  }
});

// the raw reply, the way Postman would show it
app.get("/raw", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bored? Ask an API</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <main class="card">
    <p class="eyebrow">The Bored API suggests…</p>
    <h1><%= activity.activity %></h1>
    <div class="facts">
      <span class="pill">type: <%= activity.type %></span>
      <span class="pill">participants: <%= activity.participants %></span>
    </div>
    <a class="again" href="/">Ask again ↻</a>
  </main>
</body>
</html>
`},
  explore:[{
    title:'Where is the ISS right now? (the lecture’s Postman exercise)', height:430,
    note:'The docs list two endpoints. Send each one: only the endpoint that takes the satellite id (25544 is the ISS) returns coordinates. Keep the minus signs when you paste them into a map. Without internet, or if the site blocks browser requests, you get a sample reply with the same shape.',
    html:`
<div class="knobs">
  <label>GET <input id="url" type="text" style="width:370px" value="https://api.wheretheiss.at/v1/satellites/25544"></label>
  <button id="send">Send</button>
</div>
<div class="knobs">
  <span class="tag">endpoints from the docs</span>
  <button data-url="https://api.wheretheiss.at/v1/satellites">/v1/satellites</button>
  <button data-url="https://api.wheretheiss.at/v1/satellites/25544">/v1/satellites/25544</button>
</div>
<div class="stage" id="map">Press Send to ask where the ISS is.</div>
<pre class="readout" id="out">// the response body appears here</pre>
<script>
  var SAMPLE_ONE = { name: "iss", id: 25544, latitude: 41.8312, longitude: -152.6415, altitude: 421.12, velocity: 27560.2, visibility: "eclipsed", units: "kilometers" };
  var SAMPLE_LIST = [{ name: "iss", id: 25544 }];
  var $ = function (id) { return document.getElementById(id); };
  function show(data, note) {
    $('out').textContent = note + '\\n' + JSON.stringify(data, null, 2);
    if (!Array.isArray(data) && typeof data.latitude === 'number') {
      var q = data.latitude.toFixed(4) + ',' + data.longitude.toFixed(4);
      $('map').innerHTML = 'latitude <b>' + data.latitude.toFixed(4) + '</b> · longitude <b>' + data.longitude.toFixed(4) +
        '</b> &nbsp; <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + q + '">open ' + q + ' in Google Maps ↗</a>';
    } else {
      $('map').textContent = 'No coordinates here: this endpoint only lists the satellites the API tracks. Use the one that takes an id.';
    }
  }
  $('send').onclick = function () {
    var url = $('url').value.trim(), bare = url;
    while (bare.slice(-1) === '/') bare = bare.slice(0, -1);
    var listOnly = bare.slice(-11) === '/satellites';
    $('out').textContent = 'GET ' + url + ' …';
    fetch(url).then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
      .then(function (data) { show(data, '// live reply'); })
      .catch(function () { show(listOnly ? SAMPLE_LIST : SAMPLE_ONE, '// no live reply (offline or blocked) — sample with the same shape'); });
  };
  document.querySelectorAll('[data-url]').forEach(function (b) {
    b.onclick = function () { $('url').value = b.getAttribute('data-url'); $('send').click(); };
  });
<\/script>`,
  }],
  quiz:[
    { q:'Which description of an API is closest?', options:['A documented set of rules for how one program can ask another for data or actions','A database that stores a website’s pages','A JavaScript framework for building user interfaces','The computer that hosts a website'], answer:0, why:'You only need the published contract (endpoints, inputs, reply format); the other system’s language, database and servers stay hidden.' },
    { q:'API documentation works like a menu. What does each entry normally tell you?', options:['The provider’s source code','Which database the provider uses','Who wrote the API','The endpoint URL, the HTTP method, the inputs it accepts and an example reply'], answer:3, why:'Pick the endpoint that returns what you need, check its required inputs, and look at the sample reply before writing any code.' },
    { q:'A sign-up form passes each new email address to a mailing-list provider’s API. Which HTTP method fits?', options:['GET','DELETE','POST','None: APIs can only send data out'], answer:2, why:'Sending new data to be stored is a POST. Fetching data, like the weather or a random activity, is a GET.' },
    { q:'In this lesson, who actually sends the request to the Bored API?', options:['Your Express server, which then renders the result into HTML','The visitor’s browser','Postman','The Bored API calls your server first'], answer:0, why:'The browser only talks to your server on localhost:3000; your server makes the API call and turns the JSON into a page.' },
  ],
});


/* ---------- 226 ---------- */
PG.add({
  id:'l226', index:226, udemyId:38912008, minutes:14, section:'s28', slug:'structuring-api-requests', kind:'node',
  title:'Structuring API Requests',
  blurb:'A request URL is built from parts: the base URL, an <b>endpoint</b> such as <code>/random</code>, optional <b>query parameters</b> after a <code>?</code> (joined with <code>&amp;</code>) to filter or search, and <b>path parameters</b> such as <code>/activity/2958104</code> that pick out one specific item.',
  tasks:[
    'Press <b>▶ Run</b>. A copy of the Bored API starts on port 4000 next to your site. In the <b>Postman</b> tab send <code>GET http://localhost:4000/random</code> a few times: one endpoint, a different activity each time.',
    'Still in Postman, type a query string by hand: <code>http://localhost:4000/filter?type=social&amp;participants=2</code>. A <code>?</code> starts it and <code>&amp;</code> joins each further pair.',
    'Copy the <code>key</code> of any activity from a reply and ask for exactly that one with a path parameter: <code>http://localhost:4000/activity/&lt;key&gt;</code>.',
    'Now make the site build URLs. In <code>index.js</code>, the <code>/filter</code> route should add a query string made from <code>type</code> and <code>participants</code> (a template literal is easiest). Submit the form in the Browser tab and check the coloured request line.',
    'Make the <code>/activity</code> route put <code>key</code> into the path, so the URL ends in <code>/activity/&lt;key&gt;</code>. Then click <b>Just this one</b> on any card.',
    'Filter for something nobody listed, such as education for 4 people, and read the API’s 404 message on the page.'
  ],
  run:['bored-api.js', 'index.js'],
  port:3000,
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/random', expect:200 },
    { method:'GET', path:'/filter?type=social&participants=2', expect:200 },
    { method:'GET', path:'/filter?type=education&participants=4', expect:200 },
    { method:'GET', path:'/activity?key=2958104', expect:200 },
    { method:'GET', path:'/filter?type=social&participants=2', port:4000, expect:200 },
    { method:'GET', path:'/activity/2958104', port:4000, expect:200 },
    { method:'GET', path:'/activity/1234567', port:4000, expect:404 },
  ],
  notes:'<h3>About the stand-in API</h3><p>The Postman tab can only reach servers on localhost, so this lesson runs a copy of the Bored API on port 4000 (<code>bored-api.js</code>). Its endpoints and reply shapes match the live service at <code>bored-api.appbrewery.com</code>; only the activities are different. You do not need to change that file. Section 30 shows how to build one like it.</p>',
  files:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// The stand-in Bored API from bored-api.js, running on port 4000.
// The live service is https://bored-api.appbrewery.com: same endpoints, same kind of replies.
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

// Sends a GET request to url and renders whatever comes back.
// You don't need to change this helper: the Axios lecture explains it properly.
async function showResult(res, url) {
  try {
    const response = await axios.get(url);
    // /filter replies with an array; /random and /activity reply with one object
    const activities = Array.isArray(response.data) ? response.data : [response.data];
    res.render("index.ejs", { url: url, activities: activities });
  } catch (error) {
    const reply = error.response ? error.response.data : null;
    res.render("index.ejs", { url: url, error: (reply && reply.error) || error.message });
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// 1. An endpoint on its own
app.get("/random", (req, res) => {
  showResult(res, API_URL + "/random");
});

// 2. Query parameters. The form (method GET) sends ?type=...&participants=... to THIS server,
//    and this route passes them on to the API.
app.get("/filter", (req, res) => {
  const type = req.query.type;
  const participants = req.query.participants;
  // TODO 4: add a query string with type and participants to this URL,
  //         e.g. with a template literal: \`\${API_URL}/filter?...\`
  showResult(res, API_URL + "/filter");
});

// 3. A path parameter: one activity, picked out by its key
app.get("/activity", (req, res) => {
  const key = req.query.key;
  // TODO 5: put the key into the path, so the URL ends in /activity/<key>
  showResult(res, API_URL + "/activity");
});

app.listen(port, () => {
  console.log(\`Site running on port \${port}\`);
});
`,
'bored-api.js':`// A stand-in for https://bored-api.appbrewery.com, so you can call it from the Postman tab
// (which only reaches localhost). Same endpoints as the real API:
//   GET /random                          one random activity
//   GET /filter?type=...&participants=...   every match, or 404 when nothing matches
//   GET /activity/:key                   exactly one activity, picked out by its key
// Nothing to change here. Section 30 shows how APIs like this one are built.
import express from "express";

const app = express();

const activities = [
  { activity: "Learn to fold a paper crane", type: "education", participants: 1, price: 0, key: "4821937", accessibility: 0.1 },
  { activity: "Try a language-learning app for a week", type: "education", participants: 1, price: 0, key: "2713590", accessibility: 0.1 },
  { activity: "Host a picnic in the nearest park", type: "social", participants: 4, price: 0.2, key: "7310428", accessibility: 0.2 },
  { activity: "Teach a friend a card trick", type: "social", participants: 2, price: 0, key: "2958104", accessibility: 0.1 },
  { activity: "Run a quiz night for three friends", type: "social", participants: 3, price: 0.1, key: "6091735", accessibility: 0.2 },
  { activity: "Bake bread without a recipe book", type: "cooking", participants: 1, price: 0.1, key: "6640215", accessibility: 0.3 },
  { activity: "Cook a two-course dinner with a neighbour", type: "cooking", participants: 2, price: 0.3, key: "5102846", accessibility: 0.3 },
  { activity: "Write a short poem about your street", type: "relaxation", participants: 1, price: 0, key: "1187362", accessibility: 0 },
  { activity: "Donate books you have already read", type: "charity", participants: 1, price: 0, key: "9034571", accessibility: 0.1 },
  { activity: "Go stargazing with a friend", type: "recreational", participants: 2, price: 0, key: "4467018", accessibility: 0.2 },
  { activity: "Sort your photos into albums", type: "busywork", participants: 1, price: 0, key: "8125649", accessibility: 0.1 },
  { activity: "Oil every squeaky hinge in the house", type: "busywork", participants: 1, price: 0.05, key: "5502983", accessibility: 0.2 },
];

app.get("/random", (req, res) => {
  res.json(activities[Math.floor(Math.random() * activities.length)]);
});

app.get("/filter", (req, res) => {
  let matches = activities;
  // an empty value means "any", just like the real API
  if (req.query.type) matches = matches.filter((a) => a.type === req.query.type);
  if (req.query.participants) matches = matches.filter((a) => a.participants === Number(req.query.participants));
  if (matches.length === 0) {
    return res.status(404).json({ error: "No activities found with the specified parameters" });
  }
  res.json(matches);
});

app.get("/activity/:key", (req, res) => {
  const found = activities.find((a) => a.key === req.params.key);
  if (!found) return res.status(404).json({ error: "No activity found with that key" });
  res.json(found);
});

app.listen(4000, () => {
  console.log("Bored API stand-in running on port 4000");
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Request Builder</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="container">
    <h1>Bored? Build a request 🧩</h1>

    <a class="button" href="/random">Random activity</a>

    <form action="/filter" method="GET" class="form">
      <select name="type">
        <option value="">Any type</option>
        <option value="education">Education</option>
        <option value="recreational">Recreational</option>
        <option value="social">Social</option>
        <option value="charity">Charity</option>
        <option value="cooking">Cooking</option>
        <option value="relaxation">Relaxation</option>
        <option value="busywork">Busywork</option>
      </select>
      <select name="participants">
        <option value="">Any number of people</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button type="submit">Filter</button>
    </form>

    <% if (locals.url) { const u = new URL(url); %>
      <p class="request">
        <span class="method">GET</span><span class="base"><%= u.origin %></span><span class="path"><%= u.pathname %></span><span class="query"><%= u.search %></span>
      </p>
      <p class="legend"><span class="base">base URL</span> <span class="path">endpoint and path</span> <span class="query">query string</span></p>
    <% } %>

    <% if (locals.error) { %>
      <p class="error"><%= error %></p>
    <% } %>

    <% if (locals.activities) { %>
      <p class="count"><%= activities.length %> result<%= activities.length === 1 ? "" : "s" %></p>
      <% activities.forEach((a) => { %>
        <article class="card">
          <h2><%= a.activity %></h2>
          <p>
            <span class="pill"><%= a.type %></span>
            <span class="pill">👥 <%= a.participants %></span>
            <span class="pill key">key <%= a.key %></span>
          </p>
          <a href="/activity?key=<%= a.key %>">Just this one →</a>
        </article>
      <% }) %>
    <% } %>
  </div>
</body>
</html>
`,
'public/styles/main.css':`* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f4f6fb;
  color: #1f2937;
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 20px;
}

h1 {
  margin-top: 0;
}

.button,
button {
  display: inline-block;
  background: #4f46e5;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 9px 16px;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

select {
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

.request {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 14px;
  background: #111827;
  color: #e5e7eb;
  padding: 10px 12px;
  border-radius: 8px;
  word-break: break-all;
}

.request .method {
  color: #34d399;
  font-weight: 700;
  margin-right: 8px;
}

.base { color: #93c5fd; }
.path { color: #86efac; }
.query { color: #fcd34d; }

.legend {
  font-size: 12px;
}

.legend span {
  background: #111827;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 4px;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin: 10px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.card h2 {
  font-size: 1.1rem;
  margin: 0 0 8px;
}

.pill {
  background: #eef2ff;
  color: #3730a3;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 13px;
}

.pill.key {
  background: #fef3c7;
  color: #92400e;
}

.card a {
  font-size: 14px;
  color: #4f46e5;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 8px;
}

.count {
  color: #64748b;
  font-size: 14px;
}
`},
  solution:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// The stand-in Bored API from bored-api.js, running on port 4000.
// The live service is https://bored-api.appbrewery.com: same endpoints, same kind of replies.
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

async function showResult(res, url) {
  try {
    const response = await axios.get(url);
    const activities = Array.isArray(response.data) ? response.data : [response.data];
    res.render("index.ejs", { url: url, activities: activities });
  } catch (error) {
    const reply = error.response ? error.response.data : null;
    res.render("index.ejs", { url: url, error: (reply && reply.error) || error.message });
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// 1. An endpoint on its own
app.get("/random", (req, res) => {
  showResult(res, API_URL + "/random");
});

// 2. Query parameters: ? starts the query string, & joins each further pair
app.get("/filter", (req, res) => {
  const type = req.query.type;
  const participants = req.query.participants;
  showResult(res, \`\${API_URL}/filter?type=\${type}&participants=\${participants}\`);
});

// 3. A path parameter identifies exactly one resource
app.get("/activity", (req, res) => {
  const key = req.query.key;
  showResult(res, \`\${API_URL}/activity/\${key}\`);
});

app.listen(port, () => {
  console.log(\`Site running on port \${port}\`);
});
`},
  explore:[{
    title:'Anatomy of a request URL', height:400,
    note:'Edit the URL or press a preset. Blue is the base URL, green the endpoint, pink any path parameters, yellow the query string. The last preset contains a classic mistake: see how the parser reads it.',
    html:`
<div class="knobs">
  <label>URL <input id="u" type="text" style="width:470px" value="https://bored-api.appbrewery.com/filter?type=social&participants=2"></label>
</div>
<div class="knobs">
  <button data-u="https://bored-api.appbrewery.com/random">endpoint only</button>
  <button data-u="https://bored-api.appbrewery.com/filter?type=social&participants=2">query parameters</button>
  <button data-u="https://bored-api.appbrewery.com/activity/5914292">path parameter</button>
  <button data-u="https://bored-api.appbrewery.com/filter?type=social?participants=2">spot the mistake</button>
</div>
<div class="stage"><div id="colour" style="font:15px/1.7 ui-monospace,Menlo,monospace;word-break:break-all"></div></div>
<pre class="readout" id="parts"></pre>
<script>
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function paint() {
    var raw = $('u').value.trim(), u;
    try { u = new URL(raw); } catch (e) { $('colour').textContent = 'Type a full URL, starting with https://'; $('parts').textContent = ''; return; }
    var segs = u.pathname.split('/').filter(Boolean);
    $('colour').innerHTML = '<span style="background:#dbeafe">' + esc(u.origin) + '</span>' +
      '<span style="background:#dcfce7">' + esc('/' + (segs[0] || '')) + '</span>' +
      (segs.length > 1 ? '<span style="background:#fce7f3">' + esc('/' + segs.slice(1).join('/')) + '</span>' : '') +
      '<span style="background:#fef3c7">' + esc(u.search) + '</span>';
    var lines = [], q = [];
    lines.push('base URL       ' + u.origin);
    lines.push('endpoint       /' + (segs[0] || ''));
    lines.push('path params    ' + (segs.length > 1 ? segs.slice(1).join(' / ') + '    <- picks out ONE item' : '(none)'));
    u.searchParams.forEach(function (v, k) { q.push(k + ' = "' + v + '"'); });
    lines.push('query params   ' + (q.length ? q.join('\\n               ') + '    <- filter / search / sort' : '(none)'));
    if (u.search.split('?').length > 2) {
      lines.push('');
      lines.push('Only the first ? starts the query string; every later pair needs &.');
      lines.push('Here "type" swallowed the rest and "participants" was never sent.');
    }
    $('parts').textContent = lines.join('\\n');
  }
  $('u').addEventListener('input', paint);
  document.querySelectorAll('[data-u]').forEach(function (b) { b.onclick = function () { $('u').value = b.getAttribute('data-u'); paint(); }; });
  paint();
<\/script>`,
  }],
  quiz:[
    { q:'In <code>https://bored-api.appbrewery.com/filter?type=social&amp;participants=2</code>, which part is the endpoint?', options:['https://bored-api.appbrewery.com','participants=2','?type=social','/filter'], answer:3, why:'The endpoint is the route after the base URL. Everything after the ? is the query string.' },
    { q:'How do you send a second query parameter?', options:['?type=social?participants=2','?type=social&amp;participants=2','?type=social,participants=2','/type=social/participants=2'], answer:1, why:'One ? starts the query string; each further key=value pair is joined with &amp;.' },
    { q:'When is a path parameter the better choice than a query parameter?', options:['When identifying one specific resource, such as the activity with a given key','When filtering a list by several criteria','When the value is a number','Never: they are interchangeable'], answer:0, why:'Query parameters narrow down many results; a path parameter such as /activity/2958104 points at exactly one item.' },
    { q:'Your own front end calling your own back end is usually…', options:['A public API with documentation','A REST violation','Not an API at all','Effectively a private API: undocumented and meant only for your client'], answer:3, why:'A public API is deliberately exposed and documented for other developers; your internal routes serve only your own site.' },
  ],
});


/* ---------- 227 ---------- */
const TACOS = [
  { id: '0001', type: 'taco', name: 'Chipotle Chicken Taco', price: 3.25,
    ingredients: {
      protein: { name: 'Chicken', preparation: 'Chargrilled with chipotle' },
      salsa: { name: 'Roasted Corn Salsa', spiciness: 'Medium' },
      toppings: [
        { name: 'Pickled Red Onion', quantity: '2 tablespoons', ingredients: ['Red Onion', 'Cider Vinegar', 'Sugar'] },
        { name: 'Shredded Lettuce', quantity: '1/2 cup', ingredients: ['Romaine Lettuce'] },
        { name: 'Lime Yoghurt', quantity: '1 tablespoon', ingredients: ['Greek Yoghurt', 'Lime Zest'] },
      ] } },
  { id: '0002', type: 'taco', name: 'Slow-Cooked Beef Taco', price: 3.75,
    ingredients: {
      protein: { name: 'Beef Shin', preparation: 'Braised for four hours' },
      salsa: { name: 'Tomatillo Salsa', spiciness: 'Hot' },
      toppings: [
        { name: 'Diced White Onion', quantity: '1/4 cup', ingredients: ['White Onion'] },
        { name: 'Coriander', quantity: '1 small handful', ingredients: ['Fresh Coriander'] },
        { name: 'Radish', quantity: '3 thin slices', ingredients: ['Radish'] },
      ] } },
  { id: '0003', type: 'taco', name: 'Crispy Fish Taco', price: 4.5,
    ingredients: {
      protein: { name: 'Cod', preparation: 'Beer-battered and fried' },
      salsa: { name: 'Mango and Chilli Salsa', spiciness: 'Mild' },
      toppings: [
        { name: 'Red Cabbage Slaw', quantity: '1/2 cup', ingredients: ['Red Cabbage', 'Carrot', 'Lime Juice'] },
        { name: 'Avocado Crema', quantity: '2 tablespoons', ingredients: ['Avocado', 'Sour Cream', 'Salt'] },
        { name: 'Pickled Jalapeños', quantity: '1 tablespoon', ingredients: ['Jalapeño', 'Vinegar'] },
      ] } },
];
const RECIPE_JSON = JSON.stringify(TACOS);
const withRecipes = code => code.replace('__RECIPE_JSON__', () => RECIPE_JSON);

PG.add({
  id:'l227', index:227, udemyId:38912014, minutes:18, section:'s28', slug:'what-is-json', kind:'node',
  title:'What is JSON?',
  blurb:'JSON (JavaScript Object Notation) is how APIs usually send data: it looks like a JavaScript object, but every key is in double quotes and the whole thing is one string, flattened for the trip across the network. <code>JSON.parse()</code> turns that text into a real object you can drill into; <code>JSON.stringify()</code> flattens an object back into text.',
  tasks:[
    'Open <code>recipe.json</code>: the same data as <code>recipeJSON</code>, laid out so you can read it. It is an array of three recipes; find where the protein, the salsa and the toppings live, and notice that <code>toppings</code> is an array of objects.',
    'In <code>POST /recipe</code>, read <code>req.body.choice</code>. The three emoji buttons share <code>name="choice"</code>, so it holds the value of whichever one was pressed: <code>chicken</code>, <code>beef</code> or <code>fish</code>.',
    'Turn <code>recipeJSON</code> into an array with <code>JSON.parse</code>, store recipe 0, 1 or 2 in <code>data</code> to match the choice (a <code>switch</code> works well), then <code>res.redirect("/")</code>.',
    'In <code>GET /</code>, render <code>index.ejs</code> with <code>{ recipe: data }</code>.',
    'In <code>index.ejs</code>, when <code>locals.recipe</code> exists show its name, the protein with its preparation, the salsa, and one list item per topping in the form “quantity of name” (loop over the array). Otherwise keep the prompt.',
    'Log <code>typeof recipeJSON</code> next to <code>typeof JSON.parse(recipeJSON)</code>, then log <code>JSON.stringify(data)</code>: your pick flattened back into the text form you would send to another server.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/recipe', body:{ choice:'beef' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/recipe', body:{ choice:'fish' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:{
'index.js':withRecipes(`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// This string stands in for a reply from a recipe API: JSON is just text.
// recipe.json holds the same data, laid out so you can read it.
const recipeJSON = '__RECIPE_JSON__';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;

app.get("/", (req, res) => {
  // TODO 4: pass the chosen recipe to the template as "recipe"
  res.render("index.ejs");
});

app.post("/recipe", (req, res) => {
  // TODO 2: req.body.choice is "chicken", "beef" or "fish"
  // TODO 3: JSON.parse(recipeJSON) gives an array of 3 recipes. Store the matching one
  //         in data, then redirect to "/"
  // TODO 6: log typeof recipeJSON, typeof JSON.parse(recipeJSON) and JSON.stringify(data)

});

app.listen(port, () => {
  console.log(\`Server running on port: \${port}\`);
});
`),
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>Taco Recipes</title>
  <link rel="stylesheet" type="text/css" href="/styles/main.css">
</head>
<body>
  <h1>Taco Town 🌮</h1>

  <form action="/recipe" method="POST" class="buttons">
    <button type="submit" value="chicken" name="choice">🍗</button>
    <button type="submit" value="beef" name="choice">🥩</button>
    <button type="submit" value="fish" name="choice">🐟</button>
  </form>

  <div id="recipeContainer">
    <!-- TODO 5: if a recipe was passed in (locals.recipe), show
           - its name in <h2 id="recipeTitle">
           - a <ul id="ingredientsList"> with
               the protein name and its preparation,
               the salsa name,
               one <li> per topping: "quantity of name" (toppings is an array, so loop)
         otherwise show the prompt below -->
    <h2>Pick your favourite taco ingredient 👆</h2>
  </div>
</body>
</html>
`,
'recipe.json':JSON.stringify(TACOS, null, 2) + '\n',
'public/styles/main.css':`body {
  margin: 0;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #e26e5c;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.07) 0 14px, transparent 14px 28px);
}

h1 {
  display: inline-block;
  margin: 0;
  padding: 4px 18px;
  font-size: 3.2rem;
  color: #e26e5c;
  background-color: white;
  border-radius: 12px;
}

h2 {
  color: #e26e5c;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: 28px 0;
}

.buttons button {
  width: 120px;
  height: 120px;
  font-size: 3.5rem;
  border: none;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.buttons button:hover {
  transform: scale(1.06);
}

#recipeContainer {
  max-width: 480px;
  margin: 0 auto;
  padding: 18px 24px;
  background-color: white;
  border-radius: 12px;
}

#ingredientsList {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

#ingredientsList li {
  margin-bottom: 8px;
  color: #555;
}

.meta {
  color: #888;
  font-size: 14px;
}
`},
  solution:{
'index.js':withRecipes(`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// This string stands in for a reply from a recipe API: JSON is just text.
// recipe.json holds the same data, laid out so you can read it.
const recipeJSON = '__RECIPE_JSON__';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;

app.get("/", (req, res) => {
  res.render("index.ejs", { recipe: data });
});

app.post("/recipe", (req, res) => {
  const recipes = JSON.parse(recipeJSON);
  switch (req.body.choice) {
    case "chicken":
      data = recipes[0];
      break;
    case "beef":
      data = recipes[1];
      break;
    case "fish":
      data = recipes[2];
      break;
    default:
      break;
  }
  console.log(typeof recipeJSON, "->", typeof recipes);   // string -> object
  console.log(JSON.stringify(data));                       // flattened back into text
  res.redirect("/");
});

app.listen(port, () => {
  console.log(\`Server running on port: \${port}\`);
});
`),
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>Taco Recipes</title>
  <link rel="stylesheet" type="text/css" href="/styles/main.css">
</head>
<body>
  <h1>Taco Town 🌮</h1>

  <form action="/recipe" method="POST" class="buttons">
    <button type="submit" value="chicken" name="choice">🍗</button>
    <button type="submit" value="beef" name="choice">🥩</button>
    <button type="submit" value="fish" name="choice">🐟</button>
  </form>

  <div id="recipeContainer">
    <% if (locals.recipe) { %>
      <h2 id="recipeTitle"><%= recipe.name %></h2>
      <p class="meta">$<%= recipe.price.toFixed(2) %> · salsa heat: <%= recipe.ingredients.salsa.spiciness %></p>
      <h3>Ingredients:</h3>
      <ul id="ingredientsList">
        <li><%= recipe.ingredients.protein.name %>, <%= recipe.ingredients.protein.preparation %></li>
        <li><%= recipe.ingredients.salsa.name %></li>
        <% recipe.ingredients.toppings.forEach((topping) => { %>
          <li><%= topping.quantity %> of <%= topping.name %></li>
        <% }) %>
      </ul>
    <% } else { %>
      <h2>Pick your favourite taco ingredient 👆</h2>
    <% } %>
  </div>
</body>
</html>
`},
  explore:[{
    title:'JSON.parse, and reading values out of the result', height:520,
    note:'The left box is JSON text. While it is valid, the right box shows the object JSON.parse builds, and the path box reads one value from it with dot and bracket notation. Press a “break it” button to see which small slips make JSON.parse throw.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px">
    <h4>JSON text (one string)</h4>
    <textarea id="src" spellcheck="false" style="width:100%;height:230px;font:12.5px/1.5 ui-monospace,Menlo,monospace;padding:8px;border:1px solid #dfe3ee;border-radius:8px">{
  "name": "Green Smoothie",
  "servings": 2,
  "vegan": true,
  "toppings": [
    { "name": "Chia seeds", "quantity": "1 teaspoon" },
    { "name": "Banana coins", "quantity": "half a banana" }
  ]
}</textarea>
  </div>
  <div style="flex:1;min-width:250px">
    <h4>JSON.parse(text)</h4>
    <pre class="readout" id="res" style="height:230px;overflow:auto"></pre>
  </div>
</div>
<div class="knobs">
  <label>read a value: data.<input id="path" type="text" value="toppings[1].name" style="width:190px"></label>
  <span class="val" id="val"></span>
</div>
<div class="knobs">
  <span class="tag">break it</span>
  <button data-break="quotes">single quotes</button>
  <button data-break="comma">trailing comma</button>
  <button data-break="key">unquoted key</button>
  <button data-break="reset">reset</button>
</div>
<script>
  var $ = function (id) { return document.getElementById(id); };
  var GOOD = $('src').value;
  function readPath(obj, p) {
    var keys = p.split('[').join('.').split(']').join('').split('.').filter(Boolean), cur = obj;
    for (var i = 0; i < keys.length; i++) { if (cur == null) return undefined; cur = cur[keys[i]]; }
    return cur;
  }
  function update() {
    var data;
    try { data = JSON.parse($('src').value); }
    catch (e) { $('res').textContent = 'JSON.parse threw a SyntaxError:\\n' + e.message; $('val').textContent = ''; return; }
    $('res').textContent = 'typeof data → "' + typeof data + '"' + (Array.isArray(data) ? ' (an array)' : '') + '\\n\\n' + JSON.stringify(data, null, 2);
    var v = readPath(data, $('path').value);
    $('val').textContent = '→ ' + (v === undefined ? 'undefined' : JSON.stringify(v));
  }
  var BREAKS = {
    quotes: function (t) { return t.replace('"name": "Green Smoothie"', "'name': 'Green Smoothie'"); },
    comma: function (t) { return t.replace('"half a banana" }', '"half a banana" },'); },
    key: function (t) { return t.replace('"servings"', 'servings'); },
    reset: function () { return GOOD; }
  };
  document.querySelectorAll('[data-break]').forEach(function (b) {
    b.onclick = function () { $('src').value = BREAKS[b.getAttribute('data-break')](GOOD); update(); };
  });
  $('src').addEventListener('input', update);
  $('path').addEventListener('input', update);
  update();
<\/script>`,
  },{
    title:'What survives JSON.stringify?', height:470,
    note:'JSON can only carry strings, numbers, booleans, null, arrays and objects. Compare the object on the left with the text on the right: the function and the undefined value vanish, the Date turns into a plain string, and NaN becomes null.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="pretty" checked> pretty-print: JSON.stringify(order, null, 2)</label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px"><h4>the object in memory</h4><pre class="readout">const order = {
  item: "Crispy Fish Taco",
  quantity: 2,
  extras: ["lime", "hot sauce"],
  paid: false,
  note: undefined,
  placedAt: new Date(Date.UTC(2026, 0, 15, 12, 30)),
  total: NaN,
  describe() {
    return this.quantity + " x " + this.item;
  },
};</pre></div>
  <div style="flex:1;min-width:250px"><h4>after JSON.stringify</h4><pre class="readout" id="out"></pre></div>
</div>
<script>
  var order = {
    item: "Crispy Fish Taco", quantity: 2, extras: ["lime", "hot sauce"], paid: false, note: undefined,
    placedAt: new Date(Date.UTC(2026, 0, 15, 12, 30)), total: NaN,
    describe: function () { return this.quantity + " x " + this.item; }
  };
  function paint() {
    var text = JSON.stringify(order, null, document.getElementById('pretty').checked ? 2 : 0);
    var back = JSON.parse(text);
    document.getElementById('out').textContent = text + '\\n\\ntypeof text            → "' + typeof text + '" (' + text.length + ' characters)' +
      '\\ntypeof back.placedAt   → "' + typeof back.placedAt + '"' +
      '\\nback.describe          → ' + back.describe;
  }
  document.getElementById('pretty').onchange = paint;
  paint();
<\/script>`,
  }],
  quiz:[
    { q:'What is the real difference between JSON and a JavaScript object?', options:['JSON is faster to read','Objects cannot be nested','JSON is a single string of text, ready to travel; an object is a live structure in memory','JSON can hold functions'], answer:2, why:'JSON is the flat-pack version of the data: the same shape, serialised into text so it can cross a network, then rebuilt with JSON.parse.' },
    { q:'Which of these is valid JSON?', options:['{ name: "Taco" }','{ \'name\': \'Taco\' }','{ "name": "Taco" }','{ "name": "Taco", }'], answer:2, why:'JSON keys must be double-quoted strings, strings use double quotes, and trailing commas are not allowed.' },
    { q:'<code>recipeJSON</code> is a string. What does <code>recipeJSON[0]</code> give you?', options:['The first recipe object','An error','undefined','The character "["'], answer:3, why:'Indexing a string returns one character. Parse first: JSON.parse(recipeJSON)[0] is the first recipe.' },
    { q:'<code>toppings</code> is an array of objects. How do you show every topping in EJS?', options:['Loop over it with forEach and print topping.quantity and topping.name in each &lt;li&gt;','&lt;%= recipe.ingredients.toppings %&gt;','Use recipe.ingredients.toppings.name','JSON.stringify the array into the page'], answer:0, why:'Plain objects such as protein and salsa use dot notation; arrays need a loop.' },
  ],
});


/* ---------- 228 ---------- */
PG.add({
  id:'l228', index:228, udemyId:38912016, minutes:18, section:'s28', slug:'axios-server-side-requests', kind:'node',
  title:'Making Server-Side API Requests with Axios',
  blurb:'Node’s built-in <code>https</code> module can call an API, but you have to collect the reply in chunks and parse it yourself. <b>Axios</b> does it in one line: <code>await axios.get(url)</code> gives you <code>response.data</code>, already parsed, and any failure (including a 404) lands in your <code>catch</code>. The exercise is the “I’m Bored” activity finder.',
  tasks:[
    'Press <b>▶ Run</b>. <code>GET /</code> already calls <code>await axios.get(\"https://bored-api.appbrewery.com/random\")</code> and logs <code>response.data</code>: read its shape in the terminal. There is no <code>JSON.parse</code> anywhere, because Axios has already parsed the reply.',
    'Step 1, in <code>index.ejs</code>: when <code>locals.data</code> exists, show the card with <code>data.activity</code>, <code>data.type</code> and <code>data.participants</code>; when <code>locals.error</code> exists, show it in the error div.',
    'Step 2, <code>POST /</code>: watch <code>req.body</code> in the terminal as you submit the form, then <code>await axios.get(…)</code> the <code>/filter</code> endpoint with <code>type</code> and <code>participants</code> as query parameters (a template literal works well). Put it inside try.',
    '<code>/filter</code> replies with an array, but the page shows one card: pick an element with <code>Math.floor(Math.random() * result.length)</code> and render it as <code>data</code>.',
    'Step 3: when nothing matches, the API answers 404 and Axios throws. In <code>catch</code>, check <code>error.response.status === 404</code> and render <code>error: \"No activities that match your criteria.\"</code>; for anything else show <code>error.message</code>.',
    'Test it: Education for 1 person finds something, Education for 2 people shows your message, and Random type with any number of people behaves like the home page.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/', body:{ type:'education', participants:'1' }, expect:200 },
    { method:'POST', path:'/', body:{ type:'education', participants:'2' }, expect:200 },
    { method:'POST', path:'/', body:{ type:'', participants:'' }, expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: the home page should show a random activity. This route already fetches one:
//   look at the shape of response.data (it is logged in the terminal), then edit
//   views/index.ejs so the card shows it.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.log("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  // Step 2: play with the dropdowns and watch what gets logged above.
  //   Request the /filter endpoint with both the type and participants query parameters,
  //   then render index.ejs with ONE random activity from the array that comes back.
  // Step 3: when nothing matches, the API answers 404 and axios throws. Catch it and
  //   render index.ejs with error: "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(\`Server running on port: \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/main.css">
  <title>I'm Bored</title>
</head>
<body>
  <div class="container">
    <h1>Let's find something for you to do ✌️</h1>

    <form action="/" id="form" class="form" method="POST">
      <select name="type" class="form-select">
        <option value="">Random type</option>
        <option value="education">Education</option>
        <option value="charity">Charity</option>
        <option value="recreational">Recreational</option>
        <option value="relaxation">Relaxation</option>
        <option value="busywork">Busywork</option>
        <option value="social">Social</option>
        <option value="diy">DIY</option>
        <option value="music">Music</option>
      </select>
      <select name="participants" class="form-select">
        <option value="">Any number of people</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button type="submit" class="form-submit">Go</button>
    </form>

    <section id="cards" class="cards">
      <!-- TODO: when data was passed in (locals.data), show the card:
           <article class="card-item">
             <h2 class="card-activity"> the activity </h2>
             <div class="card-info">
               <span class="card-type"> the type </span>
               <span class="card-participants"> participants: the number </span>
             </div>
           </article> -->

      <!-- TODO: when an error was passed in (locals.error), show it in
           <div id="tag-error" class="tag-error"> ... </div> -->
    </section>
  </div>
</body>
</html>
`,
'public/styles/main.css':`*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  font-family: monospace;
  height: 100%;
}

h1 {
  width: 100%;
  margin-bottom: 40px;
}

.container {
  height: 100%;
  width: 100%;
  max-width: 570px;
  margin: 0 auto;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 80px;
  grid-column-gap: 10px;
}

.form-select {
  height: 38px;
  padding: 0 8px;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  background: white;
  font-family: monospace;
}

.form-submit {
  outline: none;
  border: 1px solid #e8e8e8;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  font-family: monospace;
  font-size: 14px;
  line-height: 36px;
}

.form-submit:focus {
  box-shadow: 0 0 0 0.5px #999;
}

.cards {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  width: 100%;
}

.card-item {
  width: 100%;
  padding: 5px 20px 20px;
  border: 1px solid #e8e8e8;
  background-color: white;
  border-radius: 5px;
}

.card-info {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}

.card-activity {
  line-height: 1.2;
  margin-top: 10px;
}

.tag-error {
  width: 100%;
  text-align: center;
  color: #b91c1c;
}

@media (max-width: 620px) {
  .container {
    padding: 60px 20px;
  }
  .form {
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }
}
`,
'package.json':`{
  "name": "im-bored",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0",
    "body-parser": "^1.20.2",
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.log("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const type = req.body.type;
    const participants = req.body.participants;
    const response = await axios.get(
      \`https://bored-api.appbrewery.com/filter?type=\${type}&participants=\${participants}\`
    );
    const result = response.data;
    console.log(result);
    res.render("index.ejs", {
      data: result[Math.floor(Math.random() * result.length)],
    });
  } catch (error) {
    console.log("Failed to make request:", error.message);
    if (error.response && error.response.status === 404) {
      res.render("index.ejs", { error: "No activities that match your criteria." });
    } else {
      res.render("index.ejs", { error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(\`Server running on port: \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/styles/main.css">
  <title>I'm Bored</title>
</head>
<body>
  <div class="container">
    <h1>Let's find something for you to do ✌️</h1>

    <form action="/" id="form" class="form" method="POST">
      <select name="type" class="form-select">
        <option value="">Random type</option>
        <option value="education">Education</option>
        <option value="charity">Charity</option>
        <option value="recreational">Recreational</option>
        <option value="relaxation">Relaxation</option>
        <option value="busywork">Busywork</option>
        <option value="social">Social</option>
        <option value="diy">DIY</option>
        <option value="music">Music</option>
      </select>
      <select name="participants" class="form-select">
        <option value="">Any number of people</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button type="submit" class="form-submit">Go</button>
    </form>

    <section id="cards" class="cards">
      <% if (locals.data) { %>
        <article class="card-item">
          <h2 class="card-activity"><%= data.activity %></h2>
          <div class="card-info">
            <span class="card-type"><%= data.type %></span>
            <span class="card-participants">participants: <%= data.participants %></span>
          </div>
        </article>
      <% } %>

      <% if (locals.error) { %>
        <div id="tag-error" class="tag-error"><%= error %></div>
      <% } %>
    </section>
  </div>
</body>
</html>
`},
  explore:[{
    title:'What axios hands back: a response, or an error', height:500,
    note:'This mirrors the offline Bored API used in the lesson. Pick a filter and run the request: a match resolves the promise with a response object (status and data), while no match rejects it, so the code jumps to catch with an error whose response holds the 404.',
    html:`
<div class="knobs">
  <label>type <select id="type"><option value="">(any)</option><option>education</option><option>charity</option><option>recreational</option><option>relaxation</option><option>busywork</option><option>social</option><option>diy</option><option>music</option></select></label>
  <label>participants <select id="ppl"><option value="">(any)</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
  <button id="go">await axios.get(...)</button>
</div>
<pre class="readout" id="req"></pre>
<pre class="readout" id="res" style="max-height:290px;overflow:auto"></pre>
<script>
  var A = [
    ['Learn to juggle three oranges', 'recreational', 1], ['Cook a dish from a country you have never visited', 'cooking', 2],
    ['Write a letter to yourself to open in five years', 'relaxation', 1], ['Organise a board game night', 'social', 4],
    ['Build a birdhouse from scrap wood', 'diy', 1], ['Start a small herb garden on the windowsill', 'diy', 1],
    ['Volunteer at a local charity shop for an afternoon', 'charity', 1], ['Learn ten phrases in a new language', 'education', 1],
    ['Go for a sunrise walk with a friend', 'social', 2], ['Make a playlist for a friend and explain each pick', 'music', 2],
    ['Try a 30-minute bodyweight workout', 'busywork', 1], ['Repaint a piece of old furniture', 'diy', 2]
  ].map(function (r) { return { activity: r[0], type: r[1], participants: r[2] }; });
  var $ = function (id) { return document.getElementById(id); };
  function run() {
    var t = $('type').value, p = $('ppl').value;
    var url = 'https://bored-api.appbrewery.com/filter?type=' + t + '&participants=' + p;
    $('req').textContent = 'const response = await axios.get(\\n  "' + url + '"\\n);';
    var list = A.filter(function (a) { return (!t || a.type === t) && (!p || a.participants === Number(p)); });
    if (list.length) {
      var pick = Math.floor(Math.random() * list.length);
      $('res').textContent = '// the promise RESOLVED: execution carries on in try\\n' +
        'response.status   → 200\\n' +
        'response.data     → an array of ' + list.length + ' (already parsed, no JSON.parse needed)\\n' +
        JSON.stringify(list, null, 2) + '\\n\\n' +
        '// one card, so pick one:\\nresult[Math.floor(Math.random() * ' + list.length + ')]  → result[' + pick + ']\\n' + JSON.stringify(list[pick], null, 2);
    } else {
      $('res').textContent = '// the promise REJECTED: execution jumps to catch (error)\\n' +
        'error.message          → "Request failed with status code 404"\\n' +
        'error.response.status  → 404\\n' +
        'error.response.data    → { "error": "No activities that match your criteria." }';
    }
  }
  $('go').onclick = run;
  $('type').onchange = run;
  $('ppl').onchange = run;
  run();
<\/script>`,
  }],
  quiz:[
    { q:'The API replies with JSON. What is in <code>response.data</code>?', options:['The raw JSON text, so you must JSON.parse it','The already-parsed JavaScript object or array','Only the HTTP status','A Promise'], answer:1, why:'Axios parses JSON replies for you; that is one of the boilerplate steps the https module made you do by hand.' },
    { q:'Why does the call sit inside <code>try { … } catch</code>?', options:['Axios rejects on network failures and on error statuses such as 404, and catch handles both in one place','Axios requires it','It makes the request faster','So that req.body is filled in'], answer:0, why:'An awaited promise that rejects throws; catch is where you turn that into a friendly message instead of a crashed request.' },
    { q:'<code>/filter</code> returns an array but the page shows a single card. What does the route do?', options:['Renders the whole array','Calls /random instead','Always uses result[0]','Picks one element at random with Math.floor(Math.random() * result.length)'], answer:3, why:'Math.random() * length scaled and floored gives a valid index from 0 to length − 1.' },
    { q:'What happens if you forget <code>await</code> before <code>axios.get</code>?', options:['Nothing changes','Axios throws immediately','response is a pending Promise, so response.data is undefined','The request is sent twice'], answer:2, why:'Without await you hold the promise itself, not the reply it will eventually deliver.' },
  ],
});


/* ---------- 229 ---------- */
PG.add({
  id:'l229', index:229, udemyId:38912024, minutes:38, section:'s28', slug:'api-authentication', kind:'node',
  title:'API Authentication',
  blurb:'APIs protect valuable data by checking who is asking. Four levels: <b>no auth</b> (public data, rate-limited), <b>Basic auth</b> (username:password, Base64-encoded in a header), an <b>API key</b> (here a query parameter), and a <b>Bearer token</b> issued after logging in. Each route in this exercise calls the Secrets API with a different one.',
  tasks:[
    'TODO 1: fill in the four constants with the playground’s test account: <code>testuser</code> / <code>secret123</code>, API key <code>test-api-key</code>, bearer token <code>test-bearer-token</code>.',
    'TODO 2, <code>/noAuth</code>: <code>await axios.get(API_URL + "/random")</code> and render <code>index.ejs</code> with <code>content: JSON.stringify(result.data)</code>. Wrap it in try/catch and reply <code>res.status(404).send(error.message)</code> on failure.',
    'TODO 3, <code>/basicAuth</code>: request <code>/all?page=2</code> and pass <code>{ auth: { username, password } }</code> as the second argument; Axios builds the Basic header from it.',
    'TODO 4, <code>/apiKey</code>: request <code>/filter</code> for secrets with a score of 5 or more, sending <code>score</code> and <code>apiKey</code> as query parameters (the <code>params</code> option, or write them into the URL).',
    'TODO 5, <code>/bearerToken</code>: request <code>/secrets/2</code> with <code>{ headers: { Authorization: `Bearer ${yourBearerToken}` } }</code>.',
    'Click all four buttons, then break each one on purpose (wrong password, no apiKey, “bearer” in lower case) and read the 401 that comes back.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/noAuth', expect:200 },
    { method:'GET', path:'/basicAuth', expect:200 },
    { method:'GET', path:'/apiKey', expect:200 },
    { method:'GET', path:'/bearerToken', expect:200 },
  ],
  notes:'<h3>Test credentials in the playground</h3><table><tr><th>Style</th><th>Value</th></tr><tr><td>Basic auth</td><td><code>testuser</code> / <code>secret123</code></td></tr><tr><td>API key</td><td><code>test-api-key</code></td></tr><tr><td>Bearer token</td><td><code>test-bearer-token</code></td></tr></table><p>They only work against the playground’s offline copy of the Secrets API. On the live service you register your own; never commit real ones to Git (keep them in a <code>.env</code> file).</p>',
  files:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// TODO 1: Fill in your values for the 3 types of auth.
// The playground's copy of the Secrets API has a test account ready:
//   username "testuser", password "secret123", API key "test-api-key", token "test-bearer-token"
const yourUsername = "";
const yourPassword = "";
const yourAPIKey = "";
const yourBearerToken = "";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  // TODO 2: use axios to GET the /random endpoint (no auth needed).
  // Send the data to index.ejs as "content". JSON.stringify it first so it shows as text.
});

app.get("/basicAuth", async (req, res) => {
  // TODO 3: GET /all, page 2 only, with Basic auth.
  // axios builds the Authorization header for you from:
  //   { auth: { username: "...", password: "..." } }
});

app.get("/apiKey", async (req, res) => {
  // TODO 4: GET /filter for every secret with an embarrassment score of 5 or more.
  // This API expects the key as a query parameter named apiKey.
});

app.get("/bearerToken", async (req, res) => {
  // TODO 5: GET /secrets/2 with a Bearer token:
  //   { headers: { Authorization: \`Bearer \${yourBearerToken}\` } }
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>API Authentication</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      margin: 10px;
      padding: 15px 30px;
      font-size: 16px;
      border-radius: 5px;
      color: white;
      text-decoration: none;
    }

    #noAuth { background-color: #3498db; }
    #basicAuth { background-color: #2ecc71; }
    #apiKey { background-color: #f1c40f; }
    #bearerToken { background-color: #e74c3c; }

    .response-area {
      margin: 20px;
      max-width: 720px;
      padding: 20px;
      background-color: white;
      font-family: ui-monospace, Menlo, monospace;
      font-size: 14px;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <nav>
    <a class="btn" id="noAuth" href="/noAuth">No Auth</a>
    <a class="btn" id="basicAuth" href="/basicAuth">Basic Auth</a>
    <a class="btn" id="apiKey" href="/apiKey">API Key</a>
    <a class="btn" id="bearerToken" href="/bearerToken">Bearer Token</a>
  </nav>

  <div class="response-area">
    <p><%= content %></p>
  </div>
</body>
</html>
`},
  solution:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// test values for the playground's copy of the API; never commit real ones
const yourUsername = "testuser";
const yourPassword = "secret123";
const yourAPIKey = "test-api-key";
const yourBearerToken = "test-bearer-token";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/all?page=2", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/apiKey", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/filter", {
      params: {
        score: 5,
        apiKey: yourAPIKey,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

const config = {
  headers: { Authorization: \`Bearer \${yourBearerToken}\` },
};

app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/2", config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`},
  explore:[{
    title:'Basic auth is only Base64', height:470,
    note:'Type a username and password to see the exact header Axios sends for the auth option. Then decode it: Base64 is an encoding anyone can reverse, not encryption. Basic auth is acceptable only because real APIs are served over HTTPS, which encrypts the whole request.',
    html:`
<div class="knobs">
  <label>username <input id="u" type="text" value="testuser"></label>
  <label>password <input id="p" type="text" value="secret123"></label>
</div>
<pre class="readout" id="basic"></pre>
<div class="knobs">
  <label>decode <input id="d" type="text" style="width:300px" value="Basic dGVzdHVzZXI6c2VjcmV0MTIz"></label>
</div>
<pre class="readout" id="dec"></pre>
<h4>Where the credential travels in each style</h4>
<pre class="readout">No auth   GET /random
Basic     GET /all?page=2        Authorization: Basic dGVzdHVzZXI6c2VjcmV0MTIz
API key   GET /filter?score=5&apiKey=test-api-key
Bearer    GET /secrets/2         Authorization: Bearer test-bearer-token</pre>
<script>
  var $ = function (id) { return document.getElementById(id); };
  function b64(s) { return btoa(unescape(encodeURIComponent(s))); }
  function unb64(s) { return decodeURIComponent(escape(atob(s))); }
  function paint() {
    var joined = $('u').value + ':' + $('p').value, enc = b64(joined);
    $('basic').textContent = '1. join with a colon   ' + joined + '\\n2. Base64-encode      ' + enc + '\\n3. send as a header   Authorization: Basic ' + enc;
    var d = $('d').value.trim();
    if (d.indexOf('Basic ') === 0) d = d.slice(6);
    try { $('dec').textContent = 'atob(...)  →  ' + unb64(d) + '\\n\\nNo key needed: whoever sees the header can read the password.'; }
    catch (e) { $('dec').textContent = 'That is not valid Base64.'; }
  }
  ['u', 'p', 'd'].forEach(function (id) { $(id).addEventListener('input', paint); });
  paint();
<\/script>`,
  }],
  quiz:[
    { q:'What does Basic authentication actually put in the request?', options:['The header Authorization: Basic followed by Base64 of username:password','An encrypted password','A cookie','The password as a query parameter'], answer:0, why:'The pair is joined with a colon and Base64-encoded. That is reversible, which is why it must travel over HTTPS.' },
    { q:'Where does this Secrets API expect the API key?', options:['In a header called X-Key','In the request body','In a query parameter named apiKey','In the URL path'], answer:2, why:'APIs differ (some want a header), so check the docs. Here it is ?apiKey=…, which the params option adds for you.' },
    { q:'Which Axios config sends a bearer token?', options:['{ auth: { token } }','{ params: { token } }','{ headers: { Authorization: `Bearer ${token}` } }','{ bearer: token }'], answer:2, why:'A bearer token goes in the Authorization header: the word Bearer, one space, then the token.' },
    { q:'Authentication vs authorization: which pairing is right?', options:['Authentication = what you may do; authorization = who you are','Authorization only applies to admins','They are two words for the same thing','Authentication = proving who you are; authorization = being allowed to use the service or data'], answer:3, why:'Logging in proves identity; an API key or token then grants permission, and can be tracked or revoked without touching the password.' },
  ],
});


/* ---------- 230 ---------- */
PG.add({
  id:'l230', index:230, udemyId:38912020, minutes:25, section:'s28', slug:'rest-apis', kind:'node',
  title:'REST APIs',
  blurb:'A fully RESTful API supports every HTTP verb: <b>GET</b> reads, <b>POST</b> creates, <b>PUT</b> replaces, <b>PATCH</b> updates some fields and <b>DELETE</b> removes. Axios has a method for each, but watch the arguments: <code>get</code> and <code>delete</code> take (url, config), while <code>post</code>, <code>put</code> and <code>patch</code> take (url, body, config).',
  tasks:[
    'TODO 1: set <code>yourBearerToken</code> to <code>test-bearer-token</code>. Run, type id <code>2</code> and press <b>GET</b>: <code>/get-secret</code> already works and is your template.',
    '<code>/post-secret</code>: <code>axios.post(API_URL + "/secrets", req.body, config)</code>. The form fields are named <code>secret</code> and <code>score</code>, exactly what the API expects, so <code>req.body</code> can be the body. Note the new id in the reply.',
    '<code>/put-secret</code>: <code>axios.put(API_URL + "/secrets/" + req.body.id, req.body, config)</code>. PUT id 2 with only a score filled in and watch the secret text get wiped: PUT replaces the whole record.',
    '<code>/patch-secret</code>: build an object with only the fields that were filled in, then <code>axios.patch</code> it. PATCH a score alone and the text survives.',
    '<code>/delete-secret</code>: <code>axios.delete(API_URL + "/secrets/" + req.body.id, config)</code>. Two arguments only: a DELETE has no body.',
    'Run the whole life cycle: POST a secret, GET its id, PATCH its score, DELETE it, then GET it again to see the API’s “not found” error in the page.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/get-secret', body:{ id:'2', secret:'', score:'' }, expect:200 },
    { method:'POST', path:'/post-secret', body:{ id:'', secret:'I name every houseplant after a scientist.', score:'4' }, expect:200 },
    { method:'POST', path:'/put-secret', body:{ id:'2', secret:'I hum while I code.', score:'6' }, expect:200 },
    { method:'POST', path:'/patch-secret', body:{ id:'2', secret:'', score:'9' }, expect:200 },
    { method:'POST', path:'/delete-secret', body:{ id:'2', secret:'', score:'' }, expect:200 },
    { method:'POST', path:'/get-secret', body:{ id:'2', secret:'', score:'' }, expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// TODO 1: Add your bearer token. The playground's copy of the API accepts "test-bearer-token".
const yourBearerToken = "";

const config = {
  headers: { Authorization: \`Bearer \${yourBearerToken}\` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  // TODO 2: use axios to POST the data from req.body to the secrets API.
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 3: use axios to PUT the data from req.body to /secrets/{searchId}.
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 4: use axios to PATCH /secrets/{searchId} with only the fields that were filled in.
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 5: use axios to DELETE the secret with id searchId.
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>REST with Axios</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    input[type="submit"] {
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin: 2px;
    }

    .response-area {
      background-color: #f0f0f0;
      padding: 12px 10px;
      font-family: ui-monospace, Menlo, monospace;
      font-size: 14px;
      word-break: break-word;
    }

    #get { background-color: #2ecc71; }
    #post { background-color: #3498db; }
    #put { background-color: #9b59b6; }
    #patch { background-color: #f1c40f; }
    #delete { background-color: #e74c3c; }
  </style>
</head>
<body>
  <div class="container">
    <div class="response-area">
      <p><%= content %></p>
    </div>
    <form id="myForm" method="post">
      <label for="idInput">Id:</label>
      <input type="text" id="idInput" name="id">

      <label for="secretInput">Secret:</label>
      <input type="text" id="secretInput" name="secret">

      <label for="scoreInput">Score:</label>
      <input type="number" id="scoreInput" name="score">

      <label>Route:</label>
      <input id="get" type="submit" value="GET" formaction="/get-secret">
      <input id="post" type="submit" value="POST" formaction="/post-secret">
      <input id="put" type="submit" value="PUT" formaction="/put-secret">
      <input id="patch" type="submit" value="PATCH" formaction="/patch-secret">
      <input id="delete" type="submit" value="DELETE" formaction="/delete-secret">
    </form>
  </div>
</body>
</html>
`},
  solution:{
'index.js':`import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const yourBearerToken = "test-bearer-token";

const config = {
  headers: { Authorization: \`Bearer \${yourBearerToken}\` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  try {
    // body second, config third
    const result = await axios.post(API_URL + "/secrets", req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    // PUT replaces the whole record, so empty fields really are saved as empty
    const result = await axios.put(API_URL + "/secrets/" + searchId, req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  // PATCH carries only what changes, so leave out the inputs that were left empty
  const changes = {};
  if (req.body.secret) changes.secret = req.body.secret;
  if (req.body.score) changes.score = req.body.score;
  try {
    const result = await axios.patch(API_URL + "/secrets/" + searchId, changes, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    // url and config only: a DELETE has no body
    const result = await axios.delete(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`},
  explore:[{
    title:'PUT replaces, PATCH amends', height:420,
    note:'Fill in only the score and press each button. PUT swaps the whole stored record for what you sent, so the blank secret is saved as blank. PATCH changes only the fields you include.',
    html:`
<div class="knobs">
  <label>secret <input id="s" type="text" placeholder="leave blank" style="width:200px"></label>
  <label>score <input id="sc" type="number" min="0" max="10" placeholder="blank" style="width:70px" value="9"></label>
  <button id="put">PUT /secrets/2</button>
  <button id="patch">PATCH /secrets/2</button>
  <button id="reset">reset</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:220px"><h4>stored before</h4><pre class="readout" id="before"></pre></div>
  <div style="flex:1;min-width:220px"><h4>request body → stored after</h4><pre class="readout" id="after">press PUT or PATCH</pre></div>
</div>
<script>
  var START = { id: 2, secret: "I have never actually finished a book club book.", score: 3 };
  var rec;
  var $ = function (id) { return document.getElementById(id); };
  function reset() { rec = JSON.parse(JSON.stringify(START)); $('before').textContent = JSON.stringify(rec, null, 2); $('after').textContent = 'press PUT or PATCH'; }
  function send(verb) {
    var before = JSON.stringify(rec, null, 2), body = {}, s = $('s').value, sc = $('sc').value;
    if (verb === 'PUT') { body = { secret: s, score: sc }; rec = { id: 2, secret: s || '', score: Number(sc) || 0 }; }
    else { if (s) body.secret = s; if (sc) body.score = sc; if (body.secret != null) rec.secret = body.secret; if (body.score != null) rec.score = Number(body.score); }
    $('before').textContent = before;
    $('after').textContent = verb + ' body: ' + JSON.stringify(body) + '\\n\\n' + JSON.stringify(rec, null, 2);
  }
  $('put').onclick = function () { send('PUT'); };
  $('patch').onclick = function () { send('PATCH'); };
  $('reset').onclick = reset;
  reset();
<\/script>`,
  }],
  quiz:[
    { q:'Which call creates a secret correctly?', options:['axios.post(url, config, body)','axios.post(url, body, config)','axios.post(body, url, config)','axios.post(url, { body, config })'], answer:1, why:'post, put and patch take (url, data, config). Passing config second would send your headers as the body.' },
    { q:'A stored record is <code>{ secret: "x", score: 7 }</code>. You PUT <code>{ score: 3 }</code>. What is stored now?', options:['{ secret: "", score: 3 } (or no secret at all)','{ secret: "x", score: 3 }','{ secret: "x", score: 7 }','An error, PUT needs an id in the body'], answer:0, why:'PUT is a full replacement; anything you leave out is overwritten. PATCH would have kept the secret.' },
    { q:'How can one form send its data to five different routes?', options:['Five separate forms','The server inspects the button colour','JavaScript changes the action','Each submit button has its own formaction, which overrides the form’s action'], answer:3, why:'formaction on a submit button replaces the form’s action for that button only.' },
    { q:'What does <code>async/await</code> change compared with <code>.then()</code> chains?', options:['The HTTP method used','It makes requests run in parallel','Only how the code reads: it pauses at each await, runs top to bottom, and errors go to try/catch','Nothing: await is ignored by Axios'], answer:2, why:'Both consume the same promise; await just lets you write the steps in order instead of nesting callbacks.' },
  ],
});


/* ---------- 231 ---------- */
PG.add({
  id:'l231', index:231, udemyId:38912028, minutes:12, section:'s28', slug:'secrets-project', kind:'node', project:true,
  title:'Secrets Project',
  blurb:'The module’s project: a small anonymous-confessions site. Each visit, your server asks the Secrets API’s <code>/random</code> endpoint for one secret and renders it onto a card that reveals its text on hover. No authentication needed, so the focus is on wiring Express, Axios and EJS together from an empty file.',
  tasks:[
    'In <code>index.js</code>, import express and axios, create the app on port 3000 and serve the <code>public</code> folder with <code>express.static</code>.',
    'Add an async <code>GET /</code> route that awaits <code>axios.get("https://secrets-api.appbrewery.com/random")</code> and logs <code>result.data</code> so you can see its fields.',
    '<code>index.ejs</code> expects two variables, <code>secret</code> and <code>user</code>. Render it with <code>secret: result.data.secret</code> and the user. The live API sends a <code>username</code>; this offline copy only sends id, secret and score, so fall back to something like <code>Anonymous #7</code> built from the id.',
    'Wrap the request in try/catch: log the error for yourself and reply with <code>res.status(500).send(…)</code> and a friendly sentence. (The course file only calls <code>res.status(500)</code>, which never sends anything, so the browser hangs.)',
    'Start the server with <code>app.listen</code> and a log message. Reload the page a few times and hover over the card.',
    'Extend it: pass the embarrassment score too (<code>score</code> here, <code>emScore</code> in the live API) and show it under the card.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/styles/main.css', expect:200 },
  ],
  files:{
'index.js':`// Hints
// 1. Import express and axios.

// 2. Create the app and pick port 3000.

// 3. Serve the public folder for the stylesheet.

// 4. Home page: render index.ejs ...

// 5. ... after asking the Secrets API for a random secret with axios, and passing
//    its text and the user who wrote it to the template.

// 6. Start listening on your port.
`,
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>Lisper</title>
  <link rel="stylesheet" type="text/css" href="styles/main.css">
</head>
<body>
  <h1>What's your secret?</h1>
  <div class="card">
    <p><%= secret %></p>
  </div>
  <p class="user"><%= user %></p>
  <a href="/">Another one ↻</a>
</body>
</html>
`,
'public/styles/main.css':`:root {
  --card-height: 360px;
  --card-width: 240px;
}

body {
  min-height: 100vh;
  margin: 0;
  padding: 2rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1d2130;
  font-family: "Trebuchet MS", system-ui, sans-serif;
}

h1 {
  color: white;
  letter-spacing: 0.5px;
}

.card {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 10px;
  background: radial-gradient(circle at 30% 20%, #3b4a7a, #141826 70%);
  font-family: "Comic Sans MS", "Segoe Print", cursive;
  font-size: 1.3em;
  color: rgb(127 211 255 / 0%);
  transition: color 1s;
}

/* a hushed emoji covers the card until you hover */
.card::before {
  content: "🤫";
  position: absolute;
  font-size: 4rem;
  color: white;   /* the card's text is transparent until hover; the emoji needs its own colour */
  transition: opacity 0.6s;
}

/* a spinning gradient border behind the card */
.card::after {
  content: "";
  position: absolute;
  inset: -4px;
  z-index: -1;
  border-radius: 13px;
  background: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
  animation: spin 2.5s linear infinite;
}

.card:hover {
  color: rgb(127 211 255 / 100%);
}

.card:hover::before {
  opacity: 0;
}

@property --rotate {
  syntax: "<angle>";
  initial-value: 132deg;
  inherits: false;
}

@keyframes spin {
  0% { --rotate: 0deg; }
  100% { --rotate: 360deg; }
}

.user {
  color: white;
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
}

.score {
  color: #ffb4a2;
  margin-top: 0;
}

a {
  color: #8fb3ff;
  text-decoration: none;
  margin-top: 1rem;
}
`},
  solution:{
'index.js':`import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://secrets-api.appbrewery.com/random");
    console.log(result.data);
    res.render("index.ejs", {
      secret: result.data.secret,
      // the live API sends a username; the offline copy only has id, secret and score
      user: result.data.username || \`Anonymous #\${result.data.id}\`,
      score: result.data.score,
    });
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    res.status(500).send("Something went wrong on our side. Please try again in a moment.");
  }
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html>
<head>
  <title>Lisper</title>
  <link rel="stylesheet" type="text/css" href="styles/main.css">
</head>
<body>
  <h1>What's your secret?</h1>
  <div class="card">
    <p><%= secret %></p>
  </div>
  <p class="user"><%= user %></p>
  <% if (locals.score != null) { %>
    <p class="score">embarrassment: <%= "🔥".repeat(Math.round(score / 2)) %> <%= score %>/10</p>
  <% } %>
  <a href="/">Another one ↻</a>
</body>
</html>
`},
  quiz:[
    { q:'The template prints <code>&lt;%= user %&gt;</code>, but the API field is called <code>username</code>. What has to happen?', options:['Rename the field in the API','Nothing, EJS ignores unknown names','EJS renames it automatically','Map it when rendering: user: result.data.username'], answer:3, why:'The keys you pass to res.render are the variable names the template sees, so you translate API names into template names there.' },
    { q:'A catch block only calls <code>res.status(500)</code>. What does the visitor see?', options:['Nothing: the browser waits until it times out, because status() only sets the code','A 500 error page','The previous secret','A redirect to /'], answer:0, why:'status() just records the code; send(), render() or json() is what actually replies.' },
    { q:'Why does <code>href="styles/main.css"</code> load at all?', options:['EJS inlines stylesheets','express.static("public") serves the public folder, so /styles/main.css maps to public/styles/main.css','The browser looks in public/ by itself','Express serves every file in the project'], answer:1, why:'Static middleware exposes one folder; the folder name itself is not part of the URL.' },
  ],
});


/* ---------- 232 ---------- */
PG.add({
  id:'l232', index:232, udemyId:17967488, minutes:3, section:'s28', slug:'tip-accountability', kind:'read',
  title:'Tip from Angela - Use Accountability in your Favour',
  blurb:'A goal only you know about is easy to drop. Announce a concrete plan, such as an hour of coding a day for a set number of days, and post your progress where others can see it: the <b>#100DaysOfCode</b> community does exactly this.',
  links:[
    { title:'#100DaysOfCode', url:'https://www.100daysofcode.com/', note:'the challenge and its rules' },
  ],
  quiz:[
    { q:'Why does announcing a learning goal help you stick to it?', options:['People expect updates, so quitting now has a social cost, and you build a visible record of progress','Nobody notices if you skip a day','It replaces the need to practise','It gets you a certificate'], answer:0, why:'Public check-ins turn a private intention into a commitment, and the daily log shows how far you have come.' },
  ],
});

})();
