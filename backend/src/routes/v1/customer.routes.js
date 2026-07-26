const express = require('express');
const categoryController = require('../../controllers/category.controller');
const productController = require('../../controllers/product.controller');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

/**
 * @openapi
 * /stores/{storeId}/categories:
 *   get:
 *     summary: Retrieve Public Store Categories
 *     tags: [Customer Catalog]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Active store categories
 */
router.get('/stores/:storeId/categories', catchAsync(categoryController.getStoreCategories));

/**
 * @openapi
 * /stores/{storeId}/products:
 *   get:
 *     summary: Retrieve Public Store Products with Filtering, Search & Sorting
 *     tags: [Customer Catalog]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [newest, oldest, price_asc, price_desc, name_asc, name_desc], default: newest }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated public products
 */
router.get('/stores/:storeId/products', catchAsync(productController.getStoreProducts));

/**
 * @openapi
 * /stores/{storeId}/products/{id}:
 *   get:
 *     summary: Get Public Product Details
 *     tags: [Customer Catalog]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/stores/:storeId/products/:id', catchAsync(productController.getStoreProductById));

module.exports = router;
