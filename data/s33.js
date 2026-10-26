/* ===== Section 33 — PostgreSQL ===== */
(function () {

/* ---------- shared data and helpers (kept inside this function so nothing leaks into other sections) ---------- */

/* Countries for the Travel Tracker lessons (255–257, 261): ISO code, the name stored in the
   countries lookup table (a few use the long official form, which is what Part 3 is about),
   the short name shown on the tile, and the continent the tile sits under. */
const WORLD = [
  ['AT', 'Austria', 'Austria', 'Europe'],
  ['BE', 'Belgium', 'Belgium', 'Europe'],
  ['CH', 'Switzerland', 'Switzerland', 'Europe'],
  ['DE', 'Germany', 'Germany', 'Europe'],
  ['DK', 'Denmark', 'Denmark', 'Europe'],
  ['ES', 'Spain', 'Spain', 'Europe'],
  ['FI', 'Finland', 'Finland', 'Europe'],
  ['FR', 'France', 'France', 'Europe'],
  ['GB', 'United Kingdom', 'United Kingdom', 'Europe'],
  ['GR', 'Greece', 'Greece', 'Europe'],
  ['IE', 'Ireland', 'Ireland', 'Europe'],
  ['IS', 'Iceland', 'Iceland', 'Europe'],
  ['IT', 'Italy', 'Italy', 'Europe'],
  ['NL', 'Netherlands', 'Netherlands', 'Europe'],
  ['NO', 'Norway', 'Norway', 'Europe'],
  ['PL', 'Poland', 'Poland', 'Europe'],
  ['PT', 'Portugal', 'Portugal', 'Europe'],
  ['RU', 'Russian Federation', 'Russia', 'Europe'],
  ['SE', 'Sweden', 'Sweden', 'Europe'],
  ['UA', 'Ukraine', 'Ukraine', 'Europe'],
  ['AE', 'United Arab Emirates', 'United Arab Emirates', 'Asia'],
  ['CN', 'China', 'China', 'Asia'],
  ['ID', 'Indonesia', 'Indonesia', 'Asia'],
  ['IN', 'India', 'India', 'Asia'],
  ['JP', 'Japan', 'Japan', 'Asia'],
  ['KR', 'Korea, Republic of', 'South Korea', 'Asia'],
  ['MY', 'Malaysia', 'Malaysia', 'Asia'],
  ['NP', 'Nepal', 'Nepal', 'Asia'],
  ['PH', 'Philippines', 'Philippines', 'Asia'],
  ['SG', 'Singapore', 'Singapore', 'Asia'],
  ['TH', 'Thailand', 'Thailand', 'Asia'],
  ['VN', 'Viet Nam', 'Vietnam', 'Asia'],
  ['EG', 'Egypt', 'Egypt', 'Africa'],
  ['ET', 'Ethiopia', 'Ethiopia', 'Africa'],
  ['GH', 'Ghana', 'Ghana', 'Africa'],
  ['KE', 'Kenya', 'Kenya', 'Africa'],
  ['MA', 'Morocco', 'Morocco', 'Africa'],
  ['NG', 'Nigeria', 'Nigeria', 'Africa'],
  ['SN', 'Senegal', 'Senegal', 'Africa'],
  ['TZ', 'Tanzania, United Republic of', 'Tanzania', 'Africa'],
  ['ZA', 'South Africa', 'South Africa', 'Africa'],
  ['CA', 'Canada', 'Canada', 'North America'],
  ['CR', 'Costa Rica', 'Costa Rica', 'North America'],
  ['CU', 'Cuba', 'Cuba', 'North America'],
  ['JM', 'Jamaica', 'Jamaica', 'North America'],
  ['MX', 'Mexico', 'Mexico', 'North America'],
  ['US', 'United States of America', 'United States', 'North America'],
  ['AR', 'Argentina', 'Argentina', 'South America'],
  ['BO', 'Bolivia, Plurinational State of', 'Bolivia', 'South America'],
  ['BR', 'Brazil', 'Brazil', 'South America'],
  ['CL', 'Chile', 'Chile', 'South America'],
  ['CO', 'Colombia', 'Colombia', 'South America'],
  ['PE', 'Peru', 'Peru', 'South America'],
  ['AU', 'Australia', 'Australia', 'Oceania'],
  ['FJ', 'Fiji', 'Fiji', 'Oceania'],
  ['NZ', 'New Zealand', 'New Zealand', 'Oceania'],
];
const CONTINENTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];
const NAME_OF = {}; WORLD.forEach(w => { NAME_OF[w[0]] = w[2]; });

/* A flag emoji is two "regional indicator" letters: F + R → 🇫🇷 (see lecture 251). */
const flagOf = code => String.fromCodePoint(...code.split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
const sq = s => "'" + String(s).replace(/'/g, "''") + "'";
const NL = '\n';

/* countries lookup table (lectures 256+), alphabetical by name like the course's countries.csv */
const COUNTRIES_SQL = 'CREATE TABLE countries (' + NL +
  '  id SERIAL PRIMARY KEY,' + NL +
  '  country_code CHAR(2),' + NL +
  '  country_name VARCHAR(100)' + NL +
  ');' + NL +
  'INSERT INTO countries (country_code, country_name) VALUES' + NL +
  WORLD.slice().sort((a, b) => (a[1] < b[1] ? -1 : 1)).map(w => '  (' + sq(w[0]) + ', ' + sq(w[1]) + ')').join(',' + NL) + ';';

/* The tile "map" that replaces the course's SVG world map: every tile's id is a country code. */
const TILE_MAP = '  <section class="tile-map">' + NL + CONTINENTS.map(cont =>
  '    <div class="continent">' + NL +
  '      <h3>' + cont + '</h3>' + NL +
  '      <div class="tiles">' + NL +
  WORLD.filter(w => w[3] === cont).map(w =>
    '        <div class="tile" id="' + w[0] + '" title="' + w[2] + '"><span class="flag">' + flagOf(w[0]) + '</span><span class="code">' + w[0] + '</span></div>').join(NL) + NL +
  '      </div>' + NL +
  '    </div>').join(NL) + NL + '  </section>';

const TRACKER_CSS = `html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
body {
  margin: 0;
  background: #21252b;
  color: #d3ddef;
  font-family: "Roboto", Arial, sans-serif;
}

form {
  display: flex;
}

input {
  font-family: inherit;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0;
  padding: 15px;
  font-size: 14px;
}

button {
  font-family: inherit;
  text-transform: uppercase;
  outline: 0;
  background: teal;
  border: 0;
  padding: 15px 24px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

/* The course shades countries on a big SVG world map. Here every country is a
   tile whose id is its two-letter code, so the page script can light it up. */
.tile-map {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
  padding: 24px 20px 80px;
}
.continent h3 {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #7d8597;
}
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 6px;
}
.tile {
  background: #383d46;
  border-radius: 6px;
  padding: 6px 0 4px;
  text-align: center;
  transition: background-color 0.5s;
}
.tile .flag {
  display: block;
  font-size: 22px;
  line-height: 1.2;
  filter: grayscale(1);
  opacity: 0.35;
  transition: 0.5s;
}
.tile .code {
  font-size: 11px;
  letter-spacing: 1px;
  color: #8a93a6;
}
.tile.visited .flag {
  filter: none;
  opacity: 1;
}
.tile.visited .code {
  color: #ffffff;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.total-count {
  position: fixed;
  left: 0;
  bottom: 0;
  margin: 0;
  padding: 15px 20px;
  color: #ffffff;
  background: rgba(33, 37, 43, 0.92);
}
`;

const TRACKER_EJS = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Travel Tracker</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>

<body>
  <form action="/add" method="post">
    <input type="text" name="country" autofocus placeholder="<%= locals.error ? error : 'Enter country name' %>">
    <button type="submit">Add</button>
  </form>

  <!-- One tile per country; the id of each tile is the country code (FR, GB, US ...) -->
${TILE_MAP}

  <h2 class="total-count">Total Countries: <%= total %></h2>

  <script>
    // EJS prints the array as plain text ("FR,GB,US"), so split it back into an array
    const country_codes = "<%= countries %>".split(",");
    console.log(typeof ("<%= countries %>"));
    country_codes.forEach((code) => {
      const tile = document.getElementById(code);
      if (tile) {
        tile.classList.add("visited");
        tile.style.backgroundColor = "teal";
      }
    });
  </script>
</body>

</html>
`;

const PKG = name => `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^1.20.2",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "pg": "^8.11.3"
  }
}
`;

/* Explore demo: a scratch Query Tool backed by a real Postgres (PGlite) seeded like the lesson.
   It is separate from the database the lesson's server uses. */
function queryTool(title, seed, sql, note) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return {
    title: title, height: 600,
    note: note,
    html: `
<div class="knobs">
  <button id="run">▶ Run</button>
  <button id="reset">Reset database</button>
  <span class="tag" id="st">starting Postgres…</span>
  <span style="font-size:12px;color:#5b6382">Select part of the text to run only that (Ctrl/Cmd+Enter works too).</span>
</div>
<textarea id="sql" spellcheck="false">${esc(sql)}</textarea>
<div id="out"></div>
<style>
  #sql { width: 100%; height: 210px; font: 12.5px/1.5 ui-monospace, Menlo, Consolas, monospace; padding: 10px 12px; border: 1px solid #dfe3ee; border-radius: 10px; margin: 0 0 12px; resize: vertical; }
  .res { background: #fff; border: 1px solid #dfe3ee; border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; overflow-x: auto; }
  .res pre { margin: 0 0 6px; font: 11.5px/1.45 ui-monospace, Menlo, monospace; color: #5b6382; white-space: pre-wrap; }
  .res.bad { border-color: #f1aeb5; background: #fff5f5; }
  .err { color: #b02a37; font: 12.5px ui-monospace, Menlo, monospace; }
  .ok { color: #0f5132; font-size: 12.5px; margin-top: 4px; }
  .null { color: #9aa1b5; font-style: italic; }
</style>
<script type="module">
  const SEED = ${JSON.stringify(seed)};
  const st = document.getElementById('st'), out = document.getElementById('out'), ta = document.getElementById('sql');
  const NL = String.fromCharCode(10);
  let db = null;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function split(src) {
    const list = []; let cur = '', q = false;
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (!q && c === '-' && src[i + 1] === '-') { const j = src.indexOf(NL, i); i = j < 0 ? src.length : j; cur += NL; continue; }
      if (c === "'") q = !q;
      if (c === ';' && !q) { if (cur.trim()) list.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim()) list.push(cur.trim());
    return list;
  }
  function cell(v) { return v === null || v === undefined ? '<span class="null">NULL</span>' : esc(typeof v === 'object' ? JSON.stringify(v) : v); }
  function table(r) {
    if (!r.fields || !r.fields.length) return '<div class="ok">OK' + (r.affectedRows ? ' — ' + r.affectedRows + ' row' + (r.affectedRows === 1 ? '' : 's') + ' affected' : '') + '</div>';
    return '<table class="grid"><tr>' + r.fields.map(f => '<th>' + esc(f.name) + '</th>').join('') + '</tr>' +
      r.rows.map(row => '<tr>' + r.fields.map(f => '<td>' + cell(row[f.name]) + '</td>').join('') + '</tr>').join('') + '</table>' +
      '<div class="ok" style="color:#5b6382">' + r.rows.length + ' row' + (r.rows.length === 1 ? '' : 's') + '</div>';
  }
  async function fresh() {
    st.textContent = 'starting Postgres…';
    if (db) { try { await db.close(); } catch (e) {} }
    const mod = await import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3.6/dist/index.js');
    db = new mod.PGlite(); await db.waitReady; await db.exec(SEED);
    st.textContent = 'Postgres ready';
  }
  async function run() {
    if (!db) return;
    const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    const stmts = split(sel.trim() ? sel : ta.value);
    let html = '';
    for (const s of stmts) {
      try { const r = await db.query(s); html += '<div class="res"><pre>' + esc(s) + '</pre>' + table(r) + '</div>'; }
      catch (e) { html += '<div class="res bad"><pre>' + esc(s) + '</pre><div class="err">ERROR: ' + esc(e.message) + '</div></div>'; }
    }
    out.innerHTML = html || '<p class="note">Nothing to run.</p>';
  }
  document.getElementById('run').onclick = run;
  document.getElementById('reset').onclick = async () => { await fresh(); out.innerHTML = ''; };
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(); } });
  fresh().catch(() => { st.textContent = 'Postgres could not load (are you online?)'; });
<\/script>`,
  };
}

/* ---------- 248 – 252 ---------- */

PG.add({
  id:'l248', index:248, udemyId:40494144, minutes:8, section:'s33', slug:'intro-to-postgres', kind:'read',
  title:'Introduction to Postgres',
  blurb:'Postgres is the database for the rest of the course: relational, free, open source and widely used. It runs as its own server. Your Express code talks to it through the <code>pg</code> package: create a <code>pg.Client</code> with the connection details, <code>connect()</code>, send SQL with <code>query()</code>, read the records from <code>result.rows</code>, and <code>end()</code> when you are finished.',
  links:[
    { title:'PostgreSQL', url:'https://www.postgresql.org/', note:'the database itself, with the full documentation' },
    { title:'node-postgres (pg)', url:'https://node-postgres.com/', note:'the npm package used from Node in this section' },
  ],
  explore:[{
    title:'One request, start to finish', height:420,
    note:'Step through a request for a month of blog posts. The browser never talks to Postgres: the Express app sits in the middle, sends the SQL and turns the rows it gets back into a response.',
    html:`
<div class="knobs">
  <button id="next">Next step ▶</button>
  <button id="again">Start again</button>
  <span class="tag" id="n">step 0 of 5</span>
</div>
<div class="stage">
  <div class="flow">
    <div class="node" id="b"><div class="ic">🧑‍💻</div><b>Browser</b><small>the client</small></div>
    <div class="arr" id="a1">→</div>
    <div class="node" id="e"><div class="ic">⚙️</div><b>Express</b><small>index.js + pg</small></div>
    <div class="arr" id="a2">→</div>
    <div class="node" id="p"><div class="ic">🐘</div><b>Postgres</b><small>its own server, port 5432</small></div>
  </div>
</div>
<pre class="readout" id="ro">Press "Next step".</pre>
<style>
  .flow { display: flex; align-items: center; justify-content: center; gap: 10px; }
  .node { text-align: center; padding: 12px 14px; border: 2px solid #dfe3ee; border-radius: 12px; min-width: 120px; transition: 0.3s; }
  .node .ic { font-size: 30px; }
  .node small { display: block; color: #8b92a8; font-size: 11px; }
  .node.on { border-color: #5b9cff; background: #eef4ff; }
  .arr { font-size: 26px; color: #c9cedb; transition: 0.3s; }
  .arr.on { color: #5b9cff; }
</style>
<script>
  var NL = String.fromCharCode(10);
  var steps = [
    { on: ['b', 'a1'], dir: '→', text: '1. The browser asks the server for a page:' + NL + '   GET /posts?month=3' },
    { on: ['e', 'a2'], dir: '→', text: '2. The route handler in index.js turns that into SQL and sends it through pg:' + NL + '   const result = await db.query(' + NL + '     "SELECT * FROM posts WHERE month = $1", [3]);' },
    { on: ['p'], dir: '→', text: '3. Postgres finds the matching rows in its posts table.' },
    { on: ['e', 'a2'], dir: '←', text: '4. pg hands the rows back as an array of objects:' + NL + '   result.rows = [' + NL + '     { id: 7, title: "Spring is here", month: 3 },' + NL + '     { id: 9, title: "Clocks go forward", month: 3 } ]' },
    { on: ['b', 'a1'], dir: '←', text: '5. Express renders a page (or sends JSON) with status 200,' + NL + '   and the browser shows it. The data outlives this request: it stays in Postgres.' }
  ];
  var i = -1;
  function paint() {
    ['b', 'e', 'p', 'a1', 'a2'].forEach(function (id) { document.getElementById(id).classList.remove('on'); });
    document.getElementById('a1').textContent = '→'; document.getElementById('a2').textContent = '→';
    if (i < 0) { document.getElementById('ro').textContent = 'Press "Next step".'; document.getElementById('n').textContent = 'step 0 of 5'; return; }
    var s = steps[i];
    s.on.forEach(function (id) { var el = document.getElementById(id); el.classList.add('on'); if (id.charAt(0) === 'a') el.textContent = s.dir; });
    document.getElementById('ro').textContent = s.text;
    document.getElementById('n').textContent = 'step ' + (i + 1) + ' of 5';
  }
  document.getElementById('next').onclick = function () { i = Math.min(i + 1, steps.length - 1); paint(); };
  document.getElementById('again').onclick = function () { i = -1; paint(); };
  paint();
<\/script>`
  }],
  quiz:[
    { q:'Who talks to the database in a typical web app?', options:['The browser, directly','The server-side code (your Express app)','The DNS server','The CSS file'], answer:1, why:'The browser sends requests to your server; the server holds the credentials, runs the SQL and sends back a response.' },
    { q:'After <code>const result = await db.query("SELECT * FROM users")</code>, where are the records?', options:['result.data','result.rows — an array of objects keyed by column name','result.body','result itself is the array'], answer:1, why:'pg puts the records in result.rows, one object per row, with the column names as keys.' },
    { q:'What is <code>pg</code>?', options:['A Postgres command-line tool','The npm package (node-postgres) that lets Node talk to Postgres','pgAdmin\'s file format','A SQL keyword'], answer:1, why:'You install it with npm i pg and import it into index.js.' },
    { q:'Why does the database matter for an app?', options:['It makes pages load faster','It keeps data after the request ends and after the server restarts','It replaces Express','It styles the page'], answer:1, why:'Variables in your server vanish on restart. Users, posts and to-dos have to live somewhere permanent — the database.' },
  ],
});


PG.add({
  id:'l249', index:249, udemyId:39497140, minutes:0, section:'s33', slug:'install-postgres-pgadmin', kind:'read',
  title:'How to Install PostgreSQL and pgAdmin',
  blurb:'Two programs to install: the Postgres server (the database) and pgAdmin (a visual tool for it). The EnterpriseDB installer for Windows and macOS includes both. Leave every component ticked, choose a password for the <code>postgres</code> superuser and write it down, keep the default port 5432, and close Stack Builder if it opens. In this playground Postgres already runs inside the browser, so nothing needs installing to do the lessons here.',
  links:[
    { title:'PostgreSQL installers (EnterpriseDB)', url:'https://www.enterprisedb.com/downloads/postgres-postgresql-downloads', note:'pick your operating system; includes pgAdmin' },
    { title:'pgAdmin', url:'https://www.pgadmin.org/download/', note:'if you need to install the GUI on its own' },
  ],
  quiz:[
    { q:'Which detail from the installer will you need later in your Node code?', options:['The installation folder','The password you chose for the postgres user','The Stack Builder settings','The installer version'], answer:1, why:'The pg.Client config needs user "postgres", that password, host localhost and port 5432.' },
    { q:'What port does Postgres listen on by default?', options:['3000','8080','5432','27017'], answer:2, why:'5432 is the Postgres default; leave it unless you have a reason to change it.' },
  ],
});


PG.add({
  id:'l250', index:250, udemyId:40494154, minutes:11, section:'s33', slug:'keys-types-keywords', kind:'sql',
  title:'Understand how to use keys, Postgres types and keywords',
  blurb:'A column is written as <i>name type keywords</i>. <code>id SERIAL PRIMARY KEY</code> is the standard first column: SERIAL makes Postgres number the rows for you, PRIMARY KEY makes each value unique. For text, <code>VARCHAR(50)</code> has a maximum and uses only the space it needs, <code>CHAR(50)</code> always takes all 50, and <code>TEXT</code> has no limit. <code>INT</code> holds whole numbers and <code>BOOLEAN</code> true or false.',
  tasks:[
    'Create <code>friends</code> with <code>id SERIAL PRIMARY KEY</code>, <code>name VARCHAR(50)</code>, <code>age INT</code> and <code>is_cool BOOLEAN</code>.',
    'Insert three friends naming only <code>(name, age, is_cool)</code> — leave the id out — then <code>SELECT * FROM friends;</code>. Postgres filled in ids 1, 2 and 3.',
    'Try <code>INSERT INTO friends (id, name) VALUES (1, \'Copycat\');</code> and read the duplicate-key error: the primary key will not accept a second id 1.',
    'Try a name longer than 50 characters and read the "value too long" error. Insert one more normal friend afterwards: the failed insert used up an id, so there is a gap. That is fine — ids only need to be unique.',
    'Compare storage: <code>SELECT octet_length(\'Jack\'::CHAR(50)), octet_length(\'Jack\'::VARCHAR(50));</code> — 50 bytes against 4.',
    'Press <b>Check my work</b>.'
  ],
  files:{
'query.sql':`-- An empty database. A column is: name, type, then optional keywords.

-- TODO 1: create the friends table
--   id       numbered automatically, unique for every row
--   name     text, at most 50 characters
--   age      a whole number
--   is_cool  true or false


-- TODO 2: add three friends without giving an id, then look at the table


-- TODO 3: how many bytes does 'Jack' take as CHAR(50), VARCHAR(50) and TEXT?
--   (octet_length counts bytes)

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created friends.
CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  age INT,
  is_cool BOOLEAN
);

INSERT INTO friends (name, age, is_cool) VALUES ('Jack', 20, true);
INSERT INTO friends (name, age, is_cool) VALUES ('Mia', 22, false);
INSERT INTO friends (name, age, is_cool) VALUES ('Sam', 19, true);

SELECT * FROM friends;

SELECT octet_length('Jack'::CHAR(50)) AS char_bytes,
       octet_length('Jack'::VARCHAR(50)) AS varchar_bytes,
       octet_length('Jack'::TEXT) AS text_bytes;
`},
  checks:[
    { desc:'friends has four columns', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'friends'`, expect:4 },
    { desc:'id is SERIAL (Postgres numbers it)', sql:`SELECT column_default LIKE 'nextval%' FROM information_schema.columns WHERE table_name = 'friends' AND column_name = 'id'`, expect:true },
    { desc:'id is the primary key', sql:`SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'friends' AND tc.constraint_type = 'PRIMARY KEY' AND k.column_name = 'id'`, expect:1 },
    { desc:'name is VARCHAR(50)', sql:`SELECT data_type || '(' || character_maximum_length || ')' FROM information_schema.columns WHERE table_name = 'friends' AND column_name = 'name'`, expect:'character varying(50)' },
    { desc:'age is INT and is_cool is BOOLEAN', sql:`SELECT string_agg(data_type, ',' ORDER BY column_name) FROM information_schema.columns WHERE table_name = 'friends' AND column_name IN ('age', 'is_cool')`, expect:'integer,boolean' },
    { desc:'At least three friends', sql:`SELECT COUNT(*) >= 3 FROM friends`, expect:true },
  ],
  quiz:[
    { q:'What does <code>SERIAL</code> do for the id column?', options:['Encrypts it','Makes Postgres fill in the next number when you leave it out','Allows duplicates','Sorts the table'], answer:1, why:'SERIAL is an auto-incrementing integer: insert without an id and Postgres uses the next value of a counter.' },
    { q:'Why not use <code>name</code> as the primary key of friends?', options:['Text cannot be a key','Two friends can have the same name, and a primary key must be unique','Names are too long','It would make the table slower to read'], answer:1, why:'A primary key has to identify exactly one row forever. Names repeat; a generated id does not.' },
    { q:'You store "Jack" in a <code>CHAR(50)</code> and in a <code>VARCHAR(50)</code> column. What is the difference?', options:['None','CHAR pads it to 50 characters; VARCHAR stores just the 4','VARCHAR pads it; CHAR does not','CHAR rejects it'], answer:1, why:'CHAR(n) is fixed width. VARCHAR(n) is variable width with a maximum of n.' },
    { q:'When is <code>TEXT</code> the sensible choice?', options:['For ages','For true/false values','When you cannot name a safe maximum length, such as a blog post body','Never — it is deprecated'], answer:2, why:'TEXT has no length limit and costs very little extra, so it suits values of unpredictable length.' },
  ],
});


PG.add({
  id:'l251', index:251, udemyId:40735610, minutes:0, section:'s33', slug:'flag-emojis-on-windows', kind:'read',
  title:'Flag Emojis on Windows',
  blurb:'Windows has no flag pictures in its emoji font, so a flag shows up as two letters (🇫🇷 appears as FR) in VS Code, pgAdmin and Chrome. The data is correct — only the drawing differs. For the flag quiz, view the page in Firefox, which brings its own emoji font. The Explore tab shows why: a flag emoji really is two letters.',
  explore:[{
    title:'Two letters make a flag', height:360,
    note:'Type a two-letter country code. Each letter maps to a special "regional indicator" character; a font with flag artwork draws the pair as one flag, a font without it (Windows) just shows the letters.',
    html:`
<div class="knobs">
  <label>Country code <input type="text" id="cc" value="FR" maxlength="2" size="4" style="text-transform:uppercase"></label>
  <span class="tag">try GB, JP, KE, BR, NZ</span>
</div>
<div class="stage" style="text-align:center">
  <div id="flag" style="font-size:76px;line-height:1.1"></div>
  <div id="pts" class="note" style="margin-top:8px"></div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  function hex(n) { return 'U+' + n.toString(16).toUpperCase(); }
  function render() {
    var v = document.getElementById('cc').value.toUpperCase().replace(/[^A-Z]/g, '');
    var cps = v.split('').map(function (c) { return 0x1F1E6 + c.charCodeAt(0) - 65; });
    document.getElementById('flag').textContent = v.length === 2 ? String.fromCodePoint.apply(null, cps) : '…';
    document.getElementById('pts').textContent = v.split('').map(function (c, i) { return c + ' → ' + hex(cps[i]); }).join('    ');
    var NL = String.fromCharCode(10);
    document.getElementById('ro').textContent = '// the same trick in JavaScript' + NL + 'const flagOf = (code) =>' + NL + '  String.fromCodePoint(...code.split("").map((c) => 0x1F1E6 + c.charCodeAt(0) - 65));' + NL + NL + 'flagOf("' + v + '")  // ' + (v.length === 2 ? String.fromCodePoint.apply(null, cps) : 'needs two letters');
  }
  document.getElementById('cc').addEventListener('input', render);
  render();
<\/script>`
  }],
  quiz:[
    { q:'pgAdmin on Windows shows "FR" in the flag column instead of 🇫🇷. What is wrong?', options:['The import failed','The column should be VARCHAR','Nothing — Windows simply has no flag artwork, the data is fine','The database uses the wrong encoding'], answer:2, why:'A flag emoji is two regional-indicator letters. Without flag artwork in the font you see the letters; the stored text is identical.' },
  ],
});


PG.add({
  id:'l252', index:252, udemyId:40494164, minutes:17, section:'s33', slug:'pgadmin-create-table', kind:'sql',
  title:'Use pgAdmin to CREATE a TABLE',
  blurb:'In pgAdmin you create a database called <code>world</code>, open the Query Tool on it, write <code>CREATE TABLE</code>, and fill the table by importing a CSV whose header names match the column names. Here the editor is your Query Tool, and a ready-made <code>INSERT</code> under each TODO stands in for the CSV import. The exercise is the same: a <code>capitals</code> table, then a <code>flags</code> table that stores emoji as <code>TEXT</code>.',
  tasks:[
    'Write <code>CREATE TABLE capitals</code> with <code>id SERIAL PRIMARY KEY</code>, <code>country VARCHAR(45)</code> and <code>capital VARCHAR(45)</code>. No comma after the last column; a semicolon at the end.',
    'Run the script. The "import" INSERT under your table fills it with 12 rows — it only works because your column names match its column list, just as a CSV header must.',
    'Exercise: write <code>CREATE TABLE flags</code> with <code>id SERIAL PRIMARY KEY</code>, <code>name VARCHAR(45)</code> and <code>flag TEXT</code>, and run its import.',
    'View the data the way pgAdmin\'s "View All Rows" does: <code>SELECT * FROM capitals ORDER BY id ASC;</code>. Then show only the first 5 rows by adding <code>LIMIT 5</code>.',
    'Break it on purpose, then fix it: put a comma after the last column of a CREATE TABLE and read the syntax error; or call a column <code>Country_Name</code> and watch the import fail because the names no longer match.',
    'Press <b>Check my work</b>.'
  ],
  files:{
'query.sql':`-- pgAdmin: Databases > Create > Database "world", then Tools > Query Tool.
-- This editor is that Query Tool, connected to an empty "world" database.

-- TODO 1: create the capitals table
--   id       SERIAL PRIMARY KEY
--   country  VARCHAR(45)
--   capital  VARCHAR(45)


-- This INSERT plays the part of Import/Export > capitals.csv (header on).
-- Its column names must match your table's, like a CSV header must.
-- The id column is left out, so SERIAL numbers the rows 1, 2, 3 ...
INSERT INTO capitals (country, capital) VALUES
  ('Argentina', 'Buenos Aires'),
  ('Canada', 'Ottawa'),
  ('Egypt', 'Cairo'),
  ('France', 'Paris'),
  ('Germany', 'Berlin'),
  ('India', 'New Delhi'),
  ('Japan', 'Tokyo'),
  ('Kenya', 'Nairobi'),
  ('Mexico', 'Mexico City'),
  ('New Zealand', 'Wellington'),
  ('Norway', 'Oslo'),
  ('Thailand', 'Bangkok');

-- TODO 2: create the flags table
--   id    SERIAL PRIMARY KEY
--   name  VARCHAR(45)
--   flag  TEXT   (emoji are text)


-- "Import" flags.csv
INSERT INTO flags (name, flag) VALUES
  ('Argentina', '🇦🇷'),
  ('Canada', '🇨🇦'),
  ('Egypt', '🇪🇬'),
  ('France', '🇫🇷'),
  ('Germany', '🇩🇪'),
  ('India', '🇮🇳'),
  ('Japan', '🇯🇵'),
  ('Kenya', '🇰🇪'),
  ('Mexico', '🇲🇽'),
  ('New Zealand', '🇳🇿'),
  ('Norway', '🇳🇴'),
  ('Thailand', '🇹🇭');

-- TODO 3: view every capital ordered by id (what pgAdmin writes for View All Rows),
--         then only the first 5 rows with LIMIT

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created these tables.
CREATE TABLE capitals (
  id SERIAL PRIMARY KEY,
  country VARCHAR(45),
  capital VARCHAR(45)
);

INSERT INTO capitals (country, capital) VALUES
  ('Argentina', 'Buenos Aires'),
  ('Canada', 'Ottawa'),
  ('Egypt', 'Cairo'),
  ('France', 'Paris'),
  ('Germany', 'Berlin'),
  ('India', 'New Delhi'),
  ('Japan', 'Tokyo'),
  ('Kenya', 'Nairobi'),
  ('Mexico', 'Mexico City'),
  ('New Zealand', 'Wellington'),
  ('Norway', 'Oslo'),
  ('Thailand', 'Bangkok');

CREATE TABLE flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  flag TEXT
);

INSERT INTO flags (name, flag) VALUES
  ('Argentina', '🇦🇷'),
  ('Canada', '🇨🇦'),
  ('Egypt', '🇪🇬'),
  ('France', '🇫🇷'),
  ('Germany', '🇩🇪'),
  ('India', '🇮🇳'),
  ('Japan', '🇯🇵'),
  ('Kenya', '🇰🇪'),
  ('Mexico', '🇲🇽'),
  ('New Zealand', '🇳🇿'),
  ('Norway', '🇳🇴'),
  ('Thailand', '🇹🇭');

SELECT * FROM capitals
ORDER BY id ASC;

SELECT * FROM capitals
ORDER BY id ASC
LIMIT 5;
`},
  checks:[
    { desc:'capitals has the columns id, country and capital', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'capitals' AND column_name IN ('id', 'country', 'capital')`, expect:3 },
    { desc:'capitals.id is SERIAL', sql:`SELECT column_default LIKE 'nextval%' FROM information_schema.columns WHERE table_name = 'capitals' AND column_name = 'id'`, expect:true },
    { desc:'capitals.id is the primary key', sql:`SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'capitals' AND tc.constraint_type = 'PRIMARY KEY' AND k.column_name = 'id'`, expect:1 },
    { desc:'country and capital are VARCHAR(45)', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'capitals' AND column_name IN ('country', 'capital') AND character_maximum_length = 45`, expect:2 },
    { desc:'12 capitals imported', sql:`SELECT COUNT(*) FROM capitals`, expect:12 },
    { desc:'flags.flag is TEXT', sql:`SELECT data_type FROM information_schema.columns WHERE table_name = 'flags' AND column_name = 'flag'`, expect:'text' },
    { desc:'12 flags imported', sql:`SELECT COUNT(*) FROM flags`, expect:12 },
  ],
  quiz:[
    { q:'Why must the CSV header names match the table\'s column names?', options:['They do not have to','The import uses the header to decide which column each value goes into','CSV files cannot contain numbers','pgAdmin sorts by them'], answer:1, why:'With Header switched on, each header name is matched to a column. A name that does not exist in the table makes the import fail.' },
    { q:'What is wrong here?<br><code>CREATE TABLE capitals (id SERIAL PRIMARY KEY, country VARCHAR(45), capital VARCHAR(45),);</code>', options:['VARCHAR needs no length','The comma after the last column','SERIAL cannot be a primary key','Nothing'], answer:1, why:'Columns are separated by commas, so a comma before the closing bracket makes Postgres expect another column and report a syntax error.' },
    { q:'Why store the flag emoji in a <code>TEXT</code> column?', options:['Emoji are images','Emoji are UTF-8 text, and TEXT spares you from guessing a length','TEXT is faster than every other type','pgAdmin requires it'], answer:1, why:'An emoji is just characters. TEXT holds any length of UTF-8 text without a declared maximum.' },
    { q:'What does pgAdmin\'s "View First 100 Rows" add to the query?', options:['WHERE id &lt; 100','LIMIT 100','TOP 100','ORDER BY 100'], answer:1, why:'LIMIT n caps the number of rows returned — handy for a quick look at a big table.' },
  ],
});


/* ---------- 253 – 254 ---------- */

/* capitals and flags tables for the quiz (country short names match WORLD) */
const CAPITALS = [
  ['AR', 'Buenos Aires'], ['AU', 'Canberra'], ['AT', 'Vienna'], ['CA', 'Ottawa'], ['CL', 'Santiago'],
  ['CN', 'Beijing'], ['CU', 'Havana'], ['DK', 'Copenhagen'], ['EG', 'Cairo'], ['ET', 'Addis Ababa'],
  ['FI', 'Helsinki'], ['FR', 'Paris'], ['DE', 'Berlin'], ['GH', 'Accra'], ['GR', 'Athens'],
  ['IN', 'New Delhi'], ['IE', 'Dublin'], ['IT', 'Rome'], ['JP', 'Tokyo'], ['KE', 'Nairobi'],
  ['MX', 'Mexico City'], ['MA', 'Rabat'], ['NP', 'Kathmandu'], ['NL', 'Amsterdam'], ['NZ', 'Wellington'],
  ['NO', 'Oslo'], ['PE', 'Lima'], ['PH', 'Manila'], ['PL', 'Warsaw'], ['PT', 'Lisbon'],
  ['ES', 'Madrid'], ['SE', 'Stockholm'], ['TH', 'Bangkok'], ['GB', 'London'],
].sort((a, b) => (NAME_OF[a[0]] < NAME_OF[b[0]] ? -1 : 1));

const QUIZ_SEED = `CREATE TABLE capitals (
  id SERIAL PRIMARY KEY,
  country VARCHAR(45),
  capital VARCHAR(45)
);
INSERT INTO capitals (country, capital) VALUES
` + CAPITALS.map(c => '  (' + sq(NAME_OF[c[0]]) + ', ' + sq(c[1]) + ')').join(',' + NL) + `;
CREATE TABLE flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  flag TEXT
);
INSERT INTO flags (name, flag) VALUES
` + CAPITALS.map(c => '  (' + sq(NAME_OF[c[0]]) + ', ' + sq(flagOf(c[0])) + ')').join(',' + NL) + ';';

const QUIZ_EJS = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Capital City Quiz</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>

<body id="app">
  <form class="container" action="/submit" method="post">
    <div class="horizontal-container">
      <h3>
        Total Score:
        <span id="score"><%= locals.totalScore ? totalScore : "0" %></span>
      </h3>
    </div>

    <h1 id="countryName"><%= question.country %></h1>
    <div class="answer-container">
      <input type="text" name="answer" id="userInput" placeholder="Enter the capital" autofocus autocomplete="off">
    </div>
    <button type="submit">SUBMIT
      <% if (locals.wasCorrect) { %>
        <span class="checkmark">✔</span>
      <% } else if (locals.wasCorrect === false) { %>
        <span class="cross" id="error">✖</span>
      <% } %>
    </button>
  </form>
  <script>
    var wasCorrect = "<%= locals.wasCorrect %>";
    console.log(wasCorrect);
    if (wasCorrect === "false") {
      alert("Game over! Final best score: <%= locals.totalScore %>");
      document.getElementById("app").innerHTML = '<a href="/" class="restart-button">Restart</a>';
    }
  </script>
</body>

</html>
`;

const QUIZ_CSS = `body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #1d4e89, #00a6a6);
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 90%;
  max-width: 440px;
  height: 300px;
  margin: 60px auto;
  padding: 10px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

h3 {
  margin: 0;
}

.answer-container {
  width: 100%;
  text-align: center;
}

input {
  text-align: center;
  width: 60%;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  font-weight: 800;
  letter-spacing: 2px;
  font-size: large;
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ffca00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ffd500;
}

.horizontal-container {
  display: flex;
  justify-content: space-between;
}

.checkmark {
  color: transparent;
  animation: checkmark 0.5s ease forwards;
}

.cross {
  color: transparent;
  animation: cross 0.5s ease forwards;
}

@keyframes checkmark {
  100% {
    color: green;
  }
}

@keyframes cross {
  100% {
    color: red;
  }
}

.restart-button {
  display: inline-block;
  margin: 80px 40px;
  background-color: #fff;
  color: #333;
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
`;

const QUIZ_TAIL = `let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST an answer
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(\`Server is running at http://localhost:\${port}\`);
});
`;

PG.add({
  id:'l253', index:253, udemyId:40494176, minutes:23, section:'s33', slug:'read-from-postgres', kind:'node',
  title:'READ data from a Postgres database',
  blurb:'The capital-city quiz already works with a hard-coded array of three countries. This lecture swaps that array for the <code>capitals</code> table: import <code>pg</code>, create a <code>pg.Client</code> with the connection details, <code>connect()</code>, run <code>SELECT * FROM capitals</code> once at start-up and keep <code>res.rows</code> — an array of objects keyed by column name — as the quiz. The rest of the app does not change.',
  tasks:[
    'Press <b>▶ Run</b> and play the starter. Only three questions ever come up, because <code>quiz</code> is a hard-coded array.',
    'Import <code>pg</code> and create <code>const db = new pg.Client({ user, host, database, password, port })</code> with user <code>"postgres"</code>, host <code>"localhost"</code>, database <code>"world"</code>, any password (the playground ignores it) and port <code>5432</code>. Call <code>db.connect()</code>.',
    'Run <code>db.query("SELECT * FROM capitals", (err, res) =&gt; { ... })</code>. In the callback log <code>err.stack</code> if there is an error, otherwise set <code>quiz = res.rows</code>; then call <code>db.end()</code>.',
    'Empty the hard-coded array (<code>let quiz = [];</code>) and log <code>res.rows</code> once: each row is an object with <code>id</code>, <code>country</code> and <code>capital</code> — the column names.',
    'Run again and play: a random country from 34 each time; answers ignore case and spaces; the first wrong answer ends the game with an alert and a Restart link.',
    'Exercise — the flag quiz: the <code>flags</code> table has the columns <code>id</code>, <code>name</code> and <code>flag</code>. Query it instead, compare the answer with <code>currentQuestion.name</code>, show <code>question.flag</code> in the h1 and change the placeholder. (The solution file describes the changes in a comment.)'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: QUIZ_SEED },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/submit', body:{ answer:'Paris' }, expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
// TODO 1: import pg

const app = express();
const port = 3000;

// TODO 2: create the database client — new pg.Client({ ... }) with
//   user "postgres", host "localhost", database "world",
//   password "your-password" (any value works here), port 5432
// TODO 3: connect to the database

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "Washington, D.C." },
];

// TODO 4: load every row of the capitals table into quiz instead:
//   db.query("SELECT * FROM capitals", (err, res) => { ... })
//   log err.stack if something went wrong, otherwise quiz = res.rows,
//   and close the connection with db.end() when done

` + QUIZ_TAIL,
'views/index.ejs': QUIZ_EJS,
'public/styles/main.css': QUIZ_CSS,
'package.json': PKG('world-capital-quiz'),
  },
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "your-password", // your own Postgres password; never commit a real one
  port: 5432,
});

db.connect();

let quiz = [];

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows; // [{ id: 1, country: "Argentina", capital: "Buenos Aires" }, ...]
  }
  db.end();
});

/* Flag quiz version (the exercise):
   - query "SELECT * FROM flags" instead
   - compare with currentQuestion.name instead of currentQuestion.capital
   - in views/index.ejs show <%= question.flag %> and use the placeholder "Name the country" */

` + QUIZ_TAIL,
  },
  quiz:[
    { q:'What does <code>res.rows</code> hold after <code>SELECT * FROM capitals</code>?', options:['A string of comma-separated values','An array with one object per row, keyed by column name','Only the first row','The number of rows'], answer:1, why:'pg turns every row into an object such as { id: 12, country: "France", capital: "Paris" } and puts them in an array.' },
    { q:'The flags table has the columns id, name and flag. Which comparison checks the answer?', options:['currentQuestion.country','currentQuestion.capital','currentQuestion.name','currentQuestion.flag'], answer:2, why:'Row objects use the table\'s own column names, so the country is under name in the flags table.' },
    { q:'Why is the user\'s answer passed through <code>trim()</code> and <code>toLowerCase()</code>?', options:['To protect the database','So that " paris " and "PARIS" still count as Paris','Because Postgres stores lowercase only','It is required by EJS'], answer:1, why:'=== compares exactly, so stray spaces or different capitals would make a right answer look wrong.' },
    { q:'This code calls <code>db.end()</code> inside the query callback. Why is that fine here?', options:['end() does nothing','The quiz is loaded once at start-up, and no other query runs after it','end() reopens the connection automatically','Express keeps its own connection'], answer:1, why:'All the data is fetched once. The Travel Tracker that follows queries on every request, so there the connection has to stay open.' },
  ],
});


const FOOD_ROWS = [
  ['Argentina', 1.5, 22.1], ['Bangladesh', 56.9, 1.1], ['Canada', 0, 22.3], ['China', 212.8, 136.9],
  ['Egypt', 5.8, 9.8], ['France', 0.1, 36.6], ['India', 195.4, 109.6], ['Russia', 1.1, 76.1],
  ['United Kingdom', 0, 14.0], ['United States', 8.7, 44.8],
];
const FOOD_IMPORT = `INSERT INTO world_food (country, rice_production, wheat_production) VALUES
` + FOOD_ROWS.map(r => '  (' + sq(r[0]) + ', ' + r[1] + ', ' + r[2] + ')').join(',' + NL) + ';';

PG.add({
  id:'l254', index:254, udemyId:40494186, minutes:19, section:'s33', slug:'select-where-like', kind:'sql',
  title:'Query data using SELECT, WHERE, and LIKE',
  blurb:'Practice reading data from a <code>world_food</code> table of rice and wheat harvests. <code>SELECT</code> picks columns, <code>WHERE</code> filters rows with <code>=</code>, <code>&lt;</code> or <code>&gt;</code>, and <code>LIKE</code> matches a pattern where <code>%</code> stands for any run of characters. In Postgres <code>||</code> joins two strings, so <code>\'U\' || \'%\'</code> builds the pattern <code>U%</code> — the form you need later when the text comes from a variable.',
  tasks:[
    'Create <code>world_food</code>: <code>id SERIAL PRIMARY KEY</code>, <code>country VARCHAR(45)</code>, <code>rice_production FLOAT</code>, <code>wheat_production FLOAT</code>. FLOAT stores numbers with decimals. Run it together with the import below it: 10 rows, ids 1–10 filled in by SERIAL.',
    'Select everything; then only the <code>country</code> column; then <code>country</code> and <code>wheat_production</code>.',
    'The rice production of the United States — one value: <b>8.7</b>.',
    'Countries that grow more than 20 million tonnes of wheat — <b>7 rows</b>.',
    'Countries whose name starts with U, written with concatenation: <code>LIKE \'U\' || \'%\'</code> — United Kingdom and United States.',
    'Countries whose name ends in a — <b>5 rows</b> (Argentina, Canada, China, India, Russia).',
    'Compare <code>WHERE country = \'United\'</code> (no rows) with <code>LIKE \'United%\'</code> (two rows): <code>=</code> needs the whole value, LIKE matches a pattern. Then press <b>Check my work</b>.'
  ],
  files:{
'query.sql':`-- Figures: rounded 2021 harvests in millions of tonnes.

-- TODO 1: create the world_food table
--   id                SERIAL PRIMARY KEY
--   country           VARCHAR(45)
--   rice_production   FLOAT
--   wheat_production  FLOAT


-- This INSERT stands in for importing world-food.csv (the CSV has no id column,
-- so id is left out and SERIAL numbers the rows).
` + FOOD_IMPORT + `

-- TODO 2: all rows and columns; then only country; then country and wheat_production


-- TODO 3: rice production of the United States


-- TODO 4: countries with wheat production greater than 20


-- TODO 5: countries starting with U — build the pattern with 'U' || '%'


-- TODO 6: countries ending in a

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created world_food.
CREATE TABLE world_food (
  id SERIAL PRIMARY KEY,
  country VARCHAR(45),
  rice_production FLOAT,
  wheat_production FLOAT
);

` + FOOD_IMPORT + `

SELECT * FROM world_food;
SELECT country FROM world_food;
SELECT country, wheat_production FROM world_food;

SELECT rice_production FROM world_food WHERE country = 'United States';

SELECT country FROM world_food WHERE wheat_production > 20;

SELECT * FROM world_food WHERE country LIKE 'U' || '%';

SELECT * FROM world_food WHERE country LIKE '%' || 'a';

-- = needs the whole value, LIKE matches a pattern
SELECT * FROM world_food WHERE country = 'United';
SELECT * FROM world_food WHERE country LIKE 'United%';
`},
  checks:[
    { desc:'world_food has id, country, rice_production and wheat_production', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'world_food' AND column_name IN ('id', 'country', 'rice_production', 'wheat_production')`, expect:4 },
    { desc:'The production columns are FLOAT (double precision)', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'world_food' AND column_name LIKE '%production' AND data_type = 'double precision'`, expect:2 },
    { desc:'10 rows imported', sql:`SELECT COUNT(*) FROM world_food`, expect:10 },
    { desc:'SERIAL numbered them 1 to 10', sql:`SELECT MIN(id) || '-' || MAX(id) FROM world_food`, expect:'1-10' },
  ],
  explore:[{
    title:'LIKE pattern tester', height:420,
    note:'Type a pattern and watch which countries match. <code>%</code> is any run of characters (including none) and <code>_</code> is exactly one. LIKE is case-sensitive; tick the box to compare lowercase with lowercase, the trick the Travel Tracker uses.',
    html:`
<div class="knobs">
  <label>country LIKE <input type="text" id="pat" value="U%" size="14"></label>
  <label><input type="checkbox" id="ci"> ignore case (LOWER on both sides)</label>
</div>
<div class="knobs" id="presets"></div>
<pre class="readout" id="sql"></pre>
<div class="stage"><div id="list" class="chips"></div></div>
<p class="note" id="msg"></p>
<style>
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { padding: 5px 11px; border-radius: 14px; background: #f1f3f9; color: #a2a8bd; border: 1px solid #dfe3ee; }
  .chip.on { background: #e6f7ee; color: #0f5132; border-color: #9fd8b7; font-weight: 600; }
</style>
<script>
  var countries = ${JSON.stringify(FOOD_ROWS.map(r => r[0]))};
  var presets = ['U%', '%a', '%an%', 'United%', '_____', 'C%a', 'u%'];
  function like(s, p) {
    var memo = {};
    function m(i, j) {
      var k = i + ',' + j;
      if (k in memo) return memo[k];
      var r;
      if (j === p.length) r = i === s.length;
      else if (p[j] === '%') r = m(i, j + 1) || (i < s.length && m(i + 1, j));
      else r = i < s.length && (p[j] === '_' || p[j] === s[i]) && m(i + 1, j + 1);
      memo[k] = r;
      return r;
    }
    return m(0, 0);
  }
  function render() {
    var p = document.getElementById('pat').value, ci = document.getElementById('ci').checked;
    var hits = countries.filter(function (c) { return ci ? like(c.toLowerCase(), p.toLowerCase()) : like(c, p); });
    document.getElementById('sql').textContent = ci
      ? "SELECT country FROM world_food WHERE LOWER(country) LIKE LOWER('" + p + "');"
      : "SELECT country FROM world_food WHERE country LIKE '" + p + "';";
    document.getElementById('list').innerHTML = countries.map(function (c) { return '<span class="chip' + (hits.indexOf(c) >= 0 ? ' on' : '') + '">' + c + '</span>'; }).join('');
    document.getElementById('msg').textContent = hits.length + ' of ' + countries.length + ' match.' + (p.indexOf('%') < 0 && p.indexOf('_') < 0 ? ' Without a wildcard, LIKE behaves exactly like =.' : '');
  }
  document.getElementById('presets').innerHTML = '<span class="tag">try</span> ' + presets.map(function (p) { return '<button data-p="' + p + '">' + p + '</button>'; }).join(' ');
  document.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { document.getElementById('pat').value = b.getAttribute('data-p'); render(); }; });
  document.getElementById('pat').addEventListener('input', render);
  document.getElementById('ci').addEventListener('change', render);
  render();
<\/script>`
  }],
  quiz:[
    { q:'Which query returns countries whose name <b>starts</b> with U?', options:['WHERE country = \'U%\'','WHERE country LIKE \'%U\'','WHERE country LIKE \'U%\'','WHERE country LIKE U'], answer:2, why:'% stands for "anything after this", so U% means U followed by any characters. = would look for the literal text U%.' },
    { q:'In Postgres, what does <code>\'U\' || \'%\'</code> produce?', options:['true if either is true','The string \'U%\'','An error','Either U or %'], answer:1, why:'|| is string concatenation in Postgres, not a logical OR. It lets you glue a wildcard onto text that comes from a variable.' },
    { q:'<code>SELECT rice_production FROM world_food WHERE country = \'United States\'</code> filters on one column and returns another. Is that allowed?', options:['No, WHERE must use a selected column','Yes — the column you test and the columns you show are independent','Only with LIKE','Only for numbers'], answer:1, why:'WHERE can test any column of the table, whatever the SELECT list shows.' },
    { q:'Which pattern would also match "United Kingdom" when you only wanted "United States"?', options:['\'United States\'','\'United%\'','\'%States\'','\'United S%\''], answer:1, why:'United% matches anything starting with United. A pattern that is too loose matches more rows than you meant.' },
  ],
});


/* ---------- 255 – 257: Travel Tracker ---------- */

const VISITED_SQL = `CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL UNIQUE
);
INSERT INTO visited_countries (country_code) VALUES ('FR'), ('GB'), ('US');`;

const FOOD_SQL = `CREATE TABLE world_food (
  id SERIAL PRIMARY KEY,
  country VARCHAR(45),
  rice_production FLOAT,
  wheat_production FLOAT
);
` + FOOD_IMPORT;

const TT_HEAD = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
`;

const TT_DB = `
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "your-password", // your own Postgres password; never commit a real one
  port: 5432,
});
db.connect();
`;

const TT_MIDDLEWARE = `
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
`;

const TT_LISTEN = `
app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
`;

const TT_CHECK_VISITED = `
async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});
`;

const TT_ADD_PART2 = `
// INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [input]
  );

  if (result.rows.length !== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);
    res.redirect("/");
  } else {
    // Not in the course's version: with no response at all the browser would
    // wait forever. Part 3 replaces this with a proper error message.
    res.redirect("/");
  }
});
`;

const TT_FILES = {
  'views/index.ejs': TRACKER_EJS,
  'public/styles/main.css': TRACKER_CSS,
  'package.json': PKG('travel-tracker'),
};

PG.add({
  id:'l255', index:255, udemyId:40494228, minutes:19, section:'s33', slug:'travel-tracker-part-1', kind:'node', project:true,
  title:'UNIQUE and NOT NULL - Travel Tracker Part 1',
  blurb:'The Travel Tracker records the countries you have visited and lights them up on a map. Its table, <code>visited_countries</code>, has a <code>country_code CHAR(2)</code> column marked <code>NOT NULL</code> (no empty rows) and <code>UNIQUE</code> (no country twice), so the database itself rejects bad data. Part 1 reads the stored codes in the home route and passes them to the page as a plain array plus a total.',
  tasks:[
    'Open the Explore tab and run the Query Tool script: the table was created with <code>CHAR(2) NOT NULL UNIQUE</code>, and each bad INSERT is refused with a different error. Look at the id the good insert gets — rejected rows can use up numbers, which is fine.',
    'Read <code>views/index.ejs</code>: it needs <code>countries</code> (an array of codes) and <code>total</code>. Its script splits the text EJS prints back into an array and lights the tile whose id is each code. (The course draws an SVG world map here; this version uses one tile per country.)',
    'In <code>index.js</code> create a <code>pg.Client</code> for the <code>world</code> database and call <code>db.connect()</code>.',
    'In <code>GET /</code> run <code>await db.query("SELECT country_code FROM visited_countries")</code> and log <code>result.rows</code> — an array of objects like <code>{ country_code: "FR" }</code>.',
    'Push each row\'s <code>country_code</code> into a <code>countries</code> array and render <code>index.ejs</code> with <code>countries</code> and <code>total: countries.length</code>.',
    'Run it: France, the United Kingdom and the United States light up and the corner says <b>Total Countries: 3</b>. The terminal shows <code>[page] string</code> — proof that the page received text, not an array.',
    'Do not call <code>db.end()</code> in the route (the course\'s file does): the second page load would find the connection closed. The form posts to <code>/add</code>, which comes in Part 2.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: VISITED_SQL },
  smoke:[{ method:'GET', path:'/', expect:200 }],
  files:Object.assign({
'index.js':TT_HEAD + `
// TODO 1: create a pg.Client for the "world" database (user "postgres",
//         host "localhost", password "your-password", port 5432) and connect it
` + TT_MIDDLEWARE + `
// GET home page
app.get("/", async (req, res) => {
  // TODO 2: SELECT country_code FROM visited_countries, and log result.rows
  // TODO 3: build a plain array of codes, e.g. ["FR", "GB", "US"]
  // TODO 4: pass that array and its length to the template instead of these placeholders
  res.render("index.ejs", { countries: [], total: 0 });
});
` + TT_LISTEN,
  }, TT_FILES),
  solution:{
'index.js':TT_HEAD + TT_DB + TT_MIDDLEWARE + `
// GET home page
app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  // No db.end() here: it would close the connection after the first request.
});
` + TT_LISTEN,
  },
  explore:[queryTool('Query Tool: try to break the constraints', VISITED_SQL,
`-- The table as created in pgAdmin:
--   id SERIAL PRIMARY KEY, country_code CHAR(2) NOT NULL UNIQUE
SELECT * FROM visited_countries;

-- Each of these breaks one rule. Run them and read the errors.
INSERT INTO visited_countries (country_code) VALUES ('FR');   -- already there
INSERT INTO visited_countries (country_code) VALUES (NULL);   -- missing
INSERT INTO visited_countries (country_code) VALUES ('FRA');  -- too long for CHAR(2)

-- This one is fine. Which id does it get?
INSERT INTO visited_countries (country_code) VALUES ('JP');
SELECT * FROM visited_countries;`,
    'A scratch copy of the <code>world</code> database with the same <code>visited_countries</code> table. It stands in for pgAdmin\'s Query Tool and is separate from the database your server uses (that one is rebuilt from the lesson\'s data each time you press Run). Every statement runs on its own, so one error does not stop the rest.')],
  notes:`<p><b>How this lesson differs from the video.</b> The table and its three rows are created for you when the server starts, as if you had made them in pgAdmin. The world map is a grid of country tiles instead of the course's SVG file: each tile has the country code as its <code>id</code>, so the page script works the same way — <code>document.getElementById("FR")</code> finds France and colours it.</p>`,
  quiz:[
    { q:'What does <code>NOT NULL</code> on <code>country_code</code> guarantee?', options:['The code is two letters long','Every row has a code — an insert without one is rejected','Codes are unique','The code is uppercase'], answer:1, why:'NOT NULL refuses rows where the column is missing. Length comes from CHAR(2), uniqueness from UNIQUE.' },
    { q:'Why is <code>country_code</code> also <code>UNIQUE</code>?', options:['So it can be a foreign key','So the same country cannot be stored twice and counted twice','To make it faster to type','UNIQUE is required with CHAR'], answer:1, why:'A visited country only needs one row. The database itself rejects a second FR.' },
    { q:'In the page script, why does <code>"&lt;%= countries %&gt;"</code> need <code>.split(",")</code>?', options:['EJS sends JSON','EJS prints the array as text like FR,GB,US, so the browser receives a string','split() uppercases the codes','It removes duplicates'], answer:1, why:'EJS writes values into the HTML as text. The browser gets the string "FR,GB,US" and has to split it to get an array back.' },
    { q:'What goes wrong if the route calls <code>db.end()</code> after rendering?', options:['Nothing','The first request works, then every later query fails because the client is closed','The page renders twice','The data is deleted'], answer:1, why:'end() closes the connection for good. A server that queries on every request keeps the client open for its whole life.' },
  ],
});


PG.add({
  id:'l256', index:256, udemyId:40494240, minutes:17, section:'s33', slug:'travel-tracker-part-2', kind:'node', project:true,
  title:'INSERT and add Data - Travel Tracker Part 2',
  blurb:'Adding data from your code: <code>INSERT INTO table (columns) VALUES (values)</code>, with the values passed separately as <code>db.query(text, [values])</code> and <code>$1</code>, <code>$2</code> placeholders in the text. A new <code>countries</code> table maps names to codes, so the form\'s <code>POST /add</code> route looks the typed name up, inserts the code into <code>visited_countries</code> and redirects home, where the map is drawn again.',
  tasks:[
    'In the Explore tab\'s Query Tool, practise <code>INSERT INTO</code>: add Japan to <code>world_food</code> with the column list and the id left out, then see the new row with the next id.',
    'Still in the Query Tool, look at the new <code>countries</code> lookup table (code + name for 56 countries) and try the lookup your route will do: <code>SELECT country_code FROM countries WHERE country_name = \'Japan\'</code>.',
    'In <code>views/index.ejs</code> find the form: it posts to <code>/add</code> and its input is named <code>country</code>.',
    'In <code>index.js</code> write <code>app.post("/add", async (req, res) =&gt; { ... })</code>. Read <code>req.body["country"]</code> and look its code up with <code>db.query("SELECT country_code FROM countries WHERE country_name = $1", [input])</code>.',
    'If <code>result.rows</code> is not empty, take <code>result.rows[0].country_code</code> and run <code>INSERT INTO visited_countries (country_code) VALUES ($1)</code> with it. Then <code>res.redirect("/")</code>.',
    'Run and add Japan, Germany and Colombia: each tile lights up and the total grows. Look at <code>checkVisited()</code> — the home route\'s query moved into a helper so other routes can reuse it.',
    'Now try "Tanzania", "germany" and "France" (already added). Note what happens for each — Part 3 fixes all three.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: VISITED_SQL + NL + COUNTRIES_SQL },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/add', body:{ country:'Japan' }, expect:302 },
    { method:'POST', path:'/add', body:{ country:'Atlantis' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:Object.assign({
'index.js':TT_HEAD + TT_DB + TT_MIDDLEWARE + TT_CHECK_VISITED + `
// TODO: INSERT new country
// app.post("/add", async (req, res) => {
//   1. read what was typed: req.body["country"]
//   2. look its code up:  SELECT country_code FROM countries WHERE country_name = $1
//   3. if a row came back, INSERT INTO visited_countries (country_code) VALUES ($1)
//   4. redirect to "/" so the home page draws the map again
// });
` + TT_LISTEN,
  }, TT_FILES),
  solution:{
'index.js':TT_HEAD + TT_DB + TT_MIDDLEWARE + TT_CHECK_VISITED + TT_ADD_PART2 + TT_LISTEN,
  },
  explore:[
    queryTool('Query Tool: INSERT and the lookup table', VISITED_SQL + NL + COUNTRIES_SQL + NL + FOOD_SQL,
`-- 1. INSERT INTO: list the columns, leave id out so SERIAL fills it in
INSERT INTO world_food (country, rice_production, wheat_production)
VALUES ('Japan', 10.5, 1.1);
SELECT * FROM world_food;

-- 2. The lookup table: a code for every country name
SELECT * FROM countries;

-- 3. What POST /add runs, with $1 replaced by what the user typed
SELECT country_code FROM countries WHERE country_name = 'Japan';
INSERT INTO visited_countries (country_code) VALUES ('JP');
SELECT * FROM visited_countries;`,
      'A scratch copy of the <code>world</code> database: <code>visited_countries</code>, the new <code>countries</code> table and last lecture\'s <code>world_food</code>. Changes here do not reach your server\'s database.'),
    {
      title:'Why $1 instead of gluing the text in', height:470,
      note:'Pick an input. On the left the input is pasted into the SQL text; a quote in it ends the string early and the rest becomes SQL. On the right the text never changes and the value travels separately, so it is only ever data.',
      html:`
<div class="knobs">
  <label>The user types <input type="text" id="inp" value="Japan" size="26"></label>
</div>
<div class="knobs"><span class="tag">try</span>
  <button data-v="Japan">Japan</button>
  <button data-v="Cote d'Ivoire">Cote d'Ivoire</button>
  <button data-v="x' OR '1'='1">x' OR '1'='1</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px"><h4>Glued into the string ✗</h4><pre class="readout" id="bad" style="white-space:pre-wrap"></pre><p class="note" id="badNote"></p></div>
  <div style="flex:1;min-width:260px"><h4>Placeholder $1 ✓</h4><pre class="readout" id="good" style="white-space:pre-wrap"></pre><p class="note">The SQL text is always the same. pg sends the value on its own, so quotes inside it are just characters.</p></div>
</div>
<script>
  var NL = String.fromCharCode(10);
  function render() {
    var v = document.getElementById('inp').value;
    document.getElementById('bad').textContent = '// your code' + NL + 'db.query("SELECT country_code FROM countries' + NL + '  WHERE country_name = \\'" + input + "\\'");' + NL + NL + '// what Postgres receives' + NL + "SELECT country_code FROM countries WHERE country_name = '" + v + "'";
    var quotes = v.split("'").length - 1;
    var note = 'Looks harmless for this input — but only because it contains no quote.';
    if (quotes % 2 === 1) note = 'The apostrophe closes the string early, so Postgres reports a syntax error. A real country name just broke your query.';
    else if (quotes > 0) note = 'The quotes in the input closed the string and added SQL of its own: OR \\'1\\'=\\'1\\' is always true, so the WHERE now matches every row.';
    document.getElementById('badNote').textContent = note;
    document.getElementById('good').textContent = '// your code' + NL + 'db.query(' + NL + '  "SELECT country_code FROM countries WHERE country_name = $1",' + NL + '  [input]' + NL + ');' + NL + NL + '// what Postgres receives' + NL + 'text:   SELECT country_code FROM countries WHERE country_name = $1' + NL + 'values: ' + JSON.stringify([v]);
  }
  document.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { document.getElementById('inp').value = b.getAttribute('data-v'); render(); }; });
  document.getElementById('inp').addEventListener('input', render);
  render();
<\/script>`
    },
  ],
  quiz:[
    { q:'In <code>db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode])</code>, what is <code>$1</code>?', options:['The first row of the table','A placeholder replaced by the first item of the values array','A Postgres variable you must declare','The id column'], answer:1, why:'$1, $2, ... are numbered placeholders. pg sends the array of values alongside the SQL text and Postgres slots them in.' },
    { q:'Why pass values in an array instead of building the SQL string with <code>+</code>?', options:['It is shorter','Values sent separately cannot change the SQL itself, which prevents SQL injection and broken quotes','Postgres cannot read strings','The array is cached'], answer:1, why:'Gluing user input into SQL lets a quote in the input rewrite your query. Placeholders keep data as data.' },
    { q:'Why does the app need the <code>countries</code> table?', options:['To store visits','People type country names, but visited_countries stores two-letter codes, so names must be turned into codes','For the UNIQUE constraint','To draw the tiles'], answer:1, why:'The lookup table maps a name like Japan to its code JP before the insert.' },
    { q:'Why does POST /add finish with <code>res.redirect("/")</code>?', options:['To log the user out','So the browser loads the home page again, which re-queries the database and redraws the map','Redirects are required after SQL','To clear the database cache'], answer:1, why:'The GET / route already knows how to read and render everything, so after changing data you send the browser back there.' },
  ],
});


const TT_ADD_PART3 = `
// INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code; // throws if nothing matched (data is undefined)
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err.message); // duplicate key value violates unique constraint ...
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err.message); // Cannot read properties of undefined ...
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});
`;

PG.add({
  id:'l257', index:257, udemyId:40494256, minutes:11, section:'s33', slug:'travel-tracker-part-3', kind:'node', project:true,
  title:'Travel Tracker Part 3',
  blurb:'Polishing the edge cases. A duplicate country breaks the <code>UNIQUE</code> rule and an unknown name finds no row; both now land in a <code>catch</code> that re-renders the page with an <code>error</code> message in the input\'s placeholder. And the lookup becomes forgiving: <code>LOWER(country_name) LIKE \'%\' || $1 || \'%\'</code> with the input lowercased matches "tanzania" to <i>Tanzania, United Republic of</i>.',
  tasks:[
    'Run the starter (Part 2\'s code) and reproduce the problems: add "France" (already there) — the server crashes with a duplicate-key error page; add "Atlantis" — nothing tells you why nothing happened; add "Tanzania" — not found, because the table stores <i>Tanzania, United Republic of</i>.',
    'Wrap the lookup in <code>try { ... } catch (err) { ... }</code> and drop the if/else: read <code>result.rows[0].country_code</code> directly. When nothing matched, <code>rows[0]</code> is undefined and reading <code>.country_code</code> throws, which lands in the catch.',
    'In that catch, log the error, get the codes with <code>checkVisited()</code> and <code>res.render("index.ejs", { countries, total, error: "Country name does not exist, try again." })</code>.',
    'Wrap the INSERT in its own try/catch: a UNIQUE violation lands there; render with <code>error: "Country has already been added, try again."</code>. Use <code>res.render</code>, not <code>res.redirect</code> — a redirect would lose the error message.',
    'Make the lookup forgiving: <code>WHERE LOWER(country_name) LIKE \'%\' || $1 || \'%\'</code> and pass <code>input.toLowerCase()</code>. Try "tanzania", "viet", "korea" and "united states".',
    'Find an input that matches too many countries, such as "an" or "ia" — only <code>rows[0]</code> is used, so which country gets added? (The Explore tab shows every match.) Also try "South Korea": why does it still fail?'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: VISITED_SQL + NL + COUNTRIES_SQL },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/add', body:{ country:'France' }, expect:200 },
    { method:'POST', path:'/add', body:{ country:'Atlantis' }, expect:200 },
    { method:'POST', path:'/add', body:{ country:'tanzania' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:Object.assign({
'index.js':TT_HEAD + TT_DB + TT_MIDDLEWARE + TT_CHECK_VISITED + `
// TODO 1: wrap the lookup in try/catch; when no row matches, render index.ejs
//         with an error: "Country name does not exist, try again."
// TODO 2: wrap the INSERT in its own try/catch; when the UNIQUE rule refuses it,
//         render index.ejs with an error: "Country has already been added, try again."
// TODO 3: make the lookup forgiving: LOWER(country_name) LIKE '%' || $1 || '%'
//         and pass input.toLowerCase()` + TT_ADD_PART2 + TT_LISTEN,
  }, TT_FILES),
  solution:{
'index.js':TT_HEAD + TT_DB + TT_MIDDLEWARE + TT_CHECK_VISITED + TT_ADD_PART3 + TT_LISTEN,
  },
  explore:[{
    title:'Three ways to look a country up', height:520,
    note:'Type what a user might enter. Each column runs a different WHERE against the 56 names in the <code>countries</code> table; the highlighted row is <code>rows[0]</code>, the one the route would insert.',
    html:`
<div class="knobs">
  <label>The user types <input type="text" id="inp" value="tanzania" size="20"></label>
</div>
<div class="knobs" id="presets"></div>
<div class="cols3">
  <div><h4>country_name = $1</h4><div class="lst" id="m0"></div></div>
  <div><h4>country_name LIKE '%' || $1 || '%'</h4><div class="lst" id="m1"></div></div>
  <div><h4>LOWER(country_name) LIKE '%' || $1 || '%'<br><small>with input.toLowerCase()</small></h4><div class="lst" id="m2"></div></div>
</div>
<style>
  .cols3 { display: flex; gap: 12px; flex-wrap: wrap; }
  .cols3 > div { flex: 1; min-width: 200px; }
  .cols3 h4 { font: 600 11.5px ui-monospace, Menlo, monospace; text-transform: none; letter-spacing: 0; min-height: 30px; }
  .cols3 small { color: #8b92a8; font-weight: 400; }
  .lst { background: #fff; border: 1px solid #dfe3ee; border-radius: 8px; padding: 6px; min-height: 60px; font-size: 12.5px; }
  .lst div { padding: 3px 6px; border-radius: 5px; }
  .lst .first { background: #e6f7ee; font-weight: 600; }
  .lst .none { color: #b02a37; }
  .lst .more { color: #8b92a8; }
</style>
<script>
  var rows = ${JSON.stringify(WORLD.slice().sort((a, b) => (a[1] < b[1] ? -1 : 1)).map(w => [w[0], w[1]]))};
  var presets = ['Tanzania', 'tanzania', 'France', 'germany', 'korea', 'South Korea', 'united states', 'an'];
  function show(id, list) {
    var box = document.getElementById(id);
    if (!list.length) { box.innerHTML = '<div class="none">no rows: rows[0] is undefined, so reading .country_code throws</div>'; return; }
    box.innerHTML = list.slice(0, 8).map(function (r, i) { return '<div class="' + (i === 0 ? 'first' : '') + '">' + r[0] + '  ' + r[1] + (i === 0 ? '  ← rows[0]' : '') + '</div>'; }).join('') + (list.length > 8 ? '<div class="more">… and ' + (list.length - 8) + ' more</div>' : '');
  }
  function render() {
    var v = document.getElementById('inp').value;
    show('m0', rows.filter(function (r) { return r[1] === v; }));
    show('m1', rows.filter(function (r) { return r[1].indexOf(v) >= 0; }));
    show('m2', rows.filter(function (r) { return r[1].toLowerCase().indexOf(v.toLowerCase()) >= 0; }));
  }
  document.getElementById('presets').innerHTML = '<span class="tag">try</span> ' + presets.map(function (p) { return '<button data-p="' + p + '">' + p + '</button>'; }).join(' ');
  document.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { document.getElementById('inp').value = b.getAttribute('data-p'); render(); }; });
  document.getElementById('inp').addEventListener('input', render);
  render();
<\/script>`
  }],
  quiz:[
    { q:'Why does an unknown name end up in the outer <code>catch</code>?', options:['Postgres throws "country not found"','The SELECT returns no rows, so rows[0] is undefined and reading .country_code throws a TypeError','LIKE throws on no match','The redirect fails'], answer:1, why:'An empty result is not an error for Postgres. The error comes from your own code touching a property of undefined.' },
    { q:'Why do the error paths use <code>res.render</code> instead of <code>res.redirect("/")</code>?', options:['render is faster','A redirect starts a new request, so the error message would be lost','redirect cannot be used inside catch','render clears the database'], answer:1, why:'Only render can hand the error value to the template. After a redirect, GET / renders without it.' },
    { q:'What does <code>LOWER(country_name) LIKE \'%\' || $1 || \'%\'</code> do with $1 = "korea"?', options:['Only matches a country named exactly korea','Matches any name containing "korea", whatever the capital letters in the table','Matches names starting with korea','Raises a syntax error'], answer:1, why:'|| glues % to both ends of the input, and lowering both sides makes the comparison case-insensitive.' },
    { q:'The user types "an". What is the risk?', options:['None','Many countries contain "an"; the code silently adds whichever comes first in rows[0]','LIKE rejects short inputs','It deletes rows'], answer:1, why:'A loose pattern matches several rows and the route takes the first. Stricter matching or asking the user to choose would be the next refinement.' },
  ],
});


/* ---------- 258 – 260: relationships (the "school" database) ---------- */

const STUDENT_SQL = `CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);
INSERT INTO student (first_name, last_name) VALUES ('Angela', 'Yu'), ('Jack', 'Bauer'), ('Lena', 'Novak');`;

const CONTACT_SQL = `CREATE TABLE contact_detail (
  id INTEGER REFERENCES student(id) UNIQUE,
  tel TEXT,
  address TEXT
);
INSERT INTO contact_detail (id, tel, address) VALUES
  (1, '+44 20 7946 0001', '4 Lab Lane'),
  (2, '+44 161 496 0002', '9 Quay Street');`;

const HOMEWORK_SQL = `CREATE TABLE homework_submission (
  id SERIAL PRIMARY KEY,
  mark INTEGER,
  student_id INTEGER REFERENCES student(id)
);
INSERT INTO homework_submission (mark, student_id) VALUES (98, 1), (87, 1), (88, 1), (74, 2), (91, 2);`;

const fkCheck = (table, column) => `SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = '${table}' AND tc.constraint_type = 'FOREIGN KEY' AND k.column_name = '${column}'`;

PG.add({
  id:'l258', index:258, udemyId:40494260, minutes:12, section:'s33', slug:'one-to-one-and-joins', kind:'sql',
  title:'One to One Relationships & Inner Joins',
  blurb:'Tables become powerful when they point at each other. In a <b>one-to-one</b> relationship each student has at most one row of contact details: <code>contact_detail.id</code> is declared <code>INTEGER REFERENCES student(id) UNIQUE</code> — a foreign key to the student, and UNIQUE so no student can have two. <code>JOIN ... ON student.id = contact_detail.id</code> puts the two halves back together.',
  tasks:[
    'The <code>school</code> database has a <code>student</code> table with three students. Look at it.',
    'Create <code>contact_detail</code> with <code>id INTEGER REFERENCES student(id) UNIQUE</code>, <code>tel TEXT</code> and <code>address TEXT</code>.',
    'Insert contact details for student 1 (Angela Yu) and for student 2 (Jack Bauer). The student has to exist before a row can point at them.',
    'Join them: <code>SELECT * FROM student JOIN contact_detail ON student.id = contact_detail.id;</code> — 2 wide rows. Lena has no contact details, so an (inner) join leaves her out.',
    'Try a second contact_detail row for student 1 and read the UNIQUE error — that rule is what makes it one-to-one. Then try a row for student 99 and read the foreign-key error.',
    'Press <b>Check my work</b>.'
  ],
  seed: STUDENT_SQL,
  files:{
'query.sql':`-- The "school" database. One student has (at most) one row of contact details.
SELECT * FROM student;

-- TODO 1: create contact_detail
--   id       INTEGER, a foreign key to student(id), and UNIQUE
--   tel      TEXT
--   address  TEXT


-- TODO 2: contact details for student 1 and student 2 (make up a phone number and an address)


-- TODO 3: join student and contact_detail on the matching id

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created contact_detail.
-- One to One --
CREATE TABLE contact_detail (
  id INTEGER REFERENCES student(id) UNIQUE,
  tel TEXT,
  address TEXT
);

-- Data --
INSERT INTO contact_detail (id, tel, address)
VALUES (1, '+44 20 7946 0001', '4 Lab Lane');
INSERT INTO contact_detail (id, tel, address)
VALUES (2, '+44 161 496 0002', '9 Quay Street');

-- Join --
SELECT *
FROM student
JOIN contact_detail
ON student.id = contact_detail.id;
`},
  checks:[
    { desc:'contact_detail has id, tel and address', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'contact_detail' AND column_name IN ('id', 'tel', 'address')`, expect:3 },
    { desc:'contact_detail.id references student', sql:fkCheck('contact_detail', 'id'), expect:1 },
    { desc:'contact_detail.id is UNIQUE (one row per student)', sql:`SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'contact_detail' AND constraint_type = 'UNIQUE'`, expect:1 },
    { desc:'Angela has contact details', sql:`SELECT COUNT(*) FROM student JOIN contact_detail ON student.id = contact_detail.id WHERE student.first_name = 'Angela'`, expect:1 },
    { desc:'Jack has contact details', sql:`SELECT COUNT(*) FROM student JOIN contact_detail ON student.id = contact_detail.id WHERE student.first_name = 'Jack'`, expect:1 },
  ],
  quiz:[
    { q:'What makes the student/contact_detail relationship one-to-one rather than one-to-many?', options:['The REFERENCES keyword','UNIQUE on contact_detail.id, so each student id can appear only once','SERIAL on student.id','The JOIN'], answer:1, why:'REFERENCES links the tables; UNIQUE stops a second contact row for the same student.' },
    { q:'Why must the student row exist before you insert its contact details?', options:['Postgres inserts alphabetically','The foreign key only accepts ids that exist in student','Otherwise the join is slower','It does not have to'], answer:1, why:'A foreign key value must match an existing primary key, so the referenced row comes first.' },
    { q:'Lena has no contact_detail row. Does <code>student JOIN contact_detail</code> show her?', options:['Yes, with NULLs','No — a plain JOIN is an inner join and only keeps matched rows','Only if she is first','It raises an error'], answer:1, why:'JOIN on its own means INNER JOIN: rows without a partner on the other side are dropped.' },
    { q:'Why is <code>ON student.id = contact_detail.id</code> written with table names?', options:['Style only','Both tables have a column called id, so the names say which is which','JOIN requires dots','To create an index'], answer:1, why:'Without the prefixes, id would be ambiguous.' },
  ],
});


PG.add({
  id:'l259', index:259, udemyId:40494262, minutes:13, section:'s33', slug:'one-to-many', kind:'sql',
  title:'One to Many Relationships',
  blurb:'One student hands in many pieces of homework; each submission belongs to one student. The foreign key goes on the <b>many</b> side: <code>homework_submission.student_id INTEGER REFERENCES student(id)</code>, with no UNIQUE, so the same student id can appear again and again. The submission also gets its own <code>id SERIAL PRIMARY KEY</code>. Read from the other end, the same link is many-to-one.',
  tasks:[
    'Create <code>homework_submission</code> with <code>id SERIAL PRIMARY KEY</code>, <code>mark INTEGER</code> and <code>student_id INTEGER REFERENCES student(id)</code>.',
    'Insert three submissions for student 1 in <b>one</b> INSERT: <code>VALUES (98, 1), (87, 1), (88, 1)</code>. Add a couple for student 2 if you like.',
    'Look at the table on its own: just numbers. Hard to read — hence the join.',
    'Before peeking at the solution, write the join: student to homework_submission where <code>student.id = homework_submission.student_id</code>. One row per submission, with the student repeated.',
    'Narrow it to <code>student.id, first_name, last_name, mark</code>. Only <code>id</code> needs its table name — it is the only column name both tables share.',
    'Try a submission for student 99 (foreign-key error), then press <b>Check my work</b>.'
  ],
  seed: STUDENT_SQL + NL + CONTACT_SQL,
  files:{
'query.sql':`-- school: student (3 rows) and contact_detail from the last lecture.
SELECT * FROM student;

-- TODO 1: create homework_submission
--   id          SERIAL PRIMARY KEY
--   mark        INTEGER
--   student_id  INTEGER, a foreign key to student(id) — no UNIQUE this time


-- TODO 2: three submissions for student 1 (marks 98, 87, 88) in one INSERT


-- TODO 3: join student and homework_submission (all columns)


-- TODO 4: the same join, showing only student.id, first_name, last_name, mark

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created homework_submission.
-- Many to One --
CREATE TABLE homework_submission (
  id SERIAL PRIMARY KEY,
  mark INTEGER,
  student_id INTEGER REFERENCES student(id)
);

-- Data --
INSERT INTO homework_submission (mark, student_id)
VALUES (98, 1), (87, 1), (88, 1);
INSERT INTO homework_submission (mark, student_id)
VALUES (74, 2), (91, 2);

SELECT * FROM homework_submission;

-- Join --
SELECT *
FROM student
JOIN homework_submission
ON student.id = homework_submission.student_id;

SELECT student.id, first_name, last_name, mark
FROM student
JOIN homework_submission
ON student.id = student_id;
`},
  checks:[
    { desc:'homework_submission has id, mark and student_id', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'homework_submission' AND column_name IN ('id', 'mark', 'student_id')`, expect:3 },
    { desc:'Its own id is SERIAL', sql:`SELECT column_default LIKE 'nextval%' FROM information_schema.columns WHERE table_name = 'homework_submission' AND column_name = 'id'`, expect:true },
    { desc:'student_id references student', sql:fkCheck('homework_submission', 'student_id'), expect:1 },
    { desc:'student_id is not UNIQUE (one student, many rows)', sql:`SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = 'homework_submission' AND constraint_type = 'UNIQUE'`, expect:0 },
    { desc:'Student 1 has the marks 98, 87 and 88', sql:`SELECT SUM(mark) FROM homework_submission WHERE student_id = 1 AND mark IN (98, 87, 88)`, expect:273 },
  ],
  quiz:[
    { q:'In a one-to-many relationship, which table holds the foreign key?', options:['The "one" side (student)','The "many" side (homework_submission)','Both','A third table'], answer:1, why:'Each submission records which student it belongs to. A student row could not hold a list of submission ids.' },
    { q:'What is the only structural difference from the one-to-one contact_detail table?', options:['REFERENCES is replaced by JOIN','The foreign key is not UNIQUE, and the child table has its own id','The foreign key is TEXT','There is no difference'], answer:1, why:'Drop UNIQUE and the same student id may repeat — that is what "many" means. The submission needs its own primary key.' },
    { q:'Why does <code>SELECT student.id, first_name, last_name, mark</code> prefix only <code>id</code>?', options:['id is special','id exists in both tables; the other names exist in only one, so they are unambiguous','first_name is a keyword','Prefixes are only allowed once'], answer:1, why:'A table prefix is needed only when two joined tables share the column name.' },
    { q:'How many rows does the join return for a student with three submissions?', options:['1','3 — one per submission, with the student repeated','0','Depends on ORDER BY'], answer:1, why:'The join produces one combined row for every matching pair, so the student\'s details appear on each submission row.' },
  ],
});


PG.add({
  id:'l260', index:260, udemyId:40494274, minutes:12, section:'s33', slug:'many-to-many-and-aliases', kind:'sql',
  title:'Many to Many Relationships & Aliases',
  blurb:'A student takes many classes and a class has many students. No single foreign key can say that, so a third <b>junction</b> table, <code>enrollment</code>, holds one row per pairing: a <code>student_id</code> and a <code>class_id</code>, both foreign keys, with <code>PRIMARY KEY (student_id, class_id)</code> so a pair is stored once. Two JOINs bring the three tables together, and <code>AS</code> gives columns and tables shorter names.',
  tasks:[
    'Create <code>class</code> (<code>id SERIAL PRIMARY KEY</code>, <code>title VARCHAR(45)</code>) and insert English Literature, Maths and Physics in one INSERT — they get ids 1, 2 and 3.',
    'Create <code>enrollment</code>: <code>student_id INTEGER REFERENCES student(id)</code>, <code>class_id INTEGER REFERENCES class(id)</code>, <code>PRIMARY KEY (student_id, class_id)</code>.',
    'Enroll student 1 in classes 1 and 2, and student 2 in classes 2 and 3. (Jack Bauer is already in the student table here.)',
    'Double join: <code>FROM enrollment JOIN student ON student.id = enrollment.student_id JOIN class ON class.id = enrollment.class_id</code> — one row per enrollment. How many students take Maths?',
    'Rename the output column: <code>student.id AS stud</code>. Then give the tables short aliases — <code>enrollment AS e</code>, <code>student s</code>, <code>class c</code> (AS is optional for tables) — and use <code>s.id</code>, <code>e.class_id</code> and so on.',
    'Try enrolling student 1 in class 1 a second time and read the error from the composite key. Press <b>Check my work</b>.'
  ],
  seed: STUDENT_SQL + NL + CONTACT_SQL + NL + HOMEWORK_SQL,
  files:{
'query.sql':`-- school: student, contact_detail and homework_submission are already here.
SELECT * FROM student;

-- TODO 1: class table (id SERIAL PRIMARY KEY, title VARCHAR(45))
--         and the classes English Literature, Maths, Physics


-- TODO 2: the enrollment junction table
--   student_id  INTEGER, foreign key to student(id)
--   class_id    INTEGER, foreign key to class(id)
--   PRIMARY KEY (student_id, class_id)


-- TODO 3: student 1 takes classes 1 and 2; student 2 takes classes 2 and 3


-- TODO 4: join enrollment, student and class (all columns)


-- TODO 5: same join, with the column alias "stud" for student.id
--         and the table aliases e, s and c

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created class or enrollment.
-- Many to Many --
CREATE TABLE class (
  id SERIAL PRIMARY KEY,
  title VARCHAR(45)
);

CREATE TABLE enrollment (
  student_id INTEGER REFERENCES student(id),
  class_id INTEGER REFERENCES class(id),
  PRIMARY KEY (student_id, class_id)
);

-- Data --
INSERT INTO class (title)
VALUES ('English Literature'), ('Maths'), ('Physics');

INSERT INTO enrollment (student_id, class_id) VALUES (1, 1), (1, 2);
INSERT INTO enrollment (student_id, class_id) VALUES (2, 2), (2, 3);

-- Join --
SELECT *
FROM enrollment
JOIN student ON student.id = enrollment.student_id
JOIN class ON class.id = enrollment.class_id;

-- Column alias --
SELECT student.id AS stud, first_name, last_name, title
FROM enrollment
JOIN student ON student.id = enrollment.student_id
JOIN class ON class.id = enrollment.class_id;

-- Table aliases (AS is optional for tables) --
SELECT s.id AS stud, first_name, last_name, title
FROM enrollment AS e
JOIN student s ON s.id = e.student_id
JOIN class c ON c.id = e.class_id;
`},
  checks:[
    { desc:'class holds the three classes', sql:`SELECT COUNT(*) FROM class WHERE title IN ('English Literature', 'Maths', 'Physics')`, expect:3 },
    { desc:'enrollment.student_id references student', sql:fkCheck('enrollment', 'student_id'), expect:1 },
    { desc:'enrollment.class_id references class', sql:fkCheck('enrollment', 'class_id'), expect:1 },
    { desc:'The primary key of enrollment is the pair (student_id, class_id)', sql:`SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'enrollment' AND tc.constraint_type = 'PRIMARY KEY'`, expect:2 },
    { desc:'Four enrollments', sql:`SELECT COUNT(*) FROM enrollment`, expect:4 },
    { desc:'Two students take Maths', sql:`SELECT COUNT(*) FROM enrollment e JOIN class c ON c.id = e.class_id WHERE c.title = 'Maths'`, expect:2 },
  ],
  explore:[{
    title:'Tick boxes are junction-table rows', height:540,
    note:'Each tick is one row in <code>enrollment</code>. A pair can only be ticked once — exactly what <code>PRIMARY KEY (student_id, class_id)</code> enforces. The joined table on the right is what the double JOIN returns.',
    html:`
<div class="stage"><table class="grid" id="grid"></table></div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div><h4>enrollment</h4><table class="grid" id="enr"></table></div>
  <div style="flex:1;min-width:280px"><h4>enrollment JOIN student JOIN class</h4><table class="grid" id="joined"></table></div>
</div>
<pre class="readout" id="sql" style="margin-top:12px"></pre>
<style> #grid td, #grid th { text-align: center; } #grid td:first-child { text-align: left; } </style>
<script>
  var students = [[1, 'Angela', 'Yu'], [2, 'Jack', 'Bauer'], [3, 'Lena', 'Novak']];
  var classes = [[1, 'English Literature'], [2, 'Maths'], [3, 'Physics']];
  var on = { '1-1': true, '1-2': true, '2-2': true, '2-3': true };
  function pairs() { var out = []; students.forEach(function (s) { classes.forEach(function (c) { if (on[s[0] + '-' + c[0]]) out.push([s, c]); }); }); return out; }
  function render() {
    var g = '<tr><th>student / class</th>' + classes.map(function (c) { return '<th>' + c[0] + ' ' + c[1] + '</th>'; }).join('') + '</tr>';
    students.forEach(function (s) {
      g += '<tr><td>' + s[0] + ' ' + s[1] + ' ' + s[2] + '</td>' + classes.map(function (c) {
        var k = s[0] + '-' + c[0];
        return '<td><input type="checkbox" data-k="' + k + '"' + (on[k] ? ' checked' : '') + '></td>';
      }).join('') + '</tr>';
    });
    document.getElementById('grid').innerHTML = g;
    var p = pairs();
    document.getElementById('enr').innerHTML = '<tr><th>student_id</th><th>class_id</th></tr>' + p.map(function (x) { return '<tr><td>' + x[0][0] + '</td><td>' + x[1][0] + '</td></tr>'; }).join('');
    document.getElementById('joined').innerHTML = '<tr><th>stud</th><th>first_name</th><th>last_name</th><th>title</th></tr>' + p.map(function (x) { return '<tr><td>' + x[0][0] + '</td><td>' + x[0][1] + '</td><td>' + x[0][2] + '</td><td>' + x[1][1] + '</td></tr>'; }).join('');
    var NL = String.fromCharCode(10);
    document.getElementById('sql').textContent = (p.length ? 'INSERT INTO enrollment (student_id, class_id) VALUES ' + p.map(function (x) { return '(' + x[0][0] + ', ' + x[1][0] + ')'; }).join(', ') + ';' : '-- no enrollments') + NL + NL +
      'SELECT s.id AS stud, first_name, last_name, title' + NL + 'FROM enrollment e' + NL + 'JOIN student s ON s.id = e.student_id' + NL + 'JOIN class c ON c.id = e.class_id;';
    document.querySelectorAll('[data-k]').forEach(function (b) { b.onchange = function () { on[b.getAttribute('data-k')] = b.checked; render(); }; });
  }
  render();
<\/script>`
  }],
  quiz:[
    { q:'Why does a many-to-many relationship need a third table?', options:['Postgres limits tables to two columns','One foreign key column can point at only one row, so each pairing gets its own row in a junction table','It is faster','For the aliases'], answer:1, why:'enrollment stores one (student_id, class_id) row per pairing — two one-to-many links meeting in the middle.' },
    { q:'What does <code>PRIMARY KEY (student_id, class_id)</code> enforce?', options:['Both columns are unique on their own','The combination is unique, so the same student cannot join the same class twice','Both columns are SERIAL','Nothing without UNIQUE'], answer:1, why:'A composite key makes the pair unique; student 1 can appear many times, but (1, 1) only once.' },
    { q:'After <code>FROM enrollment AS e</code>, which reference is right?', options:['enrollment.class_id','e.class_id','AS.class_id','class_id.e'], answer:1, why:'Once a table has an alias, refer to it by the alias in that query.' },
    { q:'What does <code>student.id AS stud</code> change?', options:['The column name in the table','Only the heading of that column in the result','The primary key','The join order'], answer:1, why:'A column alias renames the output column; the stored table is untouched.' },
  ],
});


/* ---------- 261: Family Travel Tracker ---------- */

const FAMILY_SQL = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL,
  color VARCHAR(15)
);
CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
INSERT INTO users (name, color) VALUES ('Angela', 'teal'), ('Jack', 'powderblue');
INSERT INTO visited_countries (country_code, user_id) VALUES ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2);`;

const FAMILY_EJS = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Family Travel Tracker</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>

<body>
  <!-- One tab per family member: the button sends user=<id>; the last one sends add=new -->
  <form class="tab-view" action="/user" method="post">
    <% users.forEach(function(user) { %>
      <button type="submit" name="user" value="<%= user.id %>" style="background-color: <%= user.color %>;"><%= user.name %></button>
    <% }); %>
    <button type="submit" name="add" value="new" class="add-member">Add Family Member</button>
  </form>

  <form action="/add" method="post">
    <input type="text" name="country" autofocus placeholder="<%= locals.error ? error : 'Enter country name' %>">
    <button type="submit" style="background-color: <%= color %>;">Add</button>
  </form>

${TILE_MAP}

  <h2 class="total-count">Total Countries: <%= total %></h2>

  <script>
    const country_codes = "<%= countries %>".split(",");
    country_codes.forEach((code) => {
      const tile = document.getElementById(code);
      if (tile) {
        tile.classList.add("visited");
        tile.style.backgroundColor = "<%= color %>";
      }
    });
  </script>
</body>

</html>
`;

const SWATCHES = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink'];
const NEW_EJS = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Family Member</title>
  <link rel="stylesheet" href="./styles/main.css">
  <link rel="stylesheet" href="./styles/new.css">
</head>

<body>
  <main class="new-member">
    <h1>Add a Family Member</h1>
    <% if (locals.error) { %>
      <p class="error"><%= error %></p>
    <% } %>
    <form action="/new" method="post">
      <p>What's your name?</p>
      <input type="text" name="name" maxlength="15" required autocomplete="off">

      <p>Pick a colour:</p>
      <div class="swatches">
` + SWATCHES.map((c, i) => `        <input type="radio" name="color" id="${c}" value="${c}"${i === 0 ? ' checked' : ''}>
        <label for="${c}"><span style="background: ${c};"></span></label>`).join(NL) + `
      </div>
      <button type="submit">Add</button>
    </form>
  </main>
</body>

</html>
`;

const FAMILY_CSS = TRACKER_CSS + `
/* family tabs */
.tab-view {
  flex-wrap: wrap;
  background: #2c313a;
}
.tab-view button {
  text-transform: none;
  font-weight: bold;
  padding: 14px 22px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}
.tab-view .add-member {
  background: #e5e5e5;
  color: #21252b;
  text-shadow: none;
}
`;

const NEW_CSS = `.new-member {
  max-width: 440px;
  margin: 50px auto;
  padding: 0 20px;
  color: #ffffff;
}
.new-member h1 {
  font-weight: normal;
}
.new-member form {
  display: block;
}
.new-member input[type="text"] {
  margin-bottom: 10px;
}
.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 26px;
}
.swatches input[type="radio"] {
  display: none;
}
.swatches label span {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.swatches label:hover span,
.swatches input[type="radio"]:checked + label span {
  transform: scale(1.25);
  box-shadow: 0 0 0 2px #ffffff;
}
.error {
  color: #ff8a80;
}
`;

const FAMILY_TOP = TT_HEAD + TT_DB + TT_MIDDLEWARE + `
let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];
`;

const FAMILY_ADD = (insert) => `
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
${insert}
      res.redirect("/");
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
  } catch (err) {
    // no country matched: send the user back instead of leaving the browser waiting
    console.log(err.message);
    res.redirect("/");
  }
});
`;

PG.add({
  id:'l261', index:261, udemyId:40494288, minutes:35, section:'s33', slug:'family-travel-tracker', kind:'node', project:true,
  title:'The Family Travel Tracker',
  blurb:'The Travel Tracker grows into a family app: a tab per person in their own colour, each with their own visited countries, and a form to add a new family member. In the database that is a <b>one-to-many</b> relationship — a <code>users</code> table, and a <code>user_id</code> foreign key on <code>visited_countries</code>. The server remembers whose tab is open in <code>currentUserId</code>, filters every query by it, and learns a new user\'s id from <code>INSERT ... RETURNING *</code>.',
  tasks:[
    'Run the starter: two tabs from a hard-coded array, every country lit in teal and a total of 4 — France is counted twice because the query ignores who visited it. Open the Explore tab and run the Query Tool to see the new tables and the join.',
    '<code>checkVisited()</code>: join <code>users ON users.id = user_id</code> and add <code>WHERE user_id = $1</code> with <code>[currentUserId]</code>, so only the current person\'s countries come back.',
    'Write <code>getCurrentUser()</code>: <code>SELECT * FROM users</code>, store the rows in <code>users</code>, and <code>return users.find((user) =&gt; user.id == currentUserId)</code>. Use <code>==</code>: an id from a form is the string "2", the database id is the number 2.',
    'In <code>GET /</code> call <code>getCurrentUser()</code> and pass <code>color: currentUser.color</code> along with countries, total and users.',
    '<code>POST /user</code>: if <code>req.body.add === "new"</code> render <code>new.ejs</code>; otherwise set <code>currentUserId = req.body.user</code> and redirect to <code>/</code>. Click Jack\'s tab: Canada and France in powder blue, total 2.',
    '<code>POST /add</code>: insert <code>(country_code, user_id)</code> with <code>[countryCode, currentUserId]</code>, so the country belongs to whoever\'s tab is open.',
    '<code>POST /new</code>: <code>INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *</code>, set <code>currentUserId</code> to <code>result.rows[0].id</code> and redirect. Add a family member and give them a country of their own.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: FAMILY_SQL + NL + COUNTRIES_SQL },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/user', body:{ user:'2' }, expect:302 },
    { method:'POST', path:'/add', body:{ country:'japan' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/user', body:{ add:'new' }, expect:200 },
    { method:'POST', path:'/new', body:{ name:'Mia', color:'orange' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:{
'index.js':FAMILY_TOP + `
async function checkVisited() {
  // TODO 1: only the current user's countries: JOIN users ON users.id = user_id
  //         and WHERE user_id = $1, passing [currentUserId]
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// TODO 2: async function getCurrentUser()
//   SELECT * FROM users, keep the rows in \`users\`,
//   and return the user whose id matches currentUserId (compare with ==, not ===)

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  // TODO 3: get the current user and pass their colour instead of "teal"
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});
` + FAMILY_ADD(`      // TODO 4: store who visited it as well: (country_code, user_id) with currentUserId
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );`) + `
app.post("/user", async (req, res) => {
  // TODO 5: the "Add Family Member" tab sends add=new  -> render new.ejs
  //         a person's tab sends user=<their id>        -> make them current, redirect to "/"
  res.redirect("/");
});

app.post("/new", async (req, res) => {
  // TODO 6: INSERT the new user (name, color) with RETURNING *,
  //         make the new id the current user, then redirect to "/"
  res.redirect("/");
});
` + TT_LISTEN,
'views/index.ejs':FAMILY_EJS,
'views/new.ejs':NEW_EJS,
'public/styles/main.css':FAMILY_CSS,
'public/styles/new.css':NEW_CSS,
'package.json':PKG('family-travel-tracker'),
  },
  solution:{
'index.js':FAMILY_TOP + `
async function checkVisited() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1;",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  // == on purpose: after a tab click currentUserId is the string "2"; user.id is the number 2
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const currentUser = await getCurrentUser();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});
` + FAMILY_ADD(`      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );`) + `
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
      [name, color]
    );
    const id = result.rows[0].id;
    currentUserId = id;
    res.redirect("/");
  } catch (err) {
    // name is UNIQUE, so a name that is already taken ends up here
    console.log(err.message);
    res.render("new.ejs", { error: "That name is already in the family, pick another." });
  }
});
` + TT_LISTEN,
  },
  explore:[queryTool('Query Tool: the family tables', FAMILY_SQL + NL + COUNTRIES_SQL,
`-- The lecture's queries.sql set these tables up:
SELECT * FROM users;
SELECT * FROM visited_countries;

-- One user, many countries: the join repeats the user on each row
SELECT *
FROM visited_countries
JOIN users ON users.id = user_id;

-- What checkVisited() should run while Jack's tab is open
SELECT country_code
FROM visited_countries
JOIN users ON users.id = user_id
WHERE user_id = 2;

-- What POST /new runs: RETURNING * hands back the new row, id included
INSERT INTO users (name, color) VALUES ('Mia', 'orange') RETURNING *;`,
    'A scratch copy of the <code>world</code> database after the lecture\'s <code>queries.sql</code>: <code>users</code>, the new <code>visited_countries</code> (with <code>user_id</code>, and no longer UNIQUE on the code) and <code>countries</code>. It is separate from your server\'s database.')],
  notes:`<p><b>Differences from the video.</b> The <code>users</code> and <code>visited_countries</code> tables are created for you when the server starts, exactly as the lecture's <code>queries.sql</code> builds them. The tabs are plain submit buttons rather than hidden inputs with labels — they send the same <code>user</code> / <code>add</code> fields. The colour picker's teal swatch sends <code>teal</code> (the course file sends indigo by mistake). The catch blocks redirect home instead of only logging, so the browser never waits for a reply that will not come.</p>`,
  quiz:[
    { q:'Which design gives each family member their own visited countries?', options:['A users column in countries','A user_id foreign key on visited_countries pointing at users(id)','A UNIQUE constraint on users.name','One table per user'], answer:1, why:'One user, many visits: the foreign key lives on the many side.' },
    { q:'Why compare ids with <code>==</code> in <code>users.find((user) =&gt; user.id == currentUserId)</code>?', options:['=== is not allowed in find','After a tab click, currentUserId is the string from the form while user.id is a number','== is faster','To match NULL'], answer:1, why:'Form values always arrive as strings. 2 === "2" is false; 2 == "2" is true.' },
    { q:'What does <code>RETURNING *</code> add to an INSERT?', options:['It undoes the insert','It sends the inserted row back, including the id Postgres generated','It returns every row of the table','It is required for SERIAL'], answer:1, why:'Without RETURNING you would have to query again to learn the new user\'s id.' },
    { q:'Why can Angela and Jack both have France now?', options:['FR is stored once and shared','visited_countries no longer has UNIQUE on country_code; each row also records the user','Postgres ignores duplicates','The countries table allows it'], answer:1, why:'The rule became "one row per user and country". The next lecture adds that as a composite UNIQUE constraint.' },
  ],
});


/* ---------- 262: changing data and tables ---------- */

PG.add({
  id:'l262', index:262, udemyId:40494294, minutes:19, section:'s33', slug:'update-delete-alter-drop', kind:'sql',
  title:'How to update and delete data & tables',
  blurb:'Changing what already exists. <code>ALTER TABLE</code> changes structure: rename a table, change a column\'s type, add a column or a constraint such as <code>UNIQUE (user_id, country_code)</code>. <code>UPDATE ... SET ... WHERE</code> changes rows, <code>ORDER BY name DESC</code> sorts a result, <code>DELETE FROM ... WHERE</code> removes rows, and <code>DROP TABLE</code> removes a whole table. Forget the WHERE and UPDATE or DELETE hits every row.',
  tasks:[
    'Warm-up with ALTER: rename <code>student</code> to <code>pupil</code>; change <code>contact_detail.tel</code> to <code>VARCHAR(20)</code> with <code>ALTER COLUMN ... TYPE</code>; add an <code>email TEXT</code> column to <code>contact_detail</code>. (The video renames it to <code>user</code>, a reserved word that then has to be written <code>"user"</code> in quotes.)',
    'Challenge 1: <code>ALTER TABLE visited_countries ADD UNIQUE (user_id, country_code);</code> Then try to give user 1 France again and read the error. Two different users can still share a country.',
    'Challenge 2: user 1 is now called Angelina — <code>UPDATE users SET name = \'Angelina\' WHERE id = 1;</code>. Curious? Run it without the WHERE: the UNIQUE rule on name refuses to give four people the same name.',
    'Challenge 3: <code>SELECT * FROM users ORDER BY name DESC;</code> — Mia, Leo, Jack, Angelina. Then sort by <code>id ASC</code>. ORDER BY changes only the order of the result.',
    'Challenge 4: Jack never went to Australia. Find that row\'s id, delete it by id, then delete Angela\'s France with <code>WHERE user_id = 1 AND country_code = \'FR\'</code>.',
    'Remove the spare <code>old_visits</code> table with <code>DROP TABLE IF EXISTS old_visits;</code>. Run it twice: thanks to IF EXISTS the second run does nothing instead of failing. Press <b>Check my work</b>.'
  ],
  seed:`CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);
INSERT INTO student (first_name, last_name) VALUES ('Angela', 'Yu'), ('Jack', 'Bauer');
CREATE TABLE contact_detail (
  id INTEGER REFERENCES student(id) UNIQUE,
  tel TEXT,
  address TEXT
);
INSERT INTO contact_detail (id, tel, address) VALUES
  (1, '+44 20 7946 0001', '4 Lab Lane'),
  (2, '+44 161 496 0002', '9 Quay Street');
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL,
  color VARCHAR(15)
);
INSERT INTO users (name, color) VALUES ('Angela', 'teal'), ('Jack', 'powderblue'), ('Mia', 'orange'), ('Leo', 'olive');
CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
INSERT INTO visited_countries (country_code, user_id) VALUES
  ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2), ('AU', 2), ('JP', 3), ('BR', 4);
CREATE TABLE old_visits (
  id SERIAL PRIMARY KEY,
  note TEXT
);
INSERT INTO old_visits (note) VALUES ('copied from a spreadsheet'), ('nobody reads this any more');`,
  files:{
'query.sql':`-- users and visited_countries from the Family Travel Tracker,
-- student and contact_detail from the school database, and a spare table old_visits.
SELECT * FROM users;
SELECT * FROM visited_countries;

-- Warm-up: ALTER TABLE changes structure
-- TODO 1: rename student to pupil
-- TODO 2: make contact_detail.tel a VARCHAR(20)
-- TODO 3: add an email column (TEXT) to contact_detail


-- Challenge 1
-- TODO 4: user_id and country_code must be unique together in visited_countries


-- Challenge 2
-- TODO 5: user 1 is now called Angelina


-- Challenge 3
-- TODO 6: every user, sorted by name from Z to A


-- Challenge 4
-- TODO 7: Jack never went to Australia: delete that row by its id
-- TODO 8: delete Angela's France using two conditions joined with AND


-- TODO 9: remove the old_visits table completely, without an error if it is already gone

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already ran part of this.
-- Warm-up
ALTER TABLE student RENAME TO pupil;
ALTER TABLE contact_detail ALTER COLUMN tel TYPE VARCHAR(20);
ALTER TABLE contact_detail ADD COLUMN email TEXT;

-- Challenge 1
ALTER TABLE visited_countries
ADD UNIQUE (user_id, country_code);
-- now INSERT INTO visited_countries (user_id, country_code) VALUES (1, 'FR') is refused

-- Challenge 2
UPDATE users
SET name = 'Angelina'
WHERE id = 1;

-- Challenge 3
SELECT * FROM users ORDER BY name DESC;
SELECT * FROM users ORDER BY id ASC;

-- Challenge 4
SELECT * FROM visited_countries WHERE user_id = 2;
DELETE FROM visited_countries WHERE id = 5;
DELETE FROM visited_countries
WHERE user_id = 1 AND country_code = 'FR';
SELECT * FROM visited_countries;

-- Dropping a whole table
DROP TABLE IF EXISTS old_visits;
DROP TABLE IF EXISTS old_visits;
`},
  checks:[
    { desc:'student was renamed to pupil', sql:`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'pupil'`, expect:1 },
    { desc:'contact_detail.tel is VARCHAR(20)', sql:`SELECT character_maximum_length FROM information_schema.columns WHERE table_name = 'contact_detail' AND column_name = 'tel'`, expect:20 },
    { desc:'contact_detail has an email column', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'contact_detail' AND column_name = 'email'`, expect:1 },
    { desc:'One UNIQUE constraint covers user_id and country_code together', sql:`SELECT COUNT(*) FROM (SELECT tc.constraint_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'visited_countries' AND tc.constraint_type = 'UNIQUE' GROUP BY tc.constraint_name HAVING COUNT(*) = 2) AS pairs`, expect:1 },
    { desc:'User 1 is called Angelina', sql:`SELECT name FROM users WHERE id = 1`, expect:'Angelina' },
    { desc:'User 2 is still Jack', sql:`SELECT name FROM users WHERE id = 2`, expect:'Jack' },
    { desc:'Jack\'s Australia row is gone', sql:`SELECT COUNT(*) FROM visited_countries WHERE user_id = 2 AND country_code = 'AU'`, expect:0 },
    { desc:'Angela\'s France is gone', sql:`SELECT COUNT(*) FROM visited_countries WHERE user_id = 1 AND country_code = 'FR'`, expect:0 },
    { desc:'Jack still has Canada and France', sql:`SELECT COUNT(*) FROM visited_countries WHERE user_id = 2`, expect:2 },
    { desc:'old_visits has been dropped', sql:`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'old_visits'`, expect:0 },
  ],
  quiz:[
    { q:'After <code>ALTER TABLE visited_countries ADD UNIQUE (user_id, country_code)</code>, which insert fails?', options:['User 2 adds FR while user 1 already has FR','User 1 adds FR a second time','User 3 adds JP for the first time','None of them'], answer:1, why:'The combination must be unique. Different users can share a country; one user cannot list it twice.' },
    { q:'What is the difference between <code>DELETE FROM old_visits</code> and <code>DROP TABLE old_visits</code>?', options:['None','DELETE removes the rows and keeps the table; DROP removes the table itself','DROP removes rows only','DELETE needs IF EXISTS'], answer:1, why:'DELETE works on rows. DROP TABLE deletes the whole table — columns, constraints and data.' },
    { q:'What does <code>ORDER BY name DESC</code> do to the users table?', options:['Re-saves the rows in reverse order','Nothing to the table — it only sorts the rows in this result, Z to A','Deletes duplicates','Sorts by id'], answer:1, why:'ORDER BY affects the result of the query. The stored data is untouched.' },
    { q:'You try to add UNIQUE (user_id, country_code) but the table already holds two (1, FR) rows. What happens?', options:['Postgres deletes one','The ALTER fails until the duplicate is removed','The constraint is added and ignored for old rows','The table is dropped'], answer:1, why:'Existing rows must already satisfy a new constraint, otherwise Postgres refuses to add it.' },
  ],
});


/* ---------- 263: Permalist ---------- */

const PERMALIST_SQL = `CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);
INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');`;

const PERMALIST_EJS = `<%- include('partials/header.ejs'); -%>

  <div class="box" id="heading">
    <h1>
      <%= listTitle %>
    </h1>
  </div>
  <div class="box">
    <% for (let item of listItems) { %>
      <div class="item">
        <form action="/delete" method="post">
          <!-- requestSubmit() rather than the course's submit(): it fires the form's submit
               event, which is what the playground's built-in browser listens for -->
          <input type="checkbox" onchange="this.form.requestSubmit()" name="deleteItemId" value="<%= item.id %>">
        </form>

        <p id="title<%= item.id %>">
          <%= item.title %>
        </p>

        <form class="edit" action="/edit" method="post">
          <input type="hidden" name="updatedItemId" value="<%= item.id %>">
          <input id="input<%= item.id %>" type="text" name="updatedItemTitle" value="<%= item.title %>" autocomplete="off"
            autofocus="true" hidden="true" />
          <button id="done<%= item.id %>" class="edit" type="submit" title="Save" hidden>✔️</button>
        </form>
        <button id="edit<%= item.id %>" class="edit" title="Edit" onclick="handler('<%= item.id %>')">✏️</button>
      </div>
    <% } %>

    <form class="item" action="/add" method="post">
      <input type="text" name="newItem" placeholder="New Item" autocomplete="off" autofocus="true" />
      <button class="add" type="submit" name="list" value="<%= listTitle %>">+</button>
    </form>
  </div>

  <script>
    // Swap the title for the edit box (nothing to do with the database)
    function handler(id) {
      document.getElementById("title" + id).setAttribute("hidden", true);
      document.getElementById("edit" + id).setAttribute("hidden", true);
      document.getElementById("done" + id).removeAttribute("hidden");
      document.getElementById("input" + id).removeAttribute("hidden");
    }
  </script>
<%- include('partials/footer.ejs'); -%>
`;

const PERMALIST_CSS = `/* elements switched off with the hidden attribute stay hidden */
[hidden] {
  display: none !important;
}

html {
  min-height: 100%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f7f1 100%);
}

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  color: #26323f;
}

main {
  display: flex;
  justify-content: center;
  padding: 40px 16px 70px;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

.box {
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 26px rgba(38, 50, 63, 0.14);
}

#heading {
  padding: 18px 22px;
  background: #4a6cf7;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 0 18px;
  border-bottom: 1px solid #eef1f5;
}

.item:last-child {
  border-bottom: none;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #4a6cf7;
  cursor: pointer;
}

p {
  flex: 1;
  margin: 0;
  font-size: 1.05rem;
}

form {
  display: flex;
  align-items: center;
  gap: 8px;
}

form.edit {
  flex: 1;
}

button.add,
button.edit {
  font: inherit;
  border: none;
  cursor: pointer;
}

button.add {
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
  line-height: 1;
  color: #ffffff;
  background: #4a6cf7;
  border-radius: 50%;
}

button.edit {
  padding: 4px 8px;
  font-size: 1rem;
  background: none;
}

input[type="text"] {
  flex: 1;
  padding: 10px 4px;
  font: inherit;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
}

input[type="text"]:focus {
  border-bottom-color: #4a6cf7;
}

::placeholder {
  color: #9aa6b4;
}

footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  font-size: 0.8rem;
  text-align: center;
  color: #7a8796;
}
`;

const PERMALIST_LISTEN = `
app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`;

PG.add({
  id:'l263', index:263, udemyId:40494298, minutes:30, section:'s33', slug:'permalist', kind:'node', project:true,
  title:'Permalist Project',
  blurb:'A to-do list whose items live in Postgres instead of an array, using all four CRUD operations with <code>pg</code>. Read: <code>SELECT * FROM items ORDER BY id ASC</code>. Create: <code>INSERT</code> the new title. Update: <code>UPDATE items SET title = ($1) WHERE id = $2</code>, with the id sent from a hidden input. Delete: <code>DELETE FROM items WHERE id = $1</code> when the checkbox is ticked. Every route ends with a redirect home, which reads the list again.',
  tasks:[
    'Run the starter. Items come from an array: adding works, but the pencil and the checkbox do nothing — the browser waits for a reply that never comes. Read <code>index.ejs</code> to see what each form sends: <code>newItem</code> to <code>/add</code>, <code>updatedItemId</code> + <code>updatedItemTitle</code> to <code>/edit</code>, <code>deleteItemId</code> to <code>/delete</code>.',
    'The <code>permalist</code> database already has <code>items</code> (<code>id SERIAL PRIMARY KEY</code>, <code>title VARCHAR(100) NOT NULL</code>) holding Buy milk and Finish homework. Import <code>pg</code>, create a <code>pg.Client</code> for the database <code>permalist</code> and connect.',
    '<code>GET /</code>: inside try/catch, <code>SELECT * FROM items ORDER BY id ASC</code>, put <code>result.rows</code> in <code>items</code> and render it as <code>listItems</code> with <code>listTitle: "Today"</code>.',
    '<code>POST /add</code>: <code>INSERT INTO items (title) VALUES ($1)</code> with <code>[req.body.newItem]</code>, then redirect to <code>/</code>. Delete the old <code>items.push</code>.',
    '<code>POST /edit</code>: <code>UPDATE items SET title = ($1) WHERE id = $2</code> with <code>[req.body.updatedItemTitle, req.body.updatedItemId]</code> — the array order must match $1 and $2 — then redirect.',
    '<code>POST /delete</code>: <code>DELETE FROM items WHERE id = $1</code> with <code>[req.body.deleteItemId]</code>, then redirect.',
    'Test all three, then reload with ⟳: the list is read from the database every time. Upgrade ideas from the lecture: a <code>created_at</code> column added with ALTER TABLE, or several lists in a lists table.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: PERMALIST_SQL },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/add', body:{ newItem:'Walk the dog' }, expect:302 },
    { method:'POST', path:'/edit', body:{ updatedItemId:'1', updatedItemTitle:'Buy oat milk' }, expect:302 },
    { method:'POST', path:'/delete', body:{ deleteItemId:'2' }, expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
// TODO 1: import pg

const app = express();
const port = 3000;

// TODO 2: a pg.Client for the "permalist" database (user "postgres", host "localhost",
//         password "your-password", port 5432) — then connect

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", (req, res) => {
  // TODO 3: read the list from the items table, ordered by id
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  // TODO 4: INSERT the new title instead of pushing it into the array
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  // TODO 5: UPDATE the title of the item whose id was sent, then redirect
});

app.post("/delete", (req, res) => {
  // TODO 6: DELETE the item whose id was sent, then redirect
});
` + PERMALIST_LISTEN,
'views/index.ejs':PERMALIST_EJS,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="styles/main.css" />
  <title>Permalist</title>
</head>

<body>
  <main>
`,
'views/partials/footer.ejs':`  </main>
  <footer>Copyright © <%= new Date().getFullYear() %></footer>
</body>

</html>
`,
'public/styles/main.css':PERMALIST_CSS,
'package.json':PKG('permalist'),
  },
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "your-password", // your own Postgres password; never commit a real one
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
` + PERMALIST_LISTEN,
  },
  notes:`<p><b>About "permanent" in this playground.</b> On your own machine the rows survive a server restart because they live in Postgres. Here, pressing ▶ Run rebuilds the practice database from the lesson's starting data, so a restart resets the list in both versions. While the server runs, every page load (⟳) reads the list back from the database. The delete checkbox calls <code>this.form.requestSubmit()</code> instead of the course's <code>this.form.submit()</code>: only requestSubmit fires the submit event that the built-in browser intercepts. In a real browser both work.</p>`,
  quiz:[
    { q:'Why does GET / use <code>ORDER BY id ASC</code>?', options:['SELECT fails without it','Without it Postgres may return an edited row in a different place, so the list would jump around','It removes duplicates','It is needed for SERIAL'], answer:1, why:'Row order is not guaranteed without ORDER BY. Sorting by id keeps items where they were added.' },
    { q:'How does <code>POST /edit</code> know which item to change?', options:['From the title text','From a hidden input named updatedItemId that carries the item\'s id','From the URL','It updates the last item'], answer:1, why:'The browser shows only the title, but the form also sends the id in a hidden field.' },
    { q:'What goes wrong with <code>db.query("UPDATE items SET title = ($1) WHERE id = $2", [id, item])</code>?', options:['Nothing','$1 receives the id and $2 the title: wrong title, and the WHERE matches nothing (or fails)','Postgres sorts the array','It deletes the item'], answer:1, why:'Placeholders are filled by position. The array order must match $1, $2.' },
    { q:'Why does every POST route end with <code>res.redirect("/")</code>?', options:['To log out','The browser then requests GET /, which reads the fresh list from the database and renders it','POST routes cannot render','It commits the transaction'], answer:1, why:'Redirecting home reuses the one route that knows how to read and display the list.' },
  ],
});


PG.add({
  id:'l264', index:264, udemyId:17967564, minutes:3, section:'s33', slug:'tip-daily-routines', kind:'read',
  title:'Tip from Angela - Daily Routines',
  blurb:'A habit tip: a fixed daily routine removes small decisions and leaves more energy for learning. Start the day with a short walk, then do the hardest or most-avoided topic first; on a task that lasts several days, give it at least an hour every day until coding becomes a habit.',
});

})();
