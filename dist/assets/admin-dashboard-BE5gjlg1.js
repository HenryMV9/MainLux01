import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i,b as l,a as n}from"./admin-ui-Cz7ejArm.js";import"./index-dZcf2LBU.js";await i();l();const[d,c]=await Promise.all([n.from("orders").select("id, total_amount, status, created_at, customer_name, customer_phone",{count:"exact"}).order("created_at",{ascending:!1}).limit(10),n.from("products").select("id, name, stock, category",{count:"exact"}).eq("is_active",!0)]),e=d.data||[],r=c.data||[];document.getElementById("statOrders").textContent=d.count??e.length;document.getElementById("statProducts").textContent=c.count??r.length;document.getElementById("statPending").textContent=e.filter(t=>t.status==="pending").length;const s=e.filter(t=>t.status!=="cancelled").reduce((t,o)=>t+(o.total_amount||0),0);document.getElementById("statRevenue").textContent=s?`₦${s.toLocaleString()}`:"₦0";const a=r.filter(t=>t.stock<=3);a.length&&(document.getElementById("lowStockWrap").style.display="block",document.getElementById("lowStockList").innerHTML=a.map(t=>{const o=t.stock<=0?"zero":"low";return`
      <div class="low-stock-item">
        <div>
          <div class="low-stock-item-name">${t.name}</div>
          <div class="low-stock-item-meta">${t.category}</div>
        </div>
        <span class="stock-badge ${o}">${t.stock<=0?"Out of Stock":t.stock+" left"}</span>
      </div>`}).join(""));const m=t=>new Date(t).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),u=t=>`<span class="badge badge-${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</span>`;document.getElementById("recentOrdersBody").innerHTML=e.length?e.map(t=>`
      <tr>
        <td><code style="font-size:0.7rem;color:var(--gold)">${t.id.slice(0,8)}…</code></td>
        <td style="font-weight:500">${t.customer_name}</td>
        <td>${t.customer_phone}</td>
        <td style="font-weight:700">₦${(t.total_amount||0).toLocaleString()}</td>
        <td>${u(t.status)}</td>
        <td style="color:#999;font-size:0.75rem">${m(t.created_at)}</td>
      </tr>`).join(""):'<tr><td colspan="6" style="text-align:center;padding:44px;color:#bbb">No orders yet</td></tr>';if(window.innerWidth<900){const t=document.getElementById("dashGrid");t&&(t.style.gridTemplateColumns="1fr")}
