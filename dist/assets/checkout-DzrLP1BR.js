import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shared-BRjlQf2g.js";import{c as f,g,r as y}from"./rate-limit-BoU-R_Gz.js";const E="https://mpmvsrestxuuebvtnsqi.supabase.co",I=`${E}/functions/v1/submit-order`,u="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbXZzcmVzdHh1dWVidnRuc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjMyNzYsImV4cCI6MjA5NTQ5OTI3Nn0.zD2b5km07O-6N-hetHuQjHh-fbzJ4Vq4XYSBVnfQyYI",w="2348101181400";function h(){return JSON.parse(localStorage.getItem("mainluxCart")||"[]")}function $(){const r=h(),t=document.getElementById("checkoutItems"),n=document.getElementById("checkoutSubtotal"),a=document.getElementById("checkoutTotal");if(!r.length){window.location.href="./cart.html";return}const s=r.reduce((e,i)=>e+i.price*i.quantity,0);t.innerHTML=r.map(e=>`
    <div class="checkout-item">
      <img src="${e.image}" alt="${e.name}">
      <div class="checkout-item-info">
        <h4>${e.name}</h4>
        <p>Size: ${e.size||"N/A"} &nbsp;|&nbsp; Qty: ${e.quantity}</p>
      </div>
      <span class="checkout-item-price">&#8358;${(e.price*e.quantity).toLocaleString()}</span>
    </div>
  `).join(""),n.textContent=`₦${s.toLocaleString()}`,a.textContent=`₦${s.toLocaleString()}`}function d(r,t,n){const a=document.getElementById(r),s=document.getElementById(t);a&&a.classList.toggle("error",!!n),s&&(s.textContent=n||"")}function b(){["fullName","email","phone","address"].forEach(r=>{const t=document.getElementById(r);t&&t.classList.remove("error")}),["nameError","emailError","phoneError","addressError"].forEach(r=>{const t=document.getElementById(r);t&&(t.textContent="")})}function B(r,t,n,a,s,e){const i=s.map(o=>`  • ${o.name} (Size: ${o.size||"N/A"}, Qty: ${o.quantity}) — ₦${(o.price*o.quantity).toLocaleString()}`).join(`
`);return`*New Order — MAINLUX*

*Customer:* ${r}
*Phone:* ${n}
*Email:* ${t}
*Delivery Address:* ${a}

*Items:*
${i}

*Total: ₦${e.toLocaleString()}*`}document.getElementById("checkoutForm").addEventListener("submit",async r=>{r.preventDefault(),b();const t=document.getElementById("fullName").value.trim(),n=document.getElementById("email").value.trim(),a=document.getElementById("phone").value.trim(),s=document.getElementById("address").value.trim(),e=h();let i=!0;if(t||(d("fullName","nameError","Full name is required"),i=!1),(!n||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n))&&(d("email","emailError","Valid email is required"),i=!1),a||(d("phone","phoneError","Phone number is required"),i=!1),s||(d("address","addressError","Delivery address is required"),i=!1),!e.length){window.location.href="./cart.html";return}if(!i)return;if(!f("checkout",3,5*60*1e3)){const c=Math.ceil(g("checkout",3,3e5)/1e3);window.showToast&&window.showToast(`Please wait ${c}s before placing another order.`,"error");return}const o=document.getElementById("payBtn");o.disabled=!0,o.classList.add("loading"),o.innerHTML='<i class="ri-loader-4-line"></i> Placing Order...';const m=e.reduce((c,l)=>c+l.price*l.quantity,0);try{const c=await fetch(I,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,Apikey:u},body:JSON.stringify({customer_name:t,customer_email:n,customer_phone:a,shipping_address:s,items:e,total_amount:m})}),l=await c.json();if(!c.ok)throw new Error(l.error||"Order failed");y("checkout"),localStorage.removeItem("mainluxCart");const p=B(t,n,a,s,e,m);window.open(`https://wa.me/${w}?text=${encodeURIComponent(p)}`,"_blank"),window.location.href=`./order-success.html?order=${l.order_id}`}catch(c){o.disabled=!1,o.classList.remove("loading"),o.innerHTML='<i class="ri-lock-line"></i> Place Order',window.showToast&&window.showToast(c.message||"Failed to place order. Please try again.","error")}});$();
