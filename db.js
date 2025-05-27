const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // SQLite file in your project root
  logging: false
});

module.exports = sequelize;
