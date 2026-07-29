# Web Dev Playground

An interactive playground for **The Complete Web Development Bootcamp** (Dr. Angela Yu) —
every lesson from sections 1–11 and 14–15, with the real course exercise, a live preview
that updates as you type, and interactive demos for poking at how each concept behaves.

**▶ [Open the playground](https://chattock.github.io/web-dev-playground/)**

---

## What's in it

67 lessons across 13 sections:

| Section | Topic | Lessons |
|---|---|---|
| 1 | Front-End Web Development | 1 |
| 2 | Introduction to HTML | 4 |
| 3 | Intermediate HTML | 5 |
| 4 | Multi-Page Websites | 3 |
| 5 | Introduction to CSS | 3 |
| 6 | CSS Properties | 4 |
| 7 | Intermediate CSS | 4 |
| 8 | Advanced CSS | 5 |
| 9 | Flexbox | 3 |
| 10 | Grid | 4 |
| 11 | Bootstrap | 3 |
| 14 | JavaScript ES6 | 15 |
| 15 | Intermediate JavaScript | 13 |

Every lesson has three tabs:

- **Build** — the course exercise, unsolved, with its TODO comments. Edit on the left, the
  preview updates as you type. *Show solution* swaps the answer in and back out without
  losing your work; *Reset* restores the original exercise.
- **Explore** — 36 interactive demos. Sliders and dropdowns wired to real CSS, with a
  readout showing the exact rule you just made. Box model dissector, specificity showdown,
  flexbox playground, grid track builder, media query simulator, file path resolver, and more.
- **Notes** — the concept in short form, with tables and the usual gotchas.

## Features

- Live preview with a ~450ms debounce, or `Cmd/Ctrl + Enter` to force a run
- Edits save automatically per lesson in `localStorage`
- Preview width switcher (Full / Desktop / Tablet / Phone) for testing media queries
- Console panel capturing `console.log`, `alert()` and errors
- `prompt()` reads from a queued-answers box so nothing blocks while you type
- Per-lesson "done" checkboxes

## Running it locally

No build step, no npm. Either:

```bash
python3 server.py
```

…or on macOS just double-click `start.command`. Then open <http://localhost:4173>.

It is entirely static, so you can also just open `index.html` — though a server is tidier.

## Built with

Plain HTML, CSS and JavaScript. [CodeMirror 5](https://codemirror.net/5/) for the editors and
[Bootstrap 5](https://getbootstrap.com/) for the Bootstrap lessons, both vendored in `vendor/`
so nothing needs downloading and it works offline.

## Structure

```
index.html          app shell
app/app.js          engine — router, editors, preview, console, demo kit
app/style.css       styling
data/sNN.js         lesson content, one file per course section
vendor/             CodeMirror + Bootstrap
server.py           local static server
```

Adding a lesson means one `PG.add({...})` call in the relevant `data/sNN.js`.

## Credit

Exercises are from Dr. Angela Yu's course on Udemy, with starters rewritten back to their
unsolved state. Course files referenced from
[this repo](https://github.com/Harshit-Soni78/The-Complete-2024-Web-Development-Bootcamp-by-Dr._Angela_Yu).
Built for personal study.
