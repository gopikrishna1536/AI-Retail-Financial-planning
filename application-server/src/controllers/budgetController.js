const budgetService = require('../services/budgetService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class BudgetController {
  async getAll(req, res, next) {
    try {
      const budgets = await budgetService.getAll(req.user.organization_id, req.query);
      return successResponse(res, budgets, 'Budgets retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { financial_plan_id, expense_category, allocated_amount } = req.body;
      if (!financial_plan_id || !expense_category || allocated_amount === undefined) {
        return errorResponse(res, 'financial_plan_id, expense_category, and allocated_amount are required', 400);
      }
      const budget = await budgetService.create(req.user.organization_id, req.body);
      return successResponse(res, budget, 'Budget record created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const budget = await budgetService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, budget, 'Budget record updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async deleteBudget(req, res, next) {
    try {
      const result = await budgetService.deleteBudget(req.params.id, req.user.organization_id);
      return successResponse(res, result, 'Budget record deleted successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new BudgetController();
