const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/:id', organizationController.getById);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), organizationController.update);

module.exports = router;
