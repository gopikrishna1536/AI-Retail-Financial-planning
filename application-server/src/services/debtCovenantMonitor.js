/**
 * Debt Covenant Monitor
 * Tracks DSCR, Debt-to-EBITDA, and Interest Coverage ratios against credit agreement covenants.
 */
class DebtCovenantMonitor {
  static checkCovenants(ebitda, totalDebt, interestExpense, annualPrincipalRepayment) {
    const dscr = (interestExpense + annualPrincipalRepayment) > 0
      ? Number((ebitda / (interestExpense + annualPrincipalRepayment)).toFixed(2))
      : 99.0;

    const leverageRatio = ebitda > 0 ? Number((totalDebt / ebitda).toFixed(2)) : 99.0;
    const interestCoverage = interestExpense > 0 ? Number((ebitda / interestExpense).toFixed(2)) : 99.0;

    // Standard institutional bank covenants: DSCR >= 1.25, Leverage <= 3.5, Interest Coverage >= 3.0
    const dscrCompliant = dscr >= 1.25;
    const leverageCompliant = leverageRatio <= 3.5;
    const interestCompliant = interestCoverage >= 3.0;

    const isFullyCompliant = dscrCompliant && leverageCompliant && interestCompliant;

    return {
      debtServiceCoverageRatio: dscr,
      debtToEbitdaRatio: leverageRatio,
      interestCoverageRatio: interestCoverage,
      isFullyCompliant,
      breachedCovenants: [
        ...(dscrCompliant ? [] : ['DSCR below 1.25 covenant']),
        ...(leverageCompliant ? [] : ['Leverage ratio above 3.5x EBITDA']),
        ...(interestCompliant ? [] : ['Interest coverage below 3.0x'])
      ]
    };
  }
}

module.exports = DebtCovenantMonitor;
