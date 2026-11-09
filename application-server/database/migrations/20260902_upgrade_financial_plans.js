/**
 * Migration to upgrade financial_plans table with AI forecasting, recommended target,
 * target feasibility, plan health score, risk level, status workflow & approval fields.
 */

exports.up = async function (knex) {
  const hasStatus = await knex.schema.hasColumn('financial_plans', 'status');
  if (!hasStatus) {
    await knex.schema.alterTable('financial_plans', (table) => {
      table.string('planning_period', 20).nullable();
      table.string('plan_type', 50).nullable().defaultTo('MANUAL');
      table.decimal('ai_forecast_revenue', 15, 2).nullable();
      table.decimal('ai_forecast_expense', 15, 2).nullable();
      table.decimal('ai_forecast_profit', 15, 2).nullable();
      table.decimal('forecast_confidence', 5, 2).nullable();
      table.decimal('recommended_revenue', 15, 2).nullable();
      table.decimal('recommended_expense', 15, 2).nullable();
      table.decimal('recommended_profit', 15, 2).nullable();
      table.decimal('feasibility_score', 5, 2).nullable();
      table.decimal('health_score', 5, 2).nullable();
      table.string('risk_level', 20).nullable().defaultTo('LOW');
      table.string('status', 30).nullable().defaultTo('DRAFT');
      table.string('approved_by', 255).nullable();
      table.timestamp('approved_at').nullable();
    });
  }
};

exports.down = async function (knex) {
  const hasStatus = await knex.schema.hasColumn('financial_plans', 'status');
  if (hasStatus) {
    await knex.schema.alterTable('financial_plans', (table) => {
      table.dropColumn('planning_period');
      table.dropColumn('plan_type');
      table.dropColumn('ai_forecast_revenue');
      table.dropColumn('ai_forecast_expense');
      table.dropColumn('ai_forecast_profit');
      table.dropColumn('forecast_confidence');
      table.dropColumn('recommended_revenue');
      table.dropColumn('recommended_expense');
      table.dropColumn('recommended_profit');
      table.dropColumn('feasibility_score');
      table.dropColumn('health_score');
      table.dropColumn('risk_level');
      table.dropColumn('status');
      table.dropColumn('approved_by');
      table.dropColumn('approved_at');
    });
  }
};
