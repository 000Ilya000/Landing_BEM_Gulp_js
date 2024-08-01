const title = document.querySelector(".blockTexImg__title");
const descr = document.querySelector(".blockTextImg__text");
const logo = document.querySelector(".menu__logo");

document.addEventListener("DOMContentLoaded", function () {
  title.classList.add("whiteColor");
  logo.classList.remove("menu__logo--active");
  setTimeout(() => {
    descr.classList.add("whiteColor");
  }, 1500);
});
