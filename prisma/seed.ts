import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEMO_SAMPLES } from "../lib/demo-samples";
import { applyHumanDecision, processInbound } from "../lib/pipeline";

const prisma = new PrismaClient();

const ENTITIES = ["Message", "Case", "Profile"] as const;
const TAGS = ["Category", "Brand", "Campaign"] as const;

async function main() {
  const email = process.env.DEMO_ADMIN_EMAIL ?? "admin@relay.demo";
  const password = process.env.DEMO_ADMIN_PASSWORD ?? "demo";
  const passwordHash = await bcrypt.hash(password, 10);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:43147";

  const tenant = await prisma.tenant.upsert({
    where: { id: "tenant_demo_northwind" },
    update: {},
    create: {
      id: "tenant_demo_northwind",
      name: "Northwind Consumer Care",
      workspaceName: "Northwind CX · Prod workspace",
      sprinklrEnv: "mock",
      oauthConnected: true,
      oauthConnectedAt: new Date(),
      oauthClientId: "spr_demo_app_northwind",
      webhookSecret: "whsec_demo_relay",
      webhookUrl: `${appUrl}/api/webhooks/sprinklr`,
      autoWriteThreshold: 0.82,
      reviewThreshold: 0.4,
      listeningEnabled: false,
      writebackEnabled: true,
      caseCreatedHook: true,
    },
  });

  for (const demoEmail of [email, "admin@relay.demo", "admin@tagtruth.demo"]) {
    await prisma.user.upsert({
      where: { email: demoEmail },
      update: { passwordHash, name: "Jordan Hale", tenantId: tenant.id },
      create: {
        email: demoEmail,
        name: "Jordan Hale",
        passwordHash,
        role: "admin",
        tenantId: tenant.id,
      },
    });
  }

  for (const entityType of ENTITIES) {
    for (const tagType of TAGS) {
      await prisma.fieldMap.upsert({
        where: {
          tenantId_tagType_entityType: {
            tenantId: tenant.id,
            tagType,
            entityType,
          },
        },
        update: { existsInTenant: true, fieldName: tagType },
        create: {
          tenantId: tenant.id,
          tagType,
          entityType,
          fieldName: tagType,
          sprinklrFieldId: `mock_${entityType}_${tagType}`.toLowerCase(),
          existsInTenant: true,
        },
      });
    }
  }

  const terms: { tagType: string; slug: string; label: string; keywords: string[] }[] = [
    { tagType: "Category", slug: "shipping", label: "Shipping", keywords: ["late", "tracking", "delivery", "package", "shipment", "shipping"] },
    { tagType: "Category", slug: "returns", label: "Returns", keywords: ["return", "returning", "refund", "chipped", "damaged", "label"] },
    { tagType: "Category", slug: "billing", label: "Billing", keywords: ["charged", "invoice", "billing", "payment", "refund", "capture"] },
    { tagType: "Category", slug: "product-quality", label: "Product Quality", keywords: ["broken", "quality", "defective", "dishwasher", "listing"] },
    { tagType: "Category", slug: "advocacy", label: "Advocacy", keywords: ["obsessed", "love", "thanks", "thank", "unboxing", "nps"] },
    { tagType: "Category", slug: "general", label: "General", keywords: ["help", "question", "expected"] },
    { tagType: "Brand", slug: "acme", label: "Acme", keywords: ["acme", "acmecare"] },
    { tagType: "Brand", slug: "harbor", label: "Harbor & Co", keywords: ["harbor", "kettle"] },
    { tagType: "Brand", slug: "northwind", label: "Northwind Home", keywords: ["northwind"] },
    { tagType: "Campaign", slug: "spring-launch", label: "Spring Launch", keywords: ["springlaunch", "launch", "unboxing"] },
    { tagType: "Campaign", slug: "nps-push", label: "NPS Push", keywords: ["nps", "survey"] },
    { tagType: "Campaign", slug: "holiday-care", label: "Holiday Care", keywords: ["holiday", "gift"] },
  ];

  for (const term of terms) {
    await prisma.taxonomyTerm.upsert({
      where: {
        tenantId_tagType_slug: {
          tenantId: tenant.id,
          tagType: term.tagType,
          slug: term.slug,
        },
      },
      update: { label: term.label, keywords: term.keywords },
      create: { tenantId: tenant.id, ...term },
    });
  }

  const rules = [
    { name: "Hashtag shipping", tagType: "Category", tagValue: "Shipping", matchType: "hashtag", pattern: "#shipping", priority: 10 },
    { name: "Hashtag returns", tagType: "Category", tagValue: "Returns", matchType: "hashtag", pattern: "#returns", priority: 10 },
    { name: "Late / tracking keywords", tagType: "Category", tagValue: "Shipping", matchType: "keyword", pattern: "late, tracking, delayed, shipment", priority: 20 },
    { name: "Charge / invoice keywords", tagType: "Category", tagValue: "Billing", matchType: "keyword", pattern: "charged twice, invoice, billing, capture", priority: 20 },
    { name: "Return keywords", tagType: "Category", tagValue: "Returns", matchType: "keyword", pattern: "returning, refund, prepaid label, chipped", priority: 20 },
    { name: "Advocacy thanks", tagType: "Category", tagValue: "Advocacy", matchType: "keyword", pattern: "obsessed, thanks, thank you, unboxing", priority: 30 },
    { name: "Acme care account", tagType: "Brand", tagValue: "Acme", matchType: "account", pattern: "acmecare", priority: 10 },
    { name: "Harbor official account", tagType: "Brand", tagValue: "Harbor & Co", matchType: "account", pattern: "harborofficial", priority: 10 },
    { name: "Northwind account", tagType: "Brand", tagValue: "Northwind Home", matchType: "account", pattern: "northwindhome", priority: 10 },
    { name: "Spring launch hashtag", tagType: "Campaign", tagValue: "Spring Launch", matchType: "hashtag", pattern: "#springlaunch", priority: 10 },
    { name: "NPS hashtag", tagType: "Campaign", tagValue: "NPS Push", matchType: "hashtag", pattern: "#nps", priority: 10 },
  ];

  await prisma.rule.deleteMany({ where: { tenantId: tenant.id } });
  for (const rule of rules) {
    await prisma.rule.create({
      data: { tenantId: tenant.id, source: "manual", enabled: true, ...rule },
    });
  }

  await prisma.auditEvent.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.writeJob.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.reviewItem.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.message.deleteMany({ where: { tenantId: tenant.id } });

  const ingested = [];
  for (const sample of DEMO_SAMPLES) {
    ingested.push(await processInbound(tenant.id, sample));
  }

  const pending = await prisma.reviewItem.findMany({
    where: { tenantId: tenant.id, status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  if (pending[0]) {
    await applyHumanDecision({
      tenantId: tenant.id,
      reviewId: pending[0].id,
      actor: email,
      decision: "approved",
      note: "Looks right — keep it.",
    });
  }
  if (pending[1]) {
    await applyHumanDecision({
      tenantId: tenant.id,
      reviewId: pending[1].id,
      actor: email,
      decision: "edited",
      category: "Product Quality",
      brand: pending[1].suggestedBrand ?? "Harbor & Co",
      campaign: pending[1].suggestedCampaign,
      note: "This is a quality miss, not a return yet.",
    });
  }

  const queued = await prisma.reviewItem.count({
    where: { tenantId: tenant.id, status: "pending" },
  });
  const written = await prisma.message.count({
    where: { tenantId: tenant.id, status: "written" },
  });

  console.log("Seeded Relay demo tenant:", tenant.name);
  console.log(`Open demo: ${email} / ${password}`);
  console.log(
    `Dummy inbox: ${ingested.length} messages · ${written} done · ${queued} need review`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
