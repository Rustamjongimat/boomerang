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

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", ...style
  }}>
    {children}
  </div>
);

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
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

  if (!project) return null;

  const isOwner = project.ownerId === currentUserId;
  const isBoomeranged = project.status === "BOOMERANGED";
  const isInReview = project.status === "IN_REVIEW";
  const isCompleted = project.status === "COMPLETED";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      {/* ══ HEADER ══ */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard/projects" style={{
          fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px",
          transition: "color 0.2s"
        }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--dark)"}
           onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-muted)"}>
          ← Loyihalarga qaytish
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{
                background: isBoomeranged ? "#e8f0fe" : isInReview ? "#fef9ee" : isCompleted ? "#e6f8f3" : "#f3f3f4",
                color: isBoomeranged ? "#0d6efd" : isInReview ? "#d97706" : isCompleted ? "#00b37e" : "#6e6d7a",
                padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px"
              }}>
                {isBoomeranged ? "🚀 Jilolanmoqda" : isInReview ? "🔍 Ko'rib chiqilmoqda" : isCompleted ? "✅ Yakunlangan" : "📝 Qoralama"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                👁 {project.viewCount} marta ko'rilgan
              </span>
            </div>
            
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "16px", lineHeight: 1.2 }}>
              {project.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", background: "#fef0f5", color: "var(--pink)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800
              }}>
                {project.owner.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)" }}>{project.owner.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-light)" }}>{project.owner.direction}</div>
              </div>
            </div>
          </div>

          {/* AI Score Badge */}
          <Card style={{ textAlign: "center", minWidth: "180px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              Innovatsionlik
            </div>
            <div style={{
              fontFamily: "Outfit, sans-serif", fontSize: "3rem", fontWeight: 900,
              color: project.innovScore ? (project.innovScore >= 70 ? "#00b37e" : "#f59e0b") : "var(--text-muted)",
              marginBottom: "4px", lineHeight: 1
            }}>
              {project.innovScore ?? "--"}%
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-light)", fontWeight: 500 }}>
              SMART Score: {project.smartScore ?? "--"}/100
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="lg:grid-cols-3">
        {/* ══ SMART CONTENT ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="lg:col-span-2">
          
          <Card>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎯</span> SMART Tahlil
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {[
                { label: "Aniq (Specific)", content: project.specific, color: "#0d6efd", bg: "#e8f0fe" },
                { label: "O'lchanadigan (Measurable)", content: project.measurable, color: "#00b37e", bg: "#e6f8f3" },
                { label: "Erishib bo'ladigan (Achievable)", content: project.achievable, color: "#d97706", bg: "#fef9ee" },
                { label: "Dolzarb (Relevant)", content: project.relevant, color: "#7c3aed", bg: "#ede9fe" },
                { label: "Muddatli (Time-bound)", content: project.timeBound, color: "#ea4c89", bg: "#fce4ec" },
              ].map((s) => (
                <div key={s.label} style={{
                  paddingLeft: "16px", borderLeft: `3px solid ${s.color}`, position: "relative"
                }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 800, color: s.color, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    {s.label}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.6 }}>
                    {s.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Feedback */}
          {(project.aiFeedback || project.aiSuggestions) && (
            <div style={{
              background: "#e8f0fe", border: "1px solid #d1e3fd", borderRadius: "16px",
              padding: "24px", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "80px", opacity: 0.05, pointerEvents: "none" }}>🤖</div>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d6efd", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🤖</span> AI Ekspert Xulosasi
              </h2>
              
              {project.aiFeedback && (
                <div style={{ fontSize: "14px", color: "var(--dark)", lineHeight: 1.6, marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #d1e3fd" }}>
                  {project.aiFeedback}
                </div>
              )}
              
              {project.aiSuggestions && (
                <div>
                  <h3 style={{ fontSize: "11px", fontWeight: 800, color: "#0d6efd", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tavsiya etilgan texnologiyalar
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--dark)", lineHeight: 1.6, background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid #d1e3fd" }}>
                    {project.aiSuggestions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══ SIDEBAR ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <Card>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌐</span> Jilola Yo'nalishi
            </h2>
            <div style={{ position: "relative", paddingLeft: "12px" }}>
              <div style={{ position: "absolute", left: "23px", top: "12px", bottom: "12px", width: "2px", background: "var(--border)" }} />
              
              {[
                { label: "G'oya kiritildi", sub: "AI birlamchi baholadi", active: true, color: "#0d6efd" },
                { label: "Jilolash tarmog'iga uzatildi", sub: `${project.interactions.length}/3 taklif yig'ildi`, active: isBoomeranged || isInReview || isCompleted, color: "#00b37e" },
                { label: "Ko'rib chiqilmoqda", sub: "Takliflarni tasdiqlash", active: isInReview || isCompleted, color: "#d97706" },
                { label: "G'oya mukammal", sub: "Yakuniy AI tahlili", active: isCompleted, color: "#ea4c89" },
              ].map((step, idx) => (
                <div key={idx} style={{ display: "flex", gap: "16px", marginBottom: idx === 3 ? 0 : "24px", position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: step.active ? step.color : "#fff",
                    border: step.active ? "none" : "2px solid var(--border)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 800, flexShrink: 0, marginTop: "2px",
                    transition: "all 0.3s"
                  }}>
                    {step.active ? idx + 1 : ""}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: step.active ? "var(--dark)" : "var(--text-muted)", marginBottom: "2px" }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                      {step.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
              💬 Takliflar ({project.interactions.length})
            </h2>
            {project.interactions.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
                Hali hech kim taklif bermadi
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {project.interactions.map(int => (
                  <div key={int.id} style={{
                    padding: "16px", background: "var(--bg-soft)", borderRadius: "12px", border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--dark)" }}>{int.user.name}</div>
                      
                      {int.status === "PENDING" && isOwner ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleInteractionStatus(int.id, "ACCEPTED")} style={{
                            background: "#00b37e", color: "#fff", border: "none", padding: "4px 8px",
                            borderRadius: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer"
                          }}>Qabul</button>
                          <button onClick={() => handleInteractionStatus(int.id, "REJECTED")} style={{
                            background: "#f43f5e", color: "#fff", border: "none", padding: "4px 8px",
                            borderRadius: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer"
                          }}>Rad</button>
                        </div>
                      ) : (
                        <span style={{
                          background: int.status === "ACCEPTED" ? "#e6f8f3" : int.status === "REJECTED" ? "#fce4ec" : "var(--border)",
                          color: int.status === "ACCEPTED" ? "#00b37e" : int.status === "REJECTED" ? "#f43f5e" : "var(--text-muted)",
                          padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase"
                        }}>
                          {int.status}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5, marginBottom: "8px" }}>
                      {int.suggestionText}
                    </p>
                    {int.technology && (
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#0d6efd" }}>
                        🔧 {int.technology}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
