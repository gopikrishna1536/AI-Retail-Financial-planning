const categoryService = require('../services/categoryService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll(req.user.organization_id);
      return successResponse(res, categories, 'Categories retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { category_name, sub_category_name } = req.body;
      if (!category_name || !sub_category_name) {
        return errorResponse(res, 'category_name and sub_category_name are required', 400);
      }
      const category = await categoryService.create(req.user.organization_id, req.body);
      return successResponse(res, category, 'Category created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const category = await categoryService.update(req.params.id, req.user.organization_id, req.body);
      return successResponse(res, category, 'Category updated successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const result = await categoryService.deleteCategory(req.params.id, req.user.organization_id);
      return successResponse(res, result, 'Category deleted successfully');
    } catch (err) {
      if (err.message.includes('not found')) return errorResponse(res, err.message, 404);
      next(err);
    }
  }
}

module.exports = new CategoryController();
