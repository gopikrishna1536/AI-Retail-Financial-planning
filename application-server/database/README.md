# Database Migrations & Seeds

## Structure

```text
database/
├── migrations/
│   └── 20260830_initial_schema.js
├── seeds/
│   └── 01_demo_seed.js
└── README.md
```

## Migration Engine

The platform uses **Knex.js** as its single migration framework for schema evolution across PostgreSQL (Production) and SQLite (Local Development).

## Running Migrations

```bash
# Run latest migrations
npm run migrate

# Rollback latest batch
npx knex migrate:rollback

# Seed demo data
npm run seed
```
