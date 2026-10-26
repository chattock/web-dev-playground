/* ===== Section 13 — Capstone Project 2: Personal Site ===== */

PG.add({
  id:'l074', index:74, udemyId:37331054, minutes:2, section:'s13', slug:'personal-site', kind:'build', project:true,
  title:'Instructions',
  blurb:'Capstone 2: a personal portfolio site built with <b>HTML and CSS only</b>, with no JavaScript, no solution video and no design to copy, so the result is genuinely yours. It needs a hero introducing you, a résumé, your projects, an about-me section and a way to contact you, written in semantic HTML, responsive on every screen, with meaningful alt text on every image.',
  tasks:[
    'Plan before you type (the brief suggests about an hour): collect your content, then sketch each section on paper. The scaffold already has the semantic skeleton the brief asks for: <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, five <code>&lt;section&gt;</code>s and a <code>&lt;footer&gt;</code>.',
    'Header: your name as a link to <code>#top</code> and a <code>&lt;nav&gt;</code> whose links jump to <code>#resume</code>, <code>#projects</code>, <code>#about</code> and <code>#contact</code>. Use flexbox to put the name on the left and the links on the right.',
    'Hero: an <code>&lt;h1&gt;</code> with your name (the only h1 on the page), a one-line pitch, a photo with alt text that says what it shows, and a link to <code>#contact</code>. Put the text and the photo side by side with grid or flexbox.',
    'Résumé: education, experience and skills, as <code>&lt;h3&gt;</code> headings and lists. Link to your Capstone 1 résumé page if you built one.',
    'Projects: at least three <code>&lt;article&gt;</code> cards, each with an image and alt text, a title, one sentence and a link. Lay them out with <code>grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))</code>, which changes the number of columns without a media query.',
    'About and contact: a short paragraph about your interests, then ways to reach you: a <code>mailto:</code> link, GitHub, LinkedIn. No <code>&lt;script&gt;</code> anywhere.',
    'Check it the way the brief asks: at <b>Phone 375</b> nothing scrolls sideways, there is one <code>&lt;h1&gt;</code> and every image has alt text. Run the checklist in the Explore tab, paste your HTML into the <a href="https://validator.w3.org/#validate_by_input" target="_blank" rel="noopener">W3C validator</a>, and look at the course\'s <a href="https://appbrewery.github.io/capstone-2-example/" target="_blank" rel="noopener">example site</a> for inspiration.'
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Name · Web Developer</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="site-header">
    <!-- TODO 2: your name as a link to #top, then a <nav> with a list of links
         to #resume, #projects, #about and #contact -->
  </header>

  <main id="top">
    <section class="hero">
      <!-- TODO 3: an <h1> with your name, a one-line pitch, a photo with real
           alt text and a link to #contact.
           Placeholder photo: https://picsum.photos/seed/portrait/400/400 -->
    </section>

    <section id="resume">
      <h2>Résumé</h2>
      <!-- TODO 4: experience, education and skills (h3 headings and lists) -->
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <!-- TODO 5: three or more <article> cards: image + alt, title, sentence, link.
           Placeholder images: https://picsum.photos/seed/project1/600/400 (change the seed for each) -->
    </section>

    <section id="about">
      <h2>About me</h2>
      <!-- TODO 6: what you enjoy when you are not coding -->
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <!-- TODO 6: email (mailto:), GitHub, LinkedIn... -->
    </section>
  </main>

  <footer class="site-footer">
    <!-- your name and the year -->
  </footer>
</body>
</html>`,
'style.css':`/* ===== Capstone 2: your personal site =====
   Keep the rules in the same order as the page. */

/* --- Base --- */
:root {
  /* TODO: your palette (a dominant colour, a neutral and one accent) and two fonts */
  --bg: #fbfaf7;
  --text: #1f2933;
  --muted: #5b6670;
  --accent: #0b6e4f;
  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: "Helvetica Neue", Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--text);
  background-color: var(--bg);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

section {
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

/* --- Header and nav --- */
/* TODO 2: name on the left, links on the right */

/* --- Hero --- */
/* TODO 3: text and photo side by side */

/* --- Résumé --- */
/* TODO 4 */

/* --- Projects --- */
/* TODO 5: a responsive grid of cards */

/* --- About and contact --- */
/* TODO 6 */

/* --- Footer --- */

/* --- Small screens --- */
/* TODO 7: @media (max-width: 700px) { ... } */
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Robin Ellis · Front-end developer</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="site-header">
    <a class="logo" href="#top">Robin Ellis</a>
    <nav>
      <ul class="nav-links">
        <li><a href="#resume">Résumé</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="top">
    <section class="hero">
      <div class="hero-text">
        <p class="kicker">Front-end developer</p>
        <h1>Hi, I'm Robin. I build fast, friendly websites.</h1>
        <p class="lead">I turn designs into clean, responsive HTML and CSS, and I am learning JavaScript one project at a time.</p>
        <a class="button" href="#contact">Get in touch</a>
      </div>
      <!-- placeholder image: swap in a photo of you and describe it in the alt text -->
      <img class="portrait" src="https://picsum.photos/seed/portrait/400/400"
        alt="Robin Ellis smiling at a desk by a window" width="400" height="400" />
    </section>

    <section id="resume">
      <h2>Résumé</h2>
      <div class="resume-grid">
        <div>
          <h3>Experience</h3>
          <ul class="timeline">
            <li><b>Junior web developer</b>, Harbour Digital <span>2026 to now</span></li>
            <li><b>Volunteer web editor</b>, Riverside Food Bank <span>2024 to 2026</span></li>
          </ul>
          <h3>Education</h3>
          <ul class="timeline">
            <li><b>Full-stack web development bootcamp</b>, online <span>2026</span></li>
            <li><b>BA Geography</b>, University of Northbridge <span>2021 to 2024</span></li>
          </ul>
          <p><a href="#">Read my full résumé</a></p>
        </div>
        <div>
          <h3>Skills</h3>
          <ul class="skills">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>Flexbox</li>
            <li>CSS Grid</li>
            <li>Bootstrap</li>
            <li>Responsive design</li>
            <li>Git and GitHub</li>
            <li>JavaScript (learning)</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <!-- the picsum images stand in for real screenshots; each alt text describes the screenshot it replaces -->
      <div class="project-grid">
        <article class="project">
          <img src="https://picsum.photos/seed/project1/600/400" alt="The TinDog landing page: a gradient hero with a phone screenshot" width="600" height="400" />
          <h3>TinDog</h3>
          <p>A responsive startup landing page assembled from Bootstrap components.</p>
          <a href="#">View the project</a>
        </article>
        <article class="project">
          <img src="https://picsum.photos/seed/project2/600/400" alt="A Mondrian painting of red, blue and yellow blocks recreated in CSS" width="600" height="400" />
          <h3>Mondrian in CSS Grid</h3>
          <p>A Piet Mondrian composition rebuilt to scale with grid tracks and gaps.</p>
          <a href="#">View the project</a>
        </article>
        <article class="project">
          <img src="https://picsum.photos/seed/project3/600/400" alt="Three pricing cards side by side, the middle one highlighted" width="600" height="400" />
          <h3>Pricing table</h3>
          <p>Three plans that share the width with flexbox and stack neatly on phones.</p>
          <a href="#">View the project</a>
        </article>
      </div>
    </section>

    <section id="about">
      <h2>About me</h2>
      <p>Before I wrote code I drew maps, and I still love making information easy to find. When I am not at a keyboard you will find me cycling the coast road, baking bread that is never quite as good as last week's, or volunteering at the food bank whose website I rebuilt.</p>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p>I am looking for my first front-end role. Email is the quickest way to reach me.</p>
      <ul class="contact-links">
        <li><a href="mailto:robin@example.com">robin@example.com</a></li>
        <li><a href="https://github.com/" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></li>
      </ul>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 Robin Ellis. Built with HTML and CSS.</p>
  </footer>
</body>
</html>`,
'style.css':`/* ===== Capstone 2: personal site =====
   Rules in the same order as the page. */

/* --- Base --- */
:root {
  --bg: #fbfaf7;
  --surface: #ffffff;
  --text: #1f2933;
  --muted: #5b6670;
  --line: #e4e2dc;
  --accent: #0b6e4f;
  --accent-soft: #e3f2ec;
  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: "Helvetica Neue", Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--text);
  background-color: var(--bg);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--accent);
}

section {
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  line-height: 1.2;
}

h2 {
  font-size: 2rem;
  margin: 0 0 1.5rem;
}

h3 {
  font-size: 1.15rem;
  margin: 1.5rem 0 0.5rem;
}

/* --- Header and nav --- */
.site-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--muted);
  font-weight: 600;
  text-decoration: none;
}

.nav-links a:hover {
  color: var(--accent);
}

/* --- Hero --- */
.hero {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 3rem;
  align-items: center;
  padding-top: 2rem;
}

.kicker {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.hero h1 {
  font-size: 2.6rem;
  margin: 0.5rem 0 1rem;
}

.lead {
  max-width: 45ch;
  margin: 0 0 2rem;
  font-size: 1.15rem;
  color: var(--muted);
}

.button {
  display: inline-block;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  background-color: var(--accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.portrait {
  border-radius: 50%;
  border: 6px solid var(--surface);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* --- Résumé --- */
.resume-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.resume-grid h3:first-child {
  margin-top: 0;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline li {
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--line);
}

.timeline span {
  display: block;
  font-size: 0.9rem;
  color: var(--muted);
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.skills li {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background-color: var(--accent-soft);
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 600;
}

/* --- Projects --- */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.project {
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.project h3 {
  margin: 1rem 1.25rem 0.25rem;
}

.project p {
  margin: 0 1.25rem 0.75rem;
  color: var(--muted);
}

.project a {
  display: inline-block;
  margin: 0 1.25rem 1.25rem;
  font-weight: 700;
}

/* --- About and contact --- */
#about p {
  max-width: 60ch;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact-links a {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--accent);
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

/* --- Footer --- */
.site-footer {
  padding: 2rem 1.5rem;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--muted);
}

/* --- Small screens --- */
@media (max-width: 700px) {
  .hero,
  .resume-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    gap: 2rem;
  }

  .portrait {
    order: -1;
    max-width: 220px;
  }

  .hero h1 {
    font-size: 2rem;
  }
}
`},
  quiz:[
    { q:'Which of these does the Capstone 2 brief rule out?', options:['Media queries','Images','JavaScript','Google Fonts'], answer:2, why:'The deliverables are one HTML file, one CSS file and your images. The capstone tests HTML and CSS on their own.' },
    { q:'Why use <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code> and <code>&lt;footer&gt;</code> rather than only <code>&lt;div&gt;</code>s?', options:['They are styled automatically','They describe the structure of the page to browsers, search engines and screen readers','Divs are deprecated','They load faster'], answer:1, why:'A div says nothing about its content; semantic elements tell machines which part is navigation, which is the main content and so on.' },
    { q:'What makes alt text meaningful?', options:['The image\'s file name','The word "image"','A short description of what the picture shows or what it is for','Keywords repeated for search engines'], answer:2, why:'Screen-reader users hear the alt text instead of seeing the picture, so it should carry the same information.' },
  ],
  explore:[{
    title:'Brief checklist', height:620,
    note:'Checks the code in your Build tab against the brief. It runs when you open this tab; press the button after more edits.',
    html:`
<div class="knobs"><button id="run">Check my site again</button><span id="src" style="font-size:12px;color:#5b6382"></span></div>
<div class="stage"><ul id="list"></ul><p id="sum" style="margin:10px 0 0;font-weight:700"></p></div>
<p class="note">These are the brief's checkable rules. The rest (a design you are proud of, content that sounds like you, testing on real devices) is up to you.</p>
<style>
  #list{list-style:none;margin:0;padding:0}
  #list li{padding:7px 0;border-bottom:1px solid #eef1f9;font-size:13.5px}
  #list .ok{color:#1d8a4a;font-weight:700;margin-right:6px}
  #list .no{color:#c0392b;font-weight:700;margin-right:6px}
  #list .hint{display:block;margin-left:22px;color:#5b6382;font-size:12.5px}
</style>
<script>
  function getFiles(){
    var files = {}, how = '';
    try {
      [].forEach.call(parent.document.querySelectorAll('[data-ed]'), function(el){
        var w = el.querySelector('.CodeMirror');
        if (w && w.CodeMirror) files[el.getAttribute('data-ed')] = w.CodeMirror.getValue();
      });
      if (files['index.html'] != null) how = 'Checked: the code in your Build tab.';
    } catch (e) {}
    if (files['index.html'] == null){
      try { var saved = JSON.parse(parent.localStorage.getItem('wdplay:code:l074') || 'null'); if (saved && saved['index.html']){ files = saved; how = 'Checked: your last saved code.'; } } catch (e) {}
    }
    return { files: files, how: how || 'Could not read your code: open the Build tab once, then come back.' };
  }
  var CHECKS = [
    ['Semantic layout: header, nav, main and footer', function(d){ return ['header','nav','main','footer'].every(function(t){ return d.querySelector(t); }); }, 'Use these elements for the page frame; the scaffold already has most of them.'],
    ['A section each for resume, projects, about and contact', function(d){ return ['resume','projects','about','contact'].every(function(id){ var e = d.getElementById(id); return e && e.tagName === 'SECTION'; }); }, 'Each part of the brief gets its own section with that id, so the nav can jump to it.'],
    ['The nav links to all four sections', function(d){ var h = [].map.call(d.querySelectorAll('nav a'), function(a){ return a.getAttribute('href'); }); return ['#resume','#projects','#about','#contact'].every(function(x){ return h.indexOf(x) >= 0; }); }, 'Links such as href="#projects" inside the nav.'],
    ['A hero first in main, holding the one and only h1', function(d){ var s = d.querySelector('main section'); return d.querySelectorAll('h1').length === 1 && s && s.querySelector('h1'); }, 'Your name as the page title, in the first section of main.'],
    ['Headings never skip a level', function(d){ var last = 0, ok = true; [].forEach.call(d.querySelectorAll('h1,h2,h3,h4,h5,h6'), function(h){ var n = +h.tagName.charAt(1); if (last && n > last + 1) ok = false; last = n; }); return ok && last > 0; }, 'Go h1, then h2, then h3, without jumping straight from h1 to h3.'],
    ['Images exist and every one has alt text', function(d){ var im = d.querySelectorAll('img'); return im.length > 0 && [].every.call(im, function(i){ return (i.getAttribute('alt') || '').trim().length > 3; }); }, 'Describe what each picture shows, in a few words.'],
    ['At least three project cards (article) in the projects section', function(d){ return d.querySelectorAll('#projects article').length >= 3; }, 'One article per project: image, title, a sentence, a link.'],
    ['A mailto: link in the contact section', function(d){ return !!d.querySelector('#contact a[href^="mailto:"]'); }, 'For example href="mailto:you@example.com".'],
    ['The viewport meta tag is present', function(d){ return !!d.querySelector('meta[name="viewport"]'); }, 'Without it, phones show a zoomed-out desktop page.'],
    ['No JavaScript', function(d){ if (d.querySelector('script')) return false; return ![].some.call(d.querySelectorAll('*'), function(el){ return [].some.call(el.attributes, function(a){ return /^on/i.test(a.name); }); }); }, 'This capstone is HTML and CSS only: no script tags, no onclick attributes.'],
    ['The CSS uses flexbox or grid', function(d, css){ return /display\\s*:\\s*(inline-)?(flex|grid)/i.test(css); }, 'Lay out the header, the hero and the project cards with display: flex or display: grid.'],
    ['The CSS has a media query for small screens', function(d, css){ return /@media/i.test(css); }, 'Add @media (max-width: ...) rules and test at Phone 375.']
  ];
  function esc(s){ return String(s).replace(/[&<>]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); }
  function run(){
    var g = getFiles(), html = g.files['index.html'] || '', css = (g.files['style.css'] || '').replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');   /* ignore CSS comments */
    var d = new DOMParser().parseFromString(html, 'text/html');
    var passed = 0;
    document.getElementById('list').innerHTML = CHECKS.map(function(c){
      var ok = false; try { ok = !!c[1](d, css); } catch (e) {}
      if (ok) passed++;
      return '<li><span class="' + (ok ? 'ok' : 'no') + '">' + (ok ? '&#10003;' : '&#10007;') + '</span>' + esc(c[0]) + (ok ? '' : '<span class="hint">' + esc(c[2]) + '</span>') + '</li>';
    }).join('');
    document.getElementById('sum').textContent = passed + ' of ' + CHECKS.length + ' checks pass' + (passed === CHECKS.length ? ': ready to share for feedback.' : '.');
    document.getElementById('src').textContent = g.how;
  }
  document.getElementById('run').onclick = run;
  try { var tb = parent.document.querySelector('.tabs button[data-tab="explore"]'); if (tb) tb.addEventListener('click', function(){ setTimeout(run, 50); }); } catch (e) {}
  run();
<\/script>`
  }],
  notes:`
    <h3>A five-hour plan (from the brief)</h3>
    <ol>
      <li><b>Hour 1:</b> gather content and ideas, sketch wireframes.</li>
      <li><b>Hours 2–3:</b> write the HTML and CSS, testing in more than one browser and at phone size.</li>
      <li><b>Hour 4:</b> polish the design and the words, then tidy and optimise.</li>
      <li><b>Hour 5:</b> publish it (GitHub Pages from lecture 29 works), share it for feedback and make final tweaks.</li>
    </ol>
    <h3>Why there is no walkthrough</h3>
    <p>Capstones are meant to be your own work, so you can show them to employers. Getting stuck is part of it: it tells you exactly which earlier lecture to revisit. The solution here is just one possible site, there to unblock you, not to copy.</p>`
});
