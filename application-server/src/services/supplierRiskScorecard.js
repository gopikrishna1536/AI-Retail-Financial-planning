/**
 * Supplier Operational Risk & On-Time In-Full (OTIF) Scorecard
 */
class SupplierRiskScorecard {
  static evaluateSupplier(orders) {
    if (!orders || orders.length === 0) {
      throw new Error('Orders list cannot be empty');
    }

    let onTimeCount = 0;
    let inFullCount = 0;
    let otifCount = 0;
    let defectCount = 0;

    for (const o of orders) {
      const isOnTime = o.actualDeliveryDays <= o.promisedDeliveryDays;
      const isInFull = o.receivedQuantity >= o.orderedQuantity;
      if (isOnTime) onTimeCount++;
      if (isInFull) inFullCount++;
      if (isOnTime && isInFull) otifCount++;
      if (o.defectiveQuantity > 0) defectCount++;
    }

    const n = orders.length;
    const otifRate = Number(((otifCount / n) * 100).toFixed(1));
    const defectRate = Number(((defectCount / n) * 100).toFixed(1));

    let riskTier = 'Low Risk';
    if (otifRate < 80.0 || defectRate > 5.0) riskTier = 'High Risk';
    else if (otifRate < 90.0) riskTier = 'Moderate Risk';

    return {
      totalOrders: n,
      onTimeRatePercent: Number(((onTimeCount / n) * 100).toFixed(1)),
      inFullRatePercent: Number(((inFullCount / n) * 100).toFixed(1)),
      otifRatePercent: otifRate,
      defectRatePercent: defectRate,
      riskTier,
      approvedForTier1: riskTier === 'Low Risk'
    };
  }
}

module.exports = SupplierRiskScorecard;
