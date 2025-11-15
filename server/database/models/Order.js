const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("CONFIRMED", "CANCELED", "DELIVERED"),
    allowNull: false,
    defaultValue: "CONFIRMED"
  }

}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = Order;