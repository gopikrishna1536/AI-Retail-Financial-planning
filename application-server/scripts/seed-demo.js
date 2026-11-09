const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../src/config/database');
const logger = require('../src/utils/logger');

async function seedDemoData() {
  logger.info('Starting demo seed script...');

  await db.transaction(async (trx) => {
    // 1. Create demo organization
    let org = await trx('organizations').where({ code: 'retailcorp-india' }).first();
    let orgId;
    if (!org) {
      orgId = uuidv4();
      await trx('organizations').insert({
        id: orgId,
        name: 'RetailCorp India',
        code: 'retailcorp-india',
        currency: 'INR',
        industry: 'Retail Store Operations'
      });
      logger.info(`Created demo organization: RetailCorp India (${orgId})`);
    } else {
      orgId = org.id;
    }

    // 2. Demo Users
    const demoUsers = [
      {
        email: 'admin@retailcorp.com',
        password: 'AdminPassword123!',
        first_name: 'System',
        last_name: 'Admin',
        role: 'ADMIN'
      },
      {
        email: 'manager@retailcorp.com',
        password: 'ManagerPassword123!',
        first_name: 'Store',
        last_name: 'Manager',
        role: 'MANAGER'
      },
      {
        email: 'analyst@retailcorp.com',
        password: 'AnalystPassword123!',
        first_name: 'Financial',
        last_name: 'Analyst',
        role: 'ANALYST'
      },
      {
        email: 'staff@retailcorp.com',
        password: 'StaffPassword123!',
        first_name: 'Frontline',
        last_name: 'Staff',
        role: 'STAFF'
      }
    ];

    for (const u of demoUsers) {
      const existing = await trx('users').where({ organization_id: orgId, email: u.email }).first();
      if (!existing) {
        const password_hash = await bcrypt.hash(u.password, 10);
        await trx('users').insert({
          id: uuidv4(),
          organization_id: orgId,
          email: u.email,
          password_hash,
          first_name: u.first_name,
          last_name: u.last_name,
          role: u.role,
          is_active: true
        });
        logger.info(`Created demo user: ${u.email} [Role: ${u.role}]`);
      }
    }

    // 3. Demo Stores
    const demoStores = [
      { code: 'STR-101', state: 'Maharashtra', postal: '400001', city_type: 'Tier 1', outlet: 'Supermarket', region: 'West' },
      { code: 'STR-102', state: 'Delhi', postal: '110001', city_type: 'Tier 1', outlet: 'Supermarket', region: 'North' },
      { code: 'STR-103', state: 'Karnataka', postal: '560001', city_type: 'Tier 1', outlet: 'Hypermarket', region: 'South' },
      { code: 'STR-104', state: 'West Bengal', postal: '700001', city_type: 'Tier 2', outlet: 'Department Store', region: 'East' }
    ];

    const storeMap = new Map();
    for (const s of demoStores) {
      let store = await trx('stores').where({ organization_id: orgId, store_code: s.code }).first();
      if (!store) {
        const storeId = uuidv4();
        await trx('stores').insert({
          id: storeId,
          organization_id: orgId,
          store_code: s.code,
          state: s.state,
          postal_code: s.postal,
          city_type: s.city_type,
          outlet_type: s.outlet,
          region: s.region,
          country: 'India'
        });
        storeMap.set(s.code, storeId);
      } else {
        storeMap.set(s.code, store.id);
      }
    }

    // 4. Demo Categories & Products
    const categoriesData = [
      { name: 'Electronics', sub: 'Smartphones', products: [{ code: 'PRD-EL-01', name: 'Galaxy Pro Max 5G' }, { code: 'PRD-EL-02', name: 'Smart Fitness Band' }] },
      { name: 'Fashion', sub: 'Apparel', products: [{ code: 'PRD-FA-01', name: 'Slim Fit Cotton Shirt' }, { code: 'PRD-FA-02', name: 'Classic Denim Jeans' }] },
      { name: 'Groceries', sub: 'Packaged Goods', products: [{ code: 'PRD-GR-01', name: 'Organic Basmati Rice 5kg' }, { code: 'PRD-GR-02', name: 'Cold Pressed Virgin Olive Oil' }] }
    ];

    const productList = [];
    for (const cat of categoriesData) {
      let category = await trx('categories').where({ organization_id: orgId, category_name: cat.name, sub_category_name: cat.sub }).first();
      let catId;
      if (!category) {
        catId = uuidv4();
        await trx('categories').insert({
          id: catId,
          organization_id: orgId,
          category_name: cat.name,
          sub_category_name: cat.sub
        });
      } else {
        catId = category.id;
      }

      for (const p of cat.products) {
        let product = await trx('products').where({ organization_id: orgId, product_code: p.code }).first();
        if (!product) {
          const prodId = uuidv4();
          await trx('products').insert({
            id: prodId,
            organization_id: orgId,
            category_id: catId,
            product_code: p.code,
            product_name: p.name
          });
          productList.push({ id: prodId, code: p.code });
        } else {
          productList.push({ id: product.id, code: p.code });
        }
      }
    }

    // 5. Demo Financial Plan
    let plan = await trx('financial_plans').where({ organization_id: orgId, plan_name: 'FY2026 Enterprise Growth Plan' }).first();
    let planId;
    if (!plan) {
      planId = uuidv4();
      await trx('financial_plans').insert({
        id: planId,
        organization_id: orgId,
        plan_name: 'FY2026 Enterprise Growth Plan',
        period_type: 'YEARLY',
        year: 2026,
        period_number: 1,
        target_revenue: 125000000.00,
        target_expense: 85000000.00,
        target_profit: 40000000.00,
        target_profit_margin: 32.00,
        ai_forecast_revenue: 122000000.00,
        ai_forecast_expense: 84000000.00,
        ai_forecast_profit: 38000000.00,
        forecast_confidence: 91.50,
        recommended_revenue: 128000000.00,
        recommended_expense: 83000000.00,
        recommended_profit: 45000000.00,
        feasibility_score: 88.50,
        health_score: 92.00,
        risk_level: 'LOW',
        status: 'APPROVED',
        approved_by: 'admin@retailcorp.com',
        approved_at: new Date()
      });
      logger.info('Created demo financial plan FY2026');
    } else {
      planId = plan.id;
    }

    // 6. Demo Budgets
    const budgetCategories = [
      { cat: 'Store Operations', allocated: 25000000, actual: 21500000, status: 'ON TRACK' },
      { cat: 'Marketing & Digital', allocated: 18000000, actual: 16200000, status: 'ON TRACK' },
      { cat: 'Logistics & Supply Chain', allocated: 22000000, actual: 23100000, status: 'WARNING' },
      { cat: 'IT & Omnichannel', allocated: 12000000, actual: 9800000, status: 'UNDER BUDGET' },
      { cat: 'Human Resources & Staffing', allocated: 8000000, actual: 7900000, status: 'ON TRACK' }
    ];

    for (const b of budgetCategories) {
      const existingBudget = await trx('budgets').where({ organization_id: orgId, financial_plan_id: planId, expense_category: b.cat }).first();
      if (!existingBudget) {
        await trx('budgets').insert({
          id: uuidv4(),
          organization_id: orgId,
          financial_plan_id: planId,
          expense_category: b.cat,
          allocated_amount: b.allocated,
          actual_amount: b.actual,
          status: b.status
        });
      }
    }

    // 7. Demo Sales (sample records for charts)
    const existingSalesCount = await trx('sales').where({ organization_id: orgId }).count('id as cnt').first();
    if (!existingSalesCount || Number(existingSalesCount.cnt) === 0) {
      const sampleSales = [];
      const storeIds = Array.from(storeMap.values());
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      
      for (const m of months) {
        const monthStr = m < 10 ? `0${m}` : `${m}`;
        for (let i = 0; i < storeIds.length; i++) {
          const storeId = storeIds[i];
          const prodId = productList[i % productList.length]?.id;
          if (storeId && prodId) {
            const amount = 850000 + (m * 42000) + (i * 95000);
            const profit = amount * 0.28;
            sampleSales.push({
              id: uuidv4(),
              organization_id: orgId,
              store_id: storeId,
              product_id: prodId,
              order_id: `ORD-2026-${monthStr}-${1000 + i}`,
              sales_date: `2026-${monthStr}-15`,
              order_date: `2026-${monthStr}-14`,
              ship_date: `2026-${monthStr}-17`,
              ship_mode: 'Standard Class',
              year: 2026,
              quantity: 120 + (m * 10),
              sales_amount: amount,
              discount: 0.05,
              profit_amount: profit
            });
          }
        }
      }
      if (sampleSales.length > 0) {
        await trx('sales').insert(sampleSales);
        logger.info(`Inserted ${sampleSales.length} sample sales transactions.`);
      }
    }

    // 8. Demo Expenses
    const existingExpCount = await trx('expenses').where({ organization_id: orgId }).count('id as cnt').first();
    if (!existingExpCount || Number(existingExpCount.cnt) === 0) {
      const storeIds = Array.from(storeMap.values());
      const sampleExpenses = [];
      for (let m = 1; m <= 12; m++) {
        const monthStr = m < 10 ? `0${m}` : `${m}`;
        for (let i = 0; i < storeIds.length; i++) {
          sampleExpenses.push({
            id: uuidv4(),
            organization_id: orgId,
            store_id: storeIds[i],
            expense_category: i % 2 === 0 ? 'Rent & Utilities' : 'Store Staffing',
            amount: 140000 + (m * 5000),
            expense_date: `2026-${monthStr}-01`,
            period_type: 'MONTHLY',
            description: `Monthly operating costs for 2026-${monthStr}`
          });
        }
      }
      if (sampleExpenses.length > 0) {
        await trx('expenses').insert(sampleExpenses);
        logger.info(`Inserted ${sampleExpenses.length} sample expenses.`);
      }
    }

    // 9. Demo Risk Alerts
    const existingAlerts = await trx('risk_alerts').where({ organization_id: orgId }).first();
    if (!existingAlerts) {
      await trx('risk_alerts').insert([
        {
          id: uuidv4(),
          organization_id: orgId,
          alert_type: 'BUDGET_OVERRUN',
          severity: 'HIGH',
          risk_score: 85.50,
          description: 'Logistics and freight distribution exceeded allocated budget threshold by 5.0% in Q3.',
          recommended_action: 'Reallocate surplus from Omnichannel IT budget and review freight contracts.',
          status: 'ACTIVE'
        },
        {
          id: uuidv4(),
          organization_id: orgId,
          alert_type: 'MARGIN_COMPRESSION',
          severity: 'MEDIUM',
          risk_score: 62.00,
          description: 'Promotional discount elevation in smartphones contracted category margin to 22.4%.',
          recommended_action: 'Cap seasonal promotion discount at 8% and bundle with high-margin accessories.',
          status: 'ACTIVE'
        }
      ]);
      logger.info('Inserted demo risk alerts.');
    }
  });

  logger.info('Demo seeding completed successfully.');
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
