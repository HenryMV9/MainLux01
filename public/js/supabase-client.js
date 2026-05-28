// MAINLUX Supabase Client
// Initializes a singleton Supabase client using config from the server

(async () => {
  try {
    const res = await fetch('/api/config');
    const { supabaseUrl, supabaseAnonKey } = await res.json();
    const { createClient } = window.supabase;
    window.db = createClient(supabaseUrl, supabaseAnonKey);
    document.dispatchEvent(new Event('db:ready'));
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
})();
