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

        // SIZE FILTER

        if(selectedSize !== "all" && productSize !== selectedSize){
            showProduct = false;
        }

        // PRICE FILTER

        if(selectedPrice !== "all" && productPrice > parseInt(selectedPrice)){
            showProduct = false;
        }

        product.style.display = showProduct ? "block" : "none";

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