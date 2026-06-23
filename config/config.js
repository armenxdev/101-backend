import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ստեղծում ենք սերտիֆիկատի ճիշտ ճանապարհը
const caPath = path.resolve(__dirname, '../src/certificates/ca.pem');

const getSSLOption = () => {
  if (process.env.DB_SSL === 'true' && fs.existsSync(caPath)) {
    return {
      ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
      }
    };
  }
  return {};
};

const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: getSSLOption(),
    logging: console.log
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined,
        rejectUnauthorized: true 
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

export default config;