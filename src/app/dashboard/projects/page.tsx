"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string; title: string; specific: string; status: string;
  innovScore: number | null; viewCount: number; createdAt: string;
  _count: { interactions: number };
}

const STATUS_META: Record<string, { label: string; color: string; icon: string }> = {
  DRAFT:        { label: "Qoralama",       color: "#6b7280", icon: "📝" },
  BOOMERANGED:  { label: "Yuborilgan",     color: "#2d7aff", icon: "🚀" },
  IN_REVIEW:    { label: "Ko'rib chiqilmoqda", color: "#f59e0b", icon: "🔍" },
  COMPLETED:    { label: "Yakunlangan",    color: "#00c896", icon: "✅" },
};

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { setProjects(d.projects ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="badge badge-blue mb-3 w-fit">💡 Mening Loyihalarim</div>
          <h1 className="heading-lg">
            Innovatsion <span className="gradient-text">G'oyalaringiz</span>
          </h1>
        </div>
        <Link href="/dashboard/smart" className="btn-primary w-fit">
          ✍️ Yangi loyiha kiritish
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <div key={i} className="glass rounded-2xl p-6 h-48 skeleton" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center mt-10">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="heading-md mb-2">Hali loyihalar yo'q</h2>
          <p className="text-sm text-white/50 mb-6">Birinchi innovatsion g'oyangizni SMART mezonlari asosida kiriting.</p>
          <Link href="/dashboard/smart" className="btn-primary">G'oya kiritish →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => {
            const sm = STATUS_META[p.status] ?? STATUS_META.DRAFT;
            return (
              <Link href={`/dashboard/projects/${p.id}`} key={p.id} className="glass rounded-2xl p-6 glass-hover flex flex-col group relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-6xl opacity-5 transition-transform group-hover:scale-110">
                  {sm.icon}
                </div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="badge text-xs" style={{ color: sm.color, background: `${sm.color}18`, border: `1px solid ${sm.color}30` }}>
                    {sm.icon} {sm.label}
                  </span>
                  {p.innovScore && (
                    <span className="font-bold font-outfit" style={{ color: p.innovScore >= 70 ? "#00c896" : "#f59e0b" }}>
                      {p.innovScore}%
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {p.title}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-6 flex-1">
                  {p.specific}
                </p>

                <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <span>👁 {p.viewCount}</span>
                    <span className={p._count.interactions > 0 ? "text-green-400 font-medium" : ""}>
                      💬 {p._count.interactions}
                    </span>
                  </div>
                  <span>{new Date(p.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
