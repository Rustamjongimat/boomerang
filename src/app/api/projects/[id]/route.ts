import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Awaitable params for Next.js 15
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Await params here

    // Loyihani o'qilganda viewCount ni oshirish
    const project = await prisma.project.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        owner: { select: { id: true, name: true, direction: true, rank: true } },
        interactions: {
          include: { user: { select: { name: true, rank: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Get project detail error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
