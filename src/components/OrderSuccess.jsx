import React from "react";
import { X, Check } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   ORDER SUCCESS SCREEN
═══════════════════════════════════════════════ */
export default function OrderSuccess({ onClose }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${C.line}`,
        display: "flex", justifyContent: "flex-end",
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: C.parchment, border: "none", borderRadius: "50%",
            width: 34, height: 34,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={15} color={C.espresso} />
        </button>
      </div>

      <div className="order-success">
        <div className="order-success-icon">
          <Check size={28} color="#22A84A" strokeWidth={2.5} />
        </div>
        <h3 style={{
          fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400,
          color: C.espresso, marginBottom: 10,
        }}>
          Order Placed!
        </h3>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 14, color: C.mist,
          lineHeight: 1.65, maxWidth: 280, marginBottom: 28,
        }}>
          Thank you! We've received your order and will be in touch shortly to confirm your delivery.
        </p>

        {/* Note: OrderSuccess doesn't receive settings — the number above is a safe fallback */}
        <button className="btn-primary" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
