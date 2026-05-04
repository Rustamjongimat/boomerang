"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string; title: string; specific: string; status: string;
  innovScore: number | null; viewCount: number; createdAt: string;
  _count: { interactions: number };
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  DRAFT:        { label: "Qoralama",       color: "#6e6d7a", bg: "#f3f3f4", icon: "📝" },
  BOOMERANGED:  { label: "Yuborilgan",     color: "#0d6efd", bg: "#e8f0fe", icon: "🚀" },
  IN_REVIEW:    { label: "Kutilmoqda",     color: "#d97706", bg: "#fef9ee", icon: "🔍" },
  COMPLETED:    { label: "Yakunlangan",    color: "#00b37e", bg: "#e6f8f3", icon: "✅" },
};

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { setProjects(d.projects ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
        <div>
          <div style={{
            display: "inline-block", background: "var(--bg-dark)", color: "#fff",
            padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
          }}>
            💡 Mening Loyihalarim
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
            Innovatsion <span style={{ color: "var(--pink)" }}>G'oyalaringiz</span>
          </h1>
        </div>
        <Link href="/dashboard/smart" style={{
          background: "var(--pink)", color: "#fff", padding: "10px 20px",
          borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "14px",
          transition: "background 0.2s"
        }}>
          ✍️ Yangi g'oya kiritish
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {[1,2,3].map(i => (
             <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", height: "200px", animation: "pulse 2s infinite" }} />
          ))}
          <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
        </div>
      ) : projects.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "24px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📝</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--dark)", marginBottom: "8px" }}>
            Hali loyihalar yo'q
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-light)", marginBottom: "24px" }}>
            Birinchi innovatsion g'oyangizni SMART mezonlari asosida kiriting.
          </p>
          <Link href="/dashboard/smart" style={{
            display: "inline-block", background: "var(--dark)", color: "#fff", padding: "12px 24px",
            borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "14px"
          }}>
            G'oya kiritish →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {projects.map(p => {
            const sm = STATUS_META[p.status] ?? STATUS_META.DRAFT;
            return (
              <Link href={`/dashboard/projects/${p.id}`} key={p.id} style={{
                background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
                padding: "24px", textDecoration: "none", display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "translateY(-4px)";
                t.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "none";
                t.style.boxShadow = "none";
              }}>
                <div style={{
                  position: "absolute", right: "-20px", top: "-20px", fontSize: "80px",
                  opacity: 0.04, pointerEvents: "none", transition: "transform 0.3s"
                }} className="card-bg-icon">
                  {sm.icon}
                </div>
                <style>{`a:hover .card-bg-icon { transform: scale(1.1) rotate(10deg); }`}</style>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", position: "relative", zIndex: 10 }}>
                  <span style={{
                    background: sm.bg, color: sm.color, padding: "4px 10px",
                    borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px"
                  }}>
                    {sm.icon} {sm.label}
                  </span>
                  {p.innovScore && (
                    <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: 800, color: p.innovScore >= 70 ? "#00b37e" : "#f59e0b" }}>
                      {p.innovScore}%
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-light)", lineHeight: 1.6, flex: 1, marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.specific}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", paddingTop: "16px", borderTop: "1px solid var(--border)", position: "relative", zIndex: 10 }}>
                  <div style={{ display: "flex", gap: "12px", fontWeight: 500 }}>
                    <span>👁 {p.viewCount}</span>
                    <span style={{ color: p._count.interactions > 0 ? "#00b37e" : "inherit" }}>
                      💬 {p._count.interactions}
                    </span>
                  </div>
                  <span>{new Date(p.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
