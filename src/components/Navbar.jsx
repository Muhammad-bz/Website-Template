import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ShoppingBag, X, Menu, Instagram, Facebook } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   NAVBAR
   PERF: transition now specifies only 'background-color, padding, border-color'
         instead of 'all' — prevents layout recalculation on every transition tick.
         backdropFilter only applied when actually scrolled.
═══════════════════════════════════════════════ */
export default function Navbar({ cartCount, onCartOpen, cartBouncing, settings = {} }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let rafId = null;
    let last  = false;
    const check = () => {
      const s = window.scrollY > 80;
      if (s !== last) { last = s; setScrolled(s); }
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = useCallback((id) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const navLinks = useMemo(() => [
    { label: "Featured", id: "featured" },
    { label: "Menu",     id: "menu"     },
    { label: "About",    id: "about"    },
    { label: "Contact",  id: "contact"  },
  ], []);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? "12px 5%" : "20px 5%",
          background: scrolled ? "rgba(250,246,239,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.line}` : "none",
          transition: "background-color 0.35s ease, padding 0.35s ease, border-color 0.35s ease",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          willChange: "background-color",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            flexShrink: 0,
          }}
          aria-label="Back to top"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName || "Your Store"}
              style={{ height: 36, maxWidth: 140, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <span style={{
                fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 400,
                color: scrolled ? C.espresso : C.cream,
                letterSpacing: "0.06em", lineHeight: 1,
                transition: "color 0.3s",
              }}>
                {settings.storeName || "Your Store"}
              </span>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 8, letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: scrolled ? C.gold : "rgba(228,199,126,0.9)",
                marginTop: 2,
                transition: "color 0.3s",
              }}>
                {settings.tagline || "Online Store"}
              </span>
            </>
          )}
        </button>

        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map((l) => (
            <button
              key={l.id}
              className="nav-link"
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
                color: scrolled ? C.espresso : "rgba(250,246,239,0.92)",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onCartOpen}
            className={cartBouncing ? "cart-bounce" : ""}
            aria-label={`Cart (${cartCount} items)`}
            style={{
              position: "relative", background: "none", border: "none",
              cursor: "pointer",
              color: scrolled ? C.espresso : C.cream,
              padding: 6,
              transition: "color 0.3s",
            }}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                width: 17, height: 17,
                background: C.caramel, borderRadius: "50%",
                fontSize: 9, fontWeight: 700, color: C.cream,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="hide-desktop"
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: scrolled ? C.espresso : C.cream,
              padding: 6,
              transition: "color 0.3s",
            }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1100,
          background: C.espresso,
          display: "flex", flexDirection: "column",
          padding: "0 7%",
          animation: "fadeIn 0.22s ease",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 0",
            borderBottom: "1px solid rgba(250,246,239,0.08)",
          }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.cream, letterSpacing: "0.06em" }}>
              {settings.storeName || "Your Store"}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.cream, padding: 4 }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", paddingTop: 16, flex: 1 }}>
            {navLinks.map((l, i) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 300,
                  color: C.cream, padding: "14px 0",
                  borderBottom: "1px solid rgba(250,246,239,0.07)",
                  animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, padding: "28px 0" }}>
            {(settings.instagram || "#") && <a href={settings.instagram || "#"} target="_blank" rel="noopener noreferrer" style={{ color: C.gold }} aria-label="Instagram"><Instagram size={20} /></a>}
            {(settings.facebook  || "#") && <a href={settings.facebook  || "#"} target="_blank" rel="noopener noreferrer" style={{ color: C.gold }} aria-label="Facebook"><Facebook size={20} /></a>}
          </div>
        </div>
      )}
    </>
  );
}
