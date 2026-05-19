import { useWsStore } from '../../store/wsStore';

export default function Header() {
  const { notifications } = useWsStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ height:54, background:'rgba(5,8,16,.9)', borderBottom:'1px solid rgba(245,184,0,.08)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexDirection:'row-reverse', fontFamily:'Cairo,sans-serif', flexShrink:0 }}>
      <div style={{ fontSize:12, color:'#475569' }}>
        {new Date().toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
      </div>
      {unread > 0 && (
        <div style={{ background:'rgba(245,184,0,.1)', border:'1px solid rgba(245,184,0,.2)', borderRadius:20, padding:'4px 12px', fontSize:12, color:'#f5b800' }}>
          🔔 {unread} إشعار جديد
        </div>
      )}
    </div>
  );
}