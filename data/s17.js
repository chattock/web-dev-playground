/* ===== Section 17 — Boss Level Challenge 1: The Dicee Game ===== */
/* Every build lesson here uses previewBase 'assets/dicee/', so the course's
   relative paths (images/dice1.png … images/dice6.png) load the playground's
   own dice pictures. Each step lesson starts from the previous step's
   solution. Press ▶ Run to "refresh" the page. */

(function () {

var BASE = 'assets/dicee/';

var HEAD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dicee</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css?family=Indie+Flower|Lobster" rel="stylesheet" />
</head>
<body>
  <div class="container">
    <h1>Refresh Me</h1>
`;

var DICE_EMPTY = `
    <div class="dice">
      <p>Player 1</p>
      <img class="img1" src="" />
    </div>

    <div class="dice">
      <p>Player 2</p>
      <img class="img2" src="" />
    </div>
`;

var DICE_TODO = `
    <!-- TODO: point both images at images/dice6.png and give each one alt text -->
    <div class="dice">
      <p>Player 1</p>
      <img class="img1" src="" />
    </div>

    <div class="dice">
      <p>Player 2</p>
      <img class="img2" src="" />
    </div>
`;

var DICE_SIX = `
    <div class="dice">
      <p>Player 1</p>
      <img class="img1" src="images/dice6.png" alt="Player 1's dice" />
    </div>

    <div class="dice">
      <p>Player 2</p>
      <img class="img2" src="images/dice6.png" alt="Player 2's dice" />
    </div>
`;

var ROLL_BUTTON = `
    <button class="roll">Roll again 🎲</button>
`;

var NO_SCRIPT = '';
var SCRIPT_TODO = `
  <!-- TODO: link script.js here, just before </body> -->
`;
var SCRIPT_TAG = `
  <script src="script.js"></script>
`;

function page(dice, script) {
  return HEAD + dice + `  </div>

  <footer>🎲 Dicee 🎲</footer>
` + script + `</body>
</html>
`;
}

var CSS = `.container {
  width: 70%;
  margin: auto;
  text-align: center;
}

.dice {
  text-align: center;
  display: inline-block;
}

body {
  background-color: #393E46;
}

h1 {
  margin: 30px;
  font-family: 'Lobster', cursive;
  text-shadow: 5px 0 #232931;
  font-size: 8rem;
  color: #4ECCA3;
}

p {
  font-size: 2rem;
  color: #4ECCA3;
  font-family: 'Indie Flower', cursive;
}

img {
  width: 80%;
}

footer {
  margin-top: 5%;
  color: #EEEEEE;
  text-align: center;
  font-family: 'Indie Flower', cursive;
}
`;

var CSS_ROLL = CSS + `
.roll {
  display: block;
  margin: 20px auto 0;
  padding: 8px 28px;
  font-family: 'Indie Flower', cursive;
  font-size: 1.6rem;
  color: #393E46;
  background-color: #4ECCA3;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
`;

/* script.js at the end of each step */
var JS_STEP1 = `console.log("script.js is connected!");
`;

var JS_STEP3 = `var randomNumber1 = Math.floor(Math.random() * 6) + 1;   // 1 to 6
console.log(randomNumber1);
`;

var JS_STEP4 = JS_STEP3 + `
var randomDiceImage = "dice" + randomNumber1 + ".png";      // dice1.png … dice6.png
var randomImageSource = "images/" + randomDiceImage;        // images/dice1.png … images/dice6.png

var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", randomImageSource);
`;

var JS_STEP5 = JS_STEP4 + `
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var randomImageSource2 = "images/dice" + randomNumber2 + ".png";

document.querySelectorAll("img")[1].setAttribute("src", randomImageSource2);
`;

var JS_STEP6 = JS_STEP5 + `
if (randomNumber1 > randomNumber2) {
  document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
} else if (randomNumber2 > randomNumber1) {
  document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
} else {
  document.querySelector("h1").innerHTML = "Draw!";
}
`;

var STEP_NOTE = `
    <h3>Refreshing in the playground</h3>
    <p>The page runs again every time you press <b>▶ Run</b> (or <b>⌘/Ctrl + Enter</b>), and whenever you pause typing. Each run is a fresh page load, exactly like pressing refresh on the real project.</p>`;


PG.add({
  id:'l123', index:123, udemyId:12383900, minutes:2, section:'s17', slug:'dicee-challenge', kind:'build', project:true,
  previewBase:BASE,
  title:'Challenge: The Dicee Challenge',
  blurb:'The first boss level: a two-player dice page. Every time it loads it rolls two dice, shows the matching faces and announces the winner (or a draw) in the heading. The course hands you the HTML and CSS so you can spend your effort on the JavaScript; rebuilding the page yourself first is optional extra practice.',
  tasks:[
    'Open the <b>Explore</b> tab and refresh the finished game a few times. That behaviour is what lessons 125–130 build, one step each.',
    '<b>Optional extra practice:</b> rebuild the page\'s HTML from scratch — a <code>.container</code> with an h1 saying <i>Refresh Me</i>, then two <code>.dice</code> boxes, each holding a <code>&lt;p&gt;</code> with the player\'s name and an <code>&lt;img&gt;</code> of <code>images/dice6.png</code> (classes <code>img1</code> and <code>img2</code>).',
    'Style it: background <code>#393E46</code>, text <code>#4ECCA3</code>, the Lobster font for the heading and Indie Flower for the names (the Google Fonts link is already in the head), images at 80% width, and the two dice side by side.',
    'Compare with <b>Show solution</b>. The next lessons start from exactly that skeleton.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dicee</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css?family=Indie+Flower|Lobster" rel="stylesheet" />
</head>
<body>
  <!-- TODO: build the Dicee layout (see the finished game in the Explore tab):
       a .container holding
         - an h1 that says "Refresh Me"
         - two .dice boxes, each with a <p> (Player 1 / Player 2)
           and an <img> of images/dice6.png (classes img1 and img2)
  -->

</body>
</html>
`,
'style.css':`/* TODO: match the finished page
   - background #393E46, text #4ECCA3
   - h1: Lobster font, very large (8rem), a dark text-shadow
   - player names: Indie Flower font, 2rem
   - the two .dice boxes side by side, images 80% wide, everything centred
*/
`},
  solution:{
'index.html':page(DICE_SIX, NO_SCRIPT),
'style.css':CSS},
  explore:[{
    title:'The finished game', height:470,
    note:'This is where the challenge ends up. Each press of the button is a page refresh: two new dice and a new headline.',
    html:`
<link href="https://fonts.googleapis.com/css?family=Indie+Flower|Lobster" rel="stylesheet">
<div class="knobs">
  <button id="go">⟳ Refresh the page</button>
  <span id="tally" style="font-size:12.5px;color:#5b6382"></span>
</div>
<div class="stage" style="background:#393e46;text-align:center;padding:14px 10px 22px">
  <h1 id="h" style="font-family:Lobster,cursive;font-weight:400;color:#4ecca3;font-size:50px;margin:6px 0 14px;text-shadow:3px 0 #232931">Refresh Me</h1>
  <div style="display:inline-block;margin:0 18px">
    <p style="font-family:'Indie Flower',cursive;color:#4ecca3;font-size:24px;margin:0 0 8px">Player 1</p>
    <img id="d1" src="assets/dicee/images/dice6.png" width="120" alt="Player 1's dice">
  </div>
  <div style="display:inline-block;margin:0 18px">
    <p style="font-family:'Indie Flower',cursive;color:#4ecca3;font-size:24px;margin:0 0 8px">Player 2</p>
    <img id="d2" src="assets/dicee/images/dice6.png" width="120" alt="Player 2's dice">
  </div>
</div>
<script>
  var wins = [0, 0, 0], n = 0;
  document.getElementById('go').onclick = function () {
    var a = Math.floor(Math.random() * 6) + 1, b = Math.floor(Math.random() * 6) + 1, h = document.getElementById('h');
    document.getElementById('d1').src = 'assets/dicee/images/dice' + a + '.png';
    document.getElementById('d2').src = 'assets/dicee/images/dice' + b + '.png';
    if (a > b) { h.textContent = '🚩 Player 1 Wins!'; wins[0]++; }
    else if (b > a) { h.textContent = 'Player 2 Wins! 🚩'; wins[1]++; }
    else { h.textContent = 'Draw!'; wins[2]++; }
    n++;
    document.getElementById('tally').textContent = n + ' refreshes · Player 1 won ' + wins[0] + ' · Player 2 won ' + wins[1] + ' · draws ' + wins[2];
  };
<\/script>`
  }],
  quiz:[
    { q:'When does the finished Dicee page roll the dice?', options:['When you click a die','Every time the page loads or refreshes','Once a minute','When you press a key'], answer:1, why:'The script runs from top to bottom on every page load, so each refresh is a new roll. Reacting to clicks comes in the next section.' },
    { q:'Which skills from the DOM section does the game need?', options:['Selecting elements, setAttribute and innerHTML','Only CSS','Forms and inputs','Event listeners and sounds'], answer:0, why:'It picks the images and heading, changes each image\'s src and rewrites the heading text.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l124', index:124, udemyId:12400466, minutes:0, section:'s17', slug:'dicee-step-0-skeleton', kind:'read',
  title:'Dicee Challenge Step 0 - Download the Skeleton Project',
  blurb:'In the course you download and unzip a starter folder: <code>index.html</code>, a stylesheet and an <code>images</code> folder with six dice faces, <code>dice1.png</code> to <code>dice6.png</code>. Here there is nothing to download — the step lessons load that skeleton for you, and <code>images/dice1.png</code> … <code>images/dice6.png</code> point at the playground\'s own dice pictures.',
  quiz:[
    { q:'The <code>images</code> folder sits next to <code>index.html</code>. Which <code>src</code> shows the six?', options:['dice6.png','images/dice6.png','/dice6','images\\dice6'], answer:1, why:'A relative path starts from the HTML file\'s folder: go into images, then name the file, extension included.' },
  ]
});


PG.add({
  id:'l125', index:125, udemyId:12400506, minutes:0, section:'s17', slug:'dicee-step-1-external-js', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 1 - Create an External Javascript File',
  blurb:'Step 1: give the page a JavaScript file. Create it, link it with a <code>&lt;script src&gt;</code> tag placed just before <code>&lt;/body&gt;</code>, and prove it runs before writing anything real.',
  tasks:[
    'In <code>index.html</code>, replace the TODO with <code>&lt;script src="script.js"&gt;&lt;/script&gt;</code>, just before <code>&lt;/body&gt;</code>. (The course names the file <code>index.js</code>; any name works as long as the tag matches.)',
    'In <code>script.js</code>, log a message — or pop an alert — and check that it shows up in the console panel.',
    'Ask yourself why the tag belongs at the end of the body rather than in the head: the next steps change the images, and those must exist before the script runs.'
  ],
  files:{
'index.html':page(DICE_EMPTY, SCRIPT_TODO),
'style.css':CSS,
'script.js':`// TODO: prove this file runs: log a message (or pop an alert)
`},
  solution:{
'index.html':page(DICE_EMPTY, SCRIPT_TAG),
'script.js':JS_STEP1},
  quiz:[
    { q:'Where does the <code>&lt;script src="script.js"&gt;</code> tag go?', options:['At the top of the head','Just before &lt;/body&gt;','Inside the h1','Anywhere, it makes no difference'], answer:1, why:'At the end of the body every element above it already exists when the script runs.' },
    { q:'The <code>src</code> says <code>scripts.js</code> but the file is called <code>script.js</code>. What happens?', options:['The browser fixes the typo','An error pops up on the page','The file silently never loads, so none of your code runs','Only half the code runs'], answer:2, why:'A wrong path just fails to load. The page looks normal, which is why a quick test message is worth adding.' },
  ],
  notes:`
    <h3>The link matters in a real project</h3>
    <p>This playground always runs the <b>script.js</b> tab, tag or no tag, so your test message appears either way. On your own computer the <code>&lt;script src&gt;</code> tag is the only thing connecting the two files — if the path is wrong nothing runs and nothing complains. DevTools' Network tab shows the failed request as a 404.</p>` + STEP_NOTE
});


PG.add({
  id:'l126', index:126, udemyId:12400562, minutes:0, section:'s17', slug:'dicee-step-2-dice-images', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 2 - Add Dice Images',
  blurb:'Step 2: show a die for each player. Both <code>&lt;img&gt;</code> elements get a <code>src</code> pointing at the six, <code>images/dice6.png</code> — a path relative to <code>index.html</code>, so it starts with the folder name.',
  tasks:[
    'Set the first image\'s <code>src</code> to <code>images/dice6.png</code>.',
    'Do the same for the second image. Two sixes should appear under the player names.',
    'Give both images <code>alt</code> text that would make sense to someone using a screen reader, such as <i>Player 1\'s dice</i>.',
    'Break one path on purpose (<code>image/dice6.png</code> or <code>images/dice6</code>) to see what a broken image looks like, then fix it.'
  ],
  files:{
'index.html':page(DICE_TODO, SCRIPT_TAG),
'style.css':CSS,
'script.js':JS_STEP1},
  solution:{
'index.html':page(DICE_SIX, SCRIPT_TAG)},
  quiz:[
    { q:'Why is the path <code>images/dice6.png</code> and not just <code>dice6.png</code>?', options:['Browsers require a folder','The file lives inside the images folder, next to index.html','The .png is optional','It is the same thing'], answer:1, why:'Relative paths start where the HTML file is; the picture is one folder down.' },
    { q:'What is <code>alt</code> text for?', options:['A tooltip that is required by CSS','A description read out by screen readers and shown when the image cannot load','The image file name','Styling the border'], answer:1, why:'alt describes the image for people who cannot see it and appears if the file fails to load.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l127', index:127, udemyId:12400574, minutes:0, section:'s17', slug:'dicee-step-3-random-number', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 3 - Create a Random Number',
  blurb:'Step 3: roll the first die in code. <code>Math.random()</code> gives a decimal from 0 up to (not including) 1; multiply by 6, round <b>down</b> with <code>Math.floor</code>, and add 1 to land on a whole number from 1 to 6.',
  tasks:[
    'Delete the test message from step 1 — the file is clearly connected.',
    'Create a variable <code>randomNumber1</code> holding <code>Math.floor(Math.random() * 6) + 1</code>.',
    'Log it, then press <b>▶ Run</b> a dozen times. You should only ever see 1, 2, 3, 4, 5 and 6.',
    'Use the Explore tab to see why <code>Math.round</code> or leaving off the <code>+ 1</code> would give a broken game.'
  ],
  files:{
'index.html':page(DICE_SIX, SCRIPT_TAG),
'style.css':CSS,
'script.js':JS_STEP1 + `
// TODO: create randomNumber1, a random whole number from 1 to 6, and log it
`},
  solution:{
'script.js':JS_STEP3},
  explore:[{
    title:'From Math.random() to a dice face', height:540,
    note:'Roll once to see each stage of the formula, or roll 600 times to see how often each number comes up. Then swap <code>Math.floor</code> for <code>Math.round</code>, or untick <b>add 1</b>, and watch the game break.',
    html:`
<div class="knobs">
  <button id="one">Roll once</button>
  <button id="many">Roll 600 times</button>
  <label>rounding <select id="fn"><option value="floor">Math.floor</option><option value="round">Math.round</option></select></label>
  <label><input type="checkbox" id="plus" checked> add 1</label>
</div>
<pre class="readout" id="steps"></pre>
<div class="stage"><div id="hist" style="display:flex;align-items:flex-end;justify-content:center;gap:10px;height:150px;padding-top:16px"></div></div>
<p class="note" id="msg"></p>
<script>
  var counts = {}, total = 0;
  var fnSel = document.getElementById('fn'), plus = document.getElementById('plus');
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function roll(show) {
    var r = Math.random(), x6 = r * 6, f = fnSel.value;
    var whole = f === 'floor' ? Math.floor(x6) : Math.round(x6);
    var result = plus.checked ? whole + 1 : whole;
    counts[result] = (counts[result] || 0) + 1; total++;
    if (show) document.getElementById('steps').textContent =
      pad('Math.random()', 22) + r.toFixed(6) + '\\n' +
      pad('× 6', 22) + x6.toFixed(6) + '\\n' +
      pad('Math.' + f + '(…)', 22) + whole + '\\n' +
      pad(plus.checked ? '+ 1' : '(no + 1)', 22) + result + '\\n\\n' +
      'image: images/dice' + result + '.png' + (result >= 1 && result <= 6 ? '   ✓' : '   ✗ there is no such file');
  }
  function draw() {
    var keys = [1, 2, 3, 4, 5, 6];
    Object.keys(counts).forEach(function (k) { k = +k; if (keys.indexOf(k) < 0) keys.push(k); });
    keys.sort(function (a, b) { return a - b; });
    var max = 1;
    keys.forEach(function (k) { if ((counts[k] || 0) > max) max = counts[k]; });
    document.getElementById('hist').innerHTML = keys.map(function (k) {
      var c = counts[k] || 0, ok = k >= 1 && k <= 6;
      return '<div style="text-align:center;font:12px ui-monospace,Menlo,monospace">' +
        '<div style="color:#5b6382">' + c + '</div>' +
        '<div style="width:34px;height:' + Math.round(110 * c / max) + 'px;background:' + (ok ? '#5b9cff' : '#ff6b6b') + ';border-radius:4px 4px 0 0"></div>' +
        '<div style="font-weight:700;margin-top:3px">' + k + '</div></div>';
    }).join('');
    var m = document.getElementById('msg');
    if (!total) m.textContent = '';
    else if (fnSel.value === 'floor' && plus.checked) m.textContent = total + ' rolls. Every face gets an equal share (about one in six). This is the formula to use.';
    else if (fnSel.value === 'round') m.textContent = total + ' rolls. Rounding to the nearest number gives the end values only half a slot each, so they turn up half as often — and 7 (or 0) appears too.';
    else m.textContent = total + ' rolls. Without + 1 the range is 0 to 5: a 0 asks for images/dice0.png, which does not exist, and a 6 never comes up.';
  }
  function reset() { counts = {}; total = 0; draw(); document.getElementById('steps').textContent = 'Press Roll once.'; }
  document.getElementById('one').onclick = function () { roll(true); draw(); };
  document.getElementById('many').onclick = function () { for (var i = 0; i < 600; i++) roll(i === 599); draw(); };
  fnSel.onchange = reset; plus.onchange = reset;
  reset();
<\/script>`
  }],
  quiz:[
    { q:'What range does <code>Math.random()</code> produce?', options:['1 to 6','0 to 1, including 1','0 up to but never quite 1','Any whole number'], answer:2, why:'It returns a decimal from 0 (inclusive) up to just below 1.' },
    { q:'What does <code>Math.floor(Math.random() * 6)</code> give on its own?', options:['1 to 6','0 to 5','0 to 6','1 to 5'], answer:1, why:'Times 6 gives 0 up to just under 6, and rounding down leaves 0, 1, 2, 3, 4 or 5 — so add 1.' },
    { q:'Why not use <code>Math.round</code> instead of <code>Math.floor</code>?', options:['It is slower','It makes the lowest and highest values half as likely and can produce 7','It only works on whole numbers','It always rounds up'], answer:1, why:'Each end value only gets half a rounding slot, so the dice would be unfair.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l128', index:128, udemyId:12400578, minutes:0, section:'s17', slug:'dicee-step-4-random-dice-image', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 4 - Change the <img> to a Random Dice',
  blurb:'Step 4: connect the number to a picture. The files are named <code>dice1.png</code> to <code>dice6.png</code>, so gluing <code>"images/dice" + randomNumber1 + ".png"</code> together gives the right path. Then <code>setAttribute("src", …)</code> on the first image swaps it in.',
  tasks:[
    'Build the file name from the number: <code>"dice" + randomNumber1 + ".png"</code>, then put <code>"images/"</code> in front of it.',
    'Select the first image — <code>document.querySelectorAll("img")[0]</code>, or <code>document.querySelector(".img1")</code> — and store it in <code>image1</code>.',
    'Call <code>image1.setAttribute("src", randomImageSource)</code>.',
    'Press <b>▶ Run</b> several times. The left die should change and match the number in the console; the right one stays a six.',
    '<b>Extra:</b> write the same path as a template literal — <code>`images/dice${randomNumber1}.png`</code>.'
  ],
  files:{
'index.html':page(DICE_SIX, SCRIPT_TAG),
'style.css':CSS,
'script.js':JS_STEP3 + `
// TODO: build the image path for that number, e.g. "images/dice4.png",
//       then use setAttribute to put it in the FIRST <img>
`},
  solution:{
'script.js':JS_STEP4},
  explore:[{
    title:'Building the path', height:450,
    note:'Slide the number and switch parts of the path off. The image only loads when the string matches a real file name exactly.',
    html:`
<div class="knobs">
  <label>randomNumber1 <input type="range" id="n" min="0" max="7" value="4"><span class="val" id="nv"></span></label>
  <label><input type="checkbox" id="folder" checked> "images/" in front</label>
  <label><input type="checkbox" id="ext" checked> ".png" at the end</label>
</div>
<pre class="readout" id="code" style="white-space:pre-wrap"></pre>
<div class="stage" style="background:#393e46;text-align:center;min-height:150px"><img id="img" width="120" alt="the left die"></div>
<pre class="readout" id="res"></pre>
<script>
  var n = document.getElementById('n'), img = document.getElementById('img'), res = document.getElementById('res');
  function run() {
    var v = n.value, folder = document.getElementById('folder').checked, ext = document.getElementById('ext').checked;
    var path = (folder ? 'images/' : '') + 'dice' + v + (ext ? '.png' : '');
    document.getElementById('nv').textContent = v;
    document.getElementById('code').textContent =
      (folder ? '"images/dice"' : '"dice"') + ' + randomNumber1' + (ext ? ' + ".png"' : '') + '   →   "' + path + '"\\n\\n' +
      'image1.setAttribute("src", "' + path + '");';
    res.textContent = 'loading…';
    img.onload = function () { res.textContent = '✓ ' + path + ' exists, so the die shows a ' + v + '.'; };
    img.onerror = function () { res.textContent = '✗ No file called ' + path + ': the browser shows a broken image.' + (v < 1 || v > 6 ? '\\n  Only dice1.png to dice6.png exist.' : ''); };
    img.src = 'assets/dicee/' + path;
  }
  n.addEventListener('input', run);
  document.getElementById('folder').onchange = run;
  document.getElementById('ext').onchange = run;
  run();
<\/script>`
  }],
  quiz:[
    { q:'If <code>randomNumber1</code> is 3, what is <code>"images/dice" + randomNumber1 + ".png"</code>?', options:['"images/dice + 3 + .png"','"images/dice3.png"','An error, you cannot add numbers to strings','"images/dice.png3"'], answer:1, why:'+ with a string joins the pieces, converting the number to text.' },
    { q:'What does <code>setAttribute("src", path)</code> do to an image?', options:['Downloads it','Replaces its src, so the browser loads the new file','Adds a second image','Changes the alt text'], answer:1, why:'Changing src tells the browser to fetch and show a different file in the same img element.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l129', index:129, udemyId:12400594, minutes:0, section:'s17', slug:'dicee-step-5-both-images', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 5 - Change both <img> Elements',
  blurb:'Step 5: roll for player 2 as well. Same formula, a second variable <code>randomNumber2</code>, and the second image. The two rolls are independent, so sometimes they match — the next step has to cope with that.',
  tasks:[
    'Create <code>randomNumber2</code> with the same formula as the first.',
    'Build its path and set it on the second image (<code>querySelectorAll("img")[1]</code> or <code>.img2</code>).',
    'Type this out rather than copy-pasting step 4: pasted code is how a stray <code>randomNumber1</code> ends up in the second block and both dice always match.',
    'Run it a few times and check the two dice differ — and occasionally agree.'
  ],
  files:{
'index.html':page(DICE_SIX, SCRIPT_TAG),
'style.css':CSS,
'script.js':JS_STEP4 + `
// TODO: roll randomNumber2 and show it in the SECOND <img>
`},
  solution:{
'script.js':JS_STEP5},
  quiz:[
    { q:'Both dice always show the same face. What is the most likely bug?', options:['Math.random is broken','The second image is set from randomNumber1','The images are cached','The CSS is wrong'], answer:1, why:'A copy-pasted line that still uses randomNumber1 makes the second die mirror the first.' },
    { q:'Which selects the second image on the page?', options:['document.querySelector("img")','document.querySelectorAll("img")[1]','document.querySelectorAll("img")[2]','document.querySelector("img")[1]'], answer:1, why:'querySelectorAll returns every image and indexes start at 0, so [1] is the second.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l130', index:130, udemyId:12400606, minutes:0, section:'s17', slug:'dicee-step-6-show-winner', kind:'build',
  previewBase:BASE,
  title:'Dicee Challenge Step 6 - Change the Title to Display a Winner',
  blurb:'Step 6: announce the result. Compare the two numbers with <code>if</code> / <code>else if</code> / <code>else</code> and write <i>Player 1 Wins!</i>, <i>Player 2 Wins!</i> or <i>Draw!</i> into the h1.',
  tasks:[
    'Write an <code>if</code> for player 1 rolling higher, and set the h1\'s <code>innerHTML</code> to <i>Player 1 Wins!</i>.',
    'Add an <code>else if</code> for player 2 rolling higher.',
    'Finish with an <code>else</code> for a draw: if neither number is bigger, they must be equal.',
    'Run it until you have seen all three messages, checking each one against the dice.',
    '<b>Extra:</b> put a flag emoji on the winner\'s side, e.g. <i>🚩 Player 1 Wins!</i> and <i>Player 2 Wins! 🚩</i>.'
  ],
  files:{
'index.html':page(DICE_SIX, SCRIPT_TAG),
'style.css':CSS,
'script.js':JS_STEP5 + `
// TODO: compare the two numbers and change the h1 to
//       "Player 1 Wins!", "Player 2 Wins!" or "Draw!"
`},
  solution:{
'script.js':JS_STEP6},
  quiz:[
    { q:'Why can the last branch be a plain <code>else</code> for the draw?', options:['Draws are rare','If neither number is bigger than the other, they must be equal','else always means equal','It cannot; it needs a condition'], answer:1, why:'The first two branches cover both "bigger" cases, so whatever is left is a tie.' },
    { q:'What is wrong with <code>if (randomNumber1 = randomNumber2)</code>?', options:['Nothing, it compares the two numbers','A single = copies randomNumber2 into randomNumber1 instead of comparing them','Numbers cannot be compared in an if','The round brackets should be square'], answer:1, why:'A single = stores a value. Compare with === (or let the final else catch the draw).' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l131', index:131, udemyId:12383908, minutes:15, section:'s17', slug:'dicee-solution', kind:'build', project:true,
  previewBase:BASE,
  title:'The Solution to the Dicee Challenge',
  blurb:'The whole game as the lecture writes it: two random numbers, two paths built by joining strings, <code>setAttribute</code> on each image, and an if-chain for the headline. The video spells every step out in its own variable on purpose; shorter is possible, but readable beats clever.',
  tasks:[
    'Read the code from top to bottom and press <b>▶ Run</b> a few times. Check the headline always agrees with the dice.',
    'The lecture picks the images with <code>querySelectorAll("img")[0]</code> and <code>[1]</code>. Switch to the classes the skeleton already gives you: <code>.img1</code> and <code>.img2</code>.',
    'Shrink each die to two lines — one for the number, one that sets the <code>src</code> — without making it harder to follow.',
    '<b>Stretch:</b> wrap everything in a <code>rollDice()</code> function, call it once, and add a <i>Roll again</i> button under the dice that calls it with <code>addEventListener("click", rollDice)</code>. (Event listeners are the subject of the next section.)',
    '<b>Stretch:</b> swap <code>var</code> for <code>const</code> — none of these values change once set.'
  ],
  files:{
'index.html':page(DICE_SIX, SCRIPT_TAG),
'style.css':CSS,
'script.js':`var randomNumber1 = Math.floor(Math.random() * 6) + 1; // 1-6

var randomDiceImage = "dice" + randomNumber1 + ".png"; // dice1.png - dice6.png

var randomImageSource = "images/" + randomDiceImage; // images/dice1.png - images/dice6.png

var image1 = document.querySelectorAll("img")[0];

image1.setAttribute("src", randomImageSource);


var randomNumber2 = Math.floor(Math.random() * 6) + 1;

var randomImageSource2 = "images/dice" + randomNumber2 + ".png";

document.querySelectorAll("img")[1].setAttribute("src", randomImageSource2);


// If player 1 wins
if (randomNumber1 > randomNumber2) {
  document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
}
else if (randomNumber2 > randomNumber1) {
  document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
}
else {
  document.querySelector("h1").innerHTML = "Draw!";
}
`},
  solution:{
'index.html':page(DICE_SIX + ROLL_BUTTON, SCRIPT_TAG),
'style.css':CSS_ROLL,
'script.js':`function rollDice() {
  const randomNumber1 = Math.floor(Math.random() * 6) + 1;
  const randomNumber2 = Math.floor(Math.random() * 6) + 1;

  document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
  document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

  if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
  } else if (randomNumber2 > randomNumber1) {
    document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
  } else {
    document.querySelector("h1").innerHTML = "Draw!";
  }
}

rollDice();   // roll once when the page loads, like a refresh

// stretch: roll again without reloading (addEventListener comes in the next section)
document.querySelector(".roll").addEventListener("click", rollDice);
`},
  quiz:[
    { q:'Which line selects the <b>second</b> die in the lecture\'s solution?', options:['document.querySelector("img")','document.querySelectorAll("img")[1]','document.querySelectorAll("img")[2]','document.getElementById("img2")'], answer:1, why:'querySelectorAll returns both images in page order; index 1 is the second.' },
    { q:'What is the lecture\'s advice about shortening code?', options:['Always use the fewest lines possible','Never refactor working code','Aim for a balance: short enough to scan, clear enough to understand','Put everything on one line'], answer:2, why:'Very compressed code is hard to read later; the walkthrough is deliberately step-by-step.' },
    { q:'Why does the stretch solution pass <code>rollDice</code> without parentheses to <code>addEventListener</code>?', options:['Parentheses are optional','With () it would run once immediately and hand over its result instead of the function','It makes the dice roll twice','addEventListener adds them itself'], answer:1, why:'The listener needs the function itself so it can call it on every click — the next section covers this in detail.' },
  ],
  notes:STEP_NOTE
});


PG.add({
  id:'l132', index:132, udemyId:12400628, minutes:0, section:'s17', slug:'dicee-download-completed', kind:'read',
  title:'Download the Completed Website',
  blurb:'The finished Dicee project is attached to this lecture in the course as a download, for checking your own version or getting unstuck after you have had a proper go. In the playground the finished code is on lesson 131, <a href="#/s17/dicee-solution">The Solution to the Dicee Challenge</a>, with a reworked version under <b>Show solution</b>.'
});


PG.add({
  id:'l133', index:133, udemyId:17966986, minutes:2, section:'s17', slug:'tip-learning-before-you-eat', kind:'read',
  title:'Tip from Angela - Learning Before you Eat',
  blurb:'Schedule the hardest learning for early in the day, before a meal. A big, carb-heavy lunch tends to leave people sleepy and unfocused, so tackle the demanding work first and keep lunch lighter. It is a personal habit rather than a rule — skip it if fasting is not safe for you.'
});

})();
