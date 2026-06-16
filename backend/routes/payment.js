const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { 
  initiatePayment, 
  verifyPayment, 
  getPaymentHistory 
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/initiate', authMiddleware, initiatePayment);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;
