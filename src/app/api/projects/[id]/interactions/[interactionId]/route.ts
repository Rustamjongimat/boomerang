import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeProject } from "@/lib/ai";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; interactionId: string }> } // Awaitable params for Next.js 15
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, interactionId } = await params;
    const { status } = await req.json();

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { interactions: { include: { user: true } } },
    });

    if (!project) return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    if (project.ownerId !== user.id) {
      return NextResponse.json({ error: "Siz bu loyiha egasi emassiz" }, { status: 403 });
    }

    // Taklif statusini yangilash
    await prisma.interaction.update({
      where: { id: interactionId },
      data: { status },
    });

    const acceptedInteractions = project.interactions.filter((i) =>
      i.id === interactionId ? status === "ACCEPTED" : i.status === "ACCEPTED"
    );

    // Agar taklif qabul qilinsa, bergan odamga qo'shimcha +20 XP beramiz
    if (status === "ACCEPTED") {
      const interaction = project.interactions.find(i => i.id === interactionId);
      if (interaction) {
        await prisma.user.update({
          where: { id: interaction.userId },
          data: { xp: { increment: 20 } },
        });
      }
    }

    // Agar IN_REVIEW holatida bo'lsa va barcha PENDING takliflar ko'rib chiqilgan bo'lsa,
    // loyihani COMPLETED qilish va yakuniy AI tahlilini ishga tushirish (agar 3 tadan ko'p taklif qabul qilingan bo'lsa)
    const pendingInteractions = project.interactions.filter((i) =>
      i.id !== interactionId && i.status === "PENDING"
    );

    if (project.status === "IN_REVIEW" && pendingInteractions.length === 0) {
      // Barcha takliflar ko'rib chiqildi, endi AI yakuniy xulosa yozsin (Accepted larni qo'shib)
      const suggestionsText = acceptedInteractions.map(i => i.suggestionText).join(". ");
      
      const contentToAnalyze = `
        Original Title: ${project.title}
        Original Smart: ${project.specific}
        Accepted Suggestions from peers: ${suggestionsText}
        Make a final summary of how this idea improved.
      `;
      
      const aiResult = await analyzeProject(contentToAnalyze);

      await prisma.project.update({
        where: { id },
        data: {
          status: "COMPLETED",
          innovScore: aiResult.innovScore,
          aiFeedback: "Yakuniy xulosa: " + aiResult.feedback,
        },
      });

      // Loyiha tugallanganligi uchun egasiga +50 XP
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 50 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Interaction status error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
