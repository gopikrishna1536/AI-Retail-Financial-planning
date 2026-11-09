import React, { useState } from 'react';
import { Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WhatIfAnalysis() {
  const [salesGrowth, setSalesGrowth] = useState(10);
  const [priceChange, setPriceChange] = useState(5);
  const [discountChange, setDiscountChange] = useState(-3);
  const [marketingChange, setMarketingChange] = useState(15);
  const [opexChange, setOpexChange] = useState(-5);

  const baselineRev = 2508441014;
  const baselineExp = 963619494;
  const baselineProf = 1544821520;
  const baselineMargin = 61.58;

  // Calculate simulated figures based on slider adjustments
  const simulatedRev = baselineRev * (1 + (salesGrowth / 100)) * (1 + (priceChange / 100)) * (1 - (discountChange / 100));
  const simulatedExp = baselineExp * (1 + (marketingChange * 0.1 / 100)) * (1 + (opexChange / 100));
  const simulatedProf = simulatedRev - simulatedExp;
  const simulatedMargin = (simulatedProf / simulatedRev) * 100;

  const comparisonData = [
    { metric: 'Revenue (₹ Cr)', Current: (baselineRev / 10000000).toFixed(1), Simulated: (simulatedRev / 10000000).toFixed(1) },
    { metric: 'Expenses (₹ Cr)', Current: (baselineExp / 10000000).toFixed(1), Simulated: (simulatedExp / 10000000).toFixed(1) },
    { metric: 'Net Profit (₹ Cr)', Current: (baselineProf / 10000000).toFixed(1), Simulated: (simulatedProf / 10000000).toFixed(1) },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Interactive What-If Scenario Simulator</h1>
        <p className="text-xs text-slate-400 mt-1">Simulate multi-variable price elasticity, discount adjustments & marketing spend impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" /> Scenario Variables
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Sales Growth Target:</span>
                <span className="font-mono font-bold text-indigo-400">{salesGrowth > 0 ? '+' : ''}{salesGrowth}%</span>
              </div>
              <input
                type="range" min="-20" max="30" value={salesGrowth}
                onChange={(e) => setSalesGrowth(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Product Price Adjustment:</span>
                <span className="font-mono font-bold text-emerald-400">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
              </div>
              <input
                type="range" min="-15" max="25" value={priceChange}
                onChange={(e) => setPriceChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Discount Rate Change:</span>
                <span className="font-mono font-bold text-amber-400">{discountChange > 0 ? '+' : ''}{discountChange}%</span>
              </div>
              <input
                type="range" min="-10" max="10" value={discountChange}
                onChange={(e) => setDiscountChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Marketing Budget Delta:</span>
                <span className="font-mono font-bold text-purple-400">{marketingChange > 0 ? '+' : ''}{marketingChange}%</span>
              </div>
              <input
                type="range" min="-30" max="50" value={marketingChange}
                onChange={(e) => setMarketingChange(parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">OpEx Cost Reduction:</span>
                <span className="font-mono font-bold text-rose-400">{opexChange > 0 ? '+' : ''}{opexChange}%</span>
              </div>
              <input
                type="range" min="-20" max="20" value={opexChange}
                onChange={(e) => setOpexChange(parseFloat(e.target.value))}
                className="w-full accent-rose-500 bg-slate-950 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Comparison Output & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Output Comparison */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400">Simulated Revenue</span>
              <p className="text-lg font-mono font-bold text-slate-100">₹{(simulatedRev / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400">Simulated Expense</span>
              <p className="text-lg font-mono font-bold text-amber-400">₹{(simulatedExp / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400">Simulated Net Profit</span>
              <p className="text-lg font-mono font-bold text-emerald-400">₹{(simulatedProf / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400">Net Profit Margin</span>
              <p className="text-lg font-mono font-bold text-indigo-400">{simulatedMargin.toFixed(2)}%</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Current Baseline vs What-If Simulated Scenario</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Current" fill="#64748b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
