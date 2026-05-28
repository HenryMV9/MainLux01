import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as l,a as n}from"./admin-auth-DyvPZzL3.js";import"./index-dZcf2LBU.js";await l();const[s,d]=await Promise.all([n.from("orders").select("id, total_amount, status, created_at, customer_name, customer_phone",{count:"exact"}).order("created_at",{ascending:!1}).limit(10),n.from("products").select("id, name, stock",{count:"exact"}).eq("is_active",!0)]),e=s.data||[],c=d.data||[];document.getElementById("statOrders").textContent=s.count??e.length;document.getElementById("statProducts").textContent=d.count??c.length;document.getElementById("statPending").textContent=e.filter(t=>t.status==="pending").length;const o=e.filter(t=>t.status!=="cancelled").reduce((t,r)=>t+(r.total_amount||0),0);document.getElementById("statRevenue").textContent=o?`₦${o.toLocaleString()}`:"₦0";const a=c.filter(t=>t.stock<=3);a.length&&(document.getElementById("lowStockWrap").style.display="block",document.getElementById("lowStockList").innerHTML=a.map(t=>`
    <div class="low-stock-item"><span>${t.name}</span><span class="stock-num">${t.stock} left</span></div>`).join(""));const i=t=>`<span class="badge badge-${t}">${t}</span>`,m=t=>new Date(t).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"});document.getElementById("recentOrdersBody").innerHTML=e.length?e.map(t=>`
      <tr>
        <td><code style="font-size:0.72rem;color:#C9A35B">${t.id.slice(0,8)}...</code></td>
        <td>${t.customer_name}</td>
        <td>${t.customer_phone}</td>
        <td style="font-weight:700">₦${(t.total_amount||0).toLocaleString()}</td>
        <td>${i(t.status)}</td>
        <td style="color:#888;font-size:0.75rem">${m(t.created_at)}</td>
      </tr>`).join(""):'<tr><td colspan="6" style="text-align:center;padding:40px;color:#999">No orders yet</td></tr>';
