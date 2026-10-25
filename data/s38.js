/* ===== Section 38 — Build Your First DeFi DApp: DBANK ===== */

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
