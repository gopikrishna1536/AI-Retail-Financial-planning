/**
 * Trade Promotion Uplift vs Cannibalization Simulator
 * Projects net promotional margin factoring in sales lift of promoted item and cannibalization of peer SKUs.
 */
class PromoImpactSimulator {
  static simulatePromotion(baseSales, promoDiscountPercent, volumeLiftPercent, unitMargin, cannibalizationLoss) {
    const promotedSales = baseSales * (1 + volumeLiftPercent / 100);
    const discountedMargin = unitMargin * (1 - promoDiscountPercent / 100);

    const grossPromoProfit = promotedSales * discountedMargin;
    const netPromoProfit = Number((grossPromoProfit - cannibalizationLoss).toFixed(2));
    const baselineProfit = Number((baseSales * unitMargin).toFixed(2));

    const netIncrementalProfit = Number((netPromoProfit - baselineProfit).toFixed(2));

    return {
      baselineProfit,
      netPromoProfit,
      netIncrementalProfit,
      isPromoAccretive: netIncrementalProfit > 0
    };
  }
}

module.exports = PromoImpactSimulator;
