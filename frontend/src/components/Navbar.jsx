import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import CrisisTurnaroundModal from './CrisisTurnaroundModal';
import {
  LogOut,
  User,
  Activity,
  CheckCircle2,
  Server,
  Bell,
  AlertTriangle,
  AlertOctagon,
  ChevronRight,
  TrendingUp,
  FileText,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [notifications, setNotifications] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Health check
    api.get('/health')
      .then(res => {
        if (res.status === 'ok' || res.database?.connected) {
          setDbStatus('Connected');
        } else {
          setDbStatus('Degraded');
        }
      })
      .catch(() => setDbStatus('Offline'));

    // Fetch live executive risk notifications
    api.get('/risk-alerts/notifications')
      .then(res => {
        if (res.success) setNotifications(res.data);
      })
      .catch(err => console.error('Failed to fetch risk notifications:', err));
  }, []);

  const hasCrisis = notifications?.has_crisis || false;
  const alertCount = notifications?.alerts?.length || 0;

  return (
    <>
      <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        {/* Title area & quick navigation */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              FinOptimizer AI <span className="text-slate-500 font-normal">|</span> Enterprise Retail Operations Platform
            </h2>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              FY 2026-27 Strategic Financial Planning & Store Unit Economics
            </p>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Live Database
          </span>

          <NavLink
            to="/store-profit-pathway"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/50 hover:bg-indigo-900/50 transition-all shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            5-Year Store Profit Pathway
          </NavLink>
        </div>

        {/* User profile & Notification Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Executive Risk Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className={`relative p-2 rounded-xl border transition-all ${
                hasCrisis
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/40 animate-pulse'
                  : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
              title="Executive Risk & Crisis Notifications"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  hasCrisis ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50' : 'bg-amber-500 text-slate-900'
                }`}>
                  {alertCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown / Drawer */}
            {showDrawer && (
              <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className={`w-4 h-4 ${hasCrisis ? 'text-rose-400' : 'text-amber-400'}`} />
                    <h3 className="text-xs font-bold text-slate-100">Executive Risk Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications list */}
                <div className="max-h-80 overflow-y-auto space-y-2.5">
                  {notifications?.alerts?.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-950/20 border-rose-900/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-900/60 text-rose-300'
                            : 'bg-amber-900/60 text-amber-300'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.date}</span>
                      </div>
                      <h4 className="font-semibold text-slate-200">{alert.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{alert.trigger}</p>
                      
                      {/* Solution summary */}
                      <div className="mt-1 pt-1.5 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
                        <strong>Solution: </strong> {alert.solution?.immediate_action || 'Review turnaround playbook'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action: Turnaround Report */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowDrawer(false);
                      setShowModal(true);
                    }}
                    className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Complete Turnaround Report</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Database Health Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-xl text-xs border border-slate-700/50 text-slate-300">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] text-slate-400 font-medium">DB:</span>
            <span className="font-semibold text-emerald-400 text-[11px]">{dbStatus}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
              {user?.first_name ? user.first_name[0] : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
              </p>
              <span className="inline-block text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Complete Crisis Turnaround Report Modal */}
      <CrisisTurnaroundModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
