/* ═══════════════════════════════════════════════
   SELARA DESIGN TOKENS
   Palette: Feminine · Modern · Pret
═══════════════════════════════════════════════ */
export const C = {
  /* Backgrounds */
  cream:     "#FDF8F5",   /* warm paper white */
  creamDeep: "#F7EEE9",   /* blush tinted surface */
  parchment: "#EFE0D8",   /* deeper blush section bg */

  /* Brand rose */
  blush:     "#F2C4CE",   /* signature Selara pink */
  petal:     "#E8A0B0",   /* mid rose, hover states */
  rose:      "#C9818F",   /* deep rose, active/primary */

  /* Neutrals */
  charcoal:  "#1C1C1C",   /* near-black text */
  slate:     "#4A4A4A",   /* body text */
  mist:      "#9A8A8A",   /* muted labels */
  line:      "rgba(201,129,143,0.15)", /* rose-tinted divider */

  /* Accents */
  gold:      "#C9A84C",   /* kept for cart badge / price */
  goldLight: "#E2C97E",

  /* Legacy aliases so CartDrawer/CheckoutForm don't break */
  espresso:  "#1C1C1C",
  chocolate: "#C9818F",
  caramel:   "#E8A0B0",
};

export const FONT_DISPLAY = "'Cormorant Garamond', 'Georgia', serif";
export const FONT_BODY    = "'Jost', system-ui, sans-serif";

/* ═══════════════════════════════════════════════
   IMAGES
═══════════════════════════════════════════════ */
export const IMG = {
  hero:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop",
  about:      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=900&q=85&auto=format&fit=crop",
  aboutSmall: "https://images.unsplash.com/photo-1594938298603-c8148c4b7b7b?w=600&q=85&auto=format&fit=crop",
  rev1:       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85&auto=format&fit=crop&crop=face",
  rev2:       "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=85&auto=format&fit=crop&crop=face",
  rev3:       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=85&auto=format&fit=crop&crop=face",
};

/* ═══════════════════════════════════════════════
   CATEGORY IMAGES
═══════════════════════════════════════════════ */
export const CAT_IMGS = {
  "Category A":  "https://images.unsplash.com/photo-1594938298603-c8148c4b7b7b?w=600&q=80&auto=format&fit=crop",
  "Category B":  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  "Category C":  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80&auto=format&fit=crop",
  "Category D":  "https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=600&q=80&auto=format&fit=crop",
  "Category E":  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80&auto=format&fit=crop",
  "Category F":  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&auto=format&fit=crop",
  "Category G":  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&auto=format&fit=crop",
  "Category H":  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&auto=format&fit=crop",
  "Category I":  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80&auto=format&fit=crop",
  "Category J":  "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600&q=80&auto=format&fit=crop",
  "Category K":  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80&auto=format&fit=crop",
  "Category L":  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&auto=format&fit=crop",
  "Category M":  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80&auto=format&fit=crop",
  "Category N":  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80&auto=format&fit=crop",
  "Category O":  "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80&auto=format&fit=crop",
  "Category P":  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80&auto=format&fit=crop",
  "Category Q":  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80&auto=format&fit=crop",
  "Category R":  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&auto=format&fit=crop",
  "Category S":  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80&auto=format&fit=crop",
};

export const FEAT1 = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&auto=format&fit=crop";
export const fallbackImg = (cat) => CAT_IMGS[cat] || FEAT1;

/* ═══════════════════════════════════════════════
   SITE DEFAULTS
═══════════════════════════════════════════════ */
export const SITE_DEFAULTS = {
  storeName:         "Selara",
  tagline:           "Feminine · Modern · Pret",
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
  heroTitle:         "A Curated Pret Experience",
  heroSubtitle:      "Feminine silhouettes, modern cuts — crafted for the woman who knows her style.",
  heroButtonText:    "Shop Now",
  seoTitle:          "Selara — Feminine · Modern · Pret",
  metaDescription:   "Selara offers a curated pret experience — feminine, modern clothing crafted with care.",
  metaKeywords:      "selara, pret, pakistani fashion, women clothing, feminine fashion",
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

/* ═══════════════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════════════ */
const RAW_MENU_DATA = [
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
];

export const MENU_DATA = RAW_MENU_DATA.map((p) => ({ ...p, img: fallbackImg(p.category), desc: "" }));

export const FEATURED = [
  { ...MENU_DATA.find(p => p.id === 14), tag: "Fan Favourite", desc: "A customer favourite — consistently excellent quality and great value." },
  { ...MENU_DATA.find(p => p.id === 28), tag: "Must Try",      desc: "Our signature item — distinctive, reliable, and impossible to pass up." },
  { ...MENU_DATA.find(p => p.id === 44), tag: "Staff Pick",    desc: "A top recommendation from our team — premium quality, outstanding value." },
];

export const ALL_CATEGORIES = [...new Set(MENU_DATA.map(p => p.category))];

export const REVIEWS = [
  { name: "Sana Malik",    img: IMG.rev1, stars: 5, role: "Lifestyle Blogger",  text: "Selara's pieces are exactly what I have been looking for — feminine, well-cut, and so easy to style. The fabric quality is genuinely impressive at this price point." },
  { name: "Zara Fatima",   img: IMG.rev2, stars: 5, role: "Regular Customer",   text: "Ordered two suits and they arrived beautifully packaged. The stitching detail is immaculate. I have already placed my second order. Selara does not disappoint." },
  { name: "Nadia Hussain", img: IMG.rev3, stars: 5, role: "Verified Buyer",     text: "Everyone at the gathering asked where I got my outfit from. This is my go-to now for every occasion. Modern cuts, beautiful fabrics — Selara is the real deal." },
];

export const fmt = (n) => `Rs. ${n.toLocaleString()}`;
