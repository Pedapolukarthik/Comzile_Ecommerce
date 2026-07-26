const express = require('express');
const storeController = require('./store.controller');
const { storeIdParamSchema } = require('./store.validation');
const validateRequest = require('../../middleware/validate.middleware');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

/**
 * @openapi
 * /stores/{id}:
 *   get:
 *     summary: Retrieve store context details by ID
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details retrieved
 */
router.get('/:id', validateRequest(storeIdParamSchema), catchAsync(storeController.getStoreDetails));

module.exports = router;
