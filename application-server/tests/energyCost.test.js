const test = require('node:test');
const assert = require('node:assert/strict');
const EnergyUtilityCostOptimizer = require('../src/services/energyUtilityCostOptimizer');

test('Energy Utility Cost Optimizer Tests', async (t) => {
  await t.test('should calculate demand charge savings from 20% peak shaving', () => {
    // 500 kW peak @ $15/kW = $7,500. 20% reduction saves $1,500/mo ($18,000/yr)
    const res = EnergyUtilityCostOptimizer.evaluatePeakShaving(100000, 0.08, 0.14, 500, 15, 20);
    assert.equal(res.monthlyDemandSavings, 1500);
    assert.equal(res.projectedAnnualSavings, 18000);
  });
});
