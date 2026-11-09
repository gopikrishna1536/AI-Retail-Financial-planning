const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', recommendationController.getAll);

module.exports = router;
