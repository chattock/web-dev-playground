/* ===== Section 29 — Capstone Project: Use a Public API ===== */

PG.add({
  id:'l233', index:233, udemyId:38892394, minutes:2, section:'s29', slug:'public-api-capstone', kind:'node', project:true,
  title:'Instructions',
  blurb:'The capstone brief: build a small Express site around a public API, fetch its data with Axios, present it with EJS and CSS, handle failures gracefully, comment your code and write a README. Only the course APIs are reachable offline in the playground, so this scaffold uses JokeAPI; for your own version, pick any API from a public list and push the project to GitHub.',
  tasks:[
    'Plan before you code: press <b>▶ Run</b> and open <code>/raw</code> a few times. Every joke has a <code>type</code>; a <code>single</code> carries <code>joke</code>, a <code>twopart</code> carries <code>setup</code> and <code>delivery</code>. Those are the fields your page needs.',
    'Write <code>GET /joke</code>: read <code>name</code> and <code>type</code> from <code>req.query</code>, <code>await axios.get(API_URL, { params: … })</code> inside try, and render <code>index.ejs</code> with the joke, the name and the type (the form already uses them to stay filled in). Send <code>type</code> only when the visitor chose one (Axios leaves out <code>undefined</code> params).',
    'In <code>index.ejs</code>, greet the visitor by name and show the joke in the right shape for its <code>type</code>. A <code>&lt;details&gt;</code> element makes a tidy punchline reveal.',
    'Handle failure: in <code>catch</code>, log <code>error.message</code> for yourself and render the page with status 500 and a friendly sentence for the visitor. Test it by breaking <code>API_URL</code> for a moment.',
    'Make it yours in <code>public/styles/main.css</code>, and add a comment above each route explaining what it does.',
    'Fill in <code>README.md</code>: what the site does, which API it uses, and how to run it (<code>npm i</code>, then <code>nodemon index.js</code>).'
  ],
  run:['index.js'],
  start:'/',
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/raw', expect:200 },
    { method:'GET', path:'/joke?name=Ada&type=single', expect:200 },
    { method:'GET', path:'/joke?name=Grace&type=twopart', expect:200 },
    { method:'GET', path:'/joke?name=&type=', expect:200 },
    { method:'GET', path:'/styles/main.css', expect:200 },
  ],
  notes:'<h3>Choosing your own API</h3><ul><li>Browse a list such as <a href="https://github.com/public-apis/public-apis" target="_blank" rel="noopener">public-apis on GitHub</a>; the brief favours APIs that need no key.</li><li>Read the docs first: endpoint, parameters, the shape of the reply, and any rate limit.</li><li>If an API needs a key, keep it in a <code>.env</code> file loaded with <code>dotenv</code> and list <code>.env</code> in <code>.gitignore</code> before you push.</li><li>If an API turns out awkward (broken docs, no free tier), switch: that is part of the exercise.</li></ul><p>In the playground, the offline copies of <code>v2.jokeapi.dev</code>, <code>bored-api.appbrewery.com</code> and <code>secrets-api.appbrewery.com</code> always answer; other hosts are fetched for real and may be blocked.</p>',
  files:{
'index.js':`// Capstone: a website built on a public API.
// This scaffold uses JokeAPI (https://v2.jokeapi.dev). The playground answers it offline.

// 1. Import express and axios
import express from "express";
import axios from "axios";

// 2. Create the app and choose a port
const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/Any";

// 3. Serve the stylesheet from public/
app.use(express.static("public"));

// 4. Home page: just the form, no joke yet
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Planning helper: shows exactly what the API sends back
app.get("/raw", async (req, res) => {
  try {
    const result = await axios.get(API_URL);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. TODO: GET /joke
//    - read name and type from req.query (the form uses method GET)
//    - ask the API for a joke, sending ?type= only when one was chosen
//    - render index.ejs with the joke and the name
// 6. TODO: if anything fails, log the reason and show the visitor a friendly message (status 500)


app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`,
'views/index.ejs':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Joke Booth</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <main class="booth">
    <h1>Joke Booth 🎤</h1>

    <form action="/joke" method="GET" class="ask">
      <input type="text" name="name" placeholder="Your name" value="<%= locals.name || '' %>">
      <select name="type">
        <option value="">Any kind</option>
        <option value="single" <%= locals.type === "single" ? "selected" : "" %>>One-liner</option>
        <option value="twopart" <%= locals.type === "twopart" ? "selected" : "" %>>Setup and punchline</option>
      </select>
      <button type="submit">Tell me a joke</button>
    </form>

    <!-- TODO: if a joke was passed in, greet the visitor by name and show it.
         joke.type is "single" (text in joke.joke) or "twopart" (joke.setup, then joke.delivery). -->

    <!-- TODO: if an error message was passed in, show it here. -->
  </main>
</body>
</html>
`,
'public/styles/main.css':`* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px;
  background: #0f172a;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
}

.booth {
  width: 100%;
  max-width: 520px;
  padding: 28px;
  border-radius: 16px;
  background: #1e293b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

h1 {
  margin: 0 0 18px;
  font-size: 2rem;
}

.ask {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ask input,
.ask select {
  padding: 10px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #0f172a;
  color: inherit;
  font: inherit;
}

.ask button {
  grid-column: 1 / -1;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #f59e0b;
  color: #1e293b;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* TODO: style the joke and the error message */
`,
'README.md':`# Joke Booth

<!-- TODO: one or two sentences: what the site does and which public API it uses -->

## Run it locally

<!-- TODO: the commands someone needs after cloning the repo -->

## How it works

<!-- TODO: list the routes and what each one does -->
`,
'package.json':`{
  "name": "joke-booth",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  }
}
`},
  solution:{
'index.js':`// Joke Booth: asks JokeAPI for a joke and serves it with the visitor's name.
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/Any";

// Static files (the stylesheet) live in public/
app.use(express.static("public"));

// Home page: the form only
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Planning helper: the raw reply, to see which fields exist
app.get("/raw", async (req, res) => {
  try {
    const result = await axios.get(API_URL);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /joke?name=Ada&type=twopart  ->  one joke, addressed to the visitor
app.get("/joke", async (req, res) => {
  const name = (req.query.name || "").trim();
  const type = req.query.type;   // "", "single" or "twopart"
  try {
    // Only send ?type= when the visitor picked one: axios skips undefined params
    const result = await axios.get(API_URL, {
      params: { type: type || undefined },
    });
    // JokeAPI reports some problems inside a normal reply, with error: true
    if (result.data.error) {
      throw new Error(result.data.message || "JokeAPI could not find a joke");
    }
    res.render("index.ejs", { joke: result.data, name: name, type: type });
  } catch (error) {
    // the details are for us; the visitor gets a friendly sentence
    console.log("JokeAPI request failed:", error.message);
    res.status(500).render("index.ejs", {
      name: name,
      type: type,
      error: "The joke machine is jammed. Please try again in a moment.",
    });
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Joke Booth</title>
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <main class="booth">
    <h1>Joke Booth 🎤</h1>

    <form action="/joke" method="GET" class="ask">
      <input type="text" name="name" placeholder="Your name" value="<%= locals.name || '' %>">
      <select name="type">
        <option value="">Any kind</option>
        <option value="single" <%= locals.type === "single" ? "selected" : "" %>>One-liner</option>
        <option value="twopart" <%= locals.type === "twopart" ? "selected" : "" %>>Setup and punchline</option>
      </select>
      <button type="submit">Tell me a joke</button>
    </form>

    <% if (locals.joke) { %>
      <section class="joke">
        <p class="for">Here's one for you<%= locals.name ? ", " + name : "" %>:</p>
        <% if (joke.type === "single") { %>
          <p class="line"><%= joke.joke %></p>
        <% } else { %>
          <p class="line"><%= joke.setup %></p>
          <details>
            <summary>Show the punchline</summary>
            <p class="line punch"><%= joke.delivery %></p>
          </details>
        <% } %>
        <p class="meta"><%= joke.category %> · joke #<%= joke.id %></p>
      </section>
    <% } %>

    <% if (locals.error) { %>
      <p class="error"><%= error %></p>
    <% } %>
  </main>
</body>
</html>
`,
'public/styles/main.css':`* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px;
  background: #0f172a;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
}

.booth {
  width: 100%;
  max-width: 520px;
  padding: 28px;
  border-radius: 16px;
  background: #1e293b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

h1 {
  margin: 0 0 18px;
  font-size: 2rem;
}

.ask {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ask input,
.ask select {
  padding: 10px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #0f172a;
  color: inherit;
  font: inherit;
}

.ask button {
  grid-column: 1 / -1;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #f59e0b;
  color: #1e293b;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.joke {
  margin-top: 22px;
  padding: 18px;
  border-radius: 12px;
  background: #0f172a;
}

.for {
  margin: 0 0 8px;
  color: #fbbf24;
}

.line {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.5;
}

details {
  margin-top: 12px;
}

summary {
  cursor: pointer;
  color: #94a3b8;
}

.punch {
  margin-top: 8px;
  color: #fde68a;
}

.meta {
  margin: 14px 0 0;
  font-size: 12px;
  color: #64748b;
}

.error {
  margin-top: 22px;
  padding: 12px;
  border-radius: 8px;
  background: #7f1d1d;
  color: #fecaca;
}
`,
'README.md':`# Joke Booth

A tiny Express site that asks [JokeAPI](https://v2.jokeapi.dev) for a joke and serves it with your name on it.
Pick a one-liner or a setup-and-punchline joke; the punchline stays hidden until you click.

## Run it locally

\`\`\`bash
npm i
nodemon index.js     # or: npm start
\`\`\`

Then open http://localhost:3000.

## How it works

- \`GET /\` shows the form.
- \`GET /joke?name=...&type=...\` calls JokeAPI with Axios (\`type\` is \`single\`, \`twopart\` or left out) and renders the joke with EJS.
- \`GET /raw\` returns the API's reply untouched; handy while planning.
- If the API call fails, the page says so politely (status 500) and the reason is logged in the terminal.
`},
  quiz:[
    { q:'The API call fails. What should the visitor get?', options:['A request that never finishes','The full error stack trace','A friendly message on the page (with a 500 status), while the details go to your server log','A redirect to the API’s homepage'], answer:2, why:'Visitors need to know something went wrong; the technical reason is for you, in the terminal or logs.' },
    { q:'Your chosen API needs a key. Where should it live in the project you push to GitHub?', options:['Hard-coded at the top of index.js','In the README so others can use it','In a .env file read with dotenv, with .env listed in .gitignore','In a comment in index.ejs'], answer:2, why:'Anything committed is public. Environment variables keep the key on your machine (and on your host).' },
    { q:'Why does the scaffold have a <code>/raw</code> route?', options:['Browsers need it','It makes the site faster','JokeAPI requires it','To see the exact shape of the API’s reply before deciding what the template shows'], answer:3, why:'Planning starts with the data: which fields exist, and how they differ between joke types.' },
  ],
});
