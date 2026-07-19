// src/context/CartContext.jsx
// Shared cart state — consumed by PublicPage, ProductPage, Navbar, CartDrawer.
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartOpen,     setCartOpen]     = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);
  const [cart,         setCart]         = useState([]);
  const [wishlist,     setWishlist]     = useState(new Set());

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const key = item.selectedSize ? `${item.id}__${item.selectedSize}` : item.id;
      const existing = prev.find((i) => i._key === key);
      if (existing) return prev.map((i) => i._key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, _key: key, qty: item.qty ?? 1 }];
    });
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 450);
  }, []);

  const updateQty  = useCallback((key, delta) =>
    setCart((prev) => prev.map((i) => i._key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)),
  []);

  const removeItem = useCallback((key) =>
    setCart((prev) => prev.filter((i) => i._key !== key)),
  []);

  const toggleWish = useCallback((id) =>
    setWishlist((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    }),
  []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const openCart  = useCallback(() => setCartOpen(true),  []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const clearCart = useCallback(() => setCart([]),        []);

  const value = useMemo(() => ({
    cart, cartOpen, cartBouncing, wishlist, cartCount,
    addToCart, updateQty, removeItem, toggleWish,
    openCart, closeCart, clearCart,
  }), [cart, cartOpen, cartBouncing, wishlist, cartCount,
       addToCart, updateQty, removeItem, toggleWish,
       openCart, closeCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
