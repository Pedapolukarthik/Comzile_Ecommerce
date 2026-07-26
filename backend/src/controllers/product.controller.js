const productService = require('../services/product.service');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

// Seller Product Controllers
const createProduct = async (req, res) => {
  const storeId = req.user.storeId;
  const product = await productService.createProduct(storeId, req.body);
  return ApiResponse.created(res, 'Product created successfully', product);
};

const getSellerProducts = async (req, res) => {
  const storeId = req.user.storeId;
  const result = await productService.getSellerProducts(storeId, req.query);
  return ApiResponse.success(res, 'Products retrieved successfully', result.products, 200, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
};

const getProductById = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  const product = await productService.getProductById(storeId, id);
  return ApiResponse.success(res, 'Product retrieved successfully', product);
};

const updateProduct = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  const updatedProduct = await productService.updateProduct(storeId, id, req.body);
  return ApiResponse.success(res, 'Product updated successfully', updatedProduct);
};

const deleteProduct = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  await productService.deleteProduct(storeId, id);
  return ApiResponse.success(res, 'Product deleted successfully');
};

const updateStock = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  const { stockQuantity } = req.body;
  const updatedProduct = await productService.updateStock(storeId, id, stockQuantity);
  return ApiResponse.success(res, 'Product stock updated successfully', updatedProduct);
};

const uploadProductImage = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;

  let imageUrl = req.body.imageUrl;
  if (req.file) {
    // Generate public relative path for static file server
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!imageUrl) {
    throw new AppError('Image file or imageUrl is required', 400);
  }

  const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;
  const image = await productService.addProductImage(storeId, id, imageUrl, isPrimary);
  return ApiResponse.created(res, 'Product image added successfully', image);
};

const deleteProductImage = async (req, res) => {
  const storeId = req.user.storeId;
  const { id, imageId } = req.params;
  const result = await productService.deleteProductImage(storeId, id, imageId);
  return ApiResponse.success(res, result.message);
};

// Customer Product Controllers
const getStoreProducts = async (req, res) => {
  const { storeId } = req.params;
  const result = await productService.getCustomerProducts(storeId, req.query);
  return ApiResponse.success(res, 'Store products retrieved successfully', result.products, 200, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
};

const getStoreProductById = async (req, res) => {
  const { storeId, id } = req.params;
  const product = await productService.getCustomerProductById(storeId, id);
  return ApiResponse.success(res, 'Product details retrieved successfully', product);
};

module.exports = {
  createProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImage,
  deleteProductImage,
  getStoreProducts,
  getStoreProductById,
};
