import React, { useCallback, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, IMG } from "../constants/theme";

/* ═══════════════════════════════════════════════
   HERO SECTION — SELARA PREMIUM FASHION
═══════════════════════════════════════════════ */

const SELARA_HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  @keyframes selara-fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes selara-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes selara-growLine {
    from { height: 0; opacity: 0; }
    to   { height: 48px; opacity: 0.5; }
  }
  @keyframes selara-shimmer-text {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .selara-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 16px 40px;
    border-radius: 0;
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
    white-space: nowrap;
  }

  .selara-btn-primary {
    background: rgba(253,248,245,0.95);
    color: #1C1C1C;
    border: 1px solid rgba(253,248,245,0.95);
  }
  .selara-btn-primary:hover {
    background: #C9818F;
    color: #fff;
    border-color: #C9818F;
  }

  .selara-btn-ghost {
    background: transparent;
    color: rgba(253,248,245,0.70);
    border: 1px solid rgba(253,248,245,0.28);
  }
  .selara-btn-ghost:hover {
    color: rgba(253,248,245,0.95);
    border-color: rgba(253,248,245,0.60);
    background: rgba(253,248,245,0.06);
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

      {/* Soft feminine vignette — lighter than before, blush tint at bottom */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: `
          linear-gradient(to right,  rgba(28,28,28,0.72) 0%, rgba(28,28,28,0.20) 55%, rgba(28,28,28,0.36) 100%),
          linear-gradient(to bottom, rgba(28,28,28,0.18) 0%, rgba(28,28,28,0.02) 38%, rgba(28,28,28,0.58) 100%)
        `,
        pointerEvents: "none",
      }} />

      {/* Vertical season label — right edge */}
      <div aria-hidden="true" style={{
        position: "absolute", right: 32, top: "50%",
        transform: "translateY(-50%) rotate(90deg)",
        fontFamily: "'Jost', sans-serif",
        fontSize: 8,
        letterSpacing: "0.40em",
        textTransform: "uppercase",
        color: "rgba(242,196,206,0.35)",
        zIndex: 3,
        whiteSpace: "nowrap",
        animation: "selara-fadeIn 1.2s ease 1.6s both",
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
        maxWidth: 860,
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "clamp(8px, 0.78vw, 10px)",
          letterSpacing: "0.44em",
          textTransform: "uppercase",
          color: "rgba(242,196,206,0.70)",
          marginBottom: 22,
          animation: "selara-fadeUp 1s ease 0.10s both",
        }}>
          {settings.tagline || "Feminine · Modern · Pret"}
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(58px, 10.5vw, 126px)",
          lineHeight: 0.85,
          color: "rgba(253,248,245,0.97)",
          letterSpacing: "0.08em",
          marginBottom: 24,
          textShadow: "0 2px 60px rgba(0,0,0,0.28)",
          animation: "selara-fadeUp 1s ease 0.22s both",
        }}>
          {(settings.storeName || "SELARA").toUpperCase()}
        </h1>

        {/* Rose hairline */}
        <div style={{
          width: 48,
          height: "0.5px",
          background: "rgba(242,196,206,0.55)",
          marginBottom: 20,
          animation: "selara-fadeIn 1s ease 0.42s both",
        }} />

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(17px, 2vw, 25px)",
          color: "rgba(253,248,245,0.62)",
          letterSpacing: "0.03em",
          lineHeight: 1.5,
          marginBottom: 52,
          maxWidth: 460,
          animation: "selara-fadeUp 1s ease 0.34s both",
        }}>
          {settings.heroSubtitle || "Feminine silhouettes, modern cuts — crafted for the woman who knows her style."}
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          animation: "selara-fadeUp 1s ease 0.52s both",
        }}>
          <button className="selara-btn selara-btn-primary" onClick={scrollToShop}>
            Shop the Collection <ArrowRight size={11} />
          </button>
          <button
            className="selara-btn selara-btn-ghost"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden="true" style={{
        position: "absolute",
        bottom: 40,
        left: "calc(7% + 1px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        pointerEvents: "none",
        zIndex: 3,
        animation: "selara-fadeIn 1s ease 1.6s both",
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 8,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: "rgba(242,196,206,0.35)",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          userSelect: "none",
        }}>
          Scroll
        </p>
        <span style={{
          display: "block",
          width: "0.5px",
          background: "rgba(242,196,206,0.35)",
          animation: "selara-growLine 1s ease 1.7s both",
        }} />
      </div>
    </section>
  );
}
