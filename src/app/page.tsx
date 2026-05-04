"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Boomerang SVG (dark for light bg) ─── */
function BoomerangIcon({ className = "", id = "bg0" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill={`url(#${id})`} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
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
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, v };
}
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ─── Shot / Feature Card (Dribbble style) ─── */
function ShotCard({ icon, title, desc, bg, iconBg, badge, badgeColor }: {
  icon: string; title: string; desc: string;
  bg: string; iconBg: string; badge: string; badgeColor: string;
}) {
  return (
    <div className="shot-card group flex flex-col overflow-hidden cursor-pointer">
      {/* Thumbnail */}
      <div className="shot-card-thumb relative" style={{ background: bg }}>
        <span className="text-5xl">{icon}</span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-bold tracking-wider uppercase">Ko'rish ↗</span>
        </div>
      </div>
      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={`badge badge-${badgeColor} text-[10px]`}>{badge}</span>
        </div>
        <h3 className="heading-md text-[15px] mb-2 leading-snug">{title}</h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const boomerangRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = boomerangRef.current; if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.008;
      el.style.transform = `translate(${Math.sin(t) * 18}px, ${Math.sin(t * 1.7) * 12}px) rotate(${t * 60}deg)`;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const shots = [
    { icon: "🎯", title: "SMART-Wizard", desc: "5 qadamli interaktiv forma orqali g'oyangizni shakllantiring.", bg: "linear-gradient(135deg,#fce4ec,#f8bbd0)", iconBg: "#fce4ec", badge: "S·M·A·R·T", badgeColor: "pink" },
    { icon: "🤖", title: "AI-Tahlil", desc: "Sun'iy intellekt innovatsionlik darajasini (%) aniqlab beradi.", bg: "linear-gradient(135deg,#e8f0fe,#c3d8ff)", iconBg: "#e8f0fe", badge: "AI Powered", badgeColor: "blue" },
    { icon: "🌐", title: "P2P Tarmoq", desc: "G'oyangiz boshqalarga 'bumerang' kabi uchib, boyitib qaytadi.", bg: "linear-gradient(135deg,#e6f8f3,#b6eee0)", iconBg: "#e6f8f3", badge: "Peer Network", badgeColor: "green" },
    { icon: "🏆", title: "Gamification", desc: "XP ballar yig'ib, Explorer'dan Visionary'ga yuksaling.", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", iconBg: "#ede9fe", badge: "XP + Rank", badgeColor: "violet" },
    { icon: "💎", title: "G'oya Boyitish", desc: "Hamkasblar fikr bildiradi, AI jamlaydi — yaxlit natija chiqadi.", bg: "linear-gradient(135deg,#fef9ee,#fde68a)", iconBg: "#fef9ee", badge: "Collaborative", badgeColor: "gold" },
    { icon: "📊", title: "Admin Panel", desc: "Loyihalar statistikasi va innovatsiya tahlilini kuzatib boring.", bg: "linear-gradient(135deg,#fce4ec,#ede9fe)", iconBg: "#fce4ec", badge: "Analytics", badgeColor: "pink" },
  ];

  const steps = [
    { n: "01", icon: "✍️", title: "G'oya kiriting",      desc: "SMART-Wizard orqali innovatsion g'oyangizni 5 qadamda shakllantiring", c: "pink" },
    { n: "02", icon: "🤖", title: "AI tekshiradi",       desc: "Sun'iy intellekt tahlil qilib, innovatsionlik darajasini aniqlaydi", c: "blue" },
    { n: "03", icon: "🌐", title: "Tarmoqqa yuboriladi", desc: "G'oya kamida 3 ta talabaga 'bumerang' kabi uchirib yuboriladi", c: "green" },
    { n: "04", icon: "💎", title: "Boyitib qaytadi",     desc: "Hamkasblar taklif beradi, AI jamlab, mukammal g'oya qaytaradi", c: "violet" },
  ];

  const ranks = [
    { rank: "Explorer",   icon: "🌱", xp: "0–99 XP",    desc: "Platformaga yangi qo'shilganlar uchun", b: "badge-green",  bg: "rank-bg-explorer  rank-explorer" },
    { rank: "Specialist", icon: "⚡", xp: "100–299 XP", desc: "Faol ishtirokchilar uchun",             b: "badge-blue",   bg: "rank-bg-specialist rank-specialist" },
    { rank: "Master",     icon: "🔮", xp: "300–699 XP", desc: "Tajribali innovatorlar uchun",          b: "badge-violet", bg: "rank-bg-master rank-master" },
    { rank: "Visionary",  icon: "👑", xp: "700+ XP",    desc: "Platforma liderlari uchun",             b: "badge-gold",   bg: "rank-bg-visionary rank-visionary" },
  ];

  const stepColors: Record<string, string> = {
    pink: "var(--pink)", blue: "var(--blue)", green: "var(--green)", violet: "var(--violet)",
  };

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          NAVBAR — Dribbble style, auth TOP RIGHT
          ══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.07)" : "none",
          padding: "14px 0",
        }}>
        <div className="page-container flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 anim-spin-slow">
              <BoomerangIcon className="w-full h-full" id="nav-b" />
            </div>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.15rem", color: "var(--text-dark)" }}
              className="hidden sm:block tracking-tight">Smart-Boomerang</span>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1rem", color: "var(--text-dark)" }}
              className="sm:hidden tracking-tight">S-Bumerang</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[["#shots","Imkoniyatlar"],["#how","Jarayon"],["#ranks","Rank tizimi"]].map(([href, label]) => (
              <a key={href} href={href} className="btn-ghost-nav">{label}</a>
            ))}
          </nav>

          {/* ✅ AUTH — strictly top right */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/auth/login" className="btn-ghost-nav hidden sm:flex">Kirish</Link>
            <Link href="/auth/login"
              className="sm:hidden text-sm font-semibold px-4 py-2 rounded-full border"
              style={{ borderColor: "var(--border)", color: "var(--text-base)" }}>Kirish</Link>
            <Link href="/auth/register" className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO — Dribbble large hero
          ══════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-5 overflow-hidden">
        {/* Decorative pink blob (top right) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(234,76,137,0.10) 0%, transparent 65%)",
          }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 20% 80%, rgba(13,110,253,0.07) 0%, transparent 65%)",
          }} />

        <div className="page-container flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left: Text */}
          <div className="flex-1 text-left"
            style={{
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s",
            }}>
            <div className="badge badge-pink mb-6">🎓 Magistrlik dissertatsiyasi platformasi</div>

            <h1 className="heading-hero mb-6">
              G'oyangizni{" "}
              <span className="gradient-text">SMART</span>{" "}
              qiling
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "var(--text-muted)" }}>
              Pedagogik innovatsion g'oyangizni kiriting, AI tekshirsin, hamkasblar boyitsin —
              va u sizga mukammal holatda <strong style={{ color: "var(--text-base)" }}>bumerang</strong> kabi qaytib kelsin.
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-10">
              <Link href="/auth/register" className="btn-primary">
                🚀 Bepul boshlash
              </Link>
              <a href="#shots" className="btn-secondary">
                Imkoniyatlarni ko'rish →
              </a>
            </div>

            {/* Pill tags */}
            <div className="flex flex-wrap gap-2">
              {["SMART mezonlari","AI tahlil","P2P tarmoq","Gamification"].map((tag) => (
                <span key={tag} className="pill-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right: Animated boomerang + decorative elements */}
          <div className="flex-1 flex items-center justify-center relative min-h-[320px]"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 1s ease 0.3s",
            }}>
            {/* Background circles */}
            <div className="absolute w-80 h-80 rounded-full border-2 anim-ping-slow"
              style={{ borderColor: "rgba(234,76,137,0.12)" }} />
            <div className="absolute w-60 h-60 rounded-full border anim-ping-slow"
              style={{ borderColor: "rgba(234,76,137,0.18)", animationDelay: "1s" }} />

            {/* Central boomerang */}
            <div ref={boomerangRef} className="relative z-10 w-48 h-48 drop-shadow-2xl">
              <BoomerangIcon className="w-full h-full" id="hero-b" />
            </div>

            {/* Floating stat bubbles */}
            {[
              { label: "SMART", value: "5", unit: "mezon", x: "75%", y: "15%", bg: "#fce4ec", tc: "var(--pink)" },
              { label: "AI Score", value: "94", unit: "%",    x: "-5%", y: "20%", bg: "#e8f0fe", tc: "var(--blue)" },
              { label: "XP",      value: "700",unit: "+",    x: "65%", y: "70%", bg: "#ede9fe", tc: "var(--violet)" },
            ].map((b) => (
              <div key={b.label}
                className="absolute rounded-2xl px-4 py-3 text-center shadow-md anim-float"
                style={{ left: b.x, top: b.y, background: b.bg, border: "1px solid rgba(0,0,0,0.06)", minWidth: "80px" }}>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-muted)" }}>{b.label}</div>
                <div className="font-black text-xl leading-none" style={{ color: b.tc, fontFamily: "Outfit" }}>
                  {b.value}<span className="text-sm font-bold">{b.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat row */}
        <div className="page-container mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: "5",   l: "SMART Mezon",           a: "pink" },
              { v: "4",   l: "Innovator darajasi",    a: "blue" },
              { v: "100+",l: "Min belgi har qadamda", a: "green" },
              { v: "3+",  l: "Talab etilgan taklif",  a: "violet" },
            ].map((s, i) => (
              <div key={i} className="card p-6 text-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.7s ease ${0.5 + i * 0.08}s, transform 0.7s ease ${0.5 + i * 0.08}s`,
                }}>
                <div className="stat-number" style={{ color: `var(--${s.a})` }}>{s.v}</div>
                <div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SHOT GRID (Dribbble-style showcase)
          ══════════════════════════════════════ */}
      <section id="shots" className="py-24 px-5">
        <div className="page-container">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="badge badge-pink mb-4">Platforma imkoniyatlari</div>
              <h2 className="heading-xl">Nima uchun Smart-Boomerang?</h2>
            </div>
            <Link href="/auth/register" className="btn-secondary shrink-0">
              Barcha imkoniyatlar →
            </Link>
          </Reveal>

          {/* 3-col grid, Dribbble style */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shots.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <ShotCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — numbered steps
          ══════════════════════════════════════ */}
      <section id="how" className="py-24 px-5" style={{ background: "var(--bg-white)" }}>
        <div className="page-container">
          <Reveal className="text-center mb-16">
            <div className="badge badge-blue mb-4 mx-auto w-fit">Jarayon</div>
            <h2 className="heading-xl">Qanday ishlaydi?</h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
              To'rtta oddiy qadam bilan g'oyangizni world-class innovatsiyaga aylantiring.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="card p-7 h-full flex flex-col" style={{ [`card-${s.c}` as string]: "" }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow"
                      style={{ background: stepColors[s.c] }}>
                      {s.n}
                    </div>
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                  <h3 className="heading-md text-[15px] mb-3">{s.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RANK SYSTEM
          ══════════════════════════════════════ */}
      <section id="ranks" className="py-24 px-5">
        <div className="page-container">
          <Reveal className="text-center mb-16">
            <div className="badge badge-violet mb-4 mx-auto w-fit">🏆 Gamification</div>
            <h2 className="heading-xl">Innovator Rank tizimi</h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
              XP ballar to'plab, yangi darajalarga o'ting va liderlarga qo'shiling.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ranks.map((r, i) => (
              <Reveal key={r.rank} delay={i * 0.09}>
                <div className={`card p-7 h-full flex flex-col ${r.bg}`}>
                  <div className="text-5xl mb-5">{r.icon}</div>
                  <h3 className="heading-md mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{r.rank}</h3>
                  <div className={`badge ${r.b} mb-4 w-fit`}>{r.xp}</div>
                  <p className="text-sm mt-auto" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Dribbble-style big CTA
          ══════════════════════════════════════ */}
      <section className="py-24 px-5" style={{ background: "var(--bg-white)" }}>
        <div className="page-container">
          <Reveal>
            <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #fce4ec 0%, #ede9fe 100%)", border: "1px solid #f5c0d6" }}>
              <div className="absolute top-4 right-8 w-24 h-24 anim-float opacity-40">
                <BoomerangIcon className="w-full h-full" id="cta-b" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 mb-6 anim-float">
                  <BoomerangIcon className="w-full h-full" id="cta-main" />
                </div>
                <h2 className="heading-xl mb-4" style={{ maxWidth: 500 }}>G'oyangizni hoziroq yuboring!</h2>
                <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
                  Magistrlik dissertatsiyangiz uchun innovatsion g'oyangizni Smart-Boomerang bilan mukammal qiling.
                </p>
                <Link href="/auth/register" className="btn-primary" style={{ fontSize: "15px", padding: "14px 32px" }}>
                  🚀 Bepul boshlash
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="py-10 px-5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7"><BoomerangIcon className="w-full h-full" id="footer-b" /></div>
            <span className="font-black tracking-tight" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text-dark)" }}>Smart-Boomerang</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © 2024 Smart-Boomerang — Magistrlik dissertatsiyasi platformasi
          </p>
        </div>
      </footer>

    </div>
  );
}
