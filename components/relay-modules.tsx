"use client";

import { useState } from "react";
import { useCapability } from "@/components/capability-provider";
import { ModuleScreen } from "@/components/module-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-[#0b1220]">{value}</span>
    </div>
  );
}

export function ConnectClient() {
  const [ran, setRan] = useState(false);
  const [env, setEnv] = useState("prod0");
  return (
    <ModuleScreen
      title="Connect"
      does="Link one Sprinklr workspace so Relay can work for you."
      sampleLabel="Use the demo workspace"
      onSample={() => setRan(true)}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[#0b1220]">Which environment?</p>
          <p className="mt-0.5 text-xs text-slate-500">Pick the login world this workspace uses.</p>
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
        <ol className="space-y-2 text-sm">
          {[
            ["Workspace", ran ? "Northwind CX · Prod (demo)" : "Not linked"],
            ["Sign-in method", ran ? "Sprinklr sign-in (demo)" : "Waiting"],
            ["Environment", ran ? env : "—"],
            ["Read incoming messages", ran ? "Yes" : "Needed"],
            ["Write Category / Brand / Campaign", ran ? "Yes" : "Needed"],
            ["Open care cases", ran ? "Yes" : "Needed"],
            ["Read customer profiles", ran ? "Yes" : "Needed"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>{k}</span>
              <span className={ran ? "font-medium text-[#3d7a2c]" : "text-slate-500"}>{v}</span>
            </li>
          ))}
        </ol>
        {ran ? (
          <p className="rounded-lg bg-[#eef8ea] px-3 py-2 text-sm text-[#3d7a2c]">
            Connected. Relay only does what this signed-in person can already do.
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Press the sample button to link the demo. A live workspace uses the same
            checklist after the admin signs in on Sprinklr&apos;s page.
          </p>
        )}
      </div>
    </ModuleScreen>
  );
}

export function BoardsClient() {
  const gate = useCapability("boards");
  const [board, setBoard] = useState<null | { name: string; experienceId: string; market: string }>(null);
  return (
    <ModuleScreen
      title="Board Factory"
      does="Stamps a golden listening board for a brand and market."
      gate={gate}
      sampleLabel="Stamp Acme · United States"
      onSample={() =>
        setBoard({
          name: "Acme · US · Care golden",
          experienceId: "exp_demo_acme_us_care",
          market: "United States",
        })
      }
    >
      {board ? (
        <div>
          <p className="text-sm font-semibold">Board created (demo)</p>
          <Row label="Name" value={board.name} />
          <Row label="Experience" value={board.experienceId} />
          <Row label="Market" value={board.market} />
          <p className="mt-3 text-sm text-[#3d7a2c]">Done. You can find it in Experience-ID Finder.</p>
        </div>
      ) : (
        <p className="text-sm text-slate-600">No board stamped yet. Press the sample button.</p>
      )}
    </ModuleScreen>
  );
}

export function ExportClient() {
  const gate = useCapability("export");
  const [pack, setPack] = useState<null | { rows: number; file: string }>(null);
  return (
    <ModuleScreen
      title="Client Pack Exporter"
      does="Builds a reporting snapshot you can send to a client."
      gate={gate}
      sampleLabel="Build this week’s pack"
      onSample={() => setPack({ rows: 186, file: "northwind-week36-pack.csv" })}
    >
      {pack ? (
        <div className="space-y-3">
          <p className="text-sm">Snapshot ready: {pack.rows} rows · {pack.file}</p>
          <a
            className="inline-flex rounded-md bg-[#0b1220] px-3 py-2 text-sm text-white"
            href={`data:text/csv,week,mentions,replies%0A36,186,141`}
            download={pack.file}
          >
            Download CSV
          </a>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to build a mock client pack.</p>
      )}
    </ModuleScreen>
  );
}

export function ExperiencesClient() {
  const gate = useCapability("experiences");
  const [hits, setHits] = useState<null | { name: string; id: string }[]>(null);
  return (
    <ModuleScreen
      title="Experience-ID Finder"
      does="Finds boards and experiences by name, so you do not hunt IDs."
      gate={gate}
      sampleLabel="Find Acme boards"
      onSample={() =>
        setHits([
          { name: "Acme · US · Care golden", id: "exp_demo_acme_us_care" },
          { name: "Acme · US · Advocacy", id: "exp_demo_acme_us_adv" },
        ])
      }
    >
      {hits ? (
        <div>
          {hits.map((h) => (
            <Row key={h.id} label={h.name} value={h.id} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to list demo experiences.</p>
      )}
    </ModuleScreen>
  );
}

export function PublishClient() {
  const gate = useCapability("publish");
  const [result, setResult] = useState<null | { ok: boolean; notes: string[] }>(null);
  return (
    <ModuleScreen
      title="Publish QA Gate"
      does="Checks a draft before anyone hits approve."
      gate={gate}
      sampleLabel="Check a sample draft"
      onSample={() =>
        setResult({
          ok: false,
          notes: [
            "Blocked claim: “#1 doctor recommended” — no substantiation on file.",
            "Missing disclosure on a paid mention.",
            "Tone is fine. Brand name is correct.",
          ],
        })
      }
    >
      {result ? (
        <div className="space-y-2">
          <Badge tone={result.ok ? "green" : "orange"}>
            {result.ok ? "Ready to approve" : "Hold — two fixes"}
          </Badge>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to run the checklist on a draft.</p>
      )}
    </ModuleScreen>
  );
}

export function RightsClient() {
  const [items, setItems] = useState<null | { asset: string; issue: string }[]>(null);
  return (
    <ModuleScreen
      title="Asset Rights Desk"
      does="Flags expired or off-brand assets before they go live."
      sampleLabel="Scan the library"
      onSample={() =>
        setItems([
          { asset: "spring-hero-04.jpg", issue: "Usage expired Sep 1" },
          { asset: "old-logo-lockup.png", issue: "Off-brand — retired mark" },
        ])
      }
    >
      {items ? (
        <div>
          {items.map((i) => (
            <Row key={i.asset} label={i.asset} value={i.issue} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to see two mock rights alerts.</p>
      )}
    </ModuleScreen>
  );
}

export function SlaClient() {
  const [rows, setRows] = useState<null | { item: string; why: string }[]>(null);
  return (
    <ModuleScreen
      title="SLA Snitch"
      does="Tells you when a case is aging or a publish failed."
      sampleLabel="Check the last hour"
      onSample={() =>
        setRows([
          { item: "Case #2091", why: "Open 6h — over the 4h care target" },
          { item: "Reply to @quietbuyer", why: "Publish failed — media rejected" },
        ])
      }
    >
      {rows ? (
        <div>
          {rows.map((r) => (
            <Row key={r.item} label={r.item} value={r.why} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to load mock SLA alerts.</p>
      )}
    </ModuleScreen>
  );
}

export function AssignClient() {
  const [route, setRoute] = useState<null | string>(null);
  return (
    <ModuleScreen
      title="Smart Assign"
      does="Routes work by language, VIP, or product on the profile."
      sampleLabel="Route the next case"
      onSample={() => setRoute("Case #2091 → Care · English · VIP desk (Pat Nguyen)")}
    >
      {route ? (
        <p className="text-sm font-medium text-[#3d7a2c]">{route}</p>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to assign a demo case.</p>
      )}
    </ModuleScreen>
  );
}

export function ProfilesClient() {
  const [sync, setSync] = useState<null | string>(null);
  return (
    <ModuleScreen
      title="Profile Enricher"
      does="Pushes and pulls CRM fields, plus suppression sync."
      sampleLabel="Sync Pat Nguyen"
      onSample={() =>
        setSync("Pulled CRM-88421 · lifetime $1,240 · added to email suppression: no")
      }
    >
      {sync ? (
        <p className="text-sm font-medium">{sync}</p>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to mock a CRM pull.</p>
      )}
    </ModuleScreen>
  );
}

export function AccessClient() {
  const [rows, setRows] = useState<null | { who: string; note: string }[]>(null);
  return (
    <ModuleScreen
      title="Access Auditor"
      does="Lists roles, account access, and stale keys in plain English."
      sampleLabel="Run an access pass"
      onSample={() =>
        setRows([
          { who: "jordan@northwind", note: "Partner admin · 12 accounts" },
          { who: "key spr_old_2019", note: "Stale — last used 11 months ago" },
        ])
      }
    >
      {rows ? (
        <div>
          {rows.map((r) => (
            <Row key={r.who} label={r.who} value={r.note} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to see a mock access report.</p>
      )}
    </ModuleScreen>
  );
}

export function WebhooksClient() {
  const [events, setEvents] = useState<null | { type: string; when: string }[]>(null);
  return (
    <ModuleScreen
      title="Webhook Flight Recorder"
      does="Keeps a log of what Sprinklr sent us."
      sampleLabel="Replay three events"
      onSample={() =>
        setEvents([
          { type: "Message received", when: "2 minutes ago" },
          { type: "Case created", when: "18 minutes ago" },
          { type: "Message updated", when: "1 hour ago" },
        ])
      }
    >
      {events ? (
        <div>
          {events.map((e, i) => (
            <Row key={i} label={e.type} value={e.when} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">Press the sample button to fill the flight log.</p>
      )}
    </ModuleScreen>
  );
}

export function ListeningClient() {
  const [preview, setPreview] = useState(false);
  return (
    <ModuleScreen
      title="Listening Spike Watch"
      does="Watches mention spikes — needs Sprinklr Support to turn on."
      sampleLabel="Preview a sample spike"
      onSample={() => setPreview(true)}
    >
      <div className="rounded-xl bg-[#fff4e0] px-4 py-4">
        <p className="font-semibold text-[#8a5a00]">Needs Sprinklr Support</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Listening is off on purpose. Sprinklr Support must enable the firehose
          for this workspace before Relay can watch spikes. The rest of the
          console still works.
        </p>
        <Button className="mt-3" variant="outline" disabled>
          Waiting on Support
        </Button>
      </div>
      {preview ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sample only — not live
          </p>
          <Row label="Acme · shipping mentions" value="↑ 4.2× vs yesterday" />
          <Row label="Harbor · return mentions" value="Steady" />
        </div>
      ) : null}
    </ModuleScreen>
  );
}
