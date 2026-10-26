# Web Dev Playground

A hands-on companion to **The Complete Full-Stack Web Development Bootcamp** (Dr. Angela Yu,
Udemy): one page for every lecture, numbered as in the course, where you practise exactly what
that lecture teaches — in the browser, with nothing to install.

**▶ [Open the playground](https://chattock.github.io/web-dev-playground/)**

---

## What's in it

Every one of the course's 374 lectures has a page, grouped into the course's 45 sections. Each
page has the lecture number, a link back to the Udemy lecture, a short summary, the task, and
these tabs:

- **Build** — the lecture's exercise or project, unsolved, with TODO comments. Edit on the left,
  see the result on the right. *Show solution* swaps the answer in and back out without losing
  your work; *Reset* restores the original exercise.
- **Explore** — interactive demos: sliders and dropdowns wired to real CSS and JavaScript, with a
  readout of the exact code you just made.
- **Notes** — detailed notes on the lecture: what the code does and how it works, the task's
  steps and solution, and common mistakes.
- **Quiz** — a few quick questions on the key points.

### What runs where

| Lessons | How they run |
|---|---|
| HTML, CSS, Bootstrap, JavaScript, the DOM, jQuery | Live preview with a console (`console.log`, `alert`, and `prompt` with queued answers) |
| React | JSX compiled in your browser with Babel, rendered with React 18 |
| Node, Express, EJS, APIs, authentication | A simulated Node server: press **Run**, then use the built-in browser (links, forms, cookies) or the Postman-style panel to send requests to `localhost:3000` |
| SQL and PostgreSQL | A real Postgres running in your browser (PGlite, downloaded once, about 12 MB) |
| The command line and git | A shell with a virtual filesystem and a simulated git, with a live file tree and checks |
| Web3 / Motoko | Code walkthroughs that highlight the lines each step talks about, plus React front ends running against mocked canisters |
| Theory, tips and admin lectures | A reading page with the notes and a quiz |

The course's own APIs (the secrets API, the bored API, a joke API) are built in as mocks with
original data, so the API lessons work offline.

## Features

- Search every lecture by number or title (press `/`)
- Edits save automatically per lesson in your browser
- "Done" checkboxes with progress per section
- Preview width switcher for testing media queries
- `#/l/131` jumps straight to lecture 131
- `#/selftest` runs every lesson's solution and lists any that fail

## Running it locally

No build step and nothing to install. Either:

```bash
python3 server.py
```

…or on macOS double-click `start.command`. Then open <http://localhost:4173>.

The SQL lessons load PGlite from a CDN the first time, so they need a connection once.

## Structure

```
index.html              app shell
app/core.js             router, sidebar, lesson page, quiz, shared editor workbench
app/kit-*.js            one kit per lesson kind: build/js, react, node, sql, terminal, read/walkthrough
app/sandbox/            the Node simulator and the shell/git simulator (also used by the tools)
data/index.js           generated list of every lesson (for the sidebar)
data/sNN.js             lessons, one file per course section (big sections also have sNN-2.js)
data/notes/sNN.js       generated lecture notes
content/notes/NNN.json  the lecture notes, one file per lecture
content/manifest.txt    every lecture: number, Udemy id, title, type, length
docs/LESSON-FORMAT.md   how to write a lesson
tools/                  manifest, notes and validation scripts
vendor/                 CodeMirror, Bootstrap, jQuery, React, Babel, EJS, bcryptjs, qrcode-generator
```

To add or change a lesson, edit `data/sNN.js` (see `docs/LESSON-FORMAT.md`), then:

```bash
node tools/manifest.js && node tools/build-notes.js
node tools/validate.js sNN
```

The validator runs each lesson's solution (Node servers, shell commands, SQL and React
compilation). The SQL checks need PGlite: `cd tools && npm install` once.

## Credit

Built for personal study alongside Dr. Angela Yu's course on Udemy. Summaries, notes, tasks and
quizzes are written in our own words, and the images and sounds are original (dice and drum
graphics are generated; sounds are synthesised in the browser). Exercise code follows what each
lecture builds, cross-checked against
[a student's finished course code](https://github.com/Harshit-Soni78/The-Complete-2024-Web-Development-Bootcamp-by-Dr._Angela_Yu).
