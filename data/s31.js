/* ===== Section 31 — Databases ===== */

PG.add({
  id:'l240', index:240, udemyId:40494138, minutes:16, section:'s31', slug:'sql-vs-nosql', kind:'read',
  title:'Databases Explained: SQL vs. NoSQL',
  blurb:'The blog API kept its posts in an array, so every restart wiped them: variables live in memory, which does not survive. A database stores data durably. <b>SQL</b> (relational) databases keep it in tables with columns planned up front and are strong at relationships and joins; <b>NoSQL</b> databases store flexible JSON-like documents or key/value pairs. The course uses PostgreSQL from here on.',
  explore:[{
    title:'The same users as tables and as documents', height:520,
    note:'Change the data and compare the two models. In SQL every row shares the same columns, so one new field means a new column for everybody (NULL where there is no value), and related data lives in its own table linked by an id. A document can simply gain a key, and related data can be nested inside it.',
    html:`
<div class="knobs">
  <button id="food">Ava adds a favourite food</button>
  <button id="post">Ben writes a post</button>
  <button id="reset">reset</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:280px"><h4>SQL: tables</h4><div class="stage" id="sql"></div></div>
  <div style="flex:1;min-width:250px"><h4>NoSQL: documents</h4><pre class="readout" id="doc" style="max-height:380px;overflow:auto"></pre></div>
</div>
<script>
  var S;
  var $ = function (id) { return document.getElementById(id); };
  function cell(v) { return v === null ? '<td style="color:#9aa3b8;font-style:italic">NULL</td>' : '<td>' + v + '</td>'; }
  function table(name, cols, rows) {
    return '<div class="tag">' + name + '</div><table class="grid" style="margin:6px 0 12px">' +
      '<tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(cell).join('') + '</tr>'; }).join('') + '</table>';
  }
  function paint() {
    var cols = ['id', 'name', 'email'], rows = [[1, 'Ava', 'ava@example.com'], [2, 'Ben', 'ben@example.com'], [3, 'Chen', 'chen@example.com']];
    if (S.food) { cols.push('favourite_food'); rows = rows.map(function (r) { return r.concat([r[0] === 1 ? 'noodles' : null]); }); }
    var html = table('users', cols, rows);
    if (S.food) html += '<p class="note">ALTER TABLE users ADD COLUMN favourite_food … gave every row the new column.</p>';
    if (S.post) html += table('posts', ['id', 'title', 'user_id'], [[1, 'My first post', 2]]) +
      '<p class="note">user_id 2 points at the row for Ben. That link is the relationship: a JOIN can list each post with its author.</p>';
    $('sql').innerHTML = html;
    var docs = [{ _id: 1, name: 'Ava', email: 'ava@example.com' }, { _id: 2, name: 'Ben', email: 'ben@example.com' }, { _id: 3, name: 'Chen', email: 'chen@example.com' }];
    if (S.food) docs[0].favouriteFood = 'noodles';
    if (S.post) docs[1].posts = [{ title: 'My first post' }];
    $('doc').textContent = docs.map(function (d) { return JSON.stringify(d, null, 2); }).join('\\n');
  }
  $('food').onclick = function () { S.food = true; paint(); };
  $('post').onclick = function () { S.post = true; paint(); };
  $('reset').onclick = function () { S = { food: false, post: false }; paint(); };
  S = { food: false, post: false };
  paint();
<\/script>`,
  }],
  quiz:[
    { q:'Why did the blog API lose new posts every time it restarted?', options:['Axios deleted them','PATCH overwrote them','They lived in a JavaScript array in memory, which is wiped when the process stops','The browser cache expired'], answer:2, why:'Variables are volatile. Persistence needs storage that outlives the process, which is the job of a database.' },
    { q:'What is the main strength of a SQL (relational) database?', options:['No schema to plan','It needs no query language','It stores everything as JSON','Relationships: tables can reference each other (one user, many posts) and be joined in a query'], answer:3, why:'Planned tables plus foreign keys make joins efficient and results predictable.' },
    { q:'One user needs an extra field that nobody else has. Which model absorbs that without touching the other records?', options:['A NoSQL document store','A SQL table','Neither','Both equally'], answer:0, why:'A document can gain a key on its own; a table would need a new column for every row.' },
    { q:'Which database does the course switch to from this point on?', options:['MongoDB','Redis','PostgreSQL','DynamoDB'], answer:2, why:'PostgreSQL is free, open source, widely used professionally, and tops the developer surveys the lecture shows.' },
  ],
});


PG.add({
  id:'l241', index:241, udemyId:17967524, minutes:6, section:'s31', slug:'tip-lemons', kind:'read',
  title:'Tip from Angela - When Life Gives You Lemons',
  blurb:'A personal story about an unfair setback, and the lesson drawn from it: other people’s decisions are outside your control, but how you read what happened and what you do next are not. Applied to learning to code, keep working and keep building when obstacles turn up.',
});
