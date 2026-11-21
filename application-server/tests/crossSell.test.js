const test = require('node:test');
const assert = require('node:assert/strict');
const CrossSellMatrix = require('../src/services/crossSellMatrix');

test('Cross-Sell Matrix Tests', async (t) => {
  await t.test('should calculate lift and confidence for complementary items', () => {
    const transactions = [
      ['milk', 'bread'],
      ['bread', 'butter'],
      ['milk', 'bread', 'butter'],
      ['beer', 'chips'],
      ['milk', 'bread']
    ];
    const res = CrossSellMatrix.computeAssociation(transactions, 'milk', 'bread');
    assert.equal(res.transactionCount, 5);
    assert.equal(res.supportPercent, 60.0);
    assert.equal(res.confidencePercent, 100.0);
    assert.ok(res.lift > 1.0);
  });
});
