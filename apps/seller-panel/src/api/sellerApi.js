import axiosInstance from './axiosInstance';

export const sellerApi = {
  // Auth
  register: async (sellerData) => {
    const response = await axiosInstance.post('/auth/seller/register', sellerData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/seller/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Categories
  getCategories: async (status = '') => {
    const response = await axiosInstance.get(status ? `/seller/categories?status=${status}` : '/seller/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/seller/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const isFormData = categoryData instanceof FormData;
    const response = await axiosInstance.post('/seller/categories', categoryData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const isFormData = categoryData instanceof FormData;
    const response = await axiosInstance.put(`/seller/categories/${id}`, categoryData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/seller/categories/${id}`);
    return response.data;
  },

  // Products
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const response = await axiosInstance.get(queryString ? `/seller/products?${queryString}` : '/seller/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/seller/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post('/seller/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/seller/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/seller/products/${id}`);
    return response.data;
  },

  // Inventory
  updateStock: async (id, stockQuantity) => {
    const response = await axiosInstance.patch(`/seller/products/${id}/stock`, { stockQuantity });
    return response.data;
  },

  // Images
  uploadProductImage: async (id, formDataOrData) => {
    const isFormData = formDataOrData instanceof FormData;
    const response = await axiosInstance.post(`/seller/products/${id}/images`, formDataOrData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  deleteProductImage: async (id, imageId) => {
    const response = await axiosInstance.delete(`/seller/products/${id}/images/${imageId}`);
    return response.data;
  },
};
