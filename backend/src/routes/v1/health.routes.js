const express = require('express');
const healthController = require('../../controllers/health.controller');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router.get('/', catchAsync(healthController.checkHealth));

module.exports = router;
