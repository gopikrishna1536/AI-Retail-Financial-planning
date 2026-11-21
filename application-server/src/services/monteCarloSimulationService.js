/**
 * Monte Carlo Capital Risk & Financial Trajectory Simulation Service.
 * Simulates stochastic retail cash flows and computes Value-at-Risk (VaR) and Conditional Value-at-Risk (CVaR).
 */

class MonteCarloSimulationService {
  /**
   * Generates standard normally distributed pseudo-random numbers via Box-Muller transform.
   */
  static standardNormal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  /**
   * Runs Monte Carlo simulation of revenue trajectories.
   * @param {Object} params
   * @param {number} params.baselineRevenue - Current starting revenue
   * @param {number} params.meanGrowthRate - Annual expected drift (e.g. 0.08 for 8%)
   * @param {number} params.volatility - Annual standard deviation (e.g. 0.15 for 15%)
   * @param {number} params.periods - Number of forecast periods (e.g. 12 months)
   * @param {number} params.numSimulations - Number of simulation trials (e.g. 1000)
   * @returns {Object} Simulation metrics including VaR and percentile bounds
   */
  static simulateRevenueTrajectories(params) {
    const {
      baselineRevenue,
      meanGrowthRate = 0.05,
      volatility = 0.12,
      periods = 12,
      numSimulations = 1000
    } = params;

    if (baselineRevenue <= 0) {
      throw new Error('Baseline revenue must be strictly positive.');
    }
    if (volatility <= 0) {
      throw new Error('Volatility must be greater than zero.');
    }
    if (periods <= 0 || numSimulations <= 0) {
      throw new Error('Periods and simulation count must be positive integers.');
    }

    const dt = 1.0 / periods;
    const finalRevenues = [];
    const drift = (meanGrowthRate - 0.5 * Math.pow(volatility, 2)) * dt;
    const diffusion = volatility * Math.sqrt(dt);

    for (let sim = 0; sim < numSimulations; sim++) {
      let revenue = baselineRevenue;
      for (let t = 0; t < periods; t++) {
        const shock = MonteCarloSimulationService.standardNormal();
        revenue *= Math.exp(drift + diffusion * shock);
      }
      finalRevenues.push(revenue);
    }

    // Sort ascending for percentile computation
    finalRevenues.sort((a, b) => a - b);

    const getPercentile = (p) => {
      const idx = Math.floor(p * (finalRevenues.length - 1));
      return Math.round(finalRevenues[idx] * 100) / 100;
    };

    const p05 = getPercentile(0.05);
    const p10 = getPercentile(0.10);
    const p50 = getPercentile(0.50); // median
    const p90 = getPercentile(0.90);
    const p95 = getPercentile(0.95);

    // Value at Risk (VaR at 95% confidence) is difference between baseline and 5th percentile
    const var95 = Math.max(0, Math.round((baselineRevenue - p05) * 100) / 100);

    // Conditional Value-at-Risk (CVaR / Expected Shortfall): average of bottom 5%
    const bottom5Count = Math.max(1, Math.floor(0.05 * finalRevenues.length));
    const bottom5Sum = finalRevenues.slice(0, bottom5Count).reduce((sum, v) => sum + v, 0);
    const expectedTailRevenue = bottom5Sum / bottom5Count;
    const cvar95 = Math.max(0, Math.round((baselineRevenue - expectedTailRevenue) * 100) / 100);

    // Insolvency / Deficit probability (probability revenue falls by > 20%)
    const deficitThreshold = baselineRevenue * 0.8;
    const deficitTrials = finalRevenues.filter(r => r < deficitThreshold).length;
    const deficitProbabilityPct = Math.round((deficitTrials / numSimulations) * 1000) / 10;

    return {
      numSimulations,
      periods,
      baselineRevenue,
      medianForecastRevenue: p50,
      percentiles: {
        p05,
        p10,
        p50,
        p90,
        p95
      },
      var95Confidence: var95,
      cvar95Confidence: cvar95,
      deficitProbabilityPct
    };
  }
}

module.exports = { MonteCarloSimulationService };
