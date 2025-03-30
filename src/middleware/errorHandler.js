import CustomError from '../utils/CustomError.js';
import logger from '../utils/logger.js'; // Import the logger

const errorHandler = (err, req, res, next) => {
  // Log the error details
  logger.error('Error:', { message: err.message, stack: err.stack });

  // Ensure res is a valid response object
  if (!res || typeof res.status !== 'function') {
    logger.error('Invalid response object passed to errorHandler.');
    return next(err); // Pass the error to the next middleware
  }

  // Determine if the environment is production
  const isProduction = process.env.NODE_ENV === 'production';

  // Handle custom application errors
  logger.debug('Handling custom application error:', {
    statusCode: err.statusCode,
    message: err.message,
    isProduction,
  });
  if (err instanceof CustomError || err.statusCode) {
    return res.status(err.statusCode || 500).send({
      error: err.message,
      ...(isProduction ? {} : { stack: err.stack }), // Include stack trace only in non-production environments
    });
  }

  // Handle Sequelize validation errors
  logger.debug('Handling Sequelize validation error:', {
    errors: err.errors,
    isProduction,
  });
  if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map((e) => e.message);
    return res.status(400).send({
      error: 'Validation Error',
      details: validationErrors,
    });
  }

  // Handle Sequelize database errors
  logger.debug('Handling Sequelize database error:', {
    message: err.message,
    isProduction,
  });
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).send({
      error: 'Database Error',
      details: isProduction
        ? 'An internal server error occurred.'
        : err.message, // Hide details in production
    });
  }

  // Handle other unexpected errors
  logger.debug('Handling unexpected error:', {
    message: err.message,
    isProduction,
  });
  res.status(500).send({
    error: 'An unexpected error occurred.',
    ...(isProduction ? {} : { details: err.message, stack: err.stack }), // Hide details in production
  });
};

export default errorHandler;
