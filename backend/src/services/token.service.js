const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const env = require('../config/env.config');
const AppError = require('../utils/appError');

class TokenService {
  /**
   * Hash token string using SHA256 for secure storage
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate Access Token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '15m',
    });
  }

  /**
   * Issue Access Token and Refresh Token with rotation family
   */
  async generateTokenPair(user, role, storeId = null, family = null) {
    const payload = {
      userId: user.id,
      email: user.email,
      role,
      storeId,
    };

    const accessToken = this.generateAccessToken(payload);

    // Generate random refresh token string
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const tokenFamily = family || crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        family: tokenFamily,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  /**
   * Rotate Refresh Token (Reuse Detection included)
   */
  async rotateRefreshToken(rawRefreshToken) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Reuse detection: if token is already revoked, revoke all tokens in family
    if (storedToken.isRevoked) {
      await prisma.refreshToken.updateMany({
        where: { family: storedToken.family },
        data: { isRevoked: true },
      });
      throw new AppError('Refresh token reuse detected. All sessions revoked for security.', 401);
    }

    if (new Date() > storedToken.expiresAt) {
      throw new AppError('Refresh token expired. Please login again.', 401);
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const primaryRole = storedToken.user.userRoles[0]?.role?.name || 'CUSTOMER';
    const storeId = storedToken.user.userRoles[0]?.storeId || null;

    // Issue new pair under the same family
    return this.generateTokenPair(storedToken.user, primaryRole, storeId, storedToken.family);
  }

  /**
   * Revoke single token or all user tokens
   */
  async revokeToken(rawRefreshToken) {
    if (!rawRefreshToken) return;
    const tokenHash = this.hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }
}

module.exports = new TokenService();
