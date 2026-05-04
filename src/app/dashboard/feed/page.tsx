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
    const color = score >= 80 ? "#00c896" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#f43f5e";
    return <span className="badge text-xs ml-2" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
      ⚡ {score}%
    </span>;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="badge badge-green mb-3 w-fit">🌐 Bumerang Lentasi</div>
        <h1 className="heading-lg mb-2">
          Hamkasblaringiz G'oyalarini <span className="gradient-text">Boyiting</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Har bir qabul qilingan taklif uchun +10 XP olasiz!
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "ALL", label: "Hammasi" },
          { key: "BOOMERANGED", label: "🚀 Faol" },
          { key: "IN_REVIEW", label: "🔍 Ko'rib chiqilmoqda" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`badge text-xs cursor-pointer transition-all ${filter === f.key ? "badge-blue" : "badge-green"}`}
            style={{ padding: "6px 14px" }}
          >
            {f.label}
          </button>
        ))}
        <span className="badge badge-gold text-xs ml-auto">{filtered.length} ta loyiha</span>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="skeleton h-5 mb-3 rounded" />
              <div className="skeleton h-3 mb-2 w-2/3 rounded" />
              <div className="skeleton h-16 mb-4 rounded" />
              <div className="skeleton h-9 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌐</div>
          <p className="text-lg mb-2" style={{ color: "var(--text-secondary)" }}>
            Hozircha lentada loyiha yo'q
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Birinchi bo'lib g'oyangizni yuboring!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-6 glass-hover flex flex-col">
              {/* Owner */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: "rgba(45,122,255,0.15)", border: "1px solid rgba(45,122,255,0.25)" }}>
                  {p.owner.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate flex items-center gap-1">
                    {p.owner.name}
                    <span className="text-xs">{RANK_ICONS[p.owner.rank]}</span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{p.owner.direction}</div>
                </div>
                <div className="flex-shrink-0">
                  {getScoreBadge(p.innovScore)}
                </div>
              </div>

              {/* Title & excerpt */}
              <h3 className="font-bold text-base mb-2 line-clamp-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4 line-clamp-3 flex-1"
                style={{ color: "var(--text-secondary)" }}>
                {p.specific}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>👁 {p.viewCount}</span>
                  <span>💬 {p._count?.interactions ?? 0}</span>
                  <span>📅 {new Date(p.createdAt).toLocaleDateString("uz-UZ")}</span>
                </div>
                <button
                  onClick={() => setSelected(p)}
                  className="btn-primary text-xs py-2 px-4"
                  id={`suggest-btn-${p.id}`}
                >
                  Taklif berish →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestion Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10,22,40,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg anim-slide-up">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="badge badge-green mb-2 w-fit">💬 Taklif berish</div>
                <h3 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {selected.title}
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Muallif: {selected.owner.name}
                </p>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-white/40 hover:text-white transition-colors text-xl">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Taklif matni (kamida 50 belgi)
                </label>
                <textarea
                  id="suggestion-text"
                  className="input-glass min-h-[130px]"
                  placeholder="Bu loyihani qanday boyitish mumkin? Qanday texnologiya yoki metodika qo'shish kerak?..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                />
                <div className="text-xs mt-1 text-right" style={{ color: suggestion.length >= 50 ? "#00c896" : "var(--text-muted)" }}>
                  {suggestion.length}/50+
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Tavsiya etilgan texnologiya (ixtiyoriy)
                </label>
                <input
                  id="suggestion-tech"
                  className="input-glass"
                  placeholder="Masalan: Phet, Quizizz, VR, Kahoot, Google Forms..."
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelected(null)} className="btn-ghost flex-1">Bekor qilish</button>
              <button
                onClick={handleSuggest}
                className="btn-primary btn-green flex-1"
                disabled={submitting || suggestion.length < 50}
                id="submit-suggestion"
                style={{ opacity: suggestion.length >= 50 ? 1 : 0.5 }}
              >
                {submitting ? "Yuborilmoqda..." : "✅ Taklif yuborish (+10 XP)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
