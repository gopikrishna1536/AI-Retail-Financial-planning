/**
 * Retail Inventory Shrinkage & Loss Prevention Detector
 * Quantifies book inventory vs physical stock discrepancy and flags high-loss store departments.
 */
class ShrinkageDetector {
  static analyzeShrinkage(records, thresholdPercent = 1.5) {
    const alerts = [];
    let totalBookValue = 0;
    let totalActualValue = 0;

    for (const r of records) {
      const bookVal = r.bookQuantity * r.unitCost;
      const actualVal = r.actualQuantity * r.unitCost;
      const shrinkVal = Math.max(0, bookVal - actualVal);
      const shrinkPct = bookVal > 0 ? Number(((shrinkVal / bookVal) * 100).toFixed(2)) : 0;

      totalBookValue += bookVal;
      totalActualValue += actualVal;

      if (shrinkPct >= thresholdPercent) {
        alerts.push({
          sku: r.sku,
          category: r.category,
          bookValue: bookVal,
          actualValue: actualVal,
          shrinkageAmount: shrinkVal,
          shrinkagePercent: shrinkPct,
          severity: shrinkPct > 4.0 ? 'CRITICAL' : 'WARNING'
        });
      }
    }

    const overallShrink = totalBookValue - totalActualValue;
    const overallPct = totalBookValue > 0 ? Number(((overallShrink / totalBookValue) * 100).toFixed(2)) : 0;

    return {
      totalBookValue: Number(totalBookValue.toFixed(2)),
      totalActualValue: Number(totalActualValue.toFixed(2)),
      overallShrinkageAmount: Number(overallShrink.toFixed(2)),
      overallShrinkagePercent: overallPct,
      anomalyCount: alerts.length,
      alerts
    };
  }
}

module.exports = ShrinkageDetector;
