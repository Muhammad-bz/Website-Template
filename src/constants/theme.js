/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
export const C = {
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

export const FONT_DISPLAY = "'Cormorant Garamond', 'Georgia', serif";
export const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

/* ═══════════════════════════════════════════════
   IMAGES
═══════════════════════════════════════════════ */
export const IMG = {
  hero:       "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=85&auto=format&fit=crop",
  about:      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85&auto=format&fit=crop",
  aboutSmall: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=85&auto=format&fit=crop",
  rev1:       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=85&auto=format&fit=crop&crop=face",
  rev2:       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=85&auto=format&fit=crop&crop=face",
  rev3:       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=85&auto=format&fit=crop&crop=face",
};

/* ═══════════════════════════════════════════════
   CATEGORY IMAGES
═══════════════════════════════════════════════ */
export const CAT_IMGS = {
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

export const FEAT1 = "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&q=85&auto=format&fit=crop";
export const fallbackImg = (cat) => CAT_IMGS[cat] || FEAT1;

/* ═══════════════════════════════════════════════
   SITE DEFAULTS
═══════════════════════════════════════════════ */
export const SITE_DEFAULTS = {
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
  { name: "Sana Malik",    img: IMG.rev1, stars: 5, role: "Lifestyle Blogger",  text: "The selection and quality here are unmatched. Every product I have ordered has exceeded my expectations. I keep coming back." },
  { name: "Ahmed Raza",    img: IMG.rev2, stars: 5, role: "Regular Customer",   text: "I ordered a gift for a friend and the packaging and quality were outstanding. The whole experience from checkout to delivery was flawless." },
  { name: "Nadia Hussain", img: IMG.rev3, stars: 5, role: "Verified Buyer",     text: "This is my go-to store for quality finds. People always ask where I get them from. Your Store never disappoints." },
];

export const fmt = (n) => `Rs. ${n.toLocaleString()}`;
