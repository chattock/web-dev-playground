/* ===== Section 34 — Capstone Project: Book Notes ===== */
(function () {

const SEED = `CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20),
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  date_read DATE,
  notes TEXT
);

INSERT INTO books (title, author, isbn, rating, date_read, notes) VALUES
('Eloquent JavaScript', 'Marijn Haverbeke', '9781593279509', 9, '2025-01-14',
 'The chapter on asynchronous programming is where promises finally clicked. I did every exercise in the browser console, and the project chapters are the best part.'),
('The Pragmatic Programmer', 'David Thomas and Andrew Hunt', '9780135957059', 10, '2024-11-02',
 'Broken windows, tracer bullets, DRY. It reads like advice from a patient senior colleague. I reread the section on estimating before every planning meeting.'),
('Project Hail Mary', 'Andy Weir', '9780593135204', 9, '2025-03-28',
 'Finished it in three evenings. The science puzzles are fun, but the friendship at the centre of the story is what stayed with me.'),
('Atomic Habits', 'James Clear', '9780735211292', 7, '2024-08-19',
 'One useful idea: make the habit obvious, easy and tracked. Longer than it needs to be, but it got me coding for twenty minutes every morning.'),
('Don''t Make Me Think, Revisited', 'Steve Krug', '9780321965516', 8, '2025-02-09',
 'Short and practical. Every page I build now gets the hurried-visitor test: where would someone in a rush click first?');`;

const HEADER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Notes</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">📚 Book Notes</a>
    <a class="btn" href="/new">+ Add a book</a>
  </header>
  <main>
`;

const FOOTER = `  </main>
  <footer class="foot">Covers from the Open Library Covers API</footer>
</body>
</html>
`;

const CSS = `* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  background: #faf7f2;
  color: #2b2622;
}

a { color: #8a4b2a; }

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #2b2622;
}
.topbar a { text-decoration: none; }
.brand { color: #faf7f2; font-size: 1.3rem; font-weight: bold; }

main { max-width: 860px; margin: 0 auto; padding: 20px; }

.btn {
  display: inline-block;
  padding: 8px 14px;
  border: 0;
  border-radius: 6px;
  background: #8a4b2a;
  color: #fff;
  font: inherit;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
}
.btn.secondary { background: #e9e2d8; color: #2b2622; }

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}
.sort { font-family: -apple-system, "Segoe UI", sans-serif; font-size: 0.9rem; color: #6b625b; }
.sort a { margin-left: 6px; padding: 3px 10px; border-radius: 12px; color: #6b625b; text-decoration: none; }
.sort a.on { background: #2b2622; color: #faf7f2; }

.book {
  display: flex;
  gap: 18px;
  margin: 16px 0;
  padding: 16px;
  background: #fff;
  border: 1px solid #e9e2d8;
  border-radius: 10px;
}

/* The 📖 shows when there is no ISBN, or when Open Library has no cover
   (it then sends a transparent 1x1 image, so the placeholder shows through). */
.cover {
  position: relative;
  flex: 0 0 96px;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background: #e9e2d8;
  font-size: 2rem;
}
.cover::before { content: "📖"; }
.cover img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.info h2 { margin: 0 0 4px; font-size: 1.25rem; }
.author { margin: 0; color: #6b625b; font-style: italic; }
.meta { margin: 6px 0; font-family: -apple-system, "Segoe UI", sans-serif; font-size: 0.85rem; color: #6b625b; }
.notes { margin: 8px 0; line-height: 1.5; }
.actions { display: flex; gap: 12px; align-items: center; font-family: -apple-system, "Segoe UI", sans-serif; font-size: 0.85rem; }
.actions form { margin: 0; }
.link { padding: 0; border: 0; background: none; color: #8a4b2a; font: inherit; text-decoration: underline; cursor: pointer; }
.link.danger { color: #b3261e; }
.empty { color: #6b625b; }

.book-form {
  max-width: 600px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e9e2d8;
  border-radius: 10px;
}
.book-form label {
  display: block;
  margin: 12px 0 4px;
  font-family: -apple-system, "Segoe UI", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
}
.book-form input,
.book-form textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d6cdc1;
  border-radius: 6px;
  font: inherit;
}
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.row > div { flex: 1 1 150px; }
.hint { font-weight: 400; color: #6b625b; }
.error { padding: 10px 12px; border-radius: 6px; background: #fde8e7; color: #b3261e; }

.foot { padding: 30px 20px; text-align: center; font-size: 0.8rem; color: #6b625b; }
`;

const NEW_FORM = `<%- include("partials/header") %>

<h1>Add a book</h1>

<% if (locals.error) { %>
  <p class="error"><%= error %></p>
<% } %>

<form class="book-form" action="/new" method="POST">
  <label for="title">Title</label>
  <input id="title" name="title" required>

  <label for="author">Author</label>
  <input id="author" name="author" required>

  <div class="row">
    <div>
      <label for="isbn">ISBN <span class="hint">(for the cover)</span></label>
      <input id="isbn" name="isbn" placeholder="9780547928227">
    </div>
    <div>
      <label for="rating">Rating (1–10)</label>
      <input id="rating" name="rating" type="number" min="1" max="10" required>
    </div>
    <div>
      <label for="date_read">Date read</label>
      <input id="date_read" name="date_read" type="date">
    </div>
  </div>

  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="6"></textarea>

  <p>
    <button type="submit" class="btn">Save book</button>
    <a href="/" class="btn secondary">Cancel</a>
  </p>
</form>

<%- include("partials/footer") %>
`;

const PKG = `{
  "name": "book-notes",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "body-parser": "^2.2.0",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "pg": "^8.16.3"
  }
}
`;

PG.add({
  id:'l265', index:265, udemyId:40325688, minutes:0, section:'s34', slug:'book-notes-capstone', kind:'node', project:true,
  title:'Instructions — Book Notes Capstone',
  blurb:'The capstone pulls the back-end sections together: a personal reading log in Express, EJS and PostgreSQL. Every book has a title, author, ISBN, rating, date read and notes; the list can be sorted, and books can be added, edited and deleted. Covers come from the <b>Open Library Covers API</b>, which serves a cover image for an ISBN at <code>https://covers.openlibrary.org/b/isbn/&lt;ISBN&gt;-M.jpg</code>, so a plain <code>&lt;img&gt;</code> is enough.',
  tasks:[
    '<b>Read.</b> The <code>books</code> table from <code>queries.sql</code> already holds five books (each ▶ Run starts from this seed again). In <code>GET /</code>, select every book, newest <code>date_read</code> first, and pass the rows to <code>index.ejs</code>. There, loop over <code>books</code> and print one card per book: the cover <code>&lt;img&gt;</code> (only when there is an ISBN), title, author, rating, date read and notes.',
    '<b>Sort.</b> Add a <code>SORTS</code> object that maps <code>recency</code>, <code>rating</code> and <code>title</code> to <code>ORDER BY</code> clauses. Read <code>req.query.sort</code>, fall back to <code>recency</code> for anything else, and give the matching link the class <code>on</code>. Try <code>/?sort=title</code>, then <code>/?sort=pizza</code>: it should quietly fall back, with no error.',
    '<b>Create.</b> <code>POST /new</code>: insert the form fields with <code>$1</code>…<code>$6</code> placeholders (store <code>null</code> when the date is left empty), then redirect to <code>/</code>. Add <i>The Hobbit</i> by J.R.R. Tolkien, ISBN <code>9780547928227</code>, and watch its cover appear.',
    '<b>Update.</b> <code>GET /books/:id/edit</code> loads one book, or sends a 404 when the id does not exist. Build <code>edit.ejs</code> as a pre-filled copy of the new-book form, and make <code>POST /books/:id/edit</code> run an <code>UPDATE … WHERE id = $7</code>.',
    '<b>Delete.</b> Give every card a small <code>&lt;form method="POST" action="/books/ID/delete"&gt;</code> with a Delete button, and a route that deletes the row and redirects home.',
    '<b>Errors.</b> Wrap every query in <code>try/catch</code>, log the error and send a response, so the page never hangs. Test it in the Postman panel: POST <code>/new</code> with <code>rating=11</code>. The table\'s <code>CHECK</code> rejects it, and your app should re-show the form with a message.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: SEED },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/?sort=rating', expect:200 },
    { method:'GET', path:'/?sort=title', expect:200 },
    { method:'GET', path:'/?sort=pizza', expect:200 },
    { method:'GET', path:'/new', expect:200 },
    { method:'POST', path:'/new', body:{ title:'The Hobbit', author:'J.R.R. Tolkien', isbn:'978-0-547-92822-7', rating:'8', date_read:'2025-04-20', notes:'Reread it before the films. Still cosy.' }, expect:302 },
    { method:'POST', path:'/new', body:{ title:'Too good', author:'Nobody', isbn:'', rating:'11', date_read:'', notes:'' }, expect:500 },
    { method:'GET', path:'/books/1/edit', expect:200 },
    { method:'POST', path:'/books/1/edit', body:{ title:'Eloquent JavaScript', author:'Marijn Haverbeke', isbn:'9781593279509', rating:'10', date_read:'2025-01-14', notes:'Second read: even better.' }, expect:302 },
    { method:'GET', path:'/books/999/edit', expect:404 },
    { method:'POST', path:'/books/2/delete', expect:302 },
    { method:'GET', path:'/', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// In the playground this connects to the lesson's own Postgres, where the
// books table from queries.sql already exists. The settings are the ones you
// would use on your own machine.
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "your-db-password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// TODO 2: an object that maps each allowed ?sort= value to an ORDER BY clause:
//         recency → newest date_read first, rating → highest first, title → A to Z


app.get("/", async (req, res) => {
  // TODO 1: SELECT every book, newest first, and pass result.rows to index.ejs.
  //         Tip: TO_CHAR(date_read, 'FMDD Mon YYYY') AS read_on gives a ready-made date to print.
  // TODO 2: pick the ORDER BY clause from req.query.sort (fall back to "recency")
  //         and pass the chosen key as sort so the page can highlight it.
  // TODO 6: try/catch: log the error and send a 500 message instead of hanging.
  res.render("index.ejs", { books: [], sort: "recency" });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/new", async (req, res) => {
  // TODO 3: INSERT title, author, isbn, rating, date_read and notes from req.body
  //         using $1 … $6, then redirect to "/".
  //         An empty date input arrives as "" — store null instead.
  // TODO 6: on an error, render new.ejs again with { error: "..." } (status 500).
});

// TODO 4: GET /books/:id/edit → SELECT one book (404 if there is no row) and render edit.ejs
//         Tip: TO_CHAR(date_read, 'YYYY-MM-DD') is the format a date input wants.

// TODO 4: POST /books/:id/edit → UPDATE that row from req.body, then redirect to "/"

// TODO 5: POST /books/:id/delete → DELETE that row, then redirect to "/"

app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header") %>

<div class="toolbar">
  <h1>My Book Notes</h1>
  <nav class="sort">
    Sort by
    <!-- TODO 2: give the link that matches sort the class "on" -->
    <a href="/?sort=recency">Most recent</a>
    <a href="/?sort=rating">Rating</a>
    <a href="/?sort=title">Title</a>
  </nav>
</div>

<p class="empty">Your books appear here once GET / passes them in (TODO 1).</p>

<!-- TODO 1: loop over books and output one card per book, like this:

  <article class="book">
    <div class="cover">
      (only when the book has an ISBN)
      <img src="https://covers.openlibrary.org/b/isbn/THE-ISBN-M.jpg" alt="">
    </div>
    <div class="info">
      <h2>TITLE</h2>
      <p class="author">by AUTHOR</p>
      <p class="meta">★ RATING/10 · read DATE</p>
      <p class="notes">NOTES</p>
      <div class="actions">
        TODO 4: an Edit link to /books/ID/edit
        TODO 5: a POST form to /books/ID/delete with <button class="link danger">Delete</button>
      </div>
    </div>
  </article>
-->

<%- include("partials/footer") %>
`,
'views/new.ejs': NEW_FORM,
'views/edit.ejs':`<%- include("partials/header") %>

<h1>Edit a book</h1>

<!-- TODO 4: build the edit form here.
     Copy the form from new.ejs, then
       - send it to /books/ID/edit (use book.id)
       - pre-fill every input's value from book (book.title, book.author, …)
       - the date input needs the YYYY-MM-DD text you selected in the route
       - the notes go between the textarea tags
-->

<%- include("partials/footer") %>
`,
'views/partials/header.ejs': HEADER,
'views/partials/footer.ejs': FOOTER,
'public/styles/main.css': CSS,
'queries.sql':`-- The playground runs this for you every time the server starts.
-- Editing this file changes nothing: it is here so you can see the schema
-- (on your own machine you would run it once in pgAdmin).

` + SEED + '\n',
'package.json': PKG,
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
  database: "book_notes",
  password: "your-db-password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Every sort the list offers. The URL only chooses a key, so nothing typed
// into ?sort= is ever pasted into the SQL.
const SORTS = {
  recency: "date_read DESC NULLS LAST",
  rating: "rating DESC, date_read DESC NULLS LAST",
  title: "title ASC",
};

// Store every ISBN in one tidy form, digits only (plus a final X), however it was typed.
function cleanIsbn(isbn) {
  const digits = (isbn || "").replace(/[^0-9X]/gi, "").toUpperCase();
  return digits || null;
}

// GET / : every book, in the chosen order
app.get("/", async (req, res) => {
  const sort = SORTS[req.query.sort] ? req.query.sort : "recency";
  try {
    // TO_CHAR lets Postgres format the date, so time zones cannot shift the day
    const result = await db.query(
      \`SELECT *, TO_CHAR(date_read, 'FMDD Mon YYYY') AS read_on FROM books ORDER BY \${SORTS[sort]}\`
    );
    res.render("index.ejs", { books: result.rows, sort: sort });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Could not load your books. The terminal shows the database error.");
  }
});

// GET /new : the empty form
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// POST /new : save a book
app.post("/new", async (req, res) => {
  const { title, author, isbn, rating, date_read, notes } = req.body;
  try {
    await db.query(
      "INSERT INTO books (title, author, isbn, rating, date_read, notes) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, cleanIsbn(isbn), rating, date_read || null, notes]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.status(500).render("new.ejs", { error: "That book could not be saved (" + err.message + ")." });
  }
});

// GET /books/:id/edit : the form, filled in
app.get("/books/:id/edit", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT *, TO_CHAR(date_read, 'YYYY-MM-DD') AS date_value FROM books WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("There is no book with that id. <a href='/'>Back to the list</a>");
    }
    res.render("edit.ejs", { book: result.rows[0] });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Could not load that book.");
  }
});

// POST /books/:id/edit : save the changes
app.post("/books/:id/edit", async (req, res) => {
  const { title, author, isbn, rating, date_read, notes } = req.body;
  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, isbn = $3, rating = $4, date_read = $5, notes = $6 WHERE id = $7",
      [title, author, cleanIsbn(isbn), rating, date_read || null, notes, req.params.id]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("That change could not be saved. The terminal shows why.");
  }
});

// POST /books/:id/delete : remove a book
app.post("/books/:id/delete", async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Could not delete that book.");
  }
});

app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header") %>

<div class="toolbar">
  <h1>My Book Notes</h1>
  <nav class="sort">
    Sort by
    <a href="/?sort=recency" class="<%= sort === 'recency' ? 'on' : '' %>">Most recent</a>
    <a href="/?sort=rating" class="<%= sort === 'rating' ? 'on' : '' %>">Rating</a>
    <a href="/?sort=title" class="<%= sort === 'title' ? 'on' : '' %>">Title</a>
  </nav>
</div>

<% if (books.length === 0) { %>
  <p class="empty">No books yet. <a href="/new">Add the first one</a>.</p>
<% } %>

<% books.forEach((book) => { %>
  <article class="book">
    <div class="cover">
      <% if (book.isbn) { %>
        <img src="https://covers.openlibrary.org/b/isbn/<%= book.isbn %>-M.jpg" alt="">
      <% } %>
    </div>
    <div class="info">
      <h2><%= book.title %></h2>
      <p class="author">by <%= book.author %></p>
      <p class="meta">★ <%= book.rating %>/10<% if (book.read_on) { %> · read <%= book.read_on %><% } %></p>
      <% if (book.notes) { %>
        <p class="notes"><%= book.notes %></p>
      <% } %>
      <div class="actions">
        <a href="/books/<%= book.id %>/edit">Edit</a>
        <form action="/books/<%= book.id %>/delete" method="POST">
          <button type="submit" class="link danger">Delete</button>
        </form>
      </div>
    </div>
  </article>
<% }); %>

<%- include("partials/footer") %>
`,
'views/edit.ejs':`<%- include("partials/header") %>

<h1>Edit “<%= book.title %>”</h1>

<form class="book-form" action="/books/<%= book.id %>/edit" method="POST">
  <label for="title">Title</label>
  <input id="title" name="title" value="<%= book.title %>" required>

  <label for="author">Author</label>
  <input id="author" name="author" value="<%= book.author %>" required>

  <div class="row">
    <div>
      <label for="isbn">ISBN <span class="hint">(for the cover)</span></label>
      <input id="isbn" name="isbn" value="<%= book.isbn %>">
    </div>
    <div>
      <label for="rating">Rating (1–10)</label>
      <input id="rating" name="rating" type="number" min="1" max="10" value="<%= book.rating %>" required>
    </div>
    <div>
      <label for="date_read">Date read</label>
      <input id="date_read" name="date_read" type="date" value="<%= book.date_value %>">
    </div>
  </div>

  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="6"><%= book.notes %></textarea>

  <p>
    <button type="submit" class="btn">Save changes</button>
    <a href="/" class="btn secondary">Cancel</a>
  </p>
</form>

<%- include("partials/footer") %>
`,
  },
  explore:[{
    title:'Sorting safely: look the key up, never paste it', height:560,
    note:'Type any <code>?sort=</code> value or press a preset. The left panel shows what happens when the value is pasted straight into the SQL, which is an easy mistake to make in a first version of this project. The right panel shows the <code>SORTS</code> lookup from the solution.',
    html:`
<div class="knobs">
  <label>/?sort= <input type="text" id="q" value="rating" style="width:240px"></label>
  <button data-v="recency">recency</button>
  <button data-v="rating">rating</button>
  <button data-v="title">title</button>
  <button data-v="pizza">pizza</button>
  <button data-v="rating; DROP TABLE books --">rating; DROP TABLE books --</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px">
    <h4>Pasted into the SQL</h4>
    <pre class="readout" id="naive" style="white-space:pre-wrap"></pre>
    <p class="note" id="naiveNote"></p>
  </div>
  <div style="flex:1;min-width:260px">
    <h4>Looked up in SORTS</h4>
    <pre class="readout" id="safe" style="white-space:pre-wrap"></pre>
    <p class="note" id="safeNote"></p>
  </div>
</div>
<div class="stage"><table class="grid" id="rows"></table></div>
<script>
  var SORTS = { recency: 'date_read DESC NULLS LAST', rating: 'rating DESC, date_read DESC NULLS LAST', title: 'title ASC' };
  var COLUMNS = ['id', 'title', 'author', 'isbn', 'rating', 'date_read', 'notes'];
  var BOOKS = [
    { title: 'Eloquent JavaScript', rating: 9, date_read: '2025-01-14' },
    { title: 'The Pragmatic Programmer', rating: 10, date_read: '2024-11-02' },
    { title: 'Project Hail Mary', rating: 9, date_read: '2025-03-28' },
    { title: 'Atomic Habits', rating: 7, date_read: '2024-08-19' },
    { title: "Don't Make Me Think, Revisited", rating: 8, date_read: '2025-02-09' }
  ];
  var q = document.getElementById('q');
  function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
  function sortRows(key) {
    var rows = BOOKS.slice();
    if (key === 'title') rows.sort(function (a, b) { return cmp(a.title, b.title); });
    else if (key === 'rating') rows.sort(function (a, b) { return (b.rating - a.rating) || cmp(b.date_read, a.date_read); });
    else rows.sort(function (a, b) { return cmp(b.date_read, a.date_read); });
    return rows;
  }
  function upd() {
    var v = q.value.trim();
    document.getElementById('naive').textContent = 'SELECT * FROM books ORDER BY ' + v + ' DESC';
    var nn;
    if (v.indexOf(';') >= 0) nn = 'Two statements. With no $1 values, pg sends the text as it is, Postgres runs the SELECT and then DROP TABLE books, and your reading log is gone. The -- turns the trailing DESC into a comment.';
    else if (COLUMNS.indexOf(v.toLowerCase()) >= 0) nn = 'This runs, but only because the visitor happened to type a real column name.';
    else if (!v) nn = 'Syntax error: ORDER BY with nothing after it. The page crashes with a 500.';
    else nn = 'Error: column "' + v + '" does not exist. The page crashes with a 500, and the error tells an attacker how your SQL is built.';
    document.getElementById('naiveNote').textContent = nn;
    var known = Object.prototype.hasOwnProperty.call(SORTS, v);
    var key = known ? v : 'recency';
    document.getElementById('safe').textContent = 'SELECT * FROM books ORDER BY ' + SORTS[key];
    document.getElementById('safeNote').textContent = known
      ? 'Known key: its fixed clause is used. The visitor picked an option; they did not write SQL.'
      : 'Unknown key, so the code falls back to recency. The typed text never reaches Postgres.';
    var html = '<tr><th>#</th><th>title</th><th>rating</th><th>date_read</th></tr>';
    sortRows(key).forEach(function (b, i) { html += '<tr><td>' + (i + 1) + '</td><td>' + b.title + '</td><td>' + b.rating + '</td><td>' + b.date_read + '</td></tr>'; });
    document.getElementById('rows').innerHTML = html;
  }
  document.querySelectorAll('[data-v]').forEach(function (b) { b.addEventListener('click', function () { q.value = b.getAttribute('data-v'); upd(); }); });
  q.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Why does the solution look the sort up in a <code>SORTS</code> object instead of writing <code>ORDER BY $1</code>?', options:['$1 is slower','Placeholders stand for values, not for column names or SQL keywords, so ORDER BY $1 would sort by a constant','pg does not allow $1 in SELECT','ORDER BY must come before WHERE'], answer:1, why:'A placeholder is always sent as data. To let users choose a column you map their choice to SQL you wrote yourself.' },
    { q:'Where does each cover image come from?', options:['It is stored in the books table','The server downloads it with axios on every request','The browser loads it from Open Library, using the ISBN in the image URL','EJS generates it'], answer:2, why:'The template only builds the URL. The visitor\'s browser fetches the picture straight from covers.openlibrary.org.' },
    { q:'What would happen if the UPDATE had no <code>WHERE id = $7</code>?', options:['Nothing would change','Postgres would refuse to run it','Every book in the table would be overwritten with the same values','Only the first book would change'], answer:2, why:'Without a WHERE clause an UPDATE applies to every row. The id narrows it to the book being edited.' },
    { q:'Why do the POST routes end with <code>res.redirect("/")</code> instead of rendering the list?', options:['Rendering is not allowed after a POST','So that a refresh does not resend the form, and the list is reloaded with a fresh GET','Redirects are faster','EJS cannot render after an INSERT'], answer:1, why:'Post/Redirect/Get: the browser ends on a GET page, so reloading it is harmless.' },
  ],
});

})();
