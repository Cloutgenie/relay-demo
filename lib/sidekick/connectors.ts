import { sprinklrMode } from "@/lib/sprinklr/client";
import { getMockCase, MOCK_CASES } from "@/lib/sidekick/mock-cases";
import type { CaseContext } from "@/lib/sidekick/types";

/**
 * Case Sidekick context loader.
 * Mock mode returns demo CRM / order / SKU data.
 * Live connectors are stubs until CRM_API_URL / OMS_API_URL are set.
 */
export async function loadCaseContext(caseId?: string | null): Promise<CaseContext> {
  if (sprinklrMode() === "live") {
    return loadLiveCaseContext(caseId);
  }
  return getMockCase(caseId);
}

export function listDemoCases() {
  return MOCK_CASES.map((c) => ({
    caseId: c.caseId,
    caseNumber: c.caseNumber,
    subject: c.subject,
  }));
}

async function loadLiveCaseContext(caseId?: string | null): Promise<CaseContext> {
  const crmUrl = process.env.CRM_API_URL;
  const omsUrl = process.env.OMS_API_URL;
  if (!crmUrl && !omsUrl) {
    const fallback = getMockCase(caseId);
    return { ...fallback, source: "mock" };
  }

  // Live stubs — wire these to the tenant CRM / OMS later.
  if (crmUrl) {
    await fetch(`${crmUrl}/accounts?caseId=${encodeURIComponent(caseId ?? "")}`, {
      headers: { Authorization: `Bearer ${process.env.CRM_API_KEY ?? ""}` },
    }).catch(() => null);
  }
  if (omsUrl) {
    await fetch(`${omsUrl}/orders?caseId=${encodeURIComponent(caseId ?? "")}`, {
      headers: { Authorization: `Bearer ${process.env.OMS_API_KEY ?? ""}` },
    }).catch(() => null);
  }
  return getMockCase(caseId);
}
