const express = require('express');
const adminController = require('../../controllers/admin.controller');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middleware/validate.middleware');
const { authenticateJWT } = require('../../middleware/auth.middleware');
const { authorizeRoles } = require('../../middleware/role.middleware');
const { ROLES } = require('../../constants/roles');
const { rejectSellerSchema } = require('../../validators/auth.validator');

const router = express.Router();

// Apply Super Admin Protection to all admin routes
router.use(authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN));

/**
 * @openapi
 * /admin/sellers:
 *   get:
 *     summary: View All or Filtered Sellers
 *     tags: [Super Admin Seller Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, SUSPENDED, REJECTED]
 *         description: Optional seller status filter
 *     responses:
 *       200:
 *         description: List of seller stores
 */
router.get('/sellers', catchAsync(adminController.getSellers));

/**
 * @openapi
 * /admin/sellers/{storeId}/approve:
 *   patch:
 *     summary: Approve Pending Seller Application & Auto-Create StoreSettings
 *     tags: [Super Admin Seller Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller approved and StoreSettings initialized
 */
router.patch('/sellers/:storeId/approve', catchAsync(adminController.approveSeller));

/**
 * @openapi
 * /admin/sellers/{storeId}/reject:
 *   patch:
 *     summary: Reject Seller Application with Reason
 *     tags: [Super Admin Seller Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rejectionReason]
 *             properties:
 *               rejectionReason: { type: string, example: "Incomplete business documentation" }
 *     responses:
 *       200:
 *         description: Seller application rejected
 */
router.patch('/sellers/:storeId/reject', validate(rejectSellerSchema), catchAsync(adminController.rejectSeller));

/**
 * @openapi
 * /admin/sellers/{storeId}/suspend:
 *   patch:
 *     summary: Suspend Seller Account
 *     tags: [Super Admin Seller Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller account suspended
 */
router.patch('/sellers/:storeId/suspend', catchAsync(adminController.suspendSeller));

/**
 * @openapi
 * /admin/sellers/{storeId}/activate:
 *   patch:
 *     summary: Activate Suspended or Inactive Seller Account
 *     tags: [Super Admin Seller Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller account activated
 */
router.patch('/sellers/:storeId/activate', catchAsync(adminController.activateSeller));

module.exports = router;
