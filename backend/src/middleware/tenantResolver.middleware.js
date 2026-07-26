const prisma = require('../config/prisma');
const logger = require('../utils/logger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * TenantResolver middleware supports 4 multi-tenant resolution modes:
 * 1. JWT payload (req.user.storeId)
 * 2. Request Header ('x-store-id' or 'x-tenant-domain')
 * 3. Subdomain resolution (e.g. merchant.platform.com)
 * 4. Custom Domain resolution (e.g. merchantstore.com)
 */
const tenantResolver = (options = { required: false }) => {
  return catchAsync(async (req, res, next) => {
    let storeId = req.headers['x-store-id'] || req.query.store_id || req.user?.storeId;
    let customDomain = req.headers['x-tenant-domain'];
    let resolvedStore = null;

    // 1. Resolve via Store ID if available
    if (storeId) {
      resolvedStore = await prisma.store.findUnique({ where: { id: storeId } });
    }

    // 2. Resolve via Custom Domain / Header
    if (!resolvedStore && customDomain) {
      resolvedStore = await prisma.store.findUnique({ where: { domain: customDomain } });
    }

    // 3. Resolve via Host header (Subdomain or Custom Domain)
    if (!resolvedStore && req.headers.host) {
      const host = req.headers.host.split(':')[0]; // strip port
      const parts = host.split('.');

      if (parts.length > 2) {
        const subdomainSlug = parts[0];
        resolvedStore = await prisma.store.findUnique({ where: { slug: subdomainSlug } });
      }

      if (!resolvedStore) {
        resolvedStore = await prisma.store.findUnique({ where: { domain: host } });
      }
    }

    if (options.required && !resolvedStore) {
      return next(new AppError('Tenant/Store context is required and could not be resolved.', 400));
    }

    req.store = resolvedStore || null;
    req.storeId = resolvedStore ? resolvedStore.id : (storeId || null);
    req.tenant = { store: req.store, storeId: req.storeId };

    if (req.storeId) {
      logger.debug(`TenantResolver: Context resolved for storeId=${req.storeId}`);
    }

    next();
  });
};

module.exports = { tenantResolver };
