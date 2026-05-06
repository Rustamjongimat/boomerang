import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || "jilola-secret";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ommaviy sahifalarni va auth API'larini o'tkazib yuborish
  if (PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Dashboard yoki API'ga kirish uchun token tekshirish
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/")) {
    const token = req.cookies.get("sb_token")?.value;

    if (!token) {
      // API so'rovlari uchun 401 qaytarish
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Sahifalar uchun login sahifasiga yo'naltirish
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      jwt.verify(token, SECRET);
      return NextResponse.next();
    } catch {
      // Eskirgan yoki noto'g'ri token
      const response = pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/auth/login", req.url));

      response.cookies.delete("sb_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
