import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Determine the database host
// Use `host.docker.internal` if running in a container, otherwise fallback to `127.0.0.1`
const DB_HOST = process.env.DB_HOST && process.env.DB_HOST.trim() !== '' 
    ? process.env.DB_HOST 
    : (process.env.DOCKER_ENV ? 'host.docker.internal' : '127.0.0.1');

// Determine the database port
const DB_PORT = process.env.DOCKER_ENV === 'true' ? 3307 : 3306; // Use 3307 for containerized MySQL, otherwise default to 3306

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT, // Dynamically set the port
    dialect: 'mysql',
    logging: (msg) => {
      console.log(`[Sequelize Log]: ${msg}`);
    }, // Customize logging
    define: {
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Sync the database
sequelize.sync({ alter: false, force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing the database:', err);
  });

export default sequelize;
