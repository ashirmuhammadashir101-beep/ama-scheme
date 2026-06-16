const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/data', authMiddleware, getDashboardData);

module.exports = router;
