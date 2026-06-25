const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: 'user_id',
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: 'product_id',
  },
}, {
  tableName: 'favorites',
  timestamps: true,
  underscored: true,


  indexes: [
    {
      fields: ['product_id'],
    }
  ]
});

module.exports = Favorite;