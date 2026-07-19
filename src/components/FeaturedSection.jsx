import React, { useMemo } from "react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";
import SectionHeader from "./shared/SectionHeader";
import ProductCard from "./shared/ProductCard";

/* ═══════════════════════════════════════════════
   FEATURED SECTION
═══════════════════════════════════════════════ */
export default function FeaturedSection({ onAdd, wishlist, toggleWish, products, loading, error }) {
  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  return (
    <section id="featured" className="section-pad" style={{ background: C.cream }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Handpicked for you"
          title={<>This Week's <em style={{ fontStyle: "italic" }}>Highlights</em></>}
          sub="Our best-selling items, carefully selected and ready to order."
        />

        {loading && (
          <div className="product-grid-featured">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="img-placeholder"
                style={{ borderRadius: 4, height: 340 }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 300, color: C.mist }}>
              Unable to load featured items.
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mist, marginTop: 8 }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 300, color: C.mist }}>
              No featured items right now.
            </p>
          </div>
        )}

        {!loading && !error && featured.length > 0 && (
          <div className="product-grid-featured">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} wishlist={wishlist} toggleWish={toggleWish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
