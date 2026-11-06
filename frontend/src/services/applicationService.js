import api from './api';

export const applicationService = {
  applyForJob: async (jobId, formData) => {
    // Check if formData is instance of FormData (when uploading file)
    const isFormData = formData instanceof FormData;
    const response = await api.post(`/applications/apply/${jobId}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  getMyApplications: async (params = {}) => {
    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await api.put(`/applications/${id}/withdraw`);
    return response.data;
  },

  getRecruiterApplicants: async (params = {}) => {
    const response = await api.get('/applications/recruiter/applicants', { params });
    return response.data;
  },

  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  }
};
