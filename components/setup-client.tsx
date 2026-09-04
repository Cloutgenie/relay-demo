"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";

type Field = {
  id: string;
  tagType: string;
  entityType: string;
  existsInTenant: boolean;
};

export function SetupClient({
  tenant,
  fields,
}: {
  tenant: {
    name: string;
    workspaceName: string;
    oauthConnected: boolean;
    webhookUrl: string | null;
    listeningEnabled: boolean;
    writebackEnabled: boolean;
    caseCreatedHook: boolean;
    autoWriteThreshold: number;
  };
  fields: Field[];
}) {
  const router = useRouter();
  const [connected, setConnected] = useState(tenant.oauthConnected);
  const [maps, setMaps] = useState(fields);
  const [busy, setBusy] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const ready = connected && maps.every((f) => f.existsInTenant);

  async function connectDemo() {
    setBusy(true);
    const res = await fetch("/api/setup/connect", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      setConnected(true);
      setNotice("Demo workspace is connected.");
      router.refresh();
    }
  }

  async function ensureFields() {
    setBusy(true);
    const res = await fetch("/api/setup/fields", { method: "POST" });
    const body = (await res.json()) as { fields?: Field[] };
    setBusy(false);
    if (body.fields) setMaps(body.fields);
    setNotice("Category, Brand, and Campaign are ready.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Setup</h1>
        <p className="mt-1 text-sm text-slate-600">
          Defaults already work. Connect, confirm the three tags, then go tag a
          message.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 1
          </p>
          <h2 className="text-xl font-semibold">
            {connected ? "Connected" : "Connect a workspace"}
          </h2>
          <p className="text-sm text-slate-600">
            {connected
              ? `${tenant.workspaceName} is linked in demo mode. A live tenant uses the same button after Sprinklr OAuth.`
              : "Use the demo, or connect Sprinklr when you have Partner / client admin access."}
          </p>
          {!connected ? (
            <Button size="lg" disabled={busy} onClick={() => void connectDemo()}>
              Use the demo workspace
            </Button>
          ) : (
            <p className="rounded-lg bg-[#eef8ea] px-3 py-2 text-sm text-[#3d7a2c]">
              Ready. You can skip ahead and tag a sample message.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 2
          </p>
          <h2 className="text-xl font-semibold">The three tags</h2>
          <p className="text-sm text-slate-600">
            Sprinklr must have Category, Brand, and Campaign on messages (and
            cases / profiles). Demo creates that mapping for you.
          </p>
          <ul className="space-y-1 text-sm">
            {["Category", "Brand", "Campaign"].map((tag) => {
              const ok = maps
                .filter((f) => f.tagType === tag)
                .every((f) => f.existsInTenant);
              return (
                <li key={tag} className="flex justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>{tag}</span>
                  <span className={ok ? "text-[#3d7a2c]" : "text-[#8a5a00]"}>
                    {ok ? "Ready" : "Missing"}
                  </span>
                </li>
              );
            })}
          </ul>
          {!maps.every((f) => f.existsInTenant) ? (
            <Button disabled={busy} onClick={() => void ensureFields()}>
              Create the missing fields
            </Button>
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Step 3
          </p>
          <h2 className="text-xl font-semibold">See it work</h2>
          <p className="text-sm text-slate-600">
            Rules and extra flags can wait. First win: tags appear on a sample
            message.
          </p>
          <Button asChild size="lg" disabled={!ready}>
            <Link href="/app">Go tag a sample message</Link>
          </Button>
          {!ready ? (
            <p className="text-sm text-slate-500">
              Finish connect and the three tags first.
            </p>
          ) : null}
        </CardBody>
      </Card>

      {notice ? <p className="text-sm text-[#3d7a2c]">{notice}</p> : null}

      <button
        type="button"
        className="text-sm text-slate-500 underline"
        onClick={() => setShowAdvanced((v) => !v)}
      >
        {showAdvanced ? "Hide extra setup" : "Extra setup (OAuth notes, webhooks, flags)"}
      </button>

      {showAdvanced ? (
        <Card>
          <CardHeader>
            <CardTitle>Extra setup</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4 text-sm leading-6 text-slate-700">
            <div>
              <p className="font-medium text-[#0b1220]">OAuth app on dev.sprinklr.com</p>
              <p>
                Register Relay as a custom app. Redirect URI comes from{" "}
                <code className="rounded bg-slate-100 px-1">SPRINKLR_REDIRECT_URI</code>.
                The API key inherits the connecting user&apos;s roles — a Partner
                or client admin should click Connect. Jay login is required if
                that is how the tenant authenticates.
              </p>
            </div>
            <div>
              <p className="font-medium text-[#0b1220]">Webhooks</p>
              <p>
                Subscribe to Message Received and Message Updated. Case Created
                is optional. Allowlist this URL:
              </p>
              <p className="mt-1 break-all rounded-md bg-slate-100 px-2 py-1 font-mono text-xs">
                {tenant.webhookUrl ?? "/api/webhooks/sprinklr"}
              </p>
            </div>
            <div>
              <p className="font-medium text-[#0b1220]">Listening API</p>
              <p>
                Off unless Sprinklr Support enables the firehose. Flag:{" "}
                <code className="rounded bg-slate-100 px-1">LISTENING_API_ENABLED</code>.
                Current: {tenant.listeningEnabled ? "on" : "off"}.
              </p>
            </div>
            <div>
              <p className="font-medium text-[#0b1220]">Writes</p>
              <p>
                High-confidence tags write back automatically. We batch Category
                + Brand + Campaign so we stay under ~1000 requests/hour.
                Writeback is {tenant.writebackEnabled ? "on" : "off"}.
              </p>
            </div>
            <p>
              Want to edit keyword rules after the first win?{" "}
              <Link href="/app/rules" className="text-[#118acb] underline">
                Open rules
              </Link>
              .
            </p>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
