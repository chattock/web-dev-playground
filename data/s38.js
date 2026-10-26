/* ===== Section 38 — Build Your First DeFi DApp: DBANK ===== */
(function () {

/* ---------------------------------------------------------------------------
   The DBANK project as it stands at the end of each lecture (newer dfx names:
   dbank_backend / dbank_frontend; the video's older template says dbank and
   dbank_assets). Line numbers in the steps below refer to these strings.
   --------------------------------------------------------------------------- */
const MO_331 = `import Debug "mo:base/Debug";

actor DBank {

  var currentValue = 300;
  currentValue := 100;

  let id = 2347389;
  // Debug.print(debug_show(id));

  public func topUp(amount: Nat) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Nat) {
    currentValue -= amount;
    Debug.print(debug_show(currentValue));
  };

  // topUp();

}
`;

const SH_331 = `# Terminal 1: the local replica. Keep it running.
dfx start

# Terminal 2: inside the dbank folder, after every change to main.mo
dfx deploy

# Call public functions from the command line.
# Arguments are Candid values: brackets inside quotes.
dfx canister call dbank_backend topUp '(12)'
dfx canister call dbank_backend withdraw '(5)'

# Candid UI: look up its canister id and your own...
dfx canister id __Candid_UI
dfx canister id dbank_backend
# ...then open http://127.0.0.1:4943/?canisterId=<Candid UI id>
# and paste your canister id when the page asks for it.
# (The video's older dfx used port 8000. A recent dfx deploy
#  prints a ready-made Candid UI link for each canister.)
`;

const MO_332 = `import Debug "mo:base/Debug";

actor DBank {

  var currentValue = 300;
  currentValue := 100;

  let id = 2347389;

  public func topUp(amount: Nat) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Nat) {
    let tempValue: Int = currentValue - amount;
    if (tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Amount too large, currentValue less than zero.");
    };
  };

}
`;

const MO_333 = `import Debug "mo:base/Debug";

actor DBank {

  var currentValue = 300;
  currentValue := 100;

  let id = 2347389;

  public func topUp(amount: Nat) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Nat) {
    let tempValue: Int = currentValue - amount;
    if (tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Amount too large, currentValue less than zero.");
    };
  };

  public query func checkBalance(): async Nat {
    return currentValue;
  };

}
`;

const MO_334 = `import Debug "mo:base/Debug";

actor DBank {

  stable var currentValue: Nat = 300;
  // currentValue := 100;

  let id = 2347389;

  public func topUp(amount: Nat) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Nat) {
    let tempValue: Int = currentValue - amount;
    if (tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Amount too large, currentValue less than zero.");
    };
  };

  public query func checkBalance(): async Nat {
    return currentValue;
  };

}
`;

const SH_334 = `# Terminal 1
dfx start

# Terminal 2: the persistence experiment
dfx deploy
dfx canister call dbank_backend checkBalance     # (300 : nat)
dfx canister call dbank_backend topUp '(100)'
dfx canister call dbank_backend checkBalance     # (400 : nat)

# Now change a line of code in main.mo (a new Debug.print will do;
# a comment alone leaves the compiled canister the same), then upgrade:
dfx deploy
dfx canister call dbank_backend checkBalance     # 300 with a plain var, 400 with stable var
`;

/* the finished back end (lecture 335 onwards) */
const MO_FINAL = `import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBank {

  stable var currentValue: Float = 300;
  // currentValue := 300;        // uncomment for one deploy to reset the balance...

  stable var startTime = Time.now();
  // startTime := Time.now();    // ...and the clock
  Debug.print(debug_show(startTime));

  let id = 2347389;

  public func topUp(amount: Float) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  public func withdraw(amount: Float) {
    let tempValue: Float = currentValue - amount;
    if (tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("Amount too large, currentValue less than zero.");
    };
  };

  public query func checkBalance(): async Float {
    return currentValue;
  };

  public func compound() {
    let currentTime = Time.now();
    let timeElapsedNS = currentTime - startTime;
    let timeElapsedS = timeElapsedNS / 1000000000;
    currentValue := currentValue * (1.01 ** Float.fromInt(timeElapsedS));
    startTime := currentTime;
  };

}
`;

const SH_335 = `dfx deploy
dfx canister call dbank_backend checkBalance    # (300 : float64)
# wait about ten seconds, then:
dfx canister call dbank_backend compound
dfx canister call dbank_backend checkBalance    # about 331.39, since 300 × 1.01^10 ≈ 331.39

# Changed a stable variable's type (Nat to Float) and the upgrade is refused?
# A reinstall wipes the canister's state and starts from the initial values:
dfx deploy dbank_backend --mode reinstall
`;

const DFX_JSON = `{
  "canisters": {
    "dbank_backend": {
      "main": "src/dbank_backend/main.mo",
      "type": "motoko"
    },
    "dbank_frontend": {
      "dependencies": [
        "dbank_backend"
      ],
      "source": [
        "src/dbank_frontend/dist"
      ],
      "type": "assets",
      "workspace": "dbank_frontend"
    }
  },
  "output_env_file": ".env",
  "version": 1
}
`;

const HTML = `<!DOCTYPE html>
<html lang="en">

<head>
  <title>DBank</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link type="text/css" rel="stylesheet" href="/main.css" />
</head>

<body>
  <main>
    <div class="container">
      <img src="dbank_logo.png" alt="DBank logo" width="100" />
      <h1>Current Balance: $<span id="value">234</span></h1>
      <div class="divider"></div>
      <form action="#">
        <h2>Amount to Top Up</h2>
        <input id="input-amount" type="number" step="0.01" min="0" name="topUp" value="" />
        <h2>Amount to Withdraw</h2>
        <input id="withdrawal-amount" type="number" name="withdraw" step="0.01" min="0" value="" />
        <input id="submit-btn" type="submit" value="Finalise Transaction" />
      </form>
    </div>
  </main>
  <script type="module" src="/src/main.js"></script>
</body>

</html>
`;

const CSS = `html,
body {
  margin: 0;
  min-height: 100%;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: radial-gradient(circle at 20% 0%, #1f3b4d 0%, #0e1a23 70%);
  color: #e8f1f5;
}

h1,
h2 {
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

h1 {
  font-size: 1.6rem;
  color: #7fe0c3;
}

h2 {
  font-size: 1.05rem;
  color: #a9c6d4;
}

.container {
  max-width: 420px;
  margin: 40px auto;
  padding: 28px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(127, 224, 195, 0.25);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.divider {
  height: 1px;
  margin: 18px 0;
  background: rgba(169, 198, 212, 0.25);
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font: inherit;
  color: #e8f1f5;
  background: #0b151c;
  border: 1px solid #2c4757;
  border-radius: 8px;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: #7fe0c3;
  box-shadow: 0 0 0 3px rgba(127, 224, 195, 0.18);
}

input[name="amount"] {
  font-size: 1.2rem;
  font-variant-numeric: tabular-nums;
}

/* hide the number input's arrows */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

textarea[name="address"] {
  min-height: 70px;
  resize: vertical;
}

#submit-btn {
  margin-top: 6px;
  padding: 11px 16px;
  font: inherit;
  font-weight: 600;
  color: #0e1a23;
  background: #7fe0c3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

#submit-btn:hover {
  background: #a5ecd7;
}

#submit-btn:disabled {
  color: #93a9b3;
  background: #3e5a66;
  cursor: not-allowed;
}
`;

const JS_336 = `// Empty for now: the next lecture connects this page to the dbank_backend canister.
`;

const SH_336 = `# inside the dbank folder
npm install          # the frontend's packages from package.json

# terminal 1
dfx start

# terminal 2
dfx deploy           # rebuilds both canisters, including the new frontend files
npm start            # dev server: open the localhost URL it prints
`;

const JS_FINAL = `import { dbank_backend } from "../../declarations/dbank_backend";

window.addEventListener("load", async function () {
  await update();
});

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const button = event.target.querySelector("#submit-btn");

  const inputAmount = parseFloat(document.getElementById("input-amount").value);
  const outputAmount = parseFloat(document.getElementById("withdrawal-amount").value);

  button.setAttribute("disabled", true);

  if (document.getElementById("input-amount").value.length != 0) {
    await dbank_backend.topUp(inputAmount);
  }

  if (document.getElementById("withdrawal-amount").value.length != 0) {
    await dbank_backend.withdraw(outputAmount);
  }

  await dbank_backend.compound();

  await update();

  document.getElementById("input-amount").value = "";
  document.getElementById("withdrawal-amount").value = "";

  button.removeAttribute("disabled");
});

async function update() {
  const currentAmount = await dbank_backend.checkBalance();
  document.getElementById("value").innerText = Math.round(currentAmount * 100) / 100;
}
`;

const MO = 'src/dbank_backend/main.mo';
const SH = 'terminal.sh';

/* ---------------------------------------------------------------------------
   Explore-demo building blocks: the DBank page (CSS scoped to .dbank so the
   demo controls keep their own look), an original logo, and a JavaScript
   stand-in for the dbank_backend canister.
   --------------------------------------------------------------------------- */
const DBANK_DEMO_CSS = `
.dbank{background:#211F2B;border-radius:12px;padding:16px 12px 8px;text-align:center;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.dbank h1,.dbank h2{margin:0}
.dbank h1{color:white;font-size:16px;font-weight:500;margin-top:10px}
.dbank h2{color:rgba(255,255,255,0.5);font-size:14px;font-weight:500;margin-bottom:10px}
.dbank form{margin:0;padding:0;width:100%}
.dbank .divider{width:100px;height:3px;margin:20px auto;background-color:#617BFF}
.dbank input{position:relative;text-align:center;display:block;margin:0 0 20px;border-radius:7px;border:2px white solid;
  background-color:white;padding:10px 20px;width:100%;color:#1E1C29;box-sizing:border-box;transition:all 0.2s}
.dbank input:focus{outline:none;border:2px #617BFF solid}
.dbank .container{background-color:rgba(255,255,255,0.1);width:300px;max-width:100%;margin:0 auto;border-radius:14px;padding:30px 30px 20px 30px}
.dbank input[type=number]::-webkit-inner-spin-button,.dbank input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.dbank #submit-btn{display:block;border-radius:7px;margin-bottom:10px;cursor:pointer;font-size:20px;font-weight:600;
  border:2px #617BFF solid;color:white;background-color:#617BFF;padding:15px;transition:all 0.2s}
.dbank #submit-btn:hover{border:2px #8095FF solid;background-color:#8095FF}
.dbank #submit-btn:disabled{border:2px rgba(255,255,255,0.1) solid;background-color:rgba(255,255,255,0.1)}
`;

const DBANK_PAGE = `
<main>
  <div class="container">
    <svg width="120" height="36" viewBox="0 0 120 36" role="img" aria-label="DBank logo">
      <rect x="4" y="4" width="28" height="28" rx="7" fill="#617BFF"/>
      <path d="M10 12.5h16M10 25.5h16M12.5 15v8M18 15v8M23.5 15v8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
      <text x="40" y="25" fill="#fff" font-size="17" font-weight="700" letter-spacing="1" font-family="-apple-system,Segoe UI,Helvetica,sans-serif">DBANK</text>
    </svg>
    <h1>Current Balance: $<span id="value">234</span></h1>
    <div class="divider"></div>
    <form action="#">
      <h2>Amount to Top Up</h2>
      <input id="input-amount" type="number" step="0.01" min="0" name="topUp" value="" />
      <h2>Amount to Withdraw</h2>
      <input id="withdrawal-amount" type="number" name="withdraw" step="0.01" min="0" value="" />
      <input id="submit-btn" type="submit" value="Finalise Transaction" />
    </form>
  </div>
</main>`;

const DBANK_LOG = `
var logEl = document.getElementById('log'), logStarted = false;
function log(line) {
  if (!logStarted) { logEl.textContent = ''; logStarted = true; }
  logEl.textContent += line + '\\n';
  logEl.scrollTop = logEl.scrollHeight;
}`;

const DBANK_MOCK = `
/* A stand-in for the dbank_backend canister: the same four methods,
   answering after a delay like a real query (fast) or update call (slow). */
var bank = { currentValue: 300, startTime: Date.now() };
function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
function fmt(v) { return typeof v === 'string' ? JSON.stringify(v) : String(v); }
function canisterCall(name, args, kind, body) {
  var t0 = performance.now();
  log('→ ' + name + '(' + args.map(fmt).join(', ') + ')   ' + kind + ' call');
  return wait(kind === 'query' ? 40 : 1100).then(function () {
    var result = body();
    log('← ' + name + ': ' + (result === undefined ? '()' : fmt(Math.round(result * 10000) / 10000)) +
        '   ' + ((performance.now() - t0) / 1000).toFixed(2) + ' s');
    return result;
  });
}
function checkFloat(name, value) {
  if (typeof value === 'number') return null;
  var error = new Error('Invalid float64 argument: ' + JSON.stringify(value));
  log('✗ ' + name + ' rejected: ' + error.message);
  return Promise.reject(error);
}
var dbank_backend = {
  topUp: function (amount) {
    return checkFloat('topUp', amount) || canisterCall('topUp', [amount], 'update', function () {
      bank.currentValue += amount;
    });
  },
  withdraw: function (amount) {
    return checkFloat('withdraw', amount) || canisterCall('withdraw', [amount], 'update', function () {
      var tempValue = bank.currentValue - amount;
      if (tempValue >= 0) bank.currentValue -= amount;
      else log('   Debug.print: Amount too large, currentValue less than zero.');
    });
  },
  compound: function () {
    return canisterCall('compound', [], 'update', function () {
      var now = Date.now(), seconds = Math.floor((now - bank.startTime) / 1000);
      bank.currentValue = bank.currentValue * Math.pow(1.01, seconds);
      bank.startTime = now;
      log('   ' + seconds + ' s since the last compound, so × 1.01^' + seconds + ' = ' + Math.pow(1.01, seconds).toFixed(4));
    });
  },
  checkBalance: function () {
    return canisterCall('checkBalance', [], 'query', function () { return bank.currentValue; });
  }
};`;

const SPLIT_CSS = `
.wrap{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
.wrap .dbank{flex:0 0 350px}
.wrap .readout{flex:1;min-width:250px;height:470px;overflow:auto;white-space:pre-wrap;margin:0}`;

PG.add({
  id:'l329', index:329, udemyId:31673294, minutes:2, section:'s38', slug:'what-youll-build-dbank', kind:'walkthrough',
  title:'What You\'ll Build - DBANK (Inspired by Compound)',
  blurb:'DBANK is a cut-down version of the Compound money market: one balance, held by a Motoko canister, that you can top up and withdraw from and that earns interest every second. This page tours the finished project; lectures 330–337 build it piece by piece.',
  intro:`<p>The finished DBANK project, file by file. Motoko cannot run in the browser, so the <b>Explore</b> tab runs the finished page against a small JavaScript stand-in for the canister: try a top-up and watch the calls it makes.</p>
<p>To build it for real, follow lectures 330–337 in a project made with <code>dfx new dbank</code>; each lesson lists the commands. In the video's older dfx the two canisters are called <code>dbank</code> and <code>dbank_assets</code>.</p>`,
  files:{
    'src/dbank_backend/main.mo': MO_FINAL,
    'src/dbank_frontend/src/main.js': JS_FINAL,
    'src/dbank_frontend/index.html': HTML,
    'dfx.json': DFX_JSON,
  },
  steps:[
    { title:'The idea: Compound, simplified', text:'In a money market like Compound, lenders deposit tokens and earn interest that borrowers pay. DBANK keeps only the saver\'s side: a balance that grows over time.' },
    { title:'The balance lives in a canister', text:'The back end is one Motoko <code>actor</code>. The balance and the time interest was last added are <code>stable</code> variables, so they survive code upgrades (lecture 334).', file:MO, lines:[5,12] },
    { title:'Changing the balance', text:'<code>topUp</code> and <code>withdraw</code> change state, so each one is an update call that the network has to agree on (lectures 331 and 332).', file:MO, lines:[16,29] },
    { title:'Reading the balance', text:'<code>checkBalance</code> is a <code>query</code>: it only reads, so it answers almost at once (lecture 333).', file:MO, lines:[31,33] },
    { title:'Earning interest', text:'<code>compound</code> multiplies the balance by 1.01 for every second since it last ran: 1% a second, absurdly high so you can watch it grow (lecture 335).', file:MO, lines:[35,41] },
    { title:'The page', text:'A plain HTML form: the balance, a top-up field, a withdrawal field and one button (lecture 336).', file:'src/dbank_frontend/index.html', lines:[12,25] },
    { title:'The glue', text:'<code>main.js</code> imports the canister and calls its functions when the page loads and when the form is submitted (lecture 337).', file:'src/dbank_frontend/src/main.js', lines:[1,33] },
    { title:'Two canisters', text:'<code>dfx.json</code> declares both: the Motoko back end, and an assets canister that serves the built front end.', file:'dfx.json', lines:[2,17] },
  ],
  explore:[{
    title:'The finished DBank, with a stand-in canister', height:540,
    note:'The page and its JavaScript are the finished project; the canister is simulated in JavaScript with the same four functions and realistic delays. Top up 10, wait a few seconds, then top up again: <code>compound()</code> adds 1% for every second in between.',
    html:`
<style>${DBANK_DEMO_CSS}${SPLIT_CSS}</style>
<div class="wrap">
  <div class="dbank">${DBANK_PAGE}</div>
  <pre class="readout" id="log">Calls to the canister appear here.</pre>
</div>
<script>
${DBANK_LOG}
${DBANK_MOCK}
async function update() {
  var currentAmount = await dbank_backend.checkBalance();
  document.getElementById('value').innerText = Math.round(currentAmount * 100) / 100;
}
window.addEventListener('load', function () { update(); });
document.querySelector('.dbank form').addEventListener('submit', async function (event) {
  event.preventDefault();
  var button = event.target.querySelector('#submit-btn');
  var inputField = document.getElementById('input-amount'), outputField = document.getElementById('withdrawal-amount');
  button.setAttribute('disabled', true);
  if (inputField.value.length != 0) await dbank_backend.topUp(parseFloat(inputField.value));
  if (outputField.value.length != 0) await dbank_backend.withdraw(parseFloat(outputField.value));
  await dbank_backend.compound();
  await update();
  inputField.value = '';
  outputField.value = '';
  button.removeAttribute('disabled');
});
<\/script>`,
  }],
  quiz:[
    { q:'Which part of a money market like Compound does DBANK keep?', options:['Borrowing against collateral','A balance that earns interest over time','Governance tokens and voting','Price feeds from other chains'], answer:1, why:'DBANK drops the borrowing side and keeps one saver\'s balance that grows with interest.' },
    { q:'Where does the DBANK balance live?', options:['In the browser\'s localStorage','In a stable variable inside the dbank_backend canister','In a separate database server','In the HTML span on the page'], answer:1, why:'The canister holds it; the page only asks for it with checkBalance and displays the answer.' },
  ],
});

PG.add({
  id:'l330', index:330, udemyId:31673308, minutes:13, section:'s38', slug:'intro-to-motoko', kind:'walkthrough',
  title:'Introduction to the Motoko Language',
  blurb:'Motoko is the language for canisters on the Internet Computer. A canister is an <code>actor</code>; inside it you declare state with <code>var</code> (mutable, reassigned with <code>:=</code>) and <code>let</code> (immutable), and print with <code>Debug.print</code> from the base library.',
  intro:`<p>There is no Motoko compiler in the browser, so this lecture is a guided read of the code. Click a step to highlight the lines it talks about. To run it for real: <code>dfx new dbank</code>, replace <code>src/dbank_backend/main.mo</code> with this file, then <code>dfx start --background</code> and <code>dfx deploy</code>.</p>`,
  files:{
'src/dbank_backend/main.mo':`import Debug "mo:base/Debug";

actor DBank {

  var currentValue = 300;
  currentValue := 100;

  let id = 2347389;

  Debug.print(debug_show(currentValue));
  Debug.print(debug_show(id));

}
`,
'dfx.json':`{
  "canisters": {
    "dbank_backend": {
      "main": "src/dbank_backend/main.mo",
      "type": "motoko"
    }
  },
  "version": 1
}
`},
  steps:[
    { title:'Create the project', text:'<code>dfx new dbank</code> scaffolds a project. The backend code lives in <code>src/dbank_backend/main.mo</code>; <code>dfx.json</code> tells dfx which canisters exist and where their code is.', file:'dfx.json', lines:[1,8] },
    { title:'An actor is a canister', text:'Everything a canister does sits inside <code>actor DBank { ... }</code>. Actor and type names use UpperCamelCase; variables use lowerCamelCase. Every statement ends with a semicolon.', file:'src/dbank_backend/main.mo', lines:[3,3] },
    { title:'Mutable state with var', text:'<code>var currentValue = 300;</code> declares a variable that can change. Reassignment uses <code>:=</code> — a single <code>=</code> is only for the first declaration.', file:'src/dbank_backend/main.mo', lines:[5,6] },
    { title:'Constants with let', text:'<code>let id = 2347389;</code> can never be reassigned. Trying <code>id := 1</code> is a compile error.', file:'src/dbank_backend/main.mo', lines:[8,8] },
    { title:'Printing for debugging', text:'<code>Debug.print</code> only accepts Text, so numbers go through <code>debug_show(...)</code> first. The output appears in the terminal where <code>dfx start</code> is running, not in the browser.', file:'src/dbank_backend/main.mo', lines:[1,1] },
    { title:'The challenge', text:'Print the constant too: <code>Debug.print(debug_show(id));</code>. Deploy again with <code>dfx deploy</code> and look for the two values in the dfx terminal.', file:'src/dbank_backend/main.mo', lines:[10,11] },
  ],
  quiz:[
    { q:'Which operator reassigns a <code>var</code> in Motoko?', options:['=','==',':=','=>'], answer:2, why:'= is used once, at declaration. Reassignment is :=.' },
    { q:'What is <code>mo:base/Debug</code>?', options:['A npm package','A module from the Motoko base library','A canister','A dfx command'], answer:1, why:'The mo: prefix imports from the Motoko base library shipped with dfx.' },
    { q:'Why does <code>Debug.print(currentValue)</code> fail?', options:['currentValue is private','Debug.print only takes Text, so numbers need debug_show','Printing is not allowed in actors','The value is too big'], answer:1, why:'debug_show converts any value into its text representation.' },
  ],
});


PG.add({
  id:'l331', index:331, udemyId:31673312, minutes:16, section:'s38', slug:'motoko-functions-and-candid', kind:'walkthrough',
  title:'Motoko Functions and the Candid User Interface',
  blurb:'Functions in Motoko start with <code>func</code>; they are private to the actor until you add <code>public</code>. Parameters carry types (<code>amount: Nat</code>). Public functions can be called from the terminal with <code>dfx canister call</code>, or from the <b>Candid UI</b>, a test page dfx generates from the canister\'s interface.',
  intro:`<p>Motoko cannot run in the browser, so this is a guided read: click a step to highlight the lines it describes. To try it for real, put this <code>main.mo</code> in <code>src/dbank_backend/</code>, keep <code>dfx start</code> running in one terminal and run the commands in <code>terminal.sh</code> from another.</p>`,
  files:{ 'src/dbank_backend/main.mo': MO_331, 'terminal.sh': SH_331 },
  steps:[
    { title:'A function with func', text:'<code>func</code>, a name, a parameter list and a body in braces. The first version took no input and added 1 to the balance. The semicolon after the closing brace is required, as after every declaration inside an actor.', file:MO, lines:[11,14] },
    { title:'Calling it inside the actor', text:'A call written in the actor body, such as <code>topUp();</code>, runs once when the canister is installed, so the first deploy printed 101. It is commented out now because topUp needs an argument.', file:MO, lines:[21,21] },
    { title:'Private unless public', text:'Without <code>public</code>, only code inside the actor can call the function, and <code>dfx canister call</code> replies that the canister has no update method by that name. <code>public</code> opens it to the terminal, the Candid UI, other canisters and front ends. Run <code>dfx deploy</code> after every edit.', file:MO, lines:[11,11] },
    { title:'Calling it from the terminal', text:'<code>dfx canister call</code> takes the canister name from dfx.json, the function name and the arguments in Candid syntax. What <code>Debug.print</code> prints appears in terminal 1, where the replica runs. The video\'s canister is just <code>dbank</code>.', file:SH, lines:[7,10] },
    { title:'The Candid UI', text:'Candid describes a canister\'s public functions independently of the language they were written in. The Candid UI reads that description and builds a test page with a field and a button for each function, which is handy before a front end exists. Refresh it after each deploy to see changes.', file:SH, lines:[12,18] },
    { title:'A typed parameter', text:'<code>amount: Nat</code> gives the parameter a type. Nat means natural number: 0, 1, 2 and so on, with no negatives or decimals, and the Candid UI offers a number field for it. <code>+=</code> works as in JavaScript.', file:MO, lines:[11,12] },
    { title:'Challenge: withdraw', text:'<code>withdraw</code> mirrors topUp with <code>-=</code>. Ask for more than the balance and the call fails with a "natural subtraction underflow" error, because a Nat cannot go below zero. The next lecture adds a check.', file:MO, lines:[16,19] },
    { title:'The balance resets on each deploy', text:'Every deploy runs the actor body again: currentValue starts at 300 and line 6 sets it to 100, so earlier top-ups are lost. Lecture 334 shows how to keep them.', file:MO, lines:[5,6] },
  ],
  quiz:[
    { q:'<code>dfx canister call dbank_backend topUp</code> fails when topUp is written <code>func topUp() {...}</code>. Why?', options:['A semicolon is missing','Functions are private unless marked public','topUp needs to return async','The Candid UI is not running'], answer:1, why:'A plain func can only be used inside the actor; public exposes it to callers outside.' },
    { q:'What is the Candid UI?', options:['A Motoko compiler','A web page built from the canister\'s public interface, with a button for each function','The dfx installer','A crypto wallet'], answer:1, why:'It reads the Candid description of your canister and lets you call each public function by hand.' },
    { q:'Which values can a parameter of type <code>Nat</code> take?', options:['Any number','Whole numbers from 0 upwards','Text','Negative whole numbers only'], answer:1, why:'Nat is a natural number. Decimals and negatives are rejected.' },
  ],
});

PG.add({
  id:'l332', index:332, udemyId:31673318, minutes:6, section:'s38', slug:'motoko-conditionals-and-types', kind:'walkthrough',
  title:'Motoko Conditionals and Type Annotations',
  blurb:'Withdrawing more than the balance made the Nat subtraction trap. The fix is an <code>if / else</code> written just as in JavaScript, plus a type annotation: storing the difference in <code>tempValue: Int</code> lets it go negative, so the <code>&gt;= 0</code> check means something.',
  intro:`<p>A guided read of <code>withdraw</code> with its new guard. To try it, deploy this file and call <code>withdraw</code> from the Candid UI with 999, then with 10. The <b>Explore</b> tab simulates both versions of the subtraction.</p>`,
  files:{ 'src/dbank_backend/main.mo': MO_332 },
  steps:[
    { title:'The bug', text:'currentValue and amount are both Nat. Withdrawing 999 from 100 asks for a Nat below zero, so the call traps with "Natural subtraction underflow" and nothing after it runs.', file:MO, lines:[15,23] },
    { title:'if / else, as in JavaScript', text:'The condition goes in brackets and each branch in braces. The balance only changes when the result stays at zero or above. The whole if/else ends with a semicolon.', file:MO, lines:[17,22] },
    { title:'Why tempValue is an Int', text:'Left untyped, <code>currentValue - amount</code> is a Nat subtraction: it either traps or gives a number of at least 0, so comparing it with 0 tells you nothing, and the compiler warns. Declaring the result as <code>Int</code> (any whole number, negatives too) makes Motoko subtract as Ints.', file:MO, lines:[16,16] },
    { title:'Annotation syntax', text:'<code>name: Type</code>, the same as for parameters. currentValue is a Nat because 300 is a positive whole number; written out it would be <code>var currentValue: Nat = 300;</code>. You can also annotate inside the condition: <code>if (((currentValue - amount) : Int) &gt;= 0)</code>.', file:MO, lines:[5,5] },
    { title:'Text needs no debug_show', text:'The message is already Text, so it goes straight into <code>Debug.print</code>. Only numbers and other values need <code>debug_show</code>.', file:MO, lines:[21,21] },
    { title:'Test both paths', text:'Deploy, then in the Candid UI withdraw 999: the message is printed and the balance stays the same. Withdraw 10 and it drops to 90.' },
  ],
  explore:[{
    title:'Nat or Int?', height:300,
    note:'Change the numbers and the checkbox. With the annotation the subtraction may go negative and the if decides; without it, any withdrawal larger than the balance traps before the if is reached.',
    html:`
<div class="knobs">
  <label>currentValue <input id="bal" type="number" min="0" value="100" style="width:90px"></label>
  <label>withdraw( <input id="amt" type="number" min="0" value="999" style="width:90px"> )</label>
  <label><input id="ann" type="checkbox" checked> annotate <code>tempValue: Int</code></label>
</div>
<pre class="readout" id="code"></pre>
<pre class="readout" id="res"></pre>
<script>
var bal = document.getElementById('bal'), amt = document.getElementById('amt'), ann = document.getElementById('ann');
function show() {
  var b = Math.max(0, Math.floor(Number(bal.value) || 0)), a = Math.max(0, Math.floor(Number(amt.value) || 0));
  document.getElementById('code').textContent =
    (ann.checked ? 'let tempValue: Int = currentValue - amount;' : 'let tempValue = currentValue - amount;   // no annotation: a Nat') + '\\n' +
    'if (tempValue >= 0) { currentValue -= amount; } else { Debug.print("Amount too large..."); };';
  var out;
  if (ann.checked) {
    var t = b - a;
    out = 'tempValue = ' + b + ' - ' + a + ' = ' + t + '   (an Int, so it may be negative)\\n' +
      (t >= 0 ? 'tempValue >= 0 is true: currentValue becomes ' + t
              : 'tempValue >= 0 is false: Debug.print runs and currentValue stays ' + b);
  } else if (a > b) {
    out = b + ' - ' + a + ' has no Nat answer.\\n' +
      'TRAP: Natural subtraction underflow. The call fails and nothing after this line runs.';
  } else {
    out = 'tempValue = ' + (b - a) + '   (a Nat is never negative, so the check is always true)\\n' +
      'currentValue becomes ' + (b - a);
  }
  document.getElementById('res').textContent = out;
}
[bal, amt, ann].forEach(function (el) { el.addEventListener('input', show); el.addEventListener('change', show); });
show();
<\/script>`,
  }],
  quiz:[
    { q:'What happens when a Nat subtraction would drop below zero?', options:['It returns 0','It wraps round to a huge number','The call traps with an underflow error','It turns into an Int by itself'], answer:2, why:'A Nat cannot hold a negative number, so Motoko stops the call instead.' },
    { q:'Why is tempValue declared as an Int?', options:['Int arithmetic is faster','So the subtraction is done with integers that can be negative, which makes the >= 0 check meaningful','Debug.print needs an Int','A let cannot hold a Nat'], answer:1, why:'With the Int annotation, 100 - 999 is simply -899, and the if can reject it.' },
  ],
});

PG.add({
  id:'l333', index:333, udemyId:31673322, minutes:8, section:'s38', slug:'query-vs-update', kind:'walkthrough',
  title:'Query vs. Update Methods',
  blurb:'Calls that change a canister\'s state are <b>update</b> calls: the network has to agree on them, which takes a couple of seconds. A function that only reads can be marked <code>query</code> and answers in milliseconds. <code>checkBalance</code> is the first query, with an <code>async Nat</code> return type.',
  intro:`<p>A guided read of the new <code>checkBalance</code>. To try it, deploy, refresh the Candid UI and compare the times it shows under a QUERY and a CALL. The <b>Explore</b> tab imitates that page.</p>`,
  files:{ 'src/dbank_backend/main.mo': MO_333 },
  steps:[
    { title:'Update calls take time', text:'topUp and withdraw change currentValue. A change of state goes through consensus: the replicas in the subnet must agree before it is stored. In the lecture that took about 2 seconds.', file:MO, lines:[10,23] },
    { title:'A query only reads', text:'<code>query</code> goes between <code>public</code> and <code>func</code>. A query cannot change anything, so a single replica answers it straight away: about 0.014 seconds in the lecture.', file:MO, lines:[25,25] },
    { title:'async return types', text:'The return type follows a colon. Public functions answer asynchronously, so the value is wrapped: <code>async Nat</code>, not <code>Nat</code>. Without async the compiler rejects a public function that returns a value.', file:MO, lines:[25,25] },
    { title:'return and semicolons', text:'<code>return currentValue;</code> works as in JavaScript. Declarations in an actor are separated by semicolons, so a missing one after the previous function breaks the build.', file:MO, lines:[26,27] },
    { title:'Which one to use', text:'If a function does not change state, make it a query. Save update calls for real writes; fast reads matter a lot for responsive apps and games.' },
  ],
  explore:[{
    title:'CALL vs QUERY', height:370,
    note:'A small copy of the Candid UI. Press CALL and QUERY and compare the times. Then tick the box to see what happens when a function that changes state is wrongly marked as a query.',
    html:`
<style>
  .fn{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff;border:1px solid #dfe3ee;border-radius:10px;padding:10px 14px;margin-bottom:10px;font:13px ui-monospace,Menlo,monospace}
  .fn .name{font-weight:700;min-width:140px}
  .fn input{width:70px;font:inherit;padding:3px 6px;border:1px solid #cfd5e6;border-radius:6px}
  .fn button{font:700 12px -apple-system,BlinkMacSystemFont,sans-serif;padding:6px 14px;border-radius:6px;border:0;color:#fff;cursor:pointer;letter-spacing:.5px}
  .fn button:disabled{opacity:.55;cursor:default}
  .fn .call{background:#7b61ff}
  .fn .query{background:#1fa774}
  .fn .out{color:#3c435c}
</style>
<div class="fn"><span class="name">topUp(amount)</span><input id="amt" type="number" min="0" value="10"><button id="topUp" class="call">CALL</button><span class="out" id="o1"></span></div>
<div class="fn"><span class="name">checkBalance()</span><button id="check" class="query">QUERY</button><span class="out" id="o2"></span></div>
<div class="knobs"><label><input type="checkbox" id="asQuery"> declare topUp as <code>public query func</code> (a mistake)</label></div>
<pre class="readout" id="log" style="height:120px;overflow:auto;white-space:pre-wrap"></pre>
<script>
var balance = 100, logEl = document.getElementById('log');
var topBtn = document.getElementById('topUp'), asQuery = document.getElementById('asQuery');
function log(t) { logEl.textContent += t + '\\n'; logEl.scrollTop = logEl.scrollHeight; }
function secs(ms) { return (ms / 1000).toFixed(3) + ' s'; }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
asQuery.addEventListener('change', function () {
  topBtn.textContent = asQuery.checked ? 'QUERY' : 'CALL';
  topBtn.className = asQuery.checked ? 'query' : 'call';
});
topBtn.addEventListener('click', async function () {
  var amount = Math.max(0, Math.floor(Number(document.getElementById('amt').value) || 0));
  var t0 = performance.now(), out = document.getElementById('o1');
  topBtn.disabled = true;
  if (asQuery.checked) {
    await wait(8 + Math.random() * 15);
    out.textContent = '()  ' + secs(performance.now() - t0);
    log('query topUp(' + amount + '): answered by one replica, and its change to currentValue was thrown away. Balance still ' + balance + '.');
  } else {
    out.textContent = 'waiting for the replicas to agree…';
    await wait(1800 + Math.random() * 800);
    balance += amount;
    out.textContent = '()  ' + secs(performance.now() - t0);
    log('update topUp(' + amount + '): agreed by the subnet and stored. Balance ' + balance + '.');
  }
  topBtn.disabled = false;
});
document.getElementById('check').addEventListener('click', async function () {
  var t0 = performance.now();
  await wait(8 + Math.random() * 15);
  document.getElementById('o2').textContent = '(' + balance + ' : nat)  ' + secs(performance.now() - t0);
  log('query checkBalance(): ' + balance);
});
log('The balance starts at 100. Press CALL, then QUERY, and compare the times.');
<\/script>`,
  }],
  quiz:[
    { q:'Why does a query answer much faster than an update call?', options:['It is written in a faster language','It only reads state, so it skips consensus between replicas','The browser caches it','It runs on your own laptop'], answer:1, why:'Nothing changes, so there is nothing for the replicas to agree on.' },
    { q:'Why is the return type written <code>async Nat</code>?', options:['async turns it into a query','Public functions answer asynchronously, so their result is wrapped in async','Nat values always need async','It is optional decoration'], answer:1, why:'The caller gets the answer later, like a Promise in JavaScript.' },
    { q:'Which DBank function should be a query?', options:['topUp','withdraw','checkBalance','compound'], answer:2, why:'Only checkBalance leaves the state as it is.' },
  ],
});


PG.add({
  id:'l334', index:334, udemyId:31673324, minutes:8, section:'s38', slug:'orthogonal-persistence', kind:'walkthrough',
  title:'Orthogonal Persistance',
  blurb:'A canister can keep its variables when its code is upgraded, without any database code: that is <b>orthogonal persistence</b>. Mark a variable <code>stable var</code> and its value survives every deploy; a plain <code>var</code> is set up from scratch each time. The <code>:=</code> line has to go, or it overwrites the saved value on every deploy.',
  intro:`<p>A guided read of the persistence change. To see it for real, run the experiment in <code>terminal.sh</code> twice, once with a plain <code>var</code> and once with <code>stable var</code>. The <b>Explore</b> tab simulates deploys so you can try every combination quickly.</p>`,
  files:{ 'src/dbank_backend/main.mo': MO_334, 'terminal.sh': SH_334 },
  steps:[
    { title:'Programs normally forget', text:'Restart an ordinary program and its variables start from their initial values again. Keeping data usually means writing code that saves it to a database and reads it back. A canister can keep its state itself.' },
    { title:'stable var', text:'<code>stable</code> marks a variable whose value survives upgrades, the deploys that replace the canister\'s code. A plain <code>var</code> is "flexible": it starts again from its initial value on every upgrade, as in other languages.', file:MO, lines:[5,5] },
    { title:'The initial value is used once', text:'<code>= 300</code> only applies when the canister is installed for the first time. Every later upgrade restores the stored value instead.', file:MO, lines:[5,5] },
    { title:'Comment out the reassignment', text:'Statements in the actor body run on every install and upgrade. Left in, <code>currentValue := 100;</code> would overwrite the restored value each time and hide what stable does.', file:MO, lines:[6,6] },
    { title:'The experiment', text:'Run these once without <code>stable</code> and once with it. dfx only upgrades when the compiled code has changed, so edit a real line of code before the second deploy.', file:SH, lines:[4,13] },
    { title:'Newer Motoko: persistent actor', text:'Current dfx templates write <code>persistent actor DBank</code>. There every variable is stable unless marked <code>transient</code>, and writing stable gives a "redundant stable" warning. The plain actor here shows what the keyword itself does.', file:MO, lines:[3,3] },
  ],
  explore:[{
    title:'Redeploy with and without stable', height:520,
    note:'Follow the lecture: top up, check, deploy, check. Then tick <code>stable</code>, deploy once so the new code is installed, top up and deploy again. Finally make the <code>:=</code> line active and deploy.',
    html:`
<div class="knobs">
  <b style="font-size:12.5px">Edit the code:</b>
  <label><input type="checkbox" id="stable"> <code>stable</code></label>
  <label><input type="checkbox" id="assign"> <code>currentValue := 100;</code> active</label>
</div>
<pre class="readout" id="code"></pre>
<div class="knobs">
  <button id="top">topUp(100)</button>
  <button id="chk">checkBalance()</button>
  <button id="up">change a line + dfx deploy</button>
  <button id="re">reinstall</button>
</div>
<pre class="readout" id="log" style="height:170px;overflow:auto;white-space:pre-wrap"></pre>
<script>
var edit = { stable: false, assign: false }, deployed = null, value = 0, logEl = document.getElementById('log');
var stableBox = document.getElementById('stable'), assignBox = document.getElementById('assign');
function log(t) { logEl.textContent += t + '\\n'; logEl.scrollTop = logEl.scrollHeight; }
function same() { return deployed && deployed.stable === edit.stable && deployed.assign === edit.assign; }
function drawCode() {
  document.getElementById('code').textContent =
    'actor DBank {\\n' +
    '  ' + (edit.stable ? 'stable var' : 'var') + ' currentValue: Nat = 300;\\n' +
    '  ' + (edit.assign ? '' : '// ') + 'currentValue := 100;\\n' +
    '  ...\\n}' + (same() ? '' : '\\n\\n// edited since the last deploy');
}
function install(kind) {
  value = 300;
  var how = kind + ': currentValue starts at 300';
  if (edit.assign) { value = 100; how += ', then := sets it to 100'; }
  deployed = { stable: edit.stable, assign: edit.assign };
  log(how + '.');
}
function upgrade() {
  var keep = deployed.stable && edit.stable, how;
  if (keep) how = 'upgrade: the stable value ' + value + ' is restored';
  else {
    value = 300;
    how = 'upgrade: ' + (deployed.stable || edit.stable ? 'stable was only just added or removed, so ' : 'a plain var, so ') +
      'currentValue starts again at 300';
  }
  if (edit.assign) { value = 100; how += ', then := overwrites it with 100'; }
  deployed = { stable: edit.stable, assign: edit.assign };
  log(how + '.');
}
stableBox.addEventListener('change', function () { edit.stable = stableBox.checked; drawCode(); });
assignBox.addEventListener('change', function () { edit.assign = assignBox.checked; drawCode(); });
document.getElementById('top').addEventListener('click', function () { value += 100; log('topUp(100): balance ' + value + '.'); });
document.getElementById('chk').addEventListener('click', function () { log('checkBalance() → (' + value + ' : nat)'); });
document.getElementById('up').addEventListener('click', function () { upgrade(); drawCode(); });
document.getElementById('re').addEventListener('click', function () { install('reinstall'); drawCode(); });
install('first deploy (install)');
drawCode();
<\/script>`,
  }],
  quiz:[
    { q:'What does the <code>stable</code> keyword do?', options:['Makes the variable read-only','Keeps the variable\'s value when the canister\'s code is upgraded','Saves it in the browser','Turns the function into a query'], answer:1, why:'Stable variables are written out before an upgrade and restored afterwards.' },
    { q:'Why was <code>currentValue := 100;</code> commented out?', options:['It is a syntax error','Statements in the actor body run on every install and upgrade, so it would overwrite the saved value','A Nat cannot be reassigned','Stable variables can never be reassigned'], answer:1, why:'The restore happens first, then the actor body runs, so := would win every time.' },
    { q:'A stable var was declared <code>= 300</code> and has since grown to 950. What does it hold after the next upgrade?', options:['300','950','0','100'], answer:1, why:'The initial value is only used at the first install; upgrades restore the stored 950.' },
  ],
});

PG.add({
  id:'l335', index:335, udemyId:31673326, minutes:18, section:'s38', slug:'time-and-compound-interest', kind:'walkthrough',
  title:'Tracking Time and Calculating Compound Interest',
  blurb:'DBank starts paying interest. <code>Time.now()</code> gives nanoseconds since 1970; <code>compound()</code> works out the whole seconds since it last ran and multiplies the balance by <code>1.01 ** seconds</code>. Mixing Int and Float needs <code>Float.fromInt</code>, so the balance becomes a Float, and <code>startTime</code> moves forward after each call so no second is paid twice.',
  intro:`<p>A guided read of the finished back end. To try it, deploy this <code>main.mo</code> and use the commands in <code>terminal.sh</code> (or the Candid UI): check the balance, wait a few seconds, compound, check again. The <b>Explore</b> tab lets you speed up the clock.</p>`,
  files:{ 'src/dbank_backend/main.mo': MO_FINAL, 'terminal.sh': SH_335 },
  steps:[
    { title:'Compound interest', text:'Interest is added to the balance, and the next interest is calculated on that bigger total. In general: final = principal × (1 + rate / n)<sup>t</sup>. DBank pays 1% per second, added every second, so the multiplier is simply 1.01<sup>seconds</sup>. The rate is absurd on purpose, so you can watch the balance grow.', file:MO, lines:[35,41] },
    { title:'Reading the clock', text:'<code>Time.now()</code> from the base library\'s Time module returns an Int: the number of nanoseconds since 1 January 1970. Printing it needs <code>debug_show</code>, which was the challenge in the lecture.', file:MO, lines:[10,12] },
    { title:'startTime is a stable var', text:'It has to be a <code>var</code> because compound moves it forward, and <code>stable</code> so the clock survives upgrades.', file:MO, lines:[10,10] },
    { title:'Elapsed seconds', text:'compound() reads the time, subtracts startTime and divides by 1,000,000,000 to turn nanoseconds into seconds. Dividing two Ints drops the remainder, so the result is whole seconds.', file:MO, lines:[36,38] },
    { title:'Raising to a power', text:'<code>**</code> is the power operator. 1.01 is a Float but timeElapsedS is an Int, and Motoko will not mix the two, so <code>Float.fromInt</code> from the Float module converts the seconds first.', file:MO, lines:[39,39] },
    { title:'Why the balance became a Float', text:'A Nat cannot be multiplied by a Float, and money needs decimals anyway. So currentValue, the two amount parameters, tempValue and checkBalance\'s return type all changed to Float.', file:MO, lines:[7,7] },
    { title:'Move the clock forward', text:'Without <code>startTime := currentTime;</code> the next call would count from the very first start again and pay interest for the same seconds twice.', file:MO, lines:[40,40] },
    { title:'compound is an update', text:'It changes currentValue, so it is a plain <code>public func</code>, not a query. A real app would run it on a schedule or with every transaction; here you press it in the Candid UI.', file:MO, lines:[35,35] },
    { title:'Starting over', text:'Changing a stable variable\'s type (Nat to Float) is not a normal upgrade. The lecture uncomments the two reset lines for one deploy, then comments them out again so later deploys keep the balance. With a recent dfx, a reinstall does the same job.', file:SH, lines:[7,9] },
    { title:'Try it', text:'Check the balance, wait about ten seconds, compound, and check again: 300 × 1.01<sup>10</sup> ≈ 331.39.', file:SH, lines:[1,5] },
  ],
  explore:[{
    title:'compound() with and without the clock reset', height:430,
    note:'Press compound() a few times, using the fast-forward button to skip ahead. Then untick <code>startTime := currentTime;</code> and compound twice more: the seconds paid for run ahead of the seconds that actually passed.',
    html:`
<div class="knobs">
  <button id="cmp">compound()</button>
  <button id="skip">⏩ wait 10 s</button>
  <button id="re">reinstall</button>
  <label><input type="checkbox" id="reset" checked> <code>startTime := currentTime;</code></label>
</div>
<pre class="readout" id="state"></pre>
<pre class="readout" id="log" style="height:170px;overflow:auto;white-space:pre-wrap"></pre>
<script>
var offset = 0, balance, startTime, installedAt, paid, logEl = document.getElementById('log');
function now() { return Date.now() + offset; }
function log(t) { logEl.textContent += t + '\\n'; logEl.scrollTop = logEl.scrollHeight; }
function money(x) { return x.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function draw() {
  var since = Math.floor((now() - startTime) / 1000), real = Math.floor((now() - installedAt) / 1000);
  document.getElementById('state').textContent =
    'currentValue                ' + money(balance) + '\\n' +
    'seconds since startTime     ' + since + '\\n' +
    'seconds since install       ' + real + '\\n' +
    'seconds paid interest for   ' + paid + (paid > real ? '   ← some seconds were paid twice' : '');
}
function install() {
  balance = 300; startTime = installedAt = now(); paid = 0;
  log('Installed: currentValue = 300, startTime = Time.now().');
  draw();
}
document.getElementById('cmp').addEventListener('click', function () {
  var currentTime = now(), timeElapsedS = Math.floor((currentTime - startTime) / 1000), factor = Math.pow(1.01, timeElapsedS);
  balance = balance * factor;
  paid += timeElapsedS;
  if (document.getElementById('reset').checked) startTime = currentTime;
  log('compound(): ' + timeElapsedS + ' s → × 1.01^' + timeElapsedS + ' = ' + factor.toFixed(4) + ' → ' + money(balance));
  draw();
});
document.getElementById('skip').addEventListener('click', function () { offset += 10000; draw(); });
document.getElementById('re').addEventListener('click', function () { logEl.textContent = ''; install(); });
setInterval(draw, 250);
install();
<\/script>`,
  }],
  quiz:[
    { q:'What does <code>Time.now()</code> return?', options:['Seconds since midnight','A Float number of milliseconds','An Int count of nanoseconds since 1 January 1970','A Text date'], answer:2, why:'That is why compound divides by 1,000,000,000 to get seconds.' },
    { q:'Why is <code>Float.fromInt(timeElapsedS)</code> needed?', options:['To round the result','1.01 is a Float, and ** needs a Float on both sides','Ints cannot be divided','To turn nanoseconds into seconds'], answer:1, why:'Motoko never converts between number types by itself; you convert explicitly.' },
    { q:'What goes wrong without <code>startTime := currentTime;</code>?', options:['Nothing','The next compound counts the same seconds again and pays too much interest','The balance resets to 300','compound becomes a query'], answer:1, why:'startTime would stay at the original install time, so every call would start counting from there.' },
  ],
});

PG.add({
  id:'l336', index:336, udemyId:31673348, minutes:8, section:'s38', slug:'dbank-html-and-css', kind:'walkthrough',
  title:'Adding HTML and CSS to Create the Frontend for DBANK',
  blurb:'The hello-world front end that dfx generates is swapped for the DBank page: a card with the balance in <code>span#value</code>, two number inputs (top up, withdraw) and one submit button, plus the CSS for focus, hidden spinners and a <code>:disabled</code> button. The JavaScript stays empty until the next lecture.',
  intro:`<p>A guided read of the new front-end files. To see the page for real, run the commands in <code>terminal.sh</code> and open the address <code>npm start</code> prints. The <b>Explore</b> tab shows the page, with a switch for the disabled button style.</p>
<p>The video's older template keeps these files in <code>src/dbank_assets/src/</code> and <code>src/dbank_assets/assets/</code>.</p>`,
  files:{
    'src/dbank_frontend/index.html': HTML,
    'src/dbank_frontend/assets/main.css': CSS,
    'src/dbank_frontend/src/main.js': JS_336,
    'dfx.json': DFX_JSON,
    'terminal.sh': SH_336,
  },
  steps:[
    { title:'Out with the template', text:'Empty the generated index.html, main.css and main.js, paste in the DBank page and stylesheet from the lecture resources, and put the logo image in the assets folder.', file:'src/dbank_frontend/index.html', lines:[12,25] },
    { title:'One card', text:'<code>.container</code> is a 300px card, centred, with a see-through white background on the dark page. Everything else sits inside it.', file:'src/dbank_frontend/assets/main.css', lines:[65,72] },
    { title:'The balance placeholder', text:'<code>span#value</code> shows 234 for now. In the next lecture JavaScript replaces it with the canister\'s real balance, which is why it has an id.', file:'src/dbank_frontend/index.html', lines:[15,15] },
    { title:'Two amounts, one button', text:'Both inputs are <code>type="number"</code> with <code>step="0.01"</code> (cents allowed) and <code>min="0"</code> (no negatives). One submit button sends both values together. The ids are what the JavaScript will look up.', file:'src/dbank_frontend/index.html', lines:[17,23] },
    { title:'A module script', text:'<code>type="module"</code> lets main.js use <code>import</code>, which it needs to bring in the canister.', file:'src/dbank_frontend/index.html', lines:[26,26] },
    { title:'Focus', text:'An input gets a blue border while you type in it.', file:'src/dbank_frontend/assets/main.css', lines:[59,63] },
    { title:'No spinner arrows', text:'Number inputs normally show small up/down arrows. These WebKit pseudo-elements hide them.', file:'src/dbank_frontend/assets/main.css', lines:[79,83] },
    { title:'A disabled look for the button', text:'The button has a hover colour and a dimmed <code>:disabled</code> style. That style matters next lecture: the button is disabled while the canister calls are running.', file:'src/dbank_frontend/assets/main.css', lines:[100,108] },
    { title:'Two canisters', text:'<code>dbank_backend</code> is the Motoko code. <code>dbank_frontend</code> is an assets canister that serves the built page (<code>dist</code>) and depends on the back end. Files in <code>assets/</code> are served from the site root, which is why the page links <code>/main.css</code>.', file:'dfx.json', lines:[2,17] },
    { title:'Run it', text:'Install the packages, start the replica, deploy and start the dev server. The page appears, but nothing reacts yet because main.js is empty.', file:'terminal.sh', lines:[1,9] },
  ],
  explore:[{
    title:'The DBank page', height:560,
    note:'This is the page with the lecture\'s CSS (and a stand-in logo). Click into a field to see the focus border, then tick the box to give the button the <code>disabled</code> attribute.',
    html:`
<style>${DBANK_DEMO_CSS}</style>
<div class="knobs">
  <label><input type="checkbox" id="dis"> give the button the <code>disabled</code> attribute</label>
</div>
<div class="dbank">${DBANK_PAGE}</div>
<script>
document.getElementById('dis').addEventListener('change', function (e) {
  var button = document.getElementById('submit-btn');
  if (e.target.checked) button.setAttribute('disabled', '');
  else button.removeAttribute('disabled');
});
document.querySelector('.dbank form').addEventListener('submit', function (e) { e.preventDefault(); });
<\/script>`,
  }],
  quiz:[
    { q:'Which element will the JavaScript update with the live balance?', options:['The h1 element','<code>span#value</code>','The first input','<code>.divider</code>'], answer:1, why:'The span holds only the number, so the script can replace it without touching the rest of the heading.' },
    { q:'What do <code>step="0.01"</code> and <code>min="0"</code> do on the amount inputs?', options:['Style them','Allow cents and make the browser reject negative numbers','Make the fields required','Send the values to the canister'], answer:1, why:'They are built-in number-input rules, checked by the browser before submitting.' },
  ],
});


PG.add({
  id:'l337', index:337, udemyId:31673420, minutes:27, section:'s38', slug:'connect-motoko-to-js', kind:'walkthrough', project:true,
  title:'Connecting the Motoko Backend to our JS Frontend',
  blurb:'<code>main.js</code> imports the canister from the generated declarations and calls it like any async function: show the balance on load, and on submit top up, withdraw, compound and refresh. Along the way the lecture fixes five real bugs: a missing <code>await</code>, the page reloading, strings sent as Floats, empty fields becoming NaN, and a button that never unlocks.',
  intro:`<p>A guided read of the finished front-end script. Run it for real with <code>dfx deploy</code> and <code>npm start</code> as in the last lecture. The <b>Explore</b> tab runs this exact logic against a JavaScript stand-in for the canister, with a switch for each fix so you can see what it prevents.</p>
<p>The video's older template imports the canister as <code>import { dbank } from "../../declarations/dbank";</code> and calls <code>dbank.topUp(...)</code>; the code is otherwise the same.</p>`,
  files:{
    'src/dbank_frontend/src/main.js': JS_FINAL,
    'src/dbank_frontend/index.html': HTML,
    'src/dbank_backend/main.mo': MO_FINAL,
  },
  steps:[
    { title:'Import the canister', text:'dfx generates a <code>declarations</code> folder from the canister\'s Candid interface. The object it exports has the same functions as the Motoko actor (topUp, withdraw, checkBalance, compound), and each call goes to the canister and returns a Promise.', file:'src/dbank_frontend/src/main.js', lines:[1,1] },
    { title:'Show the balance on load', text:'A load listener calls <code>update()</code>, which asks the canister for <code>checkBalance</code> and writes the answer into <code>span#value</code>.', file:'src/dbank_frontend/src/main.js', lines:[3,5] },
    { title:'await, or you see [object Promise]', text:'The answer comes back over the network later, so the call returns a Promise. Without <code>await</code>, innerText receives the Promise itself and shows "[object Promise]". await only works inside an <code>async</code> function.', file:'src/dbank_frontend/src/main.js', lines:[35,36] },
    { title:'Two decimal places', text:'The Float balance has many decimals. Multiply by 100, round, divide by 100: two are left.', file:'src/dbank_frontend/src/main.js', lines:[37,37] },
    { title:'Stop the page reloading', text:'Submitting a form reloads the page by default, which wipes the console and any work in progress. <code>event.preventDefault()</code> switches that off.', file:'src/dbank_frontend/src/main.js', lines:[7,8] },
    { title:'Strings to numbers', text:'An input\'s <code>.value</code> is always a string, but topUp expects a Float. Sending "10" fails with an invalid float64 argument error, so <code>parseFloat</code> converts first.', file:'src/dbank_frontend/src/main.js', lines:[12,13] },
    { title:'Lock the button', text:'Update calls take a couple of seconds, and impatient users click again, sending the transaction twice. Disabling the button prevents that, and the :disabled CSS greys it out.', file:'src/dbank_frontend/src/main.js', lines:[15,15] },
    { title:'Skip empty fields', text:'One submit handles both fields. <code>parseFloat("")</code> is NaN, and sending NaN to topUp stores NaN as the balance. So each call only runs when its field has something in it. These are two separate ifs, not if/else, so a top-up and a withdrawal can happen in one go.', file:'src/dbank_frontend/src/main.js', lines:[17,23] },
    { title:'Interest, refresh, tidy up', text:'After the top-up and withdrawal, <code>compound()</code> adds the interest earned since last time, <code>update()</code> shows the new balance, and both fields are cleared.', file:'src/dbank_frontend/src/main.js', lines:[25,30] },
    { title:'Unlock it properly', text:'<code>disabled</code> is a boolean attribute: if it is there at all, the button is disabled, so <code>setAttribute("disabled", false)</code> does nothing useful. Remove the attribute instead.', file:'src/dbank_frontend/src/main.js', lines:[32,32] },
    { title:'One update function', text:'Reading and showing the balance is needed twice, on load and after a transaction, so it lives in one async function.', file:'src/dbank_frontend/src/main.js', lines:[35,38] },
    { title:'If a NaN reached the canister', text:'currentValue is stable, so a NaN stays stored. The lecture comments these lines out, deploys, puts them back and deploys again. With a recent dfx, <code>dfx deploy dbank_backend --mode reinstall</code> resets the canister in one step.', file:'src/dbank_backend/main.mo', lines:[7,11] },
  ],
  explore:[{
    title:'What each line prevents', height:600,
    note:'This is main.js running against a stand-in canister. With every box ticked it works like the lecture\'s final version. Untick one box at a time, use the form, and read the log. Try "skip empty fields" with only the withdrawal box filled in.',
    html:`
<style>${DBANK_DEMO_CSS}${SPLIT_CSS}
.knobs code{font-size:11.5px}
</style>
<div class="knobs">
  <label><input type="checkbox" id="fAwait" checked> <code>await</code> checkBalance()</label>
  <label><input type="checkbox" id="fPrevent" checked> <code>event.preventDefault()</code></label>
  <label><input type="checkbox" id="fParse" checked> <code>parseFloat(...)</code></label>
  <label><input type="checkbox" id="fGuard" checked> skip empty fields</label>
  <label><input type="checkbox" id="fRemove" checked> <code>removeAttribute("disabled")</code></label>
  <button id="reset">reset demo</button>
</div>
<div class="wrap">
  <div class="dbank">${DBANK_PAGE}</div>
  <pre class="readout" id="log">Untick one box at a time, then submit the form.</pre>
</div>
<script>
${DBANK_LOG}
${DBANK_MOCK}
var F = {};
['fAwait', 'fPrevent', 'fParse', 'fGuard', 'fRemove'].forEach(function (id) {
  var box = document.getElementById(id);
  F[id] = box.checked;
  box.addEventListener('change', function () { F[id] = box.checked; });
});
var valueEl = document.getElementById('value'), button = document.getElementById('submit-btn');
var inputField = document.getElementById('input-amount'), outputField = document.getElementById('withdrawal-amount');

async function update() {
  if (F.fAwait) {
    var currentAmount = await dbank_backend.checkBalance();
    valueEl.innerText = Math.round(currentAmount * 100) / 100;
  } else {
    var pending = dbank_backend.checkBalance();
    valueEl.innerText = pending;
    log('   no await: the span was given the Promise object, not the number');
  }
}

function pageReload() {
  log('No preventDefault(): the browser submits the form and reloads the page.\\n' +
      '   The inputs empty and the JavaScript that was waiting never finishes.');
  inputField.value = '';
  outputField.value = '';
  button.removeAttribute('disabled');
  valueEl.innerText = '234';
  setTimeout(function () { log('   (page loaded again)'); update(); }, 700);
}

window.addEventListener('load', function () { update(); });

document.querySelector('.dbank form').addEventListener('submit', async function (event) {
  event.preventDefault();
  if (!F.fPrevent) { pageReload(); return; }
  var inputAmount = F.fParse ? parseFloat(inputField.value) : inputField.value;
  var outputAmount = F.fParse ? parseFloat(outputField.value) : outputField.value;
  button.setAttribute('disabled', true);
  try {
    if (!F.fGuard || inputField.value.length != 0) await dbank_backend.topUp(inputAmount);
    if (!F.fGuard || outputField.value.length != 0) await dbank_backend.withdraw(outputAmount);
    await dbank_backend.compound();
    await update();
  } catch (error) {
    log('Uncaught (in promise) Error: ' + error.message +
        '\\n   The handler stopped here, so the button stays disabled. Press "reset demo".');
    return;
  }
  inputField.value = '';
  outputField.value = '';
  if (F.fRemove) button.removeAttribute('disabled');
  else {
    button.setAttribute('disabled', false);
    log('   setAttribute("disabled", false) leaves the attribute on the button, so it stays disabled');
  }
});

document.getElementById('reset').addEventListener('click', function () {
  bank.currentValue = 300;
  bank.startTime = Date.now();
  inputField.value = '';
  outputField.value = '';
  button.removeAttribute('disabled');
  logStarted = false;
  log('Canister reset to 300, as dfx deploy dbank_backend --mode reinstall would do.');
  update();
});
<\/script>`,
  }],
  quiz:[
    { q:'Why did the balance first show "[object Promise]"?', options:['checkBalance failed','The canister call returns a Promise and the code used it without await','innerText cannot show numbers','The span had the wrong id'], answer:1, why:'await waits for the Promise to settle and gives you the number inside it.' },
    { q:'How should the button be enabled again?', options:['button.setAttribute("disabled", false)','button.removeAttribute("disabled")','button.disabled = "false"','button.enable()'], answer:1, why:'disabled is a boolean attribute: any value, even "false", keeps the button disabled while the attribute exists.' },
    { q:'What happens if an empty top-up field is sent anyway?', options:['Nothing','parseFloat("") is NaN, and topUp stores NaN as the balance','The browser blocks the request','The canister rounds it to 0'], answer:1, why:'NaN plus anything is NaN, so the stored balance is ruined until the canister is reset.' },
  ],
});

PG.add({
  id:'l338', index:338, udemyId:31678170, minutes:0, section:'s38', slug:'help-and-support', kind:'read',
  title:'Where to Get Help and Support for Development on the Internet Computer',
  blurb:'Where to look when something breaks: the official developer docs, dfx\'s own help, the DFINITY forum and the developer Discord. Below: what to put in a question, and two resets that fix many local problems.',
  body:`
<h3>Where to ask</h3>
<ul>
  <li><b>Developer docs</b>: guides and references for canisters, Motoko and the tooling.</li>
  <li><b>dfx help</b>: every command explains itself, for example <code>dfx --help</code>, <code>dfx deploy --help</code>, <code>dfx canister call --help</code>.</li>
  <li><b>DFINITY forum</b>: search before posting; most setup errors have come up before.</li>
  <li><b>ICP developer Discord</b>: quick answers from the community.</li>
</ul>
<h3>What to include in a question</h3>
<pre data-lang="sh">dfx --version
node --version
# plus: your operating system, the exact command you ran and the full error text</pre>
<h3>Two resets that fix a lot</h3>
<pre data-lang="sh"># stop the local replica and start it again with an empty state
dfx stop
dfx start --clean --background
dfx deploy

# reinstall a single canister, wiping its stored values (for example a NaN balance)
dfx deploy dbank_backend --mode reinstall</pre>`,
  links:[
    { title:'ICP developer docs', url:'https://docs.internetcomputer.org/', note:'guides, concepts and references' },
    { title:'Motoko docs', url:'https://docs.internetcomputer.org/languages/motoko/', note:'the language and its base library' },
    { title:'DFINITY developer forum', url:'https://forum.dfinity.org/', note:'search and ask' },
    { title:'ICP developer Discord', url:'https://discord.internetcomputer.org/', note:'community chat' },
    { title:'dfx on GitHub', url:'https://github.com/dfinity/sdk', note:'release notes and known issues' },
  ],
});

})();
