/**
 * Retail Markdown & Clearance Optimization Engine.
 * Dynamically computes optimal markdown discount schedules using price elasticity of demand
 * to maximize recovered gross margin dollars before inventory obsolescence.
 */

class MarkdownOptimizationService {
  /**
   * Plans an optimal phased markdown strategy for seasonal retail inventory.
   * @param {Object} item
   * @param {number} item.originalPrice - Full retail price ($)
   * @param {number} item.costPrice - Unit wholesale cost ($)
   * @param {number} item.inventoryUnits - Current on-hand stock
   * @param {number} [item.baseWeeklySales] - Baseline weekly unit sales at full price
   * @param {number} [item.priceElasticity] - Price elasticity coefficient (negative float, e.g. -1.8)
   * @param {number} [item.weeksAvailable] - Weeks until season clearance cutoff (e.g. 6)
   * @returns {Object} Markdown plan schedule with financial recovery projections
   */
  static planMarkdownSchedule(item) {
    const {
      originalPrice,
      costPrice,
      inventoryUnits,
      baseWeeklySales = Math.max(1, Math.round(inventoryUnits * 0.05)),
      priceElasticity = -1.8,
      weeksAvailable = 6
    } = item;

    if (originalPrice <= 0 || costPrice < 0 || inventoryUnits <= 0) {
      throw new Error('Prices and inventory units must be positive numbers.');
    }
    if (priceElasticity >= 0) {
      throw new Error('Price elasticity must be negative for standard retail demand curves.');
    }

    // Standard retail clearance discount progression tiers
    const discountTiers = [0.15, 0.25, 0.40, 0.60];
    const weeksPerTier = Math.max(1, Math.floor(weeksAvailable / discountTiers.length));

    let remainingUnits = inventoryUnits;
    let totalRevenue = 0;
    const schedule = [];

    discountTiers.forEach((discount, idx) => {
      if (remainingUnits <= 0) return;

      const promotionalPrice = Math.round(originalPrice * (1.0 - discount) * 100) / 100;
      // Price drop percentage = discount
      // Sales lift = 1.0 + (|elasticity| * discount)
      const salesLiftMultiplier = 1.0 + (Math.abs(priceElasticity) * discount);
      const estimatedWeeklyDemand = Math.round(baseWeeklySales * salesLiftMultiplier);
      const durationWeeks = (idx === discountTiers.length - 1) 
        ? Math.max(1, weeksAvailable - (weeksPerTier * (discountTiers.length - 1)))
        : weeksPerTier;

      const projectedDemand = estimatedWeeklyDemand * durationWeeks;
      const unitsSold = Math.min(remainingUnits, projectedDemand);
      const tierRevenue = Math.round(unitsSold * promotionalPrice * 100) / 100;

      remainingUnits -= unitsSold;
      totalRevenue += tierRevenue;

      schedule.push({
        phase: `Tier ${idx + 1}`,
        discountPct: Math.round(discount * 100),
        promotionalPrice,
        durationWeeks,
        projectedUnitsSold: unitsSold,
        tierRevenue,
        remainingUnits
      });
    });

    const totalUnitsSold = inventoryUnits - remainingUnits;
    const clearanceRatePct = Math.round((totalUnitsSold / inventoryUnits) * 1000) / 10;
    const totalCostOfSoldGoods = Math.round(totalUnitsSold * costPrice * 100) / 100;
    const netGrossMargin = Math.round((totalRevenue - totalCostOfSoldGoods) * 100) / 100;
    const grossMarginPct = totalRevenue > 0 ? Math.round((netGrossMargin / totalRevenue) * 1000) / 10 : 0;

    return {
      originalPrice,
      costPrice,
      initialInventory: inventoryUnits,
      clearedInventory: totalUnitsSold,
      unsoldInventory: remainingUnits,
      clearanceRatePct,
      totalRecoveredRevenue: Math.round(totalRevenue * 100) / 100,
      netGrossMargin,
      grossMarginPct,
      schedule
    };
  }
}

module.exports = { MarkdownOptimizationService };
