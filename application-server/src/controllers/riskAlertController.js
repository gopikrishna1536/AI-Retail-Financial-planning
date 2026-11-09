const riskAlertService = require('../services/riskAlertService');
const { successResponse } = require('../utils/responseHandler');

class RiskAlertController {
  async getAll(req, res, next) {
    try {
      const data = await riskAlertService.getAllRiskAlerts(req.user.organization_id);
      return successResponse(res, data, 'Risk alerts retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const data = await riskAlertService.getExecutiveNotifications(req.user.organization_id);
      return successResponse(res, data, 'Executive risk notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async generateTurnaroundReport(req, res, next) {
    try {
      const data = await riskAlertService.generateTurnaroundReport(req.user.organization_id);
      return successResponse(res, data, 'Crisis Turnaround Report generated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RiskAlertController();
