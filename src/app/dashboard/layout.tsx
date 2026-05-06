"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function JilolaIcon({ size = 32, id = "side-b" }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)", fontFamily: "Inter, sans-serif" }}>

      {/* ══ SIDEBAR — Desktop ══ */}
      <aside style={{
        width: "260px",
        background: "#fff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }} className="hidden lg:flex">

        {/* Logo */}
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <JilolaIcon size={28} id="dash-logo" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--dark)", letterSpacing: "-0.02em" }}>
              Jilola
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 12px 8px" }}>
            Menyu
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 12px", borderRadius: "8px", textDecoration: "none",
                  fontSize: "14px", fontWeight: active ? 600 : 500,
                  color: active ? "var(--dark)" : "var(--text-light)",
                  background: active ? "var(--bg-soft)" : "transparent",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area */}
        <div style={{ padding: "20px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Author Attribution */}
          <div style={{ background: "var(--bg-soft)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
              Loyiha Muallifi
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--dark)", marginBottom: "2px" }}>
              Primova Durdona
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-light)", lineHeight: 1.4 }}>
              70610105 – "Ta’limda axborot texnologiyalari" magistranti
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%",
              padding: "10px 12px", borderRadius: "8px", textDecoration: "none",
              fontSize: "14px", fontWeight: 500, color: "#e11d48",
              background: "transparent", border: "none", cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#fff1f2"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.background = "transparent"}
          >
            <span style={{ fontSize: "18px" }}>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* ══ MOBILE NAVBAR ══ */}
      <div className="lg:hidden" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px"
      }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <JilolaIcon size={24} id="mob-logo" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, color: "var(--dark)" }}>Jilola</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", fontSize: "20px", color: "var(--dark)", cursor: "pointer" }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden" style={{
          position: "fixed", inset: 0, top: "54px", zIndex: 40,
          background: "#fff", padding: "20px"
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px", borderBottom: "1px solid var(--border)",
                textDecoration: "none", fontSize: "15px", color: "var(--dark)",
                fontWeight: pathname === item.href ? 700 : 500,
              }}
            >
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%",
              padding: "14px", border: "none", background: "none",
              fontSize: "15px", color: "#e11d48", fontWeight: 500, cursor: "pointer"
            }}
          >
            <span>🚪</span> Chiqish
          </button>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <main style={{ flex: 1, padding: "32px", paddingTop: "86px" }} className="lg:pt-8">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

    </div>
  );
}
