const express = require('express');
const authController = require('../../controllers/auth.controller');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middleware/validate.middleware');
const { authenticateJWT } = require('../../middleware/auth.middleware');
const { resolveTenant } = require('../../middleware/tenant.middleware');
const {
  superAdminLoginSchema,
  sellerRegisterSchema,
  sellerLoginSchema,
  customerRegisterSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../../validators/auth.validator');

const router = express.Router();

/**
  * @openapi
  * /auth/admin/login:
  *   post:
  *     summary: Super Admin Login
  *     tags: [Super Admin Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [email, password]
  *             properties:
  *               email: { type: string, example: "admin@comzilo.com" }
  *               password: { type: string, example: "AdminPass@123" }
  *     responses:
  *       200:
  *         description: Super Admin logged in successfully
  */
router.post('/admin/login', validate(superAdminLoginSchema), catchAsync(authController.superAdminLogin));

/**
  * @openapi
  * /auth/seller/register:
  *   post:
  *     summary: Register a new seller (Sets status PENDING)
  *     tags: [Seller Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [businessName, ownerName, email, mobileNumber, password, confirmPassword, address]
  *             properties:
  *               businessName: { type: string, example: "Apex Traders" }
  *               ownerName: { type: string, example: "John Doe" }
  *               email: { type: string, example: "seller@business.com" }
  *               mobileNumber: { type: string, example: "9876543210" }
  *               password: { type: string, example: "Pass@1234" }
  *               confirmPassword: { type: string, example: "Pass@1234" }
  *               gstNumber: { type: string, example: "22AAAAA0000A1Z5" }
  *               panNumber: { type: string, example: "ABCDE1234F" }
  *               address: { type: string, example: "123 Business Street" }
  *     responses:
  *       201:
  *         description: Seller application submitted
  */
router.post('/seller/register', validate(sellerRegisterSchema), catchAsync(authController.registerSeller));

/**
  * @openapi
  * /auth/seller/verify-email:
  *   post:
  *     summary: Verify Seller Email Address
  *     tags: [Seller Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [token]
  *             properties:
  *               token: { type: string }
  *     responses:
  *       200:
  *         description: Email verified successfully
  */
router.post('/seller/verify-email', catchAsync(authController.verifySellerEmail));

/**
  * @openapi
  * /auth/seller/login:
  *   post:
  *     summary: Seller Login (Allows login only when status is ACTIVE)
  *     tags: [Seller Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [email, password]
  *             properties:
  *               email: { type: string, example: "seller@business.com" }
  *               password: { type: string, example: "Pass@1234" }
  *     responses:
  *       200:
  *         description: Seller logged in successfully
  */
router.post('/seller/login', validate(sellerLoginSchema), catchAsync(authController.sellerLogin));

/**
  * @openapi
  * /auth/send-otp:
  *   post:
  *     summary: Send SMS / WhatsApp OTP (Architectural Adapter)
  *     tags: [OTP Architecture]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [mobileNumber]
  *             properties:
  *               mobileNumber: { type: string, example: "9876543210" }
  *               channel: { type: string, example: "SMS" }
  *     responses:
  *       200:
  *         description: OTP dispatched
  */
router.post('/send-otp', catchAsync(authController.sendOtp));

/**
  * @openapi
  * /auth/verify-otp:
  *   post:
  *     summary: Verify SMS / WhatsApp OTP (Architectural Adapter)
  *     tags: [OTP Architecture]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [mobileNumber, otpCode]
  *             properties:
  *               mobileNumber: { type: string, example: "9876543210" }
  *               otpCode: { type: string, example: "123456" }
  *     responses:
  *       200:
  *         description: OTP verified
  */
router.post('/verify-otp', catchAsync(authController.verifyOtp));

/**
  * @openapi
  * /auth/customer/register:
  *   post:
  *     summary: Customer Registration (Scoped to store_id)
  *     tags: [Customer Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [storeId, email, firstName, password, confirmPassword]
  *             properties:
  *               storeId: { type: string, example: "store-uuid-here" }
  *               email: { type: string, example: "customer@example.com" }
  *               firstName: { type: string, example: "Jane" }
  *               lastName: { type: string, example: "Smith" }
  *               mobileNumber: { type: string, example: "9876543210" }
  *               password: { type: string, example: "Pass@1234" }
  *               confirmPassword: { type: string, example: "Pass@1234" }
  *     responses:
  *       201:
  *         description: Customer registered successfully
  */
router.post('/customer/register', resolveTenant({ required: false }), validate(customerRegisterSchema), catchAsync(authController.registerCustomer));

/**
  * @openapi
  * /auth/customer/login:
  *   post:
  *     summary: Customer Login (Scoped to store_id)
  *     tags: [Customer Auth]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [email, password]
  *             properties:
  *               storeId: { type: string, example: "store-uuid-here" }
  *               email: { type: string, example: "customer@example.com" }
  *               password: { type: string, example: "Pass@1234" }
  *     responses:
  *       200:
  *         description: Customer logged in successfully
  */
router.post('/customer/login', resolveTenant({ required: false }), validate(customerLoginSchema), catchAsync(authController.customerLogin));

/**
  * @openapi
  * /auth/forgot-password:
  *   post:
  *     summary: Request Password Reset Token
  *     tags: [Password Management]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [email]
  *             properties:
  *               email: { type: string, example: "user@example.com" }
  *     responses:
  *       200:
  *         description: Password reset email dispatched
  */
router.post('/forgot-password', validate(forgotPasswordSchema), catchAsync(authController.forgotPassword));

/**
  * @openapi
  * /auth/reset-password:
  *   post:
  *     summary: Reset Password using Reset Token
  *     tags: [Password Management]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [token, newPassword, confirmPassword]
  *             properties:
  *               token: { type: string }
  *               newPassword: { type: string, example: "NewPass@1234" }
  *               confirmPassword: { type: string, example: "NewPass@1234" }
  *     responses:
  *       200:
  *         description: Password reset successfully
  */
router.post('/reset-password', validate(resetPasswordSchema), catchAsync(authController.resetPassword));

/**
  * @openapi
  * /auth/change-password:
  *   post:
  *     summary: Change Password (Authenticated User)
  *     tags: [Password Management]
  *     security:
  *       - BearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [currentPassword, newPassword, confirmPassword]
  *             properties:
  *               currentPassword: { type: string, example: "Pass@1234" }
  *               newPassword: { type: string, example: "NewPass@1234" }
  *               confirmPassword: { type: string, example: "NewPass@1234" }
  *     responses:
  *       200:
  *         description: Password changed successfully
  */
router.post('/change-password', authenticateJWT, validate(changePasswordSchema), catchAsync(authController.changePassword));

/**
  * @openapi
  * /auth/refresh-token:
  *   post:
  *     summary: Refresh Access Token via Refresh Token Rotation
  *     tags: [Token Management]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [refreshToken]
  *             properties:
  *               refreshToken: { type: string }
  *     responses:
  *       200:
  *         description: Token pair refreshed
  */
router.post('/refresh-token', catchAsync(authController.refreshToken));

/**
  * @openapi
  * /auth/logout:
  *   post:
  *     summary: Revoke Refresh Token & Logout
  *     tags: [Token Management]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [refreshToken]
  *             properties:
  *               refreshToken: { type: string }
  *     responses:
  *       200:
  *         description: Logged out successfully
  */
router.post('/logout', catchAsync(authController.logout));

/**
  * @openapi
  * /auth/me:
  *   get:
  *     summary: Get Current User Context & Profile
  *     tags: [Token Management]
  *     security:
  *       - BearerAuth: []
  *     responses:
  *       200:
  *         description: User profile and store context
  */
router.get('/me', authenticateJWT, resolveTenant({ required: false }), catchAsync(authController.getProfile));

module.exports = router;
