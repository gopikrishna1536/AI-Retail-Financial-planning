const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { enforceTenantIsolation } = require('../middleware/tenantMiddleware');

router.use(authenticateToken);
router.use(enforceTenantIsolation);

router.get('/', salesController.getAll);
router.get('/:id', salesController.getById);

module.exports = router;
