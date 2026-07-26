require('dotenv').config();

module.exports = {
  url: process.env.DATABASE_URL,
  provider: 'mysql',
  loggingEnabled: process.env.NODE_ENV === 'development'
};
