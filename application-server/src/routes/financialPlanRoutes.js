const express = require('express');
const router = express.Router();
const financialPlanController = require('../controllers/financialPlanController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', financialPlanController.getAll);
router.post('/', requireRole('ADMIN', 'MANAGER'), financialPlanController.create);

// AI & Optimization Endpoints
router.post('/ai-generate', requireRole('ADMIN', 'MANAGER'), financialPlanController.generateAiPlan);
router.post('/feasibility', financialPlanController.evaluateFeasibility);
router.post('/simulate', financialPlanController.simulate);
router.post('/optimize-budget', financialPlanController.optimizeBudget);

// Plan specific endpoints
router.get('/:id', financialPlanController.getById);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), financialPlanController.update);
router.get('/:id/performance', financialPlanController.getPerformance);
router.get('/:id/health', financialPlanController.getHealth);
router.put('/:id/approve', requireRole('ADMIN', 'MANAGER'), financialPlanController.approve);

module.exports = router;
