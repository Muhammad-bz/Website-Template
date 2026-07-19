import { useState, useEffect } from "react";
import { collection, getDocs, getDoc, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { fallbackImg, SITE_DEFAULTS } from "../constants/theme";

/* ═══════════════════════════════════════════════
   SCROLL REVEAL HOOK
   FIXED: Only runs once on mount and tears down properly.
   Uses a single long-lived IntersectionObserver with a
   MutationObserver to pick up newly-added .reveal nodes.
═══════════════════════════════════════════════ */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    const observe = () =>
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));

    observe();

    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/* ═══════════════════════════════════════════════
   FIRESTORE PRODUCTS HOOK
   - Fetches only available === true products
   - Sorts: featured first, then original order preserved
═══════════════════════════════════════════════ */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "products"),
      where("available", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const raw = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name ?? "",
          price: doc.data().price ?? 0,
          category: doc.data().category ?? "",
          img: doc.data().img ?? doc.data().imageUrl ?? fallbackImg(doc.data().category),
          desc: doc.data().desc ?? doc.data().description ?? "",
          tag: doc.data().tag ?? "",
          featured: doc.data().featured ?? false,
          available: doc.data().available,
          order: doc.data().order ?? 0,
        }));

        const featured = raw.filter((p) => p.featured);
        const nonFeatured = raw.filter((p) => !p.featured);

        setProducts([...featured, ...nonFeatured]);
        setLoading(false);
      },
      (err) => {
        setError(err.message ?? "Failed to load products.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}

/* ═══════════════════════════════════════════════
   SITE SETTINGS HOOK
   Reads from Firestore settings/site document.
   Falls back to hardcoded values for every field.
═══════════════════════════════════════════════ */
export function useSiteSettings() {
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
