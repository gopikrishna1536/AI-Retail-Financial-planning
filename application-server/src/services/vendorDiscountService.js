/**
 * Vendor Early Payment Discount Service (e.g. 2/10 Net 30)
 * Evaluates annualized return on early vendor discount vs cost of short-term credit.
 */
class VendorDiscountService {
  static evaluateEarlyPayment(invoiceAmount, discountPercent, discountDays, netDays, annualCostOfCapitalPercent) {
    if (invoiceAmount <= 0 || discountPercent <= 0 || netDays <= discountDays) {
      throw new Error('Invalid discount terms or invoice amount');
    }

    const discountAmount = Number((invoiceAmount * (discountPercent / 100)).toFixed(2));
    const paidAmount = Number((invoiceAmount - discountAmount).toFixed(2));
    const daysSaved = netDays - discountDays;

    // Annualized Effective Rate: (Discount % / (100 - Discount %)) * (365 / Days Saved) * 100
    const annualizedYield = Number(
      ((discountPercent / (100 - discountPercent)) * (365 / daysSaved) * 100).toFixed(2)
    );

    const shouldTakeDiscount = annualizedYield > annualCostOfCapitalPercent;
    const netSavings = shouldTakeDiscount ? discountAmount : 0;

    return {
      invoiceAmount,
      discountAmount,
      paidAmount,
      daysSaved,
      annualizedYieldPercent: annualizedYield,
      costOfCapitalPercent: annualCostOfCapitalPercent,
      shouldTakeDiscount,
      netProjectedSavings: netSavings
    };
  }
}

module.exports = VendorDiscountService;
