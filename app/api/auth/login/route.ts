import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { applyConnectedCookie, applySessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureDemoWorkspace } from "@/lib/seed-demo";

function isForm(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  return (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  );
}

export async function POST(req: Request) {
  const form = isForm(req);
  let email = "";
  let password = "";

  if (form) {
    const data = await req.formData();
    email = String(data.get("email") ?? "").trim().toLowerCase();
    password = String(data.get("password") ?? "");
  } else {
    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
  }

  if (email === "admin@tagtruth.demo") {
    email = "admin@relay.demo";
  }
  if (email === "admin@relay.demo") {
    await ensureDemoWorkspace().catch(() => undefined);
  }

  if (!email || !password) {
    if (form) {
      return NextResponse.redirect(new URL("/login?error=missing", req.url), 303);
    }
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true },
  });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    if (form) {
      return NextResponse.redirect(new URL("/login?error=auth", req.url), 303);
    }
    return NextResponse.json({ error: "Could not sign in." }, { status: 401 });
  }

  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    name: user.name,
  };
  const dest = "/app/connect";
  const res = form
    ? NextResponse.redirect(new URL(dest, req.url), 303)
    : NextResponse.json({ ok: true, next: dest });
  applySessionCookie(res, payload);
  applyConnectedCookie(res, true);
  return res;
}
