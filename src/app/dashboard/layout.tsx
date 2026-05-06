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
  { href: "/dashboard",           icon: "🏠", label: "Dashboard"    },
  { href: "/dashboard/feed",      icon: "🌐", label: "Lenta"        },
  { href: "/dashboard/smart",     icon: "🎯", label: "SMART"        },
  { href: "/dashboard/challenges",icon: "📝", label: "Topshiriq"    },
  { href: "/dashboard/projects",  icon: "💡", label: "G'oyalarim"   },
  { href: "/dashboard/profile",   icon: "👤", label: "Profil"       },
  { href: "/dashboard/admin",     icon: "📊", label: "Admin"        },
];

// Mobile bottom nav shows fewer items
const mobileNavItems = [
  { href: "/dashboard",           icon: "🏠", label: "Bosh"         },
  { href: "/dashboard/feed",      icon: "🌐", label: "Lenta"        },
  { href: "/dashboard/smart",     icon: "✏️", label: "G'oya"        },
  { href: "/dashboard/challenges",icon: "📝", label: "Vazifalar"    },
  { href: "/dashboard/profile",   icon: "👤", label: "Profil"       },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)", fontFamily: "Inter, sans-serif" }}>

      {/* ══ SIDEBAR — Desktop only ══ */}
      <aside style={{
        width: "240px", background: "#fff", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }} className="hidden lg:flex">

        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <JilolaIcon size={28} id="dash-logo" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--dark)", letterSpacing: "-0.02em" }}>
              Jilola
            </span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 10px 8px" }}>
            Menyu
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 10px", borderRadius: "8px", textDecoration: "none",
                fontSize: "13px", fontWeight: active ? 600 : 500,
                color: active ? "var(--dark)" : "var(--text-light)",
                background: active ? "var(--bg-soft)" : "transparent",
                transition: "background 0.2s, color 0.2s",
              }}>
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "var(--bg-soft)", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Loyiha Muallifi</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--dark)", marginBottom: "2px" }}>Primova Durdona</div>
            <div style={{ fontSize: "11px", color: "var(--text-light)", lineHeight: 1.4 }}>70610105 – Ta'limda AT magistranti</div>
          </div>

          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "10px", width: "100%",
            padding: "9px 10px", borderRadius: "8px",
            fontSize: "13px", fontWeight: 500, color: "#e11d48",
            background: "transparent", border: "none", cursor: "pointer",
            transition: "background 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "16px" }}>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* ══ MOBILE TOP BAR ══ */}
      <div className="lg:hidden" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", height: "54px",
      }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <JilolaIcon size={24} id="mob-logo" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, color: "var(--dark)", fontSize: "1rem" }}>Jilola</span>
        </Link>
        <button
          onClick={() => setSideOpen(!sideOpen)}
          style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "8px", width: "36px", height: "36px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {sideOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Slide-over Menu */}
      {sideOpen && (
        <div className="lg:hidden" style={{
          position: "fixed", inset: 0, top: "54px", zIndex: 40, background: "rgba(0,0,0,0.4)",
        }} onClick={() => setSideOpen(false)}>
          <div style={{ background: "#fff", width: "260px", height: "100%", padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }} onClick={e => e.stopPropagation()}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "10px",
                textDecoration: "none", fontSize: "15px", color: "var(--dark)",
                fontWeight: pathname === item.href ? 700 : 500,
                background: pathname === item.href ? "var(--bg-soft)" : "transparent",
              }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>{item.label}
              </Link>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%",
              padding: "12px 14px", border: "none", background: "#fff1f2",
              borderRadius: "10px", fontSize: "15px", color: "#e11d48", fontWeight: 600, cursor: "pointer"
            }}>
              <span>🚪</span> Chiqish
            </button>
          </div>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <main className="lg:pt-8 dashboard-content" style={{ flex: 1, padding: "16px", paddingTop: "70px", minWidth: 0 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="bottom-nav lg:hidden">
        {mobileNavItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 600, color: "#e11d48", padding: "4px 0" }}>
          <span style={{ fontSize: "22px" }}>🚪</span>
          <span>Chiqish</span>
        </button>
      </nav>

    </div>
  );
}
