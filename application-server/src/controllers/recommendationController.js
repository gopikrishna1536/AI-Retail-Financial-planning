const recommendationService = require('../services/recommendationService');
const { successResponse } = require('../utils/responseHandler');

class RecommendationController {
  async getAll(req, res, next) {
    try {
      const data = await recommendationService.getAllRecommendations(req.user.organization_id);
      return successResponse(res, data, 'Recommendations retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RecommendationController();
