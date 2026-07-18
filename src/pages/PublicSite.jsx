// src/pages/PublicSite.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
import { collection, getDocs, addDoc, getDoc, query, where, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  X,
  Star,
  Plus,
  Minus,
  Menu,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Heart,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Check,
  Shield,
  Award,
  Users,
  Truck,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const C = {
  cream:     "#FAF6EF",
  creamDeep: "#F0E9DC",
  parchment: "#E8DDD0",
  caramel:   "#C8956B",
  chocolate: "#5C3317",
  espresso:  "#2E1A0E",
  gold:      "#C9A84C",
  goldLight: "#E2C97E",
  mist:      "#7A6558",
  line:      "rgba(92,51,23,0.12)",
};

const FONT_DISPLAY = "'Cormorant Garamond', 'Georgia', serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
   Performance optimisations applied:
   - Removed `transition: all` everywhere (use specific props)
   - GPU-composited properties only for animations
   - will-change used sparingly on real animation targets
   - CSS animations use transform/opacity only
═══════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: ${C.cream};
        color: ${C.espresso};
        font-family: ${FONT_BODY};
        overflow-x: hidden;
        max-width: 100%;
      }

      /* Only GPU-composited props in keyframes */
      @keyframes fadeUp     { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn     { from { opacity: 0; } to { opacity: 1; } }
      @keyframes shimmer    { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes floatY     { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
      @keyframes cartBounce { 0%,100% { transform: scale(1); } 40% { transform: scale(1.22); } 70% { transform: scale(0.92); } }
      @keyframes slideInRight { from { transform: translate3d(100%,0,0); } to { transform: translate3d(0,0,0); } }

      /* Reveal utility — only transform + opacity (compositor-only) */
      .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .reveal.visible { opacity: 1; transform: translateY(0); }

      /* Card lift — only transform + box-shadow, NOT layout props */
      .card-lift { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; }
      @media (hover: hover) {
        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(46,26,14,0.12); }
      }

      /* Nav links */
      .nav-link { position: relative; text-decoration: none; transition: color 0.2s; }
      .nav-link::after {
        content: '';
        position: absolute; bottom: -3px; left: 0;
        width: 0; height: 1.5px;
        background: ${C.gold};
        transition: width 0.25s ease;
      }
      .nav-link:hover::after { width: 100%; }
      .nav-link:hover { color: ${C.caramel} !important; }

      /* Buttons — specific transitions, not 'all' */
      .btn-primary {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 14px 28px;
        background: ${C.chocolate}; color: ${C.cream};
        font-family: ${FONT_BODY}; font-size: 12px; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase;
        border: none; border-radius: 3px; cursor: pointer;
        transition: background 0.2s, transform 0.15s;
        text-decoration: none; white-space: nowrap;
      }
      .btn-primary:hover { background: ${C.espresso}; transform: translateY(-1px); }
      .btn-primary:active { transform: translateY(0); }

      .btn-gold {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 14px 28px;
        background: ${C.gold}; color: ${C.espresso};
        font-family: ${FONT_BODY}; font-size: 12px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        border: none; border-radius: 3px; cursor: pointer;
        transition: background 0.2s, transform 0.15s; white-space: nowrap;
      }
      .btn-gold:hover { background: ${C.goldLight}; transform: translateY(-1px); }

      .cart-bounce { animation: cartBounce 0.4s ease; }

      /* Shimmer placeholder */
      .img-placeholder {
        background: linear-gradient(90deg, ${C.creamDeep} 25%, ${C.parchment} 50%, ${C.creamDeep} 75%);
        background-size: 200% 100%;
        animation: shimmer 1.8s infinite;
      }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: ${C.creamDeep}; }
      ::-webkit-scrollbar-thumb { background: ${C.caramel}; border-radius: 3px; }

      .divider { width: 56px; height: 1.5px; background: ${C.gold}; margin: 0 auto 20px; }
      .divider.left { margin-left: 0; }

      input, textarea, select { font-family: ${FONT_BODY}; }

      /* Responsive helpers */
      @media (max-width: 768px)  { .hide-mobile  { display: none !important; } }
      @media (min-width: 769px)  { .hide-desktop { display: none !important; } }

      /* Product grids */
      .product-grid-featured { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .product-grid          { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      @media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 900px)  { .product-grid-featured { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 640px)  {
        .product-grid-featured { grid-template-columns: 1fr; }
        .product-grid          { grid-template-columns: 1fr; }
      }

      /* About section */
      .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
      @media (max-width: 860px) {
        .about-grid { grid-template-columns: 1fr; gap: 40px; }
        .about-image-col { order: -1; }
      }

      /* Contact section */
      .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
      @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; gap: 48px; } }

      /* Footer */
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
      @media (max-width: 760px) {
        .footer-grid { grid-template-columns: 1fr 1fr; }
        .footer-brand { grid-column: 1 / -1; }
      }
      @media (max-width: 480px) {
        .footer-grid { grid-template-columns: 1fr; }
        .footer-brand { grid-column: auto; }
      }

      /* Trust strip */
      .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 700px) { .trust-grid { grid-template-columns: repeat(2, 1fr); } }

      /* Section padding */
      .section-pad { padding: 80px 5%; }
      @media (max-width: 640px) { .section-pad { padding: 56px 5%; } }

      /* Stats row */
      .stats-row { display: flex; gap: 36px; flex-wrap: wrap; }

      /* Cart drawer — GPU-composited slide */
      .cart-drawer {
        position: fixed; top: 0; right: 0; bottom: 0;
        width: min(420px, 100vw);
        background: ${C.cream};
        z-index: 2001;
        display: flex; flex-direction: column;
        animation: slideInRight 0.3s cubic-bezier(0.16,1,0.3,1);
        box-shadow: -8px 0 40px rgba(46,26,14,0.15);
        will-change: transform;
      }

      /* ── Checkout form inside cart drawer ── */
      .checkout-field {
        display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px;
      }
      .checkout-label {
        font-family: ${FONT_BODY}; font-size: 10.5px; font-weight: 600;
        letter-spacing: 0.07em; text-transform: uppercase; color: ${C.mist};
      }
      .checkout-input {
        font-family: ${FONT_BODY}; font-size: 13.5px; color: ${C.espresso};
        background: ${C.creamDeep}; border: 1px solid ${C.line};
        border-radius: 5px; padding: 10px 12px; outline: none; width: 100%;
        box-sizing: border-box;
        transition: border-color 0.18s, box-shadow 0.18s;
      }
      .checkout-input:focus {
        border-color: ${C.gold};
        box-shadow: 0 0 0 3px rgba(201,168,76,0.13);
      }
      .checkout-input.error { border-color: #C0392B; }
      .checkout-error {
        font-family: ${FONT_BODY}; font-size: 11px; color: #C0392B;
      }
      .checkout-back-btn {
        background: none; border: none; cursor: pointer;
        font-family: ${FONT_BODY}; font-size: 12px; font-weight: 600;
        color: ${C.mist}; letter-spacing: 0.05em; text-transform: uppercase;
        display: inline-flex; align-items: center; gap: 5px;
        padding: 0; margin-bottom: 18px;
        transition: color 0.18s;
      }
      .checkout-back-btn:hover { color: ${C.chocolate}; }

      /* ── Order success screen ── */
      .order-success {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; text-align: center;
        padding: 48px 28px; flex: 1;
        animation: fadeUp 0.45s ease;
      }
      .order-success-icon {
        width: 64px; height: 64px; border-radius: 50%;
        background: rgba(34,139,70,0.10);
        border: 1.5px solid rgba(34,139,70,0.28);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      }

      /* Reduce motion */
      @media (prefers-reduced-motion: reduce) {
        .reveal { transition: none; }
        * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL HOOK
   FIXED: Only runs once on mount and tears down properly.
   Uses a single long-lived IntersectionObserver with a
   MutationObserver to pick up newly-added .reveal nodes.
═══════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target); // stop watching once visible
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    // Observe all current .reveal elements
    const observe = () =>
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));

    observe();

    // Watch for DOM mutations to pick up newly mounted components
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []); // runs ONCE on mount
}

/* ═══════════════════════════════════════════════
   IMAGES
═══════════════════════════════════════════════ */
const IMG = {
  hero:       "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=85&auto=format&fit=crop",
  about:      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85&auto=format&fit=crop",
  aboutSmall: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=85&auto=format&fit=crop",
  rev1:       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85&auto=format&fit=crop&crop=face",
  rev2:       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=85&auto=format&fit=crop&crop=face",
  rev3:       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=85&auto=format&fit=crop&crop=face",
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const CAT_IMGS = {
  "Category A":    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&auto=format&fit=crop",
  "Category B":  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop",
  "Category C":"https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80&auto=format&fit=crop",
  "Category D":  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80&auto=format&fit=crop",
  "Category E":    "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&q=80&auto=format&fit=crop",
  "Category F":      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80&auto=format&fit=crop",
  "Category G":         "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80&auto=format&fit=crop",
  "Category H":      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80&auto=format&fit=crop",
  "Category I":        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80&auto=format&fit=crop",
  "Category J":         "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80&auto=format&fit=crop",
  "Category K":    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80&auto=format&fit=crop",
  "Category L":    "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80&auto=format&fit=crop",
  "Category M":"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80&auto=format&fit=crop",
  "Category N":      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&q=80&auto=format&fit=crop",
  "Category O":     "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80&auto=format&fit=crop",
  "Category P":         "https://images.unsplash.com/photo-1621188988909-fbef0a88dc04?w=600&q=80&auto=format&fit=crop",
  "Category Q":  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80&auto=format&fit=crop",
  "Category R": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80&auto=format&fit=crop",
  "Category S":        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop",
};

const FEAT1 = "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&q=85&auto=format&fit=crop";
const fallbackImg = (cat) => CAT_IMGS[cat] || FEAT1;

const MENU_DATA = [
  { id:  1, category: "Category A",  name: "Product A1",   price: 920  },
  { id:  2, category: "Category A",  name: "Product A2",   price: 920  },
  { id:  3, category: "Category B",  name: "Product B1",   price: 1680 },
  { id:  4, category: "Category B",  name: "Product B2",   price: 1680 },
  { id:  5, category: "Category B",  name: "Product B3",   price: 1850 },
  { id:  6, category: "Category B",  name: "Product B4",   price: 1850 },
  { id:  7, category: "Category B",  name: "Product B5",   price: 1850 },
  { id:  8, category: "Category B",  name: "Product B6",   price: 1850 },
  { id:  9, category: "Category B",  name: "Product B7",   price: 1890 },
  { id: 10, category: "Category B",  name: "Product B8",   price: 2160 },
  { id: 11, category: "Category C",  name: "Product C1",   price: 1290 },
  { id: 12, category: "Category C",  name: "Product C2",   price: 1290 },
  { id: 13, category: "Category C",  name: "Product C3",   price: 2160 },
  { id: 14, category: "Category C",  name: "Product C4",   price: 2160 },
  { id: 15, category: "Category C",  name: "Product C5",   price: 2160 },
  { id: 16, category: "Category C",  name: "Product C6",   price: 1750 },
  { id: 17, category: "Category C",  name: "Product C7",   price: 1890 },
  { id: 18, category: "Category D",  name: "Product D1",   price: 2770 },
  { id: 19, category: "Category D",  name: "Product D2",   price: 2800 },
  { id: 20, category: "Category D",  name: "Product D3",   price: 2980 },
  { id: 21, category: "Category D",  name: "Product D4",   price: 2810 },
  { id: 22, category: "Category D",  name: "Product D5",   price: 2810 },
  { id: 23, category: "Category D",  name: "Product D6",   price: 2980 },
  { id: 24, category: "Category D",  name: "Product D7",   price: 2980 },
  { id: 25, category: "Category D",  name: "Product D8",   price: 2980 },
  { id: 26, category: "Category D",  name: "Product D9",   price: 2670 },
  { id: 27, category: "Category D",  name: "Product D10",  price: 2810 },
  { id: 28, category: "Category E",  name: "Product E1",   price: 550  },
  { id: 29, category: "Category E",  name: "Product E2",   price: 600  },
  { id: 30, category: "Category F",  name: "Product F1",   price: 250  },
  { id: 31, category: "Category F",  name: "Product F2",   price: 250  },
  { id: 32, category: "Category F",  name: "Product F3",   price: 250  },
  { id: 33, category: "Category G",  name: "Product G1",   price: 250  },
  { id: 34, category: "Category H",  name: "Product H1",   price: 1250 },
  { id: 35, category: "Category H",  name: "Product H2",   price: 950  },
  { id: 36, category: "Category I",  name: "Product I1",   price: 350  },
  { id: 37, category: "Category I",  name: "Product I2",   price: 350  },
  { id: 38, category: "Category I",  name: "Product I3",   price: 350  },
  { id: 39, category: "Category I",  name: "Product I4",   price: 350  },
  { id: 40, category: "Category I",  name: "Product I5",   price: 440  },
  { id: 41, category: "Category I",  name: "Product I6",   price: 450  },
  { id: 42, category: "Category I",  name: "Product I7",   price: 400  },
  { id: 43, category: "Category J",  name: "Product J1",   price: 500  },
  { id: 44, category: "Category J",  name: "Product J2",   price: 550  },
  { id: 45, category: "Category J",  name: "Product J3",   price: 450  },
  { id: 46, category: "Category J",  name: "Product J4",   price: 450  },
  { id: 47, category: "Category K",  name: "Product K1",   price: 450  },
  { id: 48, category: "Category K",  name: "Product K2",   price: 450  },
  { id: 49, category: "Category L",  name: "Product L1",   price: 550  },
  { id: 50, category: "Category L",  name: "Product L2",   price: 600  },
  { id: 51, category: "Category L",  name: "Product L3",   price: 575  },
  { id: 52, category: "Category L",  name: "Product L4",   price: 575  },
  { id: 53, category: "Category L",  name: "Product L5",   price: 300  },
  { id: 54, category: "Category L",  name: "Product L6",   price: 250  },
  { id: 55, category: "Category M",  name: "Product M1",   price: 230  },
  { id: 56, category: "Category M",  name: "Product M2",   price: 300  },
  { id: 57, category: "Category M",  name: "Product M3",   price: 280  },
  { id: 58, category: "Category M",  name: "Product M4",   price: 250  },
  { id: 59, category: "Category M",  name: "Product M5",   price: 230  },
  { id: 60, category: "Category M",  name: "Product M6",   price: 245  },
  { id: 61, category: "Category N",  name: "Product N1",   price: 250  },
  { id: 62, category: "Category N",  name: "Product N2",   price: 230  },
  { id: 63, category: "Category N",  name: "Product N3",   price: 240  },
  { id: 64, category: "Category N",  name: "Product N4",   price: 240  },
  { id: 65, category: "Category O",  name: "Product O1",   price: 235  },
  { id: 66, category: "Category O",  name: "Product O2",   price: 250  },
  { id: 67, category: "Category P",  name: "Product P1",   price: 250  },
  { id: 68, category: "Category P",  name: "Product P2",   price: 250  },
  { id: 69, category: "Category Q",  name: "Product Q1",   price: 250  },
  { id: 70, category: "Category Q",  name: "Product Q2",   price: 280  },
  { id: 71, category: "Category Q",  name: "Product Q3",   price: 120  },
  { id: 72, category: "Category Q",  name: "Product Q4",   price: 280  },
  { id: 73, category: "Category R",  name: "Product R1",   price: 760  },
  { id: 74, category: "Category R",  name: "Product R2",   price: 960  },
  { id: 75, category: "Category R",  name: "Product R3",   price: 845  },
  { id: 76, category: "Category R",  name: "Product R4",   price: 845  },
  { id: 77, category: "Category R",  name: "Product R5",   price: 650  },
  { id: 78, category: "Category R",  name: "Product R6",   price: 1980 },
  { id: 79, category: "Category S",  name: "Product S1",   price: 250  },
  { id: 80, category: "Category S",  name: "Product S2",   price: 290  },
].map((p) => ({ ...p, img: fallbackImg(p.category), desc: "" }));

const FEATURED = [
  { ...MENU_DATA.find(p => p.id === 14), tag: "Fan Favourite", desc: "A customer favourite — consistently excellent quality and great value." },
  { ...MENU_DATA.find(p => p.id === 28), tag: "Must Try",      desc: "Our signature item — distinctive, reliable, and impossible to pass up." },
  { ...MENU_DATA.find(p => p.id === 44), tag: "Staff Pick",    desc: "A top recommendation from our team — premium quality, outstanding value." },
];

const ALL_CATEGORIES = [...new Set(MENU_DATA.map(p => p.category))];

const REVIEWS = [
  { name: "Sana Malik",    img: IMG.rev1, stars: 5, role: "Lifestyle Blogger",  text: "The selection and quality here are unmatched. Every product I have ordered has exceeded my expectations. I keep coming back." },
  { name: "Ahmed Raza",    img: IMG.rev2, stars: 5, role: "Regular Customer",   text: "I ordered a gift for a friend and the packaging and quality were outstanding. The whole experience from checkout to delivery was flawless." },
  { name: "Nadia Hussain", img: IMG.rev3, stars: 5, role: "Verified Buyer",     text: "This is my go-to store for quality finds. People always ask where I get them from. Your Store never disappoints." },
];

const fmt = (n) => `Rs. ${n.toLocaleString()}`;

/* ═══════════════════════════════════════════════
   FIRESTORE PRODUCTS HOOK
   - Fetches only available === true products
   - Sorts: featured first, then original order preserved
═══════════════════════════════════════════════ */
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const q = query(
          collection(db, "products"),
          where("available", "==", true)
        );
        const snapshot = await getDocs(q);
        if (cancelled) return;

        const raw = snapshot.docs.map((doc) => ({
          id:       doc.id,
          name:     doc.data().name     ?? "",
          price:    doc.data().price    ?? 0,
          category: doc.data().category ?? "",
          img:      doc.data().img      ?? doc.data().imageUrl ?? fallbackImg(doc.data().category),
          desc:     doc.data().desc     ?? doc.data().description ?? "",
          tag:      doc.data().tag      ?? "",
          featured: doc.data().featured ?? false,
          available:doc.data().available,
          // preserve any original ordering field if present
          order:    doc.data().order    ?? 0,
        }));

        // featured first, then rest in their original relative order
        const featured    = raw.filter((p) => p.featured);
        const nonFeatured = raw.filter((p) => !p.featured);
        setProducts([...featured, ...nonFeatured]);
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load products.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

/* ═══════════════════════════════════════════════
   SITE SETTINGS HOOK
   Reads from Firestore settings/site document.
   Falls back to hardcoded values for every field.
═══════════════════════════════════════════════ */
const SITE_DEFAULTS = {
  storeName:         "Your Store",
  tagline:           "Quality Products · Online Store",
  logoUrl:           "",
  faviconUrl:        "",
  heroBannerUrl:     "",
  aboutImageUrl:     "",
  aboutText:         "",
  themeColor:        "#C9A84C",
  accentColor:       "#5C3317",
  phone:             "",
  whatsapp:          "",
  email:             "hello@yourstore.com",
  address:           "",
  mapsEmbedUrl:      "",
  instagram:         "",
  facebook:          "",
  tiktok:            "",
  youtube:           "",
  openingTime:       "07:00",
  closingTime:       "21:00",
  closedDays:        [],
  deliveryFee:       "",
  minimumOrder:      "",
  currency:          "PKR",
  currencySymbol:    "Rs.",
  heroTitle:         "Quality You Can Count On",
  heroSubtitle:      "Discover our curated collection of premium products.",
  heroButtonText:    "Shop Now",
  seoTitle:          "Your Store — Shop Online",
  metaDescription:   "Shop our curated selection of quality products. Fast delivery, easy checkout, and great prices.",
  metaKeywords:      "online store, shop, products, ecommerce, your store",
  canonicalUrl:      "",
  robots:            "index",
  ogImageUrl:        "",
  twitterImageUrl:   "",
  ga4Id:             "",
  gtmId:             "",
  fbPixelId:         "",
  gscVerification:   "",
  googleBusinessUrl: "",
  latitude:          "",
  longitude:         "",
  cuisineType:       "Retail, E-Commerce",
  priceRange:        "$$",
  deliveryAvailable: true,
  pickupAvailable:   true,
};

function useSiteSettings() {
  const [settings, setSettings] = useState(SITE_DEFAULTS);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      try {
        const snap = await getDoc(doc(db, "settings", "site"));
        if (!cancelled && snap.exists()) {
          setSettings({ ...SITE_DEFAULTS, ...snap.data() });
        }
      } catch (err) {
        // silently fall back to defaults
        console.warn("Could not load site settings, using defaults.", err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  return { settings, loaded };
}

/* ─────────────────────────────────────────────────
   SITE HEAD MANAGER
   Applies document.title, favicon, meta tags,
   Open Graph, Twitter Card, JSON-LD structured data.
───────────────────────────────────────────────── */
function SiteHead({ settings }) {
  useEffect(() => {
    const s = settings;

    /* ── document.title ── */
    document.title = s.seoTitle || s.storeName || "Your Store";

    /* ── Favicon ── */
    if (s.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = s.faviconUrl;
    }

    /* ── Theme color ── */
    let themeMeta = document.querySelector("meta[name='theme-color']");
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = s.themeColor || "#C9A84C";

    /* helper: ensure/update a <meta> by name or property */
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}='${key}']`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = content;
    };

    /* helper: ensure/update a <link> by rel */
    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel='${rel}']`);
      if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };

    /* helper: ensure/update a <script type="application/ld+json"> by id */
    const setJsonLd = (id, data) => {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("script");
        el.type = "application/ld+json";
        el.id   = id;
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
    };

    /* ── Standard meta ── */
    setMeta("name", "description", s.metaDescription);
    setMeta("name", "keywords",    s.metaKeywords);
    setMeta("name", "robots",      s.robots === "noindex" ? "noindex,nofollow" : "index,follow");
    if (s.gscVerification) setMeta("name", "google-site-verification", s.gscVerification);

    /* ── Canonical ── */
    setLink("canonical", s.canonicalUrl);

    /* ── Open Graph ── */
    setMeta("property", "og:title",       s.seoTitle || s.storeName);
    setMeta("property", "og:description", s.metaDescription);
    setMeta("property", "og:type",        "website");
    setMeta("property", "og:url",         s.canonicalUrl);
    setMeta("property", "og:image",       s.ogImageUrl);
    setMeta("property", "og:site_name",   s.storeName);

    /* ── Twitter Card ── */
    setMeta("name", "twitter:card",        "summary_large_image");
    setMeta("name", "twitter:title",       s.seoTitle || s.storeName);
    setMeta("name", "twitter:description", s.metaDescription);
    setMeta("name", "twitter:image",       s.twitterImageUrl || s.ogImageUrl);

    /* ── Analytics: GA4 ── */
    if (s.ga4Id && !document.getElementById("ga4-script")) {
      const sc1 = document.createElement("script");
      sc1.id  = "ga4-script";
      sc1.src = `https://www.googletagmanager.com/gtag/js?id=${s.ga4Id}`;
      sc1.async = true;
      document.head.appendChild(sc1);
      const sc2 = document.createElement("script");
      sc2.id   = "ga4-inline";
      sc2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.ga4Id}');`;
      document.head.appendChild(sc2);
    }

    /* ── Analytics: GTM ── */
    if (s.gtmId && !document.getElementById("gtm-script")) {
      const sc = document.createElement("script");
      sc.id   = "gtm-script";
      sc.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.gtmId}');`;
      document.head.appendChild(sc);
    }

    /* ── Analytics: Facebook Pixel ── */
    if (s.fbPixelId && !document.getElementById("fb-pixel-script")) {
      const sc = document.createElement("script");
      sc.id   = "fb-pixel-script";
      sc.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.fbPixelId}');fbq('track','PageView');`;
      document.head.appendChild(sc);
    }

    /* ── JSON-LD: Organization ── */
    setJsonLd("jsonld-organization", {
      "@context": "https://schema.org",
      "@type":    "Organization",
      "name":     s.storeName || "Your Store",
      "url":      s.canonicalUrl || undefined,
      "logo":     s.logoUrl    || undefined,
      "contactPoint": s.phone ? [{
        "@type": "ContactPoint",
        "telephone":    s.phone,
        "contactType":  "customer service",
      }] : undefined,
      "sameAs": [s.instagram, s.facebook, s.youtube, s.tiktok, s.googleBusinessUrl].filter(Boolean),
    });

    /* ── JSON-LD: LocalBusiness / Restaurant ── */
    const hoursSpec = [];
    const allDays   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const openDays  = allDays.filter((d) => !(s.closedDays || []).includes(d));
    if (openDays.length && s.openingTime && s.closingTime) {
      hoursSpec.push({
        "@type":     "OpeningHoursSpecification",
        "dayOfWeek": openDays.map((d) => `https://schema.org/${d}`),
        "opens":     s.openingTime,
        "closes":    s.closingTime,
      });
    }

    setJsonLd("jsonld-localbusiness", {
      "@context":       "https://schema.org",
      "@type":          ["Store", "LocalBusiness"],
      "name":           s.storeName || "Your Store",
      "description":    s.metaDescription || undefined,
      "url":            s.canonicalUrl    || undefined,
      "telephone":      s.phone           || undefined,
      "email":          s.email           || undefined,
      "image":          s.ogImageUrl || s.heroBannerUrl || undefined,
      "logo":           s.logoUrl         || undefined,
      "priceRange":     s.priceRange      || "$$",
      "description":    s.metaDescription || undefined,
      "hasMap":         s.googleBusinessUrl || undefined,
      "address":        s.address ? {
        "@type":           "PostalAddress",
        "streetAddress":   s.address,
      } : undefined,
      "geo": (s.latitude && s.longitude) ? {
        "@type":     "GeoCoordinates",
        "latitude":  parseFloat(s.latitude),
        "longitude": parseFloat(s.longitude),
      } : undefined,
      "openingHoursSpecification": hoursSpec.length ? hoursSpec : undefined,
      "hasDeliveryMethod":  s.deliveryAvailable ? "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload" : undefined,
      "sameAs": [s.instagram, s.facebook, s.youtube, s.tiktok, s.googleBusinessUrl].filter(Boolean),
    });

  }, [settings]);

  return null;
}



/* ═══════════════════════════════════════════════
   HERO SECTION — SIMPLE E-COMMERCE
═══════════════════════════════════════════════ */
function HeroSection({ settings = {} }) {
  const scrollToShop = useCallback(() =>
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" }),
  []);

  return (
    <section
      style={{ position: "relative", height: "100vh", minHeight: 560, overflow: "hidden" }}
      aria-label={`Welcome to ${settings.storeName || "Your Store"}`}
    >
      {/* Background image */}
      <img
        src={settings.heroBannerUrl || IMG.hero}
        alt={`${settings.storeName || "Your Store"} hero`}
        fetchPriority="high"
        decoding="sync"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          userSelect: "none", pointerEvents: "none",
        }}
        draggable={false}
      />
      {/* Dark overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(20,8,2,0.48) 0%, rgba(20,8,2,0.30) 50%, rgba(20,8,2,0.60) 100%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "0 6%",
      }}>
        <p style={{
          fontFamily: FONT_BODY, fontSize: "clamp(9px, 1.1vw, 11px)",
          letterSpacing: "0.34em", textTransform: "uppercase",
          color: C.goldLight, marginBottom: 20,
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          {settings.tagline || "Quality Products · Online Store"}
        </p>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 300,
          fontSize: "clamp(42px, 10vw, 112px)",
          lineHeight: 0.92, color: C.cream,
          letterSpacing: "0.10em", marginBottom: 20,
          textShadow: "0 4px 32px rgba(0,0,0,0.55)",
          animation: "fadeUp 0.7s ease 0.2s both",
        }}>
          {(settings.storeName || "YOUR STORE").toUpperCase()}
        </h1>
        <div style={{
          width: 52, height: 1,
          background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          margin: "0 auto 22px",
          animation: "fadeIn 0.7s ease 0.35s both",
        }} />
        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(15px, 2.4vw, 26px)",
          color: C.goldLight, letterSpacing: "0.07em", marginBottom: 46,
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          animation: "fadeUp 0.7s ease 0.3s both",
        }}>
          {settings.heroSubtitle || "Discover our curated collection of premium products."}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.7s ease 0.45s both" }}>
          <button
            className="btn-gold"
            onClick={scrollToShop}
            style={{ fontSize: 11, letterSpacing: "0.16em", padding: "16px 40px", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}
          >
            Shop Now <ArrowRight size={13} style={{ marginLeft: 4 }} />
          </button>
          <button
            className="btn-primary"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 11, letterSpacing: "0.16em", padding: "16px 32px" }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 36, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
        pointerEvents: "none",
        animation: "fadeIn 1s ease 1s both",
      }}>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 9,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "rgba(250,246,239,0.55)",
          textShadow: "0 1px 8px rgba(0,0,0,0.5)",
        }}>
          Scroll to explore
        </p>
        <ChevronDown size={15} color="rgba(250,246,239,0.45)" style={{ animation: "floatY 1.9s ease infinite" }} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
   PERF: transition now specifies only 'background-color, padding, border-color'
         instead of 'all' — prevents layout recalculation on every transition tick.
         backdropFilter only applied when actually scrolled.
═══════════════════════════════════════════════ */
function Navbar({ cartCount, onCartOpen, cartBouncing, settings = {} }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let rafId = null;
    let last  = false;
    const check = () => {
      const s = window.scrollY > 80;
      if (s !== last) { last = s; setScrolled(s); }
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = useCallback((id) => {
    setMobileOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const navLinks = useMemo(() => [
    { label: "Featured", id: "featured" },
    { label: "Menu",     id: "menu"     },
    { label: "About",    id: "about"    },
    { label: "Contact",  id: "contact"  },
  ], []);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: scrolled ? "12px 5%" : "20px 5%",
          background: scrolled ? "rgba(250,246,239,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.line}` : "none",
          /* Only transition specific cheap props — NOT 'all' */
          transition: "background-color 0.35s ease, padding 0.35s ease, border-color 0.35s ease",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          willChange: "background-color",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "flex-start",
            flexShrink: 0,
          }}
          aria-label="Back to top"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.storeName || "Your Store"}
              style={{ height: 36, maxWidth: 140, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <span style={{
                fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 400,
                color: scrolled ? C.espresso : C.cream,
                letterSpacing: "0.06em", lineHeight: 1,
                transition: "color 0.3s",
              }}>
                {settings.storeName || "Your Store"}
              </span>
              <span style={{
                fontFamily: FONT_BODY, fontSize: 8, letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: scrolled ? C.gold : "rgba(228,199,126,0.9)",
                marginTop: 2,
                transition: "color 0.3s",
              }}>
                {settings.tagline || "Online Store"}
              </span>
            </>
          )}
        </button>

        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map((l) => (
            <button
              key={l.id}
              className="nav-link"
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
                color: scrolled ? C.espresso : "rgba(250,246,239,0.92)",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onCartOpen}
            className={cartBouncing ? "cart-bounce" : ""}
            aria-label={`Cart (${cartCount} items)`}
            style={{
              position: "relative", background: "none", border: "none",
              cursor: "pointer",
              color: scrolled ? C.espresso : C.cream,
              padding: 6,
              transition: "color 0.3s",
            }}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                width: 17, height: 17,
                background: C.caramel, borderRadius: "50%",
                fontSize: 9, fontWeight: 700, color: C.cream,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="hide-desktop"
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: scrolled ? C.espresso : C.cream,
              padding: 6,
              transition: "color 0.3s",
            }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1100,
          background: C.espresso,
          display: "flex", flexDirection: "column",
          padding: "0 7%",
          animation: "fadeIn 0.22s ease",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 0",
            borderBottom: "1px solid rgba(250,246,239,0.08)",
          }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.cream, letterSpacing: "0.06em" }}>
              {settings.storeName || "Your Store"}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.cream, padding: 4 }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", paddingTop: 16, flex: 1 }}>
            {navLinks.map((l, i) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 300,
                  color: C.cream, padding: "14px 0",
                  borderBottom: "1px solid rgba(250,246,239,0.07)",
                  animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, padding: "28px 0" }}>
            {(settings.instagram || "#") && <a href={settings.instagram || "#"} target="_blank" rel="noopener noreferrer" style={{ color: C.gold }} aria-label="Instagram"><Instagram size={20} /></a>}
            {(settings.facebook  || "#") && <a href={settings.facebook  || "#"} target="_blank" rel="noopener noreferrer" style={{ color: C.gold }} aria-label="Facebook"><Facebook size={20} /></a>}
          </div>
        </div>
      )}
    </>
  );
}

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

/* ═══════════════════════════════════════════════
   SECTION HEADER — memoised (pure display)
═══════════════════════════════════════════════ */
const SectionHeader = memo(function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div className="reveal" style={{ textAlign: center ? "center" : "left", marginBottom: 44 }}>
      {eyebrow && (
        <p style={{
          fontFamily: FONT_BODY, fontSize: 10,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: C.gold, marginBottom: 12,
        }}>
          {eyebrow}
        </p>
      )}
      <div className={`divider${center ? "" : " left"}`} />
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 300,
        fontSize: "clamp(30px, 5vw, 52px)",
        color: C.espresso, lineHeight: 1.1, marginTop: 16,
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 15,
          color: C.mist, maxWidth: 500,
          margin: center ? "12px auto 0" : "12px 0 0",
          lineHeight: 1.7,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
});

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
        contain: "layout style", // layout containment for perf
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

/* ═══════════════════════════════════════════════
   FEATURED SECTION
═══════════════════════════════════════════════ */
function FeaturedSection({ onAdd, wishlist, toggleWish, products, loading, error }) {
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

/* ═══════════════════════════════════════════════
   MENU SECTION
   PERF: visible list is memoised — only recalculates
         when filter/sort state actually changes.
         Category pills use stable callbacks.
═══════════════════════════════════════════════ */
function MenuSection({ onAdd, wishlist, toggleWish, products, loading, error }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query,          setQuery]          = useState("");
  const [sort,           setSort]           = useState("default");
  const scrollRef = useRef(null);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const visible = useMemo(() => {
    const lower = query.toLowerCase();
    return products
      .filter((p) => {
        const matchCat    = activeCategory === "All" || p.category === activeCategory;
        const matchSearch = !query || p.name.toLowerCase().includes(lower) ||
                            p.category.toLowerCase().includes(lower);
        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (sort === "price-asc")  return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "alpha")      return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, activeCategory, query, sort]);

  const handleCat = useCallback((cat) => {
    setActiveCategory(cat);
    setQuery("");
  }, []);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
    setActiveCategory("All");
  }, []);

  const clearQuery = useCallback(() => setQuery(""), []);
  const clearAll   = useCallback(() => { setQuery(""); setActiveCategory("All"); }, []);

  return (
    <section id="menu" className="section-pad" style={{ background: C.creamDeep, paddingTop: 64, paddingBottom: 72 }}>
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Our Full Catalogue"
          title={<>Everything in <em style={{ fontStyle: "italic" }}>Our Store</em></>}
          sub="Browse by category, search for what you need, or just scroll and explore."
        />

        {/* Search + Sort bar */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <input
              type="search"
              placeholder="Search products…"
              value={query}
              onChange={handleQueryChange}
              style={{
                width: "100%", padding: "11px 14px 11px 38px",
                background: C.cream, border: `1px solid ${C.line}`,
                borderRadius: 4, fontFamily: FONT_BODY, fontSize: 13,
                color: C.espresso, outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = C.gold; }}
              onBlur={(e)  => { e.target.style.borderColor = C.line; }}
            />
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={C.mist} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            {query && (
              <button
                onClick={clearQuery}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: C.mist, padding: 2,
                }}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: "11px 14px", background: C.cream,
              border: `1px solid ${C.line}`, borderRadius: 4,
              fontFamily: FONT_BODY, fontSize: 13, color: C.espresso,
              outline: "none", cursor: "pointer", flexShrink: 0,
              appearance: "none", paddingRight: 32,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6558' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="default">Default order</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="alpha">A → Z</option>
          </select>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mist, flexShrink: 0 }}>
            {visible.length} item{visible.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Category pills */}
        <div
          ref={scrollRef}
          style={{
            display: "flex", gap: 8, overflowX: "auto",
            paddingBottom: 16, marginBottom: 36,
            scrollbarWidth: "none", msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCat(cat)}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 30,
                  border: active ? `1.5px solid ${C.gold}` : `1.5px solid ${C.line}`,
                  background: active ? C.espresso : C.cream,
                  color: active ? C.goldLight : C.mist,
                  fontFamily: FONT_BODY, fontSize: 12, fontWeight: active ? 600 : 400,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "background 0.18s, color 0.18s, border-color 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {loading && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="img-placeholder"
                style={{ borderRadius: 4, height: 280 }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 300, color: C.mist }}>
              Unable to load menu.
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mist, marginTop: 8 }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 300, color: C.mist }}>
              No products available right now.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && visible.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: C.mist }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 300 }}>
              No results for &ldquo;{query}&rdquo;
            </p>
            <button
              onClick={clearAll}
              style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer", color: C.gold, fontFamily: FONT_BODY, fontSize: 13 }}
            >
              Clear search
            </button>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} wishlist={wishlist} toggleWish={toggleWish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

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

/* ═══════════════════════════════════════════════
   REVIEWS SECTION
═══════════════════════════════════════════════ */
const ReviewsSection = memo(function ReviewsSection() {
  return (
    <section className="section-pad" style={{ background: C.creamDeep }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Word of mouth"
          title={<>What our <em style={{ fontStyle: "italic" }}>regulars</em> say</>}
          sub="We are proud to serve so many happy customers across the country."
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: 24,
        }}>
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="card-lift reveal"
              style={{
                background: C.cream, borderRadius: 4,
                padding: "28px 24px",
                border: `1px solid ${C.line}`,
                position: "relative",
                contain: "layout style",
              }}
            >
              <span aria-hidden="true" style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: FONT_DISPLAY, fontSize: 64,
                color: C.parchment, lineHeight: 1, userSelect: "none",
              }}>
                &ldquo;
              </span>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={13} fill={C.gold} color={C.gold} />
                ))}
              </div>
              <p style={{
                fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
                color: C.mist, lineHeight: 1.8, marginBottom: 22,
              }}>
                {r.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={r.img}
                  alt={r.name}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, color: C.espresso }}>{r.name}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.gold, marginTop: 1 }}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════
   CONTACT SECTION
═══════════════════════════════════════════════ */
function ContactSection({ settings = {} }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", phone: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  }, []);

  const inputStyle = useMemo(() => ({
    width: "100%", padding: "13px 15px",
    background: "rgba(250,246,239,0.07)",
    border: "1px solid rgba(250,246,239,0.18)",
    borderRadius: 3, color: C.cream,
    fontFamily: FONT_BODY, fontSize: 14, outline: "none",
    transition: "border-color 0.2s",
  }), []);

  return (
    <section id="contact" className="section-pad" style={{ background: C.chocolate }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="contact-grid">
          <div className="reveal">
            <p style={{ fontFamily: FONT_BODY, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>
              Visit Us
            </p>
            <div className="divider left" style={{ background: C.gold }} />
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300,
              fontSize: "clamp(26px, 4vw, 44px)",
              color: C.cream, lineHeight: 1.15,
              margin: "16px 0 24px",
            }}>
              Come find us
              <br />
              <em style={{ fontStyle: "italic" }}>{settings.address ? settings.address.split(",").slice(-2).join(",").trim() : "Your City"}</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <MapPin size={16} />, label: "Address",          value: settings.address  || "Shop No. 10, First Floor (West), Commercial Market, Sector C, Your City" },
                { icon: <Phone size={16} />,  label: "Phone / WhatsApp", value: (settings.phone || settings.whatsapp) ? `${settings.phone || ""}${settings.phone && settings.whatsapp ? " / " : ""}${settings.whatsapp || ""}` : "0313 5932718" },
                { icon: <Mail size={16} />,   label: "Email",            value: settings.email    || "hello@yourstore.com" },
                { icon: <Clock size={16} />,  label: "Hours",            value: settings.openingTime && settings.closingTime ? `${settings.openingTime} – ${settings.closingTime}${(settings.closedDays || []).length ? `\nClosed: ${(settings.closedDays || []).join(", ")}` : ""}` : "Mon – Sat: 7:00 AM – 9:00 PM\nSunday: 8:00 AM – 6:00 PM" },
              ].map((it) => (
                <div key={it.label} style={{ display: "flex", gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: C.goldLight,
                  }}>
                    {it.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: C.gold, marginBottom: 3 }}>
                      {it.label}
                    </p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.8)", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                      {it.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {[
                { Icon: Instagram, href: settings.instagram, label: "Instagram" },
                { Icon: Facebook,  href: settings.facebook,  label: "Facebook"  },
                { Icon: Twitter,   href: "#",                label: "Twitter"   },
              ].filter((s) => s.href).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38, height: 38, borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.goldLight, transition: "background 0.2s, color 0.2s", textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.espresso; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.goldLight; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
            {settings.mapsEmbedUrl && (
              <div style={{ marginTop: 28, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(201,168,76,0.15)" }}>
                <iframe
                  src={settings.mapsEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              </div>
            )}
          </div>

          <div className="reveal" style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: 26, color: C.cream, marginBottom: 8 }}>
              Send us a message
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.5)", marginBottom: 28 }}>
              For product enquiries, bulk orders, or just to say hello.
            </p>
            {sent && (
              <div style={{
                background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.4)",
                borderRadius: 4, padding: "12px 16px",
                marginBottom: 22,
                display: "flex", alignItems: "center", gap: 10,
                animation: "fadeIn 0.35s ease",
              }}>
                <Check size={15} color={C.goldLight} />
                <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.goldLight }}>
                  Message received! We&rsquo;ll get back to you soon.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                placeholder="Your name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                style={inputStyle}
              />
              <textarea
                placeholder="What are you looking for? Product enquiry, bulk order, feedback..."
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical" }}
              />
              <button type="submit" className="btn-gold" style={{ marginTop: 6, alignSelf: "flex-start" }}>
                Send Message <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
const Footer = memo(function Footer({ settings = {} }) {
  const scrollTo = useCallback((id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
  []);

  return (
    <footer style={{
      background: C.espresso,
      borderTop: "1px solid rgba(250,246,239,0.06)",
      padding: "48px 5% 28px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          <div className="footer-brand">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName || "Your Store"} style={{ height: 40, maxWidth: 160, objectFit: "contain", marginBottom: 10, display: "block" }} />
            ) : (
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 300, color: C.cream, letterSpacing: "0.06em", marginBottom: 4 }}>
                {settings.storeName || "Your Store"}
              </p>
            )}
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>
              {settings.tagline || "Quality Products · Online Store"}
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.4)", lineHeight: 1.7, maxWidth: 280 }}>
              {settings.aboutText
                ? settings.aboutText.substring(0, 120) + (settings.aboutText.length > 120 ? "…" : "")
                : "Curated with care for every customer. No compromises on quality. Just great products and honest service."}
            </p>
          </div>

          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>
              Explore
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["featured","Featured"],["menu","Full Menu"],["about","About Us"],["contact","Contact"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left",
                    fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300,
                    color: "rgba(250,246,239,0.45)", transition: "color 0.2s",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.goldLight; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(250,246,239,0.45)"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>
              Hours
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 300, color: "rgba(250,246,239,0.45)", lineHeight: 2, whiteSpace: "pre-line" }}>
              {settings.openingTime && settings.closingTime
                ? `${settings.openingTime} – ${settings.closingTime}${(settings.closedDays || []).length ? `\nClosed: ${(settings.closedDays || []).join(", ")}` : ""}`
                : `Mon – Sat\n7:00 AM – 9:00 PM\n\nSunday\n8:00 AM – 6:00 PM`}
            </p>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(250,246,239,0.06)",
          paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10,
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: "rgba(250,246,239,0.22)" }}>
            &copy; {new Date().getFullYear()} {settings.storeName || "Your Store"}. All rights reserved.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: "rgba(250,246,239,0.18)" }}>
            {settings.address ? settings.address.split(",").slice(-2).join(",").trim() : "Your City"}
          </p>
        </div>
      </div>
    </footer>
  );
});

/* ═══════════════════════════════════════════════
   CHECKOUT FORM
   Collects customer details and submits to Firestore.
═══════════════════════════════════════════════ */
const EMPTY_CHECKOUT = { customerName: "", phone: "", address: "", notes: "" };

function CheckoutForm({ cart, total, onBack, onSuccess, settings = {} }) {
  const [form,       setForm]       = useState(EMPTY_CHECKOUT);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Name is required.";
    if (!form.phone.trim())        e.phone        = "Phone number is required.";
    if (!form.address.trim())      e.address      = "Delivery address is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    setSubmitErr("");

    try {
      const orderItems = cart.map((i) => ({
        id:       i.id,
        name:     i.name,
        price:    i.price,
        qty:      i.qty,
        subtotal: i.price * i.qty,
        img:      i.img ?? "",
      }));

      await addDoc(collection(db, "orders"), {
        customerName: form.customerName.trim(),
        phone:        form.phone.trim(),
        address:      form.address.trim(),
        notes:        form.notes.trim(),
        items:        orderItems,
        total,
        status:       "Pending",
        createdAt:    serverTimestamp(),
      });

      onSuccess();
    } catch (err) {
      console.error("Order submission error:", err);
      setSubmitErr("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${C.line}`,
        flexShrink: 0,
      }}>
        <button className="checkout-back-btn" onClick={onBack} disabled={submitting}>
          ← Back to Cart
        </button>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, color: C.espresso }}>
          Your Details
        </h3>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mist, marginTop: 2 }}>
          We'll use this to deliver your order
        </p>
      </div>

      {/* Form body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

        {/* Order summary strip */}
        <div style={{
          background: C.creamDeep, border: `1px solid ${C.line}`,
          borderRadius: 6, padding: "12px 14px", marginBottom: 20,
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mist, marginBottom: 4 }}>
            {cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
          </p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 500, color: C.espresso }}>
            Total: {fmt(total)}
          </p>
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Customer Name *</label>
          <input
            className={`checkout-input${errors.customerName ? " error" : ""}`}
            type="text"
            placeholder="Full name"
            value={form.customerName}
            onChange={set("customerName")}
            disabled={submitting}
          />
          {errors.customerName && <span className="checkout-error">{errors.customerName}</span>}
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Phone Number *</label>
          <input
            className={`checkout-input${errors.phone ? " error" : ""}`}
            type="tel"
            placeholder="e.g. 0300 1234567"
            value={form.phone}
            onChange={set("phone")}
            disabled={submitting}
          />
          {errors.phone && <span className="checkout-error">{errors.phone}</span>}
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Delivery Address *</label>
          <textarea
            className={`checkout-input${errors.address ? " error" : ""}`}
            rows={3}
            placeholder="Street, area, city"
            value={form.address}
            onChange={set("address")}
            disabled={submitting}
            style={{ resize: "vertical", minHeight: 72 }}
          />
          {errors.address && <span className="checkout-error">{errors.address}</span>}
        </div>

        <div className="checkout-field">
          <label className="checkout-label">Order Notes <span style={{ opacity: 0.6 }}>(optional)</span></label>
          <textarea
            className="checkout-input"
            rows={2}
            placeholder="Any special instructions, preferences, or notes…"
            value={form.notes}
            onChange={set("notes")}
            disabled={submitting}
            style={{ resize: "vertical" }}
          />
        </div>

        {submitErr && (
          <p style={{
            fontFamily: FONT_BODY, fontSize: 12, color: "#C0392B",
            background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.2)",
            borderRadius: 5, padding: "10px 12px", marginTop: 4,
          }}>
            {submitErr}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, flexShrink: 0 }}>
        <button
          className="btn-primary"
          style={{ width: "100%", marginBottom: 10, opacity: submitting ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Placing Order…" : <><Check size={14} /> Place Order</>}
        </button>
        <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.mist, textAlign: "center" }}>
          Or call / WhatsApp: <strong>{settings.whatsapp || settings.phone || ""}</strong>
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ORDER SUCCESS SCREEN
═══════════════════════════════════════════════ */
function OrderSuccess({ onClose }) {
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

/* ═══════════════════════════════════════════════
   CART DRAWER
   Steps: "cart" → "checkout" → "success"
   PERF: Conditionally rendered only when open.
         slideInRight uses translate3d (GPU-composited).
═══════════════════════════════════════════════ */
function CartDrawer({ open, onClose, cart, updateQty, removeItem, onOrderSuccess, settings = {} }) {
  // "cart" | "checkout" | "success"
  const [step, setStep] = useState("cart");

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  // Reset to cart step when drawer closes
  useEffect(() => {
    if (!open) setStep("cart");
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSuccess = () => {
    setStep("success");
    onOrderSuccess?.();   // clears the cart in parent
  };

  return (
    <>
      <div
        role="presentation"
        onClick={step === "success" ? onClose : onClose}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(46,26,14,0.5)",
          zIndex: 2000,
          animation: "fadeIn 0.25s ease",
        }}
      />
      <div className="cart-drawer" role="dialog" aria-label="Shopping cart" aria-modal="true">

        {/* ── Step: success ── */}
        {step === "success" && (
          <OrderSuccess onClose={onClose} />
        )}

        {/* ── Step: checkout form ── */}
        {step === "checkout" && (
          <CheckoutForm
            cart={cart}
            total={total}
            onBack={() => setStep("cart")}
            onSuccess={handleSuccess}
            settings={settings}
          />
        )}

        {/* ── Step: cart ── */}
        {step === "cart" && (
          <>
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${C.line}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, color: C.espresso }}>
                  Your Order
                </h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.mist, marginTop: 2 }}>
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                style={{
                  background: C.parchment, border: "none", borderRadius: "50%",
                  width: 34, height: 34,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                <X size={15} color={C.espresso} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <ShoppingBag size={36} color={C.parchment} style={{ margin: "0 auto 16px", display: "block" }} />
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: C.mist, fontWeight: 300 }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.parchment, marginTop: 6 }}>
                    Add something great!
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: "flex", gap: 12, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      style={{ width: 62, height: 62, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 400,
                        color: C.espresso, marginBottom: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.gold, fontWeight: 500 }}>
                        {fmt(item.price)}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => { if (item.qty <= 1) removeItem(item.id); else updateQty(item.id, -1); }}
                          style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${C.line}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Minus size={11} color={C.mist} />
                        </button>
                        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, minWidth: 18, textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.id, 1)}
                          style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${C.line}`, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <Plus size={11} color={C.mist} />
                        </button>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeItem(item.id)}
                          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.mist, opacity: 0.45 }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: `1px solid ${C.line}`, flexShrink: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.mist }}>Subtotal</span>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 500, color: C.espresso }}>
                    {fmt(total)}
                  </span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: "100%", marginBottom: 10 }}
                  onClick={() => setStep("checkout")}
                >
                  Proceed to Checkout
                </button>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.mist, textAlign: "center" }}>
                  Or call / WhatsApp: <strong>{settings.whatsapp || settings.phone || ""}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   PUBLIC SITE (customer-facing, no auth required)
═══════════════════════════════════════════════ */
export default function PublicSite() {
  const [cartOpen,     setCartOpen]     = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);
  const [cart,         setCart]         = useState([]);
  const [wishlist,     setWishlist]     = useState(new Set());

  const { products, loading, error } = useProducts();
  const { settings }                 = useSiteSettings();

  useReveal();

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing)
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 450);
  }, []);

  const updateQty  = useCallback((id, delta) =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)),
  []);

  const removeItem = useCallback((id) =>
    setCart((prev) => prev.filter((i) => i.id !== id)),
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
  const clearCart = useCallback(() => setCart([]), []);

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

