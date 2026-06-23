'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordExpire: {
      type: Sequelize.DATE,
      allowNull: true
    },
    emailVerificationToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    emailVerificationExpire: {
      type: Sequelize.DATE,
      allowNull: true
    },
    favorites: {
      type: Sequelize.JSON,
      defaultValue: '[]',
      allowNull: false
    },
    cart: {
      type: Sequelize.JSON,
      defaultValue: '[]',
      allowNull: false
    },
    userOrders: {
      type: Sequelize.JSON,
      defaultValue: '[]',
      allowNull: false
    },
    loginAttempts: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    lockUntil: {
      type: Sequelize.DATE,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('Users', ['email']);
  await queryInterface.addIndex('Users', ['username']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}