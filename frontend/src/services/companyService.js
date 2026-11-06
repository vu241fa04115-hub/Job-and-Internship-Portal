import api from './api';

export const companyService = {
  getMyCompany: async () => {
    const response = await api.get('/companies/profile/my-company');
    return response.data;
  },

  updateMyCompany: async (companyData) => {
    const response = await api.put('/companies/profile/my-company', companyData);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/companies/profile/my-company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }
};
