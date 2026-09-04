import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processInbound } from "@/lib/pipeline";
import { sprinklrMode } from "@/lib/sprinklr/client";
import type { InboundPayload } from "@/lib/sprinklr/types";

export async function POST(req: Request) {
  const raw = await req.text();
  const tenantId =
    req.headers.get("x-relay-tenant") ??
    req.headers.get("x-tagtruth-tenant") ??
    (await prisma.tenant.findFirst({ select: { id: true } }))?.id;

  if (!tenantId) {
    return NextResponse.json({ error: "No tenant." }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return NextResponse.json({ error: "Unknown tenant." }, { status: 404 });
  }

  if (sprinklrMode() === "live") {
    const sig = req.headers.get("x-sprinklr-signature") ?? "";
    const expected = createHmac("sha256", tenant.webhookSecret).update(raw).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Bad signature." }, { status: 401 });
    }
  }

  let event: InboundPayload;
  try {
    event = JSON.parse(raw) as InboundPayload;
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  const message = await processInbound(tenant.id, event);
  return NextResponse.json({ id: message.id, status: message.status });
}
