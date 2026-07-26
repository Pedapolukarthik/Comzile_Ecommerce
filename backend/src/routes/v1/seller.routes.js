const express = require('express');
const categoryController = require('../../controllers/category.controller');
const productController = require('../../controllers/product.controller');
const catchAsync = require('../../utils/catchAsync');
const validate = require('../../middleware/validate.middleware');
const { authenticateJWT } = require('../../middleware/auth.middleware');
const { authorizeRoles } = require('../../middleware/role.middleware');
const { ROLES } = require('../../constants/roles');
const upload = require('../../middleware/upload.middleware');

const { createCategorySchema, updateCategorySchema } = require('../../validators/category.validator');
const { createProductSchema, updateProductSchema, updateStockSchema } = require('../../validators/product.validator');

const router = express.Router();

// Apply Seller Protection to all seller catalog routes
router.use(authenticateJWT, authorizeRoles(ROLES.SELLER));

/**
 * @openapi
 * /seller/categories:
 *   post:
 *     summary: Create Category
 *     tags: [Seller Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Electronics" }
 *               description: { type: string, example: "Gadgets and devices" }
 *               image: { type: string, example: "https://example.com/category.jpg" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE], example: "ACTIVE" }
 *               sortOrder: { type: integer, example: 0 }
 *     responses:
 *       201:
 *         description: Category created successfully
 *   get:
 *     summary: List Seller Categories
 *     tags: [Seller Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: List of categories
 */
router
  .route('/categories')
  .post(validate(createCategorySchema), catchAsync(categoryController.createCategory))
  .get(catchAsync(categoryController.getCategories));

/**
 * @openapi
 * /seller/categories/{id}:
 *   get:
 *     summary: Get Category Details
 *     tags: [Seller Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 *   put:
 *     summary: Update Category
 *     tags: [Seller Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete Category
 *     tags: [Seller Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */
router
  .route('/categories/:id')
  .get(catchAsync(categoryController.getCategoryById))
  .put(upload.single('image'), validate(updateCategorySchema), catchAsync(categoryController.updateCategory))
  .delete(catchAsync(categoryController.deleteCategory));

/**
 * @openapi
 * /seller/products:
 *   post:
 *     summary: Create Product
 *     tags: [Seller Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, regularPrice, stockQuantity]
 *             properties:
 *               name: { type: string, example: "Wireless Headphones" }
 *               sku: { type: string, example: "AUDIO-WH-001" }
 *               categoryId: { type: string }
 *               regularPrice: { type: number, example: 1999.00 }
 *               salePrice: { type: number, example: 1499.00 }
 *               stockQuantity: { type: integer, example: 50 }
 *               brand: { type: string, example: "SoundMaster" }
 *               status: { type: string, enum: [ACTIVE, DRAFT, OUT_OF_STOCK] }
 *     responses:
 *       201:
 *         description: Product created successfully
 *   get:
 *     summary: List Seller Products with Search & Pagination
 *     tags: [Seller Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, DRAFT, OUT_OF_STOCK] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated products list
 */
router
  .route('/products')
  .post(validate(createProductSchema), catchAsync(productController.createProduct))
  .get(catchAsync(productController.getSellerProducts));

/**
 * @openapi
 * /seller/products/{id}:
 *   get:
 *     summary: Get Product Details
 *     tags: [Seller Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *   put:
 *     summary: Update Product
 *     tags: [Seller Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               regularPrice: { type: number }
 *               salePrice: { type: number }
 *               stockQuantity: { type: integer }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Delete Product
 *     tags: [Seller Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router
  .route('/products/:id')
  .get(catchAsync(productController.getProductById))
  .put(validate(updateProductSchema), catchAsync(productController.updateProduct))
  .delete(catchAsync(productController.deleteProduct));

/**
 * @openapi
 * /seller/products/{id}/stock:
 *   patch:
 *     summary: Update Inventory Stock Quantity
 *     tags: [Seller Inventory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stockQuantity]
 *             properties:
 *               stockQuantity: { type: integer, example: 100 }
 *     responses:
 *       200:
 *         description: Stock updated
 */
router.patch('/products/:id/stock', validate(updateStockSchema), catchAsync(productController.updateStock));

/**
 * @openapi
 * /seller/products/{id}/images:
 *   post:
 *     summary: Upload Product Image
 *     tags: [Seller Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *               isPrimary: { type: boolean }
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl: { type: string }
 *               isPrimary: { type: boolean }
 *     responses:
 *       201:
 *         description: Image uploaded
 */
router.post('/products/:id/images', upload.single('image'), catchAsync(productController.uploadProductImage));

/**
 * @openapi
 * /seller/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete Product Image
 *     tags: [Seller Product Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Image deleted
 */
router.delete('/products/:id/images/:imageId', catchAsync(productController.deleteProductImage));

module.exports = router;
