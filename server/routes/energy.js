const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getReadings, getSummary, getTrend, getByRegion } = require('../controllers/energyController');

const router = express.Router();

// All energy routes require authentication
router.use(protect);

router.get('/readings', getReadings);
router.get('/summary', getSummary);
router.get('/trend', getTrend);
router.get('/by-region', authorize('Admin', 'Analyst'), getByRegion);

module.exports = router;
