import api from './api';

export const taskService = {
  getAllTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },
  
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  getTaskLogs: async (id) => {
    const response = await api.get(`/tasks/${id}/logs`);
    return response.data;
  }
};
