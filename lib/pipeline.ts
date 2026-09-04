import { prisma } from "@/lib/prisma";
import {
  classifyMessage,
  overallSource,
  shouldAutoWrite,
} from "@/lib/classify/engine";
import type { Classification } from "@/lib/classify/types";
import { enqueueWrite, flushWriteQueue } from "@/lib/sprinklr/write-queue";
import type { InboundPayload, SprinklrEntityType } from "@/lib/sprinklr/types";
import { tokenize } from "@/lib/utils";

export async function processInbound(tenantId: string, event: InboundPayload) {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: tenantId },
    include: { rules: true, terms: true, fieldMaps: true },
  });

  const mapped = tenant.fieldMaps.filter((f) => f.existsInTenant);
  if (mapped.length === 0) {
    throw new Error(
      "Custom fields are not mapped. Finish setup before ingesting.",
    );
  }

  const inbound = event.payload;
  const entityType = (inbound.entityType ??
    (event.type === "CASE_CREATED" ? "Case" : "Message")) as SprinklrEntityType;

  const message = await prisma.message.upsert({
    where: {
      tenantId_sprinklrMessageId: {
        tenantId,
        sprinklrMessageId: inbound.id,
      },
    },
    create: {
      tenantId,
      sprinklrMessageId: inbound.id,
      entityType,
      text: inbound.text,
      channel: inbound.channel,
      account: inbound.account,
      author: inbound.author,
      existingFields: inbound.customFields ?? {},
      rawPayload: event as object,
      status: "ingested",
    },
    update: {
      text: inbound.text,
      channel: inbound.channel,
      account: inbound.account,
      author: inbound.author,
      existingFields: inbound.customFields ?? {},
      rawPayload: event as object,
      entityType,
    },
  });

  await prisma.auditEvent.create({
    data: {
      tenantId,
      messageId: message.id,
      action: "ingest",
      actor: "system",
      source: event.type,
      after: { text: inbound.text, channel: inbound.channel },
    },
  });

  const classification = classifyMessage(
    {
      text: inbound.text,
      channel: inbound.channel,
      account: inbound.account,
      author: inbound.author,
    },
    tenant.rules,
    tenant.terms,
  );

  const auto = shouldAutoWrite(classification, tenant.autoWriteThreshold);

  const updated = await prisma.message.update({
    where: { id: message.id },
    data: {
      category: classification.category?.value,
      brand: classification.brand?.value,
      campaign: classification.campaign?.value,
      categoryConfidence: classification.category?.confidence,
      brandConfidence: classification.brand?.confidence,
      campaignConfidence: classification.campaign?.confidence,
      classificationSource: overallSource(classification),
      status: auto ? "written" : "queued",
    },
  });

  await prisma.auditEvent.create({
    data: {
      tenantId,
      messageId: message.id,
      action: "auto_tag",
      actor: "system",
      source: overallSource(classification) ?? "none",
      confidence: minOf(classification),
      after: snapshot(classification),
      detail: auto ? "auto-write" : "sent to review queue",
    },
  });

  if (auto && tenant.writebackEnabled) {
    await enqueueWrite(tenantId, message.id, {
      entityType,
      entityId: inbound.id,
      properties: {
        ...(classification.category
          ? { Category: classification.category.value }
          : {}),
        ...(classification.brand ? { Brand: classification.brand.value } : {}),
        ...(classification.campaign
          ? { Campaign: classification.campaign.value }
          : {}),
      },
    });
    await flushWriteQueue();
    return prisma.message.findUniqueOrThrow({ where: { id: message.id } });
  } else {
    await prisma.reviewItem.upsert({
      where: { messageId: message.id },
      create: {
        tenantId,
        messageId: message.id,
        status: "pending",
        suggestedCategory: classification.category?.value,
        suggestedBrand: classification.brand?.value,
        suggestedCampaign: classification.campaign?.value,
      },
      update: {
        status: "pending",
        suggestedCategory: classification.category?.value,
        suggestedBrand: classification.brand?.value,
        suggestedCampaign: classification.campaign?.value,
        reviewedAt: null,
        reviewerEmail: null,
      },
    });
  }

  return updated;
}

export async function applyHumanDecision(opts: {
  tenantId: string;
  reviewId: string;
  actor: string;
  decision: "approved" | "edited" | "rejected";
  category?: string | null;
  brand?: string | null;
  campaign?: string | null;
  note?: string;
}) {
  const review = await prisma.reviewItem.findFirstOrThrow({
    where: { id: opts.reviewId, tenantId: opts.tenantId },
    include: { message: true, tenant: true },
  });

  const before = {
    category: review.message.category,
    brand: review.message.brand,
    campaign: review.message.campaign,
  };

  if (opts.decision === "rejected") {
    await prisma.reviewItem.update({
      where: { id: review.id },
      data: {
        status: "rejected",
        reviewerEmail: opts.actor,
        reviewedAt: new Date(),
        note: opts.note,
      },
    });
    await prisma.message.update({
      where: { id: review.messageId },
      data: { status: "rejected" },
    });
    await prisma.auditEvent.create({
      data: {
        tenantId: opts.tenantId,
        messageId: review.messageId,
        action: "reject",
        actor: opts.actor,
        source: "human",
        before,
        detail: opts.note,
      },
    });
    return;
  }

  const category =
    opts.decision === "edited"
      ? (opts.category ?? review.suggestedCategory)
      : (review.suggestedCategory ?? review.message.category);
  const brand =
    opts.decision === "edited"
      ? (opts.brand ?? review.suggestedBrand)
      : (review.suggestedBrand ?? review.message.brand);
  const campaign =
    opts.decision === "edited"
      ? (opts.campaign ?? review.suggestedCampaign)
      : (review.suggestedCampaign ?? review.message.campaign);

  await prisma.message.update({
    where: { id: review.messageId },
    data: {
      category,
      brand,
      campaign,
      classificationSource: "human",
      status: "written",
    },
  });

  await prisma.reviewItem.update({
    where: { id: review.id },
    data: {
      status: opts.decision,
      finalCategory: category,
      finalBrand: brand,
      finalCampaign: campaign,
      reviewerEmail: opts.actor,
      reviewedAt: new Date(),
      note: opts.note,
    },
  });

  await prisma.auditEvent.create({
    data: {
      tenantId: opts.tenantId,
      messageId: review.messageId,
      action: "human_override",
      actor: opts.actor,
      source: "human",
      before,
      after: { category, brand, campaign },
      detail: opts.decision,
    },
  });

  if (opts.decision === "edited") {
    await learnFromOverride({
      tenantId: opts.tenantId,
      text: review.message.text,
      category,
      brand,
      campaign,
      suggestedCategory: review.suggestedCategory,
      suggestedBrand: review.suggestedBrand,
      suggestedCampaign: review.suggestedCampaign,
    });
  }

  if (review.tenant.writebackEnabled) {
    await enqueueWrite(opts.tenantId, review.messageId, {
      entityType: review.message.entityType as SprinklrEntityType,
      entityId: review.message.sprinklrMessageId,
      properties: {
        ...(category ? { Category: category } : {}),
        ...(brand ? { Brand: brand } : {}),
        ...(campaign ? { Campaign: campaign } : {}),
      },
    });
    await flushWriteQueue();
    await prisma.auditEvent.create({
      data: {
        tenantId: opts.tenantId,
        messageId: review.messageId,
        action: "writeback",
        actor: opts.actor,
        source: "human",
        after: { category, brand, campaign },
      },
    });
  }
}

async function learnFromOverride(opts: {
  tenantId: string;
  text: string;
  category?: string | null;
  brand?: string | null;
  campaign?: string | null;
  suggestedCategory?: string | null;
  suggestedBrand?: string | null;
  suggestedCampaign?: string | null;
}) {
  const pairs: { tagType: string; value?: string | null; previous?: string | null }[] = [
    { tagType: "Category", value: opts.category, previous: opts.suggestedCategory },
    { tagType: "Brand", value: opts.brand, previous: opts.suggestedBrand },
    { tagType: "Campaign", value: opts.campaign, previous: opts.suggestedCampaign },
  ];

  const tokens = tokenize(opts.text).slice(0, 4);
  if (tokens.length === 0) return;

  for (const pair of pairs) {
    if (!pair.value || pair.value === pair.previous) continue;
    const pattern = tokens.join(", ");
    const existing = await prisma.rule.findFirst({
      where: {
        tenantId: opts.tenantId,
        tagType: pair.tagType,
        tagValue: pair.value,
        matchType: "keyword",
        pattern,
      },
    });
    if (existing) continue;
    await prisma.rule.create({
      data: {
        tenantId: opts.tenantId,
        name: `Learned: ${pair.value}`,
        enabled: true,
        priority: 80,
        tagType: pair.tagType,
        tagValue: pair.value,
        matchType: "keyword",
        pattern,
        source: "feedback",
      },
    });
  }
}

function snapshot(c: Classification) {
  return {
    category: c.category?.value ?? null,
    brand: c.brand?.value ?? null,
    campaign: c.campaign?.value ?? null,
    categoryConfidence: c.category?.confidence ?? null,
    brandConfidence: c.brand?.confidence ?? null,
    campaignConfidence: c.campaign?.confidence ?? null,
  };
}

function minOf(c: Classification) {
  const vals = [c.category, c.brand, c.campaign]
    .filter(Boolean)
    .map((s) => s!.confidence);
  return vals.length ? Math.min(...vals) : null;
}
