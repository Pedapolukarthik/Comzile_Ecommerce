const authService = require('./auth.service');
const AppError = require('../../utils/appError');
const { MESSAGES } = require('../../constants/messages');
const { STATUS_CODES } = require('../../constants/statusCodes');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', STATUS_CODES.UNAUTHORIZED));
    }
    return next(new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED));
  }
};

module.exports = { authenticateJWT };
