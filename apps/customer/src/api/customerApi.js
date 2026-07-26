import axiosInstance from './axiosInstance';

export const customerApi = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/customer/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/customer/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};
