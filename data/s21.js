/* ===== Section 21 — The Unix Command Line ===== */

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
