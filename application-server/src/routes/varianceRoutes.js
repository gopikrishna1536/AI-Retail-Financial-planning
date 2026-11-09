const express = require('express');
const router = express.Router();
const varianceController = require('../controllers/varianceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', varianceController.getAll);

module.exports = router;
