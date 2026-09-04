"use client";

import { useRouter } from "next/navigation";
import { useCapability } from "@/components/capability-provider";
import { CaseSidekickPanel, SprinklrCaseChrome } from "@/components/case-sidekick";
import { ModuleScreen } from "@/components/module-screen";
import type { CaseContext } from "@/lib/sidekick/types";

function Switcher({
  cases,
  current,
  hrefFor,
}: {
  cases: { caseId: string; caseNumber: string; subject: string }[];
  current: string;
  hrefFor: (id: string) => string;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-2">
      {cases.map((c) => (
        <button
          key={c.caseId}
          type="button"
          onClick={() => router.push(hrefFor(c.caseId))}
          className={`rounded-md px-2 py-1 text-xs ${
            c.caseId === current
              ? "bg-[#00bae9] text-[#071018]"
              : "bg-white/10 text-slate-200"
          }`}
        >
          Case #{c.caseNumber}
        </button>
      ))}
    </div>
  );
}

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
  const gate = useCapability("sidekick");
  const base = standalone ? "/widget/case" : "/app/sidekick";
  const hrefFor = (id: string) => `${base}?caseId=${id}`;

  if (standalone) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[380px] flex-col bg-white">
        <div className="bg-[#0b1220] px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">RECORD_PAGE</p>
          <Switcher cases={cases} current={ctx.caseId} hrefFor={hrefFor} />
        </div>
        <CaseSidekickPanel ctx={ctx} />
      </div>
    );
  }

  return (
    <ModuleScreen
      title="Case Sidekick"
      does="Shows order, SKU, and customer context on the care case so agents do not tab-hop."
      gate={gate}
      sampleLabel="Open a late-shipment case"
      onSample={() => router.push(`${base}?caseId=case_2091`)}
    >
      <SprinklrCaseChrome
        ctx={ctx}
        switcher={<Switcher cases={cases} current={ctx.caseId} hrefFor={hrefFor} />}
      />
    </ModuleScreen>
  );
}
