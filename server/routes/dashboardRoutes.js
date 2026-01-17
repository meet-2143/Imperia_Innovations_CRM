const express = require('express');
const { getAdminStats, getEmployeeStats } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../utils/authMiddleware');

const router = express.Router();

router.get('/stats/admin', protect, adminOnly, getAdminStats);
router.get('/stats/employee', protect, getEmployeeStats);

module.exports = router;
