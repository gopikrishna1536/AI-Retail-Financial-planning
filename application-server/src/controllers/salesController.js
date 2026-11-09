const salesService = require('../services/salesService');
const { successResponse, paginatedResponse, errorResponse } = require('../utils/responseHandler');

class SalesController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);

      const { items, total } = await salesService.getAll(
        req.user.organization_id,
        req.query,
        { page, limit }
      );

      return paginatedResponse(res, items, total, page, limit, 'Sales transactions retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const sale = await salesService.getById(req.params.id, req.user.organization_id);
      return successResponse(res, sale, 'Sale transaction details retrieved');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new SalesController();
