"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  user: { name: string; xp: number; rank: string; direction: string };
  activeProjects: number;
  totalSuggestions: number;
  receivedSuggestions: number;
}

const RANK_META: Record<string, { label: string; icon: string; color: string; bg: string; next: number; current: number }> = {
  EXPLORER:   { label: "Explorer",   icon: "🌱", color: "#00b37e", bg: "#e6f8f3", current: 0,   next: 100 },
  SPECIALIST: { label: "Specialist", icon: "⚡", color: "#0d6efd", bg: "#e8f0fe", current: 100, next: 300 },
  MASTER:     { label: "Master",     icon: "🔮", color: "#7c3aed", bg: "#ede9fe", current: 300, next: 700 },
  VISIONARY:  { label: "Visionary",  icon: "👑", color: "#d97706", bg: "#fef9ee", current: 700, next: 9999 },
};

// Reusable card component
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", ...style
  }}>
    {children}
  </div>
);

export default function ProfilePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" style={{ animation: "spin 2s linear infinite" }}>
        <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill="url(#bgl)"/>
        <defs>
          <linearGradient id="bgl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea4c89"/><stop offset="100%" stopColor="#f77eb5"/>
          </linearGradient>
        </defs>
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const user = data?.user ?? { name: "Talaba", xp: 45, rank: "EXPLORER", direction: "Pedagogika" };
  const rank = RANK_META[user.rank] ?? RANK_META.EXPLORER;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "inline-block", background: "var(--bg-dark)", color: "#fff",
          padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
        }}>
          👤 Profil
        </div>
        <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
          Shaxsiy Kabinet
        </h1>
      </div>

      {/* ══ PROFILE CARD ══ */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
        {/* Cover */}
        <div style={{ height: "120px", background: "linear-gradient(135deg, var(--pink), #7c3aed)" }} />
        
        {/* Avatar & Info */}
        <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-48px" }}>
          <div style={{
            width: "96px", height: "96px", borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "4px",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-soft)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", fontWeight: 800, color: "var(--dark)"
            }}>
              {user.name.charAt(0)}
            </div>
          </div>

          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--dark)", marginBottom: "4px" }}>
            {user.name}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "16px" }}>
            {user.direction} yo'nalishi
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: rank.bg, padding: "8px 16px", borderRadius: "100px" }}>
            <span style={{ fontSize: "16px" }}>{rank.icon}</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: rank.color }}>{rank.label} ({user.xp} XP)</span>
          </div>
        </div>
      </Card>

      {/* ══ STATS GRID ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Faol loyihalar",   value: data?.activeProjects ?? 0,      icon: "💡", color: "#0d6efd", bg: "#e8f0fe" },
          { label: "Bergan takliflar", value: data?.totalSuggestions ?? 0,    icon: "💬", color: "#00b37e", bg: "#e6f8f3" },
          { label: "Qabul qilingan",   value: data?.receivedSuggestions ?? 0, icon: "✅", color: "#7c3aed", bg: "#ede9fe" },
        ].map((stat) => (
          <Card key={stat.label} style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--dark)", marginBottom: "4px" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-light)", fontWeight: 500 }}>{stat.label}</div>
          </Card>
        ))}
      </div>

    </div>
  );
}
