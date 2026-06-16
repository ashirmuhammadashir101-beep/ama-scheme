// Analytics
document.addEventListener('DOMContentLoaded', () => {
  loadUserAnalytics();
});

async function loadUserAnalytics() {
  try {
    const response = await apiCall('/analytics/user', 'GET');
    const stats = response.userStats;

    document.getElementById('totalAttempts').textContent = stats.total_attempts || 0;
    document.getElementById('totalWins').textContent = stats.wins || 0;
    document.getElementById('totalWinnings').textContent = formatCurrency(stats.total_winnings || 0);
    document.getElementById('averageScore').textContent = Math.round(stats.average_score || 0) + '%';

    // Load performance history
    const historyResponse = await apiCall('/quiz/history', 'GET');
    displayPerformanceTable(historyResponse.attempts);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

function displayPerformanceTable(attempts) {
  const tableBody = document.querySelector('#performanceTable tbody');
  
  if (!attempts || attempts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No quiz attempts yet</td></tr>';
    return;
  }

  tableBody.innerHTML = attempts.map(attempt => `
    <tr>
      <td>${formatDate(attempt.attempted_at)}</td>
      <td>${attempt.correct_answers}/12</td>
      <td>${Math.round(attempt.score)}%</td>
      <td>${attempt.status === 'completed' ? '✓' : '✗'}</td>
    </tr>
  `).join('');
}
