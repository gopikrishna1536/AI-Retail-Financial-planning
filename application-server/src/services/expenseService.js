const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ExpenseService {
  async getAll(organizationId, filters = {}) {
    let query = db('expenses')
      .leftJoin('stores', 'expenses.store_id', 'stores.id')
      .where('expenses.organization_id', organizationId);

    if (filters.store_id) query = query.andWhere('expenses.store_id', filters.store_id);
    if (filters.expense_category) query = query.andWhere('expenses.expense_category', filters.expense_category);
    if (filters.start_date) query = query.andWhere('expenses.expense_date', '>=', filters.start_date);
    if (filters.end_date) query = query.andWhere('expenses.expense_date', '<=', filters.end_date);

    return await query
      .select(
        'expenses.*',
        'stores.store_code',
        'stores.state'
      )
      .orderBy('expenses.expense_date', 'desc');
  }

  async getById(id, organizationId) {
    const expense = await db('expenses').where({ id, organization_id: organizationId }).first();
    if (!expense) throw new Error('Expense not found');
    return expense;
  }

  async create(organizationId, data) {
    const id = uuidv4();
    const newExpense = {
      id,
      organization_id: organizationId,
      store_id: data.store_id || null,
      expense_category: data.expense_category,
      amount: data.amount,
      expense_date: data.expense_date,
      period_type: data.period_type || 'MONTHLY',
      description: data.description || ''
    };

    await db('expenses').insert(newExpense);
    return await this.getById(id, organizationId);
  }

  async update(id, organizationId, data) {
    await this.getById(id, organizationId);
    
    const allowed = ['store_id', 'expense_category', 'amount', 'expense_date', 'period_type', 'description'];
    const updateData = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updateData.updated_at = db.fn.now();

    await db('expenses').where({ id, organization_id: organizationId }).update(updateData);
    return await this.getById(id, organizationId);
  }

  async deleteExpense(id, organizationId) {
    await this.getById(id, organizationId);
    await db('expenses').where({ id, organization_id: organizationId }).delete();
    return { success: true, message: 'Expense deleted successfully' };
  }
}

module.exports = new ExpenseService();
