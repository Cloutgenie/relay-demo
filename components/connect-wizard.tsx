"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CAPABILITY_LABEL, type CapabilityStatus, type InstanceReview } from "@/lib/connect/types";
import { MODULES } from "@/lib/modules/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

const STEPS = [
  { id: 1, title: "Create the app key" },
  { id: 2, title: "Sign in as admin" },
  { id: 3, title: "Relay connects" },
  { id: 4, title: "Review the workspace" },
  { id: 5, title: "What Relay can do" },
];

function tone(status: CapabilityStatus): "green" | "orange" | "slate" {
  if (status === "ready") return "green";
  if (status === "needs_setup") return "orange";
  return "slate";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-[#0b1220]">{value}</span>
    </div>
  );
}

export function ConnectWizard({
  initialReview,
  savedReview = null,
  alreadyDone,
  initialStep = 1,
}: {
  initialReview: InstanceReview | null;
  savedReview?: InstanceReview | null;
  alreadyDone: boolean;
  initialStep?: number;
}) {
  const [step, setStep] = useState(initialStep);
  const [env, setEnv] = useState(initialReview?.environment ?? savedReview?.environment ?? "prod0");
  const [advanced, setAdvanced] = useState(false);
  const [review, setReview] = useState<InstanceReview | null>(initialReview);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  void alreadyDone;

  const doneSteps = review ? 5 : Math.max(0, step - 1);

  async function finishDemo() {
    setBusy(true);
    const res = await fetch("/api/connect/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ environment: env }),
    });
    const body = (await res.json().catch(() => ({}))) as { review?: InstanceReview };
    setBusy(false);
    if (body.review) {
      setReview(body.review);
      setStep(5);
      router.refresh();
    }
  }

  const capabilities = useMemo(() => {
    if (!review) return [];
    return review.capabilities.map((row) => {
      const meta = MODULES.find((m) => m.id === row.moduleId);
      return { ...row, title: meta?.title ?? row.moduleId, href: meta?.href ?? "/app" };
    });
  }, [review]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-[#0b1220]">Connect</h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Link one Sprinklr workspace. Relay will only do what the person who signs in can already do.
        </p>
      </div>

      <form action="/api/connect/complete" method="POST">
        <input type="hidden" name="environment" value={env} />
        <Button type="submit" size="lg" className="h-12 w-full sm:w-auto" disabled={busy}>
          {review ? "Replay the sample workspace" : "Use the demo workspace"}
        </Button>
        <p className="mt-2 text-sm text-slate-500">
          No Sprinklr login needed. This walks the same five steps a live client would see.
        </p>
      </form>
      {savedReview && !review ? (
        <p className="text-sm text-slate-600">
          A demo review is already saved.{" "}
          <button
            type="button"
            className="font-medium text-[#118acb] underline"
            onClick={() => {
              setReview(savedReview);
              setStep(5);
            }}
          >
            Jump to the capability report
          </button>
          .
        </p>
      ) : null}
      {review ? (
        <button
          type="button"
          className="text-sm text-slate-500 underline"
          onClick={() => {
            setReview(null);
            setStep(1);
          }}
        >
          Walk through the five steps again
        </button>
      ) : null}

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STEPS.map((s) => {
          const complete = doneSteps >= s.id || step > s.id || Boolean(review);
          const current = step === s.id && !review ? true : review && s.id === 5;
          return (
            <li
              key={s.id}
              className={`rounded-lg px-2 py-2 text-xs ${
                complete
                  ? "bg-[#eef8ea] text-[#3d7a2c]"
                  : current
                    ? "bg-[#e6f7fc] text-[#0b1220]"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              <p className="font-semibold">
                {complete ? "✓" : s.id} {s.title}
              </p>
            </li>
          );
        })}
      </ol>

      {step === 1 && !review ? (
        <Card>
          <CardBody className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Step 1</p>
            <h2 className="text-xl font-semibold">Create an app key for this client</h2>
            <p className="text-sm leading-6 text-slate-600">
              Relay needs a small app inside this Sprinklr workspace. The client admin creates it once. You do not need to talk about APIs — just follow the three clicks.
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>
                Open{" "}
                <a
                  href="https://dev.sprinklr.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#118acb] underline"
                >
                  Sprinklr’s developer home
                </a>
                .
              </li>
              <li>Create an app for this client’s workspace. Name it Relay.</li>
              <li>Come back here. In a live workspace you paste the two codes Sprinklr shows you.</li>
            </ol>
            <div>
              <p className="text-sm font-medium text-[#0b1220]">Which environment?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  ["prod0", "Production 0"],
                  ["prod2", "Production 2"],
                  ["qa4", "QA 4"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEnv(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      env === id
                        ? "bg-[#0b1220] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="text-sm text-slate-500 underline"
              onClick={() => setAdvanced((v) => !v)}
            >
              {advanced ? "Hide the two codes" : "I have the two codes (advanced)"}
            </button>
            {advanced ? (
              <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <p>Live only. Demo does not need these.</p>
                <p className="mt-2 font-mono text-xs">SPRINKLR_CLIENT_ID · SPRINKLR_CLIENT_SECRET</p>
              </div>
            ) : null}
            <Button onClick={() => setStep(2)}>I created the app — next</Button>
          </CardBody>
        </Card>
      ) : null}

      {step === 2 && !review ? (
        <Card>
          <CardBody className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Step 2</p>
            <h2 className="text-xl font-semibold">Sign in as the workspace admin</h2>
            <p className="text-sm leading-6 text-slate-600">
              The person who can already do this work in Sprinklr should sign in. A partner or client admin. Relay will borrow their access — nothing extra.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href="/api/oauth/sprinklr">Sign in with Sprinklr</a>
              </Button>
              <Button variant="outline" onClick={() => setStep(3)}>
                Continue with the demo person
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Live sign-in opens Sprinklr’s own page. Demo uses Jordan Hale, workspace admin.
            </p>
          </CardBody>
        </Card>
      ) : null}

      {step === 3 && !review ? (
        <Card>
          <CardBody className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Step 3</p>
            <h2 className="text-xl font-semibold">Relay is using this person’s access</h2>
            <p className="text-sm leading-6 text-slate-600">
              Connected as Jordan Hale, workspace admin. Relay can only do what this person can already do in Sprinklr — read messages, write tags, open cases. There is no extra master key.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Read incoming messages",
                "Write Category, Brand, and Campaign",
                "Open care cases",
                "Read customer profiles",
              ].map((item) => (
                <li key={item} className="flex justify-between rounded-lg bg-[#eef8ea] px-3 py-2">
                  <span>{item}</span>
                  <span className="font-medium text-[#3d7a2c]">Yes</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => setStep(4)}>Review this workspace</Button>
          </CardBody>
        </Card>
      ) : null}

      {step === 4 && !review ? (
        <Card>
          <CardBody className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Step 4</p>
            <h2 className="text-xl font-semibold">Review this workspace</h2>
            <p className="text-sm leading-6 text-slate-600">
              Press the sample to pull a full picture — tags, accounts, roles, and whether Listening is on. A live tenant uses the same screen after sign-in.
            </p>
            <Button disabled={busy} onClick={() => void finishDemo()}>
              {busy ? "Reviewing…" : "Review the demo workspace"}
            </Button>
          </CardBody>
        </Card>
      ) : null}

      {review ? (
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Workspace review</p>
              <h2 className="text-xl font-semibold">{review.workspace}</h2>
              <Row label="Signed in as" value={`${review.signedInAs} · ${review.role}`} />
              <Row label="Environment" value={review.environmentLabel} />
              <Row
                label="Listening"
                value={review.listeningEnabled ? "On" : "Off — needs Sprinklr Support"}
              />
              <div className="pt-2">
                <p className="text-sm font-medium text-[#0b1220]">Accounts</p>
                {review.accounts.map((a) => (
                  <Row key={a.handle} label={a.name} value={a.handle} />
                ))}
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-[#0b1220]">Roles on this sign-in</p>
                <p className="mt-1 text-sm text-slate-700">{review.roles.join(" · ")}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-[#0b1220]">The three tags</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {review.fields.map((f) => (
                    <li key={`${f.on}-${f.name}`} className="flex justify-between rounded-md bg-slate-50 px-3 py-2">
                      <span>
                        {f.name} on {f.on}
                      </span>
                      <span className={f.present ? "text-[#3d7a2c]" : "text-[#8a5a00]"}>
                        {f.present ? "Present" : "Missing"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-[#0b1220]">What’s on in Sprinklr</p>
                {review.sprinklrFeatures.map((f) => (
                  <Row
                    key={f.name}
                    label={f.name}
                    value={f.on ? (f.note ?? "On") : (f.note ?? "Off")}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Step 5</p>
              <h2 className="text-xl font-semibold">What Relay can do here</h2>
              <p className="text-sm leading-6 text-slate-600">
                Only the Ready items are unlocked. Needs setup stays open as a preview. Needs Sprinklr Support stays gated.
              </p>
              <ul className="space-y-2">
                {capabilities.map((row) => (
                  <li key={row.moduleId}>
                    <Link
                      href={row.status === "needs_support" ? "/app/listening" : row.href}
                      className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-3 py-3 hover:border-[#00bae9]"
                    >
                      <div>
                        <p className="font-medium text-[#0b1220]">{row.title}</p>
                        <p className="mt-0.5 text-sm text-slate-600">{row.why}</p>
                      </div>
                      <Badge tone={tone(row.status)}>{CAPABILITY_LABEL[row.status]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild size="lg">
                  <Link href="/app">Open Taxonomy Autofill</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/app/sidekick">Open Case Sidekick</Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
