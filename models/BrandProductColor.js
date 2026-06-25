const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BrandProductColor = sequelize.define('BrandProductColor', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  brandProductId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'brand_product_id',
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'brand_product_colors',
  timestamps: true,
  underscored: true,

  indexes: [
    {
      fields: ['brand_product_id'],
    },
    {
      fields: ['color'],
    }
  ]
});

module.exports = BrandProductColor;