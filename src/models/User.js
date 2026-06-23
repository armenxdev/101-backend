import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.sequelize.js'; 

class initUser extends Model {}

initUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
    favorites: {
      type: DataTypes.JSON, 
      defaultValue: [],
    },
    cart: {
      type: DataTypes.JSON, 
      defaultValue: [],
    },
    userOrders: {
      type: DataTypes.JSON, 
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true, 
  }
);

export default initUser;