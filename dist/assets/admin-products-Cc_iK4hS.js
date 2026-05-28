import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as u,a as r}from"./admin-auth-BiH_RBYv.js";import"./index-dZcf2LBU.js";await u();let d=[];const{data:g,error:m}=await r.from("products").select("*").order("created_at",{ascending:!1});m?alert("Failed to load products"):(d=g||[],s(d));function b(e){return e<=0?'<span class="badge badge-out">Out of Stock</span>':e<=3?`<span class="badge badge-low">Low (${e})</span>`:`<span class="badge badge-in-stock">${e} in stock</span>`}function s(e){const a=document.getElementById("productsBody");if(!e.length){a.innerHTML='<tr><td colspan="8" style="text-align:center;padding:40px;color:#999">No products found</td></tr>';return}a.innerHTML=e.map(t=>`
    <tr>
      <td><img class="product-thumb" src="${t.images&&t.images[0]||""}" alt="${t.name}" onerror="this.style.opacity=0"></td>
      <td><strong>${t.name}</strong></td>
      <td><span class="badge" style="background:rgba(201,163,91,0.12);color:#C9A35B">${t.category}</span></td>
      <td style="font-weight:700">₦${t.price.toLocaleString()}</td>
      <td>${b(t.stock)}</td>
      <td>${t.is_featured?'<span class="badge badge-in-stock">Yes</span>':'<span class="badge badge-inactive">No</span>'}</td>
      <td>${t.is_active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Inactive</span>'}</td>
      <td>
        <div style="display:flex;gap:6px">
          <a href="./product-form.html?id=${t.id}" class="btn btn-ghost btn-sm"><i class="ri-edit-line"></i> Edit</a>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${t.id}" data-name="${t.name}"><i class="ri-delete-bin-line"></i></button>
        </div>
      </td>
    </tr>`).join(""),a.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",()=>f(t.dataset.id,t.dataset.name))})}function i(){const e=document.getElementById("searchInput").value.toLowerCase(),a=document.getElementById("categoryFilter").value,t=document.getElementById("statusFilter").value;s(d.filter(n=>{const c=!e||n.name.toLowerCase().includes(e),o=a==="all"||n.category===a,l=t==="all"||(t==="active"?n.is_active:!n.is_active);return c&&o&&l}))}async function f(e,a){if(!confirm(`Delete "${a}"? This cannot be undone.`))return;const{error:t}=await r.from("products").delete().eq("id",e);if(t){alert("Failed to delete product");return}d=d.filter(n=>n.id!==e),s(d)}document.getElementById("searchInput").addEventListener("input",i);document.getElementById("categoryFilter").addEventListener("change",i);document.getElementById("statusFilter").addEventListener("change",i);
