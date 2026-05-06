import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [activeProjects, totalSuggestions, receivedSuggestions, recentProjects, recentInteractions] =
      await Promise.all([
        prisma.project.count({ where: { ownerId: user.id, status: { not: "COMPLETED" } } }),
        prisma.interaction.count({ where: { userId: user.id, status: "ACCEPTED" } }),
        prisma.interaction.count({ where: { project: { ownerId: user.id }, status: "ACCEPTED" } }),
        prisma.project.findMany({
          where: { ownerId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { _count: { select: { interactions: true } } },
        }),
        prisma.interaction.findMany({
          where: { project: { ownerId: user.id } },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { project: { select: { title: true } }, user: { select: { name: true } } },
        }),
      ]);

    return NextResponse.json({
      user,
      activeProjects,
      totalSuggestions,
      receivedSuggestions,
      recentProjects,
      recentInteractions,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
