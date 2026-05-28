import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mpmvsrestxuuebvtnsqi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbXZzcmVzdHh1dWVidnRuc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjMyNzYsImV4cCI6MjA5NTQ5OTI3Nn0.zD2b5km07O-6N-hetHuQjHh-fbzJ4Vq4XYSBVnfQyYI';

export const adminDb = createClient(supabaseUrl, supabaseAnonKey);

export async function initAdmin() {
  const { data: { session } } = await adminDb.auth.getSession();
  if (!session) { window.location.href = '/admin/login.html'; return; }

  const emailEl = document.getElementById('adminEmail');
  if (emailEl) emailEl.textContent = session.user.email;

  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await adminDb.auth.signOut();
      window.location.href = '/admin/login.html';
    });
  }
}
