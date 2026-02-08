import api from './client';

export const projectsApi = {
  getAll: async (organizationId?: string) => {
    const params = organizationId ? { organizationId } : {};
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; organizationId: string }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string; status?: string }) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (id: string, data: { userId: string; role?: string }) => {
    const response = await api.post(`/projects/${id}/members`, data);
    return response.data;
  },

  removeMember: async (id: string, userId: string) => {
    const response = await api.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },
};