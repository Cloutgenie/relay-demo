import type { ReactNode } from "react";
import { LogoWordmark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import type { CaseContext } from "@/lib/sidekick/types";

export function CaseSidekickPanel({ ctx }: { ctx: CaseContext }) {
  return (
    <aside className="flex h-full w-full flex-col bg-white text-[#0b1220]">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
        <LogoWordmark />
        <Badge tone="teal">Case Sidekick</Badge>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            This case
          </p>
          <p className="mt-1 text-sm font-semibold">#{ctx.caseNumber}</p>
          <p className="text-sm text-slate-600">{ctx.subject}</p>
          <p className="mt-2 text-xs text-slate-500">
            {ctx.channel} · {ctx.account}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge tone="green">{ctx.tags.category ?? "No category"}</Badge>
            <Badge tone="blue">{ctx.tags.brand ?? "No brand"}</Badge>
            {ctx.tags.campaign ? <Badge tone="orange">{ctx.tags.campaign}</Badge> : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Customer (CRM)
          </p>
          <p className="mt-1 text-sm font-semibold">{ctx.crm.name}</p>
          <p className="text-sm text-slate-600">{ctx.crm.email}</p>
          {ctx.crm.phone ? <p className="text-sm text-slate-600">{ctx.crm.phone}</p> : null}
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-slate-500">Account</dt>
              <dd className="font-medium">{ctx.crm.accountId}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Segment</dt>
              <dd className="font-medium">{ctx.crm.segment}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Lifetime</dt>
              <dd className="font-medium">{ctx.crm.lifetimeValue}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Last buy</dt>
              <dd className="font-medium">{ctx.crm.lastPurchase}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Order / SKU
          </p>
          {ctx.order ? (
            <>
              <p className="mt-1 text-sm font-semibold">Order #{ctx.order.id}</p>
              <p className="text-sm text-slate-600">
                {ctx.order.status} · {ctx.order.total}
              </p>
              <p className="text-xs text-slate-500">Placed {ctx.order.placedAt}</p>
              <ul className="mt-2 space-y-2">
                {ctx.order.items.map((item) => (
                  <li
                    key={item.sku}
                    className="rounded-lg bg-slate-50 px-2.5 py-2 text-sm"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      SKU {item.sku} · qty {item.qty} · {item.status}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-600">No order on this case.</p>
          )}
        </section>

        <p className="text-[11px] text-slate-400">
          {ctx.source === "mock"
            ? "Mock CRM / order data. Live connectors stay off until CRM_API_URL and OMS_API_URL are set."
            : "Loaded from live connectors."}
        </p>
      </div>
    </aside>
  );
}

export function SprinklrCaseChrome({
  ctx,
  switcher,
}: {
  ctx: CaseContext;
  switcher?: ReactNode;
}) {
  return (
    <div className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220] shadow-xl">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-300">
        <span>Sprinklr Service · Case #{ctx.caseNumber}</span>
        <span>RECORD_PAGE</span>
      </div>
      {switcher ? <div className="border-t border-white/10 px-3 py-2">{switcher}</div> : null}
      <div className="grid min-h-[480px] flex-1 bg-[#f3f6f9] lg:grid-cols-[1fr_380px]">
        <div className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Conversation
          </p>
          <p className="mt-1 text-base font-semibold text-[#0b1220]">{ctx.subject}</p>
          <div className="mt-4 space-y-3">
            {ctx.thread.map((line, i) => (
              <div
                key={`${line.at}-${i}`}
                className={`max-w-[36rem] rounded-xl px-3 py-2.5 text-sm ${
                  line.from === "customer"
                    ? "bg-white text-[#0b1220] shadow-sm"
                    : "ml-6 bg-[#e6f8fd] text-[#0b1220]"
                }`}
              >
                <p className="text-xs text-slate-500">
                  {line.author} · {line.at}
                </p>
                <p className="mt-1 leading-6">{line.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-[420px] border-t border-slate-200 lg:border-t-0">
          <CaseSidekickPanel ctx={ctx} />
        </div>
      </div>
    </div>
  );
}
