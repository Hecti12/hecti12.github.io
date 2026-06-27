const roles = [
  "IT Support Specialist",
  "Help Desk Analyst",
  "Desktop Support Technician",
  "Technical Support Analyst",
  "Windows & Microsoft 365 Troubleshooter",
  "Active Directory Support Lab Builder",
  "DNS & Network Troubleshooting Documenter",
  "Ticketing Workflow Problem Solver",
  "Endpoint & Hardware Support Technician",
  "Documentation-Focused IT Analyst",
  "Prompt Engineer",
  "AI Implementation Specialist",
  "Bilingual Technical Communicator",
];

const typedRole = document.querySelector("#typed-role");
const typedArticle = document.querySelector("#typed-article");
const sideNav = document.querySelector(".side-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".side-nav nav a");
let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeRole() {
  if (!typedRole) return;

  const currentRole = roles[roleIndex];
  if (typedArticle) {
    typedArticle.textContent = /^[aeiou]/i.test(currentRole) ? "An" : "A";
  }
  typedRole.textContent = currentRole.slice(0, letterIndex);

  if (!deleting && letterIndex < currentRole.length) {
    letterIndex += 1;
  } else if (!deleting && letterIndex === currentRole.length) {
    deleting = true;
    setTimeout(typeRole, 1250);
    return;
  } else if (deleting && letterIndex > 0) {
    letterIndex -= 1;
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, deleting ? 34 : 58);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = sideNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sideNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
);

document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
typeRole();

/* ---------- Scroll reveal ---------- */
// Tag additional blocks so they fade/slide in on scroll (project + skill cards are tagged in HTML).
document
  .querySelectorAll(
    ".section-heading, .about-grid > *, .timeline article, .analytics-card, .credential-grid article, .contact-cards a, .contact-section > div:first-of-type",
  )
  .forEach((el) => el.classList.add("reveal"));

// Stagger the cards within a grid so they "pop in" one after another.
const stagger = (selector, step) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * step, 360)}ms`;
  });
};
stagger("#project-grid .reveal", 90);
stagger(".skill-grid .reveal", 70);
stagger(".analytics-grid .reveal", 90);
stagger(".ai-grid .reveal", 90);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Project filtering ---------- */
const projFilters = document.querySelectorAll(".proj-filter");
const projCards = document.querySelectorAll("#project-grid .project-card");

projFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    projFilters.forEach((f) => {
      const active = f === btn;
      f.classList.toggle("is-active", active);
      f.setAttribute("aria-selected", String(active));
    });

    const filter = btn.dataset.filter;
    projCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !show);
    });
  });
});

/* ---------- Banner lightbox gallery ---------- */
// Clicking any banner opens an in-page gallery instead of a new browser tab.
// Visitors browse every banner with the arrows, keyboard, swipe, or thumbnails.
const galleryTriggers = Array.from(document.querySelectorAll(".banner-link, .pipeline-banner"));

if (galleryTriggers.length) {
  const slides = galleryTriggers.map((trigger) => {
    const img = trigger.matches("img") ? trigger : trigger.querySelector("img");
    const src = trigger.matches("a") ? trigger.getAttribute("href") : img.getAttribute("src");
    return { src, alt: img ? img.getAttribute("alt") || "" : "" };
  });

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.id = "banner-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Banner gallery");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="lb-close" type="button" aria-label="Close gallery"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>
    <button class="lb-nav lb-prev" type="button" aria-label="Previous banner"><span class="material-symbols-outlined" aria-hidden="true">chevron_left</span></button>
    <div class="lb-stage">
      <img class="lb-image" src="" alt="">
    </div>
    <button class="lb-nav lb-next" type="button" aria-label="Next banner"><span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></button>
    <p class="lb-caption"></p>
    <div class="lb-counter"><span class="lb-index">1</span> / <span class="lb-total">${slides.length}</span></div>
    <div class="lb-thumbs" aria-label="Banner thumbnails"></div>
  `;
  document.body.appendChild(lightbox);

  const lbStage = lightbox.querySelector(".lb-stage");
  const lbImage = lightbox.querySelector(".lb-image");
  const lbCaption = lightbox.querySelector(".lb-caption");
  const lbIndexLabel = lightbox.querySelector(".lb-index");
  const thumbsWrap = lightbox.querySelector(".lb-thumbs");

  const thumbs = slides.map((slide, i) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "lb-thumb";
    thumb.setAttribute("aria-label", `View banner ${i + 1} of ${slides.length}`);
    thumb.innerHTML = `<img src="${slide.src}" alt="" loading="lazy">`;
    thumb.addEventListener("click", () => show(i));
    thumbsWrap.appendChild(thumb);
    return thumb;
  });

  let current = 0;
  let lastFocused = null;

  function render() {
    const slide = slides[current];
    lbImage.setAttribute("src", slide.src);
    lbImage.setAttribute("alt", slide.alt);
    lbCaption.textContent = slide.alt;
    lbIndexLabel.textContent = String(current + 1);
    thumbs.forEach((thumb, i) => {
      const active = i === current;
      thumb.classList.toggle("is-active", active);
      thumb.setAttribute("aria-current", active ? "true" : "false");
      if (active) thumb.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }

  function show(i) {
    current = (i + slides.length) % slides.length;
    render();
  }

  function openAt(i) {
    lastFocused = document.activeElement;
    show(i);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");
    lightbox.querySelector(".lb-close").focus();
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  galleryTriggers.forEach((trigger, i) => {
    if (trigger.matches("img")) {
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openAt(i);
        }
      });
    }
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openAt(i);
    });
  });

  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => show(current + 1));

  // Click anywhere that isn't the image, a control, or a thumbnail closes.
  lightbox.addEventListener("click", (event) => {
    if (!event.target.closest(".lb-image, .lb-nav, .lb-close, .lb-thumb, .lb-caption, .lb-counter")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") show(current - 1);
    else if (event.key === "ArrowRight") show(current + 1);
  });

  // Swipe across the image (thumbnails keep their own horizontal scroll).
  let touchStartX = null;
  lbStage.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  lbStage.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
}
