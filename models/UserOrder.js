const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const UserOrder = sequelize.define('UserOrder', {
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
    allowNull: false,
    field: 'user_id',
  },
  printfulOrder: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'printful_order',
  },
}, {
  tableName: 'user_orders',
});

module.exports = UserOrder;
