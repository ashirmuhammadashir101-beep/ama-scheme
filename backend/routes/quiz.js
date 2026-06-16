const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { startQuiz, submitQuiz, getQuizHistory } = require('../controllers/quizController');

const router = express.Router();

router.post('/start', authMiddleware, startQuiz);
router.post('/submit', authMiddleware, submitQuiz);
router.get('/history', authMiddleware, getQuizHistory);

module.exports = router;
