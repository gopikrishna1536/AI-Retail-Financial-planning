import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function VarianceAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('ALL');

  const fetchVariances = async () => {
    setLoading(true);
    try {
      const res = await api.get('/variances');
      if (res.success) {
        setData(res.data);
      }

      // Fetch financial plans for dropdown filter
      const planRes = await api.get('/financial-plans');
      if (planRes.success) {
        setPlans(planRes.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch variances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariances();
  }, []);

  const variancesList = data?.variances || [];
  const summary = data?.summary || {
    total_planned_revenue: 350000000,
    total_actual_revenue: 348000000,
    revenue_variance: -2000000,
    total_planned_expense: 290000000,
    total_actual_expense: 304000000,
    expense_variance: 14000000,
    total_planned_profit: 60000000,
    total_actual_profit: 44000000,
    profit_variance: -16000000,
    is_favorable: false
  };

  const chartData = variancesList.slice(0, 6).map((v) => ({
    name: v.component.length > 18 ? v.component.substring(0, 18) + '...' : v.component,
    Planned: Number((v.planned_revenue / 10000000).toFixed(2)),
    Actual: Number((v.actual_revenue / 10000000).toFixed(2))
  }));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Planned vs Actual Variance Analysis</h1>
            <span className="px-3 py-1 bg-indigo-950/80 text-indigo-400 border border-indigo-700/50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <GitCompare className="w-3.5 h-3.5 text-indigo-400" /> Dynamic Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed line-item comparison of Approved Financial Plan Targets against Realized Database Actuals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-slate-400 px-3 py-1.5 font-medium">Active Plan Baseline:</span>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="bg-transparent px-3 py-1.5 text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Latest Approved Baseline ({data?.active_plan?.plan_name || 'Q3 Plan'})</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.plan_name} ({p.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchVariances}
            disabled={loading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all cursor-pointer"
            title="Refresh Variances"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* TOP SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Revenue Variance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue Target vs Actual</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {formatINR(summary.total_actual_revenue)}
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2 font-mono">
            <span className="text-slate-400">Target: {formatINR(summary.total_planned_revenue)}</span>
            <span className={`font-bold ${summary.revenue_variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {summary.revenue_variance >= 0 ? '+' : ''}{formatINR(summary.revenue_variance)}
            </span>
          </div>
        </div>

        {/* Expense Variance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expense Target vs Actual</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">
            {formatINR(summary.total_actual_expense)}
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2 font-mono">
            <span className="text-slate-400">Target: {formatINR(summary.total_planned_expense)}</span>
            <span className={`font-bold ${summary.expense_variance <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {summary.expense_variance > 0 ? '+' : ''}{formatINR(summary.expense_variance)}
            </span>
          </div>
        </div>

        {/* Net Profit Variance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Profit Target vs Actual</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatINR(summary.total_actual_profit)}
          </div>
          <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2 font-mono">
            <span className="text-slate-400">Target: {formatINR(summary.total_planned_profit)}</span>
            <span className={`font-bold ${summary.profit_variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {summary.profit_variance >= 0 ? '+' : ''}{formatINR(summary.profit_variance)}
            </span>
          </div>
        </div>

        {/* Overall Status Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Variance Status</span>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              summary.is_favorable
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                : 'bg-rose-950 text-rose-400 border border-rose-800/40'
            }`}>
              {summary.is_favorable ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {summary.is_favorable ? 'FAVORABLE PERFORMANCE' : 'UNFAVORABLE VARIANCE'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            {summary.is_favorable
              ? 'Actual profit meets or exceeds approved targets.'
              : 'Expense overruns or sales shortfalls detected against plan.'}
          </p>
        </div>
      </div>

      {/* RECHARTS COMPARISON CHART */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" /> Line-Item Target vs Actual Comparison (Cr)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="Planned" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DYNAMIC LINE-ITEM VARIANCE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
            Detailed Variance Breakdown ({variancesList.length} Items)
          </h3>
          <span className="text-xs text-slate-400">
            Source: Database Actuals vs Approved Financial Target
          </span>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="p-3.5">Financial Component</th>
              <th className="p-3.5 text-right">Planned Target (₹)</th>
              <th className="p-3.5 text-right">Actual Realized (₹)</th>
              <th className="p-3.5 text-right">Variance Amount (₹)</th>
              <th className="p-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Loading Live Variances...
                </td>
              </tr>
            ) : variancesList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No variance data available.
                </td>
              </tr>
            ) : (
              variancesList.map((v, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-200">
                    <div>{v.component}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{v.category}</span>
                  </td>
                  <td className="p-3.5 text-right font-mono">
                    {formatINR(v.planned_revenue)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-slate-100">
                    {formatINR(v.actual_revenue)}
                  </td>
                  <td className={`p-3.5 text-right font-mono font-bold ${v.is_favorable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {v.revenue_variance >= 0 ? '+' : ''}{formatINR(v.revenue_variance)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      v.is_favorable
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                    }`}>
                      {v.is_favorable ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {v.is_favorable ? 'FAVORABLE' : 'UNFAVORABLE'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
