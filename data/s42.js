/* ===== Section 42 — Minting NFTs and Building an NFT Marketplace like OpenSea ===== */
/* Wrapped in a function so the shared code below stays local to this file. */
(function () {

const raw = String.raw;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
function B(src, from, after) {
  const lines = src.split('\n');
  const start = after ? lines.findIndex(l => l.includes(after)) : 0;
  const a = lines.findIndex((l, i) => i >= start && l.includes(from));
  if (a < 0) throw new Error('walkthrough marker not found: ' + from);
  let depth = 0, seen = false;
  for (let i = a; i < lines.length; i++) {
    for (const ch of lines[i]) { if (ch === '{') { depth++; seen = true; } else if (ch === '}') depth--; }
    if (seen && depth <= 0) return [a + 1, i + 1];
  }
  return [a + 1, lines.length];
}
/* the file the learner edits first goes first, so it opens first */
function order(names, files) {
  const out = {};
  names.forEach(n => { out[n] = files[n]; });
  Object.keys(files).forEach(k => { if (!(k in out)) out[k] = files[k]; });
  return out;
}

/* Ids used across the section (made up, in the shape dfx prints them) */
const DFX_IDENTITY = 'xk5tq-7wl2m-bcfzd-ouq4a-3hmyp-r6vkn-tgjs2-e7aqh-lwd5c-n4ymb-zqe';
const OPEND_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';
const CLI_NFT_ID = 'r7inp-6aaaa-aaaaa-aaabq-cai';
const TOKEN_ID = 'renrk-eyaaa-aaaaa-aaada-cai';

/* Real PNG bytes of two of the playground's pixel sprites (16 x 16), for the dfx commands */
const CACTUS_BYTES = '137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 16; 0; 0; 0; 16; 8; 3; 0; 0; 0; 40; 45; 15; 83; 0; 0; 0; 18; 80; 76; 84; 69; 247; 232; 196; 63; 174; 90; 43; 122; 63; 255; 207; 51; 208; 104; 62; 158; 74; 42; 211; 7; 10; 230; 0; 0; 0; 69; 73; 68; 65; 84; 120; 218; 117; 142; 81; 14; 0; 32; 8; 66; 197; 242; 254; 87; 110; 153; 150; 180; 226; 11; 222; 112; 40; 242; 81; 107; 156; 1; 128; 129; 22; 48; 45; 53; 28; 232; 194; 81; 207; 70; 130; 144; 136; 226; 76; 104; 194; 50; 75; 203; 52; 251; 120; 172; 135; 54; 176; 149; 237; 174; 148; 27; 115; 185; 29; 65; 209; 0; 199; 230; 155; 82; 225; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130';
const MUSHROOM_BYTES = '137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 16; 0; 0; 0; 16; 8; 3; 0; 0; 0; 40; 45; 15; 83; 0; 0; 0; 21; 80; 76; 84; 69; 255; 242; 214; 217; 58; 58; 168; 40; 40; 255; 255; 255; 243; 223; 193; 217; 191; 152; 58; 42; 26; 18; 70; 208; 178; 0; 0; 0; 82; 73; 68; 65; 84; 120; 218; 109; 143; 9; 14; 192; 32; 8; 4; 23; 22; 250; 255; 39; 55; 28; 65; 76; 59; 49; 42; 147; 21; 21; 248; 69; 146; 85; 146; 91; 69; 29; 34; 166; 142; 87; 128; 109; 100; 40; 113; 26; 116; 155; 72; 82; 230; 156; 64; 149; 212; 160; 23; 64; 47; 234; 98; 107; 230; 101; 102; 79; 142; 37; 62; 9; 115; 223; 194; 43; 224; 231; 183; 158; 228; 246; 5; 167; 13; 1; 139; 118; 35; 3; 81; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130';

/* ========================================================================
   Motoko, as it stands at the end of each lecture (lecture syntax: a plain
   actor / actor class, not the reference repo's newer `persistent` forms)
   ======================================================================== */

const DFX_JSON = raw`{
  "canisters": {
    "opend": {
      "main": "src/opend/main.mo",
      "type": "motoko"
    },
    "nft": {
      "main": "src/NFT/nft.mo",
      "type": "motoko"
    },
    "opend_assets": {
      "dependencies": [
        "opend"
      ],
      "frontend": {
        "entrypoint": "src/opend_assets/src/index.html"
      },
      "source": [
        "src/opend_assets/assets",
        "dist/opend_assets/"
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
  "version": 1
}
`;

const NFT_360 = raw`import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) {

  let itemName = name;
  let nftOwner = owner;
  let imageBytes = content;

  public query func getName() : async Text {
    return itemName;
  };

  public query func getOwner() : async Principal {
    return nftOwner;
  };

  public query func getAsset() : async [Nat8] {
    return imageBytes;
  };

};
`;

const NFT_362 = raw`import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {

  let itemName = name;
  let nftOwner = owner;
  let imageBytes = content;

  public query func getName() : async Text {
    return itemName;
  };

  public query func getOwner() : async Principal {
    return nftOwner;
  };

  public query func getAsset() : async [Nat8] {
    return imageBytes;
  };

  public query func getCanisterId() : async Principal {
    return Principal.fromActor(this);
  };

};
`;

const NFT_364 = raw`import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {

  private let itemName = name;
  private var nftOwner = owner;
  private let imageBytes = content;

  public query func getName() : async Text {
    return itemName;
  };

  public query func getOwner() : async Principal {
    return nftOwner;
  };

  public query func getAsset() : async [Nat8] {
    return imageBytes;
  };

  public query func getCanisterId() : async Principal {
    return Principal.fromActor(this);
  };

  public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
    if (msg.caller == nftOwner) {
      nftOwner := newOwner;
      return "Success";
    } else {
      return "Error: Not initiated by NFT Owner.";
    };
  };

};
`;

const MAIN_362 = raw`import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";

actor OpenD {

  public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
    let owner : Principal = msg.caller;

    Debug.print(debug_show(Cycles.balance()));
    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    Debug.print(debug_show(Cycles.balance()));

    let newNFTPrincipal = await newNFT.getCanisterId();

    return newNFTPrincipal;
  };

};
`;

const MAIN_363 = raw`import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import NFTActorClass "../NFT/nft";

actor OpenD {

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

  public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
    let owner : Principal = msg.caller;

    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);

    let newNFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal;
  };

  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userNFTs);
  };

};
`;

const MAIN_364 = raw`import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import NFTActorClass "../NFT/nft";

actor OpenD {

  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

  public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
    let owner : Principal = msg.caller;

    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);

    let newNFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal;
  };

  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userNFTs);
  };

  public shared(msg) func listItem(id: Principal, price: Nat) : async Text {
    var item : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
      case null return "NFT does not exist.";
      case (?result) result;
    };

    let owner = await item.getOwner();
    if (Principal.equal(owner, msg.caller)) {
      let newListing : Listing = {
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListings.put(id, newListing);
      return "Success";
    } else {
      return "You don't own the NFT.";
    };
  };

  public query func getOpenDCanisterID() : async Principal {
    return Principal.fromActor(OpenD);
  };

};
`;

const IS_LISTED = raw`  public query func isListed(id: Principal) : async Bool {
    if (mapOfListings.get(id) == null) {
      return false;
    } else {
      return true;
    };
  };`;

/* everything up to 366: 364 plus isListed (365) and the three Discover queries */
const MAIN_366 = MAIN_364.replace('import NFTActorClass "../NFT/nft";', 'import Iter "mo:base/Iter";\nimport NFTActorClass "../NFT/nft";').replace(/\n};\n$/, raw`
  public query func getListedNFTs() : async [Principal] {
    let ids = Iter.toArray(mapOfListings.keys());
    return ids;
  };

` + IS_LISTED + raw`

  public query func getOriginalOwner(id: Principal) : async Principal {
    var listing : Listing = switch (mapOfListings.get(id)) {
      case null return Principal.fromText("");
      case (?result) result;
    };

    return listing.itemOwner;
  };

  public query func getListedNFTPrice(id: Principal) : async Nat {
    var listing : Listing = switch (mapOfListings.get(id)) {
      case null return 0;
      case (?result) result;
    };

    return listing.itemPrice;
  };

};
`);

const MAIN_367 = MAIN_366.replace(/\n};\n$/, raw`
  public shared(msg) func completePurchase(id: Principal, ownerId: Principal, newOwnerId: Principal) : async Text {
    var purchasedNFT : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
      case null return "NFT does not exist";
      case (?result) result;
    };

    let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
    if (transferResult == "Success") {
      mapOfListings.delete(id);

      var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
        return listItemId != id;
      });
      // not in the lecture: without this put the seller's list keeps the sold NFT
      mapOfOwners.put(ownerId, ownedNFTs);

      addToOwnershipMap(newOwnerId, id);
      return "Success";
    } else {
      return transferResult;
    };
  };

};
`);

const CMD360 = raw`# 1. a smoke test first: with nft.mo as  actor NFT { Debug.print("It works."); }
npm install
dfx start             # terminal 1: look here for "It works."
dfx deploy            # terminal 2

# 2. your principal, to be the NFT's owner
dfx identity get-principal

# 3. an actor class needs its arguments when it is installed:
#    a Candid tuple (name, owner, image bytes) in single quotes.
#    These bytes are a complete 16 x 16 PNG (a pixel cactus).
dfx deploy nft --argument='("PixelPals #1", principal "<your-principal-id>", (vec {` + CACTUS_BYTES + raw`}))'

# 4. read it back (no brackets after the method name)
dfx canister call nft getName
dfx canister call nft getOwner
dfx canister call nft getAsset
`;

const CMD362 = raw`# main.mo changed, so redeploy the OpenD canister
# (this also regenerates src/declarations/opend for the front end)
dfx deploy opend

# then mint from the browser: Minter, choose an image, type a name, Mint NFT.
# The dfx start terminal prints the OpenD canister's cycle balance twice:
# the second number is lower, because the new NFT canister was paid for.
`;

const CMD366 = raw`# Everything minted in the browser belongs to the same user, so nothing on
# Discover would ever offer it a Buy button. Your terminal identity is
# someone else: mint, list and hand over an NFT from here.

# 1. mint (the reply is the new NFT canister's id)
dfx canister call opend mint '(vec {` + MUSHROOM_BYTES + raw`}, "PixelPals #5")'

# 2. list it for 2 DANG (paste the id from step 1, inside the quotes)
dfx canister call opend listItem '(principal "<NFT canister id>", 2)'

# 3. the OpenD canister's id
dfx canister id opend

# 4. as the NFT's owner, give it to OpenD (the canister name is NOT quoted)
dfx canister call <NFT canister id> transferOwnership '(principal "<OpenD canister id>")'
`;

const CMD367 = raw`# ---- in the token-local project (dfx start is already running for OpenD) ----
dfx identity get-principal      # paste it into token-local's main.mo as the owner
dfx deploy
npm start                       # OpenD has 8080, so this one opens on 8081

# give the token canister half the supply, then claim 10,000 DANG
# with the faucet button on localhost:8081
CANISTER_PUBLIC_KEY="principal \"$( dfx canister id token )\""
dfx canister call token transfer "($CANISTER_PUBLIC_KEY, 500_000_000)"

# the id to paste into Principal.fromText(...) in Item.jsx
dfx canister id token

# copy token-local's src/declarations/token folder into OpenD's src/declarations/

# ---- back in OpenD ----
dfx deploy opend
# then mint + list + transfer a test NFT from the terminal (lesson 366b) and buy it
`;

/* ========================================================================
   The OpenD front end for the runnable lessons.
   Imports of npm packages point at the stand-ins in packages/.
   ======================================================================== */

/* ---- stand-in: @dfinity/principal ---- */
const PRINCIPAL = raw`// Stand-in for the npm package "@dfinity/principal" (only what the course uses).
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

/* ---- stand-in: @dfinity/agent ---- */
const AGENT = raw`// Stand-in for the npm package "@dfinity/agent" (only what the course uses).
// The playground can't install npm packages. In your dfx project you write:
//   import { Actor, HttpAgent } from "@dfinity/agent";
//
// The real HttpAgent signs each request and sends it over HTTP to the replica
// at "host". This one hands it to the pretend replica in replica.js instead,
// after checking the Candid types and waiting a moment, as a real call would.
import { Principal } from "./principal";
import { replica, OPEND_ID, TOKEN_ID } from "../../replica";

export class HttpAgent {
  constructor(options) {
    options = options || {};
    this.host = options.host;
    this.identity = options.identity || null;
    this.rootKeyFetched = false;
  }

  // The real method downloads the local replica's public key so the answers to
  // update calls can be verified. A local replica needs it; never call it
  // against the live network.
  async fetchRootKey() {
    this.rootKeyFetched = true;
  }

  getPrincipal() {
    return this.identity ? this.identity.getPrincipal() : Principal.anonymous();
  }
}

// a small version of the IDL object that generated idlFactory functions receive
const IDL = {
  Text: "text",
  Nat: "nat",
  Nat8: "nat8",
  Bool: "bool",
  Principal: "principal",
  Vec: (type) => ({ vec: type }),
  Func: (args, rets, modes) => ({ args, rets, modes }),
  Service: (methods) => methods,
};

function show(v) {
  if (typeof v === "string") return '"' + v + '"';
  if (Array.isArray(v)) return v.length > 6 ? "[" + v.slice(0, 6).join(", ") + ", ... (" + v.length + " items)]" : "[" + v.join(", ") + "]";
  return String(v);
}

function encode(type, value, method) {
  if (type === "principal") {
    if (value && value._isPrincipal) return value.toText();
    throw new Error("Invalid principal argument: " + show(value) + " in " + method + ". Pass a Principal: Principal.fromText turns text into one.");
  }
  if (type === "nat" || type === "nat8") {
    const whole = (typeof value === "number" && Number.isInteger(value) && value >= 0) || (typeof value === "bigint" && value >= 0);
    if (whole && (type === "nat" || value <= 255)) return Number(value);
    throw new Error("Invalid " + type + " argument: " + show(value) + " in " + method + (typeof value === "string" ? ". It is a string: convert it with Number(...)" : ""));
  }
  if (type === "text") {
    if (typeof value === "string") return value;
    throw new Error("Invalid text argument: " + show(value) + " in " + method);
  }
  if (type === "bool") {
    if (typeof value === "boolean") return value;
    throw new Error("Invalid bool argument: " + show(value) + " in " + method);
  }
  if (type.vec) {
    if (value == null || typeof value === "string" || typeof value.length !== "number") {
      throw new Error("Invalid vec argument in " + method + ": expected an array");
    }
    return Array.prototype.map.call(value, (item) => encode(type.vec, item, method));
  }
  return value;
}

function decode(type, value) {
  if (type === "nat") return BigInt(value); // a Candid nat arrives as a BigInt
  if (type === "principal") return Principal.fromText(value);
  if (type && type.vec) return value.map((item) => decode(type.vec, item));
  return value;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const label = (id) => (id === OPEND_ID ? "opend" : id === TOKEN_ID ? "token" : "nft " + id.slice(0, 5) + "...");

export const Actor = {
  createActor(idlFactory, options) {
    const agent = options && options.agent;
    if (!agent) throw new Error("Actor.createActor needs an agent");
    const id = typeof options.canisterId === "string" ? Principal.fromText(options.canisterId) : options.canisterId;
    if (!id || !id._isPrincipal) throw new Error("Actor.createActor needs a canisterId (a Principal or its text)");
    const service = idlFactory({ IDL });
    const actor = {};
    Object.keys(service).forEach((name) => {
      const fn = service[name];
      const isQuery = fn.modes.indexOf("query") >= 0;
      actor[name] = async (...args) => {
        if (args.length !== fn.args.length) {
          throw new Error(name + " expects " + fn.args.length + " argument(s) but got " + args.length);
        }
        const values = fn.args.map((type, i) => encode(type, args[i], name));
        await sleep(isQuery ? 200 : 600);
        if (!isQuery && !agent.rootKeyFetched) {
          throw new Error("Fail to verify certificate (" + name + "). On a local replica, call agent.fetchRootKey() after creating the HttpAgent.");
        }
        const caller = agent.getPrincipal().toText();
        const result = await replica.call(id.toText(), name, caller, values);
        if (!isQuery) console.log("[replica] " + label(id.toText()) + "." + name + " called by " + caller + " -> " + show(result));
        return decode(fn.rets[0], result);
      };
    });
    return actor;
  },
};
`;

/* ---- stand-in: react-hook-form ---- */
const RHF = raw`// Stand-in for the npm package "react-hook-form" (only what the course uses).
// The playground can't install npm packages. In your dfx project you write:
//   import { useForm } from "react-hook-form";
//
// register(name, options) connects an input to the form; handleSubmit(onSubmit)
// checks the "required" fields and only then calls onSubmit(data), where
// data.name is the text typed and data.image is the file input's FileList.
import { useRef } from "react";

export function useForm() {
  const fields = useRef({});

  function register(name, options) {
    return {
      name,
      ref: (element) => {
        if (element) fields.current[name] = { element, options: options || {} };
      },
      onChange: () => {},
      onBlur: () => {},
    };
  }

  function handleSubmit(onSubmit) {
    return (event) => {
      if (event && event.preventDefault) event.preventDefault();
      const data = {};
      const missing = [];
      Object.keys(fields.current).forEach((name) => {
        const { element, options } = fields.current[name];
        const value = element.type === "file" ? element.files : element.value;
        data[name] = value;
        const empty = element.type === "file" ? !value || value.length === 0 : !value;
        if (options.required && empty) missing.push(name);
      });
      if (missing.length) {
        console.warn("(react-hook-form) not submitted, required field(s) empty: " + missing.join(", "));
        return;
      }
      return onSubmit(data);
    };
  }

  return { register, handleSubmit };
}
`;

/* ---- the generated declarations ---- */
const NFT_METHODS = {
  getAsset: raw`    getAsset: IDL.Func([], [IDL.Vec(IDL.Nat8)], ["query"]),`,
  getCanisterId: raw`    getCanisterId: IDL.Func([], [IDL.Principal], ["query"]),`,
  getName: raw`    getName: IDL.Func([], [IDL.Text], ["query"]),`,
  getOwner: raw`    getOwner: IDL.Func([], [IDL.Principal], ["query"]),`,
  transferOwnership: raw`    transferOwnership: IDL.Func([IDL.Principal], [IDL.Text], []),`,
};
function nftDecl(methods) {
  return raw`// Stand-in for src/declarations/nft/, generated by "dfx deploy" from nft.mo.
// idlFactory describes the NFT canister's methods and their Candid types.
// Every NFT canister shares this interface, so one idlFactory serves them all;
// Actor.createActor(idlFactory, { agent, canisterId }) picks the canister.
export const idlFactory = ({ IDL }) => {
  return IDL.Service({
` + methods.map(m => NFT_METHODS[m]).join('\n') + raw`
  });
};

export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)];
};
`;
}

const OPEND_METHODS = {
  mint: raw`    mint: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),`,
  getOwnedNFTs: raw`    getOwnedNFTs: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], ["query"]),`,
  listItem: raw`    listItem: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),`,
  getOpenDCanisterID: raw`    getOpenDCanisterID: IDL.Func([], [IDL.Principal], ["query"]),`,
  isListed: raw`    isListed: IDL.Func([IDL.Principal], [IDL.Bool], ["query"]),`,
  getListedNFTs: raw`    getListedNFTs: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),`,
  getOriginalOwner: raw`    getOriginalOwner: IDL.Func([IDL.Principal], [IDL.Principal], ["query"]),`,
  getListedNFTPrice: raw`    getListedNFTPrice: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),`,
  completePurchase: raw`    completePurchase: IDL.Func([IDL.Principal, IDL.Principal, IDL.Principal], [IDL.Text], []),`,
};
function opendDecl(methods) {
  return raw`// Stand-in for src/declarations/opend/, generated by "dfx deploy" from main.mo.
// Same exports as the real files: idlFactory (the interface), canisterId,
// createActor, and opend, an actor that is ready to call.
import { Actor, HttpAgent } from "../../packages/@dfinity/agent";
import { OPEND_ID } from "../../replica";

export const idlFactory = ({ IDL }) => {
  return IDL.Service({
` + methods.map(m => OPEND_METHODS[m]).join('\n') + raw`
  });
};

export const canisterId = OPEND_ID; // the real file reads process.env.OPEND_CANISTER_ID

export const createActor = (canisterId, options) => {
  const agent = new HttpAgent(options ? options.agentOptions : {});
  // the generated code fetches the root key itself while you work locally
  agent.fetchRootKey();
  return Actor.createActor(idlFactory, { agent, canisterId });
};

export const opend = createActor(canisterId);
`;
}

const TOKEN_DECL = raw`// Stand-in for the token declarations copied over from the token-local project
// (its src/declarations/token folder). OpenD only needs idlFactory: the token
// canister's id is pasted into Item.jsx from "dfx canister id token".
export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    getSymbol: IDL.Func([], [IDL.Text], ["query"]),
    payOut: IDL.Func([], [IDL.Text], []),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
  });
};
`;

/* ---- the pretend replica ---- */
const SEEDS = {
  cli: raw`// What already happened before this lecture: the NFT minted from the terminal
// in lecture 360 (dfx deploy nft --argument '("PixelPals #1", principal ..., vec {...})').
NFT("PixelPals #1", DFX_IDENTITY, spritePNG(SPRITES.cactus), "` + CLI_NFT_ID + raw`");
`,
  owned: raw`// What already happened before this lecture: three NFTs minted from this
// browser, so they belong to the anonymous user (CURRENT_USER_ID).
seedMint(ANONYMOUS, "PixelPals #2", "ghost");
seedMint(ANONYMOUS, "PixelPals #3", "rocket");
seedMint(ANONYMOUS, "PixelPals #4", "frog");
`,
  listed: raw`// What already happened before this lecture: three NFTs minted from this
// browser (they belong to the anonymous user, CURRENT_USER_ID), and
// PixelPals #3 was listed for 3 DANG and handed to OpenD before the page loaded.
seedMint(ANONYMOUS, "PixelPals #2", "ghost");
const pal3 = seedMint(ANONYMOUS, "PixelPals #3", "rocket");
seedMint(ANONYMOUS, "PixelPals #4", "frog");
seedList(ANONYMOUS, pal3, 3);
`,
  market: raw`// What already happened before this lecture: three NFTs minted from this
// browser (they belong to the anonymous user, CURRENT_USER_ID), with
// PixelPals #3 listed for 3 DANG ...
seedMint(ANONYMOUS, "PixelPals #2", "ghost");
const pal3 = seedMint(ANONYMOUS, "PixelPals #3", "rocket");
seedMint(ANONYMOUS, "PixelPals #4", "frog");
seedList(ANONYMOUS, pal3, 3);

// ... and two NFTs that your terminal identity minted, listed and handed to
// OpenD with the dfx commands of lesson 366b, so there is something to buy.
const pal5 = seedMint(DFX_IDENTITY, "PixelPals #5", "mushroom");
seedList(DFX_IDENTITY, pal5, 2);
const pal6 = seedMint(DFX_IDENTITY, "PixelPals #6", "robot");
seedList(DFX_IDENTITY, pal6, 5);
`,
};

const TOKEN_CANISTER = raw`
// ---------------------------------------------------------------------------
// token-local: the DANG token canister from the previous section
// ---------------------------------------------------------------------------
const balances = new Map(); // principal text -> DANG

canisters[TOKEN_ID] = {
  balanceOf: (msg, who) => balances.get(who) || 0,
  getSymbol: (msg) => "DANG",
  payOut: (msg) => "Already Claimed",
  transfer: (msg, to, amount) => {
    const fromBalance = balances.get(msg.caller) || 0;
    if (fromBalance >= amount) {
      balances.set(msg.caller, fromBalance - amount);
      balances.set(to, (balances.get(to) || 0) + amount);
      return "Success";
    }
    return "Insufficient Funds";
  },
};

// for the playground bar: read a balance without making a call
export function dangBalance(who) {
  return balances.get(who) || 0;
}

// After token-local's setup: the owner (your terminal identity) gave the token
// canister 500,000,000 and the browser user claimed 10,000 from the faucet.
balances.set(DFX_IDENTITY, 500000000);
balances.set(TOKEN_ID, 499990000);
balances.set(ANONYMOUS, 10000);
`;

function replicaSrc(seed, withToken) {
  return raw`// The pretend local replica: what "dfx start" runs on your machine.
// It hosts the OpenD canister (main.mo) and one canister per NFT (nft.mo)` + (withToken ? raw`,
// plus the DANG token canister from the token-local project` : '') + raw`. Each canister
// is written in JavaScript here, mirroring the Motoko, and the stand-in
// @dfinity/agent passes your calls to it. You don't need to edit this file.
// Every reload of the preview starts it again from the seed at the bottom,
// just as a redeploy wiped the canisters in the course.
import { Principal } from "./packages/@dfinity/principal";

// ---- ids, as dfx would print them -----------------------------------------
export const ANONYMOUS = "2vxsx-fae"; // the browser user (CURRENT_USER_ID in index.jsx)
export const DFX_IDENTITY = "` + DFX_IDENTITY + raw`"; // dfx identity get-principal
export const OPEND_ID = "` + OPEND_ID + raw`"; // dfx canister id opend
export const TOKEN_ID = "` + TOKEN_ID + raw`"; // dfx canister id token (token-local)

const canisters = {}; // canister id -> its methods; each gets (msg, ...args)
const freeIds = [
  "qoctq-giaaa-aaaaa-aaaea-cai", "qjdve-lqaaa-aaaaa-aaaeq-cai", "qsgjb-riaaa-aaaaa-aaaga-cai",
  "qhbym-qaaaa-aaaaa-aaafq-cai", "qaa6y-5yaaa-aaaaa-aaafa-cai", "q4eej-kyaaa-aaaaa-aaaha-cai",
  "q3fc5-haaaa-aaaaa-aaahq-cai", "si2b5-pyaaa-aaaaa-aaaja-cai", "sp3hj-caaaa-aaaaa-aaajq-cai",
];
function newCanisterId() {
  if (freeIds.length) return freeIds.shift();
  const abc = "abcdefghijklmnopqrstuvwxyz234567";
  const pick = (n) => Array.from({ length: n }, () => abc[Math.floor(Math.random() * 32)]).join("");
  return pick(5) + "-" + pick(5) + "-aaaaa-aaa" + pick(2) + "-cai";
}

export const replica = {
  call(canisterId, method, caller, args) {
    const canister = canisters[canisterId];
    if (!canister) throw new Error("Call failed: canister " + canisterId + " was not found on the local replica");
    if (!canister[method]) throw new Error("Call failed: canister " + canisterId + " has no method " + method);
    return canister[method]({ caller }, ...args);
  },
};

// ---------------------------------------------------------------------------
// Pixel art drawn for the playground: 16 x 16 sprites turned into real PNG bytes
// ---------------------------------------------------------------------------
export const SPRITES = {
  cactus: { bg: "#f7e8c4", palette: { G: "#3fae5a", D: "#2b7a3f", Y: "#ffcf33", P: "#d0683e", p: "#9e4a2a" }, rows: [
    "................", ".......YY.......", "......GGGG......", "......GDGG......",
    "..GG..GGGG......", "..GG..GDGG..GG..", "..GD..GGGG..GG..", "..GGGGGGGG..DG..",
    "...GGGGDGGGGGG..", "......GGGGGGG...", "......GDGG......", "......GGGG......",
    "....PPPPPPPP....", "....pPPPPPPp....", ".....PPPPPP.....", ".....pppppp....." ] },
  ghost: { bg: "#2d2a55", palette: { W: "#f4f4ff", S: "#c9c9e8", K: "#1b1b2f", B: "#ff8fb1", M: "#ffe9a8" }, rows: [
    ".............MM.", "............MMM.", ".....WWWWW...M..", "....WWWWWWW.....",
    "...WWWWWWWWW....", "...WWKWWWKWW....", "...WWKWWWKWW....", "...WBWWWWWBW....",
    "...WWWWKWWWW....", "...WWWWWWWWW....", "...WWWWWWWWW....", "...SWWWWWWWS....",
    "...WSWWWWWSW....", "...W.WW.WW.W....", "................", "................" ] },
  rocket: { bg: "#bfe3ff", palette: { W: "#f2f4f8", G: "#a9b3c4", R: "#e8423f", B: "#3b6fd8", O: "#ff9b2f", Y: "#ffe14a" }, rows: [
    ".......RR.......", "......RRRR......", "......WWWW......", ".....WWWWWW.....",
    ".....WWBBWW.....", ".....WBBBBW.....", ".....WWBBWW.....", ".....WWWWWW.....",
    ".....WWWWWW.....", "....RWWWWWWR....", "...RRWWGGWWRR...", "...RR.GGGG.RR...",
    ".......OO.......", "......OYYO......", ".......YY.......", ".......O........" ] },
  frog: { bg: "#cdeccf", palette: { G: "#4caf50", D: "#2e7d32", W: "#ffffff", K: "#1d1d1d", R: "#e85a71", L: "#7cc576" }, rows: [
    "................", "...WWW....WWW...", "..WWKWW..WWKWW..", "..WWKWWGGWWKWW..",
    "..GWWWGGGGWWWG..", ".GGGGGGGGGGGGGG.", ".GGGGGGGGGGGGGG.", ".GKGGGGGGGGGGKG.",
    ".GGKKKKKKKKKKGG.", "..GGGRRRRRRGGG..", "..GGGGGGGGGGGG..", "..GLLLLLLLLLLG..",
    ".DGLLLLLLLLLLGD.", "DDGGLLLLLLLLGGDD", "DD..GGG..GGG..DD", "................" ] },
  mushroom: { bg: "#fff2d6", palette: { R: "#d93a3a", r: "#a82828", W: "#ffffff", S: "#f3dfc1", s: "#d9bf98", K: "#3a2a1a" }, rows: [
    "................", ".....RRRRRR.....", "...RRWWRRRRRR...", "..RRWWWRRRWWRR..",
    ".RRRWWRRRRWWWRR.", ".RRRRRRRRRRWWRR.", "RRWWRRRRRRRRRRRR", "RWWWWRRRRWWRRRRR",
    "rrWWrrrrrWWrrrrr", ".rrrrrrrrrrrrrr.", "....SSSSSSSS....", "....SSKSSKSS....",
    "....SSSSSSSS....", "....SSSssSSS....", "....sSSSSSSs....", ".....ssssss....." ] },
  robot: { bg: "#e3dcff", palette: { G: "#9aa5b8", D: "#5f6b80", C: "#47e0ff", R: "#ff5a5a", Y: "#ffd23f", K: "#2a2f3a" }, rows: [
    ".......Y........", ".......D........", "....GGGGGGGG....", "...GGGGGGGGGG...",
    "...GCCGGGGCCG...", "...GCCGGGGCCG...", "...GGGGGGGGGG...", "...GGKKKKKKGG...",
    "....GGGGGGGG....", ".....DDDDDD.....", "..GGGGGGGGGGGG..", ".DGGGRGGYGGGGGD.",
    ".DGGGGGGGGGGGGD.", ".D.GGGGGGGGGG.D.", "....DD....DD....", "...DDD....DDD..." ] },
};

const pngCache = new Map();
export function spritePNG(sprite) {
  if (!pngCache.has(sprite)) {
    pngCache.set(sprite, new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = sprite.bg;
      ctx.fillRect(0, 0, 16, 16);
      sprite.rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const colour = sprite.palette[row[x]];
          if (colour) {
            ctx.fillStyle = colour;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
      canvas.toBlob((blob) => blob.arrayBuffer().then((buffer) => resolve(Array.from(new Uint8Array(buffer)))), "image/png");
    }));
  }
  return pngCache.get(sprite);
}

// ---------------------------------------------------------------------------
// nft.mo: actor class NFT (name, owner, content). Each call creates a canister.
// ---------------------------------------------------------------------------
function NFT(name, owner, content, id) {
  const canisterId = id || newCanisterId();
  let nftOwner = owner;
  canisters[canisterId] = {
    getName: (msg) => name,
    getOwner: (msg) => nftOwner,
    getAsset: (msg) => content,
    getCanisterId: (msg) => canisterId,
    transferOwnership: (msg, newOwner) => {
      if (msg.caller === nftOwner) {
        nftOwner = newOwner;
        return "Success";
      }
      return "Error: Not initiated by NFT Owner.";
    },
  };
  return canisterId;
}

// ---------------------------------------------------------------------------
// main.mo: actor OpenD
// ---------------------------------------------------------------------------
const mapOfNFTs = new Map(); // NFT canister id -> the NFT canister
const mapOfOwners = new Map(); // owner -> ids of the NFTs they own, newest first (List.push)
const mapOfListings = new Map(); // NFT canister id -> { itemOwner, itemPrice }

function addToOwnershipMap(owner, nftId) {
  const ownedNFTs = mapOfOwners.get(owner) || [];
  mapOfOwners.set(owner, [nftId].concat(ownedNFTs));
}

canisters[OPEND_ID] = {
  mint: (msg, imgData, name) => {
    const owner = msg.caller;
    const newNFTPrincipal = NFT(name, owner, imgData);
    mapOfNFTs.set(newNFTPrincipal, canisters[newNFTPrincipal]);
    addToOwnershipMap(owner, newNFTPrincipal);
    return newNFTPrincipal;
  },
  getOwnedNFTs: (msg, user) => mapOfOwners.get(user) || [],
  listItem: (msg, id, price) => {
    const item = mapOfNFTs.get(id);
    if (!item) return "NFT does not exist.";
    const owner = item.getOwner(msg);
    if (owner === msg.caller) {
      mapOfListings.set(id, { itemOwner: owner, itemPrice: price });
      return "Success";
    }
    return "You don't own the NFT.";
  },
  getOpenDCanisterID: (msg) => OPEND_ID,
  isListed: (msg, id) => mapOfListings.has(id),
  getListedNFTs: (msg) => Array.from(mapOfListings.keys()),
  getOriginalOwner: (msg, id) => (mapOfListings.has(id) ? mapOfListings.get(id).itemOwner : "aaaaa-aa"),
  getListedNFTPrice: (msg, id) => (mapOfListings.has(id) ? mapOfListings.get(id).itemPrice : 0),
  completePurchase: (msg, id, ownerId, newOwnerId) => {
    const purchasedNFT = mapOfNFTs.get(id);
    if (!purchasedNFT) return "NFT does not exist";
    // an inter-canister call: OpenD, the NFT's owner while it is listed, is the caller
    const transferResult = purchasedNFT.transferOwnership({ caller: OPEND_ID }, newOwnerId);
    if (transferResult === "Success") {
      mapOfListings.delete(id);
      const ownedNFTs = (mapOfOwners.get(ownerId) || []).filter((listItemId) => listItemId !== id);
      mapOfOwners.set(ownerId, ownedNFTs);
      addToOwnershipMap(newOwnerId, id);
      return "Success";
    }
    return transferResult;
  },
};

// helpers for the seed below: the same steps as minting and listing for real
function seedMint(owner, name, sprite) {
  return canisters[OPEND_ID].mint({ caller: owner }, spritePNG(SPRITES[sprite]), name);
}
function seedList(owner, id, price) {
  canisters[OPEND_ID].listItem({ caller: owner }, id, price);
  canisters[id].transferOwnership({ caller: owner }, OPEND_ID);
}
` + (withToken ? TOKEN_CANISTER : '') + raw`
// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
` + SEEDS[seed];
}

/* ---- images: drawn as SVG for the playground ---- */
const IMAGES = raw`// The course imports logo.png and home-img.png. Image files can't be imported
// in the playground, so these are SVG pictures drawn in code, as data URLs.
import { SPRITES } from "../replica";

const svg = (markup) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);

// a 16 x 16 sprite as SVG: one path per colour, each pixel a 1 x 1 square
function sprite(s, x, y, size, angle) {
  const paths = {};
  s.rows.forEach((row, py) => {
    for (let px = 0; px < row.length; px++) {
      const colour = s.palette[row[px]];
      if (colour) paths[colour] = (paths[colour] || "") + "M" + px + " " + py + "h1v1h-1z";
    }
  });
  return '<g transform="translate(' + x + " " + y + ") rotate(" + angle + ") scale(" + size / 16 + ')">' +
    '<rect width="16" height="16" fill="' + s.bg + '"/>' +
    Object.keys(paths).map((c) => '<path fill="' + c + '" d="' + paths[c] + '"/>').join("") + "</g>";
}

function card(s, x, y, angle, name, subtitle) {
  return '<g transform="translate(' + x + " " + y + ") rotate(" + angle + ')">' +
    '<rect x="-8" y="-8" width="176" height="226" rx="16" fill="#23262f"/>' +
    sprite(s, 0, 0, 160, 0) +
    '<text x="4" y="186" fill="#fcfcfd" font-size="15" font-weight="700">' + name + "</text>" +
    '<text x="4" y="206" fill="#777e90" font-size="13">' + subtitle + "</text></g>";
}

export const logo = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b61ff"/><stop offset="1" stop-color="#3fd0c9"/></linearGradient></defs>' +
  '<rect x="2" y="2" width="36" height="36" rx="10" fill="url(#g)"/>' +
  '<path d="M20 8 L31 20 L20 32 L9 20 Z" fill="#141416" opacity=".85"/>' +
  '<path d="M20 14 L25 20 L20 26 L15 20 Z" fill="#fcfcfd"/></svg>'
);

export const homeImage = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 380" shape-rendering="crispEdges" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">' +
  '<rect width="900" height="380" fill="#141416"/>' +
  '<text x="40" y="96" fill="#777e90" font-size="14" font-weight="700" letter-spacing="2">OPEND · NFT MARKETPLACE</text>' +
  '<text x="40" y="150" fill="#fcfcfd" font-size="44" font-weight="700">Mint, collect and</text>' +
  '<text x="40" y="200" fill="#fcfcfd" font-size="44" font-weight="700">trade pixel art.</text>' +
  '<text x="40" y="244" fill="#b1b5c4" font-size="18">Every NFT here is its own canister</text>' +
  '<text x="40" y="270" fill="#b1b5c4" font-size="18">on the Internet Computer.</text>' +
  '<text x="40" y="322" fill="#8b8fe8" font-size="16" font-weight="700">Open the Minter to make your first one.</text>' +
  card(SPRITES.ghost, 520, 92, -8, "Moon Ghost", "pixel art") +
  card(SPRITES.rocket, 680, 64, 6, "Tiny Rocket", "pixel art") +
  "</svg>"
);
`;

/* ---- styles: a dark marketplace look, written for the playground ---- */
const OPEND_CSS = raw`/* OpenD's dark marketplace look, written for the playground.
   The class names come from the course's markup. */
body {
  margin: 0;
  padding-bottom: 70px;
  background: #141416;
  color: #fcfcfd;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

[hidden] {
  display: none !important;
}

.App {
  text-align: center;
}

h1 {
  margin: 48px 0;
}

/* header */
.AppBar-root {
  background: #141416;
  border-bottom: 1px solid #353945;
}

.Toolbar-root {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 64px;
  padding: 0 24px;
}

.header-logo-11 {
  width: 36px;
  height: 36px;
}

.header-vertical-9 {
  width: 1px;
  height: 28px;
  margin: 0 10px;
  background: #353945;
}

.header-logo-text {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.header-empty-6 {
  flex: 1;
}

.Button-root {
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: #b1b5c4;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}

.Button-root:hover {
  background: #23262f;
  color: #fcfcfd;
}

/* home */
.bottom-space {
  display: block;
  width: 100%;
  max-width: 900px;
  margin: 24px auto 8px;
}

/* galleries and cards */
.gallery-view {
  padding: 24px 16px 8px;
}

.Typography-h3 {
  margin: 12px 0 24px;
  font-size: 34px;
  font-weight: 700;
}

.disGrid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.disGrid-item {
  display: inline-block;
  vertical-align: top;
}

.disCard-root {
  position: relative;
  width: 240px;
  margin: 12px;
  overflow: hidden;
  border-radius: 16px;
  background: #23262f;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  text-align: left;
}

.disCardMedia-img {
  display: block;
  width: 100%;
  height: 240px;
  object-fit: cover;
  image-rendering: pixelated;
  background: #2c2f3a;
  transition: filter 0.3s;
}

.disCardMedia-img:not([src]) {
  visibility: hidden; /* still loading: no broken-image border */
}

.disCardContent-root {
  padding: 14px 16px 18px;
}

.disTypography-h5 {
  margin: 0 0 8px;
  font-size: 17px;
}

.disTypography-body2 {
  margin: 0;
  color: #9aa0b4;
  font-size: 11.5px;
  word-break: break-all;
}

.purple-text {
  color: #8b8fe8;
}

.price-input {
  box-sizing: border-box;
  width: 100%;
  margin-top: 12px;
  padding: 8px 10px;
  border: 2px solid #353945;
  border-radius: 10px;
  background: #141416;
  color: #fcfcfd;
  font-size: 14px;
}

.Chip-root,
.form-Chip-root {
  display: inline-flex;
  margin-top: 12px;
  border-radius: 999px;
  background: #5f64b5;
  cursor: pointer;
}

.Chip-root:hover,
.form-Chip-root:hover {
  background: #7378d6;
}

.form-Chip-label {
  display: inline-block;
  padding: 9px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  user-select: none;
}

.disChip-outlined {
  display: inline-block;
  margin-bottom: 8px;
  border: 2px solid #45b26b;
  border-radius: 6px;
}

.disChip-label {
  display: inline-block;
  padding: 2px 8px;
  color: #45b26b;
  font-size: 12px;
  font-weight: 700;
}

.horizontal-center {
  display: flex;
  justify-content: center;
}

/* minter */
.minter-container {
  position: relative;
  max-width: 520px;
  margin: 32px auto;
  padding: 0 24px;
  text-align: left;
}

.form-Typography-subtitle1 {
  margin: 18px 0 8px;
  color: #b1b5c4;
  font-size: 14px;
  font-weight: 600;
}

.upload-container {
  padding: 18px;
  border: 2px dashed #353945;
  border-radius: 12px;
}

.upload {
  color: #b1b5c4;
}

.form-InputBase-input {
  box-sizing: border-box;
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #353945;
  border-radius: 12px;
  background: #141416;
  color: #fcfcfd;
  font-size: 15px;
}

.PrivateNotchedOutline-root-60 {
  display: none;
}

/* loader: four pulsing dots */
.lds-ellipsis {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
}

.lds-ellipsis div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8b8fe8;
  animation: lds-pulse 0.9s infinite ease-in-out;
}

.lds-ellipsis div:nth-child(2) {
  animation-delay: 0.15s;
}

.lds-ellipsis div:nth-child(3) {
  animation-delay: 0.3s;
}

.lds-ellipsis div:nth-child(4) {
  animation-delay: 0.45s;
}

.disCard-root .lds-ellipsis {
  position: absolute;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(20, 20, 22, 0.75);
}

@keyframes lds-pulse {
  0%, 80%, 100% {
    transform: scale(0.4);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* footer */
#footer {
  margin-top: 40px;
  padding: 24px;
  border-top: 1px solid #353945;
  color: #777e90;
  font-size: 13px;
}

.footer-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

/* the playground helper bar */
.playground-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-top: 1px solid #353945;
  background: #23262f;
  color: #b1b5c4;
  font-size: 12.5px;
  text-align: left;
}

.playground-bar button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border: 1px solid #353945;
  border-radius: 8px;
  background: #141416;
  color: #fcfcfd;
  font-size: 12px;
  cursor: pointer;
}

.playground-bar img {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  image-rendering: pixelated;
}

.playground-bar code {
  padding: 1px 5px;
  border-radius: 4px;
  background: #141416;
  color: #fcfcfd;
  user-select: all;
}
`;

/* ---- helper bars (playground only) ---- */
const BAR_SAMPLES = raw`// Playground helper, not part of the course project.
// It drops one of the playground's pixel-art images into the Minter's file
// input, so you don't need image files of your own (any PNG or JPG works too).
import React, { useEffect, useState } from "react";
import { SPRITES, spritePNG } from "../replica";

function PlaygroundBar() {
  const [thumbs, setThumbs] = useState({});
  const [message, setMessage] = useState("Sample images for the Minter:");

  useEffect(() => {
    Object.keys(SPRITES).forEach((key) => {
      spritePNG(SPRITES[key]).then((bytes) => {
        const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "image/png" }));
        setThumbs((old) => Object.assign({}, old, { [key]: url }));
      });
    });
  }, []);

  async function pickSample(key) {
    const input = document.querySelector("input.upload");
    if (!input) {
      setMessage("Open the Minter first, then pick an image:");
      return;
    }
    const bytes = await spritePNG(SPRITES[key]);
    const list = new DataTransfer();
    list.items.add(new File([new Uint8Array(bytes)], key + ".png", { type: "image/png" }));
    input.files = list.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    setMessage(key + ".png (" + bytes.length + " bytes) is in the file input. Type a name and press Mint NFT:");
  }

  return (
    <div className="playground-bar">
      <span>{message}</span>
      {Object.keys(SPRITES).map((key) => (
        <button key={key} onClick={() => pickSample(key)}>
          {thumbs[key] && <img src={thumbs[key]} alt="" />}
          {key}
        </button>
      ))}
    </div>
  );
}

export default PlaygroundBar;
`;

const BAR_WALLET = raw`// Playground helper, not part of the course project.
// It shows what you would check in the token-local front end on localhost:8081
// (your DANG balance), the id "dfx canister id token" prints, and sample images
// for the Minter.
import React, { useEffect, useState } from "react";
import { SPRITES, spritePNG, dangBalance, ANONYMOUS, TOKEN_ID } from "../replica";

function PlaygroundBar() {
  const [balance, setBalance] = useState(dangBalance(ANONYMOUS));

  useEffect(() => {
    const timer = setInterval(() => setBalance(dangBalance(ANONYMOUS)), 400);
    return () => clearInterval(timer);
  }, []);

  async function pickSample(key) {
    const input = document.querySelector("input.upload");
    if (!input) return;
    const bytes = await spritePNG(SPRITES[key]);
    const list = new DataTransfer();
    list.items.add(new File([new Uint8Array(bytes)], key + ".png", { type: "image/png" }));
    input.files = list.files;
  }

  return (
    <div className="playground-bar">
      <span>Your balance: <b>{balance.toLocaleString()} DANG</b></span>
      <span>· token canister id: <code>{TOKEN_ID}</code></span>
      <span>· sample image for the Minter:</span>
      {Object.keys(SPRITES).map((key) => (
        <button key={key} onClick={() => pickSample(key)}>{key}</button>
      ))}
    </div>
  );
}

export default PlaygroundBar;
`;

/* ---- entry ---- */
const INDEX = raw`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
// In your dfx project: import { Principal } from "@dfinity/principal";
import { Principal } from "./packages/@dfinity/principal";

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

const init = async () => {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
};

init();
`;

/* ---- App ---- */
const APP_361_START = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { homeImage } from "../assets/images";
// TODO 1: import Item from "./Item";

function App() {
  // TODO 1: the NFT minted from the terminal lives in canister "` + CLI_NFT_ID + raw`"
  //         (that is what "dfx canister id nft" prints). Keep it in a constant nftId
  //         and render <Item id={nftId} /> instead of the home image.

  return (
    <div className="App">
      <Header />
      <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;
`;

const APP_361_DONE = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { homeImage } from "../assets/images";
import Item from "./Item";

function App() {
  const nftId = "` + CLI_NFT_ID + raw`";

  return (
    <div className="App">
      <Header />
      {/* <img className="bottom-space" src={homeImage} /> */}
      <Item id={nftId} />
      <Footer />
    </div>
  );
}

export default App;
`;

const APP_362_START = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { homeImage } from "../assets/images";
import Item from "./Item";
import PlaygroundBar from "./PlaygroundBar";
// TODO 1: import Minter from "./Minter";

function App() {
  const nftId = "` + CLI_NFT_ID + raw`";

  return (
    <div className="App">
      <Header />
      {/* <img className="bottom-space" src={homeImage} /> */}
      {/* TODO 1: comment out the Item and render <Minter /> instead */}
      <Item id={nftId} />
      <Footer />
      {/* playground helper: sample images for the Minter */}
      <PlaygroundBar />
    </div>
  );
}

export default App;
`;

const APP_362_DONE = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { homeImage } from "../assets/images";
import Item from "./Item";
import PlaygroundBar from "./PlaygroundBar";
import Minter from "./Minter";

function App() {
  const nftId = "` + CLI_NFT_ID + raw`";

  return (
    <div className="App">
      <Header />
      {/* <img className="bottom-space" src={homeImage} /> */}
      {/* <Item id={nftId} /> */}
      <Minter />
      <Footer />
      {/* playground helper: sample images for the Minter */}
      <PlaygroundBar />
    </div>
  );
}

export default App;
`;

const APP_363_START = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import PlaygroundBar from "./PlaygroundBar";
import Minter from "./Minter";

// TODO 1: the pages move into Header, so App keeps only Header and Footer
//         (and the playground bar). Remove <Minter /> and its import.
function App() {
  return (
    <div className="App">
      <Header />
      <Minter />
      <Footer />
      {/* playground helper: sample images for the Minter */}
      <PlaygroundBar />
    </div>
  );
}

export default App;
`;

const APP = raw`import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import PlaygroundBar from "./PlaygroundBar";

function App() {
  return (
    <div className="App">
      <Header />
      <Footer />
      {/* playground helper */}
      <PlaygroundBar />
    </div>
  );
}

export default App;
`;

/* ---- Footer ---- */
const FOOTER = raw`import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div id="footer">
      <footer>
        {/* The course lays this out with react-bootstrap's Container, Row and Col */}
        <div className="footer-row">
          <div>
            <p>
              A marketplace on the Internet Computer for minting, collecting
              and trading non-fungible tokens.
            </p>
          </div>
          <div>
            <p>Copyright ⓒ {year}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
`;

/* ---- Header ---- */
const HEADER_STATIC = raw`import React from "react";
import { logo } from "../assets/images";

function Header() {
  return (
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <h5 className="Typography-root header-logo-text">OpenD</h5>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            Discover
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            Minter
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            My NFTs
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
`;

const HEADER_363_START = raw`import React from "react";
import { logo, homeImage } from "../assets/images";
import Minter from "./Minter";
// TODO 4: import Gallery from "./Gallery";
//         import { opend } from "../../../declarations/opend";
//         import CURRENT_USER_ID from "../index";

// react-router-dom isn't available in the playground. Instead, keep the page in
// state: "/" (home), "/discover", "/minter" or "/collection", the same paths the
// course's <Link to="..."> and <Route path="..."> use.
function Header() {
  // TODO 2: const [page, setPage] = useState("/");   (import useState and useEffect)
  // TODO 4: const [userOwnedGallery, setOwnedGallery] = useState();

  // TODO 4: async function getNFTs() {
  //   const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
  //   console.log(userNFTIds);
  //   setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} />);
  // }
  // and run it once: useEffect(() => { getNFTs(); }, []);

  // TODO 3: async function go(path) { setPage(""); await getNFTs(); setPage(path); }
  //   Like the course's forceRefresh={true}: the page goes blank, the data is
  //   fetched again, then the new page appears.

  return (
    <div>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            {/* TODO 3: clicking the title goes home: onClick={() => go("/")} */}
            <h5 className="Typography-root header-logo-text">OpenD</h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            {/* TODO 3: an onClick on each button: "/discover", "/minter", "/collection" */}
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              Discover
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              Minter
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              My NFTs
            </button>
          </div>
        </header>
      </div>
      {/* TODO 2: show the part that matches the page (this replaces <Switch> and its <Route>s):
            "/"           → <img className="bottom-space" src={homeImage} />
            "/discover"   → <h1>Discover</h1>
            "/minter"     → <Minter />
            "/collection" → {userOwnedGallery}
          e.g. {page == "/minter" && <Minter />} */}
    </div>
  );
}

export default Header;
`;

const HEADER_363_DONE = raw`import React, { useEffect, useState } from "react";
import { logo, homeImage } from "../assets/images";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

// react-router-dom isn't available in the playground. Instead, keep the page in
// state: "/" (home), "/discover", "/minter" or "/collection", the same paths the
// course's <Link to="..."> and <Route path="..."> use.
function Header() {
  const [page, setPage] = useState("/");
  const [userOwnedGallery, setOwnedGallery] = useState();

  async function getNFTs() {
    const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} />);
  }

  useEffect(() => {
    getNFTs();
  }, []);

  // stands in for a <Link> with forceRefresh={true}: the page goes blank,
  // the data is fetched again, then the new page appears
  async function go(path) {
    setPage("");
    await getNFTs();
    setPage(path);
  }

  return (
    <div>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <h5 className="Typography-root header-logo-text" onClick={() => go("/")}>OpenD</h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3" onClick={() => go("/discover")}>
              Discover
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3" onClick={() => go("/minter")}>
              Minter
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3" onClick={() => go("/collection")}>
              My NFTs
            </button>
          </div>
        </header>
      </div>
      {page == "/" && <img className="bottom-space" src={homeImage} />}
      {page == "/discover" && <h1>Discover</h1>}
      {page == "/minter" && <Minter />}
      {page == "/collection" && userOwnedGallery}
    </div>
  );
}

export default Header;
`;

const HEADER_366_START = HEADER_363_DONE
  .replace('  const [userOwnedGallery, setOwnedGallery] = useState();\n', '  const [userOwnedGallery, setOwnedGallery] = useState();\n  // TODO 1: const [listingGallery, setListingGallery] = useState();\n')
  .replace('    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} />);\n', '    // TODO 1: add role="collection" to this Gallery\n    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} />);\n\n    // TODO 1: const listedNFTIds = await opend.getListedNFTs();\n    //         console.log(listedNFTIds);\n    //         setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover" />);\n')
  .replace('      {page == "/discover" && <h1>Discover</h1>}\n', '      {/* TODO 1: show {listingGallery} instead of the heading */}\n      {page == "/discover" && <h1>Discover</h1>}\n');

const HEADER_366_DONE = HEADER_363_DONE
  .replace('  const [userOwnedGallery, setOwnedGallery] = useState();\n', '  const [userOwnedGallery, setOwnedGallery] = useState();\n  const [listingGallery, setListingGallery] = useState();\n')
  .replace('    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} />);\n', '    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection" />);\n\n    const listedNFTIds = await opend.getListedNFTs();\n    console.log(listedNFTIds);\n    setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover" />);\n')
  .replace('      {page == "/discover" && <h1>Discover</h1>}\n', '      {page == "/discover" && listingGallery}\n');

/* the course's own router version, shown read-only in the 363 notes */
const HEADER_ROUTER = raw`import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
// ...
  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Switch>
        <Route exact path="/">
          <img className="bottom-space" src={homeImage} />
        </Route>
        <Route path="/discover">
          <h1>Discover</h1>
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collection">
          {userOwnedGallery}
        </Route>
      </Switch>
    </BrowserRouter>
  );`;

/* ---- Gallery ---- */
const GALLERY_363_START = raw`import React from "react";
import Item from "./Item";

function Gallery(props) {
  // TODO 5: const [items, setItems] = useState();   (import useState and useEffect)

  // TODO 5: function fetchNFTs() {
  //   if (props.ids != undefined) {
  //     setItems(props.ids.map((NFTId) => <Item id={NFTId} key={NFTId.toText()} />));
  //   }
  // }
  // and run it once with useEffect(() => { fetchNFTs(); }, []);

  return (
    <div className="gallery-view">
      {/* TODO 5: {props.title} instead of a fixed heading */}
      <h3 className="makeStyles-title-99 Typography-h3">Discover</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {/* TODO 5: {items} goes here, inside the innermost grid */}
          </div>
          <Item />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
`;

const GALLERY_363_DONE = raw`import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {
  const [items, setItems] = useState();

  function fetchNFTs() {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTId) => (
          <Item id={NFTId} key={NFTId.toText()} />
        ))
      );
    }
  }

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
`;

const GALLERY_366_START = GALLERY_363_DONE.replace('          <Item id={NFTId} key={NFTId.toText()} />\n', '          // TODO 2: pass the gallery\'s role on to each Item: role={props.role}\n          <Item id={NFTId} key={NFTId.toText()} />\n');
const GALLERY_366_DONE = GALLERY_363_DONE.replace('          <Item id={NFTId} key={NFTId.toText()} />\n', '          <Item id={NFTId} key={NFTId.toText()} role={props.role} />\n');

/* ---- Minter ---- */
const MINTER_START = raw`import React from "react";
// The playground can't install npm packages, so useForm comes from a stand-in.
// In your dfx project: import { useForm } from "react-hook-form";
import { useForm } from "../packages/react-hook-form";
// TODO 4: import { opend } from "../../../declarations/opend";
// TODO 5: import Item from "./Item";

function Minter() {
  // TODO 2: const { register, handleSubmit } = useForm();
  // TODO 5: const [nftPrincipal, setNFTPrincipal] = useState("");   (import useState)
  // TODO 6: const [loaderHidden, setLoaderHidden] = useState(true);

  // TODO 2: async function onSubmit(data) { console.log(data.name); console.log(data.image); }
  // TODO 3:   const name = data.name;
  //           const image = data.image[0];
  //           const imageArray = await image.arrayBuffer();
  //           const imageByteData = [...new Uint8Array(imageArray)];
  // TODO 4:   const newNFTID = await opend.mint(imageByteData, name);
  //           console.log(newNFTID.toText());
  // TODO 5:   setNFTPrincipal(newNFTID);

  // TODO 5: once an NFT is minted, return this instead of the form:
  //   <div className="minter-container">
  //     <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
  //       Minted!
  //     </h3>
  //     <div className="horizontal-center">
  //       <Item id={nftPrincipal.toText()} />
  //     </div>
  //   </div>

  return (
    <div className="minter-container">
      {/* TODO 6: the loader goes here, above the heading:
          <div hidden={loaderHidden} className="lds-ellipsis">
            <div></div><div></div><div></div><div></div>
          </div> */}
      <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Create NFT
      </h3>
      <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
        Upload Image
      </h6>
      <form className="makeStyles-form-109" autoComplete="off">
        <div className="upload-container">
          <input
            /* TODO 2: {...register("image", { required: true })} */
            className="upload"
            type="file"
            accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
          />
        </div>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Collection Name
        </h6>
        <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
          <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
            <input
              /* TODO 2: {...register("name", { required: true })} */
              placeholder="e.g. PixelPals"
              type="text"
              className="form-InputBase-input form-OutlinedInput-input"
            />
            <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
          </div>
        </div>
        <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
          {/* TODO 2: onClick={handleSubmit(onSubmit)} on this span */}
          <span className="form-Chip-label">Mint NFT</span>
        </div>
      </form>
    </div>
  );
}

export default Minter;
`;

const MINTER_DONE = raw`import React, { useState } from "react";
// In your dfx project: import { useForm } from "react-hook-form";
import { useForm } from "../packages/react-hook-form";
import { opend } from "../../../declarations/opend";
import Item from "./Item";

function Minter() {
  const { register, handleSubmit } = useForm();
  const [nftPrincipal, setNFTPrincipal] = useState("");
  const [loaderHidden, setLoaderHidden] = useState(true);

  async function onSubmit(data) {
    setLoaderHidden(false);
    const name = data.name;
    const image = data.image[0];
    const imageArray = await image.arrayBuffer();
    const imageByteData = [...new Uint8Array(imageArray)];

    const newNFTID = await opend.mint(imageByteData, name);
    console.log(newNFTID.toText());
    setNFTPrincipal(newNFTID);
    setLoaderHidden(true);
  }

  if (nftPrincipal == "") {
    return (
      <div className="minter-container">
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. PixelPals"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">
              Mint NFT
            </span>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item id={nftPrincipal.toText()} />
        </div>
      </div>
    );
  }
}

export default Minter;
`;

/* ---- Button and PriceLabel ---- */
const BUTTON_START = raw`import React from "react";

function Button(props) {
  // TODO 1: return the course's chip button, wired to the props:
  //   <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
  //     <span onClick={props.handleClick} className="form-Chip-label">
  //       {props.text}
  //     </span>
  //   </div>
  return null;
}

export default Button;
`;

const BUTTON_DONE = raw`import React from "react";

function Button(props) {
  return (
    <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
      <span onClick={props.handleClick} className="form-Chip-label">
        {props.text}
      </span>
    </div>
  );
}

export default Button;
`;

const PRICE_START = raw`import React from "react";

function PriceLabel(props) {
  // TODO 5: return the label, showing the price passed in as props.sellPrice:
  //   <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
  //     <span className="disChip-label">{props.sellPrice} DANG</span>
  //   </div>
  return null;
}

export default PriceLabel;
`;

const PRICE_DONE = raw`import React from "react";

function PriceLabel(props) {
  return (
    <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
      <span className="disChip-label">{props.sellPrice} DANG</span>
    </div>
  );
}

export default PriceLabel;
`;

/* ---- Item: one version per lecture ---- */
const ITEM_IMPORTS_NOTE = raw`// The playground can't install npm packages, so these two come from stand-ins.
// In your dfx project: import { Actor, HttpAgent } from "@dfinity/agent";
//                      import { Principal } from "@dfinity/principal";
`;

const ITEM_CARD_END = raw`          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>`;

const ITEM_361_START = raw`import React from "react";
import { logo } from "../assets/images";
` + ITEM_IMPORTS_NOTE + raw`import { Actor, HttpAgent } from "../packages/@dfinity/agent";
import { Principal } from "../packages/@dfinity/principal";
// TODO 2: import { idlFactory } from "../../../declarations/nft";

function Item(props) {
  // TODO 2: state for name, owner and image: useState()   (import useState and useEffect)

  // TODO 3: the canister id arrives as text in props.id. Make it a Principal:
  //   const id = Principal.fromText(props.id);
  // and create the agent that talks to the local replica:
  //   const localHost = "http://localhost:8080/";
  //   const agent = new HttpAgent({ host: localHost });

  // TODO 4: async function loadNFT() {
  //   const NFTActor = await Actor.createActor(idlFactory, { agent, canisterId: id });
  //   then await NFTActor.getName() and store it.            (TODO 5: getOwner too)
  //   TODO 6: the image: await NFTActor.getAsset() gives bytes. Wrap them in a
  //   new Uint8Array(...), make new Blob([imageContent.buffer], { type: "image/png" })
  //   and turn that into a URL for the img with URL.createObjectURL(blob).
  // }

  // TODO 6: run loadNFT() once, after the first render: useEffect(() => { ... }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logo}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            PixelPals #000<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: aaaaa-bbbbb-ccccc
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
`;

const ITEM_361_DONE = raw`import React, { useEffect, useState } from "react";
` + ITEM_IMPORTS_NOTE + raw`import { Actor, HttpAgent } from "../packages/@dfinity/agent";
import { Principal } from "../packages/@dfinity/principal";
import { idlFactory } from "../../../declarations/nft";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();

  const id = Principal.fromText(props.id);

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });

  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
` + ITEM_CARD_END + raw`
        </div>
      </div>
    </div>
  );
}

export default Item;
`;

const ITEM_363_START = ITEM_361_DONE.replace('  const id = Principal.fromText(props.id);\n',
  '  // TODO 6: ids from the Gallery are Principals already, so use props.id as it is:\n  //         const id = props.id;\n  const id = Principal.fromText(props.id);\n');
const ITEM_363_DONE = ITEM_361_DONE.replace('  const id = Principal.fromText(props.id);\n', '  const id = props.id;\n');

const ITEM_364_START = raw`import React, { useEffect, useState } from "react";
` + ITEM_IMPORTS_NOTE + raw`import { Actor, HttpAgent } from "../packages/@dfinity/agent";
import { Principal } from "../packages/@dfinity/principal";
import { idlFactory } from "../../../declarations/nft";
// TODO 2: import Button from "./Button";
// TODO 4: import { opend } from "../../../declarations/opend";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  // TODO 2: state for button and priceInput

  const id = props.id;

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  // TODO 6: if the transfer fails with "Fail to verify certificate", call
  //         agent.fetchRootKey(); here (local replica only: remove it before going live)

  // TODO 5: declare  let NFTActor;  here and assign it in loadNFT (drop the const)
  //         so that sellItem can use the same actor

  async function loadNFT() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    // TODO 2: setButton(<Button handleClick={handleSell} text={"Sell"} />);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  // TODO 3: let price;
  //         function handleSell() {
  //           console.log("Sell clicked");
  //           setPriceInput(<input placeholder="Price in DANG" type="number" className="price-input"
  //                                value={price} onChange={(e) => (price = e.target.value)} />);
  //           setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  //         }

  // TODO 4: async function sellItem() {
  //           const listingResult = await opend.listItem(props.id, Number(price));
  //           console.log("listing: " + listingResult);
  //           TODO 5: if it worked, get OpenD's id with opend.getOpenDCanisterID()
  //                   and await NFTActor.transferOwnership(openDId); log the result
  //         }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
` + ITEM_CARD_END + raw`
          {/* TODO 2: {priceInput} and {button} go here */}
        </div>
      </div>
    </div>
  );
}

export default Item;
`;

const ITEM_364_DONE = raw`import React, { useEffect, useState } from "react";
` + ITEM_IMPORTS_NOTE + raw`import { Actor, HttpAgent } from "../packages/@dfinity/agent";
import { Principal } from "../packages/@dfinity/principal";
import { idlFactory } from "../../../declarations/nft";
import Button from "./Button";
import { opend } from "../../../declarations/opend";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  const id = props.id;

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  // TODO: remove the next line before deploying to the live network
  agent.fetchRootKey();

  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    setButton(<Button handleClick={handleSell} text={"Sell"} />);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    console.log("Sell clicked");
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    console.log("set price = " + price);
    const listingResult = await opend.listItem(props.id, Number(price));
    console.log("listing: " + listingResult);
    if (listingResult == "Success") {
      const openDId = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      console.log("transfer: " + transferResult);
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
` + ITEM_CARD_END + raw`
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
`;

const ITEM_365_START = ITEM_364_DONE
  .replace('  const [priceInput, setPriceInput] = useState();\n', '  const [priceInput, setPriceInput] = useState();\n  // TODO 1: const [loaderHidden, setLoaderHidden] = useState(true);\n  // TODO 2: const [blur, setBlur] = useState();\n  // TODO 4: const [sellStatus, setSellStatus] = useState("");\n')
  .replace('    setButton(<Button handleClick={handleSell} text={"Sell"} />);\n  }\n', '    // TODO 5: first ask the canister: const nftIsListed = await opend.isListed(props.id);\n    //         if it is listed: owner "OpenD", the blur and "Listed"; otherwise the Sell button\n    setButton(<Button handleClick={handleSell} text={"Sell"} />);\n  }\n')
  .replace('  async function sellItem() {\n', '  async function sellItem() {\n    // TODO 2: setBlur({ filter: "blur(4px)" });\n    // TODO 1: show the loader\n')
  .replace('      console.log("transfer: " + transferResult);\n', '      console.log("transfer: " + transferResult);\n      // TODO 3: if (transferResult == "Success") { hide the loader; setButton(); setPriceInput(); setOwner("OpenD"); }\n      // TODO 4: ... and setSellStatus("Listed");\n')
  .replace('          src={image}\n        />\n', '          src={image}\n          /* TODO 2: style={blur} */\n        />\n        {/* TODO 1: the loader, hidden={loaderHidden}:\n            <div className="lds-ellipsis" hidden={loaderHidden}>\n              <div></div><div></div><div></div><div></div>\n            </div> */}\n')
  .replace('            <span className="purple-text"></span>\n', '            {/* TODO 4: {sellStatus} inside the span, after a space */}\n            <span className="purple-text"></span>\n');

const ITEM_365_DONE = raw`import React, { useEffect, useState } from "react";
` + ITEM_IMPORTS_NOTE + raw`import { Actor, HttpAgent } from "../packages/@dfinity/agent";
import { Principal } from "../packages/@dfinity/principal";
import { idlFactory } from "../../../declarations/nft";
import Button from "./Button";
import { opend } from "../../../declarations/opend";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");

  const id = props.id;

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  // TODO: remove the next line before deploying to the live network
  agent.fetchRootKey();

  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name = await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], { type: "image/png" })
    );

    setName(name);
    setOwner(owner.toText());
    setImage(image);

    const nftIsListed = await opend.isListed(props.id);
    if (nftIsListed) {
      setOwner("OpenD");
      setBlur({ filter: "blur(4px)" });
      setSellStatus("Listed");
    } else {
      setButton(<Button handleClick={handleSell} text={"Sell"} />);
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    console.log("Sell clicked");
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    console.log("set price = " + price);
    const listingResult = await opend.listItem(props.id, Number(price));
    console.log("listing: " + listingResult);
    if (listingResult == "Success") {
      const openDId = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      console.log("transfer: " + transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"> {sellStatus}</span>
          </h2>
` + ITEM_CARD_END + raw`
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
`;

const LOAD_365 = raw`    const nftIsListed = await opend.isListed(props.id);
    if (nftIsListed) {
      setOwner("OpenD");
      setBlur({ filter: "blur(4px)" });
      setSellStatus("Listed");
    } else {
      setButton(<Button handleClick={handleSell} text={"Sell"} />);
    }
  }
`;

const LOAD_366 = raw`    if (props.role == "collection") {
      const nftIsListed = await opend.isListed(props.id);
      if (nftIsListed) {
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role == "discover") {
      const originalOwner = await opend.getOriginalOwner(props.id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
    }
  }
`;

const ITEM_366_START = ITEM_365_DONE
  .replace('import { opend } from "../../../declarations/opend";\n', 'import { opend } from "../../../declarations/opend";\n// TODO 4: import CURRENT_USER_ID from "../index";\n// TODO 5: import PriceLabel from "./PriceLabel";\n')
  .replace('  const [sellStatus, setSellStatus] = useState("");\n', '  const [sellStatus, setSellStatus] = useState("");\n  // TODO 5: const [priceLabel, setPriceLabel] = useState();\n')
  .replace(LOAD_365, raw`    // TODO 3: keep this listing check and Sell button for  props.role == "collection"
    //         and add  else if (props.role == "discover") { a Buy button with handleBuy }
    // TODO 4: on Discover, only offer Buy when the NFT's original owner is someone else:
    //         const originalOwner = await opend.getOriginalOwner(props.id);
    //         if (originalOwner.toText() != CURRENT_USER_ID.toText()) { ... }
    // TODO 5: on Discover, also: const price = await opend.getListedNFTPrice(props.id);
    //         setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
` + LOAD_365 + raw`
  // TODO 3: async function handleBuy() { console.log("Buy was triggered"); }
`)
  .replace('        <div className="disCardContent-root">\n          <h2', '        <div className="disCardContent-root">\n          {/* TODO 5: {priceLabel} goes here, above the name */}\n          <h2');

const ITEM_366_DONE = ITEM_365_DONE
  .replace('import { opend } from "../../../declarations/opend";\n', 'import { opend } from "../../../declarations/opend";\nimport CURRENT_USER_ID from "../index";\nimport PriceLabel from "./PriceLabel";\n')
  .replace('  const [sellStatus, setSellStatus] = useState("");\n', '  const [sellStatus, setSellStatus] = useState("");\n  const [priceLabel, setPriceLabel] = useState();\n')
  .replace(LOAD_365, LOAD_366 + raw`
  async function handleBuy() {
    console.log("Buy was triggered");
  }
`)
  .replace('        <div className="disCardContent-root">\n          <h2', '        <div className="disCardContent-root">\n          {priceLabel}\n          <h2');

const BUY_367 = raw`  async function handleBuy() {
    console.log("Buy was triggered");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("` + TOKEN_ID + raw`"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    console.log("payment: " + result);
    if (result == "Success") {
      const transferResult = await opend.completePurchase(
        props.id,
        sellerId,
        CURRENT_USER_ID
      );
      console.log("purchase: " + transferResult);
      setLoaderHidden(true);
      setDisplay(false);
    }
  }
`;

const ITEM_367_START = ITEM_366_DONE
  .replace('import { idlFactory } from "../../../declarations/nft";\n', 'import { idlFactory } from "../../../declarations/nft";\n// TODO 1: import { idlFactory as tokenIdlFactory } from "../../../declarations/token";\n')
  .replace('  const [priceLabel, setPriceLabel] = useState();\n', '  const [priceLabel, setPriceLabel] = useState();\n  // TODO 5: const [shouldDisplay, setDisplay] = useState(true);\n')
  .replace('  async function handleBuy() {\n    console.log("Buy was triggered");\n  }\n', raw`  async function handleBuy() {
    console.log("Buy was triggered");
    // TODO 2: show the loader, then make an actor for the token canister:
    //   const tokenActor = await Actor.createActor(tokenIdlFactory, {
    //     agent,
    //     canisterId: Principal.fromText("<the token canister id from the bar below>"),
    //   });
    // TODO 3: const sellerId = await opend.getOriginalOwner(props.id);
    //         const itemPrice = await opend.getListedNFTPrice(props.id);
    //         const result = await tokenActor.transfer(sellerId, itemPrice);
    // TODO 4: if the payment says "Success":
    //         await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID) and log it
    // TODO 5: then hide the loader and the card: setDisplay(false)
  }
`)
  .replace('    <div className="disGrid-item">\n', '    // TODO 5: style={{ display: shouldDisplay ? "inline" : "none" }} on this div\n    <div className="disGrid-item">\n');

const ITEM_367_DONE = ITEM_366_DONE
  .replace('import { idlFactory } from "../../../declarations/nft";\n', 'import { idlFactory } from "../../../declarations/nft";\nimport { idlFactory as tokenIdlFactory } from "../../../declarations/token";\n')
  .replace('  const [priceLabel, setPriceLabel] = useState();\n', '  const [priceLabel, setPriceLabel] = useState();\n  const [shouldDisplay, setDisplay] = useState(true);\n')
  .replace('  async function handleBuy() {\n    console.log("Buy was triggered");\n  }\n', BUY_367)
  .replace('    <div className="disGrid-item">\n', '    <div\n      style={{ display: shouldDisplay ? "inline" : "none" }}\n      className="disGrid-item"\n    >\n');

/* sanity: every derived version must really differ from its source */
[[ITEM_363_START, ITEM_361_DONE], [ITEM_363_DONE, ITEM_361_DONE], [ITEM_365_START, ITEM_364_DONE], [ITEM_366_START, ITEM_365_DONE],
 [ITEM_366_DONE, ITEM_365_DONE], [ITEM_367_START, ITEM_366_DONE], [ITEM_367_DONE, ITEM_366_DONE], [HEADER_366_START, HEADER_363_DONE],
 [HEADER_366_DONE, HEADER_363_DONE], [GALLERY_366_START, GALLERY_363_DONE], [GALLERY_366_DONE, GALLERY_363_DONE],
 [MAIN_366, MAIN_364], [MAIN_367, MAIN_366]].forEach((p, i) => { if (p[0] === p[1]) throw new Error('s42: derived file ' + i + ' did not change'); });
['TODO 1', 'TODO 2', 'TODO 3', 'TODO 4', 'TODO 5'].forEach(t => { if (ITEM_365_START.indexOf(t) < 0) throw new Error('s42: 365 starter lacks ' + t); });
['TODO 3', 'TODO 4', 'TODO 5'].forEach(t => { if (ITEM_366_START.indexOf(t) < 0) throw new Error('s42: 366 starter lacks ' + t); });

/* ---- shared infrastructure for one lesson ---- */
function infra(o) {
  const f = {};
  if (o.opend) f['declarations/opend/index.js'] = opendDecl(o.opend);
  f['declarations/nft/index.js'] = nftDecl(o.nft);
  if (o.token) f['declarations/token/index.js'] = TOKEN_DECL;
  f['packages/@dfinity/agent.js'] = AGENT;
  f['packages/@dfinity/principal.js'] = PRINCIPAL;
  if (o.form) f['packages/react-hook-form.js'] = RHF;
  f['replica.js'] = replicaSrc(o.seed, !!o.token);
  f['assets/images.js'] = IMAGES;
  f['styles.css'] = OPEND_CSS;
  return f;
}
const NFT_BASIC = ['getAsset', 'getName', 'getOwner'];
const NFT_ID = ['getAsset', 'getCanisterId', 'getName', 'getOwner'];
const NFT_ALL = ['getAsset', 'getCanisterId', 'getName', 'getOwner', 'transferOwnership'];
const OPEND_364 = ['mint', 'getOwnedNFTs', 'listItem', 'getOpenDCanisterID'];
const OPEND_365 = OPEND_364.concat(['isListed']);
const OPEND_366 = OPEND_365.concat(['getListedNFTs', 'getOriginalOwner', 'getListedNFTPrice']);
const OPEND_367 = OPEND_366.concat(['completePurchase']);

const PLAYGROUND_NOTE = '<h3>How this playground runs OpenD</h3><p>dfx and Motoko cannot run in a browser tab, so <code>replica.js</code> plays the local replica: the OpenD canister, one canister per NFT and (in 367) the DANG token, each written in JavaScript to mirror the Motoko. <code>declarations/</code> has the same exports dfx generates, and <code>packages/</code> holds small stand-ins for <code>@dfinity/agent</code>, <code>@dfinity/principal</code> and <code>react-hook-form</code>, imported with relative paths. The stand-in agent checks argument types the way Candid does (a string where a <code>Nat</code> belongs is rejected), waits a moment, returns a <code>Nat</code> as a BigInt, and logs update calls as <code>[replica] ...</code>. Each reload starts again from a seed of NFTs minted "earlier", like a redeploy.</p>';

/* ========================================================================
   Explore demos
   ======================================================================== */

const DEMO_FUNGIBLE = raw`
<p class="note">Two wallets. Swap one DANG each way, then swap the NFTs, and compare what changed.</p>
<div class="stage" style="display:flex;gap:10px;flex-wrap:wrap">
  <button id="coins">swap 1 DANG each way</button>
  <button id="nfts">swap the NFTs</button>
  <button id="reset">reset</button>
</div>
<div id="wallets" style="display:flex;gap:12px;flex-wrap:wrap"></div>
<pre class="readout" id="out"></pre>
<script>
var w;
function reset() {
  w = { Ana: { dang: 25, nft: { id: 'qoctq-giaaa-aaaaa-aaaea-cai', name: 'PixelPals #2', art: '👻' } },
        Ben: { dang: 25, nft: { id: 'qjdve-lqaaa-aaaaa-aaaeq-cai', name: 'PixelPals #3', art: '🚀' } } };
  say('Both wallets hold 25 DANG and one NFT.');
}
function draw() {
  document.getElementById('wallets').innerHTML = Object.keys(w).map(function (k) {
    var n = w[k].nft;
    return '<div class="stage" style="flex:1 1 220px"><h4>' + k + '’s wallet</h4>' +
      '<div style="font-size:14px;margin-bottom:8px">' + w[k].dang + ' DANG</div>' +
      '<div style="display:flex;gap:10px;align-items:center"><span style="font-size:34px">' + n.art + '</span><span><b>' + n.name + '</b><br><span class="tag">' + n.id + '</span></span></div></div>';
  }).join('');
}
function say(s) { document.getElementById('out').textContent = s; draw(); }
document.getElementById('coins').onclick = function () {
  say('Ana sent Ben 1 DANG and Ben sent Ana 1 DANG.\nBoth still have 25 DANG, and nobody can tell which units moved:\nany DANG is worth exactly the same as any other. That is fungible.');
};
document.getElementById('nfts').onclick = function () {
  var t = w.Ana.nft; w.Ana.nft = w.Ben.nft; w.Ben.nft = t;
  say('The NFTs swapped owners. Each kept its own id and its own picture:\nAna now holds ' + w.Ana.nft.name + ', Ben holds ' + w.Ben.nft.name + '.\nThey are not interchangeable. That is non-fungible.');
};
document.getElementById('reset').onclick = reset;
reset();
</script>`;

const DEMO_CANDID = raw`
<p class="note">An NFT's image is only a list of bytes. Draw an 8 &times; 8 picture: its PNG bytes and the deploy command update as you go. The first eight bytes never change: they are the PNG signature every PNG file starts with.</p>
<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">
  <div class="stage" style="flex:0 0 auto;margin:0">
    <div id="grid" style="display:grid;grid-template-columns:repeat(8,24px);gap:2px;background:#dfe3ee;padding:2px;width:max-content"></div>
    <div id="pal" style="display:flex;gap:6px;margin-top:10px"></div>
  </div>
  <div style="flex:1 1 300px">
    <div class="knobs" style="margin:0 0 10px">
      <label>name <input type="text" id="nm" value="PixelPals #12" style="width:130px"></label>
      <label>owner <input type="text" id="ow" value="your-principal-id" style="width:190px"></label>
    </div>
    <div class="stage" style="display:flex;gap:12px;align-items:center;margin:0">
      <img id="prev" alt="" style="width:64px;height:64px;image-rendering:pixelated;border:1px solid #dfe3ee;background:#fff">
      <span id="info" class="note" style="margin:0"></span>
    </div>
  </div>
</div>
<pre class="readout" id="cmd" style="white-space:pre-wrap;word-break:break-all;margin-top:12px"></pre>
<script>
var colours = ['#ffffff', '#1d1d1d', '#e8423f', '#3fae5a', '#3b6fd8', '#ffcf33'], pick = 1, url = null;
var start = ['00111100', '01000010', '10100101', '10000001', '10100101', '10011001', '01000010', '00111100'];
var cells = [];
start.forEach(function (row) { for (var i = 0; i < 8; i++) cells.push(row[i] === '1' ? 1 : 0); });
var grid = document.getElementById('grid'), pal = document.getElementById('pal');
cells.forEach(function (c, i) {
  var d = document.createElement('div');
  d.style.cssText = 'width:24px;height:24px;cursor:pointer';
  d.onclick = function () { cells[i] = cells[i] === pick ? 0 : pick; paint(); };
  grid.appendChild(d);
});
colours.forEach(function (c, k) {
  var b = document.createElement('button');
  b.style.cssText = 'width:26px;height:26px;border-radius:6px;padding:0;background:' + c;
  b.onclick = function () { pick = k; paint(); };
  pal.appendChild(b);
});
var canvas = document.createElement('canvas'); canvas.width = 8; canvas.height = 8;
var ctx = canvas.getContext('2d');
function paint() {
  [].forEach.call(grid.children, function (d, i) { d.style.background = colours[cells[i]]; });
  [].forEach.call(pal.children, function (b, k) { b.style.outline = k === pick ? '3px solid #5b9cff' : 'none'; });
  cells.forEach(function (c, i) { ctx.fillStyle = colours[c]; ctx.fillRect(i % 8, Math.floor(i / 8), 1, 1); });
  canvas.toBlob(function (blob) {
    blob.arrayBuffer().then(function (buf) {
      var bytes = Array.from(new Uint8Array(buf));
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob);
      document.getElementById('prev').src = url;
      document.getElementById('info').textContent = bytes.length + ' bytes, each a number from 0 to 255 (a Nat8). The first eight: ' + bytes.slice(0, 8).join(' ');
      var name = document.getElementById('nm').value, owner = document.getElementById('ow').value;
      document.getElementById('cmd').textContent = "dfx deploy nft --argument='(\"" + name + "\", principal \"" + owner + "\", (vec {" + bytes.join('; ') + "}))'";
    });
  }, 'image/png');
}
document.getElementById('nm').oninput = paint;
document.getElementById('ow').oninput = paint;
paint();
</script>`;

const DEMO_ROUTES = raw`
<p class="note">How react-router v5 (the course's version) picks a page: <code>&lt;Switch&gt;</code> checks its routes from the top and renders the <b>first</b> one whose path matches the URL. Without <code>exact</code>, the path "/" matches every URL, because every URL starts with "/".</p>
<div class="knobs">
  <label>URL <select id="url"><option>/</option><option>/discover</option><option>/minter</option><option>/collection</option></select></label>
  <label><input type="checkbox" id="exact"> <span class="tag">exact</span> on the "/" route</label>
  <label><input type="checkbox" id="last"> move the "/" route to the end</label>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <pre class="readout" id="code" style="flex:1 1 340px;margin:0 0 12px"></pre>
  <div class="stage" id="shown" style="flex:1 1 200px"></div>
</div>
<script>
var routes = [
  { path: '/', show: 'the home image' },
  { path: '/discover', show: '&lt;h1&gt;Discover&lt;/h1&gt;' },
  { path: '/minter', show: 'the Minter form' },
  { path: '/collection', show: 'the My NFTs gallery' }
];
function q(id) { return document.getElementById(id); }
function draw() {
  var url = q('url').value, exact = q('exact').checked, list = routes.slice();
  if (q('last').checked) list.push(list.shift());
  var hit = -1;
  var lines = list.map(function (r, i) {
    var ex = r.path === '/' && exact;
    var match = ex ? url === r.path : (url === r.path || url.indexOf(r.path === '/' ? '/' : r.path + '/') === 0);
    if (match && hit < 0) hit = i;
    var mark = hit === i ? '  ◀ first match: rendered' : (hit >= 0 && i > hit ? '  (never checked)' : (match ? '' : '  no match'));
    return '  <Route ' + (ex ? 'exact ' : '') + 'path="' + r.path + '">' + mark;
  });
  q('code').textContent = 'URL: ' + url + '\n\n<Switch>\n' + lines.join('\n') + '\n</Switch>';
  var ok = list[hit].path === url;
  q('shown').innerHTML = '<h4>the page shows</h4><p style="font-size:15px">' + list[hit].show + '</p>' +
    (ok ? '<p class="note" style="color:#1a7f3c">Right page.</p>' : '<p class="note" style="color:#c0392b">Wrong page: "/" swallowed this URL. Add exact, or move "/" last.</p>');
}
['url', 'exact', 'last'].forEach(function (id) { q(id).onchange = draw; });
draw();
</script>`;

const DEMO_BLUR = raw`
<style>
  .dots { display:flex; gap:7px; justify-content:center; position:absolute; top:78px; left:0; right:0; }
  .dots i { width:11px; height:11px; border-radius:50%; background:#8b8fe8; animation:p .9s infinite ease-in-out; }
  .dots i:nth-child(2) { animation-delay:.15s } .dots i:nth-child(3) { animation-delay:.3s } .dots i:nth-child(4) { animation-delay:.45s }
  @keyframes p { 0%,80%,100% { transform:scale(.4); opacity:.5 } 40% { transform:scale(1); opacity:1 } }
  [hidden] { display:none !important; }
</style>
<p class="note">React's <code>style</code> prop takes an object, not a CSS string: the property names are camelCase keys and the values are strings. Slide the blur and toggle the loader's <code>hidden</code> attribute.</p>
<div class="knobs">
  <label>blur <input type="range" min="0" max="10" value="4" id="b"><span class="val" id="bv"></span></label>
  <label><input type="checkbox" id="h"> loaderHidden</label>
</div>
<div class="stage" style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
  <div style="width:180px;background:#23262f;border-radius:14px;overflow:hidden;position:relative">
    <canvas id="art" width="16" height="16" style="width:180px;height:180px;image-rendering:pixelated;display:block"></canvas>
    <div class="dots" id="loader"><i></i><i></i><i></i><i></i></div>
    <div style="padding:10px 12px;color:#fcfcfd;font:600 14px -apple-system,sans-serif">PixelPals #3 <span style="color:#8b8fe8">Listed</span><div style="font-size:11px;color:#9aa0b4;font-weight:400">Owner: OpenD</div></div>
  </div>
  <pre class="readout" id="code" style="flex:1 1 280px;margin:0"></pre>
</div>
<script>
var rows = ['.......RR.......', '......RRRR......', '......WWWW......', '.....WWWWWW.....', '.....WWBBWW.....', '.....WBBBBW.....', '.....WWBBWW.....', '.....WWWWWW.....',
  '.....WWWWWW.....', '....RWWWWWWR....', '...RRWWGGWWRR...', '...RR.GGGG.RR...', '.......OO.......', '......OYYO......', '.......YY.......', '.......O........'];
var pal = { W: '#f2f4f8', G: '#a9b3c4', R: '#e8423f', B: '#3b6fd8', O: '#ff9b2f', Y: '#ffe14a' };
var ctx = document.getElementById('art').getContext('2d');
ctx.fillStyle = '#bfe3ff'; ctx.fillRect(0, 0, 16, 16);
rows.forEach(function (r, y) { for (var x = 0; x < 16; x++) if (pal[r[x]]) { ctx.fillStyle = pal[r[x]]; ctx.fillRect(x, y, 1, 1); } });
function draw() {
  var px = document.getElementById('b').value, hidden = document.getElementById('h').checked;
  document.getElementById('bv').textContent = px + 'px';
  document.getElementById('art').style.filter = px > 0 ? 'blur(' + px + 'px)' : '';
  document.getElementById('loader').hidden = hidden;
  document.getElementById('code').textContent =
    'CSS:   filter: blur(' + px + 'px);\n\n' +
    'React: setBlur({ filter: "blur(' + px + 'px)" });\n' +
    '       <img src={image} style={blur} />\n\n' +
    '       setLoaderHidden(' + hidden + ');\n' +
    '       <div className="lds-ellipsis" hidden={loaderHidden}>  ' + (hidden ? '(gone)' : '(showing)');
}
document.getElementById('b').oninput = draw;
document.getElementById('h').onchange = draw;
draw();
</script>`;

const DEMO_PURCHASE = raw`
<p class="note">Buying is two separate calls from the browser: first the token canister moves the price, then OpenD hands over the NFT. Switch on the failure to see what can go wrong between them.</p>
<div class="knobs">
  <label><input type="checkbox" id="fail"> step 2 (completePurchase) fails</label>
  <button id="buy" style="font-weight:700">Buy PixelPals #5 for 2 DANG</button>
  <button id="reset">reset</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1 1 260px"><table class="grid" id="tbl" style="width:100%"></table></div>
  <pre class="readout" id="log" style="flex:1 1 300px;margin:0 0 12px"></pre>
</div>
<script>
var s;
function reset() { s = { buyer: 10000, seller: 0, owner: 'OpenD (listed)', listed: true }; say('PixelPals #5 is listed by your terminal identity for 2 DANG.'); }
function draw() {
  document.getElementById('tbl').innerHTML = '<tr><th>who / what</th><th>now</th></tr>' +
    '<tr><td>buyer (2vxsx-fae)</td><td>' + s.buyer.toLocaleString() + ' DANG</td></tr>' +
    '<tr><td>seller (terminal identity)</td><td>' + s.seller.toLocaleString() + ' DANG</td></tr>' +
    '<tr><td>PixelPals #5 owner</td><td>' + s.owner + '</td></tr>' +
    '<tr><td>still on Discover?</td><td>' + (s.listed ? 'yes' : 'no') + '</td></tr>';
}
function say(t) { document.getElementById('log').textContent = t; draw(); }
document.getElementById('buy').onclick = function () {
  if (!s.listed) return say('Nothing to buy: the listing is gone.');
  var lines = ['1. tokenActor.transfer(sellerId, 2)'];
  if (s.buyer < 2) return say(lines.concat(['   → "Insufficient Funds": stop here']).join('\n'));
  s.buyer -= 2; s.seller += 2; lines.push('   → "Success": the buyer has paid');
  lines.push('2. opend.completePurchase(id, sellerId, CURRENT_USER_ID)');
  if (document.getElementById('fail').checked) {
    lines.push('   → an error (network trouble, a bug, or a page closed in time)');
    lines.push('\nThe buyer paid 2 DANG but does not own the NFT, and it is\nstill listed. Doing both steps inside one backend call would\nkeep them together.');
  } else {
    s.owner = 'buyer (2vxsx-fae)'; s.listed = false;
    lines.push('   → OpenD calls transferOwnership(buyer) on the NFT canister');
    lines.push('   → the listing is deleted, the ownership lists are updated');
    lines.push('   → "Success"');
  }
  say(lines.join('\n'));
};
document.getElementById('reset').onclick = reset;
reset();
</script>`;

/* ========================================================================
   Lessons
   ======================================================================== */

PG.add({
  id:'l359', index:359, udemyId:31673744, minutes:10, section:'s42', slug:'what-youll-build-nft-marketplace', kind:'read',
  title:'What You\'ll Build - A Website to Mint, Buy and Sell NFTs',
  blurb:'The project is OpenD, a small OpenSea-style marketplace for <b>non-fungible tokens</b>. DANG tokens are fungible: any one is worth exactly the same as any other. An NFT has its own id and its own data, so no two are interchangeable. On most chains an NFT only stores a link to an image kept somewhere else (IPFS or a company\'s server); in OpenD each NFT is a canister of its own that keeps the image bytes on chain. The app mints NFTs from uploaded images, shows the ones you own, lists them for sale priced in DANG, and lets other users buy them.',
  explore:[{ title:'Fungible or not?', height:360, note:'Swap coins, then swap NFTs.', html: DEMO_FUNGIBLE }],
  quiz:[
    { q:'What makes a token <b>non-fungible</b>?', options:['It is expensive','Each one has a unique id and its own data, so they are not interchangeable','It cannot be sold','It has no owner'], answer:1, why:'Fungible units are identical and swappable; an NFT is one of a kind.' },
    { q:'Where is the image of a typical Ethereum NFT kept?', options:['Inside the token contract','Usually off chain (IPFS or a server); the contract stores a link to it','In the buyer\'s wallet','On OpenSea\'s blockchain'], answer:1, why:'The contract holds a token URI that points elsewhere, so the image depends on that host staying up.' },
    { q:'How does OpenD store an NFT?', options:['As a row in one big table','As its own canister holding the name, owner and image bytes','As a link to IPFS','As a DANG balance'], answer:1, why:'Every mint creates a new canister, which is what makes each NFT unique and keeps its image on chain.' },
    { q:'What currency are OpenD prices in?', options:['ETH','ICP','DANG, the token from the previous section','Cycles'], answer:2, why:'Buying uses the DANG token canister built in section 41.' },
  ],
});

PG.add({
  id:'l360', index:360, udemyId:31673750, minutes:17, section:'s42', slug:'minting-nfts', kind:'walkthrough',
  title:'Minting NFTs',
  blurb:'Each NFT will be a canister of its own, so its code goes in a separate file, <code>src/NFT/nft.mo</code>, registered in <code>dfx.json</code>. It is an <b>actor class</b>: unlike a plain actor it takes arguments when it is created (a name, an owner and the image as <code>[Nat8]</code> bytes), which later lets code create as many NFT canisters as it likes. Three query methods hand the values back. The first NFT is minted from the terminal with <code>dfx deploy nft --argument</code>.',
  intro:`<p>Motoko cannot run in the browser, so this lecture is a guided read: click a step to highlight its lines. The <b>Explore</b> tab turns a picture you draw into the bytes and the exact <code>--argument</code> string.</p>
<p>To run it for real: unzip the OpenD starter, add <code>src/NFT/nft.mo</code> and the <code>nft</code> entry in <code>dfx.json</code>, then follow <code>commands.sh</code>. Put your own principal in the deploy command and keep the quotes exactly as they are.</p>`,
  files:{
    'src/NFT/nft.mo': NFT_360,
    'dfx.json': DFX_JSON,
    'commands.sh': CMD360,
  },
  steps:[
    { title:'A canister of its own', text:'<code>main.mo</code> will be the marketplace. Each NFT is a separate canister, so its code lives in <code>src/NFT/nft.mo</code> and gets an entry in <code>dfx.json</code>. Putting it right after the first canister avoids comma mistakes; the key (<code>nft</code>) is the name used on the command line.', file:'dfx.json', lines:B(DFX_JSON, '"nft": {') },
    { title:'Smoke test first', text:'Before anything else the lecture deploys <code>actor NFT { Debug.print("It works."); }</code> (with <code>import Debug "mo:base/Debug"</code>) and looks for the message in the <code>dfx start</code> terminal. No message usually means a typo in <code>dfx.json</code> or the file path.', file:'commands.sh', lines:L(CMD360, '# 1.', 'dfx deploy            # terminal 2') },
    { title:'From actor to actor class', text:'Adding <code>class</code> and a parameter list makes this a template for canisters. <code>[Nat8]</code> is an array of 8-bit natural numbers: the raw bytes of the image file. <code>Principal</code> needs its import.', file:'src/NFT/nft.mo', lines:L(NFT_360, 'actor class NFT') },
    { title:'Keep the arguments', text:'The constructor arguments are copied into the canister\'s own fields.', file:'src/NFT/nft.mo', lines:L(NFT_360, 'let itemName', 'let imageBytes') },
    { title:'Read them back', text:'Three queries: fast, read-only, no consensus round. <code>getAsset</code> returns the bytes unchanged.', file:'src/NFT/nft.mo', lines:L(NFT_360, 'public query func getName', 'return imageBytes;') },
    { title:'Deploy with arguments', text:'A plain <code>dfx deploy nft</code> now fails with "Expected arguments, but found none". The arguments go as one Candid tuple: text in double quotes, <code>principal "..."</code>, and the bytes as <code>vec { ... }</code>, all inside single quotes.', file:'commands.sh', lines:L(CMD360, '# 3.', "dfx deploy nft --argument") },
    { title:'Check the canister', text:'No brackets after the method name on the command line. <code>getAsset</code> prints a long list of numbers: you need a front end to see them as a picture, which is the next lecture.', file:'commands.sh', lines:L(CMD360, '# 4.', 'getAsset') },
  ],
  explore:[{ title:'From picture to bytes to command', height:580, note:'Click squares to draw, pick colours below the grid.', html: DEMO_CANDID }],
  quiz:[
    { q:'What can an <code>actor class</code> do that a plain <code>actor</code> cannot?', options:['Store state','Take arguments when it is created, so code can create many canisters from it','Answer queries','Import modules'], answer:1, why:'A plain actor is a single canister; an actor class is a template that produces a new canister each time it is instantiated.' },
    { q:'Why is the image typed <code>[Nat8]</code>?', options:['Images must be small','It is the file\'s raw bytes, and every byte is a number from 0 to 255','Nat8 is a picture type','It compresses the image'], answer:1, why:'Nat8 is an 8-bit natural number, exactly the range of one byte.' },
    { q:'What does <code>dfx deploy nft</code> say without <code>--argument</code>?', options:['It works anyway','Invalid data: Expected arguments, but found none','Canister not found','Permission denied'], answer:1, why:'An actor class cannot be installed without the values its parameters ask for.' },
    { q:'Two NFTs have the same name, owner and image. Are they the same NFT?', options:['Yes','No: each is a separate canister with its own principal id','Only if minted on the same day','It depends on the price'], answer:1, why:'Each canister gets a unique principal when it is created, and that id is what identifies the NFT.' },
  ],
});

PG.add({
  id:'l361', index:361, udemyId:31673756, minutes:20, section:'s42', slug:'view-nft-frontend', kind:'react',
  title:'Viewing the NFT on the Frontend',
  blurb:'The minted NFT appears in the browser. <code>Item</code> receives the NFT canister\'s id as a prop, creates an <code>HttpAgent</code> and an actor from the generated <code>idlFactory</code>, and loads the name, owner and image once with <code>useEffect</code>. The image arrives as an array of bytes: wrapped in a <code>Uint8Array</code>, put in a <code>Blob</code> of type image/png, and <code>URL.createObjectURL</code> gives the <code>img</code> a source. A pretend replica (<code>replica.js</code>) stands in for dfx here, and <code>@dfinity/agent</code> and <code>@dfinity/principal</code> are small stand-ins.',
  tasks:[
    'In <code>components/App.jsx</code> import <code>Item</code>, keep the NFT\'s canister id in a constant, <code>const nftId = "' + CLI_NFT_ID + '";</code> (what <code>dfx canister id nft</code> printed in the course), and render <code>&lt;Item id={nftId} /&gt;</code> in place of the home image.',
    'In <code>components/Item.jsx</code> import <code>idlFactory</code> from <code>"../../../declarations/nft"</code> and add <code>name</code>, <code>owner</code> and <code>image</code> state.',
    'Turn <code>props.id</code> into a Principal with <code>Principal.fromText</code> and create the agent: <code>new HttpAgent({ host: localHost })</code>.',
    'Write <code>async function loadNFT()</code>: <code>await Actor.createActor(idlFactory, { agent, canisterId: id })</code>, then <code>await NFTActor.getName()</code>; store it and render <code>{name}</code> in the heading.',
    'Lecture challenge: the owner. <code>getOwner()</code> returns a Principal, so store <code>owner.toText()</code> and render it after "Owner:".',
    'The image: <code>getAsset()</code> → <code>new Uint8Array(imageData)</code> → <code>new Blob([imageContent.buffer], { type: "image/png" })</code> → <code>URL.createObjectURL(...)</code>, used as <code>src={image}</code>. Run <code>loadNFT</code> in <code>useEffect(..., [])</code>. You should see a pixel cactus called PixelPals #1, owned by your terminal identity (xk5tq-…).',
  ],
  files: order(['components/Item.jsx', 'components/App.jsx'], Object.assign({
    'components/Item.jsx': ITEM_361_START,
    'components/App.jsx': APP_361_START,
    'components/Header.jsx': HEADER_STATIC,
    'components/Footer.jsx': FOOTER,
    'index.jsx': INDEX,
  }, infra({ nft: NFT_BASIC, seed: 'cli' }))),
  solution:{ 'components/Item.jsx': ITEM_361_DONE, 'components/App.jsx': APP_361_DONE },
  notes: PLAYGROUND_NOTE,
  quiz:[
    { q:'Why <code>useEffect(() =&gt; { loadNFT(); }, [])</code> with an empty array?', options:['To make it faster','So the NFT is fetched once after the first render, not after every state change','Empty arrays are required','To clear the state'], answer:1, why:'Each setName/setOwner/setImage re-renders; without the empty dependency list the fetch would run again every time.' },
    { q:'What does <code>idlFactory</code> from the declarations describe?', options:['The NFT\'s image','The canister\'s methods and their Candid argument and return types','The agent\'s host','The owner\'s identity'], answer:1, why:'Actor.createActor uses it to build an object whose methods call the canister.' },
    { q:'Why store <code>owner.toText()</code> rather than <code>owner</code>?', options:['toText makes it shorter','React cannot render a Principal object; its text form can be shown','Principals expire','It is required by useState'], answer:1, why:'Objects are not valid React children; the dashed text id is.' },
    { q:'What does <code>URL.createObjectURL(blob)</code> give you?', options:['A file on disk','A temporary URL that points at the bytes in memory, usable as an img src','A link on IPFS','The canister URL'], answer:1, why:'The browser serves the blob\'s bytes at that URL for as long as the page lives.' },
  ],
});

PG.add({
  id:'l362', index:362, udemyId:31673764, minutes:31, section:'s42', slug:'minting-on-the-frontend', kind:'react', project:true,
  title:'Enabling the Minting Functionality on the Frontend',
  blurb:'The Minter form now creates NFTs. React Hook Form\'s <code>useForm</code> registers the file and name inputs, and <code>handleSubmit</code> only calls <code>onSubmit</code> when both are filled. The file\'s bytes (<code>arrayBuffer()</code> → <code>Uint8Array</code> → plain array) go to a new <code>mint</code> method on the OpenD canister, which creates a whole new NFT canister and returns its principal; the form is then replaced by a "Minted!" card. The Motoko side is lesson 362b. React Hook Form is a stand-in in <code>packages/</code>.',
  tasks:[
    'In <code>components/App.jsx</code> comment out the <code>Item</code> and render <code>&lt;Minter /&gt;</code> (import it).',
    'In <code>components/Minter.jsx</code>: <code>const { register, handleSubmit } = useForm();</code>, spread <code>{...register("image", { required: true })}</code> into the file input and <code>{...register("name", { required: true })}</code> into the text input, and put <code>onClick={handleSubmit(onSubmit)}</code> on the Mint NFT span. In <code>async function onSubmit(data)</code> log <code>data.name</code> and <code>data.image</code>. Pick a sample image in the bar at the bottom, type a name and press Mint NFT.',
    'In <code>onSubmit</code>: <code>const image = data.image[0];</code>, <code>const imageArray = await image.arrayBuffer();</code>, <code>const imageByteData = [...new Uint8Array(imageArray)];</code>',
    'Import <code>opend</code> from <code>"../../../declarations/opend"</code> and call <code>const newNFTID = await opend.mint(imageByteData, name);</code>, then log <code>newNFTID.toText()</code>.',
    'Add <code>nftPrincipal</code> state (<code>""</code>) and set it to the new id. While it is <code>""</code> return the form; otherwise return the Minted! view from the TODO with <code>&lt;Item id={nftPrincipal.toText()} /&gt;</code>.',
    'Add the loader: <code>loaderHidden</code> state (<code>true</code>) on the <code>lds-ellipsis</code> div; set it to <code>false</code> when <code>onSubmit</code> starts and back to <code>true</code> once <code>mint</code> answers.',
  ],
  files: order(['components/Minter.jsx', 'components/App.jsx'], Object.assign({
    'components/Minter.jsx': MINTER_START,
    'components/App.jsx': APP_362_START,
    'components/Item.jsx': ITEM_361_DONE,
    'components/Header.jsx': HEADER_STATIC,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_SAMPLES,
    'index.jsx': INDEX,
  }, infra({ opend: ['mint'], nft: NFT_ID, form: true, seed: 'cli' }))),
  solution:{ 'components/Minter.jsx': MINTER_DONE, 'components/App.jsx': APP_362_DONE },
  notes:`<p>The backend for this form, <code>mint</code> in <code>main.mo</code> and <code>getCanisterId</code> in <code>nft.mo</code>, is lesson <b>362b</b>.</p>${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'You click Mint NFT with the name field empty. What does <code>handleSubmit(onSubmit)</code> do?', options:['Calls onSubmit with an empty name','Does not call onSubmit, because a required field is empty','Mints an NFT called "undefined"','Reloads the page'], answer:1, why:'handleSubmit validates the registered fields first; required: true blocks the submit.' },
    { q:'Why spread <code>new Uint8Array(imageArray)</code> into a plain array before calling <code>mint</code>?', options:['To compress it','mint expects vec nat8, a list of numbers from 0 to 255: just the bytes, without the File\'s metadata','Arrays are faster','To make a copy for React'], answer:1, why:'The File object carries a name, size and type that do not belong on chain; the byte numbers are what [Nat8] holds.' },
    { q:'Why is the Minted! card given <code>nftPrincipal.toText()</code> rather than <code>nftPrincipal</code>?', options:['Text is shorter','Item turns props.id into a Principal with Principal.fromText, which needs text','Principals cannot be props','It hides the id'], answer:1, why:'At this stage Item expects text; it changes in the next lecture.' },
  ],
});

PG.add({
  id:'l362b', index:362, sub:'b', udemyId:31673764, minutes:0, section:'s42', slug:'mint-backend', kind:'walkthrough',
  title:'Mint backend: creating NFT canisters from code',
  blurb:'The Motoko half of lecture 362. <code>mint</code> lives in the OpenD canister: it takes the image bytes and a name, makes the caller the owner, and creates a new canister with <code>await NFTActorClass.NFT(name, owner, imgData)</code>, paying for it with cycles. To return the new canister\'s id, <code>nft.mo</code> names its own instance with <code>= this</code> and adds <code>getCanisterId</code>, which uses <code>Principal.fromActor(this)</code>.',
  intro:`<p>Guided read of <code>main.mo</code> and <code>nft.mo</code> at the end of lecture 362. Click a step to highlight it.</p>
<p>To run it for real: update both files, run <code>dfx deploy opend</code> and mint from the Minter page. A local replica does not charge cycles, so it works without <code>Cycles.add</code>, but the live network refuses to create a canister without them.</p>`,
  files:{
    'src/opend/main.mo': MAIN_362,
    'src/NFT/nft.mo': NFT_362,
    'commands.sh': CMD362,
  },
  steps:[
    { title:'Import the class', text:'An actor class in another file is imported by relative path. <code>NFTActorClass.NFT</code> is then the constructor.', file:'src/opend/main.mo', lines:L(MAIN_362, 'import NFTActorClass') },
    { title:'The mint signature', text:'<code>shared(msg)</code> so the caller becomes the owner. The image is <code>[Nat8]</code>, matching the class exactly (<code>[Nat]</code> would not be compatible). It returns the new NFT\'s <code>Principal</code>.', file:'src/opend/main.mo', lines:L(MAIN_362, 'public shared(msg) func mint', 'let owner') },
    { title:'Pay with cycles', text:'Creating a canister costs cycles, taken from OpenD\'s own balance. <code>Cycles.add</code> attaches them to the next call that creates one: roughly 100 billion to create it plus 500 million to keep it running. The module is called experimental because the API was still being settled.', file:'src/opend/main.mo', lines:L(MAIN_362, 'Debug.print(debug_show(Cycles.balance()));', 'Cycles.add') },
    { title:'Create the canister', text:'Calling the class constructor installs a brand-new canister. Initialising it is asynchronous, hence <code>await</code>. The two prints show OpenD\'s balance falling.', file:'src/opend/main.mo', lines:L(MAIN_362, 'let newNFT = await', 'Debug.print', 'Cycles.add') },
    { title:'Naming the instance', text:'<code>= this</code> after the parameter list gives the class instance a name it can use for itself. A plain actor could write <code>Principal.fromActor(OpenD)</code>; an actor class needs this binding.', file:'src/NFT/nft.mo', lines:L(NFT_362, 'actor class NFT') },
    { title:'getCanisterId', text:'<code>Principal.fromActor(this)</code> turns the actor into its principal, which is the NFT\'s id.', file:'src/NFT/nft.mo', lines:B(NFT_362, 'public query func getCanisterId') },
    { title:'Return the id', text:'OpenD asks the new canister for its id and sends it back to the front end, which shows the Minted! card for it.', file:'src/opend/main.mo', lines:L(MAIN_362, 'let newNFTPrincipal = await newNFT.getCanisterId()', 'return newNFTPrincipal;') },
  ],
  quiz:[
    { q:'Why does <code>mint</code> live in the OpenD canister and not in <code>nft.mo</code>?', options:['nft.mo is read-only','OpenD is the canister that creates and keeps track of NFT canisters','Motoko allows only one function per file','For speed'], answer:1, why:'The marketplace creates each NFT canister and, from the next lecture, remembers who owns which.' },
    { q:'What is <code>Cycles.add</code> for?', options:['Counting NFTs','Attaching cycles from OpenD\'s balance to the call that creates the new canister','Adding a price','Speeding up the replica'], answer:1, why:'On the live network every new canister has to be funded with cycles.' },
    { q:'Why does <code>nft.mo</code> add <code>= this</code>?', options:['To make it stable','So the class instance can refer to itself, e.g. Principal.fromActor(this)','To allow imports','To make it public'], answer:1, why:'An actor class has no fixed name for its instances; the binding provides one.' },
  ],
});

PG.add({
  id:'l363', index:363, udemyId:31673772, minutes:37, section:'s42', slug:'owned-nfts-pages', kind:'react', project:true,
  title:'Displaying Owned NFTs Using the React Router',
  blurb:'OpenD gets pages and a memory. The header buttons switch between Home, Discover, Minter and My NFTs. The course does this with react-router-dom (<code>BrowserRouter</code>, <code>Link</code>, <code>Switch</code>, <code>Route</code>), which this playground cannot load, so here the page is a piece of <b>state</b> that each button sets: the same idea in a few lines (the router version is in the Notes tab, and Explore shows how its routes match). The backend now records who owns which NFT (lesson 363b), and My NFTs asks <code>getOwnedNFTs(CURRENT_USER_ID)</code> and shows one <code>Item</code> per id in a reusable <code>Gallery</code>.',
  tasks:[
    'In <code>components/App.jsx</code> remove <code>&lt;Minter /&gt;</code> and its import: the pages now live in Header.',
    'In <code>components/Header.jsx</code> add <code>const [page, setPage] = useState("/")</code>. Under the header markup, render the part that matches: the home image for <code>"/"</code>, <code>&lt;h1&gt;Discover&lt;/h1&gt;</code> for <code>"/discover"</code>, <code>&lt;Minter /&gt;</code> for <code>"/minter"</code> and <code>{userOwnedGallery}</code> for <code>"/collection"</code>, e.g. <code>{page == "/minter" &amp;&amp; &lt;Minter /&gt;}</code>.',
    'Write <code>async function go(path)</code> (blank the page, <code>await getNFTs()</code>, set the page) and give each nav button an <code>onClick</code> with the paths the course\'s Links use; clicking the OpenD title goes to <code>"/"</code>.',
    'Write <code>async function getNFTs()</code>: <code>const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);</code>, log it, then <code>setOwnedGallery(&lt;Gallery title="My NFTs" ids={userNFTIds} /&gt;)</code>. Run it from <code>useEffect</code> with <code>[]</code>.',
    'In <code>components/Gallery.jsx</code> render <code>{props.title}</code>, and in a <code>fetchNFTs</code> function run by <code>useEffect</code> map <code>props.ids</code> to <code>&lt;Item id={NFTId} key={NFTId.toText()} /&gt;</code> kept in <code>items</code> state. Render <code>{items}</code> inside the innermost grid div, and delete the stray <code>&lt;Item /&gt;</code>.',
    'In <code>components/Item.jsx</code> use <code>const id = props.id;</code>: the gallery passes Principals already. Open My NFTs: three NFTs. Mint one more on the Minter page and open My NFTs again: four, newest first.',
  ],
  files: order(['components/Header.jsx', 'components/Gallery.jsx', 'components/Item.jsx', 'components/App.jsx'], Object.assign({
    'components/Header.jsx': HEADER_363_START,
    'components/Gallery.jsx': GALLERY_363_START,
    'components/Item.jsx': ITEM_363_START,
    'components/App.jsx': APP_363_START,
    'components/Minter.jsx': MINTER_DONE,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_SAMPLES,
    'index.jsx': INDEX,
  }, infra({ opend: ['mint', 'getOwnedNFTs'], nft: NFT_ID, form: true, seed: 'owned' }))),
  solution:{ 'components/Header.jsx': HEADER_363_DONE, 'components/Gallery.jsx': GALLERY_363_DONE, 'components/Item.jsx': ITEM_363_DONE, 'components/App.jsx': APP },
  notes:`<h3>The course's version, with react-router-dom v5</h3>
<p>The same Header written with the router. <code>Link</code> changes the URL without a page request, <code>Switch</code> renders the first <code>Route</code> whose path matches, and <code>exact</code> stops <code>"/"</code> matching everything. <code>forceRefresh={true}</code> makes every Link reload the page, so <code>getNFTs</code> runs again and a newly minted NFT shows up. (In react-router v6, <code>Switch</code> became <code>Routes</code> and the syntax changed.)</p>
<pre data-lang="jsx">${esc(HEADER_ROUTER)}</pre>
<p>The backend (<code>mapOfNFTs</code>, <code>mapOfOwners</code>, <code>getOwnedNFTs</code>) is lesson <b>363b</b>.</p>
${PLAYGROUND_NOTE}`,
  explore:[{ title:'How Switch picks a route', height:380, note:'Choose a URL, then try exact and the route order.', html: DEMO_ROUTES }],
  quiz:[
    { q:'In react-router v5, why does <code>&lt;Route path="/"&gt;</code> need <code>exact</code> (or to go last)?', options:['"/" is not a valid path','Every URL starts with "/", and Switch renders the first route that matches','exact makes it faster','Without it the page reloads'], answer:1, why:'Switch stops at the first match, so a bare "/" at the top would win for every URL.' },
    { q:'Why does <code>mapOfOwners</code> map an owner to a <i>list</i> of ids?', options:['Lists are stable','One owner can hold many NFTs','HashMaps cannot store Principals','To sort them by price'], answer:1, why:'Each owner key needs room for every NFT they have minted or bought.' },
    { q:'Why give each mapped <code>Item</code> a <code>key</code>?', options:['For styling','React needs a stable, unique key for each element of a list; the principal text is unique','To pass the id twice','Keys make items clickable'], answer:1, why:'Keys let React match list items between renders.' },
    { q:'Why did the course set <code>forceRefresh={true}</code>?', options:['To clear the cache','getNFTs ran only once on load, so a newly minted NFT appeared only after a reload','To make links faster','It is required in v5'], answer:1, why:'A full reload on each link click re-runs the effect, so the gallery is fetched fresh.' },
  ],
});

PG.add({
  id:'l363b', index:363, sub:'b', udemyId:31673772, minutes:0, section:'s42', slug:'ownership-maps-backend', kind:'walkthrough',
  title:'Ownership backend: remembering who owns which NFT',
  blurb:'The Motoko half of lecture 363. OpenD gets two HashMaps: <code>mapOfNFTs</code> (NFT id → the NFT canister) and <code>mapOfOwners</code> (owner → a <code>List</code> of NFT ids). <code>mint</code> fills both, with a private <code>addToOwnershipMap</code> that unwraps the owner\'s optional list, pushes the new id and puts the list back. <code>getOwnedNFTs</code> returns a user\'s list as an array.',
  intro:`<p>Guided read of <code>main.mo</code> at the end of lecture 363.</p>
<p>To run it for real: update <code>src/opend/main.mo</code>, run <code>dfx deploy opend</code> (which wipes the NFTs minted so far), then mint a few from the browser and open My NFTs.</p>`,
  files:{ 'src/opend/main.mo': MAIN_363 },
  steps:[
    { title:'Two new imports', text:'<code>HashMap</code> for the maps and <code>List</code> for each owner\'s collection.', file:'src/opend/main.mo', lines:L(MAIN_363, 'import HashMap', 'import List') },
    { title:'The two maps', text:'Both are keyed by <code>Principal</code>, created with the usual capacity, equality and hash arguments. The value of <code>mapOfNFTs</code> is the NFT actor itself; the value of <code>mapOfOwners</code> is a list of ids, because one owner can hold many.', file:'src/opend/main.mo', lines:L(MAIN_363, 'var mapOfNFTs', 'var mapOfOwners') },
    { title:'Record each mint', text:'After the canister is created its id goes into both maps.', file:'src/opend/main.mo', lines:L(MAIN_363, 'mapOfNFTs.put(newNFTPrincipal, newNFT)', 'addToOwnershipMap(owner, newNFTPrincipal)') },
    { title:'Unwrap the owner\'s list', text:'<code>get</code> returns an option: a first-time owner has no entry. The <code>switch</code> gives an empty <code>List.nil</code> for <code>null</code> and the list itself otherwise. <code>private</code> keeps the helper out of the public interface.', file:'src/opend/main.mo', lines:L(MAIN_363, 'private func addToOwnershipMap', 'case (?result) result;') },
    { title:'Push and put back', text:'<code>List.push</code> returns a new list with the id at the front, so reassign with <code>:=</code>, then store the list again. Pushing to the front is why the newest NFT shows first.', file:'src/opend/main.mo', lines:L(MAIN_363, 'ownedNFTs := List.push', 'mapOfOwners.put(owner, ownedNFTs)') },
    { title:'getOwnedNFTs', text:'The same unwrapping, then <code>List.toArray</code>, because the front end receives a Candid vec, which arrives in JavaScript as an array of Principals.', file:'src/opend/main.mo', lines:B(MAIN_363, 'public query func getOwnedNFTs') },
  ],
  quiz:[
    { q:'Why must <code>ownedNFTs</code> be reassigned after <code>List.push</code>?', options:['push is async','push returns a new list instead of changing the old one','Lists are stable','To sort it'], answer:1, why:'Motoko lists are immutable; push builds a new list with the item at the head.' },
    { q:'What happens without the <code>switch</code> around <code>mapOfOwners.get(owner)</code>?', options:['Nothing','A type error: get returns ?List, not a List','The owner is deleted','The map is cleared'], answer:1, why:'The option has to be unwrapped (null → empty list) before it can be used as a List.' },
    { q:'Why does <code>getOwnedNFTs</code> return <code>List.toArray(userNFTs)</code>?', options:['Arrays are smaller','The public method returns an array ([Principal]), which Candid sends as a vec','Lists cannot hold Principals','To remove duplicates'], answer:1, why:'The front end works with a plain array of ids.' },
  ],
});

PG.add({
  id:'l364', index:364, udemyId:31673780, minutes:34, section:'s42', slug:'listing-nfts-for-sale', kind:'react', project:true,
  title:'Listing NFTs for Sale',
  blurb:'Each card in My NFTs gets a Sell button. A reusable <code>Button</code> takes its label and click handler as props. Sell swaps in a price input and a Confirm button; Confirm calls <code>opend.listItem(id, price)</code> and, if that worked, hands the NFT canister itself to OpenD with <code>transferOwnership</code>, so the marketplace can later pass it to a buyer. Both errors from the lecture happen here too: a string price (<i>Invalid nat argument</i>) and the local replica\'s certificate check (<i>Fail to verify certificate</i>), fixed with <code>agent.fetchRootKey()</code>.',
  tasks:[
    'In <code>components/Button.jsx</code> return the chip markup from the TODO, with <code>onClick={props.handleClick}</code> on the span and <code>{props.text}</code> as its label.',
    'In <code>components/Item.jsx</code> add <code>button</code> and <code>priceInput</code> state, render <code>{priceInput}</code> and <code>{button}</code> under the owner line, and end <code>loadNFT</code> with <code>setButton(&lt;Button handleClick={handleSell} text={"Sell"} /&gt;)</code>.',
    'Write <code>handleSell</code>: log "Sell clicked", show the price input (its <code>onChange</code> stores <code>e.target.value</code> in a plain <code>let price</code>) and swap the button for a Confirm button whose handler is <code>sellItem</code>.',
    'Write <code>async function sellItem()</code>: <code>const listingResult = await opend.listItem(props.id, Number(price));</code> and log it. Try it once without <code>Number()</code> to see the lecture\'s error.',
    'When the listing says "Success": <code>const openDId = await opend.getOpenDCanisterID();</code> and <code>await NFTActor.transferOwnership(openDId)</code>; log the result. <code>NFTActor</code> must be a <code>let</code> declared in the component and assigned in <code>loadNFT</code>.',
    'The transfer fails with <i>Fail to verify certificate</i>: add <code>agent.fetchRootKey();</code> right after creating the agent. Sell again: the console shows <b>listing: Success</b> and <b>transfer: Success</b>.',
  ],
  files: order(['components/Item.jsx', 'components/Button.jsx'], Object.assign({
    'components/Item.jsx': ITEM_364_START,
    'components/Button.jsx': BUTTON_START,
    'components/Header.jsx': HEADER_363_DONE,
    'components/Gallery.jsx': GALLERY_363_DONE,
    'components/Minter.jsx': MINTER_DONE,
    'components/App.jsx': APP,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_SAMPLES,
    'index.jsx': INDEX,
  }, infra({ opend: OPEND_364, nft: NFT_ALL, form: true, seed: 'owned' }))),
  solution:{ 'components/Item.jsx': ITEM_364_DONE, 'components/Button.jsx': BUTTON_DONE },
  notes:`<p>The backend (the <code>Listing</code> type, <code>listItem</code>, <code>getOpenDCanisterID</code> and <code>transferOwnership</code> in <code>nft.mo</code>) is lesson <b>364b</b>.</p>
<p>The price is kept in a plain <code>let</code> rather than state: the Confirm button and the input are created inside <code>handleSell</code>, so they share that render's <code>price</code> variable, and <code>sellItem</code> reads the latest value typed.</p>${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'Why does the NFT move to OpenD when it is <i>listed</i>, not when it is bought?', options:['To save cycles','Only the owner can call transferOwnership; OpenD must own the NFT to hand it to a buyer later','Listing is the same as selling','So the seller can buy it back'], answer:1, why:'A buyer may come long after the seller has left, so the marketplace takes custody at listing time.' },
    { q:'What causes <i>Invalid nat argument: "12"</i>?', options:['The price is too high','The price came from e.target.value, a string, but listItem takes a Nat','The NFT id is wrong','The agent is offline'], answer:1, why:'Inputs always give text. Number(price) fixes it.' },
    { q:'What does <code>agent.fetchRootKey()</code> do, and when must it go?', options:['It logs you in; never','It fetches the local replica\'s public key so update replies can be verified; remove it before deploying live','It speeds up queries; only in tests','It creates a canister; after minting'], answer:1, why:'Locally the agent cannot verify certificates without it; on the live network the built-in key is the right one, and fetching another would be unsafe.' },
  ],
});

PG.add({
  id:'l364b', index:364, sub:'b', udemyId:31673780, minutes:0, section:'s42', slug:'listing-backend', kind:'walkthrough',
  title:'Listing backend: listItem and transferOwnership',
  blurb:'The Motoko half of lecture 364. A <code>Listing</code> record type (owner and price) and a third HashMap, <code>mapOfListings</code>. <code>listItem</code> finds the NFT, awaits its real owner and only lists it if that owner is the caller. <code>getOpenDCanisterID</code> gives the front end OpenD\'s own id, and <code>nft.mo</code> gains an owner-only <code>transferOwnership</code>, with <code>nftOwner</code> now a private <code>var</code>.',
  intro:`<p>Guided read of <code>main.mo</code> and <code>nft.mo</code> at the end of lecture 364.</p>
<p>To run it for real: save both files and run <code>dfx deploy opend</code>. Redeploying clears the minted NFTs, so mint a fresh one before testing Sell.</p>`,
  files:{ 'src/opend/main.mo': MAIN_364, 'src/NFT/nft.mo': NFT_364 },
  steps:[
    { title:'A record type', text:'<code>type</code> declares a record: named fields separated by semicolons. Type names start with a capital letter. A listing could carry more later (history, dates); two fields are enough here.', file:'src/opend/main.mo', lines:B(MAIN_364, 'private type Listing') },
    { title:'The listings map', text:'NFT id → <code>Listing</code>, created like the other two maps.', file:'src/opend/main.mo', lines:L(MAIN_364, 'var mapOfListings') },
    { title:'Find the NFT', text:'Another option to unwrap. Here <code>case null</code> does not supply a default: it <code>return</code>s a message, leaving the function early.', file:'src/opend/main.mo', lines:L(MAIN_364, 'public shared(msg) func listItem', 'case (?result) result;', 'public shared(msg) func listItem') },
    { title:'Ask the NFT who owns it', text:'An inter-canister call, so it needs <code>await</code>; without it you hold an <code>async Principal</code>, which is a type error.', file:'src/opend/main.mo', lines:L(MAIN_364, 'let owner = await item.getOwner()') },
    { title:'Only the owner can list', text:'If the caller is the owner, build a <code>Listing</code> and store it; the success reply sits inside this branch only. Anyone else is turned away.', file:'src/opend/main.mo', lines:L(MAIN_364, 'if (Principal.equal(owner, msg.caller))', 'return "You don\'t own the NFT."') },
    { title:'OpenD\'s own id', text:'<code>Principal.fromActor(OpenD)</code>: a plain actor can name itself. The front end needs it as the new owner when it transfers the NFT.', file:'src/opend/main.mo', lines:B(MAIN_364, 'public query func getOpenDCanisterID') },
    { title:'Private fields, a var owner', text:'The owner must change, so <code>nftOwner</code> becomes a <code>var</code>. <code>private</code> means only this canister\'s own code can touch the fields.', file:'src/NFT/nft.mo', lines:L(NFT_364, 'private let itemName', 'private let imageBytes') },
    { title:'transferOwnership', text:'Only the current owner may hand the NFT on; reassignment uses <code>:=</code>. The front end calls it from the owner\'s browser, passing OpenD\'s id.', file:'src/NFT/nft.mo', lines:B(NFT_364, 'public shared(msg) func transferOwnership') },
  ],
  quiz:[
    { q:'Why <code>await item.getOwner()</code> instead of keeping the owner in OpenD?', options:['It is faster','The NFT canister is the authority on its owner, and asking it is an inter-canister call','OpenD cannot store Principals','Queries cannot be awaited'], answer:1, why:'Ownership lives in each NFT canister; OpenD has to ask it, and that call is asynchronous.' },
    { q:'What does <code>case null return "NFT does not exist.";</code> do?', options:['Returns null','Leaves listItem immediately with that message','Creates the NFT','Ignores the error'], answer:1, why:'return inside the switch ends the whole function, so the rest never runs for a missing NFT.' },
    { q:'Why did <code>nftOwner</code> change from <code>let</code> to <code>var</code>?', options:['let is slower','transferOwnership must reassign it, and let values cannot change','var is private by default','To make it stable'], answer:1, why:'let binds a value once; var can be reassigned with :=.' },
  ],
});

PG.add({
  id:'l365', index:365, udemyId:31673786, minutes:11, section:'s42', slug:'styling-listed-nfts', kind:'react', project:true,
  title:'Styling the Listed NFTs',
  blurb:'Selling now shows on the card: a loader while the calls run, then a blurred image, owner "OpenD", a purple <i>Listed</i> tag and no buttons. A React inline style object, <code>{ filter: "blur(4px)" }</code>, does the blur. To keep that look after a reload, <code>loadNFT</code> asks the new <code>isListed</code> query (shown in Notes) before deciding whether to offer Sell. In this replica PixelPals #3 was listed before the page loaded, which is how you check that part.',
  tasks:[
    'Add <code>loaderHidden</code> state (<code>true</code>) and put the loader markup right after the <code>img</code> with <code>hidden={loaderHidden}</code>. Show it at the start of <code>sellItem</code>.',
    'Add <code>blur</code> state, <code>style={blur}</code> on the image, and <code>setBlur({ filter: "blur(4px)" })</code> at the start of <code>sellItem</code>.',
    'When the transfer succeeds: hide the loader, call <code>setButton()</code> and <code>setPriceInput()</code> with no argument (nothing to render), and <code>setOwner("OpenD")</code>.',
    'Add <code>sellStatus</code> state (<code>""</code>), render it in the purple-text span after a space, and set it to "Listed" after a successful sale.',
    'In <code>loadNFT</code>, before the Sell button: <code>const nftIsListed = await opend.isListed(props.id);</code> If it is listed, set the owner to "OpenD", the blur and "Listed"; otherwise set the Sell button. PixelPals #3 should now load blurred, with no button.',
  ],
  files: order(['components/Item.jsx'], Object.assign({
    'components/Item.jsx': ITEM_365_START,
    'components/Button.jsx': BUTTON_DONE,
    'components/Header.jsx': HEADER_363_DONE,
    'components/Gallery.jsx': GALLERY_363_DONE,
    'components/Minter.jsx': MINTER_DONE,
    'components/App.jsx': APP,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_SAMPLES,
    'index.jsx': INDEX,
  }, infra({ opend: OPEND_365, nft: NFT_ALL, form: true, seed: 'listed' }))),
  solution:{ 'components/Item.jsx': ITEM_365_DONE },
  notes:`<h3>The Motoko side: isListed (main.mo)</h3>
<p>A listing exists when <code>mapOfListings</code> has an entry for the id. After adding it, redeploy and check that the generated interface contains <code>isListed</code>.</p>
<pre data-lang="mo">${esc(IS_LISTED)}</pre>
<p>One quirk carried over from the course code: the Minter's "Minted!" card passes the id as text (<code>nftPrincipal.toText()</code>), so <code>isListed</code> rejects it there with <i>Invalid principal argument</i>. The <code>role</code> prop in the next lecture keeps that card out of the listing logic.</p>
${PLAYGROUND_NOTE}`,
  explore:[{ title:'Inline styles and hidden', height:450, note:'The same card styling as the lesson, outside React.', html: DEMO_BLUR }],
  quiz:[
    { q:'How is a CSS rule written in React\'s <code>style</code> prop?', options:['As a string: style="filter: blur(4px)"','As an object: style={{ filter: "blur(4px)" }}','As a class name','It cannot be done'], answer:1, why:'The style prop takes an object whose keys are camelCase property names.' },
    { q:'What do <code>setButton()</code> and <code>setPriceInput()</code> with no argument do?', options:['Nothing','They set the state to undefined, so React renders nothing for them','They reset to the initial value','They throw an error'], answer:1, why:'Calling a setter with no argument stores undefined, and undefined renders as nothing.' },
    { q:'Why ask <code>isListed</code> inside <code>loadNFT</code>?', options:['To get the price','After a reload the card only knows what the canister tells it; the listing lives in the backend','To speed up the page','isListed creates the listing'], answer:1, why:'React state starts fresh on every load, so the listed look must be rebuilt from backend data.' },
  ],
});

PG.add({
  id:'l366', index:366, udemyId:31673790, minutes:23, section:'s42', slug:'discover-page', kind:'react', project:true,
  title:'Creating the "Discover" Page',
  blurb:'Discover lists every NFT for sale by reusing <code>Gallery</code> with the ids from a new <code>getListedNFTs</code> query. A <code>role</code> prop tells <code>Item</code> where it is: in the collection it keeps the sell logic; on Discover it shows a price label and a Buy button, except on NFTs the current user listed themself, which <code>getOriginalOwner</code> reveals. The price arrives from <code>getListedNFTPrice</code> as a BigInt, so <code>toString()</code> it before rendering. The replica already holds two NFTs your terminal identity minted and listed (the lecture does that with dfx commands, lesson 366b), so Buy buttons can appear.',
  tasks:[
    'In <code>components/Header.jsx</code> fetch <code>await opend.getListedNFTs()</code> in <code>getNFTs</code>, keep <code>&lt;Gallery title="Discover" ids={listedNFTIds} role="discover" /&gt;</code> in <code>listingGallery</code> state and show it on the <code>"/discover"</code> page. Give the My NFTs gallery <code>role="collection"</code>.',
    'In <code>components/Gallery.jsx</code> pass <code>role={props.role}</code> on to every <code>Item</code>.',
    'In <code>components/Item.jsx</code> wrap the listing check and Sell button in <code>if (props.role == "collection")</code>, and add <code>else if (props.role == "discover")</code> with a Buy button whose <code>handleBuy</code> only logs for now.',
    'Hide Buy on your own listings: <code>const originalOwner = await opend.getOriginalOwner(props.id);</code> and set the Buy button only if <code>originalOwner.toText() != CURRENT_USER_ID.toText()</code> (import <code>CURRENT_USER_ID</code> from <code>"../index"</code>).',
    'In <code>components/PriceLabel.jsx</code> return the label with <code>{props.sellPrice} DANG</code>. On Discover: <code>const price = await opend.getListedNFTPrice(props.id);</code> and <code>setPriceLabel(&lt;PriceLabel sellPrice={price.toString()} /&gt;)</code>; render <code>{priceLabel}</code> above the name.',
    'Open Discover: PixelPals #3 (yours: no Buy) plus #5 and #6 from your terminal identity, with Buy buttons and prices of 2 and 5 DANG.',
  ],
  files: order(['components/Header.jsx', 'components/Gallery.jsx', 'components/Item.jsx', 'components/PriceLabel.jsx'], Object.assign({
    'components/Header.jsx': HEADER_366_START,
    'components/Gallery.jsx': GALLERY_366_START,
    'components/Item.jsx': ITEM_366_START,
    'components/PriceLabel.jsx': PRICE_START,
    'components/Button.jsx': BUTTON_DONE,
    'components/Minter.jsx': MINTER_DONE,
    'components/App.jsx': APP,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_SAMPLES,
    'index.jsx': INDEX,
  }, infra({ opend: OPEND_366, nft: NFT_ALL, form: true, seed: 'market' }))),
  solution:{ 'components/Header.jsx': HEADER_366_DONE, 'components/Gallery.jsx': GALLERY_366_DONE, 'components/Item.jsx': ITEM_366_DONE, 'components/PriceLabel.jsx': PRICE_DONE },
  notes:`<p>The backend (<code>getListedNFTs</code>, <code>getOriginalOwner</code>, <code>getListedNFTPrice</code>) and the terminal commands that create a listing from another identity are lesson <b>366b</b>.</p>${PLAYGROUND_NOTE}`,
  quiz:[
    { q:'Why does Item need a <code>role</code> prop?', options:['For styling only','The same component behaves differently in My NFTs (sell) and on Discover (buy)','To pass the price','React requires it in lists'], answer:1, why:'One Item component serves both galleries; role tells it which logic to run.' },
    { q:'Why compare <code>originalOwner.toText() != CURRENT_USER_ID.toText()</code> rather than the Principal objects?', options:['Text is shorter','Two separate Principal objects are never ==, even with the same id; their text can be compared','Principals cannot be compared at all','To hide the id'], answer:1, why:'Object comparison checks identity, not content. Comparing the text compares the ids.' },
    { q:'Why <code>price.toString()</code> before passing it to PriceLabel?', options:['To add DANG','A Candid Nat arrives as a BigInt, which React will not render as a child','To round it','Strings are faster'], answer:1, why:'toString turns the BigInt into text React can show.' },
  ],
});

PG.add({
  id:'l366b', index:366, sub:'b', udemyId:31673790, minutes:0, section:'s42', slug:'discover-backend', kind:'walkthrough',
  title:'Discover backend: listed NFTs, sellers and prices',
  blurb:'The Motoko half of lecture 366: three queries over <code>mapOfListings</code>. <code>getListedNFTs</code> returns its keys as an array (<code>Iter.toArray(mapOfListings.keys())</code>); <code>getOriginalOwner</code> and <code>getListedNFTPrice</code> unwrap a listing and return its <code>itemOwner</code> and <code>itemPrice</code>. To test a Buy button the lecture creates a listing from the terminal identity with four dfx commands.',
  intro:`<p>Guided read of <code>main.mo</code> up to lecture 366 (it includes <code>isListed</code> from 365), plus the terminal commands for a test listing.</p>
<p>To run it for real: save <code>main.mo</code> (an unsaved file shows in italics in VS Code), run <code>dfx deploy opend</code>, then run <code>commands.sh</code> step by step, replacing each <code>&lt;...&gt;</code> placeholder completely.</p>`,
  files:{ 'src/opend/main.mo': MAIN_366, 'commands.sh': CMD366 },
  steps:[
    { title:'Iter', text:'Needed to turn the map\'s key iterator into an array, as in the token\'s upgrade hooks.', file:'src/opend/main.mo', lines:L(MAIN_366, 'import Iter') },
    { title:'getListedNFTs', text:'The keys of <code>mapOfListings</code> are exactly the listed NFTs\' ids.', file:'src/opend/main.mo', lines:B(MAIN_366, 'public query func getListedNFTs') },
    { title:'isListed (365)', text:'<code>get</code> returns <code>null</code> when there is no listing.', file:'src/opend/main.mo', lines:B(MAIN_366, 'public query func isListed') },
    { title:'getOriginalOwner', text:'Once listed, the NFT\'s owner is OpenD, so the seller is only known from the listing. A missing listing returns early.', file:'src/opend/main.mo', lines:B(MAIN_366, 'public query func getOriginalOwner') },
    { title:'getListedNFTPrice', text:'The same unwrapping; 0 when not listed.', file:'src/opend/main.mo', lines:B(MAIN_366, 'public query func getListedNFTPrice') },
    { title:'Mint as someone else', text:'Everything minted in the browser belongs to the same user, so it would never see a Buy button. The terminal identity is a different principal: mint from the command line and keep the id it prints.', file:'commands.sh', lines:L(CMD366, '# 1.', 'dfx canister call opend mint') },
    { title:'List and hand over', text:'List it with a price, look up OpenD\'s id, then call the NFT canister itself to give it to OpenD. Principal arguments go in quotes; the canister being called does not.', file:'commands.sh', lines:L(CMD366, '# 2.', 'transferOwnership') },
  ],
  quiz:[
    { q:'Why is the seller read from the listing and not from the NFT canister?', options:['The NFT canister is private','Once listed, the NFT\'s owner is OpenD itself','Listings are faster','The NFT forgets its owner'], answer:1, why:'transferOwnership made OpenD the owner; itemOwner remembers who listed it.' },
    { q:'Why create a listing from the terminal to test the Buy button?', options:['The browser cannot list','The terminal identity is a different principal from the browser user, so its listing is not "your own"','Terminal calls are free','Buy buttons only work for CLI NFTs'], answer:1, why:'Buy is hidden on the current user\'s own listings, so the test needs someone else\'s.' },
  ],
});

PG.add({
  id:'l367', index:367, udemyId:31673804, minutes:32, section:'s42', slug:'buying-nfts', kind:'react', project:true,
  title:'Buying NFTs',
  blurb:'Buy pays the seller in DANG, then moves the NFT. <code>handleBuy</code> builds an actor for the token canister from the declarations copied over from the token-local project (imported as <code>tokenIdlFactory</code>), looks up the seller and price, and calls <code>transfer(sellerId, itemPrice)</code>. Only if that answers "Success" does it ask OpenD to <code>completePurchase</code> (lesson 367b). A loader runs meanwhile and the card disappears when it is done. The bar at the bottom shows your DANG balance and the token canister\'s id.',
  tasks:[
    'In <code>components/Item.jsx</code> import <code>{ idlFactory as tokenIdlFactory }</code> from <code>"../../../declarations/token"</code>; the alias avoids a clash with the NFT\'s <code>idlFactory</code>.',
    'In <code>handleBuy</code> show the loader, then create the token actor: <code>Actor.createActor(tokenIdlFactory, { agent, canisterId: Principal.fromText("…") })</code> with the token canister id from the bar.',
    'Look up <code>sellerId</code> with <code>getOriginalOwner(props.id)</code> and <code>itemPrice</code> with <code>getListedNFTPrice(props.id)</code>, then <code>const result = await tokenActor.transfer(sellerId, itemPrice);</code> and log it. Buy PixelPals #5: your balance drops by 2.',
    'If <code>result == "Success"</code>: <code>await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID)</code> and log "purchase: " plus the reply. Open My NFTs: #5 is yours now.',
    'Add <code>shouldDisplay</code> state (<code>true</code>), <code>style={{ display: shouldDisplay ? "inline" : "none" }}</code> on the outer div, and after a successful purchase hide the loader and <code>setDisplay(false)</code>.',
    'Buy PixelPals #6 (5 DANG) too, then check Discover (only #3 left) and My NFTs.',
  ],
  files: order(['components/Item.jsx'], Object.assign({
    'components/Item.jsx': ITEM_367_START,
    'components/Header.jsx': HEADER_366_DONE,
    'components/Gallery.jsx': GALLERY_366_DONE,
    'components/PriceLabel.jsx': PRICE_DONE,
    'components/Button.jsx': BUTTON_DONE,
    'components/Minter.jsx': MINTER_DONE,
    'components/App.jsx': APP,
    'components/Footer.jsx': FOOTER,
    'components/PlaygroundBar.jsx': BAR_WALLET,
    'index.jsx': INDEX,
  }, infra({ opend: OPEND_367, nft: NFT_ALL, form: true, token: true, seed: 'market' }))),
  solution:{ 'components/Item.jsx': ITEM_367_DONE },
  notes:`<p>The backend, <code>completePurchase</code>, and the token-local setup are lesson <b>367b</b>.</p>${PLAYGROUND_NOTE}`,
  explore:[{ title:'Two calls, one purchase', height:360, note:'Buy once normally, reset, then buy with step 2 failing.', html: DEMO_PURCHASE }],
  quiz:[
    { q:'Why import the token interface as <code>idlFactory as tokenIdlFactory</code>?', options:['It is required by dfx','Item already imports the NFT\'s idlFactory; two imports cannot share a name','Aliases are faster','To hide it'], answer:1, why:'The alias gives the second idlFactory its own name in the file.' },
    { q:'Why check that the payment says "Success" before calling <code>completePurchase</code>?', options:['To log it','So the NFT is only handed over once the buyer has actually paid','completePurchase needs the text','It is not necessary'], answer:1, why:'Insufficient funds must stop the purchase before ownership changes.' },
    { q:'What is the weakness of running the two steps from the browser?', options:['It is slow','If the second call fails or is skipped, the buyer has paid without receiving the NFT; a production marketplace does both in the backend','DANG cannot be transferred from a browser','There is none'], answer:1, why:'Two separate calls are not atomic, and a modified client could skip the payment check altogether.' },
  ],
});

PG.add({
  id:'l367b', index:367, sub:'b', udemyId:31673804, minutes:0, section:'s42', slug:'purchase-backend', kind:'walkthrough',
  title:'Purchase backend: completePurchase and the token canister',
  blurb:'The Motoko half of lecture 367. <code>completePurchase</code> finds the NFT, asks it to transfer itself to the buyer (OpenD is its owner while it is listed, so the call is allowed), then tidies up: delete the listing, filter the NFT out of the seller\'s list with <code>List.filter</code>, and add it to the buyer\'s. Payment itself happens in the token canister from the separate token-local project, whose declarations are copied into OpenD.',
  intro:`<p>Guided read of the final <code>main.mo</code> and the token-local setup.</p>
<p>One line is not in the lecture: after filtering, the seller's list has to be written back with <code>mapOfOwners.put(ownerId, ownedNFTs)</code>, or the sold NFT stays in their My NFTs. The reference code leaves it out too.</p>`,
  files:{ 'src/opend/main.mo': MAIN_367, 'commands.sh': CMD367 },
  steps:[
    { title:'The signature', text:'The NFT\'s id, the seller (<code>ownerId</code>) and the buyer (<code>newOwnerId</code>), all <code>Principal</code>s. Parameter names must match their uses exactly: a <code>newOwner</code> typo was the lecture\'s compile error.', file:'src/opend/main.mo', lines:L(MAIN_367, 'public shared(msg) func completePurchase') },
    { title:'Find the NFT', text:'The familiar unwrap, returning early when the id is unknown.', file:'src/opend/main.mo', lines:L(MAIN_367, 'var purchasedNFT', 'case (?result) result;', 'func completePurchase') },
    { title:'Transfer to the buyer', text:'An inter-canister call, so <code>await</code>. Inside the NFT canister <code>msg.caller</code> is OpenD, its current owner, so the transfer is allowed.', file:'src/opend/main.mo', lines:L(MAIN_367, 'let transferResult = await purchasedNFT.transferOwnership(newOwnerId)') },
    { title:'Remove the listing', text:'<code>HashMap.delete</code> removes the entry; deleting a missing key does nothing.', file:'src/opend/main.mo', lines:L(MAIN_367, 'mapOfListings.delete(id)') },
    { title:'Take it out of the seller\'s list', text:'<code>List.filter</code> keeps only the ids for which the function returns true, so everything except the sold NFT.', file:'src/opend/main.mo', lines:L(MAIN_367, 'var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId))', 'mapOfOwners.put(ownerId, ownedNFTs)') },
    { title:'Give it to the buyer', text:'The existing helper adds the id to the buyer\'s list. If the NFT transfer failed, its error text is passed back instead.', file:'src/opend/main.mo', lines:L(MAIN_367, 'addToOwnershipMap(newOwnerId, id)', 'return transferResult;', 'mapOfOwners.put(ownerId, ownedNFTs)') },
    { title:'The token canister', text:'token-local is the finished token from section 41, deployed on the same replica with your principal as owner. Its front end runs on 8081, its canister is funded from the terminal, and its faucet gives the browser user 10,000 DANG. Copy its <code>declarations/token</code> folder into OpenD and paste its id into <code>Item.jsx</code>.', file:'commands.sh', lines:L(CMD367, '# ---- in the token-local project', 'copy token-local') },
  ],
  quiz:[
    { q:'Why is OpenD allowed to call <code>transferOwnership</code> on the NFT?', options:['OpenD created it','While the NFT is listed, OpenD is its owner, so it is the msg.caller the NFT accepts','Anyone can call it','The buyer signed the call'], answer:1, why:'Listing moved ownership to OpenD; that is what lets it hand the NFT to a buyer later.' },
    { q:'What does <code>List.filter(ownedNFTs, func ...)</code> return?', options:['The removed id','A new list with only the elements for which the function returned true','A Bool','The same list, changed in place'], answer:1, why:'filter builds a new list; that is why the result has to be assigned (and, with the fix, put back in the map).' },
    { q:'Why copy the token project\'s declarations into OpenD?', options:['To deploy the token again','The front end needs the token canister\'s interface (idlFactory) to call it','Declarations hold the balances','dfx needs them to start'], answer:1, why:'Calling any canister from JavaScript needs its idlFactory; the canister id is supplied separately.' },
  ],
});

PG.add({
  id:'l368', index:368, udemyId:31673812, minutes:0, section:'s42', slug:'supernova-hackathon', kind:'read',
  title:'Join the $6 Million Dollar Supernova Hackathon',
  blurb:'An announcement from 2022 for a global Internet Computer hackathon, with prize money and grants for projects built on the skills from this part of the course. The event is long over; the lasting point is that the Internet Computer ecosystem runs hackathons and developer grant programmes, which can fund a serious project.',
});

})();
