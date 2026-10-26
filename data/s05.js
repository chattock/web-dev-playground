/* ===== Section 5 — Introduction to CSS ===== */

PG.add({
  id:'l032', index:32, udemyId:37350296, minutes:9, section:'s05', slug:'why-css', kind:'build',
  title:'Why do we need CSS?',
  blurb:'HTML says <b>what</b> is on a page; CSS says <b>how it looks</b>. Before CSS, authors styled text with tags like <code>&lt;font&gt;</code> and <code>&lt;center&gt;</code>, which buried the content under presentation. Moving the look into a separate stylesheet (separation of concerns) means one file can restyle a page without touching its HTML.',
  tasks:[
    'Look at the preview. Both lines are styled the 1997 way: the text is wrapped in <code>&lt;center&gt;</code> and <code>&lt;font&gt;</code> tags. Browsers still draw them, but both tags are deprecated.',
    'Replace the whole first line (<code>&lt;center&gt;&lt;font …&gt;Welcome to my homepage&lt;/font&gt;&lt;/center&gt;</code>) with a plain <code>&lt;h1&gt;Welcome to my homepage&lt;/h1&gt;</code>. The <code>h1</code> rule already waiting in <b>style.css</b> gives it the same look.',
    'Replace the second line with a plain <code>&lt;p&gt;</code>. Then, in style.css, write a <code>p</code> rule that follows the same pattern as the <code>h1</code> rule: Georgia, crimson, centred.',
    'Change <code>crimson</code> to <code>teal</code> in both rules. Two edits restyle the page; with <code>&lt;font&gt;</code> tags you would have to edit every single tag.',
    'Cut everything out of style.css (Cmd/Ctrl+A, then Cmd/Ctrl+X). The page goes plain, yet index.html has not changed at all. Paste it back.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Why CSS?</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <!-- The 1997 way: the look is tangled up with the content.
       <center> and <font> are deprecated: never write them today. -->

  <!-- TODO 1: replace this line with a plain <h1> -->
  <center><font face="Georgia" size="6" color="crimson">Welcome to my homepage</font></center>

  <!-- TODO 2: replace this line with a plain <p>, then style p in style.css -->
  <center><font face="Georgia" size="4" color="crimson">Hand-coded with care since 1997</font></center>
</body>
</html>`,
'style.css':`/* The modern way: the HTML only says WHAT things are.
   Every decision about how they LOOK lives in this file. */

h1 {
  font-family: Georgia, serif;
  color: crimson;
  text-align: center;
}

/* TODO 3: a rule for p that does the job the old
   <center> and <font face="Georgia" color="crimson"> tags did */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Why CSS?</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>Welcome to my homepage</h1>
  <p>Hand-coded with care since 1997</p>
</body>
</html>`,
'style.css':`/* The modern way: the HTML only says WHAT things are.
   Every decision about how they LOOK lives in this file. */

h1 {
  font-family: Georgia, serif;
  color: crimson;
  text-align: center;
}

p {
  font-family: Georgia, serif;
  color: crimson;
  text-align: center;
}
`},
  explore:[{
    title:'Just add CSS', height:560,
    note:'One page of HTML, four stylesheets. Switch between them: the HTML on the right stays exactly the same while the page looks completely different. That is the whole argument for CSS.',
    html:`
<div class="knobs">
  <label>stylesheet
    <select id="sheet">
      <option value="none">none (browser defaults)</option>
      <option value="clean" selected>clean</option>
      <option value="night">night</option>
      <option value="retro">retro</option>
    </select>
  </label>
  <span class="tag">the HTML never changes</span>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:stretch;margin-bottom:12px">
  <div class="stage" style="flex:1 1 260px;margin:0;padding:10px"><div id="page"></div></div>
  <pre class="readout" id="src" style="flex:1 1 220px;margin:0;white-space:pre-wrap"></pre>
</div>
<pre class="readout" id="css"></pre>
<style id="theme"></style>
<script>
  var html =
    '<header>\\n  <h1>Corner Café</h1>\\n  <p>Coffee, cake and quiet tables.</p>\\n</header>\\n' +
    '<nav>\\n  <a href="#">Menu</a>\\n  <a href="#">Visit</a>\\n</nav>\\n' +
    '<h2>Today</h2>\\n<ul>\\n  <li>Flat white</li>\\n  <li>Lemon drizzle</li>\\n</ul>';
  var base = '#page { font-family: serif; font-size: 16px; color: #000; background: #fff; }\\n';
  var sheets = {
    none: '/* no stylesheet at all: these are the browser defaults */',
    clean: [
      '#page { font-family: system-ui, sans-serif; color: #3b2f25; background: #fffaf3; padding: 16px; border-radius: 8px; }',
      '#page header { border-bottom: 2px solid #ead9c4; }',
      '#page h1 { font-size: 26px; margin: 0; color: #7a4b2a; }',
      '#page p { margin: 4px 0 10px; color: #8d7b69; }',
      '#page nav { margin: 10px 0; }',
      '#page nav a { color: #7a4b2a; margin-right: 14px; font-weight: 600; text-decoration: none; }',
      '#page h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #b07a4f; }'
    ].join('\\n'),
    night: [
      '#page { font-family: ui-monospace, Menlo, monospace; color: #c9d1e8; background: #12141c; padding: 16px; border-radius: 8px; }',
      '#page h1 { color: #7ee0a8; font-size: 22px; margin: 0; }',
      '#page p { color: #8b93ad; }',
      '#page nav a { color: #12141c; background: #8ab4ff; padding: 2px 8px; border-radius: 4px; text-decoration: none; margin-right: 6px; }',
      '#page h2 { color: #ffcf6b; font-size: 15px; }',
      '#page li { list-style: square; }'
    ].join('\\n'),
    retro: [
      '#page { font-family: "Comic Sans MS", cursive; color: yellow; background: navy; padding: 16px; text-align: center; }',
      '#page h1 { color: lime; font-size: 30px; margin: 0; }',
      '#page nav a { color: cyan; margin: 0 8px; }',
      '#page h2 { color: magenta; }',
      '#page ul { list-style: none; padding: 0; }'
    ].join('\\n')
  };
  var sel = document.getElementById('sheet');
  document.getElementById('page').innerHTML = html;
  document.getElementById('src').textContent = '<!-- index.html (body) -->\\n' + html;
  function upd(){
    document.getElementById('theme').textContent = base + (sel.value === 'none' ? '' : sheets[sel.value]);
    document.getElementById('css').textContent = '/* style.css */\\n' + sheets[sel.value];
  }
  sel.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'What does the <b>SS</b> in CSS stand for, and what does that kind of language do?', options:['Super Scripts: it adds behaviour to a page','Style Sheets: it only describes how content should look','Server Side: it builds pages on the server','Selector Syntax: it is the part of HTML that names elements'], answer:1, why:'A style sheet language has one job, presentation. Structure and content stay in the HTML.' },
    { q:'Why were <code>&lt;font&gt;</code> and <code>&lt;center&gt;</code> deprecated?', options:['Browsers can no longer display them','They mixed presentation into the content, which bloated pages and made them hard to maintain','They only worked in the Mosaic browser','They were too slow to download'], answer:1, why:'They still render, but colours, fonts and alignment inside the markup bury the structure. CSS moved all of that into its own file.' },
    { q:'A site swaps in a completely different stylesheet. What happens to its HTML?', options:['It is rewritten to match','Nothing: the same HTML is just displayed differently','The headings change level','The page needs new content'], answer:1, why:'That is separation of concerns: content and look live in different files, so either can change without the other.' },
    { q:'Sass and Less are…', options:['replacements for HTML','other stylesheet languages that compile down to plain CSS','browser extensions for inspecting CSS','JavaScript frameworks'], answer:1, why:'Browsers only understand CSS, so preprocessors like Sass and Less are turned into CSS before the browser sees them.' },
  ],
  notes:`
    <h3>Then and now</h3>
    <pre data-lang="html">&lt;!-- 1997: look and content tangled together --&gt;
&lt;center&gt;&lt;font face="Georgia" color="crimson"&gt;Welcome&lt;/font&gt;&lt;/center&gt;

&lt;!-- today: the HTML only names the thing --&gt;
&lt;h1&gt;Welcome&lt;/h1&gt;</pre>
    <pre data-lang="css">/* ...and the stylesheet decides how every h1 looks */
h1 {
  font-family: Georgia, serif;
  color: crimson;
  text-align: center;
}</pre>
    <p>One rule now styles every <code>h1</code> on every page that uses the stylesheet. Change the rule once and the whole site follows.</p>`
});


PG.add({
  id:'s05-adding-css', index:33, udemyId:37350312, minutes:15, section:'s05', slug:'adding-css', kind:'build',
  title:'How to add CSS',
  blurb:'CSS can be attached in three places: <b>inline</b>, in a <code>style</code> attribute on one element; <b>internal</b>, in a <code>&lt;style&gt;</code> element in the head (that page only); or <b>external</b>, in a separate <code>.css</code> file joined to each page with <code>&lt;link&gt;</code>. External is what real sites, and the rest of this course, use.',
  tasks:[
    'Under the <code>h1</code>, add three links: <b>Inline</b> to <code>#inline</code>, <b>Internal</b> to <code>#internal</code> and <b>External</b> to <code>#external</code>. In the course these are three separate pages (<code>./inline.html</code> and so on). The preview shows one file, so each "page" is a section here, and <code>#name</code> jumps to the element with that id.',
    '<b>Inline:</b> add <code>style="color: blue"</code> to the opening tag of the "Style Me in Blue!" heading.',
    '<b>Internal:</b> inside <code>&lt;head&gt;</code>, add a <code>&lt;style&gt;</code> element containing the rule <code>.internal { color: red; }</code>. A dot followed by a name selects the elements with that <code>class</code>; the next lecture covers classes properly.',
    '<b>External:</b> in the <b>style.css</b> pane, write <code>.external { color: green; }</code>.',
    'Connect the stylesheet with <code>&lt;link rel="stylesheet" href="./style.css" /&gt;</code> in the head. The playground always applies the style.css pane, but on your own computer the file is ignored without this line.',
    'Bonus: <code>style</code> works on any element. Put <code>style="background: lavender"</code> on the <code>&lt;html&gt;</code> opening tag and the whole page changes colour.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adding CSS</title>
  <!-- TODO 5: link the external stylesheet, style.css -->

  <!-- TODO 3: an internal <style> element that makes .internal red -->

</head>
<body>
  <h1>Three Methods of Adding CSS</h1>
  <!-- TODO 1: three links to the "pages" below: #inline, #internal, #external -->


  <!-- In the course these three sections are three separate files
       (inline.html, internal.html, external.html). The playground
       previews one file, so each one is a <section> here. -->
  <section id="inline">
    <!-- TODO 2: an inline style attribute that makes this heading blue -->
    <h2>Style Me in Blue!</h2>
  </section>

  <section id="internal">
    <h2 class="internal">Style Me in Red!</h2>
  </section>

  <section id="external">
    <h2 class="external">Style Me in Green!</h2>
  </section>
</body>
</html>`,
'style.css':`/* This pane is the external stylesheet, style.css.
   It holds only CSS rules: no HTML tags, no <style> wrapper. */

/* TODO 4: make everything with class "external" green */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Adding CSS</title>
  <link rel="stylesheet" href="./style.css" />
  <style>
    .internal {
      color: red;
    }
  </style>
</head>
<body>
  <h1>Three Methods of Adding CSS</h1>
  <a href="#inline">Inline</a>
  <a href="#internal">Internal</a>
  <a href="#external">External</a>

  <!-- In the course these three sections are three separate files
       (inline.html, internal.html, external.html). The playground
       previews one file, so each one is a <section> here. -->
  <section id="inline">
    <h2 style="color: blue">Style Me in Blue!</h2>
  </section>

  <section id="internal">
    <h2 class="internal">Style Me in Red!</h2>
  </section>

  <section id="external">
    <h2 class="external">Style Me in Green!</h2>
  </section>
</body>
</html>`,
'style.css':`/* This pane is the external stylesheet, style.css.
   It holds only CSS rules: no HTML tags, no <style> wrapper. */

.external {
  color: green;
}
`},
  explore:[
  {
    title:'Which one wins?', height:390,
    note:'All three methods target the same heading at once. Switch them on and off: the inline style beats both stylesheets, and between the two stylesheets the one that comes later in the head wins.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="ext" checked> style.css says <span class="tag">color: green</span></label>
  <label><input type="checkbox" id="int" checked> &lt;style&gt; says <span class="tag">color: red</span></label>
  <label><input type="checkbox" id="inl"> style="" says <span class="tag">color: blue</span></label>
</div>
<div class="stage">
  <h1 id="target" style="margin:0">This heading is being fought over</h1>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">Inline styles sit on the element itself, so they beat any stylesheet rule. That is also their weakness: nothing in your CSS file can override them later, so keep them for quick one-off tests.</p>
<style id="extRule"></style>
<style id="intRule"></style>
<script>
  var t = document.getElementById('target');
  function on(id){ return document.getElementById(id).checked; }
  function upd(){
    document.getElementById('extRule').textContent = on('ext') ? '#target { color: green; }' : '';
    document.getElementById('intRule').textContent = on('int') ? '#target { color: red; }' : '';
    t.style.color = on('inl') ? 'blue' : '';
    var why = on('inl') ? 'blue: the inline style wins, it sits on the element itself'
            : on('int') ? 'red: the internal <style> wins, it comes after the linked stylesheet'
            : on('ext') ? 'green: only the external stylesheet is left'
            : 'black: no CSS at all, so the browser default shows';
    document.getElementById('ro').textContent = 'computed colour: ' + getComputedStyle(t).color + '\\n' + why;
  }
  ['ext','int','inl'].forEach(function(id){ document.getElementById(id).addEventListener('change', upd); });
  upd();
<\/script>`
  },
  {
    title:'One stylesheet, two pages', height:470,
    note:'Two pages of the same site. Both link <b>style.css</b>; only <b>about.html</b> has its own <code>&lt;style&gt;</code> block. Edit either box and watch which pages react.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1 1 220px"><h4>style.css (linked by both pages)</h4>
    <textarea id="ext" spellcheck="false">h1 {
  color: teal;
}</textarea></div>
  <div style="flex:1 1 220px"><h4>&lt;style&gt; inside about.html only</h4>
    <textarea id="int" spellcheck="false">h1 {
  font-style: italic;
}</textarea></div>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:10px">
  <div style="flex:1 1 220px"><span class="tag">index.html</span><iframe id="p1"></iframe></div>
  <div style="flex:1 1 220px"><span class="tag">about.html</span><iframe id="p2"></iframe></div>
</div>
<p class="note">Change <code>teal</code> in style.css and both pages follow: that is why external CSS scales to a 100-page site. The internal block only ever reaches the page it lives in.</p>
<style>
  textarea { width:100%; height:86px; font-family:ui-monospace,Menlo,monospace; font-size:12.5px;
             border:1px solid #cfd5e6; border-radius:8px; padding:8px; resize:vertical; }
  iframe { width:100%; height:110px; border:1px solid #dfe3ee; border-radius:8px; background:#fff; margin-top:4px; }
</style>
<script>
  function doc(title, text, css){
    return '<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:12px}<\/style>' +
           '<style>' + css + '<\/style></head><body><h1>' + title + '</h1><p>' + text + '</p></body></html>';
  }
  var ext = document.getElementById('ext'), internalCss = document.getElementById('int');
  function upd(){
    document.getElementById('p1').srcdoc = doc('Home', 'Welcome to the site.', ext.value);
    document.getElementById('p2').srcdoc = doc('About', 'Same site, second page.', ext.value + '\\n' + internalCss.value);
  }
  ext.addEventListener('input', upd); internalCss.addEventListener('input', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'Which way of adding CSS lets one edit restyle every page of a site?', options:['Inline','Internal','External','None of them'], answer:2, why:'Every page that links the same .css file picks up the change. Internal CSS reaches one page, inline CSS one element.' },
    { q:'What is wrong with <code>&lt;h1 style="h1 { color: blue; }"&gt;</code>?', options:['Nothing, it works','The style attribute takes only property: value pairs, with no selector and no braces','The colour must be a hex code','style only works on the html tag'], answer:1, why:'Inline CSS already sits on its target element, so it needs no selector: style="color: blue" is all it takes.' },
    { q:'What does <code>rel="stylesheet"</code> on a <code>&lt;link&gt;</code> tell the browser?', options:['Where the file is','What role the linked file plays for this page','That the file is optional','To load the file last'], answer:1, why:'rel is the relationship; href is the location. Leave rel out and the browser does not treat the file as CSS.' },
    { q:'Where do <code>&lt;style&gt;</code> and <code>&lt;link&gt;</code> elements conventionally go?', options:['At the very end of the body','Inside the head','Inside the first h1','Anywhere, there is no convention'], answer:1, why:'Both belong in the head. &lt;link&gt; is also a void element: it has no closing tag.' },
  ],
  notes:`
    <h3>Anatomy of a rule</h3>
    <pre data-lang="css">h1 {            /* selector: which elements          */
  color: green; /* declaration = property: value;    */
}</pre>
    <p>An inline style is only the declaration part (<code>style="color: green"</code>): it needs no selector because it already sits on its element.</p>
    <h3>The three methods</h3>
    <table>
      <tr><th>Method</th><th>Looks like</th><th>Reaches</th></tr>
      <tr><td>Inline</td><td><code>&lt;h1 style="color: blue"&gt;</code></td><td>That one element</td></tr>
      <tr><td>Internal</td><td><code>&lt;style&gt; h1 { color: red; } &lt;/style&gt;</code> in the head</td><td>That one page</td></tr>
      <tr><td>External</td><td><code>&lt;link rel="stylesheet" href="./style.css" /&gt;</code> in the head</td><td>Every page that links it</td></tr>
    </table>
    <h3>In this playground</h3>
    <p>The <b>style.css</b> pane is injected into the preview automatically, so it works even before you write the <code>&lt;link&gt;</code>. On your own machine a missing or misspelled link means the stylesheet silently never loads.</p>`
});


PG.add({
  id:'s05-selectors', index:34, udemyId:37350332, minutes:23, section:'s05', slug:'selectors', kind:'build',
  title:'CSS Selectors',
  blurb:'A rule has a <b>selector</b> (which elements) and a <b>declaration block</b> (what changes). Five basic selectors: element (<code>p</code>), class (<code>.note</code>), id (<code>#main</code>), attribute (<code>li[value="4"]</code>) and universal (<code>*</code>).',
  tasks:[
    'Only edit <b>style.css</b>, and leave the existing <code>ol</code> rule alone. Set every <code>&lt;p&gt;</code> to <code>color: red</code> with an element selector.',
    'Set everything with <code>class="note"</code> to <code>font-size: 20px</code> with a class selector. The headings stay as they are.',
    'Set the element with <code>id="id-selector-demo"</code> to <code>color: green</code> with an id selector.',
    'Set the <code>&lt;li&gt;</code> whose <code>value</code> attribute is <code>4</code> to <code>color: blue</code> with an attribute selector.',
    'Set every element to <code>text-align: center</code> with the universal selector.',
    'Bonus: change <code>li[value="4"]</code> to <code>li[value]</code>. Every list item turns blue except item 3. The id rule outranks the attribute rule; that is specificity, which section 7 explains.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Selectors</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <h1>CSS Selectors</h1>
  <h2>Applying CSS to Different Parts of HTML</h2>

  <!-- TODO 1: all paragraph tags -> color: red -->
  <p class="note">1. The element selector targets elements by their HTML tag name.</p>

  <ol>
    <!-- TODO 2: everything with class "note" -> font-size: 20px -->
    <li class="note" value="2">Class selectors target elements by the value of their class attribute.</li>

    <!-- TODO 3: the element with id "id-selector-demo" -> color: green -->
    <li class="note" id="id-selector-demo" value="3">ID selectors target the one element with that id.</li>

    <!-- TODO 4: the li elements whose value attribute is "4" -> color: blue -->
    <li class="note" value="4">Attribute selectors target elements by an attribute and its value.</li>

    <!-- TODO 5: every element -> text-align: center -->
    <li class="note" value="5">The universal selector targets all elements.</li>
  </ol>
</body>
</html>`,
'style.css':`ol {
  margin-left: -40px;
  margin-top: -20px;
  list-style-position: inside;
}

/* Write your CSS below, don't change the rule above. */
`},
  solution:{
'style.css':`ol {
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
  explore:[
  {
    title:'Selector target practice', height:520,
    note:'Type any selector (or pick one) and see exactly which elements it catches. Compare <code>li[value]</code> with <code>li[value="4"]</code>, and try <code>.Note</code>: class names are case-sensitive, so it matches nothing.',
    html:`
<div class="knobs">
  <label>selector <input type="text" id="sel" value=".note" spellcheck="false" style="width:170px;font-family:ui-monospace,Menlo,monospace"></label>
  <label>or pick
    <select id="pick">
      <option value="">…</option>
      <option>p</option><option>li</option><option>.note</option><option>#special</option>
      <option>li[value]</option><option>li[value="4"]</option><option>.Note</option><option>*</option>
    </select>
  </label>
  <span class="tag" id="count"></span>
</div>
<div class="stage" id="stage">
  <h1 style="margin:0 0 8px;font-size:22px">Colours</h1>
  <p class="note" style="margin:0 0 6px">A paragraph with class "note"</p>
  <ol style="margin:0 0 6px">
    <li class="note" value="2">list item · class note · value 2</li>
    <li class="note" id="special" value="3">list item · class note · id special</li>
    <li value="4">list item · value 4</li>
    <li>plain list item, no attributes</li>
  </ol>
  <p style="margin:0">A plain paragraph</p>
</div>
<pre class="readout" id="ro"></pre>
<style id="hi"></style>
<script>
  var sel = document.getElementById('sel'), pick = document.getElementById('pick');
  var why = {
    'p':'element selector: every <p>, whatever its class',
    'li':'element selector: every <li>',
    '.note':'class selector: anything with class="note", whatever the tag',
    '#special':'id selector: the one element with id="special"',
    'li[value]':'attribute selector without a value: every li that HAS a value attribute',
    'li[value="4"]':'attribute selector with a value: only li elements whose value is exactly 4',
    '.Note':'class names are case-sensitive: .Note does not match class="note"',
    '*':'universal selector: every element inside the page'
  };
  function scoped(s){ return s.split(',').map(function(x){ return '#stage ' + x.trim(); }).join(', '); }
  function upd(){
    var s = sel.value.trim(), n = 0, bad = false;
    if (s) { try { n = document.querySelectorAll(scoped(s)).length; } catch(e){ bad = true; } }
    document.getElementById('hi').textContent = (s && !bad)
      ? scoped(s) + ' { outline:3px solid #ff5c8a; outline-offset:2px; background:#ffe9ef; }' : '';
    document.getElementById('count').textContent = bad ? 'not a valid selector' : n + (n === 1 ? ' element matched' : ' elements matched');
    document.getElementById('ro').textContent = s + ' {\\n  /* your declarations */\\n}\\n\\n' + (bad ? 'The browser cannot read this selector, so the whole rule would be ignored.' : (why[s] || ''));
  }
  sel.addEventListener('input', upd);
  pick.addEventListener('change', function(){ if (pick.value) { sel.value = pick.value; upd(); } });
  upd();
<\/script>`
  },
  {
    title:'Why does item 3 stay green?', height:400,
    note:'A sneak preview of specificity, which the lecture only mentions in passing. Switch the rules on and off and swap their order: the id rule wins either way.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="r1" checked> <span class="tag">li[value] { color: blue; }</span></label>
  <label><input type="checkbox" id="r2" checked> <span class="tag">#id-selector-demo { color: green; }</span></label>
  <label>order
    <select id="ord"><option value="a">attribute rule written last</option><option value="b">id rule written last</option></select>
  </label>
</div>
<div class="stage">
  <ol style="margin:0">
    <li value="2">item two</li>
    <li value="3" id="id-selector-demo">item three · has the id</li>
    <li value="4">item four</li>
  </ol>
</div>
<pre class="readout" id="ro"></pre>
<style id="rules"></style>
<script>
  function upd(){
    var a = document.getElementById('r1').checked ? 'li[value] { color: blue; }' : '';
    var b = document.getElementById('r2').checked ? '#id-selector-demo { color: green; }' : '';
    var css = document.getElementById('ord').value === 'a' ? [b, a] : [a, b];
    document.getElementById('rules').textContent = css.join('\\n');
    var c = getComputedStyle(document.getElementById('id-selector-demo')).color;
    var msg = !b ? 'With no id rule, item three is just another li[value].'
            : 'An id points at one element, so it outranks an attribute selector.\\nIt wins whichever rule comes last in the file.';
    document.getElementById('ro').textContent = css.filter(Boolean).join('\\n') + '\\n\\nitem three is ' + c + '\\n' + msg;
  }
  ['r1','r2','ord'].forEach(function(id){ document.getElementById(id).addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'An <code>h2</code> and a <code>p</code> should share the same style. Which selector type fits best?', options:['An id on each','A class on both','The universal selector','An attribute selector on the h2'], answer:1, why:'A class can sit on any number of elements of any tag. An id is meant for one element only.' },
    { q:'Which selector matches <code>&lt;li value="4"&gt;</code> but not <code>&lt;li value="5"&gt;</code>?', options:['li','.note','li[value]','li[value="4"]'], answer:3, why:'li[value] only checks that the attribute exists. Adding ="4" checks its value too.' },
    { q:'Does <code>.Note { … }</code> style <code>&lt;p class="note"&gt;</code>?', options:['Yes, CSS ignores case','No, class names are case-sensitive','Only in Chrome','Only if it is the first rule'], answer:1, why:'The name in the selector must match the HTML exactly. Copying names from the HTML avoids this.' },
    { q:'How many elements on a page should share one id value?', options:['One','Two at most','As many as you like','Only headings may have ids'], answer:0, why:'Ids are unique per page. For groups of elements, use a class.' },
  ],
  notes:`
    <h3>The five selectors</h3>
    <table>
      <tr><th>Type</th><th>Written as</th><th>Targets</th></tr>
      <tr><td>Element</td><td><code>p</code></td><td>Every paragraph</td></tr>
      <tr><td>Class</td><td><code>.note</code></td><td>Everything with <code>class="note"</code>; reusable on any tag</td></tr>
      <tr><td>ID</td><td><code>#title</code></td><td>The one element with <code>id="title"</code></td></tr>
      <tr><td>Attribute</td><td><code>li[value]</code> / <code>li[value="4"]</code></td><td>Elements that have the attribute / have it with that value</td></tr>
      <tr><td>Universal</td><td><code>*</code></td><td>Everything</td></tr>
    </table>
    <h3>Habits that save time</h3>
    <ul>
      <li>No space after the dot or hash: <code>.note</code>, not <code>. note</code>.</li>
      <li>Copy class and id names straight from the HTML: one wrong letter and the rule silently matches nothing.</li>
      <li>Reach for classes by default; save ids for the genuinely unique element.</li>
    </ul>`
});


PG.add({
  id:'s05-color-vocab', index:35, udemyId:37350350, minutes:9, section:'s05', slug:'color-vocab-project', kind:'build', project:true,
  title:'Colour Vocab Website',
  blurb:'A flashcard page for learning colour words in Spanish: each word appears in the colour it names, above a picture of that colour. The HTML is finished and must not change. Everything happens in style.css, and the real exercise is choosing the right selector each time: id, class or element.',
  tasks:[
    'Check the stylesheet is connected: add <code>body { background-color: red; }</code> to style.css, see the preview turn red, then delete it. On your own machine this quick test shows at once whether the <code>&lt;link&gt;</code> path is right.',
    'Use the five <b>id</b> selectors to give each word its colour: <code>#red { color: red; }</code>, then <code>#blue</code>, <code>#orange</code>, <code>#green</code> and <code>#yellow</code>.',
    'Make the five colour words a lighter weight with <code>font-weight: normal</code>. A bare <code>h2</code> selector would also un-bold the subtitle, so use the class the five words share: <code>.color-title</code>.',
    'The pictures come in different sizes. Use an <b>element</b> selector to make every <code>img</code> <code>200px</code> high and <code>200px</code> wide.',
    'Make it yours: swap the words for another language, or change the yellow word to <code>gold</code>, which is easier to read on white.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vocabulary Spanish</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <!-- Don't change this file: all your work goes in style.css -->
  <h1>Colores</h1>
  <h2>Learn colours in Spanish!</h2>

  <h2 class="color-title" id="red">Rojo</h2>
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='150'><rect width='240' height='150' fill='red'/></svg>" alt="red" />

  <h2 class="color-title" id="blue">Azul</h2>
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='170' height='240'><rect width='170' height='240' fill='blue'/></svg>" alt="blue" />

  <h2 class="color-title" id="orange">Naranja</h2>
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='120'><rect width='300' height='120' fill='orange'/></svg>" alt="orange" />

  <h2 class="color-title" id="green">Verde</h2>
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='150' height='150' fill='green'/></svg>" alt="green" />

  <h2 class="color-title" id="yellow">Amarillo</h2>
  <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='190'><rect width='260' height='190' fill='yellow'/></svg>" alt="yellow" />
</body>
</html>`,
'style.css':`/* TODO: style the page with selectors only.
   1. test that this file is connected (then remove the test)
   2. colour each word using its id
   3. .color-title -> a lighter font-weight
   4. every img -> 200px by 200px                          */
`},
  solution:{
'style.css':`img {
  height: 200px;
  width: 200px;
}

.color-title {
  font-weight: normal;
}

#red {
  color: red;
}

#blue {
  color: blue;
}

#orange {
  color: orange;
}

#green {
  color: green;
}

#yellow {
  color: yellow;
}
`},
  explore:[{
    title:'Which selector should un-bold the words?', height:470,
    note:'The same declaration, <code>font-weight: normal</code>, with four different selectors. Only one of them hits exactly the five colour words.',
    html:`
<div class="knobs">
  <label>apply <span class="tag">font-weight: normal</span> to
    <select id="sel">
      <option value="h2">h2</option>
      <option value=".color-title" selected>.color-title</option>
      <option value="#red">#red</option>
      <option value="*">*</option>
    </select>
  </label>
</div>
<div class="stage" id="stage">
  <h1 style="margin:0 0 4px;font-size:24px">Colores</h1>
  <h2 style="margin:0 0 10px;font-size:18px">Learn colours in Spanish!</h2>
  <h2 class="color-title" id="red" style="color:red;margin:4px 0;font-size:18px">Rojo</h2>
  <h2 class="color-title" id="blue" style="color:blue;margin:4px 0;font-size:18px">Azul</h2>
  <h2 class="color-title" id="green" style="color:green;margin:4px 0;font-size:18px">Verde</h2>
</div>
<pre class="readout" id="ro"></pre>
<style id="rule"></style>
<script>
  var verdict = {
    'h2':'Too wide: the subtitle is an h2 too, so it loses its bold as well.',
    '.color-title':'Just right: only the colour words carry this class.',
    '#red':'Too narrow: an id reaches one element, so you would need five rules.',
    '*':'Far too wide: every element, the h1 included, goes thin.'
  };
  var sel = document.getElementById('sel');
  function upd(){
    var s = sel.value;
    document.getElementById('rule').textContent =
      '#stage ' + s + ' { font-weight: normal !important; outline: 2px dashed #ff5c8a; outline-offset: 2px; }';
    var hits = document.querySelectorAll('#stage ' + s).length;
    document.getElementById('ro').textContent = s + ' {\\n  font-weight: normal;\\n}\\n\\n' + hits + ' elements changed. ' + verdict[s];
  }
  sel.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'Why use <code>.color-title</code> instead of <code>h2</code> for <code>font-weight: normal</code>?', options:['Classes load faster','The subtitle is also an h2, and it should stay bold','h2 cannot take font-weight','Ids would not work'], answer:1, why:'Choose the selector that matches exactly the group you mean. The shared class marks the colour words and nothing else.' },
    { q:'Each word needs its own, different colour. Which selector type suits that?', options:['The universal selector','An element selector','An id selector per word','An attribute selector on img'], answer:2, why:'Each heading has a unique id, and a unique look is exactly what ids are for.' },
    { q:'Every picture should be 200 × 200. Which selector is simplest?', options:['img','.color-title','#red','h2 img'], answer:0, why:'An element selector reaches every img on the page in one rule.' },
  ],
  notes:`
    <h3>Picking the selector</h3>
    <table>
      <tr><th>What you want to reach</th><th>Use</th><th>Here</th></tr>
      <tr><td>One unique element</td><td>id</td><td><code>#red</code>, <code>#blue</code> …</td></tr>
      <tr><td>A group that shares a trait</td><td>class</td><td><code>.color-title</code></td></tr>
      <tr><td>Every element of one tag</td><td>element</td><td><code>img</code></td></tr>
    </table>
    <h3>When nothing is styled at all</h3>
    <p>On your own machine, the usual cause is the stylesheet not being found: the file is in the wrong folder, or its name differs from the <code>href</code> (even <code>Style.css</code> vs <code>style.css</code>). The red-background test in task 1 catches that in seconds.</p>`
});


PG.add({
  id:'l036', index:36, udemyId:17966488, minutes:2, section:'s05', slug:'dealing-with-distractions', kind:'read',
  title:'Tip from Angela - Dealing with Distractions',
  blurb:'A two-minute study tip. A short interruption costs far more focus than the minute it takes, so clear distractions away <b>before</b> you start: phone on airplane mode and out of sight, a closed door, or a quieter time of day if people are the problem.',
  quiz:[
    { q:'Which habit does the tip recommend before a study session?', options:['Keep the phone face down so you can still glance at it','Put the phone on airplane mode and out of sight, for example in a drawer','Answer every message first so nobody interrupts later','Keep the TV on for background noise'], answer:1, why:'Out of sight and offline removes the temptation, instead of relying on willpower to ignore it.' },
  ],
});


PG.add({
  id:'l037', index:37, udemyId:12399710, minutes:1, section:'s05', slug:'student-community', kind:'read',
  title:'Join the Student Community',
  blurb:'A short admin article inviting you to join the course\'s student community and meet other people learning alongside you. Nothing to code here.',
});
