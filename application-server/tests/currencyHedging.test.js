const test = require('node:test');
const assert = require('node:assert/strict');
const CurrencyHedgingModel = require('../src/services/currencyHedgingModel');

test('Currency Hedging Model Tests', async (t) => {
  await t.test('should calculate hedge gain when spot exchange rate depreciates', () => {
    // Import €100,000 hedged at $1.08, spot now $1.12 -> savings = $4,000
    const res = CurrencyHedgingModel.evaluateForwardContract(100000, 1.08, 1.12);
    assert.equal(res.markToMarketGainLoss, 4000);
    assert.equal(res.isHedgeFavorable, true);
  });
});
