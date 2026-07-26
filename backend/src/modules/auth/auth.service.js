const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');
const authRepository = require('./auth.repository');
const AppError = require('../../utils/appError');
const { ROLES } = require('../../constants/roles');

class AuthService {
  generateToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  }

  verifyToken(token) {
    return jwt.verify(token, jwtConfig.secret);
  }

  async generateDemoToken({ role = ROLES.SELLER, email = 'user@example.com', storeId = 'store-demo-123' }) {
    const payload = {
      id: 'usr-demo-001',
      email,
      roles: [role],
      storeId
    };

    const token = this.generateToken(payload);
    return { token, user: payload };
  }

  async getUserProfile(userId) {
    if (userId === 'usr-demo-001') {
      return {
        id: 'usr-demo-001',
        email: 'user@example.com',
        roles: [ROLES.SELLER],
        status: 'active'
      };
    }

    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }
}

module.exports = new AuthService();
