const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

const portfolioIntro = document.querySelector("#portfolio-intro");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let portfolioAnimationsStarted = false;
if (portfolioIntro) {
  const enterButton = portfolioIntro.querySelector(".intro-enter");
  const introMessage = portfolioIntro.querySelector("#intro-message");
  const backgroundContent = [
    document.querySelector(".skip-link"),
    document.querySelector(".site-header"),
    document.querySelector("main"),
    document.querySelector(".site-footer")
  ].filter(Boolean);
  let isEntering = false;
  let introTimer;
  let autoEnterTimer;

  document.body.classList.add("portfolio-intro-open");
  backgroundContent.forEach((element) => element.setAttribute("inert", ""));

  const finishIntro = () => {
    if (portfolioIntro.classList.contains("is-leaving")) return;
    window.clearTimeout(introTimer);
    portfolioIntro.classList.add("is-leaving");
    document.documentElement.classList.remove("portfolio-intro-pending");
    document.body.classList.remove("portfolio-intro-open");
    document.body.classList.add("portfolio-entered");
    backgroundContent.forEach((element) => element.removeAttribute("inert"));
    startPortfolioAnimations();
    document.querySelector("#hero-title")?.focus({ preventScroll: true });

    window.setTimeout(() => portfolioIntro.remove(), 700);
  };

  const enterPortfolio = () => {
    if (isEntering) return;
    window.clearTimeout(autoEnterTimer);
    isEntering = true;
    introMessage?.removeAttribute("aria-hidden");
    portfolioIntro.classList.add("is-introducing");
    enterButton?.setAttribute("aria-label", "Introduction displayed. Press Escape to continue now.");

    // Pause briefly after the introduction before the hero quote builds.
    introTimer = window.setTimeout(finishIntro, 3600);
  };

  enterButton?.addEventListener("click", enterPortfolio);
  autoEnterTimer = window.setTimeout(enterPortfolio, 1500);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (isEntering) finishIntro();
    else enterPortfolio();
  });
  window.requestAnimationFrame(() => enterButton?.focus({ preventScroll: true }));
}

const heroSection = document.querySelector(".hero");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const revealTargets = document.querySelectorAll(
  ".section-kicker, .section-heading-row, .timeline-item, .credential-card, .skill-panel, .project-card, .contact-layout > div"
);

function startPortfolioAnimations() {
  if (portfolioAnimationsStarted) return;
  portfolioAnimationsStarted = true;

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
      element.style.setProperty("--reveal-delay", `${(index % 4) * 105}ms`);
      revealObserver.observe(element);
    });

    const aboutSection = document.querySelector(".about-section");
    if (aboutSection) {
      aboutSection.classList.add("about-sequence-ready");
      const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const aboutTitle = aboutSection.querySelector("#about-title");
          if (aboutTitle) {
            const titleBounds = aboutTitle.getBoundingClientRect();
            aboutSection.style.setProperty("--about-center-x", `${window.innerWidth / 2 - (titleBounds.left + titleBounds.width / 2)}px`);
            aboutSection.style.setProperty("--about-center-y", `${window.innerHeight / 2 - (titleBounds.top + titleBounds.height / 2)}px`);
          }
          aboutSection.classList.add("about-quote-visible", "about-quote-centered");
          observer.unobserve(entry.target);
          window.setTimeout(() => {
            aboutSection.classList.remove("about-quote-centered");
            aboutSection.classList.add("about-quote-moving");
            window.setTimeout(() => {
              aboutSection.classList.remove("about-quote-moving");
              aboutSection.classList.add("about-details-visible");
            }, 900);
          }, 3100);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
      aboutObserver.observe(aboutSection);
    }

    document.body.classList.add("motion-ready");
  }
}

if (!portfolioIntro) startPortfolioAnimations();

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
