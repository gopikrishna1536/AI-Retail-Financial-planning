/**
 * Market Basket Cross-Sell & Association Rules Matrix
 * Calculates Support, Confidence, and Lift for co-purchased item pairs.
 */
class CrossSellMatrix {
  static computeAssociation(transactions, itemA, itemB) {
    if (!transactions || transactions.length === 0) {
      throw new Error('Transactions cannot be empty');
    }

    const n = transactions.length;
    let countA = 0;
    let countB = 0;
    let countBoth = 0;

    for (const t of transactions) {
      const set = new Set(t.map(i => i.toLowerCase()));
      const hasA = set.has(itemA.toLowerCase());
      const hasB = set.has(itemB.toLowerCase());

      if (hasA) countA++;
      if (hasB) countB++;
      if (hasA && hasB) countBoth++;
    }

    const supportA = countA / n;
    const supportB = countB / n;
    const supportBoth = countBoth / n;

    // Confidence(A -> B) = P(A and B) / P(A)
    const confidence = countA > 0 ? Number((supportBoth / supportA).toFixed(3)) : 0;

    // Lift(A, B) = P(A and B) / (P(A) * P(B))
    const expectedCoOccurrence = supportA * supportB;
    const lift = expectedCoOccurrence > 0 ? Number((supportBoth / expectedCoOccurrence).toFixed(2)) : 0;

    return {
      itemA,
      itemB,
      transactionCount: n,
      supportPercent: Number((supportBoth * 100).toFixed(2)),
      confidencePercent: Number((confidence * 100).toFixed(2)),
      lift,
      isPositiveAssociation: lift > 1.2
    };
  }
}

module.exports = CrossSellMatrix;
