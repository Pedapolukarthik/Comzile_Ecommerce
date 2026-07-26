const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

const extractReqInfo = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  userAgent: req.headers['user-agent'],
});

const getSellers = async (req, res) => {
  const { status } = req.query;
  const sellers = await authService.getSellers(status);
  return ApiResponse.success(res, 'Sellers fetched successfully', sellers);
};

const approveSeller = async (req, res) => {
  const { storeId } = req.params;
  const adminId = req.user.userId;
  const store = await authService.approveSeller(storeId, adminId, extractReqInfo(req));
  return ApiResponse.success(res, 'Seller approved successfully and notified via Email/WhatsApp', store);
};

const rejectSeller = async (req, res) => {
  const { storeId } = req.params;
  const { rejectionReason } = req.body;
  const adminId = req.user.userId;
  const store = await authService.rejectSeller(storeId, rejectionReason, adminId, extractReqInfo(req));
  return ApiResponse.success(res, 'Seller rejected and notified via Email/WhatsApp', store);
};

const suspendSeller = async (req, res) => {
  const { storeId } = req.params;
  const adminId = req.user.userId;
  const store = await authService.suspendSeller(storeId, adminId, extractReqInfo(req));
  return ApiResponse.success(res, 'Seller suspended successfully', store);
};

const activateSeller = async (req, res) => {
  const { storeId } = req.params;
  const adminId = req.user.userId;
  const store = await authService.activateSeller(storeId, adminId, extractReqInfo(req));
  return ApiResponse.success(res, 'Seller activated successfully', store);
};

module.exports = {
  getSellers,
  approveSeller,
  rejectSeller,
  suspendSeller,
  activateSeller,
};
