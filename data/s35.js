/* ===== Section 35 — Authentication and Security ===== */
(function () {

/* ---------- the Secrets app: shared pieces ---------- */

const VERSIONS = {
  'bcrypt': '^6.0.0', 'body-parser': '^2.2.0', 'dotenv': '^17.2.2', 'ejs': '^3.1.10', 'express': '^5.1.0',
  'express-session': '^1.18.2', 'passport': '^0.7.0', 'passport-google-oauth2': '^0.2.0', 'passport-local': '^1.0.0', 'pg': '^8.16.3',
};
function pkg(name, deps) {
  const d = {};
  deps.slice().sort().forEach(k => { d[k] = VERSIONS[k]; });
  return JSON.stringify({ name: name, version: '1.0.0', main: 'index.js', type: 'module', dependencies: d }, null, 2) + '\n';
}
const BASE_DEPS = ['body-parser', 'ejs', 'express', 'pg'];
const SESSION_DEPS = BASE_DEPS.concat(['bcrypt', 'express-session', 'passport', 'passport-local']);

const USERS_TABLE = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100)
);`;
// ada@example.com / lovelace1815, hashed with bcrypt at 10 rounds
const SEED_ADA = USERS_TABLE + `
INSERT INTO users (email, password)
VALUES ('ada@example.com', '$2a$10$BPTLjxyuCRAs8Peyt4Km7O8NG7MvlGiMwLH8v3AdJ7TxXwTkPG6vS');`;

const CSS = `body {
  margin: 0;
  background-color: #E8ECEF;
  color: #212529;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

.container { max-width: 960px; margin: 0 auto; padding: 0 16px; }
.centered { padding-top: 80px; text-align: center; }
.jumbotron { padding: 48px 0; }
.text-center { text-align: center; }
.mt-5 { margin-top: 40px; }

.icon { font-size: 72px; line-height: 1; }
.display-3 { margin: 12px 0; font-size: 46px; font-weight: 300; }
.lead { font-size: 20px; font-weight: 300; }
hr { margin: 24px 0; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); }

.btn {
  display: inline-block;
  padding: 8px 18px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
}
.btn-lg { padding: 10px 24px; font-size: 20px; }
.btn-light { background: #f8f9fa; border-color: #f8f9fa; color: #212529; }
.btn-dark { background: #343a40; border-color: #343a40; color: #fff; }
.btn-block { display: block; text-align: center; }
.btn-google { background: #fff; border-color: #dadce0; color: #3c4043; }
.g { margin-right: 6px; color: #4285f4; font-weight: 700; }

.row { display: flex; flex-wrap: wrap; gap: 20px; }
.col-sm-8 { flex: 2 1 300px; }
.col-sm-4 { flex: 1 1 200px; }
.card { background: #fff; border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 4px; }
.card-body { padding: 20px; }

.form-group { margin-bottom: 16px; }
label { display: inline-block; margin-bottom: 6px; }
.form-control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.secret-text {
  padding: 8px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  background-color: #000;
}
`;

const HEADER = `<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8">
  <title>Secrets</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>

<body>
`;
const FOOTER = `
</body>
</html>
`;

const HOME = `<%- include('partials/header') %>

<div class="jumbotron centered">
  <div class="container">
    <div class="icon">🔑</div>
    <h1 class="display-3">Secrets</h1>
    <p class="lead">Share your secrets anonymously.</p>
    <hr>
    <a class="btn btn-light btn-lg" href="/register" role="button">Register</a>
    <a class="btn btn-dark btn-lg" href="/login" role="button">Login</a>
  </div>
</div>

<%- include('partials/footer') %>
`;

function googleCard(label) {
  return `
    <div class="col-sm-4">
      <div class="card">
        <div class="card-body">
          <a class="btn btn-google btn-block" href="/auth/google" role="button">
            <span class="g">G</span>${label}
          </a>
        </div>
      </div>
    </div>
`;
}
function authPage(heading, route, button, google) {
  return `<%- include('partials/header') %>

<div class="container mt-5">
  <h1>${heading}</h1>

  <div class="row">
    <div class="col-sm-8">
      <div class="card">
        <div class="card-body">

          <!-- Makes a POST request to ${route} -->
          <form action="${route}" method="POST">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" name="username">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" name="password">
            </div>
            <button type="submit" class="btn btn-dark">${button}</button>
          </form>

        </div>
      </div>
    </div>
${google ? googleCard(route === '/login' ? 'Sign In with Google' : 'Sign Up with Google') : ''}
  </div>
</div>

<%- include('partials/footer') %>
`;
}
const LOGIN = authPage('Login', '/login', 'Login', false);
const REGISTER = authPage('Register', '/register', 'Register', false);
const LOGIN_G = authPage('Login', '/login', 'Login', true);
const REGISTER_G = authPage('Register', '/register', 'Register', true);

function secretsPage(secretLine, buttons) {
  return `<%- include('partials/header') %>

<div class="jumbotron text-center">
  <div class="container">
    <div class="icon">🔑</div>
    <h1 class="display-3">You've found a secret!</h1>
${secretLine}${buttons ? '\n    <hr>\n' + buttons : ''}
  </div>
</div>

<%- include('partials/footer') %>
`;
}
const FIXED_SECRET = '    <p class="secret-text">I secretly enjoy writing CSS.</p>';
const LOGOUT_BTN = '    <a class="btn btn-light btn-lg" href="/logout" role="button">Log Out</a>';
const SUBMIT_BTN = '\n    <a class="btn btn-dark btn-lg" href="/submit" role="button">Submit a Secret</a>';
const SECRETS = secretsPage(FIXED_SECRET, '');
const SECRETS_LOGOUT = secretsPage(FIXED_SECRET, LOGOUT_BTN);

const SUBMIT = `<%- include('partials/header') %>

<div class="container">
  <div class="jumbotron centered">
    <div class="icon">🔑</div>
    <h1 class="display-3">Secrets</h1>
    <p class="secret-text">Share a secret anonymously.</p>

    <form action="/submit" method="POST">
      <div class="form-group">
        <input type="text" class="form-control text-center" name="secret" placeholder="What's your secret?">
      </div>
      <button type="submit" class="btn btn-dark">Submit</button>
    </form>
  </div>
</div>

<%- include('partials/footer') %>
`;

function views(opts) {
  opts = opts || {};
  const v = {
    'views/home.ejs': HOME,
    'views/login.ejs': opts.google ? LOGIN_G : LOGIN,
    'views/register.ejs': opts.google ? REGISTER_G : REGISTER,
    'views/secrets.ejs': opts.secrets || SECRETS,
  };
  if (opts.submit) v['views/submit.ejs'] = SUBMIT;
  v['views/partials/header.ejs'] = HEADER;
  v['views/partials/footer.ejs'] = FOOTER;
  v['public/css/styles.css'] = CSS;
  return v;
}

/* ---------- server code shared between levels ---------- */

const DB_LOCAL = `const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "your-db-password",
  port: 5432,
});
db.connect();`;

const DB_ENV = `const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();`;

const PAGES = `app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});`;

const DEBUG = `// Playground helper: shows what pgAdmin's "View All Rows" would show.
// Handy for checking your work here; never put a route like this in a real app.
app.get("/debug/users", async (req, res) => {
  const result = await db.query("SELECT * FROM users ORDER BY id");
  res.json(result.rows);
});`;

const LISTEN = `app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`;

const REGISTER_PLAIN = `app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});`;

const LOGIN_PLAIN = `app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});`;

const REGISTER_BCRYPT = `app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});`;

const LOGIN_BCRYPT = `app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, valid) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else if (valid) {
          res.render("secrets.ejs");
        } else {
          res.send("Incorrect Password");
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});`;

function sessionBlock(secret) {
  return `app.use(
  session({
    secret: ${secret},
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // one day, in milliseconds
    },
  })
);`;
}

const LOGOUT = `app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});`;

const SECRETS_GUARD = `app.get("/secrets", (req, res) => {
  // console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/login");
  }
});`;

const LOGIN_PASSPORT = `app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);`;

const REGISTER_SESSION = `app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});`;

function localStrategy(named) {
  return `passport.use(${named ? '\n  "local",' : ''}
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            return cb(err); // something broke
          } else if (valid) {
            return cb(null, user); // right password: log them in
          } else {
            return cb(null, false); // wrong password: a failed login, not an error
          }
        });
      } else {
        return cb(null, false); // unknown email: a failed login too
      }
    } catch (err) {
      return cb(err);
    }
  })
);`;
}

const SERIALIZE = `passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});`;

const GOOGLE_ROUTES = `app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);`;

const GOOGLE_STRATEGY = `passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);`;

const ENV_272 = `SESSION_SECRET="TOPSECRETWORD"
PG_USER="postgres"
PG_HOST="localhost"
PG_DATABASE="secrets"
PG_PASSWORD="your-db-password"
PG_PORT="5432"
`;
const ENV_274 = ENV_272 + `GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
`;
const GITIGNORE = `# dependencies: npm install rebuilds them from package.json
node_modules/

# secrets: never commit these
.env
.env.local
.env.production
`;

/* ---------- full index.js files, level by level ---------- */

const L1_SOLUTION = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

${DB_LOCAL}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

${PAGES}

${REGISTER_PLAIN}

${LOGIN_PLAIN}

${DEBUG}

${LISTEN}
`;

const L3_SOLUTION = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

${DB_LOCAL}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

${PAGES}

${REGISTER_BCRYPT}

${LOGIN_BCRYPT}

${DEBUG}

${LISTEN}
`;

const L4_SOLUTION = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

const app = express();
const port = 3000;
const saltRounds = 10;

${sessionBlock('"TOPSECRETWORD"')}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// The playground's database already has one account: ada@example.com / lovelace1815
${DB_LOCAL}

${PAGES}

${LOGOUT}

${SECRETS_GUARD}

${LOGIN_PASSPORT}

${REGISTER_SESSION}

${localStrategy(false)}

${SERIALIZE}

${DEBUG}

${LISTEN}
`;

const L5_SOLUTION = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

${sessionBlock('process.env.SESSION_SECRET')}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// The playground's database already has one account: ada@example.com / lovelace1815
${DB_ENV}

${PAGES}

${LOGOUT}

${SECRETS_GUARD}

${LOGIN_PASSPORT}

${REGISTER_SESSION}

${localStrategy(false)}

${SERIALIZE}

${DEBUG}

${LISTEN}
`;

const L6_SOLUTION = `import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

${sessionBlock('process.env.SESSION_SECRET')}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// The playground's database already has one account: ada@example.com / lovelace1815
${DB_ENV}

${PAGES}

${LOGOUT}

${SECRETS_GUARD}

${GOOGLE_ROUTES}

${LOGIN_PASSPORT}

${REGISTER_SESSION}

${localStrategy(true)}

${GOOGLE_STRATEGY}

${SERIALIZE}

${DEBUG}

${LISTEN}
`;

/* =====================================================================
   266 · Introduction to Authentication
   ===================================================================== */
PG.add({
  id:'l266', index:266, udemyId:41780520, minutes:6, section:'s35', slug:'intro-to-authentication', kind:'read',
  title:'Introduction to Authentication',
  blurb:'Accounts tie data to a person and keep private things private. Building a sign-up form is easy; storing the credentials safely is the hard part. This section climbs that ladder one level at a time: plain-text passwords, hashing, salting with bcrypt, sessions and cookies, secrets in environment variables, and finally "Sign in with Google". Each level fixes a weakness of the one before. Along the way you build <b>Secrets</b>, a site for sharing secrets anonymously whose secrets page is only for logged-in users.',
  quiz:[
    { q:'Why does a site like a recipe app or a streaming service need user accounts at all?', options:['To make pages load faster','To tie data and access rights to one person, such as their saved recipes or whether they have paid','Because browsers require a login','To stop search engines indexing the site'], answer:1, why:'An account works like an ID card: the server can link posts, likes or payment status to a person, and keep private data private.' },
    { q:'According to the lecture, what is the difficult part of authentication?', options:['Designing the login form','Writing the register route','Making the storage and checking of credentials secure','Choosing a database'], answer:2, why:'A working login takes minutes; a login that survives a stolen database or a curious insider is the real work, which is why the section goes level by level.' },
    { q:'Which way of storing passwords does the section start with, so that the later levels can fix it?', options:['bcrypt hashes','Plain text in the users table','Google OAuth tokens','Encrypted cookies'], answer:1, why:'Level 1 stores the password exactly as typed. It works, but anyone who reads the table sees every password, and that weakness motivates everything that follows.' },
  ],
});

/* =====================================================================
   267 · Level 1: register and log in (plain text)
   ===================================================================== */
PG.add({
  id:'l267', index:267, udemyId:41780530, minutes:22, section:'s35', slug:'level-1-register-and-login', kind:'node',
  title:'Level 1 - Registering Users with Email and Password',
  blurb:'The simplest working login: a <code>users</code> table in Postgres, a register route that refuses duplicate emails and inserts the new row, and a login route that looks the user up and compares passwords. It works, but the passwords sit in the table exactly as typed, and the rest of the section exists to fix that.',
  tasks:[
    'Look at <code>register.ejs</code>: the inputs are named <code>username</code> and <code>password</code>. In both POST routes, read <code>req.body.username</code> into <code>email</code> and <code>req.body.password</code> into <code>password</code>. Log them once to check they arrive, then delete the log (it prints passwords).',
    'Import <code>pg</code>, create a <code>pg.Client</code> for the <code>secrets</code> database and call <code>db.connect()</code>. The playground\'s database already contains the <code>users</code> table from <code>queries.sql</code>.',
    '<code>POST /register</code>: inside <code>try/catch</code>, <code>SELECT</code> the email first. If a row comes back, send <i>Email already exists. Try logging in.</i> Otherwise <code>INSERT</code> the email and password with <code>$1, $2</code> and render <code>secrets.ejs</code>.',
    '<code>POST /login</code>: <code>SELECT</code> the user by email. No row: send <i>User not found</i>. A row: compare <code>password</code> with <code>result.rows[0].password</code>, then render <code>secrets.ejs</code> on a match or send <i>Incorrect Password</i>.',
    'Test in the built-in browser: register, register the same email again, then log in with the right and a wrong password. Finally open <code>/debug/users</code> to see what an attacker with a copy of the table would see.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: USERS_TABLE },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'GET', path:'/register', expect:200 },
    { method:'GET', path:'/login', expect:200 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'hopper1906' }, expect:200 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'again' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'grace@example.com', password:'hopper1906' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'grace@example.com', password:'wrong' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'nobody@example.com', password:'x' }, expect:200 },
    { method:'GET', path:'/debug/users', expect:200 },
  ],
  files: Object.assign({
'index.js':`import express from "express";
import bodyParser from "body-parser";
// TODO 2: import pg

const app = express();
const port = 3000;

// TODO 2: create a pg.Client for the "secrets" database and connect to it


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

${PAGES}

app.post("/register", async (req, res) => {
  // TODO 1: read the email and password the form sent
  //         (check the name attributes of the inputs in register.ejs)

  // TODO 3: if the email is already in users, tell them to log in instead;
  //         otherwise INSERT the new user and render secrets.ejs
});

app.post("/login", async (req, res) => {
  // TODO 1: read the email and password

  // TODO 4: find the user by email and compare the passwords
});

${DEBUG}

${LISTEN}
`,
  }, views(), {
'queries.sql':`-- The playground creates this table for you when the server starts.
-- On your own machine: create a database called "secrets" in pgAdmin
-- and run this in its Query Tool.
${USERS_TABLE}
`,
'package.json': pkg('secrets-level-1', BASE_DEPS),
  }),
  solution:{ 'index.js': L1_SOLUTION },
  notes:`<h3>Playground notes</h3>
<ul>
  <li>There is no pgAdmin here. Each ▶ Run creates a fresh Postgres database holding the empty <code>users</code> table from <code>queries.sql</code>, so registered users disappear when you run again.</li>
  <li><code>/debug/users</code> stands in for pgAdmin's <i>View All Rows</i>: it returns the table as JSON.</li>
  <li>The settings you pass to <code>pg.Client</code> are not checked here, so any values work. Use your real ones on your own machine.</li>
</ul>`,
  quiz:[
    { q:'The login form\'s email input has <code>name="username"</code>. Which line reads the email on the server?', options:['req.body.email','req.body.username','req.params.username','req.query.email'], answer:1, why:'Form fields arrive keyed by their name attribute. The variable on the left can be called email, but the key on the right must match the form.' },
    { q:'The email column is <code>UNIQUE</code>. Why still SELECT before the INSERT?', options:['UNIQUE only works with a SELECT first','To answer "already registered" politely instead of letting a duplicate-key error escape','SELECT makes the INSERT faster','Postgres requires it'], answer:1, why:'The constraint protects the data, but on its own the visitor just gets an error. Checking first lets you send a helpful message.' },
    { q:'What is the big weakness of Level 1?', options:['It cannot handle two users','Passwords are stored as typed, so anyone who reads the table can log in as anyone, and on other sites where the password is reused','It uses POST instead of GET','EJS cannot show the secrets page'], answer:1, why:'A leaked backup or a nosy insider sees every password in clear text. The next levels make sure the table holds nothing usable.' },
    { q:'Why can separate messages for "User not found" and "Incorrect Password" be a problem?', options:['They are slower','They tell an attacker which emails have accounts','Browsers block them','They break bcrypt'], answer:1, why:'Different replies let anyone test whether an email is registered. Many sites answer both cases with one message such as "email or password is wrong".' },
  ],
});

/* =====================================================================
   268 · Level 2: encryption and hashing
   ===================================================================== */
const SHA256_JS = `
  function sha256(str) {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    function ror(x, n) { return (x >>> n) | (x << (32 - n)); }
    var bytes = new TextEncoder().encode(str), len = bytes.length;
    var total = Math.ceil((len + 9) / 64) * 64;
    var m = new Uint8Array(total); m.set(bytes); m[len] = 0x80;
    var dv = new DataView(m.buffer);
    dv.setUint32(total - 8, Math.floor(len / 0x20000000)); dv.setUint32(total - 4, (len * 8) >>> 0);
    var W = [];
    for (var off = 0; off < total; off += 64) {
      for (var t = 0; t < 64; t++) {
        if (t < 16) W[t] = dv.getUint32(off + t * 4);
        else { var x = W[t - 15], y = W[t - 2]; W[t] = (W[t - 16] + (ror(x, 7) ^ ror(x, 18) ^ (x >>> 3)) + W[t - 7] + (ror(y, 17) ^ ror(y, 19) ^ (y >>> 10))) | 0; }
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var t1 = (h + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + W[t]) | 0;
        var t2 = ((ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H = [(H[0] + a) | 0, (H[1] + b) | 0, (H[2] + c) | 0, (H[3] + d) | 0, (H[4] + e) | 0, (H[5] + f) | 0, (H[6] + g) | 0, (H[7] + h) | 0];
    }
    return H.map(function (v) { return ('0000000' + (v >>> 0).toString(16)).slice(-8); }).join('');
  }`;

const MD5_JS = `
  function md5(str) {
    function add(x, y) { var l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
    function rol(n, c) { return (n << c) | (n >>> (32 - c)); }
    function cmn(q, a, b, x, s, t) { return add(rol(add(add(a, q), add(x, t)), s), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    var T = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];
    var S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    var bytes = new TextEncoder().encode(str), n = ((bytes.length + 8) >> 6) + 1, x = [], i;
    for (i = 0; i < n * 16; i++) x[i] = 0;
    for (i = 0; i < bytes.length; i++) x[i >> 2] |= bytes[i] << ((i % 4) * 8);
    x[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    x[n * 16 - 2] = bytes.length * 8;
    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (i = 0; i < x.length; i += 16) {
      var oa = a, ob = b, oc = c, od = d;
      for (var j = 0; j < 64; j++) {
        var r = j >> 4, k, f;
        if (r === 0) { k = j; f = ff; } else if (r === 1) { k = (5 * j + 1) % 16; f = gg; } else if (r === 2) { k = (3 * j + 5) % 16; f = hh; } else { k = (7 * j) % 16; f = ii; }
        var tmp = f(a, b, c, d, x[i + k], S[r * 4 + (j % 4)], T[j]);
        a = d; d = c; c = b; b = tmp;
      }
      a = add(a, oa); b = add(b, ob); c = add(c, oc); d = add(d, od);
    }
    return [a, b, c, d].map(function (v) { var s = ''; for (var q = 0; q < 4; q++) s += ('0' + ((v >> (q * 8)) & 255).toString(16)).slice(-2); return s; }).join('');
  }`;

PG.add({
  id:'l268', index:268, udemyId:41780532, minutes:16, section:'s35', slug:'level-2-encryption-and-hashing', kind:'read',
  title:'Level 2 - Encryption and Hashing',
  blurb:'Encryption scrambles text with a cipher and a <b>key</b>, and whoever holds the key can unscramble it. That is fine for messages but risky for passwords: one stolen key unlocks every account. A <b>hash function</b> needs no key and only works one way. The server stores the hash, hashes whatever is typed at login and compares the two, so it never holds the password itself and cannot give it back. No code this time; the Explore tab lets you try both ideas.',
  explore:[{
    title:'Encryption: a Caesar cipher and its key', height:560,
    note:'Change the message and the key. Decrypting with the same key brings the text back, which is what makes encryption reversible. Then press the button to play an attacker who has no key at all.',
    html:`
<div class="knobs">
  <label>message <input type="text" id="msg" value="meet me at noon" style="width:220px"></label>
  <label>key (shift) <input type="range" id="key" min="1" max="25" value="4"><span class="val" id="keyv"></span></label>
</div>
<div class="stage">
  <h4>Encrypt: move every letter forward by the key</h4>
  <pre class="readout" id="enc"></pre>
  <h4>Decrypt: move every letter back by the same key</h4>
  <pre class="readout" id="dec"></pre>
  <button id="brute">No key? Try all 25 shifts</button>
  <pre class="readout" id="all" style="display:none;margin-top:12px"></pre>
</div>
<p class="note">A Caesar cipher has only 25 keys, so trying them all takes no time. AES works on the same plan (a method plus a secret key) but has so many possible keys that guessing is hopeless. Its weak point is the key itself: if it is stolen along with the database, every password can be decrypted at once.</p>
<script>
  var NL = String.fromCharCode(10);
  function caesar(text, shift) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c >= 97 && c <= 122) out += String.fromCharCode((c - 97 + shift + 26) % 26 + 97);
      else if (c >= 65 && c <= 90) out += String.fromCharCode((c - 65 + shift + 26) % 26 + 65);
      else out += text.charAt(i);
    }
    return out;
  }
  var msg = document.getElementById('msg'), key = document.getElementById('key'), shown = false;
  function brute(cipher) {
    var lines = [];
    for (var s = 1; s <= 25; s++) {
      var guess = caesar(cipher, -s);
      lines.push((s < 10 ? ' ' : '') + s + '  ' + guess + (guess === msg.value && s === +key.value ? '    <- readable: key found' : ''));
    }
    var el = document.getElementById('all');
    el.style.display = '';
    el.textContent = lines.join(NL);
  }
  function upd() {
    var k = +key.value, cipher = caesar(msg.value, k);
    document.getElementById('keyv').textContent = k;
    document.getElementById('enc').textContent = msg.value + '   ->   ' + cipher;
    document.getElementById('dec').textContent = cipher + '   ->   ' + caesar(cipher, -k);
    if (shown) brute(cipher);
  }
  document.getElementById('brute').addEventListener('click', function () { shown = true; upd(); });
  msg.addEventListener('input', upd);
  key.addEventListener('input', upd);
  upd();
<\/script>`
  }, {
    title:'Hashing: a one-way fingerprint', height:600,
    note:'Type anything. The SHA-256 hash is always 64 hex characters, and nudging a single letter changes almost all of them. The lower panel is a hash-based login: only the hash is stored, and the typed password is hashed and compared.',
    html:`
<div class="knobs">
  <label>text <input type="text" id="txt" value="password" style="width:240px"></label>
</div>
<div class="stage">
  <h4>SHA-256 of your text</h4>
  <pre class="readout" id="h1"></pre>
  <h4>SHA-256 with the last letter nudged: <span id="t2" class="tag"></span></h4>
  <pre class="readout" id="h2"></pre>
  <p class="note" id="diff"></p>
</div>
<div class="stage">
  <h4>Logging in when the database keeps only the hash</h4>
  <p class="note">This account registered with the password <b>open sesame</b>. The users table holds nothing but:</p>
  <pre class="readout" id="stored"></pre>
  <label class="note">typed at login <input type="text" id="typed" value="Open sesame" style="width:200px"></label>
  <pre class="readout" id="check" style="margin-top:10px"></pre>
</div>
<p class="note">Real sites use a deliberately slow password hash such as bcrypt (lecture 270). SHA-256 appears here because your browser can compute it instantly.</p>
<script>
  var NL = String.fromCharCode(10);
  ${SHA256_JS}
  function nudge(s) { if (!s) return 'a'; var c = s.charCodeAt(s.length - 1); return s.slice(0, -1) + String.fromCharCode(c === 122 ? 97 : c === 126 ? 33 : c + 1); }
  var txt = document.getElementById('txt'), typed = document.getElementById('typed');
  var STORED = sha256('open sesame');
  document.getElementById('stored').textContent = STORED;
  function upd() {
    var t = txt.value, a = sha256(t), t2 = nudge(t), b = sha256(t2), html = '', changed = 0;
    document.getElementById('h1').textContent = a;
    document.getElementById('t2').textContent = t2;
    for (var i = 0; i < 64; i++) {
      if (a.charAt(i) === b.charAt(i)) html += b.charAt(i);
      else { changed++; html += '<span style="color:#ffcf6b">' + b.charAt(i) + '</span>'; }
    }
    document.getElementById('h2').innerHTML = html;
    document.getElementById('diff').textContent = changed + ' of the 64 characters changed (yellow). The length never changes, whether you type one letter or a novel, and nothing in the output tells you the input.';
  }
  function check() {
    var h = sha256(typed.value);
    document.getElementById('check').textContent = 'sha256(typed) = ' + h + NL + (h === STORED ? 'same as the stored hash: logged in' : 'different from the stored hash: wrong password');
  }
  txt.addEventListener('input', upd);
  typed.addEventListener('input', check);
  upd(); check();
<\/script>`
  }],
  quiz:[
    { q:'With a Caesar cipher and key 3, what does <code>abc</code> encrypt to?', options:['xyz','bcd','def','cba'], answer:2, why:'Each letter moves three places forward: a becomes d, b becomes e, c becomes f.' },
    { q:'Why is encrypting stored passwords risky, even with a strong cipher such as AES?', options:['AES is easy to break','Encrypted text is too long for the database','Anyone who steals the key along with the database can decrypt every password','Encryption is too slow for logins'], answer:2, why:'Encryption is reversible by design. The key has to live somewhere the server can reach, so it can leak with everything else.' },
    { q:'If the server stores only hashes, how does it check a login?', options:['It reverses the stored hash and compares the result','It hashes the typed password the same way and compares the two hashes','It asks the user for the key','It compares the password lengths'], answer:1, why:'The same input always gives the same hash, so equal hashes mean the same password, and the original never has to be stored.' },
    { q:'Why can a site that hashes passwords not email you your forgotten one?', options:['Email is not secure','The hash cannot be turned back into the password, so it can only offer a reset','It could, but chooses not to','Hashes expire after a day'], answer:1, why:'Hashing is one-way. A site that can send your actual password is storing it in plain text or reversibly encrypted.' },
  ],
});

/* =====================================================================
   269 · How to hack passwords
   ===================================================================== */
PG.add({
  id:'l269', index:269, udemyId:41780534, minutes:12, section:'s35', slug:'how-to-hack-passwords', kind:'read',
  title:'How to Hack Passwords',
  blurb:'This lecture looks at a stolen table of hashes from the attacker\'s side. Because the same password always gives the same hash, users who share a password stand out straight away. A <b>lookup table</b> built by hashing common passwords and dictionary words reverses weak ones instantly, and a GPU can try billions of fast hashes such as MD5 every second. Length is what protects a password, since every extra character multiplies the work. These weaknesses are what salting fixes in the next level.',
  explore:[{
    title:'A lookup-table attack on unsalted hashes', height:620,
    note:'First spot the two rows with the same hash. Then run the lookup, add your own guesses to the attacker\'s table, and finally tick the salt box to see why the attack stops working.',
    html:`
<div class="knobs">
  <label><input type="checkbox" id="salt"> the server salts each password</label>
  <button id="crack">Run the lookup</button>
  <button id="hide">Hide results</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:3;min-width:330px">
    <h4>Leaked users table</h4>
    <table class="grid" id="leak"></table>
    <p class="note" id="leakNote" style="margin-top:10px"></p>
  </div>
  <div class="stage" style="flex:2;min-width:230px">
    <h4>Attacker's lookup table (MD5)</h4>
    <div style="margin-bottom:8px"><input type="text" id="guess" placeholder="add a guess" style="width:140px"> <button id="add">add</button></div>
    <pre class="readout" id="table" style="max-height:300px;overflow:auto;font-size:11px"></pre>
  </div>
</div>
<script>
  var NL = String.fromCharCode(10);
  ${MD5_JS}
  var USERS = [
    { user: 'alice', pw: '123456' }, { user: 'bilal', pw: 'password' }, { user: 'chen', pw: 'qwerty' },
    { user: 'dana', pw: '123456' }, { user: 'emeka', pw: 'sunshine' }, { user: 'fiona', pw: 'Ap9!x' },
    { user: 'gwen', pw: 'plinth otter saffron glacier' }
  ];
  var WORDS = ['123456', 'password', '123456789', '12345678', '12345', 'qwerty', '111111', 'abc123', 'password1', 'iloveyou',
    'letmein', 'monkey', 'dragon', 'sunshine', 'football', 'princess', 'welcome', 'admin', 'shadow', 'master', 'qwerty123', '000000'];
  var salts = {}, cracked = false;
  function esc(s) { return String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;'); }
  function hex8() { var s = ''; for (var i = 0; i < 8; i++) s += '0123456789abcdef'.charAt(Math.floor(Math.random() * 16)); return s; }
  function newSalts() { USERS.forEach(function (u) { salts[u.user] = hex8(); }); }
  function lookup() { var t = {}; WORDS.forEach(function (w) { t[md5(w)] = w; }); return t; }
  function render() {
    var salted = document.getElementById('salt').checked, t = lookup(), found = 0;
    var rows = USERS.map(function (u) { return { u: u, h: salted ? md5(salts[u.user] + u.pw) : md5(u.pw) }; });
    var count = {};
    rows.forEach(function (r) { count[r.h] = (count[r.h] || 0) + 1; });
    var html = '<tr><th>user</th>' + (salted ? '<th>salt</th>' : '') + '<th>password column</th>' + (cracked ? '<th>lookup</th>' : '') + '</tr>';
    rows.forEach(function (r) {
      html += '<tr' + (count[r.h] > 1 ? ' style="background:#fff4d6"' : '') + '><td>' + r.u.user + '</td>';
      if (salted) html += '<td><code>' + salts[r.u.user] + '</code></td>';
      html += '<td><code style="font-size:11px">' + r.h + '</code></td>';
      if (cracked) {
        var hit = salted ? null : t[r.h];
        if (hit) found++;
        html += '<td>' + (hit ? '<b style="color:#b3261e">' + esc(hit) + '</b>' : '<span style="color:#8a91a8">not found</span>') + '</td>';
      }
      html += '</tr>';
    });
    document.getElementById('leak').innerHTML = html;
    var note;
    if (!cracked) note = salted
      ? 'Same passwords as before, but each row was hashed with its own random salt, so alice and dana no longer match.'
      : 'The highlighted rows share a hash, so they share a password. The attacker knows that before cracking anything.';
    else if (salted) note = 'Nothing matches. The lookup table holds unsalted hashes. To crack one user the attacker must rebuild the whole table with that user’s salt, then do it again for the next user. bcrypt adds the salt for you and is slow on purpose.';
    else note = found + ' of ' + USERS.length + ' passwords recovered by a simple lookup. fiona’s five characters are not in the table, but brute force (next demo) finds them in a fraction of a second. Only gwen’s long passphrase is out of reach.';
    document.getElementById('leakNote').textContent = note;
    var lines = Object.keys(t).map(function (h) { return h + '  ' + t[h]; });
    document.getElementById('table').textContent = WORDS.length + ' entries (real tables hold billions)' + NL + NL + lines.join(NL);
  }
  newSalts();
  document.getElementById('salt').addEventListener('change', function () { newSalts(); render(); });
  document.getElementById('crack').addEventListener('click', function () { cracked = true; render(); });
  document.getElementById('hide').addEventListener('click', function () { cracked = false; render(); });
  function addGuess() {
    var g = document.getElementById('guess');
    if (g.value && WORDS.indexOf(g.value) < 0) WORDS.push(g.value);
    g.value = '';
    render();
  }
  document.getElementById('add').addEventListener('click', addGuess);
  document.getElementById('guess').addEventListener('keydown', function (e) { if (e.key === 'Enter') addGuess(); });
  render();
<\/script>`
  }, {
    title:'How long would brute force take?', height:520,
    note:'A brute-force attack tries every combination of characters. Move the length slider one step at a time and watch the time multiply, then compare a fast hash with a slow one.',
    html:`
<div class="knobs">
  <label>length <input type="range" id="len" min="4" max="20" value="8"><span class="val" id="lenv"></span></label>
  <label>characters <select id="cs">
    <option value="10">digits (10)</option>
    <option value="26" selected>lowercase letters (26)</option>
    <option value="52">upper and lower case (52)</option>
    <option value="62">letters and digits (62)</option>
    <option value="95">everything on the keyboard (95)</option>
  </select></label>
  <label>hash <select id="sp">
    <option value="20000000000" selected>MD5, one GPU, about 20 billion guesses a second</option>
    <option value="17000">bcrypt, one GPU, about 17 thousand guesses a second</option>
  </select></label>
</div>
<pre class="readout" id="out"></pre>
<div class="stage"><table class="grid" id="tbl"></table></div>
<p class="note">The speeds are the rough figures quoted in this section; real numbers depend on the hardware and on bcrypt’s cost setting. These times are for random characters. A dictionary word falls instantly however long it is.</p>
<script>
  var NL = String.fromCharCode(10);
  function sci(n) { var e = Math.floor(Math.log(n) / Math.LN10); return (n / Math.pow(10, e)).toFixed(1) + ' x 10^' + e; }
  function big(n) { return n < 1e15 ? Math.round(n).toLocaleString() : sci(n); }
  function human(s) {
    if (s < 1) return 'under a second';
    var U = [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['year', 31557600]], u = U[0];
    for (var i = 0; i < U.length; i++) if (s >= U[i][1]) u = U[i];
    var v = s / u[1];
    if (u[0] === 'year' && v >= 1e6) return 'about ' + sci(v) + ' years';
    v = v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
    return v.toLocaleString() + ' ' + u[0] + (v === 1 ? '' : 's');
  }
  var len = document.getElementById('len'), cs = document.getElementById('cs'), sp = document.getElementById('sp');
  function upd() {
    var L = +len.value, C = +cs.value, S = +sp.value, combos = Math.pow(C, L);
    document.getElementById('lenv').textContent = L;
    document.getElementById('out').textContent = C + '^' + L + ' = ' + big(combos) + ' possible passwords' + NL +
      'to try them all: ' + human(combos / S) + NL + 'on average (found halfway): ' + human(combos / S / 2);
    var html = '<tr><th>length</th><th>' + C + ' characters, MD5</th><th>' + C + ' characters, bcrypt</th></tr>';
    [6, 8, 10, 12, 14, 16].forEach(function (n) {
      var c = Math.pow(C, n);
      html += '<tr' + (n === L ? ' style="background:#e6f0ff;font-weight:600"' : '') + '><td>' + n + '</td><td>' + human(c / 2e10) + '</td><td>' + human(c / 17000) + '</td></tr>';
    });
    document.getElementById('tbl').innerHTML = html;
  }
  [len, cs, sp].forEach(function (el) { el.addEventListener('input', upd); el.addEventListener('change', upd); });
  upd();
<\/script>`
  }],
  quiz:[
    { q:'Two rows in a leaked table have exactly the same password hash. What does the attacker learn?', options:['Nothing, hashes are random','Those two users have the same password','Those two users signed up on the same day','The hash function is broken'], answer:1, why:'Hashing is deterministic: the same input always gives the same output. Salting is what breaks this link.' },
    { q:'What is a lookup-table (hash table) attack?', options:['Guessing passwords on the live login form','Hashing many likely passwords in advance, then looking each stolen hash up in that table','Reading the server\'s memory','Decrypting hashes with a stolen key'], answer:1, why:'The attacker pays the cost of hashing once. After that, reversing a weak password is a quick lookup.' },
    { q:'Which password resists cracking best?', options:['P@ss1 (short, but has a symbol and a number)','password123','A long phrase of unrelated words that is in no dictionary','Your phone number'], answer:2, why:'Length multiplies the number of combinations, and words that are not in any list never show up in a lookup table.' },
    { q:'Why is a fast hash such as MD5 a poor choice for passwords?', options:['Its hashes are too short to store','A GPU can try billions of MD5 guesses per second, so weak passwords fall quickly','It is not deterministic','It cannot hash numbers'], answer:1, why:'Speed helps the attacker. Password hashes such as bcrypt are slow on purpose.' },
  ],
});

/* =====================================================================
   270 · Level 3: salting with bcrypt
   ===================================================================== */
PG.add({
  id:'l270', index:270, udemyId:41780536, minutes:19, section:'s35', slug:'level-3-salting-with-bcrypt', kind:'node',
  title:'Level 3 - How to Salt Passwords for Improved Encryption',
  blurb:'A <b>salt</b> is a random string mixed into each password before hashing, so equal passwords no longer give equal hashes and precomputed tables become useless. <b>bcrypt</b> adds the salt for you and is slow on purpose. Its <b>salt rounds</b> setting doubles the work with every step up. Registering now stores <code>bcrypt.hash(password, saltRounds)</code>, and logging in asks <code>bcrypt.compare(typed, storedHash)</code>.',
  tasks:[
    'Import <code>bcrypt</code> and add <code>const saltRounds = 10;</code> under the port.',
    'In <code>POST /register</code>, call <code>bcrypt.hash(password, saltRounds, async (err, hash) => { … })</code> where the INSERT used to be. Inside the callback, log <code>err</code> if there is one; otherwise insert <code>hash</code> (not <code>password</code>) and render <code>secrets.ejs</code>.',
    'Register two different emails with the <b>same</b> password, then open <code>/debug/users</code>. Each password column holds a 60-character string starting <code>$2a$10$</code>, and the two are completely different.',
    'In <code>POST /login</code>, rename the variables to <code>loginPassword</code> and <code>storedHashedPassword</code>, and swap the <code>===</code> check for <code>bcrypt.compare(loginPassword, storedHashedPassword, (err, valid) => { … })</code>, keeping the plain text first and the stored hash second.',
    'Log in with the right password and a wrong one. Then set <code>saltRounds</code> to 12, run again and notice that registering is slower. Try 4, then put it back to 10.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: USERS_TABLE },
  smoke:[
    { method:'GET', path:'/', expect:200 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'hopper1906' }, expect:200 },
    { method:'POST', path:'/register', body:{ username:'alan@example.com', password:'hopper1906' }, expect:200 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'again' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'grace@example.com', password:'hopper1906' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'grace@example.com', password:'wrong' }, expect:200 },
    { method:'POST', path:'/login', body:{ username:'nobody@example.com', password:'x' }, expect:200 },
    { method:'GET', path:'/debug/users', expect:200 },
  ],
  files: Object.assign({
'index.js':`import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// TODO 1: import bcrypt

const app = express();
const port = 3000;
// TODO 1: const saltRounds = 10;

${DB_LOCAL}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

${PAGES}

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // TODO 2: hash first: bcrypt.hash(password, saltRounds, async (err, hash) => { ... })
      //         and move the INSERT (storing hash) and the render inside that callback
      await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password; // TODO 4: rename to loginPassword

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password; // TODO 4: rename to storedHashedPassword

      // TODO 4: a hash never equals the typed text, so swap this check for
      //         bcrypt.compare(loginPassword, storedHashedPassword, (err, valid) => { ... })
      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

${DEBUG}

${LISTEN}
`,
  }, views(), {
'package.json': pkg('secrets-level-3', BASE_DEPS.concat(['bcrypt'])),
  }),
  solution:{ 'index.js': L3_SOLUTION },
  explore:[{
    title:'bcrypt: salt and cost, live', height:600,
    note:'Hash the same password twice: the salt is random, so the two results never match. Drag the rounds slider and press the button again to feel each extra round double the time. The bottom panel runs <code>bcrypt.compare</code> against the first hash.',
    html:`
<script src="vendor/bcrypt/bcrypt.min.js"><\/script>
<div class="knobs">
  <label>password <input type="text" id="pw" value="123456" style="width:150px"></label>
  <label>salt rounds <input type="range" id="r" min="4" max="14" value="10"><span class="val" id="rv"></span></label>
  <button id="go">Hash it twice</button>
</div>
<div class="stage">
  <h4>bcrypt.hash(password, saltRounds), called twice</h4>
  <pre class="readout" id="out"></pre>
  <p class="note" id="time"></p>
</div>
<div class="stage">
  <h4>bcrypt.compare(typed, firstHash)</h4>
  <label class="note">typed password <input type="text" id="typed" value="123456" style="width:150px"></label>
  <pre class="readout" id="cmp" style="margin-top:10px"></pre>
</div>
<script>
  var NL = String.fromCharCode(10);
  var B = window.dcodeIO && window.dcodeIO.bcrypt, first = null, timer = null;
  var COL = ['#9ca3af', '#fbbf24', '#34d399', '#93c5fd'];
  function seg(t, i) { return '<span style="color:' + COL[i] + '">' + t + '</span>'; }
  function paint(h) { return seg(h.slice(0, 4), 0) + seg(h.slice(4, 7), 1) + seg(h.slice(7, 29), 2) + seg(h.slice(29), 3); }
  var LEGEND = seg('version', 0) + '  ' + seg('cost', 1) + '  ' + seg('22-character salt', 2) + '  ' + seg('31-character hash', 3);
  var r = document.getElementById('r'), out = document.getElementById('out');
  function go() {
    if (!B) { out.textContent = 'bcrypt could not be loaded.'; return; }
    var rounds = +r.value, pw = document.getElementById('pw').value;
    out.textContent = 'hashing at ' + rounds + ' rounds...';
    document.getElementById('time').textContent = '';
    setTimeout(function () {
      var t0 = performance.now(), h1 = B.hashSync(pw, rounds), t1 = performance.now(), h2 = B.hashSync(pw, rounds), t2 = performance.now();
      first = h1;
      out.innerHTML = paint(h1) + NL + paint(h2) + NL + NL + LEGEND;
      document.getElementById('time').textContent = 'Took ' + Math.round(t1 - t0) + ' ms and ' + Math.round(t2 - t1) + ' ms at ' + rounds +
        ' rounds. Same password, different salt, different hash. The cost and salt are stored inside the hash, so no separate salt column is needed. (Node’s bcrypt writes $2b$; this browser copy writes $2a$. Both are bcrypt.)';
      check();
    }, 30);
  }
  function check() {
    var el = document.getElementById('cmp');
    if (!first) { el.textContent = 'Hash something first.'; return; }
    var ok = B.compareSync(document.getElementById('typed').value, first);
    el.textContent = 'compare reads the cost and salt out of the stored hash, hashes the typed text the same way, then compares:' + NL + (ok ? 'true: same password, log them in' : 'false: wrong password');
  }
  r.addEventListener('input', function () { document.getElementById('rv').textContent = r.value; });
  document.getElementById('rv').textContent = r.value;
  document.getElementById('go').addEventListener('click', go);
  document.getElementById('typed').addEventListener('input', function () {
    clearTimeout(timer);
    document.getElementById('cmp').textContent = 'checking...';
    timer = setTimeout(check, 350);
  });
  go();
<\/script>`
  }],
  notes:`<h3>Playground notes</h3>
<ul>
  <li>The playground's <code>bcrypt</code> is bcrypt.js, a pure-JavaScript version with the same <code>hash</code> and <code>compare</code> functions. Its hashes start <code>$2a$</code>; the native <code>bcrypt</code> package on your machine writes <code>$2b$</code>. Both are bcrypt.</li>
  <li>Every ▶ Run starts with an empty <code>users</code> table, so there are no plain-text rows left over from Level 1. On your own machine, delete them: they can never pass <code>bcrypt.compare</code>.</li>
</ul>`,
  quiz:[
    { q:'Two users pick the same password. Why do their bcrypt hashes differ?', options:['bcrypt adds the email to the password','Each hash is made with its own random salt','bcrypt hashes are random and cannot be checked','The second user gets more rounds'], answer:1, why:'A fresh salt goes into every hash, so equal passwords produce unrelated results and precomputed tables stop working.' },
    { q:'Where does bcrypt keep the salt?', options:['In a separate salt column you must add','In an environment variable','Inside the hash string itself, after the version and cost','It throws the salt away'], answer:2, why:'A bcrypt hash looks like $2b$10$ followed by 22 characters of salt and 31 of hash, so compare can read everything it needs from the stored value.' },
    { q:'What happens when <code>saltRounds</code> goes from 10 to 11?', options:['Nothing noticeable','Each hash takes roughly twice as long','Hashes get twice as long','Old hashes stop working'], answer:1, why:'The cost is a power of two, so every extra round doubles the work. Raise it as hardware gets faster, and existing hashes keep working because each one records its own cost.' },
    { q:'Why not hash the login password and compare it to the stored hash with <code>===</code>?', options:['=== is too slow','A new random salt would make the new hash different every time; bcrypt.compare reuses the stored salt','Strings cannot be compared with ===','It works fine'], answer:1, why:'compare(plain, stored) takes the salt and cost from the stored hash and hashes the typed text with them, so the results are comparable.' },
  ],
});

/* =====================================================================
   271 · Cookies and sessions with Passport
   ===================================================================== */
PG.add({
  id:'l271', index:271, udemyId:41780540, minutes:33, section:'s35', slug:'cookies-and-sessions', kind:'node',
  title:'Managing Cookies and Sessions',
  blurb:'A <b>cookie</b> is a small value the server asks the browser to keep and send back on every request. With <code>express-session</code> the cookie holds only a session id, while the data stays on the server, so a logged-in visitor stays logged in from page to page. <b>Passport</b> and its <code>passport-local</code> strategy add the login side: a <code>verify</code> function checks the email and password, <code>serializeUser</code> stores the user in the session, <code>req.isAuthenticated()</code> guards the secrets page, and <code>req.login</code> / <code>req.logout</code> start and end a session.',
  tasks:[
    'Import <code>session</code>, <code>passport</code> and <code>{ Strategy }</code> from <code>passport-local</code>. Register <code>app.use(session({ secret: "TOPSECRETWORD", resave: false, saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 60 * 24 } }))</code>, then <code>app.use(passport.initialize())</code> and <code>app.use(passport.session())</code> after it.',
    'Add <code>GET /secrets</code>: render <code>secrets.ejs</code> when <code>req.isAuthenticated()</code> is true, otherwise redirect to <code>/login</code>. Visit <code>/secrets</code> now and you land on the login page.',
    'Move the login check into <code>passport.use(new Strategy(async function verify(username, password, cb) { … }))</code>. Report the result with <code>cb(null, user)</code> for the right password, <code>cb(null, false)</code> for a wrong password or unknown email, and <code>cb(err)</code> when something breaks. Add <code>serializeUser</code> and <code>deserializeUser</code> that pass the user straight through.',
    'Replace the body of <code>POST /login</code> with <code>passport.authenticate("local", { successRedirect: "/secrets", failureRedirect: "/login" })</code>. Log in as <code>ada@example.com</code> / <code>lovelace1815</code>, an account that is already in the database.',
    'In <code>POST /register</code>, add <code>RETURNING *</code> to the INSERT, take <code>result.rows[0]</code>, call <code>req.login(user, cb)</code> and redirect to <code>/secrets</code>. Send already-registered emails to <code>/login</code>.',
    'Add <code>GET /logout</code>: <code>req.logout(cb)</code>, then redirect to <code>/</code>. Test the whole loop: register, reload <code>/secrets</code> (you stay in, and 🍪 <code>connect.sid</code> appears above the browser), log out, and <code>/secrets</code> sends you back to the login page.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: SEED_ADA },
  smoke:[
    { method:'GET', path:'/secrets', expect:302 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'hopper1906' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'GET', path:'/secrets', expect:302 },
    { method:'POST', path:'/login', body:{ username:'ada@example.com', password:'lovelace1815' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'POST', path:'/login', body:{ username:'ada@example.com', password:'wrong' }, expect:302 },
    { method:'GET', path:'/secrets', expect:302 },
    { method:'POST', path:'/login', body:{ username:'nobody@example.com', password:'x' }, expect:302 },
    { method:'POST', path:'/register', body:{ username:'ada@example.com', password:'whatever' }, expect:302 },
  ],
  files: Object.assign({
'index.js':`import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
// TODO 1: import session from "express-session", passport from "passport"
//         and { Strategy } from "passport-local"

const app = express();
const port = 3000;
const saltRounds = 10;

// TODO 1: app.use(session({ ... })) goes here, before everything that needs a session

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// TODO 1: app.use(passport.initialize()) and app.use(passport.session())

// The playground's database already has one account: ada@example.com / lovelace1815
${DB_LOCAL}

${PAGES}

// TODO 6: GET /logout → req.logout(callback), then redirect to "/"

// TODO 2: GET /secrets → render secrets.ejs only if req.isAuthenticated(), otherwise redirect to /login

// TODO 4: once verify (TODO 3) does the checking, replace this whole handler with
//         passport.authenticate("local", { successRedirect: "/secrets", failureRedirect: "/login" })
${LOGIN_BCRYPT}

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in."); // TODO 5: redirect to /login instead
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          // TODO 5: add RETURNING *, log the new user in with req.login(user, cb)
          //         and redirect to /secrets instead of rendering the page
          await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hash]
          );
          res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// TODO 3: passport.use(new Strategy(async function verify(username, password, cb) { ... }))
//         cb(null, user) = logged in · cb(null, false) = wrong details · cb(err) = something broke

// TODO 3: passport.serializeUser((user, cb) => ...) and passport.deserializeUser((user, cb) => ...)

${DEBUG}

${LISTEN}
`,
  }, views({ secrets: SECRETS_LOGOUT }), {
'package.json': pkg('secrets-sessions', SESSION_DEPS),
  }),
  solution:{ 'index.js': L4_SOLUTION },
  explore:[{
    title:'A session cookie, request by request', height:640,
    note:'Press the buttons in any order. The left panel is what the browser sends, the right is what the server answers, and underneath you can see what each side keeps. Try logging in, deleting the cookie, and restarting the server.',
    html:`
<div class="knobs">
  <button data-a="secrets">GET /secrets</button>
  <button data-a="login">POST /login (right password)</button>
  <button data-a="wrong">POST /login (wrong password)</button>
  <button data-a="logout">GET /logout</button>
  <button data-a="delete">delete the cookie</button>
  <button data-a="restart">restart the server</button>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:250px"><h4>Request</h4><pre class="readout" id="req" style="min-height:110px;white-space:pre-wrap"></pre></div>
  <div style="flex:1;min-width:250px"><h4>Response</h4><pre class="readout" id="res" style="min-height:110px;white-space:pre-wrap"></pre></div>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="stage" style="flex:1;min-width:200px"><h4>Cookie the browser holds</h4><pre id="jar" style="margin:0;white-space:pre-wrap"></pre></div>
  <div class="stage" style="flex:1;min-width:260px"><h4>Sessions in the server's memory</h4><pre id="store" style="margin:0;white-space:pre-wrap"></pre></div>
</div>
<p class="note" id="say">Start with GET /secrets.</p>
<script>
  var NL = String.fromCharCode(10);
  var jar = null, store = {};
  function newId() { var s = ''; for (var i = 0; i < 12; i++) s += 'abcdefghijkmnpqrstuvwxyz23456789'.charAt(Math.floor(Math.random() * 32)); return s; }
  function paint() {
    document.getElementById('jar').textContent = jar ? 'connect.sid = ' + jar : '(none)';
    var ids = Object.keys(store);
    document.getElementById('store').textContent = ids.length ? ids.map(function (id) {
      var s = store[id], body = s.passport ? '{ passport: { user: { id: 1, email: "ada@example.com" } } }' : '{ }  (no one logged in)';
      return id + (id === jar ? '   <- the browser’s cookie' : '') + NL + '  ' + body;
    }).join(NL + NL) : '(empty)';
  }
  function send(method, path, body) {
    var req = [method + ' ' + path + ' HTTP/1.1', jar ? 'Cookie: connect.sid=' + jar : '(no Cookie header: nothing stored for this site yet)'];
    if (body) req.push('', body);
    var id = jar && store[jar] ? jar : null, fresh = !id, out = [], note;
    if (fresh) { id = newId(); store[id] = {}; }
    var s = store[id], status;
    if (path === '/secrets') {
      if (s.passport) { status = '200 OK'; out.push('', '(the secrets page)'); note = 'The id in the cookie leads to a session holding passport.user, so req.isAuthenticated() is true.'; }
      else { status = '302 Found'; out.push('Location: /login'); note = 'This session holds no passport.user, so req.isAuthenticated() is false and the route redirects to /login.'; }
    } else if (path === '/login' && body.indexOf('wrong') < 0) {
      s.passport = true; status = '302 Found'; out.push('Location: /secrets');
      note = 'verify called cb(null, user) and serializeUser saved the user in this session. The cookie still carries only the id.';
    } else if (path === '/login') {
      status = '302 Found'; out.push('Location: /login');
      note = 'verify called cb(null, false). Nothing was saved, so this browser is still logged out.';
    } else {
      delete s.passport; status = '302 Found'; out.push('Location: /');
      note = 'req.logout removed passport.user from the session. The cookie is still there, but it now leads to a logged-out session.';
    }
    if (fresh) {
      out.unshift('Set-Cookie: connect.sid=' + id + '; Path=/; Max-Age=86400; HttpOnly');
      note = (jar ? 'The server does not recognise the id it was sent, so it starts a new session. ' : 'First visit: express-session created a session and sent its id in Set-Cookie. ') + note;
      jar = id;
    }
    document.getElementById('req').textContent = req.join(NL);
    document.getElementById('res').textContent = ['HTTP/1.1 ' + status].concat(out).join(NL);
    document.getElementById('say').textContent = note;
    paint();
  }
  var actions = {
    secrets: function () { send('GET', '/secrets'); },
    login: function () { send('POST', '/login', 'username=ada%40example.com&password=lovelace1815'); },
    wrong: function () { send('POST', '/login', 'username=ada%40example.com&password=wrong-guess'); },
    logout: function () { send('GET', '/logout'); },
    'delete': function () {
      jar = null; idle('You deleted the cookie in the browser.'); paint();
      document.getElementById('say').textContent = 'The browser forgot the id. The old session is still in the store, but nothing points to it now, and it expires after maxAge. The next request starts a new, logged-out session.';
    },
    restart: function () {
      store = {}; idle('The server restarted.'); paint();
      document.getElementById('say').textContent = 'The default session store lives in server memory, so a restart wipes it. The browser will still send its old id, which the server no longer knows, so everyone has to log in again. A database-backed session store avoids this.';
    }
  };
  function idle(what) {
    document.getElementById('req').textContent = '(' + what + ' Send a request to see the effect.)';
    document.getElementById('res').textContent = '';
  }
  document.querySelectorAll('[data-a]').forEach(function (b) { b.addEventListener('click', function () { actions[b.getAttribute('data-a')](); }); });
  paint();
<\/script>`
  }],
  notes:`<h3>Playground notes</h3>
<ul>
  <li>The 🍪 label above the built-in browser shows the cookies it holds, and the Postman panel shows the <code>Set-Cookie</code> header of any response.</li>
  <li>Each ▶ Run starts a new server with an empty session store and a fresh database, so you have to log in again after every run. The account <code>ada@example.com</code> / <code>lovelace1815</code> is always there; anyone you register disappears at the next run.</li>
  <li>For an unknown email the course's code calls <code>cb("User not found")</code>. Passport treats that as an error and shows an error page. This lesson calls <code>cb(null, false)</code> instead, so a mistyped email is just a failed login, like a wrong password.</li>
  <li>Real Passport (0.6 and later) also swaps in a fresh session id when someone logs in or out, as protection against session fixation. The playground keeps the same id, but the idea is the same.</li>
</ul>`,
  quiz:[
    { q:'What does the <code>connect.sid</code> cookie contain in this app?', options:['The user\'s email and password','The whole user row, encrypted','Only a session id; the session data stays on the server','The bcrypt hash'], answer:2, why:'The cookie is a ticket number. express-session uses it to look the session up in its store.' },
    { q:'Why must <code>app.use(session(...))</code> come before <code>app.use(passport.session())</code>?', options:['Alphabetical order','passport.session() reads req.session, which only exists once the session middleware has run','It does not matter','Express runs middleware from the bottom up'], answer:1, why:'Middleware runs top to bottom. Passport stores and reads its data inside the session, so the session has to be set up first.' },
    { q:'In the verify function, what should a wrong password call?', options:['cb(new Error("wrong password"))','cb(null, false)','res.send("Incorrect Password")','cb(null, user)'], answer:1, why:'A failed login is a normal outcome, not an error. false tells passport.authenticate to use the failureRedirect.' },
    { q:'What does <code>req.login(user, cb)</code> do after a successful registration?', options:['Sends a confirmation email','Saves the user in the session exactly as a normal login would, so the visitor is already logged in','Checks the password again','Creates the database row'], answer:1, why:'It runs serializeUser and starts the session, so the new user can go straight to /secrets.' },
    { q:'You remove <code>cookie.maxAge</code> from the session options. When does a login end?', options:['Never','After 24 hours','When the browser is closed, because the cookie becomes a session cookie','After each request'], answer:2, why:'Without maxAge the browser keeps the cookie only until it closes. With maxAge it survives restarts until it expires.' },
  ],
});

/* =====================================================================
   272 · Level 5: environment variables
   ===================================================================== */
PG.add({
  id:'l272', index:272, udemyId:41780544, minutes:17, section:'s35', slug:'level-5-environment-variables', kind:'node',
  title:'Level 5 - Hide your Secrets with Environment Variables',
  blurb:'This level protects <i>your</i> secrets: the session secret, the database password and any API keys. If they sit in <code>index.js</code>, they get pushed to GitHub along with the code, and bots scan public repositories for exactly that. Move them into a <code>.env</code> file, load it with <code>dotenv</code>, read each value as <code>process.env.NAME</code>, and list <code>.env</code> in <code>.gitignore</code> before your first commit.',
  tasks:[
    'In <code>.env</code>, add the session secret as <code>SESSION_SECRET="TOPSECRETWORD"</code>: one variable per line, upper-case name, no spaces around <code>=</code>, and no <code>const</code>, commas or semicolons.',
    'In <code>index.js</code>, add <code>import env from "dotenv";</code> and call <code>env.config();</code> near the top, then replace the hard-coded secret with <code>process.env.SESSION_SECRET</code>.',
    'Move the five database settings into <code>.env</code> as <code>PG_USER</code>, <code>PG_HOST</code>, <code>PG_DATABASE</code>, <code>PG_PASSWORD</code> and <code>PG_PORT</code>, and use <code>process.env.PG_…</code> for each option of <code>pg.Client</code>.',
    'Check that it works: temporarily add <code>console.log(process.env.PG_DATABASE)</code>, press ▶ Run and look for <code>secrets</code> in the terminal, then delete the line. <code>index.js</code> should now contain no secret values at all.',
    'In <code>.gitignore</code>, add <code>node_modules/</code> and <code>.env</code>, one per line. The Explore tab shows what a push would upload with and without them.',
    'Walk through register, <code>/secrets</code> and log out once more to confirm nothing broke (<code>ada@example.com</code> / <code>lovelace1815</code> still works).'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: SEED_ADA },
  smoke:[
    { method:'GET', path:'/secrets', expect:302 },
    { method:'POST', path:'/login', body:{ username:'ada@example.com', password:'lovelace1815' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'GET', path:'/secrets', expect:302 },
    { method:'POST', path:'/register', body:{ username:'grace@example.com', password:'hopper1906' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
  ],
  files: Object.assign({
'index.js': L4_SOLUTION.replace('const saltRounds = 10;\n', 'const saltRounds = 10;\n// TODO 2: import dotenv as env at the top, and call env.config() here\n')
  .replace('    secret: "TOPSECRETWORD",', '    secret: "TOPSECRETWORD", // TODO 2: read it from process.env instead')
  .replace('const db = new pg.Client({\n', '// TODO 3: read every one of these settings from process.env\nconst db = new pg.Client({\n'),
'.env':`# TODO 1: one secret per line, written NAME="value"
# (no spaces around =, no const, no commas or semicolons).
# TODO 3: then the database settings: PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT
`,
'.gitignore':`# TODO 5: list what Git must never commit, one entry per line:
# the node_modules/ folder and the .env file
`,
  }, views({ secrets: SECRETS_LOGOUT }), {
'package.json': pkg('secrets-env', SESSION_DEPS.concat(['dotenv'])),
  }),
  solution:{ 'index.js': L5_SOLUTION, '.env': ENV_272, '.gitignore': GITIGNORE },
  explore:[{
    title:'What would your first push upload?', height:520,
    note:'Edit the <code>.gitignore</code> on the left, or load a preset. The right side shows which project files Git would upload. Start with the empty file and look at what happens to <code>.env</code>.',
    html:`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div style="flex:1;min-width:240px">
    <h4>.gitignore</h4>
    <textarea id="gi" spellcheck="false" style="width:100%;height:230px;font:12.5px ui-monospace,Menlo,monospace;padding:8px;border:1px solid #dfe3ee;border-radius:8px"></textarea>
    <div class="knobs" style="margin-top:8px">
      <button data-p="none">empty</button>
      <button data-p="min">node_modules/ and .env</button>
      <button data-p="tpl">GitHub's Node template (excerpt)</button>
    </div>
  </div>
  <div style="flex:1;min-width:260px">
    <h4>git push would upload</h4>
    <pre class="readout" id="out"></pre>
    <p class="note" id="say"></p>
  </div>
</div>
<p class="note">.gitignore only affects files Git is not tracking yet. If .env was committed before you added it here, it stays in the history, so change the secrets it contained.</p>
<script>
  var NL = String.fromCharCode(10);
  var FILES = ['.env', '.gitignore', 'index.js', 'package.json', 'package-lock.json', 'npm-debug.log',
    'public/css/styles.css', 'views/home.ejs', 'views/secrets.ejs', 'views/partials/header.ejs',
    'node_modules/express/index.js', 'node_modules/pg/lib/client.js', 'node_modules/bcrypt/bcrypt.js'];
  var PRESETS = {
    none: '',
    min: ['node_modules/', '.env', ''].join(NL),
    tpl: ['# Logs', 'logs', '*.log', 'npm-debug.log*', '', '# Dependency directories', 'node_modules/', '',
          '# dotenv environment variable files', '.env', '.env.development.local', '.env.test.local', '.env.production.local', '.env.local', ''].join(NL)
  };
  function glob(p, s) {
    if (!p.length) return !s.length;
    var c = p.charAt(0);
    if (c === '*') {
      for (var i = 0; i <= s.length; i++) { if (glob(p.slice(1), s.slice(i))) return true; if (s.charAt(i) === '/') break; }
      return false;
    }
    if (!s.length) return false;
    if (c === '?' ? s.charAt(0) !== '/' : c === s.charAt(0)) return glob(p.slice(1), s.slice(1));
    return false;
  }
  function ignoredBy(path, rules) {
    var parts = path.split('/'), by = '';
    rules.forEach(function (raw) {
      var r = raw.trim();
      if (!r || r.charAt(0) === '#') return;
      var neg = r.charAt(0) === '!'; if (neg) r = r.slice(1);
      var dirOnly = r.charAt(r.length - 1) === '/'; if (dirOnly) r = r.slice(0, -1);
      var anchored = r.indexOf('/') >= 0; if (r.charAt(0) === '/') r = r.slice(1);
      for (var i = 0; i < parts.length; i++) {
        if (dirOnly && i === parts.length - 1) continue;
        if (glob(r, anchored ? parts.slice(0, i + 1).join('/') : parts[i])) { by = neg ? '' : raw.trim(); break; }
      }
    });
    return by;
  }
  var gi = document.getElementById('gi');
  function upd() {
    var rules = gi.value.split(NL), lines = [], leak = false, deps = false;
    FILES.forEach(function (f) {
      var by = ignoredBy(f, rules);
      if (by) { lines.push('<span style="color:#6b7280">  ' + f + '   (ignored by ' + by.split('<').join('&lt;') + ')</span>'); return; }
      var secret = f.indexOf('.env') === 0;
      if (secret) leak = true;
      if (f.indexOf('node_modules/') === 0) deps = true;
      lines.push(secret ? '<span style="color:#ff8a80">+ ' + f + '   SESSION_SECRET, PG_PASSWORD...</span>' : '+ ' + f + (f.indexOf('node_modules/') === 0 ? '   (+ thousands more)' : ''));
    });
    document.getElementById('out').innerHTML = lines.join(NL);
    document.getElementById('say').textContent = leak
      ? 'Your .env would be public: anyone who can see the repository gets your session secret and database password, and bots look for exactly these files.'
      : deps ? 'Secrets are safe, but node_modules would upload thousands of files that npm install can rebuild from package.json.'
      : 'Clean: your code goes up, while secrets and installed packages stay on your machine.';
  }
  document.querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { gi.value = PRESETS[b.getAttribute('data-p')]; upd(); }); });
  gi.addEventListener('input', upd);
  upd();
<\/script>`
  }],
  notes:`<h3>Playground notes</h3>
<ul>
  <li>On your machine, <code>process.env.SESSION_SECRET</code> is <code>undefined</code> until <code>env.config()</code> has run. The playground's dotenv reads <code>.env</code> as soon as it is imported, so forgetting <code>config()</code> will not break anything here. It will on your machine, so keep the call.</li>
  <li>The playground does not check the session secret or the database settings, so a typo in <code>.env</code> will not stop the app. That is why task 4 logs a value to prove it arrives.</li>
  <li>There is no Git in this lesson. The Explore tab simulates which files a push would include, and the Git lessons in section 27 (lecture 219 is about <code>.gitignore</code>) let you try it with <code>git status</code> in the simulated terminal.</li>
</ul>`,
  quiz:[
    { q:'Which line is valid in a <code>.env</code> file?', options:['const SESSION_SECRET = "abc123";','SESSION_SECRET = "abc123",','SESSION_SECRET="abc123"','sessionSecret: abc123'], answer:2, why:'A .env file is not JavaScript: just NAME="value" on its own line, with no spaces around = and no punctuation at the end.' },
    { q:'What does <code>env.config()</code> do?', options:['Encrypts the .env file','Reads .env and copies each entry onto process.env','Uploads the secrets to the server','Creates a .gitignore'], answer:1, why:'dotenv parses the file and puts every NAME=value pair on process.env, where your code reads it.' },
    { q:'You committed <code>.env</code> last week and added it to <code>.gitignore</code> today. Is the secret safe?', options:['Yes, Git deletes ignored files from history','No: it is still in the earlier commits, so change (rotate) the secret','Yes, if the repository is private','Only if you delete the file'], answer:1, why:'.gitignore stops untracked files from being added; it does not rewrite history. Treat a committed secret as leaked.' },
    { q:'Why is <code>node_modules/</code> in <code>.gitignore</code> too?', options:['It contains your passwords','It is huge and npm install rebuilds it from package.json','Git cannot store JavaScript','GitHub refuses folders'], answer:1, why:'Dependencies are listed in package.json, so anyone who clones the project gets them back with npm install.' },
  ],
});

/* =====================================================================
   273 · Google OAuth credentials (article)
   ===================================================================== */
PG.add({
  id:'l273', index:273, udemyId:41780550, minutes:0, section:'s35', slug:'google-oauth-credentials', kind:'read',
  title:'Set up your Google OAuth Credentials',
  blurb:'Before Google will sign users in to your app, it needs to know the app exists. You register it once in Google Cloud and get a <b>client ID</b> and <b>client secret</b>, which the next lecture puts in <code>.env</code>. The instructor\'s values from the video will not work for you; you need your own.',
  body:`<h3>The checklist</h3>
<p>The playground's Google sign-in page is simulated, so you can work through the next lecture here without credentials. You will need real ones as soon as the app runs on your own machine.</p>
<ol>
  <li>Open <b>console.cloud.google.com</b>, sign in and create a new project. Call it <i>Secrets</i>; no organisation is needed.</li>
  <li>Set up the <b>OAuth consent screen</b>, the page users see when they agree to share their details. It sits under <b>APIs &amp; Services</b> (newer consoles call this area <b>Google Auth Platform</b>). Choose <b>External</b>, then enter an app name, a support email and a developer contact email. A logo and domain are optional, and you can stay in testing mode, which needs no verification.</li>
  <li>Add a single scope, the user's email address. The app needs nothing else, and asking for less makes the consent screen less alarming.</li>
  <li>Go to <b>Credentials → Create credentials → OAuth client ID</b> and pick <b>Web application</b>.</li>
  <li>Under <b>Authorised JavaScript origins</b>, add <code>http://localhost:3000</code>.</li>
  <li>Under <b>Authorised redirect URIs</b>, add <code>http://localhost:3000/auth/google/secrets</code>. Google sends users back to this address after they sign in, so it must match the <code>callbackURL</code> in your code exactly: same scheme, port and path.</li>
  <li>Click <b>Create</b>, then copy the two values into your project's <code>.env</code>:
<pre data-lang="sh">GOOGLE_CLIENT_ID="1234567890-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="paste-your-secret-here"</pre></li>
  <li>Check that <code>.env</code> is listed in <code>.gitignore</code> before you commit anything.</li>
</ol>
<p>Google rearranges this console often. If a menu name does not match, look for the same step under a nearby heading. If Google later refuses your own account while the app is in testing mode, add your address under <b>Test users</b> on the consent-screen page.</p>`,
  links:[
    { title:'Google Cloud console: Credentials', url:'https://console.cloud.google.com/apis/credentials', note:'where the OAuth client ID is created' },
    { title:'Using OAuth 2.0 to access Google APIs', url:'https://developers.google.com/identity/protocols/oauth2', note:'Google\'s overview of the flow' },
  ],
  quiz:[
    { q:'Which redirect URI matches the callback route used in this section?', options:['http://localhost:3000','http://localhost:3000/secrets','http://localhost:3000/auth/google/secrets','https://accounts.google.com/callback'], answer:2, why:'Google only redirects to addresses registered in the console, and this one must be identical to the callbackURL in the strategy options.' },
    { q:'Where should the client secret live?', options:['In index.js, next to the client ID','In a git-ignored .env file, read through process.env','In a front-end script so the browser can use it','In the README'], answer:1, why:'Anyone holding the secret can pose as your app. It belongs with the other secrets in .env.' },
  ],
});

/* =====================================================================
   274 · Level 6: Sign in with Google
   ===================================================================== */
PG.add({
  id:'l274', index:274, udemyId:41780566, minutes:31, section:'s35', slug:'level-6-sign-in-with-google', kind:'node',
  title:'Level 6 - OAuth: Implement "Sign In with Google"',
  blurb:'<b>OAuth</b> lets users prove who they are to Google, so your app never handles their password. The user signs in on Google\'s own page and agrees to the scopes you asked for (here just profile and email). Google then sends them back to your <b>callback URL</b> with a one-time code. Passport\'s Google strategy trades that code for an access token and the user\'s profile, and your verify function finds or creates the user in Postgres. From then on, sessions work exactly as they do for a local login.',
  tasks:[
    'In <code>.env</code>, add <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>. In the playground any placeholder works because the Google page is simulated; on your machine, paste the values from lecture 273.',
    'Import <code>GoogleStrategy</code> from <code>passport-google-oauth2</code>. Now that there are two strategies, name the local one: <code>passport.use("local", new Strategy(…))</code>.',
    'Register <code>passport.use("google", new GoogleStrategy({ clientID, clientSecret, callbackURL: "http://localhost:3000/auth/google/secrets", userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo" }, async (accessToken, refreshToken, profile, cb) => { … }))</code>. For a first test, just <code>console.log(profile)</code> inside it.',
    'Add <code>GET /auth/google</code> with <code>passport.authenticate("google", { scope: ["profile", "email"] })</code> and <code>GET /auth/google/secrets</code> with <code>passport.authenticate("google", { successRedirect: "/secrets", failureRedirect: "/login" })</code>. Open <code>/login</code>, click <i>Sign In with Google</i>, choose <i>Test User</i> and read the profile in the terminal.',
    'Replace the log with find-or-create: <code>SELECT</code> by <code>profile.email</code>. If there is no row, <code>INSERT</code> the email with the password <code>"google"</code>, add <code>RETURNING *</code> and call <code>cb(null, newUser.rows[0])</code>. Otherwise call <code>cb(null, result.rows[0])</code>. In the <code>catch</code>, call <code>cb(err)</code>.',
    'Open <code>/debug/users</code>: <code>testuser@gmail.com</code> is there with password <code>google</code>. Log out and sign in with Google again, and no second row appears. Local login still works too.'
  ],
  run:['index.js'],
  start:'/login',
  db:{ seed: SEED_ADA },
  smoke:[
    { method:'GET', path:'/login', expect:200 },
    { method:'GET', path:'/auth/google', expect:302 },
    { method:'GET', path:'/auth/google/secrets?code=mock-auth-code', expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'GET', path:'/secrets', expect:302 },
    { method:'GET', path:'/auth/google/secrets?code=mock-auth-code', expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'POST', path:'/login', body:{ username:'ada@example.com', password:'lovelace1815' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/debug/users', expect:200 },
  ],
  files: Object.assign({
'index.js': L5_SOLUTION
  .replace('import { Strategy } from "passport-local";\n', 'import { Strategy } from "passport-local";\n// TODO 2: import GoogleStrategy from "passport-google-oauth2"\n')
  .replace(SECRETS_GUARD + '\n', SECRETS_GUARD + `

// TODO 4: GET /auth/google → passport.authenticate("google", { scope: ["profile", "email"] })

// TODO 4: GET /auth/google/secrets → passport.authenticate("google", { successRedirect: "/secrets", failureRedirect: "/login" })
`)
  .replace(localStrategy(false), '// TODO 2: two strategies now, so name this one "local"\n' + localStrategy(false) + `

// TODO 3: passport.use("google", new GoogleStrategy({ ...options }, async (accessToken, refreshToken, profile, cb) => { ... }))
// TODO 5: inside it, find the user by profile.email or create them, then call cb`),
'.env': ENV_272 + '# TODO 1: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (from lecture 273)\n',
  }, views({ google: true, secrets: SECRETS_LOGOUT }), {
'package.json': pkg('secrets-google', SESSION_DEPS.concat(['dotenv', 'passport-google-oauth2'])),
  }),
  solution:{ 'index.js': L6_SOLUTION, '.env': ENV_274 },
  explore:[{
    title:'The OAuth dance, one step at a time', height:700,
    note:'Step through a Google sign-in. Each arrow is one request or redirect, and the table at the bottom tracks which party knows which secret. Notice that the password only ever goes to Google and the client secret never passes through the browser.',
    html:`
<style>
  .lanes, .msg { display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; column-gap: 8px; }
  .lanes div { padding-bottom: 6px; border-bottom: 2px solid #dfe3ee; font-size: 12.5px; font-weight: 700; color: #3c435c; }
  .msg { margin: 6px 0; font-size: 11.5px; }
  .msg .m { padding: 4px 8px; border: 1px solid #dfe3ee; border-radius: 6px; background: #eef1f9; font-family: ui-monospace, Menlo, monospace; word-break: break-all; }
  .msg.cur .m { background: #5b9cff; border-color: #5b9cff; color: #fff; }
  td.y { color: #1f8a4c; font-weight: 700; text-align: center; }
  td.n { color: #c9cedb; text-align: center; }
</style>
<div class="knobs">
  <button id="back">back</button>
  <button id="next">next</button>
  <span class="tag" id="count"></span>
</div>
<div class="stage" style="padding:12px">
  <div class="lanes"><div>Browser</div><div>Your server</div><div>Google</div></div>
  <div id="seq"></div>
</div>
<p class="note" id="detail" style="font-size:13px;color:#1c2030"></p>
<div class="stage"><h4>Who knows what so far</h4><table class="grid" id="knows" style="width:100%"></table></div>
<script>
  var STEPS = [
    { f: 0, t: 1, m: 'GET /auth/google', d: 'The user clicks Sign In with Google. The route runs passport.authenticate("google", { scope: ["profile", "email"] }).' },
    { f: 1, t: 0, m: '302 to accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=.../auth/google/secrets&scope=profile email', d: 'Passport builds Google’s sign-in address from your client ID, callback URL and scopes. The client ID is public, so it is fine for it to pass through the browser.' },
    { f: 0, t: 2, m: 'sign in on google.com, approve the scopes', d: 'The password is typed on Google’s page and never touches your site. The consent screen lists only the scopes you asked for.' },
    { f: 2, t: 0, m: '302 to localhost:3000/auth/google/secrets?code=4/0AeaYSH...', d: 'Google sends the browser back to your callback URL with an authorization code: short-lived and single-use, proof that the user signed in.' },
    { f: 0, t: 1, m: 'GET /auth/google/secrets?code=4/0AeaYSH...', d: 'This is your callbackURL. If it does not exactly match a redirect URI registered in Google Cloud, Google refuses before this step.' },
    { f: 1, t: 2, m: 'POST /token  code + client ID + client secret', d: 'A request from server to server, so the client secret never reaches the browser. Passport makes this exchange for you.' },
    { f: 2, t: 1, m: 'access token (+ refresh token)', d: 'The access token is the longer-lived pass for calling Google on the user’s behalf. The code from step 4 is now used up.' },
    { f: 1, t: 2, m: 'GET userinfo  Authorization: Bearer <access token>', d: 'This is the userProfileURL. Google answers with the profile: email, name and picture, limited to what the scopes allow.' },
    { f: 1, t: 1, m: 'verify(accessToken, refreshToken, profile, cb)', d: 'Your code runs: look the user up by profile.email, insert them on the first visit, then call cb(null, user).' },
    { f: 1, t: 0, m: '302 to /secrets   Set-Cookie: connect.sid=...', d: 'req.login saves the user in the session. From here on everything works exactly like a local login: req.isAuthenticated() is true.' }
  ];
  // the step (1-based) from which each party knows a fact: 0 = from the start, -1 = never
  var FACTS = [
    ['the Google password', [3, -1, 0]],
    ['client ID', [2, 0, 0]],
    ['client secret', [-1, 0, 0]],
    ['authorization code', [4, 5, 4]],
    ['access token', [-1, 7, 7]],
    ['profile (email, name)', [-1, 8, 0]],
    ['session cookie', [10, 10, -1]]
  ];
  var cur = 1;
  function esc(s) { return String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;'); }
  function render() {
    var html = '';
    for (var i = 0; i < cur; i++) {
      var s = STEPS[i], lo = Math.min(s.f, s.t), hi = Math.max(s.f, s.t);
      var label = s.f === s.t ? esc(s.m) : s.f < s.t ? esc(s.m) + ' &#9654;' : '&#9664; ' + esc(s.m);
      html += '<div class="msg' + (i === cur - 1 ? ' cur' : '') + '"><div class="m" style="grid-column:' + (lo + 1) + ' / ' + (hi + 2) + '">' + (i + 1) + '. ' + label + '</div></div>';
    }
    document.getElementById('seq').innerHTML = html;
    document.getElementById('detail').textContent = cur + '. ' + STEPS[cur - 1].d;
    document.getElementById('count').textContent = 'step ' + cur + ' of ' + STEPS.length;
    var t = '<tr><th></th><th>Browser</th><th>Your server</th><th>Google</th></tr>';
    FACTS.forEach(function (f) {
      t += '<tr><td>' + f[0] + '</td>' + f[1].map(function (n) { var k = n === 0 || (n > 0 && cur >= n); return '<td class="' + (k ? 'y' : 'n') + '">' + (k ? 'knows' : '-') + '</td>'; }).join('') + '</tr>';
    });
    document.getElementById('knows').innerHTML = t;
    document.getElementById('back').disabled = cur === 1;
    document.getElementById('next').disabled = cur === STEPS.length;
  }
  document.getElementById('next').addEventListener('click', function () { if (cur < STEPS.length) { cur++; render(); } });
  document.getElementById('back').addEventListener('click', function () { if (cur > 1) { cur--; render(); } });
  render();
<\/script>`
  }],
  notes:`<h3>Playground notes</h3>
<ul>
  <li>The Google page in the built-in browser is a simulation. It always offers one account, <b>Test User</b> (<code>testuser@gmail.com</code>), and returns straight to your callback URL with a pretend code. The code-for-token exchange is skipped, and your verify function receives a profile shaped like Google's.</li>
  <li>On your own machine you need the real client ID and secret from lecture 273, and Google first shows a warning that the app is unverified. That is expected for a test project; continue past it.</li>
  <li>The course's version of the INSERT has no <code>RETURNING *</code>, so <code>newUser.rows[0]</code> is <code>undefined</code> and the first Google login fails. This lesson adds it.</li>
  <li>The logout route from lecture 271 is already in the starter.</li>
</ul>`,
  quiz:[
    { q:'What is the main security win of "Sign in with Google" for you as the developer?', options:['Pages load faster','You never receive or store the user\'s password, so there is nothing of that kind to leak','Google pays for your hosting','Users no longer need a session'], answer:1, why:'Password storage, hashing and breach protection become Google\'s job. Your table only holds the email.' },
    { q:'How does the authorization code differ from the access token?', options:['They are the same thing','The code is single-use proof that the user signed in; the access token is the longer-lived key for fetching their data','The code is for local login only','The token goes to the browser, the code to the server'], answer:1, why:'The code is like a one-time ticket that gets exchanged, server to server, for the token that actually opens the API.' },
    { q:'What must the strategy\'s <code>callbackURL</code> match?', options:['The home page URL','One of the redirect URIs registered in Google Cloud, character for character','The client ID','Any localhost address'], answer:1, why:'Google only sends users back to addresses you registered. A different port or path gives a redirect_uri_mismatch error.' },
    { q:'Why name the strategies <code>"local"</code> and <code>"google"</code>?', options:['Passport needs names for logging','So each passport.authenticate(name) call runs the right verify function','Names make the cookie smaller','Google requires it'], answer:1, why:'With two strategies registered, the name passed to authenticate decides which one handles the request.' },
    { q:'Google users are stored with the password <code>"google"</code>. Can someone log in through the local form with that word?', options:['Yes, that is how Google users log in locally','No: the local strategy runs bcrypt.compare, and "google" is not a bcrypt hash, so it never matches','Only on Sundays','Only if the email is a Gmail address'], answer:1, why:'compare expects a real bcrypt hash. Against a plain placeholder it always returns false, so the local form cannot be used to get into these accounts.' },
  ],
});

/* =====================================================================
   275 · Finish the app: submit secrets
   ===================================================================== */
const SECRETS_275_START = secretsPage('    <!-- TODO 2: print the secret the server passes in, instead of this fixed text -->\n' + FIXED_SECRET, LOGOUT_BTN + SUBMIT_BTN);
const SECRETS_275_DONE = secretsPage('    <p class="secret-text"><%= secret %></p>', LOGOUT_BTN + SUBMIT_BTN);

const L7_SOLUTION = L6_SOLUTION
  .replace('db.connect();\n', `db.connect();

// Stands in for running this once in pgAdmin. IF NOT EXISTS makes it safe on every start.
await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS secret TEXT");
`)
  .replace(SECRETS_GUARD, `app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const result = await db.query("SELECT secret FROM users WHERE email = $1", [
        req.user.email,
      ]);
      const secret = result.rows[0].secret;
      if (secret) {
        res.render("secrets.ejs", { secret: secret });
      } else {
        res.render("secrets.ejs", { secret: "No secret yet. Go on, submit one!" });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  const submittedSecret = req.body.secret;
  try {
    await db.query("UPDATE users SET secret = $1 WHERE email = $2", [
      submittedSecret,
      req.user.email,
    ]);
    res.redirect("/secrets");
  } catch (err) {
    console.log(err);
  }
});`);

const L7_STARTER = L6_SOLUTION
  .replace('db.connect();\n', `db.connect();

// TODO 1: the users table has no secret column yet. In pgAdmin you would run
//         ALTER TABLE users ADD COLUMN secret TEXT; once. Here, run it from code at
//         startup with await db.query(...) (add IF NOT EXISTS so a restart cannot fail).
`)
  .replace(SECRETS_GUARD, `// TODO 5: once the column exists, look up this user's secret (req.user.email) and pass it
//         to secrets.ejs, with a default message when it is still NULL
${SECRETS_GUARD}

// TODO 3: GET /submit → render submit.ejs for logged-in users, otherwise redirect to /login

// TODO 4: POST /submit → save req.body.secret on the logged-in user's row
//         (UPDATE ... WHERE email = req.user.email), then redirect to /secrets`);

PG.add({
  id:'l275', index:275, udemyId:41790508, minutes:16, section:'s35', slug:'finish-the-app-submit-secrets', kind:'node',
  title:'Finish the app: let users submit secrets',
  blurb:'The finishing touch: every user can store a secret of their own. A new <code>secret</code> column on the <code>users</code> table holds it. A protected <code>/submit</code> page saves it against <code>req.user.email</code>, and <code>/secrets</code> reads it back from the database, so it survives logging out and in again, whether the user signed in with a password or with Google.',
  tasks:[
    'Add the column. Near <code>db.connect()</code>, run <code>await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS secret TEXT")</code>, which does the job of pgAdmin\'s Query Tool here (<code>queries.sql</code> shows the statement).',
    'In <code>secrets.ejs</code>, replace the fixed text with <code>&lt;%= secret %&gt;</code>. Until the route passes <code>secret</code>, the page errors; that is your cue for task 5.',
    'Add <code>GET /submit</code>: render <code>submit.ejs</code> when <code>req.isAuthenticated()</code>, otherwise redirect to <code>/login</code>.',
    'Add <code>POST /submit</code>: redirect logged-out visitors to <code>/login</code>. Otherwise read <code>req.body.secret</code>, run <code>UPDATE users SET secret = $1 WHERE email = $2</code> with <code>[secret, req.user.email]</code>, and redirect to <code>/secrets</code>.',
    'Make <code>GET /secrets</code> async: <code>SELECT secret FROM users WHERE email = $1</code>, then render the page with <code>{ secret }</code>, or with a friendly default when the column is still <code>NULL</code>.',
    'Test it: log in as <code>ada@example.com</code> / <code>lovelace1815</code>, submit a secret, log out and back in, and it is still there. Repeat with <i>Sign In with Google</i>, then check both rows at <code>/debug/users</code>.'
  ],
  run:['index.js'],
  start:'/',
  db:{ seed: SEED_ADA },
  smoke:[
    { method:'GET', path:'/submit', expect:302 },
    { method:'POST', path:'/submit', body:{ secret:'sneaky' }, expect:302 },
    { method:'POST', path:'/login', body:{ username:'ada@example.com', password:'lovelace1815' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/submit', expect:200 },
    { method:'POST', path:'/submit', body:{ secret:'I alphabetise my spice rack.' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/logout', expect:302 },
    { method:'GET', path:'/auth/google/secrets?code=mock-auth-code', expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'POST', path:'/submit', body:{ secret:'I still use a paper diary.' }, expect:302 },
    { method:'GET', path:'/secrets', expect:200 },
    { method:'GET', path:'/debug/users', expect:200 },
  ],
  files: Object.assign({
'index.js': L7_STARTER,
'.env': ENV_274,
  }, views({ google: true, secrets: SECRETS_275_START, submit: true }), {
'queries.sql':`-- The playground creates the users table (and Ada's account) when the server starts.
${USERS_TABLE}

-- The statement this lecture adds. In pgAdmin you would run it once;
-- in this lesson index.js runs it at startup (task 1).
ALTER TABLE users ADD COLUMN secret TEXT;
`,
'package.json': pkg('secrets-finished', SESSION_DEPS.concat(['dotenv', 'passport-google-oauth2'])),
  }),
  solution:{ 'index.js': L7_SOLUTION, 'views/secrets.ejs': SECRETS_275_DONE },
  notes:`<h3>Playground notes</h3>
<ul>
  <li>Running <code>ALTER TABLE</code> at startup stands in for pgAdmin, because each ▶ Run starts from a fresh database. On your own machine, run it once in pgAdmin and leave it out of <code>index.js</code>.</li>
  <li><code>req.user</code> is a copy of the user row taken at login and kept in the session. After an UPDATE it still holds the old <code>secret</code>, which is why <code>/secrets</code> reads the value from the database instead of from <code>req.user</code>.</li>
  <li>The course's <code>POST /submit</code> has no login check, so a logged-out request crashes on <code>req.user.email</code>. This lesson adds the guard.</li>
</ul>`,
  quiz:[
    { q:'Why does <code>POST /submit</code> end with <code>res.redirect("/secrets")</code> instead of rendering the page?', options:['Rendering is not allowed after a POST','So that refreshing the page cannot resubmit the form, and /secrets loads the saved value with a fresh GET','Redirects are required by Passport','It is faster'], answer:1, why:'Post/Redirect/Get: the browser ends on a GET, so a reload is harmless and shows what was really stored.' },
    { q:'Why does <code>GET /secrets</code> query the database instead of reading <code>req.user.secret</code>?', options:['req.user cannot hold strings','req.user is a snapshot from login, so it would still show the old secret after an update','The database is faster than memory','EJS cannot read req.user'], answer:1, why:'serializeUser saved the row as it was at login. Fresh data has to come from the table.' },
    { q:'What happens if <code>POST /submit</code> skips the <code>isAuthenticated</code> check and a logged-out visitor posts to it?', options:['The secret is saved with no owner','req.user is undefined, so reading req.user.email throws and the request fails','Passport logs them in automatically','Nothing'], answer:1, why:'Without a session there is no req.user, so check first and redirect to /login.' },
    { q:'Which query stores the secret for the logged-in user only?', options:['UPDATE users SET secret = $1','INSERT INTO users (secret) VALUES ($1)','UPDATE users SET secret = $1 WHERE email = $2','SELECT secret FROM users WHERE email = $1'], answer:2, why:'The WHERE clause limits the update to one row. Without it, every user\'s secret would be overwritten.' },
  ],
});

/* =====================================================================
   276 · Tip: working as a freelancer
   ===================================================================== */
PG.add({
  id:'l276', index:276, udemyId:18113039, minutes:2, section:'s35', slug:'tip-freelancing', kind:'read',
  title:'Tip from Angela - How to Work as a Freelancer',
  blurb:'Good freelance contracts go to people with a portfolio and clients who will vouch for them. The tip is to collect both on low-budget marketplaces first, taking small jobs mainly to practise finding out what a client wants, communicating clearly and delivering it. With a year or so of finished projects and reviews, move to better-paying platforms and raise your rates.',
  quiz:[
    { q:'What is the main point of taking low-paid jobs when you start freelancing?', options:['The money','Building a portfolio, reviews and experience of working with real clients','Avoiding taxes','They are easier to code'], answer:1, why:'Early on, references and finished work count for more than the fee. They are what win the better-paid contracts later.' },
  ],
});

})();
