/* ===== Section 6 — CSS Properties ===== */

PG.add({
  id:'s06-colors', index:38, udemyId:37350376, minutes:7, section:'s06', slug:'colors', kind:'build',
  title:'CSS Colours',
  blurb:'Two properties, two jobs: <code>color</code> paints the <b>text</b>, <code>background-color</code> fills the <b>box behind it</b>, on any element, not just the body. A value can be one of CSS\'s named colours (<code>darkseagreen</code>) or a hex code (<code>#c58940</code>) copied from a palette site.',
  tasks:[
    'In the <code>&lt;style&gt;</code> element, set the <code>body</code> background colour to <code>antiquewhite</code>.',
    'Make the <code>h1</code> text <code>whitesmoke</code>.',
    'Give the <code>h1</code> a <code>darkseagreen</code> background. <code>background-color</code> works on headings too: it fills just the heading\'s own box.',
    'Make the <code>h2</code> text <code>#faf8f1</code>, this time with a hex code.',
    'Give the <code>h2</code> a <code>#c58940</code> background.',
    'Bonus: <code>darkseagreen</code> is a name for <code>#8fbc8f</code>. Swap the name for the hex code and check that nothing changes.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colors</title>
  <style>
    /* TODO 1: body -> background-color antiquewhite */

    /* TODO 2 + 3: h1 -> text whitesmoke, background-color darkseagreen */

    /* TODO 4 + 5: h2 -> text #faf8f1, background-color #c58940 */

  </style>
</head>
<body>
  <h1>Hello</h1>
  <h2>World</h2>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colors</title>
  <style>
    body {
      background-color: antiquewhite;
    }

    h1 {
      color: whitesmoke;
      background-color: darkseagreen;
    }

    h2 {
      color: #faf8f1;
      background-color: #c58940;
    }
  </style>
</head>
<body>
  <h1>Hello</h1>
  <h2>World</h2>
</body>
</html>`},
  explore:[
  {
    title:'Colour picker to CSS', height:430,
    note:'Drag the pickers. The readout is the exact rule you have just written; that hex code is what you would paste into your stylesheet. Notice which picker changes the letters and which changes the box.',
    html:`
<div class="knobs">
  <label>color <input type="color" value="#faf8f1" data-css="#swatch|color"></label>
  <label>background-color <input type="color" value="#c58940" data-css="#swatch|background-color"></label>
  <label>padding <input type="range" min="0" max="60" value="24" data-css="#swatch|padding|px"><span class="val"></span></label>
</div>
<div class="stage">
  <h2 id="swatch" style="margin:0;border-radius:8px">Hello World</h2>
</div>
<pre class="readout" data-readout="#swatch"></pre>
<p class="note"><b>Named or hex?</b> CSS knows about 140 colour names (<span class="tag">tomato</span> <span class="tag">darkseagreen</span> <span class="tag">rebeccapurple</span>): handy, but limited. A hex code like <span class="tag">#c58940</span> can describe any of 16.7 million colours, which is why palette sites hand them out.</p>`
  },
  {
    title:'Hex is just RGB', height:420,
    note:'Every colour on a screen is a mix of red, green and blue light, each from 0 to 255. A hex code writes those three numbers in base 16, two digits each. The sliders start on the lecture\'s purple: 93 red, 56 green, 145 blue.',
    html:`
<div class="knobs">
  <label>red <input type="range" min="0" max="255" value="93" id="r"><span class="val" id="rv"></span></label>
  <label>green <input type="range" min="0" max="255" value="56" id="g"><span class="val" id="gv"></span></label>
  <label>blue <input type="range" min="0" max="255" value="145" id="b"><span class="val" id="bv"></span></label>
</div>
<div class="stage" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
  <div id="sw" style="width:130px;height:80px;border-radius:8px;border:1px solid #dfe3ee"></div>
  <div id="hex" style="font-family:ui-monospace,Menlo,monospace;font-size:30px;letter-spacing:2px"></div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  function h2(n){ return ('0' + n.toString(16)).slice(-2); }
  function upd(){
    var r = +document.getElementById('r').value, g = +document.getElementById('g').value, b = +document.getElementById('b').value;
    document.getElementById('rv').textContent = r;
    document.getElementById('gv').textContent = g;
    document.getElementById('bv').textContent = b;
    document.getElementById('sw').style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
    document.getElementById('hex').innerHTML = '#<span style="color:#d33">' + h2(r) + '</span><span style="color:#1a9c4a">' + h2(g) +
      '</span><span style="color:#2b6fd6">' + h2(b) + '</span>';
    function line(name, n){ return name + n + '  ->  ' + h2(n) + '   (' + Math.floor(n/16) + ' x 16 + ' + (n % 16) + ')'; }
    document.getElementById('ro').textContent =
      'rgb(' + r + ', ' + g + ', ' + b + ')  is the same colour as  #' + h2(r) + h2(g) + h2(b) + '\\n\\n' +
      line('red   ', r) + '\\n' + line('green ', g) + '\\n' + line('blue  ', b) + '\\n\\n' +
      'hex digits run 0-9 then a-f, so 00 = none of that light and ff = all of it.';
  }
  ['r','g','b'].forEach(function(id){ document.getElementById(id).addEventListener('input', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Which property changes the colour of the <b>words</b> in a heading?', options:['background-color','color','font-color','text-color'], answer:1, why:'color is for text. background-color fills the element\'s box behind the text.' },
    { q:'In <code>#c58940</code>, what do the first two characters <code>c5</code> describe?', options:['The brightness','The amount of red','The amount of blue','The transparency'], answer:1, why:'A hex code is #RRGGBB: two digits each for red, green and blue.' },
    { q:'What happens to <code>color: faf8f1;</code>?', options:['It works the same as with #','The declaration is invalid and the browser ignores it','It is read as a colour name','It turns the text black on purpose'], answer:1, why:'Without the # the value is not a valid colour, so the whole declaration is dropped.' },
    { q:'Which colour is <code>#ffffff</code>?', options:['Black','White','Red','Transparent'], answer:1, why:'ff is the maximum for each channel, and full red, green and blue light together make white. #000000 is black.' },
  ],
  notes:`
    <h3>Ways to write a colour</h3>
    <ul>
      <li><b>Named</b>: <code>color: tomato;</code> — about 140 of them, listed on MDN (search "MDN named color").</li>
      <li><b>Hex</b>: <code>color: #c58940;</code> — red, green and blue in base 16, 00 to ff each.</li>
      <li><b>RGB</b>: <code>color: rgb(197, 137, 64);</code> — the same three numbers in decimal, 0 to 255.</li>
    </ul>
    <h3>Finding colours that go together</h3>
    <p>The lecture uses <b>colorhunt.co</b>, a free gallery of designer-made palettes; <b>coolors.co</b> is another option. Pick a palette, copy the hex codes, and give each one a job: page background, headings, subtitles, accents.</p>`
});


PG.add({
  id:'s06-fonts', index:39, udemyId:37350414, minutes:21, section:'s06', slug:'font-properties', kind:'build',
  title:'Font Properties',
  blurb:'Four properties do most typography work: <code>font-size</code> (px, pt, em, rem), <code>font-weight</code> (normal, bold, 100–900), <code>font-family</code> (a list of fonts with a generic fallback, or a Google Font), and <code>text-align</code>.',
  tasks:[
    'Add your rules below the existing CSS (leave the <code>body</code> rule alone). Make <code>#color</code> the named colour <code>coral</code>.',
    'Make <code>#size</code> twice the root font size: <code>font-size: 2rem</code>.',
    'Make <code>#weight</code> as heavy as it gets: <code>font-weight: 900</code>.',
    'Use the Google Font <b>Caveat</b>: put its <code>&lt;link&gt;</code> tags in the head <b>after</b> the closing <code>&lt;/style&gt;</code> tag, not inside the style element. Then give <code>#family</code> <code>font-family: "Caveat", cursive;</code>. The generic <code>cursive</code> is the backup if the font cannot load.',
    'Push <code>#align</code> to the right with <code>text-align: right</code>.',
    'Last, set the root size: <code>html { font-size: 30px; }</code>. The Font Size line jumps to 60px, because <code>rem</code> always follows the root.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Properties</title>
  <style>
    body {
      background-color: cornflowerblue;
      color: white;
      font-size: 18px;
    }

    /* Don't change the CSS above. Add yours below. */

    /* TODO 1: #color -> the named colour coral */

    /* TODO 2: #size -> twice the size of the root (html) element */

    /* TODO 3: #weight -> font-weight 900 */

    /* TODO 4: #family -> the Google Font Caveat, with cursive as the backup */

    /* TODO 5: #align -> right-aligned */

    /* TODO 6: the root (html) element -> font-size 30px */
  </style>
  <!-- TODO 4: the Google Fonts <link> tags for Caveat go here, outside <style>.
       Copy them from fonts.google.com, or use these three:
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />
  -->
</head>
<body>
  <h1>Important CSS Properties</h1>
  <p id="color">Color</p>
  <p id="size">Font Size</p>
  <p id="weight">Font Weight</p>
  <p id="family">Font Family</p>
  <p id="align">Text Align</p>
</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Properties</title>
  <style>
    body {
      background-color: cornflowerblue;
      color: white;
      font-size: 18px;
    }

    /* Don't change the CSS above. Add yours below. */

    #color {
      color: coral;
    }

    #size {
      font-size: 2rem;
    }

    #weight {
      font-weight: 900;
    }

    #family {
      font-family: "Caveat", cursive;
    }

    #align {
      text-align: right;
    }

    html {
      font-size: 30px;
    }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />
</head>
<body>
  <h1>Important CSS Properties</h1>
  <p id="color">Color</p>
  <p id="size">Font Size</p>
  <p id="weight">Font Weight</p>
  <p id="family">Font Family</p>
  <p id="align">Text Align</p>
</body>
</html>`},
  explore:[
  {
    title:'Font control panel', height:470,
    note:'Every knob is a real CSS property, and the readout builds the rule as you go. Try <code>direction: rtl</code> with <code>start</code> and <code>end</code>: they follow the writing direction, which is what right-to-left scripts such as Arabic need.',
    html:`
<div class="knobs">
  <label>font-size <input type="range" min="12" max="48" value="22" data-css="#t|font-size|px"><span class="val"></span></label>
  <label>font-weight
    <select data-css="#t|font-weight">
      <option>lighter</option><option>100</option><option>300</option><option selected>400</option>
      <option>700</option><option>900</option><option>bolder</option>
    </select>
  </label>
  <label>font-family
    <select data-css="#t|font-family">
      <option value="sans-serif">sans-serif</option>
      <option value="serif">serif</option>
      <option value="monospace">monospace</option>
      <option value="cursive">cursive</option>
      <option value="fantasy">fantasy</option>
      <option value="Helvetica, sans-serif">Helvetica, sans-serif</option>
      <option value='"Times New Roman", serif'>"Times New Roman", serif</option>
    </select>
  </label>
  <label>text-align
    <select data-css="#t|text-align">
      <option>left</option><option>center</option><option>right</option><option>justify</option><option>start</option><option>end</option>
    </select>
  </label>
  <label>direction
    <select data-css="#t|direction"><option>ltr</option><option>rtl</option></select>
  </label>
</div>
<div class="stage">
  <p id="t" style="margin:0">Typography is the craft of making words easy to read. Change the knobs and watch how much the same sentence changes character.</p>
</div>
<pre class="readout" data-readout="#t"></pre>
<p class="note">How many weights you actually see depends on the font: 100 and 900 only look different if the font ships those weights. <code>lighter</code> and <code>bolder</code> are relative to the parent's weight.</p>`
  },
  {
    title:'px, pt, em and rem', height:470,
    note:'Two sliders: the <b>root</b> (the html element) and a <b>footer</b> that is the parent of the last two lines. <code>em</code> follows the parent, <code>rem</code> follows the root, and px and pt ignore both.',
    html:`
<div class="knobs">
  <label>html font-size <input type="range" min="10" max="30" value="16" id="root"><span class="val" id="rootv"></span></label>
  <label>footer font-size <input type="range" min="10" max="40" value="20" id="par"><span class="val" id="parv"></span></label>
</div>
<div class="stage">
  <p id="px" style="font-size:20px;margin:0 0 6px">20px: fixed</p>
  <p id="pt" style="font-size:20pt;margin:0 0 8px">20pt: fixed, a little bigger</p>
  <div id="footer" style="font-size:20px;border:1px dashed #b9c0d4;padding:6px 10px;border-radius:6px">
    <div style="font-size:11px;color:#8b92a8">footer</div>
    <p id="em" style="font-size:1.5em;margin:0">1.5em: follows the footer</p>
    <p id="rem" style="font-size:1.5rem;margin:0">1.5rem: follows the root</p>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var root = document.getElementById('root'), par = document.getElementById('par');
  function px(id){ return parseFloat(getComputedStyle(document.getElementById(id)).fontSize).toFixed(1) + 'px'; }
  function upd(){
    document.documentElement.style.fontSize = root.value + 'px';
    document.getElementById('footer').style.fontSize = par.value + 'px';
    document.getElementById('rootv').textContent = root.value + 'px';
    document.getElementById('parv').textContent = par.value + 'px';
    document.getElementById('ro').textContent =
      'html   { font-size: ' + root.value + 'px }\\nfooter { font-size: ' + par.value + 'px }\\n\\n' +
      '20px    = ' + px('px') + '   (1px is 1/96 of an inch)\\n' +
      '20pt    = ' + px('pt') + '   (1pt is 1/72 of an inch)\\n' +
      '1.5em   = ' + px('em') + '   (1.5 x the footer)\\n' +
      '1.5rem  = ' + px('rem') + '   (1.5 x the root)';
  }
  root.addEventListener('input', upd); par.addEventListener('input', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'A parent is 20px. Its child has <code>font-size: 2em</code>. How big is the child\'s text?', options:['20px','32px','40px','2px'], answer:2, why:'em multiplies the parent\'s font size: 2 × 20px = 40px.' },
    { q:'The html element is 30px and a footer is 80px. A heading inside the footer has <code>font-size: 2rem</code>. How big is it?', options:['60px','160px','32px','110px'], answer:0, why:'rem only looks at the root: 2 × 30px = 60px. The footer makes no difference.' },
    { q:'Why is <code>"Times New Roman"</code> written in quotes in a font-family list?', options:['Quotes make it bold','The name contains spaces','Only serif fonts need quotes','Google Fonts requires them'], answer:1, why:'Multi-word font names must be quoted so the browser reads them as one name.' },
    { q:'Where should the Google Fonts <code>&lt;link&gt;</code> tags go?', options:['Inside the &lt;style&gt; element','In the head, as their own elements outside &lt;style&gt;','At the end of the body','Inside the CSS rule'], answer:1, why:'A link element is HTML, not CSS, so it cannot live inside a style element.' },
    { q:'Which number is the same as <code>font-weight: bold</code>?', options:['100','400','700','900'], answer:2, why:'400 is normal and 700 is bold. The scale runs 100 to 900 in steps of 100.' },
  ],
  notes:`
    <h3>The units</h3>
    <table>
      <tr><th>Unit</th><th>Relative to</th><th>Notes</th></tr>
      <tr><td><code>px</code></td><td>nothing (fixed)</td><td>1/96 of an inch</td></tr>
      <tr><td><code>pt</code></td><td>nothing (fixed)</td><td>1/72 of an inch, the word-processor unit</td></tr>
      <tr><td><code>em</code></td><td>the <b>parent's</b> font size</td><td>Gets confusing when elements are nested</td></tr>
      <tr><td><code>rem</code></td><td>the <b>root</b> (html) font size</td><td>The safe default: one place controls everything</td></tr>
      <tr><td><code>large</code>, <code>x-large</code> …</td><td>browser presets</td><td>Keyword sizes</td></tr>
    </table>
    <h3>A font stack</h3>
    <pre data-lang="css">font-family: "Caveat", cursive;
/*           ^ tried first  ^ generic backup */</pre>
    <p>The browser walks the list left to right and uses the first font it has. Always finish with a generic family (<code>serif</code>, <code>sans-serif</code>, <code>monospace</code>, <code>cursive</code>, <code>fantasy</code>) that matches the style of your first choice.</p>`
});


PG.add({
  id:'l040', index:40, udemyId:37350424, minutes:12, section:'s06', slug:'inspecting-css', kind:'build',
  title:'Inspecting CSS',
  blurb:'Chrome DevTools reads the CSS of any page, this preview included. <b>Elements</b> shows the live HTML; <b>Styles</b> lists every rule that touches the selected element, with overridden declarations struck through; <b>Computed</b> shows the final values. Edits you make there are temporary: they vanish when the page reloads.',
  tasks:[
    'Open DevTools on the preview: right-click the big <b>Inspect Me</b> heading and choose <b>Inspect</b>. Shortcuts: <code>Cmd+Option+I</code> on a Mac, <code>Ctrl+Shift+I</code> or <code>F12</code> on Windows, then the arrow icon at the top-left of DevTools to pick an element. <b>↗ open</b> puts the preview in its own tab if you want more room.',
    'With the <code>h1</code> selected, find its <code>font-size</code> in the <b>Styles</b> pane. Select the <code>&lt;body&gt;</code> and the <code>h2</code> the same way for questions 1 and 3. The page\'s stylesheet is scrambled in index.html on purpose: DevTools is how you read it, just as on any real website.',
    'Select the first paragraph. It has no <code>font-family</code> rule of its own, so scroll the Styles pane down to <b>Inherited from body</b>, or open the <b>Computed</b> tab, to find the font it really uses (question 4).',
    'Select the link. The page\'s <code>color</code> wins, and the browser default in the <i>user agent stylesheet</i> is struck through. Untick the page\'s declaration to bring the default back, tick it again, answer question 5 and press <b>Check my answers</b>.',
    'Select the <code>h1</code>, click inside <code>element.style</code> and add <code>color: crimson</code>. Then type a space in the editor: the preview reloads and your change is gone. DevTools only edits the copy in your browser.',
    'Keep the colour for real: write the <code>h1</code> colour rule in <b>style.css</b>.',
    'Bonus: open the three-dot menu <b>inside</b> DevTools (not Chrome\'s own), then <b>More tools</b> → <b>CSS overview</b> → <b>Capture overview</b>. It lists every colour and font a page uses, which is handy for studying sites you like. The Explore tab has a miniature version.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inspect Me</title>
  <!-- The practice site's own stylesheet, scrambled on purpose so you can't
       just read it here. Read it the way you'd read any website's CSS:
       with DevTools. -->
  <link rel="stylesheet" href="data:text/css;base64,Ym9keXtiYWNrZ3JvdW5kLWNvbG9yOmhvbmV5ZGV3O2ZvbnQtZmFtaWx5OlZlcmRhbmEsc2Fucy1zZXJpZjtjb2xvcjojMWYzYjJkO21hcmdpbjozMnB4fWgxe2ZvbnQtc2l6ZTozLjVyZW07bWFyZ2luOjAgMCA4cHh9aDJ7Zm9udC13ZWlnaHQ6MzAwO2NvbG9yOnNlYWdyZWVuO21hcmdpbjowIDAgMTZweH1he2NvbG9yOmRhcmtvcmFuZ2V9" />
  <!-- Your own stylesheet: the style.css pane -->
  <link rel="stylesheet" href="./style.css" />
  <style>
    /* Styles for the quiz box. None of the answers are in here. */
    .quiz { background-color: white; border: 2px solid seagreen; border-radius: 10px; padding: 12px 18px; max-width: 480px; }
    .quiz label { display: block; margin: 10px 0; font-size: 14px; }
    .quiz input { display: block; margin-top: 4px; padding: 4px 6px; font: inherit; }
    .quiz button { padding: 6px 14px; background-color: seagreen; color: white; border: 0; border-radius: 6px; font: inherit; cursor: pointer; }
    #result { white-space: pre-line; font-family: monospace; }
  </style>
</head>
<body>
  <h1>Inspect Me</h1>
  <h2>Every answer on this page is hiding in DevTools</h2>
  <p>
    Right-click anything here and choose <strong>Inspect</strong>. You can't
    break this page: whatever you change in DevTools disappears as soon as
    the preview reloads. <a href="#quiz">Jump to the quiz</a>
  </p>

  <form class="quiz" id="quiz">
    <label>1. The page's background colour (a named colour)
      <input name="background" autocomplete="off" />
    </label>
    <label>2. The h1's font-size
      <input name="h1size" autocomplete="off" />
    </label>
    <label>3. The h2's font-weight
      <input name="h2weight" autocomplete="off" />
    </label>
    <label>4. The first paragraph's font (the first name in its font-family)
      <input name="pfont" autocomplete="off" />
    </label>
    <label>5. The link colour (a named colour)
      <input name="link" autocomplete="off" />
    </label>
    <button type="submit">Check my answers</button>
    <p id="result"></p>
  </form>
</body>
</html>`,
'style.css':`/* Your stylesheet. DevTools edits are temporary; this file is not.

   TODO 6: once you have tried a colour for the h1 in DevTools,
   write the rule here so it survives a reload. */
`,
'script.js':`// The "Check my answers" button.
// You don't need to read this yet: JavaScript starts in section 14.
// The answers are not stored here. Each check compares what you typed with
// the value the browser computed for the element, which is exactly what
// the Computed tab in DevTools shows.

const form = document.querySelector("#quiz");
const result = document.querySelector("#result");

function sameColour(typed, real) {
  const probe = document.createElement("span");
  probe.style.color = typed;
  if (!typed || !probe.style.color) return false;
  document.body.appendChild(probe);
  const same = getComputedStyle(probe).color === real;
  probe.remove();
  return same;
}

function sameSize(typed, real) {
  const probe = document.createElement("span");
  probe.style.fontSize = typed !== "" && !isNaN(typed) ? typed + "px" : typed;
  if (!typed || !probe.style.fontSize) return false;
  document.documentElement.appendChild(probe);
  const same = Math.abs(parseFloat(getComputedStyle(probe).fontSize) - parseFloat(real)) < 0.5;
  probe.remove();
  return same;
}

function firstFont(list) {
  return list.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = (name) => form.elements[name].value.trim();
  const css = (selector) => getComputedStyle(document.querySelector(selector));

  const checks = [
    ["1. background colour", sameColour(answer("background"), css("body").backgroundColor)],
    ["2. h1 font-size", sameSize(answer("h1size"), css("h1").fontSize)],
    ["3. h2 font-weight", answer("h2weight") === css("h2").fontWeight],
    ["4. paragraph font", answer("pfont") !== "" && firstFont(answer("pfont")) === firstFont(css("p").fontFamily)],
    ["5. link colour", sameColour(answer("link"), css("a").color)],
  ];
  const right = checks.filter((check) => check[1]).length;
  result.textContent =
    checks.map((check) => (check[1] ? "✓ " : "✗ ") + check[0]).join("\\n") +
    "\\n\\n" + right + " of 5 correct" + (right === 5 ? ". Nicely inspected!" : "");
});
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inspect Me</title>
  <!-- The practice site's own stylesheet, scrambled on purpose so you can't
       just read it here. Read it the way you'd read any website's CSS:
       with DevTools. -->
  <link rel="stylesheet" href="data:text/css;base64,Ym9keXtiYWNrZ3JvdW5kLWNvbG9yOmhvbmV5ZGV3O2ZvbnQtZmFtaWx5OlZlcmRhbmEsc2Fucy1zZXJpZjtjb2xvcjojMWYzYjJkO21hcmdpbjozMnB4fWgxe2ZvbnQtc2l6ZTozLjVyZW07bWFyZ2luOjAgMCA4cHh9aDJ7Zm9udC13ZWlnaHQ6MzAwO2NvbG9yOnNlYWdyZWVuO21hcmdpbjowIDAgMTZweH1he2NvbG9yOmRhcmtvcmFuZ2V9" />
  <!-- Your own stylesheet: the style.css pane -->
  <link rel="stylesheet" href="./style.css" />
  <style>
    /* Styles for the quiz box. None of the answers are in here. */
    .quiz { background-color: white; border: 2px solid seagreen; border-radius: 10px; padding: 12px 18px; max-width: 480px; }
    .quiz label { display: block; margin: 10px 0; font-size: 14px; }
    .quiz input { display: block; margin-top: 4px; padding: 4px 6px; font: inherit; }
    .quiz button { padding: 6px 14px; background-color: seagreen; color: white; border: 0; border-radius: 6px; font: inherit; cursor: pointer; }
    #result { white-space: pre-line; font-family: monospace; }
  </style>
</head>
<body>
  <h1>Inspect Me</h1>
  <h2>Every answer on this page is hiding in DevTools</h2>
  <p>
    Right-click anything here and choose <strong>Inspect</strong>. You can't
    break this page: whatever you change in DevTools disappears as soon as
    the preview reloads. <a href="#quiz">Jump to the quiz</a>
  </p>

  <!-- The answers, filled in. Press "Check my answers" to confirm them. -->
  <form class="quiz" id="quiz">
    <label>1. The page's background colour (a named colour)
      <input name="background" autocomplete="off" value="honeydew" />
    </label>
    <label>2. The h1's font-size
      <input name="h1size" autocomplete="off" value="3.5rem" />
    </label>
    <label>3. The h2's font-weight
      <input name="h2weight" autocomplete="off" value="300" />
    </label>
    <label>4. The first paragraph's font (the first name in its font-family)
      <input name="pfont" autocomplete="off" value="Verdana" />
    </label>
    <label>5. The link colour (a named colour)
      <input name="link" autocomplete="off" value="darkorange" />
    </label>
    <button type="submit">Check my answers</button>
    <p id="result"></p>
  </form>
</body>
</html>`,
'style.css':`/* Your stylesheet. DevTools edits are temporary; this file is not. */

h1 {
  color: crimson;
}
`},
  explore:[
  {
    title:'A pretend Styles pane', height:640,
    note:'A miniature of DevTools for the paragraph on the left. Untick declarations and watch three things: what is struck through, what the paragraph looks like, and where each <b>Computed</b> value comes from. The computed values are read from the real element, so they are what the browser actually decided.',
    html:`
<div class="stage" style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;padding:12px">
  <div style="flex:1 1 190px">
    <h4>the page</h4>
    <div id="sb" style="border:1px dashed #b9c0d4;border-radius:8px;padding:12px">
      <div class="card"><p class="intro" id="tip">Inspect this paragraph</p></div>
    </div>
  </div>
  <div style="flex:1.5 1 290px">
    <h4>Styles</h4>
    <div id="styles" class="dt"></div>
  </div>
</div>
<h4>Computed (for the paragraph)</h4>
<div id="computed" class="dt"></div>
<style id="applied"></style>
<style>
  .dt{background:#fff;border:1px solid #dfe3ee;border-radius:8px;font-family:ui-monospace,Menlo,monospace;font-size:12px;padding:8px 10px;line-height:1.75}
  .dt .grp{margin-bottom:6px}
  .dt .sel{color:#a1307a;font-weight:600}
  .dt .src{float:right;color:#5b6382;text-decoration:underline;font-size:11px}
  .dt .inh{background:#eef1f9;color:#3c435c;padding:2px 8px;margin:6px -10px 4px;font-family:-apple-system,sans-serif;font-size:11.5px}
  .dt label{display:block;padding-left:14px;cursor:pointer}
  .dt label.ua{cursor:default;padding-left:32px}
  .dt .p{color:#c80000}
  .dt .v{color:#1a1aa6}
  .dt .over .p,.dt .over .v,.dt .off .p,.dt .off .v{text-decoration:line-through}
  .dt .over,.dt .off{opacity:.55}
  .dt .dim{opacity:.4}
  .dt em{font-family:-apple-system,sans-serif;font-size:11px;color:#5b6382}
  .dt .row{display:flex;gap:10px;border-bottom:1px solid #eef1f9;padding:1px 0}
  .dt .row b{min-width:130px;color:#c80000;font-weight:500}
  .dt .row i{margin-left:auto;color:#5b6382;font-style:normal;font-family:-apple-system,sans-serif;font-size:11.5px}
</style>
<script>
  var INH = { 'color':1, 'font-family':1, 'font-size':1, 'font-weight':1 };
  var groups = [
    { sel:'element.style', src:'', inline:true, decls:[ {p:'font-weight', v:'700', on:false} ] },
    { sel:'#tip', src:'style.css:14', css:'#sb #tip', decls:[ {p:'color', v:'crimson', on:true} ] },
    { sel:'.intro', src:'style.css:9', css:'#sb .intro', decls:[ {p:'color', v:'steelblue', on:true}, {p:'font-size', v:'20px', on:true} ] },
    { sel:'p', src:'style.css:5', css:'#sb p', decls:[ {p:'color', v:'dimgray', on:true}, {p:'margin', v:'0', on:true} ] },
    { sel:'p', ua:true, decls:[ {p:'display', v:'block'}, {p:'margin-block-start', key:'margin', v:'1em'}, {p:'margin-block-end', key:'margin', v:'1em'} ] },
    { sel:'.card', src:'style.css:18', css:'#sb .card', from:'div.card', decls:[ {p:'font-family', v:'Georgia, serif', on:true}, {p:'background-color', v:'ivory', on:true}, {p:'padding', v:'10px', on:true} ] },
    { sel:'body', src:'style.css:1', css:'#sb', from:'body', decls:[ {p:'font-family', v:'Verdana, sans-serif', on:true}, {p:'font-size', v:'15px', on:true}, {p:'color', v:'#333', on:true} ] }
  ];
  function key(d){ return d.key || d.p; }
  function ownWinner(k){
    for (var i = 0; i < groups.length; i++){
      var g = groups[i]; if (g.from) continue;
      for (var j = 0; j < g.decls.length; j++){ var d = g.decls[j]; if (key(d) === k && (g.ua || d.on)) return { g:g, d:d }; }
    }
    return null;
  }
  function inhWinner(k){
    if (!INH[k]) return null;
    for (var i = 0; i < groups.length; i++){
      var g = groups[i]; if (!g.from) continue;
      for (var j = 0; j < g.decls.length; j++){ var d = g.decls[j]; if (key(d) === k && d.on) return { g:g, d:d }; }
    }
    return null;
  }
  function status(g, d){
    var k = key(d), w;
    if (g.from){
      if (!INH[k]) return 'dim';
      if (!d.on) return 'off';
      if (ownWinner(k)) return 'over';
      w = inhWinner(k); return w && w.d === d ? 'win' : 'over';
    }
    if (!g.ua && !d.on) return 'off';
    w = ownWinner(k); return w && w.d === d ? 'win' : 'over';
  }
  function render(){
    var out = '';
    groups.forEach(function(g, gi){
      if (g.from) out += '<div class="inh">Inherited from ' + g.from + '</div>';
      out += '<div class="grp"><span class="src">' + (g.ua ? 'user agent stylesheet' : g.src) + '</span><span class="sel">' + g.sel + '</span> {';
      g.decls.forEach(function(d, di){
        var st = status(g, d);
        var box = g.ua ? '' : '<input type="checkbox" data-g="' + gi + '" data-d="' + di + '"' + (d.on ? ' checked' : '') + '> ';
        out += '<label class="' + st + (g.ua ? ' ua' : '') + '">' + box + '<span class="p">' + d.p + '</span>: <span class="v">' + d.v + '</span>;' +
               (st === 'dim' ? ' <em>not inherited</em>' : '') + '</label>';
      });
      out += '}</div>';
    });
    document.getElementById('styles').innerHTML = out;
  }
  function apply(){
    var css = '#sb { font-family: serif; font-size: 16px; color: black; font-weight: 400; }\\n';
    groups.slice().reverse().forEach(function(g){
      if (g.ua || g.inline) return;
      var on = g.decls.filter(function(d){ return d.on; });
      if (on.length) css += g.css + ' { ' + on.map(function(d){ return d.p + ': ' + d.v; }).join('; ') + '; }\\n';
    });
    document.getElementById('applied').textContent = css;
    var inl = groups[0].decls[0];
    document.getElementById('tip').style.fontWeight = inl.on ? inl.v : '';
  }
  function computed(){
    var cs = getComputedStyle(document.getElementById('tip'));
    var props = ['color', 'font-size', 'font-family', 'font-weight', 'margin-top', 'background-color'];
    document.getElementById('computed').innerHTML = props.map(function(pr){
      var k = pr === 'margin-top' ? 'margin' : pr, w = ownWinner(k), src;
      if (w) src = w.g.ua ? 'from the user agent stylesheet' : 'from ' + w.g.sel;
      else { var h = inhWinner(k); src = h ? 'inherited from ' + h.g.from : (INH[k] ? 'browser default' : 'initial value: not inherited'); }
      return '<div class="row"><b>' + pr + '</b><span>' + cs.getPropertyValue(pr) + '</span><i>' + src + '</i></div>';
    }).join('');
  }
  function update(){ apply(); render(); computed(); }
  document.getElementById('styles').addEventListener('change', function(e){
    var t = e.target;
    if (t.dataset && t.dataset.g != null){ groups[+t.dataset.g].decls[+t.dataset.d].on = t.checked; update(); }
  });
  update();
<\/script>`
  },
  {
    title:'CSS overview in miniature', height:540,
    note:'DevTools\' CSS overview scans a whole page and lists the colours and fonts it uses. This button does the same for the little site below, reading the computed style of every element.',
    html:`
<div class="knobs"><button id="cap">Capture overview</button><span class="tag">scans every element of the mini site</span></div>
<div class="stage" id="site">
  <header><h1>Hilltop Bakery</h1><span class="pill">open daily</span></header>
  <p>Sourdough, cinnamon buns and very strong coffee since 2009.</p>
  <span class="btn">Order online</span> <span class="price">from £2.50</span>
</div>
<div id="out"></div>
<style>
  #site { background: #fdf6ec; font-family: Georgia, serif; color: #3d2b1f; }
  #site header { background: #2f4858; color: #fdf6ec; padding: 10px 14px; border-radius: 6px; display: flex; align-items: center; gap: 10px; }
  #site h1 { font-family: "Trebuchet MS", sans-serif; margin: 0; font-size: 20px; }
  #site .pill { background: #86bbd8; color: #2f4858; font-family: ui-monospace, Menlo, monospace; font-size: 11px; padding: 2px 8px; border-radius: 10px; }
  #site p { color: #5c4a3d; }
  #site .btn { background: #f26419; color: #fff; padding: 5px 12px; border-radius: 5px; font-family: "Trebuchet MS", sans-serif; display: inline-block; }
  #site .price { color: #f26419; font-weight: 700; }
  .ov { background:#fff; border:1px solid #dfe3ee; border-radius:10px; padding:10px 14px; margin-bottom:10px; }
  .ov h4 { margin-bottom:6px; }
  .sw { display:inline-flex; align-items:center; gap:6px; margin:0 12px 6px 0; font-family:ui-monospace,Menlo,monospace; font-size:12px; }
  .sw i { width:22px; height:22px; border-radius:5px; border:1px solid #dfe3ee; display:inline-block; }
</style>
<script>
  function hex(rgb){
    var m = rgb.match(/[0-9.]+/g); if (!m) return rgb;
    return '#' + m.slice(0, 3).map(function(n){ return ('0' + (+n).toString(16)).slice(-2); }).join('');
  }
  function count(map, k){ map[k] = (map[k] || 0) + 1; }
  document.getElementById('cap').addEventListener('click', function(){
    var text = {}, bg = {}, fonts = {};
    var els = [document.getElementById('site')].concat([].slice.call(document.querySelectorAll('#site *')));
    els.forEach(function(el){
      var cs = getComputedStyle(el);
      count(text, hex(cs.color));
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') count(bg, hex(cs.backgroundColor));
      count(fonts, cs.fontFamily.split(',')[0].replace(/["']/g, ''));
    });
    function swatches(map){
      return Object.keys(map).map(function(c){ return '<span class="sw"><i style="background:' + c + '"></i>' + c + ' <span style="color:#8b92a8">x' + map[c] + '</span></span>'; }).join('');
    }
    document.getElementById('out').innerHTML =
      '<div class="ov"><h4>Background colours</h4>' + swatches(bg) + '</div>' +
      '<div class="ov"><h4>Text colours</h4>' + swatches(text) + '</div>' +
      '<div class="ov"><h4>Fonts</h4>' + Object.keys(fonts).map(function(f){ return '<div class="sw" style="font-family:' + f + '">' + f + ' <span style="color:#8b92a8">x' + fonts[f] + '</span></div>'; }).join('') + '</div>';
  });
<\/script>`
  }],
  quiz:[
    { q:'You change a heading\'s colour in the Styles pane, then reload the page. What do you see?', options:['The new colour, saved to the website','The original colour: DevTools edits live only in your browser until the page reloads','A warning that the file has changed','The new colour, but only for you'], answer:1, why:'DevTools edits the copy of the page loaded in your browser. To keep a change, copy it into your own stylesheet.' },
    { q:'A declaration appears struck through in the Styles pane. What does that mean?', options:['It contains a typo','Another rule overrode it, so it has no effect on this element','It will apply after a reload','It is a deprecated property'], answer:1, why:'When two rules set the same property, the losing declaration is crossed out so you can see what beat it.' },
    { q:'A paragraph has no font-family rule of its own, yet it uses Verdana. Where does DevTools show why?', options:['In the Console','Under "Inherited from body" in Styles, or in the Computed tab','In the Network tab','Nowhere, inherited values are hidden'], answer:1, why:'Properties such as font-family and color pass down from ancestors. Computed shows the final value wherever it came from.' },
    { q:'What is the <i>user agent stylesheet</i>?', options:['Your own style.css','The browser\'s built-in default styles','The stylesheet Google Fonts adds','A browser extension\'s CSS'], answer:1, why:'Browsers give every element default styles (blue links, bold headings, paragraph margins). Your rules are listed above them and win.' },
  ],
  notes:`
    <h3>Opening DevTools</h3>
    <table>
      <tr><th>How</th><th>Mac</th><th>Windows / Linux</th></tr>
      <tr><td>Shortcut</td><td><code>Cmd+Option+I</code></td><td><code>Ctrl+Shift+I</code> or <code>F12</code></td></tr>
      <tr><td>Straight to one element</td><td colspan="2">Right-click it, then Inspect</td></tr>
      <tr><td>Pick by clicking</td><td colspan="2">The arrow icon at the top-left of DevTools</td></tr>
    </table>
    <h3>Styles vs Computed</h3>
    <ul>
      <li><b>Styles</b>: every matching rule, strongest first, with overridden declarations struck through; then the browser's defaults; then rules inherited from ancestors. Each rule names the file and line it came from.</li>
      <li><b>Computed</b>: one flat list of final values. Use it to answer "what is this element actually using?"</li>
    </ul>
    <h3>In this playground</h3>
    <p>The preview is a frame inside this page, and DevTools inspects it like any page. Each keystroke in the editor reloads the frame, which also wipes your DevTools edits: proof that they were never saved anywhere.</p>`
});


PG.add({
  id:'s06-box-model', index:41, udemyId:37350454, minutes:21, section:'s06', slug:'box-model', kind:'build',
  title:'The CSS Box Model - Margin, Padding and Border',
  blurb:'Every element is a rectangle with four layers. From the inside out: the <b>content</b> (sized by <code>width</code> and <code>height</code>), <b>padding</b> inside the border, the <b>border</b> itself, and <b>margin</b> outside it, pushing neighbours away. A <code>&lt;div&gt;</code> is an invisible box for grouping other elements.',
  tasks:[
    'In the body, add three <code>div</code>s with the ids <code>first</code>, <code>second</code> and <code>third</code>. Put a paragraph of placeholder text in the first.',
    'In the <code>&lt;style&gt;</code> element, give every <code>div</code> a <code>height</code> and <code>width</code> of <code>200px</code>.',
    'Style <code>#first</code>: <code>cadetblue</code> background, <code>padding: 20px</code>, <code>border: 10px solid black</code>. The text does not start at the padding edge, because paragraphs come with a default margin. Remove it with <code>p { margin: 0; }</code>.',
    'Style <code>#second</code>: <code>gold</code> background, <code>border: solid black</code>, then <code>border-width: 20px 10px</code> (two values: top and bottom, then left and right). The width line has to come <b>after</b> the shorthand, or the shorthand resets it.',
    'Slide <code>#second</code> right until its top-left corner touches the bottom-right corner of <code>#first</code>. Work out the width of #first: 200 content + 2 × 20 padding + 2 × 10 border = 260, so <code>margin-left: 260px</code>.',
    'Style <code>#third</code>: <code>indianred</code>, <code>border: 10px solid black</code>, and a <code>margin-left</code> that puts its top-right corner on #second\'s bottom-left corner. #second starts at 260px and #third is 220px wide in total, so the answer is 40px.',
    'Check the numbers in DevTools: inspect a box and read the coloured box-model diagram in the Styles pane.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Box Model</title>
  <style>
    /* Write your CSS here */

  </style>
</head>
<body>
  <!-- The client's brief:
       1. Three boxes: divs with the ids first, second and third.
          The first holds a paragraph of text.
       2. Every box is 200px wide and 200px high.
       3. #first: cadetblue, 20px padding, a 10px solid black border.
          Its text starts right at the padding edge (no extra margin).
       4. #second: gold, a solid black border that is 20px top and bottom
          and 10px left and right. Its top-left corner touches the
          bottom-right corner of #first.
       5. #third: indianred, a 10px solid black border. Its top-right
          corner touches the bottom-left corner of #second.
  -->

</body>
</html>`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Box Model</title>
  <style>
    div {
      height: 200px;
      width: 200px;
    }

    p {
      margin: 0;
    }

    #first {
      background-color: cadetblue;
      padding: 20px;
      border: 10px solid black;
    }

    #second {
      background-color: gold;
      border: solid black;
      border-width: 20px 10px;
      margin-left: 260px;
    }

    #third {
      background-color: indianred;
      border: 10px solid black;
      margin-left: 40px;
    }
  </style>
</head>
<body>
  <div id="first">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      sapien porttitor urna elementum lacinia. In id magna pulvinar,
      ultricies lorem id, vehicula elit. Aliquam eu luctus nisl, vitae
      pellentesque magna.
    </p>
  </div>
  <div id="second"></div>
  <div id="third"></div>
</body>
</html>`},
  explore:[
  {
    title:'Box model dissector', height:560,
    note:'Drag the sliders and watch where each layer adds space: padding grows the box <b>inwards from the border</b> and takes the background colour; margin pushes <b>everything else away</b> and stays transparent.',
    html:`
<div class="knobs">
  <label>padding <input type="range" min="0" max="60" value="20" data-css="#b|padding|px"><span class="val"></span></label>
  <label>border <input type="range" min="0" max="30" value="10" data-css="#b|border-width|px"><span class="val"></span></label>
  <label>margin <input type="range" min="0" max="60" value="20" data-css="#b|margin|px"><span class="val"></span></label>
  <label>width <input type="range" min="100" max="380" value="220" data-css="#b|width|px"><span class="val"></span></label>
  <label><input type="checkbox" data-css="#b|box-sizing" value="border-box" data-off="content-box"> box-sizing: border-box (extra, not in the lecture)</label>
</div>
<div class="stage" style="background:#ffeaa7">
  <div style="font-size:11px;color:#8a7333;margin-bottom:4px">yellow = the space the margin creates</div>
  <div id="b" style="background:#a7d8de;border:10px solid #2d3436;padding:20px;margin:20px;width:220px">
    <div style="background:#ffffff;padding:6px;font-size:12.5px">content box</div>
  </div>
</div>
<pre class="readout" data-readout="#b"></pre>
<pre class="readout" id="total"></pre>
<p class="note">By default <code>width</code> sizes the <em>content only</em>, so padding and border make the element bigger than the number you wrote. That is why the lecture's maths is 200 + 40 + 20 = 260. Ticking <code>box-sizing: border-box</code> makes <code>width</code> mean the whole box instead; you will meet it in real projects.</p>
<script>
  function upd(){
    var el = document.getElementById('b');
    var r = el.getBoundingClientRect();
    document.getElementById('total').textContent =
      'declared width  : ' + el.style.width + '\\n' +
      'actual on screen: ' + Math.round(r.width) + 'px  (content + padding + border)';
  }
  document.addEventListener('input', function(){ setTimeout(upd, 10); });
  document.addEventListener('change', function(){ setTimeout(upd, 10); });
  setTimeout(upd, 60);
<\/script>`
  },
  {
    title:'One to four values', height:400,
    note:'One property, four meanings, depending on how many values you give it. The same rules apply to <code>margin</code> and <code>border-width</code>.',
    html:`
<div class="knobs">
  <label>padding:
    <select id="mode">
      <option value="20px">20px  (all four sides)</option>
      <option value="10px 40px">10px 40px  (top and bottom, left and right)</option>
      <option value="5px 20px 40px">5px 20px 40px  (top, left and right, bottom)</option>
      <option value="5px 10px 20px 40px">5px 10px 20px 40px  (top, right, bottom, left)</option>
    </select>
  </label>
</div>
<div class="stage">
  <div id="p" style="background:#a7d8de;padding:20px;display:inline-block">
    <div style="background:#fff;padding:8px">content</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<p class="note">With four values, go clockwise from the top: <b>top, right, bottom, left</b>.</p>
<script>
  var m = document.getElementById('mode');
  function upd(){
    document.getElementById('p').style.padding = m.value;
    var n = m.value.split(' ').length;
    var expl = {1:'all four sides', 2:'top and bottom | left and right', 3:'top | left and right | bottom', 4:'top | right | bottom | left'}[n];
    document.getElementById('ro').textContent = '#p {\\n  padding: ' + m.value + ';   /* ' + expl + ' */\\n}';
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'See the invisible boxes', height:430,
    note:'A <code>&lt;div&gt;</code> has no look of its own, so you cannot see where it starts and ends. The Pesticide browser extension outlines every element; this toggle does the same. Hover an element to see its tag, class and size.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="pest" checked> outline every element</label>
  <span class="tag" id="info">hover over the page below</span>
</div>
<div class="stage" id="stage">
  <div class="photo-card">
    <div class="pic">picture</div>
    <p>Morning view</p>
  </div>
  <div class="photo-card">
    <div class="pic">picture</div>
    <p>Evening view</p>
  </div>
  <p>Two divs, each grouping a picture with its caption so they can be styled and moved as one.</p>
</div>
<style>
  #stage .photo-card { display: inline-block; width: 150px; margin: 0 12px 12px 0; vertical-align: top; }
  #stage .pic { height: 80px; background: #a7d8de; color: #2d6b74; font-size: 12px; border-radius: 4px;
                display: flex; align-items: center; justify-content: center; }
  #stage p { margin: 6px 0 0; }
</style>
<style id="pst"></style>
<script>
  var pest = document.getElementById('pest'), info = document.getElementById('info');
  function upd(){
    document.getElementById('pst').textContent = pest.checked
      ? '#stage div { outline: 1px solid #ff5c8a; } #stage p { outline: 1px solid #5b9cff; }' : '';
  }
  document.getElementById('stage').addEventListener('mouseover', function(e){
    var el = e.target;
    if (el.id === 'stage') { info.textContent = 'the stage itself'; return; }
    info.textContent = '<' + el.tagName.toLowerCase() + (el.className ? ' class="' + el.className + '"' : '') + '>  ' +
                       el.offsetWidth + ' x ' + el.offsetHeight + 'px';
  });
  pest.addEventListener('change', upd); upd();
<\/script>`
  }],
  quiz:[
    { q:'From the content outwards, what order are the layers in?', options:['margin, border, padding, content','content, padding, border, margin','content, border, padding, margin','padding, content, border, margin'], answer:1, why:'Padding sits inside the border, margin outside it.' },
    { q:'What does <code>padding: 0 20px</code> do?', options:['0 on the left, 20px on the right','0 top and bottom, 20px left and right','20px on every side','0 on top, 20px on the other three sides'], answer:1, why:'With two values, the first is top and bottom and the second is left and right.' },
    { q:'A box has <code>width: 200px</code>, <code>padding: 20px</code> and a <code>10px</code> border. How wide is it on screen?', options:['200px','230px','260px','220px'], answer:2, why:'200 + 2 × 20 + 2 × 10 = 260px. Padding and border are added outside the content width.' },
    { q:'Which layer does an element\'s background colour fill?', options:['Content only','Content and padding','Content, padding and margin','Margin only'], answer:1, why:'The background reaches the outer edge of the padding. Margin is always transparent.' },
    { q:'What is a <code>&lt;div&gt;</code> for?', options:['Making text bold','A generic container that groups elements so they can be styled or positioned together','Adding a line break','Linking stylesheets'], answer:1, why:'A div has no appearance of its own; it exists to group and structure content.' },
  ],
  notes:`
    <h3>Order matters with shorthands</h3>
    <pre data-lang="css">p {
  border: 30px solid black;  /* sets all four sides */
  border-top-width: 0;       /* then removes just the top */
}
/* swap the two lines and the shorthand resets the top back to 30px */</pre>
    <h3>Margins between stacked blocks</h3>
    <p>Side by side, two 10px margins make a 20px gap. Stacked vertically, they can <b>collapse</b> into one 10px gap: only the larger of the two counts.</p>
    <h3>Handy tools</h3>
    <ul>
      <li>DevTools draws the box model for the selected element at the bottom of the Styles pane, and you can edit the numbers right there.</li>
      <li>The <b>Pesticide</b> Chrome extension outlines every element on a page, which makes stray margins easy to spot.</li>
    </ul>`
});


PG.add({
  id:'s06-meme', index:42, udemyId:37350494, minutes:8, section:'s06', slug:'motivation-meme', kind:'build', project:true,
  title:'Motivational Poster Website',
  blurb:'Recreate a classic 1990s motivational poster: a black page, a big white-bordered photo, a capitalised title in a serif Google Font and a short caption, all centred in one <code>div</code>. It uses everything from this section: colours, fonts, borders, margins and the box model.',
  tasks:[
    'Link the Google Font <b>Libre Baskerville</b> in the head: <code>&lt;link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&amp;display=swap" rel="stylesheet" /&gt;</code> (or copy it from fonts.google.com).',
    'Wrap the image, the <code>h1</code> and the <code>p</code> in one <code>div</code> with the class <code>poster</code>, so a single box can be sized and centred. A class rather than an id means the style could be reused if the site grows.',
    'In style.css, make the page background black.',
    'Style <code>.poster</code>: white text, centred text, <code>width: 50%</code>, <code>margin-left: 25%</code> (half the leftover space, so it sits in the middle), <code>margin-top: 100px</code>, and <code>font-family: "Libre Baskerville", serif</code>.',
    'Style <code>.motivation-img</code>: <code>border: 5px solid white</code> and <code>width: 100%</code>, so the photo fills the poster.',
    'Make the <code>h1</code> <code>3rem</code> and show it in capitals with <code>text-transform: uppercase</code>, without retyping the text.',
    'Make it yours: change the picture (any <code>picsum.photos</code> link or image URL) and write your own title and caption.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Motivation Meme</title>
  <link rel="stylesheet" href="./style.css" />
  <!-- TODO 1: link the Google Font "Libre Baskerville" here -->

</head>
<body>
  <!-- TODO 2: wrap these three elements in one div with the class "poster" -->
  <img class="motivation-img" src="https://picsum.photos/id/1016/800/500" alt="a red rock canyon at sunset" />
  <h1>Persistence</h1>
  <p>A river cuts through rock not by force, but by refusing to stop.</p>
</body>
</html>`,
'style.css':`/* TODO 3: a black page */

/* TODO 4: .poster - white, centred text, 50% wide, pushed 25% from the left,
   100px down from the top, in Libre Baskerville with a serif backup */

/* TODO 5: .motivation-img - a 5px solid white border, as wide as the poster */

/* TODO 6: h1 - 3rem, in capitals without retyping it */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Motivation Meme</title>
  <link rel="stylesheet" href="./style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="poster">
    <img class="motivation-img" src="https://picsum.photos/id/1016/800/500" alt="a red rock canyon at sunset" />
    <h1>Persistence</h1>
    <p>A river cuts through rock not by force, but by refusing to stop.</p>
  </div>
</body>
</html>`,
'style.css':`body {
  background-color: black;
}

.poster {
  color: white;
  text-align: center;
  width: 50%;
  margin-left: 25%;
  margin-top: 100px;
  font-family: "Libre Baskerville", serif;
}

.motivation-img {
  border: 5px solid white;
  width: 100%;
}

h1 {
  text-transform: uppercase;
  font-size: 3rem;
}
`},
  explore:[{
    title:'Centring with percentages', height:430,
    note:'The poster is a percentage of the page wide, and <code>margin-left</code> pushes it right. It is centred when the gaps on both sides match, which happens when <code>margin-left = (100% − width) ÷ 2</code>.',
    html:`
<div class="knobs">
  <label>width <input type="range" min="20" max="100" value="50" id="w"><span class="val" id="wv"></span></label>
  <label>margin-left <input type="range" min="0" max="60" value="20" id="m"><span class="val" id="mv"></span></label>
  <label><input type="checkbox" id="auto"> use margin: 0 auto (extra)</label>
</div>
<div class="stage" style="background:#111;padding:14px 0">
  <div id="centre" style="position:absolute;top:0;bottom:0;left:50%;border-left:1px dashed #ff5c8a"></div>
  <div id="poster" style="background:#000;color:#fff;text-align:center;border:1px dashed #555;font-family:Georgia,serif;padding-bottom:8px">
    <div style="height:70px;border:3px solid #fff;background:linear-gradient(135deg,#9c3d1c,#e8a04f)"></div>
    <div style="font-size:18px;letter-spacing:2px;margin:8px 0 2px">PERSISTENCE</div>
    <div style="font-size:11px">refusing to stop</div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var w = document.getElementById('w'), m = document.getElementById('m'), auto = document.getElementById('auto');
  function upd(){
    var p = document.getElementById('poster');
    p.style.width = w.value + '%';
    p.style.marginLeft = auto.checked ? 'auto' : m.value + '%';
    p.style.marginRight = auto.checked ? 'auto' : '0';
    m.disabled = auto.checked;
    document.getElementById('wv').textContent = w.value + '%';
    document.getElementById('mv').textContent = auto.checked ? 'auto' : m.value + '%';
    var left = auto.checked ? (100 - w.value) / 2 : +m.value, right = 100 - w.value - left;
    document.getElementById('ro').textContent =
      '.poster {\\n  width: ' + w.value + '%;\\n  ' + (auto.checked ? 'margin: 0 auto;' : 'margin-left: ' + m.value + '%;') + '\\n}\\n\\n' +
      'gap on the left: ' + left + '%   gap on the right: ' + right + '%\\n' +
      (Math.abs(left - right) < 0.01 ? 'centred!' : 'to centre it, margin-left should be ' + (100 - w.value) / 2 + '%');
  }
  [w, m, auto].forEach(function(el){ el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'The poster div is <code>width: 50%</code>. Which <code>margin-left</code> centres it?', options:['50%','20%','25%','0'], answer:2, why:'50% of the width is left over, and half of that, 25%, goes on each side.' },
    { q:'Which property shows a title in capitals without retyping it?', options:['font-variant: caps','text-transform: uppercase','font-weight: 900','text-align: upper'], answer:1, why:'text-transform changes how text is displayed. The HTML keeps the original letters.' },
    { q:'Why wrap the image, title and caption in one div?', options:['Images cannot be centred otherwise','So one box can be sized, centred and styled, and its children inherit the colour, alignment and font','Divs make text bigger','Google Fonts only work inside divs'], answer:1, why:'Styling the container once is simpler than positioning three separate elements.' },
  ],
  notes:`
    <h3>New property: text-transform</h3>
    <p><code>text-transform: uppercase</code> changes how text is shown, not what it is: the HTML still says "Persistence". It also takes <code>lowercase</code> and <code>capitalize</code>.</p>
    <h3>Go further</h3>
    <ul>
      <li><code>letter-spacing: 4px</code> on the title gives it more of a poster feel.</li>
      <li><code>margin: 0 auto</code> is a tidier way to centre a box with a width. You will use it a lot.</li>
      <li>Add <code>max-width: 700px</code> to the poster so it does not grow huge on wide screens.</li>
    </ul>`
});
