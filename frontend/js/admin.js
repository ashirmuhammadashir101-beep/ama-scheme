// Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadAdminDashboard();
});

async function loadAdminDashboard() {
  try {
    const response = await apiCall('/admin/stats', 'GET');
    const stats = response.stats;

    document.getElementById('totalUsers').textContent = stats.total_users || 0;
    document.getElementById('totalAttempts').textContent = stats.total_attempts || 0;
    document.getElementById('totalRevenue').textContent = formatCurrency(stats.total_revenue || 0);
    document.getElementById('totalWinners').textContent = stats.total_winners || 0;
    document.getElementById('totalPayouts').textContent = formatCurrency(stats.total_winnings_paid || 0);

    // Count pending withdrawals
    const withdrawalsResponse = await apiCall('/admin/withdrawals', 'GET');
    const pendingWithdrawals = withdrawalsResponse.withdrawals.filter(w => w.status === 'pending').length;
    document.getElementById('pendingWithdrawals').textContent = pendingWithdrawals;
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
  }
}
