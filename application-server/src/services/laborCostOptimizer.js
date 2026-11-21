/**
 * Labor Cost & Shift Demand Matching Optimizer
 * Matches hourly store staffing to foot-traffic demand curve to minimize over-staffing waste.
 */
class LaborCostOptimizer {
  static optimizeShift(hourlyTraffic, customersPerAssociatePerHour = 15, hourlyWage = 18.0) {
    const shiftPlan = [];
    let totalLaborCost = 0;
    let totalAssociates = 0;

    for (const h of hourlyTraffic) {
      const requiredAssociates = Math.max(1, Math.ceil(h.traffic / customersPerAssociatePerHour));
      const hourCost = requiredAssociates * hourlyWage;

      totalLaborCost += hourCost;
      totalAssociates += requiredAssociates;

      shiftPlan.push({
        hour: h.hour,
        traffic: h.traffic,
        recommendedStaff: requiredAssociates,
        cost: hourCost
      });
    }

    return {
      totalLaborCost: Number(totalLaborCost.toFixed(2)),
      averageStaffingLevel: Number((totalAssociates / hourlyTraffic.length).toFixed(1)),
      shiftPlan
    };
  }
}

module.exports = LaborCostOptimizer;
