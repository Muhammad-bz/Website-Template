import React, { memo, useCallback } from "react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
const Footer = memo(function Footer({ settings = {} }) {
  const scrollTo = useCallback((id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
  []);

  return (
    <footer style={{
      background: C.charcoal,
      borderTop: "1px solid rgba(242,196,206,0.08)",
      padding: "56px 5% 28px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          <div className="footer-brand">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName || "Your Store"} style={{ height: 40, maxWidth: 160, objectFit: "contain", marginBottom: 10, display: "block" }} />
            ) : (
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 300, color: C.cream, letterSpacing: "0.06em", marginBottom: 4 }}>
                {settings.storeName || "Your Store"}
              </p>
            )}
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: C.blush, marginBottom: 14 }}>
              {settings.tagline || "Feminine · Modern · Pret"}
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.4)", lineHeight: 1.7, maxWidth: 280 }}>
              {settings.aboutText
                ? settings.aboutText.substring(0, 120) + (settings.aboutText.length > 120 ? "…" : "")
                : "Curated with care for every customer. No compromises on quality. Just great products and honest service."}
            </p>
          </div>

          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.blush, marginBottom: 16 }}>
              Explore
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["featured","Featured"],["menu","Full Menu"],["about","About Us"],["contact","Contact"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left",
                    fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300,
                    color: "rgba(250,246,239,0.45)", transition: "color 0.2s",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.blush; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(253,248,245,0.40)"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.blush, marginBottom: 16 }}>
              Hours
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.45)", lineHeight: 2, whiteSpace: "pre-line" }}>
              {settings.openingTime && settings.closingTime
                ? `${settings.openingTime} – ${settings.closingTime}${(settings.closedDays || []).length ? `\nClosed: ${(settings.closedDays || []).join(", ")}` : ""}`
                : `Mon – Sat\n7:00 AM – 9:00 PM\n\nSunday\n8:00 AM – 6:00 PM`}
            </p>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(242,196,206,0.08)",
          paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10,
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: "rgba(253,248,245,0.20)" }}>
            &copy; {new Date().getFullYear()} {settings.storeName || "Selara"}. All rights reserved.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: "rgba(242,196,206,0.25)", letterSpacing: "0.06em" }}>
            Feminine · Modern · Pret
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
