"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function BoomerangIcon({ size = 64, id = "lb" }: { size?: number; id?: string }) {
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

const stats = [
  { icon: "🌱", label: "Explorer",   xp: "0–99 XP",    color: "#e6f8f3", dot: "#00b37e" },
  { icon: "⚡", label: "Specialist", xp: "100–299 XP", color: "#eff6ff", dot: "#0d6efd" },
  { icon: "🔮", label: "Master",     xp: "300–699 XP", color: "#f5f3ff", dot: "#7c3aed" },
  { icon: "👑", label: "Visionary",  xp: "700+ XP",    color: "#fffbeb", dot: "#d97706" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "#f8f8f8",
  border: "1.5px solid #e7e7e9",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#0d0d0d",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  transition: "border-color 0.2s",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Muvaffaqiyatli kirildi!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Xatolik yuz berdi");
      }
    } catch {
      toast.error("Server bilan ulanishda xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ══ LEFT — form panel ══ */}
      <section style={{
        flex: "0 0 480px",
        maxWidth: "480px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 56px",
        background: "#fff",
        overflowY: "auto",
        minHeight: "100vh",
      }}>

        {/* Logo */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: "10px",
          textDecoration: "none", marginBottom: "40px",
        }}>
          <BoomerangIcon size={36} id="logo-l" />
          <span style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 900,
            fontSize: "1.1rem", color: "#0d0d0d", letterSpacing: "-0.03em",
          }}>Smart-Boomerang</span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <BoomerangIcon size={56} id="head-l" />
          </div>
          <h1 style={{
            fontFamily: "Outfit, sans-serif", fontSize: "1.6rem",
            fontWeight: 800, color: "#0d0d0d", letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}>Xush kelibsiz!</h1>
          <p style={{ fontSize: "14px", color: "#6e6d7a" }}>
            Hisobingizga kiring
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              Email manzil
            </label>
            <input
              id="login-email" type="email"
              placeholder="sizning@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              Parol
            </label>
            <input
              id="login-password" type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            />
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 24px",
              background: loading ? "#9e9eb0" : "#1a1a2e",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.background = "#2d2d4a"; }}
            onMouseLeave={(e) => { if (!loading) (e.target as HTMLElement).style.background = "#1a1a2e"; }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                Kirilmoqda...
              </span>
            ) : "Kirish"}
          </button>

          <p style={{ fontSize: "12px", color: "#9e9eb0", textAlign: "center", lineHeight: 1.6 }}>
            Davom etib, siz{" "}
            <Link href="/terms" style={{ color: "#3d3d3d", textDecoration: "underline" }}>Shartlar</Link>
            {" "}va{" "}
            <Link href="/privacy" style={{ color: "#3d3d3d", textDecoration: "underline" }}>Maxfiylik Siyosati</Link>
            ga rozilik bildirasiz.
          </p>

          <p style={{ fontSize: "13px", textAlign: "center", color: "#6e6d7a" }}>
            Hisob yo'qmi?{" "}
            <Link href="/auth/register" style={{ color: "#ea4c89", fontWeight: 700, textDecoration: "none" }}>
              Ro'yxatdan o'tish
            </Link>
          </p>
        </form>
      </section>

      {/* ══ RIGHT — showcase sidebar ══ */}
      <aside style={{
        flex: 1,
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }}
        className="login-aside"
      >
        <style>{`.login-aside{display:flex}@media(max-width:768px){.login-aside{display:none!important}}@media(max-width:480px){section{max-width:100%!important}}`}</style>

        {/* Decorative glows */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,76,137,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(13,110,253,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Header */}
        <div style={{ marginBottom: "44px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#ea4c89", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
            🏆 Innovator Rank tizimi
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em",
            marginBottom: "16px",
          }}>
            Qaytib keling va<br />
            <span style={{ color: "#ea4c89" }}>yangi g'oyalar</span><br />
            kashf eting
          </h2>
          <p style={{ fontSize: "14px", color: "#9e9eb0", lineHeight: 1.7 }}>
            Platforma siz ketgan joydan davom etadi.
            XP ballaringiz va rankingiz saqlanib turibdi.
          </p>
        </div>

        {/* Rank cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "auto" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "18px",
              animation: `fadeUp 0.6s ease ${i * 0.09}s both`,
            }}>
              <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: s.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px", marginBottom: "10px",
              }}>{s.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                <span style={{ fontSize: "11px", color: "#9e9eb0" }}>{s.xp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat */}
        <div style={{
          marginTop: "28px",
          background: "rgba(234,76,137,0.08)",
          border: "1px solid rgba(234,76,137,0.2)",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            fontSize: "36px",
            lineHeight: 1,
            filter: "drop-shadow(0 4px 12px rgba(234,76,137,0.3))",
          }}>🚀</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
              Bugun platforma a'zosi bo'ling!
            </div>
            <div style={{ fontSize: "13px", color: "#9e9eb0" }}>
              Innovatsion g'oyangizni hoziroq baholating va XP yig'ing
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
