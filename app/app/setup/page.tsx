import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SetupClient } from "@/components/setup-client";

export default async function SetupPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: session.tenantId },
    include: { fieldMaps: { orderBy: [{ entityType: "asc" }, { tagType: "asc" }] } },
  });

  return (
    <SetupClient
      tenant={{
        name: tenant.name,
        workspaceName: tenant.workspaceName,
        oauthConnected: tenant.oauthConnected,
        webhookUrl: tenant.webhookUrl,
        listeningEnabled: tenant.listeningEnabled,
        writebackEnabled: tenant.writebackEnabled,
        caseCreatedHook: tenant.caseCreatedHook,
        autoWriteThreshold: tenant.autoWriteThreshold,
      }}
      fields={tenant.fieldMaps.map((f) => ({
        id: f.id,
        tagType: f.tagType,
        entityType: f.entityType,
        existsInTenant: f.existsInTenant,
      }))}
    />
  );
}
