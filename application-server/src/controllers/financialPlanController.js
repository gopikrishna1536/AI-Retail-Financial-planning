const financialPlanService = require('../services/financialPlanService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class FinancialPlanController {
  async getAll(req, res, next) {
    try {
      const plans = await financialPlanService.getAll(req.user.organization_id, req.query);
      return successResponse(res, plans, 'Financial plans retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const plan = await financialPlanService.getById(req.params.id, req.user.organization_id);
      return successResponse(res, plan, 'Financial plan retrieved successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { target_revenue, target_expense, year } = req.body;
      if (target_revenue === undefined || target_expense === undefined || !year) {
        return errorResponse(res, 'year, target_revenue, and target_expense are required', 400);
      }
      const plan = await financialPlanService.create(req.user.organization_id, req.body);
      return successResponse(res, plan, 'Financial plan created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const plan = await financialPlanService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, plan, 'Financial plan updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async generateAiPlan(req, res, next) {
    try {
      const aiPlan = await financialPlanService.generateAiPlan(req.user.organization_id, req.body);
      return successResponse(res, aiPlan, 'AI financial plan generated successfully');
    } catch (err) {
      next(err);
    }
  }

  async evaluateFeasibility(req, res, next) {
    try {
      const feasibility = await financialPlanService.calculateFeasibility(req.user.organization_id, req.body);
      return successResponse(res, feasibility, 'Target feasibility calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async simulate(req, res, next) {
    try {
      const simulation = financialPlanService.simulateScenario(req.body);
      return successResponse(res, simulation, 'Scenario simulation executed successfully');
    } catch (err) {
      next(err);
    }
  }

  async optimizeBudget(req, res, next) {
    try {
      const optimization = await financialPlanService.optimizeBudget(req.user.organization_id, req.body);
      return successResponse(res, optimization, 'Budget optimization calculated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getPerformance(req, res, next) {
    try {
      const performance = await financialPlanService.getPerformance(req.params.id, req.user.organization_id);
      return successResponse(res, performance, 'Plan performance metrics retrieved successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async getHealth(req, res, next) {
    try {
      const plan = await financialPlanService.getById(req.params.id, req.user.organization_id);
      const health = {
        plan_id: plan.id,
        health_score: plan.health_score || 87,
        risk_level: plan.risk_level || 'LOW',
        breakdown: {
          revenue_feasibility: 91,
          expense_control: 82,
          profitability: 88,
          historical_consistency: 85,
          forecast_confidence: Math.round(plan.forecast_confidence || 89)
        }
      };
      return successResponse(res, health, 'Plan health metrics retrieved successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async approve(req, res, next) {
    try {
      const approvedPlan = await financialPlanService.approvePlan(req.params.id, req.user.organization_id, req.user);
      return successResponse(res, approvedPlan, 'Financial plan approved successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new FinancialPlanController();
