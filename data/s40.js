/* ===== Section 40 — Building DApps on ICP with a React Frontend ===== */
(function () {

/* ---------------------------------------------------------------------------
   The Keeper app as it stands at the end of the React section (lecture 320),
   moved into a dfx project called dkeeper. The playground cannot run the
   dkeeper_backend canister, so declarations/dkeeper_backend/index.js is a
   stand-in for the folder dfx generates, imported with the real project's path.
   --------------------------------------------------------------------------- */
const INDEX_JSX = `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

createRoot(document.getElementById("root")).render(<App />);
`;

const KEEPER_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  padding: 0 16px 24px;
  font-family: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  color: #3b3b3b;
  background-color: #f3f1ec;
  /* a dot pattern drawn by CSS, laid over the background colour */
  background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 14px 14px;
}

header {
  margin: 0 -16px;
  padding: 14px 28px;
  background: #f5ba13;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

header h1 {
  font-family: "Arial Rounded MT Bold", "Trebuchet MS", sans-serif;
  font-size: 1.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #fff;
}

/* each note is a pale yellow card; inline-block lets the cards sit in rows */
.note {
  display: inline-block;
  vertical-align: top;
  width: 240px;
  margin: 16px 16px 0 0;
  padding: 12px 14px 14px;
  background: #fff7c2;
  border-radius: 4px 4px 18px 4px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.14);
}

.note h1 {
  margin-bottom: 6px;
  font-size: 1.1rem;
}

.note p {
  font-size: 1rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

footer {
  margin-top: 32px;
  text-align: center;
  font-size: 0.85rem;
  color: #a9a59b;
}

/* the create-note form: a white card in the middle of the page */
form.create-note {
  position: relative;
  width: 480px;
  max-width: 100%;
  margin: 30px auto 24px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

form.create-note input,
form.create-note textarea {
  display: block;
  width: 100%;
  padding: 4px;
  font: inherit;
  font-size: 1.1rem;
  border: none;
  outline: none;
  resize: none;
}

/* The round add button hangs off the bottom-right corner of the form.
   This rule covers both the plain <button> you start with and the Fab that
   replaces it: <Zoom> adds no wrapper of its own, it animates the Fab itself. */
form.create-note > button {
  position: absolute;
  right: 18px;
  bottom: -18px;
}

form.create-note > button {
  width: 36px;
  height: 36px;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: #f5ba13;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.note button {
  float: right;
  margin-top: 6px;
  padding: 2px 4px;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #b88600;
  background: none;
  border: none;
  cursor: pointer;
}

/* icons are SVGs drawn in the current text colour */
header h1 svg {
  vertical-align: -3px;
  margin-right: 8px;
}

.note button svg {
  display: block;
}
`;

const HEADER_JSX = `import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";

function Header() {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
    </header>
  );
}

export default Header;
`;

const FOOTER_JSX = `import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
`;

const NOTE_JSX = `import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
`;

const CREATE_AREA_JSX = `import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault(); // a button inside a form submits it, which reloads the page

    if (note.title.trim() === "" && note.content.trim() === "") {
      return; // bonus: nothing to add
    }

    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
`;

/* the stand-in canister: same methods, argument checks and delays as the real one */
const MOCK_JS = `// declarations/dkeeper_backend/index.js
//
// PLAYGROUND STAND-IN for the folder dfx generates from the canister
// (src/declarations/dkeeper_backend in a real project). The real index.js
// creates an "actor" whose methods send every call over HTTPS to the
// dkeeper_backend canister. No replica runs in the browser, so this object
// has the same three methods instead. Like the real ones, they check their
// arguments, return Promises and answer after a delay: about a second for
// the update calls, a fifth of a second for the query.
//
// The notes are kept by the playground page, outside the preview, so they
// survive ▶ Run the way a canister's data survives a browser refresh.
// Reload the whole playground tab to start again with an empty canister.

const canister = (function () {
  try {
    const page = window.parent;
    if (!page.__dkeeperCanister) page.__dkeeperCanister = { notes: [] };
    return page.__dkeeperCanister;
  } catch (error) {
    return { notes: [] };
  }
})();

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// The real declarations encode arguments as Candid and reject wrong ones.
function checkArgs(method, args, types) {
  if (args.length !== types.length) {
    throw new Error(method + " expects " + types.length + " argument(s), got " + args.length);
  }
  args.forEach(function (value, i) {
    const ok = types[i] === "text" ? typeof value === "string" : Number.isInteger(value) && value >= 0;
    if (!ok) throw new Error("Invalid " + types[i] + " argument for " + method + ": " + JSON.stringify(value));
  });
}

// What Motoko's debug_show prints for a List: nested (note, rest) pairs ending in null.
function debugShow(notes) {
  return notes.reduceRight(function (rest, note) {
    return "?({title = " + JSON.stringify(note.title) + "; content = " + JSON.stringify(note.content) + "}, " + rest + ")";
  }, "null");
}

export const dkeeper_backend = {
  // public func createNote(titleText : Text, contentText : Text)
  createNote: async function (...args) {
    checkArgs("createNote", args, ["text", "text"]);
    canister.notes = [{ title: args[0], content: args[1] }].concat(canister.notes); // List.push puts it first
    console.log("dkeeper_backend Debug.print: " + debugShow(canister.notes));
    await wait(1000);
  },

  // public query func readNotes() : async [Note]
  readNotes: async function (...args) {
    checkArgs("readNotes", args, []);
    await wait(200);
    console.log("dkeeper_backend.readNotes() → " + canister.notes.length + " note(s)");
    return canister.notes.map(function (note) { return { title: note.title, content: note.content }; });
  },

  // public func removeNote(id : Nat)
  removeNote: async function (...args) {
    checkArgs("removeNote", args, ["nat"]);
    const id = args[0];
    canister.notes = canister.notes.slice(0, id).concat(canister.notes.slice(id + 1)); // take ++ drop
    console.log("dkeeper_backend.removeNote(" + id + ") → " + canister.notes.length + " note(s) left");
    await wait(1000);
  },
};
`;

/* ---- components/App.jsx, lecture by lecture ---- */
const APP_IMPORTS = `import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
`;

const APP_DELETE = `  function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }
`;

const APP_RENDER = `
  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => (
        <Note
          key={index}
          id={index}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
`;

const APP_344 = `import React, { useState } from "react";
` + APP_IMPORTS + `
function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

` + APP_DELETE + APP_RENDER;

const APP_345_START = `import React, { useState } from "react";
` + APP_IMPORTS + `// TODO 1: import { dkeeper_backend } from the generated declarations folder
//         (from this file the path is "../../../declarations/dkeeper_backend")

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      // TODO 2: send the note to the canister with createNote(title, content)
      return [...prevNotes, newNote];
    });
  }

` + APP_DELETE + APP_RENDER;

const APP_345 = `import React, { useState } from "react";
` + APP_IMPORTS + `import { dkeeper_backend } from "../../../declarations/dkeeper_backend";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      dkeeper_backend.createNote(newNote.title, newNote.content);
      return [...prevNotes, newNote];
    });
  }

` + APP_DELETE + APP_RENDER;

const APP_346_START = `import React, { useState } from "react"; // TODO 1: also import useEffect
` + APP_IMPORTS + `import { dkeeper_backend } from "../../../declarations/dkeeper_backend";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      dkeeper_backend.createNote(newNote.title, newNote.content);
      // TODO 4: put the new note first, to match the canister's newest-first order
      return [...prevNotes, newNote];
    });
  }

  // TODO 2: async function fetchData(): await dkeeper_backend.readNotes()
  //         and put the array it returns into state with setNotes

  // TODO 3: useEffect that calls fetchData once, after the first render

` + APP_DELETE + APP_RENDER;

const APP_346_TOP = `import React, { useState, useEffect } from "react";
` + APP_IMPORTS + `import { dkeeper_backend } from "../../../declarations/dkeeper_backend";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      dkeeper_backend.createNote(newNote.title, newNote.content);
      return [newNote, ...prevNotes];
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const notesArray = await dkeeper_backend.readNotes();
    setNotes(notesArray);
  }

`;

const APP_346 = APP_346_TOP + APP_DELETE + APP_RENDER;

const APP_347_START = APP_346_TOP + `  function deleteNote(id) {
    // TODO: remove the note from the canister too, with removeNote(id)
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }
` + APP_RENDER;

const APP_347 = APP_346_TOP + `  function deleteNote(id) {
    dkeeper_backend.removeNote(id);
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }
` + APP_RENDER;

/* every React lesson after 344 has the same supporting files */
function keeperFiles(app) {
  return {
    'components/App.jsx': app,
    'declarations/dkeeper_backend/index.js': MOCK_JS,
    'index.jsx': INDEX_JSX,
    'components/CreateArea.jsx': CREATE_AREA_JSX,
    'components/Note.jsx': NOTE_JSX,
    'components/Header.jsx': HEADER_JSX,
    'components/Footer.jsx': FOOTER_JSX,
    'styles.css': KEEPER_CSS,
  };
}

/* ---- the Motoko canister, lecture by lecture ---- */
const MO_345 = `import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper {

  public type Note = {
    title: Text;
    content: Text;
  };

  var notes: List.List<Note> = List.nil<Note>();

  public func createNote(titleText: Text, contentText: Text) {

    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    notes := List.push(newNote, notes);
    Debug.print(debug_show(notes));
  };

}
`;

const MO_346 = `import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper {

  public type Note = {
    title: Text;
    content: Text;
  };

  var notes: List.List<Note> = List.nil<Note>();

  public func createNote(titleText: Text, contentText: Text) {

    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    notes := List.push(newNote, notes);
    Debug.print(debug_show(notes));
  };

  public query func readNotes(): async [Note] {
    return List.toArray(notes);
  };

}
`;

const MO_347 = `import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper {

  public type Note = {
    title: Text;
    content: Text;
  };

  stable var notes: List.List<Note> = List.nil<Note>();

  public func createNote(titleText: Text, contentText: Text) {

    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    notes := List.push(newNote, notes);
    Debug.print(debug_show(notes));
  };

  public query func readNotes(): async [Note] {
    return List.toArray(notes);
  };

  public func removeNote(id: Nat) {
    let listFront = List.take(notes, id);
    let listBack = List.drop(notes, id + 1);
    notes := List.append(listFront, listBack);
  };

}
`;

const SH_345 = `# Terminal 1
dfx start

# Terminal 2: after every change to main.mo. This also regenerates
# src/declarations/dkeeper_backend, the folder the front end imports.
dfx deploy

# Try the canister without the front end:
dfx canister call dkeeper_backend createNote '("Shopping", "Milk and eggs")'
# terminal 1 now shows the Debug.print of the whole list
`;

const SH_346 = `dfx deploy
dfx canister call dkeeper_backend createNote '("Shopping", "Milk and eggs")'
dfx canister call dkeeper_backend createNote '("Idea", "A canister for recipes")'
dfx canister call dkeeper_backend readNotes
# prints a vec of records, newest first
`;

const SH_347 = `dfx deploy
dfx canister call dkeeper_backend createNote '("A", "first")'
dfx canister call dkeeper_backend createNote '("B", "second")'
dfx canister call dkeeper_backend createNote '("C", "third")'
dfx canister call dkeeper_backend readNotes          # C, B, A: newest first
dfx canister call dkeeper_backend removeNote '(1)'
dfx canister call dkeeper_backend readNotes          # C, A

# Change a line of code in main.mo (a new Debug.print will do), then:
dfx deploy
dfx canister call dkeeper_backend readNotes          # still C, A with stable var; empty without it
`;

const MO = 'src/dkeeper_backend/main.mo';
const SH = 'terminal.sh';

const MO_INTRO = `<p>Motoko cannot run in the browser, so this is a guided read: click a step to highlight the lines it describes. The React half of the lecture is the lesson before this one, where a stand-in plays the canister. To run the real thing, put this <code>main.mo</code> in <code>src/dkeeper_backend/</code> and use the commands in <code>terminal.sh</code>. In the video's older dfx the canister is called <code>dkeeper</code>.</p>`;

PG.add({
  id:'l344', index:344, udemyId:31673556, minutes:11, section:'s40', slug:'react-in-a-dfx-project', kind:'react',
  title:'How to Configure a DFX Created Project to Use React',
  blurb:'The Keeper app from the React section moves into a new dfx project called <b>dkeeper</b>: its components go into the frontend canister\'s source folder, and <code>index.js</code> is renamed <code>index.jsx</code> so the bundler compiles the JSX inside it. The app works as before, with no back end yet, so a refresh still loses every note.',
  tasks:[
    'The files on the left are the finished Keeper app, already moved into the dkeeper front end. <code>index.jsx</code> is the old <code>index.js</code>, renamed. In it, import <code>React</code>, <code>createRoot</code> from "react-dom/client" and <code>App</code> from "./components/App".',
    'Render <code>&lt;App /&gt;</code> into the element with the id <code>root</code>. Keeper appears in the preview. (The video\'s template uses <code>ReactDOM.render(&lt;App /&gt;, ...)</code>; either works here.)',
    'Add two notes and delete one: the React front end works inside the dkeeper project.',
    'Press <b>▶ Run</b>, the same as refreshing the browser. The notes are gone, because they only lived in React state. The next lecture stores them in a canister.',
    'Open the Notes tab for the configuration changes the lecture makes in the real project (webpack entry, loaders, tsconfig.json, package.json) and the commands that start it.',
  ],
  files:{
    'index.jsx':`// In the Keeper project this file was index.js. In the dfx project it is
// renamed index.jsx so the bundler compiles the JSX in it (the Notes tab
// shows the matching webpack change).

// TODO 1: import React, createRoot (from "react-dom/client") and App (from "./components/App")

// TODO 2: render <App /> into the element with the id "root"
`,
    'components/App.jsx': APP_344,
    'components/CreateArea.jsx': CREATE_AREA_JSX,
    'components/Note.jsx': NOTE_JSX,
    'components/Header.jsx': HEADER_JSX,
    'components/Footer.jsx': FOOTER_JSX,
    'styles.css': KEEPER_CSS,
  },
  solution:{ 'index.jsx': INDEX_JSX },
  notes:`<h3>In the real project</h3>
<p><code>dfx new dkeeper</code> creates two canisters: <code>dkeeper_backend</code> for the Motoko code and <code>dkeeper_frontend</code> for the web page (<code>dkeeper</code> and <code>dkeeper_assets</code> in the video). Keep the name dkeeper, because later imports are built from it.</p>
<p>The video's dfx version bundles the front end with webpack. After moving <code>index.html</code>, <code>index.js</code> and the <code>components</code> folder into <code>src/dkeeper_assets/src</code>, and <code>styles.css</code> into <code>src/dkeeper_assets/assets</code>, renaming index.js to index.jsx needs two edits in <code>webpack.config.js</code>:</p>
<pre data-lang="js">// 1. point the entry at the renamed file
entry: {
  index: path.join(__dirname, asset_entry).replace(/\\.html$/, ".jsx"),   // was ".js"
},

// 2. further down, uncomment the block that adds loaders for JSX and CSS
module: {
  rules: [
    { test: /\\.(ts|tsx|jsx)$/, loader: "ts-loader" },
    { test: /\\.css$/, use: ["style-loader", "css-loader"] },
  ],
},</pre>
<p>Then add the supplied <code>tsconfig.json</code> next to webpack.config.js (ts-loader reads it to compile JSX), and replace the contents of <code>package.json</code> with the supplied package.txt, which lists React, ReactDOM, the Material UI packages and the loaders.</p>
<p>With a current dfx, choose React when <code>dfx new dkeeper</code> asks for a front end. Its Vite set-up compiles JSX by itself, so you only copy the components into <code>src/dkeeper_frontend/src</code> and styles.css into its public folder; there is no webpack step.</p>
<h3>Start it</h3>
<pre data-lang="sh">dfx start        # terminal 1
npm install      # terminal 2; ignore the deprecation warnings
dfx deploy
npm start        # localhost:8080 in the video; the Vite template uses localhost:3000</pre>`,
  quiz:[
    { q:'Why is <code>index.js</code> renamed to <code>index.jsx</code>?', options:['Browsers only load .jsx files','So the build recognises the file as JSX and compiles it, with webpack\'s entry pointing at the new name','dfx refuses .js files','It makes the bundle smaller'], answer:1, why:'The loader rules match .jsx files, and the entry has to name the file that now exists.' },
    { q:'After this lecture, why does refreshing the page still lose the notes?', options:['dfx deletes them','They only live in React state in the browser; no canister stores them yet','The webpack config is wrong','Material UI clears them'], answer:1, why:'Nothing has been sent to a back end so far. That starts in the next lecture.' },
  ],
});

PG.add({
  id:'l345', index:345, udemyId:31673582, minutes:16, section:'s40', slug:'storing-data-on-a-canister', kind:'react',
  title:'Storing Data on a Canister',
  blurb:'The C of CRUD. A Motoko canister keeps the notes in a List (its code is in lesson 345b), and the React app sends each new note to it with <code>dkeeper_backend.createNote(title, content)</code>. The playground cannot run a canister, so <code>declarations/dkeeper_backend/index.js</code> is a stand-in for the folder dfx generates: same methods, the same argument checks, a short delay, and notes kept outside the preview so they survive ▶ Run as a canister\'s data survives a refresh.',
  tasks:[
    'Open <code>declarations/dkeeper_backend/index.js</code>. In a real project dfx generates this folder from the canister; here it is a stand-in with the same <code>createNote(titleText, contentText)</code> as the Motoko code in 345b.',
    'In <code>components/App.jsx</code>, import <code>{ dkeeper_backend }</code> from <code>"../../../declarations/dkeeper_backend"</code>, the same relative path as in the real project.',
    'Inside <code>addNote</code>, before the return, call <code>dkeeper_backend.createNote(newNote.title, newNote.content)</code>. Title comes first, as in the Motoko function.',
    'Add a note. The console shows the canister\'s <code>Debug.print</code> of its whole list, the output the lecture watches in the terminal running dfx start.',
    'Press <b>▶ Run</b> (a refresh): the page starts empty although the canister still has your notes. Reading them back is the next lecture.',
    'Swap the two arguments, add a note and look at the console: title and content are stored the wrong way round. Swap them back.',
  ],
  files: keeperFiles(APP_345_START),
  solution:{ 'components/App.jsx': APP_345 },
  notes:`<h3>Why index.jsx has no StrictMode</h3>
<p>In development, <code>&lt;React.StrictMode&gt;</code> runs state-updater functions twice to expose side effects. The lecture calls <code>createNote</code> inside the <code>setNotes</code> updater, so under StrictMode every note would reach the canister twice. Calling the canister before <code>setNotes</code>, not inside it, avoids the problem altogether.</p>`,
  quiz:[
    { q:'What is the <code>declarations</code> folder in a real dfx project?', options:['Hand-written TypeScript types','Code dfx generates from the canister\'s Candid interface, exporting an object whose methods call the canister','A copy of the Motoko source','The compiled CSS'], answer:1, why:'It is the bridge between JavaScript and Motoko; regenerate it with dfx deploy whenever main.mo changes.' },
    { q:'Why must <code>createNote(newNote.title, newNote.content)</code> pass the title first?', options:['Alphabetical order','The arguments are matched by position to the Motoko parameters (titleText, contentText)','The canister sorts them','It does not matter'], answer:1, why:'Candid arguments are positional, so swapping them swaps the stored fields.' },
  ],
});

PG.add({
  id:'l345b', index:345, sub:'b', udemyId:31673582, minutes:16, section:'s40', slug:'storing-data-motoko', kind:'walkthrough',
  title:'Storing Data on a Canister: the Motoko Side',
  blurb:'The DKeeper canister: a <code>Note</code> record type, a <code>List</code> of notes, and a public <code>createNote</code> that pushes each new note onto the front of the list and prints the result.',
  intro: MO_INTRO,
  files:{ 'src/dkeeper_backend/main.mo': MO_345, 'terminal.sh': SH_345 },
  steps:[
    { title:'Start from an empty actor', text:'Delete the template\'s greet function and write <code>actor DKeeper</code>. Keep the lecture\'s names so commands and imports line up.', file:MO, lines:[4,4] },
    { title:'A Note type', text:'<code>type</code> declares the shape of a value. Each field is <code>name: Type</code>, separated by semicolons, and <code>Text</code> is Motoko\'s string type. <code>public</code>, as in the lecture, lets code outside the actor refer to the type.', file:MO, lines:[6,9] },
    { title:'A List of notes', text:'<code>List.List&lt;Note&gt;</code> is a linked list from the base library, holding Notes. <code>List.nil&lt;Note&gt;()</code> is an empty one. Forget <code>import List</code> and the compiler reports an unbound variable List.', file:MO, lines:[11,11] },
    { title:'Two Text parameters', text:'createNote takes the title first, then the content. The JavaScript has to pass them in the same order.', file:MO, lines:[13,13] },
    { title:'Building a record', text:'A record value uses <code>=</code> where the type used <code>:</code>. The <code>: Note</code> on newNote checks that the record has exactly those fields.', file:MO, lines:[15,18] },
    { title:'push returns a new list', text:'<code>List.push(newNote, notes)</code> gives back a new list with newNote at the front. The old list is not changed, so the result is stored with <code>:=</code>. Adding at the front decides the order of the notes later on.', file:MO, lines:[20,20] },
    { title:'See it work', text:'<code>Debug.print(debug_show(notes))</code> prints the whole list in the terminal running dfx start. A List prints as nested pairs, ending in <code>null</code>.', file:MO, lines:[21,21] },
    { title:'Deploy and test', text:'<code>dfx deploy</code> rebuilds the canister and regenerates the declarations the front end imports. <code>dfx canister call</code> tests createNote without any front end.', file:SH, lines:[4,10] },
  ],
  quiz:[
    { q:'Which line builds a Note value?', options:['{ title : titleText; content : contentText }','{ title = titleText; content = contentText }','new Note(titleText, contentText)','Note(title: titleText)'], answer:1, why:'Types use colons; record values use equals signs.' },
    { q:'What does <code>List.push(newNote, notes)</code> do on its own?', options:['Appends newNote to the end of notes, in place','Returns a new list with newNote at the front; notes only changes when you assign the result back','Sorts the list','Removes the first note'], answer:1, why:'Motoko Lists are immutable values, which is why the code says notes := List.push(...).' },
  ],
});

PG.add({
  id:'l346', index:346, udemyId:31673590, minutes:12, section:'s40', slug:'retrieving-data-from-a-canister', kind:'react',
  title:'Retrieving Data from a Canister',
  blurb:'The R of CRUD. The canister gets a query, <code>readNotes</code> (lesson 346b), and App loads the notes when it first renders: <code>useEffect</code> with an empty dependency array calls an async <code>fetchData</code>. New notes now go first in the list, to match the canister\'s order. The canister is again the playground\'s stand-in in <code>declarations/</code>.',
  tasks:[
    'Add a note or two and press <b>▶ Run</b>: the canister keeps them (see its list in the console), but the page starts empty.',
    'Import <code>useEffect</code> next to <code>useState</code>.',
    'Write <code>async function fetchData()</code>: await <code>dkeeper_backend.readNotes()</code> and pass the array it returns to <code>setNotes</code>.',
    'Call it with <code>useEffect(() =&gt; { fetchData(); }, []);</code>. Now ▶ Run brings the notes back.',
    'Delete the <code>[]</code> and watch the console: each <code>setNotes</code> re-renders App, each render runs the effect again, so readNotes is called over and over. Put the <code>[]</code> back.',
    'Add a note, then press ▶ Run: it jumps from the end to the start. Make <code>addNote</code> return <code>[newNote, ...prevNotes]</code> so the page uses the canister\'s newest-first order.',
  ],
  files: keeperFiles(APP_346_START),
  solution:{ 'components/App.jsx': APP_346 },
  quiz:[
    { q:'Why does <code>useEffect</code> get <code>[]</code> as its second argument?', options:['To pass the notes in','So the effect runs once, after the first render, instead of after every render','To make fetchData async','It is required syntax with no effect'], answer:1, why:'Without it, fetchData → setNotes → re-render → effect → fetchData… repeats forever.' },
    { q:'Why is <code>fetchData</code> a separate async function instead of making the effect itself async?', options:['async functions cannot call canisters','The function passed to useEffect must not return a Promise, so the async work goes in a function it calls','useEffect only accepts arrow functions','For speed'], answer:1, why:'React expects the effect to return nothing or a cleanup function, and an async function always returns a Promise.' },
  ],
});

PG.add({
  id:'l346b', index:346, sub:'b', udemyId:31673590, minutes:12, section:'s40', slug:'retrieving-data-motoko', kind:'walkthrough',
  title:'Retrieving Data from a Canister: the Motoko Side',
  blurb:'One new function: the query <code>readNotes</code> converts the List to an array with <code>List.toArray</code> and returns it, so JavaScript receives a plain array of notes.',
  intro: MO_INTRO,
  files:{ 'src/dkeeper_backend/main.mo': MO_346, 'terminal.sh': SH_346 },
  steps:[
    { title:'readNotes is a query', text:'It only reads the notes, so it is a <code>query</code>: no consensus needed, and it answers fast. That matters for a function called every time the page loads.', file:MO, lines:[24,24] },
    { title:'Returning an array', text:'The return type is <code>async [Note]</code>, an array of Notes. In JavaScript it arrives as an ordinary array of <code>{ title, content }</code> objects, ready for setNotes.', file:MO, lines:[24,24] },
    { title:'List.toArray', text:'The notes stay stored as a List, because putting an item at the front of a List is cheap, while an immutable array would be copied on every change. They are converted only on the way out. A List sent as it is would reach JavaScript as nested pairs.', file:MO, lines:[25,25] },
    { title:'Deploy and test', text:'Deploy so the declarations include readNotes, then call it from the terminal.', file:SH, lines:[1,5] },
  ],
  quiz:[
    { q:'Why is readNotes declared with <code>query</code>?', options:['Queries can change state faster','It only reads, so it can skip consensus and answer quickly','Queries are the only functions that return arrays','Update functions cannot return values'], answer:1, why:'Reads that change nothing should be queries.' },
    { q:'Why convert with <code>List.toArray</code> before returning?', options:['Lists cannot be stored','So JavaScript receives a plain array instead of nested list pairs','toArray sorts the notes','Arrays are stable and Lists are not'], answer:1, why:'Arrays map directly to JavaScript arrays; a linked list would arrive as nested pairs.' },
  ],
});

PG.add({
  id:'l347', index:347, udemyId:31673596, minutes:17, section:'s40', slug:'deleting-and-persistence', kind:'react', project:true,
  title:'Deleting and Persistance',
  blurb:'The D of CRUD. <code>deleteNote</code> now also calls <code>removeNote(id)</code> on the canister, so a deleted note stays deleted after a refresh. The Motoko side (347b) builds removeNote from take, drop and append, and a <code>stable</code> variable keeps the notes when the canister is upgraded. The canister is the playground\'s stand-in in <code>declarations/</code>.',
  tasks:[
    'Delete a note, then press <b>▶ Run</b>: it is back, because only React state forgot it.',
    'In <code>deleteNote</code>, call <code>dkeeper_backend.removeNote(id)</code> before updating the state.',
    'Delete a note and press ▶ Run again: it stays gone. The console shows how many notes the canister has left.',
    'Check that the indexes line up: add three notes, delete the middle one, press ▶ Run. Both lists are newest-first, so position <code>id</code> on the page is position <code>id</code> in the canister.',
    'Read lesson 347b for how removeNote is built from take, drop and append, and how <code>stable</code> keeps the notes through upgrades.',
  ],
  files: keeperFiles(APP_347_START),
  solution:{ 'components/App.jsx': APP_347 },
  quiz:[
    { q:'Why does a deleted note come back after a refresh if only <code>setNotes</code> removes it?', options:['React caches it','fetchData reads it again from the canister, which still has it','The delete button is broken','useEffect re-creates it'], answer:1, why:'The canister is the source of truth; the page reloads from it.' },
    { q:'Why can the same <code>id</code> be used on the page and in the canister?', options:['ids are random','Both lists are in newest-first order, so the positions match','The canister searches by title','React re-sorts the canister'], answer:1, why:'The previous lecture made addNote prepend, matching List.push on the canister.' },
  ],
});

PG.add({
  id:'l347b', index:347, sub:'b', udemyId:31673596, minutes:17, section:'s40', slug:'deleting-and-persistence-motoko', kind:'walkthrough',
  title:'Deleting and Persistence: the Motoko Side',
  blurb:'<code>removeNote(id)</code> cuts one note out of the list with <code>take</code>, <code>drop</code> and <code>append</code>, and <code>stable var notes</code> keeps the list when the canister\'s code is upgraded, so the canister works like a small database.',
  intro: MO_INTRO,
  files:{ 'src/dkeeper_backend/main.mo': MO_347, 'terminal.sh': SH_347 },
  steps:[
    { title:'No remove-at-index helper', text:'The List module used here had no function that removes the item at a position, so removeNote builds one from three that exist. <code>id</code> is a Nat: the note\'s position, counting from 0.', file:MO, lines:[28,28] },
    { title:'take: everything before it', text:'<code>List.take(notes, id)</code> returns the first id items, the notes in front of the one to delete.', file:MO, lines:[29,29] },
    { title:'drop: everything after it', text:'<code>List.drop(notes, id + 1)</code> skips the first id + 1 items, so it keeps what comes after the note. Without the + 1 the note itself would be kept.', file:MO, lines:[30,30] },
    { title:'append, then store', text:'<code>List.append(listFront, listBack)</code> joins the two parts. Lists are immutable values, so nothing changes until the result is assigned with <code>:=</code>.', file:MO, lines:[31,31] },
    { title:'Index 0 is the newest note', text:'push adds at the front, so position 0 holds the newest note, as on the page once addNote returns <code>[newNote, ...prevNotes]</code>. That is why the page can send its own index.', file:MO, lines:[20,20] },
    { title:'Keeping notes through upgrades', text:'A plain <code>var</code> starts empty again whenever changed code is deployed. <code>stable var</code> keeps the list. Current dfx templates write <code>persistent actor</code>, where every variable is stable unless marked <code>transient</code>.', file:MO, lines:[11,11] },
    { title:'Test it', text:'Create three notes, remove the middle one, then upgrade the canister and read again.', file:SH, lines:[1,11] },
  ],
  explore:[{
    title:'take, drop and append', height:450,
    note:'The list was built by pushing A, B, C and D, so D comes first. Pick an id and see which part each function keeps. Untick <code>+ 1</code> to see the off-by-one mistake, and push more notes to see where new ones go.',
    html:`
<style>
  .list{display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-height:50px}
  .item{min-width:58px;padding:7px 10px;border-radius:8px;background:#fff7c2;border:1px solid #e8d77a;
        font:600 13px -apple-system,BlinkMacSystemFont,sans-serif;text-align:center}
  .item small{display:block;font:11px ui-monospace,Menlo,monospace;color:#8a7a2a}
  .item.gone{background:#ffe1e5;border-color:#f0a3ae;text-decoration:line-through;opacity:.75}
  .item.front{background:#dff1ff;border-color:#8cc8ef}
  .item.back{background:#e3f7e9;border-color:#8fd3a5}
  .empty{font:12px ui-monospace,Menlo,monospace;color:#8b92a8}
  .rowl{display:flex;gap:12px;align-items:center;margin:6px 0}
  .rowl b{flex:0 0 190px;font:12.5px ui-monospace,Menlo,monospace;color:#3c435c}
</style>
<div class="knobs">
  <label>removeNote( <select id="id"></select> )</label>
  <label><input type="checkbox" id="plus" checked> <code>id + 1</code> in drop</label>
  <button id="apply">run removeNote</button>
  <button id="push">createNote (push)</button>
  <button id="reset">reset</button>
</div>
<div class="stage">
  <div class="rowl"><b>notes</b><div class="list" id="all"></div></div>
  <div class="rowl"><b>take(notes, id)</b><div class="list" id="front"></div></div>
  <div class="rowl"><b id="dropLabel"></b><div class="list" id="back"></div></div>
  <div class="rowl"><b>append(front, back)</b><div class="list" id="result"></div></div>
</div>
<p class="note" id="msg"></p>
<script>
var notes = [], nextLetter = 0, idSel = document.getElementById('id'), plus = document.getElementById('plus');
var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function push() { notes.unshift(LETTERS[nextLetter % 26]); nextLetter++; }
function reset() { notes = []; nextLetter = 0; push(); push(); push(); push(); fillSelect(0); draw(); }
function fillSelect(keep) {
  idSel.innerHTML = notes.map(function (n, i) { return '<option value="' + i + '">' + i + '</option>'; }).join('');
  idSel.value = String(Math.min(keep, Math.max(notes.length - 1, 0)));
}
function boxes(list, cls) {
  if (!list.length) return '<span class="empty">empty list</span>';
  return list.map(function (n, i) { return '<div class="item ' + (cls ? cls(i) : '') + '">' + n + '</div>'; }).join('');
}
function draw() {
  var id = Number(idSel.value) || 0, skip = plus.checked ? id + 1 : id;
  var front = notes.slice(0, id), back = notes.slice(skip), result = front.concat(back);
  document.getElementById('all').innerHTML = notes.length ? notes.map(function (n, i) {
    var cls = i < id ? 'front' : (i === id && plus.checked ? 'gone' : 'back');
    return '<div class="item ' + cls + '">' + n + '<small>' + i + '</small></div>';
  }).join('') : '<span class="empty">empty list</span>';
  document.getElementById('dropLabel').textContent = plus.checked ? 'drop(notes, id + 1)' : 'drop(notes, id)';
  document.getElementById('front').innerHTML = boxes(front, function () { return 'front'; });
  document.getElementById('back').innerHTML = boxes(back, function () { return 'back'; });
  document.getElementById('result').innerHTML = boxes(result);
  document.getElementById('msg').textContent = !notes.length ? 'The list is empty: push some notes.' :
    plus.checked ? 'Note ' + notes[id] + ' (index ' + id + ') is in neither part, so the joined list no longer has it.'
                 : 'Without + 1, drop keeps the note at index ' + id + ', so nothing is removed: the result equals the original list.';
}
idSel.addEventListener('change', draw);
plus.addEventListener('change', draw);
document.getElementById('apply').addEventListener('click', function () {
  if (!notes.length) return;
  var id = Number(idSel.value) || 0, skip = plus.checked ? id + 1 : id;
  notes = notes.slice(0, id).concat(notes.slice(skip));
  fillSelect(id);
  draw();
});
document.getElementById('push').addEventListener('click', function () { push(); fillSelect(0); draw(); });
document.getElementById('reset').addEventListener('click', reset);
reset();
<\/script>`,
  }],
  quiz:[
    { q:'Why is it <code>List.drop(notes, id + 1)</code> and not <code>List.drop(notes, id)</code>?', options:['Lists count from 1','The + 1 also skips the note being removed; without it the note stays in the result','drop needs a positive number','It makes the function faster'], answer:1, why:'take(notes, id) stops just before the note and drop(notes, id + 1) starts just after it.' },
    { q:'What does <code>stable var notes</code> change?', options:['The notes become read-only','The notes survive when the canister\'s code is upgraded','Notes are saved in the browser','removeNote becomes a query'], answer:1, why:'A plain var is set up from scratch on every upgrade; a stable one is saved and restored.' },
  ],
});

})();
