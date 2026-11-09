const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware factory to enforce Role-Based Access Control (RBAC)
 * Roles: 'ADMIN', 'MANAGER', 'ANALYST', 'STAFF'
 * @param {...string} allowedRoles 
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'User authentication context missing', 401);
    }

    const userRole = req.user.role.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return errorResponse(
        res, 
        `Access denied. Required role: [${allowedRoles.join(', ')}], Current role: ${userRole}`, 
        403
      );
    }

    next();
  };
}

module.exports = {
  requireRole
};
