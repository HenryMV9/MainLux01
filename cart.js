// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

// CART

const cartItemsContainer = document.getElementById("cartItems");

let cart = JSON.parse(localStorage.getItem("mainluxCart")) || [];

function renderCart(){

    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        cartItemsContainer.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}">

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p class="cart-item-price">
                    ₦${item.price.toLocaleString()}
                </p>

                <p>Size: ${item.size}</p>

                <div class="quantity-controls">

                    <button onclick="decreaseQuantity(${index})">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${index})">+</button>

                </div>

                <button class="remove-btn"
                onclick="removeItem(${index})">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    document.getElementById("subtotal").innerText =
    `₦${subtotal.toLocaleString()}`;

    document.getElementById("total").innerText =
    `₦${subtotal.toLocaleString()}`;

}

function increaseQuantity(index){
    cart[index].quantity++;
    saveCart();
}

function decreaseQuantity(index){

    if(cart[index].quantity > 1){
        cart[index].quantity--;
    }

    saveCart();
}

function removeItem(index){
    cart.splice(index, 1);
    saveCart();
}

function saveCart(){
    localStorage.setItem("mainluxCart", JSON.stringify(cart));
    renderCart();
}

renderCart();