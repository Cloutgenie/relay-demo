import { prisma } from "@/lib/prisma";
import { demoInstanceReview } from "@/lib/connect/mock-instance";
import type { CapabilityRow, CapabilityStatus, InstanceReview } from "@/lib/connect/types";
import type { ModuleId } from "@/lib/modules/catalog";

export function parseReview(raw: unknown): InstanceReview | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as InstanceReview;
  if (!value.workspace || !Array.isArray(value.capabilities)) return null;
  return value;
}

export async function loadInstanceReview(tenantId: string): Promise<InstanceReview | null> {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return null;
  return parseReview(tenant.capabilityReport) ?? (tenant.connectCompletedAt ? demoInstanceReview(tenant.sprinklrEnv) : null);
}

export async function capabilityFor(
  tenantId: string,
  moduleId: ModuleId,
): Promise<CapabilityRow> {
  const review = await loadInstanceReview(tenantId);
  const row = review?.capabilities.find((c) => c.moduleId === moduleId);
  if (row) return row;
  return {
    moduleId,
    status: "needs_setup",
    why: "Connect a workspace first so Relay knows what this tenant can do.",
  };
}

export function unlocked(status: CapabilityStatus) {
  return status === "ready";
}
