/* ===== Section 5 — Introduction to CSS ===== */

PG.add({
  id:'s05-adding-css', section:'s05', slug:'adding-css', lesson:'5.1',
  title:'Adding CSS',
  blurb:'There are three places CSS can live: <code>style=""</code> straight on the tag (inline), a <code>&lt;style&gt;</code> block in the head (internal), or a separate <code>.css</code> file (external). External wins in real projects — one file styles every page.',
  tasks:[
    'Make the first heading blue using an <b>inline</b> style attribute.',
    'Make the second heading red using an <b>internal</b> <code>&lt;style&gt;</code> block in the head.',
    'Make the third heading green from the <b>style.css</b> pane (that pane is your external stylesheet).'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Adding CSS</title>
  <!-- TODO 2: add an internal <style> block here and turn .internal red -->

</head>
<body>
  <h1>Three Methods of Adding CSS</h1>

  <!-- TODO 1: add an inline style attribute to make this blue -->
  <h2 class="inline">Style me in blue (inline)</h2>

  <h2 class="internal">Style me in red (internal)</h2>

  <h2 class="external">Style me in green (external)</h2>
</body>
</html>`,
css:`/* TODO 3: this pane is the external stylesheet.
   Make .external green from here. */
body {
  font-family: sans-serif;
  padding: 20px;
}
`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Adding CSS</title>
  <style>
    .internal {
      color: red;
    }
  </style>
</head>
<body>
  <h1>Three Methods of Adding CSS</h1>

  <h2 class="inline" style="color: blue">Style me in blue (inline)</h2>

  <h2 class="internal">Style me in red (internal)</h2>

  <h2 class="external">Style me in green (external)</h2>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
  padding: 20px;
}

.external {
  color: green;
}
`},
  explore:[{
    title:'Which one wins?', height:400,
    note:'All three methods are targeting the same heading at once. Turn them on and off — inline beats internal, internal and external fight it out by order and specificity.',
    html:`
<div class="knobs">
  <label><input type="checkbox" data-css="#target|color" value="green" data-off="" checked> external says <span class="tag">green</span></label>
  <label><input type="checkbox" id="int" checked> internal says <span class="tag">red</span></label>
  <label><input type="checkbox" id="inl"> inline says <span class="tag">blue</span></label>
</div>
<div class="stage">
  <h1 id="target" style="margin:0">This heading is being fought over</h1>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">Inline styles sit right on the element, so they beat any stylesheet rule. That is exactly why you avoid them — nothing in your CSS file can override them later.</p>
<style id="internalRule">#target { color: red; }</style>
<script>
  var t = document.getElementById('target');
  function upd(){
    document.getElementById('internalRule').textContent =
      document.getElementById('int').checked ? '#target { color: red; }' : '';
    if (document.getElementById('inl').checked) t.setAttribute('style','margin:0;color:blue');
    else t.setAttribute('style','margin:0');
    var winner = document.getElementById('inl').checked ? 'blue  (inline wins)'
               : document.getElementById('int').checked ? 'red   (internal wins)'
               : (t.style.color || 'green') && 'green (external wins)';
    document.getElementById('ro').textContent = 'computed colour → ' + getComputedStyle(t).color + '\\n' + winner;
  }
  document.getElementById('int').addEventListener('change', upd);
  document.getElementById('inl').addEventListener('change', upd);
  setTimeout(upd, 30);
<\/script>`
  }],
  notes:`
    <h3>The three methods</h3>
    <table>
      <tr><th>Method</th><th>Looks like</th><th>Use it when</th></tr>
      <tr><td>Inline</td><td><code>&lt;h1 style="color:blue"&gt;</code></td><td>Almost never — it can't be reused or overridden.</td></tr>
      <tr><td>Internal</td><td><code>&lt;style&gt;</code> in the head</td><td>Quick single-page demos.</td></tr>
      <tr><td>External</td><td><code>&lt;link rel="stylesheet" href="./style.css"&gt;</code></td><td>Always, for real sites.</td></tr>
    </table>
    <h3>The link tag</h3>
    <p>The external stylesheet is connected from inside <code>&lt;head&gt;</code>:</p>
    <pre>&lt;link rel="stylesheet" href="./style.css" /&gt;</pre>
    <p><code>rel</code> says what the file is to this page, <code>href</code> says where it lives. In this playground the <b>style.css</b> pane <em>is</em> that file — it gets linked in for you.</p>`
});


PG.add({
  id:'s05-selectors', section:'s05', slug:'selectors', lesson:'5.2',
  title:'CSS Selectors',
  blurb:'A rule has a <b>selector</b> (what to target) and <b>declarations</b> (what to change). Five ways to target: by tag, by class, by id, by attribute, or everything at once.',
  tasks:[
    'Set all <code>&lt;p&gt;</code> tags to <code>color: red</code>.',
    'Set everything with <code>class="note"</code> to <code>font-size: 20px</code>.',
    'Set the element with <code>id="id-selector-demo"</code> to <code>color: green</code>.',
    'Set the <code>&lt;li&gt;</code> whose <code>value</code> attribute is <code>4</code> to <code>color: blue</code>.',
    'Set every element on the page to <code>text-align: center</code>.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Selectors</title>
</head>
<body>
  <h1>CSS Selectors</h1>
  <h2>Applying CSS to Different Parts of HTML</h2>

  <!-- TODO 1: all paragraph tags -> color: red -->
  <p class="note">1. The element selector targets elements by their HTML tag name.</p>

  <ol>
    <!-- TODO 2: everything with class "note" -> font-size: 20px -->
    <li class="note" value="2">Class selectors target elements by their class attribute.</li>

    <!-- TODO 3: the element with id "id-selector-demo" -> color: green -->
    <li class="note" id="id-selector-demo" value="3">ID selectors target the one element with that id.</li>

    <!-- TODO 4: the li with value="4" -> color: blue -->
    <li class="note" value="4">Attribute selectors target elements by an attribute and its value.</li>

    <!-- TODO 5: every element -> text-align: center -->
    <li class="note" value="5">The universal selector targets all elements.</li>
  </ol>
</body>
</html>`,
css:`ol {
  margin-left: -40px;
  margin-top: -20px;
  list-style-position: inside;
}

/* Write your CSS below, don't change the rule above. */
`},
  solution:{
css:`ol {
  margin-left: -40px;
  margin-top: -20px;
  list-style-position: inside;
}

/* Write your CSS below, don't change the rule above. */
p {
  color: red;
}

.note {
  font-size: 20px;
}

#id-selector-demo {
  color: green;
}

li[value="4"] {
  color: blue;
}

* {
  text-align: center;
}
`},
  explore:[{
    title:'Selector target practice', height:470,
    note:'Pick a selector and see exactly which elements light up. Notice how <code>.note</code> catches several elements at once while <code>#special</code> only ever catches one.',
    html:`
<div class="knobs">
  <label>selector
    <select id="sel">
      <option value="p">p</option>
      <option value="li">li</option>
      <option value=".note">.note</option>
      <option value="#special">#special</option>
      <option value='li[value="4"]'>li[value="4"]</option>
      <option value="li.note">li.note</option>
      <option value="*">*</option>
    </select>
  </label>
  <span class="tag" id="count"></span>
</div>
<div class="stage" id="stage">
  <h1>Colours</h1>
  <p class="note">A paragraph with class "note"</p>
  <ol>
    <li class="note" value="2">list item · class note · value 2</li>
    <li class="note" id="special" value="3">list item · class note · id special</li>
    <li value="4">list item · value 4</li>
    <li>plain list item</li>
  </ol>
  <p>A plain paragraph</p>
</div>
<pre class="readout" id="ro"></pre>
<style id="hi"></style>
<script>
  var sel = document.getElementById('sel');
  function upd(){
    var s = sel.value;
    document.getElementById('hi').textContent =
      '#stage ' + s + ' { outline:3px solid #ff5c8a; outline-offset:2px; background:#ffe9ef; }';
    var n = document.querySelectorAll('#stage ' + s).length;
    document.getElementById('count').textContent = n + (n===1?' element matched':' elements matched');
    document.getElementById('ro').textContent = s + ' {\\n  /* your declarations */\\n}';
  }
  sel.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The five selectors</h3>
    <table>
      <tr><th>Type</th><th>Written as</th><th>Targets</th></tr>
      <tr><td>Element</td><td><code>p</code></td><td>Every paragraph tag</td></tr>
      <tr><td>Class</td><td><code>.note</code></td><td>Everything with <code>class="note"</code> — reusable</td></tr>
      <tr><td>ID</td><td><code>#title</code></td><td>The one element with <code>id="title"</code> — unique per page</td></tr>
      <tr><td>Attribute</td><td><code>li[value="4"]</code></td><td>Elements with that attribute and value</td></tr>
      <tr><td>Universal</td><td><code>*</code></td><td>Absolutely everything</td></tr>
    </table>
    <h3>Class vs id</h3>
    <p>A class can be reused on as many elements as you like; an id is meant to appear once on a page. Reach for classes by default — ids are for the one-off thing (and for JavaScript to grab later).</p>`
});


PG.add({
  id:'s05-color-vocab', section:'s05', slug:'color-vocab-project', lesson:'5.3', project:true,
  title:'Colour Vocab Project',
  blurb:'Putting the selectors to work: style a vocabulary page so each colour name is shown in its own colour.',
  tasks:[
    'Give every <code>.color-title</code> a <code>font-size</code> of <code>30px</code> and <code>text-align: center</code>.',
    'Use the <b>id</b> selectors (<code>#red</code>, <code>#blue</code>, …) to colour each heading its own colour.',
    'Centre the swatches — try <code>text-align: center</code> on <code>body</code> and see what it does to the images.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Vocabulary English</title>
</head>
<body>
  <h1>Colors</h1>
  <h2>Learn colors in English!</h2>

  <h2 class="color-title" id="red">Red</h2>
  <div class="swatch" style="background:#e63946"></div>

  <h2 class="color-title" id="blue">Blue</h2>
  <div class="swatch" style="background:#2a6fdb"></div>

  <h2 class="color-title" id="orange">Orange</h2>
  <div class="swatch" style="background:#f4802a"></div>

  <h2 class="color-title" id="green">Green</h2>
  <div class="swatch" style="background:#2a9d4a"></div>

  <h2 class="color-title" id="yellow">Yellow</h2>
  <div class="swatch" style="background:#f2c53d"></div>
</body>
</html>`,
css:`body {
  font-family: sans-serif;
}

.swatch {
  width: 160px;
  height: 90px;
  border-radius: 8px;
  margin: 0 auto 24px;
}

/* TODO: style .color-title, then colour each heading using its id */
`},
  solution:{
css:`body {
  font-family: sans-serif;
  text-align: center;
}

.swatch {
  width: 160px;
  height: 90px;
  border-radius: 8px;
  margin: 0 auto 24px;
}

.color-title {
  font-size: 30px;
  text-align: center;
}

#red    { color: #e63946; }
#blue   { color: #2a6fdb; }
#orange { color: #f4802a; }
#green  { color: #2a9d4a; }
#yellow { color: #f2c53d; }
`},
  notes:`
    <h3>Why the ids here?</h3>
    <p>Every heading shares the <code>.color-title</code> class for the things they have in common (size, alignment), and each has its own id for the one thing that differs (the colour). That split — shared class for shared styling, specific selector for the exception — is the pattern you'll use constantly.</p>
    <h3>Try beyond the task</h3>
    <ul>
      <li>Swap the ids for a single rule using an attribute selector.</li>
      <li>Add <code>text-transform: uppercase</code> to <code>.color-title</code>.</li>
      <li>Give <code>.swatch</code> a <code>box-shadow</code> — e.g. <code>0 4px 14px rgba(0,0,0,.25)</code>.</li>
    </ul>`
});
