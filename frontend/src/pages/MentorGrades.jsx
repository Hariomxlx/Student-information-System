import React, { useState, useEffect } from 'react';
import { Award, User, BookOpen, AlertCircle, CheckCircle, Percent } from 'lucide-react';

const MentorGrades = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'Database Management Systems',
    marks: '',
    maxMarks: 100
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
      const res = await fetch('http://localhost:5000/api/core/students', {
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

    // Quick validation
    if (parseFloat(formData.marks) > parseFloat(formData.maxMarks)) {
      setError('Marks obtained cannot exceed maximum marks.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/core/grades', {
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
        setSuccess(`Successfully registered grade for ${studentName}.`);
        setFormData(prev => ({ ...prev, marks: '' }));
        
        // Add to recent marks list
        setRecentMarks(prev => [
          {
            id: data._id,
            studentName,
            subject: formData.subject,
            score: `${formData.marks} / ${formData.maxMarks}`
          },
          ...prev
        ]);
      } else {
        setError(data.message || 'Failed to submit grade record');
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
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Enter Academic Grades</h2>
            <p className="text-xs text-slate-400">Record assignment, test, or final scores for advising students.</p>
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
                <BookOpen className="h-4 w-4 text-indigo-400" /> Subject / Module
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
                <Percent className="h-4 w-4 text-indigo-400" /> Marks Obtained
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="E.g., 85.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Maximum Possible Marks</label>
              <input
                type="number"
                required
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                placeholder="100"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || students.length === 0}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all text-sm"
            >
              {loading ? 'Submitting...' : 'Save Grade Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Side list: recent grade entries */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h3 className="text-md font-bold text-slate-200 mb-4 pb-2 border-b border-slate-700">Recent Grade Registry</h3>
        {recentMarks.length === 0 ? (
          <p className="text-slate-500 text-xs font-mono">NO GRADES LOGGED YET</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recentMarks.map((log, index) => (
              <div key={index} className="p-3 bg-slate-900 border border-slate-750 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-slate-200 truncate max-w-[120px]">{log.studentName}</h4>
                  <span className="text-[10px] text-indigo-400 font-bold font-mono bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {log.score}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{log.subject}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorGrades;
