const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const Payment = sequelize.define('Payment', {
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
  orderID: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'order_id_paypal',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'payments',
  updatedAt: false,
});

module.exports = Payment;
