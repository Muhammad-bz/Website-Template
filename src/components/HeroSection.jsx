import React, { useCallback, useEffect, useRef } from "react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   HERO SECTION — SELARA PREMIUM FASHION
   Video hero · centered · cinematic
═══════════════════════════════════════════════ */

const DESKTOP_VIDEO = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549194/lv_0_20260720170213_osqfmo.mp4";
const MOBILE_VIDEO  = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549196/lv_0_20260720170337_gpew9h.mp4";

const SELARA_HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  @keyframes sh-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sh-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes sh-growLine {
    from { transform: scaleY(0); opacity: 0; }
    to   { transform: scaleY(1); opacity: 0.45; }
  }
  @keyframes sh-scrollBob {
    0%, 100% { transform: translateY(0); opacity: 0.45; }
    50%       { transform: translateY(6px); opacity: 0.22; }
  }

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
    will-change: transform;
  }
  /* Show/hide by breakpoint — no JS media query needed */
  .sh-video-desktop { display: block; }
  .sh-video-mobile  { display: none;  }
  @media (max-width: 768px) {
    .sh-video-desktop { display: none;  }
    .sh-video-mobile  { display: block; }
  }

  .sh-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom,
        rgba(15,12,10,0.30) 0%,
        rgba(15,12,10,0.10) 35%,
        rgba(15,12,10,0.18) 65%,
        rgba(15,12,10,0.62) 100%
      );
    pointer-events: none;
  }

  .sh-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 24px;
    /* Subtle upward offset so text reads as vertically centered with scroll room */
    padding-bottom: 6vh;
  }

  .sh-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: clamp(8px, 0.72vw, 10px);
    font-weight: 300;
    letter-spacing: 0.50em;
    text-transform: uppercase;
    color: rgba(242,196,206,0.65);
    margin: 0 0 28px;
    animation: sh-fadeIn 1.2s ease 0.6s both;
  }

  .sh-logo {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    font-size: clamp(64px, 13vw, 148px);
    line-height: 0.88;
    letter-spacing: 0.18em;
    color: rgba(253,248,245,0.97);
    text-shadow: 0 4px 80px rgba(0,0,0,0.25);
    margin: 0 0 28px;
    animation: sh-fadeUp 1.2s cubic-bezier(0.22,0.61,0.36,1) 0.2s both;
    user-select: none;
  }

  .sh-divider {
    width: 1px;
    height: 44px;
    background: rgba(242,196,206,0.55);
    margin: 0 auto 28px;
    transform-origin: top;
    animation: sh-growLine 0.8s ease 0.9s both;
  }

  .sh-tagline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(15px, 1.8vw, 22px);
    letter-spacing: 0.06em;
    color: rgba(253,248,245,0.70);
    margin: 0;
    animation: sh-fadeUp 1.2s cubic-bezier(0.22,0.61,0.36,1) 1.0s both;
    user-select: none;
  }

  /* Scroll arrow */
  .sh-scroll {
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
    animation: sh-fadeIn 1s ease 2.0s both;
  }
  .sh-scroll-label {
    font-family: 'Jost', sans-serif;
    font-size: 7px;
    font-weight: 300;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: rgba(242,196,206,0.45);
    user-select: none;
  }
  .sh-scroll-arrow {
    width: 14px;
    height: 14px;
    border-right: 0.5px solid rgba(242,196,206,0.45);
    border-bottom: 0.5px solid rgba(242,196,206,0.45);
    transform: rotate(45deg);
    animation: sh-scrollBob 2.2s ease-in-out 2.2s infinite;
  }

  /* Reduced-motion: disable all animation */
  @media (prefers-reduced-motion: reduce) {
    .sh-logo, .sh-eyebrow, .sh-divider, .sh-tagline,
    .sh-scroll, .sh-scroll-arrow {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .sh-divider { transform-origin: top; transform: scaleY(1); opacity: 0.45; }
  }

  /* Mobile tweaks */
  @media (max-width: 480px) {
    .sh-eyebrow  { letter-spacing: 0.38em; margin-bottom: 20px; }
    .sh-divider  { height: 32px; margin-bottom: 20px; }
    .sh-tagline  { font-size: 15px; letter-spacing: 0.04em; }
    .sh-scroll   { bottom: 28px; }
  }
`;

export default function HeroSection({ settings = {} }) {
  const desktopRef = useRef(null);
  const mobileRef  = useRef(null);

  /* Ensure autoplay on mobile — must be muted */
  useEffect(() => {
    [desktopRef, mobileRef].forEach(ref => {
      const v = ref.current;
      if (!v) return;
      v.muted = true;
      v.playsInline = true;
      const play = () => v.play().catch(() => {});
      if (v.readyState >= 1) { play(); }
      else { v.addEventListener("loadedmetadata", play, { once: true }); }
    });
  }, []);

  /* Inject CSS once */
  useEffect(() => {
    if (!document.getElementById("selara-hero-css")) {
      const s = document.createElement("style");
      s.id = "selara-hero-css";
      s.textContent = SELARA_HERO_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const storeName = settings.storeName || "SELARA";

  return (
    <section
      style={{ position: "relative", height: "100svh", minHeight: 560, overflow: "hidden" }}
      aria-label={`Welcome to ${storeName}`}
    >
      {/* ── Video layer ───────────────────────────── */}
      <div className="sh-video-wrap" aria-hidden="true">

        {/* Desktop video */}
        <video
          ref={desktopRef}
          className="sh-video sh-video-desktop"
          src={DESKTOP_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
        />

        {/* Mobile video */}
        <video
          ref={mobileRef}
          className="sh-video sh-video-mobile"
          src={MOBILE_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>

      {/* ── Gradient overlay ──────────────────────── */}
      <div className="sh-overlay" aria-hidden="true" />

      {/* ── Centered text content ─────────────────── */}
      <div className="sh-content">
        <p className="sh-eyebrow" aria-hidden="true">
          New Collection · 2026
        </p>

        <h1 className="sh-logo">
          {storeName.toUpperCase()}
        </h1>

        <div className="sh-divider" aria-hidden="true" />

        <p className="sh-tagline">
          A curated prêt experience
        </p>
      </div>

      {/* ── Scroll indicator ──────────────────────── */}
      <div className="sh-scroll" aria-hidden="true">
        <span className="sh-scroll-label">Scroll</span>
        <span className="sh-scroll-arrow" />
      </div>
    </section>
  );
}
