import api from './client';

export const organizationsApi = {
  getAll: async () => {
    const response = await api.get('/organizations');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post('/organizations', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/organizations/${id}`);
    return response.data;
  },

  addMember: async (id: string, data: { userId: string; role?: string }) => {
    const response = await api.post(`/organizations/${id}/members`, data);
    return response.data;
  },

  removeMember: async (id: string, userId: string) => {
    const response = await api.delete(`/organizations/${id}/members/${userId}`);
    return response.data;
  },
};