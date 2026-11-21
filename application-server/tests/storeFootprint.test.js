const test = require('node:test');
const assert = require('node:assert/strict');
const StoreFootprintOptimizer = require('../src/services/storeFootprintOptimizer');

test('Store Footprint Optimizer Tests', async (t) => {
  await t.test('should evaluate healthy retail location correctly', () => {
    const res = StoreFootprintOptimizer.evaluateStore(5000, 2500000, 150000, 25000, 400000);
    assert.equal(res.salesPerSqFt, 500);
    assert.equal(res.occupancyRatioPercent, 7.0);
    assert.equal(res.isViable, true);
    assert.equal(res.recommendation, 'Maintain Store');
  });
});
