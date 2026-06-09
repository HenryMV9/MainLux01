import { adminDb, initAdmin } from './admin-auth.js';
import { initMobileMenu } from './admin-ui.js';

await initAdmin();
initMobileMenu();

const [ordersRes, productsRes] = await Promise.all([
  adminDb.from('orders').select('id, total_amount, status, created_at, customer_name, customer_phone', { count: 'exact' }).order('created_at', { ascending: false }).limit(10),
  adminDb.from('products').select('id, name, stock, category', { count: 'exact' }).eq('is_active', true)
]);

const orders = ordersRes.data || [];
const products = productsRes.data || [];

document.getElementById('statOrders').textContent = ordersRes.count ?? orders.length;
document.getElementById('statProducts').textContent = productsRes.count ?? products.length;
document.getElementById('statPending').textContent = orders.filter(o => o.status === 'pending').length;

const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total_amount || 0), 0);
document.getElementById('statRevenue').textContent = revenue ? `\u20a6${revenue.toLocaleString()}` : '\u20a60';

const lowStock = products.filter(p => p.stock <= 3);
if (lowStock.length) {
  document.getElementById('lowStockWrap').style.display = 'block';
  document.getElementById('lowStockList').innerHTML = lowStock.map(p => {
    const cls = p.stock <= 0 ? 'zero' : 'low';
    return `
      <div class="low-stock-item">
        <div>
          <div class="low-stock-item-name">${p.name}</div>
          <div class="low-stock-item-meta">${p.category}</div>
        </div>
        <span class="stock-badge ${cls}">${p.stock <= 0 ? 'Out of Stock' : p.stock + ' left'}</span>
      </div>`;
  }).join('');
}

const fmt = d => new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
const statusBadge = s => `<span class="badge badge-${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;

document.getElementById('recentOrdersBody').innerHTML = orders.length
  ? orders.map(o => `
      <tr>
        <td><code style="font-size:0.7rem;color:var(--gold)">${o.id.slice(0,8)}…</code></td>
        <td style="font-weight:500">${o.customer_name}</td>
        <td>${o.customer_phone}</td>
        <td style="font-weight:700">\u20a6${(o.total_amount||0).toLocaleString()}</td>
        <td>${statusBadge(o.status)}</td>
        <td style="color:#999;font-size:0.75rem">${fmt(o.created_at)}</td>
      </tr>`).join('')
  : '<tr><td colspan="6" style="text-align:center;padding:44px;color:#bbb">No orders yet</td></tr>';

// Collapse side column on mobile
if (window.innerWidth < 900) {
  const grid = document.getElementById('dashGrid');
  if (grid) grid.style.gridTemplateColumns = '1fr';
}
