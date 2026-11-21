/**
 * Seasonal Budget Allocator
 * Allocates annual retail operating budget across 4 quarters using historical seasonality index.
 */
class SeasonalBudgetAllocater {
  static allocateBudget(annualBudget, seasonalWeights) {
    if (annualBudget <= 0) {
      throw new Error('Budget must be positive');
    }

    const totalWeight = seasonalWeights.reduce((acc, w) => acc + w, 0);
    if (totalWeight <= 0) throw new Error('Weights must sum to > 0');

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const allocation = {};

    let allocatedSum = 0;
    for (let i = 0; i < 4; i++) {
      const q = quarters[i];
      const weight = seasonalWeights[i] || 1.0;
      const amt = Number(((weight / totalWeight) * annualBudget).toFixed(2));
      allocation[q] = amt;
      allocatedSum += amt;
    }

    // Absorb cents rounding difference in Q4
    const delta = Number((annualBudget - allocatedSum).toFixed(2));
    allocation.Q4 = Number((allocation.Q4 + delta).toFixed(2));

    return {
      totalBudget: annualBudget,
      allocation
    };
  }
}

module.exports = SeasonalBudgetAllocater;
