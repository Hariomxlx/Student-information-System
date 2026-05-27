import React from 'react';
import { BookOpen, GraduationCap, Award, TrendingUp, CheckCircle, BookType, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Academics = () => {
  const gpaData = [
    { semester: 'Sem 1', gpa: 3.5 },
    { semester: 'Sem 2', gpa: 3.7 },
    { semester: 'Sem 3', gpa: 3.6 },
    { semester: 'Sem 4', gpa: 3.9 },
    { semester: 'Sem 5', gpa: 3.8 },
  ];

  const currentCourses = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, attendance: 92, grade: 'A', progress: 85, color: 'bg-blue-500' },
    { code: 'CS302', name: 'Artificial Intelligence', credits: 4, attendance: 88, grade: 'B+', progress: 75, color: 'bg-purple-500' },
    { code: 'CS303', name: 'Computer Networks', credits: 3, attendance: 95, grade: 'A', progress: 90, color: 'bg-emerald-500' },
    { code: 'MA205', name: 'Discrete Mathematics', credits: 3, attendance: 82, grade: 'B', progress: 65, color: 'bg-amber-500' },
    { code: 'HU101', name: 'Technical Communication', credits: 2, attendance: 98, grade: 'A+', progress: 95, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <GraduationCap className="h-7 w-7" />
            </div>
            Academics
          </h2>
          <p className="text-slate-400 mt-1">Track your academic progress, courses, and performance.</p>
        </div>
        <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-lg">
          <BookType className="h-4 w-4" /> Download Transcript
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
            <Award className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Cumulative GPA</p>
            <h3 className="text-4xl font-bold text-white mb-2">3.82</h3>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <TrendingUp className="h-3 w-3" /> +0.02 from last semester
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
            <CheckCircle className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Credits Completed</p>
            <h3 className="text-4xl font-bold text-white mb-2">86<span className="text-xl text-slate-500"> / 120</span></h3>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
            <Hash className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Class Rank</p>
            <h3 className="text-4xl font-bold text-white mb-2">12<span className="text-xl text-slate-500"> / 240</span></h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-3">
              Top 5% of the class
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Enrolled Courses */}
        <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" /> Current Courses
          </h3>
          <div className="space-y-4">
            {currentCourses.map((course, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${course.color}`}>
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-400">{course.credits} Credits</span>
                  </div>
                  <h4 className="font-semibold text-slate-200">{course.name}</h4>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Attendance</p>
                    <p className={`font-semibold ${course.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}`}>{course.attendance}%</p>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Grade</p>
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-sm mx-auto">
                      {course.grade}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Trend Chart */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> GPA Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 4.0]} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Bar dataKey="gpa" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Great job! Your GPA has been consistently rising over the last 3 semesters. Keep up the excellent work to maintain your top 5% class ranking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
