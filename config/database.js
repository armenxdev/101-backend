const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const caPath = path.join(__dirname, '../certificates/ca.pem');

const {
    DB_HOST,
    DB_NAME,
    DB_PASS,
    DB_USER,
    DB_PORT
} = process.env;

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(caPath),
                rejectUnauthorized: false
            }
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        // console.log('MySQL connected via Sequelize');
        // await sequelize.sync({ force: true });
        console.log('Database synchronized');
    } catch (err) {
        console.error('MySQL connection error:', err.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };