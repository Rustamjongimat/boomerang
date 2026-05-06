import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeProject } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { title, specific, measurable, achievable, relevant, timeBound, challengeId } = data;

    if (!title || !specific || !measurable || !achievable || !relevant || !timeBound) {
      return NextResponse.json({ error: "Barcha SMART maydonlari to'ldirilishi shart" }, { status: 400 });
    }

    // AI Analysis
    const contentToAnalyze = `
      Title: ${title}
      Specific: ${specific}
      Measurable: ${measurable}
      Achievable: ${achievable}
      Relevant: ${relevant}
      Time-bound: ${timeBound}
    `;
    
    const aiResult = await analyzeProject(contentToAnalyze);

    const project = await prisma.project.create({
      data: {
        title,
        specific,
        measurable,
        achievable,
        relevant,
        timeBound,
        challengeId: challengeId || null,
        ownerId: user.id,
        innovScore: aiResult.innovScore,
        aiFeedback: aiResult.feedback,
        aiSuggestions: aiResult.suggestions,
        status: "BOOMERANGED", // Yaratilgach to'g'ridan to'g'ri tarmoqqa yuboriladi
        smartScore: Math.round((aiResult.innovScore + 20) > 100 ? 100 : aiResult.innovScore + 10),
      },
    });

    // Loyiha kiritgani uchun foydalanuvchiga XP qo'shish (ixtiyoriy, masalan +20 XP)
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 20 } },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { interactions: true } },
      },
    });

    return NextResponse.json({ projects }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
