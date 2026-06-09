// MAINLUX Cart JS

function getCart() {
  return JSON.parse(localStorage.getItem('mainluxCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('mainluxCart', JSON.stringify(cart));
  window.updateCartBadge && window.updateCartBadge();
}

function calcTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  const countEl = document.getElementById('cartItemCount');

  if (!cartItems) return;

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  if (countEl) countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="ri-shopping-bag-3-line"></i>
        <h2>Your cart is empty</h2>
        <p>Discover our luxury collection and add your first pair.</p>
        <a href="./male.html" class="btn-primary" style="display:inline-flex;gap:8px;align-items:center;text-decoration:none;padding:16px 36px;background:#0B0B0B;color:#fff;font-size:0.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase">Shop Now</a>
      </div>`;
    if (summary) summary.style.display = 'none';
    return;
  }

  if (summary) summary.style.display = 'block';

  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item" data-index="${i}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">Size: ${item.size || 'N/A'}</p>
        <div class="cart-item-qty">
          <button class="qty-minus" data-index="${i}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-plus" data-index="${i}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">&#8358;${(item.price * item.quantity).toLocaleString()}</span>
        <button class="remove-btn" data-index="${i}"><i class="ri-delete-bin-line"></i></button>
      </div>
    </div>
  `).join('');

  const total = calcTotal(cart);
  document.getElementById('subtotal').textContent = `\u20a6${total.toLocaleString()}`;
  document.getElementById('total').textContent = `\u20a6${total.toLocaleString()}`;

  // Events
  cartItems.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      cart[btn.dataset.index].quantity += 1;
      saveCart(cart);
      renderCart();
    });
  });

  cartItems.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx = parseInt(btn.dataset.index);
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
      } else {
        cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });
  });

  cartItems.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      cart.splice(parseInt(btn.dataset.index), 1);
      saveCart(cart);
      renderCart();
      window.showToast && window.showToast('Item removed from cart');
    });
  });
}

renderCart();
