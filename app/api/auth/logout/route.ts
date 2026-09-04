import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const form = (req.headers.get("content-type") ?? "").includes("form");
  const res = form
    ? NextResponse.redirect(new URL("/login", req.url), 303)
    : NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
