const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const revealItems = document.querySelectorAll(".reveal");

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  navMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 14);
};

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -44px 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 30, 180)}ms`;
  revealObserver.observe(item);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    const headerOffset = header.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

const fallbackPalette = [
  ["#070707", "#d6ad5f"],
  ["#171717", "#f0d28a"],
  ["#0f0f0f", "#9f7a35"],
  ["#24211b", "#d6ad5f"],
];

const createFallbackImage = (label, index) => {
  const [start, end] = fallbackPalette[index % fallbackPalette.length];
  const safeLabel = (label || "Fio Navalha")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
        <radialGradient id="light" cx="22%" cy="15%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".16"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="900" height="620" fill="url(#g)"/>
      <rect width="900" height="620" fill="url(#light)"/>
      <path d="M80 540L820 80" stroke="#f0d28a" stroke-width="2" opacity=".24"/>
      <circle cx="740" cy="130" r="160" fill="#fff" opacity=".08"/>
      <text x="64" y="96" fill="#f0d28a" font-family="Arial, sans-serif" font-size="28" font-weight="900">FIO NAVALHA</text>
      <text x="64" y="342" fill="#f8f5ef" font-family="Impact, Arial Black, sans-serif" font-size="68">${safeLabel}</text>
      <text x="64" y="405" fill="#f8f5ef" opacity=".78" font-family="Arial, sans-serif" font-size="28" font-weight="700">Barbearia Premium</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

document.querySelectorAll("img").forEach((image, index) => {
  const applyFallback = () => {
    image.src = createFallbackImage(image.alt, index);
    image.classList.add("image-fallback");
  };

  image.addEventListener("error", applyFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    applyFallback();
  }
});
