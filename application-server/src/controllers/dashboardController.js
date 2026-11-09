const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/responseHandler');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary(req.user.organization_id, req.query);
      return successResponse(res, summary, 'Dashboard financial summary calculated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();
