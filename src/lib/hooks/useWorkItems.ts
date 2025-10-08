import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workItemsApi } from '../api/workItems';
import { CreateWorkItemData } from '@/types';
import toast from 'react-hot-toast';

export const useWorkItems = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['workItems', filters],
    queryFn: () => workItemsApi.getAll(filters),
  });
};

export const useWorkItem = (id: string) => {
  return useQuery({
    queryKey: ['workItem', id],
    queryFn: () => workItemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateWorkItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkItemData) => workItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workItems'] });
      queryClient.invalidateQueries({ queryKey: ['workItemStats'] });
      toast.success('Work item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create work item');
    },
  });
};

export const useUpdateWorkItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWorkItemData> }) =>
      workItemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workItems'] });
      queryClient.invalidateQueries({ queryKey: ['workItem'] });
      queryClient.invalidateQueries({ queryKey: ['workItemStats'] });
      toast.success('Work item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update work item');
    },
  });
};

export const useDeleteWorkItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workItems'] });
      queryClient.invalidateQueries({ queryKey: ['workItemStats'] });
      toast.success('Work item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete work item');
    },
  });
};

export const useWorkItemStats = () => {
  return useQuery({
    queryKey: ['workItemStats'],
    queryFn: () => workItemsApi.getMyStats(),
  });
};

export const useAvailableUsers = () => {
  return useQuery({
    queryKey: ['availableUsers'],
    queryFn: () => workItemsApi.getAvailableUsers(),
  });
};

export const useMyAssignedWorkItems = () => {
  return useQuery({
    queryKey: ['myAssignedWorkItems'],
    queryFn: () => workItemsApi.getMyAssigned(),
  });
};

export const useMyCreatedWorkItems = () => {
  return useQuery({
    queryKey: ['myCreatedWorkItems'],
    queryFn: () => workItemsApi.getMyCreated(),
  });
};
