import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Lightbulb, RefreshCw } from 'lucide-react';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations');
      if (res.success) {
        setRecs(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">AI Strategic Recommendations</h1>
          <p className="text-xs text-slate-400 mt-1">Data-driven executive recommendations based on approved financial plans & store performance</p>
        </div>
        <button
          onClick={fetchRecs}
          disabled={loading}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading AI Recommendations...</div>
        ) : recs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">No active recommendations.</div>
        ) : (
          recs.map((r, i) => (
            <div key={r.id || i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-slate-100 text-sm">{r.title}</h3>
                </div>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full text-[10px] font-bold">
                  Priority: {r.priority}
                </span>
              </div>
              <p className="text-xs text-slate-300"><strong className="text-slate-200">Analysis Rationale:</strong> {r.reason}</p>
              <div className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/30 p-2.5 rounded-lg">
                Projected Outcome: {r.impact}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
