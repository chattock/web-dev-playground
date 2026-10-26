/* ===== Section 36 — React.js (lectures 277–299; 300–321 are in s36-2.js) ===== */
/* Everything sits inside one function so the shared snippets below do not
   leak into the global scope (s36-2.js is loaded into the same page). */
(function () {

/* ---------- shared snippets ---------- */

// Entry file used once the app has an App component (as in the videos).
const ENTRY = `import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));
`;

const BASIC_CSS = `body {
  font-family: sans-serif;
  padding: 20px;
}
`;

const shell = title => `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="index.jsx"><\/script>
  </body>
</html>
`;

// Contact data written for the playground (people and numbers are made up;
// 07700 900xxx is a range reserved for fiction, example.com is reserved too).
const PEOPLE = [
  { id: 1, name: 'Ada Moss', seed: 'ada', phone: '+44 7700 900111', email: 'ada@example.com' },
  { id: 2, name: 'Kai Park', seed: 'kai', phone: '+44 7700 900222', email: 'kai@example.com' },
  { id: 3, name: 'Lena Ruiz', seed: 'lena', phone: '+44 7700 900333', email: 'lena@example.com' },
];
const EXTRA_PERSON = { id: 4, name: 'Omar Diaz', seed: 'omar', phone: '+44 7700 900444', email: 'omar@example.com' };
const pic = seed => `https://picsum.photos/seed/${seed}/200/200`;

const contactsFile = (people, withIds, exported) => `const contacts = [
${people.map(p => `  {
${withIds ? `    id: ${p.id},
` : ''}    name: "${p.name}",
    imgURL: "${pic(p.seed)}",
    phone: "${p.phone}",
    email: "${p.email}"
  }`).join(',\n')}
];
${exported ? '\nexport default contacts;\n' : '\n// TODO 4: export the array as the default export so App.jsx can import it\n'}`;

// The contact-card stylesheet supplied by the course for lectures 295–297.
const CARD_CSS = `body {
  font-family: sans-serif;
  margin: 0 auto;
  padding: 25px;
  max-width: 400px;
  min-width: 400px;
  background-color: #dfe6e9;
  text-align: center;
}

.heading {
  text-align: center;
  font-size: 2em;
  color: #2d3436;
  margin: 20px 0 30px;
}

.card {
  border-radius: 25px;
  position: relative;
  padding: 25px 15px;
  background-color: #81ecec;
  margin: 50px 0;
  height: 200px;
  box-shadow: 0 2px 5px #ccc;
  text-align: left;
}

.top {
  border-radius: 25px 25px 0 0;
  height: 100px;
  width: 100%;
  background-color: #00cec9;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
}

.name {
  font-size: 2em;
  color: #2d3436;
  display: flex;
  flex: 1;
  margin: 10% 20px 0;
}

.card img {
  margin: 30px 20px 0 0;
}

.circle-img {
  border-radius: 50%;
  border: 7px solid #fff;
  width: 120px;
  height: 120px;
}

.bottom {
  margin-top: 120px;
}

.info {
  margin: 20px 0;
  color: #1a7e76;
}
`;

// Card split into Avatar + Detail (the end state of lecture 296).
const AVATAR = `import React from "react";

function Avatar(props) {
  return <img className="circle-img" src={props.img} alt="avatar_img" />;
}

export default Avatar;
`;

const DETAIL = `import React from "react";

function Detail(props) {
  return <p className="info">{props.detailInfo}</p>;
}

export default Detail;
`;

const cardSplit = idLine => `import React from "react";
import Avatar from "./Avatar";
import Detail from "./Detail";

function Card(props) {
  return (
    <div className="card">
      <div className="top">
${idLine}        <h2 className="name">{props.name}</h2>
        <Avatar img={props.img} />
      </div>
      <div className="bottom">
        <Detail detailInfo={props.tel} />
        <Detail detailInfo={props.email} />
      </div>
    </div>
  );
}

export default Card;
`;

// Three Cards filled by hand from the array (lectures 295–297).
const HAND_CARDS = [0, 1, 2].map(i => `      <Card
        name={contacts[${i}].name}
        img={contacts[${i}].imgURL}
        tel={contacts[${i}].phone}
        email={contacts[${i}].email}
      />`).join('\n');

// The Keeper App stylesheet supplied by the course (fonts come from Google Fonts;
// offline the page falls back to the system fonts).
const KEEPER_CSS = `@import url("https://fonts.googleapis.com/css?family=McLaren|Montserrat&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html {
  font-family: "Montserrat", sans-serif;
}
body {
  background: #eee;
  padding: 0 16px;
}

header {
  background-color: #f5ba13;
  margin: auto -16px;
  padding: 16px 32px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}

header h1 {
  color: #fff;
  font-family: "McLaren", cursive;
  font-weight: 200;
}

footer {
  position: absolute;
  text-align: center;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
}

footer p {
  color: #ccc;
}

.note {
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 5px #ccc;
  padding: 10px;
  width: 240px;
  margin: 16px;
  float: left;
}
.note h1 {
  font-size: 1.1em;
  margin-bottom: 6px;
}
.note p {
  font-size: 1.1em;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
`;

// Emoji dictionary written for the playground (lectures 298–299).
const EMOJIS = [
  { id: 1, emoji: '🦥', name: 'Sloth', meaning: 'Taking it slow. Sent on lazy Sundays, when you have zero plans, or as an apology for answering a message three days late.' },
  { id: 2, emoji: '🔥', name: 'Fire', meaning: 'Something is hot right now: a great outfit, a brilliant idea or a song stuck on repeat. Also used to cheer on a winning streak.' },
  { id: 3, emoji: '🙈', name: 'See-No-Evil Monkey', meaning: 'A monkey covering its eyes. Sent after an embarrassing mistake, when something is too awkward to watch, or as a playful “I saw nothing”.' },
];
const EXTRA_EMOJI = { id: 4, emoji: '🧠', name: 'Brain', meaning: 'Big thinking. Used when someone cracks a tricky problem, comes up with a clever plan, or survives a long afternoon of coding.' };

const emojiFile = (list, exported) => `const emojipedia = [
${list.map(e => `  {
    id: ${e.id},
    emoji: "${e.emoji}",
    name: "${e.name}",
    meaning:
      ${JSON.stringify(e.meaning)}
  }`).join(',\n')}
];
${exported ? '\nexport default emojipedia;\n' : '\n// TODO 4: export the array as the default export\n'}`;

const EMOJI_CSS = `@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

body {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  line-height: 1.666;
  background: #c0d2d4;
  color: #555;
}

h1 {
  font-weight: 900;
  font-size: 500%;
  text-align: center;
  margin-top: 4rem;
  color: #fff;
  line-height: 1.2;
}

h1 span {
  padding: 5px 15px;
  background: #2ec2b0;
}

.dictionary {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem auto;
  max-width: 90%;
}

.dictionary > .term {
  text-align: center;
  max-width: 20rem;
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 3px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05), 0 5px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 100ms ease-in-out;
}

.dictionary > .term > dt {
  margin-bottom: 1rem;
}

dt {
  color: #2ec2b0;
  line-height: 1;
}

dt span {
  font-size: 200%;
  font-weight: 900;
}

.emoji {
  margin: 0 auto 20px;
  display: block;
  font-size: 400%;
}

dd {
  font-size: 92.5%;
  margin-left: 0;
}
`;

// Tiny React-in-a-demo helpers: every Explore demo that needs React loads these.
const REACT_SCRIPTS = `<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>`;
const BABEL_SCRIPT = `<script src="vendor/babel/babel.min.js"><\/script>`;

/* ---------- 277–280: what React is, the module, tools ---------- */

PG.add({
  id:'l277', index:277, udemyId:17038306, minutes:7, section:'s36', slug:'what-is-react', kind:'read',
  title:'What is React?',
  blurb:'React is a JavaScript library for building user interfaces out of <b>components</b>: reusable pieces that each bundle their own markup, styling and behaviour, and that you use like custom HTML tags. A whole app is a tree of components. When data changes, React compares the new tree with the current one and updates only the parts of the page that differ.',
  quiz:[
    { q:'In React, what is a component?', options:['A CSS file for one page','A reusable piece of UI that you write once and render many times with different data','A browser plugin that runs React','Another name for an HTML tag'], answer:1, why:'A component works like a custom HTML element: one definition, used wherever it is needed, each time with its own data.' },
    { q:'A to-do app is split into App, NavBar, ToDoList, ListItem, Checkbox and ItemText. Where does ListItem sit in the tree?', options:['Above App','Inside ToDoList, once for every to-do','Inside NavBar','Beside App at the top level'], answer:1, why:'The list owns its items, so each ListItem is a child of ToDoList, and each ListItem holds its own Checkbox and ItemText.' },
    { q:'You tick one checkbox in a long list. What does React change on the real page?', options:['It reloads the whole page','It rebuilds every list item','It works out what differs between the old and new tree and updates just that checkbox (and anything else that changed)','Nothing until you refresh'], answer:2, why:'React diffs the tree it wants against the tree it has and only touches the nodes that changed, which keeps updates fast.' },
  ],
  explore:[{
    title:'A page as a tree of components', height:520,
    note:'Hover a component in the tree to see which part of the page it draws (or hover the page to find its component). Tick a box, add an item or remove one: only the components whose output changed light up. Switch on <b>no diffing</b> to see the alternative React avoids.',
    html:`
<style>
  .wrap{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start}
  .app{flex:1;min-width:250px;background:#fff;border:1px solid #dfe3ee;border-radius:10px;overflow:hidden}
  .nav{background:#1c2030;color:#fff;padding:10px 14px;font-weight:700}
  .list{padding:8px 10px 4px}
  .item{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px;margin-bottom:3px}
  .item .txt{flex:1}
  .item.done .txt{text-decoration:line-through;color:#8a90a6}
  .item button{border:none;background:none;color:#a3a9bf;cursor:pointer;font-size:16px;line-height:1}
  .add{display:flex;gap:6px;padding:4px 10px 12px}
  .add input{flex:1;font:inherit;padding:4px 8px;border:1px solid #cfd5e6;border-radius:6px}
  .add button{font:inherit;padding:4px 10px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer}
  .tree{flex:1;min-width:230px;background:#fff;border:1px solid #dfe3ee;border-radius:10px;padding:8px 10px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px}
  .node{padding:2px 6px;border-radius:5px;white-space:nowrap}
  .node .sig{color:#8a90a6;margin-left:6px}
  .hl{outline:2px solid #5b9cff;outline-offset:1px}
  .changed{animation:fc 1.6s ease-out}
  .added{animation:fa 1.6s ease-out}
  @keyframes fc{0%,30%{background:#ffe066}100%{background:transparent}}
  @keyframes fa{0%,30%{background:#8ce99a}100%{background:transparent}}
</style>
<div class="knobs">
  <label><input type="checkbox" id="nodiff"> no diffing: rebuild every component on each change</label>
</div>
<div class="wrap">
  <div class="app" data-key="App">
    <div id="ui"></div>
    <div class="add"><input id="newText" placeholder="New to-do"><button id="addBtn">Add</button></div>
  </div>
  <div class="tree" id="tree"></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var items = [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Learn React', done: false },
    { id: 3, text: 'Walk the dog', done: true }
  ];
  var nextId = 4, prev = null;
  var ui = document.getElementById('ui'), tree = document.getElementById('tree'), ro = document.getElementById('ro');

  function esc(s) { return String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;'); }

  function describe() {
    var nodes = [
      { key: 'App', name: 'App', depth: 0, sig: '' },
      { key: 'NavBar', name: 'NavBar', depth: 1, sig: '"My To-Dos"' },
      { key: 'ToDoList', name: 'ToDoList', depth: 1, sig: '' }
    ];
    items.forEach(function (it) {
      nodes.push({ key: 'li' + it.id, name: 'ListItem', depth: 2, sig: '', label: it.text });
      nodes.push({ key: 'cb' + it.id, name: 'Checkbox', depth: 3, sig: it.done ? 'checked' : 'unchecked', label: it.text });
      nodes.push({ key: 'tx' + it.id, name: 'ItemText', depth: 3, sig: it.done ? 'struck through' : 'plain', label: it.text });
    });
    return nodes;
  }

  function render(action) {
    var nodes = describe(), noDiff = document.getElementById('nodiff').checked;
    var before = {}, now = {}, marks = {}, lines = [];
    if (prev) prev.forEach(function (n) { before[n.key] = n; });
    nodes.forEach(function (n) {
      now[n.key] = true;
      if (!prev) return;
      if (!before[n.key]) marks[n.key] = 'added';
      else if (before[n.key].sig !== n.sig) {
        marks[n.key] = 'changed';
        lines.push('  changed  ' + n.name + ' of "' + n.label + '": ' + before[n.key].sig + ' -> ' + n.sig);
      }
    });
    var removed = prev ? prev.filter(function (n) { return !now[n.key]; }) : [];
    nodes.forEach(function (n) { if (marks[n.key] === 'added' && n.name === 'ListItem') lines.push('  added    ListItem "' + n.label + '" with its Checkbox and ItemText'); });
    removed.forEach(function (n) { if (n.name === 'ListItem') lines.push('  removed  ListItem "' + n.label + '" with its Checkbox and ItemText'); });
    if (noDiff && prev) nodes.forEach(function (n) { marks[n.key] = 'changed'; });

    var html = '<div class="nav" data-key="NavBar">My To-Dos</div><div class="list" data-key="ToDoList">';
    items.forEach(function (it) {
      html += '<div class="item' + (it.done ? ' done' : '') + '" data-key="li' + it.id + '">' +
        '<input type="checkbox" data-key="cb' + it.id + '" data-toggle="' + it.id + '"' + (it.done ? ' checked' : '') + '>' +
        '<span class="txt" data-key="tx' + it.id + '">' + esc(it.text) + '</span>' +
        '<button data-del="' + it.id + '" title="Remove">×</button></div>';
    });
    if (!items.length) html += '<p class="note" style="margin:6px">Nothing left to do.</p>';
    ui.innerHTML = html + '</div>';

    tree.innerHTML = nodes.map(function (n) {
      return '<div class="node" data-key="' + n.key + '" style="padding-left:' + (6 + n.depth * 16) + 'px">&lt;' + n.name + '&gt;' +
        (n.sig ? '<span class="sig">' + esc(n.sig) + '</span>' : '') + '</div>';
    }).join('');

    Object.keys(marks).forEach(function (k) {
      document.querySelectorAll('[data-key="' + k + '"]').forEach(function (el) {
        el.classList.remove('changed', 'added'); void el.offsetWidth; el.classList.add(marks[k]);
      });
    });

    var out = [];
    if (!prev) out.push('Tick a box, add an item or remove one. The highlighted components are the only parts of the page that get updated.');
    else {
      out.push(action);
      if (noDiff) out.push('No diffing: all ' + nodes.length + ' components are rebuilt and repainted, including the ones whose output did not change.');
      else {
        out = out.concat(lines);
        out.push('React compared the new tree with the previous one and updated ' + (Object.keys(marks).length + removed.length) + ' component(s). The other ' + (nodes.length - Object.keys(marks).length) + ' were left alone.');
      }
    }
    ro.textContent = out.join('\\n');
    prev = nodes;
  }

  ui.addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-toggle'); if (!id) return;
    var it = items.filter(function (x) { return String(x.id) === id; })[0];
    it.done = e.target.checked;
    render((it.done ? 'Ticked' : 'Unticked') + ' "' + it.text + '".');
  });
  ui.addEventListener('click', function (e) {
    var id = e.target.getAttribute('data-del'); if (!id) return;
    var it = items.filter(function (x) { return String(x.id) === id; })[0];
    items = items.filter(function (x) { return x !== it; });
    render('Removed "' + it.text + '".');
  });
  var newText = document.getElementById('newText');
  document.getElementById('addBtn').onclick = function () {
    var t = newText.value.trim() || ('Task ' + nextId);
    items.push({ id: nextId++, text: t, done: false });
    newText.value = '';
    render('Added "' + t + '".');
  };
  newText.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('addBtn').click(); });

  function link(e, on) {
    var el = e.target.closest && e.target.closest('[data-key]'); if (!el) return;
    var k = el.getAttribute('data-key');
    document.querySelectorAll('[data-key="' + k + '"]').forEach(function (x) { x.classList.toggle('hl', on); });
  }
  document.addEventListener('mouseover', function (e) { link(e, true); });
  document.addEventListener('mouseout', function (e) { link(e, false); });
  render();
<\/script>`,
  }],
});

PG.add({
  id:'l278', index:278, udemyId:17038570, minutes:2, section:'s36', slug:'what-we-will-make', kind:'read',
  title:'What we will make in this React module',
  blurb:'A preview of the module. You build small practice apps (a registration screen, a live clock, an emoji dictionary, a to-do list) and the main project, <b>Keeper</b>: a notes app in the style of Google Keep, put together in three parts (lectures 292, 301 and 318). On the way you meet JSX, components, props, state and hooks, plus the ES6 features React code leans on: modules, map and filter, destructuring and the spread operator.',
});

PG.add({
  id:'l279', index:279, udemyId:17038612, minutes:6, section:'s36', slug:'codesandbox-and-module-structure', kind:'read',
  title:'Introduction to Code Sandbox and the Structure of the Module',
  blurb:'The videos use <b>CodeSandbox</b>: an editor in the browser where React is already installed, every project gets a shareable link, and everyone runs the same React version, so time goes on React rather than on set-up. Each topic comes as a demo followed by a practice sandbox, and the Keeper project arrives in parts once enough skills are in place. In this playground the <b>Build</b> tab plays the sandbox: file tabs on the left, preview and console on the right, edits saved in this browser, and <b>Reset</b> gives you a fresh copy of the starter.',
  links:[
    { title:'CodeSandbox', url:'https://codesandbox.io/', note:'sign in with GitHub, Google or Apple to fork the course sandboxes' },
  ],
  quiz:[
    { q:'Why does the module use a shared online sandbox rather than a local install?', options:['Local projects cannot use JSX','Everyone gets the same React version and starter files, so nobody loses time to set-up differences','CodeSandbox runs React faster','VS Code cannot edit JavaScript'], answer:1, why:'React changes often. A shared environment keeps the code in the videos and the code on your screen in step.' },
    { q:'What does forking one of the course\'s starter sandboxes do?', options:['Deletes the original','Makes your own editable copy, saved to your account','Downloads it as a zip file','Publishes it to npm'], answer:1, why:'A fork is a personal copy: the course original stays untouched and your changes are kept with your account.' },
  ],
});

PG.add({
  id:'l280', index:280, udemyId:42757326, minutes:0, section:'s36', slug:'local-development-setup', kind:'read',
  title:'[Optional] Local Development Setup',
  blurb:'How to run the module\'s React projects on your own machine with Node, VS Code and <b>Vite</b> instead of CodeSandbox. Optional: every lesson here works in the playground.',
  body:`
<h3>Steps</h3>
<ol>
  <li>Install <b>Node.js</b> (the LTS version) and <b>VS Code</b>. Check Node works: <code>node -v</code> and <code>npm -v</code> in a terminal should each print a version number.</li>
  <li>In the terminal, <code>cd</code> into the folder where you keep your projects.</li>
  <li>Create a React project with Vite. The extra <code>--</code> passes the template flag through npm to Vite; accept if npm asks to install <code>create-vite</code>:
<pre data-lang="sh">npm create vite@latest my-react-app -- --template react</pre>
  (Leave the flags off and Vite asks instead: choose <b>React</b>, then <b>JavaScript</b>.)</li>
  <li>Go into the new folder and install its dependencies (this creates <code>node_modules</code>):
<pre data-lang="sh">cd my-react-app
npm install</pre></li>
  <li>Start the dev server and open the address it prints, usually <code>http://localhost:5173/</code>:
<pre data-lang="sh">npm run dev</pre></li>
  <li>Open the folder in VS Code (<code>code .</code>), change the text in <code>src/App.jsx</code> and save. The browser updates by itself. Stop the server with <b>Ctrl+C</b>.</li>
  <li>For a lesson download: unzip it, <code>cd</code> into the folder, then run <code>npm install</code> and <code>npm run dev</code>. Older starters made with Create React App use <code>npm start</code> and port 3000 instead.</li>
</ol>
<h3>Where things live</h3>
<table>
  <tr><th>Vite project</th><th>This playground</th><th>Job</th></tr>
  <tr><td><code>index.html</code></td><td><code>index.html</code> (when shown)</td><td>The page with the empty <code>&lt;div id="root"&gt;</code></td></tr>
  <tr><td><code>src/main.jsx</code></td><td><code>index.jsx</code></td><td>Entry point: renders <code>&lt;App /&gt;</code> into the root div</td></tr>
  <tr><td><code>src/App.jsx</code></td><td><code>components/App.jsx</code></td><td>Top of the component tree</td></tr>
  <tr><td><code>src/components/*.jsx</code></td><td><code>components/*.jsx</code></td><td>The other components</td></tr>
  <tr><td><code>src/index.css</code> or <code>public/styles.css</code></td><td><code>styles.css</code></td><td>Global styles</td></tr>
</table>
<h3>Differences from the videos</h3>
<ul>
  <li>The videos render with <code>ReactDOM.render(&lt;App /&gt;, root)</code>. A Vite project (React 18 or later) uses <code>createRoot(root).render(&lt;App /&gt;)</code> from <code>react-dom/client</code>: same job, newer API.</li>
  <li>Vite only compiles JSX in files that end in <code>.jsx</code>.</li>
  <li><code>import React from "react"</code> at the top of each component is optional in Vite projects.</li>
  <li>Vite wraps the app in <code>&lt;StrictMode&gt;</code>, which renders components twice in development, so a <code>console.log</code> inside a component can print twice.</li>
</ul>`,
  quiz:[
    { q:'What does <code>npm run dev</code> do in a Vite project?', options:['Installs React','Starts a development server that rebuilds and reloads the page whenever you save','Publishes the site','Creates a new project'], answer:1, why:'It runs the dev script from package.json, which starts Vite\'s server on localhost:5173.' },
    { q:'Which file in a Vite React project puts <code>&lt;App /&gt;</code> on the page?', options:['index.html','src/main.jsx','package.json','vite.config.js'], answer:1, why:'main.jsx is the entry point: it finds the root div and renders App into it. index.html only supplies the empty div and loads main.jsx.' },
  ],
});

PG.add({
  id:'l281', index:281, udemyId:17038636, minutes:17, section:'s36', slug:'jsx-and-babel', kind:'react',
  title:'Introduction to JSX and Babel',
  blurb:'A React app starts as one <code>&lt;div id="root"&gt;</code>. Everything on screen is created from JavaScript: <code>ReactDOM.render(what, where)</code> puts an element into that div. The HTML-looking code inside JavaScript is <b>JSX</b>; Babel compiles it to <code>React.createElement(...)</code> calls before the browser sees it.',
  tasks:[
    'In <code>index.jsx</code>, import <code>React</code> from "react" and <code>ReactDOM</code> from "react-dom".',
    'Render an <code>&lt;h1&gt;Hello world!&lt;/h1&gt;</code> into the element with id <code>root</code>.',
    'Change the text and watch the preview update as you type.',
    'Try rendering two sibling elements (<code>&lt;h1&gt;</code> then <code>&lt;p&gt;</code>) without a wrapper — read the error, then wrap them in one <code>&lt;div&gt;</code>.',
    'Look at the Explore tab to see what Babel turns your JSX into.'
  ],
  files:{
'index.jsx':`// TODO 1: import React and ReactDOM

// TODO 2: render <h1>Hello world!</h1> into the root div
`,
'index.html':`<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css" />
    <title>JSX</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="index.jsx"></script>
  </body>
</html>
`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 20px;
}
`},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <h1>Hello world!</h1>
    <p>This is a paragraph.</p>
  </div>,
  document.getElementById("root")
);
`},
  explore:[{
    title:'What Babel does to JSX', height:380,
    note:'Type JSX on the left; the compiled JavaScript appears on the right. Every tag becomes a React.createElement call — which is why React must be in scope, and why there can only be one top-level element.',
    html:`
<div style="display:flex;gap:12px">
  <textarea id="src" style="flex:1;height:260px;font:12.5px ui-monospace,Menlo,monospace;padding:10px;border:1px solid #dfe3ee;border-radius:8px"><h1 className="title">Hello {name}!</h1></textarea>
  <pre id="out" class="readout" style="flex:1;height:260px;margin:0;overflow:auto"></pre>
</div>
<p class="note">createElement(type, props, ...children). Attributes become the props object; nested tags and text become children.</p>
<script src="vendor/babel/babel.min.js"><\/script>
<script>
  var src = document.getElementById('src'), out = document.getElementById('out');
  function go(){ try { out.textContent = Babel.transform(src.value, { presets: ['react'] }).code.replace(/\\/\\*#__PURE__\\*\\//g, ''); } catch(e) { out.textContent = e.message; } }
  src.addEventListener('input', go); go();
<\/script>`,
  }],
  quiz:[
    { q:'What does Babel do in a React project?', options:['Runs the server','Compiles JSX (and modern JS) into JavaScript browsers understand','Installs react-dom','Styles components'], answer:1, why:'Browsers do not understand JSX. Babel rewrites each tag into React.createElement(...) calls.' },
    { q:'Why can <code>ReactDOM.render</code> take only one top-level element?', options:['Performance','It compiles to a single createElement call, which returns one element','HTML only allows one body','It is a Babel limitation'], answer:1, why:'The first argument is one React element. Siblings need a wrapper (a div, or later a fragment).' },
    { q:'Which attribute name is right in JSX?', options:['class="title"','className="title"','css-class="title"','klass="title"'], answer:1, why:'JSX is JavaScript, and class is a reserved word, so React uses className (covered properly in a later lecture).' },
  ],
});

/* ---------- 282–287: JSX practice, expressions, attributes, styling ---------- */

PG.add({
  id:'l282', index:282, udemyId:17038694, minutes:8, section:'s36', slug:'jsx-code-practice', kind:'react',
  title:'JSX Code Practice',
  blurb:'Build a React page from an empty file until the set-up steps become automatic: import <code>React</code> and <code>ReactDOM</code>, then give <code>ReactDOM.render</code> one element to show and the root div to show it in. Here that element is a heading plus a bullet list of three favourite foods, wrapped in a single <code>&lt;div&gt;</code>.',
  tasks:[
    'In <code>index.jsx</code>, import <code>React</code> from "react" and <code>ReactDOM</code> from "react-dom".',
    'Call <code>ReactDOM.render(what, where)</code>. <i>Where</i> is <code>document.getElementById("root")</code>; <i>what</i> is <code>&lt;h1&gt;My Favourite Foods&lt;/h1&gt;</code> for now.',
    'Add a <code>&lt;ul&gt;</code> after the heading. The code breaks: two siblings cannot both be the first argument. Wrap the <code>&lt;h1&gt;</code> and the <code>&lt;ul&gt;</code> in one <code>&lt;div&gt;</code>.',
    'Put three <code>&lt;li&gt;</code> items with your favourite foods in the list.',
    'Extra: change <code>&lt;ul&gt;</code> to <code>&lt;ol&gt;</code> for a numbered list, then add an <code>&lt;h2&gt;</code> and a second list of foods you cannot stand.'
  ],
  files:{
'index.jsx':`// Build this page from nothing: a heading, then an unordered (bullet) list
// with three items in it.

// TODO 1: import React and ReactDOM


// TODO 2: call ReactDOM.render(what, where)
//   what:  ONE <div> holding an <h1> and a <ul> with three <li>s
//   where: the div with id "root" in index.html

`,
'index.html':shell('JSX'),
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <h1>My Favourite Foods</h1>
    <ul>
      <li>Bacon</li>
      <li>Noodles</li>
      <li>Mushrooms</li>
    </ul>
  </div>,
  document.getElementById("root")
);
`},
  notes:`<h3>About the console warning</h3>
<p>The videos use <code>ReactDOM.render</code>, the API of React 16 and 17. The playground runs React 18, which still renders it but prints a deprecation warning in the console. Ignore it while you follow the course. The React 18 version, which Vite projects use, looks like this:</p>
<pre data-lang="jsx">import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(&lt;h1&gt;Hello&lt;/h1&gt;);</pre>`,
  quiz:[
    { q:'Why does <code>ReactDOM.render(&lt;h1&gt;Hi&lt;/h1&gt;&lt;ul&gt;…&lt;/ul&gt;, root)</code> fail?', options:['ul is not allowed in JSX','The first argument has to be one element, and these are two siblings','The h1 needs a className','The root div is missing'], answer:1, why:'Each JSX element becomes one createElement call, and render takes a single one. Wrap siblings in a parent such as a div.' },
    { q:'What does the second argument of <code>ReactDOM.render</code> tell React?', options:['Which stylesheet to load','Which existing DOM element to fill','Which React version to use','How often to re-render'], answer:1, why:'It is a real DOM node, usually document.getElementById("root"). React fills it with whatever the first argument describes.' },
    { q:'A formatter rewrites <code>&lt;li&gt;&lt;/li&gt;</code> as <code>&lt;li /&gt;</code>. Is that still valid JSX?', options:['No, li must have a closing tag','Yes: in JSX any element without children may close itself','Only inside a ul','Only for img and br'], answer:1, why:'JSX lets every childless element self-close. Plain HTML only allows that style for void elements such as img and br.' },
  ],
});

PG.add({
  id:'l283', index:283, udemyId:17038702, minutes:12, section:'s36', slug:'javascript-expressions-in-jsx', kind:'react',
  title:'Javascript Expressions in JSX & ES6 Template Literals',
  blurb:'Text inside a JSX tag is printed as it is, but curly braces switch back to JavaScript: <code>&lt;h1&gt;Hello {fName}&lt;/h1&gt;</code> shows the value of the variable. Any <b>expression</b> fits in the braces (a variable, a sum, a function call, an ES6 template literal), while <b>statements</b> such as <code>if</code> do not, because they produce no value.',
  tasks:[
    'The heading prints the word <i>fName</i>. Put it in curly braces, <code>{fName}</code>, so the value appears instead.',
    'Show the full name three more ways: <code>{fName + " " + lName}</code>, then <code>{fName} {lName}</code>, then a template literal <code>{`${fName} ${lName}`}</code>.',
    'Create <code>const num</code> holding your lucky number and add <code>&lt;p&gt;Your lucky number is {num}&lt;/p&gt;</code>.',
    'Any expression works in the braces. Try <code>{3 + 9}</code>, then <code>{Math.floor(Math.random() * 10)}</code> for a random whole number from 0 to 9 (press ▶ Run to roll again).',
    'Try a statement: <code>{if (num &gt; 5) { "big" }}</code>. Read the syntax error, then delete the line. The Explore tab lets you test more expressions.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const fName = "Angela";
const lName = "Yu";
// TODO 3: a const called num holding your lucky number

ReactDOM.render(
  <div>
    {/* TODO 1: this prints the word fName. Make it print the value instead. */}
    <h1>Hello fName!</h1>

    {/* TODO 2: three more headings with the full name:
          + inside one pair of braces,
          two pairs of braces with a space between them,
          a template literal (backticks with \${} placeholders) */}

    {/* TODO 3: <p>Your lucky number is ...</p> using num */}

    {/* TODO 4: a <p> with 3 + 9, and a <p> with a random whole number from 0 to 9 */}
  </div>,
  document.getElementById("root")
);
`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const fName = "Angela";
const lName = "Yu";
const num = 7;

ReactDOM.render(
  <div>
    <h1>Hello {fName}!</h1>
    <h1>Hello {fName + " " + lName}!</h1>
    <h1>Hello {fName} {lName}!</h1>
    <h1>Hello {\`\${fName} \${lName}\`}!</h1>
    <p>Your lucky number is {num}</p>
    <p>3 + 9 = {3 + 9}</p>
    <p>Random number: {Math.floor(Math.random() * 10)}</p>
  </div>,
  document.getElementById("root")
);
`},
  explore:[{
    title:'What can go inside the braces?', height:470,
    note:'Type between the braces or click a sample. The first line of the readout is what Babel makes of your JSX: the expression becomes an argument of <code>React.createElement</code>, which is why it must produce a value. Statements fail at that step.',
    html:`
<div class="knobs" style="display:block">
  <span class="tag">const fName = "Angela", lName = "Yu", num = 7;</span>
  <div style="display:flex;align-items:center;gap:6px;margin-top:10px;font-family:ui-monospace,Menlo,monospace;font-size:13px">
    &lt;h1&gt;{<input id="expr" type="text" spellcheck="false" autocomplete="off" style="flex:1;font:inherit;padding:4px 8px;border:1px solid #cfd5e6;border-radius:6px">}&lt;/h1&gt;
  </div>
  <div id="chips" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px"></div>
</div>
<div class="stage" style="min-height:64px"><div id="out"></div></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
${REACT_SCRIPTS}
${BABEL_SCRIPT}
<script>
  var PRESETS = ['fName', 'fName + " " + lName', '\`\${fName} \${lName}\`', '3 + 9', 'num * 6', 'Math.floor(Math.random() * 10)',
    'fName.toUpperCase()', 'num > 5 ? "big" : "small"', 'true', 'if (num > 5) { "big" }', 'const x = 1'];
  var STATEMENTS = ['if', 'for', 'while', 'const', 'let', 'var', 'switch', 'return', 'function'];
  var input = document.getElementById('expr'), ro = document.getElementById('ro');
  var root = ReactDOM.createRoot(document.getElementById('out'));
  PRESETS.forEach(function (p) {
    var b = document.createElement('button');
    b.textContent = p; b.style.fontFamily = 'ui-monospace,Menlo,monospace';
    b.onclick = function () { input.value = p; go(); };
    document.getElementById('chips').appendChild(b);
  });
  function firstWord(s) {
    s = s.trim(); var w = '';
    for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) w += c; else break; }
    return w;
  }
  function describe(v) {
    if (v === null || v === undefined) return String(v);
    if (typeof v === 'string') return JSON.stringify(v) + '   (a string)';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v) + '   (a ' + typeof v + ')';
    if (typeof v === 'function') return 'a function';
    if (React.isValidElement(v)) return 'a React element';
    try { return JSON.stringify(v) + (Array.isArray(v) ? '   (an array)' : '   (an object)'); } catch (e) { return String(v); }
  }
  function draw(child) { ReactDOM.flushSync(function () { root.render(React.createElement('h1', { style: { margin: 0 } }, child)); }); }
  function go() {
    var expr = input.value;
    if (!expr.trim()) { draw(null); ro.textContent = 'Type a JavaScript expression between the braces.'; return; }
    var compiled;
    try {
      compiled = Babel.transform('<h1>{' + expr + '}</h1>', { presets: ['react'] }).code.split('/*#__PURE__*/').join('').trim();
    } catch (e) {
      draw(null);
      var w = firstWord(expr);
      ro.textContent = 'Syntax error: ' + String(e.message).split('\\n')[0].replace('unknown: ', '') +
        (STATEMENTS.indexOf(w) >= 0 ? '\\n\\n"' + w + '" starts a statement. A statement does a job but has no value, so it cannot fill the gap between the braces.\\nWrite an expression instead, for example the ternary  num > 5 ? "big" : "small"' : '');
      return;
    }
    var value;
    try {
      var code = Babel.transform('var __v = (' + expr + ');', { presets: ['react'] }).code;
      value = new Function('React', 'const fName = "Angela", lName = "Yu", num = 7;\\n' + code + '\\nreturn __v;')(React);
    } catch (e) {
      draw(null);
      ro.textContent = 'Babel turns it into:\\n  ' + compiled + '\\n\\nRunning it fails: ' + e.message;
      return;
    }
    var lines = ['Babel turns it into:', '  ' + compiled, '', 'The expression evaluates to: ' + describe(value)];
    if (typeof value === 'function') { draw(null); lines.push('React cannot render a function. Did you forget the brackets that call it?'); }
    else if (value && typeof value === 'object' && !Array.isArray(value) && !React.isValidElement(value)) { draw(null); lines.push('React cannot render a plain object. Show one of its properties instead.'); }
    else {
      draw(value);
      if (value === true || value === false || value === null || value === undefined) lines.push('true, false, null and undefined render nothing at all.');
    }
    ro.textContent = lines.join('\\n');
  }
  input.addEventListener('input', go);
  input.value = 'fName';
  go();
<\/script>`,
  }],
  quiz:[
    { q:'With <code>const name = "Ada"</code>, what does <code>&lt;h1&gt;Hello name&lt;/h1&gt;</code> display?', options:['Hello Ada','Hello name','An error','Hello undefined'], answer:1, why:'Text inside a JSX tag is literal. Only {name} switches to JavaScript and inserts the value.' },
    { q:'Which of these can go inside JSX curly braces?', options:['An if / else block','A for loop','Any expression: a variable, 3 + 9, a function call','A const declaration'], answer:2, why:'The braces need something that evaluates to a value. if, for and const are statements and produce no value.' },
    { q:'Which line produces the text <i>Angela Yu</i>?', options:['"${fName} ${lName}"','`${fName} ${lName}`','`{fName} {lName}`','"fName" + "lName"'], answer:1, why:'Template literals use backticks, and only inside backticks are ${...} placeholders replaced by values.' },
  ],
});

PG.add({
  id:'l284', index:284, udemyId:17038718, minutes:9, section:'s36', slug:'javascript-expressions-in-jsx-practice', kind:'react',
  title:'Javascript Expressions in JSX Practice',
  blurb:'From an empty file: two paragraphs, one crediting a name stored in a <code>const</code> and one with a copyright year that JavaScript works out, so it never goes out of date. The year comes from a <code>Date</code> object: <code>new Date().getFullYear()</code>.',
  tasks:[
    'Import <code>React</code> and <code>ReactDOM</code>, and create <code>const name</code> with your name.',
    'Create <code>const currentDate = new Date();</code> and <code>console.log</code> it to see what a Date holds.',
    'Store the year in <code>const year = currentDate.getFullYear();</code>.',
    'Render one <code>&lt;div&gt;</code> holding <code>&lt;p&gt;Created by {name}&lt;/p&gt;</code> and <code>&lt;p&gt;Copyright {year}&lt;/p&gt;</code>.',
    'Remove the brackets after <code>getFullYear</code>. Read the warning in the console (a function is not something React can show), then put them back.',
    'Extra: put the year straight into the JSX with <code>{new Date().getFullYear()}</code>, and add a third paragraph with the time: <code>{currentDate.toLocaleTimeString()}</code>.'
  ],
  files:{
'index.jsx':`// Build this from nothing: two paragraphs,
//   "Created by YOUR NAME"   - the name comes from a const
//   "Copyright CURRENT YEAR" - JavaScript works out the year; do not type it

// TODO 1: import React and ReactDOM


// TODO 2: const name = ...


// TODO 3: const year = ... (make a new Date, then ask it for its full year)


// TODO 4: render a <div> with both paragraphs into the root div

`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const name = "Angela";
const currentDate = new Date();
const year = currentDate.getFullYear();

ReactDOM.render(
  <div>
    <p>Created by {name}</p>
    <p>Copyright {year}</p>
  </div>,
  document.getElementById("root")
);
`},
  quiz:[
    { q:'What does <code>new Date().getFullYear()</code> give you?', options:['The year as text, such as "2026"','The year as a number, such as 2026','A whole Date object','The last two digits of the year'], answer:1, why:'getFullYear returns the four-digit year as a number; JSX turns it into text when it renders.' },
    { q:'You write <code>{currentDate.getFullYear}</code> without brackets. What happens?', options:['The year appears','Nothing appears for it, and React warns that functions are not valid as a child','The page crashes for good','It shows 0'], answer:1, why:'Without () you hand over the function itself instead of calling it, and React has no way to display a function.' },
    { q:'Why work the year out in code instead of typing it?', options:['It renders faster','The footer stays right every January without anyone editing it','JSX does not allow numbers','Browsers block typed dates'], answer:1, why:'A typed year goes stale. Asking the Date object each time the page loads keeps it current.' },
  ],
});

PG.add({
  id:'l285', index:285, udemyId:17038724, minutes:17, section:'s36', slug:'jsx-attributes-and-styling', kind:'react',
  title:'JSX Attributes & Styling React Elements',
  blurb:'React renders ordinary HTML, so a normal stylesheet styles it. Attributes carry over with two changes: names follow JavaScript\'s camelCase (<code>class</code> becomes <code>className</code>, <code>contenteditable</code> becomes <code>contentEditable</code>), and a value in curly braces is JavaScript, as in <code>src={img}</code>. JSX also insists that every element without children closes itself: <code>&lt;img /&gt;</code>.',
  tasks:[
    'In <code>styles.css</code> write <code>.heading { color: red; }</code>, then give the <code>&lt;h1&gt;</code> <code>className="heading"</code>. Try plain <code>class</code> as well and read the console warning.',
    'Make the heading editable with <code>contentEditable="true"</code> and type into it in the preview. Add <code>spellCheck="false"</code> so the red underlines go away. (React warns about editable elements with children: it is only reminding you it will not track what you type.)',
    'Replace the <code>&lt;ul&gt;</code> with a <code>&lt;div&gt;</code> of three <code>&lt;img /&gt;</code> elements. Leave the slash off one of them to see JSX refuse an unclosed tag, then put it back.',
    'Use the <code>img</code> const with braces, <code>src={img}</code>, then build a second src with an expression: <code>src={img + "?grayscale"}</code> (the same photo in black and white).',
    'Add a <code>.food-img</code> class (100px wide and 100px high) to <code>styles.css</code>, give it to all three images, and give each one an <code>alt</code> that describes it.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const img = "https://picsum.photos/seed/bacon/200";

ReactDOM.render(
  <div>
    {/* TODO 1: give the heading the "heading" class (in JSX the attribute is className) */}
    {/* TODO 2: make it editable (contentEditable) and turn the spelling underline off (spellCheck) */}
    <h1>My Favourite Foods</h1>

    {/* TODO 3: swap this list for a <div> holding three <img /> elements
        TODO 4: first src = {img}, second src = {img + "?grayscale"}, third = any picsum.photos URL
        TODO 5: give all three the food-img class and an alt text */}
    <ul>
      <li>Bacon</li>
      <li>Jamon</li>
      <li>Noodles</li>
    </ul>
  </div>,
  document.getElementById("root")
);
`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 20px;
}

/* TODO 1: a .heading class that turns text red */


/* TODO 5: a .food-img class that makes images 100px wide and 100px high */

`},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const img = "https://picsum.photos/seed/bacon/200";

ReactDOM.render(
  <div>
    <h1 className="heading" contentEditable="true" spellCheck="false">
      My Favourite Foods
    </h1>
    <div>
      <img className="food-img" src={img} alt="placeholder photo" />
      <img className="food-img" src={img + "?grayscale"} alt="the same photo in greyscale" />
      <img className="food-img" src="https://picsum.photos/seed/noodles/200" alt="another placeholder photo" />
    </div>
  </div>,
  document.getElementById("root")
);
`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 20px;
}

.heading {
  color: red;
}

.food-img {
  width: 100px;
  height: 100px;
}
`},
  explore:[{
    title:'HTML to JSX translator', height:560,
    note:'Paste or edit HTML on the left. The right side shows the same markup as JSX, and the list underneath names every change that was needed: renamed attributes, self-closing tags, styles as objects, events as functions.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px">
    <h4>HTML (edit me)</h4>
    <textarea id="src" spellcheck="false" style="width:100%;height:230px;font:12.5px ui-monospace,Menlo,monospace;padding:10px;border:1px solid #cfd5e6;border-radius:8px"><h1 class="heading" contenteditable="true" spellcheck="false">My Favourite Foods</h1>
<label for="food">Favourite</label>
<input id="food" type="text" maxlength="20" tabindex="1" required>
<img class="food-img" src="https://picsum.photos/seed/bacon/200" alt="placeholder photo">
<br>
<p style="color: red; font-size: 20px" onclick="alert('Yum')">Click me</p>
<div aria-label="notes" data-count="3"><!-- more to come --></div></textarea>
  </div>
  <div style="flex:1;min-width:260px">
    <h4>JSX</h4>
    <pre id="out" class="readout" style="height:230px;margin:0;overflow:auto"></pre>
  </div>
</div>
<pre class="readout" id="changes" style="white-space:pre-wrap;margin-top:12px"></pre>
<script>
  var ATTR = { 'class': 'className', 'for': 'htmlFor', tabindex: 'tabIndex', contenteditable: 'contentEditable', spellcheck: 'spellCheck',
    maxlength: 'maxLength', minlength: 'minLength', readonly: 'readOnly', autofocus: 'autoFocus', autocomplete: 'autoComplete',
    colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet', crossorigin: 'crossOrigin', enctype: 'encType', novalidate: 'noValidate',
    accesskey: 'accessKey', datetime: 'dateTime', inputmode: 'inputMode', allowfullscreen: 'allowFullScreen', usemap: 'useMap' };
  var EVENTS = { onclick: 'onClick', ondblclick: 'onDoubleClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit',
    onmouseover: 'onMouseOver', onmouseout: 'onMouseOut', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave',
    onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onfocus: 'onFocus', onblur: 'onBlur' };
  var BOOL = ['disabled', 'checked', 'required', 'readonly', 'autofocus', 'multiple', 'selected', 'hidden', 'novalidate', 'allowfullscreen', 'open'];
  var VOID = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
  var changes = [];
  function note(s) { if (changes.indexOf(s) < 0) changes.push(s); }
  function camel(p) { return p.trim().split('-').map(function (w, i) { return i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1); }).join(''); }
  function styleObj(str) {
    return '{{ ' + str.split(';').map(function (d) { return d.trim(); }).filter(Boolean).map(function (d) {
      var i = d.indexOf(':');
      return camel(d.slice(0, i)) + ': "' + d.slice(i + 1).trim() + '"';
    }).join(', ') + ' }}';
  }
  function squash(t) { return t.split('\\n').join(' ').split('\\t').join(' ').replace(/ +/g, ' '); }
  function braces(t) {
    var o = '';
    for (var i = 0; i < t.length; i++) { var c = t.charAt(i); o += c === '{' ? '{"{"}' : c === '}' ? '{"}"}' : c; }
    if (o !== t) note('Curly braces in text would switch to JavaScript, so they are written {"{"} and {"}"}');
    return o;
  }
  function conv(node, depth) {
    var pad = new Array(depth + 1).join('  ');
    if (node.nodeType === 3) {
      var t = squash(node.textContent).trim();
      return t ? pad + braces(t) + '\\n' : '';
    }
    if (node.nodeType === 8) { note('HTML comments become JSX comments: {/* ... */}'); return pad + '{/* ' + node.textContent.trim() + ' */}\\n'; }
    if (node.nodeType !== 1) return '';
    var tag = node.tagName.toLowerCase(), attrs = [];
    for (var i = 0; i < node.attributes.length; i++) {
      var name = node.attributes[i].name, val = node.attributes[i].value;
      if (name === 'style') { attrs.push('style=' + styleObj(val)); note('style="..." becomes an object, style={{ fontSize: "20px" }} (next lecture)'); continue; }
      if (name.indexOf('on') === 0 && name.length > 2) {
        var ev = EVENTS[name] || ('on' + name.charAt(2).toUpperCase() + name.slice(3));
        attrs.push(ev + '={() => ' + val.trim().replace(/;$/, '') + '}');
        note(name + ' becomes ' + ev + ', and it takes a function instead of a string of code');
        continue;
      }
      var jsxName = ATTR[name] || name;
      if (ATTR[name]) note(name + ' becomes ' + jsxName);
      if (name.indexOf('aria-') === 0 || name.indexOf('data-') === 0) note('aria-* and data-* attributes keep their dashes');
      if (BOOL.indexOf(name) >= 0 && (val === '' || val === name)) attrs.push(jsxName);
      else attrs.push(jsxName + '="' + val + '"');
    }
    var kids = '';
    for (var k = 0; k < node.childNodes.length; k++) kids += conv(node.childNodes[k], depth + 1);
    var open = '<' + tag + (attrs.length ? ' ' + attrs.join(' ') : '');
    if (VOID.indexOf(tag) >= 0) { note('<' + tag + '> needs no closing tag in HTML, but JSX wants it to close itself: <' + tag + ' />'); return pad + open + ' />\\n'; }
    if (!kids) return pad + open + '></' + tag + '>\\n';
    if (kids.split('\\n').length === 2 && kids.trim().length < 50) return pad + open + '>' + kids.trim() + '</' + tag + '>\\n';
    return pad + open + '>\\n' + kids + pad + '</' + tag + '>\\n';
  }
  function go() {
    changes = [];
    var doc = new DOMParser().parseFromString(document.getElementById('src').value, 'text/html');
    var nodes = [].slice.call(doc.body.childNodes);
    var top = nodes.filter(function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); }).length;
    var body = nodes.map(function (n) { return conv(n, 1); }).join('');
    var out;
    if (top > 1) { note('Several top-level elements need one parent, such as a <div> (or a fragment <>...</>)'); out = '<div>\\n' + body + '</div>'; }
    else out = body.split('\\n').map(function (l) { return l.slice(2); }).join('\\n');
    document.getElementById('out').textContent = out.trim();
    document.getElementById('changes').textContent = changes.length ?
      'What changed:\\n' + changes.map(function (c) { return '  • ' + c; }).join('\\n') : 'Nothing to change: this HTML is already valid JSX.';
  }
  document.getElementById('src').addEventListener('input', go);
  go();
<\/script>`,
  }],
  quiz:[
    { q:'Why is it <code>className</code> and not <code>class</code> in JSX?', options:['class is deprecated in HTML','JSX turns into JavaScript, where class is a reserved word and the DOM property is called className','className is shorter','Babel cannot read the letter c'], answer:1, why:'JSX attributes map onto DOM properties, and the DOM property for an element\'s classes is className.' },
    { q:'What is the difference between <code>src="{img}"</code> and <code>src={img}</code>?', options:['None','The quoted one is the literal text {img}; the braces read the img variable','Braces only work for numbers','Quotes load faster'], answer:1, why:'Quotes always mean a plain string. Braces mean: evaluate this JavaScript and use the result.' },
    { q:'How must an image be written in JSX?', options:['<code>&lt;img src="a.png"&gt;</code>, as in HTML','<code>&lt;img src="a.png" /&gt;</code>','Only as <code>&lt;img&gt;&lt;/img&gt;</code>','With a closing <code>&lt;/img&gt;</code> and a slash'], answer:1, why:'JSX needs every element to be closed. A childless element closes itself with a slash; the unclosed HTML form is a syntax error.' },
  ],
});

PG.add({
  id:'l286', index:286, udemyId:17038734, minutes:9, section:'s36', slug:'inline-styling', kind:'react',
  title:'Inline Styling for React Elements',
  blurb:'In JSX the <code>style</code> attribute takes a JavaScript <b>object</b>, not a string, hence the double braces in <code>style={{ color: "red" }}</code>: the outer pair means "JavaScript here", the inner pair is the object. Property names become camelCase (<code>fontSize</code>) and values are strings. Because it is an object, JavaScript can change it before rendering, which is what inline styles are good for.',
  tasks:[
    'Add <code>style="color: red"</code> to the <code>&lt;h1&gt;</code> the way you would in HTML. React refuses: read the error in the console.',
    'Pass an object instead: <code>style={{ color: "red" }}</code>.',
    'Move the object into <code>const customStyle</code> above the render call and write <code>style={customStyle}</code>.',
    'Add <code>fontSize: "20px"</code> and <code>border: "1px solid black"</code>. CSS names lose their dash and become camelCase, values are strings, and pairs are separated by commas.',
    'Under the object, write <code>customStyle.color = "blue";</code>. The heading turns blue without any change to the JSX.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

// TODO 3: create const customStyle here: an object with color "red"
// TODO 4: ...plus fontSize "20px" and border "1px solid black"

// TODO 5: on the next line, change customStyle.color to "blue"

ReactDOM.render(
  // TODO 1: add style="color: red" to the h1 and read the console error
  // TODO 2: fix it with an object: style={{ color: "red" }}
  // TODO 3: then use style={customStyle} instead
  <h1>Hello World!</h1>,
  document.getElementById("root")
);
`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const customStyle = {
  color: "red",
  fontSize: "20px",
  border: "1px solid black"
};

customStyle.color = "blue";

ReactDOM.render(
  <h1 style={customStyle}>Hello World!</h1>,
  document.getElementById("root")
);
`},
  explore:[{
    title:'Build a style object', height:520,
    note:'Move the knobs. The heading is styled the way React does it, by copying each key of the object onto <code>element.style</code>. Compare the object with the CSS rule it stands for: dashes become camelCase, values become strings, semicolons become commas.',
    html:`
<div class="knobs">
  <label>color <input type="color" id="color" value="#e03131"></label>
  <label>fontSize <input type="range" id="fontSize" min="12" max="64" value="32"><span class="val" id="fontSizeV"></span></label>
  <label>border <input type="range" id="bw" min="0" max="10" value="1"><span class="val" id="bwV"></span></label>
  <label><select id="bs"><option>solid</option><option>dashed</option><option>dotted</option><option>double</option></select></label>
  <label>backgroundColor <input type="color" id="bg" value="#ffffff"></label>
  <label>padding <input type="range" id="pad" min="0" max="40" value="8"><span class="val" id="padV"></span></label>
  <label>textTransform <select id="tt"><option>none</option><option>uppercase</option><option>lowercase</option><option>capitalize</option></select></label>
</div>
<div class="stage"><h1 id="h" style="margin:0">Hello World!</h1></div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px"><h4>JSX: a JavaScript object</h4><pre class="readout" id="js"></pre></div>
  <div style="flex:1;min-width:250px"><h4>The same thing in CSS</h4><pre class="readout" id="css"></pre></div>
</div>
<script>
  function v(id) { return document.getElementById(id).value; }
  function kebab(k) { var o = ''; for (var i = 0; i < k.length; i++) { var c = k.charAt(i); o += (c >= 'A' && c <= 'Z') ? '-' + c.toLowerCase() : c; } return o; }
  function upd() {
    var o = {
      color: v('color'),
      fontSize: v('fontSize') + 'px',
      border: v('bw') + 'px ' + v('bs') + ' black',
      backgroundColor: v('bg'),
      padding: v('pad') + 'px',
      textTransform: v('tt')
    };
    var h = document.getElementById('h');
    h.removeAttribute('style'); h.style.margin = '0';
    Object.keys(o).forEach(function (k) { h.style[k] = o[k]; });
    document.getElementById('fontSizeV').textContent = o.fontSize;
    document.getElementById('bwV').textContent = v('bw') + 'px';
    document.getElementById('padV').textContent = o.padding;
    document.getElementById('js').textContent = 'const customStyle = {\\n' +
      Object.keys(o).map(function (k) { return '  ' + k + ': "' + o[k] + '"'; }).join(',\\n') +
      '\\n};\\n\\n<h1 style={customStyle}>Hello World!</h1>';
    document.getElementById('css').textContent = 'h1 {\\n' +
      Object.keys(o).map(function (k) { return '  ' + kebab(k) + ': ' + o[k] + ';'; }).join('\\n') + '\\n}';
  }
  document.querySelectorAll('input,select').forEach(function (el) { el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`,
  }],
  quiz:[
    { q:'Why does <code>style={{ color: "red" }}</code> have two pairs of braces?', options:['A typo React tolerates','The outer pair switches to JavaScript and the inner pair is the object literal','Double braces mean !important','One pair for each CSS property'], answer:1, why:'A JSX attribute needs braces to hold JavaScript, and the value is an object, which has braces of its own.' },
    { q:'How is <code>background-color: yellow;</code> written in a style object?', options:['background-color: yellow','backgroundColor: "yellow"','"backgroundColor": yellow;','BackgroundColor = "yellow"'], answer:1, why:'Keys are camelCase JavaScript property names, values are strings, and entries are separated by commas.' },
    { q:'When do the React docs suggest inline styles instead of a CSS class?', options:['Always','Never','Mainly for values worked out while the app runs; classes in a stylesheet are the default','Only for colours'], answer:2, why:'Classes are the normal way to style. Inline style objects earn their place when JavaScript decides a value, such as a colour that depends on the time.' },
  ],
});

PG.add({
  id:'l287', index:287, udemyId:17038752, minutes:10, section:'s36', slug:'react-styling-practice', kind:'react',
  title:'React Styling Practice',
  blurb:'One heading that greets you according to the time of day: plain JavaScript works out the hour and picks the words and a colour, a CSS class gives the heading its look, and an inline style object sets the colour. It pulls together expressions in braces, <code>className</code> and <code>style</code>.',
  tasks:[
    'Get the current hour with <code>new Date().getHours()</code> and <code>console.log</code> it.',
    'Use <code>if / else if / else</code> to set a <code>greeting</code>: before 12 "Good morning", before 18 "Good afternoon", otherwise "Good evening".',
    'Create a <code>customStyle</code> object and set its <code>color</code> in each branch: red in the morning, green in the afternoon, blue in the evening.',
    'Render a single <code>&lt;h1&gt;</code> with <code>className="heading"</code>, <code>style={customStyle}</code> and <code>{greeting}</code> inside it.',
    'Test every branch by faking the time, for example <code>new Date(2024, 0, 1, 9)</code> for 9 am (months count from 0). Put the real date back afterwards. The Explore tab shows the same logic with an hour slider.'
  ],
  files:{
'index.jsx':`// Build ONE <h1> that greets you according to the time of day:
//   before 12:00         -> "Good morning"   in red
//   12:00 until 18:00    -> "Good afternoon" in green
//   18:00 until midnight -> "Good evening"   in blue
// It also needs the "heading" class from styles.css.

import React from "react";
import ReactDOM from "react-dom";

// TODO 1: the current hour (0-23), from new Date().getHours()
//   Testing tip: new Date(2024, 0, 1, 15) is 3 pm on 1 January 2024.


// TODO 2: a greeting variable and a customStyle object; fill both with if / else if / else


// TODO 3: render the h1 with className, style and {greeting}

`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 20px;
}

.heading {
  font-size: 50px;
  font-weight: bold;
  border-bottom: 5px solid black;
}
`},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

const date = new Date();
const currentTime = date.getHours();

let greeting;

const customStyle = {
  color: ""
};

if (currentTime < 12) {
  greeting = "Good morning";
  customStyle.color = "red";
} else if (currentTime < 18) {
  greeting = "Good afternoon";
  customStyle.color = "green";
} else {
  greeting = "Good evening";
  customStyle.color = "blue";
}

ReactDOM.render(
  <h1 className="heading" style={customStyle}>
    {greeting}
  </h1>,
  document.getElementById("root")
);
`},
  explore:[{
    title:'Which branch runs at which hour?', height:540,
    note:'Drag the hour. The highlighted lines are the branch that runs, the comments show each test being checked, and the heading is styled with the result. An <code>else if</code> is only checked when everything above it was false, which is why each test only needs an upper limit.',
    html:`
<style>
  .heading{font-size:46px;font-weight:bold;border-bottom:5px solid black;margin:0}
  .hit{background:#2b3a67;display:inline-block;min-width:100%}
  .dim{color:#7d859e}
</style>
<div class="knobs">
  <label>pretend the hour is <input type="range" id="hr" min="0" max="23" value="9"><span class="val" id="hv"></span></label>
</div>
<div class="stage"><h1 id="h" class="heading"></h1></div>
<pre class="readout" id="code"></pre>
<script>
  function esc(s) { return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;'); }
  function upd() {
    var t = Number(document.getElementById('hr').value), branch, greeting, color;
    if (t < 12) { branch = 1; greeting = 'Good morning'; color = 'red'; }
    else if (t < 18) { branch = 2; greeting = 'Good afternoon'; color = 'green'; }
    else { branch = 3; greeting = 'Good evening'; color = 'blue'; }
    document.getElementById('hv').textContent = (t < 10 ? '0' : '') + t + ':00';
    var h = document.getElementById('h'); h.textContent = greeting; h.style.color = color;
    var c1 = '      // ' + t + ' < 12 is ' + (t < 12);
    var c2 = branch === 1 ? '   // skipped' : '   // ' + t + ' < 18 is ' + (t < 18);
    var rows = [
      ['const currentTime = ' + t + ';   // from new Date().getHours()', 0],
      ['let greeting;', 0],
      ['const customStyle = { color: "" };', 0],
      ['', 0],
      ['if (currentTime < 12) {' + c1, -1],
      ['  greeting = "Good morning";', 1],
      ['  customStyle.color = "red";', 1],
      ['} else if (currentTime < 18) {' + c2, -1],
      ['  greeting = "Good afternoon";', 2],
      ['  customStyle.color = "green";', 2],
      ['} else {', -1],
      ['  greeting = "Good evening";', 3],
      ['  customStyle.color = "blue";', 3],
      ['}', -1],
      ['', 0],
      ['<h1 className="heading" style={customStyle}>{greeting}</h1>', 0],
      ['// customStyle is { color: "' + color + '" } and greeting is "' + greeting + '"', 0]
    ];
    document.getElementById('code').innerHTML = rows.map(function (r) {
      var txt = esc(r[0]);
      if (r[1] > 0) return r[1] === branch ? '<span class="hit">' + txt + '</span>' : '<span class="dim">' + txt + '</span>';
      return txt;
    }).join('\\n');
  }
  document.getElementById('hr').addEventListener('input', upd);
  document.getElementById('hr').value = new Date().getHours();
  upd();
<\/script>`,
  }],
  quiz:[
    { q:'What does <code>new Date().getHours()</code> return at 5:30 pm?', options:['5','17','"17:30"','5.5'], answer:1, why:'getHours uses the 24-hour clock and returns a whole number from 0 to 23.' },
    { q:'With <code>if (h &lt; 12) … else if (h &lt; 18) … else …</code>, which greeting does exactly noon (h = 12) get?', options:['Morning','Afternoon','Evening','None of them'], answer:1, why:'12 &lt; 12 is false, so the first branch is skipped; 12 &lt; 18 is true, so the afternoon branch runs.' },
    { q:'The heading has <code>className="heading"</code> and <code>style={customStyle}</code>. If both set a colour, which wins?', options:['The class','The inline style','Whichever is written first','Neither: it turns black'], answer:1, why:'Inline styles beat class rules in the cascade, so the colour from the style object is used.' },
  ],
});


/* ---------- 288–293: components, modules, Keeper part 1 ---------- */

const GREETING_HEADING = `import React from "react";

function Heading() {
  const date = new Date();
  const currentTime = date.getHours();

  let greeting;

  const customStyle = {
    color: ""
  };

  if (currentTime < 12) {
    greeting = "Good morning";
    customStyle.color = "red";
  } else if (currentTime < 18) {
    greeting = "Good afternoon";
    customStyle.color = "green";
  } else {
    greeting = "Good evening";
    customStyle.color = "blue";
  }

  return (
    <h1 className="heading" style={customStyle}>
      {greeting}
    </h1>
  );
}

export default Heading;
`;

const GREETING_CSS = `body {
  font-family: sans-serif;
  padding: 20px;
}

.heading {
  font-size: 50px;
  font-weight: bold;
  border-bottom: 5px solid black;
}
`;

PG.add({
  id:'l288', index:288, udemyId:17038762, minutes:16, section:'s36', slug:'react-components', kind:'react',
  title:'React Components',
  blurb:'A component is a function with a <b>capitalised</b> name that returns JSX. You use it like a tag, <code>&lt;Heading /&gt;</code>, and React calls the function and puts whatever it returns in that spot. Each component lives in its own <code>.jsx</code> file with <code>export default</code>, gets imported where it is needed, and an <code>App</code> component at the top of the tree is all the entry file renders.',
  tasks:[
    'Read <code>components/Heading.jsx</code>: a capitalised function that returns JSX, exported with <code>export default Heading</code> (no brackets, so the function itself is exported). <code>index.jsx</code> imports it and uses it as <code>&lt;Heading /&gt;</code>.',
    'In <code>components/List.jsx</code>, write a <code>List</code> component that returns the <code>&lt;ul&gt;</code> with its three items, and export it.',
    'In <code>index.jsx</code>, import List and replace the <code>&lt;ul&gt;</code> with <code>&lt;List /&gt;</code>. Add a second <code>&lt;List /&gt;</code> to see that one component can be used many times, then remove it.',
    'In <code>components/App.jsx</code>, create an <code>App</code> component that returns a <code>&lt;div&gt;</code> with <code>&lt;Heading /&gt;</code> and <code>&lt;List /&gt;</code>. App sits in the same folder as them, so its imports are <code>"./Heading"</code> and <code>"./List"</code>.',
    'Reduce <code>index.jsx</code> to rendering <code>&lt;App /&gt;</code>, imported from <code>"./components/App"</code>.',
    'Write <code>&lt;heading /&gt;</code> in lowercase somewhere and look at the preview and the console. The Explore tab shows why. Put the capital back.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
import Heading from "./components/Heading";
// TODO 3: import List from "./components/List"
// TODO 5: once App.jsx is finished, import App and render <App /> instead of the div below

ReactDOM.render(
  <div>
    <Heading />
    {/* TODO 3: replace this list with <List /> */}
    <ul>
      <li>Bacon</li>
      <li>Jamon</li>
      <li>Noodles</li>
    </ul>
  </div>,
  document.getElementById("root")
);
`,
'components/Heading.jsx':`import React from "react";

function Heading() {
  return <h1>My Favourite Foods</h1>;
}

export default Heading;
`,
'components/List.jsx':`import React from "react";

// TODO 2: a List component (a capitalised function) that returns the <ul>
//         with its three <li>s, then export it as the default export

`,
'components/App.jsx':`import React from "react";
// TODO 4: import Heading and List (they are in this same folder, so the paths start with ./)

// TODO 4: an App component that returns a <div> holding <Heading /> and <List />,
//         exported as the default export

`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':ENTRY,
'components/List.jsx':`import React from "react";

function List() {
  return (
    <ul>
      <li>Bacon</li>
      <li>Jamon</li>
      <li>Noodles</li>
    </ul>
  );
}

export default List;
`,
'components/App.jsx':`import React from "react";
import Heading from "./Heading";
import List from "./List";

function App() {
  return (
    <div>
      <Heading />
      <List />
    </div>
  );
}

export default App;
`},
  explore:[{
    title:'Why the capital letter matters', height:500,
    note:'Type a tag or click a sample. Babel turns a lowercase tag into a <b>string</b> (an HTML element name) and a capitalised tag into a <b>variable</b> (your component). Only the second one makes React call your function.',
    html:`
<div class="knobs">
  <label>JSX <input id="src" type="text" spellcheck="false" autocomplete="off" style="width:220px;font-family:ui-monospace,Menlo,monospace"></label>
  <span id="chips" style="display:flex;gap:6px;flex-wrap:wrap"></span>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px"><h4>Babel output</h4><pre class="readout" id="out" style="white-space:pre-wrap"></pre></div>
  <div style="flex:1;min-width:250px"><h4>HTML that reaches the page</h4><pre class="readout" id="dom" style="white-space:pre-wrap"></pre></div>
</div>
<div class="stage" id="view" style="min-height:40px"></div>
<p class="note" id="msg"></p>
${REACT_SCRIPTS}
${BABEL_SCRIPT}
<script>
  function Heading() { return React.createElement('h1', null, 'My Favourite Foods'); }
  function List() { return React.createElement('ul', null, React.createElement('li', null, 'Bacon'), React.createElement('li', null, 'Jamon'), React.createElement('li', null, 'Noodles')); }
  var PRESETS = ['<Heading />', '<heading />', '<List />', '<list />', '<h1>Hi</h1>', '<Footer />'];
  var src = document.getElementById('src'), out = document.getElementById('out'), dom = document.getElementById('dom'), msg = document.getElementById('msg');
  var view = document.getElementById('view'), root = ReactDOM.createRoot(view);
  PRESETS.forEach(function (p) {
    var b = document.createElement('button');
    b.textContent = p; b.style.fontFamily = 'ui-monospace,Menlo,monospace';
    b.onclick = function () { src.value = p; go(); };
    document.getElementById('chips').appendChild(b);
  });
  function draw(el) { ReactDOM.flushSync(function () { root.render(el); }); }
  function go() {
    var code, el;
    try {
      code = Babel.transform('var el = ' + src.value + ';', { presets: ['react'] }).code.split('/*#__PURE__*/').join('');
    } catch (e) {
      draw(null); out.textContent = 'Syntax error: ' + String(e.message).split('\\n')[0].replace('unknown: ', ''); dom.textContent = ''; msg.textContent = '';
      return;
    }
    out.textContent = code.replace('var el = ', '');
    try {
      el = new Function('React', 'Heading', 'List', code + '\\nreturn el;')(React, Heading, List);
    } catch (e) {
      draw(null); dom.textContent = '(nothing: the code stops with an error)';
      msg.textContent = e.message + '. A capitalised tag is a variable, so a component with that name has to exist where the JSX is written. In an app that means importing it.';
      return;
    }
    draw(el);
    dom.textContent = view.innerHTML.split('><').join('>\\n<') || '(empty)';
    var t = el && el.type;
    if (typeof t === 'string') {
      var unknown = document.createElement(t) instanceof HTMLUnknownElement;
      msg.textContent = 'Lowercase tag: Babel passed the string "' + t + '", so React created a <' + t + '> HTML element' +
        (unknown ? '. Browsers have no such element, so nothing shows, and your component function was never called.' : '.');
    } else if (typeof t === 'function') {
      msg.textContent = 'Capitalised tag: Babel passed the variable ' + t.name + ' itself, so React called that function and put what it returned into the page.';
    } else msg.textContent = '';
  }
  src.addEventListener('input', go);
  src.value = '<Heading />';
  go();
<\/script>`,
  }],
  quiz:[
    { q:'Why must a component\'s name start with a capital letter?', options:['Style guides say so, but React does not care','React treats lowercase tags as built-in HTML elements and capitalised tags as components','Babel cannot compile lowercase functions','Only default exports need it'], answer:1, why:'Babel compiles <code>&lt;heading /&gt;</code> to createElement("heading"), a string, and <code>&lt;Heading /&gt;</code> to createElement(Heading), a reference to your function.' },
    { q:'What is wrong with <code>export default Heading();</code>?', options:['Nothing','It calls the function and exports what it returns, instead of exporting the component','export default needs braces','Components cannot be exported'], answer:1, why:'The brackets run the function on the spot. Export the function itself, without brackets, so React can call it when it renders.' },
    { q:'App.jsx and Heading.jsx both sit in <code>components/</code>. How does App import Heading?', options:['import Heading from "Heading"','import Heading from "./Heading"','import Heading from "./components/Heading"','import { Heading } from "./Heading"'], answer:1, why:'Paths that start with ./ are relative to the importing file. A bare name would be looked up as an npm package, and braces would ask for a named export that does not exist.' },
  ],
});

PG.add({
  id:'l289', index:289, udemyId:17038778, minutes:5, section:'s36', slug:'react-components-practice', kind:'react',
  title:'React Components Practice',
  blurb:'Refactoring practice: the time-of-day greeting from the styling lecture sits entirely in the entry file. Split it into a <code>Heading</code> component that holds the logic and the styled <code>&lt;h1&gt;</code>, and an <code>App</code> component that renders it, so <code>index.jsx</code> only renders <code>&lt;App /&gt;</code>. The page should look exactly the same afterwards.',
  tasks:[
    'In <code>components/Heading.jsx</code>, write a <code>Heading</code> component and move the time logic (the hour, <code>greeting</code>, <code>customStyle</code> and the <code>if</code> chain) inside it, before its <code>return</code>.',
    'Make Heading return the styled <code>&lt;h1&gt;</code> and add <code>export default Heading;</code>.',
    'In <code>components/App.jsx</code>, import Heading and return <code>&lt;Heading /&gt;</code> from an <code>App</code> component. Export it.',
    'Cut <code>index.jsx</code> down to the imports and <code>ReactDOM.render(&lt;App /&gt;, document.getElementById("root"))</code>.',
    'Check the page looks the same. Then fake the hour inside Heading, <code>new Date(2024, 0, 1, 20)</code>, to prove the logic moved with the component, and put the real date back.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

// TODO: move the logic and the <h1> below into components/Heading.jsx,
//       then render <App /> here instead (and nothing else).

const date = new Date();
const currentTime = date.getHours();

let greeting;

const customStyle = {
  color: ""
};

if (currentTime < 12) {
  greeting = "Good morning";
  customStyle.color = "red";
} else if (currentTime < 18) {
  greeting = "Good afternoon";
  customStyle.color = "green";
} else {
  greeting = "Good evening";
  customStyle.color = "blue";
}

ReactDOM.render(
  <h1 className="heading" style={customStyle}>
    {greeting}
  </h1>,
  document.getElementById("root")
);
`,
'components/App.jsx':`import React from "react";
// TODO: import Heading

// TODO: an App component that returns <Heading />, exported as the default export

`,
'components/Heading.jsx':`import React from "react";

// TODO: a Heading component. Put the time logic inside it, before the return,
//       return the styled <h1>, and export it as the default export.

`,
'styles.css':GREETING_CSS},
  solution:{
'index.jsx':ENTRY,
'components/App.jsx':`import React from "react";
import Heading from "./Heading";

function App() {
  return <Heading />;
}

export default App;
`,
'components/Heading.jsx':GREETING_HEADING},
  quiz:[
    { q:'After the refactor, what is the only job left for <code>index.jsx</code>?', options:['Working out the greeting','Rendering <code>&lt;App /&gt;</code> into the root div','Holding the CSS','Exporting Heading'], answer:1, why:'The entry file just mounts the top of the tree. Everything else lives in components.' },
    { q:'Why does the greeting logic have to move into Heading.jsx along with the <code>&lt;h1&gt;</code>?', options:['index.jsx cannot contain if statements','The h1 uses greeting and customStyle, and variables in one file are invisible to another unless exported','React requires every component to have an if','It makes the page load faster'], answer:1, why:'Each module has its own scope. Leaving the logic behind would make greeting and customStyle undefined inside Heading.' },
    { q:'Where is the better home for <code>new Date().getHours()</code>: inside the Heading function or above it?', options:['Above it: then it runs only once, when the file loads','Inside it: then it runs every time the component renders, so the value stays current','It has to go in App','It makes no difference in any app'], answer:1, why:'Code inside the function runs on each render. Module-level code runs once, so a long-open page would keep showing the hour it was loaded at.' },
  ],
});

PG.add({
  id:'l290', index:290, udemyId:17038790, minutes:11, section:'s36', slug:'es6-import-export-modules', kind:'react',
  title:'Javascript ES6 - Import, Export and Modules',
  blurb:'Every JavaScript file is a module: what it defines stays private unless it is exported. A file can have one <b>default</b> export, imported under any name you like, and any number of <b>named</b> exports, imported in braces under their exact names: <code>import PI, { doublePi, triplePi } from "./math.js"</code>. This is the same mechanism as <code>import React from "react"</code>.',
  tasks:[
    'In <code>math.js</code>, add <code>export default pi;</code>. In <code>index.jsx</code>, write <code>import pi from "./math.js";</code> and show <code>{pi}</code> in the first <code>&lt;li&gt;</code>.',
    'Rename the import to <code>PI</code> (in the import line and in the JSX). It still works, because the importing file chooses the name of a default export.',
    'In <code>math.js</code>, export the two functions by name: <code>export { doublePi, triplePi };</code>. Import them beside the default: <code>import PI, { doublePi, triplePi } from "./math.js";</code>.',
    'Show <code>{doublePi()}</code> and <code>{triplePi()}</code> in two more items. Leave the brackets off one to see why they are needed, then put them back.',
    'Try the wildcard form, <code>import * as pi from "./math.js";</code>, with <code>{pi.default}</code>, <code>{pi.doublePi()}</code> and <code>{pi.triplePi()}</code>. Add <code>console.log(pi)</code> to see the object it creates, then return to the clearer form.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
// TODO 1: import the default export of ./math.js (then rename it PI)
// TODO 3: import doublePi and triplePi too (named imports go in braces)

ReactDOM.render(
  <ul>
    {/* TODO 1 and 4: show PI, doublePi() and triplePi() in three <li>s */}
    <li>?</li>
  </ul>,
  document.getElementById("root")
);
`,
'math.js':`const pi = 3.1415962;

function doublePi() {
  return pi * 2;
}

function triplePi() {
  return pi * 3;
}

// TODO 1: make pi the default export
// TODO 3: export doublePi and triplePi as named exports
`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
import PI, { doublePi, triplePi } from "./math.js";

ReactDOM.render(
  <ul>
    <li>{PI}</li>
    <li>{doublePi()}</li>
    <li>{triplePi()}</li>
  </ul>,
  document.getElementById("root")
);
`,
'math.js':`const pi = 3.1415962;

function doublePi() {
  return pi * 2;
}

function triplePi() {
  return pi * 3;
}

export default pi;
export { doublePi, triplePi };
`},
  quiz:[
    { q:'How many default exports can one file have?', options:['None','One','Two','As many as it likes'], answer:1, why:'Default means "the main thing this file offers", so there can only be one. Everything else is a named export.' },
    { q:'math.js ends with <code>export { doublePi };</code>. Which import gets the function?', options:['import doublePi from "./math.js"','import { doublePi } from "./math.js"','import { double } from "./math.js"','import "./math.js".doublePi'], answer:1, why:'Named exports are imported in braces under exactly the same name. The form without braces would receive the default export instead.' },
    { q:'After <code>import * as pi from "./math.js"</code>, where is the default export?', options:['pi itself','pi.default','pi.main','It is left out'], answer:1, why:'The wildcard gathers every export into one object; named exports become properties and the default export sits under the key default.' },
  ],
});

PG.add({
  id:'l291', index:291, udemyId:17038820, minutes:4, section:'s36', slug:'es6-import-export-practice', kind:'react',
  title:'Javascript ES6 Import, Export and Modules Practice',
  blurb:'A short drill with named exports: <code>calculator.js</code> defines four functions but shares none of them, so the list in <code>index.jsx</code> fails with <i>add is not defined</i>. Export them, import them, and the page shows four results.',
  tasks:[
    'In <code>calculator.js</code>, export all four functions as named exports: list the names in braces, with no brackets after them.',
    'In <code>index.jsx</code>, import them in braces from <code>"./calculator"</code>. The order inside the braces does not matter; the spelling does.',
    'Check the list shows 3, 6, 5 and 2.5.',
    'Redo the import as a wildcard, <code>import * as calculator from "./calculator";</code>, and put <code>calculator.</code> in front of every call. Both styles appear in real code.',
    'Extra: add a <code>power(base, exponent)</code> function to calculator.js (JavaScript writes powers as <code>**</code>), export it, and show <code>power(2, 8)</code> in a fifth item.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
// TODO 2: import add, multiply, subtract and divide from ./calculator.js
//         When it works, the list shows 3, 6, 5 and 2.5.

ReactDOM.render(
  <ul>
    <li>{add(1, 2)}</li>
    <li>{multiply(2, 3)}</li>
    <li>{subtract(7, 2)}</li>
    <li>{divide(5, 2)}</li>
  </ul>,
  document.getElementById("root")
);
`,
'calculator.js':`function add(n1, n2) {
  return n1 + n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

// TODO 1: export all four functions as named exports
`,
'styles.css':BASIC_CSS},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
import { add, multiply, subtract, divide, power } from "./calculator";

ReactDOM.render(
  <ul>
    <li>{add(1, 2)}</li>
    <li>{multiply(2, 3)}</li>
    <li>{subtract(7, 2)}</li>
    <li>{divide(5, 2)}</li>
    <li>{power(2, 8)}</li>
  </ul>,
  document.getElementById("root")
);
`,
'calculator.js':`function add(n1, n2) {
  return n1 + n2;
}

function multiply(n1, n2) {
  return n1 * n2;
}

function subtract(n1, n2) {
  return n1 - n2;
}

function divide(n1, n2) {
  return n1 / n2;
}

function power(base, exponent) {
  return base ** exponent;
}

export { add, multiply, subtract, divide, power };
`},
  quiz:[
    { q:'calculator.js ends with <code>export { add(), multiply() };</code>. What is wrong?', options:['Nothing','An export list takes names; add() is a function call, which is a syntax error there','Exports need the default keyword','Functions cannot be exported'], answer:1, why:'You export the function itself by its name. The brackets would mean "call it", which makes no sense in an export list.' },
    { q:'Which statement puts all of a module\'s exports into one object?', options:['import all from "./calculator"','import * as calculator from "./calculator"','import { * } from "./calculator"','import calculator.* from "./calculator"'], answer:1, why:'import * as name collects every export as a property of one namespace object, so each call is written calculator.add(...).' },
  ],
});

const KEEPER_SOLUTION = {
'index.jsx':ENTRY,
'components/App.jsx':`import React from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";

function App() {
  return (
    <div>
      <Header />
      <Note />
      <Footer />
    </div>
  );
}

export default App;
`,
'components/Header.jsx':`import React from "react";

function Header() {
  return (
    <header>
      <h1>Keeper</h1>
    </header>
  );
}

export default Header;
`,
'components/Note.jsx':`import React from "react";

function Note() {
  return (
    <div className="note">
      <h1>This is the note title</h1>
      <p>This is the note content</p>
    </div>
  );
}

export default Note;
`,
'components/Footer.jsx':`import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright © {currentYear}</p>
    </footer>
  );
}

export default Footer;
`};

PG.add({
  id:'l292', index:292, udemyId:17038882, minutes:5, section:'s36', slug:'keeper-app-part-1-challenge', kind:'react', project:true,
  title:'Keeper App Project - Part 1 Challenge',
  blurb:'The first part of <b>Keeper</b>, the module\'s notes app. Build an <code>App</code> component that renders three child components, <code>Header</code>, <code>Note</code> and <code>Footer</code>. The stylesheet is already written, so the job is to choose the elements and the class its selectors expect.',
  tasks:[
    'In <code>index.jsx</code>, import React, ReactDOM and App (from <code>"./components/App"</code>) and render <code>&lt;App /&gt;</code> into the root div.',
    'Build <code>Header</code>: a real <code>&lt;header&gt;</code> element around <code>&lt;h1&gt;Keeper&lt;/h1&gt;</code>. The yellow bar appears by itself because <code>styles.css</code> targets <code>header</code> and <code>header h1</code>.',
    'Build <code>Footer</code>: a <code>&lt;footer&gt;</code> containing <code>&lt;p&gt;Copyright © {year}&lt;/p&gt;</code>, with the year from <code>new Date().getFullYear()</code>.',
    'Build <code>Note</code>: a <code>&lt;div&gt;</code> holding an <code>&lt;h1&gt;</code> title and a <code>&lt;p&gt;</code> of content. Find the class in <code>styles.css</code> that turns it into a white card, and add it.',
    'In <code>App</code>, import the three components and render them in order (Header, Note, Footer) inside one <code>&lt;div&gt;</code>.',
    'Compare with the target in the Explore tab. If a part looks unstyled, find the selector in styles.css that should match it and check your element or class.'
  ],
  files:{
'index.jsx':`// Keeper App, part 1. Use the files in this project:
//
// 1. Render <App /> (components/App.jsx) into the root div from this file.
// 2. App shows three components in this order: Header, Note, Footer.
// 3. Header.jsx returns a <header> element with the app name in an <h1>.
// 4. Footer.jsx returns a <footer> element with a copyright line in a <p>.
//    JavaScript works out the year; never type it.
// 5. Note.jsx returns a <div> with an <h1> for the title and a <p> for the text.
// 6. Match the target in the Explore tab. styles.css is finished: read its
//    selectors to see which elements and which class your JSX needs.

// TODO: the imports, then ReactDOM.render

`,
'components/App.jsx':`import React from "react";
// TODO: import Header, Note and Footer (they sit in this same folder)

// TODO: an App component that returns Header, Note and Footer inside one <div>,
//       exported as the default export

`,
'components/Header.jsx':`import React from "react";

// TODO: a Header component that returns a <header> element
//       with the app name in an <h1>

`,
'components/Note.jsx':`import React from "react";

// TODO: a Note component: a <div> with an <h1> title and a <p> of content
//       (styles.css has a class that turns it into a card)

`,
'components/Footer.jsx':`import React from "react";

// TODO: a Footer component: a <footer> element with <p>Copyright © YEAR</p>,
//       where YEAR comes from new Date().getFullYear()

`,
'styles.css':KEEPER_CSS},
  solution:KEEPER_SOLUTION,
  explore:[{
    title:'The target, and the selectors that style it', height:430,
    note:'This is how Part 1 should look. Tick the box to label each element with the CSS selector that styles it: <code>header</code>, <code>footer</code> and their children are element selectors, so your JSX must use those exact elements; the card is a class selector, so the div needs <code>className="note"</code>.',
    html:`
<link href="https://fonts.googleapis.com/css?family=McLaren|Montserrat&display=swap" rel="stylesheet">
<style>
  .k{position:relative;height:300px;border:1px solid #dfe3ee;border-radius:10px;overflow:hidden;background:#eee;padding:0 16px;font-family:"Montserrat",sans-serif;color:#000}
  .k *{margin:0;padding:0;box-sizing:border-box}
  .k header{background-color:#f5ba13;margin:auto -16px;padding:16px 32px;box-shadow:0 0 10px 0 rgba(0,0,0,.3)}
  .k header h1{color:#fff;font-family:"McLaren",cursive;font-weight:200;font-size:2em}
  .k footer{position:absolute;text-align:center;bottom:0;left:0;width:100%;height:2.5rem}
  .k footer p{color:#ccc}
  .k .note{background:#fff;border-radius:7px;box-shadow:0 2px 5px #ccc;padding:10px;width:240px;margin:16px;float:left}
  .k .note h1{font-size:1.1em;margin-bottom:6px}
  .k .note p{font-size:1.1em;margin-bottom:10px;white-space:pre-wrap;word-wrap:break-word}
  .lbl [data-sel]{outline:2px dashed #5b9cff;outline-offset:-2px;position:relative}
  .lbl [data-sel]::after{content:attr(data-sel);position:absolute;bottom:2px;right:4px;background:#5b9cff;color:#fff;font:600 10.5px/1.4 ui-monospace,Menlo,monospace;padding:0 5px;border-radius:4px;white-space:nowrap}
</style>
<div class="knobs"><label><input type="checkbox" id="lbl"> label each element with the selector that styles it</label></div>
<div class="k" id="k">
  <header data-sel="header"><h1 data-sel="header h1">Keeper</h1></header>
  <div class="note" data-sel=".note"><h1 data-sel=".note h1">This is the note title</h1><p data-sel=".note p">This is the note content</p></div>
  <footer data-sel="footer"><p data-sel="footer p">Copyright © <span id="yr"></span></p></footer>
</div>
<script>
  document.getElementById('yr').textContent = new Date().getFullYear();
  document.getElementById('lbl').onchange = function (e) { document.getElementById('k').classList.toggle('lbl', e.target.checked); };
<\/script>`,
  }],
  quiz:[
    { q:'styles.css contains <code>header h1 { color: #fff; }</code>. Which JSX does that rule style?', options:['Every h1 on the page','An h1 inside a &lt;header&gt; element','An element with className="header h1"','Whatever the Header component returns'], answer:1, why:'A descendant selector matches elements in the DOM. It knows nothing about component names, only about the header element that ends up in the page.' },
    { q:'Which footer is still correct next January?', options:['<code>&lt;p&gt;Copyright © 2026&lt;/p&gt;</code>','<code>&lt;p&gt;Copyright © {new Date().getFullYear()}&lt;/p&gt;</code>','<code>&lt;p&gt;Copyright © {Date}&lt;/p&gt;</code>','<code>&lt;p&gt;Copyright © {year}&lt;/p&gt;</code> with <code>const year = "2026"</code>'], answer:1, why:'Only the version that asks a Date object for the year when the page renders keeps up with the calendar.' },
  ],
});

PG.add({
  id:'l293', index:293, udemyId:17038904, minutes:14, section:'s36', slug:'keeper-app-part-1-solution', kind:'react', project:true,
  title:'Keeper App Part 1 Solution',
  blurb:'The finished Part 1, already in the editor. Every component file follows the same pattern: import React, a capitalised function that returns JSX, a default export. The styling only appears because the JSX uses the exact elements the stylesheet targets, and <code>className</code> has to sit on an HTML element inside a component, not on the component\'s own tag.',
  tasks:[
    'Read the files from the top down: <code>index.jsx</code> renders App, App lists Header, Note and Footer, and each component file has an import, a capitalised function and a default export.',
    'Move <code>className="note"</code> from the <code>&lt;div&gt;</code> in Note.jsx onto the tag in App.jsx: <code>&lt;Note className="note" /&gt;</code>. The card loses its styling, because anything written on your own component\'s tag is handed to it as a prop, not put on the HTML. Move it back.',
    'In Footer.jsx, swap <code>&lt;footer&gt;</code> for <code>&lt;div&gt;</code>. The line jumps to the top and turns black, since <code>footer</code> and <code>footer p</code> no longer match anything. Swap it back.',
    'Put the year straight into the JSX, <code>{new Date().getFullYear()}</code>, then return it to the const. Both render the same thing.',
    'Add a second <code>&lt;Note /&gt;</code> in App: two identical cards. Giving each its own title and text is what props (next lecture) are for.',
    'Rename the app in Header and restyle something in styles.css, for example the header colour <code>#f5ba13</code>.'
  ],
  files:Object.assign({}, KEEPER_SOLUTION, { 'styles.css':KEEPER_CSS }),
  solution:KEEPER_SOLUTION,
  quiz:[
    { q:'Why does <code>&lt;Note className="note" /&gt;</code> leave the card unstyled?', options:['className is misspelled','On your own component it is just a prop called className; only HTML elements turn it into a class','The CSS loads too late','Note should be lowercase'], answer:1, why:'React passes attributes on a component tag to the component as props. Unless Note puts it on an element, nothing reaches the DOM.' },
    { q:'Footer returns <code>&lt;div&gt;&lt;p&gt;…&lt;/p&gt;&lt;/div&gt;</code> and loses its styling. Why?', options:['A div is not allowed in a component','The selectors are footer and footer p, which only match a footer element','The p needs className="footer"','React strips styles from divs'], answer:1, why:'Element selectors match tag names. Change the tag and the rule no longer applies.' },
    { q:'Inside a return, how does React tell <code>&lt;header&gt;</code> from <code>&lt;Header /&gt;</code>?', options:['By the file name','By the capital letter: lowercase is an HTML element, capitalised is a component','By the closing slash','It cannot, so never use both'], answer:1, why:'Lowercase tags compile to a string (an HTML element) and capitalised tags to a reference to your function.' },
  ],
});


/* ---------- 294–299: props, DevTools, mapping data, array methods ---------- */

const hardContact = p => `    <h2>${p.name}</h2>
    <img src="${pic(p.seed)}" alt="avatar" />
    <p>${p.phone}</p>
    <p>${p.email}</p>`;

const propsCard = p => `    <Card
      name="${p.name}"
      img="${pic(p.seed)}"
      tel="${p.phone}"
      email="${p.email}"
    />`;

PG.add({
  id:'l294', index:294, udemyId:17039094, minutes:17, section:'s36', slug:'react-props', kind:'react',
  title:'React Props',
  blurb:'Repeated markup should become a component, but a component with fixed content shows the same thing every time. <b>Props</b> fix that: the attributes you write on a component tag, such as <code>&lt;Card name="Ada" /&gt;</code>, arrive in the component as a single object, <code>function Card(props)</code>, read as <code>{props.name}</code>. Unlike HTML attributes, which come from a fixed list, prop names are whatever you choose.',
  tasks:[
    'Above the render call, write <code>function Card()</code> that returns Ada\'s four elements inside one <code>&lt;div&gt;</code>, and render <code>&lt;Card /&gt;</code> three times: three identical Adas. A component with fixed content cannot be reused yet.',
    'Give Card a <code>props</code> parameter, show <code>{props.name}</code> in its <code>&lt;h2&gt;</code>, and pass a different <code>name="…"</code> on each <code>&lt;Card /&gt;</code>. Add <code>console.log(props)</code> inside Card to see the object React hands in.',
    'Do the same for the picture, phone and email: <code>src={props.img}</code>, <code>{props.tel}</code> and <code>{props.email}</code>, with matching <code>img</code>, <code>tel</code> and <code>email</code> props on every Card. Then delete the old hard-coded markup.',
    'Compare with plain HTML. <code>index.html</code> has an ordinary <code>&lt;input id="fName"&gt;</code> outside the root div: change its <code>placeholder</code> and <code>value</code>. Then right-click the preview, choose Inspect, pick the preview frame in the console and run <code>document.getElementById("fName").placeholder</code>.',
    'Write <code>className="my-style"</code> on one <code>&lt;Card /&gt;</code>: nothing turns red, because on a component it is just another prop. Make Card use it, <code>&lt;div className={props.className}&gt;</code>, and that card turns red.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

// TODO 1: function Card(props) { ... } returning ONE contact inside a <div>.
//         Start by pasting Ada's markup in, then swap each detail for
//         props.name, props.img, props.tel and props.email.

ReactDOM.render(
  <div>
    <h1>My Contacts</h1>

    {/* TODO 2: replace each block below with <Card ... /> and pass its details as props */}
${PEOPLE.map(hardContact).join('\n\n')}
  </div>,
  document.getElementById("root")
);
`,
'index.html':`<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css" />
    <title>My Contacts</title>
  </head>
  <body>
    <!-- An ordinary HTML element, outside the React root -->
    <input id="fName" type="text" placeholder="First name" value="Ada" />
    <div id="root"></div>
    <script src="index.jsx"><\/script>
  </body>
</html>
`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 0 20px;
}

input {
  margin-top: 16px;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.my-style {
  color: red;
}
`},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";

function Card(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <img src={props.img} alt="avatar" />
      <p>{props.tel}</p>
      <p>{props.email}</p>
    </div>
  );
}

ReactDOM.render(
  <div>
    <h1>My Contacts</h1>
${PEOPLE.map(propsCard).join('\n')}
  </div>,
  document.getElementById("root")
);
`},
  explore:[{
    title:'Attributes in, one props object out', height:470,
    note:'Change the values. The left shows the JSX you would write and the single object React passes to <code>Card</code>; the right shows what Card returns. Tick the bug box: Card reads a prop name that was never passed, the picture goes blank, and nothing warns you.',
    html:`
<style>
  .card{border:1px solid #dfe3ee;border-radius:10px;padding:10px 14px;background:#fff}
  .card h2{margin:0 0 6px}
  .card img{width:100px;height:100px;border-radius:50%;background:#eef1f9}
  .card p{margin:6px 0}
</style>
<div class="knobs">
  <label>name <input id="name" type="text" value="Ada Moss" style="width:105px"></label>
  <label>img seed <input id="seed" type="text" value="ada" style="width:70px"></label>
  <label>tel <input id="tel" type="text" value="+44 7700 900111" style="width:125px"></label>
  <label>email <input id="email" type="text" value="ada@example.com" style="width:135px"></label>
  <label><input type="checkbox" id="wrong"> bug: Card reads props.imgURL</label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px">
    <h4>You write</h4><pre class="readout" id="jsx"></pre>
    <h4>React calls Card with one object</h4><pre class="readout" id="seen" style="white-space:pre-wrap"></pre>
  </div>
  <div style="flex:0 0 220px"><h4>Card returns</h4><div id="view"></div></div>
</div>
${REACT_SCRIPTS}
<script>
  var h = React.createElement, seen = null, wrong = false;
  function Card(props) {
    seen = props;
    return h('div', { className: 'card' },
      h('h2', null, props.name),
      h('img', { src: wrong ? props.imgURL : props.img, alt: 'avatar' }),
      h('p', null, props.tel),
      h('p', null, props.email));
  }
  var root = ReactDOM.createRoot(document.getElementById('view'));
  function val(id) { return document.getElementById(id).value; }
  function upd() {
    wrong = document.getElementById('wrong').checked;
    var p = { name: val('name'), img: 'https://picsum.photos/seed/' + encodeURIComponent(val('seed') || 'x') + '/200/200', tel: val('tel'), email: val('email') };
    ReactDOM.flushSync(function () { root.render(h(Card, p)); });
    document.getElementById('jsx').textContent = '<Card\\n  name="' + p.name + '"\\n  img="' + p.img + '"\\n  tel="' + p.tel + '"\\n  email="' + p.email + '"\\n/>';
    document.getElementById('seen').textContent = 'function Card(props)\\n\\nprops = ' + JSON.stringify(seen, null, 2) +
      (wrong ? '\\n\\nCard reads props.imgURL, but the object has no imgURL key, so src is undefined and the picture is blank. No error, no warning.'
             : '\\n\\nInside Card, props.name is ' + JSON.stringify(seen.name) + '.');
  }
  document.querySelectorAll('input').forEach(function (el) { el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`,
  }],
  quiz:[
    { q:'For <code>&lt;Card name="Ada" tel="123" /&gt;</code>, what does React pass to <code>function Card(props)</code>?', options:['Two arguments, "Ada" and "123"','One object: { name: "Ada", tel: "123" }','An array: ["Ada", "123"]','Nothing; props have to be fetched'], answer:1, why:'Every attribute on the tag becomes a key in one object, which React passes as the component\'s first argument.' },
    { q:'Card reads <code>props.img</code> but the tag says <code>imgURL="…"</code>. What happens?', options:['React renames it for you','props.img is undefined, so the image has no src, and there is no error','The app crashes','React warns and uses imgURL'], answer:1, why:'Reading a key the object does not have just gives undefined. The names on the tag and inside the component have to match.' },
    { q:'Which statement about props and HTML attributes is true?', options:['Props must come from a fixed list','HTML attributes come from a fixed list; props are whatever names your component reads','Props only accept strings','className on a component always styles it'], answer:1, why:'Browsers only understand the attributes in the HTML spec. Props are your own inputs, and they do nothing until the component uses them.' },
  ],
});

PG.add({
  id:'l295', index:295, udemyId:17039100, minutes:13, section:'s36', slug:'react-props-practice', kind:'react',
  title:'React Props Practice',
  blurb:'Four steps from one hard-coded contact card to a list driven by data: attach the classes from the supplied stylesheet, move the card into a reusable <code>Card</code> component, turn its details into props, then fill three cards from the array in <code>contacts.js</code>.',
  tasks:[
    'Style the card: read <code>styles.css</code> and add <code>className</code>s in App.jsx: <code>name</code> on the <code>&lt;h2&gt;</code>, <code>circle-img</code> on the <code>&lt;img&gt;</code>, and <code>info</code> on both <code>&lt;p&gt;</code>s.',
    'Move the whole <code>&lt;div className="card"&gt;</code> into a <code>Card</code> component in <code>components/Card.jsx</code>, export it, import it in App and render <code>&lt;Card /&gt;</code> where the markup was.',
    'Replace the four details inside Card with <code>{props.name}</code>, <code>src={props.img}</code>, <code>{props.tel}</code> and <code>{props.email}</code>, and pass those props from App.',
    'In <code>contacts.js</code> add <code>export default contacts;</code>. In App, <code>import contacts from "../contacts";</code> (one folder up from components) and make three Cards from <code>contacts[0]</code>, <code>contacts[1]</code> and <code>contacts[2]</code>.',
    'Add a fourth contact to contacts.js. It only shows once you write a fourth Card by hand: that repetition is what <code>map</code> removes two lectures from now.'
  ],
  files:{
'components/App.jsx':`import React from "react";
// TODO 2: import Card from "./Card"
// TODO 4: import contacts from "../contacts"

// 1. Add classes from styles.css so the card matches the finished design:
//    "name" on the h2, "circle-img" on the img, "info" on both p elements.
// 2. Move the card (the div with className="card") into a Card component in Card.jsx.
// 3. Turn the details into props, so one Card component can show any contact.
// 4. Export the array in contacts.js and use it to fill three Cards.

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      <div className="card">
        <div className="top">
          <h2>Ada Moss</h2>
          <img src="${pic('ada')}" alt="avatar_img" />
        </div>
        <div className="bottom">
          <p>+44 7700 900111</p>
          <p>ada@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;
`,
'components/Card.jsx':`import React from "react";

// TODO 2: function Card(props) { return ( ...the card markup... ); }
//         then export it as the default export

`,
'contacts.js':contactsFile(PEOPLE, false, false),
'styles.css':CARD_CSS,
'index.jsx':ENTRY},
  solution:{
'components/App.jsx':`import React from "react";
import Card from "./Card";
import contacts from "../contacts";

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
${HAND_CARDS}
    </div>
  );
}

export default App;
`,
'components/Card.jsx':`import React from "react";

function Card(props) {
  return (
    <div className="card">
      <div className="top">
        <h2 className="name">{props.name}</h2>
        <img className="circle-img" src={props.img} alt="avatar_img" />
      </div>
      <div className="bottom">
        <p className="info">{props.tel}</p>
        <p className="info">{props.email}</p>
      </div>
    </div>
  );
}

export default Card;
`,
'contacts.js':contactsFile(PEOPLE, false, true)},
  quiz:[
    { q:'App.jsx is in <code>components/</code> and contacts.js is one level up. Which import path is right?', options:['"./contacts"','"../contacts"','"/components/contacts"','"contacts"'], answer:1, why:'../ steps up out of the components folder to where contacts.js lives. ./ would look inside components.' },
    { q:'After the refactor, where does the person-specific data live?', options:['Inside Card.jsx','In contacts.js, handed to Card through props by App','In styles.css','In index.jsx'], answer:1, why:'Card only holds structure and classes. The data comes from the array, and App passes each piece in as a prop.' },
    { q:'contacts.js ends with <code>export default contacts;</code>. Which import matches?', options:['import { contacts } from "../contacts"','import contacts from "../contacts"','import * from "../contacts"','require contacts from "../contacts"'], answer:1, why:'A default export is imported without braces; braces are for named exports.' },
  ],
});

const CARD_INLINE = `import React from "react";

function Card(props) {
  return (
    <div className="card">
      <div className="top">
        <h2 className="name">{props.name}</h2>
        <img className="circle-img" src={props.img} alt="avatar_img" />
      </div>
      <div className="bottom">
        <p className="info">{props.tel}</p>
        <p className="info">{props.email}</p>
      </div>
    </div>
  );
}

export default Card;
`;

PG.add({
  id:'l296', index:296, udemyId:17039112, minutes:17, section:'s36', slug:'react-devtools', kind:'react',
  title:'React DevTools',
  blurb:'Split the contact card into smaller pieces: an <code>Avatar</code> for the round picture and a <code>Detail</code> for each line of info. Data now travels down several levels (App → Card → Avatar), each level passing props to the next, and a mismatched prop name fails silently. <b>React Developer Tools</b> shows the component tree and the exact props each component received, which is how you find those bugs.',
  tasks:[
    'Create <code>Avatar</code> in <code>components/Avatar.jsx</code> and move the <code>&lt;img&gt;</code> out of Card into it. In Card, import Avatar and write <code>&lt;Avatar img={props.img} /&gt;</code>: the URL travels App → Card → Avatar, handed on once per level.',
    'Create <code>Detail</code> in <code>components/Detail.jsx</code>: a single <code>&lt;p className="info"&gt;</code> showing <code>{props.detailInfo}</code>. Replace both paragraphs in Card with <code>&lt;Detail detailInfo={props.tel} /&gt;</code> and <code>&lt;Detail detailInfo={props.email} /&gt;</code>.',
    'Break it on purpose: make Avatar read <code>props.imgURL</code>. The pictures vanish with no error. Open the Explore tab, tick the same bug there and click an Avatar in the tree to see the prop it really gets. Fix your code to match.',
    'Reuse Avatar on its own: in App, put <code>&lt;Avatar img="https://picsum.photos/seed/me/200/200" /&gt;</code> under the heading.',
    'Right-click the preview and choose Inspect. The browser\'s Elements panel shows divs, h2s and imgs, but no Card or Avatar: React DevTools adds that component layer. Install it from <a href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">react.dev/learn/react-developer-tools</a> for your own projects; the Explore tab has a small inspector that works here.'
  ],
  files:{
'components/Card.jsx':CARD_INLINE.replace(`import React from "react";
`, `import React from "react";
// TODO 1: import Avatar from "./Avatar" and use <Avatar img={props.img} /> instead of the img
// TODO 2: import Detail from "./Detail" and use it for both info paragraphs
`),
'components/Avatar.jsx':`import React from "react";

// TODO 1: an Avatar component that returns the <img className="circle-img" ... />,
//         taking its src from props.img. Export it as the default export.

`,
'components/Detail.jsx':`import React from "react";

// TODO 2: a Detail component that returns one <p className="info"> showing
//         props.detailInfo. Export it as the default export.

`,
'components/App.jsx':`import React from "react";
import Card from "./Card";
import contacts from "../contacts";
// TODO 4: import Avatar and show one under the heading

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
${HAND_CARDS}
    </div>
  );
}

export default App;
`,
'contacts.js':contactsFile(PEOPLE, false, true),
'styles.css':CARD_CSS,
'index.jsx':ENTRY},
  solution:{
'components/Card.jsx':cardSplit(''),
'components/Avatar.jsx':AVATAR,
'components/Detail.jsx':DETAIL,
'components/App.jsx':`import React from "react";
import Card from "./Card";
import Avatar from "./Avatar";
import contacts from "../contacts";

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      <Avatar img="${pic('me')}" />
${HAND_CARDS}
    </div>
  );
}

export default App;
`},
  notes:`<h3>Getting React Developer Tools</h3>
<p>It is a browser extension for Chrome, Firefox and Edge (links on <a href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">react.dev</a>). After installing, reload the page and open the browser's developer tools: two new tabs appear, <b>Components</b> and <b>Profiler</b>. The extension icon tells you which build a site uses (red/orange for a development build, blue for production, grey when there is no React). It works on your Vite projects, in CodeSandbox and on any React site, though production sites show minified component names.</p>`,
  explore:[{
    title:'A mini component inspector', height:560,
    note:'The finished contact app, with a small inspector in the spirit of React DevTools. Click a component in the tree to see its props and which component rendered it; hover to outline it on the page; click the page to jump to its component. Tick the bug box and inspect an Avatar to find the mismatched prop name.',
    html:`
<style>
  .cols{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start}
  .pv{flex:0 0 440px;max-width:100%;height:470px;overflow:auto;background:#dfe6e9;border:1px solid #dfe3ee;border-radius:10px}
  .dt{flex:1;min-width:250px}
  .treebox{background:#fff;border:1px solid #dfe3ee;border-radius:10px;padding:6px;font:12.5px ui-monospace,Menlo,monospace;max-height:250px;overflow:auto;margin-bottom:10px}
  .row{padding:2px 6px;border-radius:5px;cursor:pointer;white-space:nowrap}
  .row:hover{background:#eef3ff}
  .row.sel{background:#5b9cff;color:#fff}
  .row .host{color:#8a90a6}
  .row.sel .host{color:#dbe6ff}
  #app{font-family:sans-serif;margin:0 auto;padding:25px;width:400px;text-align:center;color:#000}
  #app .heading{text-align:center;font-size:2em;color:#2d3436;margin:20px 0 30px}
  #app .card{border-radius:25px;position:relative;padding:25px 15px;background-color:#81ecec;margin:50px 0;height:200px;box-shadow:0 2px 5px #ccc;text-align:left}
  #app .top{border-radius:25px 25px 0 0;height:100px;width:100%;background-color:#00cec9;position:absolute;top:0;left:0;display:flex}
  #app .name{font-size:2em;color:#2d3436;display:flex;flex:1;margin:10% 20px 0}
  #app .card img{margin:30px 20px 0 0}
  #app .circle-img{border-radius:50%;border:7px solid #fff;width:120px;height:120px}
  #app .bottom{margin-top:120px}
  #app .info{margin:20px 0;color:#1a7e76}
  .outline{outline:3px solid #ff6b6b !important;outline-offset:2px}
</style>
<div class="knobs">
  <label><input type="checkbox" id="hosts"> show HTML elements too</label>
  <label><input type="checkbox" id="broken"> bug: Avatar reads props.imgURL</label>
</div>
<div class="cols">
  <div class="pv"><div id="app"></div></div>
  <div class="dt">
    <div class="treebox" id="tree"></div>
    <pre class="readout" id="props" style="margin:0;white-space:pre-wrap"></pre>
  </div>
</div>
${REACT_SCRIPTS}
<script>
  var h = React.createElement, broken = false, showHosts = false;
  var contacts = ${JSON.stringify(PEOPLE.map(p => ({ name: p.name, imgURL: pic(p.seed), phone: p.phone, email: p.email })))};
  function Avatar(props) { return h('img', { className: 'circle-img', src: broken ? props.imgURL : props.img, alt: 'avatar_img' }); }
  function Detail(props) { return h('p', { className: 'info' }, props.detailInfo); }
  function Card(props) {
    return h('div', { className: 'card' },
      h('div', { className: 'top' }, h('h2', { className: 'name' }, props.name), h(Avatar, { img: props.img })),
      h('div', { className: 'bottom' }, h(Detail, { detailInfo: props.tel }), h(Detail, { detailInfo: props.email })));
  }
  function cardFor(c) { return h(Card, { name: c.name, img: c.imgURL, tel: c.phone, email: c.email }); }
  function App() {
    return h('div', null,
      h('h1', { className: 'heading' }, 'My Contacts'),
      h(Avatar, { img: '${pic('me')}' }),
      cardFor(contacts[0]), cardFor(contacts[1]), cardFor(contacts[2]));
  }
  var root = ReactDOM.createRoot(document.getElementById('app'));
  var tree = document.getElementById('tree'), propsBox = document.getElementById('props');
  var rows = [], selKey = 'Avatar#2', lit = null;

  function walk(f, depth, seen) {
    while (f) {
      var comp = typeof f.type === 'function', host = typeof f.type === 'string';
      var show = comp || (host && showHosts);
      if (show) {
        var name = comp ? f.type.name : f.type;
        seen[name] = (seen[name] || 0) + 1;
        rows.push({ f: f, depth: depth, name: name, comp: comp, key: name + '#' + seen[name] });
      }
      walk(f.child, show ? depth + 1 : depth, seen);
      f = f.sibling;
    }
  }
  function domOf(f) { while (f && typeof f.type !== 'string') f = f.child; return f ? f.stateNode : null; }
  function render() {
    ReactDOM.flushSync(function () { root.render(h(App)); });
    rows = [];
    walk(root._internalRoot.current.child, 0, {});
    tree.innerHTML = rows.map(function (r, k) {
      var label = '&lt;' + r.name + '&gt;';
      return '<div class="row' + (r.key === selKey ? ' sel' : '') + '" data-i="' + k + '" style="padding-left:' + (6 + r.depth * 14) + 'px">' +
        (r.comp ? label : '<span class="host">' + label + '</span>') + '</div>';
    }).join('');
    showProps();
  }
  function showProps() {
    var r = rows.filter(function (x) { return x.key === selKey; })[0];
    if (!r) { propsBox.textContent = 'Click a component in the tree to see its props.'; return; }
    var p = r.f.memoizedProps || {}, lines = [];
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (k === 'children') { if (typeof v === 'string' || typeof v === 'number') lines.push('  children: ' + JSON.stringify(v)); return; }
      lines.push('  ' + k + ': ' + JSON.stringify(v));
    });
    var owner = r.f._debugOwner;
    var text = '<' + r.name + '>' + (r.comp ? '' : '   (an HTML element)') + '\\n\\nprops\\n' + (lines.length ? lines.join('\\n') : '  (none)');
    if (owner && typeof owner.type === 'function') text += '\\n\\nrendered by <' + owner.type.name + '>';
    if (broken && r.name === 'Avatar') text += '\\n\\nThe bug: Avatar reads props.imgURL, but the prop it receives is called img.';
    propsBox.textContent = text;
  }
  function rowOf(e) { var el = e.target.closest && e.target.closest('.row'); return el ? rows[+el.getAttribute('data-i')] : null; }
  tree.addEventListener('click', function (e) { var r = rowOf(e); if (r) { selKey = r.key; render(); } });
  tree.addEventListener('mouseover', function (e) {
    var r = rowOf(e); if (!r) return;
    if (lit) lit.classList.remove('outline');
    lit = domOf(r.f);
    if (lit) { lit.classList.add('outline'); lit.scrollIntoView({ block: 'nearest' }); }
  });
  tree.addEventListener('mouseleave', function () { if (lit) lit.classList.remove('outline'); lit = null; });
  document.getElementById('app').addEventListener('click', function (e) {
    var k = Object.keys(e.target).filter(function (n) { return n.indexOf('__reactFiber$') === 0; })[0];
    if (!k) return;
    var f = e.target[k];
    while (f && typeof f.type !== 'function') f = f.return;
    var r = rows.filter(function (x) { return f && (x.f === f || x.f === f.alternate); })[0];
    if (r) { selKey = r.key; render(); }
  });
  document.getElementById('hosts').onchange = function (e) { showHosts = e.target.checked; render(); };
  document.getElementById('broken').onchange = function (e) { broken = e.target.checked; render(); };
  render();
<\/script>`,
  }],
  quiz:[
    { q:'App passes <code>img</code> to Card, and Card renders <code>&lt;Avatar /&gt;</code> with no props. What does Avatar receive?', options:['The same props as Card','Nothing: each component only gets what its direct parent passes it','The img from App, automatically','Whatever is in contacts.js'], answer:1, why:'Props flow one level at a time. Card has to hand the value on: &lt;Avatar img={props.img} /&gt;.' },
    { q:'A Detail renders an empty paragraph and the console is clean. What is the quickest way to find out why?', options:['Reinstall React','Inspect the Detail component in React DevTools and compare the prop names it received with the one it reads','Add more CSS','Rename the file'], answer:1, why:'A mismatched prop name gives undefined without any error. DevTools shows the props exactly as they arrived.' },
    { q:'What does React DevTools add that the normal Elements panel does not show?', options:['The CSS of each element','The component tree, with each component\'s props','Network requests','The page\'s HTML'], answer:1, why:'The Elements panel shows the final DOM. Component names and props only exist inside React, and DevTools reads them from there.' },
  ],
});

PG.add({
  id:'l297', index:297, udemyId:17039130, minutes:10, section:'s36', slug:'mapping-data-to-components', kind:'react',
  title:'Mapping Data to Components',
  blurb:'Writing one <code>&lt;Card&gt;</code> per array item by hand only works for a fixed list. <code>contacts.map(createCard)</code> calls a function once per contact and collects the returned Cards into a new array, which React renders in order, so the page follows the data. Items made in a loop need a unique <code>key</code> prop so React can tell them apart, and React keeps <code>key</code> for itself: it never shows up in props.',
  tasks:[
    'In App.jsx, write <code>function createCard(contact)</code> above App. It receives one contact object and returns a <code>&lt;Card /&gt;</code> with <code>name={contact.name}</code>, <code>img={contact.imgURL}</code>, <code>tel={contact.phone}</code> and <code>email={contact.email}</code>.',
    'Replace the three hand-written Cards with <code>{contacts.map(createCard)}</code>: braces because it is JavaScript, and no brackets after createCard because map calls it for you.',
    'Read the console warning about a unique "key", then add <code>key={contact.id}</code> to the Card in createCard. The warning goes.',
    'Show each card\'s number: put <code>&lt;p&gt;{props.key}&lt;/p&gt;</code> above the name in Card.jsx. It stays empty and React warns that key is not a prop. Pass the value a second time as <code>id={contact.id}</code> and show <code>{props.id}</code> instead.',
    'Add a fourth contact (with <code>id: 4</code>) to contacts.js. A new card appears without touching any JSX. The Explore tab shows what goes wrong without good keys.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import Card from "./Card";
import contacts from "../contacts";

// TODO 1: function createCard(contact) { return <Card ... />; }
//         one contact object in, one Card element out

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      {/* TODO 2: replace these three Cards with {contacts.map(createCard)} */}
${HAND_CARDS}
    </div>
  );
}

export default App;
`,
'components/Card.jsx':cardSplit('        {/* TODO 4: show this card\'s number in a <p> here */}\n'),
'contacts.js':contactsFile(PEOPLE, true, true),
'components/Avatar.jsx':AVATAR,
'components/Detail.jsx':DETAIL,
'styles.css':CARD_CSS,
'index.jsx':ENTRY},
  solution:{
'components/App.jsx':`import React from "react";
import Card from "./Card";
import contacts from "../contacts";

function createCard(contact) {
  return (
    <Card
      key={contact.id}
      id={contact.id}
      name={contact.name}
      img={contact.imgURL}
      tel={contact.phone}
      email={contact.email}
    />
  );
}

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      {contacts.map(createCard)}
    </div>
  );
}

export default App;
`,
'components/Card.jsx':cardSplit('        <p>{props.id}</p>\n'),
'contacts.js':contactsFile(PEOPLE.concat([EXTRA_PERSON]), true, true)},
  explore:[{
    title:'Why keys must belong to the item', height:470,
    note:'Each row shows a name from the data and a notes box, an input React does not control. React matches rows between renders by key: a row that keeps its key keeps its DOM node, notes included. Add a contact or shuffle with <b>contact.id</b> keys, then switch to <b>array index</b> keys and do it again.',
    html:`
<style>
  .row{display:flex;gap:10px;align-items:center;padding:7px 4px;border-bottom:1px solid #eef1f9}
  .row .k{font:11.5px ui-monospace,Menlo,monospace;color:#5b6382;width:56px}
  .row b{width:100px}
  .row input{flex:1;font:inherit;padding:4px 8px;border:1px solid #cfd5e6;border-radius:6px}
</style>
<div class="knobs">
  <label>key = <select id="mode"><option value="id">contact.id</option><option value="index">the array index</option></select></label>
  <button id="top">Add a contact at the top</button>
  <button id="shuffle">Shuffle</button>
  <button id="reset">Start again</button>
</div>
<div class="stage" id="view"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
${REACT_SCRIPTS}
<script>
  var h = React.createElement;
  var START = [{ id: 1, name: 'Ada Moss' }, { id: 2, name: 'Kai Park' }, { id: 3, name: 'Lena Ruiz' }];
  var MORE = [{ id: 4, name: 'Omar Diaz' }, { id: 5, name: 'Zoe Chen' }, { id: 6, name: 'Ivan Petrov' }, { id: 7, name: 'Mia Novak' }];
  var list, more, mode = 'id';
  var root = ReactDOM.createRoot(document.getElementById('view'));
  function Row(props) {
    return h('div', { className: 'row' },
      h('span', { className: 'k' }, 'key=' + props.k),
      h('b', null, props.name),
      h('input', { defaultValue: 'notes on ' + props.name.split(' ')[0] }));
  }
  function render(msg) {
    var rows = list.map(function (c, i) { var k = mode === 'id' ? c.id : i; return h(Row, { key: k, k: k, name: c.name }); });
    ReactDOM.flushSync(function () { root.render(h('div', null, rows)); });
    document.getElementById('ro').textContent = msg;
  }
  function start(msg) {
    list = START.slice(); more = MORE.slice();
    render(msg || 'Each notes box starts out matching its name. Type in one if you like, then add a contact or shuffle.');
  }
  document.getElementById('mode').onchange = function (e) {
    mode = e.target.value;
    start('Keys are now ' + (mode === 'id' ? 'contact.id' : 'the array index') + '. Every key changed, so React rebuilt each row from scratch. Now add a contact or shuffle.');
  };
  document.getElementById('top').onclick = function () {
    if (!more.length) return;
    list.unshift(more.shift());
    render(mode === 'id'
      ? 'The new contact brought a new key, so React created one new row and kept all the others, notes and all. Every note still sits beside the right name.'
      : 'The new contact took key 0, which used to be ' + list[1].name + '. React reused the DOM row for key 0 and only swapped the name, so every notes box stayed where it was: the notes no longer match the names, and the row React actually added is the last one.');
  };
  document.getElementById('shuffle').onclick = function () {
    for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = list[i]; list[i] = list[j]; list[j] = t; }
    render(mode === 'id'
      ? 'Shuffled. React matched the rows by id and moved the existing DOM rows, so each notes box travelled with its name.'
      : 'Shuffled. The keys are still 0, 1, 2, so React thinks nothing moved: it rewrote the names in place and left the notes boxes behind.');
  };
  document.getElementById('reset').onclick = function () { start(); };
  start();
<\/script>`,
  }],
  quiz:[
    { q:'What does <code>contacts.map(createCard)</code> give React?', options:['Only the first Card','A new array holding one Card element per contact, which React renders in order','The contacts array, changed in place','undefined'], answer:1, why:'map builds a new array from the return values of the callback, and React can render an array of elements directly.' },
    { q:'Why write <code>map(createCard)</code> rather than <code>map(createCard())</code>?', options:['Style only','map needs the function itself so it can call it once per item; createCard() would run once, with no contact, before map even starts','Brackets are not allowed in JSX','createCard() is faster'], answer:1, why:'Passing the function hands map the job of calling it. Adding brackets calls it yourself and passes its single result instead.' },
    { q:'Inside Card, what is <code>props.key</code>?', options:['The contact\'s id','Always undefined: React uses key itself and does not pass it on','The array index','A random number'], answer:1, why:'key is reserved for React\'s bookkeeping. If the component needs the value, pass it again under another name, such as id.' },
    { q:'Which value makes the best key?', options:['Math.random()','A stable, unique id that belongs to the item','The same text for every item','The component\'s name'], answer:1, why:'Keys must be unique among siblings and stay the same between renders, so React can match each item with its earlier self.' },
  ],
});

const EMOJI_TERM = e => `        <div className="term">
          <dt>
            <span className="emoji" role="img" aria-label="${e.name}">
              ${e.emoji}
            </span>
            <span>${e.name}</span>
          </dt>
          <dd>
            ${e.meaning}
          </dd>
        </div>`;

PG.add({
  id:'l298', index:298, udemyId:17039144, minutes:18, section:'s36', slug:'mapping-data-to-components-practice', kind:'react',
  title:'Mapping Data to Components Practice',
  blurb:'Practice project: an <b>emojipedia</b> of cards. The dictionary is three near-identical blocks of hard-coded JSX. Turn one block into an <code>Entry</code> component, feed it props, and render one Entry per object in <code>emojipedia.js</code> with <code>map</code>, so adding an object adds a card. Plan the steps before you start; there are no step comments this time.',
  tasks:[
    'Write your own plan first. One way to split it: extract a component, add props, import the data, map over it.',
    'Create <code>Entry</code> in <code>components/Entry.jsx</code>: cut one <code>&lt;div className="term"&gt;</code> out of App and return it. Delete the other two blocks, keep the <code>&lt;dl&gt;</code> in App, and put <code>&lt;Entry /&gt;</code> inside it three times.',
    'Swap the fixed emoji, name and meaning in Entry for <code>{props.emoji}</code>, <code>{props.name}</code> and <code>{props.description}</code> (and set <code>aria-label={props.name}</code>). Test by passing values to the first Entry only.',
    'Add <code>export default emojipedia;</code> to <code>emojipedia.js</code> and import it in App from <code>"../emojipedia"</code>.',
    'Write <code>createEntry(emojiTerm)</code> that returns an Entry with <code>key={emojiTerm.id}</code> and <code>description={emojiTerm.meaning}</code>, and render <code>{emojipedia.map(createEntry)}</code> inside the <code>&lt;dl&gt;</code>.',
    'Add an emoji of your own to the array, with the next id, and watch its card appear.'
  ],
  files:{
'components/App.jsx':`import React from "react";

// Challenge: render this dictionary from emojipedia.js, using an Entry
// component and map(). Write your own plan of steps before you start.

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>

      <dl className="dictionary">
${EMOJIS.map(EMOJI_TERM).join('\n')}
      </dl>
    </div>
  );
}

export default App;
`,
'components/Entry.jsx':`import React from "react";

// TODO: an Entry component that returns ONE <div className="term">,
//       with the emoji, name and description coming from props

`,
'emojipedia.js':emojiFile(EMOJIS, false),
'styles.css':EMOJI_CSS,
'index.jsx':ENTRY},
  solution:{
'components/App.jsx':`import React from "react";
import Entry from "./Entry";
import emojipedia from "../emojipedia";

function createEntry(emojiTerm) {
  return (
    <Entry
      key={emojiTerm.id}
      emoji={emojiTerm.emoji}
      name={emojiTerm.name}
      description={emojiTerm.meaning}
    />
  );
}

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">{emojipedia.map(createEntry)}</dl>
    </div>
  );
}

export default App;
`,
'components/Entry.jsx':`import React from "react";

function Entry(props) {
  return (
    <div className="term">
      <dt>
        <span className="emoji" role="img" aria-label={props.name}>
          {props.emoji}
        </span>
        <span>{props.name}</span>
      </dt>
      <dd>{props.description}</dd>
    </div>
  );
}

export default Entry;
`,
'emojipedia.js':emojiFile(EMOJIS.concat([EXTRA_EMOJI]), true)},
  notes:`<h3>Description lists</h3>
<p>A <code>&lt;dl&gt;</code> holds pairs of a term (<code>&lt;dt&gt;</code>) and its description (<code>&lt;dd&gt;</code>), the way a glossary does. A <code>&lt;div&gt;</code> may wrap each pair, which is how every term becomes a card here. Keep the single <code>&lt;dl&gt;</code> in App: putting one inside Entry would make a separate list per card. More on <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl" target="_blank" rel="noopener">MDN: the dl element</a>.</p>`,
  quiz:[
    { q:'Inside a <code>&lt;dl&gt;</code>, what do <code>&lt;dt&gt;</code> and <code>&lt;dd&gt;</code> hold?', options:['A table row and a cell','A term and its description','Two kinds of bullet point','A title and a footer'], answer:1, why:'dl is a description list: dt names the term, dd describes it.' },
    { q:'Entry reads <code>props.description</code>, but the field in the data is called <code>meaning</code>. Where do the two names meet?', options:['They must be identical or React throws','In createEntry: description={emojiTerm.meaning}','In styles.css','React matches them by itself'], answer:1, why:'The callback is the bridge: it reads fields from the data and passes them under whatever prop names the component expects.' },
    { q:'Why use <code>map</code> instead of <code>forEach</code> to make the entries?', options:['forEach is slower','map returns a new array of Entry elements that JSX can render; forEach returns undefined','forEach cannot take a function','map sorts the data'], answer:1, why:'JSX needs a value to render. map produces the array of elements; forEach only runs code and gives nothing back.' },
  ],
});

PG.add({
  id:'l299', index:299, udemyId:17039152, minutes:20, section:'s36', slug:'es6-map-filter-reduce', kind:'react',
  title:'Javascript ES6 Map/Filter/Reduce',
  blurb:'Five array methods that each take a callback and save you a loop: <code>map</code> transforms every item into a new array, <code>filter</code> keeps the items that pass a test, <code>reduce</code> boils the array down to one value, <code>find</code> returns the first match and <code>findIndex</code> its position. None of them changes the original array. The page checks your answers against the same results worked out the long way, with <code>forEach</code>.',
  tasks:[
    'map: set <code>doubled</code> to <code>numbers.map(function (x) { return x * 2; })</code>. The table on the page ticks each correct answer; <code>components/Results.jsx</code> shows the <code>forEach</code> version each method replaces.',
    'filter: keep the numbers under 10 in <code>small</code> ([3, 2, 5]). Flip the test to <code>&gt; 10</code> to get [56, 48], then put it back.',
    'reduce: total the array in <code>total</code> with a callback that takes <code>(accumulator, currentNumber)</code> and returns their sum (114). Log both values inside the callback to watch the accumulator grow.',
    'find and findIndex: the first number above 10 (56) and where it sits (1). Try a test nothing passes, such as <code>&gt; 100</code>, to see <code>undefined</code> and <code>-1</code>, then put it back.',
    'The emoji challenge: <code>meaningsArray</code> should hold every emoji\'s <code>meaning</code> cut to its first 100 characters with <code>substring(0, 100)</code>. Remember to <code>return</code> the string from the callback.'
  ],
  files:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
import emojipedia from "./emojipedia";
import Results from "./components/Results";

var numbers = [3, 56, 2, 48, 5];

// map: a new array with every item transformed (same length as the original)
// TODO 1: double every number
const doubled = undefined;

// filter: a new array with only the items whose callback returns true
// TODO 2: keep the numbers smaller than 10
const small = undefined;

// reduce: boil the array down to a single value, carried along in an accumulator
// TODO 3: add all the numbers together
const total = undefined;

// find: the first item that passes the test
// TODO 4: the first number bigger than 10
const firstBig = undefined;

// findIndex: the position of the first item that passes the test
// TODO 4: where that number sits in the array
const firstBigIndex = undefined;

// TODO 5: an array holding each emoji's meaning, cut to its first 100 characters
const meaningsArray = undefined;
console.log(meaningsArray);

ReactDOM.render(
  <Results
    numbers={numbers}
    doubled={doubled}
    small={small}
    total={total}
    firstBig={firstBig}
    firstBigIndex={firstBigIndex}
    meaningsArray={meaningsArray}
  />,
  document.getElementById("root")
);
`,
'emojipedia.js':emojiFile(EMOJIS, true),
'components/Results.jsx':`import React from "react";
import emojipedia from "../emojipedia";

// Scaffolding: no need to edit this file.
// It works out the expected answers the long way, with forEach loops.
// That is exactly the code map, filter, reduce, find and findIndex save you from writing.
function expectedAnswers(numbers) {
  const doubled = [];
  const small = [];
  let total = 0;
  let firstBig;
  let firstBigIndex = -1;

  numbers.forEach(function (num, index) {
    doubled.push(num * 2);
    if (num < 10) {
      small.push(num);
    }
    total = total + num;
    if (firstBigIndex === -1 && num > 10) {
      firstBig = num;
      firstBigIndex = index;
    }
  });

  const meaningsArray = [];
  emojipedia.forEach(function (entry) {
    meaningsArray.push(entry.meaning.substring(0, 100));
  });

  return { doubled, small, total, firstBig, firstBigIndex, meaningsArray };
}

function show(value) {
  if (value === undefined) return "undefined";
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value.map(function (text) {
      return JSON.stringify(text) + "   (" + text.length + " characters)";
    }).join("\\n");
  }
  return JSON.stringify(value);
}

function Results(props) {
  const want = expectedAnswers(props.numbers);
  const rows = [
    ["map", "doubled", props.doubled, want.doubled],
    ["filter", "small", props.small, want.small],
    ["reduce", "total", props.total, want.total],
    ["find", "firstBig", props.firstBig, want.firstBig],
    ["findIndex", "firstBigIndex", props.firstBigIndex, want.firstBigIndex],
    ["map + substring", "meaningsArray", props.meaningsArray, want.meaningsArray]
  ];

  return (
    <div>
      <h1>Array methods</h1>
      <p className="numbers">numbers = {JSON.stringify(props.numbers)}</p>
      <table>
        <thead>
          <tr>
            <th>method</th>
            <th>your const</th>
            <th>its value</th>
            <th>check</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(function (row) {
            const answered = row[2] !== undefined;
            const correct = answered && JSON.stringify(row[2]) === JSON.stringify(row[3]);
            return (
              <tr key={row[1]} className={correct ? "ok" : answered ? "bad" : ""}>
                <td>{row[0]}</td>
                <td>
                  <code>{row[1]}</code>
                </td>
                <td>
                  <pre>{show(row[2])}</pre>
                </td>
                <td>{correct ? "✓" : answered ? "✗ expected " + show(row[3]) : "not done yet"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Results;
`,
'styles.css':`body {
  font-family: sans-serif;
  padding: 10px 20px;
  color: #2d3436;
}

h1 {
  font-size: 1.4em;
}

.numbers {
  font-family: monospace;
  font-size: 15px;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
}

th,
td {
  border-bottom: 1px solid #dfe6e9;
  padding: 6px 8px;
  text-align: left;
  vertical-align: top;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  font-size: 13px;
}

tr.ok td:last-child {
  color: #2b8a3e;
  font-weight: bold;
}

tr.bad td:last-child {
  color: #c92a2a;
}
`},
  solution:{
'index.jsx':`import React from "react";
import ReactDOM from "react-dom";
import emojipedia from "./emojipedia";
import Results from "./components/Results";

var numbers = [3, 56, 2, 48, 5];

// map
const doubled = numbers.map(function (x) {
  return x * 2;
});

// filter
const small = numbers.filter(function (num) {
  return num < 10;
});

// reduce
const total = numbers.reduce(function (accumulator, currentNumber) {
  console.log("accumulator:", accumulator, "currentNumber:", currentNumber);
  return accumulator + currentNumber;
});

// find
const firstBig = numbers.find(function (num) {
  return num > 10;
});

// findIndex
const firstBigIndex = numbers.findIndex(function (num) {
  return num > 10;
});

const meaningsArray = emojipedia.map(function (emojiEntry) {
  return emojiEntry.meaning.substring(0, 100);
});
console.log(meaningsArray);

ReactDOM.render(
  <Results
    numbers={numbers}
    doubled={doubled}
    small={small}
    total={total}
    firstBig={firstBig}
    firstBigIndex={firstBigIndex}
    meaningsArray={meaningsArray}
  />,
  document.getElementById("root")
);
`},
  explore:[{
    title:'Step through each method', height:560,
    note:'Pick a method and press <b>Step</b> to call the callback on one item at a time. Watch where each return value goes: into a new array (map), kept or dropped (filter), into the accumulator (reduce), or stopping the loop at the first match (find, findIndex). You can change the numbers too.',
    html:`
<style>
  .arr{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 12px}
  .cell{min-width:46px;padding:6px 10px;border:2px solid #cfd5e6;border-radius:8px;text-align:center;font:600 15px ui-monospace,Menlo,monospace;background:#fff}
  .cell small{display:block;font-size:10px;color:#8a90a6;font-weight:400}
  .cell.cur{border-color:#5b9cff;background:#eef3ff}
  .cell.done{opacity:.5}
  .cell.kept{border-color:#40c057;background:#ebfbee;opacity:1}
  .cell.dropped{text-decoration:line-through;opacity:.45}
  .cell.found{border-color:#f59f00;background:#fff4e6;opacity:1}
  .cell.skipped{opacity:.25}
  .accbox{display:inline-block;padding:8px 12px;border-radius:8px;background:#fff4e6;border:2px solid #f59f00;font:600 15px ui-monospace,Menlo,monospace}
</style>
<div class="knobs">
  <label>method <select id="m">
    <option value="map">map</option><option value="filter">filter</option><option value="reduce">reduce</option>
    <option value="find">find</option><option value="findIndex">findIndex</option>
  </select></label>
  <label>numbers <input id="nums" type="text" value="3, 56, 2, 48, 5" style="width:140px"></label>
  <button id="step">Step ▶</button>
  <button id="all">Run to the end</button>
  <button id="reset">Start again</button>
</div>
<pre class="readout" id="code"></pre>
<div class="stage">
  <h4>numbers</h4>
  <div class="arr" id="input"></div>
  <h4 id="outTitle">result</h4>
  <div id="output"></div>
</div>
<pre class="readout" id="log" style="white-space:pre-wrap"></pre>
<script>
  var CODE = {
    map: 'const doubled = numbers.map(function (x) {\\n  return x * 2;\\n});',
    filter: 'const small = numbers.filter(function (num) {\\n  return num < 10;\\n});',
    reduce: 'const total = numbers.reduce(function (accumulator, currentNumber) {\\n  return accumulator + currentNumber;\\n});',
    find: 'const firstBig = numbers.find(function (num) {\\n  return num > 10;\\n});',
    findIndex: 'const firstBigIndex = numbers.findIndex(function (num) {\\n  return num > 10;\\n});'
  };
  var nums, i, out, acc, done, found, result, marks, log, method;
  function parse() {
    return document.getElementById('nums').value.split(',').map(function (s) { return s.trim(); })
      .filter(function (s) { return s !== ''; }).map(Number).filter(function (n) { return !isNaN(n); });
  }
  function reset() {
    method = document.getElementById('m').value;
    nums = parse(); i = 0; out = []; acc = undefined; done = false; found = false; result = undefined; marks = []; log = [];
    if (method === 'reduce') {
      if (!nums.length) { done = true; log.push('reduce on an empty array with no starting value throws a TypeError.'); }
      else {
        acc = nums[0]; marks[0] = 'done'; i = 1;
        log.push('No starting value was given, so the accumulator starts as the first item (' + nums[0] + ') and the loop begins at the second item.');
        if (nums.length === 1) { done = true; result = acc; }
      }
    } else if (!nums.length) { done = true; finish(); }
    document.getElementById('code').textContent = 'var numbers = [' + nums.join(', ') + '];\\n\\n' + CODE[method];
    draw();
  }
  function finish() {
    if (method === 'map' || method === 'filter') result = out.slice();
    else if (method === 'reduce') result = acc;
    else if (!found) {
      result = method === 'find' ? undefined : -1;
      log.push('No item passed the test, so ' + method + ' returns ' + String(result) + '.');
    }
  }
  function step() {
    if (done) return;
    var x = nums[i];
    if (method === 'map') {
      out.push(x * 2); marks[i] = 'done';
      log.push('callback(' + x + ') returned ' + (x * 2) + ', which goes into the new array at position ' + i + '.');
    } else if (method === 'filter') {
      var keep = x < 10; if (keep) out.push(x); marks[i] = keep ? 'kept' : 'dropped';
      log.push(x + ' < 10 is ' + keep + (keep ? ', so it is kept.' : ', so it is left out.'));
    } else if (method === 'reduce') {
      var r = acc + x; marks[i] = 'done';
      log.push('callback(' + acc + ', ' + x + ') returned ' + r + ', which becomes the accumulator for the next item.');
      acc = r;
    } else {
      var hit = x > 10; marks[i] = hit ? 'found' : 'done';
      log.push(x + ' > 10 is ' + hit + (hit ? ': a match, so the loop stops here.' : ': keep looking.'));
      if (hit) {
        found = true; done = true; result = method === 'find' ? x : i;
        for (var j = i + 1; j < nums.length; j++) marks[j] = 'skipped';
      }
    }
    i++;
    if (!done && i >= nums.length) done = true;
    if (done) finish();
    draw();
  }
  function draw() {
    document.getElementById('input').innerHTML = nums.map(function (n, k) {
      return '<div class="cell ' + (marks[k] || '') + (k === i && !done ? ' cur' : '') + '"><small>[' + k + ']</small>' + n + '</div>';
    }).join('');
    var o = document.getElementById('output'), title = document.getElementById('outTitle');
    if (method === 'map' || method === 'filter') {
      title.textContent = method === 'map' ? 'new array (same length, every item doubled)' : 'new array (only the items that passed)';
      o.innerHTML = '<div class="arr">' + (out.length ? out.map(function (n) { return '<div class="cell kept">' + n + '</div>'; }).join('') : '<span class="note">[ ] still empty</span>') + '</div>';
    } else if (method === 'reduce') {
      title.textContent = 'accumulator';
      o.innerHTML = '<span class="accbox">' + (acc === undefined ? '(none)' : acc) + '</span>';
    } else {
      title.textContent = method === 'find' ? 'returned item' : 'returned index';
      o.innerHTML = '<span class="accbox">' + (done ? String(result) : '...') + '</span>';
    }
    var lines = log.slice();
    if (done) lines.push('Done. Result: ' + (Array.isArray(result) ? '[' + result.join(', ') + ']' : String(result)) + '. The original numbers array has not changed.');
    document.getElementById('log').textContent = lines.join('\\n') || 'Press Step to call the callback on the first item.';
  }
  document.getElementById('step').onclick = step;
  document.getElementById('all').onclick = function () { var guard = 0; while (!done && guard++ < 1000) step(); };
  document.getElementById('reset').onclick = reset;
  document.getElementById('m').onchange = reset;
  document.getElementById('nums').addEventListener('change', reset);
  reset();
<\/script>`,
  }],
  quiz:[
    { q:'Which method gives you only the even numbers from an array?', options:['map','filter','reduce','findIndex'], answer:1, why:'filter keeps the items whose callback returns true, here num % 2 === 0, and drops the rest.' },
    { q:'In <code>[3, 56, 2].reduce(function (acc, n) { return acc + n; })</code>, what is <code>acc</code> on the first call?', options:['0','3, the first item, because no starting value was given','undefined','56'], answer:1, why:'Without a second argument, reduce uses the first item as the starting accumulator and begins the loop at the second item.' },
    { q:'What does <code>find</code> return when nothing matches?', options:['-1','undefined','An empty array','false'], answer:1, why:'find returns undefined when no item passes; findIndex is the one that returns -1.' },
    { q:'Why does <code>emojipedia.map(function (e) { e.meaning.substring(0, 100); })</code> give <code>[undefined, undefined, undefined]</code>?', options:['substring is broken','The callback never returns anything, and a function without return gives undefined','map cannot read objects','The array is empty'], answer:1, why:'map collects whatever each call returns. Add return in front of e.meaning.substring(0, 100).' },
  ],
});


})();
