require('dotenv').config();

module.exports = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: 'json',
  logFilePath: 'logs/app.log',
  errorFilePath: 'logs/error.log'
};
