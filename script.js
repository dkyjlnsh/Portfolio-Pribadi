document.addEventListener("DOMContentLoaded", () => {

  // ============================================
  // 1. LIGHT / DARK THEME FEATURE
  // ============================================
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  function setTheme(theme) {
    if (theme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      if (themeToggle) themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      if (themeToggle) themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }

  // ============================================
  // 2. TERMINAL TYPING EFFECT
  // ============================================
  const statusText = document.querySelector(".status-bar__text");
  const phrases = [
    "Mode aktif siap digunakan",
    "Status: Siap mempelajari hal baru",
    "Gelas kosong yang siap diisi..."
  ];
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!statusText) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      statusText.textContent = currentPhrase.substring(0, characterIndex - 1);
      characterIndex--;
    } else {
      statusText.textContent = currentPhrase.substring(0, characterIndex + 1);
      characterIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && characterIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // ============================================
  // 3. REAL-TIME DIGITAL CLOCK
  // ============================================
  const clockEl = document.getElementById("terminalClock");

  function updateTerminalClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  }
  updateTerminalClock();
  setInterval(updateTerminalClock, 1000);

  // ============================================
  // 4. SCROLL REVEAL ANIMATION (Intersection Observer)
  // ============================================
  const revealTargets = document.querySelectorAll(".section__title, .about__text, .skill-card, .project-card, .contact-form, .social-links");
  revealTargets.forEach((target) => target.classList.add("reveal-hidden"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  // ============================================
  // 5. 3D TILT CARD INTERACTION
  // ============================================
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect();
      const x = (e.clientX - cardRect.left) / cardRect.width - 0.5;
      const y = (e.clientY - cardRect.top) / cardRect.height - 0.5;

      const tiltX = (y * -12).toFixed(2);
      const tiltY = (x * 12).toFixed(2);

      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  // ============================================
  // 6. TERMINAL RIPPLE EFFECT ON BUTTONS
  // ============================================
  const buttons = document.querySelectorAll(".btn, .theme-toggle");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "btn__ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ============================================
  // 7. NAVBAR: Berubah saat di-scroll
  // ============================================
  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  // ============================================
  // 8. NAVBAR MOBILE: Hamburger menu
  // ============================================
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll(".navbar__link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ============================================
  // 9. SMOOTH SCROLL Anchor (#)
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ============================================
  // 10. VALIDASI FORM KONTAK + Pembersihan State Error
  // ============================================
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  function setError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + "Error");
    const field = document.getElementById(fieldId);
    if (!field || !errorEl) return;
    const group = field.closest(".form-group");
    errorEl.textContent = message;
    if (group) group.classList.toggle("has-error", Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form && successMsg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      successMsg.textContent = "";

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      let isValid = true;

      if (name === "") {
        setError("name", "Nama tidak boleh kosong.");
        isValid = false;
      } else {
        setError("name", "");
      }

      if (email === "") {
        setError("email", "Email tidak boleh kosong.");
        isValid = false;
      } else if (!isValidEmail(email)) {
        setError("email", "Format email tidak valid.");
        isValid = false;
      } else {
        setError("email", "");
      }

      if (message === "") {
        setError("message", "Pesan tidak boleh kosong.");
        isValid = false;
      } else {
        setError("message", "");
      }

      if (isValid) {
        successMsg.textContent = "Terima kasih! Pesan Anda telah terkirim.";
        form.reset();

        document.querySelectorAll(".form-group").forEach((group) => {
          group.classList.remove("has-error");
        });
      }
    });
  }

  // ============================================
  // 11. Tahun otomatis di footer
  // ============================================
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});