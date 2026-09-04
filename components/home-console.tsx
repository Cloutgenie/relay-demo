import Link from "next/link";
import { MODULES } from "@/lib/modules/catalog";
import { CAPABILITY_LABEL, type InstanceReview } from "@/lib/connect/types";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBanner } from "@/components/status-banner";
import type { AppStatus } from "@/lib/status";

export function HomeConsole({
  status,
  pending,
  tenantName,
  review,
}: {
  status: AppStatus;
  pending: number;
  tenantName: string;
  review: InstanceReview | null;
}) {
  const caps = review?.capabilities ?? [];
  const attention = caps.filter((c) => c.status !== "ready");
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-500">{tenantName}</p>
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="mt-1 text-sm text-slate-600">
          One Sprinklr console. You click. Relay does the busywork.
        </p>
      </div>
      <StatusBanner
        status={status}
        pending={pending}
        action={status === "needs_review" ? "review" : status === "not_ready" ? "setup" : undefined}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-bold uppercase tracking-wide text-[#00bae9]">Working</p>
            <p className="mt-1 text-sm text-slate-700">Mock workspace is connected. Autofill is watching.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-bold uppercase tracking-wide text-[#faa21b]">Needs attention</p>
            <p className="mt-1 text-sm text-slate-700">
              {pending} review {pending === 1 ? "item" : "items"}
              {attention.length ? ` · ${attention.length} modules to glance at` : ""}.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-bold uppercase tracking-wide text-[#70bf54]">Done</p>
            <p className="mt-1 text-sm text-slate-700">
              {caps.filter((c) => c.status === "ready").length} modules ready after Connect.
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => {
          const cap = caps.find((c) => c.moduleId === m.id);
          const label = cap ? CAPABILITY_LABEL[cap.status] : "Open Connect first";
          return (
          <Link key={m.id} href={m.href} className="block">
            <Card className="h-full transition-colors hover:border-[#00bae9]">
              <CardBody>
                <p className="font-semibold text-[#0b1220]">{m.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{m.does}</p>
                <p className="mt-2 text-xs font-medium text-[#118acb]">{label} →</p>
              </CardBody>
            </Card>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
