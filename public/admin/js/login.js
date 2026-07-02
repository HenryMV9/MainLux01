import { adminDb } from './admin-auth.js';
import { checkRateLimit, recordAttempt, getRetryAfter } from '../../js/rate-limit.js';

// Redirect if already logged in
const { data: { session } } = await adminDb.auth.getSession();
if (session) window.location.href = '/admin/dashboard.html';

// 5 attempts per 15 minutes
const LIMIT = 5;
const WINDOW = 15 * 60 * 1000;
const RL_KEY = 'admin_login';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (!checkRateLimit(RL_KEY, LIMIT, WINDOW)) {
    const secs = Math.ceil(getRetryAfter(RL_KEY, LIMIT, WINDOW) / 1000);
    errorEl.textContent = `Too many attempts. Try again in ${secs}s.`;
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Signing in...';
  errorEl.textContent = '';

  recordAttempt(RL_KEY);
  const { error } = await adminDb.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = 'Invalid email or password. Please try again.';
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-shield-check-line"></i> Sign In to Admin';
    return;
  }

  window.location.href = '/admin/dashboard.html';
});
