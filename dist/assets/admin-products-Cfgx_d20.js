import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as p,a as l}from"./admin-auth--WGq86QY.js";import{i as y,s as o}from"./admin-ui-CcsmRy9a.js";import"./index-dZcf2LBU.js";await p();y();let d=[];const{data:v,error:h}=await l.from("products").select("*").order("created_at",{ascending:!1});h?o("Failed to load products","error"):(d=v||[],c());function r(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function $(e){return e<=0?'<span class="badge badge-out">Out of Stock</span>':e<=3?`<span class="badge badge-low">Low (${e})</span>`:`<span class="badge badge-in-stock">${e} in stock</span>`}function k(e){const a=document.getElementById("productsBody");if(!e.length){a.innerHTML='<tr><td colspan="8" style="text-align:center;padding:44px;color:#bbb">No products found</td></tr>';return}a.innerHTML=e.map(t=>`
    <tr>
      <td><img class="product-thumb" src="${t.images&&t.images[0]||""}" alt="${r(t.name)}" onerror="this.style.opacity=0"></td>
      <td>
        <strong style="display:block">${r(t.name)}</strong>
        ${t.is_new_arrival?'<span class="badge" style="background:rgba(21,101,192,0.1);color:#1565C0;margin-top:4px">New Arrival</span>':""}
      </td>
      <td><span class="badge" style="background:rgba(201,163,91,0.1);color:#C9A35B">${r(t.category)}</span></td>
      <td style="font-weight:700">₦${t.price.toLocaleString()}</td>
      <td>${$(t.stock)}</td>
      <td>${t.is_featured?'<span class="badge badge-active">Yes</span>':'<span class="badge badge-inactive">No</span>'}</td>
      <td>${t.is_active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Hidden</span>'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <a href="./product-form.html?id=${t.id}" class="btn btn-ghost btn-sm"><i class="ri-edit-line"></i></a>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}" data-name="${r(t.name)}"><i class="ri-delete-bin-line"></i></button>
        </div>
      </td>
    </tr>`).join(""),a.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",()=>w(t.dataset.id,t.dataset.name))})}function c(){const e=document.getElementById("searchInput").value.toLowerCase(),a=document.getElementById("categoryFilter").value,t=document.getElementById("statusFilter").value,s=document.getElementById("stockFilter").value,i=document.getElementById("featuredFilter").value;k(d.filter(n=>{const u=!e||n.name.toLowerCase().includes(e),g=a==="all"||n.category===a,m=t==="all"||(t==="active"?n.is_active:!n.is_active),b=s==="all"||(s==="low"?n.stock>0&&n.stock<=3:s==="out"?n.stock<=0:!0),f=i==="all"||(i==="featured"?n.is_featured:n.is_new_arrival);return u&&g&&m&&b&&f}))}async function w(e,a){if(!confirm(`Delete "${a}"? This cannot be undone.`))return;const{error:t}=await l.from("products").delete().eq("id",e);if(t){o("Failed to delete","error");return}d=d.filter(s=>s.id!==e),c(),o(`"${a}" deleted`,"default")}["searchInput","categoryFilter","statusFilter","stockFilter","featuredFilter"].forEach(e=>{const a=document.getElementById(e);a&&a.addEventListener(a.tagName==="INPUT"?"input":"change",c)});
