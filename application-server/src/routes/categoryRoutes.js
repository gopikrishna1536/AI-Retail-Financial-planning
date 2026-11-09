const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', categoryController.getAll);
router.post('/', requireRole('ADMIN', 'MANAGER'), categoryController.create);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), categoryController.update);
router.delete('/:id', requireRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
