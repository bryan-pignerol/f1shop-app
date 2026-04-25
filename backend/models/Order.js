// models/orders.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients', // Nom de la table cible dans MySQL
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
}, {
  tableName: 'orders', // correspond au nom de la table MySQL existante
  timestamps: false, // dÃ©sactiver createdAt / updatedAt si ta table n'en a pas
});

module.exports = Order;
