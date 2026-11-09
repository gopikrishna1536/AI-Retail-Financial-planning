import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  ShoppingBag,
  Receipt,
  PieChart,
  TrendingUp,
  GitCompare,
  Sliders,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Store,
  Package,
  Building2,
  FileSpreadsheet,
  Settings,
  Cloud,
  Compass
} from 'lucide-react';

const navGroups = [
  {
    title: 'Executive & Strategy',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: '5-Year Store Profit Pathway', path: '/store-profit-pathway', icon: Compass, badge: 'New' },
      { name: 'Financial Planning', path: '/financial-planning', icon: CalendarRange },
      { name: 'AI Sales Forecasting', path: '/forecasting', icon: TrendingUp },
    ]
  },
  {
    title: 'Retail Operations',
    items: [
      { name: 'Sales Module', path: '/sales', icon: ShoppingBag },
      { name: 'Expense Module', path: '/expenses', icon: Receipt },
      { name: 'Budget Management', path: '/budgets', icon: PieChart },
      { name: 'Stores Management', path: '/stores', icon: Store },
    ]
  },
  {
    title: 'Decision Support & Risk',
    items: [
      { name: 'Planned vs Actual / Variance', path: '/variance-analysis', icon: GitCompare },
      { name: 'AI Budget Optimization', path: '/budget-optimization', icon: Sliders },
      { name: 'What-If Analysis', path: '/what-if-analysis', icon: Sparkles },
      { name: 'Early Warning Risk Alerts', path: '/risk-alerts', icon: AlertTriangle },
      { name: 'AI Recommendations', path: '/recommendations', icon: Lightbulb },
    ]
  },
  {
    title: 'Enterprise & Cloud',
    items: [
      { name: 'Products & Categories', path: '/products', icon: Package },
      { name: 'Business Units', path: '/business-units', icon: Building2 },
      { name: 'Reports & Export', path: '/reports', icon: FileSpreadsheet },
      { name: 'AWS Console Deployment', path: '/aws-deployment', icon: Cloud, badge: '8 Srv' },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-bold text-lg">
          AI
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-sm tracking-wide leading-tight">FinOptimizer AI</h1>
          <p className="text-[11px] text-slate-400 font-medium">Retail Financial Planning</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-300">RetailCorp India</span>
          <span className="text-emerald-400 font-bold">FY26-27</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">30 Active Retail Outlets</p>
      </div>
    </aside>
  );
}
