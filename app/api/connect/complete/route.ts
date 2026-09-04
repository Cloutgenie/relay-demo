import { NextResponse } from "next/server";
import { applyConnectedCookie, getSession } from "@/lib/auth";
import { demoInstanceReview } from "@/lib/connect/mock-instance";
import { prisma } from "@/lib/prisma";

function isForm(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  return (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  );
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    if (isForm(req)) {
      return NextResponse.redirect(new URL("/login", req.url), 303);
    }
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let environment = "prod0";
  if (isForm(req)) {
    const data = await req.formData();
    environment = String(data.get("environment") ?? "prod0");
  } else {
    const body = (await req.json().catch(() => ({}))) as { environment?: string };
    environment = body.environment ?? "prod0";
  }

  const report = demoInstanceReview(environment);

  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: {
      oauthConnected: true,
      oauthConnectedAt: new Date(),
      connectCompletedAt: new Date(),
      sprinklrEnv: environment === "live" ? "live" : environment,
      listeningEnabled: false,
      capabilityReport: report,
    },
  });

  const res = isForm(req)
    ? NextResponse.redirect(new URL("/app/connect?done=1", req.url), 303)
    : NextResponse.json({ ok: true, review: report });
  applyConnectedCookie(res, true);
  return res;
}
