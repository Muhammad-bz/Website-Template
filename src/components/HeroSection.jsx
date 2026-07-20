import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   SELARA — AUTOPLAY VIDEO · FREEZE ON END
   Text reveals at 3.5 s, stays visible after freeze
═══════════════════════════════════════════════ */

const DESKTOP_VIDEO = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549194/lv_0_20260720170213_osqfmo.mp4";
const MOBILE_VIDEO  = "https://res.cloudinary.com/leu4dssl/video/upload/v1784549196/lv_0_20260720170337_gpew9h.mp4";

const VIDEO_DURATION   = 4;     // seconds
const TEXT_REVEAL_TIME = 3.5;   // seconds — when text starts fading in
const TEXT_FADE_DUR    = 0.5;   // seconds — fade duration

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  .sh-section {
    position: relative;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
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
  }
  .sh-video-desktop { display: block; }
  .sh-video-mobile  { display: none;  }
  @media (max-width: 768px) {
    .sh-video-desktop { display: none;  }
    .sh-video-mobile  { display: block; }
  }

  /* Very subtle darkening so text pops on the bright creamy fabric */
  .sh-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.10) 0%,
      rgba(0,0,0,0.04) 40%,
      rgba(0,0,0,0.22) 100%
    );
    pointer-events: none;
  }

  /* Centered text block */
  .sh-content {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 24px;
    opacity: 0;
    transform: translateY(18px);
    will-change: opacity, transform;
    /* CSS transition handles the smooth reveal */
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .sh-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Brand name — dark charcoal so it reads on creamy/light video */
  .sh-logo {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 300;
    font-size: clamp(58px, 12vw, 140px);
    line-height: 1;
    letter-spacing: 0.20em;
    color: #1C1C1C;
    text-shadow: 0 1px 12px rgba(255,255,255,0.35);
    margin: 0 0 10px;
    user-select: none;
  }

  /* Tagline — directly below, slightly lighter */
  .sh-tagline {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(14px, 1.6vw, 20px);
    letter-spacing: 0.10em;
    color: rgba(28,28,28,0.72);
    margin: 0;
    user-select: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .sh-content {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }

  @media (max-width: 480px) {
    .sh-logo    { letter-spacing: 0.14em; }
    .sh-tagline { font-size: 14px; }
  }
`;

export default function HeroSection({ settings = {} }) {
  const desktopRef = useRef(null);
  const mobileRef  = useRef(null);
  const contentRef = useRef(null);
  const revealed   = useRef(false);

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

  /* Video setup */
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const active   = isMobile ? mobileRef.current : desktopRef.current;
    const inactive = isMobile ? desktopRef.current : mobileRef.current;

    if (!active) return;

    // Don't load the unused video at all
    if (inactive) {
      inactive.removeAttribute("src");
      inactive.load();
    }

    active.muted       = true;
    active.playsInline = true;

    const revealText = () => {
      if (revealed.current) return;
      revealed.current = true;
      contentRef.current?.classList.add("visible");
    };

    const onTimeUpdate = () => {
      // Reveal text at 3.5 s
      if (!revealed.current && active.currentTime >= TEXT_REVEAL_TIME) {
        revealText();
      }
    };

    const onEnded = () => {
      // Freeze on last frame — seek back just before end
      active.currentTime = VIDEO_DURATION - 0.01;
      active.pause();
      // Ensure text is visible even if timeupdate fired late
      revealText();
    };

    active.addEventListener("timeupdate", onTimeUpdate);
    active.addEventListener("ended", onEnded);

    const play = () => active.play().catch(() => {});
    if (active.readyState >= 3) {
      play();
    } else {
      active.addEventListener("canplay", play, { once: true });
    }

    return () => {
      active.removeEventListener("timeupdate", onTimeUpdate);
      active.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section className="sh-section" aria-label={`Welcome to ${storeName}`}>

      {/* Video */}
      <div className="sh-video-wrap" aria-hidden="true">
        <video
          ref={desktopRef}
          className="sh-video sh-video-desktop"
          src={DESKTOP_VIDEO}
          muted playsInline preload="auto"
          disablePictureInPicture disableRemotePlayback
        />
        <video
          ref={mobileRef}
          className="sh-video sh-video-mobile"
          src={MOBILE_VIDEO}
          muted playsInline preload="auto"
          disablePictureInPicture disableRemotePlayback
        />
      </div>

      {/* Subtle overlay */}
      <div className="sh-overlay" aria-hidden="true" />

      {/* Text — starts hidden, revealed at 3.5 s */}
      <div ref={contentRef} className="sh-content">
        <h1 className="sh-logo">{storeName}</h1>
        <p className="sh-tagline">A curated prêt experience</p>
      </div>

    </section>
  );
}
