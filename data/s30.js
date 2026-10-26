/* ===== Section 30 — Build Your Own API ===== */
(function () {

/* ---------- the jokes API (235–237), assembled from route fragments ---------- */
const HEAD = `import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "8R2QK7M-3HZW5TD-Q9XNB4C-J6LP2VE";

app.use(bodyParser.urlencoded({ extended: true }));
`;

const R = {
  1: { todo: `
// 1. GET a random joke
//    TODO: pick a random index and send that joke back with res.json

`, done: `
// 1. GET a random joke
app.get("/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
});
` },
  2: { todo: `
// 2. GET a specific joke: /jokes/:id
//    TODO: req.params.id arrives as a string. Convert it, find the joke and send it back.

`, done: `
// 2. GET a specific joke: /jokes/:id
app.get("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  if (!foundJoke) {
    return res.status(404).json({ error: \`Joke with id \${id} not found.\` });
  }
  res.json(foundJoke);
});
` },
  3: { todo: `
// 3. GET jokes filtered by type: /filter?type=Puns
//    TODO: read req.query.type and send back every joke of that type

`, done: `
// 3. GET jokes filtered by type: /filter?type=Puns
app.get("/filter", (req, res) => {
  const type = req.query.type;
  const filteredJokes = jokes.filter((joke) => joke.jokeType === type);
  res.json(filteredJokes);
});
` },
  4: { todo: `
// 4. POST a new joke (form fields: text and type)
//    TODO: build { id, jokeText, jokeType }, push it onto jokes, send it back

`, done: `
// 4. POST a new joke (form fields: text and type)
app.post("/jokes", (req, res) => {
  const newJoke = {
    id: jokes.length + 1,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };
  jokes.push(newJoke);
  console.log(jokes.slice(-1));
  res.json(newJoke);
});
`, safer: `
// 4. POST a new joke (form fields: text and type)
app.post("/jokes", (req, res) => {
  // highest existing id + 1, so an id freed by a delete is never handed out twice
  const nextId = jokes.reduce((max, joke) => Math.max(max, joke.id), 0) + 1;
  const newJoke = {
    id: nextId,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };
  jokes.push(newJoke);
  console.log(jokes.slice(-1));
  res.json(newJoke);
});
` },
  5: { todo: `
// 5. PUT a joke: replace it completely
//    TODO: build the replacement from the id and both body fields, overwrite it in place

`, done: `
// 5. PUT a joke: replace it completely
app.put("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  if (searchIndex === -1) {
    return res.status(404).json({ error: \`Joke with id \${id} not found.\` });
  }
  const replacementJoke = {
    id: id,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };
  jokes[searchIndex] = replacementJoke;
  res.json(replacementJoke);
});
` },
  6: { todo: `
// 6. PATCH a joke: change only the fields that were sent
//    TODO: keep the stored value for any field missing from req.body

`, done: `
// 6. PATCH a joke: change only the fields that were sent
app.patch("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingJoke = jokes.find((joke) => joke.id === id);
  if (!existingJoke) {
    return res.status(404).json({ error: \`Joke with id \${id} not found.\` });
  }
  const replacementJoke = {
    id: id,
    jokeText: req.body.text || existingJoke.jokeText,
    jokeType: req.body.type || existingJoke.jokeType,
  };
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  jokes[searchIndex] = replacementJoke;
  console.log(jokes[searchIndex]);
  res.json(replacementJoke);
});
` },
  7: { todo: `
// 7. DELETE a specific joke
//    TODO: remove it if it exists (200), otherwise reply 404 with a JSON error

`, done: `
// 7. DELETE a specific joke
app.delete("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  if (searchIndex > -1) {
    jokes.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: \`Joke with id \${id} not found. No jokes were deleted.\` });
  }
});
` },
  8: { todo: `
// 8. DELETE all jokes, but only for a caller who sends the master key: /all?key=...
//    TODO: compare req.query.key with masterKey

`, done: `
// 8. DELETE all jokes, but only for a caller who sends the master key: /all?key=...
app.delete("/all", (req, res) => {
  const userKey = req.query.key;
  if (userKey === masterKey) {
    jokes = [];
    res.sendStatus(200);
  } else {
    res.status(403).json({ error: "You are not authorised to perform this action." });
  }
});
` },
};

const TAIL = `
app.listen(port, () => {
  console.log(\`Successfully started server on port \${port}.\`);
});

var jokes = [
  { id: 1, jokeText: "Why did the volcano book a therapist? Too much pent-up pressure, and it kept blowing its top at work.", jokeType: "Science" },
  { id: 2, jokeText: "I opened a shop that only sells left shoes. Business is going all right. Well, all left.", jokeType: "Puns" },
  { id: 3, jokeText: "The geologist's dating profile said: looking for someone with a solid core and no faults.", jokeType: "Science" },
  { id: 4, jokeText: "The scissors and the wrapping paper had an argument. It was cut short.", jokeType: "Wordplay" },
  { id: 5, jokeText: "Why was the fraction nervous at the party? Everyone else seemed so whole.", jokeType: "Math" },
  { id: 6, jokeText: "The bakery staff went on strike. They were tired of working for crumbs.", jokeType: "Puns" },
  { id: 7, jokeText: "The lemon refused to apologise. It was never a very sweet character.", jokeType: "Food" },
  { id: 8, jokeText: "The tennis ball handed in its notice. It was tired of being served every single day.", jokeType: "Sports" },
  { id: 9, jokeText: "The film about a lost sock was a flop. The plot had too many holes.", jokeType: "Movies" },
  { id: 10, jokeText: "My houseplant asked for the night shift. It says the desk lamp pays better than the sun.", jokeType: "Science" },
  { id: 11, jokeText: "The orchestra fired its triangle player. His remarks were far too pointed.", jokeType: "Wordplay" },
  { id: 12, jokeText: "The calculator booked a holiday. It needed a break from everyone else's problems.", jokeType: "Math" },
  { id: 13, jokeText: "The soup told the spoon a secret. By dinner, the whole kitchen was stirred up.", jokeType: "Food" },
  { id: 14, jokeText: "Our swimming coach never shouts. She just makes waves.", jokeType: "Sports" },
  { id: 15, jokeText: "The beekeeper quit social media. Too much buzz, not enough honey.", jokeType: "Puns" },
  { id: 16, jokeText: "In the courtroom drama, the sleepy lawyer stole the show. He kept resting his case.", jokeType: "Movies" },
  { id: 17, jokeText: "I tried writing a book in invisible ink. Nobody could see where the story was going.", jokeType: "Wordplay" },
];
`;

// stage: which routes are written; extra: override a fragment (e.g. { 4: 'safer' })
function jokesApi(doneUpTo, extra) {
  extra = extra || {};
  let code = HEAD;
  for (let n = 1; n <= 8; n++) code += n <= doneUpTo ? R[n][extra[n] || 'done'] : R[n].todo;
  return code + TAIL;
}

const PKG = `{
  "name": "diy-joke-api",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2"
  }
}
`;


/* ---------- 234 ---------- */
PG.add({
  id:'l234', index:234, udemyId:39461822, minutes:18, section:'s30', slug:'building-your-own-apis', kind:'read',
  title:'Building your own APIs',
  blurb:'Why build an API at all? Because people will pay for access to data you have collected, to an algorithm that is hard to reproduce, or to a simple interface over something complicated. The lecture then pins down what makes an API <b>RESTful</b>: standard HTTP methods, a standard response format (usually JSON), separate client and server, <b>stateless</b> requests, and resources addressed by URL.',
  links:[
    { title:'RapidAPI Hub', url:'https://rapidapi.com/hub', note:'a marketplace of free and paid APIs' },
    { title:'Domino’s Pizza API (Node.js, open source)', url:'https://github.com/RIAEvangelist/node-dominos-pizza-api', note:'the open-source API the lecture uses as an example' },
  ],
  explore:[{
    title:'Stateless or stateful?', height:470,
    note:'Two clients read jokes in order. Click their buttons in any order you like. The stateful server keeps one shared “next” pointer, so the clients steal jokes from each other. In the stateless design each request says exactly which joke it wants, so the server needs no memory at all.',
    html:`
<h4>Stateful design: GET /next (the server remembers one position)</h4>
<div class="knobs"><button data-s="sf" data-c="A">Client A asks</button><button data-s="sf" data-c="B">Client B asks</button></div>
<pre class="readout" id="sf"></pre>
<h4>Stateless design: GET /jokes/:id (each client says what it wants)</h4>
<div class="knobs"><button data-s="sl" data-c="A">Client A asks</button><button data-s="sl" data-c="B">Client B asks</button></div>
<pre class="readout" id="sl"></pre>
<div class="knobs"><button id="reset">reset both</button></div>
<script>
  var st;
  var $ = function (id) { return document.getElementById(id); };
  function reset() { st = { pos: 1, sf: { A: 0, B: 0 }, sl: { A: 0, B: 0 }, logSf: [], logSl: [] }; paint(); }
  function ask(s, c) {
    if (s === 'sf') {
      var got = st.pos++, want = st.sf[c] + 1, note = '';
      if (got > want) note = '   ✗ client ' + c + ' never saw ' + (got - want === 1 ? 'joke ' + want : 'jokes ' + want + '–' + (got - 1));
      st.logSf.push('client ' + c + '  GET /next        → joke ' + got + note);
      st.sf[c] = got;
    } else {
      var next = st.sl[c] + 1;
      st.logSl.push('client ' + c + '  GET /jokes/' + next + (next < 10 ? ' ' : '') + '    → joke ' + next + '   ✓');
      st.sl[c] = next;
    }
    paint();
  }
  function paint() {
    $('sf').textContent = (st.logSf.length ? st.logSf.join('\\n') + '\\n\\n' : '') + 'server memory: next = ' + st.pos + ' (shared by everyone)';
    $('sl').textContent = (st.logSl.length ? st.logSl.join('\\n') + '\\n\\n' : '') + 'server memory: nothing. Each client keeps its own place.';
  }
  document.querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { ask(b.getAttribute('data-s'), b.getAttribute('data-c')); }; });
  $('reset').onclick = reset;
  reset();
<\/script>`,
  }],
  quiz:[
    { q:'Which of these is one of the REST constraints?', options:['The server remembers what each client asked for last','Client and server must run on the same machine','Every request carries everything the server needs to answer it','Responses must be HTML pages'], answer:2, why:'Statelessness keeps the server simple and lets it serve many clients; any context travels with the request.' },
    { q:'An API turns a 300-line spreadsheet integration into one endpoint with two parameters. Where does its value come from?', options:['A rare dataset','An expensive algorithm','A simplified interface','Free hosting'], answer:2, why:'Wrapping something awkward behind a few parameters is one of the three reasons an API is worth paying for.' },
    { q:'Your Express back end is only called by your own front end and has no docs. Is it safe from outsiders?', options:['No: without authentication, anyone who discovers the endpoints can call them','Yes, undocumented routes are hidden','Yes, browsers block other callers','Only if it uses POST'], answer:0, why:'Internal APIs get reverse-engineered all the time; obscurity is not protection.' },
    { q:'Which request reads joke 5 the RESTful way?', options:['POST /getJoke?id=5','PUT /jokes','GET /deleteJoke/5','GET /jokes/5'], answer:3, why:'The resource lives at a URL (/jokes/5) and the HTTP method (GET) says what to do with it.' },
    { q:'What is the “representation” in Representational State Transfer?', options:['The HTML of the home page','The format a resource is sent in, most often JSON','A drawing of the API','The server’s database schema'], answer:1, why:'The server sends a representation of the resource, such as a JSON object, rather than the resource itself.' },
  ],
});


/* ---------- 235 ---------- */
PG.add({
  id:'l235', index:235, udemyId:39461828, minutes:21, section:'s30', slug:'get-routes', kind:'node',
  title:'Creating GET Routes',
  blurb:'Now you are the API. Starting from a <code>jokes</code> array, write the three read endpoints: <code>GET /random</code>, <code>GET /jokes/:id</code> with a <b>path parameter</b> (<code>req.params</code>) and <code>GET /filter?type=</code> with a <b>query parameter</b> (<code>req.query</code>). Every reply goes out with <code>res.json</code>, and you test it all from the Postman tab.',
  tasks:[
    'Press <b>▶ Run</b> and, in the <b>Postman</b> tab, send <code>GET http://localhost:3000/random</code>. You get <i>Cannot GET /random</i>: no route exists yet.',
    'Challenge 1: write <code>app.get("/random", …)</code>. Pick an index with <code>Math.floor(Math.random() * jokes.length)</code> and send that joke with <code>res.json</code>. Run again and send it a few times.',
    'Challenge 2: write <code>app.get("/jokes/:id", …)</code>. <code>req.params.id</code> is a string, so convert it with <code>parseInt</code> before comparing with <code>===</code> inside <code>jokes.find(…)</code>. Try <code>/jokes/2</code>.',
    'Challenge 3: write <code>app.get("/filter", …)</code> that reads <code>req.query.type</code> and replies with <code>jokes.filter(…)</code>. Try <code>/filter?type=Puns</code>, then <code>?type=puns</code>: the match is case-sensitive.',
    'Bonus: when no joke has the requested id, reply <code>res.status(404).json({ error: … })</code> instead of an empty 200. Check with <code>/jokes/999</code>.'
  ],
  run:['index.js'],
  start:'/random',
  smoke:[
    { method:'GET', path:'/random', expect:200 },
    { method:'GET', path:'/jokes/2', expect:200 },
    { method:'GET', path:'/filter?type=Puns', expect:200 },
    { method:'GET', path:'/jokes/999', expect:404 },
  ],
  files:{ 'index.js': jokesApi(0), 'package.json': PKG },
  solution:{ 'index.js': jokesApi(3) },
  explore:[{
    title:'Which route matches, and what lands in req.params and req.query?', height:470,
    note:'Type a path or press a preset. The panel matches it against the three GET routes the way Express does, shows what the handler receives, and why the id has to go through parseInt before === can match.',
    html:`
<div class="knobs">
  <label>GET http://localhost:3000<input id="path" type="text" value="/jokes/2" style="width:210px"></label>
</div>
<div class="knobs">
  <button data-p="/random">/random</button>
  <button data-p="/jokes/2">/jokes/2</button>
  <button data-p="/jokes/two">/jokes/two</button>
  <button data-p="/filter?type=Puns">/filter?type=Puns</button>
  <button data-p="/filter?type=puns">/filter?type=puns</button>
  <button data-p="/jokes?id=2">/jokes?id=2</button>
</div>
<pre class="readout" id="out" style="max-height:300px;overflow:auto"></pre>
<script>
  var JOKES = [
    { id: 1, jokeText: "Why did the volcano book a therapist? Too much pent-up pressure, and it kept blowing its top at work.", jokeType: "Science" },
    { id: 2, jokeText: "I opened a shop that only sells left shoes. Business is going all right. Well, all left.", jokeType: "Puns" },
    { id: 3, jokeText: "The geologist's dating profile said: looking for someone with a solid core and no faults.", jokeType: "Science" },
    { id: 4, jokeText: "The scissors and the wrapping paper had an argument. It was cut short.", jokeType: "Wordplay" },
    { id: 5, jokeText: "Why was the fraction nervous at the party? Everyone else seemed so whole.", jokeType: "Math" },
    { id: 6, jokeText: "The bakery staff went on strike. They were tired of working for crumbs.", jokeType: "Puns" }
  ];
  var ROUTES = ['/random', '/jokes/:id', '/filter'];
  var $ = function (id) { return document.getElementById(id); };
  function run() {
    var raw = $('path').value.trim();
    if (raw.charAt(0) !== '/') raw = '/' + raw;
    var u = new URL('http://localhost:3000' + raw), segs = u.pathname.split('/').filter(Boolean), query = {}, hit = null, params = {};
    u.searchParams.forEach(function (v, k) { query[k] = v; });
    ROUTES.forEach(function (r) {
      if (hit) return;
      var rs = r.split('/').filter(Boolean), p = {};
      if (rs.length !== segs.length) return;
      var ok = rs.every(function (s, i) { if (s.charAt(0) === ':') { p[s.slice(1)] = decodeURIComponent(segs[i]); return true; } return s === segs[i]; });
      if (ok) { hit = r; params = p; }
    });
    var L = [];
    if (!hit) {
      L.push('no route matches  →  404 "Cannot GET ' + u.pathname + '"');
      if (u.pathname === '/jokes') L.push('', '?id=2 is a query parameter: it would arrive in req.query.id,', 'but no route is registered for plain /jokes.');
      $('out').textContent = L.join('\\n'); return;
    }
    L.push('matched     app.get("' + hit + '", ...)');
    L.push('req.params  ' + JSON.stringify(params));
    L.push('req.query   ' + JSON.stringify(query));
    L.push('');
    if (hit === '/jokes/:id') {
      var id = params.id, n = parseInt(id);
      L.push('typeof req.params.id         → "' + typeof id + '"');
      L.push('"' + id + '" === ' + (isNaN(n) ? 2 : n) + '                → false (a string is never === a number)');
      L.push('parseInt("' + id + '")              → ' + n);
      var found = JOKES.filter(function (j) { return j.id === n; })[0];
      L.push('');
      L.push(found ? 'res.json(found) →\\n' + JSON.stringify(found, null, 2) : 'find() → undefined. Without a check, the client gets an empty 200; better: res.status(404).json({ error: ... })');
    } else if (hit === '/filter') {
      var list = JOKES.filter(function (j) { return j.jokeType === query.type; });
      L.push('jokes.filter(joke => joke.jokeType === ' + JSON.stringify(query.type) + ')');
      L.push('res.json(...) → ' + JSON.stringify(list, null, 2) + (list.length ? '' : '   (empty: the comparison is case-sensitive)'));
    } else {
      var i = Math.floor(Math.random() * JOKES.length);
      L.push('Math.floor(Math.random() * ' + JOKES.length + ') → ' + i);
      L.push('res.json(jokes[' + i + ']) →\\n' + JSON.stringify(JOKES[i], null, 2));
    }
    $('out').textContent = L.join('\\n');
  }
  $('path').addEventListener('input', run);
  document.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { $('path').value = b.getAttribute('data-p'); run(); }; });
  run();
<\/script>`,
  }],
  quiz:[
    { q:'For <code>GET /jokes/7</code>, where does the 7 arrive and in what form?', options:['req.params.id, as the string "7"','req.query.id, as the number 7','req.body.id, as a string','req.params.id, as the number 7'], answer:0, why:'Path parameters come from the URL itself, and everything in a URL is text.' },
    { q:'Why does <code>jokes.find(joke =&gt; joke.id === req.params.id)</code> never find anything?', options:['find only works on strings','The array is not sorted','req.params is empty for GET requests','"7" === 7 is false, because strict equality also compares types'], answer:3, why:'Convert first, parseInt(req.params.id), then compare with ===.' },
    { q:'What is the difference between <code>find</code> and <code>filter</code>?', options:['None','filter changes the original array','find returns the first matching element (or undefined); filter returns a new array of every match','find returns the index'], answer:2, why:'One joke by id → find. All jokes of a type → filter (possibly an empty array).' },
    { q:'What does <code>res.json(obj)</code> do?', options:['Saves obj to a file','Renders obj with EJS','Parses a JSON request body','Serialises obj to JSON and sends it with a JSON content type'], answer:3, why:'It is the API equivalent of res.render: the client receives JSON text it can parse.' },
  ],
});


/* ---------- 236 ---------- */
PG.add({
  id:'l236', index:236, udemyId:39461834, minutes:15, section:'s30', slug:'post-put-patch-routes', kind:'node',
  title:'Creating POST, PUT, and PATCH Routes',
  blurb:'The write endpoints: <code>POST /jokes</code> adds a joke, <code>PUT /jokes/:id</code> replaces one completely, and <code>PATCH /jokes/:id</code> changes only the fields you send. New values arrive as the form fields <code>text</code> and <code>type</code>, which body-parser puts in <code>req.body</code>.',
  tasks:[
    'Challenge 4: write <code>app.post("/jokes", …)</code>. Build <code>{ id: jokes.length + 1, jokeText: req.body.text, jokeType: req.body.type }</code>, push it, log <code>jokes.slice(-1)</code> and reply with the new joke.',
    'Test it in the <b>Postman</b> tab: method POST, URL <code>http://localhost:3000/jokes</code>, body <i>x-www-form-urlencoded</i> with a <code>text=…</code> line and a <code>type=…</code> line. The reply shows id 18.',
    'Challenge 5: write <code>app.put("/jokes/:id", …)</code>. Build the replacement from the id and both body fields, find its position with <code>findIndex</code>, overwrite that slot and reply with it. PUT joke 2 with only <code>type</code> filled in: <code>jokeText</code> disappears, because PUT replaces everything.',
    'Challenge 6: write <code>app.patch("/jokes/:id", …)</code>. Find the existing joke and keep any field that was not sent: <code>req.body.text || existingJoke.jokeText</code>. PATCH joke 2 with just <code>type=Agriculture</code>.',
    'After each change, send <code>GET /jokes/2</code> to confirm what is stored.',
    'Bonus: make PUT and PATCH answer 404 with a JSON error when the id does not exist. Right now PATCH on <code>/jokes/999</code> crashes on <code>existingJoke.jokeText</code>.'
  ],
  run:['index.js'],
  start:'/jokes/2',
  smoke:[
    { method:'POST', path:'/jokes', body:{ text:'My pencil retired. It felt there was no point any more.', type:'Puns' }, expect:200 },
    { method:'GET', path:'/jokes/18', expect:200 },
    { method:'PUT', path:'/jokes/2', body:{ text:'The shoe shop now sells pairs. Business is looking up and down.', type:'Puns' }, expect:200 },
    { method:'PATCH', path:'/jokes/2', body:{ type:'Agriculture' }, expect:200 },
    { method:'GET', path:'/jokes/2', expect:200 },
    { method:'PUT', path:'/jokes/999', body:{ text:'x', type:'y' }, expect:404 },
    { method:'PATCH', path:'/jokes/999', body:{ type:'y' }, expect:404 },
  ],
  files:{ 'index.js': jokesApi(3), 'package.json': PKG },
  solution:{ 'index.js': jokesApi(6) },
  quiz:[
    { q:'Why does the POST route depend on <code>app.use(bodyParser.urlencoded(…))</code>?', options:['It parses the form-encoded body into req.body; without it req.body.text is undefined','It adds the id','It turns the reply into JSON','It is only needed for GET'], answer:0, why:'The body arrives as text like text=...&type=...; the parser turns it into an object.' },
    { q:'Which method should change only the type of joke 2?', options:['POST','PUT','PATCH','GET'], answer:2, why:'PATCH is a partial update. PUT would need every field, or the missing ones get wiped.' },
    { q:'<code>findIndex</code> returns -1. What does <code>jokes[-1] = replacement</code> do?', options:['Replaces the last joke','Throws an error','Quietly adds a property called "-1" and replaces nothing','Replaces the first joke'], answer:2, why:'Arrays do not count from the end with -1, so check the index before writing.' },
    { q:'In <code>req.body.text || existingJoke.jokeText</code>, when is the stored text kept?', options:['Always','When req.body.text is missing or empty (falsy)','Only when the id is wrong','When the type changes'], answer:1, why:'|| returns the right-hand side whenever the left-hand side is falsy, which is what makes PATCH leave unsent fields alone.' },
  ],
});


/* ---------- 237 ---------- */
PG.add({
  id:'l237', index:237, udemyId:39461844, minutes:7, section:'s30', slug:'delete-routes', kind:'node',
  title:'Creating the DELETE Route',
  blurb:'Two ways to remove data. <code>DELETE /jokes/:id</code> splices one joke out of the array, or answers 404. <code>DELETE /all</code> empties the whole collection, but only when the request carries the server’s master key as <code>?key=</code>: a first, very simple way of guarding a dangerous endpoint.',
  tasks:[
    'Challenge 7: write <code>app.delete("/jokes/:id", …)</code>. Find the index; if it is greater than -1, <code>jokes.splice(index, 1)</code> and <code>res.sendStatus(200)</code>; otherwise reply 404 with a JSON error.',
    'In the <b>Postman</b> tab send <code>DELETE http://localhost:3000/jokes/3</code>, then <code>GET /jokes/3</code> to see it is gone. Delete an id that does not exist as well.',
    'Challenge 8: write <code>app.delete("/all", …)</code>. Compare <code>req.query.key</code> with <code>masterKey</code>: on a match set <code>jokes = []</code> and send 200 (this is why <code>jokes</code> is declared with <code>var</code>, not <code>const</code>).',
    'For a wrong or missing key reply with status 403 and <code>{ error: "You are not authorised to perform this action." }</code>. The lecture uses 404 here; 403 Forbidden says what actually happened.',
    'Send <code>DELETE /all</code> with no key, with a wrong key and with the right one (copy it from the top of the file), then <code>GET /filter?type=Puns</code>.',
    'Bonus: now that jokes can disappear, <code>jokes.length + 1</code> can hand out an id that is still in use. Change POST to use the highest existing id + 1.'
  ],
  run:['index.js'],
  start:'/jokes/3',
  smoke:[
    { method:'DELETE', path:'/jokes/3', expect:200 },
    { method:'GET', path:'/jokes/3', expect:404 },
    { method:'DELETE', path:'/jokes/999', expect:404 },
    { method:'POST', path:'/jokes', body:{ text:'The new joke gets a fresh id.', type:'Wordplay' }, expect:200 },
    { method:'GET', path:'/jokes/18', expect:200 },
    { method:'DELETE', path:'/all', expect:403 },
    { method:'DELETE', path:'/all?key=wrong-key', expect:403 },
    { method:'DELETE', path:'/all?key=8R2QK7M-3HZW5TD-Q9XNB4C-J6LP2VE', expect:200 },
    { method:'GET', path:'/filter?type=Puns', expect:200 },
  ],
  files:{ 'index.js': jokesApi(6), 'package.json': PKG },
  solution:{ 'index.js': jokesApi(8, { 4: 'safer' }) },
  quiz:[
    { q:'Why check <code>searchIndex &gt; -1</code> before calling <code>splice</code>?', options:['splice(-1, 1) would delete the last joke instead of nothing','splice is slow','findIndex never returns -1','To make the reply faster'], answer:0, why:'A negative start counts from the end of the array, so a missing id would silently delete someone else’s joke.' },
    { q:'Why must <code>jokes</code> be declared with <code>var</code> or <code>let</code>?', options:['Arrays cannot be const','Express requires it','For speed','DELETE /all reassigns it with jokes = [], which const forbids'], answer:3, why:'const allows changing the array’s contents (push, splice) but not pointing the name at a new array.' },
    { q:'Which status code best fits a request with the wrong master key?', options:['200 OK','404 Not Found','403 Forbidden','500 Internal Server Error'], answer:2, why:'The route exists and the server understood the request; the caller simply is not allowed (401 is also common).' },
    { q:'What is weak about sending the key as <code>?key=…</code>?', options:['Nothing','Query strings cannot hold dashes','URLs end up in server logs and browser history, so the secret leaks easily','DELETE requests cannot have a query string'], answer:2, why:'Real APIs send secrets in headers over HTTPS and use proper authentication, covered later in the course.' },
  ],
});


/* ---------- 238 ---------- */
const POSTS = `let posts = [
  {
    id: 1,
    title: "Why I Keep a Paper Notebook Next to My Keyboard",
    content:
      "Before I write a line of code I sketch the problem on paper: the inputs, the outputs and the awkward cases in between. Ten minutes with a pen saves me an hour of undoing clever code that solved the wrong problem. The notebook is also where I park ideas that would otherwise derail the task in front of me.",
    author: "Priya Natarajan",
    date: "2024-03-02T09:30:00Z",
  },
  {
    id: 2,
    title: "Five Small Habits That Made My Code Easier to Read",
    content:
      "Name things after what they mean, not how they are stored. Keep functions short enough to fit on one screen. Delete commented-out code instead of hoarding it. Write the error message you would want to read at two in the morning. And read your own pull request once more, slowly, before asking anyone else to.",
    author: "Tom Okafor",
    date: "2024-03-09T14:15:00Z",
  },
  {
    id: 3,
    title: "What Building a Bird Feeder Taught Me About Shipping",
    content:
      "My first bird feeder was wonky, but the birds did not care. They cared that it existed and had seeds in it. Software is the same: a small, working version in people's hands teaches you more than a perfect plan in a drawer. Ship the wonky feeder, watch who visits, then improve it.",
    author: "Lena Fischer",
    date: "2024-03-16T08:45:00Z",
  },
];

let lastId = 3;
`;

PG.add({
  id:'l238', index:238, udemyId:39461864, minutes:15, section:'s30', slug:'blog-api', kind:'node', project:true,
  title:'Build your own API for a Blog',
  blurb:'The module’s project joins everything together: a ready-made website (<code>server.js</code>, port 3000) talks over Axios to the API you write (<code>index.js</code>, port 4000). Implement the five routes the website relies on: list all posts, read one, create, partially update and delete. The data lives in an array, so it resets whenever the server restarts.',
  tasks:[
    'Press <b>▶ Run</b>. Both servers start (the course needs two terminals for this). The Browser shows <code>Error fetching posts</code>: the website asked the API on port 4000 for <code>/posts</code>, and that route does not exist yet. Skim <code>server.js</code> to see every API call it makes.',
    'Challenge 1: <code>GET /posts</code> replies with the whole array. Reload the Browser tab and the three posts appear.',
    'Challenge 2: <code>GET /posts/:id</code>: <code>parseInt</code> the id and <code>find</code> the post; reply 404 with <code>{ message: "Post not found" }</code> when there is none. The <b>Edit</b> buttons depend on it.',
    'Challenge 3: <code>POST /posts</code>: add 1 to <code>lastId</code>, build a post from <code>req.body.title</code>, <code>content</code> and <code>author</code> plus <code>date: new Date()</code>, push it and reply <code>res.status(201).json(post)</code>. Try <b>New Post</b>.',
    'Challenge 4: <code>PATCH /posts/:id</code>: overwrite only the fields that arrived with a value, then reply with the post (404 if it does not exist). Edit just a title.',
    'Challenge 5: <code>DELETE /posts/:id</code>: <code>findIndex</code>; reply 404 when it is -1, otherwise <code>splice</code> the post out and reply <code>{ message: "Post deleted" }</code>. Click <b>Delete</b>.',
    'Call the API directly from the <b>Postman</b> tab: <code>GET http://localhost:4000/posts/1</code>, then a POST to <code>/posts</code> with a raw JSON body (<code>bodyParser.json()</code> is already registered).'
  ],
  run:['index.js', 'server.js'],
  port:3000,
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/posts', port:4000, expect:200 },
    { method:'GET', path:'/posts/1', port:4000, expect:200 },
    { method:'GET', path:'/posts/99', port:4000, expect:404 },
    { method:'POST', path:'/posts', port:4000, json:{ title:'Sent as JSON', content:'Straight to the API from Postman.', author:'Test Author' }, expect:201 },
    { method:'PATCH', path:'/posts/1', port:4000, json:{ title:'A New Title Only' }, expect:200 },
    { method:'GET', path:'/new', expect:200 },
    { method:'GET', path:'/edit/1', expect:200 },
    { method:'POST', path:'/api/posts', body:{ title:'Hello from the form', content:'Created through the website.', author:'Form User' }, expect:302 },
    { method:'POST', path:'/api/posts/2', body:{ title:'', content:'Only the content changed.', author:'' }, expect:302 },
    { method:'GET', path:'/api/posts/delete/3', expect:302 },
    { method:'DELETE', path:'/posts/3', port:4000, expect:404 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store: everything resets when the server restarts
${POSTS}
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Write your code here //

// CHALLENGE 1: GET all posts

// CHALLENGE 2: GET a specific post by id
//   (reply 404 with { message: "Post not found" } when it does not exist)

// CHALLENGE 3: POST a new post
//   (title, content, author from req.body; id from lastId; date: new Date())

// CHALLENGE 4: PATCH a post: change only the fields that were sent

// CHALLENGE 5: DELETE a specific post by id


app.listen(port, () => {
  console.log(\`API is running at http://localhost:\${port}\`);
});
`,
'server.js':`// The website (port 3000). It is finished: it calls YOUR API on port 4000 with axios.
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(\`\${API_URL}/posts\`);
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the page for a new post
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Route to render the edit page
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(\`\${API_URL}/posts/\${req.params.id}\`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(\`\${API_URL}/posts\`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  try {
    const response = await axios.patch(\`\${API_URL}/posts/\${req.params.id}\`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(\`\${API_URL}/posts/\${req.params.id}\`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(\`Website is running on http://localhost:\${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="container">
    <h1>My Blog</h1>
    <a id="newPostBtn" href="/new">New Post</a>
    <ul id="postsList">
      <% posts.forEach((post) => { %>
        <li>
          <h2><%= post.title %></h2>
          <small><%= new Date(post.date).toDateString() %></small>
          <p><%= post.content %></p>
          <small>By: <%= post.author %></small>
          <a class="edit" href="/edit/<%= post.id %>">Edit</a>
          <a class="delete" href="/api/posts/delete/<%= post.id %>">Delete</a>
        </li>
      <% }); %>
    </ul>
  </div>
</body>
</html>
`,
'views/modify.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Blog</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="container">
    <h1><%= heading %></h1>

    <% if (locals.post) { %>
      <form id="editForm" method="post" action="/api/posts/<%= post.id %>">
        <input type="text" name="title" value="<%= post.title %>">
        <textarea name="content" rows="10"><%= post.content %></textarea>
        <input type="text" name="author" value="<%= post.author %>">
        <button class="full-width" type="submit"><%= submit %></button>
      </form>
    <% } else { %>
      <form id="newPostForm" method="post" action="/api/posts">
        <input type="text" name="title" placeholder="Title" required>
        <textarea name="content" placeholder="Content" required rows="10"></textarea>
        <input type="text" name="author" placeholder="Author" required>
        <button class="full-width" type="submit"><%= submit %></button>
      </form>
    <% } %>
  </div>
</body>
</html>
`,
'public/styles/main.css':`body, h1, h2, p, ul, li, form, input, textarea, a {
  margin: 0;
  padding: 0;
}

body {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.6;
  color: #2d2a26;
  background: #f6f4ef;
}

.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 20px 60px;
}

h1 {
  margin-bottom: 20px;
  font-size: 2.2rem;
  color: #1f3a5f;
}

h2 {
  margin-bottom: 6px;
  font-size: 1.35rem;
}

p, input, textarea {
  font-size: 1rem;
}

small {
  display: block;
  margin-bottom: 10px;
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  color: #8a8174;
}

input, textarea {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 14px;
  padding: 10px 12px;
  font-family: inherit;
  background: #ffffff;
  border: 1px solid #d8d2c6;
  border-radius: 6px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #1f3a5f;
}

a, button {
  display: inline-block;
  padding: 8px 14px;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  color: #ffffff;
  text-decoration: none;
  background: #1f3a5f;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

a:hover, button:hover {
  background: #2f5a8f;
}

button.full-width {
  width: 100%;
  padding: 12px;
}

ul {
  list-style: none;
}

li {
  padding: 20px 0;
  border-bottom: 1px solid #e4ded3;
}

li:last-child {
  border-bottom: none;
}

a.delete {
  margin-left: 6px;
  background: #b23a3a;
}

a.delete:hover {
  background: #d14b4b;
}

#newPostBtn {
  margin-bottom: 24px;
  background: #3c7a4a;
}

#newPostBtn:hover {
  background: #4d9a5e;
}
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store: everything resets when the server restarts
${POSTS}
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CHALLENGE 1: GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// CHALLENGE 3: POST a new post
app.post("/posts", (req, res) => {
  lastId += 1;   // a counter, so ids are never reused after a delete
  const post = {
    id: lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  posts.push(post);
  res.status(201).json(post);
});

// CHALLENGE 4: PATCH a post: change only the fields that were sent
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

// CHALLENGE 5: DELETE a specific post by id
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(\`API is running at http://localhost:\${port}\`);
});
`},
  quiz:[
    { q:'Why does localhost:3000 show “Error fetching posts” before you write any routes?', options:['server.js asks the API on port 4000 for /posts; until that route exists the Axios call fails and the catch block replies','The website has a bug','EJS is missing','Port 3000 is blocked'], answer:0, why:'The website is just another client of your API. Its error handler turns the failed call into that message.' },
    { q:'In the course you start <code>solution.js</code> and then <code>index.js</code>, both on port 4000. What happens?', options:['Both run and share the traffic','The first one stops','The second one picks port 4001 automatically','The second one crashes with EADDRINUSE: only one process can own a port'], answer:3, why:'Stop one API (Ctrl+C) before starting the other.' },
    { q:'Why use a <code>lastId</code> counter instead of <code>posts.length + 1</code> for new ids?', options:['It is faster','After a delete, length + 1 can repeat an id that still exists; a counter only goes up','posts.length is not allowed in Express','So that ids are strings'], answer:1, why:'Delete post 2 of 3 and length + 1 gives 3 again, a duplicate.' },
    { q:'The edit form submits to <code>/api/posts/2</code> on the website. What does your API receive?', options:['A PATCH /posts/2 with the form fields as the body, sent by server.js through axios.patch','A POST /api/posts/2','A PUT /posts/2','Nothing: the browser calls the API directly'], answer:0, why:'HTML forms can only GET or POST, so the website translates the form submission into the right API verb.' },
  ],
});


/* ---------- 239 ---------- */
PG.add({
  id:'l239', index:239, udemyId:18113037, minutes:2, section:'s30', slug:'tip-getting-a-job', kind:'read',
  title:'Tip from Angela - How to Get a Job as Programmer',
  blurb:'Most employers care more about what you can do than where you studied. Read job ads for the skills they ask for, build portfolio projects that prove those skills, and show you can work with others: answer questions in forums or the course Q&amp;A, and ask more experienced developers to review your code.',
  quiz:[
    { q:'According to the tip, what convinces most employers?', options:['A degree from a famous university','A long CV','The number of courses completed','Evidence of skills, such as portfolio projects that match job ads, plus signs that you work well with others'], answer:3, why:'A few employers filter on degrees, but most look for demonstrated skills and teamwork.' },
  ],
});

})();
