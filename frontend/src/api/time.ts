import api from './client';

export const timeApi = {
  startTimer: async (data: { taskId: string; notes?: string }) => {
    const response = await api.post('/time/start', data);
    return response.data;
  },

  stopTimer: async (data: { timeEntryId: string; notes?: string }) => {
    const response = await api.post('/time/stop', data);
    return response.data;
  },

  getActiveTimer: async () => {
    const response = await api.get('/time/active');
    return response.data;
  },

  getEntries: async (taskId?: string, startDate?: string, endDate?: string) => {
    const params: any = {};
    if (taskId) params.taskId = taskId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/time/entries', { params });
    return response.data;
  },

  deleteEntry: async (id: string) => {
    const response = await api.delete(`/time/entries/${id}`);
    return response.data;
  },
};