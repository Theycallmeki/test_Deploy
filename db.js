const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    category TEXT,
    price REAL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS SalesHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itemId INTEGER NOT NULL,
    date TEXT NOT NULL,
    quantitySold INTEGER NOT NULL,
    FOREIGN KEY (itemId) REFERENCES Items(id)
  )
`).run();

module.exports = db;
