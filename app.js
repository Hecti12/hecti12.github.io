const roles = [
  "IT support analyst",
  "help desk candidate",
  "business analytics translator",
  "Azure and Active Directory learner",
  "bilingual technical communicator",
];

const typedRole = document.querySelector("#typed-role");
const sideNav = document.querySelector(".side-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".side-nav nav a");
let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeRole() {
  if (!typedRole) return;

  const currentRole = roles[roleIndex];
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
