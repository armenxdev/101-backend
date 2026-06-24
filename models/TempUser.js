const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TempUser = sequelize.define('TempUser', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  verificationCode: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'verification_code',
  },
  codeExpire: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'code_expire',
  },
}, {
  tableName: 'temp_users',
});

module.exports = TempUser;
