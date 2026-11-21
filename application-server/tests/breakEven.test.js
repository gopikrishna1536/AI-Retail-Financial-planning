const test = require('node:test');
const assert = require('node:assert/strict');
const BreakEvenCalculator = require('../src/services/breakEvenCalculator');

test('Break Even Calculator Tests', async (t) => {
  await t.test('should calculate break-even point and safety buffer accurately', () => {
    // Fixed: $50k, Price: $100, VC: $60 (CM = $40) -> Break-even = 1,250 units
    const res = BreakEvenCalculator.computeBreakEven(50000, 100, 60, 2000);
    assert.equal(res.breakEvenUnits, 1250);
    assert.equal(res.breakEvenRevenue, 125000);
    assert.equal(res.marginOfSafetyUnits, 750);
    assert.equal(res.marginOfSafetyPercent, 37.5);
  });
});
