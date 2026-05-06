import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "jilola-secret";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, direction } = await req.json();

    if (!name || !email || !password || !direction) {
      return NextResponse.json({ error: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, direction },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "30d" });

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      direction: user.direction,
      xp: user.xp,
      rank: user.rank,
    });

    // Cookie'ni to'g'ridan-to'g'ri response'ga o'rnatish
    response.cookies.set("sb_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 kun
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
