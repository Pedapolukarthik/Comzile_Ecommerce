const healthRoutes = require('./health.routes');
const healthController = require('./health.controller');

module.exports = {
  routes: healthRoutes,
  controller: healthController
};
