import api from '../../../services/api';

export const loginAdmin = async (email, password) => {
  const response = await api.post('/api/admin/login', {
    email,
    password,
  });

  return response.data;
};

export const getInquiries = async (params = {}) => {
  const response = await api.get('/api/dashboard/inquiries', {
    params,
  });

  return response.data;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await api.patch(`/api/dashboard/inquiries/${id}/status`, { status });

  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post('/api/admin/logout');
  return response.data;
};
