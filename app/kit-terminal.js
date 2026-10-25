/* =========================================================================
   Kit: terminal — a shell with a virtual filesystem and a simulated git.
   Lesson fields:
     fs:       { '/Users/you/Desktop/Project': null, '/Users/you/notes.txt': 'text' }
               (null = folder, string = file). Home is /Users/you.
     cwd:      starting folder (default /Users/you)
     solution: ['cd Desktop', 'mkdir Project', ...]  commands, shown (and replayable)
     checks:   [{ desc, test: 'return fs.exists("/Users/you/Desktop/Project")' }]
               test bodies get {fs, git, shell}: fs.exists/read/isDir/list,
               git(path?) → {branch, branches, commits, staged, untracked, remotes, pushed} or null,
               shell.cwd / shell.history
   ========================================================================= */
(function () {
  const { esc, attr, store, toast } = PG;

  function mount(lesson, host) {
    const sh = ShellSim.create({ files: lesson.fs || { '/Users/you/Desktop': null, '/Users/you/Documents': null, '/Users/you/Downloads': null }, cwd: lesson.cwd || '/Users/you' });
    sh.hooks.node = (path, code) => {
      if (!path) return 'Node REPL is not available here — run a file instead, e.g. node index.js';
      const logs = [];
      try {
        const fn = new Function('console', 'require', 'process', code);
        fn({ log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push(a.map(String).join(' ')) },
           () => { throw new Error('require() is not available in this small terminal — use a Node lesson for modules'); }, { argv: ['node', path], env: {} });
      } catch (e) { logs.push(String(e.message || e)); }
      return logs.join('\n');
    };
    const solution = lesson.solution && Array.isArray(lesson.solution) ? lesson.solution : null;
    host.innerHTML = `
      <div class="term-layout ${lesson.tasks.length ? '' : 'tall'}">
        <div class="term-col">
          <div class="out-bar">
            <span class="hint-inline">Type a command and press Enter · ↑↓ history · Tab completes names</span>
            <span style="flex:1"></span>
            ${lesson.checks && lesson.checks.length ? '<button class="btn" id="checkBtn">Check my work</button>' : ''}
            ${solution ? '<button class="btn" id="solBtn">Show solution</button>' : ''}
            <button class="btn ghost" id="resetBtn">Reset</button>
          </div>
          <div class="term" id="term"><div class="term-out" id="termOut"></div>
            <div class="term-line"><span class="term-prompt" id="termPrompt"></span><input class="term-in" id="termIn" autocomplete="off" spellcheck="false"></div>
          </div>
          ${solution ? `<div class="term-solution" id="solBox" style="display:none"><div class="console-head">Solution <span style="flex:1"></span><button class="btn ghost" id="replayBtn">Run these commands</button></div><pre>${esc(solution.join('\n'))}</pre></div>` : ''}
        </div>
        <div class="term-side">
          <div class="console-head">Files <span class="dim" style="text-transform:none;letter-spacing:0;font-weight:400">(live view of the virtual disk)</span></div>
          <div class="tree" id="tree"></div>
          <div class="console-head">Git</div>
          <div class="gitbox" id="gitbox"></div>
          ${lesson.checks && lesson.checks.length ? `<div class="console-head">Checks</div><div class="checks" id="checks">${lesson.checks.map((c, i) => `<div class="check" data-i="${i}"><span class="tick">○</span> ${c.desc}</div>`).join('')}</div>` : ''}
        </div>
      </div>`;
    const out = host.querySelector('#termOut'), input = host.querySelector('#termIn'), promptEl = host.querySelector('#termPrompt');
    const hist = []; let hi = 0;

    function print(text, cls) {
      if (text === '' || text == null) return;
      const d = document.createElement('div'); d.className = 'term-row ' + (cls || ''); d.textContent = text; out.appendChild(d);
    }
    function refresh() {
      promptEl.textContent = sh.prompt() + ' ';
      host.querySelector('#term').scrollTop = 1e9;
      // file tree
      const paths = sh.fs.tree().filter(p => p !== '/' && p !== '/Users');
      host.querySelector('#tree').innerHTML = paths.map(p => {
        const depth = p.split('/').length - 3; if (depth < 0) return '';
        const name = p.slice(p.lastIndexOf('/') + 1); const dir = sh.fs.isDir(p);
        const cur = p === sh.cwd;
        return `<div class="tree-row ${cur ? 'cur' : ''} ${name.startsWith('.') ? 'dot' : ''}" style="padding-left:${8 + depth * 14}px">${dir ? '📁' : '📄'} ${esc(name)}${cur ? ' <span class="dim">← you are here</span>' : ''}</div>`;
      }).join('');
      const g = sh.gitInfo();
      host.querySelector('#gitbox').innerHTML = !g ? '<div class="dim">No repository in this folder (git init creates one)</div>' : `
        <div><b>branch</b> ${esc(g.branch)} <span class="dim">(${g.branches.join(', ')})</span></div>
        <div><b>commits</b> ${g.commits.length}${g.commits[0] ? ` · last: <span class="dim">${esc(g.commits[0].msg)}</span>` : ''}</div>
        <div><b>staged</b> ${g.staged.length} · <b>changed</b> ${g.unstaged.length} · <b>untracked</b> ${g.untracked.length}</div>
        ${Object.keys(g.remotes).length ? `<div><b>remote</b> ${esc(Object.values(g.remotes)[0])}${g.pushed[g.branch] === (g.commits[0] || {}).id ? ' <span class="ok">pushed</span>' : ' <span class="warn">not pushed</span>'}</div>` : ''}`;
    }
    function exec(line, echo) {
      if (echo !== false) print(sh.prompt() + ' ' + line, 'cmd');
      const r = sh.run(line);
      if (r.clear) out.innerHTML = '';
      else print(r.out);
      if (r.exit) print('(session ended — press Reset to start again)', 'dim');
      refresh();
    }
    input.onkeydown = e => {
      if (e.key === 'Enter') { const line = input.value; input.value = ''; if (line.trim()) { hist.push(line); hi = hist.length; } exec(line); }
      else if (e.key === 'ArrowUp') { if (hi > 0) { hi--; input.value = hist[hi]; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } e.preventDefault(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.value.split(' '); const last = parts[parts.length - 1];
        const dir = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : ''; const stem = last.slice(dir.length);
        const names = (sh.fs.list(dir || '.') || []).filter(n => n.startsWith(stem));
        if (names.length === 1) { parts[parts.length - 1] = dir + names[0] + (sh.fs.isDir((dir || './') + names[0]) ? '/' : ''); input.value = parts.join(' '); }
        else if (names.length > 1) print(names.join('   '), 'dim');
      }
      else if (e.key === 'c' && e.ctrlKey) { input.value = ''; print('^C', 'dim'); }
      else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; }
    };
    host.querySelector('#term').onclick = () => input.focus();
    host.querySelector('#resetBtn').onclick = () => { PG.store.clearCode(lesson.id); mount(lesson, host); toast('Terminal reset'); };
    const solBtn = host.querySelector('#solBtn');
    if (solBtn) solBtn.onclick = () => { const b = host.querySelector('#solBox'); b.style.display = b.style.display === 'none' ? '' : 'none'; };
    const replay = host.querySelector('#replayBtn');
    if (replay) replay.onclick = () => { solution.forEach(c => exec(c)); };
    const checkBtn = host.querySelector('#checkBtn');
    if (checkBtn) checkBtn.onclick = () => runChecks(lesson, sh, host);
    print(lesson.welcome || 'Last login: today on ttys001', 'dim');
    refresh();
    setTimeout(() => input.focus(), 50);
    return () => {};
  }

  function evalCheck(c, sh) {
    const api = { fs: sh.fs, git: p => sh.gitInfo(p), shell: { cwd: sh.cwd, history: sh.history, home: sh.home } };
    const fn = new Function('fs', 'git', 'shell', c.test);
    return !!fn(api.fs, api.git, api.shell);
  }
  function runChecks(lesson, sh, host) {
    let all = true;
    lesson.checks.forEach((c, i) => {
      const el = host.querySelector(`.check[data-i="${i}"]`); let ok = false;
      try { ok = evalCheck(c, sh); } catch (e) { el.title = e.message; }
      el.classList.toggle('ok', ok); el.classList.toggle('bad', !ok); el.querySelector('.tick').textContent = ok ? '✓' : '✗';
      all = all && ok;
    });
    toast(all ? 'All checks pass' : 'Not there yet — see the ✗ items');
  }

  /* Self-test: replay the solution commands and run the checks. */
  function selftest(lesson) {
    const errors = [];
    try {
      const sh = ShellSim.create({ files: lesson.fs || {}, cwd: lesson.cwd || '/Users/you' });
      sh.hooks.node = () => '';
      (Array.isArray(lesson.solution) ? lesson.solution : []).forEach(c => { const r = sh.run(c); if (/not found|No such file|fatal:|usage:|error:/.test(r.out || '')) errors.push(`"${c}" → ${r.out.split('\n')[0]}`); });
      (lesson.checks || []).forEach(c => { try { if (!evalCheck(c, sh)) errors.push('check failed after solution: ' + c.desc); } catch (e) { errors.push('check threw: ' + c.desc + ' — ' + e.message); } });
    } catch (e) { errors.push(e.message); }
    return Promise.resolve({ ok: errors.length === 0, errors });
  }

  PG.registerKit('terminal', { mount, selftest, tabLabel: 'Terminal' });
})();
