import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === 'test' ? 'debug' : 'info'), // Use 'debug' level in test environment
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json() // Log in JSON format for structured logging
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize logs for console output
        format.simple() // Simple format for readability
      ),
    }),
  ],
});

export default logger;
