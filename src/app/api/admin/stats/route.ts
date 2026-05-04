import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Hamma ma'lumotlarni parallel yig'amiz
    const [
      totalUsers,
      totalProjects,
      totalInteractions,
      projectsWithScore,
      topTechs,
      usersByDirection,
      projectsByStatus,
      topUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.interaction.count(),
      prisma.project.findMany({ where: { innovScore: { not: null } }, select: { innovScore: true } }),
      prisma.interaction.groupBy({
        by: ["technology"],
        _count: { technology: true },
        orderBy: { _count: { technology: "desc" } },
        take: 7,
        where: { technology: { not: null } },
      }),
      prisma.user.groupBy({
        by: ["direction"],
        _count: { direction: true },
        orderBy: { _count: { direction: "desc" } },
      }),
      prisma.project.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.user.findMany({
        orderBy: { xp: "desc" },
        take: 5,
        include: { _count: { select: { projects: true } } },
      }),
    ]);

    // O'rtacha innovatsiya skorini hisoblash
    const sumScores = projectsWithScore.reduce((acc, p) => acc + (p.innovScore || 0), 0);
    const avgInnovScore = projectsWithScore.length ? Math.round(sumScores / projectsWithScore.length) : 0;

    // Haftalik faollik (mocked for demo if no dates, but let's query actual interactions by date if possible)
    // Prisma SQLite/PostgreSQL da date bo'yicha guruhlash murakkab, shuning uchun oxirgi 7 kunni manual yig'amiz.
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const recentProjects = await prisma.project.findMany({
      where: {
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
      },
      select: { createdAt: true }
    });

    const weeklyActivity = last7Days.map(dateStr => {
      const count = recentProjects.filter(p => p.createdAt.toISOString().startsWith(dateStr)).length;
      return {
        date: new Date(dateStr).toLocaleDateString("uz-UZ", { weekday: "short" }),
        count
      };
    });

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalInteractions,
      avgInnovScore,
      topTechnologies: topTechs,
      usersByDirection,
      projectsByStatus,
      weeklyActivity,
      topUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
