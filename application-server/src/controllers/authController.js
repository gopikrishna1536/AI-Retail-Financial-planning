const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AuthController {
  async register(req, res, next) {
    try {
      const { organization_name, email, password, first_name, last_name, role } = req.body;
      if (!organization_name || !email || !password || !first_name || !last_name) {
        return errorResponse(res, 'organization_name, email, password, first_name, and last_name are required', 400);
      }

      const result = await authService.register({
        organization_name,
        email,
        password,
        first_name,
        last_name,
        role
      });

      return successResponse(res, result, 'User registered successfully', 201);
    } catch (err) {
      if (err.message.includes('already registered')) {
        return errorResponse(res, err.message, 409);
      }
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password, organization_id } = req.body;
      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      const result = await authService.login({ email, password, organization_id });
      return successResponse(res, result, 'Login successful');
    } catch (err) {
      return errorResponse(res, err.message, 401);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id, req.user.organization_id);
      return successResponse(res, user, 'User profile retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
