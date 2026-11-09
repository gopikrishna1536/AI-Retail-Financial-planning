import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  TrendingUp,
  Store,
  Compass,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  Printer,
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
  Users,
  Maximize2,
  Calendar,
  Tag,
  ShoppingBag,
  Wrench,
  Target,
  FileText,
  CheckSquare,
  Zap,
  Layers,
  TrendingDown,
  ArrowRight,
  Shuffle,
  Building2,
  Scissors,
  PlusCircle,
  ExternalLink
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
  LineChart,
  Line
} from 'recharts';

const CITY_PRESETS = [
  { label: 'All Cities', value: '' },
  { label: 'Delhi NCR', value: 'Delhi', code: '110001' },
  { label: 'Maharashtra (Mumbai)', value: 'Maharashtra', code: '400001' },
  { label: 'Karnataka (Bengaluru)', value: 'Karnataka', code: '560001' },
  { label: 'Tamil Nadu (Chennai)', value: 'Tamil Nadu', code: '600001' },
  { label: 'West Bengal (Kolkata)', value: 'West Bengal', code: '700001' },
  { label: 'Gujarat (Ahmedabad)', value: 'Gujarat', code: '380001' },
  { label: 'Rajasthan (Jaipur)', value: 'Rajasthan', code: '302001' },
  { label: 'Punjab (Chandigarh)', value: 'Punjab', code: '160001' },
  { label: 'Uttar Pradesh (Lucknow)', value: 'Uttar Pradesh', code: '226001' },
  { label: 'Madhya Pradesh (Bhopal)', value: 'Madhya Pradesh', code: '462001' },
];

const STATE_TO_REGION = {
  'Delhi': 'North',
  'Punjab': 'North',
  'Uttar Pradesh': 'North',
  'Maharashtra': 'West',
  'Gujarat': 'West',
  'Rajasthan': 'West',
  'Karnataka': 'South',
  'Tamil Nadu': 'South',
  'West Bengal': 'East',
  'Madhya Pradesh': 'East'
};

const REGION_TO_STATES = {
  'North': ['Delhi', 'Punjab', 'Uttar Pradesh'],
  'West': ['Maharashtra', 'Gujarat', 'Rajasthan'],
  'South': ['Karnataka', 'Tamil Nadu'],
  'East': ['West Bengal', 'Madhya Pradesh']
};

export default function StoreProfitPathway() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState(''); // Default to All Cities & Territories (30 Stores Nationwide)
  const [regionFilter, setRegionFilter] = useState('');
  const [outletFilter, setOutletFilter] = useState('');
  const [selectedPlanYear, setSelectedPlanYear] = useState('ALL');
  const [activeTab, setActiveTab] = useState('YEARLY_PLANS'); // 'YEARLY_PLANS' | 'QUARTERLY_CHECKLIST' | 'TRAJECTORY'
  const [simulateRestructuring, setSimulateRestructuring] = useState(false);

  // Synchronized Filter Handlers - Prevents Impossible Multi-Filter Combinations (0 stores)
  const handleRegionChange = (newRegion) => {
    setRegionFilter(newRegion);
    // If a state was selected that does NOT belong to this new region, reset stateFilter so all stores in this region show
    if (newRegion && stateFilter) {
      const allowedStates = REGION_TO_STATES[newRegion] || [];
      if (!allowedStates.includes(stateFilter)) {
        setStateFilter('');
      }
    }
  };

  const handleStateChange = (newState) => {
    setStateFilter(newState);
    // Auto-align regionFilter so they never conflict and return 0 stores
    if (newState && STATE_TO_REGION[newState]) {
      setRegionFilter(STATE_TO_REGION[newState]);
    } else if (!newState) {
      setRegionFilter('');
    }
  };

  const handleResetFilters = () => {
    setStateFilter('');
    setRegionFilter('');
    setOutletFilter('');
    setSearchTerm('');
  };

  // Interactive Simulation Levers
  const [discountReduction, setDiscountReduction] = useState(0);
  const [assortmentShift, setAssortmentShift] = useState(0);
  const [opexSavings, setOpexSavings] = useState(0);

  const fetchPathways = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stateFilter) params.append('state', stateFilter);
      if (regionFilter) params.append('region', regionFilter);
      if (outletFilter) params.append('outlet_type', outletFilter);
      if (discountReduction) params.append('discount_reduction', discountReduction);
      if (assortmentShift) params.append('assortment_shift', assortmentShift);
      if (opexSavings) params.append('opex_savings', opexSavings);

      const res = await api.get(`/store-pathway?${params.toString()}`);
      if (res.success) {
        setData(res.data);
        if (res.data.stores?.length > 0) {
          // If the currently selected store is not in the filtered list, select the first one
          const exists = res.data.stores.some(s => s.store_id === selectedStoreId);
          if (!exists) {
            setSelectedStoreId(res.data.stores[0].store_id);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load store profit pathway roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathways();
  }, [stateFilter, regionFilter, outletFilter, discountReduction, assortmentShift, opexSavings]);

  const activeStore = data?.stores?.find(s => s.store_id === selectedStoreId) || data?.stores?.[0];

  const filteredStores = data?.stores?.filter(s => {
    const matchesSearch = s.store_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const formatLakhOrCr = (num) => {
    const val = Number(num) || 0;
    if (Math.abs(val) >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  const clusterAnalysis = data?.cluster_analysis;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-3 text-indigo-400 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Modeling 5-Year Store Profit Optimization Pathways & Real Estate Directives...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Module Header & Strategic Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              Autonomous Real Estate & Network Decision Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">• 30 Operating Stores Across 10 Commercial Hubs</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            Store Profit Pathway & Network Restructuring Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Goes beyond descriptive data analysis: generates store closure directives, micro-market greenfield expansion orders, 
            and dedicated 5-year unit-economics operational plans (what to increase, what to reduce, and layout renovations) for every retail outlet.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print Blueprint
          </button>
          <button
            onClick={fetchPathways}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalculate Models
          </button>
        </div>
      </div>

      {/* 2. City / Location Quick-Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Filter City Cluster & Real Estate Catchment
            </span>
            <span className="text-[11px] text-slate-400">
              (Aggregates all shops in selected territory to trigger closure & expansion directives)
            </span>
          </div>
          {stateFilter ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Territory: {stateFilter} Cluster (3 Stores)
              </span>
              <button
                onClick={() => handleStateChange('')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Reset to All 30 Stores
              </button>
            </div>
          ) : (
            <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/40">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Active View: Nationwide Portfolio (All 30 Stores Across 10 Hubs)
            </span>
          )}
        </div>

        {/* Territory Filter Dropdown & Quick Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Explicit Dropdown Selector for Location/City */}
          <div className="w-full lg:w-80 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2 shrink-0 shadow-inner">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <select
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent border-none text-slate-100 text-xs font-bold focus:outline-none cursor-pointer w-full"
            >
              <option value="">All Cities & Territories (30 Stores)</option>
              {CITY_PRESETS.filter(c => c.value).map((city) => (
                <option key={city.value} value={city.value} className="bg-slate-900">
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin flex-1">
            {CITY_PRESETS.map((city) => (
              <button
                key={city.value}
                onClick={() => handleStateChange(city.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  stateFilter === city.value
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{city.label}</span>
                {city.code && <span className="text-[10px] opacity-70">({city.code})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CITY CLUSTER REAL ESTATE DIRECTIVES & NETWORK RESTRUCTURING WORKBENCH */}
      {clusterAnalysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  {clusterAnalysis.city_meta.city_name} Real Estate Network Directives
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                  {clusterAnalysis.cluster_summary.stores_count} Operating Stores
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Territory Hub: <span className="text-slate-200 font-medium">{clusterAnalysis.city_meta.primary_hub}</span> • 
                Combined Retail Footprint: <span className="text-slate-200 font-medium">{clusterAnalysis.cluster_summary.total_retail_sqft.toLocaleString()} sq ft</span> • 
                Cluster Sales Density: <span className="text-slate-200 font-medium">₹{clusterAnalysis.cluster_summary.sales_density_per_sqft}/sq ft</span>
              </p>
            </div>

            {/* Network Restructuring Simulator Toggle */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-2 rounded-xl">
              <span className="text-xs text-slate-300 font-medium">
                Simulate Restructuring:
              </span>
              <button
                onClick={() => setSimulateRestructuring(!simulateRestructuring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  simulateRestructuring ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulateRestructuring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${simulateRestructuring ? 'text-emerald-400' : 'text-slate-400'}`}>
                {simulateRestructuring ? 'Restructured Network' : 'Current Baseline'}
              </span>
            </div>
          </div>

          {/* Cluster Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Combined Territory Sales</p>
              <p className="text-lg font-black text-slate-100 mt-0.5">
                {formatLakhOrCr(
                  simulateRestructuring
                    ? clusterAnalysis.network_synergy_simulation.restructured.revenue
                    : clusterAnalysis.cluster_summary.total_revenue
                )}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {simulateRestructuring ? (
                  <span className="text-emerald-400 font-semibold">
                    +{clusterAnalysis.network_synergy_simulation.impact.revenue_growth_pct}% network growth
                  </span>
                ) : (
                  'Sum of active stores in cluster'
                )}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Territory Fixed OpEx</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">
                {formatLakhOrCr(
                  simulateRestructuring
                    ? clusterAnalysis.network_synergy_simulation.restructured.opex
                    : clusterAnalysis.cluster_summary.total_opex
                )}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {simulateRestructuring ? 'Optimized lease footprint' : 'Lease, utilities & store labor'}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Cluster Net EBITDA</p>
              <p className={`text-lg font-black mt-0.5 ${
                (simulateRestructuring ? clusterAnalysis.network_synergy_simulation.restructured.ebitda : clusterAnalysis.cluster_summary.net_profit) >= 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}>
                {formatLakhOrCr(
                  simulateRestructuring
                    ? clusterAnalysis.network_synergy_simulation.restructured.ebitda
                    : clusterAnalysis.cluster_summary.net_profit
                )}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {simulateRestructuring ? (
                  <span className="text-emerald-400 font-bold">
                    +₹{(clusterAnalysis.network_synergy_simulation.impact.ebitda_gain / 100000).toFixed(1)}L EBITDA surge!
                  </span>
                ) : (
                  `Margin: ${clusterAnalysis.cluster_summary.net_margin_pct}%`
                )}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-medium">Sales Density / Sq Ft</p>
              <p className="text-lg font-black text-indigo-300 mt-0.5">
                ₹{simulateRestructuring
                  ? clusterAnalysis.network_synergy_simulation.restructured.sales_density
                  : clusterAnalysis.cluster_summary.sales_density_per_sqft}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {simulateRestructuring ? (
                  <span className="text-indigo-400 font-semibold">
                    +₹{clusterAnalysis.network_synergy_simulation.impact.sales_density_gain}/sq ft space lift
                  </span>
                ) : (
                  'Territory average productivity'
                )}
              </p>
            </div>
          </div>

          {/* TWO PRIMARY OPERATIONAL DIRECTIVES: CLOSURE ORDER & EXPANSION DIRECTIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DIRECTIVE 1: STORE CLOSURE / CONSOLIDATION ORDER (RED) */}
            <div className="bg-slate-950/90 border border-rose-900/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg shadow-rose-950/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-rose-900/30 pb-3">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    {clusterAnalysis.closure_directive.directive_badge}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40">
                  {clusterAnalysis.closure_directive.exit_timeline}
                </span>
              </div>

              {/* Target Candidate Details */}
              <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      Target Store: {clusterAnalysis.closure_directive.target_store_code}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Format: {clusterAnalysis.closure_directive.outlet_type} • Annual Revenue: {formatLakhOrCr(clusterAnalysis.closure_directive.current_annual_revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Current EBITDA Drag</span>
                    <p className={`text-xs font-bold ${clusterAnalysis.closure_directive.current_net_profit < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {formatLakhOrCr(clusterAnalysis.closure_directive.current_net_profit)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong className="text-rose-300">Commercial Justification: </strong>
                  {clusterAnalysis.closure_directive.commercial_rationale}
                </p>
              </div>

              {/* Financial Impact of Closure */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Direct OpEx Savings</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    +{formatLakhOrCr(clusterAnalysis.closure_directive.annual_lease_savings)} / year
                  </p>
                  <p className="text-[10px] text-slate-500">Rent, power & maintenance</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Current Sales Density</span>
                  <p className="text-sm font-bold text-rose-400 mt-0.5">
                    ₹{clusterAnalysis.closure_directive.current_sales_density} / sq ft
                  </p>
                  <p className="text-[10px] text-slate-500">Severe space underproductivity</p>
                </div>
              </div>

              {/* Operational Action Plan for Store Shutdown */}
              <div className="space-y-2 pt-1">
                <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Store Shutdown & Asset Redeployment Protocol
                </h5>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Inventory Transfer:</strong> {clusterAnalysis.closure_directive.inventory_transfer_plan}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Staff Protection:</strong> {clusterAnalysis.closure_directive.staff_redeployment_plan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DIRECTIVE 2: GREENFIELD EXPANSION ORDER (EMERALD) */}
            <div className="bg-slate-950/90 border border-emerald-900/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg shadow-emerald-950/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    {clusterAnalysis.expansion_directive.directive_badge}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Breakeven: {clusterAnalysis.expansion_directive.breakeven_months} Mos
                </span>
              </div>

              {/* Expansion Site Details */}
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      Target Micro-Market: {clusterAnalysis.expansion_directive.target_location}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Alt Location: {clusterAnalysis.expansion_directive.alternative_location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Format Profile</span>
                    <p className="text-xs font-bold text-emerald-400">
                      {clusterAnalysis.expansion_directive.recommended_format}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong className="text-emerald-300">Target Demographic: </strong>
                  {clusterAnalysis.expansion_directive.target_demographic}
                </p>
              </div>

              {/* Financial Projections for Expansion Store */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Year-1 Revenue</span>
                  <p className="text-sm font-bold text-slate-100 mt-0.5">
                    {formatLakhOrCr(clusterAnalysis.expansion_directive.projected_year1_revenue)}
                  </p>
                  <p className="text-[10px] text-slate-500">Projected run-rate</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Year-1 EBITDA</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {formatLakhOrCr(clusterAnalysis.expansion_directive.projected_year1_ebitda)}
                  </p>
                  <p className="text-[10px] text-slate-500">Margin: {clusterAnalysis.expansion_directive.projected_margin_pct}%</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Fit-Out CapEx</span>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">
                    {formatLakhOrCr(clusterAnalysis.expansion_directive.estimated_capex)}
                  </p>
                  <p className="text-[10px] text-slate-500">Refrigeration & POS</p>
                </div>
              </div>

              {/* Strategic Rationale & Cannibalization Assessment */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong>Strategic Rationale:</strong> {clusterAnalysis.expansion_directive.strategic_rationale}</span>
                </div>
                <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                  <span>Cannibalization Risk Assessment:</span>
                  <span className="font-bold text-emerald-400">{clusterAnalysis.expansion_directive.cannibalization_risk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR COMPARISON BANNER */}
          {simulateRestructuring && (
            <div className="bg-emerald-950/40 border border-emerald-600/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">
                    Network Restructuring Directive Applied (Closure + Expansion)
                  </h4>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Closing {clusterAnalysis.closure_directive.target_store_code} and opening the {clusterAnalysis.expansion_directive.target_location} hub yields a net EBITDA profit surge of <strong>+₹{(clusterAnalysis.network_synergy_simulation.impact.ebitda_gain / 100000).toFixed(1)} Lakhs</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">EBITDA Margin</span>
                  <p className="text-sm font-bold text-emerald-400">
                    {clusterAnalysis.network_synergy_simulation.restructured.ebitda_margin}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Sales / Sq Ft</span>
                  <p className="text-sm font-bold text-emerald-400">
                    ₹{clusterAnalysis.network_synergy_simulation.restructured.sales_density}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Quick-Switch Hub Selector */}
          {clusterAnalysis.all_clusters_summary?.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Commercial Hub Breakdown (Click Any Hub to Focus Territory Directives):
                </span>
                {stateFilter && (
                  <button
                    onClick={() => handleStateChange('')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>← Show All 30 Stores Nationwide</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {clusterAnalysis.all_clusters_summary.map((hub) => (
                  <button
                    key={hub.state}
                    onClick={() => handleStateChange(hub.state)}
                    className={`p-2.5 rounded-xl border text-left transition-all group ${
                      stateFilter === hub.state
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-500'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                        {hub.state}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{hub.stores_count} stores</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      {formatLakhOrCr(hub.annual_revenue)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      Site: {hub.expansion_target.split('(')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Chain-Wide Executive Upside Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Baseline Annual Profit
          </p>
          <h3 className="text-2xl font-black text-slate-100 mt-1">
            {formatLakhOrCr(data?.chain_summary?.current_annual_profit)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {data?.chain_summary?.total_stores || 30} stores • Margin: {((data?.chain_summary?.current_annual_profit / Math.max(1, data?.chain_summary?.current_annual_revenue)) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            2030 Target Terminal Profit
          </p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {formatLakhOrCr(data?.chain_summary?.projected_2030_profit)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Target annual EBITDA by 2030 (Year 5)
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            5-Year Cumulative Profit Upside
          </p>
          <h3 className="text-2xl font-black text-emerald-300 mt-1">
            +{formatLakhOrCr(data?.chain_summary?.total_5year_profit_upside)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Annual profit delta generated over baseline
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Projected Margin Expansion
          </p>
          <h3 className="text-2xl font-black text-indigo-300 mt-1">
            +{data?.chain_summary?.projected_margin_expansion || '10.8'}%
          </h3>
          <p className="text-[11px] text-slate-300 mt-1">
            Terminal EBITDA margin target: 14-16%
          </p>
        </div>
      </div>

      {/* 5. Interactive Store Selector & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Store Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Store className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-400 font-medium shrink-0">Select Store:</span>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="bg-transparent border-none text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer max-w-[280px] sm:max-w-md"
            >
              {filteredStores.length === 0 ? (
                <option value="" className="bg-slate-900">No stores match filters</option>
              ) : (
                filteredStores.map((s) => (
                  <option key={s.store_id} value={s.store_id} className="bg-slate-900">
                    {s.store_code} • {s.locality ? `${s.locality} (${s.state})` : s.state} — {s.outlet_type} ({s.baseline.annual_net_profit >= 0 ? '+' : ''}₹{(s.baseline.annual_net_profit / 100000).toFixed(1)}L)
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={regionFilter}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="bg-transparent border-none text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Regions (30 stores)</option>
              <option value="North" className="bg-slate-900">North Region (Delhi, Punjab, UP - 9 stores)</option>
              <option value="West" className="bg-slate-900">West Region (Mumbai, Gujarat, Jaipur - 9 stores)</option>
              <option value="South" className="bg-slate-900">South Region (Bengaluru, Chennai - 6 stores)</option>
              <option value="East" className="bg-slate-900">East & Central (Kolkata, Bhopal - 6 stores)</option>
            </select>
          </div>

          {/* Outlet Type Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              className="bg-transparent border-none text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Outlet Sizes</option>
              <option value="Large" className="bg-slate-900">Large Hypermarket (12k sqft)</option>
              <option value="Medium" className="bg-slate-900">Medium Supermarket (6.5k sqft)</option>
              <option value="Small" className="bg-slate-900">Small Express Store (3.2k sqft)</option>
            </select>
          </div>

          {(stateFilter || regionFilter || outletFilter || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all shrink-0"
              title="Reset all filters to view all 30 stores"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search store code or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {activeStore ? (
        <>
          {/* 6. Active Store Profile & Unit Economics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-100">{activeStore.store_code}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    activeStore.recommendation_badge === 'STAR PERFORMER'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                      : 'bg-amber-950 text-amber-400 border-amber-800/40'
                  }`}>
                    {activeStore.recommendation_badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                    {activeStore.outlet_type} • {activeStore.city_type}
                  </span>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-200 font-bold">
                      {activeStore.locality || `${activeStore.state} Outlet`}
                    </span>
                    <span className="text-slate-400">• {activeStore.address}</span>
                  </div>

                  {activeStore.landmark && (
                    <p className="text-[11px] text-slate-400 pl-5">
                      <span className="text-amber-400 font-medium">Landmark:</span> {activeStore.landmark}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pl-5 pt-0.5 text-[11px] text-slate-400">
                    <span>Floor Area: <strong className="text-slate-200">{activeStore.baseline.estimated_sqft.toLocaleString()} sq ft</strong></span>
                    <span>Staff: <strong className="text-slate-200">{activeStore.baseline.staff_count} associates</strong></span>
                    {activeStore.manager_name && <span>Manager: <strong className="text-slate-200">{activeStore.manager_name}</strong></span>}
                    {activeStore.operating_hours && <span>Hours: <strong className="text-slate-200">{activeStore.operating_hours}</strong></span>}
                  </div>
                </div>

                {activeStore.store_diagnosis?.category_focus && (
                  <p className="text-xs text-indigo-300 mt-2 font-medium bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
                    {activeStore.store_diagnosis.category_focus}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Baseline Net Profit</p>
                  <p className={`text-sm font-bold ${activeStore.baseline.annual_net_profit >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                    {formatLakhOrCr(activeStore.baseline.annual_net_profit)}
                  </p>
                  <p className="text-[10px] text-slate-400">Margin: {activeStore.baseline.net_margin_pct}%</p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-right">
                  <p className="text-[11px] text-emerald-400 font-semibold">2030 Target Profit</p>
                  <p className="text-base font-extrabold text-emerald-400">{formatLakhOrCr(activeStore.projected_2030.net_profit)}</p>
                  <p className="text-[10px] text-emerald-500 font-medium">Margin: {activeStore.projected_2030.profit_margin}%</p>
                </div>
              </div>
            </div>

            {/* Store Unit Economics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">Annualized Revenue</p>
                <p className="text-sm font-bold text-slate-100 mt-0.5">{formatLakhOrCr(activeStore.baseline.annual_revenue)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">₹{activeStore.baseline.sales_per_sqft}/sq ft</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">Gross Margin %</p>
                <p className="text-sm font-bold text-indigo-400 mt-0.5">{activeStore.baseline.gross_margin_pct}%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{formatLakhOrCr(activeStore.baseline.gross_profit)} pool</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">Avg Discount Rate</p>
                <p className="text-sm font-bold text-rose-400 mt-0.5">{activeStore.baseline.avg_discount_pct}%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Ceiling: 18.0%</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">Annual Store OpEx</p>
                <p className="text-sm font-bold text-amber-400 mt-0.5">{formatLakhOrCr(activeStore.baseline.annual_opex)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{activeStore.baseline.staff_count} associates & rent</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">Average Ticket Value</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">₹{activeStore.baseline.avg_ticket_value?.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{activeStore.baseline.annual_transactions?.toLocaleString()} txns/yr</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400 font-medium">2030 Sales / Sq Ft</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">₹{activeStore.projected_2030.sales_per_sqft}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">+₹{(activeStore.projected_2030.sales_per_sqft - activeStore.baseline.sales_per_sqft)}/sq ft gain</p>
              </div>
            </div>

            {/* Turnaround Diagnosis Alert */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              activeStore.store_diagnosis.severity === 'CRITICAL TURNAROUND'
                ? 'bg-rose-950/30 border-rose-800/50'
                : 'bg-indigo-950/30 border-indigo-800/50'
            }`}>
              <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${
                activeStore.store_diagnosis.severity === 'CRITICAL TURNAROUND' ? 'text-rose-400' : 'text-indigo-400'
              }`} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    activeStore.store_diagnosis.severity === 'CRITICAL TURNAROUND' ? 'text-rose-300' : 'text-indigo-300'
                  }`}>
                    {activeStore.store_diagnosis.severity}
                  </span>
                  <span className="text-xs text-slate-400">• {activeStore.store_diagnosis.primary_leak}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeStore.store_diagnosis.summary}
                </p>
              </div>
            </div>
          </div>

          {/* 7. Action Blueprint Tabs & Multi-Year Operational Plans */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('YEARLY_PLANS')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'YEARLY_PLANS'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>5-Year Action Blueprint (2026–2030)</span>
                </button>

                <button
                  onClick={() => setActiveTab('QUARTERLY_CHECKLIST')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'QUARTERLY_CHECKLIST'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Quarterly Execution Roadmap (2026)</span>
                </button>

                <button
                  onClick={() => setActiveTab('TRAJECTORY')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'TRAJECTORY'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Financial Simulation & Levers</span>
                </button>
              </div>

              {activeTab === 'YEARLY_PLANS' && (
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                  {['ALL', 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedPlanYear(yr)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedPlanYear === yr
                          ? 'bg-slate-800 text-indigo-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {yr === 'ALL' ? 'All 5 Years' : yr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TAB 1: Detailed 5-Year Action Plans - TRULY STORE & YEAR SPECIFIC */}
            {activeTab === 'YEARLY_PLANS' && (
              <div className="space-y-6">
                {(activeStore.detailed_annual_plans || [])
                  .filter((p) => selectedPlanYear === 'ALL' || p.year === selectedPlanYear)
                  .map((plan) => (
                    <div
                      key={plan.year}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-5 hover:border-indigo-500/30 transition-all"
                    >
                      {/* Plan Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-800/60 shadow-inner">
                            {plan.year}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100">{plan.phase_title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{plan.theme}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-950/60 text-rose-300 border border-rose-800/40">
                            Discount Ceiling: {plan.financial_targets.max_discount_ceiling}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                            Target EBITDA: {formatLakhOrCr(plan.financial_targets.net_profit)} ({plan.financial_targets.profit_margin}%)
                          </span>
                        </div>
                      </div>

                      {/* Financial Targets Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">Target Revenue</p>
                          <p className="text-xs font-bold text-slate-100 mt-0.5">{formatLakhOrCr(plan.financial_targets.revenue)}</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">Gross Margin %</p>
                          <p className="text-xs font-bold text-indigo-400 mt-0.5">{plan.financial_targets.gross_margin_pct}%</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">OpEx Budget Cap</p>
                          <p className="text-xs font-bold text-amber-400 mt-0.5">{formatLakhOrCr(plan.financial_targets.opex)}</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">Target EBITDA</p>
                          <p className="text-xs font-bold text-emerald-400 mt-0.5">{formatLakhOrCr(plan.financial_targets.net_profit)}</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">EBITDA Margin</p>
                          <p className="text-xs font-bold text-emerald-300 mt-0.5">{plan.financial_targets.profit_margin}%</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                          <p className="text-[10px] text-slate-400">Sales / Sq Ft</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5">₹{plan.financial_targets.sales_per_sqft}</p>
                        </div>
                        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                          <p className="text-[10px] text-slate-400">Target ATV</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5">₹{plan.financial_targets.atv_target?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* 3 CORE OPERATIONAL DIRECTIVES: WHAT TO INCREASE, WHAT TO REDUCE & LAYOUT RENOVATION */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
                        {/* 1. WHAT MUST BE INCREASED (EMERALD) */}
                        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2">
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                            <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                              What Must Be INCREASED in {plan.year}
                            </h5>
                          </div>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {(plan.what_to_increase || []).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 2. WHAT MUST BE REDUCED (ROSE) */}
                        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-rose-900/30 pb-2">
                            <TrendingDown className="w-4 h-4 text-rose-400" />
                            <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                              What Must Be REDUCED in {plan.year}
                            </h5>
                          </div>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {(plan.what_to_reduce || []).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 3. PHYSICAL STORE & FLOOR LAYOUT MODIFICATIONS (PURPLE) */}
                        <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 border-b border-indigo-900/30 pb-2">
                            <Building className="w-4 h-4 text-indigo-400" />
                            <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                              Physical Store & Floor Layout Modifications
                            </h5>
                          </div>
                          <div className="space-y-2.5">
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {plan.store_layout_changes}
                            </p>
                            <div className="pt-2 border-t border-indigo-900/30 flex items-center justify-between text-xs">
                              <span className="text-slate-400">CapEx Budget:</span>
                              <span className="font-bold text-emerald-400">{plan.capex_investment}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Store Manager Action Deliverables */}
                      <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Store Manager Required Deliverables & Action Milestones
                          </h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          {plan.manager_deliverables.map((deliv, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span className="leading-snug">{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB 2: Quarterly Implementation Checklist (2026) */}
            {activeTab === 'QUARTERLY_CHECKLIST' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Fiscal Year 2026 Immediate Execution Roadmap
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Quarterly checklist for Store Manager ({activeStore.store_code}) and Regional Retail Operations
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                    Execution Year 1
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeStore.quarterly_checklist || []).map((q) => (
                    <div key={q.quarter} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                          {q.quarter}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{q.focus}</span>
                      </div>

                      <div className="space-y-2">
                        {q.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{task}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Target KPI Milestone:</span>
                        <span className="font-bold text-emerald-400">{q.kpi_target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Trajectory & Simulation Levers */}
            {activeTab === 'TRAJECTORY' && (
              <div className="space-y-6">
                {/* Simulation Levers */}
                <div className="bg-slate-950/80 border border-indigo-900/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Interactive Turnaround Levers (Test Custom Strategies)
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setDiscountReduction(0);
                        setAssortmentShift(0);
                        setOpexSavings(0);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Discount Rationalization:</span>
                        <span className="font-bold text-indigo-400">+{discountReduction}% reduction</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={discountReduction}
                        onChange={(e) => setDiscountReduction(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Cuts markdown leakage on everyday staples</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">High-Margin Assortment Shift:</span>
                        <span className="font-bold text-indigo-400">+{assortmentShift}% shelf space</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="1"
                        value={assortmentShift}
                        onChange={(e) => setAssortmentShift(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Reallocates space to private-label & high-margin lines</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Store OpEx & Energy Optimization:</span>
                        <span className="font-bold text-indigo-400">+{opexSavings}% cost reduction</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        step="1"
                        value={opexSavings}
                        onChange={(e) => setOpexSavings(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Optimizes shift scheduling & smart IoT lighting</p>
                    </div>
                  </div>
                </div>

                {/* Trajectory Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200">
                      5-Year Revenue, Cost & Net Profit Trajectory (2026–2030)
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Target: {activeStore.store_code} terminal net margin of {activeStore.projected_2030.profit_margin}%
                    </span>
                  </div>

                  <div className="h-72 w-full bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeStore.trajectory}>
                        <defs>
                          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis
                          stroke="#64748b"
                          tick={{ fontSize: 11 }}
                          tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                          formatter={(val) => [`₹${(val / 100000).toFixed(1)} Lakh`, '']}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" />
                        <Area type="monotone" dataKey="opex" name="Store OpEx" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                        <Area type="monotone" dataKey="net_profit" name="Net Profit (EBITDA)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5 Strategic Pillars Summary */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-slate-200">
                    High-Level Strategic Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeStore.strategic_pillars.map((pillar, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                              {pillar.target_year}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {pillar.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100">{pillar.pillar}</h4>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{pillar.action}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Expected Upside:</span>
                          <span className="font-semibold text-emerald-400">{pillar.financial_impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center mx-auto text-indigo-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">No stores match the active filter criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No retail outlets found for the current combination ({regionFilter ? `Region: ${regionFilter}` : ''}{stateFilter ? ` • State: ${stateFilter}` : ''}{outletFilter ? ` • Format: ${outletFilter}` : ''}).
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30"
          >
            Reset All Filters (Show All 30 Stores)
          </button>
        </div>
      )}

      {/* 8. 30-Store Performance & Pathway Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Territory Store Performance Leaderboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any store row to load its customized 5-year unit economics and action plan</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Showing <strong className="text-slate-200">{filteredStores.length}</strong> of {data?.stores?.length} stores
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Store Code & Region</th>
                <th className="px-4 py-3">Format / City</th>
                <th className="px-4 py-3 text-right">Annual Revenue</th>
                <th className="px-4 py-3 text-right">Gross Margin %</th>
                <th className="px-4 py-3 text-right">Avg Discount</th>
                <th className="px-4 py-3 text-right">Current Profit</th>
                <th className="px-4 py-3 text-right">2030 Target Profit</th>
                <th className="px-4 py-3 text-right">5-Year Upside</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-300">No stores match the active filter selection.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing region or format filter to show all available stores.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Reset All Filters (Show All 30 Stores)
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStores.map((s) => {
                const isSelected = s.store_id === selectedStoreId;
                return (
                  <tr
                    key={s.store_id}
                    onClick={() => setSelectedStoreId(s.store_id)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-950/20 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-200">{s.store_code}</div>
                      <div className="text-[11px] text-emerald-400 font-medium">{s.locality || s.state}</div>
                      <div className="text-[10px] text-slate-400">{s.state} • {s.region}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {s.outlet_type}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.city_type}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-200">
                      {formatLakhOrCr(s.baseline.annual_revenue)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-indigo-400 font-semibold">
                      {s.baseline.gross_margin_pct}%
                    </td>
                    <td className="px-4 py-3.5 text-right text-rose-400 font-medium">
                      {s.baseline.avg_discount_pct}%
                    </td>
                    <td className={`px-4 py-3.5 text-right font-semibold ${
                      s.baseline.annual_net_profit >= 0 ? 'text-slate-200' : 'text-rose-400'
                    }`}>
                      {formatLakhOrCr(s.baseline.annual_net_profit)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-400">
                      {formatLakhOrCr(s.projected_2030.net_profit)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-emerald-400">
                      +{formatLakhOrCr(s.projected_2030.profit_gain_vs_baseline)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStoreId(s.store_id);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
