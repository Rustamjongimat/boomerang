import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Tarmoq algoritmi: O'zining loyihalari emas va boshqalarning DRAFT va COMPLETED bo'lmagan loyihalari.
    // Kam taklif olgan loyihalar birinchi chiqishi uchun tartiblash mumkin.
    const projects = await prisma.project.findMany({
      where: {
        ownerId: { not: user.id },
        status: { in: ["BOOMERANGED", "IN_REVIEW"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { name: true, direction: true, rank: true } },
        _count: { select: { interactions: true } },
      },
      take: 20, // Hozircha 20 ta
    });

    // Eng kam taklif berganlarga (yoki eng kam taklif olgan loyihalarga) ustuvorlik berish algoritmi shu yerda qo'llanilishi mumkin.
    // Hozircha oddiy sort: takliflar soni bo'yicha o'sish tartibida (kam taklifli oldin chiqadi)
    projects.sort((a, b) => (a._count.interactions || 0) - (b._count.interactions || 0));

    return NextResponse.json({ projects }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
