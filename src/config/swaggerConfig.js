import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const BASE_URL = process.env.BASE_URL || '/flightreservation-node';
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const HOST_URL = process.env.HOST_URL || 'localhost';
const PORT = process.env.PORT || 8080;
const EXPOSED_PORT = process.env.EXPOSED_PORT || PORT;
const HOST_PORT = process.env.DOCKER_ENV === 'true' ? EXPOSED_PORT : PORT;

const protocol = USE_HTTPS ? 'https' : 'http';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight Reservation API',
      version: '1.0.0',
      description: 'API documentation for the Flight Reservation system',
    },
    servers: [
      {
        url: `${protocol}://${HOST_URL}:${HOST_PORT}${BASE_URL}`,
        description: 'Dynamic server based on environment configuration',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
