import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#07091a' }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-bounce">✝️</div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#f5b800', fontSize:28, letterSpacing:4 }}>
            دوري الأبطال
          </h1>
          <p style={{ color:'#64748b', fontSize:13, marginTop:6 }}>منصة مسابقات الكنيسة</p>
        </div>

        <div style={{ background:'rgba(13,21,38,.95)', border:'1px solid rgba(245,184,0,.2)', borderRadius:18, padding:36 }}>
          <h2 style={{ color:'#f5b800', fontFamily:'Cairo,sans-serif', fontSize:18, fontWeight:700, textAlign:'center', marginBottom:24 }}>
            تسجيل الدخول
          </h2>

          {error && (
            <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', marginBottom:14, color:'#f87171', fontSize:13 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ color:'#94a3b8', fontSize:12, display:'block', marginBottom:6 }}>البريد الإلكتروني</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@church.com"
                style={{ width:'100%', background:'rgba(0,0,0,.3)', border:'1px solid rgba(245,184,0,.2)', color:'#e2e8f0', padding:'11px 13px', borderRadius:9, fontSize:13, outline:'none', fontFamily:'Cairo,sans-serif' }}
              />
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:12, display:'block', marginBottom:6 }}>كلمة المرور</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width:'100%', background:'rgba(0,0,0,.3)', border:'1px solid rgba(245,184,0,.2)', color:'#e2e8f0', padding:'11px 13px', borderRadius:9, fontSize:13, outline:'none', fontFamily:'Cairo,sans-serif' }}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ background: loading ? 'rgba(255,255,255,.08)' : 'linear-gradient(135deg,#f5b800,#d97706)', color: loading ? '#64748b' : '#07091a', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Cairo,sans-serif', marginTop:6 }}
            >
              {loading ? '⏳ جارٍ الدخول...' : 'دخول ✝️'}
            </button>
          </form>

          <p style={{ textAlign:'center', color:'#334155', fontSize:11, marginTop:20, fontStyle:'italic' }}>
            "كل شيء أستطيعكل شئ في المسيح الذي يقويني" · في 4:13
          </p>
        </div>
      </div>
    </div>
  );
}