import React, { memo, useState, useCallback } from "react";
import { Heart, Check, Plus } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, fmt } from "../../constants/theme";

/* ═══════════════════════════════════════════════
   PRODUCT CARD
   PERF: memo to avoid re-renders from parent state changes.
         Image hover uses CSS class swap instead of inline style mutation.
         loading="lazy" + decoding="async" on all product images.
═══════════════════════════════════════════════ */
const ProductCard = memo(function ProductCard({ product, onAdd, wishlist, toggleWish }) {
  const [added,  setAdded]  = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const wished = wishlist?.has(product.id);

  const handleAdd = useCallback(() => {
    onAdd({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [onAdd, product]);

  const handleToggleWish = useCallback(() => {
    toggleWish?.(product.id);
  }, [toggleWish, product.id]);

  return (
    <div
      className="card-lift reveal"
      style={{
        background: C.cream, borderRadius: 4,
        border: `1px solid ${C.line}`,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        contain: "layout style",
      }}
    >
      <div style={{ position: "relative", paddingBottom: "68%", overflow: "hidden", flexShrink: 0 }}>
        {imgErr ? (
          <div className="img-placeholder" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        ) : (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgErr(true)}
            style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        )}
        {product.tag && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: C.espresso, color: C.goldLight,
            fontFamily: FONT_BODY, fontSize: 8, fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "4px 9px", borderRadius: 2,
          }}>
            {product.tag}
          </span>
        )}
        {toggleWish && (
          <button
            onClick={handleToggleWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: "absolute", top: 10, right: 10,
              background: "rgba(250,246,239,0.92)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "transform 0.15s",
            }}
          >
            <Heart size={14} fill={wished ? C.caramel : "none"} color={wished ? C.caramel : C.mist} />
          </button>
        )}
      </div>

      <div style={{ padding: "16px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 19,
          color: C.espresso, marginBottom: 6, lineHeight: 1.2,
        }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300,
          color: C.mist, lineHeight: 1.6, flex: 1, marginBottom: 14,
        }}>
          {product.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 500, color: C.chocolate, flexShrink: 0 }}>
            {fmt(product.price)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: added ? C.caramel : C.espresso,
              color: C.cream, border: "none", borderRadius: 3,
              padding: "9px 14px", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
            }}
          >
            {added ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
