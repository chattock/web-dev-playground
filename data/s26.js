/* ===== Section 26 — Capstone Project: Create a Blog Web Application ===== */

PG.add({
  id:'l215', index:215, udemyId:38516770, minutes:3, section:'s26', slug:'blog-capstone', kind:'node', project:true,
  title:'Instructions',
  blurb:'The first capstone comes as a brief and nothing more: a blog built with Express and EJS where posts can be written, listed, read, edited and deleted, kept in memory (no database yet), with a layout that works on a desktop and on a phone. This version gives you a scaffold to start from (the server set-up, header and footer partials, a stylesheet and empty views); the routes and templates are yours to write.',
  tasks:[
    'Read the scaffold: the posts live in the <code>posts</code> array in <code>index.js</code>, and every view is wrapped in the header and footer partials. Then list the posts in <code>views/index.ejs</code>: the title as a link to <code>/posts/&lt;id&gt;</code>, the date and a short excerpt, or a "no posts yet" message when the array is empty.',
    'Create: add <code>GET /compose</code> (renders the form) and <code>POST /compose</code> (adds a post with the next id and today\'s date, then redirects to <code>/</code>). Build the form in <code>compose.ejs</code> with inputs named <code>title</code> and <code>content</code>.',
    'Read: add <code>GET /posts/:id</code>. Turn <code>req.params.id</code> into a number, find the post and render <code>post.ejs</code>, or answer <code>res.status(404).render("404.ejs")</code> when there is none.',
    'Edit: <code>GET /edit/:id</code> renders <code>edit.ejs</code> with the form already filled in; <code>POST /edit/:id</code> updates the title and content and redirects to the post.',
    'Delete: give <code>post.ejs</code> a Delete button (a small form that POSTs to <code>/delete/&lt;id&gt;</code>) and add a <code>POST /delete/:id</code> route that removes the post and redirects home.',
    'Style: make the CSS your own and add a media query so the header and buttons stack on a phone-width screen. Then test the whole flow in the built-in browser: create, read, edit, delete.'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/compose', expect:200 },
    { method:'POST', path:'/compose', body:{ title:'Hello from the smoke test', content:'First line.\nSecond line.' }, expect:302 },
    { method:'GET', path:'/posts/3', expect:200 },
    { method:'GET', path:'/edit/1', expect:200 },
    { method:'POST', path:'/edit/1', body:{ title:'Why I started this blog (edited)', content:'Shorter now.' }, expect:302 },
    { method:'GET', path:'/posts/1', expect:200 },
    { method:'POST', path:'/delete/2', expect:302 },
    { method:'GET', path:'/posts/2', expect:404 },
    { method:'GET', path:'/styles/main.css', expect:200 },
  ],
  files:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Posts live in memory, newest first. They reset whenever the server restarts.
let posts = [
  {
    id: 2,
    title: "Three things I wish I had known about Git",
    content: "Commit small and often. A commit is a save point, and more save points means smaller steps back when something breaks.\\nRead git status before every add and every commit. It takes a second and it is always right.\\nPut secrets in a .env file and list that file in .gitignore before the first commit, not after.",
    date: "Mon Jan 19 2026",
  },
  {
    id: 1,
    title: "Why I started this blog",
    content: "Every week I learn something new about building websites, and every week I forget half of it. Writing it down here is how I keep it.\\nExpect short posts about Node, Express and EJS, and about whatever breaks along the way.",
    date: "Mon Jan 12 2026",
  },
];
let nextId = 3;

// Home page: every post
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

// TODO 2: GET /compose → render compose.ejs (the new-post form)

// TODO 2: POST /compose → add { id: nextId++, title, content, date: new Date().toDateString() }
//         to posts (unshift puts it first), then redirect to "/"

// TODO 3: GET /posts/:id → find the post whose id is Number(req.params.id) and render post.ejs,
//         or res.status(404).render("404.ejs") when there is none

// TODO 4: GET /edit/:id → render edit.ejs with that post, so the form starts filled in
// TODO 4: POST /edit/:id → update the post's title and content, then redirect to /posts/:id

// TODO 5: POST /delete/:id → remove the post from the array, then redirect to "/"

app.listen(port, () => {
  console.log(\`Blog running on http://localhost:\${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header.ejs") %>

<h1>All posts</h1>

<p class="meta">posts holds <%= posts.length %> posts right now. Replace this line with the list.</p>

<%# TODO 1: if there are no posts, say so and link to /compose.
    Otherwise loop over posts and show, for each one:
    - the title, as a link to /posts/ followed by its id
    - the date
    - the first 150 characters of the content %>

<%- include("partials/footer.ejs") %>
`,
'views/compose.ejs':`<%- include("partials/header.ejs") %>

<h1>New post</h1>

<%# TODO 2: a form (class="post-form") that POSTs to /compose, with
    - a label and a text input named "title"
    - a label and a textarea named "content"
    - a submit button, and a Cancel link back to / %>

<%- include("partials/footer.ejs") %>
`,
'views/post.ejs':`<%- include("partials/header.ejs") %>

<%# TODO 3: show post.title in an h1, post.date (class="meta") and post.content (class="post-body").
    TODO 4: an Edit link to /edit/ followed by the post's id.
    TODO 5: a Delete button: a form that POSTs to /delete/ followed by the post's id.
            HTML forms can only send GET or POST, so deleting goes through a POST route. %>

<%- include("partials/footer.ejs") %>
`,
'views/edit.ejs':`<%- include("partials/header.ejs") %>

<h1>Edit post</h1>

<%# TODO 4: copy the form from compose.ejs and change it so that
    - it POSTs to /edit/ followed by the post's id
    - the title input's value attribute holds the current title (an output tag)
    - the textarea holds the current content between its opening and closing tags %>

<%- include("partials/footer.ejs") %>
`,
'views/404.ejs':`<%- include("partials/header.ejs") %>

<h1>Post not found</h1>
<p>That post does not exist, or it has been deleted. <a href="/">Back to all posts</a></p>

<%- include("partials/footer.ejs") %>
`,
'views/partials/header.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Field Notes</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">Field Notes</a>
    <nav>
      <a href="/">All posts</a>
      <a class="button" href="/compose">New post</a>
    </nav>
  </header>
  <main class="container">
`,
'views/partials/footer.ejs':`  </main>
  <footer class="site-footer">
    <p>© <%= new Date().getFullYear() %> Field Notes · posts are kept in memory and vanish when the server restarts</p>
  </footer>
</body>
</html>
`,
'public/styles/main.css':`:root {
  --ink: #1d2230;
  --muted: #5d6478;
  --paper: #fbfaf7;
  --card: #ffffff;
  --line: #e4e1d8;
  --accent: #b4462f;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.65;
}

a {
  color: var(--accent);
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--line);
  font-family: var(--sans);
}

.brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--ink);
  text-decoration: none;
}

.site-header nav {
  display: flex;
  gap: 14px;
  align-items: center;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

h1 {
  font-size: 2.1rem;
  line-height: 1.2;
  margin: 0 0 24px;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-card {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.post-card h2 {
  margin: 0 0 4px;
  font-size: 1.35rem;
}

.post-card h2 a {
  color: var(--ink);
  text-decoration: none;
}

.post-card h2 a:hover {
  color: var(--accent);
}

.meta {
  margin: 0 0 8px;
  color: var(--muted);
  font: 0.9rem var(--sans);
}

.post-body {
  white-space: pre-line;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 28px;
}

.button,
button {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--ink);
  border-radius: 6px;
  background: var(--ink);
  color: #fff;
  font: 600 0.95rem var(--sans);
  text-decoration: none;
  cursor: pointer;
}

.button.secondary {
  background: transparent;
  color: var(--ink);
}

button.danger {
  background: var(--accent);
  border-color: var(--accent);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-form label {
  font: 600 0.95rem var(--sans);
}

.post-form input[type="text"],
.post-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--card);
  font: inherit;
}

.post-form textarea {
  min-height: 220px;
  resize: vertical;
}

.empty {
  color: var(--muted);
}

.site-footer {
  padding: 24px;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--muted);
  font: 0.85rem var(--sans);
}

/* TODO 6: make it yours, and add a media query for phone-width screens */
`},
  solution:{
'index.js':`import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Posts live in memory, newest first. They reset whenever the server restarts.
let posts = [
  {
    id: 2,
    title: "Three things I wish I had known about Git",
    content: "Commit small and often. A commit is a save point, and more save points means smaller steps back when something breaks.\\nRead git status before every add and every commit. It takes a second and it is always right.\\nPut secrets in a .env file and list that file in .gitignore before the first commit, not after.",
    date: "Mon Jan 19 2026",
  },
  {
    id: 1,
    title: "Why I started this blog",
    content: "Every week I learn something new about building websites, and every week I forget half of it. Writing it down here is how I keep it.\\nExpect short posts about Node, Express and EJS, and about whatever breaks along the way.",
    date: "Mon Jan 12 2026",
  },
];
let nextId = 3;

// route parameters arrive as strings, ids are numbers
function findPost(id) {
  return posts.find((post) => post.id === Number(id));
}

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  const post = {
    id: nextId++,
    title: req.body.title,
    content: req.body.content,
    date: new Date().toDateString(),
  };
  posts.unshift(post);
  res.redirect("/");
});

app.get("/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).render("404.ejs");
  }
  res.render("post.ejs", { post: post });
});

app.get("/edit/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).render("404.ejs");
  }
  res.render("edit.ejs", { post: post });
});

app.post("/edit/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).render("404.ejs");
  }
  post.title = req.body.title;
  post.content = req.body.content;
  res.redirect("/posts/" + post.id);
});

app.post("/delete/:id", (req, res) => {
  posts = posts.filter((post) => post.id !== Number(req.params.id));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(\`Blog running on http://localhost:\${port}\`);
});
`,
'views/index.ejs':`<%- include("partials/header.ejs") %>

<h1>All posts</h1>

<% if (posts.length === 0) { %>
  <p class="empty">No posts yet. <a href="/compose">Write the first one</a>.</p>
<% } else { %>
  <ul class="post-list">
    <% posts.forEach((post) => { %>
      <li class="post-card">
        <h2><a href="/posts/<%= post.id %>"><%= post.title %></a></h2>
        <p class="meta"><%= post.date %></p>
        <p><%= post.content.length > 150 ? post.content.slice(0, 150) + "…" : post.content %></p>
      </li>
    <% }) %>
  </ul>
<% } %>

<%- include("partials/footer.ejs") %>
`,
'views/compose.ejs':`<%- include("partials/header.ejs") %>

<h1>New post</h1>

<form class="post-form" action="/compose" method="POST">
  <label for="title">Title</label>
  <input type="text" id="title" name="title" required>
  <label for="content">Content</label>
  <textarea id="content" name="content" required></textarea>
  <div class="actions">
    <button type="submit">Publish</button>
    <a class="button secondary" href="/">Cancel</a>
  </div>
</form>

<%- include("partials/footer.ejs") %>
`,
'views/post.ejs':`<%- include("partials/header.ejs") %>

<article>
  <h1><%= post.title %></h1>
  <p class="meta"><%= post.date %></p>
  <div class="post-body"><%= post.content %></div>
</article>

<div class="actions">
  <a class="button secondary" href="/edit/<%= post.id %>">Edit</a>
  <form action="/delete/<%= post.id %>" method="POST">
    <button class="danger" type="submit">Delete</button>
  </form>
</div>

<%- include("partials/footer.ejs") %>
`,
'views/edit.ejs':`<%- include("partials/header.ejs") %>

<h1>Edit post</h1>

<form class="post-form" action="/edit/<%= post.id %>" method="POST">
  <label for="title">Title</label>
  <input type="text" id="title" name="title" value="<%= post.title %>" required>
  <label for="content">Content</label>
  <textarea id="content" name="content" required><%= post.content %></textarea>
  <div class="actions">
    <button type="submit">Save changes</button>
    <a class="button secondary" href="/posts/<%= post.id %>">Cancel</a>
  </div>
</form>

<%- include("partials/footer.ejs") %>
`,
'public/styles/main.css':`:root {
  --ink: #1d2230;
  --muted: #5d6478;
  --paper: #fbfaf7;
  --card: #ffffff;
  --line: #e4e1d8;
  --accent: #b4462f;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.65;
}

a {
  color: var(--accent);
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--line);
  font-family: var(--sans);
}

.brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--ink);
  text-decoration: none;
}

.site-header nav {
  display: flex;
  gap: 14px;
  align-items: center;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

h1 {
  font-size: 2.1rem;
  line-height: 1.2;
  margin: 0 0 24px;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-card {
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.post-card h2 {
  margin: 0 0 4px;
  font-size: 1.35rem;
}

.post-card h2 a {
  color: var(--ink);
  text-decoration: none;
}

.post-card h2 a:hover {
  color: var(--accent);
}

.meta {
  margin: 0 0 8px;
  color: var(--muted);
  font: 0.9rem var(--sans);
}

.post-body {
  white-space: pre-line;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 28px;
}

.button,
button {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--ink);
  border-radius: 6px;
  background: var(--ink);
  color: #fff;
  font: 600 0.95rem var(--sans);
  text-decoration: none;
  cursor: pointer;
}

.button.secondary {
  background: transparent;
  color: var(--ink);
}

button.danger {
  background: var(--accent);
  border-color: var(--accent);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-form label {
  font: 600 0.95rem var(--sans);
}

.post-form input[type="text"],
.post-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--card);
  font: inherit;
}

.post-form textarea {
  min-height: 220px;
  resize: vertical;
}

.empty {
  color: var(--muted);
}

.site-footer {
  padding: 24px;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--muted);
  font: 0.85rem var(--sans);
}

/* phones: stack the header and the buttons, tighten the spacing */
@media (max-width: 600px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .container {
    padding: 24px 16px 40px;
  }

  h1 {
    font-size: 1.7rem;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions .button,
  .actions button {
    width: 100%;
    text-align: center;
  }
}
`},
  notes:`
    <h3>A route plan</h3>
    <table>
      <tr><th>Action</th><th>Method and path</th><th>What it does</th></tr>
      <tr><td>List</td><td><code>GET /</code></td><td>render index.ejs with every post</td></tr>
      <tr><td>New-post form</td><td><code>GET /compose</code></td><td>render compose.ejs</td></tr>
      <tr><td>Create</td><td><code>POST /compose</code></td><td>add a post, redirect to /</td></tr>
      <tr><td>Read</td><td><code>GET /posts/:id</code></td><td>render post.ejs, or a 404</td></tr>
      <tr><td>Edit form</td><td><code>GET /edit/:id</code></td><td>render edit.ejs with the post</td></tr>
      <tr><td>Update</td><td><code>POST /edit/:id</code></td><td>change the title and content, redirect to the post</td></tr>
      <tr><td>Delete</td><td><code>POST /delete/:id</code></td><td>remove the post, redirect to /</td></tr>
    </table>
    <h3>Hints</h3>
    <ul>
      <li><code>req.params.id</code> is always a string. Compare with <code>post.id === Number(req.params.id)</code>.</li>
      <li>Give each post its own id from a counter (<code>nextId++</code>). Using the array position as the id breaks as soon as a post is deleted.</li>
      <li>HTML forms can only send GET and POST, which is why edit and delete use POST routes here.</li>
      <li>Redirect after every POST so that a refresh does not submit the form a second time.</li>
      <li>Every ▶ Run restarts the server, which brings back the two sample posts. On your own machine, nodemon does the same on every save.</li>
    </ul>`,
  quiz:[
    { q:'Why do the edit and delete features use POST routes rather than PUT and DELETE?', options:['POST is faster','HTML forms can only send GET or POST','Express has no app.delete','A DELETE request cannot carry an id'], answer:1, why:'A plain HTML form only knows GET and POST. PUT, PATCH and DELETE come into play when JavaScript or an API client sends the request.' },
    { q:'<code>posts.find((p) =&gt; p.id === req.params.id)</code> never finds anything. Why?', options:['find only works on strings','req.params.id is a string, and === does not turn "1" into 1','The posts array is empty','find needs a second argument'], answer:1, why:'Route parameters always arrive as strings. Convert with Number(req.params.id) first.' },
    { q:'What happens to the posts when the server restarts?', options:['They are saved to a file automatically','They are gone; only the sample posts written in the code come back','They move into the browser','Express caches them'], answer:1, why:'The array lives in the memory of the server process. Keeping data across restarts needs a database, which comes later in the course.' },
    { q:'Why redirect after handling <code>POST /compose</code> instead of rendering a page straight away?', options:['Rendering is not allowed after a POST','So that a refresh reloads the list instead of submitting the form again','Redirects are faster','It clears the posts array'], answer:1, why:'After a redirect the browser\'s last request is a GET, so refreshing it is harmless.' },
  ],
});
