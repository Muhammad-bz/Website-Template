import React, { useCallback, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, IMG } from "../constants/theme";

/* ═══════════════════════════════════════════════
   HERO SECTION — SELARA PREMIUM FASHION
═══════════════════════════════════════════════ */

const SELARA_HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  @keyframes selara-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes selara-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes selara-growLine {
    from { height: 0; opacity: 0; }
    to   { height: 52px; opacity: 1; }
  }

  .selara-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Jost', sans-serif;
    font-size: 9.5px;
    font-weight: 400;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 15px 38px;
    transition: background 0.32s ease, color 0.32s ease, border-color 0.32s ease;
    white-space: nowrap;
  }

  .selara-btn-primary {
    background: rgba(250,246,239,0.96);
    color: #0A0806;
    border: 1px solid rgba(250,246,239,0.96);
  }
  .selara-btn-primary:hover {
    background: transparent;
    color: rgba(250,246,239,0.96);
  }

  .selara-btn-ghost {
    background: transparent;
    color: rgba(250,246,239,0.65);
    border: 1px solid rgba(250,246,239,0.22);
  }
  .selara-btn-ghost:hover {
    color: rgba(250,246,239,0.95);
    border-color: rgba(250,246,239,0.55);
  }
`;

export default function HeroSection({ settings = {} }) {
  const scrollToShop = useCallback(() =>
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" }),
  []);

  useEffect(() => {
    if (!document.getElementById("selara-hero-css")) {
      const style = document.createElement("style");
      style.id = "selara-hero-css";
      style.textContent = SELARA_HERO_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section
      style={{ position: "relative", height: "100vh", minHeight: 560, overflow: "hidden" }}
      aria-label={`Welcome to ${settings.storeName || "Selara"}`}
    >
      {/* Background image */}
      <img
        src={settings.heroBannerUrl || IMG.hero}
        alt={`${settings.storeName || "Selara"} hero`}
        fetchPriority="high"
        decoding="sync"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          userSelect: "none", pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* Left-weighted vignette — lets photo breathe on the right */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `
          linear-gradient(to right,  rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.28) 52%, rgba(10,8,6,0.42) 100%),
          linear-gradient(to bottom, rgba(10,8,6,0.30) 0%, rgba(10,8,6,0.05) 40%, rgba(10,8,6,0.62) 100%)
        `,
        pointerEvents: "none",
      }} />

      {/* Vertical season label — right edge, editorial detail */}
      <div aria-hidden="true" style={{
        position: "absolute", right: 32, top: "50%",
        transform: "translateY(-50%) rotate(90deg)",
        fontFamily: "'Jost', sans-serif",
        fontSize: 8,
        letterSpacing: "0.38em",
        textTransform: "uppercase",
        color: "rgba(250,246,239,0.28)",
        zIndex: 3,
        whiteSpace: "nowrap",
        animation: "selara-fadeIn 1s ease 1.4s both",
        userSelect: "none",
      }}>
        New Collection · 2026
      </div>

      {/* Main content — bottom-left editorial anchor */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "0 7% 9%",
        maxWidth: 820,
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "clamp(8px, 0.82vw, 10px)",
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          color: "rgba(250,246,239,0.48)",
          marginBottom: 26,
          animation: "selara-fadeUp 0.9s ease 0.10s both",
        }}>
          {settings.tagline || "Premium Fashion · New Arrivals"}
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(54px, 9.8vw, 118px)",
          lineHeight: 0.87,
          color: "rgba(250,246,239,0.97)",
          letterSpacing: "0.07em",
          marginBottom: 26,
          textShadow: "0 2px 48px rgba(0,0,0,0.38)",
          animation: "selara-fadeUp 0.9s ease 0.22s both",
        }}>
          {(settings.storeName || "SELARA").toUpperCase()}
        </h1>

        {/* Hairline rule */}
        <div style={{
          width: 40,
          height: "0.5px",
          background: "rgba(250,246,239,0.38)",
          marginBottom: 22,
          animation: "selara-fadeIn 0.9s ease 0.38s both",
        }} />

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(16px, 1.9vw, 23px)",
          color: "rgba(250,246,239,0.65)",
          letterSpacing: "0.04em",
          lineHeight: 1.45,
          marginBottom: 46,
          maxWidth: 440,
          animation: "selara-fadeUp 0.9s ease 0.34s both",
        }}>
          {settings.heroSubtitle || "Discover the new collection — where craft meets the contemporary."}
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          animation: "selara-fadeUp 0.9s ease 0.50s both",
        }}>
          <button
            className="selara-btn selara-btn-primary"
            onClick={scrollToShop}
          >
            Shop Now <ArrowRight size={11} />
          </button>
          <button
            className="selara-btn selara-btn-ghost"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll indicator — vertical line + label, bottom-left */}
      <div aria-hidden="true" style={{
        position: "absolute",
        bottom: 40,
        left: "calc(7% + 1px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        pointerEvents: "none",
        zIndex: 3,
        animation: "selara-fadeIn 1s ease 1.5s both",
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 8,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(250,246,239,0.28)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          userSelect: "none",
        }}>
          Scroll
        </p>
        <span style={{
          display: "block",
          width: "0.5px",
          background: "rgba(250,246,239,0.28)",
          animation: "selara-growLine 1s ease 1.6s both",
        }} />
      </div>
    </section>
  );
}
