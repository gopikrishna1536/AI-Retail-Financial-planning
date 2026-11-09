/**
 * Financial Calculation Engine based on docs/FINANCIAL_ASSUMPTIONS.md
 */

const RENT_LOOKUP = {
  'Large': { 'Tier 1': 150000, 'Tier 2': 110000, 'Village': 75000 },
  'Medium': { 'Tier 1': 90000, 'Tier 2': 65000, 'Village': 40000 },
  'Small': { 'Tier 1': 45000, 'Tier 2': 30000, 'Village': 20000 }
};

const VARIABLE_OPEX_RATES = {
  marketing: 0.065,
  staffing: 0.090,
  utilities: 0.025,
  logistics: 0.035,
  admin: 0.015
};

const TOTAL_VARIABLE_OPEX_RATE = 0.230; // 23% of gross sales

function getStoreMonthlyRent(outletType, cityType) {
  const typeMap = RENT_LOOKUP[outletType] || RENT_LOOKUP['Medium'];
  return typeMap[cityType] || typeMap['Tier 2'] || 65000;
}

function calculateTransactionFinancials(salesAmount, profitAmount, outletType = 'Medium', cityType = 'Tier 2') {
  const sales = Number(salesAmount) || 0;
  const grossProfit = Number(profitAmount) || 0;
  const cogs = sales - grossProfit;

  const variableOpex = sales * TOTAL_VARIABLE_OPEX_RATE;
  
  // Apportion store fixed rent assuming ~300 orders/month average store volume
  const monthlyRent = getStoreMonthlyRent(outletType, cityType);
  const apportionedRent = monthlyRent / 300; 

  const totalOpex = variableOpex + apportionedRent;
  const netProfit = grossProfit - totalOpex;
  const grossMarginPct = sales > 0 ? (grossProfit / sales) * 100 : 0;
  const netMarginPct = sales > 0 ? (netProfit / sales) * 100 : 0;

  return {
    sales,
    cogs,
    grossProfit,
    grossMarginPct: Number(grossMarginPct.toFixed(2)),
    variableOpex,
    apportionedRent,
    totalOpex,
    netProfit: Number(netProfit.toFixed(2)),
    netMarginPct: Number(netMarginPct.toFixed(2))
  };
}

function calculateVariances(planned, actual) {
  const revPlanned = Number(planned.revenue) || 0;
  const revActual = Number(actual.revenue) || 0;
  const revenueVariance = revActual - revPlanned;

  const expPlanned = Number(planned.expense) || 0;
  const expActual = Number(actual.expense) || 0;
  const expenseVariance = expActual - expPlanned;

  const profPlanned = Number(planned.profit) || 0;
  const profActual = Number(actual.profit) || 0;
  const profitVariance = profActual - profPlanned;

  const isFavorable = revenueVariance >= 0 && expenseVariance <= 0 && profitVariance >= 0;

  return {
    revenueVariance: Number(revenueVariance.toFixed(2)),
    expenseVariance: Number(expenseVariance.toFixed(2)),
    profitVariance: Number(profitVariance.toFixed(2)),
    isFavorable
  };
}

function calculateRiskScore(actualExpense, plannedExpense, netProfit, salesGrowth = 0, expenseGrowth = 0) {
  const budgetUtilization = plannedExpense > 0 ? (actualExpense / plannedExpense) * 100 : 100;
  
  let sBudget = 0;
  if (budgetUtilization > 115) sBudget = 100;
  else if (budgetUtilization > 100) sBudget = (budgetUtilization - 100) * 6.6;

  let sMargin = netProfit < 0 ? 100 : (netProfit === 0 ? 50 : 0);
  let sSalesGrowth = salesGrowth < 0 ? Math.min(100, Math.abs(salesGrowth) * 5) : 0;
  let sExpenseGrowth = expenseGrowth > salesGrowth ? Math.min(100, (expenseGrowth - salesGrowth) * 5) : 0;

  const riskScore = (0.35 * sBudget) + (0.30 * sMargin) + (0.20 * sSalesGrowth) + (0.15 * sExpenseGrowth);
  const score = Math.min(100, Math.max(0, Number(riskScore.toFixed(2))));

  let riskLevel = 'LOW';
  if (score >= 75) riskLevel = 'CRITICAL';
  else if (score >= 50) riskLevel = 'HIGH';
  else if (score >= 25) riskLevel = 'MEDIUM';

  return {
    riskScore: score,
    riskLevel
  };
}

module.exports = {
  getStoreMonthlyRent,
  calculateTransactionFinancials,
  calculateVariances,
  calculateRiskScore,
  VARIABLE_OPEX_RATES,
  TOTAL_VARIABLE_OPEX_RATE
};
