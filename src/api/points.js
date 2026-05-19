import api from './axios';
export const pointsAPI = {
  add:     (data)                    => api.post('/points/add', data),
  getLogs: (teamId = null, limit=50) =>
    api.get('/points/logs', { params: { team_id: teamId, limit } }),
};