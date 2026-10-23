const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

const portfolioIntro = document.querySelector("#portfolio-intro");
if (portfolioIntro) {
  const enterButton = portfolioIntro.querySelector(".intro-enter");
  const backgroundContent = [
    document.querySelector(".skip-link"),
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
  ].filter(Boolean);
  let isEntering = false;

  document.body.classList.add("portfolio-intro-open");
  backgroundContent.forEach((element) => element.setAttribute("inert", ""));

  const enterPortfolio = () => {
    if (isEntering) return;
    isEntering = true;

    portfolioIntro.classList.add("is-leaving");
    document.documentElement.classList.remove("portfolio-intro-pending");
    document.body.classList.remove("portfolio-intro-open");
    backgroundContent.forEach((element) => element.removeAttribute("inert"));
    document.querySelector("#hero-title")?.focus({ preventScroll: true });

    window.setTimeout(() => portfolioIntro.remove(), 700);
  };

  enterButton?.addEventListener("click", enterPortfolio);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !isEntering) enterPortfolio();
  });
  window.requestAnimationFrame(() => enterButton?.focus({ preventScroll: true }));
}

const heroSection = document.querySelector(".hero");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (heroSection && !motionPreference.matches) {
  heroSection.classList.add("hero-motion-ready");

  if (finePointer.matches) {
    let pointerX = 0;
    let pointerY = 0;
    let parallaxFrame = 0;

    function applyParallax() {
      if (parallaxFrame) return;
      parallaxFrame = window.requestAnimationFrame(() => {
        heroSection.style.setProperty("--pointer-x", `${pointerX.toFixed(1)}px`);
        heroSection.style.setProperty("--pointer-y", `${pointerY.toFixed(1)}px`);
        parallaxFrame = 0;
      });
    }

    heroSection.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = heroSection.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
      applyParallax();
    }, { passive: true });

    heroSection.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      applyParallax();
    }, { passive: true });
  }
}

const revealTargets = document.querySelectorAll(
  ".section-kicker, .about-copy, .fact, .section-heading-row, .timeline-item, .credential-card, .skill-panel, .project-card, .contact-layout > div"
);

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
    revealObserver.observe(element);
  });
  document.body.classList.add("motion-ready");
}

function closeMobileNav() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mobileNav.hidden = true;
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
