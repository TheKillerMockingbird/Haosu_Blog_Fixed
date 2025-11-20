import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("admin_auth");

    const isAuth = authCookie?.value === "true";

    return NextResponse.json({ auth: isAuth });
  } catch (err) {
    console.error("auth check error", err);
    return NextResponse.json({ auth: false });
  }
}
