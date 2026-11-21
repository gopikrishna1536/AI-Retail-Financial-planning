const test = require('node:test');
const assert = require('node:assert/strict');
const FreightCostAnalyzer = require('../src/services/freightCostAnalyzer');

test('Freight Cost Analyzer Tests', async (t) => {
  await t.test('should allocate container freight per product unit', () => {
    // $4000 base + 15% fuel ($600) + $400 customs = $5,000 total across 2,500 units = $2.00/unit
    const res = FreightCostAnalyzer.computeLandedFreight(4000, 15, 400, 2500);
    assert.equal(res.totalFreightCost, 5000);
    assert.equal(res.freightCostPerUnit, 2.0);
  });
});
