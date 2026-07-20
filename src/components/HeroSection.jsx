import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   SELARA — SCROLL-SCRUBBED CINEMATIC HERO
   · Video currentTime driven by scroll progress
   · Text reveals at ~3.5 s mark in video
   · Pure RAF — no Framer Motion dependency
   · GPU-only transforms, no layout paint
═══════════════════════════════════════════════ */

const DESKTOP_VIDEO = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549194/lv_0_20260720170213_osqfmo.mp4";
const MOBILE_VIDEO  = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549196/lv_0_20260720170337_gpew9h.mp4";

// Total video duration (seconds). Scrub covers full clip.
const VIDEO_DURATION = 4;
// Scroll height multiplier — more = slower scrub feel
const SCROLL_FACTOR  = 4; // section = 4 × 100vh

// Text reveal: start fading in when video reaches this point (0–1 progress)
const TEXT_REVEAL_START = 3.5 / VIDEO_DURATION; // ≈ 0.875
const TEXT_REVEAL_END   = 1.0;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  /* ── Scroll container ───────────────────────── */
  .sh-outer {
    position: relative;
    /* tall so scroll gives us room to scrub */
    height: calc(100svh * ${SCROLL_FACTOR});
  }

  /* ── Sticky viewport ────────────────────────── */
  .sh-sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
  }

  /* ── Video layer ────────────────────────────── */
  .sh-video-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .sh-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .sh-video-desktop { display: block; }
  .sh-video-mobile  { display: none;  }
  @media (max-width: 768px) {
    .sh-video-desktop { display: none;  }
    .sh-video-mobile  { display: block; }
  }

  /* ── Gradient overlay ───────────────────────── */
  .sh-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom,
        rgba(10,8,6,0.28) 0%,
        rgba(10,8,6,0.08) 30%,
        rgba(10,8,6,0.14) 60%,
        rgba(10,8,6,0.72) 100%
      );
    pointer-events: none;
  }

  /* ── Text content ───────────────────────────── */
  .sh-content {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 24px 8vh;
    /* starts invisible; JS drives opacity + translateY */
    opacity: 0;
    transform: translateY(22px);
    will-change: opacity, transform;
  }

  .sh-logo {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    font-size: clamp(60px, 12.5vw, 144px);
    line-height: 0.9;
    letter-spacing: 0.18em;
    color: rgba(253,248,245,0.97);
    text-shadow: 0 2px 48px rgba(0,0,0,0.30);
    margin: 0 0 22px;
    user-select: none;
  }

  .sh-divider {
    width: 1px;
    height: 40px;
    background: rgba(242,196,206,0.60);
    margin: 0 auto 22px;
  }

  .sh-tagline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(15px, 1.7vw, 21px);
    letter-spacing: 0.07em;
    color: rgba(253,248,245,0.82);
    margin: 0;
    user-select: none;
  }

  /* ── Scroll hint (visible before first scrub) ── */
  .sh-hint {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.4s ease;
    will-change: opacity;
  }
  .sh-hint.hidden { opacity: 0; }
  .sh-hint-label {
    font-family: 'Jost', sans-serif;
    font-size: 7px;
    font-weight: 300;
    letter-spacing: 0.44em;
    text-transform: uppercase;
    color: rgba(242,196,206,0.50);
    user-select: none;
  }
  @keyframes sh-bob {
    0%, 100% { transform: rotate(45deg) translateY(0);   opacity: 0.50; }
    50%       { transform: rotate(45deg) translateY(5px); opacity: 0.25; }
  }
  .sh-hint-arrow {
    width: 13px;
    height: 13px;
    border-right: 0.5px solid rgba(242,196,206,0.50);
    border-bottom: 0.5px solid rgba(242,196,206,0.50);
    transform: rotate(45deg);
    animation: sh-bob 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .sh-content {
      opacity: 1 !important;
      transform: none !important;
    }
    .sh-hint-arrow { animation: none; }
  }

  @media (max-width: 480px) {
    .sh-divider  { height: 28px; margin-bottom: 18px; }
    .sh-hint     { bottom: 28px; }
  }
`;

// ── Clamp helper ──────────────────────────────
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function HeroSection({ settings = {} }) {
  const outerRef   = useRef(null);
  const desktopRef = useRef(null);
  const mobileRef  = useRef(null);
  const contentRef = useRef(null);
  const hintRef    = useRef(null);
  const rafRef     = useRef(null);
  const prevProg   = useRef(-1);

  const storeName = (settings.storeName || "SELARA").toUpperCase();

  /* Inject CSS once */
  useEffect(() => {
    if (!document.getElementById("sh-hero-css")) {
      const s = document.createElement("style");
      s.id = "sh-hero-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* Load video metadata (no autoplay) */
  useEffect(() => {
    [desktopRef, mobileRef].forEach(ref => {
      const v = ref.current;
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      v.pause();
      // Seek to frame 0 so poster frame is accurate
      const seek0 = () => { v.currentTime = 0; };
      if (v.readyState >= 1) seek0();
      else v.addEventListener("loadedmetadata", seek0, { once: true });
    });
  }, []);

  /* RAF scroll scrub */
  useEffect(() => {
    const activeVideo = () =>
      window.innerWidth > 768 ? desktopRef.current : mobileRef.current;

    const tick = () => {
      const outer = outerRef.current;
      if (!outer) return;

      // progress 0 → 1 over the full scroll height of the outer container
      const rect     = outer.getBoundingClientRect();
      const total    = outer.offsetHeight - window.innerHeight;
      const scrolled = -rect.top; // px scrolled past the outer's top
      const progress = clamp(scrolled / total, 0, 1);

      // Skip work if nothing changed (> 0.001 threshold)
      if (Math.abs(progress - prevProg.current) < 0.001) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      prevProg.current = progress;

      // ── Video scrub ──────────────────────────
      const v = activeVideo();
      if (v && v.readyState >= 1) {
        const target = progress * VIDEO_DURATION;
        // Only seek if delta > one frame (avoid unnecessary decode)
        if (Math.abs(v.currentTime - target) > 1 / 30) {
          v.currentTime = target;
        }
      }

      // ── Text reveal ──────────────────────────
      const content = contentRef.current;
      if (content) {
        // Normalised 0→1 over the reveal window
        const t = clamp(
          (progress - TEXT_REVEAL_START) / (TEXT_REVEAL_END - TEXT_REVEAL_START),
          0, 1
        );
        // Ease: smooth-step
        const eased = t * t * (3 - 2 * t);
        content.style.opacity   = eased;
        content.style.transform = `translateY(${(1 - eased) * 22}px)`;
      }

      // ── Scroll hint ──────────────────────────
      const hint = hintRef.current;
      if (hint) {
        hint.classList.toggle("hidden", progress > 0.05);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div ref={outerRef} className="sh-outer" aria-label={`Welcome to ${storeName}`}>
      <div className="sh-sticky">

        {/* ── Video ───────────────────────────── */}
        <div className="sh-video-wrap" aria-hidden="true">
          <video
            ref={desktopRef}
            className="sh-video sh-video-desktop"
            src={DESKTOP_VIDEO}
            muted
            playsInline
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
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
          />
        </div>

        {/* ── Overlay ─────────────────────────── */}
        <div className="sh-overlay" aria-hidden="true" />

        {/* ── Text (scroll-driven opacity/Y) ──── */}
        <div ref={contentRef} className="sh-content">
          <h1 className="sh-logo">{storeName}</h1>
          <div className="sh-divider" aria-hidden="true" />
          <p className="sh-tagline">A curated prêt experience</p>
        </div>

        {/* ── Scroll hint ─────────────────────── */}
        <div ref={hintRef} className="sh-hint" aria-hidden="true">
          <span className="sh-hint-label">Scroll</span>
          <span className="sh-hint-arrow" />
        </div>

      </div>
    </div>
  );
}
