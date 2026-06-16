// Withdrawal
document.addEventListener('DOMContentLoaded', () => {
  loadWithdrawalData();

  const withdrawalForm = document.getElementById('withdrawalForm');
  if (withdrawalForm) {
    withdrawalForm.addEventListener('submit', handleWithdrawalRequest);
  }
});

async function loadWithdrawalData() {
  try {
    const dashboardResponse = await apiCall('/dashboard/data', 'GET');
    const balance = dashboardResponse.stats.total_balance || 0;
    document.getElementById('availableBalance').textContent = `Available Balance: ${formatCurrency(balance)}`;

    // Load withdrawal history
    const historyResponse = await apiCall('/withdrawal/history', 'GET');
    displayWithdrawalHistory(historyResponse.withdrawals);
  } catch (error) {
    console.error('Failed to load withdrawal data:', error);
  }
}

async function handleWithdrawalRequest(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('withdrawalAmount').value);
  const bankName = document.getElementById('bankName').value;
  const accountNumber = document.getElementById('accountNumber').value;
  const accountName = document.getElementById('accountName').value;

  if (amount <= 0) {
    showMessage('withdrawalMessage', 'Amount must be greater than 0', 'error');
    return;
  }

  try {
    const response = await apiCall('/withdrawal/request', 'POST', {
      amount,
      bankAccount: bankName,
      accountNumber,
      accountName
    });

    showMessage('withdrawalMessage', 'Withdrawal request submitted successfully!', 'success');
    
    document.getElementById('withdrawalForm').reset();
    setTimeout(() => {
      loadWithdrawalData();
    }, 1000);
  } catch (error) {
    showMessage('withdrawalMessage', error.message, 'error');
  }
}

function displayWithdrawalHistory(withdrawals) {
  const tableBody = document.querySelector('#withdrawalTable tbody');
  
  if (!withdrawals || withdrawals.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No withdrawals yet</td></tr>';
    return;
  }

  tableBody.innerHTML = withdrawals.map(withdrawal => `
    <tr>
      <td>${formatDate(withdrawal.created_at)}</td>
      <td>${formatCurrency(withdrawal.amount)}</td>
      <td>${withdrawal.bank_account}</td>
      <td><span class="badge badge-${withdrawal.status}">${withdrawal.status.toUpperCase()}</span></td>
    </tr>
  `).join('');
}
