const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CONTACT_ENDPOINT = `${SUPABASE_URL}/functions/v1/submit-contact`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('contactSubmitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}`, 'Apikey': ANON_KEY },
      body: JSON.stringify({
        name: document.getElementById('cName').value.trim(),
        email: document.getElementById('cEmail').value.trim(),
        message: document.getElementById('cMessage').value.trim()
      })
    });
    if (!res.ok) throw new Error();
    successEl.style.display = 'flex';
    document.getElementById('contactForm').reset();
  } catch {
    errorEl.style.display = 'flex';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-send-plane-line"></i> Send Message';
  }
});
