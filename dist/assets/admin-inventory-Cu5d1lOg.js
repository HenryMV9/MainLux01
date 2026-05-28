import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{i as u,b as m,a as i,s as r}from"./admin-ui-Cz7ejArm.js";import"./index-dZcf2LBU.js";await u();m();let s=[];const{data:g,error:y}=await i.from("products").select("id, name, category, stock, images, is_active").order("stock",{ascending:!0});y?document.getElementById("inventoryBody").innerHTML='<tr><td colspan="7" style="text-align:center;color:#bbb;padding:44px">Failed to load inventory</td></tr>':(s=g||[],c());function b(e){return e<=0?"zero":e<=3?"low":"ok"}function f(e){return e<=0?"Out of Stock":e<=3?`Low (${e})`:`${e} in stock`}function k(e){const a=document.getElementById("inventoryBody");if(!e.length){a.innerHTML='<tr><td colspan="7" style="text-align:center;padding:44px;color:#bbb">No products found</td></tr>';return}a.innerHTML=e.map(t=>`
    <tr>
      <td><img class="product-thumb" src="${t.images&&t.images[0]||""}" alt="${t.name}" onerror="this.style.opacity=0"></td>
      <td style="font-weight:500">${t.name}</td>
      <td><span class="badge" style="background:rgba(201,163,91,0.1);color:#C9A35B">${t.category}</span></td>
      <td><span class="stock-badge ${b(t.stock)}">${f(t.stock)}</span></td>
      <td>
        <input type="number" class="stock-edit-input" data-id="${t.id}" value="${t.stock}" min="0" placeholder="Qty">
      </td>
      <td>${t.is_active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Hidden</span>'}</td>
      <td>
        <button class="btn btn-gold btn-sm save-stock-btn" data-id="${t.id}"><i class="ri-save-line"></i> Update</button>
      </td>
    </tr>`).join(""),a.querySelectorAll(".save-stock-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=a.querySelector(`.stock-edit-input[data-id="${n}"]`);p(n,parseInt(o.value)||0)})})}async function p(e,a){const{error:t}=await i.from("products").update({stock:a}).eq("id",e);if(t){r("Failed to update stock","error");return}const n=s.find(o=>o.id===e);n&&(n.stock=a),c(),r("Stock updated","success")}function c(){const e=(document.getElementById("searchInput")?.value||"").toLowerCase(),a=document.getElementById("categoryFilter")?.value||"all",t=document.getElementById("stockFilter")?.value||"all";k(s.filter(n=>{const o=!e||n.name.toLowerCase().includes(e),d=a==="all"||n.category===a,l=t==="all"||(t==="low"?n.stock>0&&n.stock<=3:!1)||(t==="out"?n.stock<=0:!1)||(t==="ok"?n.stock>3:!1);return o&&d&&l}))}["searchInput","categoryFilter","stockFilter"].forEach(e=>{const a=document.getElementById(e);a&&a.addEventListener(a.tagName==="INPUT"?"input":"change",c)});
