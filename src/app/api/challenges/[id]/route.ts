import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, rank: true } },
        projects: {
          orderBy: { createdAt: "desc" },
          include: {
            owner: { select: { name: true, direction: true, rank: true } },
            _count: { select: { interactions: true } },
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Topshiriq topilmadi" }, { status: 404 });
    }

    return NextResponse.json(challenge, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Get challenge error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
