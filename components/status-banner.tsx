import Link from "next/link";
import { STATUS_COPY, type AppStatus } from "@/lib/status";
import { Button } from "@/components/ui/button";

const BAR: Record<AppStatus, string> = {
  not_ready: "bg-slate-200 text-slate-800",
  working: "bg-[#00bae9] text-[#071018]",
  watching: "bg-[#0b1220] text-white",
  needs_review: "bg-[#faa21b] text-[#2a1a00]",
  done: "bg-[#70bf54] text-[#10240c]",
};

export function StatusBanner({
  status,
  pending = 0,
  action,
}: {
  status: AppStatus;
  pending?: number;
  action?: "review" | "setup" | "demo";
}) {
  const copy = STATUS_COPY[status];
  return (
    <div className={`rounded-2xl px-5 py-5 ${BAR[status]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em]">{copy.label}</p>
      <h2 className="mt-1 text-2xl font-semibold leading-tight">{copy.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">{copy.detail}</p>
      {status === "needs_review" && pending > 0 ? (
        <p className="mt-1 text-sm font-medium">
          {pending === 1 ? "1 message" : `${pending} messages`} waiting.
        </p>
      ) : null}
      {action === "review" ? (
        <div className="mt-4">
          <Button asChild variant="navy" size="lg">
            <Link href="/app/queue">Review now</Link>
          </Button>
        </div>
      ) : null}
      {action === "setup" ? (
        <div className="mt-4">
          <Button asChild variant="default" size="lg">
            <Link href="/app/setup">Finish setup</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
