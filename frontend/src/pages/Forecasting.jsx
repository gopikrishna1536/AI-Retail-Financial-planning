import React, { useState } from 'react';
import { TrendingUp, Cpu, BarChart2, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Forecasting() {
  const [model, setModel] = useState('XGBoost');
  const [horizon, setHorizon] = useState('6');

  const forecastData = [
    { period: 'Historical M1', Actual: 250, Forecast: 250 },
    { period: 'Historical M2', Actual: 265, Forecast: 262 },
    { period: 'Historical M3', Actual: 280, Forecast: 278 },
    { period: 'Forecast M+1', Forecast: 295 },
    { period: 'Forecast M+2', Forecast: 310 },
    { period: 'Forecast M+3', Forecast: 325 },
    { period: 'Forecast M+4', Forecast: 340 },
    { period: 'Forecast M+5', Forecast: 355 },
    { period: 'Forecast M+6', Forecast: 370 },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">AI Predictive Forecasting Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-model Sales, Expense, Profit & Margin Time-Series Forecasts</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
          >
            <option value="XGBoost">XGBoost Model</option>
            <option value="Random Forest">Random Forest Regressor</option>
            <option value="Linear Regression">Linear Regression Baseline</option>
          </select>
        </div>
      </div>

      {/* Model Performance Accuracy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400">Mean Absolute Error (MAE)</span>
          <p className="text-xl font-mono font-bold text-indigo-400">₹14,250.40</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400">Root Mean Sq Error (RMSE)</span>
          <p className="text-xl font-mono font-bold text-purple-400">₹18,920.10</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400">MAPE Accuracy Score</span>
          <p className="text-xl font-mono font-bold text-emerald-400">94.8%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400">Validation Horizon</span>
          <p className="text-xl font-mono font-bold text-slate-200">12 Months (2023)</p>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Historical vs AI Projected Sales & Expense Trajectory (₹ Cr)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
