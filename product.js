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

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});