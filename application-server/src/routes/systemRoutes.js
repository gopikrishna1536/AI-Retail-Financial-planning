const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/health', systemController.getHealth);
router.get('/system/ml-status', authenticateToken, systemController.getMlStatus);

module.exports = router;
