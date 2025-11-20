// app/api/admin/login/route.js
import { NextResponse } from "next/server";

let attempts = 0;
const MAX_ATTEMPTS = 10;
const LOCK_TIME = 1000 * 60 * 5; // 5 minutes
let lockedUntil = null;

export async function POST(req) {
  const body = await req.json();
  const password = body.password;
  const correct = process.env.ADMIN_PASSWORD;

  if (lockedUntil && lockedUntil > Date.now()) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  if (password === correct) {
    attempts = 0;
    lockedUntil = null;

    const res = NextResponse.json({ success: true });

    // server-only httpOnly cookie (secure + strict)
    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: true,
      sameSite: "strict",
    });

    return res;
  }

  attempts++;
  if (attempts >= MAX_ATTEMPTS) lockedUntil = Date.now() + LOCK_TIME;

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
}
