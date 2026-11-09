import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/budgets');
      if (res.success) setBudgets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'OVER BUDGET') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950 text-rose-400 border border-rose-800/40 rounded-full text-[10px] font-bold"><XCircle className="w-3 h-3" /> OVER BUDGET</span>;
    }
    if (status === 'WARNING') {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800/40 rounded-full text-[10px] font-bold"><AlertCircle className="w-3 h-3" /> WARNING</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> ON TRACK</span>;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Budget Monitoring & Utilization</h1>
          <p className="text-xs text-slate-400 mt-1">Track Allocated Budget vs Actual Outlay across Expense Categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => (
          <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100">{b.expense_category}</span>
              {getStatusBadge(b.status)}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Budget Utilization</span>
                <span className="font-semibold text-slate-200">{b.utilization_pct}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    b.utilization_pct > 100 ? 'bg-rose-500' : b.utilization_pct > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, b.utilization_pct)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-400 block">Allocated</span>
                <span className="font-mono font-semibold text-slate-200">₹{Number(b.allocated_amount).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Actual</span>
                <span className="font-mono font-semibold text-slate-200">₹{Number(b.actual_amount).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Remaining</span>
                <span className={`font-mono font-semibold ${b.remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{Number(b.remaining).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
