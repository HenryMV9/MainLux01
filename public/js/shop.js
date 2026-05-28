import { db } from './supabase-client.js';

const grid = document.getElementById('productsGrid');
const category = grid ? grid.dataset.category : 'male';
const sizeFilter = document.getElementById('sizeFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const countEl = document.getElementById('productCount');

let allProducts = [];

function getStockLabel(stock) {
  if (stock <= 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
  if (stock <= 3) return { cls: 'low-stock', label: 'Low Stock' };
  return { cls: 'in-stock', label: 'In Stock' };
}

function renderSkeletons() {
  grid.innerHTML = Array(3).fill(`
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line btn"></div>
      </div>
    </div>
  `).join('');
}

function renderProducts(products) {
  if (!products.length) {
    grid.innerHTML = `<div class="empty-state"><i class="ri-search-line"></i><h3>No products found</h3><p>Try adjusting your filters.</p></div>`;
    if (countEl) countEl.textContent = '';
    return;
  }

  if (countEl) countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

  grid.innerHTML = products.map(p => {
    const img = (p.images && p.images.length) ? p.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
    const stock = getStockLabel(p.stock);
    const sizesText = p.sizes && p.sizes.length ? `Sizes: ${p.sizes.join(', ')}` : '';
    const disabled = p.stock <= 0 ? 'disabled' : '';
    return `
      <a href="./product.html?id=${p.id}" class="product-link">
        <div class="product-card fade-in" data-price="${p.price}" data-sizes="${JSON.stringify(p.sizes || []).replace(/"/g, '&quot;')}">
          <div class="product-image">
            <img src="${img}" alt="${p.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="stock ${stock.cls}">${stock.label}</span>
            <h3>${p.name}</h3>
            <p class="price">&#8358;${p.price.toLocaleString()}</p>
            <div class="sizes">${sizesText}</div>
            <button class="cart-btn" data-id="${p.id}" ${disabled}>
              <i class="ri-shopping-bag-line"></i>
              ${p.stock <= 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        </div>
      </a>`;
  }).join('');

  grid.querySelectorAll('.fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 80);
  });

  grid.querySelectorAll('.cart-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const product = allProducts.find(p => p.id === id);
      if (!product) return;
      const cart = JSON.parse(localStorage.getItem('mainluxCart') || '[]');
      const existing = cart.find(item => item.id === id);
      if (existing) { existing.quantity += 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, image: product.images && product.images.length ? product.images[0] : '', size: product.sizes && product.sizes.length ? product.sizes[0] : '', quantity: 1 }); }
      localStorage.setItem('mainluxCart', JSON.stringify(cart));
      window.updateCartBadge && window.updateCartBadge();
      window.showToast && window.showToast(`${product.name} added to cart`);
    });
  });
}

function applyFilters() {
  const size = sizeFilter ? sizeFilter.value : 'all';
  const price = priceFilter ? priceFilter.value : 'all';
  const sort = sortFilter ? sortFilter.value : 'default';
  let filtered = allProducts.filter(p => {
    const sizeMatch = size === 'all' || (p.sizes && p.sizes.includes(parseInt(size)));
    const priceMatch = price === 'all' || p.price <= parseInt(price);
    return sizeMatch && priceMatch;
  });
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  renderProducts(filtered);
}

async function loadProducts() {
  renderSkeletons();
  const { data, error } = await db.from('products').select('*').eq('category', category).eq('is_active', true).order('created_at', { ascending: false });
  if (error || !data) {
    grid.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><h3>Could not load products</h3><p>Please refresh the page.</p></div>';
    return;
  }
  allProducts = data;
  applyFilters();
}

if (sizeFilter) sizeFilter.addEventListener('change', applyFilters);
if (priceFilter) priceFilter.addEventListener('change', applyFilters);
if (sortFilter) sortFilter.addEventListener('change', applyFilters);

loadProducts();
