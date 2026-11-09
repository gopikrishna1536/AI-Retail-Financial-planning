const organizationService = require('../services/organizationService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class OrganizationController {
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      if (id !== req.user.organization_id && req.user.role !== 'ADMIN') {
        return errorResponse(res, 'Access denied to organization', 403);
      }
      const org = await organizationService.getById(id);
      return successResponse(res, org, 'Organization details retrieved');
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      if (id !== req.user.organization_id && req.user.role !== 'ADMIN') {
        return errorResponse(res, 'Access denied to organization', 403);
      }
      const updated = await organizationService.update(id, req.body);
      return successResponse(res, updated, 'Organization updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrganizationController();
