import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   SELARA — LOOPING VIDEO HERO
   · Cloudinary f_auto / q_auto / vc_auto for fastest delivery
   · Two video elements per breakpoint cross-fade for seamless loop
   · Desktop & mobile sources load independently
   · "Explore Collection" CTA fades in on load
   · Scroll drives subtle translateY + opacity on CTA only
   · GPU-only animations (transform / opacity) → 60 fps
═══════════════════════════════════════════════════════════════ */

/* ── Cloudinary helper ──────────────────────────────────────────
   Injects  f_auto,q_auto:good,vc_auto  between /upload/ and the
   version+filename so Cloudinary picks the optimal format (WebM
   for Chrome/Firefox, MP4 for Safari) and bitrate automatically.
   Also strips the raw .mp4 extension so Cloudinary can serve WebM.
──────────────────────────────────────────────────────────────── */
function clTransform(url, extra = "") {
  const transforms = ["f_auto", "q_auto:good", "vc_auto", extra]
    .filter(Boolean)
    .join(",");
  // Insert transforms after /upload/
  return url.replace(/\/upload\//, `/upload/${transforms}/`).replace(/\.mp4$/, "");
}

const RAW_DESKTOP = "https://res.cloudinary.com/leu4dssl/video/upload/v1784560874/lv_0_20260720200946_gixtzz.mp4";
const RAW_MOBILE  = "https://res.cloudinary.com/leu4dssl/video/upload/v1784560875/lv_0_20260720201931_qinoye.mp4";

const DESKTOP_VIDEO = clTransform(RAW_DESKTOP);
const MOBILE_VIDEO  = clTransform(RAW_MOBILE);

/* How many seconds before the end to start the crossfade */
const CROSSFADE_START = 1.2; // seconds
const CROSSFADE_DURATION_MS = 900; // ms

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

  /* ── Section ─────────────────────────────────── */
  .sh-section {
    position: relative;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
    background: #f0e8e0;
  }

  /* ── Video layer ─────────────────────────────── */
  .sh-video-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
    will-change: transform;
  }

  /* Both video slots sit on top of each other */
  .sh-slot {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .sh-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: translateZ(0);
    /* transition drives the crossfade */
    transition: opacity ${CROSSFADE_DURATION_MS}ms ease;
  }

  /* Slot A starts visible, Slot B starts invisible */
  .sh-slot-a { z-index: 1; }
  .sh-slot-b { z-index: 2; opacity: 0; }

  .sh-video-desktop { display: block; }
  .sh-video-mobile  { display: none;  }

  @media (max-width: 768px) {
    .sh-video-desktop { display: none;  }
    .sh-video-mobile  { display: block; }
  }

  /* ── Overlay ─────────────────────────────────── */
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
    z-index: 3;
  }

  /* ── CTA wrapper ─────────────────────────────── */
  .sh-cta-wrap {
    position: absolute;
    bottom: 9%;
    left: 0;
    right: 0;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    will-change: opacity, transform;
  }

  @keyframes sh-rise {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
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
    opacity: 0;
    animation: sh-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
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
  .sh-cta:active { transform: scale(0.985); }

  /* ── Mobile tweaks ───────────────────────────── */
  @media (max-width: 768px) {
    .sh-cta-wrap { bottom: 10%; }
    .sh-cta {
      font-size: 11px;
      letter-spacing: 0.24em;
      padding: 13px 34px;
    }
  }

  /* ── Reduced-motion overrides ────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .sh-cta { animation: none; opacity: 1; }
    .sh-cta-wrap { will-change: auto; }
    .sh-video { transition: none; }
  }
`;

/* ── Crossfade loop controller ──────────────────────────────────
   slotA / slotB are the two <video> elements for one breakpoint.
   They leapfrog: while A is playing near the end, B starts from 0
   and fades in. Then B becomes the "active" slot, and we swap.
──────────────────────────────────────────────────────────────── */
function setupCrossfadeLoop(slotA, slotB) {
  let active   = slotA;   // currently visible
  let standby  = slotB;   // hidden, ready to swap in
  let swapping = false;
  let timerId  = null;

  /* z-index: active on top during fade, then swap */
  slotA.style.opacity = "1";
  slotB.style.opacity = "0";
  slotA.parentElement.querySelector(".sh-slot-a").style.zIndex = "2";
  slotA.parentElement.querySelector(".sh-slot-b").style.zIndex = "1";

  function doSwap() {
    if (swapping) return;
    swapping = true;

    // Cue standby from the start and play
    standby.currentTime = 0;
    standby.play().catch(() => {});

    // Fade standby in (it's already at z-index below, so we raise it first)
    standby.parentElement.style.zIndex =
      standby === slotA ? "2" : "1"; // handled via CSS classes instead:
    // Simpler: just set opacity on both
    standby.style.opacity = "1";

    // After the crossfade completes, hide the old active and reset
    timerId = setTimeout(() => {
      active.pause();
      active.currentTime = 0;
      active.style.opacity = "0";

      // Swap roles
      [active, standby] = [standby, active];
      swapping = false;
    }, CROSSFADE_DURATION_MS);
  }

  function onTimeUpdate() {
    if (swapping) return;
    const remaining = active.duration - active.currentTime;
    if (!isNaN(remaining) && remaining <= CROSSFADE_START) {
      doSwap();
    }
  }

  active.addEventListener("timeupdate", onTimeUpdate);

  // After role swap we need the new active to also fire timeupdate
  // We achieve this by always listening on both elements
  standby.addEventListener("timeupdate", function handler() {
    // Once standby becomes active its timeupdate drives the next swap
    if (active === standby) {
      // Already re-assigned above — but the listener is on the element.
      // Since we swap [active,standby] after CROSSFADE_DURATION_MS
      // both elements already have listeners; no extra binding needed.
    }
  });

  return () => {
    clearTimeout(timerId);
    active.removeEventListener("timeupdate", onTimeUpdate);
  };
}

export default function HeroSection({ settings = {} }) {
  // Two slots per breakpoint for the crossfade
  const desktopARef = useRef(null);
  const desktopBRef = useRef(null);
  const mobileARef  = useRef(null);
  const mobileBRef  = useRef(null);

  const ctaWrapRef  = useRef(null);
  const rafRef      = useRef(null);
  const sectionRef  = useRef(null);

  /* ── Inject CSS once ────────────────────────── */
  useEffect(() => {
    if (!document.getElementById("sh-hero-css-v3")) {
      const s = document.createElement("style");
      s.id = "sh-hero-css-v3";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* ── Video setup ────────────────────────────── */
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    const activeA   = isMobile ? mobileARef.current  : desktopARef.current;
    const activeB   = isMobile ? mobileBRef.current  : desktopBRef.current;
    const inactiveA = isMobile ? desktopARef.current : mobileARef.current;
    const inactiveB = isMobile ? desktopBRef.current : mobileBRef.current;

    if (!activeA || !activeB) return;

    // Drop the unused breakpoint's src entirely
    [inactiveA, inactiveB].forEach(v => {
      if (v) { v.removeAttribute("src"); v.load(); }
    });

    // Prep both active slots
    [activeA, activeB].forEach(v => {
      v.muted       = true;
      v.playsInline = true;
      v.loop        = false; // we handle looping manually
    });

    // Start slot A
    const tryPlay = () => activeA.play().catch(() => {});
    if (activeA.readyState >= 3) {
      tryPlay();
    } else {
      activeA.addEventListener("canplay", tryPlay, { once: true });
    }

    // Preload slot B silently (just metadata + a bit of buffer)
    activeB.preload = "auto";

    const cleanup = setupCrossfadeLoop(activeA, activeB);

    return () => {
      cleanup();
      activeA.pause();
      activeB.pause();
    };
  }, []);

  /* ── Scroll parallax on CTA only ────────────── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const ctaWrap = ctaWrapRef.current;
    if (!section || !ctaWrap) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const viewH    = window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / viewH));
        const yShift   = progress * 55;
        const opacity  = Math.max(0, 1 - progress * 2.2);

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
        {/* Desktop — two slots for crossfade */}
        <div className="sh-slot sh-slot-a">
          <video
            ref={desktopARef}
            className="sh-video sh-video-desktop"
            src={DESKTOP_VIDEO}
            muted playsInline preload="auto"
            disablePictureInPicture disableRemotePlayback
          />
          <video
            ref={mobileARef}
            className="sh-video sh-video-mobile"
            src={MOBILE_VIDEO}
            muted playsInline preload="auto"
            disablePictureInPicture disableRemotePlayback
          />
        </div>

        {/* Standby slot — fades in on each loop */}
        <div className="sh-slot sh-slot-b">
          <video
            ref={desktopBRef}
            className="sh-video sh-video-desktop"
            src={DESKTOP_VIDEO}
            muted playsInline preload="auto"
            disablePictureInPicture disableRemotePlayback
          />
          <video
            ref={mobileBRef}
            className="sh-video sh-video-mobile"
            src={MOBILE_VIDEO}
            muted playsInline preload="auto"
            disablePictureInPicture disableRemotePlayback
          />
        </div>
      </div>

      {/* ── Gradient overlay ─────────────────────── */}
      <div className="sh-overlay" aria-hidden="true" />

      {/* ── CTA ──────────────────────────────────── */}
      <div ref={ctaWrapRef} className="sh-cta-wrap">
        <button
          className="sh-cta"
          onClick={() => {
            const products =
              document.getElementById("products") ||
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
