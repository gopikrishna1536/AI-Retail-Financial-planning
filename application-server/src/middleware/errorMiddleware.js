const logger = require('../utils/logger');
const { errorResponse } = require('../utils/responseHandler');
const env = require('../config/env');

function errorHandler(err, req, res, next) {
  logger.error(err.message, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = env.nodeEnv === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'An unexpected error occurred';

  return errorResponse(res, message, statusCode);
}

function notFoundHandler(req, res) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

module.exports = {
  errorHandler,
  notFoundHandler
};
