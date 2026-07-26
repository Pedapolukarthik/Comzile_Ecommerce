const authRoutes = require('./auth.routes');
const authService = require('./auth.service');
const authController = require('./auth.controller');
const authRepository = require('./auth.repository');

module.exports = {
  routes: authRoutes,
  service: authService,
  controller: authController,
  repository: authRepository
};
