const User = require('./User');
const Product = require('./Product');

const Order = require('./Order');
const OrderProduct = require('./OrderProduct');


// Associations

// User -> Orders
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Orders <-> Products
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: "orderId",
  otherKey: "productId",
});

Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "productId",
  otherKey: "orderId",
});

//
module.exports = {
  User,
  Product,
  Order,
  OrderProduct
};
