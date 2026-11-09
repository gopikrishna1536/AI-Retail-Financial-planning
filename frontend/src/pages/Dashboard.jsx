import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import CrisisTurnaroundModal from '../components/CrisisTurnaroundModal';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart as PieIcon,
  AlertTriangle,
  RefreshCw,
  Building2,
  Calendar,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  Store,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showTurnaroundModal, setShowTurnaroundModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const query = selectedYear ? `?year=${selectedYear}` : '';
      const res = await api.get(`/dashboard/summary${query}`);
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard KPIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const formatLakhOrCr = (num) => {
    const val = Number(num) || 0;
    if (Math.abs(val) >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-3 text-indigo-400 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Synthesizing Industrial Financial Metrics & Unit Economics...</span>
        </div>
      </div>
    );
  }

  const isNetLoss = (summary?.net_profit || 0) < 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Executive Header & Control Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              Executive Financial Command Center
            </span>
            <span className="text-xs text-slate-400">• Multi-Store Operations Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Industrial Retail Financial & Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time top-line revenue, gross profit, operating cost structures, store unit economics & profit turnaround pathways.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Years (2019–2023 Baseline)</option>
              <option value="2023" className="bg-slate-900">Fiscal Year 2023</option>
              <option value="2022" className="bg-slate-900">Fiscal Year 2022</option>
              <option value="2021" className="bg-slate-900">Fiscal Year 2021</option>
              <option value="2020" className="bg-slate-900">Fiscal Year 2020</option>
              <option value="2019" className="bg-slate-900">Fiscal Year 2019</option>
            </select>
          </div>

          <NavLink
            to="/store-profit-pathway"
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            <Store className="w-3.5 h-3.5" />
            <span>5-Year Store Pathway</span>
          </NavLink>

          <button
            onClick={fetchDashboardData}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Critical Accounting Diagnostic Banner (Explaining -₹59,02,91,872) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isNetLoss ? 'bg-rose-950/25 border-rose-900/40' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  Forensic Financial Diagnostic: Net Operating Profit Deficit Analysis
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900/60 text-rose-300">
                  {formatLakhOrCr(summary?.net_profit)} Deficit
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {summary?.accounting_diagnostic?.issue_explained}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setShowTurnaroundModal(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Turnaround Blueprint</span>
            </button>
            <button
              onClick={() => setShowDiagnostic(!showDiagnostic)}
              className="p-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all text-xs flex items-center gap-1"
            >
              <span>{showDiagnostic ? 'Hide Details' : 'View Audit'}</span>
              {showDiagnostic ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Accounting Bridge */}
        {showDiagnostic && (
          <div className="mt-4 pt-4 border-t border-rose-900/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Accounting Bridge & Root Causes
              </h4>
              <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                {summary?.accounting_diagnostic?.formula_bridge}
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                {summary?.accounting_diagnostic?.root_causes?.map((rc, idx) => (
                  <li key={idx}>{rc}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Strategic Resolution Pathway
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {summary?.accounting_diagnostic?.solution_roadmap}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <NavLink
                  to="/store-profit-pathway"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Explore Store Profit Pathway</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Executive Accounting Waterfall Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Top-Line Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Gross Sales Revenue</p>
          <h3 className="text-lg font-bold text-slate-100 mt-1">{formatLakhOrCr(summary?.total_revenue)}</h3>
          <p className="text-[10px] text-slate-400 mt-1">100k Store Txns</p>
        </div>

        {/* COGS */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Cost of Goods (COGS)</p>
          <h3 className="text-lg font-bold text-slate-300 mt-1">{formatLakhOrCr(summary?.cogs)}</h3>
          <p className="text-[10px] text-slate-400 mt-1">~85% of Revenue</p>
        </div>

        {/* Gross Profit */}
        <div className="bg-slate-900 border border-indigo-900/50 p-4 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Gross Profit</p>
          <h3 className="text-lg font-bold text-indigo-300 mt-1">{formatLakhOrCr(summary?.gross_profit)}</h3>
          <p className="text-[10px] text-indigo-400 font-medium mt-1">{summary?.gross_margin_pct}% Gross Margin</p>
        </div>

        {/* Operating Expenses */}
        <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Store OpEx</p>
          <h3 className="text-lg font-bold text-amber-300 mt-1">{formatLakhOrCr(summary?.total_expenses)}</h3>
          <p className="text-[10px] text-amber-400 font-medium mt-1">{summary?.opex_ratio_pct}% OpEx Ratio</p>
        </div>

        {/* Net Profit (EBITDA) */}
        <div className={`p-4 rounded-2xl border relative overflow-hidden ${
          isNetLoss ? 'bg-rose-950/20 border-rose-800/50' : 'bg-emerald-950/20 border-emerald-800/50'
        }`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isNetLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
            Net Operating Profit
          </p>
          <h3 className={`text-lg font-black mt-1 ${isNetLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
            {formatLakhOrCr(summary?.net_profit)}
          </h3>
          <p className={`text-[10px] font-semibold mt-1 ${isNetLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
            {summary?.profit_margin}% Net Margin
          </p>
        </div>

        {/* Average Discount / Markdown */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Avg Promotional Markdown</p>
          <h3 className="text-lg font-bold text-rose-400 mt-1">{summary?.avg_discount_pct}%</h3>
          <p className="text-[10px] text-rose-400 font-medium mt-1">Benchmark: 18.0%</p>
        </div>
      </div>

      {/* 4. Category Performance & Regional Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Profitability Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Category Profitability & Markdown Exposure</h3>
              <p className="text-[11px] text-slate-400">Live sales, gross profit and discount intensity per category</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium">6 Categories</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Gross Profit</th>
                  <th className="py-2.5 px-3 text-right">Margin %</th>
                  <th className="py-2.5 px-3 text-right">Avg Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {summary?.category_breakdown?.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{cat.name}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">{formatLakhOrCr(cat.sales)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">{formatLakhOrCr(cat.profit)}</td>
                    <td className="py-2.5 px-3 text-right text-indigo-400 font-semibold">{cat.margin_pct}%</td>
                    <td className="py-2.5 px-3 text-right text-rose-400">{cat.discount_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Store Network Heatmap */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Regional Store Network Operations</h3>
              <p className="text-[11px] text-slate-400">Store concentration & profitability across North, South, East, West</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium">30 Stores</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {summary?.regional_breakdown?.map((reg, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{reg.region} Region</span>
                  <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/40">
                    {reg.store_count} Stores
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Total Sales:</span>
                  <span className="font-semibold text-slate-200">{formatLakhOrCr(reg.sales)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Gross Profit:</span>
                  <span className="font-bold text-emerald-400">{formatLakhOrCr(reg.profit)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Gross Margin:</span>
                  <span className="font-semibold text-indigo-300">{reg.margin_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Executive Operational Action Center */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Industrial Decision Support Center
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Turn Operating Deficits into Sustainable Profitability
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Execute store-by-store unit economics realignments, cap clearance discounts at POS, rebalance shelf assortments, and deploy our verified 8-service AWS cloud infrastructure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <NavLink
            to="/store-profit-pathway"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <span>Launch 5-Year Store Pathway</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>

          <button
            onClick={() => setShowTurnaroundModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Crisis Turnaround Report</span>
          </button>

          <NavLink
            to="/aws-deployment"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            AWS Console Deployment
          </NavLink>
        </div>
      </div>

      {/* Crisis Turnaround Report Modal */}
      <CrisisTurnaroundModal
        isOpen={showTurnaroundModal}
        onClose={() => setShowTurnaroundModal(false)}
      />
    </div>
  );
}
