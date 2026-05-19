import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div style={{ display:'flex', height:'100vh', background:'#07091a', color:'#e2e8f0', overflow:'hidden', direction:'rtl' }}>
      <Toaster position="top-left" richColors />
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Header />
        <main style={{ flex:1, overflowY:'auto', padding:24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}