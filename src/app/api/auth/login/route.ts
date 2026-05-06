import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "jilola-secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      direction: user.direction,
      xp: user.xp,
      rank: user.rank,
    });

    (await cookies()).set("sb_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
