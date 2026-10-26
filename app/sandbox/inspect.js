/* =========================================================================
   pgInspect(value, nodeStyle) — turns any value into the one-line text a
   console shows for it. Browser style follows Chrome DevTools
   ({a: 1, b: 'x'}, [1, 2], ƒ name()); node style follows Node's console.log
   ({ a: 1, b: 'x' }, [ 1, 2 ], [Function: name]).
   Used by the preview shims (embedded through pgInspect.toString()), the
   React runtime and the Node simulator.
   ========================================================================= */
function pgInspect(value, nodeStyle) {
  var MAX_ITEMS = 100, MAX_DEPTH = 2, MAX_STR = 10000;
  var seen = [];
  function q(s) {
    s = String(s);
    if (s.length > MAX_STR) s = s.slice(0, MAX_STR) + '…';
    return nodeStyle ? "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'" : "'" + s.replace(/\n/g, '\\n') + "'";
  }
  function num(n) { return Object.is(n, -0) ? '-0' : String(n); }
  function isEl(v) { return v && typeof v === 'object' && v.nodeType === 1 && typeof v.tagName === 'string'; }
  function elText(el) {
    var attrs = '';
    if (el.id) attrs += ' id="' + el.id + '"';
    var cls = typeof el.className === 'string' ? el.className : (el.getAttribute && el.getAttribute('class'));
    if (cls) attrs += ' class="' + cls + '"';
    ['href', 'src', 'type', 'name', 'value'].forEach(function (a) { if (el.getAttribute && el.getAttribute(a) != null && a !== 'value') attrs += ' ' + a + '="' + el.getAttribute(a) + '"'; });
    var tag = el.tagName.toLowerCase(), txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
    if (txt.length > 30) txt = txt.slice(0, 30) + '…';
    return '<' + tag + attrs + '>' + (el.children && el.children.length ? '…' : txt) + '</' + tag + '>';
  }
  function ctorName(v) { try { var c = Object.getPrototypeOf(v); return c && c.constructor && c.constructor.name || ''; } catch (e) { return ''; } }
  function fn(v) { var n = v.name || 'anonymous'; return nodeStyle ? (/^class\s/.test(Function.prototype.toString.call(v)) ? '[class ' + n + ']' : '[Function: ' + n + ']') : 'ƒ ' + n + '()'; }
  function key(k) { return /^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k); }
  function inner(v, depth) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    var t = typeof v;
    if (t === 'string') return q(v);
    if (t === 'number') return num(v);
    if (t === 'bigint') return v + 'n';
    if (t === 'boolean') return String(v);
    if (t === 'symbol') return v.toString();
    if (t === 'function') return fn(v);
    return obj(v, depth);
  }
  function list(items, depth, open, close) {
    var out = [], n = Math.min(items.length, MAX_ITEMS);
    for (var i = 0; i < n; i++) out.push(items[i] === undefined && !(i in items) ? 'empty' : inner(items[i], depth + 1));
    if (items.length > MAX_ITEMS) out.push('… ' + (items.length - MAX_ITEMS) + ' more');
    if (!out.length) return open + close;
    return nodeStyle ? open + ' ' + out.join(', ') + ' ' + close : open + out.join(', ') + close;
  }
  function obj(v, depth) {
    if (seen.indexOf(v) !== -1) return '[Circular]';
    if (v instanceof Error) return depth ? '[' + (v.name || 'Error') + ': ' + v.message + ']' : (v.stack || (v.name + ': ' + v.message));
    if (v instanceof Date) return isNaN(v) ? 'Invalid Date' : (nodeStyle ? v.toISOString() : v.toString());
    if (v instanceof RegExp) return String(v);
    if (typeof Promise !== 'undefined' && v instanceof Promise) return 'Promise {<pending>}';
    if (isEl(v)) return elText(v);
    if (v && typeof v === 'object' && v.nodeType === 3) return '"' + v.textContent + '"';
    if (v && v.nodeType === 9) return '#document';
    var name = ctorName(v);
    if (typeof Event !== 'undefined' && v instanceof Event) {
      var props = ['type', 'key', 'code', 'button', 'clientX', 'clientY', 'target'], parts = [];
      props.forEach(function (p) { if (p in v && v[p] !== undefined && v[p] !== '') parts.push(p + ': ' + (p === 'target' && isEl(v[p]) ? elText(v[p]) : inner(v[p], depth + 1))); });
      return name + ' {' + parts.join(', ') + '}';
    }
    if (depth > MAX_DEPTH) return Array.isArray(v) ? (nodeStyle ? '[Array]' : '[…]') : (nodeStyle ? '[Object]' : '{…}');
    seen.push(v);
    try {
      if (Array.isArray(v)) return (!nodeStyle && v.length > 1 ? '(' + v.length + ') ' : '') + list(v, depth, '[', ']');
      if (name === 'NodeList' || name === 'HTMLCollection' || (typeof v.length === 'number' && typeof v.item === 'function')) {
        return name + '(' + v.length + ') ' + list(Array.prototype.slice.call(v), depth, '[', ']');
      }
      if (typeof Map !== 'undefined' && v instanceof Map) { var me = []; v.forEach(function (val, k) { me.push(inner(k, depth + 1) + ' => ' + inner(val, depth + 1)); }); return 'Map(' + v.size + ') {' + (nodeStyle && me.length ? ' ' + me.join(', ') + ' ' : me.join(', ')) + '}'; }
      if (typeof Set !== 'undefined' && v instanceof Set) { var se = []; v.forEach(function (val) { se.push(inner(val, depth + 1)); }); return 'Set(' + v.size + ') {' + (nodeStyle && se.length ? ' ' + se.join(', ') + ' ' : se.join(', ')) + '}'; }
      var keys = Object.keys(v), entries = [];
      for (var i = 0; i < Math.min(keys.length, MAX_ITEMS); i++) {
        var val; try { val = v[keys[i]]; } catch (e) { val = '[getter]'; }
        entries.push(key(keys[i]) + ': ' + inner(val, depth + 1));
      }
      if (keys.length > MAX_ITEMS) entries.push('…');
      var prefix = name && name !== 'Object' ? name + ' ' : '';
      if (!entries.length) return prefix + '{}';
      return prefix + (nodeStyle ? '{ ' + entries.join(', ') + ' }' : '{' + entries.join(', ') + '}');
    } finally { seen.pop(); }
  }
  // top-level strings print without quotes, like console.log
  if (typeof value === 'string') return value;
  return inner(value, 0);
}
if (typeof module === 'object' && module.exports) module.exports = pgInspect;
