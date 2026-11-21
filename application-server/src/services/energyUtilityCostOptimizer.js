/**
 * Retail Commercial Facility Energy & Peak Demand Tariff Optimizer
 * Simulates peak-shaving electricity tariff savings for retail store locations.
 */
class EnergyUtilityCostOptimizer {
  static evaluatePeakShaving(monthlyKWh, offPeakRate, onPeakRate, peakDemandKW, demandChargePerKW, peakReductionPercent) {
    const baseDemandCharge = peakDemandKW * demandChargePerKW;
    const reducedKW = peakDemandKW * (1 - peakReductionPercent / 100);
    const newDemandCharge = reducedKW * demandChargePerKW;

    const monthlySavings = Number((baseDemandCharge - newDemandCharge).toFixed(2));
    const annualSavings = Number((monthlySavings * 12).toFixed(2));

    return {
      originalMonthlyDemandCharge: Number(baseDemandCharge.toFixed(2)),
      optimizedMonthlyDemandCharge: Number(newDemandCharge.toFixed(2)),
      monthlyDemandSavings: monthlySavings,
      projectedAnnualSavings: annualSavings
    };
  }
}

module.exports = EnergyUtilityCostOptimizer;
