// Dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const user = getUser();
    if (user) {
      document.getElementById('userName').textContent = user.fullname;
    }

    const response = await apiCall('/dashboard/data', 'GET');
    
    // Update stats
    document.getElementById('totalAttempts').textContent = response.stats.total_attempts || 0;
    document.getElementById('totalWins').textContent = response.stats.wins || 0;
    document.getElementById('accountBalance').textContent = formatCurrency(response.stats.total_balance || 0);
    document.getElementById('averageScore').textContent = Math.round(response.stats.average_score || 0) + '%';

    // Load quiz history
    const historyResponse = await apiCall('/quiz/history', 'GET');
    displayQuizHistory(historyResponse.attempts);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

function displayQuizHistory(attempts) {
  const tableBody = document.querySelector('#recentAttempts tbody');
  
  if (!attempts || attempts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No attempts yet</td></tr>';
    return;
  }

  tableBody.innerHTML = attempts.slice(0, 5).map(attempt => `
    <tr>
      <td>${formatDate(attempt.attempted_at)}</td>
      <td>${attempt.score}%</td>
      <td>${attempt.status}</td>
      <td>${attempt.payment_status}</td>
    </tr>
  `).join('');
}
