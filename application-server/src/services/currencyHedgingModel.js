/**
 * Foreign Currency Exposure & FX Forward Contract Model
 * Simulates mark-to-market (MtM) gain/loss on international inventory import hedging.
 */
class CurrencyHedgingModel {
  static evaluateForwardContract(notionalAmountFC, lockedForwardRate, currentSpotRate) {
    if (notionalAmountFC <= 0 || lockedForwardRate <= 0 || currentSpotRate <= 0) {
      throw new Error('All exchange rates and notional amounts must be positive');
    }

    const lockedDomesticCost = notionalAmountFC * lockedForwardRate;
    const unhedgedSpotCost = notionalAmountFC * currentSpotRate;

    // Hedging Gain/Loss: If spot rate is higher, the hedge protected against currency depreciation
    const mtmGainLoss = Number((unhedgedSpotCost - lockedDomesticCost).toFixed(2));
    const effectiveSavingsPercent = Number(((mtmGainLoss / unhedgedSpotCost) * 100).toFixed(2));

    return {
      notionalAmountForeignCurrency: notionalAmountFC,
      lockedDomesticCost: Number(lockedDomesticCost.toFixed(2)),
      unhedgedSpotCost: Number(unhedgedSpotCost.toFixed(2)),
      markToMarketGainLoss: mtmGainLoss,
      effectiveSavingsPercent,
      isHedgeFavorable: mtmGainLoss > 0
    };
  }
}

module.exports = CurrencyHedgingModel;
