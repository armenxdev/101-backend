const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItemImage = sequelize.define('CartItemImage', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  cartItemId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'cart_item_id',
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
  tableName: 'cart_item_images',
  timestamps: false,
});

module.exports = CartItemImage;
