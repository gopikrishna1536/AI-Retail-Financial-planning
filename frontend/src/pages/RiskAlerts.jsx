import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/risk-alerts');
      if (res.success) {
        setAlerts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch risk alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Early Warning Risk System</h1>
          <p className="text-xs text-slate-400 mt-1">Automated Financial Stress Detection & Early Warning Alerts for Approved Plans</p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading Risk Alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">No active risk alerts.</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-5 h-5 ${alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`} />
                  <span className="font-bold text-slate-100 text-sm">{alert.store}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800/40' : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                }`}>
                  {alert.severity} RISK (Score: {alert.risk_score})
                </span>
              </div>

              <p className="text-xs text-slate-300">{alert.description}</p>
              <div className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-800/30 p-2.5 rounded-lg font-medium">
                💡 Recommended Action: {alert.recommended_action}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
