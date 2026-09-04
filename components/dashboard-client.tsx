"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoLockup } from "@/components/logo";
import { StatusBanner } from "@/components/status-banner";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import type { AppStatus } from "@/lib/status";

const SAMPLES = [
  {
    text: "My package is 4 days late. Tracking has not moved. #shipping",
    channel: "Twitter",
    account: "AcmeCare",
    author: "A customer on Twitter",
    entityType: "Message",
    type: "MESSAGE_RECEIVED",
  },
  {
    text: "Charged twice for the same order. Invoice 8831.",
    channel: "Email",
    account: "AcmeCare",
    author: "A customer over email",
    entityType: "Message",
    type: "MESSAGE_RECEIVED",
  },
  {
    text: "This is not what I expected at all.",
    channel: "Twitter",
    account: "AcmeCare",
    author: "A customer on Twitter",
    entityType: "Message",
    type: "MESSAGE_RECEIVED",
  },
];

type LastMessage = {
  id: string;
  text: string;
  author: string;
  channel: string;
  category: string | null;
  brand: string | null;
  campaign: string | null;
  status: string;
  writtenBack: boolean;
};

export function DashboardClient({
  tenantName,
  status,
  pending,
  last,
  inbox = [],
}: {
  tenantName: string;
  status: AppStatus;
  pending: number;
  last: LastMessage | null;
  inbox?: LastMessage[];
}) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<LastMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sampleIndex, setSampleIndex] = useState(0);

  const shown = result ?? last;
  const liveStatus: AppStatus = working ? "working" : status;
  const bannerAction =
    liveStatus === "needs_review"
      ? "review"
      : liveStatus === "not_ready"
        ? "setup"
        : undefined;

  async function fireDemo() {
    const sample = SAMPLES[sampleIndex % SAMPLES.length];
    setSampleIndex((n) => n + 1);
    setWorking(true);
    setError(null);
    setResult(null);
    const res = await fetch("/api/demo/mock-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: sample.type,
        payload: {
          id: `demo_${Date.now()}`,
          text: sample.text,
          channel: sample.channel,
          account: sample.account,
          author: sample.author,
          entityType: sample.entityType,
          customFields: {},
        },
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      id?: string;
      text?: string;
      author?: string;
      channel?: string;
      category?: string | null;
      brand?: string | null;
      campaign?: string | null;
      status?: string;
      writtenBack?: boolean;
    };
    if (!res.ok) {
      setWorking(false);
      setError(body.error ?? "Could not tag the sample. Try again.");
      return;
    }
    await new Promise((r) => setTimeout(r, 450));
    setResult({
      id: body.id ?? "new",
      text: body.text ?? sample.text,
      author: body.author ?? sample.author,
      channel: body.channel ?? sample.channel,
      category: body.category ?? null,
      brand: body.brand ?? null,
      campaign: body.campaign ?? null,
      status: body.status ?? "queued",
      writtenBack: Boolean(body.writtenBack),
    });
    setWorking(false);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">{tenantName}</p>
        <h1 className="text-2xl font-semibold text-[#0b1220]">Home</h1>
      </div>

      <StatusBanner status={liveStatus} pending={pending} action={bannerAction} />

      <Card>
        <CardBody className="space-y-4 py-6">
          <form
            action="/api/demo/mock-webhook"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              void fireDemo();
            }}
          >
            <Button
              type="submit"
              size="lg"
              className="h-16 w-full text-lg font-semibold"
              disabled={working}
            >
              {working ? "Tagging the message…" : "Show me a tagged message"}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-600">
            Sends a sample customer message and fills Category, Brand, and Campaign
            in plain English. Press it again to try another.
          </p>
          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
        </CardBody>
      </Card>

      {working ? (
        <Card>
          <CardBody className="space-y-3">
            <p className="text-sm font-medium text-slate-500">Customer wrote</p>
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
            <div className="grid gap-2">
              <TagLine label="Category" value="…" />
              <TagLine label="Brand" value="…" />
              <TagLine label="Campaign" value="…" />
            </div>
          </CardBody>
        </Card>
      ) : null}

      {!working && shown ? (
        <ResultCard message={shown} />
      ) : null}

      {!working && !shown ? (
        <Card>
          <CardBody className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <LogoLockup width={96} />
            </div>
            <p className="text-base font-medium text-[#0b1220]">
              Nothing tagged yet.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Press the big button above. That is the whole demo.
            </p>
          </CardBody>
        </Card>
      ) : null}

      {inbox.length > 0 ? (
        <Card>
          <CardBody className="space-y-3">
            <p className="text-sm font-semibold text-[#0b1220]">
              Sample inbox · {inbox.length} messages
            </p>
            <ul className="divide-y divide-slate-100">
              {inbox.map((item) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm text-[#0b1220]">“{item.text}”</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.status === "queued"
                      ? "Needs review"
                      : item.status === "written"
                        ? "Done"
                        : item.status}{" "}
                    · {item.category ?? "no category"} · {item.brand ?? "no brand"}
                    {item.campaign ? ` · ${item.campaign}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function ResultCard({ message }: { message: LastMessage }) {
  const needsReview = message.status === "queued";
  const done = message.status === "written";

  return (
    <Card>
      <CardBody className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Customer wrote
          </p>
          <p className="mt-1 text-base leading-7 text-[#0b1220]">“{message.text}”</p>
          <p className="mt-1 text-xs text-slate-500">
            {message.author} · {message.channel}
          </p>
        </div>
        <div className="space-y-2">
          <TagLine label="Category" value={message.category} />
          <TagLine label="Brand" value={message.brand} />
          <TagLine label="Campaign" value={message.campaign} />
        </div>
        {done ? (
          <p className="rounded-lg bg-[#eef8ea] px-3 py-2 text-sm text-[#3d7a2c]">
            Done. We {message.writtenBack ? "wrote these back to Sprinklr (demo)." : "saved these tags."}
          </p>
        ) : null}
        {needsReview ? (
          <div className="rounded-lg bg-[#fff4e0] px-3 py-3">
            <p className="text-sm font-medium text-[#8a5a00]">
              We were not sure enough to write this back.
            </p>
            <Button asChild className="mt-3" variant="orange">
              <Link href="/app/queue">Keep or change this tag</Link>
            </Button>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

function TagLine({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-semibold text-[#0b1220]">
        {value && value.length > 0 ? value : "We left this blank"}
      </span>
    </div>
  );
}
