"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Project {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  status: string;
  innovScore: number | null;
  viewCount: number;
  createdAt: string;
  owner: { name: string; direction: string; rank: string };
  _count: { interactions: number };
}

interface ChallengeDetails {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: { name: string; rank: string };
  projects: Project[];
}

const RANK_ICONS: Record<string, string> = {
  EXPLORER: "🌱", SPECIALIST: "⚡", MASTER: "🔮", VISIONARY: "👑",
};

export default function ChallengeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Suggestion modal state
  const [selected, setSelected] = useState<Project | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [technology, setTechnology] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/challenges/${params.id}?t=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => { setChallenge(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSuggest = async () => {
    if (!selected) return;
    if (suggestion.trim().length === 0) { toast.error("Taklifni kiriting"); return; }
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
        // Optimistic UI update
        if (challenge) {
          setChallenge({
            ...challenge,
            projects: challenge.projects.map(p => 
              p.id === selected.id ? { ...p, _count: { interactions: (p._count?.interactions ?? 0) + 1 } } : p
            )
          });
        }
      } else {
        toast.error(data.error || "Xatolik");
      }
    } catch { toast.error("Server xatosi"); }
    finally { setSubmitting(false); }
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null;
    const color = score >= 80 ? "#00b37e" : score >= 60 ? "#0d6efd" : score >= 40 ? "#d97706" : "#f43f5e";
    return (
      <span style={{ color, background: `${color}18`, border: `1px solid ${color}30`, padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
        ⚡ {score}%
      </span>
    );
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Yuklanmoqda...</div>;
  }

  if (!challenge || ("error" in challenge)) {
    return <div style={{ textAlign: "center", padding: "40px", color: "var(--pink)" }}>Topshiriq topilmadi.</div>;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      
      <button onClick={() => router.push("/dashboard/challenges")} style={{ background: "transparent", border: "none", color: "var(--text-light)", fontSize: "14px", fontWeight: 600, cursor: "pointer", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
        ← Ortga
      </button>

      {/* Challenge Header */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span style={{ background: "var(--bg-dark)", color: "#fff", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Topshiriq
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-light)", fontWeight: 600 }}>
            Muallif: {challenge.author.name}
          </span>
        </div>
        <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "16px" }}>
          {challenge.title}
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-light)", lineHeight: 1.6, maxWidth: "800px" }}>
          {challenge.description}
        </p>
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push(`/dashboard/smart?challengeId=${challenge.id}`)}
            style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
            Mening g'oyamni qo'shish
          </button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--pink)" }}>
            💡 {challenge.projects.length} ta g'oya yuborilgan
          </span>
        </div>
      </div>

      <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--dark)", marginBottom: "24px" }}>
        G'oyalar va Yechimlar
      </h2>

      {challenge.projects.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "24px", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💡</div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>Hozircha g'oyalar yo'q</p>
          <p style={{ fontSize: "14px", color: "var(--text-light)" }}>Birinchi bo'lib yechimingizni taklif qiling!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {challenge.projects.map((p) => (
            <div key={p.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e8f0fe", color: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, flexShrink: 0 }}>
                  {p.owner.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.owner.name} <span style={{ fontSize: "14px" }}>{RANK_ICONS[p.owner.rank]}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-light)" }}>{p.owner.direction}</div>
                </div>
                <div style={{ flexShrink: 0 }}>{getScoreBadge(p.innovScore)}</div>
              </div>

              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.title}
              </h3>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "S - Aniq", content: p.specific, color: "#0d6efd", bg: "#e8f0fe" },
                  { label: "M - O'lchanadigan", content: p.measurable, color: "#00b37e", bg: "#e6f8f3" },
                  { label: "A - Erishib bo'ladigan", content: p.achievable, color: "#d97706", bg: "#fef9ee" },
                  { label: "R - Dolzarb", content: p.relevant, color: "#7c3aed", bg: "#ede9fe" },
                  { label: "T - Muddatli", content: p.timeBound, color: "#ea4c89", bg: "#fce4ec" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, padding: "10px", borderRadius: "8px", borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: s.color, marginBottom: "4px", textTransform: "uppercase" }}>{s.label}</div>
                    <div style={{ fontSize: "13px", color: "var(--dark)", lineHeight: 1.5 }}>{s.content}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                  <span>👁 {p.viewCount}</span>
                  <span>💬 {p._count?.interactions ?? 0}</span>
                </div>
                <button
                  onClick={() => setSelected(p)}
                  style={{ background: "var(--pink)", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  Fikr / Taklif berish →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(13,13,13,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: "0 24px 48px rgba(0,0,0,0.1)", animation: "slideUp 0.3s ease-out" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <div style={{ display: "inline-block", background: "#e8f0fe", color: "#0d6efd", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px" }}>
                  💬 Taklif berish
                </div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--dark)" }}>{selected.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-light)", marginTop: "4px" }}>Muallif: <span style={{ fontWeight: 600, color: "var(--dark)" }}>{selected.owner.name}</span></p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "var(--bg-soft)", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", color: "var(--text-light)", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>Taklif / Fikr matni</label>
                <textarea
                  placeholder="Bu loyihani qanday boyitish mumkin? Fikringizni yozing..."
                  value={suggestion} onChange={(e) => setSuggestion(e.target.value)} rows={4}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid var(--border)", fontSize: "14px", resize: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--dark)", marginBottom: "8px" }}>Texnologiya (ixtiyoriy)</label>
                <input
                  type="text" placeholder="Masalan: Kahoot, Phet, VR" value={technology} onChange={(e) => setTechnology(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid var(--border)", fontSize: "14px" }}
                />
              </div>
            </div>
            <button disabled={submitting} onClick={handleSuggest} style={{ width: "100%", background: "var(--pink)", color: "#fff", border: "none", borderRadius: "8px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Yuborilmoqda..." : "Yuborish va XP olish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
