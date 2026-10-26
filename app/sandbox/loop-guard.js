/* =========================================================================
   Loop guard: rewrites learner code so every for / while / do loop calls
   __pgGuard() on each pass. The guard throws once a single task has been
   looping for more than LIMIT ms, so an endless loop stops with an error
   instead of freezing the page (the previews share the app's thread).

   LoopGuard.instrument(code) → code   (returns the input unchanged if unsure)
   LoopGuard.source                    → JS source that defines __pgGuard
   Works in the browser and in Node (tools/validate.js).
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LoopGuard = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const LIMIT = 1500;

  // defines __pgGuard in whatever scope it is evaluated in
  const source = `var __pgGuard = (function () {
  var start = 0, count = 0;
  return function () {
    if ((++count & 1023) !== 0) return;
    var now = Date.now();
    if (!start) { start = now; setTimeout(function () { start = 0; }, 0); return; }
    if (now - start > ${LIMIT}) {
      start = 0;
      throw new Error('Stopped a loop that kept running for more than ${LIMIT / 1000} seconds. Is it an infinite loop? Check its condition and the line that should change it.');
    }
  };
})();`;

  const REGEX_BEFORE = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^', '']);
  const REGEX_KEYWORDS = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await']);

  function instrument(code) {
    try { return run(String(code)); } catch (e) { return code; }
  }

  function run(src) {
    const out = [];          // pieces of output
    let i = 0, last = '';    // last significant char (for regex detection)
    let lastWord = '';
    const braces = [];       // stack of brace kinds: 'do' | 'loop' | 'other'
    let pendingBrace = null; // kind for the next '{'
    let lastClosed = null;   // kind of the most recently closed brace
    const n = src.length;
    const isId = c => /[A-Za-z0-9_$]/.test(c);

    // copy a string/template/comment/regex starting at i, return new index
    function skipString(q, j) {
      j++;
      while (j < n) {
        const c = src[j];
        if (c === '\\') { j += 2; continue; }
        if (q === '`' && c === '$' && src[j + 1] === '{') { j = skipBraces(j + 1); continue; }
        if (c === q) return j + 1;
        if (q !== '`' && c === '\n') return j;   // unterminated: give up on this string
        j++;
      }
      return j;
    }
    function skipBraces(j) {        // j at '{' inside a template: skip to matching '}'
      let depth = 0;
      while (j < n) {
        const c = src[j];
        if (c === '"' || c === "'" || c === '`') { j = skipString(c, j); continue; }
        if (c === '{') depth++;
        if (c === '}') { depth--; if (depth === 0) return j + 1; }
        j++;
      }
      return j;
    }
    function skipComment(j) {
      if (src[j + 1] === '/') { const k = src.indexOf('\n', j); return k < 0 ? n : k; }
      const k = src.indexOf('*/', j + 2); return k < 0 ? n : k + 2;
    }
    function skipRegex(j) {
      j++; let inClass = false;
      while (j < n) {
        const c = src[j];
        if (c === '\\') { j += 2; continue; }
        if (c === '\n') return j;
        if (inClass) { if (c === ']') inClass = false; }
        else if (c === '[') inClass = true;
        else if (c === '/') { j++; while (j < n && /[a-z]/i.test(src[j])) j++; return j; }
        j++;
      }
      return j;
    }
    function skipSpace(j) {         // whitespace and comments
      while (j < n) {
        if (/\s/.test(src[j])) { j++; continue; }
        if (src[j] === '/' && (src[j + 1] === '/' || src[j + 1] === '*')) { j = skipComment(j); continue; }
        break;
      }
      return j;
    }
    function matchParen(j) {        // j at '(' — return index after matching ')' or -1
      let depth = 0;
      while (j < n) {
        const c = src[j];
        if (c === '"' || c === "'" || c === '`') { j = skipString(c, j); continue; }
        if (c === '/' && (src[j + 1] === '/' || src[j + 1] === '*')) { j = skipComment(j); continue; }
        if (c === '(') depth++;
        else if (c === ')') { depth--; if (depth === 0) return j + 1; }
        j++;
      }
      return -1;
    }
    function statementEnd(j) {      // a braceless loop body: index after its ';' or -1
      let depth = 0;
      while (j < n) {
        const c = src[j];
        if (c === '"' || c === "'" || c === '`') { j = skipString(c, j); continue; }
        if (c === '/' && (src[j + 1] === '/' || src[j + 1] === '*')) { j = skipComment(j); continue; }
        if (c === '{' || c === '}') return -1;
        if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth--;
        else if (c === ';' && depth === 0) return j + 1;
        else if (c === '\n' && depth === 0 && /[\w)\]'"`]/.test(src[j - 1] || '')) return -1; // no semicolon: leave it
        j++;
      }
      return -1;
    }

    let copied = 0;
    const emit = upto => { if (upto > copied) { out.push(src.slice(copied, upto)); copied = upto; } };

    while (i < n) {
      const c = src[i];
      if (c === '"' || c === "'" || c === '`') { i = skipString(c, i); last = c; lastWord = ''; continue; }
      if (c === '/' && (src[i + 1] === '/' || src[i + 1] === '*')) { i = skipComment(i); continue; }
      if (c === '/') {
        if (REGEX_BEFORE.has(last) || REGEX_KEYWORDS.has(lastWord)) { i = skipRegex(i); last = '/re'; lastWord = ''; continue; }
        i++; last = '/'; lastWord = ''; continue;
      }
      if (isId(c) && !isId(src[i - 1] || '') && src[i - 1] !== '.') {
        let j = i; while (j < n && isId(src[j])) j++;
        const word = src.slice(i, j);
        if (word === 'for' || word === 'while') {
          // `} while (...)` closing a do-block is not a new loop
          const isDoTail = word === 'while' && last === '}' && lastClosed === 'do';
          let k = skipSpace(j);
          if (word === 'for' && src.startsWith('await', k) && !isId(src[k + 5] || '')) k = skipSpace(k + 5);
          if (!isDoTail && src[k] === '(') {
            const end = matchParen(k);
            if (end < 0) throw new Error('unbalanced');
            const b = skipSpace(end);
            if (src[b] === '{') {
              emit(b + 1); out.push(' __pgGuard();');
              braces.push('loop'); i = b + 1; last = '{'; lastWord = ''; pendingBrace = null; continue;
            }
            if (src[b] === ';') {          // empty body: while (x);
              emit(b); out.push('{ __pgGuard(); }'); copied = b + 1;
              i = b + 1; last = ';'; lastWord = ''; continue;
            }
            const se = statementEnd(b);
            if (se > 0) {                  // single statement body
              emit(b); out.push('{ __pgGuard(); '); emit(se); out.push(' }');
              i = se; last = ';'; lastWord = ''; continue;
            }
            i = end; last = ')'; lastWord = ''; continue;   // leave anything unusual alone
          }
        }
        if (word === 'do') { const k = skipSpace(j); if (src[k] === '{') { emit(k + 1); out.push(' __pgGuard();'); braces.push('do'); i = k + 1; last = '{'; lastWord = ''; continue; } }
        i = j; last = 'a'; lastWord = word; continue;
      }
      if (c === '{') { braces.push(pendingBrace || 'other'); pendingBrace = null; }
      else if (c === '}') { lastClosed = braces.pop() || 'other'; }
      if (!/\s/.test(c)) { last = c; lastWord = ''; }
      i++;
    }
    emit(n);
    return out.join('');
  }

  return { instrument, source, LIMIT };
});
