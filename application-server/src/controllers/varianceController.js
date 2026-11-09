const varianceService = require('../services/varianceService');
const { successResponse } = require('../utils/responseHandler');

class VarianceController {
  async getAll(req, res, next) {
    try {
      const data = await varianceService.getAllVariances(req.user.organization_id, req.query);
      return successResponse(res, data, 'Variances retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VarianceController();
