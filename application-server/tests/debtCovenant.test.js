const test = require('node:test');
const assert = require('node:assert/strict');
const DebtCovenantMonitor = require('../src/services/debtCovenantMonitor');

test('Debt Covenant Monitor Tests', async (t) => {
  await t.test('should detect compliant capital structure', () => {
    // EBITDA: $500k, Debt: $1M, Int: $50k, Prin: $150k -> DSCR = 500/200 = 2.5, Lev = 2.0
    const res = DebtCovenantMonitor.checkCovenants(500000, 1000000, 50000, 150000);
    assert.equal(res.debtServiceCoverageRatio, 2.5);
    assert.equal(res.debtToEbitdaRatio, 2.0);
    assert.equal(res.isFullyCompliant, true);
    assert.equal(res.breachedCovenants.length, 0);
  });
});
