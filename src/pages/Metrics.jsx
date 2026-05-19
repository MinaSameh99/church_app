import { useEffect, useState } from 'react';
import { metricsAPI } from '../api/metrics';
import { toast } from 'sonner';

export default function Metrics() {
  const [metrics, setMetrics] = useState([]);
  const [form, setForm]       = useState({ title:'', title_ar:'', points:10, is_positive:true, is_repeatable:true, description:'' });
  const [showForm, setShowForm] = useState(false);

  const load = () => metricsAPI.getAll(false).then(r => setMetrics(r.data)).catch(()=>{});
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await metricsAPI.create({ ...form, points: Number(form.points) });
      toast.success('تم إنشاء المعيار ✅');
      setShowForm(false);
      setForm({ title:'', title_ar:'', points:10, is_positive:true, is_repeatable:true, description:'' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ');
    }
  };

  const toggleActive = async (m) => {
    await metricsAPI.update(m.id, { is_active: !m.is_active });
    load();
  };

  const inp = { background:'rgba(0,0,0,.3)', border:'1px solid rgba(245,184,0,.2)', color:'#e2e8f0', padding:'10px 12px', borderRadius:8, fontSize:13, outline:'none', fontFamily:'Cairo,sans-serif', width:'100%' };

  return (
    <div style={{ fontFamily:'Cairo,sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexDirection:'row-reverse' }}>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background:'linear-gradient(135deg,#f5b800,#d97706)', color:'#07091a', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {showForm ? '✕ إلغاء' : '+ معيار جديد'}
        </button>
        <div>
          <h1 style={{ fontFamily:'Cinzel,serif', fontSize:24, color:'#f5b800' }}>⚙️ المعايير الديناميكية</h1>
          <p style={{ color:'#64748b', fontSize:13, marginTop:4 }}>أنشئ قواعد النقاط والعقوبات بحرية كاملة</p>
        </div>
      </div>

      {showForm && (
        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.25)', borderRadius:14, padding:24, marginBottom:24 }}>
          <h3 style={{ color:'#f5b800', marginBottom:18 }}>إنشاء معيار جديد</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>العنوان (إنجليزي)</label>
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={inp} required placeholder="Attend Church" />
              </div>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>العنوان (عربي)</label>
                <input value={form.title_ar} onChange={e=>setForm(p=>({...p,title_ar:e.target.value}))} style={inp} placeholder="حضور القداس" />
              </div>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>النقاط</label>
                <input type="number" value={form.points} onChange={e=>setForm(p=>({...p,points:e.target.value}))} style={inp} required min={1} />
              </div>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>النوع</label>
                <select value={form.is_positive} onChange={e=>setForm(p=>({...p,is_positive:e.target.value==='true'}))} style={inp}>
                  <option value="true">✅ مكافأة (إضافة نقاط)</option>
                  <option value="false">⚠️ عقوبة (خصم نقاط)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>قابل للتكرار؟</label>
                <select value={form.is_repeatable} onChange={e=>setForm(p=>({...p,is_repeatable:e.target.value==='true'}))} style={inp}>
                  <option value="true">نعم — يمكن تكراره</option>
                  <option value="false">لا — مرة واحدة فقط</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:4 }}>الوصف (اختياري)</label>
                <input value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={inp} placeholder="وصف اختياري..." />
              </div>
            </div>
            <button type="submit"
              style={{ background:'linear-gradient(135deg,#f5b800,#d97706)', color:'#07091a', border:'none', borderRadius:9, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              إنشاء المعيار
            </button>
          </form>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {metrics.map(m => (
          <div key={m.id} style={{ background:'rgba(13,21,38,.95)', border:`1px solid ${m.is_positive ? 'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`, borderRadius:12, padding:18, opacity: m.is_active ? 1 : 0.5 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ fontSize:10, padding:'3px 10px', borderRadius:20, background: m.is_positive ? 'rgba(34,197,94,.1)':'rgba(239,68,68,.1)', color: m.is_positive ? '#22c55e':'#ef4444', border:`1px solid ${m.is_positive ? 'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}` }}>
                  {m.is_positive ? 'مكافأة' : 'عقوبة'}
                </span>
                {!m.is_active && <span style={{ fontSize:10, padding:'3px 10px', borderRadius:20, background:'rgba(100,116,139,.1)', color:'#64748b', border:'1px solid rgba(100,116,139,.2)' }}>معطّل</span>}
              </div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color: m.is_positive ? '#22c55e':'#ef4444' }}>
                {m.is_positive?'+':''}{m.points}
              </div>
            </div>
            <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:14, marginBottom:4 }}>{m.title_ar || m.title}</div>
            {m.description && <div style={{ fontSize:11, color:'#64748b', marginBottom:10 }}>{m.description}</div>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.05)' }}>
              <span style={{ fontSize:10, color:'#475569' }}>{m.is_repeatable ? '🔁 متكرر' : '1️⃣ مرة واحدة'}</span>
              <button onClick={() => toggleActive(m)}
                style={{ background: m.is_active ? 'rgba(239,68,68,.1)':'rgba(34,197,94,.1)', border:`1px solid ${m.is_active ? 'rgba(239,68,68,.2)':'rgba(34,197,94,.2)'}`, color: m.is_active ? '#f87171':'#22c55e', borderRadius:7, padding:'4px 12px', fontSize:11, cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>
                {m.is_active ? 'تعطيل' : 'تفعيل'}
              </button>
            </div>
          </div>
        ))}
        {metrics.length===0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#334155', padding:60, fontSize:14 }}>
            لا توجد معايير بعد — أنشئ أول معيار للنقاط 📋
          </div>
        )}
      </div>
    </div>
  );
}