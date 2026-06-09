import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Clock, CheckCircle, AlertCircle, XCircle, 
  Send, HelpCircle, ShieldAlert 
} from 'lucide-react';

const MentorGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [replyData, setReplyData] = useState({
    status: 'Pending',
    adminReply: ''
  });

  const token = localStorage.getItem('usis_token');

  useEffect(() => {
    fetchGrievances();
  }, []);

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
      console.error('Error fetching grievances:', err);
    }
  };

  const handleUpdateGrievance = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In the backend routes, mentors update grievances using PUT /api/grievances/:id/status
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grievances/${selectedGrievance._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: replyData.status,
          adminReply: replyData.adminReply // the field is adminReply in the model schema
        })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Grievance response registered successfully.');
        setSelectedGrievance(null);
        setReplyData({ status: 'Pending', adminReply: '' });
        fetchGrievances();
      } else {
        setError(data.message || 'Failed to update grievance status');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'In Progress': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'; // Pending
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

  const selectGrievanceForReply = (g) => {
    setSelectedGrievance(g);
    setReplyData({
      status: g.status,
      adminReply: g.adminReply || ''
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main grievances list */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" />
              Assigned Student Grievances
            </h3>
          </div>

          {grievances.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <MessageSquare className="h-12 w-12 mx-auto text-slate-700 mb-3" />
              <p className="text-base font-bold text-slate-400">Queue is clear</p>
              <p className="text-sm mt-1">No grievances submitted yet by students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/40 border-b border-slate-700 text-slate-400 text-xs font-mono tracking-wider uppercase">
                    <th className="px-6 py-3">Concern / Ticket</th>
                    <th className="px-6 py-3">Student Info</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {grievances.map((g) => (
                    <tr key={g._id} className={`hover:bg-slate-750/30 transition-colors ${selectedGrievance?._id === g._id ? 'bg-indigo-950/20' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200 text-sm truncate max-w-[200px]">{g.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">#{g._id.substring(18, 24).toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-300">{g.student?.name || 'Unknown User'}</div>
                        <div className="text-xs text-slate-500 font-mono">{g.student?.enrollmentId || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 rounded-md font-mono">
                          {g.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono tracking-wider uppercase ${getStatusColor(g.status)}`}>
                          {getStatusIcon(g.status)}
                          {g.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => selectGrievanceForReply(g)}
                          className="px-3 py-1.5 bg-indigo-950 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold transition-all"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Panel */}
        {selectedGrievance ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-right-4 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-indigo-300">Resolution Console</h3>
              <button 
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Grievance Ticket</p>
                <h4 className="text-sm font-bold text-slate-200 mt-1">{selectedGrievance.title}</h4>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Student Profile</p>
                <p className="text-xs text-slate-300 font-semibold mt-1">{selectedGrievance.student?.name || 'Unknown'}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedGrievance.student?.email || 'N/A'}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold">Description</p>
                <div className="p-3.5 bg-slate-900 border border-slate-750 rounded-xl text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedGrievance.description}
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateGrievance} className="space-y-4 pt-3 border-t border-slate-700">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Update Status</label>
                <select
                  value={replyData.status}
                  onChange={(e) => setReplyData({ ...replyData, status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Official Response Statement</label>
                <textarea
                  required
                  value={replyData.adminReply}
                  onChange={(e) => setReplyData({ ...replyData, adminReply: e.target.value })}
                  placeholder="Provide resolution feedback for the student..."
                  className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs h-24 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all font-mono"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? 'SAVING...' : 'REGISTER STATEMENT'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-700 border-dashed rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-80">
            <HelpCircle className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-xs font-mono">SELECT TICKET FOR CONSOLE RESPONSE</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorGrievances;
