import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
