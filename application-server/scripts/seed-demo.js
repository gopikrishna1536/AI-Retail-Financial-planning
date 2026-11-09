const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../src/config/database');
const logger = require('../src/utils/logger');

async function seedDemoData() {
  logger.info('Starting demo seed script...');

  let seedData = null;
  try {
    seedData = require('../src/seed-data.json');
  } catch (_) {
    const seedDataPath = path.join(__dirname, '..', 'src', 'seed-data.json');
    if (fs.existsSync(seedDataPath)) {
      seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    }
  }

  if (seedData) {
    logger.info('Loaded comprehensive retail dataset. Populating database...');

    await db.transaction(async (trx) => {
      // 1. Organization
      const org = seedData.organization;
      const existingOrg = await trx('organizations').where({ id: org.id }).first();
      if (!existingOrg) {
        await trx('organizations').insert(org);
        logger.info(`Inserted organization: ${org.name}`);
      }

      // 2. Users
      for (const u of seedData.users) {
        const existing = await trx('users').where({ id: u.id }).first();
        if (!existing) {
          await trx('users').insert(u);
        }
      }

      // 3. Check if existing data is incomplete
      const existingStores = await trx('stores').where({ organization_id: org.id }).count('id as cnt').first();
      const needsFullReload = !existingStores || Number(existingStores.cnt) < (seedData.stores ? seedData.stores.length : 30);
      
      if (needsFullReload) {
        logger.info('Incomplete or missing store dataset detected. Refreshing data with full retail catalog...');
        await trx('sales').delete();
        await trx('variances').delete();
        await trx('expenses').delete();
        await trx('budgets').delete();
        await trx('financial_plans').delete();
        await trx('risk_alerts').delete();
        await trx('products').delete();
        await trx('categories').delete();
        await trx('stores').delete();
      }

      // 3. Stores
      const currentStores = await trx('stores').where({ organization_id: org.id }).count('id as cnt').first();
      if (!currentStores || Number(currentStores.cnt) === 0) {
        if (seedData.stores && seedData.stores.length > 0) {
          await trx('stores').insert(seedData.stores);
          logger.info(`Inserted ${seedData.stores.length} retail stores.`);
        }
      }

      // 4. Categories
      const existingCats = await trx('categories').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingCats || Number(existingCats.cnt) === 0) {
        if (seedData.categories && seedData.categories.length > 0) {
          await trx('categories').insert(seedData.categories);
          logger.info(`Inserted ${seedData.categories.length} categories.`);
        }
      }

      // 5. Products
      const existingProds = await trx('products').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingProds || Number(existingProds.cnt) === 0) {
        if (seedData.products && seedData.products.length > 0) {
          await trx('products').insert(seedData.products);
          logger.info(`Inserted ${seedData.products.length} products.`);
        }
      }

      // 6. Financial Plans
      const existingPlans = await trx('financial_plans').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingPlans || Number(existingPlans.cnt) === 0) {
        if (seedData.financial_plans && seedData.financial_plans.length > 0) {
          await trx('financial_plans').insert(seedData.financial_plans);
          logger.info(`Inserted ${seedData.financial_plans.length} financial plans.`);
        }
      }

      // 7. Budgets
      const existingBudgets = await trx('budgets').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingBudgets || Number(existingBudgets.cnt) === 0) {
        if (seedData.budgets && seedData.budgets.length > 0) {
          await trx('budgets').insert(seedData.budgets);
          logger.info(`Inserted ${seedData.budgets.length} budgets.`);
        }
      }

      // 8. Expenses
      const existingExpenses = await trx('expenses').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingExpenses || Number(existingExpenses.cnt) === 0) {
        if (seedData.expenses && seedData.expenses.length > 0) {
          await trx('expenses').insert(seedData.expenses);
          logger.info(`Inserted ${seedData.expenses.length} expenses.`);
        }
      }

      // 9. Variances
      const existingVariances = await trx('variances').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingVariances || Number(existingVariances.cnt) === 0) {
        if (seedData.variances && seedData.variances.length > 0) {
          await trx('variances').insert(seedData.variances);
          logger.info(`Inserted ${seedData.variances.length} variances.`);
        }
      }

      // 10. Risk Alerts
      const existingAlerts = await trx('risk_alerts').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingAlerts || Number(existingAlerts.cnt) === 0) {
        if (seedData.risk_alerts && seedData.risk_alerts.length > 0) {
          await trx('risk_alerts').insert(seedData.risk_alerts);
          logger.info(`Inserted ${seedData.risk_alerts.length} risk alerts.`);
        }
      }

      // 11. Sales (in batches of 500)
      const existingSales = await trx('sales').where({ organization_id: org.id }).count('id as cnt').first();
      if (!existingSales || Number(existingSales.cnt) === 0) {
        if (seedData.sales && seedData.sales.length > 0) {
          const batchSize = 500;
          for (let i = 0; i < seedData.sales.length; i += batchSize) {
            const batch = seedData.sales.slice(i, i + batchSize);
            await trx('sales').insert(batch);
          }
          logger.info(`Inserted ${seedData.sales.length} sales records across all stores.`);
        }
      }
    });

    logger.info('Comprehensive retail dataset seeding completed successfully.');
    return;
  }

  // Fallback demo seed if JSON file is missing
  logger.info('Fallback demo seed executed.');
}

if (require.main === module) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Seeding failed', { error: err.message, stack: err.stack });
      process.exit(1);
    });
}

module.exports = seedDemoData;
