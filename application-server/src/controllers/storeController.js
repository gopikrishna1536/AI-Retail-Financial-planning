const storeService = require('../services/storeService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class StoreController {
  async getAll(req, res, next) {
    try {
      const stores = await storeService.getAll(req.user.organization_id, req.query);
      return successResponse(res, stores, 'Stores retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const store = await storeService.getById(req.params.id, req.user.organization_id);
      return successResponse(res, store, 'Store details retrieved');
    } catch (err) {
      if (err.message.includes('not found')) {
        return errorResponse(res, err.message, 404);
      }
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { store_code, state, postal_code, city_type, outlet_type, region } = req.body;
      if (!store_code || !state || !postal_code || !city_type || !outlet_type || !region) {
        return errorResponse(res, 'store_code, state, postal_code, city_type, outlet_type, and region are required', 400);
      }
      const store = await storeService.create(req.user.organization_id, req.body);
      return successResponse(res, store, 'Store created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const store = await storeService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, store, 'Store updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async deleteStore(req, res, next) {
    try {
      const result = await storeService.deleteStore(req.params.id, req.user.organization_id);
      return successResponse(res, result, 'Store deleted successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new StoreController();
