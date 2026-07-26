require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_32chars!',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  algorithm: 'HS256'
};
