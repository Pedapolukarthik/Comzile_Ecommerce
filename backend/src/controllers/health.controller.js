const sendResponse = require('../utils/apiResponse');

class HealthController {
  checkHealth = (req, res) => {
    return sendResponse(res, 200, true, 'Multi-Tenant SaaS eCommerce API Health Check Passed', {
      status: 'online',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  };
}

module.exports = new HealthController();
