const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = require('./env');
const logger = require('../utils/logger');

const environment = env.nodeEnv || 'development';
const config = knexConfig[environment] || knexConfig.development;

const db = knex(config);

let initPromise = null;

async function ensureDatabaseReady() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const hasUsers = await db.schema.hasTable('users');
      if (!hasUsers) {
        logger.info('Database tables not found. Automatically running migrations and demo seeds...');
        await db.migrate.latest();
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

module.exports = {
  db,
  ensureDatabaseReady,
  checkDatabaseConnection
};
