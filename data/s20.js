/* ===== Section 20 — Boss Level Challenge 2: The Simon Game ===== */
/* Every "Step N" lesson starts from the previous step's finished code with that
   step's instructions as TODOs; every "Step N - Answer" lesson shows the
   finished code for that step. The course's game.js is the Script tab here
   (linked as script.js) and its styles.css is the style.css tab. Sounds such as
   sounds/red.mp3 are synthesised by the preview, so no audio files are needed. */

(function () {

const CDN = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';

/* ---------------- index.html ---------------- */
const BOARD = `  <h1 id="level-title">Press A Key to Start</h1>
  <div class="container">
    <div class="row">
      <div type="button" id="green" class="btn green"></div>
      <div type="button" id="red" class="btn red"></div>
    </div>
    <div class="row">
      <div type="button" id="yellow" class="btn yellow"></div>
      <div type="button" id="blue" class="btn blue"></div>
    </div>
  </div>
`;
function simonHtml(tail, board) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simon</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
</head>
<body>
${board || BOARD}${tail}</body>
</html>
`;
}
const HTML0 = simonHtml('');
const HTML1_TODO = simonHtml('\n  <!-- TODO: add the jQuery library from the CDN first, then your own game script -->\n\n');
const HTML1 = simonHtml(`
  <script src="${CDN}"><\/script>
  <!-- the course names the next file game.js; in the playground it is the script.js tab -->
  <script src="script.js"><\/script>
`);

/* ---------------- style.css (the course's styles.css) ---------------- */
const CSS = `body {
  margin: 0;
  min-height: 100vh;
  text-align: center;
  background: #10152a;
  font-family: "Courier New", Courier, monospace;
  color: #f4f1de;
}

#level-title {
  margin: 0;
  padding: 32px 12px 22px;
  font-size: 2.2rem;
  letter-spacing: 0.05em;
}

.container {
  display: inline-block;
  padding-bottom: 30px;
}

.row {
  display: flex;
  justify-content: center;
  gap: 22px;
  margin-bottom: 22px;
}

.btn {
  width: 180px;
  height: 180px;
  border: 8px solid #0a0e1c;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35);
}

/* flashed on the body when the player makes a mistake */
.game-over {
  background: #b3261e;
  opacity: 0.85;
}

.red { background: #e5383b; }
.green { background: #2a9d8f; }
.blue { background: #3a86ff; }
.yellow { background: #ffbe0b; }

/* added for a moment when a button is clicked */
.pressed {
  background: #f8f9fa;
  box-shadow: 0 0 24px #f8f9fa;
}

/* the playground preview is narrow: shrink the board so all four buttons fit */
@media (max-width: 480px) {
  .row { gap: 14px; margin-bottom: 14px; }
  .btn { width: 120px; height: 120px; }
}
`;

/* ---------------- game.js, step by step ---------------- */
const TOP = `// game.js (the Script tab): all of the Simon game's logic goes in this file.

`;
const VARS2 = `var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];

`;
const VARS4 = `var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

`;
const VARS7 = VARS4 + `var started = false;
var level = 0;

`;
const TEST1 = `// Temporary test: one call per run, so you see one flash and hear one sound.
nextSequence();
console.log(gamePattern);
`;
const NEXT_S2 = `function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
}
`;
const NEXT_S3 = `function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  var audio = new Audio("sounds/" + randomChosenColour + ".mp3");
  audio.play();
}
`;
const NEXT_S5 = `function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}
`;
const NEXT_S7 = `function nextSequence() {
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}
`;
const NEXT_S8 = `function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}
`;
const PLAY = `function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}
`;
const ANIM = `function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
`;
const CLICK4 = `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
});
`;
const CLICK5 = `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  playSound(userChosenColour);
});
`;
const CLICK6 = `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  playSound(userChosenColour);
  animatePress(userChosenColour);
});
`;
const CLICK8 = `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});
`;
const KEY = `$(document).keydown(function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

`;
const CHECK_HEAD = `function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    console.log("success");
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
`;
const GAME_OVER = `    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
`;
const CHECK8 = CHECK_HEAD + `    console.log("wrong");
  }
}
`;
const CHECK9 = CHECK_HEAD + GAME_OVER + `  }
}
`;
const CHECK10 = CHECK_HEAD + GAME_OVER + `    startOver();
  }
}
`;
const START_OVER = `function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
`;

// finished code after each step
const S1 = TOP + `// Step 1 check: this prints "Press A Key to Start" only if jQuery loaded
// before this file. Delete the line once you have seen it work.
console.log($("h1").text());
`;
const S2 = TOP + VARS2 + NEXT_S2 + `
// Temporary test: three calls leave three random colours in gamePattern.
nextSequence();
nextSequence();
nextSequence();
console.log(gamePattern);
`;
const S3 = TOP + VARS2 + NEXT_S3 + '\n' + TEST1;
const S4 = TOP + VARS4 + CLICK4 + '\n' + NEXT_S3 + '\n' + TEST1;
const S5 = TOP + VARS4 + CLICK5 + '\n' + NEXT_S5 + '\n' + PLAY + '\n' + TEST1;
const S6 = TOP + VARS4 + CLICK6 + '\n' + NEXT_S5 + '\n' + PLAY + '\n' + ANIM + '\n' + TEST1;
const S7 = TOP + VARS7 + KEY + CLICK6 + '\n' + NEXT_S7 + '\n' + PLAY + '\n' + ANIM;
const S8 = TOP + VARS7 + KEY + CLICK8 + '\n' + CHECK8 + '\n' + NEXT_S8 + '\n' + PLAY + '\n' + ANIM;
const S9 = TOP + VARS7 + KEY + CLICK8 + '\n' + CHECK9 + '\n' + NEXT_S8 + '\n' + PLAY + '\n' + ANIM;
const S10 = TOP + VARS7 + KEY + CLICK8 + '\n' + CHECK10 + '\n' + NEXT_S8 + '\n' + PLAY + '\n' + ANIM + '\n' + START_OVER;

// starters: the previous step's code plus this step's TODOs
const S1_START = TOP + `// TODO 3: prove this file runs: alert("Hello"); (alerts appear in the console panel here)

// TODO 4: prove jQuery is loaded: console.log($("h1").text()); should print the h1's text
`;
const S2_START = TOP + `// TODO 3: create an array called buttonColours holding "red", "blue", "green", "yellow" (in that order)


// TODO 5: create an empty array called gamePattern


// TODO 1: create a function called nextSequence()
//   TODO 2: inside it, make randomNumber: a random whole number from 0 to 3
//   TODO 4: make randomChosenColour: the colour in buttonColours at position randomNumber
//   TODO 6: add randomChosenColour to the end of gamePattern


// Test: call nextSequence() three times down here, then console.log(gamePattern)
`;
const S3_START = TOP + VARS2 + `function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // TODO 1: select the button whose id is randomChosenColour (jQuery id selector: "#" + ...)
  // TODO 2: make that button flash (search for "jQuery animate flash")
  // TODO 3: play the sound named after the colour, such as sounds/red.mp3 (search for "play sound JavaScript")
}

` + TEST1;
const S4_START = TOP + `var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
// TODO 3: create an empty array called userClickedPattern

// TODO 1: run a handler function whenever any element with the class btn is clicked
//   TODO 2: inside it, store the id of the clicked button in userChosenColour
//   TODO 4: add userChosenColour to the end of userClickedPattern, then console.log the array


` + NEXT_S3 + '\n' + TEST1;
const S5_START = TOP + VARS4 + `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  // TODO 4: play the sound for userChosenColour with playSound()
});

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  // TODO 2: move the next two lines into playSound() below...
  // TODO 3: ...and call playSound(randomChosenColour) here instead
  var audio = new Audio("sounds/" + randomChosenColour + ".mp3");
  audio.play();
}

// TODO 1: create a function playSound(name) that plays "sounds/" + name + ".mp3"


` + TEST1;
const S6_START = TOP + VARS4 + `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  playSound(userChosenColour);
  // TODO 4: call animatePress() for userChosenColour
});

` + NEXT_S5 + '\n' + PLAY + `
// TODO 1: create a function animatePress(currentColour)
//   TODO 2: add the class "pressed" to the button whose id is currentColour
//   TODO 3: remove that class again 100 milliseconds later (search for "JavaScript delay")


` + TEST1;
const S7_START = TOP + VARS4 + `// TODO 2: a variable called started, set to false, to remember whether the game has begun
// TODO 3: a variable called level, starting at 0

// TODO 1: detect a key press anywhere on the page. On the FIRST press only:
//         show "Level " + level in the h1 (#level-title), call nextSequence()
//         and set started to true


` + CLICK6 + `
function nextSequence() {
  // TODO 4: add 1 to level, then show "Level " + level in #level-title

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

` + PLAY + '\n' + ANIM + `
// TODO 5: delete this temporary test. From now on the first key press starts the game.
nextSequence();
console.log(gamePattern);
`;
const S8_START = TOP + VARS7 + KEY + `$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  console.log(userClickedPattern);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  // TODO 2: call checkAnswer() with the index of the click just made,
  //         userClickedPattern.length - 1 (the console.log above can go now)
});

// TODO 1: create a function checkAnswer(currentLevel)
//   TODO 3: if gamePattern and userClickedPattern hold the same colour at
//           index currentLevel, log "success"; otherwise log "wrong"
//   TODO 4: on a success, if the player has now clicked as many colours as
//           gamePattern holds, call nextSequence() after a 1000 ms delay


function nextSequence() {
  // TODO 5: empty userClickedPattern here, ready for the next level
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

` + PLAY + '\n' + ANIM;
const S9_START = TOP + VARS7 + KEY + CLICK8 + '\n' + CHECK_HEAD + `    console.log("wrong");
    // TODO 1: play the "wrong" sound with playSound()
    // TODO 2: add the class "game-over" to the body, and remove it again 200 milliseconds later
    // TODO 3: change the h1 (#level-title) to "Game Over, Press Any Key to Restart"
  }
}

` + NEXT_S8 + '\n' + PLAY + '\n' + ANIM;
const S10_START = TOP + VARS7 + KEY + CLICK8 + '\n' + CHECK_HEAD + GAME_OVER + `    // TODO 2: call startOver()
  }
}

` + NEXT_S8 + '\n' + PLAY + '\n' + ANIM + `
// TODO 1: create a function startOver() that puts level, gamePattern and
//         started back to the values they had when the page loaded
`;

const FOCUS = 'Click inside the preview first: it then receives your key presses, and the browser lets it play sound.';

function files(js, html) { return { 'index.html': html || HTML1, 'style.css': CSS, 'script.js': js }; }

// "Step N - Answer" lessons: the finished code for that step, ready to run and vary
function answer(o, js) {
  PG.add(Object.assign({ section:'s20', kind:'build', files: files(js), solution: { 'script.js': js } }, o));
}


/* ------------------------------------------------------------------ 160 */
PG.add({
  id:'l160', index:160, udemyId:12384246, minutes:1, section:'s20', slug:'what-you-will-make', kind:'read',
  title:'What You\'ll Make: The Simon Game',
  blurb:'The second boss-level challenge is the memory game Simon, built with jQuery and the plain JavaScript from the last few sections. A key press starts it; the game flashes one coloured button and plays its note; you click the same button; and every level adds one more colour to the sequence you have to repeat. A single wrong click ends the game, and another key press starts a new one.',
  links:[
    { title:'The finished Simon game', url:'https://londonappbrewery.github.io/Simon-Game/', note:'the live version shown in the video' },
  ],
  quiz:[
    { q:'What changes from one level to the next?', options:['The buttons swap places','One more colour joins the sequence you must repeat','A new set of colours appears','Only the score'], answer:1, why:'Each level replays nothing new except one extra random colour, which you add to the whole sequence you already remembered.' },
    { q:'Which skills does this challenge pull together?', options:['CSS layout only','jQuery selectors, events and effects plus arrays, functions, conditionals and timers','Node and Express','Bootstrap components'], answer:1, why:'The game is mostly JavaScript logic (arrays, functions, if/else, setTimeout) with jQuery handling the page.' },
  ],
});


/* ------------------------------------------------------------------ 161 */
PG.add({
  id:'l161', index:161, udemyId:12664256, minutes:0, section:'s20', slug:'play-the-game', kind:'read',
  title:'Play the Game',
  blurb:'Play a few rounds before writing any code, and notice the details you will have to rebuild: the title changes every level, the computer\'s colour blinks and plays a note, your clicks glow briefly, a mistake flashes the screen red with a buzzer, and any key starts again. The Explore tab has a playable copy; the original is linked below.',
  openTab:'explore',
  links:[
    { title:'The finished Simon game', url:'https://londonappbrewery.github.io/Simon-Game/', note:'the course\'s hosted version' },
  ],
  explore:[{
    title:'Play Simon', height:470,
    note:'Click the board so it can hear your keyboard, then press any key. Watch which button blinks, click it, and keep repeating the growing sequence. Things to notice: the title text per level, the one-second pause before each new colour, the glow on your clicks, and what a mistake does.',
    html:`
<link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
<style>
  #sg{background:#011f3f;border-radius:12px;padding:16px 10px;text-align:center;user-select:none;outline:none}
  #sg h2{font-family:"Press Start 2P",monospace;color:#fef2bf;font-size:15px;line-height:1.7;margin:4px 0 14px;min-height:26px}
  #sg .row{display:flex;justify-content:center;gap:16px;margin-bottom:16px}
  #sg .b{width:110px;height:110px;border:7px solid #000;border-radius:20%;cursor:pointer}
  #sg .green{background:green} #sg .red{background:red} #sg .yellow{background:yellow} #sg .blue{background:blue}
  #sg .b.pressed{box-shadow:0 0 20px #fff;background:grey}
  #sg .b.blink{visibility:hidden}
  #sg.game-over{background:red;opacity:.8}
</style>
<div id="sg" tabindex="0">
  <h2 id="t">Press A Key to Start</h2>
  <div class="row"><div class="b green" id="green"></div><div class="b red" id="red"></div></div>
  <div class="row"><div class="b yellow" id="yellow"></div><div class="b blue" id="blue"></div></div>
</div>
<script>
(function(){
  var colours = ['red', 'blue', 'green', 'yellow'], pattern = [], clicks = [], level = 0, started = false, ctx = null;
  var NOTE = { red: 329.63, green: 392.0, blue: 440.0, yellow: 523.25 };
  function sound(name){
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime, wrong = name === 'wrong';
      o.type = wrong ? 'sawtooth' : 'sine'; o.frequency.value = wrong ? 90 : NOTE[name];
      g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + (wrong ? 0.45 : 0.3));
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.5);
    } catch (e) {}
  }
  var title = document.getElementById('t'), board = document.getElementById('sg');
  function flash(c){ var el = document.getElementById(c), n = 0; var iv = setInterval(function(){ el.classList.toggle('blink'); if (++n === 2) clearInterval(iv); }, 110); }
  function press(c){ var el = document.getElementById(c); el.classList.add('pressed'); setTimeout(function(){ el.classList.remove('pressed'); }, 100); }
  function next(){ clicks = []; level++; title.textContent = 'Level ' + level; var c = colours[Math.floor(Math.random() * 4)]; pattern.push(c); flash(c); sound(c); }
  document.addEventListener('keydown', function(){ if (!started) { title.textContent = 'Level ' + level; next(); started = true; } });
  Array.prototype.forEach.call(document.querySelectorAll('#sg .b'), function(el){
    el.addEventListener('click', function(){
      var c = el.id; clicks.push(c); sound(c); press(c);
      var i = clicks.length - 1;
      if (pattern[i] === clicks[i]) { if (clicks.length === pattern.length) setTimeout(next, 1000); }
      else {
        sound('wrong'); board.classList.add('game-over'); setTimeout(function(){ board.classList.remove('game-over'); }, 200);
        title.textContent = 'Game Over, Press Any Key to Restart'; level = 0; pattern = []; started = false;
      }
    });
  });
  board.addEventListener('click', function(){ board.focus(); });
})();
<\/script>`
  }],
});


/* ------------------------------------------------------------------ 162 */
PG.add({
  id:'l162', index:162, udemyId:12407762, minutes:1, section:'s20', slug:'step-0-starting-files', kind:'build',
  title:'Step 0 - Download the Starting Files',
  blurb:'The starter project is a page with a title and four coloured squares that do nothing yet. Each square is a <code>div</code> with the classes <code>btn</code> and its colour, plus an <code>id</code> that is also its colour; the JavaScript will use those ids to find buttons and to name sound files. The stylesheet already holds <code>.pressed</code> and <code>.game-over</code>, waiting to be switched on.',
  tasks:[
    'Read <code>index.html</code>: an <code>h1</code> with the id <code>level-title</code>, then four <code>div</code>s with the class <code>btn</code>. Note each one\'s id.',
    'In <code>style.css</code> find <code>.pressed</code> and <code>.game-over</code>. From Step 6 on, JavaScript adds and removes them for a split second.',
    'Preview the pressed look now: add <code>pressed</code> to the green square\'s classes (<code>class="btn green pressed"</code>).',
    'Preview the game-over flash: give the body <code>class="game-over"</code>. Show solution has both changes, if you want to compare.'
  ],
  notes:'<p>The course download contains <code>index.html</code>, <code>styles.css</code> and a <code>sounds</code> folder; Step 1 adds <code>game.js</code>. Here the tabs are <code>index.html</code>, <code>style.css</code> and (from Step 1) <code>script.js</code>. The preview synthesises a note for <code>sounds/red.mp3</code>, <code>green</code>, <code>blue</code>, <code>yellow</code> and <code>wrong</code>, so no audio files are needed. A small media query at the end of the stylesheet shrinks the board to fit the preview pane.</p>',
  files:{ 'index.html': HTML0, 'style.css': CSS },
  solution:{
    'index.html': simonHtml('', BOARD.replace('class="btn green"', 'class="btn green pressed"')).replace('<body>', '<body class="game-over">'),
  },
  quiz:[
    { q:'Which attribute will the JavaScript use to tell the four buttons apart?', options:['class','id (green, red, yellow, blue)','type','style'], answer:1, why:'Each id is unique and equals the colour name, so "#" + colour selects one button and "sounds/" + colour + ".mp3" names its sound.' },
    { q:'What does the <code>.pressed</code> class do?', options:['Plays a sound','Turns the button grey with a white glow','Hides the button','Starts the game'], answer:1, why:'It is pure CSS. Adding it for 100 ms and removing it again makes a click look like a press.' },
  ],
});


/* ------------------------------------------------------------------ 163 */
PG.add({
  id:'l163', index:163, udemyId:12407700, minutes:0, section:'s20', slug:'step-1-javascript-and-jquery', kind:'build',
  title:'Step 1 - Add Javascript and jQuery',
  blurb:'Give the game a JavaScript file and the jQuery library. In the course the file is <code>game.js</code>; in the playground it is the Script tab, linked as <code>script.js</code>. Both script tags go at the very end of the body, with jQuery first so that <code>$</code> exists when the game code runs.',
  tasks:[
    'At the TODO in <code>index.html</code>, add the jQuery tag: <code>&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"&gt;&lt;/script&gt;</code>.',
    'Under it, link the game\'s own script: <code>&lt;script src="script.js"&gt;&lt;/script&gt;</code> (the course writes <code>game.js</code>).',
    'In the Script tab write <code>alert("Hello");</code>. The playground shows alerts in the console panel. Then delete it.',
    'Prove jQuery is working: <code>console.log($("h1").text());</code> should print <i>Press A Key to Start</i>. Remove the jQuery tag for a moment to see the <code>$ is not defined</code> error, then put it back.'
  ],
  files: files(S1_START, HTML1_TODO),
  solution:{ 'index.html': HTML1, 'script.js': S1 },
  quiz:[
    { q:'Why must the jQuery tag come before the game\'s script tag?', options:['Browsers load the last tag first','Scripts run in order, and the game code needs $ to exist already','jQuery has to be in the head','It does not matter'], answer:1, why:'The browser runs script tags top to bottom; the library has to define $ before your code calls it.' },
    { q:'What does <code>$("h1").text()</code> return on this page?', options:['The h1 element','"Press A Key to Start"','"level-title"','undefined'], answer:1, why:'.text() with no argument reads the element\'s text content.' },
  ],
});

answer({
  id:'l164', index:164, udemyId:12639986, minutes:0, slug:'step-1-answer',
  title:'Step 1 - Answer',
  blurb:'Step 1 is done when two script tags sit at the end of the body, jQuery first and the game script second, and the console prints the heading\'s text. This is the finished code for the step.',
  tasks:[
    'Compare the end of <code>index.html</code> with yours: jQuery from the CDN, then the game script, both just before <code>&lt;/body&gt;</code>.',
    'The console shows <i>Press A Key to Start</i>, so jQuery loaded and found the h1. Change the line to log <code>$(".btn").length</code>: you should get 4.',
    'Delete the jQuery tag and read the console (<code>$ is not defined</code>), then restore it.'
  ],
}, S1);


/* ------------------------------------------------------------------ 165 */
PG.add({
  id:'l165', index:165, udemyId:12407832, minutes:1, section:'s20', slug:'step-2-new-pattern', kind:'build',
  title:'Step 2 - Create A New Pattern',
  blurb:'The game needs a memory: <code>gamePattern</code>, an array that grows by one random colour per level. <code>nextSequence()</code> picks a whole number from 0 to 3 with <code>Math.floor(Math.random() * 4)</code>, turns it into a colour through the <code>buttonColours</code> array, and pushes that colour onto the pattern.',
  tasks:[
    'At the top, create <code>buttonColours</code> holding <code>"red", "blue", "green", "yellow"</code>, and an empty <code>gamePattern</code> array.',
    'Write <code>function nextSequence()</code>. Inside, make <code>randomNumber</code> with <code>Math.floor(Math.random() * 4)</code>, which gives 0, 1, 2 or 3.',
    'Look up the colour with <code>var randomChosenColour = buttonColours[randomNumber];</code> and <code>push</code> it onto <code>gamePattern</code>.',
    'Test it: below the function call <code>nextSequence()</code> three times, then <code>console.log(gamePattern)</code>. Each run shows three new random colours.'
  ],
  files: files(S2_START),
  solution:{ 'script.js': S2 },
  quiz:[
    { q:'Which values can <code>Math.floor(Math.random() * 4)</code> produce?', options:['1, 2, 3 or 4','0, 1, 2 or 3','0 to 4 inclusive','Any decimal from 0 to 4'], answer:1, why:'Math.random() is at least 0 and always below 1, so times 4 is below 4, and flooring leaves 0 to 3: exactly the indexes of a four-item array.' },
    { q:'Why is <code>gamePattern</code> declared outside <code>nextSequence()</code>?', options:['Functions cannot create arrays','So it keeps growing between calls instead of starting empty each time','jQuery requires globals','It runs faster'], answer:1, why:'A variable declared inside the function is recreated on every call, which would wipe the sequence each level.' },
  ],
});

answer({
  id:'l166', index:166, udemyId:12640100, minutes:0, slug:'step-2-answer',
  title:'Step 2 - Answer',
  blurb:'The finished code for Step 2: two arrays and a function that appends one random colour to the pattern each time it is called, plus a temporary test at the bottom.',
  tasks:[
    'Run it a few times (press ▶ Run): every run logs a new list of three colours.',
    'Change <code>* 4</code> to <code>* 3</code> and run it many times. "yellow" never appears, because index 3 can no longer come up. Change it back.',
    'Move <code>var gamePattern = [];</code> inside <code>nextSequence()</code> and run: the log fails, because <code>gamePattern</code> now only exists inside the function. Move it back.'
  ],
}, S2);


/* ------------------------------------------------------------------ 167 */
PG.add({
  id:'l167', index:167, udemyId:12643388, minutes:0, section:'s20', slug:'step-3-show-the-sequence', kind:'build',
  title:'Step 3 - Show the Sequence to the User with Animations and Sounds',
  blurb:'The player has to see and hear the new colour. Select the button with an id selector built from the colour name, make it blink by chaining jQuery fades, and play its note with the <code>Audio</code> object. The step asks you to search for both techniques, which is a skill in itself.',
  tasks:[
    'Inside <code>nextSequence()</code>, select the chosen button with <code>$("#" + randomChosenColour)</code>.',
    'Make it blink by chaining fades: <code>.fadeIn(100).fadeOut(100).fadeIn(100)</code>.',
    'Play its note: <code>var audio = new Audio("sounds/" + randomChosenColour + ".mp3");</code> then <code>audio.play();</code>.',
    'Press ▶ Run a few times: a different button blinks with its own note, and the console shows the pattern. ' + FOCUS
  ],
  files: files(S3_START),
  solution:{ 'script.js': S3 },
  quiz:[
    { q:'Why build the selector as <code>"#" + randomChosenColour</code>?', options:['It makes a class selector','It turns a colour name into an id selector such as "#red"','It escapes the string','Every jQuery selector needs #'], answer:1, why:'The buttons\' ids are their colour names, so prefixing # selects exactly one of them.' },
    { q:'What does <code>.fadeIn(100).fadeOut(100).fadeIn(100)</code> do?', options:['Runs all three at once','Plays them one after another on the button, giving a quick blink','Only the last fade runs','Throws, because effects cannot be chained'], answer:1, why:'jQuery queues effects on the same element, so the button fades out and back in over a few hundred milliseconds.' },
  ],
});

answer({
  id:'l168', index:168, udemyId:12664292, minutes:0, slug:'step-3-answer',
  title:'Step 3 - Answer',
  blurb:'The finished code for Step 3: each call of <code>nextSequence()</code> now blinks the chosen button and plays its note.',
  tasks:[
    'Press ▶ Run and watch: one button blinks and you hear its note. ' + FOCUS,
    'Slow the blink down so you can see its three parts: change each <code>100</code> to <code>400</code>.',
    'Try a different flash, such as <code>.fadeOut(100).fadeIn(100)</code>, and keep the one you like.'
  ],
}, S3);


/* ------------------------------------------------------------------ 169 */
PG.add({
  id:'l169', index:169, udemyId:12640242, minutes:1, section:'s20', slug:'step-4-check-button-pressed', kind:'build',
  title:'Step 4 - Check Which Button is Pressed',
  blurb:'Record what the player clicks. One jQuery click handler on the <code>.btn</code> class covers all four buttons. Inside it, <code>this</code> is the button that was clicked, so <code>$(this).attr("id")</code> gives its colour, which is pushed onto <code>userClickedPattern</code>.',
  tasks:[
    'Next to the other arrays, create an empty <code>userClickedPattern</code>.',
    'Add <code>$(".btn").click(function () { ... });</code> to listen to all four buttons at once.',
    'Inside, store the clicked colour: <code>var userChosenColour = $(this).attr("id");</code>.',
    'Push it onto <code>userClickedPattern</code> and <code>console.log</code> the array, then click a few buttons in the preview.',
    'Keep <code>function () { }</code> here rather than an arrow function: an arrow function has no <code>this</code> of its own.'
  ],
  files: files(S4_START),
  solution:{ 'script.js': S4 },
  quiz:[
    { q:'Inside a jQuery click handler written as <code>function () { }</code>, what is <code>this</code>?', options:['The document','The element that was clicked','The jQuery library','The first .btn on the page'], answer:1, why:'jQuery calls the handler with this set to the element that received the event; $(this) wraps it so you can call jQuery methods.' },
    { q:'For the green button, what does <code>$(this).attr("id")</code> return?', options:['"btn"','"green"','"btn green"','undefined'], answer:1, why:'attr("id") reads the id attribute, which is the colour name.' },
  ],
});

answer({
  id:'l170', index:170, udemyId:12664296, minutes:0, slug:'step-4-answer',
  title:'Step 4 - Answer',
  blurb:'The finished code for Step 4: a single click handler records the colour of every button the player clicks.',
  tasks:[
    'Click a few buttons in the preview and watch <code>userClickedPattern</code> grow in the console.',
    'Swap <code>function ()</code> for an arrow function <code>() =&gt;</code> and click again: the array fills with <code>null</code> instead of colours, because an arrow function does not receive the clicked element as <code>this</code>. Swap it back.'
  ],
}, S4);


/* ------------------------------------------------------------------ 171 */
PG.add({
  id:'l171', index:171, udemyId:12652760, minutes:0, section:'s20', slug:'step-5-sounds-on-click', kind:'build',
  title:'Step 5 - Add Sounds to Button Clicks',
  blurb:'Clicks should make a sound too. Rather than copying the two audio lines into the click handler, move them into a <code>playSound(name)</code> function and call it from both places. The same function will play the buzzer later, since that file is <code>sounds/wrong.mp3</code>.',
  tasks:[
    'Write <code>function playSound(name)</code> that creates <code>new Audio("sounds/" + name + ".mp3")</code> and plays it.',
    'Remove the two audio lines from <code>nextSequence()</code> and call <code>playSound(randomChosenColour)</code> in their place.',
    'In the click handler, call <code>playSound(userChosenColour)</code>.',
    'Click each button: four different notes. ' + FOCUS
  ],
  files: files(S5_START),
  solution:{ 'script.js': S5 },
  quiz:[
    { q:'Why move the audio code into <code>playSound(name)</code>?', options:['Functions play louder','The same two lines are needed in two places; one function with a parameter avoids repeating them','Audio only works inside functions','jQuery requires it'], answer:1, why:'A function with a parameter turns duplicated code into one reusable call.' },
    { q:'Which call will Step 9 use to play the buzzer?', options:['playSound(wrong)','playSound("wrong")','playSound("sounds/wrong")','playSound(4)'], answer:1, why:'The parameter is the file\'s base name as a string; the function adds the folder and the .mp3 extension.' },
  ],
});

answer({
  id:'l172', index:172, udemyId:12664298, minutes:0, slug:'step-5-answer',
  title:'Step 5 - Answer',
  blurb:'The finished code for Step 5: <code>playSound(name)</code> serves both the computer\'s turn and the player\'s clicks.',
  tasks:[
    'Click each button: four different notes, synthesised by the playground in place of the course\'s mp3 files. ' + FOCUS,
    'Add a temporary <code>playSound("wrong");</code> at the bottom to hear the buzzer that Step 9 will use, then delete it.'
  ],
}, S5);


/* ------------------------------------------------------------------ 173 */
PG.add({
  id:'l173', index:173, udemyId:12653170, minutes:0, section:'s20', slug:'step-6-click-animations', kind:'build',
  title:'Step 6 - Add Animations to User Clicks',
  blurb:'Give clicks visual feedback: add the <code>pressed</code> class (grey with a white glow) to the clicked button, then take it off again 100 milliseconds later with <code>setTimeout</code>.',
  tasks:[
    'Write <code>function animatePress(currentColour)</code>.',
    'Inside it, add the <code>pressed</code> class to <code>$("#" + currentColour)</code>.',
    'Remove the class 100 ms later: <code>setTimeout(function () { ... }, 100);</code>.',
    'Call <code>animatePress(userChosenColour)</code> from the click handler and click the buttons.'
  ],
  files: files(S6_START),
  solution:{ 'script.js': S6 },
  quiz:[
    { q:'What does <code>setTimeout(fn, 100)</code> do?', options:['Runs fn every 100 ms','Runs fn once, about 100 ms later, while the rest of the code carries on','Freezes the page for 100 ms','Runs fn 100 times'], answer:1, why:'setTimeout schedules a single call and returns straight away; nothing waits for it.' },
    { q:'Where is the pressed look defined?', options:['In game.js','In the stylesheet, as the .pressed class','Inside jQuery','In inline styles in index.html'], answer:1, why:'JavaScript only adds and removes the class; the appearance lives in CSS.' },
  ],
});

answer({
  id:'l174', index:174, udemyId:12664300, minutes:0, slug:'step-6-answer',
  title:'Step 6 - Answer',
  blurb:'The finished code for Step 6: every click now flashes the pressed style for 100 milliseconds.',
  tasks:[
    'Click the buttons: each one turns grey with a white glow for an instant.',
    'Change <code>100</code> to <code>600</code> so the pressed look lingers, then set it back.'
  ],
}, S6);


/* ------------------------------------------------------------------ 175 */
PG.add({
  id:'l175', index:175, udemyId:12653348, minutes:1, section:'s20', slug:'step-7-start-the-game', kind:'build',
  title:'Step 7 - Start the Game',
  blurb:'The game should wait for a key press. A <code>started</code> flag makes sure only the first key starts it, and a <code>level</code> counter, raised inside <code>nextSequence()</code>, drives the title text.',
  tasks:[
    'At the top add <code>var started = false;</code> and <code>var level = 0;</code>.',
    'Listen for keys on the whole page: <code>$(document).keydown(function () { ... })</code> (the article uses <code>keypress</code>, which works too). If <code>!started</code>: set <code>#level-title</code> to <code>"Level " + level</code>, call <code>nextSequence()</code>, then set <code>started = true</code>.',
    'At the start of <code>nextSequence()</code>, add 1 to <code>level</code> and update the title to <code>"Level " + level</code>.',
    'Delete the temporary test call at the bottom of the file.',
    'Click inside the preview and press any key: the title reads <b>Level 1</b> and one button blinks. A second key does nothing.'
  ],
  files: files(S7_START),
  solution:{ 'script.js': S7 },
  quiz:[
    { q:'What would happen without the <code>started</code> check?', options:['Nothing different','Every key press would add another colour and raise the level','The game could never start','The title would not change'], answer:1, why:'The flag turns the key handler into a one-time start button until the game ends.' },
    { q:'Why does the title read <b>Level 1</b> and not Level 0 after the first key?', options:['level starts at 1','nextSequence() adds 1 to level and rewrites the title right after the key handler set "Level 0"','The key event fires twice','.text() adds 1'], answer:1, why:'The handler writes Level 0, then immediately calls nextSequence(), which increments level and overwrites the title.' },
  ],
});

answer({
  id:'l176', index:176, udemyId:12664304, minutes:0, slug:'step-7-answer',
  title:'Step 7 - Answer',
  blurb:'The finished code for Step 7: the first key press starts the game, and the title follows the level.',
  tasks:[
    'Click inside the preview, then press any key: Level 1 and one blinking button.',
    'Press more keys: nothing happens, because <code>started</code> is now true.',
    'Comment out <code>started = true;</code> and press a few keys: every press adds a colour and raises the level. Restore the line.'
  ],
}, S7);


/* ------------------------------------------------------------------ 177 */
PG.add({
  id:'l177', index:177, udemyId:12640450, minutes:1, section:'s20', slug:'step-8-check-the-answer', kind:'build',
  title:'Step 8 - Check the User\'s Answer Against the Game Sequence',
  blurb:'Now judge the player. After every click, <code>checkAnswer()</code> compares that click with the colour at the same position in <code>gamePattern</code>. When the player has repeated the whole sequence correctly, the next level starts a second later, with <code>userClickedPattern</code> emptied first.',
  tasks:[
    'Write <code>function checkAnswer(currentLevel)</code>.',
    'At the end of the click handler, call <code>checkAnswer(userClickedPattern.length - 1)</code>: the index of the click just made.',
    'Inside, compare <code>gamePattern[currentLevel] === userClickedPattern[currentLevel]</code> and log <code>"success"</code> or <code>"wrong"</code>.',
    'On a success, if <code>userClickedPattern.length === gamePattern.length</code>, call <code>nextSequence()</code> inside <code>setTimeout(..., 1000)</code>.',
    'At the top of <code>nextSequence()</code>, reset <code>userClickedPattern = []</code>. Play a few levels and watch the console; the Explore tab steps through the comparison click by click.'
  ],
  files: files(S8_START),
  solution:{ 'script.js': S8 },
  explore:[{
    title:'checkAnswer, one click at a time', height:520,
    note:'The pattern is shown, so this is about the logic, not your memory. Click colours to play the player\'s part and read what checkAnswer() compares on each click. Make a mistake on purpose too.',
    html:`
<style>.cb{font:inherit;font-weight:700;border:0;border-radius:6px;padding:6px 12px;cursor:pointer}</style>
<div class="knobs">
  <button id="np">new round</button>
  <label>starting pattern length <select id="len"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label>
</div>
<div class="knobs">
  <span>player clicks:</span>
  <button class="cb" data-c="red" style="background:#e53935;color:#fff">red</button>
  <button class="cb" data-c="blue" style="background:#1e40ff;color:#fff">blue</button>
  <button class="cb" data-c="green" style="background:#2e7d32;color:#fff">green</button>
  <button class="cb" data-c="yellow" style="background:#ffd600;color:#123">yellow</button>
</div>
<pre class="readout" id="st"></pre>
<pre class="readout" id="tr" style="max-height:250px;overflow:auto"></pre>
<script>
(function(){
  var colours = ['red', 'blue', 'green', 'yellow'], gamePattern = [], userClickedPattern = [], over = false, waiting = false;
  function el(i){ return document.getElementById(i); }
  function pick(){ return colours[Math.floor(Math.random() * 4)]; }
  function paint(){ el('st').textContent = 'gamePattern        = ' + JSON.stringify(gamePattern) + '\\nuserClickedPattern = ' + JSON.stringify(userClickedPattern); }
  function say(lines){ el('tr').textContent = lines.join('\\n') + '\\n\\n' + el('tr').textContent; }
  function newRound(){
    gamePattern = [];
    for (var i = 0; i < +el('len').value; i++) gamePattern.push(pick());
    userClickedPattern = []; over = false; waiting = false;
    el('tr').textContent = 'New round: click the colours of gamePattern in order.';
    paint();
  }
  function nextSequence(){
    userClickedPattern = []; gamePattern.push(pick()); waiting = false; paint();
    say(['nextSequence(): userClickedPattern = [] and gamePattern gains ' + JSON.stringify(gamePattern[gamePattern.length - 1]) + '. Repeat the whole sequence from the start.']);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.cb'), function(b){
    b.addEventListener('click', function(){
      if (over) { say(['Game over. Press "new round" to play again.']); return; }
      if (waiting) { say(['(wait a moment: nextSequence() has not run yet)']); return; }
      userClickedPattern.push(b.getAttribute('data-c'));
      paint();
      var i = userClickedPattern.length - 1, ok = gamePattern[i] === userClickedPattern[i];
      var lines = ['checkAnswer(' + i + ')        // userClickedPattern.length - 1',
                   '  gamePattern[' + i + '] === userClickedPattern[' + i + ']',
                   '  ' + JSON.stringify(gamePattern[i]) + ' === ' + JSON.stringify(userClickedPattern[i]) + '  →  ' + ok];
      if (!ok) { lines.push('  else branch: console.log("wrong"), and the game is over'); over = true; }
      else if (userClickedPattern.length === gamePattern.length) {
        lines.push('  console.log("success")', '  lengths match (' + userClickedPattern.length + ' === ' + gamePattern.length + '): the whole sequence is done', '  setTimeout(nextSequence, 1000)');
        waiting = true; setTimeout(nextSequence, 1000);
      } else lines.push('  console.log("success")', '  lengths differ (' + userClickedPattern.length + ' of ' + gamePattern.length + '): wait for the next click');
      say(lines);
    });
  });
  el('np').addEventListener('click', newRound);
  newRound();
})();
<\/script>`
  }],
  quiz:[
    { q:'Why pass <code>userClickedPattern.length - 1</code> to <code>checkAnswer()</code>?', options:['To skip the first click','It is the index of the most recent click, the only one that still needs checking','Arrays start at 1','To slow the game down'], answer:1, why:'Earlier clicks were checked when they happened; each new click only has to match the colour at its own position.' },
    { q:'Why does <code>nextSequence()</code> reset <code>userClickedPattern</code>?', options:['To free memory','Each level the player repeats the whole sequence from the start, so their clicks must start from empty','jQuery needs it','To change the title'], answer:1, why:'Without the reset, the second round\'s clicks would be compared from index 2 onwards and the indexes would no longer line up.' },
    { q:'Why not compare the arrays directly with <code>gamePattern === userClickedPattern</code>?', options:['=== on two different arrays checks whether they are the same object, not the same contents, so it is always false here','Arrays cannot be compared at all','It is slower','It only compares the lengths'], answer:0, why:'Two separate arrays are two objects, even with identical items. Checking one index per click avoids the problem.' },
  ],
});

answer({
  id:'l178', index:178, udemyId:12664306, minutes:0, slug:'step-8-answer',
  title:'Step 8 - Answer',
  blurb:'The finished code for Step 8: the game checks each click and moves on to the next level once the whole sequence is right. Mistakes are only logged so far.',
  tasks:[
    'Play a few levels: after each complete sequence the next colour appears one second later, and the console logs <code>"success"</code> for every correct click. ' + FOCUS,
    'Make a mistake on purpose: the console logs <code>"wrong"</code> and, for now, nothing else happens.',
    'Change the <code>1000</code> ms delay to <code>0</code> and notice how the new flash collides with your last click. Set it back.'
  ],
}, S8);


/* ------------------------------------------------------------------ 179 */
PG.add({
  id:'l179', index:179, udemyId:12653842, minutes:0, section:'s20', slug:'step-9-game-over', kind:'build',
  title:'Step 9 - Game Over',
  blurb:'Losing should feel like losing. On a wrong click, play the <code>wrong</code> sound, flash the whole page red by adding the <code>game-over</code> class to the body for 200 milliseconds, and change the title to tell the player what to do next.',
  tasks:[
    'In the <code>else</code> branch of <code>checkAnswer()</code>, call <code>playSound("wrong")</code>.',
    'Add the <code>game-over</code> class to the body with <code>$("body").addClass("game-over")</code>, and remove it 200 ms later with <code>setTimeout</code>.',
    'Change the title: <code>$("#level-title").text("Game Over, Press Any Key to Restart");</code>.',
    'Play and make a mistake: buzzer, red flash, new title. Pressing a key does not restart yet; that is Step 10.'
  ],
  files: files(S9_START),
  solution:{ 'script.js': S9 },
  quiz:[
    { q:'What makes the screen flash red?', options:['An animate() call','The game-over class on the body, which the stylesheet colours red, removed 200 ms later','A red image','The wrong.mp3 file'], answer:1, why:'As with .pressed, JavaScript only toggles a class; the CSS supplies the red background.' },
    { q:'After a game over, why does a key press not restart the game yet?', options:['The keydown listener was removed','started is still true, so the key handler ignores every press','The title blocks the keyboard','jQuery has crashed'], answer:1, why:'Nothing has reset the game state. Step 10 sets started back to false.' },
  ],
});

answer({
  id:'l180', index:180, udemyId:12664308, minutes:0, slug:'step-9-answer',
  title:'Step 9 - Answer',
  blurb:'The finished code for Step 9: a wrong click plays the buzzer, flashes the page red and changes the title.',
  tasks:[
    'Start a game and make a mistake: buzzer, red flash and the game-over title. ' + FOCUS,
    'Press a key: nothing restarts yet, because <code>started</code> is still true. Step 10 fixes that.',
    'Make the red flash last longer by changing <code>200</code> to <code>1000</code>.'
  ],
}, S9);


/* ------------------------------------------------------------------ 181 */
PG.add({
  id:'l181', index:181, udemyId:12664182, minutes:0, section:'s20', slug:'step-10-restart', kind:'build',
  title:'Step 10 - Restart the Game',
  blurb:'Finally, let the player go again. <code>startOver()</code> puts <code>level</code>, <code>gamePattern</code> and <code>started</code> back to the values they had when the page loaded, so the next key press starts a fresh game at Level 1. <code>userClickedPattern</code> needs no reset here, because <code>nextSequence()</code> already empties it.',
  tasks:[
    'Write <code>function startOver()</code> that sets <code>level = 0</code>, <code>gamePattern = []</code> and <code>started = false</code>.',
    'Call <code>startOver()</code> at the end of the <code>else</code> branch in <code>checkAnswer()</code>.',
    'Play, lose, and press a key: you are back at Level 1 with a single blink.',
    'Break it on purpose: leave out <code>started = false</code> and see that keys no longer restart the game. Put it back.'
  ],
  files: files(S10_START),
  solution:{ 'script.js': S10 },
  quiz:[
    { q:'Why reset <code>level</code> to 0 rather than 1?', options:['jQuery requires 0','nextSequence() adds 1 before showing it, so 0 makes the new game open at Level 1','To clear the title','It makes no difference'], answer:1, why:'Resetting to 1 would make the restarted game start at Level 2.' },
    { q:'What goes wrong if <code>startOver()</code> says <code>var level = 0;</code>?', options:['Nothing','It creates a new local variable inside the function, and the global level keeps its old value','It throws an error','level becomes a string'], answer:1, why:'var inside a function declares a local variable that shadows the global one; plain assignment updates the global.' },
  ],
});

answer({
  id:'l182', index:182, udemyId:12664312, minutes:0, slug:'step-10-answer',
  title:'Step 10 - Answer',
  blurb:'The complete game. State lives in five variables; a key press starts a game; <code>nextSequence()</code> adds and shows a colour; clicks are recorded, sounded, animated and checked one at a time; a mistake ends the game and <code>startOver()</code> resets the state. It also fixes a slip in some copies of this code: the computer\'s turn must call <code>playSound(randomChosenColour)</code>, not <code>playSound(randomNumber)</code>, because the sound files are named after colours.',
  tasks:[
    'Play several games in a row: every restart begins at Level 1 with a single blink. ' + FOCUS,
    'Read the file from top to bottom and name the step each block came from.',
    'Stretch: keep a high score in a variable and show it in the title after a game over.',
    'Stretch: make the game harder as it goes, for example by shortening the blink at higher levels.'
  ],
}, S10);


/* ------------------------------------------------------------------ 183 */
PG.add({
  id:'l183', index:183, udemyId:12664354, minutes:0, section:'s20', slug:'completed-project', kind:'read',
  title:'Download the Completed Project Code',
  blurb:'The finished project is the Step 10 answer: <code>index.html</code>, the stylesheet, <code>game.js</code> and a <code>sounds</code> folder. Compare its behaviour with the hosted version below, and with your own build, looking at timing, sounds and what happens on a mistake.',
  links:[
    { title:'The finished Simon game', url:'https://londonappbrewery.github.io/Simon-Game/', note:'the course\'s hosted version, on GitHub Pages' },
  ],
  quiz:[
    { q:'Which line starts each new level once the player has repeated the whole sequence?', options:['startOver()','setTimeout(function () { nextSequence(); }, 1000)','$(document).keydown(...)','animatePress(userChosenColour)'], answer:1, why:'checkAnswer() schedules nextSequence() one second after the last correct click.' },
    { q:'Which three variables does <code>startOver()</code> reset?', options:['level, gamePattern and started','buttonColours, level and started','userClickedPattern, gamePattern and level','level only'], answer:0, why:'buttonColours never changes, and userClickedPattern is emptied by nextSequence() at the start of every level.' },
  ],
});


/* ------------------------------------------------------------------ 184 */
PG.add({
  id:'l184', index:184, udemyId:17967152, minutes:3, section:'s20', slug:'tip-dealing-with-frustration', kind:'read',
  title:'Tip from Angela - Dealing with Frustration',
  blurb:'When a bug has you stuck and annoyed, staring harder rarely helps. Step away: go for a walk or a swim, or sleep on it and look again in the morning, when the fix is often obvious. Every developer gets stuck; the bug will still be there when you come back with a fresh head.',
});

})();
