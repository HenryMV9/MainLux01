import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as f,b as y,a as c,s as r}from"./admin-ui-Cz7ejArm.js";import"./index-dZcf2LBU.js";await f();y();let d=[];const{data:p,error:v}=await c.from("products").select("*").order("created_at",{ascending:!1});v?r("Failed to load products","error"):(d=p||[],o());function h(e){return e<=0?'<span class="badge badge-out">Out of Stock</span>':e<=3?`<span class="badge badge-low">Low (${e})</span>`:`<span class="badge badge-in-stock">${e} in stock</span>`}function $(e){const a=document.getElementById("productsBody");if(!e.length){a.innerHTML='<tr><td colspan="8" style="text-align:center;padding:44px;color:#bbb">No products found</td></tr>';return}a.innerHTML=e.map(t=>`
    <tr>
      <td><img class="product-thumb" src="${t.images&&t.images[0]||""}" alt="${t.name}" onerror="this.style.opacity=0"></td>
      <td>
        <strong style="display:block">${t.name}</strong>
        ${t.is_new_arrival?'<span class="badge" style="background:rgba(21,101,192,0.1);color:#1565C0;margin-top:4px">New Arrival</span>':""}
      </td>
      <td><span class="badge" style="background:rgba(201,163,91,0.1);color:#C9A35B">${t.category}</span></td>
      <td style="font-weight:700">₦${t.price.toLocaleString()}</td>
      <td>${h(t.stock)}</td>
      <td>${t.is_featured?'<span class="badge badge-active">Yes</span>':'<span class="badge badge-inactive">No</span>'}</td>
      <td>${t.is_active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Hidden</span>'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <a href="./product-form.html?id=${t.id}" class="btn btn-ghost btn-sm"><i class="ri-edit-line"></i></a>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}" data-name="${t.name}"><i class="ri-delete-bin-line"></i></button>
        </div>
      </td>
    </tr>`).join(""),a.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",()=>k(t.dataset.id,t.dataset.name))})}function o(){const e=document.getElementById("searchInput").value.toLowerCase(),a=document.getElementById("categoryFilter").value,t=document.getElementById("statusFilter").value,n=document.getElementById("stockFilter").value,i=document.getElementById("featuredFilter").value;$(d.filter(s=>{const l=!e||s.name.toLowerCase().includes(e),u=a==="all"||s.category===a,g=t==="all"||(t==="active"?s.is_active:!s.is_active),m=n==="all"||(n==="low"?s.stock>0&&s.stock<=3:n==="out"?s.stock<=0:!0),b=i==="all"||(i==="featured"?s.is_featured:s.is_new_arrival);return l&&u&&g&&m&&b}))}async function k(e,a){if(!confirm(`Delete "${a}"? This cannot be undone.`))return;const{error:t}=await c.from("products").delete().eq("id",e);if(t){r("Failed to delete","error");return}d=d.filter(n=>n.id!==e),o(),r(`"${a}" deleted`,"default")}["searchInput","categoryFilter","statusFilter","stockFilter","featuredFilter"].forEach(e=>{const a=document.getElementById(e);a&&a.addEventListener(a.tagName==="INPUT"?"input":"change",o)});
