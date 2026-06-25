const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const CartItem = sequelize.define('CartItem', {
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
  cartId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'cart_id',
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'product_id',
  },
  productExternalId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'product_external_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
}, {
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,

  indexes: [
    {
      unique: true,
      fields: ['public_id'],
    },
    {
      fields: ['cart_id'],
    },
    {
      fields: ['cart_id', 'product_id', 'size'],
    }
  ]
});

module.exports = CartItem;