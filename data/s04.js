/* ===== Section 4 — Multi-Page Websites ===== */
/* Wrapped in a function so the helper names below stay local to this file.
   The Build preview can only show index.html, so multi-page lessons get a
   "Your site" demo (SITE below) that renders the learner's own files and
   follows links between them. */
(function () {

/* Demo scripts are real functions, stringified into the demo iframe. */
const script = (fn, cfg) => '<script>(' + fn + ')(' + JSON.stringify(cfg || {}).replace(/</g, '\\u003c') + ');<\/script>';

/* Explore iframes share the playground's origin, so a demo can read the code
   the learner typed in the Build tab (saved under wdplay:code:<lesson id>). */
function READER(cfg) {
  var KEY = 'wdplay:code:' + cfg.id;
  window.readFiles = function (which) {
    var f = {}, k;
    for (k in cfg.starter) f[k] = cfg.starter[k];
    if (which === 'solution') { for (k in cfg.solution) f[k] = cfg.solution[k]; return f; }
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) for (k in s) f[k] = s[k]; } catch (e) {}
    return f;
  };
  window.watchFiles = function (cb, which) {
    var last = null;
    function tick() {
      var f = window.readFiles(typeof which === 'function' ? which() : which), key = JSON.stringify(f);
      if (key !== last) { last = key; cb(f); }
    }
    tick(); setInterval(tick, 700);
    return tick;
  };
}
const reader = l => script(READER, { id: l.id, starter: l.files, solution: l.solution });

/* ---------- a live checklist of the brief ---------- */
function CHECK(cfg) {
  var box = document.getElementById('checks'), ro = document.getElementById('ck-ro'), which = document.getElementById('ck-which');
  function parse(h) { return new DOMParser().parseFromString(h || '', 'text/html'); }
  var rules = cfg.rules.map(function (r) {
    var fn; try { fn = new Function('doc', 'html', 'files', 'parse', r.test); } catch (e) { fn = function () { return false; }; }
    return { desc: r.desc, fn: fn, file: r.file || 'index.html' };
  });
  var tick = window.watchFiles(function (f) {
    var docs = {}, n = 0;
    box.innerHTML = rules.map(function (r) {
      var html = f[r.file] || '', doc = docs[r.file] || (docs[r.file] = parse(html)), ok = false;
      try { ok = !!r.fn(doc, html, f, parse); } catch (e) {}
      if (ok) n++;
      return '<div class="ck' + (ok ? ' ok' : '') + '"><span class="tk">' + (ok ? '✓' : '○') + '</span><span>' + r.desc + '</span></div>';
    }).join('');
    ro.textContent = n + ' of ' + rules.length + ' checks pass' + (n === rules.length ? '. Every requirement is met.' : '. They update as you type in the Build tab.');
  }, function () { return which.value; });
  which.addEventListener('change', tick);
}
const CHECK_MARKUP = `
<style>
  .ck{display:flex;gap:8px;padding:6px 10px;border-radius:7px;margin:3px 0;font-size:13px;color:#5b6382;background:#fff;border:1px solid #e6e9f2}
  .ck.ok{background:#e9f8ef;border-color:#bfe8cf;color:#14532d}
  .ck .tk{width:16px;font-weight:700;flex:none}
  .ck code{font-size:12px}
</style>
<div class="knobs">
  <label>checking <select id="ck-which"><option value="mine">my code</option><option value="solution">the solution</option></select></label>
  <span style="font-size:12px;color:#5b6382">reads what you typed in the Build tab</span>
</div>
<div id="checks"></div>
<pre class="readout" id="ck-ro" style="margin-top:10px;white-space:pre-wrap"></pre>`;
const checklist = (l, rules, title, note, height) => ({
  title, note, height: height || 120 + rules.length * 36,
  html: CHECK_MARKUP + reader(l) + script(CHECK, { rules }),
});
const DOCTYPE_FIRST = "return /^\\s*<!doctype html>/i.test(html);";
const NO_SKIPS = "var last = 0, ok = true; doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) { var n = +h.tagName.charAt(1); if (n > last + 1) ok = false; last = n; }); return ok && last > 0;";
const linksTo = (re) => "return [].some.call(doc.querySelectorAll('a[href]'), function (a) { return " + re + ".test(a.getAttribute('href').trim()); });";

/* ---------- "Your site": the learner's files in a mini browser ----------
   Pages come from the Build tab; pictures resolve against the playground's
   own folder, so ./assets/paths/dog.png is a real file. Links between pages
   are followed with the same rules as a browser on your own computer. */
function SITE(cfg) {
  var $ = function (id) { return document.getElementById(id); };
  var frame = $('site'), which = $('which'), ROOT = document.baseURI;
  var page = cfg.start, hist = [], hi = -1;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function files() { return window.readFiles(which.value); }
  function resolve(from, href) {
    href = String(href == null ? '' : href).trim();
    if (!href || href.charAt(0) === '#') return { kind: 'hash' };
    if (/^[a-z][a-z0-9+.\-]*:/i.test(href) || href.indexOf('//') === 0) return { kind: 'external' };
    var clean = href.split('#')[0].split('?')[0];
    if (clean.charAt(0) === '/') return { kind: 'root' };
    var parts = from.split('/').slice(0, -1).concat(clean.split('/')), out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p === '' || p === '.') continue;
      if (p === '..') { if (!out.length) return { kind: 'above' }; out.pop(); }
      else out.push(p);
    }
    var path = out.join('/');
    if (!path || /\/$/.test(clean)) path = (path ? path + '/' : '') + 'index.html';
    return { kind: 'path', path: path };
  }
  function explain(from, href) {
    var dir = from.split('/').slice(0, -1).join('/');
    var steps = ['start in ' + (dir ? dir + '/' : 'the project folder')];
    href.split('#')[0].split('/').forEach(function (p) {
      if (p === '.') steps.push('./ stay here');
      else if (p === '..') steps.push('../ up one folder');
      else if (p && p.indexOf('.') > -1) steps.push('open ' + p);
      else if (p) steps.push('into ' + p + '/');
    });
    return steps.join(' → ');
  }
  function missing(label, why) {
    return '<!DOCTYPE html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#3c4043;padding:34px 28px">' +
      '<div style="font-size:40px">📄</div><h2 style="font-weight:500;margin:8px 0 12px">This file couldn\'t be found</h2>' +
      '<p>There is no file at <code style="background:#f1f3f4;padding:2px 6px;border-radius:4px">' + esc(label) + '</code></p>' +
      '<p style="color:#5f6368">' + why + '</p><p style="color:#9aa0a6;font-size:12px">ERR_FILE_NOT_FOUND</p></body></html>';
  }
  var INTERCEPT = "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;" +
    "var h=a.getAttribute('href')||'';if(!h||h.charAt(0)==='#'||/^[a-z][a-z0-9+.-]*:/i.test(h)||h.indexOf('//')===0)return;" +
    "e.preventDefault();parent.postMessage({__site:1,href:h},'*');});";
  function render(path, push, why) {
    var f = files(), html = f[path], found = html != null;
    if (push) { hist = hist.slice(0, hi + 1); hist.push(path); hi = hist.length - 1; }
    page = path;
    $('addr').textContent = cfg.origin + path;
    var doc = new DOMParser().parseFromString(found ? html : missing(path, why || 'Check the spelling, and which folder each file is in.'), 'text/html');
    if (found) {
      [].forEach.call(doc.querySelectorAll('img[src]'), function (img) {
        var r = resolve(path, img.getAttribute('src'));
        if (r.kind === 'external') return;
        img.setAttribute('src', r.kind === 'path' && f[r.path] == null ? new URL(r.path, ROOT).href : 'data:,');
      });
      [].forEach.call(doc.querySelectorAll('a[href]'), function (a) {
        if (resolve(path, a.getAttribute('href')).kind === 'external') { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
      });
    }
    var s = doc.createElement('script'); s.textContent = INTERCEPT; doc.head.appendChild(s);
    frame.srcdoc = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    $('back').disabled = hi <= 0; $('fwd').disabled = hi >= hist.length - 1;
    var names = Object.keys(f).filter(function (n) { return /\.html?$/i.test(n); })
      .sort(function (a, b) { return (a.split('/').length - b.split('/').length) || (a < b ? -1 : 1); });
    $('files').innerHTML = names.map(function (n) {
      return '<div class="fl' + (n === page ? ' on' : '') + '" data-p="' + esc(n) + '">📄 ' + esc(n) + '</div>';
    }).join('') + (cfg.extra || []).map(function (n) { return '<div class="fl pic">🖼️ ' + esc(n) + '</div>'; }).join('');
  }
  window.addEventListener('message', function (e) {
    if (!e.data || !e.data.__site || e.source !== frame.contentWindow) return;
    var href = e.data.href, r = resolve(page, href), f = files();
    var lines = ['on page      ' + page, 'you clicked  ' + href, 'which means  ' + explain(page, href)];
    if (r.kind === 'path') {
      lines.push('arrives at   ' + r.path + (f[r.path] != null ? '   ✓ found' : '   ✗ no such file'));
      render(r.path, true);
    } else if (r.kind === 'above') {
      lines.push('arrives at   somewhere above the project folder   ✗ there are no project files up there');
      render(href, true, 'The ../ climbs out of the project folder altogether.');
    } else {
      lines.push('arrives at   the root of the whole disk (a leading / starts there)   ✗ not your project');
      render(href, true, 'A path starting with / starts at the root of the disk, not at your project folder.');
    }
    $('ro').textContent = lines.join('\n');
  });
  $('back').addEventListener('click', function () { if (hi > 0) { hi--; render(hist[hi], false); } });
  $('fwd').addEventListener('click', function () { if (hi < hist.length - 1) { hi++; render(hist[hi], false); } });
  $('home').addEventListener('click', function () { render(cfg.start, true); $('ro').textContent = 'Back to the home page, ' + cfg.start + '.'; });
  $('files').addEventListener('click', function (e) {
    var el = e.target.closest('.fl[data-p]'); if (!el) return;
    render(el.getAttribute('data-p'), true);
    $('ro').textContent = 'Opened ' + el.getAttribute('data-p') + ' directly, as if you double-clicked it in your file browser.';
  });
  which.addEventListener('change', function () { hist = []; hi = -1; render(cfg.start, true); });
  $('ro').textContent = 'This is your project as a browser on your computer would show it. Click the links in your page: they are followed between your files, and a wrong path ends at "file not found".';
  var first = true;
  window.watchFiles(function () { render(page, first); first = false; }, function () { return which.value; });
}
const SITE_MARKUP = `
<style>
  .bar{display:flex;gap:6px;align-items:center;background:#fff;border:1px solid #dfe3ee;border-radius:10px 10px 0 0;padding:6px 8px}
  .bar button{font:inherit;font-size:12px;padding:2px 9px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer}
  .bar button:disabled{opacity:.4;cursor:default}
  #addr{flex:1;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;background:#f1f3f4;border-radius:14px;padding:4px 12px;color:#3c4043;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .sitewrap{display:flex;border:1px solid #dfe3ee;border-top:0;border-radius:0 0 10px 10px;background:#fff;overflow:hidden;margin-bottom:12px}
  #files{flex:0 0 190px;border-right:1px solid #eef0f5;padding:6px 0;font-size:11.5px;font-family:ui-monospace,Menlo,monospace;overflow:auto;max-height:340px}
  #files .fl{padding:3px 10px;cursor:pointer;white-space:nowrap}
  #files .fl:hover{background:#f1f4fb}
  #files .fl.on{background:#e3ecff;color:#1d4ed8;font-weight:600}
  #files .fl.pic{cursor:default;color:#8b92a8}
  #site{flex:1;height:340px;border:0;display:block;background:#fff}
</style>
<div class="knobs" style="margin-bottom:8px">
  <label>show <select id="which"><option value="mine">my code</option><option value="solution">the solution</option></select></label>
  <span style="font-size:12px;color:#5b6382">every file from the Build tab, with working links and pictures</span>
</div>
<div class="bar"><button id="back" title="back">◀</button><button id="fwd" title="forward">▶</button><button id="home" title="home page">⌂</button><div id="addr"></div></div>
<div class="sitewrap"><div id="files"></div><iframe id="site"></iframe></div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>`;
const siteDemo = (l, opts) => ({
  title:'Your site', height: 600,
  note: opts.note || 'Every page you wrote in the Build tab, in a browser that can follow links between them. Click around; edits show up as you type.',
  html: SITE_MARKUP + reader(l) + script(SITE, { start: 'index.html', origin: opts.origin, extra: opts.extra || [] }),
});

/* ---------- lecture 25: path resolver over two folder trees ---------- */
function resolverDemo(cfg) {
  var $ = function (id) { return document.getElementById(id); };
  var pin = $('p'), sel = $('tree-sel'), T;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function resolve(path) {
    if (!path) return { at: null };
    if (path.charAt(0) === '/') return { at: '/' + path.replace(/^\/+/, ''), root: true };
    var parts = (T.here + '/' + path).split('/'), out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p === '' || p === '.') continue;
      if (p === '..') { if (!out.length) return { at: null, above: true }; out.pop(); }
      else out.push(p);
    }
    return { at: out.join('/') };
  }
  function draw() {
    var r = resolve(pin.value.trim()), found = T.files.indexOf(r.at) !== -1;
    $('tree').innerHTML = T.rows.map(function (row) {
      var hit = row[2] && row[2] === r.at;
      var style = hit ? 'background:#c8f0d4;color:#14532d;font-weight:700' : row[2] === T.self ? 'color:#1d4ed8' : 'color:#3c435c';
      return '<span style="' + style + ';padding:0 4px;border-radius:3px">' + new Array(row[1] * 3 + 1).join('&nbsp;') + esc(row[0]) + '</span>';
    }).join('\n');
    var v = $('verdict');
    v.textContent = found ? 'found it' : 'no such file';
    v.style.background = found ? '#c8f0d4' : '#ffd6d6'; v.style.color = found ? '#14532d' : '#7f1d1d';
    var steps = ['start in       ' + T.here + '/   (the folder ' + T.self.split('/').pop() + ' is in)'];
    if (r.root) steps = ['a leading /    starts at the very top of the disk (or the web server), not at your project'];
    pin.value.trim().split('/').forEach(function (p) {
      if (p === '.') steps.push('./             stay right here');
      else if (p === '..') steps.push('../            go UP one folder');
      else if (p) steps.push(p.indexOf('.') > -1 ? 'look for       ' + p : 'go down into   ' + p + '/');
    });
    $('ro').textContent = steps.join('\n') + '\n\nresolves to    ' + (r.above ? '(walked off the top of the tree)' : r.at || '(nothing)') + '\n' +
      (found ? 'THE FILE IS THERE' : 'BROKEN: nothing is at that address');
    var pic = found && T.pics && T.pics[r.at];
    $('pic').innerHTML = pic ? '<img src="' + pic + '" alt="" style="height:90px;border-radius:6px;display:block">' : found ? '<div style="font-size:46px">📄</div>' : '<div style="font-size:12px;color:#8b92a8">(broken image)</div>';
  }
  function load() {
    T = cfg.trees[sel.value];
    $('here').textContent = T.self;
    $('presets').innerHTML = T.presets.map(function (p) { return '<button class="pre" data-p="' + p + '">' + p + '</button>'; }).join('');
    pin.value = T.start; draw();
  }
  $('presets').addEventListener('click', function (e) { var b = e.target.closest('.pre'); if (b) { pin.value = b.getAttribute('data-p'); draw(); } });
  pin.addEventListener('input', draw);
  sel.addEventListener('change', load);
  load();
}
const RESOLVER_CFG = {
  trees:{
    exercise:{
      here:'website/Folder0', self:'website/Folder0/index.html', start:'../Folder1/fish.png',
      files:['website/dog.png','website/Folder0/index.html','website/Folder0/rabbit.png','website/Folder0/Folder3/cat.png','website/Folder1/fish.png','website/Folder1/Folder2/bird.png'],
      pics:{ 'website/dog.png':'assets/paths/dog.png', 'website/Folder0/rabbit.png':'assets/paths/Folder0/rabbit.png', 'website/Folder0/Folder3/cat.png':'assets/paths/Folder0/Folder3/cat.png', 'website/Folder1/fish.png':'assets/paths/Folder1/fish.png', 'website/Folder1/Folder2/bird.png':'assets/paths/Folder1/Folder2/bird.png' },
      rows:[['website/   (the "4.0 File Paths" folder)',0,null],['dog.png',1,'website/dog.png'],['Folder0/',1,null],['index.html   ← you are writing this',2,'website/Folder0/index.html'],['rabbit.png',2,'website/Folder0/rabbit.png'],['Folder3/',2,null],['cat.png',3,'website/Folder0/Folder3/cat.png'],['Folder1/',1,null],['fish.png',2,'website/Folder1/fish.png'],['Folder2/',2,null],['bird.png',3,'website/Folder1/Folder2/bird.png']],
      presets:['./rabbit.png','./Folder3/cat.png','../dog.png','../Folder1/fish.png','../Folder1/Folder2/bird.png','rabbit.png','./dog.png','../../dog.png','/dog.png'],
    },
    slides:{
      here:'Root/Project', self:'Root/Project/index.html', start:'../essay.docx',
      files:['Root/essay.docx','Root/Project/index.html','Root/Project/dog.png','Root/Project/Images/cat.png'],
      pics:{ 'Root/Project/dog.png':'assets/paths/dog.png', 'Root/Project/Images/cat.png':'assets/paths/Folder0/Folder3/cat.png' },
      rows:[['Root   (C: or Macintosh HD)',0,null],['essay.docx',1,'Root/essay.docx'],['Project/',1,null],['index.html   ← you are writing this',2,'Root/Project/index.html'],['dog.png',2,'Root/Project/dog.png'],['Images/',2,null],['cat.png',3,'Root/Project/Images/cat.png']],
      presets:['./dog.png','Images/cat.png','./Images/cat.png','../essay.docx','../dog.png','./cat.png'],
    },
  },
};

/* ---------- lecture 25: relative paths survive a move, absolute ones don't ---------- */
function moveDemo() {
  var $ = function (id) { return document.getElementById(id); };
  var PLACES = {
    desktop: { root: 'file:///Users/you/Desktop/Project/', say: 'The project is where you built it, so both pictures load.' },
    moved:   { root: 'file:///Users/you/Documents/Old/Project/', say: 'You moved the folder. The absolute path still points at the old place on the Desktop, where nothing is left. The relative path only says "Images/cat.png next to me", which is still true.' },
    server:  { root: 'https://you.github.io/project/', say: 'On a web server there is no /Users/you/Desktop at all. The relative path still finds Images/cat.png beside index.html.' }
  };
  var CAT = 'assets/paths/Folder0/Folder3/cat.png';
  function card(id, code, url, ok) {
    $(id).innerHTML = '<div class="code">' + code + '</div>' +
      (ok ? '<img src="' + CAT + '" alt="cat" style="height:80px;border-radius:6px;display:block;margin:6px 0">' : '<div class="broken">✗ broken image</div>') +
      '<div class="url">' + url + '</div>';
  }
  function draw() {
    var p = PLACES[document.querySelector('input[name=place]:checked').value];
    $('where').textContent = p.root + 'index.html';
    var abs = new URL('/Users/you/Desktop/Project/Images/cat.png', p.root).href;
    var rel = new URL('./Images/cat.png', p.root).href;
    card('abs', '&lt;img src="/Users/you/Desktop/Project/Images/cat.png" /&gt;', abs, abs === 'file:///Users/you/Desktop/Project/Images/cat.png');
    card('rel', '&lt;img src="./Images/cat.png" /&gt;', rel, true);
    $('ro').textContent = p.say;
  }
  document.querySelectorAll('input[name=place]').forEach(function (r) { r.addEventListener('change', draw); });
  draw();
}

/* ---------- lecture 26: a canned three-page site in the course's layout ---------- */
function threePageDemo() {
  var $ = function (id) { return document.getElementById(id); };
  var PAGES = {
    'index.html': { h: 'Welcome to My Website!', p: 'This is the home page.', links: [['./public/about.html', 'About Me'], ['./public/contact.html', 'Contact Me']] },
    'public/about.html': { h: 'About Me', p: 'I am learning web development.', links: [['../index.html', 'Home'], ['./contact.html', 'Contact Me']] },
    'public/contact.html': { h: 'Contact Me', p: 'Say hello: hello@example.com', links: [['../index.html', 'Home'], ['./about.html', 'About Me']] }
  };
  function resolve(from, href) {
    var parts = from.split('/').slice(0, -1).concat(href.split('/')), out = [];
    parts.forEach(function (p) { if (p === '..') out.pop(); else if (p && p !== '.') out.push(p); });
    return out.join('/');
  }
  var cur = 'index.html';
  function show(name) {
    cur = name; var p = PAGES[name];
    $('fr').srcdoc = '<!DOCTYPE html><html><head><style>body{font-family:-apple-system,sans-serif;padding:14px;margin:0}h1{font-size:19px;margin:0 0 8px}a{color:#2a6fdb;margin-right:12px}</style></head><body>' +
      '<div style="font-family:Menlo,monospace;font-size:11px;color:#8b92a8;margin-bottom:8px">' + name + '</div>' +
      '<nav>' + p.links.map(function (l) { return '<a href="#" data-to="' + l[0] + '">' + l[1] + '</a>'; }).join('') + '</nav>' +
      '<h1>' + p.h + '</h1><p>' + p.p + '</p></body></html>';
    var tree = ['my-website/', '  index.html' + (name === 'index.html' ? '        ← you are here' : ''), '  public/',
      '    about.html' + (name === 'public/about.html' ? '      ← you are here' : ''),
      '    contact.html' + (name === 'public/contact.html' ? '    ← you are here' : '')];
    $('ro').textContent = tree.join('\n') + '\n\nthe links written inside ' + name + ':\n' +
      p.links.map(function (l) { return '  <a href="' + l[0] + '">' + l[1] + '</a>     → ' + resolve(name, l[0]); }).join('\n');
  }
  $('fr').addEventListener('load', function () {
    var d = $('fr').contentDocument; if (!d) return;
    d.querySelectorAll('a[data-to]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(resolve(cur, a.getAttribute('data-to'))); });
    });
  });
  $('home').addEventListener('click', function () { show('index.html'); });
  show('index.html');
}

/* ---------- lecture 27: the boilerplate, line by line ---------- */
function boilerDemo() {
  var LINES = [
    [0, '<!DOCTYPE html>', 'Declares that this is HTML5. It must be the very first line, and as a declaration rather than an element it has no closing tag.'],
    [0, '<html lang="en">', 'The root element: everything else sits inside it. lang says which language the text is in, so screen readers pronounce it properly (translation tools and search engines use it too).'],
    [1, '<head>', 'Information about the page for the browser. Nothing in here is drawn in the page itself.'],
    [2, '<meta charset="UTF-8" />', 'The character encoding. UTF-8 covers every alphabet, symbols like × and ÷, and emoji. Copy it as it is.'],
    [2, '<meta name="viewport" content="width=device-width, initial-scale=1.0" />', 'Added by the ! shortcut. It makes a phone lay the page out at its real screen width instead of pretending to be a desktop. It matters once you write responsive CSS.', 'emmet'],
    [2, '<meta http-equiv="X-UA-Compatible" content="ie=edge" />', 'Added by older versions of the shortcut, for Internet Explorer only. IE is retired, so delete this line.', 'old'],
    [2, '<title>My Website</title>', 'The text on the browser tab (and in bookmarks and search results). The shortcut writes "Document"; always change it.'],
    [1, '</head>', 'The end of the page information.'],
    [1, '<body>', 'Everything visible goes in here: headings, paragraphs, images, links.'],
    [2, '<h1>Hello World</h1>', 'Content. Almost all your work in these sections happens inside the body.'],
    [1, '</body>', 'Closes the body.'],
    [0, '</html>', 'Closes the root element: the bottom bun of the burger.']
  ];
  var COLORS = ['#ff9aa2', '#ffcf6b', '#7ee0a8'];
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function draw() {
    var emmet = $('emmet').checked;
    $('code').innerHTML = LINES.map(function (l, i) {
      if (l[3] && !emmet) return '';
      return '<div class="ln' + (l[3] === 'old' ? ' old' : '') + '" data-i="' + i + '" style="border-left-color:' + COLORS[l[0]] + ';padding-left:' + (10 + l[0] * 18) + 'px">' + esc(l[1]) + '</div>';
    }).join('');
  }
  $('code').addEventListener('click', function (e) {
    var ln = e.target.closest('.ln'); if (!ln) return;
    $('code').querySelectorAll('.ln').forEach(function (x) { x.classList.toggle('on', x === ln); });
    var l = LINES[+ln.getAttribute('data-i')];
    $('ro').textContent = l[1] + '\n\n' + l[2];
  });
  $('emmet').addEventListener('change', draw);
  draw();
}

/* ---------- lecture 27: what charset does ---------- */
function charsetDemo() {
  var $ = function (id) { return document.getElementById(id); };
  function draw() {
    var text = $('txt').value;
    var bytes = new TextEncoder().encode(text);
    var good = new TextDecoder('utf-8').decode(bytes), bad = new TextDecoder('windows-1252').decode(bytes);
    $('good').textContent = good; $('bad').textContent = bad;
    var multi = [].filter.call(Array.from(text), function (ch) { return new TextEncoder().encode(ch).length > 1; });
    $('ro').textContent = 'Your editor saves the text as ' + bytes.length + ' bytes of UTF-8. ' +
      (multi.length ? multi.length + ' character' + (multi.length === 1 ? ' needs' : 's need') + ' more than one byte (' + multi.slice(0, 8).join(' ') + ').\n' +
        'Read back as UTF-8 they come out right. Read with the wrong encoding, each extra byte becomes a stray character. That is the job of <meta charset="UTF-8" />.'
      : 'Plain English letters are one byte each and look the same in both encodings. Add an emoji or an accent and watch the bottom line break.');
  }
  $('txt').addEventListener('input', draw);
  draw();
}

/* ---------- lecture 28: height only vs both ---------- */
function sizeDemo() {
  var $ = function (id) { return document.getElementById(id); };
  var NW = 220, NH = 160;
  function draw() {
    var mode = $('mode').value, h = +$('h').value, w = +$('w').value, img = $('img');
    img.removeAttribute('width'); img.removeAttribute('height');
    if (mode !== 'width') img.setAttribute('height', h);
    if (mode !== 'height') img.setAttribute('width', w);
    $('hv').textContent = h + 'px'; $('wv').textContent = w + 'px';
    $('h').disabled = mode === 'width'; $('w').disabled = mode === 'height';
    var rw = mode === 'height' ? Math.round(h * NW / NH) : w, rh = mode === 'width' ? Math.round(w * NH / NW) : h;
    var stretch = Math.abs(rw / rh - NW / NH) / (NW / NH);
    $('ro').textContent = '<img src="./assets/paths/dog.png" alt="..."' + (mode !== 'width' ? ' height="' + h + '"' : '') + (mode !== 'height' ? ' width="' + w + '"' : '') + ' />\n\n' +
      'original   ' + NW + ' × ' + NH + '\nshown at   ' + rw + ' × ' + rh + '\n\n' +
      (stretch > 0.03 ? 'Both set, and they don\'t match the original shape: the picture is squashed or stretched.' : 'The proportions are kept' + (mode === 'both' ? ' (only because you matched them by hand).' : ': the browser works out the other side for you.'));
  }
  ['mode', 'h', 'w'].forEach(function (id) { $(id).addEventListener('input', draw); $(id).addEventListener('change', draw); });
  draw();
}

/* ---------- lecture 29: folder or contents? ---------- */
function uploadDemo() {
  var $ = function (id) { return document.getElementById(id); };
  function draw() {
    var drag = document.querySelector('input[name=drag]:checked').value, home = $('home').value;
    $('local').textContent = '📁 html-portfolio/\n   📄 ' + home + '\n   📁 public/\n      📄 about.html  📄 contact.html …\n   📁 assets/\n      📁 images/';
    $('repo').textContent = drag === 'folder'
      ? '📄 README.md\n📁 html-portfolio/\n   📄 ' + home + '\n   📁 public/\n   📁 assets/'
      : '📄 README.md\n📄 ' + home + '\n📁 public/\n📁 assets/';
    var works = drag === 'contents' && home === 'index.html';
    $('page').innerHTML = works
      ? '<h3 style="margin:0 0 4px">Ada\'s Portfolio</h3><div style="font-size:12px;color:#555">I\'m a Web Developer</div><hr><a href="#">Movie Ranking Project</a><br><a href="#">Birthday Invite Project</a>'
      : '<div style="font-size:11px;color:#8b92a8;margin-bottom:4px">rendered from README.md</div><h3 style="margin:0 0 4px">html-portfolio</h3><div style="font-size:12px;color:#555">(the one line GitHub wrote in your README)</div>';
    var say;
    if (works) say = 'index.html sits at the top level of the repository, so it is the home page at https://ada.github.io/html-portfolio/';
    else if (drag === 'folder') say = 'You dragged the folder itself, so the top level of the repository holds only README.md and a folder. With no index.html there, Pages shows the README instead.\nYour portfolio IS online, one folder too deep: https://ada.github.io/html-portfolio/html-portfolio/';
    else if (home === 'Index.html') say = 'The server is case-sensitive: Index.html is not index.html, so there is no home page and the README shows instead. (Your Mac didn\'t care. The server does.)';
    else say = 'Only a file called index.html is served as the home page. home.html is online, but only at https://ada.github.io/html-portfolio/home.html';
    $('ro').textContent = say;
    $('addr').textContent = 'https://ada.github.io/html-portfolio/';
  }
  document.querySelectorAll('input[name=drag]').forEach(function (r) { r.addEventListener('change', draw); });
  $('home').addEventListener('change', draw);
  draw();
}

/* ---------- lecture 29: will this link work once it is online? ---------- */
function urlDemo() {
  var $ = function (id) { return document.getElementById(id); };
  var FILES = ['index.html', 'public/about.html', 'public/contact.html', 'public/movie-ranking.html', 'public/birthday-invite.html'];
  var PRESETS = ['./public/about.html', 'public/contact.html', './Public/about.html', '/public/about.html', 'C:/Users/ada/Desktop/html-portfolio/public/about.html'];
  $('presets').innerHTML = PRESETS.map(function (p) { return '<button class="pre" data-p="' + p + '">' + p + '</button>'; }).join('');
  function draw() {
    var user = ($('user').value.trim() || 'ada').toLowerCase(), repo = $('repo').value.trim() || 'html-portfolio';
    var base = 'https://' + user + '.github.io/' + repo + '/';
    $('map').innerHTML = FILES.map(function (f) {
      return '<tr><td>' + f + '</td><td>' + base + (f === 'index.html' ? '' : f) + '</td></tr>';
    }).join('');
    var link = $('link').value.trim(), msg;
    if (!link) { $('ro').textContent = 'Type a link as it is written in index.html.'; return; }
    var url;
    try { url = new URL(link, base); } catch (e) { url = null; }
    if (!url || !/^https?:$/.test(url.protocol)) msg = 'That is a path on your own disk. A visitor\'s browser has no idea what your C: drive is, so the link is dead the moment the site is online.';
    else {
      var path = url.href.indexOf(base) === 0 ? url.href.slice(base.length) : null;
      var exact = path !== null && FILES.indexOf(path || 'index.html') > -1;
      var nocase = path !== null && FILES.map(function (f) { return f.toLowerCase(); }).indexOf((path || 'index.html').toLowerCase()) > -1;
      msg = 'goes to  ' + url.href + '\n\n' + (exact ? '✓ A file is there. This link works online exactly as it did on your computer.'
        : nocase ? '✗ Wrong capitals. Your Mac ignores case, the web server does not: Public is not public.'
        : path === null ? '✗ A leading / starts at the root of ' + url.host + ', not inside your repository, so ' + repo + '/ is skipped.'
        : '✗ No file there.');
    }
    $('ro').textContent = msg;
  }
  $('presets').addEventListener('click', function (e) { var b = e.target.closest('.pre'); if (b) { $('link').value = b.getAttribute('data-p'); draw(); } });
  ['user', 'repo', 'link'].forEach(function (id) { $(id).addEventListener('input', draw); });
  draw();
}


/* ======================================================================= */

PG.add({
  id:'s04-file-paths', index:25, udemyId:37349942, minutes:19, section:'s04', slug:'file-paths', kind:'build',
  // the preview pretends to live in Folder0/, so ./ and ../ resolve against
  // the real folders in assets/paths/ — wrong paths genuinely break
  previewBase:'assets/paths/Folder0/',
  title:'Computer File Paths',
  blurb:'A path is directions from <b>the file you are writing in</b> to the file you want. <code>./</code> means this folder, <code>../</code> means up one folder, and <code>Folder/</code> means down into it. These <b>relative</b> paths keep working when the project is moved or put online, which is why websites use them for their own files.',
  tasks:[
    'This page is <code>Folder0/index.html</code>; the comment in the code shows where each picture really is. Under each heading, add an <code>&lt;img /&gt;</code> with an <code>alt</code> naming the animal and a <code>src</code> that is a relative path from this file.',
    'Rabbit: same folder as the page, so <code>./rabbit.png</code>. Cat: one folder down, so start with <code>./Folder3/</code>.',
    'Dog: in the folder above, so climb with <code>../</code>. Fish and bird: climb out, then go down into <code>Folder1</code> (and on into <code>Folder2</code>).',
    'These are real files: a correct path loads the picture, a wrong one shows a broken image. Test a path in the Explore tab\'s resolver before you type it.',
    'Write the <code>./</code> even where it could be left out. Some tools need it, and it shows you meant "this folder".',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>All the Animals</title>
</head>
<body>

  <h1>All the Animals</h1>

  <!-- This page is:  website/Folder0/index.html
       The pictures are:
         website/Folder0/rabbit.png
         website/Folder0/Folder3/cat.png
         website/dog.png
         website/Folder1/fish.png
         website/Folder1/Folder2/bird.png
       (website/ is the "4.0 File Paths" folder from the course download) -->

  <h2>Rabbit:</h2>
  <!-- TODO: an img of the rabbit -->

  <h2>Cat:</h2>
  <!-- TODO: an img of the cat -->

  <h2>Dog:</h2>
  <!-- TODO: an img of the dog -->

  <h2>Fish:</h2>
  <!-- TODO: an img of the fish -->

  <h2>Bird:</h2>
  <!-- TODO: an img of the bird -->

</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>All the Animals</title>
</head>
<body>

  <h1>All the Animals</h1>

  <h2>Rabbit:</h2>
  <!-- same folder as index.html -->
  <img src="./rabbit.png" alt="Rabbit" />

  <h2>Cat:</h2>
  <!-- down into Folder3 -->
  <img src="./Folder3/cat.png" alt="Cat" />

  <h2>Dog:</h2>
  <!-- up out of Folder0 -->
  <img src="../dog.png" alt="Dog" />

  <h2>Fish:</h2>
  <!-- up one, then down into Folder1 -->
  <img src="../Folder1/fish.png" alt="Fish" />

  <h2>Bird:</h2>
  <!-- up one, down into Folder1, then Folder2 -->
  <img src="../Folder1/Folder2/bird.png" alt="Bird" />

</body>
</html>
`},
  explore:[
  {
    title:'Path resolver', height:640,
    note:'Type a path and watch it walk the tree: green means it found a file, red means it went somewhere empty. Switch to the lecture\'s example tree to try <code>../essay.docx</code>.',
    html:`
<style>
  .pre{display:block;width:100%;text-align:left;font-family:Menlo,monospace;font-size:12px;padding:4px 8px;margin-bottom:4px;border:1px solid #cfd5e6;border-radius:5px;background:#fff;cursor:pointer}
</style>
<div class="knobs">
  <label>tree <select id="tree-sel"><option value="exercise">the exercise (4.0 File Paths)</option><option value="slides">the lecture's example</option></select></label>
  <label>you are editing <span class="tag" id="here"></span></label>
</div>
<div class="knobs">
  <label>src=" <input type="text" id="p" size="28"> "</label>
  <span class="tag" id="verdict"></span>
</div>
<div class="stage" style="display:flex;gap:16px;align-items:flex-start">
  <div style="flex:1.3">
    <h4>the folder tree</h4>
    <pre id="tree" style="margin:0;font-family:Menlo,monospace;font-size:12px;line-height:1.75"></pre>
  </div>
  <div style="flex:1">
    <h4>try these</h4>
    <div id="presets"></div>
    <div id="pic" style="margin-top:8px"></div>
  </div>
</div>
<pre class="readout" id="ro"></pre>
` + script(resolverDemo, RESOLVER_CFG),
  },
  {
    title:'Move the project', height:470,
    note:'The same page with two pictures: one found by an absolute path, one by a relative path. Move the project folder, or publish it, and see which one survives.',
    html:`
<style>
  .cards{display:flex;gap:12px}
  .card{flex:1;background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:10px;min-height:150px}
  .card h4{margin:0 0 6px}
  .card .code{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#3c435c}
  .card .url{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#8b92a8;word-break:break-all}
  .card .broken{height:80px;display:flex;align-items:center;justify-content:center;color:#8a1c1c;background:#fff1f1;border-radius:6px;margin:6px 0;font-size:12px}
</style>
<div class="knobs">
  <label><input type="radio" name="place" value="desktop" checked> on the Desktop, where you built it</label>
  <label><input type="radio" name="place" value="moved"> moved into Documents/Old</label>
  <label><input type="radio" name="place" value="server"> published on a web server</label>
</div>
<div style="font-size:12px;color:#5b6382;margin:0 0 8px">index.html is now at <span class="tag" id="where"></span></div>
<div class="cards">
  <div class="card"><h4>absolute path</h4><div id="abs"></div></div>
  <div class="card"><h4>relative path</h4><div id="rel"></div></div>
</div>
<pre class="readout" id="ro" style="margin-top:12px;white-space:pre-wrap"></pre>
` + script(moveDemo),
  }],
  quiz:[
    { q:'Your page is <code>Project/index.html</code> and the picture is <code>Project/images/cat.png</code>. Which src works?', options:['<code>../images/cat.png</code>','<code>./images/cat.png</code>','<code>/cat.png</code>','<code>images/../cat.png</code>'], answer:1, why:'Start in the folder the page is in (./), go down into images/, pick the file.' },
    { q:'What does <code>../</code> mean?', options:['This folder','The folder above the one the current file is in','The root of the disk','Two folders down'], answer:1, why:'Each ../ climbs one level up from the folder that contains the file you are writing.' },
    { q:'Why do websites use relative paths for their own files?', options:['They are faster','They keep working when the whole project is moved or uploaded','Absolute paths are not allowed in HTML','Browsers ignore absolute paths'], answer:1, why:'The directions from index.html to its pictures don\'t change when the folder moves, unlike a path from the top of your disk.' },
  ],
  notes:`
    <h3>The three ingredients</h3>
    <table>
      <tr><th>Written</th><th>Means</th></tr>
      <tr><td><code>./</code></td><td>This folder (the one the current file is in)</td></tr>
      <tr><td><code>../</code></td><td>Up one folder; stack them, <code>../../</code>, to climb further</td></tr>
      <tr><td><code>Folder/</code></td><td>Down into that folder</td></tr>
    </table>
    <h3>Three kinds of address, side by side</h3>
    <table>
      <tr><td><b>Absolute path on your disk</b></td><td><code>C:\\Project\\Images\\cat.png</code> (Windows) or <code>/Users/you/Project/Images/cat.png</code> (Mac). Starts at the root of the drive. Only works on your own computer, and breaks if the folder moves.</td></tr>
      <tr><td><b>Full URL</b></td><td><code>https://example.com/images/cat.png</code>. Absolute on the web; the way to point at other people's files.</td></tr>
      <tr><td><b>Relative path</b></td><td><code>./Images/cat.png</code>. Directions from the current file. Use these for your own files.</td></tr>
    </table>
    <p>A path that starts with a single <code>/</code> starts at the top: of the drive on your computer, of the domain on a web server. It is not the same as <code>./</code>.</p>
    <h3>Two VS Code tricks from the lecture</h3>
    <ul>
      <li>Not sure which folder a file is in? Collapse folders in the Explorer: the one that hides the file is its parent.</li>
      <li>Start typing inside <code>src=""</code> and pick from the suggestions. If the folder you expect isn't offered, your prefix (<code>./</code> or <code>../</code>) is wrong.</li>
    </ul>
    <h3>Capital letters matter online</h3>
    <p>Your Mac usually treats <code>Cat.png</code> and <code>cat.png</code> as the same file; almost every web server does not. Match the case exactly.</p>`
});


const L26 = {
  id:'s04-webpages', index:26, udemyId:37349924, minutes:13, section:'s04', slug:'multi-page', kind:'build',
  title:'What are Webpages?',
  blurb:'A multi-page website is several HTML files in one project folder, joined by <code>&lt;a&gt;</code> tags whose <code>href</code> is a relative path. <code>index.html</code> is the home page; the course keeps the other pages in a <code>public/</code> folder and pictures in <code>assets/</code>. Anything can go inside an anchor: wrap an image and the whole picture becomes the link.',
  tasks:[
    'Below the <code>&lt;hr /&gt;</code>, add a <code>Contact Me</code> link to the contact page. The path starts from <code>index.html</code>: into <code>public</code>, then the file.',
    'Above the <code>&lt;hr /&gt;</code>, add an <code>&lt;a&gt;</code> pointing to <code>about.html</code> in <code>public</code>, and instead of text put an <code>&lt;img /&gt;</code> inside it, with <code>src="./assets/paths/dog.png"</code> (this playground\'s stand-in for a photo of you) and an <code>alt</code>.',
    'Open Explore → <b>Your site</b> and click the picture and the link: the pages really switch, and a wrong path ends at "file not found". (The Build preview can only show <code>index.html</code>.)',
    'Extra: in <code>public/about.html</code> and <code>public/contact.html</code>, add a link back home. Those pages live one folder down, so the path climbs: <code>../index.html</code>.',
  ],
  files:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Website</title>
</head>
<body>
  <!-- The project:
         index.html               <- you are here
         assets/paths/dog.png
         public/about.html
         public/contact.html
       (In the course download the picture is assets/images/cat.png.) -->

  <h1>Welcome to My Website!</h1>

  <!-- TODO 2: a picture of "you" (assets/paths/dog.png) that links to public/about.html -->

  <hr />

  <!-- TODO 1: a "Contact Me" link to public/contact.html -->

</body>
</html>
`,
'public/about.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Me</title>
</head>
<body>
  <h1>About Me</h1>
  <p>
    I'm learning web development one lecture at a time. Before this I had
    never written a line of code; now I have a website with three pages.
  </p>
  <p>
    When I'm not coding I'm walking the dog, reading, or arguing about which
    film is best.
  </p>

  <!-- TODO (extra): a link back to the home page -->
</body>
</html>
`,
'public/contact.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Me</title>
</head>
<body>
  <h1>Contact Me</h1>
  <p>Phone: 020 7946 0000</p>
  <p>Email: <a href="mailto:hello@example.com">hello@example.com</a></p>
  <p>Address: 1 Example Street, London</p>

  <!-- TODO (extra): a link back to the home page -->
</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Website</title>
</head>
<body>

  <h1>Welcome to My Website!</h1>

  <!-- an image that is itself a link -->
  <a href="./public/about.html">
    <img src="./assets/paths/dog.png" alt="a beagle standing in for my photo" />
  </a>

  <hr />

  <a href="./public/contact.html">Contact Me</a>

</body>
</html>
`,
'public/about.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Me</title>
</head>
<body>
  <h1>About Me</h1>
  <p>
    I'm learning web development one lecture at a time. Before this I had
    never written a line of code; now I have a website with three pages.
  </p>
  <p>
    When I'm not coding I'm walking the dog, reading, or arguing about which
    film is best.
  </p>

  <!-- this page is inside public/, so home is one folder up -->
  <a href="../index.html">Back to the home page</a>
</body>
</html>
`,
'public/contact.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Me</title>
</head>
<body>
  <h1>Contact Me</h1>
  <p>Phone: 020 7946 0000</p>
  <p>Email: <a href="mailto:hello@example.com">hello@example.com</a></p>
  <p>Address: 1 Example Street, London</p>

  <a href="../index.html">Back to the home page</a>
</body>
</html>
`},
  quiz:[
    { q:'<code>index.html</code> is in the Project folder, next to <code>assets/images/cat.png</code>. Which line shows the cat on the page?', options:['<code>&lt;img src="../assets/images/cat.png" /&gt;</code>','<code>&lt;img href="./assets/images/cat.png" /&gt;</code>','<code>&lt;a href="./assets/images/cat.png"&gt;cat&lt;/a&gt;</code>','<code>&lt;img src="./assets/images/cat.png" /&gt;</code>'], answer:3, why:'../ would leave the project; img takes src, not href; and an anchor only links to the picture instead of showing it.' },
    { q:'From <code>public/about.html</code>, which link goes back to the home page?', options:['<code>./index.html</code>','<code>../index.html</code>','<code>./public/index.html</code>','<code>index.html</code>'], answer:1, why:'about.html sits inside public/, so home is one folder up.' },
    { q:'Why is the home page always called <code>index.html</code>?', options:['It is the only name browsers can open','A server hands out index.html when someone visits a folder without naming a file','It loads faster','VS Code requires it'], answer:1, why:'Visiting example.com/ really means example.com/index.html.' },
  ],
  notes:`
    <h3>index.html is special</h3>
    <p>When someone visits a folder without naming a file, the server hands them <code>index.html</code>. That is why the home page always has that name, at the top of the project.</p>
    <h3>The course's layout</h3>
    <pre>my-website/
  index.html          home page
  assets/
    images/
      cat.png
  public/
    about.html        other pages
    contact.html</pre>
    <p>From <code>index.html</code>: <code>./public/about.html</code> and <code>./assets/images/cat.png</code>. From a page inside <code>public/</code>, climb out first: <code>../index.html</code>, <code>../assets/images/cat.png</code>. VS Code may show <code>assets/images</code> on one row when a folder only holds another folder; they are still two folders.</p>
    <h3>Peek at the goal without spoiling it</h3>
    <p>In VS Code, right-click <code>solution.html</code> and choose Show Preview: you can click around the finished site without seeing its code.</p>`
};
L26.explore = [
  siteDemo(L26, { origin:'file:///Users/you/Desktop/my-website/', extra:['assets/paths/dog.png'] }),
  {
    title:'Paths change with where you stand', height:470,
    note:'The same three pages, already linked up. Click around and watch how the links inside each file are written: from <code>public/</code> every route home starts with <code>../</code>.',
    html:`
<div class="knobs">
  <span style="font-size:12px;color:#5b6382">click the links inside the frame, then read the code underneath</span>
  <button id="home">↺ back to index.html</button>
</div>
<div class="stage" style="padding:0;overflow:hidden">
  <iframe id="fr" style="width:100%;height:170px;border:0;display:block;background:#fff"></iframe>
</div>
<pre class="readout" id="ro"></pre>
` + script(threePageDemo),
  },
];
PG.add(L26);


const L27 = {
  id:'l027', index:27, udemyId:37349876, minutes:13, section:'s04', slug:'html-boilerplate', kind:'build',
  title:'The HTML Boilerplate',
  blurb:'Every HTML file starts from the same skeleton. <code>&lt;!DOCTYPE html&gt;</code> declares HTML5; <code>&lt;html lang="en"&gt;</code> wraps everything and states the language; <code>&lt;head&gt;</code> holds information about the page (the <code>charset</code> and the <code>&lt;title&gt;</code> on the tab); <code>&lt;body&gt;</code> holds everything you see. In VS Code, typing <code>!</code> then Enter in an .html file writes it for you.',
  tasks:[
    'Type the boilerplate around the heading from memory: the doctype on line 1, <code>&lt;html lang="en"&gt;</code>, a <code>&lt;head&gt;</code> with <code>&lt;meta charset="UTF-8" /&gt;</code> and a <code>&lt;title&gt;</code>, and a <code>&lt;body&gt;</code> containing the <code>&lt;h1&gt;</code>. Indent each level.',
    'Set the title to <code>My Website</code>, then press <b>↗ open</b> above the preview: the new tab is labelled with your title.',
    'Move the <code>&lt;h1&gt;</code> up into the head. It still shows, because the browser quietly moves visible content into the body. Put it back where it belongs.',
    'Tick off the Explore tab\'s <b>Boilerplate checklist</b>.',
    'Below the heading, build a "burger" from made-up elements: a <code>&lt;bun&gt;</code> with an attribute, fillings inside it, and at least one filling inside another. Indent so every closing tag lines up with its opening tag.',
  ],
  files:{
'index.html':`<!-- TODO: type the boilerplate around this heading from memory:
     the doctype, html (with lang), head (charset meta and title) and body.
     The heading belongs in the body. -->

<h1>Hello World</h1>

<!-- TODO 5: build your burger here, inside the body -->
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Website</title>
  </head>
  <body>
    <h1>Hello World</h1>

    <!-- made-up elements: the browser shows their text, the point is the nesting -->
    <bun type="brioche" toasted="yes">
      <sauce flavour="chipotle">sauce</sauce>
      <lettuce leaves="2">lettuce</lettuce>
      <patty kind="bean">
        patty
        <cheese kind="smoked">cheese</cheese>
      </patty>
      <tomato slices="3">tomato</tomato>
    </bun>
  </body>
</html>
`},
  quiz:[
    { q:'Where must <code>&lt;!DOCTYPE html&gt;</code> go?', options:['Anywhere in the head','The very first line of the file','Just before <code>&lt;/html&gt;</code>','Inside the body'], answer:1, why:'It tells the browser which version of HTML to expect before it reads anything else.' },
    { q:'What is <code>lang="en"</code> for?', options:['It translates the page into English','It tells screen readers and other tools which language the text is in','It sets the font','It is required for CSS'], answer:1, why:'A screen reader uses it to choose the right pronunciation; visitors never see it.' },
    { q:'Which of these belongs in the <code>&lt;head&gt;</code>?', options:['<code>&lt;h1&gt;</code>','<code>&lt;img&gt;</code>','<code>&lt;title&gt;</code>','<code>&lt;p&gt;</code>'], answer:2, why:'The head holds information about the page; anything meant to be seen goes in the body.' },
    { q:'You type <code>!</code> in VS Code and nothing happens. The likely reason?', options:['VS Code needs restarting','The file hasn\'t been saved with a .html extension yet','The shortcut only works in CSS files','You need Prettier'], answer:1, why:'The boilerplate suggestion only appears once VS Code knows the file is HTML.' },
  ],
  notes:`
    <h3>The shape of every page</h3>
    <pre>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;My Website&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    ...everything you can see...
  &lt;/body&gt;
&lt;/html&gt;</pre>
    <p>Like a burger: <code>html</code> is the bun, <code>head</code> and <code>body</code> sit inside it, and your content sits inside the body. Indent one step per level so each closing tag lines up with its opening tag.</p>
    <h3>See a real one</h3>
    <p>Right-click any website and choose <b>View Page Source</b>: the doctype, html, head, charset and title are right at the top.</p>
    <h3>The ! shortcut</h3>
    <p>It only works in a file saved as <code>something.html</code>. Change its <code>Document</code> title, and delete the <code>X-UA-Compatible</code> line if your version adds one.</p>`
};
L27.explore = [
  {
    title:'Line by line', height:500,
    note:'Click a line to see what it does. The coloured edge shows how deep it is nested. Tick the box to add what VS Code\'s <code>!</code> shortcut writes on top of the essentials.',
    html:`
<style>
  #code{background:#1e1f26;border-radius:10px;padding:8px 0;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#d6d9e6}
  #code .ln{border-left:4px solid;margin:1px 0;padding:3px 10px;cursor:pointer;white-space:pre-wrap}
  #code .ln:hover{background:#2a2c36}
  #code .ln.on{background:#2f3a5c}
  #code .ln.old{text-decoration:line-through;color:#8b8fa3}
</style>
<div class="knobs"><label><input type="checkbox" id="emmet"> show the extra lines from the ! shortcut</label></div>
<div id="code"></div>
<pre class="readout" id="ro" style="margin-top:12px;white-space:pre-wrap">Click any line.</pre>
` + script(boilerDemo),
  },
  {
    title:'What charset does', height:400,
    note:'Your file is saved as bytes. <code>&lt;meta charset="UTF-8" /&gt;</code> tells the browser how to turn them back into characters. Type some emoji or accented letters and compare.',
    html:`
<div class="knobs" style="display:block">
  <input type="text" id="txt" value="Café menu: 2 × 3 ÷ 6 = 1 · naïve · 🍕 ✓" style="width:100%;font-size:15px;padding:6px 9px">
</div>
<div class="stage">
  <h4>read as UTF-8 (meta charset="UTF-8")</h4>
  <div id="good" style="font-size:18px;margin-bottom:14px"></div>
  <h4>read with the wrong encoding (windows-1252)</h4>
  <div id="bad" style="font-size:18px;color:#8a1c1c;word-break:break-all"></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
` + script(charsetDemo),
  },
];
L27.explore.push(checklist(L27, [
  { desc:'Line 1 is <code>&lt;!DOCTYPE html&gt;</code>', test:DOCTYPE_FIRST },
  { desc:'<code>&lt;html&gt;</code> has a <code>lang</code> attribute', test:"return /<html[^>]*\\slang\\s*=\\s*[\"']?[a-z]/i.test(html);" },
  { desc:'A <code>&lt;head&gt;</code> with <code>&lt;meta charset=\"UTF-8\" /&gt;</code>', test:"return /<head[\\s>]/i.test(html) && /<meta[^>]*charset\\s*=\\s*[\"']?utf-8/i.test(html);" },
  { desc:'A <code>&lt;title&gt;</code> that isn\'t empty or "Document"', test:"var t = (doc.querySelector('title') || {}).textContent || ''; return t.trim() !== '' && t.trim() !== 'Document';" },
  { desc:'The <code>&lt;h1&gt;</code> is inside <code>&lt;body&gt;</code>, after <code>&lt;/head&gt;</code>', test:"var he = html.search(/<\\/head>/i), b = html.search(/<body[\\s>]/i), h = html.search(/<h1[\\s>]/i); return he > -1 && b > he && h > b;" },
  { desc:'Everything closes: <code>&lt;/head&gt;</code>, <code>&lt;/body&gt;</code>, and <code>&lt;/html&gt;</code> last', test:"return /<\\/head>/i.test(html) && /<\\/body>/i.test(html) && /<\\/html>\\s*$/i.test(html);" },
  { desc:'A burger: a made-up element with an attribute and another made-up element nested inside it', test:"function made(e) { return /Unknown/.test(Object.prototype.toString.call(e)) || e.tagName.indexOf('-') > -1; } return [].some.call(doc.body.querySelectorAll('*'), function (e) { return made(e) && e.attributes.length > 0 && [].some.call(e.querySelectorAll('*'), made); });" },
], 'Boilerplate checklist', 'Reads your code from the Build tab and checks each part of the skeleton.'));
PG.add(L27);


const L28 = {
  id:'s04-portfolio', index:28, udemyId:37350000, minutes:9, section:'s04', slug:'portfolio', kind:'build', project:true,
  title:'Portfolio Website',
  blurb:'Your first site worth showing: a home page that links to your Movie Ranking and Birthday Invite pages with a preview image of each, plus About Me and Contact Me pages. It uses everything from this section, joined by relative paths, and in the next lecture it goes online.',
  tasks:[
    'Work down the numbered TODOs in <code>index.html</code>, starting with the boilerplate and a title of your own.',
    'Paste your own Movie Ranking and Birthday Invite code into the matching files in <code>public/</code>, or keep the ones provided. A pasted page that shows a picture now lives one folder down, so its path needs <code>../</code> at the front.',
    'Add an <code>&lt;h1&gt;</code> with your name, an <code>&lt;h2&gt;</code> such as "I\'m a Web Developer", and an <code>&lt;hr /&gt;</code>.',
    'For each project: an <code>&lt;h3&gt;</code> containing a link to its page in <code>./public/</code>, and under it a preview <code>&lt;img /&gt;</code> with an <code>alt</code> and <code>height="200"</code>. Height only, so the width keeps the picture\'s proportions.',
    'After another <code>&lt;hr /&gt;</code>, add links to About Me and Contact Me, then edit those two pages so they describe you.',
    'Click through everything in Explore → <b>Your site</b> and clear the checklist.',
  ],
  files:{
'index.html':`<!-- TODO 1: Create the HTML boilerplate (type it, or use ! then Enter in VS Code).
     TODO 2: Change the title element to your own page title.
     TODO 3: Paste your own Movie Ranking and Birthday Invite code into
             public/movie-ranking.html and public/birthday-invite.html
             (or keep the versions provided).
     TODO 4: In the course you screenshot each project into ./assets/images/.
             This playground can't save screenshots, so use these stand-ins:
               https://picsum.photos/seed/movie-ranking/600/400
               https://picsum.photos/seed/birthday-invite/600/400
     TODO 5: An h1 with your name, an h2 such as "I'm a Web Developer", then an hr.
     TODO 6: For each project, an h3 containing a link to its page in public/.
     TODO 7: Under each heading, the preview img with alt and height="200".
     TODO 8: Another hr, then links to the About Me and Contact Me pages in public/. -->
`,
'public/movie-ranking.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Movie Ranking Project</title>
</head>
<body>
  <h1>The Best Movies According to Ada</h1>
  <h2>My top 3 movies of all time.</h2>
  <hr />
  <h3>Spirited Away</h3>
  <p>My favourite anime. The backgrounds alone are worth the ticket.</p>
  <h3>Ex Machina</h3>
  <p>Clever, quiet science fiction, and the ending still bothers me.</p>
  <h3>Drive</h3>
  <p>Hardly a word for minutes at a time, and it doesn't need any.</p>
  <hr />
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`,
'public/birthday-invite.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Birthday Invite Project</title>
</head>
<body>
  <h1>It's My Birthday!</h1>
  <h2>Saturday 14 November, from 2pm</h2>
  <!-- this page is inside public/, so the picture path climbs out first -->
  <img src="../assets/paths/dog.png" alt="my beagle, who is also coming to the party" />
  <h3>What to bring:</h3>
  <ul>
    <li>Balloons (I love balloons)</li>
    <li>A picnic blanket</li>
    <li>An appetite: there will be a lot of cake</li>
  </ul>
  <h3>This is where you need to go:</h3>
  <a href="https://www.google.com/maps/search/?api=1&query=Hyde+Park+London">Google map link</a>
  <hr />
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`,
'public/about.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Me</title>
</head>
<body>
  <h1>About Me</h1>
  <!-- TODO: replace this with a few lines about you -->
  <p>Write a few lines about yourself here: what you are learning and why.</p>
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`,
'public/contact.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Me</title>
</head>
<body>
  <h1>Contact Me</h1>
  <!-- TODO: replace these with your real details before you publish -->
  <p>Email: <a href="mailto:hello@example.com">hello@example.com</a></p>
  <p>GitHub: <a href="https://github.com/">github.com/your-username</a></p>
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ada's Portfolio</title>
  </head>
  <body>
    <h1>Ada's Portfolio</h1>
    <h2>I'm a Web Developer</h2>
    <hr />

    <!-- project 1: a linked heading, then the preview -->
    <h3><a href="./public/movie-ranking.html">Movie Ranking Project</a></h3>
    <img src="https://picsum.photos/seed/movie-ranking/600/400"
         alt="preview image for the Movie Ranking project" height="200" />

    <!-- project 2 -->
    <h3><a href="./public/birthday-invite.html">Birthday Invite Project</a></h3>
    <img src="https://picsum.photos/seed/birthday-invite/600/400"
         alt="preview image for the Birthday Invite project" height="200" />

    <hr />
    <a href="./public/about.html">About Me</a>
    <a href="./public/contact.html">Contact Me</a>
  </body>
</html>
`,
'public/about.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Me</title>
</head>
<body>
  <h1>About Me</h1>
  <p>
    I'm Ada, and I'm working through a full-stack web development course.
    I like building small, useful things and finding out how websites work.
  </p>
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`,
'public/contact.html':`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Me</title>
</head>
<body>
  <h1>Contact Me</h1>
  <p>Email: <a href="mailto:ada@example.com">ada@example.com</a></p>
  <p>GitHub: <a href="https://github.com/">github.com/ada</a></p>
  <a href="../index.html">Back to my portfolio</a>
</body>
</html>
`},
  quiz:[
    { q:'Why set only <code>height="200"</code> on the preview images?', options:['Width is not allowed on images','The browser then works out the width and keeps the proportions','It makes the images load faster','Height is required, width is optional'], answer:1, why:'Set both to numbers that don\'t match the original shape and the picture gets squashed.' },
    { q:'Your project pages are in <code>public/</code>. Which link from <code>index.html</code> is right?', options:['<code>./movie-ranking.html</code>','<code>../public/movie-ranking.html</code>','<code>./public/movie-ranking.html</code>','<code>/movie-ranking.html</code>'], answer:2, why:'From index.html: this folder, into public/, then the file.' },
  ],
  notes:`
    <h3>Keeping previews the same height</h3>
    <p>Set only <code>height</code> and let the width follow: every thumbnail lines up whatever shape the original is. Setting both squashes them unless you match the ratio exactly.</p>
    <h3>Screenshots and file names</h3>
    <p>To make a real preview: open the project page, take a screenshot (Mac: Cmd+Shift+4 and drag; Windows: Win+Shift+S; most Linux desktops: PrtSc), and move it into <code>assets/images/</code>. Name it in lowercase with hyphens, like <code>birthday-invite.png</code>: spaces and apostrophes in file names are easy to mistype and need escaping on a server.</p>
    <h3>The structure</h3>
    <pre>portfolio/
  index.html
  assets/
    images/
      movie-ranking.png
      birthday-invite.png
  public/
    movie-ranking.html
    birthday-invite.html
    about.html
    contact.html</pre>
    <h3>Make it yours</h3>
    <p>This page goes on the real internet in the next lecture, so replace the placeholder About and Contact text with your own before you publish.</p>`
};
L28.explore = [
  siteDemo(L28, { origin:'file:///Users/you/Desktop/portfolio/', extra:['assets/paths/dog.png'] }),
  checklist(L28, [
    { desc:'Line 1 is <code>&lt;!DOCTYPE html&gt;</code>', test:DOCTYPE_FIRST },
    { desc:'A title of your own (not empty, not "Document")', test:"var t = (doc.querySelector('title') || {}).textContent || ''; return t.trim() !== '' && t.trim() !== 'Document';" },
    { desc:'An <code>&lt;h1&gt;</code>, an <code>&lt;h2&gt;</code> and two <code>&lt;hr /&gt;</code>', test:"return doc.querySelector('h1') && doc.querySelector('h2') && doc.querySelectorAll('hr').length >= 2;" },
    { desc:'An <code>&lt;h3&gt;</code> linking to <code>./public/movie-ranking.html</code>', test:"return [].some.call(doc.querySelectorAll('h3 a[href]'), function (a) { return /^(\\.\\/)?public\\/movie-ranking\\.html$/.test(a.getAttribute('href').trim()); });" },
    { desc:'An <code>&lt;h3&gt;</code> linking to <code>./public/birthday-invite.html</code>', test:"return [].some.call(doc.querySelectorAll('h3 a[href]'), function (a) { return /^(\\.\\/)?public\\/birthday-invite\\.html$/.test(a.getAttribute('href').trim()); });" },
    { desc:'Two preview images, each with alt text and <code>height="200"</code> but no width', test:"return [].filter.call(doc.querySelectorAll('img'), function (i) { return (i.getAttribute('alt') || '').trim() && i.getAttribute('height') === '200' && !i.hasAttribute('width'); }).length >= 2;" },
    { desc:'Links to <code>./public/about.html</code> and <code>./public/contact.html</code>', test:"var hs = [].map.call(doc.querySelectorAll('a[href]'), function (a) { return a.getAttribute('href').trim().replace(/^\\.\\//, ''); }); return hs.indexOf('public/about.html') > -1 && hs.indexOf('public/contact.html') > -1;" },
    { desc:'The About page has been rewritten', file:'public/about.html', test:"return !/Write a few lines about yourself/.test(html);" },
  ], 'Project checklist', 'Reads every file from the Build tab and ticks off the brief.'),
  {
    title:'Height, width or both?', height:470,
    note:'The original picture is 220 × 160. Set only the height and the width follows; set both to the wrong pair and it distorts.',
    html:`
<div class="knobs">
  <label>set <select id="mode"><option value="height">height only</option><option value="width">width only</option><option value="both">both</option></select></label>
  <label>height <input type="range" id="h" min="60" max="260" value="200"><span class="val" id="hv"></span></label>
  <label>width <input type="range" id="w" min="60" max="400" value="200"><span class="val" id="wv"></span></label>
</div>
<div class="stage" style="height:290px;display:flex;align-items:center;justify-content:center">
  <img id="img" src="assets/paths/dog.png" alt="beagle" style="border-radius:6px">
</div>
<pre class="readout" id="ro"></pre>
` + script(sizeDemo),
  },
];
PG.add(L28);


PG.add({
  id:'l029', index:29, udemyId:37350028, minutes:9, section:'s04', slug:'github-pages', kind:'read',
  title:'How to Host Your Website for Free with GitHub',
  blurb:'Hosting means copying your files onto a <b>web server</b>, a computer that is always online, so anyone can visit. GitHub Pages does it for free: make a public repository, upload the <i>contents</i> of your project folder (with <code>index.html</code> at the top level, spelled exactly that), then switch Pages on for the <code>main</code> branch. Relative paths keep working online; paths to your own disk and wrong capital letters don\'t. The step-by-step list is in the lecture notes below.',
  links:[
    { title:'Sign up for GitHub', url:'https://github.com/signup', note:'a free account is all you need' },
    { title:'Create a new repository', url:'https://github.com/new', note:'name it html-portfolio, Public, tick Add a README file' },
    { title:'GitHub Pages documentation', url:'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site', note:'Settings → Pages → Branch: main, / (root) → Save' },
  ],
  explore:[
  {
    title:'Folder or contents?', height:470,
    note:'The most common GitHub Pages mistake, made safely. Choose what you drag into the upload box and what your home page is called, then look at the live address.',
    html:`
<style>
  .cols{display:flex;gap:10px}
  .col{flex:1;background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:8px 10px;min-height:150px}
  .col pre{margin:0;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;line-height:1.6;white-space:pre}
  #addr{font-family:ui-monospace,Menlo,monospace;font-size:11px;background:#f1f3f4;border-radius:12px;padding:3px 10px;margin-bottom:8px;color:#3c4043}
  #page{font-family:-apple-system,sans-serif;font-size:13px}
  #page a{color:#2a6fdb}
</style>
<div class="knobs">
  <label><input type="radio" name="drag" value="contents" checked> drag the files inside the folder</label>
  <label><input type="radio" name="drag" value="folder"> drag the html-portfolio folder itself</label>
  <label>home page called <select id="home"><option>index.html</option><option>Index.html</option><option>home.html</option></select></label>
</div>
<div class="cols">
  <div class="col"><h4>on your computer</h4><pre id="local"></pre></div>
  <div class="col"><h4>your repository</h4><pre id="repo"></pre></div>
  <div class="col"><h4>the live site</h4><div id="addr"></div><div id="page"></div></div>
</div>
<pre class="readout" id="ro" style="margin-top:12px;white-space:pre-wrap"></pre>
` + script(uploadDemo),
  },
  {
    title:'Will this link work online?', height:540,
    note:'Every file gets an address under your github.io name. Try the preset links (written as they would be in <code>index.html</code>) to see which ones survive the move to a real server.',
    html:`
<style>
  .pre{font-family:Menlo,monospace;font-size:11.5px;padding:3px 8px;margin:0 4px 4px 0;border:1px solid #cfd5e6;border-radius:5px;background:#fff;cursor:pointer}
  #map td{font-family:ui-monospace,Menlo,monospace;font-size:11px}
</style>
<div class="knobs">
  <label>username <input type="text" id="user" value="ada" size="10"></label>
  <label>repository <input type="text" id="repo" value="html-portfolio" size="14"></label>
</div>
<table class="grid" style="background:#fff;width:100%;margin-bottom:12px"><thead><tr><th>file in the repo</th><th>its address once published</th></tr></thead><tbody id="map"></tbody></table>
<div class="knobs" style="display:block">
  <label>a link in index.html: <input type="text" id="link" value="./public/about.html" size="44"></label>
  <div id="presets" style="margin-top:8px"></div>
</div>
<pre class="readout" id="ro" style="white-space:pre-wrap"></pre>
` + script(urlDemo),
  }],
  quiz:[
    { q:'You dragged the whole <code>html-portfolio</code> folder into the upload box. What does your github.io address show?', options:['Your portfolio','Your README (or a 404), because the top level of the repo has no index.html','A list of your files','An error about file size'], answer:1, why:'The site exists one folder deeper. Upload what is inside the folder, not the folder itself.' },
    { q:'Which name will GitHub Pages serve as the home page?', options:['<code>Index.html</code>','<code>home.html</code>','<code>index.html</code>','<code>main.html</code>'], answer:2, why:'Exactly index.html, all lowercase, at the top level of the repository.' },
    { q:'Username <code>ada</code>, repository <code>html-portfolio</code>. Where is <code>public/about.html</code>?', options:['https://github.com/ada/html-portfolio/public/about.html','https://ada.github.io/html-portfolio/public/about.html','https://html-portfolio.github.io/ada/about.html','https://ada.github.io/about.html'], answer:1, why:'username.github.io, then the repository name, then the same path as in your project folder.' },
    { q:'Why do links like <code>./public/about.html</code> keep working after you upload?', options:['GitHub rewrites them','The folder structure is the same on the server, so the directions from index.html still hold','Browsers ignore paths online','They don\'t; you must switch to absolute paths'], answer:1, why:'Relative paths describe the route from file to file, and that route survives the move.' },
  ],
});


PG.add({
  id:'l030', index:30, udemyId:37350282, minutes:5, section:'s04', slug:'capstone-projects', kind:'read',
  title:'Introduction to Capstone Projects',
  blurb:'Capstones work like a client brief: a written spec and an example site, but no starter files, no walkthrough and no solution. They are meant to make you get stuck and look things up, and the result is original work for your GitHub portfolio. Build your own version; a copy of the example is easy for anyone reviewing it to spot.',
  quiz:[
    { q:'What do you get for a capstone project?', options:['Starter files and a solution video','A written brief and an example site','Only a quiz','The finished code to customise'], answer:1, why:'No starter code, walkthrough or solution: that is what makes the result your own work.' },
    { q:'Why build your own version instead of copying the example site?', options:['Copying is slower','Copied tutorial projects are easy to recognise and show nothing of you','The example has bugs','GitHub blocks copies'], answer:1, why:'Employers judge you on what you built; a recognisable clone shows only that you followed along.' },
  ],
});


const L31 = {
  id:'l031', index:31, udemyId:37330378, minutes:0, section:'s04', slug:'online-resume', kind:'build', project:true,
  title:'Instructions for Capstone Project 1 - Online Resume',
  blurb:'Capstone 1: an online résumé in plain HTML, with no CSS and no JavaScript. One <code>index.html</code> with the doctype and the title <i>My Resume</i>; sections for your summary, education, work experience, skills and awards, using headings and lists; a profile photo; links to extra pages such as Hobbies and Contact; and a <code>&lt;footer&gt;</code> with your name. Then publish it with GitHub Pages and share the link.',
  tasks:[
    'In <code>index.html</code>, write the boilerplate: <code>&lt;!DOCTYPE html&gt;</code> on line 1 and a <code>&lt;title&gt;</code> that reads exactly <code>My Resume</code>.',
    'In the body: your name as the <code>&lt;h1&gt;</code>, a profile photo (<code>&lt;img /&gt;</code> with <code>alt</code>), and a short summary or objective.',
    'Add sections with <code>&lt;h2&gt;</code> headings for Education, Work Experience, Skills and Awards or Certifications. Put each section\'s items in a <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>: degrees with school and dates; jobs with title, employer, dates and what you did.',
    'Fill in <code>hobbies.html</code> and <code>contact.html</code>, link to both from the résumé, and link back home from each.',
    'Finish every page with a <code>&lt;footer&gt;</code> holding your name and a copyright line. It is new: look it up on MDN, as a professional would.',
    'HTML only: no <code>style</code> attributes, no <code>&lt;style&gt;</code>, no <code>&lt;script&gt;</code>. Click through Explore → <b>Your site</b> and clear the checklist.',
    'Publish it with GitHub Pages as in lecture 29, and share the link.',
  ],
  files:{
'index.html':`<!-- Capstone 1: Online Resume. HTML only: no CSS, no JavaScript.

     TODO 1: the boilerplate. Line 1 must be <!DOCTYPE html>,
             and the title must read My Resume.
     TODO 2: your name as the h1, a profile photo (img with alt),
             and a short summary or objective.
             A placeholder photo: https://picsum.photos/seed/profile/200/200
     TODO 3: sections with h2 headings: Education, Work Experience,
             Skills, and Awards or Certifications. Put the items of each
             section in a ul or ol.
     TODO 4: links to hobbies.html and contact.html.
     TODO 5: a footer with your name and a copyright line
             (look up <footer> on MDN). -->
`,
'hobbies.html':`<!-- TODO: a page about your hobbies: the boilerplate, a heading, a list,
     a picture if you like, a link back to index.html, and the same footer. -->
`,
'contact.html':`<!-- TODO: how to reach you: the boilerplate, a heading, an email link
     (mailto:), phone, GitHub or LinkedIn, a link back to index.html,
     and the same footer. -->
`},
  solution:{
'index.html':`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Resume</title>
  </head>
  <body>
    <h1>Sam Taylor</h1>
    <img src="https://picsum.photos/seed/profile/200/200" alt="placeholder for my profile photo" height="200" />

    <h2>Summary</h2>
    <p>
      Junior web developer who learned HTML, CSS and JavaScript through a
      full-stack bootcamp. I like turning messy ideas into simple, working
      pages, and I am looking for my first developer role.
    </p>

    <h2>Education</h2>
    <ul>
      <li>The Complete Full-Stack Web Development Bootcamp, online, 2026</li>
      <li>BA History, University of Leeds, 2019–2022</li>
      <li>A levels: History, English, Maths, Riverside College, 2017–2019</li>
    </ul>

    <h2>Work Experience</h2>
    <ul>
      <li>
        <b>Shift Supervisor</b>, The Daily Grind café, 2022–present
        <ul>
          <li>Run a team of four on weekend shifts</li>
          <li>Built the café's first menu web page in plain HTML</li>
        </ul>
      </li>
      <li>
        <b>Library Assistant</b>, Leeds Central Library, 2020–2022
        <ul>
          <li>Helped visitors find records and use the computers</li>
        </ul>
      </li>
    </ul>

    <h2>Skills</h2>
    <ul>
      <li>HTML: headings, lists, links, images, multi-page sites</li>
      <li>Git and GitHub Pages</li>
      <li>Writing clear documentation</li>
      <li>Customer service and team leading</li>
    </ul>

    <h2>Awards and Certifications</h2>
    <ol>
      <li>Employee of the Month, The Daily Grind, March 2025</li>
      <li>First Aid at Work certificate, 2024</li>
    </ol>

    <hr />
    <p>
      More about me: <a href="./hobbies.html">Hobbies</a> ·
      <a href="./contact.html">Contact</a>
    </p>

    <footer>
      <p>© 2026 Sam Taylor. All rights reserved.</p>
    </footer>
  </body>
</html>
`,
'hobbies.html':`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hobbies</title>
  </head>
  <body>
    <h1>Hobbies</h1>
    <p>When I'm not coding:</p>
    <ul>
      <li>Hill walking in the Yorkshire Dales</li>
      <li>Baking bread, badly at first and now quite well</li>
      <li>Pub quizzes (history round specialist)</li>
    </ul>
    <p><a href="./index.html">Back to my résumé</a></p>
    <footer>
      <p>© 2026 Sam Taylor</p>
    </footer>
  </body>
</html>
`,
'contact.html':`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Contact</title>
  </head>
  <body>
    <h1>Contact</h1>
    <ul>
      <li>Email: <a href="mailto:sam.taylor@example.com">sam.taylor@example.com</a></li>
      <li>Phone: 0113 496 0000</li>
      <li>GitHub: <a href="https://github.com/">github.com/sam-taylor</a></li>
    </ul>
    <p><a href="./index.html">Back to my résumé</a></p>
    <footer>
      <p>© 2026 Sam Taylor</p>
    </footer>
  </body>
</html>
`},
  notes:`
    <h3>How to approach a capstone</h3>
    <ul>
      <li>Read the brief and list every requirement before writing any code. The checklist in the Explore tab is that list.</li>
      <li>Build the skeleton first (boilerplate, headings), then fill in one section at a time and check the page after each.</li>
      <li>When you meet something new, like <code>&lt;footer&gt;</code>, look it up on MDN rather than waiting for a video to explain it.</li>
      <li>Make it yours: real (or realistic) content, your own wording. There is no official solution, which is what makes it portfolio material.</li>
    </ul>
    <h3>Publishing</h3>
    <p>Same as lecture 29: a public repository with <code>index.html</code>, <code>hobbies.html</code> and <code>contact.html</code> at its top level, then Settings → Pages → Branch: <code>main</code>.</p>`
};
L31.explore = [
  siteDemo(L31, { origin:'file:///Users/you/Desktop/resume/', note:'Your résumé and its extra pages in a browser that follows the links between them. Edits show up as you type.' }),
  checklist(L31, [
    { desc:'<code>index.html</code> starts with <code>&lt;!DOCTYPE html&gt;</code>', test:DOCTYPE_FIRST },
    { desc:'The title is exactly <code>My Resume</code>', test:"return ((doc.querySelector('title') || {}).textContent || '').trim() === 'My Resume';" },
    { desc:'Your name as the <code>&lt;h1&gt;</code>', test:"var h = doc.querySelector('h1'); return !!h && h.textContent.trim().length > 0;" },
    { desc:'A profile photo: an <code>&lt;img&gt;</code> with alt text', test:"return [].some.call(doc.querySelectorAll('img'), function (i) { return (i.getAttribute('src') || '').trim() && (i.getAttribute('alt') || '').trim(); });" },
    { desc:'At least four sections with <code>&lt;h2&gt;</code> headings', test:"return doc.querySelectorAll('h2').length >= 4;" },
    { desc:'Items in lists: at least three <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code>', test:"return doc.querySelectorAll('ul, ol').length >= 3;" },
    { desc:'Links to <code>hobbies.html</code> and <code>contact.html</code>', test:"var hs = [].map.call(doc.querySelectorAll('a[href]'), function (a) { return a.getAttribute('href').trim().replace(/^\\.\\//, ''); }); return hs.indexOf('hobbies.html') > -1 && hs.indexOf('contact.html') > -1;" },
    { desc:'A <code>&lt;footer&gt;</code> with your name or a copyright line', test:"var f = doc.querySelector('footer'); return !!f && f.textContent.trim().length > 0;" },
    { desc:'<code>hobbies.html</code> has content and a link back to <code>index.html</code>', file:'hobbies.html', test:"return doc.body.textContent.trim().length > 20 && " + "[].some.call(doc.querySelectorAll('a[href]'), function (a) { return /^(\\.\\/)?index\\.html$/.test(a.getAttribute('href').trim()); });" },
    { desc:'<code>contact.html</code> has content and a link back to <code>index.html</code>', file:'contact.html', test:"return doc.body.textContent.trim().length > 20 && " + "[].some.call(doc.querySelectorAll('a[href]'), function (a) { return /^(\\.\\/)?index\\.html$/.test(a.getAttribute('href').trim()); });" },
    { desc:'HTML only: no <code>&lt;style&gt;</code>, <code>style=""</code>, stylesheet or <code>&lt;script&gt;</code> in any file', test:"return Object.keys(files).every(function (n) { return !/<style[\\s>]|\\sstyle\\s*=|<script[\\s>]|rel\\s*=\\s*[\"']?stylesheet/i.test(files[n]); });" },
  ], 'Capstone checklist', 'The brief as a checklist, reading all three files from the Build tab.'),
];
PG.add(L31);

})();
