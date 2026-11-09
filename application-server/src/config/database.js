const knex = require('knex');
const knexConfig = require('../../knexfile');
const env = require('./env');

const environment = env.nodeEnv || 'development';
const config = knexConfig[environment] || knexConfig.development;

const db = knex(config);

/**
 * Checks database connectivity
 */
async function checkDatabaseConnection() {
  try {
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
  checkDatabaseConnection
};
