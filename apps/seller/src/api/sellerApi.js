import axiosInstance from './axiosInstance';

export const sellerApi = {
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
};
