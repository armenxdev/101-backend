const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItemImage = sequelize.define('OrderItemImage', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  orderItemId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'order_item_id',
  },
  url: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
  },
}, {
  tableName: 'order_item_images',
  timestamps: false,
});

module.exports = OrderItemImage;
