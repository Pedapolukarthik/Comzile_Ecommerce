const sendResponse = require('../../utils/apiResponse');
const { MESSAGES } = require('../../constants/messages');
const { STATUS_CODES } = require('../../constants/statusCodes');
const appConfig = require('../../config/app.config');

class HealthController {
  checkHealth = (req, res) => {
    return sendResponse(res, STATUS_CODES.OK, true, MESSAGES.HEALTH_OK, {
      status: 'online',
      environment: appConfig.env,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  };
}

module.exports = new HealthController();
