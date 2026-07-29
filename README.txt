WEB DEV PLAYGROUND
A local dev environment for the Angela Yu bootcamp — sections 5–11 and 14–15
==============================================================================

TO START IT
-----------
Double-click  start.command

A terminal window opens and your browser goes to http://localhost:4173
Leave that terminal window open while you work. Close it (or press Ctrl+C)
to stop the server.

If double-clicking is blocked by macOS security, open Terminal, drag the
folder in, and run:   python3 server.py


WHAT IS IN IT
-------------
All 54 lessons from the sections you are doing:

  Section 5   Introduction to CSS        3 lessons
  Section 6   CSS Properties             4
  Section 7   Intermediate CSS           4
  Section 8   Advanced CSS               5
  Section 9   Flexbox                    3
  Section 10  Grid                       4
  Section 11  Bootstrap                  3
  Section 14  JavaScript ES6            15
  Section 15  Intermediate JavaScript   13

Every lesson has three tabs:

  BUILD    The real course exercise, unsolved, with the TODO comments in
           place. Type in the editor on the left and the preview on the
           right updates as you type. "Show solution" swaps in the answer —
           press it again to get your own code back. "Reset" restores the
           original exercise.

  EXPLORE  25 interactive demos across the lessons. Sliders and dropdowns
           wired to real CSS — drag them and the page responds, while a
           readout underneath shows the exact rule you just wrote. This is
           the bit for "what actually happens if I change this".

  NOTES    The short version of the concept, with tables and gotchas, for
           checking something without rewatching the video.


THINGS WORTH KNOWING
--------------------
* Your edits save automatically, per lesson, in this browser. Come back
  tomorrow and your code is still there.

* Cmd+Enter (or Ctrl+Enter) forces a re-run. It also runs automatically
  about half a second after you stop typing.

* The preview width selector (Full width / Desktop / Tablet / Phone) is how
  you test media queries and Bootstrap breakpoints without resizing your
  whole window.

* The ↗ button opens the current preview in its own browser tab.

* Tick "done" on a lesson and a green check appears next to it in the
  sidebar, so you can see how far you have got.

* For JavaScript lessons, console.log output appears in the console panel.
  alert() is captured there too rather than popping a real dialog — it
  would block every time you typed a character otherwise.

* prompt() takes its answers from the "Prompt answers" box, one per line
  (or comma-separated). Some lessons come with an answer already filled in.


IF SOMETHING LOOKS WRONG
------------------------
* Reload the page (Cmd+R). The server never caches, so a reload always
  gets the newest version.

* A blank preview usually means a syntax error in your code — check the
  console panel underneath it.

* Bootstrap lessons load from a CDN, so they look best with an internet
  connection. A local copy is bundled as a fallback, so the layout classes
  still work offline.


BUILT FROM
----------
The course exercise files in:
github.com/Harshit-Soni78/The-Complete-2024-Web-Development-Bootcamp-by-Dr._Angela_Yu

Starters were rewritten back to their unsolved state (that repo has the
answers already filled in) so you get to do the work yourself.

No installation, no npm, no build step — just Python's built-in web server
and plain HTML, CSS and JavaScript. CodeMirror and Bootstrap are bundled in
vendor/ so nothing needs downloading.
