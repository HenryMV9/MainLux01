import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
