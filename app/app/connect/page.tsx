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
  const review = await loadInstanceReview(session.tenantId);
  const initialStep = review || done === "1"
    ? 5
    : oauth === "1"
      ? 3
      : Number(step) || 1;
  return (
    <ConnectWizard
      initialReview={review}
      alreadyDone={Boolean(tenant.connectCompletedAt) || done === "1"}
      initialStep={initialStep}
    />
  );
}
