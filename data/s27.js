/* ===== Section 27 — Git, GitHub and Version Control ===== */

PG.add({
  id:'l216', index:216, udemyId:12386072, minutes:2, section:'s27', slug:'intro-to-version-control', kind:'read',
  title:'Introduction to Version Control and Git',
  blurb:'Version control keeps <b>save points</b> of a project. In Git each save point is a <b>commit</b>: you can compare today\'s files with any earlier commit, or roll back to it when an edit goes wrong. The rest of the section uses Git from the terminal first, then GitHub for remotes, cloning, branching, forks and pull requests.',
  explore:[{
    title:'Save points', height:520,
    note:'Edit the file, then commit. Repeat a few times. Then press <b>diff</b> on an older commit to see what changed since, or <b>restore</b> to roll the file back to it.',
    html:`
<div class="knobs">
  <label>message <input type="text" id="msg" value="Write chapter 2" style="width:190px"></label>
  <button id="commit">git commit</button>
  <span id="state" class="tag"></span>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px"><h4>story.txt (your working copy)</h4>
    <textarea id="file" spellcheck="false" style="width:100%;height:170px;font:13px/1.5 ui-monospace,Menlo,monospace;padding:10px;border:1px solid #dfe3ee;border-radius:8px;resize:vertical"></textarea></div>
  <div style="flex:1;min-width:250px"><h4>commits, newest first</h4><div id="log"></div></div>
</div>
<h4 style="margin-top:12px" id="diffTitle">diff</h4>
<pre class="readout" id="diff"></pre>
<style>
  .c{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #dfe3ee;border-radius:8px;padding:6px 10px;margin-bottom:6px;font-size:12.5px}
  .c b{font:12px ui-monospace,Menlo,monospace;color:#5b6382}
  .c span{flex:1}
  .add{color:#7ee0a8}
  .del{color:#ff9aa2}
</style>
<script>
  var NL = String.fromCharCode(10);
  var commits = [];
  var file = document.getElementById('file');
  function hash() { var h = ''; for (var i = 0; i < 7; i++) h += '0123456789abcdef'.charAt(Math.floor(Math.random() * 16)); return h; }
  function commit(msg) {
    if (commits.length && commits[0].text === file.value) { document.getElementById('state').textContent = 'nothing to commit, working tree clean'; return; }
    commits.unshift({ id: hash(), msg: msg || 'Update story', text: file.value });
    render();
  }
  function render() {
    var log = document.getElementById('log');
    log.innerHTML = '';
    commits.forEach(function (c, i) {
      var row = document.createElement('div');
      row.className = 'c';
      row.innerHTML = '<b></b><span></span><button data-a="diff">diff</button><button data-a="restore">restore</button>';
      row.querySelector('b').textContent = c.id + (i === 0 ? ' HEAD' : '');
      row.querySelector('span').textContent = c.msg;
      row.querySelector('[data-a=diff]').onclick = function () { showDiff(c); };
      row.querySelector('[data-a=restore]').onclick = function () { file.value = c.text; status(); showDiff(c); };
      log.appendChild(row);
    });
    status();
  }
  function status() {
    var clean = commits.length && commits[0].text === file.value;
    var s = document.getElementById('state');
    s.textContent = clean ? 'working copy matches the last commit' : 'uncommitted changes';
    s.style.background = clean ? '#d8f5e3' : '#fff1b8';
  }
  function lcs(a, b) {
    var n = a.length, m = b.length, dp = [], i, j;
    for (i = 0; i <= n; i++) { dp.push([]); for (j = 0; j <= m; j++) dp[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var out = []; i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push([' ', a[i]]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(['-', a[i]]); i++; }
      else { out.push(['+', b[j]]); j++; }
    }
    while (i < n) out.push(['-', a[i++]]);
    while (j < m) out.push(['+', b[j++]]);
    return out;
  }
  function showDiff(c) {
    document.getElementById('diffTitle').textContent = 'diff: commit ' + c.id + ' compared with your working copy';
    var rows = lcs(c.text.split(NL), file.value.split(NL));
    var pre = document.getElementById('diff');
    pre.innerHTML = '';
    var changed = false;
    rows.forEach(function (r) {
      var d = document.createElement('div');
      d.textContent = r[0] + ' ' + r[1];
      if (r[0] === '+') { d.className = 'add'; changed = true; }
      if (r[0] === '-') { d.className = 'del'; changed = true; }
      pre.appendChild(d);
    });
    if (!changed) pre.textContent = 'No differences: the working copy is identical to ' + c.id + '.';
  }
  file.value = 'Chapter 1' + NL + 'The keeper finds a folded map in an old boot.';
  commit('Initial commit');
  file.value = file.value + NL + NL + 'Chapter 2' + NL + 'The map shows an island that no chart has.';
  file.addEventListener('input', status);
  document.getElementById('commit').onclick = function () { commit(document.getElementById('msg').value.trim()); };
  status();
  showDiff(commits[0]);
<\/script>`,
  }],
  quiz:[
    { q:'In Git, what is a commit?', options:['A copy of the project emailed to a teammate','A saved snapshot of the tracked files, with a message, that you can come back to','The file that lists what to ignore','The connection to GitHub'], answer:1, why:'Each commit is a save point in the project\'s history.' },
    { q:'An edit has broken your code. What can version control do for you?', options:['Nothing, unless you kept a backup by hand','Show what changed since an earlier commit, or roll the files back to it','Fix the bug automatically','Delete the broken file from GitHub'], answer:1, why:'You can compare against any recorded version and restore it, not only the most recent one.' },
  ],
});

PG.add({
  id:'l217', index:217, udemyId:12386660, minutes:14, section:'s27', slug:'git-command-line', kind:'terminal',
  title:'Version Control Using Git and the Command Line',
  blurb:'Three places matter. The <b>working directory</b> holds your files, the <b>staging area</b> holds what goes into the next commit, and the <b>local repository</b> holds the commits, inside a hidden <code>.git</code> folder. <code>git init</code> creates the repository, <code>git add</code> stages, <code>git commit -m</code> saves, <code>git status</code> and <code>git log</code> show where things stand, <code>git diff</code> compares, and <code>git checkout &lt;file&gt;</code> throws an unwanted edit away.',
  tasks:[
    'Make the project: <code>cd Desktop</code>, <code>mkdir Story</code>, <code>cd Story</code>, then write chapter 1 with <code>echo "Chapter 1: …" &gt; chapter1.txt</code>. There is no text editor here, so <code>echo</code> with <code>&gt;</code> writes files.',
    'Run <code>git init</code>, then <code>ls -a</code> to spot the hidden <code>.git</code> folder, then <code>git status</code>: chapter1.txt is untracked.',
    'Stage it with <code>git add chapter1.txt</code>, run <code>git status</code> again, and commit: <code>git commit -m "Complete chapter 1"</code>.',
    'Write <code>chapter2.txt</code> and <code>chapter3.txt</code> the same way, stage both at once with <code>git add .</code>, commit them as <code>"Complete chapter 2 and 3"</code>, and read <code>git log</code>.',
    'Ruin chapter 3 with <code>echo "asdfghjkl" &gt; chapter3.txt</code>. Run <code>git status</code> and <code>git diff chapter3.txt</code> to see the damage.',
    'Roll it back with <code>git checkout chapter3.txt</code>, confirm with <code>cat chapter3.txt</code>, and press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop': null,
    '/Users/you/Documents': null,
    '/Users/you/Downloads': null,
  },
  cwd:'/Users/you',
  solution:[
    'cd Desktop',
    'mkdir Story',
    'cd Story',
    'echo "Chapter 1: The lighthouse keeper finds a map folded inside an old boot." > chapter1.txt',
    'git init',
    'ls -a',
    'git status',
    'git add chapter1.txt',
    'git status',
    'git commit -m "Complete chapter 1"',
    'echo "Chapter 2: The map shows an island that no chart has." > chapter2.txt',
    'echo "Chapter 3: A storm forces the keeper to row out at night." > chapter3.txt',
    'git status',
    'git add .',
    'git commit -m "Complete chapter 2 and 3"',
    'git log',
    'echo "asdfghjkl qwertyuiop" > chapter3.txt',
    'git status',
    'git diff chapter3.txt',
    'git checkout chapter3.txt',
    'cat chapter3.txt',
  ],
  checks:[
    { desc:'Story is a Git repository (git init ran inside it)', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.root === "/Users/you/Desktop/Story"' },
    { desc:'The first commit holds only chapter1.txt', test:'const g = git("/Users/you/Desktop/Story"); if (!g || !g.commits.length) return false; const first = g.commits[g.commits.length - 1]; return Object.keys(first.tree).join() === "chapter1.txt"' },
    { desc:'A later commit added chapter2.txt and chapter3.txt', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length >= 2 && ["chapter1.txt", "chapter2.txt", "chapter3.txt"].every(f => f in g.commits[0].tree)' },
    { desc:'You inspected the damage with git diff', test:'return shell.history.some(h => /^git diff/.test(h))' },
    { desc:'chapter3.txt is back to its committed text and nothing is left uncommitted', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length > 0 && shell.history.some(h => /^git (checkout|restore) /.test(h)) && fs.read("/Users/you/Desktop/Story/chapter3.txt") === g.commits[0].tree["chapter3.txt"] && !g.staged.length && !g.unstaged.length && !g.untracked.length' },
  ],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>Write commit messages in the present tense and say what the commit does: "Complete chapter 1", "Add contact page", not "stuff".</li>
      <li>Newer Git has a command just for discarding edits, <code>git restore chapter3.txt</code>; <code>git checkout chapter3.txt</code> still works. Either way the edit is gone for good, so run <code>git diff</code> first if anything in it is worth keeping.</li>
      <li>Run <code>git init</code> inside the project folder only. Running it in your home folder would put everything you own into one repository.</li>
      <li>On your own machine, edit the files in VS Code instead of using <code>echo</code>; the Git commands are exactly the same.</li>
    </ul>`,
  quiz:[
    { q:'What does <code>git add .</code> do?', options:['Commits every file','Stages every change in the current folder for the next commit','Creates a new repository','Uploads the files to GitHub'], answer:1, why:'The dot means "here": everything changed under the current folder goes into the staging area.' },
    { q:'Which order records a change?', options:['commit, then add','add, then commit','init, then push','status, then log'], answer:1, why:'Edit in the working directory, stage with git add, then save the staged snapshot with git commit.' },
    { q:'What does <code>git checkout chapter3.txt</code> do to an edited but uncommitted file?', options:['Commits it','Throws the edit away and restores the last committed version','Moves it to a new branch','Shows the difference'], answer:1, why:'It replaces the working copy with the version Git has recorded. git diff is the command that only shows the difference.' },
    { q:'Where does Git keep the commits of a local repository?', options:['On GitHub','In the hidden .git folder inside the project','In package.json','In your home folder'], answer:1, why:'git init creates .git; delete it and the history is gone while your files stay.' },
  ],
});

PG.add({
  id:'l218', index:218, udemyId:12386668, minutes:10, section:'s27', slug:'github-remote-repositories', kind:'terminal',
  title:'GitHub and Remote Repositories',
  blurb:'A <b>remote</b> is a copy of your repository on another machine, here GitHub. Create an empty repository on github.com, link it from your project with <code>git remote add origin &lt;url&gt;</code>, and upload your commits with <code>git push -u origin main</code>. The <code>-u</code> remembers the link, so later pushes are just <code>git push</code>.',
  tasks:[
    'Every terminal lesson starts fresh, so first rebuild the repository: <code>cd Desktop/Story</code>, <code>git init</code>, <code>git add .</code>, <code>git commit -m "Complete chapters 1 to 3"</code>.',
    'On github.com you would now choose <b>+ → New repository</b>, call it <code>Story</code> and leave <b>Add a README</b> unticked, so that it starts empty. Pretend you did: its URL is <code>https://github.com/you/Story.git</code>.',
    'Link it with <code>git remote add origin https://github.com/you/Story.git</code> and check with <code>git remote -v</code>.',
    'Upload with <code>git push -u origin main</code>; the Git panel switches to <b>pushed</b>. GitHub\'s instructions also list <code>git branch -M main</code>, which renames the branch to main. Yours is already called main here, so skip that line.',
    'Write <code>chapter4.txt</code> with <code>echo</code> and commit it. The panel now says <b>not pushed</b>: GitHub only has what you send. Sync it with a plain <code>git push</code>, then press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop/Story/chapter1.txt': 'Chapter 1: The lighthouse keeper finds a map folded inside an old boot.\n',
    '/Users/you/Desktop/Story/chapter2.txt': 'Chapter 2: The map shows an island that no chart has.\n',
    '/Users/you/Desktop/Story/chapter3.txt': 'Chapter 3: A storm forces the keeper to row out at night.\n',
    '/Users/you/Documents': null,
  },
  cwd:'/Users/you',
  welcome:'Last login: today on ttys001. The Story folder is on the Desktop, without a Git repository yet.',
  solution:[
    'cd Desktop/Story',
    'git init',
    'git add .',
    'git commit -m "Complete chapters 1 to 3"',
    'git log --oneline',
    'git remote add origin https://github.com/you/Story.git',
    'git remote -v',
    'git push -u origin main',
    'echo "Chapter 4: The island has a lighthouse of its own." > chapter4.txt',
    'git add .',
    'git commit -m "Add chapter 4"',
    'git push',
  ],
  checks:[
    { desc:'Story is a repository with at least one commit', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.root === "/Users/you/Desktop/Story" && g.commits.length >= 1' },
    { desc:'A remote called origin points at GitHub', test:'const g = git("/Users/you/Desktop/Story"); return !!g && String(g.remotes.origin || "").indexOf("github.com") !== -1' },
    { desc:'You pushed with -u to set the upstream', test:'return shell.history.some(h => /^git push (-u|--set-upstream) origin main/.test(h) || /^git push origin main (-u|--set-upstream)/.test(h))' },
    { desc:'chapter4.txt is committed', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length >= 2 && "chapter4.txt" in g.commits[0].tree' },
    { desc:'GitHub has your latest commit (main is pushed)', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length > 0 && g.pushed.main === g.commits[0].id' },
  ],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li><code>origin</code> is only a name, but it is the one everybody uses for the main remote, so stick with it.</li>
      <li>A README ticked on GitHub gives the remote a commit your local repository does not have, and the first push is rejected. Start the remote empty when you push an existing project.</li>
      <li>Pushing over HTTPS asks you to sign in: GitHub accepts a personal access token or a credential helper (the GitHub CLI or GitHub Desktop sets one up), not your account password.</li>
      <li>On GitHub, the <b>Commits</b> list shows each save point and its changes, and <b>Insights → Network</b> draws the branch as a line of dots.</li>
    </ul>`,
  quiz:[
    { q:'What is <code>origin</code> in <code>git push -u origin main</code>?', options:['A Git command','The usual name of the remote repository your project is linked to','The first commit','The main branch'], answer:1, why:'git remote add origin URL gives the remote that name; you could pick another, but origin is the convention.' },
    { q:'Why leave <b>Add a README</b> unticked when you create the GitHub repository for an existing project?', options:['READMEs are not allowed','So the remote starts empty and the first push is not rejected for having different history','To keep the repository private','It makes the push faster'], answer:1, why:'A README would be a commit that exists only on GitHub, so the two histories would not line up.' },
    { q:'You commit chapter 4 but do not push. Is it on GitHub?', options:['Yes, commits sync automatically','No, the remote only changes when you push','Only if the repository is public','Only the file names are'], answer:1, why:'Local and remote are separate repositories. git push sends the commits across.' },
    { q:'What does the <code>-u</code> in <code>git push -u origin main</code> do?', options:['Uploads faster','Links the local main to origin/main, so later git push and git pull need no arguments','Undoes the last push','Pushes every branch'], answer:1, why:'It sets the upstream branch, which Git then remembers.' },
  ],
});

PG.add({
  id:'l219', index:219, udemyId:12386672, minutes:11, section:'s27', slug:'gitignore', kind:'terminal',
  title:'Gitignore',
  blurb:'Some files should never reach a repository: secrets (passwords, API keys, <code>.env</code>), your own machine\'s clutter (<code>.DS_Store</code>), and anything that can be regenerated (<code>node_modules</code>). List them, one pattern per line, in a file named exactly <code>.gitignore</code> in the project root and Git stops offering them. Staged something by mistake? <code>git rm --cached</code> unstages it without deleting it.',
  tasks:[
    'Go to <code>cd Desktop/Project</code> and run <code>ls -a</code>: three text files, a <code>secrets.txt</code> and a hidden <code>.DS_Store</code>.',
    'Run <code>git init</code>, <code>git add .</code> and <code>git status</code>. Oops: the secrets and the .DS_Store are staged too.',
    'Unstage them without deleting them: <code>git rm --cached secrets.txt</code> and <code>git rm --cached .DS_Store</code>. (The lecture uses <code>git rm --cached -r .</code> to unstage everything at once; this simulator only takes one file at a time.)',
    'Create the ignore file and fill it: <code>touch .gitignore</code>, <code>echo ".DS_Store" &gt;&gt; .gitignore</code>, <code>echo "secrets.txt" &gt;&gt; .gitignore</code> (<code>&gt;&gt;</code> adds a line), then check with <code>cat .gitignore</code>.',
    'Run <code>git add .</code> and <code>git status</code>: only <code>.gitignore</code> and the three text files are left. Commit them with <code>git commit -m "Initial commit"</code>.',
    'Now a Node project: <code>cd ../NodeApp</code>. <i>Before</i> the first commit, write a <code>.gitignore</code> with <code>node_modules/</code>, <code>.env</code> and <code>*.log</code>; then <code>git init</code>, <code>git add .</code>, check <code>git status</code> and commit. Press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop/Project/file1.txt': 'First file\n',
    '/Users/you/Desktop/Project/file2.txt': 'Second file\n',
    '/Users/you/Desktop/Project/file3.txt': 'Third file\n',
    '/Users/you/Desktop/Project/secrets.txt': 'admin password: correct-horse-battery-staple\n',
    '/Users/you/Desktop/Project/.DS_Store': 'Finder window and icon positions\n',
    '/Users/you/Desktop/NodeApp/index.js': 'console.log("Hello from NodeApp");\n',
    '/Users/you/Desktop/NodeApp/package.json': '{\n  "name": "nodeapp",\n  "version": "1.0.0",\n  "main": "index.js"\n}\n',
    '/Users/you/Desktop/NodeApp/.env': 'API_KEY=not-a-real-key-123\n',
    '/Users/you/Desktop/NodeApp/debug.log': 'server started on port 3000\n',
    '/Users/you/Desktop/NodeApp/node_modules/express/index.js': '// pretend this is Express\n',
    '/Users/you/Desktop/NodeApp/node_modules/express/package.json': '{ "name": "express" }\n',
  },
  cwd:'/Users/you',
  solution:[
    'cd Desktop/Project',
    'ls -a',
    'git init',
    'git add .',
    'git status',
    'git rm --cached secrets.txt',
    'git rm --cached .DS_Store',
    'touch .gitignore',
    'echo "# Project-wide" >> .gitignore',
    'echo ".DS_Store" >> .gitignore',
    'echo "secrets.txt" >> .gitignore',
    'cat .gitignore',
    'git add .',
    'git status',
    'git commit -m "Initial commit"',
    'cd ../NodeApp',
    'ls -a',
    'echo "node_modules/" > .gitignore',
    'echo ".env" >> .gitignore',
    'echo "*.log" >> .gitignore',
    'git init',
    'git add .',
    'git status',
    'git commit -m "Initial commit"',
  ],
  checks:[
    { desc:'Project\'s commit has the text files and .gitignore, but no secrets.txt or .DS_Store', test:'const g = git("/Users/you/Desktop/Project"); if (!g || !g.commits.length) return false; const t = g.commits[0].tree; return !("secrets.txt" in t) && !(".DS_Store" in t) && ["file1.txt", "file2.txt", "file3.txt", ".gitignore"].every(f => f in t)' },
    { desc:'You unstaged with git rm --cached, so secrets.txt and .DS_Store are still on disk', test:'return shell.history.some(h => /^git rm .*--cached/.test(h) || /^git restore --staged/.test(h)) && fs.exists("/Users/you/Desktop/Project/secrets.txt") && fs.exists("/Users/you/Desktop/Project/.DS_Store")' },
    { desc:'Project/.gitignore lists both files', test:'const lines = String(fs.read("/Users/you/Desktop/Project/.gitignore") || "").split("\\n").map(s => s.trim()); return lines.includes(".DS_Store") && lines.includes("secrets.txt")' },
    { desc:'git status in Project is clean: the ignored files no longer show up', test:'const g = git("/Users/you/Desktop/Project"); return !!g && !g.untracked.length && !g.staged.length && !g.unstaged.length' },
    { desc:'NodeApp\'s commit has the code but no node_modules, .env or log files', test:'const g = git("/Users/you/Desktop/NodeApp"); if (!g || g.root !== "/Users/you/Desktop/NodeApp" || !g.commits.length) return false; const files = Object.keys(g.commits[0].tree); return files.includes("index.js") && files.includes(".gitignore") && !files.some(f => f.indexOf("node_modules/") === 0 || f === ".env" || f.slice(-4) === ".log")' },
  ],
  explore:[{
    title:'.gitignore pattern tester', height:560,
    note:'Edit the rules or use the buttons to add a line. Each file shows whether <code>git add .</code> would pick it up and, if not, which line keeps it out.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:230px">
    <h4>.gitignore</h4>
    <textarea id="gi" spellcheck="false" style="width:100%;height:200px;font:12.5px/1.5 ui-monospace,Menlo,monospace;padding:10px;border:1px solid #dfe3ee;border-radius:8px;resize:vertical"></textarea>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;font-size:12.5px;align-items:center">add a line:
      <button data-r="secrets.txt">secrets.txt</button>
      <button data-r="*.txt">*.txt</button>
      <button data-r="!notes.txt">!notes.txt</button>
      <button data-r="/debug.log">/debug.log</button>
      <button data-r="public/">public/</button>
    </div>
  </div>
  <div style="flex:1.3;min-width:280px">
    <h4>files in the project</h4>
    <div id="files" class="stage" style="padding:8px 12px;margin:0"></div>
  </div>
</div>
<pre class="readout" id="sum" style="margin-top:12px;white-space:pre-wrap"></pre>
<style>
  .f{display:flex;gap:10px;align-items:baseline;font:12.5px/1.6 ui-monospace,Menlo,monospace;padding:3px 0}
  .f .s{flex:0 0 62px;font-weight:700}
  .f.in .s{color:#1f8a4c}
  .f.out{color:#9aa1b8}
  .f.out .p{text-decoration:line-through}
  .f .why{display:block;font:11.5px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;color:#8a91a8}
</style>
<script>
  var NL = String.fromCharCode(10), BS = String.fromCharCode(92);
  var FILES = ['.DS_Store', '.env', '.gitignore', 'index.js', 'package.json', 'notes.txt', 'secrets.txt', 'debug.log', 'logs/server.log', 'node_modules/express/index.js', 'node_modules/express/package.json', 'public/.DS_Store', 'public/styles/main.css'];
  var START = ['# Project-wide', '.DS_Store', '', '# Node', 'node_modules/', '.env', '*.log'].join(NL);
  function toRegex(glob) {
    var s = '';
    for (var i = 0; i < glob.length; i++) {
      var c = glob.charAt(i);
      if (c === '*') {
        if (glob.charAt(i + 1) === '*') {
          if (glob.charAt(i + 2) === '/') { s += '(.*/)?'; i += 2; } else { s += '.*'; i += 1; }
        } else s += '[^/]*';
      } else if (c === '?') s += '[^/]';
      else if ('.+^$()|{}[]'.indexOf(c) !== -1 || c === BS) s += BS + c;
      else s += c;
    }
    return new RegExp('^' + s + '$');
  }
  function parse(text) {
    var rules = [];
    text.split(NL).forEach(function (raw, i) {
      var line = raw.trim();
      if (!line || line.charAt(0) === '#') return;
      var rule = { text: line, line: i + 1, neg: false, dirOnly: false, anchored: false };
      if (line.charAt(0) === '!') { rule.neg = true; line = line.slice(1); }
      if (line.charAt(line.length - 1) === '/') { rule.dirOnly = true; line = line.slice(0, -1); }
      if (line.indexOf('/') !== -1) rule.anchored = true;
      if (line.charAt(0) === '/') line = line.slice(1);
      if (!line) return;
      rule.re = toRegex(line);
      rules.push(rule);
    });
    return rules;
  }
  function matches(rule, path, isDir) {
    if (rule.dirOnly && !isDir) return false;
    return rule.anchored ? rule.re.test(path) : rule.re.test(path.split('/').pop());
  }
  function lastMatch(rules, path, isDir) {
    var hit = null;
    rules.forEach(function (r) { if (matches(r, path, isDir)) hit = r; });
    return hit;
  }
  function check(rules, path) {
    var parts = path.split('/');
    for (var d = 1; d < parts.length; d++) {
      var dir = parts.slice(0, d).join('/');
      var r = lastMatch(rules, dir, true);
      if (r && !r.neg) return { out: true, rule: r, via: dir + '/' };
    }
    var f = lastMatch(rules, path, false);
    return { out: !!(f && !f.neg), rule: f };
  }
  function go() {
    var rules = parse(document.getElementById('gi').value);
    var box = document.getElementById('files');
    box.innerHTML = '';
    var tracked = 0, ignored = 0;
    FILES.forEach(function (p) {
      var res = check(rules, p);
      var row = document.createElement('div');
      row.className = 'f ' + (res.out ? 'out' : 'in');
      row.innerHTML = '<span class="s"></span><div><span class="p"></span><span class="why"></span></div>';
      row.querySelector('.s').textContent = res.out ? 'ignored' : 'tracked';
      row.querySelector('.p').textContent = p;
      var why = '';
      if (res.out) why = 'line ' + res.rule.line + ': ' + res.rule.text + (res.via ? ' (whole folder ' + res.via + ')' : '');
      else if (res.rule && res.rule.neg) why = 'brought back by line ' + res.rule.line + ': ' + res.rule.text;
      row.querySelector('.why').textContent = why;
      box.appendChild(row);
      if (res.out) ignored++; else tracked++;
    });
    document.getElementById('sum').textContent = 'git add . would stage ' + tracked + ' files and skip ' + ignored + '.' + NL + NL +
      'One pattern per line; # starts a comment. * matches anything except a slash. A trailing / matches folders only. A slash at the start or in the middle ties the pattern to the project root; otherwise it matches at any depth. ! brings back a file an earlier line excluded, but never one inside an ignored folder.';
  }
  var gi = document.getElementById('gi');
  gi.value = START;
  gi.addEventListener('input', go);
  document.querySelectorAll('[data-r]').forEach(function (b) {
    b.onclick = function () { gi.value = gi.value.trimEnd() + NL + b.getAttribute('data-r'); go(); };
  });
  go();
<\/script>`,
  }],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>The name must be exactly <code>.gitignore</code>: leading dot, all lowercase, in the project root. Commit it, so everyone working on the project shares the rules.</li>
      <li>GitHub keeps ready-made templates in its <a href="https://github.com/github/gitignore" target="_blank" rel="noopener">github/gitignore</a> repository. <code>Node.gitignore</code> already covers <code>node_modules</code>, logs and <code>.env</code> files; paste it in and add your own lines, such as <code>.DS_Store</code>.</li>
      <li>.gitignore only affects files Git is not tracking yet. A file that was already committed stays in the history; untrack it with <code>git rm --cached &lt;file&gt;</code>, and treat any secret that was ever pushed as leaked: change it.</li>
      <li>Careful with broad patterns: <code>*.txt</code> also hides text files you meant to keep. The Explore tab shows the effect of each line.</li>
    </ul>`,
  quiz:[
    { q:'Which file name does Git read the ignore rules from?', options:['gitignore.txt','.gitignore','.GitIgnore','ignore.git'], answer:1, why:'Exactly .gitignore, lowercase with a leading dot. Any other spelling is just another file.' },
    { q:'You staged <code>secrets.txt</code> by mistake. What does <code>git rm --cached secrets.txt</code> do?', options:['Deletes the file from disk','Removes it from the staging area but leaves the file on disk','Adds it to .gitignore','Commits it'], answer:1, why:'--cached works on the index only. The file stays where it is, now untracked.' },
    { q:'A file was committed last week, and today you add it to .gitignore. What happens?', options:['Git deletes it from the history','It stays tracked until you untrack it with git rm --cached','It is ignored immediately','Git refuses the new rule'], answer:1, why:'.gitignore only stops untracked files from being added. Tracked files carry on being tracked.' },
    { q:'Which line keeps the whole <code>node_modules</code> folder out?', options:['node_modules/','*.js','.node_modules','node_modules.txt'], answer:0, why:'The trailing slash means "a folder with this name", and everything inside it goes too.' },
  ],
});

PG.add({
  id:'l220', index:220, udemyId:12386680, minutes:9, section:'s27', slug:'cloning', kind:'terminal',
  title:'Cloning',
  blurb:'<code>git clone &lt;url&gt;</code> downloads a whole repository (every file, every commit, the full history) into a new folder that is already linked back to its source as <code>origin</code>. It is the usual first step for running, studying, fixing or extending someone else\'s open-source project.',
  tasks:[
    'Go to <code>cd Desktop/Projects</code> and clone a project: <code>git clone https://github.com/open-source-friends/word-mastermind.git</code>. (The URL is an example. On GitHub you copy the real one from the green <b>Code</b> button.)',
    'Run <code>ls</code> to see the new folder, <code>cd word-mastermind</code>, then <code>ls -a</code>: the files plus a <code>.git</code> folder. A clone is a full repository, not just a download.',
    'Run <code>git log</code>: the project\'s history came with it. Run <code>git remote -v</code>: <code>origin</code> already points at the URL you cloned from.',
    'Read the README with <code>cat README.md</code>. A real JavaScript project would now ask for <code>npm install</code> and then <code>npm start</code>. This simulated clone only holds a README, so change that instead: <code>echo "Note: try a longer word list" &gt;&gt; README.md</code>.',
    'Run <code>git status</code>, <code>git add .</code> and <code>git commit -m "Add a note to the README"</code>. Your copy is yours to change; the original on GitHub is untouched. Press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop/Projects': null,
    '/Users/you/Documents': null,
  },
  cwd:'/Users/you',
  solution:[
    'cd Desktop/Projects',
    'git clone https://github.com/open-source-friends/word-mastermind.git',
    'ls',
    'cd word-mastermind',
    'ls -a',
    'git log',
    'git remote -v',
    'cat README.md',
    'echo "Note: try a longer word list" >> README.md',
    'git status',
    'git add .',
    'git commit -m "Add a note to the README"',
    'git log --oneline',
  ],
  checks:[
    { desc:'word-mastermind is cloned into Desktop/Projects', test:'const g = git("/Users/you/Desktop/Projects/word-mastermind"); return !!g && g.root === "/Users/you/Desktop/Projects/word-mastermind"' },
    { desc:'origin points back to the GitHub URL you cloned', test:'const g = git("/Users/you/Desktop/Projects/word-mastermind"); return !!g && String(g.remotes.origin || "").indexOf("github.com") !== -1' },
    { desc:'You looked at the history (git log) and the remote (git remote -v)', test:'return shell.history.some(h => /^git log/.test(h)) && shell.history.some(h => /^git remote -v/.test(h))' },
    { desc:'Your README change is committed on top of the cloned history', test:'const g = git("/Users/you/Desktop/Projects/word-mastermind"); return !!g && g.commits.length >= 2 && !g.staged.length && !g.unstaged.length' },
  ],
  notes:`
    <h3>On your own machine</h3>
    <ul>
      <li>The full routine for a JavaScript project: <code>git clone &lt;url&gt;</code>, <code>cd</code> into the new folder, read the README, <code>npm install</code> (it reads <code>package.json</code>), then start it the way the README says, often <code>npm start</code> or <code>node index.js</code>, and open the address it prints.</li>
      <li>Forgetting the <code>cd</code> is the classic mistake: <code>npm install</code> run outside the project finds no <code>package.json</code>.</li>
      <li><code>git clone &lt;url&gt; my-folder</code> clones into a folder name of your choice.</li>
      <li>Looking for a first open-source project to contribute to? The <a href="https://github.com/MunGell/awesome-for-beginners" target="_blank" rel="noopener">awesome-for-beginners</a> list collects projects that welcome newcomers. Contributing needs branches and pull requests, which come next.</li>
    </ul>`,
  quiz:[
    { q:'How does <code>git clone</code> relate to <code>git push</code>?', options:['They do the same thing','clone brings a remote repository down to your machine; push sends your commits up to a remote','clone uploads, push downloads','clone only copies the latest version of each file'], answer:1, why:'Cloning is how a remote repository first arrives locally; pushing sends local commits the other way.' },
    { q:'What does a fresh clone contain?', options:['Only the latest files','The files, the complete commit history and a remote called origin','Only the README','node_modules, ready to run'], answer:1, why:'A clone is a full repository: that is why git log works straight away.' },
    { q:'You cloned a Node project. What usually comes next?', options:['git init','cd into the folder and run npm install','git push','Delete the .git folder'], answer:1, why:'node_modules is not kept in the repository, so npm install rebuilds it from package.json.' },
  ],
});

PG.add({
  id:'l221', index:221, udemyId:12386684, minutes:10, section:'s27', slug:'branching-and-merging', kind:'terminal',
  title:'Branching and Merging',
  blurb:'A <b>branch</b> is a separate line of commits: main stays stable while an experiment grows on its own branch. <code>git branch name</code> creates one, <code>git checkout name</code> switches to it (and swaps the files on disk), and once the experiment works, <code>git merge name</code>, run from main, brings its commits back.',
  tasks:[
    'Set up: <code>cd Desktop/Story</code>, <code>git init</code>, <code>git add .</code>, <code>git commit -m "Complete chapters 1 to 3"</code>.',
    'Create a branch and move onto it: <code>git branch alien-plot</code>, then <code>git branch</code> (the <code>*</code> marks where you are), then <code>git checkout alien-plot</code>.',
    'Rewrite chapter 1 and chapter 2 with <code>echo "…" &gt; chapter1.txt</code> so that aliens appear, then <code>git add .</code> and <code>git commit -m "Modify chapter 1 and 2 to have alien theme"</code>.',
    'Switch back with <code>git checkout main</code> and run <code>cat chapter1.txt</code>: the original text is back, because main never saw that commit.',
    'Keep main moving: write <code>chapter4.txt</code>, then add and commit it as <code>"Add chapter 4"</code>.',
    'Merge the experiment while you are on main: <code>git merge alien-plot</code>. Check <code>cat chapter1.txt</code> and <code>ls</code>: you have the aliens <i>and</i> chapter 4. Finish with <code>git remote add origin https://github.com/you/Story.git</code> and <code>git push -u origin main</code>, then press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop/Story/chapter1.txt': 'Chapter 1: The lighthouse keeper finds a map folded inside an old boot.\n',
    '/Users/you/Desktop/Story/chapter2.txt': 'Chapter 2: The map shows an island that no chart has.\n',
    '/Users/you/Desktop/Story/chapter3.txt': 'Chapter 3: A storm forces the keeper to row out at night.\n',
    '/Users/you/Documents': null,
  },
  cwd:'/Users/you',
  welcome:'Last login: today on ttys001. The Story folder is on the Desktop, without a Git repository yet.',
  solution:[
    'cd Desktop/Story',
    'git init',
    'git add .',
    'git commit -m "Complete chapters 1 to 3"',
    'git branch alien-plot',
    'git branch',
    'git checkout alien-plot',
    'echo "Chapter 1: The map is a message from another planet." > chapter1.txt',
    'echo "Chapter 2: The island is where the aliens landed long ago." > chapter2.txt',
    'git add .',
    'git commit -m "Modify chapter 1 and 2 to have alien theme"',
    'git checkout main',
    'cat chapter1.txt',
    'echo "Chapter 4: The keeper decides to tell no one." > chapter4.txt',
    'git add .',
    'git commit -m "Add chapter 4"',
    'git merge alien-plot',
    'cat chapter1.txt',
    'ls',
    'git log --oneline',
    'git remote add origin https://github.com/you/Story.git',
    'git push -u origin main',
  ],
  checks:[
    { desc:'An alien-plot branch exists', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.branches.includes("alien-plot")' },
    { desc:'You are back on main', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.branch === "main"' },
    { desc:'main ends with a merge commit (commit chapter 4 on main before merging)', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length > 0 && /^Merge/.test(g.commits[0].msg)' },
    { desc:'After the merge, main has the changed chapter 1 and the new chapter 4', test:'const g = git("/Users/you/Desktop/Story"); if (!g || g.commits.length < 2) return false; const t = g.commits[0].tree, first = g.commits[g.commits.length - 1].tree; return "chapter4.txt" in t && t["chapter1.txt"] !== first["chapter1.txt"]' },
    { desc:'main is pushed to origin', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.commits.length > 0 && g.pushed.main === g.commits[0].id' },
  ],
  explore:[{
    title:'Commit graph', height:470,
    note:'Click the commands and watch the graph. Try both orders: commit on main <i>and</i> on alien-plot before merging (a merge commit joins the lines), or commit only on alien-plot (a fast-forward just moves the main label).',
    html:`
<div class="knobs">
  <span>on branch <b id="head"></b></span>
  <button id="bCommit">git commit</button>
  <button id="bBranch">git branch alien-plot</button>
  <button id="bMain">git checkout main</button>
  <button id="bAlien">git checkout alien-plot</button>
  <button id="bMerge">git merge alien-plot</button>
  <button id="bReset">start over</button>
</div>
<div class="stage" style="padding:6px;overflow-x:auto"><svg id="g" height="170" style="display:block"></svg></div>
<pre class="readout" id="log" style="white-space:pre-wrap;max-height:170px;overflow:auto"></pre>
<script>
  var NL = String.fromCharCode(10);
  var Y = { 'main': 52, 'alien-plot': 122 };
  var commits, tips, head, lines, counts;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function X(c) { return 48 + c.id * 74; }
  function make(msg, parents) {
    var c = { id: commits.length, msg: msg, parents: parents, lane: head };
    commits.push(c);
    tips[head] = c.id;
    return c;
  }
  function ancestors(id) {
    var seen = {}, todo = [id];
    while (todo.length) {
      var x = todo.pop();
      if (x == null || seen[x]) continue;
      seen[x] = true;
      commits[x].parents.forEach(function (p) { todo.push(p); });
    }
    return seen;
  }
  function say(cmd, note) { lines.push('$ ' + cmd + (note ? NL + '  ' + note : '')); }
  function reset() {
    commits = []; tips = { 'main': null }; head = 'main'; lines = []; counts = { 'main': 3, 'alien-plot': 0 };
    make('Complete chapters 1 to 3', []);
    say('git commit -m "Complete chapters 1 to 3"', 'The first save point, on main.');
    draw();
  }
  function commit() {
    var msg = head === 'main' ? 'Add chapter ' + (++counts['main']) : 'Aliens in chapter ' + (++counts['alien-plot']);
    make(msg, [tips[head]]);
    say('git commit -m "' + msg + '"', 'A new commit on ' + head + '. The other branch label stays where it was.');
    draw();
  }
  function branch() {
    if (tips['alien-plot'] != null) { say('git branch alien-plot', "fatal: a branch named 'alien-plot' already exists"); return draw(); }
    tips['alien-plot'] = tips[head];
    say('git branch alien-plot', 'A new label on the current commit. You are still on ' + head + ' until you check the branch out.');
    draw();
  }
  function checkout(name) {
    if (tips[name] == null) { say('git checkout ' + name, "error: pathspec '" + name + "' did not match any file(s) known to git"); return draw(); }
    if (head === name) { say('git checkout ' + name, "Already on '" + name + "'"); return draw(); }
    head = name;
    say('git checkout ' + name, "Switched to branch '" + name + "'. The files on disk now match the commit labelled " + name + '.');
    draw();
  }
  function merge() {
    if (tips['alien-plot'] == null) { say('git merge alien-plot', 'merge: alien-plot - not something we can merge'); return draw(); }
    if (head !== 'main') { say('git merge alien-plot', 'You are on alien-plot itself. A merge brings another branch INTO the one you are on, so check out main first.'); return draw(); }
    var m = tips['main'], a = tips['alien-plot'];
    if (ancestors(m)[a]) { say('git merge alien-plot', 'Already up to date: main already contains every alien-plot commit.'); return draw(); }
    if (ancestors(a)[m]) { tips['main'] = a; say('git merge alien-plot', 'Fast-forward: main had no commits of its own since the split, so its label simply moves up to the alien-plot commit. No merge commit needed.'); return draw(); }
    make("Merge branch 'alien-plot'", [m, a]);
    say('git merge alien-plot', 'Both branches moved on, so Git makes a merge commit with two parents. Real Git opens an editor for its message: :wq saves it, :q! keeps the default.');
    draw();
  }
  function draw() {
    var svg = document.getElementById('g');
    var w = Math.max(560, 96 + commits.length * 74);
    svg.setAttribute('width', w);
    svg.setAttribute('viewBox', '0 0 ' + w + ' 170');
    var s = '';
    commits.forEach(function (c) {
      c.parents.forEach(function (p) {
        var pc = commits[p];
        s += '<line x1="' + X(pc) + '" y1="' + Y[pc.lane] + '" x2="' + X(c) + '" y2="' + Y[c.lane] + '" stroke="#b8c0d8" stroke-width="3"/>';
      });
    });
    commits.forEach(function (c) {
      s += '<circle cx="' + X(c) + '" cy="' + Y[c.lane] + '" r="11" fill="' + (c.lane === 'main' ? '#5b9cff' : '#ff8fa0') + '" stroke="#fff" stroke-width="2"><title>' + esc(c.msg) + '</title></circle>';
    });
    Object.keys(tips).forEach(function (b) {
      if (tips[b] == null) return;
      var c = commits[tips[b]];
      var y = b === 'main' ? Y[c.lane] - 19 : Y[c.lane] + 28;
      var label = (head === b ? 'HEAD → ' : '') + b;
      s += '<text x="' + X(c) + '" y="' + y + '" text-anchor="middle" font-size="12" font-family="ui-monospace,Menlo,monospace" font-weight="' + (head === b ? '700' : '400') + '" fill="#1c2030">' + esc(label) + '</text>';
    });
    svg.innerHTML = s;
    document.getElementById('head').textContent = head;
    var logEl = document.getElementById('log');
    logEl.textContent = lines.join(NL + NL);
    logEl.scrollTop = logEl.scrollHeight;
  }
  document.getElementById('bCommit').onclick = commit;
  document.getElementById('bBranch').onclick = branch;
  document.getElementById('bMain').onclick = function () { checkout('main'); };
  document.getElementById('bAlien').onclick = function () { checkout('alien-plot'); };
  document.getElementById('bMerge').onclick = merge;
  document.getElementById('bReset').onclick = reset;
  reset();
<\/script>`,
  }],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>A merge always goes <i>into the branch you are on</i>. Check with <code>git branch</code> first; merging from the wrong side is the most common mistake.</li>
      <li>When both branches have new commits, real Git opens an editor (often Vim) for the merge commit's message. <code>:wq</code> then Enter saves and closes it; <code>:q!</code> closes it and keeps the default message. This simulator skips the editor.</li>
      <li>Merging does not delete the feature branch. Remove it when you are done with <code>git branch -d alien-plot</code>.</li>
      <li>Newer Git also has <code>git switch alien-plot</code> to change branches and <code>git switch -c name</code> (or <code>git checkout -b name</code>) to create and switch in one go.</li>
      <li>On GitHub, <b>Insights → Network</b> draws the split and the merge.</li>
    </ul>`,
  quiz:[
    { q:'What does <code>git branch alien-plot</code> do on its own?', options:['Creates the branch and switches to it','Creates the branch but leaves you where you are','Deletes the branch','Merges the branch'], answer:1, why:'Creating and switching are separate steps: git checkout alien-plot (or git checkout -b to do both).' },
    { q:'You commit on alien-plot, then run <code>git checkout main</code>. What happens to the files on disk?', options:['Nothing changes','They switch to main\'s version, so the alien edits disappear from the folder (but stay safe on the branch)','The alien edits are deleted for good','Git merges them automatically'], answer:1, why:'Checking out a branch rewrites the working directory to match that branch\'s latest commit.' },
    { q:'You want alien-plot\'s commits in main. Where do you run <code>git merge alien-plot</code>?', options:['On alien-plot','On main','On either one, it does not matter','On GitHub only'], answer:1, why:'A merge brings the named branch into the current one, so check out main first.' },
    { q:'What does <code>*</code> mean in the output of <code>git branch</code>?', options:['The newest branch','The branch you are currently on','A branch with uncommitted changes','A remote branch'], answer:1, why:'The asterisk marks the checked-out branch, the one your next commit will land on.' },
  ],
});

PG.add({
  id:'l222', index:222, udemyId:12386708, minutes:0, section:'s27', slug:'optional-git-challenge', kind:'read',
  title:'Optional Git Challenge',
  blurb:'An optional extra. Learn Git Branching is a free browser game that draws the commit graph as you type real Git commands, one small level at a time. Its later levels go past this course into rebasing and cherry-picking.',
  tasks:[
    'Open <a href="https://learngitbranching.js.org/" target="_blank" rel="noopener">learngitbranching.js.org</a>. Nothing to install or sign up for.',
    'On the <b>Main</b> tab, play the <b>Introduction Sequence</b>: commits, branches, merging, and a first look at rebasing.',
    'Stuck? Type <code>hint</code>. <code>show solution</code> reveals the answer and <code>levels</code> opens the level menu, but give each level a real try first.',
    'Carry on with <b>Ramping Up</b>, which covers moving HEAD around, relative references such as <code>main^</code> and <code>HEAD~2</code>, and undoing work with <code>reset</code> and <code>revert</code>.',
    'When you want more, the <b>Remote</b> tab practises <code>push</code>, <code>pull</code> and <code>fetch</code> against a simulated remote.'
  ],
  links:[
    { title:'Learn Git Branching', url:'https://learngitbranching.js.org/', note:'interactive levels that run in the browser' },
  ],
  quiz:[
    { q:'What does <code>git cherry-pick &lt;commit&gt;</code> do?', options:['Deletes a commit','Copies that one commit onto the branch you are on','Merges two whole branches','Renames a branch'], answer:1, why:'Cherry-picking takes a single commit from elsewhere and replays it on top of the current branch.' },
    { q:'What is the result of rebasing a feature branch onto main?', options:['A merge commit with two parents','The feature commits replayed on top of main, giving a straight line of history','The feature branch is deleted','main is reset to the feature branch'], answer:1, why:'Rebase rewrites the feature commits so they start from main\'s latest commit, instead of joining the lines with a merge commit.' },
  ],
});

PG.add({
  id:'l223', index:223, udemyId:12386696, minutes:15, section:'s27', slug:'forking-and-pull-requests', kind:'read',
  title:'Forking and Pull Requests',
  blurb:'You cannot push to a stranger\'s repository, and you should not be able to. Instead you <b>fork</b> it, which makes a copy under your own GitHub account, change your copy, and open a <b>pull request</b> asking the owner to pull your commits in. The owner reviews the changes, comments, and merges if they like them.',
  tasks:[
    'Pick a public repository to improve (a friend\'s practice repository is ideal) and click <b>Fork</b> at the top right. A copy appears under <code>github.com/&lt;your-name&gt;/&lt;repo&gt;</code>, with every file and commit.',
    'Change your fork. Small edits can be made in the browser: open a file, click the pencil icon, then <b>Commit changes</b>. Bigger ones: clone the fork, work on a branch, commit and push. Lesson 223b practises that part.',
    'On your fork, open <b>Contribute → Open pull request</b> (after a push, GitHub also shows a <b>Compare &amp; pull request</b> banner). Check the arrow: from your fork and branch, into the original repository\'s main branch. Read the diff.',
    'Give the pull request a clear title and a description of what you changed and why, then click <b>Create pull request</b>.',
    'The owner sees it under the <b>Pull requests</b> tab. They can comment on single lines, ask for changes, and finally click <b>Merge pull request → Confirm merge</b>. Until then, nothing in the original repository changes.',
    'After the merge, open <b>Insights → Network</b> on the original repository to see your work join its history.'
  ],
  quiz:[
    { q:'What is the difference between a fork and a clone?', options:['They are the same','A fork copies a repository to your GitHub account; a clone copies a repository to your computer','A clone happens on GitHub; a fork happens on your computer','A fork copies only the latest commit'], answer:1, why:'Forking happens on GitHub, between accounts. Cloning brings a repository, often your fork, down to your machine.' },
    { q:'Why is it called a <i>pull</i> request?', options:['You pull the original into your fork','You ask the owner, who has write access, to pull your commits into their repository','It pulls the latest version from GitHub','It is another name for git pull'], answer:1, why:'You cannot push to their repository, so you request that they pull your changes in.' },
    { q:'You commit to your fork. When do those commits appear in the original repository?', options:['Immediately','Only after the owner merges your pull request','After 24 hours','When you clone the original'], answer:1, why:'The fork is a separate repository. Your work reaches the original only through a merged pull request.' },
    { q:'What makes a pull request easy to accept?', options:['A vague title like "updates"','A clear description of what changed and why, with a focused change','As many unrelated changes as possible','No description, to save the owner time'], answer:1, why:'Maintainers review the diff and the explanation; a small, well-described change is far easier to merge.' },
  ],
});

PG.add({
  id:'l223b', index:223, sub:'b', udemyId:12386696, minutes:0, section:'s27', slug:'pull-request-local-steps', kind:'terminal',
  title:'Practice: Clone Your Fork, Branch, Commit, Push',
  blurb:'The command-line half of a contribution. After forking on GitHub, clone <b>your fork</b>, make the change on a new branch, commit it, and push that branch to your fork. GitHub then offers to open the pull request.',
  tasks:[
    'You forked <code>someone/Story</code> on GitHub, so you now own <code>https://github.com/you/Story.git</code>. Clone it: <code>cd Desktop</code>, <code>git clone https://github.com/you/Story.git</code>, <code>cd Story</code>.',
    'Check the link with <code>git remote -v</code>: <code>origin</code> is your fork, which you are allowed to push to.',
    'Work on a branch, not on main: <code>git checkout -b happier-ending</code> creates it and switches to it in one step.',
    'Make the change, <code>echo "Chapter 5: Everyone gets home safely." &gt; chapter5.txt</code>, then <code>git add .</code> and <code>git commit -m "Add a happier ending"</code>.',
    'Push the branch to your fork with <code>git push -u origin happier-ending</code>. On GitHub you would now click <b>Compare &amp; pull request</b>. Press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop': null,
    '/Users/you/Documents': null,
  },
  cwd:'/Users/you',
  solution:[
    'cd Desktop',
    'git clone https://github.com/you/Story.git',
    'cd Story',
    'git remote -v',
    'git checkout -b happier-ending',
    'echo "Chapter 5: Everyone gets home safely." > chapter5.txt',
    'git add .',
    'git commit -m "Add a happier ending"',
    'git push -u origin happier-ending',
  ],
  checks:[
    { desc:'Your fork is cloned to Desktop/Story', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.root === "/Users/you/Desktop/Story" && String(g.remotes.origin || "").indexOf("github.com") !== -1' },
    { desc:'You are working on a new branch, not on main', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.branch !== "main" && g.branches.includes("main")' },
    { desc:'The branch has your commit on top of the cloned history', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.branch !== "main" && g.commits.length >= 2 && !g.staged.length && !g.untracked.length' },
    { desc:'The branch is pushed to origin (your fork)', test:'const g = git("/Users/you/Desktop/Story"); return !!g && g.branch !== "main" && g.commits.length > 0 && g.pushed[g.branch] === g.commits[0].id' },
  ],
  notes:`
    <h3>Notes</h3>
    <ul>
      <li>A branch per change keeps your fork's main clean, and you can have several pull requests open at once, one per branch.</li>
      <li>If the original repository moves on while you work, add it as a second remote (<code>git remote add upstream &lt;original-url&gt;</code>) and pull from it to stay up to date.</li>
      <li>Pushing more commits to the same branch updates the open pull request automatically, which is how you answer review comments.</li>
    </ul>`,
  quiz:[
    { q:'After cloning your fork, which repository does <code>origin</code> point to?', options:['The original owner\'s repository','Your fork on GitHub','Nowhere until you add it','Your local folder'], answer:1, why:'A clone remembers where it came from, and you cloned the fork, so pushes go to your copy.' },
    { q:'What does <code>git checkout -b happier-ending</code> do?', options:['Deletes the branch','Creates the branch and switches to it','Pushes the branch','Lists all branches'], answer:1, why:'-b combines git branch happier-ending and git checkout happier-ending.' },
  ],
});

PG.add({
  id:'l224', index:224, udemyId:17967280, minutes:4, section:'s27', slug:'tip-spaced-repetition', kind:'read',
  title:'Tip from Angela - Spaced Repetition',
  blurb:'Memory fades unless it is used. Review a concept after growing gaps (a day, a week, a month) instead of cramming it once, keep a list of what you have learned to schedule those reviews, and practise by rebuilding small projects from scratch rather than re-watching videos.',
  quiz:[
    { q:'Which plan follows the spaced-repetition idea?', options:['Re-watch the whole Git section tonight','Rebuild a small Git exercise tomorrow, again next week, then next month','Read the notes once very carefully','Wait until you need Git at work'], answer:1, why:'Reviews at growing intervals, done by actually practising, are what turn a lesson into a lasting skill.' },
  ],
});
