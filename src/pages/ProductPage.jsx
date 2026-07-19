// src/pages/ProductPage.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, Check, Minus, Plus, ChevronRight } from "lucide-react";

import { useProducts, useSiteSettings, useReveal } from "../hooks";
import { C, FONT_DISPLAY, FONT_BODY, fmt } from "../constants/theme";
import { useCart } from "../context/CartContext";

import GlobalStyles from "../components/GlobalStyles";
import SiteHead     from "../components/SiteHead";
import Navbar       from "../components/Navbar";
import Footer       from "../components/Footer";
import CartDrawer   from "../components/CartDrawer";

/* ─── tiny helpers ─────────────────────────────────────── */
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function ImgFallback({ src, alt, style }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ ...style, background: C.creamDeep }} />;
  return (
    <img
      src={src} alt={alt}
      loading="lazy" decoding="async"
      onError={() => setErr(true)}
      style={{ ...style, objectFit: "cover" }}
    />
  );
}

function RelatedCard({ product, onAdd }) {
  const navigate = useNavigate();
  const [added,  setAdded]  = useState(false);

  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    onAdd({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }, [onAdd, product]);

  return (
    <div
      onClick={() => { navigate(`/product/${product.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      style={{
        cursor: "pointer",
        background: C.cream,
        border: `1px solid ${C.line}`,
        borderRadius: 0,
        overflow: "hidden",
        transition: "box-shadow 0.25s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,129,143,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "relative", paddingBottom: "120%", overflow: "hidden" }}>
        <ImgFallback
          src={product.img} alt={product.name}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 400, color: C.charcoal, marginBottom: 4, lineHeight: 1.2 }}>
          {product.name}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: C.slate }}>
            {fmt(product.price)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: added ? C.rose : C.charcoal,
              color: "#fff", border: "none", borderRadius: 0,
              padding: "7px 12px", fontSize: 9, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              cursor: "pointer", transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
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
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { products, loading, error } = useProducts();
  const { settings }                 = useSiteSettings();
  useReveal();

  const {
    cart, cartOpen, cartBouncing, wishlist, cartCount,
    addToCart, updateQty, removeItem, toggleWish,
    openCart, closeCart, clearCart,
  } = useCart();

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [products, product]);

  /* local page state */
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty,          setQty]          = useState(1);
  const [added,        setAdded]        = useState(false);
  const [sizeError,    setSizeError]    = useState(false);

  /* reset when product changes */
  useEffect(() => {
    setSelectedSize(null);
    setQty(1);
    setAdded(false);
    setSizeError(false);
  }, [id]);

  const hasSizes  = product?.sizes?.length > 0;
  const wished    = wishlist.has(product?.id);

  const handleAdd = useCallback(() => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({ ...product, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, product, selectedSize, qty, hasSizes]);

  /* ── loading / error / not found states ── */
  const shell = (content) => (
    <>
      <SiteHead settings={settings} />
      <GlobalStyles />
      <Navbar cartCount={cartCount} onCartOpen={openCart} cartBouncing={cartBouncing} settings={settings} />
      <main style={{ minHeight: "70vh", paddingTop: 96 }}>{content}</main>
      <Footer settings={settings} />
      <CartDrawer
        open={cartOpen} onClose={closeCart} cart={cart}
        updateQty={updateQty} removeItem={removeItem}
        onOrderSuccess={clearCart} settings={settings}
      />
    </>
  );

  if (loading) return shell(
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div className="img-placeholder" style={{ borderRadius: 4, paddingBottom: "130%", position: "relative" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[240, 120, 80, 160, 48].map((w, i) => (
            <div key={i} className="img-placeholder" style={{ height: 20, width: w, borderRadius: 3 }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return shell(
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 300, color: C.mist }}>
        Unable to load this product.
      </p>
    </div>
  );

  if (!product) return shell(
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 300, color: C.espresso, marginBottom: 8 }}>
        Product not found
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mist, marginBottom: 32 }}>
        This item may no longer be available.
      </p>
      <Link to="/#menu" style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em",
        textTransform: "uppercase", color: C.espresso, textDecoration: "none",
        borderBottom: `1px solid ${C.espresso}`, paddingBottom: 2 }}>
        View all products
      </Link>
    </div>
  );

  /* ── full page ── */
  return (
    <>
      <SiteHead settings={settings} />
      <GlobalStyles />

      <Navbar
        cartCount={cartCount} onCartOpen={openCart}
        cartBouncing={cartBouncing} settings={settings}
      />

      <main style={{ paddingTop: 80 }}>

        {/* ── Breadcrumb ─────────────────────────── */}
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <Link to="/" style={crumbStyle}> Home </Link>
          <ChevronRight size={11} color={C.mist} />
          <Link to="/#menu" style={crumbStyle}>{product.category || "Shop"}</Link>
          <ChevronRight size={11} color={C.mist} />
          <span style={{ ...crumbStyle, color: C.espresso, cursor: "default" }}>{product.name}</span>
        </nav>

        {/* ── Back button ────────────────────────── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px 0" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500,
              letterSpacing: "0.08em", color: C.mist,
              padding: 0, textTransform: "uppercase",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.espresso; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.mist; }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        {/* ── Main product layout ─────────────────── */}
        <div
          style={{
            maxWidth: 1200, margin: "0 auto",
            padding: "32px 24px 72px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "clamp(32px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* Left: Image */}
          <div style={{ position: "sticky", top: 96 }}>
            <div style={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              background: C.creamDeep,
              paddingBottom: "130%",
            }}>
              <ImgFallback
                src={product.img}
                alt={product.name}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
              {product.tag && (
                <span style={{
                  position: "absolute", top: 16, left: 16,
                  background: C.rose, color: "#fff",
                  fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  padding: "5px 12px",
                }}>
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div style={{ paddingTop: 8 }}>

            {/* Category eyebrow */}
            {product.category && (
              <p style={{
                fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: C.rose, marginBottom: 12,
              }}>
                {product.category}
              </p>
            )}

            {/* Name */}
            <h1 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)",
              color: C.charcoal, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.01em",
            }}>
              {product.name}
            </h1>

            {/* Price */}
            <p style={{
              fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400,
              color: C.slate, marginBottom: 28, letterSpacing: "0.01em",
            }}>
              {fmt(product.price)}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: C.line, marginBottom: 28 }} />

            {/* Description */}
            {product.desc && (
              <div style={{ marginBottom: 32 }}>
                <p style={{
                  fontFamily: FONT_BODY, fontSize: 14, fontWeight: 300,
                  color: C.mist, lineHeight: 1.75,
                }}>
                  {product.desc}
                </p>
              </div>
            )}

            {/* Sizes */}
            {hasSizes && (
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: C.charcoal, marginBottom: 12,
                }}>
                  Size {selectedSize && <span style={{ color: C.rose, fontWeight: 400 }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(product.sizes || SIZES).map((sz) => {
                    const active = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => { setSelectedSize(sz); setSizeError(false); }}
                        style={{
                          width: 48, height: 48,
                          border: active ? `1.5px solid ${C.rose}` : `1.5px solid ${C.line}`,
                          background: active ? C.rose : "transparent",
                          color: active ? "#fff" : C.mist,
                          borderRadius: 0,
                          fontFamily: FONT_BODY, fontSize: 12, fontWeight: 400,
                          letterSpacing: "0.06em",
                          cursor: "pointer",
                          transition: "background 0.18s, color 0.18s, border-color 0.18s",
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#c0392b", marginTop: 8 }}>
                    Please select a size before adding to cart.
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: C.charcoal, marginBottom: 12,
              }}>
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${C.line}`, width: "fit-content" }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={qtyBtnStyle}
                >
                  <Minus size={13} />
                </button>
                <span style={{
                  fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 400,
                  color: C.espresso, minWidth: 40, textAlign: "center",
                  padding: "0 4px",
                }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={qtyBtnStyle}
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              {/* Add to cart */}
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  background: added ? C.rose : C.charcoal,
                  color: "#fff", border: "none", borderRadius: 0,
                  padding: "16px 24px",
                  fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  cursor: "pointer", transition: "background 0.25s, transform 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onMouseEnter={(e) => { if (!added) e.currentTarget.style.background = C.rose; }}
                onMouseLeave={(e) => { if (!added) e.currentTarget.style.background = C.charcoal; }}
              >
                {added ? <><Check size={14} /> Added to cart</> : "Add to cart"}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWish(product.id)}
                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                style={{
                  width: 52, height: 52, flexShrink: 0,
                  border: `1px solid ${C.line}`,
                  borderRadius: 0, background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.rose; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; }}
              >
                <Heart size={18} fill={wished ? C.rose : "none"} color={wished ? C.rose : C.mist} />
              </button>
            </div>

            {/* Trust line */}
            <div style={{ height: 1, background: C.line, marginBottom: 20 }} />
            <p style={{
              fontFamily: FONT_BODY, fontSize: 11, color: C.mist,
              letterSpacing: "0.04em", lineHeight: 1.7,
            }}>
              Free delivery on orders over PKR 3,000 · Easy 7-day returns
            </p>

          </div>
        </div>

        {/* ── Related products ───────────────────── */}
        {related.length > 0 && (
          <section style={{ background: C.creamDeep, padding: "64px 24px 72px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 36, borderBottom: `1px solid ${C.line}`, paddingBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 9, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: C.rose, marginBottom: 8 }}>
                    From the same collection
                  </p>
                  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: C.charcoal }}>
                    You might also like
                  </h2>
                </div>
                <Link
                  to="/#menu"
                  style={{
                    fontFamily: FONT_BODY, fontSize: 10, fontWeight: 500,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: C.charcoal, textDecoration: "none",
                    borderBottom: `1px solid ${C.charcoal}`,
                    paddingBottom: 2, whiteSpace: "nowrap",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = C.rose; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = C.charcoal; }}
                >
                  View all
                </Link>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 24,
              }}>
                {related.map((p) => (
                  <RelatedCard key={p.id} product={p} onAdd={addToCart} />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer settings={settings} />

      <CartDrawer
        open={cartOpen} onClose={closeCart} cart={cart}
        updateQty={updateQty} removeItem={removeItem}
        onOrderSuccess={clearCart} settings={settings}
      />
    </>
  );
}

const crumbStyle = {
  fontFamily: "inherit",
  fontSize: 11,
  color: C.mist,
  textDecoration: "none",
  letterSpacing: "0.04em",
  transition: "color 0.15s",
};

const qtyBtnStyle = {
  background: "none", border: "none",
  width: 44, height: 44,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: C.mist,
  transition: "color 0.15s",
};
