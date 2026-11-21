/**
 * Working Capital & Cash Conversion Cycle (CCC) Engine
 * CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)
 */
class WorkingCapitalService {
  static calculateCCC(annualRevenue, annualCOGS, avgInventory, avgReceivables, avgPayables) {
    if (annualRevenue <= 0 || annualCOGS <= 0) {
      throw new Error('Annual revenue and COGS must be strictly positive');
    }

    const dio = Number(((avgInventory / annualCOGS) * 365).toFixed(1));
    const dso = Number(((avgReceivables / annualRevenue) * 365).toFixed(1));
    const dpo = Number(((avgPayables / annualCOGS) * 365).toFixed(1));

    const cccDays = Number((dio + dso - dpo).toFixed(1));
    const netWorkingCapital = Number((avgInventory + avgReceivables - avgPayables).toFixed(2));

    let liquidityRating = 'Excellent';
    if (cccDays > 60) liquidityRating = 'High Working Capital Drag';
    else if (cccDays > 30) liquidityRating = 'Moderate';

    return {
      daysInventoryOutstanding: dio,
      daysSalesOutstanding: dso,
      daysPayableOutstanding: dpo,
      cashConversionCycleDays: cccDays,
      netWorkingCapital,
      liquidityRating
    };
  }
}

module.exports = WorkingCapitalService;
