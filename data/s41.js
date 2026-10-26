/* ===== Section 41 — Create Your Own Crypto Token ===== */
/* Wrapped in a function so the shared code below stays local to this file. */
(function () {

const raw = String.raw;

/* Line numbers for walkthrough steps, found from the code itself so they stay right.
   L(src, from)            → the line containing `from`
   L(src, from, to)        → from that line to the first later line containing `to`
   L(src, from, to, after) → the same, but searching only below the line containing `after`
   B(src, from)            → from that line to the end of the { } block it opens   */
function L(src, from, to, after) {
  const lines = src.split('\n');
  const start = after ? lines.findIndex(l => l.includes(after)) : 0;
  if (start < 0) throw new Error('walkthrough marker not found: ' + after);
  const a = lines.findIndex((l, i) => i >= start && l.includes(from));
  if (a < 0) throw new Error('walkthrough marker not found: ' + from);
  if (!to) return [a + 1, a + 1];
  const b = lines.findIndex((l, i) => i >= a && l.includes(to));
  if (b < 0) throw new Error('walkthrough marker not found: ' + to);
  return [a + 1, b + 1];
}
function B(src, from) {
  const lines = src.split('\n');
  const a = lines.findIndex(l => l.includes(from));
  if (a < 0) throw new Error('walkthrough marker not found: ' + from);
  let depth = 0, seen = false;
  for (let i = a; i < lines.length; i++) {
    for (const ch of lines[i]) { if (ch === '{') { depth++; seen = true; } else if (ch === '}') depth--; }
    if (seen && depth <= 0) return [a + 1, i + 1];
  }
  return [a + 1, lines.length];
}

/* ------------------------------------------------------------------------
   Ids used across the section (made up for the playground)
   ------------------------------------------------------------------------ */
const OWNER_ID = 'xk5tq-7wl2m-bcfzd-ouq4a-3hmyp-r6vkn-tgjs2-e7aqh-lwd5c-n4ymb-zqe';
const FRIEND_ID = 'q5zwm-3knah-7ytdo-ej2ps-wf6br-ihu4c-mx7kg-adl3v-25nqo-tsyez-iqe';
const TOKEN_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

/* ------------------------------------------------------------------------
   Motoko: main.mo as it stands at the end of each lecture (lecture syntax:
   a plain `actor`, not the newer `persistent actor` of the reference repo)
   ------------------------------------------------------------------------ */
const M350 = raw`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

actor Token {

  // paste the output of: dfx identity get-principal
  var owner : Principal = Principal.fromText("<your-principal-id>");
  var totalSupply : Nat = 1000000000;
  var symbol : Text = "DANG";

  // the ledger: which principal owns how many tokens
  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

  // runs when the canister is installed: the owner starts with everything
  balances.put(owner, totalSupply);

  public query func balanceOf(who : Principal) : async Nat {

    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };

    return balance;
  };

};
`;

const GET_SYMBOL = raw`  public query func getSymbol() : async Text {
    return symbol;
  };`;

const M352 = raw`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";

actor Token {

  var owner : Principal = Principal.fromText("<your-principal-id>");
  var totalSupply : Nat = 1000000000;
  var symbol : Text = "DANG";

  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  balances.put(owner, totalSupply);

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  public shared(msg) func payOut() : async Text {
    Debug.print(debug_show(msg.caller));
    if (balances.get(msg.caller) == null) {
      let amount = 10000;
      balances.put(msg.caller, amount);
      return "Success";
    } else {
      return "Already Claimed";
    };
  };

};
`;

const M353 = raw`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";

actor Token {

  var owner : Principal = Principal.fromText("<your-principal-id>");
  var totalSupply : Nat = 1000000000;
  var symbol : Text = "DANG";

  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  balances.put(owner, totalSupply);

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  public shared(msg) func payOut() : async Text {
    if (balances.get(msg.caller) == null) {
      let amount = 10000;
      balances.put(msg.caller, amount);
      return "Success";
    } else {
      return "Already Claimed";
    };
  };

  public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
    let fromBalance = await balanceOf(msg.caller);
    if (fromBalance > amount) {
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance = await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);

      return "Success";
    } else {
      return "Insufficient Funds";
    };
  };

};
`;

const CALLER_EXPERIMENT = raw`// A throwaway version of transfer, used in the lecture only to see
// who msg.caller is when one canister function calls another.
// Put it in main.mo for a moment, dfx deploy, call it, then remove it.

  public shared(msg) func transfer() : async Text {
    Debug.print(debug_show(msg.caller));   // who called transfer?
    let result = await payOut();           // payOut prints ITS msg.caller
    return result;
  };

// payOut keeps its Debug.print(debug_show(msg.caller)) line for the test.
//
// dfx canister call token payOut    → prints your terminal identity
// clicking Gimme gimme              → prints 2vxsx-fae (the browser, not logged in)
// dfx canister call token transfer  → transfer prints your identity,
//                                     payOut prints the TOKEN CANISTER's own id
`;

const M354 = raw`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";

actor Token {

  var owner : Principal = Principal.fromText("<your-principal-id>");
  var totalSupply : Nat = 1000000000;
  var symbol : Text = "DANG";

  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  balances.put(owner, totalSupply);

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  public shared(msg) func payOut() : async Text {
    if (balances.get(msg.caller) == null) {
      let amount = 10000;
      let result = await transfer(msg.caller, amount);
      return result;
    } else {
      return "Already Claimed";
    };
  };

  public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
    let fromBalance = await balanceOf(msg.caller);
    if (fromBalance > amount) {
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance = await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);

      return "Success";
    } else {
      return "Insufficient Funds";
    };
  };

};
`;

const M355 = raw`import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {

  let owner : Principal = Principal.fromText("<your-principal-id>");
  let totalSupply : Nat = 1000000000;
  let symbol : Text = "DANG";

  // survives upgrades: a plain array of (owner, balance) pairs
  private stable var balanceEntries : [(Principal, Nat)] = [];

  // fast to use, but NOT stable: rebuilt after every upgrade
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  if (balances.size() < 1) {
    balances.put(owner, totalSupply);
  };

  public query func balanceOf(who : Principal) : async Nat {
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };
    return balance;
  };

  public query func getSymbol() : async Text {
    return symbol;
  };

  public shared(msg) func payOut() : async Text {
    if (balances.get(msg.caller) == null) {
      let amount = 10000;
      let result = await transfer(msg.caller, amount);
      return result;
    } else {
      return "Already Claimed";
    };
  };

  public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
    let fromBalance = await balanceOf(msg.caller);
    if (fromBalance > amount) {
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      let toBalance = await balanceOf(to);
      let newToBalance = toBalance + amount;
      balances.put(to, newToBalance);

      return "Success";
    } else {
      return "Insufficient Funds";
    };
  };

  system func preupgrade() {
    balanceEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    if (balances.size() < 1) {
      balances.put(owner, totalSupply);
    };
  };

};
`;

const CMD350 = raw`# 1. your own principal id: paste it into main.mo as the owner
dfx identity get-principal

# 2. rebuild and reinstall the canister
dfx deploy

# 3. Candid needs the type, so wrap the id as principal "..." in a variable
OWNER_PUBLIC_KEY="principal \"$( dfx identity get-principal )\""
echo $OWNER_PUBLIC_KEY

# 4. ask the canister for the owner's balance
dfx canister call token balanceOf "( $OWNER_PUBLIC_KEY )"
# → (1_000_000_000 : nat)
`;

const CMD352B = raw`dfx deploy

# call payOut as your terminal identity
dfx canister call token payOut
# → ("Success")   the dfx start terminal prints your principal

# now click the faucet button in the browser:
# the dfx start terminal prints 2vxsx-fae, the anonymous principal
`;

const CMD354 = raw`# The faucet now answers "Insufficient Funds": the canister holds 0.
# 1. the token canister's id (do not hard-code it in main.mo: it can change)
dfx canister id token

# 2. keep it as a Candid principal in a shell variable
CANISTER_PUBLIC_KEY="principal \"$( dfx canister id token )\""

# 3. check it looks like: principal "rrkah-fqaaa-..."
echo $CANISTER_PUBLIC_KEY

# 4. as the owner (your terminal identity), send it half the supply
dfx canister call token transfer "($CANISTER_PUBLIC_KEY, 500_000_000)"
# → ("Success")
`;

const CMD355 = raw`# 1. fund the canister and claim once (lecture 354)
# 2. add a real code change, e.g. Debug.print("upgrade test"); then upgrade:
dfx deploy

# 3. is the canister's balance still there?
dfx canister call token balanceOf "($CANISTER_PUBLIC_KEY)"

# lost the id? ask again
dfx canister id token
`;

/* ------------------------------------------------------------------------
   The token project's front end (course layout: src/token_assets/src/...)
   ------------------------------------------------------------------------ */
const DFX_JSON = raw`{
  "canisters": {
    "token": {
      "main": "src/token/main.mo",
      "type": "motoko"
    },
    "token_assets": {
      "dependencies": [
        "token"
      ],
      "frontend": {
        "entrypoint": "src/token_assets/src/index.html"
      },
      "source": [
        "src/token_assets/assets",
        "dist/token_assets/"
      ],
      "type": "assets"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:8000",
      "type": "ephemeral"
    }
  },
  "version": 1
}
`;

const SETUP_COMMANDS = raw`# Terminal 1 — the local replica (a pretend Internet Computer). Leave it running.
dfx start

# Terminal 2 — download everything package.json lists into node_modules/
npm install

# Terminal 3 — build the canister, install it on the replica and
# generate src/declarations/token (the front end imports it)
dfx deploy

# Terminal 4 — serve the React front end, then open http://localhost:8080
npm start
`;

const INDEX_PLAIN = raw`import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";

const init = async () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

init();
`;

const APP_SKELETON = raw`import React from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";

function App() {
  return (
    <div id="screen">
      <Header />
      <Faucet />
      <Balance />
      <Transfer />
    </div>
  );
}

export default App;
`;

const HEADER = raw`import React from "react";

function Header() {
  return (
    <header>
      <div className="blue window" id="logo">
        <h1>
          <span role="img" aria-label="gem">
            💎
          </span>
          DANG
        </h1>
      </div>
    </header>
  );
}

export default Header;
`;

const FAUCET_SKELETON = raw`import React from "react";

function Faucet() {

  async function handleClick(event) {

  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap">
          🚰
        </span>
        Faucet
      </h2>
      <label>Free DANG for new accounts: claim 10,000 tokens to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick}>
          Gimme gimme
        </button>
      </p>
    </div>
  );
}

export default Faucet;
`;

const BALANCE_SKELETON = raw`import React from "react";

function Balance() {

  async function handleClick() {
    console.log("Balance Button Clicked");
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p>This account has a balance of XYZ.</p>
    </div>
  );
}

export default Balance;
`;

const TRANSFER_SKELETON = raw`import React from "react";

function Transfer() {

  async function handleClick() {

  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick}>
            Transfer
          </button>
        </p>
      </div>
    </div>
  );
}

export default Transfer;
`;

/* ---- runnable (react kit) versions: imports point at the playground stand-ins ---- */

const PRINCIPAL_STANDIN = raw`// Stand-in for the npm package "@dfinity/principal" (only what the course uses).
// The playground can't install npm packages. In your dfx project you write:
//   import { Principal } from "@dfinity/principal";
//
// A Principal is the id of a user or of a canister. As text it is groups of
// letters and digits joined by dashes, like 2vxsx-fae.
const TEXT_FORM = /^[a-z2-7]{1,5}(-[a-z2-7]{1,5})*$/;

export class Principal {
  constructor(text) {
    this._text = text;
    this._isPrincipal = true;
  }

  static fromText(text) {
    const t = typeof text === "string" ? text.trim() : text;
    if (typeof t !== "string" || !TEXT_FORM.test(t)) {
      throw new Error(
        "Invalid principal text: " + JSON.stringify(text) +
        ". Principal.fromText needs an id such as 2vxsx-fae."
      );
    }
    return new Principal(t);
  }

  static anonymous() {
    return new Principal("2vxsx-fae");
  }

  toText() {
    return this._text;
  }

  toString() {
    return this._text;
  }
}
`;

/* The token canister, as the generated declarations/token folder plus a
   JavaScript copy of main.mo. `methods` lists what is deployed so far. */
function tokenDeclarations(methods) {
  const has = m => methods.indexOf(m) >= 0;
  const impl = [];
  const idl = [];
  if (has('balanceOf')) {
    impl.push(raw`  balanceOf: (msg, who) => balanceOf(who),`);
    idl.push(raw`    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),`);
  }
  if (has('getSymbol')) {
    impl.push(raw`  getSymbol: (msg) => symbol,`);
    idl.push(raw`    getSymbol: IDL.Func([], [IDL.Text], ["query"]),`);
  }
  if (has('payOut')) {
    impl.push(raw`  payOut: (msg) => {
    if (!balances.has(msg.caller)) {
      balances.set(msg.caller, 10000);
      return "Success";
    }
    return "Already Claimed";
  },`);
    idl.push(raw`    payOut: IDL.Func([], [IDL.Text], []),`);
  }
  if (has('transfer')) {
    impl.push(raw`  transfer: (msg, to, amount) => {
    const fromBalance = balanceOf(msg.caller);
    if (fromBalance > amount) {
      balances.set(msg.caller, fromBalance - amount);
      balances.set(to, balanceOf(to) + amount);
      return "Success";
    }
    return "Insufficient Funds";
  },`);
    idl.push(raw`    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),`);
  }
  return raw`// Stand-in for src/declarations/token/ — the code "dfx deploy" generates so the
// front end can call the token canister.
// The real files send every call over HTTP to the local replica (dfx start).
// This one keeps a small JavaScript copy of main.mo in memory instead, so the
// React components call it exactly as in the course. Calls take a moment, like
// real ones; update calls (they change data) are slower than queries.
// Reloading the preview starts the ledger again, like a redeploy did.
import { Principal } from "../../packages/@dfinity/principal";

// ids you would copy from the terminal
const OWNER = "` + OWNER_ID + raw`"; // dfx identity get-principal
const FRIEND = "` + FRIEND_ID + raw`";
const ANONYMOUS = "2vxsx-fae"; // the caller whenever nobody is logged in
export const canisterId = "` + TOKEN_ID + raw`"; // dfx canister id token

// ---------------------------------------------------------------------------
// The canister: main.mo, written in JavaScript
// ---------------------------------------------------------------------------
const symbol = "DANG";
const balances = new Map(); // HashMap<Principal, Nat>, keyed by principal text
balances.set(OWNER, 1000000000); // balances.put(owner, totalSupply)

function balanceOf(who) {
  return balances.has(who) ? balances.get(who) : 0; // case null 0; case (?result) result
}

const canister = {
` + impl.join('\n') + raw`
};

// ---------------------------------------------------------------------------
// The interface (token.did.js): the methods the deployed canister offers
// and their Candid types
// ---------------------------------------------------------------------------
export const idlFactory = ({ IDL }) => {
  return IDL.Service({
` + idl.join('\n') + raw`
  });
};

// ---------------------------------------------------------------------------
// createActor and token (index.js). @dfinity/agent does this part for real:
// check the argument types, send the call, wait, decode the reply.
// ---------------------------------------------------------------------------
const IDL = {
  Text: "text",
  Nat: "nat",
  Principal: "principal",
  Func: (args, rets, modes) => ({ args, rets, modes }),
  Service: (methods) => methods,
};

const show = (v) => (typeof v === "string" ? '"' + v + '"' : String(v));

function encode(type, value, method) {
  if (type === "principal") {
    if (value && value._isPrincipal) return value.toText();
    throw new Error("Invalid principal argument: " + show(value) + " (" + method + " needs a Principal: use Principal.fromText)");
  }
  if (type === "nat") {
    const ok = (typeof value === "number" && Number.isInteger(value) && value >= 0) ||
      (typeof value === "bigint" && value >= 0);
    if (ok) return Number(value);
    throw new Error("Invalid nat argument: " + show(value) + " (" + method + " needs a whole number: try Number(...))");
  }
  if (type === "text" && typeof value !== "string") {
    throw new Error("Invalid text argument: " + show(value));
  }
  return value;
}

function decode(type, value) {
  if (type === "nat") return BigInt(value); // a Candid nat arrives as a BigInt
  if (type === "principal") return Principal.fromText(value);
  return value;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createActor = (canisterId, options) => {
  const identity = options && options.agentOptions && options.agentOptions.identity;
  const caller = identity ? identity.getPrincipal().toText() : ANONYMOUS;
  const service = idlFactory({ IDL });
  const actor = {};
  Object.keys(service).forEach((name) => {
    const fn = service[name];
    actor[name] = async (...args) => {
      if (args.length !== fn.args.length) {
        throw new Error(name + " expects " + fn.args.length + " argument(s), got " + args.length);
      }
      const values = fn.args.map((type, i) => encode(type, args[i], name));
      await sleep(fn.modes.indexOf("query") >= 0 ? 300 : 1000);
      return decode(fn.rets[0], canister[name]({ caller: caller }, ...values));
    };
  });
  return actor;
};

export const token = createActor(canisterId);

// for the playground helper box
export const devIds = { owner: OWNER, you: ANONYMOUS, friend: FRIEND, canister: canisterId };
`;
}

const RUN_INDEX = raw`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

const init = async () => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
};

init();
`;

const RUN_APP = raw`import React from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";
import DevIds from "./DevIds";

function App() {
  return (
    <div id="screen">
      <Header />
      <Faucet />
      <Balance />
      <Transfer />
      {/* playground helper: the principal ids you would copy from the terminal */}
      <DevIds />
    </div>
  );
}

export default App;
`;

const DEV_IDS = raw`// Playground helper, not part of the course project.
// In a real project these ids come from the terminal:
//   dfx identity get-principal  → your terminal identity, the token's owner
//   dfx canister id token       → the token canister
// A visitor who is not logged in always calls canisters as 2vxsx-fae.
import React from "react";
import { devIds } from "../../../declarations/token";

function DevIds() {
  return (
    <div className="window white dev-ids">
      <label>Principal ids to copy (one click selects a whole id):</label>
      <ul>
        <li>Token owner (dfx identity get-principal): <code>{devIds.owner}</code></li>
        <li>You, in this browser, not logged in: <code>{devIds.you}</code></li>
        <li>A friend: <code>{devIds.friend}</code></li>
        <li>The token canister (dfx canister id token): <code>{devIds.canister}</code></li>
      </ul>
    </div>
  );
}

export default DevIds;
`;

const TOKEN_CSS = raw`/* A retro look for the token app (written for the playground) */
html {
  background: #a9a8d4;
}

body {
  margin: 0;
  padding: 4px 0 28px;
  font-family: "Courier New", ui-monospace, Menlo, monospace;
  font-size: 14px;
  color: #111;
}

[hidden] {
  display: none !important;
}

.window {
  position: relative;
  box-sizing: border-box;
  width: 88%;
  max-width: 620px;
  margin: 22px auto;
  padding: 14px 18px;
  background: #2f5fa0;
  color: #fff;
  border: 5px double #fff;
  box-shadow: 0 0 0 3px #2f5fa0, 10px 10px 0 rgba(0, 0, 0, 0.35);
}

.window.white {
  background: #c6c6c6;
  color: #111;
  box-shadow: 0 0 0 3px #c6c6c6, 10px 10px 0 rgba(0, 0, 0, 0.35);
}

#logo h1 {
  margin: 4px 0;
  text-align: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
}

.window h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

label {
  display: block;
  line-height: 1.5;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 4px 6px;
  font: inherit;
  font-size: 15px;
  color: #8ff;
  background: #1c1caa;
  border: 2px inset #ddd;
}

.trade-buttons {
  margin: 16px 0 4px;
  text-align: center;
}

button {
  font: inherit;
  font-weight: bold;
  color: #fff;
  background: #1f8a2e;
  border: 1px outset #1f8a2e;
  padding: 3px 16px;
  cursor: pointer;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.45);
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

button:hover {
  background: #2fbf45;
  transform: translate(3px, 3px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.45);
}

button::first-letter {
  color: #ffe94d;
}

button:disabled {
  background: #8a8a8a;
  border-color: #777;
  transform: translate(4px, 4px);
  box-shadow: none;
  cursor: default;
}

.transfer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

fieldset {
  flex: 1 1 220px;
  margin: 0;
  border: 2px groove #f2f2f2;
}

.transfer .trade-buttons,
.transfer p {
  flex-basis: 100%;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.dev-ids {
  font-size: 12px;
}

.dev-ids li {
  margin: 5px 0;
  word-break: break-all;
}

.dev-ids code {
  user-select: all;
  background: #fff;
  padding: 1px 4px;
  cursor: copy;
}
`;

/* Balance.jsx: starter (351) and finished version */
const BALANCE_START = raw`import React from "react";
// The playground can't install npm packages, so Principal comes from a small
// stand-in. In your dfx project: import { Principal } from "@dfinity/principal";
import { Principal } from "../packages/@dfinity/principal";
// TODO 1: import { token } from the generated declarations, with the same path
//         as in the course: "../../../declarations/token"

function Balance() {
  // TODO 2: state for the typed text  → const [inputValue, setInput] = useState("");
  // TODO 3: state for the result      → const [balanceResult, setBalance] = useState("");

  async function handleClick() {
    console.log("Balance Button Clicked");
    // TODO 4: turn inputValue into a Principal with Principal.fromText,
    //         await token.balanceOf(principal), then store balance.toLocaleString()
    // TODO 6 (challenge): also store await token.getSymbol()
    // TODO 7: show the result paragraph (it starts hidden)
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          /* TODO 2: make it controlled: value={inputValue} onChange={...} */
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      {/* TODO 5: show {balanceResult} (and later {cryptoSymbol}) instead of XYZ,
          and hide the paragraph until a balance has been fetched: hidden={isHidden} */}
      <p>This account has a balance of XYZ.</p>
    </div>
  );
}

export default Balance;
`;

const BALANCE_DONE = raw`import React, { useState } from "react";
// In your dfx project: import { Principal } from "@dfinity/principal";
import { Principal } from "../packages/@dfinity/principal";
import { token } from "../../../declarations/token";

function Balance() {
  const [inputValue, setInput] = useState("");
  const [balanceResult, setBalance] = useState("");
  const [cryptoSymbol, setSymbol] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    const principal = Principal.fromText(inputValue);
    const balance = await token.balanceOf(principal);
    setBalance(balance.toLocaleString());
    setSymbol(await token.getSymbol());
    setHidden(false);
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>
        This account has a balance of {balanceResult} {cryptoSymbol}.
      </p>
    </div>
  );
}

export default Balance;
`;

/* Faucet.jsx: starter (352) and finished version */
const FAUCET_START = raw`import React from "react";
// TODO 1: import { token } from "../../../declarations/token"

function Faucet() {
  // TODO 3: const [isDisabled, setDisable] = useState(false);
  // TODO 4: const [buttonText, setText] = useState("Gimme gimme");

  async function handleClick(event) {
    // TODO 3: disable the button first
    // TODO 1: const result = await token.payOut(); then log it
    // TODO 4: show the result on the button
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap">
          🚰
        </span>
        Faucet
      </h2>
      <label>Free DANG for new accounts: claim 10,000 tokens to your account.</label>
      <p className="trade-buttons">
        {/* TODO 3: disabled={isDisabled}   TODO 4: {buttonText} instead of the fixed text */}
        <button id="btn-payout" onClick={handleClick}>
          Gimme gimme
        </button>
      </p>
    </div>
  );
}

export default Faucet;
`;

const FAUCET_DONE = raw`import React, { useState } from "react";
import { token } from "../../../declarations/token";

function Faucet() {
  const [isDisabled, setDisable] = useState(false);
  const [buttonText, setText] = useState("Gimme gimme");

  async function handleClick(event) {
    setDisable(true);
    const result = await token.payOut();
    setText(result);
    // setDisable(false); // uncomment to click again and see "Already Claimed"
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap">
          🚰
        </span>
        Faucet
      </h2>
      <label>Free DANG for new accounts: claim 10,000 tokens to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
`;

/* Transfer.jsx: starter (353) and finished version */
const TRANSFER_START = raw`import React from "react";
// TODO 2: import { token } from "../../../declarations/token"
//         and Principal (stand-in): import { Principal } from "../packages/@dfinity/principal";

function Transfer() {
  // TODO 1: state for recipientId and amount (both start as "")
  // TODO 3: state for isDisable (false), feedback ("") and isHidden (true)

  async function handleClick() {
    // TODO 3: hide the old feedback and disable the button
    // TODO 2: const recipient = Principal.fromText(recipientId);
    //         const amountToTransfer = Number(amount);
    //         const result = await token.transfer(recipient, amountToTransfer);
    // TODO 3: show the result and enable the button again
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                /* TODO 1: value={recipientId} onChange={...} */
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                /* TODO 1: value={amount} onChange={...} */
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          {/* TODO 3: disabled={isDisable} */}
          <button id="btn-transfer" onClick={handleClick}>
            Transfer
          </button>
        </p>
        {/* TODO 3: <p hidden={isHidden}>{feedback}</p> */}
      </div>
    </div>
  );
}

export default Transfer;
`;

const TRANSFER_DONE = raw`import React, { useState } from "react";
import { token } from "../../../declarations/token";
// In your dfx project: import { Principal } from "@dfinity/principal";
import { Principal } from "../packages/@dfinity/principal";

function Transfer() {
  const [recipientId, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    setHidden(true);
    setDisable(true);
    const recipient = Principal.fromText(recipientId);
    const amountToTransfer = Number(amount);
    const result = await token.transfer(recipient, amountToTransfer);
    setFeedback(result);
    setHidden(false);
    setDisable(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisable}>
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
`;

/* Files shared by the three runnable token lessons */
function tokenProject(over, methods) {
  return Object.assign({
    'components/App.jsx': RUN_APP,
    'index.jsx': RUN_INDEX,
    'components/Header.jsx': HEADER,
    'components/Faucet.jsx': FAUCET_SKELETON,
    'components/Balance.jsx': BALANCE_DONE,
    'components/Transfer.jsx': TRANSFER_SKELETON,
    'components/DevIds.jsx': DEV_IDS,
    'declarations/token/index.js': tokenDeclarations(methods),
    'packages/@dfinity/principal.js': PRINCIPAL_STANDIN,
    'styles.css': TOKEN_CSS,
  }, over);
}
/* the file the learner edits goes first, so it opens first */
function first(name, files) {
  const out = {}; out[name] = files[name];
  Object.keys(files).forEach(k => { if (k !== name) out[k] = files[k]; });
  return out;
}

const PLAYGROUND_NOTE = '<h3>How this playground runs a canister</h3><p>Motoko and the local replica cannot run in a browser tab, so <code>declarations/token/index.js</code> contains a small JavaScript copy of <code>main.mo</code> behind the same exports dfx generates (<code>token</code>, <code>createActor</code>, <code>idlFactory</code>, <code>canisterId</code>). It checks argument types the way Candid does, waits a moment before answering, and returns a <code>Nat</code> as a BigInt. <code>@dfinity/principal</code> is a stand-in too, imported with a relative path. Reloading the preview starts the ledger from scratch, the same as a redeploy.</p>';

/* ------------------------------------------------------------------------
   358: the authenticated front end (walkthrough)
   ------------------------------------------------------------------------ */
const FAUCET_AUTH = raw`import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";

function Faucet(props) {
  const [isDisabled, setDisable] = useState(false);
  const [buttonText, setText] = useState("Gimme gimme");

  async function handleClick(event) {
    setDisable(true);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const result = await authenticatedCanister.payOut();
    setText(result);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap">
          🚰
        </span>
        Faucet
      </h2>
      <label>Free DANG for new accounts: claim 10,000 tokens to {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
`;

const TRANSFER_AUTH = raw`import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

function Transfer() {
  const [recipientId, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisable, setDisable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    setHidden(true);
    setDisable(true);
    const recipient = Principal.fromText(recipientId);
    const amountToTransfer = Number(amount);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const result = await authenticatedCanister.transfer(recipient, amountToTransfer);
    setFeedback(result);
    setHidden(false);
    setDisable(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisable}>
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
`;

const INDEX_AUTH_357 = raw`import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }
};

async function handleAuthenticated(authClient) {
  ReactDOM.render(<App />, document.getElementById("root"));
}

init();
`;

const INDEX_AUTH_358 = raw`import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {

  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
    });
  }
};

async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal.toString();
  console.log(userPrincipal);
  ReactDOM.render(
    <App loggedInPrincipal={userPrincipal} />,
    document.getElementById("root")
  );
}

init();
`;

const APP_PROPS = raw`import React from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";

function App(props) {
  return (
    <div id="screen">
      <Header />
      <Faucet userPrincipal={props.loggedInPrincipal} />
      <Balance />
      <Transfer />
    </div>
  );
}

export default App;
`;

const LIVE_COMMANDS = raw`# Deploy every canister to the live Internet Computer (needs cycles)
dfx deploy --network ic

# The live token canister has a different id from the local one
dfx canister --network ic id token

# Keep it as a Candid principal in a shell variable and check it
LIVE_CANISTER_KEY="principal \"$( dfx canister --network ic id token )\""
echo $LIVE_CANISTER_KEY

# As the owner, give the live canister half the supply for the faucet
dfx canister --network ic call token transfer "($LIVE_CANISTER_KEY, 500_000_000)"

# The id of the front-end canister ...
dfx canister --network ic id token_assets
# ... becomes the address: https://<token_assets id>.raw.ic0.app
# (newer dfx versions print an icp0.io address instead)

# After each front-end change: deploy again and refresh the page
dfx deploy --network ic
`;

/* ========================================================================
   Explore demos
   ======================================================================== */

const DEMO_COIN_TOKEN = raw`
<p class="note">For each asset, decide: does it run <b>its own blockchain</b> (a coin) or does it live <b>on someone else's chain</b> (a token)?</p>
<div class="stage" style="padding:8px 12px"><table class="grid" id="t" style="width:100%"><tr><th>Asset</th><th style="width:150px">Your answer</th><th>Why</th></tr></table></div>
<pre class="readout" id="score">Nothing answered yet.</pre>
<script>
var A = [
  ['Bitcoin (BTC)', 'coin', 'Runs the Bitcoin chain, kept secure by its own miners.'],
  ['Ether (ETH)', 'coin', 'The native currency of the Ethereum chain itself.'],
  ['Dogecoin (DOGE)', 'coin', 'Has its own chain, which grew out of forks of older coins.'],
  ['Shiba Inu (SHIB)', 'token', 'A contract deployed on Ethereum; it has no chain of its own.'],
  ['Tether (USDT)', 'token', 'Issued as tokens on existing chains such as Ethereum and Tron.'],
  ['Chainlink (LINK)', 'token', 'An ERC-20 token, i.e. a contract on Ethereum.'],
  ['ICP', 'coin', 'The Internet Computer has its own chain, though people often say "ICP token".'],
  ['DANG (this section)', 'token', 'A canister on the Internet Computer: a ledger written in Motoko.']
];
var t = document.getElementById('t'), answered = 0, right = 0;
A.forEach(function (a) {
  var tr = document.createElement('tr');
  tr.innerHTML = '<td><b>' + a[0] + '</b></td><td><button data-v="coin">coin</button> <button data-v="token">token</button></td><td class="why" style="color:#5b6382;font-size:12.5px"></td>';
  t.appendChild(tr);
  tr.querySelectorAll('button').forEach(function (b) {
    b.onclick = function () {
      if (tr.getAttribute('data-done')) return;
      tr.setAttribute('data-done', '1'); answered++;
      var ok = b.getAttribute('data-v') === a[1]; if (ok) right++;
      b.style.background = ok ? '#c9f2d7' : '#ffd4d4';
      tr.querySelector('.why').textContent = (ok ? '✓ ' : '✗ it is a ' + a[1] + '. ') + a[2];
      document.getElementById('score').textContent = right + ' right out of ' + answered + ' answered' + (answered === A.length ? '. Done!' : '');
    };
  });
});
</script>`;

const DEMO_STARTUP = raw`
<p class="note">Tick the commands you have run (each in its own terminal), then look at what <code>localhost:8080</code> shows. Try leaving one out.</p>
<div class="knobs">
  <label><input type="checkbox" id="c1"> 1 &middot; dfx start</label>
  <label><input type="checkbox" id="c2"> 2 &middot; npm install</label>
  <label><input type="checkbox" id="c3"> 3 &middot; dfx deploy</label>
  <label><input type="checkbox" id="c4"> 4 &middot; npm start</label>
</div>
<pre class="readout" id="out"></pre>
<div class="stage" id="page" style="min-height:150px"></div>
<script>
function q(id) { return document.getElementById(id); }
function render() {
  var replica = q('c1').checked, installed = q('c2').checked, deployTried = q('c3').checked, dev = q('c4').checked;
  var deployed = deployTried && replica;
  var lines = [];
  lines.push('$ dfx start   ' + (replica ? '→ replica running on 127.0.0.1:8000' : '(not running)'));
  lines.push('$ npm install ' + (installed ? '→ node_modules/ is ready' : '(not run)'));
  lines.push('$ dfx deploy  ' + (!deployTried ? '(not run)' : replica ? '→ token canister installed, src/declarations/token generated' : '→ Error: cannot reach the local replica. Is dfx start running?'));
  lines.push('$ npm start   ' + (!dev ? '(not run)' : !installed ? '→ sh: webpack: command not found' : !deployed ? '→ Module not found: cannot resolve "../../declarations/token"' : '→ serving http://localhost:8080'));
  q('out').textContent = lines.join('\n');
  var page = q('page');
  if (!dev || !installed) {
    page.innerHTML = '<div style="color:#5b6382;text-align:center;padding:40px 0">localhost:8080<br><b>This site can’t be reached</b> — nothing is serving that port.</div>';
  } else if (!deployed) {
    page.innerHTML = '<div style="background:#2b0f12;color:#ffb4b4;font:12.5px ui-monospace,Menlo,monospace;padding:14px;border-radius:8px">Failed to compile.<br><br>Module not found: Error: Can’t resolve ‘../../declarations/token’<br><br>The declarations folder only exists after a successful dfx deploy.</div>';
  } else {
    page.innerHTML = '<div style="background:#a9a8d4;padding:10px;font:12px Courier New,monospace">' +
      win('#2f5fa0', '#fff', '<div style="text-align:center;font:bold 18px Georgia,serif">💎 DANG</div>') +
      win('#2f5fa0', '#fff', '<b>🚰 Faucet</b><br>Claim 10,000 tokens <span style="float:right;background:#1f8a2e;padding:0 8px">Gimme gimme</span>') +
      win('#c6c6c6', '#111', 'Check account token balance: <span style="float:right;background:#1f8a2e;color:#fff;padding:0 8px">Check Balance</span>') +
      win('#c6c6c6', '#111', 'To Account / Amount <span style="float:right;background:#1f8a2e;color:#fff;padding:0 8px">Transfer</span>') +
      '<div style="text-align:center;color:#333;margin-top:6px">The skeleton renders. Nothing works yet: that is the next lectures.</div></div>';
  }
}
function win(bg, fg, html) { return '<div style="background:' + bg + ';color:' + fg + ';border:3px double #fff;margin:6px auto;padding:6px 10px;max-width:420px">' + html + '</div>'; }
['c1', 'c2', 'c3', 'c4'].forEach(function (id) { q(id).onchange = render; });
render();
</script>`;

const DEMO_LEDGER = raw`
<p class="note"><code>balances.get(who)</code> never returns a plain number: it returns an <b>option</b>, either <code>null</code> or <code>?value</code>. The <code>switch</code> in <code>balanceOf</code> unwraps it. Try a principal that is in the map and one that is not, then add one with <code>put</code>.</p>
<div class="knobs">
  <label>who <select id="who">
    <option value="owner">owner (xk5tq-&hellip;-zqe)</option>
    <option value="friend">a friend (q5zwm-&hellip;-iqe)</option>
    <option value="anon">anonymous (2vxsx-fae)</option>
  </select></label>
  <button id="get">balanceOf(who)</button>
  <label>amount <input type="number" id="amt" value="500" style="width:100px"></label>
  <button id="put">balances.put(who, amount)</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 220px"><h4>balances (HashMap&lt;Principal, Nat&gt;)</h4><table class="grid" id="tbl" style="width:100%"></table></div>
  <pre class="readout" id="out" style="flex:2 1 320px;margin:0 0 12px">Pick a principal and call balanceOf.</pre>
</div>
<script>
var label = { owner: 'xk5tq-…-zqe (owner)', friend: 'q5zwm-…-iqe (friend)', anon: '2vxsx-fae (anonymous)' };
var map = { owner: 1000000000 };
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '_'); }
function table() {
  var keys = Object.keys(map);
  document.getElementById('tbl').innerHTML = '<tr><th>key</th><th>value</th></tr>' +
    (keys.length ? keys.map(function (k) { return '<tr><td>' + label[k] + '</td><td>' + fmt(map[k]) + '</td></tr>'; }).join('') : '<tr><td colspan=2>empty</td></tr>');
}
function who() { return document.getElementById('who').value; }
document.getElementById('get').onclick = function () {
  var k = who(), v = map[k], has = v !== undefined;
  document.getElementById('out').textContent =
    'balances.get(' + label[k] + ')\n  → ' + (has ? '?' + fmt(v) : 'null') + '\n\n' +
    'let balance : Nat = switch (balances.get(who)) {\n' +
    '  case null 0;               ' + (has ? '' : '◀ matches: no entry, so 0') + '\n' +
    '  case (?result) result;     ' + (has ? '◀ matches: result = ' + fmt(v) : '') + '\n' +
    '};\n\nreturn balance;   // (' + fmt(has ? v : 0) + ' : nat)';
};
document.getElementById('put').onclick = function () {
  var k = who(), n = Math.max(0, Math.floor(Number(document.getElementById('amt').value) || 0));
  var had = map[k] !== undefined, old = map[k];
  map[k] = n; table();
  document.getElementById('out').textContent = 'balances.put(' + label[k] + ', ' + fmt(n) + ')\n\n' +
    (had ? 'The key was already there: put REPLACED ' + fmt(old) + ' with ' + fmt(n) + '.\nput never adds to a balance, it overwrites it.' : 'New key: put ADDED an entry.');
};
table();
</script>`;

const DEMO_CALLER_PAYOUT = raw`
<p class="note">The same <code>payOut</code>, called two ways. Watch which principal <code>Debug.print(debug_show(msg.caller))</code> shows in the dfx terminal and who gets credited. Then switch the once-only check off and claim from the terminal: the owner's billion is overwritten.</p>
<div class="knobs">
  <label><input type="checkbox" id="check" checked> once-only check <span class="tag">if (balances.get(msg.caller) == null)</span></label>
  <button id="reset">dfx deploy (fresh ledger)</button>
</div>
<div class="stage" style="display:flex;gap:10px;flex-wrap:wrap">
  <button id="cli">terminal: dfx canister call token payOut</button>
  <button id="web">browser: Gimme gimme</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1 1 300px"><h4>dfx start terminal</h4><pre class="readout" id="log" style="min-height:120px"></pre></div>
  <div class="stage" style="flex:1 1 260px"><h4>balances</h4><table class="grid" id="tbl" style="width:100%"></table></div>
</div>
<script>
var OWNER = 'xk5tq-7wl2m-bcfzd-ouq4a-3hmyp-r6vkn-tgjs2-e7aqh-lwd5c-n4ymb-zqe', ANON = '2vxsx-fae';
var balances, log;
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function short(p) { return p.length > 20 ? p.slice(0, 11) + '…' + p.slice(-3) : p; }
function reset() { balances = {}; balances[OWNER] = 1000000000; log = ['(replica started, canister installed)']; draw(); }
function draw() {
  document.getElementById('log').textContent = log.slice(-9).join('\n');
  document.getElementById('tbl').innerHTML = '<tr><th>principal</th><th>balance</th></tr>' + Object.keys(balances).map(function (k) {
    return '<tr><td>' + short(k) + (k === OWNER ? ' (owner)' : k === ANON ? ' (browser)' : '') + '</td><td>' + fmt(balances[k]) + '</td></tr>';
  }).join('');
}
function payOut(caller, how) {
  log.push('[Canister ' + 'rrkah-fqaaa-aaaaa-aaaaq-cai' + '] ' + caller);
  var reply;
  if (!document.getElementById('check').checked || balances[caller] === undefined) { balances[caller] = 10000; reply = 'Success'; }
  else reply = 'Already Claimed';
  log.push('   ↳ ' + how + ' gets ("' + reply + '")');
  draw();
}
document.getElementById('cli').onclick = function () { payOut(OWNER, 'terminal'); };
document.getElementById('web').onclick = function () { payOut(ANON, 'browser'); };
document.getElementById('reset').onclick = reset;
reset();
</script>`;

const DEMO_CALLER_CHAIN = raw`
<p class="note">Three ways to reach <code>payOut</code>. Each line is what <code>Debug.print(debug_show(msg.caller))</code> prints. When <code>transfer</code> calls <code>payOut</code> itself, the call comes from the canister, so <code>msg.caller</code> is the canister's own id.</p>
<div class="stage" style="display:flex;gap:10px;flex-wrap:wrap">
  <button id="a">dfx canister call token payOut</button>
  <button id="b">click Gimme gimme in the browser</button>
  <button id="c">dfx canister call token transfer</button>
  <button id="clr">clear</button>
</div>
<pre class="readout" id="log" style="min-height:170px"></pre>
<script>
var ME = 'xk5tq-7wl2m-bcfzd-ouq4a-3hmyp-r6vkn-tgjs2-e7aqh-lwd5c-n4ymb-zqe', ANON = '2vxsx-fae', CAN = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
var lines = [];
function add(s) { lines.push(s); document.getElementById('log').textContent = lines.slice(-12).join('\n'); }
document.getElementById('a').onclick = function () { add('payOut    msg.caller = ' + ME + '   ← your terminal identity'); };
document.getElementById('b').onclick = function () { add('payOut    msg.caller = ' + ANON + '   ← the browser, not logged in'); };
document.getElementById('c').onclick = function () {
  add('transfer  msg.caller = ' + ME + '   ← your terminal identity');
  add('  payOut  msg.caller = ' + CAN + '   ← the token canister itself!');
};
document.getElementById('clr').onclick = function () { lines = []; add('(cleared)'); };
add('(click a button)');
</script>`;

const DEMO_TREASURY = raw`
<p class="note">With <code>payOut</code> calling <code>transfer</code>, every claim moves 10,000 DANG <b>out of the canister's account</b>. The canister starts with nothing, so claims fail until the owner funds it. Watch the total supply: it only grows with the old <code>balances.put</code> faucet.</p>
<div class="knobs">
  <label>payOut uses <select id="mode"><option value="transfer">await transfer(msg.caller, amount) (this lecture)</option><option value="put">balances.put(msg.caller, amount) (before)</option></select></label>
  <button id="reset">dfx deploy (fresh ledger)</button>
</div>
<div class="stage" style="display:flex;gap:10px;flex-wrap:wrap">
  <button id="fund">terminal: dfx canister call token transfer "($CANISTER_PUBLIC_KEY, 500_000_000)"</button>
  <button id="claim">browser: Gimme gimme</button>
  <button id="claim2">a second visitor: Gimme gimme</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 280px"><table class="grid" id="tbl" style="width:100%"></table></div>
  <pre class="readout" id="out" style="flex:1 1 260px;margin:0 0 12px"></pre>
</div>
<script>
var SUPPLY = 1000000000, b, last;
var label = { owner: 'owner (your identity)', canister: 'token canister', you: 'you (2vxsx-fae)', other: 'second visitor' };
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function reset() { b = { owner: SUPPLY, canister: 0 }; last = 'Fresh install: the owner holds all ' + fmt(SUPPLY) + ' DANG.'; draw(); }
function total() { return Object.keys(b).reduce(function (s, k) { return s + b[k]; }, 0); }
function draw() {
  document.getElementById('tbl').innerHTML = '<tr><th>account</th><th>DANG</th></tr>' + ['owner', 'canister', 'you', 'other'].filter(function (k) { return b[k] !== undefined; }).map(function (k) {
    return '<tr><td>' + label[k] + '</td><td>' + fmt(b[k]) + '</td></tr>';
  }).join('') + '<tr><th>total supply</th><th style="color:' + (total() === SUPPLY ? '#1a7f3c' : '#c0392b') + '">' + fmt(total()) + '</th></tr>';
  document.getElementById('out').textContent = last;
}
function transfer(from, to, amount) {
  var have = b[from] || 0;
  if (have > amount) { b[from] = have - amount; b[to] = (b[to] || 0) + amount; return 'Success'; }
  return 'Insufficient Funds';
}
function claim(who) {
  if (b[who] !== undefined) { last = 'payOut → "Already Claimed"'; return draw(); }
  if (document.getElementById('mode').value === 'put') { b[who] = 10000; last = 'payOut → "Success"\n10,000 new tokens were created out of thin air.'; }
  else {
    var r = transfer('canister', who, 10000);
    last = 'payOut → transfer(msg.caller, 10000)\ninside transfer, msg.caller = the canister\n→ "' + r + '"' + (r === 'Success' ? '' : '\nThe canister has ' + fmt(b.canister) + ' DANG. Fund it first.');
  }
  draw();
}
document.getElementById('fund').onclick = function () { var r = transfer('owner', 'canister', 500000000); last = 'owner → canister: 500,000,000\n→ "' + r + '"'; draw(); };
document.getElementById('claim').onclick = function () { claim('you'); };
document.getElementById('claim2').onclick = function () { claim('other'); };
document.getElementById('reset').onclick = reset;
reset();
</script>`;

const DEMO_UPGRADE = raw`
<p class="note">Make some balances, then press <b>Upgrade</b> (a <code>dfx deploy</code> after a real code change). Try it with the hooks off, then on. With the hooks on but the seeding guard off, the owner is handed a fresh billion on every upgrade.</p>
<div class="knobs">
  <label><input type="checkbox" id="hooks"> preupgrade / postupgrade copy the map through <span class="tag">stable var balanceEntries</span></label>
  <label><input type="checkbox" id="guard" checked> seed the owner only <span class="tag">if (balances.size() &lt; 1)</span></label>
</div>
<div class="stage" style="display:flex;gap:10px;flex-wrap:wrap">
  <button id="fund">owner funds the canister (500,000,000)</button>
  <button id="claim">Gimme gimme</button>
  <button id="up" style="border-color:#5b9cff;font-weight:700">Upgrade: dfx deploy</button>
  <button id="fresh">start over</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 260px"><h4>balances (HashMap)</h4><table class="grid" id="tbl" style="width:100%"></table></div>
  <pre class="readout" id="out" style="flex:1 1 320px;margin:0 0 12px"></pre>
</div>
<script>
var SUPPLY = 1000000000, map, stable = [], last;
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function fresh() { map = { owner: SUPPLY }; stable = []; last = 'Fresh install: the owner holds all ' + fmt(SUPPLY) + '.'; draw(); }
function total() { return Object.keys(map).reduce(function (s, k) { return s + map[k]; }, 0); }
function draw() {
  var rows = Object.keys(map).map(function (k) { return '<tr><td>' + k + '</td><td>' + fmt(map[k]) + '</td></tr>'; }).join('');
  document.getElementById('tbl').innerHTML = '<tr><th>key</th><th>balance</th></tr>' + (rows || '<tr><td colspan=2>empty</td></tr>') +
    '<tr><th>total</th><th style="color:' + (total() === SUPPLY ? '#1a7f3c' : '#c0392b') + '">' + fmt(total()) + '</th></tr>';
  document.getElementById('out').textContent = last;
}
document.getElementById('fund').onclick = function () {
  if ((map.owner || 0) > 500000000) { map.owner -= 500000000; map.canister = (map.canister || 0) + 500000000; last = 'owner → canister 500,000,000: Success'; }
  else last = 'owner → canister: Insufficient Funds';
  draw();
};
document.getElementById('claim').onclick = function () {
  if (map.you !== undefined) last = 'payOut: Already Claimed';
  else if ((map.canister || 0) > 10000) { map.canister -= 10000; map.you = 10000; last = 'payOut: Success (canister → you 10,000)'; }
  else last = 'payOut: Insufficient Funds (fund the canister first)';
  draw();
};
document.getElementById('up').onclick = function () {
  var hooks = document.getElementById('hooks').checked, guard = document.getElementById('guard').checked, steps = [];
  if (hooks) {
    stable = Object.keys(map).map(function (k) { return [k, map[k]]; });
    steps.push('1. preupgrade (old code):\n   balanceEntries := Iter.toArray(balances.entries())\n   = [' + stable.map(function (e) { return '(' + e[0] + ', ' + fmt(e[1]) + ')'; }).join(', ') + ']');
  } else steps.push('1. no preupgrade: nothing is saved');
  map = {}; map.owner = SUPPLY;
  steps.push('2. new code starts: every non-stable var is re-created,\n   so balances is a new map and the top-level code\n   puts the owner in with ' + fmt(SUPPLY));
  if (hooks) {
    map = {}; stable.forEach(function (e) { map[e[0]] = e[1]; });
    steps.push('3. postupgrade: balances := HashMap.fromIter(balanceEntries.vals(), ...)');
    if (!guard) { map.owner = SUPPLY; steps.push('   then balances.put(owner, totalSupply) with no guard:\n   the owner gets a fresh ' + fmt(SUPPLY) + '!'); }
    else steps.push('   balances.size() is ' + Object.keys(map).length + ', so the owner is not seeded again');
  } else steps.push('3. no postupgrade: the old balances are gone');
  last = steps.join('\n');
  draw();
};
document.getElementById('fresh').onclick = fresh;
fresh();
</script>`;

const DEMO_II_PRINCIPALS = raw`
<p class="note">One person, one Internet Identity anchor, three apps. Log in to each and compare the principal each app receives. (Illustration only: the real principals come from key derivation, not this toy hash.)</p>
<div class="knobs">
  <label>identity anchor <select id="anchor"><option>10042</option><option>10043</option><option>2048571</option></select></label>
  <button id="all">log in everywhere</button>
  <button id="out">log out</button>
</div>
<div class="stage"><table class="grid" id="tbl" style="width:100%"></table></div>
<pre class="readout" id="note">The apps only ever see their own principal. Your anchor number and your device key never reach them.</pre>
<script>
var apps = ['dang-token.app', 'opend-market.app', 'daily-news.app'], seen = {};
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
function principal(anchor, app) {
  var abc = 'abcdefghijklmnopqrstuvwxyz234567', seed = hash(anchor + '|' + app), out = '';
  for (var i = 0; i < 53; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; out += abc[seed >>> 27]; }
  return out.match(/.{1,5}/g).join('-');
}
function draw() {
  var a = document.getElementById('anchor').value;
  document.getElementById('tbl').innerHTML = '<tr><th>app</th><th>principal it sees as msg.caller</th><th></th></tr>' + apps.map(function (app, i) {
    var p = seen[app] ? principal(a, app) : '2vxsx-fae  (anonymous: not logged in)';
    return '<tr><td>' + app + '</td><td style="font-family:ui-monospace,Menlo,monospace;font-size:12px">' + p + '</td><td><button data-i="' + i + '">' + (seen[app] ? 'log out' : 'log in') + '</button></td></tr>';
  }).join('');
  document.querySelectorAll('#tbl button').forEach(function (b) { b.onclick = function () { var app = apps[+b.getAttribute('data-i')]; seen[app] = !seen[app]; draw(); }; });
}
document.getElementById('anchor').onchange = draw;
document.getElementById('all').onclick = function () { apps.forEach(function (a) { seen[a] = true; }); draw(); };
document.getElementById('out').onclick = function () { seen = {}; draw(); };
draw();
</script>`;

const DEMO_LOGIN = raw`
<p class="note">What <code>init()</code> in <code>index.jsx</code> does on each page load. Load the page without a stored session, authenticate in the pretend Internet Identity window, then load the page again.</p>
<div class="knobs">
  <label><input type="checkbox" id="cached"> a valid session is stored in this browser</label>
  <button id="load" style="font-weight:700">load the page</button>
  <button id="forget">session expired / cleared</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <pre class="readout" id="log" style="flex:1 1 320px;min-height:190px;margin:0 0 12px"></pre>
  <div class="stage" id="screen" style="flex:1 1 240px;min-height:190px"></div>
</div>
<script>
var log = [];
function q(id) { return document.getElementById(id); }
function say(s) { log.push(s); q('log').textContent = log.join('\n'); }
function app() { q('screen').innerHTML = '<div style="background:#a9a8d4;padding:10px;text-align:center;font:13px Courier New,monospace"><div style="background:#2f5fa0;color:#fff;border:3px double #fff;padding:8px">💎 DANG app rendered</div></div>'; }
function handleAuthenticated() { say('handleAuthenticated(authClient)\n  → ReactDOM.render(<App />, root)'); app(); }
q('load').onclick = function () {
  log = []; q('screen').innerHTML = '<div style="color:#5b6382;text-align:center;padding-top:60px">(blank page: nothing rendered yet)</div>';
  say('const authClient = await AuthClient.create();');
  var ok = q('cached').checked;
  say('await authClient.isAuthenticated()  → ' + ok);
  if (ok) return handleAuthenticated();
  say('await authClient.login({ identityProvider, onSuccess })\n  → opens the Internet Identity window');
  q('screen').innerHTML = '<div style="border:1px solid #cfd5e6;border-radius:10px;padding:14px;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.15)">' +
    '<div style="font-size:11px;color:#5b6382">identity.ic0.app</div><h4 style="margin:8px 0">Internet Identity</h4>' +
    '<p style="font-size:12.5px;margin:0 0 10px">localhost:8080 wants you to sign in with anchor <b>10042</b>.</p>' +
    '<button id="auth" style="font-weight:700">Authenticate (Touch ID)</button></div>';
  q('auth').onclick = function () { q('cached').checked = true; say('user confirmed on the device\n  → session saved in this browser\nonSuccess()'); handleAuthenticated(); };
};
q('forget').onclick = function () { q('cached').checked = false; log = []; say('(session gone: the next load will ask again)'); };
say('(press "load the page")');
</script>`;

const DEMO_IDENTITY = raw`
<p class="note">Which principal does the token canister see as <code>msg.caller</code> when the faucet button is pressed? It depends on the actor the component uses, and on where the app is deployed.</p>
<div class="knobs">
  <label>Faucet calls <select id="actor">
    <option value="default">token.payOut() (default actor)</option>
    <option value="auth">authenticatedCanister.payOut()</option>
  </select></label>
  <label>running on <select id="net"><option value="local">local replica</option><option value="ic">live network (--network ic)</option></select></label>
  <button id="go" style="font-weight:700">Gimme gimme</button>
  <button id="reset">reset</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 280px"><table class="grid" id="tbl" style="width:100%"></table></div>
  <pre class="readout" id="out" style="flex:1 1 300px;margin:0 0 12px"></pre>
</div>
<script>
var ME = '3ajrt-q7l5m-zk4ae-tqb2h-d6xvy-nwr5c-ofk3s-27mja-up6lg-vhe4d-wqe', ANON = '2vxsx-fae', b, last;
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function reset() { b = { canister: 500000000 }; b[ANON] = 10000; last = 'Logged in as ' + ME.slice(0, 11) + '… (Internet Identity).\nThe anonymous principal already claimed earlier.'; draw(); }
function draw() {
  document.getElementById('tbl').innerHTML = '<tr><th>account</th><th>DANG</th></tr>' +
    '<tr><td>token canister</td><td>' + fmt(b.canister) + '</td></tr>' +
    '<tr><td>2vxsx-fae (anonymous)</td><td>' + fmt(b[ANON] || 0) + '</td></tr>' +
    '<tr><td>' + ME.slice(0, 11) + '… (you, logged in)</td><td>' + fmt(b[ME] || 0) + '</td></tr>';
  document.getElementById('out').textContent = last;
}
document.getElementById('go').onclick = function () {
  var auth = document.getElementById('actor').value === 'auth', live = document.getElementById('net').value === 'ic';
  if (auth && !live) { last = 'POST .../api/v2/canister/.../call 403 (Forbidden)\nThe local replica cannot finish the Internet Identity\nsign-off, so the lecture tests this on the live network.'; return draw(); }
  var caller = auth ? ME : ANON;
  var reply;
  if (b[caller] !== undefined) reply = 'Already Claimed';
  else { b.canister -= 10000; b[caller] = 10000; reply = 'Success'; }
  last = (auth ? 'createActor(canisterId, { agentOptions: { identity } })\n' : 'the default actor has no identity\n') + 'msg.caller = ' + (auth ? ME.slice(0, 11) + '… (you)' : ANON + ' (anonymous)') + '\n→ "' + reply + '"';
  draw();
};
document.getElementById('reset').onclick = reset;
reset();
</script>`;

/* ========================================================================
   Lessons
   ======================================================================== */

PG.add({
  id:'l348', index:348, udemyId:31673602, minutes:9, section:'s41', slug:'tokens-and-coins', kind:'read',
  title:'Tokens and Coins: What are they and how are they used?',
  blurb:'A <b>coin</b> has a blockchain of its own, kept running by its own miners or validators. A <b>token</b> is code on a chain that already exists, so launching one mostly means writing a ledger (who owns how much) and the rules for moving units. Tokens pay for things, give votes in governance, unlock features (cycles are a utility token), stand for real-world assets and reward players in games. This section builds a token called DANG on the Internet Computer.',
  explore:[{ title:'Coin or token?', height:470, note:'Sort eight assets by where they live. The reason appears after each answer.', html: DEMO_COIN_TOKEN }],
  quiz:[
    { q:'Why is Shiba Inu called a token while Dogecoin is a coin?', options:['Shiba Inu is worth less','Shiba Inu is a contract on Ethereum; Dogecoin runs its own chain','Dogecoin was released first','Only coins can be traded on exchanges'], answer:1, why:'The difference is the chain: a coin has its own, a token is deployed onto someone else\'s.' },
    { q:'Why is launching a token so much cheaper than launching a coin?', options:['Tokens are not real money','You reuse an existing chain, so you only write the ledger and transfer rules','Tokens never need users','Coins must be approved by a government'], answer:1, why:'A new coin needs its own network of miners or validators. A token borrows the security, users and exchanges of its host chain.' },
    { q:'Staking ICP to vote on proposals for the network is an example of which token use?', options:['Payment','Governance','Gaming reward','Burning'], answer:1, why:'Holders get a say in decisions, a bit like shareholders voting.' },
    { q:'What does <b>burning</b> tokens mean?', options:['Selling them quickly','Destroying them or sending them to an address nobody controls','Converting them to cycles','Moving them to a new chain'], answer:1, why:'Burned tokens can never be spent again, so they leave circulation.' },
  ],
});

PG.add({
  id:'l349', index:349, udemyId:31673610, minutes:6, section:'s41', slug:'token-skeleton-project', kind:'walkthrough',
  title:'Download and Configure the Skeleton Project',
  blurb:'The token project starts from a skeleton: the React front end (Header, Faucet, Balance, Transfer) is already written and <code>main.mo</code> is empty. Four commands, in order, put it on screen: start the replica, install the npm packages, deploy (which also generates the <code>declarations</code> the front end imports), then start the dev server.',
  intro:`<p>Nothing to code in this lecture. The files on the right are the skeleton as you get it; nothing runs in the browser here because dfx and the replica live on your own machine.</p>
<p>To run it for real: unzip the starter from the lecture resources, open the folder in VS Code and run the four commands in <code>commands.sh</code>, each in its own terminal tab. Then open <code>http://localhost:8080</code> and check the console is free of errors.</p>
<p>Newer dfx versions scaffold a different layout (<code>DANG_backend</code> / <code>DANG_frontend</code> folders and a Vite dev server on another port). The steps are the same.</p>`,
  files:{
    'commands.sh': SETUP_COMMANDS,
    'dfx.json': DFX_JSON,
    'src/token/main.mo': '// Empty on purpose: the token\'s backend is written from the next lecture on.\n',
    'src/token_assets/src/index.jsx': INDEX_PLAIN,
    'src/token_assets/src/components/App.jsx': APP_SKELETON,
    'src/token_assets/src/components/Balance.jsx': BALANCE_SKELETON,
    'src/token_assets/src/components/Faucet.jsx': FAUCET_SKELETON,
    'src/token_assets/src/components/Transfer.jsx': TRANSFER_SKELETON,
    'src/token_assets/src/components/Header.jsx': HEADER,
  },
  steps:[
    { title:'Four terminals, four jobs', text:'<code>dfx start</code> runs a local replica, a stand-in for the Internet Computer, and must stay running. <code>npm install</code> fills <code>node_modules</code> (expect a long list of packages and a few deprecation warnings). <code>dfx deploy</code> builds and installs the canister. <code>npm start</code> serves the React app.', file:'commands.sh', lines:L(SETUP_COMMANDS, '# Terminal 1', 'npm start') },
    { title:'Why deploy comes before npm start', text:'<code>dfx deploy</code> also writes <code>src/declarations/token</code>: JavaScript that knows how to call the canister. The React code imports it, so without a deploy the dev server stops with "Module not found". It is needed even while <code>main.mo</code> is empty.', file:'commands.sh', lines:L(SETUP_COMMANDS, '# Terminal 3', 'dfx deploy') },
    { title:'dfx.json lists the canisters', text:'Two canisters: <code>token</code>, the Motoko backend built from <code>src/token/main.mo</code>, and <code>token_assets</code>, an assets canister that serves the built front end. The canister names are what you use on the command line, e.g. <code>dfx canister call token ...</code>.', file:'dfx.json', lines:L(DFX_JSON, '"canisters"', '"type": "assets"') },
    { title:'An empty backend', text:'All starter code was removed from <code>main.mo</code>. From the next lecture it holds the token: owner, supply, ledger and the methods the front end calls.', file:'src/token/main.mo', lines:[1, 1] },
    { title:'The entry point', text:'<code>index.jsx</code> renders <code>App</code> into the <code>root</code> div. Later in the section this is where the Internet Identity login goes.', file:'src/token_assets/src/index.jsx', lines:L(INDEX_PLAIN, 'const init', 'init();') },
    { title:'Four panels in App', text:'<code>App</code> just stacks the four components. Each one has its markup and a click handler that does nothing yet.', file:'src/token_assets/src/components/App.jsx', lines:B(APP_SKELETON, 'function App()') },
    { title:'What the next lectures fill in', text:'<code>Balance</code> only logs on click, and the <code>Faucet</code> and <code>Transfer</code> handlers are empty. Each gets wired to a Motoko method: <code>balanceOf</code>, <code>payOut</code> and <code>transfer</code>.', file:'src/token_assets/src/components/Balance.jsx', lines:B(BALANCE_SKELETON, 'async function handleClick') },
  ],
  explore:[{ title:'What happens if you skip a step?', height:470, note:'Tick the commands in any order. A deploy only works while the replica is running, and the page only builds once the declarations exist.', html: DEMO_STARTUP }],
  quiz:[
    { q:'Why must <code>dfx deploy</code> run before <code>npm start</code>?', options:['It installs React','It generates src/declarations, which the front end imports','It opens port 8080','It downloads the skeleton'], answer:1, why:'The declarations are the generated JavaScript bridge to the canister. Without them the React build cannot resolve its imports.' },
    { q:'What is <code>dfx start</code> for?', options:['It starts the React dev server','It runs a local replica that simulates the Internet Computer','It compiles main.mo','It creates a new project'], answer:1, why:'Canisters are installed into, and called on, the local replica, so it has to keep running.' },
    { q:'Which file tells dfx which canisters exist and where their code is?', options:['package.json','index.html','dfx.json','main.mo'], answer:2, why:'dfx.json maps each canister name to its main file and type.' },
  ],
});

PG.add({
  id:'l350', index:350, udemyId:31673630, minutes:20, section:'s41', slug:'hashmap-token-balances', kind:'walkthrough',
  title:'Using Motoko Hashmaps to Store Token Balances',
  blurb:'The ledger is a <code>HashMap&lt;Principal, Nat&gt;</code>: the key is an account (a <code>Principal</code>), the value its balance. The owner receives the whole supply when the canister is installed. <code>balanceOf</code> reads the map with <code>get</code>, which returns an option (<code>?Nat</code>), and a <code>switch</code> unwraps it: <code>null</code> becomes 0.',
  intro:`<p>Motoko cannot run in the browser, so this lecture is a guided read: click a step to highlight its lines. The <b>Explore</b> tab has a working model of the map and the switch.</p>
<p>To run it for real: put this code in <code>src/token/main.mo</code>, replace <code>&lt;your-principal-id&gt;</code> with the output of <code>dfx identity get-principal</code> (the whole string, every dash), then follow <code>commands.sh</code>.</p>`,
  files:{
    'src/token/main.mo': M350,
    'commands.sh': CMD350,
  },
  steps:[
    { title:'Imports', text:'<code>Principal</code> is the type for user and canister ids; <code>HashMap</code> is Motoko\'s hash table. Watch the capital letters in <code>mo:base/HashMap</code>.', file:'src/token/main.mo', lines:L(M350, 'import Principal', 'import HashMap') },
    { title:'Owner, supply and symbol', text:'<code>Principal.fromText</code> turns the id text into a real <code>Principal</code>; a plain <code>Text</code> would not type-check. <code>Nat</code> can never go below zero, which suits a supply. The symbol is the ticker, like USD or ETH.', file:'src/token/main.mo', lines:L(M350, 'paste the output', 'var symbol') },
    { title:'The ledger', text:'<code>HashMap.HashMap&lt;Principal, Nat&gt;</code> takes the key type, then the value type. Its three arguments: an initial capacity (1), a function that says whether two keys are equal, and a function that hashes a key so the map can find its slot fast.', file:'src/token/main.mo', lines:L(M350, 'the ledger', 'var balances') },
    { title:'Minting to the owner', text:'Code at the top level of an actor runs when the canister is installed. <code>put</code> stores a value under a key, replacing whatever was there.', file:'src/token/main.mo', lines:L(M350, 'runs when the canister', 'balances.put') },
    { title:'balanceOf is a query', text:'It only reads, so it is a <code>query</code>: fast, no consensus round. Like every public method it returns a future, hence <code>async Nat</code>.', file:'src/token/main.mo', lines:B(M350, 'public query func balanceOf') },
    { title:'Unwrapping the option', text:'<code>balances.get(who)</code> returns <code>?Nat</code>: either <code>null</code> (no entry) or a wrapped number. The <code>switch</code> handles both: <code>case null 0</code>, and <code>case (?result) result</code> takes the number out of its wrapper.', file:'src/token/main.mo', lines:L(M350, 'let balance : Nat = switch', 'case (?result)') },
    { title:'Calling it from the terminal', text:'Candid arguments are typed, so a principal must be written <code>principal "..."</code>. Building it in a shell variable avoids typos. Use double quotes on the outside so <code>$( ... )</code> runs.', file:'commands.sh', lines:L(CMD350, '# 3.', 'echo $OWNER_PUBLIC_KEY') },
    { title:'The answer', text:'The owner gets <code>(1_000_000_000 : nat)</code>. Ask about any other principal and the <code>null</code> branch answers 0.', file:'commands.sh', lines:L(CMD350, '# 4.', '# →') },
  ],
  explore:[{ title:'get, put and the option', height:430, note:'The owner is in the map from the start. The other two are not until you put them in.', html: DEMO_LEDGER }],
  quiz:[
    { q:'What does <code>balances.get(who)</code> return for a principal with no entry?', options:['0','null, because get returns an option (?Nat)','An error','An empty string'], answer:1, why:'get always returns an option. The switch in balanceOf turns null into 0.' },
    { q:'In <code>HashMap.HashMap&lt;Principal, Nat&gt;(1, Principal.equal, Principal.hash)</code>, what is <code>Principal.hash</code> for?', options:['It encrypts the ledger','It turns a key into a number that tells the map where the entry lives','It checks the balance is positive','It sorts the keys'], answer:1, why:'Hashing is what makes lookups fast. Principal.equal then confirms two keys really are the same.' },
    { q:'Why does the terminal argument look like <code>principal "xk5tq-…"</code>?', options:['It is a comment','Candid arguments carry their type; a bare string would be Text','It logs you in','dfx needs quotes around everything'], answer:1, why:'balanceOf expects a Principal. Without the principal keyword Candid would see Text and reject it.' },
    { q:'Why is <code>balanceOf</code> declared as a <code>query</code>?', options:['Queries can change state','It only reads data, so it can answer quickly without consensus','Only queries can be public','It makes the method private'], answer:1, why:'Update calls go through consensus and take seconds. A read-only method does not need that.' },
  ],
});

PG.add({
  id:'l351', index:351, udemyId:31673638, minutes:14, section:'s41', slug:'show-token-balance', kind:'react',
  title:'Showing the User\'s Token Balance on the Frontend',
  blurb:'The Balance panel now asks the canister. The input becomes a controlled input, its text is turned into a <code>Principal</code>, and <code>await token.balanceOf(principal)</code> goes through the generated declarations. The reply is a <code>Nat</code>, which reaches JavaScript as a BigInt, so <code>toLocaleString()</code> formats it. The canister here is a JavaScript stand-in in <code>declarations/token</code> with the same exports dfx generates; the Motoko side is in the Notes tab.',
  tasks:[
    'In <code>components/Balance.jsx</code>, import the canister: <code>import { token } from "../../../declarations/token";</code> (the path from the course works here too).',
    'Add <code>const [inputValue, setInput] = useState("")</code> (import <code>useState</code>) and make the input controlled with <code>value={inputValue}</code> and <code>onChange={(e) =&gt; setInput(e.target.value)}</code>. Log <code>inputValue</code> in <code>handleClick</code> to check it.',
    'In <code>handleClick</code>: <code>const principal = Principal.fromText(inputValue)</code>, <code>const balance = await token.balanceOf(principal)</code>, then <code>setBalance(balance.toLocaleString())</code> and show <code>{balanceResult}</code> in the paragraph.',
    'Lecture challenge: add <code>cryptoSymbol</code> state, fill it with <code>await token.getSymbol()</code> and render it after the number.',
    'Hide the paragraph until a balance has loaded: <code>isHidden</code> state starting at <code>true</code>, <code>hidden={isHidden}</code> on the <code>&lt;p&gt;</code>, and <code>setHidden(false)</code> at the end of the handler.',
    'Copy the owner\'s id from the helper box: it shows <b>1,000,000,000 DANG</b>. Try <code>2vxsx-fae</code> (0), then an empty box, and read the error in the console.',
  ],
  files: first('components/Balance.jsx', tokenProject({ 'components/Balance.jsx': BALANCE_START }, ['balanceOf', 'getSymbol'])),
  solution:{ 'components/Balance.jsx': BALANCE_DONE },
  notes:`<h3>The Motoko side (main.mo)</h3>
<p>The challenge adds a query that returns the symbol. After any change to <code>main.mo</code> run <code>dfx deploy</code> again: the dev server reloads your React code but does not rebuild the canister or the declarations, which is why the lecture first saw <i>token.getSymbol is not a function</i>.</p>
<pre data-lang="mo">${GET_SYMBOL}</pre>
${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'Why convert the text with <code>Principal.fromText</code> before calling <code>balanceOf</code>?', options:['To make it lowercase','balanceOf\'s Candid type is Principal, and plain text is rejected','To hide the id from other users','Because inputs return numbers'], answer:1, why:'Candid checks types on every call. An input always gives a string, so it has to become a Principal first.' },
    { q:'Why is <code>handleClick</code> an <code>async</code> function?', options:['React requires it for buttons','Calling the canister is a network request, and await waits for the reply','To make the button faster','async hides errors'], answer:1, why:'await only works inside an async function, and canister calls always return promises.' },
    { q:'You added <code>getSymbol</code> to main.mo and saved, but the browser says <i>token.getSymbol is not a function</i>. What is missing?', options:['A page refresh','dfx deploy, so the canister and declarations include the new method','npm install','A useEffect'], answer:1, why:'npm start only hot-reloads the front end. The canister and the generated declarations change only on dfx deploy.' },
  ],
});

PG.add({
  id:'l352', index:352, udemyId:31673650, minutes:15, section:'s41', slug:'faucet-button', kind:'react',
  title:'Creating the Faucet Functionality Using the Shared Keyword',
  blurb:'The faucet button calls <code>payOut</code>, an update method that credits whoever called it with 10,000 DANG once. Update calls take a few seconds, so the button disables itself while it waits and then shows the canister\'s reply (<code>Success</code> or <code>Already Claimed</code>) as its label. The Motoko half, <code>shared(msg)</code> and <code>msg.caller</code>, is lesson 352b.',
  tasks:[
    'In <code>components/Faucet.jsx</code> import <code>token</code> from <code>"../../../declarations/token"</code>. In <code>handleClick</code> write <code>const result = await token.payOut();</code> and log it.',
    'Click <b>Gimme gimme</b>, then check <code>2vxsx-fae</code> in the Balance panel: 0 before, 10,000 after. That principal is you, a visitor who has not logged in.',
    'Add <code>const [isDisabled, setDisable] = useState(false)</code>, put <code>disabled={isDisabled}</code> on the button and call <code>setDisable(true)</code> first thing in the handler.',
    'Add <code>const [buttonText, setText] = useState("Gimme gimme")</code>, render <code>{buttonText}</code> inside the button and <code>setText(result)</code> when the reply arrives.',
    'For a second claim, add <code>setDisable(false)</code> after <code>setText</code> for a moment and click again: the canister answers <b>Already Claimed</b>. (In the course you refresh the page instead; here a reload restarts the pretend canister, like a redeploy.)',
  ],
  files: first('components/Faucet.jsx', tokenProject({ 'components/Faucet.jsx': FAUCET_START }, ['balanceOf', 'getSymbol', 'payOut'])),
  solution:{ 'components/Faucet.jsx': FAUCET_DONE },
  notes:`<p>The backend for this button, <code>payOut</code> with <code>shared(msg)</code>, is lesson <b>352b</b>.</p>${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'Why is disabling the button not enough to stop someone claiming twice?', options:['Disabled buttons still work','A page refresh resets React state; the real check must be in the canister','The button re-enables after a second','It is enough'], answer:1, why:'Front-end state is easy to reset or bypass. Only the canister can enforce one claim per principal.' },
    { q:'Why does <code>payOut</code> take longer to answer than <code>balanceOf</code>?', options:['It sends an email','It is an update call: it changes state, so the network must agree on it','It downloads the ledger','It is not async'], answer:1, why:'Queries read from one replica. Updates go through consensus, which takes a couple of seconds.' },
    { q:'Who is <code>msg.caller</code> when the button is clicked by someone who has not logged in?', options:['The token owner','The anonymous principal 2vxsx-fae','The token canister','Nobody: the call fails'], answer:1, why:'Every visitor without an identity shares the anonymous principal, which is why login comes later in the section.' },
  ],
});

PG.add({
  id:'l352b', index:352, sub:'b', udemyId:31673650, minutes:0, section:'s41', slug:'faucet-backend-shared-msg', kind:'walkthrough',
  title:'Faucet backend: shared(msg) and msg.caller',
  blurb:'The Motoko half of lecture 352. Writing <code>public shared(msg) func</code> gives the method a <code>msg</code> whose <code>caller</code> is the principal that made the call: your identity from the terminal, the anonymous principal from a browser. <code>payOut</code> credits that caller with 10,000 tokens, but only if <code>balances.get(msg.caller)</code> is still <code>null</code>.',
  intro:`<p>Guided read of <code>main.mo</code> at the end of lecture 352 (click a step to highlight it). The <b>Explore</b> tab lets you call <code>payOut</code> as two different callers.</p>
<p>To run it for real: update <code>src/token/main.mo</code>, run <code>dfx deploy</code>, then call <code>payOut</code> from the terminal and from the faucet button. <code>Debug.print</code> output appears in the terminal running <code>dfx start</code>, not in the browser.</p>`,
  files:{
    'src/token/main.mo': M352,
    'commands.sh': CMD352B,
  },
  steps:[
    { title:'Debug for printing', text:'<code>Debug.print</code> needs <code>import Debug "mo:base/Debug"</code>, and <code>debug_show</code> turns any value into text it can print.', file:'src/token/main.mo', lines:L(M352, 'import Debug') },
    { title:'getSymbol from the last lecture', text:'Still here: a query that returns the ticker.', file:'src/token/main.mo', lines:B(M352, 'public query func getSymbol') },
    { title:'shared(msg)', text:'Public actor methods are shared anyway; writing <code>shared(msg)</code> just names the hidden message argument so you can read <code>msg.caller</code>. This is not a query: it changes the ledger, so it is an update call.', file:'src/token/main.mo', lines:L(M352, 'public shared(msg) func payOut') },
    { title:'Who called?', text:'From the terminal it prints your identity\'s principal. From the browser it prints <code>2vxsx-fae</code>, because the page has no logged-in identity yet. Same method, different caller.', file:'src/token/main.mo', lines:L(M352, 'Debug.print(debug_show(msg.caller))') },
    { title:'One claim per principal', text:'If the caller has no entry yet, <code>put</code> gives them 10,000. Without this check, anyone could claim again after spending, and the owner calling <code>payOut</code> would have their billion overwritten by 10,000 (try it in Explore).', file:'src/token/main.mo', lines:L(M352, 'if (balances.get(msg.caller) == null)', 'return "Success"') },
    { title:'Two possible replies', text:'Both branches return <code>Text</code>, so the front end can put whichever arrives on the button.', file:'src/token/main.mo', lines:L(M352, '} else {', 'return "Already Claimed"') },
  ],
  explore:[{ title:'Who is msg.caller?', height:470, note:'Claim from both sides, then turn the once-only check off and claim from the terminal again.', html: DEMO_CALLER_PAYOUT }],
  quiz:[
    { q:'What does <code>shared(msg)</code> give a method?', options:['A copy of the ledger','Access to msg.caller, the principal that made the call','Permission to change state','A faster response'], answer:1, why:'msg is the incoming message; its caller field identifies who sent it.' },
    { q:'Where does <code>Debug.print</code> output appear?', options:['In the browser console','In the terminal where dfx start is running','In the dfx canister call output','Nowhere'], answer:1, why:'It is printed by the replica process, so it shows up in the dfx start terminal.' },
    { q:'What would happen without the <code>== null</code> check if the owner called <code>payOut</code>?', options:['Nothing','Their 1,000,000,000 would be replaced by 10,000','They would receive 1,000,010,000','The call would fail'], answer:1, why:'put overwrites the existing value for a key; it does not add to it.' },
  ],
});

PG.add({
  id:'l353', index:353, udemyId:31673658, minutes:21, section:'s41', slug:'transfer-form', kind:'react',
  title:'Creating the Transfer Functionality',
  blurb:'The Transfer panel sends tokens from your account to any principal. Both inputs are controlled; before calling <code>token.transfer</code> the recipient text becomes a <code>Principal</code> and the amount a <code>Number</code>, because Candid checks types. While the update call runs the button is disabled, and the reply appears in a paragraph that hides again at the start of each transfer. The Motoko <code>transfer</code> is lesson 353b.',
  tasks:[
    'In <code>components/Transfer.jsx</code> add <code>recipientId</code> and <code>amount</code> state (both <code>""</code>) and make the two inputs controlled.',
    'Import <code>token</code> and <code>Principal</code> (paths in the TODO). In <code>handleClick</code> build <code>Principal.fromText(recipientId)</code> and <code>Number(amount)</code>, then <code>await token.transfer(recipient, amountToTransfer)</code>.',
    'Add <code>isDisable</code>, <code>feedback</code> and <code>isHidden</code> state. At the start of a click hide the old message and disable the button; when the reply arrives show it in <code>&lt;p hidden={isHidden}&gt;{feedback}&lt;/p&gt;</code> and enable the button again.',
    'Claim 10,000 DANG from the faucet, send 50 to the friend\'s id from the helper box, then check both balances in Check Balance (9,950 and 50).',
    'Send 100,000: the reply is <b>Insufficient Funds</b>. Then try sending exactly your whole balance: the lecture\'s <code>&gt;</code> check refuses that too.',
  ],
  files: first('components/Transfer.jsx', tokenProject({ 'components/Faucet.jsx': FAUCET_DONE, 'components/Transfer.jsx': TRANSFER_START }, ['balanceOf', 'getSymbol', 'payOut', 'transfer'])),
  solution:{ 'components/Transfer.jsx': TRANSFER_DONE },
  notes:`<p>The backend, <code>transfer</code> in Motoko and the experiment that shows who <code>msg.caller</code> is for an internal call, is lesson <b>353b</b>.</p>${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'Why <code>Number(amount)</code> before calling <code>transfer</code>?', options:['To round it','Input values are always strings, and transfer\'s amount is a Nat','To make it negative','Number() checks the balance'], answer:1, why:'Even a type="number" input gives you text in e.target.value. Candid rejects text where a nat is expected.' },
    { q:'Why does <code>transfer</code> have no "from" parameter?', options:['It is added later','The sender is always msg.caller, so nobody can spend someone else\'s tokens','Tokens always come from the owner','The front end fills it in'], answer:1, why:'Taking the sender from the message itself is what makes the method safe to expose publicly.' },
    { q:'Why set <code>isHidden</code> to true at the start of each click?', options:['To clear the input','So the previous result disappears while the new transfer runs','React requires it','To re-enable the button'], answer:1, why:'Otherwise an old "Success" would still be showing while the next transfer is in flight.' },
  ],
});

PG.add({
  id:'l353b', index:353, sub:'b', udemyId:31673658, minutes:0, section:'s41', slug:'transfer-backend', kind:'walkthrough',
  title:'Transfer backend: moving tokens between principals',
  blurb:'The Motoko half of lecture 353. An experiment first: when one public method calls another inside the canister, <code>msg.caller</code> in the inner method is the <b>canister itself</b>, not the user. Then <code>transfer(to, amount)</code>: read the sender\'s balance (<code>msg.caller</code>), refuse if it is too small, otherwise subtract from the sender, add to the recipient and write both back with <code>put</code>.',
  intro:`<p>Guided read of <code>main.mo</code> at the end of lecture 353, plus the throwaway experiment in <code>caller-experiment.mo</code>. Explore lets you run the experiment.</p>
<p>To run it for real: add <code>transfer</code> to <code>src/token/main.mo</code> and <code>dfx deploy</code>. Redeploying resets the ledger in this version, so claim from the faucet again before testing.</p>`,
  files:{
    'src/token/main.mo': M353,
    'caller-experiment.mo': CALLER_EXPERIMENT,
  },
  steps:[
    { title:'The experiment', text:'A temporary <code>transfer</code> that prints its caller and then calls <code>payOut</code>, which prints its own caller.', file:'caller-experiment.mo', lines:B(CALLER_EXPERIMENT, 'public shared(msg) func transfer') },
    { title:'What it shows', text:'From the terminal you see your identity; from the browser <code>2vxsx-fae</code>; but inside the nested call the caller is the token canister\'s id (the one dfx prints when it upgrades the canister). So <code>transfer</code> must not rely on calling <code>payOut</code> to know the user.', file:'caller-experiment.mo', lines:L(CALLER_EXPERIMENT, '// dfx canister call token payOut', 'TOKEN CANISTER') },
    { title:'The real signature', text:'<code>shared(msg)</code> for the caller, a recipient <code>to</code> and an <code>amount</code>, and a <code>Text</code> reply like <code>payOut</code>. The sender is never a parameter: it is always <code>msg.caller</code>.', file:'src/token/main.mo', lines:L(M353, 'public shared(msg) func transfer') },
    { title:'Read the sender\'s balance', text:'<code>balanceOf</code> is a public async function, so its result must be awaited; without <code>await</code> you get a future, not a <code>Nat</code>, and a type error.', file:'src/token/main.mo', lines:L(M353, 'let fromBalance = await balanceOf') },
    { title:'Guard, then subtract', text:'Only if the sender has enough. The <code>: Nat</code> annotation matters: subtracting two Nats could go negative, so Motoko warns unless you insist on a Nat (the guard makes it safe). Note <code>&gt;</code> refuses a transfer of your entire balance; <code>&gt;=</code> would allow it.', file:'src/token/main.mo', lines:L(M353, 'if (fromBalance > amount)', 'balances.put(msg.caller, newFromBalance)') },
    { title:'Credit the recipient', text:'<code>balanceOf(to)</code> already returns 0 for someone who is not in the ledger, so a brand-new principal just works.', file:'src/token/main.mo', lines:L(M353, 'let toBalance = await balanceOf(to)', 'balances.put(to, newToBalance)') },
    { title:'Reply', text:'"Success", or "Insufficient Funds" when the guard fails. The front end shows whichever text comes back.', file:'src/token/main.mo', lines:L(M353, 'return "Success";', 'return "Insufficient Funds"', 'public shared(msg) func transfer') },
  ],
  explore:[{ title:'msg.caller through a nested call', height:330, note:'The third button reproduces the lecture\'s experiment.', html: DEMO_CALLER_CHAIN }],
  quiz:[
    { q:'When <code>transfer</code> calls <code>payOut</code> inside the same canister, who is <code>msg.caller</code> in <code>payOut</code>?', options:['The user who called transfer','The anonymous principal','The token canister itself','The owner'], answer:2, why:'The inner call is made by the canister, so the canister is its caller. The user\'s identity does not carry through.' },
    { q:'Why write <code>let newFromBalance : Nat = fromBalance - amount</code>?', options:['To make it a query','Nat subtraction might go negative; the annotation insists on a Nat and the guard keeps it safe','To convert it to Text','It is optional decoration'], answer:1, why:'Without the annotation Motoko infers Int and warns. The if-check guarantees the result is not negative.' },
    { q:'What goes wrong without <code>await</code> on <code>balanceOf(msg.caller)</code>?', options:['Nothing','The value is a future (async Nat), so comparing it with amount is a type error','It returns 0','It calls the wrong canister'], answer:1, why:'Public functions return futures; await gives you the value inside.' },
  ],
});

PG.add({
  id:'l354', index:354, udemyId:31673674, minutes:7, section:'s41', slug:'faucet-uses-transfer', kind:'walkthrough',
  title:'Using the Transfer Functionality in the Faucet',
  blurb:'The first faucet created 10,000 new tokens on every claim, quietly growing the supply past one billion. Now <code>payOut</code> calls <code>transfer(msg.caller, amount)</code>, so tokens come out of the canister\'s own account. Inside that nested call the caller is the canister, so the canister must hold tokens: the owner sends it half the supply from the terminal.',
  intro:`<p>Only the backend changes in this lecture, plus four terminal commands. Click the steps to follow along; the <b>Explore</b> tab models the canister's account.</p>
<p>To run it for real: change <code>payOut</code>, <code>dfx deploy</code>, then run the commands in <code>commands.sh</code>. In this version every deploy wipes the ledger, so the canister has to be funded again after each one (the next lecture fixes that).</p>`,
  files:{
    'src/token/main.mo': M354,
    'commands.sh': CMD354,
  },
  steps:[
    { title:'payOut now transfers', text:'Instead of <code>balances.put(msg.caller, amount)</code>, which minted new tokens, the faucet calls <code>transfer</code> with the claimant as recipient. The total supply stays at one billion.', file:'src/token/main.mo', lines:L(M354, 'let result = await transfer(msg.caller, amount)') },
    { title:'Return transfer\'s reply', text:'<code>transfer</code> is async, so it is awaited, and its text ("Success" or "Insufficient Funds") becomes <code>payOut</code>\'s reply.', file:'src/token/main.mo', lines:L(M354, 'return result;') },
    { title:'Why the first try fails', text:'Inside <code>transfer</code>, <code>msg.caller</code> is the token canister (lesson 353b), so it is the canister\'s balance that gets checked. Paste the canister id into Check Balance: 0 DANG.', file:'src/token/main.mo', lines:L(M354, 'let fromBalance = await balanceOf(msg.caller)') },
    { title:'Find the canister id', text:'<code>dfx canister id token</code> prints it. Use the <code>token</code> canister, not <code>token_assets</code>.', file:'commands.sh', lines:L(CMD354, '# 1.', 'dfx canister id token') },
    { title:'Fund it as the owner', text:'The terminal identity owns the whole supply, so it can send the canister 500,000,000. Candid arguments go in parentheses, and underscores in numbers are allowed for readability. Refresh the page: the faucet now answers "Success".', file:'commands.sh', lines:L(CMD354, '# 2.', '# → ("Success")') },
  ],
  explore:[{ title:'A faucet with a treasury', height:450, note:'Claim before and after funding. Then switch to the old faucet and watch the total supply.', html: DEMO_TREASURY }],
  quiz:[
    { q:'What was wrong with <code>balances.put(msg.caller, 10000)</code> in the faucet?', options:['It was too slow','It created new tokens on every claim, so the supply kept growing','It paid the owner','It could not be called from React'], answer:1, why:'Minting on each claim inflates the supply. Transferring from a funded account keeps it fixed.' },
    { q:'Right after the change, the faucet answers "Insufficient Funds". Why?', options:['transfer has a bug','The nested call\'s caller is the canister, and the canister\'s balance is 0','The user already claimed','The owner is out of tokens'], answer:1, why:'transfer debits msg.caller, which inside payOut\'s call is the canister itself.' },
    { q:'Why not hard-code the canister id into main.mo?', options:['Ids are secret','It is not known before the first deploy and can change between deployments','Motoko cannot store text','It would make the canister public'], answer:1, why:'Funding it from the terminal after deploying avoids depending on an id baked into the code.' },
  ],
});

PG.add({
  id:'l355', index:355, udemyId:31673694, minutes:16, section:'s41', slug:'preupgrade-postupgrade', kind:'walkthrough',
  title:'Persisting Non-Stable Types Using the Pre- and Postupgrade Methods',
  blurb:'Upgrading a canister (<code>dfx deploy</code> after a real code change) re-creates every non-stable variable, so the HashMap ledger starts over. A HashMap cannot be <code>stable</code>, so its entries are copied into a <code>stable</code> array of <code>(Principal, Nat)</code> tuples in <code>preupgrade</code> and rebuilt with <code>HashMap.fromIter</code> in <code>postupgrade</code>. The owner is only seeded when the map is empty.',
  intro:`<p>Guided read of the finished token canister. The <b>Explore</b> tab simulates an upgrade with and without the hooks.</p>
<p>To see the bug for real: fund the canister, claim from the faucet, add a <code>Debug.print</code> somewhere (a comment alone does not trigger an upgrade) and <code>dfx deploy</code>: the canister's balance is back to 0. With these hooks in place, repeat it and the balance survives. A reinstall (<code>dfx deploy --mode reinstall</code>, or a fresh <code>dfx start --clean</code>) still wipes everything, stable or not.</p>`,
  files:{
    'src/token/main.mo': M355,
    'commands.sh': CMD355,
  },
  steps:[
    { title:'Iter for converting', text:'<code>Iter.toArray</code> turns an iterator into an array; it comes from <code>mo:base/Iter</code>.', file:'src/token/main.mo', lines:L(M355, 'import Iter') },
    { title:'Constants become let', text:'The owner, supply and symbol never change, so they are <code>let</code> now.', file:'src/token/main.mo', lines:L(M355, 'let owner', 'let symbol') },
    { title:'A stable copy', text:'<code>stable</code> variables survive upgrades, but only stable types are allowed: arrays of tuples of <code>Principal</code> and <code>Nat</code> qualify, a HashMap (which contains functions and mutable internals) does not.', file:'src/token/main.mo', lines:L(M355, 'survives upgrades', 'private stable var balanceEntries') },
    { title:'The working map', text:'Still a HashMap for fast <code>get</code>/<code>put</code>; scanning an array on every lookup would be slow and cost cycles. It must be <code>var</code> so <code>postupgrade</code> can replace it, and <code>private</code> so only this actor touches it.', file:'src/token/main.mo', lines:L(M355, 'fast to use', 'private var balances') },
    { title:'Seed the owner only once', text:'A first install never runs <code>postupgrade</code>, so the top level still seeds the owner, but only when the map is empty.', file:'src/token/main.mo', lines:B(M355, 'if (balances.size() < 1) {') },
    { title:'preupgrade', text:'Runs in the old code just before it is replaced. <code>balances.entries()</code> is an iterator of (key, value) pairs; <code>Iter.toArray</code> stores them in the stable array. Note the <code>system</code> keyword and exact spelling.', file:'src/token/main.mo', lines:B(M355, 'system func preupgrade') },
    { title:'postupgrade', text:'Runs in the new code right after it starts. <code>HashMap.fromIter</code> takes an iterator (<code>balanceEntries.vals()</code>) plus the same capacity, equality and hash arguments used to create the map. Then the guarded seed: the owner is not handed a fresh billion on every upgrade.', file:'src/token/main.mo', lines:B(M355, 'system func postupgrade') },
  ],
  explore:[{ title:'Upgrade simulator', height:520, note:'Fund, claim, upgrade. Compare the three combinations of the two switches.', html: DEMO_UPGRADE }],
  quiz:[
    { q:'Why can\'t the ledger simply be declared <code>stable var balances = HashMap...</code>?', options:['Stable variables must be private','HashMap is not a stable type','Stable variables cannot change','It would cost too many cycles'], answer:1, why:'Only stable types (numbers, text, principals, arrays and records of them...) can be stable. The HashMap object is not.' },
    { q:'What does <code>preupgrade</code> do in this canister?', options:['Deletes the old ledger','Copies balances.entries() into the stable balanceEntries array','Seeds the owner','Restarts the replica'], answer:1, why:'It runs just before the old code is replaced, so the data can be saved somewhere that survives.' },
    { q:'Why keep the guarded seed at the top level as well as in <code>postupgrade</code>?', options:['It is a leftover','A brand-new install runs the top level but never postupgrade','To double the supply','Top-level code only runs on upgrades'], answer:1, why:'postupgrade only runs on upgrades. The first deploy needs the top-level seed.' },
    { q:'Why not use the stable array as the ledger all the time?', options:['Arrays cannot hold tuples','Every lookup would scan the whole array: slow, and slow costs cycles','Arrays are not stable','Motoko arrays are read-only'], answer:1, why:'The map gives fast lookups; the array is only a carrier across upgrades.' },
  ],
});

PG.add({
  id:'l356', index:356, udemyId:31673702, minutes:6, section:'s41', slug:'what-is-internet-identity', kind:'read',
  title:'What is the Internet Identity?',
  blurb:'Without a login every visitor reaches the canister as the same anonymous principal, so balances cannot belong to real people. <b>Internet Identity</b> is the Internet Computer\'s sign-in: no password, email or seed phrase, just a device key (fingerprint, face unlock or a security key) registered to an anchor number. The private key never leaves the device, and each app receives a different principal for the same person, so apps cannot link your accounts.',
  explore:[{ title:'One person, a different principal per app', height:360, note:'Log in to the three apps and compare. Change the anchor to see a different person.', html: DEMO_II_PRINCIPALS }],
  quiz:[
    { q:'What does a dapp receive when you log in with Internet Identity?', options:['Your anchor number','Your email address','A principal that is specific to that app','Your device\'s private key'], answer:2, why:'Each app gets its own pseudonymous principal; the anchor and keys stay with you.' },
    { q:'Where does the private key for a device live?', options:['On the blockchain','On the device, protected by its biometric or PIN','In the dapp\'s canister','In a password manager'], answer:1, why:'Only the public key is stored on chain. Signing happens on your device.' },
    { q:'Why is the anonymous principal not good enough for the token app?', options:['It is too long','Every visitor who is not logged in shares it, so nobody owns their balance','It cannot call canisters','It costs cycles'], answer:1, why:'Claims and transfers made anonymously all land on one shared account.' },
  ],
});

PG.add({
  id:'l357', index:357, udemyId:31673712, minutes:8, section:'s41', slug:'authenticate-internet-identity', kind:'walkthrough',
  title:'Authenticating with the Internet Identity',
  blurb:'Before anything renders, <code>index.jsx</code> now asks <code>AuthClient</code> (from <code>@dfinity/auth-client</code>) whether this browser already has a session. If it does, the app renders straight away; if not, <code>authClient.login</code> opens the Internet Identity window and the app renders in <code>onSuccess</code>. Logging in does not yet change who calls the canister: that is the next lecture.',
  intro:`<p>Guided read of the new entry file. The login window cannot be shown inside the playground, so the <b>Explore</b> tab walks through the same flow with a pretend Internet Identity window.</p>
<p>To run it for real: update <code>src/token_assets/src/index.jsx</code> (the <code>@dfinity/auth-client</code> package is already in the project's <code>package.json</code>), allow pop-ups for <code>localhost:8080</code>, reload and authenticate. A recovery-method prompt can be skipped for now.</p>`,
  files:{
    'src/token_assets/src/index.jsx': INDEX_AUTH_357,
    'src/token_assets/src/components/App.jsx': APP_SKELETON,
  },
  steps:[
    { title:'Import AuthClient', text:'The package provides the login flow and opens the standard Internet Identity page, so there is no login screen to build.', file:'src/token_assets/src/index.jsx', lines:L(INDEX_AUTH_357, 'import { AuthClient }') },
    { title:'Create the client', text:'<code>AuthClient.create()</code> is async because it first loads any stored session key from the browser.', file:'src/token_assets/src/index.jsx', lines:L(INDEX_AUTH_357, 'const authClient = await AuthClient.create()') },
    { title:'Already logged in?', text:'<code>isAuthenticated()</code> also returns a promise, so await it (a bare promise is always truthy). A session lasts several days, so returning visitors skip the login.', file:'src/token_assets/src/index.jsx', lines:L(INDEX_AUTH_357, 'if (await authClient.isAuthenticated())', 'handleAuthenticated(authClient);') },
    { title:'Log in', text:'<code>login</code> takes the identity provider\'s URL and an <code>onSuccess</code> callback, which runs once the user has authenticated on their device.', file:'src/token_assets/src/index.jsx', lines:B(INDEX_AUTH_357, 'await authClient.login') },
    { title:'Render only when authenticated', text:'Both branches end up in <code>handleAuthenticated</code>, which renders the app. It receives the client because the next lecture needs it to get the identity. (React 18 projects use <code>createRoot</code> instead of <code>ReactDOM.render</code>.)', file:'src/token_assets/src/index.jsx', lines:B(INDEX_AUTH_357, 'async function handleAuthenticated') },
    { title:'Still anonymous to the canister', text:'Clicking the faucet now still says "Already Claimed": the components call the canister through the default actor, which has no identity, so <code>msg.caller</code> is still the anonymous principal.', file:'src/token_assets/src/components/App.jsx', lines:B(APP_SKELETON, 'function App()') },
  ],
  explore:[{ title:'The login flow', height:360, note:'Load without a session, authenticate, then load again.', html: DEMO_LOGIN }],
  quiz:[
    { q:'Why is <code>await</code> needed on <code>authClient.isAuthenticated()</code>?', options:['It is not needed','It returns a promise, and a promise in an if is always truthy','It makes the check faster','It opens the popup'], answer:1, why:'Without await the condition would test the promise object, which is always truthy.' },
    { q:'When does the app render for a first-time visitor?', options:['Immediately','In onSuccess, after they authenticate','After a page refresh','Never'], answer:1, why:'The render call moved into handleAuthenticated, which login calls from onSuccess.' },
    { q:'After logging in, the faucet still says "Already Claimed". Why?', options:['The session expired','The canister calls still go through an actor without the user\'s identity','Internet Identity blocks faucets','The canister was not deployed'], answer:1, why:'The identity has to be given to the actor that makes the call; that is the next lecture.' },
  ],
});

PG.add({
  id:'l358', index:358, udemyId:31673726, minutes:18, section:'s41', slug:'live-deploy-internet-identity', kind:'walkthrough',
  title:'[Optional] Live Deployment to Test Internet Identity Authentication',
  blurb:'For <code>msg.caller</code> to be the logged-in user, Faucet and Transfer build their own actor: <code>createActor(canisterId, { agentOptions: { identity } })</code>, with the identity from <code>authClient.getIdentity()</code>. The local replica cannot complete the Internet Identity sign-off (it answers 403), so the lecture deploys to the live network with <code>--network ic</code>, funds the live canister, and passes the user\'s principal down to Faucet as a prop.',
  intro:`<p>Guided read of the authenticated front end and the live-deployment commands. Deploying live needs cycles (section 39 covers getting them). The <b>Explore</b> tab shows which principal the canister sees in each setup.</p>
<p><code>Debug.print</code> output is not visible on the live network, so the lecture logs from the front end instead (<code>console.log</code> of the identity).</p>`,
  files:{
    'src/token_assets/src/components/Faucet.jsx': FAUCET_AUTH,
    'src/token_assets/src/components/Transfer.jsx': TRANSFER_AUTH,
    'src/token_assets/src/index.jsx': INDEX_AUTH_358,
    'src/token_assets/src/components/App.jsx': APP_PROPS,
    'commands.sh': LIVE_COMMANDS,
  },
  steps:[
    { title:'Imports for an authenticated actor', text:'<code>createActor</code> and <code>canisterId</code> were in the generated declarations all along; the default <code>token</code> export is just <code>createActor(canisterId)</code> with no identity.', file:'src/token_assets/src/components/Faucet.jsx', lines:L(FAUCET_AUTH, 'import { canisterId, createActor }', 'import { AuthClient }') },
    { title:'Get the identity', text:'A new <code>AuthClient</code> picks up the session from the earlier login; <code>getIdentity()</code> returns the user\'s identity. Both calls need <code>await</code>.', file:'src/token_assets/src/components/Faucet.jsx', lines:L(FAUCET_AUTH, 'const authClient = await AuthClient.create()', 'const identity = await authClient.getIdentity()') },
    { title:'An actor that signs as the user', text:'<code>agentOptions</code> are handed to the HTTP agent, which signs every request with that identity. Inside <code>payOut</code>, <code>msg.caller</code> is now the logged-in principal.', file:'src/token_assets/src/components/Faucet.jsx', lines:L(FAUCET_AUTH, 'const authenticatedCanister = createActor', 'const result = await authenticatedCanister.payOut()') },
    { title:'Same change in Transfer', text:'The lecture\'s task: build the same authenticated actor before calling <code>transfer</code>, so tokens leave the logged-in user\'s account rather than the anonymous one.', file:'src/token_assets/src/components/Transfer.jsx', lines:L(TRANSFER_AUTH, 'const authClient = await AuthClient.create()', 'const result = await authenticatedCanister.transfer') },
    { title:'Deploy live', text:'Locally the authenticated call fails with a 403, so everything goes to the <code>ic</code> network. The live canister has its own id; the owner funds it, then the front-end canister\'s id becomes the site\'s address. Allow pop-ups and log in again there: it is a different origin from localhost.', file:'commands.sh', lines:L(LIVE_COMMANDS, '# Deploy every canister', '(newer dfx versions') },
    { title:'The user\'s principal as text', text:'<code>identity._principal</code> is a Principal object; <code>toString()</code> gives the familiar text form, which can be pasted into Check Balance to confirm the 10,000 arrived.', file:'src/token_assets/src/index.jsx', lines:L(INDEX_AUTH_358, 'const identity = await authClient.getIdentity()', 'console.log(userPrincipal)') },
    { title:'Passing it down with props', text:'<code>index.jsx</code> gives it to <code>App</code>, <code>App</code> hands it to <code>Faucet</code>, and the label shows it. Prop names must match at every level (and the parameter is <code>props</code>, not <code>pops</code>).', file:'src/token_assets/src/components/App.jsx', lines:L(APP_PROPS, 'function App(props)', '<Faucet userPrincipal') },
    { title:'Shown in the faucet label', text:'The generic "your account" text becomes the user\'s own principal.', file:'src/token_assets/src/components/Faucet.jsx', lines:L(FAUCET_AUTH, '{props.userPrincipal}') },
  ],
  explore:[{ title:'Who does the canister see?', height:400, note:'Try the authenticated actor on the local replica, then on the live network.', html: DEMO_IDENTITY }],
  quiz:[
    { q:'What makes <code>msg.caller</code> the logged-in user instead of the anonymous principal?', options:['Logging in on the page','Calling through an actor created with the user\'s identity in agentOptions','Deploying to the live network','Passing the principal as a prop'], answer:1, why:'The identity signs the request. An actor built without it calls anonymously, login or not.' },
    { q:'Why does the lecture deploy to the live network to test this?', options:['It is faster','The local replica answers 403 to the Internet Identity sign-off','Internet Identity is free there','Local canisters cannot have props'], answer:1, why:'The sign-off only completes against the real network.' },
    { q:'What does <code>identity._principal.toString()</code> give you?', options:['The anchor number','The user\'s principal in its readable text form','The private key','The canister id'], answer:1, why:'_principal is a Principal object; toString turns it into the dashed text id.' },
  ],
});

})();
