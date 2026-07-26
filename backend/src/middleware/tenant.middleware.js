const storeService = require('../services/store.service');
const logger = require('../utils/logger');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to extract and set multi-tenant Store/Tenant context using StoreService.
 */
const resolveTenant = (options = { required: false }) => {
  return catchAsync(async (req, res, next) => {
    const storeId = await storeService.resolveStoreContext(
      req.headers['x-store-id'],
      req.query.store_id,
      req.user?.storeId,
      req.headers.host
    );

    if (options.required) {
      await storeService.validateStoreAccess(storeId);
    }

    req.storeId = storeId;
    req.tenant = { storeId: req.storeId };

    if (req.storeId) {
      logger.debug(`Tenant context bound: store_id = ${req.storeId}`);
    }

    next();
  });
};

module.exports = { resolveTenant };
