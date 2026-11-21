/**
 * Multi-Product Break-Even & Margin of Safety Calculator
 * Determines the required sales volume to cover fixed retail store overhead.
 */
class BreakEvenCalculator {
  static computeBreakEven(fixedCosts, unitPrice, variableCostPerUnit, currentSalesUnits) {
    const contributionMargin = unitPrice - variableCostPerUnit;
    if (contributionMargin <= 0) {
      throw new Error('Unit price must be strictly greater than variable unit cost');
    }

    const contributionMarginRatio = contributionMargin / unitPrice;
    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = Number((breakEvenUnits * unitPrice).toFixed(2));

    const marginOfSafetyUnits = Math.max(0, currentSalesUnits - breakEvenUnits);
    const marginOfSafetyPercent = currentSalesUnits > 0
      ? Number(((marginOfSafetyUnits / currentSalesUnits) * 100).toFixed(1))
      : 0;

    return {
      fixedCosts,
      contributionMarginPerUnit: contributionMargin,
      contributionMarginRatio: Number((contributionMarginRatio * 100).toFixed(2)),
      breakEvenUnits,
      breakEvenRevenue,
      currentSalesUnits,
      marginOfSafetyUnits,
      marginOfSafetyPercent
    };
  }
}

module.exports = BreakEvenCalculator;
