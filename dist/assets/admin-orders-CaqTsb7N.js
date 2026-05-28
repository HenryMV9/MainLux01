import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as m,a as l}from"./admin-auth-DyvPZzL3.js";import"./index-dZcf2LBU.js";await m();let s=[];const{data:p,error:u}=await l.from("orders").select("*").order("created_at",{ascending:!1});u?document.getElementById("ordersBody").innerHTML='<tr><td colspan="9" style="text-align:center;color:#999;padding:40px">Failed to load orders</td></tr>':(s=p||[],document.getElementById("orderCountBadge").textContent=`${s.length} total`,a());function a(){const n=document.getElementById("searchInput").value.toLowerCase(),e=document.getElementById("statusFilter").value,r=s.filter(t=>{const d=!n||t.customer_name.toLowerCase().includes(n)||(t.customer_phone||"").includes(n),c=e==="all"||t.status===e;return d&&c}),o=t=>new Date(t).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),i=["pending","confirmed","shipped","delivered","cancelled"];document.getElementById("ordersBody").innerHTML=r.length?r.map(t=>`
        <tr>
          <td><code style="font-size:0.72rem;color:#C9A35B">${t.id.slice(0,8)}...</code></td>
          <td><strong>${t.customer_name}</strong></td>
          <td>${t.customer_phone}</td>
          <td style="font-size:0.75rem;color:#888">${t.customer_email}</td>
          <td style="font-weight:700">₦${(t.total_amount||0).toLocaleString()}</td>
          <td style="color:#888">${Array.isArray(t.items)?t.items.length:0} items</td>
          <td>
            <select class="status-select" data-id="${t.id}">
              ${i.map(d=>`<option value="${d}" ${t.status===d?"selected":""}>${d.charAt(0).toUpperCase()+d.slice(1)}</option>`).join("")}
            </select>
          </td>
          <td style="color:#888;font-size:0.75rem">${o(t.created_at)}</td>
          <td><button class="btn btn-ghost btn-sm view-btn" data-id="${t.id}"><i class="ri-eye-line"></i></button></td>
        </tr>`).join(""):'<tr><td colspan="9" style="text-align:center;padding:40px;color:#999">No orders found</td></tr>',document.querySelectorAll(".status-select").forEach(t=>{t.addEventListener("change",()=>g(t.dataset.id,t.value))}),document.querySelectorAll(".view-btn").forEach(t=>{t.addEventListener("click",()=>y(t.dataset.id))})}async function g(n,e){const{error:r}=await l.from("orders").update({status:e}).eq("id",n);if(r){alert("Failed to update status");return}const o=s.find(i=>i.id===n);o&&(o.status=e)}function y(n){const e=s.find(o=>o.id===n);if(!e)return;const r=Array.isArray(e.items)?e.items:[];document.getElementById("modalContent").innerHTML=`
    <div style="margin-bottom:16px"><p style="font-size:0.72rem;color:#888;margin-bottom:6px">Order ID</p><code style="color:#C9A35B">${e.id}</code></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">CUSTOMER</p><strong>${e.customer_name}</strong></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">PHONE</p><strong>${e.customer_phone}</strong></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">EMAIL</p><span style="font-size:0.82rem">${e.customer_email}</span></div>
      <div><p style="font-size:0.68rem;color:#888;margin-bottom:4px">STATUS</p><span class="badge badge-${e.status}">${e.status}</span></div>
    </div>
    <div style="margin-bottom:20px"><p style="font-size:0.68rem;color:#888;margin-bottom:6px">DELIVERY ADDRESS</p><p style="font-size:0.82rem">${e.shipping_address}</p></div>
    <div>
      <p style="font-size:0.68rem;color:#888;margin-bottom:12px">ORDER ITEMS</p>
      ${r.map(o=>`
        <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06)">
          <img src="${o.image||""}" style="width:50px;height:50px;object-fit:cover;border:1px solid #eee">
          <div style="flex:1"><strong style="font-size:0.85rem">${o.name}</strong><p style="font-size:0.75rem;color:#888">Size: ${o.size||"N/A"} &nbsp;|&nbsp; Qty: ${o.quantity}</p></div>
          <span style="font-weight:700;color:#C9A35B">₦${(o.price*o.quantity).toLocaleString()}</span>
        </div>`).join("")}
      <div style="text-align:right;margin-top:16px;font-size:1rem;font-weight:700">Total: <span style="color:#C9A35B">₦${(e.total_amount||0).toLocaleString()}</span></div>
    </div>`,document.getElementById("orderModal").style.display="flex"}document.getElementById("searchInput").addEventListener("input",a);document.getElementById("statusFilter").addEventListener("change",a);document.getElementById("orderModal").querySelector(".modal-close").addEventListener("click",()=>{document.getElementById("orderModal").style.display="none"});document.getElementById("orderModal").addEventListener("click",n=>{n.target===document.getElementById("orderModal")&&(document.getElementById("orderModal").style.display="none")});
