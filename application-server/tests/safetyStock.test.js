const test = require('node:test');
const assert = require('node:assert/strict');
const SafetyStockBufferService = require('../src/services/safetyStockBuffer');

test('Safety Stock Buffer Tests', async (t) => {
  await t.test('should calculate safety stock for 95% cycle service level', () => {
    const res = SafetyStockBufferService.calculateSafetyStock(100, 15, 10, 2, '95%');
    assert.ok(res.safetyStockUnits > 0);
    assert.ok(res.reorderPointUnits > 1000);
  });
});
