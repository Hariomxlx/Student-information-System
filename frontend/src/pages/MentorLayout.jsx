import React from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import { 
  Home, BookOpen, Calendar, MessageSquare, Bell, LogOut, 
  CheckSquare, Award, MessageCircle, AlertCircle
} from 'lucide-react';

const MentorLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('usis_token');
    localStorage.removeItem('usis_user');
    navigate('/login');
  };

  if (!user.token || user.role !== 'mentor') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { icon: Home, label: 'Overview', path: '/mentor' },
    { icon: CheckSquare, label: 'Mark Attendance', path: '/mentor/attendance' },
    { icon: Award, label: 'Enter Grades', path: '/mentor/grades' },
    { icon: AlertCircle, label: 'Grievances', path: '/mentor/grievances' },
    { icon: MessageSquare, label: 'Messages', path: '/mentor/chat' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <span className="font-bold text-xl">M</span>
          </div>
          <div>
            <h2 className="font-bold text-md leading-tight text-indigo-200">Mentor Portal</h2>
            <p className="text-xs text-slate-400 capitalize">{user.name?.split(' ')[0]} Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(item.path)} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
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
          <h1 className="text-2xl font-semibold text-indigo-100">Advisor Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono bg-indigo-500/10 border border-indigo-500/25 px-3 py-1.5 rounded-lg text-indigo-400 font-bold uppercase tracking-wider">
              {user.department || 'Academic Affairs'}
            </div>
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

export default MentorLayout;
