const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const BrandProduct = sequelize.define('BrandProduct', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  isNewProducts: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'sort_order',
  },
}, {
  tableName: 'brand_products',
  timestamps: true,
  underscored: true,


  indexes: [
    {
      unique: true,
      fields: ['public_id'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['visible', 'sort_order'],
    },
    {
      fields: ['is_popular'],
    },
    {
      fields: ['is_new_products'],
    }
  ]
});

module.exports = BrandProduct;