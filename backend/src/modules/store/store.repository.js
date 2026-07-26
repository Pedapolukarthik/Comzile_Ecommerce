const storeRepository = require('../../repositories/store.repository');

class StoreModuleRepository {
  async getStoreById(id) {
    return storeRepository.findById(id);
  }

  async getStoreBySlug(slug) {
    return storeRepository.findBySlug(slug);
  }

  async getStoreByDomain(domain) {
    return storeRepository.findByDomain(domain);
  }
}

module.exports = new StoreModuleRepository();
