import { NextResponse } from "next/server";


export async function POST() {
const res = NextResponse.json({ success: true });


res.cookies.set("admin_auth", "", {
httpOnly: true,
path: "/",
maxAge: 0,
secure: process.env.NODE_ENV === "production",
sameSite: "strict",
});


return res;
}