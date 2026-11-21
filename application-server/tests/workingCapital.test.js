const test = require('node:test');
const assert = require('node:assert/strict');
const WorkingCapitalService = require('../src/services/workingCapitalService');

test('Working Capital & Cash Conversion Cycle Tests', async (t) => {
  await t.test('should accurately calculate DIO, DSO, DPO and net CCC days', () => {
    // Rev: $1.2M, COGS: $800k, Inv: $100k (DIO ~45.6), Rec: $50k (DSO ~15.2), Pay: $70k (DPO ~31.9)
    const res = WorkingCapitalService.calculateCCC(1200000, 800000, 100000, 50000, 70000);
    assert.equal(res.daysInventoryOutstanding, 45.6);
    assert.equal(res.daysSalesOutstanding, 15.2);
    assert.equal(res.daysPayableOutstanding, 31.9);
    assert.equal(res.cashConversionCycleDays, 28.9);
    assert.equal(res.liquidityRating, 'Excellent');
  });
});
