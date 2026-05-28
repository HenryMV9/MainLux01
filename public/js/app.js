// MAINLUX Homepage JS — Hero slider + Dynamic new arrivals

// ── HERO SLIDER ───────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let current = 0;
let autoSlide;

function goToSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function nextSlide() { goToSlide(current + 1); }

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    startAutoSlide();
  });
});

startAutoSlide();

// ── NEW ARRIVALS (featured products from Supabase) ────────
function getStockLabel(stock) {
  if (stock <= 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
  if (stock <= 3) return { cls: 'low-stock', label: 'Low Stock' };
  return { cls: 'in-stock', label: 'In Stock' };
}

document.addEventListener('db:ready', async () => {
  const { data, error } = await window.db
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(3);

  const grid = document.getElementById('newArrivals');
  if (!grid) return;

  if (error || !data || !data.length) {
    // Fallback to any products
    const { data: fallback } = await window.db
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(3);
    renderArrivals(grid, fallback || []);
    return;
  }

  renderArrivals(grid, data);
});

function renderArrivals(grid, products) {
  if (!products.length) {
    grid.innerHTML = '<p style="text-align:center;color:#888;padding:40px">No products available.</p>';
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const img = p.images && p.images.length ? p.images[0] : '';
    const stock = getStockLabel(p.stock);
    return `
      <a href="./product.html?id=${p.id}" class="product-link">
        <div class="product-card fade-in" style="transition-delay:${i * 0.1}s">
          <div class="product-image">
            <img src="${img}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="stock ${stock.cls}">${stock.label}</span>
            <h3>${p.name}</h3>
            <p class="price">&#8358;${p.price.toLocaleString()}</p>
            <div class="sizes">Sizes: ${(p.sizes || []).join(', ')}</div>
            <button class="cart-btn" onclick="quickAdd(event,'${p.id}')">
              <i class="ri-shopping-bag-line"></i>
              Quick Add
            </button>
          </div>
        </div>
      </a>`;
  }).join('');

  // Trigger fade-in
  setTimeout(() => {
    grid.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }, 100);
}

function quickAdd(e, productId) {
  e.preventDefault();
  e.stopPropagation();
  // Re-fetch from rendered DOM since we don't cache products here
  fetch(`/api/config`)
    .then(r => r.json())
    .then(async config => {
      const { createClient } = window.supabase;
      const db = createClient(config.supabaseUrl, config.supabaseAnonKey);
      const { data: p } = await db.from('products').select('*').eq('id', productId).maybeSingle();
      if (!p) return;
      const cart = JSON.parse(localStorage.getItem('mainluxCart') || '[]');
      const existing = cart.find(item => item.id === p.id);
      if (existing) { existing.quantity += 1; }
      else {
        cart.push({ id: p.id, name: p.name, price: p.price, image: (p.images || [])[0] || '', size: (p.sizes || [])[0] || '', quantity: 1 });
      }
      localStorage.setItem('mainluxCart', JSON.stringify(cart));
      window.updateCartBadge && window.updateCartBadge();
      window.showToast && window.showToast(`${p.name} added to cart`);
    });
}
window.quickAdd = quickAdd;
