const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const notificationService = require('../services/notification/notification.service');
const ApiResponse = require('../utils/apiResponse');

const extractReqInfo = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  userAgent: req.headers['user-agent'],
});

// Super Admin
const superAdminLogin = async (req, res) => {
  const result = await authService.superAdminLogin(req.body, extractReqInfo(req));
  return ApiResponse.success(res, 'Super Admin logged in successfully', result);
};

// Seller
const registerSeller = async (req, res) => {
  const result = await authService.registerSeller(req.body, extractReqInfo(req));
  return ApiResponse.created(res, result.message, result);
};

const verifySellerEmail = async (req, res) => {
  const { token } = req.body;
  const result = await authService.verifySellerEmail(token);
  return ApiResponse.success(res, result.message);
};

const sellerLogin = async (req, res) => {
  const result = await authService.sellerLogin(req.body, extractReqInfo(req));
  return ApiResponse.success(res, 'Seller logged in successfully', result);
};

// OTP Architectural Endpoints (SMS/WhatsApp stub)
const sendOtp = async (req, res) => {
  const { mobileNumber, channel } = req.body;
  const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const dispatchResult = await notificationService.sendOtp({ mobileNumber, otpCode: mockOtp, channel });
  return ApiResponse.success(res, 'OTP dispatched successfully (Architectural Adapter)', {
    ...dispatchResult,
    otpCode: mockOtp, // Exposed for dev verification
  });
};

const verifyOtp = async (req, res) => {
  const { mobileNumber, otpCode } = req.body;
  // Stub OTP verification logic
  return ApiResponse.success(res, 'OTP verified successfully', { verified: true, mobileNumber });
};

// Customer
const registerCustomer = async (req, res) => {
  const storeId = req.body.storeId || req.storeId;
  const result = await authService.registerCustomer({ ...req.body, storeId }, extractReqInfo(req));
  return ApiResponse.created(res, 'Customer registered successfully', result);
};

const customerLogin = async (req, res) => {
  const storeId = req.body.storeId || req.storeId;
  const result = await authService.customerLogin({ ...req.body, storeId }, extractReqInfo(req));
  return ApiResponse.success(res, 'Customer logged in successfully', result);
};

// Common Password Actions
const forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return ApiResponse.success(res, result.message, result);
};

const resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return ApiResponse.success(res, result.message);
};

const changePassword = async (req, res) => {
  const result = await authService.changePassword(req.user.userId, req.body);
  return ApiResponse.success(res, result.message);
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  const newTokens = await tokenService.rotateRefreshToken(token);
  return ApiResponse.success(res, 'Tokens refreshed successfully', newTokens);
};

// Logout
const logout = async (req, res) => {
  const { refreshToken: token } = req.body;
  const userId = req.user?.userId;
  const result = await authService.logout(token, userId, extractReqInfo(req));
  return ApiResponse.success(res, result.message);
};

// Get Current User Context
const getProfile = async (req, res) => {
  return ApiResponse.success(res, 'User profile fetched successfully', {
    user: req.user,
    storeId: req.storeId,
  });
};

module.exports = {
  superAdminLogin,
  registerSeller,
  verifySellerEmail,
  sellerLogin,
  sendOtp,
  verifyOtp,
  registerCustomer,
  customerLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  logout,
  getProfile,
};
