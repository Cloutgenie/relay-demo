import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveStatus } from "@/lib/status";
import { ensureDemoWorkspace } from "@/lib/seed-demo";
import { DashboardClient } from "@/components/dashboard-client";
import { HomeConsole } from "@/components/home-console";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await ensureDemoWorkspace();

  const [tenant, fieldReady, pending, recent] = await Promise.all([
    prisma.tenant.findUniqueOrThrow({ where: { id: session.tenantId } }),
    prisma.fieldMap.count({
      where: { tenantId: session.tenantId, existsInTenant: true },
    }),
    prisma.reviewItem.count({
      where: { tenantId: session.tenantId, status: "pending" },
    }),
    prisma.message.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  const last = recent[0] ?? null;

  const status = deriveStatus({
    fieldsReady: fieldReady >= 9 && tenant.oauthConnected,
    pendingReviews: pending,
    lastStatus: last?.status,
  });

  const lastPayload = last
    ? {
        id: last.id,
        text: last.text,
        author: last.author,
        channel: last.channel,
        category: last.category,
        brand: last.brand,
        campaign: last.campaign,
        status: last.status,
        writtenBack: last.writtenBack,
      }
    : null;

  return (
    <div className="space-y-8">
      <HomeConsole status={status} pending={pending} tenantName={tenant.name} />
      <div>
        <h2 className="mb-3 text-lg font-semibold">Taxonomy Autofill</h2>
        <DashboardClient
          tenantName={tenant.name}
          status={status}
          pending={pending}
          last={lastPayload}
          inbox={recent.map((m) => ({
            id: m.id,
            text: m.text,
            author: m.author,
            channel: m.channel,
            category: m.category,
            brand: m.brand,
            campaign: m.campaign,
            status: m.status,
            writtenBack: m.writtenBack,
          }))}
        />
      </div>
    </div>
  );
}
