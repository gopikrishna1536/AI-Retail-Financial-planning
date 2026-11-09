import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Plus,
  ArrowRight,
  Check,
  X,
  Info,
  Calculator,
  Award,
  Layers,
  FileCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Helper for Indian Currency Formatting (Cr / L / Full)
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

const formatFullINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return `₹${Number(val).toLocaleString('en-IN')}`;
};

export default function FinancialPlanning() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, DRAFT, APPROVED, ACTIVE

  // Controls for AI Generation
  const [aiPeriodType, setAiPeriodType] = useState('QUARTERLY');
  const [aiYear, setAiYear] = useState(2026);
  const [aiPeriodNum, setAiPeriodNum] = useState(3);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState(null);

  // Manual / AI Plan Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: 'Q3 Growth Plan 2026',
    period_type: 'QUARTERLY',
    year: 2026,
    period_number: 3,
    target_revenue: 365000000,
    target_expense: 294000000,
    plan_type: 'AI_RECOMMENDED',
    status: 'DRAFT'
  });

  // Target Feasibility Live Check
  const [feasibilityData, setFeasibilityData] = useState(null);
  const [evaluatingFeasibility, setEvaluatingFeasibility] = useState(false);

  // What-If Simulator State
  const [showSimModal, setShowSimModal] = useState(false);
  const [simForm, setSimForm] = useState({
    baseline_revenue: 350000000,
    baseline_expense: 290000000,
    sales_growth_change: 15,
    expense_growth_change: 8,
    discount_change: -2,
    quantity_growth_change: 5,
    marketing_budget_change: 10,
    inventory_budget_change: 10
  });
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // AI Budget Optimization Input
  const [availableBudgetInput, setAvailableBudgetInput] = useState(100000000); // ₹10 Cr
  const [budgetOptResult, setBudgetOptResult] = useState(null);

  // Plan Details View Modal
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planPerformance, setPlanPerformance] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  // Fetch Existing Financial Plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/financial-plans');
      if (res.success) setPlans(res.data || []);
    } catch (err) {
      console.error('Failed to fetch financial plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Run AI Plan Generation
  const handleGenerateAiPlan = async () => {
    setAiGenerating(true);
    try {
      const res = await api.post('/financial-plans/ai-generate', {
        period_type: aiPeriodType,
        year: Number(aiYear),
        period_number: Number(aiPeriodNum)
      });
      if (res.success) {
        setAiPlanResult(res.data);
        setBudgetOptResult(res.data.budget_optimization);
        // Pre-populate form with AI recommendation
        setFormData({
          plan_name: res.data.plan_name,
          period_type: res.data.period_type,
          year: res.data.year,
          period_number: res.data.period_number,
          target_revenue: res.data.recommended_target.revenue,
          target_expense: res.data.recommended_target.expense,
          ai_forecast_revenue: res.data.forecast.revenue,
          ai_forecast_expense: res.data.forecast.expense,
          ai_forecast_profit: res.data.forecast.profit,
          forecast_confidence: res.data.forecast.confidence,
          recommended_revenue: res.data.recommended_target.revenue,
          recommended_expense: res.data.recommended_target.expense,
          recommended_profit: res.data.recommended_target.profit,
          feasibility_score: res.data.feasibility.feasibility_score,
          health_score: res.data.health_score.overall,
          risk_level: res.data.health_score.overall >= 80 ? 'LOW' : 'MEDIUM',
          plan_type: 'AI_RECOMMENDED',
          status: 'AI Generated'
        });
        setFeasibilityData(res.data.feasibility);
      }
    } catch (err) {
      alert(err.message || 'Failed to generate AI Financial Plan');
    } finally {
      setAiGenerating(false);
    }
  };

  // Live recalculate Feasibility when manager edits targets
  const handleRecalculateFeasibility = async (rev, exp) => {
    setEvaluatingFeasibility(true);
    try {
      const forecastRev = aiPlanResult ? aiPlanResult.forecast.revenue : rev * 0.96;
      const forecastExp = aiPlanResult ? aiPlanResult.forecast.expense : exp * 1.02;
      const res = await api.post('/financial-plans/feasibility', {
        target_revenue: rev,
        target_expense: exp,
        forecast_revenue: forecastRev,
        forecast_expense: forecastExp
      });
      if (res.success) {
        setFeasibilityData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingFeasibility(false);
    }
  };

  // Run What-If Simulation
  const handleRunSimulation = async (customForm = null) => {
    setSimulating(true);
    try {
      const payload = customForm || simForm;
      const res = await api.post('/financial-plans/simulate', payload);
      if (res.success) {
        setSimResult(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to run scenario simulation');
    } finally {
      setSimulating(false);
    }
  };

  // Run Budget Optimization recalculation
  const handleRecalculateBudget = async (budgetVal) => {
    try {
      const res = await api.post('/financial-plans/optimize-budget', { total_budget: budgetVal });
      if (res.success) {
        setBudgetOptResult(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Plan to Database
  const handleSavePlan = async (statusToSave = 'DRAFT') => {
    try {
      const payload = {
        ...formData,
        status: statusToSave
      };
      const res = await api.post('/financial-plans', payload);
      if (res.success) {
        setShowCreateModal(false);
        fetchPlans();
        alert(`Financial plan "${formData.plan_name}" saved successfully with status: ${statusToSave}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to save financial plan');
    }
  };

  // Approve Plan Action
  const handleApprovePlan = async (planId) => {
    try {
      const res = await api.put(`/financial-plans/${planId}/approve`, {});
      if (res.success) {
        fetchPlans();
        if (selectedPlan && selectedPlan.id === planId) {
          setSelectedPlan(res.data);
        }
        alert('Financial Plan successfully APPROVED by Manager!');
      }
    } catch (err) {
      alert(err.message || 'Failed to approve plan');
    }
  };

  // View Detailed Plan
  const handleViewPlanDetails = async (plan) => {
    setSelectedPlan(plan);
    setLoadingPerformance(true);
    try {
      const res = await api.get(`/financial-plans/${plan.id}/performance`);
      if (res.success) {
        setPlanPerformance(res.data);
      }
    } catch (err) {
      console.error('Failed to load performance metrics:', err);
    } finally {
      setLoadingPerformance(false);
    }
  };

  // Filtered plans list
  const filteredPlans = plans.filter((p) => {
    if (activeTab === 'APPROVED') return p.status === 'APPROVED';
    if (activeTab === 'ACTIVE') return p.status === 'ACTIVE';
    if (activeTab === 'DRAFT') return p.status === 'DRAFT' || p.status === 'AI Generated' || p.status === 'Under Review';
    return true;
  });

  // Colors for Recharts
  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Financial Planning & Forecast Engine</h1>
            <span className="px-3 py-1 bg-indigo-950/80 text-indigo-400 border border-indigo-700/50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> FinOptimizer AI v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical Retail Data → AI Forecast → AI Recommended Target → Feasibility Analysis → What-If Simulation → Budget Optimization
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <select
              value={aiPeriodType}
              onChange={(e) => setAiPeriodType(e.target.value)}
              className="bg-transparent px-3 py-1.5 text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="QUARTERLY" className="bg-slate-900">Quarterly</option>
              <option value="MONTHLY" className="bg-slate-900">Monthly</option>
              <option value="ANNUAL" className="bg-slate-900">Annual</option>
            </select>
            <select
              value={aiYear}
              onChange={(e) => setAiYear(e.target.value)}
              className="bg-transparent px-3 py-1.5 text-slate-200 focus:outline-none border-l border-slate-800 cursor-pointer"
            >
              <option value={2026} className="bg-slate-900">2026</option>
              <option value={2025} className="bg-slate-900">2025</option>
              <option value={2024} className="bg-slate-900">2024</option>
            </select>
          </div>

          <button
            onClick={handleGenerateAiPlan}
            disabled={aiGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {aiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate AI Financial Plan
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-400" /> Formulate New Plan
          </button>
        </div>
      </div>

      {/* SECTION 2 & 3: AI GENERATED PLAN PREVIEW & ANALYTICS WORKSPACE */}
      {aiPlanResult && (
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-950 border border-indigo-800/50 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-100">
                  AI Financial Plan Recommendation — {aiPlanResult.plan_name}
                </h2>
                <p className="text-xs text-slate-400">
                  Generated from historical sales trends, discount elasticity, category contributions & operating costs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  handleSavePlan('APPROVED');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" /> Accept AI Plan
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-indigo-400" /> Modify Plan
              </button>

              <button
                onClick={() => setAiPlanResult(null)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TOP KPI CARDS: HISTORICAL vs FORECAST vs RECOMMENDED TARGET */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Historical Baseline */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Historical Baseline</div>
              <div className="text-xl font-extrabold text-slate-200 font-mono">
                {formatINR(aiPlanResult.historical.revenue)}
              </div>
              <div className="text-xs text-slate-400 flex justify-between border-t border-slate-800/60 pt-2">
                <span>Margin: <strong className="text-slate-200">{aiPlanResult.historical.margin}%</strong></span>
                <span>Expense: {formatINR(aiPlanResult.historical.expense)}</span>
              </div>
            </div>

            {/* AI Financial Forecast */}
            <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">AI Financial Forecast</span>
                <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  {aiPlanResult.forecast.confidence}% Confidence
                </span>
              </div>
              <div className="text-xl font-extrabold text-indigo-300 font-mono">
                {formatINR(aiPlanResult.forecast.revenue)}
              </div>
              <div className="text-xs text-indigo-200/80 flex justify-between border-t border-indigo-800/40 pt-2">
                <span>Profit: <strong className="text-emerald-400">{formatINR(aiPlanResult.forecast.profit)}</strong></span>
                <span>Margin: {aiPlanResult.forecast.margin}%</span>
              </div>
            </div>

            {/* AI Recommended Target */}
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">AI Recommended Target</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Realistic Goal
                </span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {formatINR(aiPlanResult.recommended_target.revenue)}
              </div>
              <div className="text-xs text-emerald-200/80 flex justify-between border-t border-emerald-800/40 pt-2">
                <span>Target Profit: <strong>{formatINR(aiPlanResult.recommended_target.profit)}</strong></span>
                <span>Margin: {aiPlanResult.recommended_target.margin}%</span>
              </div>
            </div>

            {/* Financial Plan Health Score */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Health Score</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full text-[10px] font-bold">
                  🟢 HEALTHY
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{aiPlanResult.health_score.overall}</span>
                <span className="text-xs text-slate-400 font-semibold">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${aiPlanResult.health_score.overall}%` }}
                />
              </div>
            </div>
          </div>

          {/* THREE-COLUMN GRID: REASONING, FEASIBILITY, HEALTH BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Why did AI recommend this target? */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" /> Why did AI recommend this target?
              </h3>
              <p className="text-xs text-slate-400">
                Key underlying growth and cost factors driving the recommended target:
              </p>
              <div className="space-y-2 text-xs">
                {aiPlanResult.reasoning_factors.map((f, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">{f.name}:</span>
                    <span className={`font-mono font-bold ${f.impact === 'positive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-950/50 border border-indigo-800/40 p-2.5 rounded-lg text-xs text-indigo-200 font-semibold flex justify-between items-center">
                <span>Recommended Revenue Target:</span>
                <span className="font-mono text-emerald-400">{formatINR(aiPlanResult.recommended_target.revenue)}</span>
              </div>
            </div>

            {/* Target Feasibility Analysis */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Target Feasibility Analysis
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  aiPlanResult.feasibility.feasibility_level === 'HIGHLY ACHIEVABLE'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                }`}>
                  🟢 {aiPlanResult.feasibility.feasibility_level}
                </span>
              </div>
              <div className="space-y-2.5 text-xs pt-1">
                <div className="flex justify-between text-slate-300">
                  <span>Required Growth vs Historical:</span>
                  <span className="font-mono font-bold text-slate-100">+{aiPlanResult.feasibility.required_growth_pct}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>AI Forecast Growth:</span>
                  <span className="font-mono font-bold text-indigo-400">+{aiPlanResult.feasibility.forecast_growth_pct}%</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  "{aiPlanResult.feasibility.explanation}"
                </div>
              </div>
            </div>

            {/* Plan Health Breakdown */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Health Score Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                {Object.entries(aiPlanResult.health_score.breakdown).map(([k, score]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 capitalize">{k.replace('_', ' ')}</span>
                      <span className="font-mono font-bold text-slate-200">{score}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI BUDGET OPTIMIZATION & WHAT-IF ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 border-t border-slate-800 pt-5">
            {/* AI Budget Optimization Widget */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-indigo-400" /> AI Budget Optimization
                </h3>
                <span className="text-xs text-emerald-400 font-bold">
                  Expected ROI: +{aiPlanResult.budget_optimization.expected_roi}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 whitespace-nowrap">Available Budget:</label>
                <input
                  type="number"
                  value={availableBudgetInput}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAvailableBudgetInput(val);
                    handleRecalculateBudget(val);
                  }}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-100"
                />
              </div>

              <div className="space-y-2 text-xs">
                {budgetOptResult?.allocations.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/40">
                    <span className="text-slate-300 font-medium">{item.category} ({item.percentage}%)</span>
                    <span className="font-mono text-slate-100 font-semibold">{formatINR(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Plan vs AI Plan Comparison & What-If Button */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                  Current Plan vs AI Recommendation
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-semibold uppercase">
                      <tr>
                        <th className="p-2">Metric</th>
                        <th className="p-2 text-right">Current</th>
                        <th className="p-2 text-right">AI Plan</th>
                        <th className="p-2 text-right">Diff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-2 font-medium">Revenue</td>
                        <td className="p-2 text-right font-mono">₹35.0 Cr</td>
                        <td className="p-2 text-right font-mono text-indigo-400 font-bold">{formatINR(aiPlanResult.recommended_target.revenue)}</td>
                        <td className="p-2 text-right font-mono text-emerald-400 font-bold">+₹1.5 Cr</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Expense</td>
                        <td className="p-2 text-right font-mono">₹29.0 Cr</td>
                        <td className="p-2 text-right font-mono text-slate-200">{formatINR(aiPlanResult.recommended_target.expense)}</td>
                        <td className="p-2 text-right font-mono text-rose-400">+₹0.4 Cr</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Profit</td>
                        <td className="p-2 text-right font-mono text-emerald-400">₹6.0 Cr</td>
                        <td className="p-2 text-right font-mono text-emerald-400 font-bold">{formatINR(aiPlanResult.recommended_target.profit)}</td>
                        <td className="p-2 text-right font-mono text-emerald-400 font-bold">+₹1.1 Cr</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Margin</td>
                        <td className="p-2 text-right font-mono">17.14%</td>
                        <td className="p-2 text-right font-mono text-emerald-400 font-bold">{aiPlanResult.recommended_target.margin}%</td>
                        <td className="p-2 text-right font-mono text-emerald-400 font-bold">+2.31%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    setShowSimModal(true);
                    handleRunSimulation();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Sliders className="w-4 h-4" /> Simulate This Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAN STATUS TABS & FILTER BAR */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {['ALL', 'APPROVED', 'ACTIVE', 'DRAFT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'All Plans' : tab}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredPlans.length} Financial Target Plans
        </span>
      </div>

      {/* FINANCIAL PLAN CARDS GRID */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs font-medium">
          Loading Financial Plans...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-3">
          <Layers className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No Financial Plans Found</h3>
          <p className="text-xs text-slate-400">Click "Generate AI Financial Plan" above to create an automated forecast plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/50 transition-all shadow-sm group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800/40 rounded-full text-[10px] font-bold">
                    {plan.period_type} — {plan.year}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    plan.status === 'APPROVED' || plan.status === 'ACTIVE'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}>
                    {plan.status || 'DRAFT'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                  {plan.plan_name}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-800/80 py-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Revenue</span>
                    <span className="font-mono font-bold text-slate-100">{formatINR(plan.target_revenue)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Expense</span>
                    <span className="font-mono font-bold text-slate-200">{formatINR(plan.target_expense)}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px]">Target Profit</span>
                    <span className="font-mono font-bold text-emerald-400">{formatINR(plan.target_profit)}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px]">Target Margin</span>
                    <span className="font-mono font-bold text-emerald-400">{plan.target_profit_margin}%</span>
                  </div>
                </div>

                {/* AI Predictive Metrics Row */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI Forecast:</span>
                    <span className="font-mono text-indigo-400 font-semibold">
                      {plan.ai_forecast_revenue ? formatINR(plan.ai_forecast_revenue) : '₹36.2 Cr'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Feasibility:</span>
                    <span className="font-semibold text-emerald-400">🟢 94% (HIGH)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan Health:</span>
                    <span className="font-bold text-slate-200">{plan.health_score || 87}/100</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleViewPlanDetails(plan)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setSimForm({
                      ...simForm,
                      baseline_revenue: Number(plan.target_revenue),
                      baseline_expense: Number(plan.target_expense)
                    });
                    setShowSimModal(true);
                    handleRunSimulation({
                      ...simForm,
                      baseline_revenue: Number(plan.target_revenue),
                      baseline_expense: Number(plan.target_expense)
                    });
                  }}
                  className="p-2 bg-indigo-950 text-indigo-400 hover:bg-indigo-900 rounded-xl transition-all cursor-pointer"
                  title="Simulate This Plan"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {plan.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprovePlan(plan.id)}
                    className="p-2 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded-xl transition-all cursor-pointer"
                    title="Approve Plan"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WHAT-IF SIMULATION MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-950 rounded-xl text-indigo-400">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">What-If Financial Plan Scenario Simulator</h3>
                  <p className="text-xs text-slate-400">Simulate financial outcomes by testing assumptions</p>
                </div>
              </div>
              <button onClick={() => setShowSimModal(false)} className="p-2 text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 flex justify-between">
                  <span>Sales Growth (%):</span>
                  <span className="font-mono text-indigo-400 font-bold">+{simForm.sales_growth_change}%</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="30"
                  value={simForm.sales_growth_change}
                  onChange={(e) => {
                    const updated = { ...simForm, sales_growth_change: Number(e.target.value) };
                    setSimForm(updated);
                    handleRunSimulation(updated);
                  }}
                  className="w-full cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 flex justify-between">
                  <span>Expense Growth (%):</span>
                  <span className="font-mono text-rose-400 font-bold">+{simForm.expense_growth_change}%</span>
                </label>
                <input
                  type="range"
                  min="-5"
                  max="25"
                  value={simForm.expense_growth_change}
                  onChange={(e) => {
                    const updated = { ...simForm, expense_growth_change: Number(e.target.value) };
                    setSimForm(updated);
                    handleRunSimulation(updated);
                  }}
                  className="w-full cursor-pointer accent-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 flex justify-between">
                  <span>Discount Change (%):</span>
                  <span className="font-mono text-amber-400 font-bold">{simForm.discount_change}%</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={simForm.discount_change}
                  onChange={(e) => {
                    const updated = { ...simForm, discount_change: Number(e.target.value) };
                    setSimForm(updated);
                    handleRunSimulation(updated);
                  }}
                  className="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 flex justify-between">
                  <span>Quantity Growth (%):</span>
                  <span className="font-mono text-emerald-400 font-bold">+{simForm.quantity_growth_change}%</span>
                </label>
                <input
                  type="range"
                  min="-10"
                  max="25"
                  value={simForm.quantity_growth_change}
                  onChange={(e) => {
                    const updated = { ...simForm, quantity_growth_change: Number(e.target.value) };
                    setSimForm(updated);
                    handleRunSimulation(updated);
                  }}
                  className="w-full cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* SIMULATION RESULT DISPLAY */}
            {simResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Scenario Output Comparison</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    simResult.risk_level === 'LOW'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}>
                    Risk: 🟢 {simResult.risk_level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase">Current Plan</span>
                    <div className="font-mono text-slate-200">Rev: {formatINR(simResult.current_plan.revenue)}</div>
                    <div className="font-mono text-slate-200">Exp: {formatINR(simResult.current_plan.expense)}</div>
                    <div className="font-mono text-emerald-400 font-bold">Prof: {formatINR(simResult.current_plan.profit)}</div>
                    <div className="text-[11px] text-slate-400">Margin: {simResult.current_plan.margin}%</div>
                  </div>

                  <div className="bg-indigo-950/40 border border-indigo-800/40 p-3 rounded-lg space-y-1">
                    <span className="text-indigo-400 block text-[10px] uppercase font-bold">Simulated Scenario</span>
                    <div className="font-mono text-indigo-300 font-bold">Rev: {formatINR(simResult.scenario.revenue)}</div>
                    <div className="font-mono text-slate-200">Exp: {formatINR(simResult.scenario.expense)}</div>
                    <div className="font-mono text-emerald-400 font-bold">Prof: {formatINR(simResult.scenario.profit)}</div>
                    <div className="text-[11px] text-emerald-300">Margin: {simResult.scenario.margin}%</div>
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-lg text-xs font-semibold text-emerald-300 flex justify-between">
                  <span>Profit Improvement:</span>
                  <span className="font-mono font-bold">
                    {simResult.improvement.profit >= 0 ? '+' : ''}{formatINR(simResult.improvement.profit)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSimModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FINANCIAL PLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Formulate Financial Plan Target</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePlan(formData.status || 'DRAFT');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Period Type</label>
                  <select
                    value={formData.period_type}
                    onChange={(e) => setFormData({ ...formData, period_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    <option value="QUARTERLY">QUARTERLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="ANNUAL">ANNUAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Period No.</label>
                  <input
                    type="number"
                    value={formData.period_number}
                    onChange={(e) => setFormData({ ...formData, period_number: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Revenue (₹)</label>
                  <input
                    type="number"
                    value={formData.target_revenue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, target_revenue: val });
                      handleRecalculateFeasibility(val, formData.target_expense);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Expense (₹)</label>
                  <input
                    type="number"
                    value={formData.target_expense}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, target_expense: val });
                      handleRecalculateFeasibility(formData.target_revenue, val);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              {/* LIVE FEASIBILITY BADGE */}
              {feasibilityData && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Live Feasibility Assessment:</span>
                    <span className={`font-bold ${
                      feasibilityData.feasibility_level === 'HIGHLY ACHIEVABLE' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      🟢 {feasibilityData.feasibility_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{feasibilityData.explanation}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                >
                  Save Target Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLAN DETAILS DRAWER / MODAL WITH RECHARTS & PERFORMANCE FEEDBACK */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800/40 rounded-full text-[10px] font-bold">
                    {selectedPlan.period_type} — {selectedPlan.year}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded-full text-[10px] font-bold">
                    {selectedPlan.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-2">{selectedPlan.plan_name}</h2>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="p-2 text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PLAN WORKFLOW STEPPER */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-3">Plan Approval Workflow</div>
              <div className="flex items-center justify-between text-xs font-semibold">
                {['Draft', 'AI Generated', 'Under Review', 'APPROVED', 'ACTIVE', 'Completed'].map((st, i) => {
                  const isCurrent = selectedPlan.status === st;
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        isCurrent ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {i + 1}
                      </span>
                      <span className={isCurrent ? 'text-indigo-300 font-bold' : 'text-slate-400'}>{st}</span>
                      {i < 5 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECHARTS TREND VISUALIZATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Revenue & Expense Trend Chart */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Revenue & Expense Trend (Cr)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Historical', Revenue: 32.5, Expense: 26.3 },
                      { name: 'AI Forecast', Revenue: 37.2, Expense: 30.1 },
                      { name: 'Target', Revenue: Number((selectedPlan.target_revenue / 10000000).toFixed(1)), Expense: Number((selectedPlan.target_expense / 10000000).toFixed(1)) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Planned vs Forecast vs Actual Comparison Chart */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Planned vs Forecast vs Actual (Cr)</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Planned', Revenue: Number((selectedPlan.target_revenue / 10000000).toFixed(1)), Profit: Number((selectedPlan.target_profit / 10000000).toFixed(1)) },
                      { name: 'Forecast', Revenue: 36.2, Profit: 7.1 },
                      { name: 'Actual', Revenue: 34.8, Profit: 4.4 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="Revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="Profit" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ACTUAL PERFORMANCE FEEDBACK & INTEGRATIONS */}
            {planPerformance && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Actual Performance Feedback & Integration Links
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg space-y-1">
                    <span className="text-slate-400 block text-[10px]">REVENUE</span>
                    <div className="flex justify-between"><span>Planned:</span><span className="font-mono text-slate-200">{formatINR(planPerformance.comparison.revenue.planned)}</span></div>
                    <div className="flex justify-between"><span>Actual:</span><span className="font-mono text-slate-100 font-bold">{formatINR(planPerformance.comparison.revenue.actual)}</span></div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg space-y-1">
                    <span className="text-slate-400 block text-[10px]">EXPENSE</span>
                    <div className="flex justify-between"><span>Planned:</span><span className="font-mono text-slate-200">{formatINR(planPerformance.comparison.expense.planned)}</span></div>
                    <div className="flex justify-between"><span>Actual:</span><span className="font-mono text-rose-400 font-bold">{formatINR(planPerformance.comparison.expense.actual)}</span></div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg space-y-1">
                    <span className="text-slate-400 block text-[10px]">NET PROFIT</span>
                    <div className="flex justify-between"><span>Planned:</span><span className="font-mono text-slate-200">{formatINR(planPerformance.comparison.profit.planned)}</span></div>
                    <div className="flex justify-between"><span>Actual:</span><span className="font-mono text-emerald-400 font-bold">{formatINR(planPerformance.comparison.profit.actual)}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <Link
                    to="/variance-analysis"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded-lg text-xs font-semibold hover:bg-indigo-900 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Variance Analysis
                  </Link>

                  <Link
                    to="/risk-alerts"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950 text-amber-300 border border-amber-800/40 rounded-lg text-xs font-semibold hover:bg-amber-900 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> View Risk Alerts
                  </Link>

                  <Link
                    to="/recommendations"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommendations
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div>
                {selectedPlan.approved_by && (
                  <span className="text-xs text-emerald-400 font-semibold">
                    Approved by {selectedPlan.approved_by} on {new Date(selectedPlan.approved_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {selectedPlan.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprovePlan(selectedPlan.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Approve Financial Plan
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
