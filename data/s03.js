/* ===== Section 3 — Intermediate HTML ===== */

PG.add({
  id:'s03-lists', index:18, udemyId:37349778, minutes:11, section:'s03', slug:'lists', lesson:'3.1',
  title:'List Elements',
  blurb:'Two kinds of list: <code>&lt;ul&gt;</code> when the order does not matter (bullets) and <code>&lt;ol&gt;</code> when it does (numbers). Either way, every item goes in an <code>&lt;li&gt;</code>.',
  tasks:[
    'Make the ingredients into <b>unordered</b> lists — one for the dough, one for the filling.',
    'Make the instructions an <b>ordered</b> list, because the steps happen in order.',
    'Every single item needs its own <code>&lt;li&gt;</code> wrapper.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cinnamon Rolls</title>
</head>
<body>

  <h1>Recipe for the Best Cinnamon Rolls</h1>

  <h2>Ingredients</h2>

  <h3>For the dough:</h3>
  <!-- TODO 1: an unordered list -->
  3/4 cup warm milk
  2 1/4 teaspoons yeast
  1/4 cup granulated sugar
  1 egg plus 1 egg yolk
  1/4 cup butter
  3 cups bread flour

  <h3>For the filling:</h3>
  <!-- TODO 2: another unordered list -->
  2/3 cup dark brown sugar
  1 1/2 tablespoons ground cinnamon
  1/4 cup butter

  <h2>Instructions</h2>
  <!-- TODO 3: an ORDERED list — these steps have to happen in sequence -->
  Mix the milk with the yeast, sugar and eggs.
  Add the flour and knead for 10 minutes.
  Let it rise for an hour.
  Roll out, fill, slice and bake.

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cinnamon Rolls</title>
</head>
<body>

  <h1>Recipe for the Best Cinnamon Rolls</h1>

  <h2>Ingredients</h2>

  <h3>For the dough:</h3>
  <ul>
    <li>3/4 cup warm milk</li>
    <li>2 1/4 teaspoons yeast</li>
    <li>1/4 cup granulated sugar</li>
    <li>1 egg plus 1 egg yolk</li>
    <li>1/4 cup butter</li>
    <li>3 cups bread flour</li>
  </ul>

  <h3>For the filling:</h3>
  <ul>
    <li>2/3 cup dark brown sugar</li>
    <li>1 1/2 tablespoons ground cinnamon</li>
    <li>1/4 cup butter</li>
  </ul>

  <h2>Instructions</h2>
  <ol>
    <li>Mix the milk with the yeast, sugar and eggs.</li>
    <li>Add the flour and knead for 10 minutes.</li>
    <li>Let it rise for an hour.</li>
    <li>Roll out, fill, slice and bake.</li>
  </ol>

</body>
</html>`},
  explore:[{
    title:'ul vs ol, and the list-style property', height:470,
    note:'Same list items, different container and different bullet styles. The choice between ul and ol is about <b>meaning</b>; the appearance is CSS and can be anything.',
    html:`
<div class="knobs">
  <label>container
    <select id="tag"><option value="ul">&lt;ul&gt; unordered</option><option value="ol">&lt;ol&gt; ordered</option></select>
  </label>
  <label>list-style-type
    <select id="st">
      <option value="">(default)</option>
      <option value="disc">disc</option><option value="circle">circle</option>
      <option value="square">square</option><option value="decimal">decimal</option>
      <option value="lower-alpha">lower-alpha</option><option value="upper-roman">upper-roman</option>
      <option value="none">none</option>
    </select>
  </label>
</div>
<div class="stage" id="stage"></div>
<pre class="readout" id="ro"></pre>
<p class="note">Pick the tag for what the content <em>means</em> — steps in a recipe are ordered, ingredients are not. Then style it however you like; a <code>&lt;ul&gt;</code> with numbers is still semantically unordered, which is misleading, so try not to.</p>
<script>
  var tag = document.getElementById('tag'), st = document.getElementById('st');
  function upd(){
    var style = st.value ? ' style="list-style-type:' + st.value + '"' : '';
    document.getElementById('stage').innerHTML =
      '<' + tag.value + style + '>' +
      '<li>Wash the clothes</li><li>Read a chapter</li><li>Do the maths questions</li>' +
      '</' + tag.value + '>';
    document.getElementById('ro').textContent =
      '<' + tag.value + '>\\n' +
      '  <li>Wash the clothes</li>\\n  <li>Read a chapter</li>\\n  <li>Do the maths questions</li>\\n' +
      '</' + tag.value + '>' +
      (st.value ? '\\n\\n' + tag.value + ' { list-style-type: ' + st.value + '; }' : '');
  }
  tag.addEventListener('change', upd); st.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The two lists</h3>
    <ul>
      <li><code>&lt;ul&gt;</code> — <b>u</b>nordered. Bullets. Shopping list, features, ingredients.</li>
      <li><code>&lt;ol&gt;</code> — <b>o</b>rdered. Numbers. Steps, rankings, instructions.</li>
      <li><code>&lt;li&gt;</code> — <b>l</b>ist <b>i</b>tem. Goes inside either one.</li>
    </ul>
    <h3>Only li goes directly inside</h3>
    <p>A <code>&lt;ul&gt;</code> may only have <code>&lt;li&gt;</code> children. Put anything else in there and the browser will move it somewhere you did not expect. Anything you want in a list item goes <em>inside</em> the <code>&lt;li&gt;</code>.</p>
    <h3>Emmet shortcut</h3>
    <p>In VS Code, type <code>ul>li*5</code> and press Tab — you get a list with five empty items instantly.</p>`
});


PG.add({
  id:'s03-nesting', index:19, udemyId:37349804, minutes:14, section:'s03', slug:'nesting', lesson:'3.2',
  title:'Nesting & Indentation',
  blurb:'Elements live inside other elements, forming a tree. Indentation does nothing to the page — it exists so that <em>you</em> can see the tree and spot where a tag has not been closed.',
  tasks:[
    'Build a list where item B contains its own numbered sub-list.',
    'Nest one level deeper: B2 should contain another list inside it.',
    'Keep your indentation tidy as you go — the moment it drifts, you have a bug.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nesting and Indentation</title>
</head>
<body>

  <!-- TODO: build this nested structure
       A
       B
         1. B1
         2. B2
              - B2a
              - B2b
         3. B3
       C
  -->

  <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
  </ul>

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nesting and Indentation</title>
</head>
<body>

  <ul>
    <li>A</li>
    <li>
      B
      <ol>
        <li>B1</li>
        <li>
          B2
          <ul>
            <li>B2a</li>
            <li>B2b</li>
          </ul>
        </li>
        <li>B3</li>
      </ol>
    </li>
    <li>C</li>
  </ul>

</body>
</html>`},
  explore:[{
    title:'The HTML tree', height:520,
    note:'Every page is a tree of elements. Hover a branch on the right to highlight it on the left — this structure is exactly what CSS selectors and JavaScript will walk through later.',
    html:`
<div class="stage" style="display:flex;gap:14px;align-items:flex-start">
  <div style="flex:1">
    <h4>the page</h4>
    <div id="page" style="border:1px solid #dfe3ee;border-radius:8px;padding:10px;font-size:13px">
      <ul>
        <li id="n1">A</li>
        <li id="n2">B
          <ol>
            <li id="n3">B1</li>
            <li id="n4">B2
              <ul><li id="n5">B2a</li><li id="n6">B2b</li></ul>
            </li>
          </ol>
        </li>
        <li id="n7">C</li>
      </ul>
    </div>
  </div>
  <div style="flex:1">
    <h4>the tree (hover a line)</h4>
    <pre class="readout" id="tree" style="margin:0;cursor:default"></pre>
  </div>
</div>
<p class="note">Words for the relationships, which come back constantly in CSS: an element directly inside another is its <b>child</b>; anything inside at any depth is a <b>descendant</b>; the one wrapping it is its <b>parent</b>; elements sharing a parent are <b>siblings</b>.</p>
<script>
  var rows = [
    ['ul', null, 0],
    ['&nbsp;&nbsp;li  A', 'n1', 1],
    ['&nbsp;&nbsp;li  B', 'n2', 1],
    ['&nbsp;&nbsp;&nbsp;&nbsp;ol', null, 2],
    ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;li  B1', 'n3', 3],
    ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;li  B2', 'n4', 3],
    ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ul', null, 4],
    ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;li  B2a', 'n5', 5],
    ['&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;li  B2b', 'n6', 5],
    ['&nbsp;&nbsp;li  C', 'n7', 1]
  ];
  var tree = document.getElementById('tree');
  tree.innerHTML = rows.map(function(r, i){
    return '<span data-i="' + i + '"' + (r[1] ? ' data-t="' + r[1] + '"' : '') +
           ' style="display:block;padding:1px 4px;border-radius:3px">' + r[0] + '</span>';
  }).join('');
  tree.querySelectorAll('span').forEach(function(s){
    s.addEventListener('mouseenter', function(){
      s.style.background = '#2b3550';
      var t = s.getAttribute('data-t');
      if (t) document.getElementById(t).style.outline = '2px solid #ff5c8a';
    });
    s.addEventListener('mouseleave', function(){
      s.style.background = 'transparent';
      var t = s.getAttribute('data-t');
      if (t) document.getElementById(t).style.outline = 'none';
    });
  });
<\/script>`
  }],
  notes:`
    <h3>Indentation is for humans</h3>
    <p>The browser does not care one bit. You care enormously — a missing <code>&lt;/li&gt;</code> is almost invisible in flat code and obvious in indented code.</p>
    <h3>Auto-format</h3>
    <p>In VS Code, <b>Shift + Option + F</b> (Mac) re-indents the whole file. If it produces something you did not expect, that is usually a genuine unclosed tag.</p>
    <h3>Nest properly, don't overlap</h3>
    <pre>&lt;p&gt;&lt;strong&gt;Hello&lt;/strong&gt;&lt;/p&gt;   correct — inner closes first
&lt;p&gt;&lt;strong&gt;Hello&lt;/p&gt;&lt;/strong&gt;   wrong — they cross over</pre>
    <p>Think of tags as brackets in maths: the last one you opened is the first one you close.</p>`
});


PG.add({
  id:'s03-anchors', index:20, udemyId:37349818, minutes:11, section:'s03', slug:'anchors', lesson:'3.3',
  title:'Anchor Elements',
  blurb:'The <code>&lt;a&gt;</code> tag makes a link — the thing that turned documents into a <em>web</em>. The <code>href</code> attribute says where it goes; the text between the tags is what people click.',
  tasks:[
    'Turn each website name into a clickable link with the URL given in the comment.',
    'Make it an ordered list, since it is a ranking.',
    'Add <code>target="_blank"</code> to one of them so it opens in a new tab.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Favourite Websites</title>
</head>
<body>

  <h1>My Top 5 Favourite Websites</h1>

  <!-- TODO: make these into an ordered list of links -->
  Product Hunt      https://www.producthunt.com/
  Wordle            https://www.nytimes.com/games/wordle
  Hacker Typer      https://hackertyper.com/
  Stellarium        https://stellarium-web.org/
  Smash the Walls   https://smashthewalls.com/

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Favourite Websites</title>
</head>
<body>

  <h1>My Top 5 Favourite Websites</h1>

  <ol>
    <li><a href="https://www.producthunt.com/">Product Hunt</a></li>
    <li><a href="https://www.nytimes.com/games/wordle" target="_blank">Wordle</a></li>
    <li><a href="https://hackertyper.com/">Hacker Typer</a></li>
    <li><a href="https://stellarium-web.org/">Stellarium</a></li>
    <li><a href="https://smashthewalls.com/">Smash the Walls</a></li>
  </ol>

</body>
</html>`},
  explore:[{
    title:'Anatomy of a link', height:450,
    note:'Change the attributes and watch the tag rebuild itself. Attributes always live in the <b>opening</b> tag, as <code>name="value"</code>.',
    html:`
<div class="knobs">
  <label>href <input type="text" id="href" value="https://www.producthunt.com/" size="26"></label>
  <label>text <input type="text" id="txt" value="Product Hunt" size="14"></label>
  <label><input type="checkbox" id="blank"> target="_blank"</label>
  <label><input type="checkbox" id="title"> add a title tooltip</label>
</div>
<div class="stage">
  <div id="out" style="font-size:15px"></div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">Try emptying the <b>href</b> box. The text stops looking like a link at all — an anchor without a destination is just text wearing a costume.</p>
<script>
  var h = document.getElementById('href'), t = document.getElementById('txt'),
      b = document.getElementById('blank'), ti = document.getElementById('title');
  function upd(){
    var attrs = h.value ? ' href="' + h.value + '"' : '';
    if (b.checked) attrs += ' target="_blank"';
    if (ti.checked) attrs += ' title="Opens ' + (h.value || 'nothing') + '"';
    document.getElementById('out').innerHTML = '<a' + attrs + '>' + (t.value || '(no text)') + '</a>';
    document.getElementById('ro').textContent =
      '<a' + attrs + '>' + (t.value || '(no text)') + '</a>\\n\\n' +
      'href    where it goes\\n' +
      (b.checked ? 'target  _blank opens it in a NEW tab\\n' : '') +
      (ti.checked ? 'title   the tooltip on hover\\n' : '') +
      '\\nthe text between the tags is what the user sees and clicks';
  }
  [h,t,b,ti].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  notes:`
    <h3>Attributes</h3>
    <p>An attribute is extra information on the opening tag, written <code>name="value"</code>. <code>href</code> is the anchor's; you have already met <code>lang</code> on <code>&lt;html&gt;</code> and <code>charset</code> on <code>&lt;meta&gt;</code>.</p>
    <h3>Kinds of href</h3>
    <table>
      <tr><td><code>https://example.com</code></td><td>Another website (absolute)</td></tr>
      <tr><td><code>./about.html</code></td><td>Another page of yours (relative — section 4)</td></tr>
      <tr><td><code>#section-2</code></td><td>Jump to an id on this page</td></tr>
      <tr><td><code>mailto:me@example.com</code></td><td>Opens an email</td></tr>
    </table>
    <h3>Write link text that means something</h3>
    <p>"Click here" tells a screen-reader user nothing when read out of context. "Read the syllabus" tells them everything.</p>`
});


PG.add({
  id:'s03-images', index:21, udemyId:37349846, minutes:8, section:'s03', slug:'images', lesson:'3.4',
  title:'Image Elements',
  blurb:'<code>&lt;img&gt;</code> is a void element with two attributes that matter: <code>src</code> (where the picture lives) and <code>alt</code> (what it shows, for anyone who cannot see it).',
  tasks:[
    'Add an image using the URL in the comment.',
    'Give it a proper <code>alt</code> description.',
    'Set a <code>width</code> so it is not enormous.',
    'Then break the <code>src</code> on purpose and see what the <code>alt</code> text is for.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>I am a Dog Person</title>
</head>
<body>

  <h1>I am a Dog Person</h1>

  <!-- TODO: add an image
       src: https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=70
       it shows: a golden retriever looking at the camera
  -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>I am a Dog Person</title>
</head>
<body>

  <h1>I am a Dog Person</h1>

  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=70"
       alt="a golden retriever looking at the camera"
       width="400" />

  <p>This is a very good dog.</p>

</body>
</html>`},
  explore:[{
    title:'Why alt text exists', height:470,
    note:'Break the image and the alt text is all that is left. It is also exactly what a blind user hears, and what Google indexes.',
    html:`
<div class="knobs">
  <label>alt text <input type="text" id="alt" value="a golden retriever looking at the camera" size="30"></label>
  <label><input type="checkbox" id="broken"> break the src (bad URL)</label>
  <label>width <input type="range" min="120" max="380" value="260" id="w"><span class="val">260px</span></label>
</div>
<div class="stage">
  <img id="img" alt="" style="display:block;border-radius:8px" />
</div>
<pre class="readout" id="ro"></pre>
<p class="note"><b>Writing good alt text:</b> describe what the image shows, not that it is an image. "Golden retriever on a beach" — not "picture of a dog". If an image is purely decorative, use an empty <code>alt=""</code> so screen readers skip it entirely.</p>
<script>
  var GOOD = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=70';
  var BAD  = 'https://example.com/this-file-does-not-exist.jpg';
  var alt = document.getElementById('alt'), br = document.getElementById('broken'), w = document.getElementById('w');
  function upd(){
    var img = document.getElementById('img');
    img.src = br.checked ? BAD : GOOD;
    img.alt = alt.value;
    img.width = w.value;
    w.parentElement.querySelector('.val').textContent = w.value + 'px';
    document.getElementById('ro').textContent =
      '<img src="' + (br.checked ? '(broken link)' : 'dog.jpg') + '"\\n' +
      '     alt="' + alt.value + '"\\n' +
      '     width="' + w.value + '" />\\n\\n' +
      (br.checked
        ? 'The image failed to load, so the browser shows the ALT text instead.\\nWithout it, the user would see a blank box and learn nothing.'
        : 'A screen reader announces: "image, ' + (alt.value || '(no description!)') + '"');
  }
  [alt, br, w].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  notes:`
    <h3>The attributes</h3>
    <ul>
      <li><code>src</code> — the file. A full URL, or a path to a file of yours (section 4).</li>
      <li><code>alt</code> — a text description. Required for accessibility, shown if the image fails, read by search engines.</li>
      <li><code>width</code> / <code>height</code> — size in pixels. Setting them stops the page jumping about as images load.</li>
    </ul>
    <h3>Formats</h3>
    <table>
      <tr><td><b>JPG</b></td><td>Photographs. Small files, no transparency.</td></tr>
      <tr><td><b>PNG</b></td><td>Logos, screenshots, anything needing transparency.</td></tr>
      <tr><td><b>SVG</b></td><td>Icons and logos. Vector, so it never goes blurry.</td></tr>
      <tr><td><b>GIF</b></td><td>Simple animations.</td></tr>
      <tr><td><b>WebP</b></td><td>The modern all-rounder — smaller than JPG or PNG.</td></tr>
    </table>
    <h3>Free images</h3>
    <p>Unsplash, Pexels and Pixabay are all free for commercial use. The dog above comes from Unsplash.</p>`
});


PG.add({
  id:'s03-birthday', index:22, udemyId:37349866, minutes:4, section:'s03', slug:'birthday-invite', lesson:'3.5', project:true,
  title:'Birthday Invite Project',
  blurb:'Everything from sections 2 and 3 in one page: headings, paragraphs, a rule, lists, links and an image.',
  tasks:[
    'A heading and a short invitation paragraph.',
    'An image for the party.',
    'A list of what to bring, and an ordered list of the plan for the day.',
    'A link to the venue on a map, and a <code>mailto:</code> link to RSVP.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You're Invited</title>
</head>
<body>

  <!-- TODO: build the invitation.
       heading, paragraph, image, an unordered list, an ordered list, and links -->

</body>
</html>`},
  solution:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>You're Invited</title>
</head>
<body>

  <h1>You're Invited!</h1>
  <h2>Saturday the 14th, from 7pm</h2>

  <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=70"
       alt="birthday balloons and confetti"
       width="420" />

  <p>
    It is my birthday and I would very much like you to be there.
    There will be cake, questionable music, and at least one board game argument.
  </p>

  <hr />

  <h3>What to bring</h3>
  <ul>
    <li>Yourself</li>
    <li>Something to drink</li>
    <li>A song request</li>
  </ul>

  <h3>The plan</h3>
  <ol>
    <li>Arrive and say hello</li>
    <li>Food at 8pm</li>
    <li>Cake at 9pm</li>
    <li>Board games until someone flips the table</li>
  </ol>

  <hr />

  <p>
    We are at <a href="https://www.openstreetmap.org" target="_blank">this address</a>.
    Let me know you're coming: <a href="mailto:hello@example.com">RSVP here</a>.
  </p>

</body>
</html>`},
  notes:`
    <h3>The end of HTML-only</h3>
    <p>This is the last project before CSS arrives. It is worth noticing how far plain HTML gets you — the page is complete, readable and works on every device. It is just unstyled.</p>
    <h3>Go further</h3>
    <ul>
      <li>Make the image itself a link to the map (wrap the <code>&lt;img&gt;</code> in an <code>&lt;a&gt;</code> — that is section 4).</li>
      <li>Add a second page with directions and link to it (also section 4).</li>
      <li>Come back after section 6 and make it look like an actual invitation.</li>
    </ul>`
});
