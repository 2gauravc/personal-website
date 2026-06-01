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

  const caseSelectors = document.querySelectorAll("[data-case-selector]");

  caseSelectors.forEach((selector) => {
    const cards = Array.from(selector.querySelectorAll("[data-case-card]"));
    const panels = Array.from(selector.querySelectorAll("[data-case-panel]"));

    const showCase = (caseId) => {
      cards.forEach((card) => {
        const isSelected = card.dataset.caseCard === caseId;
        card.classList.toggle("is-selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.casePanel !== caseId;
      });
    };

    cards.forEach((card) => {
      card.addEventListener("click", () => showCase(card.dataset.caseCard));
    });
  });

  const mentalModelCards = document.querySelectorAll("[data-mental-model-card]");

  mentalModelCards.forEach((card) => {
    const toggle = card.querySelector("[data-mental-model-toggle]");
    const content = card.querySelector(".mental-model-parent-content");
    const likeButton = card.querySelector("[data-mental-model-like]");

    if (toggle && content) {
      toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isExpanded));
        content.hidden = isExpanded;
        card.classList.toggle("is-expanded", !isExpanded);
      });
    }

    if (likeButton) {
      likeButton.addEventListener("click", () => {
        const isLiked = likeButton.getAttribute("aria-pressed") === "true";
        const label = likeButton.querySelector("[data-like-label]");

        likeButton.setAttribute("aria-pressed", String(!isLiked));
        likeButton.classList.toggle("is-liked", !isLiked);

        if (label) {
          label.textContent = isLiked ? "Like" : "Liked";
        }
      });
    }
  });

  const mentalModelModal = document.querySelector("[data-mental-model-modal]");

  if (mentalModelModal) {
    const modalTitle = mentalModelModal.querySelector("[data-mental-model-modal-title]");
    const modalCopy = mentalModelModal.querySelector("[data-mental-model-modal-copy]");
    const modalCloseButtons = mentalModelModal.querySelectorAll("[data-mental-model-modal-close]");
    let modalTrigger;

    const closeModal = () => {
      mentalModelModal.hidden = true;
      document.body.classList.remove("has-open-modal");

      if (modalTrigger) {
        modalTrigger.focus();
      }
    };

    document.querySelectorAll("[data-mental-model-read-more]").forEach((button) => {
      button.addEventListener("click", () => {
        const childCard = button.closest(".mental-model-child-card");

        if (!childCard || !modalTitle || !modalCopy) {
          return;
        }

        modalTrigger = button;
        modalTitle.textContent = childCard.querySelector("h3")?.textContent || "";
        modalCopy.textContent = childCard.querySelector("p")?.textContent || "";
        mentalModelModal.hidden = false;
        document.body.classList.add("has-open-modal");
        mentalModelModal.querySelector(".mental-model-modal-close")?.focus();
      });
    });

    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mentalModelModal.hidden) {
        closeModal();
      }
    });
  }
});
