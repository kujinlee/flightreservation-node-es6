import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';
import flightRoutes from './routes/flightRoutes.js';
import { sequelize } from './models/index.js'; // Import sequelize and associations from index.js
import errorHandler from './middleware/errorHandler.js';
import { swaggerDocs, swaggerUi } from './config/swaggerConfig.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set global base URL
const BASE_URL = process.env.BASE_URL || '/flightreservation-node';
app.use((req, res, next) => {
    res.locals.BASE_URL = BASE_URL;
    next();
});
app.use(BASE_URL, flightRoutes);

// Register the global error handler
app.use(errorHandler);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load SSL/TLS certificates if HTTPS is enabled
const USE_HTTPS = process.env.USE_HTTPS === 'true';
let server;

if (USE_HTTPS) {
    const sslOptions = {
        key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem')),
    };
    console.log('SSL options loaded:', sslOptions);
    server = https.createServer(sslOptions, app);
} else {
    server = http.createServer(app);
}

// Sync database and start the server
sequelize.sync().then(async () => {
    try {
        const testQuery = await sequelize.query('SELECT 1 + 1 AS result');
        console.log('MYLOG: Database connection test result:', testQuery);
    } catch (error) {
        console.error('MYLOG: Database connection error:', error);
    }
    const PORT = process.env.PORT || 8080; // Internal port the app listens on
    const EXPOSED_PORT = process.env.EXPOSED_PORT || PORT; // External port for containerized environments
    const HOST_PORT = process.env.DOCKER_ENV === 'true' ? EXPOSED_PORT : PORT; // Use EXPOSED_PORT only if DOCKER_ENV=true
    const HOST_URL = process.env.HOST_URL || 'localhost'; // Use HOST_URL from .env or default to 'localhost'

    server.listen(PORT, () => {
        const protocol = USE_HTTPS ? 'https' : 'http';
        console.log(`Server running on ${protocol}://${HOST_URL}:${HOST_PORT}${BASE_URL}`);
    });
});
