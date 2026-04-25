// models/orderProducts.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderProduct = sequelize.define('OrderProduct', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'order_products', // correspond au nom de la table MySQL existante
  timestamps: false, // dÃ©sactiver createdAt / updatedAt si ta table n'en a pas
});

module.exports = OrderProduct;
