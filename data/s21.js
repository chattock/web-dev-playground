/* ===== Section 21 — The Unix Command Line ===== */

PG.add({
  id:'l185', index:185, udemyId:12371166, minutes:3, section:'s21', slug:'git-bash-windows', kind:'terminal',
  title:'Install Git Bash on Windows',
  blurb:'Windows does not come with a Bash shell, so the course has Windows users install <b>Git for Windows</b>, which brings <b>Git Bash</b> along with Git. In VS Code you then choose Git Bash from the dropdown next to the terminal\'s <b>+</b> button, and make it the default with <i>Terminal: Select Default Profile</i> in the Command Palette (Ctrl+Shift+P). Macs need nothing extra: their Terminal already understands the same commands.',
  tasks:[
    'The <code>$</code> at the end of the prompt means the shell is waiting for a command, exactly as in Git Bash. Run <code>pwd</code> to print the folder you are in.',
    'Run <code>ls</code> to list what that folder contains.',
    'Run <code>echo "Hello from Bash"</code>. echo simply prints what you give it.',
    'Press the up arrow to bring that command back, change the text, and press Enter.',
    'Run <code>history</code> to see everything you typed, then press <b>Check my work</b>.'
  ],
  fs:{ '/Users/you/Desktop': null, '/Users/you/Documents': null, '/Users/you/Downloads': null },
  cwd:'/Users/you',
  welcome:'Bash (simulated). The $ at the end of the prompt means the shell is ready for a command.',
  solution:['pwd', 'ls', 'echo "Hello from Bash"', 'echo "Hello again"', 'history'],
  checks:[
    { desc:'You printed the working directory with pwd', test:'return shell.history.some(h => /^pwd$/.test(h))' },
    { desc:'You listed the folder with ls', test:'return shell.history.some(h => /^ls\\b/.test(h))' },
    { desc:'You ran echo twice (the second time from the up arrow)', test:'return shell.history.filter(h => /^echo\\s/.test(h)).length >= 2' },
    { desc:'You looked at your command history', test:'return shell.history.some(h => /^history$/.test(h))' },
  ],
  quiz:[
    { q:'Why do Windows users install Git Bash for this course?', options:['Windows has no terminal at all','It gives Windows a Bash shell that understands the same Unix commands the course uses','It makes VS Code faster','HTML needs it'], answer:1, why:'Windows descends from DOS and its own shells use different commands. Git Bash adds a Unix-style shell, so everyone can follow the same instructions.' },
    { q:'How do you make Git Bash the default terminal in VS Code?', options:['Settings, then Font','Command Palette, then Terminal: Select Default Profile, then Git Bash','Reinstall VS Code','Type bash into the browser'], answer:1, why:'The default profile decides which shell a new terminal opens with. Terminals that are already open keep their old shell, so open a fresh one afterwards.' },
  ],
});

PG.add({
  id:'l186', index:186, udemyId:12384360, minutes:5, section:'s21', slug:'understanding-the-command-line', kind:'terminal',
  title:'Understanding the Command Line. Long Live the Command Line!',
  blurb:'The <b>kernel</b> is the core of the operating system, the part that talks to the hardware. A <b>shell</b> is how you talk to the kernel: Finder or Explorer is a graphical shell, and <b>Bash</b> (Bourne Again Shell) is a command-line one. The command line wins on control and speed: one short command makes a folder, the up arrow repeats it with a tweak, and <code>ls -a</code> shows the hidden files a graphical window keeps from you.',
  tasks:[
    'Run <code>ls</code> to see what is in your home folder.',
    'Make a folder with <code>mkdir Music</code>, then <code>ls</code> again to see it.',
    'Press the up arrow until <code>mkdir Music</code> comes back, add a <code>2</code> to the end, and press Enter. Two folders, almost no typing.',
    'Run <code>mkdir .Secrets</code>, then <code>ls</code>. A name that starts with a dot is hidden, so it is not listed (the Files panel shows hidden items dimmed).',
    'Run <code>ls -a</code> to show everything, including <code>.Secrets</code>, the existing <code>.zshrc</code>, and the <code>.</code> and <code>..</code> entries. Then press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop': null,
    '/Users/you/Documents': null,
    '/Users/you/Downloads': null,
    '/Users/you/.zshrc': '# settings for your shell live in hidden files like this one\n',
  },
  cwd:'/Users/you',
  solution:['ls', 'mkdir Music', 'ls', 'mkdir Music2', 'mkdir .Secrets', 'ls', 'ls -a'],
  checks:[
    { desc:'A Music folder exists in your home folder', test:'return fs.isDir("/Users/you/Music")' },
    { desc:'A Music2 folder exists as well', test:'return fs.isDir("/Users/you/Music2")' },
    { desc:'A hidden .Secrets folder exists', test:'return fs.isDir("/Users/you/.Secrets")' },
    { desc:'You revealed hidden items with ls -a', test:'return shell.history.some(h => /^ls\\s+-[a-z]*a/.test(h))' },
  ],
  quiz:[
    { q:'What is the kernel?', options:['The program you type commands into','The core of the operating system, which talks to the hardware','A text editor','A hidden folder'], answer:1, why:'The shell is the layer you use; the kernel sits underneath it and does the work with the hardware.' },
    { q:'What does Bash stand for?', options:['Basic Shell','Bourne Again Shell','Binary Access Shell','Batch Shell'], answer:1, why:'It is a successor to the original Bourne shell, hence the pun in its name.' },
    { q:'Why does plain <code>ls</code> not show <code>.Secrets</code>?', options:['The folder is empty','Names starting with a dot are hidden unless you use ls -a','ls never shows folders','mkdir failed'], answer:1, why:'Dot-files and dot-folders are hidden by convention; configuration files often use this to stay out of the way.' },
  ],
});

PG.add({
  id:'l187', index:187, udemyId:12384404, minutes:10, section:'s21', slug:'directory-navigation', kind:'terminal',
  title:'Command Line Techniques and Directory Navigation',
  blurb:'The prompt tells you where you are (<code>~</code> is your home folder). <code>ls</code> lists what is here, <code>cd</code> moves: down into a child folder, up with <code>cd ..</code>, home with <code>cd ~</code>, or several levels at once with a <code>/</code> path. Tab completes names and the arrow keys replay history.',
  tasks:[
    'Run <code>ls</code> to see the folders in your home directory.',
    'Go down three levels in one command: <code>cd Documents/Learn/Languages</code>, then <code>ls</code>.',
    'Climb back up one level at a time with <code>cd ..</code> until you are home (watch the prompt change).',
    'Jump straight into <code>Music</code> from anywhere with a path that starts at home: <code>cd ~/Music</code>.',
    'Use Tab: type <code>cd Do</code> and press Tab — it lists both matches; add a letter and Tab again.',
    'Press <b>Check my work</b>.'
  ],
  fs:{
    '/Users/you/Desktop': null,
    '/Users/you/Documents/Learn/Languages/french.txt': 'bonjour',
    '/Users/you/Documents/Learn/Languages/spanish.txt': 'hola',
    '/Users/you/Documents/Learn/Music Theory/scales.txt': 'C D E F G A B',
    '/Users/you/Documents/Taxes/2024.pdf': '',
    '/Users/you/Downloads': null,
    '/Users/you/Music/playlist.txt': 'track 1',
    '/Users/you/Pictures': null,
  },
  cwd:'/Users/you',
  solution:[
    'ls',
    'cd Documents/Learn/Languages',
    'ls',
    'cd ..',
    'cd ..',
    'cd ..',
    'cd ~/Music',
    'ls',
    'cd ~',
  ],
  checks:[
    { desc:'You listed a folder with ls', test:'return shell.history.some(h => /^ls\\b/.test(h))' },
    { desc:'You visited Documents/Learn/Languages', test:'return shell.history.some(h => /^cd\\s+Documents\\/Learn\\/Languages\\/?$/.test(h))' },
    { desc:'You climbed up with cd ..', test:'return shell.history.filter(h => /^cd\\s+\\.\\.\\/?$/.test(h)).length >= 2' },
    { desc:'You jumped to ~/Music with a home-relative path', test:'return shell.history.some(h => /^cd\\s+~\\/Music\\/?$/.test(h))' },
  ],
  quiz:[
    { q:'What does <code>~</code> mean in the prompt?', options:['The root of the disk','Your home directory','The previous directory','A hidden folder'], answer:1, why:'The tilde is shorthand for /Users/your-name (macOS) or /home/your-name (Linux).' },
    { q:'You are in <code>~/Documents/Learn/Languages</code> and want <code>~/Music</code>. Which works?', options:['cd Music','cd ../Music','cd ~/Music','cd /Music'], answer:2, why:'Music is not a child of Languages, so a bare name fails. A path from home (~/Music) or climbing up three levels first both work.' },
    { q:'What does pressing Tab do after typing <code>cd Dow</code>?', options:['Runs the command','Completes it to Downloads/','Deletes the line','Shows the history'], answer:1, why:'Tab completion fills in the rest of a name once it is unambiguous; with several matches it lists them.' },
  ],
});

PG.add({
  id:'l188', index:188, udemyId:12384438, minutes:9, section:'s21', slug:'creating-opening-removing-files', kind:'terminal',
  title:'Creating, Opening, and Removing Files through the Command Line',
  blurb:'<code>mkdir</code> makes a folder and <code>touch</code> makes an empty file. <code>open</code> opens a file in its default app on a Mac (<code>open -a TextEdit file</code> picks the app; Git Bash uses <code>start</code>). <code>rm</code> deletes a file and <code>rm -r</code> deletes a folder with everything in it. There is no Trash on the command line, so check where you are with <code>pwd</code> before deleting anything, and never run <code>sudo rm -rf /</code>, which wipes the whole disk.',
  tasks:[
    'You start on the Desktop. Make a folder with <code>mkdir Angela</code> (the video\'s name; use your own if you like), go into it with <code>cd</code>, and confirm with <code>ls</code> that it is empty.',
    'Create an empty file: <code>touch Text2.txt</code>, then <code>ls</code>.',
    'Open it with <code>open Text2.txt</code>. The simulator only reports what would open; on Windows the command is <code>start</code>.',
    'Check where you are with <code>pwd</code>, then delete the file with <code>rm Text2.txt</code>.',
    'Make three files in one go, <code>touch a.txt b.txt c.txt</code>, and delete them. A real shell lets you write <code>rm *</code> for every file in the folder; this simulator does not expand <code>*</code>, so name them: <code>rm a.txt b.txt c.txt</code>.',
    'Go back up with <code>cd ..</code>. Try <code>rm Angela</code> and read the error, then remove the folder properly with <code>rm -r Angela</code>. Press <b>Check my work</b>.'
  ],
  notes:'<p>The simulator does not expand wildcards (<code>*</code>) and does not understand <code>open -a</code>; both work in a real Mac Terminal, and <code>*</code> works in Git Bash too. For more commands (grep, curl and others), the free <a href="https://www.learnenough.com/command-line-tutorial" target="_blank" rel="noopener">Learn Enough Command Line to Be Dangerous</a> tutorial mentioned in the video is a good next step.</p>',
  fs:{
    '/Users/you/Desktop/todo.txt': 'buy milk\n',
    '/Users/you/Documents': null,
    '/Users/you/Downloads': null,
  },
  cwd:'/Users/you/Desktop',
  solution:[
    'mkdir Angela',
    'cd Angela',
    'ls',
    'touch Text2.txt',
    'ls',
    'open Text2.txt',
    'pwd',
    'rm Text2.txt',
    'touch a.txt b.txt c.txt',
    'ls',
    'rm a.txt b.txt c.txt',
    'cd ..',
    'rm Angela',
    'rm -r Angela',
    'ls',
  ],
  checks:[
    { desc:'You made a folder with mkdir and went into it with cd', test:'return shell.history.some(h => /^mkdir\\s+\\S/.test(h)) && shell.history.some(h => /^cd\\s+(?!\\.\\.)\\S/.test(h))' },
    { desc:'You created files with touch', test:'return shell.history.some(h => /^touch\\s+\\S/.test(h))' },
    { desc:'You opened a file with open (or start)', test:'return shell.history.some(h => /^(open|start)\\s+\\S/.test(h))' },
    { desc:'You checked where you were with pwd', test:'return shell.history.includes("pwd")' },
    { desc:'You deleted a file with plain rm', test:'return shell.history.some(h => /^rm\\s+(?!-)\\S+\\.\\w+/.test(h))' },
    { desc:'You removed the folder with rm -r, leaving only todo.txt on the Desktop', test:'return shell.history.some(h => /^rm\\s+-[a-z]*r/.test(h)) && fs.list("/Users/you/Desktop").join() === "todo.txt"' },
  ],
  quiz:[
    { q:'What happens with <code>rm Angela</code> when Angela is a folder?', options:['The folder is deleted','It refuses, saying Angela is a directory: folders need rm -r','It moves to the Trash','It creates a file called Angela'], answer:1, why:'Plain rm only removes files. -r (recursive) removes a folder together with everything inside it.' },
    { q:'Where do files deleted with <code>rm</code> go?', options:['To the Trash or Recycle Bin','Nowhere: they are deleted at once','To a hidden .trash folder','Back to Downloads'], answer:1, why:'The command line has no safety net, which is why you check your location before deleting.' },
    { q:'What does <code>touch notes.txt</code> do?', options:['Opens notes.txt','Creates an empty notes.txt (or just updates its timestamp if it exists)','Deletes notes.txt','Prints notes.txt'], answer:1, why:'touch is the quickest way to create an empty file from the terminal.' },
    { q:'Why run <code>pwd</code> before <code>rm *</code>?', options:['pwd makes rm faster','* matches every file in the current folder, so you must be sure which folder that is','pwd backs the files up','rm * only works after pwd'], answer:1, why:'The same command deletes different files depending on where you run it.' },
  ],
});

PG.add({
  id:'l189', index:189, udemyId:17967188, minutes:4, section:'s21', slug:'tip-sleep', kind:'read',
  title:'Tip from Angela - Sleep is My Secret Weapon',
  blurb:'Cutting sleep to study more backfires: routine work survives a short night, but learning new things, making connections and creative problem solving all suffer, and sleep is when the day\'s learning gets consolidated. Wind down for an hour before bed (screens off, a book, a warm drink) and keep a regular rhythm.',
});
