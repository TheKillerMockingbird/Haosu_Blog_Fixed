import { NextResponse } from "next/server";


export async function GET(req) {
try {
const cookieHeader = req.headers.get("cookie") || "";
const cookies = Object.fromEntries(
cookieHeader
.split("; ")
.filter(Boolean)
.map((c) => {
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
