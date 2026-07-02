import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as g,a as u}from"./admin-auth--WGq86QY.js";import{i as y,s as m}from"./admin-ui-CcsmRy9a.js";import"./index-dZcf2LBU.js";await g();y();let o=[];function d(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const{data:f,error:v}=await u.from("orders").select("*").order("created_at",{ascending:!1});if(v)document.getElementById("ordersBody").innerHTML='<tr><td colspan="9" style="text-align:center;color:#bbb;padding:44px">Failed to load orders</td></tr>';else{o=f||[];const a=document.getElementById("orderCountBadge");a&&(a.textContent=`${o.length} orders`),c()}function c(){const a=document.getElementById("searchInput").value.toLowerCase(),t=document.getElementById("statusFilter").value,n=o.filter(e=>{const r=!a||e.customer_name.toLowerCase().includes(a)||(e.customer_phone||"").includes(a),p=t==="all"||e.status===t;return r&&p}),s=e=>new Date(e).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),i=["pending","confirmed","shipped","delivered","cancelled"];document.getElementById("ordersBody").innerHTML=n.length?n.map(e=>`
        <tr>
          <td><code style="font-size:0.69rem;color:var(--gold)">${e.id.slice(0,8)}…</code></td>
          <td style="font-weight:500">${d(e.customer_name)}</td>
          <td>${d(e.customer_phone)}</td>
          <td style="font-size:0.76rem;color:#888">${d(e.customer_email)}</td>
          <td style="font-weight:700">₦${(e.total_amount||0).toLocaleString()}</td>
          <td style="color:#888">${Array.isArray(e.items)?e.items.length:0} item${Array.isArray(e.items)&&e.items.length!==1?"s":""}</td>
          <td>
            <select class="status-select" data-id="${e.id}">
              ${i.map(r=>`<option value="${r}" ${e.status===r?"selected":""}>${r.charAt(0).toUpperCase()+r.slice(1)}</option>`).join("")}
            </select>
          </td>
          <td style="color:#999;font-size:0.74rem">${s(e.created_at)}</td>
          <td><button class="btn btn-ghost btn-sm view-btn" data-id="${e.id}"><i class="ri-eye-line"></i></button></td>
        </tr>`).join(""):'<tr><td colspan="9" style="text-align:center;padding:44px;color:#bbb">No orders found</td></tr>',document.querySelectorAll(".status-select").forEach(e=>{e.addEventListener("change",()=>b(e.dataset.id,e.value))}),document.querySelectorAll(".view-btn").forEach(e=>{e.addEventListener("click",()=>$(e.dataset.id))})}async function b(a,t){const{error:n}=await u.from("orders").update({status:t}).eq("id",a);if(n){m("Failed to update status","error");return}const s=o.find(i=>i.id===a);s&&(s.status=t),m("Status updated","success")}function $(a){const t=o.find(s=>s.id===a);if(!t)return;const n=Array.isArray(t.items)?t.items:[];document.getElementById("modalContent").innerHTML=`
    <div class="modal-field-group">
      <div class="modal-field"><label>Customer</label><p>${d(t.customer_name)}</p></div>
      <div class="modal-field"><label>Phone</label><p>${d(t.customer_phone)}</p></div>
      <div class="modal-field"><label>Email</label><p style="font-size:0.8rem">${d(t.customer_email)}</p></div>
      <div class="modal-field"><label>Status</label><p><span class="badge badge-${d(t.status)}">${d(t.status)}</span></p></div>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:0.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:600;display:block;margin-bottom:6px">Delivery Address</label>
      <p style="font-size:0.84rem">${d(t.shipping_address)}</p>
    </div>
    <p class="modal-items-title">Order Items</p>
    ${n.map(s=>`
      <div class="modal-order-item">
        <img src="${d(s.image||"")}" alt="${d(s.name)}" onerror="this.style.display='none'">
        <div class="modal-order-item-info">
          <strong>${d(s.name)}</strong>
          <span>Size: ${d(s.size||"N/A")} &nbsp;·&nbsp; Qty: ${Number(s.quantity)}</span>
        </div>
        <span class="modal-order-item-price">₦${(s.price*s.quantity).toLocaleString()}</span>
      </div>`).join("")}
    <div class="modal-total">Total: <span>₦${(t.total_amount||0).toLocaleString()}</span></div>`,document.getElementById("orderModal").style.display="flex"}document.getElementById("searchInput").addEventListener("input",c);document.getElementById("statusFilter").addEventListener("change",c);const l=document.getElementById("orderModal");document.getElementById("modalClose").addEventListener("click",()=>l.style.display="none");l.addEventListener("click",a=>{a.target===l&&(l.style.display="none")});
