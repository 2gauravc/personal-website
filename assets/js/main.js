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
