import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, Lock, Eye, EyeOff } from 'lucide-react';

const Admin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // Save user and token
        localStorage.setItem('usis_token', data.token);
        localStorage.setItem('usis_user', JSON.stringify(data));
        navigate('/administration');
      } else {
        setError(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Connection to security gateway failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-purple-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* High-Tech Border Accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl mb-4 shadow-lg shadow-purple-500/10">
            <ShieldAlert className="h-10 w-10 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 via-fuchsia-100 to-white bg-clip-text text-transparent">
            Admin Gateway
          </h2>
          <p className="text-slate-400 text-sm mt-2 text-center font-mono">
            SECURE TERMINAL ACCESS
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-purple-300 uppercase tracking-widest">
              Admin Security ID
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400/70" />
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-slate-950/80 border border-purple-500/20 text-white rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm placeholder-slate-600"
                placeholder="ENTER SECURITY ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-purple-300 uppercase tracking-widest">
              Master Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-purple-500/20 text-white rounded-xl pl-10 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm placeholder-slate-600"
                placeholder="ENTER ACCESS KEY"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/70 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-mono font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-50 text-sm tracking-wider uppercase"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS CONSOLE'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-mono text-slate-500 hover:text-purple-400 transition-colors"
          >
            &lt; Return to User Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
