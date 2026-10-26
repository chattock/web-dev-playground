/* ===== Section 18 — Advanced Javascript and DOM Manipulation ===== */
/* The drum kit lessons use previewBase 'assets/drumkit/', so the course's
   images/tom1.png … images/kick.png paths load the playground's own drum
   pictures, and new Audio("sounds/tom-1.mp3").play() is synthesised by the
   preview (tom-1…tom-4, snare, crash, kick-bass) — no audio files needed.
   Each drum kit lesson starts from the previous one's solution. */

(function () {

var BASE = 'assets/drumkit/';

var HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Drum Kit</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet" />
</head>
<body>
  <h1 id="title">Drum 🥁 Kit</h1>
  <div class="set">
    <button class="w drum">w</button>
    <button class="a drum">a</button>
    <button class="s drum">s</button>
    <button class="d drum">d</button>
    <button class="j drum">j</button>
    <button class="k drum">k</button>
    <button class="l drum">l</button>
  </div>

  <footer>🥁 Drum Kit 🥁</footer>

  <script src="script.js"></script>
</body>
</html>
`;

var CSS_TOP = `body {
  text-align: center;
  background-color: #283149;
}

h1 {
  font-size: 5rem;
  color: #DBEDF3;
  font-family: "Arvo", cursive;
  text-shadow: 3px 0 #DA0463;
}

footer {
  color: #DBEDF3;
  font-family: sans-serif;
}
`;

var CSS_LETTERS_EMPTY = `
.w {}

.a {}

.s {}

.d {}

.j {}

.k {}

.l {}
`;

var CSS_LETTERS_TODO = `
/* TODO 2: give each drum its picture, for example
   .w { background-image: url("images/tom1.png"); }
   w tom1 · a tom2 · s tom3 · d tom4 · j snare · k crash · l kick */
.w {}

.a {}

.s {}

.d {}

.j {}

.k {}

.l {}
`;

var CSS_LETTERS_IMAGES = `
.w {
  background-image: url("images/tom1.png");
}

.a {
  background-image: url("images/tom2.png");
}

.s {
  background-image: url("images/tom3.png");
}

.d {
  background-image: url("images/tom4.png");
}

.j {
  background-image: url("images/snare.png");
}

.k {
  background-image: url("images/crash.png");
}

.l {
  background-image: url("images/kick.png");
}
`;

var CSS_BOTTOM = `
.set {
  margin: 10% auto;
}

.game-over {
  background-color: red;
  opacity: 0.8;
}

.pressed {
  box-shadow: 0 3px 4px 0 #DBEDF3;
  opacity: 0.5;
}

.red {
  color: red;
}

.drum {
  outline: none;
  border: 10px solid #404B69;
  font-size: 5rem;
  font-family: 'Arvo', cursive;
  line-height: 2;
  font-weight: 900;
  color: #DA0463;
  text-shadow: 3px 0 #DBEDF3;
  border-radius: 15px;
  display: inline-block;
  width: 150px;
  height: 150px;
  text-align: center;
  margin: 10px;
  background-color: white;
  background-size: cover;   /* scales the playground's drum pictures to fit */
}
`;

var CSS_PLAIN = CSS_TOP + CSS_LETTERS_EMPTY + CSS_BOTTOM;
var CSS_TODO = CSS_TOP + CSS_LETTERS_TODO + CSS_BOTTOM;
var CSS_IMAGES = CSS_TOP + CSS_LETTERS_IMAGES + CSS_BOTTOM;

var LOOP_OPEN = `var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
`;
var LOOP_CLOSE = `  });
}
`;

var JS_136 = LOOP_OPEN + `    alert("I got clicked!");
` + LOOP_CLOSE;

var JS_139 = LOOP_OPEN + `    var audio = new Audio("sounds/tom-1.mp3");
    audio.play();

    console.log(this);              // the button that was clicked
    console.log(this.innerHTML);    // its letter
    this.style.color = "white";
` + LOOP_CLOSE;

var SWITCH_IN_LOOP = `    var buttonInnerHTML = this.innerHTML;

    switch (buttonInnerHTML) {
      case "w":
        var tom1 = new Audio("sounds/tom-1.mp3");
        tom1.play();
        break;

      case "a":
        var tom2 = new Audio("sounds/tom-2.mp3");
        tom2.play();
        break;

      case "s":
        var tom3 = new Audio("sounds/tom-3.mp3");
        tom3.play();
        break;

      case "d":
        var tom4 = new Audio("sounds/tom-4.mp3");
        tom4.play();
        break;

      case "j":
        var snare = new Audio("sounds/snare.mp3");
        snare.play();
        break;

      case "k":
        var crash = new Audio("sounds/crash.mp3");
        crash.play();
        break;

      case "l":
        var kick = new Audio("sounds/kick-bass.mp3");
        kick.play();
        break;

      default:
        console.log(buttonInnerHTML);
    }
`;

var JS_140 = LOOP_OPEN + SWITCH_IN_LOOP + LOOP_CLOSE;

var MAKE_SOUND = `function makeSound(key) {
  switch (key) {
    case "w":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;

    case "a":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;

    case "s":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;

    case "d":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;

    case "j":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    case "k":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;

    case "l":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    default:
      console.log(key);
  }
}
`;

var JS_144 = `// Detecting button presses

` + LOOP_OPEN + `    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
` + LOOP_CLOSE + `
// Detecting keyboard presses

document.addEventListener("keydown", function (event) {
  makeSound(event.key);
});


` + MAKE_SOUND;

var JS_146 = `// Detecting button presses

` + LOOP_OPEN + `    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
` + LOOP_CLOSE + `
// Detecting keyboard presses

document.addEventListener("keydown", function (event) {
  makeSound(event.key);
  buttonAnimation(event.key);
});


` + MAKE_SOUND + `

function buttonAnimation(currentKey) {
  // only the seven drum letters have a button: any other key (x, 1, Shift…)
  // would make querySelector return null or reject the selector, so stop here
  if (!["w", "a", "s", "d", "j", "k", "l"].includes(currentKey)) {
    return;
  }

  var activeButton = document.querySelector("." + currentKey);

  activeButton.classList.add("pressed");

  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}
`;

/* A small Web Audio synth for Explore demos (the build preview has its own). */
var SYNTH = `
  var actx = null;
  function ac() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx; }
  function tone(f, d, type, g, decay) {
    var c = ac(), o = c.createOscillator(), gn = c.createGain(), t = c.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (decay) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * decay), t + d);
    gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(gn); gn.connect(c.destination); o.start(t); o.stop(t + d + 0.05);
  }
  function noise(d, g, hp) {
    var c = ac(), n = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, n, c.sampleRate), data = buf.getChannelData(0);
    for (var i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(), gn = c.createGain(), f = c.createBiquadFilter(), t = c.currentTime;
    f.type = 'highpass'; f.frequency.value = hp; s.buffer = buf;
    gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(0.001, t + d);
    s.connect(f); f.connect(gn); gn.connect(c.destination); s.start(t);
  }
  var SOUNDS = {
    w: function () { tone(180, 0.35, 'sine', 0.5, 0.4); },
    a: function () { tone(150, 0.4, 'sine', 0.5, 0.4); },
    s: function () { tone(120, 0.45, 'sine', 0.5, 0.4); },
    d: function () { tone(95, 0.5, 'sine', 0.5, 0.4); },
    j: function () { noise(0.18, 0.4, 1500); tone(200, 0.12, 'triangle', 0.3, 0.5); },
    k: function () { noise(0.9, 0.25, 5000); },
    l: function () { tone(110, 0.3, 'sine', 0.8, 0.25); }
  };
  var IMAGES = { w: 'tom1', a: 'tom2', s: 'tom3', d: 'tom4', j: 'snare', k: 'crash', l: 'kick' };
`;

var PAD_CSS = `
<style>
  .kit{background:#283149;text-align:center;padding:12px 8px 16px;border-radius:10px}
  .pad{border:6px solid #404b69;font:900 34px/1 Arvo,Georgia,serif;color:#da0463;text-shadow:2px 0 #dbedf3;border-radius:12px;
       width:74px;height:74px;margin:5px;background:#fff center/cover no-repeat;cursor:pointer;padding:0;vertical-align:middle}
  .pad.pressed{box-shadow:0 3px 4px 0 #dbedf3;opacity:.5}
</style>`;

var DRUM_NOTE = `
    <h3>Sounds and pictures here</h3>
    <p>The drum pictures are the playground's own, and <code>new Audio("sounds/…mp3").play()</code> is synthesised in the preview, so no sound files are needed. Browsers only allow sound after you interact with the page, so the first click or key press starts the audio.</p>`;

var KEY_NOTE = `
    <h3>Keys go to whatever has focus</h3>
    <p>Click an empty part of the preview first so it receives your key presses. While the cursor is in the editor, your typing goes to the code instead.</p>`;


PG.add({
  id:'l134', index:134, udemyId:12383928, minutes:1, section:'s18', slug:'drum-kit-preview', kind:'read',
  title:'What We\'ll Make: Drum Kit',
  blurb:'The project for this section: a row of seven drums, one per key (w, a, s, d, j, k, l). Click a drum or press its key and it plays and flashes. Building it covers event listeners for clicks and for the keyboard, functions passed to other functions, objects, sounds and a little animation. Try the finished kit in the Explore tab.',
  openTab:'explore',
  explore:[{
    title:'The finished drum kit', height:430,
    note:'Click a drum, or click inside the demo once and then type <b>w a s d j k l</b>. This is what lectures 136–146 build.',
    html:`
<link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet">` + PAD_CSS + `
<div class="kit">
  <h1 style="font-family:Arvo,Georgia,serif;color:#dbedf3;text-shadow:2px 0 #da0463;font-size:34px;margin:4px 0 12px">Drum 🥁 Kit</h1>
  <div id="set"></div>
</div>
<pre class="readout" id="out" style="margin-top:12px">Press a key or click a drum.</pre>
<script>` + SYNTH + `
  var set = document.getElementById('set');
  Object.keys(IMAGES).forEach(function (k) {
    var b = document.createElement('button');
    b.className = 'pad ' + k; b.textContent = k;
    b.style.backgroundImage = 'url(assets/drumkit/images/' + IMAGES[k] + '.png)';
    set.appendChild(b);
  });
  function hit(key, how) {
    var b = SOUNDS[key] ? set.querySelector('.' + key) : null;
    if (!b) { document.getElementById('out').textContent = how + ' "' + key + '": no drum for that key'; return; }
    SOUNDS[key]();
    b.classList.add('pressed');
    setTimeout(function () { b.classList.remove('pressed'); }, 100);
    document.getElementById('out').textContent = how + ' "' + key + '": played ' + IMAGES[key] + ' and flashed it for 100 ms';
  }
  set.addEventListener('click', function (e) { var b = e.target.closest('.pad'); if (b) hit(b.textContent, 'click on'); });
  document.addEventListener('keydown', function (e) { if (e.key.length === 1) hit(e.key, 'key'); });
<\/script>`
  }]
});


PG.add({
  id:'l135', index:135, udemyId:12409852, minutes:0, section:'s18', slug:'drum-kit-starting-files', kind:'read',
  title:'Download the Starting Files',
  blurb:'In the course you download the drum kit starter: <code>index.html</code> with the seven drum buttons, a finished stylesheet, an <code>images</code> folder (one picture per drum) and a <code>sounds</code> folder (one recording per drum). The JavaScript file is yours to write. The playground lessons load the HTML and CSS for you; the pictures are the playground\'s own and the sounds are synthesised, so the course\'s paths still work.',
  quiz:[
    { q:'The <code>sounds</code> folder sits next to <code>index.html</code>. Which path plays the first tom?', options:['tom-1.mp3','sounds/tom-1.mp3','/tom-1','sounds\\tom-1'], answer:1, why:'Paths in the page start from index.html\'s folder: into sounds, then the file name with its extension.' },
  ]
});


PG.add({
  id:'l136', index:136, udemyId:12383942, minutes:14, section:'s18', slug:'event-listeners', kind:'build',
  previewBase:BASE,
  title:'Adding Event Listeners to a Button',
  blurb:'<code>element.addEventListener("click", someFunction)</code> asks an element to watch for an event and run a function when it happens. You hand over the function <b>by name, without parentheses</b>: the browser calls it later, on each click. Add <code>()</code> and it runs straight away while the page loads instead.',
  tasks:[
    'Prove <code>script.js</code> runs: put <code>alert("Hello")</code> in it and look for it in the console panel (alerts show up there in this playground). Then delete it.',
    'Write <code>function handleClick() { alert("I got clicked!"); }</code> and attach it to the first drum with <code>document.querySelector(".drum").addEventListener("click", handleClick)</code>. Click <b>w</b>, then another drum: only w responds.',
    'Add parentheses — <code>handleClick()</code> — and run again. The alert fires immediately and clicks do nothing. Take them off.',
    'Replace the named function with an anonymous <code>function () { … }</code> written straight into <code>addEventListener</code>.',
    '<b>Challenge:</b> give every drum the listener. Count them with <code>document.querySelectorAll(".drum").length</code> and use a <code>for</code> loop that calls <code>addEventListener</code> on <code>querySelectorAll(".drum")[i]</code>.'
  ],
  files:{
'index.html':HTML,
'style.css':CSS_PLAIN,
'script.js':`// TODO 1: prove this file runs with an alert, then delete it


// TODO 2: a function called handleClick that alerts "I got clicked!",
//         attached to the first .drum with addEventListener("click", ...)


// TODO 3 (challenge): a for loop that gives EVERY .drum button the listener
`},
  solution:{
'script.js':JS_136},
  explore:[{
    title:'Pass the function — don\'t call it', height:560,
    note:'Choose how the listener line is written and which buttons get it, then reload the page and click the drums. The log shows exactly when your function runs.',
    html:`
<style>
  .drum{border:5px solid #404b69;font:900 26px/1 Georgia,serif;color:#da0463;border-radius:10px;width:58px;height:58px;margin:4px;background:#fff;cursor:pointer}
</style>
<div class="knobs">
  <label>listener line
    <select id="how">
      <option value="ref">.addEventListener("click", handleClick)</option>
      <option value="call">.addEventListener("click", handleClick())</option>
      <option value="anon">.addEventListener("click", function () { … })</option>
    </select>
  </label>
  <label>attach it to
    <select id="who">
      <option value="one">querySelector(".drum") — the first match</option>
      <option value="all">every .drum, with a for loop</option>
    </select>
  </label>
  <button id="load">⟳ reload the page</button>
</div>
<div class="stage" id="stage" style="text-align:center;background:#283149"></div>
<pre class="readout" id="code"></pre>
<pre class="readout" id="log" style="min-height:96px;white-space:pre-wrap"></pre>
<script>
  var stage = document.getElementById('stage'), logEl = document.getElementById('log'), lines = [], t0 = 0;
  function log(s) { lines.push(s); logEl.textContent = lines.slice(-8).join('\\n'); }
  function code() {
    var how = document.getElementById('how').value, who = document.getElementById('who').value;
    var arg = how === 'ref' ? 'handleClick' : how === 'call' ? 'handleClick()' : 'function () {\\n    alert("I got clicked!");\\n  }';
    var fn = how === 'anon' ? '' : 'function handleClick() {\\n  alert("I got clicked!");\\n}\\n\\n';
    document.getElementById('code').textContent = fn + (who === 'one'
      ? 'document.querySelector(".drum").addEventListener("click", ' + arg + ');'
      : 'for (var i = 0; i < numberOfDrumButtons; i++) {\\n  document.querySelectorAll(".drum")[i].addEventListener("click", ' + arg.replace(/\\n/g, '\\n  ') + ');\\n}');
  }
  function load() {
    var how = document.getElementById('how').value, who = document.getElementById('who').value;
    stage.innerHTML = '<button class="drum">w</button><button class="drum">a</button><button class="drum">s</button><button class="drum">d</button>';
    lines = []; code();
    log('— page loaded, the script runs from top to bottom —');
    function handleClick() {
      if (this && this.nodeType === 1) { log('click on ' + this.innerHTML + ' → handleClick ran: "I got clicked!"'); this.handled = true; }
      else log('handleClick() ran during page load: "I got clicked!" — before anyone clicked');
    }
    var targets = who === 'one' ? [stage.querySelector('.drum')] : Array.prototype.slice.call(stage.querySelectorAll('.drum'));
    targets.forEach(function (b) {
      if (how === 'ref') b.addEventListener('click', handleClick);
      if (how === 'anon') b.addEventListener('click', function () { log('click on ' + this.innerHTML + ' → the anonymous function ran: "I got clicked!"'); this.handled = true; });
      if (how === 'call') {
        var result = handleClick();
        b.addEventListener('click', result);
        log('  …it returned ' + result + ', so addEventListener was handed ' + result + ' instead of a function');
      }
    });
    log('— waiting for clicks —');
  }
  stage.addEventListener('click', function (e) { var b = e.target.closest('.drum'); if (b) b.handled = false; }, true);
  stage.addEventListener('click', function (e) { var b = e.target.closest('.drum'); if (b && !b.handled) log('click on ' + b.innerHTML + ' → nothing happens: this button has no listener'); });
  document.getElementById('load').onclick = load;
  document.getElementById('how').onchange = load;
  document.getElementById('who').onchange = load;
  load();
<\/script>`
  }],
  quiz:[
    { q:'What goes wrong with <code>button.addEventListener("click", handleClick())</code>?', options:['Nothing, it is the same','handleClick runs immediately and its result (undefined) is passed instead of the function','The click runs twice','It throws a syntax error'], answer:1, why:'The parentheses call the function on the spot. addEventListener needs the function itself to call later.' },
    { q:'<code>document.querySelector(".drum").addEventListener(…)</code> gives a listener to how many buttons?', options:['All seven','Only the first .drum on the page','None','The last one'], answer:1, why:'querySelector returns only the first match, so the other drums need a loop over querySelectorAll.' },
    { q:'Why loop over <code>.drum</code> rather than every <code>button</code>?', options:['button is not a valid selector','Any other button added later would get drum behaviour by accident','Classes are faster','The drums are not buttons'], answer:1, why:'Selecting by the drum class targets exactly the drums, however many other buttons the page gains.' },
  ],
  notes:DRUM_NOTE
});


PG.add({
  id:'l137', index:137, udemyId:12383962, minutes:13, section:'s18', slug:'higher-order-functions', kind:'js',
  title:'Higher Order Functions and Passing Functions as Arguments',
  blurb:'A function can be handed to another function like any other value. A function that takes one — <code>addEventListener</code>, or the <code>calculator</code> built here — is a <b>higher-order function</b>. <code>calculator(4, 5, add)</code> passes the <code>add</code> function itself, and calculator decides when to call it.',
  tasks:[
    'Write <code>calculator(num1, num2, operator)</code> so that it returns <code>operator(num1, num2)</code>.',
    'Log <code>calculator(4, 5, add)</code> and <code>calculator(4, 5, multiply)</code> — expect 9 and 20.',
    '<b>Challenge:</b> write <code>subtract</code> and <code>divide</code> and use each one through calculator.',
    'Try <code>calculator(4, 5, add())</code> and read the error: <code>add()</code> ran first, returned <code>NaN</code>, and NaN is not a function.',
    'Optional: open your browser\'s DevTools (⌥⌘I or F12), put <code>debugger;</code> on the line before a calculator call and press Run. Step into the calls and watch <code>operator</code> in the Scope panel.'
  ],
  files:{
'script.js':`function add(num1, num2) {
  return num1 + num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

// TODO 1: calculator(num1, num2, operator) — call operator with the two
//         numbers and return the answer


// TODO 2: log calculator(4, 5, add) and calculator(4, 5, multiply)


// TODO 3 (challenge): subtract and divide, used through calculator
`},
  solution:{
'script.js':`function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

// a higher-order function: its third input is a function
function calculator(num1, num2, operator) {
  return operator(num1, num2);
}

console.log(calculator(4, 5, add));        // 9
console.log(calculator(4, 5, multiply));   // 20
console.log(calculator(6, 3, subtract));   // 3
console.log(calculator(10, 2, divide));    // 5

// calculator(4, 5, add()) would fail: add() runs first and returns NaN,
// so calculator tries to call NaN(4, 5) — "operator is not a function"
`},
  explore:[{
    title:'Step through calculator(…)', height:560,
    note:'Pick the numbers and the function to pass, then press <b>Step</b> to follow the call the way the debugger does. Pick <code>multiply()</code> to see what the parentheses break.',
    html:`
<div class="knobs">
  <label>calculator(<input type="number" id="a" value="3" style="width:56px">, <input type="number" id="b" value="4" style="width:56px">,
    <select id="op"><option>add</option><option>subtract</option><option selected>multiply</option><option>divide</option><option value="bad">multiply()</option></select>)</label>
  <button id="step">Step ▶</button>
  <button id="restart">Restart</button>
</div>
<div class="stage" style="display:flex;gap:12px;flex-wrap:wrap;padding:10px">
  <pre id="src" style="flex:1 1 290px;margin:0;font:12px/1.6 ui-monospace,Menlo,monospace;background:#111827;color:#9aa3bd;border-radius:8px;padding:10px"></pre>
  <div style="flex:1 1 170px">
    <h4>scope</h4><pre class="readout" id="scope" style="margin:0 0 10px;min-height:60px"></pre>
    <h4>call stack</h4><pre class="readout" id="stack" style="margin:0;min-height:60px"></pre>
  </div>
</div>
<pre class="readout" id="msg" style="white-space:pre-wrap"></pre>
<script>
  var SRC = ['function add(num1, num2) {', '  return num1 + num2;', '}', 'function subtract(num1, num2) {', '  return num1 - num2;', '}',
    'function multiply(num1, num2) {', '  return num1 * num2;', '}', 'function divide(num1, num2) {', '  return num1 / num2;', '}', '',
    'function calculator(num1, num2, operator) {', '  return operator(num1, num2);', '}', '', ''];
  var BODY = { add: 1, subtract: 4, multiply: 7, divide: 10 };
  var FN = { add: function (x, y) { return x + y; }, subtract: function (x, y) { return x - y; }, multiply: function (x, y) { return x * y; }, divide: function (x, y) { return x / y; } };
  var steps = [], at = 0;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function build() {
    var a = +document.getElementById('a').value, b = +document.getElementById('b').value, op = document.getElementById('op').value;
    var name = op === 'bad' ? 'multiply' : op, arg = op === 'bad' ? 'multiply()' : op;
    SRC[17] = 'calculator(' + a + ', ' + b + ', ' + arg + ');';
    steps = [];
    if (op === 'bad') {
      steps.push({ line: 17, scope: '', stack: ['global'], msg: 'Before calculator can start, its arguments are worked out — and multiply() has parentheses, so multiply runs right now, with no numbers.' });
      steps.push({ line: 7, scope: 'num1 = undefined\\nnum2 = undefined', stack: ['multiply', 'global'], msg: 'Inside multiply with nothing passed in: undefined * undefined is NaN.' });
      steps.push({ line: 17, scope: '', stack: ['global'], msg: 'So the call that actually happens is calculator(' + a + ', ' + b + ', NaN).' });
      steps.push({ line: 14, scope: 'num1 = ' + a + '\\nnum2 = ' + b + '\\noperator = NaN', stack: ['calculator', 'global'], msg: '✗ TypeError: operator is not a function.\\nNaN is a number; you cannot call it. Pass multiply without the ().' });
    } else {
      var r = FN[name](a, b);
      steps.push({ line: 17, scope: '', stack: ['global'], msg: 'The call. ' + a + ' and ' + b + ' are numbers; ' + name + ' is the function itself, handed over without running it.' });
      steps.push({ line: 13, scope: 'num1 = ' + a + '\\nnum2 = ' + b + '\\noperator = ƒ ' + name, stack: ['calculator', 'global'], msg: 'Inside calculator. The parameter operator now holds the ' + name + ' function.' });
      steps.push({ line: 14, scope: 'num1 = ' + a + '\\nnum2 = ' + b + '\\noperator = ƒ ' + name, stack: ['calculator', 'global'], msg: 'operator(num1, num2) calls whatever function was passed in — here, ' + name + '(' + a + ', ' + b + ').' });
      steps.push({ line: BODY[name], scope: 'num1 = ' + a + '\\nnum2 = ' + b, stack: [name, 'calculator', 'global'], msg: 'Inside ' + name + ', which returns ' + r + '.' });
      steps.push({ line: 14, scope: 'num1 = ' + a + '\\nnum2 = ' + b + '\\noperator = ƒ ' + name, stack: ['calculator', 'global'], msg: 'Back in calculator, which returns that same ' + r + '.' });
      steps.push({ line: 17, scope: '', stack: ['global'], msg: '✓ calculator(' + a + ', ' + b + ', ' + name + ') → ' + r + '\\ncalculator never knew which sum it was doing: the function you passed decided.' });
    }
    at = 0; show();
  }
  function show() {
    var s = steps[at];
    document.getElementById('src').innerHTML = SRC.map(function (t, i) {
      return i === s.line ? '<span style="background:#2d4a7c;color:#fff;display:block">' + esc(t || ' ') + '</span>' : '<span style="display:block">' + esc(t || ' ') + '</span>';
    }).join('');
    document.getElementById('scope').textContent = s.scope || '(global code)';
    document.getElementById('stack').textContent = s.stack.join('\\n');
    document.getElementById('msg').textContent = 'step ' + (at + 1) + ' of ' + steps.length + ': ' + s.msg;
  }
  document.getElementById('step').onclick = function () { if (at < steps.length - 1) { at++; show(); } };
  document.getElementById('restart').onclick = build;
  ['a', 'b', 'op'].forEach(function (id) { document.getElementById(id).addEventListener('change', build); });
  build();
<\/script>`
  }],
  quiz:[
    { q:'What makes <code>calculator</code> a higher-order function?', options:['It does maths','It takes another function as an argument','It returns a number','It has three parameters'], answer:1, why:'A higher-order function accepts (or returns) a function; addEventListener is one too.' },
    { q:'What does <code>calculator(4, 5, multiply)</code> return?', options:['9','20','"multiply"','undefined'], answer:1, why:'calculator calls multiply(4, 5) and returns its result.' },
    { q:'Why does <code>calculator(4, 5, add())</code> throw?', options:['add is not defined','add() runs first and its result, NaN, is passed instead of a function','calculator needs four arguments','Numbers cannot be passed to functions'], answer:1, why:'With parentheses the function is called immediately; calculator then tries to call NaN.' },
  ]
});


PG.add({
  id:'l138', index:138, udemyId:12400686, minutes:0, section:'s18', slug:'higher-order-functions-solution', kind:'js',
  title:'Higher Order Function Challenge Solution',
  blurb:'All four operations, each a tiny function with two parameters and a <code>return</code>, and one <code>calculator</code> that runs whichever function it is given. Adding a new operation never means touching calculator — you just write another small function and pass it in.',
  tasks:[
    'Run it: the console should show 9, 1, 12 and 5.',
    'Pass a function that has no name: <code>calculator(7, 2, function (num1, num2) { return num1 % num2; })</code> gives the remainder.',
    'Write a <code>power</code> function (<code>num1 ** num2</code>) and use it through calculator.',
    'What does <code>calculator(1, 0, divide)</code> give? JavaScript does not throw on division by zero.'
  ],
  files:{
'script.js':`function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function calculator(num1, num2, operator) {
  return operator(num1, num2);
}

console.log(calculator(4, 5, add));        // 9
console.log(calculator(5, 4, subtract));   // 1
console.log(calculator(3, 4, multiply));   // 12
console.log(calculator(10, 2, divide));    // 5
`},
  solution:{
'script.js':`function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function calculator(num1, num2, operator) {
  return operator(num1, num2);
}

console.log(calculator(4, 5, add));        // 9
console.log(calculator(5, 4, subtract));   // 1
console.log(calculator(3, 4, multiply));   // 12
console.log(calculator(10, 2, divide));    // 5

// a function with no name, written right where it is passed
console.log(calculator(7, 2, function (num1, num2) {
  return num1 % num2;
}));                                        // 1

// a new operation never changes calculator
function power(num1, num2) {
  return num1 ** num2;
}
console.log(calculator(2, 8, power));       // 256

// dividing by zero is not an error in JavaScript
console.log(calculator(1, 0, divide));      // Infinity
`},
  quiz:[
    { q:'What does <code>calculator(1, 0, divide)</code> print?', options:['An error','0','Infinity','undefined'], answer:2, why:'JavaScript returns Infinity for a positive number divided by zero instead of throwing.' },
    { q:'Can the function you pass in be written inline, with no name?', options:['No, only named functions can be passed','Yes, an anonymous function works exactly the same','Only arrow functions','Only inside addEventListener'], answer:1, why:'Any function value works; that is the same inline style used with addEventListener.' },
  ]
});


PG.add({
  id:'l139', index:139, udemyId:12383968, minutes:11, section:'s18', slug:'playing-sounds', kind:'build',
  previewBase:BASE,
  title:'How to Play Sounds on a Website',
  blurb:'<code>new Audio("sounds/tom-1.mp3")</code> builds an audio object for a file, and its <code>play()</code> method plays it. Inside a listener\'s function, <code>this</code> is the element that fired the event — so <code>this.innerHTML</code> is the clicked drum\'s letter and <code>this.style</code> restyles just that drum.',
  tasks:[
    'Replace the alert with <code>var audio = new Audio("sounds/tom-1.mp3");</code> and <code>audio.play();</code>. Every drum now plays the same tom.',
    '<b>Challenge:</b> in <code>style.css</code>, give each drum its picture with <code>background-image: url("images/tom1.png")</code> — w tom1, a tom2, s tom3, d tom4, j snare, k crash, l kick.',
    'Log <code>this</code> inside the listener and click a few drums: each click logs the button that was clicked.',
    'Log <code>this.innerHTML</code> as well — the letter will choose the sound in the next lesson.',
    '<b>Challenge:</b> make the clicked drum\'s letter white with <code>this.style.color = "white"</code>.'
  ],
  files:{
'index.html':HTML,
'style.css':CSS_TODO,
'script.js':LOOP_OPEN + `    // TODO 1: swap this alert for a sound: new Audio("sounds/tom-1.mp3"), then .play()
    alert("I got clicked!");

    // TODO 3: log this (and this.innerHTML) — which element is it?

    // TODO 4 (challenge): turn the clicked button's text white
` + LOOP_CLOSE},
  solution:{
'style.css':CSS_IMAGES,
'script.js':JS_139},
  explore:[{
    title:'What is <code>this</code> in a listener?', height:430,
    note:'Click the drums with each way of writing the listener. A regular <code>function</code> gets the clicked element as <code>this</code>; an arrow function (you will meet those later in the course) does not get its own <code>this</code>, so the trick stops working.',
    html:`
<style>
  .drum{border:5px solid #404b69;font:900 26px/1 Georgia,serif;color:#da0463;border-radius:10px;width:58px;height:58px;margin:4px;background:#fff center/cover no-repeat;cursor:pointer}
</style>
<div class="knobs">
  <label>listener written as
    <select id="kind">
      <option value="fn">function () { … }</option>
      <option value="arrow">() =&gt; { … }</option>
    </select>
  </label>
</div>
<div class="stage" id="stage" style="text-align:center;background:#283149"></div>
<pre class="readout" id="code"></pre>
<pre class="readout" id="out">Click a drum.</pre>
<script>
  var stage = document.getElementById('stage'), out = document.getElementById('out');
  var PICS = { w: 'tom1', a: 'tom2', s: 'tom3', d: 'tom4' };
  function describe(t) {
    if (t === window) return 'Window   (the whole browser window, not a button)';
    if (t && t.nodeType === 1) return '<button class="' + t.className + '">';
    return String(t);
  }
  function report(t, letter) {
    var white = t && t.style ? 'turned white ✓' : 'nothing to restyle ✗';
    out.textContent = 'you clicked the "' + letter + '" drum\\n\\n' +
      'this            → ' + describe(t) + '\\n' +
      'this.innerHTML  → ' + (t && t.nodeType === 1 ? '"' + t.innerHTML + '"' : 'undefined') + '\\n' +
      'this.style.color = "white"  → ' + (t && t.nodeType === 1 ? white : 'the window has no style property ✗');
    if (t && t.nodeType === 1) t.style.color = 'white';
  }
  function attach() {
    var kind = document.getElementById('kind').value;
    stage.innerHTML = Object.keys(PICS).map(function (k) { return '<button class="' + k + ' drum" style="background-image:url(assets/drumkit/images/' + PICS[k] + '.png)">' + k + '</button>'; }).join('');
    document.getElementById('code').textContent = 'document.querySelectorAll(".drum")[i].addEventListener("click", ' +
      (kind === 'fn' ? 'function () {' : '() => {') + '\\n  console.log(this);\\n  this.style.color = "white";\\n});';
    stage.querySelectorAll('.drum').forEach(function (b) {
      if (kind === 'fn') b.addEventListener('click', function () { report(this, b.innerHTML); });
      else b.addEventListener('click', () => { report(this, b.innerHTML); });
    });
    out.textContent = 'Click a drum.';
  }
  document.getElementById('kind').onchange = function () { attach(); };
  attach();
<\/script>`
  }],
  quiz:[
    { q:'Inside <code>addEventListener("click", function () { … })</code>, what is <code>this</code>?', options:['The whole document','The element that was clicked','The function itself','The first .drum on the page'], answer:1, why:'For a regular function listener, the browser sets this to the element the listener is attached to.' },
    { q:'What does <code>audio.play()</code> show about the audio object?', options:['play is a property','play is a method — the parentheses run it','Audio is a string','play needs the file name again'], answer:1, why:'new Audio(...) builds an object; play() is one of its methods.' },
    { q:'Why put the image on the button with CSS <code>background-image</code> rather than an <code>&lt;img&gt;</code>?', options:['img tags are not allowed in buttons','The letter text stays on top and the picture stays in the stylesheet','It loads faster','Background images play sounds'], answer:1, why:'The picture is decoration, so it lives in the CSS while the button keeps its letter.' },
  ],
  notes:DRUM_NOTE
});


PG.add({
  id:'l140', index:140, udemyId:12384090, minutes:5, section:'s18', slug:'switch-statements', kind:'build',
  previewBase:BASE,
  title:'How to Use Switch Statements in Javascript',
  blurb:'A <code>switch</code> checks one value against a list of <code>case</code>s and runs the matching block — tidier than seven <code>else if</code>s. Each case ends with <code>break</code>, or execution falls through into the next case. <code>default</code> catches anything that matched nothing, like a final <code>else</code>.',
  tasks:[
    'Inside the listener, keep the clicked drum\'s letter: <code>var buttonInnerHTML = this.innerHTML;</code> (already there).',
    'Replace the single sound with <code>switch (buttonInnerHTML) { … }</code> and a <code>case</code> for each letter. Give each its own variable — <code>tom1</code>, <code>tom2</code>, <code>snare</code>… — and call <code>play()</code> on that same variable.',
    'Finish every case with <code>break;</code> and add a <code>default</code> that logs <code>buttonInnerHTML</code>.',
    'Click all seven drums: seven different sounds (w a s d are toms, j snare, k crash, l kick-bass).',
    'Delete the <code>break</code> under case <code>"w"</code> and click <b>w</b>: you hear w and a together. Put it back.'
  ],
  files:{
'index.html':HTML,
'style.css':CSS_IMAGES,
'script.js':LOOP_OPEN + `    var buttonInnerHTML = this.innerHTML;

    // TODO: replace the two lines below with a switch on buttonInnerHTML
    //   w → sounds/tom-1.mp3     a → sounds/tom-2.mp3    s → sounds/tom-3.mp3
    //   d → sounds/tom-4.mp3     j → sounds/snare.mp3    k → sounds/crash.mp3
    //   l → sounds/kick-bass.mp3
    //   default: log buttonInnerHTML
    var audio = new Audio("sounds/tom-1.mp3");
    audio.play();
` + LOOP_CLOSE},
  solution:{
'script.js':JS_140},
  explore:[{
    title:'Which case runs?', height:500,
    note:'Type a letter to see which case matches. Untick <b>break</b> and every case below the match runs too — that is fall-through. Try an uppercase <b>W</b> as well.',
    html:`
<div class="knobs">
  <label>buttonInnerHTML = "<input type="text" id="key" value="s" maxlength="1" style="width:34px;text-align:center">"</label>
  <label><input type="checkbox" id="brk" checked> break at the end of each case</label>
</div>
<div class="stage" style="padding:0"><pre id="code" style="margin:0;padding:12px 14px;font:12px/1.55 ui-monospace,Menlo,monospace;background:#111827;color:#5d6680;border-radius:10px"></pre></div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<script>
  var CASES = [['w', 'tom-1'], ['a', 'tom-2'], ['s', 'tom-3'], ['d', 'tom-4'], ['j', 'snare'], ['k', 'crash'], ['l', 'kick-bass']];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function run() {
    var key = document.getElementById('key').value, brk = document.getElementById('brk').checked;
    var match = -1;
    CASES.forEach(function (c, i) { if (match < 0 && c[0] === key) match = i; });
    var running = false, played = [], html = ['<span style="color:#e5e9f5">switch (buttonInnerHTML) {</span>'];
    function line(t, on, color) { html.push('<span style="display:block;' + (on ? 'color:' + (color || '#7ee0a8') + ';background:#1d3a2c' : '') + '">' + esc(t) + '</span>'); }
    var stopped = false;
    CASES.forEach(function (c, i) {
      if (i === match) running = true;
      var on = running && !stopped;
      line('  case "' + c[0] + '":', i === match, '#ffd479');
      line('    new Audio("sounds/' + c[1] + '.mp3").play();', on);
      if (on) played.push(c[1]);
      if (brk) { line('    break;', on); if (on) stopped = true; }
    });
    var toDefault = (match < 0 || running) && !stopped;
    line('  default:', match < 0, '#ffd479');
    line('    console.log(buttonInnerHTML);', toDefault);
    html.push('<span style="color:#e5e9f5">}</span>');
    document.getElementById('code').innerHTML = html.join('');
    var msg = match < 0 ? 'No case is "' + key + '" (cases compare exactly, so "W" is not "w"), so default runs and logs it.'
      : 'case "' + key + '" matches.';
    if (played.length) msg += '\\nsounds played: ' + played.join(', ');
    if (!brk && match >= 0) msg += '\\nWithout break, execution falls through every case below the match — and into default too.';
    if (brk && match >= 0) msg += '\\nbreak jumps out of the switch, so nothing else runs.';
    document.getElementById('out').textContent = msg;
  }
  document.getElementById('key').addEventListener('input', run);
  document.getElementById('brk').addEventListener('change', run);
  run();
<\/script>`
  }],
  quiz:[
    { q:'What happens if a case has no <code>break</code>?', options:['A syntax error','Execution carries on into the next case\'s code','The switch restarts','Only default runs'], answer:1, why:'Without break the switch keeps going from the matching case downwards — fall-through.' },
    { q:'What is <code>default</code> for?', options:['It runs first, always','It handles any value that matched no case','It sets a default sound volume','It is required to end the switch'], answer:1, why:'default is the catch-all, like a final else.' },
    { q:'The value is <code>"W"</code> (capital). Which case runs?', options:['case "w"','default','Both','None and an error is thrown'], answer:1, why:'Cases compare strictly, and "W" is not the same string as "w".' },
  ],
  notes:DRUM_NOTE
});


PG.add({
  id:'l141', index:141, udemyId:12384034, minutes:12, section:'s18', slug:'javascript-objects', kind:'js',
  title:'A Deeper Understanding of Javascript Objects',
  blurb:'An object bundles related facts under one name: <code>{ name: "Timmy", age: 19 }</code>, read back with dot notation (<code>bellBoy1.name</code>). When you need many objects of the same shape, a <b>constructor function</b> — capitalised by convention — is the template, and <code>new</code> builds a fresh object from it each time.',
  tasks:[
    'Replace the four loose variables with one object, <code>bellBoy1</code>, holding <code>name</code>, <code>age</code>, <code>hasWorkPermit</code> and <code>languages</code>. Log <code>bellBoy1.name</code>.',
    'Make <code>houseKeeper1</code> as an object literal with <code>yearsOfExperience</code>, <code>name</code> and <code>cleaningRepertoire</code> (an array of rooms). Log a greeting that uses its name.',
    'Write a constructor, <code>function Housekeeper(yearsOfExperience, name, cleaningRepertoire)</code>, that copies each parameter onto <code>this</code>: <code>this.name = name;</code> and so on.',
    'Create two housekeepers with <code>new</code> — one line each — and log both names. Arguments go in the same order as the parameters.',
    'Leave out <code>new</code> once (<code>var oops = Housekeeper(…)</code>) and log <code>oops</code>: <code>undefined</code>, because nothing created an object for <code>this</code> to fill.'
  ],
  files:{
'script.js':`// Four loose variables describe one bellboy…
var bellBoy1Name = "Timmy";
var bellBoy1Age = 19;
var bellBoy1HasWorkPermit = true;
var bellBoy1Languages = ["French", "English"];
// …and every new bellboy needs four more invented names.

// TODO 1: the same facts as ONE object called bellBoy1, then log bellBoy1.name


// TODO 2: an object literal houseKeeper1 with yearsOfExperience, name and
//         cleaningRepertoire (an array of rooms). Log its name.


// TODO 3: a constructor function Housekeeper(yearsOfExperience, name, cleaningRepertoire)
//         that copies each parameter onto this


// TODO 4: create two housekeepers with new and log both names
`},
  solution:{
'script.js':`var bellBoy1 = {
  name: "Timmy",
  age: 19,
  hasWorkPermit: true,
  languages: ["French", "English"]
};

console.log(bellBoy1.name);                      // Timmy
console.log(bellBoy1);

var houseKeeper1 = {
  yearsOfExperience: 12,
  name: "Jane",
  cleaningRepertoire: ["bathroom", "lobby", "bedroom"]
};

console.log("Hello, my name is " + houseKeeper1.name);

// a constructor: the template every housekeeper is built from
function Housekeeper(yearsOfExperience, name, cleaningRepertoire) {
  this.yearsOfExperience = yearsOfExperience;
  this.name = name;
  this.cleaningRepertoire = cleaningRepertoire;
}

var houseKeeper2 = new Housekeeper(9, "Tom", ["lobby", "bedroom"]);
var houseKeeper3 = new Housekeeper(2, "Geovana", ["bathroom", "lobby"]);

console.log(houseKeeper2.name);                  // Tom
console.log(houseKeeper3.name);                  // Geovana
console.log(houseKeeper3.cleaningRepertoire);    // ["bathroom","lobby"]

// without new nothing builds an object, so you get undefined back:
// var oops = Housekeeper(5, "Sam", ["lobby"]);
// console.log(oops);   // undefined
`},
  explore:[{
    title:'The Housekeeper factory', height:560,
    note:'Fill in the arguments and run the line. Each object becomes a column, the way the lecture pictures objects as a spreadsheet: the same rows (properties) for everyone, different values. Untick <code>new</code> to see what goes wrong without it.',
    html:`
<div class="knobs">
  <label>yearsOfExperience <input type="number" id="yr" value="9" style="width:56px"></label>
  <label>name <input type="text" id="nm" value="Tom" style="width:90px"></label>
  <label>cleaningRepertoire <input type="text" id="rp" value="lobby, bedroom" style="width:140px"></label>
</div>
<div class="knobs">
  <label><input type="checkbox" id="usenew" checked> use new</label>
  <button id="make">run the line</button>
  <button id="clear">start again</button>
</div>
<pre class="readout" id="code"></pre>
<div class="stage" style="overflow-x:auto"><table class="grid" id="tbl"></table></div>
<pre class="readout" id="out" style="white-space:pre-wrap"></pre>
<script>
  function Housekeeper(yearsOfExperience, name, cleaningRepertoire) {
    this.yearsOfExperience = yearsOfExperience;
    this.name = name;
    this.cleaningRepertoire = cleaningRepertoire;
  }
  var made = [];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function vals() {
    return {
      yr: +document.getElementById('yr').value,
      nm: document.getElementById('nm').value,
      rp: document.getElementById('rp').value.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s; }),
      useNew: document.getElementById('usenew').checked
    };
  }
  function lineFor(v) {
    return 'var houseKeeper' + (made.length + 1) + ' = ' + (v.useNew ? 'new ' : '') + 'Housekeeper(' + v.yr + ', "' + v.nm + '", ' + JSON.stringify(v.rp) + ');';
  }
  function preview() {
    document.getElementById('code').textContent = 'function Housekeeper(yearsOfExperience, name, cleaningRepertoire) {\\n' +
      '  this.yearsOfExperience = yearsOfExperience;\\n  this.name = name;\\n  this.cleaningRepertoire = cleaningRepertoire;\\n}\\n\\n' + lineFor(vals());
  }
  function table() {
    var t = document.getElementById('tbl');
    if (!made.length) { t.innerHTML = '<tr><td style="color:#8b92a8">No housekeepers yet: press "run the line".</td></tr>'; return; }
    var props = ['yearsOfExperience', 'name', 'cleaningRepertoire'];
    t.innerHTML = '<tr><th></th>' + made.map(function (m) { return '<th>' + m.label + '</th>'; }).join('') + '</tr>' +
      props.map(function (p) {
        return '<tr><th>' + p + '</th>' + made.map(function (m) { return '<td>' + esc(JSON.stringify(m.obj[p])) + '</td>'; }).join('') + '</tr>';
      }).join('');
  }
  document.getElementById('make').onclick = function () {
    var v = vals(), label = 'houseKeeper' + (made.length + 1), out = document.getElementById('out');
    if (v.useNew) {
      var obj = new Housekeeper(v.yr, v.nm, v.rp);
      made.push({ label: label, obj: obj });
      out.textContent = label + '.name → "' + obj.name + '"\\n' + label + '.cleaningRepertoire[0] → "' + (obj.cleaningRepertoire[0] || '') + '"\\n' +
        'One line built a whole new object with the same three properties.';
    } else {
      var r = Housekeeper(v.yr, v.nm, v.rp);
      out.textContent = label + ' → ' + r + '\\n\\nWithout new there is no fresh object for "this" to fill, and the function returns nothing.\\n' +
        'In a non-strict script "this" falls back to the window, so the values landed there instead:\\n' +
        '  window.yearsOfExperience → ' + window.yearsOfExperience + '\\n  window.cleaningRepertoire → ' + JSON.stringify(window.cleaningRepertoire);
      delete window.yearsOfExperience; delete window.cleaningRepertoire; window.name = '';
    }
    table(); preview();
  };
  document.getElementById('clear').onclick = function () { made = []; document.getElementById('out').textContent = ''; table(); preview(); };
  ['yr', 'nm', 'rp', 'usenew'].forEach(function (id) { document.getElementById(id).addEventListener('input', preview); document.getElementById(id).addEventListener('change', preview); });
  table(); preview();
<\/script>`
  }],
  quiz:[
    { q:'Why is the constructor called <code>Housekeeper</code> with a capital H?', options:['JavaScript requires it','By convention a capital letter marks a constructor meant to be used with new','Capital letters run faster','It makes the properties public'], answer:1, why:'It is a naming convention that tells readers to call it with new.' },
    { q:'What does <code>new Housekeeper(9, "Tom", ["lobby"])</code> give you?', options:['undefined','A new object with yearsOfExperience 9, name "Tom" and that repertoire','The Housekeeper function','An array'], answer:1, why:'new creates an empty object, runs the constructor with this pointing at it, and returns it.' },
    { q:'How do you read the name of <code>houseKeeper2</code>?', options:['houseKeeper2[name]','houseKeeper2.name','houseKeeper2.name()','name.houseKeeper2'], answer:1, why:'Dot notation reads a property; no parentheses because it is a value, not a method.' },
  ]
});


PG.add({
  id:'l142', index:142, udemyId:12384070, minutes:6, section:'s18', slug:'object-methods', kind:'js',
  title:'Objects, their Methods and the Dot Notation',
  blurb:'A <b>method</b> is a function stored on an object. In a literal it is a property whose value is a function; in a constructor it is <code>this.clean = function () { … }</code>. Both properties and methods are reached with a dot — the parentheses are what run a method. <code>new Audio(…)</code> followed by <code>.play()</code> is exactly this pattern.',
  tasks:[
    'Give <code>bellBoy1</code> a <code>moveSuitcase</code> method that alerts <i>May I take your suitcase?</i>, and call it with <code>bellBoy1.moveSuitcase()</code>. (Alerts show up in the console panel.)',
    'Inside the <code>Housekeeper</code> constructor add <code>this.clean = function () { … }</code> that alerts <i>Cleaning in progress...</i>.',
    'Create a housekeeper with <code>new</code> and call its <code>clean()</code> method.',
    'Log <code>typeof houseKeeper1.clean</code>, and notice that <code>houseKeeper1.clean</code> without parentheses runs nothing.',
    'Make <code>var tom1 = new Audio("sounds/tom-1.mp3")</code> and log <code>tom1.src</code> and <code>typeof tom1.play</code>: a capitalised constructor, a property and a method — the same shape as your Housekeeper.'
  ],
  files:{
'script.js':`var bellBoy1 = {
  name: "Timmy",
  age: 19,
  hasWorkPermit: true,
  languages: ["French", "English"],
  // TODO 1: a moveSuitcase method that alerts "May I take your suitcase?"
};

// TODO 2: call it


function Housekeeper(yearsOfExperience, name, cleaningRepertoire) {
  this.yearsOfExperience = yearsOfExperience;
  this.name = name;
  this.cleaningRepertoire = cleaningRepertoire;
  // TODO 3: a clean method that alerts "Cleaning in progress..."
}

// TODO 4: create a housekeeper with new and call its clean method


// TODO 5: new Audio("sounds/tom-1.mp3") is built the same way: log its src
//         property and the type of its play method
`},
  solution:{
'script.js':`var bellBoy1 = {
  name: "Timmy",
  age: 19,
  hasWorkPermit: true,
  languages: ["French", "English"],
  moveSuitcase: function () {
    alert("May I take your suitcase?");
  }
};

bellBoy1.moveSuitcase();          // the dot reaches the method, the () run it


function Housekeeper(yearsOfExperience, name, cleaningRepertoire) {
  this.yearsOfExperience = yearsOfExperience;
  this.name = name;
  this.cleaningRepertoire = cleaningRepertoire;
  this.clean = function () {
    alert("Cleaning in progress...");
  };
}

var houseKeeper1 = new Housekeeper(12, "Jane", ["bathroom", "lobby"]);
houseKeeper1.clean();

console.log(typeof houseKeeper1.clean);   // "function" — without (), nothing runs

// Audio is built the same way: a capitalised constructor,
// properties that describe it and methods that make it act.
var tom1 = new Audio("sounds/tom-1.mp3");
console.log(tom1.src);                    // a property
console.log(typeof tom1.play);            // "function": run it with tom1.play()
`},
  explore:[{
    title:'A real Audio object: properties and methods', height:520,
    note:'This demo makes a genuine <code>Audio</code> object for a short tone it generates. Read its properties, call its methods, and leave the parentheses off <code>play</code> to see the difference.',
    html:`
<div class="knobs">
  <button data-op="play">tone.play()</button>
  <button data-op="pause">tone.pause()</button>
  <button data-op="playRef">tone.play</button>
  <button data-op="paused">tone.paused</button>
  <button data-op="time">tone.currentTime</button>
</div>
<div class="knobs">
  <label>tone.volume = <input type="range" id="vol" min="0" max="1" step="0.1" value="0.5"><span class="val" id="vv">0.5</span></label>
  <label><input type="checkbox" id="loop"> tone.loop = true</label>
</div>
<pre class="readout" id="out">var tone = new Audio(fileLocation);</pre>
<h4>some of the object's properties and methods</h4>
<pre class="readout" id="list"></pre>
<script>
  function makeWav(seconds, freq) {
    var rate = 8000, n = Math.floor(rate * seconds), buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    function str(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) {
      var env = Math.min(1, i / 400, (n - i) / 400);
      v.setInt16(44 + i * 2, Math.round(Math.sin(2 * Math.PI * freq * i / rate) * 0.3 * env * 32767), true);
    }
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }
  var tone = new Audio(makeWav(2.5, 330));
  tone.volume = 0.5;
  var MEMBERS = ['src', 'currentTime', 'duration', 'paused', 'ended', 'volume', 'loop', 'play', 'pause', 'load'];
  function list() {
    document.getElementById('list').textContent = MEMBERS.map(function (m) {
      var v = tone[m];
      if (typeof v === 'function') return 'method    tone.' + m + '()';
      if (m === 'src') v = '"' + String(v).slice(0, 30) + '…"';
      else if (typeof v === 'number') v = isNaN(v) ? 'NaN (not loaded yet)' : Math.round(v * 100) / 100;
      return 'property  tone.' + m + ' = ' + v;
    }).join('\\n');
  }
  function say(stmt, result, why) {
    document.getElementById('out').textContent = '> ' + stmt + (result !== undefined ? '\\n< ' + result : '') + '\\n  // ' + why;
    list();
  }
  document.querySelectorAll('[data-op]').forEach(function (b) {
    b.addEventListener('click', function () {
      var op = b.getAttribute('data-op');
      if (op === 'play') { tone.play(); say('tone.play()', 'Promise', 'a method: the () make the object do something — you should hear a tone'); }
      if (op === 'pause') { tone.pause(); say('tone.pause()', undefined, 'another method'); }
      if (op === 'playRef') say('tone.play', 'ƒ play() { [native code] }', 'no parentheses: you get the function itself, and nothing plays');
      if (op === 'paused') say('tone.paused', String(tone.paused), 'a property: just a value describing the object');
      if (op === 'time') say('tone.currentTime', String(Math.round(tone.currentTime * 100) / 100), 'a property that changes while it plays');
    });
  });
  document.getElementById('vol').addEventListener('input', function () {
    tone.volume = +this.value; document.getElementById('vv').textContent = this.value;
    say('tone.volume = ' + this.value, undefined, 'setting a property: dot, name, equals sign');
  });
  document.getElementById('loop').addEventListener('change', function () {
    tone.loop = this.checked; say('tone.loop = ' + this.checked, undefined, 'another property you can set');
  });
  ['timeupdate', 'play', 'pause', 'loadedmetadata', 'ended'].forEach(function (ev) { tone.addEventListener(ev, list); });
  list();
<\/script>`
  }],
  quiz:[
    { q:'How do you <b>run</b> the <code>clean</code> method of <code>houseKeeper1</code>?', options:['houseKeeper1.clean','houseKeeper1.clean()','clean(houseKeeper1)','houseKeeper1[clean]'], answer:1, why:'The dot reaches the method and the parentheses call it.' },
    { q:'<code>clean</code> logs "Cleaning in progress..." and returns nothing. What does <code>console.log(houseKeeper1.clean())</code> print?', options:['Only "Cleaning in progress..."','"Cleaning in progress..." and then undefined','Only undefined','An error'], answer:1, why:'The method runs first and logs its message; then console.log prints the return value, which is undefined.' },
    { q:'In <code>var tom1 = new Audio("sounds/tom-1.mp3"); tom1.play();</code>, what is <code>Audio</code>?', options:['A string','A constructor that builds an audio object with properties and methods','A CSS property','A method of tom1'], answer:1, why:'Like Housekeeper: capitalised, called with new, and the object it builds has methods such as play().' },
  ],
  notes:`
    <h3>Audio in this playground</h3>
    <p>So the drum kit works without sound files, the preview swaps <code>Audio</code> for a small stand-in that synthesises the drum sounds. It has the parts the course uses — <code>src</code>, <code>play()</code>, <code>pause()</code> — but not everything the real one has. The Explore demo uses the browser's real <code>Audio</code> object.</p>`
});


PG.add({
  id:'l143', index:143, udemyId:13487950, minutes:0, section:'s18', slug:'note-about-next-lesson', kind:'read',
  title:'A Quick Note About the Next Lesson',
  blurb:'A heads-up before the keyboard lesson. The video listens for the <code>"keypress"</code> event, which browsers have deprecated: it never fires for keys that do not type a character (Shift, arrows, Escape) and could disappear in future. Listen for <code>"keydown"</code> instead — the playground\'s version of the drum kit does — and everything else in the lesson works the same.',
  quiz:[
    { q:'Which event should a new project listen for to catch key presses?', options:['"keypress"','"keydown"','"keyPress"','"press"'], answer:1, why:'keydown fires for every key and is the current standard; keypress is deprecated, and event names are all lowercase.' },
  ]
});


PG.add({
  id:'l144', index:144, udemyId:12384106, minutes:8, section:'s18', slug:'keyboard-events', kind:'build',
  previewBase:BASE,
  title:'Using Keyboard Event Listeners to Check for Key Presses',
  blurb:'There is no single element to click for a keyboard, so the listener goes on the whole <code>document</code>. The browser calls your function with an <b>event object</b>, and <code>event.key</code> says which key it was. Moving the switch into a <code>makeSound(key)</code> function lets the click route and the keyboard route share it.',
  tasks:[
    'Add <code>document.addEventListener("keydown", function (event) { console.log(event.key); });</code>. Click an empty part of the preview, then press a few keys: each one is logged.',
    'Create <code>function makeSound(key) { … }</code> and move the whole switch into it, switching on <code>key</code> instead of <code>buttonInnerHTML</code>.',
    'In the click listener, call <code>makeSound(buttonInnerHTML)</code>.',
    'In the keydown listener, replace the log with <code>makeSound(event.key)</code>.',
    'Test both routes: click every drum, then type <b>w a s d j k l</b>. With Caps Lock on, <b>W</b> lands in <code>default</code>. <b>Extra:</b> fix that with <code>event.key.toLowerCase()</code>.'
  ],
  files:{
'index.html':HTML,
'style.css':CSS_IMAGES,
'script.js':JS_140 + `

// TODO 1: listen for "keydown" on the whole document and log event.key
//         (click an empty part of the preview first so it gets your key presses)


// TODO 2: move the switch above into function makeSound(key), switching on key


// TODO 3: call makeSound(buttonInnerHTML) in the click listener,
//         and makeSound(event.key) in the keydown listener
`},
  solution:{
'script.js':JS_144},
  explore:[{
    title:'What a key press sends', height:520,
    note:'Click the dark box, then press keys. The readout shows the event object the browser hands to your function. Switch to <code>keypress</code> and try Shift, Escape or an arrow key.',
    html:`
<style>
  .pad{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;margin:3px;border:4px solid #404b69;border-radius:9px;background:#fff;font:900 20px Georgia,serif;color:#da0463;transition:transform .08s}
  .pad.hit{background:#ffd479;transform:scale(1.12)}
  #zone:focus{outline:3px solid #5b9cff}
</style>
<div class="knobs">
  <label>document.addEventListener(
    <select id="type"><option>keydown</option><option>keyup</option><option>keypress</option></select>, function (event) { … })</label>
</div>
<div class="stage" id="zone" tabindex="0" style="text-align:center;background:#283149;cursor:pointer">
  <div id="pads"></div>
  <div style="color:#dbedf3;font-size:12px;margin-top:6px">click here, then press keys</div>
</div>
<pre class="readout" id="out"></pre>
<pre class="readout" id="hist" style="font-size:11.5px"></pre>
<script>
  var pads = document.getElementById('pads'), current = null, hist = [];
  'wasdjkl'.split('').forEach(function (k) { var d = document.createElement('span'); d.className = 'pad'; d.id = 'p-' + k; d.textContent = k; pads.appendChild(d); });
  function handler(event) {
    if (event.key === ' ' || event.key.indexOf('Arrow') === 0) event.preventDefault();
    var drum = event.key.length === 1 && 'wasdjkl'.indexOf(event.key) >= 0;
    document.getElementById('out').textContent =
      'event.type     → "' + event.type + '"\\n' +
      'event.key      → "' + event.key + '"' + (drum ? '   ← makeSound("' + event.key + '") plays a drum' : '   ← no case matches: default logs it') + '\\n' +
      'event.code     → "' + event.code + '"   (the physical key, whatever Shift says)\\n' +
      'event.shiftKey → ' + event.shiftKey + '\\n' +
      'event.repeat   → ' + event.repeat + '   (true while a key is held down)';
    hist.unshift(event.type + '   key="' + event.key + '"');
    hist = hist.slice(0, 6);
    document.getElementById('hist').textContent = 'latest events\\n' + hist.join('\\n');
    if (drum) { var p = document.getElementById('p-' + event.key); p.classList.add('hit'); setTimeout(function () { p.classList.remove('hit'); }, 120); }
  }
  function listen() {
    if (current) document.removeEventListener(current, handler);
    current = document.getElementById('type').value;
    document.addEventListener(current, handler);
    hist = []; document.getElementById('hist').textContent = 'latest events';
    document.getElementById('out').textContent = 'Listening for "' + current + '". Click the dark box, then press keys.' +
      (current === 'keypress' ? '\\nkeypress is deprecated and ignores keys that type no character — Shift, Escape and the arrows send nothing.' : '');
  }
  document.getElementById('type').onchange = function () { listen(); document.getElementById('zone').focus(); };
  document.getElementById('zone').onclick = function () { this.focus(); };
  listen();
<\/script>`
  }],
  quiz:[
    { q:'Why is the keyboard listener attached to <code>document</code>?', options:['Buttons cannot hear keys','A key press is not aimed at one element, so the whole page listens','document is faster','It is required by keydown'], answer:1, why:'Listening on document catches key presses wherever the focus is on the page.' },
    { q:'Which property of the event says which key was pressed?', options:['event.type','event.key','event.target','event.press'], answer:1, why:'event.key holds the key\'s value as a string, such as "w".' },
    { q:'What does moving the switch into <code>makeSound(key)</code> achieve?', options:['It makes the sounds louder','Clicks and key presses can share one piece of code instead of duplicating it','It is required for keydown to work','It removes the need for break'], answer:1, why:'Both listeners pass a letter to the same function, so the sound logic lives in one place.' },
  ],
  notes:KEY_NOTE + DRUM_NOTE
});


PG.add({
  id:'l145', index:145, udemyId:12384168, minutes:12, section:'s18', slug:'callbacks', kind:'build',
  title:'Understanding Callbacks and How to Respond to Events',
  blurb:'The function you pass to a higher-order function is a <b>callback</b>: you write it, but the other function decides when to call it — and what to pass in. That is where the <code>event</code> parameter comes from: the browser creates an object describing what happened and calls your function with it. Rebuilding a pretend <code>addEventListener</code> makes the hand-over visible.',
  tasks:[
    'Add a click listener to <code>.title</code> whose function takes a parameter called <code>event</code>, and log <code>event.type</code>. Click the heading.',
    'Rename the parameter to <code>e</code> (and its uses). It still works: the browser passes the event in, and the name is yours to choose.',
    'Write <code>anotherAddEventListener(typeOfEvent, callBack)</code>: build an object <code>eventThatHappened</code> (<code>eventType: "keypress"</code>, <code>key: "p"</code>, <code>durationOfKeypress: 2</code>), then call <code>callBack(eventThatHappened)</code> only if its <code>eventType</code> matches <code>typeOfEvent</code>.',
    'Call it with <code>"keypress"</code> and a callback that logs <code>event</code> and <code>event.eventType</code>. Your callback runs, called by the other function, with an object that function made.',
    'Call it with <code>"click"</code>: the callback never runs. Optional: with DevTools open, put <code>debugger;</code> above a call and step through it.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Callbacks</title>
</head>
<body>
  <h1 class="title">Click Me</h1>

  <script src="script.js"></script>
</body>
</html>
`,
'script.js':`// TODO 1: listen for clicks on .title. Give your function a parameter called
//         event and log event.type — the browser fills that parameter in


// TODO 2: a pretend addEventListener, to see how a callback gets called:
//   function anotherAddEventListener(typeOfEvent, callBack) {
//     1. make an object eventThatHappened = { eventType: "keypress", key: "p", durationOfKeypress: 2 }
//     2. if eventThatHappened.eventType matches typeOfEvent, call callBack(eventThatHappened)
//   }


// TODO 3: call anotherAddEventListener("keypress", function (event) { ... })
//         and log event and event.eventType inside your callback
`},
  solution:{
'script.js':`document.querySelector(".title").addEventListener("click", function (event) {
  console.log(event.type);                            // "click"
  console.log(event.target);                          // the element that was clicked
  console.log(event.clientX + ", " + event.clientY);  // where the pointer was
});

// A simplified model of what addEventListener does behind the scenes
function anotherAddEventListener(typeOfEvent, callBack) {
  // ...the browser notices something happen and describes it:
  var eventThatHappened = {
    eventType: "keypress",
    key: "p",
    durationOfKeypress: 2
  };

  if (eventThatHappened.eventType === typeOfEvent) {
    callBack(eventThatHappened);   // YOUR function, called by this one, with the event
  }
}

anotherAddEventListener("keypress", function (event) {
  console.log(event);
  console.log(event.eventType);
});

// a type that does not match: this callback is never called
anotherAddEventListener("click", function (event) {
  console.log("you will never see this");
});
`},
  explore:[{
    title:'Follow the callback', height:600,
    note:'Press <b>Step</b> to walk through the pretend listener the way the debugger would. Watch your function get handed over at the start and only called much later — by the other function, with the object it built. Switch the type to <code>"click"</code> and the call never happens.',
    html:`
<div class="knobs">
  <label>anotherAddEventListener(<select id="type"><option value="keypress">"keypress"</option><option value="click">"click"</option></select>, function (event) { … })</label>
  <button id="step">Step ▶</button>
  <button id="restart">Restart</button>
</div>
<div class="stage" style="display:flex;gap:12px;flex-wrap:wrap;padding:10px">
  <pre id="src" style="flex:1 1 320px;margin:0;font:12px/1.6 ui-monospace,Menlo,monospace;background:#111827;color:#9aa3bd;border-radius:8px;padding:10px"></pre>
  <div style="flex:1 1 180px;min-width:0">
    <h4>scope</h4><pre class="readout" id="scope" style="margin:0 0 10px;min-height:70px;white-space:pre-wrap"></pre>
    <h4>console</h4><pre class="readout" id="con" style="margin:0;min-height:50px;white-space:pre-wrap"></pre>
  </div>
</div>
<pre class="readout" id="msg" style="white-space:pre-wrap"></pre>
<script>
  var SRC = ['function anotherAddEventListener(typeOfEvent, callBack) {', '  // the browser notices something happen and describes it:', '  var eventThatHappened = {',
    '    eventType: "keypress",', '    key: "p",', '    durationOfKeypress: 2', '  };', '', '  if (eventThatHappened.eventType === typeOfEvent) {', '    callBack(eventThatHappened);',
    '  }', '}', '', '', '  console.log(event);', '  console.log(event.eventType);', '});'];
  var EV = '{ eventType: "keypress", key: "p", durationOfKeypress: 2 }';
  var steps = [], at = 0;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function build() {
    var t = document.getElementById('type').value, match = t === 'keypress';
    SRC[13] = 'anotherAddEventListener("' + t + '", function (event) {';
    var outer = 'typeOfEvent = "' + t + '"\\ncallBack = ƒ (event) { … }';
    steps = [
      { hl: [13, 16], scope: '', con: '', msg: 'You call anotherAddEventListener with two arguments: the string "' + t + '" and a whole function. The function is handed over; nothing inside it runs yet.' },
      { hl: [0, 0], scope: outer, con: '', msg: 'Inside the higher-order function. callBack is an ordinary parameter, and right now it holds your function.' },
      { hl: [2, 6], scope: outer + '\\neventThatHappened = ' + EV, con: '', msg: 'Something happens and the function describes it in an object. In a real browser this is the KeyboardEvent or MouseEvent object.' },
      { hl: [8, 8], scope: outer + '\\neventThatHappened = ' + EV, con: '', msg: '"keypress" === "' + t + '"  →  ' + match }
    ];
    if (match) {
      steps.push({ hl: [9, 9], scope: outer + '\\neventThatHappened = ' + EV, con: '', msg: 'callBack(eventThatHappened): YOUR function is called now — by this function, not by you — and handed the object.' });
      steps.push({ hl: [13, 13], scope: 'event = ' + EV, con: '', msg: 'Inside your callback. Its parameter (named event here, but any name works) holds the object that was passed in.' });
      steps.push({ hl: [14, 14], scope: 'event = ' + EV, con: EV, msg: 'console.log(event) prints the whole object.' });
      steps.push({ hl: [15, 15], scope: 'event = ' + EV, con: EV + '\\nkeypress', msg: 'console.log(event.eventType) reads one property of it.' });
      steps.push({ hl: [10, 11], scope: outer, con: EV + '\\nkeypress', msg: '✓ Your callback finishes, control returns to anotherAddEventListener, and that finishes too.' });
    } else {
      steps.push({ hl: [10, 11], scope: outer + '\\neventThatHappened = ' + EV, con: '', msg: '✗ The types do not match, so the if is skipped. callBack is never called: your function never runs and nothing is logged. A real "click" listener would just keep waiting.' });
    }
    at = 0; show();
  }
  function show() {
    var s = steps[at];
    document.getElementById('src').innerHTML = SRC.map(function (line, i) {
      var on = i >= s.hl[0] && i <= s.hl[1];
      return '<span style="display:block;' + (on ? 'background:#2d4a7c;color:#fff' : '') + '">' + esc(line || ' ') + '</span>';
    }).join('');
    document.getElementById('scope').textContent = s.scope || '(global code)';
    document.getElementById('con').textContent = s.con;
    document.getElementById('msg').textContent = 'step ' + (at + 1) + ' of ' + steps.length + ': ' + s.msg;
  }
  document.getElementById('step').onclick = function () { if (at < steps.length - 1) { at++; show(); } };
  document.getElementById('restart').onclick = build;
  document.getElementById('type').onchange = build;
  build();
<\/script>`
  }],
  quiz:[
    { q:'Who calls a callback passed to <code>addEventListener</code>?', options:['You, on the next line','The browser, when the event happens','Nobody, it runs immediately','The CSS engine'], answer:1, why:'You hand the function over; the event source calls it later and passes in the event object.' },
    { q:'Does the parameter have to be called <code>event</code>?', options:['Yes, it is a reserved word','No — e, evt or any name works, it is just a parameter','Only event or e','It must match the event type'], answer:1, why:'The browser passes the object as the first argument; what you call it is up to you.' },
    { q:'In the pretend version, what happens when you call <code>anotherAddEventListener("click", fn)</code>?', options:['fn runs with a click event','fn never runs, because the hard-coded event is a keypress','An error is thrown','fn runs twice'], answer:1, why:'The callback is only called when the event type matches the one asked for.' },
  ]
});


PG.add({
  id:'l146', index:146, udemyId:12384170, minutes:9, section:'s18', slug:'adding-animation', kind:'build', project:true,
  previewBase:BASE,
  title:'Adding Animation to Websites',
  blurb:'The finishing touch: a quick flash on the drum you hit. <code>buttonAnimation(key)</code> finds the drum whose class is that letter, adds the <code>pressed</code> class from the stylesheet, and uses <code>setTimeout</code> — another function that takes a callback — to remove it 100 milliseconds later.',
  tasks:[
    'Create <code>function buttonAnimation(currentKey)</code> and call it next to <code>makeSound</code> in <b>both</b> listeners.',
    'Inside it, find the drum: <code>var activeButton = document.querySelector("." + currentKey);</code> — a class selector needs its dot, so join one on.',
    'Add the <code>pressed</code> class with <code>classList.add</code>. Click a drum: it dims… and stays dim.',
    'Look up <code>setTimeout</code> and use it to remove <code>pressed</code> again after 100 milliseconds.',
    'Press a key with no drum, like <b>x</b> or <b>1</b>, and read the console error. Make <code>buttonAnimation</code> return early unless the key is one of the seven drum letters.'
  ],
  files:{
'index.html':HTML,
'style.css':CSS_IMAGES,
'script.js':`// Detecting button presses

` + LOOP_OPEN + `    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
    // TODO 1: call buttonAnimation(buttonInnerHTML)
` + LOOP_CLOSE + `
// Detecting keyboard presses

document.addEventListener("keydown", function (event) {
  makeSound(event.key);
  // TODO 1: call buttonAnimation(event.key)
});


` + MAKE_SOUND + `

// TODO 2: function buttonAnimation(currentKey)
//   - find the drum whose class is that letter: document.querySelector("." + currentKey)
//   - add the "pressed" class (it is already in style.css)
//   - remove it again 100 milliseconds later with setTimeout
`},
  solution:{
'script.js':JS_146},
  explore:[{
    title:'How long should the flash last?', height:520,
    note:'Drag the delay and hit some drums. Around 100 ms reads as a crisp tap; a second feels sluggish; at 0 ms the class comes off before the browser repaints, so you see nothing. Tick the transition to fade instead of snap.',
    html:`
<style>
  .pad{width:66px;height:66px;margin:5px;border:6px solid #404b69;border-radius:12px;background:#fff center/cover no-repeat;font:900 28px/1 Georgia,serif;color:#da0463;cursor:pointer;padding:0}
  .pad.pressed{box-shadow:0 3px 4px 0 #dbedf3;opacity:.5}
  .fade .pad{transition:opacity .25s,box-shadow .25s}
</style>
<div class="knobs">
  <label>setTimeout delay <input type="range" id="ms" min="0" max="1000" step="10" value="100"><span class="val" id="mv"></span></label>
  <label><input type="checkbox" id="fade"> add a CSS transition</label>
</div>
<div class="stage" id="stage" style="text-align:center;background:#283149"></div>
<pre class="readout" id="code"></pre>
<pre class="readout" id="out">Click a drum, or click inside the demo and type w a s d j k l.</pre>
<script>
  var PICS = { w: 'tom1', a: 'tom2', s: 'tom3', d: 'tom4', j: 'snare', k: 'crash', l: 'kick' };
  var stage = document.getElementById('stage'), ms = document.getElementById('ms'), out = document.getElementById('out');
  stage.innerHTML = Object.keys(PICS).map(function (k) { return '<button class="pad ' + k + '" style="background-image:url(assets/drumkit/images/' + PICS[k] + '.png)">' + k + '</button>'; }).join('');
  function code() {
    document.getElementById('mv').textContent = ms.value + ' ms';
    document.getElementById('code').textContent = 'function buttonAnimation(currentKey) {\\n  var activeButton = document.querySelector("." + currentKey);\\n' +
      '  activeButton.classList.add("pressed");\\n  setTimeout(function () {\\n    activeButton.classList.remove("pressed");\\n  }, ' + ms.value + ');\\n}';
  }
  function buttonAnimation(key) {
    if (!PICS[key]) return;
    var b = stage.querySelector('.' + key), delay = +ms.value, t0 = performance.now();
    b.classList.add('pressed');
    setTimeout(function () {
      b.classList.remove('pressed');
      out.textContent = '"pressed" went on .' + key + ' and came off ' + Math.round(performance.now() - t0) + ' ms later' +
        (delay === 0 ? '\\nwith a 0 ms delay it is removed before the next repaint, so there is no visible flash' : '');
    }, delay);
  }
  stage.addEventListener('click', function (e) { var b = e.target.closest('.pad'); if (b) buttonAnimation(b.textContent); });
  document.addEventListener('keydown', function (e) { buttonAnimation(e.key); });
  ms.addEventListener('input', code);
  document.getElementById('fade').onchange = function () { stage.classList.toggle('fade', this.checked); };
  code();
<\/script>`
  }],
  quiz:[
    { q:'Why does the selector need <code>"." + currentKey</code>?', options:['To make it lowercase','A class selector starts with a dot, and the key on its own is just the letter','To escape special characters','querySelector requires two arguments'], answer:1, why:'"w" alone would look for a &lt;w&gt; tag; ".w" finds the element with class w.' },
    { q:'What unit is the second argument of <code>setTimeout</code> in?', options:['Seconds','Milliseconds','Frames','Minutes'], answer:1, why:'100 means 100 milliseconds, a tenth of a second.' },
    { q:'Code written after a <code>setTimeout(…)</code> call runs…', options:['after the timer finishes','straight away — setTimeout schedules its callback for later and moves on','never','only if the timer is 0'], answer:1, why:'setTimeout does not pause anything; it hands over a callback to be run once the delay has passed.' },
  ],
  notes:KEY_NOTE + DRUM_NOTE
});


PG.add({
  id:'l147', index:147, udemyId:12409876, minutes:0, section:'s18', slug:'drum-kit-download-completed', kind:'read',
  title:'Download the Completed Website',
  blurb:'The finished drum kit — HTML, CSS, JavaScript, pictures and sounds — is attached to this lecture in the course, for comparing with your own once you have built it. In the playground the complete code is the solution to lecture 146, <a href="#/s18/adding-animation">Adding Animation to Websites</a>: <code>makeSound</code>, <code>buttonAnimation</code> and the two listeners that share them.'
});


PG.add({
  id:'l148', index:148, udemyId:17967012, minutes:3, section:'s18', slug:'tip-lack-of-progress', kind:'read',
  title:'Tip from Angela - Dealing with Lack of Progress',
  blurb:'Feeling that you still know very little is normal at every stage, partly because each new topic is harder than the last, so the difficulty never seems to drop. To see how far you have come, go back to the Q&amp;A of an early section and try answering a beginner\'s question — you will find you can, and explaining it cements it for you too.'
});

})();
