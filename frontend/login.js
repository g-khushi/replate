let isLogin = true;

document.getElementById('toggleForm').addEventListener('click', () => {
  isLogin = !isLogin;

  document.getElementById('formTitle').innerText = isLogin ? 'Login' : 'Signup';
  document.querySelector('#authForm button').innerText = isLogin ? 'Login' : 'Signup';

  document.getElementById('togglePrompt').innerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  
  document.getElementById('toggleForm').innerText = isLogin
    ? "Switch to Signup"
    : "Switch to Login";

  document.getElementById('authStatus').innerText = '';
});

document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const endpoint = isLogin ? 'login' : 'signup';

  try {
    const res = await fetch(`http://localhost:5500/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        localStorage.setItem('userId', data.userId);
        window.location.href = 'afterlogin.html';
      } else {
        document.getElementById('authStatus').style.color = 'green';
        document.getElementById('authStatus').innerText = 'Signup successful. Please login.';
      }
    } else {
      document.getElementById('authStatus').style.color = 'red';
      document.getElementById('authStatus').innerText = data.message;
    }
  } catch (err) {
    document.getElementById('authStatus').innerText = "Server error. Please try again.";
    console.error(err);
  }
});
