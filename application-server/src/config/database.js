const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const os = require('os');
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
      const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
      const isPg = config.client === 'pg';

      if (!isPg && isServerless) {
        const targetDbPath = config.connection && config.connection.filename
          ? config.connection.filename
          : path.join(os.tmpdir(), 'retail_planning.sqlite');

        const candidateArchives = [
          path.join(__dirname, '..', '..', 'database', 'retail_planning_seed.sqlite.gz'),
          path.join(process.cwd(), 'application-server', 'database', 'retail_planning_seed.sqlite.gz'),
          path.join(process.cwd(), 'database', 'retail_planning_seed.sqlite.gz'),
          path.resolve(__dirname, '../../../database/retail_planning_seed.sqlite.gz')
        ];

        const seedArchive = candidateArchives.find((p) => fs.existsSync(p));

        const targetNeedsExtract = !fs.existsSync(targetDbPath) || fs.statSync(targetDbPath).size < 10000000;
        if (targetNeedsExtract && seedArchive) {
          logger.info(`Unpacking complete dataset from ${seedArchive} to ${targetDbPath}...`);
          const compressed = fs.readFileSync(seedArchive);
          const decompressed = zlib.gunzipSync(compressed);
          fs.writeFileSync(targetDbPath, decompressed);
          logger.info(`Complete retail dataset unpacked successfully (${(decompressed.length / 1024 / 1024).toFixed(1)} MB).`);
        }
      }

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
