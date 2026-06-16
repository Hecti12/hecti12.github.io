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
