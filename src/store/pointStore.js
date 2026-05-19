import { create } from 'zustand';
import { pointsAPI } from '../api/points';

export const usePointStore = create((set) => ({
  logs: [],
  loading: false,

  fetchLogs: async (teamId = null) => {
    set({ loading: true });
    try {
      const { data } = await pointsAPI.getLogs(teamId);
      set({ logs: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addLog: (entry) => {
    set(state => ({ logs: [entry, ...state.logs].slice(0, 50) }));
  },
}));