"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Project {
  id: string;
  title: string;
  specific: string;
  status: string;
  innovScore: number | null;
  viewCount: number;
  createdAt: string;
  owner: { name: string; direction: string; rank: string };
  _count: { interactions: number };
}

const RANK_ICONS: Record<string, string> = {
  EXPLORER: "🌱", SPECIALIST: "⚡", MASTER: "🔮", VISIONARY: "👑",
};

export default function FeedPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [technology, setTechnology] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSuggest = async () => {
    if (!selected) return;
    if (suggestion.length < 50) { toast.error("Kamida 50 ta belgi yozing"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${selected.id}/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionText: suggestion, technology }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Taklifingiz yuborildi! +10 XP olasiz.");
        setSelected(null);
        setSuggestion("");
        setTechnology("");
        setProjects((prev) => prev.map((p) =>
          p.id === selected.id ? { ...p, _count: { interactions: (p._count?.interactions ?? 0) + 1 } } : p
        ));
      } else {
        toast.error(data.error || "Xatolik");
      }
    } catch { toast.error("Server xatosi"); }
    finally { setSubmitting(false); }
  };

  const filtered = filter === "ALL" ? projects
    : projects.filter((p) => p.status === filter);

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null;
    const color = score >= 80 ? "#00b37e" : score >= 60 ? "#0d6efd" : score >= 40 ? "#d97706" : "#f43f5e";
    return (
      <span style={{
        color, background: `${color}18`, border: `1px solid ${color}30`,
        padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700
      }}>
        ⚡ {score}%
      </span>
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "inline-block", background: "var(--bg-dark)", color: "#fff",
          padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
        }}>
          🌐 Jilola Lentasi
        </div>
        <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
          Hamkasblaringiz G'oyalarini <span style={{ color: "var(--pink)" }}>Boyiting</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
          Har bir qabul qilingan taklif uchun +10 XP olasiz!
        </p>
      </div>

      {/* ══ FILTERS ══ */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {[
          { key: "ALL", label: "Hammasi" },
          { key: "BOOMERANGED", label: "🚀 Faol" },
          { key: "IN_REVIEW", label: "🔍 Ko'rib chiqilmoqda" },
        ].map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: isActive ? "var(--dark)" : "#fff",
                color: isActive ? "#fff" : "var(--text-light)",
                border: isActive ? "1px solid var(--dark)" : "1px solid var(--border)",
                padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {f.label}
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", background: "#fef9ee", color: "#d97706", border: "1px solid #fef08a", padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600 }}>
          {filtered.length} ta loyiha
        </span>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", height: "240px", animation: "pulse 2s infinite" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "24px", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌐</div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>
            Hozircha lentada loyiha yo'q
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
            Birinchi bo'lib g'oyangizni yuboring!
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{
              background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
              padding: "24px", display: "flex", flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s"
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
              
              {/* Owner Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "#e8f0fe", border: "1px solid #d1e3fd", color: "#0d6efd",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 800, flexShrink: 0
                }}>
                  {p.owner.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.owner.name}
                    <span style={{ fontSize: "14px" }}>{RANK_ICONS[p.owner.rank]}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-light)" }}>{p.owner.direction}</div>
                </div>
                <div style={{ flexShrink: 0 }}>{getScoreBadge(p.innovScore)}</div>
              </div>

              {/* Title & specific text */}
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-light)", lineHeight: 1.6, flex: 1, marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.specific}
              </p>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                  <span>👁 {p.viewCount}</span>
                  <span>💬 {p._count?.interactions ?? 0}</span>
                </div>
                <button
                  onClick={() => setSelected(p)}
                  style={{
                    background: "var(--pink)", color: "#fff", border: "none", borderRadius: "6px",
                    padding: "6px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = "var(--pink-hover)"}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = "var(--pink)"}
                >
                  Taklif berish →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL ══ */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100, background: "rgba(13,13,13,0.6)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "560px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.1)", animation: "slideUp 0.3s ease-out"
          }}>
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <div style={{ display: "inline-block", background: "#e8f0fe", color: "#0d6efd", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>
                  💬 Taklif berish
                </div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--dark)" }}>
                  {selected.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-light)", marginTop: "4px" }}>
                  Muallif: <span style={{ fontWeight: 600, color: "var(--dark)" }}>{selected.owner.name}</span>
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "var(--bg-soft)", border: "none", width: "32px", height: "32px",
                borderRadius: "50%", fontSize: "14px", color: "var(--text-light)", cursor: "pointer"
              }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>
                  Taklif matni (kamida 50 belgi)
                </label>
                <textarea
                  placeholder="Bu loyihani qanday boyitish mumkin?..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  style={{
                    width: "100%", minHeight: "120px", padding: "14px", background: "var(--bg-soft)",
                    border: "1.5px solid var(--border)", borderRadius: "10px", fontSize: "14px", color: "var(--dark)",
                    outline: "none", fontFamily: "Inter, sans-serif", resize: "none", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--pink)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
                <div style={{ fontSize: "12px", marginTop: "6px", textAlign: "right", fontWeight: 600, color: suggestion.length >= 50 ? "#00b37e" : "var(--text-muted)" }}>
                  {suggestion.length}/50+
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>
                  Tavsiya etilgan texnologiya (ixtiyoriy)
                </label>
                <input
                  placeholder="Masalan: Phet, Quizizz..."
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-soft)",
                    border: "1.5px solid var(--border)", borderRadius: "10px", fontSize: "14px", color: "var(--dark)",
                    outline: "none", fontFamily: "Inter, sans-serif", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--pink)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setSelected(null)} style={{
                flex: 1, padding: "12px", background: "#fff", color: "var(--dark)",
                border: "1.5px solid var(--border)", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer"
              }}>
                Bekor qilish
              </button>
              <button
                onClick={handleSuggest}
                disabled={submitting || suggestion.length < 50}
                style={{
                  flex: 1, padding: "12px", background: "var(--pink)", color: "#fff",
                  border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600,
                  cursor: (submitting || suggestion.length < 50) ? "not-allowed" : "pointer",
                  opacity: suggestion.length >= 50 ? 1 : 0.5, transition: "background 0.2s"
                }}
              >
                {submitting ? "Yuborilmoqda..." : "✅ Yuborish (+10 XP)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
