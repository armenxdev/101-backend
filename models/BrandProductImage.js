const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BrandProductImage = sequelize.define('BrandProductImage', {
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
  tableName: 'brand_product_images',
  timestamps: false,
});

module.exports = BrandProductImage;
