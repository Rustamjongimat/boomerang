"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Boomerang SVG animation component
function BoomerangIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill="url(#bgrad)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="bgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d7aff" />
          <stop offset="100%" stopColor="#00c896" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Floating particle
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: 4,
        height: 4,
        background: "rgba(45,122,255,0.4)",
        ...style,
      }}
    />
  );
}

export default function Home() {
  const boomerangRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boomerangRef.current;
    if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.012;
      const x = Math.sin(t) * 60;
      const y = Math.sin(t * 2) * 30;
      const r = t * 90;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "SMART-Wizard",
      desc: "5 qadamli interaktiv forma orqali g'oyangizni aniq, o'lchanadigan va vaqt bilan chegaralangan tarzda shakllantiring.",
      color: "blue",
    },
    {
      icon: "🤖",
      title: "AI-Tahlil",
      desc: "Sun'iy intellekt g'oyangizning innovatsionlik darajasini (%) hisoblaydi va konkret tavsiyalar beradi.",
      color: "green",
    },
    {
      icon: "🌐",
      title: "P2P Tarmoq",
      desc: "G'oyangiz boshqa talabalarga 'bumerang' kabi yuboriladi va ular uni boyitadi — u sizga mukammal holda qaytadi.",
      color: "violet",
    },
    {
      icon: "🏆",
      title: "Gamification",
      desc: "XP ballari va Innovator Rank tizimi: Explorer → Specialist → Master → Visionary yo'lida rivojlaning.",
      color: "gold",
    },
  ];

  const stats = [
    { value: "5", label: "SMART mezon", suffix: "" },
    { value: "4", label: "Innovator darajasi", suffix: "" },
    { value: "100", label: "Min belgi har qadamda", suffix: "+" },
    { value: "3", label: "Talab etilgan taklif", suffix: "+" },
  ];

  return (
    <main className="relative z-10 min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 anim-spin-slow">
            <BoomerangIcon className="w-full h-full" />
          </div>
          <span className="font-outfit font-800 text-base sm:text-xl gradient-text" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800 }}>
            <span className="hidden sm:inline">Smart-Boomerang</span>
            <span className="sm:hidden">S-Boomerang</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Imkoniyatlar</a>
          <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors">Qanday ishlaydi</a>
          <a href="#stats" className="text-sm text-white/60 hover:text-white transition-colors">Statistika</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/auth/login" className="btn-ghost text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">Kirish</Link>
          <Link href="/auth/register" className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5">Ro'yxatdan o'tish</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center pt-20 px-6 relative overflow-hidden">
        {/* Animated boomerang */}
        <div
          ref={boomerangRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none"
        >
          <BoomerangIcon className="w-full h-full" />
        </div>

        {/* Floating particles */}
        {[
          { top: "20%", left: "15%", animationDelay: "0s", animationDuration: "3s" },
          { top: "30%", right: "20%", animationDelay: "1s", animationDuration: "4s" },
          { top: "70%", left: "25%", animationDelay: "0.5s", animationDuration: "3.5s" },
          { top: "60%", right: "15%", animationDelay: "2s", animationDuration: "5s" },
          { top: "15%", left: "60%", animationDelay: "1.5s", animationDuration: "4s" },
        ].map((p, i) => (
          <Particle
            key={i}
            style={{
              ...p,
              animation: `float ${p.animationDuration} ease-in-out infinite`,
              animationDelay: p.animationDelay,
            }}
          />
        ))}

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #2d7aff, transparent)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00c896, transparent)" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="badge badge-blue mb-6 mx-auto w-fit">
            <span>🎓</span>
            <span>Magistrlik dissertatsiyasi platformasi</span>
          </div>

          <h1 className="heading-xl mb-6">
            G'oyangizni{" "}
            <span className="gradient-text">SMART</span> qiling,{" "}
            <br className="hidden md:block" />
            <span className="gradient-text-green">Bumerang</span> kabi qaytaring
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pedagogik innovatsion g'oyangizni kiritng, AI tekshirsin, tarmoqdagi talabalar boyitsin
            va u sizga mukammal holatda qaytib kelsin.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary">
              <span>🚀</span> Boshlash — Tekin
            </Link>
            <a href="#how" className="btn-ghost">
              Qanday ishlashini ko'rish →
            </a>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16" id="stats">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    background: "linear-gradient(135deg, #2d7aff, #00c896)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.value}{s.suffix}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="badge badge-green mb-4 mx-auto w-fit">Asosiy imkoniyatlar</div>
            <h2 className="heading-lg gradient-text">Nima uchun Smart-Boomerang?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`glass glass-hover rounded-2xl p-6 ${
                  f.color === "blue" ? "glass-blue" :
                  f.color === "green" ? "glass-green" : ""
                }`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="heading-md mb-3">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="badge badge-violet mb-4 mx-auto w-fit">Jarayon</div>
            <h2 className="heading-lg">Qanday ishlaydi?</h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, #2d7aff, #00c896, transparent)" }} />

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", icon: "✍️", title: "G'oya kiriting", desc: "SMART-Wizard orqali innovatsion g'oyangizni 5 qadamda shakllantiring" },
                { step: "02", icon: "🤖", title: "AI tekshiradi", desc: "Sun'iy intellekt g'oyangizni tahlil qilib, innovatsionlik darajasini aniqlaydi" },
                { step: "03", icon: "🌐", title: "Tarmoqqa yuboriladi", desc: "G'oya kamida 3 ta talabaga 'bumerang' kabi uchirib yuboriladi" },
                { step: "04", icon: "💎", title: "Boyitib qaytadi", desc: "Hamkasblar taklif beradi, AI jamlab, sizga mukammal g'oya qaytaradi" },
              ].map((item) => (
                <div key={item.step} className="glass rounded-2xl p-6 text-center relative glass-hover">
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #2d7aff, #00c896)", color: "white" }}
                  >
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                  <h3 className="font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RANK SYSTEM */}
      <section className="py-24 px-6">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="badge badge-gold mb-4 mx-auto w-fit">🏆 Gamification</div>
            <h2 className="heading-lg">Innovator Rank tizimi</h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
              XP ballar to'plab, yangi darajalarga o'ting
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { rank: "Explorer", icon: "🌱", xp: "0–99 XP", desc: "Platformaga yangi qo'shilganlar uchun", color: "rank-bg-explorer rank-explorer", badge: "badge-green" },
              { rank: "Specialist", icon: "⚡", xp: "100–299 XP", desc: "Faol ishtirokchilar uchun", color: "rank-bg-specialist rank-specialist", badge: "badge-blue" },
              { rank: "Master", icon: "🔮", xp: "300–699 XP", desc: "Tajribali innovatorlar uchun", color: "rank-bg-master rank-master", badge: "badge-violet" },
              { rank: "Visionary", icon: "👑", xp: "700+ XP", desc: "Platforma liderlar uchun", color: "rank-bg-visionary rank-visionary", badge: "badge-gold" },
            ].map((r) => (
              <div key={r.rank} className={`glass rounded-2xl p-6 ${r.color} glass-hover`}>
                <div className="text-5xl mb-4">{r.icon}</div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{r.rank}</h3>
                <div className={`badge ${r.badge} mb-3 text-xs`}>{r.xp}</div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="page-container">
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ background: "radial-gradient(ellipse at center, #2d7aff, transparent)" }} />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 anim-float">
                <BoomerangIcon className="w-full h-full" />
              </div>
              <h2 className="heading-lg mb-4">G'oyangizni hoziroq yuboring!</h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                Magistrlik dissertatsiyangiz uchun innovatsion g'oyangizni Smart-Boomerang bilan boyiting.
              </p>
              <Link href="/auth/register" className="btn-primary btn-green">
                🚀 Bepul boshlash
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-6 h-6"><BoomerangIcon className="w-full h-full" /></div>
          <span className="font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Smart-Boomerang</span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          © 2024 Smart-Boomerang. Magistrlik dissertatsiyasi platformasi.
        </p>
      </footer>
    </main>
  );
}
