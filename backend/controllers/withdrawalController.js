const db = require('../database');

const requestWithdrawal = (req, res) => {
  const { amount, bankAccount, accountNumber, accountName } = req.body;
  const userId = req.user.id;

  if (!amount || !bankAccount || !accountNumber || !accountName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check user's winnings
  db.get(
    'SELECT SUM(CASE WHEN correct_answers = 12 THEN 2300000 ELSE 0 END) as total_winnings FROM quiz_attempts WHERE user_id = ? AND payment_status = "completed"',
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to check winnings' });
      }

      const totalWinnings = result.total_winnings || 0;

      if (amount > totalWinnings) {
        return res.status(400).json({ 
          error: 'Insufficient balance',
          available: totalWinnings
        });
      }

      // Create withdrawal request
      db.run(
        'INSERT INTO withdrawals (user_id, amount, bank_account, account_number, account_name, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, amount, bankAccount, accountNumber, accountName, 'pending'],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create withdrawal request' });
          }

          res.json({
            message: 'Withdrawal request submitted',
            withdrawalId: this.lastID,
            amount,
            status: 'pending'
          });
        }
      );
    }
  );
};

const getWithdrawalHistory = (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, withdrawals) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch withdrawal history' });
      }

      res.json({ withdrawals });
    }
  );
};

module.exports = { requestWithdrawal, getWithdrawalHistory };
