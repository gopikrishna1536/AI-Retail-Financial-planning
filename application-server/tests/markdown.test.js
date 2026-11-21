const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { MarkdownOptimizationService } = require('../src/services/markdownOptimizationService');

describe('Retail Markdown & Clearance Optimization Tests', () => {
  test('should plan 4-tier phased markdown schedule with elasticity-based sales lift', () => {
    const item = {
      originalPrice: 120.0,
      costPrice: 40.0,
      inventoryUnits: 500,
      baseWeeklySales: 20,
      priceElasticity: -2.0,
      weeksAvailable: 8
    };

    const plan = MarkdownOptimizationService.planMarkdownSchedule(item);

    assert.equal(plan.originalPrice, 120.0);
    assert.equal(plan.initialInventory, 500);
    assert.ok(plan.schedule.length > 0);
    assert.ok(plan.clearedInventory > 0);
    assert.ok(plan.clearanceRatePct > 0 && plan.clearanceRatePct <= 100);
    assert.ok(plan.totalRecoveredRevenue > 0);
    assert.ok(plan.netGrossMargin > 0);

    // Verify promotional price decreases with each tier
    for (let i = 1; i < plan.schedule.length; i++) {
      assert.ok(plan.schedule[i].promotionalPrice < plan.schedule[i - 1].promotionalPrice);
      assert.ok(plan.schedule[i].discountPct > plan.schedule[i - 1].discountPct);
    }
  });

  test('should reject invalid positive elasticity or negative prices', () => {
    assert.throws(
      () => MarkdownOptimizationService.planMarkdownSchedule({ originalPrice: 100, costPrice: 50, inventoryUnits: 100, priceElasticity: 0.5 }),
      /Price elasticity must be negative/
    );
    assert.throws(
      () => MarkdownOptimizationService.planMarkdownSchedule({ originalPrice: -10, costPrice: 50, inventoryUnits: 100 }),
      /must be positive numbers/
    );
  });
});
