/* ===== Section 14 — Introduction to Javascript ES6 (lectures 75–98) ===== */
/* kind:'js' lessons have a big console and a small preview strip. prompt() reads the
   "Prompt answers" box (comma-separated); alert() shows as a yellow line in the console.
   Console quirk to keep in mind when writing code here: console.log(undefined) prints an
   empty line and NaN prints as null, so lessons log those through "text " + value. */

PG.add({
  id:'l075', index:75, udemyId:12371320, minutes:12, section:'s14', slug:'introduction-to-javascript', kind:'read',
  title:'Introduction to Javascript',
  blurb:'Why browsers got a programming language of their own: Netscape wanted pages that react on the spot instead of fetching a whole new page from the server for every little change. JavaScript (no relation to Java) is that language. In a web page the HTML elements are the actors, and your script tells them what to do and when.',
  links:[
    { title:'MDN Web Docs — JavaScript', url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript', note:'the reference you will look things up in for the rest of the course' },
  ],
  explore:[{
    title:'A script for the page\'s actors', height:310,
    note:'The page loads with both elements hidden. Press <b>Run the script</b>: each line gives one element one instruction, in order, with a pause where the script says so.',
    html:`
<div class="knobs">
  <button id="play">▶ Run the script</button>
  <button id="reset">Reset the page</button>
  <label>pause <input type="range" id="speed" min="300" max="2000" step="100" value="1000"><span class="val" id="sv"></span></label>
</div>
<div style="display:flex;gap:14px;align-items:flex-start">
  <div class="stage" style="flex:1;min-height:150px">
    <h1 id="h1" style="margin:0 0 10px;font-size:28px;visibility:hidden">Heading</h1>
    <p id="p" style="margin:0;font-size:16px;visibility:hidden">Paragraph</p>
  </div>
  <pre class="readout" id="code" style="flex:1.3;margin:0"></pre>
</div>
<p class="note">From section 16 on you will write exactly this kind of code for real: find an element on the page, then show it, hide it or change its text.</p>
<script>
  var lines = [
    'heading.hidden = false;',
    'wait(pause);',
    'paragraph.hidden = false;',
    'wait(pause);',
    'heading.textContent = "Hello";',
    'paragraph.textContent = "World";'
  ];
  var h1 = document.getElementById('h1'), p = document.getElementById('p');
  var code = document.getElementById('code'), speed = document.getElementById('speed'), sv = document.getElementById('sv');
  var timers = [], current = -1;
  var actions = [
    function(){ h1.style.visibility = 'visible'; },
    function(){},
    function(){ p.style.visibility = 'visible'; },
    function(){},
    function(){ h1.textContent = 'Hello'; },
    function(){ p.textContent = 'World'; }
  ];
  function esc(s){ return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function paint(){
    code.innerHTML = '<span style="color:#8b92a8">// the script</span>\\n' + lines.map(function(l, i){
      var style = i === current ? 'background:#2b3a55;color:#fff' : (i < current ? 'color:#7ee0a8' : 'color:#cdd3e4');
      return '<span style="' + style + '">' + (i === current ? '▶ ' : (i < current ? '✓ ' : '  ')) + esc(l) + '</span>';
    }).join('\\n');
  }
  function resetPage(){
    timers.forEach(clearTimeout); timers = []; current = -1;
    h1.style.visibility = 'hidden'; p.style.visibility = 'hidden';
    h1.textContent = 'Heading'; p.textContent = 'Paragraph';
    paint();
  }
  function play(){
    resetPage();
    var t = 0, pause = +speed.value;
    lines.forEach(function(l, i){
      timers.push(setTimeout(function(){ current = i; actions[i](); paint(); }, t));
      t += (i === 1 || i === 3) ? pause : 350;
    });
    timers.push(setTimeout(function(){ current = lines.length; paint(); }, t));
  }
  function showSpeed(){ sv.textContent = speed.value + ' ms'; }
  speed.addEventListener('input', showSpeed);
  document.getElementById('play').addEventListener('click', play);
  document.getElementById('reset').addEventListener('click', resetPage);
  showSpeed(); paint();
<\/script>`
  },{
    title:'The same page with JavaScript switched off', height:350,
    note:'Type in the box and press Like. Then untick <b>JavaScript enabled</b> and try again: the HTML and CSS are still there, only the behaviour has gone.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="on" checked> JavaScript enabled</label>
</div>
<div class="stage">
  <div style="font-weight:700;margin-bottom:8px">Write a post</div>
  <textarea id="t" style="width:100%;height:76px;font:inherit;border:1px solid #cfd5e6;border-radius:8px;padding:8px;resize:none">Learning JavaScript today!</textarea>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
    <span id="count" class="tag">280 characters left</span>
    <button id="like">♡ Like</button>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var on = document.getElementById('on'), t = document.getElementById('t'), count = document.getElementById('count');
  var like = document.getElementById('like'), ro = document.getElementById('ro'), liked = false;
  function update(){
    if (!on.checked) return;
    var left = 280 - t.value.length;
    count.textContent = left + ' characters left';
    count.style.color = left < 0 ? '#c0392b' : '';
  }
  t.addEventListener('input', update);
  like.addEventListener('click', function(){
    if (!on.checked) return;
    liked = !liked;
    like.textContent = liked ? '♥ Liked' : '♡ Like';
  });
  function explain(){
    if (on.checked) {
      update();
      ro.textContent = 'JavaScript on: the counter follows every key you press, and the button reacts to clicks.';
    } else {
      count.textContent = '280 characters left'; count.style.color = '';
      liked = false; like.textContent = '♡ Like';
      ro.textContent = 'JavaScript off: the page still appears, because that part is HTML and CSS.\\nBut the counter is stuck on whatever the HTML says, and the button does nothing.\\nBig sites lose most of their features this way when JavaScript is disabled in the browser settings.';
    }
  }
  on.addEventListener('change', explain);
  explain();
<\/script>`
  }],
  quiz:[
    { q:'How are Java and JavaScript related?', options:['JavaScript is the browser edition of Java','They are separate languages — the similar name was a marketing choice in the 1990s','JavaScript is compiled into Java before it runs','They are two names for the same standard'], answer:1, why:'Apart from the name, picked while Java was fashionable, the two languages have different designs, uses and histories.' },
    { q:'What does <b>ES6</b> refer to?', options:['A framework built on JavaScript','The sixth browser that supported JavaScript','The 2015 edition of ECMAScript, the standard that defines JavaScript','Version 6 of Chrome'], answer:2, why:'ECMAScript is the official standard. ES6 (also called ES2015) is the edition that brought in most of the modern syntax you will use.' },
    { q:'JavaScript is called an <i>interpreted</i> language. What does that mean here?', options:['It can only run on a server','You hand the engine your instructions as text and it carries them out directly — there is no compile step for you to run first','It translates web pages into other languages','It needs Java installed to work'], answer:1, why:'The browser reads the script and runs it. Modern engines do compile behind the scenes for speed, but that is invisible to you.' },
    { q:'Which problem was JavaScript created to solve?', options:['Pages could only change by asking the server for a whole new page','HTML could not show images','Websites had no way to store data','CSS was too slow'], answer:0, why:'Code that runs inside the browser can react to the user immediately, with no round trip to the server for every calculation or change.' },
  ],
});


PG.add({
  id:'s14-alerts', index:76, udemyId:12371344, minutes:14, section:'s14', slug:'alerts', kind:'js',
  title:'Javascript Alerts - Adding Behaviour to Websites',
  blurb:'Your first JavaScript. <code>alert("Hello");</code> is one complete instruction: the function name, round brackets holding what it should show, quotes that mark <i>Hello</i> as text rather than code, and a semicolon to end it. <code>console.log()</code> is the quieter sibling: it writes to the console, where only developers look.',
  tasks:[
    'Show an alert that says <code>Hello</code>, then a second one that says <code>World</code>. In this playground alerts appear as yellow lines in the console, in the order they run.',
    'Write the long form <code>window.alert("Hello World");</code> and confirm it behaves exactly like the short one.',
    'Log a message, a number and a sum with <code>console.log()</code>, for example <code>console.log(7 * 6);</code>.',
    'Add <code>say("Hello");</code> as the last line and run. Read the <b>ReferenceError</b>: there is no function called <code>say</code>, yet every line above it still ran. Then try <code>Alert("Hello");</code> — capital letters count.',
    'Type <code>alert(“Hello”);</code> with curly quotes (the kind word processors insert) and read the <b>SyntaxError</b>. This time nothing runs at all. Fix it with straight quotes.'
  ],
  files:{ 'script.js':`// Each line is one instruction. The semicolon ends it, like a full stop.

// TODO 1: alert "Hello", then alert "World"


// TODO 2: the same thing in long form: window.alert(...)


// TODO 3: log a message, a number and a sum with console.log()

` },
  solution:{ 'script.js':`alert("Hello");
alert("World");

// alert belongs to the browser's window object; the short form is what everyone writes
window.alert("Hello World");

console.log("This goes to the console.");
console.log(42);
console.log(7 * 6);

// say("Hello");     // ReferenceError: say is not defined  (no such function)
// Alert("Hello");   // ReferenceError too: names are case-sensitive
// alert(“Hello”);   // SyntaxError: curly quotes are not quotes to JavaScript
` },
  explore:[{
    title:'Read the error', height:380,
    note:'Pick a broken line (or type your own) and see what the browser says about it, and what that message actually means.',
    html:`
<div class="knobs">
  <label>pick a line
    <select id="pick">
      <option>alert("Hello");</option>
      <option>say("Hello");</option>
      <option>Alert("Hello");</option>
      <option>alert(“Hello”);</option>
      <option>alert("Hello);</option>
      <option>alert("Hello";</option>
      <option>alert(Hello);</option>
    </select>
  </label>
  <label>or type one <input type="text" id="own" style="width:230px" placeholder="your own line of code"></label>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<p class="note">Two families of error. A <b>SyntaxError</b> means the browser could not even read the code, so nothing in the file runs. A <b>ReferenceError</b> happens while the code runs, at the line that uses a name that does not exist — the lines before it have already done their job.</p>
<script>
  var pick = document.getElementById('pick'), own = document.getElementById('own'), ro = document.getElementById('ro');
  function hints(src){
    var out = [];
    if (/[“”‘’]/.test(src)) out.push('• It contains curly quotes. Only straight quotes mark a string.');
    if ((src.split('"').length - 1) % 2 === 1) out.push('• There is an odd number of " characters: a string was opened but never closed.');
    if (src.split('(').length !== src.split(')').length) out.push('• The round brackets do not pair up.');
    return out.join('\\n');
  }
  function check(){
    var src = own.value.trim() || pick.value, shown = [];
    var fakeConsole = { log: function(){ shown.push('console: ' + [].join.call(arguments, ' ')); } };
    var fn;
    try { fn = new Function('alert', 'console', src); }
    catch (e) {
      ro.textContent = src + '\\n\\n✗ ' + e.name + ': ' + e.message + '\\n\\nThe browser could not read this code, so nothing in the file would run.\\n' + hints(src);
      return;
    }
    try { fn(function(m){ shown.push('alert shows: ' + m); }, fakeConsole); }
    catch (e) {
      ro.textContent = src + '\\n\\n✗ ' + e.name + ': ' + e.message + '\\n\\n' + (e.name === 'ReferenceError'
        ? 'JavaScript looked for something with that name and found nothing.\\nCheck the spelling and the capital letters. Words that are meant as text need quotes.'
        : 'The code could be read, but it failed while running.');
      return;
    }
    ro.textContent = src + '\\n\\n✓ runs fine' + (shown.length ? '\\n' + shown.join('\\n') : '');
  }
  pick.addEventListener('change', function(){ own.value = ''; check(); });
  own.addEventListener('input', check);
  check();
<\/script>`
  }],
  quiz:[
    { q:'What do the quotation marks in <code>alert("Hello");</code> tell the browser?', options:['That Hello is the name of a variable','That Hello is text (a string), not code to run','That the line is a comment','That the message should be shown in bold'], answer:1, why:'Code is written as text too, so quotes are how JavaScript tells data apart from instructions.' },
    { q:'<code>say("Hello");</code> stops with <i>ReferenceError: say is not defined</i>. What does that mean?', options:['The quotes are the wrong kind','The semicolon is missing','There is no function or variable called say','The browser blocks pop-ups'], answer:2, why:'A ReferenceError means JavaScript looked for that name and found nothing — usually a typo or a wrong capital letter.' },
    { q:'Why does <code>alert(“Hello”);</code> pasted from a word processor fail?', options:['Curly quotes are not string quotes in JavaScript','alert only accepts single quotes','The text is too short','It needs window. in front'], answer:0, why:'Word processors swap straight quotes for typographic ones. JavaScript cannot read those, so the whole script fails with a SyntaxError.' },
    { q:'Which of these does every visitor of your page see?', options:['console.log("Hi");','alert("Hi");','// alert("Hi");','None of them'], answer:1, why:'alert opens a dialog for whoever is on the page. Console output only appears in the developer tools, and a commented-out line does not run at all.' },
  ],
  notes:`
    <h3>Anatomy of an instruction</h3>
    <pre>alert("Hello");
^^^^^ ^^^^^^^^^ ^
  |       |     +-- semicolon: the end of this instruction
  |       +-------- the input, in brackets; the quotes make it a string (text, not code)
  +---------------- the function: something the browser already knows how to do</pre>
    <h3>alert vs console.log</h3>
    <ul>
      <li><code>alert()</code> interrupts every visitor with a dialog. Fine for a first demo, annoying on a real site.</li>
      <li><code>console.log()</code> writes to the developer console. Visitors never see it; you will use it constantly to check values.</li>
    </ul>
    <p>In this playground alerts are caught and shown in the console panel instead of as real pop-ups, so nothing blocks while you type.</p>
    <h3>Style</h3>
    <ul>
      <li>Straight quotes only. Double quotes are the usual choice for text; single quotes behave the same.</li>
      <li>No spaces inside: <code>alert("Hello");</code> rather than <code>alert ( "Hello" ) ;</code>. Both run, only one looks like everyone else's code.</li>
      <li>Look things up on <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/alert" target="_blank" rel="noopener">MDN</a>. Searching "mdn alert" is a completely normal thing for a developer to do.</li>
    </ul>
    <h3>In real Chrome</h3>
    <p>Open the console with Cmd+Option+J (Mac) or Ctrl+Shift+J (Windows). Enter runs a line straight away; Shift+Enter adds a new line without running. For longer code use Sources → Snippets and run it with Cmd/Ctrl+Enter.</p>`
});


PG.add({
  id:'s14-data-types', index:77, udemyId:12371362, minutes:4, section:'s14', slug:'data-types', kind:'js',
  title:'Data Types',
  blurb:'Code is text too, so JavaScript needs a way to tell data from instructions: anything in quotes is a <b>string</b>. Bare digits are a <b>number</b>, and <code>true</code> / <code>false</code> are <b>booleans</b>. <code>typeof</code> reports a value\'s type, and the type decides what operators such as <code>+</code> do with it.',
  tasks:[
    'Run <code>alert(2 + 3);</code>. The sum is worked out first; <code>alert</code> only ever receives the answer, 5.',
    'Log the type of <code>"hello"</code>, <code>42</code>, <code>true</code>, <code>undefined</code>, <code>null</code> and <code>[1, 2, 3]</code> using <code>typeof</code>.',
    'Compare <code>typeof 23</code> with <code>typeof "23"</code>, and <code>typeof true</code> with <code>typeof "true"</code>. The quotes alone change the type.',
    '<code>"7" + 1</code> and <code>7 + 1</code> give different answers. Work out why before you open the solution.',
    'Look at what <code>typeof null</code> says. It is a mistake from the language\'s very first version that can never be fixed without breaking old websites.'
  ],
  files:{ 'script.js':`// TODO 1: alert the sum 2 + 3 (no quotes!)


// TODO 2: log the type of each value
console.log(typeof "hello");
// ...and now 42, true, undefined, null and [1, 2, 3]


// TODO 3: do quotes change the type?  23 vs "23",  true vs "true"


// TODO 4: the classic gotcha — why are these two different?
console.log("7" + 1);
console.log(7 + 1);
` },
  solution:{ 'script.js':`alert(2 + 3);                    // the sum happens first; alert receives 5

console.log(typeof "hello");     // string
console.log(typeof 42);          // number
console.log(typeof true);        // boolean
console.log(typeof undefined);   // undefined
console.log(typeof null);        // "object"  <- the famous mistake
console.log(typeof [1, 2, 3]);   // "object"  (arrays are objects)

// quotes turn anything into a string
console.log(typeof 23, typeof "23");       // number string
console.log(typeof true, typeof "true");   // boolean string

// + means "add" for numbers and "join" for strings.
// If either side is a string, the other side is turned into a string too.
console.log("7" + 1);           // 71  <- joined
console.log(7 + 1);             // 8   <- added
console.log("7" - 1);           // 6   <- minus has no text meaning, so "7" becomes a number
console.log(Number("7") + 1);   // 8   <- convert on purpose: the safe way
` },
  explore:[{
    title:'Type detective', height:300,
    note:'Type any value the way you would write it in code. Watch what <code>typeof</code> says, and what <code>+ 1</code> and <code>* 2</code> do to it.',
    html:`
<div class="knobs">
  <label>a value <input type="text" id="v" value='"23"' style="width:170px"></label>
  <span class="note" style="margin:0">try: 23 · "23" · true · "true" · null · undefined · [1, 2] · 3.14 · "hello"</span>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var v = document.getElementById('v'), ro = document.getElementById('ro');
  function show(x){
    if (typeof x === 'string') return JSON.stringify(x);
    if (Array.isArray(x)) return '[' + x.map(show).join(', ') + ']';
    return String(x);
  }
  var why = {
    string: '+ joins the 1 onto the end of the text. * has no text meaning, so it tries to turn the text into a number first (NaN if it cannot).',
    number: '+ and * do ordinary maths.',
    boolean: 'In maths true counts as 1 and false as 0 — legal, but rarely what you meant.',
    undefined: 'There is no value to do maths with, so the answers are NaN ("not a number").',
    object: 'null counts as 0 in maths. An array is turned into text when you use + on it.'
  };
  function upd(){
    var src = v.value.trim(), val;
    if (!src) { ro.textContent = 'Type a value.'; return; }
    try { val = Function('return (' + src + ');')(); }
    catch (e) { ro.textContent = 'JavaScript cannot read that as a value:\\n' + e.message + '\\n\\nText needs quotes around it, like "this".'; return; }
    ro.textContent =
      'value          ' + show(val) + '\\n' +
      'typeof value   ' + JSON.stringify(typeof val) + '\\n' +
      'value + 1      ' + show(val + 1) + '\\n' +
      'value * 2      ' + show(val * 2) + '\\n\\n' + (why[typeof val] || '');
  }
  v.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Which of these is a <b>number</b>?', options:['"5"','5','"five"','true'], answer:1, why:'Digits without quotes are a number. Put quotes round them and they become a string that merely looks like a number.' },
    { q:'What is <code>typeof "true"</code>?', options:['"boolean"','"true"','"string"','"undefined"'], answer:2, why:'The quotes make it a string. Only the bare word true is a boolean.' },
    { q:'What does <code>"7" + 1</code> give?', options:['"71"','8','NaN','an error'], answer:0, why:'When either side of + is a string, + joins instead of adding, so the 1 is glued onto the "7".' },
    { q:'Which one is a valid boolean value?', options:['True','TRUE','"true"','true'], answer:3, why:'Booleans are written in lower case with no quotes. True and TRUE are just unknown names, and "true" is a string.' },
  ],
  notes:`
    <h3>The types</h3>
    <table>
      <tr><th>Type</th><th>Example</th></tr>
      <tr><td>string</td><td><code>"hello"</code> · <code>'hi'</code> · <code>\`hey\`</code></td></tr>
      <tr><td>number</td><td><code>42</code> · <code>3.14</code> · <code>-7</code> (no separate integer type)</td></tr>
      <tr><td>boolean</td><td><code>true</code> · <code>false</code></td></tr>
      <tr><td>undefined</td><td>A variable declared but never given a value</td></tr>
      <tr><td>null</td><td>Deliberately empty</td></tr>
      <tr><td>object</td><td><code>{}</code>, <code>[]</code></td></tr>
    </table>
    <h3>Type coercion</h3>
    <p>JavaScript converts types behind your back. <code>"7" + 1</code> is <code>"71"</code> because <code>+</code> means "join" when a string is involved. This catches everyone the first time they read a number from a form or a <code>prompt()</code>: those always arrive as strings, so wrap them in <code>Number(...)</code>.</p>`
});


PG.add({
  id:'s14-variables', index:78, udemyId:12371610, minutes:10, section:'s14', slug:'variables', kind:'js',
  title:'Javascript Variables',
  blurb:'A variable is a labelled box in memory: store a value once, then use the label wherever you need the value. <code>prompt()</code> asks the user for text, and without a variable that answer is gone the moment the box closes. The course writes <code>var</code>; this playground uses <code>let</code> for values that change and <code>const</code> for ones that do not.',
  tasks:[
    'Ask for the user\'s name with <code>prompt("What is your name?")</code>, store it in a variable and alert <i>Have a good day Ada!</i> (Ada is queued in the Prompt answers box).',
    'Mini challenge: <code>myName</code> holds "Angela". Show it in an alert without typing <i>Angela</i> again. Then try <code>alert("myName")</code> with quotes and compare.',
    'Make a <code>gameLevel</code> variable that starts at 1, change it to 2 and then 3 (no <code>let</code> the second time), and alert <i>Your level is currently: 3</i>.',
    'Try reassigning the <code>const</code> called <code>pi</code>, read the error in the console, then comment that line out again.'
  ],
  answers:'Ada',
  files:{ 'script.js':`// The "Prompt answers" box above the console feeds prompt() — "Ada" is queued for you.

// TODO 1: store the answer to prompt("What is your name?") in a variable,
//         then alert "Have a good day " + the name + "!"


// TODO 2: show myName in an alert without typing "Angela" again
const myName = "Angela";


// TODO 3: gameLevel starts at 1, then becomes 2, then 3 — alert the current level


// TODO 4: try to change a const, read the error, then comment the line out again
const pi = 3.14159;
` },
  solution:{ 'script.js':`let yourName = prompt("What is your name?");
alert("Have a good day " + yourName + "!");

const myName = "Angela";
alert(myName);       // the value inside the box: Angela
alert("myName");     // quotes make it plain text: myName

let gameLevel = 1;
gameLevel = 2;       // no let here — the box already exists, we only swap what is in it
gameLevel = 3;
alert("Your level is currently: " + gameLevel);

const pi = 3.14159;
// pi = 3;           // TypeError: Assignment to constant variable.
console.log("pi is still", pi);
` },
  quiz:[
    { q:'After <code>let myName = "Angela";</code>, what does <code>alert("myName");</code> show?', options:['Angela','myName','undefined','an error'], answer:1, why:'In quotes, myName is just text. Without quotes it is the variable, and you get the value inside it.' },
    { q:'Which line changes the value of an existing variable called <code>gameLevel</code>?', options:['gameLevel == 2;','"gameLevel" = 2;','gameLevel = 2;','let gameLevel = 2;'], answer:2, why:'The keyword is only used once, when the box is created. After that you assign with the bare name and a single =.' },
    { q:'The user types 7 into a prompt. What does <code>prompt()</code> give back?', options:['the string "7"','the number 7','true','undefined'], answer:0, why:'prompt always returns text. Wrap it in Number(...) before doing maths with it.' },
  ],
  notes:`
    <h3>The labelled box</h3>
    <pre>let myName = "Angela";     myName → [ "Angela" ]
myName = "Jimmy";          myName → [ "Jimmy" ]    the old value is thrown away
alert(myName);             shows Jimmy
alert("myName");           shows the word myName</pre>
    <h3>let vs const vs var</h3>
    <table>
      <tr><th></th><th>Reassign?</th><th>Scope</th></tr>
      <tr><td><code>const</code></td><td>No</td><td>Block <code>{ }</code></td></tr>
      <tr><td><code>let</code></td><td>Yes</td><td>Block <code>{ }</code></td></tr>
      <tr><td><code>var</code></td><td>Yes</td><td>Whole function — leaks out of blocks</td></tr>
    </table>
    <p><b>The habit to build:</b> use <code>const</code> by default and switch to <code>let</code> when you genuinely need to reassign. The course videos use <code>var</code> throughout; everything they do works the same with <code>let</code>.</p>
    <h3>prompt returns a string — always</h3>
    <p>Even if the user types <code>7</code>, you get <code>"7"</code>. Wrap it in <code>Number()</code> before doing maths with it.</p>`
});


PG.add({
  id:'l079', index:79, udemyId:18126317, minutes:3, section:'s14', slug:'variables-exercise', kind:'js',
  title:'Javascript Variables Exercise Start',
  blurb:'A classic puzzle: two variables, <code>a</code> and <code>b</code>, have to trade values. The rules make it interesting — you may only add three lines, you may not type any numbers, and you may not declare <code>a</code> or <code>b</code> again. Think of a bucket of sand and a bucket of water: how do you swap what is in them?',
  tasks:[
    'Run the starter unchanged: the console says <i>a is 3</i> and <i>b is 8</i>. Both values come from the <b>Prompt answers</b> box.',
    'Predict first, then try it: <code>a = b;</code> followed by <code>b = a;</code>. Why does that leave both variables holding 8?',
    'Write three lines in the gap so the console says <i>a is 8</i> and <i>b is 3</i>. No numbers, no <code>var</code>/<code>let</code> in front of <code>a</code> or <code>b</code>, and no other line changed.',
    'Prove nothing is hard-coded: change the Prompt answers to <code>sand, water</code> and run again. The two words should trade places too.'
  ],
  answers:'3, 8',
  files:{ 'script.js':`// a and b are filled from the Prompt answers box (3 and 8 are queued).
var a = prompt("a");
var b = prompt("b");

/*********** Do not change the code above 👆 ***********/
// Write your code on the three lines below. The rules:
//   - do not type any numbers
//   - do not declare a or b again (no var / let / const in front of them)
//   - do not change any other line



/*********** Do not change the code below 👇 ***********/
console.log("a is " + a);
console.log("b is " + b);
` },
  solution:{ 'script.js':`// a and b are filled from the Prompt answers box (3 and 8 are queued).
var a = prompt("a");
var b = prompt("b");

/*********** Do not change the code above 👆 ***********/

var c = a;
a = b;
b = c;

/*********** Do not change the code below 👇 ***********/
console.log("a is " + a);
console.log("b is " + b);
` },
  quiz:[
    { q:'With <code>a</code> holding 3 and <code>b</code> holding 8, what do you get after <code>a = b; b = a;</code>?', options:['a is 8, b is 3','a is 8, b is 8','a is 3, b is 3','an error'], answer:1, why:'The first line overwrites the 3, so when the second line copies a back into b, a already holds 8.' },
    { q:'Why is <code>a = 8; b = 3;</code> not an acceptable answer?', options:['It declares the variables again','It is a syntax error','It only works for these two values — a swap has to work whatever a and b hold','It needs a semicolon'], answer:2, why:'The point is to move values between boxes. Typing the numbers in breaks the moment the inputs change, which is why this lesson feeds them in from prompt().' },
  ],
  notes:`
    <p>In Udemy this is a coding exercise with a <b>Check solution</b> button that tests your three lines. Here the Prompt answers box plays that role: if your swap is real, it works for any two values you queue.</p>
    <p>Stuck? Ask what you would do with the two buckets in real life. The answer needs one more container.</p>`
});


PG.add({
  id:'l080', index:80, udemyId:18126409, minutes:3, section:'s14', slug:'variables-exercise-solution', kind:'js',
  title:'Javascript Variables Exercise Solution',
  blurb:'The swap needs a third, empty bucket. <code>var c = a;</code> parks the first value somewhere safe, <code>a = b;</code> can then overwrite <code>a</code> without losing anything, and <code>b = c;</code> hands the parked value to <code>b</code>. Only <code>c</code> is new, and no numbers are typed.',
  tasks:[
    'Run it and check the console: <i>a is 8</i>, <i>b is 3</i>.',
    'Queue other values in the Prompt answers box, such as <code>sand, water</code>. The swap still works because nothing in it depends on the values.',
    'Move <code>a = b;</code> above <code>var c = a;</code> and predict the output before running. Use the Explore tab to step through what went wrong.',
    'Replace the three lines with the modern one-liner <code>[a, b] = [b, a];</code> and check you get the same result.'
  ],
  answers:'3, 8',
  files:{ 'script.js':`// a and b are filled from the Prompt answers box (3 and 8 are queued).
var a = prompt("a");
var b = prompt("b");

/*********** Do not change the code above 👆 ***********/

var c = a;   // 1. park a's value in a brand-new box
a = b;       // 2. now a can take b's value without losing anything
b = c;       // 3. b takes the value that was parked in c

/*********** Do not change the code below 👇 ***********/
console.log("a is " + a);
console.log("b is " + b);
` },
  solution:{ 'script.js':`// a and b are filled from the Prompt answers box (3 and 8 are queued).
var a = prompt("a");
var b = prompt("b");

/*********** Do not change the code above 👆 ***********/

var c = a;   // 1. park a's value in a brand-new box
a = b;       // 2. now a can take b's value without losing anything
b = c;       // 3. b takes the value that was parked in c

// The modern alternative does the same job in one line (it builds a
// temporary list [b, a] and unpacks it into a and b):
//   [a, b] = [b, a];

/*********** Do not change the code below 👇 ***********/
console.log("a is " + a);
console.log("b is " + b);
` },
  explore:[{
    title:'Step through a swap', height:400,
    note:'Choose a strategy and press <b>Next line</b>. Watch which box changes on each line — and where the trap version loses the 3.',
    html:`
<div class="knobs">
  <label>strategy
    <select id="strat">
      <option value="temp">var c = a;  a = b;  b = c;</option>
      <option value="naive">a = b;  b = a;   (the trap)</option>
      <option value="destr">[a, b] = [b, a];</option>
    </select>
  </label>
  <button id="next">Next line ▶</button>
  <button id="reset">Reset</button>
</div>
<div class="stage" style="display:flex;gap:18px;justify-content:center" id="boxes"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var plans = {
    temp: [
      { code: 'var c = a;', run: function(s){ s.c = s.a; }, says: "c is a brand-new box. It gets a copy of a's value, so the 3 is now safe." },
      { code: 'a = b;', run: function(s){ s.a = s.b; }, says: "a takes b's value. The 3 has gone from a, but c still has a copy." },
      { code: 'b = c;', run: function(s){ s.b = s.c; }, says: 'b takes the 3 that was parked in c. Swapped!' }
    ],
    naive: [
      { code: 'a = b;', run: function(s){ s.a = s.b; }, says: "a takes b's value. The 3 that a held is overwritten, and nothing kept a copy." },
      { code: 'b = a;', run: function(s){ s.b = s.a; }, says: "b takes a's value, which is already 8. Both boxes now hold 8." }
    ],
    destr: [
      { code: '[a, b] = [b, a];', run: function(s){ var t = [s.b, s.a]; s.a = t[0]; s.b = t[1]; }, says: 'The right-hand side builds a temporary list [8, 3] first, then unpacks it into a and b. There is still a temporary box; you just do not have to name it.' }
    ]
  };
  var strat = document.getElementById('strat'), boxes = document.getElementById('boxes'), ro = document.getElementById('ro');
  var state, step, changed;
  function box(name){
    var v = state[name], hot = changed.indexOf(name) !== -1;
    var look = v === null ? 'border:2px dashed #cfd5e6;color:#b9c0d4;background:#fff'
      : 'border:2px solid ' + (hot ? '#5b9cff' : '#dfe3ee') + ';background:' + (hot ? '#eaf2ff' : '#fff');
    return '<div style="text-align:center"><div style="width:88px;height:70px;border-radius:10px;display:flex;align-items:center;justify-content:center;font:700 26px ui-monospace,Menlo,monospace;' + look + '">' +
      (v === null ? '—' : v) + '</div><div style="margin-top:6px;font:600 13px ui-monospace,Menlo,monospace">' + name + '</div></div>';
  }
  function paint(msg){
    var plan = plans[strat.value];
    boxes.innerHTML = box('a') + box('b') + (strat.value === 'temp' ? box('c') : '');
    ro.textContent = plan.map(function(p, i){ return (i === step - 1 ? '▶ ' : (i < step - 1 ? '✓ ' : '  ')) + p.code; }).join('\\n') + '\\n\\n' + msg;
  }
  function reset(){ state = { a: '3', b: '8', c: null }; step = 0; changed = []; paint('Start: a holds 3 and b holds 8. Press Next line.'); }
  document.getElementById('next').addEventListener('click', function(){
    var plan = plans[strat.value];
    if (step >= plan.length) {
      changed = [];
      paint(state.a === '8' && state.b === '3' ? 'Finished: a is 8 and b is 3. Swapped.' : 'Finished: a is ' + state.a + ' and b is ' + state.b + '. Not a swap.');
      return;
    }
    var before = { a: state.a, b: state.b, c: state.c };
    plan[step].run(state);
    changed = ['a', 'b', 'c'].filter(function(k){ return before[k] !== state[k]; });
    step++;
    paint(plan[step - 1].says);
  });
  document.getElementById('reset').addEventListener('click', reset);
  strat.addEventListener('change', reset);
  reset();
<\/script>`
  }],
  quiz:[
    { q:'In <code>var c = a; a = b; b = c;</code>, what is <code>c</code> for?', options:['It holds the final answer','It keeps a copy of a\'s original value before a is overwritten','It counts the swaps','The console needs it'], answer:1, why:'Without the copy, the moment a = b runs the original value of a is gone for good.' },
    { q:'What happens if <code>a = b;</code> runs before <code>var c = a;</code>?', options:['Nothing changes','The swap still works','a\'s original value is lost, so both end up holding b\'s value','A syntax error'], answer:2, why:'Order matters: by the time c copies a, a already holds 8, so c gets 8 too and b = c changes nothing.' },
  ],
});


PG.add({
  id:'s14-naming', index:81, udemyId:12371642, minutes:7, section:'s14', slug:'naming', kind:'js',
  title:'Naming and Naming Conventions for Javascript Variables',
  blurb:'Some names JavaScript refuses outright: reserved words, names that start with a digit, and names containing spaces, hyphens or anything other than letters, digits, <code>$</code> and <code>_</code>. Everything else is legal, but convention asks for meaningful names written in <b>camelCase</b>. Names are case-sensitive.',
  tasks:[
    'Rename the four badly named variables so each name says what it holds, in camelCase.',
    'Quick-fire: uncomment the test lines <b>one at a time</b>, run, and note which names the browser rejects. Comment each one out again before trying the next (a rejected name stops the whole script).',
    'Prove names are case-sensitive: declare <code>myName</code> and <code>myname</code> with different values and log both.',
    'Open the Explore tab and test names of your own: it says which rule a name breaks, or which convention it ignores.'
  ],
  files:{ 'script.js':`// These all work, but they are terrible names. Rename them so a stranger
// could guess what each one holds — in camelCase.
let x = 42;
let THING = "Angela";
let user_score_total = 0;
let n = true;

console.log(x, THING, user_score_total, n);

// TODO: uncomment ONE line at a time, run, read the result, then comment it out again
// let my name = "Angela";
// let my-name = "Angela";
// let 3things = 3;
// let var = 1;
// let my_name = "Angela";
// let $price = 9.99;
// let my123 = 123;

// TODO: myName and myname — one variable or two?

` },
  solution:{ 'script.js':`const answerToEverything = 42;
const userName = "Angela";
let userScoreTotal = 0;
const isLoggedIn = true;

console.log(answerToEverything, userName, userScoreTotal, isLoggedIn);

// rejected (each one stops the whole script with a SyntaxError):
//   my name   - a space splits it into two things
//   my-name   - the hyphen is read as a minus sign
//   3things   - a name cannot start with a digit
//   var       - a reserved word; JavaScript already uses it

// allowed: letters, digits (not first), $ and _
let my_name = "Angela";   // legal, but not the JavaScript style
let $price = 9.99;
let my123 = 123;
console.log(my_name, $price, my123);

// case-sensitive: these are two different variables
let myName = "Angela";
let myname = "Jimmy";
console.log(myName, myname);
` },
  explore:[{
    title:'Is it a valid name?', height:290,
    note:'Type a variable name. The checker asks the browser whether it can declare it, explains which rule a rejected name breaks, and comments on the convention for legal ones.',
    html:`
<div class="knobs">
  <label>variable name <input type="text" id="n" value="userScoreFinal" style="width:200px"></label>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<p class="note">Try: my name · my-name · 3things · var · myvar · my_name · $price · userscorefinal · MAX_USERS · Score</p>
<script>
  var RESERVED = 'await break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static super switch this throw true try typeof var void while with yield'.split(' ');
  var input = document.getElementById('n'), ro = document.getElementById('ro');
  function reason(name){
    if (name.indexOf(' ') !== -1) return 'It contains a space, so JavaScript reads it as two separate things.';
    if (name.indexOf('-') !== -1) return 'The hyphen is read as a minus sign: my-name means "my minus name".';
    if ('0123456789'.indexOf(name[0]) !== -1) return 'A name cannot start with a digit (my123 is fine, 123my is not).';
    if (RESERVED.indexOf(name) !== -1) return '"' + name + '" is a reserved word: the language already uses it.';
    if (!/^[A-Za-z0-9_$]+$/.test(name)) return 'Only letters, digits, $ and _ are allowed.';
    return 'The browser refused it.';
  }
  function style(name){
    if (name === name.toUpperCase() && /[A-Z]/.test(name)) return 'Legal. ALL_CAPS is kept for fixed settings that never change, like MAX_USERS.';
    if (name.indexOf('_') > 0) return 'Legal, but JavaScript style is camelCase: myName rather than my_name.';
    if (name[0] !== name[0].toLowerCase()) return 'Legal, but a capital first letter is normally kept for classes and React components.';
    if (name.length <= 2) return 'Legal, but does it say what it holds? Very short names suit tiny jobs, like a loop counter i.';
    if (name === name.toLowerCase() && name.length > 9) return 'Legal. If this is several words, capitalise each new word so it reads easily: userscorefinal vs userScoreFinal.';
    var i = name.search(/[a-zA-Z]/);
    if (i === -1) return 'Legal, but a name without letters says nothing about what it holds.';
    var ch = name[i], flipped = ch === ch.toLowerCase() ? ch.toUpperCase() : ch.toLowerCase();
    return 'Legal camelCase. Remember that ' + name + ' and ' + name.slice(0, i) + flipped + name.slice(i + 1) + ' would be two different variables.';
  }
  function upd(){
    var name = input.value;
    if (!name) { ro.textContent = 'Type a name.'; return; }
    try { new Function('let ' + name + ' = 1;'); }
    catch (e) { ro.textContent = '✗ let ' + name + ' = 1;\\n\\nThe browser says: ' + e.name + ': ' + e.message + '\\nWhy: ' + reason(name); return; }
    ro.textContent = '✓ let ' + name + ' = 1;   the browser accepts it\\n\\n' + style(name);
  }
  input.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Which of these is a valid variable name?', options:['my-name','2ndPlace','my_name','my name'], answer:2, why:'Underscores are allowed. A hyphen reads as minus, a leading digit is forbidden, and a space splits the name in two.' },
    { q:'Which name follows the JavaScript convention?', options:['userScoreFinal','UserScoreFinal','user_score_final','userscorefinal'], answer:0, why:'camelCase: first word lower case, every later word starting with a capital.' },
    { q:'You press Cmd/Ctrl + K in the DevTools console. What happens to the variables you created?', options:['They are deleted','Nothing — only the visible output is cleared','They are reset to undefined','They are saved to a file'], answer:1, why:'Clearing the console only wipes the text on screen. The variables live in the page\'s memory until it is reloaded.' },
  ],
  notes:`
    <h3>Rules JavaScript enforces</h3>
    <ul>
      <li>Only letters, digits, <code>$</code> and <code>_</code>. No spaces, no hyphens.</li>
      <li>It cannot start with a digit: <code>my123</code> is fine, <code>123my</code> is not.</li>
      <li>It cannot be a reserved word (<code>var</code>, <code>let</code>, <code>class</code>, <code>if</code>…), though it may contain one: <code>myvar</code> is fine.</li>
      <li>Case matters: <code>userName</code> and <code>username</code> are two different variables.</li>
    </ul>
    <h3>Conventions people enforce</h3>
    <ul>
      <li><code>camelCase</code> for variables and functions: <code>userName</code>, <code>calculateTotal</code>.</li>
      <li><code>PascalCase</code> for classes and React components: <code>UserProfile</code>.</li>
      <li><code>SCREAMING_SNAKE_CASE</code> for fixed settings: <code>MAX_RETRIES</code>.</li>
      <li>Booleans read like a question: <code>isLoggedIn</code>, <code>hasPermission</code>. Functions start with a verb: <code>getUser</code>.</li>
    </ul>
    <h3>Clearing vs resetting in DevTools</h3>
    <p>Cmd/Ctrl+K clears the console output but your variables survive. A hard reload (right-click or long-press the reload button → Empty Cache and Hard Reload) starts the page from scratch.</p>`
});


PG.add({
  id:'s14-concat', index:82, udemyId:12371720, minutes:3, section:'s14', slug:'string-concatenation', kind:'js',
  title:'String Concatenation',
  blurb:'With strings, <code>+</code> joins instead of adding: <code>"Hello" + "Ada"</code> becomes <code>"HelloAda"</code>. Only what is inside the quotes gets joined, so every space has to be typed in by you. Later in the course you will also meet <b>template literals</b> — backticks with <code>${...}</code> holes — which make longer sentences easier to read.',
  tasks:[
    'Alert <code>"hello" + "world"</code> and notice the missing space. Fix it two ways: a separate <code>" "</code> string in the middle, and a space inside one of the pieces.',
    'The lecture\'s challenge: one alert that joins <code>message</code>, a space and <code>name</code> so it reads <i>Hello Ada</i>.',
    'Build a sentence that mixes text and a sum. Compare <code>"Total: " + 2 + 3</code> with <code>"Total: " + (2 + 3)</code> and explain the difference.',
    'Preview of later sections: write the same greeting as a template literal, <code>`${message} ${name}`</code>.'
  ],
  answers:'Ada',
  files:{ 'script.js':`const message = "Hello";
const name = prompt("What is your name?");

// TODO 1: alert "hello" + "world" — then fix the missing space two different ways


// TODO 2: one alert that joins message, a space and name


// TODO 3: "Total: " + 2 + 3   versus   "Total: " + (2 + 3)


// TODO 4: the same greeting as a template literal (backticks)
` },
  solution:{ 'script.js':`const message = "Hello";
const name = prompt("What is your name?");

alert("hello" + "world");         // helloworld — nothing adds a space for you
alert("hello" + " " + "world");   // a space string in the middle
alert("hello" + " world");        // or a space inside one of the pieces

alert(message + " " + name);      // Hello Ada

// + works left to right: once there is a string, everything after it gets joined
console.log("Total: " + 2 + 3);     // Total: 23
console.log("Total: " + (2 + 3));   // Total: 5 — the brackets do the sum first

// template literal: backticks, with \${ } holes for values
console.log(\`\${message} \${name}, welcome back!\`);
` },
  quiz:[
    { q:'What does <code>"hello" + "world"</code> produce?', options:['"hello world"','"helloworld"','an error','"hello+world"'], answer:1, why:'+ joins exactly what is inside the quotes. A space only appears if one of the strings contains it.' },
    { q:'What does <code>"Total: " + 2 + 3</code> produce?', options:['"Total: 5"','an error','"Total: 23"','5'], answer:2, why:'It runs left to right. "Total: " + 2 is already a string, so the 3 gets joined on too. Brackets around 2 + 3 make the sum happen first.' },
    { q:'Which line greets the user with the value stored in <code>name</code>?', options:['alert("Hello name");','alert("Hello " + name);','alert("Hello" + "name");','alert(Hello + name);'], answer:1, why:'The variable must sit outside the quotes; inside them it is just the letters n-a-m-e. The space goes inside the "Hello " string.' },
  ],
  notes:`
    <h3>Two ways to build a sentence</h3>
    <pre>"Hello" + " " + name + "!"        // concatenation (this lecture)
\`Hello \${name}!\`                   // template literal (later in the course)</pre>
    <p>Template literals use <b>backticks</b> (the key left of 1), not quotes. Anything inside <code>\${ }</code> is worked out as JavaScript, so <code>\${price * qty}</code> works. They also avoid forgotten spaces and stray <code>+</code> signs.</p>
    <h3>A trap with the variable name <code>name</code></h3>
    <p>In a browser, a top-level <code>var name</code> is really <code>window.name</code>, a built-in that turns whatever you store into a string. The greeting still works, but a name such as <code>userName</code> avoids surprises later.</p>`
});


PG.add({
  id:'s14-length', index:83, udemyId:12371744, minutes:6, section:'s14', slug:'string-length', kind:'js',
  title:'String Lengths and Retrieving the Number of Characters',
  blurb:'Every string knows how many characters it holds: <code>tweet.length</code>, with no brackets because it is a stored property rather than an action. Spaces and punctuation count. The lecture also introduces comments — <code>//</code> for one line, <code>/* ... */</code> for a block — and builds a tweet character counter.',
  tasks:[
    'Prompt for a tweet and store <code>tweet.length</code> in a variable called <code>tweetCount</code>.',
    'Alert <i>You have written N characters, you have M characters remaining.</i> where M is 140 minus the count.',
    'Delete the brackets around <code>(140 - tweetCount)</code> and run. Why does the alert now say <i>NaN</i>? Put the brackets back.',
    'Comments: switch one line off with <code>//</code> and a group of lines off with <code>/* ... */</code>.',
    'In a real browser, pressing Cancel makes <code>prompt()</code> return <code>null</code> (this playground gives an empty string instead). Set <code>let empty = null;</code> and log <code>empty.length</code> to see the error you would get, then comment it out.'
  ],
  answers:'Good morning everyone!',
  files:{ 'script.js':`const tweet = prompt("Compose your tweet:");

// TODO 1: store the number of characters in tweetCount


// TODO 2: alert how many characters were written and how many are left out of 140


// TODO 3: comments — turn one line off with //, and several lines off with /* ... */

` },
  solution:{ 'script.js':`const tweet = prompt("Compose your tweet:");

const tweetCount = tweet.length;     // a property: no brackets
alert("You have written " + tweetCount + " characters, you have " + (140 - tweetCount) + " characters remaining.");

// without the brackets JavaScript joins first, then tries to subtract from text:
// ("...you have " + 140) - tweetCount  ->  NaN
console.log("You have " + 140 - tweetCount + " characters remaining.");   // NaN characters remaining.

// spaces and punctuation are characters too
console.log("".length);       // 0
console.log("   ".length);    // 3
console.log("a b".length);    // 3

/* A block comment can run
   over several lines. */

// what pressing Cancel would give you in a real browser:
// let empty = null;
// empty.length;   // TypeError: Cannot read properties of null (reading 'length')
` },
  explore:[{
    title:'Live character counter', height:400,
    note:'Type in the box. The readout shows the two expressions from the lecture and the alert they build. Tick the checkbox to see what the missing brackets do.',
    html:`
<div class="knobs">
  <label>limit <select id="lim"><option>140</option><option>280</option></select></label>
  <label><input type="checkbox" id="bug"> leave out the brackets around (limit - tweetCount)</label>
</div>
<div class="stage" style="padding:12px">
  <textarea id="t" style="width:100%;height:84px;font:inherit;border:1px solid #cfd5e6;border-radius:8px;padding:8px;resize:vertical">Good morning everyone!</textarea>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var t = document.getElementById('t'), lim = document.getElementById('lim'), bug = document.getElementById('bug'), ro = document.getElementById('ro');
  function esc(s){ return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function upd(){
    var tweet = t.value, limit = +lim.value, tweetCount = tweet.length, msg;
    if (bug.checked) msg = "You have written " + tweetCount + " characters, you have " + limit - tweetCount + " characters remaining.";
    else msg = "You have written " + tweetCount + " characters, you have " + (limit - tweetCount) + " characters remaining.";
    var left = limit - tweetCount;
    ro.innerHTML = 'tweet.length              → ' + tweetCount + '\\n' +
      limit + ' - tweet.length        → <span style="color:' + (left < 0 ? '#ff8a8a' : '#7ee0a8') + '">' + left + '</span>\\n\\n' +
      'alert: ' + esc(msg) +
      (bug.checked ? '\\n\\nWithout brackets the line runs left to right: the text and ' + limit + ' are joined first, then JavaScript tries to subtract ' + tweetCount + ' from a piece of text. The result is NaN, short for "not a number".' : '');
  }
  [t, lim, bug].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What is <code>"a b".length</code>?', options:['2','3','1','"a b"'], answer:1, why:'The space is a character too: a, space, b.' },
    { q:'Why does <code>"left: " + 140 - count</code> give NaN?', options:['140 is too big','length needs brackets','count is undefined','The + runs first and makes text; text minus a number is NaN'], answer:3, why:'+ and - run left to right, so the string is built first. Brackets — (140 - count) — make the subtraction happen before the join.' },
    { q:'Which of these is a JavaScript comment?', options:['# like this','&lt;!-- like this --&gt;','// like this','/ like this'], answer:2, why:'// comments out the rest of a line, and /* ... */ wraps a block. The &lt;!-- --&gt; form belongs to HTML.' },
  ],
  notes:`
    <h3>Property, not method</h3>
    <p><code>tweet.length</code> has no brackets. Compare <code>tweet.toUpperCase()</code>, a method, which needs them. A property is a stored fact about the value; a method is an action that has to be run.</p>
    <h3>Brackets inside concatenation</h3>
    <pre>"left: " + (140 - count)   // the sum first, then the join   ✓
"left: " + 140 - count     // the join first, then text minus a number = NaN   ✗</pre>
    <h3>Arrays have it too</h3>
    <p><code>[1, 2, 3].length</code> is 3. Same idea, which is why loops over arrays use it.</p>`
});


PG.add({
  id:'s14-slice', index:84, udemyId:12371756, minutes:9, section:'s14', slug:'slicing', kind:'js',
  title:'Slicing and Extracting Parts of a String',
  blurb:'<code>text.slice(start, end)</code> copies a piece out of a string. Positions count from <b>0</b>; the start is included and the end is <b>not</b>, so <i>end − start</i> is always the number of characters you get back. The lecture uses it to cut a tweet down to 140 characters.',
  tasks:[
    'Warm up on <code>"Angela"</code>: predict, then log <code>slice(0, 1)</code>, <code>slice(5, 6)</code>, <code>slice(0, 3)</code> and <code>slice(1, 5)</code>. End minus start tells you how many letters to expect.',
    'The lecture\'s exercise: cut whatever the user types down to its first 140 characters with <code>tweet.slice(0, 140)</code> and alert it. The queued answer is 173 characters long.',
    'Check your cut by logging the <code>.length</code> of the result.',
    'Collapse the three lines into one: <code>alert(prompt("Compose your tweet:").slice(0, 140));</code> — a call can stand in for the value it returns.',
    'Extras: <code>.slice(-3)</code> takes the last three characters and <code>.slice(5)</code> runs from position 5 to the end. Try both in the Explore tab.'
  ],
  answers:'Just finished my first week of JavaScript and I can already slice strings and count characters which feels like a superpower because every tweet I write ends up far too long',
  files:{ 'script.js':`const name = "Angela";

// TODO 1: predict, then log name.slice(0, 1), (5, 6), (0, 3) and (1, 5)


const tweet = prompt("Compose your tweet:");

// TODO 2: keep only the first 140 characters and alert them


// TODO 3: log the length of what you kept

` },
  solution:{ 'script.js':`const name = "Angela";
//              012345   <- positions
console.log(name.slice(0, 1));   // "A"     1 - 0 = 1 character
console.log(name.slice(5, 6));   // "a"     the last letter sits at position 5
console.log(name.slice(0, 3));   // "Ang"   3 - 0 = 3 characters
console.log(name.slice(1, 5));   // "ngel"  5 - 1 = 4 characters

const tweet = prompt("Compose your tweet:");
const tweetUnder140 = tweet.slice(0, 140);
alert(tweetUnder140);
console.log("Kept " + tweetUnder140.length + " of " + tweet.length + " characters");

// the same job in one line (it replaces the three lines above):
// alert(prompt("Compose your tweet:").slice(0, 140));

// extras
console.log("JavaScript".slice(-6));   // "Script"  negative = count back from the end
console.log("JavaScript".slice(4));    // "Script"  no end = all the way to the end
` },
  explore:[{
    title:'Slice visualiser', height:380,
    note:'Change the text, the start and the end. The highlighted boxes are what <code>slice</code> returns. Untick <b>end</b> to leave it out.',
    html:`
<div class="knobs">
  <label>text <input type="text" id="w" value="JavaScript" style="width:160px"></label>
  <label>start <input type="number" id="s" value="0" style="width:64px"></label>
  <label><input type="checkbox" id="useEnd" checked> end <input type="number" id="e" value="4" style="width:64px"></label>
</div>
<div class="stage" id="cells" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var w = document.getElementById('w'), s = document.getElementById('s'), e = document.getElementById('e');
  var useEnd = document.getElementById('useEnd'), cells = document.getElementById('cells'), ro = document.getElementById('ro');
  function norm(i, len){ return i < 0 ? Math.max(len + i, 0) : Math.min(i, len); }
  function esc(c){ return c === ' ' ? '&nbsp;' : c.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function upd(){
    var text = w.value, len = text.length, start = parseInt(s.value, 10) || 0, hasEnd = useEnd.checked;
    var end = hasEnd ? (parseInt(e.value, 10) || 0) : len;
    e.disabled = !hasEnd;
    var a = norm(start, len), b = hasEnd ? norm(end, len) : len, html = '';
    for (var i = 0; i < len; i++) {
      var on = i >= a && i < b;
      html += '<div style="text-align:center;min-width:30px">' +
        '<div style="padding:8px 6px;border-radius:6px;font:700 18px ui-monospace,Menlo,monospace;border:2px solid ' + (on ? '#5b9cff' : '#dfe3ee') + ';background:' + (on ? '#eaf2ff' : '#fff') + '">' + esc(text[i]) + '</div>' +
        '<div style="font:11px ui-monospace,Menlo,monospace;color:#3c435c;margin-top:3px">' + i + '</div>' +
        '<div style="font:10px ui-monospace,Menlo,monospace;color:#9aa1b8">' + (i - len) + '</div></div>';
    }
    cells.innerHTML = html || '<span class="note">type some text</span>';
    var result = hasEnd ? text.slice(start, end) : text.slice(start);
    ro.textContent = JSON.stringify(text) + '.slice(' + start + (hasEnd ? ', ' + end : '') + ')  →  ' + JSON.stringify(result) + '\\n' +
      'characters returned: ' + result.length +
      (hasEnd && start >= 0 && end >= start && end <= len ? '   (end − start = ' + end + ' − ' + start + ' = ' + (end - start) + ')' : '') + '\\n\\n' +
      'Top row: positions counting from 0. Bottom row: the negative positions slice also accepts, counting back from the end.' +
      (b <= a && len ? '\\nThe end is at or before the start, so the result is an empty string.' : '');
  }
  [w, s, e, useEnd].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>"Angela".slice(0, 3)</code> return?', options:['"Ang"','"Ange"','"ngel"','"An"'], answer:0, why:'Positions 0, 1 and 2 are included; position 3 is where it stops. 3 − 0 = 3 characters.' },
    { q:'How many characters does <code>text.slice(5, 12)</code> return, if the text is long enough?', options:['5','7','12','17'], answer:1, why:'End minus start: 12 − 5 = 7.' },
    { q:'What does <code>"Angela".slice(1)</code> return?', options:['"A"','"Angela"','"ngela"','an error'], answer:2, why:'With no end, slice runs from the start position to the end of the string.' },
  ],
  notes:`
    <h3>Zero-indexed, end-exclusive</h3>
    <pre>"JavaScript"
 0123456789

.slice(0, 4)   ->  "Java"      positions 0, 1, 2, 3
.slice(4)      ->  "Script"    from 4 to the end
.slice(-6)     ->  "Script"    the last 6
.slice(0, 1)   ->  "J"         just the first character</pre>
    <p>"End not included" is the convention almost everywhere in JavaScript, so it pays to get comfortable with it now.</p>
    <h3>Editor shortcut</h3>
    <p>Cmd+/ (Mac) or Ctrl+/ (Windows) comments the selected lines in or out. Handy for switching old experiments off without deleting them.</p>`
});


PG.add({
  id:'s14-casing', index:85, udemyId:12371788, minutes:4, section:'s14', slug:'changing-casing', kind:'js',
  title:'Challenge: Changing Casing in Text',
  blurb:'<code>toUpperCase()</code> and <code>toLowerCase()</code> hand back a <b>new</b> string in capitals or small letters; the original stays as it was unless you reassign it. The challenge: however the user types their name, greet them with a capital first letter and the rest in lower case.',
  tasks:[
    'Warm-up: with <code>let word = "Angela";</code>, run <code>word.toUpperCase();</code> on a line of its own, then log <code>word</code>. Unchanged! Keep the change by reassigning: <code>word = word.toUpperCase();</code>',
    'Challenge: prompt for the user\'s first name and store it.',
    'Slice off the first character and turn it into a capital.',
    'Slice off the rest of the name and turn it into small letters.',
    'Join them and alert the greeting. The queued answer <code>aDa lOveLace</code> should come out as <i>Hello Ada lovelace</i> — only the very first letter becomes a capital. Try your own oddly typed names too.'
  ],
  answers:'aDa lOveLace',
  files:{ 'script.js':`// Warm-up
let word = "Angela";
// TODO: call word.toUpperCase(); on its own line, then log word. What happened?


// Challenge
const name = prompt("What is your first name?");

// TODO: capitalise the first letter, lower-case the rest, then alert "Hello " + the result

` },
  solution:{ 'script.js':`// Warm-up: the method returns a NEW string; word only changes when you reassign it
let word = "Angela";
word.toUpperCase();
console.log(word);              // Angela — unchanged
word = word.toUpperCase();
console.log(word);              // ANGELA

// Challenge
const name = prompt("What is your first name?");

const firstLetter = name.slice(0, 1).toUpperCase();
const restOfName = name.slice(1, name.length).toLowerCase();
alert("Hello " + firstLetter + restOfName);

// bonus, using tools from later sections: capitalise EVERY word
const everyWord = name
  .split(" ")
  .map(function (part) {
    return part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase();
  })
  .join(" ");
console.log("Every word: " + everyWord);
` },
  quiz:[
    { q:'After <code>let word = "angela"; word.toUpperCase();</code> what does <code>word</code> hold?', options:['"ANGELA"','"angela"','"Angela"','undefined'], answer:1, why:'String methods never edit the original. The capitals only stick if you write word = word.toUpperCase();' },
    { q:'Which expression gives the first letter of <code>name</code> as a capital?', options:['name.toUpperCase(0)','name.slice(1).toUpperCase()','name[1].toUpperCase','name.slice(0, 1).toUpperCase()'], answer:3, why:'slice(0, 1) isolates the first character, and toUpperCase() — with its brackets — turns it into a capital.' },
    { q:'Why do <code>toUpperCase</code> and <code>toLowerCase</code> need brackets?', options:['They are methods, and a method only runs when you call it','They take the text as an argument','Brackets make them faster','They do not need them'], answer:0, why:'Without brackets you are only referring to the method, not running it.' },
  ],
  notes:`
    <h3>The two methods</h3>
    <ul>
      <li><code>.toUpperCase()</code> — every character in capitals.</li>
      <li><code>.toLowerCase()</code> — every character in small letters.</li>
    </ul>
    <p>Both need the brackets, and both return a <b>new</b> string: strings in JavaScript cannot be edited in place.</p>
    <h3>Chaining</h3>
    <p>Because each method returns a string, you can keep going: <code>name.slice(0, 1).toUpperCase()</code> slices first, then capitalises the result. Read it left to right.</p>`
});


PG.add({
  id:'l086', index:86, udemyId:12371812, minutes:9, section:'s14', slug:'changing-casing-solution', kind:'js',
  title:'Challenge: Changing String Casing Solution',
  blurb:'The real lesson is <b>decomposition</b>: split a problem into steps small enough to write and check one at a time. Store the name; isolate the first character and capitalise it; isolate the rest using <code>name.length</code> so any name works; lower-case the rest so input like <i>angELA</i> comes out right; then join and greet.',
  tasks:[
    'Run it with the queued answer <code>angELA</code>. The console shows every intermediate value, then the alert says <i>Hello, Angela</i>.',
    'Comment out step d and run again. Which letters stay in capitals, and why did the lecture add that step?',
    'Replace <code>name.length</code> with a hard-coded <code>6</code>, then queue the name <code>bartholomew</code>. What gets cut off? Put <code>name.length</code> back.',
    'Edge cases: empty the Prompt answers box (prompt then returns an empty string) and try a two-word name. What would you change?'
  ],
  answers:'angELA',
  files:{ 'script.js':`const name = prompt("What is your first name?");

// a) isolate the first character
const firstChar = name.slice(0, 1);
// b) turn it into a capital
const upperCaseFirstChar = firstChar.toUpperCase();
// c) isolate everything after it — name.length works for a name of any size
let restOfName = name.slice(1, name.length);
// d) lower-case the rest, so input like "angELA" comes out right
restOfName = restOfName.toLowerCase();
// e) join the pieces
const capitalisedName = upperCaseFirstChar + restOfName;

// check every step, the way the lecture checks each variable in the console
console.log("name:               " + name);
console.log("firstChar:          " + firstChar);
console.log("upperCaseFirstChar: " + upperCaseFirstChar);
console.log("restOfName:         " + restOfName);
console.log("capitalisedName:    " + capitalisedName);

alert("Hello, " + capitalisedName);
` },
  solution:{ 'script.js':`const name = prompt("What is your first name?");

// a) isolate the first character
const firstChar = name.slice(0, 1);
// b) turn it into a capital
const upperCaseFirstChar = firstChar.toUpperCase();
// c) isolate everything after it — name.length works for a name of any size
let restOfName = name.slice(1, name.length);
// d) lower-case the rest, so input like "angELA" comes out right
restOfName = restOfName.toLowerCase();
// e) join the pieces
const capitalisedName = upperCaseFirstChar + restOfName;

// check every step, the way the lecture checks each variable in the console
console.log("name:               " + name);
console.log("firstChar:          " + firstChar);
console.log("upperCaseFirstChar: " + upperCaseFirstChar);
console.log("restOfName:         " + restOfName);
console.log("capitalisedName:    " + capitalisedName);

alert("Hello, " + capitalisedName);

// Once every step works, the same logic fits on one line:
// alert("Hello, " + name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase());
` },
  explore:[{
    title:'Watch every step', height:330,
    note:'Type a name the way a careless user might. Each line shows the value one step of the solution produces.',
    html:`
<div class="knobs">
  <label>name typed by the user <input type="text" id="n" value="angELA" style="width:180px"></label>
  <label><input type="checkbox" id="skip"> skip step d</label>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var n = document.getElementById('n'), skip = document.getElementById('skip'), ro = document.getElementById('ro');
  function q(s){ return JSON.stringify(s); }
  function upd(){
    var name = n.value;
    var firstChar = name.slice(0, 1);
    var upperCaseFirstChar = firstChar.toUpperCase();
    var restOfName = name.slice(1, name.length);
    var lowered = restOfName.toLowerCase();
    var finalRest = skip.checked ? restOfName : lowered;
    ro.textContent =
      'name = prompt(...)                                  → ' + q(name) + '\\n\\n' +
      'a) firstChar = name.slice(0, 1)                     → ' + q(firstChar) + '\\n' +
      'b) upperCaseFirstChar = firstChar.toUpperCase()     → ' + q(upperCaseFirstChar) + '\\n' +
      'c) restOfName = name.slice(1, name.length)          → ' + q(restOfName) + '\\n' +
      'd) restOfName = restOfName.toLowerCase()            → ' + (skip.checked ? '(skipped)' : q(lowered)) + '\\n' +
      'e) capitalisedName = upperCaseFirstChar + restOfName → ' + q(upperCaseFirstChar + finalRest) + '\\n\\n' +
      'alert: Hello, ' + upperCaseFirstChar + finalRest;
  }
  n.addEventListener('input', upd); skip.addEventListener('change', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Why does the lecture use <code>name.slice(1, name.length)</code> rather than <code>name.slice(1, 6)</code>?', options:['6 is a syntax error','It works for a name of any length','It is faster','slice needs a variable'], answer:1, why:'6 only fits a six-letter name like Angela. name.length adapts to whatever the user typed.' },
    { q:'What is the point of breaking the challenge into steps a to e?', options:['Each small step can be written and checked on its own before moving on','JavaScript needs five variables','It makes the code run faster','Udemy\'s checker requires it'], answer:0, why:'Small steps you can verify one by one are how big problems become manageable — the skill matters more than this particular code.' },
  ],
});


PG.add({
  id:'s14-arithmetic', index:87, udemyId:12371848, minutes:6, section:'s14', slug:'arithmetic', kind:'js',
  title:'Basic Arithmetic and the Modulo Operator in Javascript',
  blurb:'<code>+ - * /</code> work as in maths, including the order: <code>*</code> and <code>/</code> before <code>+</code> and <code>-</code>, unless brackets say otherwise. <code>%</code> (modulo) gives the <b>remainder</b> of a division — the standard way to test whether a number is even. The exercise converts a dog\'s age into human years.',
  tasks:[
    'Dog-age converter: turn the prompt answer into human years with <code>((dogAge - 2) * 4) + 21</code> and alert it. With the queued answer 5 you should get 33.',
    'Predict each remainder, then log <code>9 % 6</code>, <code>6 % 4</code>, <code>12 % 8</code> and <code>45 % 2</code>.',
    'Log <code>45 % 2</code> and decide from the result whether 45 is even (remainder 0) or odd (remainder 1).',
    'Precedence: log <code>3 + 5 * 2</code> and <code>(3 + 5) * 2</code>. Brackets are worth adding even where they change nothing, because they show the next reader your intent.',
    '<code>prompt()</code> returns text. Compare <code>dogAge + 2</code> with <code>Number(dogAge) + 2</code>. Minus and times convert text to a number for you; plus joins it instead.'
  ],
  answers:'5',
  files:{ 'script.js':`const dogAge = prompt("How old is your dog?");   // careful: prompt always gives back text

// TODO 1: convert to human years with ((dogAge - 2) * 4) + 21 and alert the result


// TODO 2: predict, then log the remainders
console.log(9 % 6);
// 6 % 4, 12 % 8, 45 % 2 ...


// TODO 3: precedence — 3 + 5 * 2 versus (3 + 5) * 2


// TODO 4: dogAge + 2 versus Number(dogAge) + 2

` },
  solution:{ 'script.js':`const dogAge = prompt("How old is your dog?");   // careful: prompt always gives back text

const humanAge = ((dogAge - 2) * 4) + 21;
alert("If your dog were human, it would be " + humanAge + " years old.");

// modulo = what is left over after dividing
console.log(9 % 6);    // 3   (6 fits into 9 once, 3 left over)
console.log(6 % 4);    // 2   (whereas 6 / 4 is 1.5)
console.log(12 % 8);   // 4
console.log(45 % 2);   // 1   -> 45 is odd (an even number leaves 0)

// same order as school maths: brackets, then * and /, then + and -
console.log(3 + 5 * 2);      // 13
console.log((3 + 5) * 2);    // 16

// - and * turn the text "5" into a number for you; + joins text instead
console.log(dogAge + 2);           // 52
console.log(Number(dogAge) + 2);   // 7
` },
  explore:[{
    title:'Operator lab', height:470,
    note:'Change a and b. The highlighted row is the remainder; the last two rows show what brackets do to the order.',
    html:`
<div class="knobs">
  <label>a <input type="number" id="a" value="9" style="width:80px"></label>
  <label>b <input type="number" id="b" value="6" style="width:80px"></label>
</div>
<div class="stage"><table class="grid" id="tbl" style="width:100%"></table></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var A = document.getElementById('a'), B = document.getElementById('b'), tbl = document.getElementById('tbl'), ro = document.getElementById('ro');
  function fmt(x){ return isFinite(x) ? String(Math.round(x * 1000000) / 1000000) : String(x); }
  function upd(){
    var a = Number(A.value), b = Number(B.value);
    var rows = [['a + b', a + b], ['a - b', a - b], ['a * b', a * b], ['a / b', a / b], ['a % b', a % b], ['a + b * 2', a + b * 2], ['(a + b) * 2', (a + b) * 2]];
    tbl.innerHTML = '<tr><th>expression</th><th>with your numbers</th><th>result</th></tr>' + rows.map(function(r){
      var filled = r[0].replace(/a/g, '(' + a + ')').replace(/b/g, '(' + b + ')').replace(/\\((\\d+(\\.\\d+)?)\\)/g, '$1');
      return '<tr' + (r[0] === 'a % b' ? ' style="background:#fff7e0"' : '') + '><td><code>' + r[0] + '</code></td><td><code>' + filled + '</code></td><td><b>' + fmt(r[1]) + '</b></td></tr>';
    }).join('');
    var lines = [];
    if (b === 0) lines.push('Dividing by 0 gives Infinity, and there is no sensible remainder (NaN).');
    else lines.push(b + ' fits into ' + a + ' ' + Math.trunc(a / b) + ' whole time' + (Math.abs(Math.trunc(a / b)) === 1 ? '' : 's') + ', leaving ' + fmt(a % b) + '. That leftover is a % b.');
    lines.push(a + ' % 2 = ' + fmt(a % 2) + ', so ' + a + ' is ' + (a % 2 === 0 ? 'even' : (Number.isInteger(a) ? 'odd' : 'not a whole number')) + '.');
    lines.push('In a + b * 2 the multiplication happens first. Brackets change the order.');
    ro.textContent = lines.join('\\n');
  }
  A.addEventListener('input', upd); B.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What is <code>14 % 4</code>?', options:['3.5','2','3','0'], answer:1, why:'4 fits into 14 three times (12), leaving 2.' },
    { q:'What does <code>3 + 5 * 2</code> evaluate to?', options:['16','10','13','25'], answer:2, why:'Multiplication happens before addition: 5 * 2 = 10, then 3 + 10 = 13.' },
    { q:'A whole number <code>n</code> is even when…', options:['n % 2 === 0','n / 2 === 0','n % 2 === 1','n * 2 === 0'], answer:0, why:'Even numbers divide by 2 with nothing left over, so the remainder is 0.' },
  ],
  notes:`
    <h3>The operators</h3>
    <table>
      <tr><th>Op</th><th>Does</th><th>Example</th></tr>
      <tr><td><code>+</code></td><td>Add (or join strings!)</td><td><code>5 + 2</code> → 7</td></tr>
      <tr><td><code>-</code></td><td>Subtract</td><td><code>5 - 2</code> → 3</td></tr>
      <tr><td><code>*</code></td><td>Multiply</td><td><code>5 * 2</code> → 10</td></tr>
      <tr><td><code>/</code></td><td>Divide</td><td><code>5 / 2</code> → 2.5</td></tr>
      <tr><td><code>%</code></td><td>Remainder</td><td><code>5 % 2</code> → 1</td></tr>
    </table>
    <h3>What modulo is for</h3>
    <ul>
      <li><b>Even or odd</b>: <code>n % 2</code> is 0 for even numbers.</li>
      <li><b>Every nth time</b>: <code>i % 3 === 0</code> inside a loop (FizzBuzz, in section 15).</li>
      <li><b>Wrapping around</b>: <code>(i + 1) % list.length</code> goes back to 0 after the last item.</li>
    </ul>`
});


PG.add({
  id:'s14-increment', index:88, udemyId:12371872, minutes:2, section:'s14', slug:'increment', kind:'js',
  title:'Increment and Decrement Expressions',
  blurb:'Shorthands for the changes you make most often: <code>x++</code> adds one, <code>x--</code> takes one away, and <code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code> apply an operation and store the result back in the same variable.',
  tasks:[
    'Predict what each line of the starter prints, then run it and check.',
    'Work out the difference between <code>x++</code> and <code>++x</code>. The Explore tab shows both side by side.',
    'Rewrite <code>score = score + 10</code> with the shorthand, then add a second variable with <code>score += bonus</code>.',
    'Notice that <code>a + 1</code> on its own changes nothing: only <code>++</code>, <code>--</code> and the forms with <code>=</code> store a new value.'
  ],
  files:{ 'script.js':`let a = 5, b = 5, c = 5, d = 5, e = 5;

// TODO 1: predict each of these before you run it
console.log(a + 1);
console.log(++b);
console.log(--c);
console.log(d += 2);
console.log(e -= 2);

console.log("after:", a, b, c, d, e);

// TODO 2: rewrite this with the shorthand, then add bonus to score the same way
let score = 0;
const bonus = 5;
score = score + 10;
console.log("score:", score);
` },
  solution:{ 'script.js':`let a = 5, b = 5, c = 5, d = 5, e = 5;

console.log(a + 1);   // 6  — but a itself is UNCHANGED
console.log(++b);     // 6  — b is now 6
console.log(--c);     // 4  — c is now 4
console.log(d += 2);  // 7  — d is now 7
console.log(e -= 2);  // 3  — e is now 3

console.log("after:", a, b, c, d, e);   // 5 6 4 7 3

let score = 0;
const bonus = 5;
score += 10;          // same as score = score + 10
score += bonus;       // the right-hand side can be another variable
console.log("score:", score);   // 15

// prefix vs postfix — the difference is WHAT THE EXPRESSION GIVES BACK
let x = 5;
console.log(x++);   // prints 5, THEN x becomes 6
console.log(x);     // 6

let y = 5;
console.log(++y);   // y becomes 6 first, THEN it prints 6

// the rest of the family
score -= 3;   console.log(score);  // 12
score *= 2;   console.log(score);  // 24
score /= 4;   console.log(score);  // 6
` },
  explore:[{
    title:'Press the operators', height:360,
    note:'Each button changes <code>x</code> and stores the result back in it. The two buttons at the bottom show why <code>x++</code> and <code>++x</code> print different numbers.',
    html:`
<div class="knobs">
  <button data-op="x++">x++</button>
  <button data-op="x--">x--</button>
  <button data-op="x += 5">x += 5</button>
  <button data-op="x -= 3">x -= 3</button>
  <button data-op="x *= 2">x *= 2</button>
  <button data-op="x /= 2">x /= 2</button>
  <button id="reset">reset: let x = 5;</button>
</div>
<div class="stage" style="text-align:center">
  <div style="font:700 46px ui-monospace,Menlo,monospace" id="xv">5</div>
  <div class="note" style="margin:4px 0 0">the value stored in x</div>
</div>
<div class="knobs">
  <button id="post">console.log(x++);</button>
  <button id="pre">console.log(++x);</button>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var x = 5, xv = document.getElementById('xv'), ro = document.getElementById('ro');
  var longForm = { 'x++': 'x = x + 1', 'x--': 'x = x - 1', 'x += 5': 'x = x + 5', 'x -= 3': 'x = x - 3', 'x *= 2': 'x = x * 2', 'x /= 2': 'x = x / 2' };
  function apply(op){
    var before = x;
    if (op === 'x++') x++;
    else if (op === 'x--') x--;
    else if (op === 'x += 5') x += 5;
    else if (op === 'x -= 3') x -= 3;
    else if (op === 'x *= 2') x *= 2;
    else if (op === 'x /= 2') x /= 2;
    xv.textContent = x;
    ro.textContent = op + '   is short for   ' + longForm[op] + '\\nx was ' + before + ', now x is ' + x;
  }
  document.querySelectorAll('[data-op]').forEach(function(btn){
    btn.addEventListener('click', function(){ apply(btn.getAttribute('data-op')); });
  });
  document.getElementById('reset').addEventListener('click', function(){ x = 5; xv.textContent = x; ro.textContent = 'x is back to 5.'; });
  document.getElementById('post').addEventListener('click', function(){
    var printed = x++; xv.textContent = x;
    ro.textContent = 'console.log(x++) printed ' + printed + ' (the OLD value), and only afterwards did x become ' + x + '.';
  });
  document.getElementById('pre').addEventListener('click', function(){
    var printed = ++x; xv.textContent = x;
    ro.textContent = 'console.log(++x) made x ' + x + ' first, then printed ' + printed + '.';
  });
  ro.textContent = 'Press a button.';
<\/script>`
  }],
  quiz:[
    { q:'With <code>let x = 5;</code>, what is x after <code>x += 3;</code>?', options:['5','3','8','53'], answer:2, why:'x += 3 means x = x + 3, so x now holds 8.' },
    { q:'With <code>let y = 5;</code>, what does <code>console.log(y++)</code> print?', options:['5','6','4','undefined'], answer:0, why:'Postfix ++ hands back the old value (5) and then increases y to 6.' },
    { q:'Which line does <b>not</b> change <code>a</code>?', options:['a++;','a += 1;','a + 1;','a = a + 1;'], answer:2, why:'a + 1 works out a value and throws it away. Nothing is stored unless there is an = or ++/--.' },
  ],
  notes:`
    <h3>The shorthands</h3>
    <table>
      <tr><th>Short</th><th>Long</th></tr>
      <tr><td><code>x++</code></td><td><code>x = x + 1</code></td></tr>
      <tr><td><code>x--</code></td><td><code>x = x - 1</code></td></tr>
      <tr><td><code>x += 5</code></td><td><code>x = x + 5</code></td></tr>
      <tr><td><code>x *= 2</code></td><td><code>x = x * 2</code></td></tr>
    </table>
    <h3>Prefix vs postfix</h3>
    <p><code>x++</code> gives back the old value and then increments; <code>++x</code> increments and then gives back the new value. In a loop header like <code>for (let i = 0; i &lt; 5; i++)</code> it makes no difference, because the value is thrown away. Inside a <code>console.log</code> it makes all the difference.</p>`
});


PG.add({
  id:'s14-functions-1', index:89, udemyId:12371950, minutes:11, section:'s14', slug:'functions-1', kind:'js',
  title:'Functions Part 1: Creating and Calling Functions',
  blurb:'A function packs a sequence of instructions under one name. <b>Declaring</b> it (<code>function getMilk() { ... }</code>) only stores the instructions; <b>calling</b> it (<code>getMilk();</code>) runs them, as often as you like. That keeps code DRY: don\'t repeat yourself.',
  tasks:[
    'The starter is the robot\'s route to the shop as a loose list of alerts. Run it once and watch it play in the console.',
    'Wrap the whole route in <code>function getMilk() { ... }</code>, indenting the lines inside. Run again: the console goes quiet, because declaring a function runs nothing.',
    'Below the function, call it with <code>getMilk();</code>. Then call it a second time and watch the whole route repeat.',
    'Swap every <code>alert</code> for <code>console.log</code> (in VS Code, Find &amp; Replace does it in one go). Alerts are seen by every visitor; the console is only for you.',
    'Write <code>getMilk;</code> without the brackets and run. Nothing happens: you named the function but did not call it.'
  ],
  files:{ 'script.js':`// The robot's route to the shop and back, one instruction per line.
// TODO 1: wrap all of these lines in  function getMilk() { ... }  and indent them

alert("leaveHouse");
alert("moveRight");
alert("moveRight");
alert("moveUp");
alert("moveUp");
alert("moveRight");
alert("buyMilk");
alert("moveLeft");
alert("moveDown");
alert("moveDown");
alert("moveLeft");
alert("moveLeft");
alert("enterHouse");

// TODO 2: call getMilk() here — then call it a second time
` },
  solution:{ 'script.js':`function getMilk() {
  console.log("leaveHouse");
  console.log("moveRight");
  console.log("moveRight");
  console.log("moveUp");
  console.log("moveUp");
  console.log("moveRight");
  console.log("buyMilk");
  console.log("moveLeft");
  console.log("moveDown");
  console.log("moveDown");
  console.log("moveLeft");
  console.log("moveLeft");
  console.log("enterHouse");
}
// no semicolon after the closing brace of a declaration

// nothing has run yet: the function is only stored

getMilk();     // now it runs
console.log("--- and again, without retyping a thing ---");
getMilk();

getMilk;       // the name alone refers to the function but does not run it
` },
  quiz:[
    { q:'What happens when the browser reads <code>function getMilk() { ... }</code>?', options:['It runs the instructions inside','It stores the instructions under the name getMilk; nothing runs yet','It prints the function','It asks the user for milk'], answer:1, why:'A declaration only defines the function. The body runs each time the function is called.' },
    { q:'Which line runs the function?', options:['function getMilk();','getMilk;','getMilk();','call getMilk'], answer:2, why:'A call is the name followed by round brackets. Without the brackets you are only pointing at the function.' },
    { q:'Why swap the alerts for console.log while testing?', options:['console.log is shorter to type','Only developers see the console, and you are not clicking OK twenty times','alert does not work inside functions','console.log changes the page'], answer:1, why:'Both run the same way inside a function. The console just stays out of everyone\'s way.' },
  ],
  notes:`
    <h3>The shape</h3>
    <pre>function nameOfFunction() {
  // the instructions go here, indented
}

nameOfFunction();   // &lt;- this runs it</pre>
    <p>Function names follow the same rules as variables: camelCase, no leading digit, and ideally a verb that says what it does. A declaration's closing brace needs no semicolon.</p>
    <p>Note the brackets on the call. <code>getMilk</code> without brackets refers to the function itself; <code>getMilk()</code> runs it. That distinction matters a lot later, with event listeners.</p>
    <h3>Why bother</h3>
    <ul>
      <li><b>Reuse</b>: write it once, call it anywhere.</li>
      <li><b>Naming</b>: <code>calculateBMI()</code> tells a reader what a block of maths is for.</li>
      <li><b>One place to fix</b>: change the function and every caller gets the fix.</li>
    </ul>`
});


/* Lectures 90 and 91 share Karel's world: the same engine is appended to the
   starter and the solution of both lessons, so it lives in one block-scoped constant. */
{
  const KAREL_WORLD = `


/* ======================= Karel's world =======================
   You do not need to change anything below this line. It sets up a
   5 x 5 world, defines Karel's commands, runs main() and then draws
   the board in the console (and in the strip underneath it).        */

var SIZE = 5;
var karel = { x: 0, y: 0, dir: 0 };   // starts bottom-left; dir 0 = right, 1 = up, 2 = left, 3 = down
var beepers = [];                     // squares holding a beeper, written as "x,y"
var crashed = false;

function move() {
  if (crashed) return;
  var steps = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  var x = karel.x + steps[karel.dir][0];
  var y = karel.y + steps[karel.dir][1];
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) {
    crashed = true;
    console.error("Karel walked into a wall at column " + (karel.x + 1) + ", row " + (karel.y + 1) + ". The commands after that were ignored.");
    return;
  }
  karel.x = x;
  karel.y = y;
}
function turnLeft()  { if (!crashed) karel.dir = (karel.dir + 1) % 4; }
function turnRight() { if (!crashed) karel.dir = (karel.dir + 3) % 4; }
function putBeeper() {
  var here = karel.x + "," + karel.y;
  if (!crashed && beepers.indexOf(here) === -1) beepers.push(here);
}
function pickBeeper() {
  var i = beepers.indexOf(karel.x + "," + karel.y);
  if (crashed) return;
  if (i === -1) console.warn("pickBeeper(): there is no beeper on this square.");
  else beepers.splice(i, 1);
}

function drawWorld() {
  var arrows = [">", "^", "<", "v"], pointers = ["▶", "▲", "◀", "▼"], facing = ["right", "up", "left", "down"];
  var cells = "";
  for (var y = SIZE - 1; y >= 0; y--) {            // the top row is printed first
    var row = "";
    for (var x = 0; x < SIZE; x++) {
      var isKarel = x === karel.x && y === karel.y;
      var hasBeeper = beepers.indexOf(x + "," + y) !== -1;
      row += (isKarel ? arrows[karel.dir] : (hasBeeper ? "o" : ".")) + "  ";
      cells += "<div style='width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;background:" +
        (hasBeeper ? "#ffcf6b" : "#eef1f9") + "'>" + (isKarel ? pointers[karel.dir] : "") + "</div>";
    }
    console.log(row);
  }
  var standing = beepers.indexOf(karel.x + "," + karel.y) !== -1 ? " (standing on a beeper)" : "";
  var summary = "Karel: column " + (karel.x + 1) + ", row " + (karel.y + 1) + ", facing " + facing[karel.dir] + standing + " · beepers on the board: " + beepers.length;
  console.log(summary);
  document.body.innerHTML = "<div style='display:flex;gap:14px;align-items:center;padding:8px 12px;font:12px sans-serif;color:#3c435c'>" +
    "<div style='display:grid;grid-template-columns:repeat(5,20px);gap:2px'>" + cells + "</div><div>" + summary + "</div></div>";
}

main();
drawWorld();
`;

  const KAREL_INTRO = `// Karel lives on a 5 x 5 grid and starts in the bottom-left corner, facing right.
// Karel understands five commands:
//     move();   turnLeft();   turnRight();   putBeeper();   pickBeeper();
// main() runs when you press Run. Afterwards the board is drawn in the console:
//     >  is Karel (pointing the way it faces)    o  is a beeper    .  is an empty square
`;

  PG.add({
    id:'l090', index:90, udemyId:12372000, minutes:9, section:'s14', slug:'karel-robot', kind:'js',
    title:'Functions Part 1 Challenge - The Karel Robot',
    blurb:'Practise writing and calling your own functions in a tiny robot world. Karel knows a handful of commands — <code>move()</code>, <code>turnLeft()</code>, <code>turnRight()</code>, <code>putBeeper()</code> — and each one is a function call. The challenges ask you to bundle repeated commands into functions of your own, so that <code>main()</code> reads like a plan.',
    tasks:[
      'Run the starter. Karel waits in the bottom-left corner of the board drawn in the console (and in the strip underneath).',
      'Challenge 1: inside <code>main()</code>, get Karel from the bottom-left corner to the top-right corner. Any route counts.',
      'Refactor: put four <code>move();</code> calls into a function of your own, <code>moveFourTimes()</code>, and call it twice from <code>main()</code>.',
      'Challenge 2: make a diagonal of five beepers from bottom-left to top-right. Put the repeating unit — move, turn left, move, put a beeper, turn right — into a function and call it four times after a first <code>putBeeper();</code>.',
      'Optional challenge 3: a chessboard pattern, with a beeper on every other square. Lesson 91 has a worked solution.'
    ],
    files:{ 'script.js': KAREL_INTRO + `
function main() {
  // TODO Challenge 1: get Karel to the top-right corner

}

// TODO: your own functions go here (moveFourTimes, the diagonal step, ...)

` + KAREL_WORLD },
    solution:{ 'script.js': KAREL_INTRO + `
function main() {
  // Challenge 1 — swap the comments on these two lines to see it:
  // goToTopRight();
  diagonalOfBeepers();       // Challenge 2
}

// Challenge 1: bottom-left to top-right
function moveFourTimes() {
  move();
  move();
  move();
  move();
}

function goToTopRight() {
  moveFourTimes();           // along the bottom row
  turnLeft();
  moveFourTimes();           // up the right-hand side
}

// Challenge 2: a diagonal of five beepers
function diagonalMoveAndBeeper() {
  move();
  turnLeft();
  move();
  putBeeper();
  turnRight();
}

function diagonalOfBeepers() {
  putBeeper();               // the starting corner needs a beeper too
  diagonalMoveAndBeeper();
  diagonalMoveAndBeeper();
  diagonalMoveAndBeeper();
  diagonalMoveAndBeeper();   // 5 beepers in total
}
` + KAREL_WORLD },
    quiz:[
      { q:'You move four <code>move();</code> calls into <code>function moveFourTimes()</code>. What do you gain?', options:['Karel moves faster','The steps live in one named place: main() gets shorter, and a wrong step count only needs fixing once','Karel can only move inside functions','Nothing — it is only style'], answer:1, why:'Naming a repeated group of instructions is exactly what functions are for: shorter code, and one place to fix it.' },
      { q:'Karel faces right and you call <code>turnLeft();</code>. Which way does Karel face now?', options:['left','down','up','still right'], answer:2, why:'A left turn from facing right points Karel up. Every later move() goes that way until Karel turns again.' },
      { q:'Your diagonal ends with only four beepers. What is the likely cause?', options:['The first putBeeper() before the repeated calls is missing','turnRight is misspelled','There are too many moves','Beepers only work on even squares'], answer:0, why:'The repeated unit puts a beeper after moving, so the starting square needs its own putBeeper() first.' },
    ],
    notes:`
      <h3>Karel's commands</h3>
      <table>
        <tr><th>Command</th><th>Does</th></tr>
        <tr><td><code>move();</code></td><td>One square forward, the way Karel is facing</td></tr>
        <tr><td><code>turnLeft();</code></td><td>A quarter turn to the left</td></tr>
        <tr><td><code>turnRight();</code></td><td>A quarter turn to the right. Some Karel editors lack it; then it is three <code>turnLeft();</code> calls in a function of your own.</td></tr>
        <tr><td><code>putBeeper();</code> · <code>pickBeeper();</code></td><td>Drop or pick up a marker on the current square</td></tr>
      </table>
      <p>The lecture uses <a href="https://stanford.edu/~cpiech/karel/ide.html" target="_blank" rel="noopener">Stanford's online Karel editor</a> with the world set to 5 × 5. The functions you write here work there too; leave out the world section at the bottom.</p>
      <h3>Reading the board</h3>
      <p>Columns run left to right and rows bottom to top, so Karel starts at column 1, row 1. Walking into a wall stops Karel and shows a red error, and the commands after it are ignored.</p>`
  });


  PG.add({
    id:'l091', index:91, udemyId:12400088, minutes:0, section:'s14', slug:'karel-chess-board', kind:'js',
    title:'The Karel Chess Board Solution',
    blurb:'A worked answer to the optional chessboard challenge (Udemy\'s article has the course\'s own version), built from nothing but functions calling functions — no loops yet. One function lays a row that starts with a beeper, one lays a row that starts empty, and two small turning functions let Karel zig-zag up the board.',
    tasks:[
      'Run it and compare the board with a chessboard: a beeper on every other square, 13 in all.',
      'Read <code>main()</code> on its own. It reads like a plan because each helper hides the fiddly moves.',
      'Break one helper on purpose — delete a <code>move();</code> from <code>rowStartingEmpty</code> — and watch the mistake repeat in every row that uses it. Then fix it in that one place.',
      'Try a different strategy: after each row, walk back to the left edge so every row is laid heading right. Which version needs fewer commands?'
    ],
    files:{ 'script.js': KAREL_INTRO + `
// The plan: odd rows (1, 3, 5) start with a beeper, even rows (2, 4) start empty.
// Karel zig-zags: right along row 1, up, left along row 2, up, right along row 3...

function main() {
  rowStartingWithBeeper();   // row 1, heading right
  upAndFaceLeft();
  rowStartingEmpty();        // row 2, heading left
  upAndFaceRight();
  rowStartingWithBeeper();   // row 3
  upAndFaceLeft();
  rowStartingEmpty();        // row 4
  upAndFaceRight();
  rowStartingWithBeeper();   // row 5
}

// o . o . o   — ends on the last square of the row
function rowStartingWithBeeper() {
  putBeeper();
  move();
  move();
  putBeeper();
  move();
  move();
  putBeeper();
}

// . o . o .
function rowStartingEmpty() {
  move();
  putBeeper();
  move();
  move();
  putBeeper();
  move();
}

// at the right-hand end: go up a row and face left
function upAndFaceLeft() {
  turnLeft();
  move();
  turnLeft();
}

// at the left-hand end: go up a row and face right
function upAndFaceRight() {
  turnRight();
  move();
  turnRight();
}
` + KAREL_WORLD },
    solution:{ 'script.js': KAREL_INTRO + `
// The plan: odd rows (1, 3, 5) start with a beeper, even rows (2, 4) start empty.
// Karel zig-zags: right along row 1, up, left along row 2, up, right along row 3...

function main() {
  rowStartingWithBeeper();   // row 1, heading right
  upAndFaceLeft();
  rowStartingEmpty();        // row 2, heading left
  upAndFaceRight();
  rowStartingWithBeeper();   // row 3
  upAndFaceLeft();
  rowStartingEmpty();        // row 4
  upAndFaceRight();
  rowStartingWithBeeper();   // row 5
}

// o . o . o   — ends on the last square of the row
function rowStartingWithBeeper() {
  putBeeper();
  move();
  move();
  putBeeper();
  move();
  move();
  putBeeper();
}

// . o . o .   — the same pattern read from either end, so it works heading left
function rowStartingEmpty() {
  move();
  putBeeper();
  move();
  move();
  putBeeper();
  move();
}

// at the right-hand end: go up a row and face left
function upAndFaceLeft() {
  turnLeft();
  move();
  turnLeft();
}

// at the left-hand end: go up a row and face right
function upAndFaceRight() {
  turnRight();
  move();
  turnRight();
}

// The walk-back alternative needs a turnAround() (two turnLeft calls) and
// four extra moves per row — more commands, but every row is laid the same way.
` + KAREL_WORLD },
    quiz:[
      { q:'Why does the solution need two different row functions?', options:['Neighbouring rows start on opposite colours: one starts with a beeper, the next starts empty','Karel cannot call the same function twice','The rows have different lengths','One function would be too long'], answer:0, why:'On a chessboard each row is shifted by one square, so the pattern alternates between the two kinds of row.' },
      { q:'How many beepers does a 5 × 5 chessboard need when the corner square has one?', options:['10','12','13','25'], answer:2, why:'Rows 1, 3 and 5 hold three each and rows 2 and 4 hold two each: 9 + 4 = 13.' },
    ],
  });
}


PG.add({
  id:'l092', index:92, udemyId:12400112, minutes:0, section:'s14', slug:'note-about-next-lesson', kind:'read',
  title:'A Quick Note About the Next Lesson',
  blurb:'A short text note in Udemy that sits between the Karel challenge and Functions Part 2. There is nothing to code here: read it in Udemy, then carry on to lecture 93, where functions start taking inputs.',
});


PG.add({
  id:'s14-functions-2', index:93, udemyId:12373850, minutes:10, section:'s14', slug:'functions-2', kind:'js',
  title:'Functions Part 2: Parameters and Arguments',
  blurb:'Functions can take inputs. A <b>parameter</b> is the name in the declaration\'s brackets — <code>function getMilk(money)</code> — and inside the body it behaves like a variable. The <b>argument</b> is the actual value passed in the call, <code>getMilk(5)</code>. One function, many different results.',
  tasks:[
    'Stepping stone: give <code>getMilk</code> a <code>bottles</code> parameter, use it in the line <i>buy 12 bottles of milk</i>, and call <code>getMilk(12)</code>.',
    'The lecture\'s version: rename the parameter to <code>money</code> and work out how many bottles it buys at 1.5 each.',
    '<code>5 / 1.5</code> is 3.33… — wrap the division in <code>Math.floor()</code> so you only buy whole bottles. <code>getMilk(5)</code> should say 3.',
    'Compare <code>Math.floor</code>, <code>Math.round</code> and <code>Math.ceil</code> on 3.33 and 4.99. Which one makes sense for buying milk?',
    'Call it with a few amounts. Then call <code>getMilk()</code> with nothing in the brackets and see what happens to <code>money</code>.'
  ],
  files:{ 'script.js':`// The milk run from the last lecture, shortened.
// TODO 1: give getMilk a parameter and use it in the "buy" line
function getMilk() {
  console.log("leaveHouse");
  console.log("moveRight");
  console.log("moveUp");
  console.log("buy some bottles of milk");   // TODO 2: how many bottles does the money buy at 1.5 each?
  console.log("moveDown");
  console.log("moveLeft");
  console.log("enterHouse");
}

// TODO 3: call it with an argument


// TODO 4: Math.floor vs Math.round vs Math.ceil on 3.33 and 4.99

` },
  solution:{ 'script.js':`function getMilk(money) {
  console.log("leaveHouse");
  console.log("moveRight");
  console.log("moveUp");

  const price = 1.5;
  const numberOfBottles = Math.floor(money / price);   // whole bottles only
  console.log("buy " + numberOfBottles + " bottles of milk");

  console.log("moveDown");
  console.log("moveLeft");
  console.log("enterHouse");
}

getMilk(5);    // buy 3 bottles of milk
getMilk(10);   // buy 6 bottles of milk

// three ways to round
console.log(Math.floor(3.33), Math.round(3.33), Math.ceil(3.33));   // 3 3 4
console.log(Math.floor(4.99), Math.round(4.99), Math.ceil(4.99));   // 4 5 5
// floor is right for shopping: you cannot take home a bottle you cannot pay for

// no argument: money is undefined, and undefined / 1.5 is NaN
getMilk();     // buy NaN bottles of milk

// several parameters are filled in order, left to right
function greet(name, greeting) {
  console.log(greeting + ", " + name + "!");
}
greet("Angela", "Hello");
greet("Ada", "Good morning");
` },
  explore:[{
    title:'How many bottles?', height:360,
    note:'Slide the money and the price. Only one of the three rounding methods never buys a bottle you cannot pay for.',
    html:`
<div class="knobs">
  <label>money <input type="range" id="m" min="0" max="20" step="0.5" value="5"><span class="val" id="mv"></span></label>
  <label>price per bottle <input type="range" id="p" min="0.5" max="4" step="0.25" value="1.5"><span class="val" id="pv"></span></label>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var m = document.getElementById('m'), p = document.getElementById('p'), mv = document.getElementById('mv'), pv = document.getElementById('pv'), ro = document.getElementById('ro');
  function upd(){
    var money = +m.value, price = +p.value, raw = money / price;
    var f = Math.floor(raw), r = Math.round(raw), c = Math.ceil(raw);
    mv.textContent = money; pv.textContent = price;
    function verdict(n){ return n * price <= money ? '✓ affordable' : '✗ costs ' + (n * price) + ', more than you have'; }
    ro.textContent = 'getMilk(' + money + ')   with a price of ' + price + '\\n\\n' +
      'money / price = ' + money + ' / ' + price + ' = ' + raw + '\\n\\n' +
      'Math.floor → ' + f + '   ' + verdict(f) + '\\n' +
      'Math.round → ' + r + '   ' + verdict(r) + '\\n' +
      'Math.ceil  → ' + c + '   ' + verdict(c) + '\\n\\n' +
      'console: buy ' + f + ' bottles of milk' +
      (r !== f ? '\\n\\nHere Math.round rounds UP, which would buy a bottle you cannot pay for.' : '');
  }
  m.addEventListener('input', upd); p.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'In <code>function getMilk(money) { ... }</code> called as <code>getMilk(5)</code>, which is the argument?', options:['money','getMilk','5','function'], answer:2, why:'The argument is the actual value in the call. money is the parameter: the name that value goes by inside the function.' },
    { q:'What does <code>Math.floor(4.99)</code> return?', options:['5','4','4.9','4.99'], answer:1, why:'Math.floor always rounds down to the whole number below.' },
    { q:'You call <code>getMilk()</code> with no argument. What is <code>money</code> inside the function?', options:['0','null','undefined','The call fails with an error'], answer:2, why:'A parameter with no matching argument is undefined. Doing maths with it gives NaN.' },
  ],
  notes:`
    <h3>Parameter vs argument</h3>
    <pre>function getMilk(money) {   // money is the PARAMETER (a placeholder)
  ...
}

getMilk(5);                 // 5 is the ARGUMENT (the real value)</pre>
    <h3>Order matters</h3>
    <p>Arguments fill the parameters left to right. <code>greet("Hello", "Angela")</code> and <code>greet("Angela", "Hello")</code> are both valid JavaScript and one of them is nonsense; the language will not warn you.</p>
    <h3>Rounding</h3>
    <p><code>Math.floor()</code> always rounds down, <code>Math.round()</code> goes to the nearest whole number and <code>Math.ceil()</code> always rounds up. Not sure which method exists? Search for it — "javascript round down" — and read the MDN page. That is normal practice, not cheating.</p>`
});


PG.add({
  id:'s14-life-in-weeks', index:93, sub:'b', udemyId:12373850, minutes:0, section:'s14', slug:'life-in-weeks', kind:'js',
  title:'Coding Exercise: Life in Weeks',
  blurb:'The coding exercise after lecture 93. Given an age, work out how many days, weeks and months are left if you live to 90, and log them in one exact sentence. Parameters plus a little arithmetic.',
  tasks:[
    'Fill in <code>lifeInWeeks(age)</code>: first the years left until 90, then days (× 365), weeks (× 52) and months (× 12).',
    'Log exactly <i>You have 28470 days, 4056 weeks, and 936 months left.</i> for <code>lifeInWeeks(12)</code>. Udemy\'s checker compares the text character by character, so match the commas and the full stop.',
    'Call it with a few other ages, including your own.',
    'Extra: take the age from the Prompt answers box with <code>lifeInWeeks(Number(prompt("How old are you?")));</code>'
  ],
  answers:'25',
  files:{ 'script.js':`// Assume a lifespan of 90 years. 1 year = 365 days, 52 weeks, 12 months.
function lifeInWeeks(age) {
  // TODO: work out the years left, then the days, weeks and months left,
  //       and log: "You have x days, y weeks, and z months left."

}

lifeInWeeks(12);   // should log: You have 28470 days, 4056 weeks, and 936 months left.
` },
  solution:{ 'script.js':`// Assume a lifespan of 90 years. 1 year = 365 days, 52 weeks, 12 months.
function lifeInWeeks(age) {
  const yearsLeft = 90 - age;

  const days = yearsLeft * 365;
  const weeks = yearsLeft * 52;
  const months = yearsLeft * 12;

  console.log("You have " + days + " days, " + weeks + " weeks, and " + months + " months left.");
}

lifeInWeeks(12);   // You have 28470 days, 4056 weeks, and 936 months left.
lifeInWeeks(56);   // You have 12410 days, 1768 weeks, and 408 months left.

// the age can come from the user too (prompt gives text; Number() converts it)
lifeInWeeks(Number(prompt("How old are you?")));
` },
  quiz:[
    { q:'Someone aged 12 has 78 years left. How many weeks is that, at 52 weeks a year?', options:['4056','28470','936','4680'], answer:0, why:'78 × 52 = 4056.' },
    { q:'Why would Udemy\'s checker reject <i>You have 28470 days, 4056 weeks and 936 months left.</i>?', options:['The numbers are wrong','The comma after weeks is missing, and the output has to match the sample exactly','It should use alert','It needs a template literal'], answer:1, why:'Automated checkers compare text character by character, so punctuation counts as much as the numbers.' },
  ],
  notes:`
    <h3>Breaking a problem down</h3>
    <p>Every challenge in this section has the same three parts: <b>what comes in</b> (the parameter), <b>what has to be worked out</b> (the maths) and <b>what goes out</b> (a log, or later a return value). Write those three as comments first and the code almost writes itself.</p>`
});


PG.add({
  id:'l094', index:94, udemyId:18143204, minutes:4, section:'s14', slug:'life-in-weeks-solution', kind:'js',
  title:'Life in Weeks Solution',
  blurb:'The walkthrough: the age arrives as a parameter, the years left are worked out first (<code>90 - age</code>), and the three totals are simple multiples of that. The sentence is built by breaking the string wherever a number goes and joining the pieces with <code>+</code>.',
  tasks:[
    'Run it: age 12 leaves 78 years, which is 28470 days, 4056 weeks and 936 months.',
    'Change the call to your own age.',
    'Break the sentence on purpose by deleting the comma after <i>weeks</i>. That one character is enough to fail Udemy\'s exact-match checker.',
    'Variation: work the totals out the other way round — <code>90 * 365 - age * 365</code> — and confirm the numbers match.',
    'Try an age over 90. Negative days! Section 15 brings <code>if</code>, which can deal with that.'
  ],
  files:{ 'script.js':`function lifeInWeeks(age) {
  const yearsRemaining = 90 - age;     // work this out once...
  const days = yearsRemaining * 365;   // ...then everything else is a multiple of it
  const weeks = yearsRemaining * 52;
  const months = yearsRemaining * 12;

  console.log("You have " + days + " days, " + weeks + " weeks, and " + months + " months left.");
}

lifeInWeeks(12);   // You have 28470 days, 4056 weeks, and 936 months left.
` },
  solution:{ 'script.js':`function lifeInWeeks(age) {
  const yearsRemaining = 90 - age;     // work this out once...
  const days = yearsRemaining * 365;   // ...then everything else is a multiple of it
  const weeks = yearsRemaining * 52;
  const months = yearsRemaining * 12;

  console.log("You have " + days + " days, " + weeks + " weeks, and " + months + " months left.");
}

lifeInWeeks(12);   // You have 28470 days, 4056 weeks, and 936 months left.

// the other way round: the whole lifespan minus what has been lived — same numbers
function lifeInWeeksFromTotals(age) {
  const days = 90 * 365 - age * 365;
  const weeks = 90 * 52 - age * 52;
  const months = 90 * 12 - age * 12;
  console.log("You have " + days + " days, " + weeks + " weeks, and " + months + " months left.");
}
lifeInWeeksFromTotals(12);

lifeInWeeks(95);   // negative numbers: if/else in section 15 can handle this
` },
  quiz:[
    { q:'Why work out <code>yearsRemaining = 90 - age</code> first?', options:['JavaScript requires it','Every later line can reuse it, so the maths stays short and easy to check','It rounds the age','It checks that the age is valid'], answer:1, why:'One intermediate value turns three long formulas into three simple multiplications.' },
    { q:'What does this version log for <code>lifeInWeeks(95)</code>?', options:['An error','Negative numbers of days, weeks and months','Zeros','Nothing'], answer:1, why:'90 − 95 is −5, and every multiple of it is negative too. Nothing checks the input yet.' },
  ],
});


PG.add({
  id:'s14-functions-3', index:95, udemyId:12373868, minutes:11, section:'s14', slug:'functions-3', kind:'js',
  title:'Functions Part 3: Outputs & Return Values',
  blurb:'The third kind of function takes input <b>and</b> gives output. <code>return</code> hands a value back to the caller — the call is replaced by that value, so you can store it, log it or feed it into another function — and it ends the function on the spot.',
  tasks:[
    'Write <code>calcBottles(startingMoney, costPerBottle)</code> that <b>returns</b> how many whole bottles the money buys.',
    'Write <code>calcChange(startingAmount, costPerBottle)</code> that returns the change, using <code>%</code>.',
    'Finish <code>getMilk(money, costPerBottle)</code>: log the number of bottles by calling <code>calcBottles</code> inside the message, then <b>return</b> the change by calling <code>calcChange</code>.',
    'Store what comes back — <code>let change = getMilk(5, 1.5);</code> — and log <i>Hello master, here is your 0.5 change.</i>',
    'Call <code>getMilk(10, 3)</code>. A new price, and none of the maths needed editing.',
    'Delete the <code>return</code> from <code>calcChange</code> and log the change again. What comes back now, and why?'
  ],
  files:{ 'script.js':`// TODO 1: calcBottles(startingMoney, costPerBottle) returns the number of whole bottles


// TODO 2: calcChange(startingAmount, costPerBottle) returns the money left over (use %)


// TODO 3: log the bottles using calcBottles(...), then RETURN the change using calcChange(...)
function getMilk(money, costPerBottle) {
  console.log("leaveHouse");
  // console.log("buy " + ... + " bottles of milk");
  console.log("enterHouse");
}

// TODO 4: store what getMilk gives back, then use it
// let change = getMilk(5, 1.5);
// console.log("Hello master, here is your " + change + " change.");
` },
  solution:{ 'script.js':`function calcBottles(startingMoney, costPerBottle) {
  const numberOfBottles = Math.floor(startingMoney / costPerBottle);
  return numberOfBottles;
}

function calcChange(startingAmount, costPerBottle) {
  const change = startingAmount % costPerBottle;
  return change;
}

function getMilk(money, costPerBottle) {
  console.log("leaveHouse");
  console.log("buy " + calcBottles(money, costPerBottle) + " bottles of milk");   // the call is replaced by its value
  console.log("enterHouse");
  return calcChange(money, costPerBottle);
}

let change = getMilk(5, 1.5);
console.log("Hello master, here is your " + change + " change.");   // 0.5

change = getMilk(10, 3);   // a new price: none of the maths needed editing
console.log("Hello master, here is your " + change + " change.");   // 1

// a function without return gives back undefined
function forgetful(a, b) {
  const sum = a + b;   // worked out... and thrown away
}
console.log("forgetful(2, 3) gives back " + forgetful(2, 3));   // undefined

// return also ENDS the function: nothing after it runs
function checkAge(age) {
  if (age < 18) {            // (if/else arrives properly in section 15)
    return "Too young";
  }
  return "Welcome in";
}
console.log(checkAge(15));   // Too young
console.log(checkAge(30));   // Welcome in
` },
  explore:[{
    title:'A call is replaced by its return value', height:500,
    note:'Step through how JavaScript runs one line that contains a function call. Tick the box to see what a forgotten <code>return</code> does.',
    html:`
<div class="knobs">
  <label>money <input type="number" id="m" value="5" step="0.5" min="0" style="width:70px"></label>
  <label>price <input type="number" id="p" value="1.5" step="0.25" min="0.25" style="width:70px"></label>
  <label><input type="checkbox" id="noret"> calcBottles forgets its return</label>
  <button id="next">Next step ▶</button>
  <button id="again">Start again</button>
</div>
<pre class="readout" id="fn"></pre>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var m = document.getElementById('m'), p = document.getElementById('p'), noret = document.getElementById('noret');
  var fn = document.getElementById('fn'), ro = document.getElementById('ro'), shown = 0;
  function steps(){
    var money = +m.value, price = +p.value, bottles = Math.floor(money / price);
    var value = noret.checked ? undefined : bottles;
    return [
      'console.log("buy " + calcBottles(' + money + ', ' + price + ') + " bottles of milk");\\n   ↑ the line contains a call, so the call has to run first',
      '→ inside calcBottles: startingMoney = ' + money + ', costPerBottle = ' + price + '\\n  numberOfBottles = Math.floor(' + money + ' / ' + price + ') = Math.floor(' + (money / price) + ') = ' + bottles,
      noret.checked ? '  …the function reaches its end without a return, so the call hands back undefined' : '  return numberOfBottles;   → hands ' + bottles + ' back and leaves the function',
      'console.log("buy " + ' + String(value) + ' + " bottles of milk");\\n   ↑ the call has been replaced by the value it returned',
      'console.log("buy ' + value + ' bottles of milk");',
      'console shows:  buy ' + value + ' bottles of milk'
    ];
  }
  function paint(){
    fn.textContent = 'function calcBottles(startingMoney, costPerBottle) {\\n  const numberOfBottles = Math.floor(startingMoney / costPerBottle);\\n' +
      (noret.checked ? '  // (no return line)\\n' : '  return numberOfBottles;\\n') + '}';
    var s = steps();
    ro.textContent = s.slice(0, shown + 1).join('\\n\\n') + (shown < s.length - 1 ? '\\n\\n(press Next step)' : '');
  }
  document.getElementById('next').addEventListener('click', function(){ if (shown < steps().length - 1) shown++; paint(); });
  document.getElementById('again').addEventListener('click', function(){ shown = 0; paint(); });
  [m, p, noret].forEach(function(el){ el.addEventListener('input', function(){ shown = 0; paint(); }); el.addEventListener('change', function(){ shown = 0; paint(); }); });
  paint();
<\/script>`
  }],
  quiz:[
    { q:'What does a function give back if it has no <code>return</code>?', options:['0','null','undefined','its last line'], answer:2, why:'Without return the call still runs the body, but the value it produces is undefined.' },
    { q:'After <code>let change = getMilk(5, 1.5);</code> runs, what is stored in <code>change</code>?', options:['The function itself','Whatever getMilk returned','The text "getMilk(5, 1.5)"','Always undefined'], answer:1, why:'The right-hand side is a call, and a call is replaced by its return value before the assignment happens.' },
    { q:'What happens to code after a <code>return</code> line in the same block?', options:['It never runs — return ends the function','It runs afterwards','It runs first','It causes an error'], answer:0, why:'return hands back the value and leaves the function immediately, which makes it handy for early exits.' },
  ],
  notes:`
    <h3>Log vs return</h3>
    <table>
      <tr><th><code>console.log</code></th><th><code>return</code></th></tr>
      <tr><td>Shows a value to you</td><td>Hands a value to the calling code</td></tr>
      <tr><td>The function still gives back <code>undefined</code></td><td>The result can be stored and reused</td></tr>
      <tr><td>For checking things</td><td>For building things</td></tr>
    </table>
    <h3>One job per function</h3>
    <p>The solution has three small functions rather than one big one. Each does a single thing, each can be tested on its own, and the names explain the maths. Arguments are matched by position, so keep the order of parameters consistent.</p>`
});


PG.add({
  id:'s14-bmi', index:96, udemyId:12373874, minutes:2, section:'s14', slug:'bmi-calculator', kind:'js',
  title:'Challenge: Create a BMI Calculator',
  blurb:'Body Mass Index is weight in kilograms divided by height in metres squared. Write <code>bmiCalculator(weight, height)</code> — weight first and height second, because that is the order the calling code uses — and <b>return</b> the BMI as a whole number.',
  tasks:[
    'Work out the expected answer first: for 65 kg and 1.8 m, 1.8 × 1.8 = 3.24 and 65 ÷ 3.24 ≈ 20.06.',
    'Write <code>bmiCalculator(weight, height)</code> with the parameters in exactly that order.',
    'Compute <code>weight / (height * height)</code> — the brackets matter — or use <code>Math.pow(height, 2)</code> for the square.',
    'Round with <code>Math.round()</code> and <b>return</b> the result.',
    'Uncomment the four calling lines. The console should say <i>Your bmi is 20</i>. Check a couple of other values against an online BMI calculator.'
  ],
  files:{ 'script.js':`// TODO: create bmiCalculator(weight, height): weight in kg FIRST, then height in metres.
//       It must RETURN weight divided by height squared, rounded to a whole number.



// TODO: then uncomment these lines — they call your function
// const weight = 65;
// const height = 1.8;
// const bmi = bmiCalculator(weight, height);
// console.log("Your bmi is " + bmi);
` },
  solution:{ 'script.js':`function bmiCalculator(weight, height) {
  const bmi = weight / (height * height);   // brackets: square the height first
  return Math.round(bmi);
}

const weight = 65;
const height = 1.8;
const bmi = bmiCalculator(weight, height);
console.log("Your bmi is " + bmi);       // Your bmi is 20

console.log(bmiCalculator(85, 1.75));   // 28

// Math.pow(height, 2) squares a number too
function bmiCalculator2(weight, height) {
  return Math.round(weight / Math.pow(height, 2));
}
console.log(bmiCalculator2(65, 1.8));   // 20
` },
  quiz:[
    { q:'Why must the parameters be in the order <code>(weight, height)</code>?', options:['Parameters have to be alphabetical','Arguments fill parameters by position, and the calling code passes the weight first','Height must always come last','The order makes no difference'], answer:1, why:'bmiCalculator(65, 1.8) puts 65 into the first parameter. Swap the parameters and 65 becomes the height.' },
    { q:'What does <code>65 / 1.8 * 1.8</code> give?', options:['20.06','65','3.24','36.1'], answer:1, why:'Division and multiplication run left to right, so it divides by 1.8 and then multiplies straight back.' },
  ],
  notes:`
    <h3>Watch the brackets</h3>
    <p><code>weight / height * height</code> is <b>wrong</b>: division and multiplication run left to right, so it divides and then multiplies straight back. You need <code>weight / (height * height)</code>, or <code>weight / Math.pow(height, 2)</code>.</p>
    <h3>Rounding</h3>
    <ul>
      <li><code>Math.round(20.6)</code> → 21 (nearest)</li>
      <li><code>Math.floor(20.6)</code> → 20 (down)</li>
      <li><code>Math.ceil(20.1)</code> → 21 (up)</li>
    </ul>
    <p>Section 15 comes back to this exact function and adds <code>if / else</code> so it says what the number means. Keep your version.</p>`
});


PG.add({
  id:'l097', index:97, udemyId:12373890, minutes:6, section:'s14', slug:'bmi-calculator-solution', kind:'js',
  title:'Challenge: BMI Calculator Solution',
  blurb:'The walkthrough starts with maths, not code: work one example by hand so you know what the function should give. Then the first version straight from the formula, then two refinements found by searching MDN — <code>Math.pow</code> for the square and <code>Math.round</code> for a whole number.',
  tasks:[
    'Run it and compare version 1 (all the decimals) with the final version (20).',
    'Remove the brackets in version 1 so it reads <code>weight / height * height</code>. Explain the new answer.',
    'Swap <code>Math.round</code> for <code>Math.floor</code> and try 70 kg and 1.75 m. When do the two disagree, and which one is more accurate?',
    'Call <code>bmiCalculator(1.8, 65)</code> with the arguments swapped. It still runs — why is the answer nonsense?'
  ],
  files:{ 'script.js':`// Version 1: straight from the formula. The brackets make the squaring happen first.
function bmiCalculatorV1(weight, height) {
  const bmi = weight / (height * height);
  return bmi;
}
console.log("Version 1: " + bmiCalculatorV1(65, 1.8));   // 20.061728395061728

// Final version: Math.pow for the square, Math.round for a whole number
function bmiCalculator(weight, height) {
  const bmi = weight / Math.pow(height, 2);
  return Math.round(bmi);
}

const bmi = bmiCalculator(65, 1.8);
console.log("Your bmi is " + bmi);   // Your bmi is 20
` },
  solution:{ 'script.js':`// Version 1: straight from the formula. The brackets make the squaring happen first.
function bmiCalculatorV1(weight, height) {
  const bmi = weight / (height * height);
  return bmi;
}
console.log("Version 1: " + bmiCalculatorV1(65, 1.8));   // 20.061728395061728

// Final version: Math.pow for the square, Math.round for a whole number
function bmiCalculator(weight, height) {
  const bmi = weight / Math.pow(height, 2);
  return Math.round(bmi);
}

const bmi = bmiCalculator(65, 1.8);
console.log("Your bmi is " + bmi);   // Your bmi is 20

// where round and floor disagree: 70 / 1.75² = 22.857...
console.log(Math.round(70 / Math.pow(1.75, 2)), Math.floor(70 / Math.pow(1.75, 2)));   // 23 22

// swapped arguments still run — JavaScript cannot know which number is which
console.log("Swapped: " + bmiCalculator(1.8, 65));   // 0
` },
  explore:[{
    title:'BMI sliders', height:290,
    note:'Move the sliders. Compare the raw BMI with the two rounding methods, and the bracket-less formula that quietly gives the weight back.',
    html:`
<div class="knobs">
  <label>weight (kg) <input type="range" id="w" min="35" max="150" value="65"><span class="val" id="wv"></span></label>
  <label>height (m) <input type="range" id="h" min="1.40" max="2.10" step="0.01" value="1.80"><span class="val" id="hv"></span></label>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var w = document.getElementById('w'), h = document.getElementById('h'), wv = document.getElementById('wv'), hv = document.getElementById('hv'), ro = document.getElementById('ro');
  function upd(){
    var weight = +w.value, height = +h.value, bmi = weight / Math.pow(height, 2);
    wv.textContent = weight; hv.textContent = height.toFixed(2);
    var r = Math.round(bmi), f = Math.floor(bmi);
    ro.textContent =
      'weight / Math.pow(height, 2) = ' + weight + ' / ' + Math.pow(height, 2).toFixed(4) + ' = ' + bmi + '\\n\\n' +
      'Math.round(bmi) → ' + r + (r !== f ? '   (nearest whole number)' : '') + '\\n' +
      'Math.floor(bmi) → ' + f + (r !== f ? '   (always down, so it is less accurate here)' : '') + '\\n\\n' +
      'weight / height * height     → ' + (weight / height * height) + '   ✗ no brackets: it divides, then multiplies straight back';
  }
  w.addEventListener('input', upd); h.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>Math.pow(1.8, 2)</code> calculate?', options:['1.8 × 2','1.8 squared (1.8 × 1.8)','the square root of 1.8','1.8 + 2'], answer:1, why:'Math.pow(base, exponent) raises the base to that power, so an exponent of 2 squares it.' },
    { q:'Why does the final version use <code>Math.round</code> rather than <code>Math.floor</code>?', options:['Math.floor does not work on decimals','Math.round is faster','There is no difference','Round gives the nearest whole number; floor always rounds down, so 22.9 would become 22'], answer:3, why:'For a measurement, nearest is the honest answer. Floor is right when you need whole items you can afford, like the milk bottles.' },
  ],
});


PG.add({
  id:'l098', index:98, udemyId:17966816, minutes:3, section:'s14', slug:'set-your-expectations', kind:'read',
  title:'Tip from Angela - Set Your Expectations',
  blurb:'A short pep talk. Coding is not "easy" beyond the very first steps, and it is not reserved for geniuses either. Finding it hard is normal; what separates working developers from learners is mostly hours of practice.',
  quiz:[
    { q:'You are stuck on a challenge that other people seem to find easy. What does that tell you?', options:['That you are not cut out for coding','Nothing worrying: struggling is part of learning, and practice is what closes the gap','That you should skip ahead to the next section','That you picked the wrong language'], answer:1, why:'Difficulty says nothing about ability. The gap between learners and professionals is mostly accumulated practice.' },
  ],
});
