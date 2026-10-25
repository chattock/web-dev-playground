/* ===== Section 25 — EJS ===== */

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
