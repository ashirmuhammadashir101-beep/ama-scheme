const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { 
  requestWithdrawal, 
  getWithdrawalHistory 
} = require('../controllers/withdrawalController');

const router = express.Router();

router.post('/request', authMiddleware, requestWithdrawal);
router.get('/history', authMiddleware, getWithdrawalHistory);

module.exports = router;
