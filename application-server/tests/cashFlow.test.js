const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CashFlowForecastService } = require('../src/services/cashFlowForecastService');

describe('13-Week Rolling Cash Flow & Liquidity Buffer Tests', () => {
  const steadyReceipts = [80000, 85000, 90000, 75000, 80000, 85000, 95000, 100000, 90000, 85000, 80000, 85000, 90000];
  const steadyDisbursements = [70000, 72000, 75000, 70000, 72000, 75000, 78000, 80000, 75000, 72000, 70000, 72000, 75000];

  test('should generate healthy 13-week schedule with positive net cash accumulation', () => {
    const forecast = CashFlowForecastService.generate13WeekForecast({
      startingCash: 100000,
      minimumCashBuffer: 50000,
      weeklyProjectedReceipts: steadyReceipts,
      weeklyProjectedDisbursements: steadyDisbursements
    });

    assert.equal(forecast.weeklySchedule.length, 13);
    assert.equal(forecast.startingCash, 100000);
    assert.ok(forecast.endingCash > forecast.startingCash);
    assert.ok(forecast.net13WeekCashFlow > 0);
    assert.equal(forecast.liquidityStatus, 'HEALTHY_LIQUIDITY');
    assert.equal(forecast.recommendedCreditFacilityDrawdown, 0);
    assert.equal(forecast.warnings.length, 0);
  });

  test('should detect liquidity buffer breaches and recommend exact credit drawdown', () => {
    // Large inventory capex disbursement in week 3 ($180,000) creates deficit
    const deficitDisbursements = [...steadyDisbursements];
    deficitDisbursements[2] = 180000;

    const forecast = CashFlowForecastService.generate13WeekForecast({
      startingCash: 50000,
      minimumCashBuffer: 40000,
      weeklyProjectedReceipts: steadyReceipts,
      weeklyProjectedDisbursements: deficitDisbursements
    });

    assert.equal(forecast.liquidityStatus, 'LIQUIDITY_BUFFER_BREACHED');
    assert.ok(forecast.warnings.length > 0);
    assert.ok(forecast.recommendedCreditFacilityDrawdown > 0);
    assert.equal(forecast.lowestCashWeek, 'Week 3');
  });

  test('should reject mismatched receipt or disbursement array lengths', () => {
    assert.throws(
      () => CashFlowForecastService.generate13WeekForecast({ startingCash: 10000, weeklyProjectedReceipts: [1000], weeklyProjectedDisbursements: steadyDisbursements }),
      /exactly 13 weeks/
    );
  });
});
