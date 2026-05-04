"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface Interaction {
  id: string; suggestionText: string; technology: string | null; status: string;
  createdAt: string; user: { name: string; rank: string };
}

interface Project {
  id: string; title: string;
  specific: string; measurable: string; achievable: string; relevant: string; timeBound: string;
  smartScore: number | null; aiFeedback: string | null; aiSuggestions: string | null; innovScore: number | null;
  status: string; viewCount: number;
  ownerId: string; owner: { id: string; name: string; direction: string; rank: string };
  interactions: Interaction[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    // Get current user ID from token/session
    fetch("/api/auth/me").then(r => r.json()).then(d => setCurrentUserId(d.id)).catch(() => {});

    fetch(`/api/projects/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => { setProject(d); setLoading(false); })
      .catch(() => { toast.error("Loyiha topilmadi"); router.push("/dashboard"); });
  }, [id, router]);

  const handleInteractionStatus = async (interactionId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/projects/${id}/interactions/${interactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Taklif ${status === "ACCEPTED" ? "qabul qilindi" : "rad etildi"}`);
        setProject((prev) => prev ? {
          ...prev,
          interactions: prev.interactions.map(i => i.id === interactionId ? { ...i, status } : i)
        } : null);
      }
    } catch { toast.error("Xatolik yuz berdi"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-[#2d7aff] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return null;

  const isOwner = project.ownerId === currentUserId;
  const isBoomeranged = project.status === "BOOMERANGED";
  const isInReview = project.status === "IN_REVIEW";
  const isCompleted = project.status === "COMPLETED";

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header & Score */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <Link href="/dashboard/projects" className="text-xs text-white/50 hover:text-white mb-3 inline-block">
            ← Loyihalarga qaytish
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className={`badge ${isBoomeranged ? "badge-blue" : isInReview ? "badge-gold" : "badge-green"}`}>
              {isBoomeranged ? "🚀 Tarmoqda aylanmoqda" : isInReview ? "🔍 Ko'rib chiqilmoqda" : "✅ Yakunlangan"}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              👁 {project.viewCount} marta ko'rilgan
            </span>
          </div>
          <h1 className="heading-lg mb-4">{project.title}</h1>

          <div className="flex items-center gap-4 text-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: "rgba(45,122,255,0.1)", border: "1px solid rgba(45,122,255,0.2)" }}>
              {project.owner.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-white/90">{project.owner.name}</div>
              <div style={{ color: "var(--text-muted)" }}>{project.owner.direction}</div>
            </div>
          </div>
        </div>

        {/* AI Score Badge */}
        <div className="glass rounded-2xl p-6 text-center min-w-[180px]">
          <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Innovatsionlik darajasi</div>
          <div className="text-5xl font-black mb-2" style={{ fontFamily: "Outfit, sans-serif", color: project.innovScore ? (project.innovScore >= 70 ? "#00c896" : "#f59e0b") : "#6b7280" }}>
            {project.innovScore ?? "--"}%
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>SMART Score: {project.smartScore ?? "--"}/100</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SMART Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
              <span>🎯</span> SMART Tahlil
            </h2>
            <div className="space-y-6">
              {[
                { label: "Specific", content: project.specific, color: "#3b82f6" },
                { label: "Measurable", content: project.measurable, color: "#22c55e" },
                { label: "Achievable", content: project.achievable, color: "#f59e0b" },
                { label: "Relevant", content: project.relevant, color: "#a855f7" },
                { label: "Time-bound", content: project.timeBound, color: "#f43f5e" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 pl-4" style={{ borderColor: s.color }}>
                  <h3 className="font-bold text-sm mb-1" style={{ color: s.color }}>{s.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Feedback */}
          {(project.aiFeedback || project.aiSuggestions) && (
            <div className="glass-green rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">🤖</div>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🤖</span> AI Ekspert Xulosasi
              </h2>
              {project.aiFeedback && (
                <div className="mb-4 text-sm leading-relaxed text-white/80 border-b pb-4" style={{ borderColor: "rgba(0,200,150,0.2)" }}>
                  {project.aiFeedback}
                </div>
              )}
              {project.aiSuggestions && (
                <div>
                  <h3 className="text-xs font-bold text-[#00c896] mb-2 uppercase tracking-wider">Tavsiya etilgan texnologiyalar:</h3>
                  <p className="text-sm leading-relaxed text-white/80">{project.aiSuggestions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Boomerang Trajectory & Interactions */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🌐</span> Bumerang Yo'nalishi
            </h2>
            <div className="space-y-4 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#2d7aff] flex items-center justify-center text-xs mt-1">1</div>
                <div>
                  <div className="font-medium text-sm">G'oya kiritildi</div>
                  <div className="text-xs text-white/50">AI birlamchi baholadi</div>
                </div>
              </div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1"
                  style={{ background: isBoomeranged || isInReview || isCompleted ? "#00c896" : "rgba(255,255,255,0.1)" }}>2</div>
                <div>
                  <div className="font-medium text-sm" style={{ opacity: isBoomeranged || isInReview || isCompleted ? 1 : 0.5 }}>Tarmoqqa uzatildi</div>
                  <div className="text-xs text-white/50">
                    {project.interactions.length}/3 taklif yig'ildi
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1"
                  style={{ background: isInReview || isCompleted ? "#f59e0b" : "rgba(255,255,255,0.1)" }}>3</div>
                <div>
                  <div className="font-medium text-sm" style={{ opacity: isInReview || isCompleted ? 1 : 0.5 }}>Ko'rib chiqilmoqda</div>
                  <div className="text-xs text-white/50">Takliflarni tasdiqlash</div>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1"
                  style={{ background: isCompleted ? "#00c896" : "rgba(255,255,255,0.1)" }}>4</div>
                <div>
                  <div className="font-medium text-sm" style={{ opacity: isCompleted ? 1 : 0.5 }}>G'oya mukammal</div>
                  <div className="text-xs text-white/50">Yakuniy AI tahlili</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">💬 Takliflar ({project.interactions.length})</h2>
            {project.interactions.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">Hali hech kim taklif bermadi</p>
            ) : (
              <div className="space-y-4">
                {project.interactions.map(int => (
                  <div key={int.id} className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "var(--glass-border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{int.user.name}</div>
                      {int.status === "PENDING" && isOwner ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleInteractionStatus(int.id, "ACCEPTED")} className="text-xs text-green-400 hover:underline">Qabul qilish</button>
                          <button onClick={() => handleInteractionStatus(int.id, "REJECTED")} className="text-xs text-rose-400 hover:underline">Rad etish</button>
                        </div>
                      ) : (
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${int.status === "ACCEPTED" ? "bg-green-500/20 text-green-400" : int.status === "REJECTED" ? "bg-rose-500/20 text-rose-400" : "bg-white/10 text-white/50"}`}>
                          {int.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-2">{int.suggestionText}</p>
                    {int.technology && (
                      <div className="text-xs font-medium" style={{ color: "#2d7aff" }}>🔧 {int.technology}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
