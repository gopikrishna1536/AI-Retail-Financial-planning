/**
 * Standardized API Response Handler
 */

function successResponse(res, data = null, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function errorResponse(res, message = 'Internal server error', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

function paginatedResponse(res, items, total, page, limit, message = 'Data retrieved successfully') {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
