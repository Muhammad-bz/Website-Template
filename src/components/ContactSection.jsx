import React, { useState, useCallback, useMemo } from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, ArrowRight, Check } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";

/* ═══════════════════════════════════════════════
   CONTACT SECTION
═══════════════════════════════════════════════ */
export default function ContactSection({ settings = {} }) {
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
