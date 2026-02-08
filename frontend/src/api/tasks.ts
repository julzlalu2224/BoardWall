import api from './client';

export const tasksApi = {
  getAll: async (projectId?: string, status?: string) => {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (status) params.status = status;
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  assign: async (id: string, assigneeId: string) => {
    const response = await api.put(`/tasks/${id}/assign`, { assigneeId });
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  },
};