const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductColor = sequelize.define('ProductColor', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'product_id',
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'product_colors',
  timestamps: true,
  underscored: true,

  indexes: [
    {
      fields: ['product_id'],
    },
    {
      fields: ['color'],
    }
  ]
});

module.exports = ProductColor;