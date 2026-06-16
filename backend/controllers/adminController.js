const db = require('../database');

const getAllWithdrawals = (req, res) => {
  db.all(
    'SELECT w.*, u.email, u.fullname, u.phone FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC',
    [],
    (err, withdrawals) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch withdrawals' });
      }

      res.json({ withdrawals });
    }
  );
};

const approveWithdrawal = (req, res) => {
  const { withdrawalId } = req.body;
  const adminId = req.user.id;

  db.run(
    'UPDATE withdrawals SET status = ?, approved_by = ?, withdrawal_date = CURRENT_TIMESTAMP WHERE id = ?',
    ['approved', adminId, withdrawalId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to approve withdrawal' });
      }

      res.json({ message: 'Withdrawal approved successfully' });
    }
  );
};

const rejectWithdrawal = (req, res) => {
  const { withdrawalId, notes } = req.body;

  db.run(
    'UPDATE withdrawals SET status = ?, notes = ? WHERE id = ?',
    ['rejected', notes || '', withdrawalId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to reject withdrawal' });
      }

      res.json({ message: 'Withdrawal rejected' });
    }
  );
};

const getSystemStats = (req, res) => {
  db.all(
    `SELECT 
      COUNT(DISTINCT u.id) as total_users,
      COUNT(qa.id) as total_attempts,
      SUM(CASE WHEN qa.payment_status = 'completed' THEN qa.amount_paid ELSE 0 END) as total_revenue,
      COUNT(CASE WHEN qa.correct_answers = 12 THEN 1 END) as total_winners,
      SUM(CASE WHEN qa.correct_answers = 12 THEN 2300000 ELSE 0 END) as total_winnings_paid
    FROM users u
    LEFT JOIN quiz_attempts qa ON u.id = qa.user_id`,
    [],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      res.json({ stats: stats[0] || {} });
    }
  );
};

const getAllUsers = (req, res) => {
  db.all(
    'SELECT id, email, phone, fullname, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      res.json({ users });
    }
  );
};

const createAdmin = (req, res) => {
  const { userId } = req.body;

  db.run(
    'INSERT INTO admins (user_id, permission_level) VALUES (?, ?)',
    [userId, 'admin'],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'User is already an admin' });
        }
        return res.status(500).json({ error: 'Failed to create admin' });
      }

      res.json({ message: 'Admin created successfully' });
    }
  );
};

module.exports = {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getSystemStats,
  getAllUsers,
  createAdmin
};
