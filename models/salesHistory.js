// models/salesHistory.js
const db = require('../db');

const SalesHistoryModel = {
  // Fetch all sales history entries with related item details
  getAllWithItems() {
    const stmt = db.prepare(`
      SELECT sh.*, i.name AS itemName, i.category, i.price
      FROM sales_history sh
      JOIN Items i ON sh.itemId = i.id
    `);
    return stmt.all();
  },

  // Insert a new sales record
  create({ itemId, date, quantitySold }) {
    const insertStmt = db.prepare(`
      INSERT INTO sales_history (itemId, date, quantitySold)
      VALUES (?, ?, ?)
    `);
    const result = insertStmt.run(itemId, date, quantitySold);
    return {
      id: result.lastInsertRowid,
      itemId,
      date,
      quantitySold
    };
  }
};

module.exports = SalesHistoryModel;
