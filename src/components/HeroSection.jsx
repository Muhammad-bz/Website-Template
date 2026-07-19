import React, { useCallback } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, IMG } from "../constants/theme";

/* ═══════════════════════════════════════════════
   HERO SECTION — SIMPLE E-COMMERCE
═══════════════════════════════════════════════ */
export default function HeroSection({ settings = {} }) {
  const scrollToShop = useCallback(() =>
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" }),
  []);

  return (
    <section
      style={{ position: "relative", height: "100vh", minHeight: 560, overflow: "hidden" }}
      aria-label={`Welcome to ${settings.storeName || "Your Store"}`}
    >
      {/* Background image */}
      <img
        src={settings.heroBannerUrl || IMG.hero}
        alt={`${settings.storeName || "Your Store"} hero`}
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
      {/* Dark overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(20,8,2,0.48) 0%, rgba(20,8,2,0.30) 50%, rgba(20,8,2,0.60) 100%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "0 6%",
      }}>
        <p style={{
          fontFamily: FONT_BODY, fontSize: "clamp(9px, 1.1vw, 11px)",
          letterSpacing: "0.34em", textTransform: "uppercase",
          color: C.goldLight, marginBottom: 20,
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          {settings.tagline || "Quality Products · Online Store"}
        </p>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300,
          fontSize: "clamp(42px, 10vw, 112px)",
          lineHeight: 0.92, color: C.cream,
          letterSpacing: "0.10em", marginBottom: 20,
          textShadow: "0 4px 32px rgba(0,0,0,0.55)",
          animation: "fadeUp 0.7s ease 0.2s both",
        }}>
          {(settings.storeName || "YOUR STORE").toUpperCase()}
        </h1>
        <div style={{
          width: 52, height: 1,
          background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          margin: "0 auto 22px",
          animation: "fadeIn 0.7s ease 0.35s both",
        }} />
        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(15px, 2.4vw, 26px)",
          color: C.goldLight, letterSpacing: "0.07em", marginBottom: 46,
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          animation: "fadeUp 0.7s ease 0.3s both",
        }}>
          {settings.heroSubtitle || "Discover our curated collection of premium products."}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.7s ease 0.45s both" }}>
          <button
            className="btn-gold"
            onClick={scrollToShop}
            style={{ fontSize: 11, letterSpacing: "0.16em", padding: "16px 40px", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
          >
            Shop Now <ArrowRight size={13} style={{ marginLeft: 4 }} />
          </button>
          <button
            className="btn-primary"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 11, letterSpacing: "0.16em", padding: "16px 32px" }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 36, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
        pointerEvents: "none",
        animation: "fadeIn 1s ease 1s both",
      }}>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 9,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "rgba(250,246,239,0.55)",
          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
        }}>
          Scroll to explore
        </p>
        <ChevronDown size={15} color="rgba(250,246,239,0.45)" style={{ animation: "floatY 1.9s ease infinite" }} />
      </div>
    </section>
  );
}
