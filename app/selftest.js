/* =========================================================================
   #/selftest — runs every lesson's solution through its kit and lists failures.
   Each kit implements selftest(lesson) → Promise<{ok, errors[]}>.
   ========================================================================= */
window.PGSelfTest = (function () {
  const { esc } = PG;
  let running = false;

  async function render() {
    const main = document.getElementById('main');
    const all = PG.manifest.map(m => PG.lessons[m.id]).filter(Boolean);
    const q = new URLSearchParams(location.hash.split('?')[1] || '');
    const only = q.get('kind'), sec = q.get('section'), from = Number(q.get('from') || 0);
    const list = all.filter(l => (!only || l.kind === only) && (!sec || l.section === sec) && (!from || (l.index || 0) >= from));
    main.innerHTML = `<div class="selftest">
      <h1>Self-test</h1>
      <p class="sub">${list.length} lessons. Runs each lesson's solution in its kit and reports errors. Filter with <code>#/selftest?kind=node</code>, <code>?section=s24</code> or <code>?from=200</code>.</p>
      <p id="stProgress"></p>
      <table><thead><tr><th>ok</th><th>#</th><th>lesson</th><th>kind</th><th>errors</th></tr></thead><tbody id="stBody"></tbody></table>
    </div>`;
    if (running) return;
    running = true;
    const body = document.getElementById('stBody'), prog = document.getElementById('stProgress');
    let fails = 0;
    for (let i = 0; i < list.length; i++) {
      const l = list[i];
      prog.textContent = `${i + 1} / ${list.length} — ${l.index || ''} ${l.title}`;
      const kit = PG.kits[l.kind] || PG.kits.read;
      let r;
      try { r = kit.selftest ? await kit.selftest(l) : { ok: true, errors: [] }; }
      catch (e) { r = { ok: false, errors: [String(e && e.message || e)] }; }
      if (!r.ok) fails++;
      const tr = document.createElement('tr');
      tr.className = r.ok ? 'ok' : 'bad';
      tr.innerHTML = `<td>${r.ok ? '✓' : '✗'}</td><td>${l.index || ''}${l.sub || ''}</td><td><a href="#/${l.section}/${l.slug}">${esc(l.title)}</a></td><td>${l.kind}</td><td>${(r.errors || []).map(esc).join('<br>')}</td>`;
      if (!r.ok) body.prepend(tr); else body.appendChild(tr);
      if (location.hash.indexOf('#/selftest') !== 0) break;
    }
    prog.textContent = `Done: ${list.length - fails} passed, ${fails} failed.`;
    running = false;
  }
  return { render };
})();
