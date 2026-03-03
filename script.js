/**
 * script.js – Mangalam HDPE Pipes & Coils
 * Handles:
 *  1. Sticky header (show/hide on scroll with smooth animation)
 *  2. Image carousel (prev/next, thumbnail navigation)
 *  3. Carousel zoom-on-hover (magnifying-glass style)
 *  4. Mobile hamburger menu
 *  5. FAQ accordion
 *  6. Process tabs
 *  7. Applications slider
 *  8. Scroll-reveal animations
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     1. STICKY HEADER
     Show a secondary sticky header when user scrolls past the
     first fold (viewport height). Hide when scrolling back up.
     ============================================================ */
  const stickyHeader = document.getElementById("sticky-header");
  const mainNav = document.getElementById("main-nav");
  let lastScrollY = 0;
  const FOLD_OFFSET = window.innerHeight * 0.6; // 60vh trigger point

  function onScroll() {
    const scrollY = window.scrollY;

    // Show sticky header after fold
    if (scrollY > FOLD_OFFSET && scrollY > lastScrollY) {
      // Scrolling DOWN and past fold → show sticky
      stickyHeader.classList.add("visible");
      stickyHeader.setAttribute("aria-hidden", "false");
      mainNav.classList.add("pushed"); // shift main-nav below sticky
    } else if (scrollY < lastScrollY || scrollY <= FOLD_OFFSET) {
      // Scrolling UP or back above fold → hide sticky
      stickyHeader.classList.remove("visible");
      stickyHeader.setAttribute("aria-hidden", "true");
      mainNav.classList.remove("pushed");
    }

    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     2. HAMBURGER / MOBILE MENU
     ============================================================ */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ============================================================
     3. IMAGE CAROUSEL
     ============================================================ */
  const carouselTrack = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const thumbsContainer = document.getElementById("carousel-thumbs");
  const slides = document.querySelectorAll(".carousel-slide");
  const thumbs = document.querySelectorAll(".thumb");

  let currentIndex = 0;
  const totalSlides = slides.length;

  /**
   * Navigate to a specific slide index.
   * Updates the CSS transform on the track and marks the correct
   * thumbnail as active.
   */
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;

    // Move the track
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update slide active class
    slides.forEach((s, i) => s.classList.toggle("active", i === currentIndex));

    // Update thumbnail active class
    thumbs.forEach((t, i) => t.classList.toggle("active", i === currentIndex));
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  if (nextBtn)
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Thumbnail clicks
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      goToSlide(parseInt(thumb.dataset.index, 10));
    });
  });

  // Auto-advance every 5 seconds
  let autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);

  // Pause autoplay on user interaction
  [prevBtn, nextBtn].forEach((btn) => {
    if (btn)
      btn.addEventListener("click", () => {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 5000);
      });
  });

  // Keyboard navigation when carousel is focused
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
    if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  });

  /* ============================================================
     4. CAROUSEL ZOOM ON HOVER
     On mouse-enter a slide, show a large zoom-preview panel to
     the right of the carousel. The preview follows the cursor
     position and renders a magnified version of the image.
     ============================================================ */
  const ZOOM_LEVEL = 2.8; // Magnification factor
  const LENS_W = 120; // Lens box width  (px)
  const LENS_H = 100; // Lens box height (px)

  slides.forEach((slide, idx) => {
    const img = slide.querySelector("img");
    const zoomPreview = document.getElementById(`zoom-preview-${idx}`);
    const zoomInner = document.getElementById(`zoom-inner-${idx}`);
    const zoomLens = idx === 0 ? document.getElementById("zoom-lens") : null;

    if (!img || !zoomPreview || !zoomInner) return;

    // Once image loads, set up the background on the preview
    function initZoom() {
      zoomInner.style.backgroundImage = `url('${img.src}')`;
      zoomInner.style.backgroundRepeat = "no-repeat";
    }

    if (img.complete) initZoom();
    else img.addEventListener("load", initZoom);

    slide.addEventListener("mouseenter", () => {
      zoomPreview.classList.add("active");
      if (zoomLens) {
        zoomLens.style.display = "block";
        zoomLens.style.width = LENS_W + "px";
        zoomLens.style.height = LENS_H + "px";
      }
    });

    slide.addEventListener("mouseleave", () => {
      zoomPreview.classList.remove("active");
      if (zoomLens) zoomLens.style.display = "none";
    });

    slide.addEventListener("mousemove", (e) => {
      if (slide !== slides[currentIndex]) return; // only active slide

      const rect = slide.getBoundingClientRect();
      // Cursor position relative to slide
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Clamp so lens doesn't go out of bounds
      x = Math.max(LENS_W / 2, Math.min(rect.width - LENS_W / 2, x));
      y = Math.max(LENS_H / 2, Math.min(rect.height - LENS_H / 2, y));

      // Position the lens indicator (first slide only has the lens div)
      if (zoomLens) {
        zoomLens.style.left = x - LENS_W / 2 + "px";
        zoomLens.style.top = y - LENS_H / 2 + "px";
      }

      // Calculate background position for the zoomed inner
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;

      const previewRect = zoomPreview.getBoundingClientRect();
      zoomInner.style.backgroundSize = `${rect.width * ZOOM_LEVEL}px ${rect.height * ZOOM_LEVEL}px`;
      zoomInner.style.backgroundPosition = `${bgX}% ${bgY}%`;
      zoomInner.style.width = "100%";
      zoomInner.style.height = "100%";
    });
  });

  /* ============================================================
     5. FAQ ACCORDION
     ============================================================ */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const icon = item.querySelector(".faq-icon");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");

      // Update icon direction
      if (icon) icon.textContent = isOpen ? "▲" : "▼";

      // Close others (accordion behaviour)
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains("open")) {
          other.classList.remove("open");
          const otherIcon = other.querySelector(".faq-icon");
          if (otherIcon) otherIcon.textContent = "▼";
        }
      });
    });
  });

  /* ============================================================
     6. PROCESS TABS
     ============================================================ */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const processInfo = document.getElementById("process-info");

  const tabContent = {
    raw: {
      title: "High-Grade Raw Material Selection",
      body: "Minimum industry-best materials create a stronger, more reliable solution that achieves higher performance standards.",
      points: [
        "✔ 99% purity assured",
        "✔ Optimal molecular weight distribution",
      ],
    },
    extrusion: {
      title: "Precision Extrusion Process",
      body: "State-of-the-art twin-screw extruders ensure uniform wall thickness and consistent dimensional accuracy across all pipe sizes.",
      points: ["✔ Uniform wall thickness", "✔ Continuous in-line monitoring"],
    },
    quality: {
      title: "Rigorous Quality Checks",
      body: "Every batch undergoes hydrostatic pressure testing, dimensional inspection and impact testing to meet IS/ISO standards.",
      points: ["✔ 100% hydrostatic tested", "✔ Third-party certified"],
    },
    marking: {
      title: "Permanent Pipe Marking",
      body: "Laser-engraved permanent markings include diameter, pressure rating, standard reference and batch traceability codes.",
      points: ["✔ Permanent laser marking", "✔ Full traceability per batch"],
    },
    coiling: {
      title: "Automated Coiling Systems",
      body: "Servo-controlled coilers deliver precise coil diameters and uniform tension for easy handling and installation.",
      points: [
        "✔ Available up to 500m coil length",
        "✔ Tension-controlled winding",
      ],
    },
    packing: {
      title: "Secure & Export-Ready Packing",
      body: "UV-stabilised stretch wrap and custom wooden crating protect pipes during long-distance transport and outdoor storage.",
      points: ["✔ UV-protected wrapping", "✔ Custom crating for export"],
    },
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.tab;
      const data = tabContent[key];
      if (!data || !processInfo) return;

      processInfo.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <ul>${data.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      `;
    });
  });

  /* ============================================================
     7. APPLICATIONS SLIDER
     Shift the cards by one card width on arrow click.
     ============================================================ */
  const appCards = document.getElementById("app-cards");
  const appPrevBtn = document.getElementById("app-prev");
  const appNextBtn = document.getElementById("app-next");
  let appOffset = 0;
  const APP_CARD_W = 100 / 4; // 25% per card

  if (appCards && appPrevBtn && appNextBtn) {
    const totalAppCards = appCards.querySelectorAll(".app-card").length;
    const visibleCards = 4; // visible at once on desktop

    appNextBtn.addEventListener("click", () => {
      const maxOffset = (totalAppCards - visibleCards) * APP_CARD_W;
      appOffset = Math.min(appOffset + APP_CARD_W, maxOffset);
      appCards.style.transform = `translateX(-${appOffset}%)`;
    });

    appPrevBtn.addEventListener("click", () => {
      appOffset = Math.max(appOffset - APP_CARD_W, 0);
      appCards.style.transform = `translateX(-${appOffset}%)`;
    });
  }

  /* ============================================================
     8. SCROLL-REVEAL ANIMATIONS
     Observes elements with class .reveal and adds .visible when
     they enter the viewport.
     ============================================================ */
  const revealTargets = document.querySelectorAll(
    ".feature-card, .app-card, .testimonial-card, .portfolio-card, .faq-item, .specs-table",
  );

  // Add reveal class to all targets
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger delay for grid items
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ============================================================
     9. REPLACE MISSING IMAGES WITH PLACEHOLDER GRADIENTS
     Since assets/img1.jpg may not exist in the demo, create
     colourful CSS gradient placeholders for all img elements.
     ============================================================ */
  const allImgs = document.querySelectorAll('img[src="assets/img1.jpg"]');
  const gradients = [
    "linear-gradient(135deg,#1a2342 0%,#3a4fd4 60%,#e07b2d 100%)",
    "linear-gradient(135deg,#243060 0%,#2da86e 60%,#f9a752 100%)",
    "linear-gradient(135deg,#0d1220 0%,#3a4fd4 50%,#243060 100%)",
    "linear-gradient(135deg,#e07b2d 0%,#1a2342 70%,#3a4fd4 100%)",
  ];

  allImgs.forEach((img, i) => {
    img.onerror = function () {
      const parent = img.parentElement;
      if (!parent) return;
      const div = document.createElement("div");
      div.style.cssText = `
        width:100%;height:100%;
        background:${gradients[i % gradients.length]};
        display:flex;align-items:center;justify-content:center;
        font-size:0.75rem;color:rgba(255,255,255,0.5);
        letter-spacing:0.05em;text-transform:uppercase;
      `;
      div.textContent = "Product Image";
      parent.replaceChild(div, img);
    };
    // Trigger error handler if already broken
    if (img.complete && img.naturalWidth === 0) img.onerror();
  });

  /* ============================================================
     10. BACK TO TOP BUTTON
     ============================================================ */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("visible", window.scrollY > 600);
      },
      { passive: true },
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     11. CATALOGUE FORM feedback
     ============================================================ */
  const catalogueBtn = document.querySelector(".catalogue-form button");
  const catalogueInput = document.querySelector(".catalogue-form input");
  if (catalogueBtn && catalogueInput) {
    catalogueBtn.addEventListener("click", () => {
      const val = catalogueInput.value.trim();
      if (val && val.includes("@")) {
        catalogueBtn.textContent = String.fromCharCode(10003) + " Sent!";
        catalogueBtn.style.background = "var(--green)";
        catalogueInput.value = "";
        setTimeout(() => {
          catalogueBtn.textContent = "Request Catalogue";
          catalogueBtn.style.background = "";
        }, 3000);
      } else {
        catalogueInput.style.borderColor = "#e04444";
        catalogueInput.focus();
        setTimeout(() => (catalogueInput.style.borderColor = ""), 2000);
      }
    });
  }

  /* ============================================================
     12. CONTACT FORM validation feedback
     ============================================================ */
  const contactBtn = document.querySelector(".transform-form .btn-primary");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(
        ".transform-form input, .transform-form textarea",
      );
      let valid = true;
      inputs.forEach((inp) => {
        if (!inp.value.trim()) {
          inp.style.borderColor = "#e04444";
          valid = false;
          setTimeout(() => (inp.style.borderColor = ""), 2000);
        }
      });
      if (valid) {
        contactBtn.textContent =
          String.fromCharCode(10003) + " Quote Requested!";
        contactBtn.style.background = "var(--green)";
        inputs.forEach((inp) => (inp.value = ""));
        setTimeout(() => {
          contactBtn.textContent = "Request a Free Quote";
          contactBtn.style.background = "";
        }, 3500);
      }
    });
  }
}); // end DOMContentLoaded
