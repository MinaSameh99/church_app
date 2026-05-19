import { useEffect } from 'react';
import { useWsStore }  from '../store/wsStore';
import { useTeamStore } from '../store/teamStore';

export function useWebSocket() {
  const { connect, disconnect, connected } = useWsStore();
  const { updateTeamPoints, updateRankingsFromWS } = useTeamStore();

  useEffect(() => {
    window.__wsPointsUpdate  = (p) => updateTeamPoints(p.team_id, p.new_total);
    window.__wsRankingUpdate = (r) => updateRankingsFromWS(r);

    const token = localStorage.getItem('access_token');
    if (token) connect(token);

    return () => {
      disconnect();
      delete window.__wsPointsUpdate;
      delete window.__wsRankingUpdate;
    };
  }, []);

  return { connected };
}