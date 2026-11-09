# Server 1 — Application Server

Node.js / Express.js Application Server for the **AI-Powered Retail Financial Planning Platform**.

## Architecture & Responsibilities

- **Authentication & RBAC**: JWT auth with bcrypt password hashing (`ADMIN`, `MANAGER`, `ANALYST`, `STAFF`).
- **Multi-Tenancy**: Organization-level SaaS data isolation via `organization_id`.
- **Entity Management**: Stores, Products, Categories, Customers, Sales, Expenses, Budgets, Financial Plans.
- **Financial Gateway**: Dashboard KPI calculation, variance analysis, and gateway calls to Server 2 ML microservice.

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run Database Migrations
npm run migrate

# 3. Import Kaggle Dataset (100,000 records)
npm run import-data

# 4. Run Test Suite
npm test

# 5. Start Application Server
npm run dev
```

Server 1 runs on `http://localhost:5000`. Health check at `GET /health`.
