import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();
    if (!title || !description) return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        authorId: user.id,
      },
    });

    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Create challenge error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, rank: true } },
        _count: { select: { projects: true } },
      },
    });

    return NextResponse.json({ challenges }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Get challenges error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
