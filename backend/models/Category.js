// models/categories.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'categories', // correspond au nom de la table MySQL existante
  timestamps: false, // dÃ©sactiver createdAt / updatedAt si ta table n'en a pas
});

module.exports = Category;
