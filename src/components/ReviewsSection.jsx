import React, { memo } from "react";
import { Star } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, REVIEWS } from "../constants/theme";
import SectionHeader from "./shared/SectionHeader";

/* ═══════════════════════════════════════════════
   REVIEWS SECTION
═══════════════════════════════════════════════ */
const ReviewsSection = memo(function ReviewsSection() {
  return (
    <section className="section-pad" style={{ background: C.creamDeep }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Word of mouth"
          title={<>What our <em style={{ fontStyle: "italic" }}>regulars</em> say</>}
          sub="We are proud to serve so many happy customers across the country."
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: 24,
        }}>
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="card-lift reveal"
              style={{
                background: C.cream, borderRadius: 4,
                padding: "28px 24px",
                border: `1px solid ${C.line}`,
                position: "relative",
                contain: "layout style",
              }}
            >
              <span aria-hidden="true" style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: FONT_DISPLAY, fontSize: 64,
                color: C.parchment, lineHeight: 1, userSelect: "none",
              }}>
                &ldquo;
              </span>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={13} fill={C.gold} color={C.gold} />
                ))}
              </div>
              <p style={{
                fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                color: C.mist, lineHeight: 1.8, marginBottom: 22,
              }}>
                {r.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={r.img}
                  alt={r.name}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: C.espresso }}>{r.name}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.gold, marginTop: 1 }}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ReviewsSection;
