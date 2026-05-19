import api from './axios';
export const teamsAPI = {
  getAll:    ()              => api.get('/teams'),
  create:    (data)          => api.post('/teams', data),
  update:    (id, data)      => api.put(`/teams/${id}`, data),
  delete:    (id)            => api.delete(`/teams/${id}`),
  addMember: (teamId, userId, role) =>
    api.post(`/teams/${teamId}/members`, { user_id: userId, role }),
};