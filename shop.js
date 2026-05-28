// FILTERS

const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");

const products = document.querySelectorAll(".product-card");

function filterProducts(){

    const selectedSize = sizeFilter.value;
    const selectedPrice = priceFilter.value;

    products.forEach(product => {

        const productSize = product.dataset.size;
        const productPrice = parseInt(product.dataset.price);

        let showProduct = true;

        if(selectedSize !== "all" &&
        productSize !== selectedSize){

            showProduct = false;
        }

        if(selectedPrice !== "all" &&
        productPrice > parseInt(selectedPrice)){

            showProduct = false;
        }

        product.style.display = showProduct
        ? "block"
        : "none";

    });

}

sizeFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

// ADD TO CART

const cartButtons = document.querySelectorAll(".cart-btn");

cartButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        e.preventDefault();

        const productCard =
        button.closest(".product-card");

        const product = {

            name:
            productCard.querySelector("h3").innerText,

            price:
            parseInt(
                productCard.dataset.price
            ),

            image:
            productCard.querySelector("img").src,

            size:
            productCard.dataset.size,

            quantity:1

        };

        let cart =
        JSON.parse(localStorage.getItem("mainluxCart"))
        || [];

        cart.push(product);

        localStorage.setItem(
            "mainluxCart",
            JSON.stringify(cart)
        );

        window.location.href = "./cart.html";

    });

});