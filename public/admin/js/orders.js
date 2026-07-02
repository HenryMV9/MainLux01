import { adminDb, initAdmin } from './admin-auth.js';
import { initMobileMenu, showToast } from './admin-ui.js';

await initAdmin();
initMobileMenu();

let allOrders = [];

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const { data, error } = await adminDb.from('orders').select('*').order('created_at', { ascending: false });

if (error) {
  document.getElementById('ordersBody').innerHTML = '<tr><td colspan="9" style="text-align:center;color:#bbb;padding:44px">Failed to load orders</td></tr>';
} else {
  allOrders = data || [];
  const badge = document.getElementById('orderCountBadge');
  if (badge) badge.textContent = `${allOrders.length} orders`;
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
          <td><code style="font-size:0.69rem;color:var(--gold)">${o.id.slice(0,8)}…</code></td>
          <td style="font-weight:500">${esc(o.customer_name)}</td>
          <td>${esc(o.customer_phone)}</td>
          <td style="font-size:0.76rem;color:#888">${esc(o.customer_email)}</td>
          <td style="font-weight:700">\u20a6${(o.total_amount||0).toLocaleString()}</td>
          <td style="color:#888">${Array.isArray(o.items) ? o.items.length : 0} item${Array.isArray(o.items) && o.items.length !== 1 ? 's' : ''}</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              ${statuses.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
            </select>
          </td>
          <td style="color:#999;font-size:0.74rem">${fmt(o.created_at)}</td>
          <td><button class="btn btn-ghost btn-sm view-btn" data-id="${o.id}"><i class="ri-eye-line"></i></button></td>
        </tr>`).join('')
    : '<tr><td colspan="9" style="text-align:center;padding:44px;color:#bbb">No orders found</td></tr>';

  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value));
  });
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => viewOrder(btn.dataset.id));
  });
}

async function updateStatus(id, status) {
  const { error } = await adminDb.from('orders').update({ status }).eq('id', id);
  if (error) { showToast('Failed to update status', 'error'); return; }
  const order = allOrders.find(o => o.id === id);
  if (order) order.status = status;
  showToast('Status updated', 'success');
}

function viewOrder(id) {
  const o = allOrders.find(o => o.id === id);
  if (!o) return;
  const items = Array.isArray(o.items) ? o.items : [];

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-field-group">
      <div class="modal-field"><label>Customer</label><p>${esc(o.customer_name)}</p></div>
      <div class="modal-field"><label>Phone</label><p>${esc(o.customer_phone)}</p></div>
      <div class="modal-field"><label>Email</label><p style="font-size:0.8rem">${esc(o.customer_email)}</p></div>
      <div class="modal-field"><label>Status</label><p><span class="badge badge-${esc(o.status)}">${esc(o.status)}</span></p></div>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:0.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:600;display:block;margin-bottom:6px">Delivery Address</label>
      <p style="font-size:0.84rem">${esc(o.shipping_address)}</p>
    </div>
    <p class="modal-items-title">Order Items</p>
    ${items.map(item => `
      <div class="modal-order-item">
        <img src="${esc(item.image||'')}" alt="${esc(item.name)}" onerror="this.style.display='none'">
        <div class="modal-order-item-info">
          <strong>${esc(item.name)}</strong>
          <span>Size: ${esc(item.size||'N/A')} &nbsp;·&nbsp; Qty: ${Number(item.quantity)}</span>
        </div>
        <span class="modal-order-item-price">\u20a6${(item.price*item.quantity).toLocaleString()}</span>
      </div>`).join('')}
    <div class="modal-total">Total: <span>\u20a6${(o.total_amount||0).toLocaleString()}</span></div>`;

  document.getElementById('orderModal').style.display = 'flex';
}

document.getElementById('searchInput').addEventListener('input', renderOrders);
document.getElementById('statusFilter').addEventListener('change', renderOrders);

const modal = document.getElementById('orderModal');
document.getElementById('modalClose').addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
