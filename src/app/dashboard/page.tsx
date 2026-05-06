"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  user: { name: string; xp: number; rank: string; direction: string };
  activeProjects: number;
  totalSuggestions: number;
  receivedSuggestions: number;
  recentProjects: Array<{
    id: string; title: string; status: string;
    innovScore: number | null; viewCount: number; _count: { interactions: number };
  }>;
  recentInteractions: Array<{
    id: string; suggestionText: string; createdAt: string;
    project: { title: string }; user: { name: string };
  }>;
}

const RANK_META: Record<string, { label: string; icon: string; color: string; bg: string; next: number; current: number }> = {
  EXPLORER:   { label: "Explorer",   icon: "🌱", color: "#00b37e", bg: "#e6f8f3", current: 0,   next: 100 },
  SPECIALIST: { label: "Specialist", icon: "⚡", color: "#0d6efd", bg: "#e8f0fe", current: 100, next: 300 },
  MASTER:     { label: "Master",     icon: "🔮", color: "#7c3aed", bg: "#ede9fe", current: 300, next: 700 },
  VISIONARY:  { label: "Visionary",  icon: "👑", color: "#d97706", bg: "#fef9ee", current: 700, next: 9999 },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:        { label: "Qoralama",       color: "#6e6d7a", bg: "#f3f3f4" },
  BOOMERANGED:  { label: "Yuborilgan 🚀",  color: "#0d6efd", bg: "#e8f0fe" },
  IN_REVIEW:    { label: "Kutilmoqda",     color: "#d97706", bg: "#fef9ee" },
  COMPLETED:    { label: "Yakunlangan ✅", color: "#00b37e", bg: "#e6f8f3" },
};

function JilolaLoader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" style={{ animation: "spin 2s linear infinite" }}>
        <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill="url(#bgl)"/>
        <defs>
          <linearGradient id="bgl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea4c89"/>
            <stop offset="100%" stopColor="#f77eb5"/>
          </linearGradient>
        </defs>
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Reusable card component
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
    ...style
  }}>
    {children}
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <JilolaLoader />;

  // Demo fallback
  const user = data?.user ?? { name: "Talaba", xp: 45, rank: "EXPLORER", direction: "Pedagogika" };
  const rank = RANK_META[user.rank] ?? RANK_META.EXPLORER;
  const xpProgress = ((user.xp - rank.current) / (rank.next - rank.current)) * 100;
  const recentProjects = data?.recentProjects ?? [];
  const recentInteractions = data?.recentInteractions ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--dark)", marginBottom: "4px" }}>
            Salom, <span style={{ color: "var(--pink)" }}>{user.name}</span> 👋
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
            {user.direction} yo'nalishi · Bugun ham innovatsion bo'ling!
          </p>
        </div>
        <Link href="/dashboard/smart" style={{
          background: "var(--pink)", color: "#fff", padding: "10px 20px",
          borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "14px",
          transition: "background 0.2s"
        }}>
          ✍️ Yangi G'oya
        </Link>
      </div>

      {/* ══ XP & RANK CARD ══ */}
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "14px",
              background: rank.bg, color: rank.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
            }}>
              {rank.icon}
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                Joriy Daraja
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: rank.color }}>
                {rank.label}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, color: rank.color }}>
              {user.xp} XP
            </div>
            {user.rank !== "VISIONARY" && (
              <div style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>
                Keyingi daraja uchun {rank.next - user.xp} XP kerak
              </div>
            )}
          </div>
        </div>

        <div style={{ width: "100%", height: "8px", background: "var(--bg-soft)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            width: `${Math.min(xpProgress, 100)}%`, height: "100%",
            background: rank.color, borderRadius: "4px", transition: "width 1s ease-out"
          }} />
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
          <span>{rank.label} ({rank.current} XP)</span>
          {user.rank !== "VISIONARY" && (
            <span>{Object.values(RANK_META).find((r, i) => Object.keys(RANK_META)[i] !== user.rank && r.current === rank.next)?.label} ({rank.next} XP)</span>
          )}
        </div>
      </Card>

      {/* ══ STATS GRID ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Faol loyihalar",   value: data?.activeProjects ?? 0,      icon: "💡", color: "#0d6efd", bg: "#e8f0fe" },
          { label: "Bergan takliflar", value: data?.totalSuggestions ?? 0,    icon: "💬", color: "#00b37e", bg: "#e6f8f3" },
          { label: "Qabul qilingan",   value: data?.receivedSuggestions ?? 0, icon: "✅", color: "#7c3aed", bg: "#ede9fe" },
          { label: "XP ballari",       value: user.xp,                        icon: "⚡", color: "#d97706", bg: "#fef9ee" },
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

      {/* ══ PROJECTS & INTERACTIONS ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Recent Projects */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--dark)" }}>
              Mening Loyihalarim
            </h2>
            <Link href="/dashboard/projects" style={{ fontSize: "12px", color: "var(--pink)", fontWeight: 600, textDecoration: "none" }}>
              Hammasi →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
              <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "16px" }}>Hali loyiha yo'q. Birinchi g'oyangizni yuboring!</p>
              <Link href="/dashboard/smart" style={{
                display: "inline-block", background: "var(--bg-soft)", color: "var(--dark)", padding: "8px 16px",
                borderRadius: "6px", fontSize: "13px", fontWeight: 600, textDecoration: "none", border: "1px solid var(--border)"
              }}>G'oya kiritish</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentProjects.map((p) => {
                const sm = STATUS_META[p.status] ?? STATUS_META.DRAFT;
                return (
                  <Link key={p.id} href={`/dashboard/projects/${p.id}`} style={{
                    display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px",
                    border: "1px solid var(--border)", borderRadius: "12px", textDecoration: "none",
                    transition: "background 0.2s"
                  }} className="hover:bg-gray-50">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--dark)", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.title}
                      </div>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                        <span>👁 {p.viewCount}</span>
                        <span>💬 {p._count?.interactions ?? 0}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span style={{
                        background: sm.bg, color: sm.color, fontSize: "11px", fontWeight: 600,
                        padding: "4px 8px", borderRadius: "6px"
                      }}>
                        {sm.label}
                      </span>
                      {p.innovScore !== null && (
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#00b37e" }}>{p.innovScore}% AI</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Interactions */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--dark)" }}>
              So'nggi Takliflar
            </h2>
            <Link href="/dashboard/feed" style={{ fontSize: "12px", color: "var(--pink)", fontWeight: 600, textDecoration: "none" }}>
              Lenta →
            </Link>
          </div>

          {recentInteractions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌐</div>
              <p style={{ fontSize: "14px", color: "var(--text-light)" }}>Hali taklif yo'q. Boshqalarning loyihalarini boyiting!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentInteractions.map((i) => (
                <div key={i.id} style={{
                  display: "flex", gap: "12px", padding: "16px",
                  background: "var(--bg-soft)", borderRadius: "12px", border: "1px solid var(--border)"
                }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", background: "#e8f0fe", color: "#0d6efd",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0
                  }}>
                    {i.user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                      <span style={{ color: "var(--dark)", fontWeight: 600 }}>{i.user.name}</span>
                      {" "}· {i.project.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {i.suggestionText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
