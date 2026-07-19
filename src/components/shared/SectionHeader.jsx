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
          fontFamily: FONT_BODY, fontSize: 10,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: C.gold, marginBottom: 12,
        }}>
          {eyebrow}
        </p>
      )}
      <div className={`divider${center ? "" : " left"}`} />
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300,
        fontSize: "clamp(30px, 5vw, 52px)",
        color: C.espresso, lineHeight: 1.1, marginTop: 16,
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 15,
          color: C.mist, maxWidth: 500,
          margin: center ? "12px auto 0" : "12px 0 0",
          lineHeight: 1.7,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
});

export default SectionHeader;
