import { create } from 'zustand';

export const useWsStore = create((set, get) => ({
  socket: null,
  connected: false,
  notifications: [],
  activityFeed: [],

  connect: (token) => {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'}?token=${token}&room=global`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      set({ connected: true });
      console.log('🟢 WebSocket connected');
    };

    socket.onclose = () => {
      set({ connected: false, socket: null });
      setTimeout(() => {
        const t = localStorage.getItem('access_token');
        if (t) get().connect(t);
      }, 3000);
    };

    socket.onerror = () => set({ connected: false });

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        get().handleMessage(msg);
      } catch {}
    };

    const ping = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN)
        socket.send(JSON.stringify({ type: 'PING' }));
    }, 30000);

    set({ socket, ping });
  },

  disconnect: () => {
    const { socket, ping } = get();
    if (ping) clearInterval(ping);
    if (socket) socket.close();
    set({ socket: null, connected: false });
  },

  handleMessage: (msg) => {
    switch (msg.type) {
      case 'POINTS_UPDATE':
        window.__wsPointsUpdate?.(msg.payload);
        set(state => ({ activityFeed: [msg.payload, ...state.activityFeed].slice(0, 50) }));
        break;
      case 'RANKING_UPDATE':
        window.__wsRankingUpdate?.(msg.payload.rankings);
        break;
      case 'NOTIFICATION':
        set(state => ({ notifications: [msg.payload, ...state.notifications].slice(0, 20) }));
        break;
      default: break;
    }
  },
}));