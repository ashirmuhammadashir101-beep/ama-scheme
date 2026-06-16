// Authentication
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleRegister(e) {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    showMessage('errorMessage', 'Passwords do not match', 'error');
    return;
  }

  try {
    const response = await apiCall('/auth/register', 'POST', {
      fullname,
      email,
      phone,
      password
    });

    setToken(response.token);
    setUser(response.user);

    showMessage('successMessage', 'Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);
  } catch (error) {
    showMessage('errorMessage', error.message, 'error');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await apiCall('/auth/login', 'POST', {
      email,
      password
    });

    setToken(response.token);
    setUser(response.user);

    showMessage('successMessage', 'Login successful! Redirecting...', 'success');
    setTimeout(() => {
      if (response.user.isAdmin) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 2000);
  } catch (error) {
    showMessage('errorMessage', error.message, 'error');
  }
}
