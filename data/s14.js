/* ===== Section 14 — Introduction to JavaScript ES6 ===== */
/* JS lessons use layout:'js' — big console, small preview strip underneath. */

PG.add({
  id:'s14-alerts', index:76, udemyId:12371344, minutes:14, section:'s14', slug:'alerts', lesson:'14.1', layout:'js',
  title:'Alerts & console.log',
  blurb:'JavaScript adds <b>behaviour</b> to a page. <code>alert()</code> pops a message box; <code>console.log()</code> writes to the console — which is the one you will actually use every day.',
  tasks:[
    'Pop up an alert saying anything you like.',
    'Log something to the console as well and see the difference in the panel below.',
    'Log a number, a string and a calculation — <code>console.log(7 * 6)</code>.'
  ],
  files:{ js:`// TODO: pop an alert

// TODO: log to the console
` },
  solution:{ js:`alert("Hello from JavaScript!");

console.log("This goes to the console.");
console.log(7 * 6);
console.log("Angela", "Yu", 2026);
` },
  notes:`
    <h3>alert vs console.log</h3>
    <ul>
      <li><code>alert()</code> — interrupts the user with a dialog. Fine for a demo, annoying in real life.</li>
      <li><code>console.log()</code> — writes to the developer console. Invisible to users, essential to you.</li>
    </ul>
    <p>In this playground <code>alert()</code> is captured into the console panel rather than a real dialog, so it doesn't block while you type.</p>
    <h3>Semicolons</h3>
    <p>JavaScript mostly inserts them for you, but write them anyway — it avoids a small set of genuinely nasty bugs.</p>`
});


PG.add({
  id:'s14-data-types', index:77, udemyId:12371362, minutes:4, section:'s14', slug:'data-types', lesson:'14.2', layout:'js',
  title:'Data Types',
  blurb:'Every value has a type. The ones that matter early: <b>string</b> (text in quotes), <b>number</b>, <b>boolean</b> (true/false), plus <b>null</b> and <b>undefined</b> for "nothing".',
  tasks:[
    'Log the type of several values using <code>typeof</code>.',
    'Notice that <code>"7" + 1</code> and <code>7 + 1</code> give completely different answers. Work out why.',
    'Try <code>typeof null</code> — the answer is famously wrong. It is a bug from 1995 that can never be fixed.'
  ],
  files:{ js:`// TODO: log the type of each of these
console.log(typeof "hello");

// what about 42, true, null, undefined, and [1,2,3] ?


// TODO: the classic gotcha
console.log("7" + 1);
console.log(7 + 1);
` },
  solution:{ js:`console.log(typeof "hello");     // string
console.log(typeof 42);          // number
console.log(typeof true);        // boolean
console.log(typeof undefined);   // undefined
console.log(typeof null);        // "object"  <- the famous bug
console.log(typeof [1, 2, 3]);   // "object"  (arrays are objects)

// + means "add" for numbers and "join" for strings.
// If either side is a string, JavaScript converts the other one to a string too.
console.log("7" + 1);   // "71"  <- string join
console.log(7 + 1);     // 8     <- addition
console.log("7" - 1);   // 6     <- minus has no string meaning, so it converts to number
console.log(Number("7") + 1);  // 8  <- convert explicitly, the safe way
` },
  notes:`
    <h3>The types</h3>
    <table>
      <tr><th>Type</th><th>Example</th></tr>
      <tr><td>string</td><td><code>"hello"</code> · <code>'hi'</code> · <code>\`hey\`</code></td></tr>
      <tr><td>number</td><td><code>42</code> · <code>3.14</code> · <code>-7</code> (no separate integer type)</td></tr>
      <tr><td>boolean</td><td><code>true</code> · <code>false</code></td></tr>
      <tr><td>undefined</td><td>A variable declared but never given a value</td></tr>
      <tr><td>null</td><td>Deliberately empty</td></tr>
      <tr><td>object</td><td><code>{}</code>, <code>[]</code>, functions</td></tr>
    </table>
    <h3>Type coercion</h3>
    <p>JavaScript converts types behind your back. <code>"7" + 1</code> is <code>"71"</code> because <code>+</code> means "join" when a string is involved. This bites everyone the first time they read a number out of a form — form inputs are always strings, so wrap them in <code>Number(...)</code>.</p>`
});


PG.add({
  id:'s14-variables', index:78, udemyId:12371610, minutes:10, section:'s14', slug:'variables', lesson:'14.3', layout:'js',
  title:'Variables',
  blurb:'A variable is a labelled box for a value. <code>let</code> for something that will change, <code>const</code> for something that will not. (<code>var</code> is the old way — you will see it in the course videos and in old code.)',
  tasks:[
    'Ask for the user\'s name with <code>prompt()</code> and store it in a variable.',
    'Alert a greeting that uses it.',
    'Try reassigning a <code>const</code> and read the error you get in the console.'
  ],
  answers:'Ada',
  files:{ js:`// The Prompt answers box (top right of this console) feeds prompt() —
// there is already an answer queued for you.

// TODO: store the answer in a variable


// TODO: greet them by name
` },
  solution:{ js:`let yourName = prompt("What is your name?");

alert("Have a good day " + yourName + "!");
console.log("Stored:", yourName);

// let can be changed later
yourName = "Jimmy";
console.log("Changed to:", yourName);

// const cannot — uncomment to see the error
const pi = 3.14159;
// pi = 3;   // TypeError: Assignment to constant variable.
console.log("pi is still", pi);
` },
  notes:`
    <h3>let vs const vs var</h3>
    <table>
      <tr><th></th><th>Reassign?</th><th>Scope</th></tr>
      <tr><td><code>const</code></td><td>No</td><td>Block <code>{ }</code></td></tr>
      <tr><td><code>let</code></td><td>Yes</td><td>Block <code>{ }</code></td></tr>
      <tr><td><code>var</code></td><td>Yes</td><td>Whole function — leaks, avoid</td></tr>
    </table>
    <p><b>The habit to build:</b> use <code>const</code> by default, switch to <code>let</code> only when you genuinely need to reassign. It makes code easier to reason about because most things visibly never change.</p>
    <h3>prompt returns a string — always</h3>
    <p>Even if the user types <code>7</code>, you get <code>"7"</code>. Wrap it in <code>Number()</code> before doing maths with it.</p>`
});


PG.add({
  id:'s14-naming', index:81, udemyId:12371642, minutes:7, section:'s14', slug:'naming', lesson:'14.4', layout:'js',
  title:'Naming Conventions',
  blurb:'Names are how future-you understands present-you. JavaScript uses <b>camelCase</b>, names must not start with a number, and a handful of words are reserved.',
  tasks:[
    'Fix the badly named variables in the starter so they follow convention.',
    'Try declaring a variable called <code>let</code> or <code>3things</code> and read the error.',
    'Rename them to something that says what they actually hold.'
  ],
  files:{ js:`// These all work but they are terrible. Rename them properly.
let x = 42;
let THING = "Angela";
let user_score_total = 0;
let n = true;

console.log(x, THING, user_score_total, n);

// TODO: try one of these and read the error
// let 3things = 1;
// let class = "maths";
` },
  solution:{ js:`const answerToEverything = 42;
const userName = "Angela";
let userScoreTotal = 0;
const isLoggedIn = true;

console.log(answerToEverything, userName, userScoreTotal, isLoggedIn);

// Rules:
//  - camelCase for variables and functions
//  - PascalCase for classes
//  - SCREAMING_SNAKE for true constants:  const MAX_USERS = 100;
//  - cannot start with a number
//  - cannot be a reserved word (let, class, if, function, new, ...)
//  - case sensitive:  userName and username are two different variables
` },
  notes:`
    <h3>The conventions</h3>
    <ul>
      <li><code>camelCase</code> — variables and functions: <code>userName</code>, <code>calculateTotal</code></li>
      <li><code>PascalCase</code> — classes and React components: <code>UserProfile</code></li>
      <li><code>SCREAMING_SNAKE_CASE</code> — fixed configuration values: <code>MAX_RETRIES</code></li>
    </ul>
    <h3>Naming things well</h3>
    <ul>
      <li>Booleans read like a question: <code>isLoggedIn</code>, <code>hasPermission</code>.</li>
      <li>Functions start with a verb: <code>getUser</code>, <code>calculateBMI</code>.</li>
      <li>Say what it is, not what type it is: <code>userCount</code>, not <code>numVar</code>.</li>
      <li>Short names are fine for short lives — <code>i</code> in a loop is not a crime.</li>
    </ul>`
});


PG.add({
  id:'s14-concat', index:82, udemyId:12371720, minutes:3, section:'s14', slug:'string-concatenation', lesson:'14.5', layout:'js',
  title:'String Concatenation',
  blurb:'Join strings with <code>+</code>. Modern JavaScript also has <b>template literals</b> — backticks with <code>${...}</code> holes in them — which are far easier to read.',
  tasks:[
    'Ask for a name and greet the user with <code>+</code>. Watch out for the missing space.',
    'Rewrite the same greeting with a template literal.',
    'Build a sentence mixing text and a calculation.'
  ],
  answers:'Ada',
  files:{ js:`const message = "Hello";
const name = prompt("What is your name?");

// TODO: join them with +


// TODO: the same thing with a template literal (backticks)
` },
  solution:{ js:`const message = "Hello";
const name = prompt("What is your name?");

// the + way — mind the space string in the middle
alert(message + " " + name);
console.log(message + " " + name);

// the template literal way — much easier to read
console.log(\`\${message} \${name}, welcome back!\`);

// they handle expressions too
const price = 12, qty = 3;
console.log(\`\${qty} items cost £\${price * qty}\`);
` },
  notes:`
    <h3>Two ways</h3>
    <pre>"Hello" + " " + name + "!"        // concatenation
\`Hello \${name}!\`                   // template literal</pre>
    <p>Template literals use <b>backticks</b> (the key left of 1), not quotes. Anything inside <code>\${ }</code> is evaluated as JavaScript.</p>
    <h3>Why they win</h3>
    <ul>
      <li>No forgotten spaces or stray <code>+</code>.</li>
      <li>They can contain real line breaks, so multi-line strings just work.</li>
      <li>They can hold expressions: <code>\${price * qty}</code>, <code>\${name.toUpperCase()}</code>.</li>
    </ul>`
});


PG.add({
  id:'s14-length', index:83, udemyId:12371744, minutes:6, section:'s14', slug:'string-length', lesson:'14.6', layout:'js',
  title:'String Length',
  blurb:'Every string carries a <code>.length</code> property — no brackets, because it is a property and not a method.',
  tasks:[
    'Ask for a message and log how many characters it has.',
    'Build the character counter: 140 minus the length.',
    'Try <code>.length</code> on an empty string and on a string of spaces.'
  ],
  answers:'Good morning everyone!',
  files:{ js:`const tweet = prompt("Compose your tweet:");

// TODO: how many characters?


// TODO: how many are left out of 140?
` },
  solution:{ js:`const tweet = prompt("Compose your tweet:");

console.log("You wrote:", tweet);
console.log("Characters used:", tweet.length);

const remaining = 140 - tweet.length;
alert("You have written " + tweet.length + " characters, you have " + remaining + " remaining.");

// no brackets — .length is a property, not a method
console.log("".length);       // 0
console.log("   ".length);    // 3  — spaces count!
console.log("héllo".length);  // 5
` },
  notes:`
    <h3>Property, not method</h3>
    <p><code>tweet.length</code> — no brackets. Compare with <code>tweet.toUpperCase()</code>, which is a method and needs them. A property is a stored value; a method is an action that has to be run.</p>
    <h3>Everything counts</h3>
    <p>Spaces, punctuation and line breaks are all characters. <code>"a b".length</code> is 3.</p>
    <h3>Arrays have it too</h3>
    <p><code>[1,2,3].length</code> is 3 — the same idea, which is why loops over arrays always use it.</p>`
});


PG.add({
  id:'s14-slice', index:84, udemyId:12371756, minutes:9, section:'s14', slug:'slicing', lesson:'14.7', layout:'js',
  title:'Slicing Strings',
  blurb:'<code>.slice(start, end)</code> cuts a piece out of a string. Counting starts at <b>0</b>, and the end index is <b>not</b> included.',
  tasks:[
    'Slice the first 10 characters out of a message.',
    'Get just the first character — that is <code>.slice(0, 1)</code>.',
    'Try a negative number: <code>.slice(-3)</code> takes the last three characters.'
  ],
  answers:'Good morning everyone!',
  files:{ js:`const text = prompt("Write something:");

// TODO: the first 10 characters


// TODO: just the first letter
` },
  solution:{ js:`const text = prompt("Write something:");

const short = text.slice(0, 10);
console.log("First 10:", short);

const firstLetter = text.slice(0, 1);
console.log("First letter:", firstLetter);

console.log("Last 3:", text.slice(-3));
console.log("From index 5 on:", text.slice(5));

// counting from 0, end NOT included:
//  "JavaScript".slice(0, 4)  ->  "Java"
//   index:      0123456789
console.log("JavaScript".slice(0, 4));
` },
  notes:`
    <h3>Zero-indexed, end-exclusive</h3>
    <pre>"JavaScript"
 0123456789

.slice(0, 4)   ->  "Java"      chars 0,1,2,3
.slice(4)      ->  "Script"    from 4 to the end
.slice(-6)     ->  "Script"    the last 6
.slice(0, 1)   ->  "J"         the first character</pre>
    <p>"End not included" is the convention across almost all of JavaScript, so it is worth getting comfortable with early.</p>
    <h3>Capitalising a name</h3>
    <p>The classic use, and the next lesson's challenge:</p>
    <pre>name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase()</pre>`
});


PG.add({
  id:'s14-casing', index:85, udemyId:12371788, minutes:4, section:'s14', slug:'changing-casing', lesson:'14.8', layout:'js',
  title:'Challenge — Changing Casing',
  blurb:'The challenge: whatever the user types, output it with a capital first letter and the rest in lower case. <code>"aDa"</code> → <code>"Ada"</code>.',
  tasks:[
    'Get the name from the prompt.',
    'Take the first character and upper-case it.',
    'Take everything from the second character on and lower-case it.',
    'Join them and alert the result.'
  ],
  answers:'aDa lOveLace',
  files:{ js:`const name = prompt("What is your name?");

// TODO: capitalise the first letter, lower-case the rest


// try it with "aDa" — it should come out as "Ada"
` },
  solution:{ js:`const name = prompt("What is your name?");

const firstLetter = name.slice(0, 1).toUpperCase();
const rest = name.slice(1).toLowerCase();
const properName = firstLetter + rest;

alert("Hello " + properName);
console.log(properName);

// all in one line, if you fancy it:
console.log(name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase());

// bonus: capitalise EVERY word
const full = name
  .split(" ")
  .map(function (word) {
    return word.slice(0,1).toUpperCase() + word.slice(1).toLowerCase();
  })
  .join(" ");
console.log("Every word:", full);
` },
  notes:`
    <h3>The two methods</h3>
    <ul>
      <li><code>.toUpperCase()</code> — every character to capitals.</li>
      <li><code>.toLowerCase()</code> — every character to small letters.</li>
    </ul>
    <p>Both need the brackets — they are methods, not properties. And both return a <b>new</b> string; the original is untouched. Strings in JavaScript are immutable.</p>
    <h3>Chaining</h3>
    <p>Because each method returns a string, you can keep going: <code>name.slice(0,1).toUpperCase()</code> slices first, then upper-cases the result. Read left to right.</p>`
});


PG.add({
  id:'s14-arithmetic', index:87, udemyId:12371848, minutes:6, section:'s14', slug:'arithmetic', lesson:'14.9', layout:'js',
  title:'Arithmetic & Modulo',
  blurb:'The usual <code>+ - * /</code>, plus <code>%</code> (modulo) which gives the <b>remainder</b> after a division — much more useful than it sounds.',
  tasks:[
    'Build the dog-age calculator: <code>(dogAge − 2) × 4 + 21</code>.',
    'Log a few modulo results and work out the pattern.',
    'Use <code>% 2</code> to test whether a number is even.'
  ],
  answers:'5',
  files:{ js:`const dogAge = Number(prompt("How old is your dog?"));

// TODO: convert to human years:  (dogAge - 2) * 4 + 21


// TODO: play with modulo
console.log(6 % 4);
` },
  solution:{ js:`const dogAge = Number(prompt("How old is your dog?"));

const humanAge = (dogAge - 2) * 4 + 21;
alert("In human years your dog is " + humanAge);

// modulo = the remainder after dividing
console.log(6 % 4);    // 2   (6 / 4 = 1 remainder 2)
console.log(12 % 8);   // 4
console.log(10 % 5);   // 0   -> divides exactly
console.log(7 % 2);    // 1   -> odd
console.log(8 % 2);    // 0   -> even

// the even/odd test
const n = 14;
console.log(n + " is " + (n % 2 === 0 ? "even" : "odd"));

// operator order is the same as maths: brackets, then * /, then + -
console.log(2 + 3 * 4);      // 14
console.log((2 + 3) * 4);    // 20
` },
  notes:`
    <h3>The operators</h3>
    <table>
      <tr><th>Op</th><th>Does</th><th>Example</th></tr>
      <tr><td><code>+</code></td><td>Add (or join strings!)</td><td><code>5 + 2</code> → 7</td></tr>
      <tr><td><code>-</code></td><td>Subtract</td><td><code>5 - 2</code> → 3</td></tr>
      <tr><td><code>*</code></td><td>Multiply</td><td><code>5 * 2</code> → 10</td></tr>
      <tr><td><code>/</code></td><td>Divide</td><td><code>5 / 2</code> → 2.5</td></tr>
      <tr><td><code>%</code></td><td>Remainder</td><td><code>5 % 2</code> → 1</td></tr>
      <tr><td><code>**</code></td><td>Power</td><td><code>5 ** 2</code> → 25</td></tr>
    </table>
    <h3>What modulo is actually for</h3>
    <ul>
      <li><b>Even or odd</b> — <code>n % 2 === 0</code>.</li>
      <li><b>Every nth time</b> — <code>i % 3 === 0</code> inside a loop.</li>
      <li><b>Wrapping around</b> — <code>(i + 1) % arr.length</code> loops back to the start.</li>
      <li><b>Change from a purchase</b> — <code>money % price</code>.</li>
    </ul>`
});


PG.add({
  id:'s14-increment', index:88, udemyId:12371872, minutes:2, section:'s14', slug:'increment', lesson:'14.10', layout:'js',
  title:'Increment & Decrement',
  blurb:'Shorthands for the most common operations: <code>++</code> adds one, <code>--</code> subtracts one, and <code>+=</code> / <code>-=</code> / <code>*=</code> add, subtract or multiply in place.',
  tasks:[
    'Predict what each line prints, then run it and check.',
    'Work out the difference between <code>x++</code> and <code>++x</code>.',
    'Rewrite <code>score = score + 10</code> using the shorthand.'
  ],
  files:{ js:`let a = 5, b = 5, c = 5, d = 5, e = 5;

// TODO: predict each of these before you run it
console.log(a + 1);
console.log(++b);
console.log(--c);
console.log(d += 2);
console.log(e -= 2);

console.log("after:", a, b, c, d, e);
` },
  solution:{ js:`let a = 5, b = 5, c = 5, d = 5, e = 5;

console.log(a + 1);   // 6  — but a itself is UNCHANGED
console.log(++b);     // 6  — b is now 6
console.log(--c);     // 4  — c is now 4
console.log(d += 2);  // 7  — d is now 7
console.log(e -= 2);  // 3  — e is now 3

console.log("after:", a, b, c, d, e);   // 5 6 4 7 3

// prefix vs postfix — the difference is WHAT THE LINE RETURNS
let x = 5;
console.log(x++);   // prints 5, THEN x becomes 6
console.log(x);     // 6

let y = 5;
console.log(++y);   // y becomes 6 first, THEN prints 6

// all the compound assignments
let score = 10;
score += 5;   console.log(score);  // 15
score -= 3;   console.log(score);  // 12
score *= 2;   console.log(score);  // 24
score /= 4;   console.log(score);  // 6
` },
  notes:`
    <h3>The shorthands</h3>
    <table>
      <tr><th>Short</th><th>Long</th></tr>
      <tr><td><code>x++</code></td><td><code>x = x + 1</code></td></tr>
      <tr><td><code>x--</code></td><td><code>x = x - 1</code></td></tr>
      <tr><td><code>x += 5</code></td><td><code>x = x + 5</code></td></tr>
      <tr><td><code>x *= 2</code></td><td><code>x = x * 2</code></td></tr>
    </table>
    <h3>Prefix vs postfix</h3>
    <p><code>x++</code> returns the old value then increments; <code>++x</code> increments then returns the new value. In a loop like <code>for (let i = 0; i &lt; 5; i++)</code> it makes no difference — the return value is thrown away. Inside a <code>console.log</code> it makes all the difference.</p>`
});


PG.add({
  id:'s14-functions-1', index:89, udemyId:12371950, minutes:11, section:'s14', slug:'functions-1', lesson:'14.11', layout:'js',
  title:'Functions 1 — Creating & Calling',
  blurb:'A function is a named parcel of instructions. Defining it does nothing; <b>calling</b> it by name runs the code inside.',
  tasks:[
    'Write a function called <code>getMilk</code> that logs the steps to fetch milk.',
    'Call it — nothing happens until you do.',
    'Call it twice and see the steps repeat. That is the whole point of functions.'
  ],
  files:{ js:`// TODO: define a function called getMilk


// TODO: call it
` },
  solution:{ js:`function getMilk() {
  console.log("leaveHouse");
  console.log("moveRight");
  console.log("moveUp");
  console.log("buyMilk");
  console.log("moveDown");
  console.log("moveLeft");
  console.log("enterHouse");
}

// nothing has run yet — the function is just defined

getMilk();   // now it runs

console.log("--- and again ---");
getMilk();   // reuse, without retyping a thing
` },
  notes:`
    <h3>The shape</h3>
    <pre>function nameOfFunction() {
  // the code goes here
}

nameOfFunction();   // <- this runs it</pre>
    <p>Note the brackets on the call. <code>getMilk</code> without brackets refers to the function itself; <code>getMilk()</code> runs it. That distinction matters enormously later with event listeners.</p>
    <h3>Why bother</h3>
    <ul>
      <li><b>Reuse</b> — write it once, call it anywhere.</li>
      <li><b>Naming</b> — <code>calculateBMI()</code> tells a reader what a block of maths is for.</li>
      <li><b>One place to fix</b> — change the function, every caller gets the fix.</li>
    </ul>`
});


PG.add({
  id:'s14-functions-2', index:93, udemyId:12373850, minutes:10, section:'s14', slug:'functions-2', lesson:'14.12', layout:'js',
  title:'Functions 2 — Parameters',
  blurb:'A <b>parameter</b> is a placeholder in the function definition; an <b>argument</b> is the real value you pass when calling it. That is how one function handles many situations.',
  tasks:[
    'Give <code>getMilk</code> a <code>money</code> parameter.',
    'Work out how many bottles that buys at £1.50 each, using <code>Math.floor</code>.',
    'Call it with different amounts and watch the output change.'
  ],
  files:{ js:`// TODO: add a money parameter
function getMilk() {
  console.log("leaveHouse");
  // TODO: how many bottles can we afford at 1.5 each?
  console.log("enterHouse");
}

// TODO: call it with 5
` },
  solution:{ js:`function getMilk(money) {
  console.log("leaveHouse");

  const price = 1.5;
  const bottles = Math.floor(money / price);
  console.log("buy " + bottles + " bottles of milk");

  console.log("enterHouse");
}

getMilk(5);    // 3 bottles
getMilk(10);   // 6 bottles
getMilk(1);    // 0 bottles

// several parameters, in order
function greet(name, greeting) {
  console.log(greeting + ", " + name + "!");
}
greet("Angela", "Hello");
greet("Ada", "Good morning");

// a default, used when the argument is missing
function shout(word = "hey") {
  console.log(word.toUpperCase() + "!");
}
shout();
shout("listen");
` },
  notes:`
    <h3>Parameter vs argument</h3>
    <pre>function getMilk(money) {   // money is the PARAMETER
  ...
}

getMilk(5);                 // 5 is the ARGUMENT</pre>
    <h3>Order matters</h3>
    <p>Arguments fill the parameters left to right. <code>greet("Hello", "Angela")</code> and <code>greet("Angela", "Hello")</code> are both valid JavaScript and one of them is nonsense — the language will not warn you.</p>
    <h3>Math.floor</h3>
    <p><code>Math.floor()</code> always rounds <em>down</em>: <code>3.9</code> → <code>3</code>. Compare <code>Math.round()</code> (nearest) and <code>Math.ceil()</code> (always up). You cannot buy 3.33 bottles of milk, so floor is right here.</p>`
});


PG.add({
  id:'s14-life-in-weeks', index:93, sub:'b', udemyId:12373850, minutes:0, section:'s14', slug:'life-in-weeks', lesson:'14.13', layout:'js',
  title:'Life in Weeks',
  blurb:'Given an age, work out how many days, weeks and months you have left if you live to 90. A pure parameters-and-arithmetic exercise.',
  tasks:[
    'Write <code>lifeInWeeks(age)</code>.',
    'Work out the years remaining, then convert to days (× 365), weeks (× 52) and months (× 12).',
    'Log a sentence like: "You have 16425 days, 2340 weeks, and 540 months left."'
  ],
  answers:'25',
  files:{ js:`// TODO: write lifeInWeeks(age)


// lifeInWeeks(25);
` },
  solution:{ js:`function lifeInWeeks(age) {
  const yearsLeft = 90 - age;

  const days = yearsLeft * 365;
  const weeks = yearsLeft * 52;
  const months = yearsLeft * 12;

  console.log(
    "You have " + days + " days, " + weeks + " weeks, and " + months + " months left."
  );
}

lifeInWeeks(25);
lifeInWeeks(56);

// with a template literal it reads better:
function lifeInWeeks2(age) {
  const left = 90 - age;
  console.log(\`You have \${left*365} days, \${left*52} weeks, and \${left*12} months left.\`);
}
lifeInWeeks2(25);
` },
  notes:`
    <h3>Breaking a problem down</h3>
    <p>Every one of these challenges is the same three steps: <b>what comes in</b> (the parameter), <b>what has to be worked out</b> (the maths), <b>what goes out</b> (log or return). Write those three lines as comments first and the code fills itself in.</p>
    <h3>Go further</h3>
    <ul>
      <li>Use <code>return</code> instead of <code>console.log</code> so the caller decides what to do with the answer — that is the next lesson.</li>
      <li>Handle an age over 90 gracefully.</li>
      <li>Use <code>.toLocaleString()</code> to get <code>16,425</code> instead of <code>16425</code>.</li>
    </ul>`
});


PG.add({
  id:'s14-functions-3', index:95, udemyId:12373868, minutes:11, section:'s14', slug:'functions-3', lesson:'14.14', layout:'js',
  title:'Functions 3 — Return Values',
  blurb:'<code>return</code> hands a value back to whoever called the function — and stops the function immediately. A function that logs is a dead end; a function that returns can be built on.',
  tasks:[
    'Write <code>calcBottles(money, price)</code> that <b>returns</b> the number of bottles.',
    'Write <code>calcChange(money, price)</code> that returns the change, using <code>%</code>.',
    'Use both results in a third function that builds the message.'
  ],
  files:{ js:`const money = 4;
const price = 1.5;

// TODO: calcBottles returns how many bottles


// TODO: calcChange returns the change


// TODO: put them together into a sentence
` },
  solution:{ js:`const money = 4;
const price = 1.5;

function calcBottles(money, price) {
  return Math.floor(money / price);
}

function calcChange(money, price) {
  return money % price;
}

function getMilk(money, price) {
  const bottles = calcBottles(money, price);
  const change = calcChange(money, price);
  return \`Each bottle is £\${price}. You gave £\${money}, so you get \${bottles} bottles and £\${change.toFixed(2)} change.\`;
}

console.log(getMilk(money, price));
console.log(getMilk(10, 1.5));

// return also EXITS the function immediately
function checkAge(age) {
  if (age < 18) {
    return "Too young";     // nothing below this line runs
  }
  return "Welcome in";
}
console.log(checkAge(15));
console.log(checkAge(30));
` },
  notes:`
    <h3>Log vs return</h3>
    <table>
      <tr><th><code>console.log</code></th><th><code>return</code></th></tr>
      <tr><td>Shows a value to you</td><td>Hands a value to the calling code</td></tr>
      <tr><td>The function still returns <code>undefined</code></td><td>The result can be stored and reused</td></tr>
      <tr><td>For debugging</td><td>For building things</td></tr>
    </table>
    <h3>Two things at once</h3>
    <p><code>return</code> also <b>ends</b> the function on the spot. Anything after it in the same block never runs — which is genuinely useful for early exits, and a classic source of "why is my code not running" confusion.</p>
    <h3>One job per function</h3>
    <p>Notice the solution has three small functions rather than one big one. Each does a single thing, each is testable on its own, and the names document the maths.</p>`
});


PG.add({
  id:'s14-bmi', index:96, udemyId:12373874, minutes:2, section:'s14', slug:'bmi-calculator', lesson:'14.15', layout:'js', project:true,
  title:'Challenge — BMI Calculator',
  blurb:'Body Mass Index = weight ÷ height². Write a function that takes weight in kg and height in metres and returns the BMI as a whole number.',
  tasks:[
    'Write <code>bmiCalculator(weight, height)</code>.',
    'The formula is <code>weight / (height * height)</code> — the brackets matter.',
    'Round it with <code>Math.round()</code> and <b>return</b> the result.',
    'Test with 65 kg and 1.8 m — you should get 20.'
  ],
  files:{ js:`// TODO: write bmiCalculator(weight, height)


// console.log(bmiCalculator(65, 1.8));   // should be 20
` },
  solution:{ js:`function bmiCalculator(weight, height) {
  const bmi = weight / (height * height);
  return Math.round(bmi);
}

console.log(bmiCalculator(65, 1.8));    // 20
console.log(bmiCalculator(85, 1.75));   // 28

// height ** 2 is the same as height * height
function bmiCalculator2(weight, height) {
  return Math.round(weight / height ** 2);
}
console.log(bmiCalculator2(65, 1.8));

// In section 15 you will add if/else to interpret the number:
//   under 18.5  underweight
//   18.5 - 24.9 normal
//   25 and over overweight
` },
  notes:`
    <h3>Watch the brackets</h3>
    <p><code>weight / height * height</code> is <b>wrong</b> — division and multiplication run left to right, so it divides then multiplies straight back. You need <code>weight / (height * height)</code>.</p>
    <h3>Rounding</h3>
    <ul>
      <li><code>Math.round(20.6)</code> → 21 (nearest)</li>
      <li><code>Math.floor(20.6)</code> → 20 (down)</li>
      <li><code>Math.ceil(20.1)</code> → 21 (up)</li>
      <li><code>(20.666).toFixed(1)</code> → <code>"20.7"</code> (a string, with decimals)</li>
    </ul>
    <h3>Next</h3>
    <p>Section 15 revisits this exact function and adds <code>if / else</code> so it tells you what the number means. Keep your version — you will build straight on top of it.</p>`
});
