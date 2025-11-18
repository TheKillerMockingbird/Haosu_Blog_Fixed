import { NextResponse } from "next/server";

export function middleware(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) return;

  const cookie = req.cookies.get("admin-auth")?.value;

  if (cookie === "yes") {
    return NextResponse.next();
  }

  // Allow accessing the login page
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
