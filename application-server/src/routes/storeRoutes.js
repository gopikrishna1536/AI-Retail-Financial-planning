const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', storeController.getAll);
router.get('/:id', storeController.getById);
router.post('/', requireRole('ADMIN', 'MANAGER'), storeController.create);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), storeController.update);
router.delete('/:id', requireRole('ADMIN'), storeController.deleteStore);

module.exports = router;
