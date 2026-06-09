import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shared-BRjlQf2g.js";import{d as g}from"./supabase-client-Co2q9R3y.js";import"./index-dZcf2LBU.js";const l=new URLSearchParams(window.location.search).get("id");l||(window.location.href="./index.html");let s=1;function p(t){return t<=0?{cls:"out-of-stock",label:"Out of Stock"}:t<=3?{cls:"low-stock",label:"Low Stock"}:{cls:"in-stock",label:"In Stock"}}function h(t){const o=p(t.stock),i=t.images&&t.images.length?t.images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"],r=t.category==="male"?"./male.html":"./female.html",c=t.category==="male"?"Male Collection":"Female Collection";document.title=`${t.name} | MAINLUX`,document.getElementById("breadcrumbCollection").textContent=c,document.getElementById("breadcrumbCollection").href=r,document.getElementById("breadcrumbName").textContent=t.name;const a=document.getElementById("gallerySection");a.innerHTML=`
    <div class="main-image">
      <img id="mainProductImage" src="${i[0]}" alt="${t.name}">
    </div>
    <div class="thumbnail-grid">
      ${i.map((e,n)=>`<img class="thumbnail ${n===0?"active-thumb":""}" src="${e}" alt="${t.name}" loading="lazy">`).join("")}
    </div>
  `,a.querySelectorAll(".thumbnail").forEach(e=>{e.addEventListener("click",()=>{document.getElementById("mainProductImage").src=e.src,a.querySelectorAll(".thumbnail").forEach(n=>n.classList.remove("active-thumb")),e.classList.add("active-thumb")})}),document.getElementById("infoSection").innerHTML=`
    <span class="category-badge">${c}</span>
    <h1>${t.name}</h1>
    <p class="product-price">&#8358;${t.price.toLocaleString()}</p>
    <span class="stock-badge ${o.cls}">${o.label}</span>
    <div class="divider"></div>
    <span class="option-label">Select Size</span>
    <div class="sizes">
      ${(t.sizes||[]).map(e=>`<button class="size-btn" data-size="${e}">${e}</button>`).join("")}
    </div>
    <span class="option-label">Quantity</span>
    <div class="quantity-box">
      <button id="minusBtn">-</button>
      <span id="quantity">1</span>
      <button id="plusBtn">+</button>
    </div>
    <div class="product-buttons">
      <button class="add-cart-btn" id="addCartBtn" ${t.stock<=0?"disabled":""}>
        <i class="ri-shopping-bag-line"></i>
        Add To Cart
      </button>
      <a href="https://wa.me/2348101181400?text=Hi%20MAINLUX%2C%20I%20want%20to%20order%20${encodeURIComponent(t.name)}%20-%20%E2%82%A6${t.price.toLocaleString()}" target="_blank" class="whatsapp-btn">
        <i class="ri-whatsapp-line"></i>
        Order On WhatsApp
      </a>
    </div>
    <div class="divider"></div>
    <div class="product-description">
      <h3>Description</h3>
      <p>${t.description||"Premium luxury slide designed and made in Nigeria."}</p>
    </div>
  `;const d=document.querySelectorAll(".size-btn");d.forEach(e=>{e.addEventListener("click",()=>{d.forEach(n=>n.classList.remove("active-size")),e.classList.add("active-size")})}),document.getElementById("plusBtn").addEventListener("click",()=>{s++,document.getElementById("quantity").textContent=s}),document.getElementById("minusBtn").addEventListener("click",()=>{s>1&&(s--,document.getElementById("quantity").textContent=s)}),document.getElementById("addCartBtn").addEventListener("click",()=>{const e=document.querySelector(".size-btn.active-size");if(!e&&t.sizes&&t.sizes.length>0){window.showToast&&window.showToast("Please select a size","error");return}const n=JSON.parse(localStorage.getItem("mainluxCart")||"[]"),m=n.find(u=>u.id===t.id&&u.size==(e?e.dataset.size:""));m?m.quantity+=s:n.push({id:t.id,name:t.name,price:t.price,image:i[0],size:e?e.dataset.size:"",quantity:s}),localStorage.setItem("mainluxCart",JSON.stringify(n)),window.updateCartBadge&&window.updateCartBadge(),window.showToast&&window.showToast(`${t.name} added to cart`)})}function b(t,o){const i=t.filter(a=>a.id!==o).slice(0,3);if(!i.length)return;const r=document.getElementById("relatedSection"),c=document.getElementById("relatedGrid");r.style.display="block",c.innerHTML=i.map(a=>{const d=a.images&&a.images.length?a.images[0]:"",e=p(a.stock);return`
      <a href="./product.html?id=${a.id}" class="product-link">
        <div class="product-card">
          <div class="product-image"><img src="${d}" alt="${a.name}" loading="lazy"></div>
          <div class="product-info">
            <span class="stock ${e.cls}">${e.label}</span>
            <h3>${a.name}</h3>
            <p class="price">&#8358;${a.price.toLocaleString()}</p>
          </div>
        </div>
      </a>`}).join("")}async function y(){const{data:t,error:o}=await g.from("products").select("*").eq("id",l).eq("is_active",!0).maybeSingle();if(o||!t){document.getElementById("infoSection").innerHTML='<p style="padding:40px 0;color:#888">Product not found.</p>';return}h(t);const{data:i}=await g.from("products").select("*").eq("category",t.category).eq("is_active",!0).neq("id",l).limit(3);i&&i.length&&b(i,l)}y();
