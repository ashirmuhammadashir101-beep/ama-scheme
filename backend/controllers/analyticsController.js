const db = require('../database');

const getAnalytics = (req, res) => {
  db.all(
    `SELECT 
      COUNT(DISTINCT u.id) as total_users,
      COUNT(qa.id) as total_quiz_attempts,
      SUM(CASE WHEN qa.payment_status = 'completed' THEN qa.amount_paid ELSE 0 END) as total_revenue,
      COUNT(CASE WHEN qa.correct_answers = 12 THEN 1 END) as total_winners,
      SUM(CASE WHEN qa.correct_answers = 12 THEN 2300000 ELSE 0 END) as total_payouts,
      COUNT(CASE WHEN qa.payment_status = 'completed' THEN 1 END) as completed_payments,
      COUNT(CASE WHEN qa.payment_status = 'pending' THEN 1 END) as pending_payments
    FROM users u
    LEFT JOIN quiz_attempts qa ON u.id = qa.user_id`,
    [],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch analytics' });
      }

      res.json({ analytics: stats[0] || {} });
    }
  );
};

const getDailyAnalytics = (req, res) => {
  db.all(
    `SELECT 
      DATE(attempted_at) as date,
      COUNT(id) as attempts,
      COUNT(CASE WHEN correct_answers = 12 THEN 1 END) as winners,
      SUM(amount_paid) as revenue
    FROM quiz_attempts
    WHERE payment_status = 'completed'
    GROUP BY DATE(attempted_at)
    ORDER BY date DESC
    LIMIT 30`,
    [],
    (err, dailyData) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch daily analytics' });
      }

      res.json({ dailyAnalytics: dailyData });
    }
  );
};

const getUserStats = (req, res) => {
  const userId = req.user.id;

  db.get(
    `SELECT 
      COUNT(id) as total_attempts,
      COUNT(CASE WHEN correct_answers = 12 THEN 1 END) as wins,
      SUM(CASE WHEN correct_answers = 12 THEN 2300000 ELSE 0 END) as total_winnings,
      SUM(CASE WHEN correct_answers >= 6 THEN correct_answers ELSE 0 END) as total_correct_answers,
      AVG(score) as average_score
    FROM quiz_attempts
    WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch user stats' });
      }

      res.json({ userStats: stats || {} });
    }
  );
};

module.exports = { getAnalytics, getDailyAnalytics, getUserStats };
