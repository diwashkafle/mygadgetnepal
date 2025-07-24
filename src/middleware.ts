// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Only apply logic on admin routes
  if (url.pathname.startsWith("/admin")) {
    const token = await getToken({ req });

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) ?? [];

    const userEmail = token?.email;

    const isAdmin = userEmail && adminEmails.includes(userEmail);

    if (!isAdmin) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"], // Apply middleware only to admin routes
  };