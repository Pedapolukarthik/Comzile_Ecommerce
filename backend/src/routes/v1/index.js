const express = require('express');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const healthRoutes = require('./health.routes');
const storeModule = require('../../modules/store');

const router = express.Router();

// Mount API v1 Routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
if (storeModule && storeModule.routes) {
  router.use('/stores', storeModule.routes);
}

module.exports = router;
