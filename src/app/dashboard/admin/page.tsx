"use client";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
);

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalInteractions: number;
  avgInnovScore: number;
  topTechnologies: Array<{ technology: string; _count: { technology: number } }>;
  usersByDirection: Array<{ direction: string; _count: { direction: number } }>;
  projectsByStatus: Array<{ status: string; _count: { status: number } }>;
  weeklyActivity: Array<{ date: string; count: number }>;
  topUsers: Array<{ id: string; name: string; xp: number; rank: string; direction: string; _count: { projects: number } }>;
}

const RANK_ICONS: Record<string, string> = {
  EXPLORER: "🌱", SPECIALIST: "⚡", MASTER: "🔮", VISIONARY: "👑",
};

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: "rgba(240,244,255,0.7)", font: { family: "Inter" } } } },
  scales: {
    x: { ticks: { color: "rgba(240,244,255,0.5)" }, grid: { color: "rgba(255,255,255,0.05)" } },
    y: { ticks: { color: "rgba(240,244,255,0.5)" }, grid: { color: "rgba(255,255,255,0.05)" } },
  },
};

const PIE_OPTS = {
  responsive: true,
  plugins: { legend: { position: "bottom" as const, labels: { color: "rgba(240,244,255,0.7)", padding: 16 } } },
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const demo = !stats;

  const kpis = [
    { label: "Jami foydalanuvchilar", value: stats?.totalUsers ?? 24,       icon: "👥", color: "#2d7aff" },
    { label: "Jami loyihalar",        value: stats?.totalProjects ?? 38,     icon: "💡", color: "#00c896" },
    { label: "Jami takliflar",        value: stats?.totalInteractions ?? 142, icon: "💬", color: "#a855f7" },
    { label: "O'rtacha innov. bali",  value: `${stats?.avgInnovScore ?? 67}%`, icon: "⚡", color: "#f59e0b" },
  ];

  const techLabels = demo
    ? ["Phet", "Quizizz", "VR", "Kahoot", "Google Forms", "Scratch", "Canva"]
    : (stats?.topTechnologies ?? []).map((t) => t.technology || "Boshqa");

  const techData = demo
    ? [18, 15, 12, 11, 9, 7, 5]
    : (stats?.topTechnologies ?? []).map((t) => t._count.technology);

  const statusLabels = ["Qoralama", "Yuborilgan", "Ko'rib chiqilmoqda", "Yakunlangan"];
  const statusData = demo ? [5, 14, 10, 9] : [0, 0, 0, 0];

  const weekLabels = demo
    ? ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
    : (stats?.weeklyActivity ?? []).map((w) => w.date);

  const weekData = demo
    ? [4, 7, 3, 9, 6, 11, 8]
    : (stats?.weeklyActivity ?? []).map((w) => w.count);

  const dirLabels = demo
    ? ["Pedagogika", "Matematika", "Fizika", "Biologiya", "Informatika"]
    : (stats?.usersByDirection ?? []).map((u) => u.direction);

  const dirData = demo
    ? [8, 5, 4, 4, 3]
    : (stats?.usersByDirection ?? []).map((u) => u._count.direction);

  const topUsers = stats?.topUsers ?? [
    { id: "1", name: "Aziz Karimov",     xp: 850, rank: "VISIONARY",   direction: "Pedagogika",  _count: { projects: 7 } },
    { id: "2", name: "Nilufar Rashidova",xp: 620, rank: "MASTER",      direction: "Matematika",  _count: { projects: 5 } },
    { id: "3", name: "Jasur Mirzayev",   xp: 340, rank: "MASTER",      direction: "Informatika", _count: { projects: 4 } },
    { id: "4", name: "Muazzam Tosheva",  xp: 180, rank: "SPECIALIST",  direction: "Biologiya",   _count: { projects: 3 } },
    { id: "5", name: "Sherzod Umarov",   xp: 95,  rank: "EXPLORER",    direction: "Fizika",      _count: { projects: 2 } },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="badge badge-violet mb-3 w-fit">📊 Admin Panel</div>
          <h1 className="heading-lg">Dissertatsiya <span className="gradient-text">Analitikasi</span></h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            III bob uchun platforma statistikasi
            {demo && <span className="badge badge-gold text-xs ml-3">Demo ma'lumotlar</span>}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-ghost text-sm w-fit"
          id="export-btn"
        >
          📥 Hisobot yuklab olish
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass rounded-2xl p-5">
            <div className="text-2xl mb-3">{k.icon}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: k.color, fontFamily: "Outfit, sans-serif" }}>
              {k.value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Technologies */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
            🔧 Eng ko'p taklif qilingan texnologiyalar
          </h2>
          <Bar
            data={{
              labels: techLabels,
              datasets: [{
                label: "Takliflar soni",
                data: techData,
                backgroundColor: [
                  "rgba(45,122,255,0.7)", "rgba(0,200,150,0.7)", "rgba(168,85,247,0.7)",
                  "rgba(245,158,11,0.7)", "rgba(244,63,94,0.7)", "rgba(34,197,94,0.7)", "rgba(59,130,246,0.7)",
                ],
                borderRadius: 8,
                borderSkipped: false,
              }],
            }}
            options={{ ...CHART_OPTS, indexAxis: "y" as const } as never}
          />
        </div>

        {/* Weekly activity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
            📈 Haftalik faollik
          </h2>
          <Line
            data={{
              labels: weekLabels,
              datasets: [{
                label: "Yangi loyihalar",
                data: weekData,
                borderColor: "#2d7aff",
                backgroundColor: "rgba(45,122,255,0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#2d7aff",
                pointRadius: 5,
              }],
            }}
            options={CHART_OPTS as never}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project status */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
            💡 Loyihalar holati
          </h2>
          <div className="max-w-xs mx-auto">
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusData,
                  backgroundColor: ["rgba(107,114,128,0.7)", "rgba(45,122,255,0.7)", "rgba(245,158,11,0.7)", "rgba(0,200,150,0.7)"],
                  borderWidth: 0,
                }],
              }}
              options={PIE_OPTS as never}
            />
          </div>
        </div>

        {/* Users by direction */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
            🎓 Yo'nalishlar bo'yicha talabalar
          </h2>
          <div className="max-w-xs mx-auto">
            <Doughnut
              data={{
                labels: dirLabels,
                datasets: [{
                  data: dirData,
                  backgroundColor: [
                    "rgba(45,122,255,0.7)", "rgba(0,200,150,0.7)", "rgba(168,85,247,0.7)",
                    "rgba(245,158,11,0.7)", "rgba(244,63,94,0.7)",
                  ],
                  borderWidth: 0,
                }],
              }}
              options={PIE_OPTS as never}
            />
          </div>
        </div>
      </div>

      {/* Top Users leaderboard */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-bold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>
          🏆 Innovatorlar reytingi
        </h2>
        <div className="space-y-3">
          {topUsers.map((u, i) => (
            <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5">
              <div className="w-8 text-center font-bold text-sm"
                style={{ color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "rgba(255,255,255,0.3)" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                style={{ background: "rgba(45,122,255,0.15)", border: "1px solid rgba(45,122,255,0.25)" }}>
                {u.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-2">
                  {u.name}
                  <span className="text-base">{RANK_ICONS[u.rank]}</span>
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{u.direction} · {u._count.projects} ta loyiha</div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ color: "#f59e0b", fontFamily: "Outfit, sans-serif" }}>{u.xp} XP</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{u.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
