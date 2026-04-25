const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('f1shop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
