import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shared-BRjlQf2g.js";function r(){return JSON.parse(localStorage.getItem("mainluxCart")||"[]")}function o(a){localStorage.setItem("mainluxCart",JSON.stringify(a)),window.updateCartBadge&&window.updateCartBadge()}function m(a){return a.reduce((n,i)=>n+i.price*i.quantity,0)}function c(){const a=r(),n=document.getElementById("cartItems"),i=document.getElementById("cartSummary"),l=document.getElementById("cartItemCount");if(!n)return;const d=a.reduce((t,e)=>t+e.quantity,0);if(l&&(l.textContent=`${d} item${d!==1?"s":""}`),!a.length){n.innerHTML=`
      <div class="empty-cart">
        <i class="ri-shopping-bag-3-line"></i>
        <h2>Your cart is empty</h2>
        <p>Discover our luxury collection and add your first pair.</p>
        <a href="./male.html" class="btn-primary" style="display:inline-flex;gap:8px;align-items:center;text-decoration:none;padding:16px 36px;background:#0B0B0B;color:#fff;font-size:0.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase">Shop Now</a>
      </div>`,i&&(i.style.display="none");return}i&&(i.style.display="block"),n.innerHTML=a.map((t,e)=>`
    <div class="cart-item" data-index="${e}">
      <img class="cart-item-img" src="${t.image}" alt="${t.name}">
      <div>
        <p class="cart-item-name">${t.name}</p>
        <p class="cart-item-meta">Size: ${t.size||"N/A"}</p>
        <div class="cart-item-qty">
          <button class="qty-minus" data-index="${e}">-</button>
          <span>${t.quantity}</span>
          <button class="qty-plus" data-index="${e}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">&#8358;${(t.price*t.quantity).toLocaleString()}</span>
        <button class="remove-btn" data-index="${e}"><i class="ri-delete-bin-line"></i></button>
      </div>
    </div>
  `).join("");const u=m(a);document.getElementById("subtotal").textContent=`₦${u.toLocaleString()}`,document.getElementById("total").textContent=`₦${u.toLocaleString()}`,n.querySelectorAll(".qty-plus").forEach(t=>{t.addEventListener("click",()=>{const e=r();e[t.dataset.index].quantity+=1,o(e),c()})}),n.querySelectorAll(".qty-minus").forEach(t=>{t.addEventListener("click",()=>{const e=r(),s=parseInt(t.dataset.index);e[s].quantity>1?e[s].quantity-=1:e.splice(s,1),o(e),c()})}),n.querySelectorAll(".remove-btn").forEach(t=>{t.addEventListener("click",()=>{const e=r();e.splice(parseInt(t.dataset.index),1),o(e),c(),window.showToast&&window.showToast("Item removed from cart")})})}c();
