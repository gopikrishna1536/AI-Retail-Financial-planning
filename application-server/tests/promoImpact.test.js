const test = require('node:test');
const assert = require('node:assert/strict');
const PromoImpactSimulator = require('../src/services/promoImpactSimulator');

test('Promo Impact Simulator Tests', async (t) => {
  await t.test('should identify profitable promotion uplift exceeding cannibalization drag', () => {
    // Baseline: 1000 units @ $20 margin = $20,000 profit
    // Promo: 10% discount ($18 margin), 50% lift (1500 units) = $27,000 gross - $2,000 cannibalization = $25,000 net
    const res = PromoImpactSimulator.simulatePromotion(1000, 10, 50, 20, 2000);
    assert.equal(res.baselineProfit, 20000);
    assert.equal(res.netPromoProfit, 25000);
    assert.equal(res.netIncrementalProfit, 5000);
    assert.equal(res.isPromoAccretive, true);
  });
});
