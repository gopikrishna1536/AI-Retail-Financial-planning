/**
 * Price Elasticity of Demand (PED) & Revenue Maximizer
 * PED = (% Change in Quantity Demanded) / (% Change in Price)
 */
class ElasticityPricingEngine {
  static calculateElasticity(p1, q1, p2, q2) {
    if (p1 <= 0 || p2 <= 0 || q1 <= 0 || q2 <= 0) {
      throw new Error('Prices and quantities must be positive non-zero numbers');
    }

    const pctPriceChange = (p2 - p1) / p1;
    const pctQuantityChange = (q2 - q1) / q1;

    const ped = Number((pctQuantityChange / pctPriceChange).toFixed(2));
    const isElastic = Math.abs(ped) > 1.0;

    // Revenue at p1 vs p2
    const rev1 = p1 * q1;
    const rev2 = p2 * q2;

    return {
      priceElasticity: ped,
      isElastic,
      initialRevenue: rev1,
      newRevenue: rev2,
      revenueChange: Number((rev2 - rev1).toFixed(2)),
      pricingStrategy: isElastic ? 'Lower price to expand demand' : 'Increase price to capture consumer surplus'
    };
  }
}

module.exports = ElasticityPricingEngine;
