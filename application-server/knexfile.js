const path = require('path');
const os = require('os');
const fs = require('fs');
require('dotenv').config();

const isPgRequested = process.env.DATABASE_CLIENT === 'pg' || 
  (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://')));

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);

function getSqlitePath() {
  if (isServerless) {
    return path.join(os.tmpdir(), 'retail_planning.sqlite');
  }
  const localDbDir = path.join(__dirname, 'database');
  if (!fs.existsSync(localDbDir)) {
    try {
      fs.mkdirSync(localDbDir, { recursive: true });
    } catch (_) {}
  }
  const defaultLocalDb = path.join(localDbDir, 'dev_retail_planning.sqlite');
  return fs.existsSync(defaultLocalDb) ? defaultLocalDb : path.join(localDbDir, 'retail_planning.sqlite');
}

const sqliteFilename = getSqlitePath();

module.exports = {
  development: {
    client: isPgRequested ? 'pg' : (process.env.DATABASE_CLIENT || 'sqlite3'),
    connection: isPgRequested ? (process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'retail_financial_db',
      ssl: process.env.DB_SSL === 'false' ? false : (process.env.DB_SSL ? { rejectUnauthorized: false } : false)
    }) : {
      filename: sqliteFilename
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    },
    pool: isPgRequested ? { min: 2, max: 10 } : {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON;', () => {
          conn.run('PRAGMA journal_mode = WAL;', () => {
            conn.run('PRAGMA synchronous = NORMAL;', cb);
          });
        });
      }
    }
  },

  production: {
    client: isPgRequested ? 'pg' : 'sqlite3',
    connection: process.env.DATABASE_URL ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    } : (isPgRequested ? {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    } : {
      filename: sqliteFilename
    }),
    useNullAsDefault: true,
    pool: isPgRequested ? { min: 2, max: 20 } : {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON;', cb);
      }
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  }
};
