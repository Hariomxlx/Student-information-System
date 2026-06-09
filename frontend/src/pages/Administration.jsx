import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, BookOpen, AlertCircle, CheckCircle, Clock, 
  Trash2, Plus, LogOut, LayoutDashboard, UserCheck, MessageSquare, 
  Settings, RefreshCw, XCircle, Send, Search, UserMinus
} from 'lucide-react';

const Administration = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    grievances: { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 }
  });
  const [users, setUsers] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  
  // Forms state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    enrollmentId: '',
    department: ''
  });
  const [grievanceReply, setGrievanceReply] = useState({
    status: 'Pending',
    adminReply: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const navigate = useNavigate();
  const token = localStorage.getItem('usis_token');
  const adminInfo = JSON.parse(localStorage.getItem('usis_user') || '{}');

  useEffect(() => {
    // Check if token exists and is admin
    if (!token || adminInfo.role !== 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchStats();
    fetchUsers();
    fetchGrievances();
  }, [token, navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchGrievances = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grievances`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error('Failed to fetch grievances', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(`User ${data.name} created successfully.`);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'student',
          enrollmentId: '',
          department: ''
        });
        setShowAddUserModal(false);
        fetchUsers();
        fetchStats();
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess(`User "${name}" has been deleted.`);
        fetchUsers();
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  const handleUpdateGrievance = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/grievances/${selectedGrievance._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(grievanceReply)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Grievance status and reply updated successfully.');
        setSelectedGrievance(null);
        setGrievanceReply({ status: 'Pending', adminReply: '' });
        fetchGrievances();
        fetchStats();
      } else {
        setError(data.message || 'Failed to update grievance');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usis_token');
    localStorage.removeItem('usis_user');
    navigate('/admin');
  };

  const selectGrievanceForReply = (g) => {
    setSelectedGrievance(g);
    setGrievanceReply({
      status: g.status,
      adminReply: g.adminReply || ''
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'In Progress': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-purple-400 bg-purple-500/10 border-purple-500/20'; // Pending
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'In Progress': return <Clock className="h-3.5 w-3.5" />;
      case 'Rejected': return <XCircle className="h-3.5 w-3.5" />;
      default: return <AlertCircle className="h-3.5 w-3.5" />; // Pending
    }
  };

  // Filters users based on search query and role selection
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-purple-500/20 flex flex-col shrink-0">
        <div className="p-6 border-b border-purple-500/20 flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-md leading-tight text-purple-200">USIS Console</h2>
            <p className="text-[10px] text-purple-400/80 font-mono tracking-widest uppercase">ADMIN PANEL</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Users className="h-5 w-5" />
            <span>User Directory</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('grievances')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'grievances' ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Grievances</span>
            {stats.grievances.pending > 0 && (
              <span className="ml-auto bg-purple-500 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
                {stats.grievances.pending}
              </span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-purple-500/20 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center font-mono font-bold text-purple-300">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate text-purple-100">{adminInfo.name}</p>
              <p className="text-xs text-purple-400/80 truncate font-mono">{adminInfo.role.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-xl transition-colors text-xs font-semibold"
          >
            <LogOut className="h-4 w-4" /> Exit Console
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        <header className="h-20 border-b border-purple-500/20 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="capitalize">{activeTab}</span> Panel
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { fetchStats(); fetchUsers(); fetchGrievances(); }}
              className="p-2.5 rounded-xl border border-purple-500/20 text-slate-400 hover:text-purple-300 hover:bg-slate-900 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{success}</span>
            </div>
          )}

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Registered Students', value: stats.students, icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { label: 'Assigned Mentors', value: stats.mentors, icon: UserCheck, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Pending Grievances', value: stats.grievances.pending, icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Resolved Tickets', value: stats.grievances.resolved, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900 border border-purple-500/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl border ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</h3>
                    <p className="text-3xl font-extrabold mt-2 text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-purple-500/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold mb-4 text-purple-200">Grievance Ticket Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 bg-slate-950/60 border border-purple-500/5 rounded-xl text-center">
                      <p className="text-slate-500 text-xs uppercase font-mono">Total Cases</p>
                      <p className="text-3xl font-black text-white mt-1">{stats.grievances.total}</p>
                    </div>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                      <p className="text-amber-400/80 text-xs uppercase font-mono">In Progress</p>
                      <p className="text-3xl font-black text-amber-400 mt-1">{stats.grievances.inProgress}</p>
                    </div>
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
                      <p className="text-red-400/80 text-xs uppercase font-mono">Rejected</p>
                      <p className="text-3xl font-black text-red-400 mt-1">{stats.grievances.rejected}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                      <p className="text-emerald-400/80 text-xs uppercase font-mono">Resolved</p>
                      <p className="text-3xl font-black text-emerald-400 mt-1">{stats.grievances.resolved}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-purple-500/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-purple-200">Database & Security Status</h3>
                    <p className="text-slate-400 text-xs mt-1">Live configuration parameters</p>
                  </div>
                  <div className="space-y-3 mt-6 font-mono text-xs text-slate-300">
                    <div className="flex justify-between py-2 border-b border-purple-500/5">
                      <span className="text-slate-500">Database Engine:</span>
                      <span className="text-purple-300 font-semibold">MongoDB In-Memory</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-500/5">
                      <span className="text-slate-500">Connection State:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        CONNECTED
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-500/5">
                      <span className="text-slate-500">API Port:</span>
                      <span className="text-slate-300">5000</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-500">JWT Gateway:</span>
                      <span className="text-indigo-400 font-semibold">ENABLED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: User Directory */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-purple-500/10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="bg-slate-950 border border-purple-500/10 text-white pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-64 transition-all"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-purple-500/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="mentor">Mentors</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] w-full sm:w-auto justify-center"
                >
                  <Plus className="h-4 w-4" /> Add User
                </button>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-purple-500/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => setShowAddUserModal(false)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-white"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>

                    <h3 className="text-xl font-bold mb-4 text-purple-200 flex items-center gap-2">
                      <Plus className="h-5 w-5 text-purple-500" />
                      Create New Portal User
                    </h3>

                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">User Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Email Address</label>
                          <input
                            type="email"
                            required
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                            placeholder="john@usis.edu"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">Credentials Password</label>
                        <input
                          type="password"
                          required
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                          placeholder="••••••••"
                        />
                      </div>

                      {newUser.role === 'student' ? (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Enrollment ID</label>
                          <input
                            type="text"
                            required
                            value={newUser.enrollmentId}
                            onChange={(e) => setNewUser({ ...newUser, enrollmentId: e.target.value })}
                            className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                            placeholder="STU2026102"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400">Department</label>
                          <input
                            type="text"
                            required
                            value={newUser.department}
                            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                            className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                            placeholder="Mathematics"
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="px-5 py-2.5 rounded-xl border border-purple-500/10 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl transition-all text-sm font-semibold shadow-lg shadow-purple-600/20"
                        >
                          {loading ? 'Creating...' : 'Register User'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-slate-900 border border-purple-500/10 rounded-2xl overflow-hidden shadow-xl">
                {filteredUsers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <UserMinus className="h-12 w-12 mx-auto text-slate-700 mb-3" />
                    <p className="text-base font-bold text-slate-400">No users found</p>
                    <p className="text-sm mt-1">Try broadening your search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-purple-500/10 text-slate-400 text-xs font-mono tracking-wider uppercase">
                          <th className="px-6 py-4">Name / ID</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Key Detail</th>
                          <th className="px-6 py-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/5">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-200">{u.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">#{u._id.substring(18, 24).toUpperCase()}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300 font-mono">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase border ${u.role === 'student' ? 'text-purple-400 bg-purple-500/5 border-purple-500/20' : 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                              {u.role === 'student' ? u.enrollmentId || 'N/A' : u.department || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Remove User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Grievances */}
          {activeTab === 'grievances' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
              <div className={`lg:col-span-2 bg-slate-900 border border-purple-500/10 rounded-2xl shadow-xl overflow-hidden`}>
                <div className="p-6 border-b border-purple-500/10 bg-slate-900/50">
                  <h3 className="text-lg font-bold text-purple-200">Student Grievance Database</h3>
                </div>

                {grievances.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <MessageSquare className="h-12 w-12 mx-auto text-slate-700 mb-3" />
                    <p className="text-base font-bold text-slate-400">Clear queue</p>
                    <p className="text-sm mt-1">No grievances have been submitted.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-purple-500/10 text-slate-400 text-xs font-mono tracking-wider uppercase">
                          <th className="px-6 py-4">Ticket</th>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/5">
                        {grievances.map((g) => (
                          <tr key={g._id} className={`hover:bg-slate-800/30 transition-colors ${selectedGrievance?._id === g._id ? 'bg-purple-950/20' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-200 text-sm truncate max-w-[200px]">{g.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono">#{g._id.substring(18, 24).toUpperCase()}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-slate-300">{g.student?.name || 'Unknown User'}</div>
                              <div className="text-xs text-slate-500 font-mono">{g.student?.enrollmentId || ''}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs px-2 py-0.5 bg-slate-950/60 border border-purple-500/10 text-slate-400 rounded-md font-mono">
                                {g.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono tracking-wider uppercase ${getStatusColor(g.status)}`}>
                                {getStatusIcon(g.status)}
                                {g.status}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => selectGrievanceForReply(g)}
                                className="px-3 py-1.5 bg-purple-950 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-xs font-bold transition-all"
                              >
                                View / Resolve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Side resolution panel */}
              {selectedGrievance ? (
                <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
                    <h3 className="font-bold text-lg text-purple-200">Resolution Board</h3>
                    <button 
                      onClick={() => setSelectedGrievance(null)}
                      className="text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Ticket Details</p>
                      <h4 className="text-md font-bold text-slate-200 mt-1">{selectedGrievance.title}</h4>
                      <p className="text-xs text-purple-400 font-mono mt-0.5">#{selectedGrievance._id.toUpperCase()}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Student Identity</p>
                      <p className="text-sm font-semibold mt-1 text-slate-300">{selectedGrievance.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedGrievance.student?.email || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Grievance Description</p>
                      <div className="p-3.5 bg-slate-950/60 border border-purple-500/5 rounded-xl text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                        {selectedGrievance.description}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateGrievance} className="space-y-4 pt-3 border-t border-purple-500/10">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Ticket Status</label>
                      <select
                        value={grievanceReply.status}
                        onChange={(e) => setGrievanceReply({ ...grievanceReply, status: e.target.value })}
                        className="w-full bg-slate-950 border border-purple-500/15 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Resolution Statement</label>
                      <textarea
                        required
                        value={grievanceReply.adminReply}
                        onChange={(e) => setGrievanceReply({ ...grievanceReply, adminReply: e.target.value })}
                        placeholder="Provide official statement regarding this grievance..."
                        className="w-full bg-slate-950 border border-purple-500/15 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs h-28 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/10 active:scale-[0.98] transition-all"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {loading ? 'Submitting...' : 'Submit Resolution'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-purple-500/10 border-dashed rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-80">
                  <Shield className="h-10 w-10 text-slate-700 mb-3" />
                  <p className="text-xs font-mono">SELECT A TICKET TO RESOLVE</p>
                  <p className="text-[10px] mt-1 text-slate-600">Double click or click 'View / Resolve' from table.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Administration;
