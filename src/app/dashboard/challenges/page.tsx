"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: { name: string; rank: string };
  _count: { projects: number };
}

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/challenges?t=" + Date.now())
      .then((r) => r.json())
      .then((d) => { setChallenges(d.challenges || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        toast.success("✅ Topshiriq yaratildi!");
        setShowModal(false);
        setTitle("");
        setDescription("");
        const data = await res.json();
        setChallenges((prev) => [{ ...data, author: { name: "Siz", rank: "EXPLORER" }, _count: { projects: 0 } }, ...prev]);
      } else {
        const err = await res.json();
        toast.error(err.error || "Xato");
      }
    } catch { toast.error("Server xatosi"); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <div style={{
            display: "inline-block", background: "var(--bg-dark)", color: "#fff",
            padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
          }}>
            🎯 Topshiriqlar
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
            Jamoaviy <span style={{ color: "var(--pink)" }}>Topshiriqlar</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
            Boshqalarga vazifa bering yoki mavjud topshiriqlarga g'oya kiritib hissa qo'shing.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: "var(--dark)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          + Yangi Topshiriq
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {[1,2,3].map(i => <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", height: "180px", animation: "pulse 2s infinite" }} />)}
        </div>
      ) : challenges.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "24px", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📝</div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--dark)" }}>Hozircha topshiriqlar yo'q</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {challenges.map(c => (
            <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e8f0fe", color: "#0d6efd", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                  {c.author.name.charAt(0)}
                </span>
                {c.author.name}
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "8px" }}>
                {c.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-light)", lineHeight: 1.6, flex: 1, marginBottom: "20px" }}>
                {c.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--pink)" }}>
                  💡 {c._count?.projects || 0} ta g'oya
                </div>
                <button
                  onClick={() => router.push(`/dashboard/smart?challengeId=${c.id}`)}
                  style={{ background: "#e8f0fe", color: "#0d6efd", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  G'oya yozish →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(13,13,13,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: "0 24px 48px rgba(0,0,0,0.1)", animation: "slideUp 0.3s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--dark)" }}>Yangi Topshiriq Yaratish</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Mavzu / Savol</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Raqamli ta'limda gamification" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid var(--border)", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>Batafsil tushuntirish</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Qanday g'oyalar kutilyapti?..." rows={4} style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid var(--border)", fontSize: "14px", resize: "none" }} />
              </div>
            </div>
            <button disabled={submitting} onClick={handleCreate} style={{ width: "100%", background: "var(--pink)", color: "#fff", border: "none", borderRadius: "8px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              {submitting ? "Yaratilmoqda..." : "E'lon qilish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
