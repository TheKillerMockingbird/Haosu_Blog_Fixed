// app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // clear the same cookie name
  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: true,
    sameSite: "strict",
  });

  return res;
}
