import axiosInstance from './axiosInstance';

const DEFAULT_STORE_ID = 'demo-store-id';

export const customerApi = {
  // Auth
  register: async (customerData) => {
    const response = await axiosInstance.post('/auth/customer/register', customerData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/customer/login', credentials);
    return response.data;
  },

  // Public Storefront Catalog
  getCategories: async (storeId = DEFAULT_STORE_ID) => {
    const targetStoreId = storeId || DEFAULT_STORE_ID;
    const response = await axiosInstance.get(`/stores/${targetStoreId}/categories`);
    return response.data;
  },

  getProducts: async (storeId = DEFAULT_STORE_ID, params = {}) => {
    const targetStoreId = storeId || DEFAULT_STORE_ID;
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.featured) query.append('featured', params.featured);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const url = `/stores/${targetStoreId}/products${queryString ? `?${queryString}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getProductById: async (storeId = DEFAULT_STORE_ID, productId) => {
    const targetStoreId = storeId || DEFAULT_STORE_ID;
    const response = await axiosInstance.get(`/stores/${targetStoreId}/products/${productId}`);
    return response.data;
  },
};
