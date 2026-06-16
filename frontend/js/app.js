// API Base URL
const API_URL = 'http://localhost:3000/api';

// Utility Functions
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
  localStorage.removeItem('user');
}

function isAuthenticated() {
  return !!getToken();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-NG', options);
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API Error');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Logout function
function logout() {
  removeToken();
  removeUser();
  window.location.href = 'index.html';
}

// Setup logout buttons
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtns = document.querySelectorAll('#logoutBtn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Check authentication on protected pages
  const currentPage = window.location.pathname;
  const protectedPages = ['dashboard.html', 'quiz.html', 'withdrawal.html', 'analytics.html', 'admin.html', 'admin-withdrawals.html', 'admin-analytics.html', 'admin-users.html'];
  
  if (protectedPages.some(page => currentPage.includes(page)) && !isAuthenticated()) {
    window.location.href = 'pages/login.html';
  }
});

// Show message
function showMessage(elementId, message, type = 'success') {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

// Format numbers
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
