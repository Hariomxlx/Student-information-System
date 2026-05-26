import React from 'react';
import { Users, BookOpen, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', attendance: 95, performance: 80 },
  { name: 'Week 2', attendance: 88, performance: 82 },
  { name: 'Week 3', attendance: 92, performance: 85 },
  { name: 'Week 4', attendance: 85, performance: 81 },
  { name: 'Week 5', attendance: 78, performance: 79 },
  { name: 'Week 6', attendance: 72, performance: 75 },
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user.name?.split(' ')[0]}</h2>
          <p className="text-slate-400 mt-1">Here is what's happening with your academics today.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Attendance', value: '85%', trend: '-2%', icon: Users, color: 'text-blue-500' },
          { label: 'Current GPA', value: '3.8', trend: '+0.1', icon: BookOpen, color: 'text-emerald-500' },
          { label: 'Pending Assignments', value: '4', trend: 'Due soon', icon: Activity, color: 'text-amber-500' },
          { label: 'Unread Alerts', value: '2', trend: 'Action needed', icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-900/50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Attendance & Performance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttendance)" />
                <Area type="monotone" dataKey="performance" stroke="#10b981" fillOpacity={1} fill="url(#colorPerformance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications / Alerts */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="text-red-500 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="text-red-500 font-medium text-sm">Low Attendance Warning</h4>
                  <p className="text-slate-300 text-xs mt-1">Your attendance in Data Structures dropped to 72%.</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <div className="flex gap-3">
                <BookOpen className="text-blue-500 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="text-blue-500 font-medium text-sm">New Assignment</h4>
                  <p className="text-slate-300 text-xs mt-1">Database Systems assignment due in 2 days.</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <div className="flex gap-3">
                <Users className="text-slate-400 h-5 w-5 shrink-0" />
                <div>
                  <h4 className="text-slate-200 font-medium text-sm">Mentor Message</h4>
                  <p className="text-slate-400 text-xs mt-1">Dr. Smith sent you a message regarding your project.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
