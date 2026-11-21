const test = require('node:test');
const assert = require('node:assert/strict');
const SupplierRiskScorecard = require('../src/services/supplierRiskScorecard');

test('Supplier Risk Scorecard Tests', async (t) => {
  await t.test('should calculate OTIF and risk tier accurately', () => {
    const orders = [
      { promisedDeliveryDays: 5, actualDeliveryDays: 4, orderedQuantity: 100, receivedQuantity: 100, defectiveQuantity: 0 },
      { promisedDeliveryDays: 5, actualDeliveryDays: 5, orderedQuantity: 200, receivedQuantity: 200, defectiveQuantity: 0 },
      { promisedDeliveryDays: 3, actualDeliveryDays: 6, orderedQuantity: 50, receivedQuantity: 50, defectiveQuantity: 0 } // Late
    ];
    const res = SupplierRiskScorecard.evaluateSupplier(orders);
    assert.equal(res.totalOrders, 3);
    assert.equal(res.otifRatePercent, 66.7);
    assert.equal(res.riskTier, 'High Risk');
    assert.equal(res.approvedForTier1, false);
  });
});
