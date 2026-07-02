import"./modulepreload-polyfill-B5Qt9EMX.js";import"./shared-BRjlQf2g.js";const f="https://mpmvsrestxuuebvtnsqi.supabase.co",y=`${f}/functions/v1/submit-order`,u="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbXZzcmVzdHh1dWVidnRuc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjMyNzYsImV4cCI6MjA5NTQ5OTI3Nn0.zD2b5km07O-6N-hetHuQjHh-fbzJ4Vq4XYSBVnfQyYI",E="2348101181400";function h(){return JSON.parse(localStorage.getItem("mainluxCart")||"[]")}function I(){const r=h(),t=document.getElementById("checkoutItems"),o=document.getElementById("checkoutSubtotal"),a=document.getElementById("checkoutTotal");if(!r.length){window.location.href="./cart.html";return}const s=r.reduce((e,i)=>e+i.price*i.quantity,0);t.innerHTML=r.map(e=>`
    <div class="checkout-item">
      <img src="${e.image}" alt="${e.name}">
      <div class="checkout-item-info">
        <h4>${e.name}</h4>
        <p>Size: ${e.size||"N/A"} &nbsp;|&nbsp; Qty: ${e.quantity}</p>
      </div>
      <span class="checkout-item-price">&#8358;${(e.price*e.quantity).toLocaleString()}</span>
    </div>
  `).join(""),o.textContent=`₦${s.toLocaleString()}`,a.textContent=`₦${s.toLocaleString()}`}function d(r,t,o){const a=document.getElementById(r),s=document.getElementById(t);a&&a.classList.toggle("error",!!o),s&&(s.textContent=o||"")}function g(){["fullName","email","phone","address"].forEach(r=>{const t=document.getElementById(r);t&&t.classList.remove("error")}),["nameError","emailError","phoneError","addressError"].forEach(r=>{const t=document.getElementById(r);t&&(t.textContent="")})}function $(r,t,o,a,s,e){const i=s.map(n=>`  • ${n.name} (Size: ${n.size||"N/A"}, Qty: ${n.quantity}) — ₦${(n.price*n.quantity).toLocaleString()}`).join(`
`);return`*New Order — MAINLUX*

*Customer:* ${r}
*Phone:* ${o}
*Email:* ${t}
*Delivery Address:* ${a}

*Items:*
${i}

*Total: ₦${e.toLocaleString()}*`}document.getElementById("checkoutForm").addEventListener("submit",async r=>{r.preventDefault(),g();const t=document.getElementById("fullName").value.trim(),o=document.getElementById("email").value.trim(),a=document.getElementById("phone").value.trim(),s=document.getElementById("address").value.trim(),e=h();let i=!0;if(t||(d("fullName","nameError","Full name is required"),i=!1),(!o||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o))&&(d("email","emailError","Valid email is required"),i=!1),a||(d("phone","phoneError","Phone number is required"),i=!1),s||(d("address","addressError","Delivery address is required"),i=!1),!e.length){window.location.href="./cart.html";return}if(!i)return;const n=document.getElementById("payBtn");n.disabled=!0,n.classList.add("loading"),n.innerHTML='<i class="ri-loader-4-line"></i> Placing Order...';const m=e.reduce((c,l)=>c+l.price*l.quantity,0);try{const c=await fetch(y,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,Apikey:u},body:JSON.stringify({customer_name:t,customer_email:o,customer_phone:a,shipping_address:s,items:e,total_amount:m})}),l=await c.json();if(!c.ok)throw new Error(l.error||"Order failed");localStorage.removeItem("mainluxCart");const p=$(t,o,a,s,e,m);window.open(`https://wa.me/${E}?text=${encodeURIComponent(p)}`,"_blank"),window.location.href=`./order-success.html?order=${l.order_id}`}catch(c){n.disabled=!1,n.classList.remove("loading"),n.innerHTML='<i class="ri-lock-line"></i> Place Order',window.showToast&&window.showToast(c.message||"Failed to place order. Please try again.","error")}});I();
