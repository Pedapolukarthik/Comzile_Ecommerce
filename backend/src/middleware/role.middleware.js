const AppError = require('../utils/appError');
const { ROLES } = require('../constants/roles');

/**
 * Middleware factory to authorize users based on required roles.
 * @param  {...string} allowedRoles Roles permitted to access the endpoint
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access', 401));
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];

    // SUPER_ADMIN has global access across all endpoints
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return next();
    }

    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return next(new AppError('Forbidden. You do not have permission to perform this action.', 403));
    }

    next();
  };
};

module.exports = { authorizeRoles };
