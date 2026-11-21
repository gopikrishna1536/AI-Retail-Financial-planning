const test = require('node:test');
const assert = require('node:assert/strict');
const ShrinkageDetector = require('../src/services/shrinkageDetector');

test('Shrinkage Detector Tests', async (t) => {
  await t.test('should flag SKUs exceeding shrinkage tolerance', () => {
    const records = [
      { sku: 'APP-01', category: 'Electronics', bookQuantity: 100, actualQuantity: 95, unitCost: 200 }, // 5% shrink
      { sku: 'GRO-01', category: 'Produce', bookQuantity: 500, actualQuantity: 498, unitCost: 2 } // 0.4% shrink
    ];
    const res = ShrinkageDetector.analyzeShrinkage(records, 1.5);
    assert.equal(res.anomalyCount, 1);
    assert.equal(res.alerts[0].sku, 'APP-01');
    assert.equal(res.alerts[0].severity, 'CRITICAL');
  });
});
