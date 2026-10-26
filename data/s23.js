/* ===== Section 23 — Node.js ===== */

PG.add({
  id:'l192', index:192, udemyId:12384268, minutes:11, section:'s23', slug:'what-is-node', kind:'read',
  title:'What is Node.js?',
  blurb:'Node.js is neither a framework nor a language: it is a <b>runtime</b>, the program that lets JavaScript run outside a browser. It takes V8, the JavaScript engine inside Chrome, and wraps it so your code can run on any computer, including a server that has no browser at all. Node is <b>asynchronous and event-driven</b>: it starts slow jobs such as reading a file or querying a database, carries on with the next line, and runs your callback when each job finishes. That is how one Node server keeps up with many requests at once.',
  explore:[{
    title:'Waiting versus carrying on', height:420,
    note:'Three slow jobs and one ordinary line of code. Run them synchronously (each job blocks until it is done) and then asynchronously (start everything, handle each result when it arrives), and compare the total time and the order of the output.',
    html:`
<style>
  .lane{display:flex;align-items:center;gap:10px;margin:7px 0}
  .lane .lb{width:200px;font-size:12px;font-family:ui-monospace,Menlo,monospace}
  .lane .tr{flex:1;height:22px;background:#eef1f9;border-radius:6px;position:relative;overflow:hidden}
  .lane .bar{position:absolute;top:0;bottom:0;background:#5b9cff;border-radius:6px;width:0}
  .lane .bar.done{background:#7ee0a8}
</style>
<div class="knobs">
  <label>style
    <select id="mode">
      <option value="sync">synchronous: wait for each job to finish</option>
      <option value="async">asynchronous: start each job, handle it when it is done</option>
    </select>
  </label>
  <button id="go">▶ run</button>
</div>
<div class="stage">
  <div class="lane"><span class="lb">fs.readFile("big.txt")  1.2 s</span><div class="tr"><div class="bar" id="b0"></div></div></div>
  <div class="lane"><span class="lb">axios.get(someApi)      2.0 s</span><div class="tr"><div class="bar" id="b1"></div></div></div>
  <div class="lane"><span class="lb">db.query(sql)           0.8 s</span><div class="tr"><div class="bar" id="b2"></div></div></div>
  <div class="lane"><span class="lb">console.log("next line")</span><div class="tr"><div class="bar" id="b3"></div></div></div>
</div>
<pre class="readout" id="log">Press ▶ run.</pre>
<script>
(function(){
  var jobs = [{ n: 'file has been read', d: 1.2 }, { n: 'API has answered', d: 2.0 }, { n: 'query has returned', d: 0.8 }];
  var SCALE = 4.2, running = false;
  function el(i){ return document.getElementById(i); }
  function plan(mode){
    var t = 0, p = [];
    jobs.forEach(function(k, i){
      if (mode === 'sync') { p.push({ i: i, start: t, end: t + k.d, n: k.n }); t += k.d; }
      else p.push({ i: i, start: 0, end: k.d, n: k.n });
    });
    var at = mode === 'sync' ? t : 0;
    p.push({ i: 3, start: at, end: at + 0.05, n: 'next line ran' });
    return p;
  }
  function run(){
    if (running) return; running = true;
    var mode = el('mode').value, p = plan(mode), logged = {}, t0 = performance.now();
    for (var i = 0; i < 4; i++) { var b = el('b' + i); b.style.left = '0'; b.style.width = '0'; b.className = 'bar'; }
    el('log').textContent = '';
    var total = Math.max.apply(null, p.map(function(x){ return x.end; }));
    function frame(now){
      var t = (now - t0) / 1000;
      p.forEach(function(x){
        var b = el('b' + x.i);
        b.style.left = (x.start / SCALE * 100) + '%';
        b.style.width = (Math.max(0, Math.min(t, x.end) - x.start) / SCALE * 100) + '%';
        if (t >= x.end && !logged[x.i]) { logged[x.i] = 1; b.classList.add('done'); el('log').textContent += x.end.toFixed(1) + ' s   ' + x.n + '\\n'; }
      });
      if (t < total + 0.05) requestAnimationFrame(frame);
      else {
        el('log').textContent += '\\nall done after ' + total.toFixed(1) + ' s. ' + (mode === 'sync'
          ? 'Every line waited for the job before it, so the next line ran last.'
          : 'Node started all three jobs, ran the next line at once, and handled each result as it arrived.');
        running = false;
      }
    }
    requestAnimationFrame(frame);
  }
  el('go').addEventListener('click', run);
})();
<\/script>`
  }],
  quiz:[
    { q:'Which description of Node.js is accurate?', options:['A JavaScript framework','A runtime that runs JavaScript outside the browser, built on Chrome\'s V8 engine','A database','A web browser'], answer:1, why:'Express, met in the next section, is the framework. Node is what runs the JavaScript in the first place.' },
    { q:'What does asynchronous mean here?', options:['Code runs strictly top to bottom, each line waiting for the last','Slow work is started and the program carries on, running a callback when the work finishes','The code runs on several computers','It only works in browsers'], answer:1, why:'Non-blocking I/O lets one Node process keep serving other requests while it waits for a disk or the network.' },
    { q:'Which of these needs Node, and cannot run in a web page?', options:['Math.random()','console.log()','Reading a file from the computer\'s disk with fs','Pushing onto an array'], answer:2, why:'Browsers sandbox web pages away from your files. Node runs your own code on your own machine or server, so it may use the file system.' },
  ],
});


PG.add({
  id:'l193', index:193, udemyId:12400776, minutes:1, section:'s23', slug:'install-node-mac', kind:'read',
  title:'Install Node.js on Mac',
  blurb:'Download the <b>LTS</b> (Long Term Support) installer from nodejs.org, the steadier of the two versions on offer, and run the <code>.pkg</code> with its default options. If macOS refuses to open it, Control-click the file and choose <i>Open With → Installer</i>. Then check in a terminal: <code>node --version</code> prints the version, and <code>npm --version</code> confirms that npm came with it.',
  links:[ { title:'nodejs.org downloads', url:'https://nodejs.org/', note:'choose the LTS version' } ],
  quiz:[
    { q:'Which Node.js download should you pick for the course?', options:['Current','LTS','Nightly','Whichever is larger'], answer:1, why:'LTS releases get long-term fixes and are what most projects and tutorials target; Current carries the newest, less settled features.' },
  ],
});


PG.add({
  id:'l194', index:194, udemyId:12400782, minutes:0, section:'s23', slug:'install-node-windows', kind:'read',
  title:'Install Node.js on Windows',
  blurb:'Download the <b>LTS</b> <code>.msi</code> installer from nodejs.org and click through with the default options, which include adding Node to your PATH. Then restart the computer: until you do, the terminal will not recognise the <code>node</code> command. Finally run <code>node --version</code> in your terminal to check.',
  links:[ { title:'nodejs.org downloads', url:'https://nodejs.org/', note:'choose the LTS version' } ],
  quiz:[
    { q:'You installed Node on Windows and the terminal says <code>node</code> is not recognised. What do you try first?', options:['Reinstall VS Code','Restart the computer so the terminal picks up the new PATH','Install Python','Delete npm'], answer:1, why:'The installer adds Node to the PATH, but programs only see the change after a restart (or at least a fresh terminal).' },
  ],
});


PG.add({
  id:'l195', index:195, udemyId:38126452, minutes:8, section:'s23', slug:'using-node', kind:'node',
  title:'Using Node.js',
  blurb:'Node runs JavaScript files from the terminal: <code>cd</code> into the folder that holds the file, then <code>node index.js</code> (if Tab cannot complete the name, you are in the wrong folder). Typing <code>node</code> on its own opens the <b>REPL</b> (Read, Eval, Print, Loop), where each line you type runs immediately; <code>.exit</code> or Ctrl+C twice takes you back to the normal prompt. <code>node -v</code> prints the version; the course needs 18 or later.',
  tasks:[
    'Write <code>console.log("Hello from Node");</code> in <code>index.js</code> and press <b>▶ Run</b>. The terminal panel shows the output, just as <code>node index.js</code> would.',
    'Turn the REPL session from the video into code: log <code>5 + 8</code>, declare <code>let a = 3</code>, then log <code>a + 12</code>. In a real REPL you would type each line at the <code>&gt;</code> prompt and see its value without needing console.log.',
    'Log <code>process.version</code>: it holds the same version string that <code>node -v</code> prints.',
    'Add a line with a deliberate mistake, such as <code>console.log(b);</code>, run the file and read the error Node reports, including the line number. Then remove it.'
  ],
  notes:'<p>The playground has no interactive REPL: <b>▶ Run</b> runs <code>index.js</code> from top to bottom, the way <code>node index.js</code> does. Try the REPL on your own machine: type <code>node</code>, then <code>5 + 8</code>, <code>.help</code> and <code>.exit</code>.</p>',
  run:['index.js'],
  files:{
'index.js':`// Pressing ▶ Run here is the same as typing  node index.js  in a terminal
// opened in this project's folder: Node runs the file from top to bottom.

// TODO 1: log "Hello from Node"


// TODO 2: the REPL lines from the video, written in a file. In the REPL you
//         type 5 + 8, then let a = 3, then a + 12; in a file, log the results


// TODO 3: log process.version, the version number that  node -v  prints

`},
  solution:{
'index.js':`console.log("Hello from Node");

// The REPL session from the video, written as a file
console.log(5 + 8);    // 13
let a = 3;
console.log(a + 12);   // 15

// The version of Node that is running this file (what node -v prints)
console.log(process.version);
`},
  quiz:[
    { q:'What does REPL stand for?', options:['Run, Execute, Print, Log','Read, Eval, Print, Loop','Repeat Every Program Line','Remote Evaluation Process Layer'], answer:1, why:'It reads a line, evaluates it, prints the result and loops back for the next line.' },
    { q:'You typed <code>node</code> by itself and now see a <code>&gt;</code> prompt. How do you get back to the normal prompt?', options:['Type exit','Type .exit, or press Ctrl+C twice','Close VS Code','Type cd ..'], answer:1, why:'node without a file name starts the REPL; its own dot-commands, or Ctrl+C twice, leave it.' },
    { q:'<code>node index.js</code> fails with <i>Cannot find module</i>. What is the most likely cause?', options:['Node is not installed','The terminal is in a different folder from index.js','index.js has a typo inside it','npm init was not run'], answer:1, why:'Node looks for the file relative to the current folder. cd into the project first; Tab completion is a quick check.' },
  ],
});


PG.add({
  id:'l196', index:196, udemyId:12384326, minutes:12, section:'s23', slug:'native-modules', kind:'node',
  title:'How to Use the Native Node Modules',
  blurb:'Node comes with built-in <b>native modules</b>, ready to use without installing anything: <code>fs</code> for the file system, <code>http</code>, <code>path</code>, <code>os</code> and more. Browser JavaScript may not touch your files, but Node runs your own code on your own machine, so it can. Load a module with <code>require("fs")</code>, then write a file with <code>fs.writeFile</code> and read one with <code>fs.readFile</code>. Both are asynchronous: Node calls your callback when the disk work is done.',
  tasks:[
    'Load the module: <code>const fs = require("fs");</code>.',
    'Write a file: <code>fs.writeFile("message.txt", "Hello from NodeJS!", (err) =&gt; { ... });</code>. In the callback, <code>throw err</code> if it is set, otherwise log <i>The file has been saved!</i>. Press <b>▶ Run</b>.',
    'Challenge: comment out the writeFile block, change the text in the <code>message.txt</code> tab, and read the file back with <code>fs.readFile("./message.txt", "utf8", (err, data) =&gt; { ... })</code>, logging <code>data</code>.',
    'Put <code>console.log("after readFile");</code> on the line after the readFile call and run again. It prints first, because readFile only calls you back once the reading has finished.'
  ],
  notes:'<p>The <code>message.txt</code> tab plays the part of the file on disk, so you can edit it for the challenge. It starts with the text your <code>writeFile</code> call writes. Two differences from real Node: the playground does not copy what your code writes back into the editor tab, and its <code>readFile</code> returns text even without <code>"utf8"</code>. Real Node gives you a Buffer of raw bytes instead (printed as <code>&lt;Buffer 48 65 6c ...&gt;</code>), so always pass the encoding.</p>',
  run:['index.js'],
  files:{
'index.js':`// TODO 1: load the built-in file system module with require


// TODO 2: write "Hello from NodeJS!" into message.txt with fs.writeFile.
//         Its last argument is a callback: throw the error if there is one,
//         otherwise log "The file has been saved!"


// TODO 3 (challenge): comment out the writeFile code, change the text in the
//         message.txt tab, then read the file with fs.readFile and log its text.
//         Remember the "utf8" encoding argument.

`,
'message.txt':`Hello from NodeJS!`},
  solution:{
'index.js':`const fs = require("fs");

// Writing is switched off now, so it cannot overwrite the text typed into message.txt
// fs.writeFile("message.txt", "Hello from NodeJS!", (err) => {
//   if (err) throw err;
//   console.log("The file has been saved!");
// });

fs.readFile("./message.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

console.log("after readFile");   // prints first: the callback above runs later
`,
'message.txt':`Hello from NodeJS! I changed this text myself.`},
  quiz:[
    { q:'Why can Node read and write files when JavaScript in a web page cannot?', options:['Node is faster','Browsers sandbox web pages so websites cannot reach your files; Node runs your own code on your own machine or server','fs is a browser feature as well','Browsers do not support callbacks'], answer:1, why:'The browser protects visitors from the sites they open. Node has no such sandbox, because you chose to run the code.' },
    { q:'What is the last argument of <code>fs.writeFile</code>?', options:['The file name','The data to write','A callback that Node runs when the write has finished','The encoding'], answer:2, why:'File name and data come first, optional options can follow, and the callback always goes last.' },
    { q:'In real Node, what does <code>fs.readFile</code> hand you if you leave out <code>"utf8"</code>?', options:['An empty string','A Buffer of raw bytes','An error','The file name'], answer:1, why:'Without an encoding Node cannot know the bytes are text, so it gives you the bytes themselves.' },
    { q:'What happens when <code>fs.writeFile</code> targets a file that already exists?', options:['It adds to the end','It replaces the whole contents','It throws an error','It asks you first'], answer:1, why:'writeFile overwrites. fs.appendFile is the one that adds to the end.' },
  ],
});


PG.add({
  id:'l197', index:197, udemyId:48853823, minutes:0, section:'s23', slug:'note-about-next-lesson', kind:'read',
  title:'A note about the next lesson',
  blurb:'Packages change under your feet. In version 4 of the <code>superheroes</code> package, the default export is just the list of names, and the random picker became a <b>named</b> export: <code>import { randomSuperhero } from "superheroes";</code> then <code>randomSuperhero()</code>. The next video uses the version 3 style, <code>import superheroes from "superheroes";</code> then <code>superheroes.random()</code>, which fails with version 4. This playground has version 3 built in, so its lesson uses the version 3 style.',
  links:[ { title:'superheroes on npm', url:'https://www.npmjs.com/package/superheroes', note:'the usage section shows the current import' } ],
  quiz:[
    { q:'With superheroes version 4, which code prints a random hero name?', options:['<code>import superheroes from "superheroes";</code> then <code>superheroes.random()</code>','<code>import { randomSuperhero } from "superheroes";</code> then <code>randomSuperhero()</code>','<code>const random = require("superheroes").random;</code>','<code>import random from "superheroes/random";</code>'], answer:1, why:'Version 4 exposes the picker as a named export called randomSuperhero.' },
    { q:'What is the difference between <code>import x from "pkg"</code> and <code>import { x } from "pkg"</code>?', options:['There is none','The first takes the default export, under any name you like; the second takes the export with exactly that name','The first is CommonJS','The second only works in browsers'], answer:1, why:'A default import names whatever the module marked as default; a named import must match an exported name exactly.' },
  ],
});


PG.add({
  id:'l198', index:198, udemyId:12384340, minutes:16, section:'s23', slug:'npm', kind:'node',
  title:'The NPM Package Manager and Installing External Node Modules',
  blurb:'npm is the package manager installed with Node, and npmjs.com is its public registry of code that other developers share. <code>npm init</code> asks a few questions and writes <code>package.json</code>, the project\'s description; <code>npm i &lt;name&gt;</code> downloads a package into <code>node_modules</code> and records it under <code>dependencies</code>. To use <code>import</code> instead of <code>require</code>, add <code>"type": "module"</code> to <code>package.json</code>.',
  tasks:[
    '<code>package.json</code> is what <code>npm init</code> writes. Add <code>"type": "module"</code> under <code>"main"</code>, so Node accepts <code>import</code> lines.',
    'Record the packages the way <code>npm i supervillains superheroes</code> would: add a <code>"dependencies"</code> section with <code>"supervillains": "^3.0.0"</code> and <code>"superheroes": "^3.0.0"</code>. Both are already built into the playground.',
    'In <code>index.js</code>, write <code>import supervillains from "supervillains";</code>, then <code>const villainName = supervillains.random();</code> and log <code>`My name is ${villainName}.`</code>. Press <b>▶ Run</b> a few times: a different name each time.',
    'Challenge: do the same with <code>superheroes</code> and log <code>`I am ${name}!`</code>.',
    'For comparison, the CommonJS way is <code>const superheroes = require("superheroes");</code>. Real Node only accepts it when <code>package.json</code> does not say <code>"type": "module"</code> (the playground accepts both), so keep the import.'
  ],
  notes:'<p>The video installs <code>sillyname</code> first. The playground does not bundle that package, so this lesson uses <code>supervillains</code> in its place: same steps, same idea. The playground cannot run <code>npm</code> commands; its packages are pre-installed, so you edit <code>package.json</code> by hand to see what the commands would write. It also accepts <code>import</code> without <code>"type": "module"</code>, while real Node stops with <i>Cannot use import statement outside a module</i>.</p><p>If you follow along on your own machine, <code>npm i superheroes</code> installs version 4, which uses a named import instead: <code>import { randomSuperhero } from "superheroes";</code> (see the previous lecture). Pinning <code>"^3.0.0"</code>, as here, keeps the code below working.</p>',
  run:['index.js'],
  files:{
'index.js':`// The video installs a package called sillyname first. This playground does not
// bundle it, so the first package here is supervillains instead. Same idea:
// install it, import it, call the function it gives you.

// TODO 3: import supervillains, pick a name with supervillains.random()
//         and log \`My name is \${villainName}.\`


// TODO 4: the same with superheroes: log \`I am \${name}!\`

`,
'package.json':`{
  "name": "learning-npm",
  "version": "1.0.0",
  "description": "I'm learning about npm",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
`},
  solution:{
'index.js':`// const supervillains = require("supervillains");   // CommonJS, the older style
import supervillains from "supervillains";            // ES module: needs "type": "module"
import superheroes from "superheroes";

const villainName = supervillains.random();
console.log(\`My name is \${villainName}.\`);

const name = superheroes.random();
console.log(\`I am \${name}!\`);

// superheroes version 4 (what npm installs today) uses a named export instead:
// import { randomSuperhero } from "superheroes";
// const name = randomSuperhero();
`,
'package.json':`{
  "name": "learning-npm",
  "version": "1.0.0",
  "description": "I'm learning about npm",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "superheroes": "^3.0.0",
    "supervillains": "^3.0.0"
  }
}
`},
  quiz:[
    { q:'What does <code>npm init</code> create?', options:['node_modules','package.json','index.js','package-lock.json only'], answer:1, why:'It writes package.json from your answers (npm init -y accepts every default without asking).' },
    { q:'After <code>npm i superheroes</code>, where is the package\'s code?', options:['Inside package.json','In the node_modules folder','Only on npmjs.com','Copied into index.js'], answer:1, why:'package.json only records the name and version range; the downloaded code lives in node_modules.' },
    { q:'Why add <code>"type": "module"</code> to package.json?', options:['To install packages faster','So Node treats .js files as ES modules and accepts import syntax','To publish the package','To enable require()'], answer:1, why:'Without it Node assumes CommonJS, and an import line fails with "Cannot use import statement outside a module".' },
    { q:'Which line is CommonJS?', options:['<code>import fs from "fs";</code>','<code>const fs = require("fs");</code>','<code>export default fs;</code>','<code>import { readFile } from "fs";</code>'], answer:1, why:'require() is the original Node module system; import and export are the ES module standard shared with browsers.' },
  ],
});


PG.add({
  id:'l199', index:199, udemyId:38126546, minutes:16, section:'s23', slug:'qr-code-generator', kind:'node', project:true,
  title:'QR Code Generator',
  blurb:'The section\'s project is a command-line program built from two npm packages and one native module: <code>inquirer</code> asks the user for a URL, <code>qr-image</code> turns it into a QR code image, and <code>fs</code> saves the URL in a text file. Most of the work is reading each package\'s documentation and adapting its example, including turning <code>require</code> examples into <code>import</code> lines.',
  tasks:[
    'In <code>package.json</code>, add <code>"type": "module"</code> so the <code>import</code> lines are allowed. The dependencies are already listed, as <code>npm i inquirer qr-image</code> followed by <code>npm init -y</code> would leave them.',
    'Ask the question: <code>inquirer.prompt([{ message: "Type in your URL: ", name: "URL" }])</code>, followed by <code>.then((answers) =&gt; { ... })</code> and <code>.catch((error) =&gt; { ... })</code>. Log <code>answers</code> and press <b>▶ Run</b>. The lesson types <i>https://www.google.com</i> as the answer for you.',
    'Keep the answer in <code>const url = answers.URL;</code>.',
    'Import <code>qr</code> from "qr-image" and <code>fs</code> from "fs". Inside <code>.then</code>, create the code with <code>qr.image(url)</code> and <code>.pipe()</code> it into <code>fs.createWriteStream("qr_img.png")</code>. Click <b>qr_img.png</b> under <i>files written</i> to see it, and scan it with your phone camera.',
    'Save the URL as text with <code>fs.writeFile("URL.txt", url, callback)</code>, logging <i>The file has been saved!</i>, then open <b>URL.txt</b> from <i>files written</i>.',
    'Stretch: add a second question with <code>name: "fileName"</code> and use its answer instead of "qr_img.png". Only one answer is pre-typed, so the terminal asks you for the second one.'
  ],
  notes:'<p>Two playground details. First, its built-in <code>inquirer</code> cannot be loaded with the one-line <code>import inquirer from "inquirer";</code> you would normally write, so the starter uses an equivalent two-line form that also works in real Node. Second, it draws the QR code as an SVG picture (even in a file named <code>.png</code>), so it can be shown on screen; real <code>qr-image</code> writes a PNG by default.</p><p>The answer to the prompt is queued as <i>https://www.google.com</i>; any further questions are asked in the terminal panel.</p>',
  run:['index.js'],
  answers:'https://www.google.com',
  files:{
'index.js':`/*
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// In a real project inquirer is imported with one line:  import inquirer from "inquirer";
// The playground's built-in inquirer needs the two-line form below (it works in real Node too).
import * as inquirerPackage from "inquirer";
// TODO 4: import qr from "qr-image" and fs from "fs" up here, with the other import

const inquirer = inquirerPackage.default ?? inquirerPackage;

// TODO 1: ask for the URL with inquirer.prompt([{ message: "Type in your URL: ", name: "URL" }]),
//         handle the result in .then((answers) => { ... }) and errors in .catch((error) => { ... })

//   TODO 2: inside .then, log answers to see its shape, then keep answers.URL in a const called url

//   TODO 4: turn url into a QR code: qr.image(url), piped into fs.createWriteStream("qr_img.png")

//   TODO 5: save url in URL.txt with fs.writeFile, and log "The file has been saved!"

`,
'package.json':`{
  "name": "qr-code-generator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "inquirer": "^9.3.7",
    "qr-image": "^3.2.0"
  }
}
`},
  solution:{
'index.js':`/*
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// In a real project inquirer is imported with one line:  import inquirer from "inquirer";
// The playground's built-in inquirer needs the two-line form below (it works in real Node too).
import * as inquirerPackage from "inquirer";
import qr from "qr-image";
import fs from "fs";

const inquirer = inquirerPackage.default ?? inquirerPackage;

inquirer
  .prompt([
    {
      message: "Type in your URL: ",
      name: "URL",
    },
  ])
  .then((answers) => {
    const url = answers.URL;

    // qr.image() returns a stream of image data; pipe it into a new file
    var qr_svg = qr.image(url);
    qr_svg.pipe(fs.createWriteStream("qr_img.png"));

    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.log("Something else went wrong:", error);
    }
  });
`,
'package.json':`{
  "name": "qr-code-generator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "inquirer": "^9.3.7",
    "qr-image": "^3.2.0"
  }
}
`},
  quiz:[
    { q:'In an inquirer question object, what does <code>name</code> do?', options:['It is the text shown to the user','It is the key the answer is stored under in the answers object','It names the output file','It is the package name'], answer:1, why:'message is what the user sees; name decides where the reply ends up, so name: "URL" gives answers.URL.' },
    { q:'Why convert the qr-image README\'s <code>require(...)</code> example into an <code>import</code>?', options:['require is slower','An ES module file has no require(), and this project uses import','import produces PNGs','qr-image only supports import'], answer:1, why:'With "type": "module" every .js file is an ES module, where require is not defined; the two styles do not mix in one file.' },
    { q:'What does <code>qr.image(url)</code> return?', options:['A finished PNG file on disk','A stream of image data that you pipe into a file','A URL','A string of text'], answer:1, why:'Nothing is saved until you pipe the stream into fs.createWriteStream("qr_img.png").' },
  ],
});


PG.add({
  id:'l200', index:200, udemyId:18113055, minutes:1, section:'s23', slug:'tip-step-up', kind:'read',
  title:'Tip from Angela - Step Up to the Challenge',
  blurb:'Doubting yourself when someone hands you a bigger task is normal. Treat that feeling as a signal to prepare, then say yes: stretching into work that feels slightly too big is how your skills grow.',
});
