const test = require('node:test');
const assert = require('node:assert/strict');
const LaborCostOptimizer = require('../src/services/laborCostOptimizer');

test('Labor Cost Optimizer Tests', async (t) => {
  await t.test('should scale staffing with foot-traffic peaks', () => {
    const traffic = [
      { hour: '10:00', traffic: 15 }, // 1 staff
      { hour: '12:00', traffic: 60 }, // 4 staff
      { hour: '14:00', traffic: 30 }  // 2 staff
    ];
    const res = LaborCostOptimizer.optimizeShift(traffic, 15, 20.0);
    assert.equal(res.shiftPlan[0].recommendedStaff, 1);
    assert.equal(res.shiftPlan[1].recommendedStaff, 4);
    assert.equal(res.totalLaborCost, (1 + 4 + 2) * 20);
  });
});
