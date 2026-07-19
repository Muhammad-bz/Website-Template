// src/pages/ProductPage.jsx
import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, Check, Minus, Plus, ChevronRight, ChevronLeft, Maximize2, X } from "lucide-react";

import { useProducts, useSiteSettings, useReveal } from "../hooks";
import { C, FONT_DISPLAY, FONT_BODY, fmt } from "../constants/theme";
import { useCart } from "../context/CartContext";

import GlobalStyles from "../components/GlobalStyles";
import SiteHead     from "../components/SiteHead";
import Navbar       from "../components/Navbar";
import Footer       from "../components/Footer";
import CartDrawer   from "../components/CartDrawer";

/* ─── helpers ────────────────────────────────── */
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

/* Build image array from product — supports single img or images[] array */
function getImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length > 0) return product.images;
  if (product.img) return [product.img];
  return [];
}

/* ─── Carousel ───────────────────────────────── */
function ImageCarousel({ images, alt, tag }) {
  const [active,    setActive]    = useState(0);
  const [fading,    setFading]    = useState(false);
  const [lightbox,  setLightbox]  = useState(false);
  const autoRef   = useRef(null);
  const touchRef  = useRef(null);

  /* reset on image list change */
  useEffect(() => { setActive(0); }, [images]);

  const goTo = useCallback((idx) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(idx);
      setFading(false);
    }, 280);
  }, [active]);

  const prev = useCallback(() => goTo((active - 1 + images.length) % images.length), [active, images.length, goTo]);
  const next = useCallback(() => goTo((active + 1) % images.length), [active, images.length, goTo]);

  /* auto-advance every 4s when multiple images */
  useEffect(() => {
    if (images.length < 2) return;
    autoRef.current = setInterval(next, 4000);
    return () => clearInterval(autoRef.current);
  }, [next, images.length]);

  /* pause auto on user interaction */
  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    if (images.length > 1) autoRef.current = setInterval(next, 4000);
  }, [next, images.length]);

  /* touch/swipe */
  const onTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchRef.current;
    touchRef.current = null;
    if (Math.abs(dx) < 40) return;
    resetAuto();
    dx < 0 ? next() : prev();
  };

  /* keyboard in lightbox */
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") { resetAuto(); next(); }
      if (e.key === "ArrowLeft")  { resetAuto(); prev(); }
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, next, prev, resetAuto]);

  /* lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (images.length === 0) return <div style={{ paddingBottom: "130%", background: C.creamDeep }} />;

  return (
    <>
      {/* ── Main carousel ── */}
      <div
        style={{ position: "relative", overflow: "hidden", background: C.creamDeep, userSelect: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Image */}
        <div style={{ position: "relative", paddingBottom: "130%" }}>
          <img
            key={active}
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            loading={active === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.28s ease",
            }}
          />
        </div>

        {/* Tag */}
        {tag && (
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: C.rose, color: "#fff",
            fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500,
            letterSpacing: "0.16em", textTransform: "uppercase",
            padding: "5px 12px", zIndex: 2,
          }}>
            {tag}
          </span>
        )}

        {/* Fullscreen button */}
        <button
          onClick={() => setLightbox(true)}
          aria-label="View fullscreen"
          style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(253,248,245,0.88)", border: "none",
            width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2, transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(253,248,245,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(253,248,245,0.88)"; }}
        >
          <Maximize2 size={15} color={C.charcoal} />
        </button>

        {/* Arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => { resetAuto(); prev(); }}
              aria-label="Previous image"
              style={arrowStyle("left")}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(253,248,245,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(253,248,245,0.80)"; }}
            >
              <ChevronLeft size={18} color={C.charcoal} />
            </button>
            <button
              onClick={() => { resetAuto(); next(); }}
              aria-label="Next image"
              style={arrowStyle("right")}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(253,248,245,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(253,248,245,0.80)"; }}
            >
              <ChevronRight size={18} color={C.charcoal} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{
            position: "absolute", bottom: 14, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: 6, zIndex: 2,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { resetAuto(); goTo(i); }}
                aria-label={`Go to image ${i + 1}`}
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  background: i === active ? C.rose : "rgba(253,248,245,0.65)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — desktop only, shown when >1 image */}
      {images.length > 1 && (
        <div style={{
          display: "flex", gap: 8, marginTop: 10, overflowX: "auto",
          scrollbarWidth: "none", paddingBottom: 2,
        }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => { resetAuto(); goTo(i); }}
              style={{
                flexShrink: 0, width: 64, height: 64,
                border: i === active ? `2px solid ${C.rose}` : `2px solid transparent`,
                padding: 0, cursor: "pointer", overflow: "hidden",
                transition: "border-color 0.2s",
                background: C.creamDeep,
              }}
            >
              <img
                src={src} alt={`${alt} ${i + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(10,8,6,0.96)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={(e) => {
            if (touchRef.current === null) return;
            const dx = e.changedTouches[0].clientX - touchRef.current;
            touchRef.current = null;
            if (Math.abs(dx) < 40) return;
            resetAuto();
            dx < 0 ? next() : prev();
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(253,248,245,0.12)", border: "none",
              width: 44, height: 44, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2, transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(253,248,245,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(253,248,245,0.12)"; }}
          >
            <X size={20} color="#fff" />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <p style={{
              position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)",
              fontFamily: FONT_BODY, fontSize: 11, letterSpacing: "0.14em",
              color: "rgba(253,248,245,0.45)",
            }}>
              {active + 1} / {images.length}
            </p>
          )}

          {/* Image */}
          <img
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "90vh",
              objectFit: "contain",
              opacity: fading ? 0 : 1,
              transition: "opacity 0.28s ease",
              userSelect: "none",
            }}
          />

          {/* Lightbox arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); resetAuto(); prev(); }}
                aria-label="Previous"
                style={lightboxArrowStyle("left")}
              >
                <ChevronLeft size={24} color="#fff" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); resetAuto(); next(); }}
                aria-label="Next"
                style={lightboxArrowStyle("right")}
              >
                <ChevronRight size={24} color="#fff" />
              </button>
            </>
          )}

          {/* Lightbox dots */}
          {images.length > 1 && (
            <div style={{
              position: "absolute", bottom: 24, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: 8,
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); resetAuto(); goTo(i); }}
                  style={{
                    width: i === active ? 24 : 7, height: 7,
                    background: i === active ? C.rose : "rgba(253,248,245,0.35)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ─── arrow style helpers ─── */
const arrowStyle = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  [side]: 10,
  background: "rgba(253,248,245,0.80)",
  border: "none", width: 36, height: 36,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", zIndex: 2,
  transition: "background 0.2s",
});

const lightboxArrowStyle = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  [side]: 16,
  background: "rgba(253,248,245,0.10)",
  border: "none", width: 48, height: 48,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", zIndex: 2,
  transition: "background 0.2s",
});

/* ─── Related card ─── */
function RelatedCard({ product, onAdd }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    onAdd({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [onAdd, product]);

  return (
    <div
      onClick={() => { navigate(`/product/${product.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      style={{ cursor: "pointer", background: C.cream, border: `1px solid ${C.line}`, overflow: "hidden", transition: "box-shadow 0.25s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,129,143,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "relative", paddingBottom: "120%", overflow: "hidden" }}>
        <img src={product.img} alt={product.name} loading="lazy" decoding="async"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 400, color: C.charcoal, marginBottom: 4 }}>
          {product.name}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: C.slate }}>{fmt(product.price)}</span>
          <button onClick={handleAdd} style={{
            background: added ? C.rose : C.charcoal, color: "#fff", border: "none",
            padding: "7px 12px", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {added ? <><Check size={10} /> Added</> : <><Plus size={10} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCT PAGE
═══════════════════════════════════════════════ */
export default function ProductPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { settings }                 = useSiteSettings();
  useReveal();

  const {
    cart, cartOpen, cartBouncing, wishlist, cartCount,
    addToCart, updateQty, removeItem, toggleWish,
    openCart, closeCart, clearCart,
  } = useCart();

  const product = useMemo(() => products.find((p) => String(p.id) === String(id)), [products, id]);
  const images  = useMemo(() => getImages(product), [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [products, product]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [qty,          setQty]          = useState(1);
  const [added,        setAdded]        = useState(false);
  const [sizeError,    setSizeError]    = useState(false);

  useEffect(() => {
    setSelectedSize(null); setQty(1); setAdded(false); setSizeError(false);
  }, [id]);

  const hasSizes = product?.sizes?.length > 0;
  const wished   = wishlist.has(product?.id);

  const handleAdd = useCallback(() => {
    if (hasSizes && !selectedSize) { setSizeError(true); return; }
    addToCart({ ...product, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, product, selectedSize, qty, hasSizes]);

  /* ── Navbar forced-visible CSS injected once ── */
  useEffect(() => {
    const id = "selara-product-nav-fix";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      /* On product page, navbar is always in "scrolled" state visually */
      s.textContent = `
        #selara-product-page nav:first-of-type {
          background: rgba(10,8,6,0.97) !important;
          padding-top: 14px !important;
          padding-bottom: 14px !important;
          border-bottom: 0.5px solid rgba(242,196,206,0.10) !important;
          backdrop-filter: blur(14px) !important;
        }
      `;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById("selara-product-nav-fix");
      if (el) el.remove();
    };
  }, []);

  /* ── shell for loading/error states ── */
  const shell = (content) => (
    <>
      <SiteHead settings={settings} />
      <GlobalStyles />
      <Navbar cartCount={cartCount} onCartOpen={openCart} cartBouncing={cartBouncing} settings={settings} forceScrolled />
      <main style={{ minHeight: "70vh", paddingTop: 72 }}>{content}</main>
      <Footer settings={settings} />
      <CartDrawer open={cartOpen} onClose={closeCart} cart={cart}
        updateQty={updateQty} removeItem={removeItem} onOrderSuccess={clearCart} settings={settings} />
    </>
  );

  if (loading) return shell(
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div className="img-placeholder" style={{ paddingBottom: "130%", position: "relative" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[240, 120, 80, 160, 48].map((w, i) => (
            <div key={i} className="img-placeholder" style={{ height: 20, width: w }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return shell(
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 300, color: C.mist }}>Unable to load this product.</p>
    </div>
  );

  if (!product) return shell(
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 300, color: C.charcoal, marginBottom: 8 }}>Product not found</p>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mist, marginBottom: 32 }}>This item may no longer be available.</p>
      <Link to="/#menu" style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em",
        textTransform: "uppercase", color: C.charcoal, textDecoration: "none", borderBottom: `1px solid ${C.charcoal}`, paddingBottom: 2 }}>
        View all products
      </Link>
    </div>
  );

  return (
    <div id="selara-product-page">
      <SiteHead settings={settings} />
      <GlobalStyles />

      {/* Navbar — forced always visible via forceScrolled prop */}
      <Navbar
        cartCount={cartCount} onCartOpen={openCart}
        cartBouncing={cartBouncing} settings={settings}
        forceScrolled
      />

      <main style={{ paddingTop: 72 }}>

        {/* Breadcrumb */}
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 24px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <Link to="/" style={crumbStyle}>Home</Link>
          <ChevronRight size={11} color={C.mist} />
          <Link to="/#menu" style={crumbStyle}>{product.category || "Shop"}</Link>
          <ChevronRight size={11} color={C.mist} />
          <span style={{ ...crumbStyle, color: C.charcoal, cursor: "default" }}>{product.name}</span>
        </nav>

        {/* Back button */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 24px 0" }}>
          <button onClick={() => navigate(-1)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.10em", color: C.mist, padding: 0, textTransform: "uppercase",
            transition: "color 0.15s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.charcoal; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.mist; }}
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>

        {/* Main layout */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "28px 24px 72px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(28px, 5vw, 72px)",
          alignItems: "start",
        }}>

          {/* Left: Carousel — NOT sticky, no position:sticky */}
          <div>
            <ImageCarousel images={images} alt={product.name} tag={product.tag} />
          </div>

          {/* Right: Info */}
          <div style={{ paddingTop: 4 }}>

            {product.category && (
              <p style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500, letterSpacing: "0.28em",
                textTransform: "uppercase", color: C.rose, marginBottom: 12 }}>
                {product.category}
              </p>
            )}

            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)",
              color: C.charcoal, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.01em" }}>
              {product.name}
            </h1>

            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400,
              color: C.slate, marginBottom: 28, letterSpacing: "0.01em" }}>
              {fmt(product.price)}
            </p>

            <div style={{ height: 1, background: C.line, marginBottom: 28 }} />

            {product.desc && (
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 300, color: C.mist, lineHeight: 1.75 }}>
                  {product.desc}
                </p>
              </div>
            )}

            {/* Sizes */}
            {hasSizes && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: C.charcoal, marginBottom: 12 }}>
                  Size {selectedSize && <span style={{ color: C.rose, fontWeight: 400 }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(product.sizes || SIZES).map((sz) => {
                    const active = selectedSize === sz;
                    return (
                      <button key={sz} onClick={() => { setSelectedSize(sz); setSizeError(false); }}
                        style={{
                          width: 48, height: 48,
                          border: active ? `1.5px solid ${C.rose}` : `1.5px solid ${C.line}`,
                          background: active ? C.rose : "transparent",
                          color: active ? "#fff" : C.mist,
                          borderRadius: 0, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 400,
                          letterSpacing: "0.06em", cursor: "pointer",
                          transition: "background 0.18s, color 0.18s, border-color 0.18s",
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                {sizeError && <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#c0392b", marginTop: 8 }}>Please select a size.</p>}
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500, letterSpacing: "0.18em",
                textTransform: "uppercase", color: C.charcoal, marginBottom: 12 }}>
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.line}`, width: "fit-content" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" style={qtyBtnStyle}>
                  <Minus size={13} />
                </button>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 400,
                  color: C.charcoal, minWidth: 40, textAlign: "center", padding: "0 4px" }}>
                  {qty}
                </span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" style={qtyBtnStyle}>
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <button onClick={handleAdd} style={{
                flex: 1, background: added ? C.rose : C.charcoal,
                color: "#fff", border: "none", borderRadius: 0,
                padding: "16px 24px", fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
                letterSpacing: "0.16em", textTransform: "uppercase",
                cursor: "pointer", transition: "background 0.25s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
                onMouseEnter={(e) => { if (!added) e.currentTarget.style.background = C.rose; }}
                onMouseLeave={(e) => { if (!added) e.currentTarget.style.background = C.charcoal; }}
              >
                {added ? <><Check size={14} /> Added to cart</> : "Add to cart"}
              </button>

              <button onClick={() => toggleWish(product.id)}
                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                style={{
                  width: 52, height: 52, flexShrink: 0,
                  border: `1px solid ${C.line}`, borderRadius: 0, background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.rose; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; }}
              >
                <Heart size={18} fill={wished ? C.rose : "none"} color={wished ? C.rose : C.mist} />
              </button>
            </div>

            <div style={{ height: 1, background: C.line, marginBottom: 20 }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.mist, letterSpacing: "0.04em", lineHeight: 1.7 }}>
              Free delivery on orders over PKR 3,000 · Easy 7-day returns
            </p>

          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ background: C.creamDeep, padding: "64px 24px 72px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 36, borderBottom: `1px solid ${C.line}`, paddingBottom: 20,
                display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500, letterSpacing: "0.28em",
                    textTransform: "uppercase", color: C.rose, marginBottom: 8 }}>
                    From the same collection
                  </p>
                  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: C.charcoal }}>
                    You might also like
                  </h2>
                </div>
                <Link to="/#menu" style={{
                  fontFamily: FONT_BODY, fontSize: 10, fontWeight: 500,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: C.charcoal, textDecoration: "none",
                  borderBottom: `1px solid ${C.charcoal}`, paddingBottom: 2, whiteSpace: "nowrap",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = C.rose; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = C.charcoal; }}
                >
                  View all
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
                {related.map((p) => <RelatedCard key={p.id} product={p} onAdd={addToCart} />)}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer settings={settings} />
      <CartDrawer open={cartOpen} onClose={closeCart} cart={cart}
        updateQty={updateQty} removeItem={removeItem} onOrderSuccess={clearCart} settings={settings} />
    </div>
  );
}

const crumbStyle = {
  fontFamily: "inherit", fontSize: 11, color: C.mist,
  textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.15s",
};

const qtyBtnStyle = {
  background: "none", border: "none", width: 44, height: 44,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: C.mist, transition: "color 0.15s",
};
