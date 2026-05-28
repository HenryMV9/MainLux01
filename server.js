require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── SUPABASE ADMIN CLIENT (service key - server-side only) ─
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// ── PUBLIC CONFIG ENDPOINT ────────────────────────────────
// Delivers only the anon key (safe to expose) to the browser
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  });
});

// ── ORDERS API ────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    items,
    total_amount
  } = req.body;

  if (!customer_name || !customer_email || !customer_phone ||
      !shipping_address || !Array.isArray(items) || items.length === 0 ||
      !total_amount) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert([{ customer_name, customer_email, customer_phone, shipping_address, items, total_amount }])
    .select()
    .single();

  if (error) {
    console.error('Order insert error:', error);
    return res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }

  res.json({ success: true, order_id: data.id });
});

// ── CONTACT API ────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const { error } = await supabaseAdmin
    .from('contact_messages')
    .insert([{ name, email, message }]);

  if (error) {
    console.error('Contact insert error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }

  res.json({ success: true });
});

// ── START ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  MAINLUX server running → http://localhost:${PORT}\n`);
});
