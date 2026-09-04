import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoLockup } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { formatWhen } from "@/lib/utils";

const PLAIN: Record<string, string> = {
  ingest: "We received a message",
  auto_tag: "We filled in tags",
  writeback: "We wrote tags back",
  human_override: "Someone kept or changed a tag",
  reject: "Someone skipped a tag",
};

export default async function AuditPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const events = await prisma.auditEvent.findMany({
    where: { tenantId: session.tenantId },
    include: { message: true },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">History</h1>
          <p className="mt-1 text-sm text-slate-600">
            What we tagged and what people changed. Download if you need a record.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/api/audit/export">Download CSV</a>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center">
            <div className="mb-4 flex justify-center">
              <LogoLockup width={96} />
            </div>
            <p className="font-medium">No history yet.</p>
            <p className="mt-1 text-sm text-slate-600">
              Press the big button on Home first.
            </p>
            <Button asChild className="mt-4">
              <Link href="/app">Go to Home</Link>
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardBody>
                <p className="text-sm font-medium">
                  {PLAIN[event.action] ?? event.action}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {event.message?.text
                    ? `“${event.message.text.slice(0, 140)}”`
                    : event.detail ?? "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatWhen(event.createdAt)} · {event.actor}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
