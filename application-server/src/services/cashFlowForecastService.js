/**
 * 13-Week Rolling Cash Flow Forecasting & Treasury Liquidity Service.
 * Models weekly retail receipts vs disbursements, net cash burns, and safety buffer liquidity breaches.
 */

class CashFlowForecastService {
  /**
   * Generates a 13-week rolling cash flow forecast.
   * @param {Object} params
   * @param {number} params.startingCash - Initial bank/treasury cash balance ($)
   * @param {number} params.minimumCashBuffer - Minimum liquidity buffer required ($)
   * @param {Array<number>} params.weeklyProjectedReceipts - Array of 13 weekly inflows ($)
   * @param {Array<number>} params.weeklyProjectedDisbursements - Array of 13 weekly outflows ($)
   * @returns {Object} 13-week forecast schedule, minimum liquidity point, and credit recommendations
   */
  static generate13WeekForecast(params) {
    const {
      startingCash,
      minimumCashBuffer = 50000,
      weeklyProjectedReceipts,
      weeklyProjectedDisbursements
    } = params;

    if (typeof startingCash !== 'number' || startingCash < 0) {
      throw new Error('Starting cash must be a non-negative number.');
    }
    if (!Array.isArray(weeklyProjectedReceipts) || weeklyProjectedReceipts.length !== 13) {
      throw new Error('weeklyProjectedReceipts must be an array of exactly 13 weeks.');
    }
    if (!Array.isArray(weeklyProjectedDisbursements) || weeklyProjectedDisbursements.length !== 13) {
      throw new Error('weeklyProjectedDisbursements must be an array of exactly 13 weeks.');
    }

    let currentCash = startingCash;
    let minCashEncountered = startingCash;
    let minCashWeek = 0;
    const weeklySchedule = [];
    const warnings = [];

    for (let week = 1; week <= 13; week++) {
      const receipts = Math.round(weeklyProjectedReceipts[week - 1] * 100) / 100;
      const disbursements = Math.round(weeklyProjectedDisbursements[week - 1] * 100) / 100;
      const netCashChange = Math.round((receipts - disbursements) * 100) / 100;

      const openingCash = Math.round(currentCash * 100) / 100;
      currentCash = Math.round((openingCash + netCashChange) * 100) / 100;
      const closingCash = currentCash;

      if (closingCash < minCashEncountered) {
        minCashEncountered = closingCash;
        minCashWeek = week;
      }

      const isBufferBreached = closingCash < minimumCashBuffer;
      if (isBufferBreached) {
        const deficit = Math.round((minimumCashBuffer - closingCash) * 100) / 100;
        warnings.push({
          week,
          closingCash,
          deficit,
          message: `Week ${week}: Cash dips to $${closingCash.toLocaleString()}, breaching $${minimumCashBuffer.toLocaleString()} buffer by $${deficit.toLocaleString()}`
        });
      }

      weeklySchedule.push({
        week: `Week ${week}`,
        openingCash,
        receipts,
        disbursements,
        netCashChange,
        closingCash,
        isBufferBreached
      });
    }

    const totalReceipts = Math.round(weeklyProjectedReceipts.reduce((a, b) => a + b, 0) * 100) / 100;
    const totalDisbursements = Math.round(weeklyProjectedDisbursements.reduce((a, b) => a + b, 0) * 100) / 100;
    const totalNetChange = Math.round((totalReceipts - totalDisbursements) * 100) / 100;

    const recommendedCreditFacilityDrawdown = minCashEncountered < minimumCashBuffer
      ? Math.round((minimumCashBuffer - minCashEncountered) * 100) / 100
      : 0;

    return {
      startingCash,
      minimumCashBuffer,
      endingCash: currentCash,
      total13WeekReceipts: totalReceipts,
      total13WeekDisbursements: totalDisbursements,
      net13WeekCashFlow: totalNetChange,
      lowestCashPoint: minCashEncountered,
      lowestCashWeek: `Week ${minCashWeek || 1}`,
      liquidityStatus: warnings.length === 0 ? 'HEALTHY_LIQUIDITY' : 'LIQUIDITY_BUFFER_BREACHED',
      recommendedCreditFacilityDrawdown,
      warnings,
      weeklySchedule
    };
  }
}

module.exports = { CashFlowForecastService };
