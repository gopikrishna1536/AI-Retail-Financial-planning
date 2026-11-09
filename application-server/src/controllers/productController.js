const productService = require('../services/productService');
const { successResponse, paginatedResponse, errorResponse } = require('../utils/responseHandler');

class ProductController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

      const { items, total } = await productService.getAll(
        req.user.organization_id,
        req.query,
        { page, limit }
      );

      return paginatedResponse(res, items, total, page, limit, 'Products retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id, req.user.organization_id);
      return successResponse(res, product, 'Product details retrieved');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { category_id, product_code, product_name } = req.body;
      if (!category_id || !product_code || !product_name) {
        return errorResponse(res, 'category_id, product_code, and product_name are required', 400);
      }
      const product = await productService.create(req.user.organization_id, req.body);
      return successResponse(res, product, 'Product created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, product, 'Product updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id, req.user.organization_id);
      return successResponse(res, result, 'Product deleted successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new ProductController();
