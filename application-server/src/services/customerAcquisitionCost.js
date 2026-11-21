/**
 * Customer Acquisition Cost (CAC) & LTV Payback Period Tracker
 */
class CustomerAcquisitionCostService {
  static calculateMetrics(totalMarketingSpend, newCustomersAcquired, averageOrderValue, purchaseFrequencyPerYear, grossMarginPercent, annualChurnRatePercent) {
    if (newCustomersAcquired <= 0) throw new Error('New customers acquired must be greater than zero');

    const blendedCac = Number((totalMarketingSpend / newCustomersAcquired).toFixed(2));
    const annualCustomerRevenue = averageOrderValue * purchaseFrequencyPerYear;
    const annualCustomerGrossMargin = annualCustomerRevenue * (grossMarginPercent / 100);

    const customerLifetimeYears = annualChurnRatePercent > 0 ? (100 / annualChurnRatePercent) : 5.0;
    const ltv = Number((annualCustomerGrossMargin * customerLifetimeYears).toFixed(2));

    const ltvToCacRatio = blendedCac > 0 ? Number((ltv / blendedCac).toFixed(2)) : 0;
    const paybackPeriodMonths = annualCustomerGrossMargin > 0
      ? Number(((blendedCac / annualCustomerGrossMargin) * 12).toFixed(1))
      : 99.0;

    return {
      blendedCac,
      customerLifetimeValue: ltv,
      ltvToCacRatio,
      paybackPeriodMonths,
      isHealthyUnitEconomics: ltvToCacRatio >= 3.0 && paybackPeriodMonths <= 12.0
    };
  }
}

module.exports = CustomerAcquisitionCostService;
