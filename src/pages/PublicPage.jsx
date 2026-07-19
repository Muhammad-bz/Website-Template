// src/pages/PublicPage.jsx
// Cart state now lives in CartContext (src/context/CartContext.jsx).
import React from "react";

import { useProducts, useSiteSettings, useReveal } from "../hooks";
import { useCart } from "../context/CartContext";

import GlobalStyles from "../components/GlobalStyles";
import SiteHead from "../components/SiteHead";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection    from "../components/HeroSection";
import TrustStrip     from "../components/TrustStrip";
import FeaturedSection from "../components/FeaturedSection";
import MenuSection    from "../components/MenuSection";
import AboutSection   from "../components/AboutSection";
import ReviewsSection from "../components/ReviewsSection";
import ContactSection from "../components/ContactSection";

import CartDrawer from "../components/CartDrawer";

/* ═══════════════════════════════════════════════
   PUBLIC SITE (customer-facing, no auth required)
═══════════════════════════════════════════════ */
export default function PublicPage() {
  const {
    cart, cartOpen, cartBouncing, wishlist, cartCount,
    addToCart, updateQty, removeItem, toggleWish,
    openCart, closeCart, clearCart,
  } = useCart();

  const { products, loading, error } = useProducts();
  const { settings }                 = useSiteSettings();

  useReveal();

  return (
    <>
      <SiteHead settings={settings} />
      <GlobalStyles />

      <Navbar
        cartCount={cartCount}
        onCartOpen={openCart}
        cartBouncing={cartBouncing}
        settings={settings}
      />

      <main>
        <HeroSection settings={settings} />
        <TrustStrip />
        <FeaturedSection onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish} products={products} loading={loading} error={error} />
        <MenuSection     onAdd={addToCart} wishlist={wishlist} toggleWish={toggleWish} products={products} loading={loading} error={error} />
        <AboutSection settings={settings} />
        <ReviewsSection />
        <ContactSection settings={settings} />
      </main>

      <Footer settings={settings} />

      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        onOrderSuccess={clearCart}
        settings={settings}
      />
    </>
  );
}
