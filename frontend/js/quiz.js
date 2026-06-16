// Quiz
let currentAttemptId = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};

document.addEventListener('DOMContentLoaded', () => {
  const verifyPaymentBtn = document.getElementById('verifyPaymentBtn');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');

  if (verifyPaymentBtn) {
    verifyPaymentBtn.addEventListener('click', verifyPayment);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextQuestion);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', previousQuestion);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', submitQuiz);
  }

  generatePaymentReference();
});

function generatePaymentReference() {
  const ref = 'AMA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  document.getElementById('generatedRef').textContent = `Reference: ${ref}`;
  document.getElementById('paymentRef').value = ref;
}

async function verifyPayment() {
  const paymentRef = document.getElementById('paymentRef').value;

  if (!paymentRef) {
    showMessage('paymentMessage', 'Please enter payment reference', 'error');
    return;
  }

  try {
    const response = await apiCall('/payment/verify', 'POST', {
      referenceId: paymentRef
    });

    showMessage('paymentMessage', 'Payment verified! Starting quiz...', 'success');
    
    setTimeout(() => {
      startQuiz();
    }, 2000);
  } catch (error) {
    showMessage('paymentMessage', 'Payment verification failed: ' + error.message, 'error');
  }
}

async function startQuiz() {
  try {
    // First initiate payment to get attempt ID
    const paymentRef = document.getElementById('paymentRef').value;
    
    // Then start quiz
    const response = await apiCall('/quiz/start', 'POST', {});
    
    currentAttemptId = response.attemptId;
    currentQuestions = response.questions;
    currentQuestionIndex = 0;
    userAnswers = {};

    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    document.getElementById('totalQuestions').textContent = response.totalQuestions;

    displayQuestion();
  } catch (error) {
    showMessage('paymentMessage', 'Failed to start quiz: ' + error.message, 'error');
  }
}

function displayQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  
  document.getElementById('questionText').textContent = question.question_text;
  document.getElementById('optionA').textContent = question.option_a;
  document.getElementById('optionB').textContent = question.option_b;
  document.getElementById('optionC').textContent = question.option_c;
  document.getElementById('optionD').textContent = question.option_d;
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;

  // Clear radio buttons
  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.checked = false;
  });

  // Set previous answer if exists
  if (userAnswers[question.id]) {
    document.querySelector(`input[value="${userAnswers[question.id]}"]`).checked = true;
  }

  updateProgressBar();
  updateButtonVisibility();
}

function updateProgressBar() {
  const percentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
  document.getElementById('progressFill').style.width = percentage + '%';
}

function updateButtonVisibility() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
  nextBtn.style.display = currentQuestionIndex < currentQuestions.length - 1 ? 'block' : 'none';
  submitBtn.style.display = currentQuestionIndex === currentQuestions.length - 1 ? 'block' : 'none';
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    showMessage('paymentMessage', 'Please select an answer', 'error');
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  userAnswers[question.id] = selectedAnswer.value;

  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  }
}

function previousQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    const question = currentQuestions[currentQuestionIndex];
    userAnswers[question.id] = selectedAnswer.value;
  }

  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

async function submitQuiz() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    showMessage('paymentMessage', 'Please select an answer', 'error');
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  userAnswers[question.id] = selectedAnswer.value;

  const answers = currentQuestions.map(q => ({
    questionId: q.id,
    answer: userAnswers[q.id]
  }));

  try {
    const response = await apiCall('/quiz/submit', 'POST', {
      attemptId: currentAttemptId,
      answers
    });

    showResults(response);
  } catch (error) {
    showMessage('paymentMessage', 'Failed to submit quiz: ' + error.message, 'error');
  }
}

function showResults(response) {
  document.getElementById('quizSection').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';

  document.getElementById('correctCount').textContent = response.correctAnswers;
  document.getElementById('scorePercentage').textContent = Math.round(response.score);

  if (response.won) {
    document.getElementById('resultMessage').textContent = '🎉 Congratulations! You won!';
    document.getElementById('prizeInfo').style.display = 'block';
  } else {
    document.getElementById('resultMessage').textContent = 'Keep trying! You\'ll win next time.';
  }
}
