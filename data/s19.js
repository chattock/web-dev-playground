/* ===== Section 19 — jQuery ===== */
/* Build lessons load jQuery from the Google CDN, as the course does (the
   engine injects a vendored copy as an offline fallback). Explore demos load
   vendor/jquery/jquery.min.js directly. */

(function () {

const CDN = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
const BUTTONS = '  <button>Click Me</button>\n'.repeat(5);

// A course-style page: jQuery from the CDN at the end of <body>, then script.js
function page(title, body, opt) {
  opt = opt || {};
  const css = opt.css ? '\n  <link rel="stylesheet" href="style.css">' : '';
  const jq = opt.jquery === false ? (opt.jqueryTodo || '') : `  <script src="${CDN}"><\/script>\n`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>${css}
</head>
<body>
${body}
${jq}  <script src="script.js"><\/script>
</body>
</html>
`;
}

const BIG_TITLE_CSS = `/* playground addition: a dark page so the yellow title is readable */
body {
  background-color: #22262e;
  color: #eeeeee;
  font-family: sans-serif;
}

.big-title {
  font-size: 5rem;
  color: yellow;
  font-family: cursive;
}

.margin-50 {
  margin: 50px;
}
`;


/* ------------------------------------------------------------------ 149 */
PG.add({
  id:'l149', index:149, udemyId:12384172, minutes:4, section:'s19', slug:'what-is-jquery', kind:'build',
  title:'What is jQuery?',
  blurb:'jQuery is a <b>library</b>: a file of JavaScript that someone else wrote, which you load into your page so your own code can be shorter. Its central function is <code>jQuery()</code>, nearly always written with its nickname <code>$()</code>. Hand it a CSS selector and it collects every matching element, and whatever you call on that collection happens to all of them.',
  tasks:[
    'Click any button in the preview. The plain JavaScript in <code>script.js</code> turns the heading red, and it needs a query, a loop, a listener and a second query to do so.',
    'Switch that block off by putting <code>/*</code> before it and <code>*/</code> after it. The buttons stop working.',
    'Underneath, write the jQuery version: <code>$("button").click(function () { $("h1").css("color", "red"); });</code> and click a button again.',
    'Log <code>jQuery === $</code> to confirm that the two names refer to one and the same function.',
    'Change <code>"red"</code> in your jQuery line to another colour, so you can see it is the new code doing the work.'
  ],
  files:{
'index.html': page('What is jQuery?', '  <h1>Hello</h1>\n\n' + BUTTONS),
'script.js':`// Plain JavaScript: every button turns the h1 red when clicked
var buttons = document.querySelectorAll("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    document.querySelector("h1").style.color = "red";
  });
}

// TODO 1: switch the code above off with /* ... */, then write the same
//         behaviour with jQuery: select the buttons with $("button"), give
//         them a .click(...) handler, and colour the h1 with $("h1").css(...)


// TODO 2: log whether jQuery and $ are the same function

`},
  solution:{
'script.js':`// The plain JavaScript version, switched off:
/*
var buttons = document.querySelectorAll("button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    document.querySelector("h1").style.color = "red";
  });
}
*/

// The same behaviour with jQuery: one selection holds all five buttons
$("button").click(function () {
  $("h1").css("color", "red");
});

// $ is only a nickname for jQuery
console.log(jQuery === $);   // true
`},
  quiz:[
    { q:'What is a JavaScript library such as jQuery?', options:['A new programming language','Code written by someone else that you include in your project and call','A feature built into every browser','A CSS framework'], answer:1, why:'A library is ordinary JavaScript packaged for reuse. Loading it gives your code extra functions to call, just as Bootstrap gave you ready-made CSS classes.' },
    { q:'Which expression does exactly the same as <code>$("h1")</code>?', options:['<code>document.getElementById("h1")</code>','<code>jQuery("h1")</code>','<code>$.h1</code>','<code>new h1()</code>'], answer:1, why:'$ is an alias for the jQuery function, so both calls run the same code with the same selector.' },
    { q:'Why does the jQuery version need no <code>for</code> loop?', options:['jQuery only ever selects the first button','A jQuery selection holds every match, and methods called on it apply to each one','The buttons share an id','jQuery attaches one listener to the whole page instead'], answer:1, why:'$("button") returns a collection of all five buttons; .click() then registers the handler on every element in it.' },
  ],
});


/* ------------------------------------------------------------------ 150 */
PG.add({
  id:'l150', index:150, udemyId:12384174, minutes:9, section:'s19', slug:'incorporate-jquery', kind:'build',
  title:'How to Incorporate jQuery into Websites',
  blurb:'Before <code>$</code> means anything, the browser has to load jQuery itself, usually with one <code>&lt;script&gt;</code> tag pointing at a CDN copy (Google Hosted Libraries in the course). Order matters: the browser runs script tags from top to bottom, so the jQuery tag must come before any script of yours that uses it. Scripts at the end of <code>&lt;body&gt;</code> also guarantee the elements exist; code that sits in the <code>&lt;head&gt;</code> needs wrapping in <code>$(document).ready()</code>.',
  tasks:[
    'In <code>script.js</code> write <code>$("h1").css("color", "red");</code>. The console reports <b>ReferenceError: $ is not defined</b>, because the page has not loaded jQuery yet.',
    'In <code>index.html</code>, paste <code>&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"&gt;&lt;/script&gt;</code> at the TODO, above the tag for your own script. The error disappears and the heading turns red.',
    'Colour the <code>h2</code> blue using the full name of the function: <code>jQuery("h2").css("color", "blue");</code>.',
    'Open the <b>Explore</b> tab and try every script order in the lab: jQuery after your script, both scripts in the head, and the head with <code>$(document).ready()</code>.'
  ],
  notes:'<p>In this playground the Script tab is always added at the very end of the page, so moving tags around in <code>index.html</code> cannot reproduce the ordering bugs from the video. The script-order lab in the Explore tab builds real pages for each arrangement and shows what the console says.</p>',
  files:{
'index.html': page('jQuery', '  <h1>Hello</h1>\n  <h2>World</h2>\n\n' + BUTTONS, { jquery:false,
  jqueryTodo:'  <!-- TODO 2: paste the jQuery CDN script tag on the next line, above your own script -->\n\n' }),
'script.js':`// TODO 1: turn the h1 red with jQuery, then read the console:
//         $("h1").css("color", "red");


// TODO 3: colour the h2 blue, this time with the long name jQuery("h2")

`},
  solution:{
'index.html': page('jQuery', '  <h1>Hello</h1>\n  <h2>World</h2>\n\n' + BUTTONS),
'script.js':`$("h1").css("color", "red");

// jQuery(...) is the full name of $(...)
jQuery("h2").css("color", "blue");

// Only needed when the script tags sit in the <head>, before the page exists:
// $(document).ready(function () {
//   $("h1").css("color", "red");
// });
`},
  explore:[{
    title:'Script order lab', height:470,
    note:'Each option builds a real page with the script tags in a different place and reports what happened. Only two arrangements turn the heading red.',
    html:`
<div class="knobs">
  <label>where the script tags are
    <select id="order">
      <option value="good">end of body: jQuery, then index.js</option>
      <option value="swap">end of body: index.js, then jQuery</option>
      <option value="none">end of body: index.js only, no jQuery</option>
      <option value="head">both in the head</option>
      <option value="ready">both in the head, code inside $(document).ready()</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start">
  <div style="flex:1;min-width:200px"><h4>the page</h4>
    <iframe id="pv" style="width:100%;height:96px;border:1px solid #dfe3ee;border-radius:8px;background:#fff"></iframe></div>
  <div style="flex:1.5;min-width:280px"><h4>index.html and index.js</h4>
    <pre class="readout" id="src" style="margin:0;font-size:11.5px"></pre></div>
</div>
<pre class="readout" id="log"></pre>
<script>
(function(){
  var JQ = new URL('vendor/jquery/jquery.min.js', document.baseURI).href;
  var CDN = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
  var PLAIN = '$("h1").css("color", "red");';
  var READY = '$(document).ready(function () {\\n  $("h1").css("color", "red");\\n});';
  var WHY = {
    good: 'jQuery runs first and defines $. Then index.js runs, and the h1 is already on the page.',
    swap: 'index.js runs before the library has been loaded, so $ does not exist yet.',
    none: 'Nothing ever defines $, so the first line of index.js fails.',
    head: 'No error, yet nothing changed: the code ran inside the head, before the browser had built the h1, so $("h1") matched nothing at all.',
    ready: 'ready() holds the code back until the browser has read the whole document, so the h1 exists by the time it runs.'
  };
  var sel = document.getElementById('order'), pv = document.getElementById('pv'), errors = [];
  function build(o){
    var code = o === 'ready' ? READY : PLAIN;
    var jq = '<script src="' + JQ + '"><\\/script>', mine = '<script>' + code + '<\\/script>';
    var trap = '<script>window.onerror=function(m){parent.postMessage({lab:1,err:String(m)},"*");};<\\/script>';
    var report = '<script>setTimeout(function(){var h=document.querySelector("h1");parent.postMessage({lab:1,done:1,color:getComputedStyle(h).color},"*");},400);<\\/script>';
    var head = trap, tail = '';
    if (o === 'good') tail = jq + mine;
    else if (o === 'swap') tail = mine + jq;
    else if (o === 'none') tail = mine;
    else head += jq + mine;
    return '<!DOCTYPE html><html><head>' + head + '</head><body style="font-family:sans-serif;margin:12px"><h1 style="margin:0">Hello</h1>' + tail + report + '</body></html>';
  }
  function shown(o){
    var jq = '    <script src="' + CDN + '"><\\/script>', mine = '    <script src="index.js"><\\/script>';
    var l = ['<html>', '  <head>'];
    if (o === 'head' || o === 'ready') l.push(jq, mine);
    l.push('  </head>', '  <body>', '    <h1>Hello</h1>');
    if (o === 'good') l.push(jq, mine);
    if (o === 'swap') l.push(mine, jq);
    if (o === 'none') l.push(mine);
    l.push('  </body>', '</html>', '', '// index.js', o === 'ready' ? READY : PLAIN);
    return l.join('\\n');
  }
  window.addEventListener('message', function(e){
    if (e.source !== pv.contentWindow || !e.data || !e.data.lab) return;
    if (e.data.err) errors.push(e.data.err);
    if (e.data.done) {
      var red = e.data.color === 'rgb(255, 0, 0)';
      document.getElementById('log').textContent =
        (errors.length ? '✗ console: ' + errors.join(' | ') : red ? '✓ the heading is red' : '✗ no error, but the heading is still black') +
        '\\n\\n' + WHY[sel.value];
    }
  });
  function run(){
    errors = [];
    document.getElementById('log').textContent = 'loading…';
    document.getElementById('src').textContent = shown(sel.value);
    pv.srcdoc = build(sel.value);
  }
  sel.addEventListener('change', run); run();
})();
<\/script>`
  }],
  quiz:[
    { q:'The console says <b>$ is not defined</b>. What is the most likely cause?', options:['jQuery was loaded twice','The jQuery library had not been loaded when your code ran','The page has no h1','You used single quotes'], answer:1, why:'$ only exists after the jQuery file has run. A missing tag, or a tag placed after your own script, leaves it undefined.' },
    { q:'At the end of <code>&lt;body&gt;</code>, which order works?', options:['Your script, then jQuery','jQuery, then your script','Either order','jQuery has to go in a separate HTML file'], answer:1, why:'Script tags run top to bottom, so the library has to be loaded before the code that calls it.' },
    { q:'With both scripts in the head and jQuery first, why can nothing happen, without any error?', options:['Scripts in the head are ignored','The code runs before the body is parsed, so $("h1") matches no elements','Browsers block CDNs in the head','$ is renamed in the head'], answer:1, why:'Selecting nothing is not an error in jQuery; the selection is simply empty. $(document).ready() or scripts at the end of body fix it.' },
    { q:'What is the speed benefit of loading jQuery from a popular CDN?', options:['The file is smaller than a downloaded copy','The visitor may already have that exact file cached from another site','It updates jQuery for you','It works without an internet connection'], answer:1, why:'Browsers cache files by URL. If another site already used the same CDN URL, the browser can skip the download.' },
  ],
});


/* ------------------------------------------------------------------ 151 */
PG.add({
  id:'l151', index:151, udemyId:12384184, minutes:4, section:'s19', slug:'minification', kind:'read',
  title:'How Minification Works to Reduce File Size',
  blurb:'Open <code>jquery.min.js</code> and you get one dense wall of characters. That is the <b>minified</b> build: the same program with the spaces, line breaks and comments taken out (real minifiers also shorten local variable names). Browsers do not need any of that, so the smaller file simply downloads faster. Libraries ship a readable version for people and a <code>.min</code> version for browsers.',
  links:[
    { title:'minifier.org', url:'https://www.minifier.org/', note:'the online minifier used in the video' },
    { title:'Download jQuery', url:'https://jquery.com/download/', note:'offers both the compressed (minified) and uncompressed builds' },
  ],
  explore:[{
    title:'Minify it yourself', height:470,
    note:'Edit the readable code on the left and watch the byte count. This is a simplified minifier: it keeps every semicolon you wrote, so leave them in.',
    html:`
<div class="stage" style="display:flex;gap:14px;flex-wrap:wrap">
  <div style="flex:1;min-width:260px">
    <h4>readable source</h4>
    <textarea id="src" spellcheck="false" style="width:100%;height:240px;font-family:ui-monospace,Menlo,monospace;font-size:12px;border:1px solid #cfd5e6;border-radius:8px;padding:8px">// Play a sound for each drum button
var buttons = document.querySelectorAll(".drum");

for (var i = 0; i < buttons.length; i++) {
  /* every button gets the same click handler */
  buttons[i].addEventListener("click", function () {
    var key = this.innerHTML;   // the letter on the button
    playSound(key);
  });
}

function playSound(key) {
  var audio = new Audio("sounds/" + key + ".mp3");
  audio.play();
}</textarea>
  </div>
  <div style="flex:1;min-width:260px">
    <h4>minified</h4>
    <pre class="readout" id="out" style="white-space:pre-wrap;word-break:break-all;height:240px;overflow:auto;margin:0"></pre>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
(function(){
  var src = document.getElementById('src'), out = document.getElementById('out'), ro = document.getElementById('ro');
  function isWord(c){ return /[A-Za-z0-9_$]/.test(c); }
  function minify(s){
    var o = '', i = 0, n = s.length, gap = false;
    function emit(t){ if (gap && o && isWord(o[o.length - 1]) && isWord(t[0])) o += ' '; gap = false; o += t; }
    while (i < n) {
      var c = s[i], d = s[i + 1];
      if (c === '/' && d === '/') { while (i < n && s[i] !== '\\n') i++; gap = true; continue; }
      if (c === '/' && d === '*') { var e = s.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; gap = true; continue; }
      if (c === '"' || c === "'") { var j = i + 1; while (j < n && s[j] !== c) { if (s[j] === '\\\\') j++; j++; } emit(s.slice(i, j + 1)); i = j + 1; continue; }
      if (/\\s/.test(c)) { gap = true; i++; continue; }
      emit(c); i++;
    }
    return o;
  }
  function bytes(s){ return new Blob([s]).size; }
  function run(){
    var m = minify(src.value), a = bytes(src.value), b = bytes(m);
    out.textContent = m;
    ro.textContent = 'readable: ' + a + ' bytes\\nminified: ' + b + ' bytes\\nsaved:    ' + (a - b) + ' bytes (' + (a ? Math.round((a - b) / a * 100) : 0) + '%)';
  }
  src.addEventListener('input', run); run();
})();
<\/script>`
  }],
  quiz:[
    { q:'What does minifying a JavaScript file remove?', options:['Functions you never call','Whitespace, line breaks and comments (and long local names)','Every variable','The licence and nothing else'], answer:1, why:'The program still does exactly the same thing; only characters the browser does not need are dropped, which makes the download smaller.' },
    { q:'You want to change how a library behaves. Which file do you edit?', options:['The .min.js file, directly','The readable source, then minify it again','Neither: libraries cannot be changed','The copy on the CDN'], answer:1, why:'Minified code is unreadable and has lost its comments. Work on the uncompressed version and produce a fresh .min file from it.' },
  ],
});


/* ------------------------------------------------------------------ 152 */
PG.add({
  id:'l152', index:152, udemyId:12384192, minutes:2, section:'s19', slug:'selecting-elements', kind:'build',
  title:'Selecting Elements with jQuery',
  blurb:'<code>$()</code> takes any CSS selector, so tag, class, id and combined selectors work exactly as in a stylesheet. There is no <code>querySelector</code> versus <code>querySelectorAll</code> choice to make: the result is a jQuery object holding every match, whether that is one element, five, or none at all.',
  tasks:[
    'Log <code>$("h1").length</code> (1 match) and <code>$("h1")[0]</code>, the plain element stored inside the jQuery object.',
    'Log <code>$("button").length</code>: all five buttons come back from a single call. Compare it with <code>document.querySelectorAll("button").length</code>.',
    'Try a class selector, an id selector and a descendant selector: <code>$(".note")</code>, <code>$("#tip")</code>, <code>$("body p")</code>. Log the length of each, and the text of <code>#tip</code> with <code>.text()</code>.',
    'Select something that is not on the page, such as <code>$("h2")</code>. Its length is 0, and there is no error.',
    'The Explore tab has a live selector tester. To inspect a whole jQuery object, open the preview with <b>↗ open</b> and use your browser\'s own DevTools console.'
  ],
  files:{
'index.html': page('Selecting Elements with jQuery', '  <h1>Hello</h1>\n\n' + BUTTONS + '\n  <p class="note" id="tip">Selectors work just like they do in CSS.</p>\n'),
'script.js':`// TODO 1: select the h1 and log how many elements matched (.length)
//         and the plain element stored inside the selection ([0])


// TODO 2: select ALL the buttons with one $() call and log .length,
//         then compare with document.querySelectorAll("button").length


// TODO 3: try ".note", "#tip" and "body p" and log each .length;
//         also log the text of #tip with .text()


// TODO 4: select something that is not on the page, e.g. "h2". What is .length?

`},
  solution:{
'script.js':`console.log($("h1").length);   // 1
console.log($("h1")[0]);       // the plain <h1> element inside the jQuery object

console.log($("button").length);                          // 5: every match at once
console.log(document.querySelectorAll("button").length);  // 5: the vanilla way

console.log($(".note").length);   // class selector: 1
console.log($("#tip").length);    // id selector: 1
console.log($("body p").length);  // descendant selector: 1
console.log($("#tip").text());

console.log($("h2").length);      // 0: an empty selection, not an error
`},
  explore:[{
    title:'Selector tester', height:430,
    note:'Type any CSS selector. Matches inside the sample page are outlined in red, and the readout shows what $() and querySelectorAll() would give you.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<style>.hit{outline:3px solid #ff5c5c;outline-offset:2px;background:#fff1f1;}</style>
<div class="knobs">
  <label>$(" <input type="text" id="sel" value="button" style="width:190px;font-family:ui-monospace,Menlo,monospace"> ")</label>
  <span class="note" style="margin:0">try: h1 · .note · #tip · #header h1 · li:first-child · button.big · p, li</span>
</div>
<div class="stage" id="page">
  <div id="header"><h1 class="title" style="margin:0 0 8px">Hello</h1></div>
  <button>Click Me</button> <button>Click Me</button> <button class="big">Click Me</button>
  <p class="note" id="tip">A paragraph with class "note" and id "tip".</p>
  <ul style="margin:0"><li>one</li><li class="note">two</li><li>three</li></ul>
</div>
<pre class="readout" id="ro"></pre>
<script>
(function(){
  var inp = document.getElementById('sel'), ro = document.getElementById('ro'), pg = document.getElementById('page');
  function run(){
    $(pg).find('.hit').removeClass('hit');
    var s = inp.value.trim();
    if (!s) { ro.textContent = 'Type a CSS selector.'; return; }
    try {
      var m = $(pg).find(s).addClass('hit');
      ro.textContent = '$("' + s + '").length  →  ' + m.length +
        (m.length ? '   (first match: <' + m[0].tagName.toLowerCase() + '>)' : '   (an empty selection, not an error)') +
        '\\ndocument.querySelectorAll("' + s + '")  →  ' + pg.querySelectorAll(s).length + ' element(s)';
    } catch (e) { ro.textContent = 'Not a valid CSS selector yet.'; }
  }
  inp.addEventListener('input', run); run();
})();
<\/script>`
  }],
  quiz:[
    { q:'On a page with five buttons, what does <code>$("button")</code> return?', options:['Only the first button','A jQuery object holding all five','An array of strings','An error, because there is more than one'], answer:1, why:'jQuery always returns a collection; methods you call on it act on every element inside.' },
    { q:'What does <code>$("#header h1")</code> select?', options:['Elements with the class header','h1 elements inside the element whose id is header','An h1 whose id is header','Every h1 plus the #header element'], answer:1, why:'It is an ordinary CSS descendant selector: the h1s found inside #header.' },
    { q:'What is <code>$(".missing").length</code> when nothing has that class?', options:['It throws an error','null','0','undefined'], answer:2, why:'An unmatched selector gives an empty jQuery object, so its length is 0 and calls on it simply do nothing.' },
  ],
});


/* ------------------------------------------------------------------ 153 */
PG.add({
  id:'l153', index:153, udemyId:12384196, minutes:5, section:'s19', slug:'manipulating-styles', kind:'build',
  title:'Manipulating Styles with jQuery',
  blurb:'<code>.css("color", "green")</code> sets a property; <code>.css("color")</code> with a single argument reads it back (colours come back as <code>rgb(...)</code>). The tidier habit is to keep the look in your stylesheet and only switch classes from JavaScript: <code>addClass</code>, <code>removeClass</code> and <code>hasClass</code>.',
  tasks:[
    'Set the heading\'s colour with <code>$("h1").css("color", "green")</code>.',
    'Read values back by logging <code>$("h1").css("color")</code> and <code>$("h1").css("font-size")</code>. Two arguments set, one argument gets.',
    'In <code>style.css</code> create <code>.big-title</code> (font-size 5rem, colour yellow, font-family cursive) and <code>.margin-50</code> (margin 50px).',
    'Add the class with <code>$("h1").addClass("big-title")</code>. The title gets bigger but stays green: the inline style written by <code>.css()</code> beats the class rule. Clear it with <code>$("h1").css("color", "")</code> and the yellow appears. That conflict is exactly why classes are the better tool.',
    'Add both classes in one call with <code>addClass("big-title margin-50")</code> (one string, a space between, no dots), then <code>removeClass("big-title")</code> and log <code>hasClass("margin-50")</code> and <code>hasClass("big-title")</code>.'
  ],
  files:{
'index.html': page('Manipulating Styles with jQuery', '  <h1>Hello</h1>\n', { css:true }),
'style.css':`/* playground addition: a dark page so the yellow title is readable */
body {
  background-color: #22262e;
  color: #eeeeee;
  font-family: sans-serif;
}

/* TODO 3: create two classes
   .big-title  font-size 5rem, colour yellow, font-family cursive
   .margin-50  margin 50px                                         */
`,
'script.js':`// TODO 1: set the h1's colour to green with .css()


// TODO 2: read the values back and log them: the colour and the font-size


// TODO 4: add the big-title class (no dot!). Why does the title stay green?
//         Clear the inline colour with .css("color", "")


// TODO 5: add big-title and margin-50 in ONE call, then remove big-title
//         and log hasClass("margin-50") and hasClass("big-title")

`},
  solution:{
'style.css': BIG_TITLE_CSS,
'script.js':`// Two arguments set a property...
$("h1").css("color", "green");

// ...one argument reads it back
console.log($("h1").css("color"));      // rgb(0, 128, 0)
console.log($("h1").css("font-size"));  // 32px, before any class is added

// An inline style written by .css() beats a class rule, so clear it
// before handing the look over to classes
$("h1").css("color", "");

// The look lives in style.css; jQuery only switches classes on and off
$("h1").addClass("big-title margin-50");
$("h1").removeClass("big-title");

console.log($("h1").hasClass("margin-50"));  // true
console.log($("h1").hasClass("big-title"));  // false
`},
  explore:[{
    title:'Class switcher', height:420,
    note:'Press the buttons in any order and watch the class and style attributes. Try css("color", "green") first and then toggle big-title: the inline colour keeps winning until you clear it.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<style>
  .big-title { font-size: 3.2rem; color: yellow; font-family: cursive; }
  .margin-50 { margin: 50px; }
  #h { margin: 0; }
</style>
<div class="knobs">
  <button data-do="addClass:big-title">addClass("big-title")</button>
  <button data-do="removeClass:big-title">removeClass("big-title")</button>
  <button data-do="toggleClass:big-title">toggleClass("big-title")</button>
  <button data-do="toggleClass:margin-50">toggleClass("margin-50")</button>
  <button data-do="css:green">css("color", "green")</button>
  <button data-do="css:">css("color", "")</button>
</div>
<div class="stage" style="background:#22262e;color:#eee"><h1 id="h">Hello</h1></div>
<pre class="readout" id="ro"></pre>
<script>
(function(){
  var h = $('#h');
  function show(last){
    $('#ro').text((last ? last + '\\n\\n' : '') +
      'class="' + (h.attr('class') || '') + '"\\n' +
      'style="' + (h.attr('style') || '') + '"\\n' +
      '$("h1").css("color")           →  ' + h.css('color') + '\\n' +
      '$("h1").hasClass("big-title")  →  ' + h.hasClass('big-title') + '\\n' +
      '$("h1").hasClass("margin-50")  →  ' + h.hasClass('margin-50'));
  }
  $('[data-do]').on('click', function(){
    var p = $(this).attr('data-do').split(':');
    if (p[0] === 'css') h.css('color', p[1]); else h[p[0]](p[1]);
    show('$("h1").' + $(this).text() + ';');
  });
  show();
})();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>$("h1").css("font-size")</code> do?', options:['Sets the font size to nothing','Returns the current font size, such as "32px"','Removes the font-size property','Throws, because the value is missing'], answer:1, why:'With one argument .css() is a getter; with two it is a setter.' },
    { q:'Which call adds two classes at once?', options:['<code>addClass("big-title", "margin-50")</code>','<code>addClass(".big-title .margin-50")</code>','<code>addClass("big-title margin-50")</code>','<code>addClass("big-title + margin-50")</code>'], answer:2, why:'Class names go in one string separated by spaces, without dots, exactly as they would appear in the class attribute.' },
    { q:'Why prefer <code>addClass</code> over setting styles with <code>.css()</code>?', options:['It runs faster','The look stays in the stylesheet and JavaScript only handles behaviour','.css() cannot set colours','Classes work without jQuery loaded'], answer:1, why:'Keeping appearance in CSS and behaviour in JS (separation of concerns) makes both easier to change, and avoids inline styles overriding your stylesheet.' },
  ],
});


/* ------------------------------------------------------------------ 154 */
PG.add({
  id:'l154', index:154, udemyId:12384208, minutes:4, section:'s19', slug:'manipulating-text', kind:'build',
  title:'Manipulating Text with jQuery',
  blurb:'<code>.text("Bye")</code> replaces an element\'s content with plain text; <code>.html("&lt;em&gt;Bye&lt;/em&gt;")</code> treats the string as markup, like setting <code>innerHTML</code>. Both act on every matched element, and both read the current content back when you call them with no argument.',
  tasks:[
    'Change the heading to <b>Bye</b> with <code>$("h1").text("Bye")</code>.',
    'Now try <code>$("h1").text("&lt;em&gt;Bye&lt;/em&gt;")</code>: the tags appear as visible characters. Switch to <code>.html(...)</code> and the word turns italic.',
    'Change all five buttons with one line: <code>$("button").text("Don\'t Click Me")</code>, then make them italic with <code>.html()</code>.',
    'Read the content back: log <code>$("h1").text()</code> and <code>$("h1").html()</code> and compare the two.'
  ],
  files:{
'index.html': page('Manipulating Text with jQuery', '  <h1>Hello</h1>\n\n' + BUTTONS),
'script.js':`// TODO 1: change the h1's text to "Bye"


// TODO 2: make the h1 say Bye in italics. Try .text() with an <em> tag first, then .html()


// TODO 3: change the text of all five buttons with a single line


// TODO 4: read the h1's content back with .text() and .html() and log both

`},
  solution:{
'script.js':`$("h1").text("Bye");
$("h1").html("<em>Bye</em>");          // the <em> tag becomes real italics

$("button").text("Don't Click Me");    // one line updates all five buttons
$("button").html("<em>Don't Click Me</em>");

console.log($("h1").text());           // Bye
console.log($("h1").html());           // <em>Bye</em>
`},
  explore:[{
    title:'.text() versus .html()', height:330,
    note:'Type any markup into the box. The left heading receives it through .text(), the right one through .html(). This is also why user input should never go into .html(): it would be run as markup.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<div class="knobs"><label>value <input type="text" id="v" value="<em>Bye</em> <b>for now</b>" style="width:300px"></label></div>
<div class="stage" style="display:flex;gap:14px;flex-wrap:wrap">
  <div style="flex:1;min-width:200px"><h4>$("h1").text(value)</h4><h1 id="a" style="margin:0;word-break:break-all"></h1></div>
  <div style="flex:1;min-width:200px"><h4>$("h1").html(value)</h4><h1 id="b" style="margin:0"></h1></div>
</div>
<script>
(function(){
  function upd(){ var v = $('#v').val(); $('#a').text(v); $('#b').html(v); }
  $('#v').on('input', upd); upd();
})();
<\/script>`
  }],
  quiz:[
    { q:'What appears after <code>$("h1").text("&lt;em&gt;Hi&lt;/em&gt;")</code>?', options:['Hi in italics','The characters &lt;em&gt;Hi&lt;/em&gt; exactly as typed','An error','Nothing'], answer:1, why:'.text() never parses markup; it inserts the string as plain characters.' },
    { q:'<code>$("button").text("Stop")</code> on a page with five buttons changes…', options:['the first button only','all five buttons','the last button only','nothing, because a loop is needed'], answer:1, why:'Like every jQuery method, .text(value) applies to every element in the selection.' },
    { q:'Which vanilla JavaScript property is closest to jQuery\'s <code>.html(value)</code>?', options:['textContent','innerHTML','value','outerText'], answer:1, why:'Both parse the string as HTML and replace the element\'s children with the result.' },
  ],
});


/* ------------------------------------------------------------------ 155 */
PG.add({
  id:'l155', index:155, udemyId:12384214, minutes:4, section:'s19', slug:'manipulating-attributes', kind:'build',
  title:'Manipulating Attributes with jQuery',
  blurb:'Attributes are the name and value pairs inside an opening tag: <code>src</code>, <code>href</code>, <code>class</code>. <code>.attr("src")</code> reads one; <code>.attr("href", "https://www.bing.com")</code> writes it. The same rule as <code>.css()</code> applies: one argument gets, two arguments set.',
  tasks:[
    'Log the image\'s current address with <code>$("img").attr("src")</code>. Logging a src like this is a quick way to find out why an image is broken.',
    'Log the link\'s <code>href</code>, change it to <code>https://www.bing.com</code> with two arguments, then log it again to confirm.',
    'Swap the picture by giving the image a new <code>src</code>, for example <code>https://picsum.photos/seed/guitar/320/200</code>.',
    'Log <code>$("h1").attr("class")</code>: class is an attribute too, and you get the whole space-separated list back.'
  ],
  files:{
'index.html': page('Manipulating Attributes with jQuery', '  <h1 class="big-title margin-50">Hello</h1>\n\n  <img src="https://picsum.photos/seed/drum/320/200" alt="A placeholder photo">\n\n  <p><a href="https://www.google.com" target="_blank">Search</a></p>\n', { css:true }),
'style.css': BIG_TITLE_CSS + `
a {
  color: #8ab4ff;
  font-size: 1.4rem;
}
`,
'script.js':`// TODO 1: log the image's src attribute


// TODO 2: log the link's href, change it to https://www.bing.com, log it again


// TODO 3: give the image a different src so a new picture loads


// TODO 4: log the h1's class attribute

`},
  solution:{
'script.js':`console.log($("img").attr("src"));

console.log($("a").attr("href"));            // https://www.google.com
$("a").attr("href", "https://www.bing.com");
console.log($("a").attr("href"));            // https://www.bing.com

$("img").attr("src", "https://picsum.photos/seed/guitar/320/200");

console.log($("h1").attr("class"));          // big-title margin-50
`},
  quiz:[
    { q:'What does <code>$("a").attr("href")</code> return?', options:['Nothing: attr always needs two arguments','The current value of the href attribute','The link text','A new link element'], answer:1, why:'With one argument .attr() is a getter, just like .css() and .text().' },
    { q:'Why is <code>$("h1").attr("class", "big-title")</code> riskier than <code>addClass("big-title")</code>?', options:['attr cannot touch classes','It replaces the whole class list, so any other classes are lost','It is slower','It only works on images'], answer:1, why:'Setting the attribute overwrites its entire value; addClass appends one class and leaves the others alone.' },
  ],
});


/* ------------------------------------------------------------------ 156 */
PG.add({
  id:'l156', index:156, udemyId:12384224, minutes:8, section:'s19', slug:'event-listeners', kind:'build',
  title:'Adding Event Listeners with jQuery',
  blurb:'Shortcut methods such as <code>.click(fn)</code> and <code>.keypress(fn)</code> attach a listener to every element in a selection, so five buttons need no loop. Pass <code>document</code> itself, without quotes, to listen to the whole page. For any event at all, use the general form <code>.on("mouseover", fn)</code>.',
  tasks:[
    'Make the heading turn purple when it is clicked: <code>$("h1").click(function () { ... })</code>.',
    'Give all five buttons the same behaviour with one <code>$("button").click(...)</code>. The vanilla loop in the comments does the same job in far more code.',
    'Log every key typed into the text box: <code>$("input").keypress(function (event) { console.log(event.key); })</code>.',
    'Challenge: show the last key pressed <i>anywhere</i> on the page inside the h1. Listen on <code>$(document)</code> and call <code>$("h1").text(event.key)</code>. Click inside the preview first so it has the keyboard.',
    'Use the general method: <code>$("h1").on("mouseover", ...)</code> to colour the heading blue when the pointer moves over it. The Explore tab lets you try other event names.'
  ],
  files:{
'index.html': page('Adding Event Listeners with jQuery', '  <h1>Hello</h1>\n\n' + BUTTONS + '\n  <input type="text" placeholder="Type in here">\n'),
'script.js':`// For comparison, the vanilla JavaScript way of listening on every button:
// for (var i = 0; i < document.querySelectorAll("button").length; i++) {
//   document.querySelectorAll("button")[i].addEventListener("click", function () {
//     document.querySelector("h1").style.color = "purple";
//   });
// }

// TODO 1: when the h1 is clicked, make it purple


// TODO 2: when ANY button is clicked, make the h1 purple (no loop needed)


// TODO 3: log the key typed into the input box (event.key)


// TODO 4: challenge: show any key pressed on the page inside the h1


// TODO 5: use .on("mouseover", ...) to turn the h1 blue

`},
  solution:{
'script.js':`$("h1").click(function () {
  $("h1").css("color", "purple");
});

// one call attaches the listener to all five buttons
$("button").click(function () {
  $("h1").css("color", "purple");
});

$("input").keypress(function (event) {
  console.log(event.key);
});

// document has no quotes: it is the page object itself, not a selector
$(document).keypress(function (event) {
  $("h1").text(event.key);
});

// .on() takes the event name as a string
$("h1").on("mouseover", function () {
  $("h1").css("color", "blue");
});
`},
  explore:[{
    title:'Event log for .on()', height:400,
    note:'Pick an event name and interact with the blue box. Each event jQuery delivers is logged at the top. Key events need the box to have focus, so click it first.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<div class="knobs">
  <label>$("#target").on(
    <select id="ev"><option>click</option><option>dblclick</option><option>mouseover</option><option>mouseout</option><option>mousedown</option><option>mouseup</option><option>keydown</option><option>keypress</option><option>keyup</option></select>
    , function (event) { … })</label>
  <button id="clr">clear log</button>
</div>
<div class="stage"><div id="target" class="box" tabindex="0" style="max-width:340px;margin:auto">#target: hover me, click me, or click then type</div></div>
<pre class="readout" id="log" style="height:150px;overflow:auto"></pre>
<script>
(function(){
  var n = 0;
  function add(line){ $('#log').text(line + '\\n' + $('#log').text()); }
  function attach(){
    var name = $('#ev').val();
    $('#target').off().on(name, function(event){
      n++;
      add(n + '. ' + event.type + (event.key ? '   event.key = "' + event.key + '"' : ''));
    });
    add('listening for "' + name + '" on #target');
  }
  $('#ev').on('change', attach);
  $('#clr').on('click', function(){ $('#log').text(''); n = 0; });
  attach();
})();
<\/script>`
  }],
  quiz:[
    { q:'Which line listens for key presses on the whole page?', options:['<code>$("document").keypress(...)</code>','<code>$(document).keypress(...)</code>','<code>$("body").keyboard(...)</code>','<code>document.$keypress(...)</code>'], answer:1, why:'document is the page object, passed without quotes. "document" in quotes would look for a tag called document.' },
    { q:'What does <code>$("h1").on("mouseover", fn)</code> do?', options:['Runs fn once, straight away','Runs fn every time the pointer moves onto the h1','Moves the h1 under the mouse','Only works for click events'], answer:1, why:'.on(eventName, handler) works for any DOM event; the shortcut methods like .click() are just convenient spellings of it.' },
    { q:'Inside <code>function (event) { ... }</code> of a key listener, which property holds the key that was pressed?', options:['event.target','event.key','event.type','event.value'], answer:1, why:'event.key is the character (or key name, such as Enter) for keyboard events.' },
  ],
});


/* ------------------------------------------------------------------ 157 */
PG.add({
  id:'l157', index:157, udemyId:12384230, minutes:3, section:'s19', slug:'adding-removing-elements', kind:'build',
  title:'Adding and Removing Elements with jQuery',
  blurb:'Four methods insert new HTML next to a selected element. <code>before()</code> and <code>after()</code> place it <b>outside</b>, as a sibling; <code>prepend()</code> and <code>append()</code> place it <b>inside</b>, as the first or last child. <code>remove()</code> deletes every element in the selection. All of this changes the live page only; the HTML file itself is untouched.',
  tasks:[
    'Delete the five original buttons with <code>$("button").remove()</code>.',
    'Add a button above the heading with <code>$("h1").before("&lt;button&gt;New&lt;/button&gt;")</code> and another below it with <code>after()</code>.',
    'Add one inside the heading, in front of its text, with <code>prepend()</code>, and one inside at the end with <code>append()</code>.',
    'Work out which buttons are now part of the h1 (the two inside it inherit its big bold font). The Explore tab draws the result as HTML.'
  ],
  files:{
'index.html': page('Adding and Removing Elements with jQuery', '  <h1>Hello</h1>\n\n' + BUTTONS),
'script.js':`// TODO 1: remove all the buttons that are on the page


// TODO 2: add <button>New</button> before the h1, and another after it


// TODO 3: add one with prepend() and one with append(). Where do they land?

`},
  solution:{
'script.js':`$("button").remove();                    // deletes all five original buttons

$("h1").before("<button>New</button>");   // sibling, above the h1
$("h1").after("<button>New</button>");    // sibling, below the h1
$("h1").prepend("<button>New</button>");  // inside the h1, before "Hello"
$("h1").append("<button>New</button>");   // inside the h1, after "Hello"
`},
  explore:[{
    title:'Where does it land?', height:420,
    note:'The dashed outline is the h1. Press the methods in any order and compare the picture with the HTML in the readout.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<style>
  #zone h1 { border: 2px dashed #5b9cff; padding: 6px 10px; margin: 6px 0; font-size: 26px; }
  #zone button { background: #ffcf6b; border: 1px solid #c99a2e; border-radius: 5px; padding: 3px 8px; font-size: 13px; }
</style>
<div class="knobs">
  <button data-m="before">$("h1").before(…)</button>
  <button data-m="after">$("h1").after(…)</button>
  <button data-m="prepend">$("h1").prepend(…)</button>
  <button data-m="append">$("h1").append(…)</button>
  <button data-m="remove">$("button").remove()</button>
  <button data-m="reset">reset</button>
</div>
<div class="stage" id="zone"><h1>Hello</h1></div>
<pre class="readout" id="ro"></pre>
<script>
(function(){
  var n = 0;
  function show(code){
    var html = $('#zone').html().trim().replace(/></g, '>\\n<');
    $('#ro').text((code ? code + '\\n\\n' : '') + 'resulting HTML:\\n' + html);
  }
  $('[data-m]').on('click', function(){
    var m = $(this).attr('data-m');
    if (m === 'reset') { $('#zone').html('<h1>Hello</h1>'); n = 0; return show(); }
    if (m === 'remove') { $('#zone button').remove(); return show('$("button").remove();'); }
    n++;
    var b = '<button>New ' + n + '</button>';
    $('#zone h1')[m](b);
    show('$("h1").' + m + '("' + b + '");');
  });
  show();
})();
<\/script>`
  }],
  quiz:[
    { q:'Where does <code>$("h1").prepend("&lt;b&gt;Hi&lt;/b&gt;")</code> put the new element?', options:['Above the h1, as a sibling','Inside the h1, before its existing content','Inside the h1, after its existing content','Below the h1, as a sibling'], answer:1, why:'prepend and append insert inside the element (first or last child); before and after insert outside it.' },
    { q:'You reload the page after running <code>$("button").remove()</code>. What do you see?', options:['No buttons: the file was changed','The original buttons again: only the live page was changed','An error','Empty buttons'], answer:1, why:'jQuery edits the DOM in memory. The HTML file on disk never changes, so a reload starts from the original markup.' },
  ],
});


/* ------------------------------------------------------------------ 158 */
PG.add({
  id:'l158', index:158, udemyId:12384236, minutes:8, section:'s19', slug:'animations', kind:'build',
  title:'Website Animations with jQuery',
  blurb:'jQuery has ready-made effects: <code>hide/show/toggle</code>, <code>fadeOut/fadeIn/fadeToggle</code> and <code>slideUp/slideDown/slideToggle</code>, plus <code>animate({...})</code> for gradually changing any numeric CSS property. Effects chained on the same element are queued, so they play one after another.',
  tasks:[
    'Inside a click handler for all the buttons, make the heading disappear and reappear on each click with <code>$("h1").toggle()</code>.',
    'Swap <code>toggle</code> for <code>fadeToggle</code>, then for <code>slideToggle</code>, and compare how each one looks.',
    'Replace it with a custom animation: <code>$("h1").animate({ opacity: 0.5 })</code>, then try <code>{ margin: "10%" }</code>. Percentages and other units go in a string.',
    'Chain three effects: <code>$("h1").slideUp().slideDown().animate({ opacity: 0.5 })</code>. They run in sequence, not all at once.',
    'Try animating a colour, such as <code>{ color: "red" }</code>: nothing happens, because animate() only handles numbers. Remove it again.'
  ],
  notes:'<p>jQuery\'s full list of effects, with every option, is in the <a href="https://api.jquery.com/category/effects/" target="_blank" rel="noopener">Effects section of the API docs</a>. Knowing roughly what exists and looking up the details when you need them is the habit the lecture recommends.</p>',
  files:{
'index.html': page('Website Animations with jQuery', '  <h1>Hello</h1>\n\n' + BUTTONS),
'script.js':`$("button").on("click", function () {
  // TODO 1: toggle the h1 between hidden and visible on every click
  // TODO 2: then try fadeToggle() and slideToggle() instead
  // TODO 3: then animate() its opacity to 0.5, and its margin to "10%"
  // TODO 4: finally chain slideUp(), slideDown() and animate({ opacity: 0.5 })

});
`},
  solution:{
'script.js':`$("button").on("click", function () {
  // effects chained on one element are queued and run in order
  $("h1").slideUp().slideDown().animate({ opacity: 0.5 });

  // one effect at a time, to compare:
  // $("h1").toggle();
  // $("h1").fadeToggle();
  // $("h1").slideToggle();
  // $("h1").animate({ margin: "10%" });
});
`},
  explore:[{
    title:'Effects bench', height:470,
    note:'Every button runs one call on the blue heading. hide, show and toggle are instant unless you give them a duration, so move the slider away from 400 to animate them too.',
    html:`
<script src="vendor/jquery/jquery.min.js"><\/script>
<div class="knobs">
  <label>duration <input type="range" id="dur" min="0" max="2000" step="100" value="400"><span class="val" id="dv">400 ms</span></label>
  <span class="note" style="margin:0">400 ms is jQuery's default</span>
</div>
<div class="knobs">
  <button data-e="hide">hide</button><button data-e="show">show</button><button data-e="toggle">toggle</button>
  <button data-e="fadeOut">fadeOut</button><button data-e="fadeIn">fadeIn</button><button data-e="fadeToggle">fadeToggle</button>
  <button data-e="slideUp">slideUp</button><button data-e="slideDown">slideDown</button><button data-e="slideToggle">slideToggle</button>
  <button data-e="op">animate({ opacity: 0.5 })</button><button data-e="mg">animate({ margin: "10%" })</button>
  <button data-e="chain">slideUp().slideDown().animate({ opacity: 0.5 })</button>
  <button data-e="reset">reset</button>
</div>
<div class="stage" style="min-height:170px">
  <h1 id="h">Hello</h1>
  <p style="margin:10px 0 0;color:#5b6382">This paragraph sits under the heading. Watch it jump when hide() or slideUp() take the heading out of the layout.</p>
</div>
<pre class="readout" id="ro"></pre>
<script>
(function(){
  var STYLE = 'margin:0;background:#5b9cff;color:#fff;padding:14px;border-radius:8px;text-align:center';
  var h = $('#h').attr('style', STYLE), dur = document.getElementById('dur');
  dur.addEventListener('input', function(){ document.getElementById('dv').textContent = dur.value + ' ms'; });
  $('[data-e]').on('click', function(){
    var e = $(this).attr('data-e'), d = +dur.value, code;
    if (e === 'reset') { h.stop(true, true).attr('style', STYLE); $('#ro').text(''); return; }
    if (e === 'op') { h.animate({ opacity: 0.5 }, d); code = 'animate({ opacity: 0.5 }, ' + d + ')'; }
    else if (e === 'mg') { h.animate({ margin: '10%' }, d); code = 'animate({ margin: "10%" }, ' + d + ')'; }
    else if (e === 'chain') { h.slideUp(d).slideDown(d).animate({ opacity: 0.5 }, d); code = 'slideUp(' + d + ').slideDown(' + d + ').animate({ opacity: 0.5 }, ' + d + ')'; }
    else if (/^(hide|show|toggle)$/.test(e) && d === 400) { h[e](); code = e + '()'; }
    else { h[e](d); code = e + '(' + d + ')'; }
    $('#ro').text('$("h1").' + code + ';');
  });
})();
<\/script>`
  }],
  quiz:[
    { q:'What happens with <code>$("h1").slideUp().slideDown().animate({ opacity: 0.5 })</code>?', options:['All three effects play at the same moment','They play one after another: up, down, then fade to half opacity','Only the last one runs','It throws, because effects cannot be chained'], answer:1, why:'Each effect method returns the same jQuery object, and effects on one element wait in a queue.' },
    { q:'Why does <code>animate({ color: "red" })</code> do nothing?', options:['red must be written as #f00','animate() only changes numeric CSS properties','colour is not a CSS property','animate needs a duration'], answer:1, why:'animate() interpolates between numbers. Colours need a plugin such as jQuery Color, or a plain CSS transition.' },
    { q:'Which effect removes the element from the layout so the content below moves up?', options:['animate({ opacity: 0 })','hide()','css("visibility", "hidden")','fadeTo(400, 0)'], answer:1, why:'hide() sets display: none. Fading opacity to 0 (or visibility: hidden) keeps the element\'s space in the layout.' },
  ],
});


/* ------------------------------------------------------------------ 159 */
PG.add({
  id:'l159', index:159, udemyId:17967042, minutes:2, section:'s19', slug:'tip-mixing-knowledge', kind:'read',
  title:'Tip from Angela - Mixing Knowledge',
  blurb:'Ideas stick better when you combine them. Rather than practising each topic only inside its own module, write tiny programs of five to ten lines that use something from two different sections together, such as a loop that builds a list and an <code>if</code> that gives some items a class. It does not have to be impressive; the act of joining the ideas is what does the work.',
});

})();
