const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../src/config/database');
const logger = require('../src/utils/logger');
const seedDemoData = require('./seed-demo');
const { calculateRiskScore } = require('../src/utils/financialCalculations');

const CSV_PATH = path.join(__dirname, '..', '..', 'kaggle dataset', 'store_sales_data (2).csv');

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

async function importDataset() {
  console.time('Dataset Import Duration');
  logger.info(`Starting Fast CSV Dataset Import from: ${CSV_PATH}`);

  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`Kaggle dataset CSV file not found at: ${CSV_PATH}`);
  }

  // 1. Ensure DB migrations and demo seed
  logger.info('Ensuring database migrations are up to date...');
  await db.migrate.latest();
  await seedDemoData();

  const org = await db('organizations').where({ code: 'retailcorp-india' }).first();
  const orgId = org.id;

  // 2. Clear existing data in transaction
  logger.info('Clearing existing data for clean import...');
  await db.transaction(async (trx) => {
    await trx('risk_alerts').where({ organization_id: orgId }).delete();
    await trx('variances').where({ organization_id: orgId }).delete();
    await trx('budgets').where({ organization_id: orgId }).delete();
    await trx('financial_plans').where({ organization_id: orgId }).delete();
    await trx('expenses').where({ organization_id: orgId }).delete();
    await trx('sales').where({ organization_id: orgId }).delete();
    await trx('products').where({ organization_id: orgId }).delete();
    await trx('categories').where({ organization_id: orgId }).delete();
    await trx('stores').where({ organization_id: orgId }).delete();
    await trx('customers').where({ organization_id: orgId }).delete();
  });

  // In-memory data collections
  const storesToInsert = new Map();     // storeCode -> Object
  const categoriesToInsert = new Map(); // catKey -> Object
  const productsToInsert = new Map();   // productCode -> Object
  const customersToInsert = new Map();  // customerCode -> Object
  const salesRecords = [];

  const fileStream = fs.createReadStream(CSV_PATH);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let isHeader = true;
  let rowCount = 0;

  for await (const line of rl) {
    if (!line || !line.trim()) continue;

    if (isHeader) {
      isHeader = false;
      continue;
    }

    const cols = parseCsvLine(line);
    if (cols.length < 25) continue;

    rowCount++;

    const customerIdStr = cols[0];
    const customerFirstName = cols[1];
    const customerLastName = cols[2];
    const dob = cols[3];
    const salesAmount = parseFloat(cols[4]) || 0;
    const year = parseInt(cols[5], 10) || 2023;
    const outletType = cols[6];
    const cityType = cols[7];
    const categoryName = cols[8];
    const region = cols[9];
    const country = cols[10] || 'India';
    const segment = cols[11];
    const salesDate = cols[12];
    const orderIdStr = cols[13];
    const orderDate = cols[14];
    const shipDate = cols[15];
    const shipMode = cols[16];
    const state = cols[17];
    const postalCode = cols[18];
    const productIdStr = cols[19];
    const subCategoryName = cols[20];
    const productName = cols[21];
    const quantity = parseInt(cols[22], 10) || 1;
    const discount = parseFloat(cols[23]) || 0;
    const profitAmount = parseFloat(cols[24]) || 0;

    // 1. Store
    const stateAbbr = state.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    const storeCode = `STR-${stateAbbr}-${postalCode}-${outletType.substring(0, 1).toUpperCase()}`;
    if (!storesToInsert.has(storeCode)) {
      storesToInsert.set(storeCode, {
        id: uuidv4(),
        organization_id: orgId,
        store_code: storeCode,
        state,
        postal_code: String(postalCode),
        city_type: cityType,
        outlet_type: outletType,
        region,
        country
      });
    }
    const storeObj = storesToInsert.get(storeCode);

    // 2. Category
    const catKey = `${categoryName}::${subCategoryName}`;
    if (!categoriesToInsert.has(catKey)) {
      categoriesToInsert.set(catKey, {
        id: uuidv4(),
        organization_id: orgId,
        category_name: categoryName,
        sub_category_name: subCategoryName
      });
    }
    const catObj = categoriesToInsert.get(catKey);

    // 3. Product
    if (!productsToInsert.has(productIdStr)) {
      productsToInsert.set(productIdStr, {
        id: uuidv4(),
        organization_id: orgId,
        category_id: catObj.id,
        product_code: productIdStr,
        product_name: productName
      });
    }
    const prodObj = productsToInsert.get(productIdStr);

    // 4. Customer (Limit unique customer records to 1,000)
    let customerObj = null;
    if (customersToInsert.size < 1000) {
      if (!customersToInsert.has(customerIdStr)) {
        customersToInsert.set(customerIdStr, {
          id: uuidv4(),
          organization_id: orgId,
          customer_code: customerIdStr,
          first_name: customerFirstName,
          last_name: customerLastName,
          date_of_birth: dob,
          segment
        });
      }
      customerObj = customersToInsert.get(customerIdStr);
    }

    // 5. Sales
    salesRecords.push({
      id: uuidv4(),
      organization_id: orgId,
      store_id: storeObj.id,
      product_id: prodObj.id,
      customer_id: customerObj ? customerObj.id : null,
      order_id: orderIdStr,
      sales_date: salesDate,
      order_date: orderDate,
      ship_date: shipDate,
      ship_mode: shipMode,
      year,
      quantity,
      sales_amount: salesAmount,
      discount,
      profit_amount: profitAmount
    });
  }

  logger.info(`Parsed ${rowCount} CSV rows. Inserting master entities in single transaction...`);

  // Single transaction for ultra-fast disk commits
  await db.transaction(async (trx) => {
    const CHUNK_SIZE = 200;

    // Insert Stores
    const storesList = Array.from(storesToInsert.values());
    for (let i = 0; i < storesList.length; i += CHUNK_SIZE) {
      await trx('stores').insert(storesList.slice(i, i + CHUNK_SIZE));
    }
    logger.info(`Inserted ${storesList.length} unique stores.`);

    // Insert Categories
    const categoriesList = Array.from(categoriesToInsert.values());
    for (let i = 0; i < categoriesList.length; i += CHUNK_SIZE) {
      await trx('categories').insert(categoriesList.slice(i, i + CHUNK_SIZE));
    }
    logger.info(`Inserted ${categoriesList.length} unique categories.`);

    // Insert Products
    const productsList = Array.from(productsToInsert.values());
    for (let i = 0; i < productsList.length; i += CHUNK_SIZE) {
      await trx('products').insert(productsList.slice(i, i + CHUNK_SIZE));
    }
    logger.info(`Inserted ${productsList.length} unique products.`);

    // Insert Customers
    const customersList = Array.from(customersToInsert.values());
    for (let i = 0; i < customersList.length; i += CHUNK_SIZE) {
      await trx('customers').insert(customersList.slice(i, i + CHUNK_SIZE));
    }
    logger.info(`Inserted ${customersList.length} customer profiles.`);

    // Insert Sales
    for (let i = 0; i < salesRecords.length; i += CHUNK_SIZE) {
      await trx('sales').insert(salesRecords.slice(i, i + CHUNK_SIZE));
      if ((i + CHUNK_SIZE) % 20000 === 0 || i + CHUNK_SIZE >= salesRecords.length) {
        logger.info(`Inserted ${Math.min(i + CHUNK_SIZE, salesRecords.length)} / ${salesRecords.length} sales records...`);
      }
    }
  });

  logger.info(`Successfully bulk-inserted all ${rowCount} raw sales records!`);

  // 6. Generate Financial Assumption Layer (Expenses, Plans, Budgets)
  logger.info('Generating Financial Assumption Layer (Expenses & Plans)...');

  const years = [2019, 2020, 2021, 2022, 2023];
  const allStoresList = Array.from(storesToInsert.values());

  await db.transaction(async (trx) => {
    for (const yr of years) {
      const planId = uuidv4();
      const yearlySalesRes = await trx('sales')
        .where({ organization_id: orgId, year: yr })
        .sum({ total_sales: 'sales_amount', total_profit: 'profit_amount' })
        .first();

      const actualRev = Number(yearlySalesRes?.total_sales || 0);
      const actualGrossProf = Number(yearlySalesRes?.total_profit || 0);
      const plannedRev = actualRev * 1.08;
      const plannedExp = plannedRev * 0.88;
      const plannedProf = plannedRev - plannedExp;

      await trx('financial_plans').insert({
        id: planId,
        organization_id: orgId,
        plan_name: `Annual Financial Plan ${yr}`,
        period_type: 'ANNUAL',
        year: yr,
        period_number: 1,
        target_revenue: Number(plannedRev.toFixed(2)),
        target_expense: Number(plannedExp.toFixed(2)),
        target_profit: Number(plannedProf.toFixed(2)),
        target_profit_margin: Number(((plannedProf / plannedRev) * 100).toFixed(2))
      });

      const expCategories = [
        { name: 'Marketing', pct: 0.065 },
        { name: 'Operations', pct: 0.090 },
        { name: 'Rent', pct: 0.055 },
        { name: 'Employee', pct: 0.090 },
        { name: 'Utilities', pct: 0.025 },
        { name: 'Logistics', pct: 0.035 },
        { name: 'Inventory', pct: 0.020 }
      ];

      for (const cat of expCategories) {
        const allocated = plannedRev * cat.pct;
        const actualExp = actualRev * cat.pct * (0.95 + Math.random() * 0.12);
        const util = (actualExp / allocated) * 100;
        
        let status = 'ON TRACK';
        if (util > 100) status = 'OVER BUDGET';
        else if (util > 85) status = 'WARNING';

        await trx('budgets').insert({
          id: uuidv4(),
          organization_id: orgId,
          financial_plan_id: planId,
          expense_category: cat.name,
          allocated_amount: Number(allocated.toFixed(2)),
          actual_amount: Number(actualExp.toFixed(2)),
          status
        });

        await trx('expenses').insert({
          id: uuidv4(),
          organization_id: orgId,
          store_id: allStoresList[Math.floor(Math.random() * allStoresList.length)]?.id,
          expense_category: cat.name,
          amount: Number(actualExp.toFixed(2)),
          expense_date: `${yr}-06-30`,
          period_type: 'ANNUAL',
          description: `Annual ${cat.name} operating expenditure`
        });
      }

      const risk = calculateRiskScore(actualRev * 0.88, plannedExp, actualGrossProf - (actualRev * 0.23));
      if (risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL') {
        await trx('risk_alerts').insert({
          id: uuidv4(),
          organization_id: orgId,
          store_id: allStoresList[0]?.id,
          alert_type: 'PROFITABILITY_RISK',
          severity: risk.riskLevel,
          risk_score: risk.riskScore,
          description: `Year ${yr} financial risk score elevated to ${risk.riskScore}. Margin compression detected.`,
          recommended_action: 'Review operational expenditure allocations and optimize discounting.',
          status: 'ACTIVE'
        });
      }
    }
  });

  console.timeEnd('Dataset Import Duration');
  logger.info('=== DATASET IMPORT COMPLETE ===');
}

if (require.main === module) {
  importDataset()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Import failed', { error: err.message, stack: err.stack });
      process.exit(1);
    });
}

module.exports = importDataset;
