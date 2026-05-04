import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRank } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Awaitable params for Next.js 15
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Await params here
    const { suggestionText, technology } = await req.json();

    if (!suggestionText) {
      return NextResponse.json({ error: "Taklif matni majburiy" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { interactions: true },
    });

    if (!project) return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    if (project.ownerId === user.id) {
      return NextResponse.json({ error: "O'z loyihangizga taklif bera olmaysiz" }, { status: 400 });
    }

    // Taklifni saqlash
    const interaction = await prisma.interaction.create({
      data: {
        projectId: id,
        userId: user.id,
        suggestionText,
        technology: technology || null,
        status: "PENDING", // Egasiga tasdiqlash uchun
      },
    });

    // Taklif bergach darhol 10 XP berish mexanizmi (Yoki ACCEPTED bo'lganda berilishi mumkin, biz darhol rag'batlantiramiz)
    const newXp = user.xp + 10;
    const newRank = calculateRank(newXp) as any;

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: newXp, rank: newRank },
    });

    // Agar 3 ta taklif yig'ilgan bo'lsa, loyiha holatini IN_REVIEW ga o'tkazish
    if (project.interactions.length + 1 >= 3 && project.status === "BOOMERANGED") {
      await prisma.project.update({
        where: { id },
        data: { status: "IN_REVIEW" },
      });
    }

    return NextResponse.json({ success: true, interaction, newXp, newRank });
  } catch (error) {
    console.error("Suggest error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
