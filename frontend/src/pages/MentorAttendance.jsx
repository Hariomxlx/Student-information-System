import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, User, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const MentorAttendance = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    subject: 'Database Management Systems',
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentMarks, setRecentMarks] = useState([]);

  const token = localStorage.getItem('usis_token');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/core/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, studentId: data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/core/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        const studentName = students.find(s => s._id === formData.studentId)?.name || 'Student';
        setSuccess(`Successfully marked ${studentName} as ${formData.status}.`);
        
        // Add to recent marks list
        setRecentMarks(prev => [
          {
            id: data._id,
            studentName,
            subject: formData.subject,
            date: formData.date,
            status: formData.status
          },
          ...prev
        ]);
      } else {
        setError(data.message || 'Failed to submit attendance');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mark Class Attendance</h2>
            <p className="text-xs text-slate-400">Log student presence for academic lectures.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <User className="h-4 w-4 text-indigo-400" /> Select Student
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.enrollmentId || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-400" /> Subject / Lecture
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Discrete Mathematics">Discrete Mathematics</option>
                <option value="Technical Communication">Technical Communication</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-400" /> Lecture Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Attendance Status</label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Present' })}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Absent' })}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${formData.status === 'Absent' ? 'bg-red-500/20 text-red-400 border-red-500' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                  Absent
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || students.length === 0}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all text-sm"
            >
              {loading ? 'Submitting...' : 'Register Attendance'}
            </button>
          </div>
        </form>
      </div>

      {/* Side list: recent logs */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-md font-bold text-slate-200 mb-4 pb-2 border-b border-slate-700">Recent Logs (This Session)</h3>
        {recentMarks.length === 0 ? (
          <p className="text-slate-500 text-xs font-mono">NO ATTENDANCE LOGGED YET</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recentMarks.map((log, index) => (
              <div key={index} className="p-3 bg-slate-900 border border-slate-750 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-slate-200 truncate max-w-[120px]">{log.studentName}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{log.subject}</p>
                <p className="text-[9px] text-slate-500 font-mono">{log.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorAttendance;
