import React from 'react';
import { Building2 } from 'lucide-react';

export default function BusinessUnits() {
  const units = [
    { name: 'North India Retail Operations', region: 'North', stores: 8, revenue: '₹68,50,00,000', margin: '16.4%' },
    { name: 'East India Hypermarket Division', region: 'East', stores: 9, revenue: '₹84,20,00,000', margin: '18.2%' },
    { name: 'West India Express Stores', region: 'West', stores: 7, revenue: '₹55,40,00,000', margin: '14.8%' },
    { name: 'South India Urban Division', region: 'South', stores: 6, revenue: '₹42,74,41,014', margin: '15.1%' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Business Units Division Summary</h1>
        <p className="text-xs text-slate-400 mt-1">Regional Strategic Business Unit Performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {units.map((u, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">{u.name}</h3>
              </div>
              <span className="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-full text-[10px] font-bold">{u.region}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-800/80">
              <div><span className="text-slate-400 block">Outlets</span><span className="font-bold text-slate-200">{u.stores} Stores</span></div>
              <div><span className="text-slate-400 block">Revenue</span><span className="font-bold font-mono text-slate-200">{u.revenue}</span></div>
              <div><span className="text-slate-400 block">Gross Margin</span><span className="font-bold font-mono text-emerald-400">{u.margin}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
