const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const serverless = require('serverless-http');
const sequelize = require('../db');            // Adjusted path since inside api folder
const Item = require('../models/item');
const SalesHistory = require('../models/salesHistory');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sync DB (be aware this runs on every cold start in serverless)
sequelize.sync().then(() => {
  console.log('✅ Database synced.');
});

// Serve your static HTML files by full path since no "public" folder serving automatically
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

app.get('/item', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'item.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
});

app.get('/sales-history', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'salesHistory.html'));
});

app.get('/prediction', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'prediction.html'));
});

// API endpoints (note: they will be prefixed by /api since this is api/index.js)
app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  const { name, quantity, category, price } = req.body;
  try {
    const item = await Item.create({ name, quantity, category, price });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity } = req.body;
  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.name = name || item.name;
    item.category = category || item.category;
    if (price !== undefined) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/sales-history', async (req, res) => {
  try {
    const sales = await SalesHistory.findAll({
      include: [{ model: Item }]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sales-history', async (req, res) => {
  const { itemId, date, quantitySold } = req.body;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.quantity < quantitySold) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const sale = await SalesHistory.create({ itemId, date, quantitySold });

    item.quantity -= quantitySold;
    await item.save();

    res.status(201).json({ sale, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel serverless deployment
module.exports = app;
module.exports.handler = serverless(app);

// Local server for development/testing
if (require.main === module) {
  const PORT = process.env.PORT || 3005;
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
}
