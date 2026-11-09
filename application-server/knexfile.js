const path = require('path');
require('dotenv').config();

const isPgRequested = process.env.DATABASE_CLIENT === 'pg' || 
  (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://')));

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT || 'sqlite3',
    connection: process.env.DATABASE_CLIENT === 'pg' ? (process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'retail_financial_db'
    }) : {
      filename: path.join(__dirname, 'database', 'dev_retail_planning.sqlite')
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
            conn.run('PRAGMA synchronous = NORMAL;', () => {
              conn.run('PRAGMA cache_size = -64000;', () => {
                conn.run('PRAGMA temp_store = MEMORY;', () => {
                  conn.run('PRAGMA mmap_size = 268435456;', cb);
                });
              });
            });
          });
        });
      }
    }
  },

  production: {
    client: isPgRequested ? 'pg' : (process.env.DATABASE_CLIENT || 'sqlite3'),
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
      filename: path.join(__dirname, 'database', 'dev_retail_planning.sqlite')
    }),
    useNullAsDefault: true,
    pool: isPgRequested ? { min: 2, max: 20 } : undefined,
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  }
};
