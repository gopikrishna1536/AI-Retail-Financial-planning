/**
 * Dynamic Safety Stock Buffer Calculator
 * Safety Stock = Z * sqrt(LeadTime * stdDevDemand^2 + avgDemand^2 * stdDevLeadTime^2)
 */
class SafetyStockBufferService {
  // Common standard normal Z values for service levels
  static Z_VALUES = {
    '90%': 1.28,
    '95%': 1.645,
    '98%': 2.05,
    '99%': 2.33
  };

  static calculateSafetyStock(avgDailyDemand, stdDevDailyDemand, avgLeadTimeDays, stdDevLeadTimeDays, serviceLevel = '95%') {
    const z = SafetyStockBufferService.Z_VALUES[serviceLevel] || 1.645;

    const demandVarianceComponent = avgLeadTimeDays * Math.pow(stdDevDailyDemand, 2);
    const leadTimeVarianceComponent = Math.pow(avgDailyDemand, 2) * Math.pow(stdDevLeadTimeDays, 2);

    const safetyStockUnits = Math.ceil(z * Math.sqrt(demandVarianceComponent + leadTimeVarianceComponent));
    const reorderPoint = Math.ceil((avgDailyDemand * avgLeadTimeDays) + safetyStockUnits);

    return {
      serviceLevel,
      zScore: z,
      safetyStockUnits,
      reorderPointUnits: reorderPoint
    };
  }
}

module.exports = SafetyStockBufferService;
