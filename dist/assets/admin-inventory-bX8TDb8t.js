import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as m,a as d}from"./admin-auth--WGq86QY.js";import{i as g,s as i}from"./admin-ui-CcsmRy9a.js";import"./index-dZcf2LBU.js";await m();g();let c=[];function s(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const{data:p,error:f}=await d.from("products").select("id, name, category, stock, images, is_active").order("stock",{ascending:!0});f?document.getElementById("inventoryBody").innerHTML='<tr><td colspan="7" style="text-align:center;color:#bbb;padding:44px">Failed to load inventory</td></tr>':(c=p||[],r());function y(e){return e<=0?"zero":e<=3?"low":"ok"}function b(e){return e<=0?"Out of Stock":e<=3?`Low (${e})`:`${e} in stock`}function k(e){const a=document.getElementById("inventoryBody");if(!e.length){a.innerHTML='<tr><td colspan="7" style="text-align:center;padding:44px;color:#bbb">No products found</td></tr>';return}a.innerHTML=e.map(t=>`
    <tr>
      <td><img class="product-thumb" src="${t.images&&t.images[0]||""}" alt="${s(t.name)}" onerror="this.style.opacity=0"></td>
      <td style="font-weight:500">${s(t.name)}</td>
      <td><span class="badge" style="background:rgba(201,163,91,0.1);color:#C9A35B">${s(t.category)}</span></td>
      <td><span class="stock-badge ${y(t.stock)}">${b(t.stock)}</span></td>
      <td>
        <input type="number" class="stock-edit-input" data-id="${t.id}" value="${t.stock}" min="0" placeholder="Qty">
      </td>
      <td>${t.is_active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Hidden</span>'}</td>
      <td>
        <button class="btn btn-gold btn-sm save-stock-btn" data-id="${t.id}"><i class="ri-save-line"></i> Update</button>
      </td>
    </tr>`).join(""),a.querySelectorAll(".save-stock-btn").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.id,o=a.querySelector(`.stock-edit-input[data-id="${n}"]`);v(n,parseInt(o.value)||0)})})}async function v(e,a){const{error:t}=await d.from("products").update({stock:a}).eq("id",e);if(t){i("Failed to update stock","error");return}const n=c.find(o=>o.id===e);n&&(n.stock=a),r(),i("Stock updated","success")}function r(){const e=(document.getElementById("searchInput")?.value||"").toLowerCase(),a=document.getElementById("categoryFilter")?.value||"all",t=document.getElementById("stockFilter")?.value||"all";k(c.filter(n=>{const o=!e||n.name.toLowerCase().includes(e),l=a==="all"||n.category===a,u=t==="all"||(t==="low"?n.stock>0&&n.stock<=3:!1)||(t==="out"?n.stock<=0:!1)||(t==="ok"?n.stock>3:!1);return o&&l&&u}))}["searchInput","categoryFilter","stockFilter"].forEach(e=>{const a=document.getElementById(e);a&&a.addEventListener(a.tagName==="INPUT"?"input":"change",r)});
