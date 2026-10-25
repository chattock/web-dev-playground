/* ===== Section 36 — React.js ===== */

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
