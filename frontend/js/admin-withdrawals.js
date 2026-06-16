// Admin Withdrawals Management
let allWithdrawals = [];
let currentAction = null;
let currentWithdrawalId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadWithdrawals();

  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterWithdrawals);
  }

  const actionForm = document.getElementById('actionForm');
  if (actionForm) {
    actionForm.addEventListener('submit', submitAction);
  }

  const closeButtons = document.querySelectorAll('.close, .modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('actionModal');
    if (e.target === modal) {
      closeModal();
    }
  });
});

async function loadWithdrawals() {
  try {
    const response = await apiCall('/admin/withdrawals', 'GET');
    allWithdrawals = response.withdrawals;
    displayWithdrawals(allWithdrawals);
  } catch (error) {
    console.error('Failed to load withdrawals:', error);
  }
}

function displayWithdrawals(withdrawals) {
  const tableBody = document.querySelector('#withdrawalsTable tbody');
  
  if (!withdrawals || withdrawals.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center">No withdrawals found</td></tr>';
    return;
  }

  tableBody.innerHTML = withdrawals.map(w => `
    <tr>
      <td>${w.fullname}</td>
      <td>${w.email}</td>
      <td>${w.phone}</td>
      <td>${formatCurrency(w.amount)}</td>
      <td>${w.bank_account}</td>
      <td>${w.account_number}</td>
      <td>${w.status}</td>
      <td>${formatDate(w.created_at)}</td>
      <td>
        ${w.status === 'pending' ? `
          <button onclick="openModal('approve', ${w.id})" class="btn btn-success" style="padding: 5px 10px; font-size: 12px;">Approve</button>
          <button onclick="openModal('reject', ${w.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Reject</button>
        ` : `<span class="badge">${w.status}</span>`}
      </td>
    </tr>
  `).join('');
}

function filterWithdrawals() {
  const status = document.getElementById('statusFilter').value;
  const filtered = status ? allWithdrawals.filter(w => w.status === status) : allWithdrawals;
  displayWithdrawals(filtered);
}

function openModal(action, withdrawalId) {
  currentAction = action;
  currentWithdrawalId = withdrawalId;
  
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const notesField = document.getElementById('notes');
  
  if (action === 'approve') {
    modalTitle.textContent = 'Approve Withdrawal';
    notesField.parentElement.style.display = 'none';
  } else {
    modalTitle.textContent = 'Reject Withdrawal';
    notesField.parentElement.style.display = 'block';
    notesField.value = '';
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('actionModal').style.display = 'none';
  currentAction = null;
  currentWithdrawalId = null;
}

async function submitAction(e) {
  e.preventDefault();

  try {
    if (currentAction === 'approve') {
      await apiCall('/admin/withdrawals/approve', 'POST', {
        withdrawalId: currentWithdrawalId
      });
      alert('Withdrawal approved successfully!');
    } else {
      const notes = document.getElementById('notes').value;
      await apiCall('/admin/withdrawals/reject', 'POST', {
        withdrawalId: currentWithdrawalId,
        notes
      });
      alert('Withdrawal rejected!');
    }

    closeModal();
    loadWithdrawals();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
