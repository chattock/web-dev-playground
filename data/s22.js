/* ===== Section 22 — Backend Web Development ===== */

PG.add({
  id:'l190', index:190, udemyId:12407820, minutes:15, section:'s22', slug:'backend-explained', kind:'read',
  title:'Backend Web Development Explained',
  blurb:'A full-stack developer builds both halves of a web app. The <b>front end</b> is everything the user sees and touches. The <b>back end</b> is everything they never see, in three parts: a <b>server</b> (a computer that stays on and listens for requests), an <b>application</b> (the code that decides how to answer each one) and a <b>database</b> (where data is kept between visits). A static site only hands out stored files; a web app can make decisions, such as checking a password.',
  explore:[{
    title:'Follow a login request', height:560,
    note:'Press Log in and watch the request travel through the back end and back again. Try a wrong password, an unknown email, then switch to a static site, where there is no application or database to do the checking. (Real apps never keep plain-text passwords; that comes in the authentication section.)',
    html:`
<style>
  .flow{display:flex;align-items:stretch;gap:6px;flex-wrap:wrap;margin-top:12px}
  .nd{flex:1;min-width:110px;border:2px solid #dfe3ee;border-radius:10px;padding:10px;text-align:center;background:#fff;transition:all .2s}
  .nd b{display:block;font-size:13px}
  .nd small{color:#5b6382}
  .nd.on{border-color:#5b9cff;background:#eef4ff;box-shadow:0 0 0 3px rgba(91,156,255,.25)}
  .nd.off{opacity:.3}
  .ar{align-self:center;color:#9aa3bd;font-weight:700}
  #f input{font:inherit;padding:5px 8px;border:1px solid #cfd5e6;border-radius:6px}
  #f button{font:inherit;padding:5px 12px;border:1px solid #5b9cff;background:#5b9cff;color:#fff;border-radius:6px;cursor:pointer}
  #resp{margin-top:12px;border:1px dashed #cfd5e6;border-radius:8px;padding:10px;min-height:44px}
</style>
<div class="knobs">
  <label>what answers the request
    <select id="mode">
      <option value="app">a web app: server + application + database</option>
      <option value="static">a static site: stored files only (such as GitHub Pages)</option>
    </select>
  </label>
  <span class="note" style="margin:0">saved users: ada@example.com / secret123 and grace@example.com / cobol1959</span>
</div>
<div class="stage">
  <form id="f" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <input id="em" value="ada@example.com" aria-label="email">
    <input id="pw" value="secret123" aria-label="password">
    <button>Log in</button>
  </form>
  <div class="flow">
    <div class="nd" id="n-browser"><b>🖥️ Browser</b><small>the client</small></div><div class="ar">⇄</div>
    <div class="nd" id="n-server"><b>🗄️ Server</b><small>always on, listening</small></div><div class="ar">⇄</div>
    <div class="nd" id="n-app"><b>⚙️ Application</b><small>login logic decides</small></div><div class="ar">⇄</div>
    <div class="nd" id="n-db"><b>🛢️ Database</b><small>remembers users</small></div>
  </div>
  <div id="resp"><span style="color:#5b6382">The response will appear here.</span></div>
</div>
<pre class="readout" id="log"></pre>
<script>
(function(){
  var users = [{ email: 'ada@example.com', password: 'secret123' }, { email: 'grace@example.com', password: 'cobol1959' }];
  var timers = [];
  function el(i){ return document.getElementById(i); }
  function lit(names){ ['browser', 'server', 'app', 'db'].forEach(function(n){ el('n-' + n).classList.toggle('on', names.indexOf(n) >= 0); }); }
  function setMode(){ var st = el('mode').value === 'static'; el('n-app').classList.toggle('off', st); el('n-db').classList.toggle('off', st); }
  function play(steps){
    timers.forEach(clearTimeout); timers = []; el('log').textContent = '';
    steps.forEach(function(s, i){
      timers.push(setTimeout(function(){
        lit(s[0]);
        el('log').textContent += (i + 1) + '. ' + s[1] + '\\n';
        if (s[2]) el('resp').innerHTML = s[2];
      }, i * 900));
    });
  }
  el('mode').addEventListener('change', setMode);
  el('f').addEventListener('submit', function(e){
    e.preventDefault();
    var em = el('em').value.trim(), pw = el('pw').value;
    el('resp').innerHTML = '<span style="color:#5b6382">waiting for the response…</span>';
    if (el('mode').value === 'static') {
      play([
        [['browser'], 'The browser sends the form to the host: POST /login'],
        [['server'], 'A static host can only hand out stored files exactly as they are. There is no application code to read the email and password, and no database to look them up in.'],
        [['browser'], 'The browser gets the same response whatever was typed.', '<b>405 Method Not Allowed</b>: a static site cannot log anyone in.']
      ]);
      return;
    }
    var user = users.filter(function(u){ return u.email === em; })[0];
    var ok = !!user && user.password === pw;
    play([
      [['browser'], 'The browser sends a request: POST /login with email=' + em + ' and the password.'],
      [['server'], 'The server, which is always on and listening, receives the request and passes it to the application.'],
      [['app'], 'The application runs its login logic. It needs the saved user with this email, so it asks the database.'],
      [['db'], user ? 'The database finds the user record for ' + em + ' and sends it back.' : 'The database has no user with that email.'],
      [['app'], ok ? 'The passwords match, so the application prepares the home page.' : 'No match, so the application prepares the login page again with an error message.'],
      [['server', 'browser'], ok ? 'Response 200: home.html travels back and the browser shows it.' : 'Response 401: login.html with a "wrong email or password" message.',
        ok ? '<b>200 OK</b>: 🏠 Welcome back, ' + em + '!' : '<b>401 Unauthorized</b>: ❌ Wrong email or password.']
    ]);
  });
  setMode();
})();
<\/script>`
  }],
  quiz:[
    { q:'What are the three parts of a back end?', options:['HTML, CSS and JavaScript','Server, application and database','Browser, ISP and DNS','React, Node and Express'], answer:1, why:'The server listens, the application decides what to send back, and the database keeps data that must survive after the request ends.' },
    { q:'Why can a site hosted as plain files on GitHub Pages not log users in?', options:['GitHub blocks forms','It only returns stored files: there is no application code or database on its side','Logins need HTTPS','Browsers refuse it'], answer:1, why:'Checking a password means running code against saved data, and a static host does neither.' },
    { q:'In the restaurant comparison, which part plays the database?', options:['The waiter','The menu','The pantry where the ingredients are kept','The diner'], answer:2, why:'The diner is the client, the waiter carries requests and responses, the chef is the application and the pantry stores what the chef needs.' },
    { q:'What is a status code such as 404 for?', options:['It measures the server\'s speed','It is a short code in the response telling the client how the request went','It is the server\'s port number','It is the size of the database'], answer:1, why:'200 means all is well, 404 that nothing exists at that address, 401 that the login failed, and so on.' },
  ],
});


PG.add({
  id:'l191', index:191, udemyId:37702170, minutes:6, section:'s22', slug:'backend-tools', kind:'read',
  title:'Backend Tools and Technologies - Which one to learn?',
  blurb:'The front end is fixed, because browsers only run HTML, CSS and JavaScript (frameworks such as React, Angular and Vue are JavaScript underneath). The back end can be written in almost anything, since all it has to do is send back HTML, CSS, JavaScript or data: Ruby with Rails, Java with Spring, C# with ASP.NET, PHP with Laravel, Python with Flask or Django, or JavaScript with Node.js. The course picks Node so one language covers both sides, and because it is widely used and well supported.',
  links:[
    { title:'Stack Overflow Developer Survey', url:'https://survey.stackoverflow.co/', note:'yearly figures on which languages and frameworks professionals use' },
  ],
  quiz:[
    { q:'Why is the choice of front-end language fixed?', options:['Frameworks insist on it','Browsers only understand HTML, CSS and JavaScript','It is faster','Hosting companies require it'], answer:1, why:'Whatever framework you use, the browser ends up running plain HTML, CSS and JavaScript.' },
    { q:'Django is a back-end framework for which language?', options:['Ruby','PHP','Python','Java'], answer:2, why:'Ruby has Rails, PHP has Laravel, Java has Spring, and Python has Django and Flask.' },
    { q:'Why does the course teach Node.js for the back end?', options:['It is the only back-end option','You reuse the JavaScript you already know, and it is popular with plenty of help available','It needs no server','It is the newest language'], answer:1, why:'One language for both front and back end makes the switch easier, and a large community means more packages and answers.' },
  ],
});
