"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { href: "/app/connect", label: "Connect" },
  { href: "/app", label: "Home" },
  { href: "/app/queue", label: "Needs review" },
  { href: "/app/sidekick", label: "Case Sidekick" },
];

const MORE = [
  { href: "/app/boards", label: "Board Factory" },
  { href: "/app/export", label: "Client Pack" },
  { href: "/app/experiences", label: "Experience Finder" },
  { href: "/app/publish", label: "Publish QA" },
  { href: "/app/rights", label: "Asset Rights" },
  { href: "/app/sla", label: "SLA Snitch" },
  { href: "/app/assign", label: "Smart Assign" },
  { href: "/app/profiles", label: "Profiles" },
  { href: "/app/access", label: "Access Auditor" },
  { href: "/app/webhooks", label: "Flight Recorder" },
  { href: "/app/listening", label: "Listening" },
  { href: "/app/setup", label: "Setup checklist" },
  { href: "/app/rules", label: "Rules" },
  { href: "/app/audit", label: "History" },
];

export function SideNav({ queueCount }: { queueCount: number }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <nav className="space-y-0.5 px-2 py-3">
        {PRIMARY.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.href === "/app/queue" && queueCount > 0 ? (
                <span className="rounded-full bg-[#faa21b] px-1.5 text-[11px] font-semibold text-[#2a1a00]">
                  {queueCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <p className="px-4 pt-1 text-[11px] uppercase tracking-wider text-slate-500">
        More
      </p>
      <nav className="space-y-0.5 px-2 py-2 pb-6">
        {MORE.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-1.5 text-sm ${
              pathname.startsWith(item.href)
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function MobileNav({ queueCount }: { queueCount: number }) {
  return (
    <nav className="flex max-w-[60vw] gap-1 overflow-x-auto lg:hidden">
      {PRIMARY.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
        >
          {item.label}
          {item.href === "/app/queue" && queueCount > 0 ? ` (${queueCount})` : ""}
        </Link>
      ))}
    </nav>
  );
}
