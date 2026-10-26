/* =========================================================================
   Shell simulator: a small Unix-like shell over a virtual filesystem, with a
   simulated git. Used by the terminal kit in the browser and by tools/validate.js
   in Node (plain JS, no DOM).

   const sh = ShellSim.create({ files: {'/Users/you/Desktop': null, '/Users/you/Desktop/notes.txt': 'hi'}, cwd: '/Users/you' })
   sh.run('ls -a')  → { out: 'text', clear?: true, exit?: true }
   sh.fs            → virtual filesystem helpers (exists, read, write, isDir, list)
   sh.git(path)     → git repo state for the repo containing path (or null)
   sh.hooks.node / .npm let the host run JavaScript files or install packages.
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ShellSim = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function normalize(p) {
    const abs = p.startsWith('/');
    const out = [];
    p.split('/').forEach(s => { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); });
    return (abs ? '/' : '') + out.join('/') || (abs ? '/' : '.');
  }
  function join(a, b) { return normalize(b.startsWith('/') ? b : (a === '/' ? '/' : a + '/') + b); }
  function dirname(p) { const i = p.lastIndexOf('/'); return i <= 0 ? '/' : p.slice(0, i); }
  function basename(p) { return p.slice(p.lastIndexOf('/') + 1); }
  function pad(s, n) { s = String(s); return s + ' '.repeat(Math.max(0, n - s.length)); }

  function create(opts) {
    opts = opts || {};
    const home = opts.home || '/Users/you';
    const user = opts.user || 'you';
    let cwd = opts.cwd || home;
    const files = new Map();     // path -> { type: 'dir'|'file', content }
    const repos = new Map();     // repo root path -> git state
    const history = [];
    const hooks = { node: null, npm: null };
    const remotes = opts.remotes || {};     // url -> { file: content } used by git clone
    let clock = 1700000000000;   // deterministic "time" for commit dates

    function mkdirp(p) {
      const parts = normalize(p).split('/').filter(Boolean);
      let cur = '';
      parts.forEach(s => { cur += '/' + s; if (!files.has(cur)) files.set(cur, { type: 'dir' }); });
    }
    mkdirp(home);
    Object.keys(opts.files || {}).forEach(p => {
      const v = opts.files[p];
      if (v === null || typeof v === 'object') mkdirp(p);
      else { mkdirp(dirname(p)); files.set(normalize(p), { type: 'file', content: String(v) }); }
    });

    const fs = {
      exists: p => files.has(resolve(p)),
      isDir: p => (files.get(resolve(p)) || {}).type === 'dir',
      isFile: p => (files.get(resolve(p)) || {}).type === 'file',
      read: p => { const f = files.get(resolve(p)); return f && f.type === 'file' ? f.content : null; },
      write: (p, c) => { p = resolve(p); mkdirp(dirname(p)); files.set(p, { type: 'file', content: String(c) }); },
      mkdir: p => mkdirp(resolve(p)),
      remove: p => { p = resolve(p); [...files.keys()].forEach(k => { if (k === p || k.startsWith(p + '/')) files.delete(k); }); },
      list: p => { p = resolve(p); const pre = p === '/' ? '/' : p + '/';
        return [...files.keys()].filter(k => k.startsWith(pre) && k !== p && !k.slice(pre.length).includes('/')).map(basename).sort(); },
      tree: () => [...files.keys()].sort(),
      all: () => { const o = {}; files.forEach((v, k) => o[k] = v.type === 'dir' ? null : v.content); return o; },
    };
    function resolve(p) {
      if (!p) return cwd;
      if (p === '~' || p.startsWith('~/')) p = home + p.slice(1);
      return join(cwd, p);
    }
    function display(p) { return p === home ? '~' : p.startsWith(home + '/') ? '~' + p.slice(home.length) : p; }
    function prompt() { return `${display(cwd)} $`; }

    /* ---------- argument parsing ---------- */
    function parse(line) {
      const args = []; args.quoted = []; let cur = '', q = null, had = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (q) { if (c === q) q = null; else cur += c; }
        else if (c === '"' || c === "'") { q = c; had = true; }
        else if (/\s/.test(c)) { if (cur || had) { args.push(cur); args.quoted.push(had); cur = ''; had = false; } }
        else cur += c;
      }
      if (cur || had) { args.push(cur); args.quoted.push(had); }
      return args;
    }
    // *.txt, docs/*.md, file?.js — expanded by the shell before the command runs (unquoted only)
    function expand(args) {
      const out = [];
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (args.quoted[i] || !/[*?]/.test(a) || a.startsWith('-')) { out.push(a); continue; }
        const slash = a.lastIndexOf('/');
        const dirPart = slash >= 0 ? a.slice(0, slash + 1) : '';
        const pat = a.slice(slash + 1);
        if (/[*?]/.test(dirPart)) { out.push(a); continue; }
        const re = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        const names = (fs.list(dirPart || '.') || []).filter(n => re.test(n) && (pat.startsWith('.') || !n.startsWith('.')));
        if (!names.length) return { error: `zsh: no matches found: ${a}` };
        names.forEach(n => out.push(dirPart + n));
      }
      return { args: out };
    }
    function flags(args) {
      const f = new Set(), rest = [];
      args.forEach(a => { if (/^-[a-zA-Z]+$/.test(a)) a.slice(1).split('').forEach(c => f.add(c)); else if (/^--\w/.test(a)) f.add(a); else rest.push(a); });
      return { f, rest };
    }

    /* ---------- commands ---------- */
    const commands = {
      pwd: () => cwd,
      whoami: () => user,
      echo: (args) => {
        const i = args.findIndex(a => a === '>' || a === '>>');
        if (i >= 0) { const text = args.slice(0, i).join(' ') + '\n'; const target = resolve(args[i + 1] || '');
          if (args[i] === '>>' && fs.isFile(target)) fs.write(target, fs.read(target) + text); else fs.write(target, text); return ''; }
        return args.join(' ');
      },
      clear: () => ({ clear: true }),
      exit: () => ({ exit: true, out: 'logout' }),
      date: () => new Date(clock).toString(),
      history: () => history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'),
      help: () => 'Commands: pwd ls cd mkdir touch rm cat echo open mv cp clear history git node npm code',
      ls: (args) => {
        const { f, rest } = flags(args);
        const targets = rest.length ? rest : ['.'];
        const longLine = (name, e) => `${e.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}  1 ${user}  staff  ${pad(e.type === 'dir' ? 96 : (e.content || '').length, 6)} ${name}`;
        const errors = [], fileTargets = [], dirTargets = [];
        targets.forEach(t => { const p = resolve(t); if (!files.has(p)) errors.push(`ls: ${t}: No such file or directory`); else if (fs.isFile(p)) fileTargets.push(t); else dirTargets.push(t); });
        const blocks = [];
        // files named on the command line come first, on one line, then each folder's contents
        if (fileTargets.length) blocks.push(f.has('l') ? fileTargets.map(t => longLine(t, files.get(resolve(t)))).join('\n') : fileTargets.join('   '));
        dirTargets.forEach(t => {
          const p = resolve(t);
          let names = fs.list(p);
          if (!f.has('a')) names = names.filter(n => !n.startsWith('.'));
          else names = ['.', '..', ...names];
          const body = f.has('l') ? names.map(n => longLine(n, files.get(join(p, n)) || { type: 'dir' })).join('\n')
            : names.map(n => fs.isDir(join(p, n)) ? n + '/' : n).join('   ');
          blocks.push((targets.length > 1 ? `${t}:\n` : '') + body);
        });
        return errors.concat(blocks.length ? [blocks.join('\n\n')] : []).join('\n');
      },
      cd: (args) => {
        const p = args[0] == null ? home : resolve(args[0]);
        if (!files.has(p)) return `cd: no such file or directory: ${args[0]}`;
        if (!fs.isDir(p)) return `cd: not a directory: ${args[0]}`;
        cwd = p; return '';
      },
      mkdir: (args) => {
        const { f, rest } = flags(args);
        if (!rest.length) return 'usage: mkdir [-p] directory_name ...';
        return rest.map(t => { const p = resolve(t);
          if (files.has(p)) return `mkdir: ${t}: File exists`;
          if (!f.has('p') && !fs.isDir(dirname(p))) return `mkdir: ${t}: No such file or directory`;
          mkdirp(p); return ''; }).filter(Boolean).join('\n');
      },
      touch: (args) => {
        if (!args.length) return 'usage: touch file ...';
        return args.map(t => { const p = resolve(t);
          if (!fs.isDir(dirname(p))) return `touch: ${t}: No such file or directory`;
          if (!files.has(p)) files.set(p, { type: 'file', content: '' }); return ''; }).filter(Boolean).join('\n');
      },
      rm: (args) => {
        const { f, rest } = flags(args);
        if (!rest.length) return 'usage: rm [-r] [-f] file ...';
        return rest.map(t => { const p = resolve(t);
          if (!files.has(p)) return f.has('f') ? '' : `rm: ${t}: No such file or directory`;
          if (fs.isDir(p) && !f.has('r')) return `rm: ${t}: is a directory`;
          if (p === home || p === '/') return `rm: refusing to remove ${t}`;
          fs.remove(p); return ''; }).filter(Boolean).join('\n');
      },
      cat: (args) => args.length ? args.map(t => { const c = fs.read(t); return c == null ? (fs.isDir(t) ? `cat: ${t}: Is a directory` : `cat: ${t}: No such file or directory`) : c.replace(/\n$/, ''); }).join('\n') : 'usage: cat file ...',
      open: (args) => {
        let app = null;
        const ai = args.indexOf('-a'); if (ai >= 0) { app = args[ai + 1]; args = args.slice(0, ai).concat(args.slice(ai + 2)); }
        if (!args.length) return app ? `(opened ${app})` : 'usage: open [-a application] file-or-folder';
        if (app) return args.map(t => fs.exists(t) ? `(opened ${basename(resolve(t))} in ${app})` : `The file ${t} does not exist.`).join('\n');
        return args.map(t => { const p = resolve(t);
          if (!files.has(p)) return `The file ${t} does not exist.`;
          if (fs.isDir(p)) return `(opened ${display(p)} in Finder)`;
          if (/\.html?$/.test(p)) return `(opened ${basename(p)} in your browser)`;
          return `(opened ${basename(p)} in a text editor)`; }).join('\n');
      },
      start: (args) => commands.open(args),
      code: (args) => `(opened ${args[0] === '.' || !args[0] ? display(cwd) : args[0]} in VS Code)`,
      mv: (args) => {
        if (args.length < 2) return 'usage: mv source target';
        const src = resolve(args[0]); let dst = resolve(args[1]);
        if (!files.has(src)) return `mv: ${args[0]}: No such file or directory`;
        if (fs.isDir(dst)) dst = join(dst, basename(src));
        [...files.keys()].forEach(k => { if (k === src || k.startsWith(src + '/')) { files.set(dst + k.slice(src.length), files.get(k)); files.delete(k); } });
        return '';
      },
      cp: (args) => {
        const { f, rest } = flags(args);
        if (rest.length < 2) return 'usage: cp [-r] source target';
        const src = resolve(rest[0]); let dst = resolve(rest[1]);
        if (!files.has(src)) return `cp: ${rest[0]}: No such file or directory`;
        if (fs.isDir(src) && !f.has('r')) return `cp: ${rest[0]} is a directory (not copied).`;
        if (fs.isDir(dst)) dst = join(dst, basename(src));
        [...files.keys()].forEach(k => { if (k === src || k.startsWith(src + '/')) files.set(dst + k.slice(src.length), Object.assign({}, files.get(k))); });
        return '';
      },
      node: (args) => {
        if (!args.length) return hooks.node ? hooks.node(null) : 'Welcome to Node.js (simulated REPL is not available here — run a file: node index.js)';
        const p = resolve(args[0]);
        if (!fs.isFile(p)) return `node: cannot open file '${args[0]}'`;
        return hooks.node ? hooks.node(p, fs.read(p)) : `(ran ${basename(p)} with node)`;
      },
      npm: (args) => {
        const sub = args[0];
        if (sub === 'init') { const pkg = resolve('package.json'); if (!fs.exists(pkg)) fs.write(pkg, JSON.stringify({ name: basename(cwd).toLowerCase(), version: '1.0.0', main: 'index.js', scripts: { test: 'echo "Error: no test specified" && exit 1' }, dependencies: {} }, null, 2) + '\n');
          return hooks.npm ? hooks.npm('init', args) : `Wrote to ${join(cwd, 'package.json')}`; }
        if (sub === 'install' || sub === 'i') {
          const pkgs = args.slice(1).filter(a => !a.startsWith('-'));
          const pkg = resolve('package.json');
          let json = null; try { json = JSON.parse(fs.read(pkg) || 'null'); } catch (e) {}
          if (json) { json.dependencies = json.dependencies || {}; pkgs.forEach(n => json.dependencies[n] = '^1.0.0'); fs.write(pkg, JSON.stringify(json, null, 2) + '\n'); }
          mkdirp(resolve('node_modules')); pkgs.forEach(n => mkdirp(resolve('node_modules/' + n)));
          if (!fs.exists(resolve('package-lock.json'))) fs.write(resolve('package-lock.json'), '{\n  "lockfileVersion": 3\n}\n');
          return hooks.npm ? hooks.npm('install', pkgs) : `added ${pkgs.length || 1} package${pkgs.length === 1 ? '' : 's'} in 1s`;
        }
        return `npm: unknown command "${sub || ''}"`;
      },
      git: (args) => git(args),
    };

    /* ---------- git ---------- */
    function repoFor(p) {
      let d = p;
      while (true) { if (repos.has(d)) return repos.get(d); if (d === '/' || !d) return null; d = dirname(d); }
    }
    function hash() { let h = ''; for (let i = 0; i < 7; i++) h += '0123456789abcdef'[Math.floor(rand() * 16)]; return h; }
    let seed = 42; function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function workTree(repo) {
      const t = {}; const pre = repo.root === '/' ? '/' : repo.root + '/';
      files.forEach((v, k) => { if (v.type === 'file' && k.startsWith(pre)) { const rel = k.slice(pre.length); if (!rel.startsWith('.git/') && rel !== '.git') t[rel] = v.content; } });
      return t;
    }
    /* .gitignore rules, as git reads them: a pattern without a slash matches a
       file or folder name at any depth; a pattern with a slash is anchored to the
       repo root; a trailing slash matches folders only; `!` re-includes. */
    function ignored(repo, rel) {
      if (rel === '.git' || rel.startsWith('.git/')) return true;
      const gi = files.get(join(repo.root, '.gitignore'));
      if (!gi) return false;
      const parts = rel.split('/');
      let result = false;
      gi.content.split('\n').map(s => s.replace(/\s+$/, '')).filter(s => s && !s.startsWith('#')).forEach(raw => {
        let pat = raw, negate = false;
        if (pat.startsWith('!')) { negate = true; pat = pat.slice(1); }
        const dirOnly = pat.endsWith('/'); pat = pat.replace(/\/+$/, '');
        const anchored = pat.includes('/'); pat = pat.replace(/^\//, '');
        const src = pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '(?:.*/)?').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]');
        const re = new RegExp('^' + src + '$');
        let hit = false;
        // prefixes of the path: every folder on the way, then the file itself
        for (let i = 1; i <= parts.length && !hit; i++) {
          const isFile = i === parts.length;
          if (dirOnly && isFile) continue;
          const candidate = anchored ? parts.slice(0, i).join('/') : parts[i - 1];
          if (re.test(candidate)) hit = true;
        }
        if (hit) result = !negate;
      });
      return result;
    }
    function headTree(repo) { const c = repo.commits[repo.branches[repo.head]]; return c ? c.tree : {}; }
    function statusInfo(repo) {
      const work = workTree(repo), head = headTree(repo), idx = repo.index;
      const staged = [], unstaged = [], untracked = [];
      Object.keys(idx).forEach(f => { if (!(f in head)) staged.push(['new file', f]); else if (idx[f] !== head[f]) staged.push(['modified', f]); });
      Object.keys(head).forEach(f => { if (!(f in idx)) staged.push(['deleted', f]); });
      Object.keys(idx).forEach(f => { if (!(f in work)) unstaged.push(['deleted', f]); else if (work[f] !== idx[f]) unstaged.push(['modified', f]); });
      Object.keys(work).forEach(f => { if (!(f in idx) && !ignored(repo, f)) untracked.push(f); });
      return { staged, unstaged, untracked };
    }
    function git(args) {
      const sub = args[0];
      if (!sub) return 'usage: git <command> [<args>]\n\n   init   status   add   commit   log   diff   checkout   branch   merge   rm   remote   push   pull   clone';
      if (sub === 'init') {
        if (repoFor(cwd)) return `Reinitialized existing Git repository in ${cwd}/.git/`;
        mkdirp(join(cwd, '.git'));
        repos.set(cwd, { root: cwd, head: 'main', branches: {}, commits: {}, index: {}, remotes: {}, pushed: {} });
        return `Initialized empty Git repository in ${cwd}/.git/`;
      }
      if (sub === 'clone') {
        const url = args[1]; if (!url) return 'fatal: You must specify a repository to clone.';
        const name = (args[2] || basename(url.replace(/\.git$/, '')));
        const root = resolve(name);
        if (files.has(root)) return `fatal: destination path '${name}' already exists and is not an empty directory.`;
        mkdirp(root); mkdirp(join(root, '.git'));
        const repo = { root, head: 'main', branches: {}, commits: {}, index: {}, remotes: { origin: url }, pushed: {} };
        // a lesson can supply what a remote contains: opts.remotes[url] = { 'README.md': '...', ... }
        const template = remotes[url] || remotes[url.replace(/\.git$/, '')] || remotes[url + '.git'];
        const tree = template ? Object.assign({}, template) : { 'README.md': `# ${name}\n\nCloned from ${url}\n` };
        Object.keys(tree).forEach(f => fs.write(join(root, f), tree[f]));
        const id = hash(); repo.commits[id] = { id, msg: 'Initial commit', parent: null, tree, time: clock, author: 'upstream' }; repo.branches.main = id; repo.index = Object.assign({}, tree); repo.pushed.main = id;
        repos.set(root, repo);
        return `Cloning into '${name}'...\nremote: Enumerating objects: 3, done.\nReceiving objects: 100% (3/3), done.`;
      }
      const repo = repoFor(cwd);
      if (!repo) return 'fatal: not a git repository (or any of the parent directories): .git';
      const rel = p => { const a = resolve(p); const pre = repo.root === '/' ? '/' : repo.root + '/'; return a.startsWith(pre) ? a.slice(pre.length) : a === repo.root ? '' : null; };
      switch (sub) {
        case 'status': {
          const s = statusInfo(repo); const lines = [`On branch ${repo.head}`];
          if (!repo.branches[repo.head]) lines.push('\nNo commits yet');
          if (s.staged.length) lines.push('\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)', ...s.staged.map(([k, f]) => `\t${pad(k + ':', 12)}${f}`));
          if (s.unstaged.length) lines.push('\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)', ...s.unstaged.map(([k, f]) => `\t${pad(k + ':', 12)}${f}`));
          if (s.untracked.length) lines.push('\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)', ...s.untracked.map(f => `\t${f}`));
          if (!s.staged.length && !s.unstaged.length && !s.untracked.length) lines.push('\nnothing to commit, working tree clean');
          else if (!s.staged.length && (s.unstaged.length || s.untracked.length)) lines.push('\nno changes added to commit (use "git add" and/or "git commit -a")');
          return lines.join('\n');
        }
        case 'add': {
          const targets = args.slice(1).filter(a => !a.startsWith('-')); if (args.includes('-A') || args.includes('--all')) targets.push('.');
          if (!targets.length) return 'Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?';
          const work = workTree(repo); const errs = [];
          targets.forEach(t => { const r = rel(t); if (r == null) return errs.push(`fatal: ${t}: '${t}' is outside repository`);
            const pre = r ? r + '/' : ''; let any = false;
            Object.keys(work).forEach(f => { if (f === r || f.startsWith(pre)) { if (!ignored(repo, f) || repo.index[f] != null) { repo.index[f] = work[f]; any = true; } } });
            Object.keys(repo.index).forEach(f => { if ((f === r || f.startsWith(pre)) && !(f in work)) { delete repo.index[f]; any = true; } });
            if (!any && !fs.isDir(t) && !files.has(resolve(t))) errs.push(`fatal: pathspec '${t}' did not match any files`); });
          return errs.join('\n');
        }
        case 'rm': {
          const cached = args.includes('--cached'); const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
          const targets = args.slice(1).filter(a => !a.startsWith('-'));
          if (!targets.length) return 'fatal: No pathspec was given. Which files should I remove?';
          const out = [];
          for (const t of targets) {
            const r = rel(t);
            if (r == null) return `fatal: ${t}: '${t}' is outside repository`;
            const pre = r ? r + '/' : '';
            const matches = Object.keys(repo.index).filter(f => f === r || (f.startsWith(pre) && (r === '' || pre)));
            if (!matches.length) return `fatal: pathspec '${t}' did not match any files`;
            if (!recursive && !matches.includes(r)) return `fatal: not removing '${t}' recursively without -r`;
            matches.sort().forEach(f => { delete repo.index[f]; if (!cached) fs.remove(join(repo.root, f)); out.push(`rm '${f}'`); });
          }
          return out.join('\n');
        }
        case 'restore': {
          const staged = args.includes('--staged'); const t = args.slice(1).filter(a => !a.startsWith('-'))[0]; const r = rel(t || '');
          if (!t || r == null) return 'fatal: you must specify path(s) to restore';
          if (staged) { const head = headTree(repo); if (r in head) repo.index[r] = head[r]; else delete repo.index[r]; return ''; }
          if (r in repo.index) { fs.write(join(repo.root, r), repo.index[r]); return ''; }
          return `error: pathspec '${t}' did not match any file(s) known to git`;
        }
        case 'commit': {
          const mi = args.findIndex(a => a === '-m' || a === '-am'); const all = args.includes('-a') || args.includes('-am');
          if (all) { const work = workTree(repo); Object.keys(repo.index).forEach(f => { if (f in work) repo.index[f] = work[f]; else delete repo.index[f]; }); }
          const msg = mi >= 0 ? args[mi + 1] : null;
          if (!msg) return 'error: no commit message given. Use:  git commit -m "your message"';
          const head = headTree(repo); const s = statusInfo(repo);
          if (!s.staged.length) return `On branch ${repo.head}\n${s.untracked.length ? 'Untracked files:\n' + s.untracked.map(f => '\t' + f).join('\n') + '\n\nnothing added to commit but untracked files present (use "git add" to track)' : 'nothing to commit, working tree clean'}`;
          const id = hash(); clock += 60000;
          repo.commits[id] = { id, msg, parent: repo.branches[repo.head] || null, tree: Object.assign({}, repo.index), time: clock, author: user };
          const first = !repo.branches[repo.head];
          repo.branches[repo.head] = id;
          const ch = s.staged.length;
          return `[${repo.head}${first ? ' (root-commit)' : ''} ${id}] ${msg}\n ${ch} file${ch === 1 ? '' : 's'} changed` + (first ? '' : '') + '\n' + s.staged.map(([k, f]) => k === 'new file' ? ` create mode 100644 ${f}` : k === 'deleted' ? ` delete mode 100644 ${f}` : '').filter(Boolean).join('\n');
        }
        case 'log': {
          const tip = repo.branches[repo.head]; if (!tip) return `fatal: your current branch '${repo.head}' does not have any commits yet`;
          const oneline = args.includes('--oneline');
          // every commit reachable through either parent (merges included), newest first
          const seen = new Set(), list = [], stack = [tip];
          while (stack.length) { const id = stack.pop(); if (!id || seen.has(id) || !repo.commits[id]) continue; seen.add(id); const c = repo.commits[id]; list.push(c); stack.push(c.parent, c.parent2); }
          list.sort((a, b) => b.time - a.time);
          const labels = id => { const names = Object.keys(repo.branches).filter(b => repo.branches[b] === id && b !== repo.head); return id === tip ? ` (HEAD -> ${[repo.head].concat(names).join(', ')})` : names.length ? ` (${names.join(', ')})` : ''; };
          return list.map(c => oneline ? `${c.id}${labels(c.id)} ${c.msg}`
            : `commit ${c.id}${labels(c.id)}\n${c.parent2 ? `Merge: ${(c.parent || '').slice(0, 7)} ${c.parent2.slice(0, 7)}\n` : ''}Author: ${c.author} <${c.author}@example.com>\nDate:   ${new Date(c.time).toDateString()}\n\n    ${c.msg}\n`).join('\n');
        }
        case 'diff': {
          const work = workTree(repo); const base = args.includes('--staged') || args.includes('--cached') ? headTree(repo) : repo.index; const cmp = args.includes('--staged') || args.includes('--cached') ? repo.index : work;
          const only = args.slice(1).filter(a => !a.startsWith('-')).map(rel).filter(x => x != null);
          const out = [];
          new Set([...Object.keys(base), ...Object.keys(cmp)]).forEach(f => {
            if (only.length && !only.includes(f)) return;
            if (!(f in base) || base[f] === cmp[f]) return;
            out.push(`diff --git a/${f} b/${f}\n--- a/${f}\n+++ b/${f}`);
            const a = (base[f] || '').split('\n'), b = (cmp[f] == null ? '' : cmp[f]).split('\n');
            a.forEach(l => { if (!b.includes(l)) out.push('-' + l); }); b.forEach(l => { if (!a.includes(l)) out.push('+' + l); });
          });
          return out.join('\n');
        }
        case 'branch': {
          const name = args.slice(1).filter(a => !a.startsWith('-'))[0];
          if (args.includes('-d') || args.includes('-D')) { if (!name || !(name in repo.branches)) return `error: branch '${name}' not found.`; if (name === repo.head) return `error: Cannot delete branch '${name}' checked out`; delete repo.branches[name]; return `Deleted branch ${name}.`; }
          if (args.includes('-M') || args.includes('-m')) {
            // git branch -M main: rename the current branch (a no-op when it already has that name)
            if (!name || name === repo.head) return '';
            if (name in repo.branches && !args.includes('-M')) return `fatal: a branch named '${name}' already exists`;
            if (repo.head in repo.branches) { repo.branches[name] = repo.branches[repo.head]; delete repo.branches[repo.head]; }
            if (repo.head in repo.pushed) { repo.pushed[name] = repo.pushed[repo.head]; delete repo.pushed[repo.head]; }
            repo.head = name; return '';
          }
          if (!name) return Object.keys(repo.branches).concat(repo.branches[repo.head] ? [] : [repo.head]).filter((v, i, a) => a.indexOf(v) === i).sort().map(b => (b === repo.head ? '* ' : '  ') + b).join('\n');
          if (name in repo.branches) return `fatal: a branch named '${name}' already exists`;
          if (!repo.branches[repo.head]) return `fatal: not a valid object name: '${repo.head}'`;
          repo.branches[name] = repo.branches[repo.head]; return '';
        }
        case 'checkout': case 'switch': {
          const create = args.includes('-b') || args.includes('-c'); const name = args.slice(1).filter(a => !a.startsWith('-'))[0];
          if (!name) return 'error: switch `branch` is required';
          if (create) { if (name in repo.branches) return `fatal: a branch named '${name}' already exists`; repo.branches[name] = repo.branches[repo.head] || null; repo.head = name; return `Switched to a new branch '${name}'`; }
          if (name in repo.branches) { if (name === repo.head) return `Already on '${name}'`;
            const tree = (repo.commits[repo.branches[name]] || { tree: {} }).tree; const cur = headTree(repo);
            Object.keys(cur).forEach(f => { if (!(f in tree) && repo.index[f] === cur[f]) { fs.remove(join(repo.root, f)); delete repo.index[f]; } });
            Object.keys(tree).forEach(f => { fs.write(join(repo.root, f), tree[f]); repo.index[f] = tree[f]; });
            repo.head = name; return `Switched to branch '${name}'`; }
          const r = rel(name === '--' ? args[2] : name); if (r != null && r in repo.index) { fs.write(join(repo.root, r), repo.index[r]); return 'Updated 1 path from the index'; }
          return `error: pathspec '${name}' did not match any file(s) known to git`;
        }
        case 'merge': {
          const name = args[1]; if (!name || !(name in repo.branches)) return `merge: ${name} - not something we can merge`;
          const ours = repo.branches[repo.head], theirs = repo.branches[name];
          if (ours === theirs) return 'Already up to date.';
          const anc = id => { const s = new Set(); while (id) { s.add(id); id = repo.commits[id].parent; } return s; };
          if (anc(theirs).has(ours)) { repo.branches[repo.head] = theirs; const t = repo.commits[theirs].tree; Object.keys(t).forEach(f => { fs.write(join(repo.root, f), t[f]); repo.index[f] = t[f]; }); return `Updating ${ours ? ours.slice(0, 7) : '0000000'}..${theirs}\nFast-forward`; }
          if (anc(ours).has(theirs)) return 'Already up to date.';
          const base = [...anc(ours)].find(id => anc(theirs).has(id)); const bt = base ? repo.commits[base].tree : {};
          const ot = repo.commits[ours].tree, tt = repo.commits[theirs].tree, merged = Object.assign({}, ot); const conflicts = [];
          new Set([...Object.keys(ot), ...Object.keys(tt)]).forEach(f => { if (ot[f] === tt[f]) return; if (tt[f] === bt[f]) return; if (ot[f] === bt[f] || !(f in ot)) { merged[f] = tt[f]; return; }
            conflicts.push(f); merged[f] = `<<<<<<< HEAD\n${ot[f]}=======\n${tt[f]}>>>>>>> ${name}\n`; });
          Object.keys(merged).forEach(f => { fs.write(join(repo.root, f), merged[f]); repo.index[f] = merged[f]; });
          if (conflicts.length) return conflicts.map(f => `CONFLICT (content): Merge conflict in ${f}`).join('\n') + '\nAutomatic merge failed; fix conflicts and then commit the result.';
          const id = hash(); clock += 60000; repo.commits[id] = { id, msg: `Merge branch '${name}'`, parent: ours, parent2: theirs, tree: merged, time: clock, author: user }; repo.branches[repo.head] = id;
          return `Merge made by the 'ort' strategy.`;
        }
        case 'remote': {
          if (args[1] === 'add') { if (!args[2] || !args[3]) return 'usage: git remote add <name> <url>'; repo.remotes[args[2]] = args[3]; return ''; }
          if (args[1] === 'remove' || args[1] === 'rm') { delete repo.remotes[args[2]]; return ''; }
          return Object.keys(repo.remotes).map(n => args.includes('-v') ? `${n}\t${repo.remotes[n]} (fetch)\n${n}\t${repo.remotes[n]} (push)` : n).join('\n');
        }
        case 'push': {
          const remote = args.slice(1).filter(a => !a.startsWith('-'))[0] || 'origin'; const branch = args.slice(1).filter(a => !a.startsWith('-'))[1] || repo.head;
          if (!repo.remotes[remote]) return `fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.`;
          if (!repo.branches[branch]) return `error: src refspec ${branch} does not match any`;
          if (repo.pushed[branch] === repo.branches[branch]) return 'Everything up-to-date';
          const first = !repo.pushed[branch]; repo.pushed[branch] = repo.branches[branch];
          return `Enumerating objects: 3, done.\nWriting objects: 100% (3/3), done.\nTo ${repo.remotes[remote]}\n ${first ? '* [new branch]      ' : '   '}${branch} -> ${branch}` + (args.includes('-u') ? `\nbranch '${branch}' set up to track '${remote}/${branch}'.` : '');
        }
        case 'pull': case 'fetch': return repo.remotes.origin ? 'Already up to date.' : 'fatal: no remote named origin';
        case 'config': return '';
        case 'stash': return 'No local changes to save';
        default: return `git: '${sub}' is not a git command. See 'git help'.`;
      }
    }

    function run(line) {
      line = String(line || '').trim();
      if (!line) return { out: '' };
      history.push(line);
      // support `a && b`
      if (line.includes('&&')) { const outs = []; for (const part of line.split('&&')) { const r = run(part.trim()); history.pop(); if (r.out) outs.push(r.out); if (r.clear || r.exit) return r; } return { out: outs.join('\n') }; }
      const parsed = parse(line);
      const ex = expand(parsed);
      if (ex.error) return { out: ex.error };
      const args = ex.args; const cmd = args.shift();
      if (cmd === 'sudo') return run(args.join(' '));
      if (args[0] === '--version' || (args[0] === '-v' && (cmd === 'node' || cmd === 'npm'))) {
        const v = { git: 'git version 2.42.0', node: 'v20.11.0', npm: '10.2.4', code: '1.94.0' }[cmd];
        if (v) return { out: v };
      }
      const fn = commands[cmd];
      if (!fn) return { out: `zsh: command not found: ${cmd}` };
      const r = fn(args);
      return typeof r === 'string' ? { out: r } : (r || { out: '' });
    }

    return { run, fs, prompt, hooks, history,
      get cwd() { return cwd; }, set cwd(v) { cwd = v; }, home, user, display,
      git: p => repoFor(p ? resolve(p) : cwd),
      gitInfo: p => { const r = repoFor(p ? resolve(p) : cwd); if (!r) return null; const s = statusInfo(r);
        return { root: r.root, branch: r.head, branches: Object.keys(r.branches).concat(r.branches[r.head] ? [] : [r.head]).filter((v, i, a) => a.indexOf(v) === i), commits: (() => { const o = []; let id = r.branches[r.head]; while (id) { o.push(r.commits[id]); id = r.commits[id].parent; } return o; })(), staged: s.staged, unstaged: s.unstaged, untracked: s.untracked, remotes: r.remotes, pushed: r.pushed, index: r.index }; },
    };
  }

  return { create, normalize, join, dirname, basename };
});
