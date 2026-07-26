const logger = require('../utils/logger');
const envConfig = require('../config/env.config');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - IP: ${req.ip}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  if (envConfig.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Production error response (do not leak sensitive stack trace details)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  // Generic 500 server error
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong on the server.'
  });
};

module.exports = globalErrorHandler;
