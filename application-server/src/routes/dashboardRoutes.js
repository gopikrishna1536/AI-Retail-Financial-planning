const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/summary', dashboardController.getSummary);

module.exports = router;
