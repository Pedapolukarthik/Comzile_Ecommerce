const express = require('express');
const healthController = require('./health.controller');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: System Health Check Endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is online
 */
router.get('/', catchAsync(healthController.checkHealth));

module.exports = router;
