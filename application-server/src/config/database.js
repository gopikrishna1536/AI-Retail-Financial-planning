const path = require('path');
const fs = require('fs');
const os = require('os');
const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = require('./env');
const logger = require('../utils/logger');

const environment = env.nodeEnv || 'development';
const config = knexConfig[environment] || knexConfig.development;

const db = knex(config);

const migrationSource = {
  getMigrations() {
    return Promise.resolve([
      '20260830_initial_schema',
      '20260902_upgrade_financial_plans',
      '20260902_performance_indexes'
    ]);
  },
  getMigrationName(migration) {
    return migration;
  },
  getMigration(migration) {
    switch (migration) {
      case '20260830_initial_schema':
        return require('../../database/migrations/20260830_initial_schema');
      case '20260902_upgrade_financial_plans':
        return require('../../database/migrations/20260902_upgrade_financial_plans');
      case '20260902_performance_indexes':
        return require('../../database/migrations/20260902_performance_indexes');
      default:
        throw new Error(`Unknown migration: ${migration}`);
    }
  }
};

let initPromise = null;

async function ensureDatabaseReady() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const hasUsers = await db.schema.hasTable('users');
      let needsSeed = false;

      if (!hasUsers) {
        logger.info('Database tables not found. Automatically running migrations and demo seeds...');
        await db.migrate.latest({ migrationSource });
        needsSeed = true;
      } else {
        const storeCountRes = await db('stores').count('id as cnt').first().catch(() => null);
        const storeCount = Number(storeCountRes?.cnt || 0);
        if (storeCount < 10) {
          needsSeed = true;
        }
      }

      if (needsSeed) {
        logger.info('Seeding full retail dataset...');
        const seedDemoData = require('../../scripts/seed-demo');
        await seedDemoData();
        logger.info('Database migrations and seeds completed successfully.');
      }
    } catch (err) {
      logger.error('Failed to initialize database:', { error: err.message });
      initPromise = null; // allow retry on next request if transient
      throw err;
    }
  })();
  return initPromise;
}

/**
 * Checks database connectivity
 */
async function checkDatabaseConnection() {
  try {
    await ensureDatabaseReady();
    await db.raw('SELECT 1');
    return {
      connected: true,
      client: config.client,
      error: null
    };
  } catch (error) {
    return {
      connected: false,
      client: config.client,
      error: error.message
    };
  }
}

async function getDatabaseDebugInfo() {
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
  const targetDbPath = config.connection && config.connection.filename
    ? config.connection.filename
    : path.join(os.tmpdir(), 'retail_planning.sqlite');
  
  let targetSize = 0;
  if (fs.existsSync(targetDbPath)) {
    try { targetSize = fs.statSync(targetDbPath).size; } catch (_) {}
  }

  let storeCount = 0;
  let totalRevenue = 0;
  try {
    const s = await db('stores').count('id as cnt').first();
    storeCount = Number(s?.cnt || 0);
    const rev = await db('sales').sum('sales_amount as rev').first();
    totalRevenue = Number(rev?.rev || 0);
  } catch (_) {}

  return {
    isServerless,
    targetDbPath,
    targetSize,
    storeCount,
    totalRevenue
  };
}

module.exports = {
  db,
  ensureDatabaseReady,
  checkDatabaseConnection,
  getDatabaseDebugInfo
};
