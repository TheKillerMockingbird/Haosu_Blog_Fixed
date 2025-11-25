import { NextResponse } from "next/server";

let attempts = 0;
const MAX_ATTEMPTS = 10;      // Brute force protection
const LOCK_TIME = 1000 * 60 * 5; // 5 min lock

let lockedUntil = null;

export async function POST(req) {
  const body = await req.json();

  // Check lock
  if (lockedUntil && lockedUntil > Date.now()) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const password = body.password;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    attempts = 0;
    lockedUntil = null;

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin-auth", "yes", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  }

  // wrong password
  attempts++;
  if (attempts >= MAX_ATTEMPTS) {
    lockedUntil = Date.now() + LOCK_TIME;
  }

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
}
