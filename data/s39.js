/* ===== Section 39 — Deploying to the ICP Live Blockchain ===== */
(function () {

PG.add({
  id:'l339', index:339, udemyId:31673436, minutes:7, section:'s39', slug:'cycles-and-icp', kind:'read',
  title:'What are Cycles and the ICP Token?',
  blurb:'The local replica is free; the live Internet Computer is not. Canisters pay for computation and storage with <b>cycles</b>, which are made by burning <b>ICP</b> tokens. ICP can be bought, earned (voting in the NNS, running a node) or granted, while cycles cannot be traded and simply run down as a canister works. Creating a canister is the expensive step, so read the whole deployment section before running its commands.',
  quiz:[
    { q:'How do ICP and cycles differ?', options:['They are the same token under two names','ICP is tradable; cycles are made by burning ICP and only pay for a canister\'s computation and storage','Cycles are tradable and ICP is not','Cycles only exist on the local replica'], answer:1, why:'Converting ICP to cycles is one-way, and cycles live on canisters rather than in markets.' },
    { q:'Which action uses the most cycles?', options:['A query call','Creating a new canister','Reading the balance','Running dfx start'], answer:1, why:'The first deploy to the network creates canisters, which costs far more than upgrading their code later.' },
    { q:'What happens when a canister runs out of cycles?', options:['It keeps running for free','It stops answering requests until it is topped up','It is turned back into ICP','It moves to your local replica'], answer:1, why:'Like a gas bottle running empty: refill it with cycles and it works again.' },
  ],
});

PG.add({
  id:'l340', index:340, udemyId:31678498, minutes:3, section:'s39', slug:'claim-free-cycles', kind:'read',
  title:'How to Claim Free Cycles from Dfinity',
  blurb:'DFINITY\'s faucet gives learners a one-off batch of free cycles (about 10T at the time of the article). You request a coupon through the developer Discord, redeem it with dfx, and point your project at the result. Optional: everything in the course also runs on the local replica, which needs no cycles.',
  body:`
<p>The commands for each step. Replace the parts in angle brackets with your own values.</p>
<h3>1. Get a coupon</h3>
<ol>
  <li>Open the cycles faucet and choose to request cycles. It sends you to the ICP developer Discord, so you need a free Discord account.</li>
  <li>In the <code>#cycles-faucet</code> channel, accept the rules, type <code>/request</code> and answer the bot's short survey, which asks for your GitHub account.</li>
  <li>The bot sends the coupon in a direct message, so allow DMs from server members.</li>
</ol>
<h3>2. Redeem it into a cycles wallet (the article's route)</h3>
<pre data-lang="sh">dfx --version            # the article asks for 0.12.0 or newer; update with: dfxvm update
dfx wallet --network ic redeem-faucet-coupon &lt;COUPON_CODE&gt;
# write down the wallet canister id it prints, then, inside the dbank folder:
dfx identity --network ic set-wallet --force &lt;WALLET_ID&gt;
dfx wallet --network ic balance</pre>
<h3>3. Optional: see the wallet in the browser</h3>
<pre data-lang="sh">dfx identity get-principal
dfx canister --network ic call &lt;WALLET_ID&gt; authorize '(principal "&lt;YOUR_PRINCIPAL&gt;")'</pre>
<h3>Newer dfx: the cycles ledger</h3>
<p>Recent dfx versions can keep cycles in a cycles-ledger account instead of a wallet canister. If the faucet page shows this form of the command, use it:</p>
<pre data-lang="sh">dfx cycles redeem-faucet-coupon &lt;COUPON_CODE&gt; --network ic
dfx cycles balance --network ic</pre>`,
  links:[
    { title:'DFINITY cycles faucet', url:'https://faucet.dfinity.org/', note:'start here' },
    { title:'ICP developer Discord', url:'https://discord.internetcomputer.org/', note:'the #cycles-faucet channel' },
  ],
  quiz:[
    { q:'Which flag sends a dfx command to the live Internet Computer instead of your local replica?', options:['--live','--network ic','--remote','--mainnet=true'], answer:1, why:'Without it, dfx talks to the local replica started by dfx start.' },
  ],
});

PG.add({
  id:'l341', index:341, udemyId:31673470, minutes:3, section:'s39', slug:'deploy-to-icp', kind:'read',
  title:'How to Deploy to the ICP Network',
  blurb:'With a funded wallet linked to the project, one command puts DBank on the live network: <code>dfx deploy --network ic</code>. The frontend canister\'s id gives you a public address anyone can open. The first deploy is the expensive one, because it creates the canisters; later deploys only upgrade their code.',
  body:`
<p>Run these inside the dbank project, with the wallet from the previous lecture set up.</p>
<h3>1. Deploy</h3>
<pre data-lang="sh">npm install                 # the frontend packages; quick if they are already there
dfx deploy --network ic     # creates the canisters on the live network and uploads the front end</pre>
<h3>2. Find the address</h3>
<pre data-lang="sh">dfx canister --network ic id dbank_frontend    # dbank_assets in the video's older template</pre>
<p>Open <code>https://&lt;canister-id&gt;.icp0.io</code>. The video uses the older <code>ic0.app</code> domain, which still works. Try a top-up: it behaves as it did locally, with real network delays on the update calls.</p>
<h3>3. Creating vs upgrading</h3>
<pre data-lang="sh">dfx wallet --network ic balance    # noticeably lower after the first deploy
# change some code, then deploy again:
dfx deploy --network ic            # the canisters exist already, so only their code is upgraded</pre>
<p>Creating canisters is what uses up cycles; upgrading existing ones costs little. Deploy to the network once, and keep experimenting on the local replica.</p>`,
  quiz:[
    { q:'What does <code>--network ic</code> change?', options:['It deploys to the local replica','It targets the live Internet Computer instead of the local replica','It signs you in with Internet Identity','It skips the front end'], answer:1, why:'ic is the name dfx uses for the main network; the default is local.' },
    { q:'Why is the second <code>dfx deploy --network ic</code> much cheaper than the first?', options:['It runs locally','The canisters already exist, so only their code is upgraded','It uses query calls','The faucet pays for it'], answer:1, why:'Creating a canister is the costly operation; upgrading one is not.' },
  ],
});

PG.add({
  id:'l342', index:342, udemyId:31673484, minutes:6, section:'s39', slug:'convert-icp-to-cycles', kind:'read',
  title:'How to Convert ICP into Cycles?',
  blurb:'When the free cycles are gone, you top up by converting ICP: get some ICP (for example on an exchange), send it to your account in the NNS app, attach your cycles wallet canister there by its id (<code>dfx identity --network ic get-wallet</code>), and add cycles to it. Recent dfx can also convert from the terminal with <code>dfx cycles convert --amount &lt;ICP&gt; --network ic</code>. None of this is needed for the course, which runs fully on the local replica.',
  links:[
    { title:'NNS app', url:'https://nns.ic0.app/', note:'accounts, canisters and the ICP-to-cycles conversion' },
  ],
  quiz:[
    { q:'Which command prints the wallet canister id you attach in the NNS app?', options:['dfx canister id dbank_backend','dfx identity --network ic get-wallet','dfx wallet create','dfx start'], answer:1, why:'get-wallet shows the cycles wallet linked to your identity on the ic network.' },
    { q:'What happens to the ICP you convert?', options:['It is lent to the canister and returned later','It is burned, and the canister is credited with cycles','It is stored inside the canister','It comes back after a month'], answer:1, why:'Conversion is one-way: ICP becomes cycles, and cycles are spent as the canister runs.' },
  ],
});

/* ---- 343: a small stand-in site with the same structure as the lecture's ---- */
const SITE_DFX = `{
  "canisters": {
    "website": {
      "type": "assets",
      "source": ["assets"]
    }
  }
}
`;

const SITE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>
  <link rel="icon" href="favicon.ico">
  <!-- was css/styles.css before the files were flattened -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <!-- was images/portrait.png -->
    <img class="portrait" src="portrait.png" alt="Portrait of the site's owner">
    <h1>Hi, I'm Sam.</h1>
    <p>I build websites, and now I host them on a blockchain.</p>
  </header>

  <section class="skills">
    <h2>What I work with</h2>
    <img src="html.png" alt="HTML">
    <img src="css.png" alt="CSS">
    <img src="javascript.png" alt="JavaScript">
    <img src="motoko.png" alt="Motoko">
  </section>

  <footer>Served from an Internet Computer canister</footer>
</body>
</html>
`;

const SITE_CSS = `body {
  margin: 0;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #2b2d42;
  text-align: center;
}

header {
  background: #edf2f4;
  padding: 60px 20px;
}

.portrait {
  width: 120px;
  border-radius: 50%;
}

.skills img {
  width: 64px;
  margin: 10px;
}

footer {
  padding: 20px;
  font-size: 0.8rem;
  color: #8d99ae;
}
`;

const SITE_SH = `# My Site/
#   dfx.json
#   assets/
#     index.html  styles.css  favicon.ico  portrait.png  html.png  ...

# 1. Try it locally first: free
dfx start --background
dfx deploy                                # prints a local URL for the website canister

# 2. Deploy to the live network: creates the canister and spends cycles
dfx deploy --network ic
dfx canister --network ic id website      # the canister id
# open https://<canister-id>.icp0.io  (the video uses the older .ic0.app domain)
`;

PG.add({
  id:'l343', index:343, udemyId:31673536, minutes:8, section:'s39', slug:'host-a-static-website', kind:'walkthrough',
  title:'[Optional] How to Deploy a Static Website onto the ICP Blockchain for Hosting',
  blurb:'A plain HTML/CSS site can live on the Internet Computer too. Put every file in an <code>assets</code> folder, describe one canister of type <code>"assets"</code> in <code>dfx.json</code>, deploy with <code>dfx deploy --network ic</code>, and the site is public at <code>&lt;canister-id&gt;.icp0.io</code>, for as long as the canister has cycles.',
  intro:`<p>The lecture hosts the demo website from the CSS section; this walkthrough uses a tiny stand-in site with the same structure (images are only referenced, not included). To do it for real, recreate this layout with your own site files and run the commands in <code>terminal.sh</code>.</p>`,
  files:{
    'dfx.json': SITE_DFX,
    'assets/index.html': SITE_HTML,
    'assets/styles.css': SITE_CSS,
    'terminal.sh': SITE_SH,
  },
  steps:[
    { title:'One folder of files', text:'Everything the site needs (HTML, CSS, images, favicon) goes into a folder called <code>assets</code> inside the project folder, the same idea as the assets canister in the DBank project.', file:'terminal.sh', lines:[1,4] },
    { title:'dfx.json describes the canister', text:'Next to the assets folder, <code>dfx.json</code> lists the canisters. There is only one here, of type <code>"assets"</code>: a canister that stores files and serves them over HTTPS. <code>source</code> is an array, so it could list several folders.', file:'dfx.json', lines:[1,8] },
    { title:'The name matters', text:'<code>website</code> is the name you give dfx commands, as in <code>dfx canister --network ic id website</code>.', file:'dfx.json', lines:[3,3] },
    { title:'Flat links', text:'In the lecture every file ended up at the top level, so the <code>css/</code> and <code>images/</code> prefixes had to come off the links. Current dfx keeps subfolders (a Vite build uploads its <code>dist/assets</code> folder without trouble), so this step is optional now, but flat links work either way.', file:'assets/index.html', lines:[8,14] },
    { title:'Try it locally', text:'A local deploy costs nothing and catches broken links before you spend cycles.', file:'terminal.sh', lines:[6,8] },
    { title:'Go live', text:'Deploy to the network, look up the canister id and open the address. Anyone with the link can now see the site.', file:'terminal.sh', lines:[10,13] },
    { title:'Keep it funded', text:'Storing the files and serving visitors uses the canister\'s cycles. When they run out the site stops responding, so top it up from your wallet or the NNS app.' },
  ],
  quiz:[
    { q:'What does <code>"type": "assets"</code> tell dfx?', options:['The canister is written in Motoko','The canister just stores and serves the files from its source folder','It is a cycles wallet','It compiles React'], answer:1, why:'An assets canister is a small web server for static files; no Motoko code is involved.' },
    { q:'You deploy and the page loads without its styles. What is the likely cause in the lecture\'s setup?', options:['The canister ran out of cycles','The stylesheet link still says css/styles.css after the files were flattened','dfx.json is missing','Browsers block .icp0.io'], answer:1, why:'The link must point to where the file actually is in the deployed canister.' },
  ],
});

})();
