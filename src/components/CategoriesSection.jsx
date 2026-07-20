// src/components/CategoriesSection.jsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Check, Plus, ShoppingBag } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY, fmt } from "../constants/theme";

/* ─────────────────────────────────────────────
   CATEGORY CONFIG
   Add / remove categories and their cover images here.
───────────────────────────────────────────── */
const CATEGORIES = [
  {
    id:    "new",
    label: "New Arrivals",
    sub:   "Just landed",
    // match by: any product added recently, or ones with tag "New"
    match: (p) => p.tag === "New" || p.featured,
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop",
    accent: C.rose,
  },
  {
    id:    "lawn",
    label: "Lawn",
    sub:   "Breathable summer cuts",
    match: (p) => (p.category || "").toLowerCase().includes("lawn"),
    cover: "https://images.unsplash.com/photo-1594938298603-c8148c4b7b7b?w=800&q=85&auto=format&fit=crop",
    accent: "#A8C5B5",
  },
  {
    id:    "pret",
    label: "Pret",
    sub:   "Ready to wear",
    match: (p) => (p.category || "").toLowerCase().includes("pret"),
    cover: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=85&auto=format&fit=crop",
    accent: C.blush,
  },
  {
    id:    "formal",
    label: "Formal",
    sub:   "Occasion & evening",
    match: (p) => (p.category || "").toLowerCase().includes("formal"),
    cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&auto=format&fit=crop",
    accent: "#B8A9C9",
  },
  {
    id:    "casual",
    label: "Casual",
    sub:   "Everyday comfort",
    match: (p) => (p.category || "").toLowerCase().includes("casual"),
    cover: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
    accent: C.petal,
  },
  {
    id:    "all",
    label: "All Pieces",
    sub:   "The full edit",
    match: () => true,
    cover: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=85&auto=format&fit=crop",
    accent: C.charcoal,
  },
];

/* ─────────────────────────────────────────────
   PRODUCT MINI-CAROUSEL inside drawer
───────────────────────────────────────────── */
function MiniCarousel({ images, alt }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const touchRef = useRef(null);

  useEffect(() => setActive(0), [images]);

  const goTo = useCallback((idx) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 220);
  }, [active]);

  const prev = () => goTo((active - 1 + images.length) % images.length);
  const next = () => goTo((active + 1) % images.length);

  const onTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    touchRef.current = null;
    if (Math.abs(dx) < 36) return;
    dx < 0 ? next() : prev();
  };

  if (!images || images.length === 0) {
    return <div style={{ width: "100%", paddingBottom: "100%", background: C.creamDeep }} />;
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", background: C.creamDeep }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ position: "relative", paddingBottom: "100%" }}>
        <img src={images[active]} alt={alt}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: fading ? 0 : 1, transition: "opacity 0.22s ease",
          }}
        />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev} style={miniArrow("left")}>
            <ChevronLeft size={14} color={C.charcoal} />
          </button>
          <button onClick={next} style={miniArrow("right")}>
            <ChevronRight size={14} color={C.charcoal} />
          </button>
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 4,
          }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === active ? 14 : 5, height: 5,
                background: i === active ? C.rose : "rgba(253,248,245,0.60)",
                border: "none", padding: 0, cursor: "pointer",
                transition: "width 0.25s ease",
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const miniArrow = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  [side]: 8,
  background: "rgba(253,248,245,0.82)", border: "none",
  width: 28, height: 28,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", zIndex: 1,
});

/* ─────────────────────────────────────────────
   PRODUCT CARD inside drawer
───────────────────────────────────────────── */
function DrawerProductCard({ product, onAdd, wishlist, toggleWish, onView }) {
  const [added, setAdded] = useState(false);
  const wished = wishlist?.has(product.id);

  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    const s = product.imageUrl || product.img;
    return s ? [s] : [];
  }, [product]);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div style={{ background: C.cream, border: `1px solid ${C.line}`, overflow: "hidden" }}>
      {/* Image carousel */}
      <div style={{ cursor: "pointer", position: "relative" }} onClick={() => onView(product)}>
        <MiniCarousel images={images} alt={product.name} />
        {/* Wishlist */}
        {toggleWish && (
          <button onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
            style={{
              position: "absolute", top: 8, right: 8, zIndex: 2,
              background: "rgba(253,248,245,0.88)", border: "none",
              borderRadius: "50%", width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Heart size={13} fill={wished ? C.rose : "none"} color={wished ? C.rose : C.mist} />
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 400,
          color: C.charcoal, marginBottom: 2, lineHeight: 1.25,
          cursor: "pointer",
        }} onClick={() => onView(product)}>
          {product.name}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: C.slate }}>{fmt(product.price)}</span>
          <button onClick={handleAdd} style={{
            background: added ? C.rose : C.charcoal, color: "#fff", border: "none",
            padding: "6px 10px", fontSize: 8, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer", transition: "background 0.2s",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            {added ? <><Check size={9} /> Added</> : <><Plus size={9} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CATEGORY DRAWER
───────────────────────────────────────────── */
function CategoryDrawer({ category, products, onAdd, wishlist, toggleWish, onClose, onViewProduct }) {
  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* close on Escape */
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = useMemo(() => {
    const results = products.filter(category.match);
    return results.length > 0 ? results : products.slice(0, 8);
  }, [products, category]);

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(28,28,28,0.55)",
          backdropFilter: "blur(3px)",
          animation: "fadeIn 0.22s ease",
        }}
        onClick={onClose}
      />

      {/* Drawer panel — slides in from right on desktop, bottom on mobile */}
      <div style={{
        position: "fixed", zIndex: 3001,
        top: 0, right: 0, bottom: 0,
        width: "min(520px, 100vw)",
        background: C.cream,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 48px rgba(201,129,143,0.14)",
        animation: "slideInRight 0.32s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${C.line}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
          background: C.cream,
        }}>
          <div>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.28em",
              textTransform: "uppercase", color: C.rose, marginBottom: 4,
            }}>
              {category.sub}
            </p>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 300,
              color: C.charcoal, lineHeight: 1,
            }}>
              {category.label}
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mist, marginTop: 4 }}>
              {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{
              background: C.creamDeep, border: "none",
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.parchment; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.creamDeep; }}
          >
            <X size={15} color={C.charcoal} />
          </button>
        </div>

        {/* Product grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 32px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <ShoppingBag size={32} color={C.parchment} style={{ margin: "0 auto 14px", display: "block" }} />
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 300, color: C.mist }}>
                Coming soon
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 14,
            }}>
              {filtered.map((p) => (
                <DrawerProductCard
                  key={p.id}
                  product={p}
                  onAdd={onAdd}
                  wishlist={wishlist}
                  toggleWish={toggleWish}
                  onView={onViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   CATEGORY CARD (main grid)
───────────────────────────────────────────── */
function CategoryCard({ cat, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        border: "none", padding: 0, cursor: "pointer",
        background: "none", display: "block", width: "100%",
        /* Staggered reveal */
        animation: `fadeUp 0.6s ease ${index * 0.08}s both`,
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", paddingBottom: "115%" }}>
        <img
          src={cat.cover}
          alt={cat.label}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(28,28,28,0.72) 0%, rgba(28,28,28,0.08) 60%)"
            : "linear-gradient(to top, rgba(28,28,28,0.58) 0%, rgba(28,28,28,0.04) 55%)",
          transition: "background 0.35s ease",
        }} />

        {/* Text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "20px 20px 22px",
          textAlign: "left",
        }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.28em",
            textTransform: "uppercase", color: cat.accent,
            marginBottom: 5,
            opacity: hovered ? 1 : 0.8,
            transition: "opacity 0.3s",
          }}>
            {cat.sub}
          </p>
          <h3 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 300,
            fontSize: "clamp(20px, 2.5vw, 28px)",
            color: "#fff", lineHeight: 1, letterSpacing: "0.02em",
            transform: hovered ? "translateY(-3px)" : "translateY(0)",
            transition: "transform 0.35s ease",
          }}>
            {cat.label}
          </h3>
          {/* Arrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginTop: 10,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.20em",
              textTransform: "uppercase", color: "rgba(253,248,245,0.85)",
            }}>
              Explore
            </span>
            <ChevronRight size={12} color="rgba(253,248,245,0.85)" />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function CategoriesSection({ products = [], onAdd, wishlist, toggleWish }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = typeof window !== "undefined" ? null : null; // used below via window

  /* When a product card is clicked inside the drawer → navigate to product page */
  const handleViewProduct = useCallback((product) => {
    setActiveCategory(null);
    /* Small delay so drawer close animation completes */
    setTimeout(() => {
      window.location.href = `/product/${product.id}`;
    }, 120);
  }, []);

  return (
    <>
      <section id="categories" style={{ background: C.creamDeep, padding: "72px 5% 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Section header */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.36em",
              textTransform: "uppercase", color: C.rose, marginBottom: 14,
            }}>
              Explore the edit
            </p>
            <div className="divider" />
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300,
              fontSize: "clamp(28px, 4.5vw, 48px)",
              color: C.charcoal, lineHeight: 1.1, marginTop: 18,
            }}>
              Shop by <em style={{ fontStyle: "italic" }}>Category</em>
            </h2>
            <p style={{
              fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
              color: C.mist, maxWidth: 440, margin: "14px auto 0", lineHeight: 1.8,
            }}>
              From lawn to formal — every occasion, every mood, beautifully curated.
            </p>
          </div>

          {/* Category grid — editorial: first card spans 2 rows on desktop */}
          <div
            className="cat-editorial-grid"
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Category drawer */}
      {activeCategory && (
        <CategoryDrawer
          category={activeCategory}
          products={products}
          onAdd={onAdd}
          wishlist={wishlist}
          toggleWish={toggleWish}
          onClose={() => setActiveCategory(null)}
          onViewProduct={handleViewProduct}
        />
      )}
    </>
  );
}
