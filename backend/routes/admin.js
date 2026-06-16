const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getSystemStats,
  getAllUsers,
  createAdmin
} = require('../controllers/adminController');

const router = express.Router();

router.get('/withdrawals', authMiddleware, adminMiddleware, getAllWithdrawals);
router.post('/withdrawals/approve', authMiddleware, adminMiddleware, approveWithdrawal);
router.post('/withdrawals/reject', authMiddleware, adminMiddleware, rejectWithdrawal);
router.get('/stats', authMiddleware, adminMiddleware, getSystemStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.post('/create-admin', authMiddleware, adminMiddleware, createAdmin);

module.exports = router;
