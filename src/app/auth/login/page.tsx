"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function BoomerangIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z"
        fill="url(#bg2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d7aff" />
          <stop offset="100%" stopColor="#00c896" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
    <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 anim-slide-up">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 anim-spin-slow"><BoomerangIcon /></div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: "Outfit, sans-serif" }}>
              Smart-Boomerang
            </span>
          </Link>
          <h1 className="heading-md mb-2">Xush kelibsiz!</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Hisobingizga kiring
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 anim-slide-up" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Email manzil
              </label>
              <input
                type="email"
                className="input-glass"
                placeholder="sizning@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Parol
              </label>
              <input
                type="password"
                className="input-glass"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Kirish...
                </span>
              ) : (
                "Kirish →"
              )}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Hisob yo'qmi?{" "}
            <Link href="/auth/register" className="font-medium" style={{ color: "#2d7aff" }}>
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
