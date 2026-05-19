import { useEffect } from 'react';
import { useTeamStore } from '../store/teamStore';
import { useWsStore }   from '../store/wsStore';

export default function Dashboard() {
  const { teams, fetchTeams, loading } = useTeamStore();
  const { activityFeed, connected }   = useWsStore();

  useEffect(() => { fetchTeams(); }, []);

  const sorted  = [...teams].sort((a, b) => b.points - a.points);
  const maxPts  = sorted[0]?.points || 1;
  const medals  = ['🥇','🥈','🥉'];

  return (
    <div style={{ fontFamily:'Cairo,sans-serif' }} className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Cinzel,serif', fontSize:26, fontWeight:900, color:'#f5b800' }}>🏆 لوحة التحكم</h1>
        <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>نظرة عامة على المنافسة</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'الفرق النشطة',  val: teams.length,                                    icon:'⚔️', color:'#f5b800' },
          { label:'إجمالي النقاط', val: teams.reduce((s,t)=>s+t.points,0).toLocaleString(), icon:'⭐', color:'#22c55e' },
          { label:'كروس كوينز',   val: teams.reduce((s,t)=>s+(t.coins||0),0).toLocaleString(), icon:'💰', color:'#a855f7' },
          { label:'حالة الاتصال', val: connected ? 'متصل 🟢' : 'غير متصل 🔴',          icon:'📡', color: connected ? '#22c55e' : '#ef4444' },
        ].map((s,i) => (
          <div key={i} style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, padding:'18px 20px' }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:18 }}>
        {/* Rankings table */}
        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <h2 style={{ color:'#f5b800', fontSize:14, fontWeight:700 }}>📊 جدول الترتيب</h2>
          </div>
          {loading ? (
            <div style={{ padding:40, textAlign:'center', color:'#475569' }}>⏳ جارٍ التحميل...</div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(245,184,0,.06)' }}>
                  {['#','الفريق','النقاط','الكوينز','التقدم'].map(h => (
                    <th key={h} style={{ padding:'9px 16px', textAlign: h==='الفريق' ? 'right':'center', fontSize:10, color:'#475569', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom:'1px solid rgba(255,255,255,.04)', background: i===0 ? 'rgba(245,184,0,.03)' : 'transparent' }}>
                    <td style={{ padding:'12px 16px', textAlign:'center', fontSize:16 }}>
                      {i < 3 ? medals[i] : <span style={{ color:'#475569', fontSize:12 }}>{i+1}</span>}
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexDirection:'row-reverse' }}>
                        <span style={{ fontSize:20 }}>{t.emoji || '⚡'}</span>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:13, fontWeight:600, color: i===0 ? t.color || '#f5b800' : '#e2e8f0' }}>{t.name}</div>
                          <div style={{ fontSize:10, color:'#475569' }}>القائد: {t.captain || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', textAlign:'center' }}>
                      <span style={{ fontFamily:'Cinzel,serif', fontSize:15, fontWeight:700, color: t.color || '#f5b800' }}>{t.points}</span>
                    </td>
                    <td style={{ padding:'12px 16px', textAlign:'center', color:'#a855f7', fontSize:12 }}>💰 {t.coins || 0}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ height:5, background:'rgba(255,255,255,.07)', borderRadius:3 }}>
                        <div style={{ height:'100%', width:`${(t.points/maxPts)*100}%`, background: t.color || '#f5b800', borderRadius:3, transition:'width .5s ease' }} />
                      </div>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:40, color:'#475569', fontSize:13 }}>لا توجد فرق بعد — أضف فريقاً من صفحة الفرق</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Live feed */}
        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, padding:20 }}>
          <h3 style={{ color:'#f5b800', fontSize:13, fontWeight:700, marginBottom:14 }}>
            📡 النشاط المباشر {connected && <span style={{ fontSize:10, color:'#22c55e' }}>● مباشر</span>}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {activityFeed.slice(0,8).map((a,i) => (
              <div key={i} style={{ display:'flex', gap:10, flexDirection:'row-reverse', padding:'8px 10px', background:'rgba(0,0,0,.2)', borderRadius:8, border:'1px solid rgba(255,255,255,.04)' }}>
                <div style={{ flex:1, textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'#e2e8f0' }}>{a.team_name}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{a.reason || 'تحديث نقاط'}</div>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color: a.points_added > 0 ? '#22c55e' : '#ef4444', flexShrink:0 }}>
                  {a.points_added > 0 ? '+' : ''}{a.points_added}
                </span>
              </div>
            ))}
            {activityFeed.length === 0 && (
              <div style={{ textAlign:'center', color:'#334155', fontSize:12, padding:'30px 0' }}>
                في انتظار التحديثات المباشرة...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}