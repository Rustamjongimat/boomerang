"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  user: { name: string; xp: number; rank: string; direction: string };
  activeProjects: number;
  totalSuggestions: number;
  receivedSuggestions: number;
  recentProjects: Array<{
    id: string; title: string; status: string;
    innovScore: number | null; viewCount: number; _count: { interactions: number };
  }>;
  recentInteractions: Array<{
    id: string; suggestionText: string; createdAt: string;
    project: { title: string }; user: { name: string };
  }>;
}

const RANK_META: Record<string, { label: string; icon: string; color: string; next: number; current: number }> = {
  EXPLORER:   { label: "Explorer",   icon: "🌱", color: "#22c55e", current: 0,   next: 100 },
  SPECIALIST: { label: "Specialist", icon: "⚡", color: "#3b82f6", current: 100, next: 300 },
  MASTER:     { label: "Master",     icon: "🔮", color: "#a855f7", current: 300, next: 700 },
  VISIONARY:  { label: "Visionary",  icon: "👑", color: "#f59e0b", current: 700, next: 9999 },
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  DRAFT:        { label: "Qoralama",       color: "#6b7280" },
  BOOMERANGED:  { label: "Yuborilgan 🚀",  color: "#2d7aff" },
  IN_REVIEW:    { label: "Ko'rib chiqilmoqda", color: "#f59e0b" },
  COMPLETED:    { label: "Yakunlangan ✅", color: "#00c896" },
};

function BoomerangLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 anim-spin-slow">
        <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill="url(#bgl)"/>
        <defs>
          <linearGradient id="bgl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d7aff"/>
            <stop offset="100%" stopColor="#00c896"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <BoomerangLoader />;

  // Demo data if API not ready
  const user = data?.user ?? { name: "Talaba", xp: 45, rank: "EXPLORER", direction: "Pedagogika" };
  const rank = RANK_META[user.rank] ?? RANK_META.EXPLORER;
  const xpProgress = ((user.xp - rank.current) / (rank.next - rank.current)) * 100;
  const recentProjects = data?.recentProjects ?? [];
  const recentInteractions = data?.recentInteractions ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg mb-1">
            Salom, <span className="gradient-text">{user.name}</span> 👋
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {user.direction} yo'nalishi · Bugun ham innovatsion bo'ling!
          </p>
        </div>
        <Link href="/dashboard/smart" className="btn-primary w-fit" id="new-project-btn">
          ✍️ Yangi G'oya
        </Link>
      </div>

      {/* XP & RANK CARD */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40` }}
            >
              {rank.icon}
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>JORIY DARAJA</div>
              <div className="text-2xl font-bold" style={{ color: rank.color, fontFamily: "Outfit, sans-serif" }}>
                {rank.label}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: rank.color }}>
              {user.xp} XP
            </div>
            {user.rank !== "VISIONARY" && (
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Keyingi daraja uchun {rank.next - user.xp} XP kerak
              </div>
            )}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(xpProgress, 100)}%`, background: `linear-gradient(90deg, ${rank.color}, #00c896)` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{rank.label} ({rank.current} XP)</span>
          {user.rank !== "VISIONARY" && (
            <span>
              {Object.values(RANK_META).find((r, i) => Object.keys(RANK_META)[i] !== user.rank && r.current === rank.next)?.label}
              ({rank.next} XP)
            </span>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Faol loyihalar",      value: data?.activeProjects ?? 0,        icon: "💡", color: "#2d7aff" },
          { label: "Bergan takliflar",    value: data?.totalSuggestions ?? 0,      icon: "💬", color: "#00c896" },
          { label: "Qabul qilingan",      value: data?.receivedSuggestions ?? 0,   icon: "✅", color: "#a855f7" },
          { label: "XP ballari",          value: user.xp,                           icon: "⚡", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 glass-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <div className="w-2 h-2 rounded-full anim-pulse-blue" style={{ background: stat.color }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color, fontFamily: "Outfit, sans-serif" }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* PROJECTS + INTERACTIONS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
              💡 Mening Loyihalarim
            </h2>
            <Link href="/dashboard/projects" className="text-xs badge badge-blue">Hammasi →</Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🚀</div>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Hali loyiha yo'q. Birinchi g'oyangizni yuboring!
              </p>
              <Link href="/dashboard/smart" className="btn-primary text-sm py-2 px-5">
                G'oya kiritish
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => {
                const sm = STATUS_META[p.status] ?? STATUS_META.DRAFT;
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate mb-1">{p.title}</div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span>👁 {p.viewCount}</span>
                        <span>💬 {p._count?.interactions ?? 0}</span>
                      </div>
                    </div>
                    <div>
                      <span className="badge text-xs" style={{ color: sm.color, background: `${sm.color}18`, border: `1px solid ${sm.color}30` }}>
                        {sm.label}
                      </span>
                      {p.innovScore !== null && (
                        <div className="text-xs text-right mt-1" style={{ color: "#00c896" }}>
                          {p.innovScore}% innov
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Interactions */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
              🔔 So'nggi Takliflar
            </h2>
            <Link href="/dashboard/feed" className="text-xs badge badge-green">Lenta →</Link>
          </div>

          {recentInteractions.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🌐</div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Hali taklif yo'q. Boshqalarning loyihalarini boyiting!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInteractions.map((i) => (
                <div key={i.id} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.25)" }}>
                      {i.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                        <span className="text-white/70 font-medium">{i.user.name}</span>
                        {" "}· {i.project.title}
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {i.suggestionText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOOMERANG TRAJECTORY HINT */}
      <div className="glass rounded-2xl p-6 glass-blue">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 flex-shrink-0 anim-float">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M20 80 Q50 20 80 20 Q65 50 35 65 Q20 70 20 80Z" fill="url(#bgh)"/>
              <defs>
                <linearGradient id="bgh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d7aff"/><stop offset="100%" stopColor="#00c896"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              🚀 Bumerang Algoritmi qanday ishlaydi?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              G'oyangiz yuborilganda, tizim avtomatik ravishda tarmoqdagi eng kam faol talabalarga yo'naltiradi.
              Kamida <strong style={{ color: "#2d7aff" }}>3 ta taklif</strong> kelgandan so'ng,
              AI ularni jamlab, sizga boyitilgan g'oyani qaytaradi.
            </p>
          </div>
          <Link href="/dashboard/smart" className="btn-primary flex-shrink-0" id="start-boomerang-btn">
            Boshlash →
          </Link>
        </div>
      </div>
    </div>
  );
}
