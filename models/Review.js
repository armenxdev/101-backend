const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const generatePublicId = require('../utils/generatePublicId');

const Review = sequelize.define('Review', {
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
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'product_id',
  },
  productExternalId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'product_external_id',
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'user_id',
  },
  userPublicId: {
    type: DataTypes.STRING(24),
    allowNull: true,
    field: 'user_public_id',
  },
  guestId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'guest_id',
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Anonymous',
  },
  rating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewDate: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'review_date',
  },
}, {
  tableName: 'reviews',
  timestamps: true,

  indexes: [
    {
      fields: ['product_id'],
    },
    {
      fields: ['product_external_id'],
    },
    {
      fields: ['user_id'],
    }
  ]
});

module.exports = Review;