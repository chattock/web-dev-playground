/* ===== Section 6 — CSS Properties ===== */

PG.add({
  id:'s06-colors', index:38, udemyId:37350376, minutes:7, section:'s06', slug:'colors', lesson:'6.1',
  title:'CSS Colors',
  blurb:'<code>color</code> paints the text, <code>background-color</code> paints the area behind it. Values can be one of 140 named colours, or a hex code like <code>#c58940</code>.',
  tasks:[
    'Give the <code>body</code> a background colour of <code>antiquewhite</code>.',
    'Make the <code>h1</code> text <code>whitesmoke</code> on a <code>darkseagreen</code> background.',
    'Make the <code>h2</code> text <code>#faf8f1</code> on a <code>#c58940</code> background — the same idea, using hex codes.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Colors</title>
</head>
<body>
  <h1>Hello</h1>
  <h2>World</h2>
</body>
</html>`,
css:`/* TODO 1: body background-color: antiquewhite */

/* TODO 2: h1 — whitesmoke text on darkseagreen */

/* TODO 3: h2 — #faf8f1 text on #c58940 */
`},
  solution:{
css:`body {
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
`},
  explore:[{
    title:'Colour picker → CSS', height:430,
    note:'Drag the pickers. The readout shows the exact rule you have just written — that hex code is what you would paste into your stylesheet.',
    html:`
<div class="knobs">
  <label>text <input type="color" value="#faf8f1" data-css="#swatch|color"></label>
  <label>background <input type="color" value="#c58940" data-css="#swatch|background-color"></label>
  <label>padding <input type="range" min="0" max="60" value="24" data-css="#swatch|padding|px"><span class="val"></span></label>
</div>
<div class="stage">
  <h2 id="swatch" style="margin:0;border-radius:8px">Hello World</h2>
</div>
<pre class="readout" data-readout="#swatch"></pre>
<p class="note"><b>Named vs hex.</b> There are 140 named colours (<span class="tag">tomato</span> <span class="tag">darkseagreen</span> <span class="tag">rebeccapurple</span>) — handy but limited. A hex code is <span class="tag">#RRGGBB</span>: two digits each of red, green and blue, from 00 to FF. <span class="tag">#000000</span> is black, <span class="tag">#FFFFFF</span> white.</p>`
  }],
  notes:`
    <h3>Ways to write a colour</h3>
    <ul>
      <li><b>Named</b> — <code>color: tomato;</code> · 140 of them, easy to remember, limited.</li>
      <li><b>Hex</b> — <code>color: #c58940;</code> · red, green and blue in hexadecimal, 00–FF each.</li>
      <li><b>RGB</b> — <code>color: rgb(197, 137, 64);</code> · the same thing in decimal 0–255.</li>
      <li><b>RGBA</b> — <code>rgba(197, 137, 64, 0.5)</code> · the last number is opacity, 0 to 1.</li>
    </ul>
    <h3>Finding good colours</h3>
    <p>Angela recommends <b>coolors.co</b> for generating palettes. Grab the hex codes and drop them straight into your CSS.</p>`
});


PG.add({
  id:'s06-fonts', index:39, udemyId:37350414, minutes:21, section:'s06', slug:'font-properties', lesson:'6.2',
  title:'Font Properties',
  blurb:'Four properties do most of the typographic work: <code>font-size</code>, <code>font-weight</code>, <code>font-family</code> and <code>text-align</code>.',
  tasks:[
    'Set <code>#size</code> to <code>2rem</code>. The <code>html</code> rule sets the root size to 30px, so 2rem = 60px.',
    'Set <code>#weight</code> to <code>font-weight: 900</code>.',
    'Set <code>#family</code> to the Google Font <code>\'Caveat\', cursive</code> (the font is already linked for you).',
    'Set <code>#align</code> to <code>text-align: right</code>.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Font Properties</title>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <p id="size">This should be twice the root font size.</p>
  <p id="weight">This should be as heavy as the font goes.</p>
  <p id="family">This should be in the Caveat handwriting font.</p>
  <p id="align">This should be pushed to the right.</p>
</body>
</html>`,
css:`html {
  font-size: 30px;
}

body {
  font-family: sans-serif;
}

/* TODO 1: #size  -> font-size 2rem */

/* TODO 2: #weight -> font-weight 900 */

/* TODO 3: #family -> 'Caveat', cursive */

/* TODO 4: #align  -> text-align right */
`},
  solution:{
css:`html {
  font-size: 30px;
}

body {
  font-family: sans-serif;
}

#size {
  font-size: 2rem;
}

#weight {
  font-weight: 900;
}

#family {
  font-family: 'Caveat', cursive;
}

#align {
  text-align: right;
}
`},
  explore:[
  {
    title:'Font control panel', height:440,
    note:'Every knob is a real CSS property. Watch the readout build the rule as you go.',
    html:`
<div class="knobs">
  <label>font-size <input type="range" min="12" max="60" value="22" data-css="#t|font-size|px"><span class="val"></span></label>
  <label>font-weight
    <select data-css="#t|font-weight">
      <option>100</option><option>300</option><option selected>400</option>
      <option>600</option><option>700</option><option>900</option>
    </select>
  </label>
  <label>font-family
    <select data-css="#t|font-family">
      <option value="sans-serif">sans-serif</option>
      <option value="serif">serif</option>
      <option value="monospace">monospace</option>
      <option value="cursive">cursive</option>
    </select>
  </label>
  <label>text-align
    <select data-css="#t|text-align">
      <option>left</option><option>center</option><option>right</option><option>justify</option>
    </select>
  </label>
</div>
<div class="stage">
  <p id="t" style="margin:0">Typography is the craft of making words readable. Change the knobs above and watch how much the same sentence can change character.</p>
</div>
<pre class="readout" data-readout="#t"></pre>`
  },
  {
    title:'px vs rem vs em', height:420,
    note:'Change the <b>root</b> size and see which boxes follow it. This is why <code>rem</code> is the safe unit: one change at the root rescales the whole page.',
    html:`
<div class="knobs">
  <label>html { font-size: <input type="range" min="10" max="30" value="16" id="root"><span class="val" id="rootv">16px</span> }</label>
</div>
<div class="stage" id="stage">
  <p style="font-size:24px;margin:0 0 10px">24px — fixed, ignores the root</p>
  <p style="font-size:1.5rem;margin:0 0 10px">1.5rem — 1.5 × the ROOT size</p>
  <div style="font-size:20px">
    <p style="font-size:1.5em;margin:0">1.5em — 1.5 × its PARENT (parent is 20px)</p>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var r = document.getElementById('root');
  function upd(){
    document.documentElement.style.fontSize = r.value + 'px';
    document.getElementById('rootv').textContent = r.value + 'px';
    document.getElementById('ro').textContent =
      'html { font-size: ' + r.value + 'px }\\n\\n' +
      '24px   stays  24px\\n' +
      '1.5rem is now ' + (r.value*1.5).toFixed(1) + 'px   (1.5 x root)\\n' +
      '1.5em  is now 30.0px   (1.5 x parent 20px)';
  }
  r.addEventListener('input', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>The units</h3>
    <table>
      <tr><th>Unit</th><th>Relative to</th><th>Use for</th></tr>
      <tr><td><code>px</code></td><td>nothing — absolute</td><td>Borders, fine details</td></tr>
      <tr><td><code>rem</code></td><td>the <code>html</code> root size</td><td>Almost everything — predictable</td></tr>
      <tr><td><code>em</code></td><td>the <b>parent's</b> size</td><td>Padding inside a component; can compound unexpectedly</td></tr>
      <tr><td><code>%</code></td><td>the parent's value</td><td>Widths</td></tr>
    </table>
    <h3>Google Fonts</h3>
    <p>Pick a font at <b>fonts.google.com</b>, copy the <code>&lt;link&gt;</code> into your head, then use its name in CSS with a fallback after it:</p>
    <pre>font-family: 'Caveat', cursive;</pre>
    <p>The fallback matters — if the web font fails to load, the browser needs something sensible to use.</p>`
});


PG.add({
  id:'s06-box-model', index:41, udemyId:37350454, minutes:21, section:'s06', slug:'box-model', lesson:'6.3',
  title:'The Box Model',
  blurb:'Every element is a box made of four layers: the <b>content</b>, then <b>padding</b> inside the border, then the <b>border</b> itself, then <b>margin</b> pushing other elements away outside it.',
  tasks:[
    'Give every <code>div</code> a <code>height</code> and <code>width</code> of <code>200px</code>.',
    '<code>#first</code>: cadetblue background, <code>20px</code> padding, a <code>10px solid black</code> border.',
    '<code>#second</code>: gold background, a solid black border that is <code>20px</code> top/bottom and <code>10px</code> left/right, and <code>margin-left: 260px</code>.',
    '<code>#third</code>: indianred background, <code>10px solid black</code> border, <code>margin-left: 40px</code>.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSS Box Model</title>
</head>
<body>
  <div id="first">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
      sapien porttitor urna elementum lacinia.
    </p>
  </div>
  <div id="second"></div>
  <div id="third"></div>
</body>
</html>`,
css:`/* Write your CSS here */

p {
  margin: 0;
}
`},
  solution:{
css:`div {
  height: 200px;
  width: 200px;
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

p {
  margin: 0;
}
`},
  explore:[
  {
    title:'Box model dissector', height:540,
    note:'Drag the sliders and watch where each layer adds space — padding grows the box <b>inwards from the border</b>, margin pushes <b>everything else away</b>.',
    html:`
<div class="knobs">
  <label>padding <input type="range" min="0" max="60" value="20" data-css="#b|padding|px"><span class="val"></span></label>
  <label>border <input type="range" min="0" max="30" value="10" data-css="#b|border-width|px"><span class="val"></span></label>
  <label>margin <input type="range" min="0" max="60" value="20" data-css="#b|margin|px"><span class="val"></span></label>
  <label>width <input type="range" min="100" max="380" value="220" data-css="#b|width|px"><span class="val"></span></label>
  <label><input type="checkbox" data-css="#b|box-sizing" value="border-box" data-off="content-box"> box-sizing: border-box</label>
</div>
<div class="stage" style="background:#ffeaa7">
  <div style="font-size:11px;color:#8a7333;margin-bottom:4px">yellow = the space margin creates</div>
  <div id="b" style="background:#a7d8de;border:10px solid #2d3436;padding:20px;margin:20px;width:220px">
    <div style="background:#ffffff;padding:6px;font-size:12.5px">content box</div>
  </div>
</div>
<pre class="readout" data-readout="#b"></pre>
<pre class="readout" id="total"></pre>
<p class="note"><b>The catch:</b> by default <code>width</code> sizes the <em>content only</em>, so padding and border make the element bigger than the number you wrote. Tick <code>box-sizing: border-box</code> and <code>width</code> suddenly means the whole box — which is why most real projects set it globally with <code>* { box-sizing: border-box; }</code>.</p>
<script>
  function upd(){
    var el = document.getElementById('b');
    var r = el.getBoundingClientRect();
    document.getElementById('total').textContent =
      'declared width  : ' + el.style.width + '\\n' +
      'actual on screen: ' + Math.round(r.width) + 'px';
  }
  document.addEventListener('input', function(){ setTimeout(upd, 10); });
  setTimeout(upd, 60);
<\/script>`
  },
  {
    title:'Shorthand values', height:400,
    note:'One property, four different meanings depending on how many numbers you give it.',
    html:`
<div class="knobs">
  <label>padding:
    <select id="mode">
      <option value="20px">20px  (all four sides)</option>
      <option value="10px 40px">10px 40px  (top/bottom, left/right)</option>
      <option value="5px 20px 40px">5px 20px 40px  (top, left/right, bottom)</option>
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
<p class="note">Same rules apply to <code>margin</code> and <code>border-width</code>. Clockwise from the top: <b>top, right, bottom, left</b>.</p>
<script>
  var m = document.getElementById('mode');
  function upd(){
    document.getElementById('p').style.padding = m.value;
    var n = m.value.split(' ').length;
    var expl = {1:'all four sides',2:'top & bottom | left & right',3:'top | left & right | bottom',4:'top | right | bottom | left'}[n];
    document.getElementById('ro').textContent = '#p {\\n  padding: ' + m.value + ';   /* ' + expl + ' */\\n}';
  }
  m.addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Four layers, outside in</h3>
    <ul>
      <li><b>Margin</b> — invisible space outside the border that pushes neighbours away.</li>
      <li><b>Border</b> — the visible line. Shorthand: <code>border: 10px solid black;</code> (width, style, colour).</li>
      <li><b>Padding</b> — space between the border and the content, inside the background colour.</li>
      <li><b>Content</b> — the text or image itself.</li>
    </ul>
    <h3>Handy tricks</h3>
    <ul>
      <li><code>margin: 0 auto;</code> centres a block element that has a width.</li>
      <li><code>margin-left</code>, <code>padding-top</code> etc. target one side.</li>
      <li>Vertical margins between two block elements <b>collapse</b> — the bigger one wins, they don't add up.</li>
      <li>Open Chrome DevTools → Elements → Computed to see this exact diagram for any element on any website.</li>
    </ul>`
});


PG.add({
  id:'s06-meme', index:42, udemyId:37350494, minutes:8, section:'s06', slug:'motivation-meme', lesson:'6.4', project:true,
  title:'Motivation Meme Project',
  blurb:'Recreate the classic motivational poster: white text over a photo on a black background, centred, in capitals.',
  tasks:[
    'Make the page background black and centre everything.',
    'Give the image a white border and a sensible width.',
    'Style the <code>h1</code>: white, large, and <code>text-transform: uppercase</code> so it shouts without you retyping it.',
    'Style the <code>h2</code> caption smaller and lighter.'
  ],
  files:{
html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Motivation Meme</title>
</head>
<body>
  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&q=70"
       alt="a moody landscape" />
  <h1>Determination</h1>
  <h2>It is not the mountain we conquer, but ourselves.</h2>
</body>
</html>`,
css:`/* TODO: make it look like a motivational poster */

body {
  font-family: sans-serif;
}
`},
  solution:{
css:`body {
  font-family: sans-serif;
  background-color: black;
  text-align: center;
  padding: 40px 20px;
}

img {
  width: 500px;
  max-width: 100%;
  border: 6px solid white;
}

h1 {
  color: white;
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 0;
}

h2 {
  color: #b8b8b8;
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  margin-top: 12px;
}
`},
  notes:`
    <h3>The new property here</h3>
    <p><code>text-transform: uppercase;</code> changes how text is <em>displayed</em> without changing what you typed. Also takes <code>lowercase</code> and <code>capitalize</code>.</p>
    <h3>Go further</h3>
    <ul>
      <li><code>letter-spacing</code> and <code>word-spacing</code> for that poster feel.</li>
      <li><code>text-shadow: 2px 2px 8px rgba(0,0,0,.8);</code> to lift text off a busy photo.</li>
      <li>Put the text <em>on top of</em> the image using <code>position</code> — that's the next section.</li>
    </ul>`
});
