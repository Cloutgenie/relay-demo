import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { DEMO_SAMPLES } from "@/lib/demo-samples";
import { processInbound } from "@/lib/pipeline";
import type { InboundPayload } from "@/lib/sprinklr/types";

function isForm(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  return (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  );
}

export async function POST(req: Request) {
  const session = await getSession();
  const form = isForm(req);
  if (!session) {
    if (form) return NextResponse.redirect(new URL("/login", req.url), 303);
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let event: InboundPayload | null = null;
  if (form) {
    const pick = DEMO_SAMPLES[Math.floor(Math.random() * DEMO_SAMPLES.length)];
    event = {
      type: pick.type,
      payload: {
        ...pick.payload,
        id: `demo_${Date.now()}`,
      },
    };
  } else {
    event = (await req.json().catch(() => null)) as InboundPayload | null;
  }

  if (!event?.payload?.text || !event.payload.id) {
    if (form) return NextResponse.redirect(new URL("/app", req.url), 303);
    return NextResponse.json({ error: "Need a message to tag." }, { status: 400 });
  }

  try {
    const message = await processInbound(session.tenantId, {
      type: event.type ?? "MESSAGE_RECEIVED",
      payload: {
        id: event.payload.id,
        text: event.payload.text,
        channel: event.payload.channel ?? "Demo",
        account: event.payload.account ?? "AcmeCare",
        author: event.payload.author ?? "Customer",
        entityType: event.payload.entityType ?? "Message",
        customFields: event.payload.customFields ?? {},
      },
    });
    if (form) {
      return NextResponse.redirect(new URL("/app", req.url), 303);
    }
    return NextResponse.json({
      id: message.id,
      text: message.text,
      author: message.author,
      channel: message.channel,
      category: message.category,
      brand: message.brand,
      campaign: message.campaign,
      status: message.status,
      writtenBack: message.writtenBack,
    });
  } catch (error) {
    if (form) return NextResponse.redirect(new URL("/app?error=1", req.url), 303);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not tag that." },
      { status: 400 },
    );
  }
}
