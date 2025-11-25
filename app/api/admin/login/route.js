import { NextResponse } from "next/server";

let attempts = 0;
const MAX_ATTEMPTS = 10;
const LOCK_TIME = 1000 * 60 * 5; // 5 minutes
let lockedUntil = null;

export async function POST(req) {
  const body = await req.json();
  const password = body.password;
  const correct = process.env.ADMIN_PASSWORD;

  // Too many attempts?
  if (lockedUntil && lockedUntil > Date.now()) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  // Correct password
  if (password === correct) {
    attempts = 0;
    lockedUntil = null;

    const res = NextResponse.json({ success: true });

    // Set proper auth cookie
    res.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      secure: true,
      sameSite: "strict",
    });

    return res;
  }

  // Wrong password
  attempts++;

  if (attempts >= MAX_ATTEMPTS) {
    lockedUntil = Date.now() + LOCK_TIME;
  }

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
}
