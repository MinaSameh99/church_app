import api from './axios';
export const authAPI = {
  login:   (email, password) => api.post('/auth/login', { email, password }),
  register:(data)            => api.post('/auth/register', data),
  getMe:   ()                => api.get('/auth/me'),
  refresh: (refresh_token)   => api.post('/auth/refresh', { refresh_token }),
};