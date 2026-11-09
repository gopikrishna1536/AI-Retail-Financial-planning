const assert = require('assert');
const supertest = require('supertest');
const app = require('../src/app');
const { db } = require('../src/config/database');

async function runTests() {
  console.log('====================================================');
  console.log('    RUNNING APPLICATION SERVER (SERVER 1) TESTS     ');
  console.log('====================================================\n');

  console.log('Running database migrations...');
  await db.migrate.latest();

  const request = supertest(app);
  let adminToken = '';
  let staffToken = '';
  let demoOrgId = '';
  let createdStoreId = '';

  try {
    const timestamp = Date.now();

    // 1. Health Endpoint Test
    console.log('1. Testing GET /health ...');
    const healthRes = await request.get('/health');
    assert.strictEqual(healthRes.status, 200);
    assert.ok(healthRes.body.status === 'ok' || healthRes.body.status === 'degraded');
    console.log('   ✓ GET /health PASSED');

    // 2. Authentication: User Registration
    console.log('2. Testing POST /api/auth/register ...');
    const regRes = await request.post('/api/auth/register').send({
      organization_name: `Test Retail Corp ${timestamp}`,
      email: `testadmin_${timestamp}@testcorp.com`,
      password: 'AdminPassword123!',
      first_name: 'Test',
      last_name: 'Admin',
      role: 'ADMIN'
    });
    assert.strictEqual(regRes.status, 201);
    assert.strictEqual(regRes.body.success, true);
    assert.ok(regRes.body.data.token);
    adminToken = regRes.body.data.token;
    demoOrgId = regRes.body.data.user.organization_id;
    console.log('   ✓ POST /api/auth/register PASSED');

    // Register a Staff user
    const regStaff = await request.post('/api/auth/register').send({
      organization_name: `Test Retail Corp ${timestamp}`,
      email: `teststaff_${timestamp}@testcorp.com`,
      password: 'StaffPassword123!',
      first_name: 'Test',
      last_name: 'Staff',
      role: 'STAFF'
    });
    assert.strictEqual(regStaff.status, 201);
    staffToken = regStaff.body.data.token;

    // 3. Authentication: Login
    console.log('3. Testing POST /api/auth/login ...');
    const loginRes = await request.post('/api/auth/login').send({
      email: regRes.body.data.user.email,
      password: 'AdminPassword123!'
    });
    assert.strictEqual(loginRes.status, 200);
    assert.ok(loginRes.body.data.token);
    console.log('   ✓ POST /api/auth/login PASSED');

    // 4. Authentication: Invalid Login
    console.log('4. Testing Invalid Login handling ...');
    const invalidRes = await request.post('/api/auth/login').send({
      email: 'nonexistent@testcorp.com',
      password: 'wrongpassword'
    });
    assert.strictEqual(invalidRes.status, 401);
    assert.strictEqual(invalidRes.body.success, false);
    console.log('   ✓ Invalid Login Rejected PASSED');

    // 5. Auth Me Profile
    console.log('5. Testing GET /api/auth/me ...');
    const meRes = await request.get('/api/auth/me').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.body.data.organization_id, demoOrgId);
    console.log('   ✓ GET /api/auth/me PASSED');

    // 6. Store CRUD APIs
    console.log('6. Testing Store CRUD APIs ...');
    const createStoreRes = await request
      .post('/api/stores')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        store_code: `STR-TEST-${timestamp}`,
        state: 'Delhi',
        postal_code: '110001',
        city_type: 'Tier 1',
        outlet_type: 'Large',
        region: 'North'
      });
    assert.strictEqual(createStoreRes.status, 201);
    createdStoreId = createStoreRes.body.data.id;
    console.log('   ✓ POST /api/stores PASSED');

    const getStoresRes = await request.get('/api/stores').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(getStoresRes.status, 200);
    assert.ok(Array.isArray(getStoresRes.body.data));
    console.log('   ✓ GET /api/stores PASSED');

    // 7. Role Authorization: Staff cannot create store
    console.log('7. Testing RBAC Role Restrictions ...');
    const rbacRes = await request
      .post('/api/stores')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        store_code: `STR-STAFF-FORBIDDEN-${timestamp}`,
        state: 'Punjab',
        postal_code: '160001',
        city_type: 'Tier 2',
        outlet_type: 'Small',
        region: 'North'
      });
    assert.strictEqual(rbacRes.status, 403);
    console.log('   ✓ RBAC Role Restrictions PASSED');

    // 8. Category & Product APIs
    console.log('8. Testing Category & Product APIs ...');
    const catRes = await request
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category_name: `Test Category ${timestamp}`,
        sub_category_name: `Test SubCategory ${timestamp}`
      });
    assert.strictEqual(catRes.status, 201);
    const catId = catRes.body.data.id;

    const prodRes = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category_id: catId,
        product_code: `PROD-TEST-${timestamp}`,
        product_name: 'Test Product Item'
      });
    assert.strictEqual(prodRes.status, 201);
    console.log('   ✓ Category & Product CRUD PASSED');

    // 9. Financial Plans & Budgets
    console.log('9. Testing Financial Plans & Budget APIs ...');
    const planRes = await request
      .post('/api/financial-plans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        plan_name: `Q1 Financial Plan ${timestamp}`,
        period_type: 'QUARTERLY',
        year: 2026,
        period_number: 1,
        target_revenue: 350000000,
        target_expense: 290000000
      });
    assert.strictEqual(planRes.status, 201);
    const planId = planRes.body.data.id;

    const budgetRes = await request
      .post('/api/budgets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        financial_plan_id: planId,
        expense_category: 'Marketing',
        allocated_amount: 150000,
        actual_amount: 120000
      });
    assert.strictEqual(budgetRes.status, 201);
    console.log('   ✓ Financial Plan & Budget APIs PASSED');

    // 10. AI Predictive Financial Planning APIs
    console.log('10. Testing AI Predictive Financial Planning APIs ...');
    
    // 10a. Generate AI Plan
    const aiGenRes = await request
      .post('/api/financial-plans/ai-generate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ period_type: 'QUARTERLY', year: 2026, period_number: 3 });
    assert.strictEqual(aiGenRes.status, 200);
    assert.ok(aiGenRes.body.data.forecast.revenue > 0);
    assert.ok(aiGenRes.body.data.recommended_target.revenue > 0);
    assert.ok(aiGenRes.body.data.health_score.overall > 0);
    console.log('   ✓ POST /api/financial-plans/ai-generate PASSED');

    // 10b. Feasibility Analysis
    const feasRes = await request
      .post('/api/financial-plans/feasibility')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ target_revenue: 500000000, forecast_revenue: 372000000 });
    assert.strictEqual(feasRes.status, 200);
    assert.strictEqual(feasRes.body.data.feasibility_level, 'LOW FEASIBILITY');
    console.log('   ✓ POST /api/financial-plans/feasibility PASSED');

    // 10c. Scenario Simulation
    const simRes = await request
      .post('/api/financial-plans/simulate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ baseline_revenue: 350000000, baseline_expense: 290000000, sales_growth_change: 15, expense_growth_change: 8 });
    assert.strictEqual(simRes.status, 200);
    assert.ok(simRes.body.data.scenario.revenue > 350000000);
    console.log('   ✓ POST /api/financial-plans/simulate PASSED');

    // 10d. Budget Optimization
    const optRes = await request
      .post('/api/financial-plans/optimize-budget')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ total_budget: 100000000 });
    assert.strictEqual(optRes.status, 200);
    assert.strictEqual(optRes.body.data.allocations.length, 5);
    console.log('   ✓ POST /api/financial-plans/optimize-budget PASSED');

    // 10e. Approve Plan
    const appRes = await request
      .put(`/api/financial-plans/${planId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    assert.strictEqual(appRes.status, 200);
    assert.strictEqual(appRes.body.data.status, 'APPROVED');
    console.log('   ✓ PUT /api/financial-plans/:id/approve PASSED');

    // 10f. Performance Analysis
    const perfRes = await request
      .get(`/api/financial-plans/${planId}/performance`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(perfRes.status, 200);
    assert.ok(perfRes.body.data.comparison.revenue !== undefined);
    console.log('   ✓ GET /api/financial-plans/:id/performance PASSED');

    // 11. Dynamic Variances, Risk Alerts, and Recommendations APIs
    console.log('11. Testing Dynamic Variance & Risk Feedback APIs ...');
    const varRes = await request.get('/api/variances').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(varRes.status, 200);
    assert.ok(Array.isArray(varRes.body.data.variances));
    assert.ok(varRes.body.data.variances.length > 0);
    console.log('   ✓ GET /api/variances PASSED');

    const riskRes = await request.get('/api/risk-alerts').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(riskRes.status, 200);
    assert.ok(Array.isArray(riskRes.body.data));
    console.log('   ✓ GET /api/risk-alerts PASSED');

    const recRes = await request.get('/api/recommendations').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(recRes.status, 200);
    assert.ok(Array.isArray(recRes.body.data));
    console.log('   ✓ GET /api/recommendations PASSED');

    // 12. Dashboard Summary API
    console.log('12. Testing GET /api/dashboard/summary ...');
    const dashRes = await request
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(dashRes.status, 200);
    assert.ok(dashRes.body.data.total_revenue !== undefined);
    assert.ok(dashRes.body.data.total_expenses !== undefined);
    assert.ok(dashRes.body.data.net_profit !== undefined);
    console.log('   ✓ GET /api/dashboard/summary PASSED');

    console.log('\n====================================================');
    console.log('   ALL APPLICATION SERVER TESTS PASSED (12/12)      ');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    if (err.response) {
      console.error('Response Status:', err.response.status);
      console.error('Response Body:', err.response.body);
    }
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
