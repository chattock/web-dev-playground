/* ===== Section 2 — Introduction to HTML ===== */

PG.add({
  id:'s02-headings', section:'s02', slug:'headings', lesson:'2.1',
  title:'Heading Elements',
  blurb:'Six levels of heading, <code>&lt;h1&gt;</code> down to <code>&lt;h6&gt;</code>. They are not just "big text" — they describe the <b>hierarchy</b> of the page, which is what search engines and screen readers read.',
  tasks:[
    'One <code>&lt;h1&gt;</code> for the book title.',
    '<code>&lt;h2&gt;</code> for each chapter.',
    '<code>&lt;h3&gt;</code> for each section, and an <code>&lt;h4&gt;</code> for the diagram under Chapter 2\'s section.',
    'Match the structure shown in the task exactly — indentation in your code is for you, not the browser.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Heading Element</title>
</head>
<body>

  <!-- TODO: build this structure with h1 - h4
       Book
         Chapter 1
           Section 1
           Section 2
         Chapter 2
           Section 1
             Diagram 1
         Chapter 3
           Section 1
           Section 2
  -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Heading Element</title>
</head>
<body>

  <h1>Book</h1>

  <h2>Chapter 1</h2>
  <h3>Section 1</h3>
  <h3>Section 2</h3>

  <h2>Chapter 2</h2>
  <h3>Section 1</h3>
  <h4>Diagram 1</h4>

  <h2>Chapter 3</h2>
  <h3>Section 1</h3>
  <h3>Section 2</h3>

</body>
</html>`},
  explore:[{
    title:'Heading levels and why they matter', height:520,
    note:'The left is what you see; the right is the outline a screen reader or Google builds from it. Break the hierarchy and watch the outline stop making sense.',
    html:`
<div class="knobs">
  <label>page structure
    <select id="mode">
      <option value="good">correct hierarchy</option>
      <option value="skip">skips from h1 to h4</option>
      <option value="many">five h1s</option>
      <option value="fake">no headings, just bold text</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:14px;align-items:flex-start">
  <div style="flex:1"><h4>the page</h4><div id="page" style="border:1px solid #dfe3ee;padding:12px;border-radius:8px"></div></div>
  <div style="flex:1"><h4>the outline a machine reads</h4><pre class="readout" id="out" style="margin:0"></pre></div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var pages = {
    good:'<h1>Coffee Shop</h1><h2>Our Beans</h2><h3>Ethiopian</h3><h3>Colombian</h3><h2>Find Us</h2>',
    skip:'<h1>Coffee Shop</h1><h4>Our Beans</h4><h3>Ethiopian</h3><h2>Find Us</h2>',
    many:'<h1>Coffee Shop</h1><h1>Our Beans</h1><h1>Ethiopian</h1><h1>Colombian</h1><h1>Find Us</h1>',
    fake:'<p style="font-size:26px;font-weight:700">Coffee Shop</p>' +
         '<p style="font-size:20px;font-weight:700">Our Beans</p>' +
         '<p style="font-size:16px;font-weight:700">Ethiopian</p>'
  };
  var notes = {
    good:'Clean nesting: one h1, h2s beneath it, h3s beneath those. A machine can build a proper table of contents.',
    skip:'Jumping h1 → h4 leaves gaps in the outline. It still LOOKS fine, but the structure is now lying about the relationships.',
    many:'Five h1s means five top-level titles and no hierarchy at all. Use ONE h1 per page — the page title.',
    fake:'Bold paragraphs look identical to a human and are invisible to a machine. Zero headings found. This is the mistake that quietly wrecks accessibility and SEO.'
  };
  var m = document.getElementById('mode');
  function upd(){
    document.getElementById('page').innerHTML = pages[m.value];
    var hs = document.getElementById('page').querySelectorAll('h1,h2,h3,h4,h5,h6');
    var lines = [];
    hs.forEach(function(h){
      var lvl = +h.tagName[1];
      lines.push('  '.repeat(lvl-1) + h.tagName.toLowerCase() + '  ' + h.textContent);
    });
    document.getElementById('out').textContent = lines.length ? lines.join('\\n') : '(no headings found at all)';
    document.getElementById('ro').textContent = notes[m.value];
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The rules</h3>
    <ul>
      <li><b>One <code>&lt;h1&gt;</code> per page</b> — it is the page's title.</li>
      <li><b>Don't skip levels</b> — h2 follows h1, h3 follows h2.</li>
      <li><b>Choose by meaning, not size.</b> If you want a smaller heading, use CSS — do not drop to an <code>&lt;h4&gt;</code> just because it looks better.</li>
    </ul>
    <h3>Anatomy of an element</h3>
    <pre>&lt;h1&gt;Book&lt;/h1&gt;
 ^^^^      ^^^^^
 opening   closing tag (note the slash)
      ^^^^
      the content</pre>
    <h3>Why it matters beyond looks</h3>
    <p>Screen readers let blind users jump between headings to navigate a page. Search engines use them to work out what a page is about. Both are reading your structure, not your font sizes.</p>`
});


PG.add({
  id:'s02-paragraphs', section:'s02', slug:'paragraphs', lesson:'2.2',
  title:'Paragraph Elements',
  blurb:'<code>&lt;p&gt;</code> wraps a block of body text. The browser ignores the line breaks and extra spaces you type — only the tags decide where blocks start and end.',
  tasks:[
    'Split the wall of text into three separate paragraphs.',
    'Add extra blank lines and spaces inside a paragraph and confirm the browser ignores them.',
    'Try leaving a <code>&lt;/p&gt;</code> off and see how the browser copes.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Paragraph Element</title>
</head>
<body>

  <h1>Lorem Ipsum</h1>

  <!-- TODO: wrap each of these three blocks in its own <p> -->

  First paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

  Second paragraph. Suscipit adipiscing bibendum est ultricies. Tortor aliquam
  nulla facilisi cras fermentum. Eget aliquet nibh praesent tristique magna.

  Third paragraph. Nisl purus in mollis nunc sed id semper risus. Ipsum a arcu
  cursus vitae congue mauris rhoncus aenean.

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Paragraph Element</title>
</head>
<body>

  <h1>Lorem Ipsum</h1>

  <p>
    First paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>

  <p>
    Second paragraph. Suscipit adipiscing bibendum est ultricies. Tortor aliquam
    nulla facilisi cras fermentum. Eget aliquet nibh praesent tristique magna.
  </p>

  <p>
    Third paragraph. Nisl purus in mollis nunc sed id semper risus. Ipsum a arcu
    cursus vitae congue mauris rhoncus aenean.
  </p>

</body>
</html>`},
  explore:[{
    title:'Whitespace collapsing', height:440,
    note:'Type as many spaces and line breaks as you like on the left. The browser squashes every run of whitespace down to a single space.',
    html:`
<div class="stage" style="display:flex;gap:14px;align-items:stretch">
  <div style="flex:1">
    <h4>what you type</h4>
    <textarea id="src" style="width:100%;height:130px;font-family:Menlo,monospace;font-size:12px;
      border:1px solid #cfd5e6;border-radius:8px;padding:8px;resize:vertical">Hello        there.

I typed lots


of blank lines
   and     spaces.</textarea>
  </div>
  <div style="flex:1">
    <h4>what the browser shows</h4>
    <div id="out" style="border:1px solid #dfe3ee;border-radius:8px;padding:10px;height:130px;overflow:auto;background:#fff"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">This is why <code>&lt;p&gt;</code> and <code>&lt;br /&gt;</code> exist at all — pressing enter in your code does nothing to the page. If you genuinely need whitespace preserved, that is what <code>&lt;pre&gt;</code> is for.</p>
<script>
  var src = document.getElementById('src');
  function upd(){
    document.getElementById('out').textContent = src.value;
    var chars = src.value.length;
    var squashed = src.value.replace(/\\s+/g,' ').trim().length;
    document.getElementById('ro').textContent =
      'you typed      : ' + chars + ' characters\\n' +
      'browser renders: ' + squashed + ' characters worth of text\\n' +
      (chars - squashed) + ' characters of whitespace were collapsed away';
  }
  src.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Block vs inline</h3>
    <p><code>&lt;p&gt;</code> is a <b>block</b> element: it starts on a new line and takes the full width, with a gap above and below it. That gap is a default margin the browser adds — CSS can remove it later.</p>
    <h3>The lorem ipsum trick</h3>
    <p>In VS Code, type <code>lorem</code> and press Tab and it generates placeholder text for you. <code>lorem50</code> gives you 50 words of it.</p>
    <h3>Don't nest paragraphs</h3>
    <p>A <code>&lt;p&gt;</code> cannot contain another <code>&lt;p&gt;</code>. The browser will silently close the first one for you and your structure will not be what you think it is.</p>`
});


PG.add({
  id:'s02-void-elements', section:'s02', slug:'void-elements', lesson:'2.3',
  title:'Void Elements',
  blurb:'Most tags come in pairs, but a few have no content to wrap so they never close: <code>&lt;br /&gt;</code> for a line break, <code>&lt;hr /&gt;</code> for a horizontal rule, <code>&lt;img /&gt;</code> for a picture.',
  tasks:[
    'Use <code>&lt;br /&gt;</code> to put each line of the address on its own line — <b>inside a single paragraph</b>.',
    'Add an <code>&lt;hr /&gt;</code> between the address and the biography.',
    'Notice that <code>&lt;br /&gt;</code> is not the same as starting a new <code>&lt;p&gt;</code> — compare the spacing.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Void Elements</title>
</head>
<body>

  <h1>William Blake</h1>

  <!-- TODO 1: put each line of the address on its own line with <br /> -->
  <p>
    17 South Molton Street
    London
    W1K 5QT
    UK
  </p>

  <!-- TODO 2: a horizontal rule goes here -->

  <p>
    William Blake (28 November 1757 – 12 August 1827) was an English poet,
    painter, and printmaker. Largely unrecognised during his life, Blake is
    now considered a seminal figure in the history of the poetry and visual
    art of the Romantic Age.
  </p>

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Void Elements</title>
</head>
<body>

  <h1>William Blake</h1>

  <p>
    17 South Molton Street <br />
    London <br />
    W1K 5QT <br />
    UK <br />
  </p>

  <hr />

  <p>
    William Blake (28 November 1757 – 12 August 1827) was an English poet,
    painter, and printmaker. Largely unrecognised during his life, Blake is
    now considered a seminal figure in the history of the poetry and visual
    art of the Romantic Age.
  </p>

</body>
</html>`},
  explore:[{
    title:'&lt;br /&gt; vs a new &lt;p&gt;', height:400,
    note:'They both put text on a new line. Only one of them says "this is a separate block of thought" — and the spacing gives it away.',
    html:`
<div class="knobs">
  <label>separator
    <select id="mode">
      <option value="br">&lt;br /&gt;  — a line break inside one paragraph</option>
      <option value="p">&lt;/p&gt;&lt;p&gt;  — two separate paragraphs</option>
    </select>
  </label>
</div>
<div class="stage" id="stage"></div>
<pre class="readout" id="ro"></pre>
<p class="note">Use <code>&lt;br /&gt;</code> for things that belong together but sit on separate lines — an address, a poem, song lyrics. Use a new <code>&lt;p&gt;</code> for a genuinely new paragraph.</p>
<script>
  var m = document.getElementById('mode');
  function upd(){
    if (m.value === 'br'){
      document.getElementById('stage').innerHTML =
        '<p style="outline:2px dashed #b9c0d4;padding:6px">17 South Molton Street <br /> London <br /> W1K 5QT</p>';
      document.getElementById('ro').textContent =
        '<p>17 South Molton Street <br /> London <br /> W1K 5QT</p>\\n\\n' +
        'ONE paragraph (see the single dashed outline), three lines.\\n' +
        'No extra vertical gap — the lines sit tight together.';
    } else {
      document.getElementById('stage').innerHTML =
        '<p style="outline:2px dashed #b9c0d4;padding:6px">17 South Molton Street</p>' +
        '<p style="outline:2px dashed #b9c0d4;padding:6px">London</p>' +
        '<p style="outline:2px dashed #b9c0d4;padding:6px">W1K 5QT</p>';
      document.getElementById('ro').textContent =
        '<p>17 South Molton Street</p>\\n<p>London</p>\\n<p>W1K 5QT</p>\\n\\n' +
        'THREE paragraphs (three outlines), each with a margin above and below.\\n' +
        'Structurally this claims they are three unrelated blocks of text.';
    }
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The void elements you'll meet</h3>
    <table>
      <tr><th>Tag</th><th>Does</th></tr>
      <tr><td><code>&lt;br /&gt;</code></td><td>Line break</td></tr>
      <tr><td><code>&lt;hr /&gt;</code></td><td>Horizontal rule / thematic break</td></tr>
      <tr><td><code>&lt;img /&gt;</code></td><td>An image</td></tr>
      <tr><td><code>&lt;input /&gt;</code></td><td>A form field</td></tr>
      <tr><td><code>&lt;meta /&gt;</code></td><td>Page information in the head</td></tr>
      <tr><td><code>&lt;link /&gt;</code></td><td>Attaches a stylesheet</td></tr>
    </table>
    <h3>That trailing slash</h3>
    <p><code>&lt;br /&gt;</code> and <code>&lt;br&gt;</code> are both valid in HTML5 — the slash is a leftover from XHTML. Angela writes the slash, so this playground does too. Pick one and be consistent.</p>`
});


PG.add({
  id:'s02-movie-ranking', section:'s02', slug:'movie-ranking', lesson:'2.4', project:true,
  title:'Movie Ranking Project',
  blurb:'Your first project: a ranked list of your favourite films, using only headings, paragraphs and rules.',
  tasks:[
    '<code>&lt;h1&gt;</code> for the page title and an <code>&lt;h2&gt;</code> for the subtitle.',
    'An <code>&lt;hr /&gt;</code> under the title block.',
    'For each film: an <code>&lt;h3&gt;</code> with its name and a <code>&lt;p&gt;</code> saying why you like it.',
    'Then put in your own films — this one is yours.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Movie Ranking</title>
</head>
<body>

  <!-- TODO: title, subtitle, a rule, then three films with descriptions -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Movie Ranking</title>
</head>
<body>

  <h1>The Best Movies of All Time</h1>
  <h2>My top 3, and I will not be taking questions.</h2>

  <hr />

  <h3>1. Spirited Away</h3>
  <p>My favourite anime. The backgrounds alone are worth the ticket.</p>

  <h3>2. Ex Machina</h3>
  <p>Really cool sci-fi, and the ending still bothers me years later.</p>

  <h3>3. Drive</h3>
  <p>Super stylish. Barely any dialogue and it does not need any.</p>

</body>
</html>`},
  notes:`
    <h3>What this is really practising</h3>
    <p>Nothing new — that is the point. Projects are where you find out which bits you actually remember without looking them up.</p>
    <h3>Go further</h3>
    <ul>
      <li>Add a <code>&lt;p&gt;</code> at the bottom crediting yourself.</li>
      <li>Add an <code>&lt;hr /&gt;</code> between each film and see whether you prefer it.</li>
      <li>Come back to this page after section 6 and give it some CSS.</li>
    </ul>`
});
