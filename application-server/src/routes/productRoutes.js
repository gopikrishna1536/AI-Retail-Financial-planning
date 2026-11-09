const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', requireRole('ADMIN', 'MANAGER'), productController.create);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), productController.update);
router.delete('/:id', requireRole('ADMIN'), productController.deleteProduct);

module.exports = router;
