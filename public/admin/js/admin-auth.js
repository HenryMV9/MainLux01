// MAINLUX Admin Auth Guard
// Loaded first on every admin page. Redirects to login if not authenticated.

(async () => {
  // Skip auth check on the login page itself
  if (window.location.pathname.includes('login.html')) return;

  const initAdmin = async () => {
    const { createClient } = window.supabase;

    // Get config from server
    let config;
    try {
      const res = await fetch('/api/config');
      config = await res.json();
    } catch {
      window.location.href = '/admin/login.html';
      return;
    }

    const db = createClient(config.supabaseUrl, config.supabaseAnonKey);
    window.adminDb = db;

    const { data: { session } } = await db.auth.getSession();

    if (!session) {
      window.location.href = '/admin/login.html';
      return;
    }

    // Expose session and user globally
    window.adminSession = session;
    window.adminUser = session.user;

    // Update topbar email if exists
    const emailEl = document.getElementById('adminEmail');
    if (emailEl) emailEl.textContent = session.user.email;

    // Sign out handler
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        await db.auth.signOut();
        window.location.href = '/admin/login.html';
      });
    }

    // Signal ready
    document.dispatchEvent(new Event('admin:ready'));
  };

  // Wait for Supabase SDK to load
  if (window.supabase) {
    initAdmin();
  } else {
    document.addEventListener('DOMContentLoaded', initAdmin);
  }
})();
