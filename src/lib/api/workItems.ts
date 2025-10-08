import { apiClient } from './client';
import { CreateWorkItemData } from '@/types';

export const workItemsApi = {
  getAll: async (filters?: Record<string, any>) => {
    const { data } = await apiClient.get('/workitems', { params: filters });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/workitems/${id}`);
    return data;
  },

  create: async (workItemData: CreateWorkItemData) => {
    const { data } = await apiClient.post('/workitems', workItemData);
    return data;
  },

  update: async (id: string, workItemData: Partial<CreateWorkItemData>) => {
    const { data } = await apiClient.put(`/workitems/${id}`, workItemData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/workitems/${id}`);
    return data;
  },

  restore: async (id: string) => {
    const { data } = await apiClient.post(`/workitems/${id}/restore`);
    return data;
  },

  permanentDelete: async (id: string) => {
    const { data } = await apiClient.delete(`/workitems/${id}/permanent`);
    return data;
  },

  getMyAssigned: async () => {
    const { data } = await apiClient.get('/workitems/my/assigned');
    return data;
  },

  getMyCreated: async () => {
    const { data } = await apiClient.get('/workitems/my/created');
    return data;
  },

  getByStatus: async (status: string) => {
    const { data } = await apiClient.get(`/workitems/status/${status}`);
    return data;
  },

  getOverdue: async () => {
    const { data } = await apiClient.get('/workitems/overdue');
    return data;
  },

  getStats: async (filters?: Record<string, any>) => {
    const { data } = await apiClient.get('/workitems/stats', { params: filters });
    return data;
  },

  getMyStats: async () => {
    const { data } = await apiClient.get('/workitems/stats/my');
    return data;
  },

  getAvailableUsers: async () => {
    const { data } = await apiClient.get('/workitems/users/available');
    return data;
  },

  getAssigneeList: async () => {
    const { data } = await apiClient.get('/workitems/assignees/list');
    return data;
  },

  bulkUpdate: async (ids: string[], updateData: Partial<CreateWorkItemData>) => {
    const { data } = await apiClient.put('/workitems/bulk', { ids, updateData });
    return data;
  },
};
