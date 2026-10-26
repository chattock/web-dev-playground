/* ===== Section 9 — Flexbox ===== */

PG.add({
  id:'s09-display-flex', index:54, udemyId:37368230, minutes:14, section:'s09', slug:'display-flex', kind:'build',
  title:'Display: Flex',
  blurb:'Multi-column layouts used to be built from tables, inline-blocks, absolute positioning or floats, and each one fought back. Put <code>display: flex</code> on a <b>container</b> and its direct children line up in a row, whatever kind of element they were before; <code>gap</code> spaces them out.',
  tasks:[
    'The title and five links stack down the page. In <code>style.css</code>, give <code>.container</code> <code>display: flex</code>: they snap into one row, like a nav bar.',
    'Add <code>gap: 10px</code> so the items stop touching. Then try <code>gap: 1rem</code>. It looks the same today, but rem follows the root font size: add <code>html { font-size: 24px; }</code> and only the rem gap grows.',
    'The <code>&lt;p&gt;</code> and the <code>&lt;li&gt;</code>s were block-level, one per line. As flex items that no longer matters. Delete <code>list-style: none</code> to see the bullet points it was hiding, then put it back.',
    'Change <code>display: flex</code> to <code>display: inline-flex</code>: the gold bar shrinks to the width of its contents, just as <code>inline-block</code> relates to <code>block</code>. Switch back to <code>flex</code> for the solution.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Column Layout Methods</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <p>Page Layout Methods</p>

    <li><a href="#table">HTML Table</a></li>
    <li><a href="#inline-block">Inline-Block</a></li>
    <li><a href="#absolute">Absolute Positioning</a></li>
    <li><a href="#float">Float</a></li>
    <li><a href="#flexbox">Flexbox</a></li>
  </div>
</body>
</html>`,
'style.css':`p {
  font-weight: 700;
  margin: 0;
}

li {
  list-style: none;
}

.container {
  padding: 10px;
  background-color: gold;
  /* TODO 1: line the children up in a row */
  /* TODO 2: put some space between them */
}
`},
  solution:{
'style.css':`p {
  font-weight: 700;
  margin: 0;
}

li {
  list-style: none;
}

.container {
  padding: 10px;
  background-color: gold;
  display: flex;
  gap: 10px;
}
`},
  quiz:[
    { q:'Where does <code>display: flex</code> go?', options:['On every child you want in the row','On the parent element that wraps the children','On <code>&lt;body&gt;</code> only','On the first child'], answer:1, why:'The container gets display: flex, and its direct children become flex items automatically.' },
    { q:'A container holds a <code>&lt;div&gt;</code>, a <code>&lt;span&gt;</code> and a <code>&lt;p&gt;</code>. After <code>display: flex</code>, how are they laid out?', options:['The div and the p stay on their own lines','All three sit side by side in one row','Only the span moves','Nothing changes until you add widths'], answer:1, why:'Flex items follow flexbox rules, so whether a child used to be block or inline no longer matters.' },
    { q:'What does <code>inline-flex</code> change compared with <code>flex</code>?', options:['The children stack in a column','The container is only as wide as its contents and can share a line with other content','gap stops working','Nothing at all'], answer:1, why:'It mirrors block vs inline-block: the items behave the same, only the container\'s outer behaviour changes.' },
    { q:'Which job is <code>float</code> still the right tool for?', options:['Three-column page layouts','Centring a card','Wrapping text around an image','Building a nav bar'], answer:2, why:'Floats were designed for text wrap. For page structure, flexbox and grid are simpler and sturdier.' },
  ],
  explore:[
  {
    title:'Five ways to build three columns', height:560,
    note:'The lecture\'s history lesson, live. Pick a method, then drag the container narrower and watch what happens to the columns and to the pink footer underneath them.',
    html:`
<div class="knobs">
  <label>method
    <select id="m">
      <option value="table">HTML table</option>
      <option value="inline">display: inline-block</option>
      <option value="abs">position: absolute</option>
      <option value="float">float</option>
      <option value="flex" selected>display: flex</option>
    </select>
  </label>
  <label>container width <input type="range" id="w" min="220" max="640" value="560"><span class="val" id="wv"></span></label>
</div>
<div class="stage"><div id="st"></div></div>
<pre class="readout" id="code"></pre>
<p class="note" id="verdict"></p>
<style>
  #st{border:2px dashed #b9c0d4;padding:8px;font-size:12px;line-height:1.35;max-width:100%;min-height:210px}
  #st .c{background:#5b9cff;color:#fff;padding:8px;border-radius:4px}
  #st .c2{background:#7ee0a8;color:#123}
  #st .c3{background:#ffcf6b;color:#123}
  #st .foot{background:#ff9aa2;color:#123;padding:6px 8px;border-radius:4px;margin-top:8px}
  #st table{width:100%;border-spacing:6px}
  #st td{vertical-align:top}
  .m-table .c1,.m-table .c2{width:25%} .m-table .c3{width:40%}
  .m-inline .c{display:inline-block} .m-inline .c1,.m-inline .c2{width:25%} .m-inline .c3{width:40%}
  .m-abs .cols{position:relative} .m-abs .c{position:absolute;top:0}
  .m-abs .c1{left:0;width:25%} .m-abs .c2{left:27%;width:25%} .m-abs .c3{left:54%;width:40%}
  .m-float .c{float:left;margin:0 6px 6px 0} .m-float .c1,.m-float .c2{width:25%} .m-float .c3{width:40%}
  .m-flex .cols{display:flex;gap:8px}
</style>
<script>
  var T = ['Short column.',
    'A middle column with a bit more to say than the first one.',
    'The longest column. It keeps going so you can see what each method does when the columns have different heights and the box gets narrow.'];
  function cols(tag){ return T.map(function(t,i){ return '<' + tag + ' class="c c' + (i+1) + '">' + t + '</' + tag + '>'; }).join(''); }
  var CODE = {
    table: '<table>\\n  <tr>\\n    <td class="col1">…</td> <td class="col2">…</td> <td class="col3">…</td>\\n  </tr>\\n</table>\\n\\ntable { width: 100%; }\\n.col1, .col2 { width: 25%; }\\n.col3 { width: 40%; }',
    inline: '.col { display: inline-block; }\\n.col1, .col2 { width: 25%; }\\n.col3 { width: 40%; }\\n/* plus vertical-align: top, or the tops will not line up */',
    abs: '.cols { position: relative; }\\n.col  { position: absolute; top: 0; }\\n.col1 { left: 0;   width: 25%; }\\n.col2 { left: 27%; width: 25%; }\\n.col3 { left: 54%; width: 40%; }',
    float: '.col  { float: left; }\\n.col1, .col2 { width: 25%; }\\n.col3 { width: 40%; }\\n/* the footer needs clear: both to stay below */',
    flex: '.cols {\\n  display: flex;\\n  gap: 8px;\\n}'
  };
  var VERDICT = {
    table: 'It works, but a table tells browsers, search engines and screen readers that this is tabular data. Using one for page layout misuses HTML, and the cells cannot rearrange themselves on a phone.',
    inline: 'The boxes behave like words on a line of text, so they line up along their last line of text instead of their tops, and the line breaks between the tags in the HTML turn into small gaps.',
    abs: 'Each column is lifted out of the normal flow and placed by hand. The wrapper no longer knows how tall its children are, so the footer slides up underneath them, and adding a column means recalculating every left value.',
    float: 'Floats were made for wrapping text around an image. As columns they half-work: the wrapper collapses and the footer creeps up beside the columns unless you add clear: both (or the old clearfix hack).',
    flex: 'Two declarations. The columns sit side by side, share the width according to their content, stretch to the same height, and the footer stays underneath where it belongs.'
  };
  var m = document.getElementById('m'), w = document.getElementById('w');
  function upd(){
    var st = document.getElementById('st');
    st.className = 'm-' + m.value;
    st.style.width = w.value + 'px';
    document.getElementById('wv').textContent = w.value + 'px';
    st.innerHTML = (m.value === 'table' ? '<table class="cols"><tr>' + cols('td') + '</tr></table>' : '<div class="cols">' + cols('div') + '</div>') +
      '<div class="foot">footer (the content that comes next)</div>';
    document.getElementById('code').textContent = CODE[m.value];
    document.getElementById('verdict').textContent = VERDICT[m.value];
  }
  m.addEventListener('change', upd); w.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'flex vs inline-flex, px vs rem', height:430,
    note:'Three different kinds of element inside one container. Switch the container between <code>flex</code>, <code>inline-flex</code> and plain <code>block</code>, then change the root font size and compare a <code>10px</code> gap with a <code>1rem</code> gap.',
    html:`
<div class="knobs">
  <label>.container display
    <select data-css="#c|display"><option>flex</option><option>inline-flex</option><option>block</option></select>
  </label>
  <label>gap
    <select data-css="#c|gap"><option>10px</option><option>1rem</option><option>0px</option></select>
  </label>
  <label>root font-size <input type="range" min="10" max="28" value="16" data-css="html|font-size|px"><span class="val"></span></label>
</div>
<div class="stage">
  Some text before the container.
  <div id="c" style="padding:8px;border:3px solid gold;background:#fff8d6;vertical-align:middle">
    <div class="box">a div</div>
    <span class="box b">a span</span>
    <p class="box c" style="margin:0">a p</p>
  </div>
  Some text after it.
</div>
<pre class="readout" id="ro"></pre>
<script>
  window.demoInit = function(){
    var c = document.getElementById('c');
    function upd(){
      var cs = getComputedStyle(c);
      var msg = cs.display === 'flex' ? 'flex: the container is block-level. It fills the line, so the text goes above and below it.'
        : cs.display === 'inline-flex' ? 'inline-flex: the container shrink-wraps its children and sits on the line with the text.'
        : 'block (no flexbox): the div and the p each take a full line, the span sits inline.';
      document.getElementById('ro').textContent =
        '.container { display: ' + cs.display + '; gap: ' + cs.columnGap + '; }\\n\\n' +
        msg + '\\n' +
        'container width: ' + Math.round(c.getBoundingClientRect().width) + 'px\\n' +
        'root font-size: ' + getComputedStyle(document.documentElement).fontSize + '  (a 1rem gap follows it, a 10px gap never changes)';
    }
    document.addEventListener('input', function(){ setTimeout(upd, 0); });
    document.addEventListener('change', function(){ setTimeout(upd, 0); });
    upd();
  };
<\/script>`
  },
  {
    title:'The full flexbox playground', height:700,
    note:'A preview of the next three lectures: every container property that matters, on one panel. Change <code>flex-direction</code> first: everything else (justify vs align) flips meaning with it, which is the part everyone finds confusing.',
    html:`
<div class="knobs">
  <label>flex-direction
    <select data-css="#c|flex-direction">
      <option>row</option><option>row-reverse</option>
      <option>column</option><option>column-reverse</option>
    </select>
  </label>
  <label>justify-content
    <select data-css="#c|justify-content">
      <option>flex-start</option><option>center</option><option>flex-end</option>
      <option>space-between</option><option>space-around</option><option>space-evenly</option>
    </select>
  </label>
  <label>align-items
    <select data-css="#c|align-items">
      <option>stretch</option><option selected>center</option>
      <option>flex-start</option><option>flex-end</option><option>baseline</option>
    </select>
  </label>
  <label>flex-wrap
    <select data-css="#c|flex-wrap"><option>nowrap</option><option>wrap</option></select>
  </label>
  <label>gap <input type="range" min="0" max="40" value="10" data-css="#c|gap|px"><span class="val"></span></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;align-items:center;gap:10px;height:220px;background:#eef1f9;border:2px dashed #b9c0d4;padding:10px">
    <div class="box" style="width:80px">1</div>
    <div class="box b" style="width:80px;height:90px">2</div>
    <div class="box c" style="width:80px;height:60px">3</div>
    <div class="box d" style="width:80px">4</div>
  </div>
</div>
<pre class="readout" data-readout="#c"></pre>
<pre class="readout" id="axis"></pre>
<script>
  var dir = document.querySelector('select[data-css="#c|flex-direction"]');
  function upd(){
    var row = dir.value.indexOf('row') === 0;
    document.getElementById('axis').textContent =
      'flex-direction: ' + dir.value + '\\n\\n' +
      'MAIN axis  is ' + (row ? 'HORIZONTAL' : 'VERTICAL  ') + '  -> justify-content moves items ' + (row ? 'left/right' : 'up/down') + '\\n' +
      'CROSS axis is ' + (row ? 'VERTICAL  ' : 'HORIZONTAL') + '  -> align-items    moves items ' + (row ? 'up/down' : 'left/right');
  }
  dir.addEventListener('change', upd); setTimeout(upd, 40);
<\/script>`
  }],
  notes:`
    <h3>Container vs item</h3>
    <p>Flexbox properties split into two groups, and mixing them up is the usual source of confusion:</p>
    <table>
      <tr><th>On the CONTAINER</th><th>On the ITEMS</th></tr>
      <tr><td><code>display: flex</code></td><td><code>flex-grow</code></td></tr>
      <tr><td><code>flex-direction</code></td><td><code>flex-shrink</code></td></tr>
      <tr><td><code>justify-content</code></td><td><code>flex-basis</code></td></tr>
      <tr><td><code>align-items</code></td><td><code>flex</code> (all three)</td></tr>
      <tr><td><code>flex-wrap</code>, <code>gap</code></td><td><code>align-self</code>, <code>order</code></td></tr>
    </table>
    <h3>About the starter markup</h3>
    <p>The course's page puts <code>&lt;li&gt;</code> elements straight inside a <code>&lt;div&gt;</code>. Browsers cope, but strictly a list item belongs in a <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>. In a real nav bar you would make the <code>&lt;ul&gt;</code> the flex container.</p>`
});


PG.add({
  id:'s09-flex-direction', index:55, udemyId:37368266, minutes:14, section:'s09', slug:'flex-direction', kind:'build',
  title:'Flex Direction',
  blurb:'<code>flex-direction</code> sets the <b>main axis</b>: <code>row</code> (the default) runs left to right, <code>column</code> runs top to bottom, and the <b>cross axis</b> is always the other way. Item properties such as <code>flex-basis</code> follow the main axis, so the same value means width in a row and height in a column.',
  tasks:[
    'The rule for this exercise: change only <code>style.css</code>, never the HTML. First give <code>.container</code> <code>flex-direction: column</code> so the colours stack top to bottom.',
    'The stack now stretches across the whole preview. Change <code>display: flex</code> to <code>display: inline-flex</code> so the gold box is only as wide as its longest label.',
    'Try <code>flex-basis: 100px</code> on <code>.container</code> itself. Nothing happens: it is an <b>item</b> property, so it belongs on the children.',
    'The colour divs share no class, so select them with the child combinator: <code>.container &gt; *</code> means "every direct child". Give that rule <code>flex-basis: 100px</code> and each colour becomes 100px tall.',
    'Switch <code>flex-direction</code> back to <code>row</code> for a moment: the same <code>flex-basis</code> now sets each item\'s <b>width</b>. Return to <code>column</code> for the solution.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flex Direction</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <div class="red">Red</div>
    <div class="orange">Orange</div>
    <div class="yellow">Yellow</div>
    <div class="green">Green</div>
    <div class="blue">Blue</div>
    <div class="indigo">Indigo</div>
    <div class="purple">Purple</div>
  </div>
</body>
</html>`,
'style.css':`.container {
  color: white;
  border: 5px solid gold;
  display: flex; /* TODO 2: make the container only as wide as its content */
  /* TODO 1: stack the items from top to bottom */
}

/* TODO 3: select every direct child of .container and give it a flex-basis of 100px */


.red {
  background-color: #eb4d4b;
}

.orange {
  background-color: #f0932b;
}

.yellow {
  background-color: #f6e58d;
  color: #333;
}

.green {
  background-color: #6ab04c;
}

.blue {
  background-color: #4834d4;
}

.indigo {
  background-color: #30336b;
}

.purple {
  background-color: #be2edd;
}
`},
  solution:{
'style.css':`.container {
  color: white;
  border: 5px solid gold;
  display: inline-flex;
  flex-direction: column;
}

.container > * {
  flex-basis: 100px;
}

.red {
  background-color: #eb4d4b;
}

.orange {
  background-color: #f0932b;
}

.yellow {
  background-color: #f6e58d;
  color: #333;
}

.green {
  background-color: #6ab04c;
}

.blue {
  background-color: #4834d4;
}

.indigo {
  background-color: #30336b;
}

.purple {
  background-color: #be2edd;
}
`},
  quiz:[
    { q:'In a container with <code>flex-direction: column</code>, what does <code>flex-basis: 100px</code> on the items set?', options:['Their width','Their height','The gap between them','The container\'s height'], answer:1, why:'flex-basis sizes items along the main axis, and a column\'s main axis runs top to bottom.' },
    { q:'With the default <code>flex-direction: row</code>, which way does the cross axis run?', options:['Left to right','Right to left','Top to bottom','There is no cross axis'], answer:2, why:'The cross axis is always perpendicular to the main axis, so a horizontal row has a vertical cross axis.' },
    { q:'You put <code>flex-basis: 100px</code> on <code>.container</code> and nothing changes. Why?', options:['flex-basis needs !important','It is an item property, so it has to go on the children','px values are not allowed for flex-basis','The container needs a width first'], answer:1, why:'display, flex-direction and gap belong on the container; flex-basis is read from each flex item.' },
    { q:'What does <code>.container &gt; *</code> select?', options:['Every element inside .container at any depth','Only the first child','Every direct child of .container','.container itself'], answer:2, why:'> means "direct child" and * means "any element", so grandchildren are left out.' },
  ],
  explore:[
  {
    title:'Main axis, cross axis and flex-basis', height:600,
    note:'Change the direction and watch the axis labels turn. The same <code>flex-basis</code> slider sizes the items along whichever way the main axis runs.',
    html:`
<div class="knobs">
  <label>flex-direction
    <select id="dir"><option>row</option><option selected>column</option><option>row-reverse</option><option>column-reverse</option></select>
  </label>
  <label>flex-basis on the items <input type="range" id="fb" min="30" max="140" value="60"><span class="val" id="fbv"></span></label>
</div>
<div class="stage" style="min-height:330px">
  <div style="position:relative;display:inline-block;padding:30px 10px 10px 34px">
    <div id="top" class="axis-lbl" style="top:4px;left:34px"></div>
    <div id="left" class="axis-lbl vert"></div>
    <div id="c" style="display:inline-flex;flex-direction:column;border:4px solid gold">
      <div class="box">1</div><div class="box b">2</div><div class="box c">3</div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .axis-lbl{position:absolute;font-size:12px;font-weight:700;color:#3c435c;white-space:nowrap}
  .axis-lbl.vert{left:8px;top:30px;writing-mode:vertical-rl}
  .axis-lbl.main{color:#d6336c}
</style>
<script>
  var dir = document.getElementById('dir'), fb = document.getElementById('fb'), c = document.getElementById('c');
  function upd(){
    var d = dir.value, row = d.indexOf('row') === 0, rev = d.indexOf('reverse') > 0;
    c.style.flexDirection = d;
    [].forEach.call(c.children, function(k){ k.style.flexBasis = fb.value + 'px'; });
    document.getElementById('fbv').textContent = fb.value + 'px';
    var tl = document.getElementById('top'), ll = document.getElementById('left');
    /* the left label is written vertically, so its arrow -> points down and <- points up */
    tl.textContent = row ? 'main axis ' + (rev ? '<-' : '->') : 'cross axis ->';
    ll.textContent = row ? 'cross axis ->' : 'main axis ' + (rev ? '<-' : '->');
    tl.className = 'axis-lbl' + (row ? ' main' : '');
    ll.className = 'axis-lbl vert' + (row ? '' : ' main');
    var r = c.children[0].getBoundingClientRect();
    document.getElementById('ro').textContent =
      '.container { display: inline-flex; flex-direction: ' + d + '; }\\n' +
      '.container > * { flex-basis: ' + fb.value + 'px; }\\n\\n' +
      'item 1 measures ' + Math.round(r.width) + 'px wide x ' + Math.round(r.height) + 'px tall\\n' +
      '-> flex-basis is acting as the ' + (row ? 'WIDTH' : 'HEIGHT') + ', because the main axis is ' + (row ? 'horizontal' : 'vertical') + '.' +
      (rev ? '\\n-> the -reverse value flips the main axis, so item 1 now starts at the ' + (row ? 'right' : 'bottom') + '.' : '');
  }
  dir.addEventListener('change', upd); fb.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'Child combinator vs descendant selector', height:570,
    note:'The exercise uses <code>.container &gt; *</code>. Compare it with <code>.container *</code> (a space instead of <code>&gt;</code>) and see which elements each one reaches.',
    html:`
<div class="knobs">
  <label>selector
    <select id="sel">
      <option value=">">.container &gt; *   (direct children only)</option>
      <option value=" ">.container *   (every descendant, at any depth)</option>
    </select>
  </label>
</div>
<div class="stage">
  <div id="ct" class="ct">
    <div>div <span>span inside the div</span></div>
    <p>p <em>em inside the p</em> <strong>strong inside the p</strong></p>
    <section>section <div>div inside the section <b>b deeper still</b></div></section>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .ct{border:3px solid gold;padding:8px}
  .ct *{display:block;margin:4px 0 4px 14px;padding:4px 6px;border:1px solid #dfe3ee;border-radius:4px;background:#fff}
  .ct > *{margin-left:0}
  .hit{outline:3px solid #d6336c;background:#ffe3ec !important}
</style>
<script>
  var sel = document.getElementById('sel');
  function upd(){
    document.querySelectorAll('.hit').forEach(function(e){ e.classList.remove('hit'); });
    var q = sel.value === '>' ? '#ct > *' : '#ct *';
    var hits = document.querySelectorAll(q);
    hits.forEach(function(e){ e.classList.add('hit'); });
    document.getElementById('ro').textContent = (sel.value === '>' ? '.container > *' : '.container *') + '  matches ' + hits.length + ' elements:\\n' +
      [].map.call(hits, function(e){ var d = 0, p = e.parentElement; while (p && p.id !== 'ct'){ d++; p = p.parentElement; } return '  ' + '  '.repeat(d) + '<' + e.tagName.toLowerCase() + '>'; }).join('\\n');
  }
  sel.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>flex-basis is direction-aware</h3>
    <ul>
      <li><code>flex-direction: row</code>: <code>flex-basis</code> behaves like <b>width</b>.</li>
      <li><code>flex-direction: column</code>: <code>flex-basis</code> behaves like <b>height</b>.</li>
    </ul>
    <h3>flex vs inline-flex</h3>
    <p><code>display: flex</code> makes the container block-level, so it takes the full width available. <code>display: inline-flex</code> makes it shrink-wrap its contents, which is why the column version needs it here.</p>`
});


PG.add({
  id:'l056', index:56, udemyId:37368332, minutes:19, section:'s09', slug:'flex-layout', kind:'build',
  title:'Flex Layout',
  blurb:'The everyday layout properties come in two groups. On the <b>container</b>: <code>justify-content</code> (main axis), <code>align-items</code> (cross axis), <code>flex-wrap</code>, and <code>align-content</code> for wrapped lines. On a single <b>item</b>: <code>order</code> and <code>align-self</code>. Ask "parent or child?" before you type.',
  tasks:[
    'The rainbow container is <code>70vh</code> tall, so there is room to move things. Centre the items both ways with <code>justify-content: center</code> and <code>align-items: center</code>.',
    'Change <code>justify-content</code> to <code>space-between</code>, then <code>space-around</code>, then <code>space-evenly</code>, and compare the space at the two ends. Leave it on <code>space-evenly</code>.',
    'Without touching the HTML, send Green to the end of the row: give <code>.green</code> <code>order: 1</code> (every item starts at 0).',
    'Let Red break ranks: <code>align-self: flex-start</code> on <code>.red</code> puts it at the top while the others stay centred.',
    'Switch the preview to <b>Phone 375</b>: the items get squashed. Add <code>flex-wrap: wrap</code> to the container so the ones that do not fit move to a new line. How those lines are spread out is <code>align-content</code>\'s job: try its values in the Explore tab.',
    'Then practise: the frog pond in the Explore tab, and <a href="https://flexboxfroggy.com/" target="_blank" rel="noopener">Flexbox Froggy</a> on intermediate difficulty.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flex Layout</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="container">
    <div class="red">Red</div>
    <div class="orange">Orange</div>
    <div class="yellow">Yellow</div>
    <div class="green">Green</div>
    <div class="blue">Blue</div>
    <div class="indigo">Indigo</div>
    <div class="purple">Purple</div>
  </div>
</body>
</html>`,
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

.container {
  display: flex;
  height: 70vh;
  border: 5px solid gold;
  color: white;
  /* TODO 1: centre the items on the main axis and on the cross axis */
  /* TODO 5: let items that do not fit move onto a new line */
}

.container > * {
  width: 150px;
  padding: 20px 0;
  text-align: center;
  font-size: 1.2rem;
}

/* TODO 3: move Green to the end without editing the HTML */

/* TODO 4: let Red sit at the top while the others stay centred */

.red {
  background-color: #eb4d4b;
}

.orange {
  background-color: #f0932b;
}

.yellow {
  background-color: #f6e58d;
  color: #333;
}

.green {
  background-color: #6ab04c;
}

.blue {
  background-color: #4834d4;
}

.indigo {
  background-color: #30336b;
}

.purple {
  background-color: #be2edd;
}
`},
  solution:{
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

.container {
  display: flex;
  height: 70vh;
  border: 5px solid gold;
  color: white;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}

.container > * {
  width: 150px;
  padding: 20px 0;
  text-align: center;
  font-size: 1.2rem;
}

.green {
  order: 1;
}

.red {
  align-self: flex-start;
}

.red {
  background-color: #eb4d4b;
}

.orange {
  background-color: #f0932b;
}

.yellow {
  background-color: #f6e58d;
  color: #333;
}

.green {
  background-color: #6ab04c;
}

.blue {
  background-color: #4834d4;
}

.indigo {
  background-color: #30336b;
}

.purple {
  background-color: #be2edd;
}
`},
  quiz:[
    { q:'Which property moves items along the <b>main</b> axis?', options:['align-items','justify-content','align-content','align-self'], answer:1, why:'justify-content distributes items along the main axis; the align-* properties work across it.' },
    { q:'<code>align-items: center</code> seems to do nothing in a row container. What is the likely reason?', options:['align-items only works in columns','The container is only as tall as its items, so there is no spare height to centre in','You need flex-wrap first','It has to go on the items'], answer:1, why:'Cross-axis alignment needs free space. Give the container a height, as the exercise does with 70vh.' },
    { q:'Which of these belongs on a single flex <b>item</b> rather than the container?', options:['justify-content','flex-wrap','align-self','align-content'], answer:2, why:'order and align-self are item properties; the other three are set on the container.' },
    { q:'Which value gives equal space everywhere, including before the first item and after the last?', options:['space-between','space-around','space-evenly','center'], answer:2, why:'space-between leaves no space at the ends, space-around gives the ends half a gap, space-evenly makes every gap identical.' },
    { q:'When does <code>align-content</code> have a visible effect?', options:['Always','Only with flex-direction: column','Only when the items wrap onto more than one line','Only when order is set'], answer:2, why:'It positions the lines of a multi-line container. With nowrap there is only one line, so there is nothing for it to arrange.' },
  ],
  explore:[
  {
    title:'Frog pond: put every frog on its lily pad', height:680,
    note:'A small Flexbox Froggy of our own. Edit the CSS under the pond and the frogs move as you type; each dashed ring is where a frog of that colour has to land. Most levels need only container properties on <code>#pond</code>; levels 9 and 10 also need a rule for one coloured frog.',
    html:`
<div class="knobs" style="justify-content:space-between">
  <b id="lvl"></b>
  <span><button id="prev">&#9664; back</button> <button id="reset">reset level</button> <button id="next">next &#9654;</button></span>
</div>
<p class="note" id="brief" style="font-size:13.5px;color:#1c2030"></p>
<div id="water">
  <div id="pads" class="pond"></div>
  <div id="pond" class="pond"></div>
</div>
<textarea id="css" spellcheck="false"></textarea>
<p class="note" id="status"></p>
<style id="userCss"></style>
<style id="padCss"></style>
<style>
  #water{position:relative;height:230px;background:linear-gradient(#bfe6ff,#8fcaf0);border-radius:10px;overflow:hidden;margin-bottom:10px}
  .pond{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;padding:10px}
  .pad,.frog{width:54px;height:54px;flex:0 0 54px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .pad{border:4px dashed}
  .p-green{border-color:#2e9e4f;background:rgba(46,158,79,.15)}
  .p-yellow{border-color:#c99a00;background:rgba(240,200,40,.2)}
  .p-red{border-color:#d33;background:rgba(221,51,51,.15)}
  .frog span{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;box-shadow:0 2px 4px rgba(0,0,0,.3)}
  .frog.green span{background:#2e9e4f} .frog.yellow span{background:#f0c828} .frog.red span{background:#e05555}
  #css{width:100%;height:150px;font-family:ui-monospace,Menlo,monospace;font-size:13px;border:1px solid #cfd5e6;border-radius:8px;padding:10px;resize:vertical}
  #status{font-weight:700;font-size:13.5px}
  #status.ok{color:#1d8a4a} #status.no{color:#b25b00}
</style>
<script>
  var LEVELS = [
    { brief:'Move the frog to the lily pad on the right. Use <b>justify-content</b>.', frogs:['green'], pond:'justify-content: flex-end;' },
    { brief:'Centre the frog on the main axis.', frogs:['green'], pond:'justify-content: center;' },
    { brief:'Three frogs, equal space around each one. Try the space-* values.', frogs:['green','yellow','red'], pond:'justify-content: space-around;' },
    { brief:'First and last frog touch the edges, the gaps between them are equal.', frogs:['green','yellow','red'], pond:'justify-content: space-between;' },
    { brief:'Now the cross axis: send the frogs to the bottom with <b>align-items</b>.', frogs:['green','yellow','red'], pond:'align-items: flex-end;' },
    { brief:'Dead centre on both axes.', frogs:['green'], pond:'justify-content: center; align-items: center;' },
    { brief:'The pads are in reverse order. Change the <b>flex-direction</b>, not the HTML.', frogs:['green','yellow','red'], pond:'flex-direction: row-reverse;' },
    { brief:'Stack the frogs in a column in the bottom-right corner. (In a column, justify-content works vertically.)', frogs:['green','yellow','red'], pond:'flex-direction: column; justify-content: flex-end; align-items: flex-end;' },
    { brief:'Item property: only the yellow frog should move to the end. Add a rule for <code>.yellow</code> below the #pond rule and use <b>order</b>.', frogs:['green','yellow','red'], pond:'', item:{ yellow:'order: 1;' } },
    { brief:'Everyone sits at the top except the red frog, which goes to the bottom. Use <b>align-items</b> on #pond and <b>align-self</b> on <code>.red</code>.', frogs:['green','yellow','red'], pond:'align-items: flex-start;', item:{ red:'align-self: flex-end;' } },
    { brief:'Too many frogs for one line in this narrow pond. Let them <b>wrap</b>.', frogs:['green','yellow','red','green','yellow','red','green'], pond:'flex-wrap: wrap;', width:250 },
    { brief:'Last one: wrapped lines, packed into the middle of the pond. Combine <b>flex-wrap</b> and <b>align-content</b>.', frogs:['green','yellow','red','green','yellow','red','green'], pond:'flex-wrap: wrap; align-content: center;', width:250 }
  ];
  var i = 0, css = document.getElementById('css'), pond = document.getElementById('pond'), pads = document.getElementById('pads');
  function starter(L){
    var s = '#pond {\\n  display: flex;\\n  \\n}\\n';
    if (L.item) Object.keys(L.item).forEach(function(c){ s += '\\n.' + c + ' {\\n  \\n}\\n'; });
    return s;
  }
  function load(n){
    i = Math.max(0, Math.min(LEVELS.length - 1, n));
    var L = LEVELS[i];
    document.getElementById('lvl').textContent = 'Level ' + (i + 1) + ' of ' + LEVELS.length;
    document.getElementById('brief').innerHTML = L.brief;
    pads.innerHTML = L.frogs.map(function(c){ return '<div class="pad p-' + c + '"></div>'; }).join('');
    pond.innerHTML = L.frogs.map(function(c){ return '<div class="frog ' + c + '"><span>&#128056;</span></div>'; }).join('');
    var w = L.width ? 'width:' + L.width + 'px;right:auto;' : '';
    pads.style.cssText = w; pond.style.cssText = w;
    var pc = '#pads {' + L.pond + '}';
    if (L.item) Object.keys(L.item).forEach(function(c){ pc += ' #pads .p-' + c + ' {' + L.item[c] + '}'; });
    document.getElementById('padCss').textContent = pc;
    css.value = starter(L);
    apply();
  }
  function apply(){
    document.getElementById('userCss').textContent = css.value;
    check();   /* reading positions forces a fresh layout, so no need to wait a frame */
  }
  function check(){
    var f = pond.querySelectorAll('.frog'), p = pads.querySelectorAll('.pad'), on = 0;
    for (var k = 0; k < f.length; k++){
      var a = f[k].getBoundingClientRect(), b = p[k].getBoundingClientRect();
      if (Math.abs(a.left - b.left) < 5 && Math.abs(a.top - b.top) < 5) on++;
    }
    var st = document.getElementById('status');
    if (on === f.length){ st.className = 'note ok'; st.textContent = 'Every frog is on its pad. ' + (i < LEVELS.length - 1 ? 'On to the next level.' : 'That was the last level: well done.'); }
    else { st.className = 'note no'; st.textContent = on + ' of ' + f.length + ' frogs on their pads.'; }
  }
  css.addEventListener('input', apply);
  document.getElementById('prev').onclick = function(){ load(i - 1); };
  document.getElementById('next').onclick = function(){ load(i + 1); };
  document.getElementById('reset').onclick = function(){ load(i); };
  load(0);
<\/script>`
  },
  {
    title:'Row vs column: the axis flip', height:480,
    note:'The same two properties, side by side, in both directions. This is the mental model worth locking in.',
    html:`
<div class="knobs">
  <label>justify-content
    <select id="j">
      <option>flex-start</option><option selected>center</option><option>flex-end</option><option>space-between</option>
    </select>
  </label>
  <label>align-items
    <select id="a">
      <option>flex-start</option><option selected>center</option><option>flex-end</option><option>stretch</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:14px">
  <div style="flex:1">
    <h4>flex-direction: row</h4>
    <div id="r" style="display:flex;height:180px;background:#eef1f9;border:2px dashed #b9c0d4;padding:8px;gap:6px">
      <div class="box" style="width:52px">1</div><div class="box b" style="width:52px">2</div><div class="box c" style="width:52px">3</div>
    </div>
  </div>
  <div style="flex:1">
    <h4>flex-direction: column</h4>
    <div id="cl" style="display:flex;flex-direction:column;height:180px;background:#eef1f9;border:2px dashed #b9c0d4;padding:8px;gap:6px">
      <div class="box" style="width:52px">1</div><div class="box b" style="width:52px">2</div><div class="box c" style="width:52px">3</div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var j = document.getElementById('j'), a = document.getElementById('a');
  function upd(){
    ['r','cl'].forEach(function(id){
      var el = document.getElementById(id);
      el.style.justifyContent = j.value;
      el.style.alignItems = a.value;
    });
    document.getElementById('ro').textContent =
      'justify-content: ' + j.value + ';   /* row: left-right   |  column: up-down   */\\n' +
      'align-items:     ' + a.value + ';   /* row: up-down      |  column: left-right */';
  }
  j.addEventListener('change', upd); a.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Wrapped lines: align-items vs align-content', height:650,
    note:'Seven boxes of different heights in a wrapping container. <code>align-items</code> places each box inside its own line; <code>align-content</code> places the lines inside the container. Set <code>flex-wrap: nowrap</code> and watch align-content stop doing anything.',
    html:`
<div class="knobs">
  <label>flex-wrap <select data-css="#c|flex-wrap"><option>wrap</option><option>nowrap</option><option>wrap-reverse</option></select></label>
  <label>align-content <select data-css="#c|align-content"><option>normal</option><option>flex-start</option><option>center</option><option>flex-end</option><option>space-between</option><option>space-around</option></select></label>
  <label>align-items <select data-css="#c|align-items"><option>stretch</option><option>flex-start</option><option>center</option><option>flex-end</option></select></label>
  <label>justify-content <select data-css="#c|justify-content"><option>flex-start</option><option>center</option><option>space-between</option><option>space-evenly</option></select></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;flex-wrap:wrap;height:250px;max-width:460px;border:2px dashed #b9c0d4;gap:6px;padding:6px;background:#eef1f9">
    <div class="box" style="width:110px;min-height:40px">1</div>
    <div class="box b" style="width:110px;min-height:70px">2</div>
    <div class="box c" style="width:110px;min-height:40px">3</div>
    <div class="box d" style="width:110px;min-height:55px">4</div>
    <div class="box" style="width:110px;min-height:40px">5</div>
    <div class="box b" style="width:110px;min-height:40px">6</div>
    <div class="box c" style="width:110px;min-height:60px">7</div>
  </div>
</div>
<pre class="readout" data-readout="#c"></pre>
<pre class="readout" id="ro"></pre>
<script>
  window.demoInit = function(){
    function upd(){
      var tops = {};
      [].forEach.call(document.getElementById('c').children, function(k){ tops[Math.round(k.getBoundingClientRect().top)] = 1; });
      var n = Object.keys(tops).length;
      document.getElementById('ro').textContent = n + ' line' + (n > 1 ? 's' : '') + ' of items.\\n' +
        (n > 1 ? 'align-content is spreading those lines through the 250px height.' : 'Only one line, so align-content has nothing to arrange; align-items does all the work.');
    }
    document.addEventListener('change', function(){ setTimeout(upd, 0); });
    upd();
  };
<\/script>`
  }],
  notes:`
    <h3>Parent or child?</h3>
    <table>
      <tr><th>Container (parent)</th><th>Item (child)</th></tr>
      <tr><td><code>justify-content</code> · main axis</td><td><code>order</code> · default 0, higher goes later</td></tr>
      <tr><td><code>align-items</code> · cross axis</td><td><code>align-self</code> · overrides align-items for one item</td></tr>
      <tr><td><code>flex-wrap</code> · <code>nowrap</code> (no hyphen) / <code>wrap</code> / <code>wrap-reverse</code></td><td></td></tr>
      <tr><td><code>align-content</code> · only with wrapped lines</td><td></td></tr>
    </table>
    <h3>A caution about order</h3>
    <p><code>order</code> only changes what you see. Keyboard focus and screen readers still follow the HTML order, so do not use it to fix content that is in the wrong place in the markup.</p>
    <h3>Cheat sheet</h3>
    <p>The <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noopener">CSS-Tricks flexbox guide</a> lists every property with pictures, split into parent and child. Look things up as you need them; nobody memorises all of it.</p>`
});


PG.add({
  id:'l057', index:57, udemyId:37368390, minutes:24, section:'s09', slug:'flex-sizing', kind:'build',
  title:'Flex Sizing',
  blurb:'How wide does a flex item end up? The browser checks, in order: <code>min-width</code>/<code>max-width</code> (hard limits), then <code>flex-basis</code>, then <code>width</code>, then the content itself. <code>flex-grow</code> and <code>flex-shrink</code> decide whether the item may stretch into spare space or give some up, and <code>flex</code> sets all three at once.',
  tasks:[
    'Drag the <b>Container width</b> slider and study the green target. At full width its items are 100px, 100px and 200px, with the spare space between them; as it narrows, <b>only Item 1</b> gets smaller. (The course\'s version uses 200 / 200 / 400px. Everything here is half size so it fits the preview.)',
    'Spread your blue items out the same way with <code>justify-content</code> on <code>.container</code>.',
    'Give your items starting sizes with <code>flex-basis</code>: 100px, 100px and 200px. At full width the two rows should now look identical.',
    'Drag the slider again: all three of yours shrink. Use <code>flex-shrink</code> on Items 2 and 3 so that only Item 1 gives up space, then test the whole range.',
    'Check yourself against the target\'s CSS in the <code>&lt;style&gt;</code> block of <code>index.html</code>. It uses the <code>flex</code> shorthand (<i>grow shrink basis</i>): translate each line back into the longhand you wrote.',
    'Experiment on <code>.item1</code>, then undo: <code>width: 300px</code> is ignored (flex-basis wins), <code>max-width: 60px</code> beats flex-basis, and so does <code>min-width: 150px</code>.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flex Sizing</title>
  <link rel="stylesheet" href="./style.css" />
  <style>
    /* The target's own CSS. It uses the shorthand  flex: grow shrink basis;
       Try to match it without peeking, then use it to check yourself. */
    .target { justify-content: space-between; }
    .goal1 { flex: 0 1 100px; }
    .goal2 { flex: 0 0 100px; }
    .goal3 { flex: 0 0 200px; }
  </style>
</head>
<body>
  <label class="resizer">
    Container width
    <input type="range" min="160" max="500" value="500"
      oninput="document.body.style.setProperty('--width', this.value + 'px'); this.nextElementSibling.textContent = this.value + 'px';" />
    <output>500px</output>
  </label>

  <h2>Target (do not edit)</h2>
  <div class="target">
    <div class="goal1">Item 1</div>
    <div class="goal2">Item 2</div>
    <div class="goal3">Item 3</div>
  </div>

  <h2>Yours</h2>
  <div class="container">
    <div class="item1">Item 1</div>
    <div class="item2">Item 2</div>
    <div class="item3">Item 3</div>
  </div>
</body>
</html>`,
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

h2 {
  font-size: 1rem;
  margin: 18px 0 6px;
}

.resizer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

/* Both rows: flex containers whose width follows the slider */
.target,
.container {
  display: flex;
  width: var(--width, 500px);
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 3px dashed #999;
}

.target > div,
.container > div {
  padding: 14px 0;
  text-align: center;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  box-sizing: border-box;
}

.target > div { background-color: seagreen; }
.container > div { background-color: royalblue; }

/* ---------- Your CSS ---------- */

.container {
  /* TODO 1: spread the items out like the target */
}

.item1 {
  /* TODO 2: start at 100px */
}

.item2 {
  /* TODO 2: start at 100px */
  /* TODO 3: match the target when the container narrows */
}

.item3 {
  /* TODO 2: start at 200px */
  /* TODO 3: match the target when the container narrows */
}
`},
  solution:{
'style.css':`body {
  font-family: sans-serif;
  margin: 10px;
}

h2 {
  font-size: 1rem;
  margin: 18px 0 6px;
}

.resizer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

/* Both rows: flex containers whose width follows the slider */
.target,
.container {
  display: flex;
  width: var(--width, 500px);
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 3px dashed #999;
}

.target > div,
.container > div {
  padding: 14px 0;
  text-align: center;
  color: white;
  font-weight: bold;
  border: 2px solid white;
  box-sizing: border-box;
}

.target > div { background-color: seagreen; }
.container > div { background-color: royalblue; }

/* ---------- Your CSS ---------- */

.container {
  justify-content: space-between;
}

.item1 {
  flex-basis: 100px;          /* flex-shrink stays at its default of 1 */
}

.item2 {
  flex-basis: 100px;
  flex-shrink: 0;             /* same as the target's  flex: 0 0 100px */
}

.item3 {
  flex-basis: 200px;
  flex-shrink: 0;             /* same as the target's  flex: 0 0 200px */
}
`},
  quiz:[
    { q:'An item in a row container has <code>width: 100px</code> and <code>flex-basis: 200px</code>. What size does it start at?', options:['100px','200px','150px','Whatever its content needs'], answer:1, why:'flex-basis ranks above width, so the width is ignored. Setting both is pointless.' },
    { q:'<code>flex-basis: 200px</code> and <code>max-width: 100px</code> on the same item. How wide can it get?', options:['200px','100px','300px','It depends on flex-grow'], answer:1, why:'min-width and max-width are hard limits that beat every other sizing rule.' },
    { q:'What is <code>flex: 1</code> short for?', options:['flex-grow: 1 only','grow 1, shrink 1, basis 0','grow 1, shrink 0, basis auto','grow 0, shrink 1, basis 1px'], answer:1, why:'A single unitless number sets grow and shrink to that number and the basis to 0, so every item gets an equal share.' },
    { q:'With no sizing properties at all, how does a flex item behave?', options:['It grows and shrinks freely','It never changes size','It does not grow, but it can shrink','It grows but never shrinks'], answer:2, why:'The defaults are flex-grow: 0 and flex-shrink: 1, with flex-basis: auto.' },
    { q:'An item still has <code>flex-shrink: 1</code> but stops getting narrower. Why?', options:['flex-shrink only works once','It has reached its minimum content size, roughly its longest word','The container has a gap','Shrinking only happens in columns'], answer:1, why:'By default an item never shrinks below its min-content width, so a long word sets a floor.' },
  ],
  explore:[
  {
    title:'flex-grow, shrink and basis', height:560,
    note:'These three are what <code>flex: 1</code> is shorthand for. Give box 2 a bigger grow value and watch it take more of the leftover space.',
    html:`
<div class="knobs">
  <label>box 2 flex-grow <input type="range" min="0" max="4" value="0" data-css="#two|flex-grow"><span class="val"></span></label>
  <label>box 2 flex-basis <input type="range" min="60" max="260" value="100" data-css="#two|flex-basis|px"><span class="val"></span></label>
  <label>all others grow <input type="range" min="0" max="3" value="0" data-css="#one,#three|flex-grow"><span class="val"></span></label>
  <label>container width <input type="range" min="300" max="700" value="620" data-css="#c|width|px"><span class="val"></span></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;gap:8px;width:620px;background:#eef1f9;border:2px dashed #b9c0d4;padding:10px">
    <div class="box" id="one" style="flex-basis:100px">1</div>
    <div class="box b" id="two" style="flex-basis:100px">2</div>
    <div class="box c" id="three" style="flex-basis:100px">3</div>
  </div>
</div>
<pre class="readout" data-readout="#two"></pre>
<p class="note"><b>flex-grow</b>: how much of the LEFTOVER space this item claims, as a share. Everyone on 1 = equal split. One item on 2 while the others are on 1 = it gets double.<br>
<b>flex-basis</b>: the size it starts at before growing or shrinking.<br>
<b>flex-shrink</b>: how readily it gives space up when there is not enough. Default 1.<br>
<code>flex: 1</code> is shorthand for <code>flex-grow: 1; flex-shrink: 1; flex-basis: 0;</code></p>`
  },
  {
    title:'Grow and shrink switches', height:520,
    note:'The four combinations from the lecture. Pick one, then drag the container wider and narrower. The third box has a long word in it: watch it refuse to shrink past that word.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="g"> flex-grow: 1</label>
  <label><input type="checkbox" id="s" checked> flex-shrink: 1</label>
  <label>flex-basis <input type="range" id="b" min="40" max="200" value="120"><span class="val" id="bv"></span></label>
  <label>container width <input type="range" id="w" min="160" max="700" value="600"><span class="val" id="wv"></span></label>
</div>
<div class="stage">
  <div id="c" style="display:flex;gap:6px;border:2px dashed #b9c0d4;padding:6px;width:600px;background:#eef1f9">
    <div class="box">One</div><div class="box b">Two</div><div class="box c">Extraordinary</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var g = document.getElementById('g'), s = document.getElementById('s'), b = document.getElementById('b'), w = document.getElementById('w'), c = document.getElementById('c');
  var MSG = {
    '00': 'flex: 0 0 basis. Rigid: every item stays at its basis whatever the width. It overflows when the box is small and leaves a gap when it is big.',
    '10': 'flex: 1 0 basis. Grows into spare space but never shrinks below the basis, so it overflows when narrow.',
    '01': 'flex: 0 1 basis. The default for flex items: starts at the basis, never stretches, shrinks when space runs out, but never below its longest word.',
    '11': 'flex: 1 1 basis. Fully flexible: fills any spare space and gives it back when narrow. The basis is only a starting point.'
  };
  function upd(){
    var key = (g.checked ? '1' : '0') + (s.checked ? '1' : '0');
    c.style.width = w.value + 'px';
    [].forEach.call(c.children, function(k){ k.style.flex = (g.checked ? 1 : 0) + ' ' + (s.checked ? 1 : 0) + ' ' + b.value + 'px'; });
    document.getElementById('bv').textContent = b.value + 'px';
    document.getElementById('wv').textContent = w.value + 'px';
    var sizes = [].map.call(c.children, function(k){ return Math.round(k.getBoundingClientRect().width) + 'px'; });
    document.getElementById('ro').textContent = '.item { flex: ' + (g.checked ? 1 : 0) + ' ' + (s.checked ? 1 : 0) + ' ' + b.value + 'px; }\\n\\n' +
      'measured widths: ' + sizes.join('  |  ') + '\\n\\n' + MSG[key];
  }
  [g, s].forEach(function(e){ e.addEventListener('change', upd); });
  [b, w].forEach(function(e){ e.addEventListener('input', upd); });
  upd();
<\/script>`
  },
  {
    title:'Who decides the size?', height:470,
    note:'Switch the sizing rules on and off for one item and see which one wins. The priority list from the lecture is printed underneath, with the winner marked.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="uw" checked> width <input type="number" id="vw" value="100" style="width:64px">px</label>
  <label><input type="checkbox" id="ub"> flex-basis <input type="number" id="vb" value="200" style="width:64px">px</label>
  <label><input type="checkbox" id="umax"> max-width <input type="number" id="vmax" value="150" style="width:64px">px</label>
  <label><input type="checkbox" id="umin"> min-width <input type="number" id="vmin" value="260" style="width:64px">px</label>
</div>
<div class="stage">
  <div style="display:flex;gap:8px;border:2px dashed #b9c0d4;padding:6px;background:#eef1f9">
    <div id="it" class="box">the item</div><div class="box b" style="flex:0 0 auto">a neighbour</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  function $(id){ return document.getElementById(id); }
  function upd(){
    var it = $('it');
    it.style.width = $('uw').checked ? $('vw').value + 'px' : '';
    it.style.flexBasis = $('ub').checked ? $('vb').value + 'px' : '';
    it.style.maxWidth = $('umax').checked ? $('vmax').value + 'px' : '';
    it.style.minWidth = $('umin').checked ? $('vmin').value + 'px' : '';
    var got = Math.round(it.getBoundingClientRect().width);
    var win;
    if ($('umin').checked && Math.abs(got - $('vmin').value) <= 1) win = 'min-width';
    else if ($('umax').checked && Math.abs(got - $('vmax').value) <= 1) win = 'max-width';
    else if ($('ub').checked) win = 'flex-basis';
    else if ($('uw').checked) win = 'width';
    else win = 'content';
    var rows = [
      ['min-width', '1. min-width (hard limit)', $('umin').checked],
      ['max-width', '1. max-width (hard limit)', $('umax').checked],
      ['flex-basis', '2. flex-basis', $('ub').checked],
      ['width', '3. width', $('uw').checked],
      ['content', '4. the content itself', true]
    ];
    $('ro').textContent = 'the item is ' + got + 'px wide\\n\\n' + rows.map(function(r){
      var note = r[0] === win ? '   <- decides the size'
        : !r[2] ? '   (not set)'
        : r[0] === 'width' && $('ub').checked ? '   (ignored: flex-basis outranks width)'
        : r[0] === 'content' ? '' : '   (set, but another rule wins)';
      return (r[0] === win ? '>> ' : '   ') + r[1] + note;
    }).join('\\n');
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The priority list</h3>
    <ol>
      <li><code>min-width</code> / <code>max-width</code> (<code>min-height</code> / <code>max-height</code> in a column): hard limits, they always win.</li>
      <li><code>flex-basis</code>, if set.</li>
      <li><code>width</code> (or <code>height</code> in a column), if there is no flex-basis.</li>
      <li>The content: by default an item will not shrink below its longest word.</li>
    </ol>
    <h3>The shorthand</h3>
    <pre>flex: 1;          /* grow 1, shrink 1, basis 0: equal shares */
flex: 2;          /* twice the share of a flex: 1 sibling     */
flex: 0 0 200px;  /* rigid: always 200px                      */
flex: 0 1 200px;  /* the default behaviour, starting at 200px */</pre>`
});


PG.add({
  id:'s09-pricing', index:58, udemyId:37368412, minutes:10, section:'s09', slug:'pricing-table', kind:'build', project:true,
  title:'Pricing Table',
  blurb:'The section project: three plans in a flex container that share the width and sit centred on a wide screen, then stack into one column on a narrow one. All the HTML is written; the CSS is yours.',
  tasks:[
    'Make <code>.pricing-container</code> a flex container with <code>gap: 2rem</code>, and centre the cards both ways with <code>justify-content</code>, <code>align-items</code> and <code>height: 100vh</code>.',
    'Give each <code>.pricing-plan</code> <code>flex: 1</code> and <code>max-width: 400px</code>, plus padding (20px), a light grey background (<code>#f2f2f2</code>), rounded corners (5px) and centred text.',
    'Make <code>.plan-title</code> 24px and bold and <code>.plan-price</code> 48px and bold, each with a little space below.',
    'Reset the feature list (<code>list-style: none</code>, no padding, no margin, 20px below each <code>li</code>) and style <code>.plan-button</code>: orange (<code>#ff6600</code>), white text, padding, rounded corners and <code>border: none</code>.',
    'The preview pane is narrow, so the three cards are overflowing. Add <code>@media (max-width: 1250px)</code> that switches the container to <code>flex-direction: column</code>.',
    'Inside the same media query set <code>height: 100%</code>: with 100vh the stacked cards are taller than the screen and the top one is cut off. Then press <b>↗ open</b> and drag the window wider than 1250px to see the cards return to a row.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flexbox Pricing Table</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Sono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="pricing-container">
    <div class="pricing-plan">
      <div class="plan-title">Basic</div>
      <div class="plan-price">$9.99/month</div>
      <ul class="plan-features">
        <li>✅ 10GB Storage</li>
        <li>✅ 1 User</li>
        <li>🚫 Support</li>
      </ul>
      <button class="plan-button">Sign Up</button>
    </div>
    <div class="pricing-plan">
      <div class="plan-title">Standard</div>
      <div class="plan-price">$19.99/month</div>
      <ul class="plan-features">
        <li>✅ 50GB Storage</li>
        <li>✅ 5 Users</li>
        <li>✅ Phone &amp; Email Support</li>
      </ul>
      <button class="plan-button">Sign Up</button>
    </div>
    <div class="pricing-plan">
      <div class="plan-title">Premium</div>
      <div class="plan-price">$49.99/month</div>
      <ul class="plan-features">
        <li>✅ 100GB Storage</li>
        <li>✅ 10 Users</li>
        <li>✅ 24/7 Support</li>
      </ul>
      <button class="plan-button">Sign Up</button>
    </div>
  </div>
</body>
</html>`,
'style.css':`body {
  font-family: "Sono", sans-serif;
}

/* TODO 1: flex container, gap, centred both ways, full window height */
.pricing-container {
}

/* TODO 2: equal shares with a maximum width, plus the card look */
.pricing-plan {
}

/* TODO 3: title and price */

/* TODO 4: the feature list and the button */

/* TODO 5 and 6: stack the cards on screens up to 1250px wide */
`},
  solution:{
'style.css':`body {
  font-family: "Sono", sans-serif;
}

.pricing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 2rem;
}

.pricing-plan {
  flex: 1;
  max-width: 400px;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 5px;
  text-align: center;
}

.plan-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.plan-price {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  margin-bottom: 20px;
}

.plan-button {
  padding: 10px;
  background-color: #ff6600;
  color: #fff;
  border-radius: 5px;
  border: none;
}

@media (max-width: 1250px) {
  .pricing-container {
    flex-direction: column;
    height: 100%;
  }
}
`},
  quiz:[
    { q:'Why does <code>.pricing-container</code> need <code>height: 100vh</code> on a wide screen?', options:['To make the cards equal width','To give align-items some height to centre the cards in','To stop the cards wrapping','Flexbox needs a height to work at all'], answer:1, why:'Without it the container is only as tall as the cards, so there is no spare height and vertical centring does nothing.' },
    { q:'In the media query, why change the height to <code>100%</code>?', options:['It makes the cards bigger','The stacked cards are taller than the window, and a fixed 100vh would cut them off','100vh does not work inside media queries','It removes the gap'], answer:1, why:'100% (of an auto-height parent) lets the container grow with its content, so every stacked card stays reachable.' },
    { q:'What does <code>max-width: 400px</code> on each card prevent?', options:['Cards shrinking on phones','Cards stretching across a very wide screen','The button overflowing','Text wrapping inside the card'], answer:1, why:'flex: 1 lets the cards grow; the cap keeps them a sensible size, so the centring still shows.' },
    { q:'When does <code>@media (max-width: 1250px)</code> apply?', options:['Only at exactly 1250px','When the viewport is 1250px wide or narrower','When the viewport is wider than 1250px','When the container is 1250px'], answer:1, why:'max-width media queries match at and below the given width; 1250px is a choice based on three 400px cards plus gaps.' },
  ],
  explore:[{
    title:'The breakpoint, live', height:560,
    note:'A half-size copy of the project (cards up to 200px, breakpoint at 625px) inside a resizable screen. Drag across the breakpoint, then tick the box to see what keeping <code>height: 100vh</code> in the stacked layout does.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" id="w" min="300" max="900" value="760"><span class="val" id="wv"></span></label>
  <label><input type="checkbox" id="clip"> keep height: 100vh when stacked</label>
</div>
<div class="stage" style="padding:8px">
  <iframe id="fr" style="height:260px;border:2px solid #b9c0d4;border-radius:8px;display:block;background:#fff"></iframe>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var plans = [['Basic','$9.99/month'],['Standard','$19.99/month'],['Premium','$49.99/month']];
  function page(clip){
    var cards = plans.map(function(p){
      return '<div class="pp"><div class="t">' + p[0] + '</div><div class="p">' + p[1] + '</div><ul><li>Storage</li><li>Users</li><li>Support</li></ul><button>Sign Up</button></div>';
    }).join('');
    return '<!DOCTYPE html><html><head><style>' +
      'body{margin:0;font-family:sans-serif;font-size:10px}' +
      '.pc{display:flex;justify-content:center;align-items:center;height:100vh;gap:1rem}' +
      '.pp{flex:1;max-width:200px;padding:10px;background:#f2f2f2;border-radius:4px;text-align:center}' +
      '.t{font-weight:bold;font-size:12px}.p{font-weight:bold;font-size:24px;margin:4px 0}' +
      'ul{list-style:none;padding:0;margin:0}li{margin-bottom:8px}' +
      'button{background:#ff6600;color:#fff;border:none;border-radius:4px;padding:5px}' +
      '@media (max-width:625px){.pc{flex-direction:column;height:' + (clip ? '100vh' : '100%') + '}}' +
      '</style></head><body><div class="pc">' + cards + '</div></body></html>';
  }
  var w = document.getElementById('w'), clip = document.getElementById('clip'), fr = document.getElementById('fr');
  function upd(rebuild){
    fr.style.width = w.value + 'px';
    document.getElementById('wv').textContent = w.value + 'px';
    if (rebuild) fr.srcdoc = page(clip.checked);
    var v = +w.value, stacked = v <= 625;
    document.getElementById('ro').textContent =
      '@media (max-width: 625px) { .pricing-container { flex-direction: column; height: ' + (clip.checked ? '100vh' : '100%') + '; } }\\n\\n' +
      'screen ' + v + 'px -> ' + (stacked ? 'at or below 625px: the media query applies, cards stack' : 'wider than 625px: the media query is off, cards sit in a row') + '\\n' +
      (stacked && clip.checked ? 'height: 100vh keeps the container 260px tall, so the taller column spills out above and below and the top card is cut off where you cannot scroll to it.' :
       stacked ? 'height: 100% lets the container grow with the stacked cards, so you can scroll to all of them.' : '');
  }
  w.addEventListener('input', function(){ upd(false); });
  clip.addEventListener('change', function(){ upd(true); });
  upd(true);
<\/script>`
  }],
  notes:`
    <h3>vh and vw</h3>
    <ul>
      <li><code>100vh</code> = 100% of the viewport <b>height</b>. <code>50vh</code> = half the window tall.</li>
      <li><code>100vw</code> = 100% of the viewport <b>width</b>.</li>
    </ul>
    <h3>Where 1250px comes from</h3>
    <p>Three cards of at most 400px plus two 2rem gaps need roughly 1264px. Below that the 48px prices no longer fit side by side, so stacking around there is sensible. Breakpoints come from your content, not from a list of device sizes.</p>
    <h3>Go further</h3>
    <ul>
      <li>Make the middle plan stand out: <code>transform: scale(1.06)</code> and a stronger shadow.</li>
      <li>Make each card a column flex container and give the button <code>margin-top: auto</code> to pin it to the bottom.</li>
    </ul>`
});


PG.add({
  id:'l059', index:59, udemyId:17966772, minutes:3, section:'s09', slug:'programming-habit', kind:'read',
  title:'Tip from Angela - Building a Programming Habit',
  blurb:'Attach your coding time to something you already do every day, such as brushing your teeth, and start the moment that routine ends. The old habit becomes the trigger, so you no longer depend on remembering or on willpower.',
  quiz:[
    { q:'According to this tip, what makes a new coding habit stick?', options:['Waiting until you feel motivated','Starting it straight after something you already do every day','Long sessions at the weekend','Setting lots of phone reminders'], answer:1, why:'An existing routine is a reliable cue, so the new habit starts without needing memory or willpower.' },
  ],
});
