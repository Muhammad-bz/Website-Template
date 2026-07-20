import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   SELARA — LOOPING VIDEO HERO
   · Desktop & mobile videos load independently
   · No text overlay — branding lives inside the video
   · "Explore Collection" CTA fades in on load
   · Scroll drives subtle translateY + opacity on CTA only
   · GPU-only animations (transform / opacity) → 60 fps
═══════════════════════════════════════════════════════════════ */

const DESKTOP_VIDEO =
  "https://res.cloudinary.com/leu4dssl/video/upload/v1784560874/lv_0_20260720200946_gixtzz.mp4";
const MOBILE_VIDEO =
  "https://res.cloudinary.com/leu4dssl/video/upload/v1784560875/lv_0_20260720201931_qinoye.mp4";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

  /* ── Section ─────────────────────────────────── */
  .sh-section {
    position: relative;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
    background: #f0e8e0; /* fallback while video loads */
  }

  /* ── Video layer ─────────────────────────────── */
  .sh-video-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
    will-change: transform; /* promote to own compositor layer */
  }
  .sh-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    /* GPU decode hint */
    transform: translateZ(0);
  }
  .sh-video-desktop { display: block; }
  .sh-video-mobile  { display: none;  }

  @media (max-width: 768px) {
    .sh-video-desktop { display: none;  }
    .sh-video-mobile  { display: block; }
  }

  /* ── Overlay — ultra-light so branding reads ─── */
  .sh-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.06) 0%,
      rgba(0,0,0,0.00) 35%,
      rgba(0,0,0,0.18) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* ── CTA wrapper ─────────────────────────────── */
  .sh-cta-wrap {
    position: absolute;
    bottom: 9%;
    left: 0;
    right: 0;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none; /* let clicks pass through to video beneath */
    will-change: opacity, transform;
  }

  /* ── Entrance keyframe ───────────────────────── */
  @keyframes sh-rise {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── CTA button ──────────────────────────────── */
  .sh-cta {
    pointer-events: auto;
    display: inline-block;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: clamp(11px, 1.1vw, 13px);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #1c1c1c;
    background: rgba(240, 232, 224, 0.72);
    border: 1px solid rgba(90, 60, 45, 0.30);
    padding: 14px 40px;
    cursor: pointer;
    /* Entrance — starts hidden, animates in after 0.4 s */
    opacity: 0;
    animation: sh-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
    /* Hover */
    transition:
      background 0.35s ease,
      border-color 0.35s ease,
      color 0.35s ease,
      letter-spacing 0.35s ease;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    white-space: nowrap;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
  }
  .sh-cta:hover,
  .sh-cta:focus-visible {
    background: rgba(255, 248, 243, 0.90);
    border-color: rgba(90, 60, 45, 0.55);
    letter-spacing: 0.34em;
    outline: none;
  }
  .sh-cta:focus-visible {
    outline: 2px solid rgba(90,60,45,0.5);
    outline-offset: 3px;
  }
  .sh-cta:active {
    transform: scale(0.985);
  }

  /* ── Mobile tweaks ───────────────────────────── */
  @media (max-width: 768px) {
    .sh-cta-wrap {
      bottom: 10%;
    }
    .sh-cta {
      font-size: 11px;
      letter-spacing: 0.24em;
      padding: 13px 34px;
    }
  }

  /* ── Reduced-motion overrides ────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .sh-cta {
      animation: none;
      opacity: 1;
    }
    .sh-cta-wrap {
      will-change: auto;
    }
  }
`;

export default function HeroSection({ settings = {} }) {
  const desktopRef = useRef(null);
  const mobileRef  = useRef(null);
  const ctaWrapRef = useRef(null);
  const rafRef     = useRef(null);
  const sectionRef = useRef(null);

  /* ── Inject CSS once ────────────────────────── */
  useEffect(() => {
    if (!document.getElementById("sh-hero-css-v2")) {
      const s = document.createElement("style");
      s.id = "sh-hero-css-v2";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* ── Video setup — load only the active video ── */
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const active   = isMobile ? mobileRef.current : desktopRef.current;
    const inactive = isMobile ? desktopRef.current : mobileRef.current;

    if (!active) return;

    /* Strip the unused video's src so the browser never fetches it */
    if (inactive) {
      inactive.removeAttribute("src");
      inactive.load();
    }

    active.muted       = true;
    active.playsInline = true;
    active.loop        = true;

    const tryPlay = () => active.play().catch(() => {});

    if (active.readyState >= 3) {
      tryPlay();
    } else {
      active.addEventListener("canplay", tryPlay, { once: true });
    }

    /* No cleanup needed — video loops forever until unmount */
    return () => {
      active.pause();
    };
  }, []);

  /* ── Scroll parallax on CTA only ────────────── */
  useEffect(() => {
    /* Skip on reduced-motion preference */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const ctaWrap = ctaWrapRef.current;
    if (!section || !ctaWrap) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        const rect      = section.getBoundingClientRect();
        const viewH     = window.innerHeight;
        /* progress: 0 = hero fully visible, 1 = hero scrolled out of view */
        const progress  = Math.max(0, Math.min(1, -rect.top / viewH));

        /* Gentle drift — capped so button doesn't disappear too aggressively */
        const yShift    = progress * 55;           /* px up */
        const opacity   = Math.max(0, 1 - progress * 2.2);

        ctaWrap.style.transform = `translateY(-${yShift}px)`;
        ctaWrap.style.opacity   = opacity;

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const storeName = settings.storeName || "Selara";

  return (
    <section
      ref={sectionRef}
      className="sh-section"
      aria-label={`Welcome to ${storeName}`}
    >
      {/* ── Video background ─────────────────────── */}
      <div className="sh-video-wrap" aria-hidden="true">
        <video
          ref={desktopRef}
          className="sh-video sh-video-desktop"
          src={DESKTOP_VIDEO}
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />
        <video
          ref={mobileRef}
          className="sh-video sh-video-mobile"
          src={MOBILE_VIDEO}
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>

      {/* ── Subtle gradient overlay ───────────────── */}
      <div className="sh-overlay" aria-hidden="true" />

      {/* ── CTA — outside video, scroll-parallaxed ── */}
      <div ref={ctaWrapRef} className="sh-cta-wrap">
        <button
          className="sh-cta"
          onClick={() => {
            const products = document.getElementById("products") ||
                             document.querySelector("[data-section='products']") ||
                             document.querySelector("main > section:nth-child(2)");
            if (products) {
              products.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollBy({ top: window.innerHeight * 0.92, behavior: "smooth" });
            }
          }}
        >
          Explore Collection
        </button>
      </div>
    </section>
  );
}
