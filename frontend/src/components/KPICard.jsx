import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, planned, variance, isCurrency = true, icon: Icon, color = 'indigo' }) {
  const isPositive = variance >= 0;

  const formatVal = (val) => {
    if (val === undefined || val === null) return 'N/A';
    if (!isCurrency) return typeof val === 'number' ? val.toLocaleString() : val;
    return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-slate-100 tracking-tight">
          {formatVal(value)}
        </div>
      </div>

      {(planned !== undefined || variance !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {planned !== undefined && (
            <span className="text-slate-400">
              Planned: <strong className="text-slate-300 font-semibold">{formatVal(planned)}</strong>
            </span>
          )}
          {variance !== undefined && (
            <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}{formatVal(variance)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
