const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  publicId: {
    type: DataTypes.STRING(24),
    allowNull: false,
    unique: true,
    defaultValue: () => generatePublicId(),
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'user_id',
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price',
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'orders',
});

module.exports = Order;
