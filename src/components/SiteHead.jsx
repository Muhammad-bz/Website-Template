import { useEffect } from "react";

/* ─────────────────────────────────────────────────
   SITE HEAD MANAGER
   Applies document.title, favicon, meta tags,
   Open Graph, Twitter Card, JSON-LD structured data.
───────────────────────────────────────────────── */
export default function SiteHead({ settings }) {
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
