/* ===== Section 24 — Express.js with Node.js ===== */

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
