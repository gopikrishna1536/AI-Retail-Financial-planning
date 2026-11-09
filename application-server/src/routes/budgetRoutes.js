const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', budgetController.getAll);
router.post('/', requireRole('ADMIN', 'MANAGER'), budgetController.create);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), budgetController.update);
router.delete('/:id', requireRole('ADMIN'), budgetController.deleteBudget);

module.exports = router;
