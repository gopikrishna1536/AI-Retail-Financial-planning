import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@retailcorp.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">AI Retail Financial Platform</h1>
          <p className="text-xs text-slate-400">Budget Optimization & Profitability Platform</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/50 rounded-xl text-rose-300 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold mb-2">One-Click Demo Roles:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillCredentials('admin@retailcorp.com', 'AdminPassword123!')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-indigo-300 font-medium text-[11px] text-left border border-slate-700/50"
            >
              👑 Admin
            </button>
            <button
              onClick={() => fillCredentials('manager@retailcorp.com', 'ManagerPassword123!')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-300 font-medium text-[11px] text-left border border-slate-700/50"
            >
              💼 Manager
            </button>
            <button
              onClick={() => fillCredentials('analyst@retailcorp.com', 'AnalystPassword123!')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-300 font-medium text-[11px] text-left border border-slate-700/50"
            >
              📊 Analyst
            </button>
            <button
              onClick={() => fillCredentials('staff@retailcorp.com', 'StaffPassword123!')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium text-[11px] text-left border border-slate-700/50"
            >
              👤 Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
