// Admin Users Management
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', searchUsers);
  }
});

async function loadUsers() {
  try {
    const response = await apiCall('/admin/users', 'GET');
    allUsers = response.users;
    displayUsers(allUsers);
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

function displayUsers(users) {
  const tableBody = document.querySelector('#usersTable tbody');
  
  if (!users || users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
    return;
  }

  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.fullname}</td>
      <td>${user.phone}</td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <button onclick="makeAdmin(${user.id})" class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">Make Admin</button>
      </td>
    </tr>
  `).join('');
}

function searchUsers() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm) || 
    user.fullname.toLowerCase().includes(searchTerm)
  );
  displayUsers(filtered);
}

async function makeAdmin(userId) {
  if (!confirm('Are you sure you want to make this user an admin?')) {
    return;
  }

  try {
    await apiCall('/admin/create-admin', 'POST', {
      userId
    });
    alert('User is now an admin!');
    loadUsers();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
