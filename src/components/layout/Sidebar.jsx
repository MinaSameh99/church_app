import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Star, Settings, Trophy, Activity, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWsStore }   from '../../store/wsStore';

const nav = [
  { path:'/dashboard',  label:'لوحة التحكم', Icon:LayoutDashboard },
  { path:'/teams',      label:'الفرق',        Icon:Users           },
  { path:'/points',     label:'النقاط',       Icon:Star            },
  { path:'/metrics',    label:'المعايير',     Icon:Activity        },
  { path:'/achievements',label:'البطولات',   Icon:Trophy          },
  { path:'/settings',   label:'الإعدادات',   Icon:Settings        },
];

export default function Sidebar() {
  const { user, logout }      = useAuthStore();
  const { connected }         = useWsStore();

  return (
    <div style={{ width:220, background:'#050810', borderLeft:'1px solid rgba(245,184,0,.12)', display:'flex', flexDirection:'column', padding:'16px 10px', flexShrink:0, fontFamily:'Cairo,sans-serif' }}>
      <div style={{ textAlign:'center', paddingBottom:16, borderBottom:'1px solid rgba(245,184,0,.08)', marginBottom:14 }}>
        <div style={{ fontSize:30, marginBottom:4 }}>✝️</div>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:9, color:'#f5b800', letterSpacing:2 }}>LIGA CAMPEONES</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:6 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background: connected ? '#22c55e':'#ef4444' }} />
          <span style={{ fontSize:10, color:'#475569' }}>{connected?'متصل مباشر':'غير متصل'}</span>
        </div>
      </div>

      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
        {nav.map(({ path, label, Icon }) => (
          <NavLink key={path} to={path}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10,
              background: isActive ? 'rgba(245,184,0,.1)' : 'transparent',
              color: isActive ? '#f5b800' : '#64748b',
              textDecoration:'none', fontSize:13, fontWeight: isActive ? 600 : 400,
              borderRight:`3px solid ${isActive ? '#f5b800':'transparent'}`,
              flexDirection:'row-reverse', transition:'all .15s',
            })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop:'1px solid rgba(245,184,0,.08)', paddingTop:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'0 8px 12px', flexDirection:'row-reverse' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f5b800,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#07091a', flexShrink:0 }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{user?.fullName}</div>
            <div style={{ fontSize:10, color:'#475569' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={logout}
          style={{ width:'100%', padding:'9px', borderRadius:8, border:'1px solid rgba(239,68,68,.25)', background:'rgba(239,68,68,.07)', color:'#f87171', fontSize:12, cursor:'pointer', fontFamily:'Cairo,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <LogOut size={13} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}