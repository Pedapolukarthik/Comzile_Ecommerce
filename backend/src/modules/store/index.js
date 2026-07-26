const storeRoutes = require('./store.routes');
const storeService = require('./store.service');
const storeController = require('./store.controller');
const storeRepository = require('./store.repository');

module.exports = {
  routes: storeRoutes,
  service: storeService,
  controller: storeController,
  repository: storeRepository
};
