import axiosInstance from './axiosInstance';

export const adminApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/admin/login', credentials);
    return response.data;
  },

  getSellers: async (status = '') => {
    const url = status ? `/admin/sellers?status=${status}` : '/admin/sellers';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  approveSeller: async (storeId) => {
    const response = await axiosInstance.patch(`/admin/sellers/${storeId}/approve`);
    return response.data;
  },

  rejectSeller: async (storeId, rejectionReason) => {
    const response = await axiosInstance.patch(`/admin/sellers/${storeId}/reject`, { rejectionReason });
    return response.data;
  },

  suspendSeller: async (storeId) => {
    const response = await axiosInstance.patch(`/admin/sellers/${storeId}/suspend`);
    return response.data;
  },

  activateSeller: async (storeId) => {
    const response = await axiosInstance.patch(`/admin/sellers/${storeId}/activate`);
    return response.data;
  },
};
