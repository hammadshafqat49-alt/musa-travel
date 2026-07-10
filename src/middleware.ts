import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const agentSecret = new TextEncoder().encode(process.env.JWT_SECRET || "musa-secret-key-2026");
const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "musa-admin-secret-key-2026");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect agent routes
  if (pathname.startsWith("/agent") && !pathname.startsWith("/agent/login")) {
    const token = request.cookies.get("agent_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/agent/login", request.url));
    }
    try {
      await jwtVerify(token, agentSecret, { clockTolerance: 60 });
    } catch {
      return NextResponse.redirect(new URL("/agent/login", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, adminSecret, { clockTolerance: 60 });
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent/:path*", "/admin/:path*"],
};
