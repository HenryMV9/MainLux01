import{d as p}from"./supabase-client-DkRLAGM-.js";const c=document.getElementById("productsGrid"),v=c?c.dataset.category:"male",l=document.getElementById("sizeFilter"),d=document.getElementById("priceFilter"),u=document.getElementById("sortFilter"),r=document.getElementById("productCount");let m=[];function h(i){return i<=0?{cls:"out-of-stock",label:"Out of Stock"}:i<=3?{cls:"low-stock",label:"Low Stock"}:{cls:"in-stock",label:"In Stock"}}function k(){c.innerHTML=Array(3).fill(`
    <div class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line btn"></div>
      </div>
    </div>
  `).join("")}function y(i){if(!i.length){c.innerHTML='<div class="empty-state"><i class="ri-search-line"></i><h3>No products found</h3><p>Try adjusting your filters.</p></div>',r&&(r.textContent="");return}r&&(r.textContent=`${i.length} product${i.length!==1?"s":""}`),c.innerHTML=i.map(e=>{const a=e.images&&e.images.length?e.images[0]:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",n=h(e.stock),t=e.sizes&&e.sizes.length?`Sizes: ${e.sizes.join(", ")}`:"",s=e.stock<=0?"disabled":"";return`
      <a href="./product.html?id=${e.id}" class="product-link">
        <div class="product-card fade-in" data-price="${e.price}" data-sizes="${JSON.stringify(e.sizes||[]).replace(/"/g,"&quot;")}">
          <div class="product-image">
            <img src="${a}" alt="${e.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="stock ${n.cls}">${n.label}</span>
            <h3>${e.name}</h3>
            <p class="price">&#8358;${e.price.toLocaleString()}</p>
            <div class="sizes">${t}</div>
            <button class="cart-btn" data-id="${e.id}" ${s}>
              <i class="ri-shopping-bag-line"></i>
              ${e.stock<=0?"Out of Stock":"Quick Add"}
            </button>
          </div>
        </div>
      </a>`}).join(""),c.querySelectorAll(".fade-in").forEach((e,a)=>{setTimeout(()=>e.classList.add("visible"),a*80)}),c.querySelectorAll(".cart-btn:not([disabled])").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation();const n=e.dataset.id,t=m.find(f=>f.id===n);if(!t)return;const s=JSON.parse(localStorage.getItem("mainluxCart")||"[]"),o=s.find(f=>f.id===n);o?o.quantity+=1:s.push({id:t.id,name:t.name,price:t.price,image:t.images&&t.images.length?t.images[0]:"",size:t.sizes&&t.sizes.length?t.sizes[0]:"",quantity:1}),localStorage.setItem("mainluxCart",JSON.stringify(s)),window.updateCartBadge&&window.updateCartBadge(),window.showToast&&window.showToast(`${t.name} added to cart`)})})}function g(){const i=l?l.value:"all",e=d?d.value:"all",a=u?u.value:"default";let n=m.filter(t=>{const s=i==="all"||t.sizes&&t.sizes.includes(parseInt(i)),o=e==="all"||t.price<=parseInt(e);return s&&o});a==="price-asc"?n.sort((t,s)=>t.price-s.price):a==="price-desc"&&n.sort((t,s)=>s.price-t.price),y(n)}async function z(){k();const{data:i,error:e}=await p.from("products").select("*").eq("category",v).eq("is_active",!0).order("created_at",{ascending:!1});if(e||!i){c.innerHTML='<div class="empty-state"><i class="ri-error-warning-line"></i><h3>Could not load products</h3><p>Please refresh the page.</p></div>';return}m=i,g()}l&&l.addEventListener("change",g);d&&d.addEventListener("change",g);u&&u.addEventListener("change",g);z();
