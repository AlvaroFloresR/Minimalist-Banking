"use strict";

// -------------------------------------------
//              POP UP
// -------------------------------------------
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");

const navLinks = document.querySelector(".nav__links");
const navEle = document.querySelector(".nav");

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");

const btnSliderRight = document.querySelector(".slider__btn--right");
const btnSliderLeft = document.querySelector(".slider__btn--left");

const dotContainer = document.querySelector(".dots");

// -------------------------------------------
//              FUNCTIONS
// -------------------------------------------
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const smootScroll = function (e) {
  // Disable Default behavior
  e.preventDefault();

  // Getting coords for Section 1
  const s1coords = section1.getBoundingClientRect();

  // Smooth Scrolling
  const smooth_object = {
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: "smooth",
  };
  window.scrollTo(smooth_object);
};

// Event Delegation
const navLinkSmoothScroll = function (e) {
  // Disable default
  e.preventDefault();

  // Where event happened
  const origin = e.target;

  if (origin.classList.contains("nav__link")) {
    const id = origin.getAttribute("href");

    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
};

const tabContainerDelegator = function (e) {
  // Source of click with the closes with class .operations__tab
  const sourceClick = e.target.closest(".operations__tab");

  if (!sourceClick) return;

  // Remove Active from all
  tabs.forEach((ele) => ele.classList.remove("operations__tab--active"));

  // Add active only in source
  sourceClick.classList.add("operations__tab--active");

  // Hide all Content First
  tabsContent.forEach((ele) =>
    ele.classList.remove("operations__content--active")
  );

  // Show Content Area
  const dataTab = sourceClick.getAttribute("data-tab");
  const activeContent = document.querySelector(
    `.operations__content--${dataTab}`
  );
  activeContent.classList.add("operations__content--active");
};

const fadeNavHandlerOver = function (e) {
  let opacity = this;
  // Origin
  const origin = e.target;

  // To only handle the link
  if (origin.classList.contains("nav__link")) {
    // Get all with .nav__link
    const siblings = origin.closest(".nav").querySelectorAll(".nav__link");

    siblings.forEach((ele) => {
      if (ele !== origin) {
        ele.style.opacity = opacity;
      }
    });

    // Get Logo
    const logo = origin.closest(".nav").querySelector("img");
    logo.style.opacity = opacity;
  }
};

// -------------------------------------------
//              EVENT LISTENERS
// -------------------------------------------
btnsOpenModal.forEach((ele) => ele.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", smootScroll);

// Page Navigation
navLinks.addEventListener("click", navLinkSmoothScroll);

// Tab Selections
tabContainer.addEventListener("click", tabContainerDelegator);

// Fade Animation Menu
navEle.addEventListener("mouseover", fadeNavHandlerOver.bind(0.5));
navEle.addEventListener("mouseout", fadeNavHandlerOver.bind(1.0));

// Sticky Menu ----------------------------------------------------------------------
const header = document.querySelector(".header");
const navHeight = navEle.getBoundingClientRect().height;

const headerObserverCallback = function (entries, observer) {
  // Destructuring
  const [entry] = entries;
  !entry.isIntersecting
    ? navEle.classList.add("sticky")
    : navEle.classList.remove("sticky");
};

const obsOptions = {
  // Null for the entire Viewpoert
  root: null,
  // 10%
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(
  headerObserverCallback,
  obsOptions
);
headerObserver.observe(header);
// ----------------------------------------------------------------------

// Reveal Sections ------------------------------------------------------------

const allSections = document.querySelectorAll(".section");

const sectionObserverCallback = function (entries, observer) {
  // Destructuring
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const obsOptionsSection = {
  // Null for the entire Viewpoert
  root: null,
  // 10%
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  sectionObserverCallback,
  obsOptionsSection
);

// Add observer for each section
allSections.forEach((sec) => {
  sectionObserver.observe(sec);
  sec.classList.add("section--hidden");
});

// Lazy Loading -----------------------------------------------------------------------
const allLazy = document.querySelectorAll("img[data-src]");

const lazyImgObserverCallback = function (entries, observer) {
  // Destructuring
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Change Img Src
  const fullResImg = entry.target.dataset.src;

  entry.target.src = fullResImg;

  // Check load event to remove Lazy Blur then
  entry.target.addEventListener("load", function (e) {
    // Remove lazy-img
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const obsOptionsLazyImg = {
  // Null for the entire Viewpoert
  root: null,
  // 10%
  threshold: 0,

  rootMargin: "200px",
};

const lazyImgObserver = new IntersectionObserver(
  lazyImgObserverCallback,
  obsOptionsLazyImg
);

allLazy.forEach((image) => {
  lazyImgObserver.observe(image);
  image.classList.add("lazy-img");
});

// Slider  -----------------------------------------------------------------------
const sliderAll = document.querySelectorAll(".slide");

let currSlide = 0;
// Starting Condition
sliderAll.forEach((slide, idx) => {
  slide.style.transform = `translateX(${idx * 100}%)`;
});

// Buttons
const goToSlide = function (destinationSlide) {
  sliderAll.forEach((slide, idx) => {
    slide.style.transform = `translateX(${(idx - destinationSlide) * 100}%)`;
  });
};

const dotColor = function (slideNum) {
  // Remove color from all
  const allDots = document.querySelectorAll(".dots__dot");
  allDots.forEach((snglDot) => snglDot.classList.remove("dots__dot--active"));

  // Add color to single one
  const targetDot = document.querySelector(
    `.dots__dot[data-slide="${slideNum}"]`
  );
  targetDot.classList.add("dots__dot--active");
};

const prevSlideHandler = function (e) {
  currSlide === 0 ? (currSlide = sliderAll.length - 1) : currSlide--;

  goToSlide(currSlide);
  // Change Color
  dotColor(currSlide);
};

const nextSlideHandler = function (e) {
  currSlide === sliderAll.length - 1 ? (currSlide = 0) : currSlide++;

  goToSlide(currSlide);
  // Change Color
  dotColor(currSlide);
};

btnSliderRight.addEventListener("click", nextSlideHandler);
btnSliderLeft.addEventListener("click", prevSlideHandler);

// Implementing Keyboard Functionality
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlideHandler();
  if (e.key === "ArrowRight") nextSlideHandler();
});

// Dot Creation
const createDots = function () {
  sliderAll.forEach(function (_, idx) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class='dots__dot' data-slide='${idx}'></button>`
    );
  });
  // Change Color
  dotColor(0);
};

dotContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("dots__dot")) return;

  // Dot Source
  const origin = e.target;
  const btnDataSlide = origin.dataset.slide;

  // Change Color
  dotColor(btnDataSlide);
  // go to slide
  goToSlide(btnDataSlide);
});

goToSlide(0);
createDots();
