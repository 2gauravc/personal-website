document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navMenu.classList.toggle("hidden", !isOpen);
    });
  }

  const downloadForm = document.querySelector("[data-download-form]");

  if (downloadForm) {
    downloadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = downloadForm.querySelector("[data-form-message]");

      if (message) {
        message.textContent = "Thanks — the download link will be sent to your email.";
      }

      downloadForm.reset();
    });
  }

  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let rotationTimer;
    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (!slides.length) {
      return;
    }

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const showSlide = (nextIndex) => {
      activeIndex = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.hidden = !isActive;
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const startRotation = () => {
      window.clearInterval(rotationTimer);
      rotationTimer = window.setInterval(() => showSlide(activeIndex + 1), 7000);
    };

    const handleManualNavigation = (nextIndex) => {
      showSlide(nextIndex);
      startRotation();
    };

    if (previousButton) {
      previousButton.addEventListener("click", () => handleManualNavigation(activeIndex - 1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => handleManualNavigation(activeIndex + 1));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => handleManualNavigation(index));
    });

    showSlide(activeIndex);
    startRotation();
  });
});
