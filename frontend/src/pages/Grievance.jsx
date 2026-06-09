import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Plus, Filter, MessageSquare, XCircle, Send } from 'lucide-react';

const Grievance = () => {
  const [grievances, setGrievances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');
  const token = localStorage.getItem('usis_token');

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grievances`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(data);
      }
    } catch (err) {
      console.error('Failed to fetch grievances', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grievances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const newGrievance = await res.json();
        setGrievances([newGrievance, ...grievances]);
        setShowForm(false);
        setFormData({ title: '', description: '', category: 'Academic' });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit grievance');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'In Progress': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'; // Pending
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />; // Pending
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
              <MessageSquare className="h-7 w-7" />
            </div>
            Grievance Redressal
          </h2>
          <p className="text-slate-400 mt-1">Submit and track your academic or administrative concerns.</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-rose-600/20"
          >
            <Plus className="h-5 w-5" />
            New Grievance
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              File a Grievance
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  placeholder="E.g., Issue with course registration"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                >
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all h-32 resize-none"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-600/50 text-white font-medium rounded-xl transition-all shadow-lg shadow-rose-600/20"
              >
                {loading ? 'Submitting...' : <><Send className="h-4 w-4" /> Submit Grievance</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Grievances</h3>
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        
        {grievances.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-slate-400">No grievances found</p>
            <p className="mt-1">You haven't submitted any grievances yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm">
                  <th className="px-6 py-4 font-medium">Ticket / Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  {user.role === 'admin' && <th className="px-6 py-4 font-medium">Student</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {grievances.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200 mb-1">{g.title}</div>
                      <div className="text-xs text-slate-500 font-mono">#{g._id.substring(18, 24).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600">
                        {g.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(g.status)}`}>
                        {getStatusIcon(g.status)}
                        {g.status}
                      </div>
                    </td>
                    {user.role === 'admin' && (
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {g.student?.name || 'Unknown'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grievance;
