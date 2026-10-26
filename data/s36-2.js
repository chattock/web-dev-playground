/* ===== Section 36 — React.js (lectures 300–321) ===== */
/* Second data file for section 36: the engine loads it right after data/s36.js.
   Everything sits inside a function so the shared constants below stay out of
   the page's global scope. */
(function () {

/* ---------- shared starter pieces ---------- */

const INDEX_JSX = `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

createRoot(document.getElementById("root")).render(<App />);
`;

const CSS_EMOJI = `body {
  margin: 0;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #4a4f57;
  background: #d7e6e4;
}

h1 {
  margin: 2.5rem 0 0;
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
}

h1 span {
  padding: 4px 16px;
  color: #fff;
  background: #1fa391;
  border-radius: 4px;
}

.dictionary {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 960px;
  margin: 2.5rem auto;
  padding: 0 1rem;
}

.term {
  flex: 0 1 16rem;
  padding: 1.5rem;
  text-align: center;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

dt {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1fa391;
}

.emoji {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 3.5rem;
}

dd {
  margin: 0.75rem 0 0;
  font-size: 0.95rem;
}
`;

const CSS_FORM = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #fff;
  background: linear-gradient(160deg, #3f9c9a, #2f6f8f);
}

.container {
  max-width: 360px;
  margin: 0 auto;
  padding: 64px 16px;
  text-align: center;
}

.container h1 {
  margin: 0 0 24px;
  font-size: 2.2rem;
  font-weight: 300;
}

.container p {
  margin: -12px 0 20px;
  opacity: 0.85;
}

form {
  margin: 0;
}

input {
  display: block;
  width: 100%;
  margin: 0 0 10px;
  padding: 10px 14px;
  font: inherit;
  font-size: 1.05rem;
  text-align: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 4px;
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.75);
}

input:focus {
  background: rgba(255, 255, 255, 0.28);
}

button {
  width: 100%;
  padding: 10px 14px;
  font: inherit;
  font-size: 1.05rem;
  color: #3a9c9a;
  background: #fff;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

/* a quick look at state while you debug:
   <pre className="debug">{JSON.stringify(someState)}</pre> */
pre.debug {
  margin: 18px 0 0;
  padding: 8px 10px;
  font-size: 0.8rem;
  text-align: left;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
`;

const CSS_DARK = `body {
  margin: 0;
  min-height: 100vh;
  font-family: Menlo, Consolas, "Courier New", monospace;
  color: #fff;
  background: #2f3e46;
  text-align: center;
}

.container {
  padding: 60px 16px;
}

h1 {
  margin: 0 0 20px;
  font-size: 5rem;
  font-weight: 400;
}

button {
  min-width: 64px;
  margin: 6px;
  padding: 6px 16px;
  font: inherit;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  background: #52b788;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background: #40916c;
}
`;

const CSS_TABLE = `body {
  margin: 0;
  padding: 40px 16px;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #33343a;
  background: #f6f4ef;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

th,
td {
  padding: 10px 20px;
  text-align: left;
  border-bottom: 1px solid #ece8de;
}

th {
  font-weight: 600;
  color: #fff;
  background: #2d3047;
}

tbody tr:last-child td {
  border-bottom: 0;
}

td:first-child {
  font-weight: 600;
}
`;

const CSS_TODO = `body {
  margin: 0;
  min-height: 100vh;
  padding: 32px 16px;
  box-sizing: border-box;
  font-family: "Chalkboard SE", "Marker Felt", "Segoe Print", "Comic Sans MS", cursive;
  font-size: 1.1rem;
  color: #3d4246;
  background: #fde9b4;
}

.container {
  max-width: 440px;
  margin: 0 auto;
  padding: 18px 22px 26px;
  background-color: #f7f9fb;
  background-image: radial-gradient(#cdd3d8 1.5px, transparent 1.5px);
  background-size: 22px 22px;
  border-radius: 16px;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.12);
}

.heading {
  margin-bottom: 16px;
  text-align: center;
}

.heading h1 {
  display: inline-block;
  margin: 0;
  padding: 4px 18px;
  font-size: 1.5rem;
  background: #f9c74f;
  border-radius: 6px;
  transform: rotate(-2deg);
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.form input {
  flex: 1;
  min-width: 0;
  padding: 8px 4px;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
  border-bottom: 3px dashed #f9c74f;
  outline: none;
}

button {
  padding: 0;
  font: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

button span {
  display: block;
  padding: 6px 14px;
  background: #fff;
  border: 2px solid #3d4246;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #3d4246;
}

button:active span {
  transform: translate(2px, 2px);
  box-shadow: none;
}

ul {
  margin: 0;
  padding-left: 24px;
}

li {
  padding: 6px 0;
  text-align: left;
  cursor: pointer;
}
`;

/* Keeper: one look for parts 2, 3 and the styled version */
const KEEPER_RESET = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

`;

const KEEPER_BODY = `body {
  min-height: 100vh;
  padding: 0 16px 24px;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #3b3b3b;
  background-color: #f3f1ec;
}
`;

const KEEPER_MAIN = `
header {
  margin: 0 -16px;
  padding: 14px 28px;
  background: #f5ba13;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

header h1 {
  font-family: "Arial Rounded MT Bold", "Trebuchet MS", sans-serif;
  font-size: 1.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #fff;
}

/* each note is a pale yellow card; inline-block lets the cards sit in rows */
.note {
  display: inline-block;
  vertical-align: top;
  width: 240px;
  margin: 16px 16px 0 0;
  padding: 12px 14px 14px;
  background: #fff7c2;
  border-radius: 4px 4px 18px 4px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.14);
}

.note h1 {
  margin-bottom: 6px;
  font-size: 1.1rem;
}

.note p {
  font-size: 1rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

footer {
  margin-top: 32px;
  text-align: center;
  font-size: 0.85rem;
  color: #a9a59b;
}
`;

const KEEPER_DELETE = `
.note button {
  float: right;
  margin-top: 6px;
  padding: 2px 4px;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #b88600;
  background: none;
  border: none;
  cursor: pointer;
}
`;

const KEEPER_FORM = `
/* the create-note form: a white card in the middle of the page */
form {
  position: relative;
  width: 480px;
  max-width: 100%;
  margin: 30px auto 24px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

form input,
form textarea {
  display: block;
  width: 100%;
  padding: 4px;
  font: inherit;
  font-size: 1.1rem;
  border: none;
  outline: none;
  resize: none;
}

/* the round Add button hangs off the bottom-right corner of the form */
form button {
  position: absolute;
  right: 18px;
  bottom: -18px;
  width: 36px;
  height: 36px;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: #f5ba13;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
`;

const CSS_KEEPER = KEEPER_RESET + KEEPER_BODY + KEEPER_MAIN;
const CSS_KEEPER_3 = CSS_KEEPER + KEEPER_FORM + KEEPER_DELETE;

const KEEPER_HEADER_JSX = `import React from "react";

function Header() {
  return (
    <header>
      <h1>Keeper</h1>
    </header>
  );
}

export default Header;
`;

const KEEPER_FOOTER_JSX = `import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
`;

/* ---------- 300 ---------- */

PG.add({
  id:'l300', index:300, udemyId:17039196, minutes:10, section:'s36', slug:'arrow-functions', kind:'react',
  title:'Javascript ES6 Arrow functions',
  blurb:'An arrow function is a shorter way to write a function expression: drop the word <code>function</code> and put <code>=&gt;</code> after the parameters. With exactly one parameter the round brackets are optional, and when the body is a single expression the braces and <code>return</code> can go too. React code is full of them, mostly as <code>map</code> and <code>filter</code> callbacks.',
  tasks:[
    'In <code>arrays.js</code>, turn <code>square</code> into an arrow function stored in a const: first <code>const square = (x) =&gt; { return x * x; };</code>, then shrink it to <code>x =&gt; x * x</code>. The console must still say <code>square(4): 16</code>.',
    'Rewrite the <code>map</code>, <code>filter</code>, <code>find</code> and <code>findIndex</code> callbacks as one-line arrows: no <code>function</code>, no <code>return</code>, no braces, no brackets around the single parameter. Compare each console line with the comment next to it.',
    'Rewrite the <code>reduce</code> callback too. It takes two parameters, so its brackets have to stay: <code>(accumulator, currentNumber) =&gt; ...</code>.',
    'In <code>components/App.jsx</code>, move the body of <code>createEntry</code> into the map call as <code>emojipedia.map(emojiTerm =&gt; (&lt;Entry ... /&gt;))</code> and delete the named function. All three cards must still appear.',
    'Bonus: add <code>const wrap = id =&gt; ({ id: id });</code> to arrays.js and log <code>wrap(7)</code>. Then remove the round brackets around the object and see what comes back.'
  ],
  files:{
'arrays.js':`// Every callback below is written the long way.
// Rewrite each one as the shortest arrow function that still works,
// then check the console: the output must not change.

const numbers = [3, 56, 2, 48, 5];

// TODO 1: turn square into an arrow function stored in a const
function square(x) {
  return x * x;
}
console.log("square(4):", square(4)); // 16

// Map: a new array made by doing something to every item
const doubled = numbers.map(function (x) {
  return x * 2;
});
console.log("map:", doubled.join(", ")); // 6, 112, 4, 96, 10

// Filter: a new array of the items whose callback returns true
const small = numbers.filter(function (num) {
  return num < 10;
});
console.log("filter:", small.join(", ")); // 3, 2, 5

// Reduce: one value built up item by item
const total = numbers.reduce(function (accumulator, currentNumber) {
  return accumulator + currentNumber;
});
console.log("reduce:", total); // 114

// Find: the first item that matches
const firstBig = numbers.find(function (num) {
  return num > 10;
});
console.log("find:", firstBig); // 56

// FindIndex: the position of the first item that matches
const firstBigIndex = numbers.findIndex(function (num) {
  return num > 10;
});
console.log("findIndex:", firstBigIndex); // 1

// TODO 5 (bonus): const wrap = id => ({ id: id }); then log wrap(7)
`,
'components/App.jsx':`import React from "react";
import Entry from "./Entry";
import emojipedia from "../emojipedia";

// TODO 4: move this into the map call below as an arrow function,
//         then delete the named function
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
'emojipedia.js':`const emojipedia = [
  {
    id: 1,
    emoji: "🦥",
    name: "Sloth",
    meaning:
      "Taking it slow. Sent on lazy Sundays, when you have zero plans, or as an apology for answering a message three days late."
  },
  {
    id: 2,
    emoji: "🔥",
    name: "Fire",
    meaning:
      "Something is hot right now: a great outfit, a brilliant idea or a song stuck on repeat. Also used to cheer on a winning streak."
  },
  {
    id: 3,
    emoji: "🙈",
    name: "See-No-Evil Monkey",
    meaning:
      "A monkey covering its eyes. Sent after an embarrassing mistake, when something is too awkward to watch, or as a playful “I saw nothing”."
  }
];

export default emojipedia;
`,
'index.jsx':`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./arrays"; // runs the array demos; their output is in the console below

createRoot(document.getElementById("root")).render(<App />);
`,
'styles.css':CSS_EMOJI,
  },
  solution:{
'arrays.js':`const numbers = [3, 56, 2, 48, 5];

const square = x => x * x;
console.log("square(4):", square(4)); // 16

// Map
const doubled = numbers.map(x => x * 2);
console.log("map:", doubled.join(", ")); // 6, 112, 4, 96, 10

// Filter
const small = numbers.filter(num => num < 10);
console.log("filter:", small.join(", ")); // 3, 2, 5

// Reduce: two parameters, so the brackets stay
const total = numbers.reduce((accumulator, currentNumber) => accumulator + currentNumber);
console.log("reduce:", total); // 114

// Find
const firstBig = numbers.find(num => num > 10);
console.log("find:", firstBig); // 56

// FindIndex
const firstBigIndex = numbers.findIndex(num => num > 10);
console.log("findIndex:", firstBigIndex); // 1

// Returning an object: wrap it in ( ), or the braces are read as the function body
const wrap = id => ({ id: id });
console.log("wrap(7):", wrap(7)); // { id: 7 }
`,
'components/App.jsx':`import React from "react";
import Entry from "./Entry";
import emojipedia from "../emojipedia";

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">
        {emojipedia.map(emojiTerm => (
          <Entry
            key={emojiTerm.id}
            emoji={emojiTerm.emoji}
            name={emojiTerm.name}
            description={emojiTerm.meaning}
          />
        ))}
      </dl>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'Shrink a callback, one rule at a time', height:430,
    note:'Pick a version (or edit the code yourself) and the result appears straight away. Versions 1–4 shorten the same callback without changing its output; the ones marked as mistakes show what breaks when a rule is applied in the wrong place.',
    html:`
<div class="knobs">
  <label>version <select id="pick" style="max-width:460px"></select></label>
</div>
<div class="stage">
  <span class="tag">const numbers = [3, 56, 2, 48, 5];</span>
  <textarea id="code" spellcheck="false" style="display:block;width:100%;height:78px;margin-top:8px;font:13px/1.5 ui-monospace,Menlo,monospace;padding:8px 10px;border:1px solid #dfe3ee;border-radius:8px;resize:vertical"></textarea>
</div>
<pre class="readout" id="out"></pre>
<p class="note" id="why"></p>
<script>
  var V = [
    ['numbers.map(function (x) {\\n  return x * x;\\n})', 'The long form: an anonymous function passed straight to map.'],
    ['numbers.map((x) => {\\n  return x * x;\\n})', 'Rule 1: delete the word function and put => between the parameters and the body. Same result.'],
    ['numbers.map(x => {\\n  return x * x;\\n})', 'Rule 2: there is exactly one parameter, so its round brackets can go.'],
    ['numbers.map(x => x * x)', 'Rule 3: the body is a single expression, so the braces and return go too. The value is returned automatically.'],
    ['numbers.map(x => { x * x })', 'Mistake: the braces stayed but return went. A braced body only returns what you return, so every item becomes undefined.'],
    ['numbers.map(x = > x * x)', 'Mistake: => is one symbol. A space inside it is a syntax error.'],
    ['numbers.reduce((total, n) => total + n)', 'Two parameters: the brackets are required.'],
    ['numbers.reduce(total, n => total + n)', 'Mistake: without brackets, total is read as a separate argument to reduce, and no variable called total exists.'],
    ['numbers.map(n => ({ value: n }))', 'Returning an object: wrap it in round brackets.'],
    ['numbers.map(n => { value: n })', 'Mistake: without the round brackets the braces are a function body (value: is read as a label), so nothing is returned.']
  ];
  var pick = document.getElementById('pick'), code = document.getElementById('code'),
      out = document.getElementById('out'), why = document.getElementById('why');
  V.forEach(function (v, i) {
    var o = document.createElement('option');
    o.value = i;
    o.textContent = (i + 1) + '. ' + v[0].replace(/\\s+/g, ' ') + (/^Mistake/.test(v[1]) ? '   (mistake)' : '');
    pick.appendChild(o);
  });
  function show(v) {
    if (v === undefined) return 'undefined';
    if (typeof v === 'function') return 'a function';
    if (Array.isArray(v)) return '[' + v.map(show).join(', ') + ']';
    if (v && typeof v === 'object') return '{ ' + Object.keys(v).map(function (k) { return k + ': ' + show(v[k]); }).join(', ') + ' }';
    return JSON.stringify(v);
  }
  function run() {
    try {
      var fn = new Function('numbers', '"use strict"; return (' + code.value + ');');
      out.textContent = 'result: ' + show(fn([3, 56, 2, 48, 5]));
    } catch (e) {
      out.textContent = e.name + ': ' + e.message;
    }
  }
  pick.addEventListener('change', function () {
    code.value = V[pick.value][0];
    why.textContent = V[pick.value][1];
    run();
  });
  code.addEventListener('input', function () { why.textContent = ''; run(); });
  code.value = V[0][0]; why.textContent = V[0][1]; run();
<\/script>`,
  }],
  quiz:[
    { q:'Which of these is a working arrow function that adds two numbers?', options:['a, b =&gt; a + b','(a, b) =&gt; a + b','(a, b) = &gt; a + b','(a, b) -&gt; a + b'], answer:1, why:'Two parameters need round brackets, and the arrow is the single symbol =&gt; with no space inside.' },
    { q:'What does <code>numbers.map(x =&gt; { x * 2 })</code> give you?', options:['Every number doubled','An array of undefined','A syntax error','The original array'], answer:1, why:'Braces make a function body, and a body without return returns undefined for every item.' },
    { q:'Why is the object in <code>id =&gt; ({ id: id })</code> wrapped in round brackets?', options:['Objects always need brackets','Without them the braces would be read as the function body','It makes the function faster','Arrow functions cannot return objects otherwise'], answer:1, why:'A { straight after =&gt; starts a body. The brackets make it an expression, so the object is returned.' },
    { q:'In <code>emojipedia.map(emojiTerm =&gt; (&lt;Entry ... /&gt;))</code>, what are the round brackets after the arrow for?', options:['map requires them','They let the multi-line JSX be one returned expression','They turn Entry into a component','They add the key prop'], answer:1, why:'With an implicit return the body must be one expression; the brackets keep the JSX that spans several lines together.' },
  ],
});

/* ---------- 301 ---------- */

PG.add({
  id:'l301', index:301, udemyId:17039230, minutes:10, section:'s36', slug:'keeper-app-part-2', kind:'react', project:true,
  title:'Keeper App Project - Part 2',
  blurb:'Part 2 of Keeper turns one hard-coded card into a list driven by data. <code>Note</code> gets its text through props, and <code>App</code> maps over the array in <code>notes.js</code>, giving each card a unique <code>key</code>. Add an object to the array and a new card appears without touching the JSX.',
  tasks:[
    'In <code>components/Note.jsx</code>, take a <code>props</code> parameter and show <code>{props.title}</code> in the <code>&lt;h1&gt;</code> and <code>{props.content}</code> in the <code>&lt;p&gt;</code>. Test it by giving the single <code>&lt;Note /&gt;</code> in App a <code>title</code> and a <code>content</code>.',
    'In <code>notes.js</code>, export the array as the default export.',
    'In <code>components/App.jsx</code>, import it with <code>import notes from "../notes";</code> (App lives in the components folder, notes.js one level up). <code>console.log(notes)</code> once to check.',
    'Replace the single Note with <code>{notes.map(createNote)}</code>, where <code>createNote(noteItem)</code> returns a <code>&lt;Note&gt;</code> with <code>title</code> and <code>content</code> taken from the note.',
    'Look in the console for the warning about a missing <code>key</code>. Add <code>key={noteItem.key}</code> to the returned Note and watch the warning disappear.',
    'Refactor: move the callback into the map call as <code>noteItem =&gt; (&lt;Note ... /&gt;)</code> and delete <code>createNote</code>.',
    'Add a fifth object to notes.js (with <code>key: 5</code>). A fifth card should appear while App.jsx stays untouched.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
// TODO 3: import the notes array (notes.js is one folder up: "../notes")

// CHALLENGE: render every object in notes.js as its own <Note />,
// so that adding an object to the array adds a card to the page.

function App() {
  return (
    <div>
      <Header />
      {/* TODO 4: replace this single Note with {notes.map(...)} */}
      <Note />
      <Footer />
    </div>
  );
}

export default App;
`,
'components/Note.jsx':`import React from "react";

// TODO 1: take props, then show props.title in the <h1> and props.content in the <p>
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
'notes.js':`const notes = [
  {
    key: 1,
    title: "Shopping",
    content: "Oat milk, lemons, coffee beans and a new notebook."
  },
  {
    key: 2,
    title: "Keys",
    content: "Every element made by map() needs a key that no sibling shares."
  },
  {
    key: 3,
    title: "Debugging",
    content: "Read the whole error message before changing any code. It usually names the file and the line."
  },
  {
    key: 4,
    title: "Weekend",
    content: "Finish the Keeper app, then show it to someone who has never seen React."
  }
];

// TODO 2: export the array as the default export
`,
'components/Header.jsx':KEEPER_HEADER_JSX,
'components/Footer.jsx':KEEPER_FOOTER_JSX,
'index.jsx':INDEX_JSX,
'styles.css':CSS_KEEPER,
  },
  solution:{
'components/App.jsx':`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";

function App() {
  return (
    <div>
      <Header />
      {notes.map(noteItem => (
        <Note
          key={noteItem.key}
          title={noteItem.title}
          content={noteItem.content}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
`,
'components/Note.jsx':`import React from "react";

function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
    </div>
  );
}

export default Note;
`,
'notes.js':`const notes = [
  {
    key: 1,
    title: "Shopping",
    content: "Oat milk, lemons, coffee beans and a new notebook."
  },
  {
    key: 2,
    title: "Keys",
    content: "Every element made by map() needs a key that no sibling shares."
  },
  {
    key: 3,
    title: "Debugging",
    content: "Read the whole error message before changing any code. It usually names the file and the line."
  },
  {
    key: 4,
    title: "Weekend",
    content: "Finish the Keeper app, then show it to someone who has never seen React."
  },
  {
    key: 5,
    title: "Arrow functions",
    content: "noteItem => (<Note ... />) does the same job as a named createNote function."
  }
];

export default notes;
`,
  },
  quiz:[
    { q:'The console warns about a missing <code>key</code> after you map the notes. What is the key for?', options:['Styling each card','Letting React tell the list items apart between renders','Sorting the notes','Passing the id to Note'], answer:1, why:'React matches old and new list items by key, so each sibling needs a unique one.' },
    { q:'Inside <code>Note</code>, what is <code>props.key</code>?', options:['The note’s key number','undefined','An error','The index in the array'], answer:1, why:'React keeps key for itself and does not pass it on. Send a separate prop (such as id) if the child needs the value.' },
    { q:'Why does <code>notes.map(...)</code> have to sit inside curly braces in the JSX?', options:['map only works in braces','It is a JavaScript expression, and braces switch from JSX to JavaScript','Braces make it run faster','To create a fragment'], answer:1, why:'Anything in JSX that should be evaluated as JavaScript goes between { and }.' },
    { q:'What happens when you add a sixth object to <code>notes.js</code>?', options:['Nothing until you add a sixth &lt;Note /&gt;','A sixth card appears automatically','React throws an error','Only the sixth note shows'], answer:1, why:'The cards are generated from the array, so the page follows the data.' },
  ],
});

/* ---------- 302 ---------- */

PG.add({
  id:'l302', index:302, udemyId:17039262, minutes:19, section:'s36', slug:'conditional-rendering', kind:'react',
  title:'React Conditional Rendering with the Ternary Operator & AND Operator',
  blurb:'Curly braces in JSX accept expressions, not statements, so an <code>if/else</code> cannot go inside them. Choose between two elements with a ternary, <code>condition ? a : b</code>, and render something-or-nothing with <code>condition &amp;&amp; element</code>. Along the way the login form is split into reusable <code>Login</code> and <code>Input</code> components.',
  tasks:[
    'In <code>components/App.jsx</code>, write <code>renderConditionally()</code> with an if/else: return <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> when <code>isLoggedIn</code> is true, otherwise the form. Call it inside the container div as <code>{renderConditionally()}</code>, then flip <code>isLoggedIn</code> to see both branches.',
    'Move the form into <code>components/Login.jsx</code>: a <code>Login</code> component, exported by default. Import it in App and return <code>&lt;Login /&gt;</code> from the else branch.',
    'In <code>components/Input.jsx</code>, write an <code>Input</code> component that renders <code>&lt;input type={props.type} placeholder={props.placeholder} /&gt;</code>. Use it twice inside Login (a text Username and a password Password). The page should look exactly as before.',
    'Delete the helper and make the choice inline: <code>{isLoggedIn ? &lt;h1&gt;Hello&lt;/h1&gt; : &lt;Login /&gt;}</code>.',
    'Add <code>const currentTime = new Date().getHours();</code> and show <code>&lt;h1&gt;Why are you still working?&lt;/h1&gt;</code> only when <code>currentTime &gt; 12</code>: first as a ternary with <code>null</code> in the false branch, then with <code>&amp;&amp;</code>. Try a fixed hour such as <code>const currentTime = 9;</code> to test the morning.'
  ],
  files:{
'components/App.jsx':`import React from "react";

var isLoggedIn = false;

// TODO 1: write renderConditionally(). Return <h1>Hello</h1> when isLoggedIn
//         is true and the form otherwise, then call it inside the div below.

function App() {
  return (
    <div className="container">
      <h1>Hello</h1>
      <form className="form">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
`,
'components/Login.jsx':`import React from "react";

// TODO 2: a Login component that returns the whole <form> (cut it out of
//         App.jsx), exported as the default export.
`,
'components/Input.jsx':`import React from "react";

// TODO 3: an Input component that renders one <input>, taking its type and
//         placeholder from props. Export it, then use it twice inside Login.
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':`import React from "react";
import Login from "./Login";

var isLoggedIn = false;

const currentTime = new Date().getHours(); // 0 to 23

function App() {
  return (
    <div className="container">
      {isLoggedIn ? <h1>Hello</h1> : <Login />}

      {/* the same as: currentTime > 12 ? <h1>...</h1> : null */}
      {currentTime > 12 && <h1>Why are you still working?</h1>}
    </div>
  );
}

export default App;
`,
'components/Login.jsx':`import React from "react";
import Input from "./Input";

function Login() {
  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
`,
'components/Input.jsx':`import React from "react";

function Input(props) {
  return <input type={props.type} placeholder={props.placeholder} />;
}

export default Input;
`,
  },
  explore:[{
    title:'Which branch renders?', height:470,
    note:'Tick <b>isLoggedIn</b> and drag the hour. The highlighted code is the part that produces what you see on the right. All three snippets make the same decisions; only the last two can live inside JSX braces, because they are expressions.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="logged"> isLoggedIn</label>
  <label>currentTime <input type="range" id="hour" min="0" max="23" value="9"><span class="val" id="hourVal"></span></label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:stretch">
  <pre class="readout" id="code" style="flex:1 1 330px;margin:0"></pre>
  <div class="stage" id="view" style="flex:1 1 200px;margin:0;color:#fff;text-align:center;background:linear-gradient(160deg,#3f9c9a,#2f6f8f)"></div>
</div>
<p class="note" id="say" style="margin-top:12px"></p>
<script>
  var logged = document.getElementById('logged'), hour = document.getElementById('hour');
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function hl(text, on) {
    return '<span style="' + (on ? 'background:#f9d55b;color:#111;border-radius:3px;padding:0 2px' : 'opacity:.4') + '">' + esc(text) + '</span>';
  }
  function c(text) { return '<span style="color:#7ee0a8">' + esc(text) + '</span>'; }
  function draw() {
    var L = logged.checked, H = +hour.value, late = H > 12;
    document.getElementById('hourVal').textContent = H + ':00';
    document.getElementById('code').innerHTML = [
      c('// 1. a helper function with if / else'),
      'function renderConditionally() {',
      '  if (isLoggedIn) {',
      '    return ' + hl('<h1>Hello</h1>;', L),
      '  } else {',
      '    return ' + hl('<Login />;', !L),
      '  }',
      '}',
      '',
      c('// 2. the same choice as one expression'),
      '{isLoggedIn ? ' + hl('<h1>Hello</h1>', L) + ' : ' + hl('<Login />', !L) + '}',
      '',
      c('// 3. something or nothing'),
      '{currentTime &gt; 12 &amp;&amp; ' + hl('<h1>Why are you still working?</h1>', late) + '}'
    ].join('\\n');
    var box = 'border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.18);border-radius:4px;padding:5px;margin:0 auto 6px;max-width:180px;font-size:13px';
    document.getElementById('view').innerHTML =
      (L ? '<div style="font-size:26px;font-weight:300;margin:8px 0 14px">Hello</div>'
         : '<div style="' + box + '">Username</div><div style="' + box + '">Password</div>' +
           '<div style="' + box + ';background:#fff;color:#3a9c9a;border-color:#fff">Login</div>') +
      (late ? '<div style="font-size:18px;font-weight:300;margin-top:14px">Why are you still working?</div>' : '');
    document.getElementById('say').textContent =
      'isLoggedIn is ' + L + ', so ' + (L ? 'the h1 renders' : 'the Login component renders') + '. ' +
      H + ' > 12 is ' + late + (late ? ', so && carries on and renders the heading.' : ', so && stops at false and React draws nothing for it.') +
      (H === 12 ? ' (12 is not greater than 12: use >= 12 if noon should count.)' : '');
  }
  logged.addEventListener('change', draw);
  hour.addEventListener('input', draw);
  draw();
<\/script>`,
  },{
    title:'The 0 trap with &&', height:330,
    note:'This box is rendered by real React. <code>count &amp;&amp; &lt;b&gt;…&lt;/b&gt;</code> hands React the left-hand value whenever it is falsy. React draws nothing for false, null, undefined or an empty string, but 0 and NaN are numbers, so they appear on the page. Tick the fix to compare with a real true/false test.',
    html:`
<div class="knobs">
  <label>count is
    <select id="val">
      <option value="5">5</option>
      <option value="0">0</option>
      <option value="true">true</option>
      <option value="false">false</option>
      <option value="null">null</option>
      <option value="undefined">undefined</option>
      <option value="empty">"" (empty string)</option>
      <option value="NaN">NaN</option>
    </select>
  </label>
  <label><input type="checkbox" id="fix"> use count &gt; 0 &amp;&amp; …</label>
</div>
<pre class="readout" id="expr"></pre>
<div class="stage"><div id="root"></div></div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement;
  var root = ReactDOM.createRoot(document.getElementById('root'));
  var VALUES = { '5': 5, '0': 0, 'true': true, 'false': false, 'null': null, 'undefined': undefined, 'empty': '', 'NaN': NaN };
  var sel = document.getElementById('val'), fix = document.getElementById('fix');
  function name(v) { return v === '' ? '""' : String(v); }
  function draw() {
    var v = VALUES[sel.value], left = fix.checked ? v > 0 : v;
    var result = left && 'the <b> element';
    document.getElementById('expr').textContent =
      '{' + (fix.checked ? 'count > 0' : 'count') + ' && <b>You have new messages</b>}' +
      '\\n\\n' + (fix.checked ? 'count > 0' : 'count') + ' is ' + name(left) +
      '\\nthe expression gives: ' + (left ? 'the <b> element' : name(left)) +
      '\\nReact shows: ' + (left ? 'the message' : (typeof left === 'number' ? 'the number ' + name(left) + ' (!)' : 'nothing'));
    root.render(h('div', { style: { fontSize: '16px' } }, h('span', { style: { color: '#5b6382' } }, 'Inbox: '), left && h('b', null, 'You have new messages')));
  }
  sel.addEventListener('change', draw);
  fix.addEventListener('change', draw);
  draw();
<\/script>`,
  }],
  quiz:[
    { q:'Why can you not put an <code>if/else</code> inside JSX curly braces?', options:['JSX has its own if keyword','Braces only accept expressions, and if/else is a statement','It works, but it is slow','React forbids conditions in JSX'], answer:1, why:'Braces must resolve to one value. A ternary or && is an expression; an if/else is not.' },
    { q:'What does <code>{isLoggedIn ? &lt;h1&gt;Hello&lt;/h1&gt; : &lt;Login /&gt;}</code> render when <code>isLoggedIn</code> is false?', options:['Hello','The Login component','Nothing','Both'], answer:1, why:'condition ? whenTrue : whenFalse. False picks the part after the colon.' },
    { q:'At 9 in the morning, what does <code>{currentTime &gt; 12 &amp;&amp; &lt;h1&gt;Still working?&lt;/h1&gt;}</code> show?', options:['The heading','false, written on the page','Nothing','An error'], answer:2, why:'The left side is false, so && returns false without looking at the right side, and React renders nothing for false.' },
    { q:'<code>count</code> is 0. What does <code>{count &amp;&amp; &lt;p&gt;{count} new&lt;/p&gt;}</code> put on the page?', options:['Nothing','A 0','“0 new”','An error'], answer:1, why:'&& returns the falsy left value, 0, and React renders numbers. Use count &gt; 0 &amp;&amp; … instead.' },
  ],
});

/* ---------- 303 ---------- */

PG.add({
  id:'l303', index:303, udemyId:17039348, minutes:7, section:'s36', slug:'conditional-rendering-practice', kind:'react',
  title:'Conditional Rendering Practice',
  blurb:'One form, two jobs: when <code>userIsRegistered</code> is true it is a login form, when false it becomes a sign-up form with an extra Confirm Password field. The flag stays in <code>App</code> and travels down as a prop; a ternary swaps the button text and <code>&amp;&amp;</code> shows the extra input.',
  tasks:[
    'In <code>components/App.jsx</code>, leave <code>userIsRegistered</code> where it is and pass it down: <code>&lt;Form isRegistered={userIsRegistered} /&gt;</code>.',
    'In <code>components/Form.jsx</code>, accept <code>props</code> and replace the button text with <code>{props.isRegistered ? "Login" : "Register"}</code>.',
    'Show the Confirm Password input only for new users: wrap it as <code>{props.isRegistered === false &amp;&amp; ( ... )}</code>, then shorten the test to <code>!props.isRegistered</code>.',
    'Switch <code>userIsRegistered</code> between true and false and check both versions of the form.',
    'Bonus: above the form in App, show “Welcome back” or “Create an account” with another ternary.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import Form from "./Form";

// Pretend this came from checking the user's details against a database.
var userIsRegistered = true;

function App() {
  return (
    <div className="container">
      {/* TODO 1: pass userIsRegistered down to Form as a prop */}
      <Form />
    </div>
  );
}

export default App;
`,
'components/Form.jsx':`import React from "react";
import Input from "./Input";

// CHALLENGE: without moving userIsRegistered out of App.jsx,
// 1. show "Login" on the button when the user is registered, "Register" when not;
// 2. show the Confirm Password input only when the user is NOT registered.

function Form() {
  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      <Input type="password" placeholder="Confirm Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default Form;
`,
'components/Input.jsx':`import React from "react";

function Input(props) {
  return <input type={props.type} placeholder={props.placeholder} />;
}

export default Input;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':`import React from "react";
import Form from "./Form";

// Pretend this came from checking the user's details against a database.
var userIsRegistered = true;

function App() {
  return (
    <div className="container">
      <h1>{userIsRegistered ? "Welcome back" : "Create an account"}</h1>
      <Form isRegistered={userIsRegistered} />
    </div>
  );
}

export default App;
`,
'components/Form.jsx':`import React from "react";
import Input from "./Input";

function Form(props) {
  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      {!props.isRegistered && (
        <Input type="password" placeholder="Confirm Password" />
      )}
      <button type="submit">
        {props.isRegistered ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
`,
  },
  quiz:[
    { q:'<code>Form</code> needs <code>userIsRegistered</code>, but the variable must stay in <code>App</code>. How does Form get it?', options:['Import it from App.jsx','As a prop: &lt;Form isRegistered={userIsRegistered} /&gt;','Make it a global variable','Copy it into Form'], answer:1, why:'Values travel down the component tree as props.' },
    { q:'When does <code>{!props.isRegistered &amp;&amp; &lt;Input … /&gt;}</code> render the input?', options:['When isRegistered is true','When isRegistered is false (or missing)','Always','Never'], answer:1, why:'! flips the boolean, so the right-hand side is reached only when isRegistered is falsy.' },
    { q:'What appears if you write <code>props.isRegistered ? "Login" : "Register"</code> inside the button without curly braces?', options:['Login','Register','That code as plain text','Nothing'], answer:2, why:'Without braces JSX treats it as text. The braces are what make it JavaScript.' },
  ],
});

/* ---------- 304 ---------- */

PG.add({
  id:'l304', index:304, udemyId:17039392, minutes:10, section:'s36', slug:'declarative-vs-imperative', kind:'react',
  title:'State in React - Declarative vs. Imperative Programming',
  blurb:'React’s core idea is that the screen is calculated from data: UI = f(state). Instead of issuing a DOM command for every change (<b>imperative</b>), you describe how each state looks and React draws whichever one is current (<b>declarative</b>). The catch shown at the end: changing an ordinary variable does not make React redraw anything.',
  tasks:[
    'In <code>components/App.jsx</code>, make the paragraph’s style depend on the variable: <code>style={isDone ? strikeThrough : null}</code>. Set <code>isDone</code> to <code>true</code> in the code, then back to <code>false</code>. The JSX describes both looks and the variable picks one: that is declarative.',
    'Fill in <code>strike</code> and <code>unStrike</code> so they set <code>isDone</code> to true and false and <code>console.log</code> it. Click the buttons: the log changes, the paragraph does not. Changing a plain variable never makes React run <code>App</code> again.',
    'In <code>components/Imperative.jsx</code>, write the DOM-command version: <code>document.getElementById("imperative-item").style.textDecoration = "line-through"</code> in <code>strike</code>, and <code>""</code> in <code>unStrike</code>. It works, but every change is a step you spell out yourself.',
    'Peek at the next lecture: in App.jsx import <code>useState</code>, replace <code>var isDone</code> with <code>const [isDone, setIsDone] = useState(false);</code> inside <code>App</code>, move both handlers into App and make them call <code>setIsDone(true)</code> and <code>setIsDone(false)</code>. Now the declarative paragraph follows the clicks.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import Imperative from "./Imperative";

const strikeThrough = { textDecoration: "line-through" };
var isDone = false;

function strike() {
  // TODO 2: set isDone to true and console.log it
}

function unStrike() {
  // TODO 2: set isDone to false and console.log it
}

function App() {
  return (
    <div className="page">
      <section className="card">
        <h2>Declarative</h2>
        {/* TODO 1: give this <p> style={isDone ? strikeThrough : null} */}
        <p>Buy milk</p>
        <button onClick={strike}>Change to strike through</button>
        <button onClick={unStrike}>Change back</button>
      </section>
      <Imperative />
    </div>
  );
}

export default App;
`,
'components/Imperative.jsx':`import React from "react";

// The imperative way: find the element and tell it exactly what to change.
function strike() {
  // TODO 3: get the element with id "imperative-item" and set its
  //         style.textDecoration to "line-through"
}

function unStrike() {
  // TODO 3: set it back to "" (no decoration)
}

function Imperative() {
  return (
    <section className="card">
      <h2>Imperative</h2>
      <p id="imperative-item">Buy eggs</p>
      <button onClick={strike}>Strike through</button>
      <button onClick={unStrike}>Change back</button>
    </section>
  );
}

export default Imperative;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_DARK + `
.page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 40px 16px;
}

.card {
  width: 270px;
  padding: 20px;
  background: #354f52;
  border-radius: 12px;
}

.card h2 {
  margin: 0 0 8px;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #95d5b2;
}

.card p {
  margin: 12px 0 18px;
  font-size: 1.7rem;
}

.card button {
  padding: 8px 10px;
  font-size: 0.85rem;
}
`,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";
import Imperative from "./Imperative";

const strikeThrough = { textDecoration: "line-through" };

function App() {
  // With a plain "var isDone" the clicks changed the variable, but React
  // never ran App again, so the paragraph kept its old look. State is how
  // you tell React that something changed (next lecture).
  const [isDone, setIsDone] = useState(false);

  function strike() {
    setIsDone(true);
  }

  function unStrike() {
    setIsDone(false);
  }

  return (
    <div className="page">
      <section className="card">
        <h2>Declarative</h2>
        <p style={isDone ? strikeThrough : null}>Buy milk</p>
        <button onClick={strike}>Change to strike through</button>
        <button onClick={unStrike}>Change back</button>
      </section>
      <Imperative />
    </div>
  );
}

export default App;
`,
'components/Imperative.jsx':`import React from "react";

// The imperative way: find the element and tell it exactly what to change.
function strike() {
  document.getElementById("imperative-item").style.textDecoration = "line-through";
}

function unStrike() {
  document.getElementById("imperative-item").style.textDecoration = "";
}

function Imperative() {
  return (
    <section className="card">
      <h2>Imperative</h2>
      <p id="imperative-item">Buy eggs</p>
      <button onClick={strike}>Strike through</button>
      <button onClick={unStrike}>Change back</button>
    </section>
  );
}

export default Imperative;
`,
  },
  explore:[{
    title:'Commands versus descriptions', height:360,
    note:'Panel 1 changes the page with DOM commands, one per change. Panels 2 and 3 describe the look once (the style depends on <code>isDone</code>). In panel 2 the buttons change a plain variable: it really changes, but React never runs the component again (<i>renders</i> stays at 1), so the screen keeps the old look. In panel 3 the setter makes React re-render, and the same description now gives the struck-through text.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 210px;margin:0">
    <h4>1 · imperative</h4>
    <p id="impItem" style="font-size:20px;margin:6px 0 10px">Buy milk</p>
    <button id="impStrike">strike</button> <button id="impUndo">undo</button>
    <pre class="readout" id="impLog" style="margin:10px 0 0;height:96px;overflow:auto;font-size:11px;white-space:pre-wrap"></pre>
  </div>
  <div class="stage" style="flex:1 1 210px;margin:0">
    <h4>2 · declarative, plain variable</h4>
    <div id="varRoot"></div>
  </div>
  <div class="stage" style="flex:1 1 210px;margin:0">
    <h4>3 · declarative, state</h4>
    <div id="stateRoot"></div>
  </div>
</div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement;
  var item = document.getElementById('impItem'), log = document.getElementById('impLog');
  function command(text, fn) { fn(); log.textContent += text + '\\n'; log.scrollTop = log.scrollHeight; }
  log.textContent = '// every change is a command you write:\\n';
  document.getElementById('impStrike').onclick = function () {
    command('item.style.textDecoration = "line-through";', function () { item.style.textDecoration = 'line-through'; });
  };
  document.getElementById('impUndo').onclick = function () {
    command('item.style.textDecoration = "";', function () { item.style.textDecoration = ''; });
  };

  function pStyle(done) { return { fontSize: '20px', margin: '6px 0 10px', textDecoration: done ? 'line-through' : 'none' }; }
  var roStyle = { margin: '10px 0 0', fontSize: '11px', whiteSpace: 'pre-wrap' };

  var isDone = false;
  function VarItem() {
    var renders = React.useRef(0);
    renders.current += 1;
    function set(v) { isDone = v; document.getElementById('varVal').textContent = String(v); }
    return h('div', null,
      h('p', { style: pStyle(isDone) }, 'Buy milk'),
      h('button', { onClick: function () { set(true); } }, 'strike'), ' ',
      h('button', { onClick: function () { set(false); } }, 'undo'),
      h('pre', { className: 'readout', style: roStyle },
        'isDone = ', h('span', { id: 'varVal' }, String(isDone)), '\\nrenders: ' + renders.current));
  }

  function StateItem() {
    var pair = React.useState(false), done = pair[0], setDone = pair[1];
    var renders = React.useRef(0);
    renders.current += 1;
    return h('div', null,
      h('p', { style: pStyle(done) }, 'Buy milk'),
      h('button', { onClick: function () { setDone(true); } }, 'strike'), ' ',
      h('button', { onClick: function () { setDone(false); } }, 'undo'),
      h('pre', { className: 'readout', style: roStyle }, 'isDone = ' + done + '\\nrenders: ' + renders.current));
  }

  ReactDOM.createRoot(document.getElementById('varRoot')).render(h(VarItem));
  ReactDOM.createRoot(document.getElementById('stateRoot')).render(h(StateItem));
<\/script>`,
  }],
  quiz:[
    { q:'What does “UI = f(state)” mean?', options:['The UI is a function you call by hand','What you see is worked out from the data: change the data and the screen follows','State is stored inside the HTML','Every component needs a function called f'], answer:1, why:'A component describes the screen for any value of its data; React redraws when that data changes.' },
    { q:'<code>strike()</code> sets a plain variable <code>isDone = true</code>, but the paragraph does not change. Why?', options:['The style object is wrong','React did not run App again, so the JSX was never re-evaluated','Variables cannot hold booleans','onClick only works on links'], answer:1, why:'React re-renders when state or props change. An ordinary variable changing is invisible to it.' },
    { q:'Which of these is imperative?', options:['&lt;p style={isDone ? strikeThrough : null}&gt;','document.getElementById("milk").style.textDecoration = "line-through"','const strikeThrough = { textDecoration: "line-through" }','return &lt;p&gt;Buy milk&lt;/p&gt;'], answer:1, why:'It grabs an element and orders a specific change, rather than describing how the page should look.' },
    { q:'In <code>style={{ textDecoration: "line-through" }}</code>, what are the two pairs of braces?', options:['Both are JSX','Outer: a JavaScript expression inside JSX; inner: an object literal','Outer: an object; inner: a code block','Decoration only, they are optional'], answer:1, why:'The style prop takes an object, and JSX needs braces around any JavaScript value.' },
  ],
});

/* ---------- 305 ---------- */

PG.add({
  id:'l305', index:305, udemyId:17039436, minutes:18, section:'s36', slug:'usestate-hook', kind:'react',
  title:'React Hooks - useState',
  blurb:'<code>useState</code> gives a component a value that survives between renders. It returns a pair, which you name with array destructuring: <code>const [count, setCount] = useState(0)</code>. Calling the setter stores the new value and makes React re-render the component with it. Hooks may only be called inside function components.',
  tasks:[
    'In <code>index.jsx</code>, show <code>{count}</code> in the <code>&lt;h1&gt;</code> and make <code>increase</code> do <code>count++</code> and <code>console.log(count)</code>. Click +: the console counts up while the page stays at 0.',
    'Optional brute force: at the end of <code>increase</code>, call <code>root.render(...)</code> again with the same JSX. The number updates, but you are redrawing the whole app by hand. Undo it.',
    'Hooks only work inside function components. In index.jsx uncomment the <code>App</code> import, render <code>&lt;App /&gt;</code> instead of the div, and delete the old <code>count</code> code.',
    'In <code>components/App.jsx</code>, import <code>{ useState }</code> from "react" and write <code>const [count, setCount] = useState(0);</code> at the top of App. (Curious? <code>console.log(useState(0))</code> once shows the pair: a value and a function.)',
    'Show <code>{count}</code> in the h1, write <code>increase()</code> that calls <code>setCount(count + 1)</code>, and attach it with <code>onClick={increase}</code>: no brackets after the name.',
    'Challenge: add a <b>−</b> button with a <code>decrease()</code> function that calls <code>setCount(count - 1)</code>.'
  ],
  files:{
'index.jsx':`import React from "react";
import { createRoot } from "react-dom/client";
// import App from "./components/App";

const root = createRoot(document.getElementById("root"));

let count = 0;

function increase() {
  // TODO 1: add 1 to count and console.log it
}

root.render(
  <div className="container">
    {/* TODO 1: show {count} here instead of 0 */}
    <h1>0</h1>
    <button onClick={increase}>+</button>
  </div>
);
`,
'components/App.jsx':`import React from "react";
// TODO 4: import { useState } from "react"

function App() {
  // TODO 4: const [count, setCount] = useState(0);

  // TODO 5: function increase() { ... }
  // TODO 6: function decrease() { ... }

  return (
    <div className="container">
      <h1>0</h1>
      <button>+</button>
    </div>
  );
}

export default App;
`,
'styles.css':CSS_DARK,
  },
  solution:{
'index.jsx':INDEX_JSX,
'components/App.jsx':`import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  function decrease() {
    setCount(count - 1);
  }

  return (
    <div className="container">
      <h1>{count}</h1>
      <button onClick={decrease}>-</button>
      <button onClick={increase}>+</button>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'Each render gets its own count', height:380,
    note:'<code>count</code> is a constant inside each render: the number React handed to that render. Calling <code>setCount(count + 1)</code> three times asks for the same number three times, so the counter only goes up by one (and the three updates cause a single render). Passing a function, <code>c =&gt; c + 1</code>, lets React feed each call the value left by the one before. The course uses this form, under the name prevValue, when it updates objects and arrays later in the section.',
    html:`
<div class="stage" id="root"></div>
<pre class="readout" id="log" style="height:130px;overflow:auto;white-space:pre-wrap"></pre>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement, logEl = document.getElementById('log');
  function log(t) { logEl.textContent += t + '\\n'; logEl.scrollTop = logEl.scrollHeight; }
  function Counter() {
    var pair = React.useState(0), count = pair[0], setCount = pair[1];
    var renders = React.useRef(0);
    renders.current += 1;
    function plusOne() {
      setCount(count + 1);
      log('setCount(count + 1): count was ' + count + ', so it asked for ' + (count + 1));
    }
    function plusThreeValue() {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
      log('setCount(count + 1) three times: count was ' + count + ' each time, so all three asked for ' + (count + 1));
    }
    function plusThreeUpdater() {
      setCount(function (c) { return c + 1; });
      setCount(function (c) { return c + 1; });
      setCount(function (c) { return c + 1; });
      log('setCount(c => c + 1) three times: ' + count + ' → ' + (count + 1) + ' → ' + (count + 2) + ' → ' + (count + 3));
    }
    return h('div', { style: { textAlign: 'center' } },
      h('span', { className: 'tag' }, 'useState(0) returned [' + count + ', setCount]  ·  renders: ' + renders.current),
      h('div', { style: { fontSize: '56px', fontWeight: 700, margin: '8px 0 12px', fontFamily: 'ui-monospace,Menlo,monospace' } }, count),
      h('button', { onClick: plusOne }, '+1'), ' ',
      h('button', { onClick: plusThreeValue }, '+3 with setCount(count + 1) ×3'), ' ',
      h('button', { onClick: plusThreeUpdater }, '+3 with setCount(c => c + 1) ×3'), ' ',
      h('button', { onClick: function () { setCount(0); log('setCount(0)'); } }, 'reset'));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Counter));
<\/script>`,
  }],
  quiz:[
    { q:'What does <code>useState(0)</code> return?', options:['The number 0','An array: the current value and a function that updates it','An object with value and set keys','A new component'], answer:1, why:'That is why it is destructured with square brackets: you choose both names by position.' },
    { q:'What goes wrong with <code>&lt;button onClick={increase()}&gt;</code>?', options:['Nothing, it is the same thing','increase runs while the component renders instead of on click','The button disappears','React adds the brackets anyway'], answer:1, why:'The brackets call the function immediately and pass its result. A setter called during render even makes React re-render in a loop until it gives up. Pass the function: onClick={increase}.' },
    { q:'Why does <code>setCount(12)</code> not make a counter?', options:['12 is too big','It stores the same fixed value on every click; the next value has to be built from count','setCount only accepts 0','It needs a second argument'], answer:1, why:'setCount(count + 1) derives the new value from the current one.' },
    { q:'Where may you call <code>useState</code>?', options:['Anywhere in the file','At the top level of a function component','Inside an if statement in a component','In a class component'], answer:1, why:'Hooks must run in the same order on every render, so they sit at the top of a function component, never in conditions, loops or classes.' },
  ],
});

/* ---------- 306 ---------- */

PG.add({
  id:'l306', index:306, udemyId:17039466, minutes:7, section:'s36', slug:'usestate-practice-clock', kind:'react',
  title:'useState Hook Practice',
  blurb:'Practice with state that changes over time: show the current time in the heading, refresh it from a button, then let it tick every second. The video starts the timer straight in the component body, which adds another timer on every render; this lesson finishes with <code>useEffect</code>, which starts one timer and stops it again.',
  tasks:[
    'Inside <code>App</code>, store the time as text: <code>const now = new Date().toLocaleTimeString();</code>. Log it once to see the format your browser uses.',
    'Put it in state with <code>const [time, setTime] = useState(now);</code> and show <code>{time}</code> in the <code>&lt;h1&gt;</code> instead of TIME.',
    'Write <code>updateTime()</code>: build a fresh time string and pass it to <code>setTime</code>. Attach it with <code>onClick={updateTime}</code> and check that each click jumps to the current time.',
    'Part 2, the video’s way: add <code>setInterval(updateTime, 1000);</code> in the component body and a <code>console.log("tick")</code> inside updateTime. The clock ticks, but watch the console: the ticks per second keep growing, because every render starts another timer.',
    'Fix it: import <code>useEffect</code> and replace that line with <code>useEffect(() =&gt; { const timerId = setInterval(updateTime, 1000); return () =&gt; clearInterval(timerId); }, []);</code>. Now there is one tick per second for as long as the clock is on screen. Remove the log.'
  ],
  files:{
'components/App.jsx':`import React, { useState } from "react";

// CHALLENGE
// 1. You can get the current time as text with:
//      new Date().toLocaleTimeString()
//    Show it in the <h1>, and update it when Get Time is pressed.
// 2. Make the time in the <h1> update every second by itself.
//
// setInterval(fn, ms) calls fn every ms milliseconds. Uncomment to see it:
// function sayHi() {
//   console.log("Hi");
// }
// setInterval(sayHi, 1000);

function App() {
  return (
    <div className="container">
      <h1>TIME</h1>
      <button>Get Time</button>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_DARK + `
h1 {
  font-size: 3.4rem;
}

button {
  padding: 10px 18px;
  font-size: 1.4rem;
}
`,
  },
  solution:{
'components/App.jsx':`import React, { useState, useEffect } from "react";

function App() {
  const now = new Date().toLocaleTimeString();
  const [time, setTime] = useState(now);

  function updateTime() {
    const newTime = new Date().toLocaleTimeString();
    setTime(newTime);
  }

  // Part 2: start ONE timer after the first render, and stop it when App goes away.
  // (setInterval straight in the component body, as in the video, runs on every
  // render, so each tick would start yet another timer.)
  useEffect(() => {
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="container">
      <h1>{time}</h1>
      <button onClick={updateTime}>Get Time</button>
    </div>
  );
}

export default App;
`,
  },
  notes:`<h3>Why useEffect here</h3>
<p>Everything in a component’s body runs on every render. A timer started there is started again after each tick, because each tick sets state and so causes a render. <code>useEffect(fn, [])</code> runs <code>fn</code> once, after the first render, and the function that <code>fn</code> returns is the clean-up: React calls it when the component disappears. Starting the timer in the effect and clearing it in the clean-up gives exactly one timer for the component’s whole life.</p>
<pre>useEffect(() => {
  const timerId = setInterval(updateTime, 1000);  // start once
  return () => clearInterval(timerId);            // stop when App goes away
}, []);                                           // [] means: only after the first render</pre>
<p>Effects get a full chapter in the React docs (react.dev, “Synchronizing with Effects”). For now, treat this as the safe pattern for timers.</p>`,
  explore:[{
    title:'Two clocks, two timer strategies', height:330,
    note:'Both clocks show the same time. The left one calls <code>setInterval</code> in the component body, so every render (one per tick) starts another timer: watch its count climb while the right one stays at 1. Each extra timer keeps calling <code>setTime</code> every second. <code>useEffect</code> with <code>[]</code> starts one timer after the first render, and its clean-up stops it when the component goes away (press restart: the count drops and comes back).',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 240px;margin:0">
    <h4>setInterval in the component body</h4>
    <div id="leaky"></div>
    <pre class="readout" id="leakyInfo" style="margin:10px 0 0"></pre>
  </div>
  <div class="stage" style="flex:1 1 240px;margin:0">
    <h4>setInterval inside useEffect</h4>
    <div id="clean"></div>
    <pre class="readout" id="cleanInfo" style="margin:10px 0 0"></pre>
  </div>
</div>
<div class="knobs" style="margin-top:12px"><button id="restart">restart both clocks</button><span class="note" style="margin:0">The left clock stops adding timers at 200 so this page stays responsive.</span></div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement, LIMIT = 200;
  var leak = { timers: [], renders: 0 }, clean = { active: 0, renders: 0 };
  var clockStyle = { fontSize: '30px', fontFamily: 'ui-monospace,Menlo,monospace', margin: '4px 0' };
  function now() { return new Date().toLocaleTimeString(); }

  function LeakyClock() {
    var pair = React.useState(now()), time = pair[0], setTime = pair[1];
    leak.renders += 1;
    function updateTime() { setTime(now()); }
    if (leak.timers.length < LIMIT) leak.timers.push(setInterval(updateTime, 1000)); // runs on every render
    return h('div', { style: clockStyle }, time);
  }

  function CleanClock() {
    var pair = React.useState(now()), time = pair[0], setTime = pair[1];
    clean.renders += 1;
    React.useEffect(function () {
      var id = setInterval(function () { setTime(now()); }, 1000);
      clean.active += 1;
      return function () { clearInterval(id); clean.active -= 1; };
    }, []);
    return h('div', { style: clockStyle }, time);
  }

  var roots = null;
  function start() {
    if (roots) { roots[0].unmount(); roots[1].unmount(); }
    leak.timers.forEach(clearInterval);
    leak.timers = []; leak.renders = 0; clean.renders = 0;
    roots = [ReactDOM.createRoot(document.getElementById('leaky')), ReactDOM.createRoot(document.getElementById('clean'))];
    roots[0].render(h(LeakyClock));
    roots[1].render(h(CleanClock));
  }
  setInterval(function () {
    document.getElementById('leakyInfo').textContent = 'timers running: ' + leak.timers.length + (leak.timers.length >= LIMIT ? ' (capped)' : '') + '\\nrenders so far: ' + leak.renders;
    document.getElementById('cleanInfo').textContent = 'timers running: ' + clean.active + '\\nrenders so far: ' + clean.renders;
  }, 250);
  document.getElementById('restart').onclick = start;
  start();
<\/script>`,
  }],
  quiz:[
    { q:'Why is <code>setInterval(updateTime, 1000)</code> in the component body a problem?', options:['It never runs','The body runs on every render, so each tick starts yet another timer','setInterval is not allowed in React','It makes the clock run slow'], answer:1, why:'Each tick sets state, which renders, which calls setInterval again: the timers pile up.' },
    { q:'In <code>useEffect(() =&gt; { …; return () =&gt; clearInterval(id); }, [])</code>, when does the returned function run?', options:['Straight away','Every second','When the component goes away (the clean-up)','Never'], answer:2, why:'The function returned from an effect is how React lets you undo what the effect started.' },
    { q:'What does the empty array <code>[]</code> at the end of <code>useEffect</code> mean?', options:['Run the effect on every render','Run the effect once, after the first render','Never run the effect','The component takes no props'], answer:1, why:'The array lists what the effect depends on. Nothing listed means nothing can make it run again.' },
    { q:'Why does <code>updateTime</code> make a new <code>Date()</code> instead of reusing <code>now</code>?', options:['now is a string','now was fixed when the component rendered, so it would keep setting the same old time','Dates cannot be stored in state','It is faster'], answer:1, why:'A fresh Date is read at the moment of each click or tick.' },
  ],
});

/* ---------- 307 ---------- */

const CARS_JS = `const cars = [
  {
    model: "Honda Civic",
    // the most popular colour is the first item, so hondaTopColour should be "black"
    coloursByPopularity: ["black", "silver"],
    speedStats: {
      topSpeed: 140,
      zeroToSixty: 8.5
    }
  },
  {
    model: "Tesla Model 3",
    coloursByPopularity: ["red", "white"],
    speedStats: {
      topSpeed: 150,
      zeroToSixty: 3.2
    }
  }
];

export default cars;
`;

const CARS_TABLE_ROWS = `        <tr>
          <td>{tesla.model}</td>
          <td>{teslaTopSpeed}</td>
          <td>{teslaTopColour}</td>
        </tr>
        <tr>
          <td>{honda.model}</td>
          <td>{hondaTopSpeed}</td>
          <td>{hondaTopColour}</td>
        </tr>
`;

const CARS_TABLE = `function App() {
  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Top Speed</th>
          <th>Top Colour</th>
        </tr>
      </thead>
      <tbody>
` + CARS_TABLE_ROWS + `      </tbody>
    </table>
  );
}

export default App;
`;

PG.add({
  id:'l307', index:307, udemyId:17039494, minutes:18, section:'s36', slug:'destructuring', kind:'react',
  title:'Javascript ES6 Object & Array Destructuring',
  blurb:'Destructuring unpacks values into variables in one statement: square brackets take array items by position, curly braces take object properties by key. You can rename with a colon, give defaults with <code>=</code> and reach into nested data. It is also exactly how <code>const [count, setCount] = useState(0)</code> works.',
  tasks:[
    'In <code>index.jsx</code>, unpack the array by position: <code>const [cat, dog] = animals;</code> and log both.',
    'Unpack the cat by key: <code>const { name, sound } = cat;</code>. Then rename while unpacking the dog: <code>const { name: dogName, sound: dogSound } = dog;</code> (only the new names exist afterwards).',
    'Defaults: <code>const { legs = 4, sound: catNoise = "purr" } = cat;</code> and log both. The cat has no <code>legs</code>, so you get 4; it does have a sound, so you get "meow". (Re-using a name such as <code>name</code> in a second const would be an error, hence the new names.)',
    'Reach two levels down in one statement: <code>const { feedingRequirements: { food, water } } = cat;</code> should give 2 and 3.',
    'In <code>data.js</code>, write <code>useAnimals(animal)</code> returning <code>[animal.name, function]</code>, where the function logs <code>animal.sound</code>, and add <code>export { useAnimals };</code>. Import it with <code>import animals, { useAnimals } from "./data";</code>, then <code>const [animal, makeSound] = useAnimals(cat);</code> and call <code>makeSound()</code>.',
    'Challenge, in <code>components/App.jsx</code>: create <code>honda</code>, <code>tesla</code>, <code>hondaTopSpeed</code>, <code>teslaTopSpeed</code>, <code>hondaTopColour</code> and <code>teslaTopColour</code> with destructuring only, then uncomment the table rows without changing them.'
  ],
  files:{
'index.jsx':`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import animals from "./data";

console.log(animals); // look at the shape before you unpack it

// TODO 1 (arrays, by position): const [cat, dog] = animals;

// TODO 2 (objects, by key): take name and sound out of cat, then rename
//         while unpacking dog: { name: dogName, sound: dogSound }

// TODO 3 (defaults): { legs = 4, sound: catNoise = "purr" } from cat

// TODO 4 (nested): food and water from inside cat.feedingRequirements

// TODO 5: const [animal, makeSound] = useAnimals(cat); then makeSound();

createRoot(document.getElementById("root")).render(<App />);
`,
'data.js':`const animals = [
  { name: "cat", sound: "meow", feedingRequirements: { food: 2, water: 3 } },
  { name: "dog", sound: "woof" }
];

// TODO 5: function useAnimals(animal) returning an array of two things:
//         animal.name, and a function that logs animal.sound.
//         Then add a named export: export { useAnimals };

export default animals;
`,
'components/App.jsx':`import React from "react";
import cars from "../practice";

// CHALLENGE: the table rows below use honda, tesla, hondaTopSpeed,
// teslaTopSpeed, hondaTopColour and teslaTopColour. Create those variables
// with destructuring only (do not change the JSX), then uncomment the rows.
// The top colour is the first item in coloursByPopularity.

// TODO 6: your destructuring goes here


function App() {
  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Top Speed</th>
          <th>Top Colour</th>
        </tr>
      </thead>
      <tbody>
        {/* uncomment the rows once your variables exist
` + CARS_TABLE_ROWS + `        */}
      </tbody>
    </table>
  );
}

export default App;
`,
'practice.js':CARS_JS,
'styles.css':CSS_TABLE,
  },
  solution:{
'index.jsx':`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import animals, { useAnimals } from "./data";

console.log(animals); // look at the shape before you unpack it

// 1. Arrays unpack by position (the names are up to you)
const [cat, dog] = animals;
console.log(cat, dog);

// 2. Objects unpack by key...
const { name, sound } = cat;
console.log(name, sound); // cat meow

// ...and key: newName renames while unpacking
const { name: dogName, sound: dogSound } = dog;
console.log(dogName, dogSound); // dog woof

// 3. A default only applies when the value is undefined
const { legs = 4, sound: catNoise = "purr" } = cat;
console.log(legs, catNoise); // 4 meow

// 4. Nested: a colon followed by another pattern steps inside
const {
  feedingRequirements: { food, water }
} = cat;
console.log(food, water); // 2 3

// 5. A function that returns [value, function], just like useState
const [animal, makeSound] = useAnimals(cat);
console.log(animal); // cat
makeSound(); // meow

createRoot(document.getElementById("root")).render(<App />);
`,
'data.js':`const animals = [
  { name: "cat", sound: "meow", feedingRequirements: { food: 2, water: 3 } },
  { name: "dog", sound: "woof" }
];

function useAnimals(animal) {
  return [
    animal.name,
    function () {
      console.log(animal.sound);
    }
  ];
}

export default animals;
export { useAnimals };
`,
'components/App.jsx':`import React from "react";
import cars from "../practice";

const [honda, tesla] = cars;

const {
  coloursByPopularity: [hondaTopColour],
  speedStats: { topSpeed: hondaTopSpeed }
} = honda;

const {
  coloursByPopularity: [teslaTopColour],
  speedStats: { topSpeed: teslaTopSpeed }
} = tesla;

` + CARS_TABLE,
  },
  explore:[{
    title:'Destructuring playground', height:520,
    note:'Pick an example, or type your own pattern to the left of the <code>=</code>. The menu on the right chooses which data is unpacked (shown at the bottom), and the dark box lists every variable the pattern creates.',
    html:`
<div class="knobs">
  <label>example <select id="pick" style="max-width:440px"></select></label>
</div>
<div class="stage" style="font:13px/1.6 ui-monospace,Menlo,monospace">
  const <input id="pat" spellcheck="false" style="width:58%;font:inherit;padding:3px 6px;border:1px solid #cfd5e6;border-radius:6px"> =
  <select id="src" style="font:inherit"></select>;
</div>
<pre class="readout" id="out"></pre>
<p class="note" id="why"></p>
<pre class="readout" id="data" style="font-size:11.5px;color:#aab4cf;white-space:pre-wrap"></pre>
<script>
  var cat = { name: 'cat', sound: 'meow', feedingRequirements: { food: 2, water: 3 } };
  var dog = { name: 'dog', sound: 'woof' };
  var cars = [
    { model: 'Honda Civic', coloursByPopularity: ['black', 'silver'], speedStats: { topSpeed: 140, zeroToSixty: 8.5 } },
    { model: 'Tesla Model 3', coloursByPopularity: ['red', 'white'], speedStats: { topSpeed: 150, zeroToSixty: 3.2 } }
  ];
  var SOURCES = { animals: [cat, dog], cat: cat, dog: dog, cars: cars, honda: cars[0], tesla: cars[1] };
  var EX = [
    ['[cat, dog]', 'animals', 'Square brackets unpack an array by position: item 0, then item 1. The names are your choice.'],
    ['[first]', 'animals', 'You can stop early: only the first item is taken.'],
    ['{ name, sound }', 'cat', 'Curly braces unpack an object by key, so the names must match the keys.'],
    ['{ name: catName, sound: catSound }', 'cat', 'key: newName renames while unpacking. Only catName and catSound are created.'],
    ['{ name = "Fluffy", legs = 4 }', 'cat', 'A default is used only when the value is undefined. The cat has a name, so "Fluffy" is ignored; it has no legs key, so 4 is used.'],
    ['{ feedingRequirements: { food, water } }', 'cat', 'A colon followed by another pattern steps inside. feedingRequirements itself does not become a variable.'],
    ['{ animalSound }', 'cat', 'A key that does not exist gives undefined, and no error. Check your spelling.'],
    ['[honda, tesla]', 'cars', 'The challenge starts like this.'],
    ['{ model, speedStats: { topSpeed: hondaTopSpeed } }', 'honda', 'Step inside speedStats, then rename topSpeed on the way out.'],
    ['{ coloursByPopularity: [hondaTopColour] }', 'honda', 'Here the data is an array, so the inner pattern uses square brackets and takes the first item.']
  ];
  var pick = document.getElementById('pick'), pat = document.getElementById('pat'), src = document.getElementById('src'),
      out = document.getElementById('out'), why = document.getElementById('why'), dataEl = document.getElementById('data');
  Object.keys(SOURCES).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = k; src.appendChild(o); });
  EX.forEach(function (e, i) { var o = document.createElement('option'); o.value = i; o.textContent = 'const ' + e[0] + ' = ' + e[1]; pick.appendChild(o); });
  function show(v) {
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return '"' + v + '"';
    if (Array.isArray(v)) return '[' + v.map(show).join(', ') + ']';
    if (v && typeof v === 'object') return '{ ' + Object.keys(v).map(function (k) { return k + ': ' + show(v[k]); }).join(', ') + ' }';
    return String(v);
  }
  function run() {
    var data = SOURCES[src.value], got = {}, order = [];
    dataEl.textContent = src.value + ' = ' + JSON.stringify(data, null, 2);
    var scope = new Proxy({}, {
      has: function (t, k) { return typeof k === 'string'; },
      get: function (t, k) {
        if (k === Symbol.unscopables) return undefined;
        if (k === '__data__') return data;
        if (Object.prototype.hasOwnProperty.call(got, k)) return got[k];
        return window[k];
      },
      set: function (t, k, v) { if (order.indexOf(k) < 0) order.push(k); got[k] = v; return true; }
    });
    try {
      new Function('__scope__', 'with (__scope__) { (' + pat.value + ' = __data__); }')(scope);
      out.textContent = order.length ? order.map(function (k) { return k + ' = ' + show(got[k]); }).join('\\n') : '(no variables created)';
    } catch (e) {
      out.textContent = e.name + ': ' + e.message;
    }
  }
  pick.addEventListener('change', function () { var e = EX[pick.value]; pat.value = e[0]; src.value = e[1]; why.textContent = e[2]; run(); });
  pat.addEventListener('input', function () { why.textContent = ''; run(); });
  src.addEventListener('change', function () { why.textContent = ''; run(); });
  pick.dispatchEvent(new Event('change'));
<\/script>`,
  }],
  quiz:[
    { q:'After <code>const [a, b] = ["x", "y", "z"];</code>, what are <code>a</code> and <code>b</code>?', options:['"x" and "y"','"y" and "z"','"x" and ["y", "z"]','An error: too many items'], answer:0, why:'Array destructuring goes by position and simply ignores the items you do not name.' },
    { q:'What is <code>colour</code> after <code>const { colour } = { name: "cat" };</code>?', options:['"cat"','undefined','null','A ReferenceError'], answer:1, why:'Object destructuring goes by key. A missing key gives undefined, silently.' },
    { q:'After <code>const { name: catName } = cat;</code>, which variable exists?', options:['name','catName','Both','Neither'], answer:1, why:'The colon renames: the value of cat.name lands in catName, and no variable called name is created.' },
    { q:'Which statement pulls <code>water</code> out of <code>cat.feedingRequirements.water</code>?', options:['const { water } = cat;','const { feedingRequirements: { water } } = cat;','const [feedingRequirements, water] = cat;','const { feedingRequirements.water } = cat;'], answer:1, why:'Mirror the shape of the data: a colon and another pair of braces step one level down.' },
    { q:'Why does <code>const [count, setCount] = useState(0)</code> use square brackets?', options:['useState returns an object','useState returns an array, so you choose both names by position','Square brackets make it a hook','JSX requires them'], answer:1, why:'Returning an array lets every component name the pair whatever it likes.' },
  ],
});

/* ---------- 308 ---------- */

PG.add({
  id:'l308', index:308, udemyId:17039526, minutes:6, section:'s36', slug:'destructuring-solution', kind:'react',
  title:'Javascript ES6 Destructuring Challenge Solution',
  blurb:'The cars challenge, solved. Unpack the array into <code>honda</code> and <code>tesla</code>, then mirror each object’s shape in the pattern to reach the top speed (renamed on the way out) and the first colour. Braces where the data is an object, brackets where it is an array, a colon to step one level deeper or to rename.',
  tasks:[
    'Read <code>components/App.jsx</code> from top to bottom. For every variable the table uses, find the part of a pattern that creates it, and compare the patterns with the shape of <code>cars</code> logged in the console.',
    'Comment out <code>const [honda, tesla] = cars;</code>. The preview breaks and the error names the first variable that is now missing. Put the line back.',
    'Split the Honda statement into two: one for the colour, one for the speed. The table should not change.',
    'Add a “0–60” column: take <code>zeroToSixty</code> out of both cars’ <code>speedStats</code>. The second one needs its own name (<code>zeroToSixty: teslaZeroToSixty</code>), otherwise two consts share a name and the file will not compile.',
    'Try a default: write <code>coloursByPopularity: [hondaTopColour = "unknown"]</code>, empty the Honda’s colour array in practice.js and watch “unknown” appear. Then put the colours back.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import cars from "../practice";

console.log(cars);

// 1. The array, by position
const [honda, tesla] = cars;

// 2. Into each object. A colon after a key steps inside it (or renames it);
//    square brackets take items from an array by position.
const {
  coloursByPopularity: [hondaTopColour],
  speedStats: { topSpeed: hondaTopSpeed }
} = honda;

const {
  coloursByPopularity: [teslaTopColour],
  speedStats: { topSpeed: teslaTopSpeed }
} = tesla;

` + CARS_TABLE,
'practice.js':CARS_JS,
'index.jsx':INDEX_JSX,
'styles.css':CSS_TABLE,
  },
  solution:{
'components/App.jsx':`import React from "react";
import cars from "../practice";

console.log(cars);

const [honda, tesla] = cars;

// Honda as two separate statements: same result as one merged pattern
const {
  coloursByPopularity: [hondaTopColour]
} = honda;
const {
  speedStats: { topSpeed: hondaTopSpeed, zeroToSixty: hondaZeroToSixty }
} = honda;

// Tesla as one statement; zeroToSixty is renamed so the names do not clash
const {
  coloursByPopularity: [teslaTopColour],
  speedStats: { topSpeed: teslaTopSpeed, zeroToSixty: teslaZeroToSixty }
} = tesla;

function App() {
  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Top Speed</th>
          <th>Top Colour</th>
          <th>0–60 (s)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{tesla.model}</td>
          <td>{teslaTopSpeed}</td>
          <td>{teslaTopColour}</td>
          <td>{teslaZeroToSixty}</td>
        </tr>
        <tr>
          <td>{honda.model}</td>
          <td>{hondaTopSpeed}</td>
          <td>{hondaTopColour}</td>
          <td>{hondaZeroToSixty}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default App;
`,
  },
  quiz:[
    { q:'In <code>speedStats: { topSpeed: hondaTopSpeed }</code>, what do the two colons do?', options:['Both rename','The first steps inside speedStats, the second renames topSpeed','The first renames, the second sets a default','Both create objects'], answer:1, why:'A colon followed by a pattern goes one level down; a colon followed by a plain name renames.' },
    { q:'What does <code>coloursByPopularity: [hondaTopColour]</code> give you?', options:['The whole colour array','The first colour in the array','The last colour','How many colours there are'], answer:1, why:'Brackets destructure the array by position, and only the first position is named.' },
    { q:'Why can the two cars not both use the name <code>zeroToSixty</code>?', options:['zeroToSixty is a reserved word','Two const declarations with the same name in one scope are an error','Each object can only be destructured once','Numbers cannot be destructured'], answer:1, why:'Destructuring declares ordinary consts, so the usual rule applies: rename one of them.' },
  ],
});

/* ---------- 309 ---------- */

PG.add({
  id:'l309', index:309, udemyId:17039530, minutes:11, section:'s36', slug:'event-handling', kind:'react',
  title:'Event Handling in React',
  blurb:'HTML event attributes become camelCase props in JSX: <code>onClick</code>, <code>onMouseOver</code>, <code>onMouseOut</code>. Pass the function itself (no brackets), then change state inside it: here a click swaps the heading text, and the two hover events flip a boolean that picks the button’s colour in an inline style.',
  tasks:[
    'Give the button <code>onClick={handleClick}</code> (no brackets after the name) and make <code>handleClick</code> log something. Click to check the wiring.',
    'Import <code>useState</code>, create <code>const [headingText, setHeadingText] = useState("Hello");</code>, show <code>{headingText}</code> in the h1 and make handleClick call <code>setHeadingText("Submitted")</code>.',
    'Add <code>onMouseOver={handleMouseOver}</code> and log inside it: it fires as the pointer enters the button.',
    'Create <code>const [isMouseOver, setMouseOver] = useState(false);</code> and make handleMouseOver call <code>setMouseOver(true)</code>.',
    'Colour the button from state: <code>style={{ backgroundColor: isMouseOver ? "black" : "white" }}</code>. Hover: it turns black… and stays black.',
    'Add <code>onMouseOut={handleMouseOut}</code> with <code>setMouseOver(false)</code>, so leaving the button turns it white again.'
  ],
  files:{
'components/App.jsx':`import React from "react";
// TODO 2: import { useState } from "react"

function App() {
  // TODO 2: const [headingText, setHeadingText] = useState("Hello");
  // TODO 4: const [isMouseOver, setMouseOver] = useState(false);

  function handleClick() {
    // TODO 1: log something, then (TODO 2) change the heading to "Submitted"
  }

  function handleMouseOver() {
    // TODO 3: log something, then (TODO 4) setMouseOver(true)
  }

  function handleMouseOut() {
    // TODO 6: setMouseOver(false)
  }

  return (
    <div className="container">
      <h1>Hello</h1>
      <input type="text" placeholder="What's your name?" />
      {/* TODO 1, 3, 5, 6: onClick, onMouseOver, style and onMouseOut */}
      <button>Submit</button>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";

function App() {
  const [headingText, setHeadingText] = useState("Hello");
  const [isMouseOver, setMouseOver] = useState(false);

  function handleClick() {
    setHeadingText("Submitted");
  }

  function handleMouseOver() {
    setMouseOver(true);
  }

  function handleMouseOut() {
    setMouseOver(false);
  }

  return (
    <div className="container">
      <h1>{headingText}</h1>
      <input type="text" placeholder="What's your name?" />
      <button
        style={{ backgroundColor: isMouseOver ? "black" : "white" }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Submit
      </button>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'onMouseOver versus onMouseEnter', height:380,
    note:'Move the pointer onto the button, across the yellow span inside it, and out again. <b>mouseover/mouseout</b> fire again every time you cross into or out of a child element, because the event bubbles up from the child. <b>mouseenter/mouseleave</b> fire once for the button as a whole. React’s <code>onMouseOver</code>/<code>onMouseOut</code> behave like the left log and <code>onMouseEnter</code>/<code>onMouseLeave</code> like the right; for a simple hover colour either pair works.',
    html:`
<div class="stage" style="text-align:center">
  <button id="btn" style="font-size:16px;padding:14px 26px;border-radius:8px;border:2px solid #3a9c9a;background:#fff;color:#2f6f8f;cursor:pointer">Submit <span id="kid" style="display:inline-block;padding:4px 8px;margin-left:8px;border-radius:6px;background:#ffcf6b;color:#123">a child span</span></button>
</div>
<div style="display:flex;gap:12px">
  <div style="flex:1;min-width:0"><h4>mouseover / mouseout</h4><pre class="readout" id="a" style="height:150px;overflow:auto;white-space:pre-wrap"></pre></div>
  <div style="flex:1;min-width:0"><h4>mouseenter / mouseleave</h4><pre class="readout" id="b" style="height:150px;overflow:auto;white-space:pre-wrap"></pre></div>
</div>
<div class="knobs"><button id="clear">clear the logs</button></div>
<script>
  var btn = document.getElementById('btn'), A = document.getElementById('a'), B = document.getElementById('b'), n = 0;
  function add(el, text) { n += 1; el.textContent += n + '  ' + text + '\\n'; el.scrollTop = el.scrollHeight; }
  function who(t) { return t.id === 'kid' ? 'the span' : 'the button'; }
  btn.addEventListener('mouseover', function (e) { add(A, 'mouseover, target: ' + who(e.target)); });
  btn.addEventListener('mouseout', function (e) { add(A, 'mouseout,  target: ' + who(e.target)); });
  btn.addEventListener('mouseenter', function () { add(B, 'mouseenter'); });
  btn.addEventListener('mouseleave', function () { add(B, 'mouseleave'); });
  btn.addEventListener('click', function () { add(A, 'click'); add(B, 'click'); });
  document.getElementById('clear').onclick = function () { A.textContent = ''; B.textContent = ''; n = 0; };
<\/script>`,
  }],
  quiz:[
    { q:'What is the JSX name for the HTML attribute <code>onmouseover</code>?', options:['onmouseover','onMouseOver','on-mouse-over','mouseOver'], answer:1, why:'JSX props are camelCase versions of the HTML attribute names.' },
    { q:'With <code>&lt;button onClick={handleClick()}&gt;</code>, when does handleClick run?', options:['When the button is clicked','While the component renders, and not on click','Never','On hover'], answer:1, why:'The brackets call it straight away and pass its return value as the handler. Write onClick={handleClick}.' },
    { q:'Why does the hover effect also need <code>onMouseOut</code>?', options:['onMouseOver only works once','Nothing would set isMouseOver back to false, so the button would stay black','React needs events in pairs','To cancel the click'], answer:1, why:'One event switches the state on, the other switches it off.' },
    { q:'When is <code>isMouseOver ? "black" : "white"</code> worked out?', options:['Once, when the file loads','On every render, which each setMouseOver call triggers','Only on click','When the CSS loads'], answer:1, why:'The JSX, including the style object, is evaluated again on every render with the latest state.' },
  ],
});

/* ---------- 310 ---------- */

PG.add({
  id:'l310', index:310, udemyId:17039540, minutes:14, section:'s36', slug:'react-forms', kind:'react',
  title:'React Forms',
  blurb:'Read what the user types with <code>onChange</code> and <code>event.target.value</code>, keep it in state, and feed it back with <code>value={name}</code> so the input is <b>controlled</b>: state is the single source of truth. Submitting a form normally reloads the page and wipes your state; handle <code>onSubmit</code> and call <code>event.preventDefault()</code> to stop that.',
  tasks:[
    'Give the input <code>onChange={handleChange}</code> and log <code>event.target.value</code> inside handleChange. Type and watch the console: one line per keystroke.',
    'Store the text: import <code>useState</code>, create <code>const [name, setName] = useState("");</code>, call <code>setName(event.target.value)</code> and change the heading to <code>Hello {name}</code>. It updates as you type.',
    'Make the input controlled by adding <code>value={name}</code>, so what the box shows always comes from state.',
    'Change the heading only on Submit: add <code>const [headingText, setHeadingText] = useState("");</code>, show <code>{headingText}</code> in the h1 instead of <code>name</code>, and give the button <code>onClick={handleClick}</code> where handleClick calls <code>setHeadingText(name)</code> (the plain variable, not <code>{ name }</code>).',
    'Wrap the input and the button in a <code>&lt;form&gt;</code> and give the button <code>type="submit"</code>. Click Submit: the heading flashes, then the preview reloads and your state is gone.',
    'Move the handler to the form: <code>&lt;form onSubmit={handleClick}&gt;</code>, take <code>event</code> as a parameter and call <code>event.preventDefault()</code>. No more reload, and pressing Enter in the box now submits as well.'
  ],
  files:{
'components/App.jsx':`import React from "react";
// TODO 2: import { useState } from "react"

function App() {
  // TODO 2: name state, starting as ""
  // TODO 4: headingText state, starting as ""

  function handleChange(event) {
    // TODO 1: console.log(event.target.value)
  }

  return (
    <div className="container">
      <h1>Hello</h1>
      <input type="text" placeholder="What's your name?" />
      <button>Submit</button>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [headingText, setHeadingText] = useState("");

  function handleChange(event) {
    setName(event.target.value); // runs on every keystroke
  }

  function handleClick(event) {
    setHeadingText(name);   // copy the typed text into the heading
    event.preventDefault(); // stop the browser's submit-and-reload
  }

  return (
    <div className="container">
      <h1>Hello {headingText}</h1>
      <form onSubmit={handleClick}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="What's your name?"
          value={name}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'Why value={name} matters', height:300,
    note:'Type a name in both boxes, then press <b>Clear</b> in each. Both states go back to an empty string, but only the controlled input follows, because its value comes from state. The uncontrolled box keeps your text, so the screen and the state now disagree.',
    html:`
<div id="root"></div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement;
  var inputStyle = { display: 'block', width: '100%', padding: '7px 9px', font: 'inherit', fontSize: '14px', border: '1px solid #cfd5e6', borderRadius: '6px', marginBottom: '8px' };
  function Field(props) {
    var pair = React.useState(''), name = pair[0], setName = pair[1];
    var input = { type: 'text', placeholder: 'type a name', style: inputStyle, onChange: function (e) { setName(e.target.value); } };
    if (props.controlled) input.value = name;
    return h('div', { className: 'stage', style: { flex: '1 1 230px', margin: 0 } },
      h('h4', null, props.controlled ? 'controlled: value={name}' : 'uncontrolled: no value prop'),
      h('input', input),
      h('button', { onClick: function () { setName(''); } }, 'Clear: setName("")'),
      h('pre', { className: 'readout', style: { margin: '10px 0 0' } }, 'name = ' + JSON.stringify(name)));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } }, h(Field, { controlled: true }), h(Field, { controlled: false })));
<\/script>`,
  }],
  quiz:[
    { q:'Inside an <code>onChange</code> handler, what is <code>event.target.value</code>?', options:['The input’s placeholder','The text currently in the input','The text before the last keystroke','The input’s name attribute'], answer:1, why:'event.target is the element that fired the event; its value is what the box holds right now.' },
    { q:'What makes an input <b>controlled</b>?', options:['It has a placeholder','Its value comes from state, and onChange writes every change back to state','It sits inside a form','It has an id'], answer:1, why:'State becomes the single source of truth for what the box shows.' },
    { q:'What does <code>event.preventDefault()</code> stop inside <code>onSubmit</code>?', options:['React re-rendering','The browser submitting the form and reloading the page','The input changing','Other handlers running'], answer:1, why:'A reload throws away all React state, which is why the heading flashed and then went blank.' },
    { q:'What does <code>setHeadingText({ name })</code> store?', options:['The typed text','An object such as { name: "Ada" }','Nothing','An error'], answer:1, why:'Braces inside the call build an object using the shorthand for name: name. Pass the variable on its own.' },
  ],
});

/* ---------- 311 ---------- */

PG.add({
  id:'l311', index:311, udemyId:17039546, minutes:6, section:'s36', slug:'class-vs-function-components', kind:'read',
  title:'Class Components vs. Functional Components',
  blurb:'Before hooks, state needed a class: <code>class App extends React.Component</code> with a <code>render()</code> method, <code>this.state</code> set in the constructor and changed with <code>this.setState</code>. A function component with <code>useState</code> does the same job with less code. You will still meet classes in older projects, so it pays to recognise them.',
  body:`<p>The same counter written both ways. Read them side by side: each piece of the class has a shorter partner in the function.</p>
<div style="display:flex;gap:16px;flex-wrap:wrap">
<div style="flex:1 1 340px;min-width:0">
<h3>Class component</h3>
<pre data-lang="jsx">import React from "react";

class Counter extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
    this.increase = this.increase.bind(this);
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      &lt;div&gt;
        &lt;h1&gt;{this.state.count}&lt;/h1&gt;
        &lt;button onClick={this.increase}&gt;+&lt;/button&gt;
      &lt;/div&gt;
    );
  }
}

export default Counter;</pre>
</div>
<div style="flex:1 1 340px;min-width:0">
<h3>Function component with a hook</h3>
<pre data-lang="jsx">import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    &lt;div&gt;
      &lt;h1&gt;{count}&lt;/h1&gt;
      &lt;button onClick={increase}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default Counter;</pre>
</div>
</div>
<h3>Piece by piece</h3>
<table>
<tr><th>Class</th><th>Function with a hook</th></tr>
<tr><td><code>class Counter extends React.Component</code></td><td><code>function Counter()</code></td></tr>
<tr><td><code>this.state = { count: 0 }</code> in the constructor</td><td><code>const [count, setCount] = useState(0)</code></td></tr>
<tr><td><code>this.state.count</code></td><td><code>count</code></td></tr>
<tr><td><code>this.setState({ count: … })</code>, which merges the keys you pass into the state object</td><td><code>setCount(…)</code>, which replaces the value</td></tr>
<tr><td><code>this.increase = this.increase.bind(this)</code>, so that <code>this</code> still means the component when the button calls the method</td><td>nothing: a plain function has no <code>this</code> to lose</td></tr>
<tr><td><code>render() { return …; }</code></td><td>the <code>return</code> of the function itself</td></tr>
</table>
<h3>What to take away</h3>
<ul>
<li>Hooks only work in function components. A class cannot call <code>useState</code>.</li>
<li>Both kinds can live in the same app and render each other: <code>&lt;Counter /&gt;</code> looks the same either way.</li>
<li>Write new components as functions. Read classes when you meet them in older code and tutorials.</li>
</ul>`,
  quiz:[
    { q:'In a class component, where does the JSX go?', options:['In the constructor','In the render() method, which returns it','In this.state','Straight after the class keyword'], answer:1, why:'React calls render() each time the class component needs to draw itself.' },
    { q:'Which line does the job of <code>this.setState({ count: this.state.count + 1 })</code> in a function component?', options:['count++','setCount(count + 1)','this.count = count + 1','useState(count + 1)'], answer:1, why:'The setter from useState replaces the stored value and triggers a re-render.' },
    { q:'Why does the class bind <code>increase</code> in its constructor?', options:['To make it faster','So that this inside increase still points at the component when the button calls it','Because classes cannot have methods','To export it'], answer:1, why:'A method passed as a click handler loses its this unless it is bound.' },
  ],
});

/* ---------- 312 ---------- */

PG.add({
  id:'l312', index:312, udemyId:17039564, minutes:20, section:'s36', slug:'changing-complex-state', kind:'react',
  title:'Changing Complex State',
  blurb:'Related values can share one state object, such as <code>{ fName, lName }</code>. The catch: the setter replaces the whole object, so updating one key drops the other. The fix is the updater form, <code>setFullName(prevValue =&gt; …)</code>, which returns a complete new object built from the previous one. One handler serves every input by reading <code>event.target.name</code>.',
  tasks:[
    'First version: two pieces of state, <code>fName</code> and <code>lName</code> (both <code>useState("")</code>), two handlers that call the right setter, <code>value</code> on each input, and both names after Hello in the h1.',
    'Second version: replace them with one object, <code>const [fullName, setFullName] = useState({ fName: "", lName: "" });</code>. Give the inputs <code>name="fName"</code> and <code>name="lName"</code>, values <code>fullName.fName</code> and <code>fullName.lName</code>, and one shared <code>onChange={handleChange}</code>.',
    'Add <code>&lt;pre className="debug"&gt;{JSON.stringify(fullName)}&lt;/pre&gt;</code> under the form to watch the state while you work (your stand-in for React DevTools).',
    'Write the naive handler: read <code>event.target.value</code> and <code>event.target.name</code>, then call <code>setFullName({ fName: newValue })</code> or <code>setFullName({ lName: newValue })</code>. Type in both boxes and watch each one wipe the other.',
    'Fix it with the updater form: <code>setFullName(prevValue =&gt; { … })</code>, returning <code>{ fName: value, lName: prevValue.lName }</code> for the first name and <code>{ fName: prevValue.fName, lName: value }</code> for the last.',
    'Tidy up: start handleChange with <code>const { value, name } = event.target;</code> and use only those two variables inside the updater, never <code>event</code> itself. Remove the debug line.'
  ],
  files:{
'components/App.jsx':`import React from "react";
// TODO: import { useState } from "react"

function App() {
  // TODO 1: state for the first and last name (start with two useState("") calls)

  return (
    <div className="container">
      <h1>Hello</h1>
      <form>
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";

function App() {
  const [fullName, setFullName] = useState({
    fName: "",
    lName: ""
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setFullName(prevValue => {
      if (name === "fName") {
        return {
          fName: value,
          lName: prevValue.lName
        };
      } else if (name === "lName") {
        return {
          fName: prevValue.fName,
          lName: value
        };
      }
    });
  }

  return (
    <div className="container">
      <h1>
        Hello {fullName.fName} {fullName.lName}
      </h1>
      <form>
        <input
          name="fName"
          onChange={handleChange}
          value={fullName.fName}
          placeholder="First Name"
        />
        <input
          name="lName"
          onChange={handleChange}
          value={fullName.lName}
          placeholder="Last Name"
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'Replace versus keep', height:400,
    note:'Type a first name, then a last name. In <b>replace</b> mode each keystroke stores an object holding only the key you typed in, so the other key disappears from state (its box empties here because the demo draws a missing key as blank). In <b>prevValue</b> mode the updater copies the untouched key from the previous state.',
    html:`
<div class="knobs">
  <label>handleChange
    <select id="mode">
      <option value="keep">uses prevValue: keeps the other key</option>
      <option value="replace">sets only the changed key: replaces the object</option>
    </select>
  </label>
</div>
<pre class="readout" id="code"></pre>
<div class="stage" id="root"></div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement, mode = document.getElementById('mode');
  var CODE = {
    keep: 'setFullName(prevValue => {\\n  if (name === "fName") return { fName: value, lName: prevValue.lName };\\n  else return { fName: prevValue.fName, lName: value };\\n});',
    replace: 'if (name === "fName") setFullName({ fName: value });\\nelse setFullName({ lName: value });'
  };
  function showCode() { document.getElementById('code').textContent = CODE[mode.value]; }
  var inputStyle = { display: 'block', width: '100%', maxWidth: '320px', padding: '7px 9px', font: 'inherit', fontSize: '14px', border: '1px solid #cfd5e6', borderRadius: '6px', marginBottom: '8px' };
  function Form() {
    var pair = React.useState({ fName: '', lName: '' }), fullName = pair[0], setFullName = pair[1];
    function handleChange(event) {
      var name = event.target.name, value = event.target.value;
      if (mode.value === 'replace') {
        if (name === 'fName') setFullName({ fName: value }); else setFullName({ lName: value });
      } else {
        setFullName(function (prevValue) {
          if (name === 'fName') return { fName: value, lName: prevValue.lName };
          return { fName: prevValue.fName, lName: value };
        });
      }
    }
    return h('div', null,
      h('div', { style: { fontSize: '22px', marginBottom: '10px' } }, 'Hello ' + (fullName.fName || '') + ' ' + (fullName.lName || '')),
      h('input', { name: 'fName', placeholder: 'First Name', style: inputStyle, value: fullName.fName || '', onChange: handleChange }),
      h('input', { name: 'lName', placeholder: 'Last Name', style: inputStyle, value: fullName.lName || '', onChange: handleChange }),
      h('pre', { className: 'readout', style: { margin: '6px 0 0' } }, 'state: ' + JSON.stringify(fullName)));
  }
  mode.addEventListener('change', showCode);
  showCode();
  ReactDOM.createRoot(document.getElementById('root')).render(h(Form));
<\/script>`,
  }],
  quiz:[
    { q:'Why does <code>setFullName({ fName: value })</code> erase the last name?', options:['fName and lName cannot be set together','The setter replaces the whole object with the one you pass, and that object has no lName','React clears inputs after each keystroke','The input has no name attribute'], answer:1, why:'The useState setter does not merge objects; whatever you pass becomes the entire new state.' },
    { q:'In <code>setFullName(prevValue =&gt; …)</code>, what is <code>prevValue</code>?', options:['The previous keystroke','The latest state React has stored','The input element','The initial value only'], answer:1, why:'React calls your function with the current state, so you can copy what should stay.' },
    { q:'Why do the inputs get <code>name</code> attributes?', options:['For styling','So one shared handler can tell which field fired, via event.target.name','Because forms require them','To set the placeholder'], answer:1, why:'The names match the keys in the state object, so the handler knows which key to update.' },
    { q:'Why read <code>event.target</code> into variables before calling the setter?', options:['It makes the code shorter','The updater may run later; taking the values first keeps the handler safe (older React even reused event objects)','Destructuring is required by React','event cannot be used in functions'], answer:1, why:'Grab what you need from the event at the top of the handler, then only use those plain values inside the updater.' },
  ],
});

/* ---------- 313 ---------- */

const CONTACT_FORM_JSX = `  return (
    <div className="container">
      <h1>
        Hello {contact.fName} {contact.lName}
      </h1>
      <p>{contact.email}</p>
      <form>
        <input
          name="fName"
          onChange={handleChange}
          value={contact.fName}
          placeholder="First Name"
        />
        <input
          name="lName"
          onChange={handleChange}
          value={contact.lName}
          placeholder="Last Name"
        />
        <input
          name="email"
          onChange={handleChange}
          value={contact.email}
          placeholder="Email"
        />
        <button>Submit</button>
      </form>
`;

const CONTACT_LONG_HANDLER = `  function handleChange(event) {
    const { name, value } = event.target;

    setContact(prevValue => {
      if (name === "fName") {
        return {
          fName: value,
          lName: prevValue.lName,
          email: prevValue.email
        };
      } else if (name === "lName") {
        return {
          fName: prevValue.fName,
          lName: value,
          email: prevValue.email
        };
      } else if (name === "email") {
        return {
          fName: prevValue.fName,
          lName: prevValue.lName,
          email: value
        };
      }
    });
  }
`;

const CONTACT_STATE = `import React, { useState } from "react";

function App() {
  const [contact, setContact] = useState({
    fName: "",
    lName: "",
    email: ""
  });

`;

PG.add({
  id:'l313', index:313, udemyId:17039566, minutes:7, section:'s36', slug:'changing-complex-state-practice', kind:'react',
  title:'Changing Complex State Practice',
  blurb:'Practice: a contact form whose state is one object with three fields. A single <code>handleChange</code> reads the input’s <code>name</code> and <code>value</code> and returns a complete new object in which only that field has changed. The long if/else version is deliberate; the next lecture shrinks it.',
  tasks:[
    'Give all three inputs <code>onChange={handleChange}</code> and a <code>name</code> that matches a key in the state: <code>fName</code>, <code>lName</code>, <code>email</code>.',
    'Write <code>handleChange(event)</code> and start it with <code>const { name, value } = event.target;</code>.',
    'Call <code>setContact(prevValue =&gt; { … })</code>. For each name, return a complete object: the new value for the field that changed and the other two copied from <code>prevValue</code>.',
    'Make the inputs controlled with <code>value={contact.fName}</code>, <code>value={contact.lName}</code> and <code>value={contact.email}</code>.',
    'Show <code>Hello {contact.fName} {contact.lName}</code> in the h1 and <code>{contact.email}</code> in the paragraph.',
    'Check it: add <code>&lt;pre className="debug"&gt;{JSON.stringify(contact)}&lt;/pre&gt;</code> under the form and type in each box; only one key should change at a time. Then leave a key out of one branch and watch that field vanish.'
  ],
  files:{
'components/App.jsx':CONTACT_STATE + `  // TODO 2-3: handleChange(event) that updates only the field that changed

  return (
    <div className="container">
      {/* TODO 5: greet with the first and last name; show the email below */}
      <h1>Hello</h1>
      <p></p>
      <form>
        {/* TODO 1 and 4: onChange, name and value on each input */}
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <input placeholder="Email" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_FORM,
  },
  solution:{
'components/App.jsx':CONTACT_STATE + CONTACT_LONG_HANDLER + `
` + CONTACT_FORM_JSX + `    </div>
  );
}

export default App;
`,
  },
  quiz:[
    { q:'Why must every branch return all three keys?', options:['React sorts the keys','The setter replaces the whole object, so any key you leave out is lost','Objects need at least three keys','It is faster'], answer:1, why:'useState setters swap the old value for the new one; they never merge.' },
    { q:'The email input has <code>name="Email"</code> but the code checks <code>name === "email"</code>. What happens when you type in it?', options:['It works anyway','No branch matches, the updater returns undefined, the whole state becomes undefined and the page breaks','Only the email updates','React fixes the capital letter'], answer:1, why:'Names are compared exactly. With no matching branch the function returns nothing, and that nothing becomes the new state.' },
    { q:'What does the <code>name</code> attribute do for <code>handleChange</code>?', options:['Styles the input','Tells the shared handler which field fired','Sets the placeholder','Submits the form'], answer:1, why:'event.target.name says which input changed, and it doubles as the key to update.' },
  ],
});

/* ---------- 314 ---------- */

PG.add({
  id:'l314', index:314, udemyId:17039574, minutes:11, section:'s36', slug:'spread-operator', kind:'react',
  title:'Javascript ES6 Spread Operator',
  blurb:'The spread operator <code>...</code> pours an array’s items into a new array, or copies an object’s key–value pairs into a new object. Combined with a computed key, <code>[name]: value</code>, it turns the long if/else updater into one line: <code>{ ...prevValue, [name]: value }</code>.',
  tasks:[
    'In <code>spread.js</code>, put the citrus fruits between Apple and Banana with <code>...citrus</code>. Move it to the start, then to the end: position matters.',
    'Spread <code>fullName</code> into <code>user</code> so the console shows one flat object with four keys. Then try <code>fullName,</code> without the dots: you get a nested object instead.',
    'In <code>components/App.jsx</code>, replace the whole if/else in handleChange with <code>return { ...prevValue, name: value };</code>. Type in a box and watch the debug line: a new key literally called <code>name</code> appears, and the real field never changes.',
    'Fix it with a computed key, <code>[name]: value</code>. The square brackets use the variable’s value ("fName", "lName" or "email") as the key, and because it comes after the spread it overwrites the copied value.',
    'Optional: shorten it to <code>setContact(prevValue =&gt; ({ ...prevValue, [name]: value }));</code>. The round brackets around the object are required. Keep whichever version you find easier to read.'
  ],
  files:{
'spread.js':`const citrus = ["Lime", "Lemon", "Orange"];

// TODO 1: put the three citrus fruits between "Apple" and "Banana" with ...citrus
const fruits = ["Apple", "Banana", "Coconut"];
console.log(fruits.join(", "));

const fullName = {
  fName: "Ada",
  lName: "Lovelace"
};

// TODO 2: copy fName and lName into user (at the top level) with ...fullName
const user = {
  id: 1,
  username: "ada1815"
};
console.log(user);
`,
'components/App.jsx':CONTACT_STATE + CONTACT_LONG_HANDLER.replace('    setContact(prevValue => {', '    // TODO 3-4: replace the whole if/else with one object made from\n    //           ...prevValue plus the field that changed\n    setContact(prevValue => {') + `
` + CONTACT_FORM_JSX + `      {/* a live view of the state while you work */}
      <pre className="debug">{JSON.stringify(contact)}</pre>
    </div>
  );
}

export default App;
`,
'index.jsx':`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./spread"; // the array and object experiments; output in the console below

createRoot(document.getElementById("root")).render(<App />);
`,
'styles.css':CSS_FORM,
  },
  solution:{
'spread.js':`const citrus = ["Lime", "Lemon", "Orange"];

const fruits = ["Apple", ...citrus, "Banana", "Coconut"];
console.log(fruits.join(", ")); // Apple, Lime, Lemon, Orange, Banana, Coconut

const fullName = {
  fName: "Ada",
  lName: "Lovelace"
};

const user = {
  ...fullName,
  id: 1,
  username: "ada1815"
};
console.log(user); // one flat object: fName, lName, id, username

const nested = { fullName, id: 1 }; // no dots: the whole object sits under one key
console.log(nested);
`,
'components/App.jsx':CONTACT_STATE + `  function handleChange(event) {
    const { name, value } = event.target;

    setContact(prevValue => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

` + CONTACT_FORM_JSX + `      {/* a live view of the state while you work */}
      <pre className="debug">{JSON.stringify(contact)}</pre>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'Spread playground', height:440,
    note:'Pick an example or edit the expression; it is evaluated with the variables shown at the top. Watch where the spread items land, the difference between <code>name:</code> and <code>[name]:</code>, and what happens when the spread comes last.',
    html:`
<div class="knobs"><label>example <select id="pick" style="max-width:440px"></select></label></div>
<pre class="readout" id="vars" style="font-size:11.5px;color:#aab4cf"></pre>
<div class="stage"><input id="expr" spellcheck="false" style="width:100%;font:13px ui-monospace,Menlo,monospace;padding:6px 8px;border:1px solid #cfd5e6;border-radius:6px"></div>
<pre class="readout" id="out"></pre>
<p class="note" id="why"></p>
<script>
  var VARS = {
    citrus: ['Lime', 'Lemon', 'Orange'],
    fullName: { fName: 'Ada', lName: 'Lovelace' },
    prevValue: { fName: 'Ada', lName: 'Lovelace', email: '' },
    name: 'email',
    value: 'ada@example.com'
  };
  var EX = [
    ['["Apple", ...citrus, "Banana"]', 'The three citrus items are poured in where the dots are.'],
    ['[...citrus, "Apple"]', 'Position matters: now they come first.'],
    ['["Apple", citrus, "Banana"]', 'Without the dots the whole array goes in as one nested item.'],
    ['{ ...fullName, id: 1, username: "ada1815" }', 'Every key–value pair of fullName is copied in: one flat object with four keys.'],
    ['{ fullName, id: 1 }', 'Without the dots, fullName becomes a single key holding the whole object.'],
    ['{ ...prevValue, name: value }', 'Mistake: a plain word before a colon is a literal key, so a new key called name appears and email stays empty.'],
    ['{ ...prevValue, [name]: value }', 'Square brackets make a computed key: the value of name ("email") is used, and it overwrites the copied email.'],
    ['{ [name]: value, ...prevValue }', 'Order matters: later keys win, so the old email copied by the spread overwrites the new one.']
  ];
  var pick = document.getElementById('pick'), expr = document.getElementById('expr'),
      out = document.getElementById('out'), why = document.getElementById('why');
  function show(v) {
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return '"' + v + '"';
    if (Array.isArray(v)) return '[' + v.map(show).join(', ') + ']';
    if (v && typeof v === 'object') return '{ ' + Object.keys(v).map(function (k) { return k + ': ' + show(v[k]); }).join(', ') + ' }';
    return String(v);
  }
  document.getElementById('vars').textContent = Object.keys(VARS).map(function (k) { return k + ' = ' + show(VARS[k]); }).join('\\n');
  EX.forEach(function (e, i) { var o = document.createElement('option'); o.value = i; o.textContent = e[0]; pick.appendChild(o); });
  function run() {
    var vars = JSON.parse(JSON.stringify(VARS)), keys = Object.keys(vars);
    try {
      var fn = Function.apply(null, keys.concat('"use strict"; return (' + expr.value + ');'));
      out.textContent = 'result: ' + show(fn.apply(null, keys.map(function (k) { return vars[k]; })));
    } catch (e) {
      out.textContent = e.name + ': ' + e.message;
    }
  }
  pick.addEventListener('change', function () { expr.value = EX[pick.value][0]; why.textContent = EX[pick.value][1]; run(); });
  expr.addEventListener('input', function () { why.textContent = ''; run(); });
  pick.dispatchEvent(new Event('change'));
<\/script>`,
  }],
  quiz:[
    { q:'With <code>citrus = ["Lime", "Lemon"]</code>, what is <code>["Apple", ...citrus]</code>?', options:['["Apple", ["Lime", "Lemon"]]','["Apple", "Lime", "Lemon"]','["Lime", "Lemon", "Apple"]','"Apple,Lime,Lemon"'], answer:1, why:'Spread pours the items in at that position, giving one flat array.' },
    { q:'What does <code>{ ...prevValue, name: value }</code> create?', options:['An update to whichever field name refers to','A new key literally called "name"','An error','A copy without changes'], answer:1, why:'Before a colon a plain word is the key itself. Use [name] to use the variable’s value.' },
    { q:'What is wrong with <code>{ [name]: value, ...prevValue }</code>?', options:['Nothing','The spread comes last, so the old value overwrites the new one','Computed keys must come last','It creates an array'], answer:1, why:'When a key appears twice, the later one wins: put the change after the spread.' },
    { q:'Why does <code>prevValue =&gt; ({ ...prevValue, [name]: value })</code> need the round brackets?', options:['Spread only works in brackets','Without them the braces would be read as the function body','To make a copy','They are optional'], answer:1, why:'A { right after =&gt; starts a body; the brackets turn it into an object expression that is returned.' },
  ],
});

/* ---------- 315 ---------- */

PG.add({
  id:'l315', index:315, udemyId:17039594, minutes:12, section:'s36', slug:'spread-practice-todo-list', kind:'react',
  title:'Javascript ES6 Spread Operator Practice',
  blurb:'A to-do list that pulls together everything so far: a controlled input kept in state, an array of items in state, <code>[...prevItems, inputText]</code> to add an item without changing the old array, and <code>map</code> to draw the list.',
  tasks:[
    'Create <code>const [inputText, setInputText] = useState("");</code> and wire it to the input: <code>value={inputText}</code> plus an <code>onChange</code> handler that stores <code>event.target.value</code>.',
    'Create <code>const [items, setItems] = useState([]);</code>. An empty array means the list starts empty.',
    'Replace the sample <code>&lt;li&gt;</code> with <code>{items.map(…)}</code>, one <code>&lt;li&gt;</code> per item. Give each a <code>key</code>; the index will do for now: <code>(todoItem, index) =&gt; &lt;li key={index}&gt;…</code>.',
    'Give the Add button <code>onClick={addItem}</code>. In addItem call <code>setItems(prevItems =&gt; { return [...prevItems, inputText]; });</code>: a new array, never <code>push</code>.',
    'After adding, empty the box with <code>setInputText("")</code>.',
    'Bonus: ignore the click when the box is empty or holds only spaces.'
  ],
  files:{
'components/App.jsx':`import React from "react";

// CHALLENGE: make this app work.
// 1. When text is typed into the input, save it in state.
// 2. When Add is pressed, add the current text to an array kept in state.
// 3. Show every item in that array as an <li> inside the <ul>.

function App() {
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input type="text" />
        <button>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          <li>A list item</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_TODO,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function addItem() {
    if (inputText.trim() === "") return; // bonus: nothing to add

    setItems(prevItems => {
      return [...prevItems, inputText];
    });
    setInputText("");
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input type="text" onChange={handleChange} value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {items.map((todoItem, index) => (
            <li key={index}>{todoItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
`,
  },
  explore:[{
    title:'push versus spread', height:340,
    note:'<b>Add with push</b> changes the array React already holds and hands the very same array back to the setter. React compares old and new with <code>Object.is</code>, sees no change and skips the render, so memory and screen now disagree. <b>Add with spread</b> builds a new array: React re-renders, and the items you pushed earlier suddenly show up too.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 260px;margin:0"><h4>on screen (what React rendered)</h4><div id="root"></div></div>
  <div class="stage" style="flex:1 1 200px;margin:0"><h4>the items array in memory</h4><pre class="readout" id="mem" style="margin:0;white-space:pre-wrap"></pre></div>
</div>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement, live = { items: [] }, n = 0;
  function paint() { document.getElementById('mem').textContent = JSON.stringify(live.items, null, 1); }
  function List() {
    var pair = React.useState([]), items = pair[0], setItems = pair[1];
    live.items = items;
    React.useEffect(paint);
    function addPush() { n += 1; items.push('item ' + n); setItems(items); paint(); }
    function addSpread() { n += 1; var text = 'item ' + n; setItems(function (prev) { return [...prev, text]; }); }
    return h('div', null,
      h('button', { onClick: addPush }, 'Add with items.push(…)'), ' ',
      h('button', { onClick: addSpread }, 'Add with [...prev, text]'), ' ',
      h('button', { onClick: function () { n = 0; setItems([]); } }, 'reset'),
      items.length
        ? h('ul', { style: { margin: '10px 0 0', paddingLeft: '20px' } }, items.map(function (t, i) { return h('li', { key: i }, t); }))
        : h('p', { className: 'note', style: { margin: '10px 0 0' } }, '(the list is empty)'));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(List));
<\/script>`,
  }],
  quiz:[
    { q:'Why <code>[...prevItems, inputText]</code> rather than <code>prevItems.push(inputText)</code>?', options:['push is slower','push changes the existing array, so React gets the same array back and may skip the re-render (and push returns a number, not the array)','push only works with strings','Spread sorts the items'], answer:1, why:'State should be replaced with a new value, never changed in place.' },
    { q:'What empties the text box after an item is added?', options:['React clears inputs on every click','setInputText(""): the box shows whatever inputText holds, thanks to value={inputText}','event.preventDefault()','Removing onChange'], answer:1, why:'A controlled input always displays its state, so resetting the state resets the box.' },
    { q:'Why does <code>items</code> start as <code>useState([])</code>?', options:['So the list starts empty and map always has an array to work on','React only stores arrays','It turns the component into a hook','Strings cannot be stored in state'], answer:0, why:'map is an array method; starting with an empty array draws nothing without any special case.' },
  ],
});

/* ---------- 316 ---------- */

const TODO_ITEM_JSX = `import React from "react";

function ToDoItem(props) {
  return (
    <li
      onClick={() => {
        props.onChecked(props.id);
      }}
    >
      {props.text}
    </li>
  );
}

export default ToDoItem;
`;

const TODO_DELETE_FN = `  function deleteItem(id) {
    setItems(prevItems => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }
`;

const TODO_LIST_JSX = `      <div>
        <ul>
          {items.map((todoItem, index) => (
            <ToDoItem
              key={index}
              id={index}
              text={todoItem}
              onChecked={deleteItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
`;

const TODO_INPUT_STATE = `  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function addItem() {
    setItems(prevItems => {
      return [...prevItems, inputText];
    });
    setInputText("");
  }
`;

const TODO_FORM_JSX = `  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
`;

PG.add({
  id:'l316', index:316, udemyId:17039602, minutes:23, section:'s36', slug:'managing-a-component-tree', kind:'react',
  title:'Managing a Component Tree',
  blurb:'Split the to-do list into components: each row becomes a <code>ToDoItem</code>. Props are read-only, so a child that needs to change its parent’s data calls a function the parent passed down. Data flows down through props; events flow up through callbacks.',
  tasks:[
    'In <code>components/ToDoItem.jsx</code>, write a <code>ToDoItem</code> component that returns <code>&lt;li&gt;{props.text}&lt;/li&gt;</code>. In App, import it and render <code>&lt;ToDoItem key={index} text={todoItem} /&gt;</code> in the map. Nothing changes on screen.',
    'Challenge A: clicking an item crosses it out and a second click restores it. Give ToDoItem its own <code>isDone</code> state, toggle it on click with <code>setIsDone(prevValue =&gt; !prevValue)</code>, and use <code>style={{ textDecoration: isDone ? "line-through" : "none" }}</code>.',
    'Remove Challenge A. In App, write <code>deleteItem(id)</code> and pass it down with the position: <code>onChecked={deleteItem}</code> and <code>id={index}</code>.',
    'In ToDoItem, call it on click inside an arrow function: <code>onClick={() =&gt; { props.onChecked(props.id); }}</code>. (Try <code>onClick={props.onChecked(props.id)}</code> first: every item deletes itself the moment it renders.)',
    'Make deleteItem drop the clicked item: <code>setItems(prevItems =&gt; prevItems.filter((item, index) =&gt; index !== id))</code>. Add three items and delete the middle one.'
  ],
  files:{
'components/ToDoItem.jsx':`import React from "react";

// TODO 1: a ToDoItem component that returns <li>{props.text}</li>,
//         exported as the default export
`,
'components/App.jsx':`import React, { useState } from "react";
// TODO 1: import ToDoItem from "./ToDoItem"

function App() {
` + TODO_INPUT_STATE + `
  // TODO 3 and 5: deleteItem(id), which removes the item at position id

` + TODO_FORM_JSX + `      <div>
        <ul>
          {/* TODO 1: render a <ToDoItem /> here instead of the <li> */}
          {items.map((todoItem, index) => (
            <li key={index}>{todoItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
`,
'index.jsx':INDEX_JSX,
'styles.css':CSS_TODO,
  },
  solution:{
'components/ToDoItem.jsx':TODO_ITEM_JSX,
'components/App.jsx':`import React, { useState } from "react";
import ToDoItem from "./ToDoItem";

function App() {
` + TODO_INPUT_STATE + `
` + TODO_DELETE_FN + `
` + TODO_FORM_JSX + TODO_LIST_JSX,
  },
  notes:`<h3>li or div?</h3>
<p>The video wraps each <code>&lt;li&gt;</code> in a <code>&lt;div&gt;</code> to hang the click handler on. A <code>div</code> directly inside a <code>ul</code> is not valid HTML, so this lesson puts <code>onClick</code> on the <code>li</code> itself. It behaves the same.</p>
<h3>Index keys</h3>
<p>Using the position as both <code>key</code> and <code>id</code> is fine for this exercise. Once items can be deleted or reordered, positions shift, so real apps give each item a stable id when it is created (this playground bundles <code>uuid</code>: <code>import { v4 as uuidv4 } from "uuid"</code>).</p>`,
  explore:[{
    title:'Pass the function, do not call it', height:400,
    note:'Each list renders three items that get <code>onChecked</code> from their parent. On the left the brackets call <code>onChecked</code> while the list renders: three log lines appear at once, again on every re-render, and clicking does nothing because <code>onClick</code> received <code>undefined</code>. On the right an arrow function is handed over instead, so <code>onChecked</code> runs only when you click. In the to-do app the left version would delete every item the moment it appeared.',
    html:`
<div id="root"></div>
<pre class="readout" id="log" style="height:130px;overflow:auto;white-space:pre-wrap;margin-top:12px"></pre>
<script src="vendor/react/react.development.js"><\/script>
<script src="vendor/react/react-dom.development.js"><\/script>
<script>
  var h = React.createElement, logEl = document.getElementById('log');
  function log(t) { logEl.textContent += t + '\\n'; logEl.scrollTop = logEl.scrollHeight; }
  function checker(side) { return function (id) { log(side + ': onChecked(' + id + ') ran'); }; }
  var leftChecked = checker('left'), rightChecked = checker('right');
  function Item(props) {
    var handler = props.wrong ? props.onChecked(props.id) : function () { props.onChecked(props.id); };
    return h('li', { onClick: handler, style: { cursor: 'pointer', padding: '4px 0' } }, 'item ' + props.id + ' (click me)');
  }
  function list(wrong, fn) {
    return h('ul', { style: { margin: '6px 0 0', paddingLeft: '20px' } },
      [0, 1, 2].map(function (id) { return h(Item, { key: id, id: id, wrong: wrong, onChecked: fn }); }));
  }
  function Demo() {
    var pair = React.useState(1), renders = pair[0], setRenders = pair[1];
    return h('div', null,
      h('div', { className: 'knobs' },
        h('button', { onClick: function () { log('--- re-render ---'); setRenders(renders + 1); } }, 're-render both lists'),
        h('span', { className: 'note', style: { margin: 0 } }, 'renders so far: ' + renders)),
      h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } },
        h('div', { className: 'stage', style: { flex: '1 1 240px', margin: 0 } }, h('h4', null, 'onClick={props.onChecked(props.id)}'), list(true, leftChecked)),
        h('div', { className: 'stage', style: { flex: '1 1 240px', margin: 0 } }, h('h4', null, 'onClick={() => props.onChecked(props.id)}'), list(false, rightChecked))));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Demo));
<\/script>`,
  }],
  quiz:[
    { q:'Can <code>ToDoItem</code> change the props it receives?', options:['Yes, by assigning to props','No, props are read-only; a child that needs to change over time uses its own state','Only text props','Only inside useEffect'], answer:1, why:'Props belong to the parent. The child can read them, keep its own state, or call a function the parent gave it.' },
    { q:'How does a <code>ToDoItem</code> remove itself from the array in <code>App</code>?', options:['It deletes its own li from the DOM','It calls a function App passed down as a prop, giving its id','It edits the items array directly','It sets props.text to ""'], answer:1, why:'The array lives in App, so App does the removing; the child only reports which item was clicked.' },
    { q:'What is wrong with <code>onClick={props.onChecked(props.id)}</code>?', options:['Nothing','It runs onChecked while the item renders, and onClick gets its return value (undefined)','props.id is not available yet','onClick needs a string'], answer:1, why:'Wrap the call in an arrow function so it only runs on click.' },
    { q:'Which items does <code>prevItems.filter((item, index) =&gt; index !== id)</code> keep?', options:['Only the item at position id','Every item except the one at position id','None','The same array, changed in place'], answer:1, why:'filter keeps the items whose callback returns true and builds a new array from them.' },
  ],
});

/* ---------- 317 ---------- */

PG.add({
  id:'l317', index:317, udemyId:17039614, minutes:8, section:'s36', slug:'component-tree-practice', kind:'react',
  title:'Managing a Component Tree Practice',
  blurb:'The input and the Add button now live in their own <code>InputArea</code> component, and the app is broken. Decide where each piece of state belongs: the typed text only matters to <code>InputArea</code>, while the list matters to everyone and stays in <code>App</code>. The text travels up through an <code>onAdd</code> callback prop.',
  tasks:[
    'Move the typed-text state into InputArea: cut <code>inputText</code>, <code>setInputText</code> and <code>handleChange</code> out of App and paste them into the InputArea component. Add <code>import React, { useState } from "react";</code> there yourself; copied code does not bring its imports along.',
    'In App, pass the adding function down: <code>&lt;InputArea onAdd={addItem} /&gt;</code>.',
    'Change <code>addItem</code> so it is told what to add: <code>function addItem(inputText) { setItems(prevItems =&gt; [...prevItems, inputText]); }</code>. Drop its <code>setInputText("")</code>: App has no box to clear any more.',
    'In InputArea, accept <code>props</code> and make the button pass the text up and then clear the box: <code>onClick={() =&gt; { props.onAdd(inputText); setInputText(""); }}</code>.',
    'Remove anything App no longer uses, then test: add a few items and click one to delete it. (ToDoItem.jsx stays as it is.)'
  ],
  files:{
'components/App.jsx':`import React, { useState } from "react";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";

// CHALLENGE: the <input> and <button> now live in their own InputArea
// component. Make the app work exactly as it did before.
// DO NOT edit ToDoItem.jsx, and DO NOT move the input or button back here.
// Hint 1: where should the input's state live now?
// Hint 2: how can InputArea hand the typed text to addItem() in App?

function App() {
` + TODO_INPUT_STATE + `
` + TODO_DELETE_FN + `
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea />
` + TODO_LIST_JSX,
'components/InputArea.jsx':`import React from "react";

function InputArea() {
  return (
    <div className="form">
      <input onChange={handleChange} type="text" value={inputText} />
      <button onClick={addItem}>
        <span>Add</span>
      </button>
    </div>
  );
}

export default InputArea;
`,
'components/ToDoItem.jsx':TODO_ITEM_JSX,
'index.jsx':INDEX_JSX,
'styles.css':CSS_TODO,
  },
  solution:{
'components/App.jsx':`import React, { useState } from "react";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";

function App() {
  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems(prevItems => {
      return [...prevItems, inputText];
    });
  }

` + TODO_DELETE_FN + `
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea onAdd={addItem} />
` + TODO_LIST_JSX,
'components/InputArea.jsx':`import React, { useState } from "react";

function InputArea(props) {
  const [inputText, setInputText] = useState("");

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  return (
    <div className="form">
      <input onChange={handleChange} type="text" value={inputText} />
      <button
        onClick={() => {
          props.onAdd(inputText);
          setInputText("");
        }}
      >
        <span>Add</span>
      </button>
    </div>
  );
}

export default InputArea;
`,
  },
  quiz:[
    { q:'Where should the <code>inputText</code> state live after the split?', options:['In App, as before','In InputArea, because only it needs the text until Add is pressed','In ToDoItem','In a global variable'], answer:1, why:'Keep state in the lowest component that needs it; App only needs the finished text.' },
    { q:'Why does the <code>items</code> array stay in <code>App</code>?', options:['Arrays cannot live in child components','InputArea (adding) and the ToDoItems (showing and deleting) all depend on it, and App is their common parent','React requires it','It is faster'], answer:1, why:'Shared data goes to the nearest common parent, which passes it and its update functions down.' },
    { q:'Why is the button’s handler <code>() =&gt; { props.onAdd(inputText); … }</code> rather than <code>props.onAdd(inputText)</code>?', options:['Arrow functions are faster','The arrow lets you pass the text as an argument without calling onAdd during render','Because props are read-only','To clear the box first'], answer:1, why:'Writing props.onAdd(inputText) directly would run it while rendering. The arrow delays it until the click.' },
  ],
});

/* ---------- 318 ---------- */

const KEEPER_APP_DONE = `import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => (
        <Note
          key={index}
          id={index}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
`;

const KEEPER_NOTE_DONE = `import React from "react";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClick}>DELETE</button>
    </div>
  );
}

export default Note;
`;

const KEEPER_CREATE_HANDLERS = `  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault(); // a button inside a form submits it, which reloads the page

    if (note.title.trim() === "" && note.content.trim() === "") {
      return; // bonus: nothing to add
    }

    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
  }
`;

const KEEPER_CREATE_DONE = `import React, { useState } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

` + KEEPER_CREATE_HANDLERS + `
  return (
    <div>
      <form>
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
`;

PG.add({
  id:'l318', index:318, udemyId:17039626, minutes:25, section:'s36', slug:'keeper-app-part-3', kind:'react', project:true,
  title:'Keeper App Project - Part 3',
  blurb:'Keeper becomes interactive. <code>CreateArea</code> keeps the note being typed in its own state and hands the finished note up to <code>App</code>, which stores every note in an array and maps it to cards. Each card deletes itself by calling a function from <code>App</code> with its id.',
  tasks:[
    'In <code>components/CreateArea.jsx</code>, keep the note being typed in one state object: <code>const [note, setNote] = useState({ title: "", content: "" });</code>. Give the input <code>name="title"</code> and the textarea <code>name="content"</code>, bind their <code>value</code> to <code>note.title</code> and <code>note.content</code>, and point both <code>onChange</code> props at one <code>handleChange</code>.',
    'In handleChange, take <code>const { name, value } = event.target;</code> and update only that field: <code>setNote(prevNote =&gt; ({ ...prevNote, [name]: value }))</code>.',
    'Give the Add button <code>onClick={submitNote}</code> and call <code>event.preventDefault()</code> in submitNote: a button inside a form submits the form, which reloads the preview.',
    'In <code>components/App.jsx</code>, write <code>addNote(newNote)</code> and pass it down as <code>&lt;CreateArea onAdd={addNote} /&gt;</code>. In submitNote call <code>props.onAdd(note)</code>, and log <code>newNote</code> in addNote to check it arrives.',
    'Keep the notes in App: <code>const [notes, setNotes] = useState([]);</code>, append in addNote with <code>[...prevNotes, newNote]</code>, and replace the sample Note with <code>notes.map((noteItem, index) =&gt; …)</code>, passing <code>key={index}</code>, <code>id={index}</code>, <code>title</code> and <code>content</code>.',
    'Deleting: in <code>components/Note.jsx</code> the button calls <code>props.onDelete(props.id)</code> from a click handler. In App, <code>deleteNote(id)</code> keeps every note whose index is not <code>id</code> (use <code>filter</code>) and goes down as <code>onDelete={deleteNote}</code>.',
    'Clear the form after adding with <code>setNote({ title: "", content: "" })</code>. Bonus: ignore Add when both fields are empty.'
  ],
  files:{
'components/App.jsx':`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

// CHALLENGE
// 1. Adding notes
//    - keep track of the title and content in CreateArea's state
//    - pass the finished note back up to App
//    - add it to an array of notes kept in App's state
//    - render one <Note /> for every item in that array
// 2. Deleting notes
//    - the Note's button calls a function it received from App
//    - that function uses filter() to drop the note
//    - give each Note an id, which it hands back when deleting

function App() {
  return (
    <div>
      <Header />
      <CreateArea />
      <Note key={1} title="Note title" content="Note content" />
      <Footer />
    </div>
  );
}

export default App;
`,
'components/CreateArea.jsx':`import React from "react";

function CreateArea() {
  return (
    <div>
      <form>
        <input placeholder="Title" />
        <textarea placeholder="Take a note..." rows="3" />
        <button>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
`,
'components/Note.jsx':`import React from "react";

function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button>DELETE</button>
    </div>
  );
}

export default Note;
`,
'components/Header.jsx':KEEPER_HEADER_JSX,
'components/Footer.jsx':KEEPER_FOOTER_JSX,
'index.jsx':INDEX_JSX,
'styles.css':CSS_KEEPER_3,
  },
  solution:{
'components/App.jsx':KEEPER_APP_DONE,
'components/CreateArea.jsx':KEEPER_CREATE_DONE,
'components/Note.jsx':KEEPER_NOTE_DONE,
  },
  quiz:[
    { q:'Where should the list of notes live, and why?', options:['In CreateArea, because it creates the notes','In App, because CreateArea (adding) and every Note (deleting) need to change it','In each Note','In a notes.js file'], answer:1, why:'State that several components share goes to their nearest common parent.' },
    { q:'How does <code>CreateArea</code> hand a finished note to <code>App</code>?', options:['It exports the note','It calls props.onAdd(note), a function App passed down','It writes to a global variable','App reads CreateArea’s state directly'], answer:1, why:'Data goes up by calling a callback the parent provided.' },
    { q:'What happens if submitNote does not call <code>event.preventDefault()</code>?', options:['Nothing','The form submits, the page reloads and every note is lost','The note is added twice','React throws an error'], answer:1, why:'A button inside a form submits it by default, and a reload resets all state.' },
    { q:'<code>deleteNote</code> runs <code>prevNotes.filter((noteItem, index) =&gt; index !== id)</code>. What comes back?', options:['Only the deleted note','A new array with every note except the one at position id','The same array, changed in place','true or false'], answer:1, why:'filter builds a new array from the items whose callback returns true.' },
  ],
});

/* ---------- 319 ---------- */

PG.add({
  id:'l319', index:319, udemyId:42762294, minutes:0, section:'s36', slug:'mui-packages-note', kind:'read',
  title:'Note about the Next Lesson - Packages and Imports',
  blurb:'The next video installs the old Material UI v4 packages. Today the packages are <code>@mui/material</code> and <code>@mui/icons-material</code> (plus <code>@emotion/react</code> and <code>@emotion/styled</code>, the styling engine), and icons are imported from <code>@mui/icons-material/&lt;Name&gt;</code>. In this playground those imports already work: a handful of icons, <code>Fab</code> and <code>Zoom</code> are built in.',
  links:[
    { title:'Material UI: installation', url:'https://mui.com/material-ui/getting-started/installation/', note:'the packages to install with npm' },
    { title:'Material Icons search', url:'https://mui.com/material-ui/material-icons/', note:'find an icon and copy its import line' },
  ],
  quiz:[
    { q:'Which line imports the add icon with today’s package names?', options:['import AddIcon from "@material-ui/icons/Add";','import AddIcon from "@mui/icons-material/Add";','import { AddIcon } from "react";','import AddIcon from "mui/add";'], answer:1, why:'The @material-ui packages are the retired v4 names; current code imports from @mui/icons-material.' },
    { q:'Why are <code>@emotion/react</code> and <code>@emotion/styled</code> installed alongside MUI?', options:['They contain the icons','MUI v5 and later use Emotion as their styling engine','They replace React','They are only needed for tests'], answer:1, why:'Without them, MUI components fail with a missing-module error.' },
  ],
});

/* ---------- 320 ---------- */

const KEEPER4_BODY_START = `body {
  min-height: 100vh;
  padding: 0 16px 24px;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #3b3b3b;
  background-color: #f3f1ec;
  /* TODO 6: add a subtle background pattern with background-image */
}
`;

const KEEPER4_BODY_DONE = `body {
  min-height: 100vh;
  padding: 0 16px 24px;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #3b3b3b;
  background-color: #f3f1ec;
  /* a dot pattern drawn by CSS, laid over the background colour */
  background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 14px 14px;
}
`;

const KEEPER4_REST = KEEPER_MAIN + `
/* the create-note form: a white card in the middle of the page */
form.create-note {
  position: relative;
  width: 480px;
  max-width: 100%;
  margin: 30px auto 24px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

form.create-note input,
form.create-note textarea {
  display: block;
  width: 100%;
  padding: 4px;
  font: inherit;
  font-size: 1.1rem;
  border: none;
  outline: none;
  resize: none;
}

/* The round add button hangs off the bottom-right corner of the form.
   This rule covers both the plain <button> you start with and the Fab that
   replaces it: <Zoom> adds no wrapper of its own, it animates the Fab itself. */
form.create-note > button {
  position: absolute;
  right: 18px;
  bottom: -18px;
}

form.create-note > button {
  width: 36px;
  height: 36px;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: #f5ba13;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
` + KEEPER_DELETE + `
/* icons are SVGs drawn in the current text colour */
header h1 svg {
  vertical-align: -3px;
  margin-right: 8px;
}

.note button svg {
  display: block;
}
`;

PG.add({
  id:'l320', index:320, udemyId:17039638, minutes:17, section:'s36', slug:'keeper-styling-mui', kind:'react',
  title:'React Dependencies & Styling the Keeper App',
  blurb:'A component library hands you finished, styled React components. Keeper swaps its text buttons for Material UI icons, turns Add into a floating action button that zooms in, and only opens up the note form once you click it, using state, <code>&amp;&amp;</code> and a ternary.',
  tasks:[
    'In <code>components/Note.jsx</code>, import <code>DeleteIcon</code> from "@mui/icons-material/Delete" and put <code>&lt;DeleteIcon /&gt;</code> inside the button instead of the word DELETE.',
    'In <code>components/CreateArea.jsx</code>, import <code>AddIcon</code> from "@mui/icons-material/Add" and <code>{ Fab, Zoom }</code> from "@mui/material". Replace the Add button with <code>&lt;Fab onClick={submitNote}&gt;&lt;AddIcon /&gt;&lt;/Fab&gt;</code>.',
    'Wrap the Fab in <code>&lt;Zoom in={true}&gt;</code>, then try <code>in={false}</code>: the button shrinks away.',
    'In <code>components/Header.jsx</code>, import <code>HighlightIcon</code> from "@mui/icons-material/Highlight" and put <code>&lt;HighlightIcon /&gt;</code> inside the h1, before “Keeper”.',
    'Expanding form: add <code>const [isExpanded, setExpanded] = useState(false);</code> and an <code>expand()</code> that calls <code>setExpanded(true)</code>, attached to the textarea with <code>onClick={expand}</code>. Render the title input only when expanded (<code>{isExpanded &amp;&amp; …}</code>), set <code>rows={isExpanded ? 3 : 1}</code> and use <code>&lt;Zoom in={isExpanded}&gt;</code>.',
    'In <code>styles.css</code>, give the body a subtle pattern with <code>background-image</code>. The video uses a PNG from transparenttextures.com; a CSS gradient needs no download, for example <code>radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)</code> with <code>background-size: 14px 14px</code>.',
    'Add a couple of notes, then press <b>▶ Run</b>: they are gone. React keeps state in memory only; saving notes needs a back end and a database (or localStorage, for an app that lives only in the browser).'
  ],
  files:{
'components/CreateArea.jsx':`import React, { useState } from "react";
// TODO 2: import AddIcon, and Fab and Zoom from "@mui/material"

function CreateArea(props) {
  // TODO 5: isExpanded state, starting as false

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

` + KEEPER_CREATE_HANDLERS + `
  // TODO 5: expand(), which sets isExpanded to true

  return (
    <div>
      <form className="create-note">
        {/* TODO 5: show the title input only once the form is expanded */}
        <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        {/* TODO 5: onClick={expand}, and rows depending on isExpanded */}
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        {/* TODO 2-3: a Fab with an AddIcon inside, wrapped in <Zoom> */}
        <button onClick={submitNote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
`,
'components/Note.jsx':KEEPER_NOTE_DONE.replace('import React from "react";\n', 'import React from "react";\n// TODO 1: import DeleteIcon from "@mui/icons-material/Delete"\n'),
'components/Header.jsx':KEEPER_HEADER_JSX.replace('import React from "react";\n', 'import React from "react";\n// TODO 4: import HighlightIcon from "@mui/icons-material/Highlight"\n'),
'styles.css':KEEPER_RESET + KEEPER4_BODY_START + KEEPER4_REST,
'components/App.jsx':KEEPER_APP_DONE,
'components/Footer.jsx':KEEPER_FOOTER_JSX,
'index.jsx':INDEX_JSX,
  },
  solution:{
'components/CreateArea.jsx':`import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

` + KEEPER_CREATE_HANDLERS + `
  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
`,
'components/Note.jsx':`import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
`,
'components/Header.jsx':`import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";

function Header() {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
    </header>
  );
}

export default Header;
`,
'styles.css':KEEPER_RESET + KEEPER4_BODY_DONE + KEEPER4_REST,
  },
  notes:`<h3>Material UI in this playground</h3>
<p>The playground cannot install npm packages, so a few Material UI pieces are built in as light stand-ins: icons from <code>@mui/icons-material/&lt;Name&gt;</code> (Add, Delete, Edit, Check, Close, Favorite, Highlight, Note, Search, Menu, Star, Send, Save) and <code>Fab</code> and <code>Zoom</code> from <code>@mui/material</code>. You import them exactly as in a real project. Two differences: the stand-in <code>Zoom</code> adds no element of its own: like the real one, it scales the Fab itself, so styles.css positions the button directly. The stand-in <code>Fab</code> is a <code>&lt;button type="button"&gt;</code>, as in MUI, so clicking it does not submit the form by itself; the click handler still calls <code>event.preventDefault()</code> in case you swap in a plain button.</p>
<h3>On your own machine</h3>
<pre>npm install @mui/material @mui/icons-material @emotion/react @emotion/styled</pre>`,
  quiz:[
    { q:'Once imported, how do you use an MUI icon?', options:['As a CSS class name','As a component: &lt;DeleteIcon /&gt;','As an image src','With document.createElement'], answer:1, why:'Each icon is a React component that renders an SVG.' },
    { q:'What does <code>&lt;Zoom in={isExpanded}&gt;</code> do?', options:['Enlarges the whole page','Animates its child in when isExpanded is true and out when it is false','Zooms into the textarea','Nothing in React'], answer:1, why:'Zoom is a transition wrapper driven by the boolean in prop.' },
    { q:'Why do the notes vanish when the page reloads?', options:['MUI deletes them','They live only in React state, in memory; nothing saves them','The key prop resets them','Zoom hides them'], answer:1, why:'Persisting data needs storage: a back end with a database, or localStorage in the browser.' },
    { q:'Why must <code>Fab</code> start with a capital F in JSX?', options:['It is only a style rule','Lowercase tags are treated as HTML elements; capitalised names refer to components','MUI checks the spelling','It makes no difference'], answer:1, why:'&lt;fab&gt; would be an unknown HTML tag; &lt;Fab&gt; looks up the imported component.' },
  ],
});

/* ---------- 321 ---------- */

PG.add({
  id:'l321', index:321, udemyId:18113041, minutes:2, section:'s36', slug:'build-your-own-product', kind:'read',
  title:'Tip from Angela - How to Build Your Own Product',
  blurb:'Turning skills into your own product: write down every feature you dream of, keep only the one that makes the idea different, ship the smallest version people can actually use, and improve it from real users’ feedback.',
  quiz:[
    { q:'What should the first version of your own product be?', options:['Every feature you can think of, built at once','The smallest usable version, built around the one feature that sets it apart','A copy of a popular app','Nothing, until the design is perfect'], answer:1, why:'A small version that works gets into users’ hands early, and their feedback tells you what to build next.' },
  ],
});

})();
