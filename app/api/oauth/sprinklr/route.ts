import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sprinklr, sprinklrMode } from "@/lib/sprinklr/client";

export async function GET() {
  const session = await getSession();
  const app = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:43147";
  if (!session) {
    return NextResponse.redirect(new URL("/login", app));
  }
  if (sprinklrMode() !== "live" || !process.env.SPRINKLR_CLIENT_ID) {
    return NextResponse.redirect(new URL("/app/connect?oauth=1", app));
  }
  return NextResponse.redirect(sprinklr.oauthAuthorizeUrl(session.tenantId));
}
