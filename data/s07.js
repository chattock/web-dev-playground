/* ===== Section 7 — Intermediate CSS ===== */

PG.add({
  id:'s07-cascade', index:43, udemyId:37350528, minutes:25, section:'s07', slug:'cascade', kind:'build',
  title:'The Cascade - Specificity and Inheritance',
  blurb:'When several rules set the same property on the same element, the browser picks one winner. It weighs four things, from weakest to strongest: <b>position</b> (later beats earlier), <b>specificity</b> (id beats class beats element), <b>type</b> (inline beats internal beats external) and <b>importance</b> (<code>!important</code> beats everything).',
  tasks:[
    'Leave index.html and the existing CSS alone, and add your rules at the bottom of style.css. First make <code>.white-text</code> white. It wins over the <code>p</code> rule wherever you put it, because a class is more specific than an element selector.',
    'Make <code>.inner-box</code> red. Then move that rule <b>above</b> <code>.box</code>: the inner boxes turn blue again. Both are single classes, a tie on specificity, so position decides. Move it back below.',
    'Make <code>#outer-box</code> purple. The id is the only thing that sets this div apart from the other <code>.box</code> divs, and an id outranks a class wherever it sits in the file.',
    'Do not add any padding: every box already gets its 10px from <code>.box</code>. Compare the preview with the goal: purple outside, blue in the middle, red inside, yellow and white text.',
    'Type and importance: give one inner box an inline <code>style="background-color: green"</code>. It beats every selector. Now add <code>!important</code> to your <code>.inner-box</code> declaration and it wins back. Remove both experiments afterwards.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Cascade</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div id="outer-box" class="box">
    <div class="box">
      <p>Yellow Text</p>
      <div class="box inner-box">
        <p class="white-text">White Text</p>
      </div>
    </div>
    <div class="box">
      <p>Yellow Text</p>
      <div class="box inner-box">
        <p class="white-text">White Text</p>
      </div>
    </div>
  </div>
</body>
</html>`,
'style.css':`/* Don't change the existing CSS. Add your rules at the bottom. */

.box {
  background-color: blue;
  padding: 10px;
}

p {
  color: yellow;
  margin: 0;
  padding: 0;
}

/* TODO 1: paragraphs with class "white-text" -> white text */

/* TODO 2: boxes with class "inner-box" -> red background */

/* TODO 3: the box with id "outer-box" -> purple background */
`},
  solution:{
'style.css':`/* Don't change the existing CSS. Add your rules at the bottom. */

.box {
  background-color: blue;
  padding: 10px;
}

p {
  color: yellow;
  margin: 0;
  padding: 0;
}

.white-text {
  color: white;
}

.inner-box {
  background-color: red;
}

#outer-box {
  background-color: purple;
}
`},
  explore:[
  {
    title:'Specificity showdown', height:560,
    note:'Every rule below targets the same heading: <code>&lt;h1 id="main" class="title" draggable="true"&gt;</code>. Switch them on and off. Among selectors the most specific wins whatever the order; an inline style beats them all; <code>!important</code> beats even that.',
    html:`
<div class="knobs" style="flex-direction:column;align-items:flex-start">
  <label><input type="checkbox" id="c1" checked> <span class="tag">h1 { color: teal; }</span> element</label>
  <label><input type="checkbox" id="c2" checked> <span class="tag">.title { color: orange; }</span> class</label>
  <label><input type="checkbox" id="c3"> <span class="tag">h1[draggable] { color: olive; }</span> attribute + element</label>
  <label><input type="checkbox" id="c4" checked> <span class="tag">#main { color: crimson; }</span> id</label>
  <label><input type="checkbox" id="c5"> <span class="tag">style="color: purple"</span> inline</label>
  <label><input type="checkbox" id="c6"> add <span class="tag">!important</span> to the h1 rule</label>
</div>
<div class="stage">
  <h1 id="main" class="title" draggable="true" style="margin:0">Who wins?</h1>
</div>
<pre class="readout" id="ro"></pre>
<style id="rules"></style>
<script>
  var R = [
    { id:'c1', css:'h1 { color: teal; }', spec:[0,0,1] },
    { id:'c2', css:'.title { color: orange; }', spec:[0,1,0] },
    { id:'c3', css:'h1[draggable] { color: olive; }', spec:[0,1,1] },
    { id:'c4', css:'#main { color: crimson; }', spec:[1,0,0] }
  ];
  function on(id){ return document.getElementById(id).checked; }
  function beats(a, b){ for (var i = 0; i < 3; i++){ if (a[i] !== b[i]) return a[i] > b[i]; } return true; }
  function upd(){
    var imp = on('c6') && on('c1');
    var live = R.filter(function(r){ return on(r.id); });
    document.getElementById('rules').textContent = live.map(function(r){
      return r.id === 'c1' && imp ? 'h1 { color: teal !important; }' : r.css;
    }).join('\\n');
    var h = document.getElementById('main');
    h.style.color = on('c5') ? 'purple' : '';
    var best = null;
    live.forEach(function(r){ if (!best || beats(r.spec, best.spec)) best = r; });
    var winner = imp ? 'the h1 rule, because !important beats everything'
               : on('c5') ? 'the inline style: type beats any selector'
               : best ? best.css + '  (the highest specificity)'
               : 'nothing set, so the browser default';
    var lines = live.map(function(r){
      return (r.id === 'c1' && imp ? 'h1 { color: teal !important; }' : r.css) + '   specificity ' + r.spec.join('-');
    });
    if (on('c5')) lines.push('style="color: purple"   inline');
    document.getElementById('ro').textContent = (lines.length ? lines.join('\\n') : '(no rules on)') +
      '\\n\\nwinner: ' + winner + '\\ncomputed colour: ' + getComputedStyle(h).color +
      '\\n\\nspecificity is (ids - classes, attributes - elements), compared left to right';
  }
  ['c1','c2','c3','c4','c5','c6'].forEach(function(i){ document.getElementById(i).addEventListener('change', upd); });
  upd();
<\/script>`
  },
  {
    title:'Position in the file matters', height:380,
    note:'Two rules with <b>identical</b> specificity, like <code>.box</code> and <code>.inner-box</code> in the exercise. Now order is the tie-breaker, and the later rule wins.',
    html:`
<div class="knobs">
  <label>order
    <select id="ord">
      <option value="ab">.box first, then .inner-box</option>
      <option value="ba">.inner-box first, then .box</option>
    </select>
  </label>
</div>
<div class="stage"><div id="t" class="box inner-box">class="box inner-box"</div></div>
<pre class="readout" id="ro"></pre>
<style id="rules"></style>
<script>
  var o = document.getElementById('ord');
  function upd(){
    var a = '.box { background-color: blue; }', b = '.inner-box { background-color: red; }';
    var txt = o.value === 'ab' ? a + '\\n' + b : b + '\\n' + a;
    document.getElementById('rules').textContent = txt;
    document.getElementById('ro').textContent = txt +
      '\\n\\nboth are one class: a tie, so the last one written wins -> ' + getComputedStyle(document.getElementById('t')).backgroundColor;
  }
  o.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'<code>&lt;h1 class="title" id="main"&gt;</code> is styled by <code>.title { color: blue; }</code> and <code>#main { color: green; }</code>, in that order. What colour is it?', options:['Blue, it comes first','Green, an id is more specific than a class','Black, the rules cancel out','Blue, classes beat ids'], answer:1, why:'Specificity decides before position is even considered, and an id outranks a class.' },
    { q:'<code>&lt;h1 class="first second"&gt;</code> is styled by <code>.first { color: green; }</code> and then <code>.second { color: blue; }</code>. What colour is it?', options:['Green','Blue','Teal, the colours mix','Black'], answer:1, why:'Two classes tie on specificity, so position breaks the tie: the later rule wins.' },
    { q:'A stylesheet sets <code>#main { color: green; }</code>, and the element also has <code>style="color: blue"</code>. What colour is it?', options:['Green, an id is the most specific selector','Blue, inline styles outrank any selector','Green, stylesheets load later','Blue, but only after a reload'], answer:1, why:'Type ranks above specificity, and inline is the strongest type. Only !important beats it.' },
    { q:'Which order runs from weakest to strongest?', options:['importance, type, specificity, position','position, specificity, type, importance','specificity, position, importance, type','type, position, importance, specificity'], answer:1, why:'Use it as a debugging checklist from the top: !important? inline? a more specific selector? a later rule?' },
  ],
  notes:`
    <h3>Debugging checklist</h3>
    <ol>
      <li>Is something marked <code>!important</code>?</li>
      <li>Is an inline <code>style=""</code> involved?</li>
      <li>Is a more specific selector winning? DevTools shows the loser struck through.</li>
      <li>Is a later rule with the same specificity overriding yours?</li>
    </ol>
    <h3>Attribute vs class</h3>
    <p>In the lecture, <code>li[draggable]</code> beats <code>.first-class</code>, and it is presented as "attribute beats class". The real reason is that <code>li[draggable]</code> is an attribute <b>plus</b> an element. On their own, an attribute selector and a class have exactly the same weight, and a tie goes to the later rule. The showdown demo includes <code>h1[draggable]</code> so you can see this.</p>
    <h3>A mental scoring model</h3>
    <p>Many people count inline = 1000, id = 100, class or attribute = 10, element = 1. Browsers really compare column by column (any id beats any number of classes), but the model works for everyday CSS.</p>`
});


PG.add({
  id:'s07-combining', index:44, udemyId:37350562, minutes:23, section:'s07', slug:'combining-selectors', kind:'build',
  title:'Combining CSS Selectors',
  blurb:'Simple selectors can be combined to aim precisely without adding classes to the HTML: a <b>group</b> with commas (<code>h1, h2</code>), a <b>child</b> with <code>&gt;</code> (one level down), a <b>descendant</b> with a space (any depth), and a <b>chain</b> with no space at all (one element that matches every part).',
  tasks:[
    'Do not change index.html. <b>Group:</b> make the <code>h1</code> and the <code>h2</code> <code>blueviolet</code> with one rule.',
    '<b>Child:</b> make only the paragraph that is a direct child of <code>.box</code> <code>firebrick</code>, using <code>.box &gt; p</code>. The other paragraphs stay as they are.',
    '<b>Descendant:</b> make the three list items <code>blue</code> with <code>.box li</code>. <code>.box &gt; li</code> would match nothing, because the items sit two levels down, inside the <code>ul</code>.',
    '<b>Chained:</b> make the two <code>li</code> elements with class <code>done</code> <code>seagreen</code> with <code>li.done</code> (no space, element first).',
    '<b>Combined:</b> shrink the <code>p.done</code> inside the second <code>ul</code> to <code>font-size: 0.5rem</code> with <code>ul p.done</code>.',
    '<code>.box li</code> and <code>li.done</code> have the same specificity (one class, one element). Swap their order and the done items turn blue: position breaks the tie.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Combining CSS Selectors</title>
  <link rel="stylesheet" href="./style.css" />
</head>

<!-- Don't change any of the HTML code! -->

<body>
  <h1>To Do List</h1>
  <h2>Monday</h2>
  <div class="box">
    <p class="done">Do these things today!</p>
    <ul class="list">
      <li>Wash Clothes</li>
      <li class="done">Read</li>
      <li class="done">Maths Questions</li>
    </ul>
  </div>

  <ul>
    <p class="done">Other items</p>
  </ul>
  <p>The best preparation for tomorrow is doing your best today.</p>
</body>
</html>`,
'style.css':`/* Write your code here: */

/* TODO 1: group - the h1 and the h2 -> blueviolet */

/* TODO 2: child - the p directly inside .box -> firebrick */

/* TODO 3: descendant - every li inside .box -> blue */

/* TODO 4: chained - li elements that also have the class done -> seagreen */

/* TODO 5: combined - the p.done inside a ul -> font-size 0.5rem */
`},
  solution:{
'style.css':`/* Group */
h1,
h2 {
  color: blueviolet;
}

/* Child */
.box > p {
  color: firebrick;
}

/* Descendant */
.box li {
  color: blue;
}

/* Chained */
li.done {
  color: seagreen;
}

/* Combined */
ul p.done {
  font-size: 0.5rem;
}
`},
  explore:[{
    title:'Combinator lab', height:600,
    note:'Type a selector, or pick one, and see what it catches. The difference between <code>&gt;</code> and a space trips everyone up, and so does a stray space inside a chain: <code>li.done</code> and <code>li .done</code> mean different things.',
    html:`
<div class="knobs">
  <label>selector <input type="text" id="sel" value=".box p" spellcheck="false" style="width:150px;font-family:ui-monospace,Menlo,monospace"></label>
  <label>or pick
    <select id="pick">
      <option value="">…</option>
      <option>.box p</option><option>.box &gt; p</option><option>h1, h2</option>
      <option>.box li</option><option>.box &gt; li</option><option>li.done</option><option>li .done</option>
      <option>ul p.done</option><option>p.done</option><option>.doneli</option>
    </select>
  </label>
  <span class="tag" id="count"></span>
</div>
<div class="stage" id="stage" style="font-size:13px">
  <h1 style="font-size:20px;margin:0 0 4px">To Do List</h1>
  <h2 style="font-size:16px;margin:0 0 8px">Monday</h2>
  <div class="box" style="border:2px dashed #b9c0d4;padding:8px 10px;background:none;color:inherit;text-align:left;font-weight:400;border-radius:6px">
    <div style="font-size:10.5px;color:#8b92a8">div.box</div>
    <p class="done" style="margin:2px 0 6px">p.done, a direct child of .box</p>
    <ul class="list" style="margin:0">
      <li>Wash Clothes</li>
      <li class="done">Read <span class="done">(a span with .done inside the li)</span></li>
      <li class="done">Maths Questions</li>
    </ul>
  </div>
  <ul style="margin:8px 0 4px">
    <p class="done" style="margin:0">p.done inside a second ul</p>
  </ul>
  <p style="margin:0">a plain paragraph at the bottom</p>
</div>
<pre class="readout" id="ro"></pre>
<style id="hi"></style>
<script>
  var sel = document.getElementById('sel'), pick = document.getElementById('pick');
  var why = {
    '.box p':'space = descendant: any p inside .box, at any depth.',
    '.box > p':'> = child: only a p exactly one level below .box.',
    'h1, h2':'comma = group: shorthand for two separate rules with the same declarations.',
    '.box li':'descendant: the list items are two levels down, and a space does not care how deep.',
    '.box > li':'child: matches nothing, because the li elements are children of the ul, not of .box.',
    'li.done':'no space = chained: one element that is an li AND has the class done.',
    'li .done':'with a space it means a .done element INSIDE an li: the span, not the li itself.',
    'ul p.done':'a p with class done, somewhere inside a ul.',
    'p.done':'every p with class done, wherever it is: too broad for the exercise.',
    '.doneli':'class first, then the element glued on: the browser reads one class called "doneli". Element selectors must come first in a chain.'
  };
  function scoped(s){ return s.split(',').map(function(x){ return '#stage ' + x.trim(); }).join(', '); }
  function upd(){
    var s = sel.value.trim(), n = 0, bad = false;
    if (s) { try { n = document.querySelectorAll(scoped(s)).length; } catch(e){ bad = true; } }
    document.getElementById('hi').textContent = (s && !bad)
      ? scoped(s) + ' { outline:3px solid #ff5c8a; outline-offset:2px; background:#ffe9ef; }' : '';
    document.getElementById('count').textContent = bad ? 'not a valid selector' : n + (n === 1 ? ' match' : ' matches');
    document.getElementById('ro').textContent = s + ' { ... }\\n\\n' + (bad ? 'The browser cannot parse this, so the rule would be ignored.' : (why[s] || 'Read it right to left: the last part names the element being styled.'));
  }
  sel.addEventListener('input', upd);
  pick.addEventListener('change', function(){ if (pick.value) { sel.value = pick.value; upd(); } });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>li.done</code> select?', options:['Any element with class done inside an li','An li that also has the class done','Every li and every .done','Nothing, it is invalid'], answer:1, why:'No space means one element must match both parts.' },
    { q:'The list items sit inside a <code>ul</code> inside <code>.box</code>. Which selector reaches them?', options:['.box > li','.box li','.box + li','.box, li'], answer:1, why:'A space reaches any depth. > only reaches direct children.' },
    { q:'What does <code>h1, h2 { color: blueviolet; }</code> do?', options:['Styles an h2 inside an h1','Styles every h1 and every h2','Styles only elements that are both','Styles the first h1 and h2'], answer:1, why:'A comma groups selectors so they share one declaration block.' },
    { q:'Why does <code>.doneli</code> not select <code>&lt;li class="done"&gt;</code>?', options:['Chains cannot use classes','The browser reads it as a single class named "doneli"; the element must come first, as li.done','Class names cannot contain the letters li','It needs a space'], answer:1, why:'In a chain, a type (element) selector has to come first. Class and id parts can follow in any order.' },
  ],
  notes:`
    <h3>The four combinations</h3>
    <table>
      <tr><th>Written</th><th>Name</th><th>Means</th></tr>
      <tr><td><code>h1, h2</code></td><td>Group</td><td>Both, with one shared block</td></tr>
      <tr><td><code>.box &gt; p</code></td><td>Child</td><td>A <code>p</code> directly inside <code>.box</code></td></tr>
      <tr><td><code>.box p</code></td><td>Descendant</td><td>A <code>p</code> anywhere inside <code>.box</code></td></tr>
      <tr><td><code>li.done</code></td><td>Chained</td><td>One element that is an <code>li</code> and has class <code>done</code></td></tr>
    </table>
    <h3>Chains can get long</h3>
    <pre data-lang="css">h1#title.big.heading { color: black; }
/* an h1 with id "title" AND the classes "big" and "heading" */</pre>
    <p>Read any combined selector as a sentence, from the right: <code>ul p.done</code> is "a paragraph with class done, somewhere inside a list". In DevTools, hovering a selector in the Styles pane highlights the elements it matches.</p>
    <p>One oddity: the second <code>ul</code> holds a <code>p</code>, which is not valid HTML (a list should only contain <code>li</code> elements). The exercise uses it only to practise selectors.</p>`
});


PG.add({
  id:'s07-positioning', index:45, udemyId:37350588, minutes:23, section:'s07', slug:'positioning', kind:'build',
  title:'CSS Positioning',
  blurb:'<code>position</code> decides how <code>top</code>, <code>right</code>, <code>bottom</code> and <code>left</code> behave. <b>static</b> (the default) ignores them; <b>relative</b> moves an element from where it would normally be; <b>absolute</b> takes it out of the flow and places it inside the nearest positioned ancestor; <b>fixed</b> pins it to the browser window.',
  tasks:[
    'In the <code>&lt;style&gt;</code> element, make <code>.red-circle</code> red, <code>200px</code> wide and high, and round with <code>border-radius: 50%</code>. An empty div only shows up once it has a size and a colour.',
    'Make <code>.blue-box</code> blue, <code>500px</code> wide and <code>300px</code> high.',
    'Give <code>.blue-box</code> <code>position: relative</code> with <code>top: 200px</code> and <code>left: 200px</code>. It moves from where it would have been, and it also becomes the reference frame for its children.',
    'Give <code>.red-circle</code> <code>position: absolute</code> with <code>top: 150px</code> and <code>left: 250px</code>. Those offsets are measured from the blue box, so the circle\'s top-left corner lands at the box\'s centre.',
    'Delete <code>position: relative</code> from the blue box and watch the circle jump: with no positioned ancestor it measures from the page instead. Put it back.',
    'Bonus: centre the circle properly with <code>top: 50%; left: 50%; transform: translate(-50%, -50%);</code>. The percentages place its corner; the transform pulls it back by half its own size.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Positioning Exercise</title>
  <style>
    /* Write your code here */

    /* TODO 1: .red-circle - red, 200px by 200px, rounded into a circle */

    /* TODO 2: .blue-box - blue, 500px wide and 300px high */

    /* TODO 3: .blue-box - 200px down and 200px right of where it would normally sit */

    /* TODO 4: .red-circle - 150px from the top and 250px from the left OF THE BLUE BOX */

  </style>
</head>
<body>
  <div class="blue-box">
    <div class="red-circle"></div>
  </div>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Positioning Exercise</title>
  <style>
    .red-circle {
      background-color: red;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      position: absolute;
      top: 150px;
      left: 250px;
    }

    .blue-box {
      background-color: blue;
      width: 500px;
      height: 300px;
      position: relative;
      top: 200px;
      left: 200px;
    }
  </style>
</head>
<body>
  <div class="blue-box">
    <div class="red-circle"></div>
  </div>
</body>
</html>`},
  explore:[
  {
    title:'Position playground', height:600,
    note:'The orange box is the one you are moving. Switch its <code>position</code> and drag the offsets, and watch whether the other boxes close up the gap. <code>sticky</code> is extra: it is not covered in the lecture.',
    html:`
<div class="knobs">
  <label>position
    <select data-css="#mover|position">
      <option>static</option><option selected>relative</option>
      <option>absolute</option><option>fixed</option><option value="sticky">sticky (extra)</option>
    </select>
  </label>
  <label>top <input type="range" min="-40" max="120" value="20" data-css="#mover|top|px"><span class="val"></span></label>
  <label>left <input type="range" min="-40" max="220" value="40" data-css="#mover|left|px"><span class="val"></span></label>
  <label>margin-top <input type="range" min="0" max="40" value="0" data-css="#mover|margin-top|px"><span class="val"></span></label>
  <label><input type="checkbox" id="anc" checked> parent is <span class="tag">position: relative</span></label>
</div>
<div class="stage" id="parent" style="position:relative;height:270px;background:#eef1f9;border:2px dashed #b9c0d4">
  <div style="font-size:10.5px;color:#8b92a8;position:absolute;top:4px;left:6px">the parent container</div>
  <div class="box b" style="margin:22px 0 8px;width:200px">box one</div>
  <div class="box" id="mover" style="width:200px;position:relative;top:20px;left:40px;background:#ff9f43;color:#fff">I am the mover</div>
  <div class="box" style="margin-top:8px;width:200px">box three</div>
</div>
<pre class="readout" data-readout="#mover"></pre>
<pre class="readout" id="explain"></pre>
<script>
  var sel = document.querySelector('select[data-css="#mover|position"]');
  var anc = document.getElementById('anc');
  var text = {
    static:'static is the default. top and left are ignored: the box sits wherever the normal flow puts it. (margin still works: it is part of the box model, not of positioning.)',
    relative:'relative shifts the box from its normal spot, but that spot stays reserved: see the gap it left behind. Margin adds to the offset.',
    absolute:'absolute lifts the box out of the flow, so box three moves up into its place. It is measured from the nearest ancestor whose position is not static.',
    fixed:'fixed measures from the browser window (here, this demo frame), not the page, and stays put when the page scrolls.',
    sticky:'sticky acts like relative until scrolling would push it past its offset, then it sticks. It is not part of the lecture.'
  };
  function upd(){
    document.getElementById('parent').style.position = anc.checked ? 'relative' : 'static';
    var extra = sel.value === 'absolute'
      ? '\\n\\nThe parent is ' + (anc.checked
          ? 'relative, so the mover is measured from the PARENT box.'
          : 'static, and no other ancestor is positioned, so the mover is measured from the PAGE. Tick the box to compare.')
      : '';
    document.getElementById('explain').textContent = text[sel.value] + extra;
  }
  sel.addEventListener('change', upd); anc.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  },
  {
    title:'absolute vs fixed while scrolling', height:420,
    note:'Scroll <b>inside this frame</b>. Both badges were placed 70px from the top. The absolute one belongs to the page, so it scrolls away; the fixed one belongs to the window, so it stays where it is.',
    html:`
<div id="tall" style="position:relative;height:1300px;border:1px solid #dfe3ee;border-radius:10px;
     background:repeating-linear-gradient(#fff 0 39px,#eef1f9 39px 40px)">
  <div style="padding:10px 14px;font-size:12.5px;color:#5b6382">a long page: keep scrolling</div>
  <div class="box d" style="position:absolute;top:70px;right:20px;width:120px">absolute</div>
</div>
<div class="box b" style="position:fixed;top:70px;right:160px;width:120px">fixed</div>
<pre class="readout" id="ro" style="position:fixed;left:16px;bottom:8px;margin:0;opacity:.95"></pre>
<script>
  function upd(){
    var y = Math.round(window.scrollY);
    document.getElementById('ro').textContent = 'scrolled ' + y + 'px: the absolute badge moved up ' + y + 'px, the fixed one did not move';
  }
  window.addEventListener('scroll', upd); upd();
<\/script>`
  },
  {
    title:'z-index stacking', height:410,
    note:'When positioned boxes overlap, <code>z-index</code> decides which is on top: the higher number is closer to you. Everything starts at the same level, and negative numbers sink behind the rest.',
    html:`
<div class="knobs">
  <label>red <input type="range" min="-1" max="3" value="1" data-css="#r|z-index"><span class="val"></span></label>
  <label>green <input type="range" min="-1" max="3" value="2" data-css="#g|z-index"><span class="val"></span></label>
  <label>yellow <input type="range" min="-1" max="3" value="3" data-css="#y|z-index"><span class="val"></span></label>
</div>
<div class="stage" style="position:relative;height:200px;z-index:0">
  <div id="r" class="box d" style="position:absolute;top:20px;left:20px;width:150px;height:110px;z-index:1">red</div>
  <div id="g" class="box b" style="position:absolute;top:50px;left:90px;width:150px;height:110px;z-index:2">green</div>
  <div id="y" class="box c" style="position:absolute;top:80px;left:160px;width:150px;height:110px;z-index:3">yellow</div>
</div>
<pre class="readout" data-readout="#r,#g,#y"></pre>
<p class="note"><code>z-index</code> only affects positioned elements (position other than static). And a z-index of 0 does not put an absolute element back into the normal flow: only <code>static</code> or <code>relative</code> does that.</p>`
  }],
  quiz:[
    { q:'<code>position: relative; top: 50px;</code> moves an element 50px down from…', options:['the top of the page','its parent\'s top edge','where it would normally have been','the browser window'], answer:2, why:'relative is measured from the element\'s own normal position, and that original space stays reserved.' },
    { q:'An absolute element has no positioned ancestors. Where are its offsets measured from?', options:['Its parent','The top-left of the page','Its original position','The centre of the screen'], answer:1, why:'Without a positioned ancestor, absolute falls back to the page itself. Give the parent position: relative to change that.' },
    { q:'What do <code>top</code> and <code>left</code> do on a <code>static</code> element?', options:['Move it','Nothing at all','Move its children','Act like margins'], answer:1, why:'Offsets only work once position is relative, absolute or fixed.' },
    { q:'You scroll down a long page. What happens to a <code>fixed</code> element?', options:['It scrolls away like everything else','It stays in the same place on the screen','It disappears','It jumps to the bottom'], answer:1, why:'fixed is relative to the viewport, which does not move when you scroll. An absolute element scrolls with the page.' },
    { q:'A 200px circle gets <code>top: 50%; left: 50%</code> inside its parent. Where does it end up?', options:['Exactly centred','Its top-left corner is at the parent\'s centre','Half outside on the left','At the bottom right'], answer:1, why:'The element is still a rectangle, and the offsets place its top-left corner. translate(-50%, -50%) pulls it back to the true centre.' },
  ],
  notes:`
    <h3>The values</h3>
    <table>
      <tr><th>Value</th><th>Measured from</th><th>Keeps its space in the flow?</th></tr>
      <tr><td><code>static</code></td><td>Offsets are ignored</td><td>Yes</td></tr>
      <tr><td><code>relative</code></td><td>Its own normal position</td><td>Yes</td></tr>
      <tr><td><code>absolute</code></td><td>The nearest positioned ancestor (or the page)</td><td>No</td></tr>
      <tr><td><code>fixed</code></td><td>The browser window</td><td>No</td></tr>
    </table>
    <h3>The pairing you will use constantly</h3>
    <pre data-lang="css">.parent { position: relative; }   /* no offsets: it doesn't move, it becomes the frame */
.child  { position: absolute; top: 0; right: 0; }   /* pinned to the parent's corner */</pre>
    <h3>A circle is still a box</h3>
    <p><code>border-radius: 50%</code> only rounds the corners you see. For layout the circle is the same square as before, which is why <code>top: 50%; left: 50%</code> puts its top-left corner, not its middle, at the centre.</p>`
});


PG.add({
  id:'s07-flag', index:46, udemyId:37350652, minutes:18, section:'s07', slug:'flag-project', kind:'build', project:true,
  title:'CSS Flag',
  blurb:'Rebuild the flag of Laos with nothing but CSS: a red field, a blue band across the middle half and a white circle in its centre. The HTML is fixed and has almost no classes, so you reach elements by their structure with combinators, then place them with relative and absolute positioning.',
  tasks:[
    'Do not edit the HTML. Make <code>.flag</code> <code>900px</code> × <code>600px</code> with the red <code>#ce1126</code>.',
    'Select the blue band, the div that is a direct child of the flag, with <code>.flag &gt; div</code>. Make it <code>100%</code> wide, <code>300px</code> high and <code>#002868</code>.',
    'Select the circle, the div inside that div, with <code>.flag &gt; div &gt; div</code>. Make it <code>200px</code> × <code>200px</code>, white, with <code>border-radius: 50%</code>.',
    'Position it: <code>.flag</code> gets <code>position: relative</code> (it stays put and becomes the frame); the band gets <code>position: absolute; top: 150px</code> (a quarter of 600); the circle gets <code>position: absolute</code> with <code>top: 50px</code> = (300 − 200) ÷ 2 and <code>left: 350px</code> = (900 − 200) ÷ 2.',
    'Style the text: every <code>p</code> gets <code>font-size: 5rem</code>, <code>text-align: center</code>, white, and <code>margin: 0</code> plus <code>padding: 0</code>. Without that, the paragraphs\' default margins push things out of place.',
    'Make only the text inside the circle black with a descendant selector such as <code>.flag &gt; div div p</code>. It is more specific than <code>p</code>, so it wins wherever it sits. Tip: in DevTools, right-click the element, then Copy → Copy selector, and simplify what you get.',
    'The flag is 900px wide, wider than the preview: scroll sideways, or press <b>↗ open</b> to see it whole.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Flag Project</title>
  <style>
    /* Write your CSS here. Don't change the HTML.
       The flag is 900px wide and 600px high.
       Red: #ce1126   Blue: #002868   The white circle is 200px wide.
       The blue band is half the flag's height, centred vertically. */

  </style>
</head>
<body>
  <div class="flag">
    <p>The Flag</p>
    <div>
      <div>
        <p>of Laos</p>
      </div>
    </div>
  </div>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Flag Project</title>
  <style>
    .flag {
      width: 900px;
      height: 600px;
      position: relative;
      background-color: #ce1126;
    }

    .flag > div {
      background-color: #002868;
      height: 300px;
      width: 100%;
      position: absolute;
      top: 150px;
    }

    .flag > div > div {
      background-color: white;
      position: absolute;
      height: 200px;
      width: 200px;
      border-radius: 50%;
      top: 50px;
      left: 350px;
    }

    p {
      font-size: 5rem;
      color: white;
      text-align: center;
      padding: 0;
      margin: 0;
    }

    .flag > div div p {
      color: black;
    }
  </style>
</head>
<body>
  <div class="flag">
    <p>The Flag</p>
    <div>
      <div>
        <p>of Laos</p>
      </div>
    </div>
  </div>
</body>
</html>`},
  explore:[{
    title:'Why absolute, and why margin: 0', height:520,
    note:'A small copy of the flag (360 × 240, so the band should start 60px down). Try the band with <code>relative</code>: it sits after the paragraph in the normal flow, so its position depends on the text and its margins. With <code>absolute</code> it lands exactly where you say.',
    html:`
<div class="knobs">
  <label>band position
    <select id="pos"><option value="relative">relative, top: 0</option><option value="absolute" selected>absolute, top: 60px</option></select>
  </label>
  <label><input type="checkbox" id="m0" checked> <span class="tag">p { margin: 0; }</span></label>
</div>
<div class="stage" style="padding:20px">
  <div class="mini-flag" id="flag">
    <p>The Flag</p>
    <div>
      <div>
        <p>of Laos</p>
      </div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .mini-flag { width: 360px; height: 240px; position: relative; background: #ce1126; }
  .mini-flag > div { background: #002868; width: 100%; height: 120px; }
  .mini-flag > div > div { background: #fff; width: 80px; height: 80px; border-radius: 50%; position: absolute; top: 20px; left: 140px; }
  .mini-flag p { font-size: 2rem; color: #fff; text-align: center; font-family: sans-serif; }
  .mini-flag > div div p { color: #000; font-size: 0.75rem; line-height: 80px; }
</style>
<style id="dyn"></style>
<script>
  function upd(){
    var abs = document.getElementById('pos').value === 'absolute', m0 = document.getElementById('m0').checked;
    document.getElementById('dyn').textContent =
      '.mini-flag > div { position: ' + (abs ? 'absolute; top: 60px' : 'relative; top: 0') + '; }' +
      (m0 ? ' .mini-flag p { margin: 0; padding: 0; }' : '');
    var f = document.getElementById('flag').getBoundingClientRect();
    var b = document.querySelector('.mini-flag > div').getBoundingClientRect();
    var p = getComputedStyle(document.querySelector('.mini-flag p')).marginTop;
    var off = Math.round(b.top - f.top);
    document.getElementById('ro').textContent =
      'band top: ' + off + 'px below the top of the flag   (target: 60px)\\n' +
      'paragraph margin-top: ' + p + '\\n\\n' +
      (abs ? (off === 60 ? 'Exactly right: absolute ignores the paragraph completely.' : 'Off target.')
           : 'In the normal flow the band follows the paragraph, so the text size and the margins decide where it lands.');
  }
  document.getElementById('pos').addEventListener('change', upd);
  document.getElementById('m0').addEventListener('change', upd);
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Which selector picks the white circle in this HTML?', options:['.flag > p','.flag > div','.flag > div > div','.flag + div'], answer:2, why:'The circle is a div inside the div that is a direct child of .flag.' },
    { q:'Why does <code>.flag</code> get <code>position: relative</code> with no offsets?', options:['To move it 0px','So the absolute band is measured from the flag, not the page','To make it red','Absolute children need a relative parent to be visible'], answer:1, why:'A relative parent stays where it is but becomes the reference frame for absolute children.' },
    { q:'The band is 900 × 300 and the circle 200 × 200. What centres the circle?', options:['top: 150px; left: 450px','top: 50px; left: 350px','top: 100px; left: 700px','top: 50%; left: 50%'], answer:1, why:'(300 − 200) ÷ 2 = 50 and (900 − 200) ÷ 2 = 350. Plain 50% would place its corner, not its centre.' },
    { q:'Why does <code>.flag &gt; div div p { color: black; }</code> beat <code>p { color: white; }</code>?', options:['It is written later','It is more specific: a class plus several elements beat one element','Black always beats white','Descendant selectors are always !important'], answer:1, why:'Specificity decides before position, so it wins even if it comes first in the file.' },
  ],
  notes:`
    <h3>The centring maths</h3>
    <p>To centre a child inside a parent with absolute offsets: <code>offset = (parent size − child size) ÷ 2</code>, separately for top and left.</p>
    <h3>Getting exact colours</h3>
    <p>Open an image of the real flag in Chrome, open DevTools, then the three-dot menu inside DevTools → More tools → CSS overview → Capture overview. It lists the colours on the page, which is where #ce1126 and #002868 come from.</p>
    <h3>Copy selector, then simplify</h3>
    <p>Right-click an element in the Elements panel → Copy → Copy selector gives a long chain such as <code>body &gt; div &gt; div &gt; div &gt; p</code>. Don't paste it blindly: swap the start for <code>.flag</code>, loosen the <code>&gt;</code>s where depth does not matter, and you get something readable like <code>.flag div div p</code>.</p>`
});


PG.add({
  id:'l047', index:47, udemyId:17966538, minutes:4, section:'s07', slug:'nothing-easy-is-worth-doing', kind:'read',
  title:'Tip from Angela - Nothing Easy is Worth Doing!',
  blurb:'A short pep talk at the end of the intermediate CSS module. Feeling "not cut out for this" is normal: programming skill is built by practice, not inherited, and people who make it look easy have usually put in a lot of unseen hours. Keep showing up, especially when positioning feels frustrating.',
  quiz:[
    { q:'According to the tip, where does programming skill mostly come from?', options:['Natural talent you either have or don\'t','Regular practice over time','Memorising every property','Watching videos at double speed'], answer:1, why:'The point of the talk: skills that look effortless usually hide many hours of practice.' },
  ],
});
