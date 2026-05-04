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
  plugins: { legend: { labels: { color: "#6e6d7a", font: { family: "Inter", size: 12 } } } },
  scales: {
    x: { ticks: { color: "#9e9eb0" }, grid: { color: "rgba(0,0,0,0.04)" } },
    y: { ticks: { color: "#9e9eb0" }, grid: { color: "rgba(0,0,0,0.04)" } },
  },
};

const PIE_OPTS = {
  responsive: true,
  plugins: { legend: { position: "bottom" as const, labels: { color: "#6e6d7a", padding: 16, font: { family: "Inter", size: 12 } } } },
};

// Reusable card
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "#fff", border: "1px solid var(--border)", borderRadius: "16px",
    padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", ...style
  }}>
    {children}
  </div>
);

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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

  const demo = !stats;

  const kpis = [
    { label: "Jami foydalanuvchilar", value: stats?.totalUsers ?? 24,       icon: "👥", color: "#0d6efd", bg: "#e8f0fe" },
    { label: "Jami loyihalar",        value: stats?.totalProjects ?? 38,     icon: "💡", color: "#00b37e", bg: "#e6f8f3" },
    { label: "Jami takliflar",        value: stats?.totalInteractions ?? 142, icon: "💬", color: "#7c3aed", bg: "#ede9fe" },
    { label: "O'rtacha innov. bali",  value: `${stats?.avgInnovScore ?? 67}%`, icon: "⚡", color: "#ea4c89", bg: "#fce4ec" },
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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "40px" }}>
      
      {/* ══ HEADER ══ */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div style={{
            display: "inline-block", background: "var(--bg-dark)", color: "#fff",
            padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px"
          }}>
            📊 Admin Panel
          </div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 900, color: "var(--dark)", marginBottom: "8px", letterSpacing: "-0.03em" }}>
            Dissertatsiya Analitikasi
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
            Platforma statistikasi
            {demo && <span style={{ marginLeft: "12px", background: "#fef9ee", color: "#d97706", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>Demo ma'lumotlar</span>}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            background: "#fff", color: "var(--dark)", padding: "10px 20px",
            borderRadius: "8px", fontWeight: 600, border: "1.5px solid var(--border)",
            fontSize: "13px", cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.background = "var(--bg-soft)"}
          onMouseLeave={(e) => (e.target as HTMLElement).style.background = "#fff"}
        >
          📥 Hisobot yuklab olish
        </button>
      </div>

      {/* ══ KPI CARDS ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {kpis.map((k) => (
          <Card key={k.label} style={{ padding: "20px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: k.bg, color: k.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
              marginBottom: "16px"
            }}>
              {k.icon}
            </div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--dark)", marginBottom: "4px" }}>
              {k.value}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-light)", fontWeight: 500 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* ══ CHARTS ROW 1 ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        {/* Technologies Bar Chart */}
        <Card>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
            🔧 Eng ko'p taklif qilingan texnologiyalar
          </h2>
          <Bar
            data={{
              labels: techLabels,
              datasets: [{
                label: "Takliflar soni",
                data: techData,
                backgroundColor: [
                  "#ea4c89", "#0d6efd", "#00b37e", "#7c3aed", "#d97706", "#f43f5e", "#06b6d4"
                ],
                borderRadius: 4,
                borderSkipped: false,
              }],
            }}
            options={{ ...CHART_OPTS, indexAxis: "y" as const } as never}
          />
        </Card>

        {/* Weekly Activity Line Chart */}
        <Card>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
            📈 Haftalik faollik
          </h2>
          <Line
            data={{
              labels: weekLabels,
              datasets: [{
                label: "Yangi loyihalar",
                data: weekData,
                borderColor: "#ea4c89",
                backgroundColor: "rgba(234,76,137,0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#ea4c89",
                pointRadius: 4,
              }],
            }}
            options={CHART_OPTS as never}
          />
        </Card>
      </div>

      {/* ══ CHARTS ROW 2 ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        {/* Project Status Pie */}
        <Card>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
            💡 Loyihalar holati
          </h2>
          <div style={{ maxWidth: "260px", margin: "0 auto" }}>
            <Doughnut
              data={{
                labels: statusLabels,
                datasets: [{
                  data: statusData,
                  backgroundColor: ["#9e9eb0", "#0d6efd", "#d97706", "#00b37e"],
                  borderWidth: 0,
                }],
              }}
              options={PIE_OPTS as never}
            />
          </div>
        </Card>

        {/* Directions Pie */}
        <Card>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
            🎓 Yo'nalishlar bo'yicha talabalar
          </h2>
          <div style={{ maxWidth: "260px", margin: "0 auto" }}>
            <Doughnut
              data={{
                labels: dirLabels,
                datasets: [{
                  data: dirData,
                  backgroundColor: ["#ea4c89", "#0d6efd", "#00b37e", "#7c3aed", "#d97706"],
                  borderWidth: 0,
                }],
              }}
              options={PIE_OPTS as never}
            />
          </div>
        </Card>
      </div>

      {/* ══ LEADERBOARD ══ */}
      <Card>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: "20px" }}>
          🏆 Innovatorlar reytingi
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {topUsers.map((u, i) => (
            <div key={u.id} style={{
              display: "flex", alignItems: "center", gap: "16px", padding: "16px",
              background: "var(--bg-soft)", borderRadius: "12px", border: "1px solid var(--border)"
            }}>
              <div style={{
                width: "24px", textAlign: "center", fontSize: "14px", fontWeight: 800,
                color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "var(--text-muted)"
              }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", background: "#fef0f5", color: "var(--pink)",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px"
              }}>
                {u.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", marginBottom: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                  {u.name}
                  <span style={{ fontSize: "14px" }}>{RANK_ICONS[u.rank]}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-light)" }}>
                  {u.direction} · {u._count.projects} ta loyiha
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px", fontWeight: 800, color: "var(--pink)" }}>{u.xp} XP</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{u.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
