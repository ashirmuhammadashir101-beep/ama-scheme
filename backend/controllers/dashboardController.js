const db = require('../database');

const getDashboardData = (req, res) => {
  const userId = req.user.id;

  // Get user info
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get quiz stats
    db.get(
      `SELECT 
        COUNT(id) as total_attempts,
        SUM(CASE WHEN correct_answers = 12 THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN correct_answers = 12 THEN 2300000 ELSE 0 END) as total_balance,
        AVG(score) as average_score
      FROM quiz_attempts WHERE user_id = ? AND payment_status = 'completed'`,
      [userId],
      (err, stats) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch stats' });
        }

        // Get pending withdrawals
        db.get(
          'SELECT SUM(amount) as pending_amount FROM withdrawals WHERE user_id = ? AND status = "pending"',
          [userId],
          (err, pendingWithdrawals) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to fetch pending withdrawals' });
            }

            res.json({
              user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone
              },
              stats: stats || {
                total_attempts: 0,
                wins: 0,
                total_balance: 0,
                average_score: 0
              },
              pendingWithdrawals: pendingWithdrawals.pending_amount || 0
            });
          }
        );
      }
    );
  });
};

module.exports = { getDashboardData };
