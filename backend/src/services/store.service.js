const storeRepository = require('../repositories/store.repository');
const AppError = require('../utils/appError');

class StoreService {
  async resolveStoreContext(storeIdHeader, queryStoreId, userStoreId, hostHeader) {
    let storeId = storeIdHeader || queryStoreId || userStoreId;

    if (!storeId && hostHeader) {
      const hostParts = hostHeader.split('.');
      if (hostParts.length > 2) {
        const storeSlug = hostParts[0];
        const store = await storeRepository.findBySlug(storeSlug);
        if (store) {
          storeId = store.id;
        }
      }
    }

    return storeId || null;
  }

  async validateStoreAccess(storeId) {
    if (!storeId) {
      throw new AppError('Store ID is required for this operation.', 400);
    }
    return true;
  }
}

module.exports = new StoreService();
