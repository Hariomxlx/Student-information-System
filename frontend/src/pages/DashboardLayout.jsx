import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Home, Users, BookOpen, Calendar, MessageSquare, Bell, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('usis_token');
    localStorage.removeItem('usis_user');
    navigate('/login');
  };

  if (!user.token) {
    navigate('/login');
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: BookOpen, label: 'Academics', path: '/dashboard/academics' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/chat' },
  ];

  if (user.role === 'admin') {
    navItems.push({ icon: Users, label: 'Users', path: '/dashboard/users' });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="font-bold text-xl">H</span>
          </div>
          <div>
            <h2 className="font-bold text-md leading-tight">Hariom & Himal Portol</h2>
            <p className="text-xs text-slate-400 capitalize">{user.role} Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button key={idx} onClick={() => navigate(item.path)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors font-medium">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 border-2 border-slate-800 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
