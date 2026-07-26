const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/apiResponse');

// Seller Category Controllers
const createCategory = async (req, res) => {
  const storeId = req.user.storeId;
  const categoryData = { ...req.body };

  if (req.file) {
    categoryData.image = `/uploads/categories/${req.file.filename}`;
  }

  const category = await categoryService.createCategory(storeId, categoryData);
  return ApiResponse.created(res, 'Category created successfully', category);
};

const getCategories = async (req, res) => {
  const storeId = req.user.storeId;
  const { status } = req.query;
  const categories = await categoryService.getCategories(storeId, status);
  return ApiResponse.success(res, 'Categories retrieved successfully', categories);
};

const getCategoryById = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  const category = await categoryService.getCategoryById(storeId, id);
  return ApiResponse.success(res, 'Category retrieved successfully', category);
};

const updateCategory = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  const categoryData = { ...req.body };

  if (req.file) {
    categoryData.image = `/uploads/categories/${req.file.filename}`;
  }

  const updatedCategory = await categoryService.updateCategory(storeId, id, categoryData);
  return ApiResponse.success(res, 'Category updated successfully', updatedCategory);
};

const deleteCategory = async (req, res) => {
  const storeId = req.user.storeId;
  const { id } = req.params;
  await categoryService.deleteCategory(storeId, id);
  return ApiResponse.success(res, 'Category deleted successfully');
};

// Customer Category Controller
const getStoreCategories = async (req, res) => {
  const { storeId } = req.params;
  const categories = await categoryService.getCustomerCategories(storeId);
  return ApiResponse.success(res, 'Store categories retrieved successfully', categories);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getStoreCategories,
};
