import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FinancialPlanning from './pages/FinancialPlanning';
import StoreProfitPathway from './pages/StoreProfitPathway';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Forecasting from './pages/Forecasting';
import VarianceAnalysis from './pages/VarianceAnalysis';
import BudgetOptimization from './pages/BudgetOptimization';
import WhatIfAnalysis from './pages/WhatIfAnalysis';
import RiskAlerts from './pages/RiskAlerts';
import Recommendations from './pages/Recommendations';
import Stores from './pages/Stores';
import Products from './pages/Products';
import BusinessUnits from './pages/BusinessUnits';
import Reports from './pages/Reports';
import AWSDeployment from './pages/AWSDeployment';
import Settings from './pages/Settings';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm font-medium">
        Loading FinOptimizer AI Platform...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/store-profit-pathway" element={<StoreProfitPathway />} />
            <Route path="/financial-planning" element={<FinancialPlanning />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/variance-analysis" element={<VarianceAnalysis />} />
            <Route path="/budget-optimization" element={<BudgetOptimization />} />
            <Route path="/what-if-analysis" element={<WhatIfAnalysis />} />
            <Route path="/risk-alerts" element={<RiskAlerts />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/products" element={<Products />} />
            <Route path="/business-units" element={<BusinessUnits />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/aws-deployment" element={<AWSDeployment />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
