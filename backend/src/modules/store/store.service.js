const storeModuleRepository = require('./store.repository');
const AppError = require('../../utils/appError');
const { MESSAGES } = require('../../constants/messages');

class StoreService {
  async getStoreById(id) {
    const store = await storeModuleRepository.getStoreById(id);
    if (!store) {
      throw new AppError(MESSAGES.TENANT_NOT_FOUND, 404);
    }
    return store;
  }
}

module.exports = new StoreService();
