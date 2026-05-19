import api from './axios';
export const metricsAPI = {
  getAll:  (activeOnly=true) => api.get('/metrics', { params: { active_only: activeOnly } }),
  create:  (data)            => api.post('/metrics', data),
  update:  (id, data)        => api.put(`/metrics/${id}`, data),
  delete:  (id)              => api.delete(`/metrics/${id}`),
};