import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher-dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/teacher-dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          {isSidebarOpen && <span className="font-bold text-xl text-primary">EduVault</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-lg text-gray-800">Welcome Back, {user?.name || 'Teacher'}</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'T'}
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
