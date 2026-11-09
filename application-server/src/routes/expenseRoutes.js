const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', expenseController.getAll);
router.post('/', requireRole('ADMIN', 'MANAGER', 'ANALYST'), expenseController.create);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), expenseController.update);
router.delete('/:id', requireRole('ADMIN'), expenseController.deleteExpense);

module.exports = router;
