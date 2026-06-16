const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('frontend'));

// Database
const db = require('./database');

// Routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const paymentRoutes = require('./routes/payment');
const withdrawalRoutes = require('./routes/withdrawal');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/withdrawal', withdrawalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AMA Scheme API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`AMA Scheme server running on http://localhost:${PORT}`);
});

module.exports = app;
