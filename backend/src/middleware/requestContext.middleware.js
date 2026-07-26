const { PERMISSIONS } = require('../constants/permissions');
const { ROLES } = require('../constants/roles');

/**
 * Initializes and normalizes unified request context:
 * - req.user
 * - req.store
 * - req.permissions
 */
const requestContext = (req, res, next) => {
  // Ensure req.user exists or default
  req.user = req.user || null;
  
  // Ensure req.store exists or default
  req.store = req.store || null;

  // Infer permissions based on roles
  const permissions = new Set();
  const userRoles = req.user?.roles || (req.user?.role ? [req.user.role] : []);

  if (userRoles.includes(ROLES.SUPER_ADMIN)) {
    Object.values(PERMISSIONS).forEach((p) => permissions.add(p));
  } else if (userRoles.includes(ROLES.SELLER)) {
    permissions.add(PERMISSIONS.MANAGE_STORE);
    permissions.add(PERMISSIONS.VIEW_STORE);
    permissions.add(PERMISSIONS.MANAGE_PRODUCTS);
    permissions.add(PERMISSIONS.VIEW_PRODUCTS);
    permissions.add(PERMISSIONS.MANAGE_ORDERS);
    permissions.add(PERMISSIONS.VIEW_ORDERS);
  } else if (userRoles.includes(ROLES.CUSTOMER)) {
    permissions.add(PERMISSIONS.CREATE_ORDER);
    permissions.add(PERMISSIONS.VIEW_OWN_ORDERS);
    permissions.add(PERMISSIONS.VIEW_PRODUCTS);
  }

  req.permissions = Array.from(permissions);
  next();
};

module.exports = { requestContext };
