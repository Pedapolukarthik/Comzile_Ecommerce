const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: nodeEnv,
  API_VERSION: process.env.API_VERSION || 'v1',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  DATABASE_URL: process.env.DATABASE_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
  
  // Auth & Account Lock Settings
  AUTH_ENABLE_ACCOUNT_LOCK: process.env.AUTH_ENABLE_ACCOUNT_LOCK !== undefined
    ? process.env.AUTH_ENABLE_ACCOUNT_LOCK === 'true'
    : (nodeEnv === 'production'), // Default false in development unless explicitly true
  AUTH_MAX_FAILED_ATTEMPTS: parseInt(process.env.AUTH_MAX_FAILED_ATTEMPTS || '5', 10),
  AUTH_LOCKOUT_DURATION_MINS: parseInt(process.env.AUTH_LOCKOUT_DURATION_MINS || '15', 10),
};
