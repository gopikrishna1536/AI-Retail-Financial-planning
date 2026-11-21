const test = require('node:test');
const assert = require('node:assert/strict');
const VendorDiscountService = require('../src/services/vendorDiscountService');

test('Vendor Early Payment Discount Optimizer', async (t) => {
  await t.test('should recommend taking standard 2/10 Net 30 when yield > cost of capital', () => {
    // 2/10 net 30 annualized yield is ~37.24%
    const res = VendorDiscountService.evaluateEarlyPayment(100000, 2.0, 10, 30, 8.5);
    assert.equal(res.discountAmount, 2000);
    assert.equal(res.paidAmount, 98000);
    assert.equal(res.daysSaved, 20);
    assert.ok(res.annualizedYieldPercent > 36);
    assert.equal(res.shouldTakeDiscount, true);
    assert.equal(res.netProjectedSavings, 2000);
  });

  await t.test('should reject invalid terms where netDays <= discountDays', () => {
    assert.throws(() => {
      VendorDiscountService.evaluateEarlyPayment(50000, 2.0, 30, 15, 7.0);
    }, /Invalid discount terms/);
  });
});
