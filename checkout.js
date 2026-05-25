// MOBILE

const menuToggle =
document.getElementById("menuToggle");

const mobileMenu =
document.getElementById("mobileMenu");

menuToggle.addEventListener("click", ()=>{

mobileMenu.classList.toggle("active");

});

// CART SUMMARY

const checkoutItems =
document.getElementById("checkoutItems");

const checkoutTotal =
document.getElementById("checkoutTotal");

let cart =
JSON.parse(localStorage.getItem("mainluxCart"))
|| [];

let total = 0;

cart.forEach(item=>{

total += item.price * item.quantity;

checkoutItems.innerHTML += `

<div class="checkout-item">

<img src="${item.image}">

<div>

<h4>${item.name}</h4>

<p>₦${item.price.toLocaleString()}</p>

<p>Qty: ${item.quantity}</p>

</div>

</div>

`;

});

checkoutTotal.innerText =
`₦${total.toLocaleString()}`;

// PAY BUTTON

document
.getElementById("payBtn")
.addEventListener("click", ()=>{

const name =
document.getElementById("fullName").value;

if(!name){

alert("Please fill checkout details");

return;

}

alert(
"Payment successful. MAINLUX thanks you."
);

localStorage.removeItem("mainluxCart");

window.location.href = "/";

});