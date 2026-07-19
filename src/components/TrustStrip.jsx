import React, { memo } from "react";
import { Shield, Truck, Award, Users } from "lucide-react";
import { C, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   TRUST STRIP
   PERF: Memoised — static content, never re-renders
═══════════════════════════════════════════════ */
const TRUST_ITEMS = [
  { icon: <Shield size={16} />, label: "Quality Guaranteed" },
  { icon: <Truck size={16} />,  label: "Fast Dispatch" },
  { icon: <Award size={16} />,  label: "Top-Rated Products" },
  { icon: <Users size={16} />,  label: "Trusted by Thousands" },
];

const TrustStrip = memo(function TrustStrip() {
  return (
    <div style={{ background: C.espresso, padding: "18px 5%" }}>
      <div className="trust-grid" style={{ maxWidth: 1100, margin: "0 auto" }}>
        {TRUST_ITEMS.map((it) => (
          <div
            key={it.label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 9, padding: "10px 12px", color: C.goldLight,
            }}
          >
            {it.icon}
            <span style={{
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: C.cream,
            }}>
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TrustStrip;
