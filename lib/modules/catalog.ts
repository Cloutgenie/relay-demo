export type ModuleId =
  | "connect"
  | "autofill"
  | "sidekick"
  | "boards"
  | "export"
  | "experiences"
  | "publish"
  | "rights"
  | "sla"
  | "assign"
  | "profiles"
  | "access"
  | "webhooks"
  | "listening";

export type ModuleMeta = {
  id: ModuleId;
  href: string;
  title: string;
  does: string;
  status: "ready" | "attention" | "gated";
};

export const MODULES: ModuleMeta[] = [
  {
    id: "connect",
    href: "/app/connect",
    title: "Connect",
    does: "Link one Sprinklr workspace so Relay can work for you.",
    status: "ready",
  },
  {
    id: "autofill",
    href: "/app",
    title: "Taxonomy Autofill",
    does: "Fills Category, Brand, and Campaign on incoming messages.",
    status: "attention",
  },
  {
    id: "sidekick",
    href: "/app/sidekick",
    title: "Case Sidekick",
    does: "Shows order, SKU, and customer context on the care case.",
    status: "ready",
  },
  {
    id: "boards",
    href: "/app/boards",
    title: "Board Factory",
    does: "Stamps a golden listening board for a brand and market.",
    status: "ready",
  },
  {
    id: "export",
    href: "/app/export",
    title: "Client Pack Exporter",
    does: "Builds a reporting snapshot you can send to a client.",
    status: "ready",
  },
  {
    id: "experiences",
    href: "/app/experiences",
    title: "Experience-ID Finder",
    does: "Finds boards and experiences by name, so you do not hunt IDs.",
    status: "ready",
  },
  {
    id: "publish",
    href: "/app/publish",
    title: "Publish QA Gate",
    does: "Checks a draft before anyone hits approve.",
    status: "attention",
  },
  {
    id: "rights",
    href: "/app/rights",
    title: "Asset Rights Desk",
    does: "Flags expired or off-brand assets before they go live.",
    status: "attention",
  },
  {
    id: "sla",
    href: "/app/sla",
    title: "SLA Snitch",
    does: "Tells you when a case is aging or a publish failed.",
    status: "attention",
  },
  {
    id: "assign",
    href: "/app/assign",
    title: "Smart Assign",
    does: "Routes work by language, VIP, or product on the profile.",
    status: "ready",
  },
  {
    id: "profiles",
    href: "/app/profiles",
    title: "Profile Enricher",
    does: "Pushes and pulls CRM fields, plus suppression sync.",
    status: "ready",
  },
  {
    id: "access",
    href: "/app/access",
    title: "Access Auditor",
    does: "Lists roles, account access, and stale keys in plain English.",
    status: "ready",
  },
  {
    id: "webhooks",
    href: "/app/webhooks",
    title: "Webhook Flight Recorder",
    does: "Keeps a log of what Sprinklr sent us.",
    status: "ready",
  },
  {
    id: "listening",
    href: "/app/listening",
    title: "Listening Spike Watch",
    does: "Watches mention spikes — needs Sprinklr Support to turn on.",
    status: "gated",
  },
];
