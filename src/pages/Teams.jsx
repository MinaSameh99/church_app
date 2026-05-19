import { useEffect, useState } from 'react';
import { useTeamStore } from '../store/teamStore';
import { toast } from 'sonner';

export default function Teams() {
  const { teams, fetchTeams, createTeam, deleteTeam, loading } = useTeamStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', name_ar:'', emoji:'⚡', color:'#f5b800', slogan:'', bible_verse:'' });

  useEffect(() => { fetchTeams(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTeam(form);
      toast.success('تم إنشاء الفريق ✅');
      setShowForm(false);
      setForm({ name:'', name_ar:'', emoji:'⚡', color:'#f5b800', slogan:'', bible_verse:'' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`حذف فريق "${name}"؟`)) return;
    await deleteTeam(id);
    toast.success('تم الحذف');
  };

  const sorted = [...teams].sort((a,b) => b.points - a.points);
  const medals = ['🥇','🥈','🥉'];

  const inputStyle = { width:'100%', background:'rgba(0,0,0,.3)', border:'1px solid rgba(245,184,0,.2)', color:'#e2e8f0', padding:'10px 12px', borderRadius:8, fontSize:13, outline:'none', fontFamily:'Cairo,sans-serif' };

  return (
    <div style={{ fontFamily:'Cairo,sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexDirection:'row-reverse' }}>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background:'linear-gradient(135deg,#f5b800,#d97706)', color:'#07091a', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {showForm ? '✕ إلغاء' : '+ فريق جديد'}
        </button>
        <h1 style={{ fontFamily:'Cinzel,serif', fontSize:24, color:'#f5b800' }}>⚔️ الفرق</h1>
      </div>

      {showForm && (
        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.25)', borderRadius:14, padding:24, marginBottom:24 }}>
          <h3 style={{ color:'#f5b800', marginBottom:18, fontSize:15 }}>إنشاء فريق جديد</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              {[['name','الاسم (إنجليزي)'],['name_ar','الاسم (عربي)'],['emoji','الإيموجي'],['slogan','شعار الفريق'],['bible_verse','الآية الكتابية']].map(([f,lbl]) => (
                <div key={f}>
                  <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>{lbl}</label>
                  <input value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))} style={inputStyle} placeholder={lbl} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>اللون</label>
                <input type="color" value={form.color} onChange={e => setForm(p=>({...p,color:e.target.value}))} style={{ ...inputStyle, padding:4, height:42, cursor:'pointer' }} />
              </div>
            </div>
            <button type="submit" style={{ background:'linear-gradient(135deg,#f5b800,#d97706)', color:'#07091a', border:'none', borderRadius:9, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              إنشاء الفريق ✝️
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:'center', color:'#475569', padding:60 }}>⏳ جارٍ التحميل...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {sorted.map((t, i) => (
            <div key={t.id} style={{ background:'rgba(13,21,38,.95)', border:`1px solid ${t.color || '#f5b800'}30`, borderRadius:16, padding:22, position:'relative', transition:'transform .2s', cursor:'default' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              {i < 3 && <div style={{ position:'absolute', top:14, left:14, fontSize:18 }}>{medals[i]}</div>}
              <div style={{ fontSize:42, marginBottom:10 }}>{t.emoji || '⚡'}</div>
              <h3 style={{ fontSize:15, fontWeight:700, color: t.color || '#f5b800', marginBottom:4 }}>{t.name_ar || t.name}</h3>
              {t.slogan && <p style={{ fontSize:11, color:'#64748b', fontStyle:'italic', marginBottom:8 }}>"{t.slogan}"</p>}
              {t.bible_verse && <p style={{ fontSize:10, color:'#475569', marginBottom:12 }}>📖 {t.bible_verse}</p>}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,.06)' }}>
                <span style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color: t.color || '#f5b800' }}>{t.points} نقطة</span>
                <button onClick={() => handleDelete(t.id, t.name)}
                  style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', color:'#f87171', borderRadius:7, padding:'5px 10px', fontSize:11, cursor:'pointer' }}>
                  حذف
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#334155', padding:60, fontSize:14 }}>
              لا توجد فرق بعد — أضف أول فريق 🏆
            </div>
          )}
        </div>
      )}
    </div>
  );
}