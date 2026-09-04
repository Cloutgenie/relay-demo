import { loadCaseContext, listDemoCases } from "@/lib/sidekick/connectors";
import { SidekickClient } from "@/components/sidekick-client";

export default async function WidgetCasePage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const { caseId } = await searchParams;
  const ctx = await loadCaseContext(caseId);
  return <SidekickClient ctx={ctx} cases={listDemoCases()} standalone />;
}
