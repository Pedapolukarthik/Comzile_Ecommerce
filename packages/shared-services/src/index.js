const axios = require('axios');

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const createApiClient = ({ getStoreId, getToken } = {}) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  instance.interceptors.request.use(
    (config) => {
      if (getToken) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      if (getStoreId) {
        const storeId = getStoreId();
        if (storeId) {
          config.headers['x-store-id'] = storeId;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SELLER: 'SELLER',
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF'
};

module.exports = {
  createApiClient,
  ROLES,
  API_BASE_URL
};
