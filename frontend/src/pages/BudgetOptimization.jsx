import React from 'react';
import { Sliders, Sparkles, ArrowRight } from 'lucide-react';

export default function BudgetOptimization() {
  const optimizations = [
    {
      category: 'Marketing Budget Reallocation',
      current: 18500000,
      recommended: 22000000,
      impact: '+14.2% Estimated Revenue Increase',
      confidence: '92%',
      reason: 'Fast Food promotional elasticity indicates high return on marketing spend in Q3.'
    },
    {
      category: 'Store Utility & Logistics Cost Containment',
      current: 14000000,
      recommended: 11500000,
      impact: '₹25,00,000 Annual Net Savings',
      confidence: '88%',
      reason: 'Logistics routes in South region exhibit 18% idle time redundancy.'
    },
    {
      category: 'Low-Margin Product Discount Reduction',
      current: 25.0,
      recommended: 18.0,
      impact: '+3.5% Net Profit Margin Uplift',
      confidence: '95%',
      reason: 'Deep 30%+ discounts on Electric Appliances eroding net profitability.'
    }
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">AI Constrained Budget Optimization</h1>
        <p className="text-xs text-slate-400 mt-1">Prescriptive Machine Learning Budget Reallocation Recommendations</p>
      </div>

      <div className="space-y-4">
        {optimizations.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">{item.category}</h3>
              </div>
              <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded-full text-[11px] font-bold">
                Confidence: {item.confidence}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800/60 font-mono">
              <div className="text-slate-400">Current: <span className="text-slate-200 font-semibold">{item.current.toLocaleString()}</span></div>
              <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-slate-400">Recommended: <span className="text-emerald-400 font-semibold">{item.recommended.toLocaleString()}</span></div>
            </div>

            <p className="text-xs text-slate-300"><strong className="text-slate-200">Rationale:</strong> {item.reason}</p>
            <div className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/30 p-2 rounded-lg inline-block">
              Expected Business Impact: {item.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
