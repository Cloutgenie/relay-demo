import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { AppShell } from "@/components/app-shell";
import { CapabilityProvider } from "@/components/capability-provider";
import { getSession } from "@/lib/auth";
import { loadInstanceReview } from "@/lib/connect/server";
import { prisma } from "@/lib/prisma";

export default async function AuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [queueCount, review] = await Promise.all([
    prisma.reviewItem.count({
      where: { tenantId: session.tenantId, status: "pending" },
    }),
    loadInstanceReview(session.tenantId),
  ]);

  return (
    <AppShell email={session.email} queueCount={queueCount}>
      <CapabilityProvider review={review}>{children}</CapabilityProvider>
    </AppShell>
  );
}
