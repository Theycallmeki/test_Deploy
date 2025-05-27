const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // optional: turn off logging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // needed for some cloud providers
    }
  }
});

module.exports = sequelize;
