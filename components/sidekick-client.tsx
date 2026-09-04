"use client";

import { useRouter } from "next/navigation";
import { SprinklrCaseChrome } from "@/components/case-sidekick";
import { ModuleScreen } from "@/components/module-screen";
import type { CaseContext } from "@/lib/sidekick/types";

export function SidekickClient({
  ctx,
  cases,
  standalone = false,
}: {
  ctx: CaseContext;
  cases: { caseId: string; caseNumber: string; subject: string }[];
  standalone?: boolean;
}) {
  const router = useRouter();
  const base = standalone ? "/widget/case" : "/app/sidekick";

  const chrome = (
    <SprinklrCaseChrome
      ctx={ctx}
      switcher={
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <button
              key={c.caseId}
              type="button"
              onClick={() => router.push(`${base}?caseId=${c.caseId}`)}
              className={`rounded-md px-2 py-1 text-xs ${
                c.caseId === ctx.caseId
                  ? "bg-[#00bae9] text-[#071018]"
                  : "bg-white/10 text-slate-200"
              }`}
            >
              Case #{c.caseNumber}
            </button>
          ))}
        </div>
      }
    />
  );

  if (standalone) return chrome;

  return (
    <ModuleScreen
      title="Case Sidekick"
      does="Shows order, SKU, and customer context on the care case so agents do not tab-hop."
      sampleLabel="Open a late-shipment case"
      onSample={() => router.push(`${base}?caseId=case_2091`)}
    >
      {chrome}
    </ModuleScreen>
  );
}
