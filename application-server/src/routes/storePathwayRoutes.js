const express = require('express');
const router = express.Router();
const storePathwayController = require('../controllers/storePathwayController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All store pathway routes require authentication
router.use(authenticateToken);

router.get('/', storePathwayController.getAllPathways);
router.get('/cluster', storePathwayController.getClusterAnalysis);
router.post('/simulate', storePathwayController.simulatePathway);
router.get('/:id', storePathwayController.getStorePathway);

module.exports = router;
