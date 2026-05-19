import { useEffect, useState } from 'react';
import { useTeamStore }  from '../store/teamStore';
import { usePointStore } from '../store/pointStore';
import { metricsAPI }    from '../api/metrics';
import { pointsAPI }     from '../api/points';
import { toast }         from 'sonner';

export default function Points() {
  const { teams, fetchTeams }   = useTeamStore();
  const { logs, fetchLogs }     = usePointStore();
  const [metrics, setMetrics]   = useState([]);
  const [teamId,  setTeamId]    = useState('');
  const [checked, setChecked]   = useState({});
  const [tab,     setTab]       = useState('assign');
  const [penId,   setPenId]     = useState('');

  const penalties = metrics.filter(m => !m.is_positive);
  const positive  = metrics.filter(m =>  m.is_positive);
  const total     = Object.entries(checked).reduce((s,[id,on]) => on ? s + (metrics.find(m=>m.id==id)?.points||0) : s, 0);

  useEffect(() => {
    fetchTeams();
    fetchLogs();
    metricsAPI.getAll().then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const handleAssign = async () => {
    if (!teamId || total === 0) return;
    const metricIds = Object.entries(checked).filter(([,on])=>on).map(([id])=>Number(id));
    try {
      for (const mid of metricIds) {
        await pointsAPI.add({ team_id: Number(teamId), metric_id: mid });
      }
      toast.success(`تم إضافة النقاط ✅`);
      setChecked({});
      fetchLogs();
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handlePenalty = async () => {
    if (!teamId || !penId) return;
    try {
      await pointsAPI.add({ team_id: Number(teamId), metric_id: Number(penId) });
      toast.success('تم تطبيق العقوبة');
      setPenId('');
      fetchLogs();
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ');
    }
  };

  const team = teams.find(t => t.id == teamId);
  const s = { background:'rgba(0,0,0,.25)', border:'1px solid rgba(255,255,255,.06)', borderRadius:9, padding:'10px 14px', cursor:'pointer', width:'100%', textAlign:'right', fontFamily:'Cairo,sans-serif', fontSize:13 };

  return (
    <div style={{ fontFamily:'Cairo,sans-serif' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Cinzel,serif', fontSize:24, color:'#f5b800' }}>⭐ إدارة النقاط</h1>
        <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>أضف النقاط الأسبوعية وطبّق العقوبات</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:18 }}>
        {/* Team selector */}
        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, padding:16 }}>
          <h3 style={{ color:'#f5b800', fontSize:12, marginBottom:12 }}>اختر الفريق</h3>
          {teams.map(t => (
            <button key={t.id} onClick={() => setTeamId(t.id)}
              style={{ ...s, border:`1px solid ${teamId==t.id ? t.color||'#f5b800' : 'rgba(255,255,255,.06)'}`, background: teamId==t.id ? `${t.color||'#f5b800'}16` : 'transparent', marginBottom:6, display:'flex', alignItems:'center', gap:9, flexDirection:'row-reverse' }}>
              <span style={{ fontSize:18 }}>{t.emoji||'⚡'}</span>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:12, fontWeight:600, color: teamId==t.id ? t.color||'#f5b800' : '#e2e8f0' }}>{t.name_ar||t.name}</div>
                <div style={{ fontSize:10, color:'#475569' }}>⭐ {t.points}</div>
              </div>
            </button>
          ))}
        </div>

        <div>
          {/* Tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[['assign','⭐ إضافة نقاط'],['penalties','⚠️ عقوبات'],['log','📋 السجل']].map(([id,lbl]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ padding:'9px 18px', borderRadius:9, border:`1px solid ${tab===id ? '#f5b800' : 'rgba(255,255,255,.1)'}`, background: tab===id ? 'rgba(245,184,0,.1)' : 'transparent', color: tab===id ? '#f5b800' : '#64748b', fontSize:13, cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>
                {lbl}
              </button>
            ))}
          </div>

          {tab === 'assign' && (
            <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <h3 style={{ color:'#f5b800', fontSize:14 }}>اختر الأنشطة</h3>
                {total > 0 && <span style={{ fontFamily:'Cinzel,serif', fontSize:18, color:'#22c55e' }}>+{total}</span>}
              </div>
              {positive.length === 0 ? (
                <p style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'30px 0' }}>لا توجد معايير — أضفها من صفحة المعايير</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                  {positive.map(m => (
                    <label key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:9, border:`1px solid ${checked[m.id] ? '#f5b800' : 'rgba(255,255,255,.06)'}`, background: checked[m.id] ? 'rgba(245,184,0,.08)' : 'rgba(0,0,0,.2)', cursor:'pointer', flexDirection:'row-reverse' }}>
                      <input type="checkbox" checked={!!checked[m.id]} onChange={e => setChecked(p=>({...p,[m.id]:e.target.checked}))} style={{ display:'none' }} />
                      <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${checked[m.id] ? '#f5b800' : '#475569'}`, background: checked[m.id] ? '#f5b800' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {checked[m.id] && <span style={{ color:'#07091a', fontSize:11, fontWeight:700 }}>✓</span>}
                      </div>
                      <div style={{ flex:1, display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontFamily:'Cinzel,serif', fontSize:13, color: checked[m.id] ? '#f5b800' : '#64748b' }}>+{m.points}</span>
                        <span style={{ color: checked[m.id] ? '#e2e8f0' : '#94a3b8', fontSize:13 }}>{m.title_ar || m.title}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <button onClick={handleAssign} disabled={!teamId || total===0}
                style={{ background: (!teamId||total===0) ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg,#f5b800,#d97706)', color: (!teamId||total===0) ? '#475569' : '#07091a', border:'none', borderRadius:10, padding:'12px 20px', fontSize:14, fontWeight:700, cursor: (!teamId||total===0) ? 'not-allowed':'pointer', width:'100%', fontFamily:'Cairo,sans-serif' }}>
                {!teamId ? 'اختر فريقاً أولاً' : total===0 ? 'اختر نشاطاً واحداً على الأقل' : `إضافة +${total} نقطة → ${team?.name_ar||team?.name||''}`}
              </button>
            </div>
          )}

          {tab === 'penalties' && (
            <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, padding:20 }}>
              <h3 style={{ color:'#ef4444', fontSize:14, marginBottom:16 }}>اختر العقوبة</h3>
              {penalties.length === 0 ? (
                <p style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'30px 0' }}>لا توجد عقوبات — أضفها من صفحة المعايير</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                  {penalties.map(p => (
                    <button key={p.id} onClick={() => setPenId(p.id)}
                      style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderRadius:9, border:`1px solid ${penId==p.id ? '#ef4444' : 'rgba(255,255,255,.06)'}`, background: penId==p.id ? 'rgba(239,68,68,.1)' : 'rgba(0,0,0,.2)', cursor:'pointer', flexDirection:'row-reverse', fontFamily:'Cairo,sans-serif' }}>
                      <span style={{ color: penId==p.id ? '#f87171' : '#e2e8f0', fontSize:13 }}>{p.title_ar||p.title}</span>
                      <span style={{ color:'#ef4444', fontFamily:'Cinzel,serif', fontSize:13 }}>{p.points}</span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={handlePenalty} disabled={!teamId||!penId}
                style={{ background: (!teamId||!penId) ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: (!teamId||!penId) ? '#475569' : 'white', border:'none', borderRadius:10, padding:'12px 20px', fontSize:14, fontWeight:700, cursor: (!teamId||!penId)?'not-allowed':'pointer', width:'100%', fontFamily:'Cairo,sans-serif' }}>
                {!teamId ? 'اختر فريقاً' : !penId ? 'اختر عقوبة' : 'تطبيق العقوبة ⚠️'}
              </button>
            </div>
          )}

          {tab === 'log' && (
            <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.15)', borderRadius:14, overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                <h3 style={{ color:'#f5b800', fontSize:14 }}>📋 سجل النشاط الأخير</h3>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'rgba(245,184,0,.05)' }}>
                  {['الفريق','النقاط','السبب','التوقيت'].map(h => (
                    <th key={h} style={{ padding:'8px 16px', textAlign:'right', fontSize:10, color:'#475569', fontWeight:600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {logs.map((l,i) => (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                      <td style={{ padding:'10px 16px', fontSize:12, color:'#e2e8f0' }}>{teams.find(t=>t.id===l.team_id)?.name || l.team_id}</td>
                      <td style={{ padding:'10px 16px', fontSize:13, fontWeight:700, color: l.points>0?'#22c55e':'#ef4444', fontFamily:'Cinzel,serif' }}>{l.points>0?'+':''}{l.points}</td>
                      <td style={{ padding:'10px 16px', fontSize:12, color:'#64748b' }}>{l.reason || '—'}</td>
                      <td style={{ padding:'10px 16px', fontSize:11, color:'#334155' }}>{new Date(l.performed_at).toLocaleString('ar')}</td>
                    </tr>
                  ))}
                  {logs.length===0 && <tr><td colSpan={4} style={{ textAlign:'center', padding:30, color:'#334155', fontSize:13 }}>لا يوجد سجل بعد</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}