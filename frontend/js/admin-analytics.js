// Admin Analytics
document.addEventListener('DOMContentLoaded', () => {
  loadAdminAnalytics();
});

async function loadAdminAnalytics() {
  try {
    const response = await apiCall('/analytics/overview', 'GET');
    const stats = response.analytics;

    document.getElementById('totalUsers').textContent = stats.total_users || 0;
    document.getElementById('totalAttempts').textContent = stats.total_quiz_attempts || 0;
    document.getElementById('totalRevenue').textContent = formatCurrency(stats.total_revenue || 0);
    document.getElementById('totalWinners').textContent = stats.total_winners || 0;
    document.getElementById('completedPayments').textContent = stats.completed_payments || 0;
    document.getElementById('pendingPayments').textContent = stats.pending_payments || 0;

    // Load daily analytics
    const dailyResponse = await apiCall('/analytics/daily', 'GET');
    displayDailyAnalytics(dailyResponse.dailyAnalytics);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

function displayDailyAnalytics(data) {
  const tableBody = document.querySelector('#dailyTable tbody');
  
  if (!data || data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No data available</td></tr>';
    return;
  }

  tableBody.innerHTML = data.map(item => `
    <tr>
      <td>${formatDate(item.date)}</td>
      <td>${item.attempts}</td>
      <td>${item.winners}</td>
      <td>${formatCurrency(item.revenue || 0)}</td>
    </tr>
  `).join('');
}
