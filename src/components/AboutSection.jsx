import React, { memo } from "react";
import { C, FONT_DISPLAY, FONT_BODY, IMG } from "../constants/theme";

/* ═══════════════════════════════════════════════
   ABOUT SECTION
═══════════════════════════════════════════════ */
const AboutSection = memo(function AboutSection({ settings = {} }) {
  return (
    <section id="about" className="section-pad" style={{ background: C.espresso }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="about-grid">
          <div className="about-image-col reveal" style={{ position: "relative" }}>
            <img
              src={settings.aboutImageUrl || IMG.about}
              alt="About our store"
              loading="lazy"
              decoding="async"
              style={{
                width: "100%", height: "clamp(280px, 40vw, 460px)",
                objectFit: "cover", borderRadius: 4, display: "block",
              }}
            />
            <div className="hide-mobile" style={{
              position: "absolute", bottom: -24, right: -20,
              width: 160, height: 160,
              borderRadius: 4, overflow: "hidden",
              border: `3px solid ${C.espresso}`,
            }}>
              <img
                src={IMG.aboutSmall}
                alt="Store products"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div aria-hidden="true" style={{
              position: "absolute", top: -10, left: -10,
              width: "38%", height: "38%",
              border: `1px solid ${C.gold}`,
              borderRadius: 4, opacity: 0.35, pointerEvents: "none",
            }} />
          </div>

          <div className="reveal">
            <p style={{
              fontFamily: FONT_BODY, fontSize: 10,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.gold, marginBottom: 12,
            }}>
              Our Story
            </p>
            <div className="divider left" style={{ background: C.gold }} />
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300,
              fontSize: "clamp(26px, 4vw, 44px)",
              color: C.cream, lineHeight: 1.15,
              margin: "16px 0 18px",
            }}>
              A store built around
              <br />
              <em style={{ fontStyle: "italic" }}>you, the customer</em>
            </h2>
            {settings.aboutText ? (
              <p style={{
                fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                color: "rgba(250,246,239,0.7)", lineHeight: 1.85, marginBottom: 32,
                whiteSpace: "pre-line",
              }}>
                {settings.aboutText}
              </p>
            ) : (
              <>
                <p style={{
                  fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                  color: "rgba(250,246,239,0.7)", lineHeight: 1.85, marginBottom: 18,
                }}>
                  Your Store was born from a simple idea: that finding quality products online should be easy.
                  What started as a small catalogue has grown into a trusted destination for shoppers who
                  care about quality over quantity.
                </p>
                <p style={{
                  fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                  color: "rgba(250,246,239,0.7)", lineHeight: 1.85, marginBottom: 32,
                }}>
                  Every product in our store is carefully selected and vetted. We carry no cheap alternatives —
                  just honest goods, fair prices, and a commitment to service
                  we take seriously.
                </p>
              </>
            )}
            <div className="stats-row">
              {[["5+", "Years Online"], ["200+", "Products"], ["500+", "Happy Customers"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400, color: C.goldLight, lineHeight: 1 }}>
                    {n}
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: "rgba(250,246,239,0.45)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
