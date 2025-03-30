import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import process from 'process';
import logger from '../utils/logger.js';

dotenv.config(); // Load environment variables from .env file

// Load database configuration from environment variables
const DB_HOST =
  process.env.DB_HOST ||
  (process.env.DOCKER_ENV === 'true' ? 'mysql' : '127.0.0.1');
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'reservation';

// Ensure the database exists (skip during tests)
async function ensureDatabaseExists() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Skipping database initialization in test environment.');
    return;
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  logger.info(`Database "${DB_NAME}" ensured.`);
  await connection.end();
}

// Call the function to ensure the database exists
ensureDatabaseExists()
  .then(() => {
    logger.info('Database initialization completed successfully.');
  })
  .catch((error) => {
    logger.error('Error ensuring database exists:', error);
  });

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: (msg) => logger.debug(`[Sequelize Log]: ${msg}`),
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
