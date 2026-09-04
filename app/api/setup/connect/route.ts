import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: {
      oauthConnected: true,
      oauthConnectedAt: new Date(),
      sprinklrEnv: "mock",
    },
  });
  return NextResponse.json({ ok: true, mode: "mock" });
}
