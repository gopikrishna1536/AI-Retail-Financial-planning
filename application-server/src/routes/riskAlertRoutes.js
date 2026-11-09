const express = require('express');
const router = express.Router();
const riskAlertController = require('../controllers/riskAlertController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', riskAlertController.getAll);
router.get('/notifications', riskAlertController.getNotifications);
router.get('/turnaround-report', riskAlertController.generateTurnaroundReport);
router.post('/turnaround-report', riskAlertController.generateTurnaroundReport);

module.exports = router;
