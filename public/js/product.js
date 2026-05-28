import { db } from './supabase-client.js';

const productId = new URLSearchParams(window.location.search).get('id');
if (!productId) window.location.href = './index.html';

let count = 1;

function getStockLabel(stock) {
  if (stock <= 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
  if (stock <= 3) return { cls: 'low-stock', label: 'Low Stock' };
  return { cls: 'in-stock', label: 'In Stock' };
}

function renderProduct(p) {
  const stock = getStockLabel(p.stock);
  const images = p.images && p.images.length ? p.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop'];
  const collectionHref = p.category === 'male' ? './male.html' : './female.html';
  const collectionLabel = p.category === 'male' ? 'Male Collection' : 'Female Collection';

  document.title = `${p.name} | MAINLUX`;
  document.getElementById('breadcrumbCollection').textContent = collectionLabel;
  document.getElementById('breadcrumbCollection').href = collectionHref;
  document.getElementById('breadcrumbName').textContent = p.name;

  const gallerySection = document.getElementById('gallerySection');
  gallerySection.innerHTML = `
    <div class="main-image">
      <img id="mainProductImage" src="${images[0]}" alt="${p.name}">
    </div>
    <div class="thumbnail-grid">
      ${images.map((img, i) => `<img class="thumbnail ${i === 0 ? 'active-thumb' : ''}" src="${img}" alt="${p.name}" loading="lazy">`).join('')}
    </div>
  `;

  gallerySection.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.getElementById('mainProductImage').src = thumb.src;
      gallerySection.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active-thumb'));
      thumb.classList.add('active-thumb');
    });
  });

  document.getElementById('infoSection').innerHTML = `
    <span class="category-badge">${collectionLabel}</span>
    <h1>${p.name}</h1>
    <p class="product-price">&#8358;${p.price.toLocaleString()}</p>
    <span class="stock-badge ${stock.cls}">${stock.label}</span>
    <div class="divider"></div>
    <span class="option-label">Select Size</span>
    <div class="sizes">
      ${(p.sizes || []).map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}
    </div>
    <span class="option-label">Quantity</span>
    <div class="quantity-box">
      <button id="minusBtn">-</button>
      <span id="quantity">1</span>
      <button id="plusBtn">+</button>
    </div>
    <div class="product-buttons">
      <button class="add-cart-btn" id="addCartBtn" ${p.stock <= 0 ? 'disabled' : ''}>
        <i class="ri-shopping-bag-line"></i>
        Add To Cart
      </button>
      <a href="https://wa.me/2348101181400?text=Hi%20MAINLUX%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}%20-%20%E2%82%A6${p.price.toLocaleString()}" target="_blank" class="whatsapp-btn">
        <i class="ri-whatsapp-line"></i>
        Order On WhatsApp
      </a>
    </div>
    <div class="divider"></div>
    <div class="product-description">
      <h3>Description</h3>
      <p>${p.description || 'Premium luxury slide designed and made in Nigeria.'}</p>
    </div>
  `;

  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active-size'));
      btn.classList.add('active-size');
    });
  });

  document.getElementById('plusBtn').addEventListener('click', () => { count++; document.getElementById('quantity').textContent = count; });
  document.getElementById('minusBtn').addEventListener('click', () => { if (count > 1) { count--; document.getElementById('quantity').textContent = count; } });

  document.getElementById('addCartBtn').addEventListener('click', () => {
    const selectedSize = document.querySelector('.size-btn.active-size');
    if (!selectedSize && p.sizes && p.sizes.length > 0) {
      window.showToast && window.showToast('Please select a size', 'error');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('mainluxCart') || '[]');
    const existing = cart.find(item => item.id === p.id && item.size == (selectedSize ? selectedSize.dataset.size : ''));
    if (existing) { existing.quantity += count; }
    else { cart.push({ id: p.id, name: p.name, price: p.price, image: images[0], size: selectedSize ? selectedSize.dataset.size : '', quantity: count }); }
    localStorage.setItem('mainluxCart', JSON.stringify(cart));
    window.updateCartBadge && window.updateCartBadge();
    window.showToast && window.showToast(`${p.name} added to cart`);
  });
}

function renderRelated(products, currentId) {
  const related = products.filter(p => p.id !== currentId).slice(0, 3);
  if (!related.length) return;
  const section = document.getElementById('relatedSection');
  const grid = document.getElementById('relatedGrid');
  section.style.display = 'block';
  grid.innerHTML = related.map(p => {
    const img = p.images && p.images.length ? p.images[0] : '';
    const stock = getStockLabel(p.stock);
    return `
      <a href="./product.html?id=${p.id}" class="product-link">
        <div class="product-card">
          <div class="product-image"><img src="${img}" alt="${p.name}" loading="lazy"></div>
          <div class="product-info">
            <span class="stock ${stock.cls}">${stock.label}</span>
            <h3>${p.name}</h3>
            <p class="price">&#8358;${p.price.toLocaleString()}</p>
          </div>
        </div>
      </a>`;
  }).join('');
}

async function loadProduct() {
  const { data: product, error } = await db.from('products').select('*').eq('id', productId).eq('is_active', true).maybeSingle();
  if (error || !product) {
    document.getElementById('infoSection').innerHTML = '<p style="padding:40px 0;color:#888">Product not found.</p>';
    return;
  }
  renderProduct(product);
  const { data: related } = await db.from('products').select('*').eq('category', product.category).eq('is_active', true).neq('id', productId).limit(3);
  if (related && related.length) renderRelated(related, productId);
}

loadProduct();
