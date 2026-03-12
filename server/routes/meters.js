const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// List meter IDs — Admin/Analyst
router.get('/', authorize('Admin', 'Analyst'), (req, res) => {
  const meterIds = Array.from({ length: 20 }, (_, i) => `MTR-${String(i + 1).padStart(4, '0')}`);
  res.json({ success: true, data: meterIds });
});

module.exports = router;
