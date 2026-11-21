const test = require('node:test');
const assert = require('node:assert/strict');
const CustomerAcquisitionCostService = require('../src/services/customerAcquisitionCost');

test('CAC and LTV Payback Tests', async (t) => {
  await t.test('should calculate healthy SaaS/Retail unit economics', () => {
    // $10k spend / 200 customers = $50 CAC. AOV $100 * 4/yr = $400 rev * 50% margin = $200 gross margin.
    // Churn 20% -> 5 yrs life -> LTV = $1,000. LTV:CAC = 20x, payback = 3 months.
    const res = CustomerAcquisitionCostService.calculateMetrics(10000, 200, 100, 4, 50, 20);
    assert.equal(res.blendedCac, 50);
    assert.equal(res.customerLifetimeValue, 1000);
    assert.equal(res.ltvToCacRatio, 20);
    assert.equal(res.paybackPeriodMonths, 3.0);
    assert.equal(res.isHealthyUnitEconomics, true);
  });
});
