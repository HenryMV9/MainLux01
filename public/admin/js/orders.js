import { adminDb, initAdmin } from './admin-auth.js';

await initAdmin();

let allOrders = [];

const { data, error } = await adminDb.from('orders').select('*').order('created_at', { ascending: false });

if (error) {
  document.getElementById('ordersBody').innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999;padding:40px">Failed to load orders</td></tr>';
} else {
  allOrders = data || [];
  document.getElementById('orderCountBadge').textContent = `${allOrders.length} total`;
  renderOrders();
}

function renderOrders() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const filtered = allOrders.filter(o => {
    const matchQ = !q || o.customer_name.toLowerCase().includes(q) || (o.customer_phone || '').includes(q);
    const matchStatus = status === 'all' || o.status === status;
    return matchQ && matchStatus;
  });

  const fmt = d => new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
  const statuses = ['pending','confirmed','shipped','delivered','cancelled'];

  document.getElementById('ordersBody').innerHTML = filtered.length
    ? filtered.map(o => `
        <tr>
          <td><code style="font-size:0.72rem;color:#C9A35B">${o.id.slice(0,8)}...</code></td>
          <td><strong>${o.customer_name}</strong></td>
          <td>${o.customer_phone}</td>
          <td style="font-size:0.75rem;color:#888">${o.customer_email}</td>
          <td style="font-weight:700">\u20a6${(o.total_amount||0).toLocaleString()}</td>
          <td style="color:#888">${Array.isArray(o.items) ? o.items.length : 0} items</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              ${statuses.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
            </select>
          </td>
          <td style="color:#888;font-size:0.75rem">${fmt(o.created_at)}</td>
          <td><button class="btn btn-ghost btn-sm view-btn" data-id="${o.id}"><i class="ri-eye-line"></i></button></td>
        </tr>`).join('')
    : '<tr><td colspan="9" style="text-align:center;padding:40px;color:#999">No orders found</td></tr>';

  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value));
  });
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => viewOrder(btn.dataset.id));
  });
}

async function updateStatus(id, status) {
  const { error } = await adminDb.from('orders').update({ status }).eq('id', id);
  if (error) { alert('Failed to update status'); return; }
  const order = allOrders.find(o => o.id === id);
  if (order) order.status = status;
}

function viewOrder(id) {
  const o = allOrders.find(o => o.id === id);
  if (!o) return;
  const items = Array.isArray(o.items) ? o.items : [];
  document.getElementById('modalContent').innerHTML = `
    <div style="margin-bottom:16px"><p style="font-size:0.72rem;color:#888;margin-bottom:6px">Order ID</p><code style="color:#C9A35B">${o.id}</code></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">CUSTOMER</p><strong>${o.customer_name}</strong></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">PHONE</p><strong>${o.customer_phone}</strong></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">EMAIL</p><span style="font-size:0.82rem">${o.customer_email}</span></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">STATUS</p><span class="badge badge-${o.status}">${o.status}</span></div>
    </div>
    <div style="margin-bottom:20px"><p style="font-size:0.68rem;color:#888;margin-bottom:6px">DELIVERY ADDRESS</p><p style="font-size:0.82rem">${o.shipping_address}</p></div>
    <div>
      <p style="font-size:0.68rem;color:#888;margin-bottom:12px">ORDER ITEMS</p>
      ${items.map(item => `
        <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">
          <img src="${item.image||''}" style="width:50px;height:50px;object-fit:cover;border:1px solid #eee">
          <div style="flex:1"><strong style="font-size:0.85rem">${item.name}</strong><p style="font-size:0.75rem;color:#888">Size: ${item.size||'N/A'} &nbsp;|&nbsp; Qty: ${item.quantity}</p></div>
          <span style="font-weight:700;color:#C9A35B">\u20a6${(item.price*item.quantity).toLocaleString()}</span>
        </div>`).join('')}
      <div style="text-align:right;margin-top:16px;font-size:1rem;font-weight:700">Total: <span style="color:#C9A35B">\u20a6${(o.total_amount||0).toLocaleString()}</span></div>
    </div>`;
  document.getElementById('orderModal').style.display = 'flex';
}

document.getElementById('searchInput').addEventListener('input', renderOrders);
document.getElementById('statusFilter').addEventListener('change', renderOrders);

document.getElementById('orderModal').querySelector('.modal-close').addEventListener('click', () => {
  document.getElementById('orderModal').style.display = 'none';
});
document.getElementById('orderModal').addEventListener('click', e => {
  if (e.target === document.getElementById('orderModal')) document.getElementById('orderModal').style.display = 'none';
});
