// MAINLUX Checkout JS — Saves orders via Express API

function getCart() {
  return JSON.parse(localStorage.getItem('mainluxCart') || '[]');
}

function renderOrderSummary() {
  const cart = getCart();
  const itemsEl = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');

  if (!cart.length) {
    window.location.href = './cart.html';
    return;
  }

  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);

  itemsEl.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="checkout-item-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.size || 'N/A'} &nbsp;|&nbsp; Qty: ${item.quantity}</p>
      </div>
      <span class="checkout-item-price">&#8358;${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');

  subtotalEl.textContent = `\u20a6${total.toLocaleString()}`;
  totalEl.textContent = `\u20a6${total.toLocaleString()}`;
}

function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.toggle('error', !!message);
  if (error) error.textContent = message || '';
}

function clearErrors() {
  ['fullName', 'email', 'phone', 'address'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['nameError', 'emailError', 'phoneError', 'addressError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const cart = getCart();

  let valid = true;

  if (!name) { setError('fullName', 'nameError', 'Full name is required'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'emailError', 'Valid email is required'); valid = false;
  }
  if (!phone) { setError('phone', 'phoneError', 'Phone number is required'); valid = false; }
  if (!address) { setError('address', 'addressError', 'Delivery address is required'); valid = false; }
  if (!cart.length) { window.location.href = './cart.html'; return; }

  if (!valid) return;

  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = true;
  payBtn.classList.add('loading');
  payBtn.innerHTML = '<i class="ri-loader-4-line"></i> Placing Order...';

  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        items: cart,
        total_amount: total
      })
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || 'Order failed');

    localStorage.removeItem('mainluxCart');
    window.location.href = `./order-success.html?order=${result.order_id}`;

  } catch (err) {
    payBtn.disabled = false;
    payBtn.classList.remove('loading');
    payBtn.innerHTML = '<i class="ri-lock-line"></i> Place Order';
    window.showToast && window.showToast(err.message || 'Failed to place order. Please try again.', 'error');
  }
});

renderOrderSummary();
