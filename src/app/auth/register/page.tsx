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

function BoomerangIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill="url(#bg3)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d7aff" />
          <stop offset="100%" stopColor="#00c896" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 anim-slide-up">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 anim-spin-slow"><BoomerangIcon /></div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: "Outfit, sans-serif" }}>
              Smart-Boomerang
            </span>
          </Link>
          <h1 className="heading-md mb-2">Platformaga qo'shiling!</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Innovatsion g'oyalaringizni tarqating
          </p>
        </div>

        <div className="glass rounded-3xl p-8 anim-slide-up" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                To'liq ism
              </label>
              <input id="reg-name" type="text" className="input-glass" placeholder="Ism Familiya"
                value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Email manzil
              </label>
              <input id="reg-email" type="email" className="input-glass" placeholder="sizning@email.com"
                value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Parol
              </label>
              <input id="reg-password" type="password" className="input-glass" placeholder="Kamida 6 belgi"
                value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Ta'lim yo'nalishi
              </label>
              <select id="reg-direction" className="input-glass"
                value={form.direction} onChange={(e) => set("direction", e.target.value)} required>
                <option value="" disabled>Yo'nalishni tanlang...</option>
                {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary w-full btn-green" disabled={loading} id="reg-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ro'yxatdan o'tilmoqda...
                </span>
              ) : "🚀 Ro'yxatdan o'tish"}
            </button>
          </form>
          <div className="divider" />
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Hisobingiz bormi?{" "}
            <Link href="/auth/login" className="font-medium" style={{ color: "#2d7aff" }}>Kirish</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
