const sequelize = require('../config/db');

const Client = require('./Client');
const Order = require('./Order');
const Product = require('./Product');
const Category = require('./Category');
const Purchase = require('./Purchase');
const OrderProduct = require('./OrderProduct');

Client.hasMany(Order, { foreignKey: 'client_id' });
Order.belongsTo(Client, { foreignKey: 'client_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(Purchase, { foreignKey: 'product_id' });
Purchase.belongsTo(Product, { foreignKey: 'product_id' });

Order.belongsToMany(Product, { 
  through: OrderProduct, 
  foreignKey: 'order_id', 
  otherKey: 'product_id' 
});
Product.belongsToMany(Order, { 
  through: OrderProduct, 
  foreignKey: 'product_id', 
  otherKey: 'order_id' 
});

Order.hasMany(OrderProduct, { foreignKey: 'order_id' });
OrderProduct.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(OrderProduct, { foreignKey: 'product_id' });
OrderProduct.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  Client,
  Order,
  Product,
  Category,
  Purchase,
  OrderProduct
};
