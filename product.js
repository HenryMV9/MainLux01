// IMAGE GALLERY

const mainImage = document.getElementById("mainProductImage");

const thumbnails = document.querySelectorAll(".thumbnail");

thumbnails.forEach(thumbnail => {

    thumbnail.addEventListener("click", () => {

        mainImage.src = thumbnail.src;

        thumbnails.forEach(img => {
            img.classList.remove("active-thumb");
        });

        thumbnail.classList.add("active-thumb");

    });

});

// QUANTITY

const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const quantity = document.getElementById("quantity");

let count = 1;

plusBtn.addEventListener("click", () => {
    count++;
    quantity.innerText = count;
});

minusBtn.addEventListener("click", () => {

    if(count > 1){
        count--;
        quantity.innerText = count;
    }

});

// ADD TO CART

document.querySelector(".add-cart-btn").addEventListener("click", () => {

    const selectedSize = document.querySelector(".sizes button.active-size");

    if (!selectedSize) {
        alert("Please select a size.");
        return;
    }

    const product = {
        name: document.querySelector(".product-info-section h1").innerText,
        price: parseInt(
            document.querySelector(".product-info-section .price")
            .innerText.replace(/[₦,]/g, "")
        ),
        image: mainImage.src,
        size: selectedSize.innerText,
        quantity: count
    };

    let cart = JSON.parse(localStorage.getItem("mainluxCart")) || [];
    cart.push(product);
    localStorage.setItem("mainluxCart", JSON.stringify(cart));

    window.location.href = "./cart.html";

});

// SIZE SELECTION

document.querySelectorAll(".sizes button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active-size"));
        btn.classList.add("active-size");
    });
});

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});