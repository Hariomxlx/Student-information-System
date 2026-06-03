import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Clock, AlertCircle, BookOpen } from 'lucide-react';

const MentorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ studentCount: 0, pendingGrievances: 0 });
  const navigate = useNavigate();
  const token = localStorage.getItem('usis_token');
  const user = JSON.parse(localStorage.getItem('usis_user') || '{}');

  useEffect(() => {
    fetchStudents();
    fetchGrievanceStats();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/core/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setStats(prev => ({ ...prev, studentCount: data.length }));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchGrievanceStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/grievances', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter(g => g.status === 'Pending' || g.status === 'In Progress').length;
        setStats(prev => ({ ...prev, pendingGrievances: pending }));
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back, {user.name}</h2>
        <p className="text-slate-400 mt-1">Here is the academic standing of your department advising group.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Advised Students</h3>
          <p className="text-3xl font-bold mt-1 text-white">{stats.studentCount}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            {stats.pendingGrievances > 0 && (
              <span className="text-xs bg-amber-500 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                Needs Attention
              </span>
            )}
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Pending Student Grievances</h3>
          <p className="text-3xl font-bold mt-1 text-white">{stats.pendingGrievances}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium">Department Division</h3>
          <p className="text-2xl font-bold mt-2 text-white truncate">{user.department || 'Computer Science'}</p>
        </div>
      </div>

      {/* Students Directory */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-indigo-200 mb-4">Advising Group Roster</h3>
        {students.length === 0 ? (
          <p className="text-slate-500 text-sm">No students currently registered in your advising group.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs font-mono tracking-wider uppercase border-b border-slate-700">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Enrollment ID</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-750/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{student.name}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">{student.enrollmentId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{student.email}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => navigate('/mentor/attendance')} 
                        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-lg text-xs font-bold transition-all"
                      >
                        Mark Attendance
                      </button>
                      <button 
                        onClick={() => navigate('/mentor/grades')} 
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-all"
                      >
                        Enter Grades
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
  );
};

export default MentorDashboard;
