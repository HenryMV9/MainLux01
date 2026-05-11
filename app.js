// HERO SLIDER

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function changeSlide() {

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    slides[currentSlide].classList.add("active");
}

setInterval(changeSlide, 3000);

// MOBILE MENU

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});