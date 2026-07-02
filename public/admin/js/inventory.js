import { adminDb, initAdmin } from './admin-auth.js';
import { initMobileMenu, showToast } from './admin-ui.js';

await initAdmin();
initMobileMenu();

let allProducts = [];

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const { data, error } = await adminDb.from('products').select('id, name, category, stock, images, is_active').order('stock', { ascending: true });

if (error) {
  document.getElementById('inventoryBody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:#bbb;padding:44px">Failed to load inventory</td></tr>';
} else {
  allProducts = data || [];
  applyFilters();
}

function stockClass(stock) {
  if (stock <= 0) return 'zero';
  if (stock <= 3) return 'low';
  return 'ok';
}

function stockLabel(stock) {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= 3) return `Low (${stock})`;
  return `${stock} in stock`;
}

function renderTable(products) {
  const tbody = document.getElementById('inventoryBody');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:44px;color:#bbb">No products found</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="product-thumb" src="${(p.images && p.images[0]) || ''}" alt="${esc(p.name)}" onerror="this.style.opacity=0"></td>
      <td style="font-weight:500">${esc(p.name)}</td>
      <td><span class="badge" style="background:rgba(201,163,91,0.1);color:#C9A35B">${esc(p.category)}</span></td>
      <td><span class="stock-badge ${stockClass(p.stock)}">${stockLabel(p.stock)}</span></td>
      <td>
        <input type="number" class="stock-edit-input" data-id="${p.id}" value="${p.stock}" min="0" placeholder="Qty">
      </td>
      <td>${p.is_active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Hidden</span>'}</td>
      <td>
        <button class="btn btn-gold btn-sm save-stock-btn" data-id="${p.id}"><i class="ri-save-line"></i> Update</button>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('.save-stock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const input = tbody.querySelector(`.stock-edit-input[data-id="${id}"]`);
      updateStock(id, parseInt(input.value) || 0);
    });
  });
}

async function updateStock(id, newStock) {
  const { error } = await adminDb.from('products').update({ stock: newStock }).eq('id', id);
  if (error) { showToast('Failed to update stock', 'error'); return; }
  const p = allProducts.find(p => p.id === id);
  if (p) p.stock = newStock;
  applyFilters();
  showToast('Stock updated', 'success');
}

function applyFilters() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('categoryFilter')?.value || 'all';
  const stock = document.getElementById('stockFilter')?.value || 'all';

  renderTable(allProducts.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q);
    const matchCat = cat === 'all' || p.category === cat;
    const matchStock = stock === 'all'
      || (stock === 'low' ? p.stock > 0 && p.stock <= 3 : false)
      || (stock === 'out' ? p.stock <= 0 : false)
      || (stock === 'ok' ? p.stock > 3 : false);
    return matchQ && matchCat && matchStock;
  }));
}

['searchInput', 'categoryFilter', 'stockFilter'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFilters);
});
