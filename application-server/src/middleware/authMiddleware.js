const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware to authenticate requests via JWT Bearer token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Authentication token required', 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.user_id || decoded.id,
      organization_id: decoded.organization_id,
      role: decoded.role,
      email: decoded.email
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication token has expired', 401);
    }
    return errorResponse(res, 'Invalid authentication token', 403);
  }
}

module.exports = {
  authenticateToken
};
