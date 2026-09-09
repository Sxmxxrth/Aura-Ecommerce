/*
  =============================================
  SCROLL REVEAL COMPONENT (scroll-reveal.component.js)
  
  Lightweight high-performance scroll observer for luxury entrance animations.
  =============================================
*/

export class ScrollRevealComponent {
  static init() {
    // Add reveal styles dynamically if not in CSS
    if (!document.getElementById("scroll-reveal-styles")) {
      const style = document.createElement("style");
      style.id = "scroll-reveal-styles";
      style.textContent = `
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      });

      elements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      elements.forEach(el => el.classList.add("is-revealed"));
    }
  }
}
