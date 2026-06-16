const db = require('../database');
const axios = require('axios');

// Initialize payment
const initiatePayment = (req, res) => {
  const { attemptId } = req.body;
  const userId = req.user.id;
  const amount = 4700;

  if (!attemptId) {
    return res.status(400).json({ error: 'Attempt ID is required' });
  }

  // Verify attempt belongs to user
  db.get(
    'SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?',
    [attemptId, userId],
    (err, attempt) => {
      if (err || !attempt) {
        return res.status(404).json({ error: 'Quiz attempt not found' });
      }

      if (attempt.payment_status === 'completed') {
        return res.status(400).json({ error: 'Payment already completed for this attempt' });
      }

      // Create payment record
      const referenceId = 'AMA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      db.run(
        'INSERT INTO payments (user_id, quiz_attempt_id, amount, status, reference_id) VALUES (?, ?, ?, ?, ?)',
        [userId, attemptId, amount, 'pending', referenceId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Payment initiation failed' });
          }

          // In production, integrate with actual Opay API
          // For now, return payment details
          res.json({
            success: true,
            paymentId: this.lastID,
            referenceId,
            amount,
            currency: 'NGN',
            message: 'Payment initiated. Please send 4700 NGN to AMA Account',
            opayAccount: {
              accountName: 'AMA SCHEME',
              accountNumber: '8000000000', // Placeholder - replace with actual
              bankName: 'Opay'
            },
            paymentDetails: {
              reference: referenceId,
              userId,
              attemptId,
              amount
            }
          });
        }
      );
    }
  );
};

// Verify payment (manual verification)
const verifyPayment = (req, res) => {
  const { referenceId } = req.body;
  const userId = req.user.id;

  db.get(
    'SELECT * FROM payments WHERE reference_id = ? AND user_id = ?',
    [referenceId, userId],
    (err, payment) => {
      if (err || !payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      if (payment.status === 'completed') {
        return res.status(400).json({ error: 'Payment already verified' });
      }

      // Update payment status
      db.run(
        'UPDATE payments SET status = ? WHERE id = ?',
        ['completed', payment.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Payment verification failed' });
          }

          // Update quiz attempt payment status
          db.run(
            'UPDATE quiz_attempts SET payment_status = ? WHERE id = ?',
            ['completed', payment.quiz_attempt_id]
          );

          res.json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
              referenceId,
              amount: payment.amount,
              status: 'completed'
            }
          });
        }
      );
    }
  );
};

// Get payment history
const getPaymentHistory = (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, payments) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch payment history' });
      }

      res.json({ payments });
    }
  );
};

module.exports = { initiatePayment, verifyPayment, getPaymentHistory };
