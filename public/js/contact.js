import { checkRateLimit, recordAttempt, getRetryAfter } from './rate-limit.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mpmvsrestxuuebvtnsqi.supabase.co';
const CONTACT_ENDPOINT = `${SUPABASE_URL}/functions/v1/submit-contact`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbXZzcmVzdHh1dWVidnRuc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjMyNzYsImV4cCI6MjA5NTQ5OTI3Nn0.zD2b5km07O-6N-hetHuQjHh-fbzJ4Vq4XYSBVnfQyYI';
const WHATSAPP_NUMBER = '2348101181400';

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('contactSubmitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';

  // Rate limit: max 3 messages per 10 minutes
  if (!checkRateLimit('contact', 3, 10 * 60 * 1000)) {
    const secs = Math.ceil(getRetryAfter('contact', 3, 10 * 60 * 1000) / 1000);
    errorEl.style.display = 'flex';
    errorEl.textContent = `Please wait ${secs}s before sending another message.`;
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-send-plane-line"></i> Send Message';
    return;
  }

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}`, 'Apikey': ANON_KEY },
      body: JSON.stringify({ name, email, message })
    });
    if (!res.ok) throw new Error();
    recordAttempt('contact');
    successEl.style.display = 'flex';
    document.getElementById('contactForm').reset();

    const waText = `*New Contact Message — MAINLUX*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
  } catch {
    errorEl.style.display = 'flex';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-send-plane-line"></i> Send Message';
  }
});
