/* ===== Section 12 — Web Design School ===== */
/* Lectures 68–72 are theory: read lessons (the full lecture notes show in the main
   pane) with quizzes and hands-on demos. Lecture 73 turns the principles into a build:
   the learner redesigns a deliberately ugly hotel landing page. */

PG.add({
  id:'l068', index:68, udemyId:19655686, minutes:4, section:'s12', slug:'intro-to-web-design', kind:'read',
  title:'Introduction to Web Design',
  blurb:'Working code is not enough: visitors judge a site by how it looks within a few seconds, and polish changes what they think a product is worth. This short module covers the four things that make the difference: <b>colour</b>, <b>typography</b>, <b>user interface</b> (UI) and <b>user experience</b> (UX).',
  quiz:[
    { q:'How long do visitors take to form a first impression of a website?', options:['About a minute','A few seconds','Until they reach the footer','Only after they use a feature'], answer:1, why:'The lecture compares it to a first date or an interview: the judgement is almost instant, so the look matters from the first screen.' },
    { q:'What did the juice-carton comparison show?', options:['Cheaper designs sell more','The same product looked worth roughly three times as much after a professional redesign','Colour does not affect price','Children prefer clashing colours'], answer:1, why:'A consistent palette and better fonts raised the price people said they would pay from about $1 to about $3.' },
    { q:'Which four topics does this module cover?', options:['HTML, CSS, JavaScript, Git','Colour theory, typography, UI design and UX design','Logos, photos, video, sound','Grid, flexbox, Bootstrap, media queries'], answer:1, why:'Each of the next four lectures takes one of these pillars, then lecture 73 puts them together.' },
  ],
  explore:[{
    title:'Same lemonade, two designs', height:600,
    note:'The same product and the same words, before and after a design pass. Drag the divider, then read what changed: none of it needs anything beyond the CSS you already know.',
    html:`
<div class="knobs">
  <label>before <input type="range" id="wipe" min="0" max="100" value="50" style="width:240px"> after</label>
  <button id="b0">all before</button> <button id="b1">all after</button>
</div>
<div class="stage" style="display:flex;justify-content:center">
  <div id="frame" style="position:relative;width:460px;max-width:100%;height:270px">
    <div class="cardx messy">
      <div class="m-title">SUNNY SQUEEZE!!!</div>
      <div class="m-sub">100% real lemons* <span>(*mostly)</span></div>
      <div class="m-emoji">🍋🍋🍋</div>
      <p class="m-text">Fresh lemonade for kids made with lemons and sunshine and NO artificial colours buy now while stocks last!!</p>
      <div class="m-price">ONLY £1.20</div>
      <button class="m-btn">BUY</button>
    </div>
    <div class="cardx clean" id="clean">
      <div class="c-left">
        <p class="c-kicker">Sunny Squeeze</p>
        <h3 class="c-title">Real lemonade for little ones</h3>
        <p class="c-text">Pressed lemons, a little sugar and nothing artificial.</p>
        <div class="c-row"><span class="c-price">£1.20</span><button class="c-btn">Add to basket</button></div>
      </div>
      <div class="c-right">🍋</div>
    </div>
    <div id="bar"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .cardx{position:absolute;top:0;left:0;right:0;bottom:0;border-radius:8px;overflow:hidden}
  .messy{background:#00e5ff;padding:6px;font-family:"Comic Sans MS","Comic Sans",cursive}
  .m-title{font-family:Impact,Haettenschweiler,sans-serif;color:#ff0000;font-size:32px;text-align:center}
  .m-sub{color:#00a000;font-family:"Courier New",monospace;text-align:right;font-size:14px}
  .m-sub span{color:#ff00ff}
  .m-emoji{font-size:22px}
  .m-text{color:#7a00ff;font-size:13px;margin:2px;text-align:justify;font-family:"Times New Roman",serif}
  .m-price{color:#ffff00;background:#ff6600;display:inline-block;font-size:18px;margin:4px 0 0 140px}
  #frame .m-btn{background:#00ff00;color:#ff0000;border:3px dotted #0000ff;border-radius:0;padding:1px 6px;font-size:11px;margin-left:30px}
  .clean{background:#fff8e1;display:flex;align-items:center;gap:20px;padding:28px 32px;font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#3d3a2c}
  .c-left{flex:1}
  .c-kicker{margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a6a00;font-weight:700}
  .c-title{margin:0 0 8px;font-family:Georgia,serif;font-size:26px;line-height:1.15;color:#2f3b2a}
  .c-text{margin:0 0 16px;font-size:13.5px;color:#5f5a45}
  .c-row{display:flex;align-items:center;gap:14px}
  .c-price{font-size:20px;font-weight:700;color:#2f3b2a}
  #frame .c-btn{background:#2f7d32;color:#fff;border:none;border-radius:999px;padding:8px 16px;font-weight:600;font-size:13px}
  .c-right{font-size:80px;flex:0 0 130px;height:130px;border-radius:50%;background:#ffe082;display:flex;align-items:center;justify-content:center}
  #bar{position:absolute;top:-6px;bottom:-6px;width:3px;background:#1c2030;border-radius:2px;pointer-events:none}
</style>
<script>
  var wipe = document.getElementById('wipe');
  function upd(){
    var v = +wipe.value;
    document.getElementById('clean').style.clipPath = 'inset(0 0 0 ' + (100 - v) + '%)';
    document.getElementById('bar').style.left = 'calc(' + (100 - v) + '% - 1px)';
    document.getElementById('ro').textContent =
      'left of the line: before   |   right of the line: after\\n\\n' +
      'colours           9 clashing hues  ->  3: lemon yellow, olive green, one green button\\n' +
      'typefaces         5                ->  2: a serif for the name, a sans-serif for the rest\\n' +
      'alignment edges   5                ->  1: everything starts on the same left edge\\n' +
      'emphasis          everything shouts ->  the name first, then the price and the button\\n' +
      'white space       none             ->  room around every element';
  }
  wipe.addEventListener('input', upd);
  document.getElementById('b0').onclick = function(){ wipe.value = 0; upd(); };
  document.getElementById('b1').onclick = function(){ wipe.value = 100; upd(); };
  upd();
<\/script>`
  }],
});


PG.add({
  id:'l069', index:69, udemyId:19655720, minutes:9, section:'s12', slug:'colour-theory', kind:'read',
  title:'Understanding Colour Theory',
  blurb:'The dominant colour of a design speaks before any text is read: red for energy, yellow for attention, green for freshness, blue for trust, purple for luxury. Choose it for the message, not as a favourite, then combine two or three colours using their positions on the colour wheel: analogous, complementary, triadic or square.',
  links:[
    { title:'Adobe Color', url:'https://color.adobe.com/create/color-wheel', note:'pick a harmony rule, drag the wheel, copy the hex codes' },
    { title:'Color Hunt', url:'https://colorhunt.co/', note:'ready-made palettes chosen by designers' },
  ],
  quiz:[
    { q:'A bank wants visitors to feel their money is safe. Which dominant colour fits best?', options:['Red','Yellow','Blue','Purple'], answer:2, why:'Blue reads as stable, trustworthy and calm, which is why finance and payment companies lean on it.' },
    { q:'What is an <b>analogous</b> palette?', options:['Colours opposite each other on the wheel','Colours next to each other on the wheel','Black, white and grey','Three colours evenly spaced around the wheel'], answer:1, why:'Neighbouring hues are harmonious and calm, though nothing in them stands out strongly.' },
    { q:'Where should complementary (opposite) colours be used?', options:['For body text on a background','For accents such as logos, icons and buttons','Only in print','Never'], answer:1, why:'Opposites make each other look more vivid. That pop is great for an accent and hard to read as text on background.' },
    { q:'Why is yellow a poor choice for the background of a long article?', options:['It prints badly','It grabs attention so strongly that it tires the eyes over a long read','Browsers cannot show yellow text','It looks old-fashioned'], answer:1, why:'Yellow is ideal for headlines and logos that need to be noticed, not for areas people read for minutes.' },
  ],
  explore:[
  {
    title:'Colour wheel schemes', height:600,
    note:'Pick a base hue and a harmony rule. The markers show where the colours sit on the wheel; the little page underneath uses them as dominant, secondary and accent colours.',
    html:`
<div class="knobs">
  <label>base hue <input type="range" id="h" min="0" max="359" value="200"><span class="val" id="hv"></span></label>
  <label>scheme
    <select id="sc">
      <option value="analogous">analogous</option>
      <option value="complementary">complementary</option>
      <option value="triadic">triadic</option>
      <option value="square">square</option>
    </select>
  </label>
</div>
<div class="stage" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
  <div id="wheel"></div>
  <div style="flex:1;min-width:280px">
    <div id="sw"></div>
    <div id="mini">
      <div id="mn">Brand</div>
      <div id="mh"><b id="mt">A headline in the secondary colour</b><p>Body text stays dark grey on a pale background, whatever the palette.</p><button id="mb">Call to action</button></div>
    </div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  #wheel{position:relative;width:190px;height:190px;border-radius:50%;flex:0 0 190px;
    background:conic-gradient(hsl(0,80%,55%),hsl(60,80%,55%),hsl(120,80%,55%),hsl(180,80%,55%),hsl(240,80%,55%),hsl(300,80%,55%),hsl(360,80%,55%))}
  #wheel:after{content:"";position:absolute;top:50px;left:50px;width:90px;height:90px;border-radius:50%;background:#fff}
  .mk{position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px #1c2030;z-index:2}
  #sw{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
  .swc{width:92px;height:62px;border-radius:8px;display:flex;align-items:flex-end;padding:5px;font:12px ui-monospace,Menlo,monospace;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.6)}
  #mini{border:1px solid #dfe3ee;border-radius:10px;overflow:hidden}
  #mn{padding:10px 14px;color:#fff;font-weight:700}
  #mh{padding:14px}
  #mh p{color:#333;margin:6px 0 10px;font-size:13px}
  #mh button{border:none;border-radius:6px;padding:7px 14px;color:#fff;font-weight:600;cursor:pointer}
</style>
<script>
  function hex(h, s, l){
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    var a = s * Math.min(l, 1 - l);
    function f(n){ var k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }
    return '#' + [f(0), f(8), f(4)].map(function(x){ return ('0' + Math.round(x * 255).toString(16)).slice(-2); }).join('');
  }
  var OFFS = { analogous:[0, 30, -30], complementary:[0, 180], triadic:[0, 120, 240], square:[0, 90, 180, 270] };
  var SAY = {
    analogous:'Neighbours on the wheel: calm and harmonious. Good for backgrounds, navigation and a logo on its background, but nothing stands out much.',
    complementary:'Opposites on the wheel: maximum pop. Keep the second colour for small accents such as buttons and icons, never for text on the first.',
    triadic:'Three hues evenly spaced: lively and balanced. Let one dominate and use the other two sparingly.',
    square:'Four hues evenly spaced: rich and hard to control. Pick one dominant colour and keep the rest for details.'
  };
  function upd(){
    var h = +document.getElementById('h').value, sc = document.getElementById('sc').value;
    document.getElementById('hv').textContent = h + '°';
    var hues = OFFS[sc].map(function(o){ return ((h + o) % 360 + 360) % 360; });
    var cols = hues.map(function(x){ return hex(x, 70, 45); });
    var w = document.getElementById('wheel');
    [].slice.call(w.querySelectorAll('.mk')).forEach(function(m){ m.remove(); });
    hues.forEach(function(x, i){
      var m = document.createElement('div'); m.className = 'mk';
      var r = 72, rad = x * Math.PI / 180;
      m.style.left = (95 + r * Math.sin(rad)) + 'px'; m.style.top = (95 - r * Math.cos(rad)) + 'px';
      m.style.background = cols[i]; w.appendChild(m);
    });
    document.getElementById('sw').innerHTML = cols.map(function(c){ return '<div class="swc" style="background:' + c + '">' + c + '</div>'; }).join('');
    var dom = cols[0], sec = cols.length > 2 ? cols[1] : hex(h, 70, 30), acc = cols[cols.length - 1];
    document.getElementById('mn').style.background = dom;
    document.getElementById('mh').style.background = hex(h, 40, 96);
    document.getElementById('mt').style.color = sec;
    document.getElementById('mb').style.background = acc;
    document.getElementById('ro').textContent = ':root {\\n  --dominant:  ' + dom + ';\\n  --secondary: ' + sec + ';\\n  --accent:    ' + acc + ';\\n}\\n\\n' + sc + ': ' + SAY[sc];
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'What does this colour say?', height:500,
    note:'Pick a business and a dominant colour. The readout gives the mood the lecture attaches to that colour and whether it suits the message.',
    html:`
<div class="knobs">
  <label>business
    <select id="biz">
      <option value="bank">a bank</option>
      <option value="juice">a children's juice brand</option>
      <option value="grocer">an organic grocer</option>
      <option value="car">a sports car maker</option>
      <option value="jewel">a luxury jeweller</option>
    </select>
  </label>
  <label>dominant colour
    <select id="col">
      <option value="red">red</option><option value="yellow">yellow</option><option value="green">green</option>
      <option value="blue">blue</option><option value="purple">purple</option><option value="brown">brown</option>
    </select>
  </label>
</div>
<div class="stage">
  <div id="pg">
    <div id="nav"><b id="nm"></b><span>Home · About · Contact</span></div>
    <div id="hero"><h3 id="tg"></h3><p>A short line of supporting text sits here.</p><button id="bt">Find out more</button></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  #pg{border:1px solid #dfe3ee;border-radius:10px;overflow:hidden;max-width:560px}
  #nav{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-size:13px}
  #hero{padding:22px 16px}
  #hero h3{margin:0 0 6px;font-size:22px}
  #hero p{margin:0 0 12px;color:#444;font-size:13px}
  #bt{border:none;border-radius:6px;padding:8px 16px;font-weight:600}
</style>
<script>
  var C = {
    red:['#c62828','#fdecea','#fff','love, energy, intensity, power'],
    yellow:['#f9c80e','#fff8d6','#2b2400','joy, intellect, attention'],
    green:['#2e7d32','#e8f5e9','#fff','freshness, growth, safety'],
    blue:['#1565c0','#e3f0fc','#fff','stability, trust, calm'],
    purple:['#6a1b9a','#f3e5f5','#fff','royalty, wealth, luxury'],
    brown:['#6d4c41','#efebe9','#fff','earthy, rustic, dependable (and easily dull)']
  };
  var B = {
    bank:['Steadfast Bank','Your savings, safely kept','blue'],
    juice:['Squeezy','Juice that tastes like summer holidays','yellow'],
    grocer:['Fieldfare Organics','Picked on the farm this morning','green'],
    car:['Vantor Motors','Built to be driven hard','red'],
    jewel:['Maison Aurel','Fine jewellery, made by hand','purple']
  };
  function upd(){
    var b = B[document.getElementById('biz').value], k = document.getElementById('col').value, c = C[k];
    document.getElementById('nav').style.background = c[0]; document.getElementById('nav').style.color = c[2];
    document.getElementById('hero').style.background = c[1];
    document.getElementById('nm').textContent = b[0];
    document.getElementById('tg').textContent = b[1];
    document.getElementById('tg').style.color = k === 'yellow' ? '#5c4a00' : c[0];
    document.getElementById('bt').style.background = c[0]; document.getElementById('bt').style.color = c[2];
    var good = k === b[2];
    document.getElementById('ro').textContent = k + ' says: ' + c[3] + '.\\n\\n' +
      (good ? 'A good match for ' + b[0] + ': the colour carries the same message as the words.'
            : 'A mismatch: ' + b[0] + ' wants to say something else. ' + b[2].charAt(0).toUpperCase() + b[2].slice(1) + ' (' + C[b[2]][3] + ') would fit better.') +
      (k === 'yellow' ? '\\nYellow grabs attention: great for a logo or headline, tiring as the background of long text.' : '');
  }
  document.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Text contrast and vibrating complements', height:500,
    note:'Choose a text colour and a background. The readout computes the contrast ratio the web accessibility guidelines use (4.5 : 1 or more for body text) and warns when the two hues are complementary.',
    html:`
<div class="knobs">
  <label>text <input type="color" id="fg" value="#e53935"></label>
  <label>background <input type="color" id="bg" value="#2e9e44"></label>
  <label>presets
    <select id="pre">
      <option value="">choose…</option>
      <option value="#e53935,#2e9e44">red on green (complementary)</option>
      <option value="#1e5bd8,#f08a24">blue on orange (complementary)</option>
      <option value="#ffeb3b,#ffffff">yellow on white</option>
      <option value="#1f2a44,#ffffff">navy on white</option>
      <option value="#ffffff,#1565c0">white on blue</option>
    </select>
  </label>
</div>
<div class="stage" id="st">
  <p style="font-size:22px;font-weight:700;margin:0 0 8px">A headline in these colours</p>
  <p style="margin:0;font-size:14px">Smaller body text is where poor contrast hurts most. Try reading this for a minute and notice whether the letters seem to shimmer at the edges.</p>
</div>
<pre class="readout" id="ro"></pre>
<script>
  function lum(hx){
    var v = [1, 3, 5].map(function(i){ var c = parseInt(hx.substr(i, 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function hueSat(hx){
    var r = parseInt(hx.substr(1, 2), 16) / 255, g = parseInt(hx.substr(3, 2), 16) / 255, b = parseInt(hx.substr(5, 2), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d){ if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; }
    return [Math.round(h * 60 + 360) % 360, d];
  }
  function upd(){
    var fg = document.getElementById('fg').value, bg = document.getElementById('bg').value;
    var st = document.getElementById('st'); st.style.color = fg; st.style.background = bg;
    var a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    var h1 = hueSat(fg), h2 = hueSat(bg), diff = Math.abs(h1[0] - h2[0]); diff = Math.min(diff, 360 - diff);
    var comp = diff > 150 && h1[1] > 0.35 && h2[1] > 0.35;
    document.getElementById('ro').textContent = 'color: ' + fg + ';  background: ' + bg + ';\\n\\n' +
      'contrast ratio ' + ratio.toFixed(2) + ' : 1   -> ' +
      (ratio >= 7 ? 'excellent for any text' : ratio >= 4.5 ? 'fine for body text' : ratio >= 3 ? 'only for large, bold text' : 'too low: hard to read for everyone') +
      (comp ? '\\n\\nThese two hues sit opposite each other on the wheel (' + diff + '° apart). Complementary pairs seem to vibrate where they meet: keep them for accents, not for text on background.' : '');
  }
  document.getElementById('pre').addEventListener('change', function(){
    var v = this.value; if (!v) return; var p = v.split(',');
    document.getElementById('fg').value = p[0]; document.getElementById('bg').value = p[1]; upd();
  });
  document.addEventListener('input', upd); upd();
<\/script>`
  }],
});


PG.add({
  id:'l070', index:70, udemyId:19655724, minutes:10, section:'s12', slug:'typography', kind:'read',
  title:'Understanding Typography and How to Choose a Font',
  blurb:'Typefaces carry a mood, just as colours do. <b>Serif</b> faces feel traditional and authoritative (and their thick-to-thin contrast hints at their era); <b>sans-serif</b> faces feel friendly and modern, and humanist ones are the easiest to read. Pair <b>two</b> fonts of a similar mood and era, and create contrast with serif against sans-serif or with heavy against light weights.',
  links:[
    { title:'Google Fonts', url:'https://fonts.google.com/', note:'free web fonts for trying out pairings' },
  ],
  quiz:[
    { q:'Which mood do serif typefaces usually carry?', options:['Playful and childish','Traditional, stable and authoritative','Futuristic','Casual and handwritten'], answer:1, why:'Serifs echo carved lettering, so they suit law firms, magazines and anything that should feel established.' },
    { q:'How many fonts should a design (or one section of it) normally use?', options:['One','Two','Four or five','As many as there are headings'], answer:1, why:'Two fonts give enough contrast; many more look cluttered and amateur.' },
    { q:'Which pairing follows the lecture\'s advice?', options:['Two different script fonts','A serif heading with a sans-serif body, both from a similar era','Two near-identical sans-serifs at the same weight','A novelty font for all the body text'], answer:1, why:'Contrast in style (or in weight) with a shared mood makes the two fonts work together instead of competing.' },
    { q:'What is a quick clue to a serif\'s age?', options:['The number of letters','The contrast between the thickest and thinnest strokes','Whether it has italics','Its file size'], answer:1, why:'Old-style serifs have low stroke contrast, transitional more, and modern (Didone) faces such as Didot extreme contrast.' },
    { q:'Why are humanist sans-serifs often chosen for body text?', options:['They are free','Open shapes and distinct characters make them easy to read','They are the narrowest fonts','Browsers require them'], answer:1, why:'Legibility has measurable effects: easier text is read faster and more likely to be read to the end.' },
  ],
  explore:[
  {
    title:'Font pairing lab', height:600,
    note:'Choose a heading font and a body font with their weights. The readout checks the lecture\'s rules: two fonts, contrast in style or weight, nothing novelty in the body text. (Web fonts load from Google Fonts; offline you will see fallbacks.)',
    html:`
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Bodoni+Moda:wght@400;700;900&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;700&family=Lora:wght@400;700&family=Roboto+Slab:wght@300;400;700;900&family=Open+Sans:wght@300;400;700;800&family=Lato:wght@300;400;700;900&family=Montserrat:wght@300;400;700;900&family=Raleway:wght@300;400;700;900&family=Lobster&display=swap" rel="stylesheet">
<div class="knobs">
  <label>heading <select id="hf"></select></label>
  <label>weight <select id="hw"><option>300</option><option>400</option><option selected>700</option><option>900</option></select></label>
  <label>body <select id="bf"></select></label>
  <label>weight <select id="bw"><option>300</option><option selected>400</option><option>700</option></select></label>
</div>
<div class="stage">
  <div id="spec" style="max-width:62ch">
    <h2 id="h" style="font-size:34px;line-height:1.15;margin:0 0 12px">The Old Harbour Inn</h2>
    <p id="b" style="font-size:16px;line-height:1.6;margin:0">Twelve rooms above a working harbour, a kitchen that buys straight off the boats and a bar that has not changed its chairs since 1962. Breakfast is served until the tide turns, and the window seats go to whoever gets up first.</p>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<script>
  var F = [
    ['Playfair Display','serif','modern serif, high stroke contrast'],
    ['Bodoni Moda','serif','modern (Didone) serif, extreme contrast'],
    ['Libre Baskerville','serif','transitional serif'],
    ['EB Garamond','serif','old-style serif, low contrast'],
    ['Lora','serif','contemporary serif'],
    ['Roboto Slab','serif','slab serif'],
    ['Georgia','serif','system serif'],
    ['Open Sans','sans','humanist sans-serif'],
    ['Lato','sans','humanist sans-serif'],
    ['Montserrat','sans','geometric sans-serif'],
    ['Raleway','sans','elegant sans-serif'],
    ['Verdana','sans','humanist sans-serif (system)'],
    ['Arial','sans','grotesque sans-serif (system)'],
    ['Lobster','novelty','script display face'],
    ['Comic Sans MS','novelty','informal novelty face']
  ];
  function stack(f){ return '"' + f[0] + '", ' + (f[1] === 'serif' ? 'Georgia, serif' : f[1] === 'sans' ? 'Arial, sans-serif' : 'cursive'); }
  ['hf','bf'].forEach(function(id){
    document.getElementById(id).innerHTML = F.map(function(f, i){ return '<option value="' + i + '">' + f[0] + '</option>'; }).join('');
  });
  document.getElementById('hf').value = '0'; document.getElementById('bf').value = '7';
  function upd(){
    var hf = F[+document.getElementById('hf').value], bf = F[+document.getElementById('bf').value];
    var hw = +document.getElementById('hw').value, bw = +document.getElementById('bw').value;
    var h = document.getElementById('h'), b = document.getElementById('b');
    h.style.fontFamily = stack(hf); h.style.fontWeight = hw;
    b.style.fontFamily = stack(bf); b.style.fontWeight = bw;
    var notes = [];
    if (hf[0] === bf[0]) notes.push('o  one typeface for both: tidy, but the only contrast left is size and weight' + (Math.abs(hw - bw) >= 300 ? ' (your weights do differ clearly: good)' : '; make the weights differ more'));
    else if (hf[1] !== 'novelty' && bf[1] !== 'novelty' && hf[1] !== bf[1]) notes.push('ok ' + (hf[1] === 'serif' ? 'serif heading + sans-serif body' : 'sans-serif heading + serif body') + ': clear contrast in style');
    else if (hf[1] === bf[1]) notes.push('x  two ' + (hf[1] === 'serif' ? 'serifs' : 'sans-serifs') + ': they compete rather than contrast' + (Math.abs(hw - bw) >= 300 ? ', though the weight difference helps' : ''));
    if (Math.abs(hw - bw) >= 300 && hf[0] !== bf[0]) notes.push('ok ' + hw + ' against ' + bw + ': contrast in weight');
    if (hf[1] === 'novelty') notes.push('!  a novelty heading can work as a big logo-style title, but it is hard to fit to a serious mood');
    if (bf[1] === 'novelty') notes.push('x  novelty fonts are tiring to read in a paragraph: pick a plain serif or sans-serif for body text');
    document.getElementById('ro').textContent =
      'h1, h2 { font-family: ' + stack(hf) + '; font-weight: ' + hw + '; }   /* ' + hf[2] + ' */\\n' +
      'body   { font-family: ' + stack(bf) + '; font-weight: ' + bw + '; }   /* ' + bf[2] + ' */\\n\\n' + notes.join('\\n');
  }
  document.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Type specimens', height:560,
    note:'Three quick comparisons from the lecture: serif families from old to modern, characters that are easy to confuse, and novelty fonts at reading size. Type your own text to test it.',
    html:`
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&family=Libre+Baskerville:wght@400&family=Bodoni+Moda:wght@400&family=Roboto+Slab:wght@400&family=Open+Sans:wght@400&family=Lobster&display=swap" rel="stylesheet">
<div class="knobs">
  <label>compare
    <select id="mode">
      <option value="eras">serif families, old to modern</option>
      <option value="confuse">characters that get confused</option>
      <option value="novelty">novelty fonts at reading size</option>
    </select>
  </label>
  <label>text <input type="text" id="tx" size="24"></label>
</div>
<div class="stage" id="st"></div>
<p class="note" id="nt" style="font-size:13px"></p>
<style>
  .row{display:flex;align-items:baseline;gap:16px;padding:8px 0;border-bottom:1px solid #eef1f9}
  .row .lb{flex:0 0 190px;font-size:12px;color:#5b6382}
  .row .lb b{display:block;color:#1c2030;font-size:13px}
</style>
<script>
  var M = {
    eras:{ text:'Hamburgefonstiv', size:40, rows:[
      ['"EB Garamond", Garamond, serif','Old style','Low contrast between thick and thin strokes. Feels aged: a winery, a bookshop.'],
      ['"Libre Baskerville", Baskerville, serif','Transitional','More contrast, more upright. Classic and bookish.'],
      ['"Bodoni Moda", Didot, serif','Modern (Didone)','Extreme contrast: hairline thins, heavy thicks. Fashion-magazine authority.'],
      ['"Roboto Slab", Rockwell, serif','Slab serif','Block-like serifs, little contrast. Sturdy and confident.']
    ], note:'Look at the thinnest and thickest parts of each letter: the bigger the difference, the more modern the serif.' },
    confuse:{ text:'Il1 O0 g9 rn m 5S', size:38, rows:[
      ['Verdana, sans-serif','Verdana','Humanist: every character has its own shape.'],
      ['"Open Sans", sans-serif','Open Sans','Humanist: open shapes, clear differences.'],
      ['Arial, Helvetica, sans-serif','Arial','Grotesque: capital I and lowercase l are near twins.'],
      ['Georgia, serif','Georgia','Serif: the feet help tell similar letters apart.']
    ], note:'Legible fonts keep look-alike characters distinct (I, l and 1; O and 0; rn and m) and give letters generous, open shapes.' },
    novelty:{ text:'Check-in opens at three and breakfast is served on the terrace until eleven every morning.', size:16, rows:[
      ['Lobster, cursive','Lobster','Lovely for a logo, slow going in a paragraph.'],
      ['"Comic Sans MS", "Comic Sans", cursive','Comic Sans','Informal to the point of unprofessional for most brands.'],
      ['Papyrus, fantasy','Papyrus','A strong, very specific mood that rarely fits.'],
      ['"Open Sans", sans-serif','Open Sans','The plain choice: nothing gets in the way of the words.']
    ], note:'Novelty faces have strong moods and are hard to read at length. Keep them, if at all, for a large title or a logo.' }
  };
  var mode = document.getElementById('mode'), tx = document.getElementById('tx');
  function draw(){
    var m = M[mode.value], t = tx.value.replace(/[<>&]/g, '');
    document.getElementById('st').innerHTML = m.rows.map(function(r){
      return '<div class="row"><div class="lb"><b>' + r[1] + '</b>' + r[2] + '</div><div style="font-family:' + r[0].replace(/"/g, '&quot;') + ';font-size:' + m.size + 'px;line-height:1.3">' + t + '</div></div>';
    }).join('');
    document.getElementById('nt').textContent = m.note;
  }
  mode.addEventListener('change', function(){ tx.value = M[mode.value].text; draw(); });
  tx.addEventListener('input', draw);
  tx.value = M[mode.value].text; draw();
<\/script>`
  }],
});


PG.add({
  id:'l071', index:71, udemyId:19655714, minutes:10, section:'s12', slug:'ui-design', kind:'read',
  title:'Manage ATTENTION with effective User Interface (UI) Design',
  blurb:'UI design decides where people look. Five principles: <b>hierarchy</b> (bigger, bolder, brighter gets seen first), <b>layout</b> (break content into chunks, lines of about 40–60 characters), <b>alignment</b> (as few starting edges as possible), <b>white space</b> (room signals quality) and <b>knowing your audience</b> (the right style depends on who it is for).',
  quiz:[
    { q:'What does the eye go to first on a page?', options:['Whatever is at the bottom','The biggest, boldest, highest-contrast element','The longest paragraph','The smallest text'], answer:1, why:'Size, weight and colour contrast set the order in which people notice things, so give the most important item the most of them.' },
    { q:'Roughly how many characters per line make text comfortable to read?', options:['10–20','40–60','100–120','As many as fit the screen'], answer:1, why:'Much longer lines make the eye lose its place when it jumps back; much shorter ones feel choppy. In CSS, max-width: 60ch is a handy limit.' },
    { q:'A centred title sits above left-aligned paragraphs. What does the lecture suggest?', options:['Centre the paragraphs too, always','Give the title and the text the same left edge','Make the title bigger','Justify everything'], answer:1, why:'Fewer distinct alignment lines make a design look deliberate and professional, without touching colours or fonts.' },
    { q:'What does generous white space tend to signal?', options:['An unfinished page','Quality and a premium product','A discount store','A broken layout'], answer:1, why:'Luxury shops and premium ads leave room around things; crowded layouts read as cheap.' },
    { q:'A very austere black-and-white design for a children\'s concert poster is an example of ignoring which principle?', options:['Hierarchy','Alignment','Knowing your audience','Line length'], answer:2, why:'Rules of good taste depend on who the design is for; children need something colourful and playful.' },
  ],
  explore:[
  {
    title:'Hierarchy: what do you read first?', height:520,
    note:'The same party invitation three ways. In the flat version you have to read every word to find out whose party it is, where and when.',
    html:`
<div class="knobs">
  <label>design
    <select id="mode">
      <option value="flat">everything the same</option>
      <option value="size">size only</option>
      <option value="full" selected>size, weight, colour and space</option>
    </select>
  </label>
</div>
<div class="stage"><div id="inv"></div></div>
<pre class="readout" id="ro"></pre>
<style>
  #inv{max-width:420px;margin:0 auto;padding:20px;border:1px solid #dfe3ee;border-radius:10px;background:#fff;font-family:Georgia,serif}
  .full .k{font:700 11px -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#b5446e;margin:0 0 6px}
  .full .t{font-size:38px;font-weight:700;margin:0 0 14px;line-height:1.1;color:#1c2030}
  .full .w{font:700 16px -apple-system,Helvetica,Arial,sans-serif;color:#b5446e;margin:0}
  .full .p{font:15px -apple-system,Helvetica,Arial,sans-serif;color:#1c2030;margin:0 0 14px}
  .full .d{font:13px -apple-system,Helvetica,Arial,sans-serif;color:#6b7080;margin:0 0 16px}
  .full button{font:600 13px -apple-system,Helvetica,Arial,sans-serif;background:#b5446e;color:#fff;border:none;border-radius:999px;padding:8px 18px}
  .size p{margin:0 0 8px;color:#333}
  .flat p{margin:0;font-size:15px;line-height:1.5;color:#333}
</style>
<script>
  var HTML = {
    flat:'<p>You are invited to Mia\\u2019s 30th birthday. There will be dinner and dancing at The Boathouse on Riverside Walk on Saturday 14 June from 7pm. Please reply to Sam by 1 June so we know how many people are coming.</p>',
    size:'<p style="font-size:13px">You are invited to</p><p style="font-size:34px">Mia is 30</p><p style="font-size:16px">Saturday 14 June, 7pm</p><p style="font-size:15px">The Boathouse, Riverside Walk</p><p style="font-size:13px">Dinner and dancing. Reply to Sam by 1 June.</p>',
    full:'<p class="k">You are invited</p><p class="t">Mia is 30</p><p class="w">Saturday 14 June, 7pm</p><p class="p">The Boathouse, Riverside Walk</p><p class="d">Dinner and dancing. Please reply to Sam by 1 June.</p><button>Reply</button>'
  };
  var SAY = {
    flat:'One block, one size, one colour: nothing is more important than anything else, so the reader has to read it all to find the who, where and when.',
    size:'Size alone already creates an order: the name first, then the date. Better, but still all the same grey and weight.',
    full:'Size, weight, an accent colour and spacing work together: whose party, then when and where, then the details, then one obvious action. The reader can skim it in two seconds.'
  };
  function upd(){
    var m = document.getElementById('mode').value, inv = document.getElementById('inv');
    inv.className = m; inv.innerHTML = HTML[m];
    document.getElementById('ro').textContent = SAY[m];
  }
  document.getElementById('mode').addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Line length', height:520,
    note:'Drag the width of the text column. The readout counts the characters on each full line; the lecture aims for about 40 to 60.',
    html:`
<div class="knobs">
  <label>max-width <input type="range" id="mw" min="15" max="120" value="100"><span class="val" id="mwv"></span></label>
  <label>font-size <input type="range" id="fs" min="13" max="22" value="16"><span class="val" id="fsv"></span></label>
</div>
<div class="stage"><p id="p" style="margin:0;line-height:1.6;font-family:Georgia,serif;color:#1c2030"></p></div>
<pre class="readout" id="ro"></pre>
<script>
  var TEXT = 'When a line of text runs too long, your eye has to travel a long way back to the start of the next line and often lands on the wrong one. When lines are very short, the eye jumps back so often that the reading feels choppy and the meaning gets broken up. Somewhere in the middle, roughly forty to sixty characters, reading becomes effortless, which is why books, newspapers and well-designed websites keep their columns fairly narrow even on very wide screens.';
  var p = document.getElementById('p');
  p.innerHTML = TEXT.split(' ').map(function(w){ return '<span>' + w + '</span>'; }).join(' ');
  function upd(){
    var mw = document.getElementById('mw').value, fs = document.getElementById('fs').value;
    p.style.maxWidth = mw + 'ch'; p.style.fontSize = fs + 'px';
    document.getElementById('mwv').textContent = mw + 'ch'; document.getElementById('fsv').textContent = fs + 'px';
    var lines = [], top = null;
    [].forEach.call(p.children, function(s){ if (s.offsetTop !== top){ lines.push([]); top = s.offsetTop; } lines[lines.length - 1].push(s.textContent); });
    var full = lines.slice(0, -1).map(function(l){ return l.join(' ').length; });
    var avg = full.length ? Math.round(full.reduce(function(a, b){ return a + b; }, 0) / full.length) : TEXT.length;
    document.getElementById('ro').textContent = 'p { max-width: ' + mw + 'ch; font-size: ' + fs + 'px; }\\n\\n' +
      lines.length + ' lines, about ' + avg + ' characters on each full line  ->  ' +
      (avg < 40 ? 'too short: the eye keeps jumping back and the text feels choppy' : avg <= 60 ? 'comfortable: this is the range the lecture recommends' : avg <= 75 ? 'getting long: readable, but tighten it if you can' : 'too long: easy to lose your place when you jump back to the next line');
  }
  document.addEventListener('input', upd); upd();
<\/script>`
  },
  {
    title:'Alignment and white space', height:560,
    note:'The same headphone ad. Switch between mixed alignment and one shared edge, and between cramped and generous spacing. The pink lines mark every distinct starting edge.',
    html:`
<div class="knobs">
  <label>alignment <select id="al"><option value="mixed">mixed: centre, left and right</option><option value="one" selected>one left edge</option></select></label>
  <label>white space <select id="ws"><option value="cramped">cramped</option><option value="roomy" selected>generous</option></select></label>
  <label><input type="checkbox" id="gd" checked> show starting edges</label>
</div>
<div class="stage">
  <div id="wrap" style="position:relative;max-width:440px;margin:0 auto">
    <div id="ad">
      <p class="a1">New</p>
      <h3 class="a2">Calm 2 headphones</h3>
      <p class="a3">Forty hours of battery, noise cancelling that you forget is on, and cushions you can wear all day.</p>
      <p class="a4">£149</p>
      <button class="a5">Pre-order</button>
      <p class="a6">Ships in November. Free returns.</p>
    </div>
    <div id="gl"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  #ad{background:#f7f5f0;border-radius:10px;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1c2030}
  #ad p,#ad h3{margin:0}
  .a1{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#7a5c3a}
  .a2{font-size:24px}
  .a3{font-size:14px;color:#555}
  .a4{font-size:20px;font-weight:700}
  #ad .a5{background:#1c2030;color:#fff;border:none;border-radius:6px;padding:8px 18px;font-size:14px;font-weight:600;display:block}
  .a6{font-size:12px;color:#777}
  .cramped{padding:4px;line-height:1.15} .cramped > *{margin:0 !important}
  .roomy{padding:30px;line-height:1.55} .roomy > *{margin:0 0 12px !important} .roomy .a1{margin-bottom:6px !important}
  .mixed .a1,.mixed .a2{text-align:center} .mixed .a3{text-align:left} .mixed .a4,.mixed .a6{text-align:right} .mixed .a5{margin-left:auto !important;margin-right:auto !important}
  .one > *{text-align:left}
  #gl{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none}
  .g{position:absolute;top:-6px;bottom:-6px;width:0;border-left:2px dashed #d6336c}
</style>
<script>
  function upd(){
    var ad = document.getElementById('ad');
    ad.className = document.getElementById('al').value + ' ' + document.getElementById('ws').value;
    var base = document.getElementById('wrap').getBoundingClientRect().left, xs = {};
    [].forEach.call(ad.children, function(el){
      var r = document.createRange(); r.selectNodeContents(el);
      var rects = el.tagName === 'BUTTON' ? [el.getBoundingClientRect()] : r.getClientRects();
      if (rects.length) xs[Math.round((rects[0].left - base) / 3) * 3] = 1;
    });
    var keys = Object.keys(xs);
    document.getElementById('gl').innerHTML = document.getElementById('gd').checked ? keys.map(function(x){ return '<div class="g" style="left:' + x + 'px"></div>'; }).join('') : '';
    document.getElementById('ro').textContent = keys.length + ' distinct starting edge' + (keys.length > 1 ? 's' : '') + '.\\n' +
      (keys.length > 2 ? 'Every element starts somewhere different, so the eye has no line to follow and the ad looks accidental.' : 'One clean edge: the eye runs straight down it, and the ad looks deliberate.') + '\\n' +
      (ad.classList.contains('cramped') ? 'Cramped spacing makes even a good product look like a bargain-bin offer.' : 'The room around each element lets every piece breathe; this is what premium brands do.');
  }
  document.addEventListener('change', upd); setTimeout(upd, 30);
<\/script>`
  }],
});


PG.add({
  id:'l072', index:72, udemyId:19655692, minutes:14, section:'s12', slug:'ux-design', kind:'read',
  title:'User Experience (UX) Design',
  blurb:'Good UX is nearly invisible: people simply find it easy to do what they came to do. Five principles: keep it <b>simple</b>, keep look and behaviour <b>consistent</b>, put content where eyes go (the <b>F</b> and <b>Z</b> reading patterns), design for <b>every screen size</b>, and <b>test</b> with real people. And never use dark patterns that trick users into choices that benefit only the company.',
  quiz:[
    { q:'What does good UX feel like to the person using the site?', options:['Impressive and full of animations','Nearly invisible: everything just feels easy','Challenging, so they explore more','Exactly like every other site'], answer:1, why:'Visual design shows; good UX gets out of the way. The campus-path story is about paving the routes people actually walk.' },
    { q:'Which reading pattern suits a text-heavy page, with key content down the left?', options:['The Z pattern','The F pattern','A circle','A diagonal'], answer:1, why:'On dense pages the eye scans across the top, again a little lower, then down the left edge, tracing an F.' },
    { q:'Why does consistency matter so much?', options:['It makes pages load faster','People should not have to relearn the navigation on every page','Search engines require it','It reduces the number of colours'], answer:1, why:'A nav bar that moves or changes style on each page forces users, especially less technical ones, to start over every time.' },
    { q:'Which of these is a dark pattern?', options:['A clearly labelled "No thanks" button','Hiding the "no travel insurance" choice inside a long country list','A progress bar in a checkout','A search box at the top of the page'], answer:1, why:'Dark patterns use design to push people into choices they did not want, here by making the opt-out hard to find.' },
    { q:'What does designing for all platforms mean in practice?', options:['Shrinking the desktop page to fit a phone','Layouts that rearrange for each screen size, with tap-sized targets on phones','A separate site for each device','Avoiding images'], answer:1, why:'A squeezed desktop layout leaves tiny text and links; a responsive one stacks and resizes so it stays usable.' },
  ],
  explore:[
  {
    title:'F and Z reading patterns', height:545,
    note:'Two kinds of page and the route the eye tends to take across each. Put the things that matter on that route.',
    html:`
<div class="knobs">
  <label>page
    <select id="pg"><option value="article">text-heavy article (F pattern)</option><option value="landing">sparse landing page (Z pattern)</option></select>
  </label>
  <label><input type="checkbox" id="path" checked> show the eye path</label>
</div>
<div class="stage" style="padding:0">
  <div id="mock" style="position:relative;height:360px;overflow:hidden;background:#fff"></div>
</div>
<p class="note" id="nt" style="font-size:13px"></p>
<style>
  .bar{background:#dfe3ee;border-radius:3px;height:9px;margin:0 0 9px}
  .dot{position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#d6336c;color:#fff;font:700 12px/22px -apple-system,Helvetica,sans-serif;text-align:center}
</style>
<script>
  var PAGES = {
    article:{
      html:'<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px;border-bottom:1px solid #eef1f9"><b style="font-size:15px">Daily Bulletin</b><span style="font-size:12px;color:#5b6382">News · Sport · Culture</span></div>' +
        '<div style="padding:14px 18px"><div style="font:700 20px Georgia,serif;margin:0 0 10px">Ten things we learned about the new tram line</div>' +
        [100,96,98,60].map(function(w){ return '<div class="bar" style="width:' + w + '%"></div>'; }).join('') +
        '<div style="font:700 15px Georgia,serif;margin:12px 0 8px">What changes for commuters</div>' +
        [92,97,70].map(function(w){ return '<div class="bar" style="width:' + w + '%"></div>'; }).join('') +
        '<ul style="margin:10px 0 0;padding-left:18px;font-size:12px;color:#3c435c;line-height:1.7"><li><b>Fares</b> stay the same until spring</li><li><b>Night trams</b> on Fridays</li><li><b>Bikes</b> allowed off-peak</li></ul></div>',
      pts:[[3,9],[96,9],[3,37],[70,37],[3,37],[3,96]],
      note:'F pattern: a full sweep across the top (logo, headline), a shorter sweep a little lower, then straight down the left edge. Lead every paragraph and bullet with its key words, and keep the logo top left.'
    },
    landing:{
      html:'<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px"><b style="font-size:16px">Pathly</b><button style="background:#1c2030;color:#fff;border:none;border-radius:6px;padding:7px 14px">Sign up</button></div>' +
        '<div style="margin:16px 20px;height:170px;border-radius:12px;background:linear-gradient(135deg,#9ad1d4,#5b9cff);display:flex;align-items:center;justify-content:center;color:#fff;font:700 24px -apple-system,Helvetica,sans-serif">Plan walks your friends will join</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px"><span style="font-size:13px;color:#5b6382">Free for small groups</span><button style="background:#d6336c;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-weight:600">Get started</button></div>',
      pts:[[6,9],[94,9],[6,90],[94,90]],
      note:'Z pattern: top left (logo) to top right (sign up), diagonally across the big visual, then along the bottom to the call to action. Sparse pages with strong images suit it.'
    }
  };
  function upd(){
    var P = PAGES[document.getElementById('pg').value], m = document.getElementById('mock');
    var show = document.getElementById('path').checked;
    var pts = P.pts.map(function(p){ return p[0] + ',' + p[1]; }).join(' ');
    m.innerHTML = P.html + (show ? '<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none"><polyline points="' + pts + '" fill="none" stroke="#d6336c" stroke-width="3" stroke-dasharray="6 4" vector-effect="non-scaling-stroke" opacity=".85"/></svg>' +
      P.pts.map(function(p, i){ return '<div class="dot" style="left:' + p[0] + '%;top:' + p[1] + '%">' + (i + 1) + '</div>'; }).join('') : '');
    document.getElementById('nt').textContent = P.note;
  }
  document.addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Spot the dark patterns', height:675,
    note:'A checkout with four tricks in it. Read it as a customer first, then switch to the honest version and compare.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="dark" checked> dark-pattern version</label>
</div>
<div class="stage"><div id="co"></div></div>
<pre class="readout" id="ro"></pre>
<style>
  #co{max-width:480px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:13.5px;color:#1c2030}
  #co h4{margin:14px 0 6px;font-size:13px;text-transform:none;letter-spacing:0;color:#1c2030}
  #co .n{display:inline-block;width:18px;height:18px;border-radius:50%;background:#d6336c;color:#fff;font-size:11px;line-height:18px;text-align:center;margin-right:6px}
  #co .big{background:#1f9d55;color:#fff;border:none;border-radius:8px;padding:12px 18px;font-size:15px;font-weight:700;width:100%}
  .tiny{display:block;margin-top:6px;font-size:11px;color:#9aa2ba;text-decoration:underline}
  .opt{display:flex;gap:8px;align-items:center;margin:4px 0}
  #co select{font:inherit;padding:4px;max-width:100%}
  .fine{font-size:11px;color:#9aa2ba}
</style>
<script>
  var COUNTRIES = ['Austria','Belgium','Croatia','Denmark','Estonia','Finland','France','Germany','Greece','Ireland','Italy','Latvia','Lithuania','Netherlands','No travel insurance required','Norway','Poland','Portugal','Spain','Sweden'];
  var DARK = '<h4><span class="n">1</span>Delivery</h4><button class="big">Express delivery: £6.99</button><a class="tiny" href="#">continue with standard delivery</a>' +
    '<h4><span class="n">2</span>Travel insurance: choose your country of residence</h4><select><option>Please select…</option>' + COUNTRIES.map(function(c){ return '<option>' + c + '</option>'; }).join('') + '</select>' +
    '<h4><span class="n">3</span>Updates</h4><label class="opt"><input type="checkbox" checked> Untick this box if you would prefer not to miss out on not receiving our offers.</label>' +
    '<h4><span class="n">4</span>Total</h4><b style="font-size:18px">£49.99</b> <span class="fine">+ service fee added at payment</span>';
  var HONEST = '<h4><span class="n">1</span>Delivery</h4><label class="opt"><input type="radio" name="d" checked> Standard: free, 3–5 days</label><label class="opt"><input type="radio" name="d"> Express: £6.99, next day</label>' +
    '<h4><span class="n">2</span>Travel insurance</h4><label class="opt"><input type="radio" name="i" checked> No insurance</label><label class="opt"><input type="radio" name="i"> Add insurance: £12</label>' +
    '<h4><span class="n">3</span>Updates</h4><label class="opt"><input type="checkbox"> Email me offers (unsubscribe any time)</label>' +
    '<h4><span class="n">4</span>Total</h4><b style="font-size:18px">£52.98</b> <span class="fine">including the £2.99 service fee</span>';
  var EXPLAIN =
    '1  Misleading emphasis: the paid option is a big bright button, the free one a faint link.\\n   Honest: two equal choices, the free one selected.\\n' +
    '2  Hidden opt-out: "no insurance" is buried alphabetically in a list of countries.\\n   Honest: a visible yes/no choice.\\n' +
    '3  Confusing double negative, pre-ticked: nobody can tell what ticking does.\\n   Honest: an unticked box in plain words.\\n' +
    '4  Drip pricing: a fee appears only at the very end.\\n   Honest: the full price from the start.';
  function upd(){
    var d = document.getElementById('dark').checked;
    document.getElementById('co').innerHTML = d ? DARK : HONEST;
    document.getElementById('ro').textContent = (d ? 'The tricks in this version:\\n\\n' : 'What the honest version fixes:\\n\\n') + EXPLAIN;
  }
  document.getElementById('dark').addEventListener('change', upd); upd();
<\/script>`
  },
  {
    title:'Squeezed or responsive?', height:560,
    note:'The same page on a narrow screen, two ways. A desktop layout shrunk to fit leaves text and links too small to read or tap; a responsive layout rearranges itself instead.',
    html:`
<div class="knobs">
  <label>screen width <input type="range" id="w" min="320" max="900" value="360"><span class="val" id="wv"></span></label>
  <label>layout <select id="lay"><option value="squeeze">desktop layout, shrunk to fit</option><option value="resp" selected>responsive layout</option></select></label>
</div>
<div class="stage" style="display:flex;justify-content:center">
  <div id="scr" style="border:8px solid #1c2030;border-radius:16px;overflow:hidden;background:#fff;height:330px"></div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  .pgx{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1c2030}
  .pgx .nv{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eef1f9;font-size:15px}
  .pgx .nv span{font-size:14px;color:#3c435c}
  .pgx .hd{padding:16px;font-size:24px;font-weight:700}
  .pgx .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:0 16px 16px}
  .pgx .cols div{background:#eef1f9;border-radius:8px;padding:12px;font-size:15px}
  .pgx.narrow .cols{grid-template-columns:1fr}
  .pgx.narrow .nv span{display:none}
</style>
<script>
  var PAGE = '<div class="nv"><b>Move It</b><span>Home · About · Services · Contact</span></div><div class="hd">Move With Joy</div><div class="cols"><div>Professional movers who pack with care.</div><div>Countrywide service, one team.</div><div>One coordinator from start to finish.</div></div>';
  function upd(){
    var w = +document.getElementById('w').value, lay = document.getElementById('lay').value, scr = document.getElementById('scr');
    document.getElementById('wv').textContent = w + 'px';
    scr.style.width = (w + 16) + 'px';
    if (lay === 'squeeze'){
      var k = w / 960;
      scr.innerHTML = '<div class="pgx" style="width:960px;transform:scale(' + k + ');transform-origin:top left">' + PAGE + '</div>';
      document.getElementById('ro').textContent = 'The 960px desktop layout is scaled to ' + Math.round(k * 100) + '%.\\n' +
        'Body text now renders at about ' + (15 * k).toFixed(1) + 'px and the nav links are ' + Math.round(14 * k * 1.4) + 'px tall: ' + (k < 0.6 ? 'unreadable without zooming, and too small to tap.' : 'still cramped.');
    } else {
      scr.innerHTML = '<div class="pgx' + (w < 600 ? ' narrow' : '') + '">' + PAGE + '</div>';
      document.getElementById('ro').textContent = 'Responsive: the page is laid out for ' + w + 'px.\\n' +
        (w < 600 ? 'Below 600px the three columns stack and the nav links collapse, so the text stays at 15px and everything is easy to tap.' : 'Wide enough for three columns side by side.');
    }
  }
  document.addEventListener('input', upd); document.addEventListener('change', upd); upd();
<\/script>`
  }],
});


PG.add({
  id:'l073', index:73, udemyId:19655710, minutes:18, section:'s12', slug:'web-design-in-practice', kind:'build',
  title:'Web Design in Practice - Let\'s apply what we\'ve learnt!',
  blurb:'In the lecture a hotel site is designed in Canva, three screens long, by applying colour, typography, UI and UX in turn. Here you do the same in code: the HTML of a beach hotel page is finished, and its stylesheet breaks every rule in the module. Redesign it in <code>style.css</code> only.',
  tasks:[
    '<b>Colour.</b> Replace the dozen clashing colours with a small scheme that suits a beach hotel: a dominant colour, a secondary one, a pale background and <b>one</b> accent for the button. Tip: store them once as custom properties (<code>:root { --deep: #0b4f6c; }</code>) and use <code>var(--deep)</code> everywhere. No complementary pairs for text on background.',
    '<b>Typography.</b> Two fonts only. The <code>&lt;head&gt;</code> already loads <b>Cardo</b> (a serif) and <b>Montserrat</b> (a sans-serif): headings in the serif, everything else in the sans, with contrast in weight (a bold name, light body text).',
    '<b>Hierarchy.</b> The hotel name must be the biggest thing on the page (uppercase with wide <code>letter-spacing</code> feels established), the section headings next, the feature titles smaller, the body text a muted grey, and <b>Book your stay</b> the one bright accent.',
    '<b>Alignment.</b> Put the name, tagline and button on one shared left edge, and left-align all three features: no more centre, right and justify mixed together.',
    '<b>Layout and white space.</b> Put the three features side by side with grid or flexbox, give everything generous padding and gaps, and keep paragraphs under about 60 characters per line (<code>max-width: 60ch</code>).',
    '<b>Consistency.</b> Style the contact section with the same fonts and colours, and right-align its heading and details on one edge, as the lecture\'s contact screen does.',
    '<b>UX.</b> Switch to <b>Phone 375</b> and add a media query so the features stack and the contact block returns to the left edge. Then compare with the solution, and try the other moods in the Explore tab.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Tidewater Hotel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <!-- Two fonts you can use: Cardo (serif) and Montserrat (sans-serif) -->
  <link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="hero">
    <h1 class="hotel-name">The Tidewater</h1>
    <p class="tagline">A quiet beach hotel where the sea is your alarm clock.</p>
    <a class="book" href="#contact">Book your stay</a>
  </header>

  <main>
    <section class="features">
      <h2>Why stay with us</h2>
      <div class="feature-list">
        <article class="feature">
          <div class="pic">🛏️</div>
          <h3>Beautiful rooms</h3>
          <p>Every room opens onto a balcony over the dunes, with linen the colour of sand and shutters you can leave open all night.</p>
        </article>
        <article class="feature">
          <div class="pic">🍳</div>
          <h3>Slow breakfasts</h3>
          <p>Fresh bread, local fruit and good coffee served until noon, because nobody on holiday should need an alarm.</p>
        </article>
        <article class="feature">
          <div class="pic">🏊</div>
          <h3>The pool</h3>
          <p>A salt-water pool warmed by the sun, with loungers in the shade of the palms for when the beach gets busy.</p>
        </article>
      </div>
    </section>

    <section class="contact" id="contact">
      <h2>Stay</h2>
      <p>12 Shoreline Road, Saltmarsh Bay</p>
      <p><a href="mailto:hello@tidewater.example">hello@tidewater.example</a></p>
      <p>+44 1632 960123</p>
    </section>
  </main>
</body>
</html>`,
'style.css':`/* This stylesheet breaks every rule in the module:
   clashing colours, five fonts, no hierarchy, mixed alignment, no white space.
   Rewrite it using lectures 69-72. */

body {
  margin: 0;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  background-color: #ff00ff;
  color: #00ff00;
}

.hero {
  background-color: #ff6600;
  text-align: center;
  padding: 5px;
}

.hotel-name {
  font-family: Impact, sans-serif;
  font-size: 22px;
  color: #0000ff;
  text-align: right;
}

.tagline {
  font-family: "Courier New", monospace;
  font-size: 26px;
  color: #ffff00;
  text-align: left;
}

.book {
  font-family: "Times New Roman", serif;
  font-size: 14px;
  color: #ff0000;
  background-color: #00ffff;
  padding: 2px;
}

h2 {
  font-family: Papyrus, fantasy;
  font-size: 30px;
  color: #ff0000;
  text-align: center;
}

.feature {
  background-color: #ffff00;
  color: #ff00ff;
  margin: 2px;
  padding: 2px;
  text-align: justify;
}

.feature:nth-child(2) {
  text-align: right;
  font-family: "Courier New", monospace;
}

.feature:nth-child(3) {
  text-align: center;
  font-size: 20px;
}

.pic {
  font-size: 30px;
}

.contact {
  background-color: #008000;
  color: #ff0000;
  padding: 4px;
  text-align: center;
}

.contact a {
  color: #0000ff;
}
`},
  solution:{
'style.css':`/* ---------- palette and fonts ---------- */
:root {
  --deep: #0b4f6c;      /* dominant: deep sea blue */
  --sea: #20a4b3;       /* secondary: turquoise, for details only */
  --foam: #f4fbfb;      /* pale background */
  --sand: #f6e7cb;      /* warm neutral */
  --accent: #e8743b;    /* the one accent: a coral button */
  --text: #24323a;
  --muted: #5d6b73;

  --serif: "Cardo", Georgia, serif;
  --sans: "Montserrat", "Helvetica Neue", Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--sans);
  font-weight: 400;
  line-height: 1.6;
  color: var(--text);
  background-color: var(--foam);
}

/* ---------- hero: the name is the biggest thing, one left edge ---------- */
.hero {
  min-height: 70vh;
  padding: 4rem 8vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  background: linear-gradient(160deg, #177e8c, var(--deep));
}

.hotel-name {
  font-family: var(--serif);
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.tagline {
  font-size: 1.15rem;
  font-weight: 300;
  max-width: 32ch;
  margin: 0 0 2rem;
}

.book {
  display: inline-block;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  background-color: var(--accent);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-decoration: none;
}

/* ---------- sections ---------- */
main {
  padding: 0 8vw;
}

h2 {
  font-family: var(--serif);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--deep);
  margin: 0 0 1.5rem;
}

.features {
  padding: 4rem 0;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.pic {
  width: 6rem;
  height: 6rem;
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.6rem;
  border-radius: 50%;
  border: 3px solid var(--sea);
  background-color: var(--sand);
}

.feature h3 {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--deep);
  margin: 0 0 0.5rem;
}

.feature p {
  max-width: 60ch;
  margin: 0;
  color: var(--muted);
}

/* ---------- contact: same fonts and colours, one right edge ---------- */
.contact {
  padding: 4rem 0 5rem;
  border-top: 1px solid #d5e6e8;
  text-align: right;
}

.contact p {
  margin: 0.25rem 0;
  color: var(--muted);
}

.contact a {
  color: var(--deep);
}

/* ---------- phones ---------- */
@media (max-width: 700px) {
  .hotel-name {
    font-size: 2.8rem;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }

  .contact {
    text-align: left;
  }
}
`},
  quiz:[
    { q:'Why reuse the same fonts, colours and shapes on every screen of the design?', options:['It loads faster','Consistency makes the screens feel like one site, so visitors never have to readjust','Canva requires it','To save time only'], answer:1, why:'The contact screen in the lecture copies the heading style and shape language from the first two screens for exactly this reason.' },
    { q:'Why set body text in a muted grey under dark headings?', options:['Grey is easier to print','It keeps the hierarchy clear: headings first, details second','Black text is not allowed','It looks more modern, nothing else'], answer:1, why:'Lower contrast tells the eye the text is supporting detail, so it does not compete with the headings.' },
    { q:'What can a site published straight from Canva not do?', options:['Show images','Adapt properly to phones or run real functionality','Use more than one page','Use colour'], answer:1, why:'It is a quick way to visualise and share a design for feedback; the real, responsive site still has to be built in code.' },
  ],
  explore:[{
    title:'One page, three moods', height:660,
    note:'The same HTML with three sets of colours and fonts. The lecture\'s homework is to design a hotel in a different style from the beach one: this is how far palette and type alone can move the mood.',
    html:`
<link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,700;1,700&family=Lato:wght@300;400;700&family=Roboto+Slab:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<div class="knobs">
  <label>mood
    <select id="th">
      <option value="beach">modern beach hotel</option>
      <option value="grand">historic grand hotel</option>
      <option value="lodge">mountain lodge</option>
    </select>
  </label>
</div>
<div class="stage" style="padding:0">
  <div id="ht">
    <div class="h-hero"><div class="h-name" id="nm"></div><div class="h-tag" id="tg"></div><span class="h-btn">Book your stay</span></div>
    <div class="h-feats" id="ft"></div>
    <div class="h-contact"><div class="h-h2">Stay</div><div class="h-p">12 Shoreline Road · hello@hotel.example</div></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
<style>
  #ht{background:var(--bg);color:var(--text);font-family:var(--sans)}
  .h-hero{padding:34px 34px 30px;background:linear-gradient(160deg,var(--h1),var(--h2));color:#fff}
  .h-name{font-family:var(--serif);font-size:38px;font-weight:700;line-height:1.05;text-transform:var(--case);letter-spacing:var(--ls);font-style:var(--fs)}
  .h-tag{font-weight:300;margin:8px 0 18px;font-size:14px;opacity:.95}
  .h-btn{display:inline-block;background:var(--accent);color:var(--btn);padding:9px 18px;border-radius:var(--radius);font-weight:600;font-size:13px;letter-spacing:.04em}
  .h-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:26px 34px}
  .h-pic{width:62px;height:62px;border-radius:var(--pic);display:flex;align-items:center;justify-content:center;font-size:28px;background:var(--soft);border:3px solid var(--line);margin-bottom:10px}
  .h-ft{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--h2)}
  .h-fp{font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.5}
  .h-contact{padding:16px 34px 26px;text-align:right;border-top:1px solid var(--soft)}
  .h-h2{font-family:var(--serif);font-size:24px;font-weight:700;color:var(--h2)}
  .h-p{font-size:12.5px;color:var(--muted)}
</style>
<script>
  var T = {
    beach:{ name:'The Tidewater', tag:'A quiet beach hotel where the sea is your alarm clock.', pics:['🛏️','🍳','🏊'], feats:['Rooms','Breakfast','Pool'],
      mood:'fresh and modern: analogous sea blues, one coral accent, a serif name in spaced capitals, pill buttons, round frames',
      v:{ '--bg':'#f4fbfb','--text':'#24323a','--muted':'#5d6b73','--h1':'#177e8c','--h2':'#0b4f6c','--accent':'#e8743b','--btn':'#fff','--soft':'#f6e7cb','--line':'#20a4b3',
          '--serif':'"Cardo", Georgia, serif','--sans':'"Montserrat", Arial, sans-serif','--case':'uppercase','--ls':'.12em','--fs':'normal','--radius':'999px','--pic':'50%' } },
    grand:{ name:'The Ashcombe', tag:'Chandeliers, afternoon tea and a century of good manners.', pics:['🛏️','🫖','🎻'], feats:['Suites','Afternoon tea','Ballroom'],
      mood:'traditional and decadent: burgundy with gold, a high-contrast italic serif, square corners',
      v:{ '--bg':'#fbf7f0','--text':'#2b1d1d','--muted':'#6b5a55','--h1':'#5a1a28','--h2':'#2b0b12','--accent':'#c9a227','--btn':'#2b0b12','--soft':'#efe3cf','--line':'#c9a227',
          '--serif':'"Playfair Display", Georgia, serif','--sans':'"Lato", Arial, sans-serif','--case':'none','--ls':'0','--fs':'italic','--radius':'2px','--pic':'4px' } },
    lodge:{ name:'Pinecrest Lodge', tag:'Log fires, long walks and boots by the door.', pics:['🛏️','🔥','🥾'], feats:['Cabins','Fireside','Trails'],
      mood:'warm and outdoorsy: forest green with an amber accent, a sturdy slab serif, softly rounded corners',
      v:{ '--bg':'#f3f1ec','--text':'#23302a','--muted':'#5e6a63','--h1':'#3d5a48','--h2':'#1d2e24','--accent':'#d9822b','--btn':'#fff','--soft':'#e6dfd2','--line':'#8a6a4a',
          '--serif':'"Roboto Slab", Rockwell, serif','--sans':'"Open Sans", Arial, sans-serif','--case':'none','--ls':'.02em','--fs':'normal','--radius':'6px','--pic':'12px' } }
  };
  function upd(){
    var t = T[document.getElementById('th').value], ht = document.getElementById('ht');
    Object.keys(t.v).forEach(function(k){ ht.style.setProperty(k, t.v[k]); });
    document.getElementById('nm').textContent = t.name;
    document.getElementById('tg').textContent = t.tag;
    document.getElementById('ft').innerHTML = t.feats.map(function(f, i){ return '<div><div class="h-pic">' + t.pics[i] + '</div><div class="h-ft">' + f + '</div><div class="h-fp">A short line about it, in the muted body colour.</div></div>'; }).join('');
    document.getElementById('ro').textContent = 'palette   dominant ' + t.v['--h2'] + '  ·  accent ' + t.v['--accent'] + '  ·  background ' + t.v['--bg'] + '\\n' +
      'fonts     ' + t.v['--serif'].split(',')[0] + ' for headings  ·  ' + t.v['--sans'].split(',')[0] + ' for text\\n' +
      'mood      ' + t.mood;
  }
  document.getElementById('th').addEventListener('change', upd); upd();
<\/script>`
  }],
  notes:`
    <h3>Keep practising</h3>
    <ul>
      <li><a href="https://www.dailyui.co/" target="_blank" rel="noopener">Daily UI</a>: a free design prompt every day for 100 days.</li>
      <li><a href="https://collectui.com/" target="_blank" rel="noopener">Collect UI</a>: other designers' answers to the same prompts, for inspiration.</li>
      <li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a>: the free tool the lecture designs in (custom size 1400 × 800 px per screen).</li>
    </ul>
    <h3>The lecture's homework</h3>
    <p>Design your own three-screen hotel site (title, features, contact) in a different style from the beach one, for example a traditional, decadent historic hotel, and check it against every principle: colour mood, two fonts with contrast, hierarchy, alignment, white space and audience.</p>`
});
