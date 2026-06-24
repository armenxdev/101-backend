const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
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
  url: {
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  cloudinaryPublicId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cloudinary_public_id',
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
  },
}, {
  tableName: 'product_images',
  timestamps: false,
});

module.exports = ProductImage;
