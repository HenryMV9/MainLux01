import { adminDb, initAdmin } from './admin-auth.js';

await initAdmin();

let allProducts = [];

const { data, error } = await adminDb.from('products').select('*').order('created_at', { ascending: false });
if (error) { alert('Failed to load products'); }
else { allProducts = data || []; renderTable(allProducts); }

function stockBadge(stock) {
  if (stock <= 0) return `<span class="badge badge-out">Out of Stock</span>`;
  if (stock <= 3) return `<span class="badge badge-low">Low (${stock})</span>`;
  return `<span class="badge badge-in-stock">${stock} in stock</span>`;
}

function renderTable(products) {
  const tbody = document.getElementById('productsBody');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#999">No products found</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img class="product-thumb" src="${(p.images && p.images[0]) || ''}" alt="${p.name}" onerror="this.style.opacity=0"></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge" style="background:rgba(201,163,91,0.12);color:#C9A35B">${p.category}</span></td>
      <td style="font-weight:700">\u20a6${p.price.toLocaleString()}</td>
      <td>${stockBadge(p.stock)}</td>
      <td>${p.is_featured ? '<span class="badge badge-in-stock">Yes</span>' : '<span class="badge badge-inactive">No</span>'}</td>
      <td>${p.is_active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Inactive</span>'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <a href="./product-form.html?id=${p.id}" class="btn btn-ghost btn-sm"><i class="ri-edit-line"></i> Edit</a>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" data-name="${p.name}"><i class="ri-delete-bin-line"></i></button>
        </div>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id, btn.dataset.name));
  });
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;
  renderTable(allProducts.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q);
    const matchCat = cat === 'all' || p.category === cat;
    const matchStatus = status === 'all' || (status === 'active' ? p.is_active : !p.is_active);
    return matchQ && matchCat && matchStatus;
  }));
}

async function deleteProduct(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  const { error } = await adminDb.from('products').delete().eq('id', id);
  if (error) { alert('Failed to delete product'); return; }
  allProducts = allProducts.filter(p => p.id !== id);
  renderTable(allProducts);
}

document.getElementById('searchInput').addEventListener('input', filterProducts);
document.getElementById('categoryFilter').addEventListener('change', filterProducts);
document.getElementById('statusFilter').addEventListener('change', filterProducts);
