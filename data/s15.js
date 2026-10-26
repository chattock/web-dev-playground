/* ===== Section 15 — Intermediate Javascript (lectures 99–113) ===== */
/* kind:'js' lessons: prompt() reads the "Prompt answers" box (comma-separated).
   This console prints arrays one item per line, so long arrays are logged with
   .join(", ") to keep each result on one line. Loops: the editor re-runs code as
   you type, so every loop in a starter already contains the line that ends it. */

PG.add({
  id:'s15-random', index:99, udemyId:12373892, minutes:11, section:'s15', slug:'random-numbers', kind:'js',
  title:'Random Number Generation in Javascript: Building a Love Calculator',
  blurb:'<code>Math.random()</code> returns a decimal from 0 up to, but never including, 1. To get a whole number in a range, scale it, round it down and shift it: <code>Math.floor(Math.random() * 6) + 1</code> rolls a die. The numbers are <i>pseudo</i>-random — an algorithm makes them — which is fine for games. The exercise is a love calculator that ignores the names completely.',
  tasks:[
    'Log a few raw <code>Math.random()</code> values and press Run several times: always 0 or more, always below 1.',
    'Build a dice roll one step per line: multiply by 6, then <code>Math.floor</code>, then add 1. Log the value after each step.',
    'Love calculator: alert a welcome, prompt for two names (Romeo and Juliet are queued; there is no need to store them), then alert <i>Your love score is N%</i> with N a whole number from 1 to 100.',
    'Run it several times. Could the score ever be 0? Could it be 100? The Explore tab rolls thousands of times to find out.'
  ],
  answers:'Romeo, Juliet',
  files:{ 'script.js':`// TODO 1: what does a raw random number look like? Run this a few times.
console.log(Math.random());


// TODO 2: a dice roll, one step per line — log n after each step
let n = Math.random();
// n = n * 6;
// n = Math.floor(n);
// n = n + 1;


// TODO 3: the love calculator
alert("Welcome to the love calculator");
// prompt for both names, then alert a score from 1 to 100

` },
  solution:{ 'script.js':`// a raw random: 0 up to (but never including) 1
console.log(Math.random());

// a dice roll, one step at a time
let n = Math.random();     // 0 <= n < 1
n = n * 6;                 // 0 <= n < 6
console.log(n);
n = Math.floor(n);         // 0, 1, 2, 3, 4 or 5
console.log(n);
n = n + 1;                 // 1 to 6
console.log("You rolled a " + n);

// the love calculator
alert("Welcome to the love calculator");
prompt("What is your name?");
prompt("What is their name?");

let loveScore = Math.random() * 100;     // 0 to 99.999...
loveScore = Math.floor(loveScore) + 1;   // 1 to 100
alert("Your love score is " + loveScore + "%");

// the recipe for any range:  Math.floor(Math.random() * howMany) + lowest
const names = ["Angela", "Ben", "Jenny", "Paul"];
console.log("Random name: " + names[Math.floor(Math.random() * names.length)]);
` },
  explore:[{
    title:'Roll it thousands of times', height:420,
    note:'Pick a formula and roll. With the right one, 1 to 6 each turn up about a sixth of the time and nothing else ever appears. The other two show the classic mistakes.',
    html:`
<div class="knobs">
  <label>formula
    <select id="f">
      <option value="ok">Math.floor(Math.random() * 6) + 1</option>
      <option value="zero">Math.floor(Math.random() * 6)</option>
      <option value="round">Math.round(Math.random() * 6)</option>
    </select>
  </label>
  <label>rolls
    <select id="n"><option>60</option><option selected>600</option><option>6000</option><option>60000</option></select>
  </label>
  <button id="go">Roll again</button>
</div>
<div class="stage" id="bars" style="display:flex;align-items:flex-end;gap:12px;height:190px;justify-content:center"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var F = {
    ok: function(){ return Math.floor(Math.random() * 6) + 1; },
    zero: function(){ return Math.floor(Math.random() * 6); },
    round: function(){ return Math.round(Math.random() * 6); }
  };
  var why = {
    ok: 'Six possible results, 1 to 6, each with an equal share of the range. This is the recipe to remember.',
    zero: 'Without the + 1 you get 0 to 5: still six faces, but a die has no 0 and no 6.',
    round: 'Rounding instead of flooring gives SEVEN results, 0 to 6, and 0 and 6 come up only half as often: each gets only half a step of the range.'
  };
  var sel = document.getElementById('f'), nSel = document.getElementById('n'), bars = document.getElementById('bars'), ro = document.getElementById('ro');
  function roll(){
    var f = F[sel.value], n = +nSel.value, counts = [0, 0, 0, 0, 0, 0, 0, 0], lo = 99, hi = -1;
    for (var i = 0; i < n; i++) { var v = f(); counts[v]++; if (v < lo) lo = v; if (v > hi) hi = v; }
    var max = Math.max.apply(null, counts) || 1, html = '';
    counts.forEach(function(c, v){
      var h = Math.round(c / max * 150);
      html += '<div style="text-align:center;width:42px"><div style="font:11px ui-monospace,Menlo,monospace;color:#5b6382">' + c + '</div>' +
        '<div style="height:' + h + 'px;background:' + (v >= 1 && v <= 6 ? '#5b9cff' : '#ff9aa2') + ';border-radius:4px 4px 0 0"></div>' +
        '<div style="font:700 13px ui-monospace,Menlo,monospace;margin-top:4px">' + v + '</div></div>';
    });
    bars.innerHTML = html;
    ro.textContent = n + ' rolls · smallest result ' + lo + ' · largest result ' + hi + ' · a fair die gives each face about ' + Math.round(n / 6) + '\\n\\n' + why[sel.value];
  }
  document.getElementById('go').addEventListener('click', roll);
  sel.addEventListener('change', roll); nSel.addEventListener('change', roll);
  roll();
<\/script>`
  }],
  quiz:[
    { q:'Which values can <code>Math.random()</code> return?', options:['0 to 1, including 1','0 up to, but never including, 1','1 to 100','−1 to 1'], answer:1, why:'The range includes 0 and stops just short of 1. That is why multiplying by 6 and flooring can never give 6.' },
    { q:'Which expression gives a whole number from 1 to 6?', options:['Math.random() * 6','Math.floor(Math.random() * 6)','Math.floor(Math.random() * 6) + 1','Math.round(Math.random() * 6)'], answer:2, why:'Scale to 0–5.999, floor to 0–5, then shift up by 1.' },
    { q:'Why are these numbers called <i>pseudo</i>-random?', options:['They repeat every 100 calls','An algorithm produces them, so they only look random','They are always even','They come from the internet'], answer:1, why:'Computers follow instructions exactly, so they generate numbers that merely behave randomly. Fine for games; security code uses crypto.getRandomValues instead.' },
  ],
  notes:`
    <h3>The recipe</h3>
    <pre>Math.floor(Math.random() * howMany) + lowest</pre>
    <ul>
      <li><code>Math.random()</code> → 0 to 0.9999…</li>
      <li><code>× 6</code> → 0 to 5.9999…</li>
      <li><code>Math.floor()</code> → 0, 1, 2, 3, 4 or 5</li>
      <li><code>+ 1</code> → 1 to 6</li>
    </ul>
    <p>Forget the brackets on <code>Math.random()</code> and you get the function itself rather than a number. Use <code>Math.round</code> instead of <code>Math.floor</code> and the two end values come up half as often as the others.</p>`
});


PG.add({
  id:'s15-if-else', index:100, udemyId:12373964, minutes:5, section:'s15', slug:'if-else', kind:'js',
  title:'Control Statements: Using If-Else Conditionals & Logic',
  blurb:'Control flow lets a program take different paths. <code>if (condition) { ... } else { ... }</code> runs the first block when the condition is true and the second when it is false — never both. The love calculator gets a special message for high scores.',
  tasks:[
    'First attempt: show a special message only when <code>loveScore === 100</code>. Run it a dozen times — why is that branch almost impossible to see?',
    'Switch to a range: <code>if (loveScore &gt; 70)</code> gives the special message, and <code>else</code> gives the plain score.',
    'Run until you have seen both branches. To test a branch on demand, add <code>loveScore = 85;</code> for a moment, then remove it.',
    'Extra: add an <code>else if</code> for a middle band (the next lectures do this properly) and notice that a chain stops at the first true condition.'
  ],
  answers:'Romeo, Juliet',
  files:{ 'script.js':`prompt("What is your name?");
prompt("What is their name?");

let loveScore = Math.floor(Math.random() * 100) + 1;
console.log("Score: " + loveScore);

// TODO 1: a special message only when loveScore is exactly 100
// TODO 2: then switch to: over 70 → a special message, otherwise → the plain score
alert("Your love score is " + loveScore + "%");
` },
  solution:{ 'script.js':`prompt("What is your name?");
prompt("What is their name?");

let loveScore = Math.floor(Math.random() * 100) + 1;
console.log("Score: " + loveScore);

// === 100 would only fire about once in a hundred runs, so test a range instead
if (loveScore > 70) {
  alert("Your love score is " + loveScore + "%. You love each other like Kanye loves Kanye.");
} else {
  alert("Your love score is " + loveScore + "%.");
}

// a chain stops at the FIRST true condition, so the order matters
function describe(age) {
  if (age < 13) {
    return "child";
  } else if (age < 20) {
    return "teenager";
  } else if (age < 65) {
    return "adult";
  } else {
    return "senior";
  }
}
console.log(describe(8), describe(15), describe(30), describe(80));
` },
  quiz:[
    { q:'Why is <code>if (loveScore === 100)</code> a poor first test?', options:['=== cannot compare numbers','It only matches one score in a hundred, so the branch almost never runs','It is always true','100 is outside the range'], answer:1, why:'Testing a range (> 70) gives the branch a fair chance of running and is much easier to check.' },
    { q:'Which of these is the correct shape?', options:['if (loveScore > 70) { ... } else { ... }','if loveScore > 70 { ... }','if (loveScore > 70) then { ... }','if [loveScore > 70] { ... }'], answer:0, why:'The condition goes in round brackets and each branch in curly braces. There is no then keyword.' },
    { q:'What is wrong with <code>if (score = 100)</code>?', options:['Nothing','A single = assigns 100 instead of comparing, so the condition is always true','It needs quotes round 100','It should be =&gt;'], answer:1, why:'= stores a value; === compares. Mixing them up is one of the most common bugs there is.' },
  ],
  notes:`
    <h3>The shape</h3>
    <pre>if (condition) {
  // runs when the condition is true
} else if (otherCondition) {
  // runs when the first was false and this one is true
} else {
  // runs when nothing above matched
}</pre>
    <p>The opening brace sits on the same line as <code>if</code> and <code>else</code>, which keeps long blocks readable.</p>
    <h3>Truthy and falsy</h3>
    <p>Any value can be a condition. These count as <b>false</b>: <code>false</code>, <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else counts as true — including <code>"0"</code> and <code>[]</code>, which surprises everyone once.</p>`
});


PG.add({
  id:'s15-comparators', index:101, udemyId:12373978, minutes:3, section:'s15', slug:'comparators', kind:'js',
  title:'Comparators and Equality',
  blurb:'Conditions are built from comparisons: <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, and two kinds of equality. <code>===</code> checks the value <b>and</b> the type; <code>==</code> converts types first, so <code>1 == "1"</code> is true. Use <code>===</code> and <code>!==</code>.',
  tasks:[
    'With <code>a = 1</code> and <code>b = "1"</code>, log <code>typeof a</code> and <code>typeof b</code>.',
    'Write an <code>if / else</code> that logs <i>yes</i> or <i>no</i> for <code>a === b</code>, then a second one for <code>a == b</code>. Explain the difference.',
    'Predict, then log <code>5 !== "5"</code>, <code>10 &gt; 5</code>, <code>10 &lt; 5</code>, <code>10 &gt;= 10</code> and <code>10 &lt;= 5</code>.',
    'Try the notorious loose comparisons in the solution, then promise yourself to stick to <code>===</code>.'
  ],
  files:{ 'script.js':`const a = 1;
const b = "1";

// TODO 1: log typeof a and typeof b


// TODO 2: if (a === b) log "yes", else log "no" — then the same with ==


// TODO 3: predict, then log these
console.log(5 !== "5");
// 10 > 5,  10 < 5,  10 >= 10,  10 <= 5
` },
  solution:{ 'script.js':`const a = 1;
const b = "1";

console.log(typeof a, typeof b);   // number string

if (a === b) {
  console.log("yes");
} else {
  console.log("no");               // === compares the type too: no
}

if (a == b) {
  console.log("yes");              // == converts the string first: yes
} else {
  console.log("no");
}

console.log(5 !== "5");   // true   (strict: the types differ)
console.log(5 != "5");    // false  (loose: converted, so "equal")
console.log(10 > 5, 10 < 5, 10 >= 10, 10 <= 5);   // true false true false

// the notorious loose results: all true with ==, all false with ===
console.log(0 == "", 0 == false, null == undefined, "" == false);
console.log(0 === "", 0 === false, null === undefined, "" === false);
` },
  explore:[{
    title:'Compare anything', height:490,
    note:'Type two values as you would in code: <code>1</code> is a number, <code>"1"</code> (with quotes) is a string. Every comparison operator is evaluated at once.',
    html:`
<div class="knobs">
  <label>left <input type="text" id="l" value="1" style="width:100px"></label>
  <label>right <input type="text" id="r" value='"1"' style="width:100px"></label>
  <span class="note" style="margin:0">try: 0 and "" · null and undefined · 10 and "9" · true and 1</span>
</div>
<div class="stage"><table class="grid" id="t" style="width:100%"></table></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var L = document.getElementById('l'), R = document.getElementById('r'), t = document.getElementById('t'), ro = document.getElementById('ro');
  var ops = [
    ['===', function(a, b){ return a === b; }], ['!==', function(a, b){ return a !== b; }],
    ['==', function(a, b){ return a == b; }], ['!=', function(a, b){ return a != b; }],
    ['>', function(a, b){ return a > b; }], ['<', function(a, b){ return a < b; }],
    ['>=', function(a, b){ return a >= b; }], ['<=', function(a, b){ return a <= b; }]
  ];
  function read(src){ return Function('return (' + src + ');')(); }
  function show(v){ return typeof v === 'string' ? JSON.stringify(v) : String(v); }
  function esc(s){ return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function upd(){
    var a, b;
    try { a = read(L.value.trim() || 'undefined'); b = read(R.value.trim() || 'undefined'); }
    catch (e) { t.innerHTML = ''; ro.textContent = 'One side is not a value JavaScript can read: ' + e.message + '\\nText needs quotes.'; return; }
    t.innerHTML = '<tr><th>expression</th><th>result</th></tr>' + ops.map(function(o){
      var res = o[1](a, b);
      return '<tr' + (o[0] === '===' || o[0] === '==' ? ' style="background:#f3f6ff"' : '') + '><td><code>' + esc(show(a) + ' ' + o[0] + ' ' + show(b)) + '</code></td><td><b style="color:' + (res ? '#1f8a4c' : '#c0392b') + '">' + res + '</b></td></tr>';
    }).join('');
    var note = 'typeof left: ' + typeof a + '   typeof right: ' + typeof b;
    if ((a == b) !== (a === b)) note += '\\n\\n== and === disagree here: == converted the values before comparing, === refused because the types differ.';
    ro.textContent = note;
  }
  L.addEventListener('input', upd); R.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'With <code>a = 1</code> and <code>b = "1"</code>, what is <code>a === b</code>?', options:['true','false','"1"','an error'], answer:1, why:'=== compares types as well as values, and a number is not a string.' },
    { q:'Why is <code>a == b</code> true for the same two values?', options:['== converts the types before comparing','== compares the lengths','== only checks the type','== is a typo for ='], answer:0, why:'Loose equality turns "1" into the number 1 first. That conversion is what makes == unpredictable.' },
    { q:'Which operator means <i>not equal</i>, checking type as well?', options:['!=','=!','!==','&lt;&gt;'], answer:2, why:'!== is the strict partner of ===. != is the loose one.' },
  ],
  notes:`
    <h3>== vs ===</h3>
    <table>
      <tr><th>Values</th><th><code>==</code></th><th><code>===</code></th></tr>
      <tr><td><code>1</code> and <code>"1"</code></td><td>true</td><td>false</td></tr>
      <tr><td><code>0</code> and <code>false</code></td><td>true</td><td>false</td></tr>
      <tr><td><code>""</code> and <code>0</code></td><td>true</td><td>false</td></tr>
      <tr><td><code>null</code> and <code>undefined</code></td><td>true</td><td>false</td></tr>
    </table>
    <p><code>==</code> converts types before comparing, and the conversion rules are odd enough to fill blog posts. <code>===</code> has no surprises.</p>
    <h3>= vs == vs ===</h3>
    <ul>
      <li><code>=</code> assigns a value</li>
      <li><code>==</code> compares loosely</li>
      <li><code>===</code> compares strictly</li>
    </ul>`
});


PG.add({
  id:'s15-combining', index:102, udemyId:12373992, minutes:3, section:'s15', slug:'combining-comparators', kind:'js',
  title:'Combining Comparators',
  blurb:'Three logical operators join conditions: <code>&amp;&amp;</code> (AND) is true only when both sides are, <code>||</code> (OR) when at least one is, and <code>!</code> (NOT) flips true and false. With <code>&amp;&amp;</code> the love calculator gets three bands — low, middle and high — that must not overlap or leave gaps.',
  tasks:[
    'Give the love calculator three messages: above 70; above 30 <b>and</b> at most 70 (use <code>&amp;&amp;</code>); 30 or below.',
    'Boundary test: set <code>loveScore</code> to 30, 31, 70 and 71 in turn and check that each one gets exactly one message.',
    'Explain why <code>30 &lt; loveScore &lt; 70</code> is not a range check in JavaScript. Try it with a score of 100.',
    'Use <code>||</code> for a discount (under 12 <b>or</b> over 65) and <code>!</code> to flip a boolean.'
  ],
  answers:'Romeo, Juliet',
  files:{ 'script.js':`prompt("What is your name?");
prompt("What is their name?");

let loveScore = Math.floor(Math.random() * 100) + 1;
console.log("Score: " + loveScore);

// TODO 1: three messages
//   over 70                  → "Your love score is 85%, you love each other like Kanye loves Kanye."
//   over 30 AND at most 70   → "Your love score is 50%."            (use &&)
//   30 or below              → "Your love score is 20%, you go together like oil and water."


// TODO 2: boundary test — set loveScore to 30, 31, 70 and 71 in turn


// TODO 3: || and !
const age = 70;
const hasTicket = false;
// log whether this person gets a discount (under 12 or over 65), and log !hasTicket
` },
  solution:{ 'script.js':`prompt("What is your name?");
prompt("What is their name?");

let loveScore = Math.floor(Math.random() * 100) + 1;
console.log("Score: " + loveScore);

if (loveScore > 70) {
  alert("Your love score is " + loveScore + "%, you love each other like Kanye loves Kanye.");
}
if (loveScore > 30 && loveScore <= 70) {
  alert("Your love score is " + loveScore + "%.");
}
if (loveScore <= 30) {
  alert("Your love score is " + loveScore + "%, you go together like oil and water.");
}
// (an else if chain works too, and stops checking once one band matches)

// why 30 < loveScore < 70 is not a range check: it runs left to right
console.log(30 < 100 < 70);   // true!  (30 < 100) is true, and true < 70 counts true as 1

// OR: at least one side is true
const age = 70;
const hasTicket = false;
console.log("Discount: " + (age < 12 || age > 65));   // Discount: true
// NOT: flips a boolean
console.log("Needs a ticket: " + !hasTicket);          // Needs a ticket: true

// all three together — brackets make the grouping obvious
function canEnter(age, hasTicket, isVip) {
  if ((age >= 18 && hasTicket) || isVip) {
    return "Welcome in";
  }
  return "Sorry, not tonight";
}
console.log(canEnter(25, true, false));   // Welcome in
console.log(canEnter(16, true, false));   // Sorry, not tonight
console.log(canEnter(16, false, true));   // Welcome in (VIP)
` },
  explore:[{
    title:'Test the bands', height:380,
    note:'Slide the score through the boundaries (30, 31, 70, 71) and watch which condition is true. Tick the buggy version to see a score fall through the gap.',
    html:`
<div class="knobs">
  <label>loveScore <input type="range" id="s" min="1" max="100" value="70"><span class="val" id="sv"></span></label>
  <label><input type="checkbox" id="bug"> buggy middle test (<code>&lt; 70</code> instead of <code>&lt;= 70</code>)</label>
  <button id="roll">Try 1000 random scores</button>
</div>
<pre class="readout" id="ro"></pre>
<pre class="readout" id="tally" style="white-space:pre-wrap"></pre>
<script>
  var s = document.getElementById('s'), sv = document.getElementById('sv'), bug = document.getElementById('bug');
  var ro = document.getElementById('ro'), tally = document.getElementById('tally');
  function bands(x){
    var middle = bug.checked ? (x > 30 && x < 70) : (x > 30 && x <= 70);
    return [x > 70, middle, x <= 30];
  }
  function pad(text, width){ while (text.length < width) text += ' '; return text; }
  function upd(){
    var x = +s.value, r = bands(x), hits = r.filter(Boolean).length;
    sv.textContent = x;
    var conds = ['if (loveScore > 70)', bug.checked ? 'if (loveScore > 30 && loveScore < 70)' : 'if (loveScore > 30 && loveScore <= 70)', 'if (loveScore <= 30)'];
    var says = ['"…like Kanye loves Kanye."', '"Your love score is ' + x + '%."', '"…like oil and water."'];
    ro.textContent = conds.map(function(c, i){
      return (r[i] ? '✓ ' : '  ') + pad(c, 40) + '→ ' + pad(String(r[i]), 6) + (r[i] ? 'alert ' + says[i] : '');
    }).join('\\n') + '\\n\\n' + (hits === 1 ? 'Exactly one alert shows.' : hits === 0 ? 'No alert at all: ' + x + ' falls through the gap between the bands.' : hits + ' alerts show: the bands overlap.');
  }
  document.getElementById('roll').addEventListener('click', function(){
    var counts = [0, 0, 0], none = 0;
    for (var i = 0; i < 1000; i++) {
      var r = bands(Math.floor(Math.random() * 100) + 1);
      r.forEach(function(v, k){ if (v) counts[k]++; });
      if (!r[0] && !r[1] && !r[2]) none++;
    }
    tally.textContent = '1000 random scores →  over 70: ' + counts[0] + '   middle: ' + counts[1] + '   30 or below: ' + counts[2] + '   no alert: ' + none +
      (none ? '\\nWith the buggy test every score of exactly 70 slips through without a message.' : '');
  });
  s.addEventListener('input', upd); bug.addEventListener('change', upd);
  upd();
  tally.textContent = 'Press the button to try 1000 random scores at once.';
<\/script>`
  }],
  quiz:[
    { q:'<code>true &amp;&amp; false</code> is…', options:['true','false','undefined','an error'], answer:1, why:'&& needs both sides to be true.' },
    { q:'Which condition catches every score from 31 to 70, both included?', options:['loveScore > 30 || loveScore <= 70','30 < loveScore < 70','loveScore >= 30 && loveScore < 70','loveScore > 30 && loveScore <= 70'], answer:3, why:'> 30 starts at 31 and <= 70 includes 70. The || version is true for every score, and the chained version is not a range check at all.' },
    { q:'What does <code>!true</code> give?', options:['false','true','null','1'], answer:0, why:'! flips a boolean: true becomes false and false becomes true.' },
  ],
  notes:`
    <h3>Truth table</h3>
    <table>
      <tr><th>A</th><th>B</th><th>A &amp;&amp; B</th><th>A || B</th></tr>
      <tr><td>true</td><td>true</td><td>true</td><td>true</td></tr>
      <tr><td>true</td><td>false</td><td>false</td><td>true</td></tr>
      <tr><td>false</td><td>true</td><td>false</td><td>true</td></tr>
      <tr><td>false</td><td>false</td><td>false</td><td>false</td></tr>
    </table>
    <h3>Brackets and short-circuits</h3>
    <p><code>&amp;&amp;</code> binds tighter than <code>||</code>, so <code>a || b &amp;&amp; c</code> means <code>a || (b &amp;&amp; c)</code>. When in doubt, add brackets. JavaScript also stops as soon as it knows the answer: in <code>false &amp;&amp; anything</code> the right-hand side never runs.</p>
    <p>Type two pipes for OR (<code>||</code>) and two ampersands for AND. A single <code>|</code> or <code>&amp;</code> is a different, bitwise operator.</p>`
});


PG.add({
  id:'s15-bmi-advanced', index:102, sub:'b', udemyId:12373992, minutes:0, section:'s15', slug:'bmi-advanced', kind:'js',
  title:'Coding Exercise: BMI Calculator Advanced (IF/ELSE)',
  blurb:'The coding exercise after lecture 102: take the BMI function from section 14 and make it explain the number. Under 18.5 is underweight, 18.5 up to 24.9 is a normal weight, and anything higher is overweight. The function returns the whole sentence.',
  tasks:[
    'Keep the BMI calculation and add an <code>if / else if / else</code> chain for the three ranges.',
    'Return exactly <i>Your BMI is 20, so you have a normal weight.</i> — or <i>…so you are underweight.</i> / <i>…so you are overweight.</i> The wording and the full stop matter to Udemy\'s checker.',
    'Check the three test lines: 50, 65 and 95 kg at 1.8 m should land in three different ranges.',
    'Read the weight and height with <code>prompt()</code> (65 and 1.8 are queued), convert them with <code>Number()</code> and alert the sentence.'
  ],
  answers:'65, 1.8',
  files:{ 'script.js':`function bmiCalculator(weight, height) {
  const bmi = Math.round(weight / (height * height));

  // TODO: return "Your BMI is " + bmi + ", so you are underweight."        when bmi is under 18.5
  //              "Your BMI is " + bmi + ", so you have a normal weight."   from 18.5 up to 24.9
  //              "Your BMI is " + bmi + ", so you are overweight."         above that
}

console.log("50 kg: " + bmiCalculator(50, 1.8));   // underweight
console.log("65 kg: " + bmiCalculator(65, 1.8));   // normal weight
console.log("95 kg: " + bmiCalculator(95, 1.8));   // overweight

// TODO: read weight and height with prompt(), convert with Number(), alert the sentence
` },
  solution:{ 'script.js':`function bmiCalculator(weight, height) {
  const bmi = Math.round(weight / (height * height));

  if (bmi < 18.5) {
    return "Your BMI is " + bmi + ", so you are underweight.";
  } else if (bmi < 25) {
    return "Your BMI is " + bmi + ", so you have a normal weight.";
  } else {
    return "Your BMI is " + bmi + ", so you are overweight.";
  }
}

console.log("50 kg: " + bmiCalculator(50, 1.8));   // 15, underweight
console.log("65 kg: " + bmiCalculator(65, 1.8));   // 20, normal weight
console.log("95 kg: " + bmiCalculator(95, 1.8));   // 29, overweight

// the chain lets the second test skip "bmi >= 18.5": reaching it already proves that

const weight = Number(prompt("How much do you weigh in kg?"));
const height = Number(prompt("How tall are you in metres?"));
alert(bmiCalculator(weight, height));
` },
  quiz:[
    { q:'In an <code>if / else if</code> chain, why can the second test be just <code>bmi &lt; 25</code>?', options:['Reaching it already means bmi is not under 18.5','JavaScript fills in the missing part','25 includes 18.5','It cannot — it needs both checks'], answer:0, why:'An else if only runs when every test above it was false.' },
    { q:'Why return the sentence instead of logging it inside the function?', options:['Logging is slower','The caller can then alert it, put it on a page or test it','return prints it twice','Functions cannot log'], answer:1, why:'A returned value can be used anywhere; a log inside the function can only ever be read in the console.' },
  ],
  notes:`
    <h3>Chains save conditions</h3>
    <p>The second branch does not need <code>bmi &gt;= 18.5 &amp;&amp; bmi &lt; 25</code>. Reaching it already proves the first condition was false, so <code>bmi &lt; 25</code> is enough. That is a real readability win once chains get long.</p>
    <h3>Return, don't log</h3>
    <p>A function that returns a sentence can be alerted, shown on a page or tested. A function that logs one can only ever be watched in a console.</p>`
});


PG.add({
  id:'s15-leap-year', index:103, udemyId:18143246, minutes:4, section:'s15', slug:'leap-year', kind:'js',
  title:'Introducing the Leap Year Code Challenge',
  blurb:'A year is a leap year if it divides by 4 — unless it also divides by 100, in which case it is not — unless it also divides by 400, in which case it is after all. Three questions in a fixed order, which the lecture draws as a flowchart before writing any code.',
  tasks:[
    'Sketch the flowchart first (paper is fine): divisible by 4? then by 100? then by 400? Each yes/no arrow leads either to the next question or to an answer.',
    'Turn each question into an <code>if</code> with <code>%</code>: <code>year % 4 === 0</code> means "divides by 4 with nothing left over".',
    'Return exactly <code>"Leap year."</code> or <code>"Not leap year."</code> — the capital, the space and the full stop all count in Udemy\'s checker.',
    'Check the five test lines: 2000 and 2024 are leap years; 1900, 2023 and 2100 are not. The Explore tab walks any year through the flowchart.'
  ],
  files:{ 'script.js':`function isLeap(year) {
  // TODO: answer three questions, in this order:
  //   1. divisible by 4?    no  → "Not leap year."
  //   2. divisible by 100?  no  → "Leap year."
  //   3. divisible by 400?  yes → "Leap year."   no → "Not leap year."
}

console.log("2000 → " + isLeap(2000));   // Leap year.
console.log("1900 → " + isLeap(1900));   // Not leap year.
console.log("2024 → " + isLeap(2024));   // Leap year.
console.log("2023 → " + isLeap(2023));   // Not leap year.
console.log("2100 → " + isLeap(2100));   // Not leap year.
` },
  solution:{ 'script.js':`function isLeap(year) {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return "Leap year.";
      } else {
        return "Not leap year.";
      }
    } else {
      return "Leap year.";
    }
  } else {
    return "Not leap year.";
  }
}

console.log("2000 → " + isLeap(2000));   // Leap year.
console.log("1900 → " + isLeap(1900));   // Not leap year.
console.log("2024 → " + isLeap(2024));   // Leap year.
console.log("2023 → " + isLeap(2023));   // Not leap year.
console.log("2100 → " + isLeap(2100));   // Not leap year.
` },
  explore:[{
    title:'Walk a year through the flowchart', height:390,
    note:'Type a year or press one of the buttons. Each question shows the remainder that decides it; greyed-out questions are never reached.',
    html:`
<div class="knobs">
  <label>year <input type="number" id="y" value="1900" style="width:90px"></label>
  <button data-y="2000">2000</button><button data-y="1900">1900</button><button data-y="2024">2024</button><button data-y="2023">2023</button><button data-y="2100">2100</button>
</div>
<div class="stage" id="flow"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var y = document.getElementById('y'), flow = document.getElementById('flow'), ro = document.getElementById('ro');
  function node(text, state, detail){
    var skipped = state === 'skip';
    var bg = skipped ? '#f6f7fb' : (state === 'yes' ? '#e8f8ef' : '#fdeeee');
    return '<div style="display:flex;align-items:center;gap:12px;margin:6px 0">' +
      '<div style="flex:0 0 230px;padding:9px 12px;border-radius:8px;border:1px solid #dfe3ee;background:' + bg + ';color:' + (skipped ? '#b9c0d4' : '#1c2030') + ';font:600 13px ui-monospace,Menlo,monospace">' + text + '</div>' +
      '<div style="font-size:13px;color:' + (skipped ? '#b9c0d4' : '#1c2030') + '">' + (skipped ? 'not reached' : '<b>' + state + '</b> · ' + detail) + '</div></div>';
  }
  function upd(){
    var year = parseInt(y.value, 10) || 0, r4 = year % 4, r100 = year % 100, r400 = year % 400, html = '', result, why;
    html += node('year % 4 === 0 ?', r4 === 0 ? 'yes' : 'no', year + ' % 4 = ' + r4);
    if (r4 !== 0) {
      html += node('year % 100 === 0 ?', 'skip') + node('year % 400 === 0 ?', 'skip');
      result = 'Not leap year.'; why = year + ' does not divide by 4, so the very first question settles it.';
    } else {
      html += node('year % 100 === 0 ?', r100 === 0 ? 'yes' : 'no', year + ' % 100 = ' + r100);
      if (r100 !== 0) {
        html += node('year % 400 === 0 ?', 'skip');
        result = 'Leap year.'; why = year + ' divides by 4 and is not a century year, so it is a leap year.';
      } else {
        html += node('year % 400 === 0 ?', r400 === 0 ? 'yes' : 'no', year + ' % 400 = ' + r400);
        result = r400 === 0 ? 'Leap year.' : 'Not leap year.';
        why = r400 === 0 ? year + ' is a century year, but it divides by 400 as well, so it is a leap year after all.' : year + ' is a century year that does not divide by 400, so it is not a leap year.';
      }
    }
    flow.innerHTML = html + '<div style="margin-top:12px;font:700 14px ui-monospace,Menlo,monospace">return "' + result + '"</div>';
    ro.textContent = why;
  }
  y.addEventListener('input', upd);
  document.querySelectorAll('[data-y]').forEach(function(b){ b.addEventListener('click', function(){ y.value = b.getAttribute('data-y'); upd(); }); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Is 1900 a leap year?', options:['Yes — it divides by 4','No — it divides by 100 but not by 400','Yes — it divides by 100','No — it does not divide by 4'], answer:1, why:'Century years are only leap years when they also divide by 400, like 2000.' },
    { q:'What does <code>year % 4 === 0</code> test?', options:['That year divides by 4 with nothing left over','That year is 4','That year is less than 4','The fourth digit of year'], answer:0, why:'% gives the remainder; a remainder of 0 means it divides exactly.' },
    { q:'Udemy expects <code>"Leap year."</code> and your function returns <code>"Leap Year"</code>. What happens?', options:['It passes','The check fails: the capital Y and the missing full stop both count','It passes with a warning','JavaScript corrects it'], answer:1, why:'Automated checkers compare strings exactly, character by character.' },
  ],
  notes:`
    <h3>The rule, in order</h3>
    <ol>
      <li>Divisible by 4 → a leap year…</li>
      <li>…unless it is also divisible by 100 → not a leap year…</li>
      <li>…unless it is also divisible by 400 → a leap year after all.</li>
    </ol>
    <p>So 1900 was not a leap year, but 2000 was. Leap years exist because the Earth takes about 365¼ days to go round the Sun, and the extra rules trim the small overcorrection that a leap day every four years would cause.</p>
    <h3>Flowchart first</h3>
    <p>The hard part of this challenge is the logic, not the syntax. Each diamond in a flowchart becomes one <code>if</code>; each arrow becomes a branch. Free tools such as draw.io make the drawing quick.</p>`
});


PG.add({
  id:'l104', index:104, udemyId:18143372, minutes:3, section:'s15', slug:'leap-year-solution', kind:'js',
  title:'Leap Year Solution',
  blurb:'The flowchart translated literally: one <code>if</code> per question, each nested inside the "yes" branch of the one before, and every path ending in a <code>return</code> with the exact string. Denser one-condition versions exist, but this one can be checked against the flowchart line by line.',
  tasks:[
    'Run it and read the five test results.',
    'Match each nesting level to one question of the flowchart (lesson 103\'s Explore tab draws it).',
    'Delete the final <code>else</code> branch (the one for years that do not divide by 4) and find a year that now returns <code>undefined</code>. Put it back.',
    'Write the one-condition version, <code>(year % 4 === 0 &amp;&amp; year % 100 !== 0) || year % 400 === 0</code>, and check it agrees with the nested one for every test year.'
  ],
  files:{ 'script.js':`function isLeap(year) {
  if (year % 4 === 0) {               // question 1: divisible by 4?
    if (year % 100 === 0) {           // question 2: a century year?
      if (year % 400 === 0) {         // question 3: divisible by 400?
        return "Leap year.";
      } else {
        return "Not leap year.";
      }
    } else {
      return "Leap year.";
    }
  } else {
    return "Not leap year.";
  }
}

console.log("2000 → " + isLeap(2000));   // Leap year.
console.log("1900 → " + isLeap(1900));   // Not leap year.
console.log("2024 → " + isLeap(2024));   // Leap year.
console.log("2023 → " + isLeap(2023));   // Not leap year.
console.log("2100 → " + isLeap(2100));   // Not leap year.
` },
  solution:{ 'script.js':`function isLeap(year) {
  if (year % 4 === 0) {               // question 1: divisible by 4?
    if (year % 100 === 0) {           // question 2: a century year?
      if (year % 400 === 0) {         // question 3: divisible by 400?
        return "Leap year.";
      } else {
        return "Not leap year.";
      }
    } else {
      return "Leap year.";
    }
  } else {
    return "Not leap year.";
  }
}

// the same rule as one condition: shorter, but harder to check against the flowchart
function isLeapCompact(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return "Leap year.";
  } else {
    return "Not leap year.";
  }
}

console.log("2000 → " + isLeap(2000) + "  /  " + isLeapCompact(2000));
console.log("1900 → " + isLeap(1900) + "  /  " + isLeapCompact(1900));
console.log("2024 → " + isLeap(2024) + "  /  " + isLeapCompact(2024));
console.log("2023 → " + isLeap(2023) + "  /  " + isLeapCompact(2023));
console.log("2100 → " + isLeap(2100) + "  /  " + isLeapCompact(2100));
` },
  quiz:[
    { q:'Which of these years reaches the innermost check (<code>% 400</code>)?', options:['2023','2024','1900','2019'], answer:2, why:'Only years that pass both earlier questions — divisible by 4 and by 100 — get that far.' },
    { q:'What does a function return when a path ends without a <code>return</code> statement?', options:['"Not leap year."','false','undefined','0'], answer:2, why:'Every path needs its own return, or the caller receives undefined.' },
  ],
});


PG.add({
  id:'s15-arrays', index:105, udemyId:12374004, minutes:9, section:'s15', slug:'arrays', kind:'js',
  title:'Collections: Working with Javascript Arrays',
  blurb:'An array keeps many related values in one variable, like eggs in a box: <code>["Angela", "Ben", "Jenny"]</code>. Square brackets both create it and read from it, positions count from 0, <code>.length</code> says how many items there are and <code>.includes()</code> checks whether a value is in it. The exercise is a guest list for a party.',
  tasks:[
    'Make a <code>guestList</code> array of names (strings need quotes, items need commas between them).',
    'Log the whole array, the first item, the last item (<code>guestList[guestList.length - 1]</code>) and how many there are.',
    'The doorman: prompt for a name and use <code>guestList.includes(name)</code> to alert a welcome or a polite refusal. Angela is queued.',
    'Change the Prompt answer to <code>angela</code> in lower case. Refused! Tidy the capitals before checking (the casing challenge from lecture 85 does exactly that).',
    'Log <code>"Item 99: " + guestList[99]</code>. A position past the end gives <code>undefined</code>, not an error.'
  ],
  answers:'Angela',
  files:{ 'script.js':`// TODO 1: make an array called guestList with some names


// TODO 2: log the whole array, the first item, the last item and how many there are


// TODO 3: the doorman
alert("Welcome to my birthday party");
// prompt for a name, then use includes() to welcome or refuse


// TODO 4: make "angela" (lower case) get in too


// TODO 5: what is at position 99?
` },
  solution:{ 'script.js':`const guestList = ["Angela", "Ben", "Jenny", "Paul", "Chloe", "Michael"];

console.log(guestList);
console.log("First: " + guestList[0]);
console.log("Last: " + guestList[guestList.length - 1]);
console.log("How many: " + guestList.length);

alert("Welcome to my birthday party");
const name = prompt("What is your name?");

// tidy the capitals first, so "angela" and "ANGELA" both match "Angela"
const tidyName = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();

if (guestList.includes(tidyName)) {
  alert("Welcome in, " + tidyName + "!");
} else {
  alert("Sorry " + name + ", you are not on the list.");
}

console.log("Item 99: " + guestList[99]);    // undefined — no error, just nothing there

// searching
console.log(guestList.includes("Ben"));      // true
console.log(guestList.indexOf("Jenny"));     // 2
console.log(guestList.indexOf("Kanye"));     // -1 means not found
` },
  explore:[{
    title:'The egg box', height:370,
    note:'Click a slot, or type any index (try 6 or -1). The second box checks <code>includes()</code> — try <i>jenny</i> in lower case.',
    html:`
<div class="knobs">
  <label>index <input type="number" id="i" value="2" style="width:70px"></label>
  <label>guestList.includes( <input type="text" id="q" value="jenny" style="width:110px"> )</label>
</div>
<div class="stage" id="box" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var guestList = ['Angela', 'Ben', 'Jenny', 'Paul', 'Chloe', 'Michael'];
  var I = document.getElementById('i'), Q = document.getElementById('q'), box = document.getElementById('box'), ro = document.getElementById('ro');
  function show(v){ return v === undefined ? 'undefined' : JSON.stringify(v); }
  function upd(){
    var idx = parseInt(I.value, 10);
    if (isNaN(idx)) idx = 0;
    box.innerHTML = guestList.map(function(g, k){
      var on = k === idx;
      return '<div data-k="' + k + '" style="cursor:pointer;text-align:center"><div style="width:88px;padding:14px 4px;border-radius:40px 40px 14px 14px;font-weight:700;border:2px solid ' + (on ? '#5b9cff' : '#e4d8bd') + ';background:' + (on ? '#eaf2ff' : '#fff8ea') + '">' + g + '</div>' +
        '<div style="font:12px ui-monospace,Menlo,monospace;margin-top:4px;color:#3c435c">[' + k + ']</div></div>';
    }).join('');
    box.querySelectorAll('[data-k]').forEach(function(el){ el.addEventListener('click', function(){ I.value = el.getAttribute('data-k'); upd(); }); });
    var val = guestList[idx], found = guestList.includes(Q.value), label = 'guestList[' + idx + ']';
    ro.textContent =
      label + ' '.repeat(Math.max(1, 32 - label.length)) + '→ ' + show(val) + (val === undefined ? '   (there is no slot ' + idx + ')' : '') + '\\n' +
      'guestList.length                → ' + guestList.length + '\\n' +
      'guestList[guestList.length - 1] → ' + show(guestList[guestList.length - 1]) + '   (the last index is length - 1 = ' + (guestList.length - 1) + ')\\n\\n' +
      'guestList.includes(' + JSON.stringify(Q.value) + ') → ' + found +
      (!found && guestList.some(function(g){ return g.toLowerCase() === Q.value.toLowerCase(); }) ? '   (the capitals do not match, and includes is strict about them)' : '');
  }
  I.addEventListener('input', upd); Q.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'In <code>["Angela", "Ben", "Jenny"]</code>, what is at index 1?', options:['"Angela"','"Ben"','"Jenny"','undefined'], answer:1, why:'Counting starts at 0, so index 1 is the second item.' },
    { q:'How do you get the last item of any array <code>list</code>?', options:['list[-1]','list.last','list[list.length]','list[list.length - 1]'], answer:3, why:'The last position is always one less than the length, because counting starts at 0.' },
    { q:'With <code>"Angela"</code> in the list, what does <code>guestList.includes("angela")</code> give?', options:['true','false','"Angela"','0'], answer:1, why:'includes compares exactly, so a lower-case a is a different string.' },
  ],
  notes:`
    <h3>Zero-indexed</h3>
    <pre>const guests = ["Angela", "Ben", "Jenny", "Paul"];
//   index:         0        1       2        3

guests[0]                   -> "Angela"
guests[guests.length - 1]   -> "Paul"   (the last one, always)
guests.length               -> 4</pre>
    <p>Square brackets both create an array and read from it — a quick visual hint that you are dealing with a collection.</p>
    <h3>Searching</h3>
    <ul>
      <li><code>.includes("Ben")</code> → true or false</li>
      <li><code>.indexOf("Ben")</code> → the position, or <code>-1</code> if missing</li>
    </ul>
    <h3>const does not mean frozen</h3>
    <p>A <code>const</code> array cannot be replaced by a whole new array, but you can still add and remove items. <code>const</code> fixes the label to the box, not what is inside.</p>`
});


PG.add({
  id:'s15-array-methods', index:106, udemyId:12374030, minutes:16, section:'s15', slug:'array-methods', kind:'js',
  title:'Adding Elements and Intermediate Array Techniques',
  blurb:'Arrays can grow and shrink: <code>push()</code> adds an item to the end, and <code>pop()</code> removes the last one and hands it back. The lecture uses them to build <b>FizzBuzz</b> one number per call — multiples of 3 become "Fizz", multiples of 5 "Buzz", multiples of both "FizzBuzz" — and shows why the most specific condition has to be checked first.',
  tasks:[
    'Warm-up: push <code>"Jenny"</code> onto <code>guests</code>, log the list, then <code>pop()</code> her off again and log what came back.',
    'Fill in <code>fizzBuzz()</code>: push <code>count</code> onto <code>output</code>, then add 1 to <code>count</code>. Both variables live <b>outside</b> the function so they survive between calls.',
    'Push <code>"Fizz"</code> instead of the number when <code>count % 3 === 0</code>, and <code>"Buzz"</code> when <code>count % 5 === 0</code>.',
    'Call it 15 times. Item 15 says Fizz instead of FizzBuzz — add a combined <code>&amp;&amp;</code> check and work out where in the chain it has to go.',
    'Extra: <code>unshift()</code> and <code>shift()</code> do the same two jobs at the <b>start</b> of the array. Try both on <code>guests</code>.'
  ],
  files:{ 'script.js':`// This console prints arrays one item per line, so arrays here are logged
// with .join(", ") to keep each one on a single line.

// TODO 1: push "Jenny" onto guests and log it, then pop her off and log what came back
const guests = ["Angela", "Ben"];
console.log(guests.join(", "));


// FizzBuzz, one number per call
const output = [];
let count = 1;

function fizzBuzz() {
  // TODO 2: push count onto output, then add 1 to count
  // TODO 3: push "Fizz" for multiples of 3 and "Buzz" for multiples of 5 instead
  // TODO 4: "FizzBuzz" for multiples of both — where in the chain does that check go?

  console.log(output.join(", "));
}

fizzBuzz();
fizzBuzz();
fizzBuzz();
// ...call it 15 times in total
` },
  solution:{ 'script.js':`const guests = ["Angela", "Ben"];
console.log(guests.join(", "));            // Angela, Ben
guests.push("Jenny");                      // adds to the END
console.log(guests.join(", "));            // Angela, Ben, Jenny
const removed = guests.pop();              // removes the last item and hands it back
console.log("pop gave back " + removed);   // Jenny
console.log(guests.join(", "));            // Angela, Ben

const output = [];
let count = 1;

function fizzBuzz() {
  if (count % 3 === 0 && count % 5 === 0) {   // the most specific check goes first
    output.push("FizzBuzz");
  } else if (count % 3 === 0) {
    output.push("Fizz");
  } else if (count % 5 === 0) {
    output.push("Buzz");
  } else {
    output.push(count);
  }
  count++;
  console.log(output.join(", "));
}

fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz();
fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz();
fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz(); fizzBuzz();
// the 15th call ends with: ..., 13, 14, FizzBuzz

// the other end of the array: unshift adds to the START, shift removes from it
guests.unshift("Zoe");
console.log(guests.join(", "));                     // Zoe, Angela, Ben
console.log("shift gave back " + guests.shift());   // Zoe
` },
  explore:[{
    title:'push, pop, unshift, shift', height:330,
    note:'Each button changes the array itself and returns something. Watch which end it works on, and what it hands back.',
    html:`
<div class="knobs">
  <label>value <input type="text" id="v" value="Tom" style="width:100px"></label>
  <button id="push">guests.push(value)</button>
  <button id="pop">guests.pop()</button>
  <button id="unshift">guests.unshift(value)</button>
  <button id="shift">guests.shift()</button>
  <button id="reset">reset</button>
</div>
<div class="stage" id="arr" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;min-height:66px"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var start = ['Angela', 'Ben', 'Jenny'], guests = start.slice(), hot = -1;
  var V = document.getElementById('v'), arr = document.getElementById('arr'), ro = document.getElementById('ro');
  function q(s){ return JSON.stringify(s); }
  function paint(msg){
    arr.innerHTML = guests.length ? guests.map(function(g, k){
      var on = k === hot;
      return '<div style="text-align:center"><div style="padding:10px 14px;border-radius:8px;font-weight:700;border:2px solid ' + (on ? '#7ee0a8' : '#dfe3ee') + ';background:' + (on ? '#e8f8ef' : '#fff') + '">' + g.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>' +
        '<div style="font:11px ui-monospace,Menlo,monospace;color:#5b6382;margin-top:3px">[' + k + ']</div></div>';
    }).join('') : '<span class="note" style="margin:0">(empty array)</span>';
    ro.textContent = msg + '\\n\\nguests.length is now ' + guests.length;
  }
  document.getElementById('push').addEventListener('click', function(){
    var r = guests.push(V.value); hot = guests.length - 1;
    paint('guests.push(' + q(V.value) + ') added it at the END and returned ' + r + ', the new length.');
  });
  document.getElementById('pop').addEventListener('click', function(){
    var r = guests.pop(); hot = -1;
    paint(r === undefined ? 'guests.pop() on an empty array returns undefined.' : 'guests.pop() removed the LAST item and returned it: ' + q(r));
  });
  document.getElementById('unshift').addEventListener('click', function(){
    var r = guests.unshift(V.value); hot = 0;
    paint('guests.unshift(' + q(V.value) + ') added it at the START and returned ' + r + '. Every other item moved up one position.');
  });
  document.getElementById('shift').addEventListener('click', function(){
    var r = guests.shift(); hot = -1;
    paint(r === undefined ? 'guests.shift() on an empty array returns undefined.' : 'guests.shift() removed the FIRST item and returned it: ' + q(r) + '. Every other item moved down one position.');
  });
  document.getElementById('reset').addEventListener('click', function(){ guests = start.slice(); hot = -1; paint('Back to the start.'); });
  paint('Press a button.');
<\/script>`
  },{
    title:'fizzBuzz(), one call at a time', height:380,
    note:'Each call checks the conditions from the top and stops at the first true one. Tick <b>wrong order</b>, call it 15 times and look at the last item.',
    html:`
<div class="knobs">
  <button id="call">fizzBuzz()</button>
  <button id="ten">call it 10 times</button>
  <button id="reset">reset</button>
  <label><input type="checkbox" id="wrong"> wrong order: check 3 first</label>
</div>
<div class="stage" id="arr" style="display:flex;gap:5px;flex-wrap:wrap;min-height:50px"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var output = [], count = 1;
  var arr = document.getElementById('arr'), ro = document.getElementById('ro'), wrong = document.getElementById('wrong');
  function one(){
    var c = count, three = c % 3 === 0, five = c % 5 === 0, steps, lines = [], hit = null;
    if (wrong.checked) steps = [['count % 3 === 0', three, 'Fizz'], ['count % 5 === 0', five, 'Buzz'], ['count % 3 === 0 && count % 5 === 0', three && five, 'FizzBuzz']];
    else steps = [['count % 3 === 0 && count % 5 === 0', three && five, 'FizzBuzz'], ['count % 3 === 0', three, 'Fizz'], ['count % 5 === 0', five, 'Buzz']];
    steps.forEach(function(s){
      var cond = s[0].replace(/count/g, c);
      if (hit !== null) { lines.push('    ' + cond + '   (never checked: the chain already stopped)'); return; }
      lines.push((s[1] ? '✓   ' : '✗   ') + cond + '  →  ' + s[1]);
      if (s[1]) hit = s[2];
    });
    if (hit === null) lines.push('    else  →  push the number itself');
    var pushed = hit === null ? c : hit;
    output.push(pushed);
    count++;
    return 'count was ' + c + ':\\n' + lines.join('\\n') + '\\n→ output.push(' + JSON.stringify(pushed) + '), then count++';
  }
  function paint(msg){
    arr.innerHTML = output.map(function(v, k){
      var bg = v === 'FizzBuzz' ? '#ffcf6b' : (typeof v === 'string' ? '#eaf2ff' : '#fff');
      return '<span style="padding:5px 8px;border-radius:6px;font:600 13px ui-monospace,Menlo,monospace;background:' + bg + ';border:1px solid #dfe3ee' + (k === output.length - 1 ? ';outline:2px solid #5b9cff' : '') + '">' + v + '</span>';
    }).join('');
    ro.textContent = msg;
  }
  document.getElementById('call').addEventListener('click', function(){ paint(one()); });
  document.getElementById('ten').addEventListener('click', function(){ var m; for (var k = 0; k < 10; k++) m = one(); paint(m); });
  document.getElementById('reset').addEventListener('click', function(){ output = []; count = 1; paint('Empty again: output is [] and count is 1.'); });
  wrong.addEventListener('change', function(){
    output = []; count = 1;
    paint(wrong.checked ? 'Wrong order: the plain % 3 check comes first. Call it 15 times and look at the last item.' : 'Right order: the combined check comes first.');
  });
  paint('output is [] and count is 1. Press fizzBuzz().');
<\/script>`
  }],
  quiz:[
    { q:'What does <code>output.push("Fizz")</code> do?', options:['Adds "Fizz" to the start','Adds "Fizz" to the end','Replaces the last item with "Fizz"','Removes "Fizz" from the array'], answer:1, why:'push always appends at the end; unshift is the one that adds at the start.' },
    { q:'Why are <code>output</code> and <code>count</code> declared outside <code>fizzBuzz()</code>?', options:['Functions cannot use arrays','It makes the code faster','So they keep their values between calls instead of starting again each time','So console.log can find them'], answer:2, why:'Variables declared inside a function are created fresh on every call, so the array would never grow past one item.' },
    { q:'Your FizzBuzz gives "Fizz" for 15. What fixes it?', options:['Use else instead of else if','Check 5 before 3','Start count at 0','Put the combined check (divisible by 3 and by 5) first'], answer:3, why:'A chain stops at the first true condition. 15 passes the plain % 3 test, so the combined test has to come before it.' },
  ],
  notes:`
    <h3>The four</h3>
    <table>
      <tr><th>Method</th><th>Does</th><th>Returns</th></tr>
      <tr><td><code>.push(x)</code></td><td>Add to the end</td><td>The new length</td></tr>
      <tr><td><code>.pop()</code></td><td>Remove from the end</td><td>The removed item</td></tr>
      <tr><td><code>.unshift(x)</code></td><td>Add to the start</td><td>The new length</td></tr>
      <tr><td><code>.shift()</code></td><td>Remove from the start</td><td>The removed item</td></tr>
    </table>
    <p>All four <b>change the original array</b>. In React you will meet tools that make a copy instead (<code>.map</code>, <code>.filter</code>, the spread operator), and the difference starts to matter.</p>
    <h3>Most specific first</h3>
    <p>FizzBuzz is a popular interview question because it shows at once whether someone can order conditions. The rule generalises: in any <code>if / else if</code> chain, put the narrowest condition at the top.</p>`
});


PG.add({
  id:'s15-lunch', index:106, sub:'b', udemyId:12374030, minutes:0, section:'s15', slug:'whos-buying-lunch', kind:'js',
  title:'Coding Exercise: Who\'s Buying Lunch?',
  blurb:'The coding exercise after lecture 106: given an array of names, pick one at random to pay for lunch. It combines the random-number recipe with array positions — and it has to work for a list of any length.',
  tasks:[
    'Fill in <code>whosPaying(names)</code>.',
    'Pick a random position from 0 to <code>names.length - 1</code> with <code>Math.floor(Math.random() * names.length)</code>.',
    'Return <i>Michael is going to buy lunch today!</i> with whichever name came up — mind the space before <i>is</i>.',
    'The test lines use lists of 5, 2 and 10 names. Your function should handle all three without any changes.'
  ],
  files:{ 'script.js':`function whosPaying(names) {
  // TODO: pick a random position from 0 to names.length - 1,
  //       then return "<that name> is going to buy lunch today!"
}

console.log("5 names: " + whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));
console.log("2 names: " + whosPaying(["Ada", "Grace"]));
console.log("10 names: " + whosPaying(["Ann", "Bo", "Cy", "Di", "Ed", "Flo", "Gus", "Hal", "Ivy", "Jo"]));
` },
  solution:{ 'script.js':`function whosPaying(names) {
  const randomIndex = Math.floor(Math.random() * names.length);   // 0 to names.length - 1
  return names[randomIndex] + " is going to buy lunch today!";
}

console.log("5 names: " + whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));
console.log("2 names: " + whosPaying(["Ada", "Grace"]));
console.log("10 names: " + whosPaying(["Ann", "Bo", "Cy", "Di", "Ed", "Flo", "Gus", "Hal", "Ivy", "Jo"]));

// names.length rather than a hard-coded 5: add a sixth person and nothing needs to change
` },
  quiz:[
    { q:'Why use <code>names.length</code> instead of the number 5?', options:['5 is a syntax error','The function then works for a list of any size','length is faster to type','Math.random requires it'], answer:1, why:'A hard-coded 5 breaks as soon as someone joins or leaves the team.' },
    { q:'For a list of 5 names, which positions can <code>Math.floor(Math.random() * names.length)</code> produce?', options:['1 to 5','0 to 5','0 to 4','0 to 4.99'], answer:2, why:'Random × 5 gives 0 to 4.999…, and flooring leaves 0, 1, 2, 3 or 4 — exactly the valid positions.' },
  ],
  notes:`
    <h3>The pattern to remember</h3>
    <pre>const randomItem = list[Math.floor(Math.random() * list.length)];</pre>
    <p>Random quotes, random questions, shuffling a deck — you will use this line again and again.</p>`
});


PG.add({
  id:'l107', index:107, udemyId:18170350, minutes:4, section:'s15', slug:'whos-buying-lunch-solution', kind:'js',
  title:'Who\'s Buying Lunch Solution',
  blurb:'The walkthrough builds the answer one variable at a time: how many people there are (<code>names.length</code>), a random position from 0 up to one less than that, the name at that position, and finally the sentence — returned, not logged.',
  tasks:[
    'Run it a few times: a different name each time.',
    'Add a sixth person to the list. The function needs no changes because it reads <code>names.length</code>.',
    'Off-by-one experiment: change <code>Math.floor</code> to <code>Math.ceil</code> and run until you see <i>undefined is going to buy lunch today!</i> Why does that happen? The Explore tab shows the effect over 1000 picks.',
    'Collapse the three variables into one expression: <code>names[Math.floor(Math.random() * names.length)]</code>.'
  ],
  files:{ 'script.js':`function whosPaying(names) {
  const numberOfPeople = names.length;
  const randomPersonPosition = Math.floor(Math.random() * numberOfPeople);   // 0 to numberOfPeople - 1
  const randomPerson = names[randomPersonPosition];
  return randomPerson + " is going to buy lunch today!";
}

console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));
` },
  solution:{ 'script.js':`function whosPaying(names) {
  const numberOfPeople = names.length;
  const randomPersonPosition = Math.floor(Math.random() * numberOfPeople);   // 0 to numberOfPeople - 1
  const randomPerson = names[randomPersonPosition];
  return randomPerson + " is going to buy lunch today!";
}

console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));
console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe", "Sam"]));   // a sixth person: no changes needed

// the same thing in one expression, once every step is clear
function whosPayingShort(names) {
  return names[Math.floor(Math.random() * names.length)] + " is going to buy lunch today!";
}
console.log(whosPayingShort(["Ada", "Grace", "Hedy"]));
` },
  explore:[{
    title:'Is it fair?', height:330,
    note:'Pick 1000 people with each formula. A fair one gives everybody roughly 200 turns and never lands on a position that does not exist.',
    html:`
<div class="knobs">
  <label>position formula
    <select id="f">
      <option value="floor">Math.floor(Math.random() * names.length)</option>
      <option value="ceil">Math.ceil(Math.random() * names.length)</option>
      <option value="round">Math.round(Math.random() * names.length)</option>
    </select>
  </label>
  <button id="go">Pick 1000 times</button>
</div>
<div class="stage" id="bars"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var names = ['Angela', 'Ben', 'Jenny', 'Michael', 'Chloe'];
  var F = { floor: Math.floor, ceil: Math.ceil, round: Math.round };
  var why = {
    floor: 'Positions 0 to 4, each roughly 200 times out of 1000. Everybody has the same chance of paying.',
    ceil: 'Positions 1 to 5. Angela (position 0) practically never pays, and position 5 does not exist, so about one sentence in five starts with undefined.',
    round: 'Positions 0 to 5. Angela and the missing position 5 get only half a share each: unfair, and sometimes undefined.'
  };
  var sel = document.getElementById('f'), bars = document.getElementById('bars'), ro = document.getElementById('ro');
  function go(){
    var f = F[sel.value], counts = {}, labels = names.concat(['undefined']);
    labels.forEach(function(l){ counts[l] = 0; });
    for (var i = 0; i < 1000; i++) {
      var who = names[f(Math.random() * names.length)];
      counts[who === undefined ? 'undefined' : who]++;
    }
    bars.innerHTML = labels.map(function(l){
      var c = counts[l], bad = l === 'undefined';
      return '<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><div style="width:84px;font:600 13px ui-monospace,Menlo,monospace;color:' + (bad ? '#c0392b' : '#1c2030') + '">' + l + '</div>' +
        '<div style="height:16px;width:' + Math.round(c * 1.2) + 'px;background:' + (bad ? '#ff9aa2' : '#5b9cff') + ';border-radius:3px"></div>' +
        '<div style="font:12px ui-monospace,Menlo,monospace;color:#5b6382">' + c + '</div></div>';
    }).join('');
    ro.textContent = why[sel.value];
  }
  document.getElementById('go').addEventListener('click', go);
  sel.addEventListener('change', go);
  go();
<\/script>`
  }],
  quiz:[
    { q:'With 5 names, which positions can <code>Math.ceil(Math.random() * 5)</code> produce (ignoring the near-impossible exact 0)?', options:['0 to 4','1 to 5 — and position 5 does not exist','0 to 5','1 to 4'], answer:1, why:'Ceil always rounds up, so 0.2 becomes 1 and 4.7 becomes 5. The first person is skipped and the last position is past the end.' },
    { q:'What does the space at the start of <code>" is going to buy lunch today!"</code> do?', options:['Nothing — spaces are ignored','return needs it','It separates the name from the rest of the sentence','It turns the name into a string'], answer:2, why:'Concatenation adds nothing between the pieces, so the space has to be part of one of the strings.' },
  ],
});


PG.add({
  id:'s15-while', index:108, udemyId:12374056, minutes:8, section:'s15', slug:'while-loops', kind:'js',
  title:'Control Statements: While Loops',
  blurb:'A <code>while</code> loop repeats its block for as long as its condition is true, checking the condition before every round. Something inside the loop must eventually make the condition false, or it never ends. The lecture turns the one-step FizzBuzz into a function that fills all 100 items in a single call, then sets the 99 Bottles challenge.',
  tasks:[
    'Read this first: the editor re-runs your code about half a second after you stop typing, so a loop that never ends freezes the tab — and because your code is saved, it would freeze again after a reload. Every loop in the starter already contains the line that moves it towards its end; keep that line while you work. (The Notes tab explains how to recover if it happens anyway.)',
    'Trace the first loop: how many times does its body run? Predict, run, then step through it in the Explore tab.',
    'Countdown: fill in the body of the second loop so it logs 5, 4, 3, 2, 1, then log <i>Lift off!</i> after the loop.',
    'FizzBuzz to 100: put the if/else chain from lecture 106 inside the <code>while (count &lt;= 100)</code> loop, so one call fills all 100 items. Log the array once, after the loop.',
    'Roll a die until you get a six and count the attempts. This is what <code>while</code> is made for: nobody knows in advance how many rolls it will take.'
  ],
  files:{ 'script.js':`// ⚠ This editor re-runs your code as you type. A loop that never ends freezes the
//   tab, so every loop below already has the line that moves it towards its end.

// 1. Trace this one: how many times does the body run?
let i = 1;
while (i < 2) {
  console.log("i is " + i);
  i++;
}

// 2. Countdown: fill in the body. countdown-- is what ends the loop, so keep it.
let countdown = 5;
while (countdown > 0) {
  // TODO: log countdown

  countdown--;
}
// TODO: log "Lift off!"


// 3. FizzBuzz to 100 in one call
const output = [];
let count = 1;

function fizzBuzz() {
  while (count <= 100) {
    // TODO: the if / else if chain from lecture 106, pushing onto output

    count++;   // keep this line: without it the loop never ends
  }
  // TODO: log the whole array once, here, after the loop (output.join(", ") keeps it on one line)
}

fizzBuzz();


// 4. Keep rolling a die until you get a six
let roll = 0;
let attempts = 0;
while (roll !== 6) {
  roll = Math.floor(Math.random() * 6) + 1;   // this line is what eventually ends the loop
  // TODO: add 1 to attempts
}
// TODO: log how many attempts it took
` },
  solution:{ 'script.js':`// 1. The body runs once: i starts at 1, 1 < 2 is true, i becomes 2, and 2 < 2 is false.
let i = 1;
while (i < 2) {
  console.log("i is " + i);
  i++;
}

// 2. Countdown
let countdown = 5;
while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
console.log("Lift off!");

// 3. FizzBuzz to 100 in one call
const output = [];
let count = 1;

function fizzBuzz() {
  while (count <= 100) {
    if (count % 3 === 0 && count % 5 === 0) {
      output.push("FizzBuzz");
    } else if (count % 3 === 0) {
      output.push("Fizz");
    } else if (count % 5 === 0) {
      output.push("Buzz");
    } else {
      output.push(count);
    }
    count++;
  }
  console.log(output.join(", "));   // once, after the loop: all 100 items
}

fizzBuzz();

// 4. while shines when the number of rounds cannot be known in advance
let roll = 0;
let attempts = 0;
while (roll !== 6) {
  roll = Math.floor(Math.random() * 6) + 1;
  attempts++;
}
console.log("It took " + attempts + " rolls to get a six.");
` },
  explore:[{
    title:'Step through a while loop', height:340,
    note:'Press <b>Step</b> to run one line at a time and watch <code>i</code>, the condition and the console. Tick <b>forget the i++ line</b> to see an endless loop safely.',
    html:`
<div class="knobs">
  <label>let i = <input type="number" id="st" value="1" style="width:56px"></label>
  <label>while (i &lt; <input type="number" id="lim" value="4" style="width:56px">)</label>
  <label><input type="checkbox" id="noinc"> forget the i++ line</label>
  <button id="step">Step ▶</button>
  <button id="reset">Reset</button>
</div>
<div style="display:flex;gap:12px;align-items:flex-start">
  <pre class="readout" id="code" style="flex:1;margin:0"></pre>
  <pre class="readout" id="state" style="flex:1;margin:0;white-space:pre-wrap"></pre>
</div>
<script>
  var st = document.getElementById('st'), lim = document.getElementById('lim'), noinc = document.getElementById('noinc');
  var code = document.getElementById('code'), state = document.getElementById('state');
  var pc, i, out, rounds, frozen, lastTest;
  function esc(s){ return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function lines(){
    return ['let i = ' + st.value + ';', 'while (i < ' + lim.value + ') {', '  console.log(i);', noinc.checked ? '  // i++;   (forgotten)' : '  i++;', '}', 'console.log("done");'];
  }
  function paint(msg){
    code.innerHTML = lines().map(function(l, k){
      var on = k === pc;
      return '<span style="' + (on ? 'background:#2b3a55;color:#fff' : '') + '">' + (on ? '▶ ' : '  ') + esc(l) + '</span>';
    }).join('\\n');
    state.textContent = 'i = ' + (i === null ? '(not created yet)' : i) + '\\nconsole: ' + (out.length ? out.join(', ') : '(nothing yet)') + '\\n\\n' + msg;
  }
  function reset(){ pc = -1; i = null; out = []; rounds = 0; frozen = false; lastTest = null; paint('Press Step to run the first line.'); }
  function step(){
    if (frozen || pc === 5) return;
    var L = +lim.value, msg;
    if (pc === -1) { i = +st.value; pc = 0; msg = 'let i = ' + i + ' runs once: i now holds ' + i + '.'; }
    else if (pc === 0 || pc === 3 || (pc === 2 && noinc.checked)) {
      if (pc !== 0) rounds++;
      pc = 1; lastTest = i < L;
      msg = 'Check the condition: ' + i + ' < ' + L + ' is ' + lastTest + (lastTest ? ', so the body runs.' : ', so the loop is over: jump past the closing brace.');
      if (lastTest && noinc.checked && rounds >= 3) { frozen = true; msg += '\\n\\ni never changes, so this condition will be true forever. A real page would freeze right here.'; }
    }
    else if (pc === 1) {
      if (lastTest) { pc = 2; out.push(String(i)); msg = 'console.log(i) prints ' + i + '.'; }
      else { pc = 5; out.push('done'); msg = 'The line after the loop runs. Finished after ' + rounds + ' round' + (rounds === 1 ? '' : 's') + '.'; }
    }
    else if (pc === 2) { pc = 3; i++; msg = 'i++ adds one: i is now ' + i + '. Back up to the condition.'; }
    paint(msg);
  }
  document.getElementById('step').addEventListener('click', step);
  document.getElementById('reset').addEventListener('click', reset);
  [st, lim, noinc].forEach(function(el){ el.addEventListener('change', reset); el.addEventListener('input', reset); });
  reset();
<\/script>`
  }],
  quiz:[
    { q:'When is a while loop\'s condition checked?', options:['Once, at the start','Before every round, including the first','Only after each round','Only when it becomes false'], answer:1, why:'The test runs before each pass, which is also why a loop whose condition starts out false never runs at all.' },
    { q:'What happens if nothing inside the loop changes the variable in its condition?', options:['The loop runs once','The condition stays true forever and the page freezes','JavaScript notices and stops it','It throws an error straight away'], answer:1, why:'The browser keeps running the body for ever; the tab becomes unresponsive until it is closed or reloaded.' },
    { q:'<code>let i = 5; while (i &lt; 3) { ... }</code> — how many times does the body run?', options:['0','1','3','for ever'], answer:0, why:'5 < 3 is false at the very first check, so the body is skipped entirely.' },
  ],
  notes:`
    <h3>The shape</h3>
    <pre>let i = 0;                // 1. set up
while (i &lt; 5) {           // 2. tested before every round
  console.log(i);
  i++;                    // 3. move towards the end!
}</pre>
    <h3>while vs for</h3>
    <ul>
      <li><code>while</code>: when you cannot know how many rounds you need ("keep rolling until a six").</li>
      <li><code>for</code>: when you can ("do this 100 times", "go through this array"). That is lecture 110.</li>
    </ul>
    <h3>If the tab freezes</h3>
    <p>An endless loop locks the page until you close or reload it. Because your code is saved as you type, opening this lesson again runs the same loop. To get out: open the playground's home page (the address with nothing after <code>#</code>), open DevTools there (Cmd+Option+J or Ctrl+Shift+J) and run <code>localStorage.removeItem("wdplay:code:s15-while")</code>. That puts this lesson back to its starter.</p>`
});


PG.add({
  id:'s15-bottles', index:108, sub:'b', udemyId:12374056, minutes:0, section:'s15', slug:'99-bottles', kind:'js',
  title:'Coding Exercise: 99 Bottles of Beer',
  blurb:'The challenge set at the end of lecture 108: print the whole song with a <code>while</code> loop, one verse per round, counting down from 99. The catch is the grammar near the end — <i>1 bottle</i>, then <i>no more bottles</i>.',
  tasks:[
    'Start with 5 bottles so the output stays short. Fill in the loop so each round logs a verse: <i>5 bottles of beer on the wall, 5 bottles of beer.</i> then <i>Take one down and pass it around, 4 bottles of beer on the wall.</i>',
    'The <code>bottles--</code> line is already in place. It is what ends the loop, so keep it (deleting it would freeze the tab).',
    'Fix the grammar: <i>1 bottle</i>, not <i>1 bottles</i>, and <i>no more bottles</i> at 0.',
    'After the loop, add the final verse: <i>No more bottles of beer on the wall, no more bottles of beer.</i> and <i>Go to the store and buy some more, 99 bottles of beer on the wall.</i>',
    'When everything reads right, change the starting number to 99.'
  ],
  files:{ 'script.js':`let bottles = 5;   // start small; change to 99 once it works

while (bottles > 0) {
  // TODO: the first line of the verse, using the current number of bottles

  bottles--;   // keep this line: it is what ends the loop

  // TODO: the second line of the verse, using the NEW number of bottles
}

// TODO: the final verse — no more bottles, go to the store, buy some more
` },
  solution:{ 'script.js':`let bottles = 5;   // change to 99 once it works

// the fiddly part in one place: the right words for any number of bottles
function bottleText(n) {
  if (n === 0) {
    return "no more bottles";
  } else if (n === 1) {
    return "1 bottle";
  } else {
    return n + " bottles";
  }
}

while (bottles > 0) {
  console.log(bottleText(bottles) + " of beer on the wall, " + bottleText(bottles) + " of beer.");
  bottles--;
  console.log("Take one down and pass it around, " + bottleText(bottles) + " of beer on the wall.");
  console.log("");
}

console.log("No more bottles of beer on the wall, no more bottles of beer.");
console.log("Go to the store and buy some more, 99 bottles of beer on the wall.");
` },
  quiz:[
    { q:'Which line picks the right word for any count <code>n</code>?', options:['const word = n > 1 ? "bottle" : "bottles";','const word = n === 1 ? "bottle" : "bottles";','const word = "bottles";','const word = n === 0 ? "bottle" : "bottles";'], answer:1, why:'Only exactly one bottle is singular; 0, 2, 3 and so on all take the plural.' },
    { q:'Why start with 5 bottles rather than 99?', options:['99 is too big for JavaScript','A short output is far easier to check; change one number once it works','Loops cannot count down from 99','The console only shows 5 lines'], answer:1, why:'Debugging with 99 verses scrolling past is miserable. Get it right small, then scale up.' },
  ],
  notes:`
    <h3>Start small</h3>
    <p>Get the loop right with 3 or 5 bottles, then change one number. That applies to almost every loop you will ever write.</p>
    <h3>Pull the fiddly part out</h3>
    <p>When the same awkward decision appears twice in a loop (which word for this number?), move it into a small function. The loop becomes readable again and the awkward logic lives in one place.</p>
    <p>If the tab ever freezes because the loop never ends, see the Notes of lecture 108; this lesson's saved code is stored as <code>wdplay:code:s15-bottles</code>.</p>`
});


PG.add({
  id:'l109', index:109, udemyId:12400140, minutes:1, section:'s15', slug:'99-bottles-solution', kind:'js',
  title:'Solution to the 99 Bottles Challenge',
  blurb:'The posted solution: a counter starting at 99, a <code>while</code> loop that logs one verse per round, and a decrement part-way through the verse. Its stretch goal is grammar — <i>bottle</i> at 1 and <i>no more</i> at 0. The posted listing has singular and plural the wrong way round, so this version swaps them back and works the word out again after the count changes.',
  tasks:[
    'Run it. All 99 verses scroll past; scroll up the console to check the start, then read the last three verses closely.',
    'Find the second <code>if (numberOfBottles === 1)</code>, the one after <code>numberOfBottles--</code>. Comment it out and look at the verse that goes from 2 to 1: the stale word comes back.',
    'Change <code>while (numberOfBottles &gt; 0)</code> to <code>&gt;= 0</code>. Predict the extra verse before you run it.',
    'Rewrite the word logic as a helper, <code>bottleText(n)</code>, that returns <i>no more bottles</i>, <i>1 bottle</i> or <i>n bottles</i>. Which version is easier to read?'
  ],
  files:{ 'script.js':`let numberOfBottles = 99;

while (numberOfBottles > 0) {
  let bottleWord = "bottles";
  if (numberOfBottles === 1) {
    bottleWord = "bottle";
  }
  console.log(numberOfBottles + " " + bottleWord + " of beer on the wall,");
  console.log(numberOfBottles + " " + bottleWord + " of beer.");
  console.log("Take one down, pass it around,");

  numberOfBottles--;              // the count changes here...

  bottleWord = "bottles";         // ...so the word has to be worked out again
  if (numberOfBottles === 1) {
    bottleWord = "bottle";
  }
  if (numberOfBottles === 0) {
    console.log("no more bottles of beer on the wall.");
  } else {
    console.log(numberOfBottles + " " + bottleWord + " of beer on the wall.");
  }
  console.log("");
}

console.log("No more bottles of beer on the wall, no more bottles of beer.");
console.log("Go to the store and buy some more, 99 bottles of beer on the wall.");
` },
  solution:{ 'script.js':`// the word logic as one helper, used before and after the count changes
function bottleText(n) {
  if (n === 0) {
    return "no more bottles";
  } else if (n === 1) {
    return "1 bottle";
  } else {
    return n + " bottles";
  }
}

let numberOfBottles = 99;

while (numberOfBottles > 0) {
  console.log(bottleText(numberOfBottles) + " of beer on the wall,");
  console.log(bottleText(numberOfBottles) + " of beer.");
  console.log("Take one down, pass it around,");
  numberOfBottles--;
  console.log(bottleText(numberOfBottles) + " of beer on the wall.");
  console.log("");
}

console.log("No more bottles of beer on the wall, no more bottles of beer.");
console.log("Go to the store and buy some more, 99 bottles of beer on the wall.");
` },
  quiz:[
    { q:'After <code>numberOfBottles--</code>, why work the word out again before the last line of the verse?', options:['The count has changed, so the right word may have changed too — 2 becomes 1 and needs "bottle"','To slow the loop down','Strings can only be used once','It is not needed'], answer:0, why:'A value calculated before the decrement describes the old count. Reusing it is the stale-variable trap.' },
    { q:'What does changing <code>while (numberOfBottles &gt; 0)</code> to <code>&gt;= 0</code> do?', options:['Nothing','It adds one extra verse, for 0 bottles (ending at −1)','It makes the loop infinite','It skips the first verse'], answer:1, why:'0 now passes the test, so the body runs once more and counts down to −1 before the condition fails.' },
  ],
  notes:`
    <p>The challenge is judged on the output, not on matching one exact program: any loop that prints the whole song correctly counts. If you compare your output with the course's posted listing, trust the logic over the listing — its <i>bottle</i>/<i>bottles</i> check is inverted.</p>`
});


PG.add({
  id:'s15-for', index:110, udemyId:12374074, minutes:6, section:'s15', slug:'for-loops', kind:'js',
  title:'Control Statements: For Loops',
  blurb:'A <code>for</code> loop gathers a counting loop\'s three parts into one header: <code>for (let i = 1; i &lt;= 100; i++)</code> creates the counter once, tests it before every round and updates it after every round. Use it when you know how many rounds you need, and keep <code>while</code> for "until something happens". The lecture converts FizzBuzz from while to for.',
  tasks:[
    'Read this first: as in the while lesson, the editor re-runs your code as you type, and a loop whose update never reaches the end freezes the tab. The starter gives you complete headers; when you write your own, put the update in before you pause.',
    'Trace <code>for (let i = 1; i &lt; 2; i++)</code> in the Explore tab. In what order do the three parts run?',
    'Fill in the body of the first loop so it logs 1 to 5.',
    'Convert FizzBuzz: <code>fizzBuzzFor()</code> already has a complete <code>for (let i = 1; i &lt;= 100; i++)</code> header. Move the if/else chain into it, using <code>i</code> instead of <code>count</code>, and check that both functions print the same 100 items.',
    'At the bottom of the file, write a loop that counts down from 10 to 1 (the update is <code>i--</code>), then one that counts up in twos from 0 to 10 (<code>i += 2</code>).'
  ],
  files:{ 'script.js':`// 1. Log 1 to 5: the header is complete, fill in the body
for (let i = 1; i <= 5; i++) {
  // TODO: log i
}


// 2. FizzBuzz — the while version from lecture 108...
const output = [];
let count = 1;

function fizzBuzz() {
  while (count <= 100) {
    if (count % 3 === 0 && count % 5 === 0) {
      output.push("FizzBuzz");
    } else if (count % 3 === 0) {
      output.push("Fizz");
    } else if (count % 5 === 0) {
      output.push("Buzz");
    } else {
      output.push(count);
    }
    count++;
  }
  console.log(output.join(", "));
}
fizzBuzz();

// ...and the for version: move the chain in here, using i instead of count
const outputFor = [];

function fizzBuzzFor() {
  for (let i = 1; i <= 100; i++) {
    // TODO: the same if / else if chain, pushing onto outputFor
  }
  console.log(outputFor.join(", "));
}
fizzBuzzFor();


// 3. TODO: count down from 10 to 1, then count up in twos from 0 to 10.
//    Write each header in one go, update included, before you pause.

` },
  solution:{ 'script.js':`// 1. setup ; test ; update — all in the header
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// 2. FizzBuzz — the while version...
const output = [];
let count = 1;

function fizzBuzz() {
  while (count <= 100) {
    if (count % 3 === 0 && count % 5 === 0) {
      output.push("FizzBuzz");
    } else if (count % 3 === 0) {
      output.push("Fizz");
    } else if (count % 5 === 0) {
      output.push("Buzz");
    } else {
      output.push(count);
    }
    count++;
  }
  console.log(output.join(", "));
}
fizzBuzz();

// ...and the for version: the counter, the test and the update all live in the header
const outputFor = [];

function fizzBuzzFor() {
  for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      outputFor.push("FizzBuzz");
    } else if (i % 3 === 0) {
      outputFor.push("Fizz");
    } else if (i % 5 === 0) {
      outputFor.push("Buzz");
    } else {
      outputFor.push(i);
    }
  }
  console.log(outputFor.join(", "));
}
fizzBuzzFor();
console.log("Same result: " + (output.join() === outputFor.join()));

// 3. counting down, and counting in twos
for (let i = 10; i >= 1; i--) {
  console.log(i);
}
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}

// extra: for...of walks an array without an index
const guests = ["Angela", "Ben", "Jenny"];
for (const guest of guests) {
  console.log("Hello " + guest);
}
` },
  explore:[{
    title:'Step through a for loop', height:340,
    note:'Press <b>Step</b> and watch which part of the header runs when. The update only runs after the body — and picking <code>i--</code> shows what happens when the update moves the wrong way.',
    html:`
<div class="knobs">
  <label>for (let i = <input type="number" id="st" value="1" style="width:52px">;</label>
  <label>i &lt; <input type="number" id="lim" value="4" style="width:52px">;</label>
  <label><select id="upd"><option value="1">i++</option><option value="2">i += 2</option><option value="-1">i--</option></select> )</label>
  <button id="step">Step ▶</button>
  <button id="reset">Reset</button>
</div>
<div style="display:flex;gap:12px;align-items:flex-start">
  <pre class="readout" id="code" style="flex:1;margin:0"></pre>
  <pre class="readout" id="state" style="flex:1;margin:0;white-space:pre-wrap"></pre>
</div>
<script>
  var st = document.getElementById('st'), lim = document.getElementById('lim'), upd = document.getElementById('upd');
  var code = document.getElementById('code'), state = document.getElementById('state');
  var phase, i, out, rounds, frozen;
  function esc(s){ return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function mark(text, on){ return on ? '<span style="background:#2b3a55;color:#fff">' + esc(text) + '</span>' : esc(text); }
  function updText(){ return upd.value === '1' ? 'i++' : (upd.value === '2' ? 'i += 2' : 'i--'); }
  function paint(msg){
    code.innerHTML = 'for (' + mark('let i = ' + st.value, phase === 'init') + '; ' + mark('i < ' + lim.value, phase === 'test') + '; ' + mark(updText(), phase === 'update') + ') {\\n' +
      mark('  console.log(i);', phase === 'body') + '\\n}\\n' + mark('console.log("done");', phase === 'after');
    state.textContent = 'i = ' + (i === null ? '(not created yet)' : i) + '\\nconsole: ' + (out.length ? out.join(', ') : '(nothing yet)') + '\\n\\n' + msg;
  }
  function reset(){ phase = 'start'; i = null; out = []; rounds = 0; frozen = false; paint('Press Step to run the first part.'); }
  function step(){
    if (frozen || phase === 'after') return;
    var L = +lim.value, msg;
    if (phase === 'start') { i = +st.value; phase = 'init'; msg = 'The first part runs once, before anything else: i is created with the value ' + i + '.'; }
    else if (phase === 'init' || phase === 'update') {
      phase = 'test';
      var ok = i < L;
      msg = 'The test runs before every round: ' + i + ' < ' + L + ' is ' + ok + (ok ? ', so the body runs.' : ', so the loop ends.');
      if (ok && rounds >= 4 && upd.value === '-1') { frozen = true; msg += '\\n\\ni-- moves i away from ' + L + ', so this test will never be false. A real page would freeze right here.'; }
    }
    else if (phase === 'test') {
      if (i < L) { phase = 'body'; out.push(String(i)); rounds++; msg = 'The body runs: console.log(i) prints ' + i + '.'; }
      else { phase = 'after'; out.push('done'); msg = 'Past the loop: console.log("done") runs. Finished after ' + rounds + ' round' + (rounds === 1 ? '' : 's') + '.'; }
    }
    else if (phase === 'body') {
      if (upd.value === '1') i++; else if (upd.value === '2') i += 2; else i--;
      phase = 'update';
      msg = 'Only now, after the body, the update runs: i becomes ' + i + '. Then back to the test.';
    }
    paint(msg);
  }
  document.getElementById('step').addEventListener('click', step);
  document.getElementById('reset').addEventListener('click', reset);
  [st, lim, upd].forEach(function(el){ el.addEventListener('change', reset); el.addEventListener('input', reset); });
  reset();
<\/script>`
  }],
  quiz:[
    { q:'In <code>for (let i = 0; i &lt; 3; i++)</code>, when does <code>i++</code> run?', options:['Before the first round','After each round of the body','Only once','Before every test, including the first'], answer:1, why:'The update sits in the header but runs at the closing brace, after each pass through the body.' },
    { q:'How many times does the body of <code>for (let i = 1; i &lt;= 100; i++)</code> run?', options:['99','100','101','for ever'], answer:1, why:'i takes every value from 1 to 100 inclusive, then 101 fails the test.' },
    { q:'When is a <code>while</code> loop the better choice?', options:['When you know exactly how many rounds you need','When you repeat until something changes and cannot know the number of rounds in advance','Never — for can always replace it','Only for arrays'], answer:1, why:'Either loop can express the other, but while reads best for "keep going until…" and for reads best for counting.' },
  ],
  notes:`
    <h3>The three parts</h3>
    <pre>for (let i = 0; i &lt; 5; i++) { }
//   |          |      |
//   setup      test   update
//   once       before after
//              each   each
//              round  round</pre>
    <p>A for loop is a rearranged while loop: the counter's creation, the exit test and the change all sit in one place, so none of them can be forgotten. The parts are separated by semicolons, not commas.</p>
    <h3>Which loop when</h3>
    <table>
      <tr><th>Loop</th><th>Use for</th></tr>
      <tr><td><code>for</code></td><td>A known number of rounds, or when you need the index</td></tr>
      <tr><td><code>for...of</code></td><td>Every item in an array when the index is not needed</td></tr>
      <tr><td><code>while</code></td><td>An unknown number of rounds</td></tr>
    </table>
    <p>If an endless loop ever freezes the tab, the recovery steps are in the Notes of lecture 108; this lesson's saved code is stored as <code>wdplay:code:s15-for</code>.</p>`
});


PG.add({
  id:'s15-fibonacci', index:111, udemyId:18143224, minutes:7, section:'s15', slug:'fibonacci', kind:'js',
  title:'Introducing the Fibonacci Code Challenge',
  blurb:'Write <code>fibonacciGenerator(n)</code>: it returns an array of the first <code>n</code> Fibonacci numbers, where each number is the sum of the two before it — <code>[0, 1, 1, 2, 3, 5, 8, 13…]</code>. The course\'s version always starts with 0 and 1, and the lecture plans the logic as a flowchart before any code.',
  tasks:[
    'Plan first: if <code>n</code> is 1 the answer is <code>[0]</code>; if it is 2, <code>[0, 1]</code>; otherwise start from <code>[0, 1]</code> and keep adding the last two numbers until the array holds <code>n</code> items.',
    'Write it with the two small cases first, then a loop for the rest. (As in every loop lesson here: finish the loop header, update included, before you pause.)',
    '<b>Return</b> the array — no alert, no prompt. Udemy\'s checker calls your function and inspects what comes back.',
    'Check the four test lines, then try <code>n = 245</code>. The numbers become enormous, and past about the 79th JavaScript starts rounding them.',
    'Extra: what should <code>fibonacciGenerator(0)</code> return? Make it <code>[]</code>.'
  ],
  files:{ 'script.js':`function fibonacciGenerator(n) {
  // Do not change the line above 👆

  // TODO: return an array with the first n Fibonacci numbers, starting from 0:
  //   n = 1  →  [0]
  //   n = 2  →  [0, 1]
  //   n = 5  →  [0, 1, 1, 2, 3]

  // Do not change the line below 👇
}

// The checks: each array is printed on one line
console.log("n = 1  → [" + fibonacciGenerator(1) + "]");
console.log("n = 2  → [" + fibonacciGenerator(2) + "]");
console.log("n = 5  → [" + fibonacciGenerator(5) + "]");
console.log("n = 10 → [" + fibonacciGenerator(10) + "]");
` },
  solution:{ 'script.js':`function fibonacciGenerator(n) {
  if (n <= 0) {
    return [];
  }
  if (n === 1) {
    return [0];
  }

  const output = [0, 1];
  for (let i = 2; i < n; i++) {
    output.push(output[i - 1] + output[i - 2]);   // the two numbers before position i
  }
  return output;
}

console.log("n = 1  → [" + fibonacciGenerator(1) + "]");
console.log("n = 2  → [" + fibonacciGenerator(2) + "]");
console.log("n = 5  → [" + fibonacciGenerator(5) + "]");
console.log("n = 10 → [" + fibonacciGenerator(10) + "]");
console.log("n = 0  → [" + fibonacciGenerator(0) + "]");

// walking through n = 5:
//   start          [0, 1]
//   i = 2: 0 + 1   [0, 1, 1]
//   i = 3: 1 + 1   [0, 1, 1, 2]
//   i = 4: 1 + 2   [0, 1, 1, 2, 3]
//   i = 5: 5 < 5 is false, so the loop stops with 5 items

const big = fibonacciGenerator(245);
console.log("Item 245: " + big[244]);   // about 4.4e+50 — far beyond exact whole numbers
` },
  quiz:[
    { q:'What should <code>fibonacciGenerator(5)</code> return?', options:['[1, 1, 2, 3, 5]','[0, 1, 1, 2, 3]','[0, 1, 2, 3, 5]','5'], answer:1, why:'Five items, starting from 0 and 1, each later one the sum of the two before it.' },
    { q:'Each new number in the sequence is…', options:['double the one before','the sum of the two before it','the one before plus 1','its position squared'], answer:1, why:'0 + 1 = 1, 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, and so on.' },
    { q:'Why must the function <code>return</code> the array rather than log it?', options:['console.log cannot print arrays','The checker calls your function and inspects the value it gets back','return is faster','Arrays cannot be logged'], answer:1, why:'A logged array is only visible to a person; a returned one can be tested, stored and reused by other code.' },
  ],
  notes:`
    <h3>Edge cases first</h3>
    <p>The loop only works once there are two numbers to add. Dealing with the smallest inputs up front is what keeps the main loop simple, so make "what are the smallest possible inputs?" a habit before you write the interesting part.</p>
    <h3>Why the loop starts at 2</h3>
    <p>Positions 0 and 1 are already filled. From position 2 onwards every entry has two predecessors to add.</p>
    <p>If an endless loop ever freezes the tab, the recovery steps are in the Notes of lecture 108; this lesson's saved code is stored as <code>wdplay:code:s15-fibonacci</code>.</p>`
});


PG.add({
  id:'l112', index:112, udemyId:18143228, minutes:8, section:'s15', slug:'fibonacci-solution', kind:'js',
  title:'Fibonacci Solution',
  blurb:'The flowchart becomes code in stages: base cases with <code>if / else if</code>, then one hand-written sum, then positions that adapt to any length — <code>output.length - 1</code> and <code>output.length - 2</code> are always the last two items — and finally a <code>for</code> loop starting at 2 that replaces the repetition.',
  tasks:[
    'Run it for the four test values.',
    'Step through n = 5 in the Explore tab. Which positions do <code>output.length - 1</code> and <code>output.length - 2</code> point at in each round?',
    'Change <code>i &lt; n</code> to <code>i &lt;= n</code> and count the items you get back.',
    'Trap: log <code>fibonacciGenerator(0)</code>. It returns <code>[0, 1]</code> — why? Add a first check so that 0 gives <code>[]</code>.'
  ],
  files:{ 'script.js':`function fibonacciGenerator(n) {
  let output = [];
  if (n === 1) {
    output = [0];
  } else if (n === 2) {
    output = [0, 1];
  } else {
    output = [0, 1];
    for (let i = 2; i < n; i++) {
      // the last two items, wherever the end of the array happens to be now
      output.push(output[output.length - 1] + output[output.length - 2]);
    }
  }
  return output;
}

console.log("n = 1  → [" + fibonacciGenerator(1) + "]");
console.log("n = 2  → [" + fibonacciGenerator(2) + "]");
console.log("n = 5  → [" + fibonacciGenerator(5) + "]");
console.log("n = 10 → [" + fibonacciGenerator(10) + "]");
` },
  solution:{ 'script.js':`function fibonacciGenerator(n) {
  let output = [];
  if (n <= 0) {
    output = [];                // the guard the lecture's version is missing
  } else if (n === 1) {
    output = [0];
  } else if (n === 2) {
    output = [0, 1];
  } else {
    output = [0, 1];
    for (let i = 2; i < n; i++) {
      // the last two items, wherever the end of the array happens to be now
      output.push(output[output.length - 1] + output[output.length - 2]);
    }
  }
  return output;
}

console.log("n = 1  → [" + fibonacciGenerator(1) + "]");
console.log("n = 2  → [" + fibonacciGenerator(2) + "]");
console.log("n = 5  → [" + fibonacciGenerator(5) + "]");
console.log("n = 10 → [" + fibonacciGenerator(10) + "]");
console.log("n = 0  → [" + fibonacciGenerator(0) + "]");

// another route that also works: one loop that fills positions 0 and 1 itself
function fibonacciOneLoop(n) {
  const sequence = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      sequence.push(0);
    } else if (i === 1) {
      sequence.push(1);
    } else {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
  }
  return sequence;
}
console.log("one loop, n = 10 → [" + fibonacciOneLoop(10) + "]");
` },
  explore:[{
    title:'Watch the array grow', height:360,
    note:'Choose n and press <b>Next round</b>. Blue boxes are the two items being added; the green one is the new item pushed onto the end.',
    html:`
<div class="knobs">
  <label>n <input type="number" id="n" value="7" min="1" max="20" style="width:60px"></label>
  <button id="step">Next round ▶</button>
  <button id="reset">Reset</button>
</div>
<div class="stage" id="arr" style="display:flex;gap:6px;flex-wrap:wrap;min-height:70px"></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
<script>
  var N = document.getElementById('n'), arr = document.getElementById('arr'), ro = document.getElementById('ro');
  var output, i, done, hi;
  function paint(msg){
    arr.innerHTML = output.map(function(v, k){
      var isNew = hi.length === 2 && k === output.length - 1, used = hi.indexOf(k) !== -1;
      return '<div style="text-align:center"><div style="min-width:42px;padding:10px 8px;border-radius:8px;font:700 15px ui-monospace,Menlo,monospace;border:2px solid ' +
        (isNew ? '#7ee0a8' : used ? '#5b9cff' : '#dfe3ee') + ';background:' + (isNew ? '#e8f8ef' : used ? '#eaf2ff' : '#fff') + '">' + v + '</div>' +
        '<div style="font:11px ui-monospace,Menlo,monospace;color:#5b6382;margin-top:3px">[' + k + ']</div></div>';
    }).join('');
    ro.textContent = msg;
  }
  function size(){ return Math.max(1, Math.min(20, parseInt(N.value, 10) || 1)); }
  function reset(){
    var n = size();
    hi = []; i = 2; done = false;
    if (n === 1) { output = [0]; done = true; paint('n is 1: the first branch sets output to [0] and returns it. No loop needed.'); return; }
    output = [0, 1];
    if (n === 2) { done = true; paint('n is 2: output is [0, 1] and is returned straight away.'); return; }
    paint('output starts as [0, 1]. The loop starts at i = 2 because positions 0 and 1 are already filled. Press Next round.');
  }
  function step(){
    var n = size();
    if (done) return;
    if (i < n) {
      var len = output.length, a = output[len - 1], b = output[len - 2];
      hi = [len - 1, len - 2];
      output.push(a + b);
      paint('Round i = ' + i + ' (the test ' + i + ' < ' + n + ' is true). output.length is ' + len + ', so\\n' +
        '  output[output.length - 1] is position ' + (len - 1) + ' → ' + a + '\\n' +
        '  output[output.length - 2] is position ' + (len - 2) + ' → ' + b + '\\n' +
        'push(' + a + ' + ' + b + ') adds ' + (a + b) + ' at position ' + len + '.');
      i++;
    } else {
      done = true; hi = [];
      paint('The test ' + i + ' < ' + n + ' is false, so the loop stops. return output: ' + output.length + ' items, [' + output.join(', ') + '].');
    }
  }
  document.getElementById('step').addEventListener('click', step);
  document.getElementById('reset').addEventListener('click', reset);
  N.addEventListener('change', reset);
  reset();
<\/script>`
  }],
  quiz:[
    { q:'When <code>output</code> holds 4 items, which positions do <code>output.length - 1</code> and <code>output.length - 2</code> point at?', options:['4 and 3','3 and 2','1 and 0','4 and 2'], answer:1, why:'Positions run 0 to 3, so the last is 3 and the one before it is 2.' },
    { q:'Why does the loop start at <code>i = 2</code>?', options:['Positions 0 and 1 are already filled with 0 and 1','JavaScript arrays start at 2','To skip the first number','It is a typo'], answer:0, why:'The first two numbers are given; everything from position 2 onwards is built from the two before it.' },
    { q:'What does the lecture\'s version return for <code>n = 0</code>?', options:['[]','[0]','[0, 1]','undefined'], answer:2, why:'0 is neither 1 nor 2, so it falls into the else branch, which starts from [0, 1]; the loop test 2 < 0 is false at once.' },
  ],
});


PG.add({
  id:'l113', index:113, udemyId:17966864, minutes:3, section:'s15', slug:'retrieval-is-how-you-learn', kind:'read',
  title:'Tip from Angela - Retrieval is How You Learn',
  blurb:'Following a video and solving a problem alone are different skills: watching lets you <i>recognise</i> code, but writing it means <i>recalling</i> it, and only practice builds that. Pause before each demonstration and try it first, invent variations of the exercises, and test yourself — the two questions below are a start.',
  quiz:[
    { q:'Retrieval practice — no scrolling back: which expression gives a random whole number from 1 to 10?', options:['Math.random() * 10','Math.floor(Math.random() * 10) + 1','Math.round(Math.random() * 10)','Math.floor(Math.random() * 11)'], answer:1, why:'Scale by how many values you want (10), round down to get 0–9, then add the lowest value (1).' },
    { q:'Retrieval practice: which loop fits "keep rolling until you get a six"?', options:['for, because it counts','while, because the number of rounds is not known in advance','No loop is needed','for...of'], answer:1, why:'while repeats for as long as a condition holds; for suits a known number of rounds.' },
  ],
});
