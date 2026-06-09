import { createClient } from '@supabase/supabase-js';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://mpmvsrestxuuebvtnsqi.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbXZzcmVzdHh1dWVidnRuc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjMyNzYsImV4cCI6MjA5NTQ5OTI3Nn0.zD2b5km07O-6N-hetHuQjHh-fbzJ4Vq4XYSBVnfQyYI'
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
