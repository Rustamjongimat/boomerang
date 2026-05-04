"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function BoomerangIcon({ spinning = false }: { spinning?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${spinning ? "anim-spin-slow" : ""}`}>
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill="url(#bgs)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="bgs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d7aff" />
          <stop offset="100%" stopColor="#00c896" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const navItems = [
  { href: "/dashboard",          icon: "🏠", label: "Dashboard"     },
  { href: "/dashboard/projects", icon: "💡", label: "Loyihalar"     },
  { href: "/dashboard/feed",     icon: "🌐", label: "Lenta"         },
  { href: "/dashboard/smart",    icon: "🎯", label: "SMART Wizard"  },
  { href: "/dashboard/profile",  icon: "👤", label: "Profil"        },
  { href: "/dashboard/admin",    icon: "📊", label: "Admin Panel"   },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="relative z-10 flex min-h-screen">
      {/* SIDEBAR — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r" style={{ borderColor: "var(--glass-border)" }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9"><BoomerangIcon spinning /></div>
            <span className="font-bold text-lg gradient-text" style={{ fontFamily: "Outfit, sans-serif" }}>
              Smart-Boomerang
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "glass-blue text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#2d7aff" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="p-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
            id="logout-btn"
          >
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* MOBILE NAVBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b flex items-center justify-between px-4 py-3" style={{ borderColor: "var(--glass-border)" }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8"><BoomerangIcon spinning /></div>
          <span className="font-bold gradient-text" style={{ fontFamily: "Outfit, sans-serif" }}>Smart-B</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white/70">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16">
          <div className="glass h-full p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "glass-blue text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
              <span>🚪</span> Chiqish
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
