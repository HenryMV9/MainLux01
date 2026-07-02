import"./modulepreload-polyfill-B5Qt9EMX.js";import{i,a as n}from"./admin-auth--WGq86QY.js";import{i as m}from"./admin-ui-CcsmRy9a.js";import"./index-dZcf2LBU.js";await i();m();const[c,u,d]=await Promise.all([n.from("orders").select("status, total_amount",{count:"exact"}),n.from("orders").select("id, total_amount, status, created_at, customer_name, customer_phone").order("created_at",{ascending:!1}).limit(10),n.from("products").select("id, name, stock, category",{count:"exact"}).eq("is_active",!0)]),s=c.data||[],a=u.data||[],l=d.data||[];document.getElementById("statOrders").textContent=c.count??s.length;document.getElementById("statProducts").textContent=d.count??l.length;document.getElementById("statPending").textContent=s.filter(t=>t.status==="pending").length;const g=s.filter(t=>t.status!=="cancelled").reduce((t,o)=>t+(o.total_amount||0),0);document.getElementById("statRevenue").textContent=`₦${g.toLocaleString()}`;const r=l.filter(t=>t.stock<=3);r.length&&(document.getElementById("lowStockWrap").style.display="block",document.getElementById("lowStockList").innerHTML=r.map(t=>{const o=t.stock<=0?"zero":"low";return`
      <div class="low-stock-item">
        <div>
          <div class="low-stock-item-name">${e(t.name)}</div>
          <div class="low-stock-item-meta">${e(t.category)}</div>
        </div>
        <span class="stock-badge ${o}">${t.stock<=0?"Out of Stock":t.stock+" left"}</span>
      </div>`}).join(""));const p=t=>new Date(t).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"}),y=t=>`<span class="badge badge-${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</span>`;function e(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}document.getElementById("recentOrdersBody").innerHTML=a.length?a.map(t=>`
      <tr>
        <td><code style="font-size:0.7rem;color:var(--gold)">${t.id.slice(0,8)}…</code></td>
        <td style="font-weight:500">${e(t.customer_name)}</td>
        <td>${e(t.customer_phone)}</td>
        <td style="font-weight:700">₦${(t.total_amount||0).toLocaleString()}</td>
        <td>${y(t.status)}</td>
        <td style="color:#999;font-size:0.75rem">${p(t.created_at)}</td>
      </tr>`).join(""):'<tr><td colspan="6" style="text-align:center;padding:44px;color:#bbb">No orders yet</td></tr>';if(window.innerWidth<900){const t=document.getElementById("dashGrid");t&&(t.style.gridTemplateColumns="1fr")}
