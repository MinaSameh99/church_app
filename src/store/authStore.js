import { create } from 'zustand';
import { authAPI } from '../api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem('access_token',  data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      set({
        user: { id: data.user_id, role: data.user_role, fullName: data.full_name },
        isAuthenticated: true, loading: false,
      });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.detail || 'فشل تسجيل الدخول', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const { data } = await authAPI.getMe();
      set({
        user: { id: data.id, role: data.role, fullName: data.full_name, email: data.email },
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
}));