// app/api/admin/check/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // On server, req.cookies is available via NextResponse/Request in App Router
    // but Next.js provides cookies via req.cookies or you can use req.headers.get('cookie')
    // Use the Request's cookies parsing via URLSearchParams-like API isn't available here,
    // so we parse header cookie manually:
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").filter(Boolean).map((c) => {
        const idx = c.indexOf("=");
        return [c.slice(0, idx), c.slice(idx + 1)];
      })
    );

    const isAuth = cookies["admin_auth"] === "true";

    return NextResponse.json({ auth: !!isAuth });
  } catch (err) {
    console.error("auth check error", err);
    return NextResponse.json({ auth: false });
  }
}
