#!/usr/bin/env node
/* One-off: stamps the original 67 lessons with their lecture numbers
   (index/sub), Udemy ids and durations from content/manifest.txt. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const MAP = {   // lesson id -> lecture index (and optional sub letter for exercises between lectures)
  's01-how-the-web-works': 6,
  's02-headings': 13, 's02-paragraphs': 14, 's02-void-elements': 15, 's02-movie-ranking': 16,
  's03-lists': 18, 's03-nesting': 19, 's03-anchors': 20, 's03-images': 21, 's03-birthday': 22,
  's04-file-paths': 25, 's04-webpages': 26, 's04-portfolio': 28,
  's05-adding-css': 33, 's05-selectors': 34, 's05-color-vocab': 35,
  's06-colors': 38, 's06-fonts': 39, 's06-box-model': 41, 's06-meme': 42,
  's07-cascade': 43, 's07-combining': 44, 's07-positioning': 45, 's07-flag': 46,
  's08-display': 48, 's08-float': 49, 's08-responsive': 50, 's08-media-query': 51, 's08-agency': 52,
  's09-display-flex': 54, 's09-flex-direction': 55, 's09-pricing': 58,
  's10-display-grid': 60, 's10-grid-sizing': 61, 's10-grid-placement': 62, 's10-mondrian': 63,
  's11-intro': 64, 's11-components': 66, 's11-tindog': 67,
  's14-alerts': 76, 's14-data-types': 77, 's14-variables': 78, 's14-naming': 81, 's14-concat': 82, 's14-length': 83, 's14-slice': 84,
  's14-casing': 85, 's14-arithmetic': 87, 's14-increment': 88, 's14-functions-1': 89, 's14-functions-2': 93, 's14-life-in-weeks': '93b',
  's14-functions-3': 95, 's14-bmi': 96,
  's15-random': 99, 's15-if-else': 100, 's15-comparators': 101, 's15-combining': 102, 's15-bmi-advanced': '102b', 's15-leap-year': 103,
  's15-arrays': 105, 's15-array-methods': 106, 's15-lunch': '106b', 's15-while': 108, 's15-bottles': '108b', 's15-for': 110, 's15-fibonacci': 111,
};
const manifest = {};
fs.readFileSync(path.join(ROOT, 'content', 'manifest.txt'), 'utf8').split('\n').forEach(l => {
  if (!l || l.startsWith('#')) return; const [i, id, title, type, mins] = l.split('|'); manifest[Number(i)] = { udemyId: Number(id), minutes: Number(mins), type };
});
let n = 0;
fs.readdirSync(path.join(ROOT, 'data')).filter(f => /^s\d\d\.js$/.test(f)).forEach(f => {
  const p = path.join(ROOT, 'data', f); let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/id:'([^']+)',/g, (m, id) => {
    if (!(id in MAP) || /index:/.test(s.slice(s.indexOf(m), s.indexOf(m) + 200))) return m;
    const v = String(MAP[id]); const idx = parseInt(v, 10); const sub = v.replace(/^\d+/, '');
    const info = manifest[idx] || {}; n++;
    return `id:'${id}', index:${idx},${sub ? ` sub:'${sub}',` : ''} udemyId:${info.udemyId || 0}, minutes:${sub ? 0 : (info.minutes || 0)},`;
  });
  fs.writeFileSync(p, s);
});
console.log(`stamped ${n} lessons`);
