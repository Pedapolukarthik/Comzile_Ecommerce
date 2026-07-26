const app = require('./app');
const envConfig = require('./config/env.config');
const logger = require('./utils/logger');

const server = app.listen(envConfig.PORT, () => {
  logger.info(`====================================================`);
  logger.info(`  Multi-Tenant SaaS eCommerce API Server Started   `);
  logger.info(`  Environment: ${envConfig.NODE_ENV}`);
  logger.info(`  Port       : ${envConfig.PORT}`);
  logger.info(`  API Version: /api/${envConfig.API_VERSION}`);
  logger.info(`====================================================`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down server...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down server...');
  logger.error(err);
  process.exit(1);
});
