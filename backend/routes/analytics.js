const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAnalytics, getDailyAnalytics, getUserStats } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/overview', authMiddleware, adminMiddleware, getAnalytics);
router.get('/daily', authMiddleware, adminMiddleware, getDailyAnalytics);
router.get('/user', authMiddleware, getUserStats);

module.exports = router;
