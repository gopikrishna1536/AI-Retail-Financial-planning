const test = require('node:test');
const assert = require('node:assert/strict');
const ElasticityPricingEngine = require('../src/services/elasticityPricingEngine');

test('Price Elasticity Pricing Engine Tests', async (t) => {
  await t.test('should detect elastic goods when price hike decreases total revenue', () => {
    // Price from $10 to $12 (+20%), Quantity from 100 to 70 (-30%) -> PED = -1.5
    const res = ElasticityPricingEngine.calculateElasticity(10, 100, 12, 70);
    assert.equal(res.priceElasticity, -1.5);
    assert.equal(res.isElastic, true);
    assert.equal(res.revenueChange, -160);
    assert.equal(res.pricingStrategy, 'Lower price to expand demand');
  });
});
