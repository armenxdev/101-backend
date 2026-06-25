const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
}, {
  tableName: 'carts',
  timestamps: true,
  underscored: true,

  indexes: [
    {
      unique: true,
      fields: ['user_id'],
    }
  ]
});

module.exports = Cart;