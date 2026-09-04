import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:43147";

  if (!tenantId || !code) {
    return NextResponse.redirect(`${app}/app/connect`);
  }

  // Live token exchange is stubbed until SPRINKLR_CLIENT_SECRET is set.
  if (process.env.SPRINKLR_CLIENT_SECRET && process.env.SPRINKLR_OAUTH_TOKEN_URL) {
    await fetch(process.env.SPRINKLR_OAUTH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.SPRINKLR_CLIENT_ID ?? "",
        client_secret: process.env.SPRINKLR_CLIENT_SECRET,
        redirect_uri: process.env.SPRINKLR_REDIRECT_URI ?? "",
      }),
    }).catch(() => null);
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { oauthConnected: true, oauthConnectedAt: new Date(), sprinklrEnv: "live" },
  });
  return NextResponse.redirect(`${app}/app/connect?oauth=1`);
}
