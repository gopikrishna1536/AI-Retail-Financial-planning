const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class BudgetService {
  async getAll(organizationId, filters = {}) {
    let query = db('budgets')
      .join('financial_plans', 'budgets.financial_plan_id', 'financial_plans.id')
      .where('budgets.organization_id', organizationId);

    if (filters.financial_plan_id) query = query.andWhere('budgets.financial_plan_id', filters.financial_plan_id);
    if (filters.expense_category) query = query.andWhere('budgets.expense_category', filters.expense_category);
    if (filters.status) query = query.andWhere('budgets.status', filters.status);

    const budgets = await query.select(
      'budgets.*',
      'financial_plans.plan_name',
      'financial_plans.period_type',
      'financial_plans.year',
      'financial_plans.period_number'
    ).orderBy('financial_plans.year', 'desc');

    return budgets.map(b => {
      const allocated = Number(b.allocated_amount);
      const actual = Number(b.actual_amount);
      const remaining = allocated - actual;
      const variance = actual - allocated;
      const utilization = allocated > 0 ? Number(((actual / allocated) * 100).toFixed(2)) : 0;
      
      let status = 'ON TRACK';
      if (utilization > 100) status = 'OVER BUDGET';
      else if (utilization > 85) status = 'WARNING';

      return {
        ...b,
        allocated_amount: allocated,
        actual_amount: actual,
        remaining: Number(remaining.toFixed(2)),
        variance: Number(variance.toFixed(2)),
        utilization_pct: utilization,
        status
      };
    });
  }

  async getById(id, organizationId) {
    const budget = await db('budgets').where({ id, organization_id: organizationId }).first();
    if (!budget) throw new Error('Budget record not found');
    return budget;
  }

  async create(organizationId, data) {
    const id = uuidv4();
    const allocated = Number(data.allocated_amount) || 0;
    const actual = Number(data.actual_amount) || 0;
    const utilization = allocated > 0 ? (actual / allocated) * 100 : 0;
    
    let status = 'ON TRACK';
    if (utilization > 100) status = 'OVER BUDGET';
    else if (utilization > 85) status = 'WARNING';

    const newBudget = {
      id,
      organization_id: organizationId,
      financial_plan_id: data.financial_plan_id,
      expense_category: data.expense_category,
      allocated_amount: allocated,
      actual_amount: actual,
      status: data.status || status
    };

    await db('budgets').insert(newBudget);
    return await this.getById(id, organizationId);
  }

  async update(id, organizationId, data) {
    const existing = await this.getById(id, organizationId);
    
    const allocated = data.allocated_amount !== undefined ? Number(data.allocated_amount) : Number(existing.allocated_amount);
    const actual = data.actual_amount !== undefined ? Number(data.actual_amount) : Number(existing.actual_amount);
    const utilization = allocated > 0 ? (actual / allocated) * 100 : 0;

    let status = 'ON TRACK';
    if (utilization > 100) status = 'OVER BUDGET';
    else if (utilization > 85) status = 'WARNING';

    const updateData = {
      allocated_amount: allocated,
      actual_amount: actual,
      status: data.status || status,
      updated_at: db.fn.now()
    };
    if (data.expense_category) updateData.expense_category = data.expense_category;

    await db('budgets').where({ id, organization_id: organizationId }).update(updateData);
    return await this.getById(id, organizationId);
  }

  async deleteBudget(id, organizationId) {
    await this.getById(id, organizationId);
    await db('budgets').where({ id, organization_id: organizationId }).delete();
    return { success: true, message: 'Budget record deleted successfully' };
  }
}

module.exports = new BudgetService();
