/**
 * Intermodal Freight Cost & Bunker Adjustment Factor (BAF) Calculator
 * Allocates ocean, drayage, and fuel surcharge to inbound inventory units.
 */
class FreightCostAnalyzer {
  static computeLandedFreight(containerBaseRate, fuelSurchargePercent, customsClearanceFee, unitCount) {
    if (unitCount <= 0) throw new Error('Unit count must be greater than zero');

    const fuelCost = containerBaseRate * (fuelSurchargePercent / 100);
    const totalFreightCost = containerBaseRate + fuelCost + customsClearanceFee;
    const freightCostPerUnit = Number((totalFreightCost / unitCount).toFixed(2));

    return {
      containerBaseRate,
      fuelCost: Number(fuelCost.toFixed(2)),
      customsClearanceFee,
      totalFreightCost: Number(totalFreightCost.toFixed(2)),
      unitCount,
      freightCostPerUnit
    };
  }
}

module.exports = FreightCostAnalyzer;
