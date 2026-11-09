const { errorResponse } = require('../utils/responseHandler');

/**
 * Validates mandatory fields in request body
 * @param {string[]} requiredFields 
 */
function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }

    next();
  };
}

/**
 * Validates email format
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

module.exports = {
  validateBody,
  validateEmail
};
