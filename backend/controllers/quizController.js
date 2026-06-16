const db = require('../database');

const startQuiz = (req, res) => {
  const userId = req.user.id;

  // Check if user has unpaid attempts
  db.get(
    'SELECT * FROM quiz_attempts WHERE user_id = ? AND payment_status = "pending" LIMIT 1',
    [userId],
    (err, pendingAttempt) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to start quiz' });
      }

      if (pendingAttempt) {
        return res.status(400).json({ 
          error: 'You have an unpaid quiz attempt. Please complete payment first.',
          attemptId: pendingAttempt.id
        });
      }

      // Get all questions
      db.all('SELECT * FROM questions', [], (err, questions) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to load questions' });
        }

        if (questions.length === 0) {
          return res.status(400).json({ error: 'No questions available' });
        }

        // Create new quiz attempt
        db.run(
          'INSERT INTO quiz_attempts (user_id, status, payment_status) VALUES (?, ?, ?)',
          [userId, 'in_progress', 'pending'],
          function (err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create attempt' });
            }

            // Return questions without answers
            const questionsForClient = questions.map(q => ({
              id: q.id,
              question_text: q.question_text,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c,
              option_d: q.option_d
            }));

            res.json({
              attemptId: this.lastID,
              questions: questionsForClient,
              totalQuestions: questions.length
            });
          }
        );
      });
    }
  );
};

const submitQuiz = (req, res) => {
  const { attemptId, answers } = req.body;
  const userId = req.user.id;

  if (!attemptId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid attempt or answers' });
  }

  // Verify attempt belongs to user
  db.get(
    'SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?',
    [attemptId, userId],
    (err, attempt) => {
      if (err || !attempt) {
        return res.status(404).json({ error: 'Quiz attempt not found' });
      }

      let correctCount = 0;
      let processedAnswers = 0;

      // Process each answer
      answers.forEach((answer, index) => {
        db.get(
          'SELECT correct_answer FROM questions WHERE id = ?',
          [answer.questionId],
          (err, question) => {
            if (!err && question) {
              const isCorrect = answer.answer.toUpperCase() === question.correct_answer.toUpperCase();
              if (isCorrect) correctCount++;

              db.run(
                'INSERT INTO quiz_answers (attempt_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
                [attemptId, answer.questionId, answer.answer, isCorrect ? 1 : 0]
              );
            }

            processedAnswers++;

            if (processedAnswers === answers.length) {
              // Update attempt with final score
              db.run(
                'UPDATE quiz_attempts SET correct_answers = ?, score = ?, status = ? WHERE id = ?',
                [correctCount, (correctCount / 12) * 100, 'completed', attemptId],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Failed to submit quiz' });
                  }

                  const won = correctCount === 12;
                  res.json({
                    message: 'Quiz submitted successfully',
                    attemptId,
                    correctAnswers: correctCount,
                    totalQuestions: 12,
                    score: (correctCount / 12) * 100,
                    won,
                    prize: won ? 2300000 : 0,
                    paymentRequired: true,
                    amount: 4700
                  });
                }
              );
            }
          }
        );
      });
    }
  );
};

const getQuizHistory = (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY attempted_at DESC',
    [userId],
    (err, attempts) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch quiz history' });
      }

      res.json({ attempts });
    }
  );
};

module.exports = { startQuiz, submitQuiz, getQuizHistory };
