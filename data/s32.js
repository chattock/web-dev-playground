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
