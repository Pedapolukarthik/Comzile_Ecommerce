const { tenantResolver } = require('../../middleware/tenantResolver.middleware');

const requireTenant = tenantResolver({ required: true });

module.exports = {
  requireTenant
};
