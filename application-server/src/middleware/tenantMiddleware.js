const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware to enforce tenant data isolation (organization_id check)
 */
function enforceTenantIsolation(req, res, next) {
  if (!req.user || !req.user.organization_id) {
    return errorResponse(res, 'Organization context missing in request token', 403);
  }

  // Set req.organizationId for downstream services
  req.organizationId = req.user.organization_id;

  // If request contains an explicit organizationId query parameter or route parameter, ensure match
  const paramOrgId = req.params.organizationId || req.query.organization_id;
  if (paramOrgId && paramOrgId !== req.user.organization_id && req.user.role !== 'ADMIN') {
    return errorResponse(res, 'Unauthorized access to separate organization resource', 403);
  }

  next();
}

module.exports = {
  enforceTenantIsolation
};
