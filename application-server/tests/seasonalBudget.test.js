const test = require('node:test');
const assert = require('node:assert/strict');
const SeasonalBudgetAllocater = require('../src/services/seasonalBudgetAllocater');

test('Seasonal Budget Allocator Tests', async (t) => {
  await t.test('should distribute $1,000,000 budget according to Q4 peak holiday weights', () => {
    // Weights: Q1=15%, Q2=20%, Q3=25%, Q4=40%
    const res = SeasonalBudgetAllocater.allocateBudget(1000000, [15, 20, 25, 40]);
    assert.equal(res.allocation.Q1, 150000);
    assert.equal(res.allocation.Q2, 200000);
    assert.equal(res.allocation.Q3, 250000);
    assert.equal(res.allocation.Q4, 400000);
  });
});
