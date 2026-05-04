"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Boomerang SVG animation component
function BoomerangIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill="url(#bgrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <defs>
        <linearGradient id="bgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d7aff" />
          <stop offset="100%" stopColor="#00f5b2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Glowing Aura background for original design
function GlowingAura() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2d7aff] mix-blend-screen filter blur-[100px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00c896] mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
      <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-[#7c3aed] mix-blend-screen filter blur-[90px] opacity-15 animate-blob animation-delay-2000"></div>
    </div>
  );
}

export default function Home() {
  const boomerangRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = boomerangRef.current;
    if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.015;
      const x = Math.sin(t) * 40;
      const y = Math.sin(t * 1.5) * 20;
      const r = t * 100;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const features = [
    { icon: "🎯", title: "SMART-Wizard", desc: "5 qadamli interaktiv forma orqali g'oyangizni aniq va o'lchanadigan qiling.", color: "blue" },
    { icon: "🤖", title: "AI-Tahlil", desc: "Sun'iy intellekt innovatsionlik darajasini (%) hisoblaydi va tavsiyalar beradi.", color: "green" },
    { icon: "🌐", title: "P2P Tarmoq", desc: "G'oya tarmoqqa 'bumerang' bo'lib uchadi. Boshqalar boyitadi va sizga qaytadi.", color: "violet" },
    { icon: "🏆", title: "Gamification", desc: "Takliflar berib XP yig'ing va Explorer'dan Visionary darajasigacha ko'tariling.", color: "gold" },
  ];

  return (
    <main className="relative min-h-screen bg-[#060d18] text-white font-inter overflow-x-hidden">
      <GlowingAura />
      
      {/* ORIGINAL FLOATING NAVBAR - Top Right aligned Auth */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 bg-[#060d18]/80 backdrop-blur-xl border-b border-white/5 shadow-lg" : "py-5 md:py-6 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo (Left) */}
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:rotate-180">
              <BoomerangIcon className="w-full h-full" />
            </div>
            <span className="font-outfit font-black text-xl md:text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 group-hover:from-[#2d7aff] group-hover:to-[#00f5b2] transition-all duration-300">
              S-Boomerang
            </span>
          </div>

          {/* Desktop Menu (Center) - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <a href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Imkoniyatlar</a>
            <a href="#how" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Jarayon</a>
            <a href="#stats" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Statistika</a>
          </div>

          {/* Auth Actions (Top Right) - Highly visible, mobile-first */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors px-2">
              Kirish
            </Link>
            <Link href="/auth/register" className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#2d7aff] to-[#00f5b2] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow"></span>
              <div className="relative flex items-center gap-2 bg-[#060d18] px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 group-hover:bg-transparent">
                <span className="text-xs md:text-sm font-bold text-white tracking-wide">Boshlash</span>
                <svg className="w-4 h-4 text-[#00f5b2] group-hover:text-[#060d18] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center text-center z-10">
        
        {/* Animated Background Boomerang */}
        <div ref={boomerangRef} className="absolute top-[40%] w-[300px] md:w-[500px] aspect-square opacity-[0.03] pointer-events-none mix-blend-screen blur-[2px]">
          <BoomerangIcon className="w-full h-full drop-shadow-[0_0_30px_rgba(45,122,255,1)]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs md:text-sm font-medium text-white/80">Magistrlik dissertatsiyasi loyihasi</span>
        </div>

        <h1 className="font-outfit text-[40px] leading-[1.1] md:text-[72px] lg:text-[84px] font-black tracking-tight mb-6 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          G'oyangizni <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d7aff] to-[#00c896]">SMART</span> qiling,
          <br /> Bumerang kabi <span className="relative inline-block">
            qaytaring
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" fill="none" stroke="#00c896" strokeWidth="4" strokeLinecap="round" /></svg>
          </span>
        </h1>

        <p className="text-base md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Pedagogik innovatsiyangizni kiriting. Sun'iy intellekt tahlil qilsin, hamkasblar boyitsin va o'zgarishlar mukammal holatda sizga qaytsin.
        </p>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/auth/register" className="w-full sm:w-auto bg-gradient-to-r from-[#2d7aff] to-[#00c896] text-white font-bold py-4 px-8 rounded-2xl shadow-[0_10px_30px_rgba(0,200,150,0.3)] hover:shadow-[0_15px_40px_rgba(0,200,150,0.5)] hover:-translate-y-1 transition-all duration-300 text-center flex items-center justify-center gap-2">
            <span>Yangi loyiha boshlash</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </Link>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-20 max-w-5xl mx-auto w-full px-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { v: "5", l: "SMART Mezon" },
            { v: "AI", l: "Tyutor Tahlili" },
            { v: "3+", l: "Tarmoq Taklifi" },
            { v: "XP", l: "Rank Tizimi" }
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center hover:bg-white/[0.06] transition-colors cursor-default">
              <span className="font-outfit text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-1">{s.v}</span>
              <span className="text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-widest text-center">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES - BENTO GRID DESIGN (Original approach) */}
      <section id="features" className="py-20 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl md:text-5xl font-bold mb-4">Platforma Imkoniyatlari</h2>
            <p className="text-white/50 max-w-xl mx-auto">Zamonaviy ta'lim va texnologiyalarning o'ziga xos sintezi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
            {/* Bento Box 1 */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#1a2b4c] to-[#0a1628] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2d7aff] rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="font-outfit text-2xl font-bold mb-3">SMART-Wizard</h3>
              <p className="text-white/60 max-w-sm">G'oyangizni shakllantirish uchun maxsus 5 qadamli interaktiv yordamchi. Har bir mezon bo'yicha aniq ma'lumot kiriting.</p>
            </div>
            
            {/* Bento Box 2 */}
            <div className="bg-gradient-to-br from-[#0a281e] to-[#061812] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f5b2] rounded-full mix-blend-screen filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="font-outfit text-2xl font-bold mb-3">AI Tyutor</h3>
              <p className="text-white/60 text-sm">Sun'iy intellekt innovatsionlik darajasini hisoblab, sizga tavsiyalar beradi.</p>
            </div>

            {/* Bento Box 3 */}
            <div className="bg-gradient-to-br from-[#2b1a4a] to-[#120a21] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7c3aed] rounded-full mix-blend-screen filter blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="text-5xl mb-6">🌐</div>
              <h3 className="font-outfit text-2xl font-bold mb-3">P2P Bumerang</h3>
              <p className="text-white/60 text-sm">Tarmoqdagi talabalar bir-birining g'oyalarini boyitishadi.</p>
            </div>

            {/* Bento Box 4 */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#2a220a] to-[#141005] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#f5a623] rounded-full mix-blend-screen filter blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="text-5xl mb-6">🏆</div>
              <h3 className="font-outfit text-2xl font-bold mb-3">Gamification & XP</h3>
              <p className="text-white/60 max-w-sm">Takliflar berish orqali XP ballarini to'plang va "Explorer" darajasidan "Visionary" darajasiga ko'tariling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE BOTTOM NAVIGATION (Original UI approach for Mobile-First) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-50">
        <div className="bg-[#060d18]/90 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-between">
          <Link href="/auth/login" className="flex-1 text-center text-sm font-medium text-white/70 py-3 rounded-full hover:bg-white/5 transition-colors">
            Kirish
          </Link>
          <div className="w-px h-6 bg-white/10"></div>
          <Link href="/auth/register" className="flex-1 text-center text-sm font-bold text-white bg-gradient-to-r from-[#2d7aff] to-[#00c896] py-3 rounded-full shadow-lg ml-2">
            Boshlash
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 text-center relative z-10 bg-[#060d18]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-5 h-5"><BoomerangIcon className="w-full h-full" /></div>
          <span className="font-outfit font-bold tracking-wide">Smart-Boomerang</span>
        </div>
        <p className="text-white/40 text-xs">© 2024 Magistrlik dissertatsiyasi loyihasi.</p>
        <div className="mt-24 md:hidden"></div> {/* Extra space for mobile bottom nav */}
      </footer>
    </main>
  );
}
