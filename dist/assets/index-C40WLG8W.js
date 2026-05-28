import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shared-BRjlQf2g.js";import{d as r}from"./supabase-client-DkRLAGM-.js";import"./index-dZcf2LBU.js";const n=document.querySelectorAll(".hero-slide"),c=document.querySelectorAll(".dot");let l=0,u;function f(e){n[l].classList.remove("active"),c[l].classList.remove("active"),l=(e+n.length)%n.length,n[l].classList.add("active"),c[l].classList.add("active")}function v(){f(l+1)}function g(){clearInterval(u),u=setInterval(v,5e3)}c.forEach((e,a)=>{e.addEventListener("click",()=>{f(a),g()})});g();function S(e){return e<=0?{cls:"out-of-stock",label:"Out of Stock"}:e<=3?{cls:"low-stock",label:"Low Stock"}:{cls:"in-stock",label:"In Stock"}}async function h(){const e=document.getElementById("newArrivals");if(!e)return;let{data:a,error:t}=await r.from("products").select("*").eq("is_featured",!0).eq("is_active",!0).limit(3);if(t||!a||!a.length){const{data:s}=await r.from("products").select("*").eq("is_active",!0).limit(3);m(e,s||[]);return}m(e,a)}function m(e,a){if(!a.length){e.innerHTML='<p style="text-align:center;color:#888;padding:40px">No products available.</p>';return}e.innerHTML=a.map((t,s)=>{const i=t.images&&t.images.length?t.images[0]:"",o=S(t.stock);return`
      <a href="./product.html?id=${t.id}" class="product-link">
        <div class="product-card fade-in" style="transition-delay:${s*.1}s">
          <div class="product-image">
            <img src="${i}" alt="${t.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="stock ${o.cls}">${o.label}</span>
            <h3>${t.name}</h3>
            <p class="price">&#8358;${t.price.toLocaleString()}</p>
            <div class="sizes">Sizes: ${(t.sizes||[]).join(", ")}</div>
            <button class="cart-btn" data-id="${t.id}">
              <i class="ri-shopping-bag-line"></i>
              Quick Add
            </button>
          </div>
        </div>
      </a>`}).join(""),setTimeout(()=>{e.querySelectorAll(".fade-in").forEach(t=>t.classList.add("visible"))},100),e.querySelectorAll(".cart-btn").forEach(t=>{t.addEventListener("click",async s=>{s.preventDefault(),s.stopPropagation();const{data:i}=await r.from("products").select("*").eq("id",t.dataset.id).maybeSingle();if(!i)return;const o=JSON.parse(localStorage.getItem("mainluxCart")||"[]"),d=o.find(p=>p.id===i.id);d?d.quantity+=1:o.push({id:i.id,name:i.name,price:i.price,image:(i.images||[])[0]||"",size:(i.sizes||[])[0]||"",quantity:1}),localStorage.setItem("mainluxCart",JSON.stringify(o)),window.updateCartBadge&&window.updateCartBadge(),window.showToast&&window.showToast(`${i.name} added to cart`)})})}h();
