const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '..', 'database', 'dev_retail_planning.sqlite')
  },
  useNullAsDefault: true
});

async function exportCleanData() {
  console.log('Extracting RetailCorp India dataset from local SQLite DB...');

  const org = await db('organizations').where({ code: 'retailcorp-india' }).first();
  if (!org) {
    throw new Error('retailcorp-india organization not found in local DB!');
  }
  const orgId = org.id;

  // 1. Users
  const users = await db('users').where({ organization_id: orgId });
  console.log(`Found ${users.length} users.`);

  // 2. Stores
  const stores = await db('stores').where({ organization_id: orgId });
  console.log(`Found ${stores.length} stores.`);

  // 3. Categories
  const categories = await db('categories').where({ organization_id: orgId });
  console.log(`Found ${categories.length} categories.`);

  // 4. Financial Plans
  const plans = await db('financial_plans').where({ organization_id: orgId });
  console.log(`Found ${plans.length} financial plans.`);

  // 5. Budgets
  const budgets = await db('budgets').where({ organization_id: orgId });
  console.log(`Found ${budgets.length} budgets.`);

  // 6. Expenses
  const expenses = await db('expenses').where({ organization_id: orgId });
  console.log(`Found ${expenses.length} expenses.`);

  // 7. Variances
  const variances = await db('variances').where({ organization_id: orgId });
  console.log(`Found ${variances.length} variances.`);

  // 8. Risk Alerts
  const risk_alerts = await db('risk_alerts').where({ organization_id: orgId });
  console.log(`Found ${risk_alerts.length} risk alerts.`);

  // 9. Products: get 1 product per category
  const products = [];
  const catIdToProdId = {};
  for (const cat of categories) {
    let prods = await db('products').where({ category_id: cat.id }).limit(1);
    if (prods.length === 0) {
      const newProd = {
        id: uuidv4(),
        organization_id: orgId,
        category_id: cat.id,
        product_code: `PRD-${cat.category_name.slice(0, 3).toUpperCase()}-01`,
        product_name: `${cat.category_name} Standard Product`
      };
      products.push(newProd);
      catIdToProdId[cat.id] = newProd.id;
    } else {
      products.push(prods[0]);
      catIdToProdId[cat.id] = prods[0].id;
    }
  }
  console.log(`Exported ${products.length} category-mapped products.`);

  // 10. Sales Summary by (store_id, category_id, year)
  // Perfectly preserves store breakdown, category breakdown, regional breakdown, and annual totals!
  const salesSummary = await db('sales')
    .join('products', 'sales.product_id', 'products.id')
    .where({ 'sales.organization_id': orgId })
    .groupBy('sales.store_id', 'products.category_id', 'sales.year')
    .select(
      'sales.store_id',
      'products.category_id',
      'sales.year',
      db.raw('SUM(sales.sales_amount) as total_sales'),
      db.raw('SUM(sales.profit_amount) as total_profit'),
      db.raw('AVG(sales.discount) as avg_discount'),
      db.raw('COUNT(sales.id) as txn_count')
    );

  console.log(`Extracted ${salesSummary.length} store-category-year sales aggregates.`);

  const sales = salesSummary.map((s, idx) => {
    const prodId = catIdToProdId[s.category_id] || products[0].id;
    const month = ((idx % 12) + 1).toString().padStart(2, '0');
    const day = ((idx % 27) + 1).toString().padStart(2, '0');
    const dateStr = `${s.year}-${month}-${day}`;
    return {
      id: uuidv4(),
      organization_id: orgId,
      store_id: s.store_id,
      product_id: prodId,
      order_id: `ORD-${s.year}${month}-${1000 + idx}`,
      sales_date: dateStr,
      order_date: dateStr,
      ship_date: dateStr,
      ship_mode: 'Standard Class',
      year: Number(s.year),
      quantity: Math.max(1, Number(s.txn_count || 1)),
      sales_amount: Number(s.total_sales.toFixed(2)),
      discount: Number((s.avg_discount || 0.25).toFixed(4)),
      profit_amount: Number(s.total_profit.toFixed(2))
    };
  });

  const totalRev = sales.reduce((acc, x) => acc + x.sales_amount, 0);
  const totalProf = sales.reduce((acc, x) => acc + x.profit_amount, 0);
  console.log(`Reconstructed Total Revenue: ₹${(totalRev / 1e7).toFixed(2)} Cr (${totalRev.toFixed(2)})`);
  console.log(`Reconstructed Total Profit:  ₹${(totalProf / 1e7).toFixed(2)} Cr (${totalProf.toFixed(2)})`);

  const exportPayload = {
    organization: org,
    users,
    stores,
    categories,
    products,
    financial_plans: plans,
    budgets,
    expenses,
    variances,
    risk_alerts,
    sales
  };

  const outputPath = path.join(__dirname, '..', 'src', 'seed-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportPayload, null, 2));
  const fileSizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`\nSuccessfully exported full dataset to ${outputPath} (${fileSizeKb} KB).`);

  await db.destroy();
}

exportCleanData().catch(err => {
  console.error('Export error:', err);
  process.exit(1);
});
