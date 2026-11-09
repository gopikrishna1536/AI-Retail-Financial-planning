const expenseService = require('../services/expenseService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class ExpenseController {
  async getAll(req, res, next) {
    try {
      const expenses = await expenseService.getAll(req.user.organization_id, req.query);
      return successResponse(res, expenses, 'Expenses retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { expense_category, amount, expense_date } = req.body;
      if (!expense_category || amount === undefined || !expense_date) {
        return errorResponse(res, 'expense_category, amount, and expense_date are required', 400);
      }
      const expense = await expenseService.create(req.user.organization_id, req.body);
      return successResponse(res, expense, 'Expense created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const expense = await expenseService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, expense, 'Expense updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      const result = await expenseService.deleteExpense(req.params.id, req.user.organization_id);
      return successResponse(res, result, 'Expense deleted successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new ExpenseController();
