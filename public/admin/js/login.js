import { createClient } from '@supabase/supabase-js';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const { data: { session } } = await db.auth.getSession();
if (session) window.location.href = '/admin/dashboard.html';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Signing in...';
  errorEl.textContent = '';

  const { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = 'Invalid email or password. Please try again.';
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-shield-check-line"></i> Sign In';
    return;
  }

  window.location.href = '/admin/dashboard.html';
});
