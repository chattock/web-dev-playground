/* ===== Section 32 — SQL ===== */

PG.add({
  id:'l242', index:242, udemyId:12385674, minutes:14, section:'s32', slug:'create-table-insert', kind:'sql',
  title:'SQL Commands: CREATE Table and INSERT Data',
  blurb:'CRUD starts with <b>C</b>reate. <code>CREATE TABLE</code> defines the columns and their types (plus a <code>PRIMARY KEY</code> and <code>NOT NULL</code>), then <code>INSERT INTO</code> adds rows — either a full list of values or only the named columns you have.',
  tasks:[
    'Create a <code>products</code> table with columns <code>id INT NOT NULL</code>, <code>name VARCHAR(255)</code>, <code>price MONEY</code>, and <code>PRIMARY KEY (id)</code>.',
    'Insert the first product with every value: id 1, Pen, 1.20.',
    'Insert a second product using the named-columns form: <code>INSERT INTO products (id, name) VALUES (2, \'Pencil\')</code> — price stays empty (NULL).',
    'Run <code>SELECT * FROM products</code> and check the table on the right.',
    'Try inserting a product with no id. Read the error — that is NOT NULL doing its job.'
  ],
  seed:`CREATE TABLE customers (
  id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO customers VALUES (1, 'John', 'Doe', '32 Cherry Blvd');
INSERT INTO customers VALUES (2, 'Angela', 'Yu', '12 Chocolate Lane');`,
  files:{
'query.sql':`-- A sample "customers" table already exists (see Tables on the right).
-- Peek at it:
SELECT * FROM customers;

-- TODO 1: create the products table


-- TODO 2: insert Pen (id 1, price 1.20) with all values


-- TODO 3: insert Pencil (id 2) giving only id and name


-- TODO 4: look at what you made
`},
  solution:{
'query.sql':`SELECT * FROM customers;

CREATE TABLE products (
  id INT NOT NULL,
  name VARCHAR(255),
  price MONEY,
  PRIMARY KEY (id)
);

INSERT INTO products
VALUES (1, 'Pen', 1.20);

INSERT INTO products (id, name)
VALUES (2, 'Pencil');

SELECT * FROM products;
`},
  checks:[
    { desc:'A products table exists', sql:`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'products'`, expect:1 },
    { desc:'It has two rows', sql:`SELECT COUNT(*) FROM products`, expect:2 },
    { desc:'The Pencil has no price (NULL)', sql:`SELECT price IS NULL FROM products WHERE name = 'Pencil'`, expect:true },
  ],
  quiz:[
    { q:'What does <code>PRIMARY KEY (id)</code> guarantee?', options:['id is stored first','Each row has a unique, non-empty id','id is a number','id is indexed alphabetically'], answer:1, why:'A primary key uniquely identifies each record; it cannot repeat and cannot be NULL.' },
    { q:'When do you use <code>INSERT INTO table (col1, col2) VALUES (...)</code> instead of a plain <code>VALUES</code> list?', options:['Only for text columns','When you want to give a subset of columns in your own order','Never — it is slower','When the table has a primary key'], answer:1, why:'Naming the columns lets you leave some out (they become NULL or their default) and makes the statement robust to column order.' },
    { q:'Which is a correct column definition?', options:['name: VARCHAR(255)','name VARCHAR(255)','VARCHAR(255) name','name = VARCHAR(255)'], answer:1, why:'SQL is "name then type", separated by a space — no colons (that is JavaScript object syntax).' },
  ],
});


PG.add({
  id:'l243', index:243, udemyId:12385692, minutes:3, section:'s32', slug:'select-and-where', kind:'sql',
  title:'SQL Commands: READ, SELECT, and WHERE',
  blurb:'The <b>R</b> of CRUD. <code>SELECT</code> chooses which columns come back (<code>*</code> means all of them) and <code>FROM</code> names the table. <code>WHERE</code> then keeps only the rows that pass a test such as <code>id = 1</code> or <code>first_name = \'Angela\'</code>. Reading never changes the table.',
  tasks:[
    'Run <code>SELECT * FROM products;</code> — 5 rows and 3 columns. The Pencil shows <i>NULL</i> for its price because it was inserted without one.',
    'Ask for only two columns: <code>SELECT name, price FROM products;</code> — the same 5 rows, but the id column is gone.',
    'Fetch one row: <code>SELECT * FROM products WHERE id = 1;</code> — just the Pen.',
    'Filter on text in <b>single</b> quotes: the customers whose <code>first_name</code> is <code>\'Angela\'</code> (1 row). Then try <code>"Angela"</code> in double quotes and read the error — Postgres reads double quotes as a column name.',
    'Products cheaper than 1: first try <code>WHERE price &lt; 1</code> and read the error, then write <code>WHERE price &lt; \'1.00\'</code>. You should get the Ruler and the Eraser. Postgres will not compare the <code>MONEY</code> type with a bare number, but a quoted value is converted for you. Notice that the Pencil never matches: a NULL price is not smaller than anything.',
    'Preview of a later lecture: <code>SELECT name FROM products WHERE name LIKE \'P%\';</code> returns every name that starts with P (Pen, Pencil).'
  ],
  seed:`CREATE TABLE customers (
  id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO customers VALUES (1, 'John', 'Doe', '32 Cherry Blvd');
INSERT INTO customers VALUES (2, 'Angela', 'Yu', '12 Chocolate Lane');
INSERT INTO customers VALUES (3, 'Priya', 'Shah', '7 Harbour Road');
INSERT INTO customers VALUES (4, 'Tom', 'Okafor', '19 Mill Street');
CREATE TABLE products (
  id INT NOT NULL,
  name VARCHAR(255),
  price MONEY,
  PRIMARY KEY (id)
);
INSERT INTO products VALUES (1, 'Pen', 1.20);
INSERT INTO products (id, name) VALUES (2, 'Pencil');
INSERT INTO products VALUES (3, 'Notebook', 2.50);
INSERT INTO products VALUES (4, 'Ruler', 0.90);
INSERT INTO products VALUES (5, 'Eraser', 0.50);`,
  files:{
'query.sql':`-- Two tables are ready: products and customers (see Tables on the right).
-- Run everything with the button, or select one statement and press Ctrl/Cmd+Enter.

-- TODO 1: every column of every product


-- TODO 2: only the name and price columns


-- TODO 3: only the product whose id is 1


-- TODO 4: customers whose first_name is Angela (text goes in single quotes)


-- TODO 5: products that cost less than 1.00 (MONEY needs the value in quotes)


-- TODO 6 (preview): product names that start with P, using LIKE 'P%'

`},
  solution:{
'query.sql':`SELECT * FROM products;

SELECT name, price FROM products;

SELECT * FROM products WHERE id = 1;

SELECT * FROM customers WHERE first_name = 'Angela';

SELECT * FROM products WHERE price < '1.00';

SELECT name FROM products WHERE name LIKE 'P%';
`},
  explore:[{
    title:'Columns are chosen by SELECT, rows by WHERE', height:470,
    note:'Untick columns and build a WHERE clause. Kept columns stay bold; rows that pass the test are green. The column list cuts the table vertically, WHERE cuts it horizontally — and a NULL price never passes a comparison.',
    html:`
<div class="knobs">
  <span class="tag">SELECT</span>
  <label><input type="checkbox" class="col" value="id" checked> id</label>
  <label><input type="checkbox" class="col" value="name" checked> name</label>
  <label><input type="checkbox" class="col" value="price" checked> price</label>
  <span class="tag">WHERE</span>
  <select id="wc"><option value="">(no WHERE)</option><option>id</option><option>name</option><option>price</option></select>
  <select id="wo"><option>=</option><option>&gt;</option><option>&lt;</option><option>LIKE</option></select>
  <input type="text" id="wv" value="1" size="9">
</div>
<pre class="readout" id="sql"></pre>
<div class="stage"><table class="grid" id="t"></table></div>
<p class="note" id="msg"></p>
<style>
  td.off, th.off { color: #c9cedb; background: #fafbfd; font-weight: 400; }
  tr.hit td { background: #e6f7ee; font-weight: 600; }
  tr.hit td.off { background: #f1f8f4; }
  tr.miss td { color: #c9cedb; }
</style>
<script>
  var rows = [
    { id: 1, name: 'Pen', price: 1.20 },
    { id: 2, name: 'Pencil', price: null },
    { id: 3, name: 'Notebook', price: 2.50 },
    { id: 4, name: 'Ruler', price: 0.90 },
    { id: 5, name: 'Eraser', price: 0.50 }
  ];
  var cols = ['id', 'name', 'price'];
  function like(s, p) {
    var memo = {};
    function m(i, j) {
      var k = i + ',' + j;
      if (k in memo) return memo[k];
      var r;
      if (j === p.length) r = i === s.length;
      else if (p[j] === '%') r = m(i, j + 1) || (i < s.length && m(i + 1, j));
      else r = i < s.length && (p[j] === '_' || p[j] === s[i]) && m(i + 1, j + 1);
      memo[k] = r;
      return r;
    }
    return m(0, 0);
  }
  function test(row, c, o, v) {
    var x = row[c];
    if (x === null) return false;
    if (o === 'LIKE') return c === 'name' && like(x, v);
    if (c === 'name') return o === '=' ? x === v : o === '>' ? x > v : x < v;
    var n = parseFloat(v);
    if (isNaN(n)) return false;
    return o === '=' ? x === n : o === '>' ? x > n : x < n;
  }
  function show(c, x) { return x === null ? 'NULL' : c === 'price' ? '$' + x.toFixed(2) : String(x); }
  function render() {
    var picked = [].slice.call(document.querySelectorAll('.col')).filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
    var wc = document.getElementById('wc').value, wo = document.getElementById('wo').value, wv = document.getElementById('wv').value;
    var lit = (wc === 'id' && wo !== 'LIKE') ? wv : "'" + wv + "'";
    document.getElementById('sql').textContent = 'SELECT ' + (picked.length === 3 ? '*' : (picked.join(', ') || '???')) + ' FROM products' + (wc ? ' WHERE ' + wc + ' ' + wo + ' ' + lit : '') + ';';
    var html = '<tr>' + cols.map(function (c) { return '<th class="' + (picked.indexOf(c) < 0 ? 'off' : '') + '">' + c + '</th>'; }).join('') + '</tr>';
    var n = 0;
    rows.forEach(function (r) {
      var hit = !wc || test(r, wc, wo, wv);
      if (hit) n++;
      html += '<tr class="' + (hit ? 'hit' : 'miss') + '">' + cols.map(function (c) { return '<td class="' + (picked.indexOf(c) < 0 ? 'off' : '') + '">' + show(c, r[c]) + '</td>'; }).join('') + '</tr>';
    });
    document.getElementById('t').innerHTML = html;
    var msg = 'Result: ' + n + ' row' + (n === 1 ? '' : 's') + ' x ' + picked.length + ' column' + (picked.length === 1 ? '' : 's') + '.';
    if (!picked.length) msg = 'A SELECT needs at least one column (or * for all of them).';
    if (wo === 'LIKE' && wc && wc !== 'name') msg += ' LIKE compares text, so use it on the name column.';
    if (wc === 'price') msg += ' (In real Postgres the price is MONEY, so the value goes in quotes, as shown.)';
    document.getElementById('msg').textContent = msg;
  }
  document.querySelectorAll('input, select').forEach(function (el) { el.addEventListener('input', render); el.addEventListener('change', render); });
  render();
<\/script>`
  }],
  quiz:[
    { q:'In <code>SELECT * FROM products</code>, what does <code>*</code> stand for?', options:['Every row','Every column','The first row','The primary key'], answer:1, why:'The asterisk picks all columns. Which rows come back is decided by WHERE — with no WHERE you get them all.' },
    { q:'Which part of a query decides which <b>rows</b> come back?', options:['The column list after SELECT','FROM','WHERE','The semicolon'], answer:2, why:'SELECT chooses columns, FROM chooses the table, WHERE filters the rows.' },
    { q:'Which condition is written correctly?', options:['WHERE name == \'Pen\'','WHERE name = "Pen"','WHERE name = \'Pen\'','WHERE name: \'Pen\''], answer:2, why:'SQL compares with a single = and puts text in single quotes. Double quotes would mean a column called Pen.' },
    { q:'The Pencil\'s price is NULL. Does <code>WHERE price &lt; \'1.00\'</code> return it?', options:['Yes, NULL counts as 0','No, a comparison with NULL is never true','Only if you add ORDER BY','It throws an error'], answer:1, why:'NULL means unknown, so NULL &lt; 1 is not true. To find missing values you write WHERE price IS NULL.' },
  ],
});


PG.add({
  id:'l244', index:244, udemyId:12385714, minutes:5, section:'s32', slug:'update-and-alter-table', kind:'sql',
  title:'Updating Single Values and Adding Columns in SQL',
  blurb:'The <b>U</b> of CRUD. <code>UPDATE table SET column = value WHERE condition</code> changes existing rows — and without the WHERE it changes <b>every</b> row. <code>ALTER TABLE products ADD stock INT</code> changes the table itself by adding a column; the rows that already exist get NULL there until you fill it in.',
  tasks:[
    'The Pencil was inserted without a price. Give it one: <code>UPDATE products SET price = 0.80 WHERE id = 2;</code> then <code>SELECT * FROM products;</code>.',
    'Add a column: <code>ALTER TABLE products ADD stock INT;</code> — select again and both rows show NULL stock.',
    'Fill the new column with one UPDATE per row: 32 pens (id 1) and 12 pencils (id 2).',
    'Select again: no NULLs anywhere. Press <b>Check my work</b>.',
    'Open the Explore tab and run an UPDATE with the WHERE switched off, to see the damage it would do here.'
  ],
  seed:`CREATE TABLE customers (
  id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO customers VALUES (1, 'John', 'Doe', '32 Cherry Blvd');
INSERT INTO customers VALUES (2, 'Angela', 'Yu', '12 Chocolate Lane');
CREATE TABLE products (
  id INT NOT NULL,
  name VARCHAR(255),
  price MONEY,
  PRIMARY KEY (id)
);
INSERT INTO products VALUES (1, 'Pen', 1.20);
INSERT INTO products (id, name) VALUES (2, 'Pencil');`,
  files:{
'query.sql':`-- products holds the Pen (id 1, 1.20) and the Pencil (id 2, no price yet).
-- Made a mess? "Reset database" rebuilds both tables from scratch.
SELECT * FROM products;

-- TODO 1: give the Pencil a price of 0.80 (UPDATE ... SET ... WHERE ...)


-- TODO 2: add a stock column of type INT to products (ALTER TABLE ... ADD ...)


-- TODO 3: 32 pens and 12 pencils in stock (one UPDATE for each)


-- TODO 4: look at the table again — there should be no NULLs left

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already ran part of this.
UPDATE products SET price = 0.80 WHERE id = 2;

ALTER TABLE products ADD stock INT;

UPDATE products SET stock = 32 WHERE id = 1;
UPDATE products SET stock = 12 WHERE id = 2;

SELECT * FROM products;
`},
  checks:[
    { desc:'The Pencil costs 0.80', sql:`SELECT price = 0.80::money FROM products WHERE id = 2`, expect:true },
    { desc:'The Pen still costs 1.20 (your UPDATE had a WHERE)', sql:`SELECT price = 1.20::money FROM products WHERE id = 1`, expect:true },
    { desc:'products has a stock column', sql:`SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock'`, expect:1 },
    { desc:'32 pens in stock', sql:`SELECT stock FROM products WHERE id = 1`, expect:32 },
    { desc:'12 pencils in stock', sql:`SELECT stock FROM products WHERE id = 2`, expect:12 },
    { desc:'No NULLs left in products', sql:`SELECT COUNT(*) FROM products WHERE price IS NULL OR stock IS NULL`, expect:0 },
  ],
  explore:[{
    title:'What does this UPDATE touch?', height:440,
    note:'Rows the statement would change are outlined before you run it. Switch the WHERE off and every row is outlined — run it to see why you always check the WHERE first. "Reset table" puts the data back (a real database has no such button).',
    html:`
<div class="knobs">
  <span class="tag">UPDATE products SET</span>
  <select id="col"><option>price</option><option>stock</option></select>
  <span>=</span>
  <input type="text" id="val" value="0.80" size="6">
  <label><input type="checkbox" id="useWhere" checked> WHERE id =</label>
  <input type="number" id="wid" value="2" min="1" max="5" style="width:58px">
  <button id="go">Run UPDATE</button>
  <button id="undo">Reset table</button>
</div>
<pre class="readout" id="sql"></pre>
<div class="stage"><table class="grid" id="t"></table></div>
<p class="note" id="msg"></p>
<style>
  tr.target td { outline: 2px dashed #5b9cff; outline-offset: -2px; }
  td.changed { background: #fff3cd; font-weight: 600; }
</style>
<script>
  var start = [
    { id: 1, name: 'Pen', price: '1.20', stock: '32' },
    { id: 2, name: 'Pencil', price: null, stock: null },
    { id: 3, name: 'Notebook', price: '2.50', stock: '15' },
    { id: 4, name: 'Ruler', price: '0.90', stock: '40' },
    { id: 5, name: 'Eraser', price: '0.50', stock: '60' }
  ];
  var rows, changed = {};
  function reset() { rows = start.map(function (r) { return { id: r.id, name: r.name, price: r.price, stock: r.stock }; }); changed = {}; }
  function el(id) { return document.getElementById(id); }
  function targets() {
    var w = el('useWhere').checked, id = Number(el('wid').value);
    return rows.filter(function (r) { return !w || r.id === id; });
  }
  function show(c, v) { return v === null ? 'NULL' : c === 'price' ? '$' + Number(v).toFixed(2) : v; }
  function render(msg) {
    var col = el('col').value, w = el('useWhere').checked;
    el('wid').disabled = !w;
    el('sql').textContent = 'UPDATE products SET ' + col + ' = ' + el('val').value + (w ? ' WHERE id = ' + el('wid').value : '') + ';';
    var t = targets();
    var html = '<tr><th>id</th><th>name</th><th>price</th><th>stock</th></tr>';
    rows.forEach(function (r) {
      html += '<tr class="' + (t.indexOf(r) >= 0 ? 'target' : '') + '">' + ['id', 'name', 'price', 'stock'].map(function (c) {
        return '<td class="' + (changed[r.id + c] ? 'changed' : '') + '">' + show(c, r[c]) + '</td>';
      }).join('') + '</tr>';
    });
    el('t').innerHTML = html;
    el('msg').textContent = msg || ('This statement would change ' + t.length + ' of ' + rows.length + ' rows.' + (w ? '' : ' No WHERE means all of them.'));
  }
  el('go').onclick = function () {
    var col = el('col').value, v = el('val').value, t = targets();
    changed = {};
    t.forEach(function (r) { r[col] = v; changed[r.id + col] = true; });
    render('UPDATE ' + t.length + ' — Postgres reports how many rows it changed.' + (t.length === rows.length ? ' Every product now has the same ' + col + '.' : ''));
  };
  el('undo').onclick = function () { reset(); render(); };
  ['col', 'val', 'useWhere', 'wid'].forEach(function (id) { el(id).addEventListener('input', function () { render(); }); el(id).addEventListener('change', function () { render(); }); });
  reset(); render();
<\/script>`
  }],
  quiz:[
    { q:'What does <code>UPDATE products SET price = 0.80;</code> (no WHERE) do?', options:['Nothing — WHERE is required','Updates only the first row','Sets the price of every product to 0.80','Asks for confirmation'], answer:2, why:'WHERE is optional. Leave it out and the change applies to every row in the table.' },
    { q:'After <code>ALTER TABLE products ADD stock INT;</code>, what is in the stock column of the rows that were already there?', options:['0','NULL','An empty string','The row\'s id'], answer:1, why:'A new column has no data for existing rows, so they hold NULL until an UPDATE fills them.' },
    { q:'Why target the Pencil with <code>WHERE id = 2</code> rather than <code>WHERE name = \'Pencil\'</code>?', options:['Numbers are faster to type','id is the primary key, so it matches exactly one row; names can repeat','Text cannot be used in WHERE','UPDATE only accepts numbers'], answer:1, why:'The primary key is unique. Two products could share a name, and the name version would change both.' },
    { q:'Which statement changes the <b>structure</b> of a table rather than its data?', options:['UPDATE','INSERT','ALTER TABLE','SELECT'], answer:2, why:'ALTER TABLE adds, removes or changes columns. UPDATE and INSERT work on rows.' },
  ],
});


PG.add({
  id:'l245', index:245, udemyId:12385718, minutes:2, section:'s32', slug:'delete', kind:'sql',
  title:'SQL Commands: DELETE',
  blurb:'The <b>D</b> of CRUD: <code>DELETE FROM table WHERE condition</code> removes the rows that match. Match on the primary key so exactly one row goes. Without a WHERE it empties the whole table — the table and its columns stay, the data does not.',
  tasks:[
    'Delete the Pencil, matching on its primary key: <code>DELETE FROM products WHERE id = 2;</code>',
    'Run <code>SELECT * FROM products;</code> — only the Pen is left.',
    '<code>discontinued</code> is a throwaway table. Run <code>DELETE FROM discontinued;</code> with <b>no</b> WHERE, then select from it: the column headers are still there, but 0 rows.',
    'Press <b>Check my work</b>.',
    'Think before the quiz: if two products were both called Pen, what would <code>DELETE FROM products WHERE name = \'Pen\'</code> remove?'
  ],
  seed:`CREATE TABLE customers (
  id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO customers VALUES (1, 'John', 'Doe', '32 Cherry Blvd');
INSERT INTO customers VALUES (2, 'Angela', 'Yu', '12 Chocolate Lane');
CREATE TABLE products (
  id INT NOT NULL,
  name VARCHAR(255),
  price MONEY,
  stock INT,
  PRIMARY KEY (id)
);
INSERT INTO products VALUES (1, 'Pen', 1.20, 32);
INSERT INTO products VALUES (2, 'Pencil', 0.80, 12);
CREATE TABLE discontinued (
  id INT NOT NULL,
  name VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO discontinued VALUES (1, 'Fountain pen'), (2, 'Blotting paper'), (3, 'Ink well');`,
  files:{
'query.sql':`SELECT * FROM products;

-- TODO 1: delete the Pencil, matching on its primary key


-- TODO 2: check that only the Pen is left


-- "discontinued" is a throwaway table you are allowed to wreck.
SELECT * FROM discontinued;

-- TODO 3: delete from discontinued with NO WHERE clause, then select from it again

`},
  solution:{
'query.sql':`DELETE FROM products WHERE id = 2;

SELECT * FROM products;

DELETE FROM discontinued;

SELECT * FROM discontinued;
`},
  checks:[
    { desc:'The Pencil is gone', sql:`SELECT COUNT(*) FROM products WHERE id = 2`, expect:0 },
    { desc:'The Pen is still there', sql:`SELECT COUNT(*) FROM products WHERE id = 1`, expect:1 },
    { desc:'discontinued has no rows left', sql:`SELECT COUNT(*) FROM discontinued`, expect:0 },
    { desc:'…but the discontinued table itself still exists', sql:`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'discontinued'`, expect:1 },
  ],
  quiz:[
    { q:'What does <code>DELETE FROM products;</code> do?', options:['Deletes the products table','Removes every row but keeps the table and its columns','Removes the first row','Fails without a WHERE'], answer:1, why:'DELETE works on rows. With no WHERE every row matches, so the table ends up empty but still defined.' },
    { q:'Two products are called Pen. What does <code>DELETE FROM products WHERE name = \'Pen\'</code> remove?', options:['The first Pen only','Both Pens','Neither — names must be unique','An error is raised'], answer:1, why:'DELETE removes every row that matches. That is why you delete by the primary key when you mean one row.' },
    { q:'Which command removes the table itself, not just its rows?', options:['DELETE TABLE products','REMOVE products','DROP TABLE products','TRUNCATE products WHERE id = 1'], answer:2, why:'DROP TABLE deletes the table definition and all its data. It comes up again in the Postgres section.' },
  ],
});


PG.add({
  id:'l246', index:246, udemyId:12385724, minutes:11, section:'s32', slug:'foreign-keys-and-joins', kind:'sql',
  title:'Understanding SQL Relationships, Foreign Keys and Inner Joins',
  blurb:'Related data lives in separate tables. An <code>orders</code> row does not copy the customer\'s name and address — it stores <code>customer_id</code> and <code>product_id</code>, <b>foreign keys</b> that hold the primary key of a row in another table. <code>INNER JOIN ... ON orders.customer_id = customers.id</code> stitches the matching rows back together into one result.',
  tasks:[
    'The Pencil was deleted last lecture. Put it back with the all-values form: <code>INSERT INTO products VALUES (2, \'Pencil\', 0.80, 12);</code>',
    'Create <code>orders</code> with <code>id INT NOT NULL</code>, <code>order_number INT</code>, <code>customer_id INT</code>, <code>product_id INT</code>, <code>PRIMARY KEY (id)</code>, and two foreign keys: <code>FOREIGN KEY (customer_id) REFERENCES customers (id)</code> and <code>FOREIGN KEY (product_id) REFERENCES products (id)</code>.',
    'Insert order 1: <code>(1, 4362, 2, 1)</code> — order number 4362, customer 2, product 1. Add order 2: <code>(2, 4363, 1, 2)</code>.',
    'Join orders with customers: select <code>orders.order_number</code>, <code>customers.first_name</code>, <code>customers.last_name</code>, <code>customers.address</code>, <code>FROM orders INNER JOIN customers ON orders.customer_id = customers.id</code>. Each row now says who ordered and where to send it.',
    'Challenge: join orders with <b>products</b> instead, showing the order number with the product\'s name, price and stock.',
    'Try an order for customer 99, who does not exist. Postgres refuses it — the foreign key protects you (the SQLite playground in the video would have accepted it).',
    'Bonus: chain two <code>INNER JOIN</code>s to show order number, customer first name and product name in one result. Then press <b>Check my work</b>.'
  ],
  seed:`CREATE TABLE customers (
  id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  address VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO customers VALUES (1, 'John', 'Doe', '32 Cherry Blvd');
INSERT INTO customers VALUES (2, 'Angela', 'Yu', '12 Chocolate Lane');
CREATE TABLE products (
  id INT NOT NULL,
  name VARCHAR(255),
  price MONEY,
  stock INT,
  PRIMARY KEY (id)
);
INSERT INTO products VALUES (1, 'Pen', 1.20, 32);`,
  files:{
'query.sql':`-- Where we left off: the Pencil was deleted in the last lecture.
SELECT * FROM products;

-- TODO 1: put the Pencil back: id 2, 'Pencil', 0.80, 12 (all-values form)


-- TODO 2: create the orders table
--   id INT NOT NULL, order_number INT, customer_id INT, product_id INT,
--   PRIMARY KEY (id),
--   FOREIGN KEY (customer_id) REFERENCES customers (id),
--   FOREIGN KEY (product_id) REFERENCES products (id)


-- TODO 3: order 1 = order number 4362, customer 2, product 1
--         order 2 = order number 4363, customer 1, product 2


-- TODO 4: INNER JOIN orders with customers
--         order_number, first_name, last_name, address


-- TODO 5 (challenge): INNER JOIN orders with products
--         order_number, name, price, stock

`},
  solution:{
'query.sql':`-- Press "Reset database" first if you already created orders.
INSERT INTO products VALUES (2, 'Pencil', 0.80, 12);

CREATE TABLE orders (
  id INT NOT NULL,
  order_number INT,
  customer_id INT,
  product_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (customer_id) REFERENCES customers (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

INSERT INTO orders VALUES (1, 4362, 2, 1);
INSERT INTO orders VALUES (2, 4363, 1, 2);

SELECT orders.order_number, customers.first_name, customers.last_name, customers.address
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

SELECT orders.order_number, products.name, products.price, products.stock
FROM orders
INNER JOIN products ON orders.product_id = products.id;

-- Bonus: three tables in one result
SELECT orders.order_number, customers.first_name, products.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
INNER JOIN products ON orders.product_id = products.id;
`},
  checks:[
    { desc:'The Pencil is back in products', sql:`SELECT COUNT(*) FROM products WHERE id = 2`, expect:1 },
    { desc:'orders.customer_id is a foreign key', sql:`SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'orders' AND tc.constraint_type = 'FOREIGN KEY' AND k.column_name = 'customer_id'`, expect:1 },
    { desc:'orders.product_id is a foreign key', sql:`SELECT COUNT(*) FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_name = tc.table_name WHERE tc.table_name = 'orders' AND tc.constraint_type = 'FOREIGN KEY' AND k.column_name = 'product_id'`, expect:1 },
    { desc:'Order 4362 joins to Angela', sql:`SELECT customers.first_name FROM orders INNER JOIN customers ON orders.customer_id = customers.id WHERE orders.order_number = 4362`, expect:'Angela' },
    { desc:'Order 4362 joins to the Pen', sql:`SELECT products.name FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.order_number = 4362`, expect:'Pen' },
  ],
  explore:[{
    title:'Follow the foreign keys', height:560,
    note:'Click an order. Its <code>customer_id</code> and <code>product_id</code> point at one row in each of the other tables — the ON condition simply says "these two numbers must be equal". The joined result at the bottom has one row per order.',
    html:`
<div class="wrap3">
  <div><h4>orders</h4><table class="grid pick" id="o"></table></div>
  <div><h4>customers</h4><table class="grid" id="c"></table></div>
  <div><h4>products</h4><table class="grid" id="p"></table></div>
</div>
<pre class="readout" id="ro"></pre>
<h4>orders INNER JOIN customers INNER JOIN products</h4>
<div class="stage" style="padding:10px"><table class="grid" id="j"></table></div>
<style>
  .wrap3 { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
  .pick tr:not(:first-child) { cursor: pointer; }
  .pick tr:not(:first-child):hover td { background: #f0f5ff; }
  tr.sel td { background: #dbe8ff !important; font-weight: 600; }
  tr.match td { background: #e6f7ee; font-weight: 600; }
  td.key { outline: 2px solid #5b9cff; outline-offset: -2px; }
</style>
<script>
  var customers = [[1, 'John', 'Doe', '32 Cherry Blvd'], [2, 'Angela', 'Yu', '12 Chocolate Lane'], [3, 'Priya', 'Shah', '7 Harbour Road']];
  var products = [[1, 'Pen', '$1.20', 32], [2, 'Pencil', '$0.80', 12], [3, 'Notebook', '$2.50', 15]];
  var orders = [[1, 4362, 2, 1], [2, 4363, 1, 2], [3, 4364, 2, 3], [4, 4365, 3, 1]];
  var sel = 0;
  function tbl(head, rows, rowClass, keyCol) {
    return '<tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' + rows.map(function (r, i) {
      return '<tr data-i="' + i + '" class="' + rowClass(r, i) + '">' + r.map(function (v, k) { return '<td class="' + (keyCol(r, i, k) ? 'key' : '') + '">' + v + '</td>'; }).join('') + '</tr>';
    }).join('');
  }
  function render() {
    var o = orders[sel];
    document.getElementById('o').innerHTML = tbl(['id', 'order_number', 'customer_id', 'product_id'], orders, function (r, i) { return i === sel ? 'sel' : ''; }, function (r, i, k) { return i === sel && (k === 2 || k === 3); });
    document.getElementById('c').innerHTML = tbl(['id', 'first_name', 'last_name', 'address'], customers, function (r) { return r[0] === o[2] ? 'match' : ''; }, function (r, i, k) { return r[0] === o[2] && k === 0; });
    document.getElementById('p').innerHTML = tbl(['id', 'name', 'price', 'stock'], products, function (r) { return r[0] === o[3] ? 'match' : ''; }, function (r, i, k) { return r[0] === o[3] && k === 0; });
    var c = customers.filter(function (r) { return r[0] === o[2]; })[0], p = products.filter(function (r) { return r[0] === o[3]; })[0];
    document.getElementById('ro').textContent = 'order ' + o[1] + ':  orders.customer_id = ' + o[2] + '  =  customers.id ' + c[0] + '  (' + c[1] + ' ' + c[2] + ')' + String.fromCharCode(10) + '              orders.product_id  = ' + o[3] + '  =  products.id  ' + p[0] + '  (' + p[1] + ')';
    var joined = orders.map(function (r) {
      var cc = customers.filter(function (x) { return x[0] === r[2]; })[0], pp = products.filter(function (x) { return x[0] === r[3]; })[0];
      return [r[1], cc[1], cc[2], cc[3], pp[1], pp[2]];
    });
    document.getElementById('j').innerHTML = tbl(['order_number', 'first_name', 'last_name', 'address', 'name', 'price'], joined, function (r, i) { return i === sel ? 'sel' : ''; }, function () { return false; });
    document.querySelectorAll('#o tr[data-i]').forEach(function (tr) { tr.onclick = function () { sel = Number(tr.getAttribute('data-i')); render(); }; });
  }
  render();
<\/script>`
  }],
  quiz:[
    { q:'What is a foreign key?', options:['A key imported from another database','A column that holds the primary key of a row in another table','A second primary key','An encrypted id'], answer:1, why:'orders.customer_id stores a customers.id value. That link is what makes the tables related.' },
    { q:'What does an INNER JOIN return?', options:['Every row from both tables','Only rows where the ON condition finds a match in both tables','Only the first table\'s rows','The tables stacked on top of each other'], answer:1, why:'INNER JOIN keeps a combined row only when the foreign key matches a primary key on the other side.' },
    { q:'Why write <code>customers.id</code> instead of just <code>id</code> in the ON clause?', options:['It runs faster','Both tables have an id column, so the table name says which one you mean','SQL requires dots everywhere','It creates an index'], answer:1, why:'Without the table prefix, id would be ambiguous between orders and customers.' },
    { q:'After running a JOIN, what has changed in the stored tables?', options:['orders now contains the customer columns','A new joined table was saved','Nothing — the join only builds a temporary result','The foreign keys were removed'], answer:2, why:'A SELECT with JOIN reads and combines rows for its result; the tables on disk stay exactly as they were.' },
  ],
});


PG.add({
  id:'l247', index:247, udemyId:17967528, minutes:2, section:'s32', slug:'tip-hard-working-people', kind:'read',
  title:'Tip from Angela - Find All the Hard Working People',
  blurb:'A study tip, not a coding lecture: effort is contagious. Working where other people are focused — a library, a study partner, any quiet shared space — makes it easier to start the tasks you would otherwise put off. Save that setting for your hardest work and go regularly.',
});
