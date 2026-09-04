import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applyHumanDecision } from "@/lib/pipeline";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    messageId?: string;
    category?: string;
    brand?: string;
    campaign?: string;
  };
  if (!body.messageId) {
    return NextResponse.json({ error: "Missing message." }, { status: 400 });
  }

  const review = await prisma.reviewItem.upsert({
    where: { messageId: body.messageId },
    create: {
      tenantId: session.tenantId,
      messageId: body.messageId,
      status: "pending",
      suggestedCategory: body.category,
      suggestedBrand: body.brand,
      suggestedCampaign: body.campaign,
    },
    update: {},
  });

  await applyHumanDecision({
    tenantId: session.tenantId,
    reviewId: review.id,
    actor: session.email,
    decision: "edited",
    category: body.category,
    brand: body.brand,
    campaign: body.campaign,
    note: "agent panel",
  });
  return NextResponse.json({ ok: true });
}
