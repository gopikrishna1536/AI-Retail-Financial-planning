/**
 * Retail Store Footprint & Sales Density Optimizer
 * Computes sales per square foot, occupancy cost ratio, and store profitability index.
 */
class StoreFootprintOptimizer {
  static evaluateStore(squareFootage, annualSales, annualRent, utilityCosts, laborCosts) {
    if (squareFootage <= 0 || annualSales < 0) {
      throw new Error('Invalid store parameters');
    }

    const salesPerSqFt = Number((annualSales / squareFootage).toFixed(2));
    const totalOccupancyCost = annualRent + utilityCosts;
    const occupancyRatio = Number(((totalOccupancyCost / annualSales) * 100).toFixed(2));
    const storeOperatingIncome = annualSales - totalOccupancyCost - laborCosts;
    const storeMarginPercent = Number(((storeOperatingIncome / annualSales) * 100).toFixed(2));

    // Healthy retail benchmark: Occupancy ratio < 10%
    const isViable = occupancyRatio <= 12.0 && storeOperatingIncome > 0;

    return {
      squareFootage,
      annualSales,
      salesPerSqFt,
      occupancyRatioPercent: occupancyRatio,
      storeOperatingIncome,
      storeMarginPercent,
      isViable,
      recommendation: isViable ? 'Maintain Store' : 'Renegotiate Lease or Downsize Footprint'
    };
  }
}

module.exports = StoreFootprintOptimizer;
