/**
 * Initial Schema Migration - Retail Financial Planning Platform
 * Defines all 18 PostgreSQL tables supporting multi-tenancy & core retail financials.
 */

exports.up = async function (knex) {
  // 1. ORGANIZATIONS
  await knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name', 255).notNullable();
    table.string('code', 50).unique().notNullable();
    table.string('currency', 10).defaultTo('INR');
    table.string('industry', 100).defaultTo('Retail');
    table.timestamps(true, true);
  });

  // 2. USERS
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('email', 255).notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('role', 50).notNullable().defaultTo('STAFF');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    table.unique(['organization_id', 'email']);
    table.index(['organization_id']);
  });

  // 3. BUSINESS UNITS
  await knex.schema.createTable('business_units', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.string('region', 100).notNullable();
    table.text('description');
    table.timestamps(true, true);
    table.index(['organization_id']);
  });

  // 4. STORES
  await knex.schema.createTable('stores', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('business_unit_id').nullable().references('id').inTable('business_units').onDelete('SET NULL');
    table.string('store_code', 50).notNullable();
    table.string('state', 100).notNullable();
    table.string('postal_code', 20).notNullable();
    table.string('city_type', 50).notNullable();
    table.string('outlet_type', 50).notNullable();
    table.string('region', 50).notNullable();
    table.string('country', 50).defaultTo('India');
    table.timestamps(true, true);
    table.unique(['organization_id', 'store_code']);
    table.index(['organization_id']);
    table.index(['business_unit_id']);
  });

  // 5. CATEGORIES
  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('category_name', 150).notNullable();
    table.string('sub_category_name', 150).notNullable();
    table.timestamps(true, true);
    table.unique(['organization_id', 'category_name', 'sub_category_name']);
    table.index(['organization_id']);
  });

  // 6. PRODUCTS
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('RESTRICT');
    table.string('product_code', 100).notNullable();
    table.string('product_name', 255).notNullable();
    table.timestamps(true, true);
    table.unique(['organization_id', 'product_code']);
    table.index(['organization_id']);
    table.index(['category_id']);
  });

  // 7. CUSTOMERS
  await knex.schema.createTable('customers', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('customer_code', 100).notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.date('date_of_birth');
    table.string('segment', 50);
    table.timestamps(true, true);
    table.unique(['organization_id', 'customer_code']);
    table.index(['organization_id']);
  });

  // 8. SALES
  await knex.schema.createTable('sales', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('store_id').notNullable().references('id').inTable('stores').onDelete('RESTRICT');
    table.uuid('product_id').notNullable().references('id').inTable('products').onDelete('RESTRICT');
    table.uuid('customer_id').nullable().references('id').inTable('customers').onDelete('SET NULL');
    table.string('order_id', 100).notNullable();
    table.date('sales_date').notNullable();
    table.date('order_date').notNullable();
    table.date('ship_date');
    table.string('ship_mode', 50);
    table.integer('year').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('sales_amount', 15, 2).notNullable();
    table.decimal('discount', 5, 4).defaultTo(0.0);
    table.decimal('profit_amount', 15, 2).notNullable();
    table.timestamps(true, true);
    table.index(['organization_id', 'sales_date']);
    table.index(['store_id']);
    table.index(['product_id']);
  });

  // 9. EXPENSES
  await knex.schema.createTable('expenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('store_id').nullable().references('id').inTable('stores').onDelete('CASCADE');
    table.string('expense_category', 100).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.date('expense_date').notNullable();
    table.string('period_type', 20).defaultTo('MONTHLY');
    table.text('description');
    table.timestamps(true, true);
    table.index(['organization_id', 'expense_date']);
    table.index(['store_id']);
  });

  // 10. FINANCIAL PLANS
  await knex.schema.createTable('financial_plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('business_unit_id').nullable().references('id').inTable('business_units').onDelete('SET NULL');
    table.uuid('store_id').nullable().references('id').inTable('stores').onDelete('SET NULL');
    table.string('plan_name', 255).notNullable();
    table.string('period_type', 20).notNullable();
    table.integer('year').notNullable();
    table.integer('period_number').notNullable();
    table.decimal('target_revenue', 15, 2).notNullable();
    table.decimal('target_expense', 15, 2).notNullable();
    table.decimal('target_profit', 15, 2).notNullable();
    table.decimal('target_profit_margin', 5, 2).notNullable();
    table.timestamps(true, true);
    table.index(['organization_id']);
  });

  // 11. BUDGETS
  await knex.schema.createTable('budgets', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('financial_plan_id').notNullable().references('id').inTable('financial_plans').onDelete('CASCADE');
    table.string('expense_category', 100).notNullable();
    table.decimal('allocated_amount', 15, 2).notNullable();
    table.decimal('actual_amount', 15, 2).defaultTo(0.00);
    table.string('status', 50).defaultTo('ON TRACK');
    table.timestamps(true, true);
    table.index(['organization_id']);
    table.index(['financial_plan_id']);
  });

  // 12. FORECASTS
  await knex.schema.createTable('forecasts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('forecast_type', 50).notNullable();
    table.string('granularity', 50).notNullable();
    table.uuid('target_entity_id').nullable();
    table.string('model_used', 100).notNullable();
    table.integer('horizon_months').notNullable();
    table.decimal('mae', 10, 4).nullable();
    table.decimal('rmse', 10, 4).nullable();
    table.decimal('mape', 10, 4).nullable();
    table.timestamps(true, true);
    table.index(['organization_id']);
  });

  // 13. FORECAST RESULTS
  await knex.schema.createTable('forecast_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('forecast_id').notNullable().references('id').inTable('forecasts').onDelete('CASCADE');
    table.date('forecast_date').notNullable();
    table.decimal('predicted_value', 15, 2).notNullable();
    table.decimal('lower_bound', 15, 2).nullable();
    table.decimal('upper_bound', 15, 2).nullable();
    table.decimal('actual_value', 15, 2).nullable();
    table.timestamps(true, true);
    table.index(['forecast_id', 'forecast_date']);
  });

  // 14. VARIANCES
  await knex.schema.createTable('variances', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('financial_plan_id').nullable().references('id').inTable('financial_plans').onDelete('CASCADE');
    table.uuid('store_id').nullable().references('id').inTable('stores').onDelete('CASCADE');
    table.uuid('category_id').nullable().references('id').inTable('categories').onDelete('CASCADE');
    table.date('period_date').notNullable();
    table.decimal('planned_revenue', 15, 2).notNullable();
    table.decimal('actual_revenue', 15, 2).notNullable();
    table.decimal('revenue_variance', 15, 2).notNullable();
    table.decimal('planned_expense', 15, 2).notNullable();
    table.decimal('actual_expense', 15, 2).notNullable();
    table.decimal('expense_variance', 15, 2).notNullable();
    table.decimal('planned_profit', 15, 2).notNullable();
    table.decimal('actual_profit', 15, 2).notNullable();
    table.decimal('profit_variance', 15, 2).notNullable();
    table.boolean('is_favorable').notNullable();
    table.timestamps(true, true);
    table.index(['organization_id', 'period_date']);
  });

  // 15. SCENARIOS
  await knex.schema.createTable('scenarios', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('scenario_name', 255).notNullable();
    table.decimal('sales_growth_change', 5, 2).defaultTo(0.0);
    table.decimal('price_change', 5, 2).defaultTo(0.0);
    table.decimal('discount_change', 5, 2).defaultTo(0.0);
    table.decimal('marketing_budget_change', 5, 2).defaultTo(0.0);
    table.decimal('opex_change', 5, 2).defaultTo(0.0);
    table.decimal('supplier_cost_change', 5, 2).defaultTo(0.0);
    table.timestamps(true, true);
    table.index(['organization_id']);
  });

  // 16. SCENARIO RESULTS
  await knex.schema.createTable('scenario_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('scenario_id').notNullable().references('id').inTable('scenarios').onDelete('CASCADE');
    table.decimal('baseline_revenue', 15, 2).notNullable();
    table.decimal('simulated_revenue', 15, 2).notNullable();
    table.decimal('baseline_expense', 15, 2).notNullable();
    table.decimal('simulated_expense', 15, 2).notNullable();
    table.decimal('baseline_profit', 15, 2).notNullable();
    table.decimal('simulated_profit', 15, 2).notNullable();
    table.decimal('baseline_margin', 5, 2).notNullable();
    table.decimal('simulated_margin', 5, 2).notNullable();
    table.timestamps(true, true);
  });

  // 17. RISK ALERTS
  await knex.schema.createTable('risk_alerts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('store_id').nullable().references('id').inTable('stores').onDelete('CASCADE');
    table.string('alert_type', 100).notNullable();
    table.string('severity', 20).notNullable();
    table.decimal('risk_score', 5, 2).notNullable();
    table.text('description').notNullable();
    table.text('recommended_action');
    table.string('status', 20).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index(['organization_id', 'status']);
  });

  // 18. RECOMMENDATIONS
  await knex.schema.createTable('recommendations', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('store_id').nullable().references('id').inTable('stores').onDelete('CASCADE');
    table.uuid('category_id').nullable().references('id').inTable('categories').onDelete('CASCADE');
    table.string('recommendation_type', 100).notNullable();
    table.string('title', 255).notNullable();
    table.text('reason').notNullable();
    table.text('expected_impact').notNullable();
    table.string('priority', 20).defaultTo('MEDIUM');
    table.decimal('confidence_score', 5, 2).notNullable();
    table.boolean('is_applied').defaultTo(false);
    table.timestamps(true, true);
    table.index(['organization_id']);
  });
};

exports.down = async function (knex) {
  const tables = [
    'recommendations', 'risk_alerts', 'scenario_results', 'scenarios',
    'variances', 'forecast_results', 'forecasts', 'budgets', 'financial_plans',
    'expenses', 'sales', 'customers', 'products', 'categories', 'stores',
    'business_units', 'users', 'organizations'
  ];
  for (const table of tables) {
    await knex.schema.dropTableIfExists(table);
  }
};
