/* =========================================================================
   Kit: read (theory, tips, admin) and walkthrough (code shown and explained,
   not run — used for the Web3 / Motoko sections).
   A walkthrough lesson lists its files; they open as read-only code tabs.
   Optional `steps`: [{title, text, file, lines:[from,to]}] — clicking a step
   opens the file and highlights the lines.
   ========================================================================= */
(function () {
  const { esc, attr, makeEditor } = PG;

  function mountRead(lesson, host) {
    // the lesson's own notes followed by the full lecture notes (merged by core)
    const notesHtml = lesson._notesHtml || lesson.notes || PG.notesById[lesson.id] || '';
    const body = lesson.body || '';
    host.innerHTML = `
      <div class="read-wrap">
        ${body ? `<div class="notes">${body}</div>` : ''}
        ${!body && notesHtml ? `<div class="notes">${notesHtml}</div>` : ''}
        ${!body && !notesHtml ? '<p class="sub" style="padding:20px 26px">Nothing to build here — this lecture is a short video or an article. See the Notes tab.</p>' : ''}
        ${lesson.links && lesson.links.length ? `
          <div class="link-list"><h3>Links</h3><ul>${lesson.links.map(l => `<li><a href="${attr(l.url)}" target="_blank" rel="noopener">${esc(l.title || l.url)}</a>${l.note ? ' — ' + esc(l.note) : ''}</li>`).join('')}</ul></div>` : ''}
      </div>`;
    // hide the Notes tab when the main pane already shows the notes
    if (!body && notesHtml) {
      const nb = document.querySelector('.tabs button[data-tab="notes"]');
      if (nb) nb.style.display = 'none';
    }
    highlight(host);
  }

  function highlight(host) {
    if (!window.CodeMirror || !CodeMirror.runMode) return;
    host.querySelectorAll('pre[data-lang]:not([data-hl])').forEach(pre => {
      const code = pre.textContent, mode = PG.modeFor('x.' + (pre.dataset.lang || 'txt'));
      pre.dataset.hl = '1';
      if (!mode) return;
      pre.innerHTML = ''; pre.classList.add('cm-s-material-darker');
      CodeMirror.runMode(code, mode, pre);
    });
  }

  function mountWalkthrough(lesson, host) {
    const names = Object.keys(lesson.files);
    const steps = lesson.steps || [];
    host.innerHTML = `
      <div class="walk ${names.length ? '' : 'no-code'}">
        <div class="walk-steps">
          ${lesson.intro ? `<div class="walk-intro">${lesson.intro}</div>` : ''}
          ${steps.length ? `<ol class="steps">${steps.map((s, i) => `
            <li class="step" data-i="${i}">
              <div class="step-title">${esc(s.title)}</div>
              <div class="step-text">${s.text || ''}</div>
              ${s.file ? `<div class="step-file">${esc(s.file)}${s.lines ? ` · lines ${s.lines[0]}–${s.lines[1]}` : ''}</div>` : ''}
            </li>`).join('')}</ol>` : ''}
          ${!steps.length && !lesson.intro ? '<p class="sub">The code for this lecture is on the right. See the Notes tab for the walkthrough.</p>' : ''}
        </div>
        ${names.length ? `
        <div class="walk-code">
          <div class="editor-bar"><div class="filetabs">${names.map((n, i) => `<button class="filetab ${i === 0 ? 'on' : ''}" data-file="${attr(n)}">${esc(n)}</button>`).join('')}</div></div>
          <div class="editor-wrap">${names.map((n, i) => `<div class="ed ${i === 0 ? 'on' : ''}" data-ed="${attr(n)}"></div>`).join('')}</div>
        </div>` : ''}
      </div>`;
    const editors = {};
    names.forEach(n => {
      editors[n] = makeEditor(host.querySelector(`[data-ed="${CSS.escape(n)}"]`), lesson.files[n], n, { readOnly: true });
    });
    function showFile(n) {
      host.querySelectorAll('.filetab').forEach(x => x.classList.toggle('on', x.dataset.file === n));
      host.querySelectorAll('.ed').forEach(x => x.classList.toggle('on', x.dataset.ed === n));
      if (editors[n]) editors[n].refresh();
    }
    host.querySelectorAll('.filetab').forEach(b => b.onclick = () => showFile(b.dataset.file));
    let marked = [];
    host.querySelectorAll('.step').forEach(li => li.onclick = () => {
      const s = steps[+li.dataset.i];
      host.querySelectorAll('.step').forEach(x => x.classList.toggle('on', x === li));
      if (!s.file || !editors[s.file]) return;
      showFile(s.file);
      marked.forEach(m => m.clear()); marked = [];
      const cm = editors[s.file];
      if (s.lines) {
        for (let ln = s.lines[0] - 1; ln < s.lines[1]; ln++) marked.push(cm.markText({ line: ln, ch: 0 }, { line: ln + 1, ch: 0 }, { className: 'cm-step-hl' }));
        cm.scrollIntoView({ line: s.lines[0] - 1, ch: 0 }, 120);
      }
    });
    highlight(host);
    const refresh = () => Object.values(editors).forEach(e => e.refresh());
    window.addEventListener('pg:refresh', refresh);
    return () => window.removeEventListener('pg:refresh', refresh);
  }

  PG.registerKit('read', { mount: mountRead, tabLabel: 'Lecture', selftest: () => Promise.resolve({ ok: true, errors: [] }) });
  PG.registerKit('walkthrough', { mount: mountWalkthrough, tabLabel: 'Walkthrough', selftest: () => Promise.resolve({ ok: true, errors: [] }) });
})();
