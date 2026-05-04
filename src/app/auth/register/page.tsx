"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DIRECTIONS = [
  "Pedagogika", "Matematika", "Fizika", "Kimyo", "Biologiya",
  "Tarix", "Adabiyot", "Ingliz tili", "Rus tili", "Informatika",
  "Geografiya", "Huquq", "Iqtisodiyot", "Psixologiya", "Boshqa",
];

function BoomerangIcon({ size = 64, id = "rb" }: { size?: number; id?: string }) {
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

/* ── Showcase cards (right panel) ── */
const showcase = [
  { icon: "🎯", label: "SMART-Wizard", score: "5 mezon", color: "#fce4ec" },
  { icon: "🤖", label: "AI Tahlil", score: "94%", color: "#e8f0fe" },
  { icon: "🌐", label: "P2P Tarmoq", score: "3+ foyda", color: "#e6f8f3" },
  { icon: "🏆", label: "Rank tizimi", score: "700 XP", color: "#ede9fe" },
  { icon: "💎", label: "G'oya Boyitish", score: "AI + Peer", color: "#fef9ee" },
  { icon: "📊", label: "Analitika", score: "Real-time", color: "#fce4ec" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", direction: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.direction) { toast.error("Yo'nalishingizni tanlang"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Ro'yxatdan o'tish muvaffaqiyatli!");
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

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ══ LEFT — form panel (Dribbble auth-layout__content) ══ */}
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
          <BoomerangIcon size={36} id="logo-r" />
          <span style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 900,
            fontSize: "1.1rem", color: "#0d0d0d", letterSpacing: "-0.03em",
          }}>Smart-Boomerang</span>
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <BoomerangIcon size={56} id="head-r" />
          </div>
          <h1 style={{
            fontFamily: "Outfit, sans-serif", fontSize: "1.6rem",
            fontWeight: 800, color: "#0d0d0d", letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}>Platforma a'zosi bo'ling</h1>
          <p style={{ fontSize: "14px", color: "#6e6d7a", lineHeight: 1.5 }}>
            Innovatsion g'oyalaringizni Smart-Boomerang orqali ulashing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              To'liq ism
            </label>
            <input
              id="reg-name" type="text"
              placeholder="Ism Familiya"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              Email manzil
            </label>
            <input
              id="reg-email" type="email"
              placeholder="sizning@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              Parol
            </label>
            <input
              id="reg-password" type="password"
              placeholder="Kamida 6 ta belgi"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required minLength={6}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            />
          </div>

          {/* Direction */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d3d3d", marginBottom: "6px" }}>
              Ta'lim yo'nalishi
            </label>
            <select
              id="reg-direction"
              value={form.direction}
              onChange={(e) => set("direction", e.target.value)}
              required
              style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236e6d7a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              onFocus={(e) => e.target.style.borderColor = "#ea4c89"}
              onBlur={(e) => e.target.style.borderColor = "#e7e7e9"}
            >
              <option value="" disabled>Yo'nalishni tanlang...</option>
              {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Server message placeholder */}
          <div id="reg-server-msg" />

          {/* Submit */}
          <button
            type="submit"
            id="reg-submit"
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
              transition: "background 0.2s, transform 0.15s",
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
                Ro'yxatdan o'tilmoqda...
              </span>
            ) : "Ro'yxatdan o'tish"}
          </button>

          {/* Disclaimer */}
          <p style={{ fontSize: "12px", color: "#9e9eb0", textAlign: "center", lineHeight: 1.6 }}>
            Davom etib, siz{" "}
            <Link href="/terms" style={{ color: "#3d3d3d", textDecoration: "underline" }}>Shartlar</Link>
            {" "}va{" "}
            <Link href="/privacy" style={{ color: "#3d3d3d", textDecoration: "underline" }}>Maxfiylik Siyosati</Link>
            ga rozilik bildirasiz.
          </p>

          {/* Switch to login */}
          <p style={{ fontSize: "13px", textAlign: "center", color: "#6e6d7a" }}>
            Hisobingiz bormi?{" "}
            <Link href="/auth/login" style={{ color: "#ea4c89", fontWeight: 700, textDecoration: "none" }}>
              Kirish
            </Link>
          </p>
        </form>
      </section>

      {/* ══ RIGHT — showcase sidebar (Dribbble auth-sidebar) ══ */}
      <aside style={{
        flex: 1,
        background: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }}
        className="auth-aside"
      >
        <style>{`
          .auth-aside { display: flex; }
          @media(max-width: 768px) { .auth-aside { display: none !important; } }
          @media(max-width: 480px) { section { max-width: 100% !important; } }
        `}</style>

        {/* Decorative glows */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,76,137,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#ea4c89", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
            🚀 Smart-Boomerang Platforma
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em",
            marginBottom: "16px",
          }}>
            Innovatsion g'oyangizni<br />
            <span style={{ color: "#ea4c89" }}>bumerang</span> kabi<br />
            qaytarib oling
          </h2>
          <p style={{ fontSize: "14px", color: "#9e9eb0", lineHeight: 1.7, maxWidth: "380px" }}>
            G'oyangizni kiriting — AI tekshirsin, hamkasblar boyitsin,
            va u sizga mukammal holatda qaytib kelsin.
          </p>
        </div>

        {/* Shot-style feature cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px", marginBottom: "auto",
        }}>
          {showcase.map((item, i) => (
            <div key={item.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "18px",
              transition: "background 0.2s",
              animation: `fadeUp 0.6s ease ${i * 0.08}s both`,
            }}>
              <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: item.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "20px", marginBottom: "10px",
              }}>
                {item.icon}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "11px", color: "#ea4c89", fontWeight: 600 }}>{item.score}</div>
            </div>
          ))}
        </div>

        {/* Bottom testimonial */}
        <div style={{
          marginTop: "32px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "20px",
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ea4c89, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "14px", flexShrink: 0,
            }}>A</div>
            <div>
              <p style={{ fontSize: "13px", color: "#d4d4e8", lineHeight: 1.6, marginBottom: "8px" }}>
                "Smart-Boomerang orqali dissertatsiyam uchun ajoyib innovatsion g'oya topdim. AI tahlili juda aniq!"
              </p>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#ea4c89" }}>Aziz Karimov</div>
              <div style={{ fontSize: "11px", color: "#6e6d7a" }}>Master's innovator · Visionary rank</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

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
