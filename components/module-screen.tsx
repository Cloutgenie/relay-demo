import type { ReactNode } from "react";
import type { CapabilityRow } from "@/lib/connect/types";
import { CAPABILITY_LABEL } from "@/lib/connect/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function ModuleScreen({
  title,
  does,
  onSample,
  sampleLabel = "Run a sample",
  working = false,
  gate,
  children,
}: {
  title: string;
  does: string;
  onSample?: () => void;
  sampleLabel?: string;
  working?: boolean;
  gate?: CapabilityRow | null;
  children: ReactNode;
}) {
  const locked = gate?.status === "needs_support";
  const preview = gate?.status === "needs_setup";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#0b1220]">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">{does}</p>
        </div>
        {gate ? (
          <Badge
            tone={gate.status === "ready" ? "green" : gate.status === "needs_setup" ? "orange" : "slate"}
          >
            {CAPABILITY_LABEL[gate.status]}
          </Badge>
        ) : null}
      </div>
      {gate && gate.status !== "ready" ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            locked ? "bg-[#fff4e0] text-[#8a5a00]" : "bg-[#fff8e8] text-[#8a5a00]"
          }`}
        >
          {gate.why}
        </p>
      ) : null}
      {onSample ? (
        <Button
          size="lg"
          className="h-12 w-full sm:w-auto"
          disabled={working || locked}
          onClick={onSample}
        >
          {working ? "Working…" : preview ? `Preview: ${sampleLabel}` : sampleLabel}
        </Button>
      ) : null}
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
}
