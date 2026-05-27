import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Calendar, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight">Welcome to Hariom & Himal Portal</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 rounded-full font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-sm text-primary-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Unified Student Information System 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Managing Education, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Made Seamless.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Centralize enrollment, attendance tracking, academic performance, and mentor communication in one powerful, unified platform.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-colors">
              Get Started
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          {[
            { title: 'Smart Attendance', desc: 'Auto-detect low attendance and trigger instant alerts.', icon: Activity, color: 'text-rose-400' },
            { title: 'Performance Analytics', desc: 'Track grades and GPA with beautiful, intuitive charts.', icon: GraduationCap, color: 'text-primary-400' },
            { title: 'Mentor Connectivity', desc: 'Real-time chat and file sharing between students and mentors.', icon: Users, color: 'text-emerald-400' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl hover:bg-slate-800/80 transition-colors group">
              <feature.icon className={`h-10 w-10 ${feature.color} mb-6 transform group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
