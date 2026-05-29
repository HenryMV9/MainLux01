import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as p,b as y,a as m,s as c}from"./admin-ui-Cz7ejArm.js";import"./index-dZcf2LBU.js";await p();y();let o=[];const{data:g,error:f}=await m.from("orders").select("*").order("created_at",{ascending:!1});if(f)document.getElementById("ordersBody").innerHTML='<tr><td colspan="9" style="text-align:center;color:#bbb;padding:44px">Failed to load orders</td></tr>';else{o=g||[];const a=document.getElementById("orderCountBadge");a&&(a.textContent=`${o.length} orders`),i()}function i(){const a=document.getElementById("searchInput").value.toLowerCase(),t=document.getElementById("statusFilter").value,d=o.filter(e=>{const n=!a||e.customer_name.toLowerCase().includes(a)||(e.customer_phone||"").includes(a),u=t==="all"||e.status===t;return n&&u}),s=e=>new Date(e).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),l=["pending","confirmed","shipped","delivered","cancelled"];document.getElementById("ordersBody").innerHTML=d.length?d.map(e=>`
        <tr>
          <td><code style="font-size:0.69rem;color:var(--gold)">${e.id.slice(0,8)}…</code></td>
          <td style="font-weight:500">${e.customer_name}</td>
          <td>${e.customer_phone}</td>
          <td style="font-size:0.76rem;color:#888">${e.customer_email}</td>
          <td style="font-weight:700">₦${(e.total_amount||0).toLocaleString()}</td>
          <td style="color:#888">${Array.isArray(e.items)?e.items.length:0} item${Array.isArray(e.items)&&e.items.length!==1?"s":""}</td>
          <td>
            <select class="status-select" data-id="${e.id}">
              ${l.map(n=>`<option value="${n}" ${e.status===n?"selected":""}>${n.charAt(0).toUpperCase()+n.slice(1)}</option>`).join("")}
            </select>
          </td>
          <td style="color:#999;font-size:0.74rem">${s(e.created_at)}</td>
          <td><button class="btn btn-ghost btn-sm view-btn" data-id="${e.id}"><i class="ri-eye-line"></i></button></td>
        </tr>`).join(""):'<tr><td colspan="9" style="text-align:center;padding:44px;color:#bbb">No orders found</td></tr>',document.querySelectorAll(".status-select").forEach(e=>{e.addEventListener("change",()=>v(e.dataset.id,e.value))}),document.querySelectorAll(".view-btn").forEach(e=>{e.addEventListener("click",()=>b(e.dataset.id))})}async function v(a,t){const{error:d}=await m.from("orders").update({status:t}).eq("id",a);if(d){c("Failed to update status","error");return}const s=o.find(l=>l.id===a);s&&(s.status=t),c("Status updated","success")}function b(a){const t=o.find(s=>s.id===a);if(!t)return;const d=Array.isArray(t.items)?t.items:[];document.getElementById("modalContent").innerHTML=`
    <div class="modal-field-group">
      <div class="modal-field"><label>Customer</label><p>${t.customer_name}</p></div>
      <div class="modal-field"><label>Phone</label><p>${t.customer_phone}</p></div>
      <div class="modal-field"><label>Email</label><p style="font-size:0.8rem">${t.customer_email}</p></div>
      <div class="modal-field"><label>Status</label><p><span class="badge badge-${t.status}">${t.status}</span></p></div>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:0.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:600;display:block;margin-bottom:6px">Delivery Address</label>
      <p style="font-size:0.84rem">${t.shipping_address}</p>
    </div>
    <p class="modal-items-title">Order Items</p>
    ${d.map(s=>`
      <div class="modal-order-item">
        <img src="${s.image||""}" alt="${s.name}" onerror="this.style.display='none'">
        <div class="modal-order-item-info">
          <strong>${s.name}</strong>
          <span>Size: ${s.size||"N/A"} &nbsp;·&nbsp; Qty: ${s.quantity}</span>
        </div>
        <span class="modal-order-item-price">₦${(s.price*s.quantity).toLocaleString()}</span>
      </div>`).join("")}
    <div class="modal-total">Total: <span>₦${(t.total_amount||0).toLocaleString()}</span></div>`,document.getElementById("orderModal").style.display="flex"}document.getElementById("searchInput").addEventListener("input",i);document.getElementById("statusFilter").addEventListener("change",i);const r=document.getElementById("orderModal");document.getElementById("modalClose").addEventListener("click",()=>r.style.display="none");r.addEventListener("click",a=>{a.target===r&&(r.style.display="none")});
