import { create } from 'zustand';
import { teamsAPI } from '../api/teams';

export const useTeamStore = create((set, get) => ({
  teams: [],
  loading: false,

  fetchTeams: async () => {
    set({ loading: true });
    try {
      const { data } = await teamsAPI.getAll();
      set({ teams: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createTeam: async (teamData) => {
    await teamsAPI.create(teamData);
    await get().fetchTeams();
  },

  updateTeam: async (id, teamData) => {
    await teamsAPI.update(id, teamData);
    await get().fetchTeams();
  },

  deleteTeam: async (id) => {
    await teamsAPI.delete(id);
    set(state => ({ teams: state.teams.filter(t => t.id !== id) }));
  },

  updateTeamPoints: (teamId, newPoints) => {
    set(state => ({
      teams: state.teams
        .map(t => t.id === teamId ? { ...t, points: newPoints } : t)
        .sort((a, b) => b.points - a.points),
    }));
  },

  updateRankingsFromWS: (rankings) => {
    set(state => ({
      teams: state.teams
        .map(team => {
          const updated = rankings.find(r => r.team_id === team.id);
          return updated ? { ...team, points: updated.points, rank: updated.rank } : team;
        })
        .sort((a, b) => b.points - a.points),
    }));
  },
}));