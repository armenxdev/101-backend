const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const Product = sequelize.define('Product', {
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
  externalId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  external_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  is_ignored: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  synced: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  thumbnail_url: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
  variants: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  printfulData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,

  indexes: [
    {
      unique: true,
      fields: ['public_id'],
    },
    {
      unique: true,
      fields: ['external_id'],
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

module.exports = Product;