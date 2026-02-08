import api from './client';

export const reportsApi = {
  getMonthlyReport: async (month: number, year: number) => {
    const response = await api.get('/reports/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  getProjectReport: async (projectId: string, startDate?: string, endDate?: string) => {
    const params: any = { projectId };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/reports/project', { params });
    return response.data;
  },

  exportCSV: async (month: number, year: number) => {
    const response = await api.get('/reports/export/csv', {
      params: { month, year },
      responseType: 'blob',
    });
    return response.data;
  },
};