import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Server, Building2, User } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Organization & Platform Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Multi-tenant SaaS Configuration, Roles & Cloud Infrastructure</p>
      </div>

      <div className="space-y-6 text-xs">
        {/* User Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> User Profile & Role
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-slate-400 block mb-1">Full Name</span><input type="text" readOnly value={`${user?.first_name || 'System'} ${user?.last_name || 'Admin'}`} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200" /></div>
            <div><span className="text-slate-400 block mb-1">Email</span><input type="text" readOnly value={user?.email || 'admin@retailcorp.com'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200" /></div>
            <div><span className="text-slate-400 block mb-1">Assigned Role</span><input type="text" readOnly value={user?.role || 'ADMIN'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-indigo-400" /></div>
            <div><span className="text-slate-400 block mb-1">Tenant ID</span><input type="text" readOnly value={user?.organization_id || '855f768e-b59f-4831-b054-34003393b88c'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-slate-400" /></div>
          </div>
        </div>

        {/* Cloud Infrastructure */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> Two-Server AWS Architecture Configuration
          </h3>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/60"><span>Server 1 (Node.js Application Server)</span><span className="font-mono text-emerald-400 font-bold">http://localhost:5000 (Active)</span></div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/60"><span>Server 2 (Python FastAPI AI/ML Server)</span><span className="font-mono text-amber-400 font-bold">http://localhost:8000 (Phase 8 Target)</span></div>
            <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/60"><span>Database Engine</span><span className="font-mono text-slate-200 font-bold">PostgreSQL / Amazon RDS</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
