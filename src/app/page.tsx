"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Boomerang SVG ─── */
function BoomerangIcon({ className = "", id = "bgrad" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill={`url(#${id})`}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10d9a0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Scroll-reveal hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── Floating dot ─── */
function Dot({ x, y, size, delay, dur }: { x: string; y: string; size: number; delay: string; dur: string }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: "radial-gradient(circle, rgba(59,130,246,0.6), transparent)",
        animation: `particle-float ${dur} ease-in-out infinite`,
        animationDelay: delay,
      }}
    />
  );
}

/* ─── Feature card icon boxes ─── */
const featureColors: Record<string, string> = {
  blue:   "rgba(59,130,246,0.12)",
  green:  "rgba(16,217,160,0.12)",
  violet: "rgba(139,92,246,0.12)",
  gold:   "rgba(245,158,11,0.12)",
};
const featureBorders: Record<string, string> = {
  blue:   "rgba(59,130,246,0.25)",
  green:  "rgba(16,217,160,0.25)",
  violet: "rgba(139,92,246,0.25)",
  gold:   "rgba(245,158,11,0.25)",
};

export default function Home() {
  const boomerangRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const el = boomerangRef.current;
    if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.010;
      el.style.transform = `translate(${Math.sin(t) * 55}px, ${Math.sin(t * 1.8) * 28}px) rotate(${t * 85}deg)`;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const features = [
    { icon: "🎯", title: "SMART-Wizard",  desc: "5 qadamli interaktiv forma orqali g'oyangizni aniq, o'lchanadigan va vaqt bilan chegaralangan tarzda shakllantiring.", color: "blue" },
    { icon: "🤖", title: "AI-Tahlil",     desc: "Sun'iy intellekt g'oyangizning innovatsionlik darajasini (%) hisoblaydi va konkret tavsiyalar beradi.", color: "green" },
    { icon: "🌐", title: "P2P Tarmoq",    desc: "G'oyangiz boshqa talabalarga 'bumerang' kabi yuboriladi va ular uni boyitadi — u sizga mukammal holda qaytadi.", color: "violet" },
    { icon: "🏆", title: "Gamification",  desc: "XP ballari va Innovator Rank tizimi: Explorer → Specialist → Master → Visionary yo'lida rivojlaning.", color: "gold" },
  ];

  const stats = [
    { value: "5",    label: "SMART mezon",           suffix: "" },
    { value: "4",    label: "Innovator darajasi",    suffix: "" },
    { value: "100",  label: "Min belgi har qadamda", suffix: "+" },
    { value: "3",    label: "Talab etilgan taklif",  suffix: "+" },
  ];

  const steps = [
    { step: "01", icon: "✍️", title: "G'oya kiriting",        desc: "SMART-Wizard orqali innovatsion g'oyangizni 5 qadamda shakllantiring" },
    { step: "02", icon: "🤖", title: "AI tekshiradi",         desc: "Sun'iy intellekt g'oyangizni tahlil qilib, innovatsionlik darajasini aniqlaydi" },
    { step: "03", icon: "🌐", title: "Tarmoqqa yuboriladi",   desc: "G'oya kamida 3 ta talabaga 'bumerang' kabi uchirib yuboriladi" },
    { step: "04", icon: "💎", title: "Boyitib qaytadi",       desc: "Hamkasblar taklif beradi, AI jamlab, sizga mukammal g'oya qaytaradi" },
  ];

  const ranks = [
    { rank: "Explorer",   icon: "🌱", xp: "0–99 XP",     desc: "Platformaga yangi qo'shilganlar uchun", c: "rank-bg-explorer  rank-explorer",   b: "badge-green"  },
    { rank: "Specialist", icon: "⚡", xp: "100–299 XP",  desc: "Faol ishtirokchilar uchun",             c: "rank-bg-specialist rank-specialist", b: "badge-blue"   },
    { rank: "Master",     icon: "🔮", xp: "300–699 XP",  desc: "Tajribali innovatorlar uchun",          c: "rank-bg-master rank-master",         b: "badge-violet" },
    { rank: "Visionary",  icon: "👑", xp: "700+ XP",     desc: "Platforma liderlari uchun",             c: "rank-bg-visionary rank-visionary",   b: "badge-gold"   },
  ];

  /* ─── RENDER ─── */
  return (
    <>
      {/* Fixed backgrounds */}
      <div className="bg-mesh" />
      <div className="bg-grid" />

      <main className="relative z-10 min-h-screen">

        {/* ══════════════════════════════
            NAVBAR — Auth TOP RIGHT
            ══════════════════════════════ */}
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            padding: "14px 0",
            background: scrolled ? "rgba(7,16,31,0.90)" : "rgba(7,16,31,0.35)",
            backdropFilter: "blur(28px)",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.35)" : "none",
          }}
        >
          <div className="page-container flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 anim-spin-slow group-hover:scale-110 transition-transform duration-300">
                <BoomerangIcon className="w-full h-full" id="bgrad-nav" />
              </div>
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}
                className="text-lg md:text-xl gradient-text hidden sm:block">Smart-Boomerang</span>
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900 }}
                className="text-base gradient-text sm:hidden">S-Bumerang</span>
            </Link>

            {/* Centre links — desktop only */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5">
              {[["#features","Imkoniyatlar"],["#how","Jarayon"],["#stats","Statistika"]].map(([href, label]) => (
                <a key={href} href={href}
                  className="text-[13px] font-medium text-white/60 hover:text-white px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-all duration-200">
                  {label}
                </a>
              ))}
            </div>

            {/* ✅ AUTH — TOP RIGHT */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/auth/login"
                className="text-[13px] font-semibold text-white/65 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 hidden sm:block">
                Kirish
              </Link>
              <Link href="/auth/login"
                className="text-[13px] font-semibold text-white/65 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.05] sm:hidden border border-white/10">
                Kirish
              </Link>
              <Link href="/auth/register"
                className="relative group text-[13px] font-bold text-white rounded-xl overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1e5fcc,#3b82f6)", padding: "9px 18px", boxShadow: "0 4px 20px rgba(59,130,246,0.35)" }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative whitespace-nowrap hidden sm:inline">Ro'yxatdan o'tish</span>
                <span className="relative sm:hidden">Kirish ➔</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════
            HERO
            ══════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16 overflow-hidden">

          {/* Animated background boomerang */}
          <div ref={boomerangRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[420px] md:h-[420px] pointer-events-none"
            style={{ opacity: 0.055 }}>
            <BoomerangIcon className="w-full h-full" id="bgrad-hero" />
          </div>

          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full pointer-events-none anim-pulse-blue"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full pointer-events-none anim-pulse-green"
            style={{ background: "radial-gradient(circle, rgba(16,217,160,0.12), transparent 70%)" }} />

          {/* Floating dots */}
          {[
            { x:"12%", y:"22%", size:5, delay:"0s",   dur:"3.2s" },
            { x:"85%", y:"28%", size:4, delay:"1.1s",  dur:"4.0s" },
            { x:"20%", y:"68%", size:6, delay:"0.5s",  dur:"3.7s" },
            { x:"78%", y:"62%", size:3, delay:"2.0s",  dur:"5.1s" },
            { x:"55%", y:"15%", size:5, delay:"1.5s",  dur:"4.3s" },
            { x:"40%", y:"78%", size:4, delay:"0.8s",  dur:"3.5s" },
            { x:"92%", y:"45%", size:3, delay:"2.5s",  dur:"4.8s" },
          ].map((d, i) => <Dot key={i} {...d} />)}

          {/* Hero content */}
          <div className="relative z-10 max-w-4xl mx-auto w-full"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s",
            }}>

            {/* Badge */}
            <div className="flex items-center justify-center mb-7">
              <span className="badge badge-blue text-[11px] tracking-widest">
                🎓 Magistrlik dissertatsiyasi platformasi
              </span>
            </div>

            {/* Headline */}
            <h1 className="heading-xl mb-6 leading-[1.08]">
              G'oyangizni{" "}
              <span className="gradient-text">SMART</span> qiling,
              <br className="hidden md:block" />
              {" "}<span className="gradient-text-green">Bumerang</span> kabi qaytaring
            </h1>

            {/* Sub */}
            <p className="text-base md:text-lg lg:text-xl mb-11 max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}>
              Pedagogik innovatsion g'oyangizni kiriting, AI tekshirsin, tarmoqdagi talabalar boyitsin —
              va u sizga mukammal holatda qaytib kelsin.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 justify-center mb-20">
              <div className="gradient-border shimmer-hover">
                <Link href="/auth/register" className="btn-primary" style={{ background: "linear-gradient(135deg,#1a4faa,#2d7aff)" }}>
                  🚀 Boshlash — Tekin
                </Link>
              </div>
              <a href="#how" className="btn-ghost group">
                Qanday ishlashini ko'rish
                <span className="group-hover:translate-x-1.5 transition-transform duration-200 inline-block">→</span>
              </a>
            </div>

            {/* Stats row */}
            <div className="glow-line mb-10" />
            <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className="glass rounded-2xl px-4 py-5 text-center shimmer-hover"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.7s ease ${0.4 + i * 0.1}s, transform 0.7s ease ${0.4 + i * 0.1}s`,
                  }}>
                  <div className="stat-number">{s.value}{s.suffix}</div>
                  <div className="text-[11px] mt-1 font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            FEATURES
            ══════════════════════════════ */}
        <section id="features" className="py-28 px-5">
          <div className="page-container">
            <Reveal className="text-center mb-16">
              <div className="badge badge-green mb-5 mx-auto w-fit">Asosiy imkoniyatlar</div>
              <h2 className="heading-lg gradient-text">Nima uchun Smart-Boomerang?</h2>
              <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
                Zamonaviy ta'lim texnologiyalarining to'rtta kuchli vositasi bir joyda.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="glass glass-hover shimmer-hover rounded-2xl p-7 h-full flex flex-col"
                    style={{
                      borderColor: featureBorders[f.color],
                      background: featureColors[f.color],
                    }}>
                    <div className="icon-box" style={{ background: featureColors[f.color], border: `1px solid ${featureBorders[f.color]}` }}>
                      {f.icon}
                    </div>
                    <h3 className="heading-md mb-3">{f.title}</h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            HOW IT WORKS
            ══════════════════════════════ */}
        <section id="how" className="py-28 px-5">
          <div className="page-container">
            <Reveal className="text-center mb-18">
              <div className="badge badge-violet mb-5 mx-auto w-fit">Jarayon</div>
              <h2 className="heading-lg">Qanday ishlaydi?</h2>
            </Reveal>

            <div className="relative grid md:grid-cols-4 gap-6 mt-10">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-[26px] left-[12.5%] right-[12.5%] h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.6),rgba(16,217,160,0.6),transparent)" }} />

              {steps.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.1}>
                  <div className="glass glass-hover shimmer-hover rounded-2xl p-6 text-center relative flex flex-col items-center">
                    {/* Step badge */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white mb-5 shrink-0 shadow-lg"
                      style={{ background: "linear-gradient(135deg,#1e5fcc,#10d9a0)" }}>
                      {item.step}
                    </div>
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="font-bold text-[15px] mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            RANK SYSTEM
            ══════════════════════════════ */}
        <section className="py-28 px-5">
          <div className="page-container">
            <Reveal className="text-center mb-16">
              <div className="badge badge-gold mb-5 mx-auto w-fit">🏆 Gamification</div>
              <h2 className="heading-lg">Innovator Rank tizimi</h2>
              <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>XP ballar to'plab, yangi darajalarga o'ting</p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ranks.map((r, i) => (
                <Reveal key={r.rank} delay={i * 0.09}>
                  <div className={`glass glass-hover shimmer-hover rounded-2xl p-7 h-full flex flex-col ${r.c}`}>
                    <div className="text-5xl mb-5">{r.icon}</div>
                    <h3 className="text-xl font-black mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{r.rank}</h3>
                    <div className={`badge ${r.b} mb-4 w-fit`}>{r.xp}</div>
                    <p className="text-sm mt-auto" style={{ color: "var(--text-secondary)" }}>{r.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            CTA
            ══════════════════════════════ */}
        <section className="py-28 px-5">
          <div className="page-container">
            <Reveal>
              <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(59,130,246,0.12), transparent)" }} />
                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px glow-line" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 mb-8 anim-float drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <BoomerangIcon className="w-full h-full" id="bgrad-cta" />
                  </div>
                  <h2 className="heading-lg mb-5">G'oyangizni hoziroq yuboring!</h2>
                  <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Magistrlik dissertatsiyangiz uchun innovatsion g'oyangizni Smart-Boomerang bilan boyiting.
                  </p>
                  <div className="gradient-border shimmer-hover">
                    <Link href="/auth/register" className="btn-primary btn-green text-base px-10 py-4">
                      🚀 Bepul boshlash
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════
            FOOTER
            ══════════════════════════════ */}
        <footer className="border-t py-10 px-5 text-center" style={{ borderColor: "var(--glass-border)" }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-6 h-6"><BoomerangIcon className="w-full h-full" id="bgrad-footer" /></div>
            <span className="font-black tracking-wide" style={{ fontFamily: "Outfit, sans-serif" }}>Smart-Boomerang</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © 2024 Smart-Boomerang. Magistrlik dissertatsiyasi platformasi.
          </p>
        </footer>

      </main>
    </>
  );
}
