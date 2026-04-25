// models/products.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories', // Nom de la table cible dans MySQL
      key: 'id',
    },
  },
}, {
  tableName: 'products', // correspond au nom de la table MySQL existante
  timestamps: false, // dÃ©sactiver createdAt / updatedAt si ta table n'en a pas
});

module.exports = Product;
