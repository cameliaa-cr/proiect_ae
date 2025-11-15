const { sequelize } = require("../server");
const { DataTypes } = require("sequelize");

const OrderProduct = sequelize.define("OrderProduct", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: "Quantity must be at least 1"
      },
      isInt: {
        msg: "Quantity must be a number"
      }
    }
  }

}, {
  tableName: "order_products",
  timestamps: false
});

module.exports = OrderProduct;
