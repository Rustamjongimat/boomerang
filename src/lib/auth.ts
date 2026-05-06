import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.NEXTAUTH_SECRET || "jilola-secret";

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get("sb_token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, direction: true, xp: true, rank: true, avatar: true },
    });
    return user;
  } catch {
    return null;
  }
}
