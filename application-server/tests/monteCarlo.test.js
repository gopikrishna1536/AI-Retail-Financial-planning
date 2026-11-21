const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { MonteCarloSimulationService } = require('../src/services/monteCarloSimulationService');

describe('Monte Carlo Capital Risk Simulation Tests', () => {
  test('should generate 1,000 simulations and compute sorted percentiles and VaR', () => {
    const baseline = 1000000; // $1M baseline revenue
    const result = MonteCarloSimulationService.simulateRevenueTrajectories({
      baselineRevenue: baseline,
      meanGrowthRate: 0.05,
      volatility: 0.10,
      periods: 12,
      numSimulations: 1000
    });

    assert.equal(result.numSimulations, 1000);
    assert.equal(result.periods, 12);
    assert.equal(result.baselineRevenue, baseline);

    // Percentiles order: p05 <= p10 <= p50 <= p90 <= p95
    assert.ok(result.percentiles.p05 <= result.percentiles.p10);
    assert.ok(result.percentiles.p10 <= result.percentiles.p50);
    assert.ok(result.percentiles.p50 <= result.percentiles.p90);
    assert.ok(result.percentiles.p90 <= result.percentiles.p95);

    // Median forecast should be within a reasonable band of $1M
    assert.ok(result.medianForecastRevenue > 900000 && result.medianForecastRevenue < 1200000);

    // VaR and CVaR calculations
    assert.ok(result.cvar95Confidence >= result.var95Confidence);
    assert.ok(result.deficitProbabilityPct >= 0 && result.deficitProbabilityPct <= 100);
  });

  test('should reject invalid inputs', () => {
    assert.throws(() => MonteCarloSimulationService.simulateRevenueTrajectories({ baselineRevenue: 0 }), /strictly positive/);
    assert.throws(() => MonteCarloSimulationService.simulateRevenueTrajectories({ baselineRevenue: 100, volatility: -0.1 }), /greater than zero/);
  });
});
