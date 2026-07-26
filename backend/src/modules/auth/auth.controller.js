const authService = require('./auth.service');
const sendResponse = require('../../utils/apiResponse');
const { MESSAGES } = require('../../constants/messages');
const { STATUS_CODES } = require('../../constants/statusCodes');

class AuthController {
  createDemoToken = async (req, res) => {
    const data = req.validated ? req.validated.body : req.body;
    const result = await authService.generateDemoToken(data);
    return sendResponse(res, STATUS_CODES.OK, true, 'Foundation JWT Token generated successfully', result);
  };

  getProfile = async (req, res) => {
    const profile = await authService.getUserProfile(req.user.id);
    return sendResponse(res, STATUS_CODES.OK, true, 'User profile foundation retrieved', {
      user: profile,
      store: req.store,
      permissions: req.permissions
    });
  };

  getAdminDashboard = async (req, res) => {
    return sendResponse(res, STATUS_CODES.OK, true, 'Super Admin access granted', {
      message: 'Welcome Super Admin'
    });
  };

  getSellerDashboard = async (req, res) => {
    return sendResponse(res, STATUS_CODES.OK, true, 'Seller Panel access granted', {
      storeId: req.storeId,
      store: req.store,
      user: req.user
    });
  };
}

module.exports = new AuthController();
