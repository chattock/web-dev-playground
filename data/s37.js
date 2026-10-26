/* ===== Section 37 — Web3 Decentralised App (DApp) Development with the Internet Computer ===== */
(function () {

/* SHA-256 for the Explore demos: crypto.subtle when the page is a secure context,
   otherwise a small pure-JS version that gives the same digests. */
const SHA = `
var K256 = [], H256 = [];
(function () {
  var p = 0, n = 2;
  function frac(x) { return (x - Math.floor(x)) * 4294967296 | 0; }
  while (p < 64) {
    for (var d = 2; d * d <= n; d++) if (n % d === 0) break;
    if (d * d > n) { if (p < 8) H256[p] = frac(Math.pow(n, 1 / 2)); K256[p++] = frac(Math.pow(n, 1 / 3)); }
    n++;
  }
})();
function sha256js(str) {
  var b = new TextEncoder().encode(str), len = b.length, H = H256.slice();
  var words = new Array((((len + 8) >> 6) + 1) << 4).fill(0), w = new Array(64);
  for (var i = 0; i < len; i++) words[i >> 2] |= b[i] << (24 - (i % 4) * 8);
  words[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
  words[words.length - 1] = len * 8;
  for (var j = 0; j < words.length; j += 16) {
    var a = H[0], c1 = H[1], c2 = H[2], c3 = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (var t = 0; t < 64; t++) {
      if (t < 16) w[t] = words[j + t] | 0;
      else {
        var x = w[t - 15], y = w[t - 2];
        w[t] = (((x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)) + w[t - 16] +
                ((y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ (y >>> 10)) + w[t - 7]) | 0;
      }
      var t1 = (h + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + ((e & f) ^ (~e & g)) + K256[t] + w[t]) | 0;
      var t2 = (((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + ((a & c1) ^ (a & c2) ^ (c1 & c2))) | 0;
      h = g; g = f; f = e; e = (c3 + t1) | 0; c3 = c2; c2 = c1; c1 = a; a = (t1 + t2) | 0;
    }
    H = [a + H[0], c1 + H[1], c2 + H[2], c3 + H[3], e + H[4], f + H[5], g + H[6], h + H[7]];
  }
  return H.map(function (v) { return ('0000000' + (v >>> 0).toString(16)).slice(-8); }).join('');
}
function toHex(buf) {
  return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
}
var encoder = new TextEncoder();
var sha256 = (window.crypto && window.crypto.subtle)
  ? function (s) { return window.crypto.subtle.digest('SHA-256', encoder.encode(s)).then(toHex); }
  : function (s) { return Promise.resolve(sha256js(s)); };
`;

PG.add({
  id:'l322', index:322, udemyId:31673262, minutes:8, section:'s37', slug:'what-is-web3', kind:'read',
  title:'What is Web3?',
  blurb:'The web has had three stages: pages you could only read (Web 1.0), platforms whose content comes from their users while the company keeps the data (Web 2.0), and apps that run on a blockchain, where ownership and payments are part of the app itself (Web3). This module teaches you to build those apps; it is not about buying coins.',
  quiz:[
    { q:'What mainly separates Web 2.0 from Web 1.0?', options:['Faster connections','Users create the content, on platforms that companies own','Everything runs on a blockchain','Pages are written in HTML5'], answer:1, why:'Web 1.0 sites were read-only. Web 2.0 platforms are filled by their users, while the company owns the data and the network.' },
    { q:'What does "Web3" mean in this course?', options:['The third version of HTML','Apps whose logic and data live on a blockchain instead of a company\'s private servers','Websites with 3D graphics','A faster successor to HTTP'], answer:1, why:'A Web3 app runs on a blockchain, so no single company owns its servers or its records.' },
    { q:'A game keeps 4.25% of every trade between players, who trade 3,000,000 a day. Roughly what does it earn per day?', options:['4,250','12,750','127,500','1,275,000'], answer:2, why:'3,000,000 × 0.0425 = 127,500. Taking a cut of in-app trades is one way a DApp can fund itself.' },
  ],
});

PG.add({
  id:'l323', index:323, udemyId:31673276, minutes:26, section:'s37', slug:'how-the-blockchain-works', kind:'read',
  title:'How does the Blockchain actually work?',
  blurb:'A blockchain is a ledger that nobody can quietly rewrite. Each block holds some data, a <b>nonce</b> and the <b>hash</b> of the block before it. SHA-256 is one-way and changes completely when a single character changes, so editing an old block breaks every link after it. Mining means trying nonces until the hash starts with enough zeros, and because many peers keep a copy, a rewritten copy stands out.',
  explore:[
    {
      title:'One-way fingerprints: SHA-256', height:300,
      note:'Edit either text. One extra character changes about 60 of the 64 hex digits, and the output length never changes. Going backwards, from a hash to the text, is only possible by guessing.',
      html:`
<style>
  .row{display:flex;gap:10px;align-items:center;margin-bottom:8px}
  .row b{width:52px;font-size:12.5px;color:#3c435c}
  .row input{flex:1;font:13px ui-monospace,Menlo,monospace;padding:6px 8px;border:1px solid #cfd5e6;border-radius:6px}
  #out span{color:#ff9aa2}
</style>
<div class="knobs" style="display:block">
  <div class="row"><b>Text A</b><input id="ta" value="Ana pays Ben 10"></div>
  <div class="row" style="margin:0"><b>Text B</b><input id="tb" value="Ana pays Ben 100"></div>
</div>
<pre class="readout" id="out"></pre>
<p class="note">Digits of B's hash that differ from A's are shown in pink.</p>
<script>
${SHA}
var ta = document.getElementById('ta'), tb = document.getElementById('tb'), out = document.getElementById('out');
async function go() {
  var A = ta.value, B = tb.value;
  var ha = await sha256(A), hb = await sha256(B);
  if (ta.value !== A || tb.value !== B) return;
  var marked = '', diff = 0;
  for (var i = 0; i < 64; i++) {
    if (ha[i] !== hb[i]) { diff++; marked += '<span>' + hb[i] + '</span>'; }
    else marked += hb[i];
  }
  out.innerHTML = 'SHA-256(A)  ' + ha + '\\nSHA-256(B)  ' + marked + '\\n\\n' + diff + ' of 64 hex digits differ. ' +
    'In: ' + A.length + ' and ' + B.length + ' characters. Out: always 64.';
}
ta.addEventListener('input', go);
tb.addEventListener('input', go);
go();
<\/script>`,
    },
    {
      title:'A four-block chain', height:560,
      note:'All four blocks start valid. Change a word in block 1: its hash changes, block 2\'s "previous hash" changes with it, and every block to the right turns red. Mine them again from left to right to repair the chain, then raise the difficulty: every extra zero means about 16 times more guessing.',
      html:`
<style>
  .chain{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px}
  .blk{flex:0 0 240px;border:2px solid #34c77b;background:#eefbf3;border-radius:10px;padding:10px 12px;font-size:12px;transition:background .25s,border-color .25s}
  .blk.bad{border-color:#f0627a;background:#fff0f2}
  .blk .top{display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:13px;margin-bottom:2px}
  .blk .state{font-size:11.5px;color:#1d8a52}
  .blk.bad .state{color:#c8243f}
  .blk .lbl{display:block;font-weight:600;color:#3c435c;margin:7px 0 3px}
  .blk input,.blk textarea{width:100%;font:12px ui-monospace,Menlo,monospace;border:1px solid #cfd5e6;border-radius:6px;padding:4px 6px;background:#fff}
  .blk textarea{height:40px;resize:none;font-family:inherit;font-size:12.5px}
  .hx{font:10.5px/1.45 ui-monospace,Menlo,monospace;word-break:break-all;background:#fff;border:1px solid #dfe3ee;border-radius:6px;padding:4px 6px;color:#5b6382}
  .hx b{color:#1d8a52}
  .blk.bad .hx.own b{color:#c8243f}
  .blk button{margin-top:9px;width:100%;font:inherit;font-weight:600;padding:5px;border:1px solid #cfd5e6;border-radius:6px;background:#fff;cursor:pointer}
  .blk button:hover{border-color:#5b9cff}
  .blk button:disabled{opacity:.5;cursor:default}
</style>
<div class="knobs">
  <label>Difficulty
    <select id="diff">
      <option value="2">hash starts with 00</option>
      <option value="3" selected>hash starts with 000</option>
      <option value="4">hash starts with 0000</option>
      <option value="5">hash starts with 00000</option>
    </select>
  </label>
  <span class="note" id="stat" style="margin:0">Change a word in block 1 and watch the blocks after it.</span>
</div>
<div class="chain" id="chain"></div>
<p class="note">Hash = SHA-256 of block number + nonce + data + previous hash. Block 1 is the genesis block, so its previous hash is 64 zeros.</p>
<script>
${SHA}
var ZERO = new Array(65).join('0');
var blocks = [
  { data: 'Ana pays Ben 10', nonce: 135099 },
  { data: 'Ben pays Cara 4', nonce: 35227 },
  { data: 'Cara pays Dev 2.50', nonce: 10512 },
  { data: 'Dev pays Ana 1', nonce: 27814 }
];
var diffSel = document.getElementById('diff'), stat = document.getElementById('stat'), chainEl = document.getElementById('chain');
var cards = [], hashes = [], seq = 0, busy = false;

function contentOf(i, nonce, prev) { return String(i + 1) + nonce + blocks[i].data + prev; }

blocks.forEach(function (b, i) {
  var el = document.createElement('div');
  el.className = 'blk';
  el.innerHTML = '<div class="top">Block #' + (i + 1) + '<span class="state"></span></div>' +
    '<span class="lbl">Nonce</span><input class="nonce" type="number" min="0">' +
    '<span class="lbl">Data</span><textarea class="data"></textarea>' +
    '<span class="lbl">Previous hash</span><div class="hx prev"></div>' +
    '<span class="lbl">Hash</span><div class="hx own"></div>' +
    '<button class="mine">⛏ Mine</button>';
  chainEl.appendChild(el);
  var c = { el: el, nonce: el.querySelector('.nonce'), data: el.querySelector('.data'), prev: el.querySelector('.prev'),
            own: el.querySelector('.own'), state: el.querySelector('.state'), btn: el.querySelector('.mine') };
  c.nonce.value = b.nonce;
  c.data.value = b.data;
  c.data.addEventListener('input', function () { b.data = c.data.value; refresh(); });
  c.nonce.addEventListener('input', function () { b.nonce = parseInt(c.nonce.value, 10) || 0; refresh(); });
  c.btn.addEventListener('click', function () { mine(i); });
  cards.push(c);
});

async function refresh() {
  var run = ++seq, D = +diffSel.value, target = ZERO.slice(0, D);
  for (var i = 0; i < blocks.length; i++) {
    var prev = i ? hashes[i - 1] : ZERO;
    var h = await sha256(contentOf(i, blocks[i].nonce, prev));
    if (run !== seq) return;
    hashes[i] = h;
    var ok = h.indexOf(target) === 0, c = cards[i];
    c.el.classList.toggle('bad', !ok);
    c.state.textContent = ok ? '✓ valid' : '✗ invalid';
    c.prev.textContent = prev;
    c.own.innerHTML = '<b>' + h.slice(0, D) + '</b>' + h.slice(D);
  }
}

async function mine(i) {
  if (busy) return;
  busy = true;
  cards.forEach(function (c) { c.btn.disabled = true; });
  cards[i].btn.textContent = '⛏ mining…';
  var D = +diffSel.value, target = ZERO.slice(0, D), prev = i ? hashes[i - 1] : ZERO, n = 0, t0 = performance.now();
  for (;;) {
    var batch = [];
    for (var k = 0; k < 400; k++) batch.push(sha256(contentOf(i, n + k, prev)));
    var hs = await Promise.all(batch), hit = -1;
    for (k = 0; k < hs.length; k++) if (hs[k].indexOf(target) === 0) { hit = k; break; }
    if (hit >= 0) { n += hit; break; }
    n += 400;
    stat.textContent = 'Mining block #' + (i + 1) + ': ' + n.toLocaleString() + ' nonces tried…';
  }
  blocks[i].nonce = n;
  cards[i].nonce.value = n;
  stat.textContent = 'Block #' + (i + 1) + ' mined: nonce ' + n.toLocaleString() + ', found after ' +
    (n + 1).toLocaleString() + ' hashes in ' + ((performance.now() - t0) / 1000).toFixed(2) + ' s.';
  cards[i].btn.textContent = '⛏ Mine';
  cards.forEach(function (c) { c.btn.disabled = false; });
  busy = false;
  refresh();
}

diffSel.addEventListener('change', refresh);
refresh();
<\/script>`,
    },
  ],
  quiz:[
    { q:'Why is encrypting a ledger not enough to stop tampering?', options:['Encryption is too slow for ledgers','Whoever has the key, or breaks the cipher, can decrypt, edit and re-encrypt it: encryption hides data but does not make edits visible','Encrypted text is longer than the original','Browsers cannot decrypt text'], answer:1, why:'Encryption is reversible by design. A blockchain needs tamper evidence, which one-way hashes chained together provide.' },
    { q:'What is the nonce in a block?', options:['The amount being paid','A number the miner keeps changing until the block\'s hash meets the difficulty rule','The previous block\'s hash','The block number'], answer:1, why:'The data stays as it is; only the nonce changes, one try at a time, until the hash starts with the required zeros.' },
    { q:'You edit the data in block 2 of a 4-block chain. Which blocks become invalid?', options:['Only block 2','Blocks 2, 3 and 4','Only block 1','None, because the nonce did not change'], answer:1, why:'Block 2\'s hash changes, block 3 uses that hash as its "previous hash" so its own hash changes, and so on to the end of the chain.' },
    { q:'Peer B edits an old block and re-mines its whole copy so every block is valid again. Why is the edit still caught?', options:['Mining leaves a signature','B\'s hashes no longer match the copies the other peers hold','The genesis block cannot be mined','Hashes expire after a day'], answer:1, why:'Identical data gives identical hashes, so the one copy that differs from everyone else\'s is easy to spot.' },
  ],
});

PG.add({
  id:'l324', index:324, udemyId:31673280, minutes:9, section:'s37', slug:'what-are-dapps', kind:'read',
  title:'What are DApps (Decentralised Apps) and how do you develop them?',
  blurb:'A DApp runs its logic on a blockchain instead of one company\'s servers. Tokens can fund it from day one, and governance tokens let holders vote on its direction (a <b>DAO</b>). On Ethereum, though, computation is expensive and storage impractical, so most DApps keep their front end and files on ordinary cloud hosting. That gap is what the Internet Computer sets out to close.',
  quiz:[
    { q:'What is a DAO?', options:['A token exchange','An organisation steered by votes from its token holders instead of a board','A smart-contract programming language','A data centre'], answer:1, why:'Governance tokens carry votes, so the people holding them decide where the project goes.' },
    { q:'Where is the image of a typical Ethereum NFT stored?', options:['Inside the block itself','Off-chain (IPFS or a cloud server); the chain only stores a link to it','In the buyer\'s wallet app','Inside the smart contract\'s code'], answer:1, why:'On-chain storage on Ethereum costs far too much, so only a URL goes on the chain.' },
    { q:'Why do many Ethereum DApps still depend on services like AWS?', options:['Ethereum requires AWS','On-chain computation and storage cost too much, so front ends and files are hosted in the cloud','Browsers cannot reach blockchains','It makes mining faster'], answer:1, why:'Only a small slice of such an app is on-chain; the rest sits with a cloud provider that could switch it off.' },
  ],
});

PG.add({
  id:'l325', index:325, udemyId:31673284, minutes:9, section:'s37', slug:'what-is-the-internet-computer', kind:'read',
  title:'What is the Internet Computer (ICP)?',
  blurb:'The Internet Computer is a blockchain built to host an entire application (logic, data and front end) in <b>canisters</b>: WebAssembly programs that keep their own memory and answer normal HTTPS requests. You write them in Motoko (this course) or Rust, and their variables simply keep their values between calls, so much of the usual database code disappears.',
  quiz:[
    { q:'What is a canister?', options:['A browser wallet extension','A WebAssembly program plus its memory, running on the Internet Computer','A kind of token','A data centre'], answer:1, why:'A canister bundles code and state. Users reach it over HTTPS like any web server.' },
    { q:'Why could an on-chain photo-sharing app not run on Ethereum?', options:['Ethereum has no smart contracts','Storage would cost a fortune and the chain handles only a handful of transactions per second','Ethereum only runs Rust','Its blocks are too large'], answer:1, why:'Gigabytes of photos and constant posting are far beyond what Ethereum\'s storage prices and throughput allow.' },
    { q:'What happens to a canister\'s variables between calls?', options:['They reset after each call','They keep their values, so state persists without a separate database','They are saved in the user\'s browser','They are deleted with every new block'], answer:1, why:'Canister memory is preserved. Lecture 334 shows how to keep it across code upgrades too.' },
  ],
});

PG.add({
  id:'l326', index:326, udemyId:31678552, minutes:1, section:'s37', slug:'read-me', kind:'read',
  title:'Read Me!',
  blurb:'A short heads-up: the Web3 sections assume you are comfortable with JavaScript, React and building both front and back ends. If something here feels unfamiliar, go back to the earlier sections first.',
  body:`
<h3>Before you start</h3>
<ol>
  <li>You have built the Keeper app in the React section. Section 40 puts it on the Internet Computer.</li>
  <li>You can use a terminal: <code>cd</code>, <code>mkdir</code>, and keeping two terminals open side by side.</li>
  <li>Node.js and npm are installed. Check in a terminal:
<pre data-lang="sh">node --version
npm --version</pre></li>
</ol>
<p>The next two lectures install the Internet Computer tools, one for Mac and one for Windows. Do the one for your computer and skip the other.</p>`,
});

PG.add({
  id:'l327', index:327, udemyId:31673380, minutes:7, section:'s37', slug:'mac-setup', kind:'read',
  title:'[Mac Users] Installation and Setup for Web3 Development',
  blurb:'Installs the Internet Computer toolchain on a Mac (Node LTS, the <code>dfx</code> SDK, VS Code with the Motoko extension), then checks it works by creating, deploying and opening the sample "hello" DApp on a local replica.',
  body:`
<p>The commands for each step. Lines starting with <code>#</code> are comments.</p>
<h3>1. Node.js (LTS)</h3>
<p>Install the LTS release from nodejs.org if you do not have it, then check the version:</p>
<pre data-lang="sh">node --version    # the video asks for 16 or newer; any current LTS release works</pre>
<h3>2. The dfx SDK</h3>
<pre data-lang="sh">sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
dfx --version     # the video shows 0.9.3; you will get a much newer version</pre>
<p>Paste the install line in one piece, closing quote included, and open a new terminal afterwards so the updated PATH is used. On an Apple-silicon Mac, the error "Bad CPU type in executable" means Rosetta is missing: run <code>softwareupdate --install-rosetta</code>.</p>
<h3>3. VS Code and the Motoko extension</h3>
<p>Install VS Code, then the extension named <b>Motoko</b> from the DFINITY Foundation (there are look-alikes with similar names).</p>
<h3>4. Create the sample project</h3>
<pre data-lang="sh">mkdir ~/ic-projects
cd ~/ic-projects
dfx new hello_world    # newer dfx asks for a backend language (Motoko) and a frontend framework
cd hello_world
code .                 # opens the folder in VS Code (or use File → Open)</pre>
<h3>5. Run it locally</h3>
<pre data-lang="sh"># terminal 1: the local Internet Computer. Leave it running.
dfx start

# terminal 2: same folder
dfx deploy             # builds the project and installs its canisters on the local replica
npm start              # dev server; open the URL it prints</pre>
<p>With a recent dfx you can use one terminal instead: <code>dfx start --background</code> (stop it later with <code>dfx stop</code>). <code>dfx deploy</code> also prints a URL for the frontend canister that you can open directly.</p>
<h3>6. Check it</h3>
<p>Type your name and press the button. The greeting is produced by the Motoko canister, so seeing it means the whole toolchain works.</p>
<p>DFINITY has since released a second command-line tool, icp-cli (<code>icp new</code>, <code>icp network start -d</code>, <code>icp deploy</code>). The course uses dfx, which still installs and works alongside it.</p>`,
  links:[
    { title:'Node.js downloads', url:'https://nodejs.org/', note:'pick the LTS release' },
    { title:'Motoko extension for VS Code', url:'https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko', note:'published by the DFINITY Foundation' },
    { title:'ICP developer docs', url:'https://docs.internetcomputer.org/', note:'current install instructions and guides' },
  ],
  quiz:[
    { q:'Why does the lecture use two terminals?', options:['dfx only works inside VS Code','dfx start keeps the local replica running in the first one, while you deploy from the second','One is for Node and one for Motoko','It makes deploying faster'], answer:1, why:'dfx start occupies its terminal for as long as the local replica runs (unless you start it with --background).' },
    { q:'What does <code>dfx deploy</code> do here?', options:['Publishes the app to the live Internet Computer','Builds the project and installs its canisters on the local replica','Installs dfx','Opens the project in VS Code'], answer:1, why:'Without --network ic, dfx works against the local replica started by dfx start.' },
  ],
});

PG.add({
  id:'l328', index:328, udemyId:31673386, minutes:13, section:'s37', slug:'windows-setup', kind:'read',
  title:'[Windows Users] Installation and Setup for Web3 Development',
  blurb:'dfx does not run on Windows directly, so the Windows route goes through <b>WSL 2</b>, which runs Ubuntu inside Windows. You install WSL, VS Code with the Motoko and WSL extensions, then Node and dfx inside Ubuntu, and finally create and deploy the sample "hello" DApp from a VS Code window connected to WSL.',
  body:`
<p>The commands for each step. Lines starting with <code>#</code> are comments.</p>
<h3>1. Check your Windows version</h3>
<p>You need Windows 10 version 2004 (build 19041) or later, or Windows 11, and a 64-bit system. Run <code>winver</code> to see the build; Settings → System → About shows "64-bit operating system".</p>
<h3>2. Install WSL (PowerShell, run as administrator)</h3>
<pre data-lang="sh">wsl --install      # then restart Windows
# on the next start Ubuntu asks for a new username and password (the password stays invisible as you type)
wsl -l -v          # Ubuntu should be listed with VERSION 2</pre>
<h3>3. VS Code</h3>
<p>Install VS Code, then two extensions: <b>Motoko</b> (DFINITY Foundation) and <b>WSL</b> (Microsoft; called Remote - WSL in the video).</p>
<h3>4. Node.js inside Ubuntu</h3>
<p>Node has to be installed inside Ubuntu, even if Windows already has it. The video does this with Homebrew (<code>brew install node@16</code>). The shortest route today is nvm, typed in the Ubuntu terminal:</p>
<pre data-lang="sh">curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# close and reopen the Ubuntu terminal, then:
nvm install --lts
node --version</pre>
<h3>5. dfx inside Ubuntu</h3>
<pre data-lang="sh">sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
# open a new terminal; if dfx is still "not found", add the folder the installer printed to PATH:
echo 'export PATH="$PATH:/path/printed/by/the/installer"' >> ~/.bashrc
source ~/.bashrc
dfx --version</pre>
<p>In the PATH line, replace the placeholder with the real folder and leave no space after the colon.</p>
<h3>6. Create the project from a WSL window</h3>
<p>In VS Code, click the remote button in the bottom-left corner and choose <b>Connect to WSL</b> (New WSL Window in the video). The status bar must show <b>WSL: Ubuntu</b>. Then, in that window's terminal:</p>
<pre data-lang="sh">mkdir ic-projects
cd ic-projects
dfx new hello
explorer.exe .     # optional: shows the folder in Windows Explorer</pre>
<p>Open <code>ic-projects/hello</code> with File → Open Folder. If <code>main.mo</code> has no syntax colours, open the Extensions panel and press <b>Install in WSL: Ubuntu</b> on the Motoko extension.</p>
<h3>7. Run it</h3>
<pre data-lang="sh"># terminal 1
dfx start
# terminal 2 (use the split-terminal button)
dfx deploy
npm start          # open the URL it prints</pre>
<p>Enter a name and press the button: the greeting comes from the canister. As on the Mac, a recent dfx also accepts <code>dfx start --background</code>, and DFINITY's newer icp-cli can be installed alongside dfx.</p>`,
  links:[
    { title:'Install WSL (Microsoft docs)', url:'https://learn.microsoft.com/en-us/windows/wsl/install', note:'requirements and troubleshooting' },
    { title:'Motoko extension for VS Code', url:'https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko', note:'install it in the WSL window too' },
    { title:'WSL extension for VS Code', url:'https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl', note:'lets VS Code work inside Ubuntu' },
  ],
  quiz:[
    { q:'Why does the Windows setup go through WSL?', options:['dfx needs a Linux environment, and WSL runs Ubuntu inside Windows','VS Code requires it','Node.js does not run on Windows','It speeds Windows up'], answer:0, why:'The Internet Computer SDK is built for Linux and macOS, so on Windows it runs inside Ubuntu.' },
    { q:'After installing dfx in Ubuntu, <code>dfx --version</code> says "command not found". What is the usual fix?', options:['Reinstall Windows','Open a new terminal, or add the folder the installer printed to PATH (no space after the colon)','Install dfx from PowerShell instead','Run npm start first'], answer:1, why:'The shell only finds programs in the folders listed in PATH, and a terminal reads PATH when it starts.' },
  ],
});

})();
