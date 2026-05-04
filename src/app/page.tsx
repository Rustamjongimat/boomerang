"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Boomerang SVG ─── */
function BoomerangIcon({ w = 36, h = 36, id = "b0" }: { w?: number; h?: number; id?: string }) {
  return (
    <svg width={w} height={h} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill={`url(#${id})`} />
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea4c89" />
          <stop offset="100%" stopColor="#f77eb5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Scroll reveal ─── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return ref;
}

/* ─── Shot Card (Dribbble style) ─── */
function ShotCard({ icon, title, desc, bg, user, userColor, likes, views, delay = 0 }: {
  icon: string; title: string; desc: string; bg: string;
  user: string; userColor: string; likes: string; views: string; delay?: number;
}) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="reveal shot-card">
      {/* Thumbnail */}
      <div className="shot-thumb">
        <div className="shot-thumb-bg" style={{ background: bg }}>{icon}</div>
        {/* Overlay */}
        <div className="shot-overlay">
          <div className="shot-overlay-title">{title}</div>
          <div className="shot-overlay-actions">
            <button className="shot-action-btn pink">Boshlash ↗</button>
            <button className="shot-action-btn">
              <span>♥</span>
            </button>
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="shot-details">
        <div className="shot-user">
          <div className="shot-avatar" style={{ background: userColor }}>
            {user[0]}
          </div>
          <span className="shot-username">{user}</span>
        </div>
        <div className="shot-stats">
          <span className="shot-stat">♥ {likes}</span>
          <span className="shot-stat">👁 {views}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const boomerangRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeType, setActiveType] = useState("g'oyalar");
  const [activeFilter, setActiveFilter] = useState("discover");

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  // Floating boomerang animation
  useEffect(() => {
    const el = boomerangRef.current; if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.008;
      el.style.transform = `translate(${Math.sin(t) * 14}px, ${Math.sin(t * 1.6) * 10}px) rotate(${t * 55}deg)`;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const shots = [
    { icon: "🎯", title: "SMART-Wizard — 5 qadamli g'oya shakllantirish", desc: "Innovatsion g'oyangizni SMART mezonlari bo'yicha shakllantiring", bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)", user: "SMART modul", userColor: "#ea4c89", likes: "2.4k", views: "18.2k" },
    { icon: "🤖", title: "AI-Tahlil — Innovatsionlik darajasi", desc: "Sun'iy intellekt g'oyangizni tekshirib, foizda baholaydi", bg: "linear-gradient(135deg, #e8f0fe 0%, #c3d8ff 100%)", user: "AI Engine", userColor: "#0d6efd", likes: "1.8k", views: "14.5k" },
    { icon: "🌐", title: "P2P Tarmoq — Bumerang effekti", desc: "G'oyangiz 3+ hamkasbga uchirib, boyitib qaytadi", bg: "linear-gradient(135deg, #e6f8f3 0%, #b6eee0 100%)", user: "Peer Network", userColor: "#00b37e", likes: "3.1k", views: "21.0k" },
    { icon: "🏆", title: "Gamification — XP va Rank tizimi", desc: "Faollik uchun XP ballar to'plab, yangi darajaga yuksaling", bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)", user: "Rank System", userColor: "#7c3aed", likes: "1.2k", views: "9.8k" },
    { icon: "💎", title: "G'oya Boyitish — Kollektiv aql", desc: "Hamkasblar taklif beradi, AI jamlab, natija qaytaradi", bg: "linear-gradient(135deg, #fef9ee 0%, #fde68a 100%)", user: "Collab AI", userColor: "#d97706", likes: "876", views: "7.3k" },
    { icon: "📊", title: "Admin Panel — Real-time statistika", desc: "Loyihalar va innovatsiya tahlilini kuzatib boring", bg: "linear-gradient(135deg, #fce4ec 0%, #ede9fe 100%)", user: "Analytics", userColor: "#ea4c89", likes: "654", views: "5.9k" },
  ];

  const types = ["g'oyalar", "innovatorlar", "loyihalar"];
  const filters = [
    { id: "discover", label: "Hammasi" },
    { id: "smart", label: "SMART tizimi" },
    { id: "ai", label: "AI tahlil" },
    { id: "p2p", label: "P2P tarmoq" },
    { id: "gamification", label: "Gamification" },
    { id: "analytics", label: "Analitika" },
  ];

  const ranks = [
    { id: "rank-explorer",   icon: "🌱", name: "Explorer",   xp: "0–99 XP",    desc: "Platforma yangi a'zolari uchun boshlang'ich daraja" },
    { id: "rank-specialist", icon: "⚡", name: "Specialist", xp: "100–299 XP", desc: "Faol ishtirokchilar va tajribali g'oya mualliflari" },
    { id: "rank-master",     icon: "🔮", name: "Master",     xp: "300–699 XP", desc: "Tajribali innovatorlar va mentor foydalanuvchilar" },
    { id: "rank-visionary",  icon: "👑", name: "Visionary",  xp: "700+ XP",    desc: "Platforma liderlari va eng faol innovatorlar" },
  ];

  const placeholders: Record<string, string> = {
    "g'oyalar":     "Qaysi sohadagi g'oyani qidiryapsiz?",
    "innovatorlar": "Qaysi mutaxassisni qidiryapsiz?",
    "loyihalar":    "Qaysi loyiha turini qidiryapsiz?",
  };

  return (
    <>
      {/* ══ ANNOUNCEMENT BAR ══ */}
      <div className="announce-bar">
        <span>🚀 Magistrlik dissertatsiyasi uchun eng zamonaviy platforma — Smart-Boomerang ishga tushdi!</span>
        <a href="/auth/register">Boshlash ↗</a>
      </div>

      {/* ══ NAVBAR — AUTH TOP RIGHT ══ */}
      <header className="site-nav">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon anim-spin">
            <BoomerangIcon w={36} h={36} id="nav-b" />
          </div>
          <span className="nav-logo-text" style={{ display: "none" }} id="logo-text">Smart-Boomerang</span>
          <style>{`@media(min-width:640px){#logo-text{display:block}}`}</style>
        </Link>

        {/* Search */}
        <div className="nav-search">
          <span className="nav-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input type="text" placeholder="Qidirish..." />
        </div>

        {/* Nav links */}
        <nav className="nav-links">
          <a href="#shots" className="nav-link">Imkoniyatlar</a>
          <a href="#how" className="nav-link">Jarayon</a>
          <a href="#ranks" className="nav-link">Rank tizimi</a>
        </nav>

        {/* ✅ AUTH — always top right */}
        <div className="nav-actions">
          <Link href="/auth/register" className="btn-signup">
            Ro'yxatdan o'tish
          </Link>
          <Link href="/auth/login" className="btn-login">
            Kirish
          </Link>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section>
        <div className="home-hero">
          {/* Left */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
          }}>
            <h1 className="hero-heading">
              O'zbekistoning eng<br />
              yaxshi innovatorlarini<br />
              kashf eting
            </h1>
            <p className="hero-sub">
              Magistrlik dissertatsiyasi uchun innovatsion g'oyangizni SMART mezonlari
              bo'yicha shakllantiring, AI tekshirsin, hamkasblar boyitsin.
            </p>

            {/* Type pills */}
            <div className="search-types">
              {types.map((t) => (
                <button key={t} className={`type-pill${activeType === t ? " active" : ""}`}
                  onClick={() => setActiveType(t)}>
                  {t === "g'oyalar" ? "💡" : t === "innovatorlar" ? "👤" : "📁"} {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="hero-search">
              <input type="text" placeholder={placeholders[activeType]} />
              <button className="hero-search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>

            {/* Trending */}
            <div className="trending">
              <span className="trending-label">Mashhur:</span>
              {["SMART mezon","AI tahlil","P2P tarmoq","XP tizimi","Innovatsiya"].map((tag) => (
                <a key={tag} href="#shots" className="trend-tag">{tag}</a>
              ))}
            </div>
          </div>

          {/* Right — media */}
          <div className="hero-media" style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1.1s ease 0.3s",
          }}>
            <div className="hero-media-inner" ref={boomerangRef}>
              <BoomerangIcon w={180} h={180} id="hero-b" />
            </div>
            <div className="hero-media-badge">
              <div className="hero-media-badge-avatar">AI</div>
              <span>94% innovatsionlik darajasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROJECT BRIEF BANNER ══ */}
      <div className="brief-banner">
        <p className="brief-banner-text">
          ✨ <strong>G'oya briefini boshlang</strong> — Nima kerakligini ayting va AI darhol eng mos
          innovatsion yechimlarni tavsiya qilsin.
        </p>
        <Link href="/auth/register" className="brief-banner-cta">
          🚀 G'oya Briefini Boshlash
        </Link>
      </div>

      {/* ══ FILTER BAR ══ */}
      <div id="shots" className="filter-bar">
        {filters.map((f) => (
          <button key={f.id}
            className={`filter-cat${activeFilter === f.id ? " active" : ""}`}
            onClick={() => setActiveFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ══ SHOT GRID ══ */}
      <div className="shots-grid">
        {shots.map((s, i) => (
          <ShotCard key={s.title} {...s} delay={i * 60} />
        ))}
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div id="how">
        <div className="section-header">
          <h2 className="section-title">Qanday ishlaydi?</h2>
          <a href="/auth/register" className="section-link">Barchasini ko'rish →</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", padding: "0 48px 60px", maxWidth: "1400px", margin: "0 auto" }}
          className="grid-4-col">
          <style>{`@media(max-width:900px){.grid-4-col{grid-template-columns:repeat(2,1fr)!important;padding:0 24px 40px!important}}@media(max-width:560px){.grid-4-col{grid-template-columns:1fr!important;padding:0 16px 32px!important}}`}</style>
          {[
            { n: "01", icon: "✍️", title: "G'oya kiriting", desc: "SMART-Wizard orqali 5 qadamda innovatsion g'oyangizni shakllantiring", c: "#ea4c89" },
            { n: "02", icon: "🤖", title: "AI tekshiradi", desc: "Sun'iy intellekt innovatsionlik darajasini (%) aniqlab beradi", c: "#0d6efd" },
            { n: "03", icon: "🌐", title: "Tarmoqqa yuboriladi", desc: "G'oya kamida 3 ta talabaga 'bumerang' kabi uchirib yuboriladi", c: "#00b37e" },
            { n: "04", icon: "💎", title: "Boyitib qaytadi", desc: "Hamkasblar taklif beradi, AI jamlab, mukammal g'oya qaytaradi", c: "#7c3aed" },
          ].map((s, i) => {
            const ref = useReveal(i * 80);
            return (
              <div key={s.n} ref={ref} className="reveal rank-card" style={{ borderTop: `3px solid ${s.c}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: s.c, display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 900, fontSize: "13px",
                  }}>{s.n}</div>
                  <span style={{ fontSize: "28px" }}>{s.icon}</span>
                </div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "8px", color: "var(--dark)" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text-light)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ RANKS ══ */}
      <div id="ranks" style={{ background: "var(--bg-soft)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 0" }}>
        <div className="section-header">
          <h2 className="section-title">🏆 Innovator Rank tizimi</h2>
          <a href="/auth/register" className="section-link">Ro'yxatdan o'tish →</a>
        </div>
        <div className="ranks-grid">
          {ranks.map((r, i) => {
            const ref = useReveal(i * 80);
            return (
              <div key={r.id} ref={ref} className={`reveal rank-card ${r.id}`}>
                <div className="rank-icon">{r.icon}</div>
                <div className="rank-name">{r.name}</div>
                <div className="rank-xp">{r.xp}</div>
                <div className="rank-desc">{r.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ THESIS INFO ══ */}
      <section style={{ background: "#fff", padding: "80px 24px" }} id="about">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }} ref={useReveal()}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              display: "inline-block", background: "var(--bg-dark)", color: "#fff",
              padding: "6px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px"
            }}>
              🎓 Magistrlik Dissertatsiyasi
            </div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "16px", letterSpacing: "-0.03em", maxWidth: "800px", lineHeight: 1.3 }}>
              "Raqamli pedagogik muhitida talabalarni innovatsion faoliyatini rivojlantirish mexanizmini takomillashtirish"
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#fef0f5", color: "var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, flexShrink: 0 }}>
                P
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Muallif</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--dark)" }}>PRIMOVA DURDONA</div>
                <div style={{ fontSize: "14px", color: "var(--text-light)" }}>G'ulomjon qizi</div>
              </div>
            </div>

            <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#e8f0fe", color: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                🎓
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Mutaxassislik</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "4px" }}>70610105</div>
                <div style={{ fontSize: "14px", color: "var(--text-light)" }}>"Ta’limda axborot texnologiyalari"</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "32px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, background: "var(--bg-soft)", border: "1px solid var(--border)", padding: "20px", borderRadius: "16px" }}>
            Ushbu platforma <strong>70610105 – "Ta’limda axborot texnologiyalari"</strong> mutaxassisligi bo'yicha magistr akademik darajasini olish uchun yozilgan dissertatsiya ishi doirasida ishlab chiqilgan.
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section">
        <div ref={useReveal()} className="reveal">
          <div style={{ marginBottom: "20px" }}>
            <BoomerangIcon w={60} h={60} id="cta-b" />
          </div>
          <h2 className="cta-heading">Innovatsion g'oyangizni hoziroq yuboring</h2>
          <p className="cta-sub">
            Magistrlik dissertatsiyangiz uchun eng innovatsion g'oyalarni Smart-Boomerang
            platformasi bilan mukammal qiling.
          </p>
          <Link href="/auth/register" className="cta-btn">
            🚀 Bepul Ro'yxatdan O'tish
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="site-footer">
        <div className="footer-brand">
          <BoomerangIcon w={28} h={28} id="footer-b" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1rem", color: "var(--dark)" }}>
            Smart-Boomerang
          </span>
        </div>
        <p className="footer-copy">© 2024 Smart-Boomerang — Muallif: Primova Durdona G'ulomjon qizi</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/auth/register" className="btn-signup" style={{ fontSize: "13px" }}>Ro'yxatdan o'tish</Link>
          <Link href="/auth/login" className="btn-login" style={{ fontSize: "13px", padding: "8px 16px" }}>Kirish</Link>
        </div>
      </footer>
    </>
  );
}
