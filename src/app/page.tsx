"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

// The new 3D Glowing Kinetic Boomerang SVG
function KineticBoomerang({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#32FF7E" />
          <stop offset="50%" stopColor="#6F1EFE" />
          <stop offset="100%" stopColor="#FF4D4D" />
        </linearGradient>
        <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer Glow Path */}
      <path
        d="M20 160 Q80 40 180 40 Q140 100 80 130 Q40 140 20 160Z"
        fill="url(#neonGlow)"
        opacity="0.3"
        filter="url(#glowEffect)"
      />
      {/* Core Body */}
      <path
        d="M25 155 Q80 45 175 45 Q140 95 85 125 Q45 135 25 155Z"
        fill="rgba(255,255,255,0.05)"
        stroke="url(#neonGlow)"
        strokeWidth="3"
        style={{ backdropFilter: "blur(10px)" }}
      />
      {/* Iridescent Fiber Lines */}
      <path
        d="M40 140 Q85 60 160 55"
        stroke="#32FF7E"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M30 150 Q80 50 170 50"
        stroke="#6F1EFE"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

// Fluid Liquid Backgrounds
function LiquidGradients() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Electric Indigo Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob" style={{ background: "#6F1EFE" }}></div>
      {/* Cyber Lime Blob */}
      <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-2000" style={{ background: "#32FF7E" }}></div>
      {/* Sunset Orange Blob */}
      <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-blob animation-delay-4000" style={{ background: "#FF4D4D" }}></div>
    </div>
  );
}

export default function Home() {
  const boomerangContainerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Parallax and Mouse Tracking for Boomerang
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!boomerangContainerRef.current) return;
      
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40; // 40px range
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      // 3D Tilt effect
      boomerangContainerRef.current.style.transform = `translate(-50%, -50%) rotateX(${-yPos}deg) rotateY(${xPos}deg)`;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
        heroTextRef.current.style.opacity = `${1 - scrollY / 600}`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="relative z-10 min-h-screen bg-[#05050A]">
      <LiquidGradients />

      {/* NAVBAR: Top Right Auth */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#05050A]/60 border-b border-white/5 backdrop-blur-[24px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 anim-spin-slow">
            <KineticBoomerang className="w-full h-full" />
          </div>
          <span className="font-outfit font-black text-xl md:text-2xl tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Smart-Boomerang
          </span>
        </div>
        
        {/* Right Auth - ALWAYS TOP RIGHT */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-semibold text-white/70 hover:text-[#32FF7E] transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-elastic px-5 py-2.5 rounded-xl text-sm font-bold text-[#05050A] shadow-[0_0_20px_rgba(50,255,126,0.3)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(50,255,126,0.6)]" style={{ background: "linear-gradient(135deg, #32FF7E 0%, #00C896 100%)" }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* Central 3D Kinetic Object */}
        <div 
          ref={boomerangContainerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] pointer-events-none transition-transform duration-1000 ease-out z-0"
          style={{ perspective: "1000px" }}
        >
          <div className="w-full h-full anim-spin-slow">
             <KineticBoomerang className="w-full h-full opacity-60 mix-blend-screen" />
          </div>
        </div>

        {/* Hero Text */}
        <div ref={heroTextRef} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
             <span className="w-2 h-2 rounded-full bg-[#FF4D4D] animate-pulse"></span>
             <span className="text-xs font-bold tracking-widest text-[#FF4D4D] uppercase">AI-Powered Education</span>
          </div>
          
          <h1 className="font-outfit text-5xl md:text-7xl lg:text-[90px] font-black leading-[1.05] tracking-tighter mb-8">
            The Future of <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #6F1EFE, #32FF7E)" }}>
              Pedagogical Innovation
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 font-light">
            Deploy your ideas into the P2P network. AI analyzes, peers refine, and it boomerangs back as a masterpiece.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/register" className="btn-elastic px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-[0_10px_30px_rgba(111,30,254,0.4)]" style={{ background: "linear-gradient(135deg, #6F1EFE 0%, #8A4FFF 100%)" }}>
              Launch Idea 🚀
            </Link>
            <a href="#bento" className="text-white/60 hover:text-white font-medium transition-colors flex items-center gap-2 group">
              Explore Network 
              <span className="transition-transform group-hover:translate-x-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* BENTO GRID LAYOUT */}
      <section id="bento" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-outfit text-4xl md:text-6xl font-black mb-4">Hyper-Modern <span className="text-[#32FF7E]">Workflow</span></h2>
            <p className="text-xl text-white/50">Engineered for extreme performance and deep analytical insights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
            
            {/* Bento Card 1: Large Area */}
            <div className="md:col-span-2 md:row-span-2 rounded-[32px] p-10 border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group hover:border-[#6F1EFE]/30 transition-colors duration-500">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#6F1EFE] rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#6F1EFE]/20 flex items-center justify-center text-3xl mb-8 border border-[#6F1EFE]/30">🧠</div>
              <h3 className="font-outfit text-4xl font-bold mb-4">SMART-Wizard Engine</h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                A highly interactive 5-step wizard that forces you to structure your pedagogical concepts using strict SMART criteria. No more vague ideas—only precise, measurable goals.
              </p>
            </div>

            {/* Bento Card 2: Top Right */}
            <div className="md:col-span-2 rounded-[32px] p-8 border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group hover:border-[#32FF7E]/30 transition-colors duration-500">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#32FF7E] rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-xl bg-[#32FF7E]/20 flex items-center justify-center text-2xl border border-[#32FF7E]/30">🤖</div>
                 <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#32FF7E] to-transparent opacity-50">AI</div>
               </div>
               <h3 className="font-outfit text-2xl font-bold mb-2">Automated Assessment</h3>
               <p className="text-white/60">Our proprietary AI instantly calculates an Innovation Score (%) and provides deep architectural feedback.</p>
            </div>

            {/* Bento Card 3: Bottom Middle */}
            <div className="rounded-[32px] p-8 border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group hover:border-[#FF4D4D]/30 transition-colors duration-500">
               <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#FF4D4D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="text-4xl mb-4">🌐</div>
               <h3 className="font-outfit text-xl font-bold mb-2">P2P Network</h3>
               <p className="text-white/50 text-sm">Distribute ideas to peers instantly.</p>
            </div>

            {/* Bento Card 4: Bottom Right */}
            <div className="rounded-[32px] p-8 border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
               <div className="text-4xl mb-4">🏆</div>
               <h3 className="font-outfit text-xl font-bold mb-2">Gamification</h3>
               <p className="text-white/50 text-sm">Earn XP, rank up to Visionary, and dominate the leaderboard.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center relative z-10 bg-[#05050A]">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-6 h-6"><KineticBoomerang className="w-full h-full" /></div>
          <span className="font-outfit font-black tracking-widest text-white/80">SMART BOOMERANG</span>
        </div>
        <p className="text-white/30 text-xs font-mono">SYS.VERSION 2.0 // DEEP SPACE EDITION</p>
      </footer>
    </main>
  );
}
