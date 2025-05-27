// models/item.js

const db = require('../db');

const ItemModel = {
  getAll() {
    return db.prepare('SELECT * FROM Items').all();
  },

  getById(id) {
    return db.prepare('SELECT * FROM Items WHERE id = ?').get(id);
  },

  create({ name, quantity, category, price }) {
    const stmt = db.prepare(`
      INSERT INTO Items (name, quantity, category, price)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(name, quantity, category, price);
    return { id: info.lastInsertRowid, name, quantity, category, price };
  },

  update(id, { name, quantity, category, price }) {
    const stmt = db.prepare(`
      UPDATE Items SET
        name = COALESCE(?, name),
        quantity = COALESCE(?, quantity),
        category = COALESCE(?, category),
        price = COALESCE(?, price)
      WHERE id = ?
    `);
    stmt.run(name, quantity, category, price, id);
    return this.getById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM Items WHERE id = ?').run(id);
  }
};

module.exports = ItemModel;
