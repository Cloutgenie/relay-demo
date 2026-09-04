import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loadInstanceReview } from "@/lib/connect/server";
import { ConnectWizard } from "@/components/connect-wizard";
import { prisma } from "@/lib/prisma";

export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string; step?: string; oauth?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { done, oauth, step } = await searchParams;
  const tenant = await prisma.tenant.findUniqueOrThrow({ where: { id: session.tenantId } });
  const saved = await loadInstanceReview(session.tenantId);
  const showSaved = done === "1" || step === "5";
  const initialStep = showSaved
    ? 5
    : oauth === "1"
      ? 3
      : Number(step) || 1;
  return (
    <ConnectWizard
      initialReview={showSaved ? saved : null}
      savedReview={saved}
      alreadyDone={Boolean(tenant.connectCompletedAt) || done === "1"}
      initialStep={initialStep}
    />
  );
}
