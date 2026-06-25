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
  timestamps: true,       // Միացնում է created_at և updated_at դաշտերը (կարևոր է ժամկետները հասկանալու համար)
  underscored: true,      // Ավտոմատ դարձնում է snake_case բազայի մակարդակով

  // Ինդեքսների ավելացում արագագործության համար
  indexes: [
    {
      unique: true,
      fields: ['email'],  // Արագ փնտրում միայն էլ. փոստով
    },
    {
      fields: ['email', 'verification_code'], // Composite index՝ կոդի վավերացումը ակնթարթային դարձնելու համար
    }
  ]
});

module.exports = TempUser;