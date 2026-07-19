import React, { memo } from "react";
import { C, FONT_DISPLAY, FONT_BODY } from "../../constants/theme";

/* ═══════════════════════════════════════════════
   SECTION HEADER — memoised (pure display)
═══════════════════════════════════════════════ */
const SectionHeader = memo(function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div className="reveal" style={{ textAlign: center ? "center" : "left", marginBottom: 44 }}>
      {eyebrow && (
        <p style={{
          fontFamily: FONT_BODY, fontSize: 9,
          letterSpacing: "0.36em", textTransform: "uppercase",
          color: C.rose, marginBottom: 16,
        }}>
          {eyebrow}
        </p>
      )}
      <div className={`divider${center ? "" : " left"}`} />
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300,
        fontSize: "clamp(28px, 4.5vw, 50px)",
        color: C.charcoal, lineHeight: 1.1, marginTop: 18,
        letterSpacing: "0.01em",
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
          color: C.mist, maxWidth: 480,
          margin: center ? "14px auto 0" : "14px 0 0",
          lineHeight: 1.8,
          letterSpacing: "0.01em",
        }}>
          {sub}
        </p>
      )}
    </div>
  );
});

export default SectionHeader;
