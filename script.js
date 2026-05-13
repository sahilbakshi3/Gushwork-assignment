document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const images = ["images/photo.jpg", "images/helmet.jpg", "images/twomen.jpg", "images/photo.jpg"];
  const mainImage = document.querySelector("[data-main-image]");
  const thumbs = [...document.querySelectorAll(".thumb")];
  let activeImage = 0;

  function setGalleryImage(index) {
    activeImage = (index + images.length) % images.length;
    if (!mainImage) return;
    mainImage.style.opacity = "0";
    setTimeout(() => {
      mainImage.src = images[activeImage];
      mainImage.style.opacity = "1";
    }, 130);
    thumbs.forEach((thumb, i) => thumb.classList.toggle("is-active", i === activeImage));
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setGalleryImage(index));
  });
  document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => setGalleryImage(activeImage - 1));
  document.querySelector("[data-gallery-next]")?.addEventListener("click", () => setGalleryImage(activeImage + 1));

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      document.querySelectorAll(".faq-item").forEach((faq) => {
        if (faq !== item) faq.classList.remove("is-open");
      });
      item?.classList.toggle("is-open");
    });
  });

  const processData = {
    raw: {
      title: "High-Grade Raw Material Selection",
      text: "Virgin PE compounds are verified before production to ensure purity, pressure rating, and long-term performance.",
      points: ["99% purity assured", "Optimal molecular weight distribution"],
    },
    extrusion: {
      title: "Precision Extrusion Process",
      text: "Computer-controlled extruders maintain uniform wall thickness and steady dimensional accuracy across every batch.",
      points: ["Continuous in-line monitoring", "Calibrated die and cooling control"],
    },
    quality: {
      title: "Rigorous Quality Checks",
      text: "Every lot is checked for pressure resistance, dimensional accuracy, surface finish, density, and impact performance.",
      points: ["Hydrostatic pressure tested", "Documented batch traceability"],
    },
    marking: {
      title: "Permanent Product Marking",
      text: "Pipe markings include size, grade, pressure rating, standard reference, and batch code for traceability.",
      points: ["Readable long-life markings", "Project-ready documentation"],
    },
    packing: {
      title: "Secure Export-Ready Packing",
      text: "Coils and straight lengths are prepared for safe movement, storage, and fast unloading at job sites.",
      points: ["Coil lengths up to 500m", "Damage-resistant bundling"],
    },
  };

  const processTitle = document.querySelector("[data-process-title]");
  const processText = document.querySelector("[data-process-text]");
  const processPoints = document.querySelector("[data-process-points]");
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach((tab) => tab.classList.remove("is-active"));
      button.classList.add("is-active");
      const content = processData[button.dataset.tab];
      processTitle.textContent = content.title;
      processText.textContent = content.text;
      processPoints.innerHTML = content.points.map((point) => `<li>${point}</li>`).join("");
    });
  });

  const slider = document.querySelector("[data-card-slider]");
  document.querySelector("[data-card-next]")?.addEventListener("click", () => slider?.scrollBy({ left: 320, behavior: "smooth" }));
  document.querySelector("[data-card-prev]")?.addEventListener("click", () => slider?.scrollBy({ left: -320, behavior: "smooth" }));

  const modal = document.querySelector("[data-modal]");
  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof modal?.showModal === "function") modal.showModal();
    });
  });
  document.querySelector("[data-close-modal]")?.addEventListener("click", () => modal?.close());

  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const original = button.textContent;
      button.textContent = "Request Sent ✓";
      button.disabled = true;
      form.reset();
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
        modal?.close();
      }, 1800);
    });
  });
});
