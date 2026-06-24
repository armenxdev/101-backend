const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || '101_eCommerce_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'ArmenMySQL2026',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
