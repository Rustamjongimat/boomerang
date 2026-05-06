"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const PWAInstallBanner = dynamic(() => import("@/components/PWAInstallBanner"), { ssr: false });

function JilolaIcon({ size = 28, id = "side-b" }: { size?: number; id?: string }) {
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
  { href: "/dashboard",            icon: "🏠", label: "Dashboard"    },
  { href: "/dashboard/feed",       icon: "🌐", label: "Lenta"        },
  { href: "/dashboard/smart",      icon: "🎯", label: "SMART Wizard" },
  { href: "/dashboard/challenges", icon: "📝", label: "Topshiriqlar" },
  { href: "/dashboard/projects",   icon: "💡", label: "Loyihalarim"  },
  { href: "/dashboard/profile",    icon: "👤", label: "Profil"       },
  { href: "/dashboard/admin",      icon: "📊", label: "Admin Panel"  },
];

const mobileNavItems = [
  { href: "/dashboard",            icon: "🏠", label: "Bosh"      },
  { href: "/dashboard/feed",       icon: "🌐", label: "Lenta"     },
  { href: "/dashboard/smart",      icon: "✏️", label: "G'oya"     },
  { href: "/dashboard/challenges", icon: "📝", label: "Vazifalar" },
  { href: "/dashboard/profile",    icon: "👤", label: "Profil"    },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

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

      {/* ══ RESPONSIVE STYLE BLOCK ══ */}
      <style>{`
        /* DESKTOP sidebar */
        .dash-sidebar { display: flex; }
        /* DESKTOP: mobile bar + bottom nav hidden */
        .dash-mobile-header { display: none; }
        .dash-bottom-nav    { display: none; }
        /* DESKTOP main padding */
        .dash-main { padding: 32px; padding-top: 32px; }

        /* MOBILE (< 1024px) */
        @media (max-width: 1023px) {
          .dash-sidebar        { display: none; }
          .dash-mobile-header  { display: flex; }
          .dash-bottom-nav     { display: flex; }
          .dash-main {
            padding: 12px;
            padding-top: 66px;
            padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>

      {/* ══ SIDEBAR — Desktop only ══ */}
      <aside
        className="dash-sidebar"
        style={{
          width: "240px", background: "#fff", borderRight: "1px solid var(--border)",
          flexDirection: "column", flexShrink: 0,
          position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <JilolaIcon size={26} id="dash-logo" />
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.1rem", color: "var(--dark)", letterSpacing: "-0.02em" }}>
              Jilola
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
            Menyu
          </div>
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 10px", borderRadius: "8px", textDecoration: "none",
                fontSize: "13px", fontWeight: active ? 700 : 500,
                color: active ? "var(--dark)" : "var(--text-light)",
                background: active ? "var(--bg-soft)" : "transparent",
                transition: "background 0.15s, color 0.15s",
                borderLeft: active ? "3px solid var(--pink)" : "3px solid transparent",
              }}>
                <span style={{ width: "20px", textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
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
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* ══ MOBILE TOP BAR ══ */}
      <header
        className="dash-mobile-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#fff", borderBottom: "1px solid var(--border)",
          alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: "54px",
        }}
      >
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <JilolaIcon size={22} id="mob-logo" />
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, color: "var(--dark)", fontSize: "1rem" }}>Jilola</span>
        </Link>
        <button
          onClick={() => setSideOpen(true)}
          style={{
            background: "var(--bg-soft)", border: "1px solid var(--border)",
            borderRadius: "8px", width: "38px", height: "38px",
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >☰</button>
      </header>

      {/* Mobile Drawer */}
      {sideOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex" }}
          onClick={() => setSideOpen(false)}
        >
          <div style={{ flex: 1, background: "rgba(0,0,0,0.45)" }} />
          <div
            style={{
              width: "280px", background: "#fff", height: "100%",
              display: "flex", flexDirection: "column", overflowY: "auto",
              boxShadow: "-4px 0 32px rgba(0,0,0,0.15)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link href="/dashboard" onClick={() => setSideOpen(false)} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <JilolaIcon size={24} id="drawer-logo" />
                <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, color: "var(--dark)" }}>Jilola</span>
              </Link>
              <button onClick={() => setSideOpen(false)} style={{ background: "var(--bg-soft)", border: "none", borderRadius: "6px", width: "32px", height: "32px", fontSize: "16px", cursor: "pointer" }}>✕</button>
            </div>
            <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "13px 14px", borderRadius: "10px", textDecoration: "none",
                    fontSize: "15px", color: active ? "var(--dark)" : "var(--text-light)",
                    fontWeight: active ? 700 : 500,
                    background: active ? "var(--bg-soft)" : "transparent",
                    borderLeft: active ? "3px solid var(--pink)" : "3px solid transparent",
                  }}>
                    <span style={{ fontSize: "20px", width: "24px", textAlign: "center" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ background: "var(--bg-soft)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Muallif</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--dark)" }}>Primova Durdona</div>
                <div style={{ fontSize: "12px", color: "var(--text-light)", lineHeight: 1.4, marginTop: "2px" }}>70610105 – Ta'limda AT magistranti</div>
              </div>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: "12px", width: "100%",
                padding: "13px 14px", border: "none", background: "#fff5f5",
                borderRadius: "10px", fontSize: "15px", color: "#e11d48", fontWeight: 600, cursor: "pointer"
              }}>
                <span>🚪</span> Hisobdan chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <main className="dash-main" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav
        className="dash-bottom-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: "#fff", borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {mobileNavItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "3px",
                padding: "8px 4px", fontSize: "10px", fontWeight: 600,
                color: active ? "var(--pink)" : "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "3px",
            padding: "8px 4px", fontSize: "10px", fontWeight: 600,
            color: "#e11d48", background: "none", border: "none", cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "22px", lineHeight: 1 }}>🚪</span>
          <span>Chiqish</span>
        </button>
      </nav>

      {/* PWA Install Banner — mobile only */}
      <PWAInstallBanner />

    </div>
  );
}
